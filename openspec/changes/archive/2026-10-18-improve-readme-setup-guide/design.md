# Design

## Context

El README mezcla la descripción del juego, una única forma de ejecución web y tareas de mantenimiento de la baraja. Las distribuciones Docker y Electron se documentaron después en `docs/docker.md` y `docs/desktop.md`, y los resultados de referencia viven en `docs/verification.md`. La actualización debe ofrecer un recorrido inicial coherente sin convertir el README en una copia completa de esas guías.

## Goals / Non-Goals

**Goals:**

- Permitir que una persona identifique rápidamente la modalidad adecuada y ejecute sus primeros comandos desde el directorio correcto.
- Explicar la relación entre Node.js y npm, la versión requerida y cómo verificar la instalación.
- Mantener comandos breves y copiables para web, Docker, Electron, pruebas y empaquetado.
- Usar enlaces relativos estables hacia la documentación detallada.

**Non-Goals:**

- Duplicar procedimientos completos de diagnóstico, limpieza o verificación histórica.
- Documentar gestores de versiones o instaladores de terceros para cada sistema operativo.
- Cambiar scripts, dependencias, artefactos o comportamiento de las distribuciones.

## Decisions

### 1. README orientado por recorridos de uso

Después de la introducción se presentarán requisitos y una sección de inicio rápido con alternativas claramente separadas: web local, Docker Compose y aplicación de escritorio. Esto permite elegir un recorrido antes de entrar en mantenimiento de cartas o pruebas. Se descarta ordenar el documento por herramientas porque obliga a conocer de antemano qué herramienta corresponde a cada distribución.

### 2. Instalación de Node.js desde la fuente oficial

El README indicará instalar Node.js 22 LTS desde el sitio oficial y aclarará que el instalador incluye npm. Mostrará `node --version` y `npm --version` como comprobación, sin fijar un número de parche que envejezca rápidamente. Se evitarán instrucciones específicas de `winget`, Chocolatey, nvm o administradores Linux para no multiplicar variantes difíciles de mantener.

### 3. Resumen operativo con enlaces a `docs/`

El README incluirá el camino feliz y enlazará `docs/docker.md`, `docs/desktop.md` y `docs/verification.md` para opciones avanzadas y diagnóstico. Se conservarán en las guías los detalles como `tmpfs`, smoke tests, empaquetado cruzado y limpieza. Así el README resulta autosuficiente para empezar sin crear dos fuentes exhaustivas que puedan divergir.

### 4. Dependencias separadas por ámbito

Se explicará que la web no necesita instalar paquetes y que `npm test` usa el ejecutor integrado de Node. En cambio, Electron sí requiere ejecutar `npm ci` dentro de `desktop/`, donde existe su propio `package.json` y lockfile. Esta distinción evita instalar dependencias en la raíz o interpretar que Docker necesita npm local.

## Risks / Trade-offs

- [Los comandos resumidos pueden separarse de las guías detalladas] → Comparar explícitamente README y `docs/` durante la revisión y enlazar en vez de copiar opciones avanzadas.
- [La instalación de Node.js varía según el sistema] → Remitir al instalador oficial multiplataforma, fijar solo la versión mayor compatible y añadir comprobaciones neutrales.
- [Un README demasiado largo oculta el inicio rápido] → Mantener cada modalidad en un bloque corto y dejar diagnóstico, limpieza y seguridad en las guías específicas.
