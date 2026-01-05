import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Package,
  Images,
  LayoutDashboard,
  PlusCircle,
  ListChecks,
  ChevronDown,
  LogOut,
  Settings,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

const menus = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    name: "Product Management",
    icon: <Package size={20} />,
    isSubmenu: true,
    subItems: [
      { name: "Add Product", path: "/admin/add-product", icon: <PlusCircle size={18} /> },
      { name: "Products List", path: "/admin/products", icon: <ListChecks size={18} /> },
    ],
  },
  { name: "Inventory Management", path: "/admin/inventory", icon: <ShoppingBag size={20} /> },
  { name: "Orders Management", path: "/admin/orders", icon: <ShoppingBag size={20} /> },
  { name: "Slider Management", path: "/admin/slider-management", icon: <Images size={20} /> },
];

export default function Sidebar({ isOpen, setIsOpen, isMobile, navbarHeight = "top-0" }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedMenus, setExpandedMenus] = useState({ "Product Management": true });

  const toggleSubmenu = (name) => {
    setExpandedMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleLogout = () => {
    // Add logout logic here
    navigate("/login");
  };

  const sidebarClasses = `
    border-r border-slate-100 z-40 transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)]
    backdrop-blur-xl bg-white/90 shadow-[4px_0_24px_rgba(0,0,0,0.02)]
    ${isMobile ? "fixed top-0 left-0 h-screen" : `sticky ${navbarHeight} h-[calc(100vh-88px)] shrink-0`}
    ${isOpen ? "translate-x-0 w-72" : `${isMobile ? "-translate-x-full" : "w-20"} lg:translate-x-0`}
  `;

  return (
    <>
      {isOpen && isMobile && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-0 lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      <aside className={sidebarClasses}>
        <div className="flex flex-col h-full">
          {/* Brand Header */}
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white italic">H</div>
            {isOpen && (
              <div className="leading-tight">
                <h2 className="font-black text-blue-600 tracking-tighter">HIMALAYA</h2>
                <p className="text-[10px] font-bold text-orange-500 uppercase">Crackers Admin</p>
              </div>
            )}
          </div>

          <nav className="flex-1 px-4 space-y-1 overflow-y-auto customs-scrollbar">
            {menus.map((item, index) => {
              const isSubmenu = item.isSubmenu;
              const isActive = location.pathname === item.path;
              const isChildActive = isSubmenu && item.subItems.some(sub => location.pathname === sub.path);
              const isExpanded = expandedMenus[item.name];

              if (isSubmenu) {
                return (
                  <div key={index} className="space-y-1">
                    <button
                      onClick={() => !isOpen ? setIsOpen(true) : toggleSubmenu(item.name)}
                      className={`w-full flex items-center justify-between px-3 py-3 rounded-2xl transition-all ${isChildActive ? "bg-blue-50 text-blue-600" : "hover:bg-slate-50 text-slate-500"}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={isChildActive ? "text-blue-600" : "text-slate-400"}>{item.icon}</span>
                        {isOpen && <span className="text-sm font-bold">{item.name}</span>}
                      </div>
                      {isOpen && <ChevronDown size={14} className={`transition-transform ${isExpanded ? "rotate-180" : ""}`} />}
                    </button>
                    {isOpen && isExpanded && (
                      <div className="ml-9 space-y-1 border-l-2 border-slate-100 pl-4">
                        {item.subItems.map(sub => (
                          <Link key={sub.path} to={sub.path} className={`block py-2 text-sm font-medium ${location.pathname === sub.path ? "text-orange-500" : "text-slate-500 hover:text-blue-600"}`}>
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
                  className={`flex items-center gap-3 px-3 py-3 rounded-2xl transition-all ${isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-slate-500 hover:bg-slate-50"}`}
                >
                  <span className={isActive ? "text-white" : "text-slate-400"}>{item.icon}</span>
                  {isOpen && <span className="text-sm font-bold">{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-100">
            <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold text-sm">
              <LogOut size={20} />
              {isOpen && <span>Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}