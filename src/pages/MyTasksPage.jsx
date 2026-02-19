import { useState } from 'react';
import { CURRENT_USER, I, STAGES, parseDate } from '../shared/campaignShared';
const MO = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const PRI = {
  High: { bg: '#3b1520', border: '#5c2030', text: '#f87171' },
  Medium: { bg: '#3b2e10', border: '#5c4a18', text: '#fbbf24' },
  Low: { bg: '#0f2d3d', border: '#164050', text: '#38bdf8' },
};

const PRI_RANK = { High: 0, Medium: 1, Low: 2 };

const TABS = [
  { key: 'action', label: 'Action Required', icon: 'alert', color: '#fbbf24' },
  { key: 'progress', label: 'In Progress', icon: 'zap', color: '#3ECF8E' },
  { key: 'monitoring', label: 'Monitoring', icon: 'eye', color: '#60a5fa' },
];

const SORTABLE = [
  { key: 'priority', label: 'Priority', col: 2 },
  { key: 'date', label: 'Date', col: 3 },
  { key: 'roi', label: 'ROI', col: 4 },
  { key: 'days', label: 'Days', col: 5 },
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
      style={{ borderBottomColor: active && dir === 'asc' ? '#ededed' : '#555' }}
    />
    <span
      className="border-l-[3.5px] border-r-[3.5px] border-t-[4px] border-transparent"
      style={{ borderTopColor: active && dir === 'desc' ? '#ededed' : '#555' }}
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

  // Apply search
  const searched = search.trim()
    ? scoped.filter((c) => {
        const q = search.toLowerCase();
        return c.name.toLowerCase().includes(q) || c.bu.toLowerCase().includes(q) || c.rep.toLowerCase().includes(q);
      })
    : scoped;

  const filtered = !tab ? searched : searched.filter((c) => categorize(c) === tab);
  const sorted = sortCampaigns(filtered, sortKey, sortDir);

  const counts = {};
  searched.forEach((c) => { const k = categorize(c); counts[k] = (counts[k] || 0) + 1; });

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const colHeader = (label, sortable) => {
    const isActive = sortKey === sortable;
    if (!sortable) {
      return <span className="text-[10px] font-medium text-[#555] uppercase tracking-wider">{label}</span>;
    }
    return (
      <button
        onClick={() => handleSort(sortable)}
        className="group flex items-center text-[10px] font-medium uppercase tracking-wider transition-colors hover:text-[#ccc]"
        style={{ color: isActive ? '#ccc' : '#555' }}
      >
        {label}
        <SortIcon active={isActive} dir={sortDir} />
      </button>
    );
  };

  return (
    <div className="anim-fade h-[calc(100vh-148px)] flex flex-col">
      {/* Header */}
      <div className="mb-4 shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-[15px] font-semibold text-[#f8f8f8]">Campaigns</h1>
          <p className="text-[12px] text-[#666]">
            {scope === 'mine' ? `${mine.length} campaigns assigned to ${CURRENT_USER.name}` : `${campaigns.length} total campaigns`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {sortKey && (
            <button
              onClick={() => { setSortKey(null); setSortDir('asc'); }}
              className="text-[11px] text-[#666] hover:text-[#ccc] transition-colors flex items-center gap-1"
            >
              <I n="x" s={10} />
              Clear sort
            </button>
          )}
          <div className="relative w-44">
            <I n="search" s={12} c="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#555]" />
            <input
              className="w-full pl-8 pr-3 py-1.5 bg-[#1e1e1e] border border-[#2a2a2a] text-[#ccc] text-[11px] rounded-md placeholder-[#555] focus:outline-none focus:border-[#3ECF8E50] transition-colors"
              placeholder="Search campaigns..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#ccc]">
                <I n="x" s={10} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Scope + Filter tabs */}
      <div className="flex items-center gap-3 mb-4 shrink-0">
        <div className="flex bg-[#1a1a1a] rounded-md border border-[#2a2a2a] p-0.5">
          {SCOPES.map((s) => (
            <button
              key={s.key}
              onClick={() => { setScope(s.key); setTab(null); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-md transition-colors ${
                scope === s.key
                  ? 'bg-[#252525] text-white shadow-sm'
                  : 'text-[#666] hover:text-[#ccc]'
              }`}
            >
              <I n={s.icon} s={11} />
              {s.label}
            </button>
          ))}
        </div>

        <div className="w-px h-5 bg-[#2a2a2a]" />

        <div className="flex gap-1">
          {TABS.filter((t) => (counts[t.key] || 0) > 0).map((t) => {
            const isActive = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(isActive ? null : t.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded-md transition-colors border ${
                  isActive
                    ? 'bg-[#252525] text-white border-[#3ECF8E50]'
                    : 'text-[#777] hover:text-[#ccc] hover:bg-[#1e1e1e] border-transparent'
                }`}
              >
                <I n={t.icon} s={12} />
                {t.label}
                <span className={`text-[10px] ${isActive ? 'text-[#888]' : 'text-[#555]'}`}>
                  {counts[t.key]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 min-h-0 rounded-lg border border-[#2a2a2a] bg-[#161616] overflow-hidden flex flex-col">
        <div className={`grid gap-3 px-4 py-2.5 border-b border-[#2a2a2a] bg-[#1a1a1a] shrink-0 ${scope === 'all_camps' ? 'grid-cols-[1fr_120px_110px_80px_80px_80px_70px]' : 'grid-cols-[1fr_120px_80px_80px_80px_70px]'}`}>
          {colHeader('Campaign', null)}
          {colHeader('Stage', null)}
          {scope === 'all_camps' && colHeader('Lead', null)}
          {colHeader('Priority', 'priority')}
          {colHeader('Date', 'date')}
          {colHeader('ROI', 'roi')}
          <div className="flex justify-end">
            {colHeader('Days', 'days')}
          </div>
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
                className={`grid gap-3 px-4 py-2.5 border-b border-[#222] cursor-pointer hover:bg-[#1e1e1e] transition-colors items-center ${scope === 'all_camps' ? 'grid-cols-[1fr_120px_110px_80px_80px_80px_70px]' : 'grid-cols-[1fr_120px_80px_80px_80px_70px]'}`}
              >
                <div className="min-w-0 flex items-center gap-2.5">
                  {!tab && (
                    <span
                      className="w-1 h-5 rounded-full shrink-0"
                      style={{ backgroundColor: catTab?.color || '#555' }}
                      title={catTab?.label}
                    />
                  )}
                  <div className="min-w-0">
                    <p className="text-[12px] font-medium text-[#ededed] truncate">{c.name}</p>
                    <p className="text-[10px] text-[#555] mt-0.5">{c.bu}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: stg.hex }} />
                  <span className="text-[11px] text-[#888] truncate">{stg.label}</span>
                </div>
                {scope === 'all_camps' && (
                  <span className="text-[11px] text-[#888] truncate">{c.rep}</span>
                )}
                <span
                  className="text-[10px] font-medium px-1.5 py-0.5 rounded border w-fit"
                  style={{ backgroundColor: pri.bg, borderColor: pri.border, color: pri.text }}
                >
                  {c.pri}
                </span>
                <span className="text-[11px] text-[#666]">{MO[pd.m]} {pd.d}</span>
                <span className="text-[11px] font-medium text-[#3ECF8E]">{c.roi}</span>
                <span className="text-[11px] text-[#555] flex items-center gap-1 justify-end">
                  <I n="clock" s={10} />
                  {c.days}d
                </span>
              </div>
            );
          })}

          {sorted.length === 0 && (
            <div className="py-12 text-center">
              <I n="briefcase" s={24} c="text-[#333] mx-auto mb-2" />
              <p className="text-[12px] text-[#555]">No campaigns match this filter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTasks;
