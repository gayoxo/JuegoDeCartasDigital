# Design

## Context

La aplicación es HTML, CSS y JavaScript sin backend; `dist/` contiene la interfaz, el motor, el manifiesto y todos los activos. Existe un `package.json` para pruebas y distribuciones, pero todavía no hay proyecto Android. Véase `proposal.md` para la motivación.

## Goals / Non-Goals

**Goals:**

- Reutilizar exactamente el contenido de `dist/` dentro de un contenedor nativo Android.
- Fijar las dependencias y los parámetros del SDK necesarios para repetir la construcción.
- Separar la firma de publicación de la configuración versionada.
- Mantener disponible una comprobación rápida mediante un APK de depuración instalable.

**Non-Goals:**

- Reescribir el juego en Kotlin, Java, Flutter o React Native.
- Publicar automáticamente en Google Play.
- Rediseñar la interfaz táctil; se tratará en `optimize-game-interface-for-android`.
- Retirar Docker, Electron o el servidor local antes de verificar Android.

## Decisions

### Usar Capacitor 8 con `dist/` como `webDir`

Capacitor permite conservar la aplicación web estática y generar un proyecto Android convencional. Se fijarán versiones exactas de `@capacitor/core`, `@capacitor/cli` y `@capacitor/android` de la rama estable 8, cuyo objetivo Android es API 36. Se descarta una reescritura nativa porque duplicaría motor, catálogo, pruebas y presentación; también se descarta una simple WebView remota porque rompería el requisito sin conexión.

### Versionar el proyecto `android/`

El proyecto generado se mantendrá en Git junto con `capacitor.config.*`, de modo que `compileSdk`, `targetSdk`, identidad, recursos y ajustes Gradle sean auditables. `npx cap sync android` copiará `dist/` y actualizará plugins antes de construir. Regenerar Android en cada ejecución sería más frágil frente a cambios de plantillas.

### Apuntar a API 36 y conservar el mínimo estable de Capacitor 8

El proyecto declarará `compileSdk` y `targetSdk` 36 para Android 16. El `minSdk` será el soportado por la plantilla estable de Capacitor 8 y quedará explícito en Gradle y en la documentación, evitando prometer compatibilidad que no se pruebe.

### Producir depuración por defecto y publicación mediante configuración externa

`assembleDebug` dará un APK firmado con la clave de depuración para desarrollo e instalación directa. La variante release leerá ruta, alias y contraseñas desde propiedades o variables locales ignoradas por Git. No se incluirá ninguna clave real y la documentación explicará que una firma estable es necesaria para actualizar una instalación release.

### Mantener una única fuente de recursos

Las cartas y el código seguirán editándose en `dist/`; la copia bajo `android/app/src/main/assets/public` será generada por la sincronización y no se editará a mano. Una comprobación automatizada detectará recursos faltantes y una prueba en emulador validará el arranque sin red.

## Risks / Trade-offs

- [Cambios de requisitos de Android o Capacitor] → Fijar versiones exactas, documentar el SDK y revisar la matriz oficial antes de actualizar.
- [El APK contiene recursos web obsoletos] → Hacer que el comando de construcción ejecute siempre la sincronización antes de Gradle.
- [Exposición accidental de la firma] → Ignorar propiedades, almacenes y contraseñas locales; documentar únicamente nombres de variables.
- [El contenido funciona en navegador pero falla en WebView] → Añadir una prueba instrumental o de emulador que cargue portada, baraja e inicio de partida sin red.
- [El repositorio crece por archivos generados] → Versionar solo el proyecto nativo necesario y excluir resultados de Gradle y copias regenerables.

## Migration Plan

1. Incorporar las dependencias fijadas y configurar Capacitor con `dist/`.
2. Generar y ajustar el proyecto Android para API 36, identidad y recursos gráficos.
3. Añadir comandos de sincronización y construcción, más exclusiones de secretos y artefactos.
4. Construir e instalar el APK de depuración; validar una partida sin red.
5. Validar la ruta release con credenciales de prueba externas y documentar el proceso.
6. Si la adopción falla, retirar el proyecto `android/` y las dependencias Capacitor; las distribuciones actuales seguirán intactas hasta el cambio de retirada.
