# Design

## Context

La aplicación entregada en `dist/` es estática, usa módulos ES y carga su manifiesto por `fetch`, por lo que necesita un origen web válido. El repositorio no requiere dependencias para jugar, pero el empaquetado de escritorio sí necesita un runtime de navegador. Docker está disponible en el entorno del proyecto y ya existe una imagen local de Caddy; Node.js se usa actualmente mediante contenedor para las pruebas.

## Goals / Non-Goals

**Goals:**

- Producir dos distribuciones que consuman el mismo `dist/` sin bifurcar la lógica del juego.
- Mantener la imagen de ejecución pequeña, sin privilegios y observable mediante salud HTTP.
- Aislar el renderizador de escritorio y resolver recursos locales con semántica web compatible con módulos y `fetch`.
- Fijar versiones y comandos suficientes para reproducir los artefactos.

**Non-Goals:**

- Publicar la imagen en un registro, firmar ejecutables o crear un instalador con actualizaciones automáticas.
- Mantener versiones separadas de cartas, CSS o motor para Docker y escritorio.
- Añadir integración con sistema de archivos, menús avanzados, notificaciones o persistencia nativa.
- Soportar plataformas de escritorio distintas de Windows en el primer paquete distribuible, aunque el modo de desarrollo podrá funcionar en otras plataformas compatibles con Electron.

## Decisions

### 1. Caddy como servidor de la imagen Docker

La imagen se basará en `caddy:2-alpine` y servirá `dist/` en el puerto interno 8080 con compresión y cabeceras de seguridad básicas. Se ejecutará como el usuario no privilegiado disponible en la imagen. Compose publicará `${RALLY_PORT:-8080}:8080`, marcará el sistema de archivos como solo lectura y proporcionará almacenamiento temporal únicamente donde el runtime lo requiera.

Se elige Caddy porque la imagen ya está disponible, ofrece configuración pequeña y sirve correctamente tipos MIME de módulos ES y JSON. Se descartan un servidor Node —añadiría runtime y dependencias innecesarias— y Nginx —requeriría más ajuste para ejecutarse sin privilegios y con raíz de solo lectura—.

### 2. Salud basada en el documento principal

El `HEALTHCHECK` solicitará `http://127.0.0.1:8080/index.html` mediante la herramienta incluida en la imagen. Una respuesta fallida o vacía producirá estado no saludable. La comprobación no dependerá de Internet ni del puerto publicado por el host.

### 3. Electron como contenedor de ventana

La versión de escritorio vivirá en `desktop/` con su propio `package.json`, proceso principal CommonJS y configuración de `electron-builder`. El proceso principal abrirá una sola `BrowserWindow`; la lógica funcional seguirá en `dist/`.

Electron se elige porque ejecuta sin cambios los módulos ES, diálogos y CSS ya verificados. Se descartan WebView heredado, que no soporta de forma fiable estas APIs, y una reescritura nativa, que duplicaría interfaz y motor.

### 4. Protocolo local privilegiado y seguro

Antes de que Electron esté listo se registrará un esquema estándar y seguro `rally://`. Un manejador resolverá solicitudes únicamente dentro de `dist/`, normalizará rutas, rechazará escapes y devolverá archivos mediante las APIs de red de Electron. Así `fetch`, módulos y rutas relativas funcionan sin servidor HTTP ni excepciones inseguras para `file://`.

La ventana usará `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true` y ningún preload porque la aplicación no necesita capacidades nativas. Se denegarán nuevas ventanas, permisos y navegaciones fuera de `rally://app/`.

### 5. Empaquetado portable de Windows

`electron-builder` generará un destino `portable` para Windows x64 bajo `desktop/release/`. Los recursos de `dist/` se incorporarán con `extraResources`, mientras el código del proceso principal permanecerá en el archivo de aplicación. Las versiones de Electron y del empaquetador se fijarán exactamente en el lockfile.

El artefacto portable evita pasos de instalación y permisos de administrador. La firma y los instaladores quedan fuera de alcance y se documentará la posible advertencia de reputación de Windows para binarios sin firmar.

### 6. Pruebas por capas

- La imagen Docker se construirá, arrancará y comprobará por HTTP, salud y usuario efectivo.
- El proceso principal tendrá pruebas de resolución de rutas y configuración de seguridad extraídas a funciones sin dependencia de una pantalla.
- Un smoke test de Electron comprobará que la ventana carga `rally://app/index.html`; cuando no haya entorno gráfico, se ejecutará con pantalla virtual dentro de un contenedor compatible.
- El empaquetado se considerará verificado cuando `electron-builder` genere el artefacto portable y se compruebe su presencia y contenido esperado.

## Risks / Trade-offs

- [Electron aumenta mucho el tamaño del artefacto] → Mantener un único destino portable y excluir dependencias y archivos de desarrollo innecesarios.
- [La construcción Windows desde Linux puede necesitar Wine o descargas adicionales] → Documentar el entorno compatible y permitir construir en Windows; las pruebas de configuración no dependerán del empaquetado cruzado.
- [Una versión nueva de Electron puede cambiar APIs de protocolo] → Fijar versiones exactas y cubrir resolución y arranque con pruebas.
- [Caddy puede necesitar escribir datos de runtime] → Desactivar funciones innecesarias y montar `tmpfs` solo para directorios explícitos en Compose.
- [Un error de normalización podría exponer archivos fuera de `dist/`] → Centralizar la resolución, comparar rutas canónicas y probar escapes codificados y rutas válidas.

## Migration Plan

1. Añadir y probar Dockerfile, Caddyfile, `.dockerignore` y Compose sin alterar `dist/`.
2. Añadir el proyecto Electron y pruebas de seguridad/rutas.
3. Instalar dependencias reproducibles y generar el lockfile del escritorio.
4. Ejecutar smoke test de ventana y construir el paquete portable de Windows en un entorno compatible.
5. Documentar ambos flujos y añadir comandos de verificación y limpieza.

Cada distribución es aditiva. Para revertirla basta con eliminar sus archivos de empaquetado y artefactos generados; el juego web permanece intacto.
