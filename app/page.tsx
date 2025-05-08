"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area
} from "recharts";
import { 
  ThermometerSun, 
  Waves, 
  Snowflake, 
  Info, 
  ArrowRight,
  Cloud,
  Factory,
  Car,
  Trees,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Sun,
  Moon
} from "lucide-react";
import { useTheme } from "next-themes";


const GlobalStyles = () => (
  <style jsx global>{`
    @import url('https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;500;600;700&family=Libre+Baskerville:wght@400;700&display=swap');
    body {
      font-family: 'Libre Baskerville', serif;
    }
    .font-league-spartan {
      font-family: 'League Spartan', sans-serif;
    }
  `}</style>
);


interface CustomSliderProps {
  value: number;
  max?: number;
  step?: number;
  reportValueChange: (value: number[]) => void;
  thumbColor?: string;
  rangeColor?: string;
  trackColor?: string;
  ariaLabel?: string;
}

const CustomSlider: React.FC<CustomSliderProps> = ({
  value,
  max = 100,
  step = 1,
  reportValueChange,
  thumbColor = "bg-white dark:bg-[#f3f5f4]",
  rangeColor = "bg-[#3e3fba]",
  trackColor = "bg-[#edf4f8] dark:bg-gray-700",
  ariaLabel
}) => {
  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const calculateValueFromPosition = useCallback((clientX) => {
    if (!sliderRef.current) return value;

    const { left, width } = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (clientX - left) / width));
    let newValue = percentage * max;
    
    if (step) {
      newValue = Math.round(newValue / step) * step;
    }
    return Math.max(0, Math.min(max, newValue));
  }, [max, step, value]);

  const initiateSliderDrag = (clientX) => {
    setIsDragging(true);
    const newValue = calculateValueFromPosition(clientX);
    reportValueChange([newValue]);
  };
  
  const updateSliderPosition = useCallback((clientX) => {
    if (!isDragging || !sliderRef.current) return;
    const newValue = calculateValueFromPosition(clientX);
    reportValueChange([newValue]);
  }, [isDragging, calculateValueFromPosition, reportValueChange]);

  const finalizeSliderDrag = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    const mouseMoveUpdate = (event) => updateSliderPosition(event.clientX);
    const mouseUpFinalize = () => finalizeSliderDrag();
    const touchMoveUpdate = (event) => updateSliderPosition(event.touches[0].clientX);
    const touchEndFinalize = () => finalizeSliderDrag();

    if (isDragging) {
      document.addEventListener("mousemove", mouseMoveUpdate);
      document.addEventListener("mouseup", mouseUpFinalize);
      document.addEventListener("touchmove", touchMoveUpdate);
      document.addEventListener("touchend", touchEndFinalize);
    }

    return () => {
      document.removeEventListener("mousemove", mouseMoveUpdate);
      document.removeEventListener("mouseup", mouseUpFinalize);
      document.removeEventListener("touchmove", touchMoveUpdate);
      document.removeEventListener("touchend", touchEndFinalize);
    };
  }, [isDragging, updateSliderPosition, finalizeSliderDrag]);
  
  const percentageValue = (value / max) * 100;

  return (
    <div
      ref={sliderRef}
      className={`relative flex items-center select-none touch-none w-full h-5 cursor-pointer`}
      onMouseDown={(e) => initiateSliderDrag(e.clientX)}
      onTouchStart={(e) => initiateSliderDrag(e.touches[0].clientX)}
      onClick={(e) => {
        if (!isDragging) {
          const newValue = calculateValueFromPosition(e.clientX);
          reportValueChange([newValue]);
        }
      }}
    >
      <div className={`relative grow rounded-full h-[3px] ${trackColor}`}>
        <div 
          className={`absolute rounded-full h-full ${rangeColor}`}
          style={{ width: `${percentageValue}%` }}
        />
      </div>
      <div
        className={`block w-5 h-5 ${thumbColor} rounded-full focus:outline-none absolute`}
        style={{ left: `calc(${percentageValue}% - 10px)` }}
        role="slider"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={ariaLabel || "Slider thumb"}
        tabIndex={0}
      />
    </div>
  );
};


type PolicySettings = {
  renewableEnergy: number;
  carbonTax: number;
  reforestation: number;
  electricVehicles: number;
  wasteReduction: number;
};

type ClimateMetrics = {
  year: number;
  temperature: number;
  seaLevel: number;
  iceCap: number;
};


const generateNarrativeInsights = (policies: PolicySettings, finalMetrics: ClimateMetrics | null): string => {
  if (!finalMetrics) return "Adjust policies to see their impact.";

  let insights = "";
  const { temperature, seaLevel, iceCap } = finalMetrics;
  const { renewableEnergy, carbonTax, reforestation, electricVehicles, wasteReduction } = policies;

  
  if (temperature > 16.5) { 
    insights += `High global temperatures (${temperature.toFixed(1)}°C) are a major concern. `;
  } else if (temperature < 15.5) { 
    insights += `Global temperature is well-controlled (${temperature.toFixed(1)}°C). `;
  } else {
    insights += `Global temperature is ${temperature.toFixed(1)}°C. `;
  }

  
  if (seaLevel > 50) {
    insights += `Significant sea level rise (+${seaLevel.toFixed(1)}cm) poses a threat to coastal regions. `;
  } else if (seaLevel < 15) {
    insights += `Sea level rise (+${seaLevel.toFixed(1)}cm) appears manageable. `;
  } else {
    insights += `Sea levels have risen by +${seaLevel.toFixed(1)}cm. `;
  }

  
  if (iceCap < 30) {
    insights += `Critically low ice cap thickness (${iceCap.toFixed(1)}%) indicates severe melting. `;
  } else if (iceCap > 70) {
    insights += `Ice caps remain relatively stable (${iceCap.toFixed(1)}%). `;
  } else {
    insights += `Ice cap thickness is at ${iceCap.toFixed(1)}%. `;
  }

  insights += "\n\nPolicy contributions: ";

  
  let positivePolicyCount = 0;
  let concerns = [];

  if (renewableEnergy > 70) {
    insights += "Strong renewable energy adoption is key. ";
    positivePolicyCount++;
  } else if (renewableEnergy < 30) {
    concerns.push("low renewable energy focus");
  }

  if (carbonTax > 60) {
    insights += "A robust carbon tax is effectively curbing emissions. ";
    positivePolicyCount++;
  } else if (carbonTax < 25) {
    concerns.push("insufficient carbon tax");
  }
  
  if (reforestation > 65) {
    insights += "Aggressive reforestation is boosting carbon capture. ";
    positivePolicyCount++;
  } else if (reforestation < 30) {
    concerns.push("limited reforestation efforts");
  }

  if (electricVehicles > 70) {
    insights += "Widespread EV adoption significantly reduces transport emissions. ";
    positivePolicyCount++;
  } else if (electricVehicles < 30) {
    concerns.push("slow EV transition");
  }
  
  if (wasteReduction > 60) {
    insights += "Effective waste reduction minimizes methane and resource use. ";
    positivePolicyCount++;
  } else if (wasteReduction < 30) {
    concerns.push("inadequate waste reduction measures");
  }

  if (positivePolicyCount >= 3) {
    insights += "This balanced and ambitious approach is yielding positive results overall. ";
  } else if (concerns.length > 0) {
    insights += `However, ${concerns.join(', ')} may be undermining progress. `;
  }
  
  if (temperature > 16 && positivePolicyCount < 2 && concerns.length > 1){
      insights += "The current policy mix is insufficient to address the climate challenge effectively. Stronger, more comprehensive action is urgently needed across multiple sectors. "
  }

  return insights.trim();
};


export default function ClimateSimulationApp() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const performThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  
  const [policies, updatePolicySettings] = useState<PolicySettings>({
    renewableEnergy: 30,
    carbonTax: 25,
    reforestation: 40,
    electricVehicles: 35,
    wasteReduction: 45,
  });
  
  
  const [climateData, setClimateProjections] = useState<ClimateMetrics[]>([]);
  const [activeTab, setActiveChartTab] = useState("temperature");
  const [narrativeInsights, setScenarioText] = useState("");
  
  
  useEffect(() => {
    const simulationResults = generateSimulationData(policies);
    setClimateProjections(simulationResults);
    if (simulationResults.length > 0) {
      const finalMetrics = simulationResults[simulationResults.length - 1];
      setScenarioText(generateNarrativeInsights(policies, finalMetrics));
    }
  }, [policies]);
  
  
  const generateSimulationData = (settings: PolicySettings): ClimateMetrics[] => {
    const baseTemp = 14.5;
    const baseSeaLevel = 0;
    const baseIceCap = 100;
    
    
    const renewableImpact = (settings.renewableEnergy / 100) * 1.5;
    const carbonTaxImpact = (settings.carbonTax / 100) * 1.2;
    const reforestationImpact = (settings.reforestation / 100) * 0.8;
    const evImpact = (settings.electricVehicles / 100) * 0.7;
    const wasteImpact = (settings.wasteReduction / 100) * 0.6;
    
    const totalPositiveImpact = renewableImpact + carbonTaxImpact + 
                               reforestationImpact + evImpact + wasteImpact;
    
    
    return Array.from({ length: 9 }, (_, i) => {
      const year = 2020 + (i * 10);
      const businessAsUsualTemp = baseTemp + (i * 0.4);
      const businessAsUsualSeaLevel = baseSeaLevel + (i * 10);
      const businessAsUsualIceCap = Math.max(0, baseIceCap - (i * 12));
      
      
      const temperature = Math.max(
        baseTemp, 
        businessAsUsualTemp - (totalPositiveImpact * (i * 0.05))
      );
      
      const seaLevel = Math.max(
        baseSeaLevel,
        businessAsUsualSeaLevel - (totalPositiveImpact * (i * 1.2))
      );
      
      const iceCap = Math.min(
        baseIceCap,
        Math.max(0, businessAsUsualIceCap + (totalPositiveImpact * (i * 1.5)))
      );
      
      return { year, temperature, seaLevel, iceCap };
    });
  };
  
  const setRenewableLevel = (value) => {
    updatePolicySettings({ ...policies, renewableEnergy: value[0] });
  };
  
  const alterCarbonPolicyValue = (value) => {
    updatePolicySettings({ ...policies, carbonTax: value[0] });
  };
  
  const updateForestryEfforts = (value) => {
    updatePolicySettings({ ...policies, reforestation: value[0] });
  };
  
  const modifyEVAdoptionRate = (value) => {
    updatePolicySettings({ ...policies, electricVehicles: value[0] });
  };
  
  const setWasteReductionTarget = (value) => {
    updatePolicySettings({ ...policies, wasteReduction: value[0] });
  };

  
  const getImpactSummary = () => {
    if (climateData.length === 0) return null;
    
    const firstData = climateData[0];
    const lastData = climateData[climateData.length - 1];
    
    const tempChange = lastData.temperature - firstData.temperature;
    const seaChange = lastData.seaLevel - firstData.seaLevel;
    const iceChange = lastData.iceCap - firstData.iceCap;
    
    return {
      tempChange: tempChange.toFixed(1),
      seaChange: seaChange.toFixed(1),
      iceChange: iceChange.toFixed(1)
    };
  };

  if (!mounted) {
    return <GlobalStyles />;
  }

  const openLearnMoreInfo = () => {
    alert("Redirecting to Learn more page");
  };

  const chartTickAndLabelColor = theme === 'dark' ? '#cbd5e1' : '#374151';
  const sliderThumbColor = theme === 'light' ? 'bg-[#2c2d84]' : 'bg-[#f3f5f4]';

  return (
    <>
      <GlobalStyles />
      <div className="min-h-screen bg-[#b1daf5] dark:bg-slate-900 text-gray-800 dark:text-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <header className="py-4 md:py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold font-league-spartan text-black dark:text-gray-100">
                  Climate Future Simulator
                </h1>
                <p className="text-sm md:text-base opacity-90 text-black dark:text-gray-100">
                  Interactive Policy & Environmental Impact Visualization
                </p>
              </div>
            </div>
          </header>
          
          <main className="py-4 md:py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-3xl p-5">
              <h2 className="text-xl font-league-spartan font-bold mb-4 text-[#8e4e9d] dark:text-[#b4daf2]">
                Environmental Policy Controls
              </h2>
              
              <div className="space-y-6">
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Factory size={18} className="text-[#3e3fba]" />
                      <span>Renewable Energy Adoption</span>
                    </span>
                    <span className="font-medium">{policies.renewableEnergy}%</span>
                  </div>
                  <CustomSlider
                    value={policies.renewableEnergy}
                    reportValueChange={setRenewableLevel}
                    ariaLabel="Renewable Energy Adoption"
                    rangeColor="bg-[#3e3fba]"
                    thumbColor={sliderThumbColor}
                  />
                </div>
                
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Waves size={18} className="text-[#3e3fba]" />
                      <span>Carbon Tax Policy</span>
                    </span>
                    <span className="font-medium">{policies.carbonTax}%</span>
                  </div>
                  <CustomSlider
                    value={policies.carbonTax}
                    reportValueChange={alterCarbonPolicyValue}
                    ariaLabel="Carbon Tax Policy"
                    rangeColor="bg-[#3e3fba]"
                    thumbColor={sliderThumbColor}
                  />
                </div>
                
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Trees size={18} className="text-[#42be4f]" />
                      <span>Reforestation Efforts</span>
                    </span>
                    <span className="font-medium">{policies.reforestation}%</span>
                  </div>
                  <CustomSlider
                    value={policies.reforestation}
                    reportValueChange={updateForestryEfforts}
                    ariaLabel="Reforestation Efforts"
                    rangeColor="bg-[#42be4f]"
                    thumbColor={sliderThumbColor}
                  />
                </div>
                
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Car size={18} className="text-[#3e3fba]" />
                      <span>Electric Vehicle Transition</span>
                    </span>
                    <span className="font-medium">{policies.electricVehicles}%</span>
                  </div>
                  <CustomSlider
                    value={policies.electricVehicles}
                    reportValueChange={modifyEVAdoptionRate}
                    ariaLabel="Electric Vehicle Transition"
                    rangeColor="bg-[#3e3fba]"
                    thumbColor={sliderThumbColor}
                  />
                </div>
                
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Trash2 size={18} className="text-[#8e4e9d]" />
                      <span>Waste Reduction Initiatives</span>
                    </span>
                    <span className="font-medium">{policies.wasteReduction}%</span>
                  </div>
                  <CustomSlider
                    value={policies.wasteReduction}
                    reportValueChange={setWasteReductionTarget}
                    ariaLabel="Waste Reduction Initiatives"
                    rangeColor="bg-[#8e4e9d]"
                    thumbColor={sliderThumbColor}
                  />
                </div>
                
                
                <div className="mt-6 bg-[#e2f0fc] dark:bg-slate-700 p-4 rounded-2xl">
                  <h3 className="text-lg font-league-spartan font-medium mb-3 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    {narrativeInsights.includes("concern") || narrativeInsights.includes("insufficient") || narrativeInsights.includes("undermining") ? 
                      <AlertTriangle size={20} className="text-red-500 flex-shrink-0" /> : 
                      <CheckCircle2 size={20} className="text-[#42be4f] flex-shrink-0" />
                    }
                    Scenario Analysis
                  </h3>
                  <p className="text-sm leading-relaxed whitespace-pre-line text-gray-700 dark:text-gray-300">
                    {narrativeInsights}
                  </p>
                </div>
              </div>
            </div>
            
            
            <div className="lg:col-span-2 space-y-6">
              
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-5">
                <div className="flex mb-4 border-b dark:border-gray-700 justify-around md:justify-start">
                  <button 
                    onClick={() => setActiveChartTab("temperature")} 
                    className={`pb-2 px-3 md:px-4 font-league-spartan font-medium cursor-pointer ${ 
                      activeTab === "temperature" 
                        ? "border-b-2 border-[#3e3fba] text-[#3e3fba] dark:text-[#b4daf2] dark:border-[#b4daf2]" 
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ThermometerSun size={18} />
                      <span className="hidden md:inline">Temperature</span>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => setActiveChartTab("seaLevel")} 
                    className={`pb-2 px-3 md:px-4 font-league-spartan font-medium cursor-pointer ${ 
                      activeTab === "seaLevel" 
                        ? "border-b-2 border-[#3e3fba] text-[#3e3fba] dark:text-[#b4daf2] dark:border-[#b4daf2]" 
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Waves size={18} />
                      <span className="hidden md:inline">Sea Level</span>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => setActiveChartTab("iceCap")} 
                    className={`pb-2 px-3 md:px-4 font-league-spartan font-medium cursor-pointer ${ 
                      activeTab === "iceCap" 
                        ? "border-b-2 border-[#3e3fba] text-[#3e3fba] dark:text-[#b4daf2] dark:border-[#b4daf2]" 
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Snowflake size={18} />
                      <span className="hidden md:inline">Ice Caps</span>
                    </div>
                  </button>
                </div>
                
                
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    {activeTab === "temperature" ? (
                      <LineChart data={climateData} margin={{ top: 5, right: 20, bottom: 20, left: 30 }}>
                        <XAxis 
                          dataKey="year" 
                          tick={{ fill: chartTickAndLabelColor, fontSize: 12 }}
                          label={{ value: 'Year', position: 'insideBottom', offset: -5, style: { fill: chartTickAndLabelColor } }}
                          stroke={theme === 'dark' ? '#4b5563' : '#d1d5db'}
                        />
                        <YAxis
                          tickFormatter={(value) => parseFloat(value).toFixed(2)}
                          tick={{ fill: chartTickAndLabelColor, fontSize: 12 }}
                          label={{ 
                            value: 'Global Temperature (°C)', 
                            angle: -90, 
                            position: 'insideLeft',
                            offset: -20,
                            style: { textAnchor: 'middle', fill: chartTickAndLabelColor }
                          }}
                          stroke={theme === 'dark' ? '#4b5563' : '#d1d5db'}
                        />
                        <Tooltip
                          contentStyle={{ 
                            backgroundColor: theme === 'dark' ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                            borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                            borderRadius: '0.5rem',
                          }}
                          itemStyle={{ color: chartTickAndLabelColor }}
                          labelFormatter={(label) => <span style={{ color: chartTickAndLabelColor }}>{`Year: ${label}`}</span>}
                          formatter={(value) => [
                            <span style={{ color: chartTickAndLabelColor }}>{`${parseFloat(value as string).toFixed(2)}°C`}</span>,
                            <span style={{ color: chartTickAndLabelColor === '#cbd5e1' ? '#818cf8' : '#3e3fba' }}>Global Temperature</span>
                          ]}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="temperature" 
                          stroke="#3e3fba" 
                          strokeWidth={2}
                          activeDot={{ r: 6, fill: "#3e3fba", stroke: theme === 'dark' ? '#f3f5f4' : '#fff', strokeWidth: 2 }} 
                          dot={{ r:3, fill: "#3e3fba" }}
                        />
                      </LineChart>
                    ) : activeTab === "seaLevel" ? (
                      <AreaChart data={climateData} margin={{ top: 5, right: 20, bottom: 20, left: 30 }}>
                        <defs>
                          <linearGradient id="seaLevelColor" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#b4daf2" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#b4daf2" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="year" 
                          tick={{ fill: chartTickAndLabelColor, fontSize: 12 }}
                          label={{ value: 'Year', position: 'insideBottom', offset: -5, style: { fill: chartTickAndLabelColor } }}
                          stroke={theme === 'dark' ? '#4b5563' : '#d1d5db'}
                        />
                        <YAxis 
                          tickFormatter={(value) => parseFloat(value).toFixed(2)}
                          tick={{ fill: chartTickAndLabelColor, fontSize: 12 }}
                          label={{ 
                            value: 'Sea Level Rise (cm)', 
                            angle: -90, 
                            position: 'insideLeft',
                            offset: -20,
                            style: { textAnchor: 'middle', fill: chartTickAndLabelColor }
                          }} 
                          stroke={theme === 'dark' ? '#4b5563' : '#d1d5db'}
                        />
                        <Tooltip
                          contentStyle={{ 
                            backgroundColor: theme === 'dark' ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                            borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                            borderRadius: '0.5rem',
                          }}
                          itemStyle={{ color: chartTickAndLabelColor }}
                          labelFormatter={(label) => <span style={{ color: chartTickAndLabelColor }}>{`Year: ${label}`}</span>}
                          formatter={(value) => [
                            <span style={{ color: chartTickAndLabelColor }}>{`${parseFloat(value as string).toFixed(2)}cm`}</span>,
                            <span style={{ color: chartTickAndLabelColor === '#cbd5e1' ? '#c084fc' : '#8e4e9d' }}>Sea Level Rise</span>
                          ]}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="seaLevel" 
                          stroke="#8e4e9d" 
                          fill="url(#seaLevelColor)"
                          strokeWidth={2}
                          activeDot={{ r: 6, fill: "#8e4e9d", stroke: theme === 'dark' ? '#f3f5f4' : '#fff', strokeWidth: 2 }} 
                          dot={{ r:3, fill: "#8e4e9d" }}
                        />
                      </AreaChart>
                    ) : (
                      <AreaChart data={climateData} margin={{ top: 5, right: 20, bottom: 20, left: 30 }}>
                         <defs>
                          <linearGradient id="iceCapColor" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={theme === 'dark' ? "#b4daf2" : "#3e3fba"} stopOpacity={0.7}/>
                            <stop offset="95%" stopColor={theme === 'dark' ? "#b4daf2" : "#3e3fba"} stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="year" 
                          tick={{ fill: chartTickAndLabelColor, fontSize: 12 }}
                          label={{ value: 'Year', position: 'insideBottom', offset: -5, style: { fill: chartTickAndLabelColor } }}
                          stroke={theme === 'dark' ? '#4b5563' : '#d1d5db'}
                        />
                        <YAxis 
                          tickFormatter={(value) => parseFloat(value).toFixed(2)}
                          tick={{ fill: chartTickAndLabelColor, fontSize: 12 }}
                          label={{ 
                            value: 'Ice Cap Thickness (%)', 
                            angle: -90, 
                            position: 'insideLeft',
                            offset: -20,
                            style: { textAnchor: 'middle', fill: chartTickAndLabelColor }
                          }} 
                          stroke={theme === 'dark' ? '#4b5563' : '#d1d5db'}
                        />
                        <Tooltip
                          contentStyle={{ 
                            backgroundColor: theme === 'dark' ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                            borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                            borderRadius: '0.5rem',
                          }}
                          itemStyle={{ color: chartTickAndLabelColor }}
                          labelFormatter={(label) => <span style={{ color: chartTickAndLabelColor }}>{`Year: ${label}`}</span>}
                          formatter={(value) => [
                            <span style={{ color: chartTickAndLabelColor }}>{`${parseFloat(value as string).toFixed(2)}%`}</span>,
                            <span style={{ color: chartTickAndLabelColor === '#cbd5e1' ? '#93c5fd' : '#3e3fba' }}>Ice Cap Remaining</span>
                          ]}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="iceCap" 
                          stroke={theme === 'dark' ? "#b4daf2" : "#3e3fba"}
                          fill="url(#iceCapColor)"
                          strokeWidth={2}
                          activeDot={{ r: 6, fill: theme === 'dark' ? "#b4daf2" : "#3e3fba", stroke: theme === 'dark' ? '#f3f5f4' : '#fff', strokeWidth: 2 }} 
                          dot={{ r:3, fill: theme === 'dark' ? "#b4daf2" : "#3e3fba" }}
                        />
                      </AreaChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>
              
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-[#a5ceeb] dark:bg-gray-800 rounded-3xl p-5"
                >
                  <div className="flex justify-between mb-2">
                    <h3 className="text-lg font-league-spartan font-bold text-[#3e3fba] dark:text-[#b4daf2]">
                      Temperature Impact
                    </h3>
                    <ThermometerSun size={24} className="text-[#3e3fba] dark:text-[#b4daf2]" />
                  </div>
                  
                  {climateData.length > 0 && (
                    <>
                      <p className="text-3xl font-bold text-[#010053] dark:text-[#a5ceeb]">
                        {climateData[climateData.length - 1].temperature.toFixed(1)}°C
                      </p>
                      <p className="text-sm mt-2 text-[#010053] dark:text-[#a5ceeb]">
                        Projected global average temperature by 2100
                      </p>
                      <div className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                        <span className={`font-medium ${
                          getImpactSummary()?.tempChange && 
                          parseFloat(getImpactSummary()?.tempChange || "0") > 0 
                            ? "text-red-500" 
                            : "text-[#42be4f]"
                        }`}>
                          {getImpactSummary()?.tempChange}°C change
                        </span> from 2020 levels
                      </div>
                    </>
                  )}
                </motion.div>
                
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-[#a5ceeb] dark:bg-gray-800 rounded-3xl p-5"
                >
                  <div className="flex justify-between mb-2">
                    <h3 className="text-lg font-league-spartan font-bold text-[#8e4e9d] dark:text-[#b4daf2]">
                      Sea Level Impact
                    </h3>
                    <Waves size={24} className="text-[#8e4e9d] dark:text-[#b4daf2]" />
                  </div>
                  
                  {climateData.length > 0 && (
                    <>
                      <p className="text-3xl font-bold text-[#010053] dark:text-[#a5ceeb]">
                        +{climateData[climateData.length - 1].seaLevel.toFixed(1)}cm
                      </p>
                      <p className="text-sm mt-2 text-[#010053] dark:text-[#a5ceeb]">
                        Projected sea level rise by 2100
                      </p>
                      <div className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                        <span className={`font-medium ${
                          getImpactSummary()?.seaChange && 
                          parseFloat(getImpactSummary()?.seaChange || "0") > 0 
                            ? "text-red-500" 
                            : "text-[#42be4f]"
                        }`}>
                          {getImpactSummary()?.seaChange}cm change
                        </span> from 2020 levels
                      </div>
                    </>
                  )}
                </motion.div>
                
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-[#a5ceeb] dark:bg-gray-800 rounded-3xl p-5"
                >
                  <div className="flex justify-between mb-2">
                    <h3 className="text-lg font-league-spartan font-bold text-[#3e3fba] dark:text-[#b4daf2]">
                      Ice Cap Impact
                    </h3>
                    <Snowflake size={24} className="text-[#3e3fba] dark:text-[#b4daf2]" />
                  </div>
                  
                  {climateData.length > 0 && (
                    <>
                      <p className="text-3xl font-bold text-[#010053] dark:text-[#a5ceeb]">
                        {climateData[climateData.length - 1].iceCap.toFixed(1)}%
                      </p>
                      <p className="text-sm mt-2 text-[#010053] dark:text-[#a5ceeb]">
                        Projected ice cap thickness by 2100
                      </p>
                      <div className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                        <span className={`font-medium ${
                          getImpactSummary()?.iceChange && 
                          parseFloat(getImpactSummary()?.iceChange || "0") < 0 
                            ? "text-red-500" 
                            : "text-[#42be4f]"
                        }`}>
                          {getImpactSummary()?.iceChange}% change
                        </span> from 2020 levels
                      </div>
                    </>
                  )}
                </motion.div>
              </div>
              
              
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-5">
                <h2 className="text-xl font-league-spartan font-bold mb-4 text-[#3e3fba] dark:text-[#b4daf2]">
                  Understanding Climate Policy Impact
                </h2>
                
                <div className="space-y-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  <p>
                    This simulation demonstrates how policy decisions today can dramatically 
                    shape our climate future. The interactive controls allow you to explore 
                    how different environmental policies work together to mitigate climate change.
                  </p>
                  
                  <div className="flex items-start gap-3 p-3 bg-[#e2f0fc] dark:bg-slate-700 rounded-2xl">
                    <Info size={20} className="text-[#3e3fba] dark:text-[#b4daf2] mt-1 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-gray-900 dark:text-gray-100">Key Insight:</span> <span className="text-gray-700 dark:text-gray-300">According to climate 
                      scientists, limiting global warming to 1.5°C above pre-industrial levels 
                      will significantly reduce risks and impacts of climate change. This requires 
                      ambitious policy implementation across all sectors.</span>
                    </div>
                  </div>
                  
                  <p>
                    Adjust the policy sliders to see how different combinations of environmental 
                    initiatives can work together to create a sustainable climate future. The most 
                    effective approach combines multiple strategies rather than focusing on a single solution.
                  </p>
                  
                  <div className="mt-4">
                    <button 
                      onClick={openLearnMoreInfo}
                      className="flex items-center gap-2 text-[#3e3fba] dark:text-[#b4daf2] font-medium hover:underline cursor-pointer"
                    >
                      Learn more about climate policy impact
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        
        <footer className="bg-[#3e3fba]/10 dark:bg-slate-800/60 p-4 text-center text-sm mt-8">
          <p>Climate Future Simulator &copy; 2024 | Environmental Policy Think Tank</p>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Dedicated to promoting data-driven climate policy decisions
          </p>
        </footer>
      </div>
    </>
  );
}
