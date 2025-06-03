"use client";

import type React from "react";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Pie, Cell, YAxis, XAxis, Scatter, Tooltip, PieChart, ScatterChart, CartesianGrid, ResponsiveContainer } from "recharts";

interface Asset {
    id: string;
    name: string;
    symbol: string;
    allocation: number;
    value: number;
    sector: string;
    risk: number;
    return: number;
    color: string;
    change: number;
    volume: number;
}

interface Sector {
    name: string;
    allocation: number;
    color: string;
    assets: Asset[];
    performance: number;
}

interface UserPreferences {
    theme: "light" | "dark";
    layout: "grid" | "list";
    defaultView: "treemap" | "heatmap" | "correlation";
}

const initialAssets: Asset[] = [
    {
        id: "1",
        name: "Apple Inc.",
        symbol: "AAPL",
        allocation: 25,
        value: 125000,
        sector: "Technology",
        risk: 0.15,
        return: 0.12,
        color: "#0EA5E9",
        change: 2.4,
        volume: 89234567,
    },
    {
        id: "2",
        name: "Microsoft Corp.",
        symbol: "MSFT",
        allocation: 20,
        value: 100000,
        sector: "Technology",
        risk: 0.14,
        return: 0.11,
        color: "#3B82F6",
        change: 1.8,
        volume: 67891234,
    },
    {
        id: "3",
        name: "Amazon.com Inc.",
        symbol: "AMZN",
        allocation: 15,
        value: 75000,
        sector: "Consumer Discretionary",
        risk: 0.18,
        return: 0.14,
        color: "#10B981",
        change: -0.5,
        volume: 45678901,
    },
    {
        id: "4",
        name: "Tesla Inc.",
        symbol: "TSLA",
        allocation: 10,
        value: 50000,
        sector: "Consumer Discretionary",
        risk: 0.25,
        return: 0.18,
        color: "#F59E0B",
        change: 3.2,
        volume: 78901234,
    },
    {
        id: "5",
        name: "JPMorgan Chase",
        symbol: "JPM",
        allocation: 12,
        value: 60000,
        sector: "Financial Services",
        risk: 0.12,
        return: 0.09,
        color: "#8B5CF6",
        change: 0.9,
        volume: 34567890,
    },
    {
        id: "6",
        name: "Johnson & Johnson",
        symbol: "JNJ",
        allocation: 8,
        value: 40000,
        sector: "Healthcare",
        risk: 0.08,
        return: 0.07,
        color: "#EF4444",
        change: 0.3,
        volume: 23456789,
    },
];

export default function PortfolioDashboard() {
    const [assets, setAssets] = useState<Asset[]>(initialAssets);
    const [selectedView, setSelectedView] = useState<"treemap" | "heatmap" | "correlation">("treemap");
    const [draggedAsset, setDraggedAsset] = useState<Asset | null>(null);
    const [preferences, setPreferences] = useState<UserPreferences>({
        theme: "dark",
        layout: "grid",
        defaultView: "treemap",
    });
    const [zoomLevel, setZoomLevel] = useState(1);
    const [touchStart, setTouchStart] = useState<{ x: number; y: number; distance?: number } | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const savedPreferences = localStorage.getItem("portfolio-preferences");
        if (savedPreferences) {
            setPreferences(JSON.parse(savedPreferences));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("portfolio-preferences", JSON.stringify(preferences));
    }, [preferences]);

    const toggleTheme = useCallback(() => {
        setPreferences((prev) => ({
            ...prev,
            theme: prev.theme === "dark" ? "light" : "dark",
        }));
    }, []);

    const isDark = preferences.theme === "dark";

    const themeClasses = {
        background: isDark
            ? "bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950"
            : "bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50",
        cardBg: isDark ? "bg-slate-900/60 backdrop-blur-xl border-slate-700/30" : "bg-white/80 backdrop-blur-xl border-gray-200/50",
        headerBg: isDark ? "bg-slate-900/80 backdrop-blur-xl border-slate-700/30" : "bg-white/90 backdrop-blur-xl border-gray-200/30",
        text: {
            primary: isDark ? "text-white" : "text-gray-900",
            secondary: isDark ? "text-slate-300" : "text-gray-600",
            tertiary: isDark ? "text-slate-400" : "text-gray-500",
        },
        button: {
            primary: "bg-blue-600 text-white hover:bg-blue-700",
            secondary: isDark
                ? "text-slate-300 hover:text-white hover:bg-slate-800/50"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50",
            icon: isDark
                ? "bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50"
                : "bg-gray-100/50 text-gray-500 hover:text-gray-900 hover:bg-gray-200/50",
        },
        chart: {
            grid: isDark ? "#475569" : "#D1D5DB",
            axis: isDark ? "#94A3B8" : "#6B7280",
            tooltip: isDark ? "rgba(15, 23, 42, 0.95)" : "rgba(255, 255, 255, 0.95)",
            tooltipBorder: isDark ? "rgba(71, 85, 105, 0.3)" : "rgba(209, 213, 219, 0.5)",
            tooltipText: isDark ? "#ffffff" : "#000000",
        },
    };

    const sectors = useMemo(() => {
        const sectorMap = new Map<string, Sector>();
        assets.forEach((asset) => {
            if (!sectorMap.has(asset.sector)) {
                sectorMap.set(asset.sector, {
                    name: asset.sector,
                    allocation: 0,
                    color: asset.color,
                    assets: [],
                    performance: 0,
                });
            }
            const sector = sectorMap.get(asset.sector)!;
            sector.allocation += asset.allocation;
            sector.assets.push(asset);
            sector.performance += asset.change * (asset.allocation / 100);
        });
        return Array.from(sectorMap.values());
    }, [assets]);

    const riskMatrixData = useMemo(() => {
        const matrix = [];
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                const asset = assets[Math.floor(Math.random() * assets.length)];
                matrix.push({
                    x: i,
                    y: j,
                    risk: (i + 1) * 0.05 + (j + 1) * 0.02,
                    return: (j + 1) * 0.03 + Math.random() * 0.05,
                    symbol: asset?.symbol || `A${i}${j}`,
                    color: asset?.color || "#3B82F6",
                });
            }
        }
        return matrix;
    }, [assets]);

    const totalValue = useMemo(() => assets.reduce((sum, asset) => sum + asset.value, 0), [assets]);
    const totalReturn = useMemo(() => assets.reduce((sum, asset) => sum + asset.change * (asset.allocation / 100), 0), [assets]);

    const handleAllocationChange = useCallback((assetId: string, newAllocation: number) => {
        setAssets((prev) =>
            prev.map((asset) => (asset.id === assetId ? { ...asset, allocation: newAllocation, value: newAllocation * 5000 } : asset))
        );
    }, []);

    const handleDragStart = useCallback((e: React.DragEvent, asset: Asset) => {
        setDraggedAsset(asset);
        e.dataTransfer.effectAllowed = "move";
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent, targetSector: string) => {
            e.preventDefault();
            if (draggedAsset && draggedAsset.sector !== targetSector) {
                setAssets((prev) => prev.map((asset) => (asset.id === draggedAsset.id ? { ...asset, sector: targetSector } : asset)));
            }
            setDraggedAsset(null);
        },
        [draggedAsset]
    );

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        if (e.touches.length === 1) {
            setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
        } else if (e.touches.length === 2) {
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const distance = Math.sqrt(Math.pow(touch2.clientX - touch1.clientX, 2) + Math.pow(touch2.clientY - touch1.clientY, 2));
            setTouchStart({ x: touch1.clientX, y: touch1.clientY, distance });
        }
    }, []);

    const handleTouchMove = useCallback(
        (e: React.TouchEvent) => {
            if (e.touches.length === 2 && touchStart?.distance) {
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                const distance = Math.sqrt(Math.pow(touch2.clientX - touch1.clientX, 2) + Math.pow(touch2.clientY - touch1.clientY, 2));
                const scale = distance / touchStart.distance;
                setZoomLevel((prev) => Math.max(0.5, Math.min(3, prev * scale)));
            }
        },
        [touchStart]
    );

    const correlationData = useMemo(() => {
        const correlations = [];
        let index = 1;
        
        for (let i = 0; i < assets.length; i++) {
            for (let j = i + 1; j < assets.length; j++) {
                const asset1 = assets[i];
                const asset2 = assets[j];
                
                let correlation = 0.3;
                
                if (asset1.sector === asset2.sector) {
                    correlation += 0.3;
                }
                
                const riskDiff = Math.abs(asset1.risk - asset2.risk);
                correlation += Math.max(0, 0.2 - riskDiff * 2);
                
                const changeDiff = Math.abs(asset1.change - asset2.change);
                correlation += Math.max(0, 0.15 - changeDiff * 0.05);
                
                const allocationFactor = Math.min(asset1.allocation, asset2.allocation) / 25;
                correlation += allocationFactor * 0.1;
                
                correlation = Math.max(0.1, Math.min(0.95, correlation));
                
                correlations.push({
                    asset1: asset1.symbol,
                    asset2: asset2.symbol,
                    correlation: Number(correlation.toFixed(2)),
                    x: index,
                    y: correlation,
                });
                
                index++;
            }
        }
        
        return correlations;
    }, [assets]);

    const TreemapView = () => (
        <div className="h-full w-full overflow-hidden p-2 sm:p-4">
            <div
                style={{
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: "top left",
                    width: `${100 / zoomLevel}%`,
                    height: `${100 / zoomLevel}%`,
                }}
            >
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1 sm:gap-2 h-full auto-rows-fr">
                    {assets.map((asset, index) => {
                        const size = Math.max(1, Math.floor(asset.allocation / 15));
                        const colSpan = window.innerWidth < 640 ? 1 : size > 2 ? 2 : 1;
                        const rowSpan = size > 1 ? 2 : 1;

                        return (
                            <div
                                key={asset.id}
                                className="rounded-lg flex flex-col items-center justify-center text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg border border-white/20 p-1 sm:p-2"
                                style={{
                                    backgroundColor: asset.color,
                                    gridColumn: `span ${colSpan}`,
                                    gridRow: `span ${rowSpan}`,
                                    minHeight: "40px",
                                    aspectRatio: window.innerWidth < 640 ? "1" : "auto",
                                }}
                            >
                                <span className="text-xs sm:text-sm font-bold mb-1">{asset.symbol}</span>
                                <span className="text-xs">{asset.allocation}%</span>
                                <span className={`text-xs ${asset.change >= 0 ? "text-green-200" : "text-red-200"}`}>
                                    {asset.change >= 0 ? "+" : ""}
                                    {asset.change}%
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );

    const RiskMatrixView = () => (
        <div className="h-full w-full overflow-auto p-2 sm:p-4">
            <div
                className="w-full h-full flex items-center justify-center"
                style={{
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: "center",
                    minWidth: "280px",
                    minHeight: "280px",
                }}
            >
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-1 sm:gap-2 w-full max-w-sm sm:max-w-md lg:max-w-lg">
                    {riskMatrixData.slice(0, window.innerWidth < 640 ? 9 : window.innerWidth < 1024 ? 16 : 25).map((cell, index) => (
                        <div
                            key={index}
                            className="aspect-square rounded-lg flex flex-col items-center justify-center text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg border border-white/20 text-center"
                            style={{
                                background: `linear-gradient(135deg, ${
                                    cell.risk > 0.15
                                        ? "rgba(239, 68, 68, 0.8)"
                                        : cell.risk > 0.1
                                        ? "rgba(245, 158, 11, 0.8)"
                                        : "rgba(16, 185, 129, 0.8)"
                                }, ${
                                    cell.risk > 0.15
                                        ? "rgba(185, 28, 28, 0.9)"
                                        : cell.risk > 0.1
                                        ? "rgba(217, 119, 6, 0.9)"
                                        : "rgba(5, 150, 105, 0.9)"
                                })`,
                                minHeight: "50px",
                            }}
                        >
                            <span className="text-xs font-bold">{cell.symbol}</span>
                            <span className="text-xs">{(cell.risk * 100).toFixed(1)}%</span>
                            <span className="text-xs opacity-80 hidden sm:block">{(cell.return * 100).toFixed(1)}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const CorrelationView = () => (
        <div className="h-full w-full overflow-hidden p-2 sm:p-4">
            <div className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart data={correlationData} margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={themeClasses.chart.grid} opacity={0.3} />
                        <XAxis
                            dataKey="x"
                            stroke={themeClasses.chart.axis}
                            style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}
                            tick={{ fontSize: 10 }}
                        />
                        <YAxis
                            stroke={themeClasses.chart.axis}
                            style={{ fontFamily: "Inter, sans-serif", fontSize: "10px" }}
                            domain={[0, 1]}
                            tick={{ fontSize: 10 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: themeClasses.chart.tooltip,
                                border: `1px solid ${themeClasses.chart.tooltipBorder}`,
                                borderRadius: "12px",
                                color: themeClasses.chart.tooltipText,
                                fontSize: "12px",
                                fontFamily: "Inter, sans-serif",
                            }}
                            labelStyle={{ 
                                color: themeClasses.chart.tooltipText,
                                fontFamily: "Inter, sans-serif",
                            }}
                            itemStyle={{ 
                                color: themeClasses.chart.tooltipText,
                                fontFamily: "Inter, sans-serif",
                            }}
                        />
                        <Scatter dataKey="correlation" fill="#3B82F6" r={window.innerWidth < 640 ? 4 : 8} />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </div>
    );

    return (
        <div
            className={`min-h-screen ${themeClasses.background} transition-colors duration-300`}
            style={{ fontFamily: "Inter, sans-serif" }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            ref={containerRef}
        >
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
            `}</style>

            <header className={`${themeClasses.headerBg} border-b sticky top-0 z-50 shadow-2xl transition-colors duration-300`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-14 sm:h-16">
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                                </svg>
                            </div>
                            <h1 className={`text-lg sm:text-xl font-bold ${themeClasses.text.primary}`}>Portfolio Analytics</h1>
                        </div>

                        <nav className="hidden md:flex items-center space-x-2">
                            {[
                                { key: "treemap", label: "Treemap" },
                                { key: "heatmap", label: "Risk Matrix" },
                                { key: "correlation", label: "Correlation" },
                            ].map((item) => (
                                <button
                                    key={item.key}
                                    onClick={() => setSelectedView(item.key as any)}
                                    className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm cursor-pointer ${
                                        selectedView === item.key ? themeClasses.button.primary : themeClasses.button.secondary
                                    }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </nav>

                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <button
                                onClick={toggleTheme}
                                className={`w-8 h-8 sm:w-10 sm:h-10 ${themeClasses.button.icon} rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer`}
                            >
                                {isDark ? (
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                )}
                            </button>

                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className={`md:hidden w-8 h-8 ${themeClasses.button.icon} rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>

                            <div className="hidden sm:block text-right">
                                <div className={`text-sm sm:text-lg font-bold ${themeClasses.text.primary}`}>
                                    ${totalValue.toLocaleString()}
                                </div>
                                <div className={`text-xs sm:text-sm ${totalReturn >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                                    {totalReturn >= 0 ? "+" : ""}
                                    {totalReturn.toFixed(2)}%
                                </div>
                            </div>
                        </div>
                    </div>

                    {mobileMenuOpen && (
                        <div className="md:hidden py-4 border-t border-opacity-30">
                            <div className="flex flex-col space-y-2">
                                {[
                                    { key: "treemap", label: "Treemap" },
                                    { key: "heatmap", label: "Risk Matrix" },
                                    { key: "correlation", label: "Correlation" },
                                ].map((item) => (
                                    <button
                                        key={item.key}
                                        onClick={() => {
                                            setSelectedView(item.key as any);
                                            setMobileMenuOpen(false);
                                        }}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 text-left ${
                                            selectedView === item.key ? themeClasses.button.primary : themeClasses.button.secondary
                                        }`}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                            <div className="mt-4 pt-4 border-t border-opacity-30">
                                <div className={`text-lg font-bold ${themeClasses.text.primary}`}>${totalValue.toLocaleString()}</div>
                                <div className={`text-sm ${totalReturn >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                                    {totalReturn >= 0 ? "+" : ""}
                                    {totalReturn.toFixed(2)}% today
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
                    <div className="lg:col-span-3">
                        <div className={`${themeClasses.cardBg} rounded-xl p-4 sm:p-6 border shadow-xl h-80 sm:h-96`}>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
                                <h2 className={`text-lg font-semibold ${themeClasses.text.primary}`}>
                                    {selectedView === "treemap" && "Portfolio Treemap"}
                                    {selectedView === "heatmap" && "Risk Matrix Heatmap"}
                                    {selectedView === "correlation" && "Asset Correlations"}
                                </h2>
                                <div className="flex items-center space-x-2">
                                    <span className={`text-sm ${themeClasses.text.secondary}`}>Zoom: {(zoomLevel * 100).toFixed(0)}%</span>
                                    <button
                                        onClick={() => setZoomLevel((prev) => Math.max(0.5, prev - 0.1))}
                                        className={`px-2 py-1 ${themeClasses.button.icon} rounded text-xs`}
                                    >
                                        -
                                    </button>
                                    <button
                                        onClick={() => setZoomLevel((prev) => Math.min(3, prev + 0.1))}
                                        className={`px-2 py-1 ${themeClasses.button.icon} rounded text-xs`}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <div className="h-64 sm:h-80">
                                {selectedView === "treemap" && <TreemapView />}
                                {selectedView === "heatmap" && <RiskMatrixView />}
                                {selectedView === "correlation" && <CorrelationView />}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className={`${themeClasses.cardBg} rounded-xl p-4 border shadow-xl`}>
                            <h3 className={`text-md font-semibold ${themeClasses.text.primary} mb-4`}>Allocation</h3>
                            <ResponsiveContainer width="100%" height={180}>
                                <PieChart>
                                    <Pie
                                        data={sectors}
                                        dataKey="allocation"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={60}
                                        innerRadius={25}
                                    >
                                        {sectors.map((sector, index) => (
                                            <Cell key={`cell-${index}`} fill={sector.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: themeClasses.chart.tooltip,
                                            border: `1px solid ${themeClasses.chart.tooltipBorder}`,
                                            borderRadius: "8px",
                                            color: themeClasses.chart.tooltipText,
                                        }}
                                        labelStyle={{ color: themeClasses.chart.tooltipText }}
                                        itemStyle={{ color: themeClasses.chart.tooltipText }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="grid grid-cols-2 gap-2 sm:gap-4">
                            <div className={`${themeClasses.cardBg} rounded-xl p-3 sm:p-4 border shadow-xl`}>
                                <div className={`text-xs ${themeClasses.text.tertiary}`}>Return</div>
                                <div className="text-lg font-bold text-emerald-500">+12.4%</div>
                            </div>
                            <div className={`${themeClasses.cardBg} rounded-xl p-3 sm:p-4 border shadow-xl`}>
                                <div className={`text-xs ${themeClasses.text.tertiary}`}>Sharpe</div>
                                <div className="text-lg font-bold text-blue-500">1.85</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`${themeClasses.cardBg} rounded-xl border shadow-xl overflow-hidden`}>
                    <div className="p-4 sm:p-6 border-b border-opacity-30">
                        <h2 className={`text-lg font-semibold ${themeClasses.text.primary} mb-4`}>Drag-to-Rebalance Assets</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {sectors.map((sector) => (
                                <div
                                    key={sector.name}
                                    className={`${themeClasses.cardBg} rounded-lg p-4 border min-h-32`}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, sector.name)}
                                >
                                    <h3 className={`font-semibold ${themeClasses.text.primary} mb-2 text-sm sm:text-base`}>
                                        {sector.name}
                                    </h3>
                                    <div className="space-y-2">
                                        {sector.assets.map((asset) => (
                                            <div
                                                key={asset.id}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, asset)}
                                                className={`p-2 rounded cursor-move transition-all duration-200 ${
                                                    isDark ? "bg-slate-700/50 hover:bg-slate-600/50" : "bg-gray-100/50 hover:bg-gray-200/50"
                                                }`}
                                                style={{ borderLeft: `3px solid ${asset.color}` }}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span className={`text-sm ${themeClasses.text.primary}`}>{asset.symbol}</span>
                                                    <span className={`text-xs ${themeClasses.text.secondary}`}>{asset.allocation}%</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 sm:p-6">
                        <h3 className={`font-semibold ${themeClasses.text.primary} mb-4`}>Allocation Sliders</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {assets.map((asset) => (
                                <div key={asset.id} className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className={`text-sm ${themeClasses.text.primary}`}>{asset.symbol}</span>
                                        <span className={`text-sm ${themeClasses.text.secondary}`}>{asset.allocation}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="50"
                                        value={asset.allocation}
                                        onChange={(e) => handleAllocationChange(asset.id, Number.parseInt(e.target.value))}
                                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                                        style={{
                                            background: `linear-gradient(to right, ${asset.color} 0%, ${asset.color} ${
                                                asset.allocation * 2
                                            }%, ${isDark ? "#334155" : "#E5E7EB"} ${asset.allocation * 2}%, ${
                                                isDark ? "#334155" : "#E5E7EB"
                                            } 100%)`,
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <footer className={`${themeClasses.headerBg} border-t mt-8 sm:mt-16 transition-colors duration-300`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        <div className="col-span-1 sm:col-span-2">
                            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                                    </svg>
                                </div>
                                <span className={`${themeClasses.text.primary} font-bold text-lg`}>Portfolio Analytics</span>
                            </div>
                            <p className={`${themeClasses.text.tertiary} mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base max-w-md`}>
                                Enterprise-grade portfolio management platform with advanced analytics, risk assessment, and real-time
                                market insights for professional investors.
                            </p>
                            <div className="flex space-x-4">
                                {[
                                    "https://cdn-icons-png.flaticon.com/512/733/733547.png",
                                    "https://cdn-icons-png.flaticon.com/512/733/733579.png",
                                    "https://cdn-icons-png.flaticon.com/512/733/733561.png",
                                ].map((icon, index) => (
                                    <div
                                        key={index}
                                        className={`w-8 h-8 sm:w-10 sm:h-10 ${themeClasses.button.icon} rounded-lg flex items-center justify-center transition-colors cursor-pointer`}
                                    >
                                        <img
                                            src={icon || "/placeholder.svg"}
                                            alt="Social"
                                            className="w-4 h-4 sm:w-5 sm:h-5 opacity-60 hover:opacity-100 transition-opacity"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className={`${themeClasses.text.primary} font-semibold mb-4 tracking-tight text-sm sm:text-base`}>
                                Platform
                            </h3>
                            <ul className={`space-y-2 sm:space-y-3 ${themeClasses.text.tertiary} text-sm`}>
                                <li className="hover:text-blue-500 transition-colors cursor-pointer">Real-time Analytics</li>
                                <li className="hover:text-blue-500 transition-colors cursor-pointer">Risk Management</li>
                                <li className="hover:text-blue-500 transition-colors cursor-pointer">Portfolio Optimization</li>
                                <li className="hover:text-blue-500 transition-colors cursor-pointer">Performance Tracking</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className={`${themeClasses.text.primary} font-semibold mb-4 tracking-tight text-sm sm:text-base`}>
                                Support
                            </h3>
                            <ul className={`space-y-2 sm:space-y-3 ${themeClasses.text.tertiary} text-sm`}>
                                <li className="hover:text-blue-500 transition-colors cursor-pointer">Documentation</li>
                                <li className="hover:text-blue-500 transition-colors cursor-pointer">API Reference</li>
                                <li className="hover:text-blue-500 transition-colors cursor-pointer">Contact Support</li>
                                <li className="hover:text-blue-500 transition-colors cursor-pointer">Security & Privacy</li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-opacity-30 mt-8 sm:mt-12 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                        <p className={`${themeClasses.text.tertiary} text-sm text-center sm:text-left`}>
                            © 2024 Portfolio Analytics. All rights reserved.
                        </p>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6">
                            <span
                                className={`${themeClasses.text.tertiary} text-sm hover:text-blue-500 transition-colors cursor-pointer text-center`}
                            >
                                Privacy Policy
                            </span>
                            <span
                                className={`${themeClasses.text.tertiary} text-sm hover:text-blue-500 transition-colors cursor-pointer text-center`}
                            >
                                Terms of Service
                            </span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
