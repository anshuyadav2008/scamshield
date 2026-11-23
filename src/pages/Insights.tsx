import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Activity, ArrowRight, BarChart3, Clock3, ShieldAlert, Trash2 } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useAppState } from "../appState";
import type { RiskLevel } from "../types";

const COLORS: Record<RiskLevel, string> = { LOW: "#56d3a5", MEDIUM: "#efb95f", HIGH: "#f2767c" };

export default function Insights() {
  const { scans, clearScans, notify } = useAppState();
  const counts = useMemo(() => ({
    LOW: scans.filter((scan) => scan.level === "LOW").length,
    MEDIUM: scans.filter((scan) => scan.level === "MEDIUM").length,
    HIGH: scans.filter((scan) => scan.level === "HIGH").length,
  }), [scans]);
  const categoryCounts = useMemo(() => {
    const countsByCategory = new Map<string, number>();
    scans.forEach((scan) => scan.categories.forEach((category) => countsByCategory.set(category, (countsByCategory.get(category) ?? 0) + 1)));
    return [...countsByCategory.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [scans]);
  const chartData = (Object.entries(counts) as [RiskLevel, number][]).map(([name, value]) => ({ name, value })).filter((item) => item.value > 0);

  return <div className="page-shell section-wrap insights-page">
    <div className="breadcrumbs"><Link to="/">Home</Link><span>/</span><span>Session insights</span></div>
    <div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> THIS SESSION ONLY</div><h1>Signals from<br /><em>your scans.</em></h1><p>A private summary of messages analyzed in this browser session. No message content is saved here.</p></div><Link className="button button-primary" to="/scanner">New analysis <ArrowRight size={16} /></Link></div>
    {scans.length === 0 ? <div className="empty-state"><div className="empty-art"><BarChart3 size={29} /></div><span className="card-kicker">NO SESSION DATA YET</span><h2>Your dashboard starts with your first scan.</h2><p>Analyze a message to see its score summary here. We show no sample or invented activity.</p><Link className="button button-primary" to="/scanner">Analyze a message <ArrowRight size={16} /></Link><span className="empty-privacy">Only score summaries live temporarily in memory. Refreshing this page clears the session history.</span></div> :
      <>
        <div className="insight-stats"><div className="insight-stat total"><span className="stat-icon"><Activity size={17} /></span><span className="stat-label">MESSAGES ANALYZED</span><strong>{scans.length}</strong><small>in this session</small></div>{(["LOW", "MEDIUM", "HIGH"] as RiskLevel[]).map((level) => <div className={`insight-stat ${level.toLowerCase()}`} key={level}><span className="stat-icon"><ShieldAlert size={17} /></span><span className="stat-label">{level} RISK</span><strong>{counts[level]}</strong><small>risk signals</small></div>)}</div>
        <div className="insight-panels">
          <section className="insight-panel chart-panel"><div className="panel-title"><div><span className="card-kicker">RISK BREAKDOWN</span><h2>Session distribution</h2></div></div><div className="chart-wrap"><ResponsiveContainer width="100%" height={230}><PieChart><Pie data={chartData} dataKey="value" nameKey="name" innerRadius={66} outerRadius={88} paddingAngle={4} stroke="none">{chartData.map((item) => <Cell key={item.name} fill={COLORS[item.name as RiskLevel]} />)}</Pie><Tooltip contentStyle={{ background: "var(--surface-strong)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text)" }} /></PieChart></ResponsiveContainer><div className="chart-center"><strong>{scans.length}</strong><span>SCANS</span></div></div><div className="chart-legend">{(["LOW", "MEDIUM", "HIGH"] as RiskLevel[]).map((level) => <span key={level}><i style={{ background: COLORS[level] }} />{level}<b>{counts[level]}</b></span>)}</div></section>
          <section className="insight-panel category-panel"><div className="panel-title"><div><span className="card-kicker">REPEATED SIGNALS</span><h2>Common categories</h2></div></div>{categoryCounts.length ? <div className="category-bars">{categoryCounts.map(([name, count]) => <div className="category-bar-row" key={name}><div><span>{name}</span><b>{count}</b></div><i><span style={{ width: `${Math.max(8, (count / scans.length) * 100)}%` }} /></i></div>)}</div> : <p className="muted-copy">No warning categories matched in your scans yet.</p>}<p className="chart-caption">Counts are based only on score summaries from this session.</p></section>
        </div>
        <section className="recent-scans"><div className="panel-title"><div><span className="card-kicker">TEMPORARY SESSION HISTORY</span><h2>Recent scans</h2></div><button className="text-button danger-text" onClick={() => { if (window.confirm("Clear all temporary session scan history?")) { clearScans(); notify("Session scan history cleared."); } }}><Trash2 size={14} /> Clear history</button></div><div className="scan-table">{scans.map((scan) => <div className="scan-row" key={scan.id}><span className="scan-clock"><Clock3 size={15} /></span><span className="scan-date">{new Date(scan.createdAt).toLocaleString()}</span><div className="scan-categories">{scan.categories.length ? scan.categories.slice(0, 2).join(" · ") : "No configured signals"}</div><span className={`risk-pill ${scan.level.toLowerCase()}`}>{scan.level}</span><strong>{scan.score}<small>/100</small></strong></div>)}</div></section>
        <div className="session-note"><Activity size={15} /> This data is stored in temporary app memory only. Reloading or closing this tab removes it.</div>
      </>}
  </div>;
}
