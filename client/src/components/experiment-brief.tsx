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

interface BriefFormData {
  title: string;
  owner: string;
  date: string;
  problem: string;
  hypothesis: string;
  primary_metric: string;
  guardrails: string;
  experiment_type: string;
  randomisation_unit: string;
  traffic_plan: string;
  baseline_mde: string;
  sample_size: string;
  variants: string;
  risks: string;
  decision_rule: string;
}

export default function ExperimentBrief() {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  
  const form = useForm<BriefFormData>({
    defaultValues: {
      title: "",
      owner: "",
      date: "",
      problem: "",
      hypothesis: "",
      primary_metric: "",
      guardrails: "",
      experiment_type: "",
      randomisation_unit: "",
      traffic_plan: "",
      baseline_mde: "",
      sample_size: "",
      variants: "",
      risks: "",
      decision_rule: "",
    },
  });

  const { register, watch, setValue, reset } = form;
  const formData = watch();

  // Load data on component mount
  useEffect(() => {
    const savedData = loadFromLocalStorage('brief');
    if (savedData) {
      Object.keys(savedData).forEach((key) => {
        setValue(key as keyof BriefFormData, savedData[key]);
      });
    }
  }, [setValue]);

  const handleSave = () => {
    saveToLocalStorage('brief', formData);
    toast({
      title: "Data Saved",
      description: "Your experiment brief has been saved successfully.",
      duration: 2000,
    });
  };

  const handleClear = () => {
    reset();
    clearFromLocalStorage('brief');
    toast({
      title: "Data Cleared",
      description: "All experiment brief data has been cleared.",
      duration: 2000,
    });
  };

  const handleExportPDF = () => {
    setIsExporting(true);
    try {
      exportToPDF('brief', 'Blank Experiment Brief', formData);
      toast({
        title: "PDF Exported",
        description: "Your experiment brief has been exported to PDF successfully.",
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
          <h2 className="text-2xl font-semibold text-gray-900">Blank Experiment Brief 📝</h2>
          <p className="text-sm text-gray-600 mt-1">A one-page planning document.</p>
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
          <Label className="block text-sm font-medium text-gray-700 mb-2">Problem Statement</Label>
          <p className="text-xs text-gray-500 mb-2">(One sentence)</p>
          <Textarea
            {...register("problem")}
            rows={3}
            className="border-form-border"
            placeholder="Describe the problem this experiment aims to solve..."
          />
        </div>

        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">Hypothesis</Label>
          <p className="text-xs text-gray-500 mb-2">(If we change X for Y, Z will happen because…)</p>
          <Textarea
            {...register("hypothesis")}
            rows={3}
            className="border-form-border"
            placeholder="If we change X for Y, Z will happen because..."
          />
        </div>

        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">Primary Metric</Label>
          <Input
            {...register("primary_metric")}
            className="border-form-border"
            placeholder="e.g., Conversion rate, CTR"
          />
        </div>

        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">Guardrails</Label>
          <Input
            {...register("guardrails")}
            className="border-form-border"
            placeholder="e.g., Page load time, Error rate"
          />
        </div>

        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">Experiment Type</Label>
          <Select value={formData.experiment_type} onValueChange={(value) => setValue("experiment_type", value)}>
            <SelectTrigger className="border-form-border max-w-md">
              <SelectValue placeholder="Select experiment type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ab">A/B</SelectItem>
              <SelectItem value="bandit">Multi-armed Bandit</SelectItem>
              <SelectItem value="factorial">Factorial</SelectItem>
              <SelectItem value="sequential">Sequential</SelectItem>
              <SelectItem value="adaptive">Adaptive Personalisation</SelectItem>
              <SelectItem value="hybrid">Hybrid Lab–Field</SelectItem>
              <SelectItem value="simulation">Simulation</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">Traffic Plan</Label>
          <Textarea
            {...register("traffic_plan")}
            rows={3}
            className="border-form-border"
            placeholder="Describe traffic allocation and ramp-up plan..."
          />
        </div>

        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">Randomisation Unit</Label>
          <Select value={formData.randomisation_unit} onValueChange={(value) => setValue("randomisation_unit", value)}>
            <SelectTrigger className="border-form-border max-w-xs">
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="session">Session</SelectItem>
              <SelectItem value="device">Device</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">Baseline & MDE</Label>
          <p className="text-xs text-gray-500 mb-2">(Baseline: ___% • MDE: ___%)</p>
          <Input
            {...register("baseline_mde")}
            className="border-form-border max-w-md"
            placeholder="e.g., Baseline: 5%, MDE: 10%"
          />
        </div>

        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">Sample Size</Label>
          <p className="text-xs text-gray-500 mb-2">(___ users/sessions per arm)</p>
          <Input
            {...register("sample_size")}
            className="border-form-border max-w-md"
            placeholder="e.g., 50,000 users per variant"
          />
        </div>

        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">Variants</Label>
          <p className="text-xs text-gray-500 mb-2">(ID • Description • Owner)</p>
          <Textarea
            {...register("variants")}
            rows={4}
            className="border-form-border"
            placeholder="Describe control and treatment variants..."
          />
        </div>

        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">Risks & Mitigations</Label>
          <Textarea
            {...register("risks")}
            rows={3}
            className="border-form-border"
            placeholder="Identify potential risks and mitigation strategies..."
          />
        </div>

        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">Decision Rule</Label>
          <p className="text-xs text-gray-500 mb-2">(Effect size, guardrails, conditions)</p>
          <Textarea
            {...register("decision_rule")}
            rows={3}
            className="border-form-border"
            placeholder="Define criteria for success/failure and launch decision..."
          />
        </div>
      </form>
    </div>
  );
}