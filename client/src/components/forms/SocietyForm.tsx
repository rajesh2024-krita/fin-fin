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

const societySchema = z.object({
  name: z.string().min(1, "Society name is required"),
  address: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().optional(),
  fax: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  website: z.string().optional(),
  registrationNo: z.string().optional(),
  
  // Interest rates
  interestDividend: z.string().optional(),
  interestOD: z.string().optional(),
  interestCD: z.string().optional(),
  interestLoan: z.string().optional(),
  interestEmergencyLoan: z.string().optional(),
  interestLAS: z.string().optional(),
  
  // Limits
  limitShare: z.string().optional(),
  limitLoan: z.string().optional(),
  limitEmergencyLoan: z.string().optional(),
  
  // Bounce charge
  chBounceChargeAmount: z.string().optional(),
  chBounceChargeMode: z.string().optional(),
});

type SocietyFormData = z.infer<typeof societySchema>;

interface SocietyFormProps {
  onSubmit: (data: SocietyFormData) => void;
  isLoading?: boolean;
  onCancel?: () => void;
  defaultValues?: Partial<SocietyFormData>;
}

export function SocietyForm({ onSubmit, isLoading, onCancel, defaultValues }: SocietyFormProps) {
  const form = useForm<SocietyFormData>({
    resolver: zodResolver(societySchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      phone: "",
      fax: "",
      email: "",
      website: "",
      registrationNo: "",
      interestDividend: "",
      interestOD: "",
      interestCD: "",
      interestLoan: "",
      interestEmergencyLoan: "",
      interestLAS: "",
      limitShare: "",
      limitLoan: "",
      limitEmergencyLoan: "",
      chBounceChargeAmount: "",
      chBounceChargeMode: "",
      ...defaultValues,
    },
  });

  const handleSubmit = (data: SocietyFormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="interest">Interest Rates</TabsTrigger>
          <TabsTrigger value="limits">Limits & Charges</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Society Name *</Label>
                  <Input
                    id="name"
                    {...form.register("name")}
                    placeholder="Enter society name"
                    data-testid="input-society-name"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registrationNo">Registration No.</Label>
                  <Input
                    id="registrationNo"
                    {...form.register("registrationNo")}
                    placeholder="Enter registration number"
                    data-testid="input-registration-no"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  {...form.register("address")}
                  placeholder="Enter complete address"
                  rows={3}
                  data-testid="input-address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Select onValueChange={(value) => form.setValue("city", value)} value={form.watch("city")}>
                    <SelectTrigger data-testid="select-city">
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mumbai">Mumbai</SelectItem>
                      <SelectItem value="Delhi">Delhi</SelectItem>
                      <SelectItem value="Bangalore">Bangalore</SelectItem>
                      <SelectItem value="Chennai">Chennai</SelectItem>
                      <SelectItem value="Kolkata">Kolkata</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    {...form.register("phone")}
                    placeholder="Enter phone number"
                    data-testid="input-phone"
                  />
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
                    <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    {...form.register("website")}
                    placeholder="Enter website URL"
                    data-testid="input-website"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interest" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Interest Rates (%)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="interestDividend">Dividend</Label>
                  <Input
                    id="interestDividend"
                    type="number"
                    step="0.01"
                    {...form.register("interestDividend")}
                    placeholder="0.00"
                    data-testid="input-interest-dividend"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interestOD">OD (Overdraft)</Label>
                  <Input
                    id="interestOD"
                    type="number"
                    step="0.01"
                    {...form.register("interestOD")}
                    placeholder="0.00"
                    data-testid="input-interest-od"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="interestCD">CD (Certificate of Deposit)</Label>
                  <Input
                    id="interestCD"
                    type="number"
                    step="0.01"
                    {...form.register("interestCD")}
                    placeholder="0.00"
                    data-testid="input-interest-cd"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interestLoan">Loan</Label>
                  <Input
                    id="interestLoan"
                    type="number"
                    step="0.01"
                    {...form.register("interestLoan")}
                    placeholder="0.00"
                    data-testid="input-interest-loan"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="interestEmergencyLoan">Emergency Loan</Label>
                  <Input
                    id="interestEmergencyLoan"
                    type="number"
                    step="0.01"
                    {...form.register("interestEmergencyLoan")}
                    placeholder="0.00"
                    data-testid="input-interest-emergency-loan"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interestLAS">LAS</Label>
                  <Input
                    id="interestLAS"
                    type="number"
                    step="0.01"
                    {...form.register("interestLAS")}
                    placeholder="0.00"
                    data-testid="input-interest-las"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="limits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Limits & Charges</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="limitShare">Share Limit</Label>
                  <Input
                    id="limitShare"
                    type="number"
                    step="0.01"
                    {...form.register("limitShare")}
                    placeholder="0.00"
                    data-testid="input-limit-share"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="limitLoan">Loan Limit</Label>
                  <Input
                    id="limitLoan"
                    type="number"
                    step="0.01"
                    {...form.register("limitLoan")}
                    placeholder="0.00"
                    data-testid="input-limit-loan"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="limitEmergencyLoan">Emergency Loan Limit</Label>
                  <Input
                    id="limitEmergencyLoan"
                    type="number"
                    step="0.01"
                    {...form.register("limitEmergencyLoan")}
                    placeholder="0.00"
                    data-testid="input-limit-emergency-loan"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="chBounceChargeAmount">Cheque Bounce Charge Amount</Label>
                  <Input
                    id="chBounceChargeAmount"
                    type="number"
                    step="0.01"
                    {...form.register("chBounceChargeAmount")}
                    placeholder="0.00"
                    data-testid="input-bounce-charge-amount"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chBounceChargeMode">Bounce Charge Mode</Label>
                  <Select onValueChange={(value) => form.setValue("chBounceChargeMode", value)} value={form.watch("chBounceChargeMode")}>
                    <SelectTrigger data-testid="select-bounce-charge-mode">
                      <SelectValue placeholder="Select Mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Excess Provision">Excess Provision</SelectItem>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="HDFC Bank">HDFC Bank</SelectItem>
                      <SelectItem value="Inverter">Inverter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
        <Button type="submit" disabled={isLoading} data-testid="button-save-society">
          {isLoading ? "Saving..." : "Save Society"}
        </Button>
      </div>
    </form>
  );
}
