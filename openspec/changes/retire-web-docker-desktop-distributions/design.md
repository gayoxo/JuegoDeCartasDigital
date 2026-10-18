# Design

## Context

El repositorio mantiene tres superficies de distribución basadas en los mismos recursos: servicio Docker/Caddy, ventana Electron y ejecución web local. Tras aplicar los cambios Android, `dist/` será también la entrada de Capacitor. La limpieza debe distinguir entre la distribución web independiente, que se retira, y los recursos web internos, que continúan siendo esenciales. Véase `proposal.md` para la motivación.

## Goals / Non-Goals

**Goals:**

- Dejar Android como única distribución soportada y documentada.
- Eliminar dependencias, scripts, pruebas y documentación exclusivas de Docker, Electron y servidor local.
- Mantener intactos el juego, la baraja, las herramientas de extracción y las pruebas reutilizadas por Android.
- Hacer que el historial OpenSpec refleje explícitamente la retirada de capacidades.

**Non-Goals:**

- Convertir `dist/` en una aplicación web publicada o PWA.
- Eliminar Node.js del desarrollo: sigue siendo necesario para dependencias, pruebas y Capacitor.
- Borrar las imágenes fuente JPG o las herramientas que generan una baraja.
- Ejecutar la retirada antes de validar un APK Android instalable.

## Decisions

### Retirar por inventario de pertenencia, no por extensión

Se clasificará cada archivo, script, dependencia y prueba según su uso real. Se eliminarán los elementos cuyo único consumidor sea Docker, Electron o el servidor local. Se conservarán `dist/`, pruebas del motor/catálogo, herramientas de segmentación/OCR y configuración npm necesaria para Android. Esto evita confundir “web como distribución” con “tecnología web embebida”.

### Hacer de Android el flujo raíz de documentación

El README explicará instalación de Node/npm y Android Studio/SDK, construcción debug, ubicación e instalación del APK y enlazará `docs/android.md`. Los documentos Docker y Electron se eliminarán en vez de dejarlos marcados como obsoletos, porque la rama móvil autoriza descartar esas variantes.

### Limpiar `package.json` después de comprobar consumidores

Se retirarán Electron, empaquetadores y scripts de servidor que no use Android. Se conservarán scripts de pruebas y Capacitor. Tras modificar dependencias se regenerará el lockfile con `npm install` o el mecanismo vigente y se verificará con `npm ci`, evitando editarlo manualmente.

### Usar una puerta de entrada irreversible pero recuperable por Git

La limpieza solo comenzará cuando los dos cambios Android previos estén completos y exista un APK validado. Antes de borrar, se registrará el inventario exacto en la tarea y se ejecutarán las pruebas actuales como línea base. La recuperación se hará desde el historial de Git, no mediante copias paralelas que mantengan código muerto.

### Retirar formalmente las capacidades OpenSpec

El cambio declara `retire_capabilities: true` y elimina todos los requisitos de `container-distribution` y `desktop-distribution`. Al archivarlo, ambas capacidades deben desaparecer de las specs principales en lugar de quedar vacías.

## Risks / Trade-offs

- [Se elimina un recurso que Android consume indirectamente] → Buscar referencias y construir/sincronizar el APK después de cada grupo de limpieza.
- [Se pierde una ruta útil de depuración rápida] → Mantener pruebas unitarias web y usar la ejecución Android/Capacitor como ruta soportada.
- [El README mezcla instrucciones antiguas] → Sustituir la matriz de distribuciones completa y comprobar enlaces/comandos.
- [La retirada impide volver a escritorio con facilidad] → El historial de Git conserva la implementación; recuperarla requerirá un nuevo cambio explícito.
- [Las specs retiradas no desaparecen al archivar] → Validar el marcador de retiro y comprobar el inventario de specs tras el archivo.

## Migration Plan

1. Confirmar que `add-android-capacitor-distribution` y `optimize-game-interface-for-android` están aplicados, con APK debug probado sin red.
2. Registrar referencias y ejecutar pruebas/builds como línea base.
3. Retirar Docker y comprobar que pruebas y build Android siguen funcionando.
4. Retirar Electron y servidor local, limpiar dependencias y regenerar el lockfile.
5. Reescribir README y documentación con Android como único flujo soportado.
6. Ejecutar `npm ci`, pruebas reutilizables, sincronización Android y construcción/instalación del APK.
7. Archivar el cambio y confirmar la retirada de ambas capacidades principales.

Para revertir antes de integrar, se restaurarán desde Git únicamente los archivos eliminados por este cambio y se revertirán los ajustes de dependencias/documentación. Después de integrar, recuperar una distribución antigua requerirá una propuesta nueva basada en el historial.
