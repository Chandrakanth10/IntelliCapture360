import { useState } from 'react';

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

/* ═══ ICONS ═══ */
export const I=({n,s=16,c=''})=>{
  const p={
    grid:<><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
    menu:<><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>,
    bell:<><path d="M18 8a6 6 0 00-12 0c0 7-3 8-3 8h18s-3-1-3-8"/><path d="M10.73 20a2 2 0 002.54 0"/></>,
    plus:<><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    kanban:<><rect x="4" y="3" width="4" height="18" rx="1"/><rect x="10" y="3" width="4" height="13" rx="1"/><rect x="16" y="3" width="4" height="16" rx="1"/></>,
    cal:<><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
    search:<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    x:<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    check:<><polyline points="20 6 9 17 4 12"/></>,
    upload:<><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></>,
    chevR:<><polyline points="9 18 15 12 9 6"/></>,
    chevL:<><polyline points="15 18 9 12 15 6"/></>,
    clock:<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    trendUp:<><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></>,
    file:<><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
    layers:<><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></>,
    eye:<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    flag:<><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></>,
    send:<><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>,
    bar:<><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
    trash:<><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></>,
    edit:<><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    alert:<><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>,
    user:<><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    settings:<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33h.01a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51h.01a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.01a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></>,
    logout:<><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></>,
    info:<><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></>,
    target:<><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>,
    zap:<><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>,
    hash:<><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></>,
    globe:<><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></>,
    briefcase:<><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></>,
    sparkle:<><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></>,
  };
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={c}>{p[n]}</svg>;
};
export const Badge=({children,cls})=><span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${cls}`}>{children}</span>;
export const FieldErr=({show,msg})=>show?<p className="text-[11px] text-rose-500 mt-1.5 flex items-center gap-1"><I n="alert" s={11} c="text-rose-500"/>{msg||'Required'}</p>:null;

/* ═══ FORM CARD SECTION ═══ */
export const Card=({title,desc,children,className='',complete,icon})=>(
  <div className={`bg-white rounded-lg border border-slate-200 card-focus overflow-hidden ${className}`}>
    {title&&<div className="px-4 py-3 border-b border-slate-100 flex items-start justify-between">
      <div className="flex items-start gap-2.5">
        {icon&&<div className="w-7 h-7 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5"><I n={icon} s={14} c="text-slate-400"/></div>}
        <div><h3 className="text-[13px] font-semibold text-slate-900 leading-tight">{title}</h3>{desc&&<p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{desc}</p>}</div>
      </div>
      {complete&&<div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3ECF8E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="check-anim"><polyline points="20 6 9 17 4 12"/></svg></div>}
    </div>}
    <div className="px-4 py-3.5 space-y-3.5">{children}</div>
  </div>
);

/* ═══ TOOLTIP ═══ */
export const Tip=({text,children})=>{
  const [show,setShow]=useState(false);
  return <span className="relative inline-flex" onMouseEnter={()=>setShow(true)} onMouseLeave={()=>setShow(false)}>
    {children}
    {show&&<span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-[#2a2a2a] text-[#ededed] text-[11px] rounded-md shadow-lg whitespace-nowrap z-50 leading-relaxed max-w-[240px] text-center border border-[#333]">{text}<span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#2a2a2a]"/></span>}
  </span>;
};

