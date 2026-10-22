// Lightweight canvas confetti engine for celebrations and certificate unlocking
export function triggerConfetti() {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);

  const colors = ['#39A900', '#00324D', '#FCD116', '#003893', '#CE1126', '#10B981', '#3B82F6'];
  const particles: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    size: number;
    angle: number;
    spin: number;
    alpha: number;
  }> = [];

  for (let i = 0; i < 120; i++) {
    particles.push({
      x: width / 2 + (Math.random() - 0.5) * 200,
      y: height / 3 + (Math.random() - 0.5) * 50,
      vx: (Math.random() - 0.5) * 14,
      vy: Math.random() * -12 - 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      angle: Math.random() * 360,
      spin: (Math.random() - 0.5) * 8,
      alpha: 1,
    });
  }

  let animationFrameId: number;
  const startTime = Date.now();

  function update() {
    const elapsed = Date.now() - startTime;
    if (elapsed > 3500) {
      cancelAnimationFrame(animationFrameId);
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
      return;
    }

    ctx!.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // gravity
      p.angle += p.spin;
      p.alpha = Math.max(0, 1 - elapsed / 3500);

      ctx!.save();
      ctx!.globalAlpha = p.alpha;
      ctx!.translate(p.x, p.y);
      ctx!.rotate((p.angle * Math.PI) / 180);
      ctx!.fillStyle = p.color;
      ctx!.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx!.restore();
    });

    animationFrameId = requestAnimationFrame(update);
  }

  animationFrameId = requestAnimationFrame(update);
}
