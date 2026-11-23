import { Link } from "react-router-dom";
import { ArrowRight, Braces, Code2, Fingerprint, LockKeyhole, ShieldCheck } from "lucide-react";

const commitments = [
  { icon: LockKeyhole, title: "Local analysis", body: "Message text is analyzed in your browser and is not sent to a ScamShield server." },
  { icon: Fingerprint, title: "No raw message storage", body: "The app does not save raw messages in localStorage. Session insights keep score summaries in memory only." },
  { icon: Braces, title: "Explainable rules", body: "Configured regular expressions, group weights, and scoring decisions are separate from the interface." },
];

export default function About() {
  return <div className="page-shell section-wrap about-page">
    <div className="breadcrumbs"><Link to="/">Home</Link><span>/</span><span>About ScamShield</span></div>
    <div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> AWARENESS AID · NOT A VERDICT</div><h1>Think before<br /><em>you click.</em></h1><p>ScamShield is a college ITT project that demonstrates how transparent, client-side pattern matching can make common suspicious-message signals easier to understand.</p></div><div className="about-logo"><span>SS</span><small>SCAMSHIELD<br />MCOA ITT</small></div></div>
    <div className="about-principles">{commitments.map((item, index) => <article key={item.title}><span className="principle-index">0{index + 1}</span><item.icon size={21} /><h3>{item.title}</h3><p>{item.body}</p></article>)}</div>
    <section className="about-method">
      <div><div className="eyebrow"><span className="eyebrow-line" /> HOW THE SCORE IS BUILT</div><h2>Transparent by<br /><em>design.</em></h2><p>ScamShield checks for configured phrases and patterns. It takes only the highest-weight match within each group, adds a 10-point combination bonus when a sensitive-information request occurs with a link, threat, or prize signal, then caps the result at 100.</p><div className="risk-bands"><span className="low">LOW <b>0–29</b></span><span className="medium">MEDIUM <b>30–59</b></span><span className="high">HIGH <b>60–100</b></span></div></div>
      <div className="about-limitations"><span className="card-kicker">IMPORTANT LIMITATIONS</span><ul><li>A score is a heuristic—not a probability of fraud.</li><li>Not matching a rule does not prove a message is safe.</li><li>Legitimate messages can contain words that trigger rules.</li><li>ScamShield does not verify sender identity or link reputation.</li><li>English and selected Hinglish patterns are supported; coverage is limited.</li><li>When in doubt, independently contact the official organization.</li></ul></div>
    </section>
    <section className="about-tech"><div className="tech-icon"><Code2 size={21} /></div><div><span className="card-kicker">PROJECT IMPLEMENTATION</span><h3>Built as a browser-based learning tool</h3><p>React, TypeScript, and regular expressions. No backend is required for analysis; no third-party URL reputation service is connected.</p></div><ShieldCheck size={23} /></section>
    <div className="about-cta"><div><span className="eyebrow">PAUSE · CHECK · VERIFY</span><h2>Make a more informed next move.</h2></div><Link className="button button-primary" to="/scanner">Check a message <ArrowRight size={16} /></Link></div>
  </div>;
}
