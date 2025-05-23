"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ThemeProvider } from "next-themes";
import { useTheme } from "next-themes";
import { motion, useAnimation, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { FiMoon, FiSun, FiMail } from "react-icons/fi";
import dynamic from "next/dynamic";

const GlobalThemeStyles = () => (
    <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Open+Sans:wght@400;500;600;700&display=swap');
        
        :root {
            --page-bg: #fbf6ed;
            --page-text-primary: #18181b;
            --page-text-secondary: #52525b;
            --navbar-bg: rgba(40, 40, 45, 0.5);
            --card-bg: #f4f4f5;
            --card-hover: #e4e4e7;
            --accent-primary: #a36524;
            --accent-secondary: #8b5cf6;
            --button-bg: #f43f5e;
            --button-text: #ffffff;
            --button-hover: #e11d48;
            --input-bg: #f4f4f5;
            --input-border: #d4d4d8;
            --border-color: #e4e4e7;
            --font-heading: "Oswald", sans-serif;
            --font-body: "Open Sans", sans-serif;
            --scrollbar-thumb: #cbd5e1;
            --scrollbar-track: #f1f5f9;
            --card-shadow: rgba(0, 0, 0, 0.1);
        }

        html.dark {
            --page-bg: #121212;
            --page-text-primary: #f4f4f5;
            --page-text-secondary: #a1a1aa;
            --navbar-bg: rgba(40, 40, 45, 0.5);
            --card-bg: #1e1e1e;
            --card-hover: #2a2a2a;
            --accent-primary: #a36524;
            --accent-secondary: #8b5cf6;
            --button-bg: #f43f5e;
            --button-text: #ffffff;
            --button-hover: #e11d48;
            --input-bg: #1e1e1e;
            --input-border: #3f3f46;
            --border-color: #27272a;
            --scrollbar-thumb: #4b5563;
            --scrollbar-track: #1f2937;
            --card-shadow: rgba(0, 0, 0, 0.3);
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

        ::-webkit-scrollbar {
            width: 10px;
        }

        ::-webkit-scrollbar-track {
            background: var(--scrollbar-track);
        }

        ::-webkit-scrollbar-thumb {
            background: var(--scrollbar-thumb);
            border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: var(--accent-primary);
        }
    `}</style>
);

const ThemeToggle = dynamic(
    () =>
        Promise.resolve(({ className = "" }: { className?: string }) => {
            const { theme, setTheme } = useTheme();
            const isDarkTheme = theme === "dark";

            const toggleTheme = () => {
                setTheme(theme === "dark" ? "light" : "dark");
            };

            return (
                <button
                    onClick={toggleTheme}
                    className={`p-2 rounded-full bg-[var(--card-bg)] text-[var(--page-text-primary)] cursor-pointer ${className}`}
                >
                    {isDarkTheme ? <FiSun size={20} /> : <FiMoon size={20} />}
                </button>
            );
        }),
    { ssr: false }
);

const RollButton = dynamic(
    () =>
        Promise.resolve(
            ({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => {
                const [isHovered, setIsHovered] = useState(false);
                const { theme } = useTheme();
                const isDarkTheme = theme === "dark";

                return (
                    <button
                        className={`px-12 py-3 rounded-full font-medium cursor-pointer ${className}`}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onClick={onClick}
                        style={{
                            backgroundColor: isDarkTheme ? "white" : "#051d0d",
                            color: isDarkTheme ? "#051d0d" : "white",
                        }}
                    >
                        <div className="relative">
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={isHovered ? "hovered" : "default"}
                                    className="block"
                                    initial={{ y: isHovered ? 20 : 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -20, opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    {children}
                                </motion.span>
                            </AnimatePresence>
                        </div>
                    </button>
                );
            }
        ),
    { ssr: false }
);

const Navbar = () => {
    const scrollToSection = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <nav
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-8 py-3 backdrop-blur-md rounded-full w-auto shadow-lg"
            style={{
                backgroundColor: "var(--navbar-bg)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                maxWidth: "90%",
            }}
        >
            <div className="flex items-center justify-between space-x-8">
                <div className="text-xl font-semibold text-white">ArteFACT</div>

                <div className="hidden md:flex items-center space-x-6">
                    <a onClick={() => scrollToSection("hero")} className="text-white hover:text-[#a36524] transition-colors cursor-pointer">
                        Home
                    </a>
                    <a
                        onClick={() => scrollToSection("artists")}
                        className="text-white hover:text-[#a36524] transition-colors cursor-pointer"
                    >
                        Artists
                    </a>
                    <a
                        onClick={() => scrollToSection("artworks")}
                        className="text-white hover:text-[#a36524] transition-colors cursor-pointer"
                    >
                        Artworks
                    </a>
                </div>

                <div className="flex items-center">
                    <ThemeToggle />
                </div>
            </div>
        </nav>
    );
};

interface Position {
    x: number;
    y: number;
}

interface Size {
    width: number;
    height: number;
}

interface ArtworkItem {
    position: Position;
    size: Size;
    imageUrl: string;
}

interface Artist {
    name: string;
    specialty: string;
    imageUrl: string;
}

interface Artwork {
    title: string;
    description: string;
    artist: string;
    price: string;
    imageUrl: string;
}

const FloatingArtwork = ({ index, position, imageUrl, size }: { index: number; position: Position; imageUrl: string; size: Size }) => {
    const mouseRef = useRef({ x: 0, y: 0 });
    const positionRef = useRef({ x: position.x, y: position.y });
    const animationRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            mouseRef.current = {
                x: (clientX / window.innerWidth) * 2 - 1,
                y: (clientY / window.innerHeight) * 2 - 1,
            };
        };

        window.addEventListener("mousemove", handleMouseMove);

        const animate = () => {
            const factorX = index % 2 === 0 ? 0.01 : 0.015;
            const factorY = index % 3 === 0 ? 0.01 : 0.02;

            positionRef.current.x += mouseRef.current.x * factorX;
            positionRef.current.y += mouseRef.current.y * factorY;

            positionRef.current.x += Math.sin(Date.now() * 0.001 + index) * 0.002;
            positionRef.current.y += Math.cos(Date.now() * 0.001 + index) * 0.002;

            positionRef.current.x *= 0.98;
            positionRef.current.y *= 0.98;

            if (animationRef.current) {
                animationRef.current.style.transform = `translate(${positionRef.current.x * 100}px, ${positionRef.current.y * 100}px)`;
            }

            requestAnimationFrame(animate);
        };

        const animationFrame = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(animationFrame);
        };
    }, [index]);

    return (
        <div
            ref={animationRef}
            className="absolute rounded-lg overflow-hidden shadow-lg transition-transform"
            style={{
                left: `${position.x * 100}%`,
                top: `${position.y * 100}%`,
                width: `${size.width}px`,
                height: `${size.height}px`,
                zIndex: index % 2 === 0 ? 10 : 5,
            }}
        >
            <Image src={imageUrl} alt="Artwork" fill style={{ objectFit: "cover" }} priority={index < 3} />
        </div>
    );
};

const artworkData: ArtworkItem[] = [
    {
        position: { x: 0.05, y: 0.15 },
        size: { width: 200, height: 240 },
        imageUrl:
            "https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        position: { x: 0.9, y: 0.25 },
        size: { width: 180, height: 250 },
        imageUrl:
            "https://images.unsplash.com/photo-1642427749670-f20e2e76ed8c?q=80&w=2980&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        position: { x: 0.15, y: 0.8 },
        size: { width: 220, height: 200 },
        imageUrl:
            "https://images.unsplash.com/photo-1641391503184-a2131018701b?q=80&w=2980&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        position: { x: 0.85, y: 0.75 },
        size: { width: 180, height: 180 },
        imageUrl:
            "https://images.unsplash.com/photo-1674214857700-b5a833693513?q=80&w=2980&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        position: { x: 0.02, y: 0.45 },
        size: { width: 150, height: 200 },
        imageUrl:
            "https://images.unsplash.com/photo-1728922236580-e242f44ed978?q=80&w=3198&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        position: { x: 0.92, y: 0.5 },
        size: { width: 220, height: 160 },
        imageUrl:
            "https://images.unsplash.com/flagged/photo-1572392640988-ba48d1a74457?q=80&w=2160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        position: { x: 0.25, y: 0.05 },
        size: { width: 190, height: 220 },
        imageUrl:
            "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        position: { x: 0.75, y: 0.05 },
        size: { width: 170, height: 190 },
        imageUrl:
            "https://images.unsplash.com/photo-1570158268183-d296b2892211?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        position: { x: 0.3, y: 0.85 },
        size: { width: 200, height: 150 },
        imageUrl:
            "https://images.unsplash.com/photo-1539614474468-f423a2d2270c?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        position: { x: 0.65, y: 0.9 },
        size: { width: 180, height: 210 },
        imageUrl:
            "https://images.unsplash.com/photo-1632765854612-9b02b6ec2b15?q=80&w=2586&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        position: { x: 0.45, y: 0.08 },
        size: { width: 160, height: 200 },
        imageUrl:
            "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=3145&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        position: { x: 0.12, y: 0.3 },
        size: { width: 170, height: 220 },
        imageUrl:
            "https://images.unsplash.com/photo-1579541814924-49fef17c5be5?q=80&w=2549&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
];

const HeroSection = () => {
    const scrollToArtists = () => {
        document.getElementById("artists")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <motion.section
            id="hero"
            className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            <div className="absolute inset-0 -z-10">
                {artworkData.map((artwork, i) => (
                    <FloatingArtwork key={i} index={i} position={artwork.position} size={artwork.size} imageUrl={artwork.imageUrl} />
                ))}
            </div>

            <div className="max-w-4xl text-center z-10 bg-[var(--page-bg)]/40 backdrop-blur-sm p-10 rounded-xl">
                <motion.h1
                    className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                >
                    A New Dimension of
                    <br />
                    Art and Expression
                </motion.h1>
                <motion.p
                    className="text-xl text-[var(--page-text-secondary)] mb-8 max-w-2xl mx-auto"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                >
                    Discover unique pieces from talented artists around the world
                </motion.p>
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }}>
                    <RollButton className="text-white text-lg" onClick={scrollToArtists}>
                        Explore
                    </RollButton>
                </motion.div>
            </div>
        </motion.section>
    );
};

const AboutUsSection = () => {
    return (
        <section id="about" className="relative py-24 overflow-hidden" style={{ backgroundColor: "#4b2d14" }}>
            <motion.div
                className="absolute inset-0 z-0 opacity-30"
                style={{
                    background: "radial-gradient(circle at 30% 50%, rgba(163, 101, 36, 0.7) 0%, transparent 60%)",
                }}
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    repeatType: "reverse",
                }}
            />

            <motion.div
                className="absolute inset-0 z-0 opacity-20"
                style={{
                    background: "radial-gradient(circle at 70% 30%, rgba(228, 216, 196, 0.6) 0%, transparent 60%)",
                }}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: 2,
                }}
            />

            <div className="absolute bottom-0 left-0 w-full h-40 overflow-hidden z-0">
                <motion.svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 1000 150"
                    preserveAspectRatio="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                >
                    <motion.path
                        d="M 0 100 Q 250 50 500 100 Q 750 150 1000 100 L 1000 150 L 0 150 Z"
                        fill="none"
                        stroke="rgba(228, 216, 196, 0.3)"
                        strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 3, ease: "easeInOut" }}
                    />
                </motion.svg>
            </div>

            <div className="absolute bottom-1/3 right-1/2 transform translate-x-1/2 translate-y-1/2 z-0">
                <motion.svg
                    width="80"
                    height="80"
                    viewBox="0 0 100 100"
                    initial={{ rotate: 0, opacity: 0 }}
                    animate={{ rotate: 360, opacity: 0.7 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                    <g fill="#a36524">
                        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                            <motion.path
                                key={i}
                                d="M50 50 L50 10 A20 20 0 0 1 70 30 Z"
                                transform={`rotate(${angle} 50 50)`}
                                initial={{ scale: 0.8 }}
                                animate={{ scale: [0.8, 1, 0.8] }}
                                transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                            />
                        ))}
                    </g>
                </motion.svg>
            </div>

            <FloatingParticles />

            <div className="absolute top-0 left-0 w-full h-10 overflow-hidden">
                <motion.svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 1000 50"
                    preserveAspectRatio="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 0.5 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                >
                    <motion.path d="M 0 25 Q 250 50 500 25 Q 750 0 1000 25" fill="none" stroke="#e4d8c4" strokeWidth="3" />
                </motion.svg>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-10 overflow-hidden">
                <motion.svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 1000 50"
                    preserveAspectRatio="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 0.5 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
                >
                    <motion.path d="M 0 25 Q 250 0 500 25 Q 750 50 1000 25" fill="none" stroke="#e4d8c4" strokeWidth="3" />
                </motion.svg>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-xs uppercase tracking-widest text-[#e4d8c4]/80 mb-4">ABOUT US</div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="text-[#e4d8c4]">
                        <motion.h2
                            className="text-4xl md:text-5xl font-bold mb-8 leading-tight"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            Empowering the Next
                            <br />
                            Generation of Visionary Creators
                        </motion.h2>

                        <motion.div
                            className="space-y-4 text-[#e4d8c4]/80"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <p>
                                We curate and showcase exceptional photographic art from emerging talents across the globe—each piece a
                                testament to originality and creative vision.
                            </p>
                            <p>
                                If you're a photographer looking to share your work or explore collaboration opportunities, we'd love to
                                hear from you. Reach out through our contact page and join our growing community of forward-thinking
                                artists.
                            </p>
                        </motion.div>
                    </div>

                    <div>
                        <motion.div
                            className="relative rounded-lg overflow-hidden shadow-xl aspect-[3/4]"
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <Image
                                src="https://images.unsplash.com/photo-1607158809228-22f2d5fef693?q=80&w=2923&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="Artist portrait"
                                fill
                                style={{ objectFit: "cover" }}
                            />
                        </motion.div>

                        <motion.div
                            className="mt-8 border-l-2 border-[#a36524] pl-4"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <blockquote className="text-[#e4d8c4]/90 italic">
                                <span className="text-2xl">
                                    "Photography is the language of emotion. This platform gave{" "}
                                    <em className="not-italic font-medium text-[#a36524]">my voice</em> a space."
                                </span>
                            </blockquote>
                            <p className="text-[#e4d8c4]/60 mt-2">— Ana Ruiz</p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const TreasureTroveSection = () => {
    const [inView, setInView] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const images = [
        "https://images.unsplash.com/photo-1736789087466-e67dd9d77ec3?q=80&w=3135&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1737551828838-f9a67900eab4?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1737509212751-826ac7e82858?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1737619043903-0668dc6d5b19?q=80&w=2617&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1737559217439-a5703e9b65cb?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1735999925427-d04865a57628?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1736457908762-d6ae9e5fb593?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1736771932149-26287a969645?q=80&w=3100&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ];

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                }
            },
            { threshold: 0.3 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    return (
        <section ref={sectionRef} className="py-24 px-6 bg-[var(--page-bg)]">
            <div className="max-w-6xl mx-auto">
                <div className="relative h-[700px] flex items-center justify-center overflow-hidden" ref={containerRef}>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 w-[300px] text-center">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={inView ? { opacity: 1 } : {}}
                            transition={{ delay: 1, duration: 0.5 }}
                        >
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                explore a treasure trove
                                <br />
                                of emerging art.
                            </h2>
                            <RollButton
                                className="text-white text-lg mx-auto"
                                onClick={() => document.getElementById("artworks")?.scrollIntoView({ behavior: "smooth" })}
                            >
                                Explore Artworks
                            </RollButton>
                        </motion.div>
                    </div>

                    <div className="w-full h-full relative">
                        <motion.div
                            className="absolute top-1/2 left-1/2 w-[600px] h-[600px] transform -translate-x-1/2 -translate-y-1/2"
                            animate={
                                inView
                                    ? {
                                          rotate: [0, 360],
                                          transition: {
                                              rotate: {
                                                  repeat: Infinity,
                                                  duration: 30,
                                                  ease: "linear",
                                                  delay: 1.2,
                                              },
                                          },
                                      }
                                    : {}
                            }
                        >
                            {images.map((img, index) => {
                                const numImages = images.length;
                                const angle = (index / numImages) * 2 * Math.PI;
                                const x = Math.cos(angle) * 250;
                                const y = Math.sin(angle) * 250;

                                return (
                                    <motion.div
                                        key={index}
                                        className="absolute rounded-2xl overflow-hidden shadow-lg"
                                        style={{
                                            width: index % 2 === 0 ? "120px" : "140px",
                                            height: index % 2 === 0 ? "160px" : "180px",
                                            top: "50%",
                                            left: "50%",
                                            margin: "-80px 0 0 -60px",
                                        }}
                                        initial={{
                                            x: 0,
                                            y: 50,
                                        }}
                                        animate={
                                            inView
                                                ? {
                                                      x,
                                                      y,
                                                      transition: {
                                                          type: "spring",
                                                          stiffness: 70,
                                                          damping: 10,
                                                          duration: 1,
                                                      },
                                                  }
                                                : {}
                                        }
                                    >
                                        <Image src={img} alt="Gallery image" fill style={{ objectFit: "cover" }} />
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const FloatingParticles = dynamic(
    () =>
        Promise.resolve(() => {
            return (
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute rounded-full bg-[#e4d8c4]"
                            style={{
                                width: Math.random() * 8 + 2,
                                height: Math.random() * 8 + 2,
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                opacity: Math.random() * 0.3 + 0.1,
                            }}
                            animate={{
                                y: [0, -30, 0],
                                x: [0, Math.random() * 20 - 10, 0],
                                opacity: [0.1, 0.3, 0.1],
                            }}
                            transition={{
                                duration: Math.random() * 10 + 10,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </div>
            );
        }),
    { ssr: false }
);

const FeaturesSection = () => {
    return (
        <section className="py-24 px-6 bg-[var(--page-bg)]">
            <div className="container mx-auto mb-16">
                <motion.h2
                    className="text-4xl md:text-5xl lg:text-6xl font-bold text-center leading-tight mb-20"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    We are all about making original
                    <br />
                    art attainable for everyone
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FeatureCard
                        image="https://images.unsplash.com/photo-1591035897819-f4bdf739f446?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        title="Explore Artists"
                        description="Discover diverse artistic talent."
                    />
                    <FeatureCard
                        image="https://images.unsplash.com/photo-1630327064614-4e74d61f2a24?q=80&w=3125&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        title="Become a Collector"
                        description="Start building your personal art collection."
                    />
                    <FeatureCard
                        image="https://images.unsplash.com/photo-1627236418876-ef8689d94241?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        title="Discover Artworks"
                        description="Explore captivating creations."
                    />
                </div>
            </div>
        </section>
    );
};

const FeatureCard = ({ image, title, description }: { image: string; title: string; description: string }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            className="relative h-[400px] rounded-lg overflow-hidden group cursor-pointer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="absolute inset-0">
                <Image src={image} alt={title} fill style={{ objectFit: "cover" }} />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-t from-white/20 via-white/10 to-transparent rounded-lg"></div>
                <div className="relative z-10">
                    <div className="h-9 overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.h3
                                key={isHovered ? "hovered" : "default"}
                                className="text-2xl font-semibold text-white"
                                initial={{ y: isHovered ? 25 : 0, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -25, opacity: 0 }}
                                transition={{ duration: 0.15 }}
                            >
                                {title}
                            </motion.h3>
                        </AnimatePresence>
                    </div>
                    <p className="text-white/90 mt-1">{description}</p>
                </div>
            </div>
        </motion.div>
    );
};

const ArtistCard = ({ artist, index }: { artist: Artist; index: number }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            className="group cursor-pointer"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 * index, duration: 0.7 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative overflow-hidden rounded-xl h-80 md:h-96">
                <div className="absolute inset-0">
                    <Image
                        src={artist.imageUrl}
                        alt={artist.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-t from-black/30 via-black/20 to-transparent rounded-lg"></div>
                    <div className="relative z-10">
                        <div className="h-9 overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.h3
                                    key={isHovered ? "hovered" : "default"}
                                    className="text-2xl font-semibold text-white"
                                    initial={{ y: isHovered ? 25 : 0, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -25, opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    {artist.name}
                                </motion.h3>
                            </AnimatePresence>
                        </div>
                        <p className="text-white/90 mt-1">{artist.specialty}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const artists: Artist[] = [
    {
        name: "Elena Morozova",
        specialty: "Surrealism",
        imageUrl:
            "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=3145&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        name: "Marcus Chen",
        specialty: "Digital Art",
        imageUrl:
            "https://images.unsplash.com/photo-1579541814924-49fef17c5be5?q=80&w=2549&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        name: "Sofia Pérez",
        specialty: "Abstract",
        imageUrl:
            "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        name: "David Kim",
        specialty: "Sculpture",
        imageUrl:
            "https://images.unsplash.com/photo-1632765854612-9b02b6ec2b15?q=80&w=2586&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
];

const FloatingDecorations = dynamic(
    () =>
        Promise.resolve(() => {
            return (
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute rounded-full bg-[#e4d8c4]"
                            style={{
                                width: Math.random() * 8 + 2,
                                height: Math.random() * 8 + 2,
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                opacity: Math.random() * 0.3 + 0.1,
                            }}
                            animate={{
                                y: [0, -30, 0],
                                x: [0, Math.random() * 20 - 10, 0],
                                opacity: [0.1, 0.3, 0.1],
                            }}
                            transition={{
                                duration: Math.random() * 10 + 10,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </div>
            );
        }),
    { ssr: false }
);

const ArtistsSection = () => {
    const { scrollYProgress } = useScroll();
    const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 100]);
    const rotate = useTransform(scrollYProgress, [0, 1], [0, 10]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

    return (
        <section
            id="artists"
            className="py-24 relative overflow-hidden"
            style={{
                background: `linear-gradient(135deg, #a36524 0%, #4b2d14 100%)`,
            }}
        >
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0"></div>

            <motion.div
                className="absolute inset-0 -z-10 opacity-20"
                style={{
                    backgroundImage: `url("https://images.unsplash.com/photo-1570158268183-d296b2892211?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")`,
                    backgroundSize: "cover",
                    y: backgroundY,
                }}
            />

            <motion.div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-[#e4d8c4]/30 blur-3xl" style={{ scale, rotate }} />

            <motion.div
                className="absolute top-40 right-10 w-60 h-60 rounded-full bg-[#a36524]/30 blur-2xl"
                style={{
                    scale: useTransform(scrollYProgress, [0, 0.5], [1, 1.2]),
                    rotate: useTransform(scrollYProgress, [0, 1], [0, -15]),
                    opacity: useTransform(scrollYProgress, [0, 0.5], [0.4, 0.7]),
                }}
            />

            <motion.div
                className="absolute bottom-20 -left-10 w-80 h-80 rounded-full bg-[#784916]/40 blur-3xl"
                style={{
                    scale: useTransform(scrollYProgress, [0, 0.5], [0.8, 1.1]),
                    rotate: useTransform(scrollYProgress, [0, 1], [0, 20]),
                }}
            />

            <motion.div
                className="absolute -bottom-40 right-0 w-[600px] h-[600px] rounded-full bg-[#e4d8c4]/20 blur-[100px]"
                style={{
                    scale: useTransform(scrollYProgress, [0, 0.5], [0.9, 1.1]),
                    rotate: useTransform(scrollYProgress, [0, 1], [10, -5]),
                }}
            />

            <FloatingDecorations />

            <div className="absolute top-0 left-0 w-full h-10 overflow-hidden">
                <motion.svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 1000 50"
                    preserveAspectRatio="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 0.5 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                >
                    <motion.path d="M 0 25 Q 250 50 500 25 Q 750 0 1000 25" fill="none" stroke="#e4d8c4" strokeWidth="3" />
                </motion.svg>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-10 overflow-hidden">
                <motion.svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 1000 50"
                    preserveAspectRatio="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 0.5 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
                >
                    <motion.path d="M 0 25 Q 250 0 500 25 Q 750 50 1000 25" fill="none" stroke="#e4d8c4" strokeWidth="3" />
                </motion.svg>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="inline-block px-4 py-1 rounded-full bg-[#a36524] text-[#e4d8c4] text-sm font-medium mb-3">
                        Extraordinary Talent
                    </span>
                    <h2 className="text-4xl md:text-6xl font-bold mb-4 text-[#e4d8c4]">Meet Our Artists</h2>
                    <p className="text-xl text-[#e4d8c4]/90 max-w-3xl mx-auto">
                        Talented individuals from around the globe shaping the art world with their unique vision and creativity
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {artists.map((artist, i) => (
                        <ArtistCard key={i} artist={artist} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const ArtworkCard = ({ artwork, index }: { artwork: Artwork; index: number }) => {
    const cardRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ["start end", "end start"],
    });

    const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);
    const opacity = useTransform(scrollYProgress, [0, 0.3], [0.5, 1]);

    return (
        <motion.div
            ref={cardRef}
            className="group relative"
            style={{ scale, opacity }}
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 * (index % 3), duration: 0.7 }}
        >
            <div className="bg-[var(--card-bg)] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                <div className="relative h-80 overflow-hidden">
                    <Image
                        src={artwork.imageUrl}
                        alt={artwork.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-sm font-medium">{artwork.artist}</p>
                        <p className="text-xs opacity-80">{artwork.price}</p>
                    </div>
                </div>
                <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{artwork.title}</h3>
                    <p className="text-[var(--page-text-secondary)] text-sm">{artwork.description}</p>
                </div>
            </div>
        </motion.div>
    );
};

const artworks: Artwork[] = [
    {
        title: "Eternal Bloom",
        description: "Abstract mixed media on canvas",
        artist: "Elena Morozova",
        price: "$2,400",
        imageUrl:
            "https://images.unsplash.com/photo-1539614474468-f423a2d2270c?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        title: "Urban Fragments",
        description: "Digital print, limited edition",
        artist: "Marcus Chen",
        price: "$950",
        imageUrl:
            "https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        title: "Silent Whispers",
        description: "Oil on canvas",
        artist: "Sofia Pérez",
        price: "$3,200",
        imageUrl:
            "https://images.unsplash.com/photo-1641391503184-a2131018701b?q=80&w=2980&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        title: "Echoes of Time",
        description: "Bronze sculpture",
        artist: "David Kim",
        price: "$5,800",
        imageUrl:
            "https://images.unsplash.com/photo-1674214857700-b5a833693513?q=80&w=2980&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        title: "Dreamer's Landscape",
        description: "Watercolor on paper",
        artist: "Elena Morozova",
        price: "$1,750",
        imageUrl:
            "https://images.unsplash.com/photo-1728922236580-e242f44ed978?q=80&w=3198&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        title: "Digital Dimensions",
        description: "AI-generated digital art",
        artist: "Marcus Chen",
        price: "$850",
        imageUrl:
            "https://images.unsplash.com/flagged/photo-1572392640988-ba48d1a74457?q=80&w=2160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
];

const ArtworksSection = () => {
    return (
        <section
            id="artworks"
            className="py-24 px-6 relative"
            style={{
                background: `linear-gradient(135deg, var(--accent-secondary)10, var(--page-bg))`,
            }}
        >
            <div className="max-w-7xl mx-auto">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">Featured Artworks</h2>
                    <p className="text-xl text-[var(--page-text-secondary)] max-w-3xl mx-auto">
                        Discover unique pieces that speak to your soul, from emerging and established artists
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {artworks.map((artwork, i) => (
                        <ArtworkCard key={i} artwork={artwork} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const Newsletter = () => {
    const [email, setEmail] = useState("");
    const [showNotification, setShowNotification] = useState(false);

    const updateForm = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const subscribeNow = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (email) {
            console.log("Subscribed:", email);
            setEmail("");
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 3000);
        }
    };

    return (
        <section className="py-24 px-6 bg-[var(--page-bg)]">
            <div className="max-w-4xl mx-auto relative">
                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                    <Image
                        src="https://images.unsplash.com/photo-1737490419228-0ba705903a23?q=80&w=2760&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Newsletter background"
                        fill
                        priority
                        style={{ objectFit: "cover" }}
                    />
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
                </div>

                <motion.div
                    className="relative z-10 rounded-2xl p-8 md:p-12 shadow-lg text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Stay Updated with ArteFACT</h2>
                    <p className="text-white/80 mb-8 max-w-2xl mx-auto">
                        Be the first to know about new artists, exhibitions, and exclusive offers
                    </p>

                    <form onSubmit={subscribeNow} className="max-w-md mx-auto">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex-grow relative">
                                <FiMail
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--page-text-secondary)]"
                                    size={20}
                                />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={updateForm}
                                    placeholder="Your email address"
                                    className="w-full pl-10 pr-4 py-3 rounded-full bg-white/20 border border-white/30 focus:ring-2 focus:ring-[#a36524] focus:border-transparent outline-none text-white placeholder-white/60"
                                    required
                                />
                            </div>
                            <div>
                                <RollButton className="text-white text-base whitespace-nowrap" onClick={() => {}}>
                                    Subscribe
                                </RollButton>
                            </div>
                        </div>
                    </form>
                </motion.div>
            </div>

            <motion.div
                className="fixed bottom-5 right-5 p-4 bg-[#a36524] text-white rounded-lg shadow-lg z-50"
                initial={{ opacity: 0, y: 50 }}
                animate={{
                    opacity: showNotification ? 1 : 0,
                    y: showNotification ? 0 : 50,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
                <div className="flex items-center gap-3">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span>Thank you for subscribing!</span>
                </div>
            </motion.div>
        </section>
    );
};

const Footer = () => {
    return (
        <footer className="bg-[var(--card-bg)] py-12 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
                    <div>
                        <h3 className="text-xl font-semibold mb-4">ArteFACT</h3>
                        <p className="text-[var(--page-text-secondary)] max-w-xs">
                            Connecting artists and collectors in a vibrant community of creativity and expression.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-[var(--page-text-secondary)] hover:text-[#a36524] transition-colors">
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-[var(--page-text-secondary)] hover:text-[#a36524] transition-colors">
                                    FAQs
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-[var(--page-text-secondary)] hover:text-[#a36524] transition-colors">
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-[var(--page-text-secondary)] hover:text-[#a36524] transition-colors">
                                    Terms of Service
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-4">Contact</h3>
                        <ul className="space-y-2">
                            <li className="text-[var(--page-text-secondary)]">1234 Art Square, Creativity Ave</li>
                            <li>
                                <a
                                    href="mailto:contact@artefact.com"
                                    className="text-[var(--page-text-secondary)] hover:text-[#a36524] transition-colors inline-flex items-center group"
                                >
                                    <span className="relative">
                                        contact@artefact.com
                                        <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#a36524] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
                                    </span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="tel:+15551234567"
                                    className="text-[var(--page-text-secondary)] hover:text-[#a36524] transition-colors inline-flex items-center group"
                                >
                                    <span className="relative">
                                        +1 (555) 123-4567
                                        <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#a36524] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
                                    </span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                        />
                                    </svg>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-[var(--border-color)] pt-8">
                    <p className="text-center text-[var(--page-text-secondary)]">
                        © {new Date().getFullYear()} ArteFACT. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

const BackToTopButton = dynamic(
    () =>
        Promise.resolve(() => {
            const scrollToTop = () => {
                window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });
            };

            const [isVisible, setIsVisible] = useState(false);

            useEffect(() => {
                const handleScroll = () => {
                    const heroSection = document.getElementById("hero");
                    const heroHeight = heroSection?.offsetHeight || 800;

                    if (window.scrollY > heroHeight) {
                        setIsVisible(true);
                    } else {
                        setIsVisible(false);
                    }
                };

                window.addEventListener("scroll", handleScroll);

                handleScroll();

                return () => {
                    window.removeEventListener("scroll", handleScroll);
                };
            }, []);

            return (
                <AnimatePresence>
                    {isVisible && (
                        <motion.button
                            onClick={scrollToTop}
                            className="fixed bottom-5 right-5 z-50 p-3 rounded-full cursor-pointer backdrop-blur-md shadow-lg hover:scale-110 transition-transform duration-300"
                            style={{
                                backgroundColor: "var(--navbar-bg)",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                            }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M12 19V5" />
                                <path d="M5 12l7-7 7 7" />
                            </svg>
                        </motion.button>
                    )}
                </AnimatePresence>
            );
        }),
    { ssr: false }
);

export default function Home() {
    return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <GlobalThemeStyles />
            <main>
                <Navbar />
                <BackToTopButton />
                <HeroSection />
                <AboutUsSection />
                <FeaturesSection />
                <TreasureTroveSection />
                <ArtistsSection />
                <ArtworksSection />
                <Newsletter />
                <Footer />
            </main>
        </ThemeProvider>
    );
}
