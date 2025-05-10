"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend } from "recharts";
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
    Moon,
    RotateCcw,
    Twitter,
    Linkedin,
    Facebook,
    Instagram,
    Download,
} from "lucide-react";

const GlobalStyles = () => (
    <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;500;600;700&family=Libre+Baskerville:wght@400;700&display=swap");
        body {
            font-family: "Libre Baskerville", serif;
        }
        .font-league-spartan {
            font-family: "League Spartan", sans-serif;
        }
    `}</style>
);

const CustomSlider = ({
    value,
    max = 100,
    step = 1,
    reportValueChange,
    rangeColor = "bg-[#3e3fba]",
    ariaLabel,
    isDarkMode,
}) => {
    const sliderRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const thumbColorClass = isDarkMode ? "bg-[#f3f5f4]" : "bg-[#2c2d84]";
    const trackColorClass = isDarkMode ? "bg-gray-700" : "bg-[#edf4f8]";

    const calculateValueFromPosition = useCallback(
        (clientX) => {
            if (!sliderRef.current) return value;

            const { left, width } = sliderRef.current.getBoundingClientRect();
            const percentage = Math.max(0, Math.min(1, (clientX - left) / width));
            let newValue = percentage * max;

            if (step) {
                newValue = Math.round(newValue / step) * step;
            }
            return Math.max(0, Math.min(max, newValue));
        },
        [max, step, value]
    );

    const initiateSliderDrag = (clientX) => {
        setIsDragging(true);
        const newValue = calculateValueFromPosition(clientX);
        reportValueChange([newValue]);
    };

    const updateSliderPosition = useCallback(
        (clientX) => {
            if (!isDragging || !sliderRef.current) return;
            const newValue = calculateValueFromPosition(clientX);
            reportValueChange([newValue]);
        },
        [isDragging, calculateValueFromPosition, reportValueChange]
    );

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
            <div className={`relative grow rounded-full h-[3px] ${trackColorClass} transition-colors duration-300 ease-in-out`}>
                <div className={`absolute rounded-full h-full ${rangeColor}`} style={{ width: `${percentageValue}%` }} />
            </div>
            <div
                className={`block w-5 h-5 ${thumbColorClass} rounded-full focus:outline-none absolute transition-colors duration-300 ease-in-out`}
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
    bauTemperature?: number; 
    bauSeaLevel?: number;    
    bauIceCap?: number;      
    regionalEffects?: RegionalClimateEffect[];
};

interface RegionalClimateEffect {
    regionName: string;
    temperature: number;
    seaLevel: number;
    bauTemperature: number;
    bauSeaLevel: number;
    
}

const regionDefinitions = [
    { name: "North America", tempFactor: 1.1, seaLevelOffsetCm: 5 },
    { name: "Europe", tempFactor: 1.0, seaLevelOffsetCm: 3 },
    { name: "Southeast Asia", tempFactor: 1.2, seaLevelOffsetCm: 10 },
    { name: "Small Island Nations", tempFactor: 1.0, seaLevelOffsetCm: 15 },
];

const generateNarrativeInsights = (policies, finalMetrics) => {
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
        insights += `However, ${concerns.join(", ")} may be undermining progress. `;
    }

    if (temperature > 16 && positivePolicyCount < 2 && concerns.length > 1) {
        insights +=
            "The current policy mix is insufficient to address the climate challenge effectively. Stronger, more comprehensive action is urgently needed across multiple sectors. ";
    }

    return insights.trim();
};

const ClimateApp = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [toastInfo, setToastInfo] = useState({ message: '', show: false });
    const [currentView, setCurrentView] = useState('global');
    const [focusedRegion, setFocusedRegion] = useState(regionDefinitions[0]?.name || "");

    useEffect(() => {
        setMounted(true);
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(systemPrefersDark);
        if (systemPrefersDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    useEffect(() => {
        if (!mounted) return;
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode, mounted]);

    const triggerToastDisplay = (message: string) => {
        setToastInfo({ message, show: true });
        setTimeout(() => {
            setToastInfo({ message: '', show: false });
        }, 3000);
    };

    const performThemeToggle = () => {
        setIsDarkMode(prev => !prev);
    };

    const [policies, updatePolicySettings] = useState<PolicySettings>({
        renewableEnergy: 30,
        carbonTax: 25,
        reforestation: 40,
        electricVehicles: 35,
        wasteReduction: 45,
    });
    const [climateData, setClimateProjections] = useState([]);
    const [activeTab, setActiveChartTab] = useState("temperature");
    const [narrativeInsights, setScenarioText] = useState("");
    const [activePresetKey, setActivePresetKey] = useState("");

    const years = useMemo(() => Array.from({ length: 9 }, (_, i) => 2020 + i * 10), []);
    const [startYearIndex, setStartYearIndex] = useState(0);
    const [endYearIndex, setEndYearIndex] = useState(years.length - 1);
    
    const selectedStartYear = years[startYearIndex];
    const selectedEndYear = years[endYearIndex];

    const handleStartYearChange = (newStartIndexArray) => {
        const newStartIndex = newStartIndexArray[0];
        setStartYearIndex(newStartIndex);
        if (newStartIndex > endYearIndex) {
            setEndYearIndex(newStartIndex);
        }
    };

    const handleEndYearChange = (newEndIndexArray) => {
        const newEndIndex = newEndIndexArray[0];
        setEndYearIndex(newEndIndex);
        if (newEndIndex < startYearIndex) {
            setStartYearIndex(newEndIndex);
        }
    };

    const policyPresets = {
        ambitious: {
            name: "Ambitious Action",
            settings: { renewableEnergy: 80, carbonTax: 70, reforestation: 75, electricVehicles: 85, wasteReduction: 70 }
        },
        balanced: {
            name: "Balanced Approach",
            settings: { renewableEnergy: 60, carbonTax: 50, reforestation: 55, electricVehicles: 60, wasteReduction: 50 }
        },
        current: {
            name: "Current Efforts",
            settings: { renewableEnergy: 35, carbonTax: 30, reforestation: 40, electricVehicles: 40, wasteReduction: 30 }
        }
    };

    const selectPolicyPreset = (presetKey: keyof typeof policyPresets | "") => {
        if (presetKey === "") {
            setActivePresetKey("");
            return;
        }
        updatePolicySettings(policyPresets[presetKey].settings);
        setActivePresetKey(presetKey);
    };

    const resetPolicySettings = () => {
        updatePolicySettings(policyPresets.current.settings);
        setActivePresetKey("");
        triggerToastDisplay("Policies reset to default values.");
    };

    const generateSimulationData = (settings: PolicySettings): ClimateMetrics[] => {
        const baseTemp = 14.5;
        const baseSeaLevel = 0;
        const baseIceCap = 100;

        const renewableImpact = (settings.renewableEnergy / 100) * 1.5;
        const carbonTaxImpact = (settings.carbonTax / 100) * 1.2;
        const reforestationImpact = (settings.reforestation / 100) * 0.8;
        const evImpact = (settings.electricVehicles / 100) * 0.7;
        const wasteImpact = (settings.wasteReduction / 100) * 0.6;

        const totalPositiveImpact = renewableImpact + carbonTaxImpact + reforestationImpact + evImpact + wasteImpact;

        return Array.from({ length: 9 }, (_, i) => {
            const year = 2020 + i * 10;
            const businessAsUsualTempGlobal = baseTemp + i * 0.4;
            const businessAsUsualSeaLevelGlobal = baseSeaLevel + i * 10;
            const businessAsUsualIceCapGlobal = Math.max(0, baseIceCap - i * 12);

            const globalTemperature = Math.max(baseTemp, businessAsUsualTempGlobal - totalPositiveImpact * (i * 0.05));
            const globalSeaLevel = Math.max(baseSeaLevel, businessAsUsualSeaLevelGlobal - totalPositiveImpact * (i * 1.2));
            const globalIceCap = Math.min(baseIceCap, Math.max(0, businessAsUsualIceCapGlobal + totalPositiveImpact * (i * 1.5)));
            
            const regionalEffectsData: RegionalClimateEffect[] = regionDefinitions.map(region => {
                const bauRegionalTemp = baseTemp + (businessAsUsualTempGlobal - baseTemp) * region.tempFactor;
                const bauRegionalSeaLevel = businessAsUsualSeaLevelGlobal + region.seaLevelOffsetCm; 
                
                const policyGlobalTempChange = globalTemperature - baseTemp;
                const regionalPolicyTemperature = baseTemp + policyGlobalTempChange * region.tempFactor;
                const regionalPolicySeaLevel = globalSeaLevel + region.seaLevelOffsetCm;

                return {
                    regionName: region.name,
                    temperature: regionalPolicyTemperature,
                    seaLevel: regionalPolicySeaLevel,
                    bauTemperature: bauRegionalTemp,
                    bauSeaLevel: bauRegionalSeaLevel,
                };
            });

            return { 
                year, 
                temperature: globalTemperature, 
                seaLevel: globalSeaLevel, 
                iceCap: globalIceCap, 
                bauTemperature: businessAsUsualTempGlobal,
                bauSeaLevel: businessAsUsualSeaLevelGlobal,
                bauIceCap: businessAsUsualIceCapGlobal,
                regionalEffects: regionalEffectsData,
            };
        });
    };
    
    useEffect(() => {
        const simulationResults = generateSimulationData(policies);
        setClimateProjections(simulationResults);
    }, [policies]);
    const setRenewableLevel = (value) => {
        updatePolicySettings({ ...policies, renewableEnergy: value[0] });
        setActivePresetKey("");
    };

    const alterCarbonPolicyValue = (value) => {
        updatePolicySettings({ ...policies, carbonTax: value[0] });
        setActivePresetKey("");
    };

    const updateForestryEfforts = (value) => {
        updatePolicySettings({ ...policies, reforestation: value[0] });
        setActivePresetKey("");
    };

    const modifyEVAdoptionRate = (value) => {
        updatePolicySettings({ ...policies, electricVehicles: value[0] });
        setActivePresetKey("");
    };

    const setWasteReductionTarget = (value) => {
        updatePolicySettings({ ...policies, wasteReduction: value[0] });
        setActivePresetKey("");
    };

    const currentYearMetrics = useMemo(() => {
        return climateData.find(d => d.year === selectedEndYear);
    }, [climateData, selectedEndYear]);

    const displayedClimateData = useMemo(() => {
        const startIndex = climateData.findIndex(d => d.year === selectedStartYear);
        const endIndex = climateData.findIndex(d => d.year === selectedEndYear);
        if (startIndex === -1 || endIndex === -1) return [];
        return climateData.slice(startIndex, endIndex + 1);
    }, [climateData, selectedStartYear, selectedEndYear]);

    const selectedRegionData = useMemo(() => {
        if (!climateData || climateData.length === 0) return [];
        return climateData.map(yearlyData => {
            const regionalMetric = yearlyData.regionalEffects?.find(effect => effect.regionName === focusedRegion);
            return {
                year: yearlyData.year,
                temperature: regionalMetric?.temperature,
                bauTemperature: regionalMetric?.bauTemperature,
                seaLevel: regionalMetric?.seaLevel,
                bauSeaLevel: regionalMetric?.bauSeaLevel,
            };
        }).filter(data => data.temperature !== undefined && data.seaLevel !== undefined);
    }, [climateData, focusedRegion]);

    const displayedSelectedRegionData = useMemo(() => {
        if (!selectedRegionData || selectedRegionData.length === 0) return [];
        const startIndex = selectedRegionData.findIndex(d => d.year === selectedStartYear);
        const endIndex = selectedRegionData.findIndex(d => d.year === selectedEndYear);
        
        if (startIndex === -1 || endIndex === -1) {
            if (climateData.length > 0 && selectedRegionData.length > 0) {
                const overallStartIndex = climateData.findIndex(d => d.year === selectedStartYear);
                const overallEndIndex = climateData.findIndex(d => d.year === selectedEndYear);
                if (overallStartIndex !== -1 && overallEndIndex !== -1) {
                    const regionStartIndex = selectedRegionData.findIndex(d => d.year === climateData[overallStartIndex].year);
                    const regionEndIndex = selectedRegionData.findIndex(d => d.year === climateData[overallEndIndex].year);
                    if (regionStartIndex !== -1 && regionEndIndex !== -1 && regionStartIndex <= regionEndIndex) {
                        return selectedRegionData.slice(regionStartIndex, regionEndIndex + 1);
                    }
                }
            }
            return [];
        }
        return selectedRegionData.slice(startIndex, endIndex + 1);
    }, [selectedRegionData, selectedStartYear, selectedEndYear, climateData]);
    
    const getImpactSummary = () => {
        if (!currentYearMetrics || climateData.length === 0) return null;
    
        const startYearData = climateData.find(d => d.year === selectedStartYear);
        if (!startYearData) return null; 
    
        const tempChange = currentYearMetrics.temperature - startYearData.temperature;
        const seaChange = currentYearMetrics.seaLevel - startYearData.seaLevel;
        const iceChange = currentYearMetrics.iceCap - startYearData.iceCap;
    
        return {
            tempChange: tempChange.toFixed(1),
            seaChange: seaChange.toFixed(1),
            iceChange: iceChange.toFixed(1),
        };
    };
    const impactSummary = getImpactSummary();

    useEffect(() => {
        if (currentYearMetrics) {
            setScenarioText(generateNarrativeInsights(policies, currentYearMetrics));
        }
    }, [policies, currentYearMetrics]);

    if (!mounted) {
        return null;
    }
    const convertToCSV = (data, isGlobal) => {
        if (!data || data.length === 0) return "";

        const headers = isGlobal 
            ? ["Year", "Temperature (°C)", "Baseline Temperature (°C)", "Sea Level (cm)", "Baseline Sea Level (cm)", "Ice Cap (%)", "Baseline Ice Cap (%)"] 
            : ["Year", "Temperature (°C)", "Baseline Temperature (°C)", "Sea Level (cm)", "Baseline Sea Level (cm)"];
        
        const rows = data.map(item => {
            const year = item.year;
            const temp = item.temperature?.toFixed(2) || "N/A";
            const bauTemp = item.bauTemperature?.toFixed(2) || "N/A";
            const sea = item.seaLevel?.toFixed(2) || "N/A";
            const bauSea = item.bauSeaLevel?.toFixed(2) || "N/A";
            if (isGlobal) {
                const ice = item.iceCap?.toFixed(2) || "N/A";
                const bauIce = item.bauIceCap?.toFixed(2) || "N/A";
                return [year, temp, bauTemp, sea, bauSea, ice, bauIce].join(",");
            }
            return [year, temp, bauTemp, sea, bauSea].join(",");
        });

        return [headers.join(","), ...rows].join("\n");
    };

    const triggerDownload = (csvString, filename) => {
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    };

    const exportGlobalDataToCSV = () => {
        const csvData = convertToCSV(climateData, true);
        if (csvData) {
            triggerDownload(csvData, "global_climate_data.csv");
            triggerToastDisplay("Global climate data exported as CSV.");
        } else {
            triggerToastDisplay("No global data available to export.");
        }
    };

    const exportRegionalDataToCSV = () => {
        const csvData = convertToCSV(selectedRegionData, false);
        if (csvData) {
            const filename = `regional_data_${focusedRegion.replace(/\s+/g, '_')}.csv`;
            triggerDownload(csvData, filename);
            triggerToastDisplay(`${focusedRegion} climate data exported as CSV.`);
        } else {
            triggerToastDisplay(`No data available for ${focusedRegion} to export.`);
        }
    };

    const openLearnMoreInfo = () => {
        triggerToastDisplay("Feature coming soon");
    };

    const handleFooterLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        triggerToastDisplay("Feature coming soon");
    };

    const chartTickAndLabelColor = isDarkMode ? "#cbd5e1" : "#374151";
    const sliderThumbColor = isDarkMode ? "bg-[#f3f5f4]" : "bg-[#2c2d84]";
    const mainBgColor = isDarkMode ? "bg-slate-900" : "bg-[#b1daf5]";
    const mainTextColor = isDarkMode ? "text-gray-100" : "text-gray-800";
    const cardBgColor = isDarkMode ? "bg-gray-800" : "bg-white";
    const headerTextColor = isDarkMode ? "text-gray-100" : "text-black";
    const policyControlTitleColor = isDarkMode ? "text-[#b4daf2]" : "text-[#8e4e9d]";
    const scenarioAnalysisBgColor = isDarkMode ? "bg-slate-700" : "bg-[#e2f0fc]";
    const scenarioAnalysisTextColor = isDarkMode ? "text-gray-300" : "text-gray-700";
    const scenarioAnalysisTitleColor = isDarkMode ? "text-gray-100" : "text-gray-900";
    const tabBorderColor = isDarkMode ? "border-[#b4daf2]" : "border-[#3e3fba]";
    const tabTextColor = isDarkMode ? "text-[#b4daf2]" : "text-[#3e3fba]";
    const tabInactiveTextColor = isDarkMode ? "text-gray-400" : "text-gray-500";
    const chartStrokeColor = isDarkMode ? "#4b5563" : "#d1d5db";
    const tooltipBgColor = isDarkMode ? "rgba(31, 41, 55, 0.8)" : "rgba(255, 255, 255, 0.8)";
    const tooltipBorderColor = isDarkMode ? "#4b5563" : "#d1d5db";
    const impactCardBgColor = isDarkMode ? "bg-gray-800" : "bg-[#a5ceeb]";
    const impactCardTitleColor = isDarkMode ? "text-[#b4daf2]" : "text-[#3e3fba]";
    const impactCardValueColor = isDarkMode ? "text-[#a5ceeb]" : "text-[#010053]";
    const impactCardSubTextColor = isDarkMode ? "text-gray-300" : "text-gray-700";
    const learnMoreLinkColor = isDarkMode ? "text-[#b4daf2]" : "text-[#3e3fba]";
    const footerBgColor = isDarkMode ? "bg-slate-800/60" : "bg-[#3e3fba]/10";
    const footerSubTextColor = isDarkMode ? "text-gray-400" : "text-gray-600";
    const buttonHoverBg = isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200";
    const buttonTextColor = isDarkMode ? "text-gray-300" : "text-gray-700";
    const iceCapAreaStopColor1 = isDarkMode ? "#b4daf2" : "#3e3fba";
    const iceCapAreaStrokeColor = isDarkMode ? "#b4daf2" : "#3e3fba";
    const activeDotStrokeColor = isDarkMode ? "#f3f5f4" : "#fff";

    return (
        <>
            <GlobalStyles />
            <div className={`min-h-screen ${mainBgColor} ${mainTextColor} transition-colors duration-300 ease-in-out`}>
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <motion.header 
                        className="py-4 md:py-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className={`text-2xl md:text-3xl font-bold font-montserrat ${headerTextColor} transition-colors duration-300 ease-in-out`}>
                                    Climate Future Simulator
                                </h1>
                                <p className={`text-sm md:text-base opacity-90 ${headerTextColor} transition-colors duration-300 ease-in-out`}>
                                    Interactive Policy & Environmental Impact Visualization
                                </p>
                            </div>
                            <button
                                onClick={performThemeToggle}
                                className={`p-2 rounded-full ${buttonHoverBg} ${buttonTextColor} cursor-pointer transition-all duration-300 ease-in-out`}
                                title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                            >
                                {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
                            </button>
                        </div>
                    </motion.header>

                    <main className="py-4 md:py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <motion.div 
                            className={`lg:col-span-1 ${cardBgColor} rounded-3xl p-5 transition-colors duration-300 ease-in-out`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <h2 className={`text-xl font-montserrat font-bold mb-4 ${policyControlTitleColor} transition-colors duration-300 ease-in-out`}>
                                Environmental Policy Controls
                            </h2>

                            <div className="mb-6 space-y-2">
                                <label htmlFor="policy-preset-select" className={`block text-sm font-medium ${mainTextColor} mb-1 transition-colors duration-300 ease-in-out`}>Quick Scenarios</label>
                                <div className="flex items-center gap-3">
                                    <select 
                                        id="policy-preset-select"
                                        value={activePresetKey}
                                        onChange={(e) => selectPolicyPreset(e.target.value as keyof typeof policyPresets | "")}
                                        className={`flex-grow p-2.5 border rounded-lg text-sm cursor-pointer transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 ${isDarkMode ? `bg-slate-700 border-slate-600 text-slate-100 focus:ring-slate-500 placeholder-slate-400` : `bg-white border-gray-300 text-gray-900 focus:ring-indigo-500 placeholder-gray-400`}`}
                                    >
                                        <option value="">Select a Preset...</option>
                                        {Object.entries(policyPresets).map(([key, preset]) => (
                                            <option key={key} value={key}>{preset.name}</option>
                                        ))}
                                    </select>
                                    <button 
                                        onClick={resetPolicySettings}
                                        title="Reset all policies to default values"
                                        className={`p-2.5 rounded-lg cursor-pointer transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50 ${isDarkMode ? `bg-slate-600 hover:bg-slate-500 text-slate-100 focus:ring-slate-400` : `bg-gray-200 hover:bg-gray-300 text-gray-700 focus:ring-gray-400`}`}
                                    >
                                        <RotateCcw size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="mb-3 space-y-1">
                                <label htmlFor="start-year-slider" className={`block text-xs font-medium ${mainTextColor} transition-colors duration-300 ease-in-out`}>
                                    Start Year: <span className="font-bold">{selectedStartYear}</span>
                                </label>
                                <CustomSlider
                                    value={startYearIndex}
                                    max={years.length - 1}
                                    step={1}
                                    reportValueChange={handleStartYearChange}
                                    ariaLabel="Start Year Selection Slider"
                                    rangeColor="bg-[#4caf50]"
                                    isDarkMode={isDarkMode}
                                />
                            </div>
                            <div className="mb-6 space-y-1">
                                <label htmlFor="end-year-slider" className={`block text-xs font-medium ${mainTextColor} transition-colors duration-300 ease-in-out`}>
                                    End Year: <span className="font-bold">{selectedEndYear}</span>
                                </label>
                                <CustomSlider
                                    value={endYearIndex}
                                    max={years.length - 1}
                                    step={1}
                                    reportValueChange={handleEndYearChange}
                                    ariaLabel="End Year Selection Slider"
                                    rangeColor="bg-[#2196f3]"
                                    isDarkMode={isDarkMode}
                                />
                            </div>

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
                                        isDarkMode={isDarkMode}
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
                                        isDarkMode={isDarkMode}
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
                                        isDarkMode={isDarkMode}
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
                                        isDarkMode={isDarkMode}
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
                                        isDarkMode={isDarkMode}
                                    />
                                </div>
                            </div>

                            <div className={`mt-6 ${scenarioAnalysisBgColor} p-4 rounded-2xl transition-colors duration-300 ease-in-out`}>
                                <h3 className={`text-lg font-montserrat font-medium mb-3 flex items-center gap-2 ${scenarioAnalysisTitleColor} transition-colors duration-300 ease-in-out`}>
                                    {narrativeInsights.includes("concern") ||
                                    narrativeInsights.includes("insufficient") ||
                                    narrativeInsights.includes("undermining") ? (
                                        <AlertTriangle size={20} className="text-red-500 flex-shrink-0" />
                                    ) : (
                                        <CheckCircle2 size={20} className="text-[#42be4f] flex-shrink-0" />
                                    )}
                                    Scenario Analysis
                                </h3>
                                <p className={`text-sm leading-relaxed whitespace-pre-line ${scenarioAnalysisTextColor} transition-colors duration-300 ease-in-out`}>
                                    {narrativeInsights}
                                </p>
                            </div>
                        </motion.div>

                        <motion.div 
                            className="lg:col-span-2 space-y-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <div className={`flex mb-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-300'} justify-start transition-colors duration-300 ease-in-out`}>
                                <button
                                    onClick={() => setCurrentView('global')}
                                    className={`pb-3 px-5 font-montserrat font-medium cursor-pointer transition-all duration-300 ease-in-out ${
                                        currentView === 'global'
                                            ? `border-b-2 ${tabBorderColor} ${tabTextColor}`
                                            : tabInactiveTextColor + ' hover:text-opacity-80'
                                    }`}
                                >
                                    Global Overview
                                </button>
                                <button
                                    onClick={() => setCurrentView('regional')}
                                    className={`pb-3 px-5 font-montserrat font-medium cursor-pointer transition-all duration-300 ease-in-out ${
                                        currentView === 'regional'
                                            ? `border-b-2 ${tabBorderColor} ${tabTextColor}`
                                            : tabInactiveTextColor + ' hover:text-opacity-80'
                                    }`}
                                >
                                    Regional Impacts
                                </button>
                            </div>

                            {currentView === 'global' && (
                                <>
                                    <div className={`${cardBgColor} rounded-3xl p-5 transition-colors duration-300 ease-in-out`}>
                                        <div className={`flex mb-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} justify-between items-center transition-colors duration-300 ease-in-out`}>
                                            <div className="flex justify-around md:justify-start">
                                                <button
                                                    onClick={() => setActiveChartTab("temperature")}
                                                    className={`pb-2 px-3 md:px-4 font-montserrat font-medium cursor-pointer transition-all duration-300 ease-in-out ${
                                                        activeTab === "temperature"
                                                            ? `border-b-2 ${tabBorderColor} ${tabTextColor}`
                                                            : tabInactiveTextColor
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <ThermometerSun size={18} />
                                                        <span className="hidden md:inline">Temperature</span>
                                                    </div>
                                                </button>
                                                <button
                                                    onClick={() => setActiveChartTab("seaLevel")}
                                                    className={`pb-2 px-3 md:px-4 font-montserrat font-medium cursor-pointer transition-all duration-300 ease-in-out ${
                                                        activeTab === "seaLevel"
                                                            ? `border-b-2 ${tabBorderColor} ${tabTextColor}`
                                                            : tabInactiveTextColor
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Waves size={18} />
                                                        <span className="hidden md:inline">Sea Level</span>
                                                    </div>
                                                </button>
                                                <button
                                                    onClick={() => setActiveChartTab("iceCap")}
                                                    className={`pb-2 px-3 md:px-4 font-montserrat font-medium cursor-pointer transition-all duration-300 ease-in-out ${
                                                        activeTab === "iceCap"
                                                            ? `border-b-2 ${tabBorderColor} ${tabTextColor}`
                                                            : tabInactiveTextColor
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Snowflake size={18} />
                                                        <span className="hidden md:inline">Ice Caps</span>
                                                    </div>
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={exportGlobalDataToCSV}
                                                    title="Export Global Data to CSV"
                                                    className={`p-2 rounded-lg cursor-pointer transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50 flex items-center gap-2 text-sm ${isDarkMode ? `bg-slate-700 hover:bg-slate-600 text-slate-200 focus:ring-slate-500` : `bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-gray-300`}`}
                                                >
                                                    <Download size={16} />
                                                    <span className="hidden sm:inline">Export Global Data</span>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="h-72">
                                            <ResponsiveContainer width="100%" height="100%">
                                                {activeTab === "temperature" ? (
                                                    <LineChart data={displayedClimateData} margin={{ top: 5, right: 20, bottom: 20, left: 30 }}>
                                                        <XAxis
                                                            dataKey="year"
                                                            tick={{ fill: chartTickAndLabelColor, fontSize: 12, fontFamily: 'Arial, sans-serif' }}
                                                            label={{
                                                                value: "Year",
                                                                position: "insideBottom",
                                                                offset: -5,
                                                                style: { fill: chartTickAndLabelColor, fontFamily: 'Arial, sans-serif' },
                                                            }}
                                                            stroke={chartStrokeColor}
                                                        />
                                                        <YAxis
                                                            tickFormatter={(value) => parseFloat(value as string).toFixed(2)}
                                                            tick={{ fill: chartTickAndLabelColor, fontSize: 12, fontFamily: 'Arial, sans-serif' }}
                                                            label={{
                                                                value: "Global Temperature (°C)",
                                                                angle: -90,
                                                                position: "insideLeft",
                                                                offset: -20,
                                                                style: { textAnchor: "middle", fill: chartTickAndLabelColor, fontFamily: 'Arial, sans-serif' },
                                                            }}
                                                            stroke={chartStrokeColor}
                                                        />
                                                        <Tooltip
                                                            contentStyle={{
                                                                backgroundColor: tooltipBgColor,
                                                                borderColor: tooltipBorderColor,
                                                                borderRadius: "0.5rem",
                                                            }}
                                                            itemStyle={{ color: chartTickAndLabelColor }}
                                                            labelFormatter={(label) => (
                                                                <span style={{ color: chartTickAndLabelColor }}>{`Year: ${label}`}</span>
                                                            )}
                                                            formatter={(value, name, props) => {
                                                                const formattedValue = parseFloat(value as string).toFixed(2);
                                                                let label = "";
                                                                if (props.dataKey === "temperature") label = "Projected Temp";
                                                                if (props.dataKey === "bauTemperature") label = "Baseline Scenario";
                                                                return [
                                                                    <span style={{ color: chartTickAndLabelColor }}>{`${formattedValue}°C`}</span>,
                                                                    <span style={{ color: props.stroke }}>{label}</span>
                                                                ];
                                                            }}
                                                        />
                                                        <Line
                                                            type="monotone"
                                                            dataKey="temperature"
                                                            name="Projected Temperature"
                                                            stroke="#3e3fba"
                                                            strokeWidth={2}
                                                            activeDot={{
                                                                r: 6,
                                                                fill: "#3e3fba",
                                                                stroke: activeDotStrokeColor,
                                                                strokeWidth: 2,
                                                            }}
                                                            dot={{ r: 3, fill: "#3e3fba" }}
                                                        />
                                                        <Line
                                                            type="monotone"
                                                            dataKey="bauTemperature"
                                                            name="Baseline Scenario"
                                                            stroke={isDarkMode ? "#6b7280" : "#9ca3af"}
                                                            strokeWidth={2}
                                                            strokeDasharray="5 5"
                                                            dot={false}
                                                            activeDot={false}
                                                        />
                                                        <Legend wrapperStyle={{ paddingTop: '10px' }} formatter={(value, entry) => <span style={{ color: chartTickAndLabelColor }}>{value}</span>} />
                                                    </LineChart>
                                                ) : activeTab === "seaLevel" ? (
                                                    <AreaChart data={displayedClimateData} margin={{ top: 5, right: 20, bottom: 20, left: 30 }}>
                                                        <defs>
                                                            <linearGradient id="seaLevelColor" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="#b4daf2" stopOpacity={0.8} />
                                                                <stop offset="95%" stopColor="#b4daf2" stopOpacity={0.1} />
                                                            </linearGradient>
                                                        </defs>
                                                        <XAxis
                                                            dataKey="year"
                                                            tick={{ fill: chartTickAndLabelColor, fontSize: 12, fontFamily: 'Arial, sans-serif' }}
                                                            label={{
                                                                value: "Year",
                                                                position: "insideBottom",
                                                                offset: -5,
                                                                style: { fill: chartTickAndLabelColor, fontFamily: 'Arial, sans-serif' },
                                                            }}
                                                            stroke={chartStrokeColor}
                                                        />
                                                        <YAxis
                                                            tickFormatter={(value) => parseFloat(value as string).toFixed(2)}
                                                            tick={{ fill: chartTickAndLabelColor, fontSize: 12, fontFamily: 'Arial, sans-serif' }}
                                                            label={{
                                                                value: "Sea Level Rise (cm)",
                                                                angle: -90,
                                                                position: "insideLeft",
                                                                offset: -20,
                                                                style: { textAnchor: "middle", fill: chartTickAndLabelColor, fontFamily: 'Arial, sans-serif' },
                                                            }}
                                                            stroke={chartStrokeColor}
                                                        />
                                                        <Tooltip
                                                            contentStyle={{
                                                                backgroundColor: tooltipBgColor,
                                                                borderColor: tooltipBorderColor,
                                                                borderRadius: "0.5rem",
                                                            }}
                                                            itemStyle={{ color: chartTickAndLabelColor }}
                                                            labelFormatter={(label) => (
                                                                <span style={{ color: chartTickAndLabelColor }}>{`Year: ${label}`}</span>
                                                            )}
                                                            formatter={(value, name, props) => {
                                                                const formattedValue = parseFloat(value as string).toFixed(2);
                                                                let label = "";
                                                                if (props.dataKey === "seaLevel") label = "Projected Sea Level";
                                                                if (props.dataKey === "bauSeaLevel") label = "Baseline Scenario";
                                                                return [
                                                                    <span style={{ color: chartTickAndLabelColor }}>{`${formattedValue}cm`}</span>,
                                                                    <span style={{ color: props.stroke }}>{label}</span>
                                                                ];
                                                            }}
                                                        />
                                                        <Area
                                                            type="monotone"
                                                            dataKey="seaLevel"
                                                            name="Projected Sea Level"
                                                            stroke="#8e4e9d"
                                                            fill="url(#seaLevelColor)"
                                                            strokeWidth={2}
                                                            activeDot={{
                                                                r: 6,
                                                                fill: "#8e4e9d",
                                                                stroke: activeDotStrokeColor,
                                                                strokeWidth: 2,
                                                            }}
                                                            dot={{ r: 3, fill: "#8e4e9d" }}
                                                        />
                                                        <Area
                                                            type="monotone"
                                                            dataKey="bauSeaLevel"
                                                            name="Baseline Scenario"
                                                            stroke={isDarkMode ? "#6b7280" : "#9ca3af"}
                                                            fill="transparent"
                                                            strokeWidth={2}
                                                            strokeDasharray="5 5"
                                                            dot={false}
                                                            activeDot={false}
                                                        />
                                                        <Legend wrapperStyle={{ paddingTop: '10px' }} formatter={(value, entry) => <span style={{ color: chartTickAndLabelColor }}>{value}</span>} />
                                                    </AreaChart>
                                                ) : (
                                                    <AreaChart data={displayedClimateData} margin={{ top: 5, right: 20, bottom: 20, left: 30 }}>
                                                        <defs>
                                                            <linearGradient id="iceCapColor" x1="0" y1="0" x2="0" y2="1">
                                                                <stop
                                                                    offset="5%"
                                                                    stopColor={iceCapAreaStopColor1}
                                                                    stopOpacity={0.7}
                                                                />
                                                                <stop
                                                                    offset="95%"
                                                                    stopColor={iceCapAreaStopColor1}
                                                                    stopOpacity={0.1}
                                                                />
                                                            </linearGradient>
                                                        </defs>
                                                        <XAxis
                                                            dataKey="year"
                                                            tick={{ fill: chartTickAndLabelColor, fontSize: 12, fontFamily: 'Arial, sans-serif' }}
                                                            label={{
                                                                value: "Year",
                                                                position: "insideBottom",
                                                                offset: -5,
                                                                style: { fill: chartTickAndLabelColor, fontFamily: 'Arial, sans-serif' },
                                                            }}
                                                            stroke={chartStrokeColor}
                                                        />
                                                        <YAxis
                                                            tickFormatter={(value) => parseFloat(value as string).toFixed(2)}
                                                            tick={{ fill: chartTickAndLabelColor, fontSize: 12, fontFamily: 'Arial, sans-serif' }}
                                                            label={{
                                                                value: "Ice Cap Thickness (%)",
                                                                angle: -90,
                                                                position: "insideLeft",
                                                                offset: -20,
                                                                style: { textAnchor: "middle", fill: chartTickAndLabelColor, fontFamily: 'Arial, sans-serif' },
                                                            }}
                                                            stroke={chartStrokeColor}
                                                        />
                                                        <Tooltip
                                                            contentStyle={{
                                                                backgroundColor: tooltipBgColor,
                                                                borderColor: tooltipBorderColor,
                                                                borderRadius: "0.5rem",
                                                            }}
                                                            itemStyle={{ color: chartTickAndLabelColor }}
                                                            labelFormatter={(label) => (
                                                                <span style={{ color: chartTickAndLabelColor }}>{`Year: ${label}`}</span>
                                                            )}
                                                            formatter={(value, name, props) => {
                                                                const formattedValue = parseFloat(value as string).toFixed(2);
                                                                let label = "";
                                                                if (props.dataKey === "iceCap") label = "Projected Ice Cap";
                                                                if (props.dataKey === "bauIceCap") label = "Baseline Scenario";
                                                                return [
                                                                    <span style={{ color: chartTickAndLabelColor }}>{`${formattedValue}%`}</span>,
                                                                    <span style={{ color: props.stroke }}>{label}</span>
                                                                ];
                                                            }}
                                                        />
                                                        <Area
                                                            type="monotone"
                                                            dataKey="iceCap"
                                                            name="Projected Ice Cap"
                                                            stroke={iceCapAreaStrokeColor}
                                                            fill="url(#iceCapColor)"
                                                            strokeWidth={2}
                                                            activeDot={{
                                                                r: 6,
                                                                fill: iceCapAreaStrokeColor,
                                                                stroke: activeDotStrokeColor,
                                                                strokeWidth: 2,
                                                            }}
                                                            dot={{ r: 3, fill: iceCapAreaStrokeColor }}
                                                        />
                                                        <Area
                                                            type="monotone"
                                                            dataKey="bauIceCap"
                                                            name="Baseline Scenario"
                                                            stroke={isDarkMode ? "#6b7280" : "#9ca3af"}
                                                            fill="transparent"
                                                            strokeWidth={2}
                                                            strokeDasharray="5 5"
                                                            dot={false}
                                                            activeDot={false}
                                                        />
                                                        <Legend wrapperStyle={{ paddingTop: '10px' }} formatter={(value, entry) => <span style={{ color: chartTickAndLabelColor }}>{value}</span>} />
                                                    </AreaChart>
                                                )}
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <motion.div whileHover={{ y: -5 }} className={`${impactCardBgColor} rounded-3xl p-5 transition-colors duration-300 ease-in-out`}>
                                            <div className="flex justify-between mb-2">
                                                <h3 className={`text-lg font-montserrat font-bold ${impactCardTitleColor} transition-colors duration-300 ease-in-out`}>
                                                    Temperature Impact
                                                </h3>
                                                <ThermometerSun size={24} className={`${impactCardTitleColor} transition-colors duration-300 ease-in-out`} />
                                            </div>

                                    {currentYearMetrics ? (
                                        <>
                                            <p className={`text-3xl font-bold ${impactCardValueColor} transition-colors duration-300 ease-in-out`}>
                                                {currentYearMetrics.temperature.toFixed(1)}°C
                                            </p>
                                            <p className={`text-sm mt-2 ${impactCardValueColor} transition-colors duration-300 ease-in-out`}>
                                                Projection for {selectedEndYear}
                                            </p>
                                            {impactSummary && (
                                                <div className={`mt-3 text-sm ${impactCardSubTextColor} transition-colors duration-300 ease-in-out`}>
                                                    <span
                                                        className={`font-medium ${
                                                            parseFloat(impactSummary.tempChange || "0") > 0
                                                                ? "text-red-500"
                                                                : "text-[#42be4f]"
                                                        }`}
                                                    >
                                                        {impactSummary.tempChange}°C change
                                                    </span>{" "}
                                                    from {selectedStartYear} levels
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <p className={`${mainTextColor} text-sm`}>Data not available for {selectedEndYear}</p>
                                    )}
                                </motion.div>

                                <motion.div whileHover={{ y: -5 }} className={`${impactCardBgColor} rounded-3xl p-5 transition-colors duration-300 ease-in-out`}>
                                    <div className="flex justify-between mb-2">
                                        <h3 className={`text-lg font-montserrat font-bold ${isDarkMode ? 'text-[#b4daf2]' : 'text-[#8e4e9d]' } transition-colors duration-300 ease-in-out`}>
                                            Sea Level Impact
                                        </h3>
                                        <Waves size={24} className={`${isDarkMode ? 'text-[#b4daf2]' : 'text-[#8e4e9d]' } transition-colors duration-300 ease-in-out`} />
                                    </div>
                                    {currentYearMetrics ? (
                                        <>
                                            <p className={`text-3xl font-bold ${impactCardValueColor} transition-colors duration-300 ease-in-out`}>
                                                +{currentYearMetrics.seaLevel.toFixed(1)}cm
                                            </p>
                                            <p className={`text-sm mt-2 ${impactCardValueColor} transition-colors duration-300 ease-in-out`}>
                                                Projection for {selectedEndYear}
                                            </p>
                                            {impactSummary && (
                                                <div className={`mt-3 text-sm ${impactCardSubTextColor} transition-colors duration-300 ease-in-out`}>
                                                    <span
                                                        className={`font-medium ${
                                                            parseFloat(impactSummary.seaChange || "0") > 0
                                                                ? "text-red-500"
                                                                : "text-[#42be4f]"
                                                        }`}
                                                    >
                                                        {impactSummary.seaChange}cm change
                                                    </span>{" "}
                                                    from {selectedStartYear} levels
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <p className={`${mainTextColor} text-sm`}>Data not available for {selectedEndYear}</p>
                                    )}
                                </motion.div>

                                <motion.div whileHover={{ y: -5 }} className={`${impactCardBgColor} rounded-3xl p-5 transition-colors duration-300 ease-in-out`}>
                                    <div className="flex justify-between mb-2">
                                        <h3 className={`text-lg font-montserrat font-bold ${impactCardTitleColor} transition-colors duration-300 ease-in-out`}>
                                            Ice Cap Impact
                                        </h3>
                                        <Snowflake size={24} className={`${impactCardTitleColor} transition-colors duration-300 ease-in-out`} />
                                    </div>
                                    {currentYearMetrics ? (
                                        <>
                                            <p className={`text-3xl font-bold ${impactCardValueColor} transition-colors duration-300 ease-in-out`}>
                                                {currentYearMetrics.iceCap.toFixed(1)}%
                                            </p>
                                            <p className={`text-sm mt-2 ${impactCardValueColor} transition-colors duration-300 ease-in-out`}>
                                                Projection for {selectedEndYear}
                                            </p>
                                            {impactSummary && (
                                                <div className={`mt-3 text-sm ${impactCardSubTextColor} transition-colors duration-300 ease-in-out`}>
                                                    <span
                                                        className={`font-medium ${
                                                            parseFloat(impactSummary.iceChange || "0") < 0
                                                                ? "text-red-500"
                                                                : "text-[#42be4f]"
                                                        }`}
                                                    >
                                                        {impactSummary.iceChange}% change
                                                    </span>{" "}
                                                    from {selectedStartYear} levels
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <p className={`${mainTextColor} text-sm`}>Data not available for {selectedEndYear}</p>
                                    )}
                                </motion.div>
                            </div>

                            <div className={`${cardBgColor} rounded-3xl p-5 transition-colors duration-300 ease-in-out`}>
                                <h2 className={`text-xl font-montserrat font-bold mb-4 ${learnMoreLinkColor} transition-colors duration-300 ease-in-out`}>
                                    Understanding Climate Policy Impact
                                </h2>

                                <div className={`space-y-4 text-sm leading-relaxed ${scenarioAnalysisTextColor} transition-colors duration-300 ease-in-out`}>
                                    <p>
                                        This simulation demonstrates how policy decisions today can dramatically shape our climate future.
                                        The interactive controls allow you to explore how different environmental policies work together to
                                        mitigate climate change.
                                    </p>

                                    <div className={`flex items-start gap-3 p-3 ${scenarioAnalysisBgColor} rounded-2xl transition-colors duration-300 ease-in-out`}>
                                        <Info size={20} className={`${learnMoreLinkColor} mt-1 flex-shrink-0 transition-colors duration-300 ease-in-out`} />
                                        <div>
                                            <span className={`font-medium ${scenarioAnalysisTitleColor} transition-colors duration-300 ease-in-out`}>Key Insight:</span>{" "}
                                            <span className={`${scenarioAnalysisTextColor} transition-colors duration-300 ease-in-out`}>
                                                According to climate scientists, limiting global warming to 1.5°C above pre-industrial
                                                levels will significantly reduce risks and impacts of climate change. This requires
                                                ambitious policy implementation across all sectors.
                                            </span>
                                        </div>
                                    </div>

                                    <p>
                                        Adjust the policy sliders to see how different combinations of environmental initiatives can work
                                        together to create a sustainable climate future. The most effective approach combines multiple
                                        strategies rather than focusing on a single solution.
                                    </p>

                                    <div className="mt-4">
                                        <button
                                            onClick={openLearnMoreInfo}
                                            className={`flex items-center gap-2 ${learnMoreLinkColor} font-medium hover:underline cursor-pointer transition-colors duration-300 ease-in-out`}
                                        >
                                            Learn more about climate policy impact
                                            <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {currentView === 'regional' && (
                        <div className={`${cardBgColor} rounded-3xl p-5 transition-colors duration-300 ease-in-out`}>
                            <h2 className={`text-xl font-montserrat font-bold mb-4 ${policyControlTitleColor} transition-colors duration-300 ease-in-out`}>
                                Regional Impact Analysis
                            </h2>
                            <div className="mb-4">
                                <label htmlFor="region-select" className={`block text-sm font-medium ${mainTextColor} mb-1 transition-colors duration-300 ease-in-out`}>
                                    Select Region:
                                </label>
                                <div className="flex items-center gap-3">
                                    <select 
                                        id="region-select"
                                        value={focusedRegion}
                                        onChange={(e) => setFocusedRegion(e.target.value)}
                                        className={`flex-grow p-2.5 border rounded-lg text-sm cursor-pointer transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 ${isDarkMode ? `bg-slate-700 border-slate-600 text-slate-100 focus:ring-slate-500 placeholder-slate-400` : `bg-white border-gray-300 text-gray-900 focus:ring-indigo-500 placeholder-gray-400`}`}
                                    >
                                        {regionDefinitions.map(region => (
                                            <option key={region.name} value={region.name}>
                                                {region.name}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={exportRegionalDataToCSV}
                                        title={`Export ${focusedRegion} Data to CSV`}
                                        className={`p-2.5 rounded-lg cursor-pointer transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50 flex items-center gap-2 text-sm ${isDarkMode ? `bg-slate-700 hover:bg-slate-600 text-slate-200 focus:ring-slate-500` : `bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-gray-300`}`}
                                    >
                                        <Download size={16} />
                                        <span className="hidden sm:inline">Export Region Data</span>
                                    </button>
                                </div>
                            </div>
                            <p className={`${mainTextColor} transition-colors duration-300 ease-in-out`}>
                               Displaying data for: <span className="font-semibold">{focusedRegion}</span>
                            </p>
                            {displayedSelectedRegionData.length > 0 ? (
                                <div className="space-y-6 mt-6">
                                    <div className="h-72">
                                        <h3 
                                            className={`text-md font-montserrat font-semibold mb-2 ${mainTextColor} text-center transition-colors duration-300 ease-in-out`}
                                        >
                                            Temperature Projections for {focusedRegion}
                                        </h3>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={displayedSelectedRegionData} margin={{ top: 5, right: 20, bottom: 20, left: 30 }}>
                                                <XAxis
                                                    dataKey="year"
                                                    tick={{ fill: chartTickAndLabelColor, fontSize: 12, fontFamily: 'Arial, sans-serif' }}
                                                    label={{
                                                        value: "Year",
                                                        position: "insideBottom",
                                                        offset: -5,
                                                        style: { fill: chartTickAndLabelColor, fontFamily: 'Arial, sans-serif' },
                                                    }}
                                                    stroke={chartStrokeColor}
                                                />
                                                <YAxis
                                                    tickFormatter={(value) => parseFloat(value as string).toFixed(2)}
                                                    tick={{ fill: chartTickAndLabelColor, fontSize: 12, fontFamily: 'Arial, sans-serif' }}
                                                    label={{
                                                        value: `Temp (°C)`,
                                                        angle: -90,
                                                        position: "insideLeft",
                                                        offset: -20,
                                                        style: { textAnchor: "middle", fill: chartTickAndLabelColor, fontFamily: 'Arial, sans-serif' },
                                                    }}
                                                    stroke={chartStrokeColor}
                                                    domain={['dataMin - 1', 'dataMax + 1']}
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: tooltipBgColor,
                                                        borderColor: tooltipBorderColor,
                                                        borderRadius: "0.5rem",
                                                    }}
                                                    itemStyle={{ color: chartTickAndLabelColor }}
                                                    labelFormatter={(label) => (
                                                        <span style={{ color: chartTickAndLabelColor }}>{`Year: ${label}`}</span>
                                                    )}
                                                    formatter={(value, name, props) => {
                                                        const formattedValue = parseFloat(value as string).toFixed(2);
                                                        let label = "";
                                                        if (props.dataKey === "temperature") label = "Projected Temp";
                                                        if (props.dataKey === "bauTemperature") label = "Baseline Scenario";
                                                        return [
                                                            <span style={{ color: chartTickAndLabelColor }}>{`${formattedValue}°C`}</span>,
                                                            <span style={{ color: props.stroke }}>{label}</span>
                                                        ];
                                                    }}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="temperature"
                                                    name="Projected Temperature"
                                                    stroke="#3e3fba"
                                                    strokeWidth={2}
                                                    activeDot={{
                                                        r: 6,
                                                        fill: "#3e3fba",
                                                        stroke: activeDotStrokeColor,
                                                        strokeWidth: 2,
                                                    }}
                                                    dot={{ r: 3, fill: "#3e3fba" }}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="bauTemperature"
                                                    name="Baseline Scenario"
                                                    stroke={isDarkMode ? "#6b7280" : "#9ca3af"}
                                                    strokeWidth={2}
                                                    strokeDasharray="5 5"
                                                    dot={false}
                                                    activeDot={false}
                                                />
                                                <Legend wrapperStyle={{ paddingTop: '10px' }} formatter={(value, entry) => <span style={{ color: chartTickAndLabelColor }}>{value}</span>} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="h-72">
                                        <h3 className={`text-md font-montserrat font-semibold mb-2 ${mainTextColor} text-center transition-colors duration-300 ease-in-out`}>
                                            Sea Level Rise Projections for {focusedRegion}
                                        </h3>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={displayedSelectedRegionData} margin={{ top: 5, right: 20, bottom: 20, left: 30 }}>
                                                <defs>
                                                    <linearGradient id="regionalSeaLevelColor" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor={isDarkMode ? "#5aa9e6" : "#74a6d3"} stopOpacity={0.8} />
                                                        <stop offset="95%" stopColor={isDarkMode ? "#5aa9e6" : "#74a6d3"} stopOpacity={0.1} />
                                                    </linearGradient>
                                                </defs>
                                                <XAxis
                                                    dataKey="year"
                                                    tick={{ fill: chartTickAndLabelColor, fontSize: 12, fontFamily: 'Arial, sans-serif' }}
                                                    label={{
                                                        value: "Year",
                                                        position: "insideBottom",
                                                        offset: -5,
                                                        style: { fill: chartTickAndLabelColor, fontFamily: 'Arial, sans-serif' },
                                                    }}
                                                    stroke={chartStrokeColor}
                                                />
                                                <YAxis
                                                    tickFormatter={(value) => parseFloat(value as string).toFixed(2)}
                                                    tick={{ fill: chartTickAndLabelColor, fontSize: 12, fontFamily: 'Arial, sans-serif' }}
                                                    label={{
                                                        value: `Sea Level (cm)`,
                                                        angle: -90,
                                                        position: "insideLeft",
                                                        offset: -20,
                                                        style: { textAnchor: "middle", fill: chartTickAndLabelColor, fontFamily: 'Arial, sans-serif' },
                                                    }}
                                                    stroke={chartStrokeColor}
                                                    domain={['dataMin - 5', 'dataMax + 5']}
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: tooltipBgColor,
                                                        borderColor: tooltipBorderColor,
                                                        borderRadius: "0.5rem",
                                                    }}
                                                    itemStyle={{ color: chartTickAndLabelColor }}
                                                    labelFormatter={(label) => (
                                                        <span style={{ color: chartTickAndLabelColor }}>{`Year: ${label}`}</span>
                                                    )}
                                                    formatter={(value, name, props) => {
                                                        const formattedValue = parseFloat(value as string).toFixed(2);
                                                        let label = "";
                                                        if (props.dataKey === "seaLevel") label = "Projected Sea Level";
                                                        if (props.dataKey === "bauSeaLevel") label = "Baseline Scenario";
                                                        return [
                                                            <span style={{ color: chartTickAndLabelColor }}>{`${formattedValue}cm`}</span>,
                                                            <span style={{ color: props.stroke }}>{label}</span>
                                                        ];
                                                    }}
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="seaLevel"
                                                    name="Projected Sea Level"
                                                    stroke={isDarkMode ? "#5aa9e6" : "#74a6d3"} 
                                                    fill="url(#regionalSeaLevelColor)"
                                                    strokeWidth={2}
                                                    activeDot={{
                                                        r: 6,
                                                        fill: isDarkMode ? "#5aa9e6" : "#74a6d3",
                                                        stroke: activeDotStrokeColor,
                                                        strokeWidth: 2,
                                                    }}
                                                    dot={{ r: 3, fill: isDarkMode ? "#5aa9e6" : "#74a6d3" }}
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="bauSeaLevel"
                                                    name="Baseline Scenario"
                                                    stroke={isDarkMode ? "#6b7280" : "#9ca3af"}
                                                    fill="transparent"
                                                    strokeWidth={2}
                                                    strokeDasharray="5 5"
                                                    dot={false}
                                                    activeDot={false}
                                                />
                                                <Legend wrapperStyle={{ paddingTop: '10px' }} formatter={(value, entry) => <span style={{ color: chartTickAndLabelColor }}>{value}</span>} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            ) : (
                                <p className={`${mainTextColor} mt-4 transition-colors duration-300 ease-in-out`}>
                                    No regional data available for {focusedRegion}.
                                </p>
                            )}
                        </div>
                    )}
                </motion.div> 
            </main>
        </div>

        <footer className={`${footerBgColor} mt-8 border-t ${isDarkMode ? 'border-slate-700' : 'border-gray-300'} transition-colors duration-300 ease-in-out`}>
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className={`pb-8 border-b ${isDarkMode ? 'border-slate-700/50' : 'border-gray-300/70'} transition-colors duration-300 ease-in-out`}>
                    <h3 className={`${mainTextColor} text-md font-semibold mb-4 text-center md:text-left transition-colors duration-300 ease-in-out`}>
                        Explore Further
                    </h3>
                    <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-3">
                        <a href="https://www.epa.gov/climate-change" target="_blank" rel="noopener noreferrer" className={`${learnMoreLinkColor} text-sm hover:underline transition-colors duration-300 ease-in-out`}>Understanding Climate Science</a>
                        <a href="https://www.ipcc.ch/reports/" target="_blank" rel="noopener noreferrer" className={`${learnMoreLinkColor} text-sm hover:underline transition-colors duration-300 ease-in-out`}>IPCC Reports</a>
                        <a href="https://climate.nasa.gov/" target="_blank" rel="noopener noreferrer" className={`${learnMoreLinkColor} text-sm hover:underline transition-colors duration-300 ease-in-out`}>NASA Climate Portal</a>
                        <a href="https://www.un.org/en/climatechange" target="_blank" rel="noopener noreferrer" className={`${learnMoreLinkColor} text-sm hover:underline transition-colors duration-300 ease-in-out`}>UN Climate Action</a>
                        <a href="https://drawdown.org/" target="_blank" rel="noopener noreferrer" className={`${learnMoreLinkColor} text-sm hover:underline transition-colors duration-300 ease-in-out`}>Project Drawdown</a>
                        <a href="https://www.climatecentral.org/" target="_blank" rel="noopener noreferrer" className={`${learnMoreLinkColor} text-sm hover:underline transition-colors duration-300 ease-in-out`}>Climate Central</a>
                    </div>
                </div>

                <div className={`pt-8 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8`}>
                    <div className="text-center md:text-left">
                        <p className={`${mainTextColor} text-sm transition-colors duration-300 ease-in-out`}>
                            &copy; {new Date().getFullYear()} Climate Future Simulator.
                        </p>
                        <p className={`${footerSubTextColor} text-xs mt-1 transition-colors duration-300 ease-in-out`}>
                            All rights reserved.
                        </p>
                    </div>
                    <div className="flex flex-col  items-center md:items-end gap-3">
                        <div className="flex items-center space-x-4 mt-2 md:mt-0">
                            <a href="#" target="_blank" rel="noopener noreferrer" title="Twitter" className={`text-[#313294] hover:opacity-75 transition-opacity duration-300 ease-in-out`} onClick={handleFooterLinkClick}>
                                <Twitter size={20} />
                            </a> 
                            <a href="#" target="_blank" rel="noopener noreferrer" title="LinkedIn" className={`text-[#313294] hover:opacity-75 transition-opacity duration-300 ease-in-out`} onClick={handleFooterLinkClick}>
                                <Linkedin size={20} />
                            </a>
                            <a href="#" target="_blank" rel="noopener noreferrer" title="Facebook" className={`text-[#313294] hover:opacity-75 transition-opacity duration-300 ease-in-out`} onClick={handleFooterLinkClick}>
                                <Facebook size={20} />
                            </a>
                            <a href="#" target="_blank" rel="noopener noreferrer" title="Instagram" className={`text-[#313294] hover:opacity-75 transition-opacity duration-300 ease-in-out`} onClick={handleFooterLinkClick}>
                                <Instagram size={20} />
                            </a>
                        </div>
                        <div className="text-center md:text-right">
                            <p className={`${mainTextColor} text-sm font-medium transition-colors duration-300 ease-in-out`}>
                                Environmental Policy Think Tank
                            </p>
                            <p className={`${footerSubTextColor} text-xs mt-1 transition-colors duration-300 ease-in-out`}>
                                Dedicated to promoting data-driven climate policy decisions.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    </div>
    {toastInfo.show && (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
            className={`fixed bottom-10 left-1/2 -translate-x-1/2 p-4 rounded-md shadow-lg ${cardBgColor} ${mainTextColor} z-50 transition-colors duration-300 ease-in-out`}
        >
            {toastInfo.message}
        </motion.div>
    )}
</>
);
};

export default ClimateApp;