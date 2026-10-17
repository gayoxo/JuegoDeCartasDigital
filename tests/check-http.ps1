param([string]$BaseUrl = "http://127.0.0.1:4173/")

$ErrorActionPreference = "Stop"
$base = $BaseUrl.TrimEnd("/")
$deck = Invoke-RestMethod "$base/data/decks/rally-cars.json"
$paths = @(
    "index.html",
    "styles.css",
    "app.js",
    "modules/deck.js",
    "modules/game-engine.js",
    "data/decks/rally-cars.json",
    $deck.cover,
    $deck.back,
    $deck.rulesImage
) + @($deck.cards.image)

$failures = @()
foreach ($path in ($paths | Sort-Object -Unique)) {
    try {
        $response = Invoke-WebRequest -UseBasicParsing "$base/$path"
        if ($response.StatusCode -ne 200 -or $response.RawContentLength -le 0) {
            $failures += "$path ($($response.StatusCode), $($response.RawContentLength) bytes)"
        }
    }
    catch {
        $failures += "$path ($($_.Exception.Message))"
    }
}

if ($failures.Count) {
    throw "HTTP verification failed: $($failures -join '; ')"
}

Write-Output "HTTP verification passed for $($paths.Count) references ($(@($paths | Sort-Object -Unique).Count) unique resources)."
