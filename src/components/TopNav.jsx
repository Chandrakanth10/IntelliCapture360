import { useEffect, useRef, useState } from 'react';
import { CURRENT_USER, I } from '../shared/campaignShared';

const TopNav = ({ isDark, onToggleTheme }) => {
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
      if (e.key === 'Escape') {
        setNotifOpen(false);
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  const setThemeMode = (nextDark) => {
    if (Boolean(nextDark) !== Boolean(isDark)) {
      onToggleTheme?.();
    }
  };

  return (
    <header
      className="sticky top-0 z-40 h-16 border-b"
      style={{ borderColor: 'var(--sb-border)', background: 'color-mix(in srgb, var(--sb-bg-soft) 94%, transparent)', boxShadow: 'var(--sb-shadow-sm)' }}
    >
      <div className="h-full flex items-center justify-between px-3 sm:px-4">
        <div className="lg:hidden">
          <button
            type="button"
            onClick={() => setMobileActionsOpen((v) => !v)}
            className="flex items-center justify-center w-8 h-8 rounded-md border transition-colors hover:bg-[var(--sb-panel-2)] hover:text-[var(--sb-text)]"
            style={{ borderColor: 'var(--sb-border)', color: 'var(--sb-muted)', background: 'var(--sb-panel)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="5" cy="12" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="19" cy="12" r="2" />
            </svg>
          </button>
        </div>

        <div
          className={`${mobileActionsOpen ? 'flex' : 'hidden'} lg:flex items-center ml-auto gap-2`}
        >
          <div ref={notifRef} className="relative">
            <button
              type="button"
              className="relative flex items-center justify-center h-9 w-9 rounded-lg border transition-colors hover:bg-[var(--sb-panel-2)] hover:text-[var(--sb-text)]"
              style={{ borderColor: 'var(--sb-border)', color: 'var(--sb-muted)', background: 'var(--sb-panel)' }}
              onClick={() => {
                setNotifOpen((v) => !v);
                setProfileOpen(false);
              }}
            >
              <span className="absolute right-2 top-2 z-10 h-1.5 w-1.5 rounded-full bg-[var(--sb-accent)]" />
              <I n="bell" s={16} />
            </button>

            <div
              className={`absolute right-0 mt-2 flex w-[320px] max-w-[calc(100vw-1.25rem)] flex-col rounded-xl border p-2 shadow-xl transition-all origin-top-right ${
                notifOpen
                  ? 'opacity-100 visible translate-y-0'
                  : 'opacity-0 invisible -translate-y-1 pointer-events-none'
              }`}
              style={{ borderColor: 'var(--sb-border)', background: 'var(--sb-bg-soft)', boxShadow: 'var(--sb-shadow-md)' }}
            >
              <div className="flex items-center justify-between px-2 pb-2 mb-1 border-b" style={{ borderColor: 'var(--sb-border-soft)' }}>
                <h5 className="text-[13px] font-semibold text-[var(--sb-text-strong)]">Notifications</h5>
                <button
                  type="button"
                  onClick={() => setNotifOpen(false)}
                  className="p-0.5 rounded transition-colors hover:bg-[var(--sb-panel-2)] hover:text-[var(--sb-text)]"
                  style={{ color: 'var(--sb-muted)' }}
                >
                  <I n="x" s={14} />
                </button>
              </div>
              <ul className="flex flex-col max-h-64 overflow-y-auto scrollbar-thin">
                {notifications.map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      className="w-full text-left flex gap-2.5 rounded-lg p-2 transition-colors hover:bg-[var(--sb-panel-2)]"
                      style={{ color: 'var(--sb-text)' }}
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--sb-accent)] flex-shrink-0" />
                      <span className="block">
                        <span className="mb-0.5 block text-[12px] text-[var(--sb-muted)]">
                          <span className="font-medium text-[var(--sb-text-strong)]">{n.title}</span> &middot; {n.msg}
                        </span>
                        <span className="text-[11px] text-[var(--sb-muted-soft)]">{n.time}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="mt-1.5 w-full rounded-lg border px-3 py-1.5 text-[12px] font-medium transition-colors"
                style={{ borderColor: 'var(--sb-border)', color: 'var(--sb-text)', background: 'var(--sb-panel-2)' }}
              >
                View all notifications
              </button>
            </div>
          </div>

          <div ref={profileRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setProfileOpen((v) => !v);
                setNotifOpen(false);
              }}
              className="flex items-center rounded-lg border px-2.5 py-1.5 transition-colors hover:bg-[var(--sb-panel-2)]"
              style={{ borderColor: 'var(--sb-border)', color: 'var(--sb-text)', background: 'var(--sb-panel)' }}
            >
              <span className="mr-2 overflow-hidden rounded-md h-7 w-7 bg-indigo-500/15 flex items-center justify-center">
                <span className="text-[11px] font-semibold text-indigo-700">{CURRENT_USER.initials}</span>
              </span>
              <span className="hidden sm:block mr-1 font-medium text-[13px]">{CURRENT_USER.name.split(' ')[0]}</span>
              <svg
                className={`transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
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
              className={`absolute right-0 mt-2 flex w-[240px] flex-col rounded-xl border p-2 shadow-xl transition-all origin-top-right ${
                profileOpen
                  ? 'opacity-100 visible translate-y-0'
                  : 'opacity-0 invisible -translate-y-1 pointer-events-none'
              }`}
              style={{ borderColor: 'var(--sb-border)', background: 'var(--sb-bg-soft)', boxShadow: 'var(--sb-shadow-md)' }}
            >
              <div className="px-2 pb-2">
                <span className="block font-medium text-[var(--sb-text)] text-[13px]">{CURRENT_USER.name}</span>
                <span className="mt-0.5 block text-[11px] text-[var(--sb-muted)]">{CURRENT_USER.title}</span>
              </div>
              <ul className="flex flex-col gap-0.5 pt-2 pb-2 border-t" style={{ borderColor: 'var(--sb-border)' }}>
                <li>
                  <button
                    type="button"
                    className="w-full flex items-center gap-2.5 px-2 py-1.5 font-medium rounded-md text-[13px] transition-colors hover:bg-[var(--sb-panel-2)]"
                    style={{ color: 'var(--sb-text)' }}
                  >
                    <I n="user" s={14} />
                    My Profile
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="w-full flex items-center gap-2.5 px-2 py-1.5 font-medium rounded-md text-[13px] transition-colors hover:bg-[var(--sb-panel-2)]"
                    style={{ color: 'var(--sb-text)' }}
                  >
                    <I n="settings" s={14} />
                    Account Settings
                  </button>
                </li>
                <li className="px-2 py-1.5 rounded-md" style={{ background: 'var(--sb-panel-2)' }}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-[12px] font-medium text-[var(--sb-text)]">
                      <I n={isDark ? 'moon' : 'sun'} s={13} />
                      Theme
                    </span>
                    <div
                      role="group"
                      aria-label="Theme mode"
                      className="theme-mode-switch relative inline-grid grid-cols-2 items-center rounded-lg border p-0.5"
                      style={{ borderColor: 'var(--sb-border)', background: 'var(--sb-panel)' }}
                    >
                      <span
                        aria-hidden
                        className="theme-mode-switch__thumb pointer-events-none absolute left-0.5 top-0.5 h-[calc(100%-4px)] w-[calc(50%-2px)] rounded-md"
                        style={{
                          transform: isDark ? 'translateX(100%)' : 'translateX(0)',
                          background: 'var(--sb-accent)',
                          boxShadow: 'var(--sb-shadow-sm)',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setThemeMode(false)}
                        aria-pressed={!isDark}
                        className={`theme-mode-switch__btn relative z-10 px-2.5 py-1 rounded-md text-[11px] font-semibold ${!isDark ? 'is-active' : ''}`}
                        style={{ color: !isDark ? 'var(--sb-accent-contrast)' : 'var(--sb-muted-soft)' }}
                      >
                        Light
                      </button>
                      <button
                        type="button"
                        onClick={() => setThemeMode(true)}
                        aria-pressed={isDark}
                        className={`theme-mode-switch__btn relative z-10 px-2.5 py-1 rounded-md text-[11px] font-semibold ${isDark ? 'is-active' : ''}`}
                        style={{ color: isDark ? 'var(--sb-accent-contrast)' : 'var(--sb-muted-soft)' }}
                      >
                        Dark
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
              <button
                type="button"
                className="w-full flex items-center gap-2.5 px-2 py-1.5 mt-1 font-medium text-rose-600 rounded-md text-[13px] transition-colors border-t pt-2 hover:bg-rose-50"
                style={{ borderColor: 'var(--sb-border)' }}
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
