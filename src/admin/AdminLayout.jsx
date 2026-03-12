import { useEffect, useRef, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  Bell,
  ChevronRight,
  CircleHelp,
  Command,
  Globe,
  LogOut,
  Menu,
  PanelLeft,
  Search,
  Settings,
  UserCircle,
} from 'lucide-react';
import { onAuthStateChanged, signOut } from 'firebase/auth';

import Sidebar from './Sidebar';
import { auth } from '../config/firebase';

export default function AdminLayout() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        navigate('/login');
      }
      setLoadingAuth(false);
    });

    return () => unsub();
  }, [navigate]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setIsOpen(!mobile);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  if (loadingAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f6f8] font-sans text-slate-900">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} isMobile={isMobile} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-15 items-center justify-between border-b border-slate-200 bg-white px-4 shrink-0 lg:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-3 lg:gap-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100 xl:hidden"
            >
              <Menu size={18} />
            </button>

            <div className="hidden items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-500 lg:flex">
              <PanelLeft size={14} className="text-slate-400" />
              Workspace
              <ChevronRight size={12} className="text-slate-300" />
              <span className="text-slate-800">Sales</span>
            </div>

            <div className="hidden max-w-xl flex-1 md:flex">
              <div className="flex w-full items-center rounded-md border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-blue-500 focus-within:bg-white">
                <Search size={15} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Search customers, items, invoices..."
                  className="ml-2 w-full border-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
                <span className="hidden items-center gap-1 rounded border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400 xl:inline-flex">
                  <Command size={10} />K
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-4">
            <button className="hidden rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 lg:inline-flex">
              New Order
            </button>

            <button className="rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100">
              <CircleHelp size={18} />
            </button>

            <button className="relative rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100">
              <Bell size={18} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500"></span>
            </button>

            <div className="h-6 w-px bg-slate-200"></div>

            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 rounded-md px-1.5 py-1 transition-colors hover:bg-slate-100"
              >
                <UserCircle size={24} className="text-slate-600" />
                <div className="hidden text-left md:flex md:flex-col">
                  <span className="text-xs font-semibold leading-none text-slate-700">
                    Admin User
                  </span>
                  <span className="mt-1 text-[10px] leading-none text-slate-400">
                    Himalaya Books
                  </span>
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 z-50 mt-2 w-56 rounded-md border border-slate-200 bg-white py-1 shadow-lg">
                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="text-sm font-medium text-slate-900">
                      Admin User
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {currentUser?.email || 'Loading...'}
                    </p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => navigate('/')}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <Globe size={16} className="text-slate-400" />
                      View Live Store
                    </button>
                    <button className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
                      <Settings size={16} className="text-slate-400" />
                      Account Settings
                    </button>
                  </div>

                  <div className="border-t border-slate-100 py-1">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={16} className="text-red-500" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#f5f6f8] p-4 md:p-5">
          <div className="mx-auto max-w-360">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
