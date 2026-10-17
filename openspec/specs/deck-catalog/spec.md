# deck-catalog Specification

## Purpose

Permite describir, validar y cargar barajas de características independientes de la lógica del juego, incluyendo sus imágenes y reglas de comparación.

## Requirements

### Requirement: Manifiesto declarativo de baraja
El sistema SHALL cargar la baraja activa desde un archivo JSON externo que defina metadatos, imágenes generales, características y cartas sin exigir cambios en el motor de juego.

#### Scenario: Carga de la baraja Coches Rally
- **WHEN** la aplicación carga el manifiesto de «Coches Rally»
- **THEN** obtiene exactamente 32 cartas con identificador, nombre, imagen y valores para todas las características declaradas

#### Scenario: Sustitución por otra baraja compatible
- **WHEN** se configura otro manifiesto que cumple el mismo contrato
- **THEN** el sistema usa sus metadatos, imágenes, características y cartas sin modificar las reglas de partida

### Requirement: Definición de características comparables
Cada característica SHALL declarar una clave única, una etiqueta visible, una unidad opcional y una dirección de comparación `high` o `low`.

#### Scenario: Característica donde gana el valor mayor
- **WHEN** una característica declara la dirección `high`
- **THEN** el valor numérico mayor se considera ganador

#### Scenario: Característica donde gana el valor menor
- **WHEN** una característica declara la dirección `low`
- **THEN** el valor numérico menor se considera ganador

### Requirement: Validación de integridad
El sistema MUST rechazar una baraja que tenga identificadores duplicados, referencias de imagen ausentes, cartas sin valores requeridos o valores no numéricos.

#### Scenario: Carta incompleta
- **WHEN** una carta no contiene el valor de una característica declarada
- **THEN** la baraja no se ofrece para iniciar una partida y se muestra un error identificable

#### Scenario: Baraja válida
- **WHEN** todas las cartas y activos cumplen el contrato
- **THEN** la baraja queda disponible para jugar

### Requirement: Activos segmentados de Coches Rally
La baraja «Coches Rally» SHALL proporcionar archivos independientes para sus 32 cartas, su portada, su reverso y sus instrucciones a partir de las láminas originales.

#### Scenario: Presentación de una carta
- **WHEN** una carta se muestra durante la partida
- **THEN** la interfaz carga únicamente el recorte correspondiente a esa carta y conserva legibles su fotografía, nombre y tabla impresa

### Requirement: Corrección manual de datos
Los valores transcritos SHALL poder corregirse editando el manifiesto sin regenerar las imágenes ni modificar el código de la aplicación.

#### Scenario: Corrección de un dato OCR o transcrito
- **WHEN** se cambia un valor numérico válido en el manifiesto
- **THEN** las partidas posteriores usan el nuevo valor en la presentación y comparación

