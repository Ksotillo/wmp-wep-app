"use client";

import React, { useState, useEffect, useRef } from "react";
import { ThemeProvider, useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiPlus,
    FiMoreHorizontal,
    FiAlertCircle,
    FiRefreshCw,
    FiUser,
    FiCalendar,
    FiFlag,
    FiLink,
    FiChevronDown,
    FiChevronUp,
    FiSun,
    FiMoon,
    FiBell,
    FiCheckCircle,
    FiThumbsUp,
    FiZap,
    FiAlertTriangle,
    FiXCircle,
    FiX,
    FiSave,
    FiTwitter,
    FiGithub,
    FiLinkedin,
    FiMail,
    FiHelpCircle,
    FiBook,
    FiUsers,
    FiHeart,
    FiLogOut,
    FiSettings,
    FiEdit3,
    FiClock,
} from "react-icons/fi";
import { Tooltip } from "react-tooltip";
import { toast, Toaster } from "sonner";

type Priority = "low" | "medium" | "high";
type TaskStatus = "information" | "planning" | "project-task" | "meetings";

interface TaskDependency {
    id: string;
    targetId: string;
}

interface Task {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: Priority;
    progress: number;
    dueDate: string;
    assignees: string[];
    subtasks?: { completed: number; total: number };
    dependencies: string[];
}

interface Column {
    id: TaskStatus;
    title: string;
    color: string;
    tasks: Task[];
    isLoading: boolean;
    hasError: boolean;
}

const GlobalThemeStyles = () => (
    <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Roboto:wght@300;400;500&display=swap");

        :root {
            --page-bg: #fafafa;
            --page-text-primary: #1a1a1a;
            --page-text-secondary: #6b7280;
            --card-bg: #ffffff;
            --card-border: #e5e7eb;
            --column-bg: #f8fafc;
            --column-header: #374151;
            --accent-primary: #f97316;
            --accent-secondary: #ea580c;
            --accent-badge: #ff6b35;
            --priority-high: #ef4444;
            --priority-medium: #f97316;
            --priority-low: #10b981;
            --progress-excellent: #10b981;
            --progress-good: #22c55e;
            --progress-moderate: #eab308;
            --progress-poor: #f97316;
            --progress-critical: #ef4444;
            --button-primary: #171717;
            --button-hover: #f3f4f6;
            --shimmer-base: #f1f5f9;
            --shimmer-highlight: #e2e8f0;
            --shadow-drag: rgba(249, 115, 22, 0.15);
            --orange-light: #fed7aa;
            --orange-dark: #c2410c;
            --font-heading: "Montserrat", sans-serif;
            --font-body: "Roboto", sans-serif;
            --scrollbar-thumb: #cbd5e1;
            --scrollbar-track: #f1f5f9;
        }

        html.dark {
            --page-bg: #0f172a;
            --page-text-primary: #f1f5f9;
            --page-text-secondary: #94a3b8;
            --card-bg: #1e293b;
            --card-border: #334155;
            --column-bg: #1a1a2e;
            --column-header: #e2e8f0;
            --accent-primary: #fb923c;
            --accent-secondary: #f97316;
            --accent-badge: #ff6b35;
            --priority-high: #f87171;
            --priority-medium: #fb923c;
            --priority-low: #34d399;
            --progress-excellent: #34d399;
            --progress-good: #4ade80;
            --progress-moderate: #facc15;
            --progress-poor: #fb923c;
            --progress-critical: #f87171;
            --button-primary: #171717;
            --button-hover: #334155;
            --shimmer-base: #1e293b;
            --shimmer-highlight: #334155;
            --shadow-drag: rgba(251, 146, 60, 0.2);
            --orange-light: #fed7aa;
            --orange-dark: #c2410c;
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
        }

        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }

        ::-webkit-scrollbar-track {
            background: var(--scrollbar-track);
        }

        ::-webkit-scrollbar-thumb {
            background: var(--scrollbar-thumb);
            border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: var(--page-text-secondary);
        }

        .shimmer {
            background: linear-gradient(90deg, var(--shimmer-base) 25%, var(--shimmer-highlight) 50%, var(--shimmer-base) 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
            0% {
                background-position: -200% 0;
            }
            100% {
                background-position: 200% 0;
            }
        }
    `}</style>
);

const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="cursor-pointer p-2 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)] hover:bg-[var(--button-hover)] transition-colors"
            data-tooltip-id="theme-toggle"
            data-tooltip-content={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
            {theme === "dark" ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
        </button>
    );
};

const Header = ({
    loadingStates,
}: {
    loadingStates: {
        retrying: string | null;
        creatingTask: boolean;
        initialLoad: boolean;
    };
}) => {
    const [notificationCount] = useState(3);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    const mockNotifications = [
        {
            id: 1,
            type: "task_completed",
            title: "Task completed",
            message: '"UI/UX Design System" was marked as complete',
            time: "2 minutes ago",
            icon: FiCheckCircle,
            color: "text-green-500",
        },
        {
            id: 2,
            type: "dependency_blocked",
            title: "Dependency issue",
            message: 'Task "Error Handling" is waiting for dependencies',
            time: "1 hour ago",
            icon: FiAlertTriangle,
            color: "text-yellow-500",
        },
        {
            id: 3,
            type: "assignment",
            title: "New assignment",
            message: 'You were assigned to "Context-Aware Tooltips"',
            time: "3 hours ago",
            icon: FiUser,
            color: "text-blue-500",
        },
    ];

    const profileMenuItems = [
        {
            label: "Edit Profile",
            icon: FiEdit3,
            action: () => toast.success("Edit profile clicked!"),
        },
        {
            label: "Settings",
            icon: FiSettings,
            action: () => toast.success("Settings clicked!"),
        },
        {
            label: "Activity Log",
            icon: FiClock,
            action: () => toast.success("Activity log clicked!"),
        },
        {
            label: "Sign Out",
            icon: FiLogOut,
            action: () => toast.success("Sign out clicked!"),
        },
    ];

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
        setShowProfile(false);
    };

    const toggleProfile = () => {
        setShowProfile(!showProfile);
        setShowNotifications(false);
    };

    const markNotificationAsRead = (id: number) => {
        toast.success("Notification marked as read");
    };

    useEffect(() => {
        const handleClickOutside = () => {
            setShowNotifications(false);
            setShowProfile(false);
        };

        if (showNotifications || showProfile) {
            document.addEventListener("click", handleClickOutside);
            return () => document.removeEventListener("click", handleClickOutside);
        }
    }, [showNotifications, showProfile]);

    return (
        <header className="bg-[var(--card-bg)] border-b border-[var(--card-border)] px-4 md:px-6 py-4 mb-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <div className="w-8 h-8 bg-[var(--accent-primary)] rounded-lg flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-lg">P</span>
                    </div>
                    <div className="hidden md:block">
                        <h1 className="text-xl font-bold text-[var(--page-text-primary)]">ProjectFlow</h1>
                        <p className="text-xs text-[var(--page-text-secondary)]">Team Collaboration Hub</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <button
                            onClick={toggleNotifications}
                            className="cursor-pointer relative p-2 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)] hover:bg-[var(--button-hover)] transition-colors"
                            data-tooltip-id="notifications"
                            data-tooltip-content={
                                loadingStates.initialLoad
                                    ? "Loading board data..."
                                    : loadingStates.retrying
                                    ? `Retrying ${loadingStates.retrying} tasks...`
                                    : loadingStates.creatingTask
                                    ? "Creating new task..."
                                    : `${notificationCount} notifications`
                            }
                        >
                            <FiBell className="w-4 h-4 text-[var(--page-text-primary)]" />
                            {notificationCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--accent-badge)] text-white text-xs rounded-full flex items-center justify-center font-medium">
                                    {notificationCount}
                                </span>
                            )}
                        </button>

                        <AnimatePresence>
                            {showNotifications && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg shadow-xl z-50"
                                >
                                    <div className="p-4 border-b border-[var(--card-border)]">
                                        <h3 className="text-sm font-semibold text-[var(--page-text-primary)]">Notifications</h3>
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        {mockNotifications.map((notification) => (
                                            <div
                                                key={notification.id}
                                                className="p-4 hover:bg-[var(--button-hover)] transition-colors border-b border-[var(--card-border)] last:border-b-0 cursor-pointer"
                                                onClick={() => markNotificationAsRead(notification.id)}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <notification.icon className={`w-4 h-4 mt-0.5 ${notification.color}`} />
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-[var(--page-text-primary)]">
                                                            {notification.title}
                                                        </p>
                                                        <p className="text-xs text-[var(--page-text-secondary)] mt-1">
                                                            {notification.message}
                                                        </p>
                                                        <p className="text-xs text-[var(--page-text-secondary)] mt-2">
                                                            {notification.time}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-3 border-t border-[var(--card-border)]">
                                        <button className="cursor-pointer text-xs text-[var(--accent-primary)] hover:underline w-full text-center">
                                            View all notifications
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <ThemeToggle />

                    <div className="relative">
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-medium text-[var(--page-text-primary)]">David Quint</p>
                                <p className="text-xs text-[var(--page-text-secondary)]">Project Manager</p>
                            </div>
                            <button
                                onClick={toggleProfile}
                                className="cursor-pointer w-10 h-10 rounded-full overflow-hidden hover:opacity-90 transition-opacity border-2 border-[var(--accent-primary)]"
                                data-tooltip-id="profile"
                                data-tooltip-content="View profile"
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1745895259267-8ae241079533?q=80&w=3164&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                    alt="David Quint"
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        </div>

                        <AnimatePresence>
                            {showProfile && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute right-0 top-full mt-2 w-56 max-w-[calc(100vw-2rem)] bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg shadow-xl z-50"
                                >
                                    <div className="p-4 border-b border-[var(--card-border)]">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src="https://images.unsplash.com/photo-1745895259267-8ae241079533?q=80&w=3164&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                                alt="David Quint"
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                            <div>
                                                <p className="text-sm font-medium text-[var(--page-text-primary)]">David Quint</p>
                                                <p className="text-xs text-[var(--page-text-secondary)]">david@projectflow.com</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="py-2">
                                        {profileMenuItems.map((item, index) => (
                                            <button
                                                key={index}
                                                onClick={item.action}
                                                className="cursor-pointer w-full flex items-center gap-3 px-4 py-2 text-sm text-[var(--page-text-primary)] hover:bg-[var(--button-hover)] transition-colors"
                                            >
                                                <item.icon className="w-4 h-4" />
                                                {item.label}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </header>
    );
};

const LoadingShimmer = ({ className }: { className: string }) => <div className={`shimmer rounded ${className}`} />;

const formatDateForDisplay = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
        return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
        return "Tomorrow";
    } else {
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
};

const TaskCard = ({
    task,
    isDragging,
    onDragStart,
    onDragEnd,
    isLoading,
    onEdit,
    taskRef,
}: {
    task: Task;
    isDragging: boolean;
    onDragStart: (taskId: string) => void;
    onDragEnd: () => void;
    isLoading: boolean;
    onEdit?: (task: Task) => void;
    taskRef?: React.RefObject<HTMLDivElement | null>;
}) => {
    const [isHovered, setIsHovered] = useState(false);

    const priorityColors = {
        high: "var(--priority-high)",
        medium: "var(--priority-medium)",
        low: "var(--priority-low)",
    };

    const getProgressColor = (progress: number) => {
        if (progress >= 80) return "var(--progress-excellent)";
        if (progress >= 60) return "var(--progress-good)";
        if (progress >= 40) return "var(--progress-moderate)";
        if (progress >= 20) return "var(--progress-poor)";
        return "var(--progress-critical)";
    };

    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData("text/plain", task.id);
        e.dataTransfer.effectAllowed = "move";
        onDragStart(task.id);
    };

    const handleDragEnd = () => {
        onDragEnd();
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    if (isLoading) {
        return (
            <div className="p-4 mb-3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg">
                <LoadingShimmer className="h-4 w-3/4 mb-2" />
                <LoadingShimmer className="h-3 w-1/2 mb-3" />
                <LoadingShimmer className="h-2 w-full mb-2" />
                <div className="flex justify-between items-center">
                    <LoadingShimmer className="h-3 w-16" />
                    <LoadingShimmer className="h-6 w-6 rounded-full" />
                </div>
            </div>
        );
    }

    return (
        <div
            ref={taskRef}
            data-task-id={task.id}
            className={`relative z-10 p-4 mb-3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg transition-all duration-300 hover:shadow-lg cursor-pointer hover:-translate-y-1 ${
                isDragging ? "opacity-50" : ""
            } ${isHovered ? "ring-2 ring-[var(--accent-primary)]/30" : ""}`}
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => onEdit && onEdit(task)}
        >
            <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-medium text-[var(--page-text-primary)] line-clamp-2">{task.title}</h4>
                <div className="flex items-center gap-1 ml-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: priorityColors[task.priority] }} />
                    <button className="cursor-pointer opacity-0 group-hover:opacity-100 p-1 hover:bg-[var(--button-hover)] rounded">
                        <FiMoreHorizontal className="w-3 h-3" />
                    </button>
                </div>
            </div>

            {task.dependencies.length > 0 && (
                <div className="flex items-center text-xs text-[var(--page-text-secondary)] mb-2">
                    <FiLink className="w-3 h-3 mr-1" />
                    {task.dependencies.length} dependencies
                </div>
            )}

            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mb-3"
                    >
                        <div className="flex justify-between text-xs text-[var(--page-text-secondary)] mb-2">
                            <span className="font-medium">Progress</span>
                            <span className="font-semibold">{task.progress}%</span>
                        </div>
                        <div className="w-full bg-[var(--shimmer-base)] rounded-full h-3 overflow-hidden shadow-inner">
                            <div
                                className="h-3 rounded-full shadow-sm transition-none"
                                style={{
                                    backgroundColor: getProgressColor(task.progress),
                                    width: `${task.progress}%`,
                                }}
                            />
                        </div>
                        <div className="flex items-center text-xs text-[var(--page-text-secondary)] mt-2 gap-1">
                            {task.progress >= 80 && (
                                <>
                                    <FiCheckCircle className="w-3 h-3 text-[var(--progress-excellent)]" />
                                    <span>Excellent progress!</span>
                                </>
                            )}
                            {task.progress >= 60 && task.progress < 80 && (
                                <>
                                    <FiThumbsUp className="w-3 h-3 text-[var(--progress-good)]" />
                                    <span>Good progress</span>
                                </>
                            )}
                            {task.progress >= 40 && task.progress < 60 && (
                                <>
                                    <FiZap className="w-3 h-3 text-[var(--progress-moderate)]" />
                                    <span>Making progress</span>
                                </>
                            )}
                            {task.progress >= 20 && task.progress < 40 && (
                                <>
                                    <FiAlertTriangle className="w-3 h-3 text-[var(--progress-poor)]" />
                                    <span>Needs attention</span>
                                </>
                            )}
                            {task.progress < 20 && (
                                <>
                                    <FiXCircle className="w-3 h-3 text-[var(--progress-critical)]" />
                                    <span>Critical - requires focus</span>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mb-3 text-xs text-[var(--page-text-secondary)] bg-[var(--orange-light)]/10 p-3 rounded-md border-l-4 border-[var(--accent-primary)]"
                    >
                        {task.description && (
                            <div className="mb-2">
                                <span className="font-medium text-[var(--page-text-primary)]">Description:</span>
                                <p className="mt-1">{task.description}</p>
                            </div>
                        )}
                        {task.subtasks && (
                            <div className="mb-2">
                                <span className="font-medium text-[var(--page-text-primary)]">Subtasks:</span>
                                <div className="mt-1 flex items-center gap-2">
                                    <span>
                                        {task.subtasks.completed}/{task.subtasks.total} completed
                                    </span>
                                    <div className="flex-1 bg-[var(--shimmer-base)] rounded-full h-1">
                                        <div
                                            className="h-1 rounded-full bg-[var(--progress-good)]"
                                            style={{ width: `${(task.subtasks.completed / task.subtasks.total) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                        {task.dependencies.length > 0 && (
                            <div>
                                <span className="font-medium text-[var(--page-text-primary)]">Dependencies:</span>
                                <p className="mt-1">Waiting on {task.dependencies.length} task(s) to complete</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex items-center justify-between text-xs">
                <div className="flex items-center text-[var(--page-text-secondary)]">
                    <FiCalendar className="w-3 h-3 mr-1" />
                    {formatDateForDisplay(task.dueDate)}
                </div>
                <div className="flex items-center">
                    <div className="flex -space-x-1">
                        {task.assignees.map((assignee, index) => (
                            <div
                                key={index}
                                className="w-6 h-6 rounded-full bg-[var(--accent-badge)] flex items-center justify-center text-white text-xs font-medium border-2 border-[var(--card-bg)]"
                            >
                                {assignee[0]}
                            </div>
                        ))}
                    </div>
                    <span
                        className="ml-2 px-2 py-1 rounded text-xs font-medium"
                        style={{
                            backgroundColor: priorityColors[task.priority] + "20",
                            color: priorityColors[task.priority],
                        }}
                    >
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                </div>
            </div>
        </div>
    );
};

const Column = ({
    column,
    onAddTask,
    onRetry,
    onDragStart,
    onDragEnd,
    draggingTask,
    onDrop,
    loadingStates,
    onEditTask,
    taskRefs,
}: {
    column: Column;
    onAddTask: (columnId: TaskStatus) => void;
    onRetry: (columnId: TaskStatus) => void;
    onDragStart: (taskId: string) => void;
    onDragEnd: () => void;
    draggingTask: string | null;
    onDrop: (taskId: string, targetColumnId: TaskStatus) => void;
    loadingStates: {
        retrying: string | null;
        creatingTask: boolean;
        initialLoad: boolean;
    };
    onEditTask: (task: Task) => void;
    taskRefs: React.MutableRefObject<Record<string, React.RefObject<HTMLDivElement | null>>>;
}) => {
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const taskId = e.dataTransfer.getData("text/plain");
        if (taskId) {
            onDrop(taskId, column.id);
        }
    };

    return (
        <div
            className={`relative z-10 flex-shrink-0 w-72 md:w-80 bg-[var(--column-bg)] rounded-lg p-3 md:p-4 transition-all duration-200 ${
                isDragOver ? "ring-2 ring-[var(--accent-primary)] bg-[var(--orange-light)]/10" : ""
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: column.color }} />
                    <h3 className="font-semibold text-[var(--column-header)]">{column.title}</h3>
                    <span className="ml-2 px-2 py-1 bg-[var(--accent-badge)] text-white text-xs rounded-full">{column.tasks.length}</span>
                </div>
                <div className="flex items-center gap-2">
                    {column.hasError && (
                        <button
                            onClick={() => onRetry(column.id)}
                            className="cursor-pointer p-1 text-[var(--priority-high)] hover:bg-[var(--button-hover)] rounded"
                            data-tooltip-id={`retry-${column.id}`}
                            data-tooltip-content={
                                loadingStates.retrying === column.id ? "Retrying - loading tasks..." : "Retry loading failed tasks"
                            }
                        >
                            <FiRefreshCw className={`w-4 h-4 ${loadingStates.retrying === column.id ? "animate-spin" : ""}`} />
                        </button>
                    )}
                    <button
                        onClick={() => onAddTask(column.id)}
                        className="cursor-pointer p-1 hover:bg-[var(--button-hover)] rounded"
                        data-tooltip-id={`add-task-${column.id}`}
                        data-tooltip-content={`Add new task to ${column.title}`}
                    >
                        <FiPlus className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {column.hasError ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <FiAlertCircle className="w-8 h-8 text-[var(--priority-high)] mb-2" />
                    <p className="text-sm text-[var(--page-text-secondary)] mb-3">Failed to load tasks</p>
                    <button
                        onClick={() => onRetry(column.id)}
                        className="cursor-pointer px-3 py-1 bg-[var(--button-primary)] text-white rounded text-sm hover:opacity-90"
                    >
                        Try Again
                    </button>
                </div>
            ) : (
                <div className="space-y-2 min-h-[400px]">
                    {column.isLoading
                        ? Array.from({ length: 3 }).map((_, index) => (
                              <TaskCard
                                  key={`loading-${index}`}
                                  task={{} as Task}
                                  isDragging={false}
                                  onDragStart={() => {}}
                                  onDragEnd={() => {}}
                                  isLoading={true}
                              />
                          ))
                        : column.tasks.map((task) => {
                              if (!taskRefs.current[task.id]) {
                                  taskRefs.current[task.id] = React.createRef<HTMLDivElement | null>();
                              }
                              return (
                                  <TaskCard
                                      key={task.id}
                                      task={task}
                                      isDragging={draggingTask === task.id}
                                      onDragStart={onDragStart}
                                      onDragEnd={onDragEnd}
                                      isLoading={false}
                                      onEdit={onEditTask}
                                      taskRef={taskRefs.current[task.id]}
                                  />
                              );
                          })}
                </div>
            )}
        </div>
    );
};

const DependencyConnector = ({
    dependencies,
    tasks,
    taskRefs,
    boardRef,
}: {
    dependencies: TaskDependency[];
    tasks: Task[];
    taskRefs: React.MutableRefObject<Record<string, React.RefObject<HTMLDivElement | null>>>;
    boardRef: React.RefObject<HTMLDivElement | null>;
}) => {
    const [lines, setLines] = useState<
        Array<{
            id: string;
            path: string;
        }>
    >([]);

    const calculateLines = () => {
        if (!boardRef.current) return;

        const newLines = dependencies
            .map((dep) => {
                const sourceRef = taskRefs.current[dep.id];
                const targetRef = taskRefs.current[dep.targetId];

                if (!sourceRef?.current || !targetRef?.current) return null;

                const boardRect = boardRef.current!.getBoundingClientRect();
                const sourceRect = sourceRef.current.getBoundingClientRect();
                const targetRect = targetRef.current.getBoundingClientRect();

                const x1 = sourceRect.right - boardRect.left;
                const y1 = sourceRect.top + sourceRect.height / 2 - boardRect.top;
                const x2 = targetRect.left - boardRect.left;
                const y2 = targetRect.top + targetRect.height / 2 - boardRect.top;

                const midX = (x1 + x2) / 2;
                const curveOffset = 20;
                const path = `M ${x1},${y1} Q ${midX},${y1 - curveOffset} ${x2},${y2}`;

                return {
                    id: `${dep.id}-${dep.targetId}`,
                    path,
                };
            })
            .filter(Boolean) as Array<{
            id: string;
            path: string;
        }>;

        setLines(newLines);
    };

    useEffect(() => {
        const timer = setTimeout(calculateLines, 500);
        return () => clearTimeout(timer);
    }, [dependencies, tasks]);

    useEffect(() => {
        const handleResize = () => setTimeout(calculateLines, 100);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <>
            <style jsx>{`
                .dependency-line {
                    stroke: var(--accent-primary);
                    stroke-width: 2;
                    fill: none;
                    stroke-dasharray: 8, 6;
                    opacity: 0.3;
                    animation: shimmerFlow 3s ease-in-out infinite;
                }

                @keyframes shimmerFlow {
                    0% {
                        opacity: 0.2;
                        stroke-width: 1.5;
                        stroke-dashoffset: 0;
                    }
                    25% {
                        opacity: 0.4;
                        stroke-width: 2;
                        stroke-dashoffset: -10;
                    }
                    50% {
                        opacity: 0.6;
                        stroke-width: 2.5;
                        stroke-dashoffset: -20;
                    }
                    75% {
                        opacity: 0.4;
                        stroke-width: 2;
                        stroke-dashoffset: -30;
                    }
                    100% {
                        opacity: 0.2;
                        stroke-width: 1.5;
                        stroke-dashoffset: -40;
                    }
                }

                .dependency-line:hover {
                    opacity: 0.8;
                    stroke-width: 3;
                    animation-duration: 1.5s;
                }
            `}</style>

            <svg
                className="absolute inset-0 pointer-events-none"
                style={{
                    width: "100%",
                    height: "100%",
                    zIndex: 1,
                }}
            >
                {lines.map((line, index) => (
                    <path
                        key={line.id}
                        className="dependency-line"
                        d={line.path}
                        style={{
                            animationDelay: `${index * 0.3}s`,
                        }}
                    />
                ))}
            </svg>
        </>
    );
};

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        product: [
            { name: "Features", href: "#", icon: FiZap },
            { name: "Documentation", href: "#", icon: FiBook },
            { name: "Help Center", href: "#", icon: FiHelpCircle },
            { name: "Community", href: "#", icon: FiUsers },
        ],
        social: [
            { name: "Twitter", href: "https://twitter.com", icon: FiTwitter },
            { name: "GitHub", href: "https://github.com", icon: FiGithub },
            { name: "LinkedIn", href: "https://linkedin.com", icon: FiLinkedin },
            { name: "Contact", href: "mailto:hello@projectflow.com", icon: FiMail },
        ],
    };

    const openLink = (linkName: string, href: string) => {
        if (href.startsWith("http") || href.startsWith("mailto:")) {
            window.open(href, "_blank");
        } else {
            toast.success(`${linkName} clicked!`);
        }
    };

    return (
        <footer className="bg-[var(--card-bg)] border-t border-[var(--card-border)] mt-16">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center mb-4">
                            <div className="w-8 h-8 bg-[var(--accent-primary)] rounded-lg flex items-center justify-center mr-3">
                                <span className="text-white font-bold text-lg">P</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[var(--page-text-primary)] font-[var(--font-heading)]">
                                    ProjectFlow
                                </h3>
                                <p className="text-xs text-[var(--page-text-secondary)]">Team Collaboration Hub</p>
                            </div>
                        </div>
                        <p className="text-sm text-[var(--page-text-secondary)] mb-6 max-w-md">
                            Streamline your project management with our advanced kanban board. Built for teams who demand efficiency,
                            transparency, and beautiful design.
                        </p>
                        <div className="flex items-center text-xs text-[var(--page-text-secondary)]">
                            <span>Made with</span>
                            <FiHeart className="w-3 h-3 mx-1 text-[var(--accent-primary)]" />
                            <span>by the ProjectFlow team</span>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-[var(--page-text-primary)] mb-4 font-[var(--font-heading)]">Product</h4>
                        <ul className="space-y-3">
                            {footerLinks.product.map((link) => (
                                <li key={link.name}>
                                    <button
                                        onClick={() => openLink(link.name, link.href)}
                                        className="cursor-pointer flex items-center text-sm text-[var(--page-text-secondary)] hover:text-[var(--accent-primary)] transition-colors group"
                                    >
                                        <link.icon className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                                        {link.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-[var(--page-text-primary)] mb-4 font-[var(--font-heading)]">Connect</h4>
                        <ul className="space-y-3">
                            {footerLinks.social.map((link) => (
                                <li key={link.name}>
                                    <button
                                        onClick={() => openLink(link.name, link.href)}
                                        className="cursor-pointer flex items-center text-sm text-[var(--page-text-secondary)] hover:text-[var(--accent-primary)] transition-colors group"
                                    >
                                        <link.icon className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                                        {link.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-[var(--card-border)] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="text-sm text-[var(--page-text-secondary)] mb-4 md:mb-0">
                        © {currentYear} ProjectFlow. All rights reserved.
                    </div>
                    <div className="flex items-center space-x-6">
                        <button
                            onClick={() => openLink("Privacy Policy", "#")}
                            className="cursor-pointer text-sm text-[var(--page-text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
                        >
                            Privacy Policy
                        </button>
                        <button
                            onClick={() => openLink("Terms of Service", "#")}
                            className="cursor-pointer text-sm text-[var(--page-text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
                        >
                            Terms of Service
                        </button>
                        <div className="flex items-center text-sm text-[var(--page-text-secondary)]">
                            <span>v2.1.0</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const TaskModal = ({
    isOpen,
    onClose,
    onSubmit,
    selectedColumn,
    setSelectedColumn,
    formData,
    setFormData,
    isCreating,
    mode,
    assigneeInput,
    setAssigneeInput,
}: {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    selectedColumn: TaskStatus;
    setSelectedColumn: (column: TaskStatus) => void;
    formData: {
        title: string;
        description: string;
        priority: Priority;
        assignees: string[];
        dueDate: string;
    };
    setFormData: (data: any) => void;
    isCreating: boolean;
    mode: "create" | "edit";
    assigneeInput: string;
    setAssigneeInput: (value: string) => void;
}) => {
    if (!isOpen) return null;

    const stageTitles = {
        information: "Information",
        planning: "Planning",
        "project-task": "Project Task",
        meetings: "Meetings",
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            toast.error("Task title is required");
            return;
        }
        onSubmit();
    };

    const addAssignee = () => {
        if (assigneeInput.trim() && !formData.assignees.includes(assigneeInput.trim())) {
            setFormData({ ...formData, assignees: [...formData.assignees, assigneeInput.trim()] });
            setAssigneeInput("");
        }
    };

    const removeAssignee = (assigneeToRemove: string) => {
        setFormData({
            ...formData,
            assignees: formData.assignees.filter((assignee) => assignee !== assigneeToRemove),
        });
    };

    const handleAssigneeKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addAssignee();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[var(--card-bg)] rounded-lg p-6 w-full max-w-md border border-[var(--card-border)] shadow-xl"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-[var(--page-text-primary)] font-[var(--font-heading)]">
                        {mode === "create" ? "Create New Task" : "Edit Task"}
                    </h2>
                    <button onClick={onClose} className="cursor-pointer p-1 hover:bg-[var(--button-hover)] rounded" disabled={isCreating}>
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--page-text-primary)] mb-2">Stage</label>
                        <select
                            value={selectedColumn}
                            onChange={(e) => setSelectedColumn(e.target.value as TaskStatus)}
                            className="w-full px-3 py-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-md outline-none focus:border-[var(--accent-primary)] transition-colors"
                            disabled={isCreating}
                        >
                            {Object.entries(stageTitles).map(([key, title]) => (
                                <option key={key} value={key}>
                                    {title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--page-text-primary)] mb-2">Task Title *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-3 py-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-md outline-none focus:border-[var(--accent-primary)] transition-colors"
                            placeholder="Enter task title..."
                            disabled={isCreating}
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--page-text-primary)] mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3 py-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-md outline-none focus:border-[var(--accent-primary)] transition-colors resize-none"
                            rows={3}
                            placeholder="Enter task description..."
                            disabled={isCreating}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--page-text-primary)] mb-2">Priority</label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
                                className="w-full px-3 py-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-md outline-none focus:border-[var(--accent-primary)] transition-colors"
                                disabled={isCreating}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--page-text-primary)] mb-2">Due Date</label>
                            <input
                                type="date"
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                className="w-full px-3 py-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-md outline-none focus:border-[var(--accent-primary)] transition-colors"
                                disabled={isCreating}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--page-text-primary)] mb-2">Assignees</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={assigneeInput}
                                onChange={(e) => setAssigneeInput(e.target.value)}
                                onKeyDown={handleAssigneeKeyDown}
                                className="flex-1 px-3 py-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-md outline-none focus:border-[var(--accent-primary)] transition-colors"
                                placeholder="Enter assignee name (e.g. John Doe)"
                                disabled={isCreating}
                            />
                            <button
                                type="button"
                                onClick={addAssignee}
                                className="cursor-pointer px-3 py-2 bg-[var(--accent-primary)] text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
                                disabled={isCreating || !assigneeInput.trim()}
                            >
                                <FiPlus className="w-4 h-4" />
                            </button>
                        </div>

                        {formData.assignees.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {formData.assignees.map((assignee, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2 bg-[var(--column-bg)] px-3 py-2 rounded-md border border-[var(--card-border)]"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-[var(--accent-badge)] flex items-center justify-center text-white text-xs font-medium">
                                            {assignee
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")
                                                .toUpperCase()}
                                        </div>
                                        <span className="text-sm font-medium">{assignee}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeAssignee(assignee)}
                                            className="cursor-pointer text-[var(--page-text-secondary)] hover:text-[var(--priority-high)] transition-colors"
                                            disabled={isCreating}
                                        >
                                            <FiX className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="cursor-pointer flex-1 px-4 py-2 border border-[var(--card-border)] text-[var(--page-text-primary)] rounded-md hover:bg-[var(--button-hover)] transition-colors"
                            disabled={isCreating}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="cursor-pointer flex-1 px-4 py-2 bg-[var(--accent-primary)] text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                            disabled={isCreating || !formData.title.trim()}
                        >
                            {isCreating ? (
                                <>
                                    <FiRefreshCw className="w-4 h-4 animate-spin" />
                                    {mode === "create" ? "Creating..." : "Updating..."}
                                </>
                            ) : (
                                <>
                                    <FiSave className="w-4 h-4" />
                                    {mode === "create" ? "Create Task" : "Update Task"}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

const ProjectManagementBoard = () => {
    const taskRefs = useRef<Record<string, React.RefObject<HTMLDivElement | null>>>({});
    const boardRef = useRef<HTMLDivElement | null>(null);

    const ensureTaskRefs = (tasks: Task[]) => {
        tasks.forEach((task) => {
            if (!taskRefs.current[task.id]) {
                taskRefs.current[task.id] = React.createRef<HTMLDivElement | null>();
            }
        });
    };

    const [columns, setColumns] = useState<Column[]>([
        {
            id: "information",
            title: "Information",
            color: "#f97316",
            tasks: [],
            isLoading: false,
            hasError: false,
        },
        {
            id: "planning",
            title: "Planning",
            color: "#ea580c",
            tasks: [],
            isLoading: false,
            hasError: false,
        },
        {
            id: "project-task",
            title: "Project Task",
            color: "#ef4444",
            tasks: [],
            isLoading: false,
            hasError: false,
        },
        {
            id: "meetings",
            title: "Meetings",
            color: "#ff6b35",
            tasks: [],
            isLoading: false,
            hasError: false,
        },
    ]);

    const [draggingTask, setDraggingTask] = useState<string | null>(null);
    const [dependencies, setDependencies] = useState<TaskDependency[]>([]);
    const [projectTitle, setProjectTitle] = useState("Advanced Kanban Board Development");
    const [projectDescription, setProjectDescription] = useState(
        "Building a comprehensive Next.js kanban board with drag-and-drop functionality, real-time updates, and advanced project management features for enterprise teams."
    );
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [loadingStates, setLoadingStates] = useState<{
        retrying: string | null;
        creatingTask: boolean;
        initialLoad: boolean;
    }>({
        retrying: null,
        creatingTask: false,
        initialLoad: true,
    });

    const [taskModal, setTaskModal] = useState<{
        isOpen: boolean;
        mode: "create" | "edit";
        editingTaskId: string | null;
        selectedColumn: TaskStatus;
        formData: {
            title: string;
            description: string;
            priority: Priority;
            assignees: string[];
            dueDate: string;
        };
        assigneeInput: string;
    }>({
        isOpen: false,
        mode: "create",
        editingTaskId: null,
        selectedColumn: "information",
        formData: {
            title: "",
            description: "",
            priority: "medium",
            assignees: [],
            dueDate: new Date().toISOString().split("T")[0],
        },
        assigneeInput: "",
    });

    const getDateString = (daysFromNow: number): string => {
        const date = new Date();
        date.setDate(date.getDate() + daysFromNow);
        return date.toISOString().split("T")[0];
    };

    const mockTasks: Task[] = [
        {
            id: "1",
            title: "Project Requirements & Stakeholder Analysis",
            description:
                "Gather comprehensive requirements from project managers across different teams. Document current pain points with existing tools and define success criteria for the new kanban system.",
            status: "information",
            priority: "high",
            progress: 95,
            dueDate: getDateString(0),
            assignees: ["David Quint", "Sarah Miller"],
            dependencies: [],
        },
        {
            id: "2",
            title: "Technical Stack Research: Next.js & Vercel Integration",
            description:
                "Research Next.js 15 best practices, Vercel deployment strategies, and performance optimization techniques for real-time kanban boards.",
            status: "information",
            priority: "high",
            progress: 80,
            dueDate: getDateString(0),
            assignees: ["Tech Lead", "John Smith"],
            dependencies: [],
        },
        {
            id: "3",
            title: "UI/UX Design System & Component Library",
            description:
                "Create comprehensive design system including drag-and-drop states, loading animations, error states, and responsive layouts for desktop-first kanban interface.",
            status: "information",
            priority: "medium",
            progress: 70,
            dueDate: getDateString(1),
            assignees: ["UI Designer", "UX Designer"],
            subtasks: { completed: 7, total: 10 },
            dependencies: ["1"],
        },
        {
            id: "4",
            title: "Database Schema & API Architecture Planning",
            description:
                "Design scalable database schema for tasks, columns, dependencies, and user permissions. Plan REST/GraphQL API endpoints for real-time updates.",
            status: "planning",
            priority: "high",
            progress: 60,
            dueDate: getDateString(0),
            assignees: ["DB Architect", "Backend Engineer"],
            subtasks: { completed: 4, total: 8 },
            dependencies: ["1", "2"],
        },
        {
            id: "5",
            title: "Next.js Project Setup & Development Environment",
            description:
                "Initialize Next.js 15 project with TypeScript, TailwindCSS, and Framer Motion. Configure ESLint, Prettier, and development tooling for team collaboration.",
            status: "planning",
            priority: "high",
            progress: 90,
            dueDate: getDateString(0),
            assignees: ["Developer One", "Developer Two"],
            dependencies: ["2"],
        },
        {
            id: "6",
            title: "Drag-and-Drop System Architecture",
            description:
                "Plan implementation strategy for HTML5 drag-and-drop API with visual feedback, collision detection, and smooth animations across different screen sizes.",
            status: "planning",
            priority: "medium",
            progress: 45,
            dueDate: getDateString(1),
            assignees: ["Frontend Engineer"],
            dependencies: ["4"],
        },
        {
            id: "7",
            title: "Implement Core Drag-and-Drop Functionality",
            description:
                "Build robust HTML5 drag-and-drop system with visual feedback, drop zones highlighting, and smooth task movement between columns with proper state management.",
            status: "project-task",
            priority: "high",
            progress: 75,
            dueDate: getDateString(0),
            assignees: ["Frontend Engineer", "Frontend Developer"],
            subtasks: { completed: 6, total: 8 },
            dependencies: ["5", "6"],
        },
        {
            id: "8",
            title: "Task Cards with Expandable Progress Indicators",
            description:
                "Create interactive task cards that expand on hover to show detailed progress meters, subtask completion, priority indicators, and assignee information.",
            status: "project-task",
            priority: "high",
            progress: 60,
            dueDate: getDateString(1),
            assignees: ["Frontend Developer"],
            dependencies: ["7"],
        },
        {
            id: "9",
            title: "Loading States & Shimmer Effects Implementation",
            description:
                "Build comprehensive loading system with skeleton screens, shimmer effects for task cards, and column-specific loading indicators during data operations.",
            status: "project-task",
            priority: "medium",
            progress: 40,
            dueDate: getDateString(2),
            assignees: ["Frontend Engineer"],
            subtasks: { completed: 2, total: 6 },
            dependencies: ["8"],
        },
        {
            id: "10",
            title: "Error Handling & Retry Mechanisms",
            description:
                "Implement robust error boundaries, user-friendly error messages, retry workflows for failed operations, and offline state management.",
            status: "project-task",
            priority: "medium",
            progress: 25,
            dueDate: getDateString(3),
            assignees: ["Frontend Developer", "Backend Engineer"],
            dependencies: ["9"],
        },
        {
            id: "11",
            title: "Animated Dependency Connectors",
            description:
                "Create SVG-based animated lines that visually connect dependent tasks across columns with smooth animations and interactive hover states.",
            status: "project-task",
            priority: "low",
            progress: 15,
            dueDate: getDateString(4),
            assignees: ["Frontend Engineer"],
            dependencies: ["8"],
        },
        {
            id: "12",
            title: "Context-Aware Tooltips System",
            description:
                "Build intelligent tooltip system that shows relevant information based on user context, loading states, and task relationships with proper positioning.",
            status: "project-task",
            priority: "low",
            progress: 10,
            dueDate: getDateString(5),
            assignees: ["Frontend Developer"],
            dependencies: ["10"],
        },
        {
            id: "13",
            title: "Client Requirements Review & Demo",
            description:
                "Present initial kanban board prototype to project management team, gather feedback on drag-and-drop functionality and user experience.",
            status: "meetings",
            priority: "high",
            progress: 100,
            dueDate: getDateString(0),
            assignees: ["David Quint", "Project Manager"],
            dependencies: [],
        },
        {
            id: "14",
            title: "Technical Architecture Review Session",
            description:
                "Deep dive into Next.js implementation details, Vercel deployment strategy, and scalability considerations with senior development team.",
            status: "meetings",
            priority: "high",
            progress: 85,
            dueDate: getDateString(0),
            assignees: ["Tech Lead", "Solution Architect"],
            dependencies: ["4"],
        },
        {
            id: "15",
            title: "Sprint Planning: Core Features Implementation",
            description:
                "Plan next sprint focusing on drag-and-drop core functionality, task card interactions, and loading state implementations.",
            status: "meetings",
            priority: "medium",
            progress: 70,
            dueDate: getDateString(1),
            assignees: ["Scrum Master", "Development Team"],
            dependencies: ["7"],
        },
        {
            id: "16",
            title: "Weekly Progress Review & Stakeholder Update",
            description:
                "Present current development progress, demonstrate working features, and adjust timeline based on stakeholder feedback and technical challenges.",
            status: "meetings",
            priority: "medium",
            progress: 30,
            dueDate: getDateString(2),
            assignees: ["Project Manager", "David Quint"],
            dependencies: ["11", "12"],
        },
    ];

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        setLoadingStates((prev) => ({ ...prev, initialLoad: true }));
        setColumns((prev) => prev.map((col) => ({ ...col, isLoading: true, hasError: false })));

        ensureTaskRefs(mockTasks);

        await new Promise((resolve) => setTimeout(resolve, 1500));

        const tasksByStatus = mockTasks.reduce((acc, task) => {
            if (!acc[task.status]) acc[task.status] = [];
            acc[task.status].push(task);
            return acc;
        }, {} as Record<TaskStatus, Task[]>);

        setColumns((prev) =>
            prev.map((col) => ({
                ...col,
                tasks: tasksByStatus[col.id] || [],
                isLoading: false,
                hasError: Math.random() > 0.8,
            }))
        );

        const deps: TaskDependency[] = mockTasks
            .filter((task) => task.dependencies.length > 0)
            .flatMap((task) =>
                task.dependencies.map((depId) => ({
                    id: depId,
                    targetId: task.id,
                }))
            );

        setDependencies(deps);
        setLoadingStates((prev) => ({ ...prev, initialLoad: false }));
    };

    const retryColumn = async (columnId: TaskStatus) => {
        setLoadingStates((prev) => ({ ...prev, retrying: columnId }));
        setColumns((prev) => prev.map((col) => (col.id === columnId ? { ...col, isLoading: true, hasError: false } : col)));

        await new Promise((resolve) => setTimeout(resolve, 1000));

        const columnTasks = mockTasks.filter((task) => task.status === columnId);

        setColumns((prev) =>
            prev.map((col) => (col.id === columnId ? { ...col, tasks: columnTasks, isLoading: false, hasError: false } : col))
        );

        setLoadingStates((prev) => ({ ...prev, retrying: null }));
        toast.success(`${columnId} tasks loaded successfully!`);
    };

    const openTaskModal = (columnId: TaskStatus) => {
        setTaskModal((prev) => ({
            ...prev,
            isOpen: true,
            mode: "create",
            editingTaskId: null,
            selectedColumn: columnId,
            formData: {
                title: "",
                description: "",
                priority: "medium",
                assignees: [],
                dueDate: new Date().toISOString().split("T")[0],
            },
            assigneeInput: "",
        }));
    };

    const openTaskEditModal = (task: Task) => {
        setTaskModal((prev) => ({
            ...prev,
            isOpen: true,
            mode: "edit",
            editingTaskId: task.id,
            selectedColumn: task.status,
            formData: {
                title: task.title,
                description: task.description || "",
                priority: task.priority,
                assignees: task.assignees,
                dueDate: task.dueDate,
            },
            assigneeInput: "",
        }));
    };

    const closeTaskModal = () => {
        setTaskModal((prev) => ({ ...prev, isOpen: false }));
    };

    const createNewTask = async () => {
        setLoadingStates((prev) => ({ ...prev, creatingTask: true }));

        await new Promise((resolve) => setTimeout(resolve, 800));

        const newTask: Task = {
            id: `task-${Date.now()}`,
            title: taskModal.formData.title,
            description: taskModal.formData.description || undefined,
            status: taskModal.selectedColumn,
            priority: taskModal.formData.priority,
            progress: 0,
            dueDate: taskModal.formData.dueDate,
            assignees: taskModal.formData.assignees.length > 0 ? taskModal.formData.assignees : ["You"],
            dependencies: [],
        };

        setColumns((prev) => prev.map((col) => (col.id === taskModal.selectedColumn ? { ...col, tasks: [...col.tasks, newTask] } : col)));

        setLoadingStates((prev) => ({ ...prev, creatingTask: false }));
        closeTaskModal();
        toast.success("New task created successfully!");
    };

    const updateExistingTask = async () => {
        if (!taskModal.editingTaskId) return;

        setLoadingStates((prev) => ({ ...prev, creatingTask: true }));

        await new Promise((resolve) => setTimeout(resolve, 800));

        const currentTask = columns.flatMap((col) => col.tasks).find((task) => task.id === taskModal.editingTaskId);

        const updatedTask: Task = {
            id: taskModal.editingTaskId,
            title: taskModal.formData.title,
            description: taskModal.formData.description || undefined,
            status: taskModal.selectedColumn,
            priority: taskModal.formData.priority,
            progress: currentTask?.progress || 0,
            dueDate: taskModal.formData.dueDate,
            assignees: taskModal.formData.assignees.length > 0 ? taskModal.formData.assignees : ["You"],
            dependencies: currentTask?.dependencies || [],
        };

        setColumns((prev) =>
            prev.map((col) => {
                const filteredTasks = col.tasks.filter((task) => task.id !== taskModal.editingTaskId);

                if (col.id === taskModal.selectedColumn) {
                    return { ...col, tasks: [...filteredTasks, updatedTask] };
                }

                return { ...col, tasks: filteredTasks };
            })
        );

        setLoadingStates((prev) => ({ ...prev, creatingTask: false }));
        closeTaskModal();
        toast.success("Task updated successfully!");
    };

    const updateTaskFormData = (data: any) => {
        setTaskModal((prev) => ({ ...prev, formData: { ...prev.formData, ...data } }));
    };

    const updateAssigneeInput = (value: string) => {
        setTaskModal((prev) => ({ ...prev, assigneeInput: value }));
    };

    const startDragTask = (taskId: string) => {
        setDraggingTask(taskId);
    };

    const endDragTask = () => {
        setDraggingTask(null);
    };

    const moveTaskToColumn = (taskId: string, targetColumnId: TaskStatus) => {
        const sourceColumn = columns.find((col) => col.tasks.some((task) => task.id === taskId));
        if (!sourceColumn || sourceColumn.id === targetColumnId) return;

        const taskToMove = sourceColumn.tasks.find((task) => task.id === taskId);
        if (!taskToMove) return;

        setColumns((prev) =>
            prev.map((col) => {
                if (col.id === sourceColumn.id) {
                    return { ...col, tasks: col.tasks.filter((task) => task.id !== taskId) };
                }
                if (col.id === targetColumnId) {
                    return { ...col, tasks: [...col.tasks, { ...taskToMove, status: targetColumnId }] };
                }
                return col;
            })
        );

        toast.success(`Task moved to ${targetColumnId}!`);
    };

    const allTasks = columns.flatMap((col) => col.tasks);

    return (
        <div className="min-h-screen bg-[var(--page-bg)]">
            <Header loadingStates={loadingStates} />

            <div className="px-4 md:px-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8 mb-8">
                    <div className="flex-1">
                        {isEditingTitle ? (
                            <input
                                type="text"
                                value={projectTitle}
                                onChange={(e) => setProjectTitle(e.target.value)}
                                onBlur={() => setIsEditingTitle(false)}
                                onKeyDown={(e) => e.key === "Enter" && setIsEditingTitle(false)}
                                className="text-2xl md:text-3xl font-bold text-[var(--page-text-primary)] mb-2 bg-transparent border-b-2 border-[var(--accent-primary)] outline-none w-full font-[var(--font-heading)]"
                                autoFocus
                            />
                        ) : (
                            <h1
                                className="text-2xl md:text-3xl font-bold text-[var(--page-text-primary)] mb-2 cursor-pointer hover:text-[var(--accent-primary)] transition-colors"
                                onClick={() => setIsEditingTitle(true)}
                                data-tooltip-id="edit-title"
                                data-tooltip-content="Click to edit project title"
                            >
                                {projectTitle}
                            </h1>
                        )}

                        {isEditingDescription ? (
                            <textarea
                                value={projectDescription}
                                onChange={(e) => setProjectDescription(e.target.value)}
                                onBlur={() => setIsEditingDescription(false)}
                                onKeyDown={(e) => e.key === "Enter" && e.ctrlKey && setIsEditingDescription(false)}
                                className="text-sm md:text-base text-[var(--page-text-secondary)] bg-transparent border border-[var(--accent-primary)] rounded-md p-2 outline-none w-full resize-none font-[var(--font-body)]"
                                rows={2}
                                autoFocus
                            />
                        ) : (
                            <p
                                className="text-sm md:text-base text-[var(--page-text-secondary)] cursor-pointer hover:text-[var(--page-text-primary)] transition-colors"
                                onClick={() => setIsEditingDescription(true)}
                                data-tooltip-id="edit-description"
                                data-tooltip-content="Click to edit project description (Ctrl+Enter to save)"
                            >
                                {projectDescription}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center justify-end md:justify-start">
                        <button
                            onClick={() => openTaskModal("information")}
                            className="cursor-pointer px-4 py-2 bg-[var(--button-primary)] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
                            disabled={loadingStates.creatingTask}
                            data-tooltip-id="new-task"
                            data-tooltip-content="Create new task in Information column"
                        >
                            <FiPlus className="w-4 h-4" />
                            <span className="inline">New task</span>
                        </button>
                    </div>
                </div>

                <div className="relative" ref={boardRef}>
                    <DependencyConnector dependencies={dependencies} tasks={allTasks} taskRefs={taskRefs} boardRef={boardRef} />

                    <div className="flex gap-4 md:gap-6 overflow-x-auto pt-1 pb-6 px-1">
                        {columns.map((column) => (
                            <Column
                                key={column.id}
                                column={column}
                                onAddTask={openTaskModal}
                                onRetry={retryColumn}
                                onDragStart={startDragTask}
                                onDragEnd={endDragTask}
                                draggingTask={draggingTask}
                                onDrop={moveTaskToColumn}
                                loadingStates={loadingStates}
                                onEditTask={openTaskEditModal}
                                taskRefs={taskRefs}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <Tooltip id="theme-toggle" />
            <Tooltip id="notifications" />
            <Tooltip id="profile" />
            <Tooltip id="edit-title" />
            <Tooltip id="edit-description" />
            <Tooltip id="new-task" />
            <Tooltip id="retry-planning" />
            <Tooltip id="retry-information" />
            <Tooltip id="retry-project-task" />
            <Tooltip id="retry-meetings" />
            <Tooltip id="add-task-planning" />
            <Tooltip id="add-task-information" />
            <Tooltip id="add-task-project-task" />
            <Tooltip id="add-task-meetings" />

            <AnimatePresence>
                {taskModal.isOpen && (
                    <TaskModal
                        isOpen={taskModal.isOpen}
                        onClose={closeTaskModal}
                        onSubmit={taskModal.mode === "create" ? createNewTask : updateExistingTask}
                        selectedColumn={taskModal.selectedColumn}
                        setSelectedColumn={(column) => setTaskModal((prev) => ({ ...prev, selectedColumn: column }))}
                        formData={taskModal.formData}
                        setFormData={updateTaskFormData}
                        isCreating={loadingStates.creatingTask}
                        mode={taskModal.mode}
                        assigneeInput={taskModal.assigneeInput}
                        setAssigneeInput={updateAssigneeInput}
                    />
                )}
            </AnimatePresence>

            <Toaster position="bottom-right" />
            <Footer />
        </div>
    );
};

export default function Home() {
    return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <GlobalThemeStyles />
            <ProjectManagementBoard />
        </ThemeProvider>
    );
}
