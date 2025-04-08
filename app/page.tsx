"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { XCircle, RefreshCw, Trophy, Home, Clock, Droplets, Thermometer } from "lucide-react";
import { Satisfy, Montserrat } from "next/font/google";

const satisfy = Satisfy({ weight: "400", subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"] });

// Temperature calculation constants
const MIN_TEMP = 0;
const MAX_TEMP = 100;
const COMFORT_ZONE_WIDTH = 8;

interface WaterDropProps {
    index: number;
    isHot: boolean;
}

interface BubbleProps {
    index: number;
}

interface SteamProps {
    index: number;
}

interface CelebrationBubbleProps {
    index: number;
    total: number;
    isGameOver?: boolean;
}

interface IceParticleProps {
    index: number;
}

const WaterDrop = ({ index, isHot }: WaterDropProps) => {
    const left = 40 + Math.sin(index * 0.5) * 20;
    const delay = index * 0.2;
    const size = 0.8 + (index % 5) * 0.1;
    const opacity = 0.6 + (index % 4) * 0.1;

    return (
        <div
            className="absolute rounded-full"
            style={{
                left: `${left}%`,
                width: `${size * 10}px`,
                height: `${size * 15}px`,
                opacity,
                background: isHot
                    ? "radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9), rgba(255, 180, 180, 0.8))"
                    : "radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9), rgba(180, 220, 255, 0.8))",
                boxShadow: isHot ? "0 0 10px rgba(255, 100, 100, 0.5)" : "0 0 10px rgba(100, 150, 255, 0.5)",
                animation: `waterDrop 1.5s infinite`,
                animationDelay: `${delay}s`,
            }}
        />
    );
};

const Bubble = ({ index }: BubbleProps) => {
    const left = 30 + (index % 4) * 10;
    const delay = index * 0.3 + (index % 5) * 0.1;
    const size = 0.5 + (index % 3) * 0.5;
    const duration = 2 + (index % 4) * 0.5;

    return (
        <div
            className="absolute rounded-full"
            style={{
                left: `${left}%`,
                bottom: "0",
                width: `${size * 10}px`,
                height: `${size * 10}px`,
                background: "radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.2))",
                boxShadow: "0 0 5px rgba(255, 255, 255, 0.3)",
                animation: `bubbleRise ${duration}s infinite`,
                animationDelay: `${delay}s`,
            }}
        />
    );
};

const Steam = ({ index }: SteamProps) => {
    const left = 35 + (index % 6) * 5;
    const delay = index * 0.2;
    const size = 1 + (index % 3) * 0.5;
    const duration = 2 + (index % 5) * 0.2;

    return (
        <div
            className="absolute rounded-full"
            style={{
                left: `${left}%`,
                top: "10%",
                width: `${size * 10}px`,
                height: `${size * 10}px`,
                background: "radial-gradient(circle at center, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0))",
                animation: `steamRise ${duration}s infinite`,
                animationDelay: `${delay}s`,
            }}
        />
    );
};

const CelebrationBubble = ({ index, total, isGameOver = false }: CelebrationBubbleProps & { isGameOver?: boolean }) => {
    // Faster animation for game over screen
    const animationDuration = isGameOver 
        ? 1.5 + Math.random() * 2  // 1.5-3.5s for game over screen
        : 3 + Math.random() * 4;   // 3-7s for in-game celebration
    
    const delay = isGameOver
        ? Math.random() * 0.8      // 0-0.8s delay for game over screen
        : Math.random() * 2;       // 0-2s delay for in-game celebration
    
    const size = 10 + Math.random() * 30;
    const left = (index / total) * 100 + (Math.random() * 10 - 5);
    
    // Create a variety of colors for the bubbles
    const colors = [
        "rgba(34, 211, 238, 0.8)", // cyan
        "rgba(34, 197, 94, 0.8)",  // green
        "rgba(168, 85, 247, 0.8)",  // purple
        "rgba(59, 130, 246, 0.8)",  // blue
        "rgba(249, 115, 22, 0.8)",  // orange
        "rgba(236, 72, 153, 0.8)",  // pink
    ];
    
    const colorIndex = index % colors.length;
    const color = colors[colorIndex];
    
    // Different paths for different bubbles
    const horizontalMovement = Math.random() * 60 - 30; // -30px to +30px
    
    return (
        <div
            className="celebration-bubble"
            style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                bottom: `-${size}px`,
                background: `radial-gradient(circle at 30% 30%, ${color.replace('0.8', '0.9')}, ${color.replace('0.8', '0.3')})`,
                animationDuration: `${animationDuration}s`,
                animationDelay: `${delay}s`,
                animationTimingFunction: "cubic-bezier(0.1, 0.8, 0.8, 1)",
                transform: `translateX(0)`,
                opacity: 0
            }}
            onAnimationStart={(e) => {
                // Add a bit of horizontal drift using CSS transform
                const keyframes = [
                    { transform: `translateX(0) translateY(0) scale(0.5)`, opacity: 0 },
                    { transform: `translateX(0) translateY(0) scale(0.7)`, opacity: 1, offset: 0.1 },
                    { transform: `translateX(${horizontalMovement}px) translateY(-${window.innerHeight/2}px) scale(1.0)`, opacity: 0.7, offset: 0.7 },
                    { transform: `translateX(${horizontalMovement*1.5}px) translateY(-${window.innerHeight}px) scale(1.2) rotate(${Math.random() * 360}deg)`, opacity: 0 }
                ];
                
                e.currentTarget.animate(keyframes, {
                    duration: animationDuration * 1000,
                    delay: delay * 1000,
                    fill: "forwards"
                });
            }}
        />
    );
};

const IntenseSteam = ({ index }: SteamProps) => {
    const left = 25 + (index % 8) * 7;
    const delay = index * 0.15;
    const size = 1.5 + (index % 4) * 0.7;
    const duration = 1.8 + (index % 3) * 0.4;

    return (
        <div
            className="absolute rounded-full"
            style={{
                left: `${left}%`,
                top: "-5%",
                width: `${size * 12}px`,
                height: `${size * 12}px`,
                background: "radial-gradient(circle at center, rgba(255, 200, 200, 0.9), rgba(255, 180, 180, 0))",
                animation: `steamRise ${duration}s infinite`,
                animationDelay: `${delay}s`,
                filter: "blur(2px)",
                zIndex: 5
            }}
        />
    );
};

const IceParticle = ({ index }: IceParticleProps) => {
    const left = 20 + (index % 10) * 6;
    const delay = index * 0.2;
    const size = 1 + (index % 5) * 0.4;
    const duration = 2 + (index % 4) * 0.5;
    const opacity = 0.7 + (index % 3) * 0.1;

    // Choose between different ice shapes
    const shapes = [
        "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)", // diamond
        "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)", // hexagon
        "polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)" // octagon
    ];
    const shape = shapes[index % shapes.length];

    return (
        <div
            className="absolute"
            style={{
                left: `${left}%`,
                top: "10%",
                width: `${size * 10}px`,
                height: `${size * 10}px`,
                background: `radial-gradient(circle at center, rgba(210, 240, 255, ${opacity}), rgba(180, 220, 255, ${opacity * 0.6}))`,
                boxShadow: `0 0 8px rgba(140, 210, 255, ${opacity})`,
                animation: `iceFall ${duration}s infinite`,
                animationDelay: `${delay}s`,
                clipPath: shape,
                transform: `rotate(${index * 45}deg)`,
                zIndex: 5
            }}
        />
    );
};

const ShowerGame = () => {
    const [gameState, setGameState] = useState<"title" | "playing" | "gameOver">("title");
    const [hotValue, setHotValue] = useState(20);
    const [coldValue, setColdValue] = useState(20);
    const [isMounted, setIsMounted] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [activeKnob, setActiveKnob] = useState<"hot" | "cold" | null>(null);

    const coldKnobRef = useRef<HTMLDivElement>(null);
    const hotKnobRef = useRef<HTMLDivElement>(null);

    const [backgroundParticles, setBackgroundParticles] = useState<
        Array<{
            width: number;
            height: number;
            top: number;
            left: number;
            opacity: number;
            animation: string;
            delay: number;
        }>
    >([]);

    const [temperature, setTemperature] = useState(50);
    const [targetTemp, setTargetTemp] = useState(50);
    const [comfortZoneMin, setComfortZoneMin] = useState(0);
    const [comfortZoneMax, setComfortZoneMax] = useState(0);
    const [inComfortZone, setInComfortZone] = useState(false);
    const [targetFound, setTargetFound] = useState(false);
    const [timer, setTimer] = useState(0);
    const [bestTime, setBestTime] = useState<number | null>(null);
    const [showInstructions, setShowInstructions] = useState<boolean>(false);
    const [startTime, setStartTime] = useState(0);
    const [waterVisible, setWaterVisible] = useState(false);
    const [bubblesVisible, setBubblesVisible] = useState(false);
    const [steamVisible, setSteamVisible] = useState(false);
    const [gameMessage, setGameMessage] = useState("");
    const [showCelebration, setShowCelebration] = useState(false);
    const [extremeHotVisible, setExtremeHotVisible] = useState(false);
    const [extremeColdVisible, setExtremeColdVisible] = useState(false);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const celebrationTimeoutRefs = useRef<NodeJS.Timeout[]>([]);

    const clearTimeouts = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        celebrationTimeoutRefs.current.forEach((timeout) => clearTimeout(timeout));
        celebrationTimeoutRefs.current = [];
    }, []);

    useEffect(() => {
        const savedBestTime = localStorage.getItem("showerGameBestTime");
        if (savedBestTime) {
            setBestTime(parseInt(savedBestTime, 10));
        }
    }, []);

    useEffect(() => {
        setIsMounted(true);

        const particles = Array.from({ length: 20 }).map((_, i) => ({
            width: 1 + (i % 3) * 1,
            height: 1 + (i % 4) * 0.75,
            top: (i * 5) % 100,
            left: (i * 7) % 100,
            opacity: 0.2 + (i % 5) * 0.05,
            animation: `pulse ${2 + (i % 3) * 1}s infinite alternate ease-in-out`,
            delay: (i * 0.1) % 2,
        }));

        setBackgroundParticles(particles);
    }, []);

    const calculateAngle = useCallback((clientX: number, clientY: number, knobRef: React.RefObject<HTMLDivElement | null>) => {
        if (!knobRef.current) return null;

        const knobRect = knobRef.current.getBoundingClientRect();
        const knobCenterX = knobRect.left + knobRect.width / 2;
        const knobCenterY = knobRect.top + knobRect.height / 2;

        const deltaX = clientX - knobCenterX;
        const deltaY = clientY - knobCenterY;

        // Calculate angle in degrees (0 is at the top, clockwise rotation)
        let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        
        // Adjust angle to start from top (0 degrees) and go clockwise
        angle = (angle + 90) % 360;
        if (angle < 0) angle += 360;
        
        // Map the angle to a value between 0 and 100
        // This allows for a full 360-degree rotation
        const mappedValue = (angle / 360) * 100;
        
        return Math.min(100, Math.max(0, mappedValue));
    }, []);

    const handleMouseDown = useCallback((e: React.MouseEvent, knob: "hot" | "cold") => {
        e.preventDefault();
        setIsDragging(true);
        setActiveKnob(knob);
    }, []);

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!isDragging || !activeKnob) return;

            const knobRef = activeKnob === "hot" ? hotKnobRef : coldKnobRef;
            const newValue = calculateAngle(e.clientX, e.clientY, knobRef);

            if (newValue !== null) {
                if (activeKnob === "hot") {
                    setHotValue(newValue);
                } else {
                    setColdValue(newValue);
                }
            }
        },
        [isDragging, activeKnob, calculateAngle]
    );

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        setActiveKnob(null);
    }, []);

    useEffect(() => {
        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        } else {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    const calculateTemperature = useCallback((hot: number, cold: number): number => {
        const rawTemp = hot * 0.6 - cold * 0.3 + 50;
        return Math.max(MIN_TEMP, Math.min(MAX_TEMP, rawTemp));
    }, []);

    useEffect(() => {
        if (gameState === "playing" && !targetFound) {
            timerRef.current = setInterval(() => {
                const elapsedTime = Date.now() - startTime;
                setTimer(elapsedTime);

                // Game over if it takes too long (1 minute)
                if (elapsedTime > 60000) {
                    setGameState("gameOver");
                    clearTimeouts();
                }
            }, 100);
        } else {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [gameState, targetFound, startTime, clearTimeouts]);

    // Update temperature and check win condition
    useEffect(() => {
        if (gameState !== "playing") return;

        const newTemp = calculateTemperature(hotValue, coldValue);
        setTemperature(newTemp);

        const newInComfortZone = newTemp >= comfortZoneMin && newTemp <= comfortZoneMax;
        setInComfortZone(newInComfortZone);

        if (newInComfortZone) {
            setGameMessage("Perfect temperature!");
        } else if (newTemp > comfortZoneMax) {
            setGameMessage("Too hot!");
        } else if (newTemp < comfortZoneMin) {
            setGameMessage("Too cold!");
        } else if (Math.abs(newTemp - targetTemp) < 15) {
            setGameMessage("Getting close...");
        } else {
            setGameMessage("Adjust the temperature...");
        }

        // Update visibility of water effects
        setWaterVisible(hotValue > 5 || coldValue > 5);
        setBubblesVisible(hotValue > 30 || coldValue > 30);
        setSteamVisible(hotValue > 70 && coldValue < 30);
        
        // Add extreme temperature effects
        setExtremeHotVisible(newTemp >= 80);
        setExtremeColdVisible(newTemp <= 25);

        // Win condition
        if (newInComfortZone && !targetFound) {
            setTargetFound(true);
            clearTimeouts();
            setShowCelebration(true);

            const finalTime = Date.now() - startTime;
            setTimer(finalTime);

            if (bestTime === null || finalTime < bestTime) {
                setBestTime(finalTime);
                localStorage.setItem("showerGameBestTime", finalTime.toString());
            }

            const timeout = setTimeout(() => {
                setGameState("gameOver");
            }, 1500);

            celebrationTimeoutRefs.current.push(timeout);
        }
    }, [
        hotValue,
        coldValue,
        gameState,
        targetFound,
        calculateTemperature,
        comfortZoneMin,
        comfortZoneMax,
        clearTimeouts,
        startTime,
        bestTime,
        targetTemp,
    ]);

    const formatTime = useCallback((ms: number): string => {
        const seconds = Math.floor(ms / 1000);
        const tenths = Math.floor((ms % 1000) / 100);
        return `${seconds}.${tenths}s`;
    }, []);

    const getTemperatureColor = useCallback((temp: number): string => {
        if (temp <= 30) return "bg-blue-600";
        if (temp <= 45) return "bg-cyan-500";
        if (temp <= 55) return "bg-green-500";
        if (temp <= 70) return "bg-yellow-500";
        return "bg-rose-600";
    }, []);

    // Helper function to get a smooth color gradient for the temperature
    const getTemperatureGradient = useCallback((temp: number): string => {
        // Define color stops for the temperature scale
        const colorStops = [
            { temp: 0, color: { r: 37, g: 99, b: 235 } },    // blue-600
            { temp: 30, color: { r: 6, g: 182, b: 212 } },   // cyan-500
            { temp: 45, color: { r: 34, g: 197, b: 94 } },   // green-500
            { temp: 55, color: { r: 234, g: 179, b: 8 } },   // yellow-500
            { temp: 70, color: { r: 225, g: 29, b: 72 } },   // rose-600
            { temp: 100, color: { r: 190, g: 18, b: 60 } }   // rose-700
        ];
        
        // Find the two color stops that the current temperature falls between
        let lowerStop = colorStops[0];
        let upperStop = colorStops[colorStops.length - 1];
        
        for (let i = 0; i < colorStops.length - 1; i++) {
            if (temp >= colorStops[i].temp && temp <= colorStops[i + 1].temp) {
                lowerStop = colorStops[i];
                upperStop = colorStops[i + 1];
                break;
            }
        }
        
        // Calculate the percentage between the two color stops
        const range = upperStop.temp - lowerStop.temp;
        const percentage = range === 0 ? 0 : (temp - lowerStop.temp) / range;
        
        // Interpolate between the two colors
        const r = Math.round(lowerStop.color.r + percentage * (upperStop.color.r - lowerStop.color.r));
        const g = Math.round(lowerStop.color.g + percentage * (upperStop.color.g - lowerStop.color.g));
        const b = Math.round(lowerStop.color.b + percentage * (upperStop.color.b - lowerStop.color.b));
        
        // Create a slightly darker version for the gradient
        const darkerR = Math.max(0, r - 30);
        const darkerG = Math.max(0, g - 30);
        const darkerB = Math.max(0, b - 30);
        
        return `linear-gradient(135deg, rgb(${r}, ${g}, ${b}), rgb(${darkerR}, ${darkerG}, ${darkerB}))`;
    }, []);

    const startNewGame = useCallback(() => {
        clearTimeouts();

        const initialHot = 20;
        const initialCold = 20;
        const initialTemp = calculateTemperature(initialHot, initialCold);

        let newTarget;
        do {
            newTarget = Math.floor(Math.random() * 50) + 25;
        } while (Math.abs(newTarget - initialTemp) < 15);

        setGameState("playing");
        setHotValue(initialHot);
        setColdValue(initialCold);
        setTargetTemp(newTarget);
        setComfortZoneMin(newTarget - COMFORT_ZONE_WIDTH / 2);
        setComfortZoneMax(newTarget + COMFORT_ZONE_WIDTH / 2);
        setInComfortZone(false);
        setTargetFound(false);
        setShowCelebration(false);
        setGameMessage("Adjust the temperature...");

        const newStartTime = Date.now();
        setStartTime(newStartTime);
        setTimer(0);
    }, [clearTimeouts, calculateTemperature]);

    return (
        <div
            className={`fixed inset-0 w-full h-full ${montserrat.className} bg-gradient-to-b from-violet-900 via-indigo-900 to-blue-950 flex flex-col items-center justify-center overflow-hidden`}
        >
            {/* Global styles */}
            <style jsx global>{`
                @keyframes waterDrop {
                    0% {
                        transform: translateY(0) scale(1);
                        opacity: 0;
                    }
                    10% {
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(150px) scale(0.7);
                        opacity: 0;
                    }
                }

                @keyframes bubbleRise {
                    0% {
                        transform: translateY(0) scale(0.7);
                        opacity: 0;
                    }
                    20%,
                    80% {
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(-100px) scale(1.3) rotate(20deg);
                        opacity: 0;
                    }
                }

                @keyframes steamRise {
                    0% {
                        transform: translateY(0) scale(1);
                        opacity: 0;
                    }
                    20% {
                        opacity: 0.8;
                    }
                    100% {
                        transform: translateY(-60px) scale(2) rotate(10deg);
                        opacity: 0;
                    }
                }

                @keyframes iceFall {
                    0% {
                        transform: translateY(-20px) scale(0.5);
                        opacity: 0;
                    }
                    20% {
                        opacity: 0.9;
                    }
                    100% {
                        transform: translateY(60px) scale(0.8) rotate(180deg);
                        opacity: 0;
                    }
                }

                @keyframes pulse {
                    0%,
                    100% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.05);
                    }
                }

                @keyframes shimmer {
                    0% {
                        background-position: -200% 0;
                    }
                    100% {
                        background-position: 200% 0;
                    }
                }

                @keyframes float {
                    0%,
                    100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-8px);
                    }
                }

                @keyframes glow {
                    0%,
                    100% {
                        box-shadow: 0 0 10px rgba(255, 255, 255, 0.6);
                    }
                    50% {
                        box-shadow: 0 0 20px rgba(255, 255, 255, 0.9), 0 0 30px rgba(99, 102, 241, 0.8);
                    }
                }

                @keyframes bubbleConfetti {
                    0% {
                        transform: translateY(100vh) scale(0.5);
                        opacity: 0;
                    }
                    10% {
                        opacity: 1;
                    }
                    90% {
                        opacity: 0.7;
                    }
                    100% {
                        transform: translateY(-100px) scale(1.2) rotate(360deg);
                        opacity: 0;
                    }
                }

                .perfect-zone {
                    animation: glow 2s infinite ease-in-out;
                    box-shadow: 0 0 15px rgba(255, 255, 255, 0.7);
                }

                .celebration-bubble {
                    position: absolute;
                    border-radius: 50%;
                    pointer-events: none;
                    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5), inset 0 0 10px rgba(255, 255, 255, 0.5);
                    animation: bubbleConfetti forwards;
                }
            `}</style>

            <div className="absolute inset-0 bg-pattern opacity-20 pointer-events-none">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 30% 40%, rgba(255, 255, 255, 0.05) 0%, transparent 40%), radial-gradient(circle at 70% 60%, rgba(255, 255, 255, 0.05) 0%, transparent 40%)",
                    }}
                />
            </div>

            {isMounted && (
                <div className="absolute inset-0 pointer-events-none">
                    {backgroundParticles.map((particle, i) => (
                        <div
                            key={`particle-${i}`}
                            className="absolute rounded-full bg-white opacity-20"
                            style={{
                                width: particle.width + "px",
                                height: particle.height + "px",
                                top: particle.top + "%",
                                left: particle.left + "%",
                                animation: particle.animation,
                                animationDelay: `${particle.delay}s`,
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Main game content */}
            {gameState === "playing" && (
                <div className="w-full h-full flex flex-col items-center justify-center z-10 px-4">
                    <div className="w-full max-w-md flex flex-wrap justify-between items-center mb-2">
                        <h1 className={`text-2xl font-bold text-sky-300 ${satisfy.className} whitespace-nowrap mr-2`}>Shower Temperature Game</h1>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 bg-indigo-900/60 py-1 px-3 rounded-full min-w-[80px] justify-center">
                                <Clock className="w-4 h-4 text-indigo-300 flex-shrink-0" />
                                <span className="text-sm text-indigo-200 font-semibold">{formatTime(timer)}</span>
                            </div>

                            <div className="flex items-center gap-1 bg-amber-900/60 py-1 px-3 rounded-full min-w-[80px] justify-center">
                                <Trophy className="w-4 h-4 text-amber-300 flex-shrink-0" />
                                <span className="text-sm text-amber-200 font-semibold">{bestTime ? formatTime(bestTime) : "--"}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-indigo-950 rounded-2xl p-5 w-full max-w-md shadow-2xl">
                        <div className="relative mb-4">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-medium text-blue-300 flex items-center gap-1">
                                    <Droplets className="w-3 h-3" /> Cold
                                </span>
                                <span className="text-xs font-medium text-emerald-300 flex items-center gap-1">
                                    <Thermometer className="w-3 h-3" /> Perfect
                                </span>
                                <span className="text-xs font-medium text-rose-300 flex items-center gap-1">
                                    Hot <Droplets className="w-3 h-3" />
                                </span>
                            </div>

                            <div className="relative h-7 bg-indigo-900/50 rounded-full overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-emerald-500 to-rose-600 opacity-90" />

                                <div
                                    className={`absolute h-full ${inComfortZone ? "perfect-zone" : ""}`}
                                    style={{
                                        left: `${comfortZoneMin}%`,
                                        width: `${COMFORT_ZONE_WIDTH}%`,
                                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                                        border: "1px solid rgba(255, 255, 255, 0.3)",
                                    }}
                                />

                                <div
                                    className={`absolute h-full w-2 transition-all duration-300 ease-out ${getTemperatureColor(
                                        temperature
                                    )}`}
                                    style={{
                                        left: `${temperature}%`,
                                        transform: "translateX(-50%)",
                                        boxShadow: inComfortZone ? "0 0 10px rgba(255, 255, 255, 0.8)" : "none",
                                    }}
                                />
                            </div>

                            <div className="mt-1 flex justify-between px-1">
                                <span className="text-xs text-indigo-300">{Math.floor(MIN_TEMP)}°</span>
                                <span className="text-xs text-indigo-300">{Math.floor(MAX_TEMP)}°</span>
                            </div>

                            <div className="absolute left-1/2 transform -translate-x-1/2 top-full mb-4 z-10">
                                <span className="text-xs text-emerald-300 bg-indigo-950 px-2 py-1 rounded-full shadow-md">
                                    {Math.floor(targetTemp)}° Target
                                </span>
                            </div>
                        </div>

                        <div className="relative h-32 flex justify-center mb-4 mt-10">
                            <div className="absolute top-3 w-full flex justify-center">
                                <div 
                                    className={`w-36 h-8 bg-blue-400 rounded-t-lg flex justify-center items-end shadow-lg relative ${
                                        extremeHotVisible 
                                            ? "transition-all duration-300" 
                                            : extremeColdVisible 
                                            ? "transition-all duration-300" 
                                            : ""
                                    }`}
                                    style={{
                                        boxShadow: extremeHotVisible 
                                            ? "0 0 15px rgba(239, 68, 68, 0.7)" 
                                            : extremeColdVisible 
                                            ? "0 0 15px rgba(59, 130, 246, 0.7)" 
                                            : "0 5px 15px rgba(0, 0, 0, 0.2)"
                                    }}
                                >
                                    <div 
                                        className={`w-5 h-10 absolute -top-8 rounded-t-md shadow-md transition-colors duration-300 ${
                                            extremeHotVisible 
                                                ? "bg-red-500" 
                                                : extremeColdVisible 
                                                ? "bg-blue-600" 
                                                : "bg-blue-500"
                                        }`}
                                        style={{
                                            boxShadow: extremeHotVisible 
                                                ? "0 0 10px rgba(239, 68, 68, 0.5)" 
                                                : extremeColdVisible 
                                                ? "0 0 10px rgba(59, 130, 246, 0.5)" 
                                                : "none"
                                        }}
                                    />
                                    <div 
                                        className={`w-full h-5 flex justify-around items-center px-4 shadow-inner transition-colors duration-300 ${
                                            extremeHotVisible 
                                                ? "bg-red-500" 
                                                : extremeColdVisible 
                                                ? "bg-blue-600" 
                                                : "bg-blue-500"
                                        }`}
                                    >
                                        {Array.from({ length: 6 }).map((_, i) => (
                                            <div 
                                                key={i} 
                                                className={`w-1 h-1 rounded-full ${
                                                    extremeHotVisible 
                                                        ? "bg-red-800" 
                                                        : extremeColdVisible 
                                                        ? "bg-blue-900" 
                                                        : "bg-blue-800"
                                                }`} 
                                            />
                                        ))}
                                    </div>
                                    
                                    {extremeHotVisible && (
                                        <div className="absolute -bottom-1 left-0 right-0 h-1 flex justify-around">
                                            {Array.from({ length: 8 }).map((_, i) => (
                                                <div 
                                                    key={`hot-indicator-${i}`} 
                                                    className="w-1 h-1 bg-red-500 rounded-full animate-pulse" 
                                                    style={{ 
                                                        animationDelay: `${i * 0.1}s`,
                                                        boxShadow: "0 0 5px rgba(239, 68, 68, 0.8)"
                                                    }} 
                                                />
                                            ))}
                                        </div>
                                    )}
                                    
                                    {extremeColdVisible && (
                                        <div className="absolute -bottom-1 left-0 right-0 h-1 flex justify-around">
                                            {Array.from({ length: 8 }).map((_, i) => (
                                                <div 
                                                    key={`cold-indicator-${i}`} 
                                                    className="w-1 h-1 bg-blue-300 rounded-full animate-pulse" 
                                                    style={{ 
                                                        animationDelay: `${i * 0.1}s`,
                                                        boxShadow: "0 0 5px rgba(59, 130, 246, 0.8)"
                                                    }} 
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {isMounted && (
                                <div className="absolute top-8 w-36 h-full overflow-hidden pointer-events-none">
                                    {waterVisible && (
                                        <>
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <WaterDrop key={`drop-${i}`} index={i} isHot={hotValue > coldValue} />
                                            ))}

                                            {bubblesVisible &&
                                                Array.from({ length: 3 }).map((_, i) => <Bubble key={`bubble-${i}`} index={i} />)}

                                            {steamVisible &&
                                                Array.from({ length: 2 }).map((_, i) => <Steam key={`steam-${i}`} index={i} />)}
                                                
                                            {extremeHotVisible &&
                                                Array.from({ length: 6 }).map((_, i) => <IntenseSteam key={`intense-steam-${i}`} index={i} />)}
                                                
                                            {extremeColdVisible &&
                                                Array.from({ length: 8 }).map((_, i) => <IceParticle key={`ice-${i}`} index={i} />)}
                                        </>
                                    )}
                                </div>
                            )}

                            <div
                                className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-12 px-6 whitespace-nowrap rounded-xl text-center flex items-center justify-center ${
                                    inComfortZone
                                        ? "bg-emerald-600"
                                        : temperature > comfortZoneMax
                                        ? "bg-rose-600"
                                        : temperature < comfortZoneMin
                                        ? "bg-blue-600"
                                        : "bg-indigo-600"
                                }`}
                            >
                                <span className="text-white font-bold text-lg">{gameMessage}</span>
                                
                                {inComfortZone && (
                                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                        {Array.from({ length: 15 }).map((_, i) => (
                                            <CelebrationBubble key={`message-confetti-${i}`} index={i} total={15} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-between gap-4 mt-2">
                            <div className="flex flex-col items-center">
                                <span className="text-xs font-semibold text-blue-300 mb-1">COLD</span>
                                <div
                                    ref={coldKnobRef}
                                    className="relative w-28 h-28 cursor-pointer shadow-lg rounded-full"
                                    onClick={(e) => {
                                        const newValue = calculateAngle(e.clientX, e.clientY, coldKnobRef);
                                        if (newValue !== null) setColdValue(newValue);
                                    }}
                                    onMouseDown={(e) => handleMouseDown(e, "cold")}
                                >
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-b from-blue-400 to-blue-600"></div>

                                    <div
                                        className="absolute inset-0 rounded-full opacity-30"
                                        style={{
                                            background:
                                                "linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.3) 20%, rgba(255,255,255,0) 50%)",
                                        }}
                                    ></div>

                                    <div
                                        className="absolute inset-0 rounded-full"
                                        style={{
                                            background: "radial-gradient(circle at center, rgba(0,0,0,0) 60%, rgba(0,0,0,0.2) 100%)",
                                        }}
                                    ></div>

                                    <div
                                        className="absolute inset-0 rounded-full overflow-hidden"
                                        style={{
                                            clipPath: `polygon(48% 0%, 52% 0%, 52% 30%, 48% 30%)`,
                                            transform: `rotate(${coldValue * 3.6}deg)`,
                                        }}
                                    >
                                        <div className="w-full h-full bg-blue-800"></div>
                                    </div>

                                    <div
                                        className="absolute inset-3.5 rounded-full bg-blue-500 flex items-center justify-center shadow-inner"
                                        style={{
                                            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3), 0 -1px 2px rgba(255,255,255,0.2)",
                                        }}
                                    >
                                        <span className="text-white font-bold text-3xl drop-shadow-sm">{Math.round(coldValue)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-center">
                                <span className="text-xs font-semibold text-rose-300 mb-1">HOT</span>
                                <div
                                    ref={hotKnobRef}
                                    className="relative w-28 h-28 cursor-pointer shadow-lg rounded-full"
                                    onClick={(e) => {
                                        const newValue = calculateAngle(e.clientX, e.clientY, hotKnobRef);
                                        if (newValue !== null) setHotValue(newValue);
                                    }}
                                    onMouseDown={(e) => handleMouseDown(e, "hot")}
                                >
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-b from-rose-400 to-rose-600"></div>

                                    <div
                                        className="absolute inset-0 rounded-full opacity-30"
                                        style={{
                                            background:
                                                "linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.3) 20%, rgba(255,255,255,0) 50%)",
                                        }}
                                    ></div>

                                    <div
                                        className="absolute inset-0 rounded-full"
                                        style={{
                                            background: "radial-gradient(circle at center, rgba(0,0,0,0) 60%, rgba(0,0,0,0.2) 100%)",
                                        }}
                                    ></div>

                                    <div
                                        className="absolute inset-0 rounded-full overflow-hidden"
                                        style={{
                                            clipPath: `polygon(48% 0%, 52% 0%, 52% 30%, 48% 30%)`,
                                            transform: `rotate(${hotValue * 3.6}deg)`,
                                        }}
                                    >
                                        <div className="w-full h-full bg-rose-800"></div>
                                    </div>

                                    <div
                                        className="absolute inset-3.5 rounded-full bg-rose-500 flex items-center justify-center shadow-inner"
                                        style={{
                                            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3), 0 -1px 2px rgba(255,255,255,0.2)",
                                        }}
                                    >
                                        <span className="text-white font-bold text-3xl drop-shadow-sm">{Math.round(hotValue)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 text-center">
                            <div 
                                style={{
                                    background: getTemperatureGradient(temperature),
                                    transition: "background 0.3s ease-in-out"
                                }}
                                className="text-sm py-2 px-4 rounded-lg inline-flex items-center gap-2 shadow-md border border-opacity-20 text-white border-white/20"
                            >
                                <Thermometer className="w-4 h-4" />
                                Current Temperature: <span className="font-semibold text-base ml-1">{Math.round(temperature)}°</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 bg-indigo-800/80 p-3 rounded-xl max-w-md w-full text-center">
                        <div className="text-sm text-indigo-200">
                            <p className="font-medium">Drag to turn the knobs and find the perfect shower temperature.</p>
                            <p className="text-xs opacity-90">Find the white zone on the temperature bar!</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Title screen */}
            {gameState === "title" && (
                <div className="fixed inset-0 bg-indigo-950/80 backdrop-blur-md flex items-center justify-center z-20 px-4">
                    <div className="bg-indigo-900/80 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl border border-indigo-700/50 animate-[float_4s_ease-in-out_infinite]">
                        <h1
                            className={`text-4xl font-bold mb-6 bg-gradient-to-r from-sky-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent ${satisfy.className}`}
                        >
                            Shower Temperature Game
                        </h1>

                        <div className="mb-10 relative h-40 overflow-hidden">
                            <div className="absolute inset-0 flex justify-center items-center">
                                <div className="w-28 h-28 bg-gradient-to-b from-indigo-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                    <div className="w-20 h-20 bg-gradient-to-b from-indigo-600 to-blue-800 rounded-full flex items-center justify-center shadow-inner">
                                        <div className="w-14 h-14 bg-gradient-to-b from-indigo-700 to-indigo-900 rounded-full shadow-inner flex items-center justify-center">
                                            <Droplets className="w-8 h-8 text-indigo-200" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Water drops animation */}
                            {isMounted &&
                                Array.from({ length: 5 }).map((_, i) => <WaterDrop key={`intro-drop-${i}`} index={i} isHot={false} />)}
                        </div>

                        {bestTime && (
                            <div className="mb-8 py-3 px-6 bg-indigo-800/50 rounded-xl inline-block shadow-inner border border-indigo-700/50">
                                <p className="text-sm text-indigo-300 mb-1">Your best time:</p>
                                <p className="text-2xl text-amber-300 font-bold">{formatTime(bestTime)}</p>
                            </div>
                        )}

                        <div className="flex flex-col gap-4">
                            <button
                                onClick={startNewGame}
                                className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold py-3.5 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-indigo-500/30 transform hover:scale-105 active:scale-95 border border-indigo-400/30 w-full cursor-pointer"
                            >
                                Start Game
                            </button>

                            <button
                                onClick={() => setShowInstructions(true)}
                                className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white font-medium py-3 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-indigo-500/20 transform hover:scale-105 active:scale-95 border border-indigo-500/30 w-full cursor-pointer"
                            >
                                How to Play
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showInstructions && (
                <div
                    className="fixed inset-0 bg-indigo-950/90 backdrop-blur-md flex items-center justify-center z-30 px-4"
                    onClick={() => setShowInstructions(false)}
                >
                    <div className="bg-indigo-800 rounded-xl p-6 max-w-md shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-5">
                            <h3 className={`text-2xl font-semibold text-indigo-200 ${satisfy.className}`}>How to Play</h3>
                            <button onClick={() => setShowInstructions(false)} className="text-indigo-300 hover:text-white cursor-pointer">
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>

                        <ul className="text-indigo-200 text-sm space-y-6 mb-6">
                            <li className="flex items-center">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-3 text-white font-bold">
                                    1
                                </div>
                                <span>
                                    Turn the <span className="text-rose-300 font-medium">HOT</span> and{" "}
                                    <span className="text-blue-300 font-medium">COLD</span> knobs by dragging them clockwise or
                                    counter-clockwise
                                </span>
                            </li>
                            <li className="flex items-center">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-3 text-white font-bold">
                                    2
                                </div>
                                <span>Find the perfect shower temperature (white zone on the temperature bar) as quickly as possible</span>
                            </li>
                            <li className="flex items-center">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-3 text-white font-bold">
                                    3
                                </div>
                                <span>
                                    The <span className="text-rose-300 font-medium">HOT</span> knob increases temperature, while the{" "}
                                    <span className="text-blue-300 font-medium">COLD</span> knob decreases it
                                </span>
                            </li>
                            <li className="flex items-center">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-3 text-white font-bold">
                                    4
                                </div>
                                <span>Try to beat your best time each round!</span>
                            </li>
                        </ul>

                        <button
                            onClick={() => setShowInstructions(false)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 cursor-pointer"
                        >
                            Got it!
                        </button>
                    </div>
                </div>
            )}

            {/* Game over screen */}
            {gameState === "gameOver" && (
                <div className="fixed inset-0 bg-indigo-950/90 backdrop-blur-md flex items-center justify-center z-20 transition-opacity duration-300 px-4">
                    <div className="bg-gradient-to-b from-indigo-800 to-indigo-950 rounded-xl p-8 max-w-md w-full text-center shadow-2xl border border-indigo-600/50 relative overflow-hidden">
                        {targetFound && (
                            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                {Array.from({ length: 50 }).map((_, i) => (
                                    <CelebrationBubble key={`confetti-${i}`} index={i} total={50} isGameOver={true} />
                                ))}
                            </div>
                        )}
                        
                        <h3 className="text-3xl font-bold mb-6 flex justify-center items-center gap-2">
                            {targetFound ? (
                                <span
                                    className={`bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent ${satisfy.className}`}
                                >
                                    Perfect Temperature!
                                </span>
                            ) : (
                                <span
                                    className={`bg-gradient-to-r from-rose-300 to-pink-200 bg-clip-text text-transparent ${satisfy.className}`}
                                >
                                    Game Over!
                                </span>
                            )}
                        </h3>

                        {targetFound ? (
                            <div className="mb-8 py-5 px-8 bg-indigo-800/50 rounded-xl inline-block border border-indigo-700/50 shadow-inner">
                                <p className="text-indigo-200 mb-3">You found the perfect temperature in:</p>
                                <p className="text-3xl font-bold text-emerald-400 mb-1">{formatTime(timer)}</p>

                                {bestTime === timer && (
                                    <div className="text-amber-300 flex items-center justify-center gap-1 mt-3 py-1.5 px-4 bg-amber-900/30 rounded-full border border-amber-700/50 inline-flex">
                                        <Trophy className="w-4 h-4" />
                                        <span className="font-medium">New Best Time!</span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-indigo-200 mb-8 bg-indigo-800/50 p-4 rounded-lg border border-indigo-700/50">
                                You couldn&apos;t find the perfect temperature in time. Try adjusting the knobs more carefully!
                            </p>
                        )}

                        <div className="flex flex-col gap-4">
                            <button
                                onClick={startNewGame}
                                className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-medium py-3.5 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-indigo-500/30 flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95 border border-indigo-400/30 cursor-pointer"
                            >
                                <RefreshCw className="w-4 h-4" />
                                <span>Play Again</span>
                            </button>

                            <button
                                onClick={() => setGameState("title")}
                                className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white font-medium py-3 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-indigo-500/20 flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95 border border-indigo-500/30 cursor-pointer"
                            >
                                <Home className="w-4 h-4" />
                                <span>Main Menu</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShowerGame;
