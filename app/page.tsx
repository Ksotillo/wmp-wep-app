"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

import {
  UploadCloud, BarChart2, Calendar, TrendingUp, Database, Menu, X, Tractor, Bell,
  LayoutDashboard, ClipboardList, BarChartBig, FileText, Settings2, HelpCircle, User, LogOut,
  Layers, Droplet, Bug, Wrench, PlusCircle
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';


interface NavItem {
  name: string;
  icon: React.ElementType;
  href?: string;
}

interface MockNotification {
  id: number;
  text: string;
  time: string;
  icon: React.ElementType;
  iconColor: string;
}

interface CropEntry {
  id: string;
  cropName: string;
  plantingDate: string;
  soilPh: string;
  waterUsage: string;
  submissionDate: string;
}

interface ChartPointData {
  plantingDate: string;
  value: number;
  cropName?: string;
}

interface ResourceUsageData {
  name: string;
  totalWater: number;
}

interface SeasonalComparisonData {
  year: string;
  totalWater: number;
}

const initialMockCropEntries: CropEntry[] = [
  
  { id: "2022-1", cropName: "Golden Corn", plantingDate: "2022-03-15", soilPh: "6.7", waterUsage: "5400", submissionDate: "2022-03-10" },
  { id: "2022-2", cropName: "Golden Corn", plantingDate: "2022-06-10", soilPh: "6.8", waterUsage: "5600", submissionDate: "2022-06-05" },
  { id: "2022-3", cropName: "Red Wheat", plantingDate: "2022-04-20", soilPh: "6.5", waterUsage: "4700", submissionDate: "2022-04-15" },
  { id: "2022-4", cropName: "Red Wheat", plantingDate: "2022-09-18", soilPh: "6.4", waterUsage: "4800", submissionDate: "2022-09-12" },
  { id: "2022-5", cropName: "Soybeans", plantingDate: "2022-05-25", soilPh: "6.2", waterUsage: "5900", submissionDate: "2022-05-20" },
  { id: "2022-6", cropName: "Soybeans", plantingDate: "2022-08-30", soilPh: "6.3", waterUsage: "6000", submissionDate: "2022-08-25" },

  
  { id: "2023-1", cropName: "Golden Corn", plantingDate: "2023-04-15", soilPh: "6.8", waterUsage: "5500", submissionDate: "2023-04-10" },
  { id: "2023-2", cropName: "Golden Corn", plantingDate: "2023-05-20", soilPh: "6.7", waterUsage: "5650", submissionDate: "2023-05-18" },
  { id: "2023-3", cropName: "Red Wheat", plantingDate: "2023-09-20", soilPh: "6.5", waterUsage: "4800", submissionDate: "2023-09-15" },
  { id: "2023-4", cropName: "Red Wheat", plantingDate: "2023-10-05", soilPh: "6.6", waterUsage: "4700", submissionDate: "2023-10-02" },
  { id: "2023-5", cropName: "Soybeans", plantingDate: "2023-06-01", soilPh: "6.1", waterUsage: "5900", submissionDate: "2023-05-28" },
  { id: "2023-6", cropName: "Soybeans", plantingDate: "2023-08-15", soilPh: "6.3", waterUsage: "6050", submissionDate: "2023-08-10" },

  
  { id: "2024-1", cropName: "Golden Corn", plantingDate: "2024-04-20", soilPh: "6.9", waterUsage: "5800", submissionDate: "2024-04-18" },
  { id: "2024-2", cropName: "Golden Corn", plantingDate: "2024-05-25", soilPh: "7.0", waterUsage: "5950", submissionDate: "2024-05-22" },
  { id: "2024-3", cropName: "Red Wheat", plantingDate: "2024-07-01", soilPh: "6.4", waterUsage: "5200", submissionDate: "2024-06-28" },
  { id: "2024-4", cropName: "Red Wheat", plantingDate: "2024-08-15", soilPh: "6.3", waterUsage: "5100", submissionDate: "2024-08-10" },
  { id: "2024-5", cropName: "Soybeans", plantingDate: "2024-05-10", soilPh: "6.2", waterUsage: "6000", submissionDate: "2024-05-05" },
  { id: "2024-6", cropName: "Soybeans", plantingDate: "2024-06-20", soilPh: "6.4", waterUsage: "6200", submissionDate: "2024-06-18" },
  { id: "2024-7", cropName: "Golden Corn", plantingDate: "2024-07-10", soilPh: "6.8", waterUsage: "5700", submissionDate: "2024-07-08" },
  { id: "2024-8", cropName: "Red Wheat", plantingDate: "2024-09-05", soilPh: "6.5", waterUsage: "5000", submissionDate: "2024-09-01" },
  { id: "2024-9", cropName: "Soybeans", plantingDate: "2024-07-20", soilPh: "6.2", waterUsage: "6050", submissionDate: "2024-07-15" }
];

const mockNotifications: MockNotification[] = [
  { id: 1, text: "New soil data available for Field A.", time: "5 mins ago", icon: Layers, iconColor: "#12bf8e" },
  { id: 2, text: "Low water levels detected in Sector 3.", time: "2 hours ago", icon: Droplet, iconColor: "#fe7600" },
  { id: 3, text: "Pest alert: Aphids detected on Corn crops.", time: "1 day ago", icon: Bug, iconColor: "#f67b04" },
  { id: 4, text: "Tractor #2 maintenance due tomorrow.", time: "1 day ago", icon: Wrench, iconColor: "#8f9190" },
];

const CropAnalysisTool = () => {
  const [isSystemDark, updateSystemDarkPreference] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('Dashboard');
  const [cropEntries, setCropEntries] = useState([]);
  const [isMobileMenuOpen, setMobileMenuVisibility] = useState(false);
  const [isNotificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [isLogCropModalOpen, setIsLogCropModalOpen] = useState(false);
  const [comparisonYear, setComparisonYear] = useState('');
  const notificationDropdownRef = useRef(null);

  useEffect(() => {
    let loadedEntries = initialMockCropEntries;
    const storedCropData = localStorage.getItem('farmVueCropData');
    if (storedCropData) {
      loadedEntries = JSON.parse(storedCropData);
    } else {
      localStorage.setItem('farmVueCropData', JSON.stringify(initialMockCropEntries));
    }
    setCropEntries(loadedEntries);

    const years = [...new Set(loadedEntries.map(e => new Date(e.plantingDate).getFullYear()))].sort((a, b) => b - a);
    if (years.length > 1) {
      setComparisonYear(years[1].toString());
    } else if (years.length === 1) {
      setComparisonYear(years[0].toString());
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    updateSystemDarkPreference(mediaQuery.matches);
    const listener = (e) => updateSystemDarkPreference(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    if (isSystemDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isSystemDark]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target)) {
        setNotificationDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationDropdownRef]);

  const handleAddCropEntry = (newEntry) => {
    const updatedEntries = [...cropEntries, newEntry];
    setCropEntries(updatedEntries);
    localStorage.setItem('farmVueCropData', JSON.stringify(updatedEntries));
  };

  const closeLogModal = () => {
    setIsLogCropModalOpen(false);
  };

  const directToSection = (sectionName) => {
    alert(`Redirecting to ${sectionName}`);
  };

  const inputBaseClasses = "w-full p-3 border rounded-md focus:ring-2 transition-colors duration-150 text-sm sm:text-base";
  const lightInputClasses = "bg-[#FFFFFF] border-gray-300 text-[#041313] placeholder-gray-500 focus:ring-[#1fdca3] focus:border-[#1fdca3]";
  const darkInputClasses = "dark:bg-[#0A1414] dark:border-gray-600 dark:text-[#ebecf0] dark:placeholder-gray-400 dark:focus:ring-[#1fdca3] dark:focus:border-[#1fdca3]";
  
  const cardBaseClasses = "p-4 sm:p-6 rounded-xl transition-colors duration-300";
  const lightCardClasses = "bg-[#FFFFFF] text-[#041313]";
  const darkCardClasses = "dark:bg-[#0F1F1F] dark:text-[#ebecf0]";

  const sectionTitleClasses = ` text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 flex items-center`;
  const lightSectionTitleClasses = "text-[#041313]";
  const darkSectionTitleClasses = "dark:text-[#ebecf0]";
  
  const buttonPrimaryClasses = "px-5 py-2.5 sm:px-6 sm:py-3 font-semibold rounded-lg hover:bg-opacity-90 cursor-pointer transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base";
  const buttonPrimaryColorClasses = "bg-[#1fdca3] text-[#041313]";


  const sidebarNavItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '#' },
    { name: 'Production', icon: ClipboardList, href: '#' },
    { name: 'Analytics', icon: BarChartBig, href: '#' },
    { name: 'Reports', icon: FileText, href: '#' },
    { name: 'Settings', icon: Settings2, href: '#' },
    { name: 'Support', icon: HelpCircle, href: '#' },
    { name: 'Profile', icon: User, href: '#' },
  ];

  const SidebarNavigation = () => (
    <div className="h-full flex flex-col bg-[#041313]">
      <div className={` text-2xl font-bold p-6 flex items-center justify-center sm:justify-start shrink-0`}>
        <Tractor size={28} className="mr-2" style={{color: '#12bf8e'}} /> 
        <span style={{color: '#12bf8e'}}>Farm</span><span style={{color: '#fe7600'}}>Vue</span>
      </div>
      <nav className="flex-grow py-4 space-y-1.5 overflow-y-auto">
        {sidebarNavItems.map(item => {
          const isSelected = activeNavItem === item.name;
          return (
            <a 
              key={item.name} 
              href={item.href || '#'} 
              onClick={(e) => {
                e.preventDefault();
                setActiveNavItem(item.name);
                directToSection(item.name);
              }}
              className={`
                flex items-center space-x-4 px-6 py-3 rounded-r-md cursor-pointer group 
                transition-all duration-200 ease-in-out
                border-l-4
                ${isSelected
                  ? 'opacity-100 border-[#56f7b9] text-[#56f7b9]'
                  : 'opacity-70 border-transparent text-gray-300 hover:opacity-100 hover:border-[#56f7b9] hover:text-gray-100'
                }
              `}
            >
              <item.icon 
                size={22} 
                className={`
                  transition-colors duration-200 ease-in-out
                  ${isSelected ? 'text-[#56f7b9]' : 'text-[#8f9190] group-hover:text-[#56f7b9]'}
                `}
              /> 
              <span className="text-base font-medium">{item.name}</span>
            </a>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <button className="w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-md text-gray-300 hover:text-[#f37d06] cursor-pointer transition-colors group">
          <LogOut size={20} className="text-[#8f9190] group-hover:text-[#f37d06] transition-colors"/>
          <span className="text-base font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
  

  const availableYears = useMemo(() => 
    [...new Set(cropEntries.map(e => new Date(e.plantingDate).getFullYear()))].sort((a, b) => b - a)
  , [cropEntries]);

  const latestYear = useMemo(() => availableYears[0]?.toString() || '', [availableYears]);

  const baseChartDataProcessor = (dataKey: keyof CropEntry): ChartPointData[] => 
    useMemo(() => 
      cropEntries
        .map(entry => ({ ...entry, plantingDateObj: new Date(entry.plantingDate) }))
        .sort((a, b) => a.plantingDateObj.getTime() - b.plantingDateObj.getTime())
        .map(entry => ({
          plantingDate: new Date(entry.plantingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          value: parseFloat(entry[dataKey] as string) || 0,
          cropName: entry.cropName
        } as ChartPointData))
    , [cropEntries, dataKey]);

  const preparedWaterUsageChartData = baseChartDataProcessor('waterUsage');
  const preparedSoilPhChartData = baseChartDataProcessor('soilPh');

  const preparedResourceUsageData = cropEntries.reduce((acc, entry) => {
    const water = parseFloat(entry.waterUsage) || 0;
    const existing = acc.find(item => item.name === entry.cropName);
    if (existing) {
      existing.totalWater += water;
    } else {
      acc.push({ name: entry.cropName, totalWater: water });
    }
    return acc;
  }, [] as ResourceUsageData[]);

  const preparedSeasonalComparisonData = useMemo(() => {
    if (!latestYear || !comparisonYear) return [];
    
    const calculateTotalWater = (year: string) => 
        cropEntries
            .filter(e => new Date(e.plantingDate).getFullYear().toString() === year)
            .reduce((sum, e) => sum + (parseFloat(e.waterUsage) || 0), 0);

    const comparisonData = [
        { year: comparisonYear, totalWater: calculateTotalWater(comparisonYear) }
    ];
    
    if (latestYear !== comparisonYear) {
        comparisonData.push({ year: latestYear, totalWater: calculateTotalWater(latestYear) });
        comparisonData.sort((a, b) => parseInt(a.year) - parseInt(b.year));
    }

    return comparisonData;

  }, [cropEntries, comparisonYear, latestYear]);

  const GenericLineChart: React.FC<{ data: ChartPointData[], isDark: boolean, dataKey: string, lineName: string, lineColor: string }> = React.memo(({ data, isDark, dataKey, lineName, lineColor }) => {
    if (!data || data.length === 0) {
      return <div className="h-64 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">No data to display.</div>;
    }
    const tickColor = isDark ? '#ebecf0' : '#041313';
    const gridColor = isDark ? 'rgba(235, 236, 240, 0.1)' : 'rgba(4, 19, 19, 0.1)';

    return (
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="plantingDate" tick={{ fill: tickColor, fontSize: 10 }} angle={-30} textAnchor="end" height={50} />
          <YAxis tick={{ fill: tickColor, fontSize: 10 }} />
          <Tooltip 
              contentStyle={{ 
                  backgroundColor: isDark ? '#0F1F1F' : '#FFFFFF', 
                  borderColor: isDark ? '#12bf8e' : '#041313',
                  borderRadius: '0.5rem',
                  fontSize: '12px'
              }}
              labelStyle={{ color: tickColor, fontWeight: 'bold' }}
              itemStyle={{ color: lineColor }}
          />
          <Legend wrapperStyle={{ color: tickColor, fontSize: 10, paddingTop: '10px'}} />
          <Line type="monotone" dataKey="value" name={lineName} stroke={lineColor} strokeWidth={2} activeDot={{ r: 5 }} dot={{ r: 2}} />
        </LineChart>
      </ResponsiveContainer>
    );
  });

  const ResourceUsageChart: React.FC<{ data: ResourceUsageData[], isDark: boolean }> = React.memo(({ data, isDark }) => {
    if (!data || data.length === 0) {
      return <div className="h-64 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">No data to display.</div>;
    }
    const tickColor = isDark ? '#ebecf0' : '#041313';
    const gridColor = isDark ? 'rgba(235, 236, 240, 0.1)' : 'rgba(4, 19, 19, 0.1)';

  return (
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="name" tick={{ fill: tickColor, fontSize: 10 }} angle={-30} textAnchor="end" height={50} interval={0} />
          <YAxis tick={{ fill: tickColor, fontSize: 10 }} />
          <Tooltip 
              cursor={{ fill: isDark ? 'rgba(254, 118, 0, 0.1)' : 'rgba(254, 118, 0, 0.2)' }}
              contentStyle={{ 
                  backgroundColor: isDark ? '#0F1F1F' : '#FFFFFF', 
                  borderColor: isDark ? '#fe7600' : '#041313',
                  borderRadius: '0.5rem',
                  fontSize: '12px'
              }}
              labelStyle={{ color: tickColor, fontWeight: 'bold' }}
              itemStyle={{ color: '#f67b04' }}
          />
          <Legend wrapperStyle={{ color: tickColor, fontSize: 10, paddingTop: '10px'}} />
          <Bar dataKey="totalWater" name="Total Water Usage (L)" fill="#f67b04" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  });
  const SeasonalComparisonChart = React.memo(({ data, isDark }) => {
    if (!data || data.length === 0) return <div className="h-48 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">Select a year to compare.</div>;
    const tickColor = isDark ? '#ebecf0' : '#041313';
    const gridColor = isDark ? 'rgba(235, 236, 240, 0.1)' : 'rgba(4, 19, 19, 0.1)';
    return (
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="year" tick={{ fill: tickColor, fontSize: 10 }} />
          <YAxis tick={{ fill: tickColor, fontSize: 10 }} />
          <Tooltip cursor={{ fill: isDark ? 'rgba(254, 118, 0, 0.1)' : 'rgba(254, 118, 0, 0.2)' }} contentStyle={{ backgroundColor: isDark ? '#0F1F1F' : '#FFFFFF', borderColor: isDark ? '#fe7600' : '#041313', borderRadius: '0.5rem', fontSize: '12px' }} labelStyle={{ color: tickColor, fontWeight: 'bold' }} itemStyle={{ color: '#fe7600' }} />
          <Bar dataKey="totalWater" name="Total Water (L)" fill="#fe7600" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  });

  
  const predictedNextWaterUsage = useMemo(() => {
    const data = preparedWaterUsageChartData;
    if (data.length < 2) return null; 

    const lastPoint = data[data.length - 1];
    const secondLastPoint = data[data.length - 2];
    let avgChange = lastPoint.value - secondLastPoint.value;

    
    if (data.length >= 3) {
        const thirdLastPoint = data[data.length - 3];
        const change1 = lastPoint.value - secondLastPoint.value;
        const change2 = secondLastPoint.value - thirdLastPoint.value;
        avgChange = (change1 + change2) / 2;
    }

    const predicted = lastPoint.value + avgChange;
    
    const variation = (Math.random() * 0.2) - 0.1; 
    const finalPrediction = predicted * (1 + variation);
    
    return Math.max(0, Math.round(finalPrediction)); 

  }, [preparedWaterUsageChartData]);

  const lastActualWaterUsage = useMemo(() => {
    if (preparedWaterUsageChartData.length === 0) return null;
    return preparedWaterUsageChartData[preparedWaterUsageChartData.length -1].value;
  }, [preparedWaterUsageChartData]);

  const ForecastVisualization = React.memo(({ lastActual, predictedNext, isDark }) => {
    if (lastActual === null || predictedNext === null) {
      return <p className="text-gray-500 dark:text-gray-400">Not enough data for a forecast visualization (requires at least 2 entries).</p>;
    }

    const data = [
      { name: 'Last Actual', value: lastActual, color: isDark ? '#3b82f6' : '#2563eb' }, 
      { name: 'Predicted Next', value: predictedNext, color: isDark ? '#22c55e' : '#16a34a' } 
    ];

    const tickColor = isDark ? '#ebecf0' : '#041313';

    return (
      <ResponsiveContainer width="100%" height={150}>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(235, 236, 240, 0.1)' : 'rgba(4, 19, 19, 0.1)'} />
          <XAxis type="number" tick={{ fill: tickColor, fontSize: 10 }} />
          <YAxis type="category" dataKey="name" tick={{ fill: tickColor, fontSize: 10 }} width={80} />
          <Tooltip
            cursor={{ fill: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' }}
            contentStyle={{
                backgroundColor: isDark ? '#0F1F1F' : '#FFFFFF',
                borderColor: isDark ? '#4A5568' : '#CBD5E0', 
                borderRadius: '0.5rem',
                fontSize: '12px'
            }}
            labelStyle={{ color: tickColor, fontWeight: 'bold' }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  });

  const LogCropDataModal = React.memo(({ 
    isOpen, onClose, onSubmitCrop, 
    isDark, inputBaseClasses, lightInputClasses, darkInputClasses, 
    buttonPrimaryClasses, buttonPrimaryColorClasses, sectionTitleClasses, 
    lightSectionTitleClasses, darkSectionTitleClasses 
  }) => {
    const [cropNameValue, changeCropName] = useState('');
    const [dateOfPlanting, updateDateOfPlanting] = useState('');
    const [soilPhValue, setSoilPhReading] = useState('');
    const [waterQuantityUsed, recordWaterQuantity] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (event) => {
      event.preventDefault();
      if (!cropNameValue || !dateOfPlanting || !soilPhValue || !waterQuantityUsed) {
        alert("Please fill in all fields before submitting.");
        return;
      }
      if (isNaN(parseFloat(waterQuantityUsed)) || isNaN(parseFloat(soilPhValue))) {
        alert("Water Usage and Soil pH must be valid numbers.");
        return;
      }
      const newEntry = {
        id: new Date().toISOString(),
        cropName: cropNameValue,
        plantingDate: dateOfPlanting,
        soilPh: soilPhValue,
        waterUsage: waterQuantityUsed,
        submissionDate: new Date().toLocaleDateString(),
      };
      onSubmitCrop(newEntry);
      alert("Crop data submitted successfully!");
      changeCropName('');
      updateDateOfPlanting('');
      setSoilPhReading('');
      recordWaterQuantity('');
      onClose();
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 p-4 transition-opacity duration-300 ease-in-out">
        <div className={`bg-white dark:bg-[#0F1F1F] rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 transform transition-all duration-300 ease-in-out scale-100 opacity-100`}>
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className={`${sectionTitleClasses} ${lightSectionTitleClasses} ${darkSectionTitleClasses} !mb-0`}>
              <Database size={26} className="mr-3 text-[#12bf8e]" />
              Log New Crop Data
            </h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-colors">
              <X size={24} className="text-gray-600 dark:text-gray-300" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="modalCropName" className="block text-sm font-medium mb-1.5">Crop Name</label>
                <input
                  type="text"
                  id="modalCropName"
                  value={cropNameValue}
                  onChange={(e) => changeCropName(e.target.value)}
                  className={`${inputBaseClasses} ${lightInputClasses} ${darkInputClasses}`}
                  placeholder="e.g., Golden Corn, Red Wheat"
                />
              </div>
              <div>
                <label htmlFor="modalPlantingDate" className="block text-sm font-medium mb-1.5">Planting Date</label>
                <input
                  type="date"
                  id="modalPlantingDate"
                  value={dateOfPlanting}
                  onChange={(e) => updateDateOfPlanting(e.target.value)}
                  className={`${inputBaseClasses} ${lightInputClasses} ${darkInputClasses}`}
                />
        </div>
          <div>
                <label htmlFor="modalSoilPh" className="block text-sm font-medium mb-1.5">Soil pH</label>
                <input 
                  type="number" 
                  id="modalSoilPh" 
                  step="0.1" 
                  value={soilPhValue}
                  onChange={(e) => setSoilPhReading(e.target.value)}
                  className={`${inputBaseClasses} ${lightInputClasses} ${darkInputClasses}`} 
                  placeholder="e.g., 6.5" 
                />
          </div>
              <div>
                <label htmlFor="modalWaterUsage" className="block text-sm font-medium mb-1.5">Water Usage (Liters/hectare)</label>
              <input
                  type="number" 
                  id="modalWaterUsage" 
                  value={waterQuantityUsed}
                  onChange={(e) => recordWaterQuantity(e.target.value)}
                  className={`${inputBaseClasses} ${lightInputClasses} ${darkInputClasses}`}
                  placeholder="e.g., 5000" 
              />
            </div>
            </div>
            <button
              type="submit"
              className={`${buttonPrimaryClasses} ${buttonPrimaryColorClasses} w-full sm:w-auto mt-2`}
            >
              <UploadCloud size={20} />
              <span>Save Crop Data</span>
            </button>
          </form>
        </div>
      </div>
    );
  });

  return (
      <div
          className={`flex h-screen bg-[#ebecf0] dark:bg-[#041313] text-[#041313] dark:text-[#ebecf0] transition-colors duration-300 overflow-hidden`}
      >
          <header className="sm:hidden p-4 bg-[#FFFFFF] dark:bg-[#0A1414] fixed top-0 left-0 right-0 z-50 flex justify-between items-center">
              <div className="flex items-center">
                  <button
                      onClick={() => setMobileMenuVisibility(!isMobileMenuOpen)}
                      className="mr-2 p-2 cursor-pointer text-[#041313] dark:text-[#ebecf0]"
                  >
                      {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                  </button>
                  <div className={` text-2xl font-bold flex items-center`}>
                      <Tractor size={28} className="mr-2 text-[#041313] dark:text-[#ebecf0]" />
                      <span style={{ color: "#12bf8e" }}>Farm</span>
                      <span style={{ color: "#fe7600" }}>Vue</span>
                  </div>
              </div>
              <div className="flex items-center">
                  <div className="relative" ref={notificationDropdownRef}>
                      <div className="flex items-center">
                          <div className="cursor-pointer p-1" onClick={() => setNotificationDropdownOpen(!isNotificationDropdownOpen)}>
                              <Bell size={18} className="text-[#041313] dark:text-[#ebecf0]" />
                              {mockNotifications.length > 0 && (
                                  <span className="absolute top-0.5 right-0.5 block h-2 w-2 rounded-full bg-[#f67b04] ring-1 ring-white dark:ring-[#041313]"></span>
                              )}
                          </div>
                      </div>
                      {isNotificationDropdownOpen && (
                          <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-[#0F1F1F] rounded-md border border-gray-200 dark:border-gray-700 shadow-xl z-50 overflow-hidden">
                              <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                                  <h3 className={` text-md font-semibold text-[#041313] dark:text-[#ebecf0]`}>
                                      Notifications
                                  </h3>
                              </div>
                              {mockNotifications.length > 0 ? (
                                  <ul className="py-1 max-h-80 overflow-y-auto">
                                      {mockNotifications.map((notification) => (
                                          <li key={notification.id}>
                                              <a
                                                  href="#"
                                                  onClick={(e) => {
                                                      e.preventDefault();
                                                      alert(`Notification acknowledged: ${notification.text}`);
                                                      setNotificationDropdownOpen(false);
                                                  }}
                                                  className="flex items-start px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#0A1414] transition-colors"
                                              >
                                                  <notification.icon
                                                      size={18}
                                                      className="mr-3 mt-0.5 shrink-0"
                                                      style={{ color: notification.iconColor }}
                                                  />
                                                  <div>
                                                      <p className="font-medium leading-snug">{notification.text}</p>
                                                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{notification.time}</p>
                                                  </div>
                                              </a>
                                          </li>
                                      ))}
                                  </ul>
                              ) : (
                                  <p className="p-4 text-sm text-center text-gray-500 dark:text-gray-400">No new notifications.</p>
                              )}
                              <div className="p-2 border-t border-gray-200 dark:border-gray-700 text-center">
                                  <a href="#" className="text-xs text-[#12bf8e] hover:underline">
                                      View all notifications
                                  </a>
                              </div>
                          </div>
                      )}
                  </div>
                  <img
                      src="https://plus.unsplash.com/premium_photo-1708110921381-5da0d7eb2e0f?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt="Carla Stanton profile picture"
                      className="w-8 h-8 rounded-full object-cover bg-gray-300 dark:bg-gray-600 ml-2 block sm:hidden"
                  />
          </div>
        </header>

          <aside
              className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#041313] transform ${
                  isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
              } sm:translate-x-0 transition-transform duration-300 ease-in-out h-screen flex flex-col`}
          >
              <SidebarNavigation />
          </aside>

          <div className="flex-1 flex flex-col sm:ml-64 pt-16 sm:pt-0 overflow-y-auto">
              <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
                  <div className="flex justify-between items-center my-4 sm:mb-6 sm:mt-0">
                      <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Hi Carla,</p>
                          <h1 className={` text-xl sm:text-2xl font-bold text-[#041313] dark:text-[#ebecf0]`}>
                              Welcome Back
                          </h1>
                      </div>
                      <div className="flex items-center space-x-3 sm:space-x-4">
                          <div className="relative hidden sm:block" ref={notificationDropdownRef}>
                              <div className="flex items-center">
                                  <div
                                      className="cursor-pointer p-1"
                                      onClick={() => setNotificationDropdownOpen(!isNotificationDropdownOpen)}
                                  >
                                      <Bell size={18} className="text-[#041313] dark:text-[#ebecf0]" />
                                      {mockNotifications.length > 0 && (
                                          <span className="absolute top-0.5 right-0.5 block h-2 w-2 rounded-full bg-[#f67b04] ring-1 ring-white dark:ring-[#041313]"></span>
                                      )}
                                  </div>
                                  <img
                                      src="https://plus.unsplash.com/premium_photo-1708110921381-5da0d7eb2e0f?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                      alt="Carla Stanton profile picture"
                                      className="w-8 h-8 rounded-full object-cover bg-gray-300 dark:bg-gray-600 ml-2 block sm:hidden"
                                  />
                              </div>
                              {isNotificationDropdownOpen && (
                                  <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-[#0F1F1F] rounded-md border border-gray-200 dark:border-gray-700 shadow-xl z-50 overflow-hidden">
                                      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                                          <h3 className={` text-md font-semibold text-[#041313] dark:text-[#ebecf0]`}>
                                              Notifications
                                          </h3>
                                      </div>
                                      {mockNotifications.length > 0 ? (
                                          <ul className="py-1 max-h-80 overflow-y-auto">
                                              {mockNotifications.map((notification) => (
                                                  <li key={notification.id}>
                                                      <a
                                                          href="#"
                                                          onClick={(e) => {
                                                              e.preventDefault();
                                                              alert(`Notification acknowledged: ${notification.text}`);
                                                              setNotificationDropdownOpen(false);
                                                          }}
                                                          className="flex items-start px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#0A1414] transition-colors"
                                                      >
                                                          <notification.icon
                                                              size={18}
                                                              className="mr-3 mt-0.5 shrink-0"
                                                              style={{ color: notification.iconColor }}
                                                          />
                                                          <div>
                                                              <p className="font-medium leading-snug">{notification.text}</p>
                                                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                                  {notification.time}
                                                              </p>
                                                          </div>
                                                      </a>
                                                  </li>
                                              ))}
                                          </ul>
                                      ) : (
                                          <p className="p-4 text-sm text-center text-gray-500 dark:text-gray-400">No new notifications.</p>
                                      )}
                                      <div className="p-2 border-t border-gray-200 dark:border-gray-700 text-center">
                                          <a href="#" className="text-xs text-[#12bf8e] hover:underline">
                                              View all notifications
                                          </a>
                                      </div>
                                  </div>
                              )}
                          </div>
                          <div className="hidden sm:flex items-center space-x-2 cursor-pointer">
                              <img
                                  src="https://plus.unsplash.com/premium_photo-1708110921381-5da0d7eb2e0f?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                  alt="Carla Stanton profile picture"
                                  className="w-8 h-8 rounded-full object-cover bg-gray-300 dark:bg-gray-600"
                              />
                              <div>
                                  <p className="font-semibold text-xs text-[#041313] dark:text-[#ebecf0]">Carla Stanton</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">Farm Operations Lead</p>
                              </div>
                          </div>
                      </div>
            </div>

                  <div className="flex justify-end mb-6 sm:mb-8">
                      <button
                          onClick={() => setIsLogCropModalOpen(true)}
                          className={`${buttonPrimaryClasses} ${buttonPrimaryColorClasses}`}
                      >
                          <PlusCircle size={20} className="mr-2" />
                          Add Crop Data
                      </button>
          </div>

                  <section className={`${cardBaseClasses} ${lightCardClasses} ${darkCardClasses}`}>
                      <h2 className={`${sectionTitleClasses} ${lightSectionTitleClasses} ${darkSectionTitleClasses}`}>
                          <BarChart2 size={26} className="mr-3 text-[#12bf8e]" />
                          Crop Performance Overview
                      </h2>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          <div className="h-auto bg-[#e0e1e6] dark:bg-[#091010] rounded-lg p-4 border border-gray-300 dark:border-gray-700">
                              <h4 className={` text-lg font-semibold mb-3 text-[#041313] dark:text-[#ebecf0]`}>
                                  Water Usage Over Time
                              </h4>
                              <GenericLineChart
                                  data={preparedWaterUsageChartData}
                                  isDark={isSystemDark}
                                  dataKey="value"
                                  lineName="Water Usage (L)"
                                  lineColor="#12bf8e"
                              />
                          </div>
                          <div className="h-auto bg-[#e0e1e6] dark:bg-[#091010] rounded-lg p-4 border border-gray-300 dark:border-gray-700">
                              <h4 className={` text-lg font-semibold mb-3 text-[#041313] dark:text-[#ebecf0]`}>
                                  Soil pH Over Time
                              </h4>
                              <GenericLineChart
                                  data={preparedSoilPhChartData}
                                  isDark={isSystemDark}
                                  dataKey="value"
                                  lineName="Soil pH"
                                  lineColor="#fe7600"
                              />
                          </div>
                          <div className="h-auto bg-[#e0e1e6] dark:bg-[#091010] rounded-lg p-4 border border-gray-300 dark:border-gray-700">
                              <h4 className={` text-lg font-semibold mb-3 text-[#041313] dark:text-[#ebecf0]`}>
                                  Total Water Usage by Crop
                              </h4>
                              <ResourceUsageChart data={preparedResourceUsageData} isDark={isSystemDark} />
                          </div>
                      </div>
                  </section>

                  <section className={`${cardBaseClasses} ${lightCardClasses} ${darkCardClasses}`}>
                      <h2 className={`${sectionTitleClasses} ${lightSectionTitleClasses} ${darkSectionTitleClasses}`}>
                          <Calendar size={26} className="mr-3 text-[#fe7600]" />
                          Seasonal Analysis & Comparison
                      </h2>
                      <p className="text-sm mb-4 text-gray-700 dark:text-gray-300">
                          Compare total water usage between the latest year and a selected past year.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 items-end mb-4">
                          <div className="flex-grow w-full sm:w-auto">
                              <label htmlFor="compareSeason" className="block text-sm font-medium mb-1.5">
                                  Select Year to Compare
                              </label>
                              <select
                                  id="compareSeason"
                                  value={comparisonYear}
                                  onChange={(e) => setComparisonYear(e.target.value)}
                                  className={`${inputBaseClasses} ${lightInputClasses} ${darkInputClasses}`}
                                  disabled={availableYears.length < 2}
                              >
                                  {availableYears.length < 2 ? (
                                      <option>Not enough data</option>
                                  ) : availableYears.filter((year) => year.toString() !== latestYear).length === 0 ? (
                                      <option disabled>No other years</option>
                                  ) : (
                                      availableYears
                                          .filter((year) => year.toString() !== latestYear)
                                          .map((year) => (
                                              <option key={year} value={year}>
                                                  {year}
                                              </option>
                                          ))
                                  )}
                              </select>
          </div>
        </div>
                      <div className="mt-6 bg-[#e0e1e6] dark:bg-[#091010] rounded-lg p-4 border border-gray-300 dark:border-gray-700">
                          <h4 className={` text-lg font-semibold mb-3 text-[#041313] dark:text-[#ebecf0]`}>
                              Total Water Usage Comparison: {latestYear} vs {comparisonYear}
                          </h4>
                          <SeasonalComparisonChart data={preparedSeasonalComparisonData} isDark={isSystemDark} />
                      </div>
                  </section>

                  <section className={`${cardBaseClasses} ${lightCardClasses} ${darkCardClasses}`}>
                      <h2 className={`${sectionTitleClasses} ${lightSectionTitleClasses} ${darkSectionTitleClasses}`}>
                          <TrendingUp size={26} className="mr-3 text-[#12bf8e]" />
                          Future Performance Forecast
                      </h2>
                      <p className="text-sm mb-4 text-gray-700 dark:text-gray-300">Simple forecast based on recent water usage trends.</p>
                      <div className="mt-4 h-auto min-h-[8rem] bg-[#e0e1e6] dark:bg-[#091010] rounded-lg flex flex-col items-center justify-center text-center p-4 border border-gray-300 dark:border-gray-700">
                          {predictedNextWaterUsage !== null && lastActualWaterUsage !== null ? (
                              <ForecastVisualization
                                  lastActual={lastActualWaterUsage}
                                  predictedNext={predictedNextWaterUsage}
                                  isDark={isSystemDark}
                              />
                          ) : (
                              <p className="text-gray-500 dark:text-gray-400">
                                  Not enough data for a forecast (requires at least 2 entries).
                              </p>
                          )}
                      </div>
                  </section>
      </main>

              <footer className="text-center p-4 sm:p-6 text-xs text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 bg-[#FFFFFF] dark:bg-[#0A1414] shrink-0">
                  © {new Date().getFullYear()} FarmVue. Empowering Farmers with Data.
              </footer>
          </div>
          <LogCropDataModal
              isOpen={isLogCropModalOpen}
              onClose={closeLogModal}
              onSubmitCrop={handleAddCropEntry}
              isDark={isSystemDark}
              inputBaseClasses={inputBaseClasses}
              lightInputClasses={lightInputClasses}
              darkInputClasses={darkInputClasses}
              buttonPrimaryClasses={buttonPrimaryClasses}
              buttonPrimaryColorClasses={buttonPrimaryColorClasses}
              sectionTitleClasses={sectionTitleClasses}
              lightSectionTitleClasses={lightSectionTitleClasses}
              darkSectionTitleClasses={darkSectionTitleClasses}
          />
    </div>
  );
};

export default CropAnalysisTool;
