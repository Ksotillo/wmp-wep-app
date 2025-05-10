"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { ThemeProvider, useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
    UploadCloud,
    BarChart2,
    Calendar,
    TrendingUp,
    Database,
    Bell,
    Layers,
    Droplet,
    Bug,
    Wrench,
    PlusCircle,
    Sun,
    Moon,
    BarChartBig,
    X,
    Tractor,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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
    { id: "2024-9", cropName: "Soybeans", plantingDate: "2024-07-20", soilPh: "6.2", waterUsage: "6050", submissionDate: "2024-07-15" },
];

const mockNotifications: MockNotification[] = [
    { id: 1, text: "New soil data available for Field A.", time: "5 mins ago", icon: Layers, iconColor: "#12bf8e" },
    { id: 2, text: "Low water levels detected in Sector 3.", time: "2 hours ago", icon: Droplet, iconColor: "#fe7600" },
    { id: 3, text: "Pest alert: Aphids detected on Corn crops.", time: "1 day ago", icon: Bug, iconColor: "#f67b04" },
    { id: 4, text: "Tractor #2 maintenance due tomorrow.", time: "1 day ago", icon: Wrench, iconColor: "#8f9190" },
];

const CropAnalysisToolInternal = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [cropEntries, setCropEntries] = useState([]);
    const [isNotificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
    const [isLogCropModalOpen, setIsLogCropModalOpen] = useState(false);
    const [comparisonYear, setComparisonYear] = useState("");
    const notificationDropdownRef = useRef(null);

    useEffect(() => {
        setMounted(true);
    }, []);
    useEffect(() => {
        let loadedEntries = initialMockCropEntries;
        const storedCropData = localStorage.getItem("farmVueCropData");
        if (storedCropData) {
            loadedEntries = JSON.parse(storedCropData);
        } else {
            localStorage.setItem("farmVueCropData", JSON.stringify(initialMockCropEntries));
        }
        setCropEntries(loadedEntries);

        const years = [...new Set(loadedEntries.map((e) => new Date(e.plantingDate).getFullYear()))].sort((a, b) => b - a);
        if (years.length > 1) {
            setComparisonYear(years[1].toString());
        } else if (years.length === 1) {
            setComparisonYear(years[0].toString());
        }
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (notificationDropdownRef.current && event.target instanceof Node && !notificationDropdownRef.current.contains(event.target)) {
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
        localStorage.setItem("farmVueCropData", JSON.stringify(updatedEntries));
        toast.success('Crop data submitted successfully!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: theme === "dark" ? "dark" : "light",
        });
    };

    const closeLogModal = () => {
        setIsLogCropModalOpen(false);
    };

    const isDark = theme === "dark";

    const inputBaseClasses = "w-full p-3 border rounded-md focus:ring-2 transition-colors duration-150 text-sm sm:text-base";
    const lightInputClasses = "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-green-500 focus:border-green-500";
    const darkInputClasses = "bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-green-400 focus:border-green-400";
    const currentInputClasses = `${inputBaseClasses} ${isDark ? darkInputClasses : lightInputClasses}`;

    const cardBaseClasses = "p-4 sm:p-5 rounded-2xl transition-all duration-300 hover:shadow-lg backdrop-blur-sm";
    const lightCardClasses = "bg-white/80 text-gray-900 shadow-sm hover:shadow-gray-200/50 border border-gray-100";
    const darkCardClasses = "bg-gray-800/80 text-gray-100 shadow-sm hover:shadow-gray-900/50 border border-gray-700";
    const currentCardClasses = `${cardBaseClasses} ${isDark ? darkCardClasses : lightCardClasses}`;

    const sectionTitleBaseClasses = "text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 flex items-center group";
    const lightSectionTitleClasses = "text-gray-900";
    const darkSectionTitleClasses = "text-gray-100";
    const currentSectionTitleClasses = `${sectionTitleBaseClasses} ${isDark ? darkSectionTitleClasses : lightSectionTitleClasses}`;

    const buttonPrimaryBaseClasses = "px-6 py-3 font-semibold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base group";
    const lightButtonPrimaryClasses = "bg-green-500 text-white hover:bg-green-600 hover:shadow-green-500/25 active:scale-95";
    const darkButtonPrimaryClasses = "bg-green-400 text-gray-900 hover:bg-green-300 hover:shadow-green-400/25 active:scale-95";
    const currentButtonPrimaryClasses = `${buttonPrimaryBaseClasses} ${isDark ? darkButtonPrimaryClasses : lightButtonPrimaryClasses}`;

    const chartCardClasses = `h-auto rounded-xl p-6 border backdrop-blur-sm transition-all duration-300 hover:shadow-md ${
        isDark 
            ? 'bg-gray-800/50 border-gray-700 hover:border-gray-600' 
            : 'bg-white/50 border-gray-200 hover:border-gray-300'
    }`;
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.15
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.15,
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1]
            }
        })
    };

    const availableYears = useMemo(
        () => [...new Set(cropEntries.map((e) => new Date(e.plantingDate).getFullYear()))].sort((a, b) => b - a),
        [cropEntries]
    );

    const latestYear = useMemo(() => availableYears[0]?.toString() || "", [availableYears]);

    const baseChartDataProcessor = (dataKey) =>
        useMemo(
            () =>
                cropEntries
                    .map((entry) => ({ ...entry, plantingDateObj: new Date(entry.plantingDate) }))
                    .sort((a, b) => a.plantingDateObj.getTime() - b.plantingDateObj.getTime())
                    .map(
                        (entry) =>
                            ({
                                plantingDate: new Date(entry.plantingDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                                value: parseFloat(entry[dataKey]) || 0,
                                cropName: entry.cropName,
                            })
                    ),
            [cropEntries, dataKey]
        );

    const preparedWaterUsageChartData = baseChartDataProcessor("waterUsage");
    const preparedSoilPhChartData = baseChartDataProcessor("soilPh");

    const preparedResourceUsageData = cropEntries.reduce((acc, entry) => {
        const water = parseFloat(entry.waterUsage) || 0;
        const existing = acc.find((item) => item.name === entry.cropName);
        if (existing) {
            existing.totalWater += water;
        } else {
            acc.push({ name: entry.cropName, totalWater: water });
        }
        return acc;
    }, []);

    const preparedSeasonalComparisonData = useMemo(() => {
        if (!latestYear || !comparisonYear) return [];

        const calculateTotalWater = (year) =>
            cropEntries
                .filter((e) => new Date(e.plantingDate).getFullYear().toString() === year)
                .reduce((sum, e) => sum + (parseFloat(e.waterUsage) || 0), 0);

        const comparisonData = [{ year: comparisonYear, totalWater: calculateTotalWater(comparisonYear) }];

        if (latestYear !== comparisonYear) {
            comparisonData.push({ year: latestYear, totalWater: calculateTotalWater(latestYear) });
            comparisonData.sort((a, b) => parseInt(a.year) - parseInt(b.year));
        }

        return comparisonData;
    }, [cropEntries, comparisonYear, latestYear]);

    const GenericLineChart = React.memo(({ data, dataKey, lineName, lineColor }) => {
        const { theme } = useTheme();
        const isChartDark = theme === "dark";
        const tickColor = isChartDark ? "#ebecf0" : "#041313";
        const gridColor = isChartDark ? "rgba(235, 236, 240, 0.1)" : "rgba(4, 19, 19, 0.1)";

        if (!data || data.length === 0) {
            return (
                <div className={`h-80 flex items-center justify-center text-sm ${isChartDark ? 'text-gray-400' : 'text-gray-500'}`}>No data to display.</div>
            );
        }

            return (
                <ResponsiveContainer width="100%" height={320}>
                    <LineChart data={data} margin={{ top: 30, right: 20, left: -20, bottom: 10 }}>
                        <Legend verticalAlign="top" align="center" wrapperStyle={{ width: "100%", display: "flex", justifyContent: "center", color: tickColor, fontSize: 12, paddingBottom: 10 }} />
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        <XAxis dataKey="plantingDate" tick={{ fill: tickColor, fontSize: 10 }} angle={-30} textAnchor="end" height={50} />
                        <YAxis tick={{ fill: tickColor, fontSize: 10 }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: isChartDark ? "#0F1F1F" : "#FFFFFF",
                                borderColor: isChartDark ? "#12bf8e" : "#041313",
                                borderRadius: "0.5rem",
                                fontSize: "12px",
                            }}
                            labelStyle={{ color: tickColor, fontWeight: "bold" }}
                            itemStyle={{ color: lineColor }}
                        />
                        <Line
                            type="monotone"
                            dataKey="value"
                            name={lineName}
                            stroke={lineColor}
                            strokeWidth={2}
                            activeDot={{ r: 5 }}
                            dot={{ r: 2 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            );
        }, (prevProps, nextProps) => {
            return (
                prevProps.data === nextProps.data &&
                prevProps.dataKey === nextProps.dataKey &&
                prevProps.lineName === nextProps.lineName &&
                prevProps.lineColor === nextProps.lineColor
            );
        });

    const ResourceUsageChart = React.memo(({ data }) => {
        const { theme } = useTheme();
        const isChartDark = theme === "dark";
        const tickColor = isChartDark ? "#ebecf0" : "#041313";
        const gridColor = isChartDark ? "rgba(235, 236, 240, 0.1)" : "rgba(4, 19, 19, 0.1)";

        if (!data || data.length === 0) {
            return (
                <div className={`h-80 flex items-center justify-center text-sm ${isChartDark ? 'text-gray-400' : 'text-gray-500'}`}>No data to display.</div>
            );
        }

        return (
            <ResponsiveContainer width="100%" height={320}>
                <BarChart data={data} margin={{ top: 30, right: 20, left: -20, bottom: 10 }}>
                    <Legend verticalAlign="top" align="center" wrapperStyle={{ width: "100%", display: "flex", justifyContent: "center", color: tickColor, fontSize: 12, paddingBottom: 10 }} />
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis dataKey="name" tick={{ fill: tickColor, fontSize: 10 }} angle={-30} textAnchor="end" height={50} interval={0} />
                    <YAxis tick={{ fill: tickColor, fontSize: 10 }} />
                    <Tooltip
                        cursor={{ fill: isChartDark ? "rgba(254, 118, 0, 0.1)" : "rgba(254, 118, 0, 0.2)" }}
                        contentStyle={{
                            backgroundColor: isChartDark ? "#0F1F1F" : "#FFFFFF",
                            borderColor: isChartDark ? "#fe7600" : "#041313",
                            borderRadius: "0.5rem",
                            fontSize: "12px",
                        }}
                        labelStyle={{ color: tickColor, fontWeight: "bold" }}
                        itemStyle={{ color: "#f67b04" }}
                    />
                    <Bar dataKey="totalWater" name="Total Water Usage (L)" fill="#f67b04" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        );
    }, (prevProps, nextProps) => prevProps.data === nextProps.data);
    const SeasonalComparisonChart = React.memo(({ data }) => {
        const { theme } = useTheme();
        const isChartDark = theme === "dark";
        const tickColor = isChartDark ? "#ebecf0" : "#041313";
        const gridColor = isChartDark ? "rgba(235, 236, 240, 0.1)" : "rgba(4, 19, 19, 0.1)";

        if (!data || data.length === 0)
            return (
                <div className={`h-48 flex items-center justify-center text-sm ${isChartDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Select a year to compare.
                </div>
            );

        return (
            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis dataKey="year" tick={{ fill: tickColor, fontSize: 10 }} />
                    <YAxis tick={{ fill: tickColor, fontSize: 10 }} />
                    <Tooltip
                        cursor={{ fill: isChartDark ? "rgba(254, 118, 0, 0.1)" : "rgba(254, 118, 0, 0.2)" }}
                        contentStyle={{
                            backgroundColor: isChartDark ? "#0F1F1F" : "#FFFFFF",
                            borderColor: isChartDark ? "#fe7600" : "#041313",
                            borderRadius: "0.5rem",
                            fontSize: "12px",
                        }}
                        labelStyle={{ color: tickColor, fontWeight: "bold" }}
                        itemStyle={{ color: "#fe7600" }}
                    />
                    <Bar dataKey="totalWater" name="Total Water (L)" fill="#fe7600" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        );
    }, (prevProps, nextProps) => prevProps.data === nextProps.data);

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

        const variation = Math.random() * 0.2 - 0.1;
        const finalPrediction = predicted * (1 + variation);

        return Math.max(0, Math.round(finalPrediction));
    }, [preparedWaterUsageChartData]);

    const lastActualWaterUsage = useMemo(() => {
        if (preparedWaterUsageChartData.length === 0) return null;
        return preparedWaterUsageChartData[preparedWaterUsageChartData.length - 1].value;
    }, [preparedWaterUsageChartData]);
    const ForecastVisualization = React.memo(({ lastActual, predictedNext }) => {
        const { theme } = useTheme();
        const isChartDark = theme === "dark";
        const tickColor = isChartDark ? "#ebecf0" : "#041313";

        if (lastActual === null || predictedNext === null) {
            return (
                <p className={`${isChartDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Not enough data for a forecast visualization (requires at least 2 entries).
                </p>
            );
        }

        const data = [
            { name: "Last Actual", value: lastActual, color: isChartDark ? "#3b82f6" : "#2563eb" },
            { name: "Predicted Next", value: predictedNext, color: isChartDark ? "#22c55e" : "#16a34a" },
        ];

        return (
            <ResponsiveContainer width="100%" height={150}>
                <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isChartDark ? "rgba(235, 236, 240, 0.1)" : "rgba(4, 19, 19, 0.1)"} />
                    <XAxis type="number" tick={{ fill: tickColor, fontSize: 10 }} />
                    <YAxis type="category" dataKey="name" tick={{ fill: tickColor, fontSize: 10 }} width={80} />
                    <Tooltip
                        cursor={{ fill: isChartDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)" }}
                        contentStyle={{
                            backgroundColor: isChartDark ? "#0F1F1F" : "#FFFFFF",
                            borderColor: isChartDark ? "#4A5568" : "#CBD5E0",
                            borderRadius: "0.5rem",
                            fontSize: "12px",
                        }}
                        labelStyle={{ color: tickColor, fontWeight: "bold" }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        );
    }, (prevProps, nextProps) => 
        prevProps.lastActual === nextProps.lastActual && 
        prevProps.predictedNext === nextProps.predictedNext
    );
    const LogCropDataModal = React.memo(
        ({
            isOpen,
            onClose,
            onSubmitCrop,
            inputBaseClasses: receivedInputClasses,
            buttonPrimaryClasses: receivedButtonPrimaryClasses,
            sectionTitleClasses: receivedSectionTitleClasses,
        }) => {
            const { theme: modalTheme } = useTheme();
            const isModalDark = modalTheme === 'dark';

            const [internalAnimate, setInternalAnimate] = useState(false);

            useEffect(() => {
                if (isOpen) {
                    const timer = setTimeout(() => {
                        setInternalAnimate(true);
                    }, 50);
                    return () => clearTimeout(timer);
                } else {
                    setInternalAnimate(false);
                }
            }, [isOpen]);

            const [cropNameValue, changeCropName] = useState("");
            const [dateOfPlanting, updateDateOfPlanting] = useState("");
            const [soilPhValue, setSoilPhReading] = useState("");
            const [waterQuantityUsed, recordWaterQuantity] = useState("");

            if (!isOpen) return null;

            const handleSubmit = (event) => {
                event.preventDefault();
                if (!cropNameValue || !dateOfPlanting || !soilPhValue || !waterQuantityUsed) {
                    toast.error('Please fill in all fields before submitting.', {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: isDark ? "dark" : "light",
                    });
                    return;
                }
                if (isNaN(parseFloat(waterQuantityUsed)) || isNaN(parseFloat(soilPhValue))) {
                    toast.error('Water Usage and Soil pH must be valid numbers.', {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: isDark ? "dark" : "light",
                    });
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
                changeCropName("");
                updateDateOfPlanting("");
                setSoilPhReading("");
                recordWaterQuantity("");
                onClose();
            };

            return (
                <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out ${isModalDark ? 'bg-black/70' : 'bg-black/50'} ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <div
                        className={`rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 transform transition-all duration-300 ease-in-out ${isModalDark ? 'bg-gray-800' : 'bg-white'} ${internalAnimate ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                    >
                        <div className="flex justify-between items-center mb-4 sm:mb-6">
                            <h2 className={`${receivedSectionTitleClasses} !mb-0`}>
                                <Database size={26} className="mr-3 text-green-500" />
                                Log New Crop Data
                            </h2>
                            <button
                                onClick={onClose}
                                className={`p-2 rounded-full cursor-pointer transition-colors ${isModalDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                            >
                                <X size={24} className={`${isModalDark ? 'text-gray-300' : 'text-gray-600'}`} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="modalCropName" className={`block text-sm font-medium mb-1.5 ${isModalDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Crop Name
                                    </label>
                                    <input
                                        type="text"
                                        id="modalCropName"
                                        value={cropNameValue}
                                        onChange={(e) => changeCropName(e.target.value)}
                                        className={`${receivedInputClasses}`}
                                        placeholder="e.g., Golden Corn, Red Wheat"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="modalPlantingDate" className={`block text-sm font-medium mb-1.5 ${isModalDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Planting Date
                                    </label>
                                    <input
                                        type="date"
                                        id="modalPlantingDate"
                                        value={dateOfPlanting}
                                        onChange={(e) => updateDateOfPlanting(e.target.value)}
                                        className={`${receivedInputClasses}`}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="modalSoilPh" className={`block text-sm font-medium mb-1.5 ${isModalDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Soil pH
                                    </label>
                                    <input
                                        type="number"
                                        id="modalSoilPh"
                                        step="0.1"
                                        value={soilPhValue}
                                        onChange={(e) => setSoilPhReading(e.target.value)}
                                        className={`${receivedInputClasses}`}
                                        placeholder="e.g., 6.5"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="modalWaterUsage" className={`block text-sm font-medium mb-1.5 ${isModalDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Water Usage (Liters/hectare)
                                    </label>
                                    <input
                                        type="number"
                                        id="modalWaterUsage"
                                        value={waterQuantityUsed}
                                        onChange={(e) => recordWaterQuantity(e.target.value)}
                                        className={`${receivedInputClasses}`}
                                        placeholder="e.g., 5000"
                                    />
                                </div>
                            </div>
                            <button type="submit" className={`${receivedButtonPrimaryClasses} w-full sm:w-auto mt-2`}>
                                <UploadCloud size={20} />
                                <span>Save Crop Data</span>
                            </button>
                        </form>
                    </div>
                </div>
            );
        }
    );

   
    const handleThemeToggle = useCallback(() => {
        setTheme(theme === "dark" ? "light" : "dark");
    }, [theme, setTheme]);

    const handleNotificationToggle = useCallback(() => {
        setNotificationDropdownOpen(!isNotificationDropdownOpen);
    }, [isNotificationDropdownOpen]);

    const handleAddCropClick = useCallback(() => {
        setIsLogCropModalOpen(true);
    }, []);

    if (!mounted) {
        return (
            <div className="flex items-center justify-center h-screen">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    <h1 className="text-2xl font-bold">
                        <span className="text-green-500">Farm</span>
                        <span className="text-orange-500">Vue</span>
                    </h1>
                </motion.div>
            </div>
        );
    }

    return (
        <>
            <style jsx global>{`
                @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap");
                body {
                    font-family: "Roboto", sans-serif;
                }
                h1,
                h2,
                h3,
                h4,
                h5,
                h6 {
                    font-family: "Montserrat", sans-serif;
                }
                p,
                span,
                a,
                div,
                li,
                label,
                option,
                select,
                input,
                button,
                textarea {
                    font-family: "Roboto", sans-serif;
                }
                .font-heading {
                    font-family: "Montserrat", sans-serif !important;
                }
                .font-body {
                    font-family: "Roboto", sans-serif !important;
                }
                html {
                    scroll-behavior: smooth;
                }
                ::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                ::-webkit-scrollbar-track {
                    background: transparent;
                }
                ::-webkit-scrollbar-thumb {
                    background: #888;
                    border-radius: 4px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: #666;
                }
                /* Add glass morphism effect */
                .glass-effect {
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                }
                /* Smooth transitions */
                * {
                    transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
                    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                    transition-duration: 150ms;
                }
            `}</style>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className={`flex h-screen transition-colors duration-300 overflow-hidden ${
                    isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
                }`}
            >
                <motion.div variants={itemVariants} custom={1} className="flex-1 flex flex-col overflow-y-auto">
                    <main className="flex-1 p-6 sm:p-8 lg:p-10 space-y-8 sm:space-y-10 max-w-[1440px] mx-auto w-full">
                        <motion.div variants={itemVariants} custom={2} className="flex flex-col space-y-6">
                            <div className="flex justify-between items-center">
                                <div 
                                    className={`text-2xl font-bold flex items-center cursor-pointer select-none`}
                                    onClick={() => window.location.href = '/'}
                                >
                                    <Tractor size={28} className={`mr-2 text-[#12bf8e]`} />
                                    <span style={{ color: "#12bf8e" }}>Farm</span>
                                    <span style={{ color: "#fe7600" }}>Vue</span>
                                </div>
                                <div className="flex items-center space-x-3 sm:space-x-4">
                                    <div className="relative" ref={notificationDropdownRef}>
                                        <div className="flex items-center">
                                            <div
                                                className="cursor-pointer p-1"
                                                onClick={handleNotificationToggle}
                                            >
                                                <Bell size={18} className={`${isDark ? "text-gray-200" : "text-gray-800"}`} />
                                                {mockNotifications.length > 0 && (
                                                    <span
                                                        className={`absolute top-0.5 right-0.5 block h-2 w-2 rounded-full bg-orange-500 ring-1 ${
                                                            isDark ? "ring-gray-900" : "ring-white"
                                                        }`}
                                                    ></span>
                                                )}
                                            </div>
                                        </div>
                                        {isNotificationDropdownOpen && (
                                            <div
                                                className={`absolute right-0 mt-2 w-72 sm:w-80 rounded-md border shadow-xl z-50 overflow-hidden ${
                                                    isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                                                }`}
                                            >
                                                <div className={`p-3 border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                                                    <h3 className={`text-md font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}>
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
                                                                        toast.info(`Notification acknowledged: ${notification.text}`, {
                                                                            position: "top-right",
                                                                            autoClose: 3000,
                                                                            hideProgressBar: false,
                                                                            closeOnClick: true,
                                                                            pauseOnHover: true,
                                                                            draggable: true,
                                                                            progress: undefined,
                                                                            theme: isDark ? "dark" : "light",
                                                                        });
                                                                        setNotificationDropdownOpen(false);
                                                                    }}
                                                                    className={`flex items-start px-4 py-2.5 text-sm transition-colors ${
                                                                        isDark
                                                                            ? "text-gray-300 hover:bg-gray-700"
                                                                            : "text-gray-700 hover:bg-gray-100"
                                                                    }`}
                                                                >
                                                                    <notification.icon
                                                                        size={18}
                                                                        className="mr-3 mt-0.5 shrink-0"
                                                                        style={{ color: notification.iconColor }}
                                                                    />
                                                                    <div>
                                                                        <p className="font-medium leading-snug">{notification.text}</p>
                                                                        <p
                                                                            className={`text-xs mt-0.5 ${
                                                                                isDark ? "text-gray-400" : "text-gray-500"
                                                                            }`}
                                                                        >
                                                                            {notification.time}
                                                                        </p>
                                                                    </div>
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p className={`p-4 text-sm text-center ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                                                        No new notifications.
                                                    </p>
                                                )}
                                                <div className={`p-2 border-t text-center ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                                                    <a href="#" className="text-xs text-[#12bf8e] hover:underline">
                                                        View all notifications
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={handleThemeToggle}
                                        className={`p-2 rounded-full cursor-pointer transition-colors ${
                                            isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"
                                        }`}
                                    >
                                        {theme === "dark" ? (
                                            <Sun size={22} className="text-yellow-400" />
                                        ) : (
                                            <Moon size={22} className="text-blue-500" />
                                        )}
                                    </button>
                                    <div className="hidden sm:flex items-center space-x-2 cursor-pointer">
                                        <img
                                            src="https://plus.unsplash.com/premium_photo-1708110921381-5da0d7eb2e0f?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                            alt="Carla Stanton profile picture"
                                            className={`w-8 h-8 rounded-full object-cover ${isDark ? "bg-gray-600" : "bg-gray-300"}`}
                                        />
                                        <div>
                                            <p className={`font-semibold text-xs ${isDark ? "text-gray-100" : "text-gray-900"}`}>Carla Stanton</p>
                                            <p className={`text-xs leading-tight ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                                                Farm Operations Lead
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-12 flex justify-between items-center">
                                <div className="flex flex-col justify-center">
                                    <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Hi Carla,</p>
                                    <h2 className={`text-2xl sm:text-3xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                                        Welcome Back
                                    </h2>
                                </div>
                                <button onClick={handleAddCropClick} className={`${currentButtonPrimaryClasses}`}>
                                    <PlusCircle size={20} />
                                    <span>Add Crop Data</span>
                                </button>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} custom={4} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                            <motion.div variants={itemVariants} custom={4} className={`${currentCardClasses}`}>
                                <h2 className={`text-2xl lg:text-xl font-bold flex items-center group ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                                    <Droplet size={28} className="mr-3 text-blue-500 group-hover:scale-110 transition-transform" />
                                    Water Usage Over Time
                                </h2>
                                <GenericLineChart
                                    data={preparedWaterUsageChartData}
                                    dataKey="value"
                                    lineName="Water Usage (L)"
                                    lineColor="#12bf8e"
                                />
                            </motion.div>

                            <motion.div variants={itemVariants} custom={5} className={`${currentCardClasses}`}>
                                <h2 className={`text-2xl lg:text-xl font-bold flex items-center group ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                                    <Layers size={28} className="mr-3 text-orange-500 group-hover:scale-110 transition-transform" />
                                    Soil pH Over Time
                                </h2>
                                <GenericLineChart
                                    data={preparedSoilPhChartData}
                                    dataKey="value"
                                    lineName="Soil pH"
                                    lineColor="#fe7600"
                                />
                            </motion.div>

                            <motion.div variants={itemVariants} custom={6} className={`${currentCardClasses}`}>
                                <h2 className={`text-2xl lg:text-xl font-bold flex items-center group ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                                    <Database size={28} className="mr-3 text-green-500 group-hover:scale-110 transition-transform" />
                                    Total Water Usage by Crop
                                </h2>
                                <ResourceUsageChart data={preparedResourceUsageData} />
                            </motion.div>
                        </motion.div>

                        <motion.section variants={itemVariants} custom={7} className={`${currentCardClasses}`}>
                            <h2 className={`${currentSectionTitleClasses}`}>
                                <Calendar size={28} className="mr-3 text-orange-500 group-hover:scale-110 transition-transform" />
                                Seasonal Analysis & Comparison
                            </h2>
                            <motion.p
                                variants={itemVariants}
                                custom={8}
                                className={`text-sm mb-6 ${isDark ? "text-gray-300" : "text-gray-600"}`}
                            >
                                Compare total water usage between the latest year and a selected past year.
                            </motion.p>
                            <motion.div variants={itemVariants} custom={9} className="flex flex-col sm:flex-row gap-4 items-end mb-6">
                                <div className="flex-grow w-full sm:w-auto">
                                    <label
                                        htmlFor="compareSeason"
                                        className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                                    >
                                        Select Year to Compare
                                    </label>
                                    <select
                                        id="compareSeason"
                                        value={comparisonYear}
                                        onChange={(e) => setComparisonYear(e.target.value)}
                                        className={`${currentInputClasses} rounded-xl focus:ring-2 focus:ring-green-500/20`}
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
                            </motion.div>
                            <motion.div variants={itemVariants} custom={10} className={chartCardClasses}>
                                <h4
                                    className={`text-lg font-semibold mb-4 flex items-center ${isDark ? "text-gray-100" : "text-gray-900"}`}
                                >
                                    <BarChartBig size={18} className="mr-2 text-orange-500" />
                                    Total Water Usage Comparison: {latestYear} vs {comparisonYear}
                                </h4>
                                <SeasonalComparisonChart data={preparedSeasonalComparisonData} />
                            </motion.div>
                        </motion.section>

                        <motion.section variants={itemVariants} custom={11} className={`${currentCardClasses}`}>
                            <h2 className={`${currentSectionTitleClasses}`}>
                                <TrendingUp size={28} className="mr-3 text-green-500 group-hover:scale-110 transition-transform" />
                                Future Performance Forecast
                            </h2>
                            <motion.p
                                variants={itemVariants}
                                custom={12}
                                className={`text-sm mb-6 ${isDark ? "text-gray-300" : "text-gray-600"}`}
                            >
                                Simple forecast based on recent water usage trends.
                            </motion.p>
                            <motion.div variants={itemVariants} custom={11} className={chartCardClasses}>
                                {predictedNextWaterUsage !== null && lastActualWaterUsage !== null ? (
                                    <ForecastVisualization lastActual={lastActualWaterUsage} predictedNext={predictedNextWaterUsage} />
                                ) : (
                                    <p className={`${isDark ? "text-gray-400" : "text-gray-500"}`}>
                                        Not enough data for a forecast (requires at least 2 entries).
                                    </p>
                                )}
                            </motion.div>
                        </motion.section>
                    </main>

                    <motion.footer
                        variants={itemVariants}
                        custom={12}
                        className={`text-center p-8 border-t shrink-0 ${
                            isDark ? "text-gray-400 border-gray-700 bg-gray-800/50" : "text-gray-500 border-gray-200 bg-white/50"
                        }`}
                    >
                        <div className="max-w-[1440px] mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                                <div className="text-left">
                                    <h3 className={`text-lg font-semibold mb-4 ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                                        About FarmVue
                                    </h3>
                                    <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                                        Empowering farmers with data-driven insights for sustainable agriculture and optimal crop management.
                                    </p>
                                </div>
                                <div className="text-left">
                                    <h3 className={`text-lg font-semibold mb-4 ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                                        Quick Links
                                    </h3>
                                    <ul className="space-y-2">
                                        <li>
                                            <a 
                                                href="#" 
                                                className={`text-sm hover:text-[#12bf8e] transition-colors ${isDark ? "text-gray-400" : "text-gray-600"}`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    toast.info('Documentation coming soon!', {
                                                        theme: isDark ? "dark" : "light"
                                                    });
                                                }}
                                            >
                                                Documentation
                                            </a>
                                        </li>
                                        <li>
                                            <a 
                                                href="#" 
                                                className={`text-sm hover:text-[#12bf8e] transition-colors ${isDark ? "text-gray-400" : "text-gray-600"}`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    toast.info('Support portal coming soon!', {
                                                        theme: isDark ? "dark" : "light"
                                                    });
                                                }}
                                            >
                                                Support
                                            </a>
                                        </li>
                                        <li>
                                            <a 
                                                href="#" 
                                                className={`text-sm hover:text-[#12bf8e] transition-colors ${isDark ? "text-gray-400" : "text-gray-600"}`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    toast.info('Privacy policy coming soon!', {
                                                        theme: isDark ? "dark" : "light"
                                                    });
                                                }}
                                            >
                                                Privacy Policy
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="text-left">
                                    <h3 className={`text-lg font-semibold mb-4 ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                                        Contact
                                    </h3>
                                    <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                                        Have questions? Reach out to our support team at{' '}
                                        <a 
                                            href="mailto:support@farmvue.com" 
                                            className="text-[#12bf8e] hover:underline"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                toast.info('Email support coming soon!', {
                                                    theme: isDark ? "dark" : "light"
                                                });
                                            }}
                                        >
                                            support@farmvue.com
                                        </a>
                                    </p>
                                </div>
                            </div>
                            <div className={`pt-6 border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                                <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                                    © {new Date().getFullYear()} FarmVue. All rights reserved. Empowering Farmers with Data.
                                </p>
                            </div>
                        </div>
                    </motion.footer>
                </motion.div>

                <AnimatePresence>
                    {isLogCropModalOpen && (
                        <LogCropDataModal
                            isOpen={isLogCropModalOpen}
                            onClose={closeLogModal}
                            onSubmitCrop={handleAddCropEntry}
                            inputBaseClasses={currentInputClasses}
                            buttonPrimaryClasses={currentButtonPrimaryClasses}
                            sectionTitleClasses={currentSectionTitleClasses}
                        />
                    )}
                </AnimatePresence>
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme={isDark ? "dark" : "light"}
                />
            </motion.div>
        </>
    );
};

const CropAnalysisTool = () => (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <CropAnalysisToolInternal />
    </ThemeProvider>
);

export default CropAnalysisTool;
