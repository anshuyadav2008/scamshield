import { useState, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useAppState } from "../appState";

const links = [
  { to: "/", label: "Home" },
  { to: "/scanner", label: "Scanner" },
  { to: "/#how-it-works", label: "How it works" },
  { to: "/academy", label: "Academy" },
  { to: "/about", label: "About" },
];

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link className="brand" to="/" aria-label="ScamShield home">
      <span className="brand-mark"><img src="/logo.svg" alt="" /></span>
      {!compact && <span className="brand-name">scam<span>shield</span><small>THINK BEFORE YOU CLICK</small></span>}
    </Link>
  );
}

export function Header() {
  const { dark, toggleTheme } = useAppState();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="site-header">
      <div className="header-inner">
        <Logo />
        <nav className={`main-nav ${menuOpen ? "open" : ""}`} aria-label="Main navigation">
          {links.map((link) => {
            const anchorActive = link.to === "/#how-it-works" && location.pathname === "/" && location.hash === "#how-it-works";
            return <NavLink key={link.to} to={link.to} onClick={() => setMenuOpen(false)} className={({ isActive }) => {
              const active = link.to === "/#how-it-works"
                ? anchorActive
                : link.to === "/"
                  ? location.pathname === "/" && !location.hash
                  : isActive;
              return active ? "active" : "";
            }}>{link.label}</NavLink>;
          })}
        </nav>
        <div className="header-actions">
          <button className="icon-button theme-toggle" aria-label={`Switch to ${dark ? "light" : "dark"} theme`} onClick={toggleTheme}>
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link className="button button-primary header-cta" to="/scanner">Scan a message <span>↗</span></Link>
          <button className="icon-button menu-toggle" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div><Logo /><p>A first check for suspicious messages.<br />Built for awareness. Designed for privacy.</p></div>
        <div className="footer-links"><span className="eyebrow">EXPLORE</span><Link to="/scanner">Message scanner</Link><Link to="/insights">Session insights</Link><Link to="/academy">Security academy</Link><Link to="/quiz">Scam IQ quiz</Link></div>
        <div className="footer-links"><span className="eyebrow">THE IMPORTANT BIT</span><span>Browser-only analysis</span><span>No message uploads</span><span>Rule-based, not AI</span><span>Not a guarantee of safety</span></div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} ScamShield · MCOA ITT project</span><span>Pause. Check. Verify independently.</span></div>
    </footer>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { toast } = useAppState();
  return <>
    <Header />
    <main>{children}</main>
    <Footer />
    {toast && <div className="toast" role="status">{toast}</div>}
  </>;
}
