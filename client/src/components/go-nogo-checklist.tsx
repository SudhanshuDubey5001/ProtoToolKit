import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { saveToLocalStorage, loadFromLocalStorage, clearFromLocalStorage } from "@/lib/storage";
import { exportToPDF } from "@/lib/pdf-export";

interface GoNoGoFormData {
  gono_1: boolean;
  gono_2: boolean;
  gono_3: boolean;
  gono_4: boolean;
  gono_5: boolean;
  gono_6: boolean;
  gono_7: boolean;
}

export default function GoNoGoChecklist() {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  
  const form = useForm<GoNoGoFormData>({
    defaultValues: {
      gono_1: false,
      gono_2: false,
      gono_3: false,
      gono_4: false,
      gono_5: false,
      gono_6: false,
      gono_7: false,
    },
  });

  const { watch, setValue, reset } = form;
  const formData = watch();

  // Load data on component mount
  useEffect(() => {
    const savedData = loadFromLocalStorage('gono');
    if (savedData) {
      Object.keys(savedData).forEach((key) => {
        setValue(key as keyof GoNoGoFormData, savedData[key]);
      });
    }
  }, [setValue]);

  const handleSave = () => {
    saveToLocalStorage('gono', formData);
    toast({
      title: "Data Saved",
      description: "Your go/no-go checklist has been saved successfully.",
      duration: 2000,
    });
  };

  const handleClear = () => {
    reset();
    clearFromLocalStorage('gono');
    toast({
      title: "Data Cleared",
      description: "All go/no-go checklist data has been cleared.",
      duration: 2000,
    });
  };

  const handleExportPDF = () => {
    setIsExporting(true);
    try {
      exportToPDF('gono', 'Go/No-Go Checklist for AI-Augmented Prototypes', formData);
      toast({
        title: "PDF Exported",
        description: "Your go/no-go checklist has been exported to PDF successfully.",
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

  const checklistItems = [
    { key: "gono_1", label: "Prototype fidelity matches intended test goal" },
    { key: "gono_2", label: "AI-generated content reviewed for compliance and tone" },
    { key: "gono_3", label: "Accessibility passed (contrast, tab order, screen reader)" },
    { key: "gono_4", label: "Brand guidelines met" },
    { key: "gono_5", label: "Data privacy rules satisfied" },
    { key: "gono_6", label: "Segment sample sizes viable" },
    { key: "gono_7", label: "Hypothesis ties back to real research insight" },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Go/No-Go Checklist for AI-Augmented Prototypes 🚦</h2>
          <p className="text-sm text-gray-600 mt-1">Run this before releasing an AI-generated prototype into a live experiment.</p>
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

      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="space-y-4">
          {checklistItems.map((item) => (
            <div key={item.key} className="flex items-start gap-3">
              <Checkbox
                id={item.key}
                checked={formData[item.key as keyof GoNoGoFormData]}
                onCheckedChange={(checked) => {
                  setValue(item.key as keyof GoNoGoFormData, checked as boolean);
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
    </div>
  );
}