import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import { getAuthHeaders } from "@/hooks/useAuth";
import type { Society } from "@shared/schema";

const memberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  fatherHusbandName: z.string().optional(),
  officeAddress: z.string().optional(),
  city: z.string().optional(),
  phoneOffice: z.string().optional(),
  branch: z.string().optional(),
  phoneResidence: z.string().optional(),
  mobile: z.string().optional(),
  designation: z.string().optional(),
  residenceAddress: z.string().optional(),
  dob: z.string().optional(),
  dojSociety: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  dojOrg: z.string().optional(),
  dor: z.string().optional(),
  nominee: z.string().optional(),
  nomineeRelation: z.string().optional(),
  openingBalanceShare: z.string().optional(),
  value: z.string().optional(),
  crDrCd: z.string().optional(),
  bankName: z.string().optional(),
  payableAt: z.string().optional(),
  accountNo: z.string().optional(),
  status: z.string().default("Active"),
  deductions: z.array(z.string()).optional(),
  societyId: z.string(),
});

type MemberFormData = z.infer<typeof memberSchema>;

interface MemberFormProps {
  onSubmit: (data: MemberFormData) => void;
  isLoading?: boolean;
  onCancel?: () => void;
  defaultValues?: Partial<MemberFormData>;
  canSelectSociety?: boolean;
}

const deductionOptions = [
  "Share",
  "Withdrawal", 
  "G Loan Instalment",
  "E Loan Instalment"
];

export function MemberForm({ onSubmit, isLoading, onCancel, defaultValues, canSelectSociety = false }: MemberFormProps) {
  const form = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: "",
      fatherHusbandName: "",
      officeAddress: "",
      city: "",
      phoneOffice: "",
      branch: "",
      phoneResidence: "",
      mobile: "",
      designation: "",
      residenceAddress: "",
      dob: "",
      dojSociety: "",
      email: "",
      dojOrg: "",
      dor: "",
      nominee: "",
      nomineeRelation: "",
      openingBalanceShare: "",
      value: "",
      crDrCd: "",
      bankName: "",
      payableAt: "",
      accountNo: "",
      status: "Active",
      deductions: [],
      societyId: "",
      ...defaultValues,
    },
  });

  const { data: societies = [] } = useQuery<Society[]>({
    queryKey: ["/api", "societies"],
    enabled: canSelectSociety,
  });

  const handleSubmit = (data: MemberFormData) => {
    onSubmit(data);
  };

  const handleDeductionChange = (deduction: string, checked: boolean) => {
    const currentDeductions = form.watch("deductions") || [];
    if (checked) {
      form.setValue("deductions", [...currentDeductions, deduction]);
    } else {
      form.setValue("deductions", currentDeductions.filter(d => d !== deduction));
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="contact">Contact Info</TabsTrigger>
          <TabsTrigger value="financial">Financial Info</TabsTrigger>
          <TabsTrigger value="bank">Bank Details</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    {...form.register("name")}
                    placeholder="Enter full name"
                    data-testid="input-member-name"
                  />
                  {form.formState.errors.name && (
                    <p className="form-error">{form.formState.errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fatherHusbandName">Father/Husband Name</Label>
                  <Input
                    id="fatherHusbandName"
                    {...form.register("fatherHusbandName")}
                    placeholder="Enter father/husband name"
                    data-testid="input-father-husband-name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="designation">Designation</Label>
                  <Input
                    id="designation"
                    {...form.register("designation")}
                    placeholder="Enter designation"
                    data-testid="input-designation"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="branch">Branch</Label>
                  <Input
                    id="branch"
                    {...form.register("branch")}
                    placeholder="Enter branch"
                    data-testid="input-branch"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    {...form.register("dob")}
                    data-testid="input-dob"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dojSociety">DOJ Society</Label>
                  <Input
                    id="dojSociety"
                    type="date"
                    {...form.register("dojSociety")}
                    data-testid="input-doj-society"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dojOrg">DOJ Organization</Label>
                  <Input
                    id="dojOrg"
                    type="date"
                    {...form.register("dojOrg")}
                    data-testid="input-doj-org"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nominee">Nominee</Label>
                  <Input
                    id="nominee"
                    {...form.register("nominee")}
                    placeholder="Enter nominee name"
                    data-testid="input-nominee"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nomineeRelation">Nominee Relation</Label>
                  <Select onValueChange={(value) => form.setValue("nomineeRelation", value)} value={form.watch("nomineeRelation")}>
                    <SelectTrigger data-testid="select-nominee-relation">
                      <SelectValue placeholder="Select Relation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Spouse">Spouse</SelectItem>
                      <SelectItem value="Son">Son</SelectItem>
                      <SelectItem value="Daughter">Daughter</SelectItem>
                      <SelectItem value="Father">Father</SelectItem>
                      <SelectItem value="Mother">Mother</SelectItem>
                      <SelectItem value="Brother">Brother</SelectItem>
                      <SelectItem value="Sister">Sister</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {canSelectSociety && (
                <div className="space-y-2">
                  <Label htmlFor="societyId">Society *</Label>
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="officeAddress">Office Address</Label>
                <Textarea
                  id="officeAddress"
                  {...form.register("officeAddress")}
                  placeholder="Enter office address"
                  rows={2}
                  data-testid="input-office-address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="residenceAddress">Residence Address</Label>
                <Textarea
                  id="residenceAddress"
                  {...form.register("residenceAddress")}
                  placeholder="Enter residence address"
                  rows={2}
                  data-testid="input-residence-address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    {...form.register("city")}
                    placeholder="Enter city"
                    data-testid="input-city"
                  />
                </div>
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
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="openingBalanceShare">Opening Balance (Share)</Label>
                  <Input
                    id="openingBalanceShare"
                    type="number"
                    step="0.01"
                    {...form.register("openingBalanceShare")}
                    placeholder="0.00"
                    data-testid="input-opening-balance-share"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value">Value</Label>
                  <Input
                    id="value"
                    type="number"
                    step="0.01"
                    {...form.register("value")}
                    placeholder="0.00"
                    data-testid="input-value"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="crDrCd">Cr / Dr / CD</Label>
                  <Select onValueChange={(value) => form.setValue("crDrCd", value)} value={form.watch("crDrCd")}>
                    <SelectTrigger data-testid="select-cr-dr-cd">
                      <SelectValue placeholder="Select Option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cr">Credit</SelectItem>
                      <SelectItem value="Dr">Debit</SelectItem>
                      <SelectItem value="CD">Certificate of Deposit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select onValueChange={(value) => form.setValue("status", value)} value={form.watch("status")}>
                    <SelectTrigger data-testid="select-status">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Deductions</Label>
                <div className="grid grid-cols-2 gap-3">
                  {deductionOptions.map((deduction) => (
                    <div key={deduction} className="flex items-center space-x-2">
                      <Checkbox
                        id={`deduction-${deduction}`}
                        checked={(form.watch("deductions") || []).includes(deduction)}
                        onCheckedChange={(checked) => handleDeductionChange(deduction, checked as boolean)}
                        data-testid={`checkbox-deduction-${deduction.toLowerCase().replace(/\s+/g, '-')}`}
                      />
                      <Label htmlFor={`deduction-${deduction}`} className="text-sm font-normal">
                        {deduction}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bank" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bank Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    {...form.register("bankName")}
                    placeholder="Enter bank name"
                    data-testid="input-bank-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payableAt">Payable At</Label>
                  <Input
                    id="payableAt"
                    {...form.register("payableAt")}
                    placeholder="Enter payable location"
                    data-testid="input-payable-at"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountNo">Account Number</Label>
                <Input
                  id="accountNo"
                  {...form.register("accountNo")}
                  placeholder="Enter account number"
                  data-testid="input-account-no"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} data-testid="button-cancel">
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading} data-testid="button-save-member">
          {isLoading ? "Saving..." : "Save Member"}
        </Button>
      </div>
    </form>
  );
}
