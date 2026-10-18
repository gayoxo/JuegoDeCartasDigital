# Distribución de escritorio

La aplicación Electron reutiliza directamente `dist/`: no mantiene otra copia de cartas, estilos ni motor del juego. La distribución funciona sin servidor y sin conexión a Internet.

## Requisitos

- Windows 10/11 x64 para ejecutar el portable.
- Para desarrollo nativo: Node.js 22 y npm.
- Alternativamente, Docker Desktop para ejecutar las pruebas Linux aisladas y el empaquetado cruzado usado por el proyecto.

## Instalar y abrir en desarrollo

Desde `desktop/`:

```powershell
npm ci
npm start
```

La ventana carga `rally://app/index.html`. El renderizador no tiene integración Node, preload ni permisos del sistema.

## Pruebas

Pruebas unitarias de rutas y políticas de seguridad:

```powershell
cd desktop
npm test
cd ..
```

Smoke test gráfico reproducible y sin red:

```powershell
docker build --file desktop/Dockerfile.smoke --tag baraja-rally-electron-smoke .
docker run --rm --network none --cap-add SYS_ADMIN baraja-rally-electron-smoke
```

`SYS_ADMIN` se concede solo al contenedor efímero de pruebas porque Chromium necesita crear su namespace de sandbox bajo Docker Desktop. La aplicación mantiene `sandbox: true`, y el contenedor no dispone de red.

## Crear el portable Windows x64

En Windows con Node instalado:

```powershell
cd desktop
npm ci
npm run package:win
cd ..
```

El resultado se escribe en:

```text
desktop/release/Baraja-Rally-1.0.0-portable-x64.exe
```

También queda `desktop/release/win-unpacked/` para inspección. Ambos son artefactos locales ignorados por Git.

## Actualizar el juego empaquetado

Modifica o regenera primero los recursos de `dist/` y ejecuta las pruebas web. Después vuelve a ejecutar `npm run package:win`. La regla `extraResources` copia el `dist/` vigente al paquete; no edites la copia de `release/` a mano.

Para cambiar las cartas de una baraja compatible, actualiza su JSON y sus imágenes en `dist/`, preservando el esquema documentado en el proyecto, y vuelve a empaquetar.

## Diagnóstico

- Ventana en blanco: ejecuta `npm test` y confirma que `dist/index.html` y `dist/data/decks/rally-cars.json` existen.
- Error al instalar: elimina solo `desktop/node_modules/` y repite `npm ci`; no modifiques el lockfile manualmente.
- Fallo al empaquetar Windows desde Linux: usa Windows o un contenedor con las herramientas de Windows/Wine compatibles con electron-builder.
- Fallo del smoke en Docker por namespaces: utiliza exactamente `--cap-add SYS_ADMIN`; no desactives el sandbox de Electron.
- Recursos antiguos: elimina `desktop/release/` y vuelve a ejecutar el empaquetado tras actualizar `dist/`.

## Binario sin firma

El portable generado localmente no está firmado. Windows SmartScreen puede mostrar una advertencia de reputación; verifica la procedencia y el hash antes de ejecutarlo. La firma y la publicación quedan fuera de este cambio y deben revisarse antes de distribuir el binario.

