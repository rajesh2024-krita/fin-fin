
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MemberForm } from "@/components/forms/MemberForm";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Plus, Users, Eye, Edit, UserPlus } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

interface Member {
  id: string;
  memNo: string;
  name: string;
  email: string;
  mobile: string;
  designation: string;
  status: string;
  openingBalanceShare: string;
}

const memberColumns: ColumnDef<Member>[] = [
  {
    accessorKey: "memNo",
    header: "Mem No.",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("memNo")}</div>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
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
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "openingBalanceShare",
    header: "Share Balance",
    cell: ({ row }) => (
      <div className="font-mono">₹{Number(row.getValue("openingBalanceShare") || 0).toLocaleString()}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span className={`px-2 py-1 rounded-full text-xs ${
        row.getValue("status") === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}>
        {row.getValue("status")}
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

export default function Members() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: members = [], isLoading } = useQuery<Member[]>({
    queryKey: ["/api/members"],
  });

  const createMemberMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create member");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/members"] });
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Member created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create member",
        variant: "destructive",
      });
    },
  });

  const handleCreateMember = (data: any) => {
    createMemberMutation.mutate(data);
  };

  const canCreateMember = user?.role === "SuperAdmin" || user?.role === "SocietyAdmin";

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-hidden flex flex-col">
        <Header 
          title="Member Management" 
          subtitle="Manage society members and their details" 
        />
        
        <div className="flex-1 overflow-y-auto p-6 bg-muted/30">
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Members</p>
                      <p className="text-3xl font-bold">{members.length}</p>
                    </div>
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Members</p>
                      <p className="text-3xl font-bold">{members.filter(m => m.status === "Active").length}</p>
                    </div>
                    <UserPlus className="h-8 w-8 text-secondary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Share Balance</p>
                      <p className="text-2xl font-bold">₹{members.reduce((sum, m) => sum + Number(m.openingBalanceShare || 0), 0).toLocaleString()}</p>
                    </div>
                    <Users className="h-8 w-8 text-accent" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Inactive Members</p>
                      <p className="text-3xl font-bold">{members.filter(m => m.status !== "Active").length}</p>
                    </div>
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Members Table */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Members</CardTitle>
                {canCreateMember && (
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Member
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Create New Member</DialogTitle>
                      </DialogHeader>
                      <MemberForm onSubmit={handleCreateMember} />
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
                    columns={memberColumns}
                    data={members}
                    searchKey="name"
                    searchPlaceholder="Search members..."
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
