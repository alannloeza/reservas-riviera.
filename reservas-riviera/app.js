// Datos y estado de la aplicación. No se guardan al recargar.
let experiencias = [];
let reservas = [];
let textoBusqueda = "";
let categoriaActual = "todas";
let ordenActual = "normal";
let precioMaximo = null;

const catalogo = document.querySelector("#catalogo");
const buscador = document.querySelector("#buscador");
const botonesCategoria = document.querySelectorAll("[data-categoria]");
const ordenPrecio = document.querySelector("#ordenPrecio");
const filtroPrecio = document.querySelector("#precioMaximo");
const listaReservas = document.querySelector("#listaReservas");
const total = document.querySelector("#total");
const totalPersonas = document.querySelector("#totalPersonas");
const estado = document.querySelector("#contador");
const mensajeFiltro = document.querySelector("#mensajeFiltro");
const mensajeReserva = document.querySelector("#mensajeReserva");
const botonVaciar = document.querySelector("#vaciarReservacion");
const dialogoVaciar = document.querySelector("#dialogoVaciar");

function formatearMoneda(importe) {
  return `$${importe.toLocaleString("es-MX")} MXN`;
}

function mostrarMensaje(elemento, texto, esError = false) {
  elemento.textContent = texto;
  elemento.hidden = texto === "";
  elemento.classList.toggle("error", esError);
}

// fetch obtiene el JSON; try/catch permite mostrar un error si falla.
async function cargarExperiencias() {
  const esReintento = document.activeElement.id === "reintentarCarga";
  estado.textContent = "Cargando experiencias...";
  catalogo.setAttribute("aria-busy", "true");
  try {
    const respuesta = await fetch("./data/experiencias.json");
    if (!respuesta.ok) throw new Error("No fue posible cargar el catálogo.");
    const datos = await respuesta.json();
    if (!Array.isArray(datos) || datos.length === 0) throw new Error("El catálogo no es válido.");
    experiencias = datos;
    actualizarCatalogo();
    if (esReintento) buscador.focus({ preventScroll: true });
  } catch (error) {
    experiencias = [];
    estado.textContent = "Error al cargar las experiencias.";
    catalogo.innerHTML = `<div class="sin-resultados">
      <p>No se pudo cargar el JSON. Ejecuta el proyecto con un servidor local.</p>
      <button id="reintentarCarga" class="boton-secundario" type="button">Reintentar</button>
    </div>`;
    document.querySelector("#reintentarCarga").addEventListener("click", cargarExperiencias);
    console.error(error);
  } finally {
    catalogo.setAttribute("aria-busy", "false");
  }
}

// Se filtra y ordena una copia para conservar el orden original del JSON.
function obtenerResultados() {
  let resultados = [...experiencias];
  if (categoriaActual !== "todas") {
    resultados = resultados.filter(e => e.categoria === categoriaActual);
  }
  if (textoBusqueda !== "") {
    resultados = resultados.filter(e => e.nombre.toLowerCase().includes(textoBusqueda));
  }
  if (precioMaximo !== null) {
    resultados = resultados.filter(e => e.precio <= precioMaximo);
  }
  if (ordenActual === "ascendente") resultados.sort((a, b) => a.precio - b.precio);
  if (ordenActual === "descendente") resultados.sort((a, b) => b.precio - a.precio);
  return resultados;
}

function actualizarCatalogo() {
  // Si fetch falló, conservar el aviso y el botón Reintentar.
  if (experiencias.length === 0) return;
  const resultados = obtenerResultados();
  estado.textContent = `${resultados.length} experiencias encontradas`;
  if (resultados.length === 0) {
    catalogo.innerHTML = '<p class="sin-resultados">No se encontraron experiencias.</p>';
    return;
  }
  catalogo.innerHTML = resultados.map(e => `
    <article class="tarjeta">
      <div class="imagen" aria-hidden="true">${e.icono}</div>
      <div class="informacion">
        <span class="categoria">${e.categoria === "gastronomia" ? "Gastronomía" : e.categoria}</span>
        <h3>${e.nombre}</h3>
        <p class="cupo">Cupo por experiencia: ${e.cupo} personas</p>
        <p class="precio">${formatearMoneda(e.precio)} / persona</p>
        <div class="cantidad-campo">
          <label for="cantidad-${e.id}">Personas:</label>
          <input id="cantidad-${e.id}" type="number" min="1" max="${e.cupo}" step="1" value="1" aria-label="Personas para ${e.nombre}">
        </div>
        <button class="btn-reservar" data-id="${e.id}" type="button" aria-label="Agregar ${e.nombre}">Agregar</button>
        <p id="mensaje-${e.id}" class="mensaje error" role="status" hidden></p>
      </div>
    </article>`).join("");
  agregarEventosReservar();
}

// Los eventos se asignan después de crear las tarjetas en el DOM.
function agregarEventosReservar() {
  document.querySelectorAll(".btn-reservar").forEach(boton => {
    boton.addEventListener("click", () => agregarReserva(Number(boton.dataset.id)));
  });
}

function agregarReserva(id) {
  const experiencia = experiencias.find(e => e.id === id);
  const input = document.querySelector(`#cantidad-${id}`);
  if (!experiencia || !input) return;
  const cantidad = Number(input.value);
  const mensaje = document.querySelector(`#mensaje-${id}`);
  if (input.value === "" || !Number.isInteger(cantidad) || cantidad < 1) {
    mostrarMensaje(mensaje, "Escribe un número entero de personas mayor que cero.", true);
    input.setAttribute("aria-invalid", "true");
    input.focus();
    return;
  }
  const existente = reservas.find(r => r.experienciaId === id);
  const nuevaCantidad = (existente ? existente.cantidad : 0) + cantidad;
  if (nuevaCantidad > experiencia.cupo) {
    mostrarMensaje(mensaje, `No puedes superar el cupo de ${experiencia.cupo} personas, incluyendo las ya seleccionadas.`, true);
    input.setAttribute("aria-invalid", "true");
    input.focus();
    return;
  }
  if (existente) {
    existente.cantidad = nuevaCantidad;
    existente.subtotal = nuevaCantidad * experiencia.precio;
  } else {
    reservas.push({ experienciaId: id, nombre: experiencia.nombre, precio: experiencia.precio,
      cantidad: cantidad, subtotal: experiencia.precio * cantidad });
  }
  input.removeAttribute("aria-invalid");
  mostrarMensaje(mensaje, "");
  mostrarReservas();
  mostrarMensaje(mensajeReserva, `Agregaste ${cantidad} persona(s) a ${experiencia.nombre}.`);
}

// map dibuja las reservas y reduce calcula los totales.
function mostrarReservas() {
  if (reservas.length === 0) {
    listaReservas.innerHTML = "<p>No hay experiencias seleccionadas.</p>";
  } else {
    listaReservas.innerHTML = reservas.map(r => `
      <article class="item-reserva">
        <div><h3>${r.nombre}</h3><p>${r.cantidad} persona(s) × ${formatearMoneda(r.precio)}</p></div>
        <div class="acciones-reserva">
          <div class="selector-cantidad">
            <button class="btn-cantidad" data-id="${r.experienciaId}" data-cambio="-1" type="button" aria-label="Disminuir personas para ${r.nombre}">−</button>
            <output aria-label="Personas seleccionadas en ${r.nombre}">${r.cantidad}</output>
            <button class="btn-cantidad" data-id="${r.experienciaId}" data-cambio="1" type="button" aria-label="Aumentar personas para ${r.nombre}">+</button>
          </div>
          <strong>${formatearMoneda(r.subtotal)}</strong>
          <button class="btn-eliminar" data-id="${r.experienciaId}" type="button" aria-label="Eliminar ${r.nombre}">Eliminar</button>
        </div>
      </article>`).join("");
  }
  total.textContent = formatearMoneda(reservas.reduce((suma, r) => suma + r.subtotal, 0));
  totalPersonas.textContent = reservas.reduce((suma, r) => suma + r.cantidad, 0);
  botonVaciar.disabled = reservas.length === 0;
  agregarEventosResumen();
}

function agregarEventosResumen() {
  document.querySelectorAll(".btn-eliminar").forEach(boton => {
    boton.addEventListener("click", () => eliminarReserva(Number(boton.dataset.id)));
  });
  document.querySelectorAll(".btn-cantidad").forEach(boton => {
    boton.addEventListener("click", () => {
      const id = Number(boton.dataset.id);
      const cambio = Number(boton.dataset.cambio);
      cambiarCantidad(id, cambio);
      // El render sustituye el botón: restaurar el foco ayuda a usar el teclado.
      document.querySelector(`.btn-cantidad[data-id="${id}"][data-cambio="${cambio}"]`).focus({ preventScroll: true });
    });
  });
}

function cambiarCantidad(id, cambio) {
  const reserva = reservas.find(r => r.experienciaId === id);
  const experiencia = experiencias.find(e => e.id === id);
  if (!reserva || !experiencia) return;
  const cantidad = reserva.cantidad + cambio;
  if (cantidad < 1 || cantidad > experiencia.cupo) {
    mostrarMensaje(mensajeReserva, `La cantidad debe estar entre 1 y ${experiencia.cupo}. Para quitar la experiencia, usa Eliminar.`, true);
    return;
  }
  reserva.cantidad = cantidad;
  reserva.subtotal = reserva.precio * cantidad;
  mostrarReservas();
  mostrarMensaje(mensajeReserva, `${reserva.nombre}: cantidad actualizada a ${cantidad}.`);
}

function eliminarReserva(id) {
  reservas = reservas.filter(r => r.experienciaId !== id);
  mostrarReservas();
  mostrarMensaje(mensajeReserva, "Experiencia eliminada de la reservación.");
  if (reservas.length > 0) botonVaciar.focus({ preventScroll: true });
  else buscador.focus({ preventScroll: true });
}

function limpiarFiltros() {
  textoBusqueda = "";
  categoriaActual = "todas";
  ordenActual = "normal";
  precioMaximo = null;
  buscador.value = "";
  botonesCategoria.forEach(boton => {
    boton.classList.toggle("activo", boton.dataset.categoria === "todas");
    boton.setAttribute("aria-pressed", boton.dataset.categoria === "todas");
  });
  ordenPrecio.value = "normal";
  filtroPrecio.value = "";
  filtroPrecio.removeAttribute("aria-invalid");
  mostrarMensaje(mensajeFiltro, "");
  actualizarCatalogo();
}

buscador.addEventListener("input", () => {
  textoBusqueda = buscador.value.trim().toLowerCase();
  actualizarCatalogo();
});
botonesCategoria.forEach(boton => {
  boton.addEventListener("click", () => {
    categoriaActual = boton.dataset.categoria;
    botonesCategoria.forEach(elemento => {
      elemento.classList.toggle("activo", elemento === boton);
      elemento.setAttribute("aria-pressed", elemento === boton);
    });
    actualizarCatalogo();
  });
});
ordenPrecio.addEventListener("change", () => {
  ordenActual = ordenPrecio.value;
  actualizarCatalogo();
});
filtroPrecio.addEventListener("input", () => {
  const valor = Number(filtroPrecio.value);
  if (filtroPrecio.validity.badInput || !Number.isFinite(valor) || valor < 0) {
    mostrarMensaje(mensajeFiltro, "El precio máximo debe ser un número mayor o igual a cero.", true);
    filtroPrecio.setAttribute("aria-invalid", "true");
    return;
  }
  precioMaximo = filtroPrecio.value === "" ? null : valor;
  filtroPrecio.removeAttribute("aria-invalid");
  mostrarMensaje(mensajeFiltro, "");
  actualizarCatalogo();
});
document.querySelector("#limpiarFiltros").addEventListener("click", limpiarFiltros);
botonVaciar.addEventListener("click", () => {
  if (reservas.length === 0) return;
  dialogoVaciar.returnValue = "";
  dialogoVaciar.showModal();
});
dialogoVaciar.addEventListener("close", () => {
  if (dialogoVaciar.returnValue !== "confirmar") return;
  reservas = [];
  mostrarReservas();
  mostrarMensaje(mensajeReserva, "La reservación se vació.");
  buscador.focus({ preventScroll: true });
});

mostrarReservas();
cargarExperiencias();
