const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");
let W, H;

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

/* মিটমিট করা তারা */
const stars = Array.from({ length: 140 }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  r: Math.random() * 1.8 + 0.4,
  t: Math.random() * Math.PI * 2
}));

let sparks = [];
let confetti = [];

function firework(x, y) {
  const hue = Math.random() * 360;
  for (let i = 0; i < 95; i++) {
    const a = (Math.PI * 2 * i) / 95;
    const sp = Math.random() * 5 + 1.4;
    sparks.push({
      x, y,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp,
      r: Math.random() * 2.2 + 2,
      life: 100,
      color: `hsl(${hue + Math.random() * 45}, 100%, 62%)`
    });
  }
}

function rain() {
  const colors = ["#ffd54a", "#ff8a3d", "#ff4d8d", "#6ee7ff", "#a78bfa"];
  for (let i = 0; i < 100; i++) {
    confetti.push({
      x: Math.random() * W,
      y: -20 - Math.random() * 220,
      w: Math.random() * 9 + 5,
      h: Math.random() * 13 + 7,
      vy: Math.random() * 3.4 + 2.2,
      vx: Math.random() * 2.4 - 1.2,
      rot: Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }
}

function draw() {
  ctx.clearRect(0, 0, W, H);

  stars.forEach(s => {
    s.t += 0.045;
    ctx.globalAlpha = 0.5 + Math.sin(s.t) * 0.5;
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  sparks = sparks.filter(p => p.life > 0);
  sparks.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.04;
    p.life--;
    ctx.globalAlpha = Math.max(0, p.life / 100);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  confetti = confetti.filter(c => c.y < H + 30);
  confetti.forEach(c => {
    c.y += c.vy;
    c.x += c.vx;
    c.rot += 0.12;
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate(c.rot);
    ctx.fillStyle = c.color;
    ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
    ctx.restore();
  });

  requestAnimationFrame(draw);
}
draw();

/* শুরুতেই ও প্রতি ১.৮ সেকেন্ডে আতশবাজি */
setTimeout(() => firework(W * 0.25, H * 0.28), 300);
setTimeout(() => firework(W * 0.75, H * 0.28), 750);
setInterval(() => firework(Math.random() * W, Math.random() * H * 0.5), 1800);

/* লেখা একটা একটা করে টাইপ হবে */
const text = "নতুন বছর, নতুন স্বপ্ন। ২০২৭ তোমার জীবনে নিয়ে আসুক সুখ, শান্তি আর অনেক সাফল্য।";
const typedEl = document.getElementById("typed");
let i = 0;
function type() {
  if (i <= text.length) {
    typedEl.textContent = text.slice(0, i++);
    setTimeout(type, 70);
  }
}
setTimeout(type, 900);

/* button চাপলে আতশবাজি + confetti */
document.getElementById("btn").addEventListener("click", () => {
  rain();
  for (let k = 0; k < 8; k++) {
    setTimeout(() => firework(Math.random() * W, Math.random() * H * 0.6), k * 180);
  }
});

/* যেখানে click করবে সেখানেই আতশবাজি */
window.addEventListener("click", e => {
  if (e.target.id !== "btn") firework(e.clientX, e.clientY);
});