import { Bell, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="bg-card border-b border-border p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground" data-testid="page-title">
            {title}
          </h2>
          {subtitle && (
            <p className="text-muted-foreground" data-testid="page-subtitle">
              {subtitle}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {/* Notification Bell */}
          <Button
            variant="ghost"
            size="sm"
            className="relative p-2 rounded-lg hover:bg-muted transition-colors"
            data-testid="notifications-button"
          >
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full"></span>
          </Button>

          {/* Profile Dropdown */}
          <div className="flex items-center space-x-2" data-testid="user-profile">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-medium">
                {user?.name?.charAt(0) || "U"}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>
    </header>
  );
}
