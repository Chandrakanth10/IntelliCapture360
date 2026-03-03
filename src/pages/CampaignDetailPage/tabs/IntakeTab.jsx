import { I } from '../../../shared/campaignShared';
import { DetailField, getFileMeta, downloadFile } from '../_shared';

/* ─── Compact file row (mirrors CreativeTab pattern) ─── */
const CompactRow = ({ file, onClick }) => {
  const meta = getFileMeta(file.name);
  return (
    <div
      className="flex items-center gap-2.5 px-3 py-1.5 border-b border-[var(--sb-border-soft)] last:border-b-0 group cursor-pointer hover:bg-[rgba(var(--sb-accent-rgb),0.04)] transition-colors"
      onClick={onClick}
    >
      <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0" style={{ background: `${meta.color}14`, color: meta.color }}>
        <I n={meta.icon} s={10} />
      </div>
      <span className="text-[12px] font-medium text-[var(--sb-text)] truncate flex-1 min-w-0 group-hover:text-[var(--sb-text-strong)] transition-colors">{file.name}</span>
      <span className="text-[11px] text-[var(--sb-muted-soft)] shrink-0 hidden sm:inline">{meta.label}</span>
      <span className="text-[11px] text-[var(--sb-muted-soft)] shrink-0 w-16 text-right">{file.size}</span>
      <span className="text-[11px] text-[var(--sb-muted-soft)] shrink-0 w-20 text-right hidden sm:inline">{file.date}</span>
      <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ml-1">
        <button onClick={(e) => { e.stopPropagation(); downloadFile(file); }} className="p-1 rounded text-[var(--sb-muted-soft)] hover:text-[var(--sb-accent)] transition-colors" title="Download">
          <I n="upload" s={11} c="rotate-180" />
        </button>
        <button onClick={onClick} className="p-1 rounded text-[var(--sb-muted-soft)] hover:text-[var(--sb-accent)] transition-colors" title="Preview">
          <I n="eye" s={11} />
        </button>
      </div>
    </div>
  );
};

/* ─── Section header band ─── */
const Band = ({ icon, title, count, extra }) => (
  <div className="flex items-center gap-2 px-4 py-2 border-b border-[var(--sb-border-soft)]" style={{ background: 'rgba(var(--sb-accent-rgb),0.03)' }}>
    <div className="w-5 h-5 rounded flex items-center justify-center shrink-0" style={{ background: 'rgba(var(--sb-accent-rgb),0.12)' }}>
      <I n={icon} s={11} c="text-[var(--sb-accent)]" />
    </div>
    <h3 className="text-[11px] font-semibold text-[var(--sb-text-strong)] uppercase tracking-wider">{title}</h3>
    {count != null && (
      <span className="text-[10px] font-medium text-[var(--sb-muted)] bg-[var(--sb-panel-2)] border border-[var(--sb-border-soft)] rounded-full px-1.5 py-px leading-none">{count}</span>
    )}
    {extra && <>{extra}</>}
  </div>
);

/* ─── Card wrapper ─── */
const Card = ({ icon, title, count, extra, children }) => (
  <div className="rounded-xl border border-[var(--sb-border-soft)] bg-[var(--sb-panel)] overflow-hidden shadow-[var(--sb-shadow-sm)]">
    <Band icon={icon} title={title} count={count} extra={extra} />
    <div className="p-4">{children}</div>
  </div>
);

/* ─── File category meta ─── */
const CAT_META = {
  Merchandising: { icon: 'grid', color: '#fb923c', desc: 'Planograms, displays & layouts' },
  Creative:      { icon: 'sparkle', color: '#a78bfa', desc: 'Design assets & templates' },
};

/* ═══ INTAKE TAB ═══ */
const IntakeTab = ({ camp, ext, chLeads, onPreviewFile }) => {
  const allFiles = [
    ...(ext.merchFiles || []).map((f) => ({ ...f, category: 'Merchandising' })),
    ...(ext.creativeFiles || []).map((f) => ({ ...f, category: 'Creative' })),
  ];

  const mediaFiles = [
    ...(ext.vendorGuide ? [{ ...ext.vendorGuide, category: 'Vendor Style Guide' }] : []),
    ...(ext.isanScripts ? [{ ...ext.isanScripts, category: 'ISAN Scripts' }] : []),
    ...(ext.amcGuidance ? [{ ...ext.amcGuidance, category: 'AMC Guidance' }] : []),
  ];

  const merchCount = (ext.merchFiles || []).length;
  const creativeCount = (ext.creativeFiles || []).length;

  return (
    <div className="space-y-5">
      {/* ── Campaign Description ── */}
      <div className="rounded-xl border border-[var(--sb-border-soft)] bg-[var(--sb-panel)] p-4 shadow-[var(--sb-shadow-sm)]">
        <p className="text-[13px] text-[var(--sb-text)] leading-relaxed">{camp.desc}</p>
      </div>

      {/* ── Project Details ── */}
      <Card icon="file" title="Project Details">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-5 gap-y-4">
          <DetailField label="Campaign Name" value={camp.name} />
          <DetailField label="Business Unit" value={camp.bu} />
          <DetailField label="Campaign Type" value={camp.ct} />
          <DetailField label="Created" value={camp.created} />
          <DetailField label="Launch Date" value={camp.date} />
          <DetailField label="Requested By" value={camp.by.n} />
        </div>
      </Card>

      {/* ── Assignment ── */}
      <Card icon="user" title="Assignment">
        <div className="grid grid-cols-2 gap-4">
          <DetailField label="Requester" value={camp.by.n} />
          <DetailField label="Representative" value={camp.rep} />
          <DetailField label="Requester LDAP" value={camp.by.l} />
          <DetailField label="Status" value={camp.status} />
        </div>
      </Card>

      {/* ── Priority, ROI & KPIs ── */}
      <Card icon="trendUp" title="Priority & ROI">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <DetailField label="Priority" value={camp.pri} />
          <DetailField label="ROI Revenue" value={ext.roiRevenue || camp.roi || '—'} />
          <DetailField label="ROI Engagement" value={ext.roiEngagement || '—'} />
          <DetailField label="Quarter / Period" value={`${camp.q} ${camp.p}`} />
          <DetailField label="Marketing Team" value={camp.mr} />
        </div>
      </Card>

      {/* ── Timeline ── */}
      <Card icon="clock" title="Timeline">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <DetailField label="Launch Date" value={camp.date} />
          <DetailField label="Quarter" value={`${camp.q} ${camp.p}`} />
          <DetailField label="Period / Week" value={`${camp.p} ${camp.w}`} />
          <DetailField label="Days in Stage" value={`${camp.days}d`} />
        </div>
      </Card>

      {/* ── Target Audience & Segmentation ── */}
      {(camp.aud || ext.segDef || ext.targetCriteria) && (
        <Card icon="target" title="Audience & Segmentation">
          <div className="space-y-4">
            {camp.aud && (
              <div>
                <span className="text-[11px] text-[var(--sb-muted-soft)] uppercase tracking-wide">Target Audience</span>
                <p className="text-[12px] text-[var(--sb-text)] leading-relaxed mt-0.5">{camp.aud}</p>
              </div>
            )}
            {(ext.segDef || ext.targetCriteria) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ext.segDef && <DetailField label="Segmentation Definition" value={ext.segDef} />}
                {ext.targetCriteria && <DetailField label="Targeting Criteria" value={ext.targetCriteria} />}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* ── Banners ── */}
      {(camp.banners || []).length > 0 && (
        <Card icon="grid" title="Banners" count={(camp.banners || []).length}>
          <div className="flex flex-wrap gap-1.5">
            {camp.banners.map((b) => (
              <span key={b} className="text-[11px] font-medium px-2.5 py-1 rounded bg-[rgba(var(--sb-accent-rgb),0.12)] border border-[rgba(var(--sb-accent-rgb),0.25)] text-[var(--sb-accent)]">{b}</span>
            ))}
          </div>
        </Card>
      )}

      {/* ── Channels ── */}
      {((camp.ch || []).length > 0 || (camp.mch || []).length > 0) && (
        <Card icon="hash" title="Channels">
          <div className="space-y-4">
            {(camp.ch || []).length > 0 && (
              <div>
                <span className="text-[11px] text-[var(--sb-muted-soft)] uppercase tracking-wide mb-1.5 block">Support Channels</span>
                <div className="flex flex-wrap gap-1.5">
                  {camp.ch.map((c) => (
                    <span key={c} className="text-[11px] px-2.5 py-1 rounded bg-[var(--sb-panel-2)] border border-[var(--sb-border)] text-[var(--sb-muted)]">{c}</span>
                  ))}
                </div>
              </div>
            )}
            {(camp.mch || []).length > 0 && (
              <div>
                <span className="text-[11px] text-[var(--sb-muted-soft)] uppercase tracking-wide mb-1.5 block">Marketing Channels</span>
                <div className="flex flex-wrap gap-1.5">
                  {camp.mch.map((c) => (
                    <span key={c} className="text-[11px] px-2.5 py-1 rounded bg-[#60a5fa12] border border-[#60a5fa25] text-[#60a5fa]">{c}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* ── Channel Lead Assignments ── */}
      {chLeads && chLeads.length > 0 && (
        <Card icon="user" title="Channel Leads" count={chLeads.length}>
          <div className="rounded-lg border border-[var(--sb-border-soft)] overflow-hidden">
            {chLeads.map((cl) => (
              <div key={cl.channel} className="flex items-center justify-between px-3 py-1.5 border-b border-[var(--sb-border-soft)] last:border-b-0">
                <span className="text-[12px] text-[var(--sb-muted)]">{cl.channel}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-medium text-[var(--sb-text)]">{cl.lead}</span>
                  {cl.isOverride && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#fbbf2418] border border-[#fbbf2430] text-[#fbbf24]">Custom</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── Creative Brief ── */}
      {(ext.creativeType || ext.brandAssets) && (
        <Card icon="sparkle" title="Creative Brief">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DetailField label="Creative Type" value={ext.creativeType} />
            <DetailField label="Brand Assets" value={ext.brandAssets} />
          </div>
        </Card>
      )}

      {/* ── Files & Uploads ── */}
      <div className="rounded-xl border border-[var(--sb-border-soft)] bg-[var(--sb-panel)] overflow-hidden shadow-[var(--sb-shadow-sm)]">
        <Band
          icon="upload"
          title="Files & Uploads"
          count={allFiles.length > 0 ? allFiles.length : null}
          extra={allFiles.length > 0 && (
            <span className="text-[10px] text-[var(--sb-muted-soft)] ml-auto hidden sm:inline">
              {[merchCount > 0 && `${merchCount} merchandising`, creativeCount > 0 && `${creativeCount} creative`].filter(Boolean).join(', ')}
            </span>
          )}
        />
        {allFiles.length === 0 ? (
          <div className="p-5">
            <div className="py-4 text-center rounded-md border border-dashed border-[var(--sb-border-soft)]">
              <p className="text-[11px] text-[var(--sb-muted-soft)]">No creative files uploaded for this campaign</p>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {['Merchandising', 'Creative'].map((cat) => {
              const files = allFiles.filter((f) => f.category === cat);
              if (files.length === 0) return null;
              const theme = CAT_META[cat];
              return (
                <div key={cat} className="rounded-lg overflow-hidden" style={{ border: `1px solid ${theme.color}35` }}>
                  <div className="flex items-center gap-2 px-3 py-1.5" style={{ background: `${theme.color}14`, borderBottom: `1px solid ${theme.color}20` }}>
                    <div className="w-3.5 h-3.5 flex items-center justify-center shrink-0" style={{ color: theme.color }}>
                      <I n={theme.icon} s={11} />
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: theme.color }}>{cat}</span>
                    <span
                      className="text-[10px] font-semibold rounded-full px-1.5 py-px leading-none"
                      style={{ color: theme.color, background: `${theme.color}22`, border: `1px solid ${theme.color}30` }}
                    >{files.length}</span>
                  </div>
                  {files.map((f) => <CompactRow key={f.name} file={f} onClick={() => onPreviewFile(f)} />)}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Media Resources ── */}
      {mediaFiles.length > 0 && (
        <div className="rounded-xl border border-[var(--sb-border-soft)] bg-[var(--sb-panel)] overflow-hidden shadow-[var(--sb-shadow-sm)]">
          <Band icon="briefcase" title="Media Resources" count={mediaFiles.length} extra={
            <span className="text-[10px] text-[var(--sb-muted-soft)] ml-auto hidden sm:inline">Reference documents & guidelines</span>
          } />
          <div className="p-4">
            <div className="rounded-lg overflow-hidden border border-[var(--sb-border-soft)]">
              {mediaFiles.map((f) => <CompactRow key={f.name} file={f} onClick={() => onPreviewFile(f)} />)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntakeTab;
