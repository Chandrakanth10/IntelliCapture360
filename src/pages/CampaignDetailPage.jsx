import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { CAMPS, CH_LEADS, CURRENT_USER, I, STAGES, STAGE_APPROVALS } from '../shared/campaignShared';

/* ═══ MOCK EXTENDED FORM DATA ═══ */
const EXT = {
  1: {
    roiRevenue: '$2.4M', roiEngagement: '',
    segDef: 'Loyalty tier: Gold & Platinum members with 3+ visits/month',
    targetCriteria: 'Household income $60K+, pantry category affinity score > 0.7',
    brandAssets: 'Q1 Stock Up brand kit with refreshed pantry-hero imagery',
    creativeType: 'Multi-channel responsive',
    chLeadOverrides: { 'In-Store': 'Marcus Bell' },
    merchFiles: [{ name: 'Q1_StockUp_Planogram_v3.pdf', size: '2.4 MB', date: '2026-01-30' }, { name: 'Endcap_Layout_Pantry.xlsx', size: '180 KB', date: '2026-02-02' }],
    creativeFiles: [{ name: 'Hero_Banner_1920x600.psd', size: '18.2 MB', date: '2026-02-10' }, { name: 'Email_Template_StockUp.html', size: '45 KB', date: '2026-02-11' }, { name: 'Social_Assets_Kit.zip', size: '34.1 MB', date: '2026-02-12' }],
    vendorGuide: { name: 'Vendor_Style_Guide_Q1.pdf', size: '5.6 MB', date: '2026-01-20' },
    isanScripts: null,
    amcGuidance: { name: 'AMC_Guidance_StockUp.pdf', size: '1.2 MB', date: '2026-01-25' },
  },
  3: {
    roiRevenue: '$1.8M', roiEngagement: '',
    segDef: 'Organic & natural produce buyers in last 90 days',
    targetCriteria: 'Fresh department spend > $40/week, organic purchase frequency > 2x/month',
    brandAssets: 'Fresh For Spring seasonal asset pack with farm-to-table photography',
    creativeType: 'In-store + digital',
    chLeadOverrides: {},
    merchFiles: [{ name: 'Spring_Produce_Merch_Map.pdf', size: '3.1 MB', date: '2026-01-18' }],
    creativeFiles: [{ name: 'FreshSpring_InStore_Signage.ai', size: '22.5 MB', date: '2026-02-05' }, { name: 'Web_Banner_Spring.png', size: '850 KB', date: '2026-02-06' }],
    vendorGuide: null,
    isanScripts: { name: 'ISAN_FreshSpring_30s.docx', size: '28 KB', date: '2026-01-22' },
    amcGuidance: null,
  },
  6: {
    roiRevenue: '$3.1M', roiEngagement: '',
    segDef: 'Families with outdoor & grilling purchase history',
    targetCriteria: 'BBQ category buyers, seasonal shoppers May-Aug, basket size > $80',
    brandAssets: 'Summer BBQ master brand kit with updated grilling photography',
    creativeType: 'Full-funnel omnichannel',
    chLeadOverrides: { 'Paid Media': 'Angela Torres', 'Circular': 'Mike Henderson' },
    merchFiles: [{ name: 'BBQ_Kickoff_Planogram.pdf', size: '4.2 MB', date: '2026-02-08' }, { name: 'Seasonal_Beverage_Layout.pdf', size: '1.8 MB', date: '2026-02-09' }, { name: 'Outdoor_Dining_Display_Guide.pptx', size: '6.3 MB', date: '2026-02-10' }],
    creativeFiles: [{ name: 'BBQ_Hero_Video_15s.mp4', size: '48.2 MB', date: '2026-02-14' }, { name: 'Email_BBQ_Responsive.html', size: '52 KB', date: '2026-02-15' }, { name: 'Social_BBQ_Pack.zip', size: '28.7 MB', date: '2026-02-15' }, { name: 'InStore_POP_Designs.pdf', size: '12.4 MB', date: '2026-02-16' }],
    vendorGuide: { name: 'Partner_Brand_Guidelines_Summer.pdf', size: '8.9 MB', date: '2026-02-01' },
    isanScripts: { name: 'ISAN_BBQ_15s_30s.docx', size: '35 KB', date: '2026-02-05' },
    amcGuidance: { name: 'AMC_Summer_Grilling_Strategy.pdf', size: '2.1 MB', date: '2026-02-03' },
  },
  8: {
    roiRevenue: '$950K', roiEngagement: '120K app installs',
    segDef: 'App users with push notifications enabled, digital-first segment',
    targetCriteria: 'App active in last 14 days, coupon clip rate > 50%, fuel rewards enrolled',
    brandAssets: 'Digital Coupon Blitz brand assets — neon/dark theme approved',
    creativeType: 'Digital-only (app + web)',
    chLeadOverrides: { 'CRM': 'Vanessa Huang' },
    merchFiles: [],
    creativeFiles: [{ name: 'App_Push_Creative_Set.zip', size: '4.8 MB', date: '2026-01-15' }, { name: 'Web_Takeover_Coupon.html', size: '38 KB', date: '2026-01-16' }],
    vendorGuide: null,
    isanScripts: null,
    amcGuidance: null,
  },
  14: {
    roiRevenue: '$1.1M', roiEngagement: '15K sampling interactions',
    segDef: 'Deli department shoppers, artisan food enthusiasts',
    targetCriteria: 'Deli spend > $25/week, premium tier or foodie affinity segment',
    brandAssets: 'Deli Fresh launch kit with artisan photography and brand story assets',
    creativeType: 'In-store sampling + digital support',
    chLeadOverrides: { 'Local Pages': 'Ryan Cho' },
    merchFiles: [{ name: 'Deli_Fresh_Planogram.pdf', size: '2.9 MB', date: '2026-02-15' }, { name: 'Sampling_Station_Layout.pdf', size: '1.1 MB', date: '2026-02-16' }],
    creativeFiles: [{ name: 'Deli_Launch_Video_30s.mp4', size: '62.3 MB', date: '2026-02-18' }, { name: 'Tasting_Event_Signage.ai', size: '15.6 MB', date: '2026-02-18' }, { name: 'Email_DeliLaunch.html', size: '41 KB', date: '2026-02-19' }],
    vendorGuide: { name: 'Artisan_Vendor_Guidelines.pdf', size: '4.3 MB', date: '2026-02-10' },
    isanScripts: null,
    amcGuidance: null,
  },
};

/* ═══ AI SUMMARIES ═══ */
const AI_SUMMARIES = {
  1: 'High-impact Q1 pantry promotion targeting Gold & Platinum loyalty members across 4 banners. Currently in Creative Dev with $2.4M revenue target. Creative assets are being finalized — hero banner due by Friday. Strong cross-channel strategy using CRM, Digital Merch, In-Store, and Circular with custom In-Store lead override. On track for Mar 15 launch.',
  3: 'Seasonal organic produce campaign in Execution phase, targeting health-conscious shoppers with $1.8M revenue goal. Leveraging farm-to-table photography across 3 banners. In-store signage and web assets are ready. Strong alignment between audience segmentation and channel mix. Launch date Mar 22 — one day in current stage.',
  6: 'Largest upcoming campaign at $3.1M revenue target. Memorial Day BBQ activation spanning 4 banners with full omnichannel strategy — 5 support channels and all marketing channels active. Custom lead overrides on Paid Media and Circular. Currently in Strategy phase with 6 days invested. Video creative and sampling event assets in production. Strong file library with 8 uploads across merchandising and creative.',
  8: 'Digital-first flash coupon campaign currently Live with 10 days of momentum. Dual ROI targets: $950K revenue + 120K app installs. App downloads up 18% since launch. Push notification cadence doubled this week. Focused digital channel strategy through CRM and Digital Merch only — lean and effective. Custom CRM lead assigned.',
  14: 'New artisan deli line launch combining in-store sampling with digital support. $1.1M revenue target plus 15K sampling interaction goal. Currently in Planning across 3 banners with strong merchandising prep — planograms and sampling station layouts ready. Video and signage assets in final production. Custom Local Pages lead assigned.',
};

const genSummary = (camp) => {
  const stg = STAGES.find((s) => s.key === camp.stage);
  const chCount = (camp.ch || []).length;
  const bannerCount = (camp.banners || []).length;
  return `${camp.pri}-priority ${camp.ct.toLowerCase()} campaign in ${stg?.label || camp.stage} phase, targeting ${camp.aud || 'broad audience'}. Projected ROI of ${camp.roi} (${camp.roiT}). Running across ${bannerCount} banner${bannerCount !== 1 ? 's' : ''} with ${chCount} support channel${chCount !== 1 ? 's' : ''}. Managed by ${camp.rep} under ${camp.mr}. ${camp.days}d in current stage — ${camp.status === 'On Track' || camp.status === 'Live' ? 'progressing well' : 'needs attention'} for ${camp.date} launch.`;
};

// Generate mock "approved" entries for completed stages (dates based on campaign created date)
const getPastApproval = (camp, stageIdx) => {
  const base = new Date(camp.created);
  base.setDate(base.getDate() + stageIdx * 3);
  const mon = base.toLocaleString('en-US', { month: 'short' });
  return { date: `${mon} ${base.getDate()}` };
};

const fmtTime = (iso) => {
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  const mon = d.toLocaleString('en-US', { month: 'short' });
  const day = d.getDate();
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${mon} ${day}, ${h12}:${m} ${ampm}`;
};

const PRI = {
  High: { bg: '#3b1520', border: '#5c2030', text: '#f87171' },
  Medium: { bg: '#3b2e10', border: '#5c4a18', text: '#fbbf24' },
  Low: { bg: '#0f2d3d', border: '#164050', text: '#38bdf8' },
};

const Section = ({ title, icon, children }) => (
  <div>
    <div className="flex items-center gap-2 mb-3">
      <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(62,207,142,0.08)' }}>
        <I n={icon} s={12} c="text-[#3ECF8E]" />
      </div>
      <h3 className="text-[12px] font-semibold text-[#ededed] uppercase tracking-wider">{title}</h3>
    </div>
    {children}
  </div>
);

const DetailField = ({ label, value }) => (
  <div>
    <span className="text-[10px] text-[#555] uppercase tracking-wide">{label}</span>
    <p className="text-[12px] font-medium text-[#ccc] mt-0.5">{value || <span className="text-[#444] italic font-normal">Not provided</span>}</p>
  </div>
);

const ext_ = (name) => (name || '').split('.').pop().toLowerCase();

const FILE_TYPE_META = {
  pdf:  { icon: 'file', color: '#f87171', label: 'PDF Document' },
  xlsx: { icon: 'grid', color: '#34d399', label: 'Spreadsheet' },
  psd:  { icon: 'sparkle', color: '#60a5fa', label: 'Photoshop File' },
  ai:   { icon: 'sparkle', color: '#fb923c', label: 'Illustrator File' },
  png:  { icon: 'eye', color: '#a78bfa', label: 'PNG Image' },
  jpg:  { icon: 'eye', color: '#a78bfa', label: 'JPEG Image' },
  html: { icon: 'globe', color: '#fbbf24', label: 'HTML File' },
  zip:  { icon: 'layers', color: '#94a3b8', label: 'Archive' },
  mp4:  { icon: 'zap', color: '#f472b6', label: 'Video' },
  pptx: { icon: 'bar', color: '#fb923c', label: 'Presentation' },
  docx: { icon: 'file', color: '#60a5fa', label: 'Document' },
};

const getFileMeta = (name) => FILE_TYPE_META[ext_(name)] || { icon: 'file', color: '#3ECF8E', label: 'File' };

/* ═══ MOCK PREVIEW CONTENT ═══ */
const MockPdfPreview = ({ name }) => (
  <div className="space-y-3">
    {[1, 2, 3].map((p) => (
      <div key={p} className="bg-[#1a1a1a] rounded-md border border-[#2a2a2a] p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] text-[#444]">Page {p}</span>
          <span className="text-[10px] text-[#333]">{name}</span>
        </div>
        <div className="space-y-2.5">
          {p === 1 && <div className="h-5 w-3/5 rounded bg-[#252525]" />}
          <div className="h-3 w-full rounded bg-[#1e1e1e]" />
          <div className="h-3 w-full rounded bg-[#1e1e1e]" />
          <div className="h-3 w-4/5 rounded bg-[#1e1e1e]" />
          {p === 1 && <div className="h-24 w-full rounded bg-[#222] mt-3 flex items-center justify-center"><span className="text-[10px] text-[#444]">[ Chart / Diagram ]</span></div>}
          {p === 2 && (
            <div className="grid grid-cols-3 gap-2 mt-3">
              {[1, 2, 3, 4, 5, 6].map((r) => <div key={r} className="h-6 rounded bg-[#222]" />)}
            </div>
          )}
          <div className="h-3 w-full rounded bg-[#1e1e1e]" />
          <div className="h-3 w-3/4 rounded bg-[#1e1e1e]" />
        </div>
      </div>
    ))}
  </div>
);

const MockImagePreview = ({ name, color }) => (
  <div className="bg-[#1a1a1a] rounded-md border border-[#2a2a2a] overflow-hidden">
    <div className="aspect-[16/9] flex items-center justify-center relative" style={{ background: `linear-gradient(135deg, ${color}10, ${color}05)` }}>
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, currentColor 10px, currentColor 11px)', color }} />
      <div className="text-center z-10">
        <div className="w-14 h-14 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
          <I n="eye" s={24} c={`text-[${color}]`} />
        </div>
        <p className="text-[12px] font-medium text-[#999]">{name}</p>
        <p className="text-[11px] text-[#555] mt-1">Image preview</p>
      </div>
    </div>
  </div>
);

const MockVideoPreview = ({ name }) => (
  <div className="bg-[#0a0a0a] rounded-md border border-[#2a2a2a] overflow-hidden">
    <div className="aspect-video flex items-center justify-center relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[#f472b608] to-transparent" />
      <div className="text-center z-10">
        <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 cursor-pointer hover:bg-white/15 transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="none"><polygon points="8 5 20 12 8 19" /></svg>
        </div>
        <p className="text-[12px] font-medium text-[#999]">{name}</p>
      </div>
    </div>
    <div className="px-4 py-2.5 border-t border-[#2a2a2a] flex items-center gap-3">
      <div className="h-1 flex-1 bg-[#2a2a2a] rounded-full overflow-hidden"><div className="h-full w-0 bg-[#f472b6] rounded-full" /></div>
      <span className="text-[10px] text-[#555] shrink-0">0:00 / 0:15</span>
    </div>
  </div>
);

const MockHtmlPreview = ({ name }) => (
  <div className="bg-[#1a1a1a] rounded-md border border-[#2a2a2a] overflow-hidden">
    <div className="px-3 py-2 border-b border-[#2a2a2a] flex items-center gap-2">
      <div className="flex gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" /><span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" /><span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" /></div>
      <span className="text-[10px] text-[#555] flex-1 text-center truncate">{name}</span>
    </div>
    <div className="p-4 font-mono text-[11px] leading-relaxed">
      <p><span className="text-[#555]">&lt;</span><span className="text-[#f87171]">html</span><span className="text-[#555]">&gt;</span></p>
      <p className="ml-4"><span className="text-[#555]">&lt;</span><span className="text-[#f87171]">head</span><span className="text-[#555]">&gt;</span></p>
      <p className="ml-8"><span className="text-[#555]">&lt;</span><span className="text-[#f87171]">title</span><span className="text-[#555]">&gt;</span><span className="text-[#ccc]">Email Template</span><span className="text-[#555]">&lt;/</span><span className="text-[#f87171]">title</span><span className="text-[#555]">&gt;</span></p>
      <p className="ml-4"><span className="text-[#555]">&lt;/</span><span className="text-[#f87171]">head</span><span className="text-[#555]">&gt;</span></p>
      <p className="ml-4"><span className="text-[#555]">&lt;</span><span className="text-[#f87171]">body</span> <span className="text-[#fbbf24]">style</span><span className="text-[#555]">=</span><span className="text-[#3ECF8E]">"..."</span><span className="text-[#555]">&gt;</span></p>
      <p className="ml-8"><span className="text-[#555]">&lt;</span><span className="text-[#f87171]">table</span> <span className="text-[#fbbf24]">width</span><span className="text-[#555]">=</span><span className="text-[#3ECF8E]">"600"</span><span className="text-[#555]">&gt;</span></p>
      <p className="ml-12 text-[#444]">...</p>
      <p className="ml-8"><span className="text-[#555]">&lt;/</span><span className="text-[#f87171]">table</span><span className="text-[#555]">&gt;</span></p>
      <p className="ml-4"><span className="text-[#555]">&lt;/</span><span className="text-[#f87171]">body</span><span className="text-[#555]">&gt;</span></p>
      <p><span className="text-[#555]">&lt;/</span><span className="text-[#f87171]">html</span><span className="text-[#555]">&gt;</span></p>
    </div>
  </div>
);

const MockZipPreview = ({ name }) => {
  const items = [
    { n: 'assets/', type: 'folder' },
    { n: 'assets/banner_1200x628.png', type: 'image', s: '2.1 MB' },
    { n: 'assets/banner_1080x1080.png', type: 'image', s: '1.8 MB' },
    { n: 'assets/story_1080x1920.png', type: 'image', s: '2.4 MB' },
    { n: 'templates/', type: 'folder' },
    { n: 'templates/post_copy.txt', type: 'text', s: '4 KB' },
    { n: 'README.md', type: 'text', s: '1 KB' },
  ];
  return (
    <div className="bg-[#1a1a1a] rounded-md border border-[#2a2a2a] overflow-hidden">
      <div className="px-4 py-2.5 border-b border-[#2a2a2a] flex items-center justify-between">
        <span className="text-[11px] font-medium text-[#999]">{name}</span>
        <span className="text-[10px] text-[#555]">{items.filter((i) => i.type !== 'folder').length} files</span>
      </div>
      <div className="divide-y divide-[#222]">
        {items.map((item) => (
          <div key={item.n} className={`px-4 py-2 flex items-center gap-2.5 ${item.type === 'folder' ? 'bg-[#1e1e1e]' : ''}`}>
            <I n={item.type === 'folder' ? 'layers' : 'file'} s={12} c={item.type === 'folder' ? 'text-[#fbbf24]' : 'text-[#555]'} />
            <span className={`text-[11px] flex-1 ${item.type === 'folder' ? 'font-medium text-[#ccc]' : 'text-[#999]'}`}>{item.n}</span>
            {item.s && <span className="text-[10px] text-[#444]">{item.s}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

const MockSpreadsheetPreview = ({ name }) => (
  <div className="bg-[#1a1a1a] rounded-md border border-[#2a2a2a] overflow-hidden">
    <div className="px-4 py-2.5 border-b border-[#2a2a2a]">
      <span className="text-[11px] font-medium text-[#999]">{name}</span>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-[11px]">
        <thead>
          <tr className="bg-[#1e1e1e]">
            {['', 'A', 'B', 'C', 'D'].map((h) => (
              <th key={h} className="px-3 py-1.5 text-[10px] font-medium text-[#555] border-b border-r border-[#2a2a2a] text-left">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4, 5].map((r) => (
            <tr key={r}>
              <td className="px-3 py-1.5 text-[10px] text-[#444] border-b border-r border-[#2a2a2a] bg-[#1e1e1e] w-8">{r}</td>
              {[0, 1, 2, 3].map((c) => (
                <td key={c} className="px-3 py-1.5 text-[#888] border-b border-r border-[#222] min-w-[100px]">
                  {r === 1 ? ['SKU', 'Product Name', 'Bay #', 'Facings'][c] : ''}
                  {r > 1 ? <div className="h-3 rounded bg-[#222]" style={{ width: `${40 + Math.random() * 50}%` }} /> : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const MockDocPreview = ({ name }) => (
  <div className="bg-[#1a1a1a] rounded-md border border-[#2a2a2a] p-6 max-w-[480px] mx-auto">
    <div className="mb-5">
      <div className="h-5 w-2/3 rounded bg-[#252525] mb-3" />
      <div className="h-3 w-1/3 rounded bg-[#1e1e1e]" />
    </div>
    <div className="space-y-2">
      <div className="h-3 w-full rounded bg-[#1e1e1e]" />
      <div className="h-3 w-full rounded bg-[#1e1e1e]" />
      <div className="h-3 w-5/6 rounded bg-[#1e1e1e]" />
      <div className="h-6" />
      <div className="h-3 w-full rounded bg-[#1e1e1e]" />
      <div className="h-3 w-full rounded bg-[#1e1e1e]" />
      <div className="h-3 w-2/3 rounded bg-[#1e1e1e]" />
    </div>
    <p className="text-[10px] text-[#444] text-center mt-5">{name}</p>
  </div>
);

const getPreview = (file) => {
  const e = ext_(file.name);
  const meta = getFileMeta(file.name);
  switch (e) {
    case 'pdf': return <MockPdfPreview name={file.name} />;
    case 'png': case 'jpg': case 'psd': case 'ai': return <MockImagePreview name={file.name} color={meta.color} />;
    case 'mp4': return <MockVideoPreview name={file.name} />;
    case 'html': return <MockHtmlPreview name={file.name} />;
    case 'zip': return <MockZipPreview name={file.name} />;
    case 'xlsx': return <MockSpreadsheetPreview name={file.name} />;
    case 'pptx': return <MockSpreadsheetPreview name={file.name} />;
    case 'docx': return <MockDocPreview name={file.name} />;
    default: return <MockDocPreview name={file.name} />;
  }
};

/* ═══ FILE PREVIEW MODAL ═══ */
const FilePreviewModal = ({ file, onClose }) => {
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', h); document.body.style.overflow = ''; };
  }, [onClose]);

  const meta = getFileMeta(file.name);

  return createPortal(
    <>
      <div className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-[3px] anim-backdrop" onClick={onClose} />
      <div className="fixed inset-4 sm:inset-8 lg:inset-y-10 lg:inset-x-[10%] z-[61] flex flex-col bg-[#161616] border border-[#2a2a2a] rounded-xl shadow-2xl anim-scale overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-[#2a2a2a] bg-[#1a1a1a] shrink-0">
          <div className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: `${meta.color}15`, border: `1px solid ${meta.color}25`, color: meta.color }}>
            <I n={meta.icon} s={14} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-[#ededed] truncate">{file.name}</p>
            <p className="text-[11px] text-[#555]">{meta.label} &middot; {file.size} &middot; Uploaded {file.date}</p>
          </div>
          {file.category && (
            <span className="text-[10px] font-medium px-2 py-1 rounded bg-[#252525] border border-[#333] text-[#888] shrink-0">{file.category}</span>
          )}
          <button onClick={onClose} className="p-1.5 hover:bg-[#252525] rounded-md transition-colors text-[#777] hover:text-[#ededed] shrink-0 ml-2">
            <I n="x" s={14} />
          </button>
        </div>

        {/* Preview area */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-5">
          {getPreview(file)}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#2a2a2a] bg-[#1a1a1a] shrink-0">
          <span className="text-[11px] text-[#555]">{file.size} &middot; {meta.label}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadFile(file)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-[11px] font-medium bg-[#3ECF8E] text-[#0a1f15] hover:bg-[#38b97e] transition-colors"
            >
              <I n="upload" s={12} c="rotate-180" />
              Download
            </button>
            <button onClick={onClose} className="px-3.5 py-1.5 rounded-md text-[11px] font-medium bg-[#252525] text-[#ccc] hover:bg-[#303030] border border-[#333] transition-colors">
              Close
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

const downloadFile = (file) => {
  const meta = getFileMeta(file.name);
  const content = [
    `File: ${file.name}`,
    `Type: ${meta.label}`,
    `Size: ${file.size}`,
    `Uploaded: ${file.date}`,
    file.category ? `Category: ${file.category}` : '',
    '',
    '--- Mock file generated for demo purposes ---',
  ].filter(Boolean).join('\n');
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const FileRow = ({ file, onClick }) => {
  const meta = getFileMeta(file.name);
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-md bg-[#1e1e1e] border border-[#2a2a2a] group cursor-pointer hover:border-[#3ECF8E30] transition-colors">
      <div onClick={onClick} className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 transition-colors" style={{ background: `${meta.color}12`, border: `1px solid ${meta.color}20`, color: meta.color }}>
          <I n={meta.icon} s={14} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-medium text-[#ccc] truncate group-hover:text-[#ededed] transition-colors">{file.name}</p>
          <p className="text-[10px] text-[#555]">{meta.label} &middot; {file.size} &middot; {file.date}</p>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={(e) => { e.stopPropagation(); downloadFile(file); }}
          className="p-1.5 rounded-md text-[#444] hover:text-[#3ECF8E] hover:bg-[#3ECF8E12] transition-colors opacity-0 group-hover:opacity-100"
          title="Download"
        >
          <I n="upload" s={13} c="rotate-180" />
        </button>
        <button
          onClick={onClick}
          className="p-1.5 rounded-md text-[#444] hover:text-[#3ECF8E] hover:bg-[#3ECF8E12] transition-colors opacity-0 group-hover:opacity-100"
          title="Preview"
        >
          <I n="eye" s={13} />
        </button>
      </div>
    </div>
  );
};

const EmptyState = ({ text }) => (
  <div className="py-4 text-center rounded-md border border-dashed border-[#2a2a2a]">
    <p className="text-[11px] text-[#444]">{text}</p>
  </div>
);

/* ═══ BRIEFING CONTENT COMPONENT ═══ */
export const BriefingContent = ({ brief }) => (
  <div className="space-y-5">
    {/* Executive Summary */}
    <div>
      <h4 className="text-[11px] font-semibold text-[#3ECF8E] uppercase tracking-wider mb-2">Executive Summary</h4>
      <p className="text-[12px] text-[#b0c0b8] leading-[1.7]">{brief.executiveSummary}</p>
    </div>

    {/* Performance Highlights */}
    <div>
      <h4 className="text-[11px] font-semibold text-[#3ECF8E] uppercase tracking-wider mb-3">Performance Highlights</h4>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {brief.kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-lg bg-[#0a1510] border border-[#1a3a2a] p-3">
            <span className="text-[10px] text-[#557a66] uppercase tracking-wide">{kpi.label}</span>
            <p className="text-[18px] font-bold mt-1" style={{ color: kpi.color }}>{kpi.value}</p>
            <span className="text-[10px] font-medium text-[#3ECF8E]">{kpi.trend} vs target</span>
          </div>
        ))}
      </div>
    </div>

    {/* Channel Breakdown */}
    {brief.channelBreakdown.length > 0 && (
      <div>
        <h4 className="text-[11px] font-semibold text-[#3ECF8E] uppercase tracking-wider mb-3">Channel Breakdown</h4>
        <div className="space-y-2">
          {brief.channelBreakdown.map((ch) => (
            <div key={ch.channel} className="flex items-center gap-3 px-3 py-2.5 rounded-md bg-[#0a1510] border border-[#1a3a2a]">
              <span className="text-[12px] font-medium text-[#ccc] flex-1">{ch.channel}</span>
              <span className="text-[11px] text-[#668a76]">{ch.impressions} imp</span>
              <span className="text-[11px] text-[#668a76]">{ch.ctr} CTR</span>
              <span className="text-[11px] font-medium text-[#3ECF8E]">{ch.contribution}</span>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Key Learnings */}
    <div>
      <h4 className="text-[11px] font-semibold text-[#3ECF8E] uppercase tracking-wider mb-2">Key Learnings</h4>
      <ul className="space-y-2">
        {brief.learnings.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-[12px] text-[#b0c0b8] leading-relaxed">
            <span className="w-5 h-5 rounded-full bg-[#3ECF8E15] border border-[#3ECF8E25] flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-bold text-[#3ECF8E]">{i + 1}</span>
            {item}
          </li>
        ))}
      </ul>
    </div>

    {/* Recommendations */}
    <div>
      <h4 className="text-[11px] font-semibold text-[#3ECF8E] uppercase tracking-wider mb-2">Recommendations</h4>
      <ul className="space-y-2">
        {brief.recommendations.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-[12px] text-[#b0c0b8] leading-relaxed">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#3ECF8E] shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

/* ═══ AI BRIEFING GENERATOR ═══ */
export const generateBriefing = (camp) => {
  // Derive realistic mock KPIs from campaign fields
  const roiStr = (camp.roi || '$0').replace(/[^0-9.]/g, '');
  const roiNum = parseFloat(roiStr) || 1;
  const scale = roiNum >= 1 ? roiNum : roiNum * 1000; // normalize to thousands
  const impressions = `${(scale * 1.2 + 0.5).toFixed(1)}M`;
  const ctr = `${(2.1 + (camp.id % 3) * 0.8).toFixed(1)}%`;
  const conversions = `${Math.round(scale * 42 + 1200).toLocaleString()}`;
  const roi = `${(scale * 0.38 + 12).toFixed(0)}%`;

  const channels = (camp.ch || []);
  const channelBreakdown = channels.map((ch, i) => ({
    channel: ch,
    impressions: `${((scale * 0.3 + i * 0.2) + 0.1).toFixed(1)}M`,
    ctr: `${(1.8 + i * 0.5).toFixed(1)}%`,
    contribution: `${Math.round(100 / channels.length)}%`,
  }));

  return {
    executiveSummary: `The ${camp.name} campaign successfully launched on ${camp.date} targeting ${camp.aud || 'the defined audience segment'}. The campaign leveraged ${channels.length} support channel${channels.length !== 1 ? 's' : ''} across ${(camp.banners || []).length} banner${(camp.banners || []).length !== 1 ? 's' : ''} with a projected ROI of ${camp.roi}. Performance metrics indicate strong engagement across digital and in-store touchpoints, with key conversion goals trending ahead of forecast.`,
    kpis: [
      { label: 'Impressions', value: impressions, trend: '+14%', color: '#3ECF8E' },
      { label: 'Click-Through Rate', value: ctr, trend: '+0.3pp', color: '#60a5fa' },
      { label: 'Conversions', value: conversions, trend: '+22%', color: '#fbbf24' },
      { label: 'Return on Spend', value: roi, trend: '+8%', color: '#a78bfa' },
    ],
    channelBreakdown,
    learnings: [
      `Push notification timing between 11am-1pm drove ${(1.5 + camp.id % 3 * 0.3).toFixed(1)}x higher engagement than evening sends.`,
      `${channels[0] || 'CRM'} channel outperformed projections by ${18 + camp.id % 5 * 3}%, suggesting stronger audience affinity than initial segmentation indicated.`,
      `Cross-channel attribution showed ${(35 + camp.id % 4 * 5)}% of conversions involved 2+ touchpoints, reinforcing the omnichannel approach.`,
    ],
    recommendations: [
      `Increase ${channels[0] || 'CRM'} budget allocation by 15-20% for follow-up campaigns based on strong performance metrics.`,
      `Refine audience segmentation to focus on the high-converting cohort identified during the campaign (${camp.aud || 'core segment'}).`,
      `Consider extending the campaign cadence from ${camp.days} days to ${camp.days + 7} days for future iterations to capture late-funnel conversions.`,
    ],
  };
};

const CampaignDetailPage = ({ campaigns = CAMPS, approvals = {}, onApprove, onReject, onAdvanceStage, briefings = {}, onUploadBriefing, onRemoveBriefing, comments = [], onAddComment }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const fromPage = location.state?.from || 'Dashboard';
  const [commentText, setCommentText] = useState('');
  const [previewFile, setPreviewFile] = useState(null);
  const [expandedStage, setExpandedStage] = useState(null);
  const [showAllTeam, setShowAllTeam] = useState(false);
  const [actionModal, setActionModal] = useState(null); // { type: 'approve'|'reject', key, label }
  const [actionComment, setActionComment] = useState('');
  const [rejectStage, setRejectStage] = useState('');
  const [showAiBrief, setShowAiBrief] = useState(false);

  const camp = campaigns.find((c) => c.id === Number(id));

  if (!camp) {
    return (
      <div className="anim-fade py-20 text-center">
        <I n="alert" s={32} c="text-[#333] mx-auto mb-3" />
        <p className="text-[14px] text-[#777]">Campaign not found</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-[12px] text-[#3ECF8E] hover:text-[#38b97e] transition-colors">Go back</button>
      </div>
    );
  }

  const si = STAGES.findIndex((s) => s.key === camp.stage);
  const stg = STAGES[si] || STAGES[0];
  const pri = PRI[camp.pri] || PRI.Medium;
  const ext = EXT[camp.id] || {};

  // Build channel leads with overrides
  const chLeads = (camp.ch || []).map((ch) => ({
    channel: ch,
    lead: ext.chLeadOverrides?.[ch] || CH_LEADS[ch] || 'Unassigned',
    isOverride: !!ext.chLeadOverrides?.[ch],
  }));

  const allFiles = [
    ...(ext.merchFiles || []).map((f) => ({ ...f, category: 'Merchandising' })),
    ...(ext.creativeFiles || []).map((f) => ({ ...f, category: 'Creative' })),
    ...(ext.vendorGuide ? [{ ...ext.vendorGuide, category: 'Vendor Style Guide' }] : []),
    ...(ext.isanScripts ? [{ ...ext.isanScripts, category: 'ISAN Scripts' }] : []),
    ...(ext.amcGuidance ? [{ ...ext.amcGuidance, category: 'AMC Guidance' }] : []),
  ];

  // Build team members list
  const teamMembers = [
    { name: camp.by.n, role: 'Requester', color: '#60a5fa' },
    { name: camp.rep, role: 'Representative', color: '#3ECF8E' },
  ];
  // Add unique channel leads
  const seenNames = new Set([camp.by.n, camp.rep]);
  chLeads.forEach((cl) => {
    if (!seenNames.has(cl.lead)) {
      seenNames.add(cl.lead);
      teamMembers.push({ name: cl.lead, role: `${cl.channel} Lead`, color: cl.isOverride ? '#fbbf24' : '#a78bfa' });
    }
  });

  return (
    <div className="anim-fade">
      {/* Back button */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-[12px] text-[#666] hover:text-[#ccc] transition-colors mb-4">
        <I n="chevL" s={14} />
        Back to {fromPage}
      </button>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[18px] font-semibold text-[#f8f8f8] mb-2">{camp.name}</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-semibold px-2 py-1 rounded border" style={{ backgroundColor: pri.bg, borderColor: pri.border, color: pri.text }}>{camp.pri}</span>
          <span className="text-[10px] font-semibold px-2 py-1 rounded border" style={{ backgroundColor: stg.hex + '18', borderColor: stg.hex + '30', color: stg.hex }}>{stg.label}</span>
          {camp.status !== 'On Track' && (
            <span className="text-[10px] font-medium px-2 py-1 rounded bg-[#1e1e1e] border border-[#2e2e2e] text-[#999]">{camp.status}</span>
          )}
          <span className="text-[11px] text-[#555] ml-auto"><I n="clock" s={11} c="inline -mt-px mr-1" />{camp.days}d in stage</span>
        </div>
      </div>

      {/* AI Summary — full width */}
      <div className="rounded-lg overflow-hidden mb-5" style={{ background: 'linear-gradient(135deg, #1a1a2e, #161625)', border: '1px solid #2a2a3a' }}>
        <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid #2a2a3a' }}>
          <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #a78bfa20, #f472b620)' }}>
            <I n="sparkle" s={11} c="text-[#a78bfa]" />
          </div>
          <span className="text-[11px] font-semibold text-[#a78bfa] uppercase tracking-wider">AI Summary</span>
        </div>
        <div className="px-5 py-3.5">
          <p className="text-[12px] text-[#b0b0c0] leading-[1.7]">{AI_SUMMARIES[camp.id] || genSummary(camp)}</p>
        </div>
      </div>

      {/* Briefing Document — only for live campaigns */}
      {camp.stage === 'live' && (() => {
        const briefing = briefings[camp.id];
        const hasUpload = briefing?.type === 'uploaded';
        const aiBrief = generateBriefing(camp);

        return (
          <div className="rounded-lg overflow-hidden mb-5" style={{ background: hasUpload ? '#161616' : 'linear-gradient(135deg, #0f1f1a, #111a16)', border: `1px solid ${hasUpload ? '#2a2a2a' : '#1a3a2a'}` }}>
            {/* Header */}
            <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: `1px solid ${hasUpload ? '#2a2a2a' : '#1a3a2a'}` }}>
              <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3ECF8E20, #34d39920)' }}>
                <I n="file" s={11} c="text-[#3ECF8E]" />
              </div>
              <span className="text-[11px] font-semibold text-[#3ECF8E] uppercase tracking-wider">Briefing Document</span>
              <span className="text-[10px] text-[#555] ml-auto">
                {hasUpload ? 'Team upload available' : 'AI-Generated \u00B7 No team briefing uploaded'}
              </span>
            </div>

            <div className="px-5 py-4">
              {hasUpload ? (
                /* ─── State B: Team Uploaded ─── */
                <div className="space-y-4">
                  {/* File card */}
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#1e1e1e] border border-[#2a2a2a] group/file">
                    <button
                      onClick={() => setPreviewFile({ name: briefing.fileName, size: 'PDF', date: briefing.uploadedDate, category: 'Briefing Document' })}
                      className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer text-left"
                    >
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors group-hover/file:border-[#3ECF8E40]" style={{ background: '#3ECF8E15', border: '1px solid #3ECF8E25' }}>
                        <I n="file" s={18} c="text-[#3ECF8E]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium text-[#ededed] truncate group-hover/file:text-white transition-colors">{briefing.fileName}</p>
                        <p className="text-[11px] text-[#555] mt-0.5">
                          Uploaded by {briefing.uploadedBy} &middot; {briefing.uploadedDate}
                        </p>
                      </div>
                    </button>
                    <button
                      onClick={() => setPreviewFile({ name: briefing.fileName, size: 'PDF', date: briefing.uploadedDate, category: 'Briefing Document' })}
                      className="px-3 py-1.5 rounded-md text-[11px] font-medium bg-[#3ECF8E15] text-[#3ECF8E] hover:bg-[#3ECF8E25] border border-[#3ECF8E30] transition-colors shrink-0 flex items-center gap-1.5"
                    >
                      <I n="eye" s={12} />
                      View
                    </button>
                    <button
                      onClick={() => onRemoveBriefing?.(camp.id)}
                      className="px-3 py-1.5 rounded-md text-[11px] font-medium bg-[#f8717115] text-[#f87171] hover:bg-[#f8717125] border border-[#f8717130] transition-colors shrink-0"
                    >
                      Remove
                    </button>
                  </div>

                  {/* AI toggle */}
                  <button
                    onClick={() => setShowAiBrief(!showAiBrief)}
                    className="flex items-center gap-2 text-[11px] font-medium text-[#a78bfa] hover:text-[#c4b5fd] transition-colors"
                  >
                    <I n="sparkle" s={12} />
                    {showAiBrief ? 'Hide AI-Generated Brief' : 'View AI-Generated Brief'}
                    <I n="chevR" s={10} c={`transition-transform ${showAiBrief ? 'rotate-90' : ''}`} />
                  </button>

                  {showAiBrief && (
                    <div className="rounded-lg p-4 space-y-5" style={{ background: 'linear-gradient(135deg, #0f1f1a, #111a16)', border: '1px solid #1a3a2a' }}>
                      <BriefingContent brief={aiBrief} camp={camp} />
                    </div>
                  )}
                </div>
              ) : (
                /* ─── State A: AI-Generated ─── */
                <div className="space-y-5">
                  <BriefingContent brief={aiBrief} camp={camp} />

                  <div className="pt-2 border-t border-[#1a3a2a]">
                    <button
                      onClick={() => {
                        const name = `${camp.name.replace(/\s+/g, '_')}_Briefing.pdf`;
                        onUploadBriefing?.(camp.id, name);
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[12px] font-semibold bg-[#3ECF8E] text-[#0a1f15] hover:bg-[#38b97e] transition-colors"
                    >
                      <I n="upload" s={14} c="text-[#0a1f15]" />
                      Upload Team Briefing
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_540px] gap-5">
        {/* ─── Left column ─── */}
        <div className="space-y-5">
          {/* Description */}
          <div className="rounded-lg border border-[#2a2a2a] bg-[#161616] p-5">
            <p className="text-[12px] text-[#999] leading-relaxed">{camp.desc}</p>
          </div>

          {/* Pipeline */}
          <div className="rounded-lg border border-[#2a2a2a] bg-[#161616] p-5">
            <Section title="Pipeline" icon="layers">
              <div className="relative mt-4">
                <div className="absolute h-[2px] bg-[#2a2a2a]" style={{ top: 9, left: `calc(100% / ${STAGES.length * 2})`, right: `calc(100% / ${STAGES.length * 2})` }}>
                  <div className="absolute inset-y-0 left-0 bg-[#3ECF8E]" style={{ width: si === 0 ? 0 : `${(si / (STAGES.length - 1)) * 100}%` }} />
                </div>
                <div className="relative flex">
                  {STAGES.map((s, i) => {
                    const done = i < si;
                    const current = i === si;
                    return (
                      <div key={s.key} className="flex-1 flex flex-col items-center">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{
                          backgroundColor: done ? '#3ECF8E' : current ? stg.hex : '#161616',
                          border: !done && !current ? '2px solid #333' : current ? `2px solid ${stg.hex}` : 'none',
                          boxShadow: current ? `0 0 8px ${stg.hex}40` : 'none',
                        }}>
                          {done ? (
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0a1f15" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                          ) : (
                            <span className={`font-bold text-[8px] ${current ? 'text-white' : 'text-[#555]'}`}>{i + 1}</span>
                          )}
                        </div>
                        <span className={`text-[9px] mt-2 text-center leading-tight ${current ? 'font-semibold text-[#ededed]' : done ? 'text-[#3ECF8E]' : 'text-[#444]'}`}>{s.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Section>

            {/* Stage Approvals */}
            <div className="border-t border-[#2a2a2a] mt-5 pt-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(62,207,142,0.08)' }}>
                  <I n="check" s={11} c="text-[#3ECF8E]" />
                </div>
                <span className="text-[11px] font-semibold text-[#ededed] uppercase tracking-wider">Stage Approvals</span>
              </div>

              <div className="space-y-1.5">
                {STAGES.map((s, i) => {
                  const done = i < si;
                  const current = i === si;
                  const future = i > si;
                  const stageItems = STAGE_APPROVALS[s.key] || [];
                  const isOpen = expandedStage === null ? current : expandedStage === s.key;

                  // Build a map of key → { by, date } for completed approvals
                  let doneMap = {};
                  if (done) {
                    stageItems.forEach((a) => {
                      const info = getPastApproval(camp, i);
                      doneMap[a.key] = { by: a.assignee, date: info.date };
                    });
                  } else if (current) {
                    const campDone = approvals[camp.id];
                    if (campDone) {
                      doneMap = { ...campDone };
                    }
                  }
                  const doneCount = stageItems.filter((a) => doneMap[a.key]).length;
                  const allDone = stageItems.length > 0 && doneCount === stageItems.length;

                  // Colors
                  const stageColor = done ? '#3ECF8E' : current ? stg.hex : '#444';
                  const headerBg = isOpen ? (done ? '#3ECF8E08' : current ? stg.hex + '08' : '#1a1a1a') : 'transparent';
                  const borderCol = isOpen ? (done ? '#3ECF8E30' : current ? stg.hex + '30' : '#2a2a2a') : 'transparent';

                  return (
                    <div key={s.key} className="rounded-lg overflow-hidden transition-colors" style={{ border: `1px solid ${borderCol}`, background: isOpen ? '#1a1a1a' : 'transparent' }}>
                      {/* Header — always clickable */}
                      <button
                        onClick={() => setExpandedStage(isOpen ? '__none__' : s.key)}
                        className="w-full px-3.5 py-2.5 flex items-center justify-between cursor-pointer hover:bg-[#1e1e1e] transition-colors rounded-lg"
                        style={{ background: headerBg }}
                      >
                        <div className="flex items-center gap-2">
                          {done ? (
                            <div className="w-4 h-4 rounded-full bg-[#3ECF8E] flex items-center justify-center shrink-0">
                              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#0a1f15" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                            </div>
                          ) : current ? (
                            <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: stg.hex, boxShadow: `0 0 6px ${stg.hex}40` }}>
                              <span className="text-white font-bold text-[7px]">{i + 1}</span>
                            </div>
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-[#333] flex items-center justify-center shrink-0">
                              <span className="text-[7px] font-bold text-[#444]">{i + 1}</span>
                            </div>
                          )}
                          <span className="text-[11px] font-medium" style={{ color: stageColor }}>{s.label}</span>
                          {current && <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#252525] text-[#888]">Current</span>}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px]" style={{ color: done ? '#3ECF8E80' : current ? stg.hex : '#444' }}>
                            {done ? `${stageItems.length}/${stageItems.length}` : current ? `${doneCount}/${stageItems.length}` : `0/${stageItems.length}`}
                          </span>
                          <I n="chevR" s={10} c={`transition-transform ${isOpen ? 'rotate-90' : ''} ${done ? 'text-[#3ECF8E60]' : current ? '' : 'text-[#333]'}`} />
                        </div>
                      </button>

                      {/* Expanded content */}
                      {isOpen && (
                        <div className="px-3.5 pb-3 pt-2 space-y-1" style={{ borderTop: `1px solid ${done ? '#3ECF8E15' : current ? stg.hex + '15' : '#222'}` }}>
                          {stageItems.map((a) => {
                            const approval = doneMap[a.key];
                            const isDone = !!approval;
                            const canAct = current && !isDone && !future && a.assignee === CURRENT_USER.name;
                            return (
                              <div key={a.key} className="flex items-start gap-2.5 py-1.5">
                                {isDone ? (
                                  <div className="w-4 h-4 rounded-full bg-[#3ECF8E] flex items-center justify-center shrink-0 mt-0.5">
                                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#0a1f15" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                  </div>
                                ) : (
                                  <div className="w-4 h-4 rounded-full border-2 shrink-0 mt-0.5" style={{ borderColor: future ? '#282828' : '#333' }} />
                                )}
                                <div className="flex-1 min-w-0">
                                  <span className={`text-[11px] ${isDone ? 'text-[#888] line-through' : future ? 'text-[#555]' : 'text-[#ccc]'}`}>{a.label}</span>
                                  <div className="flex items-center gap-1.5 mt-0.5">
                                    <I n="user" s={9} c={isDone ? 'text-[#555]' : future ? 'text-[#333]' : 'text-[#444]'} />
                                    <span className={`text-[10px] ${isDone ? 'text-[#555]' : future ? 'text-[#333]' : 'text-[#666]'}`}>
                                      {isDone ? approval.by : a.assignee}
                                    </span>
                                    {isDone && <span className="text-[10px] text-[#444]">&middot; {approval.date}</span>}
                                  </div>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                                  {canAct && (
                                    <>
                                      <button
                                        onClick={() => { setActionModal({ type: 'approve', key: a.key, label: a.label }); setActionComment(''); }}
                                        className="px-2 py-0.5 rounded text-[9px] font-semibold bg-[#3ECF8E20] text-[#3ECF8E] hover:bg-[#3ECF8E35] border border-[#3ECF8E30] transition-colors"
                                      >
                                        Approve
                                      </button>
                                      {camp.stage !== 'intake' && (
                                        <button
                                          onClick={() => { setActionModal({ type: 'reject', key: a.key, label: a.label }); setActionComment(''); setRejectStage(si > 0 ? STAGES[si - 1].key : ''); }}
                                          className="px-2 py-0.5 rounded text-[9px] font-semibold bg-[#f8717120] text-[#f87171] hover:bg-[#f8717135] border border-[#f8717130] transition-colors"
                                        >
                                          Reject
                                        </button>
                                      )}
                                    </>
                                  )}
                                  {!canAct && (
                                    <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                                      isDone ? 'bg-[#3ECF8E12] text-[#3ECF8E]' : future ? 'text-[#333]' : 'bg-[#fbbf2412] text-[#fbbf24]'
                                    }`}>
                                      {isDone ? 'Approved' : future ? 'Upcoming' : 'Awaiting'}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                          {/* Progress bar */}
                          <div className="pt-2">
                            <div className="h-1 rounded-full bg-[#2a2a2a] overflow-hidden">
                              <div className="h-full rounded-full bg-[#3ECF8E] transition-all" style={{ width: `${stageItems.length > 0 ? (doneCount / stageItems.length) * 100 : 0}%` }} />
                            </div>
                          </div>
                          {/* Advance to next stage button */}
                          {current && allDone && camp.stage !== 'live' && onAdvanceStage && (
                            <div className="pt-3">
                              <button
                                onClick={() => onAdvanceStage(camp.id)}
                                className="w-full py-2.5 rounded-lg text-[12px] font-semibold bg-[#3ECF8E] text-[#0a1f15] hover:bg-[#38b97e] transition-colors flex items-center justify-center gap-2"
                              >
                                Advance to {STAGES[si + 1]?.label || 'Next Stage'}
                                <I n="chevR" s={14} c="text-[#0a1f15]" />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="rounded-lg border border-[#2a2a2a] bg-[#161616] p-5">
            <Section title="Project Details" icon="file">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-5 gap-y-4">
                <DetailField label="Business Unit" value={camp.bu} />
                <DetailField label="Campaign Type" value={camp.ct} />
                <DetailField label="Created" value={camp.created} />
                <DetailField label="Launch Date" value={camp.date} />
                <DetailField label="Quarter" value={camp.q} />
                <DetailField label="Period / Week" value={`${camp.p} ${camp.w}`} />
                <DetailField label="Requested By" value={camp.by.n} />
                <DetailField label="Requester LDAP" value={camp.by.l} />
                <DetailField label="Team" value={camp.mr} />
                <DetailField label="Representative" value={camp.rep} />
                <DetailField label="Priority" value={camp.pri} />
                <DetailField label="Status" value={camp.status} />
              </div>
            </Section>
          </div>

          {/* ROI */}
          <div className="rounded-lg border border-[#2a2a2a] bg-[#161616] p-5">
            <Section title="ROI Estimates" icon="trendUp">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-md border border-[#2a2a2a] bg-[#1e1e1e] p-4">
                  <span className="text-[10px] text-[#555] uppercase tracking-wide">Revenue</span>
                  <p className="text-[16px] font-semibold text-[#3ECF8E] mt-1">{ext.roiRevenue || camp.roi || '—'}</p>
                </div>
                <div className="rounded-md border border-[#2a2a2a] bg-[#1e1e1e] p-4">
                  <span className="text-[10px] text-[#555] uppercase tracking-wide">Engagement</span>
                  <p className="text-[16px] font-semibold text-[#60a5fa] mt-1">{ext.roiEngagement || '—'}</p>
                </div>
              </div>
            </Section>
          </div>

          {/* Banners & Channels */}
          <div className="rounded-lg border border-[#2a2a2a] bg-[#161616] p-5 space-y-5">
            <Section title="Banners" icon="grid">
              <div className="flex flex-wrap gap-1.5">
                {(camp.banners || []).map((b) => (
                  <span key={b} className="text-[11px] font-medium px-2.5 py-1 rounded bg-[#3ECF8E12] border border-[#3ECF8E25] text-[#3ECF8E]">{b}</span>
                ))}
              </div>
            </Section>

            <div className="border-t border-[#2a2a2a]" />

            <Section title="Support Channels" icon="hash">
              <div className="flex flex-wrap gap-1.5">
                {(camp.ch || []).map((c) => (
                  <span key={c} className="text-[11px] px-2.5 py-1 rounded bg-[#1e1e1e] border border-[#2e2e2e] text-[#999]">{c}</span>
                ))}
              </div>
            </Section>

            {(camp.mch || []).length > 0 && (
              <>
                <div className="border-t border-[#2a2a2a]" />
                <Section title="Marketing Channels" icon="globe">
                  <div className="flex flex-wrap gap-1.5">
                    {camp.mch.map((c) => (
                      <span key={c} className="text-[11px] px-2.5 py-1 rounded bg-[#60a5fa12] border border-[#60a5fa25] text-[#60a5fa]">{c}</span>
                    ))}
                  </div>
                </Section>
              </>
            )}
          </div>

          {/* Channel Leads */}
          {chLeads.length > 0 && (
            <div className="rounded-lg border border-[#2a2a2a] bg-[#161616] p-5">
              <Section title="Channel Lead Assignments" icon="user">
                <div className="space-y-2">
                  {chLeads.map((cl) => (
                    <div key={cl.channel} className="flex items-center justify-between px-3 py-2 rounded-md bg-[#1e1e1e] border border-[#2a2a2a]">
                      <span className="text-[12px] text-[#999]">{cl.channel}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-medium text-[#ccc]">{cl.lead}</span>
                        {cl.isOverride && (
                          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-[#fbbf2418] border border-[#fbbf2430] text-[#fbbf24]">Custom</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            </div>
          )}

          {/* Audience & Targeting */}
          <div className="rounded-lg border border-[#2a2a2a] bg-[#161616] p-5 space-y-5">
            <Section title="Audience & Targeting" icon="target">
              {camp.aud && (
                <div className="mb-4">
                  <span className="text-[10px] text-[#555] uppercase tracking-wide">Target Audience</span>
                  <p className="text-[12px] text-[#ccc] mt-1 leading-relaxed">{camp.aud}</p>
                </div>
              )}
              {(ext.segDef || ext.targetCriteria) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ext.segDef && (
                    <div className="rounded-md border border-[#2a2a2a] bg-[#1e1e1e] p-3">
                      <span className="text-[10px] text-[#555] uppercase tracking-wide">Segment Definition</span>
                      <p className="text-[12px] text-[#ccc] mt-1 leading-relaxed">{ext.segDef}</p>
                    </div>
                  )}
                  {ext.targetCriteria && (
                    <div className="rounded-md border border-[#2a2a2a] bg-[#1e1e1e] p-3">
                      <span className="text-[10px] text-[#555] uppercase tracking-wide">Targeting Criteria</span>
                      <p className="text-[12px] text-[#ccc] mt-1 leading-relaxed">{ext.targetCriteria}</p>
                    </div>
                  )}
                </div>
              )}
              {!camp.aud && !ext.segDef && !ext.targetCriteria && <EmptyState text="No audience data provided" />}
            </Section>
          </div>

          {/* Creative Brief */}
          {(ext.creativeType || ext.brandAssets) && (
            <div className="rounded-lg border border-[#2a2a2a] bg-[#161616] p-5">
              <Section title="Creative Brief" icon="sparkle">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DetailField label="Creative Type" value={ext.creativeType} />
                  <DetailField label="Brand Assets" value={ext.brandAssets} />
                </div>
              </Section>
            </div>
          )}

          {/* Files & Uploads */}
          <div className="rounded-lg border border-[#2a2a2a] bg-[#161616] p-5">
            <Section title="Files & Uploads" icon="upload">
              {allFiles.length === 0 ? (
                <EmptyState text="No files uploaded for this campaign" />
              ) : (
                <div className="space-y-4">
                  {/* Group by category */}
                  {['Merchandising', 'Creative', 'Vendor Style Guide', 'ISAN Scripts', 'AMC Guidance'].map((cat) => {
                    const files = allFiles.filter((f) => f.category === cat);
                    if (files.length === 0) return null;
                    return (
                      <div key={cat}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-medium text-[#555] uppercase tracking-wider">{cat}</span>
                          <span className="text-[10px] text-[#444]">{files.length} file{files.length !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="space-y-1.5">
                          {files.map((f) => <FileRow key={f.name} file={f} onClick={() => setPreviewFile(f)} />)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Section>
          </div>
        </div>

        {/* ─── Right column ─── */}
        <div className="space-y-5 lg:sticky lg:top-4 lg:self-start">
          {/* Team & Stakeholders */}
          <div className="rounded-lg border border-[#2a2a2a] bg-[#161616] p-5">
            <Section title="Team & Stakeholders" icon="user">
              {(() => {
                const VISIBLE = 5;
                const visible = showAllTeam ? teamMembers : teamMembers.slice(0, VISIBLE);
                const remaining = teamMembers.length - VISIBLE;
                return (
                  <>
                    <div className="grid grid-cols-3 gap-2">
                      {visible.map((m) => (
                        <div key={m.name + m.role} className="flex flex-col items-center text-center px-2 py-3 rounded-lg bg-[#1e1e1e] border border-[#2a2a2a]">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold mb-2"
                            style={{ background: `${m.color}15`, border: `2px solid ${m.color}30`, color: m.color }}
                          >
                            {m.name.split(' ').map((w) => w[0]).join('')}
                          </div>
                          <p className="text-[11px] font-medium text-[#ccc] truncate w-full">{m.name}</p>
                          <p className="text-[9px] text-[#555] mt-0.5 truncate w-full">{m.role}</p>
                        </div>
                      ))}
                      {!showAllTeam && remaining > 0 && (
                        <button
                          onClick={() => setShowAllTeam(true)}
                          className="flex flex-col items-center justify-center px-2 py-3 rounded-lg border border-dashed border-[#333] hover:border-[#3ECF8E40] hover:bg-[#3ECF8E08] transition-colors cursor-pointer"
                        >
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold mb-2 bg-[#252525] border-2 border-[#333] text-[#888]">
                            +{remaining}
                          </div>
                          <p className="text-[11px] font-medium text-[#666]">more</p>
                        </button>
                      )}
                    </div>
                    {showAllTeam && teamMembers.length > VISIBLE && (
                      <button
                        onClick={() => setShowAllTeam(false)}
                        className="mt-2 text-[11px] text-[#555] hover:text-[#ccc] transition-colors flex items-center gap-1 mx-auto"
                      >
                        <I n="chevL" s={10} c="rotate-90" />
                        Show less
                      </button>
                    )}
                  </>
                );
              })()}
            </Section>
          </div>

          {/* Comments */}
          <div className="rounded-lg border border-[#2a2a2a] bg-[#161616] p-5">
            <Section title="Comments" icon="send">
              {comments.length === 0 ? (
                <div className="py-6 text-center">
                  <I n="send" s={20} c="text-[#333] mx-auto mb-2" />
                  <p className="text-[12px] text-[#555]">No comments yet</p>
                  <p className="text-[11px] text-[#444] mt-0.5">Be the first to add one below</p>
                </div>
              ) : (
                <div className="relative ml-3 mb-4">
                  <div className="absolute left-0 top-2 bottom-2 w-px bg-[#2a2a2a]" />
                  <div className="space-y-4">
                    {comments.map((c) => (
                      <div key={c.id} className="flex items-start gap-3 relative">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 -ml-3 text-[9px] font-bold" style={{ background: 'linear-gradient(#3ECF8E18, #3ECF8E18), #161616', border: '1px solid #3ECF8E30', color: '#3ECF8E' }}>
                          {c.author.split(' ').map((w) => w[0]).join('')}
                        </div>
                        <div className="pt-0.5 min-w-0">
                          <p className="text-[11px] text-[#555]"><span className="text-[#999] font-medium">{c.author}</span> <span className="text-[#333]">&middot;</span> {fmtTime(c.date)}</p>
                          <p className="text-[12px] text-[#ccc] mt-0.5 leading-relaxed">{c.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-3">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey && commentText.trim()) {
                      e.preventDefault();
                      onAddComment(commentText.trim());
                      setCommentText('');
                    }
                  }}
                  placeholder="Add a comment..."
                  rows={2}
                  className="w-full bg-[#1e1e1e] border border-[#2a2a2a] text-[#ccc] text-[12px] rounded-md px-3 py-2 resize-none placeholder-[#444] focus:outline-none focus:border-[#3ECF8E50] focus:shadow-[0_0_0_2px_rgba(62,207,142,0.12)] transition-colors"
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => { if (commentText.trim()) { onAddComment(commentText.trim()); setCommentText(''); } }}
                    disabled={!commentText.trim()}
                    className="px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors"
                    style={{ backgroundColor: commentText.trim() ? '#3ECF8E' : '#1e1e1e', color: commentText.trim() ? '#0a1f15' : '#555', cursor: commentText.trim() ? 'pointer' : 'default' }}
                    onMouseEnter={(e) => { if (commentText.trim()) e.currentTarget.style.backgroundColor = '#38b97e'; }}
                    onMouseLeave={(e) => { if (commentText.trim()) e.currentTarget.style.backgroundColor = '#3ECF8E'; }}
                  >
                    Send
                  </button>
                </div>
              </div>
            </Section>
          </div>
        </div>
      </div>

      {previewFile && <FilePreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />}

      {/* Approve / Reject modal */}
      {actionModal && createPortal(
        <>
          <div className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-[3px] anim-backdrop" onClick={() => setActionModal(null)} />
          <div className="fixed inset-0 z-[61] flex items-center justify-center p-4">
            <div className="bg-[#161616] border border-[#2a2a2a] rounded-xl shadow-2xl anim-scale w-full max-w-md overflow-hidden">
              {/* Modal header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#2a2a2a] bg-[#1a1a1a]">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center ${actionModal.type === 'approve' ? 'bg-[#3ECF8E20]' : 'bg-[#f8717120]'}`}>
                    <I n={actionModal.type === 'approve' ? 'check' : 'x'} s={13} c={actionModal.type === 'approve' ? 'text-[#3ECF8E]' : 'text-[#f87171]'} />
                  </div>
                  <h3 className="text-[13px] font-semibold text-[#ededed]">
                    {actionModal.type === 'approve' ? 'Approve' : 'Reject'}: {actionModal.label}
                  </h3>
                </div>
                <button onClick={() => setActionModal(null)} className="p-1.5 hover:bg-[#252525] rounded-md transition-colors text-[#777] hover:text-[#ededed]">
                  <I n="x" s={14} />
                </button>
              </div>

              {/* Modal body */}
              <div className="px-5 py-4 space-y-4">
                {actionModal.type === 'reject' && (
                  <div>
                    <label className="block text-[11px] font-medium text-[#888] mb-1.5">Send back to stage</label>
                    <select
                      value={rejectStage}
                      onChange={(e) => setRejectStage(e.target.value)}
                      className="w-full bg-[#1e1e1e] border border-[#2a2a2a] text-[#ccc] text-[12px] rounded-md px-3 py-2 focus:outline-none focus:border-[#f8717150] transition-colors"
                    >
                      {STAGES.slice(0, si).map((s) => (
                        <option key={s.key} value={s.key}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-[11px] font-medium text-[#888] mb-1.5">
                    {actionModal.type === 'approve' ? 'Comment' : 'Rejection reason'}
                  </label>
                  <textarea
                    value={actionComment}
                    onChange={(e) => setActionComment(e.target.value)}
                    placeholder={actionModal.type === 'approve' ? 'Add a comment for this approval...' : 'Explain why this is being rejected...'}
                    rows={3}
                    className="w-full bg-[#1e1e1e] border border-[#2a2a2a] text-[#ccc] text-[12px] rounded-md px-3 py-2 resize-none placeholder-[#444] focus:outline-none focus:border-[#3ECF8E50] transition-colors"
                    autoFocus
                  />
                </div>
              </div>

              {/* Modal footer */}
              <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-[#2a2a2a] bg-[#1a1a1a]">
                <button
                  onClick={() => setActionModal(null)}
                  className="px-3.5 py-1.5 rounded-md text-[11px] font-medium bg-[#252525] text-[#ccc] hover:bg-[#303030] border border-[#333] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!actionComment.trim()) return;
                    if (actionModal.type === 'approve') {
                      onApprove(camp.id, actionModal.key, actionComment.trim());
                    } else {
                      onReject(camp.id, actionModal.key, rejectStage, actionComment.trim());
                    }
                    setActionModal(null);
                    setActionComment('');
                  }}
                  disabled={!actionComment.trim()}
                  className={`px-3.5 py-1.5 rounded-md text-[11px] font-semibold transition-colors ${
                    actionComment.trim()
                      ? actionModal.type === 'approve'
                        ? 'bg-[#3ECF8E] text-[#0a1f15] hover:bg-[#38b97e]'
                        : 'bg-[#f87171] text-white hover:bg-[#ef4444]'
                      : 'bg-[#1e1e1e] text-[#555] cursor-default'
                  }`}
                >
                  {actionModal.type === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
                </button>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
};

export default CampaignDetailPage;
