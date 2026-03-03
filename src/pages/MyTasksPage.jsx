import { useMemo, useState } from 'react';
import { CURRENT_USER, I, STAGES } from '../shared/campaignShared';

/* ── data ──────────────────────────────────────────────── */

const QUEUES = [
  { key: 'all', label: 'All' },
  { key: 'action', label: 'Needs Action' },
  { key: 'progress', label: 'In Progress' },
  { key: 'monitoring', label: 'Live' },
];

const SORTS = [
  { key: 'priority', label: 'Priority' },
  { key: 'due', label: 'Due Date' },
  { key: 'roi', label: 'ROI' },
  { key: 'age', label: 'Stage Age' },
  { key: 'name', label: 'Name' },
];

const PRI_RANK = { High: 0, Medium: 1, Low: 2 };

/* ── helpers ───────────────────────────────────────────── */

function classify(c) {
  if (c.status === 'Pending Info' || c.status === 'New' || c.stage === 'review') return 'action';
  if (c.stage === 'live') return 'monitoring';
  return 'progress';
}

function daysUntil(iso) {
  if (!iso) return 0;
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return 0;
  const now = new Date();
  return Math.round((d.getTime() - new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) / 86400000);
}

function formatDue(iso) {
  if (!iso) return iso;
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function roiValue(roi) {
  const n = parseFloat(String(roi || '').replace(/[^0-9.]/g, ''));
  return (n || 0) * (String(roi || '').includes('M') ? 1000 : 1);
}

function sortList(list, key, dir) {
  const d = dir === 'asc' ? 1 : -1;
  return [...list].sort((a, b) => {
    if (key === 'priority') return d * ((PRI_RANK[a.pri] ?? 9) - (PRI_RANK[b.pri] ?? 9));
    if (key === 'due') return d * String(a.date || '').localeCompare(String(b.date || ''));
    if (key === 'roi') return d * (roiValue(a.roi) - roiValue(b.roi));
    if (key === 'age') return d * ((a.days || 0) - (b.days || 0));
    return d * String(a.name || '').localeCompare(String(b.name || ''));
  });
}

function stageMeta(key) {
  return STAGES.find((s) => s.key === key) || STAGES[0];
}


/* ── page ──────────────────────────────────────────────── */

const MyTasksPage = ({ campaigns, onSelect }) => {
  const [scope, setScope] = useState('mine');
  const [queue, setQueue] = useState('all');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('priority');
  const [sortDir, setSortDir] = useState('asc');

  const mine = useMemo(() => campaigns.filter((c) => c.rep === CURRENT_USER.name), [campaigns]);
  const scoped = scope === 'mine' ? mine : campaigns;

  const q = search.trim().toLowerCase();
  const searched = useMemo(() => {
    if (!q) return scoped;
    return scoped.filter((c) =>
      c.name.toLowerCase().includes(q)
      || c.bu.toLowerCase().includes(q)
      || c.rep.toLowerCase().includes(q)
      || c.desc.toLowerCase().includes(q)
    );
  }, [scoped, q]);

  const counts = useMemo(() => {
    const b = { all: searched.length, action: 0, progress: 0, monitoring: 0 };
    searched.forEach((c) => { b[classify(c)] += 1; });
    return b;
  }, [searched]);

  const filtered = useMemo(
    () => (queue === 'all' ? searched : searched.filter((c) => classify(c) === queue)),
    [queue, searched]
  );

  const sorted = useMemo(() => sortList(filtered, sortKey, sortDir), [filtered, sortKey, sortDir]);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return null;
    return <I n={sortDir === 'asc' ? 'trendUp' : 'bar'} s={11} c="inline-block ml-1 opacity-50" />;
  };

  return (
    <div className="anim-fade">

      {/* ── outer card ─────────────────────────────────── */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{
          background: 'var(--sb-panel)',
          borderColor: 'var(--sb-border-soft)',
          boxShadow: 'var(--sb-shadow-sm)',
        }}
      >

        {/* ── header ───────────────────────────────────── */}
        <div className="px-6 pt-6 pb-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-[18px] font-semibold text-[var(--sb-text-strong)]">Campaigns</h1>
              <p className="text-[13px] mt-1 text-[var(--sb-muted)]">
                {scope === 'mine'
                  ? `A list of all campaigns assigned to you including stage, priority, and timeline.`
                  : `All campaigns across the organization including stage, priority, and timeline.`}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {/* scope toggle */}
              <div
                className="inline-flex rounded-lg p-0.5"
                style={{ background: 'var(--sb-panel-2)', border: '1px solid var(--sb-border-soft)' }}
              >
                {[{ k: 'mine', l: 'My Tasks' }, { k: 'all_camps', l: 'All' }].map((s) => (
                  <button
                    key={s.k}
                    type="button"
                    onClick={() => setScope(s.k)}
                    className="px-3 py-1.5 rounded-md text-[12px] font-medium transition-all"
                    style={scope === s.k
                      ? { background: 'var(--sb-accent)', color: 'var(--sb-accent-contrast)', boxShadow: '0 1px 2px rgba(0,0,0,0.15)' }
                      : { color: 'var(--sb-muted)' }}
                  >
                    {s.l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* filters row */}
          <div className="mt-4 flex items-center gap-3">
            {/* queue tabs */}
            <div className="flex items-center gap-1">
              {QUEUES.map((item) => {
                const active = queue === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setQueue(item.key)}
                    className="px-3 py-1.5 text-[12px] font-medium rounded-lg transition-all"
                    style={active
                      ? { background: 'var(--sb-panel-2)', color: 'var(--sb-text)', border: '1px solid var(--sb-border)' }
                      : { color: 'var(--sb-muted)', border: '1px solid transparent' }}
                  >
                    {item.label}
                    <span className="ml-1.5 opacity-50">{counts[item.key] ?? 0}</span>
                  </button>
                );
              })}
            </div>

            {/* search - pushed right */}
            <div className="ml-auto relative w-[240px]">
              <I n="search" s={13} c="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--sb-muted-soft)]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="h-8 w-full rounded-lg pl-8 pr-7 text-[12px] focus:outline-none"
                style={{ background: 'var(--sb-panel-2)', border: '1px solid var(--sb-border-soft)', color: 'var(--sb-text)' }}
              />
              {search && (
                <button type="button" onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--sb-muted)] hover:text-[var(--sb-text)]">
                  <I n="x" s={10} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── table ────────────────────────────────────── */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderTop: '1px solid var(--sb-border-soft)', borderBottom: '1px solid var(--sb-border-soft)', background: 'var(--sb-panel-2)' }}>
                {[
                  { key: 'name', label: 'Campaign' },
                  { key: null, label: 'Status' },
                  { key: 'priority', label: 'Priority' },
                  { key: 'due', label: 'Due' },
                  { key: null, label: '' },
                ].map((col, i) => (
                  <th
                    key={col.label || i}
                    className="px-5 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider whitespace-nowrap"
                    style={{ color: 'var(--sb-muted-soft)' }}
                  >
                    {col.key ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(col.key)}
                        className="inline-flex items-center hover:text-[var(--sb-text)] transition-colors"
                        style={{ color: sortKey === col.key ? 'var(--sb-text)' : undefined }}
                      >
                        {col.label}
                        <SortIcon col={col.key} />
                      </button>
                    ) : col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((campaign, idx) => {
                const stage = stageMeta(campaign.stage);
                const dueDays = daysUntil(campaign.date);
                const overdue = dueDays < 0;
                const urgent = dueDays >= 0 && dueDays <= 3;

                return (
                  <tr
                    key={campaign.id}
                    onClick={() => onSelect(campaign)}
                    className="group cursor-pointer transition-colors"
                    style={{ borderBottom: idx < sorted.length - 1 ? '1px solid var(--sb-border-soft)' : undefined }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--sb-panel-2)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    {/* Campaign */}
                    <td className="px-5 py-3.5">
                      <p className="text-[13px] font-medium text-[var(--sb-text-strong)]">{campaign.name}</p>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: stage.hex }} />
                        <span className="text-[12px] font-medium text-[var(--sb-text)]">{stage.label}</span>
                      </span>
                    </td>

                    {/* Priority */}
                    <td className="px-5 py-3.5">
                      <span
                        className="text-[12px] font-medium"
                        style={{
                          color: campaign.pri === 'High' ? '#ef4444'
                            : campaign.pri === 'Medium' ? '#f59e0b'
                            : '#3b82f6',
                        }}
                      >
                        {campaign.pri}
                      </span>
                    </td>

                    {/* Due */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span
                        className="text-[12px] font-medium"
                        style={{ color: overdue ? '#ef4444' : urgent ? '#f59e0b' : 'var(--sb-text)' }}
                      >
                        {formatDue(campaign.date)}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-5 py-3.5 text-right">
                      <span className="text-[12px] font-medium text-[var(--sb-accent)] opacity-0 group-hover:opacity-100 transition-opacity">
                        View
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ── empty state ──────────────────────────────── */}
        {sorted.length === 0 && (
          <div className="py-16 text-center">
            <I n="search" s={20} c="mx-auto text-[var(--sb-muted-soft)]" />
            <p className="mt-3 text-[13px] font-medium text-[var(--sb-text)]">No campaigns found</p>
            <p className="mt-1 text-[12px] text-[var(--sb-muted-soft)]">Try adjusting your filters or search</p>
          </div>
        )}

        {/* ── footer ───────────────────────────────────── */}
        <div
          className="px-6 py-3 flex items-center justify-between"
          style={{ borderTop: '1px solid var(--sb-border-soft)' }}
        >
          <p className="text-[11px] text-[var(--sb-muted-soft)]">
            Showing <span className="font-semibold text-[var(--sb-text)]">{sorted.length}</span> of{' '}
            <span className="font-semibold text-[var(--sb-text)]">{scoped.length}</span> campaigns
          </p>
          <div className="flex items-center gap-2">
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              className="h-7 rounded-md px-2 text-[11px] focus:outline-none"
              style={{ background: 'var(--sb-panel-2)', border: '1px solid var(--sb-border-soft)', color: 'var(--sb-muted)' }}
            >
              {SORTS.map((s) => <option key={s.key} value={s.key}>Sort: {s.label}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTasksPage;
