"use client";

import React, { useState, useEffect } from "react";
import { ThemeProvider, useTheme } from "next-themes";
import {
    ChevronDown,
    Linkedin,
    Instagram,
    Facebook,
    Globe,
    ArrowDown,
    Moon,
    Sun,
    Circle,
    Layers,
    Zap,
    CircleDot,
    GalleryHorizontalEnd,
    Target,
    Play,
    UserCircle,
    ArrowUpRight,
    ArrowUp,
    ArrowRight,
    CreditCard,
    Wifi,
} from "lucide-react";
import { motion, useMotionValue, useTransform } from "framer-motion";

const GlobalThemeStyles = () => {
    return (
        <style jsx global>{`
            @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@700;900&family=Roboto:wght@400;700&display=swap");

            :root {
                --font-heading: "Montserrat", sans-serif;
                --font-body: "Roboto", sans-serif;

                --page-bg: #f0f2f5;
                --page-text-primary: #1a202c;
                --page-text-secondary: #4a5568;
                --header-text: #2d3748;
                --nav-link-hover-bg: #edf2f7;
                --button-bg: #3182ce;
                --button-text: #ffffff;
                --button-hover-bg: #2b6cb0;
                --card-bg-dark-translucent: rgba(50, 50, 70, 0.8);
                --card-bg-blue: #4299e1;
                --card-bg-purple: #9f7aea;
                --card-text: #ffffff;
                --icon-color: #4a5568;
                --icon-hover-color: #2b6cb0;
                --border-color: #e2e8f0;
                --accent-color: #3182ce;

                --glass-bg-light: rgba(255, 255, 255, 0.25);
                --glass-border-light: rgba(255, 255, 255, 0.4);
                --glass-bg: var(--glass-bg-light);
                --glass-border: var(--glass-border-light);

                --bar-segment-inactive: #d1d5db;

                --bank-card-bg: #e0e0e0;
                --bank-card-text-primary: #1a202c;
                --bank-card-text-secondary: #4a5568;
                --bank-card-border: #c0c0c0;
                --bank-card-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
                --bank-card-logo-color: #2d3748;

                --feature-card-bg: #ffffff;
                --feature-card-text-primary: var(--page-text-primary);
                --feature-card-text-secondary: var(--page-text-secondary);
                --explore-button-bg: var(--accent-color);
                --explore-button-text: #ffffff;
                --explore-button-hover-bg: #2b6cb0;

                --scrollbar-thumb: #cbd5e0;
                --scrollbar-track: #edf2f7;

                --details-button-bg: #2563eb;
                --details-button-text: #ffffff;
                --details-button-hover-bg: #1d4ed8;
                --video-placeholder-bg: #e5e7eb;
                --video-border-color: rgba(107, 114, 128, 0.3);
                --video-border-glow: rgba(107, 114, 128, 0.4);

                --testimonial-card-bg: #ffffff;
                --testimonial-card-text-primary: var(--page-text-primary);
                --testimonial-card-text-secondary: var(--page-text-secondary);
                --testimonial-card-top-glow: var(--accent-color);

                --footer-bg: var(--page-bg);
                --footer-text-primary: var(--page-text-primary);
                --footer-text-secondary: var(--page-text-secondary);
                --footer-link-hover-color: var(--accent-color);
                --footer-separator-color: #4b5563;
                --footer-cta-bg: #1e293b;
                --footer-cta-text: #e2e8f0;
                --footer-cta-highlight: rgba(255, 255, 255, 0.1);

                /* Hero Card Specific Colors - Light Theme (though they might be mostly dark as per image) */
                --hero-card-bg-transparent-dark: rgba(56, 60, 74, 0.7); /* A dark, slightly transparent slate */
                --hero-card-bg-blue: #3b82f6; /* Vivid Blue */
                --hero-card-bg-purple: #8b5cf6; /* Vivid Purple */
                --hero-card-text-primary: #ffffff;
                --hero-card-logo-color: #ffffff;
            }

            html.dark {
                --page-bg: #0d1117;
                --page-text-primary: #e2e8f0;
                --page-text-secondary: #a0aec0;
                --header-text: #e2e8f0;
                --nav-link-hover-bg: #2d3748;
                --button-bg: #4a5568;
                --button-text: #e2e8f0;
                --button-hover-bg: #2d3748;
                --card-bg-dark-translucent: rgba(30, 30, 50, 0.6);
                --card-bg-blue: #3182ce;
                --card-bg-purple: #805ad5;
                --card-text: #f7fafc;
                --icon-color: #a0aec0;
                --icon-hover-color: #4299e1;
                --border-color: #2d3748;
                --accent-color: #4299e1;

                --glass-bg-dark: rgba(30, 41, 59, 0.25);
                --glass-border-dark: rgba(255, 255, 255, 0.1);
                --glass-bg: var(--glass-bg-dark);
                --glass-border: var(--glass-border-dark);

                --bar-segment-inactive: #4b5563;

                --bank-card-bg: #2d3748;
                --bank-card-text-primary: #e2e8f0;
                --bank-card-text-secondary: #a0aec0;
                --bank-card-border: #4a5568;
                --bank-card-shadow: 0px 8px 16px rgba(0, 0, 0, 0.3);
                --bank-card-logo-color: #e2e8f0;

                --feature-card-bg: #1e293b;
                --feature-card-text-primary: #f8fafc;
                --feature-card-text-secondary: #94a3b8;
                --explore-button-bg: #f1f5f9;
                --explore-button-text: #0f172a;
                --explore-button-hover-bg: #e2e8f0;

                --scrollbar-thumb: #4a5568;
                --scrollbar-track: #2d3748;

                --details-button-bg: #3b82f6;
                --details-button-text: #ffffff;
                --details-button-hover-bg: #2563eb;
                --video-placeholder-bg: #1f2937;
                --video-border-color: rgba(96, 165, 250, 0.4);
                --video-border-glow: rgba(96, 165, 250, 0.6);

                --testimonial-card-bg: #1e293b;
                --testimonial-card-text-primary: #f8fafc;
                --testimonial-card-text-secondary: #94a3b8;
                --testimonial-card-top-glow: rgba(96, 165, 250, 0.5);

                --footer-bg: var(--page-bg);
                --footer-text-primary: var(--page-text-primary);
                --footer-text-secondary: var(--page-text-secondary);
                --footer-link-hover-color: var(--accent-color);
                --footer-separator-color: #374151;
                --footer-cta-bg: #27354d;
                --footer-cta-text: #e2e8f0;
                --footer-cta-highlight: rgba(255, 255, 255, 0.15);

                /* Hero Card Specific Colors - Dark Theme */
                --hero-card-bg-transparent-dark: rgba(30, 33, 42, 0.75); /* Slightly darker transparency for dark mode */
                --hero-card-bg-blue: #2563eb; /* Slightly deeper Blue for dark */
                --hero-card-bg-purple: #7c3aed; /* Slightly deeper Purple for dark */
                --hero-card-text-primary: #ffffff; /* Text stays white */
                --hero-card-logo-color: #ffffff; /* Logo stays white */
            }

            html {
                overflow-x: hidden;
                scroll-behavior: smooth;
            }
            body {
                background-color: var(--page-bg);
                color: var(--page-text-primary);
                font-family: var(--font-body);
                transition: background-color 0.3s ease, color 0.3s ease;
                overflow-x: hidden;
            }

            h1,
            h2,
            h3,
            h4,
            h5,
            h6 {
                font-family: var(--font-heading);
                color: var(--page-text-primary);
            }

            ::-webkit-scrollbar {
                width: 8px;
            }
            ::-webkit-scrollbar-track {
                background: var(--scrollbar-track);
            }
            ::-webkit-scrollbar-thumb {
                background: var(--scrollbar-thumb);
                border-radius: 4px;
            }
            ::-webkit-scrollbar-thumb:hover {
                background: var(--accent-color);
            }

            @keyframes gentle-pulse {
                0%,
                100% {
                    opacity: 0.35;
                }
                50% {
                    opacity: 0.15;
                }
            }

            .animate-gentle-pulse {
                animation: gentle-pulse 10s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }
        `}</style>
    );
};

const GPNLogo = () => (
    <svg width="32" height="32" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
        <path
            d="M18 4C10.268 4 4 10.268 4 18C4 25.732 10.268 32 18 32C25.732 32 32 25.732 32 18C32 10.268 25.732 4 18 4ZM18 29C11.9249 29 7 24.0751 7 18C7 11.9249 11.9249 7 18 7C24.0751 7 29 11.9249 29 18C29 24.0751 24.0751 29 18 29Z"
            fill="currentColor"
        />

        <path
            d="M18 11C14.134 11 11 14.134 11 18H14C14 15.7909 15.7909 14 18 14C20.2091 14 22 15.7909 22 18C22 20.2091 20.2091 22 18 22V25C21.866 25 25 21.866 25 18C25 14.134 21.866 11 18 11Z"
            fill="currentColor"
            opacity="0.8"
        />

        <circle cx="18" cy="18" r="5.5" fill="currentColor" opacity="0.3" />

        <circle cx="18" cy="18" r="3" fill="var(--page-bg)" />
    </svg>
);

const GPNCreditCardLogo = () => (
    <svg width="48" height="24" viewBox="0 0 70 35" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[var(--hero-card-logo-color)]">
        <path d="M5 20 Q15 5 30 15 Q15 20 5 30 Z" fill="currentColor" opacity="0.9" />
        <path d="M10 18 Q20 8 33 16 Q20 20 10 25 Z" fill="currentColor" opacity="0.7" />
        <text x="38" y="23" fontFamily="Montserrat, sans-serif" fontWeight="bold" fontSize="18" fill="currentColor">GPN</text>
    </svg>
);

interface BankCardProps {
    cardNumber: string;
    cardHolder: string;
    cardColorVariant: 'transparentDark' | 'solidBlue' | 'solidPurple';
}

const BankCard: React.FC<BankCardProps> = ({
    cardNumber,
    cardHolder,
    cardColorVariant,
}) => {
    let bgColorClass = '';
    switch (cardColorVariant) {
        case 'transparentDark':
            bgColorClass = 'bg-[var(--hero-card-bg-transparent-dark)] backdrop-blur-sm';
            break;
        case 'solidBlue':
            bgColorClass = 'bg-[var(--hero-card-bg-blue)]';
            break;
        case 'solidPurple':
            bgColorClass = 'bg-[var(--hero-card-bg-purple)]';
            break;
        default:
            bgColorClass = 'bg-[var(--bank-card-bg)]';
    }

    return (
        <motion.div
            className={`w-80 h-52 rounded-xl p-6 shadow-lg flex flex-col justify-between relative overflow-hidden text-[var(--hero-card-text-primary)] border border-white/10 ${bgColorClass}`}
            style={{
                boxShadow: 'var(--bank-card-shadow)',
                transformStyle: 'preserve-3d',
            }}
            whileHover={{ y: -10, scale: 1.05, transition: { type: "spring", stiffness: 300, damping: 15 } }}
        >
            <div className="flex justify-between items-start">
                <GPNCreditCardLogo />
            </div>

            <div className="text-left space-y-1 mt-auto">
                <p className="text-xl font-mono tracking-wider">
                    {cardNumber.replace(/(\\d{4})/g, '$1 ').trim()}
                </p>
                <p className="text-sm uppercase font-medium opacity-80">{cardHolder}</p>
            </div>
        </motion.div>
    );
};

const Header = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    if (!mounted) return null;

    const navLinks = [
        { name: "Features", href: "#features" },
        { name: "About Us", href: "#about-us" },
        { name: "Testimonials", href: "#testimonials" },
    ];

    return (
        <motion.nav 
            className="p-4 sticky top-0 z-50 transition-colors duration-300 ease-in-out bg-transparent"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <div className="container mx-auto flex items-center justify-between">
                <motion.a 
                    href="#home" 
                    className="flex items-center space-x-2 cursor-pointer" 
                    title="GPN Bank - Home"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                >
                    <GPNLogo />
                </motion.a>

                <motion.div 
                    className="relative hidden md:flex items-center justify-center flex-grow"
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[90px] bg-gradient-to-br from-[#798fe1] to-[#263c8b] opacity-40 dark:opacity-30 rounded-full blur-[75px] -z-10"></div>
                    
                    <div className="flex items-center space-x-1 lg:space-x-2 bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-md rounded-full p-1 shadow-lg">
                        {navLinks.map((item, index) => (
                            <motion.a
                                key={item.name}
                                href={item.href}
                                className="px-3 py-1.5 rounded-full text-sm font-medium text-[var(--page-text-primary)] hover:bg-white/10 dark:hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] transition-all duration-200 cursor-pointer"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.5 + index * 0.1, ease: "easeOut" }}
                            >
                                {item.name}
                            </motion.a>
                        ))}
                    </div>
                </motion.div>

                <motion.div 
                    className="flex items-center space-x-4"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                >
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-md text-[var(--page-text-primary)] hover:bg-opacity-60 dark:hover:bg-opacity-40 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] transition-all duration-200 cursor-pointer"
                    >
                        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </motion.div>
            </div>
        </motion.nav>
    );
};

const HeroSection = () => {
    const motionX = useMotionValue(0);
    const motionY = useMotionValue(0);

    const rotateXSmall = useTransform(motionY, [-400, 400], [12, -12]);
    const rotateYSmall = useTransform(motionX, [-400, 400], [-12, 12]);

    const rotateXMedium = useTransform(motionY, [-400, 400], [18, -18]);
    const rotateYMedium = useTransform(motionX, [-400, 400], [-18, 18]);

    const rotateXLarge = useTransform(motionY, [-400, 400], [25, -25]);
    const rotateYLarge = useTransform(motionX, [-400, 400], [-25, 25]);

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const { clientX, clientY, currentTarget } = event;
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        const x = clientX - left - width / 2;
        const y = clientY - top - height / 2;
        motionX.set(x);
        motionY.set(y);
    };

    const handleMouseLeave = () => {
        motionX.set(0);
        motionY.set(0);
    };

    return (
        <section
            id="home"
            className="relative min-h-screen flex items-center justify-center text-[var(--page-text-primary)]  pt-20 md:pt-0"
        >
            <div className="">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-[var(--accent-color)] opacity-[0.06] dark:opacity-[0.04] rounded-full blur-[120px] animate-gentle-pulse"></div>

                <div className="absolute top-[-10%] left-[-10%] w-2/5 h-2/5 bg-[#383ae6] opacity-[0.08] dark:opacity-[0.06] rounded-full blur-[100px] animate-gentle-pulse delay-200"></div>

                <div className="absolute bottom-[-10%] right-[-10%] w-2/5 h-2/5 bg-[#7133a7] opacity-[0.08] dark:opacity-[0.06] rounded-full blur-[100px] animate-gentle-pulse delay-400"></div>
            </div>

            <div className="max-w-4xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
                <motion.h1 
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 !text-[var(--page-text-primary)] leading-tight pt-8 sm:pt-0"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
                >
                    Banking Made Simple, <br /> Wherever You Are
                </motion.h1>
                <motion.p 
                    className="text-lg md:text-xl text-[var(--page-text-secondary)] mb-10 max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
                >
                    Your personal banking companion designed to simplify your financial life.
                </motion.p>

                <motion.div 
                    className="relative flex justify-center items-center h-72 sm:h-80 md:h-[500px] group"
                    style={{ perspective: '1200px' }}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
                >
                    <motion.div
                        className="absolute"
                        style={{
                            rotateX: rotateXMedium,
                            rotateY: rotateYMedium,
                            x: -60,
                            y: 20,
                            rotateZ: -10,
                            translateZ: -40,
                            transformStyle: 'preserve-3d'
                        }}
                        animate={{
                            y: [20, 15, 20],
                        }}
                        transition={{
                            duration: 3.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.2,
                        }}
                    >
                        <BankCard
                            cardNumber="4455549161186164"
                            cardHolder="ALYSSA PRITHVI"
                            cardColorVariant="solidBlue"
                        />
                    </motion.div>

                    <motion.div
                        className="absolute"
                        style={{
                            rotateX: rotateXSmall,
                            rotateY: rotateYSmall,
                            x: 70,
                            y: 65,
                            rotateZ: 8,
                            translateZ: -80,
                            transformStyle: 'preserve-3d'
                        }}
                        animate={{
                            y: [65, 70, 65],
                        }}
                        transition={{
                            duration: 4.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.4,
                        }}
                    >
                        <BankCard
                            cardNumber="4455549161186164"
                            cardHolder="ALYSSA PRITHVI"
                            cardColorVariant="solidPurple"
                        />
                    </motion.div>

                    <motion.div
                        className="absolute"
                        style={{
                            rotateX: rotateXLarge,
                            rotateY: rotateYLarge,
                            x: 10,
                            y: -10,
                            rotateZ: 5,
                            transformStyle: 'preserve-3d',
                            translateZ: 0
                        }}
                        animate={{
                            y: [-10, -15, -10],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0,
                        }}
                    >
                        <BankCard
                            cardNumber="4455549161186164"
                            cardHolder="ALYSSA PRITHVI"
                            cardColorVariant="transparentDark"
                        />
                    </motion.div>
                </motion.div>

                <motion.div 
                    className="absolute bottom-[-80px] md:bottom-[-40px] left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 animate-bounce"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 1.2, ease: "easeOut" }}
                >
                    <span className="text-sm text-[var(--page-text-secondary)]">Keep Scrolling</span>
                    <ArrowDown size={24} className="text-[var(--page-text-secondary)]" />
                </motion.div>

                <motion.div 
                    className="absolute bottom-6 left-0 md:bottom-8 md:left-0 z-20 text-left hidden md:flex items-center space-x-1 mb-2"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                >
                    <div className="flex items-center space-x-1 mb-2">
                        <span className="block w-12 h-1.5 bg-[var(--bar-segment-inactive)] rounded-sm"></span>
                        <span className="block w-6 h-1.5 bg-[var(--accent-color)] rounded-sm"></span>
                    </div>
                    <p className="text-xs md:text-sm text-[var(--page-text-secondary)] max-w-[200px] md:max-w-[240px]">
                        Your personal banking companion designed to simplify your financial life.
                    </p>
                </motion.div>

                <motion.div 
                    className="absolute bottom-6 right-0 md:bottom-8 md:right-0 z-20 hidden md:flex flex-row items-center space-x-2"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                >
                    <div className="flex flex-row items-center space-x-2">
                        {[Linkedin, Instagram, Facebook, Globe].map((Icon, index) => (
                            <a
                                key={index}
                                href="#"
                                className="p-2 bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-md rounded-lg shadow-md text-[var(--icon-color)] hover:text-[var(--icon-hover-color)] hover:bg-opacity-75 dark:hover:bg-opacity-60 transition-all duration-200 cursor-pointer"
                                title={Icon.displayName || "Social Link"}
                            >
                                <Icon size={18} />
                            </a>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

const ClientLogosSection = () => {
    const logos = [
        { icon: Layers, name: "Layers" },
        { icon: Zap, name: "Sisyphus" },
        { icon: CircleDot, name: "Circooles" },
        { icon: GalleryHorizontalEnd, name: "Catalog" },
        { icon: Target, name: "Quotient" },
    ];

    return (
        <section className="py-12 md:py-16 bg-[var(--page-bg)]">
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap justify-center md:justify-around items-center gap-8 md:gap-12">
                    {logos.map((logo, index) => (
                        <div
                            key={index}
                            className="flex items-center space-x-3 text-[var(--page-text-secondary)] hover:text-[var(--page-text-primary)] transition-colors duration-200 cursor-pointer"
                        >
                            <logo.icon size={28} className="opacity-70" />
                            <span className="text-lg font-medium font-[var(--font-heading)] tracking-tight">{logo.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const FeaturesSection = () => {
    const featuresData: Array<{
        title: string;
        description: string;
        action?: string;
        type: string;
        imageUrl?: string;
        colSpanDesktop: string;
        revenue?: string;
    }> = [
        {
            title: "Send Money To Any Account, Anytime",
            description: "Send Money To Any Account — Fast, Easy, And Hassle-Free.",
            action: "Explore",
            type: "imageBackground",
            imageUrl:
                "https://images.unsplash.com/photo-1726056652641-de93ec003289?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            colSpanDesktop: "md:col-span-7",
        },
        {
            title: "Investment Management",
            description: "Send Money To Any Account — Fast, Easy, And Hassle-Free.",
            action: "Discover",
            type: "imageBackground",
            imageUrl:
                "https://images.unsplash.com/photo-1651341050677-24dba59ce0fd?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            colSpanDesktop: "md:col-span-3",
        },
        {
            title: "Master Your Money Flow",
            description:
                "Gain unparalleled control over your financial future. Our tools empower you to manage your assets with precision and confidence.",
            action: "Take Control",
            type: "imageBackground",
            imageUrl:
                "https://images.unsplash.com/photo-1649359569078-c445b3c6a116?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            colSpanDesktop: "md:col-span-3",
        },
        {
            title: "Seamless Payments, Effortless Tracking",
            description:
                "Experience the ease of modern transactions. Pay, get paid, and manage your financial interactions all in one intuitive platform, complete with clear insights.",
            action: "Explore Payments",
            type: "imageBackground",
            imageUrl:
                "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            colSpanDesktop: "md:col-span-7",
        },
    ];

    const renderGraphic = (type: string, feature: any) => {
        switch (type) {
            case "imageBackground":
                return null;
            case "sGraphic":
                return (
                    <div className="absolute inset-0 flex justify-center items-center overflow-hidden z-0">
                        <span className="text-[10rem] md:text-[8rem] lg:text-[10rem] font-black text-[var(--accent-color)] opacity-10 select-none -rotate-12">
                            S
                        </span>
                    </div>
                );
            case "barChart":
                return (
                    <div className="mt-4 h-20 flex items-end space-x-1 justify-center">
                        {[40, 70, 30, 90, 50, 60, 20, 80].map((h, i) => (
                            <div
                                key={i}
                                style={{ height: `${h}%` }}
                                className={`w-2.5 md:w-2 lg:w-2.5 rounded-t-sm bg-[var(--accent-color)] opacity-75 hover:opacity-100 transition-opacity`}
                            ></div>
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <section id="features" className="py-16 md:py-24 bg-[var(--page-bg)]">
            <div className="container mx-auto px-4">
                <div className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end md:justify-between">
                    <div className="md:w-1/2">
                        <span className="text-sm font-semibold text-[var(--accent-color)] uppercase tracking-wider">Features</span>
                        <h2 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--page-text-primary)] leading-tight">
                            Powerful Features at
                            <br />
                            Your Fingertips
                        </h2>
                    </div>
                    <p className="mt-4 md:mt-0 md:w-1/2 lg:w-2/5 text-[var(--page-text-secondary)] text-base md:text-lg leading-relaxed">
                        Your personal banking companion designed to simplify your financial life. Your personal banking companion designed
                        to simplify your financial life.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-10 gap-6 lg:gap-8">
                    {featuresData.map((feature, index) => {
                        const isImageBgCard = feature.type === "imageBackground";
                        const cardStyle =
                            isImageBgCard && feature.imageUrl
                                ? {
                                      backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(${feature.imageUrl})`,
                                      backgroundSize: "cover",
                                      backgroundPosition: "center",
                                  }
                                : {};

                        return (
                            <div
                                key={index}
                                style={cardStyle}
                                className={`relative flex flex-col bg-[var(--feature-card-bg)] p-6 sm:p-8 rounded-2xl shadow-xl overflow-hidden ${
                                    feature.colSpanDesktop
                                }
                            ${index < 2 ? "min-h-[480px] md:min-h-[auto]" : "min-h-[380px] md:min-h-[auto]"} 
                            ${index === 0 || index === 3 ? "justify-between" : ""}`}
                            >
                                <div className={`flex flex-col flex-grow ${isImageBgCard ? "relative z-10" : ""}`}>
                                    <div>
                                        <h3
                                            className={`text-2xl lg:text-3xl font-semibold ${
                                                isImageBgCard ? "text-white" : "text-[var(--feature-card-text-primary)]"
                                            } mb-3 leading-snug`}
                                        >
                                            {feature.title}
                                        </h3>
                                        <p
                                            className={`text-sm ${
                                                isImageBgCard ? "text-slate-200" : "text-[var(--feature-card-text-secondary)]"
                                            } mb-6 leading-relaxed`}
                                        >
                                            {feature.description}
                                        </p>
                                        {feature.revenue && (
                                            <div className="mb-4">
                                                <span
                                                    className={`text-xs ${
                                                        isImageBgCard ? "text-slate-300" : "text-[var(--feature-card-text-secondary)]"
                                                    }`}
                                                >
                                                    Revenue
                                                </span>
                                                <p
                                                    className={`text-2xl font-bold ${
                                                        isImageBgCard ? "text-white" : "text-[var(--feature-card-text-primary)]"
                                                    } mt-1`}
                                                >
                                                    {feature.revenue}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {!isImageBgCard && (
                                        <div
                                            className={`flex-grow flex items-center justify-center relative z-10 
                                   ${index === 0 || index === 3 ? "mb-auto" : ""}`}
                                        >
                                            {renderGraphic(feature.type, feature)}
                                        </div>
                                    )}
                                    {isImageBgCard && <div className="flex-grow"></div>}

                                    {feature.action && (
                                        <div className={`mt-auto pt-6 text-left ${index === 0 || index === 3 ? "" : "self-start"}`}>
                                            <button
                                                className={`px-6 py-2.5 font-semibold rounded-lg transition-colors duration-200 cursor-pointer text-sm 
                                        ${
                                            isImageBgCard
                                                ? "bg-white/90 text-slate-900 hover:bg-white"
                                                : "bg-[var(--explore-button-bg)] text-[var(--explore-button-text)] hover:bg-[var(--explore-button-hover-bg)]"
                                        }`}
                                            >
                                                {feature.action}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

const AboutUsSection = () => {
    return (
        <section id="about-us" className="py-16 md:py-24 bg-[var(--page-bg)] relative">
            <div className="absolute top-1/2 -translate-y-1/2 -left-1/4 w-1/2 md:w-1/3 h-full bg-[var(--accent-color)] rounded-full filter blur-[180px] opacity-10 dark:opacity-[0.06] animate-gentle-pulse"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="mb-8 md:mb-12 flex flex-col md:flex-row justify-between md:items-center">
                    <div className="mb-6 md:mb-0">
                        <span className="text-sm font-semibold text-[var(--accent-color)] uppercase tracking-wider">About Us</span>
                        <h2 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--page-text-primary)] leading-tight">
                            More Than a Bank — <br className="sm:hidden" />A Financial Partner for Life
                        </h2>
                    </div>
                    <div>
                        <button className="px-6 py-3 bg-[var(--details-button-bg)] text-[var(--details-button-text)] font-semibold rounded-lg hover:bg-[var(--details-button-hover-bg)] transition-colors duration-200 cursor-pointer text-sm md:text-base">
                            More Details
                        </button>
                    </div>
                </div>

                <div
                    className="relative w-full min-h-[400px] md:min-h-[500px] bg-cover bg-center rounded-2xl shadow-xl overflow-hidden p-8 md:p-12 flex flex-col justify-center items-center text-center border-2 border-[var(--video-border-color)]"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1742238619061-c4470b8c0372?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
                        boxShadow: `0 0 25px -5px var(--video-border-glow), 0 0 15px -10px var(--video-border-glow)`,
                    }}
                >
                    <div className="absolute inset-0 bg-black/60 z-0"></div>
                    <div className="relative z-10 max-w-3xl">
                        <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">Our Commitment to You</h3>
                        <p className="text-lg md:text-xl text-slate-200 leading-relaxed">
                            We're not just a bank; we're your dedicated financial ally. Discover our journey, our values, and how we're
                            working to build a brighter financial future for everyone.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

const TestimonialsSection = () => {
    const testimonials = [
        {
            name: "Cameron Williamson",
            role: "Marketing Coordinator",
            quote: "The mobile app is incredibly intuitive. I can transfer funds, pay bills, and even top up my e-wallet in seconds. It saves me so much time!",
            avatarUrl:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
            name: "Alexandra Smith",
            role: "Product Manager",
            quote: "The analytics dashboard provides real-time insights that help us track user engagement effectively. It has significantly improved our decision-making processes.",
            avatarUrl:
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
            name: "Jordan Lee",
            role: "UX Designer",
            quote: "I love the flexibility of the design tools. They allow for rapid prototyping and seamless collaboration with the team, making the design process much more efficient.",
            avatarUrl:
                "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
    ];

    return (
        <section id="testimonials" className="py-16 md:py-24 bg-[var(--page-bg)] relative">
            <div className="absolute top-1/2 -translate-y-1/2 -right-1/4 w-1/2 md:w-1/3 h-full bg-[var(--accent-color)] rounded-full filter blur-[180px] opacity-10 dark:opacity-[0.06] animate-gentle-pulse"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end md:justify-between">
                    <div className="md:w-3/5 lg:w-1/2">
                        <span className="text-sm font-semibold text-[var(--accent-color)] uppercase tracking-wider">Testimonials</span>
                        <h2 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--page-text-primary)] leading-tight">
                            Here's What Real Users Are Saying About Us
                        </h2>
                    </div>
                    <p className="mt-4 md:mt-0 md:w-2/5 lg:w-1/3 text-[var(--page-text-secondary)] text-base md:text-lg leading-relaxed">
                        Your personal banking companion designed to simplify your financial life. Your personal banking companion designed
                        to simplify your financial life.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="relative bg-[var(--testimonial-card-bg)] p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col overflow-hidden"
                        >
                            <div
                                className="absolute top-0 left-0 right-0 h-1.5 bg-[var(--testimonial-card-top-glow)] rounded-t-2xl"
                                style={{ boxShadow: `0 0 12px 1px var(--testimonial-card-top-glow)` }}
                            ></div>

                            <div className="flex items-center mb-5 pt-3">
                                {testimonial.avatarUrl ? (
                                    <img
                                        src={testimonial.avatarUrl}
                                        alt={testimonial.name}
                                        className="w-14 h-14 rounded-full mr-4 object-cover border-2 border-[var(--accent-color)]/50"
                                    />
                                ) : (
                                    <UserCircle size={56} className="text-[var(--accent-color)] rounded-full mr-4" />
                                )}
                                <div>
                                    <h3 className="text-lg font-semibold text-[var(--testimonial-card-text-primary)]">
                                        {testimonial.name}
                                    </h3>
                                    <p className="text-sm text-[var(--testimonial-card-text-secondary)]">{testimonial.role}</p>
                                </div>
                            </div>
                            <p className="text-base text-[var(--testimonial-card-text-secondary)] leading-relaxed flex-grow">
                                "{testimonial.quote}"
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const footerLinks = [
        { name: "Home", href: "#" },
        { name: "Special Offers", href: "#" },
        { name: "Blog", href: "#" },
        { name: "About Us", href: "#" },
        { name: "Payment & Delivery", href: "#" },
        { name: "Contacts", href: "#" },
    ];

    return (
        <footer className="bg-[var(--footer-bg)] text-[var(--footer-text-secondary)] relative overflow-hidden">
            <div className="absolute -bottom-1/4 -left-1/4 w-1/2 md:w-2/5 h-1/2 bg-[var(--accent-color)] rounded-full filter blur-[150px] opacity-10 dark:opacity-[0.07] animate-gentle-pulse"></div>

            <div className="border-t border-[var(--footer-separator-color)] pt-12 md:pt-16 relative z-10">
                <div className="container mx-auto px-4 pb-8 md:pb-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                        <div className="sm:col-span-2 lg:col-span-1">
                            <a
                                href="#"
                                className="inline-flex items-center text-2xl font-bold text-[var(--footer-text-primary)] hover:text-[var(--footer-link-hover-color)] transition-colors mb-4"
                            >
                                Catalog
                                <ArrowUpRight size={20} className="ml-1.5" />
                            </a>
                            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                {footerLinks.map((link) => (
                                    <li key={link.name}>
                                        <a
                                            href={link.href}
                                            className="hover:text-[var(--footer-link-hover-color)] transition-colors duration-200 cursor-pointer"
                                        >
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-5 text-sm">
                            <div>
                                <p className="text-xs uppercase text-[var(--footer-text-secondary)] mb-0.5">Contact Us</p>
                                <a
                                    href="tel:+18919891191"
                                    className="font-semibold text-[var(--footer-text-primary)] hover:text-[var(--footer-link-hover-color)] transition-colors text-lg"
                                >
                                    +1 891 989-11-91
                                </a>
                            </div>
                            <div>
                                <p className="text-xs uppercase text-[var(--footer-text-secondary)] mb-0.5">Location</p>
                                <p className="text-[var(--footer-text-primary)]">2972 Westheimer Rd. Santa Ana, Illinois 85486</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase text-[var(--footer-text-secondary)] mb-0.5">Email</p>
                                <a
                                    href="mailto:hello@logoipsum.com"
                                    className="text-[var(--footer-text-primary)] hover:text-[var(--footer-link-hover-color)] transition-colors"
                                >
                                    hello@logoipsum.com
                                </a>
                            </div>
                        </div>

                        <div className="flex flex-col justify-between items-start lg:items-end text-sm">
                            <div className="mb-6 lg:mb-0 lg:text-right">
                                <p className="text-xs uppercase text-[var(--footer-text-secondary)] mb-0.5">Mo-Fr</p>
                                <p className="font-semibold text-[var(--footer-text-primary)] text-xl">9am – 6pm</p>
                            </div>
                            <div className="flex flex-col lg:items-end items-start w-full">
                                <button
                                    onClick={scrollToTop}
                                    className="mb-3 p-2 bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-md rounded-lg shadow-md text-[var(--icon-color)] hover:text-[var(--icon-hover-color)] hover:bg-opacity-75 dark:hover:bg-opacity-60 transition-all duration-200 cursor-pointer"
                                    title="Back to Top"
                                >
                                    <ArrowUp size={18} />
                                </button>
                                <p className="text-xs text-[var(--footer-text-secondary)]/70">
                                    &copy; {new Date().getFullYear()} GPN Banking. All rights reserved.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const LandingPage = () => {
    return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <GlobalThemeStyles />
            <div className="flex flex-col min-h-screen bg-[var(--page-bg)] font-[var(--font-body)] ">
                <Header />
                <main className="flex-grow">
                    <HeroSection />
                    <ClientLogosSection />
                    <FeaturesSection />
                    <AboutUsSection />
                    <TestimonialsSection />
                </main>
                <Footer />
            </div>
        </ThemeProvider>
    );
};

export default LandingPage;
