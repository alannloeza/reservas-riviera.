# Pruebas del proyecto

Fecha: 14 de octubre de 2026. Comprobadas en el navegador con el proyecto servido por HTTP. Las vistas de celular y tableta se verificaron mediante tamaños de ventana; no se usó un teléfono físico.

| Prueba | Acción | Resultado |
|---|---|---|
| Carga JSON | Abrir con servidor local. | Correcto: 10 experiencias; resumen vacío. |
| Búsqueda | Escribir KAYAK en mayúsculas. | Correcto: solo Kayak en manglar. |
| Sin resultados | Buscar noexiste123. | Correcto: mensaje visible, sin tarjetas. |
| Categoría | Elegir Naturaleza. | Correcto: tres experiencias. |
| Orden ascendente | Elegir Menor precio. | Correcto: de $350 a $890. |
| Orden descendente | Elegir Mayor precio. | Correcto: de $890 a $350. |
| Filtros combinados | Aventura + ruta + máximo $800. | Correcto: solo Ruta en tirolesa. |
| Límite de precio | Bajar máximo de $800 a $700. | Correcto: se excluye la tirolesa de $750. |
| Categoría nueva | Elegir Bienestar. | Correcto: Yoga frente al mar. |
| Precio inválido | Introducir precio máximo -1. | Correcto: mensaje en la página. |
| Limpiar filtros | Restablecer los controles. | Correcto: vuelven las 10 tarjetas. |
| Reserva | Agregar 2 personas a Cenote Azul. | Correcto: 2 personas y $700. |
| Acumulación | Agregar otra persona a Cenote Azul. | Correcto: una reserva, 3 personas, $1,050. |
| Total combinado | Agregar una persona en Kayak. | Correcto: 4 personas y $1,730. |
| Cantidades inválidas | Probar vacío, 0, -1 y 1.5 personas. | Correcto: se rechazan sin cambiar el total. |
| Cupo acumulado | Completar 15 en Cenote e intentar sumar 1. | Correcto: acepta 15 y rechaza 16. |
| Límites del resumen | Subir en cupo máximo y bajar desde 1. | Correcto: mantiene los límites. |
| Cambiar cantidad | Disminuir y aumentar en Mi reservación. | Correcto: recalcula el importe. |
| Eliminar | Quitar Cenote y conservar Kayak. | Correcto: queda una reserva por $680. |
| Cancelar vaciado | Abrir confirmación y cancelar. | Correcto: conserva la reserva. |
| Confirmar vaciado | Elegir Sí, vaciar. | Correcto: total $0 y botón inactivo. |
| Estado temporal | Agregar una reserva y recargar. | Correcto: se borran las reservas. |
| Responsividad | Probar anchos 1280, 768 y 390. | Correcto: 3, 2 y 1 columnas, sin desbordar. |
| Error de carga | Apartar el JSON y recargar; después restaurarlo. | Correcto: aviso y botón Reintentar visibles. |

El archivo JSON se restauró después de la prueba de error y volvió a responder HTTP 200. La prueba de error verifica el mensaje y la presencia de Reintentar; no incluye una nueva ejecución del botón.
