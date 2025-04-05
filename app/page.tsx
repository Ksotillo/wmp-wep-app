"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiHome,
    FiUser,
    FiCode,
    FiBriefcase,
    FiBook,
    FiGithub,
    FiLinkedin,
    FiSearch,
    FiLayers,
    FiExternalLink,
    FiTwitter,
    FiFacebook,
    FiCopy,
    FiCheck,
} from "react-icons/fi";
import {
    SiJavascript,
    SiTypescript,
    SiReact,
    SiNextdotjs,
    SiPython,
    SiRust,
    SiGo,
    SiZcool,
    SiAmazon,
    SiGooglecloud,
    SiDocker,
    SiKubernetes,
    SiMongodb,
    SiPostgresql,
    SiTensorflow,
    SiNodedotjs,
    SiExpress,
    SiDjango,
    SiSpring,
    SiGraphql,
    SiMysql,
    SiRedis,
    SiElasticsearch,
    SiWebassembly,
    SiEthereum,
    SiFortran,
} from "react-icons/si";
import { FaJava, FaMicrosoft } from "react-icons/fa";
import { FiServer, FiCpu, FiHardDrive, FiCode as FiCodeIcon } from "react-icons/fi";
import Image from "next/image";


import { Playfair_Display, Montserrat, Raleway, Cormorant_Garamond } from "next/font/google";


const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-playfair",
    display: "swap",
});

const montserrat = Montserrat({
    subsets: ["latin"],
    variable: "--font-montserrat",
    display: "swap",
});

const raleway = Raleway({
    subsets: ["latin"],
    variable: "--font-raleway",
    display: "swap",
});

const cormorant = Cormorant_Garamond({
    subsets: ["latin"],
    variable: "--font-cormorant",
    weight: ["300", "400", "500", "600", "700"],
    display: "swap",
});

const blogPosts = [
    {
        id: 1,
        title: "Understanding React Server Components",
        description: "Exploring the benefits and implementation of React Server Components in modern web applications.",
        date: "March 28, 2024",
        readTime: "5 min read",
    },
    {
        id: 2,
        title: "State Management Patterns",
        description: "A deep dive into different state management approaches and when to use each one.",
        date: "March 25, 2024",
        readTime: "7 min read",
    },
    {
        id: 3,
        title: "Building Accessible Web Apps",
        description: "Best practices and techniques for creating inclusive web applications.",
        date: "March 20, 2024",
        readTime: "4 min read",
    },
    {
        id: 4,
        title: "The Future of JavaScript: What to Expect",
        description: "Exploring upcoming features, trends, and the evolution of JavaScript in the web development ecosystem.",
        date: "March 15, 2024",
        readTime: "6 min read",
    },
    {
        id: 5,
        title: "Optimizing React Performance",
        description: "Strategies and techniques for improving the performance of your React applications through code optimization.",
        date: "March 10, 2024",
        readTime: "8 min read",
    },
    {
        id: 6,
        title: "Design Patterns in Modern Web Development",
        description: "Understanding and implementing effective design patterns to create maintainable and scalable web applications.",
        date: "March 5, 2024",
        readTime: "7 min read",
    },
    {
        id: 7,
        title: "The Art of Clean Code",
        description: "Principles and practices for writing elegant, maintainable, and efficient code in any programming language.",
        date: "February 28, 2024",
        readTime: "5 min read",
    },
    {
        id: 8,
        title: "TypeScript Best Practices in 2024",
        description: "Updated guidelines and recommendations for writing type-safe, reliable TypeScript code in modern projects.",
        date: "February 20, 2024",
        readTime: "6 min read",
    },
];

const aboutMeContent = {
    intro: "Hi there! I'm John Smith, a passionate Full Stack Developer with over 8 years of experience building web applications that solve real-world problems.",
    bio: "After graduating with a Computer Science degree from MIT, I've worked with startups and established companies across the globe. My journey in tech began when I built my first website at 12, and I've been hooked ever since.",
    interests: [
        "Building scalable web applications",
        "Contributing to open-source projects",
        "Exploring new technologies and frameworks",
        "Technical writing and mentoring junior developers",
    ],
    personalLife:
        "When I'm not coding, you'll find me hiking in the mountains, experimenting with photography, or trying out new coffee shops around the city. I believe in maintaining a healthy work-life balance and finding inspiration in everyday experiences.",
    philosophy:
        "I approach every project with curiosity and a commitment to excellence. My philosophy is that great software should be both powerful and intuitive to use.",
    images: [
        {
            src: "https://picsum.photos/id/0/600/400",
            alt: "Coding setup",
            caption: "My workspace where the magic happens",
        },
        {
            src: "https://picsum.photos/id/48/600/400",
            alt: "Tech conference",
            caption: "Speaking at the React Summit 2023",
        },
        {
            src: "https://picsum.photos/id/2/600/400",
            alt: "Laptop with code",
            caption: "Late night coding sessions",
        },
    ],
};

const skillsContent = {
    intro: "With over 15 years of programming experience, I've had the opportunity to work with a diverse range of technologies from modern frameworks to legacy systems.",
    mainSkills: [
        {
            name: "JavaScript",
            icon: <SiJavascript className="text-yellow-400" size={24} />,
            level: 95,
            years: 10,
        },
        {
            name: "TypeScript",
            icon: <SiTypescript className="text-blue-500" size={24} />,
            level: 90,
            years: 7,
        },
        {
            name: "React",
            icon: <SiReact className="text-cyan-400" size={24} />,
            level: 92,
            years: 8,
        },
        {
            name: "Next.js",
            icon: <SiNextdotjs className="text-black dark:text-white" size={24} />,
            level: 88,
            years: 5,
        },
        {
            name: "Python",
            icon: <SiPython className="text-blue-600" size={24} />,
            level: 85,
            years: 9,
        },
        {
            name: "Java",
            icon: <FaJava className="text-red-500" size={24} />,
            level: 80,
            years: 12,
        },
    ],
    backendSkills: [
        {
            name: "Node.js",
            icon: <SiNodedotjs className="text-green-600" size={24} />,
            level: 90,
            years: 9,
        },
        {
            name: "Express",
            icon: <SiExpress className="text-gray-600 dark:text-gray-400" size={24} />,
            level: 88,
            years: 8,
        },
        {
            name: "Django",
            icon: <SiDjango className="text-green-800" size={24} />,
            level: 82,
            years: 6,
        },
        {
            name: "Spring Boot",
            icon: <SiSpring className="text-green-500" size={24} />,
            level: 78,
            years: 7,
        },
        {
            name: "GraphQL",
            icon: <SiGraphql className="text-pink-600" size={24} />,
            level: 85,
            years: 4,
        },
        {
            name: "REST API Design",
            icon: <FiServer className="text-blue-500" size={24} />,
            level: 95,
            years: 10,
        },
    ],
    databaseSkills: [
        {
            name: "MongoDB",
            icon: <SiMongodb className="text-green-500" size={24} />,
            level: 88,
            years: 7,
        },
        {
            name: "PostgreSQL",
            icon: <SiPostgresql className="text-blue-700" size={24} />,
            level: 85,
            years: 9,
        },
        {
            name: "MySQL",
            icon: <SiMysql className="text-blue-500" size={24} />,
            level: 90,
            years: 12,
        },
        {
            name: "Redis",
            icon: <SiRedis className="text-red-600" size={24} />,
            level: 80,
            years: 6,
        },
        {
            name: "Elasticsearch",
            icon: <SiElasticsearch className="text-teal-500" size={24} />,
            level: 75,
            years: 4,
        },
    ],
    cloudSkills: [
        {
            name: "AWS",
            icon: <SiAmazon className="text-orange-400" size={24} />,
            level: 85,
            years: 7,
        },
        {
            name: "Google Cloud",
            icon: <SiGooglecloud className="text-blue-500" size={24} />,
            level: 80,
            years: 5,
        },
        {
            name: "Azure",
            icon: <FaMicrosoft className="text-blue-600" size={24} />,
            level: 75,
            years: 4,
        },
        {
            name: "Docker",
            icon: <SiDocker className="text-blue-400" size={24} />,
            level: 88,
            years: 6,
        },
        {
            name: "Kubernetes",
            icon: <SiKubernetes className="text-blue-500" size={24} />,
            level: 82,
            years: 4,
        },
    ],
    legacyAndSpecializedSkills: [
        {
            name: "COBOL",
            icon: <SiZcool className="text-blue-800" size={24} />,
            level: 70,
            years: 3,
            description: "Maintained banking systems during Y2K transition",
        },
        {
            name: "Fortran",
            icon: <SiFortran className="text-purple-600" size={24} />,
            level: 65,
            years: 2,
            description: "Scientific computing projects at NASA",
        },
        {
            name: "Assembly",
            icon: <FiCpu className="text-gray-700" size={24} />,
            level: 60,
            years: 4,
            description: "Low-level optimization for embedded systems",
        },
        {
            name: "LISP",
            icon: <FiHardDrive className="text-green-700" size={24} />,
            level: 72,
            years: 3,
            description: "AI research projects",
        },
        {
            name: "Ada",
            icon: <FiCodeIcon className="text-blue-700" size={24} />,
            level: 68,
            years: 2,
            description: "Military defense contracting",
        },
    ],
    emergingTechSkills: [
        {
            name: "Rust",
            icon: <SiRust className="text-orange-600" size={24} />,
            level: 78,
            years: 3,
        },
        {
            name: "Go",
            icon: <SiGo className="text-blue-400" size={24} />,
            level: 82,
            years: 4,
        },
        {
            name: "TensorFlow",
            icon: <SiTensorflow className="text-orange-500" size={24} />,
            level: 75,
            years: 3,
        },
        {
            name: "WebAssembly",
            icon: <SiWebassembly className="text-purple-500" size={24} />,
            level: 70,
            years: 2,
        },
        {
            name: "Blockchain/Smart Contracts",
            icon: <SiEthereum className="text-blue-500" size={24} />,
            level: 65,
            years: 2,
        },
    ],
    quote: "Technology is constantly evolving, and I believe in continuous learning. The more languages you know, the more approaches you have to solve complex problems.",
};

const projectsData = [
    {
        id: 1,
        title: "NebulaVerse",
        description:
            "An immersive 3D space exploration game built with Three.js and WebGL. Features procedurally generated galaxies, physics-based spacecraft controls, and multiplayer capabilities.",
        tags: ["Three.js", "WebGL", "JavaScript", "Socket.io", "WebRTC"],
        image: "https://picsum.photos/id/0/800/500",
        demoUrl: "https://nebulaverse.example.com",
        repoUrl: "https://github.com/johnsmith/nebulaverse",
        featured: true,
        achievements: ["100,000+ monthly active users", "Featured on Chrome Experiments", "WebGL Innovation Award 2023"],
    },
    {
        id: 2,
        title: "COBOL-X",
        description:
            "An open-source modernization framework for legacy COBOL systems used by financial institutions. Provides API wrappers, security enhancements, and compatibility layers for integrating decades-old banking systems with modern web services.",
        tags: ["COBOL", "Java", "REST APIs", "Banking", "Legacy Systems"],
        image: "https://picsum.photos/id/2/800/500",
        repoUrl: "https://github.com/johnsmith/cobolx",
        featured: true,
        achievements: ["Adopted by 5 major banks", "Reduced migration costs by 60%", "Featured in Banking Technology Magazine"],
    },
    {
        id: 3,
        title: "StreamForge",
        description:
            "A low-latency streaming library for game developers, with advanced features like adaptive bitrate optimization, peer-to-peer fallback, and integration with major gaming platforms.",
        tags: ["Rust", "WebRTC", "C++", "UDP", "Gaming"],
        image: "https://picsum.photos/id/4/800/500",
        demoUrl: "https://streamforge.dev",
        repoUrl: "https://github.com/johnsmith/streamforge",
        featured: true,
        achievements: ["Used by 200+ indie game studios", "Sub-50ms latency achievement", "10M+ end users"],
    },
    {
        id: 4,
        title: "QuantumLab",
        description:
            "An educational platform for quantum computing simulation, making quantum concepts accessible through interactive visualizations and simplified programming interfaces.",
        tags: ["Python", "Quantum Computing", "WebAssembly", "Education"],
        image: "https://picsum.photos/id/8/800/500",
        demoUrl: "https://quantumlab.io",
        repoUrl: "https://github.com/johnsmith/quantumlab",
    },
    {
        id: 5,
        title: "EcoTrack",
        description:
            "IoT system for environmental monitoring that uses machine learning to predict pollution levels and analyze environmental impact. Deployed in cooperation with environmental agencies.",
        tags: ["IoT", "TensorFlow", "Python", "Time Series Analysis"],
        image: "https://picsum.photos/id/9/800/500",
        demoUrl: "https://ecotrack.earth",
        featured: true,
        achievements: ["Monitoring 150+ urban locations", "Predicted pollution events with 92% accuracy"],
    },
    {
        id: 6,
        title: "RetroRealm",
        description:
            "A virtual reality arcade featuring perfectly emulated vintage games from the 70s, 80s, and 90s. Includes a physics-based environment where players can walk around a period-accurate arcade.",
        tags: ["Unity", "VR", "C#", "Emulation", "3D Modeling"],
        image: "https://picsum.photos/id/3/800/500",
        demoUrl: "https://retrorealm.io",
    },
    {
        id: 7,
        title: "MediChain",
        description:
            "Blockchain-based medical records system ensuring patient data privacy while enabling secure sharing between healthcare providers. Implements zero-knowledge proofs for sensitive information.",
        tags: ["Blockchain", "Ethereum", "Zero-knowledge Proofs", "Healthcare"],
        image: "https://picsum.photos/id/6/800/500",
        repoUrl: "https://github.com/johnsmith/medichain",
        achievements: ["Pilot program with 3 hospitals", "Published security paper at IEEE"],
    },
    {
        id: 8,
        title: "LinguaGen",
        description:
            "An AI-powered language learning platform using computational linguistics to generate personalized learning materials based on user's native language and learning patterns.",
        tags: ["NLP", "Machine Learning", "React", "Python"],
        image: "https://picsum.photos/id/7/800/500",
        demoUrl: "https://linguagen.app",
    },
    {
        id: 9,
        title: "AutoSymphony",
        description:
            "Experimental music composition AI that generates original orchestral arrangements based on emotional input and style preferences. Used in indie film scoring and game development.",
        tags: ["TensorFlow", "Audio Processing", "MIDI", "GANs"],
        image: "https://picsum.photos/id/5/800/500",
        demoUrl: "https://autosymphony.io",
        repoUrl: "https://github.com/johnsmith/autosymphony",
    },
    {
        id: 10,
        title: "Holotecture",
        description:
            "Augmented reality architecture visualization tool that helps architects and clients see building designs at scale in real environments before construction begins.",
        tags: ["AR", "Unity", "BIM Integration", "3D Rendering"],
        image: "https://picsum.photos/id/1/800/500",
        demoUrl: "https://holotecture.build",
    },
];

const portfolioData = {
    experience: [
        {
            company: "TechNova Labs",
            position: "Principal Software Architect",
            period: "2020 - Present",
            description:
                "Leading architecture design for cloud-native applications and mentoring engineering teams. Spearheaded company-wide migration to microservices architecture, reducing deployment time by 70%.",
            technologies: ["React", "Node.js", "AWS", "Kubernetes", "GraphQL"],
            achievements: [
                "Redesigned payment processing system handling $2M daily transactions",
                "Reduced infrastructure costs by 35% through cloud optimization",
                "Established engineering excellence program adopted by 4 departments",
            ],
            logo: "https://picsum.photos/id/28/100/100",
        },
        {
            company: "DataSphere Systems",
            position: "Senior Full Stack Developer",
            period: "2017 - 2020",
            description:
                "Developed enterprise data visualization platform used by Fortune 500 clients. Led team of 6 engineers and collaborated with product managers to deliver key features.",
            technologies: ["Angular", "Python", "PostgreSQL", "Docker", "Azure"],
            achievements: [
                "Built real-time analytics dashboard processing 50M data points daily",
                "Improved application performance by 60% through optimization",
                "Awarded company's 'Innovator of the Year' for AI integration initiative",
            ],
            logo: "https://picsum.photos/id/42/100/100",
        },
        {
            company: "LegacyTech Financial Services",
            position: "Systems Analyst & COBOL Specialist",
            period: "2014 - 2017",
            description:
                "Maintained and modernized critical banking infrastructure during major digital transformation. Created integration layers between legacy systems and modern web services.",
            technologies: ["COBOL", "Java", "Oracle", "RESTful APIs", "JCL"],
            achievements: [
                "Successfully migrated 30-year-old banking system with zero downtime",
                "Implemented secure API gateway for legacy systems",
                "Reduced manual processing time by 80% through automation",
            ],
            logo: "https://picsum.photos/id/60/100/100",
        },
        {
            company: "NASA Jet Propulsion Laboratory",
            position: "Research Software Engineer (Contract)",
            period: "2012 - 2014",
            description:
                "Contributed to mission-critical software for Mars rover operations. Worked with scientific computing teams to optimize data processing pipelines for telemetry analysis.",
            technologies: ["C++", "Python", "FORTRAN", "CUDA", "Scientific Computing"],
            achievements: [
                "Developed image processing algorithms for Mars terrain analysis",
                "Optimized computation-intensive simulations, reducing runtime by 40%",
                "Co-authored research paper on distributed computing for space missions",
            ],
            logo: "https://picsum.photos/id/73/100/100",
        },
    ],
    education: [
        {
            institution: "Massachusetts Institute of Technology",
            degree: "Master of Science in Computer Science",
            period: "2010 - 2012",
            description: "Specialized in distributed systems and machine learning. Teaching assistant for Advanced Algorithms course.",
            thesis: "Distributed Consensus Algorithms for Autonomous Vehicle Coordination",
            logo: "https://picsum.photos/id/15/100/100",
        },
        {
            institution: "Stanford University",
            degree: "Bachelor of Science in Computer Science",
            period: "2006 - 2010",
            description: "Graduated with honors. Active in competitive programming and robotics club.",
            thesis: "Efficient Path Planning Algorithms for Multi-Agent Systems",
            logo: "https://picsum.photos/id/16/100/100",
        },
    ],
    certifications: [
        {
            name: "AWS Solutions Architect Professional",
            issuer: "Amazon Web Services",
            date: "2022",
            logo: "https://picsum.photos/id/119/100/100",
        },
        {
            name: "Google Cloud Professional Architect",
            issuer: "Google",
            date: "2021",
            logo: "https://picsum.photos/id/120/100/100",
        },
        {
            name: "Certified Kubernetes Administrator",
            issuer: "Cloud Native Computing Foundation",
            date: "2020",
            logo: "https://picsum.photos/id/121/100/100",
        },
        {
            name: "Azure DevOps Expert",
            issuer: "Microsoft",
            date: "2019",
            logo: "https://picsum.photos/id/122/100/100",
        },
    ],
    speaking: [
        {
            event: "React Summit 2023",
            topic: "Beyond Hooks: The Future of React State Management",
            location: "Amsterdam, Netherlands",
            date: "June 2023",
            image: "https://picsum.photos/id/139/800/400",
        },
        {
            event: "COBOL Connect Conference",
            topic: "Bridging Decades: Integrating Legacy COBOL with Modern Microservices",
            location: "Chicago, USA",
            date: "March 2023",
            image: "https://picsum.photos/id/140/800/400",
        },
        {
            event: "AWS re:Invent",
            topic: "Serverless at Scale: Lessons from the Trenches",
            location: "Las Vegas, USA",
            date: "November 2022",
            image: "https://picsum.photos/id/141/800/400",
        },
    ],
};


const themeConfig = {
    light: {
        main: {
            background: "bg-gradient-to-br from-white to-[#fef8f3]",
            text: "text-[#1a1a1a]",
            textSecondary: "text-[#444444]",
            hover: "hover:text-[#1a1a1a]",
        },
        sidebar: {
            background: "bg-[#fefcfb]",
            activeBackground: "bg-[#fceee7]",
            hoverBackground: "hover:bg-[#fceee7]/50",
            border: "border-[#e0d5cc]",
        },
        content: {
            background: "bg-white",
            inputBorder: "border-[#e0d5cc]",
            focusRing: "focus:ring-[#fceee7]",
            card: "bg-white shadow-md border-[#e0d5cc]",
            cardHover: "hover:shadow-lg",
        },
        button: {
            primary: "text-[#b85c38] hover:text-[#a04b2b]",
        },
        accent: "text-[#b85c38]",
        heading: "font-playfair",
        subheading: "font-cormorant",
        body: "font-montserrat",
        accent_font: "font-raleway",
    },
    dark: {
        main: {
            background: "bg-[#1a1a1a]",
            text: "text-[#f5f5f5]",
            textSecondary: "text-[#c0c0c0]",
            hover: "hover:text-white",
        },
        sidebar: {
            background: "bg-[#252525]",
            activeBackground: "bg-[#3a3a3a]",
            hoverBackground: "hover:bg-[#333333]",
            border: "border-[#3d3d3d]",
        },
        content: {
            background: "bg-[#2a2a2a]",
            inputBorder: "border-[#3d3d3d]",
            focusRing: "focus:ring-[#4a4a4a]",
            card: "bg-[#2d2d2d] shadow-lg border-[#3d3d3d]",
            cardHover: "hover:shadow-xl",
        },
        button: {
            primary: "text-[#e07a56] hover:text-[#f08c68]",
        },
        accent: "text-[#e07a56]",
        heading: "font-playfair",
        subheading: "font-cormorant",
        body: "font-montserrat",
        accent_font: "font-raleway",
    },
};


export default function Home() {
    const [activeMenu, setActiveMenu] = useState("Home");
    const [searchQuery, setSearchQuery] = useState("");
    const [mounted, setMounted] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [selectedPost, setSelectedPost] = useState<(typeof blogPosts)[0] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");

    const theme = isDarkMode ? themeConfig.dark : themeConfig.light;

    useEffect(() => {
        setMounted(true);

        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            setIsDarkMode(true);
        }
    }, []);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, [activeMenu]);

    const toggleTheme = () => {
        const newTheme = !isDarkMode;
        setIsDarkMode(newTheme);

        localStorage.setItem("theme", newTheme ? "dark" : "light");
    };

    const handleMenuChange = (menuName: string) => {
        setActiveMenu(menuName);
    };

    const menuItems = [
        { name: "Home", icon: <FiHome className="w-5 h-5" /> },
        { name: "About Me", icon: <FiUser className="w-5 h-5" /> },
        { name: "Skills", icon: <FiCode className="w-5 h-5" /> },
        { name: "Projects", icon: <FiLayers className="w-5 h-5" /> },
        { name: "Portfolio", icon: <FiBriefcase className="w-5 h-5" /> },
        { name: "Blog Posts", icon: <FiBook className="w-5 h-5" /> },
    ];

    const filteredPosts = blogPosts.filter(
        (post) =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    type SkillBarProps = {
        name: string;
        level: number;
        years: number;
        icon?: React.ReactNode;
        description?: string;
    };

    const SkillBar = ({ name, level, years, icon, description }: SkillBarProps) => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
            <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                    {icon && <span>{icon}</span>}
                    <span className={`font-medium ${theme.main.text} ${theme.body}`}>{name}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className={`text-sm ${theme.accent} ${theme.body}`}>
                        {years} {years === 1 ? "year" : "years"}
                    </span>
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className={`text-sm ${theme.main.textSecondary} ${theme.body}`}
                    >
                        {level}%
                    </motion.span>
                </div>
            </div>
            <div className={`w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden`}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${level}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                    className="h-full bg-gradient-to-r from-[#b85c38] to-[#e8956c] rounded-full"
                ></motion.div>
            </div>
            {description && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className={`text-xs ${theme.main.textSecondary} ${theme.body} mt-1 italic`}
                >
                    {description}
                </motion.p>
            )}
        </motion.div>
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut",
            },
        },
    };

    const copyToClipboard = (postId: number) => {
        
        const baseUrl = window.location.origin;
        const shareUrl = `${baseUrl}/blog/${postId}`;
        
        
        navigator.clipboard.writeText(shareUrl)
            .then(() => {
                setNotificationMessage("Link copied to clipboard!");
                setShowNotification(true);
                
                
                setTimeout(() => {
                    setShowNotification(false);
                }, 3000);
            })
            .catch(() => {
                setNotificationMessage("Failed to copy link");
                setShowNotification(true);
                
                
                setTimeout(() => {
                    setShowNotification(false);
                }, 3000);
            });
    };

    if (!mounted) {
        return <div className="min-h-screen bg-[#fefcfb]"></div>;
    }

    
    
    const renderContent = () => {
        switch (activeMenu) {
            case "Home":
                return (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl pt-6">
                        

                        <motion.section
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="mb-16"
                        >
                            <div className="flex flex-col md:flex-row gap-8 items-center">
                                <motion.div
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    className="md:w-1/2"
                                >
                                    <motion.h1 
                                        className={`text-4xl font-bold ${theme.main.text} ${theme.heading} mb-4 relative`}
                                        whileHover={{ 
                                            scale: 1.03,
                                            transition: { duration: 0.2 }
                                        }}
                                    >
                                        <span className="hover:bg-gradient-to-r from-[#b85c38] to-[#e8956c] hover:text-transparent hover:bg-clip-text transition-all duration-300">
                                            John Smith
                                        </span>
                                    </motion.h1>
                                    <h2 className={`text-2xl ${theme.accent} mb-6 ${theme.subheading} font-semibold`}>
                                        Full Stack Developer & <span className="line-through">Problem Solver</span> Problem Creator
                                    </h2>
                                    <p className={`${theme.main.textSecondary} ${theme.body} text-lg mb-6`}>{aboutMeContent.intro}</p>
                                    <div className="flex space-x-4">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleMenuChange("Projects")}
                                            className={`px-6 py-3 rounded-lg bg-[#b85c38] text-white font-medium hover:bg-[#a04b2b] transition-colors cursor-pointer ${theme.accent_font}`}
                                        >
                                            View Projects
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleMenuChange("Portfolio")}
                                            className={`px-6 py-3 rounded-lg border border-[#b85c38] ${theme.accent} font-medium hover:bg-[#fceee7]/50 transition-colors cursor-pointer ${theme.accent_font}`}
                                        >
                                            My Experience
                                        </motion.button>
                                    </div>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    className="md:w-1/2"
                                >
                                    <div className="relative">
                                        <div className="relative h-[400px] w-full rounded-2xl overflow-hidden">
                                            <Image
                                                src="https://picsum.photos/id/1/800/800"
                                                alt="John Smith"
                                                fill
                                                className="object-cover"
                                                priority
                                            />
                                        </div>
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.6 }}
                                            className={`absolute -bottom-6 -left-6 p-4 ${theme.content.background} rounded-xl shadow-lg`}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <FiCode className={`w-6 h-6 ${theme.accent}`} />
                                                <span className={`font-bold ${theme.main.text} ${theme.subheading}`}>15+ Years Coding</span>
                                            </div>
                                        </motion.div>
                                        <motion.div
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.6 }}
                                            className={`absolute -top-6 -right-6 p-4 ${theme.content.background} rounded-xl shadow-lg`}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <FiBriefcase className={`w-6 h-6 ${theme.accent}`} />
                                                <span className={`font-bold ${theme.main.text} ${theme.subheading}`}>10+ Projects</span>
                                            </div>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.section>

                        <motion.section variants={containerVariants} initial="hidden" animate="visible" className="mb-16">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {[
                                    { value: "15+", label: "Years of Experience" },
                                    { value: "50+", label: "Completed Projects" },
                                    { value: "24/7", label: "Development Support" },
                                    { value: "99%", label: "Client Satisfaction" },
                                ].map((stat, index) => (
                                    <motion.div
                                        key={index}
                                        variants={itemVariants}
                                        whileHover={{ y: -5 }}
                                        className={`${theme.content.card} border rounded-lg p-6 flex flex-col items-center justify-center transition-all duration-300`}
                                    >
                                        <span className={`text-4xl font-bold ${theme.accent} ${theme.heading} mb-2`}>{stat.value}</span>
                                        <span className={`${theme.main.textSecondary} ${theme.body} text-center`}>{stat.label}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.section>

                        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mb-16">
                            
                            <div className="mb-8">
                                <h2 className={`text-2xl font-bold ${theme.main.text} ${theme.heading} mb-2`}>About Me</h2>
                                <div className="w-20 h-1 bg-[#b85c38] mb-6"></div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-8">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="md:w-1/2"
                                >
                                    <p className={`${theme.main.textSecondary} ${theme.body} mb-4`}>{aboutMeContent.bio}</p>
                                    <p className={`${theme.main.textSecondary} ${theme.body} mb-6`}>{aboutMeContent.personalLife}</p>
                                    <motion.button
                                        whileHover={{ scale: 1.05, x: 5 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleMenuChange("About Me")}
                                        className={`px-4 py-2 rounded-lg ${theme.button.primary} font-medium flex items-center cursor-pointer`}
                                    >
                                        <span>Learn More</span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 ml-2"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                                            />
                                        </svg>
                                    </motion.button>
                                </motion.div>

                                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="md:w-1/2">
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            {
                                                icon: <FiCode className={`w-8 h-8 ${theme.accent} mb-3`} />,
                                                title: "Web Development",
                                                desc: "Crafting responsive and performant web applications using modern frameworks.",
                                            },
                                            {
                                                icon: <FiLayers className={`w-8 h-8 ${theme.accent} mb-3`} />,
                                                title: "Legacy System Integration",
                                                desc: "Bridging old and new technologies with secure, efficient solutions.",
                                            },
                                            {
                                                icon: <FiSearch className={`w-8 h-8 ${theme.accent} mb-3`} />,
                                                title: "Technical Consulting",
                                                desc: "Expert guidance on architecture, technology selection, and best practices.",
                                            },
                                            {
                                                icon: <FiUser className={`w-8 h-8 ${theme.accent} mb-3`} />,
                                                title: "Developer Training",
                                                desc: "Mentorship and technical training for teams transitioning to new technologies.",
                                            },
                                        ].map((service, index) => (
                                            <motion.div
                                                key={index}
                                                variants={itemVariants}
                                                whileHover={{ y: -5 }}
                                                className={`${theme.content.card} border rounded-lg p-6 transition-all duration-300`}
                                            >
                                                {service.icon}
                                                
                                                <h3 className={`text-lg font-semibold ${theme.main.text} ${theme.subheading} mb-2`}>
                                                    {service.title}
                                                </h3>
                                                <p className={`${theme.main.textSecondary} ${theme.body} text-sm`}>{service.desc}</p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>
                        </motion.section>

                        

                        <section className="mb-16">
                            
                            <div className="mb-8">
                                <h2 className={`text-2xl font-bold ${theme.main.text} ${theme.heading} mb-2`}>Skills Overview</h2>
                                <div className="w-20 h-1 bg-[#b85c38] mb-6"></div>
                            </div>

                            <div
                                className={`${theme.content.card} border rounded-lg p-8 ${theme.content.cardHover} transition-all duration-300`}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {skillsContent.mainSkills.slice(0, 3).map((skill, index) => (
                                        <SkillBar key={index} {...skill} />
                                    ))}
                                    {skillsContent.backendSkills.slice(0, 1).map((skill, index) => (
                                        <SkillBar key={index} {...skill} />
                                    ))}
                                    {skillsContent.cloudSkills.slice(0, 1).map((skill, index) => (
                                        <SkillBar key={index} {...skill} />
                                    ))}
                                    {skillsContent.legacyAndSpecializedSkills.slice(0, 1).map((skill, index) => (
                                        <SkillBar key={index} {...skill} />
                                    ))}
                                </div>

                                <div className="mt-8 text-center">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleMenuChange("Skills")}
                                        className={`px-4 py-2 rounded-lg ${theme.button.primary} font-medium inline-flex items-center cursor-pointer`}
                                    >
                                        <span>View All Skills</span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 ml-2"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                                            />
                                        </svg>
                                    </motion.button>
                                </div>
                            </div>
                        </section>

                        <section className="mb-16">
                            
                            <div className="mb-8">
                                <h2 className={`text-2xl font-bold ${theme.main.text} ${theme.heading} mb-2`}>Featured Projects</h2>
                                <div className="w-20 h-1 bg-[#b85c38] mb-6"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {projectsData
                                    .filter((p) => p.featured)
                                    .slice(0, 2)
                                    .map((project) => (
                                        <motion.div
                                            key={project.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            whileHover={{
                                                scale: 1.02,
                                                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                                                transition: { duration: 0.2 },
                                            }}
                                            className={`${theme.content.background} border ${theme.content.inputBorder} rounded-lg overflow-hidden group`}
                                        >
                                            <div className="relative h-64">
                                                <Image
                                                    src={project.image || "/placeholder.svg"}
                                                    alt={project.title}
                                                    fill
                                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                                                    <div className="p-6">
                                                        <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                                                        <div className="flex flex-wrap gap-2 mb-3">
                                                            {project.tags.slice(0, 3).map((tag, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className="text-xs px-2 py-1 bg-white/20 text-white rounded-full"
                                                                >
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                            </div>

                            <div className="mt-8 text-center">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleMenuChange("Projects")}
                                    className={`px-4 py-2 rounded-lg ${theme.button.primary} font-medium inline-flex items-center cursor-pointer`}
                                >
                                    <span>View All Projects</span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 ml-2"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </motion.button>
                            </div>
                        </section>

                        <section>
                            
                            <div className="mb-8">
                                <h2 className={`text-2xl font-bold ${theme.main.text} ${theme.heading} mb-2`}>Recent Blog Posts</h2>
                                <div className="w-20 h-1 bg-[#b85c38] mb-6"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {blogPosts.slice(0, 2).map((post) => (
                                    <div
                                        key={post.id}
                                        className={`${theme.content.card} border rounded-lg p-6 ${theme.content.cardHover} transition-all duration-300`}
                                    >
                                        
                                        <div className={`${theme.accent} text-xs mb-2 font-medium ${theme.accent_font}`}>
                                            {post.date} • {post.readTime}
                                        </div>
                                        <h3 className={`text-xl font-semibold ${theme.main.text} ${theme.heading} mb-2`}>{post.title}</h3>
                                        <p className={`${theme.main.textSecondary} ${theme.body} mb-4`}>{post.description}</p>
                                        <div className="flex justify-end">
                                            <motion.button
                                                whileHover={{ scale: 1.05, x: 5 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => {
                                                    setSelectedPost(post);
                                                    setIsModalOpen(true);
                                                }}
                                                className={`${theme.button.primary} font-medium transition-colors flex items-center space-x-1 cursor-pointer`}
                                            >
                                                <span>Read more</span>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-4 w-4 ml-1"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                                                    />
                                                </svg>
                                            </motion.button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 text-center">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleMenuChange("Blog Posts")}
                                    className={`px-4 py-2 rounded-lg ${theme.button.primary} font-medium inline-flex items-center cursor-pointer`}
                                >
                                    <span>View All Posts</span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 ml-2"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </motion.button>
                            </div>
                        </section>
                    </motion.div>
                );

            case "About Me":
                return (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl">
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`text-3xl font-bold ${theme.main.text} ${theme.heading} mb-6`}
                        >
                            About Me
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className={`${theme.content.card} border rounded-lg p-6 mb-8 ${theme.content.cardHover} transition-all duration-300`}
                        >
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className={`${theme.main.text} ${theme.body} mb-4 text-lg`}
                            >
                                {aboutMeContent.intro}
                            </motion.p>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className={`${theme.main.textSecondary} ${theme.body} mb-6`}
                            >
                                {aboutMeContent.bio}
                            </motion.p>

                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
                            >
                                {aboutMeContent.images.map((image, index) => (
                                    <motion.div
                                        key={index}
                                        variants={itemVariants}
                                        whileHover={{ y: -5, scale: 1.03 }}
                                        className="flex flex-col space-y-2"
                                    >
                                        <div className="relative h-48 rounded-lg overflow-hidden">
                                            <Image
                                                src={image.src || "/placeholder.svg"}
                                                alt={image.alt}
                                                fill
                                                className="object-cover transition-transform duration-300 hover:scale-110"
                                            />
                                        </div>
                                        <p className={`text-sm ${theme.main.textSecondary} ${theme.body} italic`}>{image.caption}</p>
                                    </motion.div>
                                ))}
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className={`text-xl font-semibold ${theme.main.text} ${theme.heading} mb-3`}
                            >
                                What I'm interested in
                            </motion.h2>
                            <motion.ul variants={containerVariants} initial="hidden" animate="visible" className="list-disc pl-5 mb-6">
                                {aboutMeContent.interests.map((interest, index) => (
                                    <motion.li
                                        key={index}
                                        variants={itemVariants}
                                        className={`${theme.main.textSecondary} ${theme.body} mb-1`}
                                    >
                                        {interest}
                                    </motion.li>
                                ))}
                            </motion.ul>

                            <motion.h2
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                className={`text-xl font-semibold ${theme.main.text} ${theme.heading} mb-3`}
                            >
                                Outside of work
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className={`${theme.main.textSecondary} ${theme.body} mb-4`}
                            >
                                {aboutMeContent.personalLife}
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.7, duration: 0.5 }}
                                className="border-t border-b py-4 my-6 border-opacity-10 border-current"
                            >
                                <p className={`${theme.main.text} ${theme.body} text-center italic`}>"{aboutMeContent.philosophy}"</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8, duration: 0.7 }}
                                className="flex justify-center"
                            >
                                <div className="relative h-60 w-full rounded-lg overflow-hidden">
                                    <Image
                                        src="https://picsum.photos/id/0/1200/400"
                                        alt="Panorama shot of my workspace"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                );

            case "Skills":
                return (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl">
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`text-3xl font-bold ${theme.main.text} ${theme.heading} mb-6`}
                        >
                            Technical Skills
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className={`${theme.content.background} p-6 rounded-lg border ${theme.content.inputBorder} mb-8`}
                        >
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className={`${theme.main.text} ${theme.body} mb-6 text-lg`}
                            >
                                {skillsContent.intro}
                            </motion.p>

                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mb-8">
                                <motion.h2
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className={`text-xl font-semibold ${theme.main.text} ${theme.heading} mb-4 flex items-center`}
                                >
                                    <motion.div
                                        initial={{ rotate: -90 }}
                                        animate={{ rotate: 0 }}
                                        transition={{ delay: 0.4, duration: 0.5 }}
                                    >
                                        <FiCode className="mr-2" />
                                    </motion.div>
                                    Primary Languages & Frameworks
                                </motion.h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                                    {skillsContent.mainSkills.map((skill, index) => (
                                        <SkillBar key={index} {...skill} />
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mb-8">
                                <motion.h2
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className={`text-xl font-semibold ${theme.main.text} ${theme.heading} mb-4`}
                                >
                                    Backend Development
                                </motion.h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                                    {skillsContent.backendSkills.map((skill, index) => (
                                        <SkillBar key={index} {...skill} />
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mb-8">
                                <motion.h2
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className={`text-xl font-semibold ${theme.main.text} ${theme.heading} mb-4`}
                                >
                                    Database Technologies
                                </motion.h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                                    {skillsContent.databaseSkills.map((skill, index) => (
                                        <SkillBar key={index} {...skill} />
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mb-8">
                                <motion.h2
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className={`text-xl font-semibold ${theme.main.text} ${theme.heading} mb-4`}
                                >
                                    Cloud & DevOps
                                </motion.h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                                    {skillsContent.cloudSkills.map((skill, index) => (
                                        <SkillBar key={index} {...skill} />
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mb-8">
                                <motion.h2
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className={`text-xl font-semibold ${theme.main.text} ${theme.heading} mb-4 flex items-center`}
                                >
                                    <motion.span
                                        initial={{ scale: 0.7 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.7, duration: 0.5, type: "spring" }}
                                        className={theme.accent}
                                    >
                                        Legacy & Specialized Systems
                                    </motion.span>
                                </motion.h2>
                                <div className="grid grid-cols-1 gap-x-8">
                                    {skillsContent.legacyAndSpecializedSkills.map((skill, index) => (
                                        <SkillBar key={index} {...skill} />
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mb-8">
                                <motion.h2
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.7 }}
                                    className={`text-xl font-semibold ${theme.main.text} ${theme.heading} mb-4`}
                                >
                                    Emerging Technologies
                                </motion.h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                                    {skillsContent.emergingTechSkills.map((skill, index) => (
                                        <SkillBar key={index} {...skill} />
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.9, duration: 0.5 }}
                                className="border-t border-b py-4 my-6 border-opacity-10 border-current"
                            >
                                <p className={`${theme.main.text} ${theme.body} text-center italic`}>"{skillsContent.quote}"</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1, duration: 0.7 }}
                                whileHover={{ scale: 1.02 }}
                                className="relative h-60 w-full rounded-lg overflow-hidden"
                            >
                                <Image
                                    src="https://picsum.photos/id/2/1200/400"
                                    alt="Workstation with multiple screens"
                                    fill
                                    className="object-cover"
                                />
                            </motion.div>
                        </motion.div>
                    </motion.div>
                );

            case "Projects":
                return (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl">
                        <h1 className={`text-3xl font-bold ${theme.main.text} ${theme.heading} mb-6`}>Projects</h1>

                        <div className="mb-8">
                            <p className={`${theme.main.text} ${theme.body} text-lg max-w-3xl`}>
                                A collection of my most significant projects spanning from game development and legacy systems to
                                cutting-edge AI and blockchain applications.
                            </p>
                        </div>

                        <div className="mb-12">
                            <h2 className={`text-2xl font-semibold ${theme.main.text} ${theme.heading} mb-6`}>Featured Projects</h2>
                            <div className="grid grid-cols-1 gap-8">
                                {projectsData
                                    .filter((p) => p.featured)
                                    .map((project) => (
                                        <motion.div
                                            key={project.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            whileHover={{
                                                scale: 1.02,
                                                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                                                transition: { duration: 0.2 },
                                            }}
                                            className={`${theme.content.card} border rounded-lg overflow-hidden ${theme.content.cardHover} transition-all duration-300`}
                                        >
                                            <div className="md:flex">
                                                <div className="md:w-2/5 relative h-64 md:h-auto">
                                                    <Image
                                                        src={project.image || "/placeholder.svg"}
                                                        alt={project.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="p-6 md:w-3/5">
                                                    <h3 className={`text-xl font-bold ${theme.main.text} ${theme.heading} mb-2`}>
                                                        {project.title}
                                                    </h3>
                                                    <p className={`${theme.main.textSecondary} ${theme.body} mb-4`}>
                                                        {project.description}
                                                    </p>

                                                    {project.achievements && (
                                                        <div className="mb-4">
                                                            <h4 className={`text-sm font-semibold ${theme.accent} ${theme.heading} mb-2`}>
                                                                Achievements:
                                                            </h4>
                                                            <ul
                                                                className={`list-disc list-inside ${theme.main.textSecondary} ${theme.body}`}
                                                            >
                                                                {project.achievements.map((achievement, idx) => (
                                                                    <li key={idx}>{achievement}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}

                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        {project.tags.map((tag, idx) => (
                                                            <span
                                                                key={idx}
                                                                className={`text-xs px-2 py-1 rounded-full ${theme.sidebar.activeBackground} ${theme.main.text}`}
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>

                                                    <div className="flexex space-x-4 mt-4">
                                                        {project.demoUrl && (
                                                            <a
                                                                href={project.demoUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className={`${theme.button.primary} text-sm font-medium flex items-center`}
                                                            >
                                                                <span>Live Demo</span>
                                                                <FiExternalLink className="ml-1 w-4 h-4" />
                                                            </a>
                                                        )}
                                                        {project.repoUrl && (
                                                            <a
                                                                href={project.repoUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className={`${theme.main.textSecondary} hover:${theme.main.text} text-sm font-medium flex items-center`}
                                                            >
                                                                <FiGithub className="mr-1 w-4 h-4" />
                                                                <span>Source Code</span>
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                            </div>
                        </div>

                        <div>
                            <h2 className={`text-2xl font-semibold ${theme.main.text} ${theme.heading} mb-6`}>Other Notable Projects</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {projectsData
                                    .filter((p) => !p.featured)
                                    .map((project, index) => (
                                        <motion.div
                                            key={project.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            whileHover={{
                                                y: -10,
                                                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                                            }}
                                            className="transform transition-all duration-300 your-card-class"
                                        >
                                            <div className="relative overflow-hidden">
                                                <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.6 }}>
                                                    <Image
                                                        src={project.image || "/placeholder.svg"}
                                                        alt={project.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </motion.div>

                                                
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    whileHover={{ opacity: 1 }}
                                                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
                                                >
                                                    <div className="flex items-center justify-center h-full opacity-0 hover:opacity-100 transition-opacity duration-300">
                                                        <div className="flex space-x-3">
                                                            <motion.a
                                                                href={project.demoUrl}
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                className="bg-white/90 text-black px-3 py-2 rounded-lg font-medium text-sm flex items-center"
                                                            >
                                                                <span>Live Demo</span>
                                                                <FiExternalLink className="ml-1 w-4 h-4" />
                                                            </motion.a>
                                                            {project.repoUrl && (
                                                                <a
                                                                    href={project.repoUrl}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className={`${theme.main.textSecondary} hover:${theme.main.text} text-sm font-medium flex items-center`}
                                                                >
                                                                    <FiGithub className="mr-1 w-4 h-4" />
                                                                    <span>Source Code</span>
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            </div>
                                            <div className="p-5">
                                                <h3 className={`text-lg font-bold ${theme.main.text} ${theme.heading} mb-2`}>
                                                    {project.title}
                                                </h3>
                                                <p className={`${theme.main.textSecondary} ${theme.body} text-sm mb-3`}>
                                                    {project.description}
                                                </p>

                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {project.tags.slice(0, 3).map((tag, idx) => (
                                                        <span
                                                            key={idx}
                                                            className={`text-xs px-2 py-1 rounded-full ${theme.sidebar.activeBackground} ${theme.main.text}`}
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                    {project.tags.length > 3 && (
                                                        <span
                                                            className={`text-xs px-2 py-1 rounded-full ${theme.sidebar.activeBackground} ${theme.main.textSecondary}`}
                                                        >
                                                            +{project.tags.length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                            </div>
                        </div>
                    </motion.div>
                );

            case "Portfolio":
                return (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl">
                        <h1 className={`text-3xl font-bold ${theme.main.text} ${theme.heading} mb-6`}>Professional Portfolio</h1>

                        <section className="mb-12">
                            <h2 className={`text-2xl font-semibold ${theme.main.text} ${theme.heading} mb-6 flex items-center`}>
                                <FiBriefcase className="mr-2" /> Work Experience
                            </h2>

                            <div className="space-y-8">
                                {portfolioData.experience.map((job, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`${theme.content.background} border ${theme.content.inputBorder} rounded-lg overflow-hidden`}
                                    >
                                        <div className="md:flex">
                                            <div className="p-6 md:w-full">
                                                <div className="flex flex-col md:flex-row md:items-center mb-4">
                                                    <div className="flex items-center mb-3 md:mb-0">
                                                        <div className="mr-4 relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                            <Image
                                                                src={job.logo || "/placeholder.svg"}
                                                                alt={`${job.company} logo`}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <div>
                                                            <h3 className={`text-xl font-bold ${theme.main.text} ${theme.heading}`}>
                                                                {job.position}
                                                            </h3>
                                                            <div className="flex items-center">
                                                                <span className={`font-medium ${theme.accent} ${theme.heading}`}>
                                                                    {job.company}
                                                                </span>
                                                                <span className={`mx-2 text-xs ${theme.main.textSecondary} ${theme.body}`}>
                                                                    •
                                                                </span>
                                                                <span className={`text-sm ${theme.main.textSecondary} ${theme.body}`}>
                                                                    {job.period}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <p className={`${theme.main.textSecondary} ${theme.body} mb-4`}>{job.description}</p>

                                                <div className="mb-4">
                                                    <h4 className={`text-sm font-semibold ${theme.accent} ${theme.heading} mb-2`}>
                                                        Key Achievements:
                                                    </h4>
                                                    <ul className={`list-disc list-inside ${theme.main.textSecondary} ${theme.body}`}>
                                                        {job.achievements.map((achievement, idx) => (
                                                            <li key={idx} className="mb-1">
                                                                {achievement}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div>
                                                    <h4 className={`text-sm font-semibold ${theme.main.text} ${theme.heading} mb-2`}>
                                                        Technologies:
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {job.technologies.map((tech, idx) => (
                                                            <span
                                                                key={idx}
                                                                className={`text-xs px-2 py-1 rounded-full ${theme.sidebar.activeBackground} ${theme.main.text}`}
                                                            >
                                                                {tech}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </section>

                        <section className="mb-12">
                            <h2 className={`text-2xl font-semibold ${theme.main.text} ${theme.heading} mb-6 flex items-center`}>
                                <FiUser className="mr-2" /> Education
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {portfolioData.education.map((edu, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`${theme.content.background} border ${theme.content.inputBorder} rounded-lg p-6`}
                                    >
                                        <div className="flex items-center mb-3">
                                            <div className="mr-3 relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                <Image
                                                    src={edu.logo || "/placeholder.svg"}
                                                    alt={`${edu.institution} logo`}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h3 className={`text-lg font-bold ${theme.main.text} ${theme.heading}`}>
                                                    {edu.institution}
                                                </h3>
                                                <span className={`text-sm ${theme.main.textSecondary} ${theme.body}`}>{edu.period}</span>
                                            </div>
                                        </div>

                                        <div className={`font-medium ${theme.accent} ${theme.heading} mb-2`}>{edu.degree}</div>
                                        <p className={`${theme.main.textSecondary} ${theme.body} text-sm mb-3`}>{edu.description}</p>

                                        {edu.thesis && (
                                            <div className="mt-2">
                                                <span className={`text-sm font-medium ${theme.main.text} ${theme.heading}`}>Thesis: </span>
                                                <span className={`text-sm italic ${theme.main.textSecondary} ${theme.body}`}>
                                                    {edu.thesis}
                                                </span>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </section>

                        <section className="mb-12">
                            <h2 className={`text-2xl font-semibold ${theme.main.text} ${theme.heading} mb-6 flex items-center`}>
                                <FiCode className="mr-2" /> Professional Certifications
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {portfolioData.certifications.map((cert, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className={`${theme.content.background} border ${theme.content.inputBorder} rounded-lg p-4 flex items-center`}
                                    >
                                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 mr-4">
                                            <Image
                                                src={cert.logo || "/placeholder.svg"}
                                                alt={`${cert.name} logo`}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h3 className={`font-bold ${theme.main.text} ${theme.heading}`}>{cert.name}</h3>
                                            <div className="flex items-center">
                                                <span className={`text-sm ${theme.main.textSecondary} ${theme.body}`}>{cert.issuer}</span>
                                                <span className={`mx-2 text-xs ${theme.main.textSecondary} ${theme.body}`}>•</span>
                                                <span className={`text-sm ${theme.accent} ${theme.heading}`}>{cert.date}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className={`text-2xl font-semibold ${theme.main.text} ${theme.heading} mb-6 flex items-center`}>
                                <FiLayers className="mr-2" /> Speaking Engagements
                            </h2>

                            <div className="space-y-6">
                                {portfolioData.speaking.map((talk, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`${theme.content.background} border ${theme.content.inputBorder} rounded-lg overflow-hidden`}
                                    >
                                        <div className="relative h-48 w-full overflow-hidden">
                                            <Image
                                                src={talk.image || "/placeholder.svg"}
                                                alt={talk.event}
                                                fill
                                                className="object-cover transition-transform duration-300 hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                                                <div className="p-6 text-white">
                                                    <div className="text-sm mb-1">
                                                        {talk.date} • {talk.location}
                                                    </div>
                                                    <h3 className="text-xl font-bold mb-1">{talk.event}</h3>
                                                    <p className="text-white/90 font-medium">{talk.topic}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    </motion.div>
                );

            case "Blog Posts":
                return (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
                        <h1 className={`text-3xl font-bold ${theme.main.text} ${theme.heading} mb-6`}>Blog Posts</h1>

                        <div className="mb-8">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search blog posts..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={`w-full px-4 py-2 pl-10 rounded-lg border ${theme.content.inputBorder} ${theme.content.background} ${theme.main.text} ${theme.body} focus:outline-none focus:ring-2 ${theme.content.focusRing}`}
                                />
                                <FiSearch
                                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.main.textSecondary} w-4 h-4`}
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            {filteredPosts.map((post) => (
                                <motion.article
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`${theme.content.card} border rounded-lg p-6 ${theme.content.cardHover} transition-all duration-300`}
                                >
                                    <div className={`${theme.accent} text-xs mb-2 font-medium ${theme.body}`}>
                                        {post.date} • {post.readTime}
                                    </div>
                                    <h2 className={`text-xl font-semibold ${theme.main.text} ${theme.heading} mb-2`}>{post.title}</h2>
                                    <p className={`${theme.main.textSecondary} ${theme.body} mb-4`}>{post.description}</p>
                                    <div className="flex justify-end">
                                        <motion.button
                                            whileHover={{ scale: 1.05, x: 5 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => {
                                                setSelectedPost(post);
                                                setIsModalOpen(true);
                                            }}
                                            className={`${theme.button.primary} font-medium transition-colors cursor-pointer flex items-center space-x-1`}
                                        >
                                            <span>Read more</span>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                                                />
                                            </svg>
                                        </motion.button>
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    </motion.div>
                );

            default:
                return (
                    <div className="flex items-center justify-center h-[80vh]">
                        <p className={`text-xl ${theme.main.textSecondary} ${theme.body}`}>This section is coming soon...</p>
                    </div>
                );
        }
    };

    return (
        <div
            className={`flex min-h-screen ${theme.main.background} ${playfair.variable} ${montserrat.variable} ${raleway.variable} ${cormorant.variable}`}
        >
            <motion.aside
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className={`w-[240px] ${theme.sidebar.background} fixed h-screen border-r ${theme.sidebar.border} py-8 shadow-md`}
            >
                <div className="px-6 mb-8">
                    <div className="flex items-center space-x-3 mb-3">
                        <motion.div 
                            className="relative w-12 h-12 rounded-full overflow-hidden shadow-md"
                            whileHover={{ 
                                boxShadow: "0 0 15px rgba(184, 92, 56, 0.7)",
                                scale: 1.05,
                                transition: { duration: 0.3 }
                            }}
                        >
                            <Image src="https://picsum.photos/id/1/400/400" alt="Profile picture" fill className="object-cover" />
                        </motion.div>
                        <div>
                            <motion.h1 
                                className={`text-xl font-bold ${theme.main.text} ${theme.heading} relative`}
                                whileHover={{ 
                                    scale: 1.03,
                                    transition: { duration: 0.2 }
                                }}
                            >
                                <span className="hover:bg-gradient-to-r from-[#b85c38] to-[#e8956c] hover:text-transparent hover:bg-clip-text transition-all duration-300">
                                    John Smith
                                </span>
                            </motion.h1>
                            <p className={`text-sm ${theme.main.textSecondary} ${theme.body}`}>Full Stack Developer</p>
                        </div>
                    </div>
                    <div className="flex space-x-3 mt-4">
                        <motion.a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${theme.main.textSecondary} transition-colors cursor-pointer`}
                            whileHover={{ 
                                color: isDarkMode ? "#e07a56" : "#b85c38",
                                scale: 1.2,
                                transition: { duration: 0.2 } 
                            }}
                        >
                            <FiGithub size={20} />
                        </motion.a>
                        <motion.a
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${theme.main.textSecondary} transition-colors cursor-pointer`}
                            whileHover={{ 
                                color: isDarkMode ? "#e07a56" : "#b85c38",
                                scale: 1.2,
                                transition: { duration: 0.2 } 
                            }}
                        >
                            <FiLinkedin size={20} />
                        </motion.a>
                    </div>
                </div>
                <nav className="px-4">
                    {menuItems.map((item) => (
                        <motion.button
                            key={item.name}
                            whileHover={{ x: 5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleMenuChange(item.name)}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors mb-1 cursor-pointer ${
                                theme.body
                            } ${
                                activeMenu === item.name
                                    ? `${theme.sidebar.activeBackground} ${theme.main.text} font-medium`
                                    : `${theme.main.textSecondary} ${theme.sidebar.hoverBackground}`
                            }`}
                        >
                            {item.icon}
                            <span className="text-sm">{item.name}</span>
                        </motion.button>
                    ))}
                </nav>
                <div className="absolute bottom-8 left-0 right-0 px-6">
                    <motion.div
                        className={`relative h-10 w-full rounded-full overflow-hidden cursor-pointer transition-colors duration-500 ${
                            isDarkMode ? "bg-[#2a2a2a]" : "bg-[#fceee7]"
                        } border ${isDarkMode ? "border-[#3d3d3d]" : "border-[#e0d5cc]"}`}
                        onClick={toggleTheme}
                    >
                        
                        <motion.div
                            className="absolute inset-0 z-10"
                            initial={{ opacity: isDarkMode ? 1 : 0 }}
                            animate={{ opacity: isDarkMode ? 1 : 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {[...Array(12)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute rounded-full bg-[#e07a56]"
                                    style={{
                                        width: Math.random() * 2 + 1 + "px",
                                        height: Math.random() * 2 + 1 + "px",
                                        top: Math.random() * 100 + "%",
                                        left: Math.random() * 100 + "%",
                                    }}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: isDarkMode ? [0, 1, 0.5, 1] : 0 }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: isDarkMode ? Infinity : 0,
                                        repeatType: "reverse",
                                        delay: Math.random() * 3,
                                    }}
                                />
                            ))}
                        </motion.div>

                        
                        <motion.div
                            className={`absolute top-1/2 ${isDarkMode ? "right-2" : "left-2"} transform -translate-y-1/2 h-7 w-7 rounded-full flex items-center justify-center z-20`}
                            initial={false}
                            animate={{
                                backgroundColor: isDarkMode ? "#e07a56" : "#b85c38",
                                left: isDarkMode ? "auto" : "8px",
                                right: isDarkMode ? "8px" : "auto",
                            }}
                            transition={{ duration: 0.5 }}
                        >
                            
                            {isDarkMode ? (
                                
                                <>
                                    <motion.div
                                        className="absolute rounded-full bg-[#f08c68] w-1.5 h-1.5"
                                        style={{ top: "30%", left: "25%" }}
                                    />
                                    <motion.div
                                        className="absolute rounded-full bg-[#f08c68] w-2 h-2"
                                        style={{ bottom: "30%", right: "25%" }}
                                    />
                                </>
                            ) : (
                                
                                <>
                                    {[...Array(8)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="absolute bg-[#e8956c]"
                                            style={{
                                                height: "1.5px",
                                                width: "4px",
                                                transformOrigin: "12px 0.75px",
                                                transform: `rotate(${i * 45}deg) translateX(8px)`,
                                            }}
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: isDarkMode ? 0 : 1, scale: isDarkMode ? 0 : 1 }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    ))}
                                </>
                            )}
                        </motion.div>

                        
                        <motion.div
                            className="absolute left-1/2 top-2 w-6 h-3 rounded-full bg-white opacity-80 z-10"
                            initial={{ opacity: isDarkMode ? 0 : 0.8, x: 0 }}
                            animate={{ opacity: isDarkMode ? 0 : 0.8, x: isDarkMode ? 20 : 0 }}
                            transition={{ duration: 0.5 }}
                        />
                        <motion.div
                            className="absolute left-1/4 top-5 w-8 h-3 rounded-full bg-white opacity-80 z-10"
                            initial={{ opacity: isDarkMode ? 0 : 0.8, x: 0 }}
                            animate={{ opacity: isDarkMode ? 0 : 0.8, x: isDarkMode ? -20 : 0 }}
                            transition={{ duration: 0.5 }}
                        />

                        
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                            <motion.span 
                                className={`text-xs font-medium ${isDarkMode ? "text-[#c0c0c0]" : "text-[#444444]"} ${theme.body}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                key={isDarkMode ? "dark" : "light"}
                            >
                                {isDarkMode ? "Light Mode" : "Dark Mode"}
                            </motion.span>
                        </div>
                    </motion.div>
                </div>
            </motion.aside>

            <main className="ml-[240px] flex-1 p-8">{renderContent()}</main>
            
            {isModalOpen && selectedPost && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
                    onClick={() => setIsModalOpen(false)}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`${theme.content.card} border rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className={`${theme.accent} text-xs mb-2 font-medium ${theme.body}`}>
                                        {selectedPost.date} • {selectedPost.readTime}
                                    </div>
                                    <h2 className={`text-2xl font-bold ${theme.main.text} ${theme.heading}`}>{selectedPost.title}</h2>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className={`${theme.main.textSecondary} hover:${theme.main.text} p-1 rounded-full`}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="mb-6">
                                <div className="relative h-60 w-full rounded-lg overflow-hidden mb-4">
                                    <Image
                                        src={`https://picsum.photos/id/${200 + selectedPost.id}/1200/600`}
                                        alt={selectedPost.title}
                                        fill
                                        className="object-cover transition-transform duration-500 hover:scale-105"
                                    />
                                </div>
                                <p className={`${theme.main.textSecondary} mb-4`}>{selectedPost.description}</p>
                                <p className={`${theme.main.textSecondary} mb-4`}>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl
                                    nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl
                                    nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.
                                </p>
                                <p className={`${theme.main.textSecondary} mb-4`}>
                                    Proin auctor, urna eget tincidunt tincidunt, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.
                                    Curabitur ac nisl nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl
                                    nisl sit amet nisl.
                                </p>
                            </div>

                            
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
                                <h4 className={`text-sm font-semibold ${theme.main.text} ${theme.heading} mb-3`}>Share this post</h4>
                                <div className="flex space-x-3">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className={`p-2 rounded-full bg-[#1DA1F2] text-white`}
                                        onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(selectedPost.title)}&url=${encodeURIComponent(window.location.origin + '/blog/' + selectedPost.id)}`, '_blank')}
                                    >
                                        <FiTwitter className="w-5 h-5" />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className={`p-2 rounded-full bg-[#4267B2] text-white`}
                                        onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin + '/blog/' + selectedPost.id)}`, '_blank')}
                                    >
                                        <FiFacebook className="w-5 h-5" />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className={`p-2 rounded-full bg-[#0A66C2] text-white`}
                                        onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin + '/blog/' + selectedPost.id)}`, '_blank')}
                                    >
                                        <FiLinkedin className="w-5 h-5" />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className={`p-2 rounded-full ${theme.sidebar.activeBackground} ${theme.main.text}`}
                                        onClick={() => copyToClipboard(selectedPost.id)}
                                    >
                                        <FiCopy className="w-5 h-5" />
                                    </motion.button>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsModalOpen(false)}
                                    className={`px-4 py-2 rounded-lg bg-[#b85c38] text-white font-medium hover:bg-[#a04b2b] transition-colors cursor-pointer`}
                                >
                                    Close
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            
            <AnimatePresence>
                {showNotification && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-5 right-5 z-50 flex items-center px-4 py-2 bg-green-500 text-white rounded-lg shadow-lg"
                    >
                        <FiCheck className="mr-2" />
                        <span>{notificationMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
