"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeProvider, useTheme } from "next-themes";
import {
    FiSun,
    FiMoon,
    FiCreditCard,
    FiUsers,
    FiAward,
    FiDownload,
    FiPlus,
    FiMinus,
    FiHeart,
    FiStar,
    FiMapPin,
    FiCalendar,
    FiClock,
    FiEye,
    FiHome,
    FiActivity,
    FiDollarSign,
    FiCoffee,
    FiZap,
    FiImage,
    FiBook,
    FiMusic,
    FiPhone,
    FiMail,
    FiBriefcase,
    FiCamera,
    FiMessageCircle,
    FiTrendingUp,
} from "react-icons/fi";
import { BsQrCode } from "react-icons/bs";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

type TicketType = {
    id: string;
    name: string;
    price: number;
    description: string;
    features: string[];
    maxGuests: number;
    color: string;
};

type Guest = {
    id: string;
    name: string;
    email: string;
    ticketType: string;
    hasPlus1: boolean;
    plus1Name?: string;
    plus1Email?: string;
};

type Sponsor = {
    id: string;
    name: string;
    logo: React.ReactNode;
    tier: "platinum" | "gold" | "silver";
    template: string;
};

type Donation = {
    id: string;
    amount: number;
    description: string;
    impact: string;
};

const ticketTypes: TicketType[] = [
    {
        id: "general",
        name: "General Admission",
        price: 150,
        description: "Access to main event and dinner",
        features: ["Welcome reception", "Three-course dinner", "Entertainment program", "Silent auction access"],
        maxGuests: 1,
        color: "from-blue-400 to-blue-500",
    },
    {
        id: "vip",
        name: "VIP Experience",
        price: 350,
        description: "Premium experience with exclusive access",
        features: ["VIP reception", "Premium seating", "Meet & greet with speakers", "Gift bag", "Valet parking"],
        maxGuests: 2,
        color: "from-purple-400 to-purple-500",
    },
    {
        id: "table",
        name: "Table Sponsor",
        price: 1200,
        description: "Full table for 8 guests",
        features: ["Reserved table for 8", "Logo recognition", "Premium bar service", "Dedicated server", "Tax benefits"],
        maxGuests: 8,
        color: "from-amber-400 to-amber-500",
    },
];

const donationOptions: Donation[] = [
    {
        id: "meals",
        amount: 25,
        description: "Provide 10 meals",
        impact: "Feeds a family for a week",
    },
    {
        id: "education",
        amount: 50,
        description: "Education support",
        impact: "School supplies for one child",
    },
    {
        id: "healthcare",
        amount: 100,
        description: "Healthcare assistance",
        impact: "Medical checkup for one person",
    },
    {
        id: "custom",
        amount: 0,
        description: "Custom amount",
        impact: "Every dollar makes a difference",
    },
];

const sponsors: Sponsor[] = [
    {
        id: "platinum1",
        name: "Tech Corp Solutions",
        logo: <FiBriefcase className="w-8 h-8 text-blue-600" />,
        tier: "platinum",
        template: "premium-gradient",
    },
    {
        id: "gold1",
        name: "Community Bank",
        logo: <FiDollarSign className="w-8 h-8 text-green-600" />,
        tier: "gold",
        template: "elegant-border",
    },
    {
        id: "silver1",
        name: "Local Restaurant",
        logo: <FiCoffee className="w-8 h-8 text-amber-600" />,
        tier: "silver",
        template: "simple-clean",
    },
];

const GlobalThemeStyles = () => (
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
            --gradient-primary: linear-gradient(135deg, #3b82f6, #8b5cf6);
            --gradient-secondary: linear-gradient(135deg, #dbeafe, #ede9fe);
            --shadow-soft: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            --shadow-medium: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            --shadow-large: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            --border-radius: 16px;
            --border-radius-small: 8px;
            --font-heading: "Bebas Neue", cursive;
            --font-body: "Roboto", sans-serif;
            --scrollbar-thumb: #cbd5e1;
            --scrollbar-track: #f8fafc;

            /* Sponsors Section Variables */
            --sponsors-bg: linear-gradient(to bottom, rgba(239, 246, 255, 0.5), rgba(245, 243, 255, 0.4));
            --sponsors-title: #0f172a;
            --sponsors-subtitle: #374151;
            --sponsors-card-bg: rgba(255, 255, 255, 0.95);
            --sponsors-card-border: rgba(226, 232, 240, 0.6);
            --sponsors-card-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            --sponsors-card-shadow-hover: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            --sponsors-badge-bg: rgba(255, 255, 255, 0.9);
            --sponsors-badge-border: rgba(196, 181, 253, 0.6);
            --sponsors-badge-text: #1f2937;
            --sponsors-icon-bg: linear-gradient(to bottom right, #dbeafe, #e0e7ff);
            --sponsors-icon-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
            --sponsors-contribution-bg: #dbeafe;
            --sponsors-contribution-text: #1e40af;
            --sponsors-dot-purple: #a855f7;
            --sponsors-dot-blue: #3b82f6;
            --sponsors-description-bg: rgba(255, 255, 255, 0.95);
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
            --gradient-primary: linear-gradient(135deg, #60a5fa, #a78bfa);
            --gradient-secondary: linear-gradient(135deg, #1e3a8a, #581c87);
            --shadow-soft: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
            --shadow-medium: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2);
            --shadow-large: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
            --scrollbar-thumb: #475569;
            --scrollbar-track: #1e293b;

            /* Sponsors Section Dark Theme Overrides */
            --sponsors-bg: linear-gradient(to bottom, #0f172a, #1e293b);
            --sponsors-title: #f1f5f9;
            --sponsors-subtitle: #cbd5e1;
            --sponsors-card-bg: #1e293b;
            --sponsors-card-border: #334155;
            --sponsors-card-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2);
            --sponsors-card-shadow-hover: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
            --sponsors-badge-bg: #1e293b;
            --sponsors-badge-text: #f1f5f9;
            --sponsors-badge-border: #334155;
            --sponsors-description-bg: #1e293b;
        }

        body {
            background-color: var(--page-bg);
            color: var(--page-text-primary);
            font-family: var(--font-body);
            font-weight: 300;
            line-height: 1.6;
            transition: background-color 0.3s ease, color 0.3s ease;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
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

        .animate-pulse-slow {
            animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .gradient-text {
            background: var(--gradient-primary);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
    `}</style>
);

const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="p-3 rounded-full bg-[var(--card-bg)] border border-[var(--card-border)] shadow-[var(--shadow-soft)] cursor-pointer"
        >
            {theme === "dark" ? (
                <FiSun className="w-5 h-5 text-[var(--primary-blue)]" />
            ) : (
                <FiMoon className="w-5 h-5 text-[var(--primary-purple)]" />
            )}
        </motion.button>
    );
};

const TabNavigation = ({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) => {
    const tabs = [
        { id: "tickets", label: "Tickets", icon: FiCreditCard },
        { id: "guests", label: "Guests", icon: FiUsers },
        { id: "sponsors", label: "Sponsors", icon: FiAward },
        { id: "downloads", label: "Downloads", icon: FiDownload },
    ];

    return (
        <div className="flex bg-[var(--card-bg)] rounded-[var(--border-radius)] p-2 shadow-[var(--shadow-soft)] border border-[var(--card-border)]">
            {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                    <motion.button
                        key={tab.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex flex-col items-center gap-1 p-3 rounded-[var(--border-radius-small)] cursor-pointer transition-all duration-200 ${
                            activeTab === tab.id
                                ? "bg-[var(--primary-blue)] text-white shadow-[var(--shadow-medium)]"
                                : "text-[var(--page-text-secondary)] hover:text-[var(--page-text-primary)] hover:bg-[var(--soft-blue)]"
                        }`}
                    >
                        <IconComponent className="w-5 h-5" />
                        <span className="text-xs font-medium">{tab.label}</span>
                    </motion.button>
                );
            })}
        </div>
    );
};

const TicketCard = ({ ticket, isSelected, onSelect }: { ticket: TicketType; isSelected: boolean; onSelect: () => void }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSelect}
            className={`p-6 lg:p-8 rounded-[var(--border-radius)] border-2 cursor-pointer transition-all duration-300 lg:flex lg:items-center lg:justify-between ${
                isSelected
                    ? "border-[var(--primary-blue)] bg-[var(--soft-blue)] shadow-[var(--shadow-large)]"
                    : "border-[var(--card-border)] bg-[var(--card-bg)] shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)]"
            }`}
        >
            <div className="lg:flex-1">
                <div className="flex justify-between items-start mb-4 lg:mb-6">
                    <div className="lg:flex-1">
                        <h3 className="text-xl lg:text-2xl font-bold text-[var(--page-text-primary)] mb-1 lg:mb-2">{ticket.name}</h3>
                        <p className="text-[var(--page-text-secondary)] text-sm lg:text-base lg:leading-relaxed">{ticket.description}</p>
                    </div>
                    <div className="text-right lg:hidden">
                        <div className="text-2xl font-bold text-[var(--primary-blue)]">${ticket.price}</div>
                        <div className="text-xs text-[var(--page-text-secondary)]">per ticket</div>
                    </div>
                </div>

                <div className="space-y-2 lg:space-y-3 mb-4 lg:mb-6">
                    {ticket.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 lg:gap-3">
                            <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-[var(--primary-blue)]"></div>
                            <span className="text-sm lg:text-base text-[var(--page-text-secondary)]">{feature}</span>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-between lg:justify-start lg:gap-6">
                    <span className="text-sm lg:text-base text-[var(--page-text-secondary)]">
                        Up to {ticket.maxGuests} {ticket.maxGuests === 1 ? "guest" : "guests"}
                    </span>
                    <motion.div
                        className={`w-6 h-6 lg:w-7 lg:h-7 rounded-full border-2 flex items-center justify-center lg:hidden ${
                            isSelected ? "border-[var(--primary-blue)] bg-[var(--primary-blue)]" : "border-[var(--card-border)]"
                        }`}
                    >
                        {isSelected && <div className="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-white"></div>}
                    </motion.div>
                </div>
            </div>

            <div className="hidden lg:flex lg:flex-col lg:items-end lg:justify-between lg:ml-8 lg:h-full lg:min-h-[120px]">
                <div className="text-right mb-6">
                    <div className="text-4xl font-bold text-[var(--primary-blue)] mb-1">${ticket.price}</div>
                    <div className="text-sm text-[var(--page-text-secondary)]">per ticket</div>
                </div>

                <motion.div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? "border-[var(--primary-blue)] bg-[var(--primary-blue)]" : "border-[var(--card-border)]"
                    }`}
                >
                    {isSelected && <div className="w-3 h-3 rounded-full bg-white"></div>}
                </motion.div>
            </div>
        </motion.div>
    );
};

const DonationCard = ({
    donation,
    selectedAmount,
    onSelect,
}: {
    donation: Donation;
    selectedAmount: number;
    onSelect: (amount: number) => void;
}) => {
    const [customAmount, setCustomAmount] = useState("");

    const isSelected =
        donation.id === "custom"
            ? selectedAmount > 0 && !donationOptions.slice(0, 3).some((d) => d.amount === selectedAmount)
            : selectedAmount === donation.amount;

    const processSelection = () => {
        if (donation.id === "custom") {
            const amount = parseFloat(customAmount);
            if (amount > 0) {
                onSelect(amount);
            }
        } else {
            onSelect(donation.amount);
        }
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={donation.id !== "custom" ? processSelection : undefined}
            className={`p-4 lg:p-6 rounded-[var(--border-radius)] border cursor-pointer transition-all duration-200 ${
                isSelected
                    ? "border-[var(--success-green)] bg-green-50 dark:bg-green-900/20"
                    : "border-[var(--card-border)] bg-[var(--card-bg)] hover:border-[var(--success-green)]"
            }`}
        >
            <div className="flex items-center justify-between mb-2 lg:mb-3">
                <span className="font-medium text-[var(--page-text-primary)] lg:text-lg">
                    {donation.id === "custom" ? "Custom" : `$${donation.amount}`}
                </span>
                <FiHeart
                    className={`w-4 h-4 lg:w-5 lg:h-5 ${
                        isSelected ? "text-[var(--success-green)] fill-current" : "text-[var(--page-text-secondary)]"
                    }`}
                />
            </div>

            {donation.id === "custom" ? (
                <div className="space-y-2 lg:space-y-3">
                    <input
                        type="number"
                        placeholder="Enter amount"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="w-full p-2 lg:p-3 border border-[var(--card-border)] rounded-[var(--border-radius-small)] bg-[var(--card-bg)] text-[var(--page-text-primary)] focus:outline-none focus:border-[var(--primary-blue)] lg:text-base"
                    />
                    <button
                        onClick={processSelection}
                        disabled={!customAmount || parseFloat(customAmount) <= 0}
                        className="w-full py-2 lg:py-3 bg-[var(--success-green)] text-white rounded-[var(--border-radius-small)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed lg:text-base lg:font-medium"
                    >
                        Add Donation
                    </button>
                </div>
            ) : (
                <>
                    <p className="text-sm lg:text-base text-[var(--page-text-secondary)] mb-1 lg:mb-2 lg:leading-relaxed">
                        {donation.description}
                    </p>
                    <p className="text-xs lg:text-sm text-[var(--success-green)] lg:font-medium">{donation.impact}</p>
                </>
            )}
        </motion.div>
    );
};

const TicketsTab = ({ onTicketPurchased }: { onTicketPurchased: (ticketData: Guest) => void }) => {
    const [selectedTicket, setSelectedTicket] = useState<string>("");
    const [selectedDonation, setSelectedDonation] = useState<number>(0);
    const [quantity, setQuantity] = useState(1);
    const [showCheckout, setShowCheckout] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [orderDetails, setOrderDetails] = useState<Partial<OrderDetails>>({});

    const selectedTicketData = ticketTypes.find((t) => t.id === selectedTicket);
    const totalTicketPrice = selectedTicketData ? selectedTicketData.price * quantity : 0;
    const totalPrice = totalTicketPrice + selectedDonation;

    const proceedToCheckout = () => {
        if (!selectedTicketData) return;

        const newOrderDetails: Partial<OrderDetails> = {
            tickets: [
                {
                    type: selectedTicketData.name,
                    quantity: quantity,
                    price: selectedTicketData.price,
                },
            ],
            donation: selectedDonation,
            total: totalPrice,
            guestInfo: {},
            paymentInfo: {},
        };

        setOrderDetails(newOrderDetails);
        setShowCheckout(true);
    };

    const updateOrderDetails = (details: Partial<OrderDetails>) => {
        setOrderDetails(details);
    };

    const completeOrder = () => {
        setShowCheckout(false);

        if (orderDetails.guestInfo?.name && orderDetails.guestInfo?.email && selectedTicketData) {
            const newGuest: Guest = {
                id: Date.now().toString(),
                name: orderDetails.guestInfo.name,
                email: orderDetails.guestInfo.email,
                ticketType: selectedTicket,
                hasPlus1: false,
                plus1Name: undefined,
                plus1Email: undefined,
            };

            for (let i = 0; i < quantity; i++) {
                const ticketGuest: Guest = {
                    ...newGuest,
                    id: `${Date.now()}-${i}`,
                    name: i === 0 ? newGuest.name : `${newGuest.name} (Ticket ${i + 1})`,
                };
                onTicketPurchased(ticketGuest);
            }
        }

        setShowSuccess(true);

        setTimeout(() => {
            setShowSuccess(false);
            window.dispatchEvent(new CustomEvent("switchToDownloads"));
        }, 3000);
    };

    const closeCheckout = () => {
        setShowCheckout(false);
    };

    const addPurchasedTicket = (ticketData: Guest) => {
        onTicketPurchased(ticketData);
    };

    return (
        <div className="space-y-6 lg:space-y-8">
            <div className="lg:bg-gradient-to-r lg:from-blue-50 lg:to-purple-50 dark:lg:from-slate-800 dark:lg:to-slate-700 lg:p-8 lg:rounded-2xl lg:border lg:border-slate-200 dark:lg:border-slate-600">
                <h2 className="text-2xl lg:text-4xl font-bold text-[var(--page-text-primary)] mb-2 lg:mb-4 lg:text-center">
                    Hope Gala 2025
                </h2>
                <div className="flex flex-col lg:flex-row lg:justify-center lg:items-center gap-4 lg:gap-8 text-[var(--page-text-secondary)] text-sm lg:text-base">
                    <div className="flex items-center gap-1 lg:gap-2">
                        <FiCalendar className="w-4 h-4 lg:w-5 lg:h-5" />
                        <span>June 25, 2025</span>
                    </div>
                    <div className="flex items-center gap-1 lg:gap-2">
                        <FiClock className="w-4 h-4 lg:w-5 lg:h-5" />
                        <span>7:00 PM</span>
                    </div>
                    <div className="flex items-center gap-1 lg:gap-2">
                        <FiMapPin className="w-4 h-4 lg:w-5 lg:h-5" />
                        <span>Grand Ballroom</span>
                    </div>
                </div>
            </div>

            <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-lg lg:text-2xl font-bold text-[var(--page-text-primary)] mb-4 lg:mb-6">Select Your Ticket</h3>

                    <div className="space-y-4 lg:space-y-6" id="tickets-start">
                        {ticketTypes.map((ticket) => (
                            <TicketCard
                                key={ticket.id}
                                ticket={ticket}
                                isSelected={selectedTicket === ticket.id}
                                onSelect={() => setSelectedTicket(ticket.id)}
                            />
                        ))}
                    </div>

                    {selectedTicket && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 lg:space-y-6">
                            <div className="lg:bg-white dark:lg:bg-slate-800 lg:p-6 lg:rounded-xl lg:border lg:border-slate-200 dark:lg:border-slate-700">
                                <h4 className="text-lg lg:text-xl font-bold text-[var(--page-text-primary)] mb-3 lg:mb-4">Quantity</h4>
                                <div className="flex items-center gap-4 lg:gap-6">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="p-2 lg:p-3 rounded-full bg-[var(--card-bg)] border border-[var(--card-border)] cursor-pointer hover:bg-[var(--soft-blue)] transition-colors"
                                    >
                                        <FiMinus className="w-4 h-4 lg:w-5 lg:h-5" />
                                    </button>
                                    <span className="text-xl lg:text-2xl font-medium text-[var(--page-text-primary)] min-w-[3rem] text-center">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => setQuantity(Math.min(selectedTicketData?.maxGuests || 1, quantity + 1))}
                                        className="p-2 lg:p-3 rounded-full bg-[var(--card-bg)] border border-[var(--card-border)] cursor-pointer hover:bg-[var(--soft-blue)] transition-colors"
                                    >
                                        <FiPlus className="w-4 h-4 lg:w-5 lg:h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="lg:bg-white dark:lg:bg-slate-800 lg:p-6 lg:rounded-xl lg:border lg:border-slate-200 dark:lg:border-slate-700">
                                <h4 className="text-lg lg:text-xl font-bold text-[var(--page-text-primary)] mb-3 lg:mb-4">
                                    Add a Donation
                                </h4>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                                    {donationOptions.map((donation) => (
                                        <DonationCard
                                            key={donation.id}
                                            donation={donation}
                                            selectedAmount={selectedDonation}
                                            onSelect={setSelectedDonation}
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {selectedTicket && (
                    <div className="lg:col-span-1 lg:relative">
                        <div className="lg:sticky lg:top-6  lg:mt-12 mt-8">
                            <div className="p-6 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[var(--border-radius)] shadow-[var(--shadow-soft)] lg:shadow-[var(--shadow-medium)]">
                                <h4 className="text-lg lg:text-xl font-bold text-[var(--page-text-primary)] mb-4 lg:mb-6">Order Summary</h4>
                                <div className="space-y-3 lg:space-y-4">
                                    <div className="flex justify-between items-center lg:text-lg">
                                        <span>
                                            {selectedTicketData?.name} × {quantity}
                                        </span>
                                        <span className="font-medium">${totalTicketPrice}</span>
                                    </div>
                                    {selectedDonation > 0 && (
                                        <div className="flex justify-between items-center text-[var(--success-green)] lg:text-lg">
                                            <span>Donation</span>
                                            <span className="font-medium">${selectedDonation}</span>
                                        </div>
                                    )}
                                    <div className="border-t border-[var(--card-border)] pt-3 lg:pt-4 flex justify-between font-bold text-lg lg:text-xl">
                                        <span>Total</span>
                                        <span className="text-[var(--primary-blue)]">${totalPrice}</span>
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={proceedToCheckout}
                                    className="w-full mt-4 lg:mt-6 py-3 lg:py-4 bg-[var(--primary-blue)] text-white rounded-[var(--border-radius)] font-medium cursor-pointer shadow-[var(--shadow-medium)] hover:shadow-[var(--shadow-large)] text-base lg:text-lg transition-all"
                                >
                                    Continue to Checkout
                                </motion.button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {showCheckout && (
                    <CheckoutForm orderDetails={orderDetails} onUpdate={updateOrderDetails} onNext={completeOrder} onBack={closeCheckout} />
                )}
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                    >
                        <div className="bg-[var(--card-bg)] rounded-[var(--border-radius)] p-8 w-full max-w-md text-center">
                            <div className="w-16 h-16 mx-auto mb-6 bg-[var(--success-green)] rounded-full flex items-center justify-center">
                                <FiStar className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-[var(--page-text-primary)] mb-4">Order Successful!</h3>
                            <p className="text-[var(--page-text-secondary)] mb-6 leading-relaxed">
                                Your tickets have been processed successfully. You'll be redirected to the downloads section to get your
                                tickets.
                            </p>
                            <div className="flex items-center justify-center gap-2 text-[var(--primary-blue)]">
                                <div className="w-4 h-4 border-2 border-[var(--primary-blue)] border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-sm">Redirecting...</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const GuestForm = ({
    onSubmit,
    onCancel,
    editingGuest,
}: {
    onSubmit: (guest: Omit<Guest, "id">) => void;
    onCancel: () => void;
    editingGuest?: Guest | null;
}) => {
    const [formData, setFormData] = useState({
        name: editingGuest?.name || "",
        email: editingGuest?.email || "",
        ticketType: editingGuest?.ticketType || "general",
        hasPlus1: editingGuest?.hasPlus1 || false,
        plus1Name: editingGuest?.plus1Name || "",
        plus1Email: editingGuest?.plus1Email || "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (editingGuest) {
            setFormData({
                name: editingGuest.name,
                email: editingGuest.email,
                ticketType: editingGuest.ticketType,
                hasPlus1: editingGuest.hasPlus1,
                plus1Name: editingGuest.plus1Name || "",
                plus1Email: editingGuest.plus1Email || "",
            });
        }
    }, [editingGuest]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email";

        if (formData.hasPlus1) {
            if (!formData.plus1Name.trim()) newErrors.plus1Name = "Plus-one name is required";
            if (!formData.plus1Email.trim()) newErrors.plus1Email = "Plus-one email is required";
            else if (!/\S+@\S+\.\S+/.test(formData.plus1Email)) newErrors.plus1Email = "Please enter a valid email";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    const updateFormData = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        >
            <div className="bg-[var(--card-bg)] rounded-[var(--border-radius)] p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-[var(--page-text-primary)]">{editingGuest ? "Edit Guest" : "Add Guest"}</h3>
                    <button onClick={onCancel} className="p-2 hover:bg-[var(--soft-blue)] rounded-full cursor-pointer">
                        <FiPlus className="w-5 h-5 rotate-45 text-[var(--page-text-secondary)]" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--page-text-primary)] mb-2">Full Name *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => updateFormData("name", e.target.value)}
                            className={`w-full p-3 border rounded-[var(--border-radius-small)] bg-[var(--card-bg)] text-[var(--page-text-primary)] focus:outline-none focus:border-[var(--primary-blue)] ${
                                errors.name ? "border-[var(--danger-red)]" : "border-[var(--card-border)]"
                            }`}
                            placeholder="Enter guest name"
                        />
                        {errors.name && <p className="text-[var(--danger-red)] text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--page-text-primary)] mb-2">Email Address *</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => updateFormData("email", e.target.value)}
                            className={`w-full p-3 border rounded-[var(--border-radius-small)] bg-[var(--card-bg)] text-[var(--page-text-primary)] focus:outline-none focus:border-[var(--primary-blue)] ${
                                errors.email ? "border-[var(--danger-red)]" : "border-[var(--card-border)]"
                            }`}
                            placeholder="Enter email address"
                        />
                        {errors.email && <p className="text-[var(--danger-red)] text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--page-text-primary)] mb-2">Ticket Type</label>
                        <select
                            value={formData.ticketType}
                            onChange={(e) => updateFormData("ticketType", e.target.value)}
                            className="w-full p-3 border border-[var(--card-border)] rounded-[var(--border-radius-small)] bg-[var(--card-bg)] text-[var(--page-text-primary)] focus:outline-none focus:border-[var(--primary-blue)]"
                        >
                            {ticketTypes.map((ticket) => (
                                <option key={ticket.id} value={ticket.id}>
                                    {ticket.name} - ${ticket.price}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-[var(--soft-blue)] rounded-[var(--border-radius-small)]">
                        <input
                            type="checkbox"
                            id="hasPlus1"
                            checked={formData.hasPlus1}
                            onChange={(e) => updateFormData("hasPlus1", e.target.checked)}
                            className="w-4 h-4 text-[var(--primary-blue)] border-[var(--card-border)] rounded cursor-pointer"
                        />
                        <label htmlFor="hasPlus1" className="text-sm font-medium text-[var(--page-text-primary)] cursor-pointer">
                            Bring a +1 guest
                        </label>
                    </div>

                    {formData.hasPlus1 && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block text-sm font-medium text-[var(--page-text-primary)] mb-2">Plus-One Name *</label>
                                <input
                                    type="text"
                                    value={formData.plus1Name}
                                    onChange={(e) => updateFormData("plus1Name", e.target.value)}
                                    className={`w-full p-3 border rounded-[var(--border-radius-small)] bg-[var(--card-bg)] text-[var(--page-text-primary)] focus:outline-none focus:border-[var(--primary-blue)] ${
                                        errors.plus1Name ? "border-[var(--danger-red)]" : "border-[var(--card-border)]"
                                    }`}
                                    placeholder="Enter plus-one name"
                                />
                                {errors.plus1Name && <p className="text-[var(--danger-red)] text-xs mt-1">{errors.plus1Name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--page-text-primary)] mb-2">Plus-One Email *</label>
                                <input
                                    type="email"
                                    value={formData.plus1Email}
                                    onChange={(e) => updateFormData("plus1Email", e.target.value)}
                                    className={`w-full p-3 border rounded-[var(--border-radius-small)] bg-[var(--card-bg)] text-[var(--page-text-primary)] focus:outline-none focus:border-[var(--primary-blue)] ${
                                        errors.plus1Email ? "border-[var(--danger-red)]" : "border-[var(--card-border)]"
                                    }`}
                                    placeholder="Enter plus-one email"
                                />
                                {errors.plus1Email && <p className="text-[var(--danger-red)] text-xs mt-1">{errors.plus1Email}</p>}
                            </div>
                        </motion.div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 py-3 px-4 border border-[var(--card-border)] text-[var(--page-text-secondary)] rounded-[var(--border-radius)] font-medium cursor-pointer hover:bg-[var(--soft-blue)]"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 px-4 bg-[var(--primary-blue)] text-white rounded-[var(--border-radius)] font-medium cursor-pointer hover:shadow-[var(--shadow-medium)]"
                        >
                            {editingGuest ? "Update Guest" : "Add Guest"}
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};

const GuestCard = ({ guest, onEdit, onDelete }: { guest: Guest; onEdit: (guest: Guest) => void; onDelete: (id: string) => void }) => {
    const ticketType = ticketTypes.find((t) => t.id === guest.ticketType);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[var(--border-radius)] shadow-[var(--shadow-soft)]"
        >
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h4 className="font-medium text-[var(--page-text-primary)]">{guest.name}</h4>
                    <p className="text-sm text-[var(--page-text-secondary)]">{guest.email}</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(guest)}
                        className="p-1.5 hover:bg-[var(--soft-blue)] rounded-[var(--border-radius-small)] cursor-pointer"
                    >
                        <FiStar className="w-4 h-4 text-[var(--page-text-secondary)]" />
                    </button>
                    <button
                        onClick={() => onDelete(guest.id)}
                        className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-[var(--border-radius-small)] cursor-pointer"
                    >
                        <FiMinus className="w-4 h-4 text-[var(--danger-red)]" />
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-between text-sm">
                <span className="px-2 py-1 bg-[var(--soft-blue)] text-[var(--primary-blue)] rounded-full">{ticketType?.name}</span>
                {guest.hasPlus1 && (
                    <span className="px-2 py-1 bg-[var(--soft-purple)] text-[var(--primary-purple)] rounded-full">
                        +1: {guest.plus1Name}
                    </span>
                )}
            </div>
        </motion.div>
    );
};

const GuestsTab = () => {
    const [guests, setGuests] = useState<Guest[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingGuest, setEditingGuest] = useState<Guest | null>(null);

    const addGuest = (guestData: Omit<Guest, "id">) => {
        const newGuest: Guest = {
            ...guestData,
            id: Date.now().toString(),
        };
        setGuests((prev) => [...prev, newGuest]);
        setShowForm(false);
    };

    const editGuest = (guest: Guest) => {
        setEditingGuest(guest);
        setShowForm(true);
    };

    const updateGuest = (guestData: Omit<Guest, "id">) => {
        if (editingGuest) {
            setGuests((prev) => prev.map((g) => (g.id === editingGuest.id ? { ...guestData, id: g.id } : g)));
            setEditingGuest(null);
            setShowForm(false);
        }
    };

    const deleteGuest = (id: string) => {
        setGuests((prev) => prev.filter((g) => g.id !== id));
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingGuest(null);
    };

    const totalCost = guests.reduce((sum, guest) => {
        const ticket = ticketTypes.find((t) => t.id === guest.ticketType);
        return sum + (ticket?.price || 0);
    }, 0);

    const totalAttendees = guests.reduce((sum, guest) => {
        return sum + 1 + (guest.hasPlus1 ? 1 : 0);
    }, 0);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-[var(--page-text-primary)]">Guest List</h2>
                    <p className="text-[var(--page-text-secondary)] text-sm">Manage your event attendees and +1 invitations</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowForm(true)}
                    className="p-3 bg-[var(--primary-blue)] text-white rounded-full shadow-[var(--shadow-medium)] cursor-pointer"
                >
                    <FiPlus className="w-5 h-5" />
                </motion.button>
            </div>

            {guests.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-[var(--soft-blue)] rounded-[var(--border-radius)]">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-[var(--primary-blue)]">{guests.length}</div>
                        <div className="text-sm text-[var(--page-text-secondary)]">Tickets</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-[var(--primary-blue)]">{totalAttendees}</div>
                        <div className="text-sm text-[var(--page-text-secondary)]">Attendees</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-[var(--primary-blue)]">${totalCost}</div>
                        <div className="text-sm text-[var(--page-text-secondary)]">Total Cost</div>
                    </div>
                </div>
            )}

            {guests.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-[var(--soft-blue)] rounded-full flex items-center justify-center">
                        <FiUsers className="w-8 h-8 text-[var(--primary-blue)]" />
                    </div>
                    <h3 className="text-lg font-medium text-[var(--page-text-primary)] mb-2">No guests added yet</h3>
                    <p className="text-[var(--page-text-secondary)] mb-6">Start by adding your first guest to the event</p>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowForm(true)}
                        className="px-6 py-3 bg-[var(--primary-blue)] text-white rounded-[var(--border-radius)] font-medium cursor-pointer"
                    >
                        Add First Guest
                    </motion.button>
                </motion.div>
            ) : (
                <div className="space-y-3">
                    {guests.map((guest) => (
                        <GuestCard key={guest.id} guest={guest} onEdit={editGuest} onDelete={deleteGuest} />
                    ))}
                </div>
            )}

            <AnimatePresence>
                {showForm && (
                    <GuestForm onSubmit={editingGuest ? updateGuest : addGuest} onCancel={closeForm} editingGuest={editingGuest} />
                )}
            </AnimatePresence>
        </div>
    );
};

const TicketTemplate = ({
    sponsor,
    guestName = "John Doe",
    ticketType = "VIP Experience",
    isPreview = false,
    eventDate = "June 25, 2025",
}: {
    sponsor: Sponsor;
    guestName?: string;
    ticketType?: string;
    isPreview?: boolean;
    eventDate?: string;
}) => {
    const getTemplateStyles = () => {
        switch (sponsor.template) {
            case "premium-gradient":
                return {
                    bg: "bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700",
                    accent: "bg-gradient-to-r from-yellow-400 to-orange-500",
                    text: "text-white",
                    border: "border-yellow-400",
                };
            case "elegant-border":
                return {
                    bg: "bg-gradient-to-br from-gray-900 to-gray-800",
                    accent: "bg-gradient-to-r from-amber-400 to-yellow-500",
                    text: "text-white",
                    border: "border-amber-400",
                };
            case "simple-clean":
                return {
                    bg: "bg-gradient-to-br from-slate-100 to-gray-200",
                    accent: "bg-gradient-to-r from-blue-500 to-cyan-500",
                    text: "text-gray-900",
                    border: "border-blue-500",
                };
            default:
                return {
                    bg: "bg-gradient-to-br from-blue-600 to-purple-600",
                    accent: "bg-white",
                    text: "text-white",
                    border: "border-white",
                };
        }
    };

    const styles = getTemplateStyles();

    return (
        <div
            className={`${styles.bg} p-6 rounded-[var(--border-radius)] ${styles.text} shadow-[var(--shadow-large)] ${
                isPreview ? "transform scale-90" : ""
            }`}
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-2xl font-bold">Hope Gala 2024</h3>
                    <p className="text-sm opacity-90">Building brighter futures together</p>
                </div>
                <div className={`text-3xl`}>{sponsor.logo}</div>
            </div>

            <div className={`${styles.accent} h-1 w-full mb-4 rounded-full`}></div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <p className="text-xs opacity-75 uppercase tracking-wide">Guest</p>
                    <p className="font-medium">{guestName}</p>
                </div>
                <div>
                    <p className="text-xs opacity-75 uppercase tracking-wide">Ticket Type</p>
                    <p className="font-medium">{ticketType}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <p className="text-xs opacity-75 uppercase tracking-wide">Date</p>
                    <p className="font-medium">{eventDate}</p>
                </div>
                <div>
                    <p className="text-xs opacity-75 uppercase tracking-wide">Time</p>
                    <p className="font-medium">7:00 PM</p>
                </div>
            </div>

            <div className="flex justify-between items-center">
                <div className={`px-3 py-1 ${styles.border} border rounded-full`}>
                    <span className="text-xs font-medium">Sponsored by {sponsor.name}</span>
                </div>
                <BsQrCode className="w-8 h-8 opacity-75" />
            </div>
        </div>
    );
};

const SponsorCard = ({
    sponsor,
    isSelected,
    onSelect,
    onPreview,
}: {
    sponsor: Sponsor;
    isSelected: boolean;
    onSelect: () => void;
    onPreview: () => void;
}) => {
    const getTierColor = () => {
        switch (sponsor.tier) {
            case "platinum":
                return "from-purple-400 to-purple-600";
            case "gold":
                return "from-yellow-400 to-amber-500";
            case "silver":
                return "from-gray-400 to-gray-600";
            default:
                return "from-blue-400 to-blue-600";
        }
    };

    const getTierBadge = () => {
        switch (sponsor.tier) {
            case "platinum":
                return "Platinum";
            case "gold":
                return "Gold";
            case "silver":
                return "Silver";
            default:
                return "Partner";
        }
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSelect}
            className={`p-6 rounded-[var(--border-radius)] border-2 cursor-pointer transition-all duration-300 ${
                isSelected
                    ? "border-[var(--primary-blue)] bg-[var(--soft-blue)] shadow-[var(--shadow-large)]"
                    : "border-[var(--card-border)] bg-[var(--card-bg)] shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)]"
            }`}
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="text-3xl">{sponsor.logo}</div>
                    <div>
                        <h3 className="font-bold text-[var(--page-text-primary)]">{sponsor.name}</h3>
                        <div
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getTierColor()}`}
                        >
                            {getTierBadge()}
                        </div>
                    </div>
                </div>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onPreview();
                    }}
                    className="p-2 bg-[var(--soft-blue)] hover:bg-[var(--primary-blue)] hover:text-white rounded-full transition-colors cursor-pointer"
                >
                    <FiEye className="w-4 h-4" />
                </motion.button>
            </div>

            <div className="mb-4">
                <p className="text-sm text-[var(--page-text-secondary)] mb-2">Template Style:</p>
                <p className="text-xs font-medium text-[var(--page-text-primary)] capitalize">{sponsor.template.replace("-", " ")}</p>
            </div>

            <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--page-text-secondary)]">Custom branding included</span>
                <motion.div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? "border-[var(--primary-blue)] bg-[var(--primary-blue)]" : "border-[var(--card-border)]"
                    }`}
                >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                </motion.div>
            </div>
        </motion.div>
    );
};

const SponsorsTab = ({ selectedSponsor, onSponsorSelect }: { selectedSponsor: Sponsor; onSponsorSelect: (sponsor: Sponsor) => void }) => {
    const [previewSponsor, setPreviewSponsor] = useState<Sponsor | null>(null);
    const [showPreview, setShowPreview] = useState(false);

    const openPreview = (sponsor: Sponsor) => {
        setPreviewSponsor(sponsor);
        setShowPreview(true);
    };

    const closePreview = () => {
        setShowPreview(false);
        setPreviewSponsor(null);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-[var(--page-text-primary)] mb-2">Sponsor Templates</h2>
                <p className="text-[var(--page-text-secondary)] text-sm">Choose from our premium sponsor-branded ticket templates</p>
            </div>

            <div className="space-y-4">
                {sponsors.map((sponsor) => (
                    <SponsorCard
                        key={sponsor.id}
                        sponsor={sponsor}
                        isSelected={selectedSponsor.id === sponsor.id}
                        onSelect={() => onSponsorSelect(sponsor)}
                        onPreview={() => openPreview(sponsor)}
                    />
                ))}
            </div>

            {selectedSponsor && selectedSponsor.id !== sponsors[0].id && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[var(--border-radius)] shadow-[var(--shadow-soft)]"
                >
                    <h4 className="text-lg font-bold text-[var(--page-text-primary)] mb-4">Template Selected</h4>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-[var(--page-text-primary)]">
                                {selectedSponsor.name}
                            </p>
                            <p className="text-sm text-[var(--page-text-secondary)]">Your tickets will feature this sponsor's branding</p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                if (selectedSponsor) openPreview(selectedSponsor);
                            }}
                            className="px-4 py-2 bg-[var(--primary-blue)] text-white rounded-[var(--border-radius)] font-medium cursor-pointer"
                        >
                            Preview Ticket
                        </motion.button>
                    </div>
                </motion.div>
            )}

            <AnimatePresence>
                {showPreview && previewSponsor && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[var(--card-bg)] rounded-[var(--border-radius)] p-6 w-full max-w-md"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-[var(--page-text-primary)]">Ticket Preview</h3>
                                <button onClick={closePreview} className="p-2 hover:bg-[var(--soft-blue)] rounded-full cursor-pointer">
                                    <FiPlus className="w-5 h-5 rotate-45 text-[var(--page-text-secondary)]" />
                                </button>
                            </div>

                            <div className="mb-6">
                                <TicketTemplate
                                    sponsor={previewSponsor}
                                    guestName="John Doe"
                                    ticketType="VIP Experience"
                                    isPreview={true}
                                />
                            </div>

                            <div className="text-center">
                                <p className="text-sm text-[var(--page-text-secondary)] mb-4">
                                    This is how your tickets will look with {previewSponsor.name}'s branding
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        onSponsorSelect(previewSponsor);
                                        closePreview();
                                    }}
                                    className="px-6 py-3 bg-[var(--primary-blue)] text-white rounded-[var(--border-radius)] font-medium cursor-pointer"
                                >
                                    Select This Template
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const DownloadableTicket = ({ guest, sponsor }: { guest: Guest; sponsor?: Sponsor }) => {
    const ticketType = ticketTypes.find((t) => t.id === guest.ticketType);
    const defaultSponsor = sponsors[0];
    const activeSponsor = sponsor || defaultSponsor;

    return (
        <div className="bg-white">
            <TicketTemplate
                sponsor={activeSponsor}
                guestName={guest.name}
                ticketType={ticketType?.name || "General Admission"}
                eventDate="June 25, 2025"
            />
            {guest.hasPlus1 && guest.plus1Name && (
                <div className="mt-4">
                    <TicketTemplate
                        sponsor={activeSponsor}
                        guestName={guest.plus1Name}
                        ticketType={ticketType?.name || "General Admission"}
                        eventDate="June 25, 2025"
                    />
                </div>
            )}
        </div>
    );
};

const DownloadCard = ({
    guest,
    onDownload,
    isDownloading,
}: {
    guest: Guest;
    onDownload: (guest: Guest) => void;
    isDownloading: boolean;
}) => {
    const ticketType = ticketTypes.find((t) => t.id === guest.ticketType);
    const attendeeCount = 1 + (guest.hasPlus1 ? 1 : 0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[var(--border-radius)] shadow-[var(--shadow-soft)]"
        >
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h4 className="font-medium text-[var(--page-text-primary)]">{guest.name}</h4>
                    <p className="text-sm text-[var(--page-text-secondary)]">{guest.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-1 bg-[var(--soft-blue)] text-[var(--primary-blue)] rounded-full text-xs">
                            {ticketType?.name}
                        </span>
                        <span className="text-xs text-[var(--page-text-secondary)]">
                            {attendeeCount} ticket{attendeeCount > 1 ? "s" : ""}
                        </span>
                    </div>
                </div>
                <motion.button
                    whileHover={{ scale: isDownloading ? 1 : 1.05 }}
                    whileTap={{ scale: isDownloading ? 1 : 0.95 }}
                    onClick={() => onDownload(guest)}
                    disabled={isDownloading}
                    className={`p-3 rounded-full cursor-pointer transition-all ${
                        isDownloading
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-[var(--primary-blue)] text-white shadow-[var(--shadow-medium)] hover:shadow-[var(--shadow-large)]"
                    }`}
                >
                    {isDownloading ? (
                        <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <FiDownload className="w-5 h-5" />
                    )}
                </motion.button>
            </div>

            {guest.hasPlus1 && (
                <div className="mt-3 p-2 bg-[var(--soft-purple)] rounded-[var(--border-radius-small)]">
                    <p className="text-sm text-[var(--primary-purple)]">
                        <FiPlus className="w-3 h-3 inline mr-1" />
                        Plus-one: {guest.plus1Name}
                    </p>
                </div>
            )}
        </motion.div>
    );
};

const SimpleTicketTemplate = ({ guest, sponsor }: { guest: Guest; sponsor: Sponsor }) => {
    const ticketType = ticketTypes.find((t) => t.id === guest.ticketType);

    const getTemplateColors = () => {
        switch (sponsor.template) {
            case "premium-gradient":
                return {
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    accentColor: "#fbbf24",
                    textColor: "#ffffff",
                    secondaryBg: "rgba(255, 255, 255, 0.1)",
                };
            case "elegant-border":
                return {
                    background: "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
                    accentColor: "#fbbf24",
                    textColor: "#ffffff",
                    secondaryBg: "rgba(255, 255, 255, 0.1)",
                };
            case "simple-clean":
                return {
                    background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                    accentColor: "#3b82f6",
                    textColor: "#1f2937",
                    secondaryBg: "rgba(59, 130, 246, 0.1)",
                };
            default:
                return {
                    background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                    accentColor: "#fbbf24",
                    textColor: "#ffffff",
                    secondaryBg: "rgba(255, 255, 255, 0.1)",
                };
        }
    };

    const colors = getTemplateColors();

    return (
        <div
            style={{
                width: "500px",
                height: "300px",
                background: colors.background,
                color: colors.textColor,
                borderRadius: "16px",
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                boxSizing: "border-box",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    top: "0",
                    right: "0",
                    width: "200px",
                    height: "200px",
                    background: colors.secondaryBg,
                    borderRadius: "50%",
                    transform: "translate(50px, -50px)",
                }}
            />

            <div style={{ padding: "32px", position: "relative", zIndex: 1, height: "100%", display: "flex", flexDirection: "column" }}>
                <div style={{ marginBottom: "24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                        <div>
                            <h1
                                style={{
                                    fontSize: "32px",
                                    fontWeight: "800",
                                    margin: "0 0 4px 0",
                                    letterSpacing: "0.5px",
                                    lineHeight: "1",
                                }}
                            >
                                HOPE GALA
                            </h1>
                            <div
                                style={{
                                    fontSize: "20px",
                                    fontWeight: "300",
                                    margin: "0 0 8px 0",
                                    letterSpacing: "0.5px",
                                }}
                            >
                                2025
                            </div>
                            <p
                                style={{
                                    fontSize: "13px",
                                    margin: "0",
                                    opacity: "0.9",
                                    fontWeight: "400",
                                }}
                            >
                                Building Brighter Futures Together
                            </p>
                        </div>

                        <div
                            style={{
                                width: "50px",
                                height: "50px",
                                backgroundColor: colors.accentColor,
                                borderRadius: "12px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "24px",
                                fontWeight: "bold",
                                color: colors.textColor === "#1f2937" ? "#ffffff" : "#1f2937",
                                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            {sponsor.name.charAt(0)}
                        </div>
                    </div>

                    <div
                        style={{
                            height: "2px",
                            background: colors.accentColor,
                            borderRadius: "1px",
                            width: "100%",
                        }}
                    />
                </div>

                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div style={{ marginBottom: "20px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                            <div style={{ flex: 1 }}>
                                <p
                                    style={{
                                        fontSize: "11px",
                                        textTransform: "uppercase",
                                        letterSpacing: "1.5px",
                                        margin: "0 0 6px 0",
                                        opacity: "0.8",
                                        fontWeight: "600",
                                    }}
                                >
                                    ADMIT ONE
                                </p>
                                <p
                                    style={{
                                        fontSize: "24px",
                                        fontWeight: "700",
                                        margin: "0 0 4px 0",
                                        lineHeight: "1.1",
                                    }}
                                >
                                    {guest.name}
                                </p>
                                <p
                                    style={{
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        margin: "0",
                                        opacity: "0.9",
                                    }}
                                >
                                    {ticketType?.name || "General Admission"}
                                </p>
                            </div>

                            <div
                                style={{
                                    backgroundColor: colors.secondaryBg,
                                    padding: "8px 12px",
                                    borderRadius: "8px",
                                    textAlign: "center",
                                }}
                            >
                                <p
                                    style={{
                                        fontSize: "10px",
                                        margin: "0 0 2px 0",
                                        opacity: "0.7",
                                        textTransform: "uppercase",
                                        letterSpacing: "1px",
                                    }}
                                >
                                    Ticket
                                </p>
                                <p style={{ fontSize: "14px", margin: "0", fontWeight: "700" }}>#{guest.id.slice(-4).toUpperCase()}</p>
                            </div>
                        </div>
                    </div>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr 1fr",
                            gap: "16px",
                            marginBottom: "20px",
                        }}
                    >
                        <div>
                            <p
                                style={{
                                    fontSize: "10px",
                                    textTransform: "uppercase",
                                    letterSpacing: "1.2px",
                                    margin: "0 0 4px 0",
                                    opacity: "0.7",
                                    fontWeight: "600",
                                }}
                            >
                                DATE
                            </p>
                            <p style={{ fontSize: "14px", fontWeight: "600", margin: "0", lineHeight: "1.2" }}>
                                June 25
                                <br />
                                2025
                            </p>
                        </div>
                        <div>
                            <p
                                style={{
                                    fontSize: "10px",
                                    textTransform: "uppercase",
                                    letterSpacing: "1.2px",
                                    margin: "0 0 4px 0",
                                    opacity: "0.7",
                                    fontWeight: "600",
                                }}
                            >
                                TIME
                            </p>
                            <p style={{ fontSize: "14px", fontWeight: "600", margin: "0", lineHeight: "1.2" }}>
                                7:00 PM
                                <br />
                                EST
                            </p>
                        </div>
                        <div>
                            <p
                                style={{
                                    fontSize: "10px",
                                    textTransform: "uppercase",
                                    letterSpacing: "1.2px",
                                    margin: "0 0 4px 0",
                                    opacity: "0.7",
                                    fontWeight: "600",
                                }}
                            >
                                VENUE
                            </p>
                            <p style={{ fontSize: "14px", fontWeight: "600", margin: "0", lineHeight: "1.2" }}>
                                Grand
                                <br />
                                Ballroom
                            </p>
                        </div>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <div
                            style={{
                                fontSize: "11px",
                                fontWeight: "500",
                                opacity: "0.8",
                            }}
                        >
                            Sponsored by {sponsor.name}
                        </div>

                        <div
                            style={{
                                width: "36px",
                                height: "36px",
                                backgroundColor: colors.textColor,
                                borderRadius: "6px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "20px",
                                color: colors.background.includes("gradient") ? "#3b82f6" : colors.background,
                                fontWeight: "bold",
                            }}
                        >
                            ⚬
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DownloadsTab = ({ purchasedTickets, selectedSponsor }: { purchasedTickets: Guest[]; selectedSponsor: Sponsor }) => {
    const [downloadingGuest, setDownloadingGuest] = useState<string | null>(null);
    const [downloadingAll, setDownloadingAll] = useState(false);
    const ticketRef = useRef<HTMLDivElement | null>(null);

    const generatePDFTicket = async (guest: Guest) => {
        setDownloadingGuest(guest.id);

        try {
            await new Promise((resolve) => setTimeout(resolve, 200));

            if (!ticketRef.current) {
                console.error("Ticket template not found");
                alert("Error: Unable to generate ticket. Please try again.");
                return;
            }

            console.log("Generating PDF ticket for:", guest.name);

            const canvas = await html2canvas(ticketRef.current, {
                backgroundColor: "#ffffff",
                scale: 2,
                useCORS: true,
                allowTaint: false,
                logging: false,
                width: 500,
                height: 300,
                foreignObjectRendering: false,
                scrollX: 0,
                scrollY: 0,
                removeContainer: true,
            });

            const pdf = new jsPDF({
                orientation: "landscape",
                unit: "mm",
                format: [150, 100],
            });

            const imgData = canvas.toDataURL("image/png");

            pdf.addImage(imgData, "PNG", 5, 5, 140, 90);

            if (guest.hasPlus1 && guest.plus1Name) {
                pdf.addPage();

                pdf.addImage(imgData, "PNG", 5, 5, 140, 90);
            }

            pdf.save(`Hope-Gala-Ticket-${guest.name.replace(/\s+/g, "-")}.pdf`);

            console.log("PDF ticket generated successfully");
        } catch (error) {
            console.error("Error generating PDF ticket:", error);
            alert("Error generating ticket PDF. Please try again.");
        } finally {
            setDownloadingGuest(null);
        }
    };

    const downloadAllTickets = async () => {
        setDownloadingAll(true);

        try {
            for (const guest of purchasedTickets) {
                await generatePDFTicket(guest);
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
        } catch (error) {
            console.error("Error downloading all tickets:", error);
            alert("Error downloading tickets. Please try again.");
        } finally {
            setDownloadingAll(false);
        }
    };

    const totalTickets = purchasedTickets.reduce((sum, guest) => sum + 1 + (guest.hasPlus1 ? 1 : 0), 0);

    const currentGuest = downloadingGuest ? purchasedTickets.find((g) => g.id === downloadingGuest) : purchasedTickets[0];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-[var(--page-text-primary)]">Download Tickets</h2>
                    <p className="text-[var(--page-text-secondary)] text-sm">Download PDF tickets for your guests</p>
                </div>
                {purchasedTickets.length > 0 && (
                    <motion.button
                        whileHover={{ scale: downloadingAll ? 1 : 1.05 }}
                        whileTap={{ scale: downloadingAll ? 1 : 0.95 }}
                        onClick={downloadAllTickets}
                        disabled={downloadingAll}
                        className={`px-4 py-2 rounded-[var(--border-radius)] font-medium cursor-pointer transition-all ${
                            downloadingAll
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-[var(--success-green)] text-white shadow-[var(--shadow-medium)]"
                        }`}
                    >
                        {downloadingAll ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                Downloading...
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <FiDownload className="w-4 h-4" />
                                Download All PDFs
                            </div>
                        )}
                    </motion.button>
                )}
            </div>

            {purchasedTickets.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-[var(--soft-blue)] rounded-[var(--border-radius)]">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-[var(--primary-blue)]">{purchasedTickets.length}</div>
                        <div className="text-sm text-[var(--page-text-secondary)]">Guests</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-[var(--primary-blue)]">{totalTickets}</div>
                        <div className="text-sm text-[var(--page-text-secondary)]">Total Tickets</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-[var(--success-green)]">PDF Ready</div>
                        <div className="text-sm text-[var(--page-text-secondary)]">Status</div>
                    </div>
                </div>
            )}

            {purchasedTickets.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-[var(--soft-blue)] rounded-full flex items-center justify-center">
                        <FiDownload className="w-8 h-8 text-[var(--primary-blue)]" />
                    </div>
                    <h3 className="text-lg font-medium text-[var(--page-text-primary)] mb-2">No tickets to download</h3>
                    <p className="text-[var(--page-text-secondary)]">Purchase tickets first to generate downloadable PDFs</p>
                </motion.div>
            ) : (
                <div className="space-y-3">
                    {purchasedTickets.map((guest) => (
                        <DownloadCard
                            key={guest.id}
                            guest={guest}
                            onDownload={generatePDFTicket}
                            isDownloading={downloadingGuest === guest.id}
                        />
                    ))}
                </div>
            )}

            {purchasedTickets.length > 0 && currentGuest && (
                <div
                    style={{
                        position: "fixed",
                        top: "-1000px",
                        left: "0",
                        width: "500px",
                        height: "300px",
                        backgroundColor: "white",
                        zIndex: -1000,
                        pointerEvents: "none",
                    }}
                >
                    <div ref={ticketRef} style={{ width: "500px", height: "300px", padding: "20px" }}>
                        <SimpleTicketTemplate guest={currentGuest} sponsor={selectedSponsor} />
                    </div>
                </div>
            )}
        </div>
    );
};

type CheckoutStep = "details" | "payment" | "confirmation";

type OrderDetails = {
    tickets: { type: string; quantity: number; price: number }[];
    donation: number;
    total: number;
    guestInfo: {
        name?: string;
        email?: string;
        phone?: string;
        organization?: string;
    };
    paymentInfo: {
        cardNumber?: string;
        expiryDate?: string;
        cvv?: string;
        name?: string;
        billingAddress?: {
            street?: string;
            city?: string;
            state?: string;
            zipCode?: string;
        };
    };
};

const CheckoutForm = ({
    orderDetails,
    onUpdate,
    onNext,
    onBack,
}: {
    orderDetails: Partial<OrderDetails>;
    onUpdate: (details: Partial<OrderDetails>) => void;
    onNext: () => void;
    onBack: () => void;
}) => {
    const [currentStep, setCurrentStep] = useState<CheckoutStep>("details");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isProcessing, setIsProcessing] = useState(false);

    const validateStep = (step: CheckoutStep) => {
        const newErrors: Record<string, string> = {};

        if (step === "details") {
            if (!orderDetails.guestInfo?.name?.trim()) newErrors.name = "Name is required";
            if (!orderDetails.guestInfo?.email?.trim()) newErrors.email = "Email is required";
            else if (!/\S+@\S+\.\S+/.test(orderDetails.guestInfo.email)) newErrors.email = "Invalid email";
            if (!orderDetails.guestInfo?.phone?.trim()) newErrors.phone = "Phone is required";
        }

        if (step === "payment") {
            if (!orderDetails.paymentInfo?.cardNumber?.replace(/\s/g, "")) newErrors.cardNumber = "Card number is required";
            if (!orderDetails.paymentInfo?.expiryDate) newErrors.expiryDate = "Expiry date is required";
            if (!orderDetails.paymentInfo?.cvv) newErrors.cvv = "CVV is required";
            if (!orderDetails.paymentInfo?.name?.trim()) newErrors.cardName = "Cardholder name is required";
            if (!orderDetails.paymentInfo?.billingAddress?.street?.trim()) newErrors.street = "Street address is required";
            if (!orderDetails.paymentInfo?.billingAddress?.city?.trim()) newErrors.city = "City is required";
            if (!orderDetails.paymentInfo?.billingAddress?.zipCode?.trim()) newErrors.zipCode = "ZIP code is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const proceedToNext = () => {
        if (validateStep(currentStep)) {
            if (currentStep === "details") {
                setCurrentStep("payment");
            } else if (currentStep === "payment") {
                setCurrentStep("confirmation");
            }
        }
    };

    const goBack = () => {
        if (currentStep === "payment") {
            setCurrentStep("details");
        } else if (currentStep === "confirmation") {
            setCurrentStep("payment");
        } else {
            onBack();
        }
    };

    const processPayment = async () => {
        if (!validateStep("payment")) return;

        setIsProcessing(true);

        await new Promise((resolve) => setTimeout(resolve, 2000));

        setIsProcessing(false);
        onNext();
    };

    const updateGuestInfo = (field: string, value: string) => {
        onUpdate({
            ...orderDetails,
            guestInfo: {
                ...orderDetails.guestInfo,
                [field]: value,
            },
        });
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    const updatePaymentInfo = (field: string, value: string) => {
        const newPaymentInfo = { ...orderDetails.paymentInfo };

        if (field.includes(".")) {
            const [parent, child] = field.split(".");
            newPaymentInfo[parent as keyof typeof newPaymentInfo] = {
                ...(newPaymentInfo[parent as keyof typeof newPaymentInfo] as any),
                [child]: value,
            };
        } else {
            (newPaymentInfo as any)[field] = value;
        }

        onUpdate({
            ...orderDetails,
            paymentInfo: newPaymentInfo,
        });

        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    const formatCardNumber = (value: string) => {
        return value
            .replace(/\s/g, "")
            .replace(/(.{4})/g, "$1 ")
            .trim();
    };

    const renderStepIndicator = () => (
        <div className="flex items-center justify-center mb-8">
            {["details", "payment", "confirmation"].map((step, index) => (
                <div key={step} className="flex items-center">
                    <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            currentStep === step
                                ? "bg-[var(--primary-blue)] text-white"
                                : index < ["details", "payment", "confirmation"].indexOf(currentStep)
                                ? "bg-[var(--success-green)] text-white"
                                : "bg-[var(--card-border)] text-[var(--page-text-secondary)]"
                        }`}
                    >
                        {index < ["details", "payment", "confirmation"].indexOf(currentStep) ? "✓" : index + 1}
                    </div>
                    {index < 2 && (
                        <div
                            className={`w-12 h-0.5 mx-2 ${
                                index < ["details", "payment", "confirmation"].indexOf(currentStep)
                                    ? "bg-[var(--success-green)]"
                                    : "bg-[var(--card-border)]"
                            }`}
                        />
                    )}
                </div>
            ))}
        </div>
    );

    const renderDetailsStep = () => (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-[var(--page-text-primary)] mb-4">Contact Information</h3>

            <div>
                <label className="block text-sm font-medium text-[var(--page-text-primary)] mb-2">Full Name *</label>
                <input
                    type="text"
                    value={orderDetails.guestInfo?.name || ""}
                    onChange={(e) => updateGuestInfo("name", e.target.value)}
                    className={`w-full p-3 border rounded-[var(--border-radius-small)] bg-[var(--card-bg)] text-[var(--page-text-primary)] focus:outline-none focus:border-[var(--primary-blue)] ${
                        errors.name ? "border-[var(--danger-red)]" : "border-[var(--card-border)]"
                    }`}
                    placeholder="Enter your full name"
                />
                {errors.name && <p className="text-[var(--danger-red)] text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-[var(--page-text-primary)] mb-2">Email Address *</label>
                <input
                    type="email"
                    value={orderDetails.guestInfo?.email || ""}
                    onChange={(e) => updateGuestInfo("email", e.target.value)}
                    className={`w-full p-3 border rounded-[var(--border-radius-small)] bg-[var(--card-bg)] text-[var(--page-text-primary)] focus:outline-none focus:border-[var(--primary-blue)] ${
                        errors.email ? "border-[var(--danger-red)]" : "border-[var(--card-border)]"
                    }`}
                    placeholder="Enter your email"
                />
                {errors.email && <p className="text-[var(--danger-red)] text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-[var(--page-text-primary)] mb-2">Phone Number *</label>
                <input
                    type="tel"
                    value={orderDetails.guestInfo?.phone || ""}
                    onChange={(e) => updateGuestInfo("phone", e.target.value)}
                    className={`w-full p-3 border rounded-[var(--border-radius-small)] bg-[var(--card-bg)] text-[var(--page-text-primary)] focus:outline-none focus:border-[var(--primary-blue)] ${
                        errors.phone ? "border-[var(--danger-red)]" : "border-[var(--card-border)]"
                    }`}
                    placeholder="Enter your phone number"
                />
                {errors.phone && <p className="text-[var(--danger-red)] text-xs mt-1">{errors.phone}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-[var(--page-text-primary)] mb-2">Organization (Optional)</label>
                <input
                    type="text"
                    value={orderDetails.guestInfo?.organization || ""}
                    onChange={(e) => updateGuestInfo("organization", e.target.value)}
                    className="w-full p-3 border border-[var(--card-border)] rounded-[var(--border-radius-small)] bg-[var(--card-bg)] text-[var(--page-text-primary)] focus:outline-none focus:border-[var(--primary-blue)]"
                    placeholder="Company or organization name"
                />
            </div>
        </div>
    );

    const renderPaymentStep = () => (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-[var(--page-text-primary)] mb-4">Payment Information</h3>

            <div>
                <label className="block text-sm font-medium text-[var(--page-text-primary)] mb-2">Card Number *</label>
                <input
                    type="text"
                    value={formatCardNumber(orderDetails.paymentInfo?.cardNumber || "")}
                    onChange={(e) => updatePaymentInfo("cardNumber", e.target.value.replace(/\s/g, ""))}
                    maxLength={19}
                    className={`w-full p-3 border rounded-[var(--border-radius-small)] bg-[var(--card-bg)] text-[var(--page-text-primary)] focus:outline-none focus:border-[var(--primary-blue)] ${
                        errors.cardNumber ? "border-[var(--danger-red)]" : "border-[var(--card-border)]"
                    }`}
                    placeholder="1234 5678 9012 3456"
                />
                {errors.cardNumber && <p className="text-[var(--danger-red)] text-xs mt-1">{errors.cardNumber}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-[var(--page-text-primary)] mb-2">Expiry Date *</label>
                    <input
                        type="text"
                        value={orderDetails.paymentInfo?.expiryDate || ""}
                        onChange={(e) => updatePaymentInfo("expiryDate", e.target.value)}
                        placeholder="MM/YY"
                        maxLength={5}
                        className={`w-full p-3 border rounded-[var(--border-radius-small)] bg-[var(--card-bg)] text-[var(--page-text-primary)] focus:outline-none focus:border-[var(--primary-blue)] ${
                            errors.expiryDate ? "border-[var(--danger-red)]" : "border-[var(--card-border)]"
                        }`}
                    />
                    {errors.expiryDate && <p className="text-[var(--danger-red)] text-xs mt-1">{errors.expiryDate}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-[var(--page-text-primary)] mb-2">CVV *</label>
                    <input
                        type="text"
                        value={orderDetails.paymentInfo?.cvv || ""}
                        onChange={(e) => updatePaymentInfo("cvv", e.target.value)}
                        maxLength={4}
                        className={`w-full p-3 border rounded-[var(--border-radius-small)] bg-[var(--card-bg)] text-[var(--page-text-primary)] focus:outline-none focus:border-[var(--primary-blue)] ${
                            errors.cvv ? "border-[var(--danger-red)]" : "border-[var(--card-border)]"
                        }`}
                        placeholder="123"
                    />
                    {errors.cvv && <p className="text-[var(--danger-red)] text-xs mt-1">{errors.cvv}</p>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-[var(--page-text-primary)] mb-2">Cardholder Name *</label>
                <input
                    type="text"
                    value={orderDetails.paymentInfo?.name || ""}
                    onChange={(e) => updatePaymentInfo("name", e.target.value)}
                    className={`w-full p-3 border rounded-[var(--border-radius-small)] bg-[var(--card-bg)] text-[var(--page-text-primary)] focus:outline-none focus:border-[var(--primary-blue)] ${
                        errors.cardName ? "border-[var(--danger-red)]" : "border-[var(--card-border)]"
                    }`}
                    placeholder="Name on card"
                />
                {errors.cardName && <p className="text-[var(--danger-red)] text-xs mt-1">{errors.cardName}</p>}
            </div>

            <h4 className="text-md font-medium text-[var(--page-text-primary)] mt-6 mb-3">Billing Address</h4>

            <div>
                <label className="block text-sm font-medium text-[var(--page-text-primary)] mb-2">Street Address *</label>
                <input
                    type="text"
                    value={orderDetails.paymentInfo?.billingAddress?.street || ""}
                    onChange={(e) => updatePaymentInfo("billingAddress.street", e.target.value)}
                    className={`w-full p-3 border rounded-[var(--border-radius-small)] bg-[var(--card-bg)] text-[var(--page-text-primary)] focus:outline-none focus:border-[var(--primary-blue)] ${
                        errors.street ? "border-[var(--danger-red)]" : "border-[var(--card-border)]"
                    }`}
                    placeholder="123 Main Street"
                />
                {errors.street && <p className="text-[var(--danger-red)] text-xs mt-1">{errors.street}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-[var(--page-text-primary)] mb-2">City *</label>
                    <input
                        type="text"
                        value={orderDetails.paymentInfo?.billingAddress?.city || ""}
                        onChange={(e) => updatePaymentInfo("billingAddress.city", e.target.value)}
                        className={`w-full p-3 border rounded-[var(--border-radius-small)] bg-[var(--card-bg)] text-[var(--page-text-primary)] focus:outline-none focus:border-[var(--primary-blue)] ${
                            errors.city ? "border-[var(--danger-red)]" : "border-[var(--card-border)]"
                        }`}
                        placeholder="City"
                    />
                    {errors.city && <p className="text-[var(--danger-red)] text-xs mt-1">{errors.city}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-[var(--page-text-primary)] mb-2">ZIP Code *</label>
                    <input
                        type="text"
                        value={orderDetails.paymentInfo?.billingAddress?.zipCode || ""}
                        onChange={(e) => updatePaymentInfo("billingAddress.zipCode", e.target.value)}
                        className={`w-full p-3 border rounded-[var(--border-radius-small)] bg-[var(--card-bg)] text-[var(--page-text-primary)] focus:outline-none focus:border-[var(--primary-blue)] ${
                            errors.zipCode ? "border-[var(--danger-red)]" : "border-[var(--card-border)]"
                        }`}
                        placeholder="12345"
                    />
                    {errors.zipCode && <p className="text-[var(--danger-red)] text-xs mt-1">{errors.zipCode}</p>}
                </div>
            </div>
        </div>
    );

    const renderConfirmationStep = () => (
        <div className="space-y-6">
            <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-[var(--success-green)] rounded-full flex items-center justify-center">
                    <FiStar className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[var(--page-text-primary)] mb-2">Order Summary</h3>
                <p className="text-[var(--page-text-secondary)]">Please review your order before completing payment</p>
            </div>

            <div className="p-4 bg-[var(--soft-blue)] rounded-[var(--border-radius)]">
                <h4 className="font-medium text-[var(--page-text-primary)] mb-3">Contact Information</h4>
                <div className="space-y-1 text-sm">
                    <p>
                        <span className="font-medium">Name:</span> {orderDetails.guestInfo?.name}
                    </p>
                    <p>
                        <span className="font-medium">Email:</span> {orderDetails.guestInfo?.email}
                    </p>
                    <p>
                        <span className="font-medium">Phone:</span> {orderDetails.guestInfo?.phone}
                    </p>
                    {orderDetails.guestInfo?.organization && (
                        <p>
                            <span className="font-medium">Organization:</span> {orderDetails.guestInfo.organization}
                        </p>
                    )}
                </div>
            </div>

            <div className="p-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[var(--border-radius)]">
                <h4 className="font-medium text-[var(--page-text-primary)] mb-3">Order Details</h4>
                <div className="space-y-2">
                    {orderDetails.tickets?.map((ticket, index) => (
                        <div key={index} className="flex justify-between text-sm">
                            <span>
                                {ticket.type} × {ticket.quantity}
                            </span>
                            <span>${ticket.price * ticket.quantity}</span>
                        </div>
                    ))}
                    {orderDetails.donation && orderDetails.donation > 0 && (
                        <div className="flex justify-between text-sm text-[var(--success-green)]">
                            <span>Donation</span>
                            <span>${orderDetails.donation}</span>
                        </div>
                    )}
                    <div className="border-t border-[var(--card-border)] pt-2 flex justify-between font-bold">
                        <span>Total</span>
                        <span className="text-[var(--primary-blue)]">${orderDetails.total}</span>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        >
            <div className="bg-[var(--card-bg)] rounded-[var(--border-radius)] p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-[var(--page-text-primary)]">Checkout</h2>
                    <button onClick={onBack} className="p-2 hover:bg-[var(--soft-blue)] rounded-full cursor-pointer">
                        <FiPlus className="w-5 h-5 rotate-45 text-[var(--page-text-secondary)]" />
                    </button>
                </div>

                {renderStepIndicator()}

                <div className="mb-6">
                    {currentStep === "details" && renderDetailsStep()}
                    {currentStep === "payment" && renderPaymentStep()}
                    {currentStep === "confirmation" && renderConfirmationStep()}
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={goBack}
                        className="flex-1 py-3 px-4 border border-[var(--card-border)] text-[var(--page-text-secondary)] rounded-[var(--border-radius)] font-medium cursor-pointer hover:bg-[var(--soft-blue)]"
                    >
                        {currentStep === "details" ? "Cancel" : "Back"}
                    </button>
                    <button
                        onClick={currentStep === "confirmation" ? processPayment : proceedToNext}
                        disabled={isProcessing}
                        className={`flex-1 py-3 px-4 rounded-[var(--border-radius)] font-medium cursor-pointer transition-all ${
                            isProcessing
                                ? "bg-gray-400 text-white cursor-not-allowed"
                                : "bg-[var(--primary-blue)] text-white hover:shadow-[var(--shadow-medium)]"
                        }`}
                    >
                        {isProcessing ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Processing...
                            </div>
                        ) : currentStep === "confirmation" ? (
                            "Complete Payment"
                        ) : (
                            "Continue"
                        )}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

const LandingPage = ({ onEnterTickets }: { onEnterTickets: () => void }) => {
    return (
        <div className="min-h-screen bg-[var(--page-bg)]">
            <header className="absolute top-0 left-0 right-0 z-20 p-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center">
                        <h1 className="text-2xl font-bold text-white">
                            Hope <span className="font-light">Gala</span>
                        </h1>
                    </div>
                    <nav className="hidden md:flex items-center gap-8 text-white/90">
                        <a href="#about" className="hover:text-white transition-colors cursor-pointer">
                            About
                        </a>
                        <a href="#mission" className="hover:text-white transition-colors cursor-pointer">
                            Mission
                        </a>
                        <a href="#impact" className="hover:text-white transition-colors cursor-pointer">
                            Impact
                        </a>
                        <a href="#sponsors" className="hover:text-white transition-colors cursor-pointer">
                            Sponsors
                        </a>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onEnterTickets}
                            className="px-6 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full hover:bg-white/30 transition-all cursor-pointer"
                        >
                            Get Tickets
                        </motion.button>
                    </nav>
                    <ThemeToggle />
                </div>
            </header>

            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1536392706976-e486e2ba97af?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>
                </div>

                <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
                        <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                            Come Together to <span className="font-light italic">Make a Difference</span>
                        </h2>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
                        <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed max-w-3xl mx-auto">
                            Join us for an unforgettable evening of hope, community, and impact. Together, we'll celebrate progress and
                            build brighter futures for those who need it most.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 1)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onEnterTickets}
                            className="px-8 py-4 bg-white text-gray-900 rounded-xl font-medium text-lg shadow-xl hover:shadow-2xl transition-all cursor-pointer flex items-center gap-2"
                        >
                            Secure Your Seat
                            <div className="w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm">→</span>
                            </div>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-4 bg-transparent border-2 border-white text-white rounded-xl font-medium text-lg hover:bg-white/10 transition-all cursor-pointer"
                        >
                            Learn More
                        </motion.button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="mt-16 flex flex-wrap justify-center gap-8 text-white/80"
                    >
                        <div className="flex items-center gap-2">
                            <FiCalendar className="w-5 h-5" />
                            <span className="text-lg">June 25, 2025</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FiClock className="w-5 h-5" />
                            <span className="text-lg">7:00 PM - 11:00 PM</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FiMapPin className="w-5 h-5" />
                            <span className="text-lg">Grand Ballroom</span>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.2 }}
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                >
                    <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center">
                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-1 h-2 bg-white/60 rounded-full mt-2"
                        />
                    </div>
                </motion.div>
            </section>

            <section id="mission" className="py-20 bg-[var(--card-bg)]">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h3 className="text-4xl font-bold text-[var(--page-text-primary)] mb-8">Building Brighter Futures</h3>
                        <p className="text-xl text-[var(--page-text-secondary)] leading-relaxed max-w-4xl mx-auto mb-12">
                            Our mission is simple yet profound: to create lasting change in our community through education, healthcare, and
                            opportunity. Every ticket purchased, every donation made, and every moment shared brings us closer to a world
                            where everyone has the chance to thrive.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: FiHeart,
                                title: "Healthcare Access",
                                description: "Providing medical care and wellness programs to underserved communities",
                            },
                            {
                                icon: FiStar,
                                title: "Education Support",
                                description: "Funding scholarships and educational resources for children and families",
                            },
                            {
                                icon: FiUsers,
                                title: "Community Building",
                                description: "Creating programs that bring people together and strengthen our bonds",
                            },
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: index * 0.2 }}
                                className="p-8 bg-[var(--soft-blue)] rounded-2xl"
                            >
                                <div className="w-16 h-16 bg-[var(--primary-blue)] rounded-full flex items-center justify-center mx-auto mb-6">
                                    <item.icon className="w-8 h-8 text-white" />
                                </div>
                                <h4 className="text-xl font-bold text-[var(--page-text-primary)] mb-4">{item.title}</h4>
                                <p className="text-[var(--page-text-secondary)]">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="about" className="py-20 bg-[var(--page-bg)]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h3 className="text-4xl font-bold text-[var(--page-text-primary)] mb-8">About Hope Gala</h3>
                            <div className="space-y-6 text-lg text-[var(--page-text-secondary)] leading-relaxed">
                                <p>
                                    For over a decade, Hope Gala has been more than just an event—it's been a catalyst for transformative
                                    change in our community. What started as a small gathering of passionate individuals has grown into the
                                    region's premier charitable event.
                                </p>
                                <p>
                                    Each year, we bring together business leaders, philanthropists, community advocates, and caring
                                    individuals who share a common vision: creating opportunities for those who need them most. Our elegant
                                    evening combines fine dining, inspiring stories, and meaningful connections.
                                </p>
                                <p>
                                    This year's gala promises to be our most impactful yet, featuring keynote speakers who have experienced
                                    firsthand the power of community support, live entertainment that celebrates our shared humanity, and
                                    opportunities to make a direct difference in someone's life.
                                </p>
                            </div>

                            <div className="mt-12 grid grid-cols-2 gap-8">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-[var(--primary-blue)] mb-2">12+</div>
                                    <div className="text-sm text-[var(--page-text-secondary)]">Years of Impact</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-[var(--primary-blue)] mb-2">500+</div>
                                    <div className="text-sm text-[var(--page-text-secondary)]">Expected Attendees</div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                    alt="Hope Gala Event"
                                    className="w-full h-96 object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="absolute -bottom-6 -left-6 bg-white dark:bg-[var(--card-bg)] p-6 rounded-xl shadow-xl border border-[var(--card-border)]"
                            >
                                <div className="text-2xl font-bold text-[var(--primary-blue)] mb-1">$2.3M</div>
                                <div className="text-sm text-[var(--page-text-secondary)]">Raised Last Year</div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                                className="absolute -top-6 -right-6 bg-white dark:bg-[var(--card-bg)] p-6 rounded-xl shadow-xl border border-[var(--card-border)]"
                            >
                                <div className="text-2xl font-bold text-[var(--success-green)] mb-1">1,200+</div>
                                <div className="text-sm text-[var(--page-text-secondary)]">Lives Changed</div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section id="impact" className="py-20 bg-[var(--soft-blue)]">
                <div className="max-w-6xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h3 className="text-4xl font-bold text-[var(--page-text-primary)] mb-8">Our Impact in Numbers</h3>
                        <p className="text-xl text-[var(--page-text-secondary)] leading-relaxed max-w-3xl mx-auto">
                            Every donation, every ticket, every moment of generosity creates ripples of positive change. Here's how we've
                            been making a difference together.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                        {[
                            {
                                number: "25,000+",
                                label: "Meals Provided",
                                description: "Nutritious meals delivered to families in need",
                                color: "text-[var(--success-green)]",
                            },
                            {
                                number: "350",
                                label: "Scholarships Funded",
                                description: "Educational opportunities for deserving students",
                                color: "text-[var(--primary-blue)]",
                            },
                            {
                                number: "180",
                                label: "Medical Checkups",
                                description: "Free healthcare services in underserved areas",
                                color: "text-[var(--primary-purple)]",
                            },
                            {
                                number: "50+",
                                label: "Community Programs",
                                description: "Ongoing initiatives supporting local families",
                                color: "text-[var(--warning-amber)]",
                            },
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                className="bg-white dark:bg-[var(--card-bg)] p-8 rounded-2xl shadow-lg text-center"
                            >
                                <div className={`text-4xl font-bold mb-2 ${stat.color}`}>{stat.number}</div>
                                <div className="text-lg font-medium text-[var(--page-text-primary)] mb-3">{stat.label}</div>
                                <div className="text-sm text-[var(--page-text-secondary)]">{stat.description}</div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="bg-white dark:bg-[var(--card-bg)] p-8 rounded-2xl shadow-lg"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-[var(--primary-blue)] rounded-full flex items-center justify-center flex-shrink-0">
                                    <FiStar className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-[var(--page-text-primary)] mb-3">Maria's Journey</h4>
                                    <p className="text-[var(--page-text-secondary)] leading-relaxed">
                                        "Thanks to the scholarship program, I was able to complete nursing school. Now I'm giving back to my
                                        community as a healthcare worker, helping others just like Hope Gala helped me."
                                    </p>
                                    <div className="mt-4 text-sm font-medium text-[var(--primary-blue)]">
                                        — Maria Santos, Scholarship Recipient 2019
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="bg-white dark:bg-[var(--card-bg)] p-8 rounded-2xl shadow-lg"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-[var(--success-green)] rounded-full flex items-center justify-center flex-shrink-0">
                                    <FiHeart className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-[var(--page-text-primary)] mb-3">The Johnson Family</h4>
                                    <p className="text-[var(--page-text-secondary)] leading-relaxed">
                                        "When my husband lost his job, we didn't know how we'd feed our three kids. The meal program kept us
                                        going during our hardest months. We're forever grateful."
                                    </p>
                                    <div className="mt-4 text-sm font-medium text-[var(--success-green)]">
                                        — Sarah Johnson, Program Beneficiary
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section id="sponsors" className="py-20" style={{ background: "var(--sponsors-bg)" }}>
                <div className="max-w-6xl mx-auto px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h3 className="text-4xl font-bold mb-4 tracking-tight" style={{ color: "var(--sponsors-title)" }}>
                            Our Valued Partners
                        </h3>
                        <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--sponsors-subtitle)" }}>
                            Trusted organizations supporting our mission to create positive change in the community
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="mb-16"
                    >
                        <div className="flex items-center justify-center mb-10">
                            <div
                                className="flex items-center gap-3 px-6 py-3 rounded-full border"
                                style={{
                                    background: "var(--sponsors-badge-bg)",
                                    borderColor: "var(--sponsors-badge-border)",
                                    boxShadow: "var(--sponsors-card-shadow)",
                                }}
                            >
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--sponsors-dot-purple)" }}></div>
                                <span className="text-sm font-semibold tracking-wide" style={{ color: "var(--sponsors-badge-text)" }}>
                                    PLATINUM PARTNERS
                                </span>
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--sponsors-dot-purple)" }}></div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {[
                                {
                                    name: "Tech Innovations Corp",
                                    logo: <FiHome className="w-8 h-8 text-blue-600" />,
                                    description:
                                        "Leading technology solutions provider committed to digital equity and community development.",
                                    contribution: "$50,000 Annual Support",
                                },
                                {
                                    name: "Metro Health System",
                                    logo: <FiActivity className="w-8 h-8 text-purple-600" />,
                                    description:
                                        "Comprehensive healthcare services ensuring accessible medical care for all community members.",
                                    contribution: "Free Medical Services",
                                },
                            ].map((sponsor, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    className="p-8 rounded-2xl border transition-shadow duration-300 cursor-pointer"
                                    style={{
                                        background: "var(--sponsors-card-bg)",
                                        borderColor: "var(--sponsors-card-border)",
                                        boxShadow: "var(--sponsors-card-shadow)",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.boxShadow = "var(--sponsors-card-shadow-hover)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.boxShadow = "var(--sponsors-card-shadow)";
                                    }}
                                >
                                    <div className="flex items-start gap-6">
                                        <div
                                            className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                                            style={{
                                                background: "var(--sponsors-icon-bg)",
                                                boxShadow: "var(--sponsors-icon-shadow)",
                                            }}
                                        >
                                            {sponsor.logo}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-xl font-bold mb-3" style={{ color: "var(--sponsors-title)" }}>
                                                {sponsor.name}
                                            </h4>
                                            <p className="leading-relaxed mb-4" style={{ color: "var(--sponsors-subtitle)" }}>
                                                {sponsor.description}
                                            </p>
                                            <div
                                                className="inline-flex items-center px-4 py-2 rounded-lg"
                                                style={{
                                                    background: "var(--sponsors-contribution-bg)",
                                                    boxShadow: "var(--sponsors-icon-shadow)",
                                                }}
                                            >
                                                <span
                                                    className="text-sm font-medium"
                                                    style={{ color: "var(--sponsors-contribution-text)" }}
                                                >
                                                    {sponsor.contribution}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mb-16"
                    >
                        <div className="flex items-center justify-center mb-10">
                            <div
                                className="flex items-center gap-3 px-6 py-3 rounded-full border"
                                style={{
                                    background: "var(--sponsors-badge-bg)",
                                    borderColor: "var(--sponsors-badge-border)",
                                    boxShadow: "var(--sponsors-card-shadow)",
                                }}
                            >
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--sponsors-dot-blue)" }}></div>
                                <span className="text-sm font-semibold tracking-wide" style={{ color: "var(--sponsors-badge-text)" }}>
                                    GOLD SUPPORTERS
                                </span>
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--sponsors-dot-blue)" }}></div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                {
                                    name: "Community First Bank",
                                    logo: <FiDollarSign className="w-6 h-6 text-blue-600" />,
                                    specialty: "Financial Services",
                                },
                                {
                                    name: "Green Valley Foods",
                                    logo: <FiTrendingUp className="w-6 h-6 text-green-600" />,
                                    specialty: "Sustainable Agriculture",
                                },
                                {
                                    name: "Sunrise Real Estate",
                                    logo: <FiHome className="w-6 h-6 text-purple-600" />,
                                    specialty: "Community Development",
                                },
                            ].map((sponsor, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    className="p-6 rounded-xl border text-center transition-shadow duration-300 cursor-pointer"
                                    style={{
                                        background: "var(--sponsors-card-bg)",
                                        borderColor: "var(--sponsors-card-border)",
                                        boxShadow: "var(--sponsors-card-shadow)",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.boxShadow = "var(--sponsors-card-shadow-hover)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.boxShadow = "var(--sponsors-card-shadow)";
                                    }}
                                >
                                    <div
                                        className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4"
                                        style={{
                                            background: "var(--sponsors-icon-bg)",
                                            boxShadow: "var(--sponsors-icon-shadow)",
                                        }}
                                    >
                                        {sponsor.logo}
                                    </div>
                                    <h5 className="text-lg font-bold mb-2" style={{ color: "var(--sponsors-title)" }}>
                                        {sponsor.name}
                                    </h5>
                                    <p className="text-sm" style={{ color: "var(--sponsors-subtitle)" }}>
                                        {sponsor.specialty}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <div className="flex items-center justify-center mb-10">
                            <div
                                className="flex items-center gap-3 px-6 py-3 rounded-full border"
                                style={{
                                    background: "var(--sponsors-badge-bg)",
                                    borderColor: "var(--sponsors-badge-border)",
                                    boxShadow: "var(--sponsors-card-shadow)",
                                }}
                            >
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--sponsors-dot-purple)" }}></div>
                                <span className="text-sm font-semibold tracking-wide" style={{ color: "var(--sponsors-badge-text)" }}>
                                    COMMUNITY CONTRIBUTORS
                                </span>
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--sponsors-dot-purple)" }}></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
                            {[
                                { name: "Local Café", logo: <FiCoffee className="w-5 h-5 text-amber-600" /> },
                                { name: "Fitness Plus", logo: <FiZap className="w-5 h-5 text-green-600" /> },
                                { name: "Art Studio", logo: <FiImage className="w-5 h-5 text-purple-600" /> },
                                { name: "Book Corner", logo: <FiBook className="w-5 h-5 text-blue-600" /> },
                                { name: "Flower Shop", logo: <FiHeart className="w-5 h-5 text-pink-600" /> },
                                { name: "Music Academy", logo: <FiMusic className="w-5 h-5 text-indigo-600" /> },
                            ].map((sponsor, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                    className="p-5 rounded-xl border text-center transition-all duration-300 cursor-pointer"
                                    style={{
                                        background: "var(--sponsors-card-bg)",
                                        borderColor: "var(--sponsors-card-border)",
                                        boxShadow: "var(--sponsors-card-shadow)",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.boxShadow = "var(--sponsors-card-shadow-hover)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.boxShadow = "var(--sponsors-card-shadow)";
                                    }}
                                >
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3"
                                        style={{
                                            background: "var(--sponsors-icon-bg)",
                                            boxShadow: "var(--sponsors-icon-shadow)",
                                        }}
                                    >
                                        {sponsor.logo}
                                    </div>
                                    <h6 className="text-sm font-semibold" style={{ color: "var(--sponsors-badge-text)" }}>
                                        {sponsor.name}
                                    </h6>
                                </motion.div>
                            ))}
                        </div>

                        <div className="text-center">
                            <div
                                className="p-6 rounded-xl border max-w-2xl mx-auto"
                                style={{
                                    background: "var(--sponsors-description-bg)",
                                    borderColor: "var(--sponsors-card-border)",
                                    boxShadow: "var(--sponsors-card-shadow)",
                                }}
                            >
                                <p className="leading-relaxed" style={{ color: "var(--sponsors-subtitle)" }}>
                                    These local businesses are the backbone of our community, providing essential services and unwavering
                                    support for our mission to create positive change.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="py-20 bg-gradient-to-r from-[var(--primary-blue)] to-[var(--primary-purple)]">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h3 className="text-4xl font-bold text-white mb-6">Ready to Make a Difference?</h3>
                        <p className="text-xl text-white/90 mb-8">
                            Join hundreds of changemakers for an evening that will inspire, connect, and create lasting impact.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onEnterTickets}
                            className="px-12 py-4 bg-white text-[var(--primary-blue)] rounded-xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all cursor-pointer"
                        >
                            Get Your Tickets Now
                        </motion.button>
                    </motion.div>
                </div>
            </section>

            <footer className="bg-[#1e293b] text-white">
                <div className="max-w-7xl mx-auto px-6 py-16">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="lg:col-span-2"
                        >
                            <h3 className="text-3xl font-bold mb-6">
                                Hope <span className="font-light">Gala</span>
                            </h3>
                            <p className="text-white/80 leading-relaxed mb-8 max-w-lg">
                                Building brighter futures together through community, compassion, and collective action. Join us in creating
                                lasting change that transforms lives and strengthens our community bonds.
                            </p>

                            <div className="mb-8">
                                <h4 className="font-semibold mb-4">Stay Connected</h4>
                                <div className="flex gap-3">
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:border-white/40 focus:bg-white/15"
                                    />
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-6 py-3 bg-white text-[#1e293b] rounded-xl font-medium hover:bg-white/90 transition-all cursor-pointer"
                                    >
                                        Subscribe
                                    </motion.button>
                                </div>
                                <p className="text-xs text-white/60 mt-2">Get updates on our programs, events, and impact stories.</p>
                            </div>

                            <div>
                                <h4 className="font-semibold mb-4">Follow Us</h4>
                                <div className="flex gap-4">
                                    {[
                                        {
                                            icon: <FaFacebook className="w-5 h-5" />,
                                            name: "Facebook",
                                            handle: "@HopeGala",
                                            url: "https://facebook.com/HopeGala",
                                        },
                                        {
                                            icon: <FaInstagram className="w-5 h-5" />,
                                            name: "Instagram",
                                            handle: "@HopeGala2025",
                                            url: "https://instagram.com/HopeGala2025",
                                        },
                                        {
                                            icon: <FaTwitter className="w-5 h-5" />,
                                            name: "Twitter",
                                            handle: "@HopeGala",
                                            url: "https://twitter.com/HopeGala",
                                        },
                                        {
                                            icon: <FaLinkedin className="w-5 h-5" />,
                                            name: "LinkedIn",
                                            handle: "Hope Gala Foundation",
                                            url: "https://linkedin.com/company/hope-gala-foundation",
                                        },
                                    ].map((social, index) => (
                                        <motion.a
                                            key={index}
                                            whileHover={{ scale: 1.1, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer group"
                                            title={`Follow us on ${social.name}: ${social.handle}`}
                                        >
                                            <span className="group-hover:scale-110 transition-transform">{social.icon}</span>
                                        </motion.a>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                        >
                            <h4 className="font-semibold mb-6">Quick Links</h4>
                            <div className="space-y-3">
                                {[
                                    { label: "About Hope Gala", href: "#about" },
                                    { label: "Our Impact", href: "#impact" },
                                    { label: "Our Partners", href: "#sponsors" },
                                    { label: "Get Tickets", action: () => onEnterTickets() },
                                    { label: "Volunteer", href: "#volunteer" },
                                    { label: "Donate", href: "#donate" },
                                ].map((link, index) => (
                                    <motion.div key={index} whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                                        {link.action ? (
                                            <button
                                                onClick={link.action}
                                                className="text-white/80 hover:text-white transition-colors cursor-pointer"
                                            >
                                                {link.label}
                                            </button>
                                        ) : (
                                            <a href={link.href} className="text-white/80 hover:text-white transition-colors cursor-pointer">
                                                {link.label}
                                            </a>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <h4 className="font-semibold mb-6">Contact Info</h4>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 flex items-center justify-center mt-0.5">
                                        <FiMapPin className="w-5 h-5 text-white/60" />
                                    </div>
                                    <div>
                                        <p className="text-white/80">
                                            123 Community Drive
                                            <br />
                                            Hope City, HC 12345
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 flex items-center justify-center">
                                        <FiPhone className="w-5 h-5 text-white/60" />
                                    </div>
                                    <a href="tel:+15551234567" className="text-white/80 hover:text-white transition-colors cursor-pointer">
                                        (555) 123-4567
                                    </a>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 flex items-center justify-center">
                                        <FiMail className="w-5 h-5 text-white/60" />
                                    </div>
                                    <a
                                        href="mailto:info@hopegala.org"
                                        className="text-white/80 hover:text-white transition-colors cursor-pointer"
                                    >
                                        info@hopegala.org
                                    </a>
                                </div>

                                <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
                                    <h5 className="font-medium mb-2">Event Details</h5>
                                    <div className="text-sm text-white/80 space-y-1">
                                        <p className="flex items-center gap-2">
                                            <FiCalendar className="w-4 h-4" /> June 25, 2025
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <FiClock className="w-4 h-4" /> 7:00 PM - 11:00 PM
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <FiMapPin className="w-4 h-4" /> Grand Ballroom
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="border-t border-white/10">
                    <div className="max-w-7xl mx-auto px-6 py-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="flex flex-col md:flex-row justify-between items-center gap-4"
                        >
                            <div className="text-white/60 text-sm">
                                © 2024 Hope Gala Foundation. All rights reserved. | 501(c)(3) Non-Profit Organization
                            </div>

                            <div className="flex items-center gap-6 text-sm">
                                <a href="#privacy" className="text-white/60 hover:text-white transition-colors cursor-pointer">
                                    Privacy Policy
                                </a>
                                <a href="#terms" className="text-white/60 hover:text-white transition-colors cursor-pointer">
                                    Terms of Service
                                </a>
                                <a href="#accessibility" className="text-white/60 hover:text-white transition-colors cursor-pointer">
                                    Accessibility
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const CharityGalaApp = () => {
    const [showLanding, setShowLanding] = useState(true);
    const [activeTab, setActiveTab] = useState("tickets");
    const [purchasedTickets, setPurchasedTickets] = useState<Guest[]>([]);
    const [selectedSponsor, setSelectedSponsor] = useState<Sponsor>(sponsors[0]);

    const enterTicketSystem = () => {
        setShowLanding(false);
    };

    const returnToLanding = () => {
        setShowLanding(true);
    };

    const addPurchasedTicket = (ticketData: Guest) => {
        setPurchasedTickets((prev) => [...prev, ticketData]);
    };

    const handleSponsorSelection = (sponsor: Sponsor) => {
        setSelectedSponsor(sponsor);
    };

    useEffect(() => {
        const handleSwitchToDownloads = () => {
            setActiveTab("downloads");
        };

        window.addEventListener("switchToDownloads", handleSwitchToDownloads);

        return () => {
            window.removeEventListener("switchToDownloads", handleSwitchToDownloads);
        };
    }, []);

    if (showLanding) {
        return <LandingPage onEnterTickets={enterTicketSystem} />;
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case "tickets":
                return <TicketsTab onTicketPurchased={addPurchasedTicket} />;
            case "guests":
                return <GuestsTab />;
            case "sponsors":
                return <SponsorsTab selectedSponsor={selectedSponsor} onSponsorSelect={handleSponsorSelection} />;
            case "downloads":
                return <DownloadsTab purchasedTickets={purchasedTickets} selectedSponsor={selectedSponsor} />;
            default:
                return <TicketsTab onTicketPurchased={addPurchasedTicket} />;
        }
    };

    return (
        <div className="min-h-screen bg-[var(--page-bg)] pb-safe">
            <div className="max-w-md lg:max-w-none mx-auto lg:container lg:mx-auto lg:px-6 xl:px-8">
                <header className="p-6 lg:py-8 lg:px-0 border-b border-[var(--card-border)]">
                    <div className="flex justify-between items-center mb-4 lg:mb-6">
                        <div className="flex items-center gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={returnToLanding}
                                className="p-2 lg:p-3 rounded-full bg-[var(--card-bg)] border border-[var(--card-border)] shadow-[var(--shadow-soft)] cursor-pointer hover:bg-[var(--soft-blue)] transition-colors"
                            >
                                <div className="w-5 h-5 lg:w-6 lg:h-6 flex items-center justify-center">
                                    <span className="text-[var(--page-text-primary)] text-lg lg:text-xl">←</span>
                                </div>
                            </motion.button>
                            <div>
                                <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold gradient-text">Hope Gala</h1>
                                <p className="text-[var(--page-text-secondary)] text-sm lg:text-base xl:text-lg">
                                    Building brighter futures together
                                </p>
                            </div>
                        </div>
                        <ThemeToggle />
                    </div>
                    <div className="lg:max-w-md lg:mx-auto xl:max-w-lg">
                        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
                    </div>
                </header>

                <main className="p-6 lg:py-12 lg:px-0">
                    <div className="lg:max-w-6xl lg:mx-auto xl:max-w-7xl">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                {renderTabContent()}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </div>
    );
};

const Home = () => {
    return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <GlobalThemeStyles />
            <CharityGalaApp />
        </ThemeProvider>
    );
};

export default Home;
