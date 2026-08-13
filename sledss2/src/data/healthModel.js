export const domains = [
  { id:"activity",label:"Daily movement",value:"6,842",unit:"steps",status:"On track",source:"SLEDSS Band",tone:"coral",history:[35,48,43,67,58,76,71] },
  { id:"sleep",label:"Sleep",value:"6h 42m",unit:"last night",status:"Improve",source:"Wearable + check-in",tone:"blue",history:[68,55,60,46,72,50,58] },
  { id:"stress",label:"Stress balance",value:"72",unit:"/ 100",status:"Steady",source:"Check-in + HRV",tone:"purple",history:[46,52,63,57,66,62,72] },
  { id:"nutrition",label:"Nutrition",value:"12",unit:"/ 14",status:"On track",source:"MNA screening",tone:"green",history:[55,58,58,65,70,70,78] }
];

export const trendData = [36,43,39,56,59,67,74];

export function buildWellnessProfile(checkIn, sensors) {
  const connected = sensors.filter(sensor => sensor.connected).length;
  if (!checkIn) return { score:78, label:"Steady wellbeing", change:4, confidence:connected > 1 ? 82 : 68 };
  const subjective = (checkIn.energy + checkIn.mood + (11-checkIn.stress)) / 3;
  const score = Math.round(58 + subjective * 2.8 + connected * 1.5);
  return { score:Math.min(96,score), label:score >= 82 ? "Strong wellbeing" : "Steady wellbeing", change:Math.max(1,Math.round(subjective-4)), confidence:Math.min(94,72+connected*6) };
}
