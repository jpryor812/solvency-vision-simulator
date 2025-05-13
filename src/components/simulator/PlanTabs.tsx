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
  const justinsPlan = getJustinsPlan();
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    if (value === "default") {
      onLoadPlan(getDefaultPlan());
    } else if (value === "justins-plan") {
      onLoadPlan(getJustinsPlan());
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

// Replace getSavedPlan with a hardcoded version of Justin's Plan
function getJustinsPlan(): SimulatorInputs {
  return {
    combinedTaxStep: 0.4, // Example values
    empTaxOnlyStep: 0.0,
    employerTaxOnlyStep: 0.0,
    empCapOption: "+75 %",
    customCapPct: 20,
    fraYearsUp: 5,
    chainedCPIflag: false,
    ppiCoveragePct: 0,
    immigBoostM: 2.5,
    equityShiftB: 175,
    employerSurcharge: 0.0,
    genRevTransferB: 0,
    // Implementation years
    combinedTaxImplementYear: 2034,
    empTaxOnlyImplementYear: 2040,
    employerTaxOnlyImplementYear: 2040,
    empCapImplementYear: 2028,
    fraImplementYear: 2050,
    chainedCPIImplementYear: 2030,
    ppiImplementYear: 2035,
    employerSurchargeImplementYear: 2040,
    middleIncludePct: 60,
    upperIncludePct: 100
  };
}

export default PlanTabs; 