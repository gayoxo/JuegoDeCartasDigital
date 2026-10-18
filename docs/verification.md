# Verificación de distribuciones

Fecha de la ejecución: 18 de octubre de 2026.

## Versiones

- Docker client/server: 29.7.2.
- Node.js de pruebas: 22.23.3.
- npm: 10.9.9.
- Electron: 44.9.0 (fijado exactamente en `desktop/package-lock.json`).
- electron-builder: 26.15.3 (fijado exactamente en `desktop/package-lock.json`).
- Imagen web: `caddy:2-alpine`, resuelta por Docker mediante digest durante la construcción.

## Comandos y resultados

| Comprobación | Comando | Resultado |
| --- | --- | --- |
| Pruebas web | `docker run --rm -v "${PWD}:/workspace:ro" -w /workspace node:22-alpine npm test` | 18/18 pasan |
| Unidad y seguridad Electron | `docker run --rm -v "${PWD}:/workspace:ro" -w /workspace/desktop node:22-alpine npm test` | 9/9 pasan |
| Imagen y recursos HTTP | `./tests/docker-integration.ps1` | `healthy`, UID 1001, 41/41 recursos |
| Interfaz Docker | Playwright `python tests/e2e.py` contra `baraja-rally:local` en el puerto 4173 | 5/5 escenarios pasan |
| Compose | `docker compose config --quiet` | configuración válida |
| Electron sin red | `docker run --rm --network none --cap-add SYS_ADMIN baraja-rally-electron-smoke` | título, baraja de 32 cartas y cierre limpio confirmados |
| Portable Windows | `npm run package:win` / electron-builder en entorno compatible | `Baraja-Rally-1.0.0-portable-x64.exe`, 100.951.544 bytes |
| Recursos del portable | inspección de `win-unpacked/resources/dist` | manifiesto de 32 cartas y módulos requeridos presentes |
| Arranque portable | `RALLY_SMOKE_TEST=1` y `Start-Process ... -Wait` en Windows sin Node instalado | código de salida 0 |
| OpenSpec | `./.openspec-tool/openspec.cmd validate package-docker-and-desktop-versions --strict` | cambio válido |

Durante `npm ci`, npm informó de 8 vulnerabilidades moderadas en dependencias transitivas de desarrollo/empaquetado. No forman parte del runtime web servido por Caddy. Deben revisarse al actualizar Electron o electron-builder, evitando aplicar automáticamente una actualización mayor incompatible.

Los artefactos bajo `desktop/release/` son locales y están ignorados por Git. Antes de publicarlos se debe revisar su procedencia, calcular hashes y decidir el proceso de firma.

