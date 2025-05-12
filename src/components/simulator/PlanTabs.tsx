import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { SimulatorInputs } from '@/lib/solvency-constants';
import { Save } from "lucide-react";

interface PlanTabsProps {
  currentInputs: SimulatorInputs;
  onLoadPlan: (plan: SimulatorInputs) => void;
  onSavePlan: () => void;
}

const PlanTabs: React.FC<PlanTabsProps> = ({ 
  currentInputs, 
  onLoadPlan,
  onSavePlan
}) => {
  // Load default and saved plan
  const defaultPlan = getDefaultPlan();
  const savedPlan = getSavedPlan();
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    if (value === "default") {
      onLoadPlan(defaultPlan);
    } else if (value === "justins-plan") {
      if (savedPlan) {
        onLoadPlan(savedPlan);
      }
    }
  };

  return (
    <div className="mb-6">
      <Tabs defaultValue="default" onValueChange={handleTabChange}>
        <div className="flex justify-between items-center mb-2">
          <TabsList>
            <TabsTrigger value="default">Default Plan</TabsTrigger>
            <TabsTrigger value="justins-plan">Justin's Plan</TabsTrigger>
          </TabsList>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={onSavePlan}
            className="flex items-center gap-1"
          >
            <Save size={16} />
            Save Current Plan
          </Button>
        </div>
      </Tabs>
    </div>
  );
};

// Helper function to get default plan
function getDefaultPlan(): SimulatorInputs {
  return {
    combinedTaxStep: 0,
    empTaxOnlyStep: 0,
    employerTaxOnlyStep: 0,
    empCapOption: "status quo",
    customCapPct: 0,
    fraYearsUp: 0,
    chainedCPIflag: false,
    ppiCoveragePct: 0,
    immigBoostM: 0,
    equityShiftB: 0,
    employerSurcharge: 0,
    genRevTransferB: 0,
    combinedTaxImplementYear: 2040,
    empTaxOnlyImplementYear: 2040,
    employerTaxOnlyImplementYear: 2040,
    empCapImplementYear: 2040,
    employerSurchargeImplementYear: 2040,
    fraImplementYear: 2040,
    chainedCPIImplementYear: 2040,
    ppiImplementYear: 2040,
    middleIncludePct: 50,
    upperIncludePct: 85
  };
}

// Helper function to get saved plan
function getSavedPlan(): SimulatorInputs | null {
  const savedPlanJson = localStorage.getItem('justinsPlan');
  if (savedPlanJson) {
    try {
      return JSON.parse(savedPlanJson);
    } catch (e) {
      console.error('Error parsing saved plan', e);
      return null;
    }
  }
  return null;
}

export default PlanTabs; 