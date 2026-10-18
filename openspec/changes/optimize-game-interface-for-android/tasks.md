# Tasks

## 1. Composición móvil e interacción táctil

- [ ] 1.1 Configurar el viewport para áreas seguras y adaptar el layout a barras, recortes, teclado y ambas orientaciones, verificando con pruebas visuales a 320 px y perfiles Android vertical/horizontal que no existe desplazamiento horizontal.
- [ ] 1.2 Ajustar botones y características a objetivos táctiles cómodos sin depender de hover, conservando foco y teclado, y verificar por pruebas que todas las acciones pueden completarse con entrada táctil y con teclado.
- [ ] 1.3 Añadir pruebas de regresión para cambios de orientación y viewport reducido durante cada fase de la mano, verificando que el estado y la acción principal permanecen visibles.

## 2. Navegación Android

- [ ] 2.1 Implementar un controlador único de navegación Atrás con prioridad para reglas y diálogos, y verificar mediante pruebas unitarias el orden de cierre de capas.
- [ ] 2.2 Conectar el evento Atrás de Capacitor, mostrando confirmación durante una partida y delegando la salida solo desde inicio, y verificar el flujo completo en un emulador Android 16.
- [ ] 2.3 Probar altas y bajas repetidas del listener al pausar y reanudar, verificando que una pulsación produce exactamente una acción.

## 3. Persistencia del ciclo de vida

- [ ] 3.1 Definir una instantánea JSON versionada de la partida y su validador, y verificar con pruebas estados válidos, corruptos, de otra baraja y de versiones incompatibles.
- [ ] 3.2 Guardar únicamente después de transiciones estables y restaurar antes de habilitar acciones, verificando por pruebas una mano con iniciativa, pilas, bote y carta revelada.
- [ ] 3.3 Integrar pausa, reanudación y recreación de actividad con la persistencia, y verificar en Android 16 que la misma partida reaparece después de segundo plano y recreación forzada.
- [ ] 3.4 Comunicar la recuperación fallida y volver a inicio ante una instantánea inválida, verificando que el usuario puede comenzar una partida nueva sin errores residuales.

## 4. Validación integrada y documentación

- [ ] 4.1 Ejecutar la suite web completa con perfiles móvil y escritorio, verificando que accesibilidad por teclado, movimiento reducido y reglas existentes no presentan regresiones.
- [ ] 4.2 Documentar en la guía Android la matriz de comprobación táctil, orientación, Atrás y ciclo de vida, y verificar manualmente todos los casos en un APK actualizado.

## Workflow follow-up

- Aplicar después `retire-web-docker-desktop-distributions` solo cuando el APK móvil haya superado estas validaciones.
- Archivar este cambio cuando la revisión y las validaciones del proyecto estén satisfechas.
