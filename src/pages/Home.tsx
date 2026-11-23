import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronRight, Eye, Fingerprint, LockKeyhole, ScanLine, ShieldAlert, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { analyzeMessage } from "../engine/analyzeMessage";

const preview = "Your account is on hold. Click https://bit.ly/secure-now to verify your details immediately.";
const previewResult = analyzeMessage(preview);

const features = [
  { icon: ScanLine, title: "Spot the signals", body: "Find common pressure tactics, sensitive-data requests, suspicious links, and payment demands." },
  { icon: Eye, title: "See how it scored", body: "Understand which rule groups contributed points. No black-box verdicts or fraud probabilities." },
  { icon: Fingerprint, title: "Keep it private", body: "Your message stays on your device. Analysis happens locally in this browser." },
];

const categories = ["Banking fraud", "Phishing", "Prize scams", "Fake job offers", "OTP & UPI fraud", "Payment scams"];

export default function Home() {
  return <div className="home-page">
    <section className="hero section-wrap">
      <div className="hero-copy">
        <div className="eyebrow"><span className="eyebrow-line" /> A CALMER WAY TO CHECK A MESSAGE</div>
        <h1>One suspicious message can <em>cost you everything.</em></h1>
        <p>Analyze suspicious messages, uncover warning signs, and make safer decisions before you click, pay, or share personal information.</p>
        <div className="hero-actions"><Link className="button button-primary button-large" to="/scanner">Analyze a message <ArrowRight size={17} /></Link><a className="button button-quiet button-large" href="#how-it-works">Explore security tips <ArrowDown size={16} /></a></div>
        <div className="hero-proof"><span><Check size={14} /> No sign-up</span><i /> <span><Check size={14} /> No uploads</span><i /> <span><Check size={14} /> No AI claims</span></div>
      </div>
      <div className="hero-art" aria-label="Illustration of a protected message being checked">
        <div className="orbital orbital-one" /><div className="orbital orbital-two" />
        <div className="shield-illustration">
          <svg viewBox="0 0 196 218" role="img" aria-label="Shield outline">
            <path d="M98 10 174 38v57c0 52-31 89-76 113C53 184 22 147 22 95V38L98 10Z" fill="url(#shieldFill)" stroke="url(#shieldStroke)" strokeWidth="2" />
            <path d="m66 105 21 21 45-49" fill="none" stroke="#88F4D6" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            <defs><linearGradient id="shieldFill" x1="25" y1="16" x2="165" y2="202"><stop stopColor="#18233B" /><stop offset="1" stopColor="#101827" /></linearGradient><linearGradient id="shieldStroke"><stop stopColor="#7C78FF" /><stop offset="1" stopColor="#51D8D0" /></linearGradient></defs>
          </svg>
          <span className="shield-scan-line" />
        </div>
        <div className="art-chip chip-top"><span className="signal-dot" /> LOCAL ANALYSIS <small>ON THIS DEVICE</small></div>
        <div className="art-chip chip-bottom"><LockKeyhole size={15} /><span>YOUR MESSAGE<small>STAYS PRIVATE</small></span><Check size={14} /></div>
        <span className="art-coordinate">SS / 01</span>
      </div>
    </section>

    <section className="trust-strip section-wrap" aria-label="Privacy commitments">
      <span>MADE FOR THE MOMENT BEFORE YOU CLICK</span><i /><span>TEXT STAYS IN YOUR BROWSER</span><i /><span>TRANSPARENT RULES</span>
    </section>

    <section className="preview-section section-wrap">
      <div className="section-heading-row"><div><div className="eyebrow"><span className="eyebrow-line" /> A QUICK FIRST LOOK</div><h2>See the warning signs,<br /><em>not just a verdict.</em></h2></div><Link className="text-link" to="/scanner">Open the full scanner <ArrowUpRight size={17} /></Link></div>
      <motion.div className="preview-panel" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.5 }}>
        <div className="preview-message">
          <div className="panel-overline"><span className="tiny-square" /> MESSAGE PREVIEW <span className="sample-tag">ILLUSTRATIVE SAMPLE</span></div>
          <div className="message-bubble"><span className="message-source"><span className="sender-dot">?</span> Unknown sender <small>SMS · just now</small></span><p>{preview}</p></div>
          <div className="privacy-note"><LockKeyhole size={14} /> Preview uses a sample message. Nothing is sent anywhere.</div>
        </div>
        <div className="preview-divider" />
        <div className="preview-result">
          <div className="panel-overline"><span className="tiny-square aqua" /> RULE-BASED CHECK <span className="actual-tag"><span /> ACTUAL SAMPLE RESULT</span></div>
          <div className="preview-score-row"><div className="preview-score">{previewResult.score}<small>/100</small></div><span className={`risk-pill ${previewResult.level.toLowerCase()}`}>{previewResult.level} RISK</span></div>
          <div className="mini-track"><i style={{ width: `${previewResult.score}%` }} /></div>
          <div className="preview-signals">{previewResult.indicators.slice(0, 3).map((item) => <span key={item.id}><ShieldAlert size={14} />{item.label}</span>)}</div>
          <Link className="text-link" to="/scanner">Analyze your own message <ArrowRight size={16} /></Link>
        </div>
      </motion.div>
    </section>

    <section className="features-section section-wrap">
      <div className="eyebrow"><span className="eyebrow-line" /> WHY SCAMSHIELD</div>
      <div className="section-heading-row"><h2>Awareness, without<br /><em>the false certainty.</em></h2><p>ScamShield highlights patterns that deserve a second look. It doesn't decide for you—and it never calls a score a probability.</p></div>
      <div className="feature-grid">{features.map((feature, i) => <motion.article className="feature-card" key={feature.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}><span className="feature-number">0{i + 1}</span><feature.icon size={22} /><h3>{feature.title}</h3><p>{feature.body}</p></motion.article>)}</div>
    </section>

    <section id="how-it-works" className="how-section">
      <div className="section-wrap">
        <div className="eyebrow"><span className="eyebrow-line" /> HOW IT WORKS</div>
        <div className="section-heading-row"><h2>Four steps.<br /><em>One clearer decision.</em></h2><span className="small-note">A transparent, browser-based process</span></div>
        <div className="steps-row">{[
          ["01", "Paste", "Add a suspicious SMS, chat, or email."],
          ["02", "Check", "Regex rules look for known warning patterns."],
          ["03", "Understand", "See matched signs and group score contributions."],
          ["04", "Verify", "Use practical tips to check independently."],
        ].map(([number, title, body], i) => <div className="step-card" key={number}><span className="step-number">{number}</span><div className="step-connector">{i < 3 && <span />}</div><h3>{title}</h3><p>{body}</p></div>)}</div>
      </div>
    </section>

    <section className="category-section section-wrap">
      <div><div className="eyebrow"><span className="eyebrow-line" /> SIGNALS WE COVER</div><h2>Different tricks.<br /><em>Same pause button.</em></h2><p>Common patterns can appear in many forms. Familiar names or keywords alone are not proof of a scam.</p><Link className="text-link" to="/academy">Learn the warning signs <ArrowRight size={16} /></Link></div>
      <div className="category-list">{categories.map((category, i) => <div className="category-item" key={category}><span>0{i + 1}</span><strong>{category}</strong><ChevronRight size={16} /></div>)}</div>
    </section>

    <section className="privacy-band section-wrap">
      <div className="privacy-icon"><LockKeyhole size={23} /></div><div><div className="eyebrow">PRIVACY BY DEFAULT</div><h2>Your message stays on <em>your device.</em></h2><p>ScamShield analyzes text locally in your browser. We don't upload messages or save them to your browser's persistent storage. Session insights contain score summaries only.</p></div><Link className="button button-outline" to="/about">How privacy works <ArrowRight size={16} /></Link>
    </section>

    <section className="closing-cta section-wrap"><div className="cta-mark"><Sparkles size={20} /></div><div><div className="eyebrow">A MOMENT OF CHECKING CAN MATTER</div><h2>Pause before the next tap.</h2><p>Start with a local, explainable check.</p></div><Link className="button button-primary button-large" to="/scanner">Analyze a message <ArrowRight size={17} /></Link></section>
  </div>;
}
