# Tasks

## 1. Activos y contrato de baraja

- [x] 1.1 Revisar las coordenadas de `tools/extract-cards.ps1`, añadir comprobación de dimensiones de las láminas y verificar que genera exactamente 32 cartas, portada, reverso e instrucciones sin modificar los JPG originales.
- [x] 1.2 Versionar el esquema del manifiesto JSON y añadir la validación de metadatos, claves de características, direcciones `high`/`low`, identificadores únicos, valores numéricos y referencias de activos; verificar con casos válidos y con un caso inválido por cada regla.
- [x] 1.3 Contrastar las 32 entradas de «Coches Rally» con las tablas visibles de los recortes, corregir discrepancias y verificar que todas las cartas contienen las seis características declaradas.
- [x] 1.4 Documentar cómo corregir datos y añadir una baraja compatible en `README.md`, y verificar que una segunda baraja mínima de prueba puede cargarse sin editar el motor.

## 2. Motor de partida

- [x] 2.1 Extraer la lógica de juego del DOM a un módulo de máquina de estados con aleatoriedad inyectable y verificar transiciones `idle`, `choosing`, `resolved` y `finished` mediante pruebas automatizadas.
- [x] 2.2 Implementar barajado, reparto equitativo e iniciativa aleatoria y verificar de forma determinista que una baraja de 32 cartas produce dos pilas de 16 sin pérdidas ni duplicados.
- [x] 2.3 Implementar la elección humana y la estrategia automática limitada a la carta propia y los rangos públicos; verificar que solo acepta características declaradas y que el rival no consulta la carta contraria.
- [x] 2.4 Implementar comparaciones `high` y `low`, transferencia al final de la pila y conservación de iniciativa; verificar ganador, orden y recuentos en ambos sentidos.
- [x] 2.5 Implementar el bote de empates y los casos de agotamiento de una o ambas pilas; verificar empate intermedio, victoria por falta de siguiente carta y empate final.
- [x] 2.6 Implementar finalización y reinicio limpio, y verificar que ninguna acción altera una partida terminada y que la revancha no conserva estado anterior.

## 3. Interfaz de juego

- [x] 3.1 Conectar la pantalla inicial al cargador validado y verificar los estados de carga correcta y error con el botón de inicio habilitado o bloqueado según corresponda.
- [x] 3.2 Conectar la mesa, marcadores, iniciativa, cartas y controles al estado del motor, y verificar manualmente una secuencia donde ganen alternativamente la persona y el rival.
- [x] 3.3 Mostrar la resolución con ambos valores, característica elegida, ganador, cartas transferidas y bote; verificar que el resultado se comunica con texto además de color.
- [x] 3.4 Implementar reglas, final de partida y revancha preservando el estado al abrir el reglamento; verificar apertura y cierre con teclado durante una mano activa.
- [x] 3.5 Completar nombres accesibles, orden de foco, estados deshabilitados y texto alternativo; verificar por teclado que se puede iniciar, elegir, avanzar, consultar reglas y reiniciar sin ratón.
- [x] 3.6 Ajustar el diseño adaptable y el movimiento reducido; verificar a 320 px y en escritorio que no existe desplazamiento horizontal y que `prefers-reduced-motion` elimina transiciones no esenciales.

## 4. Integración y entrega estática

- [x] 4.1 Eliminar dependencias de red necesarias para el aspecto principal o empaquetarlas localmente, y verificar que la interfaz conserva tipografía y jerarquía con el navegador sin conexión.
- [x] 4.2 Servir `dist/` por HTTP y ejecutar el recorrido completo desde carga hasta victoria, derrota o empate; verificar además respuestas correctas para HTML, JSON y todos los activos referenciados.
- [x] 4.3 Ejecutar validación OpenSpec estricta y todas las pruebas del proyecto, y registrar en la entrega los comandos ejecutados y sus resultados.

## Workflow follow-up

- Revisar la implementación terminada antes de autorizar cualquier publicación externa.
- Sincronizar y archivar el cambio cuando se hayan aceptado las pruebas y la revisión funcional.
