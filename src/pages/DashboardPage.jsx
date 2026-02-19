import { useMemo, useState } from 'react';
import { Card, CURRENT_USER, I, STAGES, STAGE_APPROVALS } from '../shared/campaignShared';

const PRI_COLORS = {
  High: { bg: '#f8717118', border: '#f8717130', text: '#f87171' },
  Medium: { bg: '#fbbf2418', border: '#fbbf2430', text: '#fbbf24' },
  Low: { bg: '#38bdf818', border: '#38bdf830', text: '#38bdf8' },
};

const Dashboard = ({ campaigns, approvals = {}, onSelect }) => {
  const [filter, setFilter] = useState('all');
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

  // Build pending tasks for current user
  const pendingTasks = useMemo(() => {
    const PRI_ORDER = { High: 0, Medium: 1, Low: 2 };
    const tasks = [];
    campaigns.forEach((camp) => {
      const stageItems = STAGE_APPROVALS[camp.stage] || [];
      const campApprovals = approvals[camp.id] || {};
      stageItems.forEach((item) => {
        if (item.assignee === CURRENT_USER.name && !campApprovals[item.key]) {
          const stg = STAGES.find((s) => s.key === camp.stage);
          tasks.push({
            campaignId: camp.id,
            campaignName: camp.name,
            approvalKey: item.key,
            approvalLabel: item.label,
            stage: stg,
            priority: camp.pri,
            days: camp.days,
            date: camp.date,
          });
        }
      });
    });
    tasks.sort((a, b) => {
      const pa = PRI_ORDER[a.priority] ?? 9;
      const pb = PRI_ORDER[b.priority] ?? 9;
      if (pa !== pb) return pa - pb;
      return (b.days || 0) - (a.days || 0);
    });
    return tasks;
  }, [campaigns, approvals]);

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
          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} &middot; {total} campaigns
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
        <div className="flex mt-2.5 gap-2.5 flex-wrap justify-center">
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

      {/* Filtered Campaign List */}
      {filter !== 'all' && (() => {
        const stg = STAGES.find((s) => s.key === filter);
        const filtered = campaigns.filter((c) => c.stage === filter);
        if (!filtered.length) return null;
        return (
          <div className="rounded-lg border border-[#2a2a2a] bg-[#161616] overflow-hidden anim-fade">
            <div className="px-4 py-3 border-b border-[#2a2a2a] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-2.5 h-2.5 rounded-full ${stg?.color || ''}`} />
                <h3 className="text-[13px] font-semibold text-[#ededed]">{stg?.label || filter}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border" style={{ backgroundColor: stg?.hex + '18', borderColor: stg?.hex + '30', color: stg?.hex }}>{filtered.length}</span>
              </div>
              <button onClick={() => setFilter('all')} className="text-[11px] text-[#666] hover:text-[#ccc] transition-colors">Dismiss</button>
            </div>
            <div className="divide-y divide-[#222]">
              {filtered.map((c) => {
                const pri = PRI_COLORS[c.pri] || PRI_COLORS.Medium;
                return (
                  <button
                    key={c.id}
                    onClick={() => onSelect && onSelect(c)}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[#1e1e1e] transition-colors text-left group"
                  >
                    <div className="flex-1 min-w-0">
                      <span className="text-[12px] font-medium text-[#ccc] group-hover:text-[#ededed] transition-colors truncate block">{c.name}</span>
                      <span className="text-[10px] text-[#666] mt-0.5 block">{c.bu}</span>
                    </div>
                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded border" style={{ backgroundColor: pri.bg, borderColor: pri.border, color: pri.text }}>{c.pri}</span>
                    <span className="text-[10px] text-[#555]">{c.days}d</span>
                    <I n="chevR" s={12} c="text-[#333] group-hover:text-[#666] transition-colors" />
                  </button>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* My Pending Approvals */}
      <div className="rounded-lg border border-[#2a2a2a] bg-[#161616] overflow-hidden">
        <div className="px-4 py-3 border-b border-[#2a2a2a] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[#fbbf2415] border border-[#fbbf2425] flex items-center justify-center flex-shrink-0">
              <I n="check" s={13} c="text-[#fbbf24]" />
            </div>
            <div>
              <h3 className="text-[13px] font-semibold text-[#ededed] leading-tight">My Pending Approvals</h3>
              <p className="text-[11px] text-[#555] mt-0.5">{pendingTasks.length} item{pendingTasks.length !== 1 ? 's' : ''} awaiting your action</p>
            </div>
          </div>
          {pendingTasks.length > 0 && (
            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-[#fbbf2418] border border-[#fbbf2430] text-[#fbbf24]">
              {pendingTasks.length}
            </span>
          )}
        </div>
        <div className="divide-y divide-[#222]">
          {pendingTasks.length === 0 ? (
            <div className="py-10 text-center">
              <I n="check" s={24} c="text-[#3ECF8E] mx-auto mb-2" />
              <p className="text-[13px] font-medium text-[#888]">All caught up!</p>
              <p className="text-[11px] text-[#555] mt-0.5">No pending approvals right now</p>
            </div>
          ) : (
            pendingTasks.map((task) => {
              const pri = PRI_COLORS[task.priority] || PRI_COLORS.Medium;
              return (
                <button
                  key={`${task.campaignId}-${task.approvalKey}`}
                  onClick={() => {
                    const camp = campaigns.find((c) => c.id === task.campaignId);
                    if (camp && onSelect) onSelect(camp);
                  }}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[#1e1e1e] transition-colors text-left group"
                >
                  {/* Status indicator */}
                  <div className="w-2 h-2 rounded-full bg-[#fbbf24] shrink-0 animate-pulse" />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-medium text-[#ccc] group-hover:text-[#ededed] transition-colors truncate">
                        {task.approvalLabel}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] text-[#666] truncate">{task.campaignName}</span>
                      <span className="text-[10px] text-[#333]">&middot;</span>
                      <span className="text-[10px]" style={{ color: task.stage?.hex || '#666' }}>{task.stage?.label}</span>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className="text-[9px] font-semibold px-1.5 py-0.5 rounded border"
                      style={{ backgroundColor: pri.bg, borderColor: pri.border, color: pri.text }}
                    >
                      {task.priority}
                    </span>
                    <span className="text-[10px] text-[#555]">{task.days}d</span>
                    <I n="chevR" s={12} c="text-[#333] group-hover:text-[#666] transition-colors" />
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
