// Homepage hero animation, drawn in SVG:
// 1) an RNA hairpin folds, 2) lab-tested designs train an AI model,
// 3) the model redesigns the sequence while keeping the fold.
// Every frame is computed from the elapsed time and written as plain SVG
// attributes, so it renders the same in Chrome, Safari and Firefox.
(function () {
  var host = document.getElementById("rna-story");
  if (!host) return;
  var cap = document.getElementById("rna-caption");
  var btn = document.getElementById("rna-replay");
  var NS = "http://www.w3.org/2000/svg";
  var reduce = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

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
  var xL = 86, xR = 134, yB = 330, dy = 28, R = 11, i;
  var pts = [[52, 380], [72, 356]];
  for (i = 0; i < STEM; i++) pts.push([xL, yB - dy * i]);
  var lcx = 110, lcy = yB - dy * (STEM - 1) - 26, rr = Math.sqrt(24 * 24 + 26 * 26);
  var a0 = Math.atan2(26, -24), a1 = Math.atan2(26, 24) + 2 * Math.PI;
  for (i = 1; i <= 4; i++) { var a = a0 + (a1 - a0) * i / 5; pts.push([lcx + rr * Math.cos(a), lcy + rr * Math.sin(a)]); }
  for (i = STEM - 1; i >= 0; i--) pts.push([xR, yB - dy * i]);
  pts.push([148, 356], [168, 380]);
  var NT = pts.length;

  // Order in which the model rewrites positions: base pairs from the bottom up, then the loop
  var GROUPS = [];
  for (i = 0; i < STEM; i++) GROUPS.push([2 + i, NT - 3 - i]);
  GROUPS.push([11, 12, 13, 14]);

  // Lab data (illustrative): short aligned designs, active (1) or inactive (0)
  var ROWS = ["GGCACUCAGA", "GGCAGUCUGA", "GCCACUCAGA", "GGUACUCGGA", "GGCACUGAGA", "GCCAGUCUGA", "GAUACUCAGU", "GGCAGUCAGA"];
  var ACTIVE = [1, 1, 0, 1, 0, 1, 1, 0];
  var ROW_X = 262, ROW_Y0 = 100, ROW_DY = 26, MODEL_Y = 358;

  // Timeline (seconds)
  var T_LEARN = 2.7, T_FLOW = 4.6, T_DESIGN = 6.4, T_FLIP = 7.1, GAP = 0.12;
  var T_END = T_FLIP + GROUPS.length * GAP + 0.6;

  // Easing helpers
  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function seg(t, s, d) { return clamp((t - s) / d); }
  function io(x) { x = clamp(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
  function back(x) { x = clamp(x); var c = 1.7; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); }
  function easeIn(x) { x = clamp(x); return x * x * x; }

  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var key in attrs) e.setAttribute(key, attrs[key]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function set(e, name, v) { e.setAttribute(name, typeof v === "number" ? v.toFixed(3) : v); }
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

  // Build the scene once
  var svg = el("svg", { viewBox: "0 0 480 420", role: "img",
    "aria-label": "Animation: an RNA hairpin folds; lab-tested ribozyme designs train an AI model; the model designs a new sequence with the same fold" });
  host.insertBefore(svg, host.firstChild);

  var backbone = el("path", { d: smooth(pts), "class": "rs-backbone" }, svg);
  var BB_LEN = backbone.getTotalLength ? backbone.getTotalLength() : 700;
  set(backbone, "stroke-dasharray", BB_LEN);

  var pairEls = [];
  for (i = 0; i < STEM; i++) {
    var y = yB - dy * i;
    var ln = el("line", { x1: xL + 13, y1: y, x2: xR - 13, y2: y, "class": "rs-bp", "stroke-dasharray": 22 }, svg);
    pairEls.push(ln);
  }

  var nts = [];
  pts.forEach(function (p, idx) {
    var g = el("g", { transform: "translate(" + p[0].toFixed(1) + "," + p[1].toFixed(1) + ")" }, svg);
    var ring = el("circle", { r: R + 4, "class": "rs-ring" }, g);
    var inner = el("g", {}, g);
    var c = el("circle", { r: R }, inner);
    var tx = el("text", { y: 4, "text-anchor": "middle", "class": "rs-letter" }, inner);
    nts.push({ inner: inner, circle: c, text: tx, ring: ring, base: null });
  });
  el("text", { x: 44, y: 400, "text-anchor": "end", "class": "rs-end" }, svg).textContent = "5′";
  el("text", { x: 176, y: 400, "class": "rs-end" }, svg).textContent = "3′";

  var labels = [
    el("text", { x: ROW_X, y: 84, "class": "rs-label" }, svg),
    el("text", { x: 424, y: 84, "text-anchor": "middle", "class": "rs-label" }, svg)
  ];
  labels[0].textContent = "lab-tested designs";
  labels[1].textContent = "active";

  function makeRow(r, parent) {
    var g = el("g", {}, parent), y0 = ROW_Y0 + r * ROW_DY;
    for (var q = 0; q < ROWS[r].length; q++) {
      el("rect", { x: ROW_X + q * 14, y: y0, width: 13, height: 18, rx: 2, "class": "rs-" + ROWS[r][q] }, g);
    }
    el("circle", { cx: 424, cy: y0 + 9, r: 6, "class": ACTIVE[r] ? "rs-yes" : "rs-no" }, g);
    return g;
  }
  var rows = [], flows = [];
  for (i = 0; i < ROWS.length; i++) rows.push(makeRow(i, svg));
  for (i = 0; i < ROWS.length; i++) flows.push(makeRow(i, svg));

  var model = el("g", {}, svg);
  var box = el("rect", { x: 282, y: 340, width: 124, height: 36, rx: 18, "class": "rs-box" }, model);
  var mtext = el("text", { x: 344, y: 363, "text-anchor": "middle", "class": "rs-model-text" }, model);
  mtext.textContent = "AI model";
  var link = el("path", { d: "M282,358 C232,358 196,262 152,240", "class": "rs-link" }, svg);
  var LINK_LEN = link.getTotalLength ? link.getTotalLength() : 200;
  set(link, "stroke-dasharray", LINK_LEN);

  function setBase(n, b) {
    if (n.base === b) return;
    n.base = b;
    n.circle.setAttribute("class", "rs-" + b);
    n.text.setAttribute("class", "rs-letter rs-letter-" + b);
    n.text.textContent = b;
  }

  // Draw the state at time t (seconds)
  var lastCap = -1;
  function render(t) {
    // 1. Fold
    set(backbone, "stroke-dashoffset", BB_LEN * (1 - seg(t, 0, 1.4)));
    nts.forEach(function (n, idx) {
      var start = idx / (NT - 1) * 1.4, k = seg(t, start, 0.42);
      var scale = back(k), opacity = clamp(k * 2.5);
      // 3. Design: shrink, swap the base, grow back
      var grp = -1;
      for (var g = 0; g < GROUPS.length; g++) if (GROUPS[g].indexOf(idx) >= 0) grp = g;
      var changed = SEQ1[idx] !== SEQ0[idx], swapped = false;
      if (grp >= 0 && changed) {
        var s = T_FLIP + grp * GAP;
        if (t >= s && t < s + 0.2) scale = 1 - seg(t, s, 0.2);
        else if (t >= s + 0.2) { scale = back(seg(t, s + 0.2, 0.32)); swapped = true; }
        set(n.ring, "opacity", swapped ? seg(t, s + 0.2, 0.3) : 0);
      } else {
        set(n.ring, "opacity", 0);
      }
      setBase(n, swapped ? SEQ1[idx] : SEQ0[idx]);
      set(n.inner, "opacity", opacity);
      n.inner.setAttribute("transform", "scale(" + Math.max(0.001, scale).toFixed(3) + ")");
    });
    pairEls.forEach(function (p, b) { set(p, "stroke-dashoffset", 22 * (1 - seg(t, 1.5 + b * 0.08, 0.26))); });

    // 2. Learn from lab data
    labels.forEach(function (l) { set(l, "opacity", seg(t, T_LEARN, 0.4)); });
    rows.forEach(function (r, k) {
      var appear = seg(t, T_LEARN + 0.15 + k * 0.11, 0.36);
      var dim = seg(t, T_FLOW + k * 0.11, 0.5);
      set(r, "opacity", appear * (1 - 0.65 * dim));
      r.setAttribute("transform", "translate(" + (12 * (1 - io(appear))).toFixed(2) + ",0)");
    });
    flows.forEach(function (f, k) {
      var p = seg(t, T_FLOW + k * 0.11, 0.65);
      if (p <= 0 || p >= 1) { set(f, "opacity", 0); return; }
      var e = easeIn(p), cy = ROW_Y0 + k * ROW_DY + 9, cx = ROW_X + 70;
      var ty = (MODEL_Y - cy) * e, sc = 1 - 0.6 * e;
      f.setAttribute("transform", "translate(" + cx + "," + (cy + ty).toFixed(2) + ") scale(" + sc.toFixed(3) + ") translate(" + (-cx) + "," + (-cy) + ")");
      set(f, "opacity", 1 - e);
    });
    set(model, "opacity", seg(t, T_LEARN + 0.9, 0.4));
    var pulse = t > T_FLOW + 0.3 && t < T_DESIGN ? Math.abs(Math.sin((t - T_FLOW - 0.3) * Math.PI * 1.4)) : 0;
    set(box, "stroke-width", 1.5 + 2 * pulse);

    // 3. Design: the model's output reaches the hairpin
    set(link, "stroke-dashoffset", LINK_LEN * (1 - io(seg(t, T_DESIGN, 0.65))));

    var c = t < T_LEARN ? 0 : t < T_DESIGN ? 1 : 2;
    if (c !== lastCap && cap) {
      lastCap = c;
      if (reduce) { cap.textContent = CAPS[c]; }
      else {
        cap.classList.add("swap");
        setTimeout(function () { cap.textContent = CAPS[c]; cap.classList.remove("swap"); }, 200);
      }
    }
  }

  // Playback
  var raf = 0, startAt = 0;
  function tick(now) {
    var t = (now - startAt) / 1000;
    render(Math.min(t, T_END));
    if (t < T_END) raf = requestAnimationFrame(tick);
    else if (btn) btn.hidden = false;
  }
  function play() {
    cancelAnimationFrame(raf);
    if (btn) btn.hidden = true;
    lastCap = -1;
    startAt = performance.now();
    raf = requestAnimationFrame(tick);
  }
  if (btn) btn.addEventListener("click", play);

  if (reduce || !window.requestAnimationFrame) {
    render(T_END);
    return;
  }
  render(0);
  if ("IntersectionObserver" in window) {
    var obs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { obs.disconnect(); play(); }
    }, { threshold: 0.35 });
    obs.observe(host);
  } else {
    play();
  }
})();
