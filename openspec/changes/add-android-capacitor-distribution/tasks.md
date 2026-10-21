# Tasks

## 1. Herramientas y configuración de Capacitor

- [x] 1.1 Añadir y fijar las dependencias estables de Capacitor 8 en `package.json` y el lockfile, y verificar que `npm ci` termina correctamente con la versión de Node.js documentada.
- [x] 1.2 Crear la configuración de Capacitor con una identidad de paquete estable y `dist/` como `webDir`, y verificar que la configuración es válida mediante el comando de sincronización.
- [x] 1.3 Añadir scripts npm para sincronizar Android y construir APK debug/release, y verificar que cada script invoca la secuencia documentada sin depender de rutas personales.

## 2. Proyecto Android

- [x] 2.1 Generar y versionar el proyecto `android/` de Capacitor, excluyendo resultados y cachés, y verificar que Gradle reconoce los módulos desde un clon limpio.
- [x] 2.2 Configurar `compileSdk` y `targetSdk` 36, declarar el `minSdk` soportado y fijar las versiones de Java/Gradle necesarias, verificando una compilación `assembleDebug` sin advertencias de SDK incompatibles.
- [x] 2.3 Configurar nombre, identificador, versión, iconos y pantalla de lanzamiento del juego, y verificar esos valores en el APK instalado o mediante inspección del paquete.
- [x] 2.4 Asegurar que la sincronización copia HTML, módulos, manifiesto e imágenes desde `dist/`, y añadir una comprobación que falle si falta cualquiera de los recursos de la baraja.

## 3. Construcción, firma y documentación

- [x] 3.1 Configurar la variante release para leer almacén, alias y contraseñas solo desde propiedades o variables externas ignoradas por Git, y verificar que ningún secreto o archivo de claves aparezca entre los archivos versionados.
- [x] 3.2 Documentar en `docs/android.md` los prerrequisitos, sincronización, construcción debug/release, firma, rutas de salida, instalación por ADB y diagnóstico, y verificar los comandos en un entorno Android compatible.
- [x] 3.3 Actualizar el README con el flujo Android y enlazar la guía detallada, verificando que una persona puede localizar el APK empezando únicamente desde el README.

## 4. Validación integrada

- [x] 4.1 Construir el APK debug desde una instalación limpia y verificar que el archivo se genera en la ruta documentada y Android acepta su instalación.
- [x] 4.2 Ejecutar el APK sin conectividad en un emulador o dispositivo Android 16 y verificar portada, carga de las 32 cartas, inicio y finalización de una partida.
- [ ] 4.3 Construir una variante release con una clave de prueba externa, verificar su firma e instalación y confirmar que la clave y las credenciales permanecen fuera del repositorio.

## Workflow follow-up

- Aplicar después `optimize-game-interface-for-android` para completar la experiencia móvil.
- Archivar este cambio cuando la revisión y las validaciones del proyecto estén satisfechas.
