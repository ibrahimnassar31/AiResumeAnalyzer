'use client';
import { useEffect, useRef } from 'react';

const METRICS = [
  { label: 'ATS', value: 70 },
  { label: 'الكلمات المفتاحية', value: 65 },
  { label: 'الطول', value: 50 },
  { label: 'الوضوح', value: 40 },
  { label: 'الإنجازات', value: 90 },
  { label: 'التنسيق', value: 80 },
];

const LEVELS = 6;
const MAX_VALUE = 100;
const CANVAS_SIZE = 400;
const RADIUS = CANVAS_SIZE / 2 - 48;

const SampleReport = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationFrame: number;
    let progress = 0;
    const duration = 1100; // ms
    const start = performance.now();

    function draw(current: number) {
      if (!ctx) return;
      progress = Math.min((current - start) / duration, 1);
      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      // --- Gradient background ---
      const bgGrad = ctx.createRadialGradient(
        CANVAS_SIZE / 2,
        CANVAS_SIZE / 2,
        60,
        CANVAS_SIZE / 2,
        CANVAS_SIZE / 2,
        CANVAS_SIZE / 2
      );
      bgGrad.addColorStop(0, '#23233a');
      bgGrad.addColorStop(0.7, '#18181b');
      bgGrad.addColorStop(1, '#18181b');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      // --- Soft vignette ---
      ctx.save();
      ctx.globalAlpha = 0.22;
      ctx.beginPath();
      ctx.arc(CANVAS_SIZE / 2, CANVAS_SIZE / 2, RADIUS + 38, 0, 2 * Math.PI);
      ctx.shadowColor = '#6366f1';
      ctx.shadowBlur = 60;
      ctx.fillStyle = '#23233a';
      ctx.fill();
      ctx.restore();
      // --- Draw grid ---
      ctx.save();
      ctx.strokeStyle = '#3f3f46';
      ctx.lineWidth = 1.2;
      for (let level = 1; level <= LEVELS; level++) {
        ctx.beginPath();
        for (let i = 0; i < METRICS.length; i++) {
          const angle = ((Math.PI * 2) / METRICS.length) * i - Math.PI / 2;
          const r = (RADIUS * level) / LEVELS;
          const x = CANVAS_SIZE / 2 + r * Math.cos(angle);
          const y = CANVAS_SIZE / 2 + r * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.globalAlpha = 0.18;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
      // --- Draw axes ---
      for (let i = 0; i < METRICS.length; i++) {
        const angle = ((Math.PI * 2) / METRICS.length) * i - Math.PI / 2;
        const x = CANVAS_SIZE / 2 + RADIUS * Math.cos(angle);
        const y = CANVAS_SIZE / 2 + RADIUS * Math.sin(angle);
        ctx.beginPath();
        ctx.moveTo(CANVAS_SIZE / 2, CANVAS_SIZE / 2);
        ctx.lineTo(x, y);
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 1.3;
        ctx.globalAlpha = 0.13;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
      ctx.restore();
      // --- Draw labels ---
      ctx.font = 'bold 20px Tahoma, Arial, sans-serif';
      ctx.fillStyle = '#e0e7ff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let i = 0; i < METRICS.length; i++) {
        const angle = ((Math.PI * 2) / METRICS.length) * i - Math.PI / 2;
        const x = CANVAS_SIZE / 2 + (RADIUS + 38) * Math.cos(angle);
        const y = CANVAS_SIZE / 2 + (RADIUS + 38) * Math.sin(angle);
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(0);
        ctx.shadowColor = '#6366f1';
        ctx.shadowBlur = 12;
        ctx.fillText(METRICS[i].label, 0, 0);
        ctx.restore();
      }
      // --- Draw level values ---
      ctx.font = 'bold 15px Tahoma, Arial, sans-serif';
      ctx.fillStyle = '#a1a1aa';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let level = 1; level <= LEVELS; level++) {
        const value = Math.round((MAX_VALUE * level) / LEVELS);
        const x = CANVAS_SIZE / 2;
        const y = CANVAS_SIZE / 2 - (RADIUS * level) / LEVELS;
        ctx.save();
        ctx.globalAlpha = 0.7;
        ctx.fillText(value.toString(), x, y - 12);
        ctx.restore();
      }
      // --- Animate polygon ---
      ctx.save();
      ctx.beginPath();
      let firstX = 0, firstY = 0;
      for (let i = 0; i < METRICS.length; i++) {
        const angle = ((Math.PI * 2) / METRICS.length) * i - Math.PI / 2;
        const r = (RADIUS * METRICS[i].value * progress) / MAX_VALUE;
        const x = CANVAS_SIZE / 2 + r * Math.cos(angle);
        const y = CANVAS_SIZE / 2 + r * Math.sin(angle);
        if (i === 0) {
          ctx.moveTo(x, y);
          firstX = x; firstY = y;
        } else ctx.lineTo(x, y);
      }
      ctx.closePath();
      // --- Polygon gradient fill ---
      const grad = ctx.createLinearGradient(CANVAS_SIZE/2, CANVAS_SIZE/2-RADIUS, CANVAS_SIZE/2, CANVAS_SIZE/2+RADIUS);
      grad.addColorStop(0, 'rgba(99,102,241,0.55)');
      grad.addColorStop(1, 'rgba(139,92,246,0.32)');
      ctx.globalAlpha = 0.22;
      ctx.fillStyle = grad;
      ctx.shadowColor = '#818cf8';
      ctx.shadowBlur = 24;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#818cf8';
      ctx.lineWidth = 4.2;
      ctx.shadowColor = '#818cf8';
      ctx.shadowBlur = 16;
      ctx.stroke();
      ctx.restore();
      // --- Draw animated data points ---
      for (let i = 0; i < METRICS.length; i++) {
        const angle = ((Math.PI * 2) / METRICS.length) * i - Math.PI / 2;
        const r = (RADIUS * METRICS[i].value * progress) / MAX_VALUE;
        const x = CANVAS_SIZE / 2 + r * Math.cos(angle);
        const y = CANVAS_SIZE / 2 + r * Math.sin(angle);
        ctx.save();
        // Outer glow
        ctx.beginPath();
        ctx.arc(x, y, 11, 0, 2 * Math.PI);
        ctx.globalAlpha = 0.22;
        ctx.fillStyle = '#6366f1';
        ctx.shadowColor = '#818cf8';
        ctx.shadowBlur = 18;
        ctx.fill();
        ctx.globalAlpha = 1;
        // White center
        ctx.beginPath();
        ctx.arc(x, y, 6.5, 0, 2 * Math.PI);
        ctx.fillStyle = '#fff';
        ctx.shadowBlur = 0;
        ctx.fill();
        // Indigo core
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = '#6366f1';
        ctx.fill();
        ctx.restore();
      }
      if (progress < 1) {
        animationFrame = requestAnimationFrame(draw);
      }
    }
    animationFrame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <>
      <div className="relative z-10 border-t border-zinc-800 my-16 mx-6 md:mx-12" />
      <section id="sample" className="relative z-10 px-6 md:px-12 pb-14">
        <h2 className="flex items-center justify-center gap-2 text-2xl md:text-3xl font-semibold tracking-tight text-center mb-12">
          <i data-lucide="file-bar-chart-2" className="w-8 h-8 text-indigo-400" aria-hidden="true" tabIndex={-1}></i>
          تقرير نموذجي
        </h2>
        <div className="max-w-xl mx-auto bg-zinc-900/50 backdrop-blur-md rounded-xl p-8 border border-zinc-800">
          <p className="text-sm text-zinc-400 mb-6 text-center">مثال على المقاييس التي يتتبعها الذكاء الاصطناعي لكل سيرة ذاتية.</p>
          <div className="flex items-center justify-center">
            <canvas
              id="scoreChart"
              ref={canvasRef}
              width={CANVAS_SIZE}
              height={CANVAS_SIZE}
              className="block mx-auto w-full max-w-[400px] h-auto"
              aria-label="مخطط رادار لمقاييس السيرة الذاتية"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default SampleReport;
