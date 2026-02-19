import { I } from '../shared/campaignShared';

const Sidebar = ({ view, onNavigate, isExpanded, isHovered, setIsHovered, isMobileOpen, onCloseMobile }) => {
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
  ];
  const showText = isExpanded || isHovered || isMobileOpen;

  const itemCls = (active) =>
    `group relative flex items-center w-full gap-3 px-3 py-2 font-medium rounded-md text-[14px] transition-all duration-150 ${
      active
        ? 'bg-[#252525] text-white'
        : 'text-[#999] hover:bg-[#1e1e1e] hover:text-[#ededed]'
    } ${!showText ? 'lg:justify-center' : ''}`;

  const iconCls = (active) =>
    active ? 'text-[#3ECF8E]' : 'text-[#666] group-hover:text-[#888]';

  const renderGroup = (title, items) => (
    <nav className="mb-5">
      <h2
        className={`mb-2.5 text-[11px] uppercase tracking-[0.1em] font-medium text-[#555] ${
          !showText ? 'lg:text-center' : 'px-2.5'
        }`}
      >
        {showText ? title : '\u2022'}
      </h2>
      <ul className="flex flex-col gap-0.5">
        {items.map((item) => {
          const active = view === item.id;
          return (
            <li key={item.id}>
              <button type="button" onClick={() => onNavigate(item.id)} className={itemCls(active)}>
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-[#3ECF8E] rounded-r-full" />
                )}
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
        className={`fixed mt-16 lg:mt-0 top-0 left-0 h-screen transition-all duration-300 ease-in-out z-50 border-r border-[#2e2e2e] bg-[#171717] ${
          showText ? 'w-[260px]' : 'w-[72px]'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
        style={{ background: '#161616' }}
        onMouseEnter={() => { if (!isExpanded) setIsHovered(true); }}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`py-5 px-4 flex ${showText ? 'justify-start' : 'lg:justify-center'}`}>
          {showText ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#3ECF8E] flex items-center justify-center">
                <span className="text-[#0a1f15] text-[12px] font-bold tracking-tight">IC</span>
              </div>
              <div>
                <p className="text-[15px] font-semibold text-white leading-tight">IntelliCapture</p>
                <p className="text-[12px] text-[#555]">Campaign Workflow</p>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-[#3ECF8E] flex items-center justify-center">
              <span className="text-[#0a1f15] text-[12px] font-bold tracking-tight">IC</span>
            </div>
          )}
        </div>

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear px-3 pb-6">
          {renderGroup('Overview', overviewNav)}
          <div className="mx-2.5 mb-5 border-t border-[#2a2a2a]" />
          {renderGroup('Campaigns', campaignNav)}
          <div className="mx-2.5 mb-5 border-t border-[#2a2a2a]" />
          {renderGroup('Results', resultsNav)}
          <div className="mx-2.5 mb-5 border-t border-[#2a2a2a]" />
          {renderGroup('Actions', actionsNav)}
        </div>

      </aside>
    </>
  );
};

export default Sidebar;
