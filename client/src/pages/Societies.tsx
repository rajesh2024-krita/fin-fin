import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SocietyForm } from "@/components/forms/SocietyForm";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { hasRole } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Eye, Edit, Users, Trash2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import type { Society } from "@shared/schema";

const societyColumns: ColumnDef<Society>[] = [
  {
    accessorKey: "name",
    header: "Society Name",
    cell: ({ row }) => (
      <div>
        <p className="text-sm font-medium">{row.getValue("name")}</p>
        <p className="text-xs text-muted-foreground">{row.original.address}</p>
      </div>
    ),
  },
  {
    accessorKey: "registrationNo",
    header: "Registration No.",
  },
  {
    accessorKey: "city",
    header: "City",
  },
  {
    id: "memberCount",
    header: "Members",
    cell: () => (
      <div className="font-medium">-</div>
    ),
  },
  {
    id: "admin",
    header: "Admin",
    cell: () => (
      <div className="text-sm">-</div>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      return (
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Button variant="ghost" size="sm" data-testid={`view-society-${row.original.id}`}>
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" data-testid={`edit-society-${row.original.id}`}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" data-testid={`members-society-${row.original.id}`}>
          <Users className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" data-testid={`delete-society-${row.original.id}`}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    ),
  },
];

export default function Societies() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: societies = [], isLoading } = useQuery<Society[]>({
    queryKey: ["/api", "societies"],
  });

  const createSocietyMutation = useMutation({
    mutationFn: async (societyData: any) => {
      return await apiRequest("POST", "/api/societies", societyData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/societies"] });
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Society created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create society",
        variant: "destructive",
      });
    },
  });

  const canCreateSociety = hasRole(user?.role || "", ["SuperAdmin"]);

  const filterOptions = [
    {
      key: "city",
      label: "City",
      options: [
        { label: "Mumbai", value: "Mumbai" },
        { label: "Delhi", value: "Delhi" },
        { label: "Bangalore", value: "Bangalore" },
      ],
    },
    {
      key: "isActive",
      label: "Status",
      options: [
        { label: "Active", value: "true" },
        { label: "Inactive", value: "false" },
      ],
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-hidden flex flex-col">
        <Header 
          title="Society Management" 
          subtitle="Manage cooperative societies and their settings" 
        />
        
        <div className="flex-1 overflow-y-auto p-6 bg-muted/30">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Societies</h3>
                {canCreateSociety && (
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button data-testid="button-add-society">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Society
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add New Society</DialogTitle>
                      </DialogHeader>
                      <SocietyForm
                        onSubmit={(data) => createSocietyMutation.mutate(data)}
                        isLoading={createSocietyMutation.isPending}
                        onCancel={() => setIsDialogOpen(false)}
                      />
                    </DialogContent>
                  </Dialog>
                )}
              </div>

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <DataTable
                  columns={societyColumns}
                  data={societies}
                  searchKey="name"
                  searchPlaceholder="Search societies..."
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
