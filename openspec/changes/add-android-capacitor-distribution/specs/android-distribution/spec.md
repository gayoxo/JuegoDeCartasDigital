# Spec Delta

## Purpose

Permite construir, instalar y ejecutar el juego como una aplicación Android autocontenida y compatible con dispositivos Android actuales.

## ADDED Requirements

### Requirement: APK Android reproducible
El proyecto SHALL proporcionar una configuración versionada que genere un APK de depuración instalable a partir del contenido actual de `dist/` y de un entorno Android documentado.

#### Scenario: Construcción limpia
- **WHEN** se instalan las versiones documentadas de las herramientas y se ejecuta el comando de construcción desde un clon limpio
- **THEN** se genera un APK en la ruta documentada sin necesitar artefactos no versionados salvo dependencias y SDK descargables

### Requirement: Compatibilidad con Android actual
La aplicación SHALL compilar y apuntar como mínimo a Android 16/API 36, manteniendo una versión mínima de Android declarada y compatible con la versión estable elegida del contenedor nativo.

#### Scenario: Ejecución en Android 16
- **WHEN** se instala el APK en un dispositivo o emulador con Android 16
- **THEN** la aplicación se inicia, muestra la portada y permite comenzar una partida

#### Scenario: Dispositivo no compatible
- **WHEN** se intenta instalar en una versión inferior al SDK mínimo declarado
- **THEN** Android rechaza la instalación de forma estándar sin producir una instalación parcial

### Requirement: Juego autocontenido sin conexión
El APK SHALL incluir la interfaz, la lógica, el manifiesto de baraja y todas las imágenes necesarias para completar una partida sin acceso a red.

#### Scenario: Partida en modo sin conexión
- **WHEN** el dispositivo no dispone de conectividad después de instalar el APK
- **THEN** la persona puede abrir la aplicación, iniciar una partida y jugar hasta su final

### Requirement: Identidad y versionado Android
La aplicación SHALL declarar un identificador de paquete estable, nombre visible, iconos, pantalla de lanzamiento, código de versión y nombre de versión actualizables.

#### Scenario: Instalación de una versión posterior
- **WHEN** se construye una versión con código superior y la misma identidad de paquete y firma
- **THEN** Android permite actualizar la instalación conservando su identidad como aplicación

### Requirement: Variante de publicación firmable
El proyecto SHALL permitir generar una variante de publicación que reciba las credenciales de firma fuera del repositorio y SHALL impedir que claves o contraseñas formen parte de los archivos versionados.

#### Scenario: Construcción con credenciales válidas
- **WHEN** se proporcionan externamente un almacén de claves y sus credenciales conforme a la documentación
- **THEN** la construcción genera un APK de publicación firmado e instalable

#### Scenario: Construcción sin credenciales
- **WHEN** no se proporcionan credenciales de publicación
- **THEN** la construcción de depuración sigue disponible y ningún secreto se genera ni se añade al repositorio

### Requirement: Documentación de construcción e instalación
El proyecto SHALL documentar la preparación del entorno, sincronización de recursos, construcción, localización del APK, instalación y diagnóstico básico.

#### Scenario: Uso de la guía Android
- **WHEN** una persona sigue la guía en un entorno compatible
- **THEN** puede construir el APK, localizarlo e instalarlo en un emulador o dispositivo autorizado
