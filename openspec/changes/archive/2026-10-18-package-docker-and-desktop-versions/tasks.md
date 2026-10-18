# Tasks

## 1. Distribución Docker

- [x] 1.1 Añadir Dockerfile, `.dockerignore` y configuración Caddy para servir `dist/` en el puerto 8080 como usuario no raíz, y verificar que la imagen se construye desde el contexto limpio del repositorio.
- [x] 1.2 Añadir Docker Compose con puerto `${RALLY_PORT:-8080}`, sistema de archivos de solo lectura, almacenamiento temporal mínimo y política de reinicio adecuada; verificar configuración predeterminada y personalizada con `docker compose config`.
- [x] 1.3 Añadir salud HTTP y una prueba de integración que arranque el contenedor, espere estado saludable, compruebe usuario efectivo y solicite HTML, JSON, módulos e imágenes; verificar que la prueba limpia siempre los recursos creados.
- [x] 1.4 Documentar en `docs/docker.md` construcción, ejecución directa, Compose, cambio de puerto, diagnóstico, parada y limpieza; verificar que los comandos documentados funcionan en orden.

## 2. Distribución de escritorio

- [x] 2.1 Crear el proyecto `desktop/` con versiones exactas de Electron y electron-builder, scripts de desarrollo/prueba/empaquetado y lockfile; verificar una instalación reproducible con `npm ci`.
- [x] 2.2 Implementar el protocolo local `rally://` con resolución confinada a `dist/` y pruebas para rutas válidas, codificadas y de escape; verificar que ninguna resolución sale del directorio de recursos.
- [x] 2.3 Implementar la ventana principal con aislamiento de contexto, sandbox, Node deshabilitado, ciclo de vida nativo y bloqueo de permisos, ventanas y navegación externa; verificar sus opciones y políticas mediante pruebas automatizadas.
- [x] 2.4 Añadir un smoke test que inicie Electron, cargue el juego sin red y confirme título, baraja preparada y ausencia de procesos auxiliares tras cerrar; verificarlo en un entorno gráfico o pantalla virtual compatible.
- [x] 2.5 Configurar y ejecutar electron-builder para producir una distribución portable Windows x64 con `dist/` incluido; verificar que el artefacto existe, contiene los recursos esperados y puede iniciarse sin Node.js instalado.
- [x] 2.6 Documentar en `docs/desktop.md` requisitos, desarrollo, pruebas, empaquetado, ubicación del artefacto, actualización de `dist/` y diagnóstico, incluyendo la advertencia aplicable a binarios sin firma; verificar los comandos documentados.

## 3. Integración

- [x] 3.1 Ejecutar las pruebas web existentes contra la versión Docker y la versión de escritorio, y verificar que ambas reutilizan el mismo manifiesto de 32 cartas y los mismos módulos de motor.
- [x] 3.2 Ejecutar todas las pruebas del proyecto y la validación OpenSpec estricta, y registrar comandos, versiones y resultados en la entrega.

## Workflow follow-up

- Revisar los artefactos locales antes de decidir si se publica la imagen o se firma y distribuye el ejecutable.
- Sincronizar y archivar el cambio después de aceptar ambas distribuciones.
