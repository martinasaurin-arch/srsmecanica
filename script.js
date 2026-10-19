/* 
   SRS MECÁNICA - 
   Cada bloque se puede copiar cada bloque a otro proyecto por separado, siempre que
   el HTML tenga los mismos id. */


/* NIVEL 1: INTERACCIONES BÁSICAS (DOM y eventos) */

/*  Menú  */
const btnMenu = document.getElementById("btn-menu");
const menu = document.getElementById("menu");

btnMenu.addEventListener("click", function () {

  // toggle: si tiene la clase la saca, si no la tiene la agrega
  const abierto = menu.classList.toggle("abierto");
  btnMenu.setAttribute("aria-expanded", abierto);
  btnMenu.textContent = abierto ? "✕" : "☰";
});

// Al tocar un enlace del menú, se cierra (útil en el celular)
menu.querySelectorAll("a").forEach(function (enlace) {
  enlace.addEventListener("click", function () {
    menu.classList.remove("abierto");
    btnMenu.setAttribute("aria-expanded", false);
    btnMenu.textContent = "☰";
  });
});


/* Modo claro / oscuro  */
const btnTema = document.getElementById("btn-tema");

function aplicarTema(oscuro) {
  document.body.classList.toggle("oscuro", oscuro);
  btnTema.textContent = oscuro ? "☀️" : "🌙";
}

//  al cargar la página, recuperamos la elección guardada
aplicarTema(localStorage.getItem("tema") === "oscuro");

btnTema.addEventListener("click", function () {
  const ahoraOscuro = !document.body.classList.contains("oscuro");
  aplicarTema(ahoraOscuro);
  // guardamos la elección para la próxima visita
  localStorage.setItem("tema", ahoraOscuro ? "oscuro" : "claro");
});


/* Botón "volver arriba" */
const btnArriba = document.getElementById("btn-arriba");

window.addEventListener("scroll", function () {
  // Aparece cuando bajamos más de 300 píxeles
  if (window.scrollY > 300) {
    btnArriba.classList.remove("oculto");
  } else {
    btnArriba.classList.add("oculto");
  }
});

btnArriba.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});


/*  Saludo según la hora y año automático */
function obtenerSaludo() {
  const hora = new Date().getHours();

  if (hora < 6) {
    return "¡Buenas noches! 🌙";
  } else if (hora < 12) {
    return "¡Buen día! ☀️";
  } else if (hora < 20) {
    return "¡Buenas tardes! 🌤️";
  } else {
    return "¡Buenas noches! 🌙";
  }
}

document.getElementById("saludo").textContent = obtenerSaludo() + " Bienvenido a SRS Mecánica";
document.getElementById("anio").textContent = new Date().getFullYear();


/*  Galería con imagen ampliada  */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");

document.querySelectorAll(".miniatura").forEach(function (miniatura) {
  miniatura.addEventListener("click", function () {
    lightboxImg.src = miniatura.src;
    lightboxImg.alt = miniatura.alt;
    lightbox.classList.remove("oculto");
  });
});

// Cerrar al hacer clic en cualquier parte de la ventana oscura
lightbox.addEventListener("click", function () {
  lightbox.classList.add("oculto");
});

// Cerrar con la tecla Escape
document.addEventListener("keydown", function (evento) {
  if (evento.key === "Escape") {
    lightbox.classList.add("oculto");
  }
});


/* NIVEL 2: ARRAYS, OBJETOS Y BUCLES */

/*  Catálogo generado con JS  */
// Un ARRAY de OBJETOS: cada producto tiene sus propiedades.
// Para adaptar la demo a otro emprendimiento, solo hay que cambiar esta lista.
// Se conserva el nombre productos del ejemplo; aquí contiene servicios.
const productos = [
  { id: 1, nombre: "Mecánica de motos", categoria: "motos", emoji: "01", descripcion: "Service y reparación de motos de mediana y alta cilindrada, de calle y competición." },
  { id: 2, nombre: "Autos de competición", categoria: "competicion", emoji: "02", descripcion: "Suspensiones, puesta a punto y acompañamiento técnico en pista." },
  { id: 3, nombre: "Suspensiones y amortiguadores", categoria: "motos", emoji: "03", descripcion: "Reparación, mantenimiento y fabricación de componentes para distintos vehículos." },
  { id: 4, nombre: "Adquisición de datos", categoria: "competicion", emoji: "04", descripcion: "Información del vehículo y del piloto para analizar y mejorar el rendimiento." },
  { id: 5, nombre: "Fabricación", categoria: "industria", emoji: "05", descripcion: "Amortiguadores, partes, repuestos y herramientas específicas para suspensiones." },
  { id: 6, nombre: "Mecanizados CNC", categoria: "industria", emoji: "06", descripcion: "Trabajos con torno y fresadora a control numérico. Mecanizados en serie para empresas." },
  { id: 7, nombre: "Asesoramiento y capacitaciones", categoria: "motos", emoji: "07", descripcion: "Asesoramiento técnico y capacitación en mantenimiento de suspensiones de bicicletas." },
  { id: 8, nombre: "Equipamiento para empresas", categoria: "industria", emoji: "08", descripcion: "Fabricación y asesoramiento técnico. Experiencia en equipamiento para operaciones de la vista." }
];

const listaProductos = document.getElementById("lista-productos");
const sinResultados = document.getElementById("sin-resultados");

// Recibe un array de productos y dibuja una tarjeta por cada uno (BUCLE)
function mostrarProductos(lista) {
  listaProductos.innerHTML = ""; // vaciamos lo que había

  for (let i = 0; i < lista.length; i++) {
    const p = lista[i];

    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta";
    tarjeta.innerHTML =
      '<div class="emoji">' + p.emoji + "</div>" +
      "<h3>" + p.nombre + "</h3>" +
      '<p class="descripcion">' + p.descripcion + "</p>" +
      '<p class="precio">Consultar presupuesto</p>' +
      '<a class="btn" href="#contacto">Consultar</a>';

    listaProductos.appendChild(tarjeta);
  }

  // Si no hay productos, mostramos el mensaje
  sinResultados.classList.toggle("oculto", lista.length > 0);
}


/* Filtro por categoría +  Buscador */
// Los dos comparten una función: así funcionan juntos
let categoriaActual = "todos";
let textoBusqueda = "";

function aplicarFiltros() {
  const filtrados = productos.filter(function (p) {
    const coincideCategoria = categoriaActual === "todos" || p.categoria === categoriaActual;
    const coincideTexto = p.nombre.toLowerCase().includes(textoBusqueda.toLowerCase());
    return coincideCategoria && coincideTexto;
  });
  mostrarProductos(filtrados);
}

// Botones de categoría
const botonesFiltro = document.querySelectorAll(".filtro");
botonesFiltro.forEach(function (boton) {
  boton.addEventListener("click", function () {
    categoriaActual = boton.dataset.categoria;
    botonesFiltro.forEach(function (b) { b.classList.remove("activo"); });
    boton.classList.add("activo");
    aplicarFiltros();
  });
});

// Buscador: "input" se dispara con cada letra que se escribe
document.getElementById("buscador").addEventListener("input", function (evento) {
  textoBusqueda = evento.target.value;
  aplicarFiltros();
});

// Dibujamos el catálogo completo al cargar
aplicarFiltros();


/* Preguntas frecuentes (acordeón)  */
document.querySelectorAll(".faq-pregunta").forEach(function (boton) {
  boton.addEventListener("click", function () {
    const item = boton.parentElement;
    const abierto = item.classList.toggle("abierto");
    boton.querySelector("span").textContent = abierto ? "−" : "+";
  });
});


/* NIVEL 3: FUNCIONES Y LÓGICA*/

/* Formulario de contacto con validación */
const formContacto = document.getElementById("form-contacto");
const campoNombre = document.getElementById("nombre");
const campoEmail = document.getElementById("email");
const campoMensaje = document.getElementById("mensaje");
const mensajeExito = document.getElementById("form-exito");

// Cada función de validación devuelve un texto de error, o "" si está todo bien
function validarNombre(valor) {
  if (valor.trim() === "") return "Escribí tu nombre.";
  if (valor.trim().length < 3) return "El nombre es muy corto.";
  return "";
}

function validarEmail(valor) {
  // Expresión regular simple: algo@algo.algo
  const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (valor.trim() === "") return "Escribí tu email.";
  if (!patron.test(valor)) return "El email no es válido.";
  return "";
}

function validarMensaje(valor) {
  if (valor.trim() === "") return "Escribí tu mensaje.";
  if (valor.trim().length < 10) return "El mensaje debe tener al menos 10 caracteres.";
  return "";
}

// Muestra (o borra) el error debajo de un campo
function mostrarError(campo, idError, texto) {
  document.getElementById(idError).textContent = texto;
  campo.classList.toggle("invalido", texto !== "");
}

formContacto.addEventListener("submit", function (evento) {
  evento.preventDefault();
  mensajeExito.classList.add("oculto");

  const errorNombre = validarNombre(campoNombre.value);
  const errorEmail = validarEmail(campoEmail.value);
  const errorMensaje = validarMensaje(campoMensaje.value);

  mostrarError(campoNombre, "error-nombre", errorNombre);
  mostrarError(campoEmail, "error-email", errorEmail);
  mostrarError(campoMensaje, "error-mensaje", errorMensaje);

  // Si no hay ningún error, el formulario es válido
  if (errorNombre === "" && errorEmail === "" && errorMensaje === "") {
    mensajeExito.classList.remove("oculto");
    formContacto.reset();
    // En un sitio real acá se enviarían los datos a un servidor.
  }
});

// Cuenta regresiva para el año del 50 aniversario.
const fechaPromo = new Date("2027-01-01T00:00:00");
const cuentaRegresiva = document.getElementById("cuenta-regresiva");

function actualizarCuentaRegresiva() {
  const ahora = new Date();
  const diferencia = fechaPromo - ahora;

  if (diferencia <= 0) {
    cuentaRegresiva.textContent = "¡Llegó nuestro año aniversario! 50 años de SRS Mecánica.";
    clearInterval(temporizadorCuenta);
    return;
  }

  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
  const minutos = Math.floor((diferencia / (1000 * 60)) % 60);
  const segundos = Math.floor((diferencia / 1000) % 60);

  cuentaRegresiva.textContent =
    dias + " días · " + horas + " h · " +
    minutos + " min · " + segundos + " s";
}

const temporizadorCuenta = setInterval(actualizarCuentaRegresiva, 1000);
actualizarCuentaRegresiva();
