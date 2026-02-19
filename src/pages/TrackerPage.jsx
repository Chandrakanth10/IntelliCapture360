import { I, STAGES } from '../shared/campaignShared';

const PRI = {
  High: { bg: '#3b1520', border: '#5c2030', text: '#f87171' },
  Medium: { bg: '#3b2e10', border: '#5c4a18', text: '#fbbf24' },
  Low: { bg: '#0f2d3d', border: '#164050', text: '#38bdf8' },
};

const STATUS_BADGE = {
  'Pending Info': { bg: '#3b2e10', border: '#5c4a18', text: '#fbbf24', label: 'Needs Info' },
  Live: { bg: '#0f2d1e', border: '#1a4030', text: '#34d399', label: 'Live' },
  New: { bg: '#1a2040', border: '#253060', text: '#818cf8', label: 'New' },
};

const Tracker = ({ campaigns, onSelect }) => (
  <div className="anim-fade h-[calc(100vh-148px)] flex flex-col">
    <div className="mb-4 shrink-0">
      <h1 className="text-[15px] font-semibold text-[#f8f8f8]">Campaign Tracker</h1>
      <p className="text-[12px] text-[#666]">
        {campaigns.length} campaigns across {STAGES.length} stages
      </p>
    </div>

    <div className="flex-1 min-h-0 flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
      {STAGES.map((stg) => {
        const items = campaigns.filter((c) => c.stage === stg.key);
        return (
          <div key={stg.key} className="min-w-[260px] w-[260px] flex-shrink-0 flex flex-col min-h-0">
            {/* Column header */}
            <div className="flex items-center gap-2 mb-3 px-1 shrink-0">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: stg.hex }}
              />
              <span className="text-[12px] font-semibold text-[#ccc]">{stg.label}</span>
              <span
                className="text-[11px] px-1.5 py-0.5 rounded font-medium ml-auto"
                style={{ backgroundColor: stg.hex + '18', color: stg.hex }}
              >
                {items.length}
              </span>
            </div>

            {/* Column body */}
            <div className="flex-1 min-h-0 rounded-lg overflow-hidden border border-[#2a2a2a] flex flex-col">
              <div className="h-[2px] shrink-0" style={{ backgroundColor: stg.hex + '50' }} />

              <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-[#161616] scrollbar-thin">
                {items.map((c) => {
                  const pri = PRI[c.pri] || PRI.Medium;
                  const statusBadge = STATUS_BADGE[c.status];
                  return (
                    <div
                      key={c.id}
                      onClick={() => onSelect(c)}
                      className="bg-[#1e1e1e] p-3 rounded-md border border-[#2e2e2e] cursor-pointer hover:border-[#444] hover:bg-[#222] transition-all group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-[12px] font-medium text-[#ededed] leading-snug">{c.name}</p>
                        {statusBadge && (
                          <span
                            className="text-[9px] font-medium px-1.5 py-0.5 rounded border shrink-0 mt-0.5"
                            style={{ backgroundColor: statusBadge.bg, borderColor: statusBadge.border, color: statusBadge.text }}
                          >
                            {statusBadge.label}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[11px] text-[#666]">{c.bu}</span>
                        <span className="text-[#333]">·</span>
                        <span className="text-[11px] text-[#555] flex items-center gap-1">
                          <I n="clock" s={10} />
                          {c.days}d
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[#2a2a2a]">
                        <div className="flex items-center gap-1.5">
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: stg.hex + '20' }}
                          >
                            <span className="text-[8px] font-bold" style={{ color: stg.hex }}>
                              {c.rep.split(' ').map((x) => x[0]).join('')}
                            </span>
                          </div>
                          <span className="text-[11px] text-[#777]">{c.rep}</span>
                        </div>
                        <span
                          className="text-[10px] font-medium px-1.5 py-0.5 rounded border"
                          style={{ backgroundColor: pri.bg, borderColor: pri.border, color: pri.text }}
                        >
                          {c.pri}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {items.length === 0 && (
                  <div className="p-6 text-center text-[11px] text-[#444] border border-dashed border-[#2e2e2e] rounded-md">
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
