"use client";

import NeuralNetwork from "./neural-network";
import { useEffect, useRef, useState } from "react";
import { DailyBrandProvider, DailyLogo } from "./daily-brand";

function Arrow({ down = false }: { down?: boolean }) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={down ? "arrow down" : "arrow"}><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function Icon({ kind }: { kind: string }) {
  const paths: Record<string, React.ReactNode> = {
    spark: <><path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z"/><path d="m19 2 .8 2.2L22 5l-2.2.8L19 8l-.8-2.2L16 5l2.2-.8L19 2Z"/></>,
    code: <path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 16"/>,
    flow: <><rect x="3" y="3" width="6" height="6" rx="1.5"/><rect x="15" y="15" width="6" height="6" rx="1.5"/><path d="M6 9v7a2 2 0 0 0 2 2h7M9 6h7a2 2 0 0 1 2 2v7"/></>,
    chart: <path d="M4 4v16h16M8 15l4-4 3 2 5-7"/>,
    cloud: <path d="M6 18a5 5 0 1 1 1-9.9 6 6 0 0 1 11.6 1.8A4 4 0 0 1 18 18H6Z"/>,
    shield: <><path d="M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6l-8-3Z"/><path d="m8 12 3 3 5-6"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    chat: <><path d="M4 4h16v12H9l-5 4V4Z"/><path d="M8 8h8m-8 4h5"/></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[kind] || paths.spark}</svg>;
}
const capabilities = [
  { name: "AI that works with you.", label: "AI & intelligent agents", description: "Give your team an extra set of hands. We build context-aware assistants and agents that turn your knowledge into useful action.", tags: ["AI assistants", "Knowledge & search", "Agentic workflows"] },
  { name: "Software, made yours.", label: "Custom product engineering", description: "A better customer experience. A smarter internal platform. Beautifully designed web, mobile, and enterprise software built around you.", tags: ["Web & mobile", "Enterprise platforms", "Product design"] },
  { name: "Cloud you can count on.", label: "CloudOps & platform engineering", description: "Build, deploy, and operate with confidence. We connect cloud infrastructure, delivery pipelines, and observability to keep your applications reliable as you grow.", tags: ["Cloud infrastructure", "CI/CD & automation", "Observability"] },
];
const useCases = [
  { name: "Customer experience", question: "Help every customer feel understood.", description: "An assistant that understands your business, finds the right answer, and brings your team in when it matters.", tags: ["Connected knowledge", "Thoughtful handoffs", "Always in context"], message: "Can I change the delivery address for my order?", answer: "Of course. I can help with that. Share your order number and I’ll check which delivery options are available.", activity: ["Understanding the request", "Checking delivery policy", "Preparing a helpful response"], action: "Response ready for review" },
  { name: "Everyday operations", question: "Make busywork a thing of the past.", description: "Bring intake, checks, and approvals into one connected workflow. Your people stay in control of the decisions that count.", tags: ["Document processing", "Connected workflows", "Human approval"], message: "A new supplier application is ready. What happens next?", answer: "I’ve prepared a review checklist: verify the business details, request the compliance documents, then route the application to your procurement team.", activity: ["Reviewing application context", "Mapping required checks", "Preparing the next steps"], action: "Approval checklist prepared" },
  { name: "Business intelligence", question: "Find the story in your data.", description: "Bring scattered information into focus. Give your team clearer answers and the context to make confident decisions.", tags: ["Data & analytics", "Natural-language search", "Decision support"], message: "What should we look at in this month’s operations review?", answer: "Start with workload, delivery times, and recurring bottlenecks. I can bring those into one dashboard and flag the changes that need your team’s attention.", activity: ["Identifying review priorities", "Connecting relevant measures", "Organizing the findings"], action: "Review outline prepared" },
];
const questions = [
  ["We have an idea, but no technical roadmap. Can you help?", "Absolutely. We start with your business, the problem you want to solve, and the people who will use the solution. Together, we turn that into a focused scope, a practical architecture, and a delivery plan."],
  ["Can you work with our existing tools and systems?", "Yes. We assess your current software, APIs, data, and workflows before proposing the right integrations. The aim is to make your existing ecosystem more useful and connected."],
  ["How do you approach AI reliability and control?", "We design for your use case, including access permissions, grounded knowledge, evaluation, monitoring, and human review where it is needed. We agree on the level of autonomy with your team before implementation."],
  ["What happens after launch?", "We provide implementation support and can continue with monitoring, maintenance, and improvements. The support scope is agreed as part of your project so you know what to expect."],
];

function WorkPreview() {
  const [selected, setSelected] = useState(0);
  const [step, setStep] = useState(-1);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const current = useCases[selected];
  const busy = step >= 0 && step < 3;
  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);
  function choose(index: number) { if (timer.current) clearInterval(timer.current); setSelected(index); setStep(-1); }
  function run() {
    if (timer.current) clearInterval(timer.current);
    setStep(0); let next = 0;
    timer.current = setInterval(() => { next += 1; setStep(next); if (next === 3 && timer.current) clearInterval(timer.current); }, 650);
  }
  return <section className="work-section section" id="possibilities"><div className="shell">
    <div className="section-heading reveal"><p className="eyebrow">A little imagination. A real difference.</p><h2>What could smarter<br/>look like for you?</h2><p>Start with the everyday. That’s where extraordinary change begins.</p></div>
    <div className="case-tabs" role="tablist" aria-label="Explore AI use cases">{useCases.map((item, i) => <button key={item.name} id={`case-tab-${i}`} role="tab" aria-selected={selected === i} aria-controls="case-panel" tabIndex={selected === i ? 0 : -1} onClick={() => choose(i)} onKeyDown={e => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
      e.preventDefault(); const next = e.key === "Home" ? 0 : e.key === "End" ? 2 : (i + (e.key === "ArrowRight" ? 1 : 2)) % 3;
      choose(next); document.getElementById(`case-tab-${next}`)?.focus();
    }}>{item.name}<Arrow/></button>)}</div>
    <div className="case-panel reveal" id="case-panel" role="tabpanel" aria-labelledby={`case-tab-${selected}`}>
      <div className="case-copy"><span className="small-tag"><Icon kind={selected === 0 ? "chat" : selected === 1 ? "flow" : "cloud"}/>{current.name}</span><h3>{current.question}</h3><p>{current.description}</p><ul>{current.tags.map(tag => <li key={tag}><Icon kind="check"/>{tag}</li>)}</ul><a href={`mailto:info@neuraops.in?subject=${encodeURIComponent(`Let’s discuss ${current.name.toLowerCase()}`)}`} className="inline-link">Explore this with us <Arrow/></a></div>
      <div className="assistant-preview"><div className="assistant-top"><span><span className="assistant-mark"><Icon kind="spark"/></span>A more helpful way to work</span><span className="example-label">Illustrative example</span></div><div className="assistant-conversation"><div className="message-user"><span>You</span><p>{current.message}</p></div><div className="message-assistant" aria-live="polite" aria-busy={busy}><span className="assistant-avatar"><Icon kind="spark"/></span>{step < 0 ? <div><strong>Let’s see what’s possible.</strong><p>Try a short example of how an assistant could support your team.</p></div> : step < 3 ? <div className="thinking">{current.activity.map((text, i) => <p key={text} className={i <= step ? "complete" : ""}><span>{i < step ? "✓" : "·"}</span>{text}</p>)}</div> : <div className="response-content"><strong>A useful next step.</strong><p>{current.answer}</p><div className="response-action"><Icon kind="check"/>{current.action}</div></div>}</div></div><div className="assistant-bottom"><span>Demo only · No live business data</span><button className="demo-button" disabled={busy} onClick={run}>{busy ? "Working…" : step === 3 ? "Replay example" : "Try the example"}<Arrow/></button></div></div>
    </div>
  </div></section>;
}

export default function LandingPage({ initialLogo }: { initialLogo: number }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const menuRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { entry.target.classList.toggle("in-view", entry.isIntersecting); if (entry.isIntersecting) entry.target.classList.add("entered"); }), { threshold: .12 });
    document.querySelectorAll(".reveal, .neural-visual, .capability-visual, .closing-section").forEach(element => observer.observe(element));
    document.documentElement.classList.add("motion-ready");
    return () => { observer.disconnect(); document.documentElement.classList.remove("motion-ready"); };
  }, []);
  useEffect(() => {
    function escape(event: KeyboardEvent) { if (event.key === "Escape" && menuOpen) { setMenuOpen(false); menuRef.current?.focus(); } }
    document.addEventListener("keydown", escape); return () => document.removeEventListener("keydown", escape);
  }, [menuOpen]);
  return <DailyBrandProvider initialLogo={initialLogo}><div className="site" data-paused={paused}>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header"><div className="shell nav-wrap"><a href="#home" className="brand" aria-label="NeuraOps home"><DailyLogo/></a><nav className="desktop-nav" aria-label="Primary navigation"><a href="#expertise">What we do</a><a href="#possibilities">What’s possible</a><a href="#about">Why NeuraOps</a></nav><a className="button button-small" href="#contact">Let’s build together<Arrow/></a><button ref={menuRef} className="menu-toggle" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen(!menuOpen)}><span/><span/></button></div>{menuOpen && <nav className="mobile-menu" id="mobile-menu" aria-label="Mobile navigation">{[["What we do", "expertise"], ["What’s possible", "possibilities"], ["Why NeuraOps", "about"], ["Let’s talk", "contact"]].map(([text, id]) => <a href={`#${id}`} key={id} onClick={() => setMenuOpen(false)}>{text}<Arrow/></a>)}</nav>}</header>
    <main id="main">
      <section className="hero" id="home"><div className="shell hero-layout"><div className="hero-copy"><p className="eyebrow hero-eyebrow"><span className="tiny-dot"/>AI applications. CloudOps. Software.</p><h1>Big ideas.<br/><span>Brilliantly built.</span></h1><p className="hero-description">AI applications that make work smarter. CloudOps that keep you running. Custom software that solves your business challenges.</p><div className="hero-actions"><a className="button" href="#contact">Bring your idea to life<Arrow/></a><a className="secondary-link" href="#expertise">Explore our expertise<Arrow down/></a></div><div className="hero-signoff"><span className="signoff-line"/><p>Thoughtful technology.<br/><strong>Extraordinary possibilities.</strong></p></div></div><NeuralNetwork paused={paused}/></div><div className="shell hero-foot"><p>Ideas. Automation. Intelligence. Impact.</p><a href="#expertise">Discover the NeuraOps difference<Arrow down/></a></div></section>
      <section className="intro-section shell reveal"><p className="eyebrow">Better technology. More human possibility.</p><h2>Less friction.<br/>More room to <span className="highlight-word">move forward.</span></h2><div className="intro-bottom"><span className="intro-star" aria-hidden="true">✳</span><p>Your best ideas deserve more than another tool.<br/>We bring design, engineering, and AI together to build solutions that feel natural to use—and make a real difference to your business.</p></div></section>
      <section className="expertise-section section" id="expertise"><div className="shell"><div className="section-heading split-heading reveal"><div><p className="eyebrow">Made for your next chapter</p><h2>What can we<br/>build for you?</h2></div><p>A focused set of capabilities.<br/>A whole world of possibilities.</p></div><div className="capabilities">{capabilities.map((item, index) => <article className={`capability capability-${index} reveal`} key={item.name}><div className="capability-visual" aria-hidden="true">{index === 0 ? <div className="agent-scene"><div className="agent-orbit"/><div className="agent-bubble bubble-left"><Icon kind="chat"/></div><div className="agent-bubble bubble-right"><Icon kind="chart"/></div><div className="agent-center"><Icon kind="spark"/></div><div className="agent-caption"><span className="tiny-dot"/>A little help. A big difference.</div></div> : index === 1 ? <div className="product-scene"><div className="product-window"><div className="product-toolbar"><i/><i/><i/><span>Your next big thing</span></div><div className="product-body"><div className="product-sidebar"><i/><i/><i/></div><div className="product-content"><span/><div className="product-chart">{[35, 54, 43, 76, 64, 92].map((height, i) => <i key={i} style={{ height: `${height}%`, animationDelay: `${i * .15}s` }}/>)}</div><div className="product-lines"><i/><i/></div></div></div></div></div> : <div className="automation-scene"><div className="automation-line"/><span className="automation-node"><Icon kind="code"/></span><span className="automation-node"><Icon kind="cloud"/></span><span className="automation-node"><Icon kind="shield"/></span><div className="automation-note">Deploy. Monitor. Improve.</div></div>}</div><div className="capability-content"><span className="capability-label">{item.label}</span><h3>{item.name}</h3><p>{item.description}</p><ul>{item.tags.map(tag => <li key={tag}>{tag}</li>)}</ul><a className="round-link" href={`mailto:info@neuraops.in?subject=${encodeURIComponent(item.label)}`} aria-label={`Discuss ${item.label.toLowerCase()}`}><Arrow/></a></div></article>)}</div><div className="supporting-services reveal"><p>And everything that brings it together.</p><div>{[["flow", "Automation & integration"], ["chart", "Data & analytics"], ["spark", "Digital marketing"], ["chat", "Technology consulting"]].map(([icon, text]) => <a key={text} href={`mailto:info@neuraops.in?subject=${encodeURIComponent(text)}`}><Icon kind={icon}/>{text}<Arrow/></a>)}</div></div></div></section>
      <WorkPreview/>
      <section className="about-section section shell" id="about"><div className="about-manifesto reveal"><p className="eyebrow">Good people. Thoughtful engineering.</p><h2>Ambitious about<br/>technology.<br/><span>Even more about<br/>your business.</span></h2><p>We’re NeuraOps Technologies, based in Hyderabad and built around a simple belief: technology should make your business easier to run and more exciting to grow.</p><a className="inline-link" href="#contact">Meet your next technology partner<Arrow/></a></div><div className="principles">{[["We get the whole picture.", "Your people, processes, goals, and constraints. We listen first, then build what actually fits."], ["We make complex feel simple.", "Good design and solid engineering work together. The result should feel effortless, even when the challenge isn’t."], ["We build for the long run.", "Security, reliability, and room to grow are part of the design. So is the support that keeps you moving after launch."]].map(([title, text], i) => <article className="principle reveal" key={title}><span className="principle-icon"><Icon kind={["chat", "spark", "shield"][i]}/></span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></section>
      <section className="faq-section shell section"><div className="faq-heading reveal"><p className="eyebrow">A few things you might be wondering</p><h2>Good questions.<br/>Clear answers.</h2><a className="inline-link" href="mailto:info@neuraops.in">Ask us something else<Arrow/></a></div><div className="faq-list">{questions.map(([question, answer]) => <details className="reveal" key={question}><summary>{question}<span aria-hidden="true"/></summary><p>{answer}</p></details>)}</div></section>
      <section className="closing-section" id="contact"><div className="closing-glow" aria-hidden="true"/><div className="shell closing-content reveal"><span className="closing-symbol" aria-hidden="true">✳</span><p className="eyebrow">Something great starts with a conversation.</p><h2>What’s your<br/><span>next big idea?</span></h2><p>Bring the ambition. We’ll bring the imagination<br/>and engineering to help make it happen.</p><a className="button" href="mailto:info@neuraops.in?subject=Let%E2%80%99s%20build%20something%20great">Let’s make it real<Arrow/></a><a className="contact-email" href="mailto:info@neuraops.in">info@neuraops.in</a></div></section>
    </main>
    <footer className="shell footer"><div className="footer-main"><div className="footer-brand"><a className="brand" href="#home" aria-label="NeuraOps home"><DailyLogo prominent/></a><p>Ideas into intelligence.<br/>Intelligence into impact.</p></div><div className="footer-links"><h3>Explore</h3><a href="#expertise">Our expertise</a><a href="#possibilities">What’s possible</a><a href="#about">Why NeuraOps</a></div><div className="footer-links"><h3>Start a conversation</h3><a href="mailto:info@neuraops.in">info@neuraops.in</a><a href="tel:+917093694499">+91 70936 94499</a><span>Hyderabad, India</span></div><div className="footer-note"><span className="tiny-dot"/><p>Based in India.<br/>Open to possibility, everywhere.</p></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} NeuraOps Technologies</span><button className="motion-toggle" aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? "Play animations" : "Pause animations"}<span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span></button><a href="#home">Back to top<Arrow down/></a></div></footer>
  </div></DailyBrandProvider>;
}