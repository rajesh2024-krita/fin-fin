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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useQuery } from "@tanstack/react-query";
import { getAuthHeaders } from "@/hooks/useAuth";
import type { LoanType, Bank, Society } from "@shared/schema";
import { useEffect } from "react";

const loanSchema = z.object({
  loanTypeId: z.string().min(1, "Loan type is required"),
  loanDate: z.string(),
  edpNo: z.string().optional(),
  name: z.string().optional(),
  loanAmount: z.string().min(1, "Loan amount is required"),
  previousLoan: z.string().default("0"),
  installments: z.string().optional(),
  installmentAmount: z.string().optional(),
  purpose: z.string().optional(),
  authorizedBy: z.string().optional(),
  paymentMode: z.enum(["Cash", "Cheque", "Opening"]),
  bankId: z.string().optional(),
  chequeNo: z.string().optional(),
  chequeDate: z.string().optional(),
  share: z.string().optional(),
  cd: z.string().optional(),
  lastSalary: z.string().optional(),
  mwf: z.string().optional(),
  payAmount: z.string().optional(),
  societyId: z.string(),
});

type LoanFormData = z.infer<typeof loanSchema>;

interface LoanFormProps {
  onSubmit: (data: LoanFormData) => void;
  isLoading?: boolean;
  onCancel?: () => void;
  defaultValues?: Partial<LoanFormData>;
  canSelectSociety?: boolean;
}

export function LoanForm({ onSubmit, isLoading, onCancel, defaultValues, canSelectSociety = false }: LoanFormProps) {
  const form = useForm<LoanFormData>({
    resolver: zodResolver(loanSchema),
    defaultValues: {
      loanTypeId: "",
      loanDate: new Date().toISOString().split('T')[0],
      edpNo: "",
      name: "",
      loanAmount: "",
      previousLoan: "0",
      installments: "",
      installmentAmount: "",
      purpose: "",
      authorizedBy: "",
      paymentMode: "Cash",
      bankId: "",
      chequeNo: "",
      chequeDate: "",
      share: "",
      cd: "",
      lastSalary: "",
      mwf: "",
      payAmount: "",
      societyId: "",
      ...defaultValues,
    },
  });

  const { data: loanTypes = [] } = useQuery<LoanType[]>({
    queryKey: ["/api", "lookup", "loan-types"],
  });

  const { data: banks = [] } = useQuery<Bank[]>({
    queryKey: ["/api", "lookup", "banks"],
  });

  const { data: societies = [] } = useQuery<Society[]>({
    queryKey: ["/api", "societies"],
    enabled: canSelectSociety,
  });

  // Calculate net loan automatically
  const loanAmount = form.watch("loanAmount");
  const previousLoan = form.watch("previousLoan");

  useEffect(() => {
    const loan = parseFloat(loanAmount) || 0;
    const previous = parseFloat(previousLoan) || 0;
    const net = loan - previous;
    // Note: We don't set this in the form as it's calculated on the server
  }, [loanAmount, previousLoan]);

  const handleSubmit = (data: LoanFormData) => {
    onSubmit(data);
  };

  const handleValidate = () => {
    // Validate form before allowing submission
    form.trigger();
  };

  const netLoan = (parseFloat(loanAmount) || 0) - (parseFloat(previousLoan) || 0);

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="payment">Payment Details</TabsTrigger>
          <TabsTrigger value="financial">Financial Info</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Loan Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="loanTypeId">Loan Type *</Label>
                  <Select onValueChange={(value) => form.setValue("loanTypeId", value)} value={form.watch("loanTypeId")}>
                    <SelectTrigger data-testid="select-loan-type">
                      <SelectValue placeholder="Select Loan Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {loanTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.loanTypeId && (
                    <p className="form-error">{form.formState.errors.loanTypeId.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loanDate">Loan Date *</Label>
                  <Input
                    id="loanDate"
                    type="date"
                    {...form.register("loanDate")}
                    data-testid="input-loan-date"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edpNo">EDP No.</Label>
                  <Input
                    id="edpNo"
                    {...form.register("edpNo")}
                    placeholder="Enter EDP number"
                    data-testid="input-edp-no"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    {...form.register("name")}
                    placeholder="Enter name"
                    data-testid="input-name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="loanAmount">Loan Amount *</Label>
                  <Input
                    id="loanAmount"
                    type="number"
                    step="0.01"
                    {...form.register("loanAmount")}
                    placeholder="0.00"
                    data-testid="input-loan-amount"
                  />
                  {form.formState.errors.loanAmount && (
                    <p className="form-error">{form.formState.errors.loanAmount.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="previousLoan">Previous Loan (Remaining)</Label>
                  <Input
                    id="previousLoan"
                    type="number"
                    step="0.01"
                    {...form.register("previousLoan")}
                    placeholder="0.00"
                    data-testid="input-previous-loan"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Net Loan (Auto)</Label>
                  <Input
                    value={netLoan.toFixed(2)}
                    disabled
                    className="bg-muted"
                    data-testid="display-net-loan"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="installments">No. of Installments</Label>
                  <Input
                    id="installments"
                    type="number"
                    {...form.register("installments")}
                    placeholder="Enter installments"
                    data-testid="input-installments"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="installmentAmount">Installment Amount</Label>
                  <Input
                    id="installmentAmount"
                    type="number"
                    step="0.01"
                    {...form.register("installmentAmount")}
                    placeholder="0.00"
                    data-testid="input-installment-amount"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose</Label>
                <Textarea
                  id="purpose"
                  {...form.register("purpose")}
                  placeholder="Enter loan purpose"
                  rows={3}
                  data-testid="input-purpose"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="authorizedBy">Authorized By</Label>
                <Input
                  id="authorizedBy"
                  {...form.register("authorizedBy")}
                  placeholder="Enter authorizing person"
                  data-testid="input-authorized-by"
                />
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

        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>Payment Mode</Label>
                <RadioGroup
                  value={form.watch("paymentMode")}
                  onValueChange={(value: any) => form.setValue("paymentMode", value)}
                  data-testid="radio-payment-mode"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Cash" id="cash" />
                    <Label htmlFor="cash">Cash</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Cheque" id="cheque" />
                    <Label htmlFor="cheque">Cheque</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Opening" id="opening" />
                    <Label htmlFor="opening">Opening</Label>
                  </div>
                </RadioGroup>
              </div>

              {form.watch("paymentMode") === "Cheque" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="bankId">Bank</Label>
                    <Select onValueChange={(value) => form.setValue("bankId", value)} value={form.watch("bankId")}>
                      <SelectTrigger data-testid="select-bank">
                        <SelectValue placeholder="Select Bank" />
                      </SelectTrigger>
                      <SelectContent>
                        {banks.map((bank) => (
                          <SelectItem key={bank.id} value={bank.id}>
                            {bank.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="chequeNo">Cheque No.</Label>
                      <Input
                        id="chequeNo"
                        {...form.register("chequeNo")}
                        placeholder="Enter cheque number"
                        data-testid="input-cheque-no"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="chequeDate">Cheque Date</Label>
                      <Input
                        id="chequeDate"
                        type="date"
                        {...form.register("chequeDate")}
                        data-testid="input-cheque-date"
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="share">Share</Label>
                  <Input
                    id="share"
                    type="number"
                    step="0.01"
                    {...form.register("share")}
                    placeholder="0.00"
                    data-testid="input-share"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cd">CD</Label>
                  <Input
                    id="cd"
                    type="number"
                    step="0.01"
                    {...form.register("cd")}
                    placeholder="0.00"
                    data-testid="input-cd"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastSalary">Last Salary</Label>
                  <Input
                    id="lastSalary"
                    type="number"
                    step="0.01"
                    {...form.register("lastSalary")}
                    placeholder="0.00"
                    data-testid="input-last-salary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mwf">MWF</Label>
                  <Input
                    id="mwf"
                    type="number"
                    step="0.01"
                    {...form.register("mwf")}
                    placeholder="0.00"
                    data-testid="input-mwf"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payAmount">Pay Amount</Label>
                  <Input
                    id="payAmount"
                    type="number"
                    step="0.01"
                    {...form.register("payAmount")}
                    placeholder="0.00"
                    data-testid="input-pay-amount"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={handleValidate} data-testid="button-validate">
          Validate
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} data-testid="button-cancel">
            Cancel
          </Button>
        )}
        <Button type="button" variant="outline" data-testid="button-clear">
          Clear
        </Button>
        <Button type="submit" disabled={isLoading} data-testid="button-save-loan">
          {isLoading ? "Saving..." : "Save Loan"}
        </Button>
      </div>
    </form>
  );
}
