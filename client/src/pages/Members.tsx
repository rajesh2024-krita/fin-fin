import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MemberForm } from "@/components/forms/MemberForm";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { hasRole } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Eye, Edit, Trash2, Upload } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import type { Member } from "@shared/schema";

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
    header: "Member Name",
    cell: ({ row }) => (
      <div>
        <p className="text-sm font-medium">{row.getValue("name")}</p>
        <p className="text-xs text-muted-foreground">{row.original.designation}</p>
      </div>
    ),
  },
  {
    accessorKey: "mobile",
    header: "Mobile",
  },
  {
    accessorKey: "branch",
    header: "Branch",
  },
  {
    accessorKey: "city",
    header: "City",
  },
  {
    accessorKey: "dojSociety",
    header: "DOJ Society",
    cell: ({ row }) => {
      const date = row.getValue("dojSociety") as string;
      return date ? new Date(date).toLocaleDateString() : "-";
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === "Active" ? "default" : "secondary"}>
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Button variant="ghost" size="sm" data-testid={`view-member-${row.original.id}`}>
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" data-testid={`edit-member-${row.original.id}`}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" data-testid={`upload-member-${row.original.id}`}>
          <Upload className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" data-testid={`delete-member-${row.original.id}`}>
          <Trash2 className="h-4 w-4 text-destructive" />
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
    queryKey: ["/api", "members"],
  });

  const createMemberMutation = useMutation({
    mutationFn: async (memberData: any) => {
      return await apiRequest("POST", "/api/members", memberData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/members"] });
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Member created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create member",
        variant: "destructive",
      });
    },
  });

  const canCreateMember = hasRole(user?.role || "", ["SuperAdmin", "SocietyAdmin"]);
  const canSelectSociety = hasRole(user?.role || "", ["SuperAdmin"]);

  const filterOptions = [
    {
      key: "status",
      label: "Status",
      options: [
        { label: "Active", value: "Active" },
        { label: "Inactive", value: "Inactive" },
      ],
    },
    {
      key: "branch",
      label: "Branch",
      options: [
        { label: "Main Branch", value: "Main Branch" },
        { label: "Sub Branch", value: "Sub Branch" },
        { label: "Regional Office", value: "Regional Office" },
      ],
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-hidden flex flex-col">
        <Header 
          title="Member Management" 
          subtitle="Manage society members and their information" 
        />
        
        <div className="flex-1 overflow-y-auto p-6 bg-muted/30">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Society Members</h3>
                {canCreateMember && (
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button data-testid="button-add-member">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Member
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add New Member</DialogTitle>
                      </DialogHeader>
                      <MemberForm
                        onSubmit={(data) => createMemberMutation.mutate(data)}
                        isLoading={createMemberMutation.isPending}
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
                  columns={memberColumns}
                  data={members}
                  searchKey="name"
                  searchPlaceholder="Search members..."
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
