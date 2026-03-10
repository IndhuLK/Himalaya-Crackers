import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Package,
  Images,
  LayoutDashboard,
  PlusCircle,
  ListChecks,
  ChevronDown,
  LogOut,
  BarChart,
  Settings,
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
    bg-[#1e222d] text-gray-300 z-40 transition-all duration-300 flex flex-col shrink-0
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
        {/* Brand Header */}
        <div className="h-16 flex items-center px-4 border-b border-gray-700/50 shrink-0">
          <div className="w-8 h-8 rounded shrink-0 bg-blue-600 flex items-center justify-center font-bold text-white text-lg">
            H
          </div>
          {isOpen && (
            <div className="ml-3 truncate">
              <h2 className="font-semibold text-white tracking-wide text-sm">
                Himalaya Books
              </h2>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                Enterprise Ed.
              </p>
            </div>
          )}
        </div>

        <nav className="flex-1 py-4 space-y-1 overflow-y-auto overflow-x-hidden customs-scrollbar">
          {menus.map((item, index) => {
            const isSubmenu = item.isSubmenu;
            const isActive = location.pathname === item.path;
            const isChildActive =
              isSubmenu &&
              item.subItems.some((sub) => location.pathname === sub.path);
            const isExpanded = expandedMenus[item.name];

            const activeClass =
              isActive || isChildActive
                ? 'bg-[#2b303b] text-white border-l-4 border-blue-500'
                : 'border-l-4 border-transparent hover:bg-[#2b303b]/50 hover:text-gray-100';

            if (isSubmenu) {
              return (
                <div key={index} className="flex flex-col">
                  <button
                    onClick={() =>
                      !isOpen ? setIsOpen(true) : toggleSubmenu(item.name)
                    }
                    className={`nav-item flex items-center justify-between px-3 py-2.5 transition-colors ${activeClass} ${!isOpen ? 'justify-center' : ''}`}
                    title={!isOpen ? item.name : ''}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={
                          isChildActive ? 'text-blue-400' : 'text-gray-400'
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
                        className={`text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    )}
                  </button>
                  {isOpen && isExpanded && (
                    <div className="bg-[#181a24] py-1">
                      {item.subItems.map((sub) => (
                        <Link
                          key={sub.path}
                          to={sub.path}
                          className={`block py-2 pl-12 pr-4 text-sm transition-colors ${location.pathname === sub.path ? 'text-blue-400 font-medium' : 'text-gray-400 hover:text-gray-200'}`}
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
                className={`flex items-center gap-3 px-3 py-2.5 transition-colors ${activeClass} ${!isOpen ? 'justify-center' : ''}`}
              >
                <span className={isActive ? 'text-blue-400' : 'text-gray-400'}>
                  {item.icon}
                </span>
                {isOpen && (
                  <span className="text-sm font-medium">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-700/50 shrink-0">
          <button
            onClick={handleLogout}
            title={!isOpen ? 'Sign Out' : ''}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors text-sm font-medium ${!isOpen ? 'justify-center' : ''}`}
          >
            <LogOut size={18} />
            {isOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
