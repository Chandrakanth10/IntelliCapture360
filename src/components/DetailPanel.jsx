import { useEffect, useState } from 'react';
import { I, STAGES } from '../shared/campaignShared';

const fmtTime = (iso) => {
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  const mon = d.toLocaleString('en-US', { month: 'short' });
  const day = d.getDate();
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${mon} ${day}, ${h12}:${m} ${ampm}`;
};

const PRI = {
  High: { bg: '#3b1520', border: '#5c2030', text: '#f87171' },
  Medium: { bg: '#3b2e10', border: '#5c4a18', text: '#fbbf24' },
  Low: { bg: '#0f2d3d', border: '#164050', text: '#38bdf8' },
};

const AI_SUM = {
  1: 'High-impact Q1 pantry promotion targeting Gold & Platinum loyalty members across 4 banners. Creative assets being finalized — hero banner due Friday. $2.4M revenue target, on track for Mar 15 launch.',
  2: 'Basketball-themed promo with game-day snack bundles. Mid-priority in Planning phase across 2 banners. $850K target with strong digital channel mix. 5 days invested.',
  3: 'Seasonal organic produce push in Execution — nearly launch-ready. $1.8M target across 3 banners with farm-to-table creative. Strong health-conscious audience alignment.',
  6: 'Largest pipeline campaign at $3.1M. Full omnichannel BBQ activation across 4 banners with custom Paid Media and Circular leads. In Strategy phase — video and sampling assets in production.',
  8: 'Digital coupon blitz currently Live — 10 days of strong momentum. App downloads up 18%. Dual targets: $950K revenue + 120K installs. Push cadence doubled this week.',
  14: 'Artisan deli launch combining in-store sampling with digital. $1.1M + 15K sampling interactions targeted. Planograms ready, video in final production.',
};

const genAiSum = (c) => {
  const chN = (c.ch || []).length;
  const bN = (c.banners || []).length;
  return `${c.pri}-priority ${c.ct.toLowerCase()} campaign across ${bN} banner${bN !== 1 ? 's' : ''} with ${chN} channel${chN !== 1 ? 's' : ''}. ${c.roi} ${c.roiT.toLowerCase()} target. ${c.days}d in stage — ${c.status === 'On Track' || c.status === 'Live' ? 'progressing well' : 'needs attention'}.`;
};

const DetailPanel = ({ camp, onClose, comments = [], onAddComment, onViewDetail }) => {
  const [commentText, setCommentText] = useState('');
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', h); document.body.style.overflow = ''; };
  }, [onClose]);

  if (!camp) return null;
  const si = STAGES.findIndex((s) => s.key === camp.stage);
  const stg = STAGES[si];
  const pri = PRI[camp.pri] || PRI.Medium;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-[2px] anim-backdrop" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 w-[600px] bg-[#161616] border-l border-[#2a2a2a] z-50 anim-slide-r overflow-y-auto scrollbar-thin">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#161616] border-b border-[#2a2a2a] px-5 py-3.5 flex items-center justify-between">
          <h2 className="text-[14px] font-semibold text-[#f8f8f8] truncate pr-4">{camp.name}</h2>
          <div className="flex items-center gap-1 shrink-0">
            {onViewDetail && (
              <button onClick={onViewDetail} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium text-[#999] hover:text-[#ededed] hover:bg-[#252525] transition-colors">
                <I n="eye" s={12} />
                View campaign in detail
              </button>
            )}
            <button onClick={onClose} className="p-1.5 hover:bg-[#252525] rounded-md transition-colors text-[#777] hover:text-[#ededed]">
              <I n="x" s={14} />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Status row */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-[10px] font-semibold px-2 py-1 rounded border"
              style={{ backgroundColor: pri.bg, borderColor: pri.border, color: pri.text }}
            >
              {camp.pri}
            </span>
            <span
              className="text-[10px] font-semibold px-2 py-1 rounded border"
              style={{ backgroundColor: stg.hex + '18', borderColor: stg.hex + '30', color: stg.hex }}
            >
              {stg.label}
            </span>
            {camp.status !== 'On Track' && (
              <span className="text-[10px] font-medium px-2 py-1 rounded bg-[#1e1e1e] border border-[#2e2e2e] text-[#999]">
                {camp.status}
              </span>
            )}
            <span className="text-[11px] text-[#555] ml-auto">{camp.days}d in stage</span>
          </div>

          {/* AI Summary */}
          <div className="rounded-lg overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a1a2e, #161625)', border: '1px solid #2a2a3a' }}>
            <div className="px-3.5 py-2.5 flex items-center gap-2" style={{ borderBottom: '1px solid #2a2a3a' }}>
              <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #a78bfa20, #f472b620)' }}>
                <I n="sparkle" s={11} c="text-[#a78bfa]" />
              </div>
              <span className="text-[10px] font-semibold text-[#a78bfa] uppercase tracking-wider">AI Summary</span>
            </div>
            <div className="px-3.5 py-3">
              <p className="text-[12px] text-[#b0b0c0] leading-[1.7]">{AI_SUM[camp.id] || genAiSum(camp)}</p>
            </div>
          </div>

          {/* Description */}
          <p className="text-[12px] text-[#999] leading-relaxed">{camp.desc}</p>

          {/* Pipeline */}
          <div>
            <h3 className="text-[11px] font-medium text-[#555] uppercase tracking-wider mb-3">Pipeline</h3>
            <div className="relative">
              {/* Track + progress lines — centered on the 20px dots */}
              <div
                className="absolute h-[2px] bg-[#2a2a2a]"
                style={{ top: 9, left: `calc(100% / ${STAGES.length * 2})`, right: `calc(100% / ${STAGES.length * 2})` }}
              >
                <div
                  className="absolute inset-y-0 left-0 bg-[#3ECF8E]"
                  style={{ width: si === 0 ? 0 : `${(si / (STAGES.length - 1)) * 100}%` }}
                />
              </div>
              {/* Dots + labels */}
              <div className="relative flex">
                {STAGES.map((s, i) => {
                  const done = i < si;
                  const current = i === si;
                  return (
                    <div key={s.key} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: done ? '#3ECF8E' : current ? stg.hex : '#161616',
                          border: !done && !current ? '2px solid #333' : current ? `2px solid ${stg.hex}` : 'none',
                          boxShadow: current ? `0 0 8px ${stg.hex}40` : 'none',
                        }}
                      >
                        {done ? (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0a1f15" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        ) : (
                          <span className={`font-bold text-[8px] ${current ? 'text-white' : 'text-[#555]'}`}>{i + 1}</span>
                        )}
                      </div>
                      <span className={`text-[9px] mt-2 text-center leading-tight ${
                        current ? 'font-semibold text-[#ededed]' : done ? 'text-[#3ECF8E]' : 'text-[#444]'
                      }`}>
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="border-t border-[#222]" />

          {/* Details */}
          <div>
            <h3 className="text-[11px] font-medium text-[#555] uppercase tracking-wider mb-3">Details</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {[
                ['Business Unit', camp.bu],
                ['ROI', camp.roi],
                ['Launch Date', camp.date],
                ['Quarter', `${camp.q} ${camp.p} ${camp.w}`],
                ['Requested By', camp.by.n],
                ['Team', camp.mr],
                ['Representative', camp.rep],
                ['Type', camp.ct],
              ].map(([k, v]) => (
                <div key={k}>
                  <span className="text-[10px] text-[#555] uppercase tracking-wide">{k}</span>
                  <p className="text-[12px] font-medium text-[#ccc] mt-0.5">{v}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-[#222]" />

          {/* Banners & Channels */}
          <div>
            <h3 className="text-[11px] font-medium text-[#555] uppercase tracking-wider mb-3">Banners</h3>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {(camp.banners || []).map((b) => (
                <span key={b} className="text-[11px] font-medium px-2 py-1 rounded bg-[#3ECF8E12] border border-[#3ECF8E25] text-[#3ECF8E]">
                  {b}
                </span>
              ))}
            </div>
            <h3 className="text-[11px] font-medium text-[#555] uppercase tracking-wider mb-3">Channels</h3>
            <div className="flex flex-wrap gap-1.5">
              {(camp.ch || []).map((c) => (
                <span key={c} className="text-[11px] px-2 py-1 rounded bg-[#1e1e1e] border border-[#2e2e2e] text-[#999]">
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-[#222]" />

          {/* Audience */}
          {camp.aud && (
            <>
              <div>
                <h3 className="text-[11px] font-medium text-[#555] uppercase tracking-wider mb-2">Target Audience</h3>
                <p className="text-[12px] text-[#999] leading-relaxed">{camp.aud}</p>
              </div>
              <div className="border-t border-[#222]" />
            </>
          )}

          {/* Activity */}
          <div>
            <h3 className="text-[11px] font-medium text-[#555] uppercase tracking-wider mb-3">Activity</h3>
            {(() => {
              const events = [
                { a: `Moved to ${stg.label}`, w: camp.rep, d: '2026-02-18', icon: 'layers', color: stg.hex },
                { a: `Priority set to ${camp.pri}`, w: camp.rep, d: '2026-02-15', icon: 'flag', color: camp.pri === 'High' ? '#f87171' : camp.pri === 'Medium' ? '#fbbf24' : '#38bdf8' },
                { a: `Assigned to ${camp.rep}`, w: 'System', d: camp.created, icon: 'user', color: '#3ECF8E' },
                { a: 'Campaign submitted', w: camp.by.n, d: camp.created, icon: 'send', color: '#60a5fa' },
              ];
              return (
                <div className="relative ml-3">
                  <div className="absolute left-0 top-2 bottom-2 w-px bg-[#2a2a2a]" />
                  <div className="space-y-4">
                    {events.map((l, i) => (
                      <div key={i} className="flex items-start gap-3 relative">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 -ml-3"
                          style={{ background: `linear-gradient(${l.color}18, ${l.color}18), #161616`, border: `1px solid ${l.color}30`, color: l.color }}
                        >
                          <I n={l.icon} s={11} />
                        </div>
                        <div className="pt-0.5">
                          <p className="text-[12px] text-[#ccc]">{l.a}</p>
                          <p className="text-[11px] text-[#555] mt-0.5">
                            {l.w} <span className="text-[#333]">·</span> {l.d}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>

          <div className="border-t border-[#222]" />

          {/* Comments */}
          <div>
            <h3 className="text-[11px] font-medium text-[#555] uppercase tracking-wider mb-3">Comments</h3>
            {comments.length === 0 ? (
              <div className="py-6 text-center">
                <I n="send" s={20} c="text-[#333] mx-auto mb-2" />
                <p className="text-[12px] text-[#555]">No comments yet</p>
                <p className="text-[11px] text-[#444] mt-0.5">Be the first to add one below</p>
              </div>
            ) : (
              <div className="relative ml-3 mb-4">
                <div className="absolute left-0 top-2 bottom-2 w-px bg-[#2a2a2a]" />
                <div className="space-y-4">
                  {comments.map((c) => (
                    <div key={c.id} className="flex items-start gap-3 relative">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 -ml-3 text-[9px] font-bold"
                        style={{ background: 'linear-gradient(#3ECF8E18, #3ECF8E18), #161616', border: '1px solid #3ECF8E30', color: '#3ECF8E' }}
                      >
                        {c.author.split(' ').map((w) => w[0]).join('')}
                      </div>
                      <div className="pt-0.5 min-w-0">
                        <p className="text-[11px] text-[#555]">
                          <span className="text-[#999] font-medium">{c.author}</span> <span className="text-[#333]">·</span> {fmtTime(c.date)}
                        </p>
                        <p className="text-[12px] text-[#ccc] mt-0.5 leading-relaxed">{c.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-3">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && commentText.trim()) {
                    e.preventDefault();
                    onAddComment(commentText.trim());
                    setCommentText('');
                  }
                }}
                placeholder="Add a comment..."
                rows={2}
                className="w-full bg-[#1e1e1e] border border-[#2a2a2a] text-[#ccc] text-[12px] rounded-md px-3 py-2 resize-none placeholder-[#444] focus:outline-none focus:border-[#3ECF8E50] focus:shadow-[0_0_0_2px_rgba(62,207,142,0.12)] transition-colors"
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => {
                    if (commentText.trim()) {
                      onAddComment(commentText.trim());
                      setCommentText('');
                    }
                  }}
                  disabled={!commentText.trim()}
                  className="px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors"
                  style={{
                    backgroundColor: commentText.trim() ? '#3ECF8E' : '#1e1e1e',
                    color: commentText.trim() ? '#0a1f15' : '#555',
                    cursor: commentText.trim() ? 'pointer' : 'default',
                  }}
                  onMouseEnter={(e) => { if (commentText.trim()) e.currentTarget.style.backgroundColor = '#38b97e'; }}
                  onMouseLeave={(e) => { if (commentText.trim()) e.currentTarget.style.backgroundColor = '#3ECF8E'; }}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailPanel;
