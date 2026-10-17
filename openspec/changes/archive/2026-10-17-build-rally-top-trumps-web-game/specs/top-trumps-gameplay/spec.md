# Spec Delta

## Purpose

Define una partida completa y verificable de cartas de características entre una persona y un rival automático hasta que uno reúna toda la baraja.

## ADDED Requirements

### Requirement: Preparación de la partida
El sistema SHALL barajar todas las cartas, repartirlas de forma equitativa entre ambos participantes y elegir al azar quién inicia la partida.

#### Scenario: Inicio con 32 cartas
- **WHEN** la persona inicia una partida con la baraja completa
- **THEN** cada participante recibe 16 cartas ordenadas en una pila y uno obtiene la iniciativa al azar

### Requirement: Información oculta
Cada participante SHALL conocer solamente su primera carta antes de que se seleccione la característica de la mano.

#### Scenario: Elección de la persona
- **WHEN** la persona tiene la iniciativa
- **THEN** ve su primera carta y la carta rival permanece boca abajo hasta confirmar una característica

#### Scenario: Elección del rival
- **WHEN** el rival automático tiene la iniciativa
- **THEN** la persona ve su propia primera carta mientras la carta y la elección del rival permanecen ocultas hasta la resolución

### Requirement: Elección de característica
Quien tenga la iniciativa MUST seleccionar exactamente una característica declarada por la baraja para resolver la mano.

#### Scenario: Turno de la persona
- **WHEN** la persona selecciona una característica habilitada
- **THEN** el sistema bloquea nuevas elecciones y resuelve la mano con esa característica

#### Scenario: Turno del rival automático
- **WHEN** el rival tiene la iniciativa
- **THEN** selecciona automáticamente una característica válida de su primera carta

### Requirement: Resolución de la mano
El sistema SHALL comparar los valores de ambas primeras cartas conforme a la dirección configurada para la característica elegida.

#### Scenario: Gana el valor superior
- **WHEN** la característica es `high` y el valor de la persona es mayor
- **THEN** la persona gana la mano

#### Scenario: Gana el valor inferior
- **WHEN** la característica es `low` y el valor del rival es menor
- **THEN** el rival gana la mano

### Requirement: Transferencia e iniciativa
El ganador de una mano SHALL colocar al final de su pila todas las cartas en juego y conservar la iniciativa para la siguiente mano.

#### Scenario: Mano sin empate previo
- **WHEN** un participante gana una comparación directa
- **THEN** añade las dos cartas comparadas al final de su pila y elige en la mano siguiente

#### Scenario: Mano con bote acumulado
- **WHEN** un participante gana después de uno o más empates
- **THEN** añade al final de su pila todas las cartas acumuladas en el bote y las de la comparación ganadora

### Requirement: Gestión de empates
Cuando ambos valores sean iguales, el sistema SHALL mantener las cartas en un bote y continuar con las siguientes cartas disponibles sin cambiar la iniciativa.

#### Scenario: Empate con cartas disponibles
- **WHEN** los valores comparados son iguales y ambos participantes conservan cartas
- **THEN** las cartas pasan al bote y quien tenía la iniciativa elige de nuevo en la siguiente comparación

#### Scenario: Participante sin carta tras un empate
- **WHEN** un empate deja a uno de los participantes sin una siguiente carta
- **THEN** la partida termina a favor del participante que todavía puede jugar una carta

#### Scenario: Ambos participantes sin carta tras un empate
- **WHEN** un empate deja a ambos participantes sin una siguiente carta
- **THEN** la partida termina en empate y la interfaz ofrece iniciar otra partida

### Requirement: Final de partida
La partida SHALL finalizar cuando un participante no tenga cartas disponibles para comenzar la siguiente mano.

#### Scenario: Victoria de la persona
- **WHEN** el rival no puede presentar una carta al inicio de una mano
- **THEN** el sistema declara ganadora a la persona y bloquea nuevas jugadas

#### Scenario: Victoria del rival
- **WHEN** la persona no puede presentar una carta al inicio de una mano
- **THEN** el sistema declara ganador al rival y bloquea nuevas jugadas

### Requirement: Reinicio independiente
El sistema SHALL permitir iniciar una nueva partida sin conservar el orden, el bote, la iniciativa ni el resultado de la anterior.

#### Scenario: Solicitud de revancha
- **WHEN** la persona reinicia tras finalizar una partida
- **THEN** todas las cartas se vuelven a barajar y se crea un estado inicial independiente
