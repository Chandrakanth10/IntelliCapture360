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
  Card,
  Tip,
} from '../shared/campaignShared';

const INIT_FD={projectName:'',projectDesc:'',bu:'',banners:[],byName:'',byLdap:'',mr:'',rep:'',pri:'',roiType:'Revenue',roiVal:'',quarter:'',period:'',week:'',targetDate:'',chSupport:[],mktCh:[],campType:'',audBanner:'',segDef:'',targetCriteria:'',merchFiles:[],brandAssets:'',creativeType:'',creativeFiles:[],vendorGuide:null,isanScripts:null,amcGuidance:null};

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
  const mrRef=useRef(fd.mr);
  useEffect(()=>{if(fd.mr!==mrRef.current){mrRef.current=fd.mr;upd('rep',MKT_RES[fd.mr]||'')}},[fd.mr]);
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

  const ic=(hasErr,hasSuccess)=>`w-full px-3 py-[9px] bg-slate-50 border rounded-md text-[13px] text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all ${hasErr?'field-error':hasSuccess?'field-success':'border-slate-200 hover:border-slate-300'}`;
  const lc="flex items-center gap-1.5 text-[12px] font-semibold text-slate-700 mb-1.5";
  const hint="text-[11px] text-slate-400 mt-1 leading-relaxed";
  const hasMedia=fd.chSupport.includes('Media Collective');
  const chLeads=fd.chSupport.map(c=>({ch:c,lead:CH_LEADS[c]||'TBD'}));
  const priorityOpts=[
    {v:'High',desc:'Launch-critical',activeCard:'bg-red-50 border-red-300 ring-1 ring-red-200',activeDot:'bg-red-500',activeLabel:'text-red-700',activeHint:'text-red-600'},
    {v:'Medium',desc:'Standard timeline',activeCard:'bg-amber-50 border-amber-300 ring-1 ring-amber-200',activeDot:'bg-amber-500',activeLabel:'text-amber-700',activeHint:'text-amber-600'},
    {v:'Low',desc:'Flexible timing',activeCard:'bg-sky-50 border-sky-300 ring-1 ring-sky-200',activeDot:'bg-sky-500',activeLabel:'text-sky-700',activeHint:'text-sky-600'},
  ];

  const Field=({label,required,hintText,tooltip,error,errorMsg,children,className=''})=>(
    <div className={className}>
      <label className={lc}>
        {label}{required&&<span className="text-rose-500 text-[11px]">*</span>}
        {tooltip&&<Tip text={tooltip}><span className="text-slate-300 hover:text-slate-500 cursor-help transition-colors"><I n="info" s={12}/></span></Tip>}
      </label>
      {children}
      {hintText&&!error&&<p className={hint}>{hintText}</p>}
      <FieldErr show={error} msg={errorMsg}/>
    </div>
  );

  const UpZ=({field,label,accept,hintText})=>{
    const up=Array.isArray(fd[field])?fd[field].length>0:!!fd[field];
    if(up){
      const fl=Array.isArray(fd[field])?fd[field]:[label];
      return <div className="bg-emerald-50/50 border border-emerald-200 rounded-md p-3 flex items-center gap-3 group">
        <div className="w-8 h-8 rounded-md bg-emerald-100 flex items-center justify-center flex-shrink-0"><I n="file" s={14} c="text-emerald-600"/></div>
        <div className="flex-1 min-w-0"><p className="text-[12px] font-medium text-emerald-800 truncate">{fl[0]}</p><p className="text-[11px] text-emerald-600">Uploaded successfully</p></div>
        <button onClick={e=>{e.stopPropagation();rmFile(field)}} className="p-1 hover:bg-red-50 rounded-md text-slate-400 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"><I n="trash" s={13}/></button>
      </div>;
    }
    return <div onClick={()=>simUpload(field)} className="border-2 border-dashed border-slate-200 rounded-md p-5 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/20 transition-all group">
      <div className="w-9 h-9 rounded-md bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center mx-auto mb-2 transition-colors"><I n="upload" s={16} c="text-slate-400 group-hover:text-indigo-500 transition-colors"/></div>
      <p className="text-[12px] font-medium text-slate-600 group-hover:text-indigo-700">Click to upload {label.toLowerCase()}</p>
      <p className="text-[11px] text-slate-400 mt-1">{accept||'Any file type'}</p>
      {hintText&&<p className="text-[11px] text-slate-400 mt-0.5">{hintText}</p>}
    </div>;
  };

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
          <div className={`w-3.5 h-3.5 rounded border-[1.5px] flex items-center justify-center transition-all ${active?'bg-indigo-500 border-indigo-500':'border-slate-300'}`}>
            {active&&<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
          </div>
          {o}
        </button>;
      })}
    </div>
    );
  };

  if(submitted)return <div className="flex items-center justify-center py-20 anim-scale"><div className="text-center max-w-md">
    <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4"><I n="check" s={24} c="text-emerald-600"/></div>
    <h2 className="text-lg font-semibold text-slate-900">Campaign Submitted</h2>
    <p className="text-[13px] text-slate-500 mt-2 leading-relaxed"><strong>"{fd.projectName}"</strong> has been submitted successfully. A confirmation email will be sent to all stakeholders.</p>
    <p className="text-[11px] text-slate-400 mt-3 font-mono">Reference: IC-2026-{String(CAMPS.length+1).padStart(4,'0')}</p>
    <button onClick={()=>{setSubmitted(false);setIsSubmitting(false);setStep(0);setDir(1);setFd({...INIT_FD});setAttempted(new Set());setTouched({})}} className="mt-5 px-5 py-2 bg-indigo-500 text-white rounded-md text-[13px] font-medium hover:bg-indigo-600 transition-colors">Submit Another Campaign</button>
  </div></div>;

  const renderStep=()=>{
    switch(step){
      case 0:return <>
        <Card title="Campaign Information" desc="Give your campaign a clear, descriptive name." icon="hash" complete={isStepComplete(0)&&fd.projectName}>
          <Field label="Intake Date" tooltip="Auto-generated based on today's date">
            <input className={ic(false)+' !bg-slate-100 !text-slate-500 !cursor-not-allowed'} disabled value={intakeDate}/>
          </Field>
          <Field label="Project Name" required hintText="Use a descriptive name like 'Q2 Fresh Produce Sale - Email + In-Store'" error={err(fd.projectName)} errorMsg="Campaign name is required">
            <input className={ic(err(fd.projectName),touched.projectName&&fd.projectName)} placeholder="Enter campaign name..." value={fd.projectName} onChange={e=>upd('projectName',e.target.value)} onBlur={()=>setTouched(p=>({...p,projectName:true}))}/>
          </Field>
          <Field label="Project Description" hintText="Include the objective, scope, and expected outcomes.">
            <textarea className={ic(false)} rows={3} placeholder="Describe the campaign objective, target audience, and key deliverables..." value={fd.projectDesc} onChange={e=>upd('projectDesc',e.target.value)}/>
          </Field>
        </Card>
      </>;

      case 1:return <>
        <Card title="Organization" desc="Which business unit and banners are involved?" icon="briefcase">
          <Field label="Business Unit" required tooltip="The division or department sponsoring this campaign" error={err(fd.bu)} errorMsg="Select a business unit">
            <select className={ic(err(fd.bu))} value={fd.bu} onChange={e=>upd('bu',e.target.value)}><option value="">Select business unit...</option>{BUS.map(b=><option key={b}>{b}</option>)}</select>
          </Field>
          <Field label="Banner(s)" required hintText="Select all retail banners where this campaign will run." error={errA(fd.banners)} errorMsg="Select at least one banner">
            <div className={`flex flex-wrap gap-1.5 ${errA(fd.banners)?'ring-1 ring-rose-500/20 rounded-md p-1':''}`}>
              <button type="button" onClick={()=>togBanner('All')}
                className={`chip-toggle inline-flex items-center gap-2 px-3 py-2 border rounded-md text-[12px] font-semibold ${fd.banners.length===BANNERS.length?'active':''}`}>
                <div className={`w-3.5 h-3.5 rounded border-[1.5px] flex items-center justify-center transition-all ${fd.banners.length===BANNERS.length?'bg-indigo-500 border-indigo-500':'border-slate-300'}`}>
                  {fd.banners.length===BANNERS.length&&<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                </div>
                All Banners
              </button>
              {BANNERS.map(b=>{
                const active=fd.banners.includes(b);
                return <button key={b} type="button" onClick={()=>togBanner(b)}
                  className={`chip-toggle inline-flex items-center gap-2 px-3 py-2 border rounded-md text-[12px] font-medium ${active?'active':''}`}>
                  <div className={`w-3.5 h-3.5 rounded border-[1.5px] flex items-center justify-center transition-all ${active?'bg-indigo-500 border-indigo-500':'border-slate-300'}`}>
                    {active&&<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                  </div>
                  {b}
                </button>;
              })}
            </div>
          </Field>
        </Card>
        <Card title="Requester" desc="Who is submitting this campaign request?" icon="user">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Full Name" required error={err(fd.byName)} errorMsg="Name is required">
              <input className={ic(err(fd.byName))} placeholder="e.g., Sarah Johnson" value={fd.byName} onChange={e=>upd('byName',e.target.value)}/>
            </Field>
            <Field label="LDAP ID" tooltip="Your corporate directory identifier" hintText="Used for routing and approvals.">
              <input className={ic(false)} placeholder="e.g., sjohn42" value={fd.byLdap} onChange={e=>upd('byLdap',e.target.value)}/>
            </Field>
          </div>
        </Card>
      </>;

      case 2:return <>
        <Card title="Team Assignment" desc="Which marketing team will own this campaign?" icon="target" complete={isStepComplete(2)&&fd.mr}>
          <Field label="Marketing Resource" required tooltip="The functional team responsible for campaign execution" error={err(fd.mr)} errorMsg="Select a marketing team">
            <select className={ic(err(fd.mr))} value={fd.mr} onChange={e=>upd('mr',e.target.value)}><option value="">Select team...</option>{Object.keys(MKT_RES).map(m=><option key={m}>{m}</option>)}</select>
          </Field>
          {fd.rep&&<div className="flex items-center gap-3 bg-indigo-50/60 border border-indigo-100 rounded-lg px-4 py-3 anim-scale">
            <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0"><span className="text-[10px] font-bold text-indigo-600">{fd.rep.split(' ').map(x=>x[0]).join('')}</span></div>
            <div className="flex-1"><p className="text-[10px] font-medium text-indigo-500 uppercase tracking-wide">Auto-assigned Representative</p><p className="text-[13px] font-semibold text-indigo-800">{fd.rep}</p></div>
            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3ECF8E" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg></div>
          </div>}
          <Field label="Marketing Resource Representative" hintText="Auto-populated based on team selection above.">
            <input className={ic(false)+' !bg-slate-100 !text-slate-500 !cursor-not-allowed'} disabled value={fd.rep||'Select a team first'} placeholder="Auto-filled..."/>
          </Field>
        </Card>
      </>;

      case 3:return <>
        <Card title="Prioritization" desc="Set the urgency level and expected business impact." icon="zap">
          <Field label="Priority Level" required error={err(fd.pri)} errorMsg="Select a priority level">
            <div className={`grid grid-cols-3 gap-2 ${err(fd.pri)?'ring-1 ring-rose-500/20 rounded-md p-1':''}`}>
              {priorityOpts.map(p=><button key={p.v} type="button" onClick={()=>upd('pri',p.v)}
                className={`px-3.5 py-2.5 rounded-lg border-2 text-left transition-all ${fd.pri===p.v?p.activeCard:'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}>
                <div className="flex items-center gap-2 mb-0.5">
                  <div className={`w-2 h-2 rounded-full ${fd.pri===p.v?p.activeDot:'bg-slate-300'}`}/>
                  <span className={`text-[13px] font-semibold ${fd.pri===p.v?p.activeLabel:'text-slate-700'}`}>{p.v}</span>
                </div>
                <p className={`text-[11px] ml-4 ${fd.pri===p.v?p.activeHint:'text-slate-400'}`}>{p.desc}</p>
              </button>)}
            </div>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="ROI Type" tooltip="How will this campaign's success be measured?">
              <div className="flex gap-2">{['Revenue','Engagement'].map(t=><button key={t} type="button" onClick={()=>upd('roiType',t)} className={`flex-1 px-3 py-2 rounded-md border-2 text-[12px] font-medium transition-all ${fd.roiType===t?'bg-indigo-50 border-indigo-300 text-indigo-700':'text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-300'}`}>{t}</button>)}</div>
            </Field>
            <Field label="Expected Value" hintText={fd.roiType==='Revenue'?'Dollar amount or range':'Engagement metric'}>
              <input className={ic(false)} placeholder={fd.roiType==='Revenue'?'e.g., $1.5M':'e.g., 50K users'} value={fd.roiVal} onChange={e=>upd('roiVal',e.target.value)}/>
            </Field>
          </div>
        </Card>
      </>;

      case 4:return <>
        <Card title="Launch Timing" desc="When should this campaign go live?" icon="cal">
          <div className="grid grid-cols-4 gap-2.5">
            <Field label="Quarter"><select className={ic(false)} value={fd.quarter} onChange={e=>upd('quarter',e.target.value)}><option value="">--</option>{['Q1','Q2','Q3','Q4'].map(q=><option key={q}>{q}</option>)}</select></Field>
            <Field label="Period" tooltip="Albertsons 13-period fiscal calendar"><select className={ic(false)} value={fd.period} onChange={e=>upd('period',e.target.value)}><option value="">--</option>{Array.from({length:13},(_,i)=>`P${i+1}`).map(p=><option key={p}>{p}</option>)}</select></Field>
            <Field label="Week"><select className={ic(false)} value={fd.week} onChange={e=>upd('week',e.target.value)}><option value="">--</option>{['W1','W2','W3','W4'].map(w=><option key={w}>{w}</option>)}</select></Field>
            <Field label="Target Date" hintText="Exact launch date"><input type="date" className={ic(false)} value={fd.targetDate} onChange={e=>upd('targetDate',e.target.value)}/></Field>
          </div>
        </Card>
      </>;

      case 5:return <>
        <Card title="Channel Support" desc="Which distribution channels will be used?" icon="globe">
          <Field label="Channels" required hintText="Select all channels needed for this campaign." error={errA(fd.chSupport)} errorMsg="Select at least one channel">
            <ChipGroup options={CH_OPTS} selected={fd.chSupport} onToggle={v=>togArr('chSupport',v)} errState={errA(fd.chSupport)}/>
          </Field>
          {chLeads.length>0&&<div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-2.5 flex items-center gap-1.5"><I n="user" s={11} c="text-slate-400"/>Auto-assigned Channel Leads</p>
            <div className="grid grid-cols-2 gap-1.5">{chLeads.map(({ch,lead})=><div key={ch} className="flex items-center gap-2 bg-white rounded-md px-2.5 py-1.5 border border-slate-100">
              <div className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0"><span className="text-[7px] font-bold text-indigo-600">{lead.split(' ').map(x=>x[0]).join('')}</span></div>
              <div className="min-w-0"><p className="text-[11px] font-medium text-slate-700 truncate">{lead}</p><p className="text-[10px] text-slate-400">{ch}</p></div>
            </div>)}</div>
          </div>}
        </Card>
        <Card title="Marketing Channels" desc="Which messaging formats will be used?" icon="send">
          <ChipGroup options={MKT_CH} selected={fd.mktCh} onToggle={v=>togArr('mktCh',v)}/>
        </Card>
      </>;

      case 6:return <>
        <Card title="Campaign Type & Audience" desc="Define the campaign classification and target audience." icon="target">
          <Field label="Campaign Type" required tooltip="New: first-time. Existing: returning. Carry Forward: extension. Evergreen: always-on." error={err(fd.campType)} errorMsg="Select a campaign type">
            <div className="grid grid-cols-4 gap-2">
              {[
                {v:'New',desc:'First-time campaign',icon:'plus'},
                {v:'Existing',desc:'Returning campaign',icon:'layers'},
                {v:'Carry Forward',desc:'Extended from prior',icon:'chevR'},
                {v:'Evergreen',desc:'Always-on program',icon:'flag'}
              ].map(t=><button key={t.v} type="button" onClick={()=>upd('campType',t.v)}
                className={`px-2.5 py-2.5 rounded-lg border-2 text-center transition-all ${fd.campType===t.v?'bg-indigo-50 border-indigo-300 text-indigo-700':'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'}`}>
                <I n={t.icon} s={15} c={`mx-auto mb-1 ${fd.campType===t.v?'text-indigo-500':'text-slate-400'}`}/>
                <p className="text-[12px] font-semibold">{t.v}</p>
                <p className={`text-[10px] mt-0.5 ${fd.campType===t.v?'text-indigo-500':'text-slate-400'}`}>{t.desc}</p>
              </button>)}
            </div>
          </Field>
          <div className="border-t border-slate-100 pt-4">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-2.5">Audience Targeting</p>
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
        </Card>
      </>;

      case 7:return <>
        <Card title="Merchandising" desc="Upload vendor or BU merchandising files." icon="file">
          <UpZ field="merchFiles" label="Merchandising files" accept=".xlsx, .csv, .pdf" hintText="Max 25 MB per file"/>
          {fd.merchFiles.length>0&&<div className="bg-emerald-50/80 border border-emerald-200 rounded-lg p-3.5 anim-scale">
            <p className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wide mb-2.5 flex items-center gap-1.5"><I n="zap" s={11} c="text-emerald-600"/>Auto-extracted Data</p>
            <div className="grid grid-cols-2 gap-2 text-[12px]">
              {[['Merch Status','Accepted','check'],['UPC List','3 items','hash'],['U Offer IDs','UOF-2026-0451, 0452','file'],['4x Offer IDs','4X-2026-0891','file'],['Stock Up Event','SU-2026-Q1-003','flag']].map(([k,v,icon])=>
                <div key={k} className="flex items-center gap-2 bg-white rounded-md px-2.5 py-1.5 border border-emerald-100">
                  <I n={icon} s={12} c="text-emerald-500"/>
                  <div><p className="text-[10px] text-emerald-600 font-medium">{k}</p><p className="text-[11px] font-semibold text-emerald-800">{v}</p></div>
                </div>
              )}
            </div>
          </div>}
        </Card>
      </>;

      case 8:return <>
        {hasMedia?<Card title="Media Collective Assets" desc="Upload vendor materials and guidance documents." icon="layers" className="!border-violet-200">
          <div className="space-y-3">{Object.entries(MEDIA_FIELDS).map(([label,key])=><div key={key}><label className="text-[12px] font-medium text-violet-700 mb-1.5 block">{label}</label><UpZ field={key} label={label}/></div>)}</div>
        </Card>
        :<Card icon="layers">
          <div className="text-center py-4">
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center mx-auto mb-2"><I n="layers" s={16} c="text-slate-400"/></div>
            <p className="text-[13px] font-medium text-slate-500">Media Collective not required</p>
            <p className="text-[11px] text-slate-400 mt-1">Enable Media Collective in Channel Support (Step 6) to upload vendor materials.</p>
          </div>
        </Card>}
        <Card title="Brand & Creative" desc="Provide brand assets and specify the creative type." icon="sparkle">
          <Field label="Brand Assets" hintText="Paste a link to your VisID or brand guidelines.">
            <input className={ic(false)} placeholder="https://visid.albertsons.com/..." value={fd.brandAssets} onChange={e=>upd('brandAssets',e.target.value)}/>
          </Field>
          <Field label="Creative Development Type" required tooltip="In-Store: physical displays. Digital: email, web, app." error={err(fd.creativeType)} errorMsg="Select a creative type">
            <div className="grid grid-cols-3 gap-2">
              {['In-Store','Digital','Both'].map(t=><button key={t} type="button" onClick={()=>upd('creativeType',t)}
                className={`px-3.5 py-2.5 rounded-lg border-2 text-center transition-all ${fd.creativeType===t?'bg-indigo-50 border-indigo-300 text-indigo-700 font-semibold':'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 font-medium'} text-[12px]`}>
                {t}
              </button>)}
            </div>
          </Field>
          <Field label="Creative Files" hintText="Upload design files, mockups, or reference materials.">
            <UpZ field="creativeFiles" label="Creative files" accept=".psd, .ai, .png, .jpg, .pdf"/>
          </Field>
        </Card>
      </>;

      case 9:{
        const clean=v=>{if(!v||v==='')return null;if(Array.isArray(v)&&!v.length)return null;return String(v)};
        const reqBy=fd.byName?(fd.byLdap?`${fd.byName} (${fd.byLdap})`:fd.byName):null;
        const secs=[
          [0,'Project Basics','hash',[['Campaign Name',fd.projectName],['Description',clean(fd.projectDesc)]]],
          [1,'Organization & Requester','briefcase',[['Business Unit',fd.bu],['Banners',fd.banners.length?fd.banners.join(', '):null],['Requested By',reqBy]]],
          [2,'Assignment','target',[['Marketing Team',fd.mr],['Representative',fd.rep]]],
          [3,'Priority','zap',[['Priority',fd.pri],['ROI',clean(fd.roiVal)?`${fd.roiType}: ${fd.roiVal}`:fd.roiType]]],
          [4,'Launch Timing','cal',[['Launch Window',[fd.quarter,fd.period,fd.week].filter(Boolean).join(' ')||null],['Target Date',clean(fd.targetDate)]]],
          [5,'Channels','globe',[['Distribution Channels',fd.chSupport.length?fd.chSupport.join(', '):null],['Marketing Channels',fd.mktCh.length?fd.mktCh.join(', '):null]]],
          [6,'Campaign Type & Audience','target',[['Type',fd.campType],['Target Banner',clean(fd.audBanner)],['Segment',clean(fd.segDef)],['Targeting Criteria',clean(fd.targetCriteria)]]],
          [7,'Merchandising','file',[['Merch Files',fd.merchFiles.length?`${fd.merchFiles.length} file(s) uploaded`:null]]],
          [8,'Assets & Creative','sparkle',[['Creative Type',clean(fd.creativeType)],['Brand Assets',clean(fd.brandAssets)],['Creative Files',fd.creativeFiles.length?`${fd.creativeFiles.length} file(s) uploaded`:null]]]
        ];
        return <>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3.5 flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-md bg-amber-100 flex items-center justify-center flex-shrink-0"><I n="eye" s={14} c="text-amber-600"/></div>
            <div><p className="text-[13px] font-semibold text-amber-800">Review before submitting</p><p className="text-[11px] text-amber-600 mt-0.5">Double-check all details below. Click <strong>Edit</strong> on any section to make changes.</p></div>
          </div>
          {secs.map(([si,t,icon,items])=>{
            const filled=items.filter(([_,v])=>v);
            if(!filled.length)return null;
            return <div key={t} className="bg-white rounded-lg border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <I n={icon} s={13} c="text-slate-400"/>
                  <span className="text-[12px] font-semibold text-slate-700">{t}</span>
                </div>
                <button onClick={()=>goTo(si)} className="text-[11px] text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-1 hover:underline"><I n="edit" s={11}/>Edit</button>
              </div>
              <div className="px-4 py-3">
                <dl className="grid grid-cols-2 gap-x-5 gap-y-2.5">
                  {filled.map(([k,v])=><div key={k}>
                    <dt className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">{k}</dt>
                    <dd className="text-[12px] text-slate-800 font-medium mt-0.5 leading-relaxed">{v}</dd>
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
      {/* ═══ STEP TIMELINE ═══ */}
      <aside className="min-w-0 rounded-lg border border-slate-200 bg-white p-3 shadow-[0_2px_14px_rgba(15,23,42,0.04)] overflow-y-auto scrollbar-thin">
        <div className="mb-2.5 flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">Steps</p>
          <span className="text-[10px] font-semibold text-indigo-600 rounded-md border border-indigo-100 bg-indigo-50 px-1.5 py-0.5">{progress}%</span>
        </div>
        <div className="relative">
          <div className="absolute left-[17px] top-2 bottom-2 w-px bg-slate-200"/>
          <div className="relative space-y-1.5 pr-0.5 pb-1">
            {STEPS.map((s,i)=>{
              const isCurrent=i===step;
              const isDone=i<step&&isStepComplete(i);
              const isClickable=i<step;
              return <button key={i} type="button" onClick={()=>{if(isClickable)goTo(i)}} className={`w-full min-h-[50px] rounded-md border px-2 py-1.5 flex items-start gap-2 text-left transition-all ${
                isCurrent?'bg-indigo-50 border-indigo-100':
                isDone?'bg-emerald-50/60 border-emerald-100':
                'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              } ${isClickable?'cursor-pointer':'cursor-default'}`}>
                <span className={`w-7 h-7 rounded-full border flex items-center justify-center text-[11px] font-semibold flex-shrink-0 mt-0.5 ${
                  isDone?'bg-emerald-50 border-emerald-300 text-emerald-600':
                  isCurrent?'bg-indigo-600 border-indigo-600 text-white':
                  'bg-white border-slate-300 text-slate-500'
                }`}>
                  {isDone?<I n="check" s={12}/>:i+1}
                </span>
                <span className="pt-0.5 min-w-0">
                  <span className={`block text-[12px] leading-[1.15] ${isCurrent?'text-slate-900 font-semibold':'text-slate-700 font-medium'}`}>{s.name}</span>
                  <span className={`block text-[10px] mt-0.5 leading-[1.15] ${isCurrent?'text-slate-500':'text-slate-400'}`}>{s.desc}</span>
                </span>
              </button>;
            })}
          </div>
        </div>
      </aside>

      {/* ═══ STEP CONTENT ═══ */}
      <section className="min-w-0 rounded-lg border border-slate-200 bg-white flex flex-col overflow-hidden shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
        <div className="px-4 py-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-md bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 flex-shrink-0">
              <I n={STEPS[step].icon} s={14}/>
            </span>
            <div className="min-w-0">
              <h3 className="text-[15px] font-semibold text-slate-900 leading-tight">{STEPS[step].name}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5 truncate">{STEPS[step].desc}</p>
            </div>
            <span className="ml-auto text-[10px] font-medium text-slate-500 rounded-full border border-slate-200 px-2 py-0.5 whitespace-nowrap">Step {step+1}/{STEPS.length}</span>
          </div>
        </div>

        <div ref={contentRef} className="flex-1 overflow-y-auto scrollbar-thin px-4 py-3">
          <div key={step} className={`intake-map space-y-4 pb-2 ${dir>=0?'anim-fwd':'anim-back'}`}>{renderStep()}</div>
        </div>
      </section>
    </div>

    <div className="intake-shell-footer sticky bottom-0 mt-2 rounded-md border border-slate-200 px-3 py-2 flex items-center shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
      {!isCurrentStepValid&&attempted.has(step)&&currentReqs.length>0&&<span className="text-[11px] text-rose-500 flex items-center gap-1 mr-auto"><I n="alert" s={11}/>{missingReqs.length} required {missingReqs.length===1?'field':'fields'} remaining</span>}
      {(isCurrentStepValid||!attempted.has(step)||currentReqs.length===0)&&<span className="mr-auto text-[11px] text-slate-400 hidden sm:inline">Press <kbd className="kbd">Enter</kbd> to continue</span>}
      <div className="flex items-center gap-2">
        <button type="button" onClick={prev} disabled={step===0} className={`px-3 py-1.5 rounded-md border text-[12px] font-medium transition-colors ${step>0?'border-slate-200 text-slate-600 hover:bg-slate-50':'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed'}`}>Prev</button>
        {step<9&&<button type="button" data-next-btn onClick={next} disabled={!isCurrentStepValid} className={`px-3.5 py-1.5 rounded-md text-[12px] font-semibold transition-colors ${isCurrentStepValid?'bg-indigo-600 text-white hover:bg-indigo-700':'bg-indigo-200 text-white cursor-not-allowed'}`}>Next</button>}
        {step===9&&<button type="button" onClick={submit} disabled={isSubmitting} className={`px-3.5 py-1.5 rounded-md text-[12px] font-semibold transition-colors ${isSubmitting?'bg-emerald-200 text-white cursor-wait':'bg-emerald-600 text-white hover:bg-emerald-700'}`}>{isSubmitting?'Creating...':'Create Campaign'}</button>}
      </div>
    </div>
  </div>;
};


export default function IntakePage({ onSubmit, onInput }) {
  return <div className="anim-fade h-[calc(100vh-148px)] flex flex-col min-h-0" onInput={onInput}>
    <div className="mb-3 shrink-0">
      <h1 className="text-[15px] font-semibold text-[#f8f8f8]">New Campaign Request</h1>
      <p className="text-[12px] text-[#888]">Complete the intake form to submit a new marketing campaign for review.</p>
    </div>
    <div className="flex-1 min-h-0">
      <IntakeForm onSubmit={onSubmit} />
    </div>
  </div>;
}
