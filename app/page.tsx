"use client";

import React, { useState, useEffect, useRef } from "react";
import { ThemeProvider, useTheme } from "next-themes";
import { ChevronDown, Instagram, Facebook, Twitter, Linkedin, Youtube, Search, Menu, X, Moon, Sun, Feather, Play, Pause, Volume2, Volume1, VolumeX, Rewind, FastForward } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

const GlobalThemeStyles = () => (
    <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Playfair+Display:wght@400;700&display=swap');

        :root {
            /* Semantic Font Variables */
            --font-heading: 'Playfair Display', serif;
            --font-body: 'Merriweather', serif;

            /* Light Theme Variables */
            --page-bg: #ffffff; /* Full white */
            --page-text-primary: #111827;
            --page-text-secondary: #4b5563;
            --card-bg: #f9fafb; /* Very light gray for cards to distinguish from pure white page */
            --border-color-primary: #e5e7eb;
            --accent-primary: #f97316;
            --accent-primary-hover: #ea580c;

            --navbar-bg: #ffffff; /* Navbar can be white, separated by border */
            --navbar-text: #111827;
            --button-text-primary: #ffffff;

            --sidebar-bg: #f9fafb; /* Sidebar also very light gray */
            --sidebar-text: #374151;
            --filter-checkbox-bg: #e5e7eb;
            --filter-checkbox-checked-bg: var(--accent-primary);

            --footer-bg: #1f2937;
            --footer-text: #d1d5db;
            --footer-link-hover: var(--accent-primary);

            /* New Hero Button Variables - Light Theme */
            --hero-button-text: #111827;
            --hero-button-border: #d1d5db; /* gray-300 */
            --hero-button-hover-bg: #f3f4f6; /* gray-100 */
            --hero-button-hover-border: #9ca3af; /* gray-400 */

            /* Glassmorphism Variables - Light Theme */
            --navbar-bg-scrolled: rgba(255, 255, 255, 0.8);
            --navbar-backdrop-blur: 8px;
            --navbar-shadow-scrolled: rgba(0, 0, 0, 0.05);

            /* Chart Variables - Light Theme */
            --chart-text-color: #374151; /* gray-700 */
            --chart-grid-color: #e5e7eb; /* gray-200 */
            --chart-bg-color: var(--card-bg); /* Use card background for chart container */
            --chart-border-color: var(--border-color-primary);
            --chart-tooltip-bg: #ffffff;
            --chart-tooltip-text: var(--page-text-primary);
            --chart-color-1: #3b82f6; /* blue-500 */
            --chart-color-2: #10b981; /* emerald-500 */
            --chart-color-3: #ef4444; /* red-500 */
            --chart-color-4: #8b5cf6; /* violet-500 */
            --chart-color-5: #f97316; /* orange-500 (accent) */
        }

        html.dark {
            /* Dark Theme Variable Overrides */
            --page-bg: #0a0a0a; /* Very dark, almost black */
            --page-text-primary: #f3f4f6;
            --page-text-secondary: #9ca3af;
            --card-bg: #1a1a1a; /* Dark gray for cards, distinct from page */
            --border-color-primary: #2e2e2e; /* Darker border for visibility */

            --navbar-bg: #0a0a0a; /* Navbar matches dark page, separated by border */
            --navbar-text: #f3f4f6;

            --sidebar-bg: #1a1a1a; /* Sidebar also dark gray */
            --sidebar-text: #d1d5db;
            --filter-checkbox-bg: #374151;
            --filter-checkbox-checked-bg: var(--accent-primary);

            --footer-bg: #000000;
            --footer-text: #9ca3af;

            /* New Hero Button Variables - Dark Theme */
            --hero-button-text: #f3f4f6;
            --hero-button-border: #4b5563; /* gray-600 */
            --hero-button-hover-bg: #374151; /* gray-700 */
            --hero-button-hover-border: #6b7280; /* gray-500 */

            /* Glassmorphism Variables - Dark Theme */
            --navbar-bg-scrolled: rgba(10, 10, 10, 0.7);
            /* --navbar-backdrop-blur is same as light */
            --navbar-shadow-scrolled: rgba(255, 255, 255, 0.05);

            /* Chart Variables - Dark Theme */
            --chart-text-color: #d1d5db; /* gray-300 */
            --chart-grid-color: #374151; /* gray-700 */
            --chart-bg-color: var(--card-bg);
            --chart-border-color: var(--border-color-primary);
            --chart-tooltip-bg: #27272a; /* Slightly lighter than card-bg for dark */
            --chart-tooltip-text: var(--page-text-primary);
            --chart-color-1: #60a5fa; /* blue-400 */
            --chart-color-2: #34d399; /* emerald-400 */
            --chart-color-3: #f87171; /* red-400 */
            --chart-color-4: #a78bfa; /* violet-400 */
            --chart-color-5: #fb923c; /* orange-400 (accent) */
        }

        body {
            background-color: var(--page-bg);
            color: var(--page-text-primary);
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
        }

        /* Custom Scrollbar (Optional but nice) */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        ::-webkit-scrollbar-track {
            background: var(--border-color-primary);
        }
        ::-webkit-scrollbar-thumb {
            background: var(--accent-primary);
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: var(--accent-primary-hover);
        }
    `}</style>
);

const ThemeToggleButton = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-md hover:bg-[var(--border-color-primary)] transition-colors cursor-pointer"
        >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    );
};

const Header = ({ 
    onSubscribeClick, 
    onNavigate, 
    currentPage 
}: { 
    onSubscribeClick: () => void; 
    onNavigate: (page: 'home' | 'statistics' | 'about') => void;
    currentPage: 'home' | 'statistics' | 'about';
}) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', page: 'home' as const },
        { name: 'Statistics', page: 'statistics' as const },
        { name: 'About', page: 'about' as const },
    ];

    return (
        <header
            className={`sticky top-0 z-50 transition-all duration-300 ease-in-out`}
            style={{
                backgroundColor: isScrolled ? "var(--navbar-bg-scrolled)" : "var(--navbar-bg)",
                backdropFilter: isScrolled ? `blur(var(--navbar-backdrop-blur))` : "none",
                WebkitBackdropFilter: isScrolled ? `blur(var(--navbar-backdrop-blur))` : "none",
                boxShadow: isScrolled ? `0 2px 10px var(--navbar-shadow-scrolled)` : "none",
            }}
        >
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('home')}>
                    <Feather size={28} className="text-[var(--accent-primary)]" />
                    <span className="text-2xl font-bold text-[var(--navbar-text)]" style={{ fontFamily: "var(--font-heading)" }}>
                        The Digital Quill
                    </span>
                </div>
                
                <nav className="hidden md:flex items-center space-x-6">
                    {navLinks.map(link => (
                        <button 
                            key={link.page}
                            onClick={() => onNavigate(link.page)}
                            className={`text-sm font-medium transition-colors cursor-pointer pb-1
                                        ${currentPage === link.page 
                                            ? 'text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)]' 
                                            : 'text-[var(--navbar-text)] hover:text-[var(--accent-primary)]'}`}
                        >
                            {link.name}
                        </button>
                    ))}
                </nav>

                <div className="flex items-center space-x-2 md:space-x-4">
                    <button 
                        onClick={onSubscribeClick} 
                        className="hidden sm:inline-block bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-[var(--button-text-primary)] px-4 py-2 rounded-md font-semibold transition-colors cursor-pointer"
                    >
                        Subscribe
                    </button>
                    <ThemeToggleButton />
                    <div className="md:hidden">
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-[var(--navbar-text)] cursor-pointer">
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>
            {mobileMenuOpen && (
                <div 
                    className="md:hidden py-3 border-t border-[var(--border-color-primary)]"
                    style={{
                        backgroundColor: "var(--navbar-bg-scrolled)", 
                        backdropFilter: `blur(var(--navbar-backdrop-blur))`,
                        WebkitBackdropFilter: `blur(var(--navbar-backdrop-blur))`,
                    }}
                >
                    <nav className="flex flex-col space-y-2 px-4">
                        {navLinks.map(link => (
                            <button 
                                key={`mobile-${link.page}`}
                                onClick={() => { onNavigate(link.page); setMobileMenuOpen(false); }}
                                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer
                                            ${currentPage === link.page 
                                                ? 'bg-[var(--accent-primary)] text-[var(--button-text-primary)]' 
                                                : 'text-[var(--navbar-text)] hover:bg-[var(--border-color-primary)]'}`}
                            >
                                {link.name}
                            </button>
                        ))}
                        <button 
                            onClick={() => { 
                                onSubscribeClick(); 
                                setMobileMenuOpen(false); 
                            }}
                            className="w-full bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-[var(--button-text-primary)] px-3 py-2 rounded-md font-semibold transition-colors cursor-pointer mt-2"
                        >
                            Subscribe
                        </button>
                    </nav>
                </div>
            )}
        </header>
    );
};

interface ContentSectionBase {
    id: string;
}
interface HeadingSection extends ContentSectionBase {
    type: "heading";
    level: 2 | 3 | 4;
    text: string;
}
interface ParagraphSection extends ContentSectionBase {
    type: "paragraph";
    text: string;
}
interface ImageSection extends ContentSectionBase {
    type: "image";
    src: string;
    alt: string;
}
interface CodeBlockSection extends ContentSectionBase {
    type: "code";
    language: string;
    code: string;
}
interface VideoSection extends ContentSectionBase {
    type: "video";
    src: string;
    alt?: string;
}

type ContentSection = HeadingSection | ParagraphSection | ImageSection | CodeBlockSection | VideoSection;

interface BlogData {
    id: string;
    title: string;
    category: string;
    date: string;
    summary: string;
    imageUrl: string;
    heroImageUrl?: string;
    fullContent: ContentSection[];
}

const QuickFilters = ({ activeFilters, onToggleFilter }: { activeFilters: string[]; onToggleFilter: (filterName: string) => void }) => {
    const filters = ["UX Design", "Branding", "Web Development", "Design System", "Marketing"];
    const socialLinks = [
        { Icon: Instagram, href: "https://instagram.com", name: "Instagram" },
        { Icon: Facebook, href: "https://facebook.com", name: "Facebook" },
        { Icon: Twitter, href: "https://twitter.com", name: "Twitter" },
        { Icon: Linkedin, href: "https://linkedin.com", name: "LinkedIn" },
        { Icon: Youtube, href: "https://youtube.com", name: "YouTube" },
    ];

    return (
        <div className="py-6">
            <h3 className="text-xl font-semibold mb-4 text-[var(--page-text-primary)]">Quick Filters</h3>
            <div className="space-y-3">
                {filters.map((filter) => (
                    <label key={filter} className="flex items-center space-x-2 cursor-pointer group">
                        <input
                            type="checkbox"
                            className="form-checkbox h-5 w-5 rounded bg-[var(--filter-checkbox-bg)] checked:bg-[var(--filter-checkbox-checked-bg)] border-transparent focus:ring-0 focus:ring-offset-0 appearance-none relative cursor-pointer
                         peer shrink-0
                         after:content-[''] after:absolute after:left-0 after:top-0 after:h-full after:w-full after:bg-no-repeat after:bg-center after:bg-[length:80%_80%]
                         "
                            checked={activeFilters.includes(filter)}
                            onChange={() => onToggleFilter(filter)}
                        />
                        <span className="text-[var(--page-text-secondary)] group-hover:text-[var(--accent-primary)] transition-colors">
                            {filter}
                        </span>
                    </label>
                ))}
            </div>
            <h3 className="text-lg font-semibold mt-8 mb-3 text-[var(--page-text-primary)]">Follow us on:</h3>
            <div className="flex space-x-3">
                {socialLinks.map(({ Icon, href, name }) => (
                    <a
                        key={name}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--page-text-secondary)] hover:text-[var(--accent-primary)] transition-colors cursor-pointer"
                        aria-label={`Follow on ${name}`}
                    >
                        <Icon size={22} />
                    </a>
                ))}
            </div>
        </div>
    );
};

const BlogCard = ({
    id,
    title,
    category,
    date,
    summary,
    imageUrl,
    onSelectPost,
}: BlogData & { onSelectPost: (postId: string) => void }) => {
    return (
        <div className="rounded-lg overflow-hidden flex flex-col md:flex-row items-start p-6">
            <img
                src={imageUrl || "https://placehold.co/150x100/E2E8F0/94A3B8?text=Blog"}
                alt={title}
                className="w-full md:w-40 h-auto md:h-24 object-cover rounded-md mr-0 md:mr-6 mb-4 md:mb-0"
            />
            <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[var(--accent-primary)]">{category}</span>
                    <span className="text-xs text-[var(--page-text-secondary)]">{date}</span>
                </div>
                <h2
                    onClick={() => onSelectPost(id)}
                    className="text-xl lg:text-2xl font-bold mb-2 text-[var(--page-text-primary)] hover:text-[var(--accent-primary)] transition-colors cursor-pointer"
                >
                    {title}
                </h2>
                <p className="text-sm text-[var(--page-text-secondary)] mb-3 leading-relaxed">{summary}</p>
                <button
                    onClick={() => onSelectPost(id)}
                    className="text-sm font-semibold text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] transition-colors cursor-pointer"
                >
                    Read full blog &rarr;
                </button>
            </div>
        </div>
    );
};

const ParallaxImage = ({ 
    src, 
    alt, 
    containerClassName, 
    imageClassName, 
    strength = 0.15 // Default strength for a subtle effect
} : { 
    src: string; 
    alt: string; 
    containerClassName: string; 
    imageClassName?: string; 
    strength?: number; 
}) => {
    const [offsetY, setOffsetY] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const scaleAmount = 1 + strength * 2; // e.g., strength 0.15 -> scale 1.3

    useEffect(() => {
        const handleScroll = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const containerHeight = containerRef.current.offsetHeight;
                const viewportHeight = window.innerHeight;

                // Only calculate if the container is somewhat in view
                if (rect.top < viewportHeight && rect.bottom > 0 && containerHeight > 0) {
                    // Calculate the center of the container relative to the viewport top
                    const containerCenterY = rect.top + containerHeight / 2;
                    // Calculate the progress of the container's center through the viewport center
                    // Progress = 0 when container center is at viewport center
                    // Progress = -1 when container center is at viewport top
                    // Progress = 1 when container center is at viewport bottom
                    const progress = (containerCenterY - viewportHeight / 2) / (viewportHeight / 2);

                    const maxDisplacement = (containerHeight * (scaleAmount - 1)) / 2;
                    
                    let newOffsetY = -progress * maxDisplacement;
                    
                    // Clamp offsetY to ensure scaled image edges are not shown
                    newOffsetY = Math.max(-maxDisplacement, Math.min(maxDisplacement, newOffsetY));

                    setOffsetY(newOffsetY);
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial calculation

        return () => window.removeEventListener('scroll', handleScroll);
    }, [strength, scaleAmount]); // Rerun if strength changes

    return (
        <div ref={containerRef} className={`overflow-hidden relative ${containerClassName}`}>
            <img
                src={src}
                alt={alt}
                className={`w-full h-full object-cover ${imageClassName || ''}`}
                style={{
                    transform: `scale(${scaleAmount}) translateY(${offsetY}px)`,
                    willChange: 'transform',
                }}
            />
        </div>
    );
};

const ScrollAnimatedMedia = ({ 
    type, 
    src, 
    alt, 
    className 
} : { 
    type: 'image' | 'video'; 
    src: string; 
    alt?: string; 
    className?: string;
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target); // Animate only once
                }
            },
            {
                rootMargin: '0px',
                threshold: 0.1 // Trigger when 10% of the element is visible
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    const baseClasses = "transition-all duration-700 ease-out";
    const visibilityClasses = isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5";

    return (
        <div ref={ref} className={`${baseClasses} ${visibilityClasses} ${className || ''}`}>
            {type === 'image' && (
                <img src={src} alt={alt || 'Blog content image'} className="w-full h-auto rounded-lg shadow-md my-6" />
            )}
            {type === 'video' && (
                <video src={src} controls className="w-full h-auto rounded-lg shadow-md my-6">
                    {alt && <p>Video: {alt}</p>} {/* Fallback for browsers that don't support video / for screen readers if no poster */} 
                    Your browser does not support the video tag.
                </video>
            )}
        </div>
    );
};

const AudioPlayer = ({ src }: { src: string }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(0.75); // Default volume 75%
    const [isMuted, setIsMuted] = useState(false);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const setAudioData = () => {
            setDuration(audio.duration);
            setCurrentTime(audio.currentTime);
        };

        const setAudioTime = () => setCurrentTime(audio.currentTime);
        const handleEnded = () => setIsPlaying(false);

        audio.addEventListener('loadeddata', setAudioData);
        audio.addEventListener('timeupdate', setAudioTime);
        audio.addEventListener('ended', handleEnded);
        audio.volume = isMuted ? 0 : volume;

        return () => {
            audio.removeEventListener('loadeddata', setAudioData);
            audio.removeEventListener('timeupdate', setAudioTime);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [isMuted, volume]); // Rerun when mute or volume changes to update audio element

    const togglePlayPause = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play().catch(error => console.error("Error playing audio:", error));
        }
        setIsPlaying(!isPlaying);
    };

    const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(event.target.value);
        setVolume(newVolume);
        setIsMuted(false); // Unmute if changing volume with slider
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    const toggleMute = () => {
        const newMutedState = !isMuted;
        setIsMuted(newMutedState);
        if (audioRef.current) {
            audioRef.current.volume = newMutedState ? 0 : volume;
        }
    };

    const formatTime = (timeInSeconds: number) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const VolumeIcon = isMuted ? VolumeX : volume > 0.5 ? Volume2 : volume > 0 ? Volume1 : VolumeX;

    return (
        <div className="fixed bottom-4 right-4 z-50 p-3 rounded-lg shadow-xl 
                        bg-[var(--card-bg)] border border-[var(--border-color-primary)] 
                        text-[var(--page-text-primary)] flex items-center space-x-3">
            <audio ref={audioRef} src={src} />
            
            <button onClick={togglePlayPause} className="p-2 hover:bg-[var(--border-color-primary)] rounded-full transition-colors cursor-pointer">
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>

            <div className="text-xs w-20 text-center">
                {formatTime(currentTime)} / {formatTime(duration)}
            </div>

            <div 
                className="relative flex items-center"
                onMouseEnter={() => setShowVolumeSlider(true)}
                onMouseLeave={() => setShowVolumeSlider(false)}
            >
                <button onClick={toggleMute} className="p-2 hover:bg-[var(--border-color-primary)] rounded-full transition-colors cursor-pointer">
                    <VolumeIcon size={20} />
                </button>
                {showVolumeSlider && (
                    <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.01" 
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange} 
                        className="absolute bottom-full mb-2 right-0 transform translate-x-1/4 w-24 h-2 rounded-lg appearance-none cursor-pointer 
                                   bg-[var(--border-color-primary)] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 
                                   [&::-webkit-slider-thumb]:bg-[var(--accent-primary)] [&::-webkit-slider-thumb]:rounded-full
                                   dark:[&::-moz-range-thumb]:bg-[var(--accent-primary)] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none"
                    />
                )}
            </div>
        </div>
    );
};

const MainContent = ({
    allBlogPosts,
    activeFilters,
    onToggleFilter,
    onSelectPost,
    featuredPostTitleForHero,
    featuredPostForHero,
}: {
    allBlogPosts: BlogData[];
    activeFilters: string[];
    onToggleFilter: (filterName: string) => void;
    onSelectPost: (postId: string) => void;
    featuredPostTitleForHero: string;
    featuredPostForHero: BlogData; // Non-nullable
}) => {
    const sortedBlogPosts = [...allBlogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const filteredPosts =
        activeFilters.length === 0
            ? sortedBlogPosts
            : sortedBlogPosts.filter((post) => activeFilters.some((filter) => post.category.toLowerCase() === filter.toLowerCase()));

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Hero Section uses featuredPostForHero data */}
            <div className="mb-12">
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-6 lg:gap-8 mb-8">
                    <div className="md:flex-1">
                        <h1 className="text-4xl md:text-5xl font-bold text-[var(--page-text-primary)] leading-tight">
                            {featuredPostTitleForHero}
                        </h1>
                    </div>
                    <div className="md:max-w-xs">
                        <p className="text-sm md:text-base text-[var(--page-text-secondary)] leading-relaxed mb-4">
                            {featuredPostForHero.summary}
                        </p>
                        <button
                            onClick={() => onSelectPost(featuredPostForHero.id)}
                            className="inline-block border px-5 py-2.5 rounded-md font-bold 
                                         text-[var(--hero-button-text)] border-[var(--hero-button-border)] 
                                         hover:bg-[var(--hero-button-hover-bg)] hover:border-[var(--hero-button-hover-border)] 
                                         transition-colors cursor-pointer text-sm whitespace-nowrap"
                        >
                            Read full blog
                        </button>
                    </div>
                </div>
                <ParallaxImage
                    src={featuredPostForHero.heroImageUrl || featuredPostForHero.imageUrl}
                    alt={featuredPostTitleForHero}
                    containerClassName="w-full h-80 md:h-[500px] rounded-xl shadow-lg"
                    imageClassName="rounded-xl"
                    strength={0.15}
                />
            </div>
            <div className="flex flex-col lg:flex-row gap-8">
                <aside className="w-full lg:w-1/4">
                    <QuickFilters activeFilters={activeFilters} onToggleFilter={onToggleFilter} />
                </aside>
                <main className="w-full lg:w-3/4">
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map((post, index) => (
                            <React.Fragment key={post.id}>
                                <BlogCard {...post} onSelectPost={onSelectPost} />
                                {index < filteredPosts.length - 1 && <hr className="my-8 border-[var(--border-color-primary)]" />}
                            </React.Fragment>
                        ))
                    ) : (
                        <p className="text-[var(--page-text-secondary)] text-center py-10">No posts match the selected filters.</p>
                    )}
                    {filteredPosts.length > 0 && ( // "See more blogs" button condition
                        <div className="text-center mt-8">
                            <button className="bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-[var(--button-text-primary)] px-8 py-3 rounded-md font-semibold transition-colors cursor-pointer text-lg">
                                See more blogs
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

const NewsletterSection = () => {
    const [notification, setNotification] = useState<string | null>(null);

    const handleSubscriptionAttempt = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const emailInput = form.elements.namedItem('email') as HTMLInputElement;

        if (emailInput && emailInput.value) {
            setNotification("You are now subscribed! Thank you.");
            emailInput.value = ''; // Clear the input
        } else {
            setNotification("Please enter a valid email address.");
        }
        
        setTimeout(() => {
            setNotification(null);
        }, 3000);
    };

    return (
        <section 
            id="newsletter-signup"
            className="py-16 md:py-24 bg-cover bg-center relative"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1567359781514-3b964e2b04d6?q=80&w=2934&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
        >
            <div className="absolute inset-0 bg-black opacity-60"></div> {/* Overlay for text readability, slightly increased opacity */}
            <div className="container mx-auto px-4 relative z-10 text-center">
                <h2 
                    className="text-3xl md:text-4xl font-bold mb-4 text-white"
                    style={{ fontFamily: 'var(--font-heading)' }}
                >
                    Join The Conversation
                </h2>
                <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
                    Stay updated with the latest stories, insights, and musings from The Digital Quill. No spam, just quality content.
                </p>
                <form onSubmit={handleSubscriptionAttempt} className="flex flex-col sm:flex-row justify-center items-center max-w-md mx-auto gap-3">
                    <input 
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        className="w-full sm:flex-1 px-4 py-3 rounded-md 
                                   bg-white/10 backdrop-blur-sm border border-white/30
                                   text-white placeholder:text-gray-200
                                   focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] focus:bg-white/20
                                   outline-none transition-all duration-300"
                    />
                    <button 
                        type="submit"
                        className="w-full sm:w-auto bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-[var(--button-text-primary)] px-6 py-3 rounded-md font-semibold transition-colors cursor-pointer whitespace-nowrap"
                    >
                        Subscribe Now
                    </button>
                </form>
                {notification && (
                    <div className={`mt-4 max-w-md mx-auto px-4 py-2 rounded-md text-sm font-medium transition-opacity duration-300 ease-in-out
                                   ${notification.includes("Please enter") ? "bg-red-500/90 text-white" : "bg-green-500/90 text-white"}`}>
                        {notification}
                    </div>
                )}
            </div>
        </section>
    );
};

const Footer = () => {
    const footerLinks = {
        Explore: [
            { name: "Latest Stories", href: "#" },
            { name: "About Me", href: "#about-me" },
            { name: "My Musings", href: "#musings" },
        ],
        Connect: [
            { name: "Get In Touch", href: "#contact" },
            { name: "Newsletter", href: "#newsletter-signup" },
            { name: "RSS Feed", href: "#rss" },
        ],
    };
    const socialMediaForFooter = [
        { Icon: Facebook, href: "https://facebook.com", name: "Facebook" },
        { Icon: Instagram, href: "https://instagram.com", name: "Instagram" },
        { Icon: Twitter, href: "https://twitter.com", name: "Twitter" },
        { Icon: Linkedin, href: "https://linkedin.com", name: "LinkedIn" },
        { Icon: Youtube, href: "https://youtube.com", name: "YouTube" },
    ];

    return (
        <footer className="bg-[var(--footer-bg)] text-[var(--footer-text)] py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <Feather size={24} className="text-[var(--accent-primary)]" />
                            <span className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
                                The Digital Quill
                            </span>
                        </div>
                        <p className="text-sm mb-6 max-w-md">
                            The Digital Quill is a personal space for long-form storytelling, exploring creative insights, and sharing
                            multimedia narratives. Dive into a world of words, images, and sounds.
                        </p>
                        <div className="flex space-x-4">
                            {socialMediaForFooter.map(({ Icon, href, name }, index) => (
                                <a
                                    key={name + index}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[var(--footer-text)] hover:text-[var(--footer-link-hover)] transition-colors cursor-pointer"
                                    aria-label={`Follow on ${name}`}
                                >
                                    <Icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h5 className="font-bold text-white mb-3 uppercase tracking-wider text-sm">{title}</h5>
                            <ul className="space-y-2">
                                {links.map((link) => (
                                    <li key={link.name}>
                                        <a
                                            href={link.href}
                                            className="hover:text-[var(--footer-link-hover)] transition-colors text-sm cursor-pointer"
                                        >
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="border-t border-[var(--border-color-primary)] pt-8 text-center text-xs">
                    <p>&copy; {new Date().getFullYear()} The Digital Quill. | All Rights Reserved</p>
                </div>
            </div>
        </footer>
    );
};

const slugify = (text: string): string => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-");
};

const TableOfContents = ({ content, activeTocId }: { content: ContentSection[]; activeTocId: string | null }) => {
    const headings = content.filter((section) => section.type === "heading") as HeadingSection[];

    if (headings.length === 0) {
        return null;
    }

    return (
        <div className="py-6 pr-4"> {/* Removed sticky top-24 here */}
            <h3 className="text-lg font-semibold mb-3 text-[var(--page-text-primary)] uppercase tracking-wider">On this page</h3>
            <ul className="space-y-2">
                {headings.map((heading) => {
                    const slug = slugify(heading.text);
                    const isActive = activeTocId === slug;
                    return (
                        <li key={heading.id}>
                            <a
                                href={`#${slug}`}
                                className={`block text-sm transition-colors 
                                            ${isActive ? 'text-[var(--accent-primary)] font-semibold' : 'text-[var(--page-text-secondary)] hover:text-[var(--accent-primary)]'}
                                            ${heading.level === 2 ? '' : 'ml-4 opacity-90'}`}
                            >
                                {heading.text}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

const BlogPostDetailPage = ({ post, onGoBack }: { post: BlogData; onGoBack: () => void }) => {
    const [activeTocId, setActiveTocId] = useState<string | null>(null);
    const heroImageRef = useRef<HTMLDivElement>(null);
    const [isHeroImageScrolledPast, setIsHeroImageScrolledPast] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            let currentActiveId: string | null = null;
            const headingsInContent = post.fullContent.filter(s => s.type === 'heading') as HeadingSection[];
            const headerOffset = 150; // Approximate height of sticky header + some margin

            for (const section of headingsInContent) {
                const slug = slugify(section.text);
                const element = document.getElementById(slug);
                if (element) {
                    const elementTop = element.getBoundingClientRect().top + window.scrollY;
                    if (window.scrollY + headerOffset >= elementTop) {
                        currentActiveId = slug;
                    } else {
                        if (currentActiveId !== null) break;
                    }
                }
            }
            setActiveTocId(currentActiveId);
        };

        window.addEventListener('scroll', handleScroll, {passive: true});
        handleScroll(); // Call on mount to set initial state

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [post.fullContent]);

    useEffect(() => {
        if (!post.heroImageUrl) return; // Only run if there's a hero image

        const observer = new IntersectionObserver(
            ([entry]) => {
                // Trigger when the element is no longer visible and has scrolled above the viewport
                if (!entry.isIntersecting && entry.boundingClientRect.bottom < 0) {
                    setIsHeroImageScrolledPast(true);
                    if (heroImageRef.current) {
                        observer.unobserve(heroImageRef.current); // Stop observing once triggered
                    }
                }
            },
            {
                root: null, // relative to document viewport 
                threshold: 0, // visible amount of item shown in relation to root
                rootMargin: "0px", // no margin
            }
        );

        if (heroImageRef.current) {
            observer.observe(heroImageRef.current);
        }

        return () => {
            if (heroImageRef.current) {
                observer.unobserve(heroImageRef.current);
            }
        };
    }, [post.heroImageUrl]); // Dependency: only re-run if the hero image URL changes

    return (
        <div className="container mx-auto px-4 py-8">
            <button
                onClick={onGoBack}
                className="mb-8 bg-transparent hover:bg-[var(--border-color-primary)] text-[var(--page-text-secondary)] border border-[var(--border-color-primary)] px-4 py-2 rounded-md font-medium transition-colors cursor-pointer text-sm"
            >
                &larr; Back to Blog List
            </button>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                <aside className="w-full lg:w-1/4 lg:order-first order-last mt-8 lg:mt-0">
                    <div className="sticky top-24"> {/* New sticky wrapper */}
                        <TableOfContents content={post.fullContent} activeTocId={activeTocId} />
                        {isHeroImageScrolledPast && (post.heroImageUrl || post.imageUrl) && (
                            <div className="mt-6 pt-1">
                                <img
                                    src={post.heroImageUrl || post.imageUrl}
                                    alt={`${post.title} hero image scrolled copy`}
                                    className="w-full h-auto rounded-lg shadow-md object-cover max-h-60 md:max-h-72"
                                />
                            </div>
                        )}
                    </div>
                </aside>

                <main
                    className="w-full lg:w-3/4 prose prose-sm sm:prose lg:prose-lg xl:prose-xl 
                       prose-headings:font-[var(--font-heading)] prose-headings:text-[var(--page-text-primary)] 
                       prose-p:text-[var(--page-text-secondary)] prose-p:font-[var(--font-body)]
                       prose-a:text-[var(--accent-primary)] hover:prose-a:text-[var(--accent-primary-hover)]
                       prose-img:rounded-lg prose-img:shadow-md
                       prose-code:bg-gray-100 prose-code:dark:bg-gray-800 prose-code:p-1 prose-code:rounded prose-code:text-sm 
                       prose-pre:bg-gray-100 prose-pre:dark:bg-gray-800 prose-pre:p-4 prose-pre:rounded-md prose-pre:overflow-x-auto
                       max-w-none"
                >
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 !text-[var(--page-text-primary)]">{post.title}</h1>
                    <p className="text-sm text-[var(--page-text-secondary)] mb-2">
                        Published on {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                        in <span className="font-semibold text-[var(--accent-primary)]">{post.category}</span>
                    </p>

                    {post.heroImageUrl && (
                        <div ref={heroImageRef}> {/* Wrapper for observer target */}
                            <ParallaxImage 
                                src={post.heroImageUrl}
                                alt={post.title}
                                containerClassName="w-full h-64 md:h-96 mb-8 rounded-xl shadow-lg"
                                imageClassName="rounded-xl"
                                strength={0.15}
                            />
                        </div>
                    )}

                    {post.fullContent.map((section) => {
                        const sectionKey = section.id;
                        switch (section.type) {
                            case "heading":
                                const HeadingTag = `h${section.level}` as keyof React.JSX.IntrinsicElements;
                                return (
                                    <HeadingTag key={sectionKey} id={slugify(section.text)} className="!mt-8 !mb-3 scroll-mt-24">
                                        {section.text}
                                    </HeadingTag>
                                );
                            case "paragraph":
                                return (
                                    <p key={sectionKey} className="mb-4 leading-relaxed">
                                        {section.text}
                                    </p>
                                );
                            case "image":
                                return <ScrollAnimatedMedia key={sectionKey} type="image" src={section.src} alt={section.alt} />;
                            case "video":
                                return <ScrollAnimatedMedia key={sectionKey} type="video" src={section.src} alt={section.alt} />;
                            case "code":
                                return (
                                    <pre
                                        key={sectionKey}
                                        className={`language-${section.language} !bg-[var(--card-bg)] !text-[var(--page-text-primary)] border border-[var(--border-color-primary)]`}
                                    >
                                        <code>{section.code}</code>
                                    </pre>
                                );
                            default:
                                const _exhaustiveCheck: never = section;
                                return null;
                        }
                    })}
                </main>
            </div>
        </div>
    );
};

const InteractiveStatsDashboard = ({ blogPosts }: { blogPosts: BlogData[] }) => {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    const [chartTextColor, setChartTextColor] = useState('#000000');
    const [chartGridColor, setChartGridColor] = useState('#CCCCCC');
    const [chartAccentColor, setChartAccentColor] = useState('#F97316');
    const [pieSegmentColors, setPieSegmentColors] = useState<string[]>([]);
    const [tooltipBg, setTooltipBg] = useState('#FFFFFF');
    const [tooltipText, setTooltipText] = useState('#000000');

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && typeof window !== 'undefined') {
            const rootStyle = getComputedStyle(document.documentElement);
            setChartTextColor(rootStyle.getPropertyValue('--chart-text-color').trim());
            setChartGridColor(rootStyle.getPropertyValue('--chart-grid-color').trim());
            setChartAccentColor(rootStyle.getPropertyValue('--accent-primary').trim());
            setTooltipBg(rootStyle.getPropertyValue('--chart-tooltip-bg').trim());
            setTooltipText(rootStyle.getPropertyValue('--chart-tooltip-text').trim());

            const colors = [
                rootStyle.getPropertyValue('--chart-color-1').trim(),
                rootStyle.getPropertyValue('--chart-color-2').trim(),
                rootStyle.getPropertyValue('--chart-color-3').trim(),
                rootStyle.getPropertyValue('--chart-color-4').trim(),
                rootStyle.getPropertyValue('--chart-color-5').trim(),
            ];
            setPieSegmentColors(colors);
        }
    }, [mounted, theme]); // Re-fetch colors if theme changes (useTheme causes re-render)

    const monthlyViewsData = [
        { month: "Jan", views: 1250 },
        { month: "Feb", views: 2180 },
        { month: "Mar", views: 1550 },
        { month: "Apr", views: 2830 },
        { month: "May", views: 2290 },
        { month: "Jun", views: 3100 },
    ];

    const categoryCounts = blogPosts.reduce((acc, post) => {
        acc[post.category] = (acc[post.category] || 0) + 1;
        return acc;
    }, {} as { [key: string]: number });

    const categoryDistributionData = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));

    if (!mounted) {
        return <div className="h-96"></div>; // Placeholder for SSR or while mounting to avoid layout shifts
    }

    interface CustomTooltipProps {
        active?: boolean;
        payload?: Array<{
            name: string;
            value: number | string;
            color?: string; 
            payload?: any; // The original data object for this point (can be complex)
            dataKey?: string;
            unit?: string;
        }>;
        label?: string | number;
    }

    const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
        if (active && payload && payload.length) {
            return (
                <div className="p-3 rounded-md shadow-lg" style={{ backgroundColor: tooltipBg, color: tooltipText, border: `1px solid ${chartGridColor}` }}>
                    <p className="label font-semibold">{`${label}`}</p>
                    {payload.map((entry, index: number) => (
                        <p key={`item-${index}`} style={{ color: entry.color || (entry.payload && entry.payload.fill) || chartTextColor }}>{`${entry.name}: ${entry.value}`}</p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <section className="container mx-auto px-4 py-12 md:py-16 bg-[var(--page-bg)]">
            <h2 
                className="text-3xl md:text-4xl font-bold mb-10 text-center text-[var(--page-text-primary)]"
                style={{ fontFamily: 'var(--font-heading)' }}
            >
                Blog Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
                <div className="p-6 rounded-lg shadow-lg bg-[var(--chart-bg-color)] border border-[var(--chart-border-color)]">
                    <h3 className="text-xl font-semibold mb-6 text-center text-[var(--chart-text-color)]">Monthly Views</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={monthlyViewsData} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                            <XAxis dataKey="month" tick={{ fill: chartTextColor, fontSize: 12 }} stroke={chartGridColor} />
                            <YAxis tick={{ fill: chartTextColor, fontSize: 12 }} stroke={chartGridColor} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                            <Legend wrapperStyle={{ color: chartTextColor, paddingTop: '10px' }} />
                            <Bar dataKey="views" fill={chartAccentColor} name="Total Views" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="p-6 rounded-lg shadow-lg bg-[var(--chart-bg-color)] border border-[var(--chart-border-color)]">
                    <h3 className="text-xl font-semibold mb-6 text-center text-[var(--chart-text-color)]">Post Category Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={categoryDistributionData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                // label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                outerRadius={100}
                                dataKey="value"
                                nameKey="name"
                            >
                                {categoryDistributionData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={pieSegmentColors[index % pieSegmentColors.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ color: chartTextColor, paddingTop: '10px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </section>
    );
};

const AboutPageContent = () => (
    <div className="container mx-auto px-4 py-16 text-center min-h-[calc(100vh-280px)] flex flex-col justify-center items-center"> {/* Adjusted min-height */}
        <Feather size={64} className="text-[var(--accent-primary)] mb-6" />
        <h1 
            className="text-4xl md:text-5xl font-bold mb-8 text-[var(--page-text-primary)]"
            style={{ fontFamily: 'var(--font-heading)' }}
        >
            About The Digital Quill
        </h1>
        <div className="prose prose-lg dark:prose-invert max-w-3xl mx-auto text-[var(--page-text-secondary)]">
            <p>
                Welcome to <strong>The Digital Quill</strong>, a personal journey into the realms of web development, UX design, branding, and the ever-evolving digital landscape. 
                This platform serves as a canvas for sharing insights, tutorials, and musings, all crafted with a passion for technology and a love for storytelling.
            </p>
            <p>
                Our articles aim to be both informative and inspiring, whether you're a seasoned professional or just starting out. We believe in the power of well-crafted content and beautiful design to create engaging online experiences.
            </p>
            <p>
                This blog itself is a testament to modern web technologies, built with Next.js, React, TypeScript, and styled with Tailwind CSS, all bundled into a single, theme-aware `page.tsx` file. 
                It's a living project, constantly refined to showcase best practices and explore new possibilities.
            </p>
            <p>
                Thank you for visiting. We hope you find something that sparks your curiosity or helps you on your own creative or technical path.
            </p>
        </div>
    </div>
);

const initialBlogPosts: BlogData[] = [
    {
        id: "ux-design-art-science",
        title: "The Art & Science of UX Design",
        category: "UX DESIGN",
        date: "2024-07-15",
        summary: "Crafting intuitive and engaging user experiences that solve real problems and delight users.",
        imageUrl: "https://images.unsplash.com/photo-1630852722128-db210d1b62a7?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        heroImageUrl: "https://images.unsplash.com/photo-1630852722128-db210d1b62a7?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        fullContent: [
            { id: "s1h1", type: "heading", level: 2, text: "Understanding User Needs" },
            { id: "s1p1", type: "paragraph", text: "The foundational step in UX design is deeply understanding the target audience, their pain points, and their goals. This involves research methods like user interviews, surveys, and persona creation." },
            { id: "s1h2", type: "heading", level: 3, text: "Key Research Methods" },
            { id: "s1p2", type: "paragraph", text: "Interviews provide qualitative insights, while surveys can gather quantitative data. Personas help humanize the user for the design team. Empathy maps are another valuable tool to visualize user attitudes and behaviors." },
            { id: "s1p3", type: "paragraph", text: "Competitive analysis is also crucial to understand existing solutions and identify opportunities for differentiation." },
            { id: "s1img1", type: "image", src: "https://images.unsplash.com/photo-1666816943145-bac390ca866c?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "UX research concept with sticky notes"},
            { id: "s1h3", type: "heading", level: 3, text: "Information Architecture" },
            { id: "s1p4", type: "paragraph", text: "Organizing and structuring content in an effective and understandable way is key. This involves creating site maps, user flows, and navigation systems that allow users to easily find what they are looking for." },
            { id: "s2h1", type: "heading", level: 2, text: "Prototyping and Testing" },
            { id: "s2p1", type: "paragraph", text: "Iterative prototyping, from low-fidelity wireframes to high-fidelity interactive mockups, allows for early feedback. Usability testing then helps identify and fix issues before development." },
            { id: "s2p2", type: "paragraph", text: "A/B testing can be employed to compare different design variations and determine which performs better based on specific metrics. Heuristic evaluation is another method where experts review the interface against established usability principles." },
            { id: "s2h2", type: "heading", level: 2, text: "Visual Design and Interaction" },
            { id: "s2p3", type: "paragraph", text: "Beyond usability, the aesthetic appeal and micro-interactions play a significant role in user engagement. Consistent branding, clear visual hierarchy, and delightful animations contribute to a positive user experience." },
            { id: "s3h1", type: "heading", level: 2, text: "Accessibility in UX" },
            { id: "s3p1", type: "paragraph", text: "Designing for inclusivity ensures that people with disabilities can access and use your product. This includes considering color contrast, keyboard navigation, screen reader compatibility, and providing alternative text for images." }
        ],
    },
    {
        id: "branding-memorable-identity",
        title: "Building a Memorable Brand Identity",
        category: "BRANDING",
        date: "2024-07-14",
        summary: "Explore the strategies behind creating a strong brand that resonates with your audience and stands out.",
        imageUrl: "https://images.unsplash.com/photo-1645658043538-fc2bb1702cfe?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        heroImageUrl: "https://images.unsplash.com/photo-1645658043538-fc2bb1702cfe?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        fullContent: [
            { id: "b1h1", type: "heading", level: 2, text: "What is Brand Identity?" },
            { id: "b1p1", type: "paragraph", text: "It is how a business presents itself to and wants to be perceived by its consumers. It encompasses visual elements, messaging, and overall experience. A strong brand identity differentiates you from competitors and builds trust and loyalty." },
            { id: "b1p2", type: "paragraph", text: "Think of it as the brand's personality. Is it playful and energetic, or sophisticated and reliable? This personality should be consistently reflected in every touchpoint." },
            { id: "b2h1", type: "heading", level: 2, text: "Core Components" },
            { id: "b2p1", type: "paragraph", text: "Logo, color palette, typography, tone of voice, and imagery are crucial components that make a brand unique and recognizable. These elements should work harmoniously to tell a cohesive brand story." },
            { id: "b2h2", type: "heading", level: 3, text: "The Power of a Great Logo" },
            { id: "b2p2", type: "paragraph", text: "A logo is often the first visual element people associate with a brand. It should be simple, memorable, versatile, and relevant to the brand's essence. Consider iconic logos like Nike's swoosh or Apple's bitten apple – they are instantly recognizable and embody their respective brands." },
            { id: "b2code1", type: "code", language: "css", code: `.brand-colors {\n  primary: #F97316; /* Orange - energetic, friendly */\n  secondary: #111827; /* Dark Gray - sophisticated, stable */\n  accent: #4ADE80; /* Green - growth, freshness */\n}` },
            { id: "b3h1", type: "heading", level: 2, text: "Brand Messaging and Tone of Voice" },
            { id: "b3p1", type: "paragraph", text: "How your brand communicates is just as important as how it looks. The tone of voice should align with the brand's personality and resonate with the target audience. Is it formal, conversational, witty, or inspirational?" },
            { id: "b3p2", type: "paragraph", text: "Your brand promise, values, and mission statement form the core of your messaging. These should be clearly articulated and consistently reinforced across all communication channels." },
            { id: "b4h1", type: "heading", level: 2, text: "Consistency is Key" },
            { id: "b4p1", type: "paragraph", text: "Maintaining consistency across all platforms and touchpoints is vital for building a strong brand identity. This creates a unified experience for the customer and reinforces brand recognition. Brand guidelines are essential for ensuring this consistency." }
        ],
    },
    {
        id: "web-dev-modern-insights",
        title: "Modern Web Development Insights",
        category: "WEB DEVELOPMENT",
        date: "2024-07-16", 
        summary: "Exploring the latest in JavaScript frameworks, serverless architectures, and the push towards a more performant and accessible web.",
        imageUrl: "https://images.unsplash.com/photo-1596306495945-47201feaff88?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        heroImageUrl: "https://images.unsplash.com/photo-1618422168439-4b03d3a05b15?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        fullContent: [
            { id: "wd1h1", type: "heading", level: 2, text: "The JavaScript Ecosystem" },
            { id: "wd1p1", type: "paragraph", text: "Frameworks like React, Vue, and Angular continue to dominate, but Svelte and SolidJS are gaining traction with their innovative approaches to reactivity and performance. The rise of meta-frameworks like Next.js (for React) and Nuxt.js (for Vue) has further simplified full-stack development." },
            { id: "wd1p2", type: "paragraph", text: "TypeScript's adoption continues to grow, bringing static typing to JavaScript, which helps in building more robust and maintainable large-scale applications. Build tools like Vite are also changing the landscape with incredibly fast development servers and optimized builds." },
            { id: "wd1code1", type: "code", language: "javascript", code: `// Example of a simple React component with TypeScript\ninterface GreetingProps {\n  name: string;\n}\n\nconst Greeting: React.FC<GreetingProps> = ({ name }) => {\n  return <h1>Hello, {name}!</h1>;\n};` },
            { id: "wd2h1", type: "heading", level: 2, text: "Serverless and Edge Computing" },
            { id: "wd2p1", type: "paragraph", text: "Moving logic to serverless functions and the edge can significantly improve scalability, reduce latency for global applications, and lower operational costs. Developers can focus more on code and less on infrastructure management." },
            { id: "wd2h2", type: "heading", level: 3, text: "Popular Serverless Providers" },
            { id: "wd2p2", type: "paragraph", text: "AWS Lambda, Google Cloud Functions, and Azure Functions are key players. Vercel and Netlify also offer seamless serverless deployments for frontend frameworks, often integrating tightly with Git workflows for continuous deployment." },
            { id: "wd2p3", type: "paragraph", text: "Edge functions, running closer to the user, are perfect for tasks like A/B testing, personalization, and API routing, offering even lower latency than traditional serverless functions." },
            { id: "wd3h1", type: "heading", level: 2, text: "Web Performance and Core Web Vitals" },
            { id: "wd3p1", type: "paragraph", text: "Performance is no longer an afterthought. Google's Core Web Vitals (LCP, FID, CLS) are crucial metrics for user experience and SEO. Optimizing images, leveraging browser caching, code splitting, and lazy loading are essential techniques." },
            { id: "wd3img1", type: "image", src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Performance dashboard with charts"},
            { id: "wd4h1", type: "heading", level: 2, text: "The Future: WebAssembly, AI, and VR/AR" },
            { id: "wd4p1", type: "paragraph", text: "WebAssembly (Wasm) is enabling near-native performance for web applications, opening doors for complex tasks like video editing and gaming in the browser. AI and Machine Learning are being integrated more deeply into web experiences, from chatbots to personalized content. Furthermore, the groundwork for immersive web experiences with VR and AR technologies is constantly evolving." }
        ],
    },
    {
        id: "design-systems-cohesive-power",
        title: "The Power of Cohesive Design Systems",
        category: "DESIGN SYSTEM",
        date: "2024-07-12",
        summary: "Learn how design systems drive consistency, efficiency, and scalability in product development cycles.",
        imageUrl: "https://images.unsplash.com/photo-1586936893354-362ad6ae47ba?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        heroImageUrl: "https://images.unsplash.com/photo-1586936893354-362ad6ae47ba?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        fullContent: [
            { id: "ds1h1", type: "heading", level: 2, text: "What is a Design System?" },
            { id: "ds1p1", type: "paragraph", text: "A design system is a comprehensive collection of reusable components, clear standards, and guidelines that product teams use to create consistent user experiences across different products and platforms. It's a single source of truth for design and development." },
            { id: "ds1p2", type: "paragraph", text: "Think of it as a living library that evolves with the product and brand. It includes UI components (buttons, forms, cards), design tokens (colors, typography, spacing), accessibility guidelines, and even voice and tone principles." },
            { id: "ds2h1", type: "heading", level: 2, text: "Benefits of a Design System" },
            { id: "ds2p1", type: "paragraph", text: "Consistency across products is a major advantage, leading to a more predictable and user-friendly experience. It significantly improves efficiency, allowing teams to build faster by reusing existing components instead of reinventing the wheel." },
            { id: "ds2p2", type: "paragraph", text: "Design systems foster better collaboration between designers and developers, as they share a common language and toolkit. This also helps in scaling design efforts as teams grow and products expand." },
            { id: "ds2img1", type: "image", src: "https://images.unsplash.com/photo-1611140807610-4997bdd39d94?q=80&w=3260&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "UI components from a design system"},
            { id: "ds3h1", type: "heading", level: 2, text: "Building a Design System" },
            { id: "ds3p1", type: "paragraph", text: "Creating a design system is an iterative process. It usually starts with an inventory of existing UI elements, followed by defining core principles, establishing design tokens, and then building and documenting components." },
            { id: "ds3h2", type: "heading", level: 3, text: "Key Stages" },
            { id: "ds3p2", type: "paragraph", text: "1. **Audit & Strategy:** Understand current state and define goals.\n2. **Foundation:** Establish design tokens (colors, typography, spacing).\n3. **Components:** Design and build reusable UI elements.\n4. **Documentation:** Create clear guidelines on how to use the system.\n5. **Governance & Maintenance:** Plan for updates and contributions." },
            { id: "ds4h1", type: "heading", level: 2, text: "Tools and Technologies" },
            { id: "ds4p1", type: "paragraph", text: "Tools like Figma, Sketch, and Adobe XD are popular for designing components. Storybook and Zeroheight are often used for documenting and showcasing design systems. On the development side, components are typically built using frameworks like React, Vue, or Angular, and packaged for easy consumption." }
        ],
    },
    {
        id: "digital-marketing-landscape",
        title: "Navigating the Digital Marketing Landscape",
        category: "MARKETING",
        date: "2024-07-10",
        summary: "Strategies and insights for effective digital marketing in today\'s ever-evolving online ecosystem.",
        imageUrl: "https://images.unsplash.com/photo-1498708265414-b4de18c6aeef?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        heroImageUrl: "https://images.unsplash.com/photo-1498708265414-b4de18c6aeef?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        fullContent: [
            { id: "m1h1", type: "heading", level: 2, text: "Key Pillars of Digital Marketing" },
            { id: "m1p1", type: "paragraph", text: "SEO (Search Engine Optimization), Content Marketing, Social Media Marketing, PPC (Pay-Per-Click) Advertising, and Email Marketing are fundamental areas to master. Each plays a distinct role in a comprehensive digital strategy." },
            { id: "m1p2", type: "paragraph", text: "Affiliate marketing and influencer marketing have also become significant channels for reaching specific audiences and driving conversions." },
            { id: "m2h1", type: "heading", level: 2, text: "Search Engine Optimization (SEO)" },
            { id: "m2p1", type: "paragraph", text: "SEO is the practice of optimizing your website and content to rank higher in search engine results pages (SERPs). This involves on-page SEO (keywords, meta tags, content quality), off-page SEO (backlinks, domain authority), and technical SEO (site speed, mobile-friendliness, crawlability)." },
            { id: "m2p2", type: "paragraph", text: "Effective keyword research is the cornerstone of SEO, helping you understand what terms your target audience is searching for." },
            { id: "m3h1", type: "heading", level: 2, text: "Content Marketing" },
            { id: "m3p1", type: "paragraph", text: "Content marketing focuses on creating and distributing valuable, relevant, and consistent content to attract and retain a clearly defined audience — and, ultimately, to drive profitable customer action. This can include blog posts, videos, infographics, podcasts, and ebooks." },
            { id: "m3code1", type: "code", language: "text", code: `Content Funnel Stages:\n1. Awareness (e.g., blog posts, social media updates)\n2. Consideration (e.g., webinars, case studies)\n3. Decision (e.g., free trials, demos, consultations)` },
            { id: "m4h1", type: "heading", level: 2, text: "Social Media Marketing (SMM)" },
            { id: "m4p1", type: "paragraph", text: "SMM involves using social media platforms like Facebook, Instagram, Twitter, LinkedIn, and TikTok to build brand awareness, engage with customers, and drive website traffic. It requires understanding each platform\'s nuances and audience." },
            { id: "m4img1", type: "image", src: "https://images.unsplash.com/photo-1611162616805-688099315796?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Social media icons"},
            { id: "m5h1", type: "heading", level: 2, text: "Data Analytics and Measurement" },
            { id: "m5p1", type: "paragraph", text: "A crucial aspect of digital marketing is the ability to track, measure, and analyze performance. Tools like Google Analytics provide insights into website traffic, user behavior, and conversion rates, allowing marketers to optimize their campaigns for better results." }
        ],
    },
];

export default function CreatorPlatformPage() {
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [blogPosts, setBlogPosts] = useState<BlogData[]>([]);
    const [currentPage, setCurrentPage] = useState<'home' | 'statistics' | 'about'>('home');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 500));
                setBlogPosts(initialBlogPosts); // Using local data for now
                setIsLoading(false);
            } catch (e) {
                if (e instanceof Error) {
                    setError(e.message);
                } else {
                    setError("An unknown error occurred");
                }
                setIsLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const handleToggleFilter = (filterName: string) => {
        setSelectedPostId(null);
        setCurrentPage('home')
        setActiveFilters((prevFilters) =>
            prevFilters.includes(filterName) ? prevFilters.filter((f) => f !== filterName) : [...prevFilters, filterName]
        );
        window.scrollTo(0,0);
    };

    const handleSelectPost = (postId: string) => {
        setSelectedPostId(postId);
        window.scrollTo(0, 0);
    };

    const handleClearSelectedPost = () => {
        setSelectedPostId(null);
        window.scrollTo(0, 0);
    };
    
    const navigateToPage = (page: 'home' | 'statistics' | 'about') => {
        setSelectedPostId(null); 
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    const handleSubscribeNavigation = () => {
        if (currentPage !== 'home' || selectedPostId !== null) {
            navigateToPage('home');
            setTimeout(() => {
                document.getElementById('newsletter-signup')?.scrollIntoView({ behavior: 'smooth' });
            }, 100); 
        } else {
            document.getElementById('newsletter-signup')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const currentPost = selectedPostId ? blogPosts.find((post) => post.id === selectedPostId) : null;

    const featuredPostDataForMainPageHero = blogPosts.find((p) => p.id === "web-dev-modern-insights") || (blogPosts.length > 0 ? blogPosts[0] : null as BlogData | null );
    const mainPageHeroTitle = "Deep Dive: Modern Web Development Frontiers";

    const audioSrc = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

    if (isLoading) {
        return (
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
                <GlobalThemeStyles />
                <div className="min-h-screen flex flex-col">
                    <header className="sticky top-0 z-50 bg-[var(--navbar-bg)] border-b border-[var(--border-color-primary)]">
                        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <Feather size={28} className="text-[var(--accent-primary)]" />
                                <span className="text-2xl font-bold text-[var(--navbar-text)]" style={{ fontFamily: "var(--font-heading)" }}>
                                    The Digital Quill
                                </span>
                            </div>
                            <ThemeToggleButton />
                        </div>
                    </header>
                    <div className="flex-grow flex items-center justify-center text-[var(--page-text-secondary)]">
                        Loading amazing content...
                    </div>
                    <Footer />
                </div>
            </ThemeProvider>
        );
    }

    if (error) {
        return (
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
                <GlobalThemeStyles />
                 <div className="min-h-screen flex flex-col">
                    <Header 
                        onSubscribeClick={handleSubscribeNavigation} 
                        onNavigate={navigateToPage} 
                        currentPage={currentPage}
                    />
                    <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
                        <h2 className="text-2xl font-semibold text-red-500 mb-4">Oops! Something went wrong.</h2>
                        <p className="text-[var(--page-text-secondary)] mb-2">{error}</p>
                        <p className="text-[var(--page-text-secondary)]">Please try refreshing the page or contact support if the issue persists.</p>
                    </div>
                    <Footer />
                </div>
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <GlobalThemeStyles />
            <div className={`min-h-screen flex flex-col`}>
                <Header 
                    onSubscribeClick={handleSubscribeNavigation} 
                    onNavigate={navigateToPage} 
                    currentPage={currentPage}
                />
                <div className="flex-grow relative pt-6 pb-12">
                    {currentPost ? (
                        <BlogPostDetailPage post={currentPost} onGoBack={handleClearSelectedPost} />
                    ) : currentPage === 'statistics' ? (
                        <InteractiveStatsDashboard blogPosts={blogPosts} />
                    ) : currentPage === 'about' ? (
                        <AboutPageContent />
                    ) : (
                        <>
                            {featuredPostDataForMainPageHero ? (
                                <MainContent
                                    allBlogPosts={blogPosts}
                                    activeFilters={activeFilters}
                                    onToggleFilter={handleToggleFilter}
                                    onSelectPost={handleSelectPost}
                                    featuredPostTitleForHero={mainPageHeroTitle}
                                    featuredPostForHero={featuredPostDataForMainPageHero}
                                />
                            ) : (
                                <div className="text-center py-10 text-[var(--page-text-secondary)]">No featured content available.</div>
                            )}
                            <NewsletterSection />
                        </>
                    )}
                </div>
                <Footer />
                {currentPage !== 'statistics' && <AudioPlayer src={audioSrc} />}
            </div>
        </ThemeProvider>
    );
}
