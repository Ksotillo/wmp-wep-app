"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

import { Play, RotateCcw, Sun, Moon, Bot, TrendingUp, MoveHorizontal, Timer, X, Info } from "lucide-react";
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip } from "recharts";

const GlobalThemeStyles = () => (
    <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap');

        :root {
            --font-heading: 'Montserrat', sans-serif; /* Updated */
            --font-body: 'Roboto', sans-serif; /* Updated */

            --page-bg: #e9e3f6;
            --card-bg: #ffffff;
            --card-border: #dcd7e9;
            --text-primary: #12161c;
            --text-secondary: #4a4e56;
            --text-disabled: #9fa3a9;
            --accent-primary: #78b0df;
            --accent-primary-hover: #4998e0;
            --accent-secondary: #abd3f9;

            --button-primary-bg: var(--accent-primary);
            --button-primary-text: #ffffff;
            --button-primary-hover-bg: var(--accent-primary-hover);

            --button-secondary-bg: var(--card-bg);
            --button-secondary-text: var(--text-secondary);
            --button-secondary-border: var(--card-border);
            --button-secondary-hover-bg: #f7f5fa;

            --input-bg: #ffffff;
            --input-border: var(--card-border);
            --input-focus-ring: var(--accent-primary);
            --input-placeholder: var(--text-disabled);

            --slider-track-bg: #d1d5db;
            --slider-track-active-bg: var(--accent-primary);
            --slider-thumb-bg: var(--accent-primary);
            --slider-thumb-hover-bg: var(--accent-primary-hover);
            --slider-thumb-border: #ffffff;

            --shadow-card: 0 4px 12px rgba(0, 0, 0, 0.05);
            --shadow-card-hover: 0 6px 16px rgba(0, 0, 0, 0.08);

            --scrollbar-thumb: #c0b8d3;
            --scrollbar-track: #dcd7e9;
        }

        html.dark {
            --page-bg: #12161c;
            --card-bg: #1c2128;
            --card-border: #2d333b;
            --text-primary: #e9e3f6;
            --text-secondary: #b0b8c0;
            --text-disabled: #6a7077;
            --accent-primary: #78b0df;
            --accent-primary-hover: #abd3f9;
            --accent-secondary: #4998e0;

            --button-primary-bg: var(--accent-primary);
            --button-primary-text: #12161c;
            --button-primary-hover-bg: var(--accent-primary-hover);

            --button-secondary-bg: var(--card-bg);
            --button-secondary-text: var(--text-secondary);
            --button-secondary-border: var(--card-border);
            --button-secondary-hover-bg: #2d333b;

            --input-bg: #2d333b;
            --input-border: #3e454e;
            --input-focus-ring: var(--accent-primary);
            --input-placeholder: var(--text-disabled);

            --slider-track-bg: #4b5563;
            --slider-track-active-bg: var(--accent-primary);
            --slider-thumb-bg: var(--accent-primary);
            --slider-thumb-hover-bg: var(--accent-primary-hover);
            --slider-thumb-border: var(--card-bg);

            --shadow-card: 0 4px 12px rgba(0, 0, 0, 0.15);
            --shadow-card-hover: 0 6px 16px rgba(0, 0, 0, 0.2);

            --scrollbar-thumb: #4998e0;
            --scrollbar-track: #2d333b;
        }

        body {
            background-color: var(--page-bg);
            color: var(--text-primary);
            font-family: var(--font-body);
            transition: background-color 0.3s ease, color 0.3s ease;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
            font-family: var(--font-heading);
            color: var(--text-primary);
            font-weight: 600;
        }

        ::-webkit-scrollbar {
            width: 10px;
            height: 10px;
        }
        ::-webkit-scrollbar-track {
            background: var(--scrollbar-track);
            border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb {
            background: var(--scrollbar-thumb);
            border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: var(--accent-primary-hover);
        }

        @keyframes modal-pop-in {
            0% {
                opacity: 0;
                transform: scale(0.95) translateY(10px);
            }
            100% {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }
        .animate-modal-pop-in {
            animation: modal-pop-in 0.2s ease-out forwards;
        }

        @keyframes textGradientAnimation {
            0% {
                background-position: 0% 50%;
            }
            50% {
                background-position: 100% 50%;
            }
            100% {
                background-position: 0% 50%;
            }
        }

        .animated-gradient-text {
            background-image: linear-gradient(
                90deg,
                var(--accent-primary),
                var(--accent-secondary),
                var(--accent-primary-hover),
                var(--accent-secondary),
                var(--accent-primary)
            );
            background-size: 250% auto;
            background-clip: text;
            -webkit-background-clip: text;
            color: transparent;
            animation: textGradientAnimation 12s ease-in-out infinite;
            display: inline-block;
        }

        /* Custom Native Range Slider Styles */
        .custom-range-slider {
            -webkit-appearance: none;
            appearance: none;
            width: 100%;
            height: 6px; /* Matching Radix track height */
            background: var(--slider-track-bg);
            border-radius: 9999px; /* Fully rounded track */
            outline: none;
            cursor: pointer;
            accent-color: var(--slider-track-active-bg); /* For the active part of the track */
            transition: opacity 0.2s ease;
        }

        .custom-range-slider:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        /* Thumb styling for WebKit (Chrome, Safari, Edge) */
        .custom-range-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px; /* Matching Radix thumb width */
            height: 20px; /* Matching Radix thumb height */
            background: var(--slider-thumb-bg);
            border-radius: 9999px; /* Fully rounded thumb */
            border: 2px solid var(--slider-thumb-border);
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            cursor: pointer;
            margin-top: -2px; /* Adjusted to shift thumb up slightly for better vertical centering on 6px track */
            transition: background-color 0.2s ease;
        }
        .custom-range-slider:not(:disabled)::-webkit-slider-thumb:hover {
            background: var(--slider-thumb-hover-bg);
        }
        .custom-range-slider:not(:disabled):focus::-webkit-slider-thumb {
            box-shadow: 0 0 0 3px var(--card-bg), 0 0 0 5px var(--accent-primary); /* Focus ring similar to Radix */
        }

        /* Thumb styling for Firefox */
        .custom-range-slider::-moz-range-thumb {
            width: 20px;
            height: 20px;
            background: var(--slider-thumb-bg);
            border-radius: 9999px;
            border: 2px solid var(--slider-thumb-border);
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            cursor: pointer;
            transition: background-color 0.2s ease;
        }
        .custom-range-slider:not(:disabled)::-moz-range-thumb:hover {
            background: var(--slider-thumb-hover-bg);
        }
        .custom-range-slider:not(:disabled):focus::-moz-range-thumb { 
            box-shadow: 0 0 0 3px var(--card-bg), 0 0 0 5px var(--accent-primary); /* Focus ring for FF */
        }
        
        /* Track styling for Firefox */
        .custom-range-slider::-moz-range-track {
            width: 100%;
            height: 6px;
            background: var(--slider-track-bg); /* Base track color (unfilled part, to the right of the thumb) */
            border-radius: 9999px;
            cursor: pointer;
            border: none; /* Ensure no extra borders interfere */
        }

        /* Progress (filled part) styling for Firefox */
        .custom-range-slider::-moz-range-progress {
            height: 6px;
            background: var(--slider-track-active-bg); /* Filled part color (to the left of the thumb) */
            border-radius: 9999px;
        }
    `}</style>
);

type Point = { x: number; y: number; time: number };
type SimulationData = {
    path: Point[];
    maxHeight: number;
    range: number;
    timeOfFlight: number;
    peakPoint?: Point | null;
};

const ParameterTooltip = ({ text, children }: { text: string; children: React.ReactNode }) => {
    const [isVisible, setIsVisible] = useState(false);
    let timeoutId: NodeJS.Timeout | null = null;

    const showTooltip = () => {
        if (timeoutId) clearTimeout(timeoutId);
        setIsVisible(true);
    };

    const hideTooltip = (isImmediate = false) => {
        if (isImmediate) {
            setIsVisible(false);
            if (timeoutId) clearTimeout(timeoutId);
        } else {
            timeoutId = setTimeout(() => {
                setIsVisible(false);
            }, 200);
        }
    };

    const handleIconFocus = () => showTooltip();
    const handleIconBlur = () => hideTooltip(true);
    const handleTooltipInteractionEnter = () => showTooltip();
    const handleTooltipInteractionLeave = () => hideTooltip();

    return (
        <span
            className="relative inline-flex items-center ml-1.5"
            onMouseEnter={showTooltip}
            onMouseLeave={() => hideTooltip()}
            onFocus={handleIconFocus}
            onBlur={handleIconBlur}
            tabIndex={0}
            role="tooltip"
            aria-describedby={isVisible ? `tooltip-${text.substring(0, 10).replace(/\s/g, "-")}` : undefined}
        >
            {children}
            {isVisible && (
                <div
                    id={`tooltip-${text.substring(0, 10).replace(/\s/g, "-")}`}
                    role="status"
                    className="absolute bottom-full right-0 mb-2 w-max max-w-xs p-2.5 
                     bg-[var(--card-bg)] text-[var(--text-secondary)] text-xs 
                     rounded-md shadow-lg border border-[var(--card-border)] z-50 
                     transition-opacity duration-150 ease-in-out opacity-100 pointer-events-auto"
                    onMouseEnter={handleTooltipInteractionEnter}
                    onMouseLeave={handleTooltipInteractionLeave}
                >
                    {text}
                </div>
            )}
        </span>
    );
};

const ControlInput = React.memo(
    ({
        label,
        id,
        value,
        unit,
        min,
        max,
        step,
        onChange,
        disabled,
        tooltipText,
    }: {
        label: string;
        id: string;
        value: number;
        unit: string;
        min: number;
        max: number;
        step: number;
        onChange: (val: number) => void;
        disabled: boolean;
        tooltipText?: string;
    }) => {
        let precision = 0;
        if (id === "gravity") {
            precision = 1;
        } else if (id === "airResistance") {
            precision = 2;
        } else if (step < 1) {
            precision = step.toString().split(".")[1]?.length || 1;
        }

        return (
            <div className="space-y-3">
                <div className="flex justify-between items-center w-full">
                    <label htmlFor={id} className="text-sm font-medium text-[var(--text-secondary)]">
                        {label}
                        <span className="text-[var(--accent-primary)] font-semibold ml-1">({value.toFixed(precision)} {unit})</span>
                        </label>
                        {tooltipText && (
                            <ParameterTooltip text={tooltipText}>
                                <Info size={14} className="text-[var(--text-disabled)] hover:text-[var(--accent-primary)] cursor-help" />
                            </ParameterTooltip>
                        )}
                </div>
                <input
                    type="range"
                    id={id}
                    value={value}
                    min={min}
                    max={max}
                    step={step}
                    disabled={disabled}
                    onChange={(e) => onChange(parseFloat(e.target.value))}
                    className="custom-range-slider w-full h-5 appearance-none bg-transparent focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed group"
                />
            </div>
        );
    }
);
ControlInput.displayName = "ControlInput";

const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        let title = "Point Data";
        let details: string[] = [];
        let dataToDisplay: Point | null = null;
        let identifiedSeriesName = "";

        const maxHeightPoint = payload.find((p: any) => p.name === "Max Height");
        const currentPositionPoint = payload.find((p: any) => p.name === "Current Position");

        if (maxHeightPoint && maxHeightPoint.payload) {
            dataToDisplay = maxHeightPoint.payload;
            identifiedSeriesName = "Max Height";
            title = "✨ Maximum Altitude Achieved! ✨";
        } else if (currentPositionPoint && currentPositionPoint.payload) {
            dataToDisplay = currentPositionPoint.payload;
            identifiedSeriesName = "Current Position";
            title = "Current Position";
        } else if (payload[0] && payload[0].payload) {
            dataToDisplay = payload[0].payload;
            identifiedSeriesName = payload[0].name || "Trajectory Point";
            if (identifiedSeriesName === "Projectile Path" || identifiedSeriesName === "Trajectory Point") {
                title = "Trajectory Point";
            } else {
                title = `Data: ${identifiedSeriesName}`;
            }
        }

        if (!dataToDisplay) {
            return (
                <div className="p-3 md:p-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl shadow-[var(--shadow-card)] text-[var(--text-primary)] opacity-95">
                    <p className="font-semibold text-md text-[var(--accent-primary)]">Error</p>
                    <p className="text-sm text-[var(--text-secondary)]">Tooltip data not available.</p>
                </div>
            );
        }

        if (typeof dataToDisplay.y === "number") {
            details.push(`Height: ${dataToDisplay.y.toFixed(1)} m`);
        } else {
            details.push("Height: N/A");
        }
        if (typeof dataToDisplay.x === "number") {
            details.push(`Distance: ${dataToDisplay.x.toFixed(1)} m`);
        } else {
            details.push("Distance: N/A");
        }
        if (typeof dataToDisplay.time === "number") {
            details.push(`Time: ${dataToDisplay.time.toFixed(1)} s`);
        } else {
            details.push("Time: N/A");
        }

        return (
            <div
                className="p-3 md:p-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl shadow-[var(--shadow-card)] text-[var(--text-primary)] opacity-95 transition-opacity duration-200"
                style={{ fontFamily: "var(--font-body)" }}
            >
                <p className="font-semibold text-md mb-1.5 text-[var(--accent-primary)]">{title}</p>
                <div className="space-y-1 text-sm">
                    {details.length > 0 ? (
                        details.map((detail, index) => (
                            <p key={index} className="text-[var(--text-secondary)]">
                                {detail}
                            </p>
                        ))
                    ) : (
                        <p className="text-[var(--text-disabled)]">No details to display.</p>
                    )}
                </div>
            </div>
        );
    }
    return null;
};

const InfoModal = ({
    isOpen,
    onClose,
    title,
    children,
}: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity duration-300 ease-out"
            onClick={onClose}
        >
            <div
                className="bg-[var(--card-bg)] text-[var(--text-primary)] rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden border border-[var(--card-border)] animate-modal-pop-in"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex items-center justify-between p-5 border-b border-[var(--card-border)] shrink-0">
                    <h3 className="text-xl font-semibold font-[var(--font-heading)] text-[var(--text-primary)]">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full hover:bg-[var(--button-secondary-hover-bg)] text-[var(--text-secondary)] transition-colors duration-150 cursor-pointer hover:text-[var(--accent-primary)]"
                        title="Close modal"
                    >
                        <X size={22} />
                    </button>
                </header>
                <div className="p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--scrollbar-thumb)] scrollbar-track-[var(--scrollbar-track)] space-y-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

function ProjectileMotionSimulatorPage() {
    const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("dark");
    const [isClientMounted, setIsClientMounted] = useState(false);
    const [isHowToUseModalOpen, setHowToUseModalOpen] = useState(false);
    const [isFaqsModalOpen, setFaqsModalOpen] = useState(false);

    const [initialVelocity, configureLaunchSpeed] = useState(50);
    const [launchAngle, adjustLaunchElevation] = useState(45);
    const [gravity, setGravityConstant] = useState(9.81);
    const [airResistanceCoefficient, setAirResistanceCoefficient] = useState(0.05);
    const [isAirResistanceEnabled, setIsAirResistanceEnabled] = useState(false);

    const [simulationResults, storeSimulationOutput] = useState<SimulationData | null>(null);
    const [isSimulating, setSimulationState] = useState(false);
    const simulationStateRef = useRef(isSimulating);
    const [currentPath, updateCurrentPath] = useState<Point[]>([]);

    const animationFrameId = useRef<number | null>(null);
    const lastTimestampRef = useRef<number | null>(null);
    const currentVxRef = useRef(0);
    const currentVyRef = useRef(0);
    const currentPeakPointRef = useRef<Point | null>(null);

    useEffect(() => {
        setIsClientMounted(true);
        const storedTheme = localStorage.getItem("projectile-lab-theme") as "light" | "dark" | null;
        const initialTheme = storedTheme || "dark";
        setCurrentTheme(initialTheme);
        if (initialTheme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, []);
    useEffect(() => {
        simulationStateRef.current = isSimulating;
    }, [isSimulating]);

    const performThemeToggle = useCallback(() => {
        setCurrentTheme(prevTheme => {
            const newTheme = prevTheme === "dark" ? "light" : "dark";
            localStorage.setItem("projectile-lab-theme", newTheme);
            if (newTheme === "dark") {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
            return newTheme;
        });
    }, []);

    const startNewSimulation = useCallback(() => {
        if (simulationStateRef.current) return;

        setSimulationState(true);
        updateCurrentPath([{ x: 0, y: 0, time: 0 }]);
        storeSimulationOutput(null);
        lastTimestampRef.current = null;
        currentPeakPointRef.current = { x: 0, y: 0, time: 0 };

        const angleRad = (launchAngle * Math.PI) / 180;
        const v0x = initialVelocity * Math.cos(angleRad);
        const v0y = initialVelocity * Math.sin(angleRad);

        currentVxRef.current = v0x;
        currentVyRef.current = v0y;

        let currentTime = 0;
        let localPath: Point[] = [{ x: 0, y: 0, time: 0 }];
        let maxHeightCalc = 0;

        function animateStep(timestamp: number) {
            if (!simulationStateRef.current) {
                if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
                animationFrameId.current = null;
                return;
            }
            if (lastTimestampRef.current === null) {
                lastTimestampRef.current = timestamp;
                animationFrameId.current = requestAnimationFrame(animateStep);
                return;
            }

            const deltaTime = (timestamp - lastTimestampRef.current) / 1000;
            lastTimestampRef.current = timestamp;

            const prevPoint = localPath[localPath.length - 1];
            currentTime = prevPoint.time + deltaTime;

            let ax = 0;
            let ay = -gravity;

            if (isAirResistanceEnabled && airResistanceCoefficient > 0) {
                ax -= airResistanceCoefficient * currentVxRef.current;
                ay -= airResistanceCoefficient * currentVyRef.current;
            }

            const nextVx = currentVxRef.current + ax * deltaTime;
            const nextVy = currentVyRef.current + ay * deltaTime;

            let currentX = prevPoint.x + currentVxRef.current * deltaTime;
            let currentY = prevPoint.y + currentVyRef.current * deltaTime;

            currentVxRef.current = nextVx;
            currentVyRef.current = nextVy;

            if (currentY > maxHeightCalc) {
                maxHeightCalc = currentY;
                currentPeakPointRef.current = { x: currentX, y: currentY, time: currentTime };
            }

            if (prevPoint.y >= 0 && currentY < 0 && gravity > 0) {
                const fraction = prevPoint.y / (prevPoint.y - currentY);
                const dtToGround = fraction * deltaTime;

                const impactTime = prevPoint.time + dtToGround;

                const impactX = prevPoint.x + (currentVxRef.current - ax * deltaTime) * dtToGround;

                localPath.push({ x: impactX, y: 0, time: impactTime });
                updateCurrentPath([...localPath]);
                storeSimulationOutput({
                    path: [...localPath],
                    maxHeight: maxHeightCalc,
                    range: impactX,
                    timeOfFlight: impactTime,
                    peakPoint: currentPeakPointRef.current,
                });
                setSimulationState(false);
                if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
                animationFrameId.current = null;
                return;
            } else if (gravity <= 0 && currentTime > 20) {
                localPath.push({ x: currentX, y: currentY, time: currentTime });
                updateCurrentPath([...localPath]);
                storeSimulationOutput({
                    path: [...localPath],
                    maxHeight: maxHeightCalc,
                    range: currentX,
                    timeOfFlight: currentTime,
                    peakPoint: currentPeakPointRef.current,
                });
                setSimulationState(false);
                if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
                animationFrameId.current = null;
                return;
            }

            localPath.push({ x: currentX, y: currentY, time: currentTime });
            updateCurrentPath([...localPath]);

            if (simulationStateRef.current) {
                animationFrameId.current = requestAnimationFrame(animateStep);
            }
        }
        animationFrameId.current = requestAnimationFrame(animateStep);
    }, [initialVelocity, launchAngle, gravity, isAirResistanceEnabled, airResistanceCoefficient]);

    const resetCurrentSimulation = useCallback(() => {
        if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
            animationFrameId.current = null;
        }
        setSimulationState(false);
        updateCurrentPath([]);
        storeSimulationOutput(null);
        lastTimestampRef.current = null;
    }, []);

    useEffect(() => {
        return () => {
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        };
    }, []);

    if (!isClientMounted) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-[var(--page-bg)]">
                <p className="text-xl text-[var(--text-secondary)] font-[var(--font-heading)] animate-pulse">Loading Simulator...</p>
            </div>
        );
    }

    return (
        <div
            className={`flex flex-col lg:flex-row lg:h-screen lg:overflow-hidden w-full bg-[var(--page-bg)] text-[var(--text-primary)] font-[var(--font-body)] selection:bg-[var(--accent-primary)] selection:text-white`}
        >
            <div className="w-full lg:w-[380px] lg:min-w-[380px] flex-shrink-0 bg-[var(--card-bg)] shadow-[var(--shadow-card)] lg:border-r border-[var(--card-border)] flex flex-col">
                <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--scrollbar-thumb)] scrollbar-track-[var(--scrollbar-track)] p-6 md:p-8">
                    <header className="bg-[var(--card-bg)] shadow-[var(--shadow-card)] lg:shadow-none  mb-10  lg:col-start-1 lg:row-start-1 flex justify-between items-center">
                        <h1 className="text-3xl font-bold flex items-center">
                            <Bot size={32} className="mr-3 text-[var(--accent-primary)]" />
                            <span className="animated-gradient-text">Projectile Lab</span>
                        </h1>
                        <button
                            onClick={performThemeToggle}
                            className="p-2.5 rounded-full hover:bg-[var(--button-secondary-hover-bg)] text-[var(--text-secondary)] transition-all duration-200 cursor-pointer hover:text-[var(--accent-primary)]"
                            title="Toggle Theme"
                        >
                            {currentTheme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
                        </button>
                    </header>

                    <section className="space-y-6">
                        <div className="flex justify-between items-center border-b border-[var(--card-border)] pb-3">
                            <h2 className="text-xl font-semibold text-[var(--text-primary)]">Parameters</h2>
                            <button
                                onClick={() => setHowToUseModalOpen(true)}
                                className="p-1.5 rounded-full hover:bg-[var(--button-secondary-hover-bg)] text-[var(--text-secondary)] transition-colors duration-150 cursor-pointer hover:text-[var(--accent-primary)]"
                                title="How to use the simulator"
                            >
                                <Info size={20} />
                            </button>
                        </div>
                        <ControlInput
                            label="Initial Velocity"
                            id="velocity"
                            value={initialVelocity}
                            unit="m/s"
                            min={1}
                            max={100}
                            step={1}
                            onChange={configureLaunchSpeed}
                            disabled={isSimulating}
                            tooltipText="Sets the speed (magnitude of initial velocity) at which the projectile is launched from the cannon."
                        />
                        <ControlInput
                            label="Launch Angle"
                            id="angle"
                            value={launchAngle}
                            unit="°"
                            min={0}
                            max={90}
                            step={1}
                            onChange={adjustLaunchElevation}
                            disabled={isSimulating}
                            tooltipText="Determines the angle, relative to the horizontal ground, at which the projectile is fired."
                        />
                        <ControlInput
                            label="Gravity"
                            id="gravity"
                            value={gravity}
                            unit="m/s²"
                            min={0}
                            max={20}
                            step={0.1}
                            onChange={setGravityConstant}
                            disabled={isSimulating}
                            tooltipText="Adjusts the constant acceleration due to gravity acting downwards on the projectile."
                        />
                        <ControlInput
                            label="Air Resistance Coeff."
                            id="airResistance"
                            value={airResistanceCoefficient}
                            unit=""
                            min={0}
                            max={0.5}
                            step={0.005}
                            onChange={setAirResistanceCoefficient}
                            disabled={isSimulating || !isAirResistanceEnabled}
                            tooltipText="Controls the magnitude of the air resistance force. Higher values mean more drag."
                        />
                        <div className="flex items-center space-x-2.5 pt-1 select-none">
                            <input
                                type="checkbox"
                                id="airResistanceToggle"
                                checked={isAirResistanceEnabled}
                                onChange={(e) => setIsAirResistanceEnabled(e.target.checked)}
                                disabled={isSimulating}
                                className="h-4 w-4 rounded border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--accent-primary)] accent-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2 focus:ring-offset-[var(--card-bg)] cursor-pointer disabled:opacity-50"
                            />
                            <label
                                htmlFor="airResistanceToggle"
                                className="text-sm font-medium text-[var(--text-secondary)] cursor-pointer"
                            >
                                Enable Air Resistance
                            </label>
                        </div>
                    </section>

                    <section className="flex space-x-4 pt-4">
                        <button
                            onClick={startNewSimulation}
                            disabled={isSimulating}
                            className="flex-1 flex items-center justify-center space-x-2.5 px-5 py-3.5 rounded-xl bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] font-semibold text-lg hover:bg-[var(--button-primary-hover-bg)] transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-primary-hover)] focus:ring-offset-[var(--page-bg)] shadow-md hover:shadow-lg transform active:scale-95"
                        >
                            <Play size={22} />
                            <span>{isSimulating ? "Simulating..." : "Launch"}</span>
                        </button>
                        <button
                            onClick={resetCurrentSimulation}
                            className="px-5 py-3.5 rounded-xl bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)] border border-[var(--button-secondary-border)] font-semibold text-lg hover:bg-[var(--button-secondary-hover-bg)] hover:border-[var(--accent-primary)] transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-primary)] focus:ring-offset-[var(--page-bg)] shadow-md hover:shadow-lg transform active:scale-95"
                        >
                            <RotateCcw size={20} />
                        </button>
                    </section>

                    {simulationResults && (
                        <section className="mt-5 space-y-4 pt-6 border-t border-[var(--card-border)]">
                            <h2 className="text-xl font-semibold text-[var(--text-primary)]">Results</h2>
                            <div className="text-md space-y-3 p-5 bg-[var(--page-bg)] rounded-xl border border-[var(--card-border)] shadow-inner">
                                <p className="flex items-center text-[var(--text-secondary)]">
                                    <TrendingUp size={18} className="mr-2.5 text-[var(--accent-primary)] shrink-0" />
                                    Max Height:{" "}
                                    <span className="ml-1 font-bold text-[var(--text-primary)]">
                                        {simulationResults.maxHeight.toFixed(1)} m
                                    </span>
                                </p>
                                <p className="flex items-center text-[var(--text-secondary)]">
                                    <MoveHorizontal size={18} className="mr-2.5 text-[var(--accent-primary)] shrink-0" />
                                    Range:{" "}
                                    <span className="ml-1 font-bold text-[var(--text-primary)]">
                                        {simulationResults.range.toFixed(1)} m
                                    </span>
                                </p>
                                <p className="flex items-center text-[var(--text-secondary)]">
                                    <Timer size={18} className="mr-2.5 text-[var(--accent-primary)] shrink-0" />
                                    Time of Flight:{" "}
                                    <span className="ml-1 font-bold text-[var(--text-primary)]">
                                        {simulationResults.timeOfFlight.toFixed(1)} s
                                    </span>
                                </p>
                            </div>
                        </section>
                    )}
                </div>
            </div>

            <main className="flex-1 flex flex-col lg:h-screen lg:overflow-y-auto p-4 md:p-8 bg-[var(--page-bg)]">
                <div className="w-full flex-grow bg-[var(--card-bg)] rounded-2xl shadow-[var(--shadow-card)] p-4 md:p-6 relative">
                    {isClientMounted ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 30, bottom: 50, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={currentTheme === "dark" ? "#2d333b" : "#e0e2e5"} />
                                <XAxis
                                    type="number"
                                    dataKey="x"
                                    name="Distance"
                                    unit="m"
                                    domain={[
                                        0,
                                        (dataMax: number) =>
                                            Math.max(dataMax + 20, simulationResults?.range ? simulationResults.range + 20 : 100),
                                    ]}
                                    allowDataOverflow={true}
                                    label={{
                                        value: "Distance (m)",
                                        position: "insideBottom",
                                        dy: 25,
                                        fill: "var(--text-secondary)",
                                        fontSize: 14,
                                        fontWeight: 500,
                                    }}
                                    stroke="var(--text-secondary)"
                                    tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
                                    axisLine={{ stroke: "var(--text-secondary)" }}
                                    tickLine={{ stroke: "var(--text-secondary)" }}
                                    tickFormatter={(value: number) => value.toFixed(1)}
                                />
                                <YAxis
                                    type="number"
                                    dataKey="y"
                                    name="Height"
                                    unit="m"
                                    domain={[
                                        0,
                                        (dataMax: number) =>
                                            Math.max(dataMax + 20, simulationResults?.maxHeight ? simulationResults.maxHeight + 20 : 50),
                                    ]}
                                    allowDataOverflow={true}
                                    label={{
                                        value: "Height (m)",
                                        angle: -90,
                                        position: "insideLeft",
                                        dx: -10,
                                        fill: "var(--text-secondary)",
                                        fontSize: 14,
                                        fontWeight: 500,
                                    }}
                                    stroke="var(--text-secondary)"
                                    tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
                                    axisLine={{ stroke: "var(--text-secondary)" }}
                                    tickLine={{ stroke: "var(--text-secondary)" }}
                                    tickFormatter={(value: number) => value.toFixed(1)}
                                />
                                <ZAxis type="number" dataKey="time" name="Time" unit="s" range={[0, 500]} />
                                <Tooltip
                                    cursor={{ strokeDasharray: "3 3", stroke: "var(--accent-primary)" }}
                                    content={<CustomChartTooltip />}
                                />
                                <Scatter
                                    name="Projectile Path"
                                    data={currentPath}
                                    fill="var(--accent-primary)"
                                    shape="circle"
                                    line={{ stroke: "var(--accent-secondary)", strokeWidth: 2.5 }}
                                />
                                {currentPath.length > 1 && (
                                    <Scatter
                                        name="Current Position"
                                        data={[currentPath[currentPath.length - 1]]}
                                        fill="var(--accent-primary)"
                                        shape="star"
                                        legendType="none"
                                    />
                                )}
                                {simulationResults?.peakPoint && (
                                    <Scatter
                                        name="Max Height"
                                        data={[simulationResults.peakPoint]}
                                        fill="var(--accent-primary-hover)"
                                        stroke="var(--card-bg)"
                                        strokeWidth={3.5}
                                        shape="diamond"
                                        legendType="none"
                                    />
                                )}
                            </ScatterChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-[var(--text-secondary)]">Loading Chart...</div>
                    )}

                    <div
                        className="absolute w-24 h-16 transition-transform duration-200 pointer-events-none"
                        style={{
                            left: `calc(45px - 16px)`,
                            bottom: `calc(60px - 8px)`,
                            transform: `rotate(${-launchAngle + 90}deg)`,
                        }}
                    >
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-4 rounded-t-sm bg-[var(--text-secondary)] shadow-md">
                            <div className="w-full h-1/2 bg-[var(--accent-primary-hover)] opacity-30 rounded-t-sm"></div>
                        </div>

                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-6 h-5 rounded-sm bg-[var(--text-secondary)] opacity-80 shadow-sm"></div>

                        <div
                            className="absolute bottom-[12px] left-1/2 -translate-x-[calc(50%-0px)] w-5 h-12 bg-gradient-to-t from-[var(--accent-secondary)] to-[var(--accent-primary-hover)] rounded-t-md shadow-lg border-x-2 border-t-2 border-[var(--accent-primary-hover)] opacity-90"
                            style={{ boxShadow: "inset 0px 2px 2px rgba(255,255,255,0.2), inset 0px -2px 2px rgba(0,0,0,0.2)" }}
                        >
                            <div className="absolute -top-[2px] left-1/2 -translate-x-1/2 w-[22px] h-[6px] bg-[var(--accent-primary)] rounded-sm border-x border-t border-[var(--accent-primary-hover)]"></div>

                            <div className="absolute top-1 left-[3px] w-1 h-8 bg-white opacity-25 rounded-full"></div>
                  </div>
              </div>
           </div>

                <footer className="w-full mt-16 shrink-0 pt-6 pb-4 border-t border-[var(--card-border)] text-sm text-[var(--text-secondary)]">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6 text-center md:text-left">
                            <div className="space-y-2">
                                <h4 className="font-semibold text-md text-[var(--text-primary)] mb-2">Help & Support</h4>
                                <a
                                    onClick={() => setHowToUseModalOpen(true)}
                                    className="block hover:text-[var(--accent-primary)] transition-colors duration-150 cursor-pointer"
                                >
                                    How to Use
                                </a>
                                <a
                                    onClick={() => setFaqsModalOpen(true)}
                                    className="block hover:text-[var(--accent-primary)] transition-colors duration-150 cursor-pointer"
                                >
                                    FAQs
                                </a>
                                <a
                                    href="mailto:labsupport@example.com?subject=Projectile Lab Inquiry"
                                    className="block hover:text-[var(--accent-primary)] transition-colors duration-150 cursor-pointer"
                                >
                                    Report an Issue
                                </a>
      </div> 

                            <div className="space-y-2">
                                <h4 className="font-semibold text-md text-[var(--text-primary)] mb-2">Learn More</h4>
                                <a
                                    href="https://www.khanacademy.org/science/physics/two-dimensional-motion/two-dimensional-projectile-mot"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block hover:text-[var(--accent-primary)] transition-colors duration-150 cursor-pointer"
                                >
                                    Khan Academy: Projectile Motion
                                </a>
                                <a
                                    href="https://en.wikipedia.org/wiki/Projectile_motion"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block hover:text-[var(--accent-primary)] transition-colors duration-150 cursor-pointer"
                                >
                                    Wikipedia: Projectile Motion
                                </a>
                                <a
                                    href="https://www.physicsclassroom.com/class/vectors/Lesson-2/What-is-a-Projectile"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block hover:text-[var(--accent-primary)] transition-colors duration-150 cursor-pointer"
                                >
                                    The Physics Classroom
                                </a>
        </div>

                            <div className="space-y-2">
                                <h4 className="font-semibold text-md text-[var(--text-primary)] mb-2">About Projectile Lab</h4>
                                <p className="text-xs">Version 1.0.0</p>
                                <p className="text-xs">
                                    Simulate and learn about
                                    <br />
                                    projectile trajectories.
                                </p>
                </div>
           </div>
                        <div className="text-center text-xs text-[var(--text-disabled)] pt-6 border-t border-[var(--card-border)] opacity-75">
                            &copy; {new Date().getFullYear()} Projectile Simulators. All Rights Reserved. Built for educational purposes.
              </div>
          </div> 
                </footer>
            </main>
            <InfoModal isOpen={isHowToUseModalOpen} onClose={() => setHowToUseModalOpen(false)} title="How to Use Projectile Lab">
                <h5 className="text-lg font-semibold text-[var(--text-primary)]">Welcome!</h5>
                <p className="text-[var(--text-secondary)]">This simulator allows you to explore the concepts of projectile motion.</p>
                <ul className="list-disc list-inside space-y-2 text-[var(--text-secondary)] pl-2">
                    <li>
                        <strong>Parameters Panel (Left):</strong> Adjust the sliders for Initial Velocity, Launch Angle, and Gravity.
                    </li>
                    <li>
                        <strong>Air Resistance:</strong> Toggle the checkbox to enable or disable air resistance, and use the slider to set
                        its coefficient.
                    </li>
                    <li>
                        <strong>Launch:</strong> Press the "Launch" button to see the projectile in motion.
                    </li>
                    <li>
                        <strong>Reset:</strong> Use the circular arrow button to clear the current simulation.
                    </li>
                    <li>
                        <strong>Visualization (Right):</strong> The chart displays the projectile's path. Hover over points for details.
                    </li>
                    <li>
                        <strong>Theme:</strong> Use the Sun/Moon icon at the top left to toggle between light and dark modes.
                    </li>
                </ul>
                <p className="text-[var(--text-secondary)] pt-2">Experiment with different values to see how they affect the trajectory!</p>
            </InfoModal>

            <InfoModal isOpen={isFaqsModalOpen} onClose={() => setFaqsModalOpen(false)} title="Frequently Asked Questions (FAQs)">
                <div className="space-y-3">
                    <div>
                        <h5 className="font-medium text-[var(--text-primary)]">What is projectile motion?</h5>
                        <p className="text-sm text-[var(--text-secondary)] pl-2">
                            Projectile motion is the motion of an object thrown or projected into the air, subject only to acceleration as a
                            result of gravity (and air resistance, if considered).
                        </p>
                    </div>
                    <div>
                        <h5 className="font-medium text-[var(--text-primary)]">How does launch angle affect the range?</h5>
                        <p className="text-sm text-[var(--text-secondary)] pl-2">
                            For a given initial velocity (and ignoring air resistance), the maximum range is typically achieved with a
                            launch angle of 45 degrees. Angles smaller or larger than 45 degrees will result in a shorter range.
                        </p>
                    </div>
                    <div>
                        <h5 className="font-medium text-[var(--text-primary)]">How does air resistance change the trajectory?</h5>
                        <p className="text-sm text-[var(--text-secondary)] pl-2">
                            Air resistance opposes the motion of the projectile. It generally reduces the maximum height and range of the
                            projectile, and makes the trajectory less symmetrical than the ideal parabolic path.
                        </p>
                    </div>
                    <div>
                        <h5 className="font-medium text-[var(--text-primary)]">Can I see multiple paths on the chart?</h5>
                        <p className="text-sm text-[var(--text-secondary)] pl-2">
                            Currently, this feature is not implemented, but it's a great idea for future enhancements!
                        </p>
                    </div>
                </div>
            </InfoModal>
        </div>
    );
}

export default function App() {
    return (
        <> 
            <GlobalThemeStyles />
            <ProjectileMotionSimulatorPage />
        </>
    );
}
