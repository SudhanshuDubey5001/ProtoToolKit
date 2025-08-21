import ExperimentToolkit from "@/components/experiment-toolkit";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-navy text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <h1 className="text-xl font-semibold">AI-Augmented Prototyping Experiment Toolkit</h1>
        </div>
      </header>
      <div className="max-w-6xl mx-auto px-6 py-8">
        <ExperimentToolkit />
      </div>
    </div>
  );
}
