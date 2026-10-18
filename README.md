# Coches Rally

Adaptación web del juego clásico de cartas de características, construida con los escaneos de la baraja incluidos en la raíz del proyecto.

## Requisitos previos

Elige las herramientas según cómo quieras ejecutar el juego:

- **Android:** Node.js 22, npm, JDK 21 y Android Studio/SDK con Platform 36 y Build-Tools 36.0.0.
- **Web local:** JDK 18 o posterior para usar el servidor incluido, o cualquier servidor HTTP estático equivalente.
- **Pruebas:** Node.js 22, que ya incluye npm.
- **Docker:** Docker Desktop con Docker Compose; no necesita Node.js ni npm instalados en el equipo.
- **Aplicación de escritorio:** Windows 10/11 x64 para ejecutar el portable. Para desarrollo y empaquetado también necesitas Node.js 22 y npm.

### Instalar Node.js y npm

Descarga e instala Node.js 22 LTS desde [nodejs.org](https://nodejs.org/). El instalador oficial incluye npm, por lo que no hace falta instalarlo por separado. Cierra y vuelve a abrir PowerShell después de la instalación y comprueba ambos comandos:

```powershell
node --version
npm --version
```

El primer comando debe mostrar una versión `v22.x` y el segundo una versión de npm. Si PowerShell no reconoce alguno, revisa que Node.js se haya añadido a `PATH` durante la instalación.

## Inicio rápido

Salvo que se indique lo contrario, ejecuta los comandos desde la raíz del repositorio.

### Android

Instala las dependencias fijadas, sincroniza los recursos y genera el APK de depuración:

```powershell
npm ci
npm run android:build:debug
```

El APK instalable queda en `android/app/build/outputs/apk/debug/app-debug.apk`. Puedes instalarlo con:

```powershell
adb install -r ".\android\app\build\outputs\apk\debug\app-debug.apk"
```

La guía [Distribución Android](docs/android.md) explica el SDK, la sincronización, los iconos, la firma release, la prueba sin conexión y el diagnóstico.

### Web local

La web es estática, pero necesita servirse por HTTP para cargar el JSON de la baraja. Con un JDK 18 o posterior:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\tools\serve.ps1"
```

Después abre <http://127.0.0.1:4173/>. También puedes publicar `dist/` como raíz con cualquier servidor HTTP estático.

### Docker Compose

Con Docker Desktop iniciado, construye y arranca el servicio desde la raíz:

```powershell
docker compose up --detach --build
docker compose ps
```

Abre <http://localhost:8080>. La guía [Distribución Docker](docs/docker.md) explica el cambio de puerto, diagnóstico, parada y limpieza.

### Aplicación de escritorio en desarrollo

Instala las dependencias fijadas en el lockfile de `desktop/` y abre Electron:

```powershell
cd desktop
npm ci
npm start
```

Cuando cierres la ventana, vuelve a la raíz con `cd ..`. Consulta [Distribución de escritorio](docs/desktop.md) para el smoke test offline, seguridad y diagnóstico.

## Corregir los datos de una carta

La baraja se define en `dist/data/decks/rally-cars.json`. Busca la carta por su `id`, modifica únicamente el valor dentro de `values` y vuelve a ejecutar las pruebas. No hace falta regenerar las imágenes ni cambiar JavaScript.

Cada valor debe ser un número JSON, sin puntos de millares ni unidades: usa `4973`, no `"4.973 c.c."`. La interfaz toma la etiqueta y unidad de `stats`.

## Añadir otra baraja

1. Crea un JSON con `schemaVersion: 1`; puedes copiar `tests/fixtures/mini-deck.json` como ejemplo mínimo.
2. Asigna un `id` único y completa `name`, `cover`, `back` y `rulesImage`.
3. Declara al menos una entrada en `stats`. Cada una necesita `key`, `label`, `unit` y `direction`; usa `high` si gana el valor mayor o `low` si gana el menor.
4. Añade al menos dos cartas. Sus identificadores no pueden repetirse y `values` debe contener un número para cada clave declarada en `stats`.
5. Copia los activos bajo `dist/` y utiliza rutas relativas a esa carpeta.
6. Cambia la constante `deckUrl` de `dist/app.js` para que apunte al nuevo JSON.
7. Ejecuta las pruebas. El cargador rechaza la baraja antes de iniciar si encuentra un dato o activo inválido.

El motor recibe características y cartas ya validadas, por lo que no contiene nombres de coches ni claves de estadísticas específicas de esta baraja.

Para regenerar los recortes de la baraja incluida a partir de los JPG originales de la raíz:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\tools\extract-cards.ps1"
```

## Pruebas

### Web y motor del juego

Desde la raíz, el proyecto usa el ejecutor incluido en Node.js y no instala dependencias npm:

```powershell
npm test
```

Si no quieres instalar Node.js localmente y tienes Docker:

```powershell
docker run --rm -v "${PWD}:/workspace:ro" -w /workspace node:22-alpine npm test
```

### Aplicación de escritorio

Electron tiene dependencias propias fijadas en `desktop/package-lock.json`. Instálalas de forma reproducible y ejecuta sus pruebas desde ese directorio:

```powershell
cd desktop
npm ci
npm test
cd ..
```

Para generar el portable Windows x64, vuelve a ejecutar desde `desktop/`:

```powershell
cd desktop
npm ci
npm run package:win
cd ..
```

El ejecutable se genera en `desktop/release/Baraja-Rally-1.0.0-portable-x64.exe`. La carpeta `release/` es local y está ignorada por Git.

## Documentación detallada

- [Distribución Android](docs/android.md): entorno, APK debug/release, firma, instalación, prueba offline y diagnóstico.
- [Distribución Docker](docs/docker.md): construcción directa, Compose, puerto personalizado, salud, diagnóstico y limpieza.
- [Distribución de escritorio](docs/desktop.md): desarrollo Electron, smoke test offline, empaquetado, seguridad y resolución de fallos.
- [Verificación de distribuciones](docs/verification.md): versiones, comandos y resultados de la última batería completa registrada.

## Notas sobre los datos

Los 32 registros se transcribieron de los escaneos. Conviene contrastarlos con las cartas físicas; el JSON está pensado para poder corregirse manualmente sin modificar el juego.
