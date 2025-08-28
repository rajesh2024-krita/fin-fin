import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const monthlyDemandSchema = z.object({
  month: z.string().min(1, "Month is required"),
  year: z.string().min(1, "Year is required"),
  description: z.string().optional(),
  notes: z.string().optional(),
});

type MonthlyDemandFormData = z.infer<typeof monthlyDemandSchema>;

interface MonthlyDemandFormProps {
  onSubmit: (data: MonthlyDemandFormData) => void;
  isLoading?: boolean;
  onCancel?: () => void;
  defaultValues?: Partial<MonthlyDemandFormData>;
}

const months = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
];

const years = Array.from({ length: 51 }, (_, i) => (2000 + i).toString());

export function MonthlyDemandForm({ onSubmit, isLoading, onCancel, defaultValues }: MonthlyDemandFormProps) {
  const form = useForm<MonthlyDemandFormData>({
    resolver: zodResolver(monthlyDemandSchema),
    defaultValues: {
      month: "",
      year: "",
      description: "",
      notes: "",
      ...defaultValues,
    },
  });

  const handleSubmit = (data: MonthlyDemandFormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Monthly Demand Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="month">Month *</Label>
              <Select onValueChange={(value) => form.setValue("month", value)} value={form.watch("month")}>
                <SelectTrigger data-testid="select-demand-month">
                  <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.month && (
                <p className="form-error">{form.formState.errors.month.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year *</Label>
              <Select onValueChange={(value) => form.setValue("year", value)} value={form.watch("year")}>
                <SelectTrigger data-testid="select-demand-year">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.year && (
                <p className="form-error">{form.formState.errors.year.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              {...form.register("description")}
              placeholder="Enter description for this monthly demand"
              data-testid="input-demand-description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...form.register("notes")}
              placeholder="Enter any additional notes"
              rows={3}
              data-testid="input-demand-notes"
            />
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
        <Button type="submit" disabled={isLoading} data-testid="button-save-demand">
          {isLoading ? "Creating..." : "Create Demand"}
        </Button>
      </div>
    </form>
  );
}
