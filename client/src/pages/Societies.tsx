
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SocietyForm } from "@/components/forms/SocietyForm";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Plus, Building, Users, Eye, Edit } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

interface Society {
  id: string;
  name: string;
  city: string;
  phone: string;
  email: string;
  registrationNo: string;
  isActive: boolean;
}

const societyColumns: ColumnDef<Society>[] = [
  {
    accessorKey: "name",
    header: "Society Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "city",
    header: "City",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "registrationNo",
    header: "Registration No.",
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (
      <span className={`px-2 py-1 rounded-full text-xs ${
        row.getValue("isActive") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}>
        {row.getValue("isActive") ? "Active" : "Inactive"}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4" />
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
    queryKey: ["/api/societies"],
  });

  const createSocietyMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/societies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create society");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/societies"] });
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Society created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create society",
        variant: "destructive",
      });
    },
  });

  const handleCreateSociety = (data: any) => {
    createSocietyMutation.mutate(data);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-hidden flex flex-col">
        <Header 
          title="Society Management" 
          subtitle="Manage societies and their configurations" 
        />
        
        <div className="flex-1 overflow-y-auto p-6 bg-muted/30">
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Societies</p>
                      <p className="text-3xl font-bold">{societies.length}</p>
                    </div>
                    <Building className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Societies</p>
                      <p className="text-3xl font-bold">{societies.filter(s => s.isActive).length}</p>
                    </div>
                    <Users className="h-8 w-8 text-secondary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Inactive Societies</p>
                      <p className="text-3xl font-bold">{societies.filter(s => !s.isActive).length}</p>
                    </div>
                    <Building className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Societies Table */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Societies</CardTitle>
                {user?.role === "SuperAdmin" && (
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Society
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Create New Society</DialogTitle>
                      </DialogHeader>
                      <SocietyForm onSubmit={handleCreateSociety} />
                    </DialogContent>
                  </Dialog>
                )}
              </CardHeader>
              <CardContent>
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
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
