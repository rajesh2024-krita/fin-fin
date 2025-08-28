import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { VoucherForm } from "@/components/forms/VoucherForm";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { hasRole } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Eye, Edit, Trash2, Search, Printer, RotateCcw } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import type { Voucher } from "@shared/schema";

const voucherColumns: ColumnDef<Voucher>[] = [
  {
    accessorKey: "voucherNo",
    header: "Voucher No.",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("voucherNo")}</div>
    ),
  },
  {
    id: "voucherType",
    header: "Type",
    cell: ({ row }) => (
      <div className="text-sm">-</div> // Would come from voucher type lookup
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = row.getValue("date") as string;
      return date ? new Date(date).toLocaleDateString() : "-";
    },
  },
  {
    accessorKey: "totalDebit",
    header: "Total Debit",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalDebit") as string || "0");
      return <div className="text-right font-semibold">₹{amount.toFixed(2)}</div>;
    },
  },
  {
    accessorKey: "totalCredit",
    header: "Total Credit",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalCredit") as string || "0");
      return <div className="text-right font-semibold">₹{amount.toFixed(2)}</div>;
    },
  },
  {
    accessorKey: "isBalanced",
    header: "Status",
    cell: ({ row }) => {
      const isBalanced = row.getValue("isBalanced") as boolean;
      return (
        <Badge variant={isBalanced ? "default" : "destructive"}>
          {isBalanced ? "Balanced" : "Unbalanced"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "chequeNo",
    header: "Cheque No.",
    cell: ({ row }) => {
      const chequeNo = row.getValue("chequeNo") as string;
      return <div className="text-sm">{chequeNo || "-"}</div>;
    },
  },
  {
    accessorKey: "narration",
    header: "Narration",
    cell: ({ row }) => {
      const narration = row.getValue("narration") as string;
      return (
        <div className="text-sm max-w-xs truncate" title={narration}>
          {narration || "-"}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Button variant="ghost" size="sm" data-testid={`view-voucher-${row.original.id}`}>
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" data-testid={`edit-voucher-${row.original.id}`}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" data-testid={`print-voucher-${row.original.id}`}>
          <Printer className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" data-testid={`reverse-voucher-${row.original.id}`}>
          <RotateCcw className="h-4 w-4 text-accent" />
        </Button>
        <Button variant="ghost" size="sm" data-testid={`delete-voucher-${row.original.id}`}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    ),
  },
];

export default function Vouchers() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: vouchers = [], isLoading } = useQuery<Voucher[]>({
    queryKey: ["/api", "vouchers"],
  });

  const createVoucherMutation = useMutation({
    mutationFn: async (voucherData: any) => {
      return await apiRequest("POST", "/api/vouchers", voucherData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vouchers"] });
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Voucher created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create voucher",
        variant: "destructive",
      });
    },
  });

  const canCreateVoucher = hasRole(user?.role || "", ["SuperAdmin", "SocietyAdmin"]);
  const canSelectSociety = hasRole(user?.role || "", ["SuperAdmin"]);

  const filterOptions = [
    {
      key: "isBalanced",
      label: "Status",
      options: [
        { label: "Balanced", value: "true" },
        { label: "Unbalanced", value: "false" },
      ],
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-hidden flex flex-col">
        <Header 
          title="Voucher Management" 
          subtitle="Create and manage financial vouchers and entries" 
        />
        
        <div className="flex-1 overflow-y-auto p-6 bg-muted/30">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card className="stats-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="stats-label">Total Vouchers</p>
                    <p className="stats-value">{vouchers.length}</p>
                  </div>
                  <div className="stats-icon bg-primary/10">
                    <Printer className="text-primary text-lg" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="stats-label">Balanced</p>
                    <p className="stats-value">{vouchers.filter(v => v.isBalanced).length}</p>
                  </div>
                  <div className="stats-icon bg-secondary/10">
                    <RotateCcw className="text-secondary text-lg" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="stats-label">Total Debit</p>
                    <p className="stats-value">
                      ₹{vouchers.reduce((sum, v) => sum + parseFloat(v.totalDebit || "0"), 0).toFixed(0)}
                    </p>
                  </div>
                  <div className="stats-icon bg-accent/10">
                    <Plus className="text-accent text-lg" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="stats-label">Total Credit</p>
                    <p className="stats-value">
                      ₹{vouchers.reduce((sum, v) => sum + parseFloat(v.totalCredit || "0"), 0).toFixed(0)}
                    </p>
                  </div>
                  <div className="stats-icon bg-destructive/10">
                    <Trash2 className="text-destructive text-lg" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <h3 className="text-lg font-semibold text-foreground">Financial Vouchers</h3>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" data-testid="button-search-voucher">
                      <Search className="w-4 h-4 mr-2" />
                      Search Voucher
                    </Button>
                  </div>
                </div>
                {canCreateVoucher && (
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button data-testid="button-create-voucher">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Voucher
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Create New Voucher</DialogTitle>
                      </DialogHeader>
                      <VoucherForm
                        onSubmit={(data) => createVoucherMutation.mutate(data)}
                        isLoading={createVoucherMutation.isPending}
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
                  columns={voucherColumns}
                  data={vouchers}
                  searchKey="voucherNo"
                  searchPlaceholder="Search vouchers..."
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
