# Explora Riviera Maya

Actividad sumativa de la Unidad 2 de Aplicaciones Web. Se amplió el catálogo inicial de Explora Riviera Maya para incorporar las reservaciones y el reto del PDF. Mantiene su presentación sencilla con tarjetas e iconos emoji y utiliza HTML5, CSS3 y JavaScript puro.

## Ejecutar

1. Abrir la carpeta `reservas-riviera` en VS Code.
2. Iniciar `index.html` con la extensión Live Server.
3. Usar el catálogo desde la dirección local que abra la extensión.

Se necesita un servidor de archivos estáticos para que `fetch('./data/experiencias.json')` funcione. Abrir el HTML con doble clic puede bloquear la carga del JSON.

## Funciones

- Diez experiencias cargadas de forma asíncrona desde JSON.
- Búsqueda por nombre, filtro por categoría y precio máximo, y orden por precio.
- Reservas que acumulan cantidades sin duplicar la experiencia.
- Validación de cantidades enteras y cupo acumulado.
- Botones para aumentar, disminuir y eliminar desde Mi reservación.
- Importe total y total de personas calculados con `reduce()`.
- Vaciado con confirmación y mensajes dentro de la página.
- Catálogo de tres, dos y una columna en escritorio, tableta y celular.

## Archivos

```
reservas-riviera/
├── index.html
├── styles.css
├── app.js
└── data/
    └── experiencias.json
```

El estado se conserva únicamente en arreglos de JavaScript. Al recargar se pierde la selección. No se utiliza localStorage, frameworks, backend ni base de datos.

El JSON contiene las seis experiencias base de la guía, con sus nombres, precios y cupos. Se añadieron Snorkel en arrecife ($560, cupo 10), Comunidad maya ($550, cupo 20), Yoga frente al mar ($390, cupo 12) y Paseo en velero ($890, cupo 8). Comunidad maya se recuperó del catálogo original y Bienestar se agregó como categoría nueva.

El HTML contiene un encabezado, los controles, el catálogo, el resumen de reservas y un pie de página. JavaScript crea las tarjetas y las reservas, asigna sus eventos y actualiza los totales. El diseño usa CSS Grid y media queries.

## Ejemplo de cálculo

Dos personas en Cenote Azul: 2 × $350 = $700. Al agregar otra persona a la misma experiencia, queda una sola reserva de 3 personas y $1,050. Agregar una persona en Kayak en manglar lleva el total a $1,730 y cuatro personas reservadas.

El total de personas suma las cantidades de todas las experiencias; una persona seleccionada en dos experiencias se cuenta dos veces. Es un prototipo académico con precios de demostración, sin reservaciones reales.

## Repositorio y pruebas

Repositorio: https://github.com/alannloeza/reservas-riviera.

Las 24 pruebas verificadas el 14 de octubre de 2026 se describen en [PRUEBAS.md](PRUEBAS.md). Se comprobaron anchos de 1280, 768 y 390 píxeles: tres, dos y una columna, sin desbordamiento horizontal. Las capturas de celular corresponden a una vista adaptable del navegador.
