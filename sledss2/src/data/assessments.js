export const frequencyOptions = [
  { label: "At no time", value: 0 }, { label: "Some of the time", value: 1 },
  { label: "Less than half the time", value: 2 }, { label: "More than half the time", value: 3 },
  { label: "Most of the time", value: 4 }, { label: "All of the time", value: 5 }
];

export const assessmentCatalog = [
  { id:"who5", title:"Mental well-being", short:"WHO-5", description:"Five questions about positive well-being over the last two weeks.", time:"2 min", due:"Recommended monthly", state:"Validated", icon:"stress", tone:"purple", source:"World Health Organization", sourceUrl:"https://www.who.int/publications/m/item/WHO-UCN-MSD-MHE-2024.01",
    intro:"Think about how you have felt during the past two weeks.", questions:[
      "I have felt cheerful and in good spirits.", "I have felt calm and relaxed.", "I have felt active and vigorous.",
      "I woke up feeling fresh and rested.", "My daily life has been filled with things that interest me."
    ].map((text,index)=>({id:`w${index+1}`,text,type:"choice",options:frequencyOptions})) },
  { id:"sleep", title:"Sleep health snapshot", short:"CDC calibrated", description:"Measures sleep duration, restfulness and common sleep difficulties.", time:"2 min", due:"Recommended weekly", state:"Calibrated", icon:"sleep", tone:"blue", source:"CDC Sleep Health", sourceUrl:"https://www.cdc.gov/sleep/about/index.html",
    intro:"Answer for your usual sleep during the last seven days. Adults 65 and older generally need 7–8 hours; sleep quality also matters.", questions:[
      {id:"hours",text:"On average, how many hours did you sleep in a 24-hour period?",type:"number",unit:"hours",min:1,max:16},
      {id:"rested",text:"Did you usually wake feeling rested?",type:"choice",options:[{label:"Yes",value:0},{label:"Sometimes",value:1},{label:"No",value:2}]},
      {id:"difficulty",text:"Did you regularly have trouble falling asleep or staying asleep?",type:"choice",options:[{label:"No",value:0},{label:"Yes",value:1}]}
    ] },  { id:"nutrition", title:"Nutrition & vitality", short:"WHO ICOPE", description:"Checks recent weight loss and appetite—early signals of nutrition risk.", time:"2 min", due:"Recommended every 3 months", state:"Validated", icon:"nutrition", tone:"green", source:"WHO ICOPE", sourceUrl:"https://iris.who.int/bitstream/handle/10665/326843/WHO-FWC-ALC-19.1-eng.pdf",
    intro:"Answer based on the last three months. This is a screen, not a diagnosis.", questions:[
      {id:"weightLoss",text:"Have you unintentionally lost more than 3 kg (about 6.6 lb) during the last three months?",type:"choice",options:[{label:"No",value:0},{label:"Yes",value:1},{label:"I’m not sure",value:1}]},
      {id:"appetite",text:"Have you experienced a loss of appetite?",type:"choice",options:[{label:"No",value:0},{label:"Yes",value:1}]}
    ] },
  { id:"mobility", title:"Mobility & strength", short:"WHO ICOPE", description:"A guided five-chair-rise screen for lower-body mobility.", time:"3 min", due:"Recommended every 3 months", state:"Guided test", icon:"activity", tone:"coral", source:"WHO ICOPE", sourceUrl:"https://iris.who.int/bitstream/handle/10665/326843/WHO-FWC-ALC-19.1-eng.pdf",
    intro:"Use a firm chair against a wall. Have someone nearby if you feel unsteady. Stop for pain, dizziness or breathlessness.", safety:true, questions:[
      {id:"safe",text:"Can you stand from a chair safely without using your arms?",type:"choice",options:[{label:"Yes, I can test safely",value:0},{label:"No / I am not sure",value:1}]},
      {id:"seconds",text:"Time five complete chair rises without using your arms. Enter the number of seconds.",type:"number",unit:"seconds",min:1,max:120,optionalWhen:"safe"}
    ] },
  { id:"cognition", title:"Memory & orientation", short:"WHO ICOPE", description:"A private three-word recall and orientation screen.", time:"3 min", due:"Recommended annually", state:"Guided test", icon:"heart", tone:"blue", source:"WHO ICOPE", sourceUrl:"https://iris.who.int/bitstream/handle/10665/326843/WHO-FWC-ALC-19.1-eng.pdf",
    intro:"This short screen can be affected by language, education, hearing, stress and fatigue. A result never diagnoses dementia.", memoryWords:["Flower","Door","Rice"], questions:[
      {id:"orientation",text:"Without checking a phone or calendar, are you clear about today’s full date and where you are now?",type:"choice",options:[{label:"Yes, both are clear",value:0},{label:"I missed one or both",value:1}]},
      {id:"recall",text:"After the short distraction, how many of the three words can you recall?",type:"choice",options:[{label:"All 3 words",value:0},{label:"2 words",value:1},{label:"1 word",value:2},{label:"No words",value:3}]}
    ] }
];

export function scoreAssessment(id, answers) {
  if(id==="who5"){
    const raw=Object.values(answers).reduce((sum,value)=>sum+Number(value),0), score=raw*4;
    return {score,max:100,label:score>=75?"High well-being":score>=50?"Moderate well-being":"Low well-being signal",level:score<50?"attention":score<75?"watch":"good",summary:score<50?"Your result suggests a useful conversation with a qualified health professional, especially if this reflects a change.":"Keep supporting the routines and relationships that help you feel well.",action:score<50?"Reach out to someone you trust and consider arranging a professional check-in.":"Choose one activity that brings calm, connection or meaning today."};
  }
  if(id==="sleep"){
    const hours=Number(answers.hours||0), concerns=Number(answers.rested||0)+Number(answers.difficulty||0), adequate=hours>=7&&hours<=9, flagged=!adequate||concerns>0;
    return {score:hours,max:null,label:!flagged?"Healthy sleep snapshot":hours<7?"Short sleep signal":hours>9?"Long sleep signal":"Sleep quality signal",level:flagged?"attention":"good",summary:!flagged?"Your reported duration and quality align with a healthy sleep pattern.":"Your duration or sleep quality suggests that tracking patterns and causes may be useful.",action:flagged?"Keep a seven-day sleep diary and discuss persistent sleep difficulty, loud snoring or daytime sleepiness with a clinician.":"Protect a regular sleep and wake time and continue monitoring how rested you feel."};
  }  if(id==="nutrition"){
    const risk=Number(answers.weightLoss||0)+Number(answers.appetite||0);
    return {score:risk,max:2,label:risk===0?"No decline flagged":risk===1?"One nutrition signal":"Two nutrition signals",level:risk?"attention":"good",summary:risk?"WHO ICOPE recommends fuller assessment when weight loss or appetite loss is present.":"No nutrition decline was identified by this brief screen.",action:risk?"Arrange a nutrition or primary-care review and track weight and appetite weekly.":"Continue regular balanced meals, hydration and periodic screening."};
  }
  if(id==="mobility"){
    const unsafe=Number(answers.safe)===1, seconds=Number(answers.seconds||0), flagged=unsafe||!seconds||seconds>14;
    return {score:unsafe?null:seconds,max:null,label:unsafe?"Supported assessment advised":seconds<=14?"Screen passed":"Mobility signal detected",level:flagged?"attention":"good",summary:unsafe?"Do not attempt the chair-rise test alone.":seconds<=14?"You completed five rises within the WHO ICOPE screening threshold.":"Taking more than 14 seconds indicates that fuller mobility assessment may be useful.",action:flagged?"Discuss strength, balance and fall risk with a health professional before changing exercise.":"Maintain regular strength and balance activity appropriate for you."};
  }
  const flagged=Number(answers.orientation)>0||Number(answers.recall)>0;
  return {score:3-Number(answers.recall||0),max:3,label:flagged?"Follow-up may be useful":"No decline flagged",level:flagged?"attention":"good",summary:flagged?"WHO ICOPE recommends fuller assessment when orientation or three-word recall is not completed.":"No cognitive decline was identified by this brief screen.",action:flagged?"Repeat when rested and arrange a professional review if this is new or persistent.":"Keep supporting sleep, learning, movement and social connection."};
}

export function buildCombinedGuidance(results){
  const completed=Object.entries(results).map(([id,result])=>({...result,id}));
  const attention=completed.filter(item=>item.level==="attention");
  if(!completed.length)return null;
  return {confidence:Math.min(92,55+completed.length*9),headline:attention.length?`${attention.length} area${attention.length>1?"s":""} worth following up`:`Your completed screens look reassuring`,summary:attention.length?"SLEDSS found screening signals that deserve context or professional follow-up. They are not diagnoses.":"No decline was flagged in your completed screens. Continue tracking change over time.",actions:[...new Set(completed.map(item=>item.action))].slice(0,3),evidence:completed.map(item=>({label:assessmentCatalog.find(a=>a.id===item.id)?.title,result:item.label}))};
}

