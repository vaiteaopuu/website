// Homepage banner: a looping three-scene RNA story drawn on canvas.
// 1) a sequence appears, 2) it folds into a hairpin, 3) a sequence is designed for that shape.
(function () {
  var cv = document.getElementById("rna-banner");
  if (!cv) return;
  var ctx = cv.getContext("2d");
  var cap = document.getElementById("rna-caption");
  var btn = document.getElementById("rna-pause");

  var W = 1600, H = 600, VIEW_H = 480, OFF = (H - VIEW_H) / 2;
  var COL = { bg: "#0c1220", fg: "#ebe5d8", muted: "#8b95ab", A: "#ef7b5e", U: "#e9b84c", G: "#3fb7a7", C: "#929ff2" };
  var SANS = "'Work Sans', system-ui, sans-serif";
  var CAPS = [
    "Every RNA is a string of four letters.",
    "It folds by pairing with itself.",
    "We design the sequence that folds into a chosen shape."
  ];
  var D = 5.5, NS = CAPS.length, TOTAL = D * NS;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Sequence: 12 bp stem closed by a UUCG tetraloop
  var LEFT = "GGCAGUCAGCUG", LOOP = "UUCG", comp = { A: "U", U: "A", G: "C", C: "G" };
  var SEQ = LEFT + LOOP + LEFT.split("").reverse().map(function (c) { return comp[c]; }).join("");
  var N = SEQ.length, STEM = LEFT.length;
  var PAIRS = []; for (var i = 0; i < STEM; i++) PAIRS.push([i, N - 1 - i]);

  // Layouts (logical canvas 1600 x 600)
  var R = 24, ST = 78, HALF = 50, D_LOOP = 58;
  var X0 = 800 - ((STEM - 1) * ST + D_LOOP + Math.hypot(D_LOOP, HALF)) / 2;
  var line = [], hp = [];
  for (i = 0; i < N; i++) line.push({ x: 110 + i * 1380 / (N - 1), y: 300 });
  (function () {
    var xe = X0 + (STEM - 1) * ST, cx = xe + D_LOOP, rr = Math.hypot(D_LOOP, HALF);
    var a0 = Math.atan2(-HALF, -D_LOOP) + 2 * Math.PI, a1 = Math.atan2(HALF, -D_LOOP);
    // go from the top end, clockwise around the right side, to the bottom end
    if (a0 > a1) a0 -= 2 * Math.PI;
    for (var i = 0; i < N; i++) {
      if (i < STEM) hp[i] = { x: X0 + i * ST, y: 300 - HALF };
      else if (i >= N - STEM) hp[i] = { x: X0 + (N - 1 - i) * ST, y: 300 + HALF };
      else {
        var j = i - STEM, a = a0 + (a1 - a0) * (j + 1) / (LOOP.length + 1);
        hp[i] = { x: cx + rr * Math.cos(a), y: 300 + rr * Math.sin(a) };
      }
    }
  })();
  // Design order: stem from the 5'/3' ends inwards, then the loop
  var ORDER = []; for (i = 0; i < N; i++) ORDER.push(i < STEM ? i : i >= N - STEM ? N - 1 - i : STEM + (i - STEM) * 0.5);

  // Helpers
  function clamp(v, a, b) { return Math.max(a === undefined ? 0 : a, Math.min(b === undefined ? 1 : b, v)); }
  function seg(t, a, b) { return clamp((t - a) / (b - a)); }
  function io(t) { t = clamp(t); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function back(t) { t = clamp(t); var c = 1.7; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); }
  function lerp(a, b, m) { return a + (b - a) * m; }
  function rgba(hex, a) { var n = parseInt(hex.slice(1), 16); return "rgba(" + (n >> 16 & 255) + "," + (n >> 8 & 255) + "," + (n & 255) + "," + a + ")"; }

  var showLetters = true;
  function resize() {
    var r = cv.getBoundingClientRect(), d = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.max(1, Math.round(r.width * d));
    cv.height = Math.max(1, Math.round(r.height * d));
    showLetters = r.width > 560;
    if (!playing) render();
  }

  function text(s, x, y, o) {
    ctx.globalAlpha = o.a === undefined ? 1 : o.a;
    ctx.fillStyle = o.color || COL.muted;
    ctx.font = (o.weight || 400) + " " + (o.size || 22) + "px " + SANS;
    ctx.textAlign = o.align || "left"; ctx.textBaseline = "middle";
    ctx.fillText(s, x, y); ctx.globalAlpha = 1;
  }

  function bead(p, col, letter, hollow) {
    if (p.r <= 0.3 || p.a <= 0) return;
    ctx.globalAlpha = p.a; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    if (hollow) { ctx.setLineDash([4, 5]); ctx.lineWidth = 2; ctx.strokeStyle = COL.muted; ctx.stroke(); ctx.setLineDash([]); }
    else { ctx.fillStyle = col; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = COL.bg; ctx.stroke(); }
    if (letter && showLetters && p.r > 9) {
      ctx.fillStyle = hollow ? COL.muted : COL.bg;
      ctx.font = "600 " + Math.round(p.r * 0.95) + "px " + SANS;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(letter, p.x, p.y + p.r * 0.06);
    }
    ctx.globalAlpha = 1;
  }

  function molecule(P, o) {
    o = o || {};
    ctx.lineCap = "round"; ctx.strokeStyle = COL.fg;
    for (var i = 1; i < P.length; i++) {
      var p = P[i - 1], q = P[i], a = Math.min(p.a, q.a); if (a <= 0) continue;
      ctx.globalAlpha = 0.45 * a; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
    }
    var pairs = o.pairs || [], pa = o.pairA || 0;
    if (pa > 0) pairs.forEach(function (ij) {
      var p = P[ij[0]], q = P[ij[1]], a = Math.min(p.a, q.a) * pa; if (a <= 0) return;
      ctx.globalAlpha = 0.6 * a; ctx.lineWidth = 7; ctx.setLineDash([2, 8]);
      ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); ctx.setLineDash([]);
    });
    ctx.globalAlpha = 1;
    P.forEach(function (p, i) {
      var L = p.L !== undefined ? p.L : SEQ[i];
      bead(p, o.col ? o.col(i) : COL[SEQ[i]], L, o.hollow ? o.hollow(i) : false);
    });
  }

  function background() {
    ctx.fillStyle = COL.bg; ctx.fillRect(0, 0, W, H);
    var g = ctx.createRadialGradient(800, 280, 40, 800, 280, 760);
    g.addColorStop(0, rgba(COL.C, 0.10)); g.addColorStop(1, rgba(COL.C, 0));
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }

  // Scenes (t in 0..1 within the scene, T = absolute seconds)
  function sSequence(t, T) {
    var P = line.map(function (p, i) {
      var st = 0.03 + i * 0.02, k = seg(t, st, st + 0.09);
      return { x: p.x, y: p.y + 16 * Math.sin(i * 0.55 + T * 1.6), r: R * back(k), a: k };
    });
    molecule(P);
    text("5′", 70, 300, { size: 26, a: seg(t, 0, 0.1) });
    text("3′", 1530, 300, { size: 26, align: "right", a: seg(t, 0.6, 0.75) });
  }

  function sFold(t, T) {
    var m = io(seg(t, 0.06, 0.6));
    var P = line.map(function (p, i) {
      return { x: lerp(p.x, hp[i].x, m), y: lerp(p.y + 16 * Math.sin(i * 0.55 + T * 1.6) * (1 - m), hp[i].y, m), r: R, a: 1 };
    });
    molecule(P, { pairs: PAIRS, pairA: seg(t, 0.5, 0.72) });
    var a = seg(t, 0.68, 0.82);
    text("5′", X0 - 40, 300 - HALF, { size: 24, align: "right", a: a });
    text("3′", X0 - 40, 300 + HALF, { size: 24, align: "right", a: a });
  }

  function sDesign(t, T) {
    function settle(i) { return 0.16 + ORDER[i] * 0.03; }
    var P = hp.map(function (p, i) {
      var s = settle(i), done = t >= s, scr = t > s - 0.08 && !done;
      return { x: p.x, y: p.y, r: R, a: 1, done: done, scr: scr,
        L: done ? SEQ[i] : scr ? "AUGC"[(Math.floor(T * 16) * 7 + i * 13) % 4] : "" };
    });
    molecule(P, {
      pairs: PAIRS.filter(function (ij) { return t >= settle(ij[0]) + 0.03; }), pairA: 1,
      hollow: function (i) { return !P[i].done && !P[i].scr; },
      col: function (i) { return P[i].done ? COL[SEQ[i]] : rgba(COL.fg, 0.22); }
    });
  }

  var SC = [sSequence, sFold, sDesign];
  var FADE_IN = [1, 0, 0], FADE_OUT = [0, 0, 1];

  var elapsed = reduce ? D * 1.95 : 0, playing = !reduce, last = null, cur = -1;

  function render() {
    var s = Math.min(NS - 1, Math.floor(elapsed / D)), t = (elapsed - s * D) / D;
    ctx.setTransform(cv.width / W, 0, 0, cv.height / VIEW_H, 0, -OFF * cv.height / VIEW_H);
    background();
    SC[s](t, elapsed);
    var fade = (FADE_IN[s] ? seg(t, 0, 0.05) : 1) * (FADE_OUT[s] ? 1 - seg(t, 0.93, 1) : 1);
    if (fade < 1) { ctx.globalAlpha = 1 - fade; ctx.fillStyle = COL.bg; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
    if (s !== cur && cap) {
      cur = s;
      cap.classList.add("swap");
      setTimeout(function () { cap.textContent = CAPS[s]; cap.classList.remove("swap"); }, reduce ? 0 : 220);
    }
  }

  var visible = true;
  function frame(now) {
    if (last == null) last = now;
    var dt = Math.min(0.1, (now - last) / 1000); last = now;
    if (playing && visible) { elapsed = (elapsed + dt) % TOTAL; render(); }
    requestAnimationFrame(frame);
  }

  function setPlay(p) {
    playing = p; last = null;
    if (btn) { btn.textContent = p ? "Pause" : "Play"; btn.setAttribute("aria-pressed", String(!p)); }
  }

  if (btn) {
    if (reduce) btn.hidden = true;
    btn.addEventListener("click", function () { setPlay(!playing); });
  }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(cv);
  }
  if ("ResizeObserver" in window) new ResizeObserver(resize).observe(cv);
  else window.addEventListener("resize", resize);

  setPlay(playing);
  resize();
  render();
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(render);
  requestAnimationFrame(frame);
})();
