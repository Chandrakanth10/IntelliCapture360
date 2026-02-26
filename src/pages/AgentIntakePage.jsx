import { useEffect, useRef, useState } from 'react';
import {
  BANNERS,
  BUS,
  CH_LEADS,
  CH_OPTS,
  CURRENT_USER,
  I,
  MKT_CH,
  MKT_RES,
} from '../shared/campaignShared';

/* ═══ INIT FORM DATA ═══ */
const INIT_FD = {
  projectName: '', projectDesc: '', bu: '', banners: [], byName: '', byLdap: '',
  mr: '', rep: '', pri: '', roiRevenue: '', roiEngagement: '',
  year: '', quarter: '', period: '', week: '', targetDate: '',
  chSupport: [], chLeadOverrides: {}, mktCh: [], campType: '',
  audBanner: '', segDef: '', targetCriteria: '',
  merchFiles: [], brandAssets: '', creativeType: '', creativeFiles: [],
  vendorGuide: null, isanScripts: null, amcGuidance: null,
};

/* ═══ PHASE DEFINITIONS ═══ */
const PHASES = [
  { key: 'basics', title: 'Campaign Basics', icon: 'hash', desc: 'Name, description & business unit' },
  { key: 'team', title: 'Team Assignment', icon: 'user', desc: 'Marketing resource & representative' },
  { key: 'priority', title: 'Priority & Impact', icon: 'flag', desc: 'Priority level & ROI targets' },
  { key: 'timeline', title: 'Timeline', icon: 'clock', desc: 'Fiscal period & launch date' },
  { key: 'channels', title: 'Channels & Audience', icon: 'globe', desc: 'Distribution & targeting' },
  { key: 'assets', title: 'Assets & Creative', icon: 'file', desc: 'Files & creative direction' },
];

/* ═══ MOCK AI SCRIPT ═══ */
const AGENT_SCRIPT = {
  'basics-0': {
    messages: [
      { type: 'agent', text: "Let's start with your campaign. Can you describe what this campaign is about? What's the main objective?" },
      { type: 'insight', text: 'Be specific about your goals \u2014 a clear description helps the team align on strategy and allocate resources effectively.', variant: 'emerald' },
    ],
    expect: 'text', field: 'projectDesc',
  },
  'basics-1': {
    messages: [
      { type: 'agent', text: (fd) => `Based on your description, I'd suggest:\n\n**"${suggestName(fd.projectDesc)}"**\n\nWould you like to use this name, or provide your own?` },
    ],
    expect: 'chips', chips: ['Accept Suggestion', 'Custom Name'], field: 'projectName',
  },
  'basics-2': {
    messages: [
      { type: 'agent', text: 'Which business unit is this campaign for?' },
    ],
    expect: 'chips', chips: BUS, field: 'bu',
  },
  'basics-3': {
    messages: [
      { type: 'agent', text: 'Which banners should this campaign target? Select all that apply.' },
      { type: 'insight', text: 'Multi-banner campaigns typically see 40% higher reach. Consider selecting banners that share your target demographic.', variant: 'amber' },
    ],
    expect: 'multi-chips', chips: BANNERS, field: 'banners',
  },
  'basics-4': {
    messages: [
      { type: 'agent', text: `I've pre-filled the requester as **${CURRENT_USER.name}** (${CURRENT_USER.title}). Is that correct?` },
    ],
    expect: 'chips', chips: ['Yes, that\'s me', 'Different requester'], field: 'byName',
  },
  'team-0': {
    messages: [
      { type: 'agent', text: 'Which marketing resource group should own this campaign?' },
    ],
    expect: 'chips', chips: Object.keys(MKT_RES), field: 'mr',
  },
  'team-1': {
    messages: [
      { type: 'agent', text: (fd) => `Based on the ${fd.mr} team, I'd recommend **${MKT_RES[fd.mr]}** as the campaign representative. Sound good?` },
      { type: 'insight', text: 'The rep will be the primary point of contact and decision maker throughout the campaign lifecycle.', variant: 'emerald' },
    ],
    expect: 'chips', chips: ['Confirm', 'Choose different rep'], field: 'rep',
  },
  'priority-0': {
    messages: [
      { type: 'agent', text: 'What priority level should this campaign have?' },
    ],
    expect: 'priority-chips', field: 'pri',
  },
  'priority-1': {
    messages: [
      { type: 'agent', text: 'What\'s the estimated revenue impact? (e.g., $500K, $1.2M)' },
    ],
    expect: 'text', field: 'roiRevenue',
  },
  'priority-2': {
    messages: [
      { type: 'agent', text: 'And the engagement target? (e.g., 50K impressions, 10K clicks)' },
      { type: 'insight', text: 'Campaigns with both revenue and engagement targets have 25% better performance tracking and optimization.', variant: 'amber' },
    ],
    expect: 'text', field: 'roiEngagement',
  },
  'timeline-0': {
    messages: [{ type: 'agent', text: 'Let\'s set the timeline. Which fiscal year?' }],
    expect: 'chips', chips: ['FY2025', 'FY2026', 'FY2027'], field: 'year',
  },
  'timeline-1': {
    messages: [{ type: 'agent', text: 'Which quarter?' }],
    expect: 'chips', chips: ['Q1', 'Q2', 'Q3', 'Q4'], field: 'quarter',
  },
  'timeline-2': {
    messages: [{ type: 'agent', text: 'Which period within the quarter?' }],
    expect: 'chips', chips: ['P1', 'P2', 'P3', 'P4'], field: 'period',
  },
  'timeline-3': {
    messages: [{ type: 'agent', text: 'Which week?' }],
    expect: 'text', field: 'week', placeholder: 'e.g., W1, W2, W3...',
  },
  'timeline-4': {
    messages: [
      { type: 'agent', text: 'What\'s the target launch date?' },
      { type: 'insight', text: 'Allow at least 4\u20136 weeks lead time for creative development and approvals.', variant: 'emerald' },
    ],
    expect: 'date', field: 'targetDate',
  },
  'channels-0': {
    messages: [{ type: 'agent', text: 'Which channel support teams should be involved? Select all that apply.' }],
    expect: 'multi-chips', chips: CH_OPTS, field: 'chSupport',
  },
  'channels-1': {
    messages: [
      { type: 'agent', text: (fd) => {
        const leads = fd.chSupport.map(ch => `  \u2022 **${ch}**: ${CH_LEADS[ch] || 'TBD'}`).join('\n');
        return `I've auto-assigned channel leads:\n\n${leads}\n\nLooks good?`;
      }},
    ],
    expect: 'chips', chips: ['Looks good', 'I\'ll adjust later'], field: '_chLeadsConfirm',
  },
  'channels-2': {
    messages: [{ type: 'agent', text: 'Which marketing channels will you use? Select all that apply.' }],
    expect: 'multi-chips', chips: MKT_CH, field: 'mktCh',
  },
  'channels-3': {
    messages: [{ type: 'agent', text: 'What type of campaign is this?' }],
    expect: 'chips', chips: ['New', 'Existing', 'Carry Forward', 'Evergreen'], field: 'campType',
  },
  'channels-4': {
    messages: [
      { type: 'agent', text: 'Describe your target audience and segmentation criteria.' },
      { type: 'insight', text: 'Well-defined audience segments improve campaign performance by up to 60%. Consider demographics, purchase behavior, and loyalty status.', variant: 'amber' },
    ],
    expect: 'text', field: 'segDef', placeholder: 'e.g., All loyalty members, high-value shoppers...',
  },
  'assets-0': {
    messages: [{ type: 'agent', text: 'Almost done! Do you have any merchandising files to upload?' }],
    expect: 'chips', chips: ['Upload files', 'Skip for now'], field: 'merchFiles',
  },
  'assets-1': {
    messages: [{ type: 'agent', text: 'What type of creative assets do you need?' }],
    expect: 'chips', chips: ['Static', 'Animated', 'Video', 'Mixed'], field: 'creativeType',
  },
  'assets-2': {
    messages: [{ type: 'agent', text: 'Does this campaign involve Media Collective?' }],
    expect: 'chips', chips: ['Yes, Media Collective', 'No, skip'], field: '_mediaCollective',
  },
};

/* ═══ HELPERS ═══ */
function suggestName(desc) {
  if (!desc) return 'New Campaign';
  const lower = desc.toLowerCase();
  if (lower.includes('produce') || lower.includes('fresh')) return 'Q2 Fresh Produce Push \u2014 Digital + In-Store';
  if (lower.includes('coupon') || lower.includes('discount')) return 'Digital Savings Blitz \u2014 Multi-Channel';
  if (lower.includes('holiday') || lower.includes('seasonal')) return 'Seasonal Holiday Celebration Campaign';
  if (lower.includes('wellness') || lower.includes('health')) return 'Wellness & Health Awareness Drive';
  if (lower.includes('loyalty') || lower.includes('points')) return 'Loyalty Rewards Acceleration Program';
  if (lower.includes('bbq') || lower.includes('grill') || lower.includes('summer')) return 'Summer BBQ Kickoff \u2014 Grill Season';
  const words = desc.split(/\s+/).slice(0, 5).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  return words.join(' ') + ' Campaign';
}

function RichText({ text }) {
  if (!text) return null;
  return text.split('\n').map((line, li) => (
    <span key={li}>
      {li > 0 && <br />}
      {line.split(/(\*\*[^*]+\*\*)/).map((seg, si) =>
        seg.startsWith('**') && seg.endsWith('**')
          ? <strong key={si} className="text-[var(--sb-text-strong)] font-semibold">{seg.slice(2, -2)}</strong>
          : <span key={si}>{seg}</span>
      )}
    </span>
  ));
}

function relativeTime(ts) {
  const diff = Date.now() - ts;
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  return `${Math.floor(diff / 3600000)}h ago`;
}

function computeGrouping(messages, idx) {
  const msg = messages[idx];
  const prev = idx > 0 ? messages[idx - 1] : null;
  const next = idx < messages.length - 1 ? messages[idx + 1] : null;
  return {
    isFirstInGroup: !prev || prev.type !== msg.type,
    isLastInGroup: !next || next.type !== msg.type,
  };
}

/* ═══ TYPING INDICATOR ═══ */
const TypingIndicator = () => (
  <div className="flex items-end gap-2.5 anim-fade">
    <div className="w-7 h-7 rounded-full bg-[var(--sb-accent)] flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_rgba(var(--sb-accent-rgb),0.2)]">
      <I n="sparkle" s={13} c="text-[var(--sb-accent-contrast)]" />
    </div>
    <div className="px-4 py-3.5 rounded-2xl rounded-bl-md chat-bubble-agent">
      <div className="flex items-center gap-1.5">
        <span className="typing-dot" />
        <span className="typing-dot typing-dot-2" />
        <span className="typing-dot typing-dot-3" />
      </div>
    </div>
  </div>
);

/* ═══ AGENT MESSAGE ═══ */
const AgentMessage = ({ text, showAvatar, showTime, timestamp }) => (
  <div className={`flex items-end gap-2.5 anim-fade ${showAvatar ? '' : 'ml-[38px]'}`}>
    {showAvatar && (
      <div className="w-7 h-7 rounded-full bg-[var(--sb-accent)] flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_rgba(var(--sb-accent-rgb),0.2)]">
        <I n="sparkle" s={13} c="text-[var(--sb-accent-contrast)]" />
      </div>
    )}
    <div className="max-w-[85%]">
      <div className="px-4 py-3 rounded-2xl rounded-bl-md chat-bubble-agent">
        <span className="text-[13px] text-[var(--sb-text)] leading-relaxed"><RichText text={text} /></span>
      </div>
      {showTime && timestamp && (
        <p className="text-[11px] text-[var(--sb-muted-soft)] mt-1.5 ml-2 select-none">{relativeTime(timestamp)}</p>
      )}
    </div>
  </div>
);

/* ═══ USER MESSAGE ═══ */
const UserMessage = ({ text, showTime, timestamp }) => (
  <div className="flex flex-col items-end anim-fade">
    <div className="max-w-[80%] px-4 py-3 rounded-2xl rounded-br-md chat-bubble-user">
      <p className="text-[13px] text-[var(--sb-accent-soft-text)] leading-relaxed">{text}</p>
    </div>
    {showTime && timestamp && (
      <p className="text-[11px] text-[var(--sb-muted-soft)] mt-1.5 mr-2 select-none">{relativeTime(timestamp)}</p>
    )}
  </div>
);

/* ═══ SYSTEM / PHASE TRANSITION ═══ */
const SystemMessage = ({ text, isPhaseTransition }) => (
  <div className={`flex justify-center ${isPhaseTransition ? 'my-4' : 'my-1'} anim-fade`}>
    {isPhaseTransition ? (
      <div className="flex items-center gap-3 px-5 py-2.5 rounded-full"
        style={{ background: 'rgba(var(--sb-accent-rgb),0.06)', border: '1px solid rgba(var(--sb-accent-rgb),0.12)' }}>
        <div className="w-5 h-5 rounded-full bg-[rgba(var(--sb-accent-rgb),0.12)] flex items-center justify-center">
          <I n="chevR" s={10} c="text-[var(--sb-accent)]" />
        </div>
        <p className="text-[11px] font-semibold text-[var(--sb-accent)] tracking-wide">{text}</p>
      </div>
    ) : (
      <div className="px-4 py-1.5 rounded-full bg-[var(--sb-panel-3)] border border-[var(--sb-border-soft)]">
        <p className="text-[11px] text-[var(--sb-muted-soft)] font-medium">{text}</p>
      </div>
    )}
  </div>
);

/* ═══ INSIGHT CARD ═══ */
const InsightCard = ({ text, variant = 'emerald' }) => {
  const isAmber = variant === 'amber';
  return (
    <div className="anim-fade mx-2 rounded-lg overflow-hidden" style={{
      background: isAmber ? 'rgba(245,158,11,0.05)' : 'rgba(var(--sb-accent-rgb),0.04)',
      border: `1px solid ${isAmber ? 'rgba(245,158,11,0.12)' : 'rgba(var(--sb-accent-rgb),0.10)'}`,
    }}>
      <div className="flex items-start gap-3 px-4 py-3">
        <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-px ${
          isAmber ? 'bg-amber-500/15' : 'bg-[rgba(var(--sb-accent-rgb),0.12)]'
        }`}>
          <I n={isAmber ? 'zap' : 'sparkle'} s={11} c={isAmber ? 'text-amber-400' : 'text-[var(--sb-accent)]'} />
        </div>
        <p className={`text-[12px] leading-relaxed ${isAmber ? 'text-[#c9a84e]' : 'text-[#8ab8a0]'}`}>{text}</p>
      </div>
    </div>
  );
};

/* ═══ EXTRACTED DATA CARD (shown after file upload) ═══ */
const EXTRACTED_MOCK = [
  { label: 'Merch Status', value: 'Accepted', icon: 'check' },
  { label: 'UPC List', value: '3 items', icon: 'hash' },
  { label: 'U Offer IDs', value: 'UOF-2026-0451, 0452', icon: 'file' },
  { label: '4x Offer IDs', value: '4X-2026-0891', icon: 'file' },
  { label: 'Stock Up Event', value: 'SU-2026-Q1-003', icon: 'flag' },
];

const ExtractedDataCard = () => (
  <div className="anim-scale mx-2 rounded-xl overflow-hidden" style={{
    background: 'var(--sb-bg-soft)',
    border: '1px solid rgba(var(--sb-accent-rgb),0.15)',
  }}>
    <div className="px-4 py-2.5 flex items-center gap-2" style={{
      background: 'rgba(var(--sb-accent-rgb),0.06)',
      borderBottom: '1px solid rgba(var(--sb-accent-rgb),0.1)',
    }}>
      <div className="w-5 h-5 rounded-md bg-[rgba(var(--sb-accent-rgb),0.15)] flex items-center justify-center">
        <I n="zap" s={11} c="text-[var(--sb-accent)]" />
      </div>
      <span className="text-[11px] font-bold text-[var(--sb-accent)] uppercase tracking-wider">Auto-extracted Data</span>
    </div>
    <div className="grid grid-cols-2 gap-1.5 p-3">
      {EXTRACTED_MOCK.map(({ label, value, icon }) => (
        <div key={label} className="flex items-center gap-2 rounded-lg px-2.5 py-2" style={{
          background: 'var(--sb-panel-3)',
          border: '1px solid rgba(var(--sb-accent-rgb),0.08)',
        }}>
          <I n={icon} s={11} c="text-[var(--sb-accent)]" />
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-[var(--sb-accent)]/50 uppercase tracking-wider">{label}</p>
            <p className="text-[11px] font-semibold text-[var(--sb-text-strong)] truncate">{value}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ═══ CHAT CHIPS ═══ */
const ChatChips = ({ chips, onSelect, multi, selected = [], onConfirm }) => (
  <div className="flex flex-wrap gap-2 ml-[38px] anim-fade">
    {chips.map(chip => {
      const active = multi ? selected.includes(chip) : false;
      return (
        <button key={chip} type="button" onClick={() => onSelect(chip)}
          className={`chat-chip chip-toggle inline-flex items-center gap-2 px-3.5 py-2.5 border rounded-lg text-[12px] font-medium ${active ? 'active' : ''}`}>
          {multi && (
            <div className="w-3.5 h-3.5 rounded flex items-center justify-center transition-all" style={{
              borderWidth: '1.5px', borderStyle: 'solid',
              ...(active ? { background: 'var(--sb-accent)', borderColor: 'var(--sb-accent)' } : { borderColor: 'var(--sb-muted-soft)' }),
            }}>
              {active && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>}
            </div>
          )}
          {chip}
        </button>
      );
    })}
    {multi && selected.length > 0 && (
      <button type="button" onClick={onConfirm}
        className="chat-chip inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-[12px] font-semibold bg-[var(--sb-accent)] text-[var(--sb-accent-contrast)] hover:bg-[var(--sb-accent-strong)] transition-all border-transparent">
        <I n="check" s={12} /> Confirm ({selected.length})
      </button>
    )}
  </div>
);

/* ═══ PRIORITY CHIPS ═══ */
const PriorityChips = ({ onSelect }) => {
  const pris = [
    { label: 'High', color: '#f43f5e', bg: 'rgba(244,63,94,0.08)', border: 'rgba(244,63,94,0.2)', icon: 'trendUp' },
    { label: 'Medium', color: '#fbbf24', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', icon: 'bar' },
    { label: 'Low', color: '#38bdf8', bg: 'rgba(56,189,248,0.08)', border: 'rgba(56,189,248,0.2)', icon: 'target' },
  ];
  return (
    <div className="flex gap-2.5 ml-[38px] anim-fade">
      {pris.map(p => (
        <button key={p.label} type="button" onClick={() => onSelect(p.label)}
          className="chat-chip group px-5 py-3 rounded-xl text-[12px] font-semibold transition-all"
          style={{ background: p.bg, border: `1px solid ${p.border}`, color: p.color }}>
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: `${p.color}15` }}>
              <I n={p.icon} s={16} c="" />
            </div>
            <span>{p.label}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

/* ═══ GET FIELD DISPLAY VALUES ═══ */
function getFieldDisplay(phaseKey, fd) {
  switch (phaseKey) {
    case 'basics': return [
      { label: 'Campaign Name', value: fd.projectName, icon: 'edit', fdKey: 'projectName', editable: true },
      { label: 'Description', value: fd.projectDesc, icon: 'file', fdKey: 'projectDesc', editable: true },
      { label: 'Business Unit', value: fd.bu, icon: 'briefcase', fdKey: 'bu', editable: true },
      { label: 'Banners', chips: fd.banners.length ? fd.banners : null, icon: 'grid', fdKey: 'banners', removable: true },
      { label: 'Requester', value: fd.byName, icon: 'user', fdKey: 'byName', editable: true },
    ];
    case 'team': return [
      { label: 'Marketing Resource', value: fd.mr, icon: 'briefcase', fdKey: 'mr', editable: true },
      { label: 'Representative', value: fd.rep, icon: 'user', fdKey: 'rep', editable: true },
    ];
    case 'priority': return [
      { label: 'Priority', value: fd.pri, icon: 'flag', badge: fd.pri, fdKey: 'pri', editable: true },
      { label: 'Revenue Target', value: fd.roiRevenue, icon: 'trendUp', fdKey: 'roiRevenue', editable: true },
      { label: 'Engagement Target', value: fd.roiEngagement, icon: 'target', fdKey: 'roiEngagement', editable: true },
    ];
    case 'timeline': return [
      { label: 'Fiscal Year', value: fd.year, icon: 'cal', fdKey: 'year', editable: true },
      { label: 'Quarter', value: fd.quarter, icon: 'clock', fdKey: 'quarter', editable: true },
      { label: 'Period', value: fd.period, icon: 'clock', fdKey: 'period', editable: true },
      { label: 'Week', value: fd.week, icon: 'clock', fdKey: 'week', editable: true },
      { label: 'Target Date', value: fd.targetDate, icon: 'cal', fdKey: 'targetDate', editable: true, inputType: 'date' },
    ];
    case 'channels': return [
      { label: 'Channels', chips: fd.chSupport.length ? fd.chSupport : null, icon: 'globe', fdKey: 'chSupport', removable: true },
      { label: 'Mkt Channels', chips: fd.mktCh.length ? fd.mktCh : null, icon: 'send', fdKey: 'mktCh', removable: true },
      { label: 'Campaign Type', value: fd.campType, icon: 'kanban', fdKey: 'campType', editable: true },
      { label: 'Audience', value: fd.segDef, icon: 'user', fdKey: 'segDef', editable: true },
    ];
    case 'assets': return [
      { label: 'Creative Type', value: fd.creativeType, icon: 'eye', fdKey: 'creativeType', editable: true },
      { label: 'Merch Files', files: fd.merchFiles, icon: 'file', fdKey: 'merchFiles' },
      { label: 'Media Collective', value: fd.vendorGuide ? 'Yes' : '', icon: 'layers' },
    ];
    default: return [];
  }
}

/* ═══ FIELD CARD (interactive mini card for each field) ═══ */
const FieldCard = ({ field, onFieldChange }) => {
  const [editing, setEditing] = useState(false);
  const [editVal, setEditVal] = useState('');
  const hasFill = !!(field.value || field.chips || (field.files && field.files.length));
  const priBadgeColor = { High: '#f43f5e', Medium: '#fbbf24', Low: '#38bdf8' };

  const startEdit = () => {
    if (!field.editable || !field.fdKey || !hasFill) return;
    setEditVal(field.value || '');
    setEditing(true);
  };

  const saveEdit = () => {
    setEditing(false);
    if (editVal.trim() && editVal !== field.value && onFieldChange) {
      onFieldChange(field.fdKey, editVal.trim());
    }
  };

  const removeChip = (chip) => {
    if (!field.removable || !field.fdKey || !onFieldChange) return;
    const updated = field.chips.filter(c => c !== chip);
    onFieldChange(field.fdKey, updated);
  };

  const removeFile = (file) => {
    if (!field.fdKey || !onFieldChange) return;
    const updated = field.files.filter(f => f !== file);
    onFieldChange(field.fdKey, updated);
  };

  const addFile = () => {
    if (!field.fdKey || !onFieldChange) return;
    const mockName = `merch_file_${(field.files?.length || 0) + 1}.xlsx`;
    onFieldChange(field.fdKey, [...(field.files || []), mockName]);
  };

  // — Files layout —
  if (field.files !== undefined) {
    return (
      <div className="preview-field-card rounded-lg p-2.5 col-span-2 transition-all duration-300" style={{
        background: hasFill ? 'rgba(var(--sb-accent-rgb),0.03)' : 'var(--sb-bg-soft)',
        border: `1px solid ${hasFill ? 'rgba(var(--sb-accent-rgb),0.1)' : 'var(--sb-panel)'}`,
      }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <I n={field.icon} s={10} c={hasFill ? 'text-[var(--sb-accent)]' : 'text-[var(--sb-muted-soft)]'} />
            <span className="text-[11px] font-medium text-[var(--sb-muted-soft)] uppercase tracking-wider">{field.label}</span>
          </div>
          <button type="button" onClick={addFile}
            className="flex items-center gap-1 text-[11px] font-semibold text-[var(--sb-accent)] hover:text-[var(--sb-accent-soft-text)] px-1.5 py-0.5 rounded hover:bg-[rgba(var(--sb-accent-rgb),0.06)] transition-all">
            <I n="plus" s={10} /> Add
          </button>
        </div>
        {field.files.length > 0 ? (
          <div className="space-y-1">
            {field.files.map(f => (
              <div key={f} className="flex items-center gap-2 px-2 py-1.5 rounded-md group" style={{ background: 'var(--sb-panel-3)', border: '1px solid var(--sb-border-soft)' }}>
                <I n="file" s={10} c="text-[var(--sb-muted-soft)]" />
                <span className="text-[11px] text-[var(--sb-text)] flex-1 truncate">{f}</span>
                <button type="button" onClick={() => removeFile(f)}
                  className="opacity-0 group-hover:opacity-100 w-4 h-4 rounded flex items-center justify-center hover:bg-[rgba(244,63,94,0.15)] transition-all">
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <button type="button" onClick={addFile}
            className="w-full py-3 rounded-md border border-dashed border-[var(--sb-border-soft)] hover:border-[rgba(var(--sb-accent-rgb),0.3)] text-[11px] text-[var(--sb-muted-soft)] hover:text-[var(--sb-muted)] transition-all flex items-center justify-center gap-1.5">
            <I n="plus" s={11} c="text-[var(--sb-muted-soft)]" /> Upload files
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`preview-field-card rounded-lg p-2.5 transition-all duration-300 ${hasFill && field.editable ? 'cursor-pointer hover:border-[rgba(var(--sb-accent-rgb),0.2)]' : ''}`}
      onClick={!editing ? startEdit : undefined}
      style={{
        background: hasFill ? 'rgba(var(--sb-accent-rgb),0.03)' : 'var(--sb-bg-soft)',
        border: `1px solid ${editing ? 'rgba(var(--sb-accent-rgb),0.3)' : hasFill ? 'rgba(var(--sb-accent-rgb),0.1)' : 'var(--sb-panel)'}`,
      }}>
      <div className="flex items-center gap-2 mb-1.5">
        <I n={field.icon} s={10} c={hasFill ? 'text-[var(--sb-accent)]' : 'text-[var(--sb-muted-soft)]'} />
        <span className="text-[11px] font-medium text-[var(--sb-muted-soft)] uppercase tracking-wider flex-1">{field.label}</span>
        {hasFill && field.editable && !editing && (
          <I n="edit" s={9} c="text-[var(--sb-muted-soft)] hover:text-[var(--sb-muted-soft)] transition-colors" />
        )}
      </div>

      {editing ? (
        <input
          type={field.inputType || 'text'}
          autoFocus
          value={editVal}
          onChange={e => setEditVal(e.target.value)}
          onBlur={saveEdit}
          onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditing(false); }}
          className="w-full text-[12px] text-[var(--sb-text-strong)] bg-[var(--sb-panel-3)] border border-[rgba(var(--sb-accent-rgb),0.2)] rounded px-2 py-1 outline-none focus:border-[rgba(var(--sb-accent-rgb),0.4)]"
        />
      ) : field.chips ? (
        <div className="flex flex-wrap gap-1">
          {field.chips.map(c => (
            <span key={c} className="preview-chip group/chip inline-flex items-center gap-1">
              {c}
              {field.removable && onFieldChange && (
                <button type="button" onClick={(e) => { e.stopPropagation(); removeChip(c); }}
                  className="opacity-0 group-hover/chip:opacity-100 transition-opacity ml-0.5">
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="var(--sb-accent-soft-text)" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              )}
            </span>
          ))}
        </div>
      ) : field.badge && priBadgeColor[field.badge] ? (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: priBadgeColor[field.badge] }} />
          <span className="text-[12px] font-semibold" style={{ color: priBadgeColor[field.badge] }}>{field.value}</span>
        </div>
      ) : hasFill ? (
        <p className="text-[12px] text-[var(--sb-text)] font-medium leading-relaxed truncate">{field.value}</p>
      ) : (
        <div className="flex gap-1.5 items-center">
          <div className="h-[6px] rounded-full preview-skeleton" style={{ width: `${40 + Math.random() * 35}%` }} />
        </div>
      )}
    </div>
  );
};

/* ═══ STEPPER NODE ═══ */
const StepperNode = ({ index, phase, fd, isActive, isCompleted, isFuture, expanded, onToggle, onEdit, isLast, onFieldChange }) => {
  const fields = getFieldDisplay(phase.key, fd);
  const filled = fields.filter(f => f.value || f.chips || (f.files && f.files.length)).length;
  const total = fields.length;

  return (
    <div className="flex gap-0 relative">
      {/* Vertical track */}
      <div className="flex flex-col items-center flex-shrink-0 w-10">
        {/* Step circle */}
        <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
          isCompleted
            ? 'bg-[var(--sb-accent)] shadow-[0_0_12px_rgba(var(--sb-accent-rgb),0.3)]'
            : isActive
              ? 'stepper-node-active border-2 border-[var(--sb-accent)] bg-[var(--sb-bg)]'
              : 'border border-[var(--sb-border-soft)] bg-[var(--sb-panel-3)]'
        }`}>
          {isCompleted ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--sb-accent-contrast)" strokeWidth="3" strokeLinecap="round" className="completion-pop">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : isActive ? (
            <span className="text-[11px] font-bold text-[var(--sb-accent)]">{index + 1}</span>
          ) : (
            <span className="text-[11px] font-semibold text-[var(--sb-muted-soft)]">{index + 1}</span>
          )}
        </div>
        {/* Connector line */}
        {!isLast && (
          <div className="w-[2px] flex-1 -mt-px transition-all duration-500" style={{
            background: isCompleted
              ? 'linear-gradient(to bottom, var(--sb-accent), rgba(var(--sb-accent-rgb),0.3))'
              : 'var(--sb-panel)',
          }} />
        )}
      </div>

      {/* Section content */}
      <div className={`flex-1 min-w-0 pb-5 ${isLast ? '' : ''}`}>
        {/* Section header */}
        <button type="button" onClick={onToggle}
          className={`w-full flex items-center gap-2.5 text-left group rounded-xl px-3 py-2.5 -mt-1 transition-all duration-200 ${
            isActive
              ? 'bg-[rgba(var(--sb-accent-rgb),0.04)]'
              : 'hover:bg-[var(--sb-panel-3)]'
          }`}>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className={`text-[13px] font-semibold transition-colors ${
                isActive ? 'text-[var(--sb-text-strong)]' : isCompleted ? 'text-[var(--sb-text)]' : 'text-[var(--sb-muted-soft)]'
              }`}>{phase.title}</p>
              {isCompleted && (
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--sb-accent)] bg-[rgba(var(--sb-accent-rgb),0.08)] px-1.5 py-0.5 rounded">
                  Done
                </span>
              )}
            </div>
            <p className={`text-[11px] mt-0.5 ${isActive ? 'text-[var(--sb-muted-soft)]' : 'text-[var(--sb-muted-soft)]'}`}>
              {isActive ? phase.desc : `${filled}/${total} fields`}
            </p>
          </div>
          {/* Mini bar */}
          <div className="w-14 h-1.5 rounded-full bg-[var(--sb-panel-3)] overflow-hidden flex-shrink-0">
            <div className="h-full rounded-full transition-all duration-500" style={{
              width: `${total > 0 ? (filled / total) * 100 : 0}%`,
              background: isCompleted ? 'var(--sb-accent)' : isActive ? 'var(--sb-accent)' : 'var(--sb-muted-soft)',
            }} />
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            className={`text-[var(--sb-muted-soft)] transition-transform duration-200 flex-shrink-0 ${expanded ? 'rotate-90' : ''}`}>
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Expanded fields */}
        {expanded && (
          <div className="mt-2 ml-3 anim-fade">
            <div className="grid grid-cols-2 gap-1.5">
              {fields.map((f, i) => <FieldCard key={i} field={f} onFieldChange={onFieldChange} />)}
            </div>
            {isCompleted && (
              <button type="button" onClick={onEdit}
                className="mt-2.5 text-[11px] text-[var(--sb-accent)] hover:text-[var(--sb-accent-soft-text)] font-medium flex items-center gap-1.5 px-1 py-1 rounded-md hover:bg-[rgba(var(--sb-accent-rgb),0.06)] transition-all">
                <I n="edit" s={10} /> Edit in chat
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══ FORM PREVIEW PANEL ═══ */
const FormPreview = ({ fd, activePhase, completedPhases, expandedSections, onToggleSection, onEditPhase, allComplete, onSubmitCampaign, onFieldChange }) => {
  const totalFields = PHASES.reduce((sum, p) => sum + getFieldDisplay(p.key, fd).length, 0);
  const filledFields = PHASES.reduce((sum, p) => sum + getFieldDisplay(p.key, fd).filter(f => f.value || f.chips || (f.files && f.files.length)).length, 0);
  const overallPct = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--sb-bg)' }}>
      {/* Header */}
      <div className="px-5 py-4 border-b border-[var(--sb-border-soft)] flex-shrink-0" style={{ background: 'var(--sb-bg-soft)' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <h2 className="text-[14px] font-semibold text-[var(--sb-text-strong)]">Campaign Brief</h2>
          </div>
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[var(--sb-panel-3)] border border-[var(--sb-border-soft)]">
            <span className="text-[12px] font-bold text-[var(--sb-accent)]">{filledFields}</span>
            <span className="text-[11px] text-[var(--sb-muted-soft)]">/</span>
            <span className="text-[11px] text-[var(--sb-muted-soft)]">{totalFields} fields</span>
          </div>
        </div>
        {/* Segmented progress */}
        <div className="flex gap-1">
          {PHASES.map((_, idx) => {
            const phFields = getFieldDisplay(PHASES[idx].key, fd);
            const phFilled = phFields.filter(f => f.value || f.chips).length;
            const done = completedPhases.includes(idx);
            const active = activePhase === idx;
            return (
              <div key={idx} className="flex-1 h-1.5 rounded-full overflow-hidden bg-[var(--sb-panel-3)]">
                <div className="h-full rounded-full transition-all duration-700 ease-out" style={{
                  width: done ? '100%' : active ? `${phFields.length > 0 ? (phFilled / phFields.length) * 100 : 0}%` : '0%',
                  background: done
                    ? 'var(--sb-accent)'
                    : active
                      ? 'linear-gradient(90deg, var(--sb-accent), rgba(var(--sb-accent-rgb),0.5))'
                      : 'transparent',
                }} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Stepper */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 pt-5 pb-4">
        {PHASES.map((phase, idx) => (
          <StepperNode
            key={phase.key}
            index={idx}
            phase={phase}
            fd={fd}
            isActive={activePhase === idx}
            isCompleted={completedPhases.includes(idx)}
            isFuture={!completedPhases.includes(idx) && activePhase !== idx && idx > activePhase}
            expanded={expandedSections.includes(idx)}
            onToggle={() => onToggleSection(idx)}
            onEdit={() => onEditPhase(idx)}
            isLast={idx === PHASES.length - 1}
            onFieldChange={onFieldChange}
          />
        ))}
      </div>

      {/* Submit footer */}
      {allComplete && (
        <div className="flex-shrink-0 px-5 py-4 border-t border-[var(--sb-border-soft)] anim-fade" style={{ background: 'var(--sb-bg-soft)' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-5 h-5 rounded-full bg-[var(--sb-accent)] flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--sb-accent-contrast)" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <p className="text-[12px] text-[var(--sb-muted)]">All <span className="text-[var(--sb-text-strong)] font-semibold">{totalFields} fields</span> completed. Ready to submit.</p>
          </div>
          <button type="button" onClick={onSubmitCampaign}
            className="cta-glow w-full py-3 rounded-xl bg-[var(--sb-accent)] text-[var(--sb-accent-contrast)] text-[13px] font-semibold hover:bg-[var(--sb-accent-strong)] transition-all flex items-center justify-center gap-2">
            <I n="send" s={14} c="text-[var(--sb-accent-contrast)]" />
            Submit Campaign
          </button>
        </div>
      )}
    </div>
  );
};

/* ═══ WELCOME HERO ═══ */
const WelcomeHero = ({ onStart }) => {
  const features = [
    { icon: 'send', title: 'Conversational Flow', desc: 'Answer questions naturally in a guided chat experience' },
    { icon: 'sparkle', title: 'Smart Suggestions', desc: 'AI suggests campaign names, resources, and optimal timing' },
    { icon: 'eye', title: 'Live Preview', desc: 'Watch your intake form build in real-time as you answer' },
  ];

  return (
    <div className="flex h-full hero-grid">
      {/* Left: hero content */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
        <div className="max-w-lg">
          {/* Icon + badge */}
          <div className="flex items-center gap-3 mb-6 anim-fade">
            <div className="w-12 h-12 rounded-2xl bg-[rgba(var(--sb-accent-rgb),0.1)] flex items-center justify-center shadow-[0_0_24px_rgba(var(--sb-accent-rgb),0.15)]">
              <I n="sparkle" s={22} c="text-[var(--sb-accent)]" />
            </div>
            <div className="px-3 py-1 rounded-full bg-[rgba(var(--sb-accent-rgb),0.06)] border border-[rgba(var(--sb-accent-rgb),0.12)]">
              <span className="text-[11px] font-semibold text-[var(--sb-accent)] tracking-wide">AI-POWERED</span>
            </div>
          </div>

          <h1 className="text-[28px] lg:text-[32px] font-bold text-[var(--sb-text-strong)] mb-3 leading-tight anim-fade" style={{ animationDelay: '0.08s' }}>
            Campaign Intake,<br />
            <span className="text-[var(--sb-accent)]">Reimagined</span>
          </h1>
          <p className="text-[14px] text-[var(--sb-muted)] mb-10 leading-relaxed anim-fade max-w-md" style={{ animationDelay: '0.14s' }}>
            Skip the form. Have a conversation instead. Our assistant guides you through each step, suggests smart defaults, and builds your intake in real-time.
          </p>

          <div className="space-y-3 mb-10">
            {features.map((f, i) => (
              <div key={f.title} className="flex items-center gap-4 p-3.5 rounded-xl bg-[var(--sb-panel-3)] border border-[var(--sb-border-soft)] anim-fade group hover:border-[var(--sb-border)] transition-colors"
                style={{ animationDelay: `${0.2 + i * 0.07}s` }}>
                <div className="w-10 h-10 rounded-xl bg-[var(--sb-panel-3)] border border-[var(--sb-border-soft)] flex items-center justify-center flex-shrink-0 group-hover:border-[rgba(var(--sb-accent-rgb),0.2)] transition-colors">
                  <I n={f.icon} s={17} c="text-[var(--sb-muted-soft)] group-hover:text-[var(--sb-accent)] transition-colors" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[var(--sb-text-strong)]">{f.title}</p>
                  <p className="text-[11px] text-[var(--sb-muted-soft)] mt-0.5 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button type="button" onClick={onStart}
            className="cta-glow px-7 py-3.5 rounded-xl bg-[var(--sb-accent)] text-[var(--sb-accent-contrast)] text-[14px] font-semibold hover:bg-[var(--sb-accent-strong)] transition-all anim-fade flex items-center gap-2.5"
            style={{ animationDelay: '0.45s' }}>
            <I n="sparkle" s={16} c="text-[var(--sb-accent-contrast)]" />
            Start New Intake
            <I n="chevR" s={14} c="text-[var(--sb-accent-contrast)]" />
          </button>
        </div>
      </div>

      {/* Right: visual roadmap */}
      <div className="hidden lg:flex flex-col items-center justify-center w-[42%] border-l border-[var(--sb-border-soft)] p-8" style={{ background: 'var(--sb-bg)' }}>
        <div className="w-full max-w-xs">
          <p className="text-[11px] uppercase tracking-[0.15em] text-[var(--sb-muted-soft)] font-semibold mb-6 anim-fade" style={{ animationDelay: '0.3s' }}>
            6 quick steps
          </p>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[15px] top-4 bottom-4 w-px bg-[var(--sb-panel)]" />
            <div className="space-y-0">
              {PHASES.map((p, i) => (
                <div key={p.key} className="flex items-center gap-4 py-3 relative z-10 anim-fade"
                  style={{ animationDelay: `${0.35 + i * 0.06}s` }}>
                  <div className="w-[30px] h-[30px] rounded-lg bg-[var(--sb-panel-3)] border border-[var(--sb-border-soft)] flex items-center justify-center flex-shrink-0">
                    <I n={p.icon} s={13} c="text-[var(--sb-muted-soft)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-[var(--sb-muted)]">{p.title}</p>
                    <p className="text-[11px] text-[var(--sb-muted-soft)] mt-0.5">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 flex items-center gap-2 text-[11px] text-[var(--sb-muted-soft)] anim-fade" style={{ animationDelay: '0.75s' }}>
            <I n="clock" s={12} c="text-[var(--sb-muted-soft)]" />
            <span>Typically 3\u20135 minutes</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══ SUCCESS SCREEN ═══ */
const SuccessScreen = ({ campaignId, campaignName, onViewCampaign, onStartAnother }) => (
  <div className="h-full flex items-center justify-center p-8">
    <div className="text-center max-w-sm">
      <div className="w-20 h-20 rounded-2xl bg-[rgba(var(--sb-accent-rgb),0.1)] flex items-center justify-center mx-auto mb-5 anim-scale shadow-[0_0_40px_rgba(var(--sb-accent-rgb),0.15)]">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--sb-accent)" strokeWidth="2.5" strokeLinecap="round" className="check-anim">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h2 className="text-[20px] font-bold text-[var(--sb-text-strong)] mb-2 anim-fade" style={{ animationDelay: '0.1s' }}>Campaign Submitted!</h2>
      <p className="text-[13px] text-[var(--sb-muted)] mb-1 anim-fade" style={{ animationDelay: '0.15s' }}>
        <strong className="text-[var(--sb-text-strong)]">"{campaignName}"</strong> has been created successfully.
      </p>
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--sb-panel-3)] border border-[var(--sb-border)] mt-2 mb-7 anim-fade" style={{ animationDelay: '0.2s' }}>
        <I n="hash" s={11} c="text-[var(--sb-accent)]" />
        <span className="text-[11px] font-mono text-[var(--sb-muted)]">IC-{String(campaignId).padStart(4, '0')}</span>
      </div>
      <div className="flex items-center gap-3 justify-center anim-fade" style={{ animationDelay: '0.25s' }}>
        <button type="button" onClick={onViewCampaign}
          className="cta-glow px-5 py-3 rounded-xl bg-[var(--sb-accent)] text-[var(--sb-accent-contrast)] text-[12px] font-semibold hover:bg-[var(--sb-accent-strong)] transition-all flex items-center gap-1.5">
          <I n="eye" s={13} c="text-[var(--sb-accent-contrast)]" /> View Campaign
        </button>
        <button type="button" onClick={onStartAnother}
          className="px-5 py-3 rounded-xl bg-[var(--sb-panel)] text-[var(--sb-text-strong)] text-[12px] font-semibold hover:bg-[var(--sb-panel-2)] border border-[var(--sb-border)] transition-all flex items-center gap-1.5">
          <I n="plus" s={13} /> Start Another
        </button>
      </div>
    </div>
  </div>
);

/* ═══ MOBILE TAB SWITCHER ═══ */
const MobileTab = ({ activeTab, onSwitch }) => (
  <div className="flex lg:hidden border-b border-[var(--sb-border)]" style={{ background: 'var(--sb-bg-soft)' }}>
    {['chat', 'preview'].map(tab => (
      <button key={tab} type="button" onClick={() => onSwitch(tab)}
        className={`flex-1 py-2.5 text-[12px] font-semibold text-center transition-colors ${
          activeTab === tab ? 'text-[var(--sb-accent)] border-b-2 border-[var(--sb-accent)]' : 'text-[var(--sb-muted-soft)]'
        }`}>
        <span className="flex items-center justify-center gap-1.5">
          <I n={tab === 'chat' ? 'send' : 'eye'} s={13} />
          {tab === 'chat' ? 'Chat' : 'Preview'}
        </span>
      </button>
    ))}
  </div>
);

/* ═══ MAIN PAGE COMPONENT ═══ */
export default function AgentIntakePage({ onSubmit, onInput, onViewCampaign }) {
  const [fd, setFd] = useState({ ...INIT_FD });
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [phase, setPhase] = useState(0);
  const [subStep, setSubStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [multiSelected, setMultiSelected] = useState([]);
  const [completedPhases, setCompletedPhases] = useState([]);
  const [expandedSections, setExpandedSections] = useState([0]);
  const [submitted, setSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState(null);
  const [awaitingInput, setAwaitingInput] = useState(false);
  const [customFlow, setCustomFlow] = useState(null);
  const [mobileTab, setMobileTab] = useState('chat');
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const currentScript = customFlow ? null : AGENT_SCRIPT[`${PHASES[phase].key}-${subStep}`];
  const expectType = customFlow ? 'text' : (currentScript?.expect || 'text');
  const chipOnlyMode = !customFlow && awaitingInput && !submitted && (expectType === 'chips' || expectType === 'priority-chips');

  useEffect(() => {
    if (awaitingInput && !chipOnlyMode) inputRef.current?.focus();
  }, [awaitingInput, chipOnlyMode]);

  const getScriptKey = () => `${PHASES[phase].key}-${subStep}`;

  const simulateAgentResponse = (scriptKey, fdSnapshot) => {
    const script = AGENT_SCRIPT[scriptKey];
    if (!script) return;
    setIsTyping(true);
    setAwaitingInput(false);
    const delay = 600 + Math.random() * 800;
    setTimeout(() => {
      setIsTyping(false);
      const newMsgs = script.messages.map(m => ({
        ...m,
        text: typeof m.text === 'function' ? m.text(fdSnapshot || fd) : m.text,
        id: Date.now() + Math.random(),
        timestamp: Date.now(),
      }));
      newMsgs.forEach((msg, i) => {
        setTimeout(() => {
          setMessages(prev => [...prev, msg]);
          if (i === newMsgs.length - 1) setAwaitingInput(true);
        }, i * 350);
      });
    }, delay);
  };

  const showAgentMessage = (text) => {
    setIsTyping(true);
    setAwaitingInput(false);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { type: 'agent', text, id: Date.now(), timestamp: Date.now() }]);
      setAwaitingInput(true);
    }, 600);
  };

  const handleStart = () => {
    setStarted(true);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages([{ type: 'agent', text: `Hi ${CURRENT_USER.name.split(' ')[0]}! I'm your IC Assistant. I'll help you create a new campaign intake in just a few minutes.\n\nLet's get started.`, id: Date.now(), timestamp: Date.now() }]);
      setTimeout(() => simulateAgentResponse('basics-0', fd), 600);
    }, 900);
  };

  const advanceStep = (currentFd) => {
    const phaseKey = PHASES[phase].key;
    const nextSubStep = subStep + 1;
    const nextKey = `${phaseKey}-${nextSubStep}`;
    if (AGENT_SCRIPT[nextKey]) {
      setSubStep(nextSubStep);
      setTimeout(() => simulateAgentResponse(nextKey, currentFd), 400);
    } else {
      setCompletedPhases(prev => [...prev, phase]);
      const nextPhase = phase + 1;
      if (nextPhase < PHASES.length) {
        setMessages(prev => [...prev, { type: 'system', text: `Moving on to ${PHASES[nextPhase].title}...`, id: Date.now(), isPhaseTransition: true }]);
        setPhase(nextPhase);
        setSubStep(0);
        setExpandedSections([nextPhase]);
        setTimeout(() => simulateAgentResponse(`${PHASES[nextPhase].key}-0`, currentFd), 800);
      } else {
        showSummary(currentFd);
      }
    }
  };

  const showSummary = (currentFd) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev,
        { type: 'system', text: 'All sections complete!', id: Date.now(), isPhaseTransition: true },
        {
          type: 'agent', id: Date.now() + 1, timestamp: Date.now(),
          text: `Here's your campaign summary:\n\n**${currentFd.projectName}**\n\u2022 BU: ${currentFd.bu} | Banners: ${currentFd.banners.join(', ')}\n\u2022 Priority: ${currentFd.pri} | Revenue: ${currentFd.roiRevenue}\n\u2022 Timeline: ${currentFd.quarter} ${currentFd.period} ${currentFd.week}\n\u2022 Channels: ${currentFd.chSupport.join(', ')}\n\u2022 Type: ${currentFd.campType} | Creative: ${currentFd.creativeType}\n\nEverything look good?`
        },
      ]);
      setTimeout(() => setAwaitingInput(true), 300);
    }, 1000);
  };

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text || isTyping) return;
    setMessages(prev => [...prev, { type: 'user', text, id: Date.now(), timestamp: Date.now() }]);
    setInputValue('');
    setAwaitingInput(false);

    if (customFlow) {
      const newFd = { ...fd, [customFlow.field]: text };
      setFd(newFd);
      if (onInput) onInput();
      setCustomFlow(null);
      advanceStep(newFd);
      return;
    }

    const script = AGENT_SCRIPT[getScriptKey()];
    if (!script) {
      if (completedPhases.length === PHASES.length) handleSubmitCampaign();
      return;
    }
    if (script.field && script.field.charAt(0) !== '_') {
      const newFd = { ...fd, [script.field]: text };
      setFd(newFd);
      if (onInput) onInput();
      advanceStep(newFd);
    } else {
      advanceStep(fd);
    }
  };

  const handleChipSelect = (chip) => {
    if (chip === 'Submit Campaign') { handleSubmitCampaign(); return; }
    const scriptKey = getScriptKey();
    const script = AGENT_SCRIPT[scriptKey];
    if (!script) return;
    if (script.expect === 'multi-chips') {
      setMultiSelected(prev => prev.includes(chip) ? prev.filter(c => c !== chip) : [...prev, chip]);
      return;
    }

    setMessages(prev => [...prev, { type: 'user', text: chip, id: Date.now(), timestamp: Date.now() }]);
    setAwaitingInput(false);

    if (scriptKey === 'basics-1') {
      if (chip === 'Accept Suggestion') {
        const name = suggestName(fd.projectDesc);
        const newFd = { ...fd, projectName: name };
        setFd(newFd);
        if (onInput) onInput();
        advanceStep(newFd);
      } else {
        setCustomFlow({ field: 'projectName' });
        showAgentMessage("No problem! What would you like to name this campaign?");
      }
      return;
    }
    if (scriptKey === 'basics-4') {
      if (chip === 'Yes, that\'s me') {
        const newFd = { ...fd, byName: CURRENT_USER.name, byLdap: 'lhannigan' };
        setFd(newFd);
        if (onInput) onInput();
        advanceStep(newFd);
      } else {
        setCustomFlow({ field: 'byName' });
        showAgentMessage('Please type the requester\'s name:');
      }
      return;
    }
    if (scriptKey === 'team-1') {
      if (chip === 'Confirm') {
        const newFd = { ...fd, rep: MKT_RES[fd.mr] || CURRENT_USER.name };
        setFd(newFd);
        if (onInput) onInput();
        advanceStep(newFd);
      } else {
        setCustomFlow({ field: 'rep' });
        showAgentMessage('Type the name of the representative you\'d like to assign:');
      }
      return;
    }
    if (scriptKey === 'channels-1') { advanceStep(fd); return; }
    if (scriptKey === 'assets-0') {
      if (chip === 'Skip for now') { advanceStep(fd); }
      else {
        const newFd = { ...fd, merchFiles: ['campaign_merch_assets.zip'] };
        setFd(newFd);
        if (onInput) onInput();
        setIsTyping(true);
        setAwaitingInput(false);
        setTimeout(() => {
          setIsTyping(false);
          setMessages(prev => [...prev,
            { type: 'agent', text: 'File uploaded! Analyzing contents...', id: Date.now(), timestamp: Date.now() },
          ]);
          setTimeout(() => {
            setMessages(prev => [...prev,
              { type: 'extracted', id: Date.now() + 1 },
              { type: 'agent', text: 'I\'ve extracted key data from your merchandising file. Everything looks good \u2014 let\'s continue.', id: Date.now() + 2, timestamp: Date.now() },
            ]);
            setTimeout(() => advanceStep(newFd), 600);
          }, 900);
        }, 800);
      }
      return;
    }
    if (scriptKey === 'assets-2') {
      if (chip === 'Yes, Media Collective') {
        const newFd = { ...fd, vendorGuide: 'vendor_guide.pdf', isanScripts: 'scripts.docx', amcGuidance: 'amc_guidance.pdf' };
        setFd(newFd);
        if (onInput) onInput();
        advanceStep(newFd);
      } else { advanceStep(fd); }
      return;
    }

    if (script.field && script.field.charAt(0) !== '_') {
      const newFd = { ...fd, [script.field]: chip };
      setFd(newFd);
      if (onInput) onInput();
      advanceStep(newFd);
    } else {
      advanceStep(fd);
    }
  };

  const handleMultiConfirm = () => {
    if (multiSelected.length === 0) return;
    const script = AGENT_SCRIPT[getScriptKey()];
    if (!script) return;
    setMessages(prev => [...prev, { type: 'user', text: multiSelected.join(', '), id: Date.now(), timestamp: Date.now() }]);
    setAwaitingInput(false);
    if (script.field && script.field.charAt(0) !== '_') {
      const newFd = { ...fd, [script.field]: [...multiSelected] };
      setFd(newFd);
      if (onInput) onInput();
      setMultiSelected([]);
      advanceStep(newFd);
    } else {
      setMultiSelected([]);
      advanceStep(fd);
    }
  };

  const handleSubmitCampaign = () => {
    setMessages(prev => [...prev, { type: 'user', text: 'Submit Campaign', id: Date.now(), timestamp: Date.now() }]);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const id = onSubmit(fd);
      setSubmittedId(id);
      setMessages(prev => [...prev,
        { type: 'system', text: 'Campaign submitted successfully!', id: Date.now(), isPhaseTransition: true },
        { type: 'agent', text: `Your campaign **"${fd.projectName}"** has been submitted with reference **IC-${String(id).padStart(4, '0')}**.\n\nThe intake team has been notified and will begin the review process.`, id: Date.now() + 1, timestamp: Date.now() },
      ]);
      setSubmitted(true);
    }, 1200);
  };

  const handleEditPhase = (phaseIdx) => {
    setMessages(prev => [...prev, { type: 'system', text: `Editing ${PHASES[phaseIdx].title}...`, id: Date.now(), isPhaseTransition: true }]);
    setPhase(phaseIdx);
    setSubStep(0);
    setCustomFlow(null);
    setCompletedPhases(prev => prev.filter(p => p !== phaseIdx));
    setExpandedSections([phaseIdx]);
    setMobileTab('chat');
    setTimeout(() => simulateAgentResponse(`${PHASES[phaseIdx].key}-0`, fd), 400);
  };

  const handleToggleSection = (idx) => {
    setExpandedSections(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
  };

  const handleFieldChange = (key, value) => {
    setFd(prev => ({ ...prev, [key]: value }));
    if (onInput) onInput();
  };

  const handleStartAnother = () => {
    setFd({ ...INIT_FD }); setStarted(false); setMessages([]); setPhase(0); setSubStep(0);
    setIsTyping(false); setInputValue(''); setMultiSelected([]); setCompletedPhases([]);
    setExpandedSections([0]); setSubmitted(false); setSubmittedId(null); setAwaitingInput(false);
    setCustomFlow(null); setMobileTab('chat');
  };

  const showSubmitChips = completedPhases.length === PHASES.length && !submitted && awaitingInput && !customFlow;

  /* ═══ NOT STARTED ═══ */
  if (!started) {
    return (
      <div className="h-[calc(100vh-72px)] -m-4 md:-m-6" style={{ background: 'var(--sb-bg)' }}>
        <WelcomeHero onStart={handleStart} />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-72px)] -m-4 md:-m-6" style={{ background: 'var(--sb-bg)' }}>
      {!submitted && <MobileTab activeTab={mobileTab} onSwitch={setMobileTab} />}

      {/* ═══ CHAT PANEL ═══ */}
      <div className={`flex flex-col lg:border-r lg:border-[var(--sb-border-soft)] ${
        mobileTab === 'chat' ? 'flex-1' : 'hidden'
      } lg:flex lg:w-[45%] lg:flex-none`}>
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[var(--sb-border-soft)] flex items-center gap-3 flex-shrink-0" style={{ background: 'var(--sb-bg-soft)' }}>
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-[var(--sb-accent)] flex items-center justify-center shadow-[0_0_16px_rgba(var(--sb-accent-rgb),0.2)]">
              <I n="sparkle" s={16} c="text-[var(--sb-accent-contrast)]" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[var(--sb-accent)] border-2 border-[var(--sb-bg)]" />
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-semibold text-[var(--sb-text-strong)]">IC Assistant</p>
            <p className="text-[11px] text-[var(--sb-muted-soft)]">Campaign intake agent</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--sb-panel-3)] border border-[var(--sb-border-soft)]">
            <div className="text-[11px] font-semibold text-[var(--sb-muted)]">Step {Math.min(phase + 1, PHASES.length)}</div>
            <div className="text-[11px] text-[var(--sb-muted-soft)]">/</div>
            <div className="text-[11px] text-[var(--sb-muted-soft)]">{PHASES.length}</div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-3" style={{ background: 'var(--sb-bg)' }}>
          {messages.map((msg, idx) => {
            const { isFirstInGroup, isLastInGroup } = computeGrouping(messages, idx);
            if (msg.type === 'agent') return <AgentMessage key={msg.id} text={msg.text} showAvatar={isFirstInGroup} showTime={isLastInGroup} timestamp={msg.timestamp} />;
            if (msg.type === 'user') return <UserMessage key={msg.id} text={msg.text} showTime={isLastInGroup} timestamp={msg.timestamp} />;
            if (msg.type === 'insight') return <InsightCard key={msg.id} text={msg.text} variant={msg.variant} />;
            if (msg.type === 'system') return <SystemMessage key={msg.id} text={msg.text} isPhaseTransition={msg.isPhaseTransition} />;
            if (msg.type === 'extracted') return <ExtractedDataCard key={msg.id} />;
            return null;
          })}

          {awaitingInput && !submitted && !customFlow && currentScript?.expect === 'chips' && (
            <ChatChips chips={currentScript.chips} onSelect={handleChipSelect} />
          )}
          {awaitingInput && !submitted && !customFlow && currentScript?.expect === 'multi-chips' && (
            <ChatChips chips={currentScript.chips} onSelect={handleChipSelect} multi selected={multiSelected} onConfirm={handleMultiConfirm} />
          )}
          {awaitingInput && !submitted && !customFlow && currentScript?.expect === 'priority-chips' && (
            <PriorityChips onSelect={handleChipSelect} />
          )}
          {showSubmitChips && <ChatChips chips={['Submit Campaign']} onSelect={handleChipSelect} />}

          {isTyping && <TypingIndicator />}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3.5 border-t border-[var(--sb-border-soft)] flex-shrink-0" style={{ background: 'var(--sb-bg-soft)' }}>
          {submitted ? (
            <div className="text-center py-2">
              <p className="text-[12px] text-[var(--sb-muted-soft)]">Conversation ended</p>
            </div>
          ) : chipOnlyMode ? (
            <div className="flex items-center justify-center gap-2 py-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--sb-accent)] animate-pulse" />
              <p className="text-[11px] text-[var(--sb-muted-soft)] font-medium">Select an option above to continue</p>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <input
                ref={inputRef}
                type={expectType === 'date' ? 'date' : 'text'}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder={customFlow ? 'Type your answer...' : currentScript?.placeholder || (expectType === 'date' ? 'Select a date...' : 'Type your message...')}
                className="flex-1 px-4 py-2.5 rounded-xl text-[13px] border border-[var(--sb-border-soft)] outline-none focus:border-[rgba(var(--sb-accent-rgb),0.3)] transition-colors"
                style={{ background: 'var(--sb-panel-3)', color: 'var(--sb-text)' }}
                disabled={isTyping}
              />
              <button type="button" onClick={handleSend}
                disabled={isTyping || !inputValue.trim()}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-20 hover:shadow-[0_0_16px_rgba(var(--sb-accent-rgb),0.25)]"
                style={{ background: 'var(--sb-accent)' }}>
                <I n="send" s={15} c="text-[var(--sb-accent-contrast)]" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ═══ FORM PREVIEW ═══ */}
      <div className={`${mobileTab === 'preview' ? 'flex-1' : 'hidden'} lg:flex lg:flex-col lg:w-[55%] lg:flex-none`}>
        {submitted ? (
          <SuccessScreen
            campaignId={submittedId}
            campaignName={fd.projectName}
            onViewCampaign={() => onViewCampaign(submittedId)}
            onStartAnother={handleStartAnother}
          />
        ) : (
          <FormPreview
            fd={fd}
            activePhase={phase}
            completedPhases={completedPhases}
            expandedSections={expandedSections}
            onToggleSection={handleToggleSection}
            onEditPhase={handleEditPhase}
            allComplete={completedPhases.length === PHASES.length && !submitted}
            onSubmitCampaign={handleSubmitCampaign}
            onFieldChange={handleFieldChange}
          />
        )}
      </div>
    </div>
  );
}
