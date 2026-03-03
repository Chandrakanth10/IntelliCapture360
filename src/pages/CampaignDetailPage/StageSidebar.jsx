import { I } from '../../shared/campaignShared';

const TAB_CONFIG = [
  { label: 'Intake', icon: 'file' },
  { label: 'Briefing', icon: 'sparkle' },
  { label: 'Plan + Strategy', icon: 'layers' },
  { label: 'Audience', icon: 'target' },
  { label: 'Creative', icon: 'eye' },
  { label: 'Execution', icon: 'zap' },
  { label: 'Reporting', icon: 'bar' },
];

/* Maps STAGES index (0-6) → tab index */
const STAGE_IDX_TO_TAB = { 0: 0, 1: 1, 2: 2, 3: 2, 4: 4, 5: 5, 6: 6 };

const StageSidebar = ({ activeTab, onTabChange, currentStageIdx }) => {
  const currentTab = STAGE_IDX_TO_TAB[currentStageIdx] ?? 0;

  return (
    <nav className="space-y-1">
      {TAB_CONFIG.map((tab, i) => {
        const active = activeTab === i;
        const isCurrent = i === currentTab;

        return (
          <button
            key={tab.label}
            onClick={() => onTabChange(i)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-[13px] font-medium transition-all ${
              active
                ? 'bg-[var(--sb-accent)] text-[var(--sb-accent-contrast)] shadow-sm'
                : 'text-[var(--sb-muted)] hover:bg-[var(--sb-panel-2)] hover:text-[var(--sb-text)]'
            }`}
          >
            <I n={tab.icon} s={14} />
            {tab.label}
            {isCurrent && !active && (
              <span className="ml-auto text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[var(--sb-accent-muted)] text-[var(--sb-accent)]">
                Current
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default StageSidebar;
