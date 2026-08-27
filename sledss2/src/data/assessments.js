export const frequencyOptions = [
  { label: "At no time", detail: "Not once during the past 2 weeks", value: 0 },
  { label: "Some of the time", detail: "Only occasionally", value: 1 },
  { label: "Less than half the time", detail: "On a few days", value: 2 },
  { label: "More than half the time", detail: "On many days", value: 3 },
  { label: "Most of the time", detail: "Nearly every day", value: 4 },
  { label: "All of the time", detail: "Every day or almost every day", value: 5 }
];

const ageBands = ["60–64", "65–69", "70–74", "75–79", "80–84", "85–89", "90–94"];

export const assessmentCatalog = [
  {
    id: "who5", title: "Mental well-being", short: "WHO-5", time: "2 min", due: "Recommended monthly", state: "Validated", icon: "stress", tone: "purple",
    description: "Five questions about positive well-being during the last two weeks.", source: "World Health Organization", sourceUrl: "https://www.who.int/publications/m/item/WHO-UCN-MSD-MHE-2024.01",
    intro: "Think only about the past two weeks. Choose the answer that comes closest, even if no option feels perfect.",
    questions: [
      "I have felt cheerful and in good spirits.", "I have felt calm and relaxed.", "I have felt active and vigorous.",
      "I woke up feeling fresh and rested.", "My daily life has been filled with things that interest me."
    ].map((text, index) => ({ id: `w${index + 1}`, text, help: "Choose one answer for the whole two-week period.", type: "choice", options: frequencyOptions }))
  },
  {
    id: "sleep", title: "Sleep health snapshot", short: "CDC informed", time: "2 min", due: "Recommended weekly", state: "Calibrated", icon: "sleep", tone: "blue",
    description: "Records sleep duration, restfulness and common sleep difficulties.", source: "CDC Sleep Health", sourceUrl: "https://www.cdc.gov/sleep/about/index.html",
    intro: "Think about the last seven nights, including naps. Answer for what usually happened—not only your best or worst night.",
    questions: [
      { id: "hours", text: "About how much did you sleep in each 24-hour day?", help: "Include naps. For example, 6 hours at night plus a 1-hour nap equals 7 hours.", type: "number", unit: "hours", min: 1, max: 16, step: 0.5 },
      { id: "rested", text: "During the last seven days, how often did you wake feeling rested?", help: "Think about how you felt within 30 minutes of waking.", type: "choice", options: [{ label: "Usually", detail: "5–7 days", value: 0 }, { label: "Sometimes", detail: "2–4 days", value: 1 }, { label: "Rarely or never", detail: "0–1 day", value: 2 }] },
      { id: "difficulty", text: "How often did you have trouble falling asleep or staying asleep?", help: "Count long periods awake during the night as difficulty staying asleep.", type: "choice", options: [{ label: "Rarely or never", detail: "0–1 day", value: 0 }, { label: "Sometimes", detail: "2–4 days", value: 1 }, { label: "Usually", detail: "5–7 days", value: 2 }] }
    ]
  },
  {
    id: "nutrition", title: "Nutrition & vitality", short: "WHO ICOPE", time: "2 min", due: "Recommended every 3 months", state: "Validated", icon: "nutrition", tone: "green",
    description: "Checks recent unplanned weight loss and reduced appetite.", source: "WHO ICOPE", sourceUrl: "https://www.who.int/publications/i/item/9789240103726",
    intro: "Think about the last three months. Weight loss means weight you did not intend to lose through dieting or exercise.",
    questions: [
      { id: "weightLoss", text: "Have you lost more than 3 kg (about 6½ lb) without trying?", help: "If you do not know, choose ‘Not sure’ so the result recommends checking your weight.", type: "choice", options: [{ label: "No", detail: "No unplanned loss of that amount", value: 0 }, { label: "Yes", detail: "More than 3 kg without trying", value: 1 }, { label: "Not sure", detail: "I have not tracked my weight", value: 2 }] },
      { id: "appetite", text: "Has your appetite clearly reduced?", help: "Examples include skipping meals, eating much smaller portions, or rarely feeling hungry.", type: "choice", options: [{ label: "No", detail: "Eating is about the same as usual", value: 0 }, { label: "Yes", detail: "Eating less than usual", value: 1 }, { label: "Not sure", detail: "I need help judging this", value: 2 }] }
    ]
  },
  {
    id: "mobility", title: "Mobility & strength", short: "CDC STEADI", time: "3 min", due: "Recommended every 3 months", state: "Guided test", icon: "activity", tone: "coral",
    description: "Counts complete chair stands during a guided 30-second test.", source: "CDC STEADI", sourceUrl: "https://www.cdc.gov/steadi/media/pdfs/steadi-assessment-30sec-508.pdf",
    intro: "You do not need to set a timer. SLEDSS will count down and run the 30-second clock while a helper taps once for every complete stand.", safety: true,
    questions: [
      { id: "safe", text: "Is it safe for you to try this test today?", help: "Use a firm, straight-backed chair without armrests. Put it against a wall. Ask another adult to stand nearby.", type: "choice", options: [{ label: "Yes, with a helper nearby", detail: "I feel steady and have no new pain or dizziness", value: 0 }, { label: "No or not sure", detail: "Skip the test and arrange supported assessment", value: 1 }] },
      { id: "ageBand", text: "Choose your age group for the comparison.", help: "The age group is used only to select the published reference range.", type: "choice", options: [...ageBands.map(band => ({ label: `${band} years`, value: band })), { label: "Outside these ages / prefer no comparison", value: "none" }] },
      { id: "referenceSex", text: "Which published reference column should be used?", help: "The CDC table reports separate columns labelled women and men. This choice is only for that reference comparison.", type: "choice", options: [{ label: "Women’s reference", value: "women" }, { label: "Men’s reference", value: "men" }, { label: "Record my count without comparison", value: "none" }] },
      { id: "stands", text: "30-second chair stand", help: "Sit in the middle of the chair, feet flat, arms crossed at your chest. Stand fully upright, then sit fully. Your helper taps once after each complete stand. Stop immediately for pain, dizziness, unusual breathlessness or unsteadiness.", type: "chairStand" }
    ]
  },
  {
    id: "cognition", title: "Memory & orientation", short: "WHO ICOPE", time: "3 min", due: "Recommended annually", state: "Guided test", icon: "heart", tone: "blue",
    description: "Checks actual three-word recall, today’s date and current place.", source: "WHO ICOPE", sourceUrl: "https://www.who.int/publications/i/item/9789240103726",
    intro: "Take this in a quiet place. Do not use a calendar, phone, notes or hints. A trusted helper may operate the screen but should not supply answers.", memoryWords: ["Flower", "Door", "Rice"],
    questions: [
      { id: "orientationDate", text: "What is today’s full date?", help: "Enter the date from memory. Please do not check a phone, watch or calendar.", type: "date" },
      { id: "orientationPlace", text: "Where are you right now?", help: "Say or type a specific place, such as the health centre, village and district, or your home and town.", type: "place" },
      { id: "recall", text: "Type the three words you were asked to remember.", help: "Enter one word in each box. The order does not matter, but do not ask for hints.", type: "recall" }
    ]
  }
];

const chairStandMinimums = {
  "60–64": { men: 14, women: 12 }, "65–69": { men: 12, women: 11 }, "70–74": { men: 12, women: 10 },
  "75–79": { men: 11, women: 10 }, "80–84": { men: 10, women: 9 }, "85–89": { men: 8, women: 8 }, "90–94": { men: 7, women: 4 }
};

const normalise = value => String(value || "").trim().toLocaleLowerCase().replace(/[^a-z]/g, "");
const todayLocal = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};

export function scoreAssessment(id, answers) {
  if (id === "who5") {
    const raw = Object.values(answers).reduce((sum, value) => sum + Number(value), 0), score = raw * 4;
    return { score, max: 100, label: score >= 75 ? "High well-being" : score >= 50 ? "Moderate well-being" : "Low well-being signal", level: score < 50 ? "attention" : score < 75 ? "watch" : "good", summary: score < 50 ? "This WHO-5 result suggests that a supportive conversation and fuller assessment may be useful, especially if this is a change." : "This result can be used as a baseline and compared with future checks.", action: score < 50 ? "Tell someone you trust how you have been feeling and consider a professional check-in." : "Choose one activity that brings calm, connection or meaning today." };
  }
  if (id === "sleep") {
    const hours = Number(answers.hours || 0), concerns = Number(answers.rested || 0) + Number(answers.difficulty || 0), adequate = hours >= 7 && hours <= 9, flagged = !adequate || concerns > 0;
    return { score: hours, max: null, unit: "hours", label: !flagged ? "Reassuring sleep snapshot" : hours < 7 ? "Short sleep signal" : hours > 9 ? "Long sleep signal" : "Sleep quality signal", level: flagged ? "attention" : "good", summary: !flagged ? "Your reported sleep amount and quality were reassuring in this brief check." : "Your sleep amount or quality suggests that tracking the pattern and possible causes may be useful.", action: flagged ? "Keep a seven-day sleep diary and discuss persistent difficulty, loud snoring or daytime sleepiness with a clinician." : "Protect a regular sleep and wake time and continue monitoring how rested you feel." };
  }
  if (id === "nutrition") {
    const weight = Number(answers.weightLoss || 0), appetite = Number(answers.appetite || 0), uncertain = weight === 2 || appetite === 2, risk = weight === 1 || appetite === 1;
    return { score: null, max: null, label: risk ? "Nutrition follow-up recommended" : uncertain ? "A measurement would help" : "No decline flagged", level: risk || uncertain ? "attention" : "good", summary: risk ? "Unplanned weight loss or appetite loss was reported in this brief screen." : uncertain ? "One answer was uncertain, so the screen cannot confidently rule out nutrition decline." : "No weight or appetite decline was identified by this brief screen.", action: risk ? "Arrange a nutrition or primary-care review and track weight and appetite weekly." : uncertain ? "Measure and record your weight now and again in one month; ask a helper about changes in meal size." : "Continue regular balanced meals, hydration and periodic screening." };
  }
  if (id === "mobility") {
    if (Number(answers.safe) === 1) return { score: null, max: null, label: "Supported assessment advised", level: "attention", summary: "You chose not to attempt the chair-stand test. That is the right choice whenever safety is uncertain.", action: "Ask a clinician, physiotherapist or trained helper to assess strength, balance and fall risk safely." };
    const test = answers.stands || {}, count = Number(test.count || 0);
    if (test.usedArms) return { score: 0, max: null, unit: "stands", label: "Arm support was needed", level: "attention", summary: "The CDC protocol records zero when the arms are used to stand. This does not diagnose weakness, but a supported review would be useful.", action: "Discuss leg strength, balance and fall risk with a health professional before changing exercise." };
    if (test.stopped) return { score: count, max: null, unit: "stands before stopping", label: "Test stopped for safety", level: "attention", summary: "The test was stopped early, so the count should not be compared with the 30-second reference table.", action: "If you had pain, dizziness, breathlessness or unsteadiness, seek appropriate clinical advice before repeating the test." };
    const minimum = chairStandMinimums[answers.ageBand]?.[answers.referenceSex];
    if (!minimum) return { score: count, max: null, unit: "stands", label: `${count} complete stands recorded`, level: "watch", summary: "Your 30-second count was saved without an age- and sex-reference comparison.", action: "Share the count with a health professional if standing, walking or balance has become harder." };
    const below = count < minimum;
    return { score: count, max: null, unit: "stands", label: below ? "Below the CDC reference" : "At or above the CDC reference", level: below ? "attention" : "good", summary: `You completed ${count} stand${count === 1 ? "" : "s"}. The published below-average cut-off for the selected group is fewer than ${minimum}.`, action: below ? "Arrange a fuller strength, balance and fall-risk assessment with a qualified professional." : "Continue safe strength and balance activity appropriate for your health and ability." };
  }
  const recalled = Array.isArray(answers.recall) ? answers.recall.map(normalise) : [];
  const targets = ["flower", "door", "rice"];
  const recallCount = targets.filter(word => recalled.includes(word)).length;
  const dateCorrect = answers.orientationDate === todayLocal();
  const placeCorrect = Boolean(String(answers.orientationPlace?.text || "").trim()) && answers.orientationPlace?.verification !== "incorrect";
  const flagged = recallCount < 3 || !dateCorrect || !placeCorrect;
  const missed = [recallCount < 3 && `${3 - recallCount} memory word${3 - recallCount === 1 ? "" : "s"}`, !dateCorrect && "today’s date", !placeCorrect && "current place"].filter(Boolean);
  return { score: recallCount, max: 3, unit: "words recalled", label: flagged ? "Follow-up may be useful" : "Screen completed without a flag", level: flagged ? "attention" : "good", summary: flagged ? `This screen did not confirm ${missed.join(" and ")}. Many temporary factors can affect performance, so this is not a diagnosis.` : "All three words, today’s date and the current place were recorded correctly in this brief screen.", action: flagged ? "Repeat once when rested in a quiet setting. If the difficulty is new, worsening or repeated, arrange a professional assessment." : "Support brain health with movement, good sleep, social connection and activities that keep you learning." };
}

export function buildCombinedGuidance(results) {
  const completed = Object.entries(results).map(([id, result]) => ({ ...result, id }));
  const attention = completed.filter(item => item.level === "attention");
  if (!completed.length) return null;
  return { confidence: Math.min(92, 55 + completed.length * 9), headline: attention.length ? `${attention.length} area${attention.length > 1 ? "s" : ""} worth following up` : "Your completed screens look reassuring", summary: attention.length ? "SLEDSS found screening signals that deserve context or professional follow-up. They are not diagnoses." : "No decline was flagged in your completed screens. Continue tracking change over time.", actions: [...new Set(completed.map(item => item.action))].slice(0, 3), evidence: completed.map(item => ({ label: assessmentCatalog.find(a => a.id === item.id)?.title, result: item.label })) };
}
