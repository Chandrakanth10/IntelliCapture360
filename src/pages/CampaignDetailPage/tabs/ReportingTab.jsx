import { I } from '../../../shared/campaignShared';

const ReportingTab = () => (
  <div className="rounded-xl border border-dashed border-[var(--sb-border-soft)] bg-[var(--sb-panel)] p-12 text-center">
    <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgba(var(--sb-accent-rgb),0.08)' }}>
      <I n="bar" s={20} c="text-[var(--sb-muted-soft)]" />
    </div>
    <p className="text-[13px] font-medium text-[var(--sb-muted)]">Reporting</p>
    <p className="text-[11px] text-[var(--sb-muted-soft)] mt-1">This section is under development</p>
  </div>
);

export default ReportingTab;
