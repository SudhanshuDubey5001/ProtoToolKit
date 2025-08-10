import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { saveToLocalStorage, loadFromLocalStorage, clearFromLocalStorage } from "@/lib/storage";
import { exportToPDF } from "@/lib/pdf-export";

interface SummaryFormData {
  title: string;
  owner: string;
  date: string;
  result_summary: string;
  key_learnings: string;
  decision: string;
  next_steps: string;
  notes: string;
}

export default function PostExperimentSummary() {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  
  const form = useForm<SummaryFormData>({
    defaultValues: {
      title: "",
      owner: "",
      date: "",
      result_summary: "",
      key_learnings: "",
      decision: "",
      next_steps: "",
      notes: "",
    },
  });

  const { register, watch, setValue, reset } = form;
  const formData = watch();

  // Load data on component mount
  useEffect(() => {
    const savedData = loadFromLocalStorage('summary');
    if (savedData) {
      Object.keys(savedData).forEach((key) => {
        setValue(key as keyof SummaryFormData, savedData[key]);
      });
    }
  }, [setValue]);

  const handleSave = () => {
    saveToLocalStorage('summary', formData);
    toast({
      title: "Data Saved",
      description: "Your post-experiment summary has been saved successfully.",
      duration: 2000,
    });
  };

  const handleClear = () => {
    reset();
    clearFromLocalStorage('summary');
    toast({
      title: "Data Cleared",
      description: "All post-experiment summary data has been cleared.",
      duration: 2000,
    });
  };

  const handleExportPDF = () => {
    setIsExporting(true);
    try {
      exportToPDF('summary', 'Post-Experiment Summary', formData);
      toast({
        title: "PDF Exported",
        description: "Your post-experiment summary has been exported to PDF successfully.",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export PDF. Please try again.",
        variant: "destructive",
        duration: 2000,
      });
    } finally {
      setTimeout(() => setIsExporting(false), 1000);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Post-Experiment Summary 📊</h2>
          <p className="text-sm text-gray-600 mt-1">A quick way to close the loop with stakeholders and store lessons learned.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button onClick={handleSave} className="bg-navy hover:bg-blue-800 text-white flex-1 sm:flex-none">
            Save
          </Button>
          <Button onClick={handleClear} variant="outline" className="border-form-border text-gray-700 hover:bg-gray-50 flex-1 sm:flex-none">
            Clear
          </Button>
          <Button 
            onClick={handleExportPDF} 
            disabled={isExporting}
            className="bg-green-600 hover:bg-green-700 text-white flex-1 sm:flex-none"
          >
            {isExporting ? "Generating..." : "Export PDF"}
          </Button>
        </div>
      </div>

      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">Experiment Title</Label>
            <Input
              {...register("title")}
              className="border-form-border"
              placeholder="Enter experiment title"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">Owner</Label>
            <Input
              {...register("owner")}
              className="border-form-border"
              placeholder="Enter owner name"
            />
          </div>
        </div>

        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">Date</Label>
          <Input
            {...register("date")}
            type="date"
            className="border-form-border max-w-xs"
          />
        </div>

        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">Result Summary</Label>
          <p className="text-xs text-gray-500 mb-2">(Primary Metric: Win / Loss / Neutral • Effect size: ___% (CI: –%) • Guardrails breached? Y/N)</p>
          <Textarea
            {...register("result_summary")}
            rows={4}
            className="border-form-border"
            placeholder="Summarize the key results and findings..."
          />
        </div>

        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">Key Learnings</Label>
          <p className="text-xs text-gray-500 mb-2">(Behavioural insights, not just stats)</p>
          <Textarea
            {...register("key_learnings")}
            rows={4}
            className="border-form-border"
            placeholder="What were the main insights and learnings?"
          />
        </div>

        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">Decision</Label>
          <Select value={formData.decision} onValueChange={(value) => setValue("decision", value)}>
            <SelectTrigger className="border-form-border max-w-xs">
              <SelectValue placeholder="Select decision" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="launch">Launch</SelectItem>
              <SelectItem value="iterate">Iterate</SelectItem>
              <SelectItem value="retire">Retire</SelectItem>
              <SelectItem value="retest">Re-test</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">Next Steps</Label>
          <p className="text-xs text-gray-500 mb-2">(Owner + deadline)</p>
          <Textarea
            {...register("next_steps")}
            rows={4}
            className="border-form-border"
            placeholder="What are the recommended next steps?"
          />
        </div>

        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">Notes for Future</Label>
          <p className="text-xs text-gray-500 mb-2">(Risks, surprises, analysis wrinkles)</p>
          <Textarea
            {...register("notes")}
            rows={3}
            className="border-form-border"
            placeholder="Any additional notes or considerations for future experiments..."
          />
        </div>
      </form>
    </div>
  );
}