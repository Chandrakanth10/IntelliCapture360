import { useEffect, useRef, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import DetailPanel from './components/DetailPanel';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import CalendarPage from './pages/CalendarPage';
import DashboardPage from './pages/DashboardPage';
import IntakePage from './pages/IntakePage';
import MyTasksPage from './pages/MyTasksPage';
import TrackerPage from './pages/TrackerPage';
import { CAMPS, I } from './shared/campaignShared';

const VIEW_TO_PATH = {
  dashboard: '/dashboard',
  intake: '/intake',
  tracker: '/tracker',
  calendar: '/calendar',
  mytasks: '/my-tasks',
};

function resolveViewFromPath(pathname) {
  const clean = String(pathname || '/')
    .toLowerCase()
    .replace(/\/+$/, '') || '/';

  if (clean === '/' || clean === '/dashboard' || clean === '/products') {
    return 'dashboard';
  }

  if (clean === '/intake') {
    return 'intake';
  }

  if (clean === '/tracker') {
    return 'tracker';
  }

  if (clean === '/calendar') {
    return 'calendar';
  }

  if (clean === '/my-tasks') {
    return 'mytasks';
  }

  return 'dashboard';
}

export default function App() {
  const location = useLocation();
  const routerNavigate = useNavigate();
  const view = resolveViewFromPath(location.pathname);

  const [selected, setSelected] = useState(null);
  const [campaigns] = useState(CAMPS);
  const [toast, setToast] = useState(null);
  const [formDirty, setFormDirty] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const mainRef = useRef(null);
  const sidebarOpen = isExpanded || isHovered;

  const handleSubmit = (fd) => {
    setFormDirty(false);
    setToast(`"${fd.projectName}" submitted`);
    setTimeout(() => setToast(null), 4000);
  };

  const navigate = (targetView) => {
    const targetPath = VIEW_TO_PATH[targetView] || VIEW_TO_PATH.dashboard;

    if (view === 'intake' && targetView !== 'intake' && formDirty) {
      const leave = window.confirm('Unsaved changes will be lost. Leave?');
      if (!leave) {
        return;
      }
    }

    if (targetPath !== location.pathname) {
      routerNavigate(targetPath);
    }

    if (targetView !== 'intake') {
      setFormDirty(false);
    }

    setIsMobileOpen(false);
    mainRef.current?.scrollTo({ top: 0 });
  };

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (view !== 'intake' && formDirty) {
      setFormDirty(false);
    }
  }, [view, formDirty]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === 'Enter' &&
        view === 'intake' &&
        !e.shiftKey &&
        e.target.tagName !== 'TEXTAREA' &&
        e.target.tagName !== 'BUTTON'
      ) {
        e.preventDefault();
        document.querySelector('[data-next-btn]')?.click();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [view]);

  return (
    <div className="supabase h-screen overflow-hidden" style={{ background: '#111111' }}>
      <Sidebar
        view={view}
        onNavigate={navigate}
        isExpanded={isExpanded}
        isHovered={isHovered}
        setIsHovered={setIsHovered}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      <div
        className={`h-screen flex flex-col transition-all duration-300 ease-in-out ${sidebarOpen ? 'lg:ml-[260px]' : 'lg:ml-[72px]'} ${isMobileOpen ? 'ml-0' : ''}`}
      >
        <TopNav />

        <main ref={mainRef} className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="p-4 mx-auto max-w-screen-2xl md:p-6">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/products" element={<Navigate to="/dashboard" replace />} />
              <Route
                path="/dashboard"
                element={<DashboardPage campaigns={campaigns} onSelect={(campaign) => setSelected(campaign)} />}
              />
              <Route
                path="/intake"
                element={
                  <IntakePage
                    onSubmit={handleSubmit}
                    onInput={() => {
                      if (!formDirty) {
                        setFormDirty(true);
                      }
                    }}
                  />
                }
              />
              <Route
                path="/tracker"
                element={<TrackerPage campaigns={campaigns} onSelect={(campaign) => setSelected(campaign)} />}
              />
              <Route
                path="/calendar"
                element={<CalendarPage campaigns={campaigns} onSelect={(campaign) => setSelected(campaign)} />}
              />
              <Route
                path="/my-tasks"
                element={<MyTasksPage campaigns={campaigns} onSelect={(campaign) => setSelected(campaign)} />}
              />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>

      {selected && <DetailPanel camp={selected} onClose={() => setSelected(null)} />}

      {toast && (
        <div className="fixed bottom-5 right-5 bg-emerald-600 text-white pl-3.5 pr-2 py-2 rounded-md shadow-lg text-[12px] font-medium anim-scale z-50 flex items-center gap-2">
          <I n="check" s={14} />
          <span>{toast}</span>
          <button
            onClick={() => setToast(null)}
            className="p-0.5 hover:bg-white/20 rounded transition-colors ml-1"
          >
            <I n="x" s={12} />
          </button>
        </div>
      )}
    </div>
  );
}
