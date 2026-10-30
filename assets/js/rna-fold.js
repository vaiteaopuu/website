// Folding RNA hairpin for the homepage hero.
// Builds an SVG stem-loop (9 bp stem, GAAA tetraloop), then plays a
// backbone draw + nucleotide pop + base-pair zipper. Click "Fold again" to replay.
(function () {
  var NS = "http://www.w3.org/2000/svg";
  var host = document.getElementById("rna-fold");
  if (!host) return;

  // Chain 5'->3': tail, left stem (bottom->top), loop, right stem (top->bottom), tail
  var tail5 = "GA", left = "GGCACUCAG", loop = "GAAA", right = "CUGAGUGCC", tail3 = "AC";
  var seq = tail5 + left + loop + right + tail3;

  var xL = 134, xR = 186, yBottom = 360, dy = 30, n = left.length;
  var pts = [[100, 410], [120, 386]];
  for (var i = 0; i < n; i++) pts.push([xL, yBottom - dy * i]);
  var cx = 160, cy = 92, r = Math.hypot(26, 28);
  var a0 = Math.atan2(28, -26), a1 = Math.atan2(28, 26) + 2 * Math.PI;
  for (var k = 1; k <= 4; k++) {
    var a = a0 + (a1 - a0) * k / 5;
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  for (var j = n - 1; j >= 0; j--) pts.push([xR, yBottom - dy * j]);
  pts.push([200, 386], [220, 410]);

  function el(tag, attrs) {
    var e = document.createElementNS(NS, tag);
    for (var key in attrs) e.setAttribute(key, attrs[key]);
    return e;
  }

  // Catmull-Rom spline through the nucleotide centres
  function smoothPath(p) {
    var d = "M" + p[0][0] + "," + p[0][1];
    for (var i = 0; i < p.length - 1; i++) {
      var p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p2;
      d += " C" + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + "," + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(1) +
           " " + (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + "," + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(1) +
           " " + p2[0].toFixed(1) + "," + p2[1].toFixed(1);
    }
    return d;
  }

  var svg = el("svg", { viewBox: "60 40 200 400", role: "img",
    "aria-label": "An RNA hairpin folding: a nine base-pair stem closed by a GAAA tetraloop" });

  var backbone = el("path", { d: smoothPath(pts), "class": "rna-backbone" });
  svg.appendChild(backbone);

  var pairs = el("g", { "class": "rna-pairs" });
  for (var b = 0; b < n; b++) {
    var y = yBottom - dy * b;
    var line = el("line", { x1: xL + 13, y1: y, x2: xR - 13, y2: y, "class": "bp" });
    line.style.setProperty("--d", (1.9 + b * 0.09).toFixed(2) + "s");
    pairs.appendChild(line);
  }
  svg.appendChild(pairs);

  var nts = el("g", { "class": "rna-nts" });
  pts.forEach(function (p, idx) {
    var base = seq[idx];
    var g = el("g", { "class": "nt nt-" + base, transform: "translate(" + p[0].toFixed(1) + "," + p[1].toFixed(1) + ")" });
    var inner = el("g", { "class": "nt-body" });
    inner.style.setProperty("--d", (idx / (pts.length - 1) * 1.6).toFixed(2) + "s");
    inner.appendChild(el("circle", { r: 11 }));
    var t = el("text", { y: 0.5, "text-anchor": "middle", "dominant-baseline": "central" });
    t.textContent = base;
    inner.appendChild(t);
    g.appendChild(inner);
    nts.appendChild(g);
  });
  svg.appendChild(nts);

  var l5 = el("text", { x: 86, y: 430, "text-anchor": "end", "class": "rna-end" }); l5.textContent = "5′";
  var l3 = el("text", { x: 234, y: 430, "class": "rna-end" }); l3.textContent = "3′";
  svg.appendChild(l5); svg.appendChild(l3);

  host.insertBefore(svg, host.firstChild);
  var len = backbone.getTotalLength();
  backbone.style.setProperty("--len", len.toFixed(0));

  function play() {
    svg.classList.remove("play");
    void svg.getBoundingClientRect(); // restart CSS animations
    svg.classList.add("play");
  }

  var btn = document.getElementById("rna-replay");
  if (btn) btn.addEventListener("click", play);

  // Start when the hero is visible (it usually is on load)
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { play(); io.disconnect(); }
    }, { threshold: 0.4 });
    io.observe(svg);
  } else {
    play();
  }
})();
