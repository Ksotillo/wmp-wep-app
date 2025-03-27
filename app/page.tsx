"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { MdRepeat, MdShuffle } from "react-icons/md";
import { IoMdFolderOpen } from "react-icons/io";
import { Raleway, Source_Sans_3 } from "next/font/google";

const raleway = Raleway({ 
    subsets: ['latin'],
    variable: '--font-raleway'
});

const sourceSansPro = Source_Sans_3({
    weight: ['400', '600', '700'],
    subsets: ['latin'],
    variable: '--font-source-sans-pro'
});

const WinMediaPlayer = () => {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [currentTrack, setCurrentTrack] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [volume, setVolume] = useState<number>(80);
    const [isMuted, setIsMuted] = useState<boolean>(false);
    const [isShuffled, setIsShuffled] = useState<boolean>(false);
    const [isRepeating, setIsRepeating] = useState<boolean>(false);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    const [visualizerMode, setVisualizerMode] = useState<string>("classic");
    const [showPlaylist, setShowPlaylist] = useState<boolean>(true);
    const [albumImageCache, setAlbumImageCache] = useState<{ [key: number]: HTMLImageElement }>({});
    const [previousVolume, setPreviousVolume] = useState<number>(80);
    const [customTracks, setCustomTracks] = useState<Array<any>>([]);
    const [activeNavItem, setActiveNavItem] = useState<string>("now-playing");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const audioRef = useRef<HTMLAudioElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const dataArrayRef = useRef<Uint8Array | null>(null);

    const playlist = [
        {
            id: "built-in-1-" + Math.random().toString(36).substring(2, 11),
            title: "No Me Conoce (Remix)",
            artist: "Jhay Cortez, J. Balvin, Bad Bunny",
            album: "Famouz",
            duration: "5:09",
            path: "/audio/track1.mp3",
            image: "https://i.scdn.co/image/ab67616d0000b273552837b3e37071cbf3c9dc53",
        },
        {
            id: "built-in-2-" + Math.random().toString(36).substring(2, 11),
            title: "Aerials",
            artist: "System of a Down",
            album: "Toxicity",
            duration: "3:55",
            path: "/audio/track2.mp3",
            image: "https://i.scdn.co/image/ab67616d00001e0230d45198d0c9e8841f9a9578",
        },
        {
            id: "built-in-3-" + Math.random().toString(36).substring(2, 11),
            title: "De Música Ligera",
            artist: "Soda Stereo",
            album: "Canción Animal",
            duration: "3:33",
            path: "/audio/track3.mp3",
            image: "https://i.scdn.co/image/ab67616d0000b27370c093a24bc4600b4075aef3",
        },
        {
            id: "built-in-4-" + Math.random().toString(36).substring(2, 11),
            title: "Vete",
            artist: "Bad Bunny",
            album: "YHLQMDLG",
            duration: "3:12",
            path: "/audio/track4.mp3",
            image: "https://i1.sndcdn.com/artworks-000643462576-ta4chz-t500x500.jpg",
        },
    ];

    const navItems = [
        { id: "media-guide", label: "Media Guide" },
        { id: "copy-from-cd", label: "Copy from CD" },
        { id: "media-library", label: "Media Library" },
        { id: "radio-tuner", label: "Radio Tuner" },
        { id: "copy-to-cd", label: "Copy to CD or Device" },
        { id: "skin-chooser", label: "Skin Chooser" },
    ];

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    const getCombinedPlaylist = () => {
        return [...playlist, ...customTracks];
    };

    const togglePlay = async () => {
        if (audioRef.current) {
            try {
                if (isPlaying) {
                    audioRef.current.pause();
                    setIsPlaying(false);
                    
                    // Ensure time display continues to update when paused
                    if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
                        setDuration(audioRef.current.duration);
                    }
                    setCurrentTime(audioRef.current.currentTime);
                } else {
                    if (!audioContextRef.current) {
                        initAudioAnalyzer();
                    }

                    const track = getCombinedPlaylist()[currentTrack];
                    if (!audioRef.current.src || audioRef.current.src === window.location.href || audioRef.current.src.endsWith("/")) {
                        audioRef.current.src = track?.path || "";
                        audioRef.current.load();
                        await new Promise((resolve) => setTimeout(resolve, 100));
                    }

                    try {
                        await audioRef.current.play();
                        setIsPlaying(true);
                        
                        // Update duration when playing
                        if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
                            setDuration(audioRef.current.duration);
                        }
                    } catch (playError) {
                        console.error("Play error:", playError);
                        setIsPlaying(true);
                    }
                }
            } catch (err) {
                console.error("Toggle play error:", err);
                setIsPlaying(!isPlaying);
            }
        }
    };

    const selectTrack = (index: number) => {
        setCurrentTrack(index);
        setCurrentTime(0);
        setIsPlaying(true);
    };

    const nextTrack = () => {
        const combinedPlaylist = getCombinedPlaylist();
        const newIndex = isShuffled ? Math.floor(Math.random() * combinedPlaylist.length) : (currentTrack + 1) % combinedPlaylist.length;
        setCurrentTrack(newIndex);
        setCurrentTime(0);
        setIsPlaying(true);
    };

    const prevTrack = () => {
        const combinedPlaylist = getCombinedPlaylist();
        const newIndex = currentTrack === 0 ? combinedPlaylist.length - 1 : currentTrack - 1;
        setCurrentTrack(newIndex);
        setCurrentTime(0);
        setIsPlaying(true);
    };

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (audioRef.current) {
            const progressBar = e.currentTarget;
            const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
            const clickPercentage = clickPosition / progressBar.clientWidth;
            const newTime = clickPercentage * duration;

            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseInt(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume / 100;
        }

        if (newVolume > 0 && isMuted) {
            setIsMuted(false);
        } else if (newVolume === 0 && !isMuted) {
            setIsMuted(true);
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

    const drawVisualizer = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;

        ctx.clearRect(0, 0, width, height);

        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, "#1f203b");
        gradient.addColorStop(1, "#0f0f20");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        if (visualizerMode === "classic") {
            drawClassicVisualizer(ctx, width, height);
        } else if (visualizerMode === "bars") {
            drawBarsVisualizer(ctx, width, height);
        } else if (visualizerMode === "modern") {
            drawModernVisualizer(ctx, width, height);
        } else {
            drawAlbumVisualizer(ctx, width, height);
        }

        animationRef.current = requestAnimationFrame(drawVisualizer);
    };

    const drawClassicVisualizer = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        const time = Date.now() * 0.001;
        const centerX = width / 2;
        const centerY = height / 2;

        const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
        bgGradient.addColorStop(0, "#1f203b");
        bgGradient.addColorStop(1, "#0f0f20");
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, width, height);

        for (let i = 10; i > 0; i--) {
            const radius = i * 20 + Math.sin(time * 2) * 5;
            const alpha = 0.6 - i * 0.05;

            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(123, 122, 169, ${alpha})`;
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 50);
        gradient.addColorStop(0, "rgba(220, 183, 223, 0.8)");
        gradient.addColorStop(0.5, "rgba(123, 122, 169, 0.6)");
        gradient.addColorStop(1, "rgba(83, 33, 125, 0)");

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
            ctx.fillStyle = "rgba(220, 183, 223, 0.7)";
            ctx.fill();
        }
    };

    const drawModernVisualizer = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        const time = Date.now() * 0.001;

        for (let i = 0; i < 100; i++) {
            const x = (Math.sin(i * 3.14 + time) * 0.5 + 0.5) * width;
            const y = (Math.cos(i * 2.51 + time) * 0.5 + 0.5) * height;
            const size = (Math.sin(time + i) * 0.5 + 0.5) * 3 + 1;

            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${(time * 20 + i * 2) % 360}, 100%, 70%, 0.7)`;
            ctx.fill();
        }

        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(0, height / 2);

            for (let x = 0; x < width; x += 10) {
                const y = height / 2 + Math.sin(x * 0.01 + time + i) * 50;
                ctx.lineTo(x, y);
            }

            ctx.strokeStyle = `rgba(80, 200, 255, ${0.3 - i * 0.05})`;
            ctx.lineWidth = 5 - i;
            ctx.stroke();
        }
    };

    const drawAlbumVisualizer = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        const track = getCombinedPlaylist()[currentTrack];
        const time = Date.now() * 0.001;

        const bgGradient = ctx.createLinearGradient(0, 0, width, height);
        bgGradient.addColorStop(0, "#1f203b");
        bgGradient.addColorStop(1, "#2b325b");
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, width, height);

        for (let i = 6; i > 0; i--) {
            const radius = width * (0.4 + i * 0.15) + Math.sin(time * 0.5 + i) * 20;
            ctx.beginPath();
            ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(123, 122, 169, ${0.1 - i * 0.01})`;
            ctx.lineWidth = 15;
            ctx.stroke();
        }

        const pulseSize = Math.sin(time * 1.5) * 0.05 + 0.95;

        const artSize = Math.min(width, height) * 0.4 * pulseSize;
        const artX = (width - artSize) / 2;
        const artY = (height - artSize) / 2;

        ctx.shadowColor = "rgba(220, 183, 223, 0.8)";
        ctx.shadowBlur = 30;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.beginPath();
        ctx.rect(artX, artY, artSize, artSize);
        ctx.fillStyle = "#1f203b";
        ctx.fill();

        const img = new Image();
        img.src = track.image;

        if (albumImageCache[currentTrack]) {
            ctx.drawImage(albumImageCache[currentTrack], artX, artY, artSize, artSize);
        } else {
            ctx.fillStyle = "#2b325b";
            ctx.fillRect(artX, artY, artSize, artSize);

            img.onload = () => {
                albumImageCache[currentTrack] = img;
            };
        }

        ctx.shadowBlur = 0;

        ctx.fillStyle = "rgba(220, 183, 223, 0.1)";
        ctx.beginPath();
        ctx.moveTo(artX, artY);
        ctx.lineTo(artX + artSize, artY);
        ctx.lineTo(artX + artSize * 0.8, artY + artSize);
        ctx.lineTo(artX, artY + artSize);
        ctx.closePath();
        ctx.fill();

        const trackInfoY = artY + artSize + 40;

        ctx.textAlign = "center";
        ctx.fillStyle = "rgba(123, 122, 169, 0.8)";
        ctx.font = `bold 14px var(--font-source-sans-pro), sans-serif`;
        ctx.fillText(`Album: ${track.album}`, width / 2, trackInfoY);

        ctx.fillStyle = "rgba(220, 183, 223, 1.0)";
        ctx.font = `bold 18px var(--font-raleway), sans-serif`;
        ctx.fillText(track.title, width / 2, trackInfoY + 25);

        ctx.fillStyle = "rgba(123, 122, 169, 0.7)";
        ctx.font = `15px var(--font-source-sans-pro), sans-serif`;
        ctx.fillText(track.artist, width / 2, trackInfoY + 50);

        for (let i = 0; i < 30; i++) {
            const angle = time + i * ((Math.PI * 2) / 30);
            const distance = artSize * 0.7 + Math.sin(time * 2 + i) * 20;
            const x = width / 2 + Math.cos(angle) * distance;
            const y = height / 2 + Math.sin(angle) * distance;

            ctx.beginPath();
            ctx.arc(x, y, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(220, 183, 223, 0.6)";
            ctx.fill();
        }

        for (let i = 0; i < 5; i++) {
            const lineY = height * 0.7 + i * 10 + Math.sin(time + i) * 5;

            ctx.beginPath();
            ctx.moveTo(0, lineY);
            ctx.lineTo(width, lineY);
            ctx.strokeStyle = `rgba(83, 33, 125, ${0.1 - i * 0.02})`;
            ctx.lineWidth = 3;
            ctx.stroke();
        }

        const ringPulse = Math.sin(time * 2) * 0.1 + 0.9;
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, artSize * 0.6 * ringPulse, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(83, 33, 125, 0.2)";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(width / 2, height / 2, artSize * 0.55 * ringPulse, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(220, 183, 223, 0.15)";
        ctx.lineWidth = 1;
        ctx.stroke();
    };

    const drawBarsVisualizer = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        const analyser = analyserRef.current;
        const dataArray = dataArrayRef.current;
        const time = Date.now() * 0.001;

        if (!analyser || !dataArray) {
            const barCount = 64;
            const barWidth = width / barCount - 2;
            const baseY = height * 0.85;

            for (let i = 0; i < barCount; i++) {
                const barHeight = Math.abs(Math.sin(i * 0.2 + time * 2)) * 100 + Math.abs(Math.sin(i * 0.1 + time)) * 80;

                const purple = 123 + (Math.sin(i * 0.1 + time) * 0.5 + 0.5) * 97;
                const blue = 122 + (Math.sin(i * 0.05 + time * 0.7) * 0.5 + 0.5) * 61;
                const dark = 169 + (i / barCount) * 54;

                const barGradient = ctx.createLinearGradient(0, baseY, 0, baseY - barHeight);
                barGradient.addColorStop(0, `rgba(83, 33, 125, 0.9)`);
                barGradient.addColorStop(0.5, `rgba(${purple}, ${blue}, ${dark}, 0.8)`);
                barGradient.addColorStop(1, `rgba(220, 183, 223, 0.7)`);

                ctx.fillStyle = barGradient;
                ctx.fillRect(i * (barWidth + 2) + 2, baseY - barHeight, barWidth, barHeight);

                ctx.beginPath();
                ctx.moveTo(i * (barWidth + 2) + 2, baseY - barHeight);
                ctx.lineTo(i * (barWidth + 2) + 2 + barWidth, baseY - barHeight);
                ctx.strokeStyle = "rgba(220, 183, 223, 0.5)";
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            ctx.textAlign = "center";
            ctx.fillStyle = "rgba(220, 183, 223, 0.8)";
            ctx.font = "bold 14px Arial";
            ctx.fillText("Audio Spectrum (Simulated)", width / 2, height * 0.1);

            return;
        }

        analyser.getByteFrequencyData(dataArray);

        const barCount = dataArray.length;
        const barGap = 2;
        const barWidth = (width - barGap) / barCount - barGap;
        const baseY = height * 0.85;

        const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
        bgGradient.addColorStop(0, "#1f203b");
        bgGradient.addColorStop(1, "#0f0f20");
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, width, height);

        for (let i = 0; i < barCount; i++) {
            const value = dataArray[i];
            const barHeight = (value / 255) * height * 0.7;

            const x = barGap + (barWidth + barGap) * i;
            const y = baseY - barHeight;

            const purple = 123 + (value / 255) * 97;
            const blue = 122 + (value / 255) * 61;
            const dark = 169 + (value / 255) * 54;

            const barGradient = ctx.createLinearGradient(x, baseY, x, y);
            barGradient.addColorStop(0, `rgba(83, 33, 125, 0.9)`);
            barGradient.addColorStop(0.6, `rgba(${purple}, ${blue}, ${dark}, 0.8)`);
            barGradient.addColorStop(1, `rgba(220, 183, 223, 0.7)`);

            ctx.fillStyle = barGradient;
            ctx.fillRect(x, y, barWidth, barHeight);

            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + barWidth, y);
            ctx.strokeStyle = `rgba(220, 183, 223, 0.8)`;
            ctx.lineWidth = 1;
            ctx.stroke();

            if (barHeight > height * 0.25) {
                ctx.shadowColor = `rgba(83, 33, 125, 0.6)`;
                ctx.shadowBlur = 15;
                ctx.beginPath();
                ctx.arc(x + barWidth / 2, y, barWidth / 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(220, 183, 223, 0.2)`;
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

            const purple = 123 + (value / 255) * 97;
            const blue = 122 + (value / 255) * 61;
            const dark = 169 + (value / 255) * 54;

            const barGradient = ctx.createLinearGradient(x, y, x, y + barHeight);
            barGradient.addColorStop(0, `rgba(${purple}, ${blue}, ${dark}, 0.5)`);
            barGradient.addColorStop(1, `rgba(${purple}, ${blue}, ${dark}, 0)`);

            ctx.fillStyle = barGradient;
            ctx.fillRect(x, y, barWidth, barHeight);
        }
        ctx.globalAlpha = 1.0;

        ctx.shadowColor = "rgba(83, 33, 125, 0.8)";
        ctx.shadowBlur = 10 + Math.sin(time * 2) * 5;

        ctx.textAlign = "center";
        ctx.fillStyle = "rgba(220, 183, 223, 0.8)";
        ctx.font = "bold 14px Arial";
        ctx.fillText("Audio Spectrum Analyzer", width / 2, height * 0.1);

        ctx.shadowBlur = 0;
    };

    const initAudioAnalyzer = () => {
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

        const handleEnded = () => {
            if (isRepeating) {
                audio.currentTime = 0;
                audio.play().catch((err) => console.error("Failed to replay track:", err));
            } else {
                nextTrack();
            }
        };

        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("loadedmetadata", handleLoadedMetadata);
        audio.addEventListener("ended", handleEnded);

        return () => {
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
            audio.removeEventListener("ended", handleEnded);
        };
    }, [isRepeating]);

    useEffect(() => {
        if (!audioRef.current) return;

        const handleTrackChange = async () => {
            try {
                const track = getCombinedPlaylist()[currentTrack];
                if (!track) return;

                audioRef.current!.src = track.path;
                audioRef.current!.load();

                setCurrentTime(0);

                if (isPlaying) {
                    try {
                        if (!audioContextRef.current) {
                            initAudioAnalyzer();
                        }
                        await audioRef.current!.play();
                    } catch (err) {
                        console.error("Failed to auto-play track:", err);
                    }
                }
            } catch (err) {
                console.error("Track change error:", err);
            }
        };

        handleTrackChange();
    }, [currentTrack, isPlaying]);

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
        drawVisualizer();
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [visualizerMode, currentTrack]);

    const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const newTracks = Array.from(files).map((file, index) => {
            const fileUrl = URL.createObjectURL(file);
            const fileName = file.name.replace(/\.[^/.]+$/, "");

            return {
                id: `local-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
                title: fileName,
                artist: "Local Media",
                album: "My Music Collection",
                duration: "0:00",
                path: fileUrl,
                isLocal: true,
                file: file,
                image: "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/artistic-album-cover-design-template-d12ef0296af80b58363dc0deef077ecc_screen.jpg?ts=1735798846",
            };
        });

        setCustomTracks((prev) => [...prev, ...newTracks]);

        if (!isPlaying && newTracks.length > 0) {
            const newIndex = getCombinedPlaylist().length - newTracks.length;
            setCurrentTrack(newIndex);
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();

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

        if (audioFiles.length === 0) return;

        const newTracks = audioFiles.map((file, index) => {
            const fileUrl = URL.createObjectURL(file);
            const fileName = file.name.replace(/\.[^/.]+$/, "");

            return {
                id: `drop-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
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

        if (!isPlaying && newTracks.length > 0) {
            const newIndex = getCombinedPlaylist().length - newTracks.length;
            setCurrentTrack(newIndex);
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleNavItemClick = (id: string) => {
        setActiveNavItem(id);
        // Add specific actions based on nav item clicked
        if (id === "media-library") {
            setShowPlaylist(true);
        } else if (id === "skin-chooser") {
            cycleVisualizer();
        }
    };

    return (
        <div
            className={`min-h-screen bg-[#7b7aa9] flex flex-col items-center justify-center p-4 ${raleway.variable} ${sourceSansPro.variable}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
        >
            <div
                className={`w-full max-w-5xl ${isFullscreen ? "fixed inset-0 max-w-none" : ""} 
                    bg-gradient-to-b from-[#2b325b]/90 to-[#1f203b]/95 
                    backdrop-blur-md border border-[#53217d]/40 rounded-md 
                    shadow-[0_0_30px_rgba(83,33,125,0.4)] text-white overflow-hidden flex flex-col 
                    font-sans`}
                style={{ fontFamily: 'var(--font-source-sans-pro)' }}
            >
                <div className="bg-gradient-to-r from-[#53217d] to-[#2b325b] px-4 py-1.5 flex justify-between items-center border-b border-[#dcb7df]/30">
                    <div className="flex items-center">
                        <div className="w-5 h-5 mr-2 bg-[#dcb7df] rounded-sm flex items-center justify-center">
                            <span className="text-[#1f203b] text-xs">▶</span>
                        </div>
                        <span className="text-sm font-semibold text-white" style={{ fontFamily: 'var(--font-raleway)' }}>Windows Media Player</span>
                    </div>

                    <div className="flex space-x-1">
                        <button className="text-white/80 hover:text-white px-1.5 mb-2 cursor-pointer transition-colors duration-200">
                            _
                        </button>
                        <button
                            className="text-white/80 hover:text-white px-1.5 cursor-pointer transition-colors duration-200"
                            onClick={() => setIsFullscreen(!isFullscreen)}
                        >
                            □
                        </button>
                        <button className="text-white/80 hover:text-white px-1.5 cursor-pointer transition-colors duration-200">×</button>
                    </div>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    <div className="bg-gradient-to-b from-[#2b325b] to-[#1f203b] w-28 p-3 flex-shrink-0 border-r border-[#53217d]/30">
                        <div className="text-sm text-[#dcb7df]/90 font-bold mb-1.5" style={{ fontFamily: 'var(--font-raleway)' }}>Now Playing</div>

                        <div className="space-y-4 text-xs">
                            {navItems.map((item) => (
                                <div
                                    key={item.id}
                                    className={`cursor-pointer hover:text-[#dcb7df] transition-colors duration-200
                               ${item.id === activeNavItem ? "text-[#dcb7df] font-semibold" : "text-[#7b7aa9]"}`}
                                    onClick={() => handleNavItemClick(item.id)}
                                >
                                    {item.label}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col">
                        <div className="bg-gradient-to-r from-[#1f203b] to-[#2b325b] px-4 py-2 flex items-center justify-between border-b border-[#53217d]/30">
                            <div className="flex items-center space-x-3">
                                <button 
                                    className="text-[#7b7aa9] hover:text-[#dcb7df] focus:outline-none cursor-pointer transition-colors duration-200"
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
                                    className="text-[#7b7aa9] hover:text-[#dcb7df] focus:outline-none cursor-pointer transition-colors duration-200"
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
                                    className="text-[#7b7aa9] hover:text-[#dcb7df] focus:outline-none cursor-pointer transition-colors duration-200"
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
                                    className="text-[#7b7aa9] hover:text-[#dcb7df] focus:outline-none cursor-pointer transition-colors duration-200 flex items-center"
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
                                    className="bg-[#454157] text-[#dcb7df] px-3 py-1 text-xs rounded border border-[#53217d]/50 flex items-center hover:bg-[#53217d]/60 cursor-pointer transition-all duration-200"
                                    onClick={() => setShowPlaylist(!showPlaylist)}
                                >
                                    <span className="mr-1.5">{showPlaylist ? "Hide Playlist" : "Show Playlist"}</span>
                                    <svg 
                                        width="12" 
                                        height="12" 
                                        viewBox="0 0 12 12" 
                                        fill="none" 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        className={`transform transition-transform duration-300 ease-in-out ${showPlaylist ? 'rotate-180' : ''}`}
                                    >
                                        <path
                                            d="M3 4.5L6 7.5L9 4.5"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-[#1f203b] to-[#2b325b] px-4 py-2 border-b border-[#53217d]/30">
                            <div className="text-xs text-[#7b7aa9]">{getCombinedPlaylist()[currentTrack]?.artist}</div>
                            <div className="text-sm font-medium text-[#dcb7df]" style={{ fontFamily: 'var(--font-raleway)' }}>{getCombinedPlaylist()[currentTrack]?.title}</div>
                        </div>

                        <div className="flex-1 flex overflow-hidden relative">
                            <div className="flex-1 bg-black relative overflow-hidden">
                                <canvas ref={canvasRef} className="w-full h-full" width={800} height={600} />
                            </div>

                            <div 
                                className={`absolute top-0 right-0 bottom-0 w-72 bg-[#1f203b]/95 border-l border-[#53217d]/40 
                                overflow-y-auto transition-transform duration-300 ease-in-out transform 
                                ${showPlaylist ? 'translate-x-0' : 'translate-x-full'}`}
                            >
                                <div className="p-3">
                                    <h3 className="text-sm font-semibold text-[#dcb7df] mb-2" style={{ fontFamily: 'var(--font-raleway)' }}>Media Library</h3>
                                    <div className="space-y-0.5">
                                        {getCombinedPlaylist().map((track, index) => (
                                            <div
                                                key={`track-${track.id || index}`}
                                                className={`flex items-center text-xs p-1.5 ${
                                                    currentTrack === index
                                                        ? "bg-[#53217d]/40 text-[#dcb7df]"
                                                        : "text-[#7b7aa9] hover:bg-[#2b325b]/70 hover:text-[#dcb7df]"
                                                } cursor-pointer transition-all duration-200 rounded`}
                                                onClick={() => selectTrack(index)}
                                            >
                                                <div className="w-2 mr-2">
                                                    {currentTrack === index && (
                                                        <div className="w-2 h-2 bg-[#dcb7df] rounded-full"></div>
                                                    )}
                                                </div>
                                                <div className="flex-1 truncate">
                                                    {track.title}
                                                    {track.isLocal && <span className="ml-1 text-[#dcb7df]/60">(local)</span>}
                                                </div>
                                                <div className="ml-2 text-[#dcb7df]/70">{track.duration}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-[#1f203b] to-[#2b325b] px-4 py-3 border-t border-[#53217d]/40">
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-xs text-[#7b7aa9]">Album: {getCombinedPlaylist()[currentTrack]?.album}</div>
                                <div className="flex items-center space-x-1.5 text-xs text-[#7b7aa9]">
                                    <span>Total Time: {getCombinedPlaylist()[currentTrack]?.duration}</span>
                                    <span>|</span>
                                    <span>
                                        {formatTime(currentTime)} / {formatTime(duration)}
                                    </span>
                                </div>
                            </div>

                            <div
                                className="h-2 bg-[#454157] rounded-full overflow-hidden cursor-pointer mb-3 transition-colors duration-200 hover:bg-[#454157]/80"
                                onClick={handleProgressClick}
                            >
                                <div
                                    className="h-full bg-gradient-to-r from-[#53217d] to-[#dcb7df] rounded-full"
                                    style={{ width: `${(currentTime / duration) * 100 || 0}%`, transition: "width 0.1s linear" }}
                                ></div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <button
                                        className="text-[#7b7aa9] hover:text-[#dcb7df] focus:outline-none cursor-pointer transition-colors duration-200"
                                        onClick={() => prevTrack()}
                                    >
                                        <FaStepBackward size={16} />
                                    </button>

                                    <button
                                        className="w-9 h-9 relative overflow-hidden rounded-full flex items-center justify-center focus:outline-none shadow-md cursor-pointer group"
                                        onClick={togglePlay}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-b from-[#53217d] to-[#2b325b] transition-opacity duration-300 ease-in-out group-hover:opacity-0"></div>

                                        <div className="absolute inset-0 bg-gradient-to-b from-[#dcb7df] to-[#53217d] opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"></div>

                                        <div className="relative z-10">
                                            {isPlaying ? (
                                                <FaPause size={14} className="text-white" />
                                            ) : (
                                                <FaPlay size={14} className="text-white" />
                                            )}
                                        </div>
                                    </button>

                                    <button
                                        className="text-[#7b7aa9] hover:text-[#dcb7df] focus:outline-none cursor-pointer transition-colors duration-200"
                                        onClick={() => nextTrack()}
                                    >
                                        <FaStepForward size={16} />
                                    </button>

                                    <button
                                        className={`focus:outline-none cursor-pointer transition-colors duration-200 ${
                                            isShuffled ? "text-[#dcb7df]" : "text-[#7b7aa9] hover:text-[#dcb7df]"
                                        }`}
                                        onClick={() => setIsShuffled(!isShuffled)}
                                    >
                                        <MdShuffle size={18} />
                                    </button>

                                    <button
                                        className={`focus:outline-none cursor-pointer transition-colors duration-200 ${
                                            isRepeating ? "text-[#dcb7df]" : "text-[#7b7aa9] hover:text-[#dcb7df]"
                                        }`}
                                        onClick={() => setIsRepeating(!isRepeating)}
                                    >
                                        <MdRepeat size={18} />
                                    </button>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <button
                                        className="text-[#7b7aa9] hover:text-[#dcb7df] focus:outline-none cursor-pointer transition-colors duration-200"
                                        onClick={toggleMute}
                                    >
                                        {isMuted ? <FaVolumeMute size={16} /> : <FaVolumeUp size={16} />}
                                    </button>

                                    <div className="relative w-24 h-3 cursor-pointer">
                                        <div className="absolute inset-0 h-1 top-1 bg-[#454157] rounded-full"></div>

                                        <div
                                            className="absolute h-1 top-1 left-0 bg-[#dcb7df] rounded-full"
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

            <audio ref={audioRef} crossOrigin="anonymous" />
        </div>
    );
};

export default WinMediaPlayer;
