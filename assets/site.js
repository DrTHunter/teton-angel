// Nav background, scroll reveals, and a quiet starfield over the hero.
(function () {
  var nav = document.getElementById("nav");
  if (nav && !nav.classList.contains("always")) {
    var onScroll = function () { nav.classList.toggle("solid", window.scrollY > 60); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
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
