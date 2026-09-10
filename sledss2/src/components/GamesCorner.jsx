import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, Gamepad2, Grid3X3, Leaf, RotateCcw, Sparkles, Star, Volume2 } from "lucide-react";
import "./GamesCorner.css";

const GAME_KEY = "sledss_game_progress";
const gardenItems = [
  { emoji: "🌻", label: "sunflower" },
  { emoji: "🍎", label: "apple" },
  { emoji: "🐦", label: "bird" },
  { emoji: "☕", label: "cup" },
  { emoji: "🌿", label: "leaf" },
  { emoji: "🔑", label: "key" }
];

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

let gameVoice = null;
function speakGame(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  gameVoice = new SpeechSynthesisUtterance(text);
  gameVoice.rate = 0.82;
  gameVoice.onend = () => { gameVoice = null; };
  window.speechSynthesis.speak(gameVoice);
}

function readProgress() {
  try {
    return { points: 0, gamesPlayed: 0, completed: {}, ...JSON.parse(localStorage.getItem(GAME_KEY) || "{}") };
  } catch {
    return { points: 0, gamesPlayed: 0, completed: {} };
  }
}

const games = [
  { id: "pairs", icon: Grid3X3, title: "Picture Pairs", description: "Turn over two cards at a time and find four friendly picture pairs.", tone: "game-peach", skill: "Observation" },
  { id: "garden", icon: Leaf, title: "Remember the Garden", description: "Look at a short row of pictures, then choose them in the same order.", tone: "game-green", skill: "Recall" },
  { id: "trail", icon: Sparkles, title: "Number Trail", description: "Find and tap the numbers from 1 to 12 in order. Take all the time you need.", tone: "game-blue", skill: "Focus" }
];

function GameHeader({ title, instructions, onBack }) {
  return <div className="game-play-header">
    <button className="game-back" onClick={onBack}><ArrowLeft />All games</button>
    <div><span className="eyebrow">PLAY AT YOUR OWN PACE</span><h3>{title}</h3></div>
    <button className="game-listen" onClick={() => speakGame(instructions)}><Volume2 />Hear instructions</button>
  </div>;
}

function Celebration({ message, onAgain, onBack }) {
  return <div className="game-celebration" role="status">
    <div className="celebration-sun"><Star /></div>
    <span className="eyebrow">BEAUTIFULLY DONE</span>
    <h3>{message}</h3>
    <p>You earned 3 sun points. There is no perfect speed—showing up and playing is the win.</p>
    <div><button className="game-secondary" onClick={onBack}>Choose another game</button><button className="primary-button" onClick={onAgain}><RotateCcw />Play again</button></div>
  </div>;
}

function PicturePairs({ onDone, onBack }) {
  const makeDeck = () => shuffle(gardenItems.slice(0, 4).flatMap((item, pair) => [
    { ...item, id: `${pair}-a`, pair }, { ...item, id: `${pair}-b`, pair }
  ]));
  const [deck, setDeck] = useState(makeDeck);
  const [open, setOpen] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [finished, setFinished] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);
  useEffect(() => {
    if (matched.length === deck.length && deck.length && !finished) {
      setFinished(true);
      onDone("pairs");
      speakGame("Wonderful. You found every picture pair.");
    }
  }, [deck.length, finished, matched.length, onDone]);

  function choose(card) {
    if (open.length === 2 || open.includes(card.id) || matched.includes(card.id)) return;
    const next = [...open, card.id];
    setOpen(next);
    if (next.length === 2) {
      setMoves(value => value + 1);
      const [first, second] = next.map(id => deck.find(item => item.id === id));
      timerRef.current = setTimeout(() => {
        if (first.pair === second.pair) setMatched(current => [...current, first.id, second.id]);
        setOpen([]);
      }, 700);
    }
  }

  function reset() {
    clearTimeout(timerRef.current);
    setDeck(makeDeck());
    setOpen([]);
    setMatched([]);
    setMoves(0);
    setFinished(false);
  }

  if (finished) return <Celebration message={`You found all four pairs in ${moves} turns.`} onAgain={reset} onBack={onBack} />;
  return <div>
    <GameHeader title="Picture Pairs" instructions="Turn over two cards. If the pictures match, they stay open. Find all four pairs. There is no timer." onBack={onBack} />
    <div className="game-status"><strong>{matched.length / 2} of 4 pairs found</strong><span>{moves} turns</span></div>
    <div className="pair-board">{deck.map(card => {
      const visible = open.includes(card.id) || matched.includes(card.id);
      return <button key={card.id} className={visible ? "pair-card visible" : "pair-card"} onClick={() => choose(card)} aria-label={visible ? card.label : "Hidden picture card"}>
        <span aria-hidden="true">{visible ? card.emoji : "?"}</span>{visible && <small>{card.label}</small>}
      </button>;
    })}</div>
  </div>;
}

function GardenRecall({ onDone, onBack }) {
  const [round, setRound] = useState(1);
  const [target, setTarget] = useState([]);
  const [options, setOptions] = useState(() => shuffle(gardenItems));
  const [chosen, setChosen] = useState([]);
  const [phase, setPhase] = useState("ready");
  const [message, setMessage] = useState("");
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  function showRound(nextRound = round) {
    const sequence = shuffle(gardenItems).slice(0, Math.min(2 + nextRound, 5));
    setTarget(sequence);
    setOptions(shuffle(gardenItems));
    setChosen([]);
    setMessage("");
    setPhase("show");
    speakGame(`Round ${nextRound}. Look and remember. ${sequence.map(item => item.label).join(". ")}.`);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setPhase("choose"), 6500);
  }

  function choose(item) {
    if (phase !== "choose") return;
    const position = chosen.length;
    if (target[position].label !== item.label) {
      setMessage("That was a different picture. Have another gentle try from the first picture.");
      setChosen([]);
      speakGame("That was a different picture. Try again from the first picture.");
      return;
    }
    const next = [...chosen, item];
    setChosen(next);
    if (next.length === target.length) {
      if (round === 3) {
        setPhase("finished");
        onDone("garden");
        speakGame("Beautiful remembering. You completed all three garden rounds.");
      } else {
        setMessage("Correct! You remembered the whole row.");
        setPhase("between");
      }
    }
  }

  function nextRound() {
    const value = round + 1;
    setRound(value);
    showRound(value);
  }

  function reset() {
    clearTimeout(timerRef.current);
    setRound(1);
    setTarget([]);
    setOptions(shuffle(gardenItems));
    setChosen([]);
    setMessage("");
    setPhase("ready");
  }

  if (phase === "finished") return <Celebration message="You remembered all three garden rows." onAgain={reset} onBack={onBack} />;
  return <div>
    <GameHeader title="Remember the Garden" instructions="Look at the row of pictures. After the pictures hide, tap the same pictures in the same order. There are three gentle rounds and no timer for answering." onBack={onBack} />
    <div className="game-status"><strong>Round {round} of 3</strong><span>{phase === "show" ? "Look and remember" : phase === "choose" ? `Choose picture ${chosen.length + 1}` : "Ready when you are"}</span></div>
    {phase === "ready" && <div className="game-ready"><span aria-hidden="true">🌻 🌿 🐦</span><h4>Ready to remember a garden row?</h4><p>The pictures will stay visible for a few seconds. Take a breath and press start.</p><button className="primary-button" onClick={() => showRound()}>Show my first row</button></div>}
    {phase === "show" && <div className="garden-sequence" aria-label={target.map(item => item.label).join(", ")}>{target.map((item, index) => <div key={`${item.label}-${index}`}><span>{item.emoji}</span><small>{index + 1}</small></div>)}</div>}
    {phase === "choose" && <><div className="chosen-slots">{target.map((_, index) => <span key={index}>{chosen[index]?.emoji || index + 1}</span>)}</div><button className="peek-again" onClick={() => showRound(round)}><RotateCcw />Show the row again</button><div className="garden-options">{options.map(item => <button key={item.label} onClick={() => choose(item)} aria-label={item.label}><span>{item.emoji}</span><small>{item.label}</small></button>)}</div></>}
    {message && <p className={phase === "between" ? "game-message success" : "game-message"}>{message}</p>}
    {phase === "between" && <button className="primary-button game-next" onClick={nextRound}>Next gentle round</button>}
  </div>;
}

function NumberTrail({ onDone, onBack }) {
  const [numbers, setNumbers] = useState(() => shuffle(Array.from({ length: 12 }, (_, index) => index + 1)));
  const [next, setNext] = useState(1);
  const [message, setMessage] = useState("");
  const [finished, setFinished] = useState(false);

  function choose(number) {
    if (number !== next) {
      setMessage(`Look for number ${next}. Take your time.`);
      speakGame(`Look for number ${next}. Take your time.`);
      return;
    }
    setMessage("");
    if (number === 12) {
      setFinished(true);
      onDone("trail");
      speakGame("Excellent focus. You completed the number trail from one to twelve.");
    } else setNext(number + 1);
  }

  function reset() {
    setNumbers(shuffle(Array.from({ length: 12 }, (_, index) => index + 1)));
    setNext(1);
    setMessage("");
    setFinished(false);
  }

  if (finished) return <Celebration message="You completed the trail from 1 to 12." onAgain={reset} onBack={onBack} />;
  return <div>
    <GameHeader title="Number Trail" instructions="Find and tap number one, then two, and continue in order until twelve. There is no timer. Take all the time you need." onBack={onBack} />
    <div className="game-status"><strong>Find number {next}</strong><span>{next - 1} of 12 found</span></div>
    <div className="number-board">{numbers.map(number => <button key={number} className={number < next ? "found" : ""} disabled={number < next} onClick={() => choose(number)}>{number < next ? <Check /> : number}</button>)}</div>
    {message && <p className="game-message">{message}</p>}
  </div>;
}

export default function GamesCorner() {
  const [active, setActive] = useState(null);
  const [progress, setProgress] = useState(readProgress);

  function completed(id) {
    setProgress(current => {
      const next = { points: current.points + 3, gamesPlayed: current.gamesPlayed + 1, completed: { ...current.completed, [id]: (current.completed[id] || 0) + 1 }, lastPlayed: new Date().toISOString() };
      localStorage.setItem(GAME_KEY, JSON.stringify(next));
      return next;
    });
  }

  const gameProps = { onDone: completed, onBack: () => { window.speechSynthesis?.cancel(); setActive(null); } };
  return <section className="games-corner" id="games">
    {!active ? <>
      <div className="games-heading"><div><span className="eyebrow">SLEDSS GAMES CORNER</span><h2>A little play for a brighter day</h2><p>Calm, simple games made for enjoyment. No pressure, no health score and no wrong day to begin.</p></div><div className="game-progress-badge"><span><Star />{progress.points}</span><small>sun points</small></div></div>
      <div className="daily-play"><Gamepad2 /><div><strong>Your gentle goal</strong><span>Enjoy one game today. Playing is optional and never changes your health results.</span></div><span>{progress.gamesPlayed} played</span></div>
      <div className="games-grid">{games.map(game => {
        const Icon = game.icon;
        return <article className="game-card" key={game.id}><div className={`game-icon ${game.tone}`}><Icon /></div><span className="game-skill">{game.skill}</span><h3>{game.title}</h3><p>{game.description}</p>{progress.completed[game.id] > 0 && <small className="played-before"><Check />Enjoyed {progress.completed[game.id]} time{progress.completed[game.id] === 1 ? "" : "s"}</small>}<button onClick={() => setActive(game.id)}>Play now <Gamepad2 /></button></article>;
      })}</div>
      <p className="games-boundary"><ShieldText />These activities are for recreation and engagement. They do not test, diagnose or monitor a health condition.</p>
    </> : <div className="game-stage" role="region" aria-live="polite">
      {active === "pairs" && <PicturePairs {...gameProps} />}
      {active === "garden" && <GardenRecall {...gameProps} />}
      {active === "trail" && <NumberTrail {...gameProps} />}
    </div>}
  </section>;
}

function ShieldText() {
  return <span aria-hidden="true">ⓘ</span>;
}
