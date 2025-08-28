
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  UserCheck, 
  CreditCard, 
  Calculator, 
  Receipt, 
  FileText,
  ChevronLeft,
  TrendingUp,
  Shield
} from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();

  const navigationItems = [
    {
      section: "Overview",
      items: [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["Super Admin", "Society Admin", "User", "Member"] },
      ]
    },
    {
      section: "Management",
      items: [
        { name: "Societies", href: "/societies", icon: Building2, roles: ["Super Admin", "Society Admin"] },
        { name: "Users", href: "/users", icon: Users, roles: ["Super Admin", "Society Admin"] },
        { name: "Members", href: "/members", icon: UserCheck, roles: ["Super Admin", "Society Admin", "User"] },
      ]
    },
    {
      section: "Financial Operations",
      items: [
        { name: "Loans", href: "/loans", icon: CreditCard, roles: ["Super Admin", "Society Admin", "User"] },
        { name: "Monthly Demand", href: "/monthly-demand", icon: Calculator, roles: ["Super Admin", "Society Admin", "User"] },
        { name: "Vouchers", href: "/vouchers", icon: Receipt, roles: ["Super Admin", "Society Admin", "User"] },
      ]
    },
    {
      section: "Analytics",
      items: [
        { name: "Reports", href: "/reports", icon: FileText, roles: ["Super Admin", "Society Admin", "User"] },
      ]
    }
  ];

  const hasAccess = (roles: string[]) => {
    return user?.role && roles.includes(user.role);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Super Admin": return Shield;
      case "Society Admin": return Building2;
      case "User": return Users;
      case "Member": return UserCheck;
      default: return Users;
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full w-72 bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="sidebar-header relative">
            <div className="sidebar-logo">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
                <TrendingUp className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="sidebar-brand text-lg font-bold">Fintcs</span>
                <span className="sidebar-tagline text-xs opacity-80">Finance Management</span>
              </div>
            </div>
            
            {/* Close button for mobile */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 lg:hidden text-sidebar-foreground hover:bg-sidebar-accent/10"
              onClick={onClose}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>

          {/* User Info */}
          <div className="px-6 py-4 border-b border-sidebar-border">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-accent/20">
                {(() => {
                  const RoleIcon = getRoleIcon(user?.role || "");
                  return <RoleIcon className="h-5 w-5 text-sidebar-accent" />;
                })()}
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm font-medium text-sidebar-foreground truncate">
                  {user?.name || user?.username}
                </span>
                <Badge 
                  variant="outline" 
                  className="text-xs w-fit border-sidebar-accent/30 text-sidebar-accent bg-sidebar-accent/10"
                >
                  {user?.role}
                </Badge>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="sidebar-nav flex-1">
            <div className="space-y-6 py-4">
              {navigationItems.map((section, sectionIndex) => (
                <div key={sectionIndex} className="sidebar-nav-section">
                  <h3 className="sidebar-nav-heading">
                    {section.section}
                  </h3>
                  <div className="space-y-1">
                    {section.items
                      .filter(item => hasAccess(item.roles))
                      .map((item, itemIndex) => {
                        const isActive = location === item.href;
                        const Icon = item.icon;
                        
                        return (
                          <Button
                            key={itemIndex}
                            variant="ghost"
                            className={cn(
                              "sidebar-nav-item w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/10 hover:text-sidebar-accent-foreground",
                              isActive && "bg-sidebar-accent/20 text-sidebar-accent-foreground font-medium"
                            )}
                            onClick={() => {
                              setLocation(item.href);
                              onClose?.();
                            }}
                          >
                            <Icon className="h-4 w-4" />
                            <span>{item.name}</span>
                          </Button>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="border-t border-sidebar-border p-4">
            <div className="text-xs text-sidebar-foreground/70 text-center">
              © 2024 Fintcs v2.0
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
