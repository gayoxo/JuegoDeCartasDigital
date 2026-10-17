# Distribución Docker

## Requisitos

Docker Desktop debe estar iniciado. Todos los comandos siguientes se ejecutan desde la raíz del repositorio.

## Construir y ejecutar directamente

```powershell
docker build --tag baraja-rally:local .
docker run --detach --name baraja-rally --publish 8080:8080 --read-only --tmpfs /config:uid=1001,gid=1001,mode=0700 --tmpfs /data:uid=1001,gid=1001,mode=0700 --tmpfs /tmp:uid=1001,gid=1001,mode=1777 baraja-rally:local
docker inspect --format '{{.State.Health.Status}}' baraja-rally
```

Abre <http://localhost:8080>. Para detener y retirar esta ejecución:

```powershell
docker rm --force baraja-rally
```

## Docker Compose

El puerto predeterminado es 8080:

```powershell
docker compose up --detach --build
docker compose ps
```

Para elegir otro puerto sin reconstruir la imagen:

```powershell
$env:RALLY_PORT = "8090"
docker compose up --detach
```

La aplicación estará en <http://localhost:8090>. En la misma terminal, detén y elimina los recursos de Compose:

```powershell
docker compose down
Remove-Item Env:RALLY_PORT -ErrorAction SilentlyContinue
```

## Diagnóstico y prueba integral

```powershell
docker compose logs rally
docker compose config
./tests/docker-integration.ps1
```

La prueba construye una imagen temporal, espera el estado saludable, comprueba que el UID no sea cero y solicita el HTML, JSON, módulos e imágenes. Su bloque `finally` elimina el contenedor y la imagen de prueba incluso si falla.

## Limpieza local

Tras ejecutar `docker compose down`, la imagen local se puede retirar sin tocar el código fuente:

```powershell
docker image rm baraja-rally:local
```

