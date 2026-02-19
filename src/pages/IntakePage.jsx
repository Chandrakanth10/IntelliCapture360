import { useEffect, useMemo, useRef, useState } from 'react';
import {
  BANNERS,
  BUS,
  CAMPS,
  CH_LEADS,
  CH_OPTS,
  FieldErr,
  I,
  MEDIA_FIELDS,
  MKT_CH,
  MKT_RES,
  Tip,
} from '../shared/campaignShared';

const INIT_FD={projectName:'',projectDesc:'',bu:'',banners:[],byName:'',byLdap:'',mr:'',rep:'',pri:'',roiRevenue:'',roiEngagement:'',year:'',quarter:'',period:'',week:'',targetDate:'',chSupport:[],chLeadOverrides:{},mktCh:[],campType:'',audBanner:'',segDef:'',targetCriteria:'',merchFiles:[],brandAssets:'',creativeType:'',creativeFiles:[],vendorGuide:null,isanScripts:null,amcGuidance:null};

/* ═══ SECTION HEADER ═══ */
const SectionHeader=({icon,title,desc})=>(
  <div className="flex items-center gap-2.5 mb-3">
    <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{background:'rgba(62,207,142,0.08)'}}>
      <I n={icon} s={12} c="text-[#3ECF8E]"/>
    </div>
    <div>
      <h4 className="text-[12px] font-semibold text-[#ededed] leading-tight">{title}</h4>
      {desc&&<p className="text-[11px] text-[#666] mt-0.5 leading-relaxed">{desc}</p>}
    </div>
  </div>
);

const STEP_GROUPS=[
  {label:'GETTING STARTED',steps:[0,1]},
  {label:'PLANNING',steps:[2,3,4]},
  {label:'CHANNELS & CONTENT',steps:[5,6,7,8]},
  {label:'SUBMIT',steps:[9]},
];

/* ═══ SHARED STYLE CONSTANTS ═══ */
const ic=(hasErr,hasSuccess)=>`w-full px-3 py-[9px] rounded-md text-[13px] outline-none transition-all ${hasErr?'field-error':hasSuccess?'field-success':''}`;
const lc="flex items-center gap-1.5 text-[12px] font-semibold text-[#ccc] mb-1.5";
const hint="text-[11px] text-[#666] mt-1 leading-relaxed";

/* ═══ FIELD WRAPPER ═══ */
const Field=({label,required,hintText,tooltip,error,errorMsg,children,className=''})=>(
  <div className={className}>
    <label className={lc}>
      {label}{required&&<span className="text-[#f43f5e] text-[11px]">*</span>}
      {tooltip&&<Tip text={tooltip}><span className="text-[#555] hover:text-[#888] cursor-help transition-colors"><I n="info" s={12}/></span></Tip>}
    </label>
    {children}
    {hintText&&!error&&<p className={hint}>{hintText}</p>}
    <FieldErr show={error} msg={errorMsg}/>
  </div>
);

/* ═══ UPLOAD ZONE ═══ */
const UpZ=({value,onUpload,onRemove,label,accept,hintText})=>{
  const up=Array.isArray(value)?value.length>0:!!value;
  if(up){
    const fl=Array.isArray(value)?value:[label];
    return <div className="rounded-md p-3 flex items-center gap-3 group" style={{background:'rgba(62,207,142,0.08)',border:'1px solid rgba(62,207,142,0.25)'}}>
      <div className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0" style={{background:'rgba(62,207,142,0.15)'}}><I n="file" s={14} c="text-[#3ECF8E]"/></div>
      <div className="flex-1 min-w-0"><p className="text-[12px] font-medium text-[#3ECF8E] truncate">{fl[0]}</p><p className="text-[11px]" style={{color:'rgba(62,207,142,0.6)'}}>Uploaded successfully</p></div>
      <button onClick={e=>{e.stopPropagation();onRemove()}} className="p-1 rounded-md text-[#666] transition-all opacity-0 group-hover:opacity-100" style={{}} onMouseEnter={e=>{e.currentTarget.style.background='rgba(239,68,68,0.1)';e.currentTarget.style.color='#f87171'}} onMouseLeave={e=>{e.currentTarget.style.background='';e.currentTarget.style.color='#666'}}><I n="trash" s={13}/></button>
    </div>;
  }
  return <div onClick={onUpload} className="intake-upload-zone rounded-md p-5 text-center cursor-pointer group" style={{borderWidth:2}}>
    <div className="w-9 h-9 rounded-md bg-[#282828] group-hover:bg-[rgba(62,207,142,0.1)] flex items-center justify-center mx-auto mb-2 transition-colors"><I n="upload" s={16} c="text-[#666] group-hover:text-[#3ECF8E] transition-colors"/></div>
    <p className="text-[12px] font-medium text-[#999] group-hover:text-[#3ECF8E] transition-colors">Click to upload {label.toLowerCase()}</p>
    <p className="text-[11px] text-[#555] mt-1">{accept||'Any file type'}</p>
    {hintText&&<p className="text-[11px] text-[#555] mt-0.5">{hintText}</p>}
  </div>;
};

/* ═══ CHIP GROUP ═══ */
const ChipGroup=({options,selected,onToggle,errState,columns})=>{
  const gridColsClass=
    columns===2?'grid-cols-2':
    columns===3?'grid-cols-3':
    columns===4?'grid-cols-4':'';
  return (
  <div className={`${columns?`grid ${gridColsClass}`:'flex flex-wrap'} gap-1.5 ${errState?'ring-1 ring-rose-500/20 rounded-md p-1':''}`}>
    {options.map(o=>{
      const active=selected.includes(o);
      return <button key={o} type="button" onClick={()=>onToggle(o)}
        className={`chip-toggle inline-flex items-center gap-2 px-3 py-2 border rounded-md text-[12px] font-medium ${active?'active':''}`}>
        <div className={`w-3.5 h-3.5 rounded flex items-center justify-center transition-all`} style={{borderWidth:'1.5px',borderStyle:'solid',...(active?{background:'#3ECF8E',borderColor:'#3ECF8E'}:{borderColor:'#555'})}}>
          {active&&<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
        </div>
        {o}
      </button>;
    })}
  </div>
  );
};

const IntakeForm=({onSubmit})=>{
  const STEPS=[
    {name:'Project Basics',desc:'Campaign name and objective',icon:'hash'},
    {name:'Organization & Requester',desc:'Business unit, banners, requester details',icon:'briefcase'},
    {name:'Assignment',desc:'Team ownership and representative',icon:'target'},
    {name:'Priority',desc:'Urgency and expected impact',icon:'zap'},
    {name:'Launch Timing',desc:'Quarter, period, week, and target date',icon:'cal'},
    {name:'Channels',desc:'Distribution and messaging channels',icon:'globe'},
    {name:'Campaign Type & Audience',desc:'Type, banner, segment, and targeting',icon:'target'},
    {name:'Merchandising',desc:'Upload files and extract campaign data',icon:'file'},
    {name:'Assets & Creative',desc:'Media files and creative development',icon:'sparkle'},
    {name:'Review & Submit',desc:'Verify and confirm your submission',icon:'eye'},
  ];
  const [step,setStep]=useState(0);
  const [dir,setDir]=useState(1);
  const [submitted,setSubmitted]=useState(false);
  const [isSubmitting,setIsSubmitting]=useState(false);
  const [fd,setFd]=useState({...INIT_FD});
  const [attempted,setAttempted]=useState(new Set());
  const [touched,setTouched]=useState({});
  const contentRef=useRef(null);
  const submitTimerRef=useRef(null);
  const upd=(k,v)=>setFd(p=>({...p,[k]:v}));
  const togArr=(k,v)=>setFd(p=>({...p,[k]:p[k].includes(v)?p[k].filter(x=>x!==v):[...p[k],v]}));
  const togBanner=(b)=>{if(b==='All'){setFd(p=>({...p,banners:p.banners.length===BANNERS.length?[]:[...BANNERS]}));return;}togArr('banners',b);};
  const [repMode,setRepMode]=useState('auto');
  const [editingLeads,setEditingLeads]=useState(new Set());
  const mrRef=useRef(fd.mr);
  useEffect(()=>{if(fd.mr!==mrRef.current){mrRef.current=fd.mr;setRepMode('auto');upd('rep',MKT_RES[fd.mr]||'')}},[fd.mr]);
  useEffect(()=>{contentRef.current?.scrollTo({top:0,behavior:'smooth'})},[step]);
  useEffect(()=>()=>{if(submitTimerRef.current)clearTimeout(submitTimerRef.current);},[]);
  const intakeDate=useMemo(
    ()=>new Intl.DateTimeFormat('en-US',{month:'long',day:'numeric',year:'numeric'}).format(new Date()),
    []
  );
  const hasValue=(v)=>typeof v==='string'?v.trim().length>0:!!v;
  const err=(f)=>attempted.has(step)&&!hasValue(f);
  const errA=(f)=>attempted.has(step)&&(!f||f.length===0);

  const stepValid=(s)=>{
    if(s===0)return hasValue(fd.projectName);
    if(s===1)return hasValue(fd.bu)&&fd.banners.length>0&&hasValue(fd.byName);
    if(s===2)return hasValue(fd.mr);
    if(s===3)return hasValue(fd.pri);
    if(s===5)return fd.chSupport.length>0;
    if(s===6)return hasValue(fd.campType);
    if(s===8)return hasValue(fd.creativeType);
    return true;
  };
  const validate=()=>stepValid(step);
  const isCurrentStepValid=validate();

  const STEP_REQUIREMENTS=[
    [{label:'Project Name',done:hasValue(fd.projectName)}],
    [{label:'Business Unit',done:hasValue(fd.bu)},{label:'At least one Banner',done:fd.banners.length>0},{label:'Requester Full Name',done:hasValue(fd.byName)}],
    [{label:'Marketing Resource',done:hasValue(fd.mr)}],
    [{label:'Priority Level',done:hasValue(fd.pri)}],
    [],
    [{label:'Channel Support',done:fd.chSupport.length>0}],
    [{label:'Campaign Type',done:hasValue(fd.campType)}],
    [],
    [{label:'Creative Development Type',done:hasValue(fd.creativeType)}],
    [],
  ];
  const currentReqs=STEP_REQUIREMENTS[step]||[];
  const missingReqs=currentReqs.filter(req=>!req.done);

  const isStepComplete=(s)=>{
    if(s>=step)return false;
    return stepValid(s);
  };

  const progress=useMemo(()=>{
    const weights=[0,11,22,33,44,55,66,77,88,100];
    return weights[step]||0;
  },[step]);

  const goTo=(target)=>{
    if(target===step)return;
    setDir(target>step?1:-1);
    setStep(target);
  };
  const next=()=>{if(isCurrentStepValid){setDir(1);setStep(step+1)}else setAttempted(p=>new Set([...p,step]))};
  const prev=()=>{if(step>0){setDir(-1);setStep(step-1)}};
  const submit=()=>{
    if(isSubmitting)return;
    setIsSubmitting(true);
    submitTimerRef.current=setTimeout(()=>{
      setSubmitted(true);
      onSubmit?.(fd);
      setIsSubmitting(false);
      submitTimerRef.current=null;
    },800);
  };
  const simUpload=(f)=>{if(f==='merchFiles')upd('merchFiles',['Q1_StockUp_Merch_Sheet.xlsx']);else if(f==='creativeFiles')upd('creativeFiles',['Campaign_Creative_v1.psd']);else upd(f,'uploaded')};
  const rmFile=(f)=>{if(f==='merchFiles'||f==='creativeFiles')upd(f,[]);else upd(f,null)};

  const hasMedia=fd.chSupport.includes('Media Collective');
  const chLeads=fd.chSupport.map(c=>({ch:c,lead:CH_LEADS[c]||'TBD'}));
  const priorityOpts=[
    {v:'High',desc:'Launch-critical',bg:'rgba(239,68,68,0.08)',bc:'rgba(239,68,68,0.35)',ring:'rgba(239,68,68,0.15)',dot:'#ef4444',label:'#fca5a5',hint:'#f87171'},
    {v:'Medium',desc:'Standard timeline',bg:'rgba(245,158,11,0.08)',bc:'rgba(245,158,11,0.35)',ring:'rgba(245,158,11,0.15)',dot:'#f59e0b',label:'#fcd34d',hint:'#fbbf24'},
    {v:'Low',desc:'Flexible timing',bg:'rgba(56,189,248,0.08)',bc:'rgba(56,189,248,0.35)',ring:'rgba(56,189,248,0.15)',dot:'#38bdf8',label:'#7dd3fc',hint:'#38bdf8'},
  ];

  if(submitted)return <div className="flex items-center justify-center py-20 anim-scale"><div className="text-center max-w-md">
    <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4" style={{background:'rgba(62,207,142,0.12)'}}><I n="check" s={24} c="text-[#3ECF8E]"/></div>
    <h2 className="text-lg font-semibold text-[#f8f8f8]">Campaign Submitted</h2>
    <p className="text-[13px] text-[#999] mt-2 leading-relaxed"><strong className="text-[#ededed]">"{fd.projectName}"</strong> has been submitted successfully. A confirmation email will be sent to all stakeholders.</p>
    <p className="text-[11px] text-[#666] mt-3 font-mono">Reference: IC-2026-{String(CAMPS.length+1).padStart(4,'0')}</p>
    <button onClick={()=>{setSubmitted(false);setIsSubmitting(false);setStep(0);setDir(1);setFd({...INIT_FD});setAttempted(new Set());setTouched({})}} className="mt-5 px-5 py-2 rounded-md text-[13px] font-medium transition-colors" style={{background:'#3ECF8E',color:'#0a1f15'}} onMouseEnter={e=>e.currentTarget.style.background='#38b97e'} onMouseLeave={e=>e.currentTarget.style.background='#3ECF8E'}>Submit Another Campaign</button>
  </div></div>;

  const renderStep=()=>{
    switch(step){
      case 0:return <>
        <p className="text-[11px] text-[#555] mb-2">Intake Date: {intakeDate}</p>
        <SectionHeader icon="hash" title="Campaign Information" desc="Give your campaign a clear, descriptive name."/>
        <div className="space-y-4">
          <Field label="Project Name" required hintText="Use a descriptive name like 'Q2 Fresh Produce Sale - Email + In-Store'" error={err(fd.projectName)} errorMsg="Campaign name is required">
            <input className={ic(err(fd.projectName),touched.projectName&&fd.projectName)} placeholder="Enter campaign name..." value={fd.projectName} onChange={e=>upd('projectName',e.target.value)} onBlur={()=>setTouched(p=>({...p,projectName:true}))}/>
          </Field>
          <Field label="Project Description" hintText="Include the objective, scope, and expected outcomes.">
            <textarea className={ic(false)} rows={3} placeholder="Describe the campaign objective, target audience, and key deliverables..." value={fd.projectDesc} onChange={e=>upd('projectDesc',e.target.value)}/>
          </Field>
        </div>
      </>;

      case 1:return <>
        <SectionHeader icon="briefcase" title="Organization" desc="Which business unit and banners are involved?"/>
        <div className="space-y-4">
          <Field label="Business Unit" required tooltip="The division or department sponsoring this campaign" error={err(fd.bu)} errorMsg="Select a business unit">
            <select className={ic(err(fd.bu))} value={fd.bu} onChange={e=>upd('bu',e.target.value)}><option value="">Select business unit...</option>{BUS.map(b=><option key={b}>{b}</option>)}</select>
          </Field>
          <Field label="Banner(s)" required hintText="Select all retail banners where this campaign will run." error={errA(fd.banners)} errorMsg="Select at least one banner">
            <div className={errA(fd.banners)?'ring-1 ring-rose-500/20 rounded-md p-1':''}>
              <div className="flex items-center justify-between mb-2">
                <button type="button" onClick={()=>togBanner('All')}
                  className="text-[11px] font-medium transition-colors flex items-center gap-1.5"
                  style={{color:fd.banners.length===BANNERS.length?'#3ECF8E':'#888'}}
                  onMouseEnter={e=>{if(fd.banners.length!==BANNERS.length)e.currentTarget.style.color='#ccc'}}
                  onMouseLeave={e=>{if(fd.banners.length!==BANNERS.length)e.currentTarget.style.color='#888'}}>
                  <div className="w-3.5 h-3.5 rounded flex items-center justify-center transition-all" style={{borderWidth:'1.5px',borderStyle:'solid',...(fd.banners.length===BANNERS.length?{background:'#3ECF8E',borderColor:'#3ECF8E'}:{borderColor:'#555'})}}>
                    {fd.banners.length===BANNERS.length&&<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                  </div>
                  Select all
                </button>
                {fd.banners.length>0&&<span className="text-[10px] text-[#666]">{fd.banners.length} of {BANNERS.length} selected</span>}
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {BANNERS.map(b=>{
                  const active=fd.banners.includes(b);
                  return <button key={b} type="button" onClick={()=>togBanner(b)}
                    className={`chip-toggle inline-flex items-center gap-2 px-2.5 py-2 border rounded-md text-[12px] font-medium ${active?'active':''}`}>
                    <div className="w-3.5 h-3.5 rounded flex items-center justify-center transition-all flex-shrink-0" style={{borderWidth:'1.5px',borderStyle:'solid',...(active?{background:'#3ECF8E',borderColor:'#3ECF8E'}:{borderColor:'#555'})}}>
                      {active&&<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                    </div>
                    <span className="truncate">{b}</span>
                  </button>;
                })}
              </div>
            </div>
          </Field>
        </div>
        <div className="border-t border-[#2e2e2e] mt-5 pt-5">
          <SectionHeader icon="user" title="Requester" desc="Who is submitting this campaign request?"/>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Full Name" required error={err(fd.byName)} errorMsg="Name is required">
              <input className={ic(err(fd.byName))} placeholder="e.g., Sarah Johnson" value={fd.byName} onChange={e=>upd('byName',e.target.value)}/>
            </Field>
            <Field label="LDAP ID" tooltip="Your corporate directory identifier" hintText="Used for routing and approvals.">
              <input className={ic(false)} placeholder="e.g., sjohn42" value={fd.byLdap} onChange={e=>upd('byLdap',e.target.value)}/>
            </Field>
          </div>
        </div>
      </>;

      case 2:return <>
        <SectionHeader icon="target" title="Team Assignment" desc="Which marketing team will own this campaign?"/>
        <div className="space-y-4">
          <Field label="Marketing Resource" required tooltip="The functional team responsible for campaign execution" error={err(fd.mr)} errorMsg="Select a marketing team">
            <select className={ic(err(fd.mr))} value={fd.mr} onChange={e=>upd('mr',e.target.value)}><option value="">Select team...</option>{Object.keys(MKT_RES).map(m=><option key={m}>{m}</option>)}</select>
          </Field>
          {fd.mr&&<>
            <div>
              <label className={lc}>Assign Representative</label>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={()=>{setRepMode('auto');upd('rep',MKT_RES[fd.mr]||'')}}
                  className="px-3 py-2.5 rounded-lg text-left transition-all"
                  style={{borderWidth:2,borderStyle:'solid',...(repMode==='auto'?{background:'rgba(62,207,142,0.08)',borderColor:'rgba(62,207,142,0.35)'}:{borderColor:'#2e2e2e'})}}
                  onMouseEnter={e=>{if(repMode!=='auto'){e.currentTarget.style.borderColor='#444';e.currentTarget.style.background='#252525'}}}
                  onMouseLeave={e=>{if(repMode!=='auto'){e.currentTarget.style.borderColor='#2e2e2e';e.currentTarget.style.background=''}}}>
                  <p className="text-[11px] font-semibold mb-0.5" style={{color:repMode==='auto'?'#3ECF8E':'#ccc'}}>Auto-assign</p>
                  <p className="text-[10px]" style={{color:repMode==='auto'?'rgba(62,207,142,0.6)':'#666'}}>Default rep for this team</p>
                </button>
                <button type="button" onClick={()=>{setRepMode('custom');upd('rep','')}}
                  className="px-3 py-2.5 rounded-lg text-left transition-all"
                  style={{borderWidth:2,borderStyle:'solid',...(repMode==='custom'?{background:'rgba(62,207,142,0.08)',borderColor:'rgba(62,207,142,0.35)'}:{borderColor:'#2e2e2e'})}}
                  onMouseEnter={e=>{if(repMode!=='custom'){e.currentTarget.style.borderColor='#444';e.currentTarget.style.background='#252525'}}}
                  onMouseLeave={e=>{if(repMode!=='custom'){e.currentTarget.style.borderColor='#2e2e2e';e.currentTarget.style.background=''}}}>
                  <p className="text-[11px] font-semibold mb-0.5" style={{color:repMode==='custom'?'#3ECF8E':'#ccc'}}>Custom</p>
                  <p className="text-[10px]" style={{color:repMode==='custom'?'rgba(62,207,142,0.6)':'#666'}}>Assign to someone else</p>
                </button>
              </div>
            </div>
            {repMode==='auto'&&fd.rep&&<div className="flex items-center gap-3 rounded-lg px-4 py-3 anim-scale" style={{background:'rgba(62,207,142,0.08)',border:'1px solid rgba(62,207,142,0.25)'}}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{background:'rgba(62,207,142,0.15)'}}><span className="text-[9px] font-bold text-[#3ECF8E]">{fd.rep.split(' ').map(x=>x[0]).join('')}</span></div>
              <div className="flex-1"><p className="text-[13px] font-semibold text-[#f8f8f8]">{fd.rep}</p></div>
              <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{background:'rgba(62,207,142,0.15)'}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3ECF8E" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg></div>
            </div>}
            {repMode==='custom'&&<Field label="Representative Name" hintText="Enter the name of the person to assign.">
              <input className={ic(false)} placeholder="e.g., Jane Cooper" value={fd.rep} onChange={e=>upd('rep',e.target.value)}/>
            </Field>}
          </>}
        </div>
      </>;

      case 3:return <>
        <SectionHeader icon="zap" title="Prioritization" desc="Set the urgency level and expected business impact."/>
        <div className="space-y-4">
          <Field label="Priority Level" required error={err(fd.pri)} errorMsg="Select a priority level">
            <div className={`grid grid-cols-3 gap-2 ${err(fd.pri)?'ring-1 ring-rose-500/20 rounded-md p-1':''}`}>
              {priorityOpts.map(p=><button key={p.v} type="button" onClick={()=>upd('pri',p.v)}
                className="px-3.5 py-2.5 rounded-lg text-left transition-all"
                style={{
                  borderWidth:2,borderStyle:'solid',
                  ...(fd.pri===p.v
                    ?{background:p.bg,borderColor:p.bc,boxShadow:`0 0 0 1px ${p.ring}`}
                    :{borderColor:'#363636'})
                }}
                onMouseEnter={e=>{if(fd.pri!==p.v){e.currentTarget.style.borderColor='#555';e.currentTarget.style.background='#252525'}}}
                onMouseLeave={e=>{if(fd.pri!==p.v){e.currentTarget.style.borderColor='#363636';e.currentTarget.style.background=''}}}>
                <div className="flex items-center gap-2 mb-0.5">
                  <div className="w-2 h-2 rounded-full" style={{background:fd.pri===p.v?p.dot:'#555'}}/>
                  <span className="text-[13px] font-semibold" style={{color:fd.pri===p.v?p.label:'#ccc'}}>{p.v}</span>
                </div>
                <p className="text-[11px] ml-4" style={{color:fd.pri===p.v?p.hint:'#666'}}>{p.desc}</p>
              </button>)}
            </div>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Expected Revenue" tooltip="Projected revenue impact" hintText="Dollar amount or range">
              <input className={ic(false)} placeholder="e.g., $1.5M" value={fd.roiRevenue} onChange={e=>upd('roiRevenue',e.target.value)}/>
            </Field>
            <Field label="Expected Engagement" tooltip="Projected engagement impact" hintText="Engagement metric or target">
              <input className={ic(false)} placeholder="e.g., 50K users" value={fd.roiEngagement} onChange={e=>upd('roiEngagement',e.target.value)}/>
            </Field>
          </div>
        </div>
      </>;

      case 4:return <>
        <SectionHeader icon="cal" title="Launch Timing" desc="When should this campaign go live?"/>
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-2.5">
            <Field label="Year"><select className={ic(false)} value={fd.year} onChange={e=>{upd('year',e.target.value);upd('week','')}}><option value="">--</option>{['2025','2026','2027','2028'].map(y=><option key={y}>{y}</option>)}</select></Field>
            <Field label="Quarter"><select className={ic(false)} value={fd.quarter} onChange={e=>upd('quarter',e.target.value)}><option value="">--</option>{['Q1','Q2','Q3','Q4'].map(q=><option key={q}>{q}</option>)}</select></Field>
            <Field label="Period" tooltip="Albertsons 13-period fiscal calendar"><select className={ic(false)} value={fd.period} onChange={e=>upd('period',e.target.value)}><option value="">--</option>{Array.from({length:13},(_,i)=>`P${i+1}`).map(p=><option key={p}>{p}</option>)}</select></Field>
            <Field label="Fiscal Week">{fd.year?<select className={ic(false)} value={fd.week} onChange={e=>upd('week',e.target.value)}><option value="">--</option>{Array.from({length:52},(_,i)=>`${fd.year}${String(i+1).padStart(2,'0')}`).map(w=><option key={w}>{w}</option>)}</select>:<select className={ic(false)} disabled><option>Select year first</option></select>}</Field>
          </div>
          <Field label="Target Date" hintText="Exact launch date">
            <input type="date" className={ic(false)} value={fd.targetDate} onChange={e=>upd('targetDate',e.target.value)}/>
          </Field>
        </div>
      </>;

      case 5:return <>
        <SectionHeader icon="globe" title="Channel Support" desc="Which distribution channels will be used?"/>
        <div className="space-y-4">
          <Field label="Channels" required hintText="Select all channels needed for this campaign." error={errA(fd.chSupport)} errorMsg="Select at least one channel">
            <ChipGroup options={CH_OPTS} selected={fd.chSupport} onToggle={v=>togArr('chSupport',v)} errState={errA(fd.chSupport)}/>
          </Field>
          {chLeads.length>0&&<div>
            <label className={lc}><I n="user" s={11} c="text-[#666]"/>Channel Leads</label>
            <p className="text-[11px] text-[#666] mb-3">Auto-assigned based on channel selection.</p>
            <div className="space-y-1.5">{chLeads.map(({ch,lead})=>{
              const override=fd.chLeadOverrides[ch];
              const current=override||lead;
              const isCustom=!!override&&override!==lead;
              const isEditing=editingLeads.has(ch);
              return <div key={ch} className="flex items-center gap-3 rounded-md px-3 py-2" style={{background:'#161616',border:`1px solid ${isCustom?'rgba(62,207,142,0.25)':'#2e2e2e'}`}}>
                <span className="text-[11px] text-[#888] w-[100px] flex-shrink-0 truncate">{ch}</span>
                <div className="flex-1 min-w-0">
                  {isEditing
                    ?<input autoFocus className={`${ic(false)} !py-1 !text-[12px]`} value={override??lead} placeholder="Enter name..." onChange={e=>setFd(p=>({...p,chLeadOverrides:{...p.chLeadOverrides,[ch]:e.target.value}}))} onKeyDown={e=>{if(e.key==='Enter')setEditingLeads(p=>{const n=new Set(p);n.delete(ch);return n})}}/>
                    :<div className="flex items-center gap-2">
                      <span className="text-[12px] font-medium text-[#ededed] truncate">{current}</span>
                      {isCustom&&<span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0" style={{background:'rgba(62,207,142,0.1)',color:'#3ECF8E'}}>Custom</span>}
                    </div>}
                </div>
                {isEditing
                  ?<div className="flex items-center gap-0.5 flex-shrink-0">
                    <button type="button" onClick={()=>setEditingLeads(p=>{const n=new Set(p);n.delete(ch);return n})}
                      className="p-1 rounded hover:bg-[rgba(62,207,142,0.12)] text-[#3ECF8E] transition-colors" title="Save"><I n="check" s={11}/></button>
                    <button type="button" onClick={()=>{setFd(p=>{const o={...p.chLeadOverrides};delete o[ch];return{...p,chLeadOverrides:o}});setEditingLeads(p=>{const n=new Set(p);n.delete(ch);return n})}}
                      className="p-1 rounded hover:bg-[rgba(244,63,94,0.1)] text-[#666] hover:text-[#f87171] transition-colors" title="Reset to default"><I n="x" s={11}/></button>
                  </div>
                  :<button type="button" onClick={()=>setEditingLeads(p=>{const n=new Set(p);n.add(ch);return n})}
                    className="text-[10px] font-medium text-[#555] hover:text-[#3ECF8E] transition-colors flex-shrink-0">Edit</button>}
              </div>;
            })}</div>
          </div>}
        </div>
        <div className="border-t border-[#2e2e2e] mt-5 pt-5">
          <SectionHeader icon="send" title="Marketing Channels" desc="Which messaging formats will be used?"/>
          <ChipGroup options={MKT_CH} selected={fd.mktCh} onToggle={v=>togArr('mktCh',v)}/>
        </div>
      </>;

      case 6:return <>
        <SectionHeader icon="target" title="Campaign Type & Audience" desc="Define the campaign classification and target audience."/>
        <div className="space-y-4">
          <Field label="Campaign Type" required tooltip="New: first-time. Existing: returning. Carry Forward: extension. Evergreen: always-on." error={err(fd.campType)} errorMsg="Select a campaign type">
            <div className="grid grid-cols-4 gap-2">
              {[
                {v:'New',desc:'First-time campaign',icon:'plus'},
                {v:'Existing',desc:'Returning campaign',icon:'layers'},
                {v:'Carry Forward',desc:'Extended from prior',icon:'chevR'},
                {v:'Evergreen',desc:'Always-on program',icon:'flag'}
              ].map(t=><button key={t.v} type="button" onClick={()=>upd('campType',t.v)}
                className="px-2.5 py-2.5 rounded-lg text-center transition-all"
                style={{borderWidth:2,borderStyle:'solid',...(fd.campType===t.v?{background:'rgba(62,207,142,0.08)',borderColor:'rgba(62,207,142,0.35)',color:'#3ECF8E'}:{borderColor:'#363636',color:'#999'})}}
                onMouseEnter={e=>{if(fd.campType!==t.v){e.currentTarget.style.borderColor='#555';e.currentTarget.style.background='#252525'}}}
                onMouseLeave={e=>{if(fd.campType!==t.v){e.currentTarget.style.borderColor='#363636';e.currentTarget.style.background=''}}}>
                <I n={t.icon} s={15} c={`mx-auto mb-1 ${fd.campType===t.v?'text-[#3ECF8E]':'text-[#666]'}`}/>
                <p className="text-[12px] font-semibold">{t.v}</p>
                <p className="text-[10px] mt-0.5" style={{color:fd.campType===t.v?'rgba(62,207,142,0.6)':'#666'}}>{t.desc}</p>
              </button>)}
            </div>
          </Field>
          <div style={{borderTop:'1px solid #2e2e2e',paddingTop:16}}>
            <p className="text-[11px] font-semibold text-[#888] uppercase tracking-wide mb-2.5">Audience Targeting</p>
            <div className="space-y-3">
              <Field label="Target Banner" hintText="Primary banner for audience selection">
                <select className={ic(false)} value={fd.audBanner} onChange={e=>upd('audBanner',e.target.value)}><option value="">Select...</option>{BANNERS.map(b=><option key={b}>{b}</option>)}</select>
              </Field>
              <Field label="Segment Definition" hintText="Describe the customer segments to target.">
                <textarea className={ic(false)} rows={2} placeholder="Define target audience segments..." value={fd.segDef} onChange={e=>upd('segDef',e.target.value)}/>
              </Field>
              <Field label="Targeting Criteria" hintText="Inclusion/exclusion rules, geographic filters, or behavioral triggers.">
                <textarea className={ic(false)} rows={2} placeholder="Specify targeting criteria..." value={fd.targetCriteria} onChange={e=>upd('targetCriteria',e.target.value)}/>
              </Field>
            </div>
          </div>
        </div>
      </>;

      case 7:return <>
        <SectionHeader icon="file" title="Merchandising" desc="Upload vendor or BU merchandising files."/>
        <div className="space-y-4">
          <UpZ value={fd.merchFiles} onUpload={()=>simUpload('merchFiles')} onRemove={()=>rmFile('merchFiles')} label="Merchandising files" accept=".xlsx, .csv, .pdf" hintText="Max 25 MB per file"/>
          {fd.merchFiles.length>0&&<div className="rounded-lg p-3.5 anim-scale" style={{background:'rgba(62,207,142,0.08)',border:'1px solid rgba(62,207,142,0.25)'}}>
            <p className="text-[10px] font-semibold text-[#3ECF8E] uppercase tracking-wide mb-2.5 flex items-center gap-1.5"><I n="zap" s={11} c="text-[#3ECF8E]"/>Auto-extracted Data</p>
            <div className="grid grid-cols-2 gap-2 text-[12px]">
              {[['Merch Status','Accepted','check'],['UPC List','3 items','hash'],['U Offer IDs','UOF-2026-0451, 0452','file'],['4x Offer IDs','4X-2026-0891','file'],['Stock Up Event','SU-2026-Q1-003','flag']].map(([k,v,icon])=>
                <div key={k} className="flex items-center gap-2 rounded-md px-2.5 py-1.5" style={{background:'#1e1e1e',border:'1px solid rgba(62,207,142,0.2)'}}>
                  <I n={icon} s={12} c="text-[#3ECF8E]"/>
                  <div><p className="text-[10px] font-medium" style={{color:'rgba(62,207,142,0.6)'}}>{k}</p><p className="text-[11px] font-semibold text-[#ededed]">{v}</p></div>
                </div>
              )}
            </div>
          </div>}
        </div>
      </>;

      case 8:return <>
        {hasMedia?<>
          <SectionHeader icon="layers" title="Media Collective Assets" desc="Upload vendor materials and guidance documents."/>
          <div className="space-y-3">{Object.entries(MEDIA_FIELDS).map(([label,key])=><div key={key}><label className="text-[12px] font-medium text-[#a78bfa] mb-1.5 block">{label}</label><UpZ value={fd[key]} onUpload={()=>simUpload(key)} onRemove={()=>rmFile(key)} label={label}/></div>)}</div>
        </>:<div className="text-center py-4">
          <div className="w-9 h-9 rounded-lg bg-[#282828] flex items-center justify-center mx-auto mb-2"><I n="layers" s={16} c="text-[#666]"/></div>
          <p className="text-[13px] font-medium text-[#999]">Media Collective not required</p>
          <p className="text-[11px] text-[#666] mt-1">Enable Media Collective in Channel Support (Step 6) to upload vendor materials.</p>
        </div>}
        <div className="border-t border-[#2e2e2e] mt-5 pt-5">
          <SectionHeader icon="sparkle" title="Brand & Creative" desc="Provide brand assets and specify the creative type."/>
          <div className="space-y-4">
            <Field label="Brand Assets" hintText="Paste a link to your VisID or brand guidelines.">
              <input className={ic(false)} placeholder="https://visid.albertsons.com/..." value={fd.brandAssets} onChange={e=>upd('brandAssets',e.target.value)}/>
            </Field>
            <Field label="Creative Development Type" required tooltip="In-Store: physical displays. Digital: email, web, app." error={err(fd.creativeType)} errorMsg="Select a creative type">
              <div className="grid grid-cols-3 gap-2">
                {['In-Store','Digital','Both'].map(t=><button key={t} type="button" onClick={()=>upd('creativeType',t)}
                  className="px-3.5 py-2.5 rounded-lg text-center transition-all text-[12px]"
                  style={{borderWidth:2,borderStyle:'solid',...(fd.creativeType===t?{background:'rgba(62,207,142,0.08)',borderColor:'rgba(62,207,142,0.35)',color:'#3ECF8E',fontWeight:600}:{borderColor:'#363636',color:'#999',fontWeight:500})}}
                  onMouseEnter={e=>{if(fd.creativeType!==t){e.currentTarget.style.borderColor='#555';e.currentTarget.style.background='#252525'}}}
                  onMouseLeave={e=>{if(fd.creativeType!==t){e.currentTarget.style.borderColor='#363636';e.currentTarget.style.background=''}}}>
                  {t}
                </button>)}
              </div>
            </Field>
            <Field label="Creative Files" hintText="Upload design files, mockups, or reference materials.">
              <UpZ value={fd.creativeFiles} onUpload={()=>simUpload('creativeFiles')} onRemove={()=>rmFile('creativeFiles')} label="Creative files" accept=".psd, .ai, .png, .jpg, .pdf"/>
            </Field>
          </div>
        </div>
      </>;

      case 9:{
        const clean=v=>{if(!v||v==='')return null;if(Array.isArray(v)&&!v.length)return null;return String(v)};
        const reqBy=fd.byName?(fd.byLdap?`${fd.byName} (${fd.byLdap})`:fd.byName):null;
        const secs=[
          [0,'Project Basics','hash',[['Campaign Name',fd.projectName],['Description',clean(fd.projectDesc)]]],
          [1,'Organization & Requester','briefcase',[['Business Unit',fd.bu],['Banners',fd.banners.length?fd.banners.join(', '):null],['Requested By',reqBy]]],
          [2,'Assignment','target',[['Marketing Team',fd.mr],['Representative',fd.rep]]],
          [3,'Priority','zap',[['Priority',fd.pri],['Revenue',clean(fd.roiRevenue)],['Engagement',clean(fd.roiEngagement)]]],
          [4,'Launch Timing','cal',[['Launch Window',[fd.year,fd.quarter,fd.period,fd.week].filter(Boolean).join(' ')||null],['Target Date',clean(fd.targetDate)]]],
          [5,'Channels','globe',[['Distribution Channels',fd.chSupport.length?fd.chSupport.join(', '):null],['Marketing Channels',fd.mktCh.length?fd.mktCh.join(', '):null]]],
          [6,'Campaign Type & Audience','target',[['Type',fd.campType],['Target Banner',clean(fd.audBanner)],['Segment',clean(fd.segDef)],['Targeting Criteria',clean(fd.targetCriteria)]]],
          [7,'Merchandising','file',[['Merch Files',fd.merchFiles.length?`${fd.merchFiles.length} file(s) uploaded`:null]]],
          [8,'Assets & Creative','sparkle',[['Creative Type',clean(fd.creativeType)],['Brand Assets',clean(fd.brandAssets)],['Creative Files',fd.creativeFiles.length?`${fd.creativeFiles.length} file(s) uploaded`:null]]]
        ];
        return <>
          <div className="rounded-lg p-3.5 flex items-start gap-2.5" style={{background:'rgba(245,158,11,0.08)',border:'1px solid rgba(245,158,11,0.25)'}}>
            <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0" style={{background:'rgba(245,158,11,0.15)'}}><I n="eye" s={14} c="text-[#f59e0b]"/></div>
            <div><p className="text-[13px] font-semibold" style={{color:'#fcd34d'}}>Review before submitting</p><p className="text-[11px] mt-0.5" style={{color:'#f59e0b'}}>Double-check all details below. Click <strong>Edit</strong> on any section to make changes.</p></div>
          </div>
          {secs.map(([si,t,icon,items])=>{
            const filled=items.filter(([_,v])=>v);
            if(!filled.length)return null;
            return <div key={t} className="rounded-lg overflow-hidden" style={{border:'1px solid #2e2e2e'}}>
              <div className="px-4 py-2.5 flex items-center justify-between" style={{borderBottom:'1px solid #2e2e2e'}}>
                <div className="flex items-center gap-2">
                  <I n={icon} s={13} c="text-[#666]"/>
                  <span className="text-[12px] font-semibold text-[#ededed]">{t}</span>
                </div>
                <button onClick={()=>goTo(si)} className="text-[11px] font-medium flex items-center gap-1 transition-colors" style={{color:'#3ECF8E'}} onMouseEnter={e=>{e.currentTarget.style.color='#38b97e';e.currentTarget.style.textDecoration='underline'}} onMouseLeave={e=>{e.currentTarget.style.color='#3ECF8E';e.currentTarget.style.textDecoration='none'}}><I n="edit" s={11}/>Edit</button>
              </div>
              <div className="px-4 py-3">
                <dl className="grid grid-cols-2 gap-x-5 gap-y-2.5">
                  {filled.map(([k,v])=><div key={k}>
                    <dt className="text-[10px] font-medium text-[#666] uppercase tracking-wide">{k}</dt>
                    <dd className="text-[12px] text-[#ededed] font-medium mt-0.5 leading-relaxed">{v}</dd>
                  </div>)}
                </dl>
              </div>
            </div>;
          })}
        </>;
      }
    }
  };

  return <div className="h-full min-h-0 flex flex-col">
    <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-[260px_minmax(0,1fr)] gap-3">
      {/* ═══ SIDEBAR ═══ */}
      <aside className="min-w-0 rounded-lg p-3 overflow-y-auto scrollbar-thin" style={{background:'#161616',border:'1px solid #2e2e2e'}}>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#666]">Progress</p>
            <span className="text-[10px] font-semibold text-[#3ECF8E]">{progress}%</span>
          </div>
          <div className="h-[3px] rounded-full" style={{background:'#2e2e2e'}}>
            <div className="h-full rounded-full progress-bar" style={{width:`${progress}%`,background:'#3ECF8E'}}/>
          </div>
        </div>
        {STEP_GROUPS.map(g=>(
          <div key={g.label} className="mb-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#555] mb-1.5 px-2">{g.label}</p>
            {g.steps.map(i=>{
              const isCurrent=i===step;
              const isDone=i<step&&isStepComplete(i);
              const isClickable=i<step;
              return <button key={i} type="button" onClick={()=>{if(isClickable)goTo(i)}}
                className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-sm text-left transition-all ${isClickable?'cursor-pointer':'cursor-default'}`}
                style={{borderLeft:`2px solid ${isCurrent?'#3ECF8E':isDone?'rgba(62,207,142,0.4)':'transparent'}`}}
                onMouseEnter={e=>{if(isClickable&&!isCurrent)e.currentTarget.style.background='#252525'}}
                onMouseLeave={e=>{e.currentTarget.style.background=''}}>
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold flex-shrink-0"
                  style={{...(isDone?{background:'rgba(62,207,142,0.12)',color:'#3ECF8E'}:isCurrent?{background:'#3ECF8E',color:'#0a1f15'}:{background:'#252525',border:'1px solid #444',color:'#666'})}}>
                  {isDone?<I n="check" s={10}/>:i+1}
                </span>
                <span className={`text-[12px] ${isCurrent?'text-[#f8f8f8] font-semibold':isDone?'text-[#aaa] font-medium':'text-[#888] font-medium'}`}>
                  {STEPS[i].name}
                </span>
              </button>;
            })}
          </div>
        ))}
      </aside>

      {/* ═══ STEP CONTENT ═══ */}
      <section className="min-w-0 rounded-lg flex flex-col overflow-hidden" style={{background:'#1e1e1e',border:'1px solid #363636'}}>
        <div className="px-5 py-3" style={{borderBottom:'1px solid #2e2e2e',background:'#282828'}}>
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-md flex items-center justify-center text-[#3ECF8E] flex-shrink-0" style={{background:'rgba(62,207,142,0.1)',border:'1px solid rgba(62,207,142,0.25)'}}>
              <I n={STEPS[step].icon} s={14}/>
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-[15px] font-semibold text-[#f8f8f8] leading-tight">{STEPS[step].name}</h3>
                <span className="text-[10px] text-[#555]">Step {step+1}/{STEPS.length}</span>
              </div>
              <p className="text-[11px] text-[#888] mt-0.5 truncate">{STEPS[step].desc}</p>
            </div>
          </div>
        </div>
        <div className="h-[2px]" style={{background:'#2e2e2e'}}>
          <div className="h-full progress-bar" style={{width:`${progress}%`,background:'#3ECF8E'}}/>
        </div>

        <div ref={contentRef} className="flex-1 overflow-y-auto scrollbar-thin px-5 py-5">
          <div className="max-w-[640px]">
            <div key={step} className={`space-y-4 pb-2 ${dir>=0?'anim-fwd':'anim-back'}`}>{renderStep()}</div>
          </div>
        </div>
      </section>
    </div>

    <div className="intake-shell-footer sticky bottom-0 mt-2 rounded-md px-3 py-2 flex items-center" style={{border:'1px solid #363636'}}>
      {!isCurrentStepValid&&attempted.has(step)&&currentReqs.length>0&&<span className="text-[11px] text-[#f43f5e] flex items-center gap-1 mr-auto"><I n="alert" s={11}/>{missingReqs.length} required {missingReqs.length===1?'field':'fields'} remaining</span>}
      {(isCurrentStepValid||!attempted.has(step)||currentReqs.length===0)&&<span className="mr-auto text-[11px] text-[#666] hidden sm:inline">Press <kbd className="kbd">Enter</kbd> to continue</span>}
      <div className="flex items-center gap-2">
        <button type="button" onClick={prev} disabled={step===0}
          className="px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors"
          style={{border:'1px solid',...(step>0?{borderColor:'#363636',color:'#ccc'}:{borderColor:'#2e2e2e',background:'#1a1a1a',color:'#555',cursor:'not-allowed'})}}
          onMouseEnter={e=>{if(step>0)e.currentTarget.style.background='#252525'}}
          onMouseLeave={e=>{if(step>0)e.currentTarget.style.background=''}}>Prev</button>
        {step<9&&<button type="button" data-next-btn onClick={next} disabled={!isCurrentStepValid}
          className="px-3.5 py-1.5 rounded-md text-[12px] font-semibold transition-colors"
          style={isCurrentStepValid?{background:'#3ECF8E',color:'#0a1f15'}:{background:'rgba(62,207,142,0.2)',color:'rgba(62,207,142,0.4)',cursor:'not-allowed'}}
          onMouseEnter={e=>{if(isCurrentStepValid)e.currentTarget.style.background='#38b97e'}}
          onMouseLeave={e=>{if(isCurrentStepValid)e.currentTarget.style.background='#3ECF8E'}}>Next</button>}
        {step===9&&<button type="button" onClick={submit} disabled={isSubmitting}
          className="px-3.5 py-1.5 rounded-md text-[12px] font-semibold transition-colors"
          style={isSubmitting?{background:'rgba(62,207,142,0.2)',color:'rgba(62,207,142,0.4)',cursor:'wait'}:{background:'#3ECF8E',color:'#0a1f15'}}
          onMouseEnter={e=>{if(!isSubmitting)e.currentTarget.style.background='#38b97e'}}
          onMouseLeave={e=>{if(!isSubmitting)e.currentTarget.style.background='#3ECF8E'}}>{isSubmitting?'Creating...':'Create Campaign'}</button>}
      </div>
    </div>
  </div>;
};


export default function IntakePage({ onSubmit, onInput }) {
  return <div className="anim-fade h-[calc(100vh-148px)] flex flex-col min-h-0" onInput={onInput}>
    <div className="mb-4 shrink-0">
      <h1 className="text-[15px] font-semibold text-[#f8f8f8]">New Campaign Request</h1>
      <p className="text-[12px] text-[#666]">Complete the intake form to submit a new marketing campaign for review.</p>
    </div>
    <div className="flex-1 min-h-0">
      <IntakeForm onSubmit={onSubmit} />
    </div>
  </div>;
}
