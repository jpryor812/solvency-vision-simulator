import React from 'react';
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { SimulatorInputs, CapOption } from '@/lib/solvency-constants';

interface ControlPanelProps {
  inputs: SimulatorInputs & {
    combinedTaxImplementYear: number;
    empTaxOnlyImplementYear: number;
    empCapImplementYear: number;
    employerSurchargeImplementYear: number;
    fraImplementYear: number;
    chainedCPIImplementYear: number;
    ppiImplementYear: number;
    middleIncludePct: number;
    upperIncludePct: number;
  };
  onChange: (newInputs: Partial<SimulatorInputs & {
    combinedTaxImplementYear: number;
    empTaxOnlyImplementYear: number;
    empCapImplementYear: number;
    employerSurchargeImplementYear: number;
    fraImplementYear: number;
    chainedCPIImplementYear: number;
    ppiImplementYear: number;
  }>) => void;
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
                <Label>Combined OASDI Rate (%)</Label>
                <span className="font-mono">{(12.4 + inputs.combinedTaxStep).toFixed(1)}%</span>
              </div>
              <Slider 
                value={[inputs.combinedTaxStep]} 
                min={0} 
                max={2.0} 
                step={0.1} 
                onValueChange={(value) => onChange({ combinedTaxStep: value[0] })} 
              />
              <div className="flex items-center space-x-2 mt-2">
                <Label htmlFor="combined-tax-year">Full implementation by:</Label>
                <Input 
                  id="combined-tax-year"
                  type="number" 
                  value={inputs.combinedTaxImplementYear || 2040} 
                  min={2025}
                  max={2050}
                  onChange={(e) => onChange({ combinedTaxImplementYear: Number(e.target.value) })}
                  className="w-20" 
                />
              </div>
            </div>

{/* Employer-only Rate 
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Employee-only Rate (%)</Label>
                <span className="font-mono">{(6.2 + inputs.empTaxOnlyStep).toFixed(1)}%</span>
              </div>
              <Slider 
                value={[inputs.empTaxOnlyStep]} 
                min={0} 
                max={2.0} 
                step={0.1} 
                onValueChange={(value) => onChange({ empTaxOnlyStep: value[0] })} 
              />
              <div className="flex items-center space-x-2 mt-2">
                <Label htmlFor="emp-tax-year">Full implementation by:</Label>
                <Input 
                  id="emp-tax-year"
                  type="number" 
                  value={inputs.empTaxOnlyImplementYear || 2040} 
                  min={2025}
                  max={2050}
                  onChange={(e) => onChange({ empTaxOnlyImplementYear: Number(e.target.value) })}
                  className="w-20" 
                />
              </div>
            </div>

            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Employer-only Rate (%)</Label>
                <span className="font-mono">{(6.2 + (inputs.employerTaxOnlyStep || 0)).toFixed(1)}%</span>
              </div>
              <Slider 
                value={[inputs.employerTaxOnlyStep || 0]} 
                min={0} 
                max={2.0} 
                step={0.1} 
                onValueChange={(value) => onChange({ employerTaxOnlyStep: value[0] })} 
              />
              <div className="flex items-center space-x-2 mt-2">
                <Label htmlFor="employer-tax-year">Full implementation by:</Label>
                <Input 
                  id="employer-tax-year"
                  type="number" 
                  value={inputs.employerTaxOnlyImplementYear || 2040} 
                  min={2025}
                  max={2050}
                  onChange={(e) => onChange({ employerTaxOnlyImplementYear: Number(e.target.value) })}
                  className="w-20" 
                />
              </div>
            </div>
            */}

            <div className="space-y-2">
              <Label>Wage Base Cap Adjustment</Label>
              <RadioGroup 
                value={inputs.empCapOption} 
                onValueChange={handleCapOptionChange}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="status quo" id="status-quo" />
                  <Label htmlFor="status-quo">Status Quo ($176,100)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="+50 %" id="plus-50" />
                  <Label htmlFor="plus-50">+50% ($264,150)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="+75 %" id="plus-75" />
                  <Label htmlFor="plus-75">+75% ($303,187)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="+100 %" id="plus-100" />
                  <Label htmlFor="plus-100">+100% ($352,200)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="+200 %" id="plus-200" />
                  <Label htmlFor="plus-200">+200% ($528,300)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No cap" id="no-cap" />
                  <Label htmlFor="no-cap">No Cap (∞)</Label>
                </div>
              </RadioGroup>
              
              <div className="flex items-center space-x-2 mt-2">
                <Label htmlFor="emp-cap-year">Full implementation by:</Label>
                <Input 
                  id="emp-cap-year"
                  type="number" 
                  value={inputs.empCapImplementYear || 2040} 
                  min={2025}
                  max={2050}
                  onChange={(e) => onChange({ empCapImplementYear: Number(e.target.value) })}
                  className="w-20" 
                  disabled={inputs.empCapOption === "status quo"}
                />
              </div>
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
                <Label>Full Retirement Age</Label>
                <span className="font-mono">{67 + inputs.fraYearsUp} years</span>
              </div>
              <Slider 
                value={[inputs.fraYearsUp]} 
                min={0} 
                max={13} 
                step={1} 
                onValueChange={(value) => onChange({ fraYearsUp: value[0] })} 
              />
              <div className="flex items-center space-x-2 mt-2">
                <Label htmlFor="fra-year">Full implementation by:</Label>
                <Input 
                  id="fra-year"
                  type="number" 
                  value={inputs.fraImplementYear || 2040} 
                  min={2025}
                  max={2050}
                  onChange={(e) => onChange({ fraImplementYear: Number(e.target.value) })}
                  className="w-20" 
                  disabled={inputs.fraYearsUp === 0}
                />
              </div>
            </div>
{/*
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={inputs.chainedCPIflag} 
                  onCheckedChange={(checked) => onChange({ chainedCPIflag: checked })} 
                  id="chained-cpi" 
                />
                <Label htmlFor="chained-cpi">Use Chained CPI</Label>
              </div>
              {inputs.chainedCPIflag && (
                <div className="flex items-center space-x-2 mt-2 ml-8">
                  <Label htmlFor="chained-cpi-year">Full implementation by:</Label>
                  <Input 
                    id="chained-cpi-year"
                    type="number" 
                    value={inputs.chainedCPIImplementYear || 2040} 
                    min={2025}
                    max={2050}
                    onChange={(e) => onChange({ chainedCPIImplementYear: Number(e.target.value) })}
                    className="w-20" 
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>% of Earners with PPI Indexing</Label>
                <span className="font-mono">{inputs.ppiCoveragePct}%</span>
              </div>
              <Slider 
                value={[inputs.ppiCoveragePct]} 
                min={0} 
                max={50} 
                step={10} 
                onValueChange={(value) => onChange({ ppiCoveragePct: value[0] })} 
              />
              <div className="flex items-center space-x-2 mt-2">
                <Label htmlFor="ppi-year">Full implementation by:</Label>
                <Input 
                  id="ppi-year"
                  type="number" 
                  value={inputs.ppiImplementYear || 2040} 
                  min={2025}
                  max={2050}
                  onChange={(e) => onChange({ ppiImplementYear: Number(e.target.value) })}
                  className="w-20" 
                  disabled={inputs.ppiCoveragePct === 0}
                />
              </div>
            </div>
                           */}
          </div>
        </CardContent>
      </Card>

{/* ----- Benefit‑tax sliders: middle & upper bands --------------------- */}
<Card className="card-shadow">
  <CardContent className="pt-6">
    <h2 className="text-lg font-bold mb-4">Taxation of Benefits</h2>

    {/* ── Middle‑band slider (currently 50 % inclusion) ── */}
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Middle band inclusion <br />
                 <span className="text-xs font-normal">
                   \$25–34 k single / \$32–44 k joint
                 </span>
          </Label>
          <span className="font-mono">
            {inputs.middleIncludePct.toFixed(0)}%
          </span>
        </div>
        <Slider
          value={[inputs.middleIncludePct]}
          min={50}
          max={100}
          step={1}
          onValueChange={(v) => onChange({ middleIncludePct: v[0] })}
        />
      </div>

      {/* ── Upper‑band slider (currently 85 % inclusion) ── */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Upper band inclusion <br />
                 <span className="text-xs font-normal">
                   &gt;\$34 k single / &gt;\$44 k joint
                 </span>
          </Label>
          <span className="font-mono">
            {inputs.upperIncludePct.toFixed(0)}%
          </span>
        </div>
        <Slider
          value={[inputs.upperIncludePct]}
          min={85}
          max={100}
          step={1}
          onValueChange={(v) => onChange({ upperIncludePct: v[0] })}
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
                <Label>Extra Net Immigrants per Year (2.8M baseline)</Label>
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
                step={25} 
                onValueChange={(value) => onChange({ equityShiftB: value[0] })} 
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ControlPanel;
