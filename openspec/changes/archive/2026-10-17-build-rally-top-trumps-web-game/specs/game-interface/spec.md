# Spec Delta

## Purpose

Proporciona una experiencia web clara, accesible y adaptable que comunica el estado de la partida y permite completar todas las acciones del juego.

## ADDED Requirements

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
La interfaz MUST mantener visibles y utilizables las acciones esenciales en pantallas de escritorio y móviles de al menos 320 píxeles de ancho.

#### Scenario: Pantalla móvil estrecha
- **WHEN** la aplicación se visualiza a 320 píxeles de ancho
- **THEN** cartas, marcadores y controles permanecen dentro del área visible sin desplazamiento horizontal de página

### Requirement: Preferencias de movimiento
La interfaz SHALL respetar la preferencia del sistema para reducir movimiento no esencial.

#### Scenario: Movimiento reducido activado
- **WHEN** el dispositivo comunica `prefers-reduced-motion: reduce`
- **THEN** las transiciones decorativas se eliminan o se reducen a una duración imperceptible
