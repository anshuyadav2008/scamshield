import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, RotateCcw, ShieldAlert, X } from "lucide-react";
import { QUIZ_QUESTIONS } from "../data/samples";

export default function Quiz() {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const finished = index >= QUIZ_QUESTIONS.length;

  const respond = (choice: boolean) => {
    if (answer !== null) return;
    setAnswer(choice);
    if (choice === QUIZ_QUESTIONS[index].suspicious) setScore((value) => value + 1);
  };
  const next = () => { setIndex((value) => value + 1); setAnswer(null); };
  const restart = () => { setIndex(0); setAnswer(null); setScore(0); };
  const question = QUIZ_QUESTIONS[index];
  const isCorrect = answer === question?.suspicious;

  return <div className="page-shell section-wrap quiz-page">
    <div className="breadcrumbs"><Link to="/">Home</Link><span>/</span><span>Scam IQ quiz</span></div>
    <div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> PRACTICE YOUR PAUSE</div><h1>Test your<br /><em>scam instincts.</em></h1><p>Ten sample messages. Look beyond keywords—context and the requested action matter.</p></div><div className="quiz-mark"><ShieldAlert size={27} /><span>SCAM<br />IQ</span></div></div>
    {!finished ? <section className="quiz-card">
      <div className="quiz-progress-top"><span>MESSAGE {String(index + 1).padStart(2, "0")} <i>/ {QUIZ_QUESTIONS.length}</i></span><span>SCORE <strong>{score}</strong></span></div>
      <div className="quiz-progress"><span style={{ width: `${(index / QUIZ_QUESTIONS.length) * 100}%` }} /></div>
      <span className="quiz-label">{question.label}</span>
      <blockquote>“{question.message}”</blockquote>
      <p className="quiz-prompt">What’s your read on this message?</p>
      <div className="quiz-choices"><button onClick={() => respond(true)} disabled={answer !== null} className={answer !== null && question.suspicious ? "choice-correct" : answer === true ? "choice-wrong" : ""}><ShieldAlert size={17} /> Suspicious <span>It raises warning signs</span></button><button onClick={() => respond(false)} disabled={answer !== null} className={answer !== null && !question.suspicious ? "choice-correct" : answer === false ? "choice-wrong" : ""}><Check size={17} /> Looks legitimate <span>No clear warning signs</span></button></div>
      {answer !== null && <div className={`quiz-feedback ${isCorrect ? "correct" : "incorrect"}`} role="status"><span>{isCorrect ? <Check size={18} /> : <X size={18} />}</span><div><strong>{isCorrect ? "Good read." : "A useful learning moment."}</strong><p>{question.explanation}</p></div><button className="button button-primary" onClick={next}>{index === QUIZ_QUESTIONS.length - 1 ? "See your score" : "Next message"} <ArrowRight size={15} /></button></div>}
      <div className="quiz-foot"><span>Choose based on the request and context—not just a familiar word.</span><span>{index + 1} of {QUIZ_QUESTIONS.length}</span></div>
    </section> : <section className="quiz-finish"><div className="finish-circle"><strong>{score}<small>/{QUIZ_QUESTIONS.length}</small></strong></div><span className="eyebrow">QUIZ COMPLETE</span><h2>{score >= 8 ? "A strong pause instinct." : score >= 5 ? "You’re building awareness." : "Keep learning—anyone can improve."}</h2><p>This quiz is for practice, not a test of expertise. Scam messages change, so independently verify unexpected requests.</p><div className="finish-actions"><button className="button button-primary" onClick={restart}><RotateCcw size={15} /> Try again</button><Link className="button button-outline" to="/academy"><ArrowLeft size={15} /> Read the Academy</Link></div></section>}
    <div className="quiz-disclaimer">Samples are educational examples. Real messages may be more subtle; a quiz result cannot establish whether a message is genuine.</div>
  </div>;
}
