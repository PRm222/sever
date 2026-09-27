// Sever Deri — site betikleri
(function () {
  "use strict";

  var body = document.body;
  var header = document.querySelector(".site-header");
  var nav = document.getElementById("site-nav");
  var toggle = document.querySelector(".nav-toggle");
  var backdrop = document.querySelector(".nav-backdrop");

  // Mobil menü
  function setMenu(open) {
    body.classList.toggle("nav-open", open);
    if (toggle) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Menüyü kapat" : "Menüyü aç");
    }
    if (backdrop) backdrop.hidden = !open;
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      setMenu(!body.classList.contains("nav-open"));
    });
  }
  if (backdrop) backdrop.addEventListener("click", function () { setMenu(false); });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (body.classList.contains("nav-open")) {
      setMenu(false);
      toggle.focus();
    }
    closeSubs();
  });

  if (nav) {
    nav.addEventListener("click", function (e) {
      var link = e.target.closest("a");
      if (!link) return;
      setMenu(false);
      closeSubs();
      link.blur();
    });
  }

  // Geri/ileri tuşuyla önbellekten dönülen sayfada menüyü kapalı başlat
  window.addEventListener("pageshow", function (e) {
    if (e.persisted) {
      setMenu(false);
      closeSubs();
    }
  });

  // Masaüstüne geçildiğinde açık kalan mobil menüyü kapat
  window.matchMedia("(min-width: 961px)").addEventListener("change", function (mq) {
    if (mq.matches) setMenu(false);
  });

  // Alt menüler
  var subToggles = document.querySelectorAll(".sub-toggle");

  function closeSubs(except) {
    subToggles.forEach(function (btn) {
      var li = btn.parentElement;
      if (li === except) return;
      li.classList.remove("sub-open");
      btn.setAttribute("aria-expanded", "false");
    });
  }

  subToggles.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var li = btn.parentElement;
      var open = !li.classList.contains("sub-open");
      closeSubs(li);
      li.classList.toggle("sub-open", open);
      btn.setAttribute("aria-expanded", String(open));
    });
  });

  document.addEventListener("click", function (e) {
    if (!e.target.closest(".has-sub")) closeSubs();
  });

  // Anasayfa slider
  var slider = document.querySelector(".slider");
  if (slider) {
    var slides = slider.querySelectorAll(".slide");
    var dots = slider.querySelectorAll(".slider-dots button");
    var current = 0;
    var timer = null;
    var DELAY = 6000;
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var show = function (i) {
      current = (i + slides.length) % slides.length;
      slides.forEach(function (s, n) {
        s.classList.toggle("is-active", n === current);
        s.setAttribute("aria-hidden", String(n !== current));
      });
      dots.forEach(function (d, n) { d.setAttribute("aria-selected", String(n === current)); });
    };
    var stop = function () { clearInterval(timer); timer = null; };
    var start = function () {
      if (reduceMotion || slides.length < 2) return;
      stop();
      timer = setInterval(function () { show(current + 1); }, DELAY);
    };

    slider.querySelector(".slider-arrow.prev").addEventListener("click", function () { show(current - 1); start(); });
    slider.querySelector(".slider-arrow.next").addEventListener("click", function () { show(current + 1); start(); });
    dots.forEach(function (d, n) {
      d.addEventListener("click", function () { show(n); start(); });
    });

    // Fare üzerindeyken ya da içeride odak varken dur
    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", start);
    slider.addEventListener("focusin", stop);
    slider.addEventListener("focusout", start);

    // Dokunmatik kaydırma
    var touchX = null;
    slider.addEventListener("touchstart", function (e) { touchX = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener("touchend", function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) { show(current + (dx < 0 ? 1 : -1)); start(); }
      touchX = null;
    });

    // Sekme arka plandayken çalışmasın
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop(); else start();
    });

    show(0);
    start();
  }

  // Kaydırınca header gölgesi
  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 10);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Yukarı çık
  var toTop = document.querySelector(".to-top");
  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Alt bilgideki yıl
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Kaydırınca belirme efekti
  var revealEls = document.querySelectorAll(".card, .product, .steps li, .feature, .sectors li, .mv-card, .about > *, .contact > *");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) {
      el.classList.add("reveal");
      observer.observe(el);
    });
  }

  // İletişim formu: sunucu olmadığından e-posta istemcisini açar
  var form = document.getElementById("contact-form");
  if (!form) return;

  var CONTACT_EMAIL = "info@severderi.com";
  var status = document.getElementById("form-status");
  var f = form.elements;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.className = "form-status";

    var name = f.name.value.trim();
    var company = f.company ? f.company.value.trim() : "";
    var email = f.email.value.trim();
    var phone = f.phone.value.trim();
    var subject = f.subject ? f.subject.value : "Genel bilgi";
    var message = f.message.value.trim();

    var invalid = [];
    [f.name, f.email, f.message].forEach(function (el) { el.classList.remove("invalid"); });
    if (!name) invalid.push(f.name);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) invalid.push(f.email);
    if (!message) invalid.push(f.message);

    if (invalid.length) {
      invalid.forEach(function (el) { el.classList.add("invalid"); });
      invalid[0].focus();
      status.textContent = "Lütfen zorunlu alanları doğru şekilde doldurun.";
      status.classList.add("error");
      return;
    }

    var mailBody =
      "Ad Soyad: " + name + "\n" +
      (company ? "Firma: " + company + "\n" : "") +
      "E-posta: " + email + "\n" +
      (phone ? "Telefon: " + phone + "\n" : "") +
      "\n" + message;

    window.location.href =
      "mailto:" + CONTACT_EMAIL +
      "?subject=" + encodeURIComponent("Web sitesi: " + subject) +
      "&body=" + encodeURIComponent(mailBody);

    status.textContent = "E-posta uygulamanız açılıyor. Teşekkür ederiz!";
    status.classList.add("success");
    form.reset();
  });
})();
