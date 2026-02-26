import { I, STAGES } from '../shared/campaignShared';

const PRI = {
  High: { bg: 'rgba(248, 113, 113, 0.12)', border: 'rgba(248, 113, 113, 0.28)', text: '#dc2626' },
  Medium: { bg: 'rgba(251, 191, 36, 0.14)', border: 'rgba(251, 191, 36, 0.3)', text: '#d97706' },
  Low: { bg: 'rgba(56, 189, 248, 0.12)', border: 'rgba(56, 189, 248, 0.28)', text: '#0369a1' },
};

const STATUS_BADGE = {
  'Pending Info': { bg: 'rgba(251, 191, 36, 0.14)', border: 'rgba(251, 191, 36, 0.3)', text: '#d97706', label: 'Needs Info' },
  Live: { bg: 'rgba(var(--sb-success-rgb),0.16)', border: 'rgba(var(--sb-success-rgb),0.28)', text: 'var(--sb-success-soft-text)', label: 'Live' },
  New: { bg: 'rgba(129, 140, 248, 0.14)', border: 'rgba(129, 140, 248, 0.3)', text: '#4f46e5', label: 'New' },
};

const Tracker = ({ campaigns, onSelect }) => (
  <div className="anim-fade h-[calc(100vh-148px)] flex flex-col">
    <div className="mb-4 shrink-0">
      <h1 className="text-[22px] font-semibold tracking-tight text-[var(--sb-text-strong)]">Campaign Tracker</h1>
      <p className="text-[13px] text-[var(--sb-muted)]">
        {campaigns.length} campaigns across {STAGES.length} stages
      </p>
    </div>

    <div className="flex-1 min-h-0 flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
      {STAGES.map((stg) => {
        const items = campaigns.filter((c) => c.stage === stg.key);
        return (
          <div key={stg.key} className="min-w-[280px] w-[280px] flex-shrink-0 flex flex-col min-h-0">
            <div className="flex items-center gap-2 mb-3 px-1 shrink-0">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: stg.hex }} />
              <span className="text-[13px] font-semibold text-[var(--sb-text)]">{stg.label}</span>
              <span
                className="text-[11px] px-1.5 py-0.5 rounded font-semibold ml-auto"
                style={{ backgroundColor: `${stg.hex}18`, color: stg.hex, border: `1px solid ${stg.hex}30` }}
              >
                {items.length}
              </span>
            </div>

            <div
              className="flex-1 min-h-0 rounded-xl overflow-hidden border flex flex-col"
              style={{ background: 'var(--sb-bg-soft)', borderColor: 'var(--sb-border)', boxShadow: 'var(--sb-shadow-sm)' }}
            >
              <div className="h-[3px] shrink-0" style={{ backgroundColor: `${stg.hex}66` }} />
              <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5 scrollbar-thin">
                {items.map((c) => {
                  const pri = PRI[c.pri] || PRI.Medium;
                  const statusBadge = STATUS_BADGE[c.status];
                  return (
                    <div
                      key={c.id}
                      onClick={() => onSelect(c)}
                      className="p-3.5 rounded-lg border cursor-pointer transition-all group hover:bg-[var(--sb-panel-2)]"
                      style={{ background: 'var(--sb-panel)', borderColor: 'var(--sb-border-soft)' }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-[13px] font-medium text-[var(--sb-text)] leading-snug">{c.name}</p>
                        {statusBadge && (
                          <span
                            className="text-[11px] font-semibold px-1.5 py-0.5 rounded border shrink-0 mt-0.5"
                            style={{ backgroundColor: statusBadge.bg, borderColor: statusBadge.border, color: statusBadge.text }}
                          >
                            {statusBadge.label}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[12px] text-[var(--sb-muted)]">{c.bu}</span>
                        <span className="text-[var(--sb-muted-soft)]">·</span>
                        <span className="text-[12px] text-[var(--sb-muted)] flex items-center gap-1">
                          <I n="clock" s={10} />
                          {c.days}d
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-2.5 pt-2 border-t" style={{ borderColor: 'var(--sb-border-soft)' }}>
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: `${stg.hex}20` }}>
                            <span className="text-[11px] font-bold" style={{ color: stg.hex }}>
                              {c.rep.split(' ').map((x) => x[0]).join('')}
                            </span>
                          </div>
                          <span className="text-[12px] text-[var(--sb-muted)]">{c.rep}</span>
                        </div>
                        <span
                          className="text-[11px] font-medium px-1.5 py-0.5 rounded border"
                          style={{ backgroundColor: pri.bg, borderColor: pri.border, color: pri.text }}
                        >
                          {c.pri}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {items.length === 0 && (
                  <div className="p-6 text-center text-[12px] text-[var(--sb-muted-soft)] border border-dashed border-[var(--sb-border)] rounded-lg">
                    No campaigns
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default Tracker;
