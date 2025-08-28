import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building,
  Users,
  UserCheck,
  DollarSign,
  Calendar,
  Receipt,
  BarChart3,
  LogOut,
  ChartLine,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    roles: ["SuperAdmin", "SocietyAdmin", "User", "Member"],
  },
  {
    name: "Societies",
    href: "/societies",
    icon: Building,
    roles: ["SuperAdmin", "SocietyAdmin"],
  },
  {
    name: "Users",
    href: "/users",
    icon: Users,
    roles: ["SuperAdmin", "SocietyAdmin"],
  },
  {
    name: "Members",
    href: "/members",
    icon: UserCheck,
    roles: ["SuperAdmin", "SocietyAdmin"],
  },
  {
    name: "Loan Entry",
    href: "/loans",
    icon: DollarSign,
    roles: ["SuperAdmin", "SocietyAdmin"],
  },
  {
    name: "Monthly Demand",
    href: "/monthly-demand",
    icon: Calendar,
    roles: ["SuperAdmin", "SocietyAdmin"],
  },
  {
    name: "Vouchers",
    href: "/vouchers",
    icon: Receipt,
    roles: ["SuperAdmin", "SocietyAdmin"],
  },
  {
    name: "Reports",
    href: "/reports",
    icon: BarChart3,
    roles: ["SuperAdmin", "SocietyAdmin", "User"],
  },
];

export function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const filteredNavigation = navigation.filter((item) =>
    item.roles.includes(user?.role || "")
  );

  return (
    <aside className="w-64 bg-primary text-primary-foreground flex-shrink-0 sidebar-transition">
      <div className="flex flex-col h-full">
        {/* Logo & Brand */}
        <div className="p-6 border-b border-primary/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <ChartLine className="text-accent-foreground text-lg" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Fintcs</h1>
              <p className="text-xs opacity-80">Finance Management</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-primary/20">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <Users className="text-white text-sm" />
            </div>
            <div>
              <p className="text-sm font-medium" data-testid="user-name">
                {user?.name}
              </p>
              <p className="text-xs opacity-70" data-testid="user-role">
                {user?.role}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-3">
            {filteredNavigation.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <a
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                      isActive
                        ? "bg-primary-foreground/10 text-primary-foreground"
                        : "hover:bg-primary-foreground/10"
                    )}
                    data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </a>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-primary/20">
          <Button
            onClick={logout}
            variant="ghost"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-destructive/20 text-destructive-foreground w-full transition-colors"
            data-testid="logout-button"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}
