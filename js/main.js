// Sever Deri — site betikleri
(function () {
  "use strict";

  // Aktif menü bağlantısını işaretle
  var page = document.body.getAttribute("data-page");
  document.querySelectorAll(".site-nav a[data-nav]").forEach(function (link) {
    if (link.getAttribute("data-nav") === page) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  // Mobil menü
  var toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Menüyü kapat" : "Menüyü aç");
    });
  }

  // Alt bilgideki yıl
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Kaydırınca belirme efekti
  var revealEls = document.querySelectorAll(".card, .steps li, .feature, .about > *, .contact > *");
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

    var body =
      "Ad Soyad: " + name + "\n" +
      "E-posta: " + email + "\n" +
      (phone ? "Telefon: " + phone + "\n" : "") +
      "\n" + message;

    window.location.href =
      "mailto:" + CONTACT_EMAIL +
      "?subject=" + encodeURIComponent("Web sitesi: " + subject) +
      "&body=" + encodeURIComponent(body);

    status.textContent = "E-posta uygulamanız açılıyor. Teşekkür ederiz!";
    status.classList.add("success");
    form.reset();
  });
})();
