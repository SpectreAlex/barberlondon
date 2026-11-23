/* Renders window.SITE (js/content.js) into index.html and wires up the
   mobile nav, active-section highlight and the product/gallery modal.
   You should not need to edit this file to change text — edit content.js. */
(function () {
  "use strict";

  var SITE = window.SITE || {};
  var UI = SITE.ui || {};
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ---------- helpers ---------- */
  function get(path) {
    return path.split(".").reduce(function (obj, key) {
      return obj == null ? undefined : obj[key];
    }, SITE);
  }
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null && text !== "") node.textContent = text;
    return node;
  }
  function icon(name) {
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("class", "icon");
    svg.setAttribute("aria-hidden", "true");
    var use = document.createElementNS(ns, "use");
    use.setAttribute("href", "#i-" + name);
    svg.appendChild(use);
    return svg;
  }
  function hide(node) { if (node) node.hidden = true; }
  function isExternal(url) { return /^https?:\/\//i.test(url); }
  function setLink(a, url, label) {
    a.href = url;
    if (isExternal(url)) {
      a.target = "_blank";
      a.rel = "noopener";
      if (UI.newTab) a.appendChild(el("span", "visually-hidden", " " + UI.newTab));
    }
    if (label) a.setAttribute("data-label", label);
  }
  function image(src, alt) {
    if (!src) {
      // Label drawn by CSS (::after), so it is not part of any button's accessible name.
      var ph = el("div", "placeholder");
      ph.setAttribute("aria-hidden", "true");
      ph.setAttribute("data-label", UI.image || "Imagen");
      return ph;
    }
    var img = el("img");
    img.src = src;
    img.alt = alt || "";
    img.loading = "lazy";
    img.decoding = "async";
    return img;
  }

  /* ---------- meta ---------- */
  function renderMeta() {
    var meta = SITE.meta || {};
    if (SITE.lang) document.documentElement.lang = SITE.lang;
    if (meta.title) document.title = meta.title;
    [["meta[name=description]", meta.description],
     ["meta[property='og:title']", meta.title],
     ["meta[property='og:description']", meta.description]].forEach(function (pair) {
      var tag = $(pair[0]);
      if (tag && pair[1]) tag.setAttribute("content", pair[1]);
    });
  }

  /* ---------- simple text + links ---------- */
  function renderText() {
    $$("[data-text]").forEach(function (node) {
      var value = get(node.getAttribute("data-text"));
      if (value == null || value === "") { hide(node); return; }
      node.textContent = value;
    });
    $$("[data-aria]").forEach(function (node) {
      var value = get(node.getAttribute("data-aria"));
      if (value) node.setAttribute("aria-label", value);
    });
    $$("[data-link]").forEach(function (a) {
      var link = get(a.getAttribute("data-link"));
      if (!link || !link.url) { hide(a); return; }
      var iconName = a.getAttribute("data-icon");
      if (iconName) a.appendChild(icon(iconName));
      a.appendChild(document.createTextNode(link.label || ""));
      setLink(a, link.url);
    });
  }

  function renderFloatingButtons() {
    var stack = $("#fab-stack");
    if (!stack) return;
    var shown = 0;
    $$("[data-fab]", stack).forEach(function (a) {
      var link = get(a.getAttribute("data-fab"));
      if (!link || !link.url) { hide(a.parentNode); return; }
      a.appendChild(icon(a.getAttribute("data-icon")));
      // Icon-only on screen; the label is still read out and shown as a tooltip.
      a.appendChild(el("span", "visually-hidden", link.label));
      a.title = link.label;
      setLink(a, link.url);
      shown++;
    });
    if (SITE.floatingButtons === false || !shown) { hide(stack); return; }
    stack.setAttribute("aria-label", UI.quickActions || "Acciones rápidas");
    document.body.classList.add("has-fab");
  }

  function renderBrand() {
    var brand = SITE.brand || {};
    [$("#brand"), $("#footer-brand")].forEach(function (node) {
      if (!node) return;
      if (brand.logo) {
        var img = el("img");
        img.src = brand.logo;
        img.alt = brand.name || "";
        node.appendChild(img);
      } else {
        node.textContent = brand.name || "";
      }
    });
    var copy = $("#copyright");
    if (copy && SITE.footer && SITE.footer.copyright) {
      copy.textContent = "© " + new Date().getFullYear() + " " + SITE.footer.copyright;
    }
  }

  function renderHero() {
    var src = SITE.hero && SITE.hero.image;
    var media = $("#hero-media");
    if (src && media) media.appendChild(image(src, ""));
  }

  /* ---------- lists ---------- */
  function hideEmptySections() {
    $$("[data-list]").forEach(function (section) {
      var items = get(section.getAttribute("data-list"));
      if (!items || !items.length) {
        hide(section);
        var navLink = $(".nav__link[href='#" + section.id + "']");
        if (navLink) hide(navLink.parentNode);
      }
    });
  }

  function renderServices() {
    var list = $("#services-list");
    var items = (SITE.services && SITE.services.items) || [];
    items.forEach(function (s) {
      var li = el("li", "service");
      li.appendChild(el("span", "service__name", s.name));
      li.appendChild(el("span", "service__price", s.price));
      var meta = [s.duration, s.description].filter(Boolean).join(" · ");
      if (meta) li.appendChild(el("span", "service__meta", meta));
      list.appendChild(li);
    });
  }

  function renderProducts() {
    var grid = $("#products-grid");
    var items = (SITE.products && SITE.products.items) || [];
    items.forEach(function (p, i) {
      var li = el("li");
      var btn = el("button", "card card--button");
      btn.type = "button";
      btn.setAttribute("aria-haspopup", "dialog");
      var media = el("div", "card__media");
      media.appendChild(image(p.image, p.name));
      var body = el("div", "card__body");
      body.appendChild(el("span", "card__title", p.name));
      if (p.price) body.appendChild(el("span", "card__price", p.price));
      btn.appendChild(media);
      btn.appendChild(body);
      btn.addEventListener("click", function () { Modal.open("products", i, btn); });
      li.appendChild(btn);
      grid.appendChild(li);
    });
  }

  function renderGallery() {
    var grid = $("#gallery-grid");
    var items = (SITE.gallery && SITE.gallery.items) || [];
    items.forEach(function (g, i) {
      var li = el("li");
      var btn = el("button", "tile");
      btn.type = "button";
      btn.setAttribute("aria-haspopup", "dialog");
      btn.setAttribute("aria-label", g.alt || g.caption || ((UI.photo || "Foto") + " " + (i + 1)));
      btn.appendChild(image(g.image, ""));
      btn.addEventListener("click", function () { Modal.open("gallery", i, btn); });
      li.appendChild(btn);
      grid.appendChild(li);
    });
  }

  function renderHours() {
    var list = $("#hours-list");
    var items = (SITE.hours && SITE.hours.items) || [];
    if (!items.length) { hide($("#hours-block")); return; }
    items.forEach(function (h) {
      var li = el("li", "hours__row" + (h.closed ? " hours__row--closed" : ""));
      li.appendChild(el("span", "hours__days", h.days));
      li.appendChild(el("span", "hours__time", h.time));
      list.appendChild(li);
    });
  }

  function renderContact() {
    var c = SITE.contact || {};
    var labels = c.labels || {};

    var map = $("#map-link");
    if (c.mapUrl) { map.textContent = labels.map || "Mapa"; setLink(map, c.mapUrl); } else hide(map);
    if (!c.address && !c.mapUrl) hide($("#address-block"));

    var phones = (c.phones || []).filter(Boolean);
    var list = $("#phone-list");
    if (!phones.length) hide($("#phone-block"));
    phones.forEach(function (p) {
      var li = el("li");
      var a = el("a", null, p);
      a.href = "tel:" + p.replace(/[^\d+]/g, "");
      li.appendChild(a);
      list.appendChild(li);
    });

    // Email is assembled here (not written in the HTML) to keep it away from simple spam bots.
    if (c.email) {
      var mail = el("a", null, c.email);
      mail.href = "mailto:" + c.email;
      $("#email-slot").appendChild(mail);
    } else hide($("#email-block"));
  }

  function renderSocials() {
    var socials = (SITE.socials || []).filter(function (s) { return s.url; });
    ["#contact-socials", "#footer-socials"].forEach(function (sel) {
      var ul = $(sel);
      if (!socials.length) { hide(ul); return; }
      socials.forEach(function (s) {
        var li = el("li");
        var a = el("a", "social-link");
        a.setAttribute("aria-label", s.label + (isExternal(s.url) && UI.newTab ? " " + UI.newTab : ""));
        a.appendChild(icon(s.platform));
        a.href = s.url;
        if (isExternal(s.url)) { a.target = "_blank"; a.rel = "noopener"; }
        li.appendChild(a);
        ul.appendChild(li);
      });
    });
  }

  /* ---------- header: scrolled state + mobile nav ---------- */
  function initHeader() {
    var header = $("#site-header");
    var nav = $("#nav");
    var toggle = $("#nav-toggle");
    var toggleLabel = $("#nav-toggle-label");
    var useEl = $("use", toggle);
    var desktop = window.matchMedia("(min-width: 900px)");

    function onScroll() { header.classList.toggle("is-scrolled", window.scrollY > 8); }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    function setOpen(open) {
      nav.classList.toggle("is-open", open);
      document.body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggleLabel.textContent = open ? (UI.closeMenu || "Cerrar menú") : (UI.openMenu || "Abrir menú");
      useEl.setAttribute("href", open ? "#i-x" : "#i-menu");
      header.classList.toggle("is-scrolled", open || window.scrollY > 8);
    }
    setOpen(false);

    toggle.addEventListener("click", function () { setOpen(!nav.classList.contains("is-open")); });
    $$(".nav__link", nav).forEach(function (a) { a.addEventListener("click", function () { setOpen(false); }); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { setOpen(false); toggle.focus(); }
    });
    (desktop.addEventListener ? desktop.addEventListener.bind(desktop, "change") : desktop.addListener.bind(desktop))(function (e) {
      if (e.matches) setOpen(false);
    });
  }

  /* ---------- active section highlight ---------- */
  function initActiveLink() {
    if (!("IntersectionObserver" in window)) return;
    var links = $$(".nav__link");
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) { a.removeAttribute("aria-current"); });
        var link = byId[entry.target.id];
        if (link) link.setAttribute("aria-current", "true");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(byId).forEach(function (id) {
      var section = document.getElementById(id);
      if (section && !section.hidden) observer.observe(section);
    });
  }

  /* ---------- modal / lightbox ---------- */
  var Modal = (function () {
    var root, dialog, media, title, price, text, count, nav, prev, next;
    var kind = null, index = 0, opener = null, openedAt = 0;

    function items() { return (SITE[kind] && SITE[kind].items) || []; }

    function render() {
      var list = items();
      var item = list[index];
      var isProduct = kind === "products";
      dialog.classList.toggle("modal__dialog--split", isProduct);
      media.textContent = "";
      var img = image(item.image, isProduct ? item.name : (item.alt || ""));
      if (img.classList.contains("placeholder")) img.classList.add("placeholder--tall");
      else img.loading = "eager";
      media.appendChild(img);

      var heading = isProduct ? item.name : (item.caption || item.alt || "");
      title.textContent = heading;
      title.classList.toggle("visually-hidden", !isProduct && !item.caption);
      price.textContent = isProduct ? (item.price || "") : "";
      price.hidden = !price.textContent;
      text.textContent = isProduct ? (item.description || "") : "";
      text.hidden = !text.textContent;

      count.textContent = (index + 1) + " " + (UI.of || "de") + " " + list.length;
      nav.hidden = list.length < 2;
      count.hidden = list.length < 2;
      prev.disabled = index === 0;
      next.disabled = index === list.length - 1;
    }

    function go(step) {
      var n = index + step;
      if (n < 0 || n >= items().length) return;
      index = n;
      render();
    }

    function focusables() {
      return $$("button:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])", dialog)
        .filter(function (n) { return !n.closest("[hidden]") && n.offsetParent !== null; });
    }

    function onKey(e) {
      if (e.key === "Escape") { close(); return; }
      if (e.key === "ArrowLeft") { go(-1); return; }
      if (e.key === "ArrowRight") { go(1); return; }
      if (e.key === "Tab") {
        var f = focusables();
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }

    function open(k, i, from) {
      kind = k; index = i; opener = from; openedAt = Date.now();
      render();
      root.hidden = false;
      document.body.classList.add("modal-open");
      document.addEventListener("keydown", onKey);
      $(".modal__close", root).focus();
    }

    function close() {
      root.hidden = true;
      document.body.classList.remove("modal-open");
      document.removeEventListener("keydown", onKey);
      if (opener) opener.focus();
    }

    function init() {
      root = $("#modal");
      dialog = $(".modal__dialog", root);
      media = $("#modal-media");
      title = $("#modal-title");
      price = $("#modal-price");
      text = $("#modal-text");
      count = $("#modal-count");
      nav = $("#modal-nav");
      prev = $("#modal-prev");
      next = $("#modal-next");
      $$("[data-close]", root).forEach(function (n) {
        n.addEventListener("click", function (e) {
          // The 2nd click of a double-click lands on the backdrop: ignore it.
          if (n.classList.contains("modal__backdrop") && Date.now() - openedAt < 500) return;
          close();
        });
      });
      prev.addEventListener("click", function () { go(-1); });
      next.addEventListener("click", function () { go(1); });
    }

    return { init: init, open: open, close: close };
  })();

  /* ---------- boot ---------- */
  renderMeta();
  renderText();
  renderBrand();
  renderHero();
  renderFloatingButtons();
  hideEmptySections();
  renderServices();
  renderProducts();
  renderGallery();
  renderHours();
  renderContact();
  renderSocials();
  Modal.init();
  initHeader();
  initActiveLink();
})();
