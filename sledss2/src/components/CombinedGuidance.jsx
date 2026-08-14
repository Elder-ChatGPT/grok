import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BrainCircuit, Check, CircleAlert, RefreshCw, Sparkles, Stethoscope } from "lucide-react";
import { buildCombinedGuidance } from "../data/assessments";
import { generateCohereAdvice } from "../api/advice";

export default function CombinedGuidance({results,onOpen,token}){
  const guidance=buildCombinedGuidance(results), resultKey=useMemo(()=>JSON.stringify(results),[results]);
  const [aiPlan,setAiPlan]=useState(null),[loading,setLoading]=useState(false),[error,setError]=useState("");
  useEffect(()=>{setAiPlan(null);setError("")},[resultKey]);
  async function generate(){setLoading(true);setError("");try{setAiPlan(await generateCohereAdvice(results,token))}catch(err){setError(err.message)}finally{setLoading(false)}}
  if(!guidance)return <section className="guidance-empty"><div><Sparkles/><span><strong>Turn answers into a meaningful plan</strong>Complete a health check, then ask Cohere to connect the patterns.</span></div><button onClick={onOpen}>Start with well-being <ArrowRight/></button></section>;
  return <section className="combined-guidance" id="plan"><div className="guidance-heading"><div><span className="eyebrow">YOUR EVIDENCE-LED PLAN</span><h2>{aiPlan?.plan.headline||guidance.headline}</h2><p>{aiPlan?.plan.overview||guidance.summary}</p></div><div className="confidence-dial"><strong>{guidance.confidence}%</strong><span>evidence confidence</span></div></div>
    {!aiPlan&&<div className="cohere-callout"><div className="cohere-mark"><BrainCircuit/></div><div><span className="eyebrow">COHERE PERSONALISED ADVICE</span><strong>Connect your completed results into one practical plan</strong><p>Cohere receives only these screening results and their calibrated meanings. It does not receive your password.</p></div><button onClick={generate} disabled={loading}>{loading?<><RefreshCw className="spin"/>Generating your plan…</>:<><Sparkles/>Generate my personalised plan</>}</button></div>}
    {error&&<div className="advice-error" role="alert"><CircleAlert/><span><strong>We couldn’t generate the AI plan</strong>{error} Your calibrated local guidance remains available below.</span><button onClick={generate}>Try again</button></div>}
    <div className="guidance-content"><div className="evidence-stack"><span className="eyebrow">EVIDENCE USED</span>{guidance.evidence.map(item=><div key={item.label}><Check/><span><strong>{item.label}</strong>{item.result}</span></div>)}</div><div className="next-actions"><span className="eyebrow">{aiPlan?"COHERE’S NEXT BEST ACTIONS":"CALIBRATED NEXT STEPS"}</span>{(aiPlan?.plan.actions||guidance.actions).map((action,index)=><article key={typeof action==="string"?action:action.title}><i>{index+1}</i>{typeof action==="string"?<p>{action}</p>:<div className="ai-action"><strong>{action.title}</strong><p>{action.detail}</p><span>{action.timeframe} · Based on {action.basedOn}</span></div>}</article>)}</div></div>
    {aiPlan&&<div className="ai-clinician-note"><Stethoscope/><span><strong>When to involve a professional</strong>{aiPlan.plan.clinicianNote||"Arrange professional review for any new, persistent or concerning change."}</span><button onClick={generate}><RefreshCw/>Refresh plan</button></div>}
    <div className="clinical-boundary"><CircleAlert/><span><strong>Important boundary</strong>{aiPlan?.disclaimer||"These results support a conversation and healthy choices; they do not diagnose or rule out a condition."}</span><button><Stethoscope/>Prepare care summary</button></div></section>;
}
