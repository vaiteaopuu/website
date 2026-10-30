// Homepage hero animation, drawn in SVG:
// 1) an RNA hairpin folds, 2) lab-tested designs train an AI model,
// 3) the model redesigns the sequence while keeping the fold.
(function () {
  var host = document.getElementById("rna-story");
  if (!host) return;
  var cap = document.getElementById("rna-caption");
  var btn = document.getElementById("rna-replay");
  var NS = "http://www.w3.org/2000/svg";
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  var CAPS = [
    "An RNA folds by pairing with itself.",
    "Lab tests of our designed ribozymes train an AI model.",
    "The model designs new sequences that keep the fold."
  ];

  // Sequences: 9 bp stem, GNRA tetraloop, short tails
  var comp = { A: "U", U: "A", G: "C", C: "G" };
  function rc(s) { return s.split("").reverse().map(function (c) { return comp[c]; }).join(""); }
  function chain(left, loop) { return "GA" + left + loop + rc(left) + "AC"; }
  var SEQ0 = chain("GGCACUCAG", "GAAA");
  var SEQ1 = chain("GCCAGUCUG", "GCAA");
  var STEM = 9;

  // Geometry (viewBox 0 0 480 420)
  var xL = 86, xR = 134, yB = 330, dy = 28, R = 11;
  var pts = [[52, 380], [72, 356]];
  for (var i = 0; i < STEM; i++) pts.push([xL, yB - dy * i]);
  var cx = 110, cy = yB - dy * (STEM - 1) - 26, rr = Math.hypot(24, 26);
  var a0 = Math.atan2(26, -24), a1 = Math.atan2(26, 24) + 2 * Math.PI;
  for (var k = 1; k <= 4; k++) { var a = a0 + (a1 - a0) * k / 5; pts.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)]); }
  for (var j = STEM - 1; j >= 0; j--) pts.push([xR, yB - dy * j]);
  pts.push([148, 356], [168, 380]);
  var NT = pts.length;
  function partner(idx) { var s = idx - 2; return s >= 0 && s < STEM ? NT - 3 - s : -1; }

  // Lab data: short aligned designs, active (1) or inactive (0)
  var ROWS = ["GGCACUCAGA", "GGCAGUCUGA", "GCCACUCAGA", "GGUACUCGGA", "GGCACUGAGA", "GCCAGUCUGA", "GAUACUCAGU", "GGCAGUCAGA"];
  var ACTIVE = [1, 1, 0, 1, 0, 1, 1, 0];

  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var key in attrs) e.setAttribute(key, attrs[key]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function smooth(p) {
    var d = "M" + p[0][0] + "," + p[0][1];
    for (var i = 0; i < p.length - 1; i++) {
      var p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p2;
      d += " C" + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + "," + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(1) +
        " " + (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + "," + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(1) +
        " " + p2[0].toFixed(1) + "," + p2[1].toFixed(1);
    }
    return d;
  }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function anim(e, kf, opts) {
    opts.fill = "forwards";
    return e.animate(kf, opts).finished;
  }

  var svg, parts, run = 0;

  function build() {
    if (svg) svg.remove();
    svg = el("svg", { viewBox: "0 0 480 420", role: "img",
      "aria-label": "Animation: an RNA hairpin folds; lab-tested ribozyme designs train an AI model; the model designs a new sequence with the same fold" });
    host.insertBefore(svg, host.firstChild);

    var backbone = el("path", { d: smooth(pts), "class": "rs-backbone" }, svg);

    var pairs = el("g", {}, svg), pairEls = [];
    for (var b = 0; b < STEM; b++) {
      var y = yB - dy * b;
      pairEls.push(el("line", { x1: xL + 13, y1: y, x2: xR - 13, y2: y, "class": "rs-bp" }, pairs));
    }

    var nts = el("g", {}, svg), ntEls = [];
    pts.forEach(function (p, idx) {
      var g = el("g", { transform: "translate(" + p[0].toFixed(1) + "," + p[1].toFixed(1) + ")" }, nts);
      var ring = el("circle", { r: R + 4, "class": "rs-ring" }, g);
      var inner = el("g", { "class": "rs-nt" }, g);
      var c = el("circle", { r: R }, inner);
      var t = el("text", { y: 0.5, "text-anchor": "middle", "dominant-baseline": "central" }, inner);
      ntEls.push({ inner: inner, circle: c, text: t, ring: ring });
      setBase(ntEls[idx], SEQ0[idx]);
    });
    el("text", { x: 44, y: 400, "text-anchor": "end", "class": "rs-end" }, svg).textContent = "5′";
    el("text", { x: 176, y: 400, "class": "rs-end" }, svg).textContent = "3′";

    // Lab data panel
    var lab = el("g", { "class": "rs-lab" }, svg);
    var labLabel = el("text", { x: 262, y: 84, "class": "rs-label" }, lab); labLabel.textContent = "lab-tested designs";
    var actLabel = el("text", { x: 424, y: 84, "text-anchor": "middle", "class": "rs-label" }, lab); actLabel.textContent = "active";
    var rowEls = ROWS.map(function (s, r) {
      var g = el("g", { "class": "rs-row" }, lab);
      var y0 = 100 + r * 26;
      for (var q = 0; q < s.length; q++) el("rect", { x: 262 + q * 14, y: y0, width: 13, height: 18, rx: 2, "class": "rs-cell rs-" + s[q] }, g);
      el("circle", { cx: 424, cy: y0 + 9, r: 6, "class": ACTIVE[r] ? "rs-yes" : "rs-no" }, g);
      return g;
    });

    // Model
    var model = el("g", { "class": "rs-model" }, svg);
    var box = el("rect", { x: 282, y: 340, width: 124, height: 36, rx: 18 }, model);
    el("text", { x: 344, y: 358.5, "text-anchor": "middle", "dominant-baseline": "central" }, model).textContent = "AI model";
    var link = el("path", { d: "M282,358 C232,358 196,262 152,240", "class": "rs-link" }, svg);

    parts = { backbone: backbone, pairEls: pairEls, ntEls: ntEls, lab: lab, labLabels: [labLabel, actLabel], rowEls: rowEls, model: model, box: box, link: link };
    var len = backbone.getTotalLength(); backbone.style.strokeDasharray = backbone.style.strokeDashoffset = len;
    var ll = link.getTotalLength(); link.style.strokeDasharray = link.style.strokeDashoffset = ll;
    parts.len = len; parts.ll = ll;
  }

  function setBase(n, base) {
    n.circle.setAttribute("class", "rs-" + base);
    n.text.textContent = base;
    n.base = base;
  }

  function caption(i) {
    if (!cap) return;
    cap.classList.add("swap");
    setTimeout(function () { cap.textContent = CAPS[i]; cap.classList.remove("swap"); }, reduce ? 0 : 200);
  }

  function finalState() {
    parts.backbone.style.strokeDashoffset = 0;
    parts.link.style.strokeDashoffset = 0;
    parts.pairEls.forEach(function (p) { p.style.strokeDashoffset = 0; });
    parts.ntEls.forEach(function (n, i) {
      n.inner.style.opacity = 1; n.inner.style.transform = "none";
      setBase(n, SEQ1[i]);
      if (SEQ1[i] !== SEQ0[i]) n.ring.style.opacity = 1;
    });
    parts.labLabels.forEach(function (l) { l.style.opacity = 1; });
    parts.rowEls.forEach(function (r) { r.style.opacity = 0.35; });
    parts.model.style.opacity = 1;
    if (cap) cap.textContent = CAPS[2];
  }

  async function play() {
    var me = ++run;
    build();
    if (btn) btn.hidden = true;
    if (reduce) { finalState(); return; }
    function alive() { return me === run; }

    // 1. Fold
    caption(0);
    anim(parts.backbone, [{ strokeDashoffset: parts.len }, { strokeDashoffset: 0 }], { duration: 1400, easing: "linear" });
    parts.ntEls.forEach(function (n, i) {
      anim(n.inner, [{ opacity: 0, transform: "scale(.3)" }, { opacity: 1, transform: "scale(1)" }],
        { duration: 420, delay: i / (NT - 1) * 1400, easing: "cubic-bezier(.2,.9,.3,1.35)" });
    });
    parts.pairEls.forEach(function (p, b) {
      anim(p, [{ strokeDashoffset: 22 }, { strokeDashoffset: 0 }], { duration: 260, delay: 1500 + b * 80, easing: "ease-out" });
    });
    await sleep(2700); if (!alive()) return;

    // 2. Learn from lab data
    caption(1);
    parts.labLabels.forEach(function (l) { anim(l, [{ opacity: 0 }, { opacity: 1 }], { duration: 400 }); });
    parts.rowEls.forEach(function (r, i) {
      anim(r, [{ opacity: 0, transform: "translateX(12px)" }, { opacity: 1, transform: "none" }], { duration: 360, delay: 150 + i * 110, easing: "ease-out" });
    });
    anim(parts.model, [{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: 900 });
    await sleep(1900); if (!alive()) return;

    // copies of the data flow into the model; the originals stay, dimmed
    parts.rowEls.forEach(function (r, i) {
      var dyRow = 358 - (109 + i * 26), c = r.cloneNode(true);
      r.parentNode.appendChild(c);
      anim(c, [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translate(0px," + dyRow + "px) scale(.4)" }],
        { duration: 650, delay: i * 110, easing: "cubic-bezier(.5,0,.7,.4)" });
      anim(r, [{ opacity: 1 }, { opacity: 0.35 }], { duration: 500, delay: i * 110 });
    });
    anim(parts.box, [{ strokeWidth: 1.5 }, { strokeWidth: 3.5 }, { strokeWidth: 1.5 }, { strokeWidth: 3.5 }, { strokeWidth: 1.5 }],
      { duration: 1500, delay: 300 });
    await sleep(1800); if (!alive()) return;

    // 3. Design
    caption(2);
    await anim(parts.link, [{ strokeDashoffset: parts.ll }, { strokeDashoffset: 0 }], { duration: 650, easing: "ease-in-out" });
    if (!alive()) return;
    // flip each base pair from the closing end upward, then the loop and tails
    var order = [];
    for (var b = 0; b < STEM; b++) order.push([2 + b, partner(2 + b)]);
    order.push([11, 12, 13, 14]);
    order.forEach(function (group, gi) {
      group.forEach(function (idx) {
        var n = parts.ntEls[idx];
        if (SEQ1[idx] === n.base) return;
        var delay = gi * 120;
        anim(n.inner, [{ transform: "scale(1)" }, { transform: "scale(0)" }], { duration: 200, delay: delay, easing: "ease-in" })
          .then(function () {
            if (!alive()) return;
            setBase(n, SEQ1[idx]);
            anim(n.inner, [{ transform: "scale(0)" }, { transform: "scale(1)" }], { duration: 320, easing: "cubic-bezier(.2,.9,.3,1.35)" });
            anim(n.ring, [{ opacity: 0 }, { opacity: 1 }], { duration: 300 });
          });
      });
    });
    await sleep(order.length * 120 + 700); if (!alive()) return;
    if (btn) btn.hidden = false;
  }

  if (btn) btn.addEventListener("click", play);

  if (!("animate" in document.createElementNS(NS, "g"))) reduce = true;
  if ("IntersectionObserver" in window && !reduce) {
    build();
    var io = new IntersectionObserver(function (e) { if (e[0].isIntersecting) { io.disconnect(); play(); } }, { threshold: 0.35 });
    io.observe(host);
  } else {
    play();
  }
})();
