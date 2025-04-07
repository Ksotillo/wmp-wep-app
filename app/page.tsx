"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { Poppins, Lora } from "next/font/google";
import {
    Compass,
    Droplets,
    Cloud,
    MapPin,
    Star,
    ChevronDown,
    MountainSnow,
    X,
    ArrowLeft,
    Plus,
    UploadCloud,
    Trash2,
    Info,
    Clock,
    Droplet,
    Navigation,
    DollarSign,
    Bed,
    Bus,
    FileText,
    AlertTriangle,
} from "lucide-react";

const poppins = Poppins({
    weight: "400",
    subsets: ["latin"],
    variable: "--font-poppins",
});

const lora = Lora({
    subsets: ["latin"],
    variable: "--font-lora",
});

interface Waterfall {
    id: number;
    name: string;
    country: string;
    location: string;
    description: string;
    experience: string;
    personalNotes: string;
    rating: 1 | 2 | 3 | 4 | 5;
    visitDate: string;
    height: string;
    flowRate: string;
    hikingDifficulty: "Easy" | "Moderate" | "Hard";
    bestTimeToVisit: string;
    transportation: string;
    accommodation: string;
    costs: string;
    image: string;
    gallery: string[];
    tips: string[];
    mood: string;
}

interface TabButtonProps {
    active: boolean;
    children: React.ReactNode;
    onClick: () => void;
}

interface BlogDialogProps {
    waterfall: Waterfall | null;
    isOpen: boolean;
    onClose: () => void;
}

interface CreateBlogDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (waterfall: Waterfall) => void;
}

const TabButton = ({ active, children, onClick }: TabButtonProps) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 whitespace-nowrap text-sm md:text-base font-medium ${
            active
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-gray-300 border-b-2 border-transparent hover:border-gray-600"
        } transition-colors`}
    >
        {children}
    </button>
);

const BlogDialog = ({ waterfall, isOpen, onClose }: BlogDialogProps) => {
    const [activeTab, setActiveTab] = useState("experience");

    useEffect(() => {
        if (isOpen) {
            setActiveTab("experience");
        }
    }, [isOpen, waterfall?.id]);

    if (!isOpen || !waterfall) return null;

    return (
        <div
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
        >
            <div
                className="bg-gray-950 max-w-4xl w-full max-h-[calc(100vh-4rem)] flex flex-col rounded-xl overflow-hidden border border-gray-800 shadow-2xl glass-card"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex-shrink-0 px-4 py-3 md:px-6 md:py-4 flex justify-between items-center border-b border-gray-800/50 bg-gray-900/50 z-20">
                    <button
                        onClick={onClose}
                        className="bg-gray-800/60 backdrop-blur-sm text-gray-200 px-3 py-1.5 md:px-4 md:py-2 rounded-full hover:bg-gray-700 transition-all flex items-center gap-2 group border border-gray-700"
                        aria-label="Back to wanderings"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className={`${poppins.className} text-xs md:text-sm`}>Back</span>
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-800/60 backdrop-blur-sm p-2 rounded-full hover:bg-gray-700 transition-all group border border-gray-700"
                        aria-label="Close dialog"
                    >
                        <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500 scrollbar-track-gray-800/50">
                    <div className="relative flex-shrink-0">
                        <div className="relative h-[40vh] sm:h-[50vh] md:h-[60vh] max-h-[500px] p-3 sm:p-4 bg-gray-900">
                            <div className="h-full w-full relative rounded-lg overflow-hidden border-4 md:border-8 border-gray-100 shadow-xl transform -rotate-1">
                                <img
                                    src={waterfall.image}
                                    alt={waterfall.name}
                                    className="absolute inset-0 w-full h-full object-cover filter saturate-110"
                                    loading="eager"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
                            </div>

                            <div
                                className={`${poppins.className} absolute top-4 right-4 sm:top-6 sm:right-6 transform rotate-6 glass-card px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm z-10`}
                            >
                                <div className="text-blue-300 text-on-glass">Mood</div>
                                <div className="text-lg sm:text-xl md:text-2xl text-gray-200 text-on-glass">{waterfall.mood}</div>
                            </div>

                            <div
                                className={`${poppins.className} absolute bottom-4 left-4 sm:bottom-6 sm:left-6 transform -rotate-3 text-base sm:text-lg md:text-xl text-gray-300 bg-black/30 px-2 py-1 rounded z-10`}
                            >
                                📍 {waterfall.location}
                            </div>
                        </div>
                    </div>
                    <div className="p-6 md:p-8 lg:p-10 bg-gradient-to-b from-gray-900 to-gray-950">
                        <div className="relative mb-8 md:mb-10">
                            <div className="relative">
                                <div className={`${poppins.className} text-blue-300/80 text-xs sm:text-sm mb-1 md:mb-2`}>
                                    <FileText className="inline-block w-4 h-4 mr-1" /> Entry #{waterfall.id} • Visited:{" "}
                                    {waterfall.visitDate}
                                </div>
                                <h1
                                    id="dialog-title"
                                    className={`${lora.className} text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 tracking-tight md:tracking-wide`}
                                >
                                    {waterfall.name}
                                </h1>
                                <div className="flex items-center gap-2 sm:gap-3 mt-3 md:mt-4">
                                    <div className={`${poppins.className} text-sm text-gray-400`}>My Rating:</div>
                                    <div className="flex gap-0.5 sm:gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-5 w-5 sm:h-6 sm:w-6 ${
                                                    i < waterfall.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="sticky top-0 z-10 -mx-6 md:-mx-8 lg:-mx-10 mb-6 md:mb-8 border-b border-gray-700 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-900/80 backdrop-blur-sm">
                            <div className="flex gap-1 sm:gap-2 px-6 md:px-8 lg:px-10 overflow-x-auto scrollbar-hide">
                                <TabButton active={activeTab === "experience"} onClick={() => setActiveTab("experience")}>
                                    My Experience
                                </TabButton>
                                <TabButton active={activeTab === "gallery"} onClick={() => setActiveTab("gallery")}>
                                    Photo Gallery
                                </TabButton>
                                <TabButton active={activeTab === "info"} onClick={() => setActiveTab("info")}>
                                    Travel Info
                                </TabButton>
                            </div>
                        </div>
                        <div className={`${lora.className} space-y-6 md:space-y-8 leading-relaxed text-gray-300`}>
                            {activeTab === "experience" && (
                                <>
                                    <div className="prose prose-lg prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-gray-100 prose-p:leading-relaxed">
                                        <h3 className={`${lora.className} text-2xl font-semibold text-blue-300 mb-4`}>My Experience</h3>
                                        <p className="text-lg md:text-xl first-letter:text-5xl md:first-letter:text-6xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-blue-300">
                                            {waterfall.experience || "No experience description provided."}
                                        </p>
                                    </div>
                                    <div className="space-y-4 pt-4 border-t border-gray-700/50">
                                        <h3 className="text-lg font-medium leading-6 text-gray-200">
                                            <FileText className="inline-block w-5 h-5 mr-2" /> Personal Notes
                                        </h3>
                                        <p className="text-base md:text-lg text-gray-400 italic">{waterfall.personalNotes}</p>
                                    </div>
                                </>
                            )}

                            {activeTab === "gallery" && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                                    {waterfall.gallery.length > 0 ? (
                                        waterfall.gallery.map((photo, i) => (
                                            <div
                                                key={i}
                                                className={`relative bg-gray-800 p-2 sm:p-3 shadow-xl transform transition-transform duration-300 group hover:scale-105 border border-gray-700 rounded-lg ${
                                                    i % 2 === 0 ? "rotate-1 sm:rotate-2" : "-rotate-1 sm:-rotate-2"
                                                }`}
                                            >
                                                <div className="aspect-[4/3] relative overflow-hidden rounded bg-gray-700">
                                                    <img
                                                        src={photo}
                                                        alt={`${waterfall.name} memory ${i + 1}`}
                                                        className="absolute inset-0 w-full h-full object-cover filter saturate-105 group-hover:saturate-110 transition-all duration-300"
                                                        loading="lazy"
                                                    />
                                                </div>
                                                <div className={`${poppins.className} text-gray-400 text-center text-xs sm:text-sm mt-2`}>
                                                    Memory #{i + 1}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400 italic col-span-full text-center py-8">No gallery images added.</p>
                                    )}
                                </div>
                            )}

                            {activeTab === "info" && (
                                <div className="space-y-8 md:space-y-10">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                                        {[
                                            {
                                                label: "Height",
                                                value: waterfall.height,
                                                icon: <AlertTriangle className="w-5 h-5" />,
                                            },
                                            {
                                                label: "Trail",
                                                value: waterfall.hikingDifficulty,
                                                icon: <Navigation className="w-5 h-5" />,
                                            },
                                            {
                                                label: "Best Time",
                                                value: waterfall.bestTimeToVisit,
                                                icon: <Clock className="w-5 h-5" />,
                                            },
                                            {
                                                label: "Water Flow",
                                                value: waterfall.flowRate,
                                                icon: <Droplet className="w-5 h-5" />,
                                            },
                                        ].map((stat, i) => (
                                            <div key={i} className={`${poppins.className} transform transition-transform hover:scale-105`}>
                                                <div className="bg-blue-900/20 rounded-lg p-3 md:p-4 border border-blue-800/30 hover:shadow-xl transition-shadow h-full flex flex-col">
                                                    <div className="text-xl md:text-2xl mb-1">{stat.icon}</div>
                                                    <div className="text-blue-300 text-xs sm:text-sm mb-0.5">{stat.label}</div>
                                                    <div className="text-base md:text-lg text-gray-100 font-medium">
                                                        {stat.value || "N/A"}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className={`${poppins.className}`}>
                                        <h4 className="text-lg md:text-xl text-gray-100 mb-3 md:mb-4 font-semibold">✨ General Tips</h4>
                                        {waterfall.tips.length > 0 ? (
                                            <ul className="space-y-2 md:space-y-3">
                                                {waterfall.tips.map((tip, i) => (
                                                    <li key={i} className="flex items-start gap-2 md:gap-3 text-base md:text-lg">
                                                        <span className="text-blue-400 mt-1">•</span>
                                                        <span className="text-gray-300">{tip}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-400 italic">No general tips provided.</p>
                                        )}
                                    </div>
                                    <div className="space-y-4 pt-4 border-t border-gray-700/50">
                                        <h3 className="text-lg font-medium leading-6 text-gray-200">
                                            <Info className="inline-block w-5 h-5 mr-2" /> Specific Info
                                        </h3>
                                        <div className="space-y-3">
                                            <p>
                                                <Bus className="inline-block w-4 h-4 mr-2" />
                                                <strong className="text-gray-200 font-medium">Transportation:</strong>{" "}
                                                {waterfall.transportation || "Info not available."}
                                            </p>
                                            <p>
                                                <Bed className="inline-block w-4 h-4 mr-2" />
                                                <strong className="text-gray-200 font-medium">Accommodation:</strong>{" "}
                                                {waterfall.accommodation || "Info not available."}
                                            </p>
                                            <p>
                                                <DollarSign className="inline-block w-4 h-4 mr-2" />
                                                <strong className="text-gray-200 font-medium">Costs:</strong>{" "}
                                                {waterfall.costs || "Info not available."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Blog Creation Dialog ---

const CreateBlogDialog = ({ isOpen, onClose, onAdd }: CreateBlogDialogProps) => {
    const initialFormData: Partial<Waterfall> = {
        hikingDifficulty: "Easy",
        rating: 5,
        tips: [""],
        name: "",
        country: "",
        visitDate: "",
        location: "",
        description: "",
        experience: "",
        personalNotes: "",
        mood: "Peaceful",
        height: "",
        bestTimeToVisit: "",
        flowRate: "",
        transportation: "",
        accommodation: "",
        costs: "",
        gallery: [],
        image: "",
    };
    const [formData, setFormData] = useState<Partial<Waterfall>>(initialFormData);
    const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const mainImageInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    const resetForm = () => {
        setFormData(initialFormData);
        setMainImagePreview(null);
        setGalleryPreviews([]);
        setError(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRatingChange = (rating: 1 | 2 | 3 | 4 | 5) => {
        setFormData((prev) => ({ ...prev, rating }));
    };

    const readFileAsDataURL = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };

    const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                // Example: 10MB size limit
                setError("Main image file is too large (max 10MB).");
                e.target.value = "";
                return;
            }
            try {
                const dataUrl = await readFileAsDataURL(file);
                setMainImagePreview(dataUrl);
                setError(null);
            } catch (err) {
                console.error("Error reading main image file:", err);
                setError("Could not read the main image file.");
                setMainImagePreview(null);
            }
        }
        e.target.value = "";
    };

    const handleGalleryChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const newFilesArray = Array.from(files);
            const validFiles = newFilesArray.filter((file) => {
                if (file.size > 5 * 1024 * 1024) {
                    // Example: 5MB limit per gallery image
                    setError(`Gallery image "${file.name}" is too large (max 5MB). Skipped.`);
                    return false;
                }
                return true;
            });

            if (validFiles.length === 0) {
                e.target.value = "";
                return;
            }

            try {
                const readPromises = validFiles.map((file) => readFileAsDataURL(file));
                const dataUrls = await Promise.all(readPromises);
                setGalleryPreviews((prev) => [...prev, ...dataUrls]);
                // Clear error only if some files were processed successfully
                if (error && error.startsWith("Gallery image")) setError(null);
            } catch (err) {
                console.error("Error reading gallery files:", err);
                setError("Could not read one or more gallery files.");
            }
        }
        e.target.value = "";
    };

    const removeGalleryImage = (indexToRemove: number) => {
        setGalleryPreviews((prev) => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleTipChange = (index: number, value: string) => {
        const newTips = [...(formData.tips || [])];
        newTips[index] = value;
        setFormData((prev) => ({ ...prev, tips: newTips }));
    };

    const addTip = () => {
        setFormData((prev) => ({ ...prev, tips: [...(prev.tips || []), ""] }));
    };

    const removeTip = (indexToRemove: number) => {
        setFormData((prev) => ({
            ...prev,
            tips: prev.tips?.filter((_, index) => index !== indexToRemove) || [],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!mainImagePreview) {
            setError("Please upload a main image.");
            return;
        }
        if (!formData.name?.trim()) {
            setError("Please enter a name.");
            return;
        }
        if (!formData.country?.trim()) {
            setError("Please enter a country.");
            return;
        }
        if (!formData.location?.trim()) {
            setError("Please enter a location.");
            return;
        }
        if (!formData.visitDate?.trim()) {
            setError("Please enter a visit date.");
            return;
        }
        if (!formData.experience?.trim()) {
            setError("Please describe your experience.");
            return;
        }

        setIsSubmitting(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

            const newWaterfall: Waterfall = {
                id: Date.now(),
                name: formData.name || "Unnamed Waterfall",
                image: mainImagePreview,
                mood: formData.mood || "Unknown",
                location: formData.location || "Unknown",
                country: formData.country || "Unknown",
                visitDate: formData.visitDate || new Date().toISOString().split("T")[0],
                rating: formData.rating || 5,
                description: formData.description || "",
                experience: formData.experience || "",
                personalNotes: formData.personalNotes || "",
                gallery: galleryPreviews,
                height: formData.height || "N/A",
                hikingDifficulty: formData.hikingDifficulty || "Easy",
                bestTimeToVisit: formData.bestTimeToVisit || "N/A",
                flowRate: formData.flowRate || "N/A",
                tips: formData.tips?.filter((tip) => tip.trim() !== "") || [],
                transportation: formData.transportation || "N/A",
                accommodation: formData.accommodation || "N/A",
                costs: formData.costs || "N/A",
            };
            onAdd(newWaterfall);
            setShowSuccess(true);
            resetForm();
            setTimeout(() => {
                setShowSuccess(false);
                onClose();
            }, 2500);
        } catch (err) {
            console.error("Error submitting form:", err);
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
        >
            <div
                className="bg-gray-900 max-w-3xl w-full max-h-[calc(100vh-4rem)] flex flex-col rounded-xl overflow-hidden border border-gray-700 shadow-2xl glass-card"
                onClick={(e) => e.stopPropagation()}
                role="document"
            >
                <div className="flex-shrink-0 px-4 py-3 md:px-6 md:py-4 flex justify-between items-center border-b border-gray-700/50 bg-gray-900/80 backdrop-blur-sm z-20">
                    <h2 className={`${poppins.className} text-lg md:text-xl font-semibold text-gray-100`} id="dialog-title">
                        Add New Waterfall Entry
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-200 p-1 rounded-full hover:bg-gray-700 transition-colors"
                        aria-label="Close dialog"
                        disabled={isSubmitting}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500 scrollbar-track-gray-800/50">
                    <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300">Main Image *</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    {mainImagePreview ? (
                                        <img
                                            src={mainImagePreview}
                                            alt="Main preview"
                                            className="mx-auto h-32 w-auto object-contain rounded-md"
                                        />
                                    ) : (
                                        <UploadCloud className="mx-auto h-12 w-12 text-gray-500" aria-hidden="true" />
                                    )}
                                    <div className="flex text-sm text-gray-500 justify-center">
                                        <label
                                            htmlFor="main-image-upload"
                                            className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-blue-400 hover:text-blue-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 focus-within:ring-blue-500 px-2 py-1"
                                        >
                                            <span>{mainImagePreview ? "Change file" : "Upload a file"}</span>
                                            <input
                                                id="main-image-upload"
                                                name="mainImageFile"
                                                type="file"
                                                className="sr-only"
                                                accept="image/*"
                                                onChange={handleMainImageChange}
                                                ref={mainImageInputRef}
                                                aria-describedby="main-image-desc"
                                            />
                                        </label>
                                    </div>
                                    <p id="main-image-desc" className="text-xs text-gray-500">
                                        PNG, JPG, GIF up to 10MB
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            <div className="space-y-1">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    autoComplete="off"
                                    className="w-full border border-gray-600 rounded-md bg-gray-800 text-gray-200 focus:ring-blue-500 focus:border-blue-500 shadow-sm py-2 px-3"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    aria-required="true"
                                />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="country" className="block text-sm font-medium text-gray-300">
                                    Country *
                                </label>
                                <input
                                    type="text"
                                    id="country"
                                    name="country"
                                    required
                                    autoComplete="country-name"
                                    className="w-full border border-gray-600 rounded-md bg-gray-800 text-gray-200 focus:ring-blue-500 focus:border-blue-500 shadow-sm py-2 px-3"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    aria-required="true"
                                />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="location" className="block text-sm font-medium text-gray-300">
                                    Location / Region *
                                </label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    required
                                    autoComplete="address-level2"
                                    className="w-full border border-gray-600 rounded-md bg-gray-800 text-gray-200 focus:ring-blue-500 focus:border-blue-500 shadow-sm py-2 px-3"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    aria-required="true"
                                />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="visitDate" className="block text-sm font-medium text-gray-300">
                                    Visit Date *
                                </label>
                                <input
                                    type="date"
                                    id="visitDate"
                                    name="visitDate"
                                    required
                                    className="w-full border border-gray-600 rounded-md bg-gray-800 text-gray-200 focus:ring-blue-500 focus:border-blue-500 shadow-sm py-2 px-3"
                                    value={formData.visitDate}
                                    onChange={handleInputChange}
                                    aria-required="true"
                                />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="mood" className="block text-sm font-medium text-gray-300">
                                    Mood
                                </label>
                                <input
                                    type="text"
                                    id="mood"
                                    name="mood"
                                    className="w-full border border-gray-600 rounded-md bg-gray-800 text-gray-200 focus:ring-blue-500 focus:border-blue-500 shadow-sm py-2 px-3"
                                    placeholder="e.g., Majestic, Peaceful"
                                    value={formData.mood}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-1">
                                <label id="rating-label" className="block text-sm font-medium text-gray-300">
                                    Rating
                                </label>
                                <div className="flex gap-2 items-center pt-1" role="radiogroup" aria-labelledby="rating-label">
                                    {[1, 2, 3, 4, 5].map((v) => (
                                        <button
                                            key={v}
                                            type="button"
                                            onClick={() => handleRatingChange(v as 1 | 2 | 3 | 4 | 5)}
                                            className="focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-full p-0.5"
                                            role="radio"
                                            aria-checked={v === formData.rating}
                                            aria-label={`${v} star${v !== 1 ? "s" : ""}`}
                                        >
                                            <Star
                                                className={`h-6 w-6 transition-colors ${
                                                    v <= (formData.rating || 0)
                                                        ? "text-yellow-400 fill-yellow-400"
                                                        : "text-gray-600 hover:text-gray-500"
                                                }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-gray-700/50">
                            <h3 className="text-lg font-medium leading-6 text-gray-200">Details & Experience</h3>
                            <div className="space-y-1">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                                    Short Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={3}
                                    className="w-full border border-gray-600 rounded-md bg-gray-800 text-gray-200 focus:ring-blue-500 focus:border-blue-500 shadow-sm py-2 px-3"
                                    placeholder="A brief summary..."
                                    value={formData.description}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="experience" className="block text-sm font-medium text-gray-300">
                                    Your Experience *
                                </label>
                                <textarea
                                    id="experience"
                                    name="experience"
                                    rows={5}
                                    required
                                    className="w-full border border-gray-600 rounded-md bg-gray-800 text-gray-200 focus:ring-blue-500 focus:border-blue-500 shadow-sm py-2 px-3"
                                    placeholder="Share your detailed experience..."
                                    value={formData.experience}
                                    onChange={handleInputChange}
                                    aria-required="true"
                                />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="personalNotes" className="block text-sm font-medium text-gray-300">
                                    Personal Notes (Optional)
                                </label>
                                <textarea
                                    id="personalNotes"
                                    name="personalNotes"
                                    rows={3}
                                    className="w-full border border-gray-600 rounded-md bg-gray-800 text-gray-200 focus:ring-blue-500 focus:border-blue-500 shadow-sm py-2 px-3"
                                    placeholder="Private thoughts or reminders..."
                                    value={formData.personalNotes}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-gray-700/50">
                            <h3 className="text-lg font-medium leading-6 text-gray-200">Technical Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                <div className="space-y-1">
                                    <label htmlFor="height" className="block text-sm font-medium text-gray-300">
                                        Height
                                    </label>
                                    <input
                                        type="text"
                                        id="height"
                                        name="height"
                                        className="w-full border border-gray-600 rounded-md bg-gray-800 text-gray-200 focus:ring-blue-500 focus:border-blue-500 shadow-sm py-2 px-3"
                                        placeholder="e.g., 100 m"
                                        value={formData.height}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label htmlFor="flowRate" className="block text-sm font-medium text-gray-300">
                                        Water Flow
                                    </label>
                                    <input
                                        type="text"
                                        id="flowRate"
                                        name="flowRate"
                                        className="w-full border border-gray-600 rounded-md bg-gray-800 text-gray-200 focus:ring-blue-500 focus:border-blue-500 shadow-sm py-2 px-3"
                                        placeholder="e.g., Strong, Seasonal"
                                        value={formData.flowRate}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label htmlFor="hikingDifficulty" className="block text-sm font-medium text-gray-300">
                                        Hiking Difficulty
                                    </label>
                                    <select
                                        id="hikingDifficulty"
                                        name="hikingDifficulty"
                                        className="w-full border border-gray-600 rounded-md bg-gray-800 text-gray-200 focus:ring-blue-500 focus:border-blue-500 shadow-sm py-2 px-3"
                                        value={formData.hikingDifficulty}
                                        onChange={handleInputChange}
                                    >
                                        <option value="Easy">Easy</option>
                                        <option value="Moderate">Moderate</option>
                                        <option value="Hard">Hard</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label htmlFor="bestTimeToVisit" className="block text-sm font-medium text-gray-300">
                                        Best Time to Visit
                                    </label>
                                    <input
                                        type="text"
                                        id="bestTimeToVisit"
                                        name="bestTimeToVisit"
                                        className="w-full border border-gray-600 rounded-md bg-gray-800 text-gray-200 focus:ring-blue-500 focus:border-blue-500 shadow-sm py-2 px-3"
                                        placeholder="e.g., Spring, Year-round"
                                        value={formData.bestTimeToVisit}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-gray-700/50">
                            <h3 className="text-lg font-medium leading-6 text-gray-200">Pro Tips (Categories)</h3>
                            <div className="space-y-1">
                                <label htmlFor="transportation" className="block text-sm font-medium text-gray-300">
                                    Transportation
                                </label>
                                <textarea
                                    id="transportation"
                                    name="transportation"
                                    rows={2}
                                    className="w-full border border-gray-600 rounded-md bg-gray-800 text-gray-200 focus:ring-blue-500 focus:border-blue-500 shadow-sm py-2 px-3"
                                    placeholder="How to get there..."
                                    value={formData.transportation}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="accommodation" className="block text-sm font-medium text-gray-300">
                                    Accommodation
                                </label>
                                <textarea
                                    id="accommodation"
                                    name="accommodation"
                                    rows={2}
                                    className="w-full border border-gray-600 rounded-md bg-gray-800 text-gray-200 focus:ring-blue-500 focus:border-blue-500 shadow-sm py-2 px-3"
                                    placeholder="Nearby places to stay..."
                                    value={formData.accommodation}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="costs" className="block text-sm font-medium text-gray-300">
                                    Costs
                                </label>
                                <textarea
                                    id="costs"
                                    name="costs"
                                    rows={2}
                                    className="w-full border border-gray-600 rounded-md bg-gray-800 text-gray-200 focus:ring-blue-500 focus:border-blue-500 shadow-sm py-2 px-3"
                                    placeholder="Entry fees, parking..."
                                    value={formData.costs}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-gray-700/50">
                            <label id="tips-label" className="block text-lg font-medium text-gray-200">
                                General Tips (List)
                            </label>
                            <div className="space-y-3" role="group" aria-labelledby="tips-label">
                                {formData.tips?.map((tip, i) => (
                                    <div key={i} className="flex gap-2 items-center">
                                        <input
                                            type="text"
                                            value={tip}
                                            onChange={(e) => handleTipChange(i, e.target.value)}
                                            className="w-full border border-gray-600 rounded-md bg-gray-800 text-gray-200 focus:ring-blue-500 focus:border-blue-500 shadow-sm py-2 px-3"
                                            placeholder="Add a helpful general tip..."
                                            aria-label={`General tip ${i + 1}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeTip(i)}
                                            className="text-red-500 hover:text-red-400 p-1 rounded-md hover:bg-gray-700"
                                            aria-label={`Remove general tip ${i + 1}`}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addTip}
                                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm font-medium p-1 rounded-md hover:bg-gray-800"
                                    aria-label="Add another general tip"
                                >
                                    <Plus className="w-4 h-4" /> Add General Tip
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-gray-700/50">
                            <h3 className="text-lg font-medium leading-6 text-gray-200">Photo Gallery</h3>
                            {galleryPreviews.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {galleryPreviews.map((url, i) => (
                                        <div key={i} className="relative group aspect-square bg-gray-800 rounded-md border border-gray-700">
                                            <img
                                                src={url}
                                                alt={`Gallery preview ${i + 1}`}
                                                className="absolute inset-0 w-full h-full rounded-md object-cover"
                                                loading="lazy"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeGalleryImage(i)}
                                                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600/80"
                                                aria-label={`Remove gallery image ${i + 1}`}
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div>
                                <label
                                    htmlFor="gallery-upload"
                                    className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700"
                                >
                                    <UploadCloud className="w-4 h-4" aria-hidden="true" />
                                    <span>Add Gallery Images</span>
                                    <input
                                        id="gallery-upload"
                                        name="galleryFiles"
                                        type="file"
                                        className="sr-only"
                                        multiple
                                        accept="image/*"
                                        onChange={handleGalleryChange}
                                        ref={galleryInputRef}
                                        aria-describedby="gallery-desc"
                                    />
                                </label>
                                <p id="gallery-desc" className="text-xs text-gray-500 mt-1">
                                    Add photos from your visit (max 5MB each).
                                </p>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-900/30 border border-red-700/50 rounded-md text-red-300 text-sm" role="alert">
                                {error}
                            </div>
                        )}

                        <div className="pt-5 border-t border-gray-700/50">
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={isSubmitting}
                                    className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg
                                                className="animate-spin h-4 w-4 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Submitting...
                                        </>
                                    ) : (
                                        "Add Entry"
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                {showSuccess && (
                    <div
                        className="absolute bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-xl z-30 flex items-center gap-2 animate-fade-in-out"
                        role="alert"
                        aria-live="polite"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Entry added successfully!
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Main Page Component ---

export default function WaterfallBlog() {
    const [selectedCountry, setSelectedCountry] = useState<string>("All");
    const [selectedWaterfall, setSelectedWaterfall] = useState<Waterfall | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [waterfalls, setWaterfalls] = useState<Waterfall[]>([
        {
            id: 1,
            name: "Rhine Falls (Rheinfall)",
            country: "Switzerland",
            location: "Schaffhausen",
            description: "Europe's largest waterfall. Experience the roar and vibration of the water over one's entire body.",
            experience:
                "The moment I arrived at Rhine Falls, I was immediately struck by the sheer power of the cascading water. The thunderous roar filled the air as I approached the viewing platform. I spent hours just watching the water crash down, mesmerized by the rainbows that formed in the mist.",
            personalNotes:
                "The small café near the viewing platform serves excellent hot chocolate - perfect for warming up after getting sprayed by the falls!",
            rating: 5,
            visitDate: "2022-06-05",
            height: "23 m",
            flowRate: "High",
            hikingDifficulty: "Easy",
            bestTimeToVisit: "May to September",
            transportation: "Train from Zurich",
            accommodation: "Local B&B",
            costs: "Entrance: Free, Boat: 20 CHF",
            image: "https://images.unsplash.com/photo-1729506712731-9b80d00a4a0d?q=80&w=1974&auto=format&fit=crop",
            gallery: [
                "https://images.unsplash.com/photo-1729506712731-9b80d00a4a0d?q=80&w=800",
                "https://images.unsplash.com/photo-1729506712731-9b80d00a4a0d?q=80&w=800",
            ],
            tips: ["Visit early morning", "Bring waterproof camera", "Wear good shoes"],
            mood: "Awestruck",
        },
        {
            id: 2,
            name: "Niagara Falls",
            country: "Canada & USA",
            location: "Ontario & New York",
            description: "One of the most famous waterfalls in the world, spanning the border of Canada and USA.",
            experience:
                "Standing before Niagara Falls was a humbling experience. The sheer volume of water passing over the falls every second is mind-boggling. The Maid of the Mist boat tour brought us incredibly close to the falls.",
            personalNotes: "The nighttime illumination show is absolutely magical!",
            rating: 5,
            visitDate: "2022-07-15",
            height: "51 m",
            flowRate: "Very High",
            hikingDifficulty: "Easy",
            bestTimeToVisit: "June to August",
            transportation: "Bus from Toronto",
            accommodation: "Marriott Hotel",
            costs: "Entrance: Free, Boat: 25 USD",
            image: "https://images.unsplash.com/photo-1489447068241-b3490214e879?q=80&w=1974&auto=format&fit=crop",
            gallery: [
                "https://images.unsplash.com/photo-1489447068241-b3490214e879?q=80&w=800",
                "https://images.unsplash.com/photo-1489447068241-b3490214e879?q=80&w=800",
            ],
            tips: ["Visit at sunset", "Book boat tour in advance", "Bring raincoat"],
            mood: "Magnificent",
        },
        {
            id: 3,
            name: "Victoria Falls",
            country: "Zimbabwe",
            location: "Livingstone",
            description: "Locally known as 'Mosi-oa-Tunya' – 'The Smoke that Thunders'. One of the Seven Natural Wonders of the World.",
            experience:
                "Victoria Falls truly lives up to its name. The spray creates constant rainbows and drenches you even from afar. The sheer scale is impossible to capture in photos.",
            personalNotes: "The Devil's Pool experience during the dry season was terrifying but absolutely unforgettable!",
            rating: 5,
            visitDate: "2022-08-20",
            height: "108 m",
            flowRate: "Extreme (Wet Season)",
            hikingDifficulty: "Moderate",
            bestTimeToVisit: "Feb-May (Peak Flow), Sep-Nov (Low Flow/Pools)",
            transportation: "Flight to Livingstone (LVI) or Victoria Falls (VFA)",
            accommodation: "Various lodges and hotels nearby",
            costs: "National Park Entry: $30-$50 USD (varies by side/nationality)",
            image: "https://images.unsplash.com/photo-1696652697930-6c9b0a91174c?q=80&w=2070&auto=format&fit=crop",
            gallery: [
                "https://images.unsplash.com/photo-1696652697930-6c9b0a91174c?q=80&w=800",
                "https://images.unsplash.com/photo-1696652697930-6c9b0a91174c?q=80&w=800",
            ],
            tips: ["Bring a poncho!", "Visit both Zimbabwe and Zambia sides if possible", "Consider a microlight or helicopter flight"],
            mood: "Overwhelmed",
        },
        {
            id: 4,
            name: "Iguazu Falls",
            country: "Brazil",
            location: "Foz do Iguaçu",
            description: "A massive system of hundreds of waterfalls on the Brazil-Argentina border, wider than Victoria Falls.",
            experience:
                "The scale of Iguazu Falls is simply overwhelming, especially the Devil's Throat section. Walkways take you incredibly close, and the sound is deafening.",
            personalNotes:
                "The Brazilian side offers panoramic views, while the Argentinian side offers closer trails. Both are worth visiting.",
            rating: 5,
            visitDate: "2022-09-10",
            height: "up to 82 m",
            flowRate: "Very High",
            hikingDifficulty: "Moderate",
            bestTimeToVisit: "March-May or Sept-Nov (avoid crowds/peak rain)",
            transportation: "Flight to Foz do Iguaçu (IGU) or Puerto Iguazú (IGR)",
            accommodation: "Hotels on both sides, some inside the park",
            costs: "Park entry approx $20-25 USD per side",
            image: "https://images.unsplash.com/photo-1538703012804-b74999aa11b9?q=80&w=1974&auto=format&fit=crop",
            gallery: [
                "https://images.unsplash.com/photo-1538703012804-b74999aa11b9?q=80&w=800",
                "https://images.unsplash.com/photo-1538703012804-b74999aa11b9?q=80&w=800",
            ],
            tips: [
                "Allow at least two full days",
                "Take the boat ride under the falls (prepare to get soaked!)",
                "Wear comfortable, quick-drying clothes",
            ],
            mood: "Powerful",
        },
    ]);

    const countries = useMemo(() => [...new Set(waterfalls.map((w) => w.country))].sort(), [waterfalls]);

    const filteredWaterfalls = useMemo(
        () => waterfalls.filter((w) => selectedCountry === "All" || w.country === selectedCountry),
        [waterfalls, selectedCountry]
    );

    const groupedWaterfalls = useMemo(
        () =>
            filteredWaterfalls.reduce((groups, waterfall) => {
                const group = groups[waterfall.country] || [];
                group.push(waterfall);
                groups[waterfall.country] = group.sort((a, b) => b.rating - a.rating);
                return groups;
            }, {} as Record<string, Waterfall[]>),
        [filteredWaterfalls]
    );

    const sortedCountries = useMemo(() => Object.keys(groupedWaterfalls).sort(), [groupedWaterfalls]);

    const handleAddWaterfall = (newWaterfall: Waterfall) => {
        setWaterfalls((prev) => [...prev, newWaterfall]);
        // Optional: Auto-select the country of the newly added waterfall
        // setSelectedCountry(newWaterfall.country);
    };

    // Effect to sort waterfalls whenever the list changes
    useEffect(() => {
        setWaterfalls((currentWaterfalls) =>
            [...currentWaterfalls].sort((a, b) => {
                // Sort primarily by country, secondarily by rating (desc)
                const countryComparison = a.country.localeCompare(b.country);
                if (countryComparison !== 0) {
                    return countryComparison;
                }
                return b.rating - a.rating;
            })
        );
    }, [waterfalls.length]); // Re-sort when a waterfall is added or removed

    return (
        <div className={`min-h-screen bg-slate-900 text-gray-100 relative ${poppins.variable} ${lora.variable}`}>
            <div className="fixed inset-0 z-0 pointer-events-none">
                <img
                    src="https://images.unsplash.com/photo-1455577380025-4321f1e1dca7?q=80&w=2560&auto=format&fit=crop"
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-cover opacity-20"
                    loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/85 to-teal-900/10" />
            </div>

            <header className="relative z-10 py-16 sm:py-20">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className={`${poppins.className} text-teal-300 text-xl sm:text-2xl mb-3 sm:mb-4`}>
                        Welcome to my personal journal of
                    </div>
                    <h1
                        className={`${lora.className} text-4xl sm:text-5xl md:text-6xl font-bold mb-6 sm:mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-teal-200 to-emerald-300`}
                    >
                        Nature&apos;s Greatest Cascades
                    </h1>
                    <div className="flex justify-center gap-6 sm:gap-8 text-cyan-400/80 mb-12 sm:mb-16">
                        <Droplets className="w-7 h-7 sm:w-8 sm:h-8" />
                        <MountainSnow className="w-7 h-7 sm:w-8 sm:h-8" />
                        <Compass className="w-7 h-7 sm:w-8 sm:h-8" />
                        <Cloud className="w-7 h-7 sm:w-8 sm:h-8" />
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center items-center lg:items-end gap-4 mt-8">
                        <div className="relative inline-block group">
                            <label
                                htmlFor="country-filter"
                                className="absolute -top-6 left-0 right-0 text-center text-teal-400 text-sm sr-only sm:not-sr-only"
                            >
                                Filter by country
                            </label>
                            <div className="relative">
                                <select
                                    id="country-filter"
                                    value={selectedCountry}
                                    onChange={(e) => setSelectedCountry(e.target.value)}
                                    className="appearance-none bg-slate-800/60 text-gray-100 px-6 py-2.5 pr-12 rounded-full border border-teal-600/30 backdrop-blur-sm hover:bg-slate-700/70 transition-all cursor-pointer min-w-[240px] focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 group-hover:border-teal-500/50 text-center sm:text-left text-sm font-medium"
                                >
                                    <option value="All">All Countries ({waterfalls.length})</option>
                                    {countries.map((c) => (
                                        <option key={c} value={c}>
                                            {c} ({waterfalls.filter((w) => w.country === c).length})
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-teal-500/10 flex items-center justify-center transition-all group-hover:bg-teal-500/20 pointer-events-none">
                                    <ChevronDown className="w-4 h-4 text-teal-300" />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white px-5 py-2.5 rounded-full flex items-center gap-2 transition-all duration-300 text-sm font-medium shadow-lg shadow-teal-900/20 hover:shadow-teal-900/30"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add New Entry</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-5xl mx-auto py-8 px-4">
                <div className="space-y-12">
                    {sortedCountries.length > 0 ? (
                        sortedCountries.map((country) => (
                            <section
                                key={country}
                                className="space-y-4"
                                aria-labelledby={`country-heading-${country.replace(/\s+/g, "-")}`}
                            >
                                <div className="flex items-center gap-4 mb-8">
                                    <h2
                                        id={`country-heading-${country.replace(/\s+/g, "-")}`}
                                        className={`${lora.className} text-3xl text-blue-300`}
                                    >
                                        {country}
                                    </h2>
                                    <div className="h-px flex-1 bg-blue-500/20" />
                                    <span className={`${poppins.className} text-lg sm:text-xl text-blue-300/80`}>
                                        {groupedWaterfalls[country].length} {groupedWaterfalls[country].length === 1 ? "entry" : "entries"}
                                    </span>
                                </div>

                                <div className="space-y-8 pl-4 border-l-2 border-blue-500/10">
                                    {groupedWaterfalls[country].map((waterfall) => (
                                        <article
                                            key={waterfall.id}
                                            className="glass-card rounded-xl overflow-hidden border border-gray-700/50 hover:border-gray-600/80 transition-all duration-300 shadow-lg hover:shadow-2xl group cursor-pointer"
                                            onClick={() => setSelectedWaterfall(waterfall)}
                                            aria-labelledby={`waterfall-title-${waterfall.id}`}
                                        >
                                            <div className="flex flex-col md:flex-row bg-gradient-to-br from-gray-900/30 to-gray-800/20">
                                                <div className="md:w-2/5 lg:w-1/3 relative flex-shrink-0">
                                                    <div className="relative w-full aspect-[16/9] md:aspect-[4/3] bg-gray-800 overflow-hidden md:rounded-l-xl md:rounded-r-none rounded-t-xl">
                                                        <img
                                                            src={waterfall.image}
                                                            alt=""
                                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                            loading="lazy"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent md:bg-gradient-to-r" />
                                                    </div>
                                                    <div
                                                        className={`${poppins.className} absolute bottom-3 left-3 text-xs bg-black/60 px-2.5 py-1 rounded-full backdrop-blur-sm z-10`}
                                                    >
                                                        Visited:{" "}
                                                        {new Date(waterfall.visitDate).toLocaleDateString("en-US", {
                                                            year: "numeric",
                                                            month: "short",
                                                            day: "numeric",
                                                        })}
                                                    </div>
                                                </div>
                                                <div className="flex-1 p-5 sm:p-6 md:p-8 relative flex flex-col justify-between">
                                                    <div>
                                                        <div className="flex items-start justify-between gap-4 mb-2">
                                                            <h3
                                                                id={`waterfall-title-${waterfall.id}`}
                                                                className={`text-xl sm:text-2xl font-bold ${lora.className} mr-auto text-gray-100 group-hover:text-white transition-colors`}
                                                            >
                                                                {waterfall.name}
                                                            </h3>
                                                            <div className="flex gap-1 flex-shrink-0 mt-1">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        className={`h-4 w-4 ${
                                                                            i < waterfall.rating
                                                                                ? "text-yellow-400 fill-yellow-400"
                                                                                : "text-gray-600"
                                                                        }`}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400 mb-4">
                                                            <MapPin className="h-4 w-4 flex-shrink-0" />
                                                            <span>
                                                                {waterfall.location}, {waterfall.country}
                                                            </span>
                                                        </div>
                                                        <p
                                                            className={`text-gray-300 text-on-glass mb-5 sm:mb-6 line-clamp-3 ${lora.className} text-sm sm:text-base leading-relaxed`}
                                                        >
                                                            {waterfall.description}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-700/30">
                                                        <div className="flex items-center gap-2 text-blue-400 group-hover:text-blue-300 transition-colors text-sm font-medium">
                                                            <span>View Details</span>
                                                            <ArrowLeft className="w-4 h-4 transform rotate-180 transition-transform group-hover:translate-x-1" />
                                                        </div>
                                                        <div className={`${poppins.className} text-xs text-gray-500 italic`}>
                                                            Entry #{waterfall.id}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        ))
                    ) : (
                        <div className="text-center py-16 text-gray-400">
                            <p className="text-xl mb-4">No entries match the current filter.</p>
                            <button onClick={() => setSelectedCountry("All")} className="text-blue-400 hover:underline font-medium">
                                Show all entries
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <footer className="relative z-10 text-center py-10 mt-16 border-t border-gray-800/50">
                <p className={`${poppins.className} text-sm text-gray-500`}>Waterfall Wanderings © {new Date().getFullYear()}</p>
            </footer>

            <BlogDialog waterfall={selectedWaterfall} isOpen={selectedWaterfall !== null} onClose={() => setSelectedWaterfall(null)} />
            <CreateBlogDialog isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onAdd={handleAddWaterfall} />
        </div>
    );
}
