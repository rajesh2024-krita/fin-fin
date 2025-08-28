import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building,
  Users,
  UserPlus,
  CreditCard,
  Calendar,
  Receipt,
  BarChart3,
  FileText,
  ChartLine,
  LogOut,
} from "lucide-react";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

function NavItem({ href, icon, label }: NavItemProps) {
  const [location, setLocation] = useLocation();
  const isActive = location === href || (href === "/dashboard" && location === "/");

  return (
    <button
      onClick={() => setLocation(href)}
      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left ${
        isActive
          ? "bg-primary-foreground/10 text-primary-foreground font-medium"
          : "text-primary-foreground/80 hover:bg-primary-foreground/5 hover:text-primary-foreground"
      }`}
    >
      <span className="text-sm">{icon}</span>
      <span className="text-sm">{label}</span>
    </button>
  );
}

export function Sidebar() {
  const { user, logout } = useAuth();

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
            <p className="px-3 text-xs font-semibold uppercase tracking-wider opacity-70 mb-2">
              Main
            </p>

            <NavItem href="/dashboard" icon={<BarChart3 />} label="Dashboard" />

            {(user?.role === "SuperAdmin" || user?.role === "SocietyAdmin") && (
              <>
                <p className="px-3 text-xs font-semibold uppercase tracking-wider opacity-70 mb-2 mt-6">
                  Management
                </p>

                {user?.role === "SuperAdmin" && (
                  <NavItem href="/societies" icon={<Building />} label="Societies" />
                )}

                <NavItem href="/users" icon={<Users />} label="Users" />
                <NavItem href="/members" icon={<UserPlus />} label="Members" />
                <NavItem href="/loans" icon={<CreditCard />} label="Loans" />
                <NavItem href="/monthly-demand" icon={<Calendar />} label="Monthly Demand" />
                <NavItem href="/vouchers" icon={<Receipt />} label="Vouchers" />

                <p className="px-3 text-xs font-semibold uppercase tracking-wider opacity-70 mb-2 mt-6">
                  Reports
                </p>
                <NavItem href="/reports" icon={<FileText />} label="Reports" />
              </>
            )}
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