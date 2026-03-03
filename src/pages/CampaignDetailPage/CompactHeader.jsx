import { I, STAGES } from '../../shared/campaignShared';

const STATUS_STYLE = {
  'On Track':     { bg: 'rgba(62,207,142,0.10)',  border: 'rgba(62,207,142,0.20)',  text: '#3ecf8e', icon: 'check' },
  'Live':         { bg: 'rgba(62,207,142,0.10)',  border: 'rgba(62,207,142,0.20)',  text: '#3ecf8e', icon: 'zap' },
  'Pending Info': { bg: 'rgba(251,191,36,0.10)',  border: 'rgba(251,191,36,0.20)',  text: '#fbbf24', icon: 'clock' },
  'New':          { bg: 'rgba(96,165,250,0.10)',  border: 'rgba(96,165,250,0.20)',  text: '#60a5fa', icon: 'sparkle' },
};

const PRI_STYLE = {
  High:   { bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.18)', text: '#f87171' },
  Medium: { bg: 'rgba(251,191,36,0.08)',  border: 'rgba(251,191,36,0.18)',  text: '#fbbf24' },
  Low:    { bg: 'rgba(56,189,248,0.08)',  border: 'rgba(56,189,248,0.18)',  text: '#38bdf8' },
};

const fmtDate = (s) => {
  const [y, m, d] = (s || '').split('-').map(Number);
  if (!y) return s;
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[m - 1]} ${d}, ${y}`;
};

const daysUntil = (s) => {
  const [y, m, d] = (s || '').split('-').map(Number);
  if (!y) return null;
  const target = new Date(y, m - 1, d);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.ceil((target - now) / 86400000);
};

/* ── Compact metric chip — icon left, stacked label/value ── */
const Chip = ({ icon, label, value, bg, borderColor, iconColor }) => (
  <div
    className="flex items-center gap-1.5 px-2 py-1 rounded-md border"
    style={{
      background: bg || 'var(--sb-panel-2)',
      borderColor: borderColor || 'var(--sb-border-soft)',
    }}
  >
    <span className="shrink-0" style={{ color: iconColor || 'var(--sb-muted-soft)' }}>
      <I n={icon} s={11} />
    </span>
    <div className="flex flex-col leading-none">
      <span className="text-[9px] uppercase tracking-wider text-[var(--sb-muted-soft)] font-medium">{label}</span>
      <span className="text-[11px] font-semibold text-[var(--sb-text-strong)] mt-px">{value}</span>
    </div>
  </div>
);

const CompactHeader = ({ camp, si, stg, fromPage, onBack }) => {
  const pri = PRI_STYLE[camp.pri] || PRI_STYLE.Medium;
  const status = STATUS_STYLE[camp.status] || STATUS_STYLE['On Track'];
  const remaining = daysUntil(camp.date);
  const launchSoon = remaining !== null && remaining <= 7 && remaining >= 0;
  const launchPast = remaining !== null && remaining < 0;

  const countdownText = launchPast
    ? 'Launched'
    : remaining === 0 ? 'Today'
    : remaining !== null ? `In ${remaining}d`
    : '—';

  return (
    <div className="shrink-0 border-b border-[var(--sb-border-soft)]">
      <div className="flex items-center gap-3 px-4 py-2.5 sm:px-5">
        {/* Back */}
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[12px] text-[var(--sb-muted)] hover:text-[var(--sb-accent)] transition-colors shrink-0 group rounded-md px-2 py-1.5 -ml-2 hover:bg-[var(--sb-accent-muted)]"
        >
          <I n="chevL" s={14} c="transition-transform group-hover:-translate-x-0.5" />
          <span className="hidden sm:inline">{fromPage}</span>
        </button>

        <div className="w-px h-7 bg-[var(--sb-border-soft)] hidden sm:block shrink-0" />

        {/* Name + subtitle */}
        <div className="min-w-0 flex-1">
          <h1 className="text-[16px] sm:text-[18px] font-bold text-[var(--sb-text-strong)] truncate leading-tight">
            {camp.name}
          </h1>
          <p className="text-[11px] text-[var(--sb-muted-soft)] truncate leading-tight mt-0.5">
            <span>{camp.bu}</span>
            <span className="hidden md:inline"> &middot; {camp.mr}</span>
            <span className="hidden lg:inline"> &middot; {camp.rep}</span>
          </p>
        </div>

        {/* Metric chips */}
        <div className="hidden md:flex items-center gap-1.5 shrink-0">
          <Chip icon="trendUp" label={camp.roiT || 'Revenue'} value={camp.roi} />
          <Chip
            icon="clock"
            label="In stage"
            value={`${camp.days}d`}
            iconColor={stg.hex}
          />
          <Chip
            icon="cal"
            label={fmtDate(camp.date)}
            value={countdownText}
            bg={launchSoon ? 'rgba(251,191,36,0.06)' : undefined}
            borderColor={launchSoon ? 'rgba(251,191,36,0.18)' : undefined}
            iconColor={launchSoon ? '#fbbf24' : undefined}
          />
        </div>

        {/* Countdown — sm only (chips hidden below md) */}
        <div
          className="md:hidden hidden sm:flex items-center gap-1 text-[11px] font-semibold shrink-0 px-2 py-1 rounded-md border"
          style={{
            background: launchSoon ? 'rgba(251,191,36,0.06)' : 'var(--sb-panel-2)',
            borderColor: launchSoon ? 'rgba(251,191,36,0.18)' : 'var(--sb-border-soft)',
            color: launchSoon ? '#fbbf24' : 'var(--sb-text)',
          }}
        >
          <span className="shrink-0" style={{ color: launchSoon ? '#fbbf24' : 'var(--sb-muted-soft)' }}>
            <I n="cal" s={11} />
          </span>
          {countdownText}
        </div>

        {/* Separator before pills */}
        <div className="w-px h-7 bg-[var(--sb-border-soft)] hidden sm:block shrink-0" />

        {/* Status + Priority */}
        <div className="flex items-center gap-2 shrink-0">
          <span
            className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: status.bg, border: `1px solid ${status.border}`, color: status.text }}
          >
            <I n={status.icon} s={11} />
            <span className="hidden sm:inline">{camp.status}</span>
          </span>
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
            style={{ backgroundColor: pri.bg, border: `1px solid ${pri.border}`, color: pri.text }}
          >
            {camp.pri}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CompactHeader;
