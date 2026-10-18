# Spec Delta

## REMOVED Requirements

### Requirement: Construcción reproducible de imagen
**Reason**: La rama móvil deja de distribuir el juego como imagen Docker y concentra la construcción reproducible en Android.
**Migration**: Construir el APK mediante el flujo documentado por `android-distribution`.

### Requirement: Servicio HTTP autocontenido
**Reason**: El producto deja de ejecutarse como servicio HTTP; los recursos se incluyen en el APK.
**Migration**: Instalar el APK y usar su funcionamiento local sin conexión.

### Requirement: Configuración por puerto
**Reason**: La aplicación Android no expone un servidor ni necesita publicar puertos.
**Migration**: No se requiere configuración equivalente; iniciar la aplicación instalada.

### Requirement: Comprobación de salud
**Reason**: Al no existir un contenedor o servicio HTTP, una comprobación de salud Docker carece de objetivo.
**Migration**: Usar la construcción, instalación y prueba de arranque Android descritas en la guía móvil.

### Requirement: Ejecución con privilegios reducidos
**Reason**: Se elimina el proceso servidor de contenedor al que se aplicaba este requisito.
**Migration**: Android ejecuta el APK dentro del aislamiento estándar de aplicaciones y con los permisos declarados en su manifiesto.

### Requirement: Documentación operativa Docker
**Reason**: Docker deja de ser una vía soportada de instalación o ejecución.
**Migration**: Consultar el README y `docs/android.md` para construir, instalar, actualizar y diagnosticar la aplicación Android.
