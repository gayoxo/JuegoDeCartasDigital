param(
    [int]$Port = 4173,
    [string]$Directory = "dist"
)

$ErrorActionPreference = "Stop"
$root = [IO.Path]::GetFullPath((Join-Path (Get-Location) $Directory))
$server = Get-Command "jwebserver" -ErrorAction SilentlyContinue

if (-not $server) {
    throw "No se encontró jwebserver. Instala un JDK 18+ o sirve la carpeta dist con tu servidor estático habitual."
}

Write-Output "Serving $root at http://127.0.0.1:$Port/"
& $server.Source -p $Port -d $root -o info
