# game-interface Specification

## Purpose

Proporciona una experiencia web clara, accesible y adaptable que comunica el estado de la partida y permite completar todas las acciones del juego.

## Requirements

### Requirement: Pantalla de inicio
La interfaz SHALL presentar la identidad de la baraja activa, su portada, el número de cartas y una acción inequívoca para iniciar la partida.

#### Scenario: Baraja preparada
- **WHEN** la baraja termina de cargarse y validarse
- **THEN** la acción de inicio queda habilitada y muestra la información de esa baraja

#### Scenario: Error de carga
- **WHEN** el manifiesto o un dato obligatorio no puede cargarse
- **THEN** la acción de inicio permanece deshabilitada y se comunica el error

### Requirement: Estado visible de la partida
La interfaz SHALL mostrar en cada mano la cantidad de cartas de ambos participantes, quién tiene la iniciativa, la carta de la persona y el estado de la carta rival.

#### Scenario: Mano pendiente de elección
- **WHEN** comienza una mano
- **THEN** la persona puede identificar quién elige, cuántas cartas tiene cada participante y qué acción se espera

### Requirement: Selección accesible de característica
Las características elegibles SHALL exponerse como controles operables con teclado y con un nombre accesible que incluya etiqueta, valor y unidad.

#### Scenario: Navegación sin ratón
- **WHEN** una persona usa el teclado durante su turno
- **THEN** puede enfocar y activar cualquiera de las características disponibles

#### Scenario: Características no elegibles
- **WHEN** no corresponde a la persona elegir o la mano ya se resolvió
- **THEN** los controles de característica no aceptan una segunda selección

### Requirement: Resultado comprensible de la mano
Después de comparar, la interfaz SHALL descubrir ambas cartas e identificar la característica, los dos valores, el ganador y el efecto sobre turno y cartas.

#### Scenario: Mano ganada
- **WHEN** se resuelve una mano sin empate
- **THEN** se destaca visualmente el valor ganador y se informa quién recibe las cartas y conserva la iniciativa

#### Scenario: Mano empatada
- **WHEN** los dos valores son iguales
- **THEN** se informa del empate y del número de cartas acumuladas en el bote

### Requirement: Consulta de reglas
La persona SHALL poder consultar y cerrar una explicación textual del reglamento sin perder el estado de la partida.

#### Scenario: Reglas durante una partida
- **WHEN** la persona abre y cierra el reglamento
- **THEN** vuelve a la misma mano, con la misma iniciativa, pilas y bote

### Requirement: Final y revancha
La interfaz SHALL anunciar el resultado final y ofrecer una acción para comenzar una partida nueva.

#### Scenario: Partida finalizada
- **WHEN** el motor declara victoria, derrota o empate final
- **THEN** se muestra el resultado, se impiden más acciones sobre la partida terminada y se ofrece reiniciar

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

### Requirement: Preferencias de movimiento
La interfaz SHALL respetar la preferencia del sistema para reducir movimiento no esencial.

#### Scenario: Movimiento reducido activado
- **WHEN** el dispositivo comunica `prefers-reduced-motion: reduce`
- **THEN** las transiciones decorativas se eliminan o se reducen a una duración imperceptible

