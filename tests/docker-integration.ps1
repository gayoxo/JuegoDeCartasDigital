param(
    [int]$Port = 49181,
    [string]$Image = "baraja-rally:integration-test"
)

$ErrorActionPreference = "Stop"
$container = "baraja-rally-test-$([Guid]::NewGuid().ToString('N').Substring(0, 10))"

try {
    docker build --tag $Image .
    if ($LASTEXITCODE -ne 0) { throw "No se pudo construir $Image" }

    docker run --detach --name $container --publish "127.0.0.1:${Port}:8080" --read-only `
        --tmpfs /config:uid=1001,gid=1001,mode=0700 `
        --tmpfs /data:uid=1001,gid=1001,mode=0700 `
        --tmpfs /tmp:uid=1001,gid=1001,mode=1777 $Image | Out-Null
    if ($LASTEXITCODE -ne 0) { throw "No se pudo iniciar $container" }

    $health = ""
    for ($attempt = 0; $attempt -lt 30; $attempt++) {
        $health = docker inspect --format '{{.State.Health.Status}}' $container
        if ($health -eq "healthy") { break }
        if ($health -eq "unhealthy") { break }
        Start-Sleep -Seconds 1
    }
    if ($health -ne "healthy") {
        docker logs $container
        throw "El contenedor no alcanzó estado saludable (estado: $health)"
    }

    $uid = (docker exec $container id -u).Trim()
    if ($uid -eq "0" -or -not $uid) { throw "El proceso se ejecuta como root o no pudo inspeccionarse" }

    & "$PSScriptRoot/check-http.ps1" -BaseUrl "http://127.0.0.1:$Port/"
    if ($LASTEXITCODE -ne 0) { throw "Falló la comprobación HTTP" }

    Write-Output "Docker integration passed (healthy, uid=$uid, port=$Port)."
}
finally {
    docker rm --force $container 2>$null | Out-Null
    docker image rm --force $Image 2>$null | Out-Null
}

