# Spec Delta

## REMOVED Requirements

### Requirement: Ventana de escritorio independiente
**Reason**: La rama móvil deja de ofrecer una aplicación nativa de escritorio.
**Migration**: Instalar el APK y ejecutar el juego en un dispositivo o emulador Android.

### Requirement: Recursos locales compartidos
**Reason**: Electron deja de empaquetar los recursos; Capacitor asume su inclusión local en Android.
**Migration**: Mantener los recursos en `dist/` y sincronizarlos con el proyecto Android antes de construir el APK.

### Requirement: Seguridad del renderizador
**Reason**: Se elimina el renderizador Electron y su acceso potencial a APIs Node.
**Migration**: Aplicar el aislamiento, navegación y permisos definidos por el proyecto Android/Capacitor.

### Requirement: Ciclo de vida nativo
**Reason**: El ciclo de ventanas de escritorio deja de existir en el producto móvil.
**Migration**: Usar el ciclo de vida y la restauración de estado definidos para Android en `game-interface`.

### Requirement: Distribución portable de Windows
**Reason**: El portable de Windows deja de ser un artefacto soportado.
**Migration**: Construir y distribuir el APK Android descrito en `android-distribution`.

### Requirement: Documentación operativa de escritorio
**Reason**: Electron y su empaquetado se eliminan del repositorio.
**Migration**: Consultar el README y `docs/android.md` para el desarrollo, construcción, instalación y diagnóstico del producto móvil.
