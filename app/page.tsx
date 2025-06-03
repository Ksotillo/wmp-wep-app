"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";

const fontStyle = `
@import url("https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap");
body {
  font-family: 'Outfit', sans-serif;
}
`;
import {
    ChevronDown,
    ChevronRight,
    Shield,
    Zap,
    Globe,
    Award,
    Users,
    Database,
    Lock,
    Eye,
    CheckCircle,
    Star,
    ArrowRight,
    Sparkles,
    Github,
    Twitter,
    Linkedin,
    Facebook,
    Instagram,
} from "lucide-react";

interface Notification {
    id: number;
    message: string;
    type: string;
}

interface QuizAnswer {
    value: string;
    label: string;
    weight: {
        starter: number;
        professional: number;
        enterprise: number;
    };
}

interface CommitmentOption {
    id: string;
    label: string;
    months: number;
    discount: number;
    savings: string;
}

const ClientOnlyAnimatedDots = () => {
    const [dots, setDots] = useState<
        Array<{
            id: number;
            left: string;
            top: string;
            animationDelay: string;
            animationDuration: string;
        }>
    >([]);

    useEffect(() => {
        const newDots = Array.from({ length: 20 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
        }));
        setDots(newDots);
    }, []);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0">
                {dots.map((dot) => (
                    <div
                        key={dot.id}
                        className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60 animate-pulse"
                        style={{
                            left: dot.left,
                            top: dot.top,
                            animationDelay: dot.animationDelay,
                            animationDuration: dot.animationDuration,
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

const CybersecurityPricingUI = () => {
    const [selectedFeatures, setSelectedFeatures] = useState(new Set(["threat-detection", "endpoint-protection"]));
    const [commitmentPeriod, setCommitmentPeriod] = useState<string>("monthly");
    const [compareSlider, setCompareSlider] = useState(50);
    const [expandedSections, setExpandedSections] = useState(new Set<string>());
    const [quizStep, setQuizStep] = useState(0);
    const [quizAnswers, setQuizAnswers] = useState<Record<number, QuizAnswer>>({});
    const [showQuiz, setShowQuiz] = useState(false);
    const [recommendedPlan, setRecommendedPlan] = useState<string | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [demoScheduled, setDemoScheduled] = useState(false);
    const sliderRef = useRef<HTMLDivElement>(null);

    const commitmentOptions: CommitmentOption[] = [
        { id: "monthly", label: "Monthly", months: 1, discount: 0, savings: "No commitment" },
        { id: "yearly", label: "1 Year", months: 12, discount: 0.2, savings: "Save 20%" },
        { id: "biennial", label: "2 Years", months: 24, discount: 0.3, savings: "Save 30%" },
        { id: "triennial", label: "3 Years", months: 36, discount: 0.4, savings: "Save 40%" },
    ];

    const features = [
        {
            id: "threat-detection",
            name: "Advanced Threat Detection",
            icon: Eye,
            price: 15,
            description: "Real-time threat monitoring with AI-powered analytics",
        },
        {
            id: "endpoint-protection",
            name: "Endpoint Protection",
            icon: Shield,
            price: 12,
            description: "Comprehensive device security and management",
        },
        {
            id: "network-security",
            name: "Network Security",
            icon: Globe,
            price: 20,
            description: "Firewall, VPN, and network monitoring solutions",
        },
        {
            id: "identity-management",
            name: "Identity & Access Management",
            icon: Users,
            price: 18,
            description: "Single sign-on and user authentication controls",
        },
        {
            id: "data-protection",
            name: "Data Loss Prevention",
            icon: Database,
            price: 22,
            description: "Sensitive data classification and protection",
        },
        {
            id: "compliance",
            name: "Compliance Management",
            icon: Award,
            price: 25,
            description: "Automated compliance reporting and monitoring",
        },
        {
            id: "incident-response",
            name: "Incident Response",
            icon: Zap,
            price: 30,
            description: "24/7 security operations center support",
        },
        {
            id: "encryption",
            name: "Advanced Encryption",
            icon: Lock,
            price: 16,
            description: "End-to-end encryption for all communications",
        },
    ];

    const plans = [
        {
            name: "Starter",
            price: 99,
            features: ["threat-detection", "endpoint-protection"],
            color: "from-blue-500 to-cyan-500",
            popular: false,
        },
        {
            name: "Professional",
            price: 199,
            features: ["threat-detection", "endpoint-protection", "network-security", "identity-management"],
            color: "from-purple-500 to-pink-500",
            popular: true,
        },
        {
            name: "Enterprise",
            price: 399,
            features: [
                "threat-detection",
                "endpoint-protection",
                "network-security",
                "identity-management",
                "data-protection",
                "compliance",
            ],
            color: "from-orange-500 to-red-500",
            popular: false,
        },
    ];

    const getCompetitorPricing = () => {
        const baseCompetitors = [
            { name: "CrowdStrike", basePrice: 450 },
            { name: "SentinelOne", basePrice: 380 },
            { name: "Palo Alto", basePrice: 520 },
            { name: "Our Solution", basePrice: 299 },
        ];

        return baseCompetitors.map((comp) => ({
            ...comp,
            price:
                comp.name === "Our Solution"
                    ? Math.round(199 + (compareSlider / 100) * 200)
                    : Math.round(comp.basePrice + (compareSlider / 100) * comp.basePrice * 0.3),
        }));
    };

    const complianceRegions = [
        {
            id: "gdpr",
            name: "GDPR (European Union)",
            requirements: [
                "Data encryption at rest and in transit",
                "Right to be forgotten implementation",
                "Privacy impact assessments",
                "Data protection officer designation",
            ],
            status: "Fully Compliant",
        },
        {
            id: "ccpa",
            name: "CCPA (California)",
            requirements: ["Consumer data rights management", "Opt-out mechanisms", "Data inventory and mapping", "Privacy policy updates"],
            status: "Fully Compliant",
        },
        {
            id: "hipaa",
            name: "HIPAA (Healthcare)",
            requirements: [
                "PHI encryption standards",
                "Access control implementation",
                "Audit trail maintenance",
                "Business associate agreements",
            ],
            status: "Certified",
        },
        {
            id: "sox",
            name: "SOX (Financial)",
            requirements: [
                "Financial data protection",
                "Internal control documentation",
                "Change management processes",
                "Audit trail integrity",
            ],
            status: "Compliant",
        },
    ];

    const quizQuestions = [
        {
            question: "What's your organization size?",
            options: [
                { value: "small", label: "1-50 employees", weight: { starter: 3, professional: 1, enterprise: 0 } },
                { value: "medium", label: "51-500 employees", weight: { starter: 1, professional: 3, enterprise: 1 } },
                { value: "large", label: "500+ employees", weight: { starter: 0, professional: 1, enterprise: 3 } },
            ],
        },
        {
            question: "What's your primary industry?",
            options: [
                { value: "finance", label: "Financial Services", weight: { starter: 0, professional: 1, enterprise: 3 } },
                { value: "healthcare", label: "Healthcare", weight: { starter: 0, professional: 2, enterprise: 3 } },
                { value: "retail", label: "Retail/E-commerce", weight: { starter: 2, professional: 3, enterprise: 1 } },
                { value: "tech", label: "Technology", weight: { starter: 1, professional: 3, enterprise: 2 } },
                { value: "other", label: "Other", weight: { starter: 2, professional: 2, enterprise: 1 } },
            ],
        },
        {
            question: "What's your biggest security concern?",
            options: [
                { value: "threats", label: "Advanced Persistent Threats", weight: { starter: 0, professional: 2, enterprise: 3 } },
                { value: "compliance", label: "Regulatory Compliance", weight: { starter: 0, professional: 1, enterprise: 3 } },
                { value: "endpoints", label: "Endpoint Security", weight: { starter: 3, professional: 2, enterprise: 1 } },
                { value: "data", label: "Data Protection", weight: { starter: 1, professional: 2, enterprise: 3 } },
            ],
        },
    ];

    const showNotification = (message: string, type: string = "success") => {
        const id = Date.now();
        setNotifications((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, 3000);
    };

    const calculateCustomPrice = () => {
        return Array.from(selectedFeatures).reduce((total, featureId) => {
            const feature = features.find((f) => f.id === featureId);
            return total + (feature ? feature.price : 0);
        }, 0);
    };

    const getCurrentCommitment = () => {
        return commitmentOptions.find(option => option.id === commitmentPeriod) || commitmentOptions[0];
    };

    const calculateSavings = (price: number) => {
        const commitment = getCurrentCommitment();
        return Math.round(price * (1 - commitment.discount));
    };

    const handleFeatureToggle = (featureId: string) => {
        const newSelected = new Set(selectedFeatures);
        if (newSelected.has(featureId)) {
            newSelected.delete(featureId);
        } else {
            newSelected.add(featureId);
        }
        setSelectedFeatures(newSelected);
    };

    const toggleSection = (sectionId: string) => {
        const newExpanded = new Set(expandedSections);
        if (newExpanded.has(sectionId)) {
            newExpanded.delete(sectionId);
        } else {
            newExpanded.add(sectionId);
        }
        setExpandedSections(newExpanded);
    };

    const handleQuizAnswer = (questionIndex: number, answer: QuizAnswer) => {
        const newAnswers = { ...quizAnswers, [questionIndex]: answer };
        setQuizAnswers(newAnswers);

        if (questionIndex < quizQuestions.length - 1) {
            setQuizStep(questionIndex + 1);
        } else {
            const scores: Record<string, number> = { starter: 0, professional: 0, enterprise: 0 };
            Object.values(newAnswers).forEach((answer) => {
                Object.entries(answer.weight).forEach(([plan, weight]) => {
                    scores[plan] += weight;
                });
            });

            const recommended = Object.entries(scores).reduce((a, b) => (scores[a[0]] > scores[b[0]] ? a : b))[0];
            setRecommendedPlan(recommended);
            setQuizStep(quizQuestions.length);
        }
    };

    const resetQuiz = () => {
        setQuizStep(0);
        setQuizAnswers({});
        setRecommendedPlan(null);
        setShowQuiz(false);
    };

    const handleSliderInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (!sliderRef.current) return;
        const rect = sliderRef.current.getBoundingClientRect();
        const clientX = 'clientX' in e ? e.clientX : e.touches?.[0]?.clientX;
        if (!clientX) return;
        const x = clientX - rect.left;
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
        setCompareSlider(percentage);
    }, []);

    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || !sliderRef.current) return;
            const rect = sliderRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
            setCompareSlider(percentage);
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft" && compareSlider > 0) {
                setCompareSlider(Math.max(0, compareSlider - 5));
            } else if (e.key === "ArrowRight" && compareSlider < 100) {
                setCompareSlider(Math.min(100, compareSlider + 5));
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [compareSlider]);

    const onAIRecommendationClick = () => {
        setShowQuiz(true);
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <style dangerouslySetInnerHTML={{ __html: fontStyle }} />
            <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-cyan-500/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center cursor-pointer">
                            <div className="p-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg mr-3">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                                SecureGuard Enterprise
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <ClientOnlyAnimatedDots />

            {notifications.length > 0 && (
                <div className="fixed top-4 right-4 z-50 space-y-2">
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className="bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg animate-pulse flex items-center space-x-2"
                        >
                            <CheckCircle className="w-5 h-5" />
                            <span>{notification.message}</span>
                        </div>
                    ))}
                </div>
            )}

            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10" />
                <div className="relative px-4 py-8 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="flex justify-center mb-4 cursor-pointer">
                            <div className="p-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                            <span className="inline-block animate-pulse">SecureGuard</span>{" "}
                            <span className="inline-block" style={{ animation: "fadeInUp 1s ease-out 0.5s both" }}>
                                Enterprise
                            </span>
                        </h1>
                        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                            Next-generation cybersecurity platform with AI-powered threat detection and comprehensive protection suite
                        </p>
                    </div>
                </div>
            </div>

            <div className="px-4 sm:px-6 lg:px-8 pb-12">
                <div className="max-w-7xl mx-auto">
                    {showQuiz && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                            <div className="bg-slate-800 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center space-x-3">
                                        <Sparkles className="w-6 h-6 text-purple-400" />
                                        <h3 className="text-2xl font-bold text-white">AI Plan Recommender</h3>
                                    </div>
                                    <button onClick={resetQuiz} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                                        ✕
                                    </button>
                                </div>

                                <div className="mb-8">
                                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                                        <span>Progress</span>
                                        <span>{Math.round(((quizStep + 1) / (quizQuestions.length + 1)) * 100)}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500 ease-out"
                                            style={{ width: `${((quizStep + 1) / (quizQuestions.length + 1)) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                {quizStep < quizQuestions.length ? (
                                    <div className="space-y-6">
                                        <h4 className="text-xl font-semibold text-white mb-6">{quizQuestions[quizStep].question}</h4>
                                        <div className="space-y-3">
                                            {quizQuestions[quizStep].options.map((option, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleQuizAnswer(quizStep, option)}
                                                    className="w-full p-4 text-left bg-slate-700 hover:bg-slate-600 rounded-xl transition-all duration-200 hover:scale-[1.02] text-white cursor-pointer"
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center space-y-6">
                                        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
                                            <CheckCircle className="w-8 h-8 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="text-2xl font-bold text-white mb-2">Perfect Match Found!</h4>
                                            <p className="text-gray-300 mb-6">Based on your answers, we recommend the</p>
                                            <div className="inline-block p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                                                <span className="text-xl font-bold text-white capitalize">{recommendedPlan} Plan</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                resetQuiz();
                                                const planElement = document.querySelector(`[data-plan="${recommendedPlan}"]`);
                                                if (planElement) {
                                                    planElement.scrollIntoView({ behavior: "smooth", block: "center" });
                                                    planElement.classList.add("ring-4", "ring-yellow-400", "ring-opacity-75");
                                                    setTimeout(() => {
                                                        planElement.classList.remove("ring-4", "ring-yellow-400", "ring-opacity-75");
                                                    }, 3000);
                                                }
                                            }}
                                            className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-cyan-600 hover:to-purple-600 transition-all duration-200 cursor-pointer"
                                        >
                                            View Recommended Plan
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="grid lg:grid-cols-2 gap-8 mb-12">
                        <div className="space-y-6">
                            <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 border border-cyan-500/20">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-white">Customize Your Protection</h2>
                                    <button
                                        onClick={onAIRecommendationClick}
                                        className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 cursor-pointer"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        <span>AI Recommend</span>
                                    </button>
                                </div>

                                <div className="space-y-4 cursor-pointer">
                                    {features.map((feature) => {
                                        const Icon = feature.icon;
                                        const isSelected = selectedFeatures.has(feature.id);

                                        return (
                                            <div
                                                key={feature.id}
                                                className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer hover:shadow-lg ${
                                                    isSelected
                                                        ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-500/50"
                                                        : "bg-slate-700/50 border-slate-600/50 hover:border-cyan-500/30"
                                                }`}
                                                onClick={() => handleFeatureToggle(feature.id)}
                                                role="button"
                                                tabIndex={0}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter" || e.key === " ") {
                                                        e.preventDefault();
                                                        handleFeatureToggle(feature.id);
                                                    }
                                                }}
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div
                                                        className={`p-2 rounded-lg transition-colors ${
                                                            isSelected ? "bg-cyan-500" : "bg-slate-600"
                                                        }`}
                                                    >
                                                        <Icon className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-3">
                                                            <h3 className="font-semibold text-white">{feature.name}</h3>
                                                            <span className="text-sm text-cyan-400 font-medium">${feature.price}/mo</span>
                                                        </div>
                                                        <p className="text-sm text-gray-400 mt-1">{feature?.description}</p>
                                                    </div>
                                                    <div
                                                        className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${
                                                            isSelected ? "bg-cyan-500 border-cyan-500" : "border-gray-400"
                                                        }`}
                                                    >
                                                        {isSelected && (
                                                            <span
                                                                className="text-white text-sm leading-none flex items-center justify-center"
                                                                style={{ marginTop: "3px" }}
                                                            >
                                                                ✓
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="mt-8 p-4 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-xl border border-emerald-500/20">
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-semibold text-white mb-2">Commitment Period</h4>
                                            <p className="text-sm text-gray-400 mb-4">Choose your commitment period for additional savings</p>
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                            {commitmentOptions.map((option) => (
                                                <button
                                                    key={option.id}
                                                    onClick={() => setCommitmentPeriod(option.id)}
                                                    className={`p-3 rounded-xl text-center transition-all duration-200 cursor-pointer ${
                                                        commitmentPeriod === option.id
                                                            ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white transform scale-105"
                                                            : "bg-slate-700/50 text-gray-300 hover:bg-slate-600/50"
                                                    }`}
                                                >
                                                    <div className="font-semibold text-sm">{option.label}</div>
                                                    <div className="text-xs mt-1">
                                                        {option.discount > 0 ? option.savings : option.savings}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                        {getCurrentCommitment().discount > 0 && (
                                            <div className="text-center">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-500/20 text-emerald-400">
                                                    <CheckCircle className="w-4 h-4 mr-2" />
                                                    You're saving {Math.round(getCurrentCommitment().discount * 100)}% with {getCurrentCommitment().label} commitment!
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 border border-purple-500/20">
                                <h2 className="text-2xl font-bold text-white mb-6">Regional Compliance</h2>
                                <div className="space-y-4 cursor-pointer">
                                    {complianceRegions.map((region) => (
                                        <div key={region.id} className="border border-slate-600/50 rounded-xl overflow-hidden">
                                            <button
                                                onClick={() => toggleSection(region.id)}
                                                className="w-full p-4 bg-slate-700/50 hover:bg-slate-700 transition-colors text-left flex items-center justify-between cursor-pointer"
                                            >
                                                <div className="flex items-center mb-2 cursor-pointer">
                                                    <Award className="w-4 h-4 text-yellow-400 mr-2" />
                                                    <span className="text-yellow-400 text-xs uppercase tracking-wider font-semibold">
                                                        Enterprise Benefit
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <Globe className="w-5 h-5 text-purple-400" />
                                                    <span className="font-semibold text-white">{region.name}</span>
                                                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                                                        {region.status}
                                                    </span>
                                                </div>
                                                {expandedSections.has(region.id) ? (
                                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                                ) : (
                                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                                )}
                                            </button>
                                            {expandedSections.has(region.id) && (
                                                <div className="p-4 bg-slate-800/50 border-t border-slate-600/50">
                                                    <h4 className="font-semibold text-white mb-3">Requirements:</h4>
                                                    <ul className="space-y-2">
                                                        {region.requirements.map((req, idx) => (
                                                            <li
                                                                key={idx}
                                                                className="flex items-center space-x-2 text-sm text-gray-300 cursor-pointer"
                                                            >
                                                                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                                                                <span>{req}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 border border-cyan-500/20">
                                <h2 className="text-2xl font-bold text-white mb-6">Your Custom Plan</h2>
                                <div className="text-center mb-6">
                                    <div className="text-4xl font-bold text-white">
                                        ${calculateSavings(calculateCustomPrice())}
                                        <span className="text-lg text-gray-400">/month</span>
                                    </div>
                                    {commitmentPeriod !== "monthly" && (
                                        <div className="text-sm text-emerald-400 mt-2">
                                            <span className="line-through text-gray-500 mr-2">${calculateCustomPrice()}/month</span>
                                            {getCurrentCommitment().savings}
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-white">Selected Features:</h4>
                                    {Array.from(selectedFeatures).map((featureId) => {
                                        const feature = features.find((f) => f.id === featureId);
                                        if (!feature) return null;
                                        const Icon = feature.icon;
                                        return (
                                            <div
                                                key={featureId}
                                                className="flex items-center space-x-3 p-3 bg-slate-700/50 rounded-lg cursor-pointer"
                                            >
                                                <Icon className="w-4 h-4 text-cyan-400" />
                                                <span className="text-white flex-1">{feature.name}</span>
                                                <span className="text-cyan-400 font-medium">${feature.price}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                                <button
                                    onClick={() => showNotification("Our team will contact you soon!")}
                                    className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:from-cyan-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-[1.02] cursor-pointer"
                                >
                                    Connect to Us
                                </button>
                            </div>

                            <div className="space-y-4 cursor-pointer">
                                {plans.map((plan, idx) => (
                                    <div
                                        key={plan.name}
                                        data-plan={plan.name.toLowerCase()}
                                        className={`relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 border transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
                                            plan.popular ? "border-purple-500/50 ring-2 ring-purple-500/20" : "border-slate-600/50"
                                        }`}
                                    >
                                        {plan.popular && (
                                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center space-x-1 cursor-pointer">
                                                    <Star className="w-4 h-4" />
                                                    <span>Most Popular</span>
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-start mb-4 cursor-pointer">
                                            <div>
                                                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                                                <div className="text-3xl font-bold text-white mt-2">
                                                    ${calculateSavings(plan.price)}
                                                    <span className="text-lg text-gray-400">/month</span>
                                                </div>
                                                {commitmentPeriod !== "monthly" && (
                                                    <div className="text-sm text-emerald-400 mt-1">
                                                        Save ${plan.price - calculateSavings(plan.price)}/month
                                                    </div>
                                                )}
                                            </div>
                                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${plan.color} p-0.5`}>
                                                <div className="w-full h-full bg-slate-800 rounded-2xl flex items-center justify-center">
                                                    <Shield className="w-8 h-8 text-white" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2 mb-6">
                                            {plan.features.map((featureId) => {
                                                const feature = features.find((f) => f.id === featureId);
                                                return (
                                                    <div
                                                        key={featureId}
                                                        className="flex items-center space-x-2 text-sm text-gray-300 cursor-pointer"
                                                    >
                                                        <CheckCircle className="w-4 h-4 text-green-400" />
                                                        <span>{feature?.name || "Feature"}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <button
                                            onClick={() => {
                                                setSelectedPlan(plan.name.toLowerCase());
                                                showNotification("Our team will connect to you soon!");
                                            }}
                                            className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 cursor-pointer ${
                                                selectedPlan === plan.name.toLowerCase()
                                                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                                                    : plan.popular
                                                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                                                    : "bg-slate-700 text-white hover:bg-slate-600"
                                            }`}
                                        >
                                            {selectedPlan === plan.name.toLowerCase() ? "✓ Selected" : `Choose ${plan.name}`}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-orange-500/20 mb-12">
                        <h2 className="text-2xl font-bold text-white mb-2 text-center">See How We Compare</h2>
                        <p className="text-gray-400 text-center mb-8">Drag the slider to compare our pricing with leading competitors</p>

                        <div className="relative">
                            <div
                                ref={sliderRef}
                                className="relative h-16 bg-slate-700 rounded-2xl overflow-hidden cursor-pointer"
                                onMouseDown={(e) => {
                                    handleSliderInteraction(e);
                                    setIsDragging(true);
                                }}
                                onTouchStart={handleSliderInteraction}
                                onTouchMove={handleSliderInteraction}
                                role="slider"
                                tabIndex={0}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-valuenow={compareSlider}
                            >
                                <div
                                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-purple-500"
                                    style={{ width: `${compareSlider}%` }}
                                />
                                <div
                                    className="absolute top-1/2 w-6 h-6 bg-white rounded-full shadow-lg transform -translate-y-1/2 -translate-x-3 cursor-grab active:cursor-grabbing"
                                    style={{ left: `${compareSlider}%` }}
                                />
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                                {getCompetitorPricing().map((competitor, idx) => (
                                    <div
                                        key={competitor.name}
                                        className={`p-4 rounded-xl transition-all duration-300 ${
                                            competitor.name === "Our Solution"
                                                ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/50"
                                                : "bg-slate-700/50 border border-slate-600/50"
                                        }`}
                                    >
                                        <div className="text-center">
                                            <h4 className="font-semibold text-white mb-2">{competitor.name}</h4>
                                            <div className="text-2xl font-bold text-white">
                                                ${competitor.price}
                                                <span className="text-sm text-gray-400">/mo</span>
                                            </div>
                                            {competitor.name === "Our Solution" && (
                                                <div className="mt-2 text-sm text-emerald-400 font-medium">Best Value</div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/20 mb-12">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">Enterprise-Grade Security Features</h2>
                            <p className="text-gray-400 max-w-2xl mx-auto">
                                Comprehensive protection powered by advanced AI and machine learning algorithms
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                {
                                    icon: Shield,
                                    title: "Zero-Day Protection",
                                    description: "Advanced heuristic analysis detects unknown threats before they execute",
                                    color: "from-blue-500 to-cyan-500",
                                },
                                {
                                    icon: Zap,
                                    title: "Real-Time Response",
                                    description: "Automated incident response with sub-second threat neutralization",
                                    color: "from-yellow-500 to-orange-500",
                                },
                                {
                                    icon: Eye,
                                    title: "Behavioral Analytics",
                                    description: "AI-powered user behavior monitoring to detect insider threats",
                                    color: "from-purple-500 to-pink-500",
                                },
                                {
                                    icon: Database,
                                    title: "Data Classification",
                                    description: "Automatic sensitive data discovery and protection policies",
                                    color: "from-green-500 to-emerald-500",
                                },
                                {
                                    icon: Globe,
                                    title: "Global Threat Intel",
                                    description: "Real-time threat intelligence from our worldwide sensor network",
                                    color: "from-indigo-500 to-purple-500",
                                },
                                {
                                    icon: Lock,
                                    title: "Quantum-Safe Encryption",
                                    description: "Future-proof encryption algorithms resistant to quantum attacks",
                                    color: "from-red-500 to-pink-500",
                                },
                            ].map((feature, idx) => {
                                const Icon = feature.icon;
                                return (
                                    <div
                                        key={idx}
                                        className="group p-6 bg-slate-700/30 rounded-2xl border border-slate-600/50 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
                                    >
                                        <div
                                            className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} p-3 mb-4 group-hover:scale-110 transition-transform duration-300`}
                                        >
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                                        <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-cyan-500/20 mb-12">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-white mb-4">Trusted by Industry Leaders</h2>
                            <div className="flex justify-center items-center space-x-8 opacity-60">
                                {["TechCorp", "FinanceMax", "HealthSecure", "RetailGiant", "StartupHub"].map((company, idx) => (
                                    <div key={idx} className="text-gray-400 font-semibold text-lg cursor-pointer">
                                        {company}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                {
                                    quote: "SecureGuard reduced our security incidents by 95% in the first quarter. The AI-powered detection is phenomenal.",
                                    author: "Sarah Chen",
                                    role: "CISO, TechCorp",
                                    rating: 5,
                                },
                                {
                                    quote: "Finally, a cybersecurity solution that scales with our rapid growth. The compliance features are a game-changer.",
                                    author: "Michael Rodriguez",
                                    role: "IT Director, StartupHub",
                                    rating: 5,
                                },
                                {
                                    quote: "The ROI was immediate. We've saved millions in potential breach costs while improving our security posture.",
                                    author: "Lisa Thompson",
                                    role: "Security Manager, FinanceMax",
                                    rating: 5,
                                },
                            ].map((testimonial, idx) => (
                                <div key={idx} className="p-6 bg-slate-700/30 rounded-2xl border border-slate-600/50 cursor-pointer">
                                    <div className="flex space-x-1 mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                        ))}
                                    </div>
                                    <p className="text-gray-300 mb-4 italic">"{testimonial.quote}"</p>
                                    <div>
                                        <div className="font-semibold text-white">{testimonial.author}</div>
                                        <div className="text-sm text-gray-400">{testimonial.role}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-center bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl p-12 border border-purple-500/20">
                        <h2 className="text-3xl font-bold text-white mb-4">Ready to Secure Your Enterprise?</h2>
                        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                            Join thousands of organizations worldwide who trust SecureGuard to protect their digital assets. Start your free
                            30-day trial today.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button
                                onClick={() => showNotification("Trial will start soon!")}
                                className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-cyan-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-[1.05] flex items-center space-x-2 cursor-pointer"
                            >
                                <span>Start Free Trial</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => {
                                    setDemoScheduled(true);
                                    showNotification("Our team will contact you soon!");
                                }}
                                className="border border-cyan-500/50 text-cyan-400 px-8 py-4 rounded-xl font-semibold hover:bg-cyan-500/10 transition-all duration-200 cursor-pointer"
                            >
                                {demoScheduled ? "Demo Scheduled Soon" : "Schedule Demo"}
                            </button>
                        </div>
                        <div className="mt-6 text-sm text-gray-400">No credit card required • 24/7 expert support • Cancel anytime</div>
                    </div>
                </div>
            </div>

            <footer className="bg-slate-900 border-t border-cyan-500/20 pt-12 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center cursor-pointer">
                                <div className="p-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg mr-3">
                                    <Shield className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold text-white">SecureGuard</span>
                            </div>
                            <p className="text-gray-400 text-sm">
                                Next-generation cybersecurity platform with AI-powered threat detection and comprehensive protection suite
                                for enterprises of all sizes.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                            <ul className="space-y-2">
                                {["Features", "Pricing", "Compliance", "Testimonials"].map((item) => (
                                    <li key={item}>
                                        <button
                                            onClick={scrollToTop}
                                            className="text-gray-400 hover:text-cyan-400 transition-colors text-sm flex items-center cursor-pointer"
                                        >
                                            <ChevronRight className="w-4 h-4 mr-1" />
                                            {item}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-white font-semibold mb-4">Resources</h3>
                            <ul className="space-y-2">
                                {["Documentation", "Support", "Blog", "Partners"].map((item) => (
                                    <li key={item}>
                                        <button
                                            onClick={scrollToTop}
                                            className="text-gray-400 hover:text-cyan-400 transition-colors text-sm flex items-center cursor-pointer"
                                        >
                                            <ChevronRight className="w-4 h-4 mr-1" />
                                            {item}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-white font-semibold mb-4">Connect With Us</h3>
                            <div className="flex space-x-4">
                                {[
                                    { Icon: Twitter, url: "https://twitter.com" },
                                    { Icon: Linkedin, url: "https://linkedin.com" },
                                    { Icon: Github, url: "https://github.com" },
                                    { Icon: Facebook, url: "https://facebook.com" },
                                    { Icon: Instagram, url: "https://instagram.com" },
                                ].map((social, idx) => {
                                    const SocialIcon = social.Icon;
                                    return (
                                        <a
                                            key={idx}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 bg-slate-800 rounded-full hover:bg-gradient-to-r hover:from-cyan-500 hover:to-purple-500 transition-all duration-300 cursor-pointer"
                                        >
                                            <SocialIcon className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default CybersecurityPricingUI;
