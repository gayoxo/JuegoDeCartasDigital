# Spec Delta

## Purpose

Permite construir y ejecutar el juego como un servicio web Docker autocontenido, reproducible y verificable sin modificar la aplicación estática.

## ADDED Requirements

### Requirement: Construcción reproducible de imagen
El proyecto SHALL proporcionar una definición de imagen Docker que copie únicamente los recursos necesarios para ejecutar la distribución web.

#### Scenario: Construcción desde el repositorio
- **WHEN** se construye la imagen usando el contexto documentado
- **THEN** la construcción finaliza sin generar previamente artefactos fuera del repositorio y contiene la versión actual de `dist/`

### Requirement: Servicio HTTP autocontenido
El contenedor SHALL servir la aplicación por HTTP sin descargar dependencias ni contactar servicios externos durante el arranque o la partida.

#### Scenario: Arranque del contenedor
- **WHEN** se inicia la imagen con un puerto publicado
- **THEN** la portada, el manifiesto, los módulos y todas las imágenes responden correctamente desde ese puerto

### Requirement: Configuración por puerto
La distribución SHALL documentar y ofrecer una ejecución mediante Docker Compose con un puerto de host configurable y un valor predeterminado.

#### Scenario: Puerto predeterminado
- **WHEN** se inicia Compose sin configuración adicional
- **THEN** el juego queda disponible en el puerto de host documentado

#### Scenario: Puerto personalizado
- **WHEN** se configura otro puerto de host válido
- **THEN** el juego queda disponible en ese puerto sin reconstruir la imagen

### Requirement: Comprobación de salud
La imagen SHALL declarar una comprobación de salud que represente la disponibilidad real del documento principal.

#### Scenario: Servicio preparado
- **WHEN** el servidor responde correctamente al documento principal
- **THEN** Docker informa que el contenedor está saludable

### Requirement: Ejecución con privilegios reducidos
El proceso de servicio MUST ejecutarse como un usuario sin privilegios y el sistema de archivos de la aplicación SHALL ser de solo lectura durante una ejecución normal.

#### Scenario: Inspección del proceso
- **WHEN** se consulta el usuario efectivo del proceso dentro del contenedor
- **THEN** no corresponde al usuario raíz

### Requirement: Documentación operativa Docker
El proyecto SHALL documentar cómo construir, iniciar, comprobar, configurar, detener y eliminar los recursos locales de la distribución Docker.

#### Scenario: Uso siguiendo la documentación
- **WHEN** una persona sigue los comandos documentados en un entorno con Docker disponible
- **THEN** puede abrir el juego y posteriormente retirar contenedor e imagen local sin eliminar los archivos fuente
