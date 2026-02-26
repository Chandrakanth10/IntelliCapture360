import { useMemo } from 'react';
import { Card, CURRENT_USER, I, STAGES, STAGE_APPROVALS } from '../shared/campaignShared';

const PRI_COLORS = {
  High: { bg: 'rgba(248, 113, 113, 0.12)', border: 'rgba(248, 113, 113, 0.28)', text: '#dc2626' },
  Medium: { bg: 'rgba(251, 191, 36, 0.14)', border: 'rgba(251, 191, 36, 0.3)', text: '#d97706' },
  Low: { bg: 'rgba(56, 189, 248, 0.12)', border: 'rgba(56, 189, 248, 0.28)', text: '#0369a1' },
};

const STAT_ICONS = {
  total: { bg: 'rgba(var(--sb-accent-rgb),0.14)', text: 'var(--sb-accent)', icon: 'layers' },
  active: { bg: 'rgba(167, 139, 250, 0.14)', text: '#8b5cf6', icon: 'bar' },
  pending: { bg: 'rgba(251, 191, 36, 0.16)', text: '#d97706', icon: 'clock' },
  live: { bg: 'rgba(var(--sb-success-rgb),0.16)', text: 'var(--sb-success-soft-text)', icon: 'flag' },
};

const Dashboard = ({ campaigns, approvals = {}, onSelect }) => {
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
    { key: 'total', label: 'Total Campaigns', value: total, trend: '+12%', up: true },
    { key: 'active', label: 'Active', value: active, trend: '+3', up: true },
    { key: 'pending', label: 'Pending Review', value: pending, trend: '-2', up: false },
    { key: 'live', label: 'Live', value: live, trend: 'Stable', up: null },
  ];

  return (
    <div className="space-y-5 anim-fade anim-stagger">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight text-[var(--sb-text-strong)]">Dashboard</h1>
        <p className="text-[13px] text-[var(--sb-muted)] mt-1.5">
          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} &middot; {total} campaigns
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {stats.map((s) => {
          const icon = STAT_ICONS[s.key];
          return (
            <Card key={s.label} className="!p-0">
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-[var(--sb-muted)] uppercase tracking-[0.12em]">{s.label}</p>
                    <p className="text-[32px] leading-none font-semibold text-[var(--sb-text-strong)] mt-2.5">{s.value}</p>
                  </div>
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center border"
                    style={{ background: icon.bg, color: icon.text, borderColor: 'color-mix(in srgb, currentColor 26%, transparent)' }}
                  >
                    <I n={icon.icon} s={14} />
                  </div>
                </div>
                {s.up !== null && (
                  <p className={`text-[11px] mt-2 font-medium ${s.up ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {s.trend} vs last quarter
                  </p>
                )}
                {s.up === null && <p className="text-[11px] mt-2 text-[var(--sb-muted-soft)]">{s.trend}</p>}
              </div>
            </Card>
          );
        })}
      </div>

      <Card title="Pipeline" icon="bar" desc="Stage distribution across active campaigns">
        <div className="flex rounded-lg overflow-hidden h-11 border border-[var(--sb-border)] bg-[var(--sb-panel-2)]">
          {STAGES.map((s) => {
            const cnt = counts[s.key] || 0;
            if (!cnt) return null;
            return (
              <div
                key={s.key}
                className={`${s.color} flex items-center justify-center relative group`}
                style={{ width: `${Math.max((cnt / total) * 100, 8)}%` }}
              >
                <span className="text-[11px] font-bold text-white">{cnt}</span>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[11px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20 border bg-[var(--sb-panel)] border-[var(--sb-border)] text-[var(--sb-text)] shadow-md">
                  {s.label}: {cnt}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex mt-3 gap-3 flex-wrap justify-center">
          {STAGES.map((s) => (
            <div key={s.key} className="flex items-center gap-1.5 text-[11px] text-[var(--sb-muted)]">
              <div className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
              {s.label}
            </div>
          ))}
        </div>
      </Card>

      <div
        className="rounded-xl border overflow-hidden"
        style={{ background: 'var(--sb-panel)', borderColor: 'var(--sb-border-soft)', boxShadow: 'var(--sb-shadow-sm)' }}
      >
        <div className="px-4 py-3.5 border-b flex items-center justify-between bg-[var(--sb-panel-2)]" style={{ borderColor: 'var(--sb-border-soft)' }}>
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--sb-panel)', borderColor: 'var(--sb-border)' }}
            >
              <I n="clock" s={13} c="text-[var(--sb-muted)]" />
            </div>
            <div>
              <h3 className="text-[13px] font-semibold text-[var(--sb-text-strong)] leading-tight">My Pending Approvals</h3>
              <p className="text-[11px] text-[var(--sb-muted)] mt-0.5">{pendingTasks.length} item{pendingTasks.length !== 1 ? 's' : ''} awaiting your action</p>
            </div>
          </div>
          {pendingTasks.length > 0 && (
            <span
              className="text-[11px] font-semibold px-2 py-1 rounded-full border text-[var(--sb-muted)]"
              style={{ background: 'var(--sb-panel)', borderColor: 'var(--sb-border)' }}
            >
              {pendingTasks.length}
            </span>
          )}
        </div>

        {pendingTasks.length === 0 ? (
          <div className="py-10 text-center">
            <I n="check" s={24} c="text-[var(--sb-accent)] mx-auto mb-2" />
            <p className="text-[13px] font-medium text-[var(--sb-text)]">All caught up</p>
            <p className="text-[11px] text-[var(--sb-muted)] mt-0.5">No pending approvals right now</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--sb-border-soft)]">
            {pendingTasks.map((task) => {
              const pri = PRI_COLORS[task.priority] || PRI_COLORS.Medium;
              return (
                <button
                  key={`${task.campaignId}-${task.approvalKey}`}
                  onClick={() => {
                    const camp = campaigns.find((c) => c.id === task.campaignId);
                    if (camp && onSelect) onSelect(camp);
                  }}
                  className="w-full px-4 py-3.5 flex items-center gap-3 transition-colors text-left group hover:bg-[var(--sb-panel-2)]"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--sb-accent)] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-medium text-[var(--sb-text)] truncate">{task.approvalLabel}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[11px] text-[var(--sb-muted)] truncate">{task.campaignName}</span>
                      <span className="text-[11px] text-[var(--sb-muted-soft)]">&middot;</span>
                      <span className="text-[11px]" style={{ color: task.stage?.hex || 'var(--sb-muted-soft)' }}>{task.stage?.label}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className="text-[11px] font-semibold px-1.5 py-0.5 rounded border"
                      style={{ backgroundColor: pri.bg, borderColor: pri.border, color: pri.text }}
                    >
                      {task.priority}
                    </span>
                    <span className="text-[11px] text-[var(--sb-muted)]">{task.days}d</span>
                    <I n="chevR" s={12} c="text-[var(--sb-muted-soft)]" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
