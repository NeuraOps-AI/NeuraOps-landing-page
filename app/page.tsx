const services = [
  {
    number: "01",
    eyebrow: "Digital products",
    title: "Software shaped around how your business actually works.",
    description:
      "We design and engineer customer portals, internal platforms, dashboards, and workflow tools that make complex work feel simple.",
    tags: ["Product strategy", "UX & UI", "Web platforms"],
    className: "service-card--wide",
  },
  {
    number: "02",
    eyebrow: "Workflow automation",
    title: "Move routine work without adding more headcount.",
    description:
      "We connect teams, tools, and approvals into reliable automations that reduce handoffs and keep work moving.",
    tags: ["Process design", "Integrations", "Automation"],
    className: "",
  },
  {
    number: "03",
    eyebrow: "AI systems",
    title: "Put AI to work on specific, measurable problems.",
    description:
      "From intelligent assistants to knowledge workflows, we build AI systems with human oversight and clear operational value.",
    tags: ["AI agents", "Knowledge systems", "Human-in-the-loop"],
    className: "",
  },
  {
    number: "04",
    eyebrow: "Process intelligence",
    title: "See where work slows down—and what to change first.",
    description:
      "We map the operation, expose hidden friction, and build a practical roadmap that connects every investment to an outcome.",
    tags: ["Process audit", "Data visibility", "Roadmaps"],
    className: "service-card--wide service-card--accent",
  },
];

const steps = [
  {
    number: "01",
    name: "Discover",
    text: "We learn the people, processes, systems, and outcomes behind the brief.",
  },
  {
    number: "02",
    name: "Design",
    text: "We shape the right solution, validate the experience, and define a clear delivery plan.",
  },
  {
    number: "03",
    name: "Deliver",
    text: "We build in focused releases, integrate with your stack, and keep your team close to progress.",
  },
  {
    number: "04",
    name: "Evolve",
    text: "We measure what changed, refine what matters, and help the system grow with the business.",
  },
];

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://neuraops.in/#organization",
      name: "NeuraOps Technologies",
      url: "https://neuraops.in/",
      logo: "https://neuraops.in/media/icon-512.png",
      email: "info@neuraops.in",
      description:
        "NeuraOps designs digital products, workflow automation, and AI systems for growing businesses.",
    },
    {
      "@type": "WebSite",
      "@id": "https://neuraops.in/#website",
      url: "https://neuraops.in/",
      name: "NeuraOps Technologies",
      publisher: { "@id": "https://neuraops.in/#organization" },
      inLanguage: "en",
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://neuraops.in/#service",
      name: "NeuraOps Technologies",
      url: "https://neuraops.in/",
      email: "info@neuraops.in",
      serviceType: [
        "Digital product engineering",
        "Workflow automation",
        "AI systems",
        "Process optimization",
      ],
      areaServed: "Worldwide",
      parentOrganization: { "@id": "https://neuraops.in/#organization" },
    },
  ],
};

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <header className="site-header">
        <div className="shell nav-wrap">
          <a className="brand" href="#home" aria-label="NeuraOps home">
            <img
              className="brand-logo"
              src="/media/neuraops-horizontal-logo.webp"
              alt="NeuraOps Technologies"
              width="1600"
              height="338"
            />
          </a>

          <nav className="desktop-nav" aria-label="Primary navigation">
            <a href="#services">Services</a>
            <a href="#approach">Approach</a>
            <a href="#why-neuraops">Why NeuraOps</a>
            <a className="nav-cta" href="#contact">
              Start a conversation <span aria-hidden="true">↗</span>
            </a>
          </nav>

          <details className="mobile-nav">
            <summary aria-label="Open navigation">
              <span />
              <span />
            </summary>
            <nav aria-label="Mobile navigation">
              <a href="#services">Services</a>
              <a href="#approach">Approach</a>
              <a href="#why-neuraops">Why NeuraOps</a>
              <a href="#contact">Start a conversation</a>
            </nav>
          </details>
        </div>
      </header>

      <section className="hero" id="home" aria-labelledby="hero-title">
        <img
          className="hero-image"
          src="/media/neuraops-hero.webp"
          alt="A strategy team orchestrating connected digital workflows above a city at sunrise"
          width="1824"
          height="862"
          fetchPriority="high"
          decoding="async"
        />
        <div className="hero-veil" />
        <div className="hero-orb hero-orb--one" />
        <div className="hero-orb hero-orb--two" />

        <div className="shell hero-inner">
          <div className="hero-content">
            <p className="kicker">
              <span className="kicker-dot" /> AI-native digital operations
            </p>
            <h1 id="hero-title">
              Build systems that let your business <em>think ahead.</em>
            </h1>
            <p className="hero-lede">
              NeuraOps designs digital products, intelligent automation, and AI
              systems that turn complex operations into clear, scalable growth.
            </p>
            <div className="hero-actions">
              <a className="button button--primary" href="#contact">
                Book a strategy call <span aria-hidden="true">↗</span>
              </a>
              <a className="button button--ghost" href="#services">
                Explore our work <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>

          <aside className="hero-signal" aria-label="NeuraOps capabilities">
            <p>One connected operating layer</p>
            <div>
              <span>Products</span>
              <i />
              <span>Automation</span>
              <i />
              <span>AI</span>
            </div>
          </aside>
        </div>

        <div className="shell capability-rail" aria-label="Core capabilities">
          <p>Built for meaningful change</p>
          <div>
            <span>Product strategy</span>
            <span>Experience design</span>
            <span>Software engineering</span>
            <span>Workflow automation</span>
            <span>Applied AI</span>
          </div>
        </div>
      </section>

      <section className="section friction-section" id="why-neuraops">
        <div className="shell">
          <div className="section-heading section-heading--split">
            <div>
              <p className="eyebrow">The opportunity</p>
              <h2>
                The gap isn&apos;t ambition.
                <br /> It&apos;s <em>operational friction.</em>
              </h2>
            </div>
            <p>
              Growth gets harder when work is scattered across disconnected
              tools, manual handoffs, and decisions made without a clear view of
              the operation. We help you design the connected system underneath.
            </p>
          </div>

          <div className="friction-grid">
            <article className="friction-card">
              <span className="friction-icon">01</span>
              <h3>Manual handoffs</h3>
              <p>Important work slows down between people, inboxes, and approvals.</p>
            </article>
            <article className="friction-card">
              <span className="friction-icon">02</span>
              <h3>Fragmented tools</h3>
              <p>Teams spend more energy moving data than acting on it.</p>
            </article>
            <article className="friction-card">
              <span className="friction-icon">03</span>
              <h3>Reactive decisions</h3>
              <p>Limited visibility makes every priority feel urgent and uncertain.</p>
            </article>
          </div>

          <div className="system-story">
            <div className="system-copy">
              <p className="eyebrow">A better operating model</p>
              <h3>From fragmented effort to intelligent operations.</h3>
              <p>
                We bring product thinking, automation, and AI into one practical
                roadmap—so every new capability connects to the way your team works
                and the outcomes your business needs.
              </p>
              <ul className="check-list">
                <li><span>✓</span> One clear view of the workflow</li>
                <li><span>✓</span> Automation where it creates real leverage</li>
                <li><span>✓</span> AI with purpose, guardrails, and human control</li>
              </ul>
            </div>
            <figure className="system-visual">
              <img
                src="/media/intelligent-operations.webp"
                alt="Fragmented data pathways converging into one intelligent operations system"
                width="1536"
                height="1024"
                loading="lazy"
                decoding="async"
              />
              <figcaption>
                <span>Connected by design</span>
                <strong>One system. Clearer work.</strong>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="section services-section" id="services">
        <div className="shell">
          <div className="section-heading">
            <p className="eyebrow">What we build</p>
            <h2>
              Digital capabilities designed around <em>your operation.</em>
            </h2>
            <p className="section-intro">
              No forced platforms. No AI for AI&apos;s sake. Just the right system,
              built to solve the right problem and evolve with the business.
            </p>
          </div>

          <div className="services-grid">
            {services.map((service) => (
              <article
                className={`service-card ${service.className}`}
                key={service.number}
              >
                <div className="service-topline">
                  <span>{service.number}</span>
                  <i aria-hidden="true">↗</i>
                </div>
                <p className="service-eyebrow">{service.eyebrow}</p>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <div className="service-tags">
                  {service.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section approach-section" id="approach">
        <div className="shell">
          <div className="section-heading section-heading--centered">
            <p className="eyebrow">How we work</p>
            <h2>
              Clear from first conversation to <em>continuous improvement.</em>
            </h2>
          </div>

          <ol className="process-list">
            {steps.map((step) => (
              <li key={step.number}>
                <div className="process-number">{step.number}</div>
                <div className="process-line"><i /></div>
                <h3>{step.name}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section outcomes-section">
        <div className="shell outcomes-grid">
          <div className="outcomes-copy">
            <p className="eyebrow">Built for the real world</p>
            <h2>Technology should create momentum—not more complexity.</h2>
            <p>
              We combine business context with hands-on design and engineering,
              giving you one accountable partner from the operational question to
              the working system.
            </p>
            <a className="text-link" href="#contact">
              Discuss your priorities <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="outcome-cards">
            <article>
              <span>01</span>
              <h3>Less busywork</h3>
              <p>Remove repetitive steps and give people more time for judgment.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Faster decisions</h3>
              <p>Bring useful signals together so teams can act with confidence.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Systems that scale</h3>
              <p>Build a connected foundation that adapts as the business grows.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="contact-glow" />
        <div className="shell contact-inner">
          <p className="eyebrow">Start with the friction</p>
          <h2>
            Tell us what feels slower than it <em>should.</em>
          </h2>
          <p>
            We&apos;ll help you find the smartest place to begin—and shape a clear path
            from operational challenge to working solution.
          </p>
          <div className="contact-actions">
            <a
              className="button button--primary button--large"
              href="mailto:info@neuraops.in?subject=NeuraOps%20strategy%20conversation"
            >
              info@neuraops.in <span aria-hidden="true">↗</span>
            </a>
            <span>Digital products · Automation · AI systems</span>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="shell footer-grid">
          <div className="footer-brand">
            <img
              src="/media/neuraops-footer-logo.webp"
              alt="NeuraOps Technologies"
              width="900"
              height="600"
              loading="lazy"
            />
            <p>Intelligent systems for a business built to move forward.</p>
          </div>
          <div className="footer-column">
            <p>Navigate</p>
            <a href="#services">Services</a>
            <a href="#approach">Approach</a>
            <a href="#why-neuraops">Why NeuraOps</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="footer-column">
            <p>Capabilities</p>
            <span>Digital products</span>
            <span>Workflow automation</span>
            <span>AI systems</span>
            <span>Process intelligence</span>
          </div>
          <div className="footer-column footer-contact">
            <p>New business</p>
            <a href="mailto:info@neuraops.in">info@neuraops.in ↗</a>
            <span>Working with teams worldwide.</span>
          </div>
        </div>
        <div className="shell footer-bottom">
          <span>© {new Date().getFullYear()} NeuraOps Technologies.</span>
          <span>Digital products · Automation · AI</span>
        </div>
      </footer>
    </main>
  );
}
