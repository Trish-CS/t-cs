import { useState, useEffect, useRef } from "react";
import "./App.css";

// ── Pixel Star Canvas ──────────────────────────────────────────────────────────
function StarField({ dark }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf;
    const W = canvas.width = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;
    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      s: Math.floor(Math.random() * 3) + 1,
      t: Math.random() * Math.PI * 2,
      speed: 0.01 + Math.random() * 0.02,
    }));
    function draw() {
      ctx.clearRect(0, 0, W, H);
      stars.forEach(star => {
        star.t += star.speed;
        const alpha = 0.4 + 0.6 * Math.abs(Math.sin(star.t));
        ctx.fillStyle = dark ? `rgba(62,146,204,${alpha})` : `rgba(19,41,61,${alpha})`;
        ctx.fillRect(star.x, star.y, star.s, star.s);
      });
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }, [dark]);
  return <canvas ref={canvasRef} className="star-canvas" aria-hidden="true" />;
}

// ── Pixel Avatar ───────────────────────────────────────────────────────────────
function PixelAvatar() {
  const pixels = [
    "  XXXXX  ",
    " XXXXXXX ",
    " XOXOXOX ",
    " XXXXXXX ",
    "  XXXXX  ",
    " XXXXXXX ",
    "XXXXXXXXX",
    " X     X ",
    " X     X ",
  ];
  return (
    <div className="pixel-avatar" aria-label="Pixel art avatar" role="img">
      {pixels.map((row, ri) => (
        <div key={ri} className="pixel-row">
          {row.split("").map((cell, ci) => (
            <div key={ci} className={`pixel-cell ${cell === "X" ? "on" : cell === "O" ? "eye" : "off"}`} />
          ))}
        </div>
      ))}
    </div>
  );
}

// ── Section Wrapper ────────────────────────────────────────────────────────────
function Section({ id, title, children }) {
  return (
    <section id={id} className="section" aria-labelledby={`${id}-title`}>
      <div className="section-inner">
        <h2 id={`${id}-title`} className="section-title">
          <span className="pixel-bracket">[</span>
          {title}
          <span className="pixel-bracket">]</span>
        </h2>
        {children}
      </div>
    </section>
  );
}

// ── Job Card ──────────────────────────────────────────────────────────────────
function JobCard({ title, company, period, bullets }) {
  return (
    <article className="card">
      <div className="card-header">
        <div>
          <div className="card-title">{title}</div>
          <div className="card-sub">{company}</div>
        </div>
        <div className="card-period">{period}</div>
      </div>
      <ul className="card-list">
        {bullets.map((b, i) => <li key={i}><span aria-hidden="true">▸ </span>{b}</li>)}
      </ul>
    </article>
  );
}

// ── DATA ──────────────────────────────────────────────────────────────────────
const NAV = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#experience" },
  { label: "Education", href: "#education" },
];

const JOBS = [
  {
    title: "Technology Support Specialist, Co-op",
    company: "Western Technology Services",
    period: "May 2025 - Dec 2025",
    bullets: [
      "Provided first-level technical support for core Western University services, including MFA, Brightspace, Office 365, and other WTS-managed applications, through in-person support, phone, email, and Jira tickets; resolved 2,300+ issues.",
      "Developed a cross-platform front counter application using React, MUI, CSS, Electron, and Node.js, integrating Cisco Jabber to initiate help calls.",
    ],
  },
  {
    title: "Developer, Co-op",
    company: "CARFAX Canada",
    period: "Sep 2024 - Dec 2024",
    bullets: [
      "Delivered front-end updates and feature enhancements for consumer and dealer websites using C#, JavaScript, Bootstrap, and AEM.",
      "Supported Agile development workflows through investigation tickets, dev testing, and cross-team communication to ensure production-ready releases.",
    ],
  },
  {
    title: "Quality Assurance Analyst, Co-op",
    company: "CARFAX Canada",
    period: "Jan 2024 - Apr 2024",
    bullets: [
      "Performed manual testing and documentation across multiple products and websites using Postman, Sauce Labs, and Jira.",
      "Completed 30+ test tickets involving front-end and API/back-end validation, ensuring high-quality releases within an Agile/Kanban environment.",
    ],
  },
];

const EDU = [
  { degree: "Computer Programming and Analysis (Co-op)", school: "Fanshawe College", period: "2022 - 2025", note: "4.15 GPA, President's Honor Roll" },
];

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }, [dark]);

  const scrollTo = (href) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div className="app">
      {/* ── HEADER / NAV ── */}
      <header className="header" role="banner">
        <div className="header-inner">
          <a href="#about" className="logo" onClick={e => { e.preventDefault(); scrollTo("#about"); }}>
            <span className="logo-bracket">&lt;</span>TRISH-CS<span className="logo-bracket">/&gt;</span>
          </a>
          <nav aria-label="Main navigation">
            <button
              className="menu-toggle"
              aria-expanded={menuOpen}
              aria-controls="nav-list"
              onClick={() => setMenuOpen(o => !o)}
            >
              <span className="sr-only">Toggle menu</span>
              <span aria-hidden="true">{menuOpen ? "✖" : "☰"}</span>
            </button>
            <ul id="nav-list" className={`nav-list ${menuOpen ? "open" : ""}`} role="list">
              {NAV.map(n => (
                <li key={n.href}>
                  <a href={n.href} className="nav-link" onClick={e => { e.preventDefault(); scrollTo(n.href); }}>
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <button
            className="theme-toggle"
            onClick={() => setDark(d => !d)}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            aria-pressed={!dark}
          >
            {dark ? "☀" : "☽"}
          </button>
        </div>
      </header>

      <main id="main-content">
        {/* ── HERO / ABOUT ── */}
        <section id="about" className="hero" aria-label="About me">
          <StarField dark={dark} />
          <div className="hero-content">
            <PixelAvatar />
            <div className="hero-text">
              <p className="hero-greeting">Hello, World. I'm</p>
              <h1 className="hero-name">Trishia Mae Salamangkit</h1>
              <p className="hero-tagline">IT Professional</p>
              <p className="hero-bio">
                I craft scalable and user-friendly websites and software. I believe that technology should be easy to use, reliable, and built with care.
                With a background in programming and IT support, I specialize in creating solutions that not only work but also make it easy for users.
              </p>
              <div className="hero-links">
                <a href="https://www.linkedin.com/in/trishia-mae-salamangkit-896003275/" target="_blank" rel="noopener noreferrer" className="btn-pixel" aria-label="LinkedIn profile (opens in new tab)"> LinkedIn </a>
                <a href="https://github.com/Trish-CS" target="_blank" rel="noopener noreferrer" className="btn-pixel btn-outline" aria-label="GitHub profile (opens in new tab)"> GitHub </a>
              </div>
            </div>
          </div>
          <div className="hero-scroll-hint" aria-hidden="true">▼ scroll</div>
        </section>

        {/* ── EXPERIENCE ── */}
        <Section id="experience" title="Experience">
          <div className="cards-grid">
            {JOBS.map((j, i) => <JobCard key={i} {...j} />)}
          </div>
        </Section>

        {/* ── EDUCATION ── */}
        <Section id="education" title="Education">
          <div className="edu-grid">
            {EDU.map((e, i) => (
              <article key={i} className="edu-card">
                <div className="edu-icon" aria-hidden="true">🎓</div>
                <div>
                  <div className="card-title">{e.degree}</div>
                  <div className="card-sub">{e.school} · {e.period}</div>
                  <div className="edu-note">{e.note}</div>
                </div>
              </article>
            ))}
          </div>
        </Section>

      </main>

      {/* ── FOOTER ── */}
      <footer className="footer" role="contentinfo">
        <div className="footer-inner">
          <span>© {new Date().getFullYear()} Trishia Mae Salamangkit</span>
          <span className="footer-sep" aria-hidden="true">·</span>
          <span>v1.0.0</span>
          <span className="footer-sep" aria-hidden="true">·</span>
          <span>Built with React · Vite · CSS </span>
        </div>
      </footer>
    </div>
  );
}
