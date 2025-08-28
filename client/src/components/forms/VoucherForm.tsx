import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { getAuthHeaders } from "@/hooks/useAuth";
import { Plus, Trash2 } from "lucide-react";
import type { VoucherType, Society } from "@shared/schema";
import { useState } from "react";

const voucherLineSchema = z.object({
  particulars: z.string().optional(),
  debit: z.string().default("0"),
  credit: z.string().default("0"),
  dbCr: z.enum(["Debit", "Credit"]),
  ibldbc: z.string().default("0"),
});

const voucherSchema = z.object({
  voucherTypeId: z.string().min(1, "Voucher type is required"),
  date: z.string(),
  chequeNo: z.string().optional(),
  chequeDate: z.string().optional(),
  narration: z.string().optional(),
  remarks: z.string().optional(),
  passDate: z.string().optional(),
  lines: z.array(voucherLineSchema),
  societyId: z.string(),
});

type VoucherFormData = z.infer<typeof voucherSchema>;

interface VoucherFormProps {
  onSubmit: (data: VoucherFormData) => void;
  isLoading?: boolean;
  onCancel?: () => void;
  defaultValues?: Partial<VoucherFormData>;
  canSelectSociety?: boolean;
}

export function VoucherForm({ onSubmit, isLoading, onCancel, defaultValues, canSelectSociety = false }: VoucherFormProps) {
  const [currentLine, setCurrentLine] = useState({
    particulars: "",
    debit: "0",
    credit: "0",
    dbCr: "Debit" as const,
    ibldbc: "0",
  });

  const form = useForm<VoucherFormData>({
    resolver: zodResolver(voucherSchema),
    defaultValues: {
      voucherTypeId: "",
      date: new Date().toISOString().split('T')[0],
      chequeNo: "",
      chequeDate: "",
      narration: "",
      remarks: "",
      passDate: "",
      lines: [],
      societyId: "",
      ...defaultValues,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lines",
  });

  const { data: voucherTypes = [] } = useQuery<VoucherType[]>({
    queryKey: ["/api", "lookup", "voucher-types"],
  });

  const { data: societies = [] } = useQuery<Society[]>({
    queryKey: ["/api", "societies"],
    enabled: canSelectSociety,
  });

  const handleAddLine = () => {
    append(currentLine);
    setCurrentLine({
      particulars: "",
      debit: "0",
      credit: "0",
      dbCr: "Debit",
      ibldbc: "0",
    });
  };

  const handleClearLine = () => {
    setCurrentLine({
      particulars: "",
      debit: "0",
      credit: "0",
      dbCr: "Debit",
      ibldbc: "0",
    });
  };

  const totalDebit = fields.reduce((sum, _, index) => {
    return sum + (parseFloat(form.watch(`lines.${index}.debit`)) || 0);
  }, 0);

  const totalCredit = fields.reduce((sum, _, index) => {
    return sum + (parseFloat(form.watch(`lines.${index}.credit`)) || 0);
  }, 0);

  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

  const handleSubmit = (data: VoucherFormData) => {
    if (!isBalanced) {
      form.setError("lines", { message: "Total Debit and Credit must be balanced" });
      return;
    }
    onSubmit(data);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      {/* Header Information */}
      <Card>
        <CardHeader>
          <CardTitle>Voucher Header</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="voucherTypeId">Voucher Type *</Label>
              <Select onValueChange={(value) => form.setValue("voucherTypeId", value)} value={form.watch("voucherTypeId")}>
                <SelectTrigger data-testid="select-voucher-type">
                  <SelectValue placeholder="Select Voucher Type" />
                </SelectTrigger>
                <SelectContent>
                  {voucherTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.voucherTypeId && (
                <p className="form-error">{form.formState.errors.voucherTypeId.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                {...form.register("date")}
                data-testid="input-voucher-date"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passDate">Pass Date</Label>
              <Input
                id="passDate"
                type="date"
                {...form.register("passDate")}
                data-testid="input-pass-date"
              />
            </div>
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

      {/* Voucher Lines */}
      <Card>
        <CardHeader>
          <CardTitle>Voucher Entries</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Lines Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Particulars</TableHead>
                  <TableHead className="text-right">Debit</TableHead>
                  <TableHead className="text-right">Credit</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">IBLDBC</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => (
                  <TableRow key={field.id}>
                    <TableCell>
                      <Input
                        {...form.register(`lines.${index}.particulars`)}
                        placeholder="Enter particulars"
                        data-testid={`input-line-particulars-${index}`}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        {...form.register(`lines.${index}.debit`)}
                        className="text-right"
                        data-testid={`input-line-debit-${index}`}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        {...form.register(`lines.${index}.credit`)}
                        className="text-right"
                        data-testid={`input-line-credit-${index}`}
                      />
                    </TableCell>
                    <TableCell>
                      <Select onValueChange={(value: any) => form.setValue(`lines.${index}.dbCr`, value)} value={form.watch(`lines.${index}.dbCr`)}>
                        <SelectTrigger data-testid={`select-line-type-${index}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Debit">Debit</SelectItem>
                          <SelectItem value="Credit">Credit</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        {...form.register(`lines.${index}.ibldbc`)}
                        className="text-right"
                        data-testid={`input-line-ibldbc-${index}`}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        data-testid={`button-remove-line-${index}`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Add New Line Section */}
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-base">Add Entry</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentParticulars">Particulars</Label>
                  <Input
                    id="currentParticulars"
                    value={currentLine.particulars}
                    onChange={(e) => setCurrentLine({ ...currentLine, particulars: e.target.value })}
                    placeholder="Enter particulars"
                    data-testid="input-current-particulars"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentDbCr">Db/Cr</Label>
                  <Select value={currentLine.dbCr} onValueChange={(value: any) => setCurrentLine({ ...currentLine, dbCr: value })}>
                    <SelectTrigger data-testid="select-current-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Debit">Debit</SelectItem>
                      <SelectItem value="Credit">Credit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentDebit">Debit</Label>
                  <Input
                    id="currentDebit"
                    type="number"
                    step="0.01"
                    value={currentLine.debit}
                    onChange={(e) => setCurrentLine({ ...currentLine, debit: e.target.value })}
                    placeholder="0.00"
                    data-testid="input-current-debit"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentCredit">Credit</Label>
                  <Input
                    id="currentCredit"
                    type="number"
                    step="0.01"
                    value={currentLine.credit}
                    onChange={(e) => setCurrentLine({ ...currentLine, credit: e.target.value })}
                    placeholder="0.00"
                    data-testid="input-current-credit"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentIbldbc">IBLDBC</Label>
                  <Input
                    id="currentIbldbc"
                    type="number"
                    step="0.01"
                    value={currentLine.ibldbc}
                    onChange={(e) => setCurrentLine({ ...currentLine, ibldbc: e.target.value })}
                    placeholder="0.00"
                    data-testid="input-current-ibldbc"
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button type="button" onClick={handleAddLine} data-testid="button-add-line">
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
                <Button type="button" variant="outline" onClick={handleClearLine} data-testid="button-clear-line">
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Totals */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">Total Debit</p>
                  <p className="text-2xl font-bold" data-testid="total-debit">₹{totalDebit.toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">Total Credit</p>
                  <p className="text-2xl font-bold" data-testid="total-credit">₹{totalCredit.toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>
            <Card className={`${isBalanced ? 'bg-secondary/10' : 'bg-destructive/10'}`}>
              <CardContent className="pt-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">Balance Status</p>
                  <p className={`text-2xl font-bold ${isBalanced ? 'text-secondary' : 'text-destructive'}`} data-testid="balance-status">
                    {isBalanced ? 'Balanced' : 'Unbalanced'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="narration">Narration</Label>
            <Textarea
              id="narration"
              {...form.register("narration")}
              placeholder="Enter narration"
              rows={3}
              data-testid="input-narration"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              {...form.register("remarks")}
              placeholder="Enter remarks"
              rows={2}
              data-testid="input-remarks"
            />
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button type="button" variant="outline" data-testid="button-reverse">
          Reverse
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} data-testid="button-cancel">
            Cancel
          </Button>
        )}
        <Button type="button" variant="outline" data-testid="button-print">
          Print
        </Button>
        <Button type="button" variant="outline" data-testid="button-delete">
          Delete
        </Button>
        <Button type="button" variant="outline" data-testid="button-new">
          New
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading || !isBalanced} 
          data-testid="button-save-voucher"
        >
          {isLoading ? "Saving..." : "Save Voucher"}
        </Button>
      </div>

      {form.formState.errors.lines && (
        <p className="form-error text-center">{form.formState.errors.lines.message}</p>
      )}
    </form>
  );
}
