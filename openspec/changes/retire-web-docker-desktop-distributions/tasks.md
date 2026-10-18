# Tasks

## 1. Puerta de entrada e inventario

- [ ] 1.1 Confirmar que los cambios `add-android-capacitor-distribution` y `optimize-game-interface-for-android` están aplicados y verificar un APK debug instalable con una partida sin conexión antes de eliminar ninguna distribución.
- [ ] 1.2 Inventariar archivos, scripts, dependencias, pruebas y documentación consumidos exclusivamente por Docker, Electron o el servidor local mediante búsqueda de referencias, y guardar el inventario en la descripción del cambio o documentación de mantenimiento.
- [ ] 1.3 Ejecutar y registrar `npm ci`, la suite reutilizable y la construcción Android como línea base, verificando que cualquier fallo previo queda identificado antes de la limpieza.

## 2. Retirada de Docker

- [ ] 2.1 Eliminar `Dockerfile`, `compose.yaml`, `Caddyfile`, `.dockerignore` y los scripts/pruebas exclusivamente Docker identificados, verificando que no quedan referencias ejecutables a esos archivos.
- [ ] 2.2 Eliminar la documentación Docker y sus enlaces, verificando mediante búsqueda que README y docs ya no ofrecen Docker como método soportado.
- [ ] 2.3 Sincronizar y construir Android después de la retirada Docker, verificando que el APK conserva todos los recursos y puede abrir la portada sin red.

## 3. Retirada de Electron y servidor local

- [ ] 3.1 Eliminar `desktop/`, configuración de empaquetado, scripts, pruebas y artefactos exclusivos de Electron, verificando mediante búsqueda que no quedan imports ni comandos de escritorio huérfanos.
- [ ] 3.2 Retirar el servidor web local y sus instrucciones sin eliminar pruebas, herramientas ni recursos compartidos, verificando que todos los consumidores restantes de `dist/` pertenecen a Android, pruebas o mantenimiento de barajas.
- [ ] 3.3 Eliminar dependencias y scripts npm obsoletos, regenerar el lockfile y verificar que `npm ci`, las pruebas conservadas y la sincronización de Capacitor terminan correctamente.
- [ ] 3.4 Actualizar `.gitignore` para retirar patrones antiguos y conservar exclusiones Android, Gradle, APK, credenciales y claves, verificando que `git status` no expone secretos ni artefactos de construcción.

## 4. Documentación móvil e integración

- [ ] 4.1 Reescribir el README con Android como única distribución: requisitos de Node/npm y SDK, instalación, build, ruta e instalación del APK y enlaces de diagnóstico, verificando cada comando documentado.
- [ ] 4.2 Eliminar documentación de escritorio/local obsoleta y actualizar el índice de `docs/`, verificando que no quedan enlaces rotos ni instrucciones contradictorias.
- [ ] 4.3 Ejecutar la suite completa conservada, construir e instalar un APK desde una instalación limpia y completar una partida sin red, verificando que la retirada no afecta catálogo, imágenes, interfaz ni motor.

## Workflow follow-up

- Archivar el cambio con retiro de capacidades y comprobar que `container-distribution` y `desktop-distribution` ya no aparecen en `openspec list --specs`.
