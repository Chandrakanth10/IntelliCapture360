import { useState, useEffect, useCallback, useRef } from 'react';
import { I } from '../../../shared/campaignShared';
import { generateBriefing } from '../_shared';

/* ─── Section header band (mirrors IntakeTab) ─── */
const Band = ({ icon, title, count, extra }) => (
  <div className="flex items-center gap-2 px-4 py-2 border-b border-[var(--sb-border-soft)]" style={{ background: 'rgba(var(--sb-accent-rgb),0.03)' }}>
    <div className="w-5 h-5 rounded flex items-center justify-center shrink-0" style={{ background: 'rgba(var(--sb-accent-rgb),0.12)' }}>
      <I n={icon} s={11} c="text-[var(--sb-accent)]" />
    </div>
    <h3 className="text-[11px] font-semibold text-[var(--sb-text-strong)] uppercase tracking-wider">{title}</h3>
    {count != null && (
      <span className="text-[10px] font-medium text-[var(--sb-muted)] bg-[var(--sb-panel-2)] border border-[var(--sb-border-soft)] rounded-full px-1.5 py-px leading-none">{count}</span>
    )}
    {extra && <>{extra}</>}
  </div>
);

/* ─── Card wrapper ─── */
const Card = ({ icon, title, count, extra, children }) => (
  <div className="rounded-xl border border-[var(--sb-border-soft)] bg-[var(--sb-panel)] overflow-hidden shadow-[var(--sb-shadow-sm)]">
    <Band icon={icon} title={title} count={count} extra={extra} />
    <div className="p-4">{children}</div>
  </div>
);

/* ─── Sub-section label inside the big card ─── */
const Sub = ({ icon, title, count, extra }) => (
  <div className="flex items-center gap-1.5 mb-2.5">
    <I n={icon} s={10} c="text-[#a78bfa]" />
    <h4 className="text-[10px] font-semibold text-[var(--sb-muted)] uppercase tracking-wider">{title}</h4>
    {count != null && (
      <span className="text-[9px] font-medium text-[var(--sb-muted-soft)] bg-[rgba(167,139,250,0.06)] border border-[rgba(167,139,250,0.15)] rounded-full px-1.5 py-px leading-none">{count}</span>
    )}
    {extra && <div className="flex-1" />}
    {extra}
  </div>
);

/* ─── Mock reviewers ─── */
const REVIEWERS = [
  { name: 'Lauren Hannigan', initials: 'LH', role: 'VP, Integrated Marketing', status: 'approved' },
  { name: 'David Park', initials: 'DP', role: 'Brand Marketing', status: 'approved' },
  { name: 'Greg Harmon', initials: 'GH', role: 'Finance', status: 'pending' },
  { name: 'Nicole Patel', initials: 'NP', role: 'Media Collective', status: 'invited' },
];

const STATUS_STYLE = {
  approved: { label: 'Approved',       bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.30)', color: '#34d399' },
  pending:  { label: 'Pending Review', bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.30)', color: '#fbbf24' },
  invited:  { label: 'Invited',        bg: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.30)', color: '#60a5fa' },
};

/* ─── Timestamp formatter ─── */
const fmtTs = (d) => {
  const mon = d.toLocaleString('en-US', { month: 'short' });
  const day = d.getDate();
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${mon} ${day}, ${h % 12 || 12}:${m} ${ampm}`;
};

/* ─── Version dropdown ─── */
const VersionDropdown = ({ versions, activeIdx, onSelect }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const current = versions[activeIdx];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors hover:bg-[rgba(167,139,250,0.10)]"
        style={{ border: '1px solid rgba(167,139,250,0.25)', color: '#a78bfa' }}
      >
        v{current.num}{activeIdx === versions.length - 1 && ' (latest)'}
        <I n="chevR" s={10} c={`text-[#a78bfa] transition-transform ${open ? 'rotate-90' : ''}`} />
      </button>
      {open && (
        <div
          className="absolute top-full left-0 mt-1.5 w-56 rounded-lg overflow-hidden z-20 shadow-lg"
          style={{ border: '1px solid rgba(167,139,250,0.25)', background: 'var(--sb-panel)' }}
        >
          {[...versions].reverse().map((v, ri) => {
            const idx = versions.length - 1 - ri;
            const isActive = idx === activeIdx;
            const isLatest = idx === versions.length - 1;
            return (
              <button
                key={v.num}
                onClick={() => { onSelect(idx); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors ${
                  isActive ? 'bg-[rgba(167,139,250,0.08)]' : 'hover:bg-[rgba(var(--sb-accent-rgb),0.04)]'
                } ${ri > 0 ? 'border-t border-[var(--sb-border-soft)]' : ''}`}
              >
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: isActive ? '#a78bfa' : 'var(--sb-border)' }}
                />
                <div className="flex-1 min-w-0">
                  <span className={`text-[12px] font-medium ${isActive ? 'text-[#a78bfa]' : 'text-[var(--sb-text)]'}`}>
                    v{v.num}
                  </span>
                  {isLatest && <span className="text-[10px] text-[var(--sb-muted-soft)] ml-1.5">(latest)</span>}
                  <p className="text-[10px] text-[var(--sb-muted-soft)] truncate">{v.author} &middot; {fmtTs(v.date)}</p>
                </div>
                <span className="text-[10px] text-[var(--sb-muted-soft)] shrink-0">{v.action}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ═══ BRIEFING TAB ═══ */
const BriefingTab = ({ camp }) => {
  const initialBrief = generateBriefing(camp);

  const [versions, setVersions] = useState(() => [
    { num: 1, brief: initialBrief, date: new Date(2026, 1, 28, 14, 32), author: 'AI', action: 'Generated' },
    { num: 2, brief: { ...initialBrief, executiveSummary: initialBrief.executiveSummary.replace('Performance metrics indicate', 'Early signals show') }, date: new Date(2026, 2, 1, 15, 20), author: 'Lauren Hannigan', action: 'Edited' },
    { num: 3, brief: initialBrief, date: new Date(2026, 2, 2, 10, 14), author: 'AI', action: 'Regenerated' },
  ]);
  const [activeVersionIdx, setActiveVersionIdx] = useState(2);
  const [regenerating, setRegenerating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');

  const currentVersion = versions[activeVersionIdx];
  const brief = currentVersion.brief;
  const isLatest = activeVersionIdx === versions.length - 1;

  useEffect(() => { setDraft(brief.executiveSummary); }, [brief.executiveSummary]);

  const pushVersion = useCallback((newBrief, author, action) => {
    setVersions((prev) => {
      const next = [...prev, { num: prev.length + 1, brief: newBrief, date: new Date(), author, action }];
      return next;
    });
    // point to the newly added version (will be last)
    setActiveVersionIdx((prev) => prev + 1);
  }, []);

  const handleRegenerate = useCallback(() => {
    setRegenerating(true);
    setTimeout(() => {
      const newBrief = generateBriefing(camp);
      pushVersion(newBrief, 'AI', 'Regenerated');
      setRegenerating(false);
    }, 1200);
  }, [camp, pushVersion]);

  const handleSave = () => {
    const newBrief = { ...brief, executiveSummary: draft };
    pushVersion(newBrief, 'Lauren Hannigan', 'Edited');
    setEditing(false);
  };

  // When switching to a non-latest version, close editing
  useEffect(() => { if (!isLatest) setEditing(false); }, [isLatest]);

  return (
    <div className="space-y-5">

      {/* ── AI Status Banner ── */}
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-xl"
        style={{ background: 'linear-gradient(135deg, rgba(167,139,250,0.12), rgba(167,139,250,0.04))', border: '1px solid rgba(167,139,250,0.25)' }}
      >
        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(167,139,250,0.18)' }}>
          {regenerating
            ? <div className="w-3.5 h-3.5 border-2 border-[#a78bfa] border-t-transparent rounded-full animate-spin" />
            : <I n="sparkle" s={14} c="text-[#a78bfa]" />
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-[var(--sb-text-strong)]">
            {regenerating ? 'Regenerating Brief\u2026' : 'AI Brief Generated'}
          </p>
          <p className="text-[11px] text-[var(--sb-muted-soft)]">{fmtTs(currentVersion.date)}</p>
        </div>
        <button
          onClick={handleRegenerate}
          disabled={regenerating}
          className="px-3 py-1.5 rounded-md text-[11px] font-medium bg-[rgba(167,139,250,0.14)] border border-[rgba(167,139,250,0.30)] text-[#a78bfa] hover:bg-[rgba(167,139,250,0.22)] transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Regenerate
        </button>
      </div>

      {/* ══════════════════════════════════════════════
          BIG BRIEF CARD — single document feel
          ══════════════════════════════════════════════ */}
      <div
        className="rounded-xl overflow-hidden shadow-[var(--sb-shadow-sm)]"
        style={{
          border: '1.5px solid rgba(167,139,250,0.22)',
          background: 'linear-gradient(135deg, rgba(167,139,250,0.05) 0%, rgba(96,165,250,0.04) 100%)',
        }}
      >
        {/* Card header with version dropdown */}
        <div
          className="flex items-center gap-2.5 px-5 py-3 border-b"
          style={{ background: 'rgba(167,139,250,0.06)', borderColor: 'rgba(167,139,250,0.18)' }}
        >
          <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0" style={{ background: 'rgba(167,139,250,0.16)' }}>
            <I n="sparkle" s={13} c="text-[#a78bfa]" />
          </div>
          <h3 className="text-[13px] font-semibold text-[var(--sb-text-strong)]">Campaign Brief</h3>
          <VersionDropdown versions={versions} activeIdx={activeVersionIdx} onSelect={setActiveVersionIdx} />
          <div className="flex-1" />
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.25)', color: '#a78bfa' }}>
            AI-Generated
          </span>
        </div>

        {/* Old-version banner */}
        {!isLatest && (
          <div className="flex items-center gap-2 px-5 py-2 border-b" style={{ background: 'rgba(251,191,36,0.06)', borderColor: 'rgba(251,191,36,0.15)' }}>
            <I n="clock" s={12} c="text-[#fbbf24]" />
            <p className="text-[11px] text-[var(--sb-muted)]">
              Viewing <span className="font-semibold text-[#fbbf24]">v{currentVersion.num}</span> &middot; {currentVersion.author} &middot; {fmtTs(currentVersion.date)}
            </p>
            <div className="flex-1" />
            <button
              onClick={() => setActiveVersionIdx(versions.length - 1)}
              className="text-[11px] font-medium text-[#a78bfa] hover:underline"
            >
              View latest (v{versions[versions.length - 1].num})
            </button>
          </div>
        )}

        <div className="p-5 space-y-6">
          {/* ── Executive Summary ── */}
          <div>
            <Sub
              icon="sparkle"
              title="Executive Summary"
              extra={
                isLatest && !editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="p-1 rounded-md text-[var(--sb-muted-soft)] hover:text-[#a78bfa] hover:bg-[rgba(167,139,250,0.08)] transition-colors"
                    title="Edit summary"
                  >
                    <I n="edit" s={12} />
                  </button>
                )
              }
            />
            {editing && isLatest ? (
              <div className="space-y-3">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={5}
                  className="w-full bg-[var(--sb-panel-2)] border border-[var(--sb-border)] text-[var(--sb-text)] text-[13px] leading-[1.7] rounded-lg px-3 py-2.5 resize-none placeholder-[var(--sb-muted-soft)] focus:outline-none focus:border-[rgba(167,139,250,0.50)] focus:shadow-[0_0_0_2px_rgba(167,139,250,0.12)] transition-colors"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => { setDraft(brief.executiveSummary); setEditing(false); }}
                    className="px-3 py-1.5 rounded-md text-[11px] font-medium bg-[var(--sb-panel-2)] text-[var(--sb-muted)] border border-[var(--sb-border)] hover:text-[var(--sb-text)] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-3 py-1.5 rounded-md text-[11px] font-medium bg-[var(--sb-accent)] text-[var(--sb-accent-contrast)] hover:bg-[var(--sb-accent-strong)] transition-colors"
                  >
                    Save as new version
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-[13px] text-[var(--sb-text)] leading-[1.7]">{brief.executiveSummary}</p>
            )}
          </div>

          <div className="border-t border-[rgba(167,139,250,0.12)]" />

          {/* ── Projected KPIs ── */}
          <div>
            <Sub icon="trendUp" title="Projected KPIs" count={brief.kpis.length} />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {brief.kpis.map((kpi) => (
                <div
                  key={kpi.label}
                  className="rounded-lg p-3"
                  style={{ background: 'rgba(167,139,250,0.04)', border: '1px solid rgba(167,139,250,0.15)' }}
                >
                  <span className="text-[11px] text-[var(--sb-muted)] uppercase tracking-wide">{kpi.label}</span>
                  <p className="text-[18px] font-bold mt-1" style={{ color: kpi.color }}>{kpi.value}</p>
                  <span
                    className="inline-flex items-center gap-1 text-[11px] font-medium mt-0.5 px-1.5 py-0.5 rounded"
                    style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399' }}
                  >
                    <I n="trendUp" s={10} c="text-[#34d399]" />
                    {kpi.trend}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-[rgba(167,139,250,0.12)]" />

          {/* ── Channel Strategy ── */}
          <div>
            <Sub icon="hash" title="Channel Strategy" count={brief.channelBreakdown.length} />
            <div className="rounded-lg border border-[var(--sb-border-soft)] overflow-hidden">
              <table className="w-full text-[11px]">
                <thead>
                  <tr style={{ background: 'rgba(167,139,250,0.04)' }}>
                    <th className="text-left text-[9px] font-semibold uppercase tracking-wider text-[var(--sb-muted-soft)] px-3 py-1.5 border-b border-[var(--sb-border-soft)]">Channel</th>
                    <th className="text-right text-[9px] font-semibold uppercase tracking-wider text-[var(--sb-muted-soft)] px-3 py-1.5 border-b border-[var(--sb-border-soft)]">Impressions</th>
                    <th className="text-right text-[9px] font-semibold uppercase tracking-wider text-[var(--sb-muted-soft)] px-3 py-1.5 border-b border-[var(--sb-border-soft)]">CTR</th>
                    <th className="text-right text-[9px] font-semibold uppercase tracking-wider text-[var(--sb-muted-soft)] px-3 py-1.5 border-b border-[var(--sb-border-soft)]">Contrib.</th>
                  </tr>
                </thead>
                <tbody>
                  {brief.channelBreakdown.map((ch) => (
                    <tr key={ch.channel} className="border-b border-[var(--sb-border-soft)] last:border-b-0">
                      <td className="px-3 py-2 text-[12px] font-medium text-[var(--sb-text)]">{ch.channel}</td>
                      <td className="px-3 py-2 text-right text-[var(--sb-muted)]">{ch.impressions}</td>
                      <td className="px-3 py-2 text-right text-[var(--sb-muted)]">{ch.ctr}</td>
                      <td className="px-3 py-2 text-right font-medium text-[#a78bfa]">{ch.contribution}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      {/* ── Reviewers (separate card) ── */}
      <Card icon="user" title="Reviewers" count={REVIEWERS.length}>
        <div className="rounded-lg border border-[var(--sb-border-soft)] overflow-hidden">
          {REVIEWERS.map((r) => {
            const st = STATUS_STYLE[r.status];
            return (
              <div key={r.name} className="flex items-center gap-2.5 px-3 py-1.5 border-b border-[var(--sb-border-soft)] last:border-b-0">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[9px] font-bold"
                  style={{
                    background: r.status === 'approved'
                      ? 'linear-gradient(rgba(var(--sb-accent-rgb),0.18), rgba(var(--sb-accent-rgb),0.18)), var(--sb-bg-soft)'
                      : 'var(--sb-panel-2)',
                    border: r.status === 'approved'
                      ? '1px solid rgba(var(--sb-accent-rgb),0.30)'
                      : '1px solid var(--sb-border-soft)',
                    color: r.status === 'approved' ? 'var(--sb-accent)' : 'var(--sb-muted)',
                  }}
                >
                  {r.initials}
                </div>
                <span className="text-[12px] font-medium text-[var(--sb-text)] truncate flex-1 min-w-0">{r.name}</span>
                <span className="text-[11px] text-[var(--sb-muted-soft)] shrink-0 hidden sm:inline">{r.role}</span>
                <span
                  className="text-[9px] font-semibold px-1.5 py-px rounded-full shrink-0"
                  style={{ background: st.bg, border: `1px solid ${st.border}`, color: st.color }}
                >
                  {st.label}
                </span>
              </div>
            );
          })}
        </div>
        <button className="mt-2.5 w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-medium border border-dashed border-[var(--sb-border-soft)] text-[var(--sb-muted)] hover:border-[rgba(var(--sb-accent-rgb),0.40)] hover:text-[var(--sb-accent)] hover:bg-[rgba(var(--sb-accent-rgb),0.04)] transition-colors">
          <I n="plus" s={10} />
          Invite Reviewer
        </button>
      </Card>

      {/* ── Final Brief (locked until all reviewers approve) ── */}
      <div className="rounded-xl border border-[var(--sb-border-soft)] bg-[var(--sb-panel)] overflow-hidden shadow-[var(--sb-shadow-sm)] relative">
        <Band icon="file" title="Final Brief" />

        {/* Locked overlay */}
        <div className="absolute inset-0 top-[37px] z-10 cursor-not-allowed" style={{ background: 'color-mix(in srgb, var(--sb-panel) 70%, transparent)', backdropFilter: 'blur(1.5px)' }}>
          <div className="flex flex-col items-center justify-center h-full gap-2 px-4">
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.25)' }}>
              <I n="clock" s={16} c="text-[#fbbf24]" />
            </div>
            <p className="text-[12px] font-medium text-[var(--sb-muted)]">Waiting for all reviewers to approve</p>
            <p className="text-[11px] text-[var(--sb-muted-soft)]">2 of 4 reviewers approved &middot; 1 pending review &middot; 1 invited</p>
          </div>
        </div>

        {/* Ghost content behind the overlay */}
        <div className="p-5 space-y-4 select-none" aria-hidden="true">
          <div className="space-y-2">
            <div className="h-3.5 w-2/3 rounded bg-[var(--sb-panel-2)]" />
            <div className="h-3 w-full rounded bg-[var(--sb-panel-2)]" />
            <div className="h-3 w-full rounded bg-[var(--sb-panel-2)]" />
            <div className="h-3 w-5/6 rounded bg-[var(--sb-panel-2)]" />
          </div>
          <div className="h-5" />
          <div className="grid grid-cols-3 gap-3">
            <div className="h-16 rounded-lg bg-[var(--sb-panel-2)]" />
            <div className="h-16 rounded-lg bg-[var(--sb-panel-2)]" />
            <div className="h-16 rounded-lg bg-[var(--sb-panel-2)]" />
          </div>
          <div className="h-5" />
          <div className="flex gap-3">
            <div className="h-9 flex-1 rounded-lg bg-[var(--sb-panel-2)]" />
            <div className="h-9 w-28 rounded-lg bg-[var(--sb-panel-2)]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BriefingTab;
