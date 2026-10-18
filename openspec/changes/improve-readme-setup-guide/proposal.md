# Proposal

## Why

El README actual solo explica la ejecución web básica y obliga a descubrir por separado las guías de Docker y escritorio. Además, presupone que Node.js y npm ya están disponibles, lo que dificulta la puesta en marcha para personas nuevas en el proyecto.

## What Changes

- Reorganizar el README como guía principal de entrada al proyecto, con una descripción breve de las tres formas de uso: web local, Docker y aplicación de escritorio.
- Incorporar requisitos previos claros y una explicación de cómo instalar Node.js 22, comprobar `node` y `npm`, y entender que npm se instala junto con Node.js.
- Consolidar los comandos esenciales de `docs/docker.md` y `docs/desktop.md` sin duplicar todo su contenido, enlazando las guías detalladas para diagnóstico, empaquetado y limpieza.
- Explicar desde qué directorio se ejecuta cada comando y distinguir las dependencias del proyecto web de las dependencias específicas de `desktop/`.
- Mantener las instrucciones de edición de cartas, incorporación de barajas y pruebas, corrigiendo referencias o requisitos que ya no reflejen el estado actual del repositorio.

## Capabilities

### New Capabilities

Ninguna. Es un cambio exclusivamente documental.

### Modified Capabilities

Ninguna. No cambia el comportamiento del juego ni de sus distribuciones.

## Impact

- Se modificará únicamente `README.md`.
- `docs/docker.md`, `docs/desktop.md` y `docs/verification.md` seguirán siendo las referencias detalladas y serán enlazadas desde el README.
- No se modificarán código, pruebas, formatos de baraja, dependencias ni artefactos de distribución.
