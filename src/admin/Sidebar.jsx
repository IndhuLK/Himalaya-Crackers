import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BookOpenText,
  ShoppingBag,
  Package,
  Images,
  LayoutDashboard,
  PlusCircle,
  ListChecks,
  ChevronDown,
  LogOut,
  BarChart,
} from 'lucide-react';
import { useState } from 'react';

const menus = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: <LayoutDashboard size={18} />,
  },
  {
    name: 'Items',
    icon: <Package size={18} />,
    isSubmenu: true,
    subItems: [
      {
        name: 'New Item',
        path: '/admin/add-product',
        icon: <PlusCircle size={16} />,
      },
      {
        name: 'Item List',
        path: '/admin/products',
        icon: <ListChecks size={16} />,
      },
    ],
  },
  { name: 'Inventory', path: '/admin/inventory', icon: <BarChart size={18} /> },
  {
    name: 'Sales Orders',
    path: '/admin/orders',
    icon: <ShoppingBag size={18} />,
  },
  {
    name: 'Store Sliders',
    path: '/admin/slider-management',
    icon: <Images size={18} />,
  },
];

export default function Sidebar({ isOpen, setIsOpen, isMobile }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedMenus, setExpandedMenus] = useState({ Items: true });

  const toggleSubmenu = (name) => {
    setExpandedMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const sidebarClasses = `
    bg-[#1f2937] text-slate-300 z-40 transition-all duration-300 flex flex-col shrink-0 border-r border-slate-700/60
    ${isMobile ? 'fixed top-0 left-0 h-screen shadow-2xl' : 'sticky top-0 h-screen'}
    ${isOpen ? 'translate-x-0 w-64' : `${isMobile ? '-translate-x-full w-64' : 'w-16'} xl:translate-x-0`}
  `;

  return (
    <>
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={sidebarClasses}>
        <div className="flex h-15 items-center border-b border-slate-700/60 px-4 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#0f6fff] text-white shrink-0">
            <BookOpenText size={16} />
          </div>
          {isOpen && (
            <div className="ml-3 truncate">
              <h2 className="text-sm font-semibold tracking-wide text-white">
                Himalaya Books
              </h2>
              <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">
                Sales Suite
              </p>
            </div>
          )}
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden px-2 py-4 customs-scrollbar">
          {menus.map((item, index) => {
            const isSubmenu = item.isSubmenu;
            const isActive = location.pathname === item.path;
            const isChildActive =
              isSubmenu &&
              item.subItems.some((sub) => location.pathname === sub.path);
            const isExpanded = expandedMenus[item.name];

            const activeClass =
              isActive || isChildActive
                ? 'bg-slate-800 text-white border border-slate-700 shadow-[inset_3px_0_0_0_#0f6fff]'
                : 'border border-transparent hover:bg-slate-800/70 hover:text-slate-100';

            if (isSubmenu) {
              return (
                <div key={index} className="flex flex-col">
                  <button
                    onClick={() =>
                      !isOpen ? setIsOpen(true) : toggleSubmenu(item.name)
                    }
                    className={`nav-item flex items-center justify-between rounded-md px-3 py-2.5 transition-colors ${activeClass} ${!isOpen ? 'justify-center' : ''}`}
                    title={!isOpen ? item.name : ''}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={
                          isChildActive ? 'text-[#58a6ff]' : 'text-slate-400'
                        }
                      >
                        {item.icon}
                      </span>
                      {isOpen && (
                        <span className="text-sm font-medium">{item.name}</span>
                      )}
                    </div>
                    {isOpen && (
                      <ChevronDown
                        size={14}
                        className={`text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    )}
                  </button>
                  {isOpen && isExpanded && (
                    <div className="ml-3 border-l border-slate-700/70 py-1">
                      {item.subItems.map((sub) => (
                        <Link
                          key={sub.path}
                          to={sub.path}
                          className={`block py-2 pl-6 pr-4 text-sm transition-colors ${location.pathname === sub.path ? 'font-medium text-[#58a6ff]' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={index}
                to={item.path}
                title={!isOpen ? item.name : ''}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors ${activeClass} ${!isOpen ? 'justify-center' : ''}`}
              >
                <span
                  className={isActive ? 'text-[#58a6ff]' : 'text-slate-400'}
                >
                  {item.icon}
                </span>
                {isOpen && (
                  <span className="text-sm font-medium">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-700/60 p-3 shrink-0">
          <button
            onClick={handleLogout}
            title={!isOpen ? 'Sign Out' : ''}
            className={`w-full flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-red-400/10 hover:text-red-300 ${!isOpen ? 'justify-center' : ''}`}
          >
            <LogOut size={18} />
            {isOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
