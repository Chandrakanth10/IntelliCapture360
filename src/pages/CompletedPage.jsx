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
      <div className="fixed inset-4 sm:inset-8 lg:inset-y-8 lg:inset-x-[12%] z-[61] flex flex-col bg-[#161616] border border-[#2a2a2a] rounded-xl shadow-2xl anim-scale overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-[#2a2a2a] bg-[#1a1a1a] shrink-0">
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
            style={{
              background: hasUpload ? '#3ECF8E15' : 'linear-gradient(135deg, #a78bfa20, #3ECF8E20)',
              border: `1px solid ${hasUpload ? '#3ECF8E25' : '#a78bfa25'}`,
            }}
          >
            <I n={hasUpload ? 'file' : 'sparkle'} s={14} c={hasUpload ? 'text-[#3ECF8E]' : 'text-[#a78bfa]'} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-[#ededed] truncate">
              {hasUpload ? briefing.fileName : `${camp.name} — AI-Generated Brief`}
            </p>
            <p className="text-[11px] text-[#555]">
              {hasUpload
                ? `Uploaded by ${briefing.uploadedBy} \u00B7 ${briefing.uploadedDate}`
                : `Auto-generated from campaign data \u00B7 ${camp.ch?.length || 0} channels analyzed`}
            </p>
          </div>
          <span
            className="text-[10px] font-medium px-2 py-1 rounded-full shrink-0"
            style={{
              background: hasUpload ? '#3ECF8E15' : '#a78bfa15',
              border: `1px solid ${hasUpload ? '#3ECF8E30' : '#a78bfa30'}`,
              color: hasUpload ? '#3ECF8E' : '#a78bfa',
            }}
          >
            {hasUpload ? 'Team Upload' : 'AI Generated'}
          </span>
          <button onClick={onClose} className="p-1.5 hover:bg-[#252525] rounded-md transition-colors text-[#777] hover:text-[#ededed] shrink-0 ml-1">
            <I n="x" s={14} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-5">
          {hasUpload ? (
            /* ─── Uploaded file preview ─── */
            <div className="space-y-5">
              {/* File info card */}
              <div className="flex items-center gap-4 px-5 py-4 rounded-lg bg-[#1e1e1e] border border-[#2a2a2a]">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#3ECF8E15', border: '1px solid #3ECF8E25' }}>
                  <I n="file" s={22} c="text-[#3ECF8E]" />
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-medium text-[#ededed]">{briefing.fileName}</p>
                  <p className="text-[12px] text-[#555] mt-0.5">PDF Document &middot; Uploaded by {briefing.uploadedBy} &middot; {briefing.uploadedDate}</p>
                </div>
              </div>

              {/* Mock PDF pages */}
              <div className="space-y-3">
                {[1, 2, 3].map((p) => (
                  <div key={p} className="bg-[#1a1a1a] rounded-md border border-[#2a2a2a] p-5">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] text-[#444]">Page {p}</span>
                      <span className="text-[10px] text-[#333]">{briefing.fileName}</span>
                    </div>
                    <div className="space-y-2.5">
                      {p === 1 && <div className="h-5 w-3/5 rounded bg-[#252525]" />}
                      <div className="h-3 w-full rounded bg-[#1e1e1e]" />
                      <div className="h-3 w-full rounded bg-[#1e1e1e]" />
                      <div className="h-3 w-4/5 rounded bg-[#1e1e1e]" />
                      {p === 1 && (
                        <div className="h-24 w-full rounded bg-[#222] mt-3 flex items-center justify-center">
                          <span className="text-[10px] text-[#444]">[ Executive Summary &middot; Campaign Overview ]</span>
                        </div>
                      )}
                      {p === 2 && (
                        <div className="grid grid-cols-4 gap-2 mt-3">
                          {['Impressions', 'CTR', 'Conversions', 'ROI'].map((m) => (
                            <div key={m} className="h-16 rounded bg-[#222] flex items-center justify-center">
                              <span className="text-[9px] text-[#444]">{m}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {p === 3 && (
                        <div className="space-y-2 mt-3">
                          {[1, 2, 3].map((r) => (
                            <div key={r} className="flex gap-3">
                              <div className="h-3 w-24 rounded bg-[#222]" />
                              <div className="h-3 flex-1 rounded bg-[#1e1e1e]" />
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="h-3 w-full rounded bg-[#1e1e1e]" />
                      <div className="h-3 w-3/4 rounded bg-[#1e1e1e]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* ─── AI-generated briefing ─── */
            <div className="rounded-lg p-5" style={{ background: 'linear-gradient(135deg, #0f1f1a, #111a16)', border: '1px solid #1a3a2a' }}>
              <BriefingContent brief={aiBrief} camp={camp} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#2a2a2a] bg-[#1a1a1a] shrink-0">
          <span className="text-[11px] text-[#555]">
            {hasUpload ? `${briefing.fileName} \u00B7 PDF Document` : `AI-generated briefing for ${camp.name}`}
          </span>
          <button onClick={onClose} className="px-3.5 py-1.5 rounded-md text-[11px] font-medium bg-[#252525] text-[#ccc] hover:bg-[#303030] border border-[#333] transition-colors">
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

  return (
    <div className="anim-fade">
      <div className="mb-6">
        <h1 className="text-[18px] font-semibold text-[#f8f8f8] mb-1">Completed Campaigns</h1>
        <p className="text-[12px] text-[#666]">
          {liveCampaigns.length} campaign{liveCampaigns.length !== 1 ? 's' : ''} currently live
        </p>
      </div>

      {liveCampaigns.length === 0 ? (
        <div className="py-20 text-center rounded-lg border border-[#2a2a2a] bg-[#161616]">
          <I n="check" s={32} c="text-[#333] mx-auto mb-3" />
          <p className="text-[14px] text-[#777]">No live campaigns</p>
          <p className="text-[12px] text-[#555] mt-1">Campaigns that reach the Live stage will appear here</p>
        </div>
      ) : (
        <div className="rounded-lg border border-[#2a2a2a] bg-[#161616] overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[1fr_120px_100px_100px_140px_32px] gap-4 px-5 py-3 border-b border-[#2a2a2a] bg-[#1a1a1a]">
            <span className="text-[10px] font-semibold text-[#555] uppercase tracking-wider">Campaign</span>
            <span className="text-[10px] font-semibold text-[#555] uppercase tracking-wider">Business Unit</span>
            <span className="text-[10px] font-semibold text-[#555] uppercase tracking-wider">Created</span>
            <span className="text-[10px] font-semibold text-[#555] uppercase tracking-wider">Launch Date</span>
            <span className="text-[10px] font-semibold text-[#555] uppercase tracking-wider">Briefing</span>
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
                className="grid grid-cols-[1fr_120px_100px_100px_140px_32px] gap-4 px-5 py-3.5 border-b border-[#222] last:border-b-0 hover:bg-[#1e1e1e] transition-colors text-left group cursor-pointer"
              >
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-[#ededed] truncate group-hover:text-white transition-colors">
                    {camp.name}
                  </p>
                  <p className="text-[11px] text-[#555] truncate mt-0.5">{camp.desc}</p>
                </div>
                <span className="text-[12px] text-[#999] self-center">{camp.bu}</span>
                <span className="text-[12px] text-[#777] self-center">{camp.created}</span>
                <span className="text-[12px] text-[#777] self-center">{camp.date}</span>
                <div className="self-center">
                  {hasUpload ? (
                    <button
                      onClick={(e) => { e.stopPropagation(); setModalCamp(camp); }}
                      className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#3ECF8E15] border border-[#3ECF8E30] text-[#3ECF8E] hover:bg-[#3ECF8E25] hover:border-[#3ECF8E50] transition-colors cursor-pointer"
                    >
                      <I n="check" s={10} />
                      Final Brief
                    </button>
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); setModalCamp(camp); }}
                      className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#a78bfa15] border border-[#a78bfa30] text-[#a78bfa] hover:bg-[#a78bfa25] hover:border-[#a78bfa50] transition-colors cursor-pointer"
                    >
                      <I n="sparkle" s={10} />
                      AI Generated
                    </button>
                  )}
                </div>
                <div className="self-center flex justify-end">
                  <I n="chevR" s={14} c="text-[#444] group-hover:text-[#888] transition-colors" />
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
          briefing={briefings[modalCamp.id]}
          onClose={() => setModalCamp(null)}
        />
      )}
    </div>
  );
};

export default CompletedPage;
