import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MonthlyDemandForm } from "@/components/forms/MonthlyDemandForm";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { hasRole } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Plus, FileText, Printer, Save, RotateCcw, X, Download } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import type { MonthlyDemandHeader, MonthlyDemandRow } from "@shared/schema";

interface DemandRowData extends MonthlyDemandRow {
  memberName: string;
  edpNo: string;
}

const demandColumns: ColumnDef<DemandRowData>[] = [
  {
    accessorKey: "edpNo",
    header: "EDP No",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("edpNo")}</div>
    ),
  },
  {
    accessorKey: "memberName",
    header: "Member Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("memberName")}</div>
    ),
  },
  {
    accessorKey: "loanAmt",
    header: "Loan Amt",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("loanAmt") as string || "0");
      return <div className="text-right">₹{amount.toFixed(2)}</div>;
    },
  },
  {
    accessorKey: "cd",
    header: "CD",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("cd") as string || "0");
      return <div className="text-right">₹{amount.toFixed(2)}</div>;
    },
  },
  {
    accessorKey: "loan",
    header: "Loan",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("loan") as string || "0");
      return <div className="text-right">₹{amount.toFixed(2)}</div>;
    },
  },
  {
    accessorKey: "interest",
    header: "Interest",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("interest") as string || "0");
      return <div className="text-right">₹{amount.toFixed(2)}</div>;
    },
  },
  {
    accessorKey: "eLoan",
    header: "E-Loan",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("eLoan") as string || "0");
      return <div className="text-right">₹{amount.toFixed(2)}</div>;
    },
  },
  {
    accessorKey: "interestExtra",
    header: "Interest...",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("interestExtra") as string || "0");
      return <div className="text-right">₹{amount.toFixed(2)}</div>;
    },
  },
  {
    accessorKey: "net",
    header: "Net...",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("net") as string || "0");
      return <div className="text-right font-semibold">₹{amount.toFixed(2)}</div>;
    },
  },
  {
    accessorKey: "intDue",
    header: "IntDue",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("intDue") as string || "0");
      return <div className="text-right">₹{amount.toFixed(2)}</div>;
    },
  },
  {
    accessorKey: "totalAmount",
    header: "Total Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalAmount") as string || "0");
      return <div className="text-right font-bold">₹{amount.toFixed(2)}</div>;
    },
  },
];

const months = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
];

const years = Array.from({ length: 51 }, (_, i) => 2000 + i);

export default function MonthlyDemand() {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedHeader, setSelectedHeader] = useState<MonthlyDemandHeader | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("demand");
  
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: demandHeaders = [], isLoading: headersLoading } = useQuery<MonthlyDemandHeader[]>({
    queryKey: ["/api", "monthly-demand", "headers", user?.societyId],
    enabled: !!user?.societyId,
  });

  const { data: demandRows = [], isLoading: rowsLoading } = useQuery<DemandRowData[]>({
    queryKey: ["/api", "monthly-demand", "rows", selectedHeader?.id],
    enabled: !!selectedHeader?.id,
  });

  const createDemandMutation = useMutation({
    mutationFn: async (demandData: any) => {
      return await apiRequest("POST", "/api/monthly-demand", demandData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/monthly-demand/headers"] });
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Monthly demand created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create monthly demand",
        variant: "destructive",
      });
    },
  });

  const canManageDemand = hasRole(user?.role || "", ["SuperAdmin", "SocietyAdmin"]);

  const handleMonthYearChange = () => {
    if (selectedMonth && selectedYear) {
      const header = demandHeaders.find(h => 
        h.month === selectedMonth && h.year === parseInt(selectedYear)
      );
      setSelectedHeader(header || null);
    }
  };

  const handleNewDemand = () => {
    if (!selectedMonth || !selectedYear) {
      toast({
        title: "Selection Required",
        description: "Please select month and year first",
        variant: "destructive",
      });
      return;
    }
    setIsDialogOpen(true);
  };

  const totalMembers = demandRows.length;
  const totalAmount = demandRows.reduce((sum, row) => sum + parseFloat(row.totalAmount || "0"), 0);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-hidden flex flex-col">
        <Header 
          title="Monthly Demand Processing" 
          subtitle="Process monthly demands and member calculations" 
        />
        
        <div className="flex-1 overflow-y-auto p-6 bg-muted/30">
          {/* Controls */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Demand Processing</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" data-testid="button-excel-export">
                    <Download className="w-4 h-4 mr-2" />
                    Excel
                  </Button>
                  <Button variant="outline" data-testid="button-print-demand">
                    <Printer className="w-4 h-4 mr-2" />
                    Print
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="month">Month</Label>
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger data-testid="select-month">
                      <SelectValue placeholder="Select Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month} value={month}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger data-testid="select-year">
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end">
                  <Button onClick={handleMonthYearChange} data-testid="button-load-demand">
                    <FileText className="w-4 h-4 mr-2" />
                    Load Demand
                  </Button>
                </div>
                
                {canManageDemand && (
                  <div className="flex items-end">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button onClick={handleNewDemand} data-testid="button-new-demand">
                          <Plus className="w-4 h-4 mr-2" />
                          New
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Create New Monthly Demand</DialogTitle>
                        </DialogHeader>
                        <MonthlyDemandForm
                          onSubmit={(data) => createDemandMutation.mutate({
                            ...data,
                            month: selectedMonth,
                            year: parseInt(selectedYear),
                            societyId: user?.societyId,
                          })}
                          isLoading={createDemandMutation.isPending}
                          onCancel={() => setIsDialogOpen(false)}
                          defaultValues={{
                            month: selectedMonth,
                            year: selectedYear,
                          }}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="demand">Demand</TabsTrigger>
              <TabsTrigger value="closing">Month Closing</TabsTrigger>
            </TabsList>

            <TabsContent value="demand" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Demand Table</CardTitle>
                  {selectedHeader && (
                    <div className="text-sm text-muted-foreground">
                      {selectedHeader.month} {selectedHeader.year}
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  {headersLoading || rowsLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="loading-spinner h-8 w-8"></div>
                    </div>
                  ) : selectedHeader ? (
                    <>
                      <DataTable
                        columns={demandColumns}
                        data={demandRows}
                        searchKey="memberName"
                        searchPlaceholder="Search members..."
                      />
                      
                      {/* Summary */}
                      <div className="mt-6 pt-4 border-t">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card>
                            <CardContent className="pt-4">
                              <div className="text-center">
                                <p className="text-sm font-medium text-muted-foreground">Total No. of Members</p>
                                <p className="text-2xl font-bold" data-testid="total-members">{totalMembers}</p>
                              </div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="pt-4">
                              <div className="text-center">
                                <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                                <p className="text-2xl font-bold" data-testid="total-amount">₹{totalAmount.toFixed(2)}</p>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Select month and year to view demand data
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Member Section */}
              {selectedHeader && (
                <Card>
                  <CardHeader>
                    <CardTitle>Member Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="memberEdpNo">EDP No</Label>
                        <Input
                          id="memberEdpNo"
                          placeholder="Enter EDP number"
                          data-testid="input-member-edp"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="memberName">Name</Label>
                        <Input
                          id="memberName"
                          placeholder="Member name"
                          data-testid="input-member-name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="memberLoan">Loan</Label>
                        <Input
                          id="memberLoan"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          data-testid="input-member-loan"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="memberEmrgLoan">Emrg. Loan</Label>
                        <Input
                          id="memberEmrgLoan"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          data-testid="input-member-emrg-loan"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="memberIntDue">Int due</Label>
                        <Input
                          id="memberIntDue"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          data-testid="input-member-int-due"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="memberLasIntDue">LAS Int due</Label>
                        <Input
                          id="memberLasIntDue"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          data-testid="input-member-las-int-due"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="memberCd">CD</Label>
                        <Input
                          id="memberCd"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          data-testid="input-member-cd"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="memberInterest">Interest</Label>
                        <Input
                          id="memberInterest"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          data-testid="input-member-interest"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="memberPInt">P. Int</Label>
                        <Input
                          id="memberPInt"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          data-testid="input-member-p-int"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="memberPDed">P. ded</Label>
                        <Input
                          id="memberPDed"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          data-testid="input-member-p-ded"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="memberLas">LAS</Label>
                        <Input
                          id="memberLas"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          data-testid="input-member-las"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="memberTotalAmount">Total Amount (Auto)</Label>
                        <Input
                          id="memberTotalAmount"
                          value="0.00"
                          disabled
                          className="bg-muted"
                          data-testid="display-member-total"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              {canManageDemand && selectedHeader && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-end space-x-3">
                      <Button variant="outline" data-testid="button-save-demand">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button variant="outline" data-testid="button-clear-demand">
                        Clear
                      </Button>
                      <Button variant="outline" data-testid="button-reset-demand">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset
                      </Button>
                      <Button variant="outline" data-testid="button-close-demand">
                        <X className="w-4 h-4 mr-2" />
                        Close
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="closing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Month Closing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    Month closing functionality will be implemented here
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
