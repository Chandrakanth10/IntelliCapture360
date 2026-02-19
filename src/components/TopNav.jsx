import { useEffect, useRef, useState } from 'react';
import { CURRENT_USER, I } from '../shared/campaignShared';

const TopNav = () => {
  const [mobileActionsOpen, setMobileActionsOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const notifications = [
    { id: 1, title: 'Pipeline alert', msg: '2 campaigns waiting for review', time: '3m ago' },
    { id: 2, title: 'Asset upload complete', msg: 'Fresh For Spring files processed', time: '11m ago' },
    { id: 3, title: 'Launch approaching', msg: 'Q1 Stock Up Sale in 3 days', time: 'Today' },
  ];

  useEffect(() => {
    const onDocClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    const onEsc = (e) => {
      if (e.key === 'Escape') { setNotifOpen(false); setProfileOpen(false); }
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  return (
    <header className="sticky top-0 flex w-full bg-white border-gray-200 z-40 lg:border-b h-12">
      <div className="flex flex-col items-center justify-between flex-grow lg:flex-row lg:px-4">
        <div className="flex items-center justify-end w-full gap-2 px-3 py-2.5 border-b border-gray-200 sm:gap-4 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileActionsOpen((v) => !v)}
            className="flex items-center justify-center w-8 h-8 text-slate-700 rounded-md hover:bg-slate-100 lg:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="5" cy="12" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="19" cy="12" r="2" />
            </svg>
          </button>
        </div>

        <div
          className={`${mobileActionsOpen ? 'flex' : 'hidden'} items-center justify-between w-full gap-3 px-4 py-2.5 lg:flex lg:justify-end lg:px-0 lg:py-0`}
        >
          <div className="flex items-center gap-2">
            <div ref={notifRef} className="relative">
              <button
                type="button"
                className="relative flex items-center justify-center text-slate-500 transition-colors rounded-md hover:text-slate-700 h-8 w-8 hover:bg-slate-100"
                onClick={() => { setNotifOpen((v) => !v); setProfileOpen(false); }}
              >
                <span className="absolute right-1 top-1 z-10 h-1.5 w-1.5 rounded-full bg-[#3ECF8E]" />
                <I n="bell" s={16} />
              </button>
              <div
                className={`absolute right-0 mt-2 flex w-[320px] max-w-[calc(100vw-1.25rem)] flex-col rounded-lg border border-slate-200 bg-white p-2 shadow-xl transition-all origin-top-right ${
                  notifOpen
                    ? 'opacity-100 visible translate-y-0'
                    : 'opacity-0 invisible -translate-y-1 pointer-events-none'
                }`}
              >
                <div className="flex items-center justify-between px-2 pb-2 mb-1 border-b border-slate-100">
                  <h5 className="text-[13px] font-semibold text-slate-800">Notifications</h5>
                  <button
                    type="button"
                    onClick={() => setNotifOpen(false)}
                    className="text-slate-500 hover:text-slate-700 p-0.5 rounded hover:bg-slate-100"
                  >
                    <I n="x" s={14} />
                  </button>
                </div>
                <ul className="flex flex-col max-h-64 overflow-y-auto scrollbar-thin">
                  {notifications.map((n) => (
                    <li key={n.id}>
                      <button
                        type="button"
                        className="w-full text-left flex gap-2.5 rounded-md p-2 hover:bg-slate-50 transition-colors"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#3ECF8E] flex-shrink-0" />
                        <span className="block">
                          <span className="mb-0.5 block text-[12px] text-slate-600">
                            <span className="font-medium text-slate-800">{n.title}</span> &middot; {n.msg}
                          </span>
                          <span className="text-[11px] text-slate-400">{n.time}</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-1.5 text-[12px] font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  View all notifications
                </button>
              </div>
            </div>
          </div>

          <div ref={profileRef} className="relative">
            <button
              type="button"
              onClick={() => { setProfileOpen((v) => !v); setNotifOpen(false); }}
              className="flex items-center text-slate-700 rounded-md hover:bg-slate-100 px-2 py-1 transition-colors"
            >
              <span className="mr-2 overflow-hidden rounded-md h-7 w-7 bg-indigo-500/15 flex items-center justify-center">
                <span className="text-[10px] font-semibold text-indigo-700">{CURRENT_USER.initials}</span>
              </span>
              <span className="hidden sm:block mr-1 font-medium text-[13px]">{CURRENT_USER.name.split(' ')[0]}</span>
              <svg
                className={`stroke-slate-500 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
                width="16"
                height="16"
                viewBox="0 0 18 20"
                fill="none"
              >
                <path
                  d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div
              className={`absolute right-0 mt-2 flex w-[240px] flex-col rounded-lg border border-slate-200 bg-white p-2 shadow-xl transition-all origin-top-right ${
                profileOpen
                  ? 'opacity-100 visible translate-y-0'
                  : 'opacity-0 invisible -translate-y-1 pointer-events-none'
              }`}
            >
              <div className="px-2 pb-2">
                <span className="block font-medium text-slate-700 text-[13px]">{CURRENT_USER.name}</span>
                <span className="mt-0.5 block text-[11px] text-slate-500">{CURRENT_USER.title}</span>
              </div>
              <ul className="flex flex-col gap-0.5 pt-2 pb-2 border-t border-slate-200">
                <li>
                  <button
                    type="button"
                    className="w-full flex items-center gap-2.5 px-2 py-1.5 font-medium text-slate-700 rounded-md text-[13px] hover:bg-slate-100 transition-colors"
                  >
                    <I n="user" s={14} />
                    My Profile
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="w-full flex items-center gap-2.5 px-2 py-1.5 font-medium text-slate-700 rounded-md text-[13px] hover:bg-slate-100 transition-colors"
                  >
                    <I n="settings" s={14} />
                    Account Settings
                  </button>
                </li>
              </ul>
              <button
                type="button"
                className="w-full flex items-center gap-2.5 px-2 py-1.5 mt-1 font-medium text-rose-600 rounded-md text-[13px] hover:bg-rose-50 transition-colors border-t border-slate-200 pt-2"
              >
                <I n="logout" s={14} />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
