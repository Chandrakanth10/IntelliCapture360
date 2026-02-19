import { useMemo, useState } from 'react';
import { Badge, Card, I, PRI_CLS, STAGES } from '../shared/campaignShared';

const Dashboard = ({ campaigns, onSelect }) => {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const counts = useMemo(() => {
    const c = {};
    STAGES.forEach((s) => (c[s.key] = 0));
    campaigns.forEach((x) => (c[x.stage] = (c[x.stage] || 0) + 1));
    return c;
  }, [campaigns]);
  const total = campaigns.length;
  const active = counts.planning + counts.strategy + counts.creative + counts.execution;
  const pending = counts.intake + counts.review;
  const live = counts.live;
  const filtered = useMemo(() => {
    let f = filter === 'all' ? campaigns : campaigns.filter((c) => c.stage === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      f = f.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.bu.toLowerCase().includes(q) ||
          c.rep.toLowerCase().includes(q)
      );
    }
    return f;
  }, [campaigns, filter, search]);

  const stats = [
    { l: 'Total Campaigns', v: total, t: '+12%', up: true, color: 'bg-[#3ECF8E]', icon: 'layers' },
    { l: 'Active', v: active, t: '+3', up: true, color: 'bg-violet-500', icon: 'bar' },
    { l: 'Pending Review', v: pending, t: '-2', up: false, color: 'bg-amber-500', icon: 'clock' },
    { l: 'Live', v: live, t: 'Stable', up: null, color: 'bg-emerald-500', icon: 'flag' },
  ];

  return (
    <div className="space-y-4 anim-fade">
      <div>
        <h1 className="text-[15px] font-semibold text-[#f8f8f8]">Dashboard</h1>
        <p className="text-[12px] text-[#888] mt-0.5">
          Feb 18, 2026 &middot; {total} campaigns
        </p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {stats.map((s) => (
          <Card key={s.l} className="!p-0">
            <div className="p-3.5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">{s.l}</p>
                  <p className="text-2xl font-semibold text-slate-900 mt-1">{s.v}</p>
                </div>
                <div
                  className={`w-7 h-7 ${s.color} rounded-md flex items-center justify-center`}
                >
                  <I n={s.icon} s={13} c="text-white" />
                </div>
              </div>
              {s.up !== null && (
                <p
                  className={`text-[11px] mt-1.5 font-medium ${
                    s.up ? 'text-emerald-600' : 'text-amber-600'
                  }`}
                >
                  {s.t} vs last quarter
                </p>
              )}
              {s.up === null && (
                <p className="text-[11px] mt-1.5 text-slate-400">{s.t}</p>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Card title="Pipeline" icon="bar">
        <div className="flex rounded-md overflow-hidden h-9">
          {STAGES.map((s) => {
            const cnt = counts[s.key] || 0;
            if (!cnt) return null;
            return (
              <div
                key={s.key}
                className={`pipe-seg ${s.color} flex items-center justify-center cursor-pointer relative group`}
                style={{ width: `${Math.max((cnt / total) * 100, 8)}%` }}
                onClick={() => setFilter(filter === s.key ? 'all' : s.key)}
              >
                <span className="text-[10px] font-bold text-white">{cnt}</span>
                <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-[#2a2a2a] text-white text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20 border border-[#333]">
                  {s.label}: {cnt}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex mt-2.5 gap-2.5 flex-wrap">
          {STAGES.map((s) => (
            <button
              key={s.key}
              onClick={() => setFilter(filter === s.key ? 'all' : s.key)}
              className={`flex items-center gap-1.5 text-[11px] transition-all ${
                filter === s.key ? 'font-semibold ' + s.text : 'text-[#999] hover:text-[#ccc]'
              }`}
            >
              <div className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
              {s.label}
            </button>
          ))}
          {filter !== 'all' && (
            <button
              onClick={() => setFilter('all')}
              className="text-[11px] text-indigo-600 font-medium hover:underline ml-auto"
            >
              Clear
            </button>
          )}
        </div>
      </Card>

      <Card className="!p-0">
        <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between gap-3">
          <span className="text-[13px] font-semibold text-slate-900">
            {filter === 'all' ? 'All Campaigns' : STAGES.find((s) => s.key === filter)?.label} (
            {filtered.length})
          </span>
          <div className="relative w-52">
            <I n="search" s={13} c="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-[12px] focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <I n="x" s={12} />
              </button>
            )}
          </div>
        </div>
        <div className="overflow-auto max-h-[360px] scrollbar-thin">
          {filtered.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-[12px] text-slate-400">No campaigns found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="sticky top-0 bg-slate-50/95">
                <tr className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                  <th className="text-left px-4 py-2">Campaign</th>
                  <th className="text-left px-3 py-2">BU</th>
                  <th className="text-left px-3 py-2">Priority</th>
                  <th className="text-left px-3 py-2">Status</th>
                  <th className="text-left px-3 py-2">Launch</th>
                  <th className="text-left px-3 py-2">Lead</th>
                  <th className="px-2 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((c) => {
                  const stg = STAGES.find((s) => s.key === c.stage);
                  return (
                    <tr
                      key={c.id}
                      className="hover:bg-indigo-50/30 cursor-pointer transition-colors"
                      onClick={() => onSelect(c)}
                    >
                      <td className="px-4 py-2.5">
                        <p className="text-[12px] font-medium text-slate-900">{c.name}</p>
                        <p className="text-[11px] text-slate-400 truncate max-w-[200px]">{c.desc}</p>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="text-[11px] text-[#c0c0c0] bg-[#2a2a2a] px-1.5 py-0.5 rounded-md border border-[#363636]">
                          {c.bu}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <Badge cls={PRI_CLS[c.pri]}>{c.pri}</Badge>
                      </td>
                      <td className="px-3 py-2.5">
                        <Badge cls={`${stg.bg} ${stg.text} border-transparent`}>{stg.label}</Badge>
                      </td>
                      <td className="px-3 py-2.5 text-[12px] text-slate-600">{c.date}</td>
                      <td className="px-3 py-2.5 text-[11px] text-slate-500">{c.rep}</td>
                      <td className="px-2 py-2.5">
                        <I n="chevR" s={13} c="text-slate-300" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
