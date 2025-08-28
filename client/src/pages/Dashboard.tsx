import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { useAuth, getAuthHeaders } from "@/hooks/useAuth";
import { Building, Users, DollarSign, AlertTriangle, Plus, Eye, Edit, UserPlus, Receipt, Download } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

interface DashboardStats {
  totalSocieties: number;
  activeMembers: number;
  totalLoans: string;
  outstanding: string;
}

interface RecentLoan {
  id: string;
  loanNo: string;
  name: string;
  edpNo: string;
  loanAmount: string;
  loanType: string;
  status: string;
}

const loanColumns: ColumnDef<RecentLoan>[] = [
  {
    accessorKey: "loanNo",
    header: "Loan No.",
    cell: ({ row }) => (
      <div className="font-medium" data-testid={`loan-no-${row.original.id}`}>
        {row.getValue("loanNo")}
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Member",
    cell: ({ row }) => (
      <div>
        <p className="text-sm font-medium">{row.getValue("name")}</p>
        <p className="text-xs text-muted-foreground">{row.original.edpNo}</p>
      </div>
    ),
  },
  {
    accessorKey: "loanAmount",
    header: "Amount",
    cell: ({ row }) => (
      <div className="font-semibold">₹{row.getValue("loanAmount")}</div>
    ),
  },
  {
    accessorKey: "loanType",
    header: "Type",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const variant = status === "Approved" ? "default" : status === "Pending" ? "secondary" : "destructive";
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Button variant="ghost" size="sm" data-testid={`view-loan-${row.original.id}`}>
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" data-testid={`edit-loan-${row.original.id}`}>
          <Edit className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export default function Dashboard() {
  const { user } = useAuth();

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api", "dashboard", "stats"],
  });

  const { data: recentLoans = [], isLoading: loansLoading } = useQuery<RecentLoan[]>({
    queryKey: ["/api", "loans"],
    select: (loans: any[]) => {
      // Transform the data for display
      return loans.slice(0, 10).map((loan: any) => ({
        id: loan.id,
        loanNo: loan.loanNo,
        name: loan.name || "N/A",
        edpNo: loan.edpNo || "N/A",
        loanAmount: Number(loan.loanAmount).toLocaleString(),
        loanType: "Personal", // Would come from loan type lookup
        status: loan.isValidated ? "Approved" : "Pending",
      }));
    },
  });

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-hidden flex flex-col">
        <Header 
          title="Dashboard Overview" 
          subtitle="Welcome back, manage your finance operations" 
        />
        
        <div className="flex-1 overflow-y-auto p-6 bg-muted/30">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="card-hover" data-testid="stats-societies">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Societies</p>
                    <p className="text-3xl font-bold text-foreground">
                      {statsLoading ? "..." : stats?.totalSocieties || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Building className="text-primary text-xl" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-secondary font-medium">+2.5%</span>
                  <span className="text-muted-foreground ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover" data-testid="stats-members">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Members</p>
                    <p className="text-3xl font-bold text-foreground">
                      {statsLoading ? "..." : stats?.activeMembers || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <Users className="text-secondary text-xl" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-secondary font-medium">+5.1%</span>
                  <span className="text-muted-foreground ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover" data-testid="stats-loans">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Loans</p>
                    <p className="text-3xl font-bold text-foreground">
                      {statsLoading ? "..." : stats?.totalLoans || "₹0L"}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <DollarSign className="text-accent text-xl" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-secondary font-medium">+8.2%</span>
                  <span className="text-muted-foreground ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover" data-testid="stats-outstanding">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Outstanding</p>
                    <p className="text-3xl font-bold text-foreground">
                      {statsLoading ? "..." : stats?.outstanding || "₹0L"}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="text-destructive text-xl" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-destructive font-medium">-1.2%</span>
                  <span className="text-muted-foreground ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Loans */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-foreground">Recent Loan Applications</h3>
                    <Button variant="ghost" className="text-sm text-primary hover:text-primary/80 font-medium" data-testid="view-all-loans">
                      View All
                    </Button>
                  </div>
                  
                  {loansLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <DataTable
                      columns={loanColumns}
                      data={recentLoans.slice(0, 5)}
                      searchKey="name"
                      searchPlaceholder="Search loans..."
                    />
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions & Chart */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      data-testid="quick-action-new-loan"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      New Loan Entry
                    </Button>
                    
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      data-testid="quick-action-add-member"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Member
                    </Button>
                    
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      data-testid="quick-action-create-voucher"
                    >
                      <Receipt className="w-4 h-4 mr-2" />
                      Create Voucher
                    </Button>
                    
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      data-testid="quick-action-export-report"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export Report
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Loan Distribution Chart Placeholder */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Loan Distribution</h3>
                  <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                    <div className="text-center">
                      <DollarSign className="h-16 w-16 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Chart will be rendered here</p>
                      <p className="text-xs text-muted-foreground mt-1">Loan types distribution</p>
                    </div>
                  </div>
                  
                  {/* Legend */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                        <span className="text-sm">Personal</span>
                      </div>
                      <span className="text-sm font-medium">35%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-secondary rounded-full"></div>
                        <span className="text-sm">Housing</span>
                      </div>
                      <span className="text-sm font-medium">28%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-accent rounded-full"></div>
                        <span className="text-sm">Vehicle</span>
                      </div>
                      <span className="text-sm font-medium">22%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-muted-foreground rounded-full"></div>
                        <span className="text-sm">Others</span>
                      </div>
                      <span className="text-sm font-medium">15%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
