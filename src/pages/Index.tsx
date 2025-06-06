import React, { useState, useEffect } from 'react';
import ControlPanel from '@/components/simulator/ControlPanel';
import SummaryCards from '@/components/simulator/SummaryCards';
import IncomeVsCostChart from '@/components/simulator/IncomeVsCostChart';
import TrustFundAssetsChart from '@/components/simulator/TrustFundAssetsChart';
import MonthsReserveChart from '@/components/simulator/MonthsReserveChart';
import DataTable from '@/components/simulator/DataTable';
import Disclaimer from '@/components/simulator/Disclaimer';
import PlanTabs from '@/components/simulator/PlanTabs';
import { SimulatorInputs } from '@/lib/solvency-constants';
import { runSimulation } from '@/lib/solvency-calculator';
import { useToast } from '@/hooks/use-toast';

const Index: React.FC = () => {
  const { toast } = useToast();
  
  // Get default plan values
  const getDefaultPlan = (): SimulatorInputs => ({
    combinedTaxStep: 0,
    empTaxOnlyStep: 0,
    empCapOption: "status quo",
    customCapPct: 20,
    fraYearsUp: 0,
    chainedCPIflag: false,
    ppiCoveragePct: 0,
    immigBoostM: 0,
    equityShiftB: 0,
    employerSurcharge: 0,
    employerTaxOnlyStep: 0,
    genRevTransferB: 0,
    combinedTaxImplementYear: 2040,
    empTaxOnlyImplementYear: 2040,
    employerTaxOnlyImplementYear: 2040,
    empCapImplementYear: 2040,
    fraImplementYear: 2040,
    chainedCPIImplementYear: 2040,
    ppiImplementYear: 2040,
    employerSurchargeImplementYear: 2040,
    middleIncludePct: 50,
    upperIncludePct: 85
  });
  
  // Initial values for simulator inputs
  const [inputs, setInputs] = useState<SimulatorInputs>(getDefaultPlan());
  
  // Run the simulation with current inputs
  const simulationResults = runSimulation(inputs);
  
  // Watch for months reserve warnings
  useEffect(() => {
    const hasNegativeReserves = simulationResults.yearlyData.some(
      data => data.monthsReserve < 0
    );
    
    if (hasNegativeReserves) {
      toast({
        title: "Warning",
        description: "One or more years have negative months of reserve, which is not realistic.",
        variant: "destructive",
      });
    }
  }, [simulationResults.yearlyData, toast]);

  // Handle input changes
  const handleInputChange = (newValues: Partial<SimulatorInputs>) => {
    setInputs(prev => ({
      ...prev,
      ...newValues
    }));
  };

  // Handler for loading saved plan
  const handleLoadPlan = (plan: SimulatorInputs) => {
    setInputs(plan);
  };

  // Handler for saving current plan
  const handleSavePlan = () => {
    localStorage.setItem('justinsPlan', JSON.stringify(inputs));
    toast({
      title: "Success",
      description: "Justin's Plan has been saved successfully!",
      variant: "default",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-6">
        <div className="container">
          <h1 className="text-2xl md:text-3xl font-bold">Social Security Solvency Simulator</h1>
          <p className="mt-2">
            Experiment with reforms and see real-time impacts on Social Security solvency
          </p>
        </div>
      </header>

      <main className="container py-8">
        {/* Add the Plan Tabs component */}
        <PlanTabs 
          currentInputs={inputs}
          onLoadPlan={handleLoadPlan}
          onSavePlan={handleSavePlan}
        />
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column - Control panel */}
          <div className="w-full lg:w-1/3">
            <ControlPanel inputs={inputs} onChange={handleInputChange} />
          </div>

          {/* Right column - Results */}
          <div className="w-full lg:w-2/3 space-y-6">
            {/* Summary Cards */}
            <SummaryCards 
              yearlyData={simulationResults.yearlyData} 
              depletionYear={simulationResults.depletionYear} 
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Income vs Cost Chart */}
              <div className="md:col-span-2">
                <IncomeVsCostChart data={simulationResults.yearlyData} />
              </div>

              {/* Trust Fund Assets Chart */}
              <div>
                <TrustFundAssetsChart data={simulationResults.yearlyData} />
              </div>

              {/* Months Reserve Chart */}
              <div>
                <MonthsReserveChart data={simulationResults.yearlyData} />
              </div>
            </div>

            {/* Data Table */}
            <DataTable 
              data={simulationResults.yearlyData} 
              depletionYear={simulationResults.depletionYear} 
            />
          </div>
        </div>

        {/* Disclaimer */}
        <Disclaimer />
      </main>
    </div>
  );
};

export default Index;
