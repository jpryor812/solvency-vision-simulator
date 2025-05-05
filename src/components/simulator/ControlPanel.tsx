
import React from 'react';
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { SimulatorInputs, CapOption } from '@/lib/solvency-constants';

interface ControlPanelProps {
  inputs: SimulatorInputs;
  onChange: (newInputs: Partial<SimulatorInputs>) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ inputs, onChange }) => {
  const handleCapOptionChange = (value: string) => {
    onChange({ empCapOption: value as CapOption });
  };

  return (
    <div className="space-y-6">
      <Card className="card-shadow">
        <CardContent className="pt-6">
          <h2 className="text-lg font-bold mb-4">Tax Adjustments</h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Δ Combined OASDI Rate (ppt) ↕</Label>
                <span className="font-mono">{inputs.combinedTaxStep.toFixed(1)}</span>
              </div>
              <Slider 
                value={[inputs.combinedTaxStep]} 
                min={0} 
                max={2.0} 
                step={0.1} 
                onValueChange={(value) => onChange({ combinedTaxStep: value[0] })} 
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Δ Employee-only Rate (ppt)</Label>
                <span className="font-mono">{inputs.empTaxOnlyStep.toFixed(1)}</span>
              </div>
              <Slider 
                value={[inputs.empTaxOnlyStep]} 
                min={0} 
                max={2.0} 
                step={0.1} 
                onValueChange={(value) => onChange({ empTaxOnlyStep: value[0] })} 
              />
            </div>

            <div className="space-y-2">
              <Label>Wage Base Cap Adjustment</Label>
              <RadioGroup 
                value={inputs.empCapOption} 
                onValueChange={handleCapOptionChange}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="status quo" id="status-quo" />
                  <Label htmlFor="status-quo">Status Quo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="+50 %" id="plus-50" />
                  <Label htmlFor="plus-50">+50%</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="+100 %" id="plus-100" />
                  <Label htmlFor="plus-100">+100%</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No cap" id="no-cap" />
                  <Label htmlFor="no-cap">No Cap</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Custom %" id="custom" />
                  <Label htmlFor="custom">Custom %</Label>
                  <Input 
                    type="number" 
                    value={inputs.customCapPct} 
                    onChange={(e) => onChange({ customCapPct: Number(e.target.value) })}
                    className="w-24 ml-2" 
                    disabled={inputs.empCapOption !== "Custom %"}
                  />
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Employer-only Surtax (ppt)</Label>
                <span className="font-mono">{inputs.employerSurcharge.toFixed(1)}</span>
              </div>
              <Slider 
                value={[inputs.employerSurcharge]} 
                min={0} 
                max={1.0} 
                step={0.1} 
                onValueChange={(value) => onChange({ employerSurcharge: value[0] })} 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="card-shadow">
        <CardContent className="pt-6">
          <h2 className="text-lg font-bold mb-4">Benefit Adjustments</h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Raise Full Retirement Age (years)</Label>
                <span className="font-mono">{inputs.fraYearsUp}</span>
              </div>
              <Slider 
                value={[inputs.fraYearsUp]} 
                min={0} 
                max={4} 
                step={1} 
                onValueChange={(value) => onChange({ fraYearsUp: value[0] })} 
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch 
                checked={inputs.chainedCPIflag} 
                onCheckedChange={(checked) => onChange({ chainedCPIflag: checked })} 
                id="chained-cpi" 
              />
              <Label htmlFor="chained-cpi">Use Chained CPI</Label>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>% of Earners with CPI Indexing</Label>
                <span className="font-mono">{inputs.ppiCoveragePct}%</span>
              </div>
              <Slider 
                value={[inputs.ppiCoveragePct]} 
                min={0} 
                max={50} 
                step={10} 
                onValueChange={(value) => onChange({ ppiCoveragePct: value[0] })} 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="card-shadow">
        <CardContent className="pt-6">
          <h2 className="text-lg font-bold mb-4">Other Reforms</h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Extra Net Immigrants per Year (M)</Label>
                <span className="font-mono">{inputs.immigBoostM.toFixed(2)}M</span>
              </div>
              <Slider 
                value={[inputs.immigBoostM]} 
                min={0} 
                max={3} 
                step={0.25} 
                onValueChange={(value) => onChange({ immigBoostM: value[0] })} 
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Trust Fund $ to Equities (billions)</Label>
                <span className="font-mono">${inputs.equityShiftB}B</span>
              </div>
              <Slider 
                value={[inputs.equityShiftB]} 
                min={0} 
                max={1000} 
                step={100} 
                onValueChange={(value) => onChange({ equityShiftB: value[0] })} 
              />
            </div>

            <div className="space-y-2">
              <Label>Annual General Revenue Transfer ($B)</Label>
              <Input 
                type="number" 
                value={inputs.genRevTransferB} 
                onChange={(e) => onChange({ genRevTransferB: Number(e.target.value) })}
                className="w-full" 
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ControlPanel;
