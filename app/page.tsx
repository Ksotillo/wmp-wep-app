"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { MdRepeat, MdShuffle } from "react-icons/md";
import { IoMdFolderOpen } from "react-icons/io";
import { Raleway, Source_Sans_3 } from "next/font/google";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

declare global {
    interface Window {
        webkitAudioContext: typeof AudioContext;
    }
}

interface Track {
    id: string;
    title: string;
    artist: string;
    album: string;
    duration: string;
    path: string;
    image: string;
    isLocal?: boolean;
}

interface ColorPalette {
    from: string;
    to: string;
    accent: string;
    bg1: string;
    bg2: string;
}

interface NavItem {
    id: string;
    label: string;
}

interface VisualizerConfig {
    name: string;
    draw: (ctx: CanvasRenderingContext2D, width: number, height: number, time: number, props: {
        hexToRgb: (hex: string) => string;
        getCurrentPalette: () => ColorPalette;
        currentTrack: number;
        albumImageCache: { [key: number]: HTMLImageElement };
        getCombinedPlaylist: () => Track[];
        analyserRef: React.MutableRefObject<AnalyserNode | null>;
        dataArrayRef: React.MutableRefObject<Uint8Array | null>;
    }) => void;
}

const raleway = Raleway({ 
    subsets: ['latin'],
    variable: '--font-raleway'
});

const sourceSansPro = Source_Sans_3({
    weight: ['400', '600', '700'],
    subsets: ['latin'],
    variable: '--font-source-sans-pro'
});


const TRACK_IDS = {
    TRACK1: "built-in-1",
    TRACK2: "built-in-2",
    TRACK3: "built-in-3",
    TRACK4: "built-in-4"
};

const WinMediaPlayer = () => {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [currentTrack, setCurrentTrack] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [volume, setVolume] = useState<number>(80);
    const [isMuted, setIsMuted] = useState<boolean>(false);
    const [isShuffled, setIsShuffled] = useState<boolean>(false);
    const [isRepeating, setIsRepeating] = useState<boolean>(false);
    const [visualizerMode, setVisualizerMode] = useState<string>("classic");
    const [albumImageCache, setAlbumImageCache] = useState<{ [key: number]: HTMLImageElement }>({});
    const [previousVolume, setPreviousVolume] = useState<number>(80);
    const [customTracks, setCustomTracks] = useState<Track[]>([]);
    const [activeNavItem, setActiveNavItem] = useState<string>("now-playing");
    const [showSkinChooser, setShowSkinChooser] = useState<boolean>(false);
    const [currentSkin, setCurrentSkin] = useState<number>(0);
    const [animationActive, setAnimationActive] = useState<boolean>(false);
    const [showTrackInfo, setShowTrackInfo] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isClient, setIsClient] = useState(false);
    
    const timeRef = useRef<number>(Math.random() * 1000); 

    const audioRef = useRef<HTMLAudioElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const dataArrayRef = useRef<Uint8Array | null>(null);

    
    useEffect(() => {
        setIsClient(true);
        
        
        const setupCanvas = () => {
            if (!canvasRef.current) return;
            
            const canvas = canvasRef.current;
            const container = canvas.parentElement;
            
            if (container) {
                canvas.width = container.clientWidth || 800;
                canvas.height = container.clientHeight || 600;
            } else {
                
                canvas.width = 800;
                canvas.height = 600;
            }
            
            
            const ctx = canvas.getContext('2d');
            if (ctx) {
                const palette = getCurrentPalette();
                const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
                gradient.addColorStop(0, palette.bg1);
                gradient.addColorStop(1, palette.bg2);
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        };
        
        
        setupCanvas();
        
        
        setTimeout(() => {
            startVisualizerAnimation();
        }, 50);
        
        
        window.addEventListener('resize', setupCanvas);
        
        return () => {
            window.removeEventListener('resize', setupCanvas);
            if (animationRef.current !== null) {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = null;
            }
        };
    }, []);

    const colorPalettes: ColorPalette[] = [
        { 
            from: "#53217d",
            to: "#dcb7df",
            accent: "#7b7aa9",
            bg1: "#2b325b",
            bg2: "#1f203b" 
        },
        { 
            from: "#1e3b8a",
            to: "#64dfdf",
            accent: "#5e60ce",
            bg1: "#252b42",
            bg2: "#1a1b35"
        },
        { 
            from: "#850e0e",
            to: "#ffaa5a",
            accent: "#c75146",
            bg1: "#3a2442",
            bg2: "#1f1a2d"
        },
        { 
            from: "#1e5128",
            to: "#d4e09b",
            accent: "#4a7c59",
            bg1: "#283845",
            bg2: "#1a252f"
        },
        { 
            from: "#1a1a1a",
            to: "#ffd700",
            accent: "#a1a1a1",
            bg1: "#1a1a1a",
            bg2: "#0f0f0f"
        },
        { 
            from: "#ff00ff",
            to: "#00ffff",
            accent: "#39ff14",
            bg1: "#121212",
            bg2: "#0a0a0a"
        }
    ];

    const getCurrentPalette = (): ColorPalette => {
        return colorPalettes[currentSkin];
    };

    const playlist: Track[] = [
        {
            id: TRACK_IDS.TRACK1,
            title: "No Me Conoce (Remix)",
            artist: "Jhay Cortez, J. Balvin, Bad Bunny",
            album: "Famouz",
            duration: "5:09",
            path: "https://ksotillo.github.io/wmp-wep-app/public/audio/track1.mp3",
            image: "https://i.scdn.co/image/ab67616d0000b273552837b3e37071cbf3c9dc53",
        },
        {
            id: TRACK_IDS.TRACK2,
            title: "Aerials",
            artist: "System of a Down",
            album: "Toxicity",
            duration: "3:55",
            path: "https://ksotillo.github.io/wmp-wep-app/public/audio/track2.mp3",
            image: "https://i.scdn.co/image/ab67616d00001e0230d45198d0c9e8841f9a9578",
        },
        {
            id: TRACK_IDS.TRACK3,
            title: "De Música Ligera",
            artist: "Soda Stereo",
            album: "Canción Animal",
            duration: "3:33",
            path: "https://ksotillo.github.io/wmp-wep-app/public/audio/track3.mp3",
            image: "https://i.scdn.co/image/ab67616d0000b27370c093a24bc4600b4075aef3",
        },
        {
            id: TRACK_IDS.TRACK4,
            title: "Vete",
            artist: "Bad Bunny",
            album: "YHLQMDLG",
            duration: "3:12",
            path: "https://ksotillo.github.io/wmp-wep-app/public/audio/track4.mp3",
            image: "https://i1.sndcdn.com/artworks-000643462576-ta4chz-t500x500.jpg",
        },
    ];

    const navItems: NavItem[] = [
        { id: "visualizer", label: "Visualizer" },
        { id: "skin-chooser", label: "Skin Chooser" },
        { id: "info", label: "Track Info" },
    ];

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    const getCombinedPlaylist = (): Track[] => {
        return [...playlist, ...customTracks];
    };

    const togglePlay = async (): Promise<void> => {
        if (audioRef.current) {
            try {
                if (isPlaying) {
                    
                    audioRef.current.pause();
                    setIsPlaying(false);
                } else {
                    if (!audioContextRef.current) {
                        initAudioAnalyzer();
                    }

                    const track = getCombinedPlaylist()[currentTrack];
                    
                    
                    if (!audioRef.current.src || audioRef.current.src === window.location.href || 
                        audioRef.current.src.endsWith("/") || !audioRef.current.src.includes(track?.path)) {
                        try {
                            audioRef.current.src = track?.path || "";
                            audioRef.current.load();
                            setCurrentTime(0);
                            await new Promise((resolve) => setTimeout(resolve, 100));
                        } catch (loadError) {
                            console.error("Load error:", loadError);
                            notifyError(`Failed to load audio: ${track?.title}. Please try another track.`);
                            return;
                        }
                    }

                    try {
                        await audioRef.current.play();
                        setIsPlaying(true);
                        
                        
                        if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
                            setDuration(audioRef.current.duration);
                        }
                    } catch (playError) {
                        console.error("Play error:", playError);
                        notifyError(`Failed to play audio: ${track?.title}. This may be due to autoplay restrictions or an invalid source.`);
                        setIsPlaying(false);
                    }
                }
            } catch (err) {
                console.error("Toggle play error:", err);
                notifyError("An unexpected error occurred while trying to play/pause audio.");
            }
        }
    };

    const selectTrack = (index: number): void => {
        if (currentTrack === index && isPlaying) {
            
            if (audioRef.current) {
                audioRef.current.pause();
                setIsPlaying(false);
            }
            return;
        }
        
        setCurrentTrack(index);
        setCurrentTime(0);
        
        const wasPlaying = isPlaying;
        
        
        if (wasPlaying && audioRef.current) {
            const track = getCombinedPlaylist()[index];
            try {
                audioRef.current.src = track?.path || "";
                audioRef.current.load();
                audioRef.current.play().catch(err => {
                    console.error("Failed to play selected track:", err);
                    notifyError(`Failed to play ${track?.title}. Please try another track.`);
                    setIsPlaying(false);
                });
            } catch (error) {
                console.error("Error selecting track:", error);
                notifyError(`Could not select track: ${track?.title}`);
                setIsPlaying(false);
            }
        }
        
        setIsPlaying(wasPlaying);
    };

    const nextTrack = (): void => {
        const combinedPlaylist = getCombinedPlaylist();
        const newIndex = isShuffled ? Math.floor(Math.random() * combinedPlaylist.length) : (currentTrack + 1) % combinedPlaylist.length;
        setCurrentTrack(newIndex);
        setCurrentTime(0);
        
        if (isPlaying && audioRef.current) {
            const track = combinedPlaylist[newIndex];
            try {
                audioRef.current.src = track?.path || "";
                audioRef.current.load();
                audioRef.current.play().catch(err => {
                    console.error("Failed to play next track:", err);
                    notifyError(`Failed to play ${track?.title}. Trying the next track.`);
                    
                    setTimeout(() => nextTrack(), 500);
                });
            } catch (error) {
                console.error("Error playing next track:", error);
                notifyError(`Could not play track: ${track?.title}`);
            }
        }
    };

    const prevTrack = (): void => {
        const combinedPlaylist = getCombinedPlaylist();
        const newIndex = currentTrack === 0 ? combinedPlaylist.length - 1 : currentTrack - 1;
        setCurrentTrack(newIndex);
        setCurrentTime(0);
        
        if (isPlaying && audioRef.current) {
            const track = combinedPlaylist[newIndex];
            try {
                audioRef.current.src = track?.path || "";
                audioRef.current.load();
                audioRef.current.play().catch(err => {
                    console.error("Failed to play previous track:", err);
                    notifyError(`Failed to play ${track?.title}. Trying the previous track.`);
                    
                    setTimeout(() => prevTrack(), 500);
                });
            } catch (error) {
                console.error("Error playing previous track:", error);
                notifyError(`Could not play track: ${track?.title}`);
            }
        }
    };

    
    const handleTrackEnd = React.useCallback(() => {
        if (isRepeating) {
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch((err) => {
                    console.error("Failed to replay track:", err);
                    notifyError("Failed to replay track. Playback has stopped.");
                    setIsPlaying(false);
                });
            }
        } else {
            const combinedPlaylist = getCombinedPlaylist();
            const newIndex = isShuffled ? Math.floor(Math.random() * combinedPlaylist.length) : (currentTrack + 1) % combinedPlaylist.length;
            setCurrentTrack(newIndex);
            setCurrentTime(0);
            
            if (isPlaying && audioRef.current) {
                const track = combinedPlaylist[newIndex];
                try {
                    audioRef.current.src = track?.path || "";
                    audioRef.current.load();
                    audioRef.current.play().catch(err => {
                        console.error("Failed to play next track:", err);
                        notifyError(`Failed to play ${track?.title}. Trying next track.`);
                        
                        setTimeout(() => nextTrack(), 500);
                    });
                } catch (error) {
                    console.error("Error in track end handler:", error);
                    notifyError("Failed to play the next track. Playback has stopped.");
                    setIsPlaying(false);
                }
            }
        }
    }, [isRepeating, isShuffled, currentTrack, isPlaying, getCombinedPlaylist]);

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>): void => {
        const rect = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        if (audioRef.current && duration) {
            const newTime = percent * duration;
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const value = parseInt(e.target.value);
        setVolume(value);
        if (audioRef.current) {
            audioRef.current.volume = value / 100;
        }
        if (value === 0) {
            setIsMuted(true);
        } else {
            setIsMuted(false);
        }
    };

    const toggleMute = () => {
        if (audioRef.current) {
            if (isMuted) {
                setVolume(previousVolume);
                audioRef.current.volume = previousVolume / 100;
                setIsMuted(false);
            } else {
                setPreviousVolume(volume);
                audioRef.current.volume = 0;
                setVolume(0);
                setIsMuted(true);
            }
        }
    };

    const cycleVisualizer = () => {
        const modes = ["classic", "bars", "modern", "album"];
        const currentIndex = modes.indexOf(visualizerMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        setVisualizerMode(modes[nextIndex]);
    };

    const hexToRgb = (hex: string) => {
        hex = hex.replace(/^#/, '');
        
        const bigint = parseInt(hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        
        return `${r}, ${g}, ${b}`;
    };

    const startVisualizerAnimation = () => {
        if (animationRef.current !== null) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }
        
        setAnimationActive(true);
        updateCanvasBackground();
        
        const animate = () => {
            if (!canvasRef.current) return;
            
            
            timeRef.current += 0.016; 
            
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            
            const width = canvas.width;
            const height = canvas.height;
            
            ctx.clearRect(0, 0, width, height);
            
            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, getCurrentPalette().bg1);
            gradient.addColorStop(1, getCurrentPalette().bg2);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
            
            
            const time = isClient ? Date.now() * 0.001 : timeRef.current;
            
            
            const config = visualizerConfigs[visualizerMode];
            if (config) {
                config.draw(ctx, width, height, time, {
                    hexToRgb,
                    getCurrentPalette,
                    currentTrack,
                    albumImageCache,
                    getCombinedPlaylist,
                    analyserRef,
                    dataArrayRef
                });
            }
            
            
            animationRef.current = requestAnimationFrame(animate);
        };
        
        animate();
    };
    
    const stopVisualizerAnimation = () => {
        if (animationRef.current !== null) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }
        setAnimationActive(false);
    };
    
    const updateCanvasBackground = () => {
        const container = canvasRef.current?.parentElement;
        if (container) {
            container.style.background = `linear-gradient(to bottom, ${getCurrentPalette().bg1}, ${getCurrentPalette().bg2})`;
        }
    };

    const drawClassicVisualizer = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        
        let time = isClient ? Date.now() * 0.001 : timeRef.current;
        
        const centerX = width / 2;
        const centerY = height / 2;

        const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
        bgGradient.addColorStop(0, getCurrentPalette().bg1);
        bgGradient.addColorStop(1, getCurrentPalette().bg2);
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, width, height);

        for (let i = 10; i > 0; i--) {
            const radius = i * 20 + Math.sin(time * 2) * 5;
            const alpha = 0.6 - i * 0.05;

            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${hexToRgb(getCurrentPalette().accent)}, ${alpha})`;
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 50);
        gradient.addColorStop(0, `rgba(${hexToRgb(getCurrentPalette().to)}, 0.8)`);
        gradient.addColorStop(0.5, `rgba(${hexToRgb(getCurrentPalette().accent)}, 0.6)`);
        gradient.addColorStop(1, `rgba(${hexToRgb(getCurrentPalette().from)}, 0)`);

        ctx.beginPath();
        ctx.arc(centerX, centerY, 50 + Math.sin(time * 3) * 5, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        for (let i = 0; i < 20; i++) {
            const angle = time + (i * Math.PI) / 10;
            const x = centerX + Math.cos(angle) * (80 + Math.sin(time + i) * 20);
            const y = centerY + Math.sin(angle) * (80 + Math.sin(time + i) * 20);

            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${hexToRgb(getCurrentPalette().to)}, 0.7)`;
            ctx.fill();
        }
    };

    const drawModernVisualizer = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        let time = isClient ? Date.now() * 0.001 : timeRef.current;
        
        const bgGradient = ctx.createLinearGradient(0, 0, width, height);
        bgGradient.addColorStop(0, getCurrentPalette().bg2);
        bgGradient.addColorStop(1, getCurrentPalette().bg1);
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, width, height);

        for (let i = 0; i < 100; i++) {
            const x = (Math.sin(i * 3.14 + time) * 0.5 + 0.5) * width;
            const y = (Math.cos(i * 2.51 + time) * 0.5 + 0.5) * height;
            const size = (Math.sin(time + i) * 0.5 + 0.5) * 3 + 1;

            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            
            const hue = (time * 20 + i * 2) % 360;
            const themeColor = i % 3 === 0 ? getCurrentPalette().from : 
                               i % 3 === 1 ? getCurrentPalette().accent : 
                               getCurrentPalette().to;
            ctx.fillStyle = `hsla(${hue}, 100%, 70%, 0.7)`;
            ctx.fill();
        }

        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(0, height / 2);

            for (let x = 0; x < width; x += 10) {
                const y = height / 2 + Math.sin(x * 0.01 + time + i) * 50;
                ctx.lineTo(x, y);
            }

            ctx.strokeStyle = i % 2 === 0 
                ? `rgba(${hexToRgb(getCurrentPalette().to)}, ${0.3 - i * 0.05})`
                : `rgba(${hexToRgb(getCurrentPalette().from)}, ${0.3 - i * 0.05})`;
            ctx.lineWidth = 5 - i;
            ctx.stroke();
        }
    };

    const drawAlbumVisualizer = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        const track = getCombinedPlaylist()[currentTrack];
        let time = isClient ? Date.now() * 0.001 : timeRef.current;

        const bgGradient = ctx.createLinearGradient(0, 0, width, height);
        bgGradient.addColorStop(0, getCurrentPalette().bg2);
        bgGradient.addColorStop(1, getCurrentPalette().bg1);
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, width, height);

        for (let i = 6; i > 0; i--) {
            const radius = width * (0.4 + i * 0.15) + Math.sin(time * 0.5 + i) * 20;
            ctx.beginPath();
            ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${hexToRgb(getCurrentPalette().accent)}, ${0.1 - i * 0.01})`;
            ctx.lineWidth = 15;
            ctx.stroke();
        }

        const pulseSize = Math.sin(time * 1.5) * 0.05 + 0.95;

        const artSize = Math.min(width, height) * 0.4 * pulseSize;
        const artX = (width - artSize) / 2;
        const artY = (height - artSize) / 2;

        ctx.shadowColor = `rgba(${hexToRgb(getCurrentPalette().to)}, 0.8)`;
        ctx.shadowBlur = 30;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.beginPath();
        ctx.rect(artX, artY, artSize, artSize);
        ctx.fillStyle = getCurrentPalette().bg2;
        ctx.fill();

        const img = new Image();
        img.src = track.image;

        if (albumImageCache[currentTrack]) {
            ctx.drawImage(albumImageCache[currentTrack], artX, artY, artSize, artSize);
        } else {
            ctx.fillStyle = getCurrentPalette().bg1;
            ctx.fillRect(artX, artY, artSize, artSize);

            img.onload = () => {
                albumImageCache[currentTrack] = img;
            };
        }

        ctx.shadowBlur = 0;

        ctx.fillStyle = `rgba(${hexToRgb(getCurrentPalette().to)}, 0.1)`;
        ctx.beginPath();
        ctx.moveTo(artX, artY);
        ctx.lineTo(artX + artSize, artY);
        ctx.lineTo(artX + artSize * 0.8, artY + artSize);
        ctx.lineTo(artX, artY + artSize);
        ctx.closePath();
        ctx.fill();

        const trackInfoY = artY + artSize + 40;

        ctx.textAlign = "center";
        ctx.fillStyle = `rgba(${hexToRgb(getCurrentPalette().accent)}, 0.8)`;
        ctx.font = `bold 14px var(--font-source-sans-pro), sans-serif`;
        ctx.fillText(`Album: ${track.album}`, width / 2, trackInfoY);

        ctx.fillStyle = `rgba(${hexToRgb(getCurrentPalette().to)}, 1.0)`;
        ctx.font = `bold 18px var(--font-raleway), sans-serif`;
        ctx.fillText(track.title, width / 2, trackInfoY + 25);

        ctx.fillStyle = `rgba(${hexToRgb(getCurrentPalette().accent)}, 0.7)`;
        ctx.font = `15px var(--font-source-sans-pro), sans-serif`;
        ctx.fillText(track.artist, width / 2, trackInfoY + 50);

        for (let i = 0; i < 30; i++) {
            const angle = time + i * ((Math.PI * 2) / 30);
            const distance = artSize * 0.7 + Math.sin(time * 2 + i) * 20;
            const x = width / 2 + Math.cos(angle) * distance;
            const y = height / 2 + Math.sin(angle) * distance;

            ctx.beginPath();
            ctx.arc(x, y, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${hexToRgb(getCurrentPalette().to)}, 0.6)`;
            ctx.fill();
        }

        for (let i = 0; i < 5; i++) {
            const lineY = height * 0.7 + i * 10 + Math.sin(time + i) * 5;

            ctx.beginPath();
            ctx.moveTo(0, lineY);
            ctx.lineTo(width, lineY);
            ctx.strokeStyle = `rgba(${hexToRgb(getCurrentPalette().from)}, ${0.1 - i * 0.02})`;
            ctx.lineWidth = 3;
            ctx.stroke();
        }

        const ringPulse = Math.sin(time * 2) * 0.1 + 0.9;
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, artSize * 0.6 * ringPulse, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${hexToRgb(getCurrentPalette().from)}, 0.2)`;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(width / 2, height / 2, artSize * 0.55 * ringPulse, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${hexToRgb(getCurrentPalette().to)}, 0.15)`;
        ctx.lineWidth = 1;
        ctx.stroke();
    };

    const drawBarsVisualizer = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        const analyser = analyserRef.current;
        const dataArray = dataArrayRef.current;
        let time = isClient ? Date.now() * 0.001 : timeRef.current;

        const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
        bgGradient.addColorStop(0, getCurrentPalette().bg1);
        bgGradient.addColorStop(1, getCurrentPalette().bg2);
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, width, height);

        if (!analyser || !dataArray) {
            const barCount = 64;
            const barWidth = width / barCount - 2;
            const baseY = height * 0.85;

            for (let i = 0; i < barCount; i++) {
                const barHeight = Math.abs(Math.sin(i * 0.2 + time * 2)) * 100 + Math.abs(Math.sin(i * 0.1 + time)) * 80;

                const barGradient = ctx.createLinearGradient(0, baseY, 0, baseY - barHeight);
                barGradient.addColorStop(0, `rgba(${hexToRgb(getCurrentPalette().from)}, 0.9)`);
                barGradient.addColorStop(0.5, `rgba(${hexToRgb(getCurrentPalette().accent)}, 0.8)`);
                barGradient.addColorStop(1, `rgba(${hexToRgb(getCurrentPalette().to)}, 0.7)`);

                ctx.fillStyle = barGradient;
                ctx.fillRect(i * (barWidth + 2) + 2, baseY - barHeight, barWidth, barHeight);

                ctx.beginPath();
                ctx.moveTo(i * (barWidth + 2) + 2, baseY - barHeight);
                ctx.lineTo(i * (barWidth + 2) + 2 + barWidth, baseY - barHeight);
                ctx.strokeStyle = `rgba(${hexToRgb(getCurrentPalette().to)}, 0.5)`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            ctx.textAlign = "center";
            ctx.fillStyle = `rgba(${hexToRgb(getCurrentPalette().to)}, 0.8)`;
            ctx.font = "bold 14px Arial";
            ctx.fillText("Audio Spectrum (Simulated)", width / 2, height * 0.1);

            return;
        }

        analyser.getByteFrequencyData(dataArray);

        const barCount = dataArray.length;
        const barGap = 2;
        const barWidth = (width - barGap) / barCount - barGap;
        const baseY = height * 0.85;

        for (let i = 0; i < barCount; i++) {
            const value = dataArray[i];
            const barHeight = (value / 255) * height * 0.7;

            const x = barGap + (barWidth + barGap) * i;
            const y = baseY - barHeight;

            const barGradient = ctx.createLinearGradient(x, baseY, x, y);
            barGradient.addColorStop(0, `rgba(${hexToRgb(getCurrentPalette().from)}, 0.9)`);
            barGradient.addColorStop(0.6, `rgba(${hexToRgb(getCurrentPalette().accent)}, 0.8)`);
            barGradient.addColorStop(1, `rgba(${hexToRgb(getCurrentPalette().to)}, 0.7)`);

            ctx.fillStyle = barGradient;
            ctx.fillRect(x, y, barWidth, barHeight);

            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + barWidth, y);
            ctx.strokeStyle = `rgba(${hexToRgb(getCurrentPalette().to)}, 0.8)`;
            ctx.lineWidth = 1;
            ctx.stroke();

            if (barHeight > height * 0.25) {
                ctx.shadowColor = `rgba(${hexToRgb(getCurrentPalette().from)}, 0.6)`;
                ctx.shadowBlur = 15;
                ctx.beginPath();
                ctx.arc(x + barWidth / 2, y, barWidth / 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${hexToRgb(getCurrentPalette().to)}, 0.2)`;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        ctx.globalAlpha = 0.2;
        for (let i = 0; i < barCount; i++) {
            const value = dataArray[i];
            const barHeight = (value / 255) * height * 0.15;

            const x = barGap + (barWidth + barGap) * i;
            const y = baseY;

            const barGradient = ctx.createLinearGradient(x, y, x, y + barHeight);
            barGradient.addColorStop(0, `rgba(${hexToRgb(getCurrentPalette().accent)}, 0.5)`);
            barGradient.addColorStop(1, `rgba(${hexToRgb(getCurrentPalette().accent)}, 0)`);

            ctx.fillStyle = barGradient;
            ctx.fillRect(x, y, barWidth, barHeight);
        }
        ctx.globalAlpha = 1.0;

        ctx.shadowColor = `rgba(${hexToRgb(getCurrentPalette().from)}, 0.8)`;
        ctx.shadowBlur = 10 + Math.sin(time * 2) * 5;

        ctx.textAlign = "center";
        ctx.fillStyle = `rgba(${hexToRgb(getCurrentPalette().to)}, 0.8)`;
        ctx.font = "bold 14px Arial";
        ctx.fillText("Audio Spectrum Analyzer", width / 2, height * 0.1);

        ctx.shadowBlur = 0;
    };

    
    const initAudioAnalyzer = (): void => {
        if (!isClient) return;
        
        if (!audioContextRef.current && audioRef.current) {
            try {
                const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
                const audioContext = new AudioContext();
                const analyser = audioContext.createAnalyser();
                audioContextRef.current = audioContext;
                analyserRef.current = analyser;

                const source = audioContext.createMediaElementSource(audioRef.current);
                source.connect(analyser);
                analyser.connect(audioContext.destination);

                analyser.fftSize = 256;
                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);
                dataArrayRef.current = dataArray;
            } catch (error) {
                console.error("Failed to initialize audio analyzer:", error);
            }
        }
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
        };

        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
        };

        const handleError = (e: Event) => {
            console.error("Audio error:", (e.target as HTMLAudioElement).error);
            const errorMessage = getAudioErrorMessage((e.target as HTMLAudioElement).error?.code);
            notifyError(`Audio error: ${errorMessage}`);
        };

        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("loadedmetadata", handleLoadedMetadata);
        audio.addEventListener("ended", handleTrackEnd);
        audio.addEventListener("error", handleError);

        return () => {
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
            audio.removeEventListener("ended", handleTrackEnd);
            audio.removeEventListener("error", handleError);
        };
    }, [handleTrackEnd]);

    useEffect(() => {
        if (!audioRef.current) return;

        const handleTrackChange = async () => {
            try {
                const audio = audioRef.current;
                if (!audio) return;
                
                const track = getCombinedPlaylist()[currentTrack];
                if (!track) return;

                const wasPaused = !isPlaying;
                
                if (!audio.src || !audio.src.includes(track.path)) {
                    audio.src = track.path;
                    audio.load();
                    setCurrentTime(0);
                }

                if (isPlaying) {
                    try {
                        if (!audioContextRef.current) {
                            initAudioAnalyzer();
                        }
                        await audio.play();
                    } catch (err) {
                        console.error("Failed to auto-play track:", err);
                        setIsPlaying(false);
                    }
                }
            } catch (err) {
                console.error("Track change error:", err);
            }
        };

        handleTrackChange();
    }, [currentTrack]);

    useEffect(() => {
        const combinedPlaylist = getCombinedPlaylist();
        const currentItem = combinedPlaylist[currentTrack];

        if (currentItem?.isLocal && currentItem.duration === "0:00" && audioRef.current) {
            const handleMetadataLoaded = () => {
                if (!audioRef.current) return;

                const duration = audioRef.current.duration;
                const mins = Math.floor(duration / 60);
                const secs = Math.floor(duration % 60);
                const formattedDuration = `${mins}:${secs < 10 ? "0" : ""}${secs}`;

                setCustomTracks((prev) =>
                    prev.map((track) => (track.id === currentItem.id ? { ...track, duration: formattedDuration } : track))
                );
            };

            audioRef.current.addEventListener("loadedmetadata", handleMetadataLoaded);

            return () => {
                if (audioRef.current) {
                    audioRef.current.removeEventListener("loadedmetadata", handleMetadataLoaded);
                }
            };
        }
    }, [currentTrack, customTracks]);

    useEffect(() => {
        startVisualizerAnimation();
        
        return () => {
            if (animationRef.current !== null) {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = null;
            }
            setAnimationActive(false);
        };
    }, [visualizerMode, currentTrack, currentSkin]);
    
    useEffect(() => {
        const resizeCanvas = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            
            const container = canvas.parentElement;
            if (container) {
                canvas.width = container.clientWidth;
                canvas.height = container.clientHeight;
            }
        };
        
        resizeCanvas();
        
        window.addEventListener('resize', resizeCanvas);
        
        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);
    
    const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const files = event.target.files;
        if (!files || files.length === 0 || !isClient) return;

        try {
            
            const audioFiles = Array.from(files).filter(
                (file) =>
                    file.type.startsWith("audio/") ||
                    file.name.endsWith(".mp3") ||
                    file.name.endsWith(".wav") ||
                    file.name.endsWith(".ogg") ||
                    file.name.endsWith(".flac") ||
                    file.name.endsWith(".m4a")
            );

            if (audioFiles.length === 0) {
                notifyError("No valid audio files selected. Please select MP3, WAV, OGG, FLAC, or M4A files.");
                return;
            }

            if (audioFiles.length < files.length) {
                notifyInfo(`${files.length - audioFiles.length} file(s) were skipped as they are not audio files.`);
            }

            const newTracks = audioFiles.map((file, index) => {
                const fileUrl = URL.createObjectURL(file);
                const fileName = file.name.replace(/\.[^/.]+$/, "");

                return {
                    id: `local-${Date.now()}-${index}`,
                    title: fileName,
                    artist: "Local Media",
                    album: "My Music Collection",
                    duration: "0:00",
                    path: fileUrl,
                    isLocal: true,
                    file: file,
                    image: "https://iili.io/HlHy9Yx.png",
                };
            });

            setCustomTracks((prev) => [...prev, ...newTracks]);
            notifyInfo(`Added ${newTracks.length} track${newTracks.length > 1 ? 's' : ''} to playlist.`);

            if (!isPlaying && newTracks.length > 0) {
                const newIndex = getCombinedPlaylist().length - newTracks.length;
                setCurrentTrack(newIndex);
            }

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (error) {
            console.error("Error processing files:", error);
            notifyError("Failed to process audio files. Please try again.");
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();

        if (!isClient) return;

        try {
            const files = event.dataTransfer.files;
            if (!files || files.length === 0) return;

            const audioFiles = Array.from(files).filter(
                (file) =>
                    file.type.startsWith("audio/") ||
                    file.name.endsWith(".mp3") ||
                    file.name.endsWith(".wav") ||
                    file.name.endsWith(".ogg") ||
                    file.name.endsWith(".flac") ||
                    file.name.endsWith(".m4a")
            );

            if (audioFiles.length === 0) {
                notifyError("No valid audio files were dropped. Please drop MP3, WAV, OGG, FLAC, or M4A files.");
                return;
            }

            if (audioFiles.length < files.length) {
                notifyInfo(`${files.length - audioFiles.length} file(s) were skipped as they are not audio files.`);
            }

            const newTracks = audioFiles.map((file, index) => {
                const fileUrl = URL.createObjectURL(file);
                const fileName = file.name.replace(/\.[^/.]+$/, "");

                return {
                    id: `drop-${Date.now()}-${index}`,
                    title: fileName,
                    artist: "Local Media",
                    album: "My Music Collection",
                    duration: "0:00",
                    path: fileUrl,
                    isLocal: true,
                    file: file,
                    image: "https://iili.io/HlHy9Yx.png",
                };
            });

            setCustomTracks((prev) => [...prev, ...newTracks]);
            notifyInfo(`Added ${newTracks.length} track${newTracks.length > 1 ? 's' : ''} to playlist.`);

            if (!isPlaying && newTracks.length > 0) {
                const newIndex = getCombinedPlaylist().length - newTracks.length;
                setCurrentTrack(newIndex);
            }
        } catch (error) {
            console.error("Error processing dropped files:", error);
            notifyError("Failed to process dropped files. Please try again.");
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleNavItemClick = (id: string) => {
        setActiveNavItem(id);
        
        switch (id) {
            case "now-playing":
                break;
            case "media-library":
                break;
            case "visualizer":
                cycleVisualizer();
                break;
            case "equalizer":
                alert("Equalizer feature would be implemented here in a full application");
                break;
            case "skin-chooser":
                setShowSkinChooser(true);
                break;
            case "info":
                setShowTrackInfo(true);
                break;
        }
    };

    const handleSkinSelect = (index: number) => {
        setCurrentSkin(index);
        
        const container = canvasRef.current?.parentElement;
        if (container) {
            const newPalette = colorPalettes[index];
            container.style.background = `linear-gradient(to bottom, ${newPalette.bg1}, ${newPalette.bg2})`;
        }
        
        setShowSkinChooser(false);
    };

    
    const notifyError = (message: string) => {
        toast.error(message, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    };

    const notifyInfo = (message: string) => {
        toast.info(message, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    };

    
    const visualizerConfigs = React.useMemo<{ [key: string]: VisualizerConfig }>(() => {
        return {
            "classic": {
                name: "Classic",
                draw: (ctx, width, height, time, props) => {
                    const { hexToRgb, getCurrentPalette } = props;
                    const centerX = width / 2;
                    const centerY = height / 2;
                    const palette = getCurrentPalette();

                    
                    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
                    bgGradient.addColorStop(0, palette.bg1);
                    bgGradient.addColorStop(1, palette.bg2);
                    ctx.fillStyle = bgGradient;
                    ctx.fillRect(0, 0, width, height);

                    
                    for (let i = 10; i > 0; i--) {
                        const radius = i * 20 + Math.sin(time * 2) * 5;
                        const alpha = 0.6 - i * 0.05;

                        ctx.beginPath();
                        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                        ctx.strokeStyle = `rgba(${hexToRgb(palette.accent)}, ${alpha})`;
                        ctx.lineWidth = 2;
                        ctx.stroke();
                    }

                    
                    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 50);
                    gradient.addColorStop(0, `rgba(${hexToRgb(palette.to)}, 0.8)`);
                    gradient.addColorStop(0.5, `rgba(${hexToRgb(palette.accent)}, 0.6)`);
                    gradient.addColorStop(1, `rgba(${hexToRgb(palette.from)}, 0)`);

                    ctx.beginPath();
                    ctx.arc(centerX, centerY, 50 + Math.sin(time * 3) * 5, 0, Math.PI * 2);
                    ctx.fillStyle = gradient;
                    ctx.fill();

                    
                    for (let i = 0; i < 20; i++) {
                        const angle = time + (i * Math.PI) / 10;
                        const x = centerX + Math.cos(angle) * (80 + Math.sin(time + i) * 20);
                        const y = centerY + Math.sin(angle) * (80 + Math.sin(time + i) * 20);

                        ctx.beginPath();
                        ctx.arc(x, y, 2, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(${hexToRgb(palette.to)}, 0.7)`;
                        ctx.fill();
                    }
                }
            },
            "modern": {
                name: "Modern",
                draw: (ctx, width, height, time, props) => {
                    const { hexToRgb, getCurrentPalette } = props;
                    const palette = getCurrentPalette();

                    
                    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
                    bgGradient.addColorStop(0, palette.bg2);
                    bgGradient.addColorStop(1, palette.bg1);
                    ctx.fillStyle = bgGradient;
                    ctx.fillRect(0, 0, width, height);

                    
                    for (let i = 0; i < 100; i++) {
                        const x = (Math.sin(i * 3.14 + time) * 0.5 + 0.5) * width;
                        const y = (Math.cos(i * 2.51 + time) * 0.5 + 0.5) * height;
                        const size = (Math.sin(time + i) * 0.5 + 0.5) * 3 + 1;

                        ctx.beginPath();
                        ctx.arc(x, y, size, 0, Math.PI * 2);
                        
                        const hue = (time * 20 + i * 2) % 360;
                        ctx.fillStyle = `hsla(${hue}, 100%, 70%, 0.7)`;
                        ctx.fill();
                    }

                    
                    for (let i = 0; i < 5; i++) {
                        ctx.beginPath();
                        ctx.moveTo(0, height / 2);

                        for (let x = 0; x < width; x += 10) {
                            const y = height / 2 + Math.sin(x * 0.01 + time + i) * 50;
                            ctx.lineTo(x, y);
                        }

                        ctx.strokeStyle = i % 2 === 0 
                            ? `rgba(${hexToRgb(palette.to)}, ${0.3 - i * 0.05})`
                            : `rgba(${hexToRgb(palette.from)}, ${0.3 - i * 0.05})`;
                        ctx.lineWidth = 5 - i;
                        ctx.stroke();
                    }
                }
            },
            "album": {
                name: "Album",
                draw: (ctx, width, height, time, props) => {
                    const { hexToRgb, getCurrentPalette, currentTrack, albumImageCache, getCombinedPlaylist } = props;
                    const palette = getCurrentPalette();
                    const track = getCombinedPlaylist()[currentTrack];

                    
                    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
                    bgGradient.addColorStop(0, palette.bg2);
                    bgGradient.addColorStop(1, palette.bg1);
                    ctx.fillStyle = bgGradient;
                    ctx.fillRect(0, 0, width, height);

                    
                    for (let i = 6; i > 0; i--) {
                        const radius = width * (0.4 + i * 0.15) + Math.sin(time * 0.5 + i) * 20;
                        ctx.beginPath();
                        ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2);
                        ctx.strokeStyle = `rgba(${hexToRgb(palette.accent)}, ${0.1 - i * 0.01})`;
                        ctx.lineWidth = 15;
                        ctx.stroke();
                    }

                    
                    const pulseSize = Math.sin(time * 1.5) * 0.05 + 0.95;
                    const artSize = Math.min(width, height) * 0.4 * pulseSize;
                    const artX = (width - artSize) / 2;
                    const artY = (height - artSize) / 2;

                    
                    ctx.shadowColor = `rgba(${hexToRgb(palette.to)}, 0.8)`;
                    ctx.shadowBlur = 30;
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;

                    
                    ctx.beginPath();
                    ctx.rect(artX, artY, artSize, artSize);
                    ctx.fillStyle = palette.bg2;
                    ctx.fill();

                    
                    const img = new Image();
                    img.src = track.image;

                    if (albumImageCache[currentTrack]) {
                        ctx.drawImage(albumImageCache[currentTrack], artX, artY, artSize, artSize);
                    } else {
                        ctx.fillStyle = palette.bg1;
                        ctx.fillRect(artX, artY, artSize, artSize);

                        img.onload = () => {
                            albumImageCache[currentTrack] = img;
                        };
                    }

                    
                    ctx.shadowBlur = 0;

                    
                    ctx.fillStyle = `rgba(${hexToRgb(palette.to)}, 0.1)`;
                    ctx.beginPath();
                    ctx.moveTo(artX, artY);
                    ctx.lineTo(artX + artSize, artY);
                    ctx.lineTo(artX + artSize * 0.8, artY + artSize);
                    ctx.lineTo(artX, artY + artSize);
                    ctx.closePath();
                    ctx.fill();

                    
                    const trackInfoY = artY + artSize + 40;

                    ctx.textAlign = "center";
                    ctx.fillStyle = `rgba(${hexToRgb(palette.accent)}, 0.8)`;
                    ctx.font = `bold 14px var(--font-source-sans-pro), sans-serif`;
                    ctx.fillText(`Album: ${track.album}`, width / 2, trackInfoY);

                    ctx.fillStyle = `rgba(${hexToRgb(palette.to)}, 1.0)`;
                    ctx.font = `bold 18px var(--font-raleway), sans-serif`;
                    ctx.fillText(track.title, width / 2, trackInfoY + 25);

                    ctx.fillStyle = `rgba(${hexToRgb(palette.accent)}, 0.7)`;
                    ctx.font = `15px var(--font-source-sans-pro), sans-serif`;
                    ctx.fillText(track.artist, width / 2, trackInfoY + 50);

                    
                    for (let i = 0; i < 30; i++) {
                        const angle = time + i * ((Math.PI * 2) / 30);
                        const distance = artSize * 0.7 + Math.sin(time * 2 + i) * 20;
                        const x = width / 2 + Math.cos(angle) * distance;
                        const y = height / 2 + Math.sin(angle) * distance;

                        ctx.beginPath();
                        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(${hexToRgb(palette.to)}, 0.6)`;
                        ctx.fill();
                    }

                    
                    for (let i = 0; i < 5; i++) {
                        const lineY = height * 0.7 + i * 10 + Math.sin(time + i) * 5;

                        ctx.beginPath();
                        ctx.moveTo(0, lineY);
                        ctx.lineTo(width, lineY);
                        ctx.strokeStyle = `rgba(${hexToRgb(palette.from)}, ${0.1 - i * 0.02})`;
                        ctx.lineWidth = 3;
                        ctx.stroke();
                    }

                    
                    const ringPulse = Math.sin(time * 2) * 0.1 + 0.9;
                    ctx.beginPath();
                    ctx.arc(width / 2, height / 2, artSize * 0.6 * ringPulse, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(${hexToRgb(palette.from)}, 0.2)`;
                    ctx.lineWidth = 2;
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.arc(width / 2, height / 2, artSize * 0.55 * ringPulse, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(${hexToRgb(palette.to)}, 0.15)`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            },
            "bars": {
                name: "Bars",
                draw: (ctx, width, height, time, props) => {
                    const { hexToRgb, getCurrentPalette, analyserRef, dataArrayRef } = props;
                    const palette = getCurrentPalette();
                    const analyser = analyserRef.current;
                    const dataArray = dataArrayRef.current;

                    
                    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
                    bgGradient.addColorStop(0, palette.bg1);
                    bgGradient.addColorStop(1, palette.bg2);
                    ctx.fillStyle = bgGradient;
                    ctx.fillRect(0, 0, width, height);

                    
                    if (!analyser || !dataArray) {
                        const barCount = 64;
                        const barWidth = width / barCount - 2;
                        const baseY = height * 0.85;

                        for (let i = 0; i < barCount; i++) {
                            const barHeight = Math.abs(Math.sin(i * 0.2 + time * 2)) * 100 + Math.abs(Math.sin(i * 0.1 + time)) * 80;

                            const barGradient = ctx.createLinearGradient(0, baseY, 0, baseY - barHeight);
                            barGradient.addColorStop(0, `rgba(${hexToRgb(palette.from)}, 0.9)`);
                            barGradient.addColorStop(0.5, `rgba(${hexToRgb(palette.accent)}, 0.8)`);
                            barGradient.addColorStop(1, `rgba(${hexToRgb(palette.to)}, 0.7)`);

                            ctx.fillStyle = barGradient;
                            ctx.fillRect(i * (barWidth + 2) + 2, baseY - barHeight, barWidth, barHeight);

                            ctx.beginPath();
                            ctx.moveTo(i * (barWidth + 2) + 2, baseY - barHeight);
                            ctx.lineTo(i * (barWidth + 2) + 2 + barWidth, baseY - barHeight);
                            ctx.strokeStyle = `rgba(${hexToRgb(palette.to)}, 0.5)`;
                            ctx.lineWidth = 1;
                            ctx.stroke();
                        }

                        ctx.textAlign = "center";
                        ctx.fillStyle = `rgba(${hexToRgb(palette.to)}, 0.8)`;
                        ctx.font = "bold 14px Arial";
                        ctx.fillText("Audio Spectrum (Simulated)", width / 2, height * 0.1);

                        return;
                    }

                    
                    analyser.getByteFrequencyData(dataArray);

                    const barCount = dataArray.length;
                    const barGap = 2;
                    const barWidth = (width - barGap) / barCount - barGap;
                    const baseY = height * 0.85;

                    for (let i = 0; i < barCount; i++) {
                        const value = dataArray[i];
                        const barHeight = (value / 255) * height * 0.7;

                        const x = barGap + (barWidth + barGap) * i;
                        const y = baseY - barHeight;

                        const barGradient = ctx.createLinearGradient(x, baseY, x, y);
                        barGradient.addColorStop(0, `rgba(${hexToRgb(palette.from)}, 0.9)`);
                        barGradient.addColorStop(0.6, `rgba(${hexToRgb(palette.accent)}, 0.8)`);
                        barGradient.addColorStop(1, `rgba(${hexToRgb(palette.to)}, 0.7)`);

                        ctx.fillStyle = barGradient;
                        ctx.fillRect(x, y, barWidth, barHeight);

                        ctx.beginPath();
                        ctx.moveTo(x, y);
                        ctx.lineTo(x + barWidth, y);
                        ctx.strokeStyle = `rgba(${hexToRgb(palette.to)}, 0.8)`;
                        ctx.lineWidth = 1;
                        ctx.stroke();

                        if (barHeight > height * 0.25) {
                            ctx.shadowColor = `rgba(${hexToRgb(palette.from)}, 0.6)`;
                            ctx.shadowBlur = 15;
                            ctx.beginPath();
                            ctx.arc(x + barWidth / 2, y, barWidth / 2, 0, Math.PI * 2);
                            ctx.fillStyle = `rgba(${hexToRgb(palette.to)}, 0.2)`;
                            ctx.fill();
                            ctx.shadowBlur = 0;
                        }
                    }

                    
                    ctx.globalAlpha = 0.2;
                    for (let i = 0; i < barCount; i++) {
                        const value = dataArray[i];
                        const barHeight = (value / 255) * height * 0.15;

                        const x = barGap + (barWidth + barGap) * i;
                        const y = baseY;

                        const barGradient = ctx.createLinearGradient(x, y, x, y + barHeight);
                        barGradient.addColorStop(0, `rgba(${hexToRgb(palette.accent)}, 0.5)`);
                        barGradient.addColorStop(1, `rgba(${hexToRgb(palette.accent)}, 0)`);

                        ctx.fillStyle = barGradient;
                        ctx.fillRect(x, y, barWidth, barHeight);
                    }
                    ctx.globalAlpha = 1.0;

                    
                    ctx.shadowColor = `rgba(${hexToRgb(palette.from)}, 0.8)`;
                    ctx.shadowBlur = 10 + Math.sin(time * 2) * 5;
                    ctx.textAlign = "center";
                    ctx.fillStyle = `rgba(${hexToRgb(palette.to)}, 0.8)`;
                    ctx.font = "bold 14px Arial";
                    ctx.fillText("Audio Spectrum Analyzer", width / 2, height * 0.1);
                    ctx.shadowBlur = 0;
                }
            }
        };
    }, []);

    
    const getAudioErrorMessage = (errorCode?: number): string => {
        switch (errorCode) {
            case 1:
                return "The fetching process was aborted by the user.";
            case 2:
                return "A network error occurred while fetching the media.";
            case 3:
                return "There was a problem decoding the media file.";
            case 4:
                return "The media source is not supported or unavailable.";
            default:
                return "An unknown error occurred.";
        }
    };

    return (
        <div
            className={`min-h-screen bg-[#7b7aa9] flex flex-col items-center justify-center p-4 ${raleway.variable} ${sourceSansPro.variable}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
        >
            <div
                className={`w-full max-w-5xl 
                    bg-gradient-to-b from-[${getCurrentPalette().bg1}]/90 to-[${getCurrentPalette().bg2}]/95 
                    backdrop-blur-md border border-[${getCurrentPalette().from}]/40 rounded-md 
                    shadow-[0_0_30px_rgba(83,33,125,0.4)] text-white overflow-hidden flex flex-col 
                    font-sans h-[715px]`}
                style={
                    {
                        fontFamily: "var(--font-source-sans-pro)",
                        "--from-color": getCurrentPalette().from,
                        "--to-color": getCurrentPalette().to,
                        "--accent-color": getCurrentPalette().accent,
                        "--bg1-color": getCurrentPalette().bg1,
                        "--bg2-color": getCurrentPalette().bg2,
                    } as React.CSSProperties
                }
            >
                <div className="bg-gradient-to-r from-[var(--from-color)] to-[var(--bg1-color)] px-4 py-1.5 flex justify-between items-center border-b border-[var(--to-color)]/30 h-[35px]">
                    <div className="flex items-center">
                        <div className="w-5 h-5 mr-2 bg-[var(--to-color)] rounded-sm flex items-center justify-center">
                            <span className="text-[var(--bg2-color)] text-xs">▶</span>
                        </div>
                        <span className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-raleway)" }}>
                            Windows Media Player
                        </span>
                    </div>

                    <div className="flex space-x-1">
                        
                    </div>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    <div className="bg-gradient-to-b from-[var(--bg1-color)] to-[var(--bg2-color)] w-28 p-3 flex-shrink-0 border-r border-[var(--from-color)]/30">
                        <div className="text-sm text-[var(--to-color)]/90 font-bold mb-1.5" style={{ fontFamily: "var(--font-raleway)" }}>
                            Now Playing
                        </div>

                        <div className="space-y-4 text-xs">
                            {navItems.map((item) => (
                                <div
                                    key={item.id}
                                    className={`cursor-pointer hover:text-[var(--to-color)] transition-colors duration-200
                               ${item.id === activeNavItem ? "text-[var(--to-color)] font-semibold" : "text-[var(--accent-color)]"}`}
                                    onClick={() => handleNavItemClick(item.id)}
                                >
                                    {item.label}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col h-full">
                        <div className="bg-gradient-to-r from-[var(--bg2-color)] to-[var(--bg1-color)] px-4 py-2 flex items-center justify-between border-b border-[var(--from-color)]/30 h-[50px]">
                            <div className="flex items-center space-x-3">
                                <button
                                    className="text-[var(--accent-color)] hover:text-[var(--to-color)] focus:outline-none cursor-pointer transition-colors duration-200"
                                    onClick={prevTrack}
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M15 18L9 12L15 6"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>
                                <button
                                    className="text-[var(--accent-color)] hover:text-[var(--to-color)] focus:outline-none cursor-pointer transition-colors duration-200"
                                    onClick={nextTrack}
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M9 18L15 12L9 6"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>
                                <button
                                    className="text-[var(--accent-color)] hover:text-[var(--to-color)] focus:outline-none cursor-pointer transition-colors duration-200"
                                    onClick={cycleVisualizer}
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                                        <path
                                            d="M7 12C7 9.23858 9.23858 7 12 7"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                        />
                                        <path
                                            d="M17 12C17 14.7614 14.7614 17 12 17"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </button>

                                <button
                                    className="text-[var(--accent-color)] hover:text-[var(--to-color)] focus:outline-none cursor-pointer transition-colors duration-200 flex items-center"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <IoMdFolderOpen size={20} />
                                    <span className="ml-1 text-xs">Open Files</span>
                                </button>

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileSelection}
                                    accept="audio/*"
                                    multiple
                                    className="hidden"
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <div
                                    className="bg-[#454157] text-[var(--to-color)] px-3 py-1 text-xs rounded border border-[var(--from-color)]/50 flex items-center hover:bg-[var(--from-color)]/60 cursor-pointer transition-all duration-200"
                                    onClick={cycleVisualizer}
                                >
                                    <span className="mr-1.5">Mode: {visualizerConfigs[visualizerMode]?.name || visualizerMode.charAt(0).toUpperCase() + visualizerMode.slice(1)}</span>
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth="1" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-[var(--bg2-color)] to-[var(--bg1-color)] px-4 py-2 border-b border-[var(--from-color)]/30 h-[45px]">
                            <div className="text-xs text-[var(--accent-color)]">{getCombinedPlaylist()[currentTrack]?.artist}</div>
                            <div className="text-sm font-medium text-[var(--to-color)]" style={{ fontFamily: "var(--font-raleway)" }}>
                                {getCombinedPlaylist()[currentTrack]?.title}
                            </div>
                        </div>

                        <div className="flex-1 flex overflow-hidden relative">
                            <div
                                className="flex-1 relative overflow-hidden flex items-center justify-center"
                                style={{ background: `linear-gradient(to bottom, ${getCurrentPalette().bg1}, ${getCurrentPalette().bg2})` }}
                            >
                                <canvas
                                    ref={canvasRef}
                                    className="max-w-full max-h-full"
                                    width={800}
                                    height={600}
                                    style={{ display: "block" }}
                                />
                            </div>

                            <div className="w-72 bg-[var(--bg2-color)]/95 border-l border-[var(--from-color)]/40 overflow-y-auto flex-shrink-0 flex flex-col">
                                <div className="p-3 flex-1">
                                    <h3
                                        className="text-sm font-semibold text-[var(--to-color)] mb-2"
                                        style={{ fontFamily: "var(--font-raleway)" }}
                                    >
                                        Media Library
                                    </h3>
                                    <div className="space-y-0.5">
                                        {getCombinedPlaylist().map((track, index) => (
                                            <div
                                                key={`track-${track.id || index}`}
                                                className={`flex items-center text-xs p-1.5 ${
                                                    currentTrack === index
                                                        ? "bg-[var(--from-color)]/40 text-[var(--to-color)]"
                                                        : "text-[var(--accent-color)] hover:bg-[var(--bg1-color)]/70 hover:text-[var(--to-color)]"
                                                } cursor-pointer transition-all duration-200 rounded`}
                                                onClick={() => selectTrack(index)}
                                            >
                                                <div className="w-2 mr-2">
                                                    {currentTrack === index && (
                                                        <div className="w-2 h-2 bg-[var(--to-color)] rounded-full"></div>
                                                    )}
                                                </div>
                                                <div className="flex-1 truncate">
                                                    {track.title}
                                                    {track.isLocal && <span className="ml-1 text-[var(--to-color)]/60">(local)</span>}
                                                </div>
                                                <div className="ml-2 text-[var(--to-color)]/70">{track.duration}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-3 border-t border-[var(--from-color)]/30 text-xs text-[var(--accent-color)]">
                                    <div className="float-right">
                                        Total Time:{" "}
                                        {(() => {
                                            const totalSeconds = getCombinedPlaylist().reduce((total, track) => {
                                                const [mins, secs] = track.duration.split(":").map(Number);
                                                return total + mins * 60 + secs;
                                            }, 0);

                                            const mins = Math.floor(totalSeconds / 60);
                                            const secs = totalSeconds % 60;
                                            return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
                                        })()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-[var(--bg2-color)] to-[var(--bg1-color)] px-4 py-3 border-t border-[var(--from-color)]/40 h-[120px] flex flex-col justify-between">
                            <div className="flex items-center justify-between">
                                <div className="text-xs text-[var(--accent-color)]">
                                    Album: {getCombinedPlaylist()[currentTrack]?.album}
                                </div>
                                <div className="flex items-center space-x-1.5 text-sm font-medium text-[var(--to-color)]">
                                    <span>
                                        {formatTime(currentTime)} / {formatTime(duration)}
                                    </span>
                                </div>
                            </div>

                            <div
                                className="relative h-12 my-3 bg-[#2D2A42] rounded-md overflow-hidden border border-[var(--from-color)]/30 shadow-inner cursor-pointer"
                                onClick={handleProgressClick}
                            >
                                <div
                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-[var(--from-color)] to-[var(--to-color)] rounded-md"
                                    style={{
                                        width: `${(currentTime / duration) * 100 || 0}%`,
                                        transition: "width 0.1s linear",
                                    }}
                                ></div>

                                <input
                                    type="range"
                                    min="0"
                                    max={duration || 100}
                                    value={currentTime}
                                    onChange={(e) => {
                                        const newTime = parseFloat(e.target.value);
                                        if (audioRef.current) {
                                            audioRef.current.currentTime = newTime;
                                            setCurrentTime(newTime);
                                        }
                                    }}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    style={{ accentColor: "var(--to-color)" }}
                                />
                            </div>

                            <div className="flex items-center justify-between pb-1">
                                <div className="flex items-center space-x-3">
                                    <button
                                        className="text-[var(--accent-color)] hover:text-[var(--to-color)] focus:outline-none cursor-pointer transition-colors duration-200"
                                        onClick={() => prevTrack()}
                                    >
                                        <FaStepBackward size={16} />
                                    </button>

                                    <button
                                        className="w-9 h-9 relative overflow-hidden rounded-full flex items-center justify-center focus:outline-none shadow-md cursor-pointer group"
                                        onClick={togglePlay}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-b from-[var(--from-color)] to-[var(--bg1-color)] transition-opacity duration-300 ease-in-out group-hover:opacity-0"></div>

                                        <div className="absolute inset-0 bg-gradient-to-b from-[var(--to-color)] to-[var(--from-color)] opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"></div>

                                        <div className="relative z-10">
                                            {isPlaying ? (
                                                <FaPause size={14} className="text-white" />
                                            ) : (
                                                <FaPlay size={14} className="text-white" />
                                            )}
                                        </div>
                                    </button>

                                    <button
                                        className="text-[var(--accent-color)] hover:text-[var(--to-color)] focus:outline-none cursor-pointer transition-colors duration-200"
                                        onClick={() => nextTrack()}
                                    >
                                        <FaStepForward size={16} />
                                    </button>

                                    <button
                                        className={`focus:outline-none cursor-pointer transition-colors duration-200 ${
                                            isShuffled
                                                ? "text-[var(--to-color)]"
                                                : "text-[var(--accent-color)] hover:text-[var(--to-color)]"
                                        }`}
                                        onClick={() => setIsShuffled(!isShuffled)}
                                    >
                                        <MdShuffle size={18} />
                                    </button>

                                    <button
                                        className={`focus:outline-none cursor-pointer transition-colors duration-200 ${
                                            isRepeating
                                                ? "text-[var(--to-color)] scale-110 transform"
                                                : "text-[var(--accent-color)] hover:text-[var(--to-color)]"
                                        }`}
                                        onClick={() => setIsRepeating(!isRepeating)}
                                        title={isRepeating ? "Repeat On" : "Repeat Off"}
                                    >
                                        <MdRepeat size={18} />
                                    </button>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <button
                                        className="text-[var(--accent-color)] hover:text-[var(--to-color)] focus:outline-none cursor-pointer transition-colors duration-200"
                                        onClick={toggleMute}
                                    >
                                        {isMuted ? <FaVolumeMute size={16} /> : <FaVolumeUp size={16} />}
                                    </button>

                                    <div className="relative w-24 h-3 cursor-pointer">
                                        <div className="absolute inset-0 h-1 top-1 bg-[#454157] rounded-full"></div>

                                        <div
                                            className="absolute h-1 top-1 left-0 bg-[var(--to-color)] rounded-full"
                                            style={{ width: `${volume}%` }}
                                        ></div>

                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={volume}
                                            onChange={handleVolumeChange}
                                            className="absolute inset-0 w-24 h-3 opacity-0 cursor-pointer z-10"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Always create audio element without conditional rendering */}
            <audio ref={audioRef} crossOrigin="anonymous" />

            {showSkinChooser && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80">
                    <div className="bg-[#1f1f2e] p-6 rounded-lg border border-gray-700 shadow-xl w-[400px]">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-white font-semibold text-lg" style={{ fontFamily: "var(--font-raleway)" }}>
                                Choose a Skin
                            </h3>
                            <button
                                className="text-white/80 hover:text-white px-1.5 cursor-pointer transition-colors duration-200"
                                onClick={() => setShowSkinChooser(false)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            {colorPalettes.map((palette, index) => (
                                <div
                                    key={index}
                                    className="cursor-pointer transition-all duration-200 transform hover:scale-105"
                                    onClick={() => handleSkinSelect(index)}
                                >
                                    <div
                                        className={`h-20 rounded-md overflow-hidden ${
                                            currentSkin === index ? "ring-2 ring-white scale-105 shadow-glow" : "border border-gray-800"
                                        }`}
                                        style={{
                                            boxShadow: currentSkin === index ? `0 0 10px ${palette.to}` : "none",
                                        }}
                                    >
                                        <div
                                            className="h-full w-full bg-gradient-to-br"
                                            style={{
                                                background: `linear-gradient(135deg, ${palette.from} 0%, ${palette.to} 100%)`,
                                            }}
                                        ></div>
                                    </div>
                                    <div className="mt-1 text-xs text-center text-white">{index === 0 ? "Default" : `Theme ${index}`}</div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                className="bg-gradient-to-r from-[var(--from-color)] to-[var(--to-color)] text-white px-4 py-2 rounded text-sm font-medium transition-all duration-200 hover:opacity-90"
                                onClick={() => setShowSkinChooser(false)}
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showTrackInfo && getCombinedPlaylist()[currentTrack] && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80">
                    <div 
                        className="p-6 rounded-lg border shadow-xl w-[600px] overflow-hidden"
                        style={{
                            background: `linear-gradient(to bottom, ${getCurrentPalette().bg1}, ${getCurrentPalette().bg2})`,
                            borderColor: `${getCurrentPalette().from}40`,
                            boxShadow: `0 0 30px ${getCurrentPalette().from}80`
                        }}
                    >
                        <div className="flex justify-between items-center mb-5">
                            <h3 
                                className="font-semibold text-lg" 
                                style={{ 
                                    fontFamily: "var(--font-raleway)",
                                    color: getCurrentPalette().to 
                                }}
                            >
                                Track Information
                            </h3>
                            <button
                                className="text-white/80 hover:text-white cursor-pointer transition-colors duration-200"
                                onClick={() => setShowTrackInfo(false)}
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="flex">
                            <div className="w-48 h-48 overflow-hidden rounded-lg relative mr-6 shadow-lg">
                                <img 
                                    src={getCombinedPlaylist()[currentTrack]?.image} 
                                    alt={`Album art for ${getCombinedPlaylist()[currentTrack]?.album}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            
                            <div className="flex-1">
                                <div className="mb-6">
                                    <h2 
                                        className="text-2xl font-bold mb-1"
                                        style={{ 
                                            fontFamily: "var(--font-raleway)",
                                            color: getCurrentPalette().to
                                        }}
                                    >
                                        {getCombinedPlaylist()[currentTrack]?.title}
                                    </h2>
                                    <p className="text-white text-lg">{getCombinedPlaylist()[currentTrack]?.artist}</p>
                                </div>
                                
                                <div className="space-y-3">
                                    <div className="flex items-center whitespace-nowrap overflow-hidden">
                                        <span className="w-32 flex-shrink-0" style={{ color: getCurrentPalette().accent }}>Album:</span>
                                        <span className="text-white truncate">{getCombinedPlaylist()[currentTrack]?.album}</span>
                                    </div>
                                    <div className="flex items-center whitespace-nowrap overflow-hidden">
                                        <span className="w-32 flex-shrink-0" style={{ color: getCurrentPalette().accent }}>Duration:</span>
                                        <span className="text-white truncate">{getCombinedPlaylist()[currentTrack]?.duration}</span>
                                    </div>
                                    <div className="flex items-center whitespace-nowrap overflow-hidden">
                                        <span className="w-32 flex-shrink-0" style={{ color: getCurrentPalette().accent }}>Current Time:</span>
                                        <span className="text-white truncate">{formatTime(currentTime)}</span>
                                    </div>
                                    <div className="flex items-center whitespace-nowrap overflow-hidden">
                                        <span className="w-32 flex-shrink-0" style={{ color: getCurrentPalette().accent }}>Track Type:</span>
                                        <span className="text-white truncate">{getCombinedPlaylist()[currentTrack]?.isLocal ? "Local File" : "Streaming"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-6">
                            <div className="flex justify-between text-sm mb-2">
                                <span style={{ color: getCurrentPalette().accent }}>{formatTime(currentTime)}</span>
                                <span style={{ color: getCurrentPalette().accent }}>{formatTime(duration)}</span>
                            </div>
                            <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: `${getCurrentPalette().from}40` }}>
                                <div 
                                    className="h-full"
                                    style={{ 
                                        width: `${(currentTime / duration) * 100 || 0}%`,
                                        background: `linear-gradient(to right, ${getCurrentPalette().from}, ${getCurrentPalette().to})`
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </div>
    );
};

export default WinMediaPlayer;
