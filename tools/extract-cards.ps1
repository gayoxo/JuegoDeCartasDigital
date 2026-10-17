param(
    [string]$OutputDirectory = "dist/assets/cards"
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$output = Join-Path $root $OutputDirectory
New-Item -ItemType Directory -Force -Path $output | Out-Null

$sheets = @{
    s1 = Join-Path $root "COCHES RALLY 1 (Custom).jpg"
    s2 = Join-Path $root "COCHES RALLY 2 (Custom).jpg"
    s3 = Join-Path $root "COCHES RALLY 3 (Custom).jpg"
    s4 = Join-Path $root "COCHES RALLY 4 (Custom).jpg"
}

$expectedDimensions = @{
    s1 = @(919, 1300)
    s2 = @(919, 1300)
    s3 = @(919, 1300)
    s4 = @(919, 1300)
}

$sourceHashes = @{}
foreach ($sheetName in $sheets.Keys) {
    $sheetPath = $sheets[$sheetName]
    if (-not (Test-Path -LiteralPath $sheetPath -PathType Leaf)) {
        throw "Missing source sheet: $sheetPath"
    }
    $sourceHashes[$sheetName] = (Get-FileHash -LiteralPath $sheetPath -Algorithm SHA256).Hash
    $image = [System.Drawing.Image]::FromFile($sheetPath)
    try {
        $expectedWidth, $expectedHeight = $expectedDimensions[$sheetName]
        if ($image.Width -ne $expectedWidth -or $image.Height -ne $expectedHeight) {
            throw "Unexpected dimensions for $sheetName. Expected ${expectedWidth}x${expectedHeight}, found $($image.Width)x$($image.Height)."
        }
    }
    finally {
        $image.Dispose()
    }
}

$crops = @(
    @("cover", "s1", 17, 22, 257, 389),
    @("1a", "s1", 319, 19, 273, 395), @("1b", "s1", 634, 14, 263, 401),
    @("1c", "s1", 20, 434, 263, 395), @("1d", "s1", 320, 433, 271, 395), @("2a", "s1", 634, 434, 263, 395),
    @("2b", "s1", 20, 850, 263, 397), @("2c", "s1", 320, 850, 271, 397), @("2d", "s1", 634, 850, 263, 397),

    @("3a", "s2", 21, 28, 266, 407), @("back", "s2", 336, 32, 264, 405), @("instructions", "s2", 640, 27, 257, 410),
    @("3b", "s2", 24, 466, 265, 396), @("3c", "s2", 329, 466, 263, 396), @("3d", "s2", 640, 466, 257, 396),
    @("4a", "s2", 24, 888, 266, 389), @("4b", "s2", 329, 888, 263, 389), @("4c", "s2", 640, 888, 257, 389),

    @("4d", "s3", 20, 14, 263, 418), @("5a", "s3", 329, 14, 266, 418), @("5b", "s3", 639, 14, 261, 418),
    @("5c", "s3", 20, 442, 263, 390), @("5d", "s3", 329, 442, 266, 390), @("6a", "s3", 639, 442, 261, 390),
    @("6b", "s3", 20, 855, 263, 392), @("6c", "s3", 329, 855, 266, 392), @("6d", "s3", 639, 855, 261, 392),

    @("7a", "s4", 20, 40, 263, 397), @("7b", "s4", 329, 40, 266, 397), @("7c", "s4", 639, 40, 261, 397),
    @("7d", "s4", 20, 465, 263, 390), @("8a", "s4", 329, 465, 266, 390), @("8b", "s4", 639, 465, 261, 390),
    @("8c", "s4", 20, 890, 263, 390), @("8d", "s4", 329, 890, 266, 390)
)

foreach ($crop in $crops) {
    $name, $sheet, $x, $y, $width, $height = $crop
    $source = [System.Drawing.Bitmap]::FromFile($sheets[$sheet])
    try {
        if ($x -lt 0 -or $y -lt 0 -or ($x + $width) -gt $source.Width -or ($y + $height) -gt $source.Height) {
            throw "Crop '$name' exceeds the bounds of sheet '$sheet'."
        }
        $rect = New-Object System.Drawing.Rectangle($x, $y, $width, $height)
        $bitmap = $source.Clone($rect, $source.PixelFormat)
        try {
            $destination = Join-Path $output "$name.jpg"
            $bitmap.Save($destination, [System.Drawing.Imaging.ImageFormat]::Jpeg)
        }
        finally {
            $bitmap.Dispose()
        }
    }
    finally {
        $source.Dispose()
    }
}

$expectedNames = @($crops | ForEach-Object { "$($_[0]).jpg" } | Sort-Object)
$actualNames = @(Get-ChildItem -LiteralPath $output -File -Filter "*.jpg" | Select-Object -ExpandProperty Name | Sort-Object)
if ((Compare-Object $expectedNames $actualNames).Count -ne 0) {
    throw "The output directory does not contain exactly the expected crop set."
}

foreach ($sheetName in $sheets.Keys) {
    $currentHash = (Get-FileHash -LiteralPath $sheets[$sheetName] -Algorithm SHA256).Hash
    if ($currentHash -ne $sourceHashes[$sheetName]) {
        throw "Source sheet '$sheetName' changed during extraction."
    }
}

$cardCount = @($expectedNames | Where-Object { $_ -match '^\d[a-d]\.jpg$' }).Count
if ($cardCount -ne 32 -or $expectedNames.Count -ne 35) {
    throw "Expected 32 cards and 3 supporting images, found $cardCount cards and $($expectedNames.Count - $cardCount) supporting images."
}

Write-Output "Extracted and verified 32 cards plus cover, back and instructions in $output"
