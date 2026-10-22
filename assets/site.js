// Nav background, scroll reveals, and a quiet starfield over the hero.
(function () {
  var nav = document.getElementById("nav");
  if (nav && !nav.classList.contains("always")) {
    var onScroll = function () { nav.classList.toggle("solid", window.scrollY > 60); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Mobile menu: a toggle plus a panel built from the nav's own links.
  if (nav) {
    var ul = nav.querySelector("ul");
    var btn = document.createElement("button");
    btn.className = "menu-btn"; btn.type = "button";
    btn.setAttribute("aria-label", "Menu"); btn.setAttribute("aria-expanded", "false");
    btn.innerHTML = "<span></span>";
    var li = document.createElement("li"); li.appendChild(btn); ul.appendChild(li);
    var panel = document.createElement("div");
    panel.className = "mobile-menu"; panel.id = "mobile-menu";
    btn.setAttribute("aria-controls", panel.id);
    ul.querySelectorAll("a:not(.btn)").forEach(function (a) {
      var c = a.cloneNode(true); c.addEventListener("click", function () { setOpen(false); }); panel.appendChild(c);
    });
    nav.appendChild(panel);
    var setOpen = function (open) { nav.classList.toggle("open", open); btn.setAttribute("aria-expanded", String(open)); };
    btn.addEventListener("click", function () { setOpen(!nav.classList.contains("open")); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });
  }

  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }

  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();

  var lb = document.getElementById("lightbox");
  if (lb) {
    var lbImg = lb.querySelector("img"), lbCap = lb.querySelector(".lb-cap");
    var close = function () { lb.hidden = true; lbImg.src = ""; };
    document.querySelectorAll(".gallery a").forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        var img = a.querySelector("img"), cap = a.parentElement.querySelector("figcaption");
        lbImg.src = a.href; lbImg.alt = img.alt; lbCap.textContent = cap ? cap.textContent : "";
        lb.hidden = false;
      });
    });
    lb.addEventListener("click", function (e) { if (e.target !== lbImg) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !lb.hidden) close(); });
  }

  var canvas = document.getElementById("stars");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var stars = [];
  function size() {
    var r = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * r;
    canvas.height = canvas.offsetHeight * r;
    ctx.setTransform(r, 0, 0, r, 0, 0);
    stars = [];
    var n = Math.round(canvas.offsetWidth * canvas.offsetHeight / 9000);
    for (var i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight * 0.45,
        r: Math.random() * 1.1 + 0.2,
        p: Math.random() * Math.PI * 2,
        s: Math.random() * 0.02 + 0.005
      });
    }
  }
  function draw() {
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    stars.forEach(function (st) {
      st.p += st.s;
      var a = 0.35 + Math.sin(st.p) * 0.35;
      ctx.beginPath();
      ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,248,230," + a + ")";
      ctx.fill();
    });
    if (!still) requestAnimationFrame(draw);
  }
  size();
  window.addEventListener("resize", size);
  draw();
})();

// Count Amazon "buy" clicks as a GA4 key event candidate.
document.addEventListener("click", function (e) {
  var a = e.target.closest && e.target.closest('a[href*="amazon.com"]');
  if (a && typeof gtag === "function") {
    gtag("event", "buy_click", { link_url: a.href, link_text: (a.textContent || "").trim().slice(0, 60), page_path: location.pathname });
  }
});
