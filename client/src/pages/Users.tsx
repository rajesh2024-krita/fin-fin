import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserForm } from "@/components/forms/UserForm";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { hasRole } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import type { User } from "@shared/schema";

const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div>
        <p className="text-sm font-medium">{row.getValue("name")}</p>
        <p className="text-xs text-muted-foreground">{row.original.username}</p>
      </div>
    ),
  },
  {
    accessorKey: "edpNo",
    header: "EDP No.",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      const roleColors = {
        SuperAdmin: "destructive",
        SocietyAdmin: "default",
        User: "secondary",
        Member: "outline",
      };
      return (
        <Badge variant={roleColors[role as keyof typeof roleColors] as any}>
          {role}
        </Badge>
      );
    },
  },
  {
    accessorKey: "designation",
    header: "Designation",
  },
  {
    accessorKey: "mobile",
    header: "Mobile",
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
        <Button variant="ghost" size="sm" data-testid={`view-user-${row.original.id}`}>
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" data-testid={`edit-user-${row.original.id}`}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" data-testid={`delete-user-${row.original.id}`}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    ),
  },
];

export default function Users() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["/api", "users"],
  });

  const createUserMutation = useMutation({
    mutationFn: async (userData: any) => {
      return await apiRequest("POST", "/api/users", userData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "User created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create user",
        variant: "destructive",
      });
    },
  });

  const canCreateUser = hasRole(user?.role || "", ["SuperAdmin", "SocietyAdmin"]);
  const canSelectSociety = hasRole(user?.role || "", ["SuperAdmin"]);

  const filterOptions = [
    {
      key: "role",
      label: "Role",
      options: [
        { label: "Super Admin", value: "SuperAdmin" },
        { label: "Society Admin", value: "SocietyAdmin" },
        { label: "User", value: "User" },
        { label: "Member", value: "Member" },
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
          title="User Management" 
          subtitle="Manage system users and their access permissions" 
        />
        
        <div className="flex-1 overflow-y-auto p-6 bg-muted/30">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">System Users</h3>
                {canCreateUser && (
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button data-testid="button-add-user">
                        <Plus className="w-4 h-4 mr-2" />
                        Add User
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                      </DialogHeader>
                      <UserForm
                        onSubmit={(data) => createUserMutation.mutate(data)}
                        isLoading={createUserMutation.isPending}
                        onCancel={() => setIsDialogOpen(false)}
                        canSelectSociety={canSelectSociety}
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
                  columns={userColumns}
                  data={users}
                  searchKey="name"
                  searchPlaceholder="Search users..."
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
