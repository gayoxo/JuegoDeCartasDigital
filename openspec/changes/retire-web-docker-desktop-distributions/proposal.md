# Proposal

## Why

Una vez validada la aplicación Android, mantener simultáneamente distribuciones web local, Docker y Electron añade dependencias, documentación y rutas de prueba que ya no responden al objetivo móvil de la rama `movilmain`. Retirarlas reduce el mantenimiento y deja Android como único producto distribuible, sin duplicar el contenido web que Capacitor necesita internamente.

## What Changes

- **BREAKING**: retirar la imagen y el servicio Docker, incluidos Compose, Caddy, comprobaciones y documentación operativa.
- **BREAKING**: retirar la aplicación Electron y su empaquetado portable de Windows, incluidas dependencias, scripts, pruebas y documentación.
- **BREAKING**: retirar el servidor web local y presentar el APK Android como única forma soportada de ejecutar el producto final.
- Conservar `dist/` como implementación y conjunto de recursos internos que Capacitor empaqueta en el APK, además de conservar sus pruebas unitarias y herramientas de mantenimiento de barajas.
- Reescribir las instrucciones generales para instalación, construcción, firma y uso en Android, eliminando referencias a métodos ya no soportados.
- Ejecutar la limpieza únicamente después de que los dos cambios Android anteriores estén aplicados y validados.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `container-distribution`: se retira íntegramente porque Docker deja de ser una distribución soportada.
- `desktop-distribution`: se retira íntegramente porque Electron/Windows deja de ser una distribución soportada.

## Impact

- Se eliminarán `Dockerfile`, `compose.yaml`, `Caddyfile`, `.dockerignore`, las comprobaciones Docker y su documentación.
- Se eliminarán el directorio `desktop/`, scripts y dependencias Electron, artefactos de empaquetado y documentación de escritorio.
- Se eliminará la ejecución mediante servidor local y se actualizarán README, scripts npm, `.gitignore` y pruebas para el flujo Android.
- `dist/`, el catálogo JSON, las imágenes segmentadas, el motor, las pruebas del motor/catálogo y las herramientas de extracción seguirán en el repositorio porque son entradas de la aplicación Android.
- Al archivar, las capacidades `container-distribution` y `desktop-distribution` se retirarán del catálogo principal de OpenSpec.
