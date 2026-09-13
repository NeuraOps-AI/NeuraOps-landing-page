"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { useDailyTheme } from "./daily-brand";
import type { RGB } from "./brand-themes";
import symbol from "./neural-symbol.json";
import { advanceMotion, circuitPoint, CIRCUIT_SECONDS, projectNeuron, revolutionAngle, REVOLUTION_SECONDS, type Position3D } from "./neural-motion";

type Point = { x: number; y: number; z: number; color: RGB; energy: number };
type Pulse = { x: number; y: number; started: number };
const TAU = Math.PI * 2;
const services = [
  { name: "AI applications", detail: "Connected intelligence", message: "AI applications. Ideas become intelligence." },
  { name: "CloudOps", detail: "Reliable by design", message: "CloudOps. Intelligence meets infrastructure." },
  { name: "Software engineering", detail: "Built to solve real problems", message: "Software engineering. Connections become solutions." },
];

function blend(a: RGB, b: RGB, amount: number): RGB {
  return [Math.round(a[0] + (b[0] - a[0]) * amount), Math.round(a[1] + (b[1] - a[1]) * amount), Math.round(a[2] + (b[2] - a[2]) * amount)];
}
function ink(color: RGB, alpha: number) {
  return `rgba(${color[0]},${color[1]},${color[2]},${alpha})`;
}

function ServiceIcon({ index }: { index: number }) {
  return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
    {index === 0 ? <><circle cx="16" cy="16" r="4"/><path d="m13 13-5-5m0 0V4m0 4H4m15 5 5-5m0 0h4m-4 0V4m-5 15 5 5m0 0v4m0-4h4m-15-5-5 5m0 0H4m4 0v4M12 16H5m15 0h7M16 12V5m0 15v7"/></> : index === 1 ? <><path d="M8 24a7 7 0 1 1 1.2-13.9A8 8 0 0 1 24.7 13 5.5 5.5 0 0 1 24 24H8Z"/><path d="M11 28h10m-5-4v4"/></> : <path d="m11 9-7 7 7 7m10-14 7 7-7 7m-3-18-4 22"/>}
  </svg>;
}

export default function NeuralNetwork({ paused }: { paused: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const surfaceRef = useRef<HTMLButtonElement>(null);
  const badgesRef = useRef<(HTMLButtonElement | null)[]>([]);
  const elapsed = useRef(0);
  const motion = useRef({ flow: 0, spin: 0, boost: 0 });
  const orbitTime = useRef(0);
  const held = useRef({ hover: false, focus: false });
  const trigger = useRef<(x: number, y: number, service: number | null) => void>(() => {});
  const lastActivation = useRef<{ x: number; y: number } | null>(null);
  const theme = useDailyTheme();
  const [reduced, setReduced] = useState(false);
  const [activeService, setActiveService] = useState<number | null>(null);
  const [activationCount, setActivationCount] = useState(0);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync(); media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current, surface = surfaceRef.current;
    if (!canvas || !surface) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    let width = 1, height = 1, frame = 0, lastFrame = 0, visible = true;
    let points: Point[] = [];
    let pulses: Pulse[] = [];
    const moving = !paused && !reduced;
    const pointer = { x: 0, y: 0, smoothedX: 0, smoothedY: 0 };
    function colorAt(x: number) {
      const position = Math.min(1.999, Math.max(0, (x + .5) * 2));
      const stop = Math.floor(position);
      return blend(theme.neurons[stop], theme.neurons[stop + 1], position - stop);
    }
    const colors = symbol.nodes.map(([x]) => colorAt(x));
    const edgeGroups: [number, number][][] = Array.from({ length: 9 }, () => []);
    for (const [a, b] of symbol.edges) {
      const group = Math.min(8, Math.floor((symbol.nodes[a][0] + .5) * 9));
      edgeGroups[group].push([a, b]);
    }
    const circuit = Array.from({ length: 240 }, (_, i) => circuitPoint(i / 240));

    function positionBadges() {
      const radiusX = Math.max(60, (width - (width < 440 ? 148 : 190)) / 2 - 12);
      const radiusY = height * .32;
      badgesRef.current.forEach((badge, index) => {
        if (!badge) return;
        const angle = orbitTime.current * .12 + (-145 + index * 120) / 180 * Math.PI;
        const x = Math.cos(angle) * radiusX;
        const y = Math.sin(angle) * radiusY;
        badge.style.transform = `translate(-50%, -50%) translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) rotate(${(Math.cos(angle) * 3).toFixed(2)}deg)`;
      });
    }

    function render(stamp: number) {
      if (!context) return;
      frame = 0;
      if (moving && visible && !document.hidden) frame = requestAnimationFrame(render);
      if (moving && lastFrame && stamp - lastFrame < 32) return;
      const delta = moving && lastFrame ? Math.min((stamp - lastFrame) / 1000, .08) : 0;
      elapsed.current += delta;
      advanceMotion(motion.current, delta);
      if (!held.current.hover && !held.current.focus) orbitTime.current += delta;
      lastFrame = stamp;
      const time = elapsed.current;
      pointer.smoothedX += (pointer.x - pointer.smoothedX) * .08;
      pointer.smoothedY += (pointer.y - pointer.smoothedY) * .08;
      context.clearRect(0, 0, width, height);
      positionBadges();
      const scale = width * .82 * (1 + Math.sin(time * .7) * .012);
      const yaw = revolutionAngle(motion.current.spin) + pointer.smoothedX * .2;
      const rotationPhase = motion.current.spin / REVOLUTION_SECONDS * TAU;
      const tilt = .12 + Math.sin(rotationPhase) * .14 + pointer.smoothedY * .18;
      const roll = Math.sin(rotationPhase / 2) * .055;
      const project = (position: Position3D) => {
        const p = projectNeuron(position, yaw, tilt, roll);
        return { ...p, x: width / 2 + p.x * scale, y: height * .46 + p.y * scale };
      };
      pulses = pulses.filter(pulse => time - pulse.started < 2.8);
      points = symbol.nodes.map(([x, y, z], index) => {
        let energy = 0;
        for (const pulse of pulses) {
          const distance = Math.hypot(x - pulse.x, y - pulse.y);
          const wave = (time - pulse.started) * .46;
          energy = Math.max(energy, Math.exp(-(((distance - wave) / .055) ** 2)) * Math.max(0, 1 - (time - pulse.started) / 2.8));
        }
        if (!moving && lastActivation.current) {
          energy = Math.max(0, 1 - Math.hypot(x - lastActivation.current.x, y - lastActivation.current.y) / .4) * .8;
        }
        const p = project([x, y, z - .03]);
        return { ...p, color: colors[index], energy };
      });

      // A recessed copy and short depth connections give the network volume
      // during the full turn, including the brief edge-on view.
      const back = symbol.nodes.map(([x, y, z]) => project([x, y, z - .085]));
      context.lineWidth = .55;
      context.strokeStyle = ink(theme.neurons[1], .09 + Math.abs(Math.sin(yaw)) * .12);
      context.beginPath();
      for (const [a, b] of symbol.edges) {
        context.moveTo(back[a].x, back[a].y); context.lineTo(back[b].x, back[b].y);
      }
      for (let i = 0; i < points.length; i += 7) {
        context.moveTo(back[i].x, back[i].y); context.lineTo(points[i].x, points[i].y);
      }
      context.stroke();

      context.lineWidth = width < 440 ? .5 : .65;
      edgeGroups.forEach((edges, group) => {
        const amount = group / 8 * 1.999, stop = Math.floor(amount);
        const color = blend(theme.neurons[stop], theme.neurons[stop + 1], amount - stop);
        context.strokeStyle = ink(color, .18);
        context.beginPath();
        for (const [a, b] of edges) {
          context.moveTo(points[a].x, points[a].y); context.lineTo(points[b].x, points[b].y);
        }
        context.stroke();
        context.strokeStyle = ink(color, .65);
        context.beginPath();
        for (const [a, b] of edges) {
          if (points[a].energy + points[b].energy < .55) continue;
          context.moveTo(points[a].x, points[a].y); context.lineTo(points[b].x, points[b].y);
        }
        context.stroke();
      });

      for (const [index, point] of points.entries()) {
        const radius = (width < 440 ? .6 : .85) + point.energy * (width < 440 ? .55 : 1.1);
        if (point.energy > .6 && index % 7 === 0) {
          const glowRadius = 7 + point.energy * 10;
          const glow = context.createRadialGradient(point.x, point.y, 0, point.x, point.y, glowRadius);
          glow.addColorStop(0, ink(point.color, .22 + point.energy * .22)); glow.addColorStop(1, ink(point.color, 0));
          context.fillStyle = glow; context.fillRect(point.x - glowRadius, point.y - glowRadius, glowRadius * 2, glowRadius * 2);
        }
        context.fillStyle = ink(point.color, Math.min(1, .5 + point.energy * .4));
        context.beginPath(); context.arc(point.x, point.y, radius, 0, TAU); context.fill();
      }

      const projectedCircuit = circuit.map(project);
      context.lineWidth = .8;
      context.strokeStyle = ink(theme.neurons[1], .18);
      context.beginPath();
      projectedCircuit.forEach((p, i) => { if (i) context.lineTo(p.x, p.y); else context.moveTo(p.x, p.y); });
      context.closePath(); context.stroke();

      // Every large neuron completes the whole circuit, with a visible trailing
      // axon. Small mesh nodes stay as the supporting structure of the logo.
      const neurons = Array.from({ length: 12 }, (_, i) => {
        const progress = motion.current.flow / CIRCUIT_SECONDS + i / 12;
        const lane = (i % 3 - 1) * .009;
        const position = circuitPoint(progress, lane);
        return { progress, lane, position, lead: i === 0, ...project(position), color: colorAt(position[0]) };
      }).sort((a, b) => a.z - b.z);
      for (const neuron of neurons) {
        const { x, y, perspective, color } = neuron;
        const alpha = .68 + Math.min(.3, (neuron.z + .5) * .35);
        const trailLength = neuron.lead ? 28 : 18;
        for (let trail = trailLength; trail > 0; trail--) {
          const a = project(circuitPoint(neuron.progress - trail * .002, neuron.lane));
          const b = project(circuitPoint(neuron.progress - (trail - 1) * .002, neuron.lane));
          context.strokeStyle = ink(color, (1 - trail / (trailLength + 1)) * alpha * .6);
          context.lineWidth = (1 - trail / (trailLength + 2)) * (width < 440 ? 2 : 3.2) * perspective;
          context.beginPath(); context.moveTo(a.x, a.y); context.lineTo(b.x, b.y); context.stroke();
        }
        const radius = (width < 440 ? 2.7 : 3.7) * perspective * (neuron.lead ? 1.4 : 1);
        const glowRadius = (width < 440 ? 15 : 23) * perspective * (1 + motion.current.boost * .25);
        const glow = context.createRadialGradient(x, y, 0, x, y, glowRadius);
        glow.addColorStop(0, ink(color, .55)); glow.addColorStop(.25, ink(color, .2)); glow.addColorStop(1, ink(color, 0));
        context.fillStyle = glow; context.fillRect(x - glowRadius, y - glowRadius, glowRadius * 2, glowRadius * 2);
        const next = project(circuitPoint(neuron.progress + .002, neuron.lane));
        const heading = Math.atan2(next.y - y, next.x - x);
        context.strokeStyle = ink(color, alpha * .85); context.lineWidth = .9 * perspective;
        for (let branch = 0; branch < 5; branch++) {
          const direction = heading + branch / 5 * TAU;
          const length = (width < 440 ? 6 : 9) * perspective;
          const ex = x + Math.cos(direction) * length, ey = y + Math.sin(direction) * length;
          context.beginPath(); context.moveTo(x, y); context.lineTo(ex, ey);
          context.lineTo(ex + Math.cos(direction + .7) * length * .45, ey + Math.sin(direction + .7) * length * .45);
          context.moveTo(ex, ey); context.lineTo(ex + Math.cos(direction - .7) * length * .45, ey + Math.sin(direction - .7) * length * .45); context.stroke();
        }
        context.fillStyle = ink(color, alpha); context.beginPath(); context.arc(x, y, radius, 0, TAU); context.fill();
        context.fillStyle = "rgba(255,255,255,.95)"; context.beginPath(); context.arc(x, y, radius * .42, 0, TAU); context.fill();
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
    trigger.current = (x, y, service) => {
      if (!points.length) return;
      const anchor = service === null ? null : [[-.3, -.04], [.36, -.01], [.08, .08]][service];
      let nearest = 0, distance = Infinity;
      points.forEach((point, index) => {
        const gap = anchor ? Math.hypot(symbol.nodes[index][0] - anchor[0], symbol.nodes[index][1] - anchor[1]) : Math.hypot(point.x - x, point.y - y);
        if (gap < distance) { nearest = index; distance = gap; }
      });
      const [px, py] = symbol.nodes[nearest];
      lastActivation.current = { x: px, y: py };
      if (moving) motion.current.boost = 1;
      pulses = [...pulses.slice(-3), { x: px, y: py, started: elapsed.current }];
      if (!frame) start();
    };
    const onMove = (event: PointerEvent) => {
      if (!moving || event.pointerType === "touch" || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      pointer.x = (event.clientX - rect.left) / rect.width - .5;
      pointer.y = (event.clientY - rect.top) / rect.height - .5;
    };
    const onLeave = () => { pointer.x = 0; pointer.y = 0; };
    const onVisibility = () => { if (!document.hidden && visible) start(); else { cancelAnimationFrame(frame); frame = 0; } };
    const sizeObserver = new ResizeObserver(resize); sizeObserver.observe(canvas); resize();
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start(); else { cancelAnimationFrame(frame); frame = 0; }
    });
    observer.observe(canvas);
    surface.addEventListener("pointermove", onMove); surface.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(frame); observer.disconnect(); sizeObserver.disconnect(); trigger.current = () => {};
      surface.removeEventListener("pointermove", onMove); surface.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [theme, paused, reduced]);

  function activate(event: MouseEvent<HTMLButtonElement>, service: number | null = null) {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = event.detail === 0 ? rect.width / 2 : event.clientX - rect.left;
    const y = event.detail === 0 ? rect.height * .46 : event.clientY - rect.top;
    trigger.current(x, y, service);
    setActiveService(service);
    setActivationCount(count => count + 1);
  }

  return <div className="neural-visual" data-palette={theme.name} data-activations={activationCount} data-motion={paused || reduced ? "paused" : "playing"}>
    <div className="neural-halo" aria-hidden="true"/>
    <div className="neural-orbit-track" aria-hidden="true"/>
    <button ref={surfaceRef} type="button" className="neural-activate" onClick={event => activate(event)} aria-label="Activate the NeuraOps neural infinity" aria-describedby="neural-hint">
      <canvas ref={canvasRef} className="neural-canvas" aria-hidden="true"/>
    </button>
    {services.map((service, index) => <button
      key={service.name}
      ref={element => { badgesRef.current[index] = element; }}
      type="button"
      className={`neural-label neural-service-${index}`}
      aria-pressed={activeService === index}
      onClick={event => activate(event, index)}
      onPointerEnter={() => { held.current.hover = true; }}
      onPointerLeave={() => { held.current.hover = false; }}
      onFocus={() => { held.current.focus = true; }}
      onBlur={() => { held.current.focus = false; }}
    ><span className="neural-label-icon"><ServiceIcon index={index}/></span><span><strong>{service.name}</strong><small>{service.detail}</small></span><span className="neural-label-signal" aria-hidden="true"/></button>)}
    <div className="neural-caption">
      <p className="neural-status" role="status">{activeService !== null ? services[activeService].message : activationCount ? "One connection. Infinite possibilities." : "Our identity. A living network."}</p>
      <p id="neural-hint"><span className="tiny-dot"/>Tap the symbol or a service to connect.</p>
    </div>
  </div>;
}
