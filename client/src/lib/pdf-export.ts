declare global {
  interface Window {
    jspdf: any;
  }
}

export const exportToPDF = (tabId: string, title: string, formData: any): void => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  // Set up PDF
  doc.setFontSize(20);
  doc.text(title, 20, 20);
  
  let yPosition = 40;
  const lineHeight = 10;
  const maxWidth = 170;
  
  if (tabId === 'checklist' || tabId === 'gono') {
    // Handle checklist items
    const sections = getSections(tabId);
    
    sections.forEach((section: any) => {
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text(section.title, 20, yPosition);
      yPosition += lineHeight + 5;
      doc.setFont(undefined, 'normal');
      doc.setFontSize(10);
      
      section.items.forEach((item: any) => {
        const isChecked = formData[item.name] ? '☑' : '☐';
        const text = `${isChecked} ${item.label}`;
        
        const lines = doc.splitTextToSize(text, maxWidth);
        lines.forEach((line: string) => {
          if (yPosition > 280) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(line, 20, yPosition);
          yPosition += lineHeight;
        });
        yPosition += 2;
      });
      yPosition += 5;
    });
    
    // Handle final decision for go/no-go
    if (tabId === 'gono' && formData.final_decision) {
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      const decisionText = formData.final_decision === 'go' ? 'GO - Launch the experiment results' : 'NO-GO - Do not launch';
      doc.text('Final Decision: ' + decisionText, 20, yPosition);
      yPosition += lineHeight;
    }
  } else {
    // Handle form fields
    const fields = getFormFields(tabId);
    
    fields.forEach((field: any) => {
      const value = formData[field.name];
      if (value && value.trim && value.trim()) {
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text(field.label + ':', 20, yPosition);
        yPosition += lineHeight;
        
        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);
        const lines = doc.splitTextToSize(value, maxWidth);
        lines.forEach((line: string) => {
          if (yPosition > 280) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(line, 20, yPosition);
          yPosition += lineHeight;
        });
        yPosition += 5;
      }
    });
  }
  
  // Add timestamp
  const now = new Date();
  doc.setFontSize(8);
  doc.setFont(undefined, 'italic');
  doc.text(`Generated on ${now.toLocaleString()}`, 20, doc.internal.pageSize.height - 10);
  
  // Save PDF
  doc.save(`${title.replace(/\s+/g, '_').toLowerCase()}.pdf`);
};

const getSections = (tabId: string) => {
  if (tabId === 'checklist') {
    return [
      {
        title: 'Planning & Hypothesis',
        items: [
          { name: 'planning_1', label: 'Problem statement clearly defined and documented' },
          { name: 'planning_2', label: 'Hypothesis is specific, measurable, and testable' },
          { name: 'planning_3', label: 'Success metrics and guardrails identified' },
          { name: 'planning_4', label: 'Minimum detectable effect (MDE) calculated' },
          { name: 'planning_5', label: 'Sample size requirements determined' },
          { name: 'planning_6', label: 'Experiment duration and timeline planned' }
        ]
      },
      {
        title: 'Design & Setup',
        items: [
          { name: 'design_1', label: 'Randomization strategy implemented correctly' },
          { name: 'design_2', label: 'Control and treatment variants defined' },
          { name: 'design_3', label: 'Tracking and measurement infrastructure ready' },
          { name: 'design_4', label: 'Quality assurance testing completed' },
          { name: 'design_5', label: 'Stakeholder alignment and approvals obtained' }
        ]
      },
      {
        title: 'Execution',
        items: [
          { name: 'execution_1', label: 'Experiment launched successfully without issues' },
          { name: 'execution_2', label: 'Daily monitoring for anomalies and issues' },
          { name: 'execution_3', label: 'Traffic allocation working as expected' },
          { name: 'execution_4', label: 'Data collection functioning properly' },
          { name: 'execution_5', label: 'Regular progress updates communicated to stakeholders' }
        ]
      },
      {
        title: 'Analysis & Decision',
        items: [
          { name: 'analysis_1', label: 'Statistical significance reached for primary metric' },
          { name: 'analysis_2', label: 'Guardrail metrics checked and within acceptable limits' },
          { name: 'analysis_3', label: 'Segment analysis completed for key user groups' },
          { name: 'analysis_4', label: 'Results validated and peer reviewed' },
          { name: 'analysis_5', label: 'Clear go/no-go decision made based on results' }
        ]
      },
      {
        title: 'Post-Experiment',
        items: [
          { name: 'post_1', label: 'Results documented and shared with stakeholders' },
          { name: 'post_2', label: 'Key learnings and insights captured' },
          { name: 'post_3', label: 'Follow-up actions and next steps defined' },
          { name: 'post_4', label: 'Experiment data archived and accessible for future reference' }
        ]
      }
    ];
  } else if (tabId === 'gono') {
    return [
      {
        title: 'Launch Readiness Checklist',
        items: [
          { name: 'gono_1', label: 'Results show statistically significant improvement in primary metric' },
          { name: 'gono_2', label: 'All guardrail metrics are within acceptable thresholds' },
          { name: 'gono_3', label: 'No significant negative impact on user experience metrics' },
          { name: 'gono_4', label: 'Technical implementation is stable and scalable' },
          { name: 'gono_5', label: 'Results are consistent across key user segments' },
          { name: 'gono_6', label: 'Business impact justifies implementation costs' },
          { name: 'gono_7', label: 'Stakeholder approval obtained for full launch' }
        ]
      }
    ];
  }
  return [];
};

const getFormFields = (tabId: string) => {
  if (tabId === 'brief') {
    return [
      { name: 'title', label: 'Experiment Title' },
      { name: 'owner', label: 'Owner' },
      { name: 'date', label: 'Date' },
      { name: 'problem', label: 'Problem Statement' },
      { name: 'hypothesis', label: 'Hypothesis' },
      { name: 'primary_metric', label: 'Primary Metric' },
      { name: 'guardrails', label: 'Guardrails' },
      { name: 'experiment_type', label: 'Experiment Type' },
      { name: 'randomisation_unit', label: 'Randomisation Unit' },
      { name: 'traffic_plan', label: 'Traffic Plan' },
      { name: 'baseline_mde', label: 'Baseline & MDE' },
      { name: 'sample_size', label: 'Sample Size' },
      { name: 'variants', label: 'Variants' },
      { name: 'risks', label: 'Risks & Mitigations' },
      { name: 'decision_rule', label: 'Decision Rule' }
    ];
  } else if (tabId === 'summary') {
    return [
      { name: 'title', label: 'Experiment Title' },
      { name: 'owner', label: 'Owner' },
      { name: 'date', label: 'Date' },
      { name: 'result_summary', label: 'Result Summary' },
      { name: 'key_learnings', label: 'Key Learnings' },
      { name: 'decision', label: 'Decision' },
      { name: 'next_steps', label: 'Next Steps' },
      { name: 'notes', label: 'Notes for Future' }
    ];
  }
  return [];
};
