# Distribución Android

El proyecto usa Capacitor 8.5.3 para empaquetar el contenido autocontenido de `dist/` como una aplicación Android. El identificador es `es.gayox.barajarally`, la versión inicial es `1.0` (`versionCode` 1), el SDK mínimo es API 24 y los SDK de compilación y destino son API 36.

## Requisitos

- Node.js 22 y npm 10 o posterior.
- Android Studio con Android SDK Platform 36 y Android SDK Build-Tools 36.0.0.
- JDK 21 configurado por Android Studio o mediante `JAVA_HOME`.
- Para instalar desde consola: Android SDK Platform-Tools y un dispositivo con depuración USB o un emulador iniciado.

Comprueba las herramientas en PowerShell:

```powershell
node --version
npm --version
java -version
adb version
```

## Preparar el proyecto

Desde la raíz del repositorio, instala exactamente las dependencias del lockfile y sincroniza `dist/` con Android:

```powershell
npm ci
npm run android:sync
npm run android:verify-assets
```

`android:verify-assets` comprueba las 32 cartas, portada, reverso, reglas, manifiesto, HTML y módulos tanto en `dist/` como en la copia Android. No edites `android/app/src/main/assets/public`: se regenera en cada sincronización.

Si cambia el activo fuente de `assets/logo.png`, regenera iconos y pantallas de lanzamiento antes de compilar:

```powershell
npm run android:assets
```

## Construir un APK de depuración

```powershell
npm run android:build:debug
```

El script sincroniza los recursos, los verifica y ejecuta Gradle. El APK firmado con la clave de depuración se genera en:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

Instálalo o actualízalo en el dispositivo conectado:

```powershell
adb devices
adb install -r ".\android\app\build\outputs\apk\debug\app-debug.apk"
```

## Construir y firmar una versión release

La firma se recibe exclusivamente mediante variables de entorno o propiedades Gradle locales. No guardes el almacén ni las contraseñas en Git.

Para crear una clave de desarrollo destinada a comprobar el flujo, guárdala fuera del repositorio:

```powershell
keytool -genkeypair -v -keystore "$env:USERPROFILE\baraja-rally-release.jks" -alias baraja-rally -keyalg RSA -keysize 2048 -validity 10000
```

Configura las cuatro variables en la misma terminal y construye:

```powershell
$env:BARAJA_RELEASE_STORE_FILE = "$env:USERPROFILE\baraja-rally-release.jks"
$env:BARAJA_RELEASE_STORE_PASSWORD = "<contraseña-del-almacén>"
$env:BARAJA_RELEASE_KEY_ALIAS = "baraja-rally"
$env:BARAJA_RELEASE_KEY_PASSWORD = "<contraseña-de-la-clave>"
npm run android:build:release
```

El APK firmado queda en:

```text
android/app/build/outputs/apk/release/app-release.apk
```

Verifica la firma e instala el paquete:

```powershell
& "$env:ANDROID_HOME\build-tools\36.0.0\apksigner.bat" verify --verbose --print-certs ".\android\app\build\outputs\apk\release\app-release.apk"
adb install -r ".\android\app\build\outputs\apk\release\app-release.apk"
```

Una actualización release solo puede instalarse sobre otra firmada con la misma clave y con un `versionCode` superior. Si faltan credenciales, `assembleRelease` puede producir un APK sin firmar; utiliza el APK debug para pruebas o configura las cuatro variables antes de distribuir.

## Comprobación sin conexión

1. Instala el APK y ábrelo una vez.
2. Activa modo avión y vuelve a abrir la aplicación.
3. Comprueba la portada y que el inicio indique 32 cartas.
4. Inicia una partida, selecciona características y juega hasta el resultado final.
5. Verifica que no aparece ningún error de carga de imágenes o del manifiesto.

## Diagnóstico

- **`node` o `npm` no existe**: instala Node.js 22 y abre una terminal nueva.
- **`SDK location not found`**: define `ANDROID_HOME` o crea `android/local.properties` con `sdk.dir=C:\\ruta\\al\\Sdk`; este archivo está ignorado.
- **Licencias pendientes**: ejecuta `sdkmanager --licenses` desde las herramientas del SDK.
- **API 36 ausente**: instala `platforms;android-36`, `build-tools;36.0.0` y `platform-tools` desde SDK Manager.
- **Versión Java incompatible**: selecciona JDK 21; Capacitor 8 compila sus fuentes Android con esa versión.
- **Dispositivo no visible**: confirma la depuración USB, acepta la autorización y repite `adb devices`.
- **Recursos desactualizados**: ejecuta `npm run android:sync` y `npm run android:verify-assets` antes de reconstruir.
- **Firma release ausente**: revisa que las cuatro variables `BARAJA_RELEASE_*` estén presentes en la misma terminal.
