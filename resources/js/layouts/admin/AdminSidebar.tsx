import React, { useMemo, useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { useSidebar } from "../../context/SidebarContext";
import { Home, Users, Layers, Clock, Megaphone, Wallet } from "lucide-react";

const AdminSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const { url } = usePage();
  const [query, setQuery] = useState("");

  // const isActive = (path: string) => url === path || url.startsWith(path + "/");
  const isActive = (path: string) => {
    const currentPath = window.location.pathname;
    return currentPath === path || currentPath.startsWith(path + "/");
  };


  const items = useMemo(
    () => [
      { name: "Dashboard", path: "/admin/dashboard", icon: <Home className="w-5 h-5" /> },
      { name: "Employees", path: "/admin/employees", icon: <Users className="w-5 h-5" /> },
      { name: "Departments", path: "/admin/departments", icon: <Layers className="w-5 h-5" /> },
      { name: "Attendance", path: "/admin/attendances", icon: <Clock className="w-5 h-5" /> },
      { name: "Announcements", path: "/admin/announcements", icon: <Megaphone className="w-5 h-5" /> },
      { name: "Payroll", path: "/admin/payrolls", icon: <Wallet className="w-5 h-5" /> },
    ],
    []
  );

  const filtered = items.filter((i) => i.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-50 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 transition-all duration-300 shadow-lg flex flex-col ${isExpanded || isHovered ? "w-72" : "w-20"} ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Primary navigation"
    >
      <div className="flex items-center justify-between gap-2 py-4 px-4 border-b border-gray-100 dark:border-gray-800">
        <Link href="/admin/dashboard" className={`flex items-center gap-3 ${isExpanded || isHovered ? "justify-start" : "justify-center"}`}>
          {/* Light-mode local logo + dark-mode fallback. Only one is visible via Tailwind classes. */}
          {isExpanded || isHovered ? (
            <>
              <img
                className="dark:hidden h-10 object-contain"
                src="/images/logo/secomus-light.png"
                alt="Secomus Technology"
                width={200}
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = "https://www.secomus.com/wp-content/uploads/2022/11/Secomus-logo-3.png"; }}
              />
              <img
                className="hidden dark:block h-10 object-contain"
                src="https://www.secomus.com/wp-content/uploads/2022/11/Secomus-logo-3.png"
                alt="Secomus Technology"
                width={200}
              />
            </>
          ) : (
            <>
              <img
                className="dark:hidden w-10 h-10 object-contain"
                src="/images/logo/secomus-light.png"
                alt="Secomus Technology"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = "https://www.secomus.com/wp-content/uploads/2022/11/Secomus-logo-3.png"; }}
              />
              <img
                className="hidden dark:block w-10 h-10 object-contain"
                src="https://www.secomus.com/wp-content/uploads/2022/11/Secomus-logo-3.png"
                alt="Secomus Technology"
              />
            </>
          )}
        </Link>

        {/* collapse/expand button */}
        <button
          onClick={() => toggleSidebar()}
          aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          className="hidden lg:inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
            {isExpanded ? (
              <path fillRule="evenodd" d="M6 4a1 1 0 011 1v10a1 1 0 11-2 0V5a1 1 0 011-1zm7 0a1 1 0 011 1v10a1 1 0 11-2 0V5a1 1 0 011-1z" clipRule="evenodd" />
            ) : (
              <path d="M4 6h12v2H4V6zm0 4h12v2H4v-2z" />
            )}
          </svg>
        </button>

        {/* mobile toggle */}
        <button
          onClick={() => toggleMobileSidebar()}
          aria-label="Toggle mobile sidebar"
          className="lg:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
            <path d="M3 6h14M3 10h14M3 14h14" />
          </svg>
        </button>
      </div>

      {/* search */}
      {(isExpanded || isHovered) && (
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
          <label htmlFor="sidebar-search" className="sr-only">Search</label>
          <div className="relative text-gray-400 focus-within:text-gray-600">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
            <input
              id="sidebar-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="w-full pl-10 pr-3 py-2 text-sm rounded-md border border-gray-100 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>
      )}

      <nav className="mt-3 px-2 overflow-y-auto pb-6">
        <ul className="space-y-1">
          {filtered.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                title={item.name}
                className={`group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all duration-200 ${isActive(item.path) ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 font-medium" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"} ${isExpanded || isHovered ? "justify-start" : "justify-center"} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400`}
              >
                <div
                  className={`relative flex items-center justify-center w-8 h-8 rounded-md ${isActive(item.path) ? "bg-indigo-100 text-indigo-600" : "text-gray-400 group-hover:text-gray-600"}`}
                  aria-hidden
                >
                  {item.icon}
                </div>

                {/* left active bar for expanded view */}
                {isActive(item.path) && (isExpanded || isHovered) && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-teal-400 to-indigo-500 rounded-tr-md rounded-br-md" />
                )}

                {(isExpanded || isHovered) && <span className="truncate">{item.name}</span>}

                {/* Tooltip for collapsed state */}
                {!isExpanded && !isHovered && (
                  <span className="sr-only">{item.name}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto p-4 border-t border-gray-100 dark:border-gray-800">
        {(isExpanded || isHovered) ? (
          <div className="flex items-center gap-3">
            <img src="/images/user/owner.jpg" alt="Admin" className="w-10 h-10 rounded-full ring-2 ring-white dark:ring-gray-900" />
            <div className="flex-1">
              <div className="text-sm font-semibold text-gray-800 dark:text-white">Admin</div>
              <div className="text-xs text-gray-500">Administrator</div>
            </div>
            <Link method="post" href="/admin/logout" className="text-xs text-red-500 hover:underline">Logout</Link>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <img src="/images/user/owner.jpg" alt="Admin" className="w-8 h-8 rounded-full" />
          </div>
        )}
      </div>
    </aside>
  );
};

export default AdminSidebar;