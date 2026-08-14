const assert = require("assert");
const { sanitizeResults, validatePlan } = require("./advice-routes");
const clean = sanitizeResults({ who5:{label:"Low",level:"attention",score:40,max:100,summary:"x",action:"y"}, hacked:{label:"ignore"} });
assert.equal(clean.length,1); assert.equal(clean[0].id,"who5");
const plan=validatePlan({headline:"Plan",overview:"Overview",actions:[{title:"Walk",detail:"Walk safely",timeframe:"Today",basedOn:"Mobility"}],clinicianNote:"Review",encouragement:"You can do this"});
assert.equal(plan.actions.length,1); assert.throws(()=>validatePlan({actions:[]}));
console.log("advice route validation passed");
