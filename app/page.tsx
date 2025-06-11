"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

interface Task {
    id: string;
    title: string;
    projectId: string;
    startTime: Date;
    duration: number; // in minutes
    completed: boolean;
    dueDate?: Date;
    priority: "low" | "medium" | "high";
}

interface Project {
    id: string;
    name: string;
    color: string;
    collapsed: boolean;
}

export default function FreelanceScheduler() {
    const [tasks, setTasks] = useState<Task[]>([
        {
            id: "1",
            title: "Logo concepts",
            projectId: "proj1",
            startTime: new Date(new Date().setHours(9, 0, 0, 0)),
            duration: 120,
            completed: false,
            dueDate: new Date(new Date().setHours(17, 0, 0, 0)),
            priority: "high",
        },
        {
            id: "2",
            title: "Website mockup",
            projectId: "proj2",
            startTime: new Date(new Date().setHours(13, 0, 0, 0)),
            duration: 180,
            completed: false,
            dueDate: new Date(Date.now() + 86400000),
            priority: "medium",
        },
        {
            id: "3",
            title: "Client feedback review",
            projectId: "proj1",
            startTime: new Date(new Date().setHours(16, 0, 0, 0)),
            duration: 60,
            completed: false,
            dueDate: new Date(Date.now() - 86400000), // overdue
            priority: "high",
        },
    ]);

    const [projects, setProjects] = useState<Project[]>([
        { id: "proj1", name: "Brand Refresh Co.", color: "#3B82F6", collapsed: false },
        { id: "proj2", name: "E-commerce Site", color: "#10B981", collapsed: false },
        { id: "proj3", name: "Mobile App UI", color: "#F59E0B", collapsed: true },
    ]);

    const [view, setView] = useState<"daily" | "weekly">("daily");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [draggingTask, setDraggingTask] = useState<string | null>(null);
    const [swipingTask, setSwipingTask] = useState<string | null>(null);
    const [swipeX, setSwipeX] = useState(0);
    const [showAddTask, setShowAddTask] = useState(false);
    const [showAddProject, setShowAddProject] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [syncStatus, setSyncStatus] = useState<"synced" | "syncing" | "error">("synced");

    const timelineRef = useRef<HTMLDivElement>(null);
    const touchStartX = useRef(0);
    const dragStartY = useRef(0);

    // Load from localStorage
    useEffect(() => {
        const savedTasks = localStorage.getItem("freelance-tasks");
        const savedProjects = localStorage.getItem("freelance-projects");
        
        if (savedTasks) {
            const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
                ...task,
                startTime: new Date(task.startTime),
                dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
                priority: task.priority || "medium",
            }));
            setTasks(parsedTasks);
        }
        
        if (savedProjects) setProjects(JSON.parse(savedProjects));
    }, []);

    // Save to localStorage with sync status
    const saveToStorage = useCallback(async (key: string, data: any) => {
        setSyncStatus("syncing");
        try {
            localStorage.setItem(key, JSON.stringify(data));
            // Simulate sync delay
            await new Promise(resolve => setTimeout(resolve, 500));
            setSyncStatus("synced");
        } catch (error) {
            setSyncStatus("error");
        }
    }, []);

    useEffect(() => {
        saveToStorage("freelance-tasks", tasks);
    }, [tasks, saveToStorage]);

    useEffect(() => {
        saveToStorage("freelance-projects", projects);
    }, [projects, saveToStorage]);

    const getWeekDates = () => {
        const start = new Date(selectedDate);
        const day = start.getDay();
        const diff = start.getDate() - day;
        const weekStart = new Date(start.setDate(diff));
        
        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(weekStart);
            date.setDate(weekStart.getDate() + i);
            return date;
        });
    };

    const getTimeFromPosition = (y: number): Date => {
        if (!timelineRef.current) return new Date();
        const rect = timelineRef.current.getBoundingClientRect();
        const relativeY = y - rect.top;
        const totalMinutes = (relativeY / rect.height) * 24 * 60;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = Math.round((totalMinutes % 60) / 15) * 15;

        const time = new Date(selectedDate);
        time.setHours(hours, minutes, 0, 0);
        return time;
    };

    // Legacy handlers for mouse (desktop) - simplified
    const handleDragStart = (taskId: string, clientY: number) => {
        setDraggingTask(taskId);
        dragStartY.current = clientY;
    };

    const handleDragMove = (clientY: number) => {
        if (!draggingTask) return;
        const newTime = getTimeFromPosition(clientY);
        setTasks((prev) => prev.map((task) => (task.id === draggingTask ? { ...task, startTime: newTime } : task)));
    };

    const handleDragEnd = () => {
        setDraggingTask(null);
    };

    const handleSwipeStart = (taskId: string, clientX: number) => {
        setSwipingTask(taskId);
        touchStartX.current = clientX;
        setSwipeX(0);
    };

    const handleSwipeMove = (clientX: number) => {
        if (!swipingTask) return;
        const diff = clientX - touchStartX.current;
        setSwipeX(diff);
    };

    const handleSwipeEnd = () => {
        if (!swipingTask) return;

        if (swipeX > 100) {
            setTasks((prev) => prev.map((task) => (task.id === swipingTask ? { ...task, completed: true } : task)));
        }

        setSwipingTask(null);
        setSwipeX(0);
    };

    const toggleProject = (projectId: string) => {
        setProjects((prev) => prev.map((proj) => (proj.id === projectId ? { ...proj, collapsed: !proj.collapsed } : proj)));
    };

    const getTasksForDate = (date: Date) => {
        return tasks.filter((task) => {
            const taskDate = new Date(task.startTime);
            return taskDate.toDateString() === date.toDateString();
        });
    };

    const isOverdue = (task: Task) => {
        if (!task.dueDate || task.completed) return false;
        return new Date() > new Date(task.dueDate);
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    const addTask = (taskData: Omit<Task, "id">) => {
        const newTask: Task = {
            ...taskData,
            id: Date.now().toString(),
        };
        setTasks(prev => [...prev, newTask]);
        setShowAddTask(false);
    };

    const updateTask = (taskId: string, updates: Partial<Task>) => {
        setTasks(prev => prev.map(task => 
            task.id === taskId ? { ...task, ...updates } : task
        ));
        setEditingTask(null);
    };

    const deleteTask = (taskId: string) => {
        setTasks(prev => prev.filter(task => task.id !== taskId));
    };

    const addProject = (name: string, color: string) => {
        const newProject: Project = {
            id: Date.now().toString(),
            name,
            color,
            collapsed: false,
        };
        setProjects(prev => [...prev, newProject]);
        setShowAddProject(false);
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high": return "#EF4444";
            case "medium": return "#F59E0B";
            case "low": return "#10B981";
            default: return "#6B7280";
        }
    };

    return (
        <div style={{ 
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            minHeight: "100vh",
            backgroundColor: "#0F0F0F",
            color: "#FFFFFF",
            touchAction: "pan-y"
        }}>
            <style jsx global>{`
                @import url("https://fonts.googleapis.com/css2?family=Bebas+Neue:wght@400;700&family=Roboto:wght@300;400;500;700&display=swap");

                :root {
                    --page-bg: #fefefe;
                    --page-text-primary: #1e293b;
                    --page-text-secondary: #64748b;
                    --card-bg: #ffffff;
                    --card-border: #e2e8f0;
                    --primary-blue: #3b82f6;
                    --primary-purple: #8b5cf6;
                    --accent-lavender: #a855f7;
                    --soft-blue: #dbeafe;
                    --soft-purple: #ede9fe;
                    --success-green: #10b981;
                    --warning-amber: #f59e0b;
                    --danger-red: #ef4444;
                    --font-heading: "Bebas Neue", cursive;
                    --font-body: "Roboto", sans-serif;
                    --scrollbar-thumb: #cbd5e1;
                    --scrollbar-track: #f8fafc;
                }

                html.dark {
                    --page-bg: #0f172a;
                    --page-text-primary: #f1f5f9;
                    --page-text-secondary: #94a3b8;
                    --card-bg: #1e293b;
                    --card-border: #334155;
                    --primary-blue: #60a5fa;
                    --primary-purple: #a78bfa;
                    --accent-lavender: #c084fc;
                    --soft-blue: #1e3a8a;
                    --soft-purple: #581c87;
                    --success-green: #34d399;
                    --warning-amber: #fbbf24;
                    --danger-red: #f87171;
                    --scrollbar-thumb: #475569;
                    --scrollbar-track: #1e293b;
                }

                body {
                    background-color: var(--page-bg);
                    color: var(--page-text-primary);
                    font-family: var(--font-body);
                    font-weight: 300;
                    line-height: 1.6;
                    transition: background-color 0.3s ease, color 0.3s ease;
                }

                h1, h2, h3, h4, h5, h6 {
                    font-family: var(--font-heading);
                    font-weight: 700;
                    letter-spacing: 0.05em;
                }

                ::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }

                ::-webkit-scrollbar-track {
                    background: var(--scrollbar-track);
                    border-radius: 4px;
                }

                ::-webkit-scrollbar-thumb {
                    background: var(--scrollbar-thumb);
                    border-radius: 4px;
                }

                ::-webkit-scrollbar-thumb:hover {
                    background: var(--page-text-secondary);
                }

                .task {
                    position: absolute;
                    left: 4rem;
                    right: 1rem;
                    padding: 1rem;
                    border-radius: 0.75rem;
                    cursor: move;
                    transition: transform 0.3s, opacity 0.3s;
                    user-select: none;
                    -webkit-user-select: none;
                    touch-action: none;
                }
                
                .task.dragging {
                    opacity: 0.8;
                    transform: scale(1.05);
                    z-index: 100;
                }
                
                .task.swiping {
                    transition: none;
                }
                
                .task.completed {
                    opacity: 0.5;
                    text-decoration: line-through;
                }
            `}</style>
            
            <div className="sticky top-0 bg-[var(--page-bg)] border-b border-[var(--card-border)] p-4 lg:p-6 z-50">
                <div className="flex justify-between items-center mb-4 lg:mb-6">
                    <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-[var(--page-text-primary)]">
                        Task Planner
                    </h1>
                    <div className="flex items-center gap-2 text-xs lg:text-sm text-[var(--page-text-secondary)]">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                            syncStatus === "synced" ? "bg-[var(--success-green)]" : 
                            syncStatus === "syncing" ? "bg-[var(--warning-amber)] animate-pulse" : 
                            "bg-[var(--danger-red)]"
                        }`}></div>
                        {syncStatus === "synced" && "Synced"}
                        {syncStatus === "syncing" && "Syncing..."}
                        {syncStatus === "error" && "Sync Error"}
                    </div>
                </div>
                
                <div className="flex bg-[var(--card-bg)] rounded-lg p-1 shadow-sm border border-[var(--card-border)]">
                    <button 
                        className={`flex-1 py-2 lg:py-3 px-4 lg:px-6 text-sm lg:text-base font-medium rounded-md transition-all duration-200 cursor-pointer ${
                            view === "daily" 
                                ? "bg-[var(--primary-blue)] text-white shadow-md" 
                                : "text-[var(--page-text-secondary)] hover:text-[var(--page-text-primary)] hover:bg-[var(--soft-blue)]"
                        }`}
                        onClick={() => setView("daily")}
                    >
                        Daily
                    </button>
                    <button 
                        className={`flex-1 py-2 lg:py-3 px-4 lg:px-6 text-sm lg:text-base font-medium rounded-md transition-all duration-200 cursor-pointer ${
                            view === "weekly" 
                                ? "bg-[var(--primary-blue)] text-white shadow-md" 
                                : "text-[var(--page-text-secondary)] hover:text-[var(--page-text-primary)] hover:bg-[var(--soft-blue)]"
                        }`}
                        onClick={() => setView("weekly")}
                    >
                        Weekly
                    </button>
                </div>
                
                <div className="flex justify-between items-center mt-4 lg:mt-6">
                    <button 
                        className="bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--page-text-primary)] p-2 lg:p-3 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-[var(--soft-blue)] transition-colors cursor-pointer"
                        onClick={() => {
                            const newDate = new Date(selectedDate);
                            newDate.setDate(newDate.getDate() - (view === "daily" ? 1 : 7));
                            setSelectedDate(newDate);
                        }}
                    >
                        ←
                    </button>
                    
                    <div className="text-lg lg:text-xl font-semibold text-[var(--page-text-primary)] text-center">
                        {view === "daily" 
                            ? selectedDate.toLocaleDateString("en-US", { 
                                weekday: "long", 
                                month: "short", 
                                day: "numeric" 
                            })
                            : `Week of ${selectedDate.toLocaleDateString("en-US", { 
                                month: "short", 
                                day: "numeric" 
                            })}`}
                    </div>
                    
                    <button 
                        className="bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--page-text-primary)] p-2 lg:p-3 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-[var(--soft-blue)] transition-colors cursor-pointer"
                        onClick={() => {
                            const newDate = new Date(selectedDate);
                            newDate.setDate(newDate.getDate() + (view === "daily" ? 1 : 7));
                            setSelectedDate(newDate);
                        }}
                    >
                        →
                    </button>
                </div>
            </div>

            <div className="sidebar">
                <div className="add-buttons">
                    <button className="add-button" onClick={() => setShowAddTask(true)}>
                        + Add Task
                    </button>
                    <button className="add-button" onClick={() => setShowAddProject(true)}>
                        + Project
                    </button>
                </div>

                {projects.map((project) => {
                    const projectTasks = tasks.filter((t) => t.projectId === project.id && !t.completed);
                    const completedCount = tasks.filter((t) => t.projectId === project.id && t.completed).length;

                    return (
                        <div key={project.id} className="project">
                            <div className="project-header" onClick={() => toggleProject(project.id)}>
                                <div className="project-info">
                                    <div className="project-color" style={{ backgroundColor: project.color }} />
                                    <span className="project-name">{project.name}</span>
                                    <span style={{ fontSize: "0.875rem", color: "#737373" }}>
                                        {projectTasks.length} active · {completedCount} done
                                    </span>
                                </div>
                                <span className={`collapse-icon ${project.collapsed ? "collapsed" : ""}`}>▼</span>
                            </div>

                            {!project.collapsed && projectTasks.length > 0 && (
                                <div style={{ marginTop: "0.5rem", paddingLeft: "2rem" }}>
                                    {projectTasks.map((task) => (
                                        <div
                                            key={task.id}
                                            style={{
                                                fontSize: "0.875rem",
                                                color: "#A3A3A3",
                                                marginBottom: "0.25rem",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "0.5rem",
                                                cursor: "pointer",
                                                padding: "0.25rem 0",
                                            }}
                                            onClick={() => setEditingTask(task)}
                                        >
                                            <div 
                                                className="priority-badge" 
                                                style={{ backgroundColor: getPriorityColor(task.priority) }}
                                            />
                                            • {task.title}
                                            {isOverdue(task) && <span style={{ color: "#DC2626", marginLeft: "0.5rem" }}>overdue</span>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {view === "daily" ? (
                <div className="timeline-container">
                    <div className="timeline" ref={timelineRef}>
                        {/* Timeline overlay for drag feedback */}
                        <div className={`timeline-overlay ${draggingTask ? "active" : ""}`} />
                        
                        {Array.from({ length: 24 }, (_, i) => (
                            <div key={i} className="hour-line" style={{ top: `${(i / 24) * 100}%` }}>
                                {i === 0 ? "12 AM" : i < 12 ? `${i} AM` : i === 12 ? "12 PM" : `${i - 12} PM`}
                            </div>
                        ))}

                        {getTasksForDate(selectedDate).map((task) => {
                            const project = projects.find((p) => p.id === task.projectId);
                            const startHour = task.startTime.getHours() + task.startTime.getMinutes() / 60;
                            const heightPercent = (task.duration / 60 / 24) * 100;
                            const topPercent = (startHour / 24) * 100;

                            return (
                                <div
                                    key={task.id}
                                    className={`task ${draggingTask === task.id ? "dragging" : ""} ${task.completed ? "completed" : ""} ${
                                        swipingTask === task.id ? "swiping" : ""
                                    }`}
                                    style={{
                                        top: `${topPercent}%`,
                                        height: `${heightPercent}%`,
                                        backgroundColor: project?.color || "#3B82F6",
                                        borderLeftColor: getPriorityColor(task.priority),
                                        transform: swipingTask === task.id ? `translateX(${swipeX}px)` : undefined,
                                    }}
                                    onMouseDown={(e) => handleDragStart(task.id, e.clientY)}
                                    onMouseMove={(e) => draggingTask && handleDragMove(e.clientY)}
                                    onMouseUp={handleDragEnd}
                                    onMouseLeave={handleDragEnd}
                                    onTouchStart={(e) => {
                                        const touch = e.touches[0];
                                        handleDragStart(task.id, touch.clientY);
                                        handleSwipeStart(task.id, touch.clientX);
                                    }}
                                    onTouchMove={(e) => {
                                        const touch = e.touches[0];
                                        if (Math.abs(touch.clientX - touchStartX.current) > Math.abs(touch.clientY - dragStartY.current)) {
                                            handleSwipeMove(touch.clientX);
                                        } else {
                                            handleDragMove(touch.clientY);
                                        }
                                    }}
                                    onTouchEnd={() => {
                                        handleDragEnd();
                                        handleSwipeEnd();
                                    }}
                                    onClick={() => setEditingTask(task)}
                                >
                                    <div className="task-content">
                                        <div>
                                            <div className="task-title">{task.title}</div>
                                            <div className="task-time">
                                                {formatTime(task.startTime)} · {task.duration} min
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                            <div 
                                                className="priority-badge" 
                                                style={{ backgroundColor: getPriorityColor(task.priority) }}
                                            />
                                            {isOverdue(task) && <div className="overdue-badge">Overdue</div>}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="week-view">
                    {getWeekDates().map((date) => {
                        const dayTasks = getTasksForDate(date);
                        const isToday = date.toDateString() === new Date().toDateString();

                        return (
                            <div key={date.toString()} className="day-column">
                                <div className={`day-header ${isToday ? "today" : ""}`}>
                                    <div>{date.toLocaleDateString("en-US", { weekday: "short" })}</div>
                                    <div style={{ fontSize: "1.25rem", fontWeight: "600" }}>{date.getDate()}</div>
                                </div>

                                {dayTasks.length === 0 ? (
                                    <div className="empty-state">No tasks</div>
                                ) : (
                                    dayTasks.map((task) => {
                                        const project = projects.find((p) => p.id === task.projectId);
                                        return (
                                            <div
                                                key={task.id}
                                                className="week-task"
                                                style={{
                                                    backgroundColor: project?.color || "#3B82F6",
                                                    opacity: task.completed ? 0.5 : 1,
                                                    textDecoration: task.completed ? "line-through" : "none",
                                                    borderLeft: `3px solid ${getPriorityColor(task.priority)}`,
                                                }}
                                                onClick={() => {
                                                    setTasks((prev) =>
                                                        prev.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t))
                                                    );
                                                }}
                                            >
                                                <div style={{ fontWeight: "500" }}>{task.title}</div>
                                                <div style={{ fontSize: "0.75rem", opacity: 0.8 }}>{formatTime(task.startTime)}</div>
                                                {isOverdue(task) && (
                                                    <div style={{ fontSize: "0.75rem", color: "#FEE2E2", marginTop: "0.25rem" }}>
                                                        Overdue!
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add Task Modal */}
            {showAddTask && <TaskModal onSave={addTask} onCancel={() => setShowAddTask(false)} projects={projects} />}
            
            {/* Edit Task Modal */}
            {editingTask && (
                <TaskModal 
                    task={editingTask} 
                    onSave={(taskData) => updateTask(editingTask.id, taskData)} 
                    onCancel={() => setEditingTask(null)}
                    onDelete={() => {
                        deleteTask(editingTask.id);
                        setEditingTask(null);
                    }}
                    projects={projects} 
                />
            )}
            
            {/* Add Project Modal */}
            {showAddProject && <ProjectModal onSave={addProject} onCancel={() => setShowAddProject(false)} />}
        </div>
    );
}

// Task Modal Component
function TaskModal({ 
    task, 
    onSave, 
    onCancel, 
    onDelete, 
    projects 
}: { 
    task?: Task; 
    onSave: (task: Omit<Task, "id">) => void; 
    onCancel: () => void; 
    onDelete?: () => void;
    projects: Project[];
}) {
    const [formData, setFormData] = useState({
        title: task?.title || "",
        projectId: task?.projectId || projects[0]?.id || "",
        startTime: task?.startTime ? task.startTime.toISOString().slice(0, 16) : "",
        duration: task?.duration || 60,
        priority: task?.priority || "medium" as const,
        dueDate: task?.dueDate ? task.dueDate.toISOString().slice(0, 16) : "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...formData,
            startTime: new Date(formData.startTime),
            dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
            completed: task?.completed || false,
        });
    };

    return (
        <div className="modal" onClick={onCancel}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2 style={{ margin: "0 0 1.5rem 0", fontSize: "1.25rem", fontWeight: "600" }}>
                    {task ? "Edit Task" : "Add Task"}
                </h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Task Title</label>
                        <input
                            className="form-input"
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            required
                            placeholder="Enter task title"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Project</label>
                        <select
                            className="form-select"
                            value={formData.projectId}
                            onChange={(e) => setFormData(prev => ({ ...prev, projectId: e.target.value }))}
                            required
                        >
                            {projects.map(project => (
                                <option key={project.id} value={project.id}>{project.name}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Start Time</label>
                        <input
                            className="form-input"
                            type="datetime-local"
                            value={formData.startTime}
                            onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Duration (minutes)</label>
                        <input
                            className="form-input"
                            type="number"
                            value={formData.duration}
                            onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                            min="15"
                            step="15"
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Priority</label>
                        <select
                            className="form-select"
                            value={formData.priority}
                            onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Due Date (optional)</label>
                        <input
                            className="form-input"
                            type="datetime-local"
                            value={formData.dueDate}
                            onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                        />
                    </div>
                    
                    <div className="form-buttons">
                        <button type="button" className="form-button secondary" onClick={onCancel}>
                            Cancel
                        </button>
                        {onDelete && (
                            <button 
                                type="button" 
                                className="form-button secondary" 
                                onClick={onDelete}
                                style={{ backgroundColor: "#EF4444" }}
                            >
                                Delete
                            </button>
                        )}
                        <button type="submit" className="form-button primary">
                            {task ? "Update" : "Add"} Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Project Modal Component
function ProjectModal({ 
    onSave, 
    onCancel 
}: { 
    onSave: (name: string, color: string) => void; 
    onCancel: () => void; 
}) {
    const [name, setName] = useState("");
    const [color, setColor] = useState("#3B82F6");
    
    const colors = [
        "#3B82F6", "#10B981", "#F59E0B", "#EF4444", 
        "#8B5CF6", "#06B6D4", "#84CC16", "#F97316"
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(name, color);
    };

    return (
        <div className="modal" onClick={onCancel}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2 style={{ margin: "0 0 1.5rem 0", fontSize: "1.25rem", fontWeight: "600" }}>
                    Add Project
                </h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Project Name</label>
                        <input
                            className="form-input"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="Enter project name"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Color</label>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.5rem", marginTop: "0.5rem" }}>
                            {colors.map(c => (
                                <button
                                    key={c}
                                    type="button"
                                    style={{
                                        backgroundColor: c,
                                        border: color === c ? "3px solid white" : "1px solid #404040",
                                        borderRadius: "8px",
                                        width: "100%",
                                        height: "44px",
                                        cursor: "pointer"
                                    }}
                                    onClick={() => setColor(c)}
                                />
                            ))}
                        </div>
                    </div>
                    
                    <div className="form-buttons">
                        <button type="button" className="form-button secondary" onClick={onCancel}>
                            Cancel
                        </button>
                        <button type="submit" className="form-button primary">
                            Add Project
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
