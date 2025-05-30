"use client";

import { useState, useEffect, useMemo } from "react";
import { ThemeProvider, useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiTarget,
    FiUsers,
    FiSettings,
    FiSun,
    FiMoon,
    FiShare2,
    FiLink,
    FiPlus,
    FiEdit3,
    FiEye,
    FiChevronDown,
    FiChevronRight,
    FiSunset,
    FiCloud,
    FiCloudRain,
    FiCloudSnow,
    FiUser,
    FiCalendar,
    FiBarChart,
    FiCheck,
    FiX,
    FiTrash2,
    FiSave,
    FiRefreshCw,
    FiExternalLink,
    FiTrendingUp,
    FiActivity,
    FiFilter,
    FiCode,
    FiBell,
    FiMail,
    FiLogOut,
    FiSearch,
} from "react-icons/fi";

const GlobalThemeStyles = () => (
    <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Roboto:wght@300;400;500;600&display=swap");

        :root {
            --page-bg: #fafafa;
            --page-text-primary: #1a1a1a;
            --page-text-secondary: #6b7280;
            --card-bg: #ffffff;
            --card-bg-secondary: #f8fafc;
            --sidebar-bg: #ffffff;
            --border-color-primary: #e5e7eb;
            --border-color-secondary: #f3f4f6;
            --accent-blue: #3b82f6;
            --accent-purple: #8b5cf6;
            --accent-blue-light: #dbeafe;
            --accent-purple-light: #ede9fe;
            --success-color: #10b981;
            --warning-color: #f59e0b;
            --danger-color: #ef4444;
            --brand-color: #1b1930;
            --font-heading: "Montserrat", sans-serif;
            --font-body: "Roboto", sans-serif;
            --scrollbar-thumb: #d1d5db;
            --scrollbar-track: #f9fafb;
        }

        html.dark {
            --page-bg: #171719;
            --page-text-primary: #f1f5f9;
            --page-text-secondary: #94a3b8;
            --card-bg: #232229;
            --card-bg-secondary: #334155;
            --sidebar-bg: #232229;
            --border-color-primary: #334155;
            --border-color-secondary: #475569;
            --accent-blue: #60a5fa;
            --accent-purple: #a78bfa;
            --accent-blue-light: #1e3a8a;
            --accent-purple-light: #5b21b6;
            --success-color: #34d399;
            --warning-color: #fbbf24;
            --danger-color: #f87171;
            --brand-color: #ffffff;
            --scrollbar-thumb: #475569;
            --scrollbar-track: #1e293b;
        }

        body {
            background-color: var(--page-bg);
            color: var(--page-text-primary);
            font-family: var(--font-body);
            margin: 0;
            padding: 0;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
            font-family: var(--font-heading);
            font-weight: 600;
        }

        ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }

        ::-webkit-scrollbar-track {
            background: var(--scrollbar-track);
        }

        ::-webkit-scrollbar-thumb {
            background: var(--scrollbar-thumb);
            border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: var(--page-text-secondary);
        }
    `}</style>
);

interface Milestone {
    id: string;
    title: string;
    description: string;
    progress: number;
    riskLevel: "sunny" | "cloudy" | "rainy" | "stormy";
    dueDate: string;
    assignee: string;
    repositoryIssues: string[];
}

interface RepositoryIssue {
    number: number;
    title: string;
    state: "open" | "closed";
    html_url: string;
    user: {
        login: string;
    };
}

interface MilestoneFormData {
    title: string;
    description: string;
    progress: number;
    riskLevel: "sunny" | "cloudy" | "rainy" | "stormy";
    dueDate: string;
    assignee: string;
    repositoryIssues: string[];
}

const mockMilestones: Milestone[] = [
    {
        id: "1",
        title: "Authentication System",
        description: "Implement user login, registration, and session management",
        progress: 85,
        riskLevel: "sunny",
        dueDate: "2025-05-15",
        assignee: "Sarah Chen",
        repositoryIssues: ["123", "124", "125"],
    },
    {
        id: "2",
        title: "Dashboard Infrastructure",
        description: "Build core dashboard components and routing",
        progress: 60,
        riskLevel: "cloudy",
        dueDate: "2025-06-28",
        assignee: "Mike Johnson",
        repositoryIssues: ["126", "127"],
    },
    {
        id: "3",
        title: "API Integration",
        description: "Connect frontend with backend services",
        progress: 25,
        riskLevel: "rainy",
        dueDate: "2025-07-10",
        assignee: "Alex Rivera",
        repositoryIssues: ["128", "129", "130"],
    },
];

const getCurrentQuarter = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const quarter = Math.ceil(month / 3);
    return `Q${quarter} ${year}`;
};

const Notification = ({ show, message, onClose }: { show: boolean; message: string; onClose: () => void }) => (
    <AnimatePresence>
        {show && (
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50"
            >
                <div className="bg-white border border-[var(--border-color-primary)] rounded-lg shadow-lg px-4 py-3 flex items-center gap-3 max-w-md">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <FiCheck className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-[var(--page-text-primary)] font-medium">{message}</span>
                </div>
            </motion.div>
        )}
    </AnimatePresence>
);

const CopySuccessAnimation = ({ show }: { show: boolean }) => (
    <AnimatePresence>
        {show && (
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
            >
                <motion.div
                    initial={{ scale: 0.8, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full p-8"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1.2, 1] }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                        className="bg-white rounded-full p-6"
                    >
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.6, ease: "easeInOut" }}>
                            <FiShare2 className="w-12 h-12 text-purple-500" />
                        </motion.div>
                    </motion.div>
                </motion.div>

                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ scale: 0, x: 0, y: 0 }}
                        animate={{
                            scale: [0, 1, 0],
                            x: Math.cos((i * Math.PI) / 4) * 150,
                            y: Math.sin((i * Math.PI) / 4) * 150,
                        }}
                        transition={{
                            duration: 1.2,
                            delay: 0.3,
                            ease: "easeOut",
                        }}
                        className="absolute w-3 h-3 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full"
                    />
                ))}

                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-20"
                >
                    <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full px-6 py-3">
                        <div className="flex items-center gap-3">
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                                className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                            >
                                <FiCheck className="w-3 h-3 text-white" />
                            </motion.div>
                            <span className="font-semibold text-gray-800">Link copied to clipboard!</span>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="cursor-pointer p-2 h-10 w-10 rounded-lg border border-[var(--border-color-primary)] bg-[var(--card-bg)] hover:bg-[var(--card-bg-secondary)] transition-colors flex items-center justify-center"
        >
            {theme === "dark" ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
        </button>
    );
};

const WeatherIcon = ({ risk }: { risk: string }) => {
    const icons = {
        sunny: <FiSunset className="w-4 h-4 text-[var(--success-color)]" />,
        cloudy: <FiCloud className="w-4 h-4 text-[var(--warning-color)]" />,
        rainy: <FiCloudRain className="w-4 h-4 text-[var(--danger-color)]" />,
        stormy: <FiCloudSnow className="w-4 h-4 text-[var(--danger-color)]" />,
    };
    return icons[risk as keyof typeof icons] || icons.sunny;
};

const ProgressBar = ({ progress }: { progress: number }) => (
    <div className="w-full bg-[var(--card-bg-secondary)] rounded-full h-2">
        <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="bg-[var(--accent-blue)] h-2 rounded-full"
            transition={{ duration: 0.5, ease: "easeOut" }}
        />
    </div>
);

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Delete",
    cancelText = "Cancel",
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
}) => {
    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-[var(--card-bg)] rounded-xl border border-[var(--border-color-primary)] p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-4">
                    <h3 className="font-[var(--font-heading)] font-semibold text-lg text-[var(--page-text-primary)] mb-2">{title}</h3>
                    <p className="text-[var(--page-text-secondary)] text-sm">{message}</p>
                </div>

                <div className="flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="cursor-pointer px-4 py-2 border border-[var(--border-color-primary)] text-[var(--page-text-secondary)] rounded-lg hover:bg-[var(--card-bg-secondary)] transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="cursor-pointer px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        {confirmText}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

const RepositorySettings = ({
    githubRepo,
    setGithubRepo,
    onFetchIssues,
    isLoading,
}: {
    githubRepo: string;
    setGithubRepo: (repo: string) => void;
    onFetchIssues: () => void;
    isLoading: boolean;
}) => (
    <div className="mb-8 p-6 bg-[var(--card-bg-secondary)] rounded-xl border border-[var(--border-color-primary)]">
        <div className="flex items-center gap-2 mb-4">
            <FiCode className="w-5 h-5 text-[var(--accent-blue)]" />
            <h3 className="font-[var(--font-heading)] font-semibold text-lg text-[var(--page-text-primary)]">Repository Integration</h3>
        </div>
        <p className="text-[var(--page-text-secondary)] text-sm mb-4">Connect your code repository to link issues with this milestone</p>
        <div className="flex gap-3">
            <input
                type="text"
                value={githubRepo}
                onChange={(e) => setGithubRepo(e.target.value)}
                placeholder="owner/repository (e.g., facebook/react)"
                className="flex-1 px-4 py-3 border border-[var(--border-color-primary)] rounded-lg bg-[var(--card-bg)] text-[var(--page-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] focus:border-transparent transition-all"
            />
            <button
                onClick={onFetchIssues}
                disabled={isLoading || !githubRepo.includes("/")}
                title={!githubRepo.includes("/") ? "Please enter a valid repository format" : "Fetch issues from repository"}
                className="cursor-pointer px-6 py-3 bg-[var(--brand-color)] text-[var(--page-bg)] rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
            >
                {isLoading ? <FiRefreshCw className="w-4 h-4 animate-spin" /> : <FiCode className="w-4 h-4" />}
                <span>{isLoading ? "Loading..." : "Fetch Issues"}</span>
            </button>
        </div>
        {githubRepo && !githubRepo.includes("/") && (
            <p className="text-red-500 text-sm mt-3 flex items-center gap-2">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                Please enter repository in format: owner/repository
            </p>
        )}
    </div>
);

const MilestoneModal = ({
    isOpen,
    onClose,
    milestone,
    onSave,
    onDelete,
    githubRepo,
    setGithubRepo,
    githubIssues,
    onFetchIssues,
    isLoadingIssues,
}: {
    isOpen: boolean;
    onClose: () => void;
    milestone?: Milestone;
    onSave: (data: MilestoneFormData) => void;
    onDelete?: (id: string) => void;
    githubRepo: string;
    setGithubRepo: (repo: string) => void;
    githubIssues: RepositoryIssue[];
    onFetchIssues: () => void;
    isLoadingIssues: boolean;
}) => {
    const [formData, setFormData] = useState<MilestoneFormData>({
        title: "",
        description: "",
        progress: 0,
        riskLevel: "sunny",
        dueDate: "",
        assignee: "",
        repositoryIssues: [],
    });

    const [errors, setErrors] = useState<Partial<MilestoneFormData>>({});

    useEffect(() => {
        if (milestone) {
            setFormData({
                title: milestone.title,
                description: milestone.description,
                progress: milestone.progress,
                riskLevel: milestone.riskLevel,
                dueDate: milestone.dueDate,
                assignee: milestone.assignee,
                repositoryIssues: milestone.repositoryIssues,
            });
        } else {
            setFormData({
                title: "",
                description: "",
                progress: 0,
                riskLevel: "sunny",
                dueDate: "",
                assignee: "",
                repositoryIssues: [],
            });
        }
        setErrors({});
    }, [milestone, isOpen]);

    const validateForm = () => {
        const newErrors: Partial<MilestoneFormData> = {};

        if (!formData.title.trim()) newErrors.title = "Title is required";
        if (!formData.description.trim()) newErrors.description = "Description is required";
        if (!formData.assignee.trim()) newErrors.assignee = "Assignee is required";
        if (!formData.dueDate) newErrors.dueDate = "Due date is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (validateForm()) {
            onSave(formData);
            onClose();
        }
    };

    const handleDelete = () => {
        if (milestone && onDelete) {
            onDelete(milestone.id);
            onClose();
        }
    };

    const toggleRepositoryIssue = (issueNumber: string) => {
        setFormData((prev) => ({
            ...prev,
            repositoryIssues: prev.repositoryIssues.includes(issueNumber)
                ? prev.repositoryIssues.filter((i) => i !== issueNumber)
                : [...prev.repositoryIssues, issueNumber],
        }));
    };

    const riskOptions = [
        { value: "sunny", label: "Low Risk", icon: <FiSunset className="w-4 h-4" />, desc: "Everything on track" },
        { value: "cloudy", label: "Medium Risk", icon: <FiCloud className="w-4 h-4" />, desc: "Minor concerns" },
        { value: "rainy", label: "High Risk", icon: <FiCloudRain className="w-4 h-4" />, desc: "Significant issues" },
        { value: "stormy", label: "Critical Risk", icon: <FiCloudSnow className="w-4 h-4" />, desc: "Major blockers" },
    ];

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border-color-primary)] p-8 w-full max-w-6xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="font-[var(--font-heading)] font-bold text-2xl text-[var(--page-text-primary)] mb-2">
                            {milestone ? "Edit Milestone" : "Create New Milestone"}
                        </h2>
                        <p className="text-[var(--page-text-secondary)]">
                            {milestone ? "Update milestone details and linked issues" : "Set up your milestone with repository integration"}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="cursor-pointer p-3 hover:bg-[var(--card-bg-secondary)] rounded-xl transition-colors"
                        title="Close modal"
                    >
                        <FiX className="w-6 h-6 text-[var(--page-text-secondary)]" />
                    </button>
                </div>

                <RepositorySettings
                    githubRepo={githubRepo}
                    setGithubRepo={setGithubRepo}
                    onFetchIssues={onFetchIssues}
                    isLoading={isLoadingIssues}
                />

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <FiEdit3 className="w-5 h-5 text-[var(--accent-purple)]" />
                                <h3 className="font-[var(--font-heading)] font-semibold text-lg text-[var(--page-text-primary)]">
                                    Milestone Details
                                </h3>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-[var(--page-text-primary)] mb-3">Title *</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                                        className={`w-full px-4 py-3 border rounded-xl bg-[var(--card-bg)] text-[var(--page-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] focus:border-transparent transition-all hover:border-[var(--accent-blue)] ${
                                            errors.title ? "border-red-500 focus:ring-red-500" : "border-[var(--border-color-primary)]"
                                        }`}
                                        placeholder="Enter a clear, descriptive milestone title"
                                    />
                                    {errors.title && (
                                        <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                                            <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                                            {errors.title}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-[var(--page-text-primary)] mb-3">
                                        Description *
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                                        rows={4}
                                        className={`w-full px-4 py-3 border rounded-xl bg-[var(--card-bg)] text-[var(--page-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] focus:border-transparent transition-all hover:border-[var(--accent-blue)] resize-none ${
                                            errors.description
                                                ? "border-red-500 focus:ring-red-500"
                                                : "border-[var(--border-color-primary)]"
                                        }`}
                                        placeholder="Describe the milestone objectives, deliverables, and success criteria"
                                    />
                                    {errors.description && (
                                        <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                                            <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                                            {errors.description}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-[var(--page-text-primary)] mb-3">
                                            Due Date *
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.dueDate}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
                                            className={`w-full px-4 py-3 border rounded-xl bg-[var(--card-bg)] text-[var(--page-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] focus:border-transparent transition-all hover:border-[var(--accent-blue)] ${
                                                errors.dueDate
                                                    ? "border-red-500 focus:ring-red-500"
                                                    : "border-[var(--border-color-primary)]"
                                            }`}
                                        />
                                        {errors.dueDate && (
                                            <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                                                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                                                {errors.dueDate}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-[var(--page-text-primary)] mb-3">
                                            Assignee *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.assignee}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, assignee: e.target.value }))}
                                            className={`w-full px-4 py-3 border rounded-xl bg-[var(--card-bg)] text-[var(--page-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] focus:border-transparent transition-all hover:border-[var(--accent-blue)] ${
                                                errors.assignee
                                                    ? "border-red-500 focus:ring-red-500"
                                                    : "border-[var(--border-color-primary)]"
                                            }`}
                                            placeholder="Enter assignee name or team"
                                        />
                                        {errors.assignee && (
                                            <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                                                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                                                {errors.assignee}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <FiBarChart className="w-5 h-5 text-[var(--success-color)]" />
                                <h3 className="font-[var(--font-heading)] font-semibold text-lg text-[var(--page-text-primary)]">
                                    Progress & Risk Assessment
                                </h3>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-[var(--page-text-primary)] mb-3">
                                        Progress: {formData.progress}%
                                    </label>
                                    <div className="px-2">
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={formData.progress}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, progress: parseInt(e.target.value) }))}
                                            className="w-full h-3 bg-[var(--card-bg-secondary)] rounded-lg appearance-none cursor-pointer"
                                            style={{
                                                background: `linear-gradient(to right, var(--accent-blue) 0%, var(--accent-blue) ${formData.progress}%, var(--card-bg-secondary) ${formData.progress}%, var(--card-bg-secondary) 100%)`,
                                            }}
                                        />
                                        <div className="flex justify-between text-xs text-[var(--page-text-secondary)] mt-2">
                                            <span>Not Started</span>
                                            <span>In Progress</span>
                                            <span>Complete</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-[var(--page-text-primary)] mb-4">Risk Level</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {riskOptions.map((option) => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                title={option.desc}
                                                onClick={() => setFormData((prev) => ({ ...prev, riskLevel: option.value as any }))}
                                                className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 hover:scale-105 ${
                                                    formData.riskLevel === option.value
                                                        ? "border-[var(--accent-blue)] bg-[var(--accent-blue-light)] text-[var(--accent-blue)]"
                                                        : "border-[var(--border-color-primary)] hover:border-[var(--accent-blue)] hover:bg-[var(--card-bg-secondary)]"
                                                }`}
                                            >
                                                <span
                                                    className={`${
                                                        option.value === "sunny"
                                                            ? "text-green-500"
                                                            : option.value === "cloudy"
                                                            ? "text-yellow-500"
                                                            : option.value === "rainy"
                                                            ? "text-orange-500"
                                                            : "text-red-500"
                                                    }`}
                                                >
                                                    {option.icon}
                                                </span>
                                                <div className="text-left">
                                                    <div className="font-medium text-sm">{option.label}</div>
                                                    <div className="text-xs text-[var(--page-text-secondary)]">{option.desc}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <FiLink className="w-5 h-5 text-[var(--accent-blue)]" />
                            <h3 className="font-[var(--font-heading)] font-semibold text-lg text-[var(--page-text-primary)]">
                                Linked Repository Issues
                            </h3>
                            <span className="px-3 py-1 bg-[var(--accent-blue-light)] text-[var(--accent-blue)] rounded-full text-sm font-medium">
                                {formData.repositoryIssues.length} selected
                            </span>
                        </div>

                        {!githubRepo.includes("/") && (
                            <div className="text-center py-8 px-6 bg-[var(--card-bg-secondary)] rounded-xl border-2 border-dashed border-[var(--border-color-primary)]">
                                <FiCode className="w-8 h-8 text-[var(--page-text-secondary)] mx-auto mb-3" />
                                <p className="text-[var(--page-text-secondary)] text-sm mb-2">Configure repository above to link issues</p>
                                <p className="text-xs text-[var(--page-text-secondary)]">
                                    Issues help track progress and provide context for your milestone
                                </p>
                            </div>
                        )}

                        {githubRepo.includes("/") && githubIssues.length === 0 && !isLoadingIssues && (
                            <div className="text-center py-8 px-6 bg-[var(--card-bg-secondary)] rounded-xl border-2 border-dashed border-[var(--border-color-primary)]">
                                <FiRefreshCw className="w-8 h-8 text-[var(--page-text-secondary)] mx-auto mb-3" />
                                <p className="text-[var(--page-text-secondary)] text-sm mb-2">No issues found in this repository</p>
                                <p className="text-xs text-[var(--page-text-secondary)]">Click "Fetch Issues" to reload from repository</p>
                            </div>
                        )}

                        {githubIssues.length > 0 && (
                            <div className="border border-[var(--border-color-primary)] rounded-xl p-2 max-h-96 overflow-y-auto">
                                <div className="space-y-1">
                                    {githubIssues.map((issue) => (
                                        <label
                                            key={issue.number}
                                            className="flex items-start gap-4 p-3 hover:bg-[var(--card-bg-secondary)] rounded-lg cursor-pointer transition-colors group"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.repositoryIssues.includes(issue.number.toString())}
                                                onChange={() => toggleRepositoryIssue(issue.number.toString())}
                                                className="mt-1 rounded focus:ring-2 focus:ring-[var(--accent-blue)]"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-sm font-semibold text-[var(--page-text-primary)]">
                                                        #{issue.number}
                                                    </span>
                                                    <span
                                                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                                                            issue.state === "open"
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-gray-100 text-gray-600"
                                                        }`}
                                                    >
                                                        {issue.state}
                                                    </span>
                                                    <a
                                                        href={issue.html_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-[var(--page-text-secondary)] hover:text-[var(--accent-blue)] opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={(e) => e.stopPropagation()}
                                                        title="Open in repository"
                                                    >
                                                        <FiExternalLink className="w-4 h-4" />
                                                    </a>
                                                </div>
                                                <p className="text-sm text-[var(--page-text-primary)] leading-relaxed mb-1">
                                                    {issue.title}
                                                </p>
                                                <p className="text-xs text-[var(--page-text-secondary)]">by {issue.user.login}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {isLoadingIssues && (
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <FiRefreshCw className="w-8 h-8 animate-spin text-[var(--accent-blue)] mx-auto mb-3" />
                                    <p className="text-[var(--page-text-secondary)] font-medium">Loading issues from repository...</p>
                                    <p className="text-xs text-[var(--page-text-secondary)] mt-1">This may take a moment</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between mt-10 pt-6 border-t border-[var(--border-color-primary)]">
                    <div>
                        {milestone && onDelete && (
                            <button
                                onClick={handleDelete}
                                className="cursor-pointer flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium"
                                title="Delete this milestone permanently"
                            >
                                <FiTrash2 className="w-4 h-4" />
                                <span>Delete Milestone</span>
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={onClose}
                            className="cursor-pointer px-6 py-3 border border-[var(--border-color-primary)] text-[var(--page-text-secondary)] rounded-xl hover:bg-[var(--card-bg-secondary)] hover:border-[var(--accent-blue)] transition-all font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="cursor-pointer flex items-center gap-2 px-6 py-3 bg-[var(--brand-color)] text-[var(--page-bg)] rounded-xl hover:opacity-90 transition-opacity font-medium"
                        >
                            <FiSave className="w-4 h-4" />
                            <span>{milestone ? "Update Milestone" : "Create Milestone"}</span>
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const MilestoneCard = ({
    milestone,
    onEdit,
    onDelete,
    githubIssues,
}: {
    milestone: Milestone;
    onEdit: (milestone: Milestone) => void;
    onDelete: (id: string) => void;
    githubIssues: RepositoryIssue[];
}) => {
    const linkedIssues = githubIssues.filter((issue) => milestone.repositoryIssues.includes(issue.number.toString()));

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[var(--card-bg)] border border-[var(--border-color-primary)] rounded-xl p-6 hover:border-[var(--accent-blue)] transition-colors"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <WeatherIcon risk={milestone.riskLevel} />
                    <h3 className="font-[var(--font-heading)] font-semibold text-[var(--page-text-primary)]">{milestone.title}</h3>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onEdit(milestone)}
                        className="cursor-pointer p-1 hover:bg-[var(--card-bg-secondary)] rounded transition-colors"
                    >
                        <FiEdit3 className="w-4 h-4 text-[var(--page-text-secondary)]" />
                    </button>
                    <button onClick={() => onDelete(milestone.id)} className="cursor-pointer p-1 hover:bg-red-50 rounded transition-colors">
                        <FiTrash2 className="w-4 h-4 text-red-500" />
                    </button>
                </div>
            </div>

            <p className="text-[var(--page-text-secondary)] text-sm mb-4">{milestone.description}</p>

            <div className="space-y-3">
                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-[var(--page-text-secondary)]">Progress</span>
                        <span className="font-medium text-[var(--page-text-primary)]">{milestone.progress}%</span>
                    </div>
                    <ProgressBar progress={milestone.progress} />
                </div>

                <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                        <FiCalendar className="w-3 h-3 text-[var(--page-text-secondary)]" />
                        <span className="text-[var(--page-text-secondary)]">{milestone.dueDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FiUser className="w-3 h-3 text-[var(--page-text-secondary)]" />
                        <span className="text-[var(--page-text-secondary)]">{milestone.assignee}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <FiLink className="w-3 h-3 text-[var(--page-text-secondary)]" />
                    <span className="text-xs text-[var(--page-text-secondary)]">{linkedIssues.length} linked issues</span>
                    {linkedIssues.length > 0 && (
                        <div className="flex gap-1">
                            {linkedIssues.slice(0, 3).map((issue) => (
                                <a
                                    key={issue.number}
                                    href={issue.html_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs px-1 py-0.5 bg-[var(--accent-blue-light)] text-[var(--accent-blue)] rounded hover:opacity-80"
                                    title={issue.title}
                                >
                                    #{issue.number}
                                </a>
                            ))}
                            {linkedIssues.length > 3 && (
                                <span className="text-xs text-[var(--page-text-secondary)]">+{linkedIssues.length - 3}</span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

const ProfileDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);

    const profileOptions = [
        {
            label: "View Profile",
            icon: FiUser,
            color: "text-blue-600",
            onClick: () => console.log("View Profile"),
        },
        {
            label: "Account Settings",
            icon: FiSettings,
            color: "text-gray-600",
            onClick: () => console.log("Account Settings"),
        },
        {
            label: "Notifications",
            icon: FiBell,
            color: "text-yellow-600",
            onClick: () => console.log("Notifications"),
            badge: "3",
        },
        {
            label: "Support & Help",
            icon: FiMail,
            color: "text-green-600",
            onClick: () => console.log("Support"),
        },
        {
            label: "Team Management",
            icon: FiUsers,
            color: "text-purple-600",
            onClick: () => console.log("Team Management"),
        },
        {
            label: "Sign Out",
            icon: FiLogOut,
            color: "text-red-600",
            onClick: () => console.log("Sign Out"),
            separator: true,
        },
    ];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="cursor-pointer w-10 h-10 rounded-full overflow-hidden border-2 border-[var(--border-color-primary)] hover:border-[var(--accent-blue)] transition-colors"
            >
                <img
                    src="https://images.unsplash.com/photo-1747995709691-5d0cf015c991?q=80&w=3164&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Profile"
                    className="w-full h-full object-cover"
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 top-12 z-50 w-64 bg-[var(--card-bg)] border border-[var(--border-color-primary)] rounded-xl shadow-lg py-2"
                        >
                            <div className="px-4 py-3 border-b border-[var(--border-color-primary)]">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full overflow-hidden">
                                        <img
                                            src="https://images.unsplash.com/photo-1747995709691-5d0cf015c991?q=80&w=3164&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-[var(--font-heading)] font-semibold text-[var(--page-text-primary)]">
                                            Sarah Chen
                                        </p>
                                        <p className="text-sm text-[var(--page-text-secondary)]">Product Manager</p>
                                    </div>
                                </div>
                            </div>

                            <div className="py-2">
                                {profileOptions.map((option, index) => (
                                    <div key={index}>
                                        {option.separator && <hr className="my-2 border-[var(--border-color-primary)]" />}
                                        <button
                                            onClick={() => {
                                                option.onClick();
                                                setIsOpen(false);
                                            }}
                                            className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--card-bg-secondary)] transition-colors text-left"
                                        >
                                            <option.icon className={`w-4 h-4 ${option.color}`} />
                                            <span className="flex-1 text-[var(--page-text-primary)] font-medium">{option.label}</span>
                                            {option.badge && (
                                                <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full font-semibold">
                                                    {option.badge}
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

const TopHeader = ({
    shareURL,
    showNotification,
    searchTerm,
    onSearchChange,
}: {
    shareURL: () => void;
    showNotification: boolean;
    searchTerm: string;
    onSearchChange: (term: string) => void;
}) => {
    const [showMobileSearch, setShowMobileSearch] = useState(false);

    return (
        <header className="bg-[var(--card-bg)] border-b border-[var(--border-color-primary)] px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[var(--brand-color)] rounded-lg flex items-center justify-center">
                            <FiTarget className="w-4 h-4 text-[var(--page-bg)]" />
                        </div>
                        <div className="hidden sm:block">
                            <h2 className="font-[var(--font-heading)] font-semibold text-lg text-[var(--page-text-primary)]">
                                Product Roadmap
                            </h2>
                            <p className="text-sm text-[var(--page-text-secondary)]">{getCurrentQuarter()} Development Milestones</p>
                        </div>
                    </div>

                    <div className="hidden lg:flex relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--page-text-secondary)]" />
                        <input
                            type="text"
                            placeholder="Search milestones..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-10 pr-4 py-2 w-64 border border-[var(--border-color-primary)] rounded-lg bg-[var(--card-bg)] text-[var(--page-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] transition-all"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => onSearchChange("")}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--page-text-secondary)] hover:text-[var(--page-text-primary)]"
                            >
                                <FiX className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowMobileSearch(!showMobileSearch)}
                        className="lg:hidden cursor-pointer p-2 h-10 w-10 rounded-lg border border-[var(--border-color-primary)] bg-[var(--card-bg)] hover:bg-[var(--card-bg-secondary)] transition-colors flex items-center justify-center"
                    >
                        <FiSearch className="w-4 h-4" />
                    </button>

                    <button
                        onClick={shareURL}
                        className="lg:hidden cursor-pointer p-2 h-10 w-10 rounded-lg border border-[var(--border-color-primary)] bg-[var(--card-bg)] hover:bg-[var(--card-bg-secondary)] transition-colors flex items-center justify-center"
                    >
                        <FiShare2 className="w-4 h-4" />
                    </button>

                    <button
                        onClick={shareURL}
                        className="hidden lg:flex cursor-pointer items-center gap-2 px-3 py-2 h-10 bg-[var(--brand-color)] text-[var(--page-bg)] rounded-lg hover:opacity-90 transition-opacity"
                    >
                        <FiShare2 className="w-4 h-4" />
                        <span>Share</span>
                    </button>

                    <div className="h-10">
                        <ThemeToggle />
                    </div>
                    <ProfileDropdown />
                </div>
            </div>

            {showMobileSearch && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="lg:hidden mt-4 relative"
                >
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--page-text-secondary)]" />
                    <input
                        type="text"
                        placeholder="Search milestones..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-[var(--border-color-primary)] rounded-lg bg-[var(--card-bg)] text-[var(--page-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] transition-all"
                        autoFocus
                    />
                    {searchTerm && (
                        <button
                            onClick={() => onSearchChange("")}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--page-text-secondary)] hover:text-[var(--page-text-primary)]"
                        >
                            <FiX className="w-4 h-4" />
                        </button>
                    )}
                </motion.div>
            )}
        </header>
    );
};

const ResizablePanes = ({
    milestones,
    onAddMilestone,
    onEditMilestone,
    onDeleteMilestone,
    githubIssues,
    searchTerm,
}: {
    milestones: Milestone[];
    onAddMilestone: () => void;
    onEditMilestone: (milestone: Milestone) => void;
    onDeleteMilestone: (id: string) => void;
    githubIssues: RepositoryIssue[];
    searchTerm: string;
}) => {
    const [paneWidth, setPaneWidth] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");

    const startResize = () => setIsDragging(true);

    const resize = (e: React.MouseEvent) => {
        if (!isDragging) return;
        const container = e.currentTarget.parentElement;
        if (!container) return;

        const containerRect = container.getBoundingClientRect();
        const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
        setPaneWidth(Math.max(20, Math.min(80, newWidth)));
    };

    const stopResize = () => setIsDragging(false);

    return (
        <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
            <div className="lg:hidden mb-4 px-6">
                <div className="flex gap-2 p-1 bg-[var(--card-bg-secondary)] rounded-lg">
                    <button
                        onClick={() => setViewMode("edit")}
                        className={`cursor-pointer flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded transition-colors ${
                            viewMode === "edit"
                                ? "bg-[var(--card-bg)] text-[var(--page-text-primary)]"
                                : "text-[var(--page-text-secondary)]"
                        }`}
                    >
                        <FiEdit3 className="w-4 h-4" />
                        <span>Edit</span>
                    </button>
                    <button
                        onClick={() => setViewMode("preview")}
                        className={`cursor-pointer flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded transition-colors ${
                            viewMode === "preview"
                                ? "bg-[var(--card-bg)] text-[var(--page-text-primary)]"
                                : "text-[var(--page-text-secondary)]"
                        }`}
                    >
                        <FiEye className="w-4 h-4" />
                        <span>Preview</span>
                    </button>
                </div>
            </div>

            <div className="hidden lg:flex flex-1 relative" onMouseMove={resize} onMouseUp={stopResize} onMouseLeave={stopResize}>
                <div style={{ width: `${paneWidth}%` }} className="bg-[var(--card-bg)] border-r border-[var(--border-color-primary)]">
                    <EditorPane
                        milestones={milestones}
                        onAddMilestone={onAddMilestone}
                        onEditMilestone={onEditMilestone}
                        onDeleteMilestone={onDeleteMilestone}
                        githubIssues={githubIssues}
                        searchTerm={searchTerm}
                    />
                </div>

                <div
                    className="w-1 bg-[var(--border-color-primary)] hover:bg-[var(--accent-blue)] cursor-col-resize transition-colors"
                    onMouseDown={startResize}
                />

                <div style={{ width: `${100 - paneWidth}%` }} className="bg-[var(--page-bg)]">
                    <PreviewPane
                        milestones={milestones}
                        onEditMilestone={onEditMilestone}
                        onDeleteMilestone={onDeleteMilestone}
                        githubIssues={githubIssues}
                        searchTerm={searchTerm}
                    />
                </div>
            </div>

            <div className="lg:hidden flex-1 overflow-hidden">
                {viewMode === "edit" ? (
                    <EditorPane
                        milestones={milestones}
                        onAddMilestone={onAddMilestone}
                        onEditMilestone={onEditMilestone}
                        onDeleteMilestone={onDeleteMilestone}
                        githubIssues={githubIssues}
                        searchTerm={searchTerm}
                    />
                ) : (
                    <PreviewPane
                        milestones={milestones}
                        onEditMilestone={onEditMilestone}
                        onDeleteMilestone={onDeleteMilestone}
                        githubIssues={githubIssues}
                        searchTerm={searchTerm}
                    />
                )}
            </div>
        </div>
    );
};

const EditorPane = ({
    milestones,
    onAddMilestone,
    onEditMilestone,
    onDeleteMilestone,
    githubIssues,
    searchTerm,
}: {
    milestones: Milestone[];
    onAddMilestone: () => void;
    onEditMilestone: (milestone: Milestone) => void;
    onDeleteMilestone: (id: string) => void;
    githubIssues: RepositoryIssue[];
    searchTerm: string;
}) => {
    const filteredMilestones = useMemo(() => {
        if (!searchTerm) return milestones;

        const term = searchTerm.toLowerCase();
        return milestones.filter(
            (milestone) =>
                milestone.title.toLowerCase().includes(term) ||
                milestone.description.toLowerCase().includes(term) ||
                milestone.assignee.toLowerCase().includes(term)
        );
    }, [milestones, searchTerm]);

    return (
        <div className="h-full overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-[var(--font-heading)] font-semibold text-lg text-[var(--page-text-primary)]">Milestone Editor</h3>
                    {searchTerm && (
                        <p className="text-sm text-[var(--page-text-secondary)] mt-1">
                            {filteredMilestones.length} result{filteredMilestones.length !== 1 ? "s" : ""} for "{searchTerm}"
                        </p>
                    )}
                </div>
                <button
                    onClick={onAddMilestone}
                    className="cursor-pointer flex items-center gap-2 px-3 py-2 bg-[var(--brand-color)] text-[var(--page-bg)] rounded-lg hover:opacity-90 transition-opacity"
                >
                    <FiPlus className="w-4 h-4" />
                    <span>Add Milestone</span>
                </button>
            </div>

            <div className="space-y-4">
                {filteredMilestones.length > 0 ? (
                    filteredMilestones.map((milestone) => (
                        <MilestoneCard
                            key={milestone.id}
                            milestone={milestone}
                            onEdit={onEditMilestone}
                            onDelete={onDeleteMilestone}
                            githubIssues={githubIssues}
                        />
                    ))
                ) : (
                    <div className="text-center py-12">
                        <FiSearch className="w-16 h-16 text-[var(--page-text-secondary)] mx-auto mb-4" />
                        <h3 className="font-[var(--font-heading)] font-semibold text-lg text-[var(--page-text-primary)] mb-2">
                            {searchTerm ? "No milestones found" : "No milestones yet"}
                        </h3>
                        <p className="text-[var(--page-text-secondary)] mb-4">
                            {searchTerm
                                ? `No milestones match "${searchTerm}". Try a different search term.`
                                : "Create your first milestone to get started!"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

const PreviewPane = ({
    milestones,
    onEditMilestone,
    onDeleteMilestone,
    githubIssues,
    searchTerm,
}: {
    milestones: Milestone[];
    onEditMilestone: (milestone: Milestone) => void;
    onDeleteMilestone: (id: string) => void;
    githubIssues: RepositoryIssue[];
    searchTerm: string;
}) => {
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const [viewMode, setViewMode] = useState<"timeline" | "analytics" | "grid">("timeline");
    const [filterRisk, setFilterRisk] = useState<string>("all");

    const toggleExpansion = (id: string) => {
        setExpandedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
    };

    const filteredMilestones = useMemo(() => {
        let filtered = milestones;

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (milestone) =>
                    milestone.title.toLowerCase().includes(term) ||
                    milestone.description.toLowerCase().includes(term) ||
                    milestone.assignee.toLowerCase().includes(term)
            );
        }

        if (filterRisk !== "all") {
            filtered = filtered.filter((m) => m.riskLevel === filterRisk);
        }

        return filtered;
    }, [milestones, searchTerm, filterRisk]);

    const analytics = useMemo(() => {
        const total = filteredMilestones.length;
        const completed = filteredMilestones.filter((m) => m.progress === 100).length;
        const inProgress = filteredMilestones.filter((m) => m.progress > 0 && m.progress < 100).length;
        const notStarted = filteredMilestones.filter((m) => m.progress === 0).length;
        const overallProgress = total > 0 ? Math.round(filteredMilestones.reduce((sum, m) => sum + m.progress, 0) / total) : 0;

        const riskCounts = {
            sunny: filteredMilestones.filter((m) => m.riskLevel === "sunny").length,
            cloudy: filteredMilestones.filter((m) => m.riskLevel === "cloudy").length,
            rainy: filteredMilestones.filter((m) => m.riskLevel === "rainy").length,
            stormy: filteredMilestones.filter((m) => m.riskLevel === "stormy").length,
        };

        const totalIssues = filteredMilestones.reduce((sum, m) => sum + m.repositoryIssues.length, 0);

        return {
            total,
            completed,
            inProgress,
            notStarted,
            overallProgress,
            riskCounts,
            totalIssues,
        };
    }, [filteredMilestones]);

    const sortedMilestones = useMemo(() => {
        return [...filteredMilestones].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    }, [filteredMilestones]);

    const StatsCard = ({
        title,
        value,
        icon: Icon,
        color,
        subtitle,
    }: {
        title: string;
        value: string | number;
        icon: any;
        color: string;
        subtitle?: string;
    }) => (
        <div className="bg-[var(--card-bg)] border border-[var(--border-color-primary)] rounded-xl p-6 hover:border-[var(--accent-blue)] transition-colors">
            <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-[var(--page-text-primary)]">{value}</span>
            </div>
            <h3 className="font-[var(--font-heading)] font-semibold text-[var(--page-text-primary)] mb-1">{title}</h3>
            {subtitle && <p className="text-sm text-[var(--page-text-secondary)]">{subtitle}</p>}
        </div>
    );

    const ProgressChart = () => {
        const radius = 45;
        const circumference = 2 * Math.PI * radius;
        const strokeDasharray = `${(analytics.overallProgress / 100) * circumference} ${circumference}`;

        return (
            <div className="bg-[var(--card-bg)] border border-[var(--border-color-primary)] rounded-xl p-6">
                <h3 className="font-[var(--font-heading)] font-semibold text-lg text-[var(--page-text-primary)] mb-6">Overall Progress</h3>
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r={radius} stroke="var(--card-bg-secondary)" strokeWidth="8" fill="transparent" />
                            <circle
                                cx="50"
                                cy="50"
                                r={radius}
                                stroke="var(--accent-blue)"
                                strokeWidth="8"
                                fill="transparent"
                                strokeDasharray={strokeDasharray}
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-bold text-[var(--page-text-primary)]">{analytics.overallProgress}%</span>
                        </div>
                    </div>
                    <div className="flex-1 space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-[var(--page-text-secondary)]">Completed</span>
                            <span className="font-medium text-green-600">{analytics.completed}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-[var(--page-text-secondary)]">In Progress</span>
                            <span className="font-medium text-blue-600">{analytics.inProgress}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-[var(--page-text-secondary)]">Not Started</span>
                            <span className="font-medium text-gray-600">{analytics.notStarted}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const RiskHeatmap = () => (
        <div className="bg-[var(--card-bg)] border border-[var(--border-color-primary)] rounded-xl p-6">
            <h3 className="font-[var(--font-heading)] font-semibold text-lg text-[var(--page-text-primary)] mb-6">Risk Assessment</h3>
            <div className="space-y-4">
                {[
                    { risk: "sunny", label: "Low Risk", count: analytics.riskCounts.sunny, color: "bg-green-500", icon: FiSunset },
                    { risk: "cloudy", label: "Medium Risk", count: analytics.riskCounts.cloudy, color: "bg-yellow-500", icon: FiCloud },
                    { risk: "rainy", label: "High Risk", count: analytics.riskCounts.rainy, color: "bg-orange-500", icon: FiCloudRain },
                    { risk: "stormy", label: "Critical Risk", count: analytics.riskCounts.stormy, color: "bg-red-500", icon: FiCloudSnow },
                ].map(({ risk, label, count, color, icon: Icon }) => (
                    <div key={risk} className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center`}>
                            <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-medium text-[var(--page-text-primary)]">{label}</span>
                                <span className="text-sm text-[var(--page-text-secondary)]">{count}</span>
                            </div>
                            <div className="w-full bg-[var(--card-bg-secondary)] rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full ${color} transition-all duration-500`}
                                    style={{ width: `${analytics.total > 0 ? (count / analytics.total) * 100 : 0}%` }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const TimelineMilestone = ({ milestone, index }: { milestone: Milestone; index: number }) => {
        const linkedIssues = githubIssues.filter((issue) => milestone.repositoryIssues.includes(issue.number.toString()));

        const daysUntilDue = Math.ceil((new Date(milestone.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        const isOverdue = daysUntilDue < 0;
        const isDueSoon = daysUntilDue <= 7 && daysUntilDue >= 0;

        return (
            <div className="relative">
                {index < sortedMilestones.length - 1 && (
                    <div className="absolute left-6 top-16 w-0.5 h-16 bg-[var(--border-color-primary)]" />
                )}

                <div
                    className={`absolute left-4 top-8 w-4 h-4 rounded-full border-4 ${
                        milestone.progress === 100
                            ? "bg-green-500 border-green-200"
                            : isOverdue
                            ? "bg-red-500 border-red-200"
                            : isDueSoon
                            ? "bg-yellow-500 border-yellow-200"
                            : "bg-blue-500 border-blue-200"
                    }`}
                />

                <div className="ml-12 mb-8">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-[var(--card-bg)] border border-[var(--border-color-primary)] rounded-xl p-6 hover:border-[var(--accent-blue)] transition-all"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <WeatherIcon risk={milestone.riskLevel} />
                                <div>
                                    <h3 className="font-[var(--font-heading)] font-semibold text-[var(--page-text-primary)]">
                                        {milestone.title}
                                    </h3>
                                    <p className="text-sm text-[var(--page-text-secondary)]">
                                        Due {new Date(milestone.dueDate).toLocaleDateString()}
                                        {isOverdue && (
                                            <span className="text-red-500 ml-2 font-medium">({Math.abs(daysUntilDue)} days overdue)</span>
                                        )}
                                        {isDueSoon && <span className="text-yellow-600 ml-2 font-medium">({daysUntilDue} days left)</span>}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <p className="text-[var(--page-text-secondary)] text-sm mb-4 line-clamp-2">{milestone.description}</p>

                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-[var(--page-text-secondary)]">Progress</span>
                                    <span className="font-medium text-[var(--page-text-primary)]">{milestone.progress}%</span>
                                </div>
                                <div className="w-full bg-[var(--card-bg-secondary)] rounded-full h-2">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${milestone.progress}%` }}
                                        transition={{ duration: 0.8, delay: index * 0.1 }}
                                        className={`h-2 rounded-full ${
                                            milestone.progress === 100
                                                ? "bg-green-500"
                                                : milestone.progress >= 75
                                                ? "bg-blue-500"
                                                : milestone.progress >= 50
                                                ? "bg-yellow-500"
                                                : "bg-orange-500"
                                        }`}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1">
                                        <FiUser className="w-3 h-3 text-[var(--page-text-secondary)]" />
                                        <span className="text-[var(--page-text-secondary)]">{milestone.assignee}</span>
                                    </div>
                                    {linkedIssues.length > 0 && (
                                        <div className="flex items-center gap-1">
                                            <FiLink className="w-3 h-3 text-[var(--page-text-secondary)]" />
                                            <span className="text-[var(--page-text-secondary)]">{linkedIssues.length} issues</span>
                                        </div>
                                    )}
                                </div>
                                <div
                                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                                        milestone.progress === 100
                                            ? "bg-green-100 text-green-800"
                                            : isOverdue
                                            ? "bg-red-100 text-red-800"
                                            : isDueSoon
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-blue-100 text-blue-800"
                                    }`}
                                >
                                    {milestone.progress === 100 ? "Completed" : isOverdue ? "Overdue" : isDueSoon ? "Due Soon" : "On Track"}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    };

    const GridView = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredMilestones.map((milestone, index) => {
                const linkedIssues = githubIssues.filter((issue) => milestone.repositoryIssues.includes(issue.number.toString()));

                return (
                    <motion.div
                        key={milestone.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-[var(--card-bg)] border border-[var(--border-color-primary)] rounded-xl p-6 hover:border-[var(--accent-blue)] transition-all"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <WeatherIcon risk={milestone.riskLevel} />
                                <h3 className="font-[var(--font-heading)] font-semibold text-[var(--page-text-primary)]">
                                    {milestone.title}
                                </h3>
                            </div>
                        </div>

                        <p className="text-[var(--page-text-secondary)] text-sm mb-4">{milestone.description}</p>

                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-[var(--page-text-secondary)]">Progress</span>
                                    <span className="font-medium text-[var(--page-text-primary)]">{milestone.progress}%</span>
                                </div>
                                <ProgressBar progress={milestone.progress} />
                            </div>

                            <div className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                    <FiCalendar className="w-3 h-3 text-[var(--page-text-secondary)]" />
                                    <span className="text-[var(--page-text-secondary)]">{milestone.dueDate}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FiUser className="w-3 h-3 text-[var(--page-text-secondary)]" />
                                    <span className="text-[var(--page-text-secondary)]">{milestone.assignee}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <FiLink className="w-3 h-3 text-[var(--page-text-secondary)]" />
                                <span className="text-xs text-[var(--page-text-secondary)]">{linkedIssues.length} linked issues</span>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );

    return (
        <div className="h-full overflow-y-auto p-6">
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="font-[var(--font-heading)] font-bold text-2xl text-[var(--page-text-primary)] mb-2">
                            Roadmap Preview
                        </h3>
                        <p className="text-[var(--page-text-secondary)]">
                            Interactive overview of your milestone roadmap with analytics and timeline
                        </p>
                    </div>
                </div>

                <div className="flex justify-end ">
                    <div className="flex justify-end gap-2 p-1 mb-6 bg-[var(--card-bg-secondary)] rounded-lg">
                        {[
                            { mode: "timeline", icon: FiActivity, label: "Timeline" },
                            { mode: "analytics", icon: FiBarChart, label: "Analytics" },
                            { mode: "grid", icon: FiTarget, label: "Grid" },
                        ].map(({ mode, icon: Icon, label }) => (
                            <button
                                key={mode}
                                onClick={() => setViewMode(mode as any)}
                                className={`cursor-pointer flex items-center gap-2 px-3 py-2 rounded transition-colors ${
                                    viewMode === mode
                                        ? "bg-[var(--card-bg)] text-[var(--page-text-primary)]"
                                        : "text-[var(--page-text-secondary)] hover:text-[var(--page-text-primary)]"
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="text-sm font-medium">{label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <FiFilter className="w-4 h-4 text-[var(--page-text-secondary)]" />
                        <span className="hidden sm:inline text-sm font-medium text-[var(--page-text-secondary)]">Filter by risk:</span>
                    </div>
                    <div className="flex gap-2">
                        {[
                            { value: "all", label: "All", count: milestones.length },
                            { value: "sunny", label: "Low", count: milestones.filter((m) => m.riskLevel === "sunny").length },
                            { value: "cloudy", label: "Medium", count: milestones.filter((m) => m.riskLevel === "cloudy").length },
                            { value: "rainy", label: "High", count: milestones.filter((m) => m.riskLevel === "rainy").length },
                            { value: "stormy", label: "Critical", count: milestones.filter((m) => m.riskLevel === "stormy").length },
                        ].map(({ value, label, count }) => (
                            <button
                                key={value}
                                onClick={() => setFilterRisk(value)}
                                className={`cursor-pointer px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                    filterRisk === value
                                        ? "bg-[var(--accent-blue)] text-white"
                                        : "bg-[var(--card-bg-secondary)] text-[var(--page-text-secondary)] hover:bg-[var(--accent-blue-light)]"
                                }`}
                            >
                                {label} ({count})
                            </button>
                        ))}
                    </div>
                </div>

                {searchTerm && (
                    <div className="bg-[var(--card-bg-secondary)] rounded-lg p-4 border border-[var(--border-color-primary)]">
                        <div className="flex items-center gap-2">
                            <FiSearch className="w-4 h-4 text-[var(--accent-blue)]" />
                            <span className="text-sm font-medium text-[var(--page-text-primary)]">
                                Search Results: {filteredMilestones.length} milestone{filteredMilestones.length !== 1 ? "s" : ""} found for
                                "{searchTerm}"
                            </span>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex-1 min-h-0 overflow-auto">
                {viewMode === "analytics" && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatsCard
                                title="Total Milestones"
                                value={analytics.total}
                                icon={FiTarget}
                                color="bg-blue-500"
                                subtitle="Project milestones"
                            />
                            <StatsCard
                                title="Completed"
                                value={analytics.completed}
                                icon={FiCheck}
                                color="bg-green-500"
                                subtitle={`${
                                    analytics.total > 0 ? Math.round((analytics.completed / analytics.total) * 100) : 0
                                }% complete`}
                            />
                            <StatsCard
                                title="In Progress"
                                value={analytics.inProgress}
                                icon={FiTrendingUp}
                                color="bg-orange-500"
                                subtitle="Active milestones"
                            />
                            <StatsCard
                                title="Repository Issues"
                                value={analytics.totalIssues}
                                icon={FiLink}
                                color="bg-purple-500"
                                subtitle="Linked issues"
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <ProgressChart />
                            <RiskHeatmap />
                        </div>
                    </div>
                )}

                {viewMode === "timeline" && (
                    <div className="max-w-4xl">
                        {sortedMilestones.length > 0 ? (
                            <div className="space-y-0">
                                {sortedMilestones.map((milestone, index) => (
                                    <TimelineMilestone key={milestone.id} milestone={milestone} index={index} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <FiTarget className="w-16 h-16 text-[var(--page-text-secondary)] mx-auto mb-4" />
                                <h3 className="font-[var(--font-heading)] font-semibold text-lg text-[var(--page-text-primary)] mb-2">
                                    No milestones found
                                </h3>
                                <p className="text-[var(--page-text-secondary)] mb-4">
                                    {filterRisk === "all"
                                        ? "Create your first milestone to get started with your roadmap!"
                                        : `No milestones found with ${filterRisk} risk level.`}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {viewMode === "grid" && (
                    <div>
                        {filteredMilestones.length > 0 ? (
                            <GridView />
                        ) : (
                            <div className="text-center py-12">
                                <FiTarget className="w-16 h-16 text-[var(--page-text-secondary)] mx-auto mb-4" />
                                <h3 className="font-[var(--font-heading)] font-semibold text-lg text-[var(--page-text-primary)] mb-2">
                                    No milestones found
                                </h3>
                                <p className="text-[var(--page-text-secondary)] mb-4">
                                    {filterRisk === "all"
                                        ? "Create your first milestone to get started with your roadmap!"
                                        : `No milestones found with ${filterRisk} risk level.`}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                <div className="lg:hidden mt-8">
                    <h4 className="font-[var(--font-heading)] font-semibold text-lg text-[var(--page-text-primary)] mb-4">
                        Mobile Quick View
                    </h4>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {filteredMilestones.map((milestone) => (
                            <motion.div
                                key={milestone.id}
                                initial={false}
                                className="bg-[var(--card-bg)] border border-[var(--border-color-primary)] rounded-lg overflow-hidden"
                            >
                                <button
                                    onClick={() => toggleExpansion(milestone.id)}
                                    className="cursor-pointer w-full flex items-center justify-between p-4 hover:bg-[var(--card-bg-secondary)] transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <WeatherIcon risk={milestone.riskLevel} />
                                        <div className="text-left">
                                            <span className="font-medium text-[var(--page-text-primary)] block">{milestone.title}</span>
                                            <span className="text-xs text-[var(--page-text-secondary)]">
                                                {milestone.progress}% complete
                                            </span>
                                        </div>
                                    </div>
                                    {expandedItems.includes(milestone.id) ? (
                                        <FiChevronDown className="w-4 h-4 text-[var(--page-text-secondary)]" />
                                    ) : (
                                        <FiChevronRight className="w-4 h-4 text-[var(--page-text-secondary)]" />
                                    )}
                                </button>

                                <AnimatePresence>
                                    {expandedItems.includes(milestone.id) && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="border-t border-[var(--border-color-primary)]"
                                        >
                                            <div className="p-4 space-y-3">
                                                <p className="text-[var(--page-text-secondary)] text-sm">{milestone.description}</p>
                                                <div>
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span className="text-[var(--page-text-secondary)]">Progress</span>
                                                        <span className="font-medium text-[var(--page-text-primary)]">
                                                            {milestone.progress}%
                                                        </span>
                                                    </div>
                                                    <ProgressBar progress={milestone.progress} />
                                                </div>
                                                <div className="flex justify-between text-xs text-[var(--page-text-secondary)]">
                                                    <span>Due: {milestone.dueDate}</span>
                                                    <span>{milestone.repositoryIssues.length} linked issues</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const MilestonePlatform = () => {
    const [milestones, setMilestones] = useState<Milestone[]>(mockMilestones);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("Link copied to clipboard!");
    const [modalOpen, setModalOpen] = useState(false);
    const [editingMilestone, setEditingMilestone] = useState<Milestone | undefined>();
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [milestoneToDelete, setMilestoneToDelete] = useState<string | null>(null);
    const [githubRepo, setGithubRepo] = useState("");
    const [githubIssues, setGithubIssues] = useState<RepositoryIssue[]>([]);
    const [isLoadingIssues, setIsLoadingIssues] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const savedRepo = localStorage.getItem("githubRepo");
        const savedMilestones = localStorage.getItem("milestones");

        if (savedRepo) {
            setGithubRepo(savedRepo);
        }

        if (savedMilestones) {
            try {
                const parsedMilestones = JSON.parse(savedMilestones);
                setMilestones(parsedMilestones);
            } catch (error) {
                console.error("Failed to parse saved milestones:", error);
                setMilestones(mockMilestones);
            }
        }

        const urlParams = new URLSearchParams(window.location.search);
        const sharedData = urlParams.get("shared");
        if (sharedData) {
            try {
                const decodedData = JSON.parse(atob(sharedData));
                if (decodedData.milestones && Array.isArray(decodedData.milestones)) {
                    setMilestones(decodedData.milestones);

                    if (decodedData.githubRepo) {
                        setGithubRepo(decodedData.githubRepo);
                    }

                    setNotificationMessage(`Loaded shared roadmap with ${decodedData.milestones.length} milestones!`);
                    setShowNotification(true);
                    setTimeout(() => setShowNotification(false), 4000);

                    window.history.replaceState({}, document.title, window.location.pathname);
                }
            } catch (error) {
                console.error("Failed to decode shared data:", error);
                setNotificationMessage("Failed to load shared roadmap data");
                setShowNotification(true);
                setTimeout(() => setShowNotification(false), 3000);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("githubRepo", githubRepo);
    }, [githubRepo]);

    useEffect(() => {
        localStorage.setItem("milestones", JSON.stringify(milestones));
    }, [milestones]);

    const fetchRepositoryIssues = async () => {
        if (!githubRepo || !githubRepo.includes("/")) return;

        setIsLoadingIssues(true);
        try {
            const [owner, repo] = githubRepo.split("/");
            const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues?state=all&per_page=100`);

            if (response.ok) {
                const issues = await response.json();
                const filteredIssues = issues.filter((issue: any) => !issue.pull_request);
                setGithubIssues(filteredIssues);
            } else {
                console.error("Failed to fetch repository issues:", response.statusText);
                setGithubIssues([]);
            }
        } catch (error) {
            console.error("Failed to fetch repository issues:", error);
            setGithubIssues([]);
        } finally {
            setIsLoadingIssues(false);
        }
    };

    useEffect(() => {
        if (githubRepo.includes("/")) {
            fetchRepositoryIssues();
        }
    }, [githubRepo]);

    const generateShareURL = () => {
        try {
            const shareData = {
                milestones: milestones,
                githubRepo: githubRepo,
                timestamp: new Date().toISOString(),
                version: "1.0",
            };

            const encodedData = btoa(JSON.stringify(shareData));

            const baseURL = window.location.origin + window.location.pathname;
            const shareURL = `${baseURL}?shared=${encodedData}`;

            navigator.clipboard
                .writeText(shareURL)
                .then(() => {
                    setNotificationMessage("Collaborative roadmap link copied to clipboard!");
                    setShowNotification(true);
                    setTimeout(() => setShowNotification(false), 3000);
                })
                .catch(() => {
                    const textArea = document.createElement("textarea");
                    textArea.value = shareURL;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand("copy");
                    document.body.removeChild(textArea);
                    setNotificationMessage("Collaborative roadmap link copied to clipboard!");
                    setShowNotification(true);
                    setTimeout(() => setShowNotification(false), 3000);
                });
        } catch (error) {
            console.error("Failed to generate share URL:", error);
            setNotificationMessage("Failed to generate share link");
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 3000);
        }
    };

    const openAddModal = () => {
        setEditingMilestone(undefined);
        setModalOpen(true);
    };

    const openEditModal = (milestone: Milestone) => {
        setEditingMilestone(milestone);
        setModalOpen(true);
    };

    const handleSaveMilestone = (formData: MilestoneFormData) => {
        if (editingMilestone) {
            setMilestones((prev) => prev.map((m) => (m.id === editingMilestone.id ? { ...m, ...formData } : m)));
        } else {
            const newMilestone: Milestone = {
                id: Date.now().toString(),
                ...formData,
            };
            setMilestones((prev) => [...prev, newMilestone]);
        }
    };

    const requestDeleteMilestone = (id: string) => {
        const milestone = milestones.find((m) => m.id === id);
        if (milestone) {
            setMilestoneToDelete(id);
            setConfirmDeleteOpen(true);
        }
    };

    const confirmDeleteMilestone = () => {
        if (milestoneToDelete) {
            setMilestones((prev) => prev.filter((m) => m.id !== milestoneToDelete));
            setMilestoneToDelete(null);
            setConfirmDeleteOpen(false);
        }
    };

    const cancelDelete = () => {
        setMilestoneToDelete(null);
        setConfirmDeleteOpen(false);
    };

    const getMilestoneTitle = () => {
        if (milestoneToDelete) {
            const milestone = milestones.find((m) => m.id === milestoneToDelete);
            return milestone?.title || "this milestone";
        }
        return "this milestone";
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <Notification show={showNotification} message={notificationMessage} onClose={() => setShowNotification(false)} />
            <TopHeader
                shareURL={generateShareURL}
                showNotification={showNotification}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
            />
            <ResizablePanes
                milestones={milestones}
                onAddMilestone={openAddModal}
                onEditMilestone={openEditModal}
                onDeleteMilestone={requestDeleteMilestone}
                githubIssues={githubIssues}
                searchTerm={searchTerm}
            />
            <AnimatePresence>
                <MilestoneModal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    milestone={editingMilestone}
                    onSave={handleSaveMilestone}
                    onDelete={requestDeleteMilestone}
                    githubRepo={githubRepo}
                    setGithubRepo={setGithubRepo}
                    githubIssues={githubIssues}
                    onFetchIssues={fetchRepositoryIssues}
                    isLoadingIssues={isLoadingIssues}
                />
            </AnimatePresence>
            <AnimatePresence>
                <ConfirmationModal
                    isOpen={confirmDeleteOpen}
                    onClose={cancelDelete}
                    onConfirm={confirmDeleteMilestone}
                    title="Delete Milestone"
                    message={`Are you sure you want to delete "${getMilestoneTitle()}"? This action cannot be undone.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                />
            </AnimatePresence>
        </div>
    );
};

export default function Home() {
    return (
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            <GlobalThemeStyles />
            <MilestonePlatform />
        </ThemeProvider>
    );
}
