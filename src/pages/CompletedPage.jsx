import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { I } from '../shared/campaignShared';
import { BriefingContent, generateBriefing } from './CampaignDetailPage';

/* ═══ BRIEFING MODAL ═══ */
const BriefingModal = ({ camp, briefing, onClose }) => {
  const hasUpload = briefing?.type === 'uploaded';
  const aiBrief = generateBriefing(camp);

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', h); document.body.style.overflow = ''; };
  }, [onClose]);

  return createPortal(
    <>
      <div className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-[3px] anim-backdrop" onClick={onClose} />
      <div className="fixed inset-4 sm:inset-8 lg:inset-y-8 lg:inset-x-[12%] z-[61] flex flex-col bg-[var(--sb-bg-soft)] border border-[var(--sb-border-soft)] rounded-xl shadow-2xl anim-scale overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-[var(--sb-border-soft)] bg-[var(--sb-panel-3)] shrink-0">
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
            style={{
              background: hasUpload ? 'rgba(var(--sb-accent-rgb),0.15)' : 'linear-gradient(135deg, #a78bfa20, rgba(var(--sb-accent-rgb),0.20))',
              border: `1px solid ${hasUpload ? 'rgba(var(--sb-accent-rgb),0.25)' : '#a78bfa25'}`,
            }}
          >
            <I n={hasUpload ? 'file' : 'sparkle'} s={14} c={hasUpload ? 'text-[var(--sb-accent)]' : 'text-[#a78bfa]'} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-[var(--sb-text)] truncate">
              {hasUpload ? briefing.fileName : `${camp.name} — AI-Generated Brief`}
            </p>
            <p className="text-[11px] text-[var(--sb-muted-soft)]">
              {hasUpload
                ? `Uploaded by ${briefing.uploadedBy} \u00B7 ${briefing.uploadedDate}`
                : `Auto-generated from campaign data \u00B7 ${camp.ch?.length || 0} channels analyzed`}
            </p>
          </div>
          <span
            className="text-[11px] font-medium px-2 py-1 rounded-full shrink-0"
            style={{
              background: hasUpload ? 'rgba(var(--sb-accent-rgb),0.15)' : '#a78bfa15',
              border: `1px solid ${hasUpload ? 'rgba(var(--sb-accent-rgb),0.30)' : '#a78bfa30'}`,
              color: hasUpload ? 'var(--sb-accent)' : '#a78bfa',
            }}
          >
            {hasUpload ? 'Team Upload' : 'AI Generated'}
          </span>
          <button onClick={onClose} className="p-1.5 hover:bg-[var(--sb-panel-2)] rounded-md transition-colors text-[var(--sb-muted)] hover:text-[var(--sb-text)] shrink-0 ml-1">
            <I n="x" s={14} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-5">
          {hasUpload ? (
            /* ─── Uploaded file preview ─── */
            <div className="space-y-5">
              {/* File info card */}
              <div className="flex items-center gap-4 px-5 py-4 rounded-lg bg-[var(--sb-panel)] border border-[var(--sb-border-soft)]">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(var(--sb-accent-rgb),0.15)', border: '1px solid rgba(var(--sb-accent-rgb),0.25)' }}>
                  <I n="file" s={22} c="text-[var(--sb-accent)]" />
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-medium text-[var(--sb-text)]">{briefing.fileName}</p>
                  <p className="text-[12px] text-[var(--sb-muted-soft)] mt-0.5">PDF Document &middot; Uploaded by {briefing.uploadedBy} &middot; {briefing.uploadedDate}</p>
                </div>
              </div>

              {/* Mock PDF pages */}
              <div className="space-y-3">
                {[1, 2, 3].map((p) => (
                  <div key={p} className="bg-[var(--sb-panel-3)] rounded-md border border-[var(--sb-border-soft)] p-5">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[11px] text-[var(--sb-muted-soft)]">Page {p}</span>
                      <span className="text-[11px] text-[var(--sb-muted)]">{briefing.fileName}</span>
                    </div>
                    <div className="space-y-2.5">
                      {p === 1 && <div className="h-5 w-3/5 rounded bg-[var(--sb-panel-2)]" />}
                      <div className="h-3 w-full rounded bg-[var(--sb-panel)]" />
                      <div className="h-3 w-full rounded bg-[var(--sb-panel)]" />
                      <div className="h-3 w-4/5 rounded bg-[var(--sb-panel)]" />
                      {p === 1 && (
                        <div className="h-24 w-full rounded bg-[var(--sb-panel-2)] mt-3 flex items-center justify-center">
                          <span className="text-[11px] text-[var(--sb-muted-soft)]">[ Executive Summary &middot; Campaign Overview ]</span>
                        </div>
                      )}
                      {p === 2 && (
                        <div className="grid grid-cols-4 gap-2 mt-3">
                          {['Impressions', 'CTR', 'Conversions', 'ROI'].map((m) => (
                            <div key={m} className="h-16 rounded bg-[var(--sb-panel-2)] flex items-center justify-center">
                              <span className="text-[11px] text-[var(--sb-muted-soft)]">{m}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {p === 3 && (
                        <div className="space-y-2 mt-3">
                          {[1, 2, 3].map((r) => (
                            <div key={r} className="flex gap-3">
                              <div className="h-3 w-24 rounded bg-[var(--sb-panel-2)]" />
                              <div className="h-3 flex-1 rounded bg-[var(--sb-panel)]" />
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="h-3 w-full rounded bg-[var(--sb-panel)]" />
                      <div className="h-3 w-3/4 rounded bg-[var(--sb-panel)]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* ─── AI-generated briefing ─── */
            <div className="rounded-lg p-5" style={{ background: 'var(--sb-accent-soft)', border: '1px solid color-mix(in srgb, var(--sb-accent) 20%, transparent)' }}>
              <BriefingContent brief={aiBrief} camp={camp} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--sb-border-soft)] bg-[var(--sb-panel-3)] shrink-0">
          <span className="text-[11px] text-[var(--sb-muted-soft)]">
            {hasUpload ? `${briefing.fileName} \u00B7 PDF Document` : `AI-generated briefing for ${camp.name}`}
          </span>
          <button onClick={onClose} className="px-3.5 py-1.5 rounded-md text-[11px] font-medium bg-[var(--sb-panel-2)] text-[var(--sb-text)] hover:bg-[var(--sb-panel-2)] border border-[var(--sb-border)] transition-colors">
            Close
          </button>
        </div>
      </div>
    </>,
    document.body,
  );
};

/* ═══ COMPLETED PAGE ═══ */
const CompletedPage = ({ campaigns = [], briefings = {}, onSelect }) => {
  const liveCampaigns = campaigns.filter((c) => c.stage === 'live');
  const [modalCamp, setModalCamp] = useState(null);
  const [modalType, setModalType] = useState(null); // 'uploaded' | 'ai'

  return (
    <div className="anim-fade">
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold tracking-tight text-[var(--sb-text-strong)] mb-1">Completed Campaigns</h1>
        <p className="text-[13px] text-[var(--sb-muted-soft)]">
          {liveCampaigns.length} campaign{liveCampaigns.length !== 1 ? 's' : ''} currently live
        </p>
      </div>

      {liveCampaigns.length === 0 ? (
        <div className="py-20 text-center rounded-lg border border-[var(--sb-border-soft)] bg-[var(--sb-bg-soft)]">
          <I n="check" s={32} c="text-[var(--sb-muted-soft)] mx-auto mb-3" />
          <p className="text-[14px] text-[var(--sb-muted)]">No live campaigns</p>
          <p className="text-[12px] text-[var(--sb-muted-soft)] mt-1">Campaigns that reach the Live stage will appear here</p>
        </div>
      ) : (
        <div className="rounded-xl border border-[var(--sb-border-soft)] bg-[var(--sb-bg-soft)] overflow-hidden" style={{ boxShadow: 'var(--sb-shadow-sm)' }}>
          {/* Header */}
          <div className="grid grid-cols-[1fr_120px_100px_100px_150px_140px_32px] gap-4 px-5 py-3 border-b border-[var(--sb-border-soft)] bg-[var(--sb-panel-3)]">
            <span className="text-[11px] font-semibold text-[var(--sb-muted-soft)] uppercase tracking-wider">Campaign</span>
            <span className="text-[11px] font-semibold text-[var(--sb-muted-soft)] uppercase tracking-wider">Business Unit</span>
            <span className="text-[11px] font-semibold text-[var(--sb-muted-soft)] uppercase tracking-wider">Created</span>
            <span className="text-[11px] font-semibold text-[var(--sb-muted-soft)] uppercase tracking-wider">Launch Date</span>
            <span className="text-[11px] font-semibold text-[var(--sb-muted-soft)] uppercase tracking-wider">Final Brief</span>
            <span className="text-[11px] font-semibold text-[var(--sb-muted-soft)] uppercase tracking-wider">AI Brief</span>
            <span />
          </div>

          {/* Rows */}
          <div className="anim-stagger">
          {liveCampaigns.map((camp) => {
            const briefing = briefings[camp.id];
            const hasUpload = briefing?.type === 'uploaded';

            return (
              <div
                key={camp.id}
                onClick={() => onSelect(camp.id)}
                className="grid grid-cols-[1fr_120px_100px_100px_150px_140px_32px] gap-4 px-5 py-3.5 border-b border-[var(--sb-border-soft)] last:border-b-0 hover:bg-[var(--sb-panel)] transition-colors text-left group"
              >
                <div className="min-w-0 cursor-pointer">
                  <p className="text-[13px] font-medium text-[var(--sb-text)] truncate group-hover:text-[var(--sb-text-strong)] transition-colors">
                    {camp.name}
                  </p>
                  <p className="text-[12px] text-[var(--sb-muted-soft)] truncate mt-0.5">{camp.desc}</p>
                </div>
                <span className="text-[12px] text-[var(--sb-muted)] self-center">{camp.bu}</span>
                <span className="text-[12px] text-[var(--sb-muted)] self-center">{camp.created}</span>
                <span className="text-[12px] text-[var(--sb-muted)] self-center">{camp.date}</span>
                <div className="self-center">
                  {hasUpload ? (
                    <button
                      onClick={(e) => { e.stopPropagation(); setModalCamp(camp); setModalType('uploaded'); }}
                      className="badge-click inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full bg-[rgba(var(--sb-accent-rgb),0.15)] border border-[rgba(var(--sb-accent-rgb),0.30)] text-[var(--sb-accent)] hover:bg-[rgba(var(--sb-accent-rgb),0.25)] hover:border-[rgba(var(--sb-accent-rgb),0.50)] transition-colors"
                    >
                      <I n="check" s={10} />
                      Final Brief
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-[var(--sb-muted-soft)] italic">
                      Not Ready
                    </span>
                  )}
                </div>
                <div className="self-center">
                  <button
                    onClick={(e) => { e.stopPropagation(); setModalCamp(camp); setModalType('ai'); }}
                    className="badge-click inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#a78bfa15] border border-[#a78bfa30] text-[#a78bfa] hover:bg-[#a78bfa25] hover:border-[#a78bfa50] transition-colors"
                  >
                    <I n="sparkle" s={10} />
                    AI Generated
                  </button>
                </div>
                <div className="self-center flex justify-end cursor-pointer">
                  <I n="chevR" s={14} c="text-[var(--sb-muted-soft)] group-hover:text-[var(--sb-muted)] transition-colors" />
                </div>
              </div>
            );
          })}
          </div>
        </div>
      )}

      {modalCamp && (
        <BriefingModal
          camp={modalCamp}
          briefing={modalType === 'ai' ? null : briefings[modalCamp.id]}
          onClose={() => { setModalCamp(null); setModalType(null); }}
        />
      )}
    </div>
  );
};

export default CompletedPage;
