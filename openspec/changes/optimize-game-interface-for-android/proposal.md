# Proposal

## Why

La interfaz adaptable actual funciona desde 320 píxeles, pero no define el comportamiento propio de una aplicación Android: controles táctiles cómodos, recortes de pantalla, teclado del sistema, botón Atrás y suspensión/reanudación. Estas garantías son necesarias para que el APK se perciba como una aplicación móvil completa y no solo como una página dentro de una ventana.

## What Changes

- Adaptar la composición a teléfonos Android en orientación vertical y horizontal, respetando barras del sistema, áreas seguras y teclado en pantalla.
- Garantizar objetivos táctiles adecuados y eliminar cualquier acción que dependa exclusivamente de hover.
- Integrar el botón Atrás de Android con reglas, diálogos y salida de la partida.
- Preservar de forma segura el estado de una partida cuando la aplicación pasa temporalmente a segundo plano o la actividad se recrea.
- Añadir pruebas automatizadas con perfiles móviles y una validación en emulador Android.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `game-interface`: amplía el diseño adaptable y la interacción para cubrir el entorno, navegación y ciclo de vida de Android.

## Impact

- Cambiarán `dist/index.html`, estilos, controladores de interfaz y, si es necesario, la integración nativa de Capacitor.
- Se ampliarán las pruebas de interfaz con viewports táctiles, orientación y restauración del estado.
- El formato de la baraja y las reglas de Top Trumps no cambian.
- Este cambio presupone que `add-android-capacitor-distribution` ya está aplicado para las pruebas nativas, aunque la mayor parte del comportamiento seguirá siendo verificable en navegador.
