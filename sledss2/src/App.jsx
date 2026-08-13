import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity, ArrowRight, BatteryMedium, Bell, Brain, CalendarDays,
  Check, ChevronRight, CircleHelp, Clock3, Footprints, HeartPulse, Home,
  Leaf, LogOut, Menu, MoonStar, MoreHorizontal, PlugZap, Salad, Settings, ShieldCheck,
  Sparkles, Stethoscope, SunMedium, UserRound, Users, Watch, Wifi, X
} from "lucide-react";
import "./App.css";
import heroImage from "./assets/sledss-inclusive-hero.png";
import { buildWellnessProfile, domains, trendData } from "./data/healthModel";
import AuthScreen from "./components/AuthScreen";
import AssessmentStudio from "./components/AssessmentStudio";
import CombinedGuidance from "./components/CombinedGuidance";
import { assessmentCatalog } from "./data/assessments";
import { clearSession, getMe, saveSession, savedSession } from "./api/auth";

const iconMap = { activity: Footprints, sleep: MoonStar, stress: Brain, nutrition: Salad, social: Users, heart: HeartPulse };

function Brand() {
  return <div className="brand"><div className="brand-mark"><Leaf size={21} strokeWidth={2.4} /></div><div><strong>SLEDSS</strong><span>Live well. Age boldly.</span></div></div>;
}

function Header({ onMenu, user, onLogout, onNotify }) {
  const [accountOpen,setAccountOpen]=useState(false); const [noticesOpen,setNoticesOpen]=useState(false);
  return <header className="topbar"><button className="icon-button mobile-only" onClick={onMenu} aria-label="Open menu"><Menu /></button><Brand />
    <nav className="topnav"><a href="#overview">Overview</a><a href="#insights">Insights</a><a href="#assessments">Assessments</a><a href="#devices">Devices</a></nav>
    <div className="header-actions"><div className="menu-anchor"><button className="icon-button" aria-label="Notifications" aria-expanded={noticesOpen} onClick={()=>{setNoticesOpen(!noticesOpen);setAccountOpen(false)}}><Bell size={20}/><i /></button>{noticesOpen&&<div className="header-popover notification-popover"><span className="eyebrow">NOTIFICATIONS</span><strong>Youâ€™re all caught up</strong><p>Weâ€™ll let you know when a check or sensor needs attention.</p></div>}</div><div className="menu-anchor"><button className="avatar" onClick={()=>{setAccountOpen(!accountOpen);setNoticesOpen(false)}} aria-label="Open account menu" aria-expanded={accountOpen}>{initials(user)}</button>{accountOpen&&<div className="header-popover account-popover"><div><span className="avatar small">{initials(user)}</span><p><strong>{user?.firstName || "Angela"}</strong><small>{user?.email}</small></p></div><button onClick={()=>{setAccountOpen(false);onNotify("Profile preferences will be available in the next release.")}}><UserRound/>Profile & preferences</button><button onClick={onLogout}><LogOut/>Sign out</button></div>}</div></div>
  </header>;
}

const initials = user => (user?.firstName || "Angela").split(/\s+/).map(v=>v[0]).join("").slice(0,2).toUpperCase();
function Sidebar({ open, setOpen, active, setActive, user, onNotify }) {
  const items = [
    ["overview", Home, "Today"], ["insights", Sparkles, "My insights"],
    ["assessments", Stethoscope, "Health checks"], ["devices", Watch, "My sensors"]
  ];
  return <><aside className={`sidebar ${open ? "open" : ""}`}>
    <button className="close-menu mobile-only" onClick={() => setOpen(false)}><X/></button>
    <div className="profile"><div className="avatar large">{initials(user)}</div><div><strong>{user?.firstName || "Angela M."}</strong><span>Member since 2026</span></div></div>
    <p className="eyebrow nav-label">MY HEALTH</p>
    <nav>{items.map(([id, Icon, label]) => <a key={id} className={active === id ? "active" : ""} href={`#${id}`} onClick={() => {setActive(id); setOpen(false)}}><Icon size={19}/>{label}</a>)}</nav>
    <div className="sidebar-spacer" />
    <div className="privacy-card"><ShieldCheck size={22}/><strong>Your data, protected</strong><span>You choose what to share and with whom.</span><button onClick={()=>onNotify("Privacy controls will open here once sharing is enabled.")}>Privacy controls <ChevronRight size={15}/></button></div>
    <nav className="secondary"><a href="#help" onClick={e=>{e.preventDefault();onNotify("Help centre is being prepared.")}}><CircleHelp size={18}/>Help & support</a><a href="#settings" onClick={e=>{e.preventDefault();onNotify("Settings are coming in the next release.")}}><Settings size={18}/>Settings</a></nav>
  </aside>{open && <button className="scrim" onClick={() => setOpen(false)} aria-label="Close menu"/>}</>;
}

function ScoreRing({ score }) {
  return <div className="score-ring" style={{"--score": `${score * 3.6}deg`}}><div><strong>{score}</strong><span>out of 100</span></div></div>;
}

function Hero({ profile, onCheckIn, user }) {
  const date = new Intl.DateTimeFormat("en",{weekday:"long",day:"numeric",month:"long"}).format(new Date());
  return <section className="hero-card" id="overview">
    <img src={heroImage} alt="A Black woman and White man enjoying a morning wellness walk together" />
    <div className="hero-shade" />
    <div className="hero-copy"><span className="live-pill"><i/> SLEDSS LIVE</span><p className="hero-kicker">{date}</p><h1>Good morning, {user?.firstName || "Angela"}.</h1><p>Your signals look steady. One small action today could lift your sleep and energy.</p><button className="primary-button" onClick={onCheckIn}>Start todayâ€™s check-in <ArrowRight size={17}/></button></div>
    <div className="hero-score"><ScoreRing score={profile.score}/><p><strong>{profile.label}</strong><span>+{profile.change} from last week</span></p></div>
  </section>;
}

function SignalCard({ domain }) {
  const Icon = iconMap[domain.id];
  return <article className="signal-card"><div className={`signal-icon ${domain.tone}`}><Icon size={20}/></div><button className="more" aria-label="More options"><MoreHorizontal/></button><p>{domain.label}</p><div className="signal-value"><strong>{domain.value}</strong><span>{domain.unit}</span></div><div className="signal-meta"><span className={domain.status === "Improve" ? "warn" : "good"}>{domain.status}</span><small>{domain.source}</small></div><div className="mini-bars">{domain.history.map((v,i) => <i key={i} style={{height:`${v}%`}} className={i === domain.history.length-1 ? "latest" : ""}/>)}</div></article>;
}

function InsightCard({ profile, onNotify }) {
  return <section className="panel insight-panel" id="insights"><div className="panel-heading"><div><span className="eyebrow">SLEDSS INSIGHT</span><h2>Your signals tell a story</h2></div><div className="ai-badge"><Sparkles size={16}/> Evidence-led</div></div>
    <div className="insight-body"><div className="insight-orb"><MoonStar size={27}/><span>Sleep</span><strong>6h 42m</strong></div><div className="story"><h3>A calmer evening may unlock better recovery.</h3><p>Your wearable shows later bedtimes on days with higher self-reported stress. Your activity is strong, so the highest-impact next step is protecting a consistent wind-down window.</p><div className="evidence"><span><Watch size={15}/> Wearable Â· 14 nights</span><span><Brain size={15}/> Stress check Â· today</span><span>{profile.confidence}% confidence</span></div><div className="action-row"><div className="action-icon"><Clock3/></div><div><strong>Tonightâ€™s small step</strong><span>Begin your wind-down at 9:30 PM</span></div><button onClick={() => onNotify("Reminder set for 9:30 PM")}>Set reminder</button></div></div></div>
    <div className="explain"><ShieldCheck size={16}/><span>This guidance combines your validated questionnaire results and sensor trends. It is wellness support, not a medical diagnosis.</span><button onClick={()=>onNotify("This insight uses sleep duration, stress answers and recent activity trends.")}>Why this advice?</button></div>
  </section>;
}

function TrendChart() {
  const points = trendData.map((v,i) => `${i * 70},${110-v}`).join(" ");
  return <section className="panel trend-panel"><div className="panel-heading"><div><span className="eyebrow">30-DAY TREND</span><h2>Wellbeing is moving up</h2></div><select aria-label="Chart period"><option>Last 30 days</option><option>Last 7 days</option></select></div>
    <div className="chart-wrap"><div className="chart-summary"><strong>+8%</strong><span>since 14 July</span></div><svg viewBox="0 0 420 130" role="img" aria-label="Wellbeing score increased over 30 days"><defs><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ed755d" stopOpacity=".28"/><stop offset="1" stopColor="#ed755d" stopOpacity="0"/></linearGradient></defs><path d={`M ${points} L 420,130 L 0,130 Z`} fill="url(#fill)"/><polyline points={points} fill="none" stroke="#df664f" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>{trendData.map((v,i)=><circle key={i} cx={i*70} cy={110-v} r={i===trendData.length-1?6:3} fill="#fff" stroke="#df664f" strokeWidth="3"/>)}</svg><div className="chart-labels"><span>14 Jul</span><span>21 Jul</span><span>28 Jul</span><span>4 Aug</span><span>Today</span></div></div>
  </section>;
}

function AssessmentCard({ item, onStart }) {
  const Icon = iconMap[item.icon] || Activity;
  return <article className="assessment-card"><div className={`assessment-icon ${item.tone}`}><Icon/></div><div><div className="assessment-top"><strong>{item.title}</strong><span>{item.state}</span></div><p>{item.description}</p><div className="assessment-meta"><span><Clock3 size={14}/>{item.time}</span><span><CalendarDays size={14}/>{item.due}</span></div></div><button onClick={() => onStart(item)}>{item.state === "Complete" ? "Review" : "Start"}<ChevronRight size={17}/></button></article>;
}

function SensorHub({ sensors, onToggle }) {
  return <section className="panel sensor-panel" id="devices"><div className="panel-heading"><div><span className="eyebrow">SENSOR HUB</span><h2>Connected health signals</h2></div><button className="outline-button" onClick={()=>onToggle(sensors.find(sensor=>!sensor.connected)?.id || sensors[0].id)}><PlugZap size={16}/> Add a device</button></div>
    <div className="sensor-grid">{sensors.map(sensor => <article key={sensor.id} className={sensor.connected ? "connected" : ""}><div className="device-icon">{sensor.id === "watch" ? <Watch/> : sensor.id === "scale" ? <Activity/> : <HeartPulse/>}</div><div><strong>{sensor.name}</strong><span>{sensor.connected ? `Synced ${sensor.synced}` : "Ready for future hardware"}</span></div><div className="device-status">{sensor.connected ? <><Wifi size={15}/><BatteryMedium size={18}/>{sensor.battery}%</> : <span>Not connected</span>}</div><button onClick={() => onToggle(sensor.id)}>{sensor.connected ? "Manage" : "Connect"}</button></article>)}</div>
    <div className="pipeline"><span>RAW SIGNAL</span><ArrowRight/><span>QUALITY CHECK</span><ArrowRight/><span>PERSONAL BASELINE</span><ArrowRight/><span>COMBINED INSIGHT</span><ArrowRight/><span>ACTION</span></div>
  </section>;
}

function CheckInModal({ onClose, onSave }) {
  const [values,setValues] = useState({energy:7,mood:8,stress:4});
  const closeRef=useRef(null);
  useEffect(()=>{closeRef.current?.focus();const handler=event=>event.key==="Escape"&&onClose();window.addEventListener("keydown",handler);return()=>window.removeEventListener("keydown",handler)},[onClose]);
  return <div className="modal-backdrop" onMouseDown={event=>event.target===event.currentTarget&&onClose()}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="checkin-title"><button ref={closeRef} className="modal-close" onClick={onClose} aria-label="Close check-in"><X/></button><span className="eyebrow">60-SECOND CHECK-IN</span><h2 id="checkin-title">How are you feeling today?</h2><p>Your answers add human context to your sensor readings.</p>{Object.entries(values).map(([key,value]) => <label key={key}><span><b>{key}</b><strong>{value}/10</strong></span><input aria-label={`${key}: ${value} out of 10`} type="range" min="1" max="10" value={value} onChange={e=>setValues({...values,[key]:Number(e.target.value)})}/></label>)}<button className="primary-button wide" onClick={()=>onSave(values)}>Save todayâ€™s check-in <Check size={17}/></button></div></div>;
}

function App() {
  const [session,setSession] = useState(savedSession);
  const [checkingSession,setCheckingSession]=useState(Boolean(savedSession()?.token)); const [toast,setToast]=useState("");
  const [menuOpen,setMenuOpen] = useState(false); const [active,setActive] = useState("overview"); const [checkIn,setCheckIn] = useState(null); const [modal,setModal] = useState(false);
  const [assessmentOpen,setAssessmentOpen]=useState(null); const [assessmentResults,setAssessmentResults]=useState(()=>{try{return JSON.parse(localStorage.getItem("sledss_assessments"))||{}}catch{return {}}});
  const [sensors,setSensors] = useState([{id:"watch",name:"SLEDSS Band",connected:true,synced:"8 min ago",battery:74},{id:"scale",name:"Smart body scale",connected:true,synced:"this morning",battery:91},{id:"heart",name:"Clinical sensors",connected:false,battery:0}]);
  const profile = useMemo(()=>buildWellnessProfile(checkIn,sensors),[checkIn,sensors]);
  useEffect(()=>{ if(session?.token){ getMe(session.token).then(({user})=>setSession(current=>({...current,user}))).catch(()=>{clearSession();setSession(null)}).finally(()=>setCheckingSession(false)) } else setCheckingSession(false) },[]); // Validate restored sessions once.
  useEffect(()=>{if(!toast)return;const id=setTimeout(()=>setToast(""),3500);return()=>clearTimeout(id)},[toast]);
  const notify=message=>setToast(message);
  const saveAssessment=(id,result)=>{const next={...assessmentResults,[id]:result};setAssessmentResults(next);localStorage.setItem("sledss_assessments",JSON.stringify(next));notify("Assessment completed and added to your health picture.")};
  const saveCheckIn = values => {setCheckIn(values);setModal(false);notify("Todayâ€™s check-in has been added to your health picture.")};
  const toggleSensor = id => {setSensors(sensors.map(s=>s.id===id?{...s,connected:true,synced:"just now",battery:s.battery||100}:s));notify("Sensor connection is ready.")};
  const authenticate = (data,remember) => { saveSession(data,remember); setSession(data); };
  const logout = () => { clearSession(); setSession(null); };
  const demo = () => setSession({demo:true,user:{firstName:"Angela",email:"demo@sledss.health"}});
  if(checkingSession)return <div className="session-loader"><Brand/><span className="loader-ring"/><p>Preparing your health pictureâ€¦</p></div>;
  if (!session) return <AuthScreen onAuthenticated={authenticate} onDemo={demo}/>;
  return <div className="app-shell"><Header onMenu={()=>setMenuOpen(true)} user={session.user} onLogout={logout} onNotify={notify}/><Sidebar open={menuOpen} setOpen={setMenuOpen} active={active} setActive={setActive} user={session.user} onNotify={notify}/><main>
    <div className="content"><Hero profile={profile} onCheckIn={()=>setModal(true)} user={session.user}/>
      <section className="signals-section"><div className="section-title"><div><span className="eyebrow">TODAY AT A GLANCE</span><h2>Your health signals</h2></div><button onClick={()=>notify("All available signals are shown below.")}>View all signals <ArrowRight size={16}/></button></div><div className="signals-grid">{domains.map(d=><SignalCard key={d.id} domain={d}/>)}</div></section>
      <div className="two-column"><InsightCard profile={profile} onNotify={notify}/><TrendChart/></div>
      <section id="assessments" className="assessments-section"><div className="section-title"><div><span className="eyebrow">VALIDATED HEALTH CHECKS</span><h2>Measure what matters today</h2><p>Published screening methods, explained in plain language and scored transparently.</p></div><span className="assessment-count">{Object.keys(assessmentResults).length} of {assessmentCatalog.length} complete</span></div><div className="assessment-grid validated-grid">{assessmentCatalog.map(item=><AssessmentCard key={item.id} item={{...item,state:assessmentResults[item.id]?"Complete":item.state}} onStart={()=>setAssessmentOpen(item)}/>)}</div></section>
      <CombinedGuidance results={assessmentResults} token={session.token} onOpen={()=>setAssessmentOpen(assessmentCatalog[0])}/>
      <SensorHub sensors={sensors} onToggle={toggleSensor}/>
      <section className="care-strip"><div className="care-icon"><SunMedium/></div><div><strong>Designed for daily wellbeing, connected to real care.</strong><span>Share a plain-language summary with a trusted family member or health professional when you choose.</span></div><button className="outline-button" onClick={()=>notify("Your health summary is being prepared.")}>Create health summary</button></section>
      <footer><Brand/><p>Wellness guidance that respects the whole person.</p><span>Â© 2026 SLEDSS Â· Privacy Â· Clinical safety Â· Accessibility</span></footer>
    </div></main>{modal&&<CheckInModal onClose={()=>setModal(false)} onSave={saveCheckIn}/>} {assessmentOpen&&<AssessmentStudio assessment={assessmentOpen} existing={assessmentResults[assessmentOpen.id]} onClose={()=>setAssessmentOpen(null)} onComplete={saveAssessment}/>}<div className={`toast ${toast?"show":""}`} role="status"><Check/>{toast}</div></div>;
}

export default App;


