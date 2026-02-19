import { useState } from 'react';
import { I, STAGES, parseDate } from '../shared/campaignShared';

const Calendar = ({ campaigns, onSelect }) => {
  const [cur, setCur] = useState(new Date(2026, 2));
  const yr = cur.getFullYear();
  const mo = cur.getMonth();
  const firstDay = new Date(yr, mo, 1).getDay();
  const dim = new Date(yr, mo + 1, 0).getDate();
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= dim; i++) days.push(i);
  while (days.length % 7) days.push(null);
  const byDate = {};
  campaigns.forEach((c) => {
    const p = parseDate(c.date);
    const spanDays = c.span || 1;
    for (let offset = 0; offset < spanDays; offset++) {
      const d = new Date(p.y, p.m, p.d + offset);
      if (d.getMonth() === mo && d.getFullYear() === yr) {
        const dn = d.getDate();
        if (!byDate[dn]) byDate[dn] = [];
        byDate[dn].push({
          ...c,
          _pos: spanDays > 1 ? (offset === 0 ? 'start' : offset === spanDays - 1 ? 'end' : 'mid') : null,
        });
      }
    }
  });
  Object.values(byDate).forEach((arr) =>
    arr.sort((a, b) => (a._pos ? 0 : 1) - (b._pos ? 0 : 1))
  );
  const mos = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const td = new Date();
  const isToday = (d) => d && td.getDate() === d && td.getMonth() === mo && td.getFullYear() === yr;
  const cnt = new Set(Object.values(byDate).flat().map((c) => c.id)).size;
  const rows = days.length / 7;

  const goToday = () => {
    const now = new Date();
    setCur(new Date(now.getFullYear(), now.getMonth()));
  };

  return (
    <div className="anim-fade h-[calc(100vh-148px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-[15px] font-semibold text-[#f8f8f8]">Planning Calendar</h1>
            <p className="text-[12px] text-[#666]">
              {cnt} campaign{cnt !== 1 ? 's' : ''} in {mos[mo]}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={goToday}
            className="px-3 py-1.5 text-[12px] font-medium text-[#ccc] bg-[#1e1e1e] border border-[#363636] rounded-md hover:bg-[#252525] hover:text-white transition-colors"
          >
            Today
          </button>
          <div className="flex items-center bg-[#1e1e1e] border border-[#363636] rounded-md">
            <button
              onClick={() => setCur(new Date(yr, mo - 1))}
              className="p-2 hover:bg-[#2a2a2a] rounded-l-md transition-colors text-[#777] hover:text-[#ededed] border-r border-[#363636]"
            >
              <I n="chevL" s={14} />
            </button>
            <span className="text-[13px] font-semibold text-[#ededed] px-4 min-w-[150px] text-center select-none">
              {mos[mo]} {yr}
            </span>
            <button
              onClick={() => setCur(new Date(yr, mo + 1))}
              className="p-2 hover:bg-[#2a2a2a] rounded-r-md transition-colors text-[#777] hover:text-[#ededed] border-l border-[#363636]"
            >
              <I n="chevR" s={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="flex-1 min-h-0 rounded-lg border border-[#2e2e2e] bg-[#161616] overflow-hidden flex flex-col">
        {/* Day headers */}
        <div className="grid grid-cols-7 shrink-0 border-b border-[#2e2e2e]">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, idx) => (
            <div
              key={d}
              className={`px-3 py-2 text-center text-[11px] font-medium text-[#666] uppercase tracking-wider ${
                idx < 6 ? 'border-r border-[#2e2e2e]' : ''
              }`}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex-1 grid grid-cols-7" style={{ gridTemplateRows: `repeat(${rows}, 1fr)` }}>
          {days.map((day, i) => {
            const isLastRow = i >= days.length - 7;
            const isLastCol = (i + 1) % 7 === 0;
            const hasEvents = day && byDate[day]?.length > 0;
            return (
              <div
                key={i}
                className={`p-1.5 transition-colors relative overflow-visible ${
                  !isLastRow ? 'border-b border-[#222]' : ''
                } ${
                  !isLastCol ? 'border-r border-[#222]' : ''
                } ${
                  day
                    ? hasEvents
                      ? 'bg-[#1a1a1a] hover:bg-[#202020]'
                      : 'hover:bg-[#1a1a1a]'
                    : 'bg-[#131313]'
                }`}
              >
                {day && (
                  <>
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-[11px] inline-flex items-center justify-center ${
                          isToday(day)
                            ? 'bg-[#3ECF8E] text-[#0a1f15] w-6 h-6 rounded-full font-bold'
                            : hasEvents
                              ? 'text-[#ccc] font-semibold w-6 h-6'
                              : 'text-[#555] font-medium w-6 h-6'
                        }`}
                      >
                        {day}
                      </span>
                      {hasEvents && (() => {
                        const real = byDate[day].filter((c) => !c._pos || c._pos === 'start').length;
                        return real > 0 ? (
                          <span className="text-[9px] font-medium text-[#555] mr-0.5">{real}</span>
                        ) : null;
                      })()}
                    </div>
                    <div className="space-y-[3px]">
                      {(byDate[day] || []).map((c) => {
                        const stg = STAGES.find((s) => s.key === c.stage);
                        const pos = c._pos;
                        const isMulti = pos != null;
                        const roundCls = pos === 'start' ? 'rounded-l'
                          : pos === 'end' ? 'rounded-r'
                          : pos === 'mid' ? ''
                          : 'rounded';
                        const marginCls = pos === 'start' ? '-mr-[7px]'
                          : pos === 'end' ? '-ml-[7px]'
                          : pos === 'mid' ? '-mx-[7px]'
                          : '';
                        return (
                          <div
                            key={`${c.id}-${pos || 's'}`}
                            onClick={() => onSelect(c)}
                            className={`flex items-center min-h-[22px] py-[3px] cursor-pointer transition-all hover:brightness-125 ${roundCls} ${marginCls} ${pos === 'start' || !isMulti ? 'gap-1.5 px-1.5' : ''}`}
                            style={{ backgroundColor: stg.hex + '20' }}
                            title={c.name}
                          >
                            {(pos === 'start' || !isMulti) && (
                              <>
                                <span
                                  className="w-[3px] h-3 rounded-full shrink-0"
                                  style={{ backgroundColor: stg.hex }}
                                />
                                <span
                                  className="text-[10px] font-medium truncate"
                                  style={{ color: stg.hex }}
                                >
                                  {c.name}
                                </span>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {cnt === 0 && (
        <div className="mt-4 text-center py-8 bg-[#1e1e1e] rounded-lg border border-[#2e2e2e]">
          <I n="cal" s={24} c="text-[#444] mx-auto mb-2" />
          <p className="text-[13px] text-[#666]">No launches in {mos[mo]}</p>
        </div>
      )}
    </div>
  );
};

export default Calendar;
