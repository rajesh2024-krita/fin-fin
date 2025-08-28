import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { Download, Printer, FileText, X, Filter } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import type { Loan } from "@shared/schema";

interface LoanReportData extends Loan {
  principal: number;
  interest: number;
  penal: number;
  total: number;
  dtLastPay?: string;
}

const loanReportColumns: ColumnDef<LoanReportData>[] = [
  {
    accessorKey: "edpNo",
    header: "EDP No",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("edpNo") || "-"}</div>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name") || "-"}</div>
    ),
  },
  {
    accessorKey: "loanAmount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("loanAmount") as string || "0");
      return <div className="text-right">₹{amount.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "loanDate",
    header: "Loan Date",
    cell: ({ row }) => {
      const date = row.getValue("loanDate") as string;
      return date ? new Date(date).toLocaleDateString() : "-";
    },
  },
  {
    accessorKey: "principal",
    header: "Principal",
    cell: ({ row }) => {
      const amount = row.getValue("principal") as number;
      return <div className="text-right">₹{amount.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "interest",
    header: "Interest",
    cell: ({ row }) => {
      const amount = row.getValue("interest") as number;
      return <div className="text-right">₹{amount.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "penal",
    header: "Penal",
    cell: ({ row }) => {
      const amount = row.getValue("penal") as number;
      return <div className="text-right">₹{amount.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => {
      const amount = row.getValue("total") as number;
      return <div className="text-right font-bold">₹{amount.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "dtLastPay",
    header: "Dt Last Pay",
    cell: ({ row }) => {
      const date = row.getValue("dtLastPay") as string;
      return date ? new Date(date).toLocaleDateString() : "-";
    },
  },
];

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState("loan-report");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  
  const { user } = useAuth();

  const { data: loanReports = [], isLoading: loansLoading } = useQuery<LoanReportData[]>({
    queryKey: ["/api", "loans", user?.societyId],
    select: (loans: Loan[]) => {
      // Transform loans into report data with calculated fields
      return loans.map((loan: Loan) => ({
        ...loan,
        principal: parseFloat(loan.loanAmount) * 0.8, // Example calculation
        interest: parseFloat(loan.loanAmount) * 0.15, // Example calculation  
        penal: parseFloat(loan.loanAmount) * 0.05, // Example calculation
        total: parseFloat(loan.loanAmount) * 1.0, // principal + interest + penal
        dtLastPay: undefined, // Would come from payment records
      }));
    },
    enabled: !!user?.societyId && selectedReport === "loan-report",
  });

  const handleExport = () => {
    // Implementation for exporting reports
    console.log("Exporting report...");
  };

  const handlePrint = () => {
    // Implementation for printing reports
    window.print();
  };

  const handleDefaultersList = () => {
    // Filter for defaulters (loans overdue)
    console.log("Showing defaulters list...");
  };

  const handleExcessLoanOverLimit = () => {
    // Filter for loans exceeding limits
    console.log("Showing excess loans over limit...");
  };

  const handleExcessRecovered = () => {
    // Filter for excess recovered amounts
    console.log("Showing excess recovered amounts...");
  };

  const totalAmount = loanReports.reduce((sum, loan) => sum + loan.total, 0);
  const totalPrincipal = loanReports.reduce((sum, loan) => sum + loan.principal, 0);
  const totalInterest = loanReports.reduce((sum, loan) => sum + loan.interest, 0);
  const totalPenal = loanReports.reduce((sum, loan) => sum + loan.penal, 0);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-hidden flex flex-col">
        <Header 
          title="Reports & Analytics" 
          subtitle="Generate and view financial reports and analysis" 
        />
        
        <div className="flex-1 overflow-y-auto p-6 bg-muted/30">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card className="stats-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="stats-label">Total Loans</p>
                    <p className="stats-value">{loanReports.length}</p>
                  </div>
                  <div className="stats-icon bg-primary/10">
                    <FileText className="text-primary text-lg" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="stats-label">Total Principal</p>
                    <p className="stats-value">₹{totalPrincipal.toFixed(0)}</p>
                  </div>
                  <div className="stats-icon bg-secondary/10">
                    <Download className="text-secondary text-lg" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="stats-label">Total Interest</p>
                    <p className="stats-value">₹{totalInterest.toFixed(0)}</p>
                  </div>
                  <div className="stats-icon bg-accent/10">
                    <Printer className="text-accent text-lg" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="stats-label">Total Outstanding</p>
                    <p className="stats-value">₹{totalAmount.toFixed(0)}</p>
                  </div>
                  <div className="stats-icon bg-destructive/10">
                    <X className="text-destructive text-lg" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Report Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Report Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reportType">Report Type</Label>
                  <Select value={selectedReport} onValueChange={setSelectedReport}>
                    <SelectTrigger data-testid="select-report-type">
                      <SelectValue placeholder="Select Report Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="loan-report">Loan Report</SelectItem>
                      <SelectItem value="member-report">Member Report</SelectItem>
                      <SelectItem value="society-report">Society Report</SelectItem>
                      <SelectItem value="voucher-report">Voucher Report</SelectItem>
                      <SelectItem value="monthly-demand-report">Monthly Demand Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dateFrom">Date From</Label>
                  <Input
                    id="dateFrom"
                    type="date"
                    value={filterDateFrom}
                    onChange={(e) => setFilterDateFrom(e.target.value)}
                    data-testid="input-date-from"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dateTo">Date To</Label>
                  <Input
                    id="dateTo"
                    type="date"
                    value={filterDateTo}
                    onChange={(e) => setFilterDateTo(e.target.value)}
                    data-testid="input-date-to"
                  />
                </div>
                
                <div className="flex items-end">
                  <Button data-testid="button-apply-filter">
                    <Filter className="w-4 h-4 mr-2" />
                    Apply Filter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Report Content */}
          <Tabs value={selectedReport} onValueChange={setSelectedReport}>
            <TabsList className="grid w-full grid-cols-5 max-w-3xl">
              <TabsTrigger value="loan-report">Loan Report</TabsTrigger>
              <TabsTrigger value="member-report">Members</TabsTrigger>
              <TabsTrigger value="society-report">Societies</TabsTrigger>
              <TabsTrigger value="voucher-report">Vouchers</TabsTrigger>
              <TabsTrigger value="monthly-demand-report">Demands</TabsTrigger>
            </TabsList>

            <TabsContent value="loan-report" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Loan Report</CardTitle>
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={handleDefaultersList} data-testid="button-defaulters-list">
                        Defaulter's List
                      </Button>
                      <Button variant="outline" onClick={handleExcessLoanOverLimit} data-testid="button-excess-loan">
                        Excess Loan Over Limit
                      </Button>
                      <Button variant="outline" onClick={handleExcessRecovered} data-testid="button-excess-recovered">
                        Excess Recovered G.Loan & E.Loan
                      </Button>
                      <Button variant="outline" onClick={handlePrint} data-testid="button-print-report">
                        <Printer className="w-4 h-4 mr-2" />
                        Print
                      </Button>
                      <Button variant="outline" onClick={handleExport} data-testid="button-export-report">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loansLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="loading-spinner h-8 w-8"></div>
                    </div>
                  ) : (
                    <DataTable
                      columns={loanReportColumns}
                      data={loanReports}
                      searchKey="name"
                      searchPlaceholder="Search loans..."
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="member-report" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Member Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    Member report functionality will be implemented here
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="society-report" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Society Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    Society report functionality will be implemented here
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="voucher-report" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Voucher Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    Voucher report functionality will be implemented here
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="monthly-demand-report" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Demand Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    Monthly demand report functionality will be implemented here
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
