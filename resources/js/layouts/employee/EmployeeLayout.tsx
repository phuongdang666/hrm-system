import { SidebarProvider, useSidebar } from "../../context/SidebarContext";
import AppHeader from "./EmployeeHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./EmployeeSidebar";

interface LayoutContentProps {
  children: React.ReactNode;
}


const LayoutContent: React.FC<LayoutContentProps> = ({ children }) => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <div className="min-h-screen xl:flex">
      <div>
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          {children} 
        </div>
      </div>
    </div>
  );
};

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
};

export default AppLayout;