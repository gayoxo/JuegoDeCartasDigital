# Design

## Context

El repositorio contiene cinco láminas JPG de 919×1300 o 1000×783 píxeles. Las cuatro láminas de juego combinan cartas, portada, reverso e instrucciones en una cuadrícula irregular. Existe un prototipo estático en `dist/` con recortes, un manifiesto JSON y lógica de juego en JavaScript; se utilizará como material de partida durante `apply`, pero deberá contrastarse con estas especificaciones y no se considerará terminado por su mera existencia.

La aplicación no necesita identidad, backend ni persistencia. Debe poder alojarse como contenido estático, funcionar en navegadores modernos de escritorio y móvil y permitir nuevas barajas mediante datos y activos.

## Goals / Non-Goals

**Goals:**

- Separar datos de baraja, reglas de partida y presentación para que evolucionen independientemente.
- Hacer determinista y comprobable el motor cuando se le proporciona una fuente de aleatoriedad controlada.
- Conservar los escaneos como fuente visual mientras los valores estructurados permiten comparar y corregir datos.
- Producir un paquete estático autocontenido que pueda servirse desde cualquier hosting HTTP.

**Non-Goals:**

- Partidas multijugador en red, cuentas, clasificación o guardado de partidas.
- Editor visual de barajas dentro de la aplicación.
- Automatizar OCR con garantías de exactitud; la revisión humana del manifiesto seguirá siendo necesaria.
- Reproducir el juego de «cuartetos» mencionado en las instrucciones físicas.
- Publicar el sitio o modificar su audiencia como parte de la implementación funcional.

## Decisions

### 1. Aplicación estática sin framework

La primera versión se implementará con HTML, CSS y JavaScript del navegador, sin proceso de compilación obligatorio. El tamaño y la interacción no justifican incorporar un framework; esta decisión reduce dependencias y permite desplegar directamente `dist/`.

Alternativa considerada: una SPA con framework y empaquetador. Se descarta por añadir instalación, compilación y superficie de mantenimiento sin aportar una necesidad actual.

### 2. Contrato JSON versionable para cada baraja

Cada baraja tendrá un manifiesto con versión de esquema, metadatos, referencias de activos, definiciones de características y cartas. Las características declaran su dirección de comparación, evitando codificar excepciones como «menor peso gana» en el motor.

El cargador validará todo el documento antes de permitir una partida y devolverá errores con la ruta del campo problemático. Las rutas de imagen serán relativas a la raíz estática para que el paquete sea portable.

Alternativas consideradas: XML o YAML. JSON se elige porque el navegador lo carga de forma nativa y es fácil de validar; se podrá añadir conversión desde otros formatos más adelante sin cambiar el contrato de ejecución.

### 3. Segmentación reproducible y no destructiva

Un script mantendrá explícitas las coordenadas de recorte de cada lámina y generará los activos derivados en un directorio separado. Los JPG originales nunca se modificarán. Cada nombre de archivo derivado coincidirá con el identificador estable de la carta.

Alternativa considerada: recortar en tiempo de ejecución mediante CSS. Se descarta porque obliga a descargar láminas completas, complica el diseño adaptable y acopla la interfaz a las coordenadas originales.

### 4. Motor como máquina de estados independiente del DOM

El juego se modelará con los estados `idle`, `choosing`, `resolved` y `finished`. El estado contendrá las dos colas de cartas, el bote, la iniciativa, la característica seleccionada, el número de mano y el resultado. Las operaciones recibirán y devolverán estado; la interfaz observará el resultado y renderizará.

La aleatoriedad de barajado e iniciativa se inyectará para poder escribir pruebas deterministas. La interfaz no moverá cartas por su cuenta.

Alternativa considerada: mantener toda la lógica dentro de manejadores del DOM. El prototipo utiliza parcialmente este enfoque, pero se reemplazará porque dificulta probar empates, agotamiento de pilas y reinicios.

### 5. Empates mediante bote explícito

Las cartas empatadas se retiran de ambas colas y se incorporan a un bote. La iniciativa no cambia. El siguiente ganador recibe el bote completo. Si solo un participante conserva una carta para continuar, gana la partida; si ninguno conserva cartas, el resultado es empate final. Esto evita estados imposibles y define los límites no detallados por la baraja física.

### 6. Rival automático acotado al estado visible propio

El rival elegirá una característica válida basándose únicamente en su carta actual y en los rangos públicos de la baraja. No inspeccionará la carta actual de la persona. Una estrategia inicial puede escoger entre sus características mejor normalizadas, con aleatoriedad para evitar partidas idénticas.

Alternativa considerada: escoger siempre la característica máxima absoluta. Se descarta porque es demasiado predecible y puede producir decisiones débiles entre unidades con escalas diferentes.

### 7. Accesibilidad y respuesta como parte del renderizado

Las características serán botones reales, los diálogos conservarán foco de teclado y los cambios de mano tendrán anuncios textuales además del color. Las imágenes conservarán texto alternativo. La hoja de estilos incluirá un diseño desde 320 píxeles y respetará `prefers-reduced-motion`.

## Risks / Trade-offs

- [Los valores transcritos pueden contener errores] → Conservar la tabla impresa visible, marcar la procedencia en el manifiesto y facilitar correcciones manuales.
- [Los recortes dependen de estas resoluciones concretas] → Validar dimensiones antes de recortar y mantener coordenadas agrupadas por lámina.
- [Una partida puede durar mucho o entrar en ciclos de reparto] → Mantener el comportamiento fiel en la primera versión y registrar número de manos; añadir límite o detección de ciclos solo mediante otro cambio de requisitos.
- [Las fuentes web externas pueden no cargar sin conexión] → Usar pilas tipográficas de reserva o empaquetar fuentes locales antes de considerar el sitio autocontenido.
- [El prototipo existente puede divergir de la especificación] → Tratar `apply` como reconciliación: extraer el motor, añadir validación y pruebas antes de aceptar la implementación.

## Migration Plan

1. Conservar los JPG originales y regenerar los activos derivados de forma reproducible.
2. Versionar y validar el manifiesto actual, corrigiendo cualquier valor contrastado con las cartas.
3. Extraer la lógica del prototipo a un motor independiente y cubrir los escenarios de las especificaciones.
4. Conectar la interfaz al motor y al cargador validados.
5. Verificar la aplicación servida por HTTP en escritorio y a 320 píxeles.
6. Empaquetar `dist/` como entrega estática. La publicación, si se solicita después, se hará como operación separada.

Para revertir, se retirará el paquete estático generado sin alterar los JPG originales ni los artefactos OpenSpec.
