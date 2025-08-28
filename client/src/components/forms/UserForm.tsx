import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getAuthHeaders } from "@/hooks/useAuth";
import type { Society } from "@shared/schema";

const userSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  passwordHash: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  role: z.enum(["SuperAdmin", "SocietyAdmin", "User", "Member"]),
  edpNo: z.string().optional(),
  designation: z.string().optional(),
  addressOffice: z.string().optional(),
  addressResidence: z.string().optional(),
  phoneOffice: z.string().optional(),
  phoneResidence: z.string().optional(),
  mobile: z.string().optional(),
  societyId: z.string().optional(),
}).refine((data) => data.passwordHash === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  onSubmit: (data: Omit<UserFormData, "confirmPassword">) => void;
  isLoading?: boolean;
  onCancel?: () => void;
  defaultValues?: Partial<UserFormData>;
  canSelectSociety?: boolean;
}

export function UserForm({ onSubmit, isLoading, onCancel, defaultValues, canSelectSociety = false }: UserFormProps) {
  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      passwordHash: "",
      confirmPassword: "",
      name: "",
      email: "",
      role: "User",
      edpNo: "",
      designation: "",
      addressOffice: "",
      addressResidence: "",
      phoneOffice: "",
      phoneResidence: "",
      mobile: "",
      societyId: "",
      ...defaultValues,
    },
  });

  const { data: societies = [] } = useQuery<Society[]>({
    queryKey: ["/api", "societies"],
    enabled: canSelectSociety,
  });

  const handleSubmit = (data: UserFormData) => {
    const { confirmPassword, ...submitData } = data;
    onSubmit(submitData);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                {...form.register("username")}
                placeholder="Enter username"
                data-testid="input-username"
              />
              {form.formState.errors.username && (
                <p className="form-error">{form.formState.errors.username.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                {...form.register("name")}
                placeholder="Enter full name"
                data-testid="input-name"
              />
              {form.formState.errors.name && (
                <p className="form-error">{form.formState.errors.name.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="passwordHash">Password *</Label>
              <Input
                id="passwordHash"
                type="password"
                {...form.register("passwordHash")}
                placeholder="Enter password"
                data-testid="input-password"
              />
              {form.formState.errors.passwordHash && (
                <p className="form-error">{form.formState.errors.passwordHash.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...form.register("confirmPassword")}
                placeholder="Confirm password"
                data-testid="input-confirm-password"
              />
              {form.formState.errors.confirmPassword && (
                <p className="form-error">{form.formState.errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...form.register("email")}
                placeholder="Enter email address"
                data-testid="input-email"
              />
              {form.formState.errors.email && (
                <p className="form-error">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select onValueChange={(value: any) => form.setValue("role", value)} value={form.watch("role")}>
                <SelectTrigger data-testid="select-role">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SuperAdmin">Super Admin</SelectItem>
                  <SelectItem value="SocietyAdmin">Society Admin</SelectItem>
                  <SelectItem value="User">User</SelectItem>
                  <SelectItem value="Member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edpNo">EDP No</Label>
              <Input
                id="edpNo"
                {...form.register("edpNo")}
                placeholder="Enter EDP number"
                data-testid="input-edp-no"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="designation">Designation</Label>
              <Input
                id="designation"
                {...form.register("designation")}
                placeholder="Enter designation"
                data-testid="input-designation"
              />
            </div>
          </div>

          {canSelectSociety && (
            <div className="space-y-2">
              <Label htmlFor="societyId">Society</Label>
              <Select onValueChange={(value) => form.setValue("societyId", value)} value={form.watch("societyId")}>
                <SelectTrigger data-testid="select-society">
                  <SelectValue placeholder="Select Society" />
                </SelectTrigger>
                <SelectContent>
                  {societies.map((society) => (
                    <SelectItem key={society.id} value={society.id}>
                      {society.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="addressOffice">Office Address</Label>
            <Textarea
              id="addressOffice"
              {...form.register("addressOffice")}
              placeholder="Enter office address"
              rows={2}
              data-testid="input-address-office"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="addressResidence">Residence Address</Label>
            <Textarea
              id="addressResidence"
              {...form.register("addressResidence")}
              placeholder="Enter residence address"
              rows={2}
              data-testid="input-address-residence"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phoneOffice">Office Phone</Label>
              <Input
                id="phoneOffice"
                {...form.register("phoneOffice")}
                placeholder="Enter office phone"
                data-testid="input-phone-office"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneResidence">Residence Phone</Label>
              <Input
                id="phoneResidence"
                {...form.register("phoneResidence")}
                placeholder="Enter residence phone"
                data-testid="input-phone-residence"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile</Label>
              <Input
                id="mobile"
                {...form.register("mobile")}
                placeholder="Enter mobile number"
                data-testid="input-mobile"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} data-testid="button-cancel">
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading} data-testid="button-save-user">
          {isLoading ? "Saving..." : "Save User"}
        </Button>
      </div>
    </form>
  );
}
