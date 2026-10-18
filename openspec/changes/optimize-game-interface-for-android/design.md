# Design

## Context

La interfaz ya es adaptable a 320 px y accesible por teclado, pero fue diseñada para navegador. El contenedor Capacitor introduce áreas seguras, eventos nativos de navegación y cambios de ciclo de vida. La partida reside actualmente en memoria JavaScript. Véase `proposal.md` para la motivación y `specs/game-interface/spec.md` para el comportamiento requerido.

## Goals / Non-Goals

**Goals:**

- Hacer que la misma interfaz responda correctamente a toque, orientación, recortes y barras Android.
- Definir una sola ruta de serialización y validación para recuperar partidas.
- Mantener las pruebas web como capa rápida y añadir una comprobación nativa para lo que el navegador no simula.

**Non-Goals:**

- Cambiar las reglas, la estrategia del rival o el esquema de las cartas.
- Sincronizar partidas entre dispositivos o cuentas.
- Mantener partidas indefinidamente después de una actualización incompatible.
- Diseñar interfaces distintas para Android y navegador.

## Decisions

### Aplicar áreas seguras con CSS y una única composición adaptable

Se declarará `viewport-fit=cover` y el contenedor principal combinará su espaciado con `env(safe-area-inset-*)`. Las reglas de layout se basarán en ancho, alto y orientación, manteniendo el DOM y el orden accesible. Se descartan plantillas separadas por orientación porque duplicarían estados y pruebas.

### Diseñar primero para puntero grueso sin degradar teclado

Los controles usarán elementos nativos interactivos, un tamaño táctil mínimo coherente y separación visible. Las mejoras de hover quedarán bajo consultas capaces de detectar hover; foco y teclado continuarán cumpliendo el contrato existente. Se evita detectar marcas o modelos de dispositivo.

### Enrutar Atrás mediante una política de capas

Un controlador único comprobará en orden: diálogo/reglas, confirmación pendiente, partida activa y pantalla inicial. El plugin de aplicación de Capacitor entregará el evento nativo; fuera de Android el mismo controlador podrá probarse con eventos simulados. La salida directa solo se delegará en la pantalla inicial.

### Persistir una instantánea versionada y validada

Después de cada transición estable se guardará una instantánea JSON con versión de esquema, identificador/versión de baraja, pilas ordenadas, bote, iniciativa, fase y selección. Al arrancar o reanudar se validará contra las cartas y fases conocidas antes de hidratar el motor. No se persistirá a mitad de una transición visual para evitar estados imposibles.

El almacenamiento web local es suficiente porque los datos no son sensibles y permite probar la misma ruta en navegador y WebView. Un adaptador pequeño aislará el mecanismo para poder cambiarlo sin afectar al motor.

### Repartir la validación entre navegador y emulador

Las pruebas automatizadas de navegador cubrirán 320 px, orientaciones, puntero grueso, diálogos y restauración. Un smoke test en Android 16 cubrirá áreas del sistema, botón Atrás real, segundo plano y recreación de actividad. No se intentará emular la totalidad de Android en la suite web.

## Risks / Trade-offs

- [Una instantánea antigua deja el motor incoherente] → Incluir versión y validación completa; ante error, descartar y notificar.
- [El botón Atrás queda registrado varias veces] → Centralizar alta/baja del listener con el ciclo de vida de la vista.
- [El teclado o las barras reducen demasiado el viewport] → Priorizar acción, marcador y carta activa; permitir desplazamiento vertical interno, nunca horizontal de página.
- [La persistencia altera pruebas aleatorias] → Inyectar almacenamiento vacío o controlado y limpiar instantáneas entre casos.
- [Diferencias entre emulador y dispositivos] → Probar API 36 y documentar una comprobación manual en al menos un teléfono cuando esté disponible.

## Migration Plan

1. Añadir metadatos de viewport, variables de área segura y estilos táctiles con pruebas responsivas.
2. Implementar el controlador jerárquico de Atrás y conectarlo al proyecto Capacitor.
3. Añadir serialización versionada, validación, guardado por transición y restauración al iniciar/reanudar.
4. Ejecutar pruebas web y la matriz manual/instrumentada en Android 16, incluida la recreación de actividad.
5. Si la restauración causa fallos, deshabilitar temporalmente la carga de instantáneas manteniendo el layout y la navegación móvil; las instantáneas versionadas pueden descartarse sin migración destructiva.
