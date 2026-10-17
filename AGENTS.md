# Herramientas del proyecto

<!-- openspec-installer:start -->
## OpenSpec

OpenSpec se ejecuta mediante un wrapper Docker reutilizable. No busques una instalación local de Node.js ni del CLI de OpenSpec.

En Windows, desde la raíz del proyecto, utiliza:

```powershell
& ".\.openspec-tool\openspec.cmd" <argumentos>
```

El wrapper (en `.openspec-tool/`, fuera de Git) usa Docker Compose, trabaja siempre sobre la raíz del proyecto y solo pide TTY cuando hay terminal, así que también funciona cuando lo ejecuta un agente. No lo envuelvas en `script` ni en otros simuladores de terminal.

OpenSpec no necesita una clave de OpenAI o Claude. La autenticación pertenece al agente elegido.
<!-- openspec-installer:end -->
