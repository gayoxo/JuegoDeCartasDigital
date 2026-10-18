# Spec Delta

## Purpose

Permite ejecutar y distribuir el juego como aplicación de escritorio en una ventana nativa, reutilizando la misma experiencia y los mismos datos de la web.

## ADDED Requirements

### Requirement: Ventana de escritorio independiente
La aplicación SHALL abrir el juego en una única ventana de escritorio con título, dimensiones iniciales y tamaño mínimo adecuados para sus controles.

#### Scenario: Inicio de la aplicación
- **WHEN** una persona inicia la distribución de escritorio
- **THEN** se abre una ventana con el juego preparado y sin abrir una pestaña del navegador predeterminado

### Requirement: Recursos locales compartidos
La distribución SHALL cargar la aplicación, los módulos, la baraja y las imágenes desde recursos empaquetados procedentes de `dist/`.

#### Scenario: Partida sin conexión
- **WHEN** el equipo no dispone de conexión a Internet
- **THEN** la aplicación permite iniciar y completar una partida con todos sus recursos visuales

### Requirement: Seguridad del renderizador
La ventana MUST mantener aislado el contenido web de las APIs del sistema operativo y SHALL impedir navegación no autorizada fuera de la aplicación.

#### Scenario: Contexto del juego
- **WHEN** se ejecuta código de la interfaz en el renderizador
- **THEN** no dispone de integración Node ni acceso directo a módulos del sistema

#### Scenario: Solicitud de navegación externa
- **WHEN** el contenido intenta abrir o navegar a un origen no local
- **THEN** la ventana bloquea la navegación dentro de la aplicación

### Requirement: Ciclo de vida nativo
La aplicación SHALL cerrar sus procesos cuando se cierren todas sus ventanas y SHALL poder volver a crear la ventana conforme a las convenciones de la plataforma.

#### Scenario: Cierre de la ventana en Windows
- **WHEN** la persona cierra la ventana principal
- **THEN** finaliza el proceso de la aplicación sin dejar un servidor ni proceso auxiliar ejecutándose

### Requirement: Distribución portable de Windows
El proyecto SHALL proporcionar una configuración reproducible para generar un artefacto portable de Windows que incluya el runtime y los recursos necesarios.

#### Scenario: Construcción del paquete portable
- **WHEN** se ejecuta el comando de empaquetado documentado en un entorno compatible
- **THEN** se genera un artefacto de Windows que puede iniciarse sin instalar Node.js

### Requirement: Documentación operativa de escritorio
El proyecto SHALL documentar desarrollo, ejecución, empaquetado, ubicación de artefactos, actualización de recursos y resolución de fallos comunes.

#### Scenario: Uso siguiendo la documentación
- **WHEN** una persona prepara las dependencias y ejecuta los comandos documentados
- **THEN** puede abrir la ventana de desarrollo y localizar el paquete generado
