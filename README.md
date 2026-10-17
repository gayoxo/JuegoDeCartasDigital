# Coches Rally

Adaptación web del juego clásico de cartas de características, construida con los escaneos de la baraja incluidos en la raíz del proyecto.

## Ejecutar

La web es estática, pero necesita servirse por HTTP para cargar el JSON de la baraja. Cualquier servidor estático sirve; publica la carpeta `dist/` como raíz. En Windows, con un JDK moderno instalado:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\tools\serve.ps1"
```

Después abre `http://127.0.0.1:4173/`.

## Corregir los datos de una carta

La baraja se define en `dist/data/decks/rally-cars.json`. Busca la carta por su `id`, modifica únicamente el valor dentro de `values` y vuelve a ejecutar las pruebas. No hace falta regenerar las imágenes ni cambiar JavaScript.

Cada valor debe ser un número JSON, sin puntos de millares ni unidades: usa `4973`, no `"4.973 c.c."`. La interfaz toma la etiqueta y unidad de `stats`.

## Añadir otra baraja

1. Crea un JSON con `schemaVersion: 1`; puedes copiar `tests/fixtures/mini-deck.json` como ejemplo mínimo.
2. Asigna un `id` único y completa `name`, `cover`, `back` y `rulesImage`.
3. Declara al menos una entrada en `stats`. Cada una necesita `key`, `label`, `unit` y `direction`; usa `high` si gana el valor mayor o `low` si gana el menor.
4. Añade al menos dos cartas. Sus identificadores no pueden repetirse y `values` debe contener un número para cada clave declarada en `stats`.
5. Copia los activos bajo `dist/` y utiliza rutas relativas a esa carpeta.
6. Cambia `deckUrl` en `dist/app.js`, o proporciona esa URL mediante la configuración de arranque cuando se incorpore un selector de barajas.
7. Ejecuta las pruebas. El cargador rechaza la baraja antes de iniciar si encuentra un dato o activo inválido.

El motor recibe características y cartas ya validadas, por lo que no contiene nombres de coches ni claves de estadísticas específicas de esta baraja.

Para regenerar los recortes a partir de los JPG originales:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\tools\extract-cards.ps1"
```

## Pruebas

El proyecto usa el ejecutor incluido en Node.js y no instala dependencias. Con Node 22:

```powershell
npm test
```

Si no hay Node local pero está disponible Docker:

```powershell
docker run --rm -v "${PWD}:/workspace:ro" -w /workspace node:22-alpine npm test
```

## Notas sobre los datos

Los 32 registros se transcribieron de los escaneos. Conviene contrastarlos con las cartas físicas; el JSON está pensado para poder corregirse manualmente sin modificar el juego.
