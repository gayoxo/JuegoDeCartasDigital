# Spec Delta

## MODIFIED Requirements

### Requirement: Diseño adaptable
La interfaz MUST mantener visibles y utilizables las acciones esenciales en pantallas de escritorio y móviles de al menos 320 píxeles de ancho, en orientación vertical u horizontal, sin quedar ocultas por recortes, barras del sistema o el teclado en pantalla.

#### Scenario: Pantalla móvil estrecha
- **WHEN** la aplicación se visualiza a 320 píxeles de ancho
- **THEN** cartas, marcadores y controles permanecen dentro del área visible sin desplazamiento horizontal de página

#### Scenario: Área segura de Android
- **WHEN** el dispositivo presenta una cámara perforada, recorte o barras del sistema superpuestas
- **THEN** el contenido y las acciones esenciales respetan los márgenes seguros y permanecen completamente operables

#### Scenario: Cambio de orientación
- **WHEN** el dispositivo cambia entre orientación vertical y horizontal durante una mano
- **THEN** la interfaz se recompone sin perder el estado, ocultar la acción esperada ni introducir desplazamiento horizontal de página

## ADDED Requirements

### Requirement: Interacción táctil completa
Todas las acciones del juego SHALL poder completarse mediante toque, con objetivos táctiles distinguibles y sin depender de estados exclusivos del puntero o de hover.

#### Scenario: Partida usando solo toque
- **WHEN** una persona juega en un dispositivo de entrada táctil sin ratón ni teclado físico
- **THEN** puede abrir reglas, elegir una característica, avanzar entre manos y solicitar una revancha

#### Scenario: Objetivos táctiles próximos
- **WHEN** aparecen varios controles de características juntos en una pantalla estrecha
- **THEN** cada control mantiene un área táctil suficiente y separación para evitar activaciones accidentales

### Requirement: Navegación con el botón Atrás
En Android, el botón Atrás SHALL cerrar primero la capa temporal visible y MUST evitar abandonar accidentalmente una partida activa.

#### Scenario: Reglas abiertas
- **WHEN** la persona pulsa Atrás mientras el reglamento está abierto
- **THEN** el reglamento se cierra y la misma mano permanece activa

#### Scenario: Partida activa sin capa temporal
- **WHEN** la persona pulsa Atrás durante una partida y no hay diálogo ni capa temporal abierta
- **THEN** la interfaz solicita confirmación antes de salir o reiniciar y conserva la partida si se cancela

#### Scenario: Pantalla inicial
- **WHEN** la persona pulsa Atrás desde la pantalla inicial
- **THEN** la aplicación delega en Android el cierre normal de la actividad

### Requirement: Conservación durante el ciclo de vida móvil
La aplicación SHALL preservar la partida activa cuando pase temporalmente a segundo plano o Android recree la vista, y SHALL descartar de forma segura un estado incompatible o corrupto.

#### Scenario: Reanudación desde segundo plano
- **WHEN** la persona vuelve a la aplicación después de cambiar temporalmente a otra aplicación
- **THEN** recupera la misma mano, iniciativa, pilas, bote y estado de revelado

#### Scenario: Recreación de la actividad
- **WHEN** Android recrea la actividad durante una partida
- **THEN** la interfaz restaura el último estado válido antes de aceptar una nueva acción

#### Scenario: Estado guardado incompatible
- **WHEN** la versión instalada no puede validar el estado guardado
- **THEN** la aplicación lo descarta, vuelve a la pantalla inicial y comunica que no pudo recuperar la partida
