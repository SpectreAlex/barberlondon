/* ==========================================================================
   CONTENIDO DEL SITIO — el único archivo que tienes que editar para textos,
   precios y enlaces.

   Todo lo de abajo es un MARCADOR DE POSICIÓN. Cambia cada valor por el tuyo.
   - Deja una URL como ""   -> ese botón/enlace se oculta.
   - Deja una lista como [] -> se oculta toda esa sección (y su enlace del menú).
   - Deja una imagen como "" -> se muestra un recuadro a rayas en su lugar.
   - Las imágenes van en la carpeta img/, p. ej. "img/galeria/corte-01.jpg".
   - "#" como URL deja el botón visible pero no lleva a ningún sitio (útil mientras escribes).
   ========================================================================== */

window.SITE = {
  lang: "es",

  meta: {
    title: "LondonBarberShop — Barbería en Londres",
    description: "Una frase sobre tu barbería para Google y las vistas previas de enlaces."
  },

  brand: {
    name: "LondonBarberShop",
    logo: ""                       // p. ej. "img/logo.svg" — vacío muestra el nombre como texto
  },

  // Textos del menú (los id de las secciones no cambian)
  nav: {
    hero: "Inicio",
    services: "Servicios",
    products: "Tienda",
    gallery: "Nuestro trabajo",
    contact: "Encuéntranos"
  },

  // Botón de WhatsApp: sale en la portada, al final de "Encuéntranos" y como botón flotante.
  whatsapp: { label: "Consulta disponibilidad", url: "#" },   // p. ej. "https://wa.me/447000000000"

  // Botón redondo de WhatsApp fijo abajo a la derecha. false = ocultarlo.
  floatingButtons: true,

  hero: {
    eyebrow: "Barbería · Londres",
    title: "Tu titular va aquí",
    subtitle: "Un subtítulo corto",
    text: "Dos o tres frases presentando la barbería. Escríbelo después.",
    image: ""                      // p. ej. "img/portada.jpg"
  },

  services: {
    eyebrow: "La carta",
    title: "Servicios",
    intro: "Una línea presentando tus servicios y precios.",
    items: [
      { name: "Nombre del servicio", price: "$00", duration: "30 min", description: "Descripción corta" },
      { name: "Nombre del servicio", price: "$00", duration: "45 min", description: "" },
      { name: "Nombre del servicio", price: "$00", duration: "",       description: "" },
      { name: "Nombre del servicio", price: "$00", duration: "",       description: "" },
      { name: "Nombre del servicio", price: "$00", duration: "",       description: "" },
      { name: "Nombre del servicio", price: "$00", duration: "",       description: "" }
    ]
  },

  products: {
    eyebrow: "Llévatelo a casa",
    title: "Tienda",
    intro: "Una línea sobre los productos que vendes.",
    items: [
      { name: "Nombre del producto", price: "$00", description: "Descripción del producto.", image: "" },
      { name: "Nombre del producto", price: "$00", description: "Descripción del producto.", image: "" },
      { name: "Nombre del producto", price: "$00", description: "Descripción del producto.", image: "" },
      { name: "Nombre del producto", price: "$00", description: "Descripción del producto.", image: "" }
    ]
  },

  gallery: {
    eyebrow: "Recién salidos de la silla",
    title: "Nuestro trabajo",
    intro: "Una línea sobre tu trabajo.",
    items: [
      { image: "", alt: "Describe la foto 1", caption: "" },
      { image: "", alt: "Describe la foto 2", caption: "" },
      { image: "", alt: "Describe la foto 3", caption: "" },
      { image: "", alt: "Describe la foto 4", caption: "" },
      { image: "", alt: "Describe la foto 5", caption: "" },
      { image: "", alt: "Describe la foto 6", caption: "" },
      { image: "", alt: "Describe la foto 7", caption: "" },
      { image: "", alt: "Describe la foto 8", caption: "" }
    ]
  },

  hours: {
    title: "Horario",
    items: [
      { days: "Lunes – Sábado", time: "00:00 – 00:00" },
      { days: "Domingo",        time: "Cerrado", closed: true }
    ]
  },

  contact: {
    eyebrow: "Pásate",
    title: "Encuéntranos",
    labels: { address: "Dirección", phone: "Teléfono", email: "Correo", map: "Cómo llegar" },
    address: "Calle y número, Ciudad, Código postal",
    mapUrl: "#",                   // p. ej. un enlace para compartir de Google Maps
    phones: ["+44 0000 000000", "+44 0000 000000"],
    email: "hola@example.com",
    ctaTitle: "Tu silla te espera."
  },

  // platform: instagram | facebook | tiktok | whatsapp | website
  socials: [
    { platform: "instagram", label: "Instagram", url: "#" },
    { platform: "website",   label: "Sitio web", url: "" }
  ],

  footer: {
    copyright: "LondonBarberShop. Todos los derechos reservados."   // el año se añade solo
  },

  // Textos pequeños de la interfaz (lectores de pantalla, menú y ventana emergente)
  ui: {
    skip: "Saltar al contenido",
    mainNav: "Principal",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    close: "Cerrar",
    previous: "Anterior",
    next: "Siguiente",
    newTab: "(se abre en una pestaña nueva)",
    quickActions: "Acciones rápidas",
    of: "de",
    image: "Imagen",
    photo: "Foto"
  }
};
