import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, ArrowLeft, ArrowRight, Check, Clipboard, Download, ExternalLink, FileText, Info, LoaderCircle, LockKeyhole, RotateCcw, ScanLine, Shield, ShieldAlert, Sparkles, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppState } from "../appState";
import { SCAN_SAMPLES } from "../data/samples";
import { analyzeMessage } from "../engine/analyzeMessage";
import type { AnalysisResult } from "../types";
import { copyReport, downloadPdfReport, downloadTextReport } from "../utils/report";

function RiskSummary({ result }: { result: AnalysisResult }) {
  const tone = result.level.toLowerCase();
  return <div className={`result-overview ${tone}`}>
    <div className="risk-gauge" style={{ background: `conic-gradient(var(--risk-color) ${result.score * 3.6}deg, var(--gauge-track) 0deg)` }}><div><strong>{result.score}</strong><span>OF 100</span></div></div>
    <div className="result-overview-copy"><span className={`risk-pill ${tone}`}>{result.level} RISK</span><h2>{result.level === "HIGH" ? "Pause and verify." : result.level === "MEDIUM" ? "Take a closer look." : "No configured signals found."}</h2><p>{result.level === "LOW" ? "A low score does not guarantee a message is safe." : "This heuristic score is not a probability of fraud. Verify independently before acting."}</p></div>
    <div className="overview-meter"><div><span>Risk score</span><strong>{result.score}/100</strong></div><div className="risk-track"><span style={{ width: `${result.score}%` }} /></div><div className="meter-scale"><span>LOW 0–29</span><span>MEDIUM 30–59</span><span>HIGH 60–100</span></div></div>
  </div>;
}

function ResultPanel({ result, onReset }: { result: AnalysisResult; onReset: () => void }) {
  const { notify } = useAppState();
  const handleCopy = async () => {
    try { await copyReport(result); notify("Report copied to clipboard."); }
    catch (error) { notify(error instanceof Error ? error.message : "Could not copy the report."); }
  };
  const handleDownload = (format: "text" | "pdf") => {
    try {
      if (format === "text") downloadTextReport(result);
      else downloadPdfReport(result);
      notify(`${format === "text" ? "Text" : "PDF"} report downloaded.`);
    } catch (error) {
      notify(error instanceof Error ? error.message : `Could not generate the ${format.toUpperCase()} report.`);
    }
  };
  return <motion.section className="analysis-results" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} aria-live="polite">
    <div className="result-title-row"><div><div className="eyebrow"><span className="eyebrow-line" /> ANALYSIS COMPLETE</div><h2>Here’s what we found.</h2></div><button className="button button-quiet" onClick={onReset}><RotateCcw size={15} /> New scan</button></div>
    <RiskSummary result={result} />

    <div className="result-columns">
      <div className="result-column">
        <div className="result-card">
          <div className="card-title-row"><div><span className="card-kicker">MATCHED PATTERNS</span><h3>Warning signs <span className="count-badge">{result.indicators.length}</span></h3></div><ShieldAlert size={18} /></div>
          {result.indicators.length === 0 ? <div className="no-signals"><Check size={17} /><span>No configured warning patterns matched. Stay alert; this is not a safety guarantee.</span></div> :
            <div className="indicator-list">{result.indicators.map((item) => <article className="indicator" key={item.id}><span className="indicator-mark"><AlertTriangle size={15} /></span><div><strong>{item.label}</strong><p>{item.explanation}</p><div className="indicator-meta"><span>{item.phrase}</span><small>{item.weight} pts · {item.group}</small></div></div></article>)}</div>}
        </div>
        <div className="result-card">
          <div className="card-title-row"><div><span className="card-kicker">POINTS THAT COUNTED</span><h3>Group contributions</h3></div><Info size={18} /></div>
          {result.contributions.length ? <div className="contribution-list">{result.contributions.map((item) => <div className="contribution-row" key={item.group}><div><span className="contribution-dot" /><span>{item.label}</span></div><strong>+{item.points}</strong></div>)}</div> : <p className="muted-copy">No rule groups contributed points.</p>}
          {result.combinationBonus && <div className="bonus-row"><Sparkles size={16} /><span><strong>Combination bonus</strong><small> sensitive-detail request + link, threat, or prize signal</small></span><b>+10</b></div>}
          <div className="total-row"><span>Final score (capped at 100)</span><strong>{result.score} / 100</strong></div>
        </div>
      </div>

      <div className="result-column">
        <div className="result-card advice-card">
          <div className="card-title-row"><div><span className="card-kicker">NEXT STEPS</span><h3>Safer choices</h3></div><Shield size={18} /></div>
          <ol className="advice-list">{result.recommendations.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span>{item}</li>)}</ol>
        </div>
        <div className="result-card">
          <div className="card-title-row"><div><span className="card-kicker">URL CHECK</span><h3>Extracted links <span className="count-badge">{result.urls.length}</span></h3></div><ExternalLink size={18} /></div>
          {!result.urls.length ? <p className="muted-copy">No URLs detected in this message. ScamShield never opens links.</p> :
            <div className="url-list">{result.urls.map((item) => <div className="url-item" key={item.url}><div className="url-address"><span>{item.shortened ? "SHORT LINK" : "URL"}</span><code>{item.url}</code></div>{item.cautionReasons.map((reason) => <p key={reason}><Info size={13} />{reason}</p>)}{!item.cautionReasons.length && <p><Check size={13} />No structural caution identified. This does not verify the destination.</p>}</div>)}</div>}
          <p className="url-disclaimer">Structural checks only—not a reputation lookup or a claim that a link is malicious.</p>
        </div>
      </div>
    </div>

    <div className="report-actions"><div><span className="eyebrow">KEEP A COPY</span><p>Reports include the score, findings and advice—not your original message.</p></div><div className="report-buttons"><button className="button button-outline" onClick={handleCopy}><Clipboard size={15} /> Copy report</button><button className="button button-outline" onClick={() => handleDownload("text")}><FileText size={15} /> Download TXT</button><button className="button button-primary" onClick={() => handleDownload("pdf")}><Download size={15} /> Generate PDF</button></div></div>
  </motion.section>;
}

export default function Scanner() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const [sample, setSample] = useState("");
  const { addScan, notify } = useAppState();
  const reducedMotion = useReducedMotion();
  const scanTimer = useRef<number | null>(null);

  useEffect(() => () => {
    if (scanTimer.current !== null) window.clearTimeout(scanTimer.current);
  }, []);

  const runAnalysis = () => {
    if (!message.trim()) { setError("Paste a message before starting the analysis."); return; }
    if (message.length > 3000) { setError("Messages must be 3,000 characters or fewer."); return; }
    setError("");
    setResult(null);
    setScanning(true);
    scanTimer.current = window.setTimeout(() => {
      try {
        const analysis = analyzeMessage(message);
        setResult(analysis);
        addScan({ id: crypto.randomUUID(), createdAt: Date.now(), score: analysis.score, level: analysis.level, categories: analysis.contributions.map((item) => item.label) });
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Analysis failed. Please try again.");
      } finally { scanTimer.current = null; setScanning(false); }
    }, reducedMotion ? 50 : 700);
  };

  const chooseSample = (value: string) => {
    setSample(value);
    const sample = SCAN_SAMPLES.find((item) => item.name === value);
    if (sample) { setMessage(sample.text); setResult(null); setError(""); }
  };

  const clear = () => {
    if (scanTimer.current !== null) window.clearTimeout(scanTimer.current);
    scanTimer.current = null;
    setScanning(false);
    setMessage("");
    setSample("");
    setResult(null);
    setError("");
    notify("Message cleared from the scanner.");
  };
  const reset = () => { setMessage(""); setSample(""); setResult(null); setError(""); };

  return <div className="page-shell scanner-page section-wrap">
    <div className="breadcrumbs"><Link to="/">Home</Link><span>/</span><span>Message scanner</span></div>
    <div className="page-heading scanner-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> PRIVATE BY DESIGN · BROWSER-BASED</div><h1>Check before<br /><em>you trust.</em></h1><p>Paste the message that gave you pause. ScamShield checks for common patterns and explains every signal it finds.</p></div><div className="privacy-chip"><LockKeyhole size={15} /><span>LOCAL ANALYSIS<small>YOUR MESSAGE NEVER LEAVES THIS DEVICE</small></span></div></div>

    <div className="scanner-workspace">
      <section className="scanner-input-card">
        <div className="scanner-card-head"><div><span className="card-kicker">MESSAGE INPUT</span><h2>What did you receive?</h2></div><span className="input-index">01 / 02</span></div>
        <label className="visually-hidden" htmlFor="message-input">Suspicious message to analyze</label>
        <textarea id="message-input" value={message} maxLength={3000} disabled={scanning} onChange={(event) => { setMessage(event.target.value); setSample(""); setError(""); setResult(null); }} placeholder="Paste your suspicious SMS, WhatsApp message, or email here..." />
        <div className="textarea-meta"><span>{message.length.toLocaleString()} / 3,000 characters</span><button className="text-button" type="button" onClick={clear} disabled={!message || scanning}><Trash2 size={14} /> Clear</button></div>
        <div className="sample-picker"><label htmlFor="sample-select">Try an example</label><select id="sample-select" value={sample} disabled={scanning} onChange={(event) => chooseSample(event.target.value)}><option value="" disabled>Choose a sample message…</option>{SCAN_SAMPLES.map((sample) => <option value={sample.name} key={sample.name}>{sample.name}</option>)}</select></div>
        {error && <div className="form-error" role="alert"><AlertTriangle size={15} />{error}</div>}
        <button className="button button-primary analyze-button" onClick={runAnalysis} disabled={scanning}>{scanning ? <><LoaderCircle className="spin" size={17} /> Checking patterns…</> : <><ScanLine size={17} /> Analyze message <ArrowRight size={17} /></>}</button>
        <div className="scanner-privacy"><LockKeyhole size={14} /><span><strong>Your message stays on your device.</strong> It is not uploaded or saved in localStorage. Only score summaries are kept in temporary session memory.</span></div>
      </section>

      <aside className="scanner-method-card">
        <div className="method-illustration"><div className={scanning ? "scanner-sweep active" : "scanner-sweep"} /><div className="method-shield"><Shield size={33} /><Check size={15} /></div><span className="method-node node-a" /><span className="method-node node-b" /><span className="method-node node-c" /><span className="method-line line-a" /><span className="method-line line-b" /></div>
        <span className="card-kicker">WHAT HAPPENS NEXT</span><h3>Patterns, not predictions.</h3><p>This is a rule-based awareness aid—not an AI model and not a definitive scam detector.</p>
        <div className="method-steps"><div className={scanning ? "method-step current" : "method-step"}><span>01</span>Text stays in your browser</div><div className="method-step"><span>02</span>Rules check for configured signals</div><div className="method-step"><span>03</span>You get an explainable summary</div></div>
        <div className="weights-note"><Info size={14} /><span>Only the highest-weight match in each rule group adds to the base score.</span></div>
      </aside>
    </div>

    <AnimatePresence>{scanning && <motion.div className="scanning-status" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><span className="scanner-status-icon"><LoaderCircle className="spin" size={18} /></span><div><strong>Checking configured patterns</strong><small>Your message is processed locally and will not be stored.</small></div><span className="status-pulse" /></motion.div>}</AnimatePresence>
    {result && <ResultPanel result={result} onReset={reset} />}
    {!result && !scanning && <div className="scanner-disclaimer"><Info size={15} /><span>A low risk score does not guarantee that a message is safe. When in doubt, verify via an official website, app, or known phone number.</span></div>}
    <div className="scanner-footnav"><Link to="/insights"><ArrowLeft size={15} /> Session insights</Link><span>Need tips? <Link to="/academy">Visit the Security Academy <ArrowRight size={14} /></Link></span></div>
  </div>;
}
