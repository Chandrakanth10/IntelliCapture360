import { useState } from 'react';
import { CURRENT_USER, I, STAGES, parseDate } from '../shared/campaignShared';

const MO = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const PRI = {
  High: { bg: 'rgba(248, 113, 113, 0.12)', border: 'rgba(248, 113, 113, 0.28)', text: '#dc2626' },
  Medium: { bg: 'rgba(251, 191, 36, 0.14)', border: 'rgba(251, 191, 36, 0.3)', text: '#d97706' },
  Low: { bg: 'rgba(56, 189, 248, 0.12)', border: 'rgba(56, 189, 248, 0.28)', text: '#0369a1' },
};

const PRI_RANK = { High: 0, Medium: 1, Low: 2 };

const TABS = [
  { key: 'action', label: 'Action Required', icon: 'alert', color: '#d97706' },
  { key: 'progress', label: 'In Progress', icon: 'zap', color: '#16a34a' },
  { key: 'monitoring', label: 'Monitoring', icon: 'eye', color: '#0284c7' },
];

function categorize(c) {
  if (c.status === 'Pending Info' || c.status === 'New' || c.stage === 'review') return 'action';
  if (c.stage === 'live') return 'monitoring';
  return 'progress';
}

function parseRoi(s) {
  const n = parseFloat((s || '').replace(/[^0-9.]/g, ''));
  const mult = (s || '').includes('M') ? 1000 : 1;
  return (n || 0) * mult;
}

function sortCampaigns(list, sortKey, sortDir) {
  if (!sortKey) return list;
  const dir = sortDir === 'asc' ? 1 : -1;
  return [...list].sort((a, b) => {
    if (sortKey === 'priority') return dir * ((PRI_RANK[a.pri] ?? 9) - (PRI_RANK[b.pri] ?? 9));
    if (sortKey === 'date') return dir * (a.date.localeCompare(b.date));
    if (sortKey === 'roi') return dir * (parseRoi(a.roi) - parseRoi(b.roi));
    if (sortKey === 'days') return dir * (a.days - b.days);
    return 0;
  });
}

const SortIcon = ({ active, dir }) => (
  <span className={`inline-flex flex-col gap-[1px] ml-1 ${active ? '' : 'opacity-0 group-hover:opacity-50'}`}>
    <span
      className="border-l-[3.5px] border-r-[3.5px] border-b-[4px] border-transparent"
      style={{ borderBottomColor: active && dir === 'asc' ? 'var(--sb-text)' : 'var(--sb-muted-soft)' }}
    />
    <span
      className="border-l-[3.5px] border-r-[3.5px] border-t-[4px] border-transparent"
      style={{ borderTopColor: active && dir === 'desc' ? 'var(--sb-text)' : 'var(--sb-muted-soft)' }}
    />
  </span>
);

const SCOPES = [
  { key: 'mine', label: 'My Campaigns', icon: 'user' },
  { key: 'all_camps', label: 'All Campaigns', icon: 'layers' },
];

const MyTasks = ({ campaigns, onSelect }) => {
  const [scope, setScope] = useState('mine');
  const [tab, setTab] = useState(null);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [search, setSearch] = useState('');

  const mine = campaigns.filter((c) => c.rep === CURRENT_USER.name);
  const scoped = scope === 'mine' ? mine : campaigns;

  const searched = search.trim()
    ? scoped.filter((c) => {
        const q = search.toLowerCase();
        return c.name.toLowerCase().includes(q) || c.bu.toLowerCase().includes(q) || c.rep.toLowerCase().includes(q);
      })
    : scoped;

  const filtered = !tab ? searched : searched.filter((c) => categorize(c) === tab);
  const sorted = sortCampaigns(filtered, sortKey, sortDir);

  const counts = {};
  searched.forEach((c) => {
    const k = categorize(c);
    counts[k] = (counts[k] || 0) + 1;
  });

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const colHeader = (label, sortable) => {
    const isActive = sortKey === sortable;
    if (!sortable) {
      return <span className="text-[11px] font-semibold text-[var(--sb-muted-soft)] uppercase tracking-wider">{label}</span>;
    }
    return (
      <button
        onClick={() => handleSort(sortable)}
        className="group flex items-center text-[11px] font-semibold uppercase tracking-wider transition-colors"
        style={{ color: isActive ? 'var(--sb-text)' : 'var(--sb-muted-soft)' }}
      >
        {label}
        <SortIcon active={isActive} dir={sortDir} />
      </button>
    );
  };

  return (
    <div className="anim-fade h-[calc(100vh-148px)] flex flex-col">
      <div className="mb-4 shrink-0 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-[var(--sb-text-strong)]">Campaigns</h1>
          <p className="text-[13px] text-[var(--sb-muted)] mt-1">
            {scope === 'mine' ? `${mine.length} campaigns assigned to ${CURRENT_USER.name}` : `${campaigns.length} total campaigns`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {sortKey && (
            <button
              onClick={() => {
                setSortKey(null);
                setSortDir('asc');
              }}
              className="text-[11px] transition-colors flex items-center gap-1 text-[var(--sb-muted)] hover:text-[var(--sb-text)]"
            >
              <I n="x" s={10} />
              Clear sort
            </button>
          )}
          <div className="relative w-52">
            <I n="search" s={12} c="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--sb-muted-soft)]" />
            <input
              className="w-full pl-8 pr-8 py-2 border text-[12px] rounded-lg placeholder-[var(--sb-muted-soft)] focus:outline-none transition-colors"
              style={{ background: 'var(--sb-panel)', borderColor: 'var(--sb-border)', color: 'var(--sb-text)' }}
              placeholder="Search campaigns..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--sb-muted-soft)] hover:text-[var(--sb-text)]">
                <I n="x" s={10} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4 shrink-0 flex-wrap">
        <div className="flex rounded-lg border p-1" style={{ background: 'var(--sb-panel)', borderColor: 'var(--sb-border)' }}>
          {SCOPES.map((s) => (
            <button
              key={s.key}
              onClick={() => {
                setScope(s.key);
                setTab(null);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-md transition-colors"
              style={scope === s.key
                ? { background: 'var(--sb-panel-2)', color: 'var(--sb-text)', border: '1px solid var(--sb-border-soft)' }
                : { color: 'var(--sb-muted)' }}
            >
              <I n={s.icon} s={11} />
              {s.label}
            </button>
          ))}
        </div>

        <div className="w-px h-5 bg-[var(--sb-border)]" />

        <div className="flex gap-1 flex-wrap">
          {TABS.filter((t) => (counts[t.key] || 0) > 0).map((t) => {
            const isActive = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(isActive ? null : t.key)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded-lg transition-colors border"
                style={isActive
                  ? { background: 'var(--sb-panel)', color: 'var(--sb-text)', borderColor: 'var(--sb-border)', boxShadow: 'var(--sb-shadow-sm)' }
                  : { color: 'var(--sb-muted)', borderColor: 'transparent' }}
              >
                <I n={t.icon} s={12} />
                {t.label}
                <span className="text-[11px]" style={{ color: isActive ? 'var(--sb-muted)' : 'var(--sb-muted-soft)' }}>
                  {counts[t.key]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        className="flex-1 min-h-0 rounded-xl border overflow-hidden flex flex-col"
        style={{ background: 'var(--sb-bg-soft)', borderColor: 'var(--sb-border)', boxShadow: 'var(--sb-shadow-sm)' }}
      >
        <div
        className={`grid gap-3 px-4 py-3 border-b shrink-0 ${scope === 'all_camps' ? 'grid-cols-[1fr_120px_110px_80px_80px_80px_70px]' : 'grid-cols-[1fr_120px_80px_80px_80px_70px]'}`}
        style={{ background: 'var(--sb-panel-2)', borderColor: 'var(--sb-border-soft)' }}
      >
          {colHeader('Campaign', null)}
          {colHeader('Stage', null)}
          {scope === 'all_camps' && colHeader('Lead', null)}
          {colHeader('Priority', 'priority')}
          {colHeader('Date', 'date')}
          {colHeader('ROI', 'roi')}
          <div className="flex justify-end">{colHeader('Days', 'days')}</div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {sorted.map((c) => {
            const stg = STAGES.find((s) => s.key === c.stage);
            const pri = PRI[c.pri] || PRI.Medium;
            const pd = parseDate(c.date);
            const cat = categorize(c);
            const catTab = TABS.find((t) => t.key === cat);
            return (
              <div
                key={c.id}
                onClick={() => onSelect(c)}
                className={`grid gap-3 px-4 py-3.5 border-b cursor-pointer transition-colors items-center hover:bg-[var(--sb-panel-2)] ${scope === 'all_camps' ? 'grid-cols-[1fr_120px_110px_80px_80px_80px_70px]' : 'grid-cols-[1fr_120px_80px_80px_80px_70px]'}`}
                style={{ borderColor: 'var(--sb-border-soft)' }}
              >
                <div className="min-w-0 flex items-center gap-2.5">
                  {!tab && (
                    <span
                      className="w-1 h-5 rounded-full shrink-0"
                      style={{ backgroundColor: catTab?.color || 'var(--sb-muted-soft)' }}
                      title={catTab?.label}
                    />
                  )}
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-[var(--sb-text)] truncate">{c.name}</p>
                    <p className="text-[11px] text-[var(--sb-muted)] mt-0.5">{c.bu}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: stg.hex }} />
                  <span className="text-[11px] text-[var(--sb-muted)] truncate">{stg.label}</span>
                </div>
                {scope === 'all_camps' && <span className="text-[11px] text-[var(--sb-muted)] truncate">{c.rep}</span>}
                <span
                  className="text-[11px] font-medium px-1.5 py-0.5 rounded border w-fit"
                  style={{ backgroundColor: pri.bg, borderColor: pri.border, color: pri.text }}
                >
                  {c.pri}
                </span>
                <span className="text-[11px] text-[var(--sb-muted)]">{MO[pd.m]} {pd.d}</span>
                <span className="text-[11px] font-semibold text-[var(--sb-success-soft-text)]">{c.roi}</span>
                <span className="text-[11px] text-[var(--sb-muted)] flex items-center gap-1 justify-end">
                  <I n="clock" s={10} />
                  {c.days}d
                </span>
              </div>
            );
          })}
          {sorted.length === 0 && (
            <div className="py-16 text-center">
              <I n="search" s={20} c="text-[var(--sb-muted-soft)] mx-auto mb-2" />
              <p className="text-[13px] text-[var(--sb-muted)]">No campaigns match the current filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTasks;
