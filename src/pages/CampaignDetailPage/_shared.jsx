import { I } from '../../shared/campaignShared';

/* ═══ SHARED UI COMPONENTS ═══ */

export const Section = ({ title, icon, count, desc, children }) => (
  <div>
    <div className="flex items-center gap-2 mb-3">
      <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(var(--sb-accent-rgb),0.08)' }}>
        <I n={icon} s={12} c="text-[var(--sb-accent)]" />
      </div>
      <h3 className="text-[12px] font-semibold text-[var(--sb-text-strong)] uppercase tracking-wider">{title}</h3>
      {count != null && (
        <span className="text-[11px] font-medium text-[var(--sb-muted)] bg-[var(--sb-panel-2)] border border-[var(--sb-border-soft)] rounded-full px-2 py-0.5 leading-none">{count}</span>
      )}
    </div>
    {desc && <p className="text-[11px] text-[var(--sb-muted-soft)] -mt-1.5 mb-3 ml-8">{desc}</p>}
    {children}
  </div>
);

export const DetailField = ({ label, value }) => (
  <div>
    <span className="text-[11px] text-[var(--sb-muted-soft)] uppercase tracking-wide">{label}</span>
    <p className="text-[13px] font-medium text-[var(--sb-text)] mt-0.5">{value || <span className="text-[var(--sb-muted-soft)] italic font-normal">Not provided</span>}</p>
  </div>
);

export const EmptyState = ({ text }) => (
  <div className="py-4 text-center rounded-md border border-dashed border-[var(--sb-border-soft)]">
    <p className="text-[11px] text-[var(--sb-muted-soft)]">{text}</p>
  </div>
);

/* ═══ FILE UTILITIES ═══ */

export const ext_ = (name) => (name || '').split('.').pop().toLowerCase();

export const FILE_TYPE_META = {
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

export const getFileMeta = (name) => FILE_TYPE_META[ext_(name)] || { icon: 'file', color: 'var(--sb-accent)', label: 'File' };

export const downloadFile = (file) => {
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

/* ═══ FILE ROW COMPONENT ═══ */

export const FileRow = ({ file, onClick, grouped }) => {
  const meta = getFileMeta(file.name);
  return (
    <div className={`flex items-center gap-3 px-3 py-2.5 group cursor-pointer transition-colors ${
      grouped
        ? 'border-b border-[var(--sb-border-soft)] last:border-b-0 hover:bg-[rgba(var(--sb-accent-rgb),0.04)]'
        : 'rounded-md bg-[var(--sb-panel)] border border-[var(--sb-border-soft)] hover:border-[rgba(var(--sb-accent-rgb),0.30)]'
    }`}>
      <div onClick={onClick} className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 transition-colors" style={{ background: `${meta.color}12`, border: `1px solid ${meta.color}20`, color: meta.color }}>
          <I n={meta.icon} s={14} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-medium text-[var(--sb-text)] truncate group-hover:text-[var(--sb-text-strong)] transition-colors">{file.name}</p>
          <p className="text-[11px] text-[var(--sb-muted-soft)]">{meta.label} &middot; {file.size} &middot; {file.date}</p>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={(e) => { e.stopPropagation(); downloadFile(file); }}
          className="p-1.5 rounded-md text-[var(--sb-muted-soft)] hover:text-[var(--sb-accent)] hover:bg-[rgba(var(--sb-accent-rgb),0.12)] transition-colors opacity-0 group-hover:opacity-100"
          title="Download"
        >
          <I n="upload" s={13} c="rotate-180" />
        </button>
        <button
          onClick={onClick}
          className="p-1.5 rounded-md text-[var(--sb-muted-soft)] hover:text-[var(--sb-accent)] hover:bg-[rgba(var(--sb-accent-rgb),0.12)] transition-colors opacity-0 group-hover:opacity-100"
          title="Preview"
        >
          <I n="eye" s={13} />
        </button>
      </div>
    </div>
  );
};

/* ═══ BRIEFING CONTENT COMPONENT ═══ */

export const BriefingContent = ({ brief }) => (
  <div className="space-y-5">
    <div>
      <h4 className="text-[11px] font-semibold text-[var(--sb-accent)] uppercase tracking-wider mb-2">Executive Summary</h4>
      <p className="text-[13px] text-[var(--sb-text)] leading-[1.7]">{brief.executiveSummary}</p>
    </div>
    <div>
      <h4 className="text-[11px] font-semibold text-[var(--sb-accent)] uppercase tracking-wider mb-3">Performance Highlights</h4>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {brief.kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-lg p-3" style={{ background: 'var(--sb-accent-muted)', border: '1px solid color-mix(in srgb, var(--sb-accent) 24%, var(--sb-border))' }}>
            <span className="text-[11px] text-[var(--sb-muted)] uppercase tracking-wide">{kpi.label}</span>
            <p className="text-[18px] font-bold mt-1" style={{ color: kpi.color }}>{kpi.value}</p>
            <span className="text-[11px] font-medium text-[var(--sb-accent)]">{kpi.trend} vs target</span>
          </div>
        ))}
      </div>
    </div>
    {brief.channelBreakdown.length > 0 && (
      <div>
        <h4 className="text-[11px] font-semibold text-[var(--sb-accent)] uppercase tracking-wider mb-3">Channel Breakdown</h4>
        <div className="space-y-2">
          {brief.channelBreakdown.map((ch) => (
            <div key={ch.channel} className="flex items-center gap-3 px-3 py-2.5 rounded-md" style={{ background: 'var(--sb-accent-muted)', border: '1px solid color-mix(in srgb, var(--sb-accent) 22%, var(--sb-border))' }}>
              <span className="text-[12px] font-medium text-[var(--sb-text)] flex-1">{ch.channel}</span>
              <span className="text-[11px] text-[var(--sb-muted)]">{ch.impressions} imp</span>
              <span className="text-[11px] text-[var(--sb-muted)]">{ch.ctr} CTR</span>
              <span className="text-[11px] font-medium text-[var(--sb-accent)]">{ch.contribution}</span>
            </div>
          ))}
        </div>
      </div>
    )}
    <div>
      <h4 className="text-[11px] font-semibold text-[var(--sb-accent)] uppercase tracking-wider mb-2">Key Learnings</h4>
      <ul className="space-y-2">
        {brief.learnings.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-[13px] text-[var(--sb-text)] leading-relaxed">
            <span className="w-5 h-5 rounded-full bg-[rgba(var(--sb-accent-rgb),0.15)] border border-[rgba(var(--sb-accent-rgb),0.25)] flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold text-[var(--sb-accent)]">{i + 1}</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
    <div>
      <h4 className="text-[11px] font-semibold text-[var(--sb-accent)] uppercase tracking-wider mb-2">Recommendations</h4>
      <ul className="space-y-2">
        {brief.recommendations.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-[13px] text-[var(--sb-text)] leading-relaxed">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--sb-accent)] shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

/* ═══ AI BRIEFING GENERATOR ═══ */

export const generateBriefing = (camp) => {
  const roiStr = (camp.roi || '$0').replace(/[^0-9.]/g, '');
  const roiNum = parseFloat(roiStr) || 1;
  const scale = roiNum >= 1 ? roiNum : roiNum * 1000;
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
      { label: 'Impressions', value: impressions, trend: '+14%', color: 'var(--sb-accent)' },
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
