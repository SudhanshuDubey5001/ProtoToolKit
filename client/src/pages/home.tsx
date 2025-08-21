import ExperimentToolkit from "@/components/experiment-toolkit";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-navy text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">
            AI-Augmented Prototyping Experiment Toolkit
          </h1>
          <a
            href="https://www.linkedin.com/in/nidhidubey21/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline"
          >
            created by Nidhi Dubey
          </a>
        </div>
      </header>
      <div className="max-w-6xl mx-auto px-6 py-8">
        <ExperimentToolkit />
      </div>
    </div>
  );
}
