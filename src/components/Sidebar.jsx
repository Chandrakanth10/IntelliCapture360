import { I } from '../shared/campaignShared';

const CHILD_VIEWS = { campaign: 'mytasks' };

const Sidebar = ({ view, onNavigate, isExpanded, isHovered, setIsHovered, isMobileOpen, onCloseMobile }) => {
  const activeView = CHILD_VIEWS[view] || view;
  const overviewNav = [
    { id: 'dashboard', icon: 'grid', label: 'Dashboard' },
    { id: 'mytasks', icon: 'briefcase', label: 'Active Campaigns' },
  ];
  const campaignNav = [
    { id: 'tracker', icon: 'kanban', label: 'Tracker' },
    { id: 'calendar', icon: 'cal', label: 'Calendar' },
  ];
  const resultsNav = [
    { id: 'completed', icon: 'check', label: 'Campaign History' },
  ];
  const actionsNav = [
    { id: 'intake', icon: 'plus', label: 'New Campaign' },
    { id: 'agentIntake', icon: 'sparkle', label: 'AI Intake' },
  ];
  const showText = isExpanded || isHovered || isMobileOpen;

  const itemCls = (active) =>
    `group relative flex items-center w-full gap-3 px-3 py-2 font-medium rounded-lg text-[13px] transition-all duration-150 ${
      active
        ? 'bg-[var(--sb-accent)] text-[var(--sb-accent-contrast)] shadow-sm'
        : 'text-[var(--sb-muted)] hover:bg-[var(--sb-panel-2)] hover:text-[var(--sb-text)]'
    } ${!showText ? 'lg:justify-center' : ''}`;

  const iconCls = (active) =>
    active ? 'text-[var(--sb-accent-contrast)]' : 'text-[var(--sb-muted-soft)] group-hover:text-[var(--sb-muted)]';

  const renderGroup = (title, items) => (
    <nav className="mb-5">
      <h2
        className={`mb-2.5 text-[11px] uppercase tracking-[0.14em] font-semibold text-[var(--sb-muted)] ${
          !showText ? 'lg:text-center' : 'px-2.5'
        }`}
      >
        {showText ? title : '\u2022'}
      </h2>
      <ul className="flex flex-col gap-0.5">
        {items.map((item) => {
          const active = activeView === item.id;
          return (
            <li key={item.id}>
              <button type="button" onClick={() => onNavigate(item.id)} className={itemCls(active)}>
                <span className={iconCls(active)}>
                  <I n={item.icon} s={18} />
                </span>
                {showText && <span>{item.label}</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden ${isMobileOpen ? 'block' : 'hidden'}`}
        onClick={onCloseMobile}
      />
      <aside
        className={`fixed mt-16 lg:mt-0 top-0 left-0 h-screen flex flex-col transition-all duration-300 ease-in-out z-50 border-r border-[var(--sb-border-soft)] bg-[var(--sb-bg-soft)] ${
          showText ? 'w-[260px]' : 'w-[72px]'
        } ${isMobileOpen ? 'translate-x-0 shadow-[var(--sb-shadow-md)]' : '-translate-x-full'} lg:translate-x-0 lg:shadow-none`}
        onMouseEnter={() => { if (!isExpanded) setIsHovered(true); }}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`py-5 px-4 flex ${showText ? 'justify-start' : 'lg:justify-center'}`}>
          {showText ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--sb-accent)] flex items-center justify-center shadow-sm">
                <span className="text-[var(--sb-accent-contrast)] text-[12px] font-bold tracking-tight">IC</span>
              </div>
              <div>
                <p className="text-[15px] font-semibold text-[var(--sb-text-strong)] leading-tight">IntelliCapture</p>
                <p className="text-[12px] text-[var(--sb-muted-soft)]">Campaign Workflow</p>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-[var(--sb-accent)] flex items-center justify-center shadow-sm">
              <span className="text-[var(--sb-accent-contrast)] text-[12px] font-bold tracking-tight">IC</span>
            </div>
          )}
        </div>

        <div className="flex-1 no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear px-3 pb-6">
          {renderGroup('Overview', overviewNav)}
          <div className="mx-2.5 mb-5 border-t border-[var(--sb-border-soft)]" />
          {renderGroup('Campaigns', campaignNav)}
          <div className="mx-2.5 mb-5 border-t border-[var(--sb-border-soft)]" />
          {renderGroup('Results', resultsNav)}
          <div className="mx-2.5 mb-5 border-t border-[var(--sb-border-soft)]" />
          {renderGroup('Actions', actionsNav)}
        </div>

      </aside>
    </>
  );
};

export default Sidebar;
