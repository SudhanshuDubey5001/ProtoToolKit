import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import MasterChecklist from "./master-checklist";
import ExperimentBrief from "./experiment-brief";
import PostExperimentSummary from "./post-experiment-summary";
import GoNoGoChecklist from "./go-nogo-checklist";

export default function ExperimentToolkit() {
  const [activeTab, setActiveTab] = useState("checklist");
  const isMobile = useIsMobile();

  const tabs = [
    { id: "checklist", label: "Master Experiment Checklist" },
    { id: "brief", label: "Blank Experiment Brief" },
    { id: "summary", label: "Post-Experiment Summary" },
    { id: "gono", label: "Go/No-Go Checklist" },
  ];

  const handleMobileTabChange = (value: string) => {
    setActiveTab(value);
  };

  if (isMobile) {
    return (
      <div className="space-y-8">
        <div>
          <Select value={activeTab} onValueChange={handleMobileTabChange}>
            <SelectTrigger className="w-full p-3 border border-form-border rounded-lg bg-white">
              <SelectValue placeholder="Select a tab" />
            </SelectTrigger>
            <SelectContent>
              {tabs.map((tab) => (
                <SelectItem key={tab.id} value={tab.id}>
                  {tab.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          {activeTab === "checklist" && <MasterChecklist />}
          {activeTab === "brief" && <ExperimentBrief />}
          {activeTab === "summary" && <PostExperimentSummary />}
          {activeTab === "gono" && <GoNoGoChecklist />}
        </div>
      </div>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="hidden md:flex h-auto p-0 bg-transparent border-b border-form-border rounded-none">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="px-6 py-3 text-sm font-medium border-b-2 border-transparent text-gray-600 hover:text-navy data-[state=active]:border-navy data-[state=active]:text-navy data-[state=active]:bg-transparent rounded-none"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <div className="mt-8">
        <TabsContent value="checklist" className="mt-0">
          <MasterChecklist />
        </TabsContent>
        <TabsContent value="brief" className="mt-0">
          <ExperimentBrief />
        </TabsContent>
        <TabsContent value="summary" className="mt-0">
          <PostExperimentSummary />
        </TabsContent>
        <TabsContent value="gono" className="mt-0">
          <GoNoGoChecklist />
        </TabsContent>
      </div>
    </Tabs>
  );
}
