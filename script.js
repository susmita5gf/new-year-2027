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
const stars = Array.from({ length: 120 }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  r: Math.random() * 1.6 + 0.3,
  t: Math.random() * Math.PI * 2
}));

let sparks = [];
let confetti = [];

function firework(x, y) {
  const hue = Math.random() * 360;
  for (let i = 0; i < 70; i++) {
    const a = (Math.PI * 2 * i) / 70;
    const sp = Math.random() * 4 + 1;
    sparks.push({
      x, y,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp,
      life: 90,
      color: `hsl(${hue + Math.random() * 40}, 100%, 60%)`
    });
  }
}

function rain() {
  const colors = ["#ffd54a", "#ff8a3d", "#ff4d8d", "#6ee7ff", "#a78bfa"];
  for (let i = 0; i < 80; i++) {
    confetti.push({
      x: Math.random() * W,
      y: -20 - Math.random() * 200,
      w: Math.random() * 8 + 4,
      h: Math.random() * 12 + 6,
      vy: Math.random() * 3 + 2,
      vx: Math.random() * 2 - 1,
      rot: Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }
}

function draw() {
  ctx.fillStyle = "rgba(9, 8, 24, 0.25)";
  ctx.fillRect(0, 0, W, H);

  stars.forEach(s => {
    s.t += 0.03;
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
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    ctx.fill();
  });

  confetti = confetti.filter(c => c.y < H + 30);
  confetti.forEach(c => {
    c.y += c.vy;
    c.x += c.vx;
    c.rot += 0.1;
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

/* নিজে নিজে মাঝে মাঝে আতশবাজি */
setInterval(() => firework(Math.random() * W, Math.random() * H * 0.5), 2500);

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
setTimeout(type, 2000);

/* 1 January 2027-এর countdown */
const target = new Date("January 1, 2027 00:00:00").getTime();
const pad = n => String(n).padStart(2, "0");

function tick() {
  const diff = target - Date.now();
  if (diff <= 0) {
    document.getElementById("countdown").innerHTML =
      "<h2>🎉 Happy New Year 2027! 🎉</h2>";
    return;
  }
  document.getElementById("d").textContent = pad(Math.floor(diff / 86400000));
  document.getElementById("h").textContent = pad(Math.floor(diff / 3600000) % 24);
  document.getElementById("m").textContent = pad(Math.floor(diff / 60000) % 60);
  document.getElementById("s").textContent = pad(Math.floor(diff / 1000) % 60);
}
tick();
setInterval(tick, 1000);

/* button চাপলে আতশবাজি + confetti */
document.getElementById("btn").addEventListener("click", () => {
  rain();
  for (let k = 0; k < 6; k++) {
    setTimeout(() => firework(Math.random() * W, Math.random() * H * 0.6), k * 250);
  }
});

/* যেখানে click করবে সেখানেই আতশবাজি */
window.addEventListener("click", e => {
  if (e.target.id !== "btn") firework(e.clientX, e.clientY);
});