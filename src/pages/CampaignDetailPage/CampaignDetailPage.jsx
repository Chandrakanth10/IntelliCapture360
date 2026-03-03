import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { CAMPS, CH_LEADS, CURRENT_USER, I, STAGES, STAGE_APPROVALS } from '../../shared/campaignShared';
import { ext_, getFileMeta, downloadFile } from './_shared';
import CompactHeader from './CompactHeader';
import StageSidebar from './StageSidebar';
import ApprovalChecklist from './ApprovalChecklist';
import IntakeTab from './tabs/IntakeTab';
import BriefingTab from './tabs/BriefingTab';
import PlanningStrategyTab from './tabs/PlanningStrategyTab';
import AudienceTab from './tabs/AudienceTab';
import CreativeTab from './tabs/CreativeTab';
import ExecutionTab from './tabs/ExecutionTab';
import ReportingTab from './tabs/ReportingTab';

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

/* ═══ STAGE → TAB MAPPING ═══ */
const STAGE_TO_TAB = {
  intake: 0,
  review: 1,
  planning: 2,
  strategy: 2,
  creative: 4,
  execution: 5,
  live: 6,
};

const TAB_STAGE_KEYS = [
  ['intake'],
  ['review'],
  ['planning', 'strategy'],
  [],              // Audience — no approval checklist
  ['creative'],
  ['execution'],
  ['live'],
];

/* ═══ MOCK PREVIEW COMPONENTS ═══ */
const MockPdfPreview = ({ name }) => (
  <div className="space-y-3">
    {[1, 2, 3].map((p) => (
      <div key={p} className="bg-[var(--sb-panel-3)] rounded-md border border-[var(--sb-border-soft)] p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] text-[var(--sb-muted-soft)]">Page {p}</span>
          <span className="text-[11px] text-[var(--sb-muted-soft)]">{name}</span>
        </div>
        <div className="space-y-2.5">
          {p === 1 && <div className="h-5 w-3/5 rounded bg-[var(--sb-panel-2)]" />}
          <div className="h-3 w-full rounded bg-[var(--sb-panel)]" />
          <div className="h-3 w-full rounded bg-[var(--sb-panel)]" />
          <div className="h-3 w-4/5 rounded bg-[var(--sb-panel)]" />
          {p === 1 && <div className="h-24 w-full rounded bg-[#222] mt-3 flex items-center justify-center"><span className="text-[11px] text-[var(--sb-muted-soft)]">[ Chart / Diagram ]</span></div>}
          {p === 2 && (
            <div className="grid grid-cols-3 gap-2 mt-3">
              {[1, 2, 3, 4, 5, 6].map((r) => <div key={r} className="h-6 rounded bg-[#222]" />)}
            </div>
          )}
          <div className="h-3 w-full rounded bg-[var(--sb-panel)]" />
          <div className="h-3 w-3/4 rounded bg-[var(--sb-panel)]" />
        </div>
      </div>
    ))}
  </div>
);

const MockImagePreview = ({ name, color }) => (
  <div className="bg-[var(--sb-panel-3)] rounded-md border border-[var(--sb-border-soft)] overflow-hidden">
    <div className="aspect-[16/9] flex items-center justify-center relative" style={{ background: `linear-gradient(135deg, ${color}10, ${color}05)` }}>
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, currentColor 10px, currentColor 11px)', color }} />
      <div className="text-center z-10">
        <div className="w-14 h-14 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
          <I n="eye" s={24} c={`text-[${color}]`} />
        </div>
        <p className="text-[12px] font-medium text-[var(--sb-muted)]">{name}</p>
        <p className="text-[11px] text-[var(--sb-muted-soft)] mt-1">Image preview</p>
      </div>
    </div>
  </div>
);

const MockVideoPreview = ({ name }) => (
  <div className="bg-[#0a0a0a] rounded-md border border-[var(--sb-border-soft)] overflow-hidden">
    <div className="aspect-video flex items-center justify-center relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[#f472b608] to-transparent" />
      <div className="text-center z-10">
        <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 cursor-pointer hover:bg-white/15 transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="none"><polygon points="8 5 20 12 8 19" /></svg>
        </div>
        <p className="text-[12px] font-medium text-[var(--sb-muted)]">{name}</p>
      </div>
    </div>
    <div className="px-4 py-2.5 border-t border-[var(--sb-border-soft)] flex items-center gap-3">
      <div className="h-1 flex-1 bg-[var(--sb-border-soft)] rounded-full overflow-hidden"><div className="h-full w-0 bg-[#f472b6] rounded-full" /></div>
      <span className="text-[11px] text-[var(--sb-muted-soft)] shrink-0">0:00 / 0:15</span>
    </div>
  </div>
);

const MockHtmlPreview = ({ name }) => (
  <div className="bg-[var(--sb-panel-3)] rounded-md border border-[var(--sb-border-soft)] overflow-hidden">
    <div className="px-3 py-2 border-b border-[var(--sb-border-soft)] flex items-center gap-2">
      <div className="flex gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" /><span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" /><span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" /></div>
      <span className="text-[11px] text-[var(--sb-muted-soft)] flex-1 text-center truncate">{name}</span>
    </div>
    <div className="p-4 font-mono text-[11px] leading-relaxed">
      <p><span className="text-[var(--sb-muted-soft)]">&lt;</span><span className="text-[#f87171]">html</span><span className="text-[var(--sb-muted-soft)]">&gt;</span></p>
      <p className="ml-4"><span className="text-[var(--sb-muted-soft)]">&lt;</span><span className="text-[#f87171]">head</span><span className="text-[var(--sb-muted-soft)]">&gt;</span></p>
      <p className="ml-8"><span className="text-[var(--sb-muted-soft)]">&lt;</span><span className="text-[#f87171]">title</span><span className="text-[var(--sb-muted-soft)]">&gt;</span><span className="text-[var(--sb-text)]">Email Template</span><span className="text-[var(--sb-muted-soft)]">&lt;/</span><span className="text-[#f87171]">title</span><span className="text-[var(--sb-muted-soft)]">&gt;</span></p>
      <p className="ml-4"><span className="text-[var(--sb-muted-soft)]">&lt;/</span><span className="text-[#f87171]">head</span><span className="text-[var(--sb-muted-soft)]">&gt;</span></p>
      <p className="ml-4"><span className="text-[var(--sb-muted-soft)]">&lt;</span><span className="text-[#f87171]">body</span> <span className="text-[#fbbf24]">style</span><span className="text-[var(--sb-muted-soft)]">=</span><span className="text-[var(--sb-accent)]">"..."</span><span className="text-[var(--sb-muted-soft)]">&gt;</span></p>
      <p className="ml-8"><span className="text-[var(--sb-muted-soft)]">&lt;</span><span className="text-[#f87171]">table</span> <span className="text-[#fbbf24]">width</span><span className="text-[var(--sb-muted-soft)]">=</span><span className="text-[var(--sb-accent)]">"600"</span><span className="text-[var(--sb-muted-soft)]">&gt;</span></p>
      <p className="ml-12 text-[var(--sb-muted-soft)]">...</p>
      <p className="ml-8"><span className="text-[var(--sb-muted-soft)]">&lt;/</span><span className="text-[#f87171]">table</span><span className="text-[var(--sb-muted-soft)]">&gt;</span></p>
      <p className="ml-4"><span className="text-[var(--sb-muted-soft)]">&lt;/</span><span className="text-[#f87171]">body</span><span className="text-[var(--sb-muted-soft)]">&gt;</span></p>
      <p><span className="text-[var(--sb-muted-soft)]">&lt;/</span><span className="text-[#f87171]">html</span><span className="text-[var(--sb-muted-soft)]">&gt;</span></p>
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
    <div className="bg-[var(--sb-panel-3)] rounded-md border border-[var(--sb-border-soft)] overflow-hidden">
      <div className="px-4 py-2.5 border-b border-[var(--sb-border-soft)] flex items-center justify-between">
        <span className="text-[11px] font-medium text-[var(--sb-muted)]">{name}</span>
        <span className="text-[11px] text-[var(--sb-muted-soft)]">{items.filter((i) => i.type !== 'folder').length} files</span>
      </div>
      <div className="divide-y divide-[#222]">
        {items.map((item) => (
          <div key={item.n} className={`px-4 py-2 flex items-center gap-2.5 ${item.type === 'folder' ? 'bg-[var(--sb-panel)]' : ''}`}>
            <I n={item.type === 'folder' ? 'layers' : 'file'} s={12} c={item.type === 'folder' ? 'text-[#fbbf24]' : 'text-[var(--sb-muted-soft)]'} />
            <span className={`text-[11px] flex-1 ${item.type === 'folder' ? 'font-medium text-[var(--sb-text)]' : 'text-[var(--sb-muted)]'}`}>{item.n}</span>
            {item.s && <span className="text-[11px] text-[var(--sb-muted-soft)]">{item.s}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

const MockSpreadsheetPreview = ({ name }) => (
  <div className="bg-[var(--sb-panel-3)] rounded-md border border-[var(--sb-border-soft)] overflow-hidden">
    <div className="px-4 py-2.5 border-b border-[var(--sb-border-soft)]">
      <span className="text-[11px] font-medium text-[var(--sb-muted)]">{name}</span>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-[11px]">
        <thead>
          <tr className="bg-[var(--sb-panel)]">
            {['', 'A', 'B', 'C', 'D'].map((h) => (
              <th key={h} className="px-3 py-1.5 text-[11px] font-medium text-[var(--sb-muted-soft)] border-b border-r border-[var(--sb-border-soft)] text-left">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4, 5].map((r) => (
            <tr key={r}>
              <td className="px-3 py-1.5 text-[11px] text-[var(--sb-muted-soft)] border-b border-r border-[var(--sb-border-soft)] bg-[var(--sb-panel)] w-8">{r}</td>
              {[0, 1, 2, 3].map((c) => (
                <td key={c} className="px-3 py-1.5 text-[var(--sb-muted)] border-b border-r border-[#222] min-w-[100px]">
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
  <div className="bg-[var(--sb-panel-3)] rounded-md border border-[var(--sb-border-soft)] p-6 max-w-[480px] mx-auto">
    <div className="mb-5">
      <div className="h-5 w-2/3 rounded bg-[var(--sb-panel-2)] mb-3" />
      <div className="h-3 w-1/3 rounded bg-[var(--sb-panel)]" />
    </div>
    <div className="space-y-2">
      <div className="h-3 w-full rounded bg-[var(--sb-panel)]" />
      <div className="h-3 w-full rounded bg-[var(--sb-panel)]" />
      <div className="h-3 w-5/6 rounded bg-[var(--sb-panel)]" />
      <div className="h-6" />
      <div className="h-3 w-full rounded bg-[var(--sb-panel)]" />
      <div className="h-3 w-full rounded bg-[var(--sb-panel)]" />
      <div className="h-3 w-2/3 rounded bg-[var(--sb-panel)]" />
    </div>
    <p className="text-[11px] text-[var(--sb-muted-soft)] text-center mt-5">{name}</p>
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
    case 'xlsx': case 'pptx': return <MockSpreadsheetPreview name={file.name} />;
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
      <div className="fixed inset-4 sm:inset-8 lg:inset-y-10 lg:inset-x-[10%] z-[61] flex flex-col bg-[var(--sb-bg-soft)] border border-[var(--sb-border-soft)] rounded-xl shadow-2xl anim-scale overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-[var(--sb-border-soft)] bg-[var(--sb-panel-3)] shrink-0">
          <div className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: `${meta.color}15`, border: `1px solid ${meta.color}25`, color: meta.color }}>
            <I n={meta.icon} s={14} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-[var(--sb-text-strong)] truncate">{file.name}</p>
            <p className="text-[11px] text-[var(--sb-muted-soft)]">{meta.label} &middot; {file.size} &middot; Uploaded {file.date}</p>
          </div>
          {file.category && (
            <span className="text-[11px] font-medium px-2 py-1 rounded bg-[var(--sb-panel-2)] border border-[var(--sb-border)] text-[var(--sb-muted)] shrink-0">{file.category}</span>
          )}
          <button onClick={onClose} className="p-1.5 hover:bg-[var(--sb-panel-2)] rounded-md transition-colors text-[var(--sb-muted)] hover:text-[var(--sb-text-strong)] shrink-0 ml-2">
            <I n="x" s={14} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-5">
          {getPreview(file)}
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--sb-border-soft)] bg-[var(--sb-panel-3)] shrink-0">
          <span className="text-[11px] text-[var(--sb-muted-soft)]">{file.size} &middot; {meta.label}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadFile(file)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-[11px] font-medium bg-[var(--sb-accent)] text-[var(--sb-accent-contrast)] hover:bg-[var(--sb-accent-strong)] transition-colors"
            >
              <I n="upload" s={12} c="rotate-180" />
              Download
            </button>
            <button onClick={onClose} className="px-3.5 py-1.5 rounded-md text-[11px] font-medium bg-[var(--sb-panel-2)] text-[var(--sb-text)] border border-[var(--sb-border)] transition-colors">
              Close
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

/* ═══ MOCK BRIEFING COMMENTS ═══ */
const BRIEFING_COMMENTS = [
  { id: 'b1', author: 'David Park', date: '2026-02-28T10:22:00', text: 'Executive summary captures the strategy well. I\'d add a note about the loyalty tier ROI uplift from Q4.' },
  { id: 'b2', author: 'Lauren Hannigan', date: '2026-02-28T11:45:00', text: 'Channel allocation looks right. Let\'s increase CRM budget by 10% based on last quarter\'s performance.' },
  { id: 'b3', author: 'Greg Harmon', date: '2026-02-28T14:10:00', text: 'Finance review in progress. KPI projections look conservative \u2014 we exceeded similar targets by 15% last quarter.' },
];

/* ═══ MAIN COMPONENT ═══ */
const CampaignDetailPage = ({
  campaigns = CAMPS,
  approvals = {},
  onApprove,
  onReject,
  onAdvanceStage,
  briefings = {},
  onUploadBriefing,
  onRemoveBriefing,
  comments = [],
  onAddComment,
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const fromPage = location.state?.from || 'Campaigns';

  const camp = campaigns.find((c) => c.id === Number(id));

  const [activeTab, setActiveTab] = useState(0);
  const [previewFile, setPreviewFile] = useState(null);
  const [commentText, setCommentText] = useState('');

  if (!camp) {
    return (
      <div className="anim-fade py-20 text-center">
        <I n="alert" s={32} c="text-[var(--sb-muted-soft)] mx-auto mb-3" />
        <p className="text-[14px] text-[var(--sb-muted)]">Campaign not found</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-[12px] text-[var(--sb-accent)] hover:text-[var(--sb-accent-strong)] transition-colors">Go back</button>
      </div>
    );
  }

  // All campaigns show as Intake stage (other stages are WIP)
  const si = 0;
  const stg = STAGES[0];
  const ext = EXT[camp.id] || {};

  const chLeads = (camp.ch || []).map((ch) => ({
    channel: ch,
    lead: ext.chLeadOverrides?.[ch] || CH_LEADS[ch] || 'Unassigned',
    isOverride: !!ext.chLeadOverrides?.[ch],
  }));

  const aiSummary = AI_SUMMARIES[camp.id] || genSummary(camp);

  const activeComments = activeTab === 0 ? comments : activeTab === 1 ? BRIEFING_COMMENTS : [];

  const tabProps = {
    camp, ext, si, stg, approvals, chLeads,
    onPreviewFile: setPreviewFile,
    briefings, onUploadBriefing, onRemoveBriefing,
    aiSummary,
  };

  const renderTab = () => {
    switch (activeTab) {
      case 0: return <IntakeTab {...tabProps} />;
      case 1: return <BriefingTab {...tabProps} />;
      case 2: return <PlanningStrategyTab {...tabProps} />;
      case 3: return <AudienceTab {...tabProps} />;
      case 4: return <CreativeTab {...tabProps} />;
      case 5: return <ExecutionTab {...tabProps} />;
      case 6: return <ReportingTab {...tabProps} />;
      default: return <IntakeTab {...tabProps} />;
    }
  };

  /* ── Comments JSX (shared between lg right-panel and stacked fallback) ── */
  const commentsBody = (
    <>
      {activeComments.length === 0 ? (
        <div className="py-6 text-center">
          <I n="send" s={20} c="text-[var(--sb-muted-soft)] mx-auto mb-2" />
          <p className="text-[12px] text-[var(--sb-muted-soft)]">No comments yet</p>
          <p className="text-[11px] text-[var(--sb-muted-soft)] mt-0.5">Be the first to add one below</p>
        </div>
      ) : (
        <div className="relative ml-3 mb-4">
          <div className="absolute left-0 top-2 bottom-2 w-px bg-[var(--sb-border-soft)]" />
          <div className="space-y-4">
            {activeComments.map((c) => (
              <div key={c.id} className="flex items-start gap-3 relative">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 -ml-3 text-[11px] font-bold" style={{ background: 'linear-gradient(rgba(var(--sb-accent-rgb),0.18), rgba(var(--sb-accent-rgb),0.18)), var(--sb-bg-soft)', border: '1px solid rgba(var(--sb-accent-rgb),0.30)', color: 'var(--sb-accent)' }}>
                  {c.author.split(' ').map((w) => w[0]).join('')}
                </div>
                <div className="pt-0.5 min-w-0">
                  <p className="text-[11px] text-[var(--sb-muted-soft)]"><span className="text-[var(--sb-muted)] font-medium">{c.author}</span> <span className="text-[var(--sb-muted-soft)]">&middot;</span> {fmtTime(c.date)}</p>
                  <p className="text-[13px] text-[var(--sb-text)] mt-0.5 leading-relaxed">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );

  const commentInput = (
    <div>
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
        className="w-full bg-[var(--sb-panel)] border border-[var(--sb-border-soft)] text-[var(--sb-text)] text-[13px] rounded-md px-3 py-2 resize-none placeholder-[var(--sb-muted-soft)] focus:outline-none focus:border-[rgba(var(--sb-accent-rgb),0.50)] focus:shadow-[0_0_0_2px_rgba(var(--sb-accent-rgb),0.12)] transition-colors"
      />
      <div className="flex justify-end mt-2">
        <button
          onClick={() => { if (commentText.trim()) { onAddComment(commentText.trim()); setCommentText(''); } }}
          disabled={!commentText.trim()}
          className="px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors"
          style={{ backgroundColor: commentText.trim() ? 'var(--sb-accent)' : 'var(--sb-panel)', color: commentText.trim() ? 'var(--sb-accent-contrast)' : 'var(--sb-muted-soft)', cursor: commentText.trim() ? 'pointer' : 'default' }}
        >
          Send
        </button>
      </div>
    </div>
  );

  return (
    <div className="anim-fade flex flex-col -m-4 md:-m-6 overflow-hidden" style={{ height: 'calc(100vh - 64px)' }}>
      {/* ── Mobile tab bar (below md where sidebar is hidden) ── */}
      <div className="md:hidden shrink-0 px-4 pt-4 pb-3">
        <div className="flex gap-1.5 overflow-x-auto scrollbar-thin py-0.5">
          {['Intake', 'Briefing', 'Plan + Strat', 'Audience', 'Creative', 'Execution', 'Reporting'].map((label, i) => (
            <button
              key={label}
              onClick={() => setActiveTab(i)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${
                activeTab === i
                  ? 'bg-[var(--sb-accent)] text-[var(--sb-accent-contrast)]'
                  : 'bg-[var(--sb-panel)] text-[var(--sb-muted)] border border-[var(--sb-border-soft)]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Unified card: header + three-panel body ── */}
      <div className="flex-1 min-h-0 m-4 md:m-6 rounded-lg border border-[var(--sb-border-soft)] bg-[var(--sb-panel)] overflow-hidden flex flex-col">
        {/* Integrated header */}
        <CompactHeader
          camp={camp}
          si={si}
          stg={stg}
          fromPage={fromPage}
          onBack={() => navigate(-1)}
        />

        {/* Three-panel body */}
        <div className="flex-1 min-h-0 flex">
          {/* Left: section nav — hidden on mobile */}
          <div className="hidden md:flex md:flex-col w-[200px] shrink-0 border-r border-[var(--sb-border-soft)] p-3 overflow-y-auto scrollbar-thin">
            <StageSidebar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              currentStageIdx={si}
            />
          </div>

          {/* Center: content + approvals (+ inline comments on < lg) */}
          <div className={`flex-1 min-w-0 min-h-0 overflow-y-auto scrollbar-thin ${activeTab <= 1 ? 'lg:border-r' : ''} border-[var(--sb-border-soft)]`}>
            <div className="p-5">
            {renderTab()}

            {activeTab === 0 && (
              <ApprovalChecklist
                camp={camp}
                si={si}
                stg={stg}
                approvals={approvals}
                stageKeys={['intake']}
                onApprove={onApprove}
                onReject={onReject}
                onAdvanceStage={onAdvanceStage}
              />
            )}

            {/* Comments inline for < lg screens — Intake & Briefing */}
            {activeTab <= 1 && (
              <div className="lg:hidden mt-6 pt-5 border-t border-[var(--sb-border-soft)]">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0" style={{ background: 'rgba(var(--sb-accent-rgb),0.08)' }}>
                    <I n="send" s={12} c="text-[var(--sb-accent)]" />
                  </div>
                  <h3 className="text-[12px] font-semibold text-[var(--sb-text-strong)] uppercase tracking-wider">Comments</h3>
                </div>
                {commentsBody}
                <div className="mt-3">{commentInput}</div>
              </div>
            )}
          </div>
        </div>

        {/* Right: comments panel — visible on lg+ only, Intake & Briefing tabs */}
        {activeTab <= 1 && <div className="hidden lg:flex lg:flex-col w-[320px] shrink-0">
          <div className="px-5 py-3.5 border-b border-[var(--sb-border-soft)] shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0" style={{ background: 'rgba(var(--sb-accent-rgb),0.08)' }}>
                <I n="send" s={12} c="text-[var(--sb-accent)]" />
              </div>
              <h3 className="text-[12px] font-semibold text-[var(--sb-text-strong)] uppercase tracking-wider">Comments</h3>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin p-5">
            {commentsBody}
          </div>
          <div className="shrink-0 px-5 py-3 border-t border-[var(--sb-border-soft)]">
            {commentInput}
          </div>
        </div>}
        </div>
      </div>

      {/* File Preview Modal */}
      {previewFile && <FilePreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />}
    </div>
  );
};

export default CampaignDetailPage;
