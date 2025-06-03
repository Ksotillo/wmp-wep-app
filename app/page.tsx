"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ThemeProvider, useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaPlay,
    FaPause,
    FaMicrophone,
    FaMicrophoneSlash,
    FaCog,
    FaMobile,
    FaLightbulb,
    FaEnvelope,
    FaVolumeUp,
    FaVolumeMute,
    FaCircle,
    FaHandHoldingHeart,
} from "react-icons/fa";

interface TouchPoint {
    id: number;
    x: number;
    y: number;
    startTime: number;
    previousX?: number;
    previousY?: number;
    isInZone?: boolean;
    zoneId?: string;
}

interface TouchZone {
    id: string;
    x: number;
    y: number;
    radius: number;
    isActive: boolean;
    holdDuration: number;
    lastTouchTime: number;
}

interface Particle {
    id: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size: number;
    color: string;
    alpha: number;
    trail?: boolean;
}

interface ParticleSystemProps {
    touchPoints: TouchPoint[];
    touchZones: TouchZone[];
    breathingPhase: string;
    audioLevel: number;
    isActive: boolean;
    phaseDuration: number;
    phaseIndex: number;
    getPhaseColorWithDuration: (phase: string, duration: number, maxDuration: number) => string;
    phaseDurations: number[];
}

const GlobalThemeStyles = () => (
    <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&family=Open+Sans:wght@300;400;500;600&display=swap");

        :root {
            --page-bg: #f8fafc;
            --page-text-primary: #1e293b;
            --page-text-secondary: #64748b;
            --card-bg: #ffffff;
            --card-border: #e2e8f0;
            --accent-primary: #f97316;
            --accent-secondary: #84cc16;
            --accent-tertiary: #06b6d4;
            --button-bg: #f1f5f9;
            --button-hover: #e2e8f0;
            --success-color: #22c55e;
            --warning-color: #f59e0b;
            --error-color: #ef4444;
            --font-heading: "Lora", serif;
            --font-body: "Open Sans", sans-serif;
            --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
            --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
            --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
        }

        html.dark {
            --page-bg: #0f172a;
            --page-text-primary: #f1f5f9;
            --page-text-secondary: #94a3b8;
            --card-bg: #1e293b;
            --card-border: #334155;
            --accent-primary: #fb923c;
            --accent-secondary: #a3e635;
            --accent-tertiary: #22d3ee;
            --button-bg: #334155;
            --button-hover: #475569;
            --success-color: #4ade80;
            --warning-color: #fbbf24;
            --error-color: #f87171;
            --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.3);
            --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.3);
            --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.3);
        }

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            padding: 0;
            background-color: var(--page-bg);
            color: var(--page-text-primary);
            font-family: var(--font-body);
            font-weight: 400;
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            overflow-x: hidden;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
            font-family: var(--font-heading);
            font-weight: 600;
            line-height: 1.3;
        }

        /* Accessibility: Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }

            .particle-canvas {
                display: none !important;
            }

            .breathing-indicator * {
                transform: none !important;
            }
        }

        /* Enhanced focus indicators for accessibility */
        button:focus-visible,
        [tabindex]:focus-visible {
            outline: 3px solid var(--accent-primary);
            outline-offset: 2px;
            border-radius: 4px;
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
            :root {
                --page-text-primary: #000000;
                --page-text-secondary: #333333;
                --accent-primary: #0066cc;
                --card-border: #333333;
            }

            html.dark {
                --page-text-primary: #ffffff;
                --page-text-secondary: #cccccc;
                --accent-primary: #66b3ff;
                --card-border: #cccccc;
            }
        }

        ::-webkit-scrollbar {
            width: 8px;
        }

        ::-webkit-scrollbar-track {
            background: var(--card-bg);
        }

        ::-webkit-scrollbar-thumb {
            background: var(--page-text-secondary);
            border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: var(--page-text-primary);
        }

        .particle-canvas {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            zindex: 1;
        }

        .touch-zone {
            position: absolute;
            border-radius: 50%;
            border: 2px solid var(--accent-primary);
            opacity: 0.6;
            pointer-events: all;
            touch-action: none;
            user-select: none;
            transition: all 0.3s ease;
            zindex: 2;
        }

        .touch-zone:active,
        .touch-zone:focus {
            transform: scale(1.1);
            opacity: 0.8;
            outline: 3px solid var(--accent-primary);
            outline-offset: 4px;
        }

        .breathing-indicator {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            zindex: 3;
        }

        /* Screen reader only text */
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }

        @media (max-width: 768px) {
            .touch-zone {
                min-width: 44px;
                min-height: 44px;
            }
        }
    `}</style>
);

const ParticleSystem = ({ touchPoints, touchZones, breathingPhase, audioLevel, isActive, phaseDuration, phaseIndex, getPhaseColorWithDuration, phaseDurations }: ParticleSystemProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animationFrameRef = useRef<number | null>(null);

    const createParticle = useCallback((x: number, y: number, phase: string, isTrail = false, customColor?: string): Particle => {
        let particleColor: string;
        if (customColor) {
            particleColor = customColor;
        } else {
            const maxDuration = phaseDurations[phaseIndex];
            particleColor = getPhaseColorWithDuration(phase, phaseDuration, maxDuration);
        }

        const angle = Math.random() * Math.PI * 2;
        const speed = isTrail ? 1 + Math.random() * 2 : 2 + Math.random() * 3;

        return {
            id: Math.random().toString(36),
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: isTrail ? 0.8 : 1.0,
            maxLife: isTrail ? 0.8 : 1.0,
            size: isTrail ? 3 + Math.random() * 6 : 4 + Math.random() * 12,
            color: particleColor,
            alpha: 1.0,
            trail: isTrail
        };
    }, [phaseIndex, phaseDuration, getPhaseColorWithDuration, phaseDurations]);

    const createTrailParticles = useCallback((fromX: number, fromY: number, toX: number, toY: number, phase: string) => {
        const distance = Math.sqrt((toX - fromX) ** 2 + (toY - fromY) ** 2);
        const steps = Math.min(Math.floor(distance / 8), 10);
        
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const x = fromX + (toX - fromX) * t;
            const y = fromY + (toY - fromY) * t;
            
            const offsetX = (Math.random() - 0.5) * 10;
            const offsetY = (Math.random() - 0.5) * 10;
            
            particlesRef.current.push(createParticle(x + offsetX, y + offsetY, phase, true));
        }
    }, [createParticle]);

    const updateParticles = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        particlesRef.current = particlesRef.current.filter(particle => {
            particle.life -= particle.trail ? 0.015 : 0.008;
            particle.alpha = particle.life;

            if (audioLevel > 0.1) {
                const vibrationStrength = audioLevel * 5;
                const time = Date.now() * 0.01;
                const vibrationX = Math.sin(time + particle.x * 0.01) * vibrationStrength;
                const vibrationY = Math.cos(time + particle.y * 0.01) * vibrationStrength;
                particle.vx += vibrationX * 0.1;
                particle.vy += vibrationY * 0.1;
                
                particle.size = (particle.trail ? 3 + Math.random() * 6 : 4 + Math.random() * 12) * (1 + audioLevel * 0.5);
            }

            if (breathingPhase === 'inhale') {
                const dx = centerX - particle.x;
                const dy = centerY - particle.y;
                particle.vx += dx * 0.0005;
                particle.vy += dy * 0.0005;
            } else if (breathingPhase === 'exhale') {
                const dx = particle.x - centerX;
                const dy = particle.y - centerY;
                particle.vx += dx * 0.0008;
                particle.vy += dy * 0.0008;
            } else if (breathingPhase === 'hold') {
                const dx = particle.x - centerX;
                const dy = particle.y - centerY;
                const angle = Math.atan2(dy, dx);
                particle.vx += Math.cos(angle + Math.PI / 2) * 0.3;
                particle.vy += Math.sin(angle + Math.PI / 2) * 0.3;
            }

            particle.vx *= 0.995;
            particle.vy *= 0.995;

            particle.x += particle.vx;
            particle.y += particle.vy;

            return particle.life > 0;
        });

        touchPoints.forEach(touch => {
            if (touch.isInZone) {
                const activeZone = touchZones.find(zone => zone.id === touch.zoneId && zone.isActive);
                if (activeZone && Math.random() < 0.6) {
                    const intensity = Math.min(activeZone.holdDuration / 1000, 2);
                    const particleCount = Math.floor(1 + intensity * 2);
                    
                    for (let i = 0; i < particleCount; i++) {
                        const offsetX = (Math.random() - 0.5) * 30;
                        const offsetY = (Math.random() - 0.5) * 30;
                        particlesRef.current.push(createParticle(
                            touch.x + offsetX, 
                            touch.y + offsetY, 
                            breathingPhase
                        ));
                    }
                }
                
                if (touch.previousX !== undefined && touch.previousY !== undefined) {
                    const distance = Math.sqrt((touch.x - touch.previousX) ** 2 + (touch.y - touch.previousY) ** 2);
                    if (distance > 5) {
                        createTrailParticles(touch.previousX, touch.previousY, touch.x, touch.y, breathingPhase);
                    }
                }
            }
        });

        if (audioLevel > 0.1) {
            const intensity = Math.min(audioLevel * 12, 8);
            for (let i = 0; i < intensity; i++) {
                const angle = (Math.PI * 2 * i) / intensity + Date.now() * 0.003;
                const radius = 50 + audioLevel * 150 + Math.sin(Date.now() * 0.005) * 30;
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;
                const particle = createParticle(x, y, 'hold');
                particle.vx *= 1.5;
                particle.vy *= 1.5;
                particlesRef.current.push(particle);
            }
        }

        if (isActive && Math.random() < 0.2) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 100 + Math.random() * 200;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            particlesRef.current.push(createParticle(x, y, breathingPhase));
        }

        if (particlesRef.current.length > 200) {
            particlesRef.current = particlesRef.current.slice(-200);
        }
    }, [touchPoints, touchZones, breathingPhase, audioLevel, isActive, createParticle, createTrailParticles]);

    const renderParticles = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        
        particlesRef.current.forEach(particle => {
            if (particle.alpha < 0.1) return;
            
            ctx.save();
            ctx.globalAlpha = particle.alpha;
            ctx.fillStyle = particle.color;
            
            if (particle.trail) {
                ctx.shadowColor = particle.color;
                ctx.shadowBlur = 5;
            } else {
                ctx.shadowColor = particle.color;
                ctx.shadowBlur = 12;
            }
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size * particle.alpha, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
        
        ctx.restore();
    }, []);

    const animate = useCallback(() => {
        if (!isActive) return;
        
        updateParticles();
        renderParticles();
        animationFrameRef.current = requestAnimationFrame(animate);
    }, [isActive, updateParticles, renderParticles]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resizeCanvas = () => {
            const pixelRatio = Math.min(window.devicePixelRatio, 2);
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            canvas.width = width * pixelRatio;
            canvas.height = height * pixelRatio;
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.scale(pixelRatio, pixelRatio);
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
            }
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        if (isActive) {
            animate();
        }

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isActive, animate]);

    return <canvas ref={canvasRef} className="particle-canvas" />;
};

const BreathingSession = () => {
    const [sessionState, setSessionState] = useState("setup");
    const [sessionDuration, setSessionDuration] = useState(10);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [breathingPhase, setBreathingPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
    const [phaseTimer, setPhaseTimer] = useState(4);
    const [phaseStartTime, setPhaseStartTime] = useState<number>(Date.now());
    const [phaseDuration, setPhaseDuration] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [touchPoints, setTouchPoints] = useState<TouchPoint[]>([]);
    const [touchZones, setTouchZones] = useState<TouchZone[]>([]);
    const [isListening, setIsListening] = useState(false);
    const [audioLevel, setAudioLevel] = useState(0);
    const [showSettings, setShowSettings] = useState(false);
    const [phaseIndex, setPhaseIndex] = useState(0);
    const [announcements, setAnnouncements] = useState<string>("");
    const [lastAnnouncedPhase, setLastAnnouncedPhase] = useState<string>("");

    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const micStreamRef = useRef<MediaStream | null>(null);
    const settingsRef = useRef<HTMLDivElement>(null);
    const skipLinkRef = useRef<HTMLAnchorElement>(null);
    const mainContentRef = useRef<HTMLElement>(null);

    const { theme, setTheme } = useTheme();

    const breathingPhases: ("inhale" | "hold" | "exhale" | "hold")[] = ["inhale", "hold", "exhale", "hold"];
    const phaseDurations = [4, 2, 4, 2];

    const announceToScreenReader = useCallback((message: string, priority: "polite" | "assertive" = "polite") => {
        setAnnouncements(message);

        setTimeout(() => setAnnouncements(""), 2000);

        console.log(`Accessibility: ${message}`);
    }, []);

    useEffect(() => {
        if (sessionState === "active" && breathingPhase !== lastAnnouncedPhase) {
            const phaseMessages = {
                inhale: `Begin inhaling. Breathe in slowly for ${phaseDurations[phaseIndex]} seconds.`,
                exhale: `Begin exhaling. Breathe out slowly for ${phaseDurations[phaseIndex]} seconds.`,
                hold: `Hold your breath for ${phaseDurations[phaseIndex]} seconds.`,
            };

            announceToScreenReader(phaseMessages[breathingPhase] || `${breathingPhase} phase started`, "assertive");
            setLastAnnouncedPhase(breathingPhase);
        }
    }, [breathingPhase, sessionState, phaseIndex, phaseDurations, lastAnnouncedPhase, announceToScreenReader]);

    useEffect(() => {
        if (sessionState === "active") {
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;

            if (seconds === 0 && minutes > 0) {
                announceToScreenReader(`${minutes} minute${minutes !== 1 ? "s" : ""} remaining`);
            } else if (timeRemaining === 30) {
                announceToScreenReader("30 seconds remaining");
            } else if (timeRemaining === 10) {
                announceToScreenReader("10 seconds remaining");
            }
        }
    }, [timeRemaining, sessionState, announceToScreenReader]);

    const skipToMain = useCallback(() => {
        mainContentRef.current?.focus();
        announceToScreenReader("Skipped to main content");
    }, [announceToScreenReader]);

    const toggleMicrophone = useCallback(async () => {
        if (!isListening) {
            try {
                if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                    console.warn("Microphone API not available in this browser");
                    return;
                }

                console.log("🎤 Requesting microphone access...");
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        echoCancellation: false,
                        noiseSuppression: false,
                        autoGainControl: false,
                        sampleRate: 44100,
                    },
                });

                console.log("✅ Microphone access granted");
                const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
                if (!AudioContextClass) {
                    console.warn("Web Audio API not available");
                    stream.getTracks().forEach((track) => track.stop());
                    return;
                }

                const audioContext = new AudioContextClass();

                if (audioContext.state === "suspended") {
                    await audioContext.resume();
                    console.log("🔊 AudioContext resumed");
                }

                const analyser = audioContext.createAnalyser();
                const microphone = audioContext.createMediaStreamSource(stream);

                analyser.fftSize = 1024;
                analyser.smoothingTimeConstant = 0.2;
                analyser.minDecibels = -90;
                analyser.maxDecibels = -10;

                microphone.connect(analyser);

                audioContextRef.current = audioContext;
                analyserRef.current = analyser;
                micStreamRef.current = stream;

                setIsListening(true);
                announceToScreenReader("Microphone activated for focus mode");
                console.log("🎵 Microphone monitoring started");

                const updateAudioLevel = () => {
                    if (!analyserRef.current) return;

                    try {
                        const dataArray = new Uint8Array(analyser.frequencyBinCount);
                        analyser.getByteFrequencyData(dataArray);

                        let sum = 0;
                        for (let i = 0; i < dataArray.length; i++) {
                            sum += dataArray[i] * dataArray[i];
                        }
                        const rms = Math.sqrt(sum / dataArray.length);
                        const normalizedLevel = Math.min(rms / 128, 1);

                        setAudioLevel(normalizedLevel);

                        if (normalizedLevel > 0.1) {
                            console.log("🎤 Audio detected:", normalizedLevel.toFixed(3));
                        }

                        requestAnimationFrame(updateAudioLevel);
                    } catch (error) {
                        console.error("Audio analysis error:", error);
                        requestAnimationFrame(updateAudioLevel);
                    }
                };

                updateAudioLevel();
            } catch (error) {
                console.error("❌ Microphone access error:", error);

                if (error instanceof Error) {
                    if (error.name === "NotFoundError") {
                        console.warn("No microphone found");
                    } else if (error.name === "NotAllowedError") {
                        console.warn("Microphone permission denied");
                    } else if (error.name === "NotReadableError") {
                        console.warn("Microphone in use by another app");
                    }
                }

                setIsListening(false);
                setAudioLevel(0);
            }
        } else {
            console.log("🔇 Stopping microphone...");
            try {
                if (micStreamRef.current) {
                    micStreamRef.current.getTracks().forEach((track: MediaStreamTrack) => track.stop());
                    micStreamRef.current = null;
                }
                if (audioContextRef.current && audioContextRef.current.state !== "closed") {
                    await audioContextRef.current.close();
                    audioContextRef.current = null;
                }
                analyserRef.current = null;
                announceToScreenReader("Microphone deactivated");
                console.log("✅ Microphone stopped");
            } catch (error) {
                console.error("Error stopping microphone:", error);
            }

            setIsListening(false);
            setAudioLevel(0);
        }
    }, [isListening, announceToScreenReader]);

    const togglePlayPause = useCallback(() => {
        setIsPlaying((prev) => !prev);
    }, []);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (sessionState === "active") {
                switch (e.key) {
                    case " ":
                    case "Spacebar":
                        e.preventDefault();
                        togglePlayPause();
                        announceToScreenReader(isPlaying ? "Session paused" : "Session resumed");
                        break;
                    case "Escape":
                        if (showSettings) {
                            setShowSettings(false);
                            announceToScreenReader("Settings closed");
                        }
                        break;
                    case "m":
                    case "M":
                        e.preventDefault();
                        toggleMicrophone();
                        break;
                    case "s":
                    case "S":
                        e.preventDefault();
                        setShowSettings(!showSettings);
                        announceToScreenReader(showSettings ? "Settings closed" : "Settings opened");
                        break;
                }
            }
        },
        [sessionState, isPlaying, showSettings, togglePlayPause, toggleMicrophone, announceToScreenReader]
    );

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    useEffect(() => {
        if (showSettings && settingsRef.current) {
            const firstFocusable = settingsRef.current.querySelector("button") as HTMLElement;
            firstFocusable?.focus();
        }
    }, [showSettings]);

    useEffect(() => {
        const initializeZones = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            const zones: TouchZone[] = [
                {
                    id: "zone-1",
                    x: width * 0.25,
                    y: height * 0.3,
                    radius: 80,
                    isActive: false,
                    holdDuration: 0,
                    lastTouchTime: 0,
                },
                {
                    id: "zone-2",
                    x: width * 0.75,
                    y: height * 0.3,
                    radius: 80,
                    isActive: false,
                    holdDuration: 0,
                    lastTouchTime: 0,
                },
                {
                    id: "zone-3",
                    x: width * 0.5,
                    y: height * 0.7,
                    radius: 80,
                    isActive: false,
                    holdDuration: 0,
                    lastTouchTime: 0,
                },
            ];

            setTouchZones(zones);
        };

        initializeZones();
        window.addEventListener("resize", initializeZones);
        return () => window.removeEventListener("resize", initializeZones);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setTouchZones((prevZones) =>
                prevZones.map((zone) => {
                    if (zone.isActive) {
                        return {
                            ...zone,
                            holdDuration: Date.now() - zone.lastTouchTime,
                        };
                    }
                    return zone;
                })
            );
        }, 50);

        return () => clearInterval(interval);
    }, []);

    const isPointInZone = useCallback((x: number, y: number, zone: TouchZone): boolean => {
        const distance = Math.sqrt((x - zone.x) ** 2 + (y - zone.y) ** 2);
        return distance <= zone.radius;
    }, []);

    const startSession = useCallback(() => {
        setSessionState("active");
        setTimeRemaining(sessionDuration * 60);
        setIsPlaying(true);
        setPhaseIndex(0);
        setBreathingPhase("inhale");
        setPhaseTimer(4);
        setPhaseStartTime(Date.now());
        setPhaseDuration(0);
    }, [sessionDuration]);

    const triggerHapticFeedback = useCallback(() => {
        if ("vibrate" in navigator) {
            navigator.vibrate([100, 50, 100]);
        }
    }, []);

    useEffect(() => {
        if (!isPlaying || sessionState !== "active") return;

        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    setSessionState("complete");
                    setIsPlaying(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isPlaying, sessionState]);

    useEffect(() => {
        if (!isPlaying || sessionState !== "active") return;

        const phaseInterval = setInterval(() => {
            setPhaseTimer((prev) => {
                if (prev <= 1) {
                    let newPhaseDuration = 4;

                    setPhaseIndex((currentIndex) => {
                        const nextIndex = (currentIndex + 1) % breathingPhases.length;
                        const nextPhase = breathingPhases[nextIndex];

                        setBreathingPhase(nextPhase);
                        setPhaseStartTime(Date.now());
                        setPhaseDuration(0);

                        newPhaseDuration = phaseDurations[nextIndex];

                        if (nextPhase === "exhale") {
                            triggerHapticFeedback();
                        }

                        return nextIndex;
                    });

                    return newPhaseDuration;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(phaseInterval);
    }, [isPlaying, sessionState, triggerHapticFeedback]);

    useEffect(() => {
        if (!isPlaying || sessionState !== "active") return;

        const interval = setInterval(() => {
            setPhaseDuration(Date.now() - phaseStartTime);
        }, 100);

        return () => clearInterval(interval);
    }, [isPlaying, sessionState, phaseStartTime]);

    const handleTouchStart = useCallback(
        (e: React.TouchEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest("button") || target.classList.contains("z-10") || target.closest(".z-10")) {
                return;
            }

            e.preventDefault();
            const currentTime = Date.now();

            const touches = Array.from(e.touches).map((touch) => {
                const touchPoint: TouchPoint = {
                    id: touch.identifier,
                    x: touch.clientX,
                    y: touch.clientY,
                    startTime: currentTime,
                    isInZone: false,
                };

                const touchedZone = touchZones.find((zone) => isPointInZone(touch.clientX, touch.clientY, zone));
                if (touchedZone) {
                    touchPoint.isInZone = true;
                    touchPoint.zoneId = touchedZone.id;

                    setTouchZones((prevZones) =>
                        prevZones.map((zone) =>
                            zone.id === touchedZone.id ? { ...zone, isActive: true, lastTouchTime: currentTime, holdDuration: 0 } : zone
                        )
                    );
                }

                return touchPoint;
            });

            setTouchPoints((prev) => [...prev, ...touches]);
        },
        [touchZones, isPointInZone]
    );

    const handleTouchMove = useCallback(
        (e: React.TouchEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest("button") || target.classList.contains("z-10") || target.closest(".z-10")) {
                return;
            }

            e.preventDefault();

            const updatedTouches = Array.from(e.touches).map((touch) => {
                const existingTouch = touchPoints.find((t) => t.id === touch.identifier);

                const touchPoint: TouchPoint = {
                    id: touch.identifier,
                    x: touch.clientX,
                    y: touch.clientY,
                    startTime: existingTouch?.startTime || Date.now(),
                    previousX: existingTouch?.x,
                    previousY: existingTouch?.y,
                    isInZone: false,
                };

                const touchedZone = touchZones.find((zone) => isPointInZone(touch.clientX, touch.clientY, zone));
                if (touchedZone) {
                    touchPoint.isInZone = true;
                    touchPoint.zoneId = touchedZone.id;
                } else {
                    if (existingTouch?.zoneId) {
                        setTouchZones((prevZones) =>
                            prevZones.map((zone) =>
                                zone.id === existingTouch.zoneId ? { ...zone, isActive: false, holdDuration: 0 } : zone
                            )
                        );
                    }
                }

                return touchPoint;
            });

            setTouchPoints(updatedTouches);
        },
        [touchPoints, touchZones, isPointInZone]
    );

    const handleTouchEnd = useCallback(
        (e: React.TouchEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest("button") || target.classList.contains("z-10") || target.closest(".z-10")) {
                return;
            }

            e.preventDefault();

            const remainingTouchIds = Array.from(e.touches).map((touch) => touch.identifier);
            const endedTouches = touchPoints.filter((touch) => !remainingTouchIds.includes(touch.id));

            endedTouches.forEach((endedTouch) => {
                if (endedTouch.zoneId) {
                    setTouchZones((prevZones) =>
                        prevZones.map((zone) => (zone.id === endedTouch.zoneId ? { ...zone, isActive: false, holdDuration: 0 } : zone))
                    );
                }
            });

            const remainingTouches = Array.from(e.touches).map((touch) => {
                const existingTouch = touchPoints.find((t) => t.id === touch.identifier);
                return {
                    id: touch.identifier,
                    x: touch.clientX,
                    y: touch.clientY,
                    startTime: existingTouch?.startTime || Date.now(),
                    previousX: existingTouch?.x,
                    previousY: existingTouch?.y,
                    isInZone: existingTouch?.isInZone || false,
                    zoneId: existingTouch?.zoneId,
                };
            });

            setTouchPoints(remainingTouches);
        },
        [touchPoints]
    );

    const formatTime = useCallback((seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }, []);

    const getPhaseColorWithDuration = useCallback((basePhase: string, duration: number, maxDuration: number) => {
        const progress = Math.min(duration / (maxDuration * 1000), 1);

        const colorMaps = {
            inhale: {
                start: { r: 132, g: 204, b: 22 },
                end: { r: 34, g: 197, b: 94 },
            },
            exhale: {
                start: { r: 249, g: 115, b: 22 },
                end: { r: 239, g: 68, b: 68 },
            },
            hold: {
                start: { r: 6, g: 182, b: 212 },
                end: { r: 147, g: 51, b: 234 },
            },
        };

        const colorMap = colorMaps[basePhase as keyof typeof colorMaps] || colorMaps["hold"];

        const r = Math.round(colorMap.start.r + (colorMap.end.r - colorMap.start.r) * progress);
        const g = Math.round(colorMap.start.g + (colorMap.end.g - colorMap.start.g) * progress);
        const b = Math.round(colorMap.start.b + (colorMap.end.b - colorMap.start.b) * progress);

        return `rgb(${r}, ${g}, ${b})`;
    }, []);

    const getCurrentPhaseColor = useCallback(() => {
        const maxDuration = phaseDurations[phaseIndex];
        return getPhaseColorWithDuration(breathingPhase, phaseDuration, maxDuration);
    }, [breathingPhase, phaseDuration, phaseIndex, getPhaseColorWithDuration]);

    const getPhaseColorCSS = useCallback(() => {
        const currentColor = getCurrentPhaseColor();
        const match = currentColor.match(/rgb\((\d+), (\d+), (\d+)\)/);
        if (match) {
            const [, r, g, b] = match;
            const hex = `#${parseInt(r).toString(16).padStart(2, "0")}${parseInt(g).toString(16).padStart(2, "0")}${parseInt(b)
                .toString(16)
                .padStart(2, "0")}`;
            return hex;
        }
        return "var(--accent-primary)";
    }, [getCurrentPhaseColor]);

    const getPhaseColor = useCallback(() => {
        return getPhaseColorCSS();
    }, [getPhaseColorCSS]);

    const getPhaseText = useCallback(() => {
        switch (breathingPhase) {
            case "inhale":
                return "Breathe In...";
            case "exhale":
                return "Breathe Out...";
            case "hold":
                return "Hold...";
            default:
                return "Focus...";
        }
    }, [breathingPhase]);

    if (sessionState === "setup") {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <a
                    ref={skipLinkRef}
                    href="#main-content"
                    onClick={(e) => {
                        e.preventDefault();
                        skipToMain();
                    }}
                    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--accent-primary)] focus:text-white focus:rounded"
                >
                    Skip to main content
                </a>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[var(--card-bg)] rounded-3xl p-8 shadow-[var(--shadow-lg)] border border-[var(--card-border)] max-w-md w-full text-center"
                    role="main"
                    aria-labelledby="setup-title"
                    aria-describedby="setup-description"
                >
                    <h1 id="setup-title" className="text-3xl font-[var(--font-heading)] mb-2">
                        New Mindfulness Minute
                    </h1>

                    <div
                        className="text-8xl font-bold mb-4"
                        style={{ color: getCurrentPhaseColor() }}
                        role="img"
                        aria-label={`${sessionDuration} minutes selected for meditation session`}
                    >
                        {sessionDuration}
                    </div>

                    <p id="setup-description" className="text-[var(--page-text-secondary)] mb-6">
                        I will meditate for {sessionDuration} minutes
                    </p>

                    <div
                        className="text-sm text-[var(--page-text-secondary)] mb-8 p-4 bg-[var(--button-bg)] rounded-xl flex items-start gap-3"
                        role="note"
                        aria-labelledby="instructions-title"
                    >
                        <FaLightbulb className="text-[var(--accent-primary)] mt-0.5 flex-shrink-0" aria-hidden="true" />
                        <div className="text-left">
                            <strong id="instructions-title">Touch Zones:</strong> Hold circular zones to generate flowing particle patterns.
                            Move your finger to create particle trails!
                        </div>
                    </div>

                    <fieldset className="mb-8">
                        <legend className="sr-only">Select session duration</legend>
                        <div className="flex justify-center gap-2" role="radiogroup" aria-labelledby="duration-label" aria-required="true">
                            <span id="duration-label" className="sr-only">
                                Session duration options
                            </span>
                            {[5, 10, 15, 20].map((duration) => (
                                <button
                                    key={duration}
                                    onClick={() => {
                                        setSessionDuration(duration);
                                        announceToScreenReader(`${duration} minute session selected`);
                                    }}
                                    className={`cursor-pointer px-4 py-2 rounded-full transition-all ${
                                        sessionDuration === duration
                                            ? "bg-[var(--accent-primary)] text-white"
                                            : "bg-[var(--button-bg)] hover:bg-[var(--button-hover)]"
                                    }`}
                                    role="radio"
                                    aria-checked={sessionDuration === duration}
                                    aria-label={`${duration} minute session`}
                                    tabIndex={sessionDuration === duration ? 0 : -1}
                                    onKeyDown={(e) => {
                                        if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                                            e.preventDefault();
                                            const currentIndex = [5, 10, 15, 20].indexOf(duration);
                                            const newIndex = currentIndex > 0 ? currentIndex - 1 : 3;
                                            const newDuration = [5, 10, 15, 20][newIndex];
                                            setSessionDuration(newDuration);
                                            announceToScreenReader(`${newDuration} minute session selected`);
                                        } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                                            e.preventDefault();
                                            const currentIndex = [5, 10, 15, 20].indexOf(duration);
                                            const newIndex = currentIndex < 3 ? currentIndex + 1 : 0;
                                            const newDuration = [5, 10, 15, 20][newIndex];
                                            setSessionDuration(newDuration);
                                            announceToScreenReader(`${newDuration} minute session selected`);
                                        }
                                    }}
                                >
                                    {duration}m
                                </button>
                            ))}
                        </div>
                    </fieldset>

                    <button
                        onClick={() => {
                            startSession();
                            announceToScreenReader(`Starting ${sessionDuration} minute meditation session`);
                        }}
                        className="cursor-pointer w-full bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90 text-white py-4 rounded-2xl font-semibold text-lg transition-colors"
                        aria-describedby="session-info"
                    >
                        Continue →
                    </button>

                    <p id="session-info" className="text-xs text-[var(--page-text-secondary)] mt-4">
                        Timer finishes at{" "}
                        {new Date(Date.now() + sessionDuration * 60000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>

                    <div className="sr-only">
                        <h2>Keyboard Navigation Instructions</h2>
                        <ul>
                            <li>Use arrow keys to select session duration</li>
                            <li>Press Enter or Space to start session</li>
                            <li>During session: Spacebar to pause, M for microphone, S for settings</li>
                        </ul>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (sessionState === "complete") {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <a
                    ref={skipLinkRef}
                    href="#completion-content"
                    onClick={(e) => {
                        e.preventDefault();
                        skipToMain();
                    }}
                    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--accent-primary)] focus:text-white focus:rounded"
                >
                    Skip to main content
                </a>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[var(--card-bg)] rounded-3xl p-8 shadow-[var(--shadow-lg)] border border-[var(--card-border)] max-w-md w-full text-center"
                    role="main"
                    id="completion-content"
                    aria-labelledby="completion-title"
                    aria-describedby="completion-description"
                >
                    <div role="status" aria-live="polite" className="sr-only">
                        Meditation session completed successfully. You meditated for {sessionDuration} minutes.
                    </div>

                    <div
                        className="text-6xl mb-4 flex justify-center"
                        role="img"
                        aria-label="Heart icon representing completed meditation session"
                    >
                        <FaHandHoldingHeart className="text-[var(--accent-primary)]" aria-hidden="true" />
                    </div>

                    <h2 id="completion-title" className="text-2xl font-[var(--font-heading)] mb-4">
                        Session Complete!
                    </h2>

                    <p id="completion-description" className="text-[var(--page-text-secondary)] mb-8">
                        You meditated for {sessionDuration} minutes. Well done!
                    </p>

                    <button
                        onClick={() => {
                            setSessionState("setup");
                            setTimeRemaining(0);
                            setPhaseTimer(4);
                            setBreathingPhase("inhale");
                            setPhaseIndex(0);
                            announceToScreenReader("Starting new meditation session setup");
                        }}
                        className="cursor-pointer w-full bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90 text-white py-4 rounded-2xl font-semibold text-lg transition-colors"
                        aria-label="Start a new meditation session"
                        autoFocus
                    >
                        Start New Session
                    </button>

                    <div className="sr-only">
                        <h3>Session Statistics</h3>
                        <p>Congratulations on completing your {sessionDuration}-minute meditation session.</p>
                        <p>Regular meditation practice can help reduce stress and improve focus.</p>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen relative overflow-hidden select-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ backgroundColor: "var(--page-bg)" }}
        >
            <a
                ref={skipLinkRef}
                href="#main-session-content"
                onClick={(e) => {
                    e.preventDefault();
                    skipToMain();
                }}
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--accent-primary)] focus:text-white focus:rounded"
            >
                Skip to main meditation session
            </a>

            <div role="status" aria-live="polite" aria-atomic="true" className="sr-only" id="session-announcements">
                {announcements}
            </div>

            <div
                role="timer"
                aria-live="polite"
                aria-atomic="false"
                className="sr-only"
                aria-label={`Session timer: ${formatTime(timeRemaining)} remaining`}
            >
                {Math.floor(timeRemaining / 60) === 0 && timeRemaining <= 60 && timeRemaining > 0 && `${timeRemaining} seconds remaining`}
            </div>

            <header className="sr-only">
                <h1>Mindfulness Meditation Session</h1>
                <p>
                    Current phase: {getPhaseText()}. Time remaining: {formatTime(timeRemaining)}. Session status:{" "}
                    {isPlaying ? "Active" : "Paused"}.
                </p>
            </header>

            <ParticleSystem
                touchPoints={touchPoints}
                touchZones={touchZones}
                breathingPhase={breathingPhase}
                audioLevel={audioLevel}
                isActive={sessionState === "active"}
                phaseDuration={phaseDuration}
                phaseIndex={phaseIndex}
                getPhaseColorWithDuration={getPhaseColorWithDuration}
                phaseDurations={phaseDurations}
            />

            <main
                id="main-session-content"
                ref={mainContentRef}
                className="breathing-indicator"
                tabIndex={-1}
                role="main"
                aria-labelledby="breathing-phase"
                aria-describedby="session-timer phase-timer"
            >
                <motion.div
                    animate={{
                        scale: breathingPhase === "inhale" ? 1.2 : breathingPhase === "exhale" ? 0.8 : 1,
                        color: getPhaseColor(),
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="text-center"
                >
                    <div
                        id="breathing-phase"
                        className="text-4xl md:text-6xl font-[var(--font-heading)] mb-4"
                        role="heading"
                        aria-level={2}
                        aria-live="assertive"
                    >
                        {getPhaseText()}
                    </div>

                    <div
                        id="session-timer"
                        className="text-8xl md:text-9xl font-bold mb-2"
                        role="timer"
                        aria-label={`Session time remaining: ${formatTime(timeRemaining)}`}
                        aria-atomic="true"
                    >
                        {formatTime(timeRemaining)}
                    </div>

                    <div
                        id="phase-timer"
                        className="text-xl text-[var(--page-text-secondary)]"
                        role="timer"
                        aria-label={`Current phase time: ${phaseTimer} seconds`}
                        aria-atomic="true"
                    >
                        {phaseTimer}s
                    </div>

                    {isListening && (
                        <motion.div
                            animate={{
                                scale: [1, 1 + audioLevel * 0.5, 1],
                                opacity: [0.7, 1, 0.7],
                            }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                            className="mt-4 p-3 rounded-2xl"
                            style={{
                                backgroundColor: `${getPhaseColor()}20`,
                                border: `2px solid ${getPhaseColor()}`,
                            }}
                            role="status"
                            aria-labelledby="focus-mode-title"
                            aria-describedby="audio-level-description"
                        >
                            <div id="focus-mode-title" className="text-lg font-semibold mb-2 flex items-center justify-center gap-2">
                                <FaMicrophone aria-hidden="true" /> Focus Mode Active
                            </div>

                            <div id="audio-level-description" className="text-sm" aria-live="polite">
                                Audio Level: {(audioLevel * 100).toFixed(0)}%
                            </div>

                            <div
                                className="w-32 h-2 bg-black/20 rounded-full mx-auto mt-2 overflow-hidden"
                                role="progressbar"
                                aria-valuenow={Math.round(audioLevel * 100)}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-label={`Audio input level: ${Math.round(audioLevel * 100)} percent`}
                            >
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{ backgroundColor: getPhaseColor() }}
                                    animate={{ width: `${audioLevel * 100}%` }}
                                    transition={{ duration: 0.1 }}
                                />
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </main>

            <section aria-labelledby="touch-zones-title" className="absolute inset-0">
                <h2 id="touch-zones-title" className="sr-only">
                    Interactive Touch Zones for Particle Generation
                </h2>
                <p className="sr-only">
                    Three circular zones are available for interaction. Touch and hold or press Enter/Space while focused to generate
                    particle effects. Move your finger while touching to create particle trails.
                </p>

                {touchZones.map((zone, index) => (
                    <div
                        key={zone.id}
                        tabIndex={0}
                        role="button"
                        className="absolute rounded-full border-2 transition-all duration-300 pointer-events-auto cursor-pointer"
                        style={{
                            left: zone.x - zone.radius,
                            top: zone.y - zone.radius,
                            width: zone.radius * 2,
                            height: zone.radius * 2,
                            borderColor: zone.isActive ? getPhaseColor() : "rgba(255,255,255,0.3)",
                            backgroundColor: zone.isActive ? `${getPhaseColor()}20` : "rgba(255,255,255,0.05)",
                            transform: zone.isActive ? "scale(1.1)" : "scale(1)",
                            boxShadow: zone.isActive ? `0 0 20px ${getPhaseColor()}40` : "0 0 10px rgba(255,255,255,0.1)",
                            zIndex: 1,
                        }}
                        aria-label={`Touch zone ${index + 1} of 3 - ${zone.isActive ? "Active" : "Inactive"}`}
                        aria-describedby={`zone-${index + 1}-description`}
                        aria-pressed={zone.isActive}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                announceToScreenReader(`Touch zone ${index + 1} activated - generating particles`);
                            }
                        }}
                        onFocus={() => {
                            announceToScreenReader(`Focused on touch zone ${index + 1}. Press Enter or Space to activate`);
                        }}
                    >
                        <div id={`zone-${index + 1}-description`} className="sr-only">
                            Touch zone {index + 1}. Press Enter or Space to activate particle generation.
                            {zone.isActive && ` Currently active for ${Math.floor(zone.holdDuration / 100) / 10} seconds.`}
                        </div>

                        {zone.isActive && (
                            <div className="absolute inset-0 flex items-center justify-center" aria-live="polite">
                                <div className="text-center">
                                    <div
                                        className="text-white text-sm font-semibold"
                                        aria-label={`Hold duration: ${Math.floor(zone.holdDuration / 100) / 10} seconds`}
                                    >
                                        {Math.floor(zone.holdDuration / 100) / 10}s
                                    </div>
                                    <div className="text-xs text-white/80 mt-1">Hold to intensify</div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </section>

            <nav className="absolute top-6 left-6 right-6 flex justify-between items-center z-20" aria-label="Session controls">
                <button
                    onClick={() => {
                        setShowSettings(!showSettings);
                        announceToScreenReader(showSettings ? "Settings panel closed" : "Settings panel opened");
                    }}
                    tabIndex={0}
                    className="cursor-pointer p-3 bg-[var(--card-bg)]/80 backdrop-blur-sm rounded-full shadow-[var(--shadow-md)] border border-[var(--card-border)] pointer-events-auto hover:bg-[var(--card-bg)] transition-colors"
                    aria-label="Open settings menu"
                    aria-expanded={showSettings}
                    aria-controls="settings-panel"
                    aria-describedby="settings-description"
                >
                    <FaCog size={18} aria-hidden="true" />
                </button>
                <div id="settings-description" className="sr-only">
                    Settings menu. Contains theme options, audio controls, and session information.
                </div>

                <div className="text-center pointer-events-none" role="status" aria-live="polite" aria-atomic="true">
                    <div className="text-sm text-[var(--page-text-secondary)]" aria-label={`Current breathing phase: ${breathingPhase}`}>
                        {breathingPhase.charAt(0).toUpperCase() + breathingPhase.slice(1)}
                    </div>
                    {isListening && (
                        <div
                            className="text-xs text-[var(--accent-primary)] mt-1 flex items-center gap-1 justify-center"
                            aria-label="Audio mode active - particles responding to sound"
                        >
                            <FaMicrophone size={10} aria-hidden="true" />
                            Audio Mode - Particles Dancing!
                        </div>
                    )}
                </div>

                <button
                    onClick={() => {
                        toggleMicrophone();
                        announceToScreenReader(
                            isListening ? "Microphone disabled - focus mode deactivated" : "Microphone enabled - focus mode activated"
                        );
                    }}
                    tabIndex={0}
                    className={`cursor-pointer p-3 backdrop-blur-sm rounded-full shadow-[var(--shadow-md)] border border-[var(--card-border)] pointer-events-auto transition-all hover:scale-105 ${
                        isListening ? "bg-[var(--accent-primary)] text-white" : "bg-[var(--card-bg)]/80 hover:bg-[var(--card-bg)]"
                    }`}
                    aria-label={isListening ? "Disable microphone and focus mode" : "Enable microphone for focus mode"}
                    aria-pressed={isListening}
                    aria-describedby="microphone-description"
                >
                    {isListening ? <FaMicrophone size={18} aria-hidden="true" /> : <FaMicrophoneSlash size={18} aria-hidden="true" />}
                </button>
                <div id="microphone-description" className="sr-only">
                    {isListening
                        ? "Microphone is currently active. Particles will respond to your voice and sounds. Press M or click to disable."
                        : "Microphone is currently disabled. Press M or click to enable focus mode where particles respond to sound."}
                </div>
            </nav>

            <div className="absolute bottom-6 left-6 right-6 flex justify-center z-20" role="group" aria-labelledby="session-control-title">
                <h2 id="session-control-title" className="sr-only">
                    Session Control
                </h2>
                <button
                    onClick={() => {
                        togglePlayPause();
                        announceToScreenReader(
                            isPlaying
                                ? "Session paused. Press spacebar or this button to resume."
                                : "Session resumed. Meditation continues."
                        );
                    }}
                    tabIndex={0}
                    className="cursor-pointer p-6 bg-[var(--card-bg)]/90 backdrop-blur-sm rounded-full shadow-[var(--shadow-lg)] border border-[var(--card-border)] hover:scale-105 transition-transform pointer-events-auto focus:scale-105"
                    aria-label={isPlaying ? "Pause meditation session (Spacebar)" : "Resume meditation session (Spacebar)"}
                    aria-pressed={isPlaying}
                    aria-describedby="session-control-description"
                >
                    {isPlaying ? <FaPause size={24} aria-hidden="true" /> : <FaPlay size={24} aria-hidden="true" />}
                </button>
                <div id="session-control-description" className="sr-only">
                    Main session control. Use spacebar as a keyboard shortcut to toggle play/pause. Current state:{" "}
                    {isPlaying ? "Session is active" : "Session is paused"}.
                </div>
            </div>

            <AnimatePresence>
                {showSettings && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-20 left-6 right-6 bg-[var(--card-bg)]/95 backdrop-blur-sm rounded-2xl p-6 shadow-[var(--shadow-lg)] border border-[var(--card-border)] z-20"
                        ref={settingsRef}
                        role="dialog"
                        id="settings-panel"
                        aria-labelledby="settings-title"
                        aria-describedby="settings-description"
                        aria-modal="true"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 id="settings-title" className="font-[var(--font-heading)] text-lg">
                                Settings
                            </h3>
                            <button
                                onClick={() => {
                                    setShowSettings(false);
                                    announceToScreenReader("Settings panel closed");
                                }}
                                className="cursor-pointer text-[var(--page-text-secondary)] hover:text-[var(--page-text-primary)] p-1 rounded focus:outline-none"
                                aria-label="Close settings panel"
                                onKeyDown={(e) => {
                                    if (e.key === "Escape") {
                                        setShowSettings(false);
                                        announceToScreenReader("Settings panel closed");
                                    }
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        <div id="settings-description" className="sr-only">
                            Settings panel for meditation session. Contains theme selection, audio controls, and session information. Use
                            Tab to navigate between options, Escape to close.
                        </div>

                        <div className="space-y-4">
                            <fieldset>
                                <legend className="block text-sm mb-2 font-medium">Theme</legend>
                                <div className="flex gap-2" role="radiogroup" aria-labelledby="theme-legend" aria-required="false">
                                    <button
                                        onClick={() => {
                                            setTheme("light");
                                            announceToScreenReader("Light theme selected");
                                        }}
                                        className={`cursor-pointer px-3 py-2 rounded-lg transition-colors ${
                                            theme === "light"
                                                ? "bg-[var(--accent-primary)] text-white"
                                                : "bg-[var(--button-bg)] hover:bg-[var(--button-hover)]"
                                        }`}
                                        role="radio"
                                        aria-checked={theme === "light"}
                                        aria-label="Light theme"
                                        tabIndex={theme === "light" ? 0 : -1}
                                    >
                                        Light
                                    </button>
                                    <button
                                        onClick={() => {
                                            setTheme("dark");
                                            announceToScreenReader("Dark theme selected");
                                        }}
                                        className={`cursor-pointer px-3 py-2 rounded-lg transition-colors ${
                                            theme === "dark"
                                                ? "bg-[var(--accent-primary)] text-white"
                                                : "bg-[var(--button-bg)] hover:bg-[var(--button-hover)]"
                                        }`}
                                        role="radio"
                                        aria-checked={theme === "dark"}
                                        aria-label="Dark theme"
                                        tabIndex={theme === "dark" ? 0 : -1}
                                    >
                                        Dark
                                    </button>
                                </div>
                            </fieldset>

                            <div>
                                <label className="block text-sm mb-2 font-medium">Audio Level</label>
                                <div
                                    className="h-2 bg-[var(--button-bg)] rounded-full overflow-hidden"
                                    role="progressbar"
                                    aria-valuenow={Math.round(audioLevel * 100)}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                    aria-label={`Current audio input level: ${Math.round(audioLevel * 100)} percent`}
                                >
                                    <div
                                        className="h-full bg-[var(--accent-primary)] transition-all duration-100"
                                        style={{ width: `${audioLevel * 100}%` }}
                                    />
                                </div>
                                <div className="text-xs text-[var(--page-text-secondary)] mt-1">
                                    Current level: {Math.round(audioLevel * 100)}%{!isListening && " (Microphone disabled)"}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm mb-2 font-medium">Active Touch Zones</label>
                                <div
                                    className="text-sm text-[var(--page-text-secondary)] flex items-center gap-2"
                                    role="status"
                                    aria-live="polite"
                                >
                                    <FaCircle size={8} className="text-[var(--accent-primary)]" aria-hidden="true" />
                                    <span
                                        aria-label={`${touchZones.filter((zone) => zone.isActive).length} of ${
                                            touchZones.length
                                        } touch zones currently active`}
                                    >
                                        {touchZones.filter((zone) => zone.isActive).length} of {touchZones.length} zones active
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm mb-2 font-medium">Current Phase</label>
                                <div
                                    className="text-lg font-semibold"
                                    style={{ color: getPhaseColor() }}
                                    aria-live="polite"
                                    aria-atomic="true"
                                >
                                    <span
                                        aria-label={`Current breathing phase: ${getPhaseText()}, ${phaseTimer} seconds remaining in this phase`}
                                    >
                                        {getPhaseText()} ({phaseTimer}s remaining)
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm mb-2 font-medium">Phase Progress</label>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>{getPhaseText()}</span>
                                        <span
                                            aria-label={`${Math.floor(phaseDuration / 1000)} seconds elapsed of ${
                                                phaseDurations[phaseIndex]
                                            } total seconds`}
                                        >
                                            {Math.floor(phaseDuration / 1000)}s / {phaseDurations[phaseIndex]}s
                                        </span>
                                    </div>
                                    <div
                                        className="h-2 bg-[var(--button-bg)] rounded-full overflow-hidden"
                                        role="progressbar"
                                        aria-valuenow={Math.min((phaseDuration / 1000 / phaseDurations[phaseIndex]) * 100, 100)}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                        aria-label={`Phase progress: ${Math.round(
                                            Math.min((phaseDuration / 1000 / phaseDurations[phaseIndex]) * 100, 100)
                                        )} percent complete`}
                                    >
                                        <div
                                            className="h-full transition-all duration-100 rounded-full"
                                            style={{
                                                width: `${Math.min((phaseDuration / 1000 / phaseDurations[phaseIndex]) * 100, 100)}%`,
                                                backgroundColor: getPhaseColor(),
                                            }}
                                        />
                                    </div>
                                    <div className="text-xs text-[var(--page-text-secondary)]">
                                        Color transitions based on breath duration
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm mb-2 font-medium flex items-center gap-2">
                                    Audio Level
                                    {isListening ? (
                                        <FaVolumeUp size={12} aria-label="Microphone active" />
                                    ) : (
                                        <FaVolumeMute size={12} aria-label="Microphone disabled" />
                                    )}
                                </label>
                                <div
                                    className="h-2 bg-[var(--button-bg)] rounded-full overflow-hidden"
                                    role="progressbar"
                                    aria-valuenow={Math.round(audioLevel * 100)}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                    aria-label={`Audio input level: ${Math.round(audioLevel * 100)} percent`}
                                >
                                    <div
                                        className="h-full transition-all duration-100 rounded-full"
                                        style={{
                                            width: `${audioLevel * 100}%`,
                                            backgroundColor: isListening ? getPhaseColor() : "var(--page-text-secondary)",
                                        }}
                                    />
                                </div>
                                <div className="text-xs text-[var(--page-text-secondary)] mt-1">
                                    Level: {(audioLevel * 100).toFixed(1)}%{isListening && audioLevel > 0.1 && " - Particles dancing!"}
                                </div>
                            </div>
                        </div>

                        <div className="sr-only">
                            <h4>Settings Navigation</h4>
                            <ul>
                                <li>Tab: Move between controls</li>
                                <li>Spacebar/Enter: Activate buttons</li>
                                <li>Arrow keys: Navigate radio groups</li>
                                <li>Escape: Close settings panel</li>
                            </ul>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function MeditationApp() {
    return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <GlobalThemeStyles />
            <BreathingSession />
        </ThemeProvider>
    );
}
