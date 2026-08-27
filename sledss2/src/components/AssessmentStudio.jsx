import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CircleAlert, Clock3, ExternalLink, Minus, Plus, RotateCcw, ShieldCheck, Square, Volume2, X } from "lucide-react";
import { scoreAssessment } from "../data/assessments";

function Progress({ current, total }) {
  return <div className="assessment-progress" aria-label={`Step ${current} of ${total}`}><span style={{ width: `${current / total * 100}%` }} /></div>;
}

let activeSpeechRun = 0;
let activeUtterance = null;

function stopSpeech() {
  activeSpeechRun += 1;
  activeUtterance = null;
  window.speechSynthesis?.cancel();
}

function speak(text) {
  if (!("speechSynthesis" in window)) return;
  stopSpeech();
  const run = activeSpeechRun;
  const sentences = String(text).match(/[^.!?]+[.!?]?/g) || [String(text)];
  const chunks = sentences.reduce((parts, sentence) => {
    const clean = sentence.trim();
    if (!clean) return parts;
    const last = parts[parts.length - 1];
    if (last && `${last} ${clean}`.length <= 180) parts[parts.length - 1] = `${last} ${clean}`;
    else parts.push(clean);
    return parts;
  }, []);
  const play = index => {
    if (run !== activeSpeechRun || index >= chunks.length) {
      activeUtterance = null;
      return;
    }
    const utterance = new SpeechSynthesisUtterance(chunks[index]);
    activeUtterance = utterance;
    utterance.rate = 0.82;
    utterance.pitch = 1;
    utterance.onend = () => {
      if (run === activeSpeechRun && activeUtterance === utterance) play(index + 1);
    };
    utterance.onerror = () => {
      if (run === activeSpeechRun && activeUtterance === utterance) activeUtterance = null;
    };
    window.speechSynthesis.speak(utterance);
  };
  play(0);
}

function questionNarration(question) {
  if (!question) return "";
  const choices = question.type === "choice"
    ? ` Your choices are: ${question.options.map(option => option.detail ? `${option.label}. ${option.detail}` : option.label).join(". ")}.`
    : "";
  const fieldInstruction = {
    number: ` Enter a number in ${question.unit || "the field"}.`,
    date: " Enter the full date from memory.",
    place: " State the place, type it, then record how the answer was checked.",
    recall: " Enter one remembered word in each of the three boxes. The order does not matter.",
    chairStand: " When ready, press Start automatic countdown. A helper should press Stand completed after every full stand."
  }[question.type] || "";
  return `${question.text}. ${question.help || ""}${choices}${fieldInstruction}`;
}

export default function AssessmentStudio({ assessment, existing, onClose, onComplete }) {
  const [stage, setStage] = useState(existing ? "result" : "intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [memorySeen, setMemorySeen] = useState(false);
  const [chairPhase, setChairPhase] = useState("ready");
  const [countdown, setCountdown] = useState(3);
  const [remaining, setRemaining] = useState(30);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const closeRef = useRef(null);
  const resultNarratedRef = useRef(false);
  const result = useMemo(() => stage === "result" ? (existing || scoreAssessment(assessment.id, answers)) : null, [stage, existing, assessment.id, answers]);
  const question = assessment.questions[step];
  const total = assessment.questions.length;

  useEffect(() => {
    closeRef.current?.focus();
    const key = event => event.key === "Escape" && onClose();
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("keydown", key);
      stopSpeech();
    };
  }, [onClose]);

  useEffect(() => {
    if (!voiceEnabled || stage === "intro") return;
    const timer = setTimeout(() => {
      if (stage === "memory") {
        speak(`Memory step. Learn these three words. ${assessment.memoryWords.join(". ")}. Repeat all three aloud. They will be hidden on the next screen.`);
      } else if (stage === "questions") {
        speak(questionNarration(question));
      } else if (stage === "result" && result && !resultNarratedRef.current) {
        resultNarratedRef.current = true;
        speak(`Your screening result is: ${result.label}. ${result.summary}. Your next best step: ${result.action}`);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [assessment.memoryWords, question, result, stage, voiceEnabled]);

  useEffect(() => {
    if (chairPhase !== "countdown") return;
    speak(String(countdown));
    const timer = setTimeout(() => {
      if (countdown > 1) setCountdown(value => value - 1);
      else {
        speak("Go");
        setChairPhase("running");
        setRemaining(30);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [chairPhase, countdown]);

  useEffect(() => {
    if (chairPhase !== "running") return;
    const timer = setInterval(() => {
      setRemaining(value => {
        if (value > 1) {
          const next = value - 1;
          if (next === 10) speak("Ten seconds remaining");
          return next;
        }
        clearInterval(timer);
        speak("Stop");
        setChairPhase("complete");
        setAnswers(current => ({ ...current, stands: { ...current.stands, completed: true, stopped: false } }));
        return 0;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [chairPhase]);

  const answer = question ? answers[question.id] : undefined;
  const canContinue = useMemo(() => {
    if (!question) return false;
    if (question.type === "number") return Number(answer) >= question.min && Number(answer) <= question.max;
    if (question.type === "place") return Boolean(answer?.text?.trim() && answer?.verification);
    if (question.type === "recall") return Array.isArray(answer) && answer.length === 3 && answer.every(word => word.trim());
    if (question.type === "chairStand") return Boolean(answer?.completed || answer?.stopped);
    return answer !== undefined && answer !== "";
  }, [question, answer]);

  function finish(finalAnswers = answers) {
    const scored = scoreAssessment(assessment.id, finalAnswers);
    onComplete(assessment.id, { ...scored, completedAt: new Date().toISOString(), answers: finalAnswers });
    setStage("result");
  }

  function next() {
    if (assessment.id === "mobility" && question.id === "safe" && Number(answer) === 1) {
      finish();
      return;
    }
    if (step < total - 1) setStep(value => value + 1);
    else finish();
  }

  function back() {
    if (chairPhase === "running" || chairPhase === "countdown") return;
    setStep(value => Math.max(0, value - 1));
  }

  function restart() {
    setAnswers({});
    setStep(0);
    setMemorySeen(false);
    setChairPhase("ready");
    setCountdown(3);
    setRemaining(30);
    resultNarratedRef.current = false;
    setStage("intro");
  }

  function startChairTest() {
    setAnswers(current => ({ ...current, stands: { count: 0, usedArms: false, stopped: false, completed: false, halfwayAdded: false } }));
    setCountdown(3);
    setRemaining(30);
    setChairPhase("countdown");
  }

  function stopChairTest() {
    speak("Stop");
    setChairPhase("stopped");
    setAnswers(current => ({ ...current, stands: { ...current.stands, stopped: true, completed: false } }));
  }

  function changeStandCount(amount) {
    setAnswers(current => ({ ...current, stands: { ...current.stands, count: Math.max(0, Number(current.stands?.count || 0) + amount) } }));
  }

  function toggleVoice() {
    setVoiceEnabled(current => {
      if (current) stopSpeech();
      return !current;
    });
  }

  const testLocked = chairPhase === "countdown" || chairPhase === "running";
  const standResultReady = chairPhase === "complete" || chairPhase === "stopped";

  return <div className="assessment-backdrop" onMouseDown={event => event.target === event.currentTarget && !testLocked && onClose()}>
    <section className="assessment-studio" role="dialog" aria-modal="true" aria-labelledby="assessment-title">
      <button ref={closeRef} className="assessment-close" onClick={onClose} disabled={testLocked} aria-label="Close assessment"><X /></button>
      <div className="studio-brand"><span>{assessment.short}</span><small>{assessment.source}</small></div>

      {stage === "intro" && <div className="studio-intro">
        <span className="eyebrow">GUIDED HEALTH SCREEN</span>
        <h2 id="assessment-title">{assessment.title}</h2>
        <p>{assessment.intro}</p>
        {assessment.safety && <div className="safety-note"><CircleAlert /><span><strong>Safety comes before a score</strong>Use a firm chair against a wall and have another adult nearby. Stop immediately for pain, dizziness, unusual breathlessness or unsteadiness.</span></div>}
        <div className="voice-guide-card">
          <div><Volume2 /><span><strong>Voice guidance is on</strong>Questions, answer choices and results can be read aloud.</span></div>
          <div>
            <button onClick={() => speak(`${assessment.title}. ${assessment.intro}. ${assessment.safety ? "Safety comes before a score. Use a firm chair against a wall and have another adult nearby." : ""}`)}><Volume2 /> Hear introduction</button>
            <button className={voiceEnabled ? "voice-toggle on" : "voice-toggle"} onClick={toggleVoice} aria-pressed={voiceEnabled}>{voiceEnabled ? "Auto-read on" : "Auto-read off"}</button>
          </div>
        </div>
        <div className="studio-facts"><span><Clock3 />{assessment.time}</span><span><ShieldCheck />Private health check</span></div>
        <button className="primary-button studio-primary" onClick={() => setStage(assessment.memoryWords ? "memory" : "questions")}>Begin check <ArrowRight /></button>
        <a href={assessment.sourceUrl} target="_blank" rel="noreferrer">Read the source method <ExternalLink /></a>
      </div>}

      {stage === "memory" && <div className="memory-stage">
        <span className="eyebrow">MEMORY STEP</span>
        <h2 id="assessment-title">Learn these three words</h2>
        <p>Read or listen to each word. Repeat all three aloud. They will disappear on the next screen and you will enter them later without hints.</p>
        <div className="memory-words">{assessment.memoryWords.map(word => <strong key={word}>{word}</strong>)}</div>
        <div className="voice-actions"><button className="read-aloud" onClick={() => speak(`${assessment.memoryWords.join(". ")}. Please repeat those three words.`)}><Volume2 /> Replay voice</button><button className={voiceEnabled ? "voice-toggle on" : "voice-toggle"} onClick={toggleVoice} aria-pressed={voiceEnabled}>{voiceEnabled ? "Auto-read on" : "Auto-read off"}</button></div>
        <button className="primary-button studio-primary" onClick={() => { setMemorySeen(true); setStage("questions"); }}>I am ready—hide the words <ArrowRight /></button>
      </div>}

      {stage === "questions" && question && <div className="studio-question">
        <Progress current={step + 1} total={total} />
        <div className="question-label-row"><span className="eyebrow">STEP {step + 1} OF {total}</span><div className="voice-actions"><button className="read-aloud compact" onClick={() => speak(questionNarration(question))}><Volume2 /> Replay voice</button><button className={voiceEnabled ? "voice-toggle on" : "voice-toggle"} onClick={toggleVoice} aria-pressed={voiceEnabled}>{voiceEnabled ? "Auto-read on" : "Auto-read off"}</button></div></div>
        <h2 id="assessment-title">{question.text}</h2>
        {question.help && <p className="question-help">{question.help}</p>}
        {question.id === "recall" && memorySeen && <div className="no-hints"><ShieldCheck />The original words are now hidden. Enter what was actually remembered.</div>}

        {question.type === "choice" && <div className="answer-list">{question.options.map(option =>
          <button key={option.label} className={answer === option.value ? "selected" : ""} onClick={() => setAnswers(current => ({ ...current, [question.id]: option.value }))}>
            <span><strong>{option.label}</strong>{option.detail && <small>{option.detail}</small>}</span><i>{answer === option.value && <Check />}</i>
          </button>
        )}</div>}

        {question.type === "number" && <label className="simple-measure">
          <input autoFocus aria-label={question.text} type="number" min={question.min} max={question.max} step={question.step || 1} value={answer ?? ""} onChange={event => setAnswers(current => ({ ...current, [question.id]: event.target.value }))} />
          <span>{question.unit}</span>
        </label>}

        {question.type === "date" && <div className="large-field"><label htmlFor="orientation-date">Enter the full date</label><input id="orientation-date" type="date" value={answer || ""} onChange={event => setAnswers(current => ({ ...current, [question.id]: event.target.value }))} /></div>}

        {question.type === "place" && <div className="place-answer">
          <label htmlFor="current-place">Type the place stated by the person taking the test</label>
          <input id="current-place" autoComplete="off" placeholder="Example: My home in Jinja" value={answer?.text || ""} onChange={event => setAnswers(current => ({ ...current, [question.id]: { ...current[question.id], text: event.target.value } }))} />
          <fieldset><legend>How was this answer checked?</legend>
            {[["confirmed", "A helper confirmed it is correct"], ["self", "No helper—record without independent check"], ["incorrect", "Incorrect or the person did not know"]].map(([value, label]) =>
              <button type="button" key={value} className={answer?.verification === value ? "selected" : ""} onClick={() => setAnswers(current => ({ ...current, [question.id]: { ...current[question.id], verification: value } }))}>{answer?.verification === value && <Check />}{label}</button>
            )}
          </fieldset>
        </div>}

        {question.type === "recall" && <div className="recall-answer">
          {[0, 1, 2].map(index => <label key={index}><span>Word {index + 1}</span><input autoComplete="off" spellCheck="false" value={answer?.[index] || ""} onChange={event => {
            const words = Array.isArray(answer) ? [...answer] : ["", "", ""];
            words[index] = event.target.value;
            setAnswers(current => ({ ...current, [question.id]: words }));
          }} /></label>)}
        </div>}

        {question.type === "chairStand" && <div className="chair-test">
          <div className={`chair-clock ${chairPhase}`}>
            {chairPhase === "ready" && <><strong>30</strong><span>seconds</span></>}
            {chairPhase === "countdown" && <><strong>{countdown}</strong><span>Get ready</span></>}
            {chairPhase === "running" && <><strong>{remaining}</strong><span>seconds left</span></>}
            {chairPhase === "complete" && <><Check /><strong>Stop</strong><span>30 seconds complete</span></>}
            {chairPhase === "stopped" && <><Square /><strong>Stopped</strong><span>Safety first</span></>}
          </div>
          {chairPhase === "ready" && <button className="start-test-button" onClick={startChairTest}>Start automatic countdown</button>}
          {(chairPhase === "running" || standResultReady) && <div className="stand-counter" aria-live="polite">
            <span>Complete stands</span><strong>{answer?.count || 0}</strong>
            <button className="count-stand-button" disabled={chairPhase !== "running"} onClick={() => changeStandCount(1)}><Plus /> Stand completed</button>
            <button className="correct-count" disabled={!answer?.count} onClick={() => changeStandCount(-1)}><Minus /> Correct the count</button>
          </div>}
          {chairPhase === "running" && <button className="stop-test-button" onClick={stopChairTest}><Square /> Stop now for safety</button>}
          {standResultReady && <div className="chair-checks">
            {chairPhase === "complete" && !answer?.halfwayAdded && <button onClick={() => setAnswers(current => ({ ...current, stands: { ...current.stands, count: Number(current.stands?.count || 0) + 1, halfwayAdded: true } }))}>At “Stop,” I was more than halfway up—add one stand</button>}
            <label><input type="checkbox" checked={Boolean(answer?.usedArms)} onChange={event => setAnswers(current => ({ ...current, stands: { ...current.stands, usedArms: event.target.checked } }))} /> I used my hands or arms to stand</label>
            <small>If arms were used, the official protocol records a score of zero.</small>
          </div>}
        </div>}

        <div className="studio-nav">
          {step > 0 && <button className="back-button" disabled={testLocked} onClick={back}><ArrowLeft />Back</button>}
          <button className="primary-button" disabled={!canContinue || testLocked} onClick={next}>{step === total - 1 ? "See my result" : assessment.id === "mobility" && question.id === "safe" && Number(answer) === 1 ? "Skip safely" : "Continue"}<ArrowRight /></button>
        </div>
      </div>}

      {stage === "result" && result && <div className="studio-result">
        <div className={`result-mark ${result.level}`}><Check /></div>
        <span className="eyebrow">YOUR SCREENING RESULT</span>
        <h2 id="assessment-title">{result.label}</h2>
        <div className="voice-actions result-voice"><button className="read-aloud compact" onClick={() => speak(`Your screening result is: ${result.label}. ${result.summary}. Your next best step: ${result.action}`)}><Volume2 /> Hear my result</button><button className={voiceEnabled ? "voice-toggle on" : "voice-toggle"} onClick={toggleVoice} aria-pressed={voiceEnabled}>{voiceEnabled ? "Auto-read on" : "Auto-read off"}</button></div>
        {result.score !== null && <div className="result-score"><strong>{result.score}</strong>{result.max && <span> / {result.max}</span>}{result.unit && <span className="score-unit">{result.unit}</span>}</div>}
        <p>{result.summary}</p>
        <div className="result-action"><strong>Your next best step</strong><span>{result.action}</span></div>
        <div className="result-caveat"><CircleAlert />A screen is not a diagnosis. Seek prompt professional care for new, worsening or concerning symptoms.</div>
        <div className="studio-nav"><button className="back-button" onClick={restart}><RotateCcw />Take again</button><button className="primary-button" onClick={onClose}>Done <Check /></button></div>
      </div>}
    </section>
  </div>;
}
