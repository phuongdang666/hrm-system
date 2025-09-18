import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@inertiajs/react"; // Thay đổi import này
import { usePage } from "@inertiajs/react"; // Thêm import để lấy current URL

// Assume these icons are imported from an icon library
import { Box, Calendar, ChevronDown, Grid, MoreHorizontal, List, FileText, BarChart2, Plug, Layout, User } from "lucide-react";
import { useSidebar } from "../../context/SidebarContext";


type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <Grid className="w-5 h-5" />,
    name: "Dashboard",
    subItems: [{ name: "Ecommerce", path: "/", pro: false }],
  },
  {
    icon: <Calendar className="w-5 h-5" />,
    name: "Calendar",
    path: "/calendar",
  },
  {
    icon: <User className="w-5 h-5" />,
    name: "User Profile",
    path: "/profile",
  },
  {
    name: "Forms",
    icon: <List className="w-5 h-5" />,
    subItems: [{ name: "Form Elements", path: "/form-elements", pro: false }],
  },
  {
    name: "Tables",
    icon: <Layout className="w-5 h-5" />,
    subItems: [{ name: "Basic Tables", path: "/basic-tables", pro: false }],
  },
  {
    name: "Pages",
    icon: <FileText className="w-5 h-5" />,
    subItems: [
      { name: "Blank Page", path: "/blank", pro: false },
      { name: "404 Error", path: "/error-404", pro: false },
    ],
  },
];

const othersItems: NavItem[] = [
  {
    icon: <BarChart2 className="w-5 h-5" />,
    name: "Charts",
    subItems: [
      { name: "Line Chart", path: "/line-chart", pro: false },
      { name: "Bar Chart", path: "/bar-chart", pro: false },
    ],
  },
  {
    icon: <Box className="w-5 h-5" />,
    name: "UI Elements",
    subItems: [
      { name: "Alerts", path: "/alerts", pro: false },
      { name: "Avatar", path: "/avatars", pro: false },
      { name: "Badge", path: "/badge", pro: false },
      { name: "Buttons", path: "/buttons", pro: false },
      { name: "Images", path: "/images", pro: false },
      { name: "Videos", path: "/videos", pro: false },
    ],
  },
  {
    icon: <Plug className="w-5 h-5" />,
    name: "Authentication",
    subItems: [
      { name: "Sign In", path: "/signin", pro: false },
      { name: "Sign Up", path: "/signup", pro: false },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const { url } = usePage(); // Lấy current URL từ Inertia

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Sử dụng current URL từ Inertia thay vì useLocation
  const isActive = useCallback(
    (path: string) => url === path || url.startsWith(path + '/'),
    [url]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [url, isActive]); // Sử dụng url thay vì location

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`group cursor-pointer flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-150 ${openSubmenu?.type === menuType && openSubmenu?.index === index ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 font-medium" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"} ${!isExpanded && !isHovered ? "justify-center" : "justify-start"} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400`}
            >
              <span className={`flex items-center justify-center w-8 h-8 rounded-md ${openSubmenu?.type === menuType && openSubmenu?.index === index ? "bg-indigo-100 text-indigo-600" : "text-gray-400 group-hover:text-gray-600"}`}>
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="truncate">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDown className={`ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu?.type === menuType && openSubmenu?.index === index ? "rotate-180 text-brand-500" : ""}`} />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path} // Thay to bằng href
                className={`group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-150 ${isActive(nav.path) ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 font-medium" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400`}
              >
                <span className={`flex items-center justify-center w-8 h-8 rounded-md ${isActive(nav.path) ? "bg-indigo-100 text-indigo-600" : "text-gray-400 group-hover:text-gray-600"}`}>
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="truncate">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path} // Thay to bằng href
                      className={`menu-dropdown-item ${isActive(subItem.path)
                        ? "menu-dropdown-item-active"
                        : "menu-dropdown-item-inactive"
                        }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
 
  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-4 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 ${isExpanded || isHovered ? "w-72" : "w-20"} ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`py-6 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"} flex`}>
        <Link href="/">
          {/* Light-mode local logo + dark-mode fallback */}
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img className="dark:hidden h-10 object-contain w-auto" src="/images/logo/secomus-light.png" alt="Secomus Technology" width={220} height={60} onError={(e) => { (e.currentTarget as HTMLImageElement).src = "https://www.secomus.com/wp-content/uploads/2022/11/Secomus-logo-3.png" }} />
              <img className="hidden dark:block h-10 object-contain w-auto" src="https://www.secomus.com/wp-content/uploads/2022/11/Secomus-logo-3.png" alt="Secomus Technology" width={220} height={60} />
            </>
          ) : (
            <>
              <img src="/images/logo/secomus-light.png" alt="Secomus Technology" width={40} height={40} className="w-10 h-10 object-contain dark:hidden" onError={(e) => { (e.currentTarget as HTMLImageElement).src = "https://www.secomus.com/wp-content/uploads/2022/11/Secomus-logo-3.png" }} />
              <img src="https://www.secomus.com/wp-content/uploads/2022/11/Secomus-logo-3.png" alt="Secomus Technology" width={40} height={40} className="w-10 h-10 object-contain hidden dark:block" />
            </>
          )}
        </Link>
      </div>

      <div className="flex flex-col overflow-y-auto pb-6 no-scrollbar">
        <nav className="mb-6 px-1">
          <div className="flex flex-col gap-6">
            <div>
              <h2 className={`mb-3 text-xs uppercase leading-[18px] text-gray-400 ${!isExpanded && !isHovered ? "justify-center" : "justify-start"} flex items-center gap-2`}>
                {isExpanded || isHovered || isMobileOpen ? "Menu" : <MoreHorizontal className="w-4 h-4" />}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
            <div>
              <h2 className={`mb-3 text-xs uppercase leading-[18px] text-gray-400 ${!isExpanded && !isHovered ? "justify-center" : "justify-start"} flex items-center gap-2`}>
                {isExpanded || isHovered || isMobileOpen ? "Others" : <MoreHorizontal className="w-4 h-4" />}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;