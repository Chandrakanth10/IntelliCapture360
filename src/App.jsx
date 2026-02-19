import { useEffect, useRef, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import DetailPanel from './components/DetailPanel';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import CalendarPage from './pages/CalendarPage';
import CampaignDetailPage from './pages/CampaignDetailPage';
import CompletedPage from './pages/CompletedPage';
import DashboardPage from './pages/DashboardPage';
import IntakePage from './pages/IntakePage';
import MyTasksPage from './pages/MyTasksPage';
import TrackerPage from './pages/TrackerPage';
import { CAMPS, CURRENT_USER, I, STAGES, STAGE_APPROVALS } from './shared/campaignShared';

const VIEW_TO_PATH = {
  dashboard: '/dashboard',
  intake: '/intake',
  tracker: '/tracker',
  calendar: '/calendar',
  mytasks: '/my-tasks',
  completed: '/completed',
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

  if (clean === '/completed') {
    return 'completed';
  }

  if (clean.startsWith('/campaign/')) {
    return 'campaign';
  }

  return 'dashboard';
}

export default function App() {
  const location = useLocation();
  const routerNavigate = useNavigate();
  const view = resolveViewFromPath(location.pathname);

  const [selected, setSelected] = useState(null);
  const [campaigns, setCampaigns] = useState(CAMPS);
  const [approvals, setApprovals] = useState({
    1: {
      'hero-assets': { by: 'David Park', date: 'Feb 16, 3:20 PM' },
      'email-review': { by: 'Lisa Smith', date: 'Feb 17, 10:45 AM' },
    },
    3: {
      'assets-deploy': { by: 'Robert Kim', date: 'Feb 17, 9:00 AM' },
      'qa-test': { by: 'Lisa Smith', date: 'Feb 17, 2:30 PM' },
      'go-nogo': { by: 'Lauren Hannigan', date: 'Feb 18, 8:15 AM' },
    },
    6: {
      'creative-strat': { by: 'David Park', date: 'Feb 14, 11:00 AM' },
      'media-plan': { by: 'Chris Thompson', date: 'Feb 15, 4:10 PM' },
    },
    8: {
      'launched': { by: 'System', date: 'Feb 8, 6:00 AM' },
      'perf-monitor': { by: 'Lisa Smith', date: 'Feb 8, 9:30 AM' },
      'post-review': { by: 'Lauren Hannigan', date: 'Feb 10, 11:00 AM' },
    },
    14: {
      'brief-signoff': { by: 'Lauren Hannigan', date: 'Feb 15, 1:00 PM' },
      'timeline-approve': { by: 'Sarah Johnson', date: 'Feb 16, 10:20 AM' },
    },
  });
  const [comments, setComments] = useState({
    1: [
      { id: 1, author: 'Michael Chen', text: "Creative assets are looking great \u2014 let's finalize the hero banner by Friday.", date: '2026-02-14T09:32:00' },
      { id: 2, author: 'Lauren Hannigan', text: "Agreed. I'll loop in the design team for final review.", date: '2026-02-15T14:15:00' },
    ],
    3: [
      { id: 1, author: 'Lisa Wong', text: 'Can we add a local produce spotlight section to this campaign?', date: '2026-02-16T11:05:00' },
    ],
    8: [
      { id: 1, author: 'Derek Nguyen', text: "App download numbers are up 18% since launch \u2014 nice momentum.", date: '2026-02-12T16:48:00' },
      { id: 2, author: 'Lisa Smith', text: 'Doubling the push notification cadence this week.', date: '2026-02-13T10:22:00' },
      { id: 3, author: 'Lauren Hannigan', text: "Great results so far. Let's keep the energy going into next week.", date: '2026-02-17T08:50:00' },
    ],
  });
  const [briefings, setBriefings] = useState({
    8: { type: 'uploaded', fileName: 'Q1_Digital_Coupon_Briefing.pdf', uploadedBy: 'Lisa Smith', uploadedDate: 'Feb 12, 2026' },
  });
  const [toast, setToast] = useState(null);
  const [formDirty, setFormDirty] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const mainRef = useRef(null);
  const sidebarOpen = isExpanded || isHovered;

  const handleSubmit = (fd) => {
    setFormDirty(false);
    const newId = campaigns.length > 0 ? Math.max(...campaigns.map((c) => c.id)) + 1 : 1;
    const today = new Date().toISOString().slice(0, 10);
    const newCampaign = {
      id: newId,
      name: fd.projectName,
      desc: fd.projectDesc || 'New campaign submitted via intake form.',
      bu: fd.bu || 'Corporate',
      banners: fd.banners.length ? fd.banners : ['All Banners'],
      by: { n: fd.byName || CURRENT_USER.name, l: fd.byLdap || '' },
      mr: fd.mr || 'Integrated Marketing',
      rep: fd.rep || CURRENT_USER.name,
      pri: fd.pri || 'Medium',
      roi: fd.roiRevenue || '$0',
      roiT: fd.roiEngagement ? 'Engagement' : 'Revenue',
      q: fd.quarter || 'Q1',
      p: fd.period || 'P1',
      w: fd.week || 'W1',
      date: fd.targetDate || today,
      ch: fd.chSupport.length ? fd.chSupport : ['CRM'],
      mch: fd.mktCh.length ? fd.mktCh : ['Email'],
      ct: fd.campType || 'New',
      stage: 'intake',
      days: 0,
      created: today,
      aud: fd.segDef || 'All customers',
      status: 'New',
    };
    setCampaigns((prev) => [...prev, newCampaign]);
    setToast(`"${fd.projectName}" submitted`);
    setTimeout(() => setToast(null), 4000);
    return newId;
  };

  const fmtNow = () => {
    const d = new Date();
    const mon = d.toLocaleString('en-US', { month: 'short' });
    const day = d.getDate();
    const h = d.getHours();
    const m = d.getMinutes().toString().padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${mon} ${day}, ${h12}:${m} ${ampm}`;
  };

  const addSystemComment = (cid, text) => {
    setComments((prev) => ({
      ...prev,
      [cid]: [...(prev[cid] || []), { id: Date.now(), author: CURRENT_USER.name, text, date: new Date().toISOString() }],
    }));
  };

  const handleApprove = (campaignId, approvalKey, comment) => {
    const camp = campaigns.find((c) => c.id === campaignId);
    if (!camp) return;
    const stageApprovals = STAGE_APPROVALS[camp.stage] || [];
    const item = stageApprovals.find((a) => a.key === approvalKey);
    setApprovals((prev) => ({
      ...prev,
      [campaignId]: { ...(prev[campaignId] || {}), [approvalKey]: { by: CURRENT_USER.name, date: fmtNow() } },
    }));
    addSystemComment(campaignId, `✅ Approved "${item?.label || approvalKey}": ${comment}`);
    setToast(`Approved: ${item?.label || approvalKey}`);
    setTimeout(() => setToast(null), 4000);
  };

  const handleReject = (campaignId, approvalKey, targetStageKey, comment) => {
    const camp = campaigns.find((c) => c.id === campaignId);
    if (!camp) return;
    const currentStageIdx = STAGES.findIndex((s) => s.key === camp.stage);
    const targetStageIdx = STAGES.findIndex((s) => s.key === targetStageKey);
    const stageApprovals = STAGE_APPROVALS[camp.stage] || [];
    const item = stageApprovals.find((a) => a.key === approvalKey);
    const targetLabel = STAGES[targetStageIdx]?.label || targetStageKey;
    const currentLabel = STAGES[currentStageIdx]?.label || camp.stage;

    // Clear approvals from target stage through current stage
    setApprovals((prev) => {
      const next = { ...prev };
      const campApprovals = { ...(next[campaignId] || {}) };
      for (let i = targetStageIdx; i <= currentStageIdx; i++) {
        const stgKey = STAGES[i]?.key;
        if (stgKey) {
          (STAGE_APPROVALS[stgKey] || []).forEach((a) => {
            delete campApprovals[a.key];
          });
        }
      }
      next[campaignId] = campApprovals;
      return next;
    });

    // Move campaign to target stage
    setCampaigns((prev) =>
      prev.map((c) => (c.id === campaignId ? { ...c, stage: targetStageKey, days: 0 } : c))
    );

    addSystemComment(campaignId, `❌ Rejected "${item?.label || approvalKey}" — sent back to ${targetLabel}: ${comment}`);
    setToast(`Rejected — campaign sent back to ${targetLabel}`);
    setTimeout(() => setToast(null), 4000);
  };

  const handleAdvanceStage = (campaignId) => {
    const camp = campaigns.find((c) => c.id === campaignId);
    if (!camp) return;
    const currentIdx = STAGES.findIndex((s) => s.key === camp.stage);
    if (currentIdx < 0 || currentIdx >= STAGES.length - 1) return;
    const nextStage = STAGES[currentIdx + 1];
    const currentLabel = STAGES[currentIdx].label;

    setCampaigns((prev) =>
      prev.map((c) => (c.id === campaignId ? { ...c, stage: nextStage.key, days: 0 } : c))
    );

    addSystemComment(campaignId, `🚀 Campaign advanced from ${currentLabel} to ${nextStage.label}`);
    setToast(`Campaign advanced to ${nextStage.label}`);
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
                element={<DashboardPage campaigns={campaigns} approvals={approvals} onSelect={(campaign) => setSelected(campaign)} />}
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
                    onViewCampaign={(id) => {
                      setFormDirty(false);
                      routerNavigate(`/campaign/${id}`, { state: { from: 'Intake' } });
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
              <Route
                path="/completed"
                element={
                  <CompletedPage
                    campaigns={campaigns}
                    briefings={briefings}
                    onSelect={(id) => routerNavigate(`/campaign/${id}`, { state: { from: 'Completed' } })}
                  />
                }
              />
              <Route
                path="/campaign/:id"
                element={
                  <CampaignDetailPage
                    campaigns={campaigns}
                    approvals={approvals}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onAdvanceStage={handleAdvanceStage}
                    briefings={briefings}
                    onUploadBriefing={(campId, fileName) => {
                      setBriefings((prev) => ({
                        ...prev,
                        [campId]: { type: 'uploaded', fileName, uploadedBy: CURRENT_USER.name, uploadedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
                      }));
                      setToast('Briefing document uploaded');
                      setTimeout(() => setToast(null), 4000);
                    }}
                    onRemoveBriefing={(campId) => {
                      setBriefings((prev) => {
                        const next = { ...prev };
                        delete next[campId];
                        return next;
                      });
                      setToast('Team briefing removed — showing AI-generated brief');
                      setTimeout(() => setToast(null), 4000);
                    }}
                    comments={(() => {
                      const match = location.pathname.match(/\/campaign\/(\d+)/);
                      return match ? (comments[Number(match[1])] || []) : [];
                    })()}
                    onAddComment={(text) => {
                      const match = location.pathname.match(/\/campaign\/(\d+)/);
                      if (!match) return;
                      const cid = Number(match[1]);
                      setComments((prev) => {
                        const list = prev[cid] || [];
                        return {
                          ...prev,
                          [cid]: [...list, { id: Date.now(), author: CURRENT_USER.name, text, date: new Date().toISOString() }],
                        };
                      });
                    }}
                  />
                }
              />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>

      {selected && (
        <DetailPanel
          camp={selected}
          onClose={() => setSelected(null)}
          comments={comments[selected.id] || []}
          onAddComment={(text) => {
            setComments((prev) => {
              const list = prev[selected.id] || [];
              return {
                ...prev,
                [selected.id]: [...list, { id: Date.now(), author: CURRENT_USER.name, text, date: new Date().toISOString() }],
              };
            });
          }}
          onViewDetail={() => {
            const id = selected.id;
            const labels = { dashboard: 'Dashboard', tracker: 'Tracker', calendar: 'Calendar', mytasks: 'Campaigns', completed: 'Completed' };
            setSelected(null);
            routerNavigate(`/campaign/${id}`, { state: { from: labels[view] || 'Dashboard' } });
          }}
        />
      )}

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
