"use client";
import React, { useState, useEffect, useRef, TouchEvent } from "react";
import { 
  Play, 
  Pause, 
  X, 
  Clock, 
  Square,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  Flag,
  Bell
} from "lucide-react";

// Create a solid play icon component
function PlaySolid() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
        </svg>
    );
}

export default function Timer() {
    const [view, setView] = useState<"selector" | "timer">("selector");
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(1);
    const [seconds, setSeconds] = useState(25);
    const [running, setRunning] = useState(false);
    const [totalTimeInSeconds, setTotalTimeInSeconds] = useState(0);
    const [remainingTimeInSeconds, setRemainingTimeInSeconds] = useState(0);
    const [elapsedTimeInSeconds, setElapsedTimeInSeconds] = useState(0);
    const [alarmTime, setAlarmTime] = useState<string | null>(null);
    const [laps, setLaps] = useState<{ time: string, elapsed: number }[]>([]);
    const [showLaps, setShowLaps] = useState(false);
    const progressRingRef = useRef<SVGCircleElement>(null);
    
    // Touch tracking
    const [touchStartY, setTouchStartY] = useState<number | null>(null);
    const [activeInput, setActiveInput] = useState<'hours' | 'minutes' | 'seconds' | null>(null);
    
    const [alarmSound, setAlarmSound] = useState<HTMLAudioElement | null>(null);
    
    // Calculate total time when hours, minutes, seconds change
    useEffect(() => {
        const total = hours * 3600 + minutes * 60 + seconds;
        setTotalTimeInSeconds(total);
        setRemainingTimeInSeconds(total);
    }, [hours, minutes, seconds]);
    
    // Initialize alarm sound
    useEffect(() => {
        const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/996/996.wav");
        audio.volume = 0.7;
        setAlarmSound(audio);
        
        return () => {
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
        };
    }, []);
    
    // Timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout;
        
        if (running && remainingTimeInSeconds > 0) {
            interval = setInterval(() => {
                setRemainingTimeInSeconds(prev => {
                    if (prev <= 1) {
                        setRunning(false);
                        // Play alarm sound when timer reaches zero
                        if (alarmSound) {
                            alarmSound.currentTime = 0;
                            alarmSound.play().catch(err => console.error('Error playing alarm:', err));
                        }
                        return 0;
                    }
                    return prev - 1;
                });
                
                setElapsedTimeInSeconds(prev => prev + 1);
            }, 1000);
        } else if (running && remainingTimeInSeconds === 0) {
            setRunning(false);
        }
        
        return () => clearInterval(interval);
    }, [running, remainingTimeInSeconds, alarmSound]);
    
    // Update progress ring
    useEffect(() => {
        if (progressRingRef.current && totalTimeInSeconds > 0) {
            const circumference = 2 * Math.PI * 130; // radius = 130
            const offset = circumference * (1 - (remainingTimeInSeconds / totalTimeInSeconds));
            progressRingRef.current.style.strokeDashoffset = `${offset}`;
        }
    }, [remainingTimeInSeconds, totalTimeInSeconds]);

    // Set current time + duration for alarm
    useEffect(() => {
        if (running && totalTimeInSeconds > 0) {
            const now = new Date();
            const alarmDate = new Date(now.getTime() + remainingTimeInSeconds * 1000);
            const hours = alarmDate.getHours();
            const minutes = alarmDate.getMinutes();
            
            setAlarmTime(`${hours}:${minutes.toString().padStart(2, '0')}`);
        }
    }, [running, remainingTimeInSeconds, totalTimeInSeconds]);

    const handleStart = () => {
        if (remainingTimeInSeconds === 0) {
            // If time is 0, restore original time before starting
            setRemainingTimeInSeconds(totalTimeInSeconds);
            setElapsedTimeInSeconds(0);
            setRunning(true);
            setView("timer");
        } else if (totalTimeInSeconds > 0) {
            setRunning(true);
            setView("timer");
        }
    };
    
    const handleStop = () => setRunning(false);
    
    const handleReset = () => {
        setRunning(false);
        setElapsedTimeInSeconds(0);
        setAlarmTime(null);
        setLaps([]);
        setShowLaps(false);
        
        // Reset timer to original set time
        setRemainingTimeInSeconds(totalTimeInSeconds);
    };
    
    const handleReturnToSelector = () => {
        // Stop the timer if it's running
        setRunning(false);
        
        // Reset all states
        setElapsedTimeInSeconds(0);
        setAlarmTime(null);
        setLaps([]);
        setShowLaps(false);
        
        // Return to selector view
        setView("selector");
    };
    
    const formatTimeDisplay = (totalSeconds: number) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        
        if (h > 0) {
            return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }
        
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };
    
    const increment = (type: 'hours' | 'minutes' | 'seconds') => {
        if (type === 'hours') {
            setHours(prev => prev >= 23 ? 0 : prev + 1);
        } else if (type === 'minutes') {
            setMinutes(prev => prev >= 59 ? 0 : prev + 1);
        } else if (type === 'seconds') {
            setSeconds(prev => prev >= 59 ? 0 : prev + 1);
        }
    };
    
    const decrement = (type: 'hours' | 'minutes' | 'seconds') => {
        if (type === 'hours') {
            setHours(prev => prev <= 0 ? 23 : prev - 1);
        } else if (type === 'minutes') {
            setMinutes(prev => prev <= 0 ? 59 : prev - 1);
        } else if (type === 'seconds') {
            setSeconds(prev => prev <= 0 ? 59 : prev - 1);
        }
    };
    
    // Handle direct input - replace 0 value when typing a new number
    const handleInputChange = (type: 'hours' | 'minutes' | 'seconds', value: string) => {
        // Get the current value based on type
        const currentValue = type === 'hours' ? hours : type === 'minutes' ? minutes : seconds;
        
        // If current value is 0, replace it entirely with the new input
        if (currentValue === 0 && value !== '0') {
            // If the input field has a leading 0 added by the browser, remove it
            if (value.startsWith('0') && value !== '0') {
                value = value.replace(/^0+/, '');
            }
        }
        
        const numValue = parseInt(value, 10);
        
        if (isNaN(numValue)) return;
        
        if (type === 'hours') {
            setHours(Math.min(23, Math.max(0, numValue)));
        } else if (type === 'minutes') {
            setMinutes(Math.min(59, Math.max(0, numValue)));
        } else if (type === 'seconds') {
            setSeconds(Math.min(59, Math.max(0, numValue)));
        }
    };
    
    // Touch handlers for swipe gestures
    const handleTouchStart = (e: TouchEvent, type: 'hours' | 'minutes' | 'seconds') => {
        setTouchStartY(e.touches[0].clientY);
        setActiveInput(type);
    };
    
    const handleTouchMove = (e: TouchEvent) => {
        if (touchStartY === null || activeInput === null) return;
        
        const touchY = e.touches[0].clientY;
        const diff = touchStartY - touchY;
        
        // If enough movement has occurred, trigger increment or decrement
        if (diff > 15) {
            // Swipe up - increment
            increment(activeInput);
            setTouchStartY(touchY);
        } else if (diff < -15) {
            // Swipe down - decrement
            decrement(activeInput);
            setTouchStartY(touchY);
        }
    };
    
    const handleTouchEnd = () => {
        setTouchStartY(null);
        setActiveInput(null);
    };

    const handleLap = () => {
        if (running) {
            setLaps(prev => [
                { 
                    time: formatTimeDisplay(remainingTimeInSeconds),
                    elapsed: elapsedTimeInSeconds
                },
                ...prev
            ]);
            setShowLaps(true);
        }
    };
    
    const toggleLapsVisibility = () => {
        setShowLaps(prev => !prev);
        
        // Reset timer if it's at 0
        if (remainingTimeInSeconds === 0) {
            handleReset();
        }
    };

    // Handle input key events - delete one by one and default to 0 when empty
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, type: 'hours' | 'minutes' | 'seconds') => {
        // Only handle backspace - let delete function normally
        if (e.key === 'Backspace') {
            const input = e.currentTarget;
            const value = input.value;
            
            // If there's only one digit or empty, set to 0
            if (value.length <= 1) {
                e.preventDefault(); // Prevent default only when we need to set to 0
                
                if (type === 'hours') {
                    setHours(0);
                } else if (type === 'minutes') {
                    setMinutes(0);
                } else if (type === 'seconds') {
                    setSeconds(0);
                }
            }
            // Otherwise, let backspace delete normally (digit by digit)
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#151515] text-white px-4">
            {/* CSS for neon title animation with reduced glow effect */}
            <style jsx>{`
                @keyframes neonPulse {
                    0%,
                    100% {
                        text-shadow: 0 0 1.5px #8ecae6, 0 0 3px #8ecae6, 0 0 5.25px #8ecae6, 0 0 10.5px #219ebc, 0 0 21px #219ebc;
                    }
                    50% {
                        text-shadow: 0 0 2.25px #a2d2ff, 0 0 5.25px #ffafcc, 0 0 7.5px #ffafcc, 0 0 10.5px #cdb4db, 0 0 18.75px #cdb4db;
                    }
                }
                .app-title {
                    font-weight: 500;
                    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
                    letter-spacing: 0.5px;
                    text-shadow: 0 0 1.25px #4c4c4c, 0 0 2.5px #3c3c3c, 0 0 3.75px #2c2c2c;
                    user-select: none;
                    cursor: default;
                    transition: text-shadow 0.3s ease;
                }
                .app-title:hover {
                    text-shadow: 0 0 4px #4c4c4c, 0 0 8px #3c3c3c, 0 0 12px #2c2c2c;
                    transition: text-shadow 0.3s ease;
                }
                .title-light {
                    color: #cbcbcb;
                }
                .title-dark {
                    color: #a9a8a8;
                }
                @keyframes gradientFlow {
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
                @keyframes fadeUpOut {
                    0% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                    100% {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                }
                @keyframes fadeDownIn {
                    0% {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes fadeDownOut {
                    0% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                    100% {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                }
                @keyframes fadeUpIn {
                    0% {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-up-out {
                    animation: fadeUpOut 0.2s forwards;
                }
                .animate-fade-down-in {
                    animation: fadeDownIn 0.2s forwards;
                }
                .animate-fade-down-out {
                    animation: fadeDownOut 0.2s forwards;
                }
                .animate-fade-up-in {
                    animation: fadeUpIn 0.2s forwards;
                }
                .lap-card {
                    background-color: #111;
                    border: 2px solid #090909;
                    border-radius: 0.75rem;
                    box-shadow: 0 0 15px rgba(44, 44, 44, 0.5), 
                                inset 0 0 8px rgba(101, 101, 101, 0.05);
                    overflow: hidden;
                    transition: all 0.3s ease;
                }
                
                .lap-card:hover {
                    box-shadow: 0 0 20px rgba(76, 76, 76, 0.4), 
                                inset 0 0 12px rgba(125, 124, 132, 0.1);
                }
                
                .lap-header {
                    padding: 0.75rem 1rem;
                    border-bottom: 1px solid #1a1a1a;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .lap-list {
                    padding: 0.5rem 1rem;
                    max-height: 260px;
                    overflow-y: auto;
                }
                
                .lap-item {
                    padding: 0.5rem 0;
                    border-bottom: 1px solid #222;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .lap-item:last-child {
                    border-bottom: none;
                }
                
                .text-gradient {
                    background: linear-gradient(90deg, #9bf8f4, #a2d2ff, #cdb4db, #ffafcc, #ffc8dd);
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                    color: transparent;
                }
            `}</style>

            <div className="w-full max-w-md">
                {view === "selector" ? (
                    <div className="p-6 flex flex-col items-center">
                        <h1 className="text-4xl mb-12 text-center app-title">
                            <span className="title-dark">timer</span>
                            <span className="title-light">.now</span>
                        </h1>

                        {/* Centered labels with larger font */}
                        <div className="w-full grid grid-cols-3 mb-2 text-[#a6a6a6] font-mono text-base">
                            <span className="text-center">hours</span>
                            <span className="text-center">min</span>
                            <span className="text-center">sec</span>
                        </div>

                        <div className="w-full mb-8">
                            {/* Centered top numbers */}
                            <div className="grid grid-cols-3 items-center">
                                <div className="cursor-pointer text-center" onClick={() => decrement("hours")}>
                                    <ChevronUp className="mx-auto h-7 w-7 text-[#282828]" />
                                    <span className="text-[#282828] font-mono font-bold text-xl animate-fade-down-in">
                                        {hours > 0 ? (hours - 1).toString().padStart(2, "0") : "23"}
                                    </span>
                                </div>
                                <div className="cursor-pointer text-center" onClick={() => decrement("minutes")}>
                                    <ChevronUp className="mx-auto h-7 w-7 text-[#282828]" />
                                    <span className="text-[#282828] font-mono font-bold text-xl animate-fade-down-in">
                                        {minutes > 0 ? (minutes - 1).toString().padStart(2, "0") : "59"}
                                    </span>
                                </div>
                                <div className="cursor-pointer text-center" onClick={() => decrement("seconds")}>
                                    <ChevronUp className="mx-auto h-7 w-7 text-[#282828]" />
                                    <span className="text-[#282828] font-mono font-bold text-xl animate-fade-down-in">
                                        {seconds > 0 ? (seconds - 1).toString().padStart(2, "0") : "59"}
                                    </span>
                                </div>
                            </div>

                            {/* Timer selector display with thick borders and dividers */}
                            <div className="flex justify-between items-center my-4 bg-[#121212] border-4 border-[#090909] rounded-xl overflow-hidden">
                                <div
                                    className="w-1/3 py-5 text-center relative"
                                    onTouchStart={(e) => handleTouchStart(e, "hours")}
                                    onTouchMove={handleTouchMove}
                                    onTouchEnd={handleTouchEnd}
                                >
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        value={hours}
                                        onChange={(e) => handleInputChange("hours", e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(e, "hours")}
                                        className="w-full bg-transparent text-center font-bold text-4xl focus:outline-none font-mono cursor-pointer transition-opacity duration-200"
                                    />
                                </div>
                                <div className="h-12 w-0.5 rounded-full bg-[#0e0e10]"></div>
                                <div
                                    className="w-1/3 py-5 text-center relative"
                                    onTouchStart={(e) => handleTouchStart(e, "minutes")}
                                    onTouchMove={handleTouchMove}
                                    onTouchEnd={handleTouchEnd}
                                >
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        value={minutes}
                                        onChange={(e) => handleInputChange("minutes", e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(e, "minutes")}
                                        className="w-full bg-transparent text-center font-bold text-4xl focus:outline-none font-mono cursor-pointer transition-opacity duration-200"
                                    />
                                </div>
                                <div className="h-12 w-0.5 rounded-full bg-[#0e0e10]"></div>
                                <div
                                    className="w-1/3 py-5 text-center relative"
                                    onTouchStart={(e) => handleTouchStart(e, "seconds")}
                                    onTouchMove={handleTouchMove}
                                    onTouchEnd={handleTouchEnd}
                                >
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        value={seconds}
                                        onChange={(e) => handleInputChange("seconds", e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(e, "seconds")}
                                        className="w-full bg-transparent text-center font-bold text-4xl focus:outline-none font-mono cursor-pointer transition-opacity duration-200"
                                    />
                                </div>
                            </div>

                            {/* Centered bottom numbers */}
                            <div className="grid grid-cols-3 items-center">
                                <div className="cursor-pointer text-center" onClick={() => increment("hours")}>
                                    <span className="text-[#282828] font-mono font-bold text-xl animate-fade-up-in">
                                        {(hours < 23 ? hours + 1 : 0).toString().padStart(2, "0")}
                                    </span>
                                    <ChevronDown className="mx-auto h-7 w-7 text-[#282828]" />
                                </div>
                                <div className="cursor-pointer text-center" onClick={() => increment("minutes")}>
                                    <span className="text-[#282828] font-mono font-bold text-xl animate-fade-up-in">
                                        {(minutes < 59 ? minutes + 1 : 0).toString().padStart(2, "0")}
                                    </span>
                                    <ChevronDown className="mx-auto h-7 w-7 text-[#282828]" />
                                </div>
                                <div className="cursor-pointer text-center" onClick={() => increment("seconds")}>
                                    <span className="text-[#282828] font-mono font-bold text-xl animate-fade-up-in">
                                        {(seconds < 59 ? seconds + 1 : 0).toString().padStart(2, "0")}
                                    </span>
                                    <ChevronDown className="mx-auto h-7 w-7 text-[#282828]" />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleStart}
                            className="w-16 h-16 rounded-full flex items-center justify-center bg-[#151515] border-4 border-[#090909] transition-all duration-300 cursor-pointer hover:bg-[#1a1a1a] hover:shadow-[0_0_10px_rgba(154,231,232,0.3)]"
                        >
                            <div className="w-7 h-7">
                                <PlaySolid />
                            </div>
                        </button>
                    </div>
                ) : (
                    <div className="p-6 flex flex-col items-center">
                        <h1 className="text-3xl mb-10 text-center app-title">
                            <span className="title-dark">timer</span>
                            <span className="title-light">.now</span>
                        </h1>
                        
                        <div className="relative w-full h-[420px] flex items-center justify-center">
                            {/* Top buttons */}
                            <div className="absolute top-0 left-[15%]">
                                <button 
                                    onClick={handleLap}
                                    className="p-4 rounded-full bg-[#151515] border-2 border-[#090909] transition-all duration-300 cursor-pointer hover:bg-[#1a1a1a] hover:shadow-[0_0_10px_rgba(154,231,232,0.3)]"
                                >
                                    <Flag size={20} />
                                </button>
                            </div>
                            
                            <div className="absolute top-0 right-[15%]">
                                <button 
                                    onClick={handleReset}
                                    className="p-4 rounded-full bg-[#151515] border-2 border-[#090909] transition-all duration-300 cursor-pointer hover:bg-[#1a1a1a] hover:shadow-[0_0_10px_rgba(154,231,232,0.3)]"
                                >
                                    <RotateCcw size={20} />
                                </button>
                            </div>
                            
                            {/* Laps display */}
                            {showLaps && (
                                <div className="absolute right-[-220px] top-1/2 transform -translate-y-1/2 w-52 lap-card">
                                    <div className="lap-header">
                                        <h3 className="text-lg font-mono font-medium">Laps</h3>
                                        <button 
                                            onClick={toggleLapsVisibility}
                                            className="text-[#a6a6a6] hover:text-white transition-colors duration-200 cursor-pointer"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                    
                                    <div className="lap-list">
                                        {laps.length === 0 ? (
                                            <p className="text-[#a6a6a6] text-center text-sm font-mono py-4">No laps recorded</p>
                                        ) : (
                                            <div className="space-y-2">
                                                {laps.map((lap, index) => (
                                                    <div key={index} className="lap-item">
                                                        <span className="text-[#a6a6a6] font-mono text-sm">#{laps.length - index}</span>
                                                        <span className="font-mono font-medium">{lap.time}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            
                            {/* Center timer display */}
                            <div className="relative h-80 w-80 flex items-center justify-center">
                                <svg className="absolute h-full w-full" viewBox="0 0 300 300">
                                    {/* Background ring */}
                                    <circle
                                        cx="150"
                                        cy="150"
                                        r="130"
                                        fill="none"
                                        stroke="#090909"
                                        strokeWidth="10"
                                        filter="drop-shadow(0 0 2px rgba(0, 0, 0, 0.2))"
                                    />
                                    
                                    {/* Progress ring - animated */}
                                    <circle
                                        ref={progressRingRef}
                                        cx="150"
                                        cy="150"
                                        r="130"
                                        fill="none"
                                        stroke="url(#gradient)"
                                        strokeWidth="10"
                                        strokeLinecap="round"
                                        strokeDasharray={2 * Math.PI * 130}
                                        strokeDashoffset="0"
                                        transform="rotate(-90 150 150)"
                                        style={{ transition: "stroke-dashoffset 1s linear" }}
                                    />
                                    
                                    {/* Gradient definition */}
                                    <defs>
                                        <linearGradient id="gradient" gradientTransform="rotate(90)">
                                            <stop offset="0%" stopColor="#9bf8f4" />
                                            <stop offset="25%" stopColor="#a2d2ff" />
                                            <stop offset="50%" stopColor="#cdb4db" />
                                            <stop offset="75%" stopColor="#ffafcc" />
                                            <stop offset="100%" stopColor="#ffc8dd" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                
                                <div className="z-10 text-center">
                                    <div className="text-5xl font-bold mb-1 font-mono">
                                        {formatTimeDisplay(remainingTimeInSeconds)}
                                    </div>
                                    {alarmTime && (
                                        <div className="text-sm flex items-center justify-center space-x-1">
                                            <Bell size={12} className="text-gradient" />
                                            <span className="text-gradient font-mono">{alarmTime}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Bottom buttons */}
                            <div className="absolute bottom-0 left-[15%]">
                                <button 
                                    onClick={handleReturnToSelector}
                                    className="p-4 rounded-full bg-[#151515] border-2 border-[#090909] hover:bg-[#1a1a1a] transition-all duration-300 cursor-pointer hover:shadow-[0_0_10px_rgba(154,231,232,0.3)]"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            
                            <div className="absolute bottom-0 right-[15%]">
                                <button 
                                    onClick={running ? handleStop : handleStart}
                                    className="p-4 rounded-full bg-[#151515] border-2 border-[#090909] flex items-center justify-center transition-all duration-300 cursor-pointer hover:bg-[#1a1a1a] hover:shadow-[0_0_10px_rgba(154,231,232,0.3)]"
                                >
                                    {running ? (
                                        <Pause size={24} />
                                    ) : (
                                        <div className="w-6 h-6">
                                            <PlaySolid />
                                        </div>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

