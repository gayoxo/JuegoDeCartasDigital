# Proposal

## Why

Los escaneos de la baraja clásica «Coches Rally» no son utilizables directamente como juego web ni permiten reutilizar el sistema con otras barajas. Se necesita una adaptación digital que conserve las cartas originales, separe los datos de la lógica de juego y permita corregir o reemplazar las características sin modificar el código.

## What Changes

- Segmentar las 32 cartas, la portada, el reverso y las instrucciones a partir de los JPG de origen.
- Definir una baraja declarativa en JSON con metadatos, características, unidades, dirección de comparación y referencias a imágenes.
- Implementar una partida completa para una persona contra un rival automático, con reparto total, jugador inicial aleatorio, elección de característica, resolución de manos, empates con bote, transferencia de cartas y condición de victoria.
- Crear una interfaz web adaptable que muestre el estado de la partida, las cartas, los valores comparados, las reglas y el resultado final.
- Documentar el proceso para corregir los datos extraídos y añadir futuras barajas compatibles sin cambiar el motor del juego.
- Añadir validaciones de integridad de la baraja y pruebas de las reglas principales.

## Capabilities

### New Capabilities

- `deck-catalog`: Carga, valida y presenta barajas declarativas con sus cartas, imágenes y características comparables.
- `top-trumps-gameplay`: Gestiona el ciclo completo de una partida de características entre una persona y un rival automático.
- `game-interface`: Proporciona la experiencia web accesible y adaptable para iniciar, jugar, consultar reglas y reiniciar partidas.

### Modified Capabilities

Ninguna; el proyecto todavía no contiene capacidades OpenSpec existentes.

## Impact

- Afecta a la aplicación web estática, los activos gráficos derivados de los escaneos, el manifiesto de datos de la baraja, las utilidades de segmentación y la documentación del proyecto.
- No requiere servicios de backend, cuentas de usuario ni persistencia remota para la primera versión.
- La publicación es una operación posterior e independiente; esta propuesta cubre el producto y su empaquetado estático, no cambios de audiencia o dominio.
