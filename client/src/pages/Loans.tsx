import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LoanForm } from "@/components/forms/LoanForm";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { hasRole } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Eye, Edit, Trash2, Search, CheckCircle } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import type { Loan } from "@shared/schema";

const loanColumns: ColumnDef<Loan>[] = [
  {
    accessorKey: "loanNo",
    header: "Loan No.",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("loanNo")}</div>
    ),
  },
  {
    accessorKey: "name",
    header: "Member",
    cell: ({ row }) => (
      <div>
        <p className="text-sm font-medium">{row.getValue("name") || "N/A"}</p>
        <p className="text-xs text-muted-foreground">{row.original.edpNo || "N/A"}</p>
      </div>
    ),
  },
  {
    accessorKey: "loanAmount",
    header: "Loan Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("loanAmount") as string);
      return <div className="font-semibold">₹{amount.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "netLoan",
    header: "Net Loan",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("netLoan") as string || "0");
      return <div className="font-semibold">₹{amount.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "installments",
    header: "Installments",
  },
  {
    accessorKey: "installmentAmount",
    header: "Installment Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("installmentAmount") as string || "0");
      return <div>₹{amount.toLocaleString()}</div>;
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
    accessorKey: "paymentMode",
    header: "Payment Mode",
  },
  {
    accessorKey: "isValidated",
    header: "Status",
    cell: ({ row }) => {
      const isValidated = row.getValue("isValidated") as boolean;
      return (
        <Badge variant={isValidated ? "default" : "secondary"}>
          {isValidated ? "Validated" : "Pending"}
        </Badge>
      );
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
        <Button variant="ghost" size="sm" data-testid={`validate-loan-${row.original.id}`}>
          <CheckCircle className="h-4 w-4 text-secondary" />
        </Button>
        <Button variant="ghost" size="sm" data-testid={`delete-loan-${row.original.id}`}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    ),
  },
];

export default function Loans() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: loans = [], isLoading } = useQuery<Loan[]>({
    queryKey: ["/api", "loans"],
  });

  const createLoanMutation = useMutation({
    mutationFn: async (loanData: any) => {
      return await apiRequest("POST", "/api/loans", loanData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/loans"] });
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Loan created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create loan",
        variant: "destructive",
      });
    },
  });

  const canCreateLoan = hasRole(user?.role || "", ["SuperAdmin", "SocietyAdmin"]);
  const canSelectSociety = hasRole(user?.role || "", ["SuperAdmin"]);

  const filterOptions = [
    {
      key: "isValidated",
      label: "Status",
      options: [
        { label: "Validated", value: "true" },
        { label: "Pending", value: "false" },
      ],
    },
    {
      key: "paymentMode",
      label: "Payment Mode",
      options: [
        { label: "Cash", value: "Cash" },
        { label: "Cheque", value: "Cheque" },
        { label: "Opening", value: "Opening" },
      ],
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-hidden flex flex-col">
        <Header 
          title="Loan Management" 
          subtitle="Manage loan applications and disbursements" 
        />
        
        <div className="flex-1 overflow-y-auto p-6 bg-muted/30">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <h3 className="text-lg font-semibold text-foreground">Loan Applications</h3>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" data-testid="button-search-loan">
                      <Search className="w-4 h-4 mr-2" />
                      Search Loan
                    </Button>
                  </div>
                </div>
                {canCreateLoan && (
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button data-testid="button-add-loan">
                        <Plus className="w-4 h-4 mr-2" />
                        New Loan Entry
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>New Loan Application</DialogTitle>
                      </DialogHeader>
                      <LoanForm
                        onSubmit={(data) => createLoanMutation.mutate(data)}
                        isLoading={createLoanMutation.isPending}
                        onCancel={() => setIsDialogOpen(false)}
                        canSelectSociety={canSelectSociety}
                        defaultValues={{ societyId: canSelectSociety ? "" : user?.societyId }}
                      />
                    </DialogContent>
                  </Dialog>
                )}
              </div>

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="loading-spinner h-8 w-8"></div>
                </div>
              ) : (
                <DataTable
                  columns={loanColumns}
                  data={loans}
                  searchKey="name"
                  searchPlaceholder="Search loans..."
                  filters={filterOptions}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
