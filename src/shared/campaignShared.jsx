import { useState } from 'react';
import {
  LayoutGrid, Menu, Bell, Plus, Columns3, Calendar, Search, X, Check,
  Upload, ChevronRight, ChevronLeft, Clock, TrendingUp, FileText, Layers,
  Eye, Flag, Send, BarChart3, Trash2, Pencil, AlertCircle, User, Settings,
  LogOut, Info, Target, Zap, Hash, Globe, Briefcase, Sparkles, Sun, Moon
} from 'lucide-react';

export const STAGES=[
  {key:'intake',label:'Intake Submitted',color:'bg-slate-400',text:'text-slate-700',bg:'bg-slate-50',hex:'#94a3b8'},
  {key:'review',label:'Under Review',color:'bg-amber-400',text:'text-amber-700',bg:'bg-amber-50',hex:'#fbbf24'},
  {key:'planning',label:'Planning',color:'bg-blue-400',text:'text-blue-700',bg:'bg-blue-50',hex:'#60a5fa'},
  {key:'strategy',label:'Strategy',color:'bg-violet-400',text:'text-violet-700',bg:'bg-violet-50',hex:'#a78bfa'},
  {key:'creative',label:'Creative Dev',color:'bg-pink-400',text:'text-pink-700',bg:'bg-pink-50',hex:'#f472b6'},
  {key:'execution',label:'Execution',color:'bg-orange-400',text:'text-orange-700',bg:'bg-orange-50',hex:'#fb923c'},
  {key:'live',label:'Live',color:'bg-emerald-400',text:'text-emerald-700',bg:'bg-emerald-50',hex:'#34d399'},
];
export const BUS=['Divisions','DINE','Corporate','Pharmacy','Own Brands'];
export const BANNERS=['Safeway','Vons','Albertsons','Jewel-Osco',"Shaw's",'Acme','Tom Thumb','Randalls'];
export const MKT_RES={'Integrated Marketing':'Lauren Hannigan','ESE':'Lisa Smith','Brand Marketing':'David Park','Customer Engagement':'Sarah Johnson'};
export const CH_OPTS=['CRM','Digital Merch','Local Pages','Paid Media','In-Store','Circular','Media Collective'];
export const CH_LEADS={'CRM':'Jennifer Martinez','Digital Merch':'Robert Kim','Local Pages':'Amanda Foster','Paid Media':'Chris Thompson','In-Store':'Diana Ramirez','Circular':'Brian Walsh','Media Collective':'Nicole Patel'};
export const MKT_CH=['Email','Push','SMS','In-Store','Web/App Home Pages'];
export const PRI_CLS={High:'bg-red-50 text-red-700 border-red-200',Medium:'bg-amber-50 text-amber-700 border-amber-200',Low:'bg-sky-50 text-sky-700 border-sky-200'};
export const MEDIA_FIELDS={'Vendor Style Guide':'vendorGuide','ISAN Scripts':'isanScripts','AMC Guidance':'amcGuidance'};
export const CURRENT_USER = { name: 'Lauren Hannigan', initials: 'LH', title: 'VP, Integrated Marketing' };
export const parseDate=(s)=>{const[y,m,d]=(s||'').split('-').map(Number);return{y,m:m-1,d}};

export const STAGE_APPROVALS = {
  intake: [
    { key: 'intake-form', label: 'Intake form submitted', assignee: 'Requester' },
    { key: 'bu-confirm', label: 'Business unit confirmed', assignee: 'BU Director' },
    { key: 'req-verify', label: 'Requester identity verified', assignee: 'System' },
  ],
  review: [
    { key: 'mkt-review', label: 'Marketing team review', assignee: 'Lauren Hannigan' },
    { key: 'budget-approve', label: 'Budget allocation approved', assignee: 'Finance — Greg Harmon' },
    { key: 'pri-validate', label: 'Priority validated', assignee: 'David Park' },
    { key: 'ch-feasible', label: 'Channel feasibility confirmed', assignee: 'Nicole Patel' },
  ],
  planning: [
    { key: 'brief-signoff', label: 'Campaign brief signed off', assignee: 'Lauren Hannigan' },
    { key: 'timeline-approve', label: 'Timeline approved', assignee: 'Sarah Johnson' },
    { key: 'leads-assigned', label: 'Channel leads assigned', assignee: 'Jennifer Martinez' },
    { key: 'aud-finalized', label: 'Audience segments finalized', assignee: 'Robert Kim' },
  ],
  strategy: [
    { key: 'creative-strat', label: 'Creative strategy approved', assignee: 'David Park' },
    { key: 'media-plan', label: 'Media plan reviewed', assignee: 'Chris Thompson' },
    { key: 'vendor-contracts', label: 'Vendor contracts signed', assignee: 'Legal — Patricia Lee' },
    { key: 'roi-validate', label: 'ROI targets validated', assignee: 'Finance — Greg Harmon' },
  ],
  creative: [
    { key: 'hero-assets', label: 'Hero assets approved', assignee: 'David Park' },
    { key: 'email-review', label: 'Email templates reviewed', assignee: 'Lisa Smith' },
    { key: 'store-signage', label: 'In-store signage approved', assignee: 'Diana Ramirez' },
    { key: 'legal-review', label: 'Legal & compliance review', assignee: 'Legal — Patricia Lee' },
    { key: 'creative-signoff', label: 'Final creative sign-off', assignee: 'Lauren Hannigan' },
  ],
  execution: [
    { key: 'assets-deploy', label: 'Assets deployed to channels', assignee: 'Robert Kim' },
    { key: 'qa-test', label: 'QA testing complete', assignee: 'Lisa Smith' },
    { key: 'go-nogo', label: 'Stakeholder go / no-go', assignee: 'Lauren Hannigan' },
    { key: 'launch-ready', label: 'Launch readiness checklist', assignee: 'Sarah Johnson' },
  ],
  live: [
    { key: 'launched', label: 'Campaign launched', assignee: 'System' },
    { key: 'perf-monitor', label: 'Performance monitoring active', assignee: 'Lisa Smith' },
    { key: 'post-review', label: 'Post-launch review scheduled', assignee: 'Lauren Hannigan' },
  ],
};

export const CAMPS=[
  {id:1,name:'Q1 Stock Up Sale',desc:'Major quarterly stock-up promotion targeting all loyalty members with deep discounts on pantry essentials.',bu:'Divisions',banners:['Safeway','Vons','Albertsons','Jewel-Osco'],by:{n:'Michael Chen',l:'mchen42'},mr:'Integrated Marketing',rep:'Lauren Hannigan',pri:'High',roi:'$2.4M',roiT:'Revenue',q:'Q1',p:'P3',w:'W2',date:'2026-03-15',ch:['CRM','Digital Merch','In-Store','Circular'],mch:['Email','Push','In-Store'],ct:'New',stage:'creative',days:3,created:'2026-01-28',aud:'All loyalty members, high-value shoppers',status:'On Track'},
  {id:2,name:'March Madness Promo',desc:'Basketball-themed promotional campaign with game-day snack bundles and party supplies.',bu:'DINE',banners:['Safeway','Vons'],by:{n:'Sarah Park',l:'spark15'},mr:'Brand Marketing',rep:'David Park',pri:'Medium',roi:'$850K',roiT:'Revenue',q:'Q1',p:'P3',w:'W1',date:'2026-03-08',ch:['CRM','Paid Media','Digital Merch'],mch:['Email','Push','Web/App Home Pages'],ct:'Existing',stage:'planning',days:5,created:'2026-02-01',aud:'Sports enthusiasts, party shoppers',status:'On Track'},
  {id:3,name:'Fresh For Spring',desc:'Seasonal produce and fresh department campaign highlighting organic and locally sourced items.',bu:'Own Brands',banners:['Albertsons','Safeway','Vons'],by:{n:'Lisa Wong',l:'lwong88'},mr:'Integrated Marketing',rep:'Lauren Hannigan',pri:'High',roi:'$1.8M',roiT:'Revenue',q:'Q1',p:'P4',w:'W1',date:'2026-03-22',ch:['CRM','In-Store','Digital Merch','Local Pages'],mch:['Email','In-Store','Web/App Home Pages'],ct:'New',stage:'execution',days:1,created:'2026-01-15',aud:'Health-conscious shoppers, organic buyers',status:'On Track'},
  {id:4,name:'Pharmacy Wellness Week',desc:'Week-long pharmacy promotion with free health screenings and vitamin discounts.',bu:'Pharmacy',banners:['Safeway','Albertsons','Jewel-Osco'],by:{n:'James Rivera',l:'jrivera22'},mr:'Customer Engagement',rep:'Sarah Johnson',pri:'Medium',roi:'$420K',roiT:'Engagement',q:'Q1',p:'P2',w:'W3',date:'2026-02-28',ch:['CRM','In-Store','Local Pages'],mch:['Email','Push','SMS','In-Store'],ct:'New',stage:'review',days:4,created:'2026-02-10',aud:'Pharmacy customers, health-focused segments',status:'Pending Info'},
  {id:5,name:'Own Brands Discovery',desc:'Awareness campaign for private label product line expansion into snacks and beverages.',bu:'Own Brands',banners:['All Banners'],by:{n:'Tom Bradley',l:'tbradley7'},mr:'Brand Marketing',rep:'David Park',pri:'Low',roi:'$600K',roiT:'Engagement',q:'Q2',p:'P1',w:'W1',date:'2026-04-05',ch:['Digital Merch','Paid Media'],mch:['Web/App Home Pages','Push'],ct:'New',stage:'intake',days:2,created:'2026-02-16',aud:'Value shoppers, brand explorers',status:'New'},
  {id:6,name:'Summer BBQ Kickoff',desc:'Memorial Day weekend BBQ campaign with grilling essentials, outdoor dining, and seasonal beverages.',bu:'Divisions',banners:['Safeway','Vons','Tom Thumb','Randalls'],by:{n:'Karen Mitchell',l:'kmitch33'},mr:'Integrated Marketing',rep:'Lauren Hannigan',pri:'High',roi:'$3.1M',roiT:'Revenue',q:'Q2',p:'P1',w:'W2',date:'2026-05-20',ch:['CRM','In-Store','Circular','Paid Media','Digital Merch'],mch:['Email','Push','SMS','In-Store','Web/App Home Pages'],ct:'New',stage:'strategy',days:6,created:'2026-02-05',aud:'Families, outdoor enthusiasts',status:'On Track'},
  {id:7,name:'Back to School Savings',desc:'Back-to-school lunchbox essentials and family meal solutions campaign.',bu:'Corporate',banners:['All Banners'],by:{n:'Amy Rodriguez',l:'arodrig9'},mr:'Integrated Marketing',rep:'Lauren Hannigan',pri:'Medium',roi:'$1.2M',roiT:'Revenue',q:'Q3',p:'P1',w:'W1',date:'2026-07-15',ch:['CRM','Digital Merch','Circular'],mch:['Email','Push','Web/App Home Pages'],ct:'Carry Forward',stage:'planning',days:8,created:'2026-01-20',aud:'Families with school-age children',status:'On Track'},
  {id:8,name:'Digital Coupon Blitz',desc:'Flash digital coupon event with exclusive app-only deals and double fuel points.',bu:'DINE',banners:['Safeway','Vons','Albertsons'],by:{n:'Derek Nguyen',l:'dnguyen5'},mr:'ESE',rep:'Lisa Smith',pri:'High',roi:'$950K',roiT:'Revenue',q:'Q1',p:'P2',w:'W1',date:'2026-02-08',ch:['CRM','Digital Merch'],mch:['Email','Push','SMS','Web/App Home Pages'],ct:'Existing',stage:'live',days:10,created:'2026-01-10',aud:'App users, digital-first shoppers',status:'Live'},
  {id:9,name:'Flu Season Prep',desc:'Preventive health campaign promoting flu shots, immune boosters, and wellness products.',bu:'Pharmacy',banners:['Safeway','Albertsons',"Shaw's"],by:{n:'Patricia Lee',l:'plee44'},mr:'Customer Engagement',rep:'Sarah Johnson',pri:'Medium',roi:'$380K',roiT:'Engagement',q:'Q3',p:'P2',w:'W1',date:'2026-09-01',ch:['CRM','In-Store','Local Pages'],mch:['Email','SMS','In-Store'],ct:'Evergreen',stage:'intake',days:1,created:'2026-02-17',aud:'All customers, seniors, families',status:'New'},
  {id:10,name:'Holiday Gift Guide',desc:'Curated gift basket and holiday entertaining guide with premium product selections.',bu:'Corporate',banners:['All Banners'],by:{n:'Robert Chang',l:'rchang18'},mr:'Integrated Marketing',rep:'Lauren Hannigan',pri:'High',roi:'$4.2M',roiT:'Revenue',q:'Q4',p:'P1',w:'W1',date:'2026-11-15',ch:['CRM','Digital Merch','In-Store','Circular','Paid Media'],mch:['Email','Push','Web/App Home Pages','In-Store'],ct:'Existing',stage:'review',days:3,created:'2026-02-12',aud:'Gift shoppers, premium segment',status:'On Track'},
  {id:11,name:'Weekly Value Drops',desc:'Ongoing weekly value campaign with rotating deep discounts on everyday essentials.',bu:'Divisions',banners:['All Banners'],by:{n:'Steve Brown',l:'sbrown62'},mr:'ESE',rep:'Lisa Smith',pri:'Low',roi:'$1.5M',roiT:'Revenue',q:'Q1',p:'P1',w:'W1',date:'2026-01-05',ch:['CRM','Digital Merch'],mch:['Email','Web/App Home Pages'],ct:'Evergreen',stage:'live',days:44,created:'2025-12-15',aud:'All loyalty members',status:'Live'},
  {id:12,name:'Loyalty Double Points',desc:'Limited-time double fuel points promotion for loyalty card holders.',bu:'Corporate',banners:['Safeway','Vons','Albertsons','Jewel-Osco'],by:{n:'Michelle Torres',l:'mtorres3'},mr:'Customer Engagement',rep:'Sarah Johnson',pri:'Medium',roi:'$780K',roiT:'Engagement',q:'Q1',p:'P3',w:'W3',date:'2026-03-18',ch:['CRM','Digital Merch','In-Store'],mch:['Email','Push','In-Store'],ct:'Existing',stage:'creative',days:5,created:'2026-02-03',aud:'Loyalty members, fuel rewards users',status:'On Track'},
  {id:13,name:'Organic & Natural Month',desc:'Month-long celebration of organic and natural products with tastings.',bu:'Own Brands',banners:['Safeway','Vons','Albertsons'],by:{n:'Jennifer Adams',l:'jadams27'},mr:'Brand Marketing',rep:'David Park',pri:'Medium',roi:'$920K',roiT:'Revenue',q:'Q2',p:'P2',w:'W1',date:'2026-05-01',ch:['CRM','In-Store','Digital Merch','Local Pages'],mch:['Email','In-Store','Web/App Home Pages'],ct:'New',stage:'strategy',days:4,created:'2026-02-08',aud:'Organic buyers, health-conscious shoppers',status:'On Track'},
  {id:14,name:'Deli Fresh Launch',desc:'Launch campaign for new artisan deli line with sampling events.',bu:'DINE',banners:['Safeway','Jewel-Osco','Acme'],by:{n:'Kevin Park',l:'kpark55'},mr:'Integrated Marketing',rep:'Lauren Hannigan',pri:'High',roi:'$1.1M',roiT:'Revenue',q:'Q1',p:'P4',w:'W2',date:'2026-03-28',ch:['CRM','In-Store','Local Pages','Digital Merch'],mch:['Email','Push','In-Store'],ct:'New',stage:'planning',days:3,created:'2026-02-13',aud:'Deli customers, food enthusiasts',status:'On Track'},
  {id:15,name:'Pet Care Awareness',desc:'Pet care product promotion with partner brand collaborations.',bu:'Own Brands',banners:['Safeway','Vons'],by:{n:'Diana Foster',l:'dfoster8'},mr:'Brand Marketing',rep:'David Park',pri:'Low',roi:'$340K',roiT:'Engagement',q:'Q2',p:'P3',w:'W1',date:'2026-06-10',ch:['CRM','Digital Merch'],mch:['Email','Web/App Home Pages'],ct:'New',stage:'intake',days:1,created:'2026-02-17',aud:'Pet owners',status:'New'},
  {id:16,name:'Easter Celebration',desc:'Easter holiday campaign with seasonal bakery, candy promotions, and meal solutions.',bu:'Divisions',banners:['All Banners'],by:{n:'Nancy Kim',l:'nkim91'},mr:'Integrated Marketing',rep:'Lauren Hannigan',pri:'High',roi:'$2.8M',roiT:'Revenue',q:'Q1',p:'P4',w:'W1',date:'2026-04-01',ch:['CRM','In-Store','Circular','Digital Merch','Paid Media'],mch:['Email','Push','SMS','In-Store','Web/App Home Pages'],ct:'Existing',stage:'review',days:2,created:'2026-02-14',aud:'Families, holiday shoppers',status:'On Track'},
  {id:17,name:'Cinco de Mayo Fiesta',desc:'Cultural celebration featuring Hispanic food brands, recipes, and party supplies.',bu:'DINE',banners:['Safeway','Vons','Albertsons','Tom Thumb','Randalls'],by:{n:'Maria Gonzalez',l:'mgonz14'},mr:'Brand Marketing',rep:'David Park',pri:'Medium',roi:'$720K',roiT:'Revenue',q:'Q2',p:'P2',w:'W2',date:'2026-05-03',ch:['CRM','In-Store','Local Pages','Paid Media'],mch:['Email','Push','In-Store'],ct:'Existing',stage:'strategy',days:3,created:'2026-02-09',aud:'Hispanic community, party shoppers',status:'On Track'},
  {id:18,name:'Memorial Day Weekend',desc:'Memorial Day sale with outdoor grilling, summer entertaining, and patriotic themes.',bu:'Corporate',banners:['All Banners'],by:{n:'Bill Thompson',l:'bthom29'},mr:'Integrated Marketing',rep:'Lauren Hannigan',pri:'High',roi:'$2.1M',roiT:'Revenue',q:'Q2',p:'P3',w:'W1',date:'2026-05-22',ch:['CRM','In-Store','Circular','Digital Merch','Paid Media'],mch:['Email','Push','SMS','In-Store','Web/App Home Pages'],ct:'New',stage:'planning',days:2,created:'2026-02-15',aud:'All customers, families',status:'On Track'},
  {id:19,name:"St. Patrick's Day Deals",desc:"St. Patrick's Day themed promotions featuring green-tagged discounts and Irish food specials.",bu:'Divisions',banners:['Safeway','Vons','Jewel-Osco'],by:{n:'Connor Walsh',l:'cwalsh11'},mr:'Brand Marketing',rep:'David Park',pri:'Medium',roi:'$680K',roiT:'Revenue',q:'Q1',p:'P3',w:'W2',date:'2026-03-15',ch:['CRM','In-Store','Digital Merch'],mch:['Email','Push','In-Store'],ct:'Existing',stage:'execution',days:3,created:'2026-02-06',aud:'All customers, holiday shoppers',status:'On Track'},
  {id:20,name:'Snack Aisle Refresh',desc:'Repositioning and promotion of new snack SKUs across all banners with endcap displays.',bu:'Own Brands',banners:['Safeway','Albertsons','Acme'],by:{n:'Rachel Kim',l:'rkim34'},mr:'Brand Marketing',rep:'David Park',pri:'Low',roi:'$410K',roiT:'Engagement',q:'Q1',p:'P4',w:'W1',date:'2026-03-22',ch:['In-Store','Digital Merch'],mch:['Web/App Home Pages','In-Store'],ct:'New',stage:'planning',days:2,created:'2026-02-11',aud:'Snack buyers, families',status:'On Track'},
  {id:21,name:'Vendor Co-Op Push',desc:'Coordinated vendor co-op campaign with top CPG partners for incremental display funding.',bu:'Corporate',banners:['All Banners'],by:{n:'Greg Harmon',l:'gharm08'},mr:'ESE',rep:'Lisa Smith',pri:'High',roi:'$1.6M',roiT:'Revenue',q:'Q1',p:'P3',w:'W1',date:'2026-03-10',ch:['CRM','Digital Merch','Paid Media'],mch:['Email','Web/App Home Pages'],ct:'New',stage:'creative',days:4,created:'2026-02-04',aud:'All loyalty members',status:'On Track'},
  {id:22,name:'Fresh Meal Kits Launch',desc:'Launch of new ready-to-cook meal kit line in fresh department with sampling events.',bu:'DINE',banners:['Safeway','Vons'],by:{n:'Tina Zhao',l:'tzhao19'},mr:'Integrated Marketing',rep:'Lauren Hannigan',pri:'Medium',roi:'$720K',roiT:'Revenue',q:'Q1',p:'P3',w:'W1',date:'2026-03-11',ch:['CRM','In-Store','Local Pages'],mch:['Email','Push','In-Store'],ct:'New',stage:'strategy',days:2,created:'2026-02-07',aud:'Busy families, cooking enthusiasts',status:'On Track'},
  {id:23,name:'Wellness Wednesday',desc:'Weekly wellness initiative with discounted health foods and pharmacy tie-ins every Wednesday.',bu:'Pharmacy',banners:['Safeway','Albertsons',"Shaw's"],by:{n:'Anita Patel',l:'apatel22'},mr:'Customer Engagement',rep:'Sarah Johnson',pri:'Medium',roi:'$350K',roiT:'Engagement',q:'Q1',p:'P3',w:'W1',date:'2026-03-12',ch:['CRM','In-Store','Local Pages'],mch:['Email','SMS','In-Store'],ct:'Evergreen',stage:'live',days:1,created:'2026-01-25',aud:'Health-conscious shoppers',status:'Live'},
  {id:24,name:'Digital Flyer Drop',desc:'Mid-month digital flyer distribution with personalized offers based on purchase history.',bu:'DINE',banners:['Safeway','Vons','Albertsons','Jewel-Osco'],by:{n:'Mark Sullivan',l:'msull16'},mr:'ESE',rep:'Lisa Smith',pri:'Low',roi:'$520K',roiT:'Revenue',q:'Q1',p:'P3',w:'W2',date:'2026-03-13',ch:['CRM','Digital Merch'],mch:['Email','Push','Web/App Home Pages'],ct:'Existing',stage:'execution',days:1,created:'2026-02-10',aud:'Digital-first shoppers, app users',status:'On Track'},
  {id:25,name:'Baby & Toddler Week',desc:'Week-long promotion on baby essentials, diapers, formula, and toddler snacks.',bu:'Own Brands',banners:['Safeway','Vons','Albertsons'],by:{n:'Heather Moore',l:'hmoore41'},mr:'Brand Marketing',rep:'David Park',pri:'Medium',roi:'$480K',roiT:'Revenue',q:'Q1',p:'P3',w:'W2',date:'2026-03-18',ch:['CRM','Digital Merch','In-Store'],mch:['Email','Push','Web/App Home Pages'],ct:'New',stage:'review',days:5,created:'2026-02-09',aud:'Parents, expecting families',status:'On Track'},
  {id:26,name:'Spring Break Blowout',desc:'Three-day spring break flash sale with rotating category deals and doorbusters each day.',bu:'Divisions',banners:['Safeway','Vons','Albertsons','Jewel-Osco'],by:{n:'Alex Turner',l:'aturn07'},mr:'Integrated Marketing',rep:'Lauren Hannigan',pri:'High',roi:'$1.9M',roiT:'Revenue',q:'Q1',p:'P4',w:'W1',date:'2026-03-24',ch:['CRM','Digital Merch','In-Store','Paid Media'],mch:['Email','Push','SMS','In-Store','Web/App Home Pages'],ct:'New',stage:'creative',span:3,days:3,created:'2026-02-12',aud:'All customers, deal seekers',status:'On Track'},
];

/* ═══ ICONS (Lucide) ═══ */
const ICON_MAP={
  grid:LayoutGrid,menu:Menu,bell:Bell,plus:Plus,kanban:Columns3,cal:Calendar,
  search:Search,x:X,check:Check,upload:Upload,chevR:ChevronRight,chevL:ChevronLeft,
  clock:Clock,trendUp:TrendingUp,file:FileText,layers:Layers,eye:Eye,flag:Flag,
  send:Send,bar:BarChart3,trash:Trash2,edit:Pencil,alert:AlertCircle,user:User,
  settings:Settings,logout:LogOut,info:Info,target:Target,zap:Zap,hash:Hash,
  globe:Globe,briefcase:Briefcase,sparkle:Sparkles,sun:Sun,moon:Moon,
};
export const I=({n,s=16,c=''})=>{
  const Ic=ICON_MAP[n];
  if(!Ic)return null;
  return <Ic size={s} className={c} />;
};
export const Badge=({children,cls})=><span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${cls}`}>{children}</span>;
export const FieldErr=({show,msg})=>show?<p className="text-[11px] text-rose-500 mt-1.5 flex items-center gap-1"><I n="alert" s={11} c="text-rose-500"/>{msg||'Required'}</p>:null;

/* ═══ FORM CARD SECTION ═══ */
export const Card = ({ title, desc, children, className = '', complete, icon }) => (
  <div
    className={`rounded-xl border card-focus overflow-hidden ${className}`}
    style={{ background: 'var(--sb-panel)', borderColor: 'var(--sb-border-soft)', boxShadow: 'var(--sb-shadow-sm)' }}
  >
    {title && (
      <div className="px-4 py-3.5 border-b flex items-start justify-between" style={{ borderColor: 'var(--sb-border-soft)' }}>
        <div className="flex items-start gap-2.5">
          {icon && (
            <div
              className="w-7 h-7 rounded-md border flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: 'var(--sb-panel-2)', borderColor: 'var(--sb-border)' }}
            >
              <I n={icon} s={14} c="text-[var(--sb-muted)]" />
            </div>
          )}
          <div>
            <h3 className="text-[13px] font-semibold text-[var(--sb-text-strong)] leading-tight">{title}</h3>
            {desc && <p className="text-[11px] text-[var(--sb-muted-soft)] mt-0.5 leading-relaxed">{desc}</p>}
          </div>
        </div>
        {complete && (
          <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--sb-accent-soft)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--sb-accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="check-anim"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
        )}
      </div>
    )}
    <div className="px-4 py-3.5 space-y-3.5">{children}</div>
  </div>
);

/* ═══ TOOLTIP ═══ */
export const Tip=({text,children})=>{
  const [show,setShow]=useState(false);
  return <span className="relative inline-flex" onMouseEnter={()=>setShow(true)} onMouseLeave={()=>setShow(false)}>
    {children}
    {show&&<span
      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 text-[11px] rounded-md whitespace-nowrap z-50 leading-relaxed max-w-[240px] text-center border"
      style={{ background: 'var(--sb-panel)', color: 'var(--sb-text)', borderColor: 'var(--sb-border)', boxShadow: 'var(--sb-shadow-md)' }}
    >{text}<span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent" style={{ borderTopColor: 'var(--sb-panel)' }}/></span>}
  </span>;
};
