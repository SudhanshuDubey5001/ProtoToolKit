import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { saveToLocalStorage, loadFromLocalStorage, clearFromLocalStorage } from "@/lib/storage";
import { exportToPDF } from "@/lib/pdf-export";

interface ChecklistFormData {
  planning_1: boolean;
  planning_2: boolean;
  planning_3: boolean;
  planning_4: boolean;
  planning_5: boolean;
  planning_6: boolean;
  design_1: boolean;
  design_2: boolean;
  design_3: boolean;
  design_4: boolean;
  design_5: boolean;
  execution_1: boolean;
  execution_2: boolean;
  execution_3: boolean;
  execution_4: boolean;
  execution_5: boolean;
  analysis_1: boolean;
  analysis_2: boolean;
  analysis_3: boolean;
  analysis_4: boolean;
  analysis_5: boolean;
  post_1: boolean;
  post_2: boolean;
  post_3: boolean;
  post_4: boolean;
}

export default function MasterChecklist() {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  
  const form = useForm<ChecklistFormData>({
    defaultValues: {
      planning_1: false,
      planning_2: false,
      planning_3: false,
      planning_4: false,
      planning_5: false,
      planning_6: false,
      design_1: false,
      design_2: false,
      design_3: false,
      design_4: false,
      design_5: false,
      execution_1: false,
      execution_2: false,
      execution_3: false,
      execution_4: false,
      execution_5: false,
      analysis_1: false,
      analysis_2: false,
      analysis_3: false,
      analysis_4: false,
      analysis_5: false,
      post_1: false,
      post_2: false,
      post_3: false,
      post_4: false,
    },
  });

  const { watch, setValue, reset } = form;
  const formData = watch();

  // Load data on component mount
  useEffect(() => {
    const savedData = loadFromLocalStorage('checklist');
    if (savedData) {
      Object.keys(savedData).forEach((key) => {
        setValue(key as keyof ChecklistFormData, savedData[key]);
      });
    }
  }, [setValue]);

  const handleSave = () => {
    saveToLocalStorage('checklist', formData);
    toast({
      title: "Data Saved",
      description: "Your checklist data has been saved successfully.",
      duration: 2000,
    });
  };

  const handleClear = () => {
    reset();
    clearFromLocalStorage('checklist');
    toast({
      title: "Data Cleared",
      description: "All checklist data has been cleared.",
      duration: 2000,
    });
  };

  const handleExportPDF = () => {
    setIsExporting(true);
    try {
      exportToPDF('checklist', 'Master Experiment Checklist', formData);
      toast({
        title: "PDF Exported",
        description: "Your checklist has been exported to PDF successfully.",
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

  const sections = [
    {
      title: "Planning & Hypothesis",
      items: [
        { key: "planning_1", label: "Problem defined in one sentence" },
        { key: "planning_2", label: "Hypothesis includes direction + expected impact" },
        { key: "planning_3", label: "Minimum Detectable Effect (MDE) calculated" },
        { key: "planning_4", label: "Primary metric + definition documented" },
        { key: "planning_5", label: "Guardrail metrics listed with rationale" },
        { key: "planning_6", label: "Target segments/eligibility rules defined" },
      ],
    },
    {
      title: "Design & Setup",
      items: [
        { key: "design_1", label: "Experiment type selected (A/B, Bandit, Factorial, etc.)" },
        { key: "design_2", label: "Traffic allocation plan agreed (with floors if adaptive)" },
        { key: "design_3", label: "Variant version control in place" },
        { key: "design_4", label: "Randomisation unit + method documented" },
        { key: "design_5", label: "Analysis plan pre-registered" },
      ],
    },
    {
      title: "Execution",
      items: [
        { key: "execution_1", label: "Burn-in/baseline period scheduled" },
        { key: "execution_2", label: "Interim look schedule set (if sequential)" },
        { key: "execution_3", label: "Adaptive tweak rules pre-written" },
        { key: "execution_4", label: "Accessibility & brand checks done" },
        { key: "execution_5", label: "Event logging validated" },
      ],
    },
    {
      title: "Analysis & Decision",
      items: [
        { key: "analysis_1", label: "Method documented (frequentist/Bayesian)" },
        { key: "analysis_2", label: "Stop rule respected (no unscheduled peeks)" },
        { key: "analysis_3", label: "Guardrails checked before declaring win" },
        { key: "analysis_4", label: "Effect size + CI interpreted" },
        { key: "analysis_5", label: "Practical significance assessed" },
      ],
    },
    {
      title: "Post-Experiment",
      items: [
        { key: "post_1", label: "Decision logged (launch/iterate/retire)" },
        { key: "post_2", label: "Findings shared in ≤1-page summary" },
        { key: "post_3", label: "Data + results stored in registry" },
        { key: "post_4", label: "Risk/mitigation notes updated" },
      ],
    },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Master Experiment Checklist ✅</h2>
          <p className="text-sm text-gray-600 mt-1">Use this before, during, and after your experiment to ensure nothing slips through the cracks.</p>
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

      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.title} className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-4">{section.title}</h3>
            <div className="space-y-3">
              {section.items.map((item) => (
                <div key={item.key} className="flex items-start gap-3">
                  <Checkbox
                    id={item.key}
                    checked={formData[item.key as keyof ChecklistFormData]}
                    onCheckedChange={(checked) => {
                      setValue(item.key as keyof ChecklistFormData, checked as boolean);
                    }}
                    className="mt-1"
                  />
                  <label
                    htmlFor={item.key}
                    className="text-sm text-gray-700 leading-relaxed cursor-pointer"
                  >
                    {item.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}