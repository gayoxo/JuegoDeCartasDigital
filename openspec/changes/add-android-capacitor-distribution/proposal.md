# Proposal

## Why

El juego ya funciona con recursos web autocontenidos, pero no ofrece un paquete instalable para teléfonos Android actuales. Una distribución Android permitirá jugar sin conexión desde una aplicación instalada y aprovechar la base existente sin mantener una segunda implementación del juego.

## What Changes

- Añadir un proyecto Android basado en Capacitor que empaquete los recursos de `dist/` dentro de la aplicación.
- Fijar una versión estable de Capacitor compatible con Android 16/API 36 y una configuración reproducible del SDK Android.
- Proporcionar comandos documentados para sincronizar los recursos, construir un APK de depuración instalable y generar una variante de publicación firmable.
- Configurar identidad, versión, iconos y pantalla de lanzamiento propios del juego.
- Verificar que el APK permite iniciar y completar una partida sin conexión ni servicios externos.
- Mantener temporalmente las distribuciones existentes; su retirada se abordará en un cambio posterior una vez validado el APK.

## Capabilities

### New Capabilities

- `android-distribution`: construcción, instalación, ejecución sin conexión y preparación de publicación de la aplicación Android.

### Modified Capabilities

Ninguna.

## Impact

- Se incorporarán dependencias npm de Capacitor, su configuración y el proyecto nativo `android/`.
- `dist/` seguirá siendo la fuente compartida de interfaz, lógica, manifiesto e imágenes que se copia al paquete Android.
- El entorno de construcción necesitará Node.js, Java y Android Studio/SDK; el APK resultante no necesitará Node.js ni conexión de red.
- La automatización y documentación deberán evitar incluir credenciales o almacenes de claves en Git.
