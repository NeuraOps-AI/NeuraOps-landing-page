"use client";

import { useEffect, useRef, useState } from "react";
import { useDailyTheme } from "./daily-brand";
import type { RGB } from "./brand-themes";

type Point = { x: number; y: number; z: number; size: number; color: RGB; hub: boolean };
const TAU = Math.PI * 2;

function blend(a: RGB, b: RGB, amount: number): RGB {
  return [
    Math.round(a[0] + (b[0] - a[0]) * amount),
    Math.round(a[1] + (b[1] - a[1]) * amount),
    Math.round(a[2] + (b[2] - a[2]) * amount),
  ];
}
function ink(color: RGB, alpha: number) {
  return `rgba(${color[0]},${color[1]},${color[2]},${alpha})`;
}

function NeuronIcon() {
  return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <circle cx="16" cy="16" r="4"/><path d="m13 13-5-5m0 0V4m0 4H4m15 5 5-5m0 0h4m-4 0V4m-5 15 5 5m0 0v4m0-4h4m-15-5-5 5m0 0H4m4 0v4M12 16H5m15 0h7M16 12V5m0 15v7"/>
  </svg>;
}

export default function NeuralNetwork({ paused }: { paused: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const elapsed = useRef(0);
  const theme = useDailyTheme();
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync(); media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    let width = 1, height = 1, frame = 0, lastFrame = 0, visible = true;
    const moving = !paused && !reduced;
    const pointer = { x: 0, y: 0, smoothedX: 0, smoothedY: 0 };

    function render(stamp: number) {
      if (!context) return;
      frame = 0;
      if (moving && visible && !document.hidden) frame = requestAnimationFrame(render);
      if (moving && lastFrame && stamp - lastFrame < 32) return;
      if (moving) elapsed.current += lastFrame ? Math.min((stamp - lastFrame) / 1000, .08) : 0;
      lastFrame = stamp;
      const time = elapsed.current;
      pointer.smoothedX += (pointer.x - pointer.smoothedX) * .06;
      pointer.smoothedY += (pointer.y - pointer.smoothedY) * .06;
      context.clearRect(0, 0, width, height);
      const angle = time * .18 + .3 + pointer.smoothedX * .65;
      const tilt = .52 + pointer.smoothedY * .4;
      const scale = Math.min(width, height) / 8.3;
      const rings = width < 440 ? 112 : 154;
      const strands = 7;
      const points: Point[] = [];

      // A continuous spiral of neuron bodies and synapses, projected from 3D.
      for (let i = 0; i < rings; i++) {
        const u = i / rings * TAU;
        const mix = (Math.sin(u) + 1) / 2 * 2;
        const stop = Math.min(1, Math.floor(mix));
        const color = blend(theme.neurons[stop], theme.neurons[stop + 1], mix - stop);
        for (let j = 0; j < strands; j++) {
          const v = j / strands * TAU + u * 2;
          const tube = .34 + .045 * Math.sin(u * 5 + time * .4);
          const radius = 2.0 + .67 * Math.cos(3 * u);
          const x = (radius + tube * Math.cos(v)) * Math.cos(2 * u);
          const y = (radius + tube * Math.cos(v)) * Math.sin(2 * u);
          const z = .84 * Math.sin(3 * u) + tube * Math.sin(v);
          const rx = x * Math.cos(angle) + z * Math.sin(angle);
          const rz = z * Math.cos(angle) - x * Math.sin(angle);
          const ry = y * Math.cos(tilt) - rz * Math.sin(tilt);
          const depth = y * Math.sin(tilt) + rz * Math.cos(tilt);
          const perspective = 8 / (8 - depth);
          points.push({ x: width / 2 + rx * scale * perspective, y: height / 2 + ry * scale * perspective,
            z: depth, size: perspective, color, hub: i % 11 === 0 && (j === 0 || j === 3) });
        }
      }

      // Connections stay attached to their neuron bodies as the network rotates.
      context.lineWidth = .65;
      for (let i = 0; i < rings; i++) {
        for (let j = 0; j < strands; j++) {
          const point = points[i * strands + j];
          const next = points[((i + 1) % rings) * strands + j];
          const alpha = .12 + (point.z + 3) * .025;
          context.strokeStyle = ink(point.color, alpha);
          context.beginPath(); context.moveTo(point.x, point.y); context.lineTo(next.x, next.y); context.stroke();
          if (i % 3 === 0) {
            const branch = points[i * strands + (j + 1) % strands];
            context.strokeStyle = ink(point.color, alpha * .65);
            context.beginPath(); context.moveTo(point.x, point.y); context.lineTo(branch.x, branch.y); context.stroke();
          }
        }
      }

      const sorted = [...points].sort((a, b) => a.z - b.z);
      for (const point of sorted) {
        const alpha = Math.min(.9, .32 + (point.z + 3) * .12);
        const radius = point.size * (point.hub ? 3 : .95);
        if (point.hub) {
          const glowRadius = 10 * point.size;
          const glow = context.createRadialGradient(point.x, point.y, 0, point.x, point.y, glowRadius);
          glow.addColorStop(0, ink(point.color, .26)); glow.addColorStop(1, ink(point.color, 0));
          context.fillStyle = glow; context.fillRect(point.x - glowRadius, point.y - glowRadius, glowRadius * 2, glowRadius * 2);
          // Short branching dendrites distinguish the larger neuron bodies.
          context.strokeStyle = ink(point.color, alpha * .65); context.lineWidth = .8;
          for (let branch = 0; branch < 4; branch++) {
            const direction = branch / 4 * TAU + point.z;
            const length = 7 * point.size;
            const endX = point.x + Math.cos(direction) * length;
            const endY = point.y + Math.sin(direction) * length;
            context.beginPath(); context.moveTo(point.x, point.y); context.lineTo(endX, endY);
            context.lineTo(endX + Math.cos(direction + .7) * length * .45, endY + Math.sin(direction + .7) * length * .45);
            context.moveTo(endX, endY); context.lineTo(endX + Math.cos(direction - .7) * length * .4, endY + Math.sin(direction - .7) * length * .4); context.stroke();
          }
        }
        context.fillStyle = ink(point.color, alpha);
        context.beginPath(); context.arc(point.x, point.y, radius, 0, TAU); context.fill();
        if (point.hub) {
          context.fillStyle = "rgba(255,255,255,.85)";
          context.beginPath(); context.arc(point.x, point.y, radius * .32, 0, TAU); context.fill();
        }
      }

      // Signals travel along the connections instead of floating arbitrarily.
      for (let signal = 0; signal < 9; signal++) {
        const position = ((time * .047 + signal / 9) % 1) * rings;
        const i = Math.floor(position), fraction = position - i, j = signal % strands;
        const a = points[i * strands + j], b = points[((i + 1) % rings) * strands + j];
        const x = a.x + (b.x - a.x) * fraction, y = a.y + (b.y - a.y) * fraction;
        const radius = 15 * a.size;
        const glow = context.createRadialGradient(x, y, 0, x, y, radius);
        glow.addColorStop(0, ink(a.color, .8)); glow.addColorStop(.18, ink(a.color, .45)); glow.addColorStop(1, ink(a.color, 0));
        context.fillStyle = glow; context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
        context.fillStyle = ink(a.color, 1); context.beginPath(); context.arc(x, y, 2.1 * a.size, 0, TAU); context.fill();
      }
    }

    function start() { cancelAnimationFrame(frame); lastFrame = 0; frame = requestAnimationFrame(render); }
    function resize() {
      if (!canvas || !context) return;
      const rect = canvas.getBoundingClientRect(); width = rect.width; height = rect.height;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = width * ratio; canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0); start();
    }
    const onMove = (event: PointerEvent) => {
      if (!moving || event.pointerType === "touch" || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      pointer.x = (event.clientX - rect.left) / rect.width - .5;
      pointer.y = (event.clientY - rect.top) / rect.height - .5;
    };
    const onLeave = () => { pointer.x = 0; pointer.y = 0; };
    const onVisibility = () => { if (!document.hidden && visible) start(); else cancelAnimationFrame(frame); };
    const sizeObserver = new ResizeObserver(resize); sizeObserver.observe(canvas); resize();
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start(); else cancelAnimationFrame(frame);
    });
    observer.observe(canvas);
    canvas.addEventListener("pointermove", onMove); canvas.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(frame); observer.disconnect(); sizeObserver.disconnect();
      canvas.removeEventListener("pointermove", onMove); canvas.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [theme, paused, reduced]);

  return <div className="neural-visual" data-palette={theme.name}>
    <div className="neural-halo" aria-hidden="true"/>
    <canvas ref={canvasRef} className="neural-canvas" role="img" aria-label="A rotating spiral of connected neurons with signals travelling between them, representing NeuraOps AI applications, CloudOps, and software engineering"/>
    <div className="neural-label neural-ai"><span className="neural-label-icon"><NeuronIcon/></span><div><strong>AI applications</strong><small>Connected intelligence</small></div></div>
    <div className="neural-label neural-cloud"><span className="neural-label-icon"><svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M8 24a7 7 0 1 1 1.2-13.9A8 8 0 0 1 24.7 13 5.5 5.5 0 0 1 24 24H8Z"/><path d="M11 28h10m-5-4v4"/></svg></span><div><strong>CloudOps</strong><small>Reliable by design</small></div></div>
    <div className="neural-label neural-software"><span className="neural-label-icon"><svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="m11 9-7 7 7 7m10-14 7 7-7 7m-3-18-4 22"/></svg></span><div><strong>Software engineering</strong><small>Built to solve real problems</small></div></div>
    <div className="neural-caption"><span className="tiny-dot"/>Intelligence. Infrastructure. Impact.</div>
  </div>;
}
