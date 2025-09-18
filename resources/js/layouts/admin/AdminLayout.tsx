import React from "react";
import { SidebarProvider, useSidebar } from "../../context/SidebarContext";
import AdminHeader from "./AdminHeader";
import Backdrop from "./Backdrop";
import AdminSidebar from "./AdminSidebar";

type LayoutProps = {
  children: React.ReactNode;
};

const LayoutInner: React.FC<LayoutProps> = ({ children }) => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // left margin equals sidebar width when expanded/collapsed
  // keep these in sync with AdminSidebar: expanded = w-72 (18rem), collapsed = w-20 (5rem)
  const leftMarginClass = isExpanded || isHovered ? "lg:ml-72" : "lg:ml-20";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <AdminSidebar />
      <Backdrop />

      <div className={`${leftMarginClass} transition-all duration-300 ease-in-out`}>
        <AdminHeader />

        <main className="p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-6">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default function AdminLayout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <LayoutInner>{children}</LayoutInner>
    </SidebarProvider>
  );
}