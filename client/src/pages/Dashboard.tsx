
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Building, 
  Users, 
  UserCheck, 
  CreditCard, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Activity,
  Calendar,
  ExternalLink,
  RefreshCw,
  Filter,
  MoreVertical
} from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useAuth } from "@/hooks/useAuth";

interface DashboardStats {
  totalSocieties: number;
  totalUsers: number;
  totalMembers: number;
  totalLoans: number;
  totalLoanAmount: number;
  activeDemands: number;
  pendingVouchers: number;
  monthlyGrowth: number;
}

interface RecentLoan {
  id: string;
  loanNo: string;
  name: string;
  edpNo: string;
  loanAmount: string;
  loanType: string;
  status: string;
  date: string;
}

interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: any;
  color: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useQuery<DashboardStats>({
    queryKey: ["/api", "dashboard", "stats"],
  });

  const { data: recentLoans = [], isLoading: loansLoading } = useQuery<RecentLoan[]>({
    queryKey: ["/api", "loans"],
    select: (loans: any[]) => {
      return loans.slice(0, 6).map((loan: any) => ({
        id: loan.id,
        loanNo: loan.loanNo,
        name: loan.name || "N/A",
        edpNo: loan.edpNo || "N/A",
        loanAmount: Number(loan.loanAmount).toLocaleString(),
        loanType: "Personal",
        status: loan.isValidated ? "Approved" : "Pending",
        date: new Date().toLocaleDateString(),
      }));
    },
  });

  const quickActions: QuickAction[] = [
    {
      title: "New Member",
      description: "Register a new society member",
      href: "/members",
      icon: UserCheck,
      color: "bg-emerald-500"
    },
    {
      title: "Process Loan",
      description: "Create or process loan applications",
      href: "/loans",
      icon: CreditCard,
      color: "bg-blue-500"
    },
    {
      title: "Monthly Demand",
      description: "Calculate monthly demands",
      href: "/monthly-demand",
      icon: Calendar,
      color: "bg-purple-500"
    },
    {
      title: "Generate Report",
      description: "View financial reports and analytics",
      href: "/reports",
      icon: Activity,
      color: "bg-orange-500"
    }
  ];

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    const name = user?.name || user?.username;
    
    if (hour < 12) return `Good morning, ${name}`;
    if (hour < 18) return `Good afternoon, ${name}`;
    return `Good evening, ${name}`;
  };

  const StatsCard = ({ title, value, change, changeType, icon: Icon, isLoading }: {
    title: string;
    value: string | number;
    change: string;
    changeType: 'positive' | 'negative' | 'neutral';
    icon: any;
    isLoading: boolean;
  }) => (
    <Card className="stats-card hover:shadow-lg transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="stats-label text-muted-foreground font-medium">{title}</p>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <p className="stats-value">{value}</p>
            )}
            <div className={`stats-change flex items-center space-x-1 ${
              changeType === 'positive' ? 'stats-change-positive' : 
              changeType === 'negative' ? 'stats-change-negative' : 
              'text-muted-foreground'
            }`}>
              {changeType === 'positive' && <TrendingUp className="h-3 w-3" />}
              {changeType === 'negative' && <TrendingDown className="h-3 w-3" />}
              <span className="text-sm font-medium">{change}</span>
            </div>
          </div>
          <div className={`stats-icon ${
            changeType === 'positive' ? 'bg-emerald-100 text-emerald-600' :
            changeType === 'negative' ? 'bg-red-100 text-red-600' :
            'bg-blue-100 text-blue-600'
          }`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-1 overflow-hidden flex flex-col">
        <Header 
          title={getWelcomeMessage()}
          subtitle="Here's what's happening with your finance operations today"
          onMenuClick={() => setSidebarOpen(true)}
        />
        
        <div className="flex-1 overflow-y-auto bg-muted/30">
          <div className="p-4 lg:p-6 space-y-6">
            {/* Stats Overview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold tracking-tight">Overview</h2>
                <Button variant="outline" size="sm" onClick={() => refetchStats()}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <StatsCard
                  title="Total Societies"
                  value={stats?.totalSocieties || 0}
                  change="+2.5% from last month"
                  changeType="positive"
                  icon={Building}
                  isLoading={statsLoading}
                />
                <StatsCard
                  title="Active Members"
                  value={stats?.totalMembers || 0}
                  change="+12% from last month"
                  changeType="positive"
                  icon={UserCheck}
                  isLoading={statsLoading}
                />
                <StatsCard
                  title="Total Loans"
                  value={stats?.totalLoans || 0}
                  change="+8.2% from last month"
                  changeType="positive"
                  icon={CreditCard}
                  isLoading={statsLoading}
                />
                <StatsCard
                  title="Loan Amount"
                  value={`₹${(stats?.totalLoanAmount || 0).toLocaleString()}`}
                  change="+15.3% from last month"
                  changeType="positive"
                  icon={DollarSign}
                  isLoading={statsLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Recent Loans */}
              <div className="xl:col-span-2">
                <Card className="h-full">
                  <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <div>
                      <CardTitle className="text-lg font-semibold">Recent Loans</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">Latest loan applications and approvals</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-0">
                      {loansLoading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="flex items-center justify-between p-4 border-b last:border-b-0">
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                            <Skeleton className="h-6 w-16" />
                          </div>
                        ))
                      ) : recentLoans.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No recent loans found</p>
                        </div>
                      ) : (
                        recentLoans.map((loan) => (
                          <div key={loan.id} className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <p className="font-medium text-sm">{loan.name}</p>
                                <Badge variant="outline" className="text-xs">
                                  {loan.loanNo}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                EDP: {loan.edpNo} • {loan.loanType}
                              </p>
                            </div>
                            <div className="text-right space-y-1">
                              <p className="font-semibold text-sm">₹{loan.loanAmount}</p>
                              <Badge 
                                variant={loan.status === "Approved" ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {loan.status}
                              </Badge>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
                    <p className="text-sm text-muted-foreground">Common tasks and operations</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {quickActions.map((action, index) => {
                      const Icon = action.icon;
                      return (
                        <Button
                          key={index}
                          variant="ghost"
                          className="w-full justify-start h-auto p-3 hover:bg-muted"
                          onClick={() => window.location.href = action.href}
                        >
                          <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mr-3`}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-sm">{action.title}</p>
                            <p className="text-xs text-muted-foreground">{action.description}</p>
                          </div>
                        </Button>
                      );
                    })}
                  </CardContent>
                </Card>

                {/* System Status */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold">System Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Database</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="text-xs text-muted-foreground">Online</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">API Services</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="text-xs text-muted-foreground">Online</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Backup Status</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-xs text-muted-foreground">Pending</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
