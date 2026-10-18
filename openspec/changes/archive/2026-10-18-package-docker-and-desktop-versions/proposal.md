# Proposal

## Why

El juego ya funciona como aplicación web estática, pero su ejecución exige preparar manualmente un servidor HTTP y no ofrece una experiencia instalable. Se necesitan distribuciones reproducibles para ejecutarlo como servicio Docker y como aplicación de escritorio en una ventana independiente.

## What Changes

- Añadir una imagen Docker autocontenida que sirva el contenido de `dist/`, incluya comprobación de salud y pueda ejecutarse mediante Docker o Docker Compose.
- Añadir una aplicación de escritorio Electron que reutilice exactamente los archivos web existentes, abra una única ventana nativa y no dependa de un servidor ni de acceso a Internet durante la partida.
- Configurar el empaquetado de escritorio para generar una distribución portable de Windows, manteniendo separado el código específico del contenedor de ventana.
- Añadir comprobaciones automatizadas para la imagen Docker, el proceso principal de escritorio y la integridad de los recursos empaquetados.
- Documentar construcción, ejecución, configuración, diagnóstico y limpieza de ambas distribuciones.

## Capabilities

### New Capabilities

- `container-distribution`: Construcción y ejecución reproducible del juego como servicio web autocontenido en Docker.
- `desktop-distribution`: Ejecución y empaquetado del juego como aplicación de escritorio en una ventana nativa independiente.

### Modified Capabilities

Ninguna; las distribuciones reutilizan sin cambiar los requisitos funcionales de `game-interface`, `deck-catalog` y `top-trumps-gameplay`.

## Impact

- Añade `Dockerfile`, configuración de servidor estático, Compose, archivos de empaquetado Electron y documentación operativa.
- Introduce Node.js y Electron únicamente como herramientas de desarrollo/empaquetado de escritorio; el juego web y la imagen Docker de ejecución permanecen sin dependencias JavaScript instaladas.
- Aumenta el tamaño de los artefactos de escritorio por incluir un runtime Chromium.
- No publica imágenes en registros ni distribuye ejecutables fuera del repositorio; esas operaciones requerirán una decisión posterior.
