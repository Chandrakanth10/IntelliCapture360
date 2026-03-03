import { useState } from 'react';
import { createPortal } from 'react-dom';
import { CURRENT_USER, I, STAGES, STAGE_APPROVALS } from '../../shared/campaignShared';

const getPastApproval = (camp, stageIdx) => {
  const base = new Date(camp.created);
  base.setDate(base.getDate() + stageIdx * 3);
  const mon = base.toLocaleString('en-US', { month: 'short' });
  return { date: `${mon} ${base.getDate()}` };
};

const ApprovalChecklist = ({ camp, si, stg, approvals, stageKeys, onApprove, onReject, onAdvanceStage }) => {
  const [actionModal, setActionModal] = useState(null);
  const [actionComment, setActionComment] = useState('');
  const [rejectStage, setRejectStage] = useState('');

  if (!stageKeys || stageKeys.length === 0) return null;

  // Compute overall completion across all stage keys
  const totalItems = stageKeys.reduce((sum, sk) => sum + (STAGE_APPROVALS[sk] || []).length, 0);
  const totalDone = stageKeys.reduce((sum, sk) => {
    const stageIdx = STAGES.findIndex((s) => s.key === sk);
    const items = STAGE_APPROVALS[sk] || [];
    if (stageIdx < si) return sum + items.length; // past stages are all done
    if (stageIdx === si) return sum + items.filter((a) => (approvals[camp.id] || {})[a.key]).length;
    return sum;
  }, 0);
  const overallPct = totalItems > 0 ? (totalDone / totalItems) * 100 : 0;

  // For the "Advance" button — check if ALL stage keys in this tab are fully approved
  const allStagesComplete = stageKeys.every((stageKey) => {
    const stageIdx = STAGES.findIndex((s) => s.key === stageKey);
    const current = stageIdx === si;
    const done = stageIdx < si;
    if (done) return true;
    if (!current) return false;
    const stageItems = STAGE_APPROVALS[stageKey] || [];
    const campApprovals = approvals[camp.id] || {};
    return stageItems.length > 0 && stageItems.every((a) => campApprovals[a.key]);
  });

  // Check if the last stage key in this tab is the current stage (for showing advance button)
  const lastStageKey = stageKeys[stageKeys.length - 1];
  const lastStageIdx = STAGES.findIndex((s) => s.key === lastStageKey);
  const showAdvance = lastStageIdx === si && allStagesComplete && camp.stage !== 'live' && onAdvanceStage;

  return (
    <div className="mt-6 rounded-xl border border-[var(--sb-border-soft)] bg-[var(--sb-panel)] shadow-[var(--sb-shadow-sm)] overflow-hidden">
      {/* ── Header band ── */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-[var(--sb-border-soft)]" style={{ background: 'rgba(var(--sb-accent-rgb),0.03)' }}>
        <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(var(--sb-accent-rgb),0.12)' }}>
          <I n="check" s={11} c="text-[var(--sb-accent)]" />
        </div>
        <h3 className="text-[11px] font-semibold text-[var(--sb-text-strong)] uppercase tracking-wider">Approval Checklist</h3>
        <span className="text-[10px] font-medium text-[var(--sb-muted)] bg-[var(--sb-panel-2)] border border-[var(--sb-border-soft)] rounded-full px-1.5 py-px leading-none">{totalDone}/{totalItems}</span>
        <div className="flex-1" />
        {/* Progress ring */}
        <svg width="20" height="20" viewBox="0 0 20 20" className="shrink-0 -rotate-90">
          <circle cx="10" cy="10" r="8" fill="none" stroke="var(--sb-border-soft)" strokeWidth="2" />
          <circle cx="10" cy="10" r="8" fill="none" stroke="var(--sb-accent)" strokeWidth="2" strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 8}`}
            strokeDashoffset={`${2 * Math.PI * 8 * (1 - overallPct / 100)}`}
            className="transition-all duration-500"
          />
        </svg>
      </div>

      {/* ── Body ── */}
      <div className="p-4 space-y-3">
        {stageKeys.map((stageKey) => {
          const stageIdx = STAGES.findIndex((s) => s.key === stageKey);
          const stage = STAGES[stageIdx];
          if (!stage) return null;

          const done = stageIdx < si;
          const current = stageIdx === si;
          const future = stageIdx > si;
          const stageItems = STAGE_APPROVALS[stageKey] || [];

          let doneMap = {};
          if (done) {
            stageItems.forEach((a) => {
              const info = getPastApproval(camp, stageIdx);
              doneMap[a.key] = { by: a.assignee, date: info.date };
            });
          } else if (current) {
            doneMap = { ...(approvals[camp.id] || {}) };
          }

          const doneCount = stageItems.filter((a) => doneMap[a.key]).length;
          const stageColor = done ? 'var(--sb-accent)' : current ? stg.hex : 'var(--sb-muted-soft)';
          const stagePct = stageItems.length > 0 ? (doneCount / stageItems.length) * 100 : 0;

          return (
            <div key={stageKey}>
              {/* Sub-header for multi-stage tabs */}
              {stageKeys.length > 1 && (
                <div className="flex items-center gap-2 mb-1.5 px-0.5">
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: done ? 'var(--sb-accent)' : current ? stg.hex : 'transparent',
                      border: done || current ? 'none' : '2px solid var(--sb-border)',
                    }}
                  >
                    {done ? (
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="var(--sb-accent-contrast)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    ) : (
                      <span className={`text-[8px] font-bold ${current ? 'text-white' : 'text-[var(--sb-muted-soft)]'}`}>{stageIdx + 1}</span>
                    )}
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: stageColor }}>{stage.label}</span>
                  <span className="text-[10px] font-semibold rounded-full px-1.5 py-px leading-none" style={{ color: stageColor, background: `color-mix(in srgb, ${done ? 'var(--sb-accent)' : current ? stg.hex : 'var(--sb-muted-soft)'} 15%, transparent)` }}>{doneCount}/{stageItems.length}</span>
                  <div className="flex-1 h-px ml-1 bg-[var(--sb-border-soft)]" />
                </div>
              )}

              {/* Approval items — compact table rows in a grouped container */}
              <div className="rounded-lg border border-[var(--sb-border-soft)] overflow-hidden">
                {stageItems.map((a) => {
                  const approval = doneMap[a.key];
                  const isDone = !!approval;
                  const canAct = current && !isDone && !future && a.assignee === CURRENT_USER.name;
                  const isAwaiting = !isDone && !future && current;

                  return (
                    <div
                      key={a.key}
                      className={`flex items-center gap-2.5 px-3 py-1.5 border-b border-[var(--sb-border-soft)] last:border-b-0 transition-colors ${
                        isAwaiting ? 'bg-[rgba(251,191,36,0.05)]' : ''
                      } ${future ? 'opacity-40' : ''}`}
                    >
                      {/* Checkbox */}
                      {isDone ? (
                        <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--sb-accent)' }}>
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="var(--sb-accent-contrast)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 shrink-0" style={{ borderColor: future ? 'var(--sb-border-soft)' : isAwaiting ? '#fbbf24' : 'var(--sb-border)' }} />
                      )}

                      {/* Label */}
                      <span className={`text-[12px] flex-1 min-w-0 truncate ${
                        isDone ? 'text-[var(--sb-muted)] line-through' : future ? 'text-[var(--sb-muted-soft)]' : 'text-[var(--sb-text)] font-medium'
                      }`}>{a.label}</span>

                      {/* Assignee */}
                      <span className={`text-[11px] shrink-0 hidden sm:inline ${isDone || future ? 'text-[var(--sb-muted-soft)]' : 'text-[var(--sb-muted)]'}`}>
                        {isDone ? approval.by : a.assignee}
                      </span>

                      {isDone && <span className="text-[11px] text-[var(--sb-muted-soft)] shrink-0 hidden sm:inline">{approval.date}</span>}

                      {/* Action / status */}
                      <div className="flex items-center gap-1 shrink-0">
                        {canAct ? (
                          <>
                            <button
                              onClick={() => { setActionModal({ type: 'approve', key: a.key, label: a.label }); setActionComment(''); }}
                              className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[rgba(var(--sb-accent-rgb),0.15)] text-[var(--sb-accent)] hover:bg-[rgba(var(--sb-accent-rgb),0.28)] border border-[rgba(var(--sb-accent-rgb),0.25)] transition-colors"
                            >
                              Approve
                            </button>
                            {camp.stage !== 'intake' && (
                              <button
                                onClick={() => { setActionModal({ type: 'reject', key: a.key, label: a.label }); setActionComment(''); setRejectStage(si > 0 ? STAGES[si - 1].key : ''); }}
                                className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#f8717115] text-[#f87171] hover:bg-[#f8717128] border border-[#f8717125] transition-colors"
                              >
                                Reject
                              </button>
                            )}
                          </>
                        ) : (
                          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                            isDone
                              ? 'bg-[rgba(var(--sb-accent-rgb),0.10)] text-[var(--sb-accent)]'
                              : future
                                ? 'text-[var(--sb-muted-soft)]'
                                : 'bg-[#fbbf2412] text-[#e5a91a]'
                          }`}>
                            {isDone ? 'Approved' : future ? 'Upcoming' : 'Awaiting'}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Advance to next stage button */}
      {showAdvance && (
        <div className="px-5 pb-5">
          <div className="pt-4 border-t border-[var(--sb-border-soft)]">
            <button
              onClick={() => onAdvanceStage(camp.id)}
              className="w-full py-2.5 rounded-lg text-[12px] font-semibold bg-[var(--sb-accent)] text-[var(--sb-accent-contrast)] hover:bg-[var(--sb-accent-strong)] transition-colors flex items-center justify-center gap-2"
            >
              Advance to {STAGES[si + 1]?.label || 'Next Stage'}
              <I n="chevR" s={14} c="text-[var(--sb-accent-contrast)]" />
            </button>
          </div>
        </div>
      )}

      {/* Approve / Reject Modal */}
      {actionModal && createPortal(
        <>
          <div className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-[3px] anim-backdrop" onClick={() => setActionModal(null)} />
          <div className="fixed inset-0 z-[61] flex items-center justify-center p-4">
            <div className="bg-[var(--sb-bg-soft)] border border-[var(--sb-border-soft)] rounded-xl shadow-2xl anim-scale w-full max-w-md overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--sb-border-soft)] bg-[var(--sb-panel-3)]">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center ${actionModal.type === 'approve' ? 'bg-[rgba(var(--sb-accent-rgb),0.20)]' : 'bg-[#f8717120]'}`}>
                    <I n={actionModal.type === 'approve' ? 'check' : 'x'} s={13} c={actionModal.type === 'approve' ? 'text-[var(--sb-accent)]' : 'text-[#f87171]'} />
                  </div>
                  <h3 className="text-[13px] font-semibold text-[var(--sb-text-strong)]">
                    {actionModal.type === 'approve' ? 'Approve' : 'Reject'}: {actionModal.label}
                  </h3>
                </div>
                <button onClick={() => setActionModal(null)} className="p-1.5 hover:bg-[var(--sb-panel-2)] rounded-md transition-colors text-[var(--sb-muted)] hover:text-[var(--sb-text-strong)]">
                  <I n="x" s={14} />
                </button>
              </div>

              <div className="px-5 py-4 space-y-4">
                {actionModal.type === 'reject' && (
                  <div>
                    <label className="block text-[11px] font-medium text-[var(--sb-muted)] mb-1.5">Send back to stage</label>
                    <select
                      value={rejectStage}
                      onChange={(e) => setRejectStage(e.target.value)}
                      className="w-full bg-[var(--sb-panel)] border border-[var(--sb-border-soft)] text-[var(--sb-text)] text-[13px] rounded-md px-3 py-2 focus:outline-none focus:border-[#f8717150] transition-colors"
                    >
                      {STAGES.slice(0, si).map((s) => (
                        <option key={s.key} value={s.key}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-[11px] font-medium text-[var(--sb-muted)] mb-1.5">
                    {actionModal.type === 'approve' ? 'Comment' : 'Rejection reason'}
                  </label>
                  <textarea
                    value={actionComment}
                    onChange={(e) => setActionComment(e.target.value)}
                    placeholder={actionModal.type === 'approve' ? 'Add a comment for this approval...' : 'Explain why this is being rejected...'}
                    rows={3}
                    className="w-full bg-[var(--sb-panel)] border border-[var(--sb-border-soft)] text-[var(--sb-text)] text-[13px] rounded-md px-3 py-2 resize-none placeholder-[var(--sb-muted-soft)] focus:outline-none focus:border-[rgba(var(--sb-accent-rgb),0.50)] transition-colors"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-[var(--sb-border-soft)] bg-[var(--sb-panel-3)]">
                <button
                  onClick={() => setActionModal(null)}
                  className="px-3.5 py-1.5 rounded-md text-[11px] font-medium bg-[var(--sb-panel-2)] text-[var(--sb-text)] border border-[var(--sb-border)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!actionComment.trim()) return;
                    if (actionModal.type === 'approve') {
                      onApprove(camp.id, actionModal.key, actionComment.trim());
                    } else {
                      onReject(camp.id, actionModal.key, rejectStage, actionComment.trim());
                    }
                    setActionModal(null);
                    setActionComment('');
                  }}
                  disabled={!actionComment.trim()}
                  className={`px-3.5 py-1.5 rounded-md text-[11px] font-semibold transition-colors ${
                    actionComment.trim()
                      ? actionModal.type === 'approve'
                        ? 'bg-[var(--sb-accent)] text-[var(--sb-accent-contrast)] hover:bg-[var(--sb-accent-strong)]'
                        : 'bg-[#f87171] text-white hover:bg-[#ef4444]'
                      : 'bg-[var(--sb-panel)] text-[var(--sb-muted-soft)] cursor-default'
                  }`}
                >
                  {actionModal.type === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
                </button>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
};

export default ApprovalChecklist;
