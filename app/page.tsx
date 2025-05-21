"use client";

import { ThemeProvider, useTheme } from "next-themes";
import {
    Sun,
    Moon,
    Search as SearchIcon,
    Bell,
    UserCircle2,
    Briefcase,
    ShoppingBag,
    Film,
    Heart,
    CreditCard,
    ArrowRight,
    Plus,
    Wifi,
    Apple as AppleIcon,
    TrendingUp,
    DollarSign,
    ShoppingCart,
    Tv,
    HelpCircle,
    Smartphone,
    HeartPulse,
    Laptop as LaptopIcon,
    Shirt,
    Plane,
    MoreHorizontal,
    ChevronDown,
    Settings,
    LogOut,
    User,
    AlertCircle,
    CheckCircle,
    Gift,
    Bitcoin,
    Twitter,
    Facebook,
    Instagram,
    Linkedin,
    LifeBuoy,
    FileText,
    ShieldCheck,
    X as XIcon,
    Home,
    Car,
    GraduationCap,
    PiggyBank,
    Edit3,
    Trash2,
} from "lucide-react";
import { FaCcVisa, FaCcMastercard, FaApple, FaAmazon, FaGoogle, FaPaypal, FaMicrosoft } from "react-icons/fa";
import { SiNike, SiTesla, SiNetflix, SiCocacola, SiSpotify, SiAdobe } from "react-icons/si";
import React, { useState, SetStateAction, Dispatch, useEffect, useRef, useContext, createContext } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const GlobalThemeStyles = () => (
    <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Finlandica:wght@400;500;600;700&display=swap");

        :root {
            /* Light Theme Variables */
            --page-bg: #f0f2f5;
            --page-text-primary: #18181b;
            --page-text-secondary: #52525b;
            --card-bg: transparent;
            --card-border-color: #e4e4e7;
            --dropdown-bg: #ffffff;
            --dropdown-border-color: #e4e4e7;
            --card-text-primary: #18181b;
            --card-text-secondary: #71717a;
            --card-alt-text: #ffffff;
            --border-color-primary: #e4e4e7;
            --progress-track: #e5e7eb;
            --progress-fill: #3b82f6;
            --accent-primary: #3b82f6;
            --accent-secondary: #10b981;
            --accent-negative: #ef4444;
            --accent-positive: #10b981;
            --brand-text-color: #18181b;
            --icon-color: #52525b;
            --icon-hover-color: #18181b;
            --icon-bg-accent: #e0f2fe;
            --input-bg: #e4e4e7;
            --input-text: #18181b;
            --input-placeholder: #a1a1aa;
            --button-primary-bg: #d6e7df;
            --button-primary-text: #18181b;
            --button-secondary-bg: #e4e4e7;
            --button-secondary-text: #18181b;
            --button-tertiary-bg: #d1d5db;
            --button-tertiary-text: #1f2937;
            --link-text: #3b82f6;
            --link-hover-text: #2563eb;
            --scrollbar-thumb: #cbd5e1;
            --scrollbar-track: #e2e8f0;
            --font-heading: "Finlandica", sans-serif;
            --font-body: "Finlandica", sans-serif;
            --chart-tooltip-bg: #ffffff;
            --chart-tooltip-text: #18181b;
            --avatar-bg: #d1d5db;
            --icon-specific-bg: #ffffff;
            --icon-specific-color: #18181b;
        }

        html.dark {
            /* Dark Theme Variable Overrides */
            --page-bg: #0a0a0a;
            --page-text-primary: #e4e4e7;
            --page-text-secondary: #a1a1aa;
            --card-bg: transparent;
            --card-border-color: #3f3f46;
            --dropdown-bg: #1f2937;
            --dropdown-border-color: #3f3f46;
            --card-text-primary: #f4f4f5;
            --card-text-secondary: #a1a1aa;
            --card-alt-text: #ffffff;
            --border-color-primary: #3f3f46;
            --progress-track: #374151;
            --progress-fill: #60a5fa;
            --accent-primary: #60a5fa;
            --accent-secondary: #34d399;
            --accent-negative: #f87171;
            --accent-positive: #34d399;
            --brand-text-color: #ffffff;
            --icon-color: #a1a1aa;
            --icon-hover-color: #e4e4e7;
            --icon-bg-accent: #1e293b;
            --input-bg: #27272a;
            --input-text: #f4f4f5;
            --input-placeholder: #71717a;
            --button-primary-bg: #d6e7df;
            --button-primary-text: #18181b;
            --button-secondary-bg: #3f3f46;
            --button-secondary-text: #f4f4f5;
            --button-tertiary-bg: #4b5563;
            --button-tertiary-text: #e5e7eb;
            --link-text: #60a5fa;
            --link-hover-text: #93c5fd;
            --scrollbar-thumb: #3f3f46;
            --scrollbar-track: #18181b;
            --chart-tooltip-bg: #27272a;
            --chart-tooltip-text: #f4f4f5;
            --avatar-bg: #374151;
        }

        body {
            background-color: var(--page-bg);
            color: var(--page-text-primary);
            font-family: var(--font-body);
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }

        ::-webkit-scrollbar-track {
            background: var(--scrollbar-track);
        }

        ::-webkit-scrollbar-thumb {
            background-color: var(--scrollbar-thumb);
            border-radius: 10px;
            border: 2px solid var(--scrollbar-track);
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
    `}</style>
);

const ThemeToggleButton = () => {
    const { theme, setTheme } = useTheme();
    const initiateThemeSwitch = () => setTheme(theme === "light" ? "dark" : "light");
    if (!theme) return null;
    return (
        <button
            onClick={initiateThemeSwitch}
            className="p-2 rounded-full cursor-pointer bg-[var(--input-bg)] text-[var(--icon-color)] hover:text-[var(--icon-hover-color)] transition-colors"
        >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>
    );
};

type Transaction = {
    id: string;
    icon: React.ElementType;
    iconBgColor?: string;
    name: string;
    date: string;
    amount: number;
    cardLastFour: string;
};
const mockTransactions: Transaction[] = [
    {
        id: "1",
        icon: Briefcase,
        iconBgColor: "bg-green-500/10",
        name: "Starbucks Coffee",
        date: "Apr 24, 5:27 PM",
        amount: -14.99,
        cardLastFour: "4568",
    },
    {
        id: "2",
        icon: ShoppingBag,
        iconBgColor: "bg-pink-500/10",
        name: "DIOR",
        date: "Apr 06, 05:12 PM",
        amount: -268.0,
        cardLastFour: "4568",
    },
    {
        id: "3",
        icon: CreditCard,
        iconBgColor: "bg-yellow-500/10",
        name: "DKNY",
        date: "Apr 20, 2:14 PM",
        amount: -40.0,
        cardLastFour: "4568",
    },
    {
        id: "4",
        icon: SiNetflix,
        iconBgColor: "bg-red-600/10 text-red-500",
        name: "Netflix",
        date: "Apr 12, 07:25 PM",
        amount: -70.0,
        cardLastFour: "4568",
    },
];
const TransactionItem = ({ transaction }: { transaction: Transaction }) => {
    const { icon: Icon, name, date, amount, cardLastFour, iconBgColor } = transaction;
    const iconContainerClasses = `p-2 rounded-full bg-[var(--icon-specific-bg)]`;
    const iconClasses = `text-[var(--icon-specific-color)]`;

    const amountPresentation = amount < 0 ? "text-[var(--accent-negative)]" : "text-[var(--accent-positive)]";
    return (
        <li className="flex items-center justify-between py-3 px-1 hover:bg-[var(--page-bg)] rounded-md transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
                <div className={iconContainerClasses}>
                    <Icon size={20} className={iconClasses} />
                </div>
                <div>
                    <p className="text-sm font-medium text-[var(--card-text-primary)]">{name}</p>
                    <p className="text-xs text-[var(--card-text-secondary)]">{date}</p>
                </div>
            </div>
            <div className="text-right">
                <p className={`text-sm font-semibold ${amountPresentation}`}>
                    {amount < 0 ? "-" : ""}${Math.abs(amount).toLocaleString("en-US", { style: "currency", currency: "USD" })}
                </p>
                <p className="text-xs text-[var(--card-text-secondary)]">•••• {cardLastFour}</p>
            </div>
        </li>
    );
};
const RecentTransactions = ({ transactions, onViewAllClick }: { transactions: Transaction[]; onViewAllClick: () => void }) => (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border-color)] p-4 md:p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[var(--card-text-primary)]">Recent transactions</h2>
            <button
                onClick={onViewAllClick}
                className="text-sm text-[var(--link-text)] hover:text-[var(--link-hover-text)] font-medium flex items-center gap-1 cursor-pointer"
            >
                View all <ArrowRight size={14} />
            </button>
        </div>
        <ul>
            {transactions.slice(0, 4).map((tx) => (
                <TransactionItem key={tx.id} transaction={tx} />
            ))}
        </ul>
    </div>
);

type DebitCardDetails = {
    id: string;
    balance: number;
    lastFour: string;
    network: "visa" | "mastercard";
    gradientClass: string;
    cardHolder?: string;
    expiryDate?: string;
};
const totalBalance = 10524.15;
const mockDebitCards: DebitCardDetails[] = [
    {
        id: "card1",
        balance: 4556.15,
        lastFour: "4568",
        network: "mastercard",
        gradientClass: "bg-gradient-to-br from-teal-400 to-green-500",
        cardHolder: "Kelu Sotonox",
        expiryDate: "12/27",
    },
    {
        id: "card2",
        balance: 5968.0,
        lastFour: "0958",
        network: "visa",
        gradientClass: "bg-gradient-to-br from-blue-500 to-indigo-600",
        cardHolder: "Kelu Sotonox",
        expiryDate: "08/25",
    },
];

type SelectableGradient = {
    name: string;
    className: string;
};

const selectableCardGradients: SelectableGradient[] = [
    { name: "Teal to Green", className: "bg-gradient-to-br from-teal-400 to-green-500" },
    { name: "Blue to Indigo", className: "bg-gradient-to-br from-blue-500 to-indigo-600" },
    { name: "Pink to Purple", className: "bg-gradient-to-br from-pink-500 to-purple-600" },
    { name: "Orange to Red", className: "bg-gradient-to-br from-orange-400 to-red-500" },
    { name: "Yellow to Lime", className: "bg-gradient-to-br from-yellow-400 to-lime-500" },
    { name: "Cyan to Sky", className: "bg-gradient-to-br from-cyan-400 to-sky-500" },
];

const DebitCardItem = ({ card }: { card: DebitCardDetails }) => (
    <div
        className={`p-5 rounded-xl text-[var(--card-alt-text)] w-full aspect-[1.586] flex flex-col justify-between shadow-lg ${card.gradientClass}`}
    >
        <div className="flex justify-between items-start">
            <span className="text-lg font-semibold">
                ${card.balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <Wifi size={24} className="opacity-80" />
        </div>
        <div>
            <p className="text-xs opacity-80 mb-1">Debit Card</p>
            <div className="flex justify-between items-end">
                <p className="text-sm font-medium tracking-wider">•••• {card.lastFour}</p>
                {card.network === "visa" && <FaCcVisa size={36} />}
                {card.network === "mastercard" && <FaCcMastercard size={36} />}
            </div>
        </div>
    </div>
);

const BalanceDisplay = ({ debitCards, onAddNewCardClick }: { debitCards: DebitCardDetails[]; onAddNewCardClick: () => void }) => (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border-color)] p-4 md:p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
            <div>
                <h2 className="text-lg font-semibold text-[var(--card-text-primary)] mb-1">Balance</h2>
                <p className="text-3xl font-bold text-[var(--card-text-primary)]">
                    ${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
            </div>
            <button
                onClick={onAddNewCardClick}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] hover:opacity-90 transition-opacity cursor-pointer text-sm font-medium"
            >
                <Plus size={18} /> Add new card
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {debitCards.map((card) => (
                <DebitCardItem key={card.id} card={card} />
            ))}
        </div>
    </div>
);

type InvestmentItemData = {
    id: string;
    IconComponent: React.ElementType;
    iconBgClass?: string;
    name: string;
    value: number;
    change: number;
};

const mockInvestments: InvestmentItemData[] = [
    { id: "inv1", IconComponent: FaApple, name: "Apple", value: 129.89, change: 3.5 },
    { id: "inv2", IconComponent: SiTesla, name: "Tesla", value: 210.93, change: -1.2 },
    { id: "inv3", IconComponent: SiNike, name: "Nike", value: 124.43, change: 2.8 },
    { id: "inv4", IconComponent: SiNetflix, name: "Netflix", value: 909.05, change: 1.2 },
    { id: "inv5", IconComponent: FaAmazon, name: "Amazon", value: 185.87, change: -2.6 },
    { id: "inv6", IconComponent: SiCocacola, name: "Coca-Cola", value: 327.25, change: 1.8 },
];

const InvestmentItem = ({ item }: { item: InvestmentItemData }) => {
    const changeColor = item.change >= 0 ? "text-[var(--accent-positive)]" : "text-[var(--accent-negative)]";
    const iconContainerClasses = `p-2.5 rounded-full bg-[var(--icon-specific-bg)]`;
    const iconColorClass = `text-[var(--icon-specific-color)]`;

    return (
        <li className="flex items-center justify-between py-3 px-1 hover:bg-[var(--page-bg)] rounded-md transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
                <div className={iconContainerClasses}>
                    <item.IconComponent size={22} className={iconColorClass} />
                </div>
                <p className="text-sm font-medium text-[var(--card-text-primary)]">{item.name}</p>
            </div>
            <div className="text-right">
                <p className="text-sm font-semibold text-[var(--card-text-primary)]">
                    ${item.value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className={`text-xs font-medium ${changeColor}`}>{item.change.toFixed(1)}%</p>
            </div>
        </li>
    );
};

const MyInvestments = ({ investments, onViewAllClick }: { investments: InvestmentItemData[]; onViewAllClick: () => void }) => (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border-color)] p-4 md:p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[var(--card-text-primary)]">My investments</h2>
            <button
                onClick={onViewAllClick}
                className="text-sm text-[var(--link-text)] hover:text-[var(--link-hover-text)] font-medium flex items-center gap-1 cursor-pointer"
            >
                View all <ArrowRight size={14} />
            </button>
        </div>
        <ul>
            {investments.slice(0, 5).map((item) => (
                <InvestmentItem key={item.id} item={item} />
            ))}
        </ul>
    </div>
);

type GoalItemData = {
    id: string;
    IconComponent: React.ElementType;
    name: string;
    currentAmount: number;
    targetAmount: number;
};

const mockGoals: GoalItemData[] = [
    { id: "goal1", IconComponent: Smartphone, name: "New iPhone", currentAmount: 500, targetAmount: 1099 },
    { id: "goal2", IconComponent: HeartPulse, name: "Health checkup", currentAmount: 1500, targetAmount: 2000 },
    { id: "goal3", IconComponent: LaptopIcon, name: "Laptop", currentAmount: 100, targetAmount: 1800 },
    { id: "goal4", IconComponent: Shirt, name: "New clothes", currentAmount: 400, targetAmount: 2400 },
    { id: "goal5", IconComponent: Plane, name: "Traveling", currentAmount: 0, targetAmount: 10000 },
];

type SelectableGoalIcon = {
    name: string;
    IconComponent: React.ElementType;
};

const selectableGoalIconsList: SelectableGoalIcon[] = [
    { name: "Smartphone", IconComponent: Smartphone },
    { name: "Health", IconComponent: HeartPulse },
    { name: "Laptop", IconComponent: LaptopIcon },
    { name: "Clothes", IconComponent: Shirt },
    { name: "Travel", IconComponent: Plane },
    { name: "Home", IconComponent: Home },
    { name: "Car", IconComponent: Car },
    { name: "Education", IconComponent: GraduationCap },
    { name: "Savings", IconComponent: PiggyBank },
    { name: "Gift", IconComponent: Gift },
    { name: "Other", IconComponent: HelpCircle },
];

const GoalItem = ({ item }: { item: GoalItemData }) => {
    const progressPercentage = Math.min((item.currentAmount / item.targetAmount) * 100, 100);
    return (
        <li className="flex items-center justify-between py-3.5 px-1 hover:bg-[var(--page-bg)] rounded-md transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-full bg-[var(--icon-specific-bg)]">
                    <item.IconComponent size={20} className="text-[var(--icon-specific-color)]" />
                </div>
                <div>
                    <p className="text-sm font-medium text-[var(--card-text-primary)]">{item.name}</p>
                    <p className="text-xs text-[var(--card-text-secondary)]">
                        ${item.currentAmount.toLocaleString()} of ${item.targetAmount.toLocaleString()}
                    </p>
                </div>
            </div>

            <div className="w-10 h-10 rounded-full bg-[var(--progress-track)] flex items-center justify-center relative overflow-hidden">
                <div
                    className="absolute top-0 left-0 w-full h-full bg-[var(--progress-fill)] origin-bottom"
                    style={{ transform: `translateY(${100 - progressPercentage}%)` }}
                ></div>

                <span className="relative text-xs font-medium text-[var(--card-text-primary)] mix-blend-difference">
                    {progressPercentage.toFixed(0)}%
                </span>
            </div>
        </li>
    );
};

const MyGoals = ({
    goals,
    onAddNewGoalClick,
    onViewAllClick,
}: {
    goals: GoalItemData[];
    onAddNewGoalClick: () => void;
    onViewAllClick: () => void;
}) => (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border-color)] p-4 md:p-6 rounded-xl shadow-lg flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[var(--card-text-primary)]">My goals</h2>
            <button
                onClick={onViewAllClick}
                className="text-sm text-[var(--link-text)] hover:text-[var(--link-hover-text)] font-medium flex items-center gap-1 cursor-pointer"
            >
                View all <ArrowRight size={14} />
            </button>
        </div>
        <ul className="flex-grow space-y-1 overflow-y-auto" style={{ maxHeight: "calc(100% - 100px)" }}>
            {goals.slice(0, 3).map((item) => (
                <GoalItem key={item.id} item={item} />
            ))}
        </ul>
        <button
            onClick={onAddNewGoalClick}
            className="mt-auto w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] hover:opacity-90 transition-opacity cursor-pointer text-sm font-medium"
        >
            <Plus size={18} /> Add new goal
        </button>
    </div>
);

type ChartDataItem = { name: string; value: number; color: string };

const totalIncomeValue = 3762.11;
const totalIncomePeriod = "Apr 2025";
const totalIncomeData: ChartDataItem[] = [
    { name: "Primary", value: 2800, color: "#FFB37C" },
    { name: "Secondary", value: 962.11, color: "#9D9BFF" },
];

const totalCashbackValue = 568.24;
const cashbackPeriod = "Apr 2025";
const cashbackData: ChartDataItem[] = [
    { name: "Clothes", value: 6.46, color: "#A0E7E5" },
    { name: "Electronics", value: 150.0, color: "#FFD778" },
    { name: "Groceries", value: 200.5, color: "#C7E6A0" },
    { name: "Travel", value: 111.28, color: "#D9A7F7" },
    { name: "Other", value: 100.0, color: "#FFB7C5" },
];

const totalSpendingValue = 7683.21;
const spendingPeriod = "Spending in April";
const spendingData: ChartDataItem[] = [
    { name: "Transport", value: 1200, color: "#FFD778" },
    { name: "Food", value: 2100, color: "#C7E6A0" },
    { name: "Travel", value: 850, color: "#D9A7F7" },
    { name: "Health", value: 500, color: "#FFB7C5" },
    { name: "Clothes", value: 750, color: "#A0E7E5" },
    { name: "Salary", value: 1500, color: "#FFA07A" },
    { name: "Investments", value: 783.21, color: "#9D9BFF" },
];

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-2.5 rounded-md shadow-lg bg-[var(--chart-tooltip-bg)] border border-[var(--border-color-primary)]">
                <p className="text-sm font-medium text-[var(--chart-tooltip-text)]">{`${payload[0].name}: $${payload[0].value.toFixed(
                    2
                )}`}</p>
            </div>
        );
    }
    return null;
};

const TinyDonutChart = ({
    title,
    period,
    totalValue,
    data,
    chartHeight = 120,
}: {
    title: string;
    period: string;
    totalValue: number;
    data: ChartDataItem[];
    chartHeight?: number;
}) => (
    <div className="p-4 rounded-xl">
        <h3 className="text-md font-semibold text-[var(--card-text-primary)] mb-0.5">{title}</h3>
        <p className="text-xs text-[var(--card-text-secondary)] mb-1">{period}</p>
        <ResponsiveContainer width="100%" height={chartHeight}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="80%"
                    paddingAngle={data.length > 1 ? 2 : 0}
                    stroke="none"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
            </PieChart>
        </ResponsiveContainer>
        <p className="text-xl font-bold text-[var(--card-text-primary)] mt-2 text-center">
            ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
    </div>
);

const CashbackDonutChart = () => {
    const [activeCashbackIndex, setActiveCashbackIndex] = useState(0);

    return (
        <div className="p-4 rounded-xl relative">
            <h3 className="text-md font-semibold text-[var(--card-text-primary)] mb-0.5">Cashback</h3>
            <p className="text-xs text-[var(--card-text-secondary)] mb-1">{cashbackPeriod}</p>
            <ResponsiveContainer width="100%" height={120}>
                <PieChart>
                    <Pie
                        data={cashbackData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius="60%"
                        outerRadius="80%"
                        paddingAngle={2}
                        stroke="none"
                        activeIndex={activeCashbackIndex}
                        onMouseEnter={(_, index) => setActiveCashbackIndex(index)}
                    >
                        {cashbackData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.color}
                                className={index === activeCashbackIndex ? "opacity-100" : "opacity-70"}
                            />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                </PieChart>
            </ResponsiveContainer>
            <p className="text-xl font-bold text-[var(--card-text-primary)] mt-2 text-center">
                ${totalCashbackValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
        </div>
    );
};

const SpendingBreakdownChart = () => (
    <div className="p-4 md:p-6 rounded-xl h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[var(--card-text-primary)]">{spendingPeriod}</h2>
        </div>
        <div className="flex-grow flex flex-col items-center gap-6">
            <div className="w-full h-72 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={spendingData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius="70%"
                            outerRadius="90%"
                            paddingAngle={2}
                            stroke="none"
                        >
                            {spendingData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-xs text-[var(--card-text-secondary)]">Total spending</p>
                    <p className="text-2xl font-bold text-[var(--card-text-primary)]">
                        ${totalSpendingValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>
            </div>
            <div className="w-full space-y-2.5 text-sm overflow-y-auto pt-4" style={{ maxHeight: "220px" }}>
                {spendingData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                            <span className="text-[var(--card-text-secondary)]">{item.name}</span>
                        </div>
                        <span className="font-medium text-[var(--card-text-primary)]">
                            ${item.value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const FinancialAnalyticsCard = () => (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border-color)] p-4 md:p-6 rounded-xl shadow-lg grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-1 flex flex-col gap-6">
            <TinyDonutChart title="Total income" period={totalIncomePeriod} totalValue={totalIncomeValue} data={totalIncomeData} />
            <CashbackDonutChart />
        </div>
        <div className="lg:col-span-2 h-full">
            <SpendingBreakdownChart />
        </div>
    </div>
);

type TransferContact = {
    id: string;
    name?: string;
    avatarUrl?: string;
    bgColor?: string;
    initials?: string;
};

type AccountOption = {
    id: string;
    name: string;
    maskedNumber: string;
    IconComponent: React.ElementType;
    iconColor?: string;
};

const mockContacts: TransferContact[] = [
    { id: "contact1", avatarUrl: "https://i.pravatar.cc/40?u=contact1", name: "Alice" },
    { id: "contact2", avatarUrl: "https://i.pravatar.cc/40?u=contact2", name: "Bob" },
    { id: "contact3", avatarUrl: "https://i.pravatar.cc/40?u=contact3", name: "Charlie" },
    { id: "contact4", avatarUrl: "https://i.pravatar.cc/40?u=contact4", name: "Diana" },
];

const mockAccountOptions: AccountOption[] = [
    {
        id: "acc1",
        name: "Visa Card",
        maskedNumber: "•••• 6893",
        IconComponent: FaCcVisa,
        iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
        id: "acc2",
        name: "Mastercard",
        maskedNumber: "•••• 2278",
        IconComponent: FaCcMastercard,
        iconColor: "text-orange-500",
    },
    {
        id: "acc3",
        name: "Savings Account",
        maskedNumber: "•••• 1234",
        IconComponent: DollarSign,
        iconColor: "text-[var(--icon-color)]",
    },
];

const TransferContactItem = ({ contact, isSelected, onClick }: { contact: TransferContact; isSelected: boolean; onClick: () => void }) => (
    <button
        type="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick()}
        className={`flex-shrink-0 rounded-full w-12 h-12 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2 focus:ring-offset-[var(--card-bg)] border-2 transition-all ${
            isSelected
                ? "ring-2 ring-[var(--accent-primary)] ring-offset-2 ring-offset-[var(--card-bg)] border-[var(--accent-primary)]"
                : "border-transparent"
        } cursor-pointer`}
    >
        {contact.avatarUrl ? (
            <img src={contact.avatarUrl} alt={contact.name || "Contact"} className="w-10 h-10 rounded-full object-cover" />
        ) : (
            <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium text-[var(--button-primary-text)] ${
                    contact.bgColor || "bg-[var(--avatar-bg)]"
                }`}
            >
                {contact.initials || "U"}
            </div>
        )}
    </button>
);

interface AccountSelectorProps {
    label: string;
    accountOptions: AccountOption[];
    selectedAccount: AccountOption | null;
    onAccountChange: Dispatch<SetStateAction<AccountOption | null>>;
    className?: string;
    excludeId?: string;
}

const AccountSelector = ({ label, accountOptions, selectedAccount, onAccountChange, className, excludeId }: AccountSelectorProps) => {
    const [open, setOpen] = useState(false);
    const handleSelect = (option: AccountOption) => {
        setOpen(false);
        onAccountChange(option);
    };
    return (
        <div className={`flex-1 relative ${className || ""}`} tabIndex={0}>
            <label className="block text-xs text-[var(--card-text-secondary)] mb-1.5">{label}</label>
            <div
                className="flex items-center justify-between p-3 rounded-lg bg-[var(--input-bg)] cursor-pointer hover:bg-[var(--border-color-primary)] transition-colors"
                onClick={() => setOpen((v) => !v)}
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setOpen((v) => !v)}
            >
                <div className="flex items-center gap-2">
                    {selectedAccount?.IconComponent && (
                        <selectedAccount.IconComponent size={20} className={selectedAccount.iconColor || "text-[var(--icon-color)]"} />
                    )}
                    <span className="text-sm font-medium text-[var(--input-text)]">{selectedAccount?.maskedNumber || "Select"}</span>
                </div>
                <ChevronDown size={16} className="text-[var(--input-placeholder)]" />
            </div>
            {open && (
                <ul className="absolute z-10 left-0 right-0 mt-1 bg-[var(--dropdown-bg)] border border-[var(--dropdown-border-color)] rounded-lg shadow-xl max-h-48 overflow-y-auto">
                    {accountOptions
                        .filter((opt) => !excludeId || opt.id !== excludeId)
                        .map((opt) => (
                            <li
                                key={opt.id}
                                onClick={() => handleSelect(opt)}
                                className="flex items-center gap-2 px-4 py-2 hover:bg-[var(--page-bg)] transition-colors cursor-pointer"
                                tabIndex={0}
                                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleSelect(opt)}
                            >
                                <opt.IconComponent size={18} className={opt.iconColor || "text-[var(--icon-color)]"} />
                                <span className="text-sm">
                                    {opt.name} <span className="text-xs text-[var(--input-placeholder)]">{opt.maskedNumber}</span>
                                </span>
                            </li>
                        ))}
                </ul>
            )}
        </div>
    );
};

const FastTransfer = () => {
    const [amount, setAmount] = useState("");
    const [fromAccount, setFromAccount] = useState<AccountOption | null>(mockAccountOptions[0] || null);
    const [toAccount, setToAccount] = useState<AccountOption | null>(mockAccountOptions[1] || null);
    const [selectedContactId, setSelectedContactId] = useState<string | null>(mockContacts[1]?.id || null);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const numericValue = value.replace(/\$\s?/g, "");
        if (/^\d*\.?\d*$/.test(numericValue) || numericValue === "") {
            setAmount(numericValue);
        }
    };

    const canTransfer =
        !!amount && parseFloat(amount) > 0 && fromAccount && toAccount && fromAccount.id !== toAccount.id && selectedContactId;

    const doTransfer = () => {
        if (!canTransfer) return;
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
        setAmount("");
        setFromAccount(mockAccountOptions[0]);
        setToAccount(mockAccountOptions[1]);
        setSelectedContactId(mockContacts[1]?.id || null);
    };

    return (
        <div className="bg-[var(--card-bg)] border border-[var(--card-border-color)] p-4 md:p-6 rounded-xl shadow-lg flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-[var(--card-text-primary)]">Fast transfer</h2>
            </div>
            <div className="mb-4">
                <p className="text-xs text-[var(--card-text-secondary)]">
                    Limit in April: <span className="text-[var(--card-text-primary)] font-medium">$500</span> / $2000
                </p>
                <div className="w-full bg-[var(--progress-track)] rounded-full h-1.5 mt-1.5">
                    <div className="bg-[var(--accent-primary)] h-1.5 rounded-full" style={{ width: "25%" }}></div>
                </div>
            </div>
            <div
                className="flex items-center gap-3 mb-5 overflow-x-auto pb-2 -mx-1 px-1"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {mockContacts.map((contact) => (
                    <TransferContactItem
                        key={contact.id}
                        contact={contact}
                        isSelected={selectedContactId === contact.id}
                        onClick={() => setSelectedContactId(contact.id)}
                    />
                ))}
                <button
                    type="button"
                    className="w-10 h-10 rounded-full bg-[var(--button-tertiary-bg)] text-[var(--button-tertiary-text)] flex-shrink-0 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
                >
                    <Plus size={20} />
                </button>
            </div>
            <div className="flex gap-4 mb-4">
                <AccountSelector
                    label="From"
                    accountOptions={mockAccountOptions}
                    selectedAccount={fromAccount}
                    onAccountChange={setFromAccount}
                    excludeId={toAccount?.id}
                />
                <AccountSelector
                    label="To"
                    accountOptions={mockAccountOptions}
                    selectedAccount={toAccount}
                    onAccountChange={setToAccount}
                    excludeId={fromAccount?.id}
                />
            </div>
            <div className="mb-5">
                <label htmlFor="transferAmount" className="block text-xs text-[var(--card-text-secondary)] mb-1.5">
                    Amount
                </label>
                <input
                    type="text"
                    id="transferAmount"
                    value={amount ? `$ ${amount}` : ""}
                    onChange={handleAmountChange}
                    placeholder="$ 0.00"
                    className="w-full p-3 rounded-lg bg-[var(--input-bg)] text-[var(--input-text)] placeholder-[var(--input-placeholder)] focus:ring-2 focus:ring-[var(--accent-primary)] outline-none transition-shadow text-lg font-semibold"
                />
            </div>
            <button
                type="button"
                onClick={doTransfer}
                disabled={!canTransfer}
                className="w-full p-3.5 rounded-lg bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] hover:opacity-90 transition-opacity cursor-pointer text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed mt-auto"
            >
                Transfer
            </button>
            {showSuccess && (
                <div className="mt-4 p-3 rounded-lg bg-[var(--accent-positive)]/10 text-[var(--accent-positive)] text-center font-medium animate-fade-in">
                    Transfer successful!
                </div>
            )}
        </div>
    );
};

type NotificationItemData = {
    id: string;
    IconComponent: React.ElementType;
    iconColorClass: string;
    iconBgClass: string;
    title: string;
    description: string;
    time: string;
};

type ProfileLinkItemData = {
    id: string;
    text: string;
    IconComponent: React.ElementType;
    action?: () => void;
    href?: string;
};

const mockNotifications: NotificationItemData[] = [
    {
        id: "notif1",
        IconComponent: CheckCircle,
        iconColorClass: "text-green-500",
        iconBgClass: "bg-green-500/10",
        title: "Payment Successful",
        description: "Your payment for Tesla stocks was successful.",
        time: "2 min ago",
    },
    {
        id: "notif2",
        IconComponent: AlertCircle,
        iconColorClass: "text-yellow-500",
        iconBgClass: "bg-yellow-500/10",
        title: "Unusual Login Attempt",
        description: "We detected a login from a new device.",
        time: "1 hour ago",
    },
    {
        id: "notif3",
        IconComponent: Gift,
        iconColorClass: "text-blue-500",
        iconBgClass: "bg-blue-500/10",
        title: "Happy Birthday!",
        description: "Wishing you a happy birthday from Pillar!",
        time: "1 day ago",
    },
];

const mockProfileLinks: ProfileLinkItemData[] = [
    { id: "plink1", text: "My Profile", IconComponent: User, href: "#profile" },
    { id: "plink2", text: "Settings", IconComponent: Settings, href: "#settings" },
    { id: "plink3", text: "Help Center", IconComponent: HelpCircle, href: "#help" },
    { id: "plink4", text: "Sign Out", IconComponent: LogOut, action: () => console.log("User signed out") },
];

const ToastContext = createContext<(msg: string) => void>(() => {});

const Toast = ({ message, onClose }: { message: string; onClose: () => void }) => (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 px-6 py-3 rounded-lg shadow-xl bg-[var(--dropdown-bg)] border border-[var(--dropdown-border-color)] text-[var(--card-text-primary)] font-medium animate-fade-in flex items-center gap-2">
        <span>{message}</span>
        <button
            type="button"
            className="ml-2 text-[var(--icon-color)] hover:text-[var(--icon-hover-color)] cursor-pointer"
            onClick={onClose}
            tabIndex={0}
        >
            ✕
        </button>
    </div>
);

const NotificationDropdown = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const showToast = useContext(ToastContext);
    if (!isOpen) return null;
    return (
        <div className="absolute top-full right-0 mt-2 w-80 md:w-96 bg-[var(--dropdown-bg)] border border-[var(--dropdown-border-color)] rounded-lg shadow-xl z-50">
            <div className="p-4 border-b border-[var(--dropdown-border-color)]">
                <h3 className="text-md font-semibold text-[var(--card-text-primary)]">Notifications</h3>
            </div>
            <div className="py-2 max-h-80 overflow-y-auto">
                {mockNotifications.length === 0 && (
                    <p className="px-4 py-3 text-sm text-[var(--card-text-secondary)]">No new notifications.</p>
                )}
                {mockNotifications.map((notif) => (
                    <div
                        key={notif.id}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-[var(--page-bg)] transition-colors cursor-pointer"
                        onClick={() => showToast(`Performing ${notif.title}`)}
                        tabIndex={0}
                        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && showToast(`Performing ${notif.title}`)}
                    >
                        <div className={`p-2 rounded-full ${notif.iconBgClass}`}>
                            <notif.IconComponent size={20} className={notif.iconColorClass} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-[var(--card-text-primary)]">{notif.title}</p>
                            <p className="text-xs text-[var(--card-text-secondary)] mb-0.5">{notif.description}</p>
                            <p className="text-xs text-[var(--accent-primary)]">{notif.time}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-3 border-t border-[var(--dropdown-border-color)] text-center">
                <a
                    href="#all-notifications"
                    className="text-sm text-[var(--link-text)] hover:text-[var(--link-hover-text)] font-medium cursor-pointer"
                    onClick={() => showToast("Redirecting to all notifications")}
                >
                    View all notifications
                </a>
            </div>
        </div>
    );
};

const ProfileDropdown = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const showToast = useContext(ToastContext);
    if (!isOpen) return null;
    return (
        <div className="absolute top-full right-0 mt-2 w-60 bg-[var(--dropdown-bg)] border border-[var(--dropdown-border-color)] rounded-lg shadow-xl z-50">
            <div className="p-4 border-b border-[var(--dropdown-border-color)]">
                <p className="text-sm font-semibold text-[var(--card-text-primary)]">Kelu Sotonox</p>
                <p className="text-xs text-[var(--card-text-secondary)]">kelu.soto@example.com</p>
            </div>
            <div className="py-2">
                {mockProfileLinks.map((link) => (
                    <a
                        key={link.id}
                        href={link.href || "#"}
                        onClick={(e) => {
                            e.preventDefault();
                            showToast(`Redirecting to ${link.text}`);
                            if (link.action) link.action();
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--card-text-primary)] hover:bg-[var(--page-bg)] transition-colors cursor-pointer"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                showToast(`Redirecting to ${link.text}`);
                                if (link.action) link.action();
                            }
                        }}
                    >
                        <link.IconComponent size={18} className="text-[var(--icon-color)]" />
                        <span>{link.text}</span>
                    </a>
                ))}
            </div>
        </div>
    );
};

type SearchableInvestmentOption = {
    id: string;
    name: string;
    ticker?: string;
    IconComponent: React.ElementType;
    iconColorClass?: string;
};

const mockSearchableInvestments: SearchableInvestmentOption[] = [
    { id: "search-aapl", name: "Apple Inc.", ticker: "AAPL", IconComponent: FaApple },
    { id: "search-tsla", name: "Tesla, Inc.", ticker: "TSLA", IconComponent: SiTesla },
    { id: "search-amzn", name: "Amazon.com, Inc.", ticker: "AMZN", IconComponent: FaAmazon },
    { id: "search-googl", name: "Alphabet Inc. (Google)", ticker: "GOOGL", IconComponent: FaGoogle },
    { id: "search-msft", name: "Microsoft Corporation", ticker: "MSFT", IconComponent: FaMicrosoft, iconColorClass: "text-blue-500" },
    { id: "search-nflx", name: "Netflix, Inc.", ticker: "NFLX", IconComponent: SiNetflix, iconColorClass: "text-red-600" },
    { id: "search-nke", name: "NIKE, Inc.", ticker: "NKE", IconComponent: SiNike },
    { id: "search-ko", name: "The Coca-Cola Company", ticker: "KO", IconComponent: SiCocacola },
    { id: "search-spot", name: "Spotify Technology S.A.", ticker: "SPOT", IconComponent: SiSpotify, iconColorClass: "text-green-500" },
    { id: "search-adbe", name: "Adobe Inc.", ticker: "ADBE", IconComponent: SiAdobe, iconColorClass: "text-red-500" },
    { id: "search-btc", name: "Bitcoin", ticker: "BTC", IconComponent: Bitcoin, iconColorClass: "text-orange-500" },
    { id: "search-eth", name: "Ethereum", ticker: "ETH", IconComponent: DollarSign, iconColorClass: "text-gray-500" },
];

const SearchDropdown = ({
    isOpen,
    items,
    query,
    onSelect,
}: {
    isOpen: boolean;
    items: SearchableInvestmentOption[];
    query: string;
    onSelect: (item: SearchableInvestmentOption) => void;
}) => {
    if (!isOpen) return null;

    return (
        <div className="absolute top-full left-0 mt-2 w-full max-w-md bg-[var(--dropdown-bg)] border border-[var(--dropdown-border-color)] rounded-lg shadow-xl z-50">
            {items.length === 0 && query && (
                <div className="p-4 text-sm text-[var(--card-text-secondary)]">
                    No results found for "<span className="font-medium text-[var(--card-text-primary)]">{query}</span>".
                </div>
            )}
            {items.length > 0 && (
                <ul className="py-2 max-h-96 overflow-y-auto">
                    {items.map((item) => (
                        <li
                            key={item.id}
                            onClick={() => onSelect(item)}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--page-bg)] transition-colors cursor-pointer"
                        >
                            <item.IconComponent size={20} className={item.iconColorClass || "text-[var(--icon-color)]"} />
                            <span className="text-sm font-medium text-[var(--card-text-primary)]">{item.name}</span>
                            {item.ticker && <span className="text-xs text-[var(--card-text-secondary)]">{item.ticker}</span>}
                        </li>
                    ))}
                </ul>
            )}
            {items.length === 0 && !query && (
                <div className="p-4 text-sm text-[var(--card-text-secondary)]">Start typing to search for investments...</div>
            )}
        </div>
    );
};

type FooterHelpLink = { id: string; text: string; href: string; IconComponent: React.ElementType };
type FooterSocialLink = { id: string; name: string; href: string; IconComponent: React.ElementType };

const helpLinks: FooterHelpLink[] = [
    { id: "faq", text: "FAQ", href: "#faq", IconComponent: HelpCircle },
    { id: "support", text: "Contact Support", href: "#support", IconComponent: LifeBuoy },
    { id: "terms", text: "Terms of Service", href: "#terms", IconComponent: FileText },
    { id: "privacy", text: "Privacy Policy", href: "#privacy", IconComponent: ShieldCheck },
];

const socialLinks: FooterSocialLink[] = [
    { id: "twitter", name: "Twitter", href: "#", IconComponent: Twitter },
    { id: "facebook", name: "Facebook", href: "#", IconComponent: Facebook },
    { id: "instagram", name: "Instagram", href: "#", IconComponent: Instagram },
    { id: "linkedin", name: "LinkedIn", href: "#", IconComponent: Linkedin },
];

const AppFooter = () => {
    const showToast = useContext(ToastContext);
    return (
        <footer className="bg-[var(--card-bg)] border-t border-[var(--card-border-color)] text-[var(--page-text-secondary)]">
            <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <h3 className="text-lg font-semibold text-[var(--page-text-primary)] mb-3">Pillar.</h3>
                        <p className="text-sm">
                            Your trusted partner in achieving financial clarity and growth. Manage, invest, and plan with confidence.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-md font-semibold text-[var(--page-text-primary)] mb-3">Help & Support</h4>
                        <ul className="space-y-2">
                            {helpLinks.map((link) => (
                                <li key={link.id}>
                                    <a
                                        href={link.href}
                                        className="flex items-center gap-2 text-sm hover:text-[var(--link-text)] transition-colors cursor-pointer"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            showToast(`Redirecting to ${link.text}`);
                                        }}
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                                e.preventDefault();
                                                showToast(`Redirecting to ${link.text}`);
                                            }
                                        }}
                                    >
                                        <link.IconComponent size={16} />
                                        {link.text}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-md font-semibold text-[var(--page-text-primary)] mb-3">Connect With Us</h4>
                        <div className="flex space-x-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.id}
                                    href={social.href}
                                    className="text-[var(--icon-color)] hover:text-[var(--link-text)] transition-colors cursor-pointer"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        showToast(`Redirecting to ${social.name}`);
                                    }}
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            showToast(`Redirecting to ${social.name}`);
                                        }
                                    }}
                                >
                                    <social.IconComponent size={22} />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="border-t border-[var(--card-border-color)] pt-6 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} Pillar Inc. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

const MobileSearchModal = ({
    isOpen,
    onClose,
    searchQuery,
    setSearchQuery,
    handleSearchInputChange,
    handleSearchInputFocus,
    isSearchDropdownVisible,
    filteredInvestments,
    handleInvestmentSelect,
    searchDropdownRef,
    mobileSearchInputRef,
}: {
    isOpen: boolean;
    onClose: () => void;
    searchQuery: string;
    setSearchQuery: Dispatch<SetStateAction<string>>;
    handleSearchInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleSearchInputFocus: () => void;
    isSearchDropdownVisible: boolean;
    filteredInvestments: SearchableInvestmentOption[];
    handleInvestmentSelect: (item: SearchableInvestmentOption) => void;
    searchDropdownRef: React.RefObject<HTMLDivElement | null>;
    mobileSearchInputRef: React.RefObject<HTMLInputElement | null>;
}) => {
    useEffect(() => {
        if (isOpen && mobileSearchInputRef.current) {
            mobileSearchInputRef.current.focus();
        }
    }, [isOpen, mobileSearchInputRef]);

    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener("keydown", handleEscapeKey);
        } else {
            document.removeEventListener("keydown", handleEscapeKey);
        }
        return () => document.removeEventListener("keydown", handleEscapeKey);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-40 flex flex-col items-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
            <div
                className="relative w-full max-w-xl p-4 mt-[10vh] bg-[var(--dropdown-bg)] rounded-lg shadow-xl"
                onClick={(e) => e.stopPropagation()}
                ref={searchDropdownRef}
            >
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-[var(--icon-color)] hover:text-[var(--icon-hover-color)] cursor-pointer p-1 rounded-full hover:bg-[var(--input-bg)] transition-colors"
                >
                    <XIcon size={20} />
                </button>
                <div className="relative">
                    <SearchIcon
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--input-placeholder)] pointer-events-none"
                    />
                    <input
                        ref={mobileSearchInputRef}
                        type="search"
                        placeholder="Search investments..."
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                        onFocus={handleSearchInputFocus}
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-[var(--input-bg)] text-[var(--input-text)] placeholder-[var(--input-placeholder)] focus:ring-2 focus:ring-[var(--accent-primary)] outline-none transition-shadow text-base"
                    />
                </div>

                <SearchDropdown
                    isOpen={isSearchDropdownVisible && searchQuery.length > 0}
                    items={filteredInvestments}
                    query={searchQuery}
                    onSelect={(item) => {
                        handleInvestmentSelect(item);
                        onClose();
                    }}
                />
            </div>
        </div>
    );
};

interface AddGoalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaveGoal: (newGoalData: Omit<GoalItemData, "id">) => void;
    selectableIcons: SelectableGoalIcon[];
}

const AddGoalModal = ({ isOpen, onClose, onSaveGoal, selectableIcons }: AddGoalModalProps) => {
    const [goalName, setGoalName] = useState("");
    const [selectedIconName, setSelectedIconName] = useState(selectableIcons[0]?.name || "");
    const [currentAmountStr, setCurrentAmountStr] = useState("");
    const [targetAmountStr, setTargetAmountStr] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setGoalName("");
            setSelectedIconName(selectableIcons[0]?.name || "");
            setCurrentAmountStr("");
            setTargetAmountStr("");
            setErrorMessage(null);
        }
    }, [isOpen, selectableIcons]);

    const handleSave = () => {
        setErrorMessage(null);
        const currentAmount = parseFloat(currentAmountStr);
        const targetAmount = parseFloat(targetAmountStr);

        if (!goalName.trim()) {
            setErrorMessage("Goal name is required.");
            return;
        }
        if (!targetAmountStr.trim() || isNaN(targetAmount) || targetAmount <= 0) {
            setErrorMessage("Valid target amount is required.");
            return;
        }
        if (currentAmountStr.trim() && (isNaN(currentAmount) || currentAmount < 0)) {
            setErrorMessage("Current amount must be a valid number or empty.");
            return;
        }
        if (!isNaN(currentAmount) && currentAmount > targetAmount) {
            setErrorMessage("Current amount cannot exceed target amount.");
            return;
        }

        const selectedIconObject = selectableIcons.find((icon) => icon.name === selectedIconName);
        if (!selectedIconObject) {
            setErrorMessage("Please select a valid icon.");
            return;
        }

        onSaveGoal({
            name: goalName.trim(),
            IconComponent: selectedIconObject.IconComponent,
            currentAmount: isNaN(currentAmount) ? 0 : currentAmount,
            targetAmount: targetAmount,
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
            <div
                className="bg-[var(--dropdown-bg)] p-6 rounded-xl shadow-2xl w-full max-w-md text-[var(--card-text-primary)]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold">Add New Goal</h3>
                    <button
                        onClick={onClose}
                        className="text-[var(--icon-color)] hover:text-[var(--icon-hover-color)] cursor-pointer p-1 rounded-full hover:bg-[var(--input-bg)]"
                    >
                        <XIcon size={22} />
                    </button>
                </div>

                {errorMessage && (
                    <div className="mb-4 p-3 bg-red-500/10 text-red-700 dark:text-red-400 border border-red-700/20 rounded-md text-sm">
                        {errorMessage}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label htmlFor="goalName" className="block text-sm font-medium text-[var(--card-text-secondary)] mb-1">
                            Goal Name
                        </label>
                        <input
                            type="text"
                            id="goalName"
                            value={goalName}
                            onChange={(e) => setGoalName(e.target.value)}
                            className="w-full p-2.5 rounded-lg bg-[var(--input-bg)] text-[var(--input-text)] placeholder-[var(--input-placeholder)] focus:ring-2 focus:ring-[var(--accent-primary)] outline-none"
                            placeholder="e.g., Save for Vacation"
                        />
                    </div>

                    <div>
                        <label htmlFor="goalIcon" className="block text-sm font-medium text-[var(--card-text-secondary)] mb-1">
                            Icon
                        </label>
                        <select
                            id="goalIcon"
                            value={selectedIconName}
                            onChange={(e) => setSelectedIconName(e.target.value)}
                            className="w-full p-2.5 rounded-lg bg-[var(--input-bg)] text-[var(--input-text)] focus:ring-2 focus:ring-[var(--accent-primary)] outline-none appearance-none cursor-pointer"
                        >
                            {selectableIcons.map((icon) => (
                                <option key={icon.name} value={icon.name}>
                                    {icon.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="currentAmount" className="block text-sm font-medium text-[var(--card-text-secondary)] mb-1">
                            Current Amount (Optional)
                        </label>
                        <input
                            type="text"
                            id="currentAmount"
                            value={currentAmountStr}
                            onChange={(e) => setCurrentAmountStr(e.target.value.replace(/[^\d.]/g, ""))}
                            className="w-full p-2.5 rounded-lg bg-[var(--input-bg)] text-[var(--input-text)] placeholder-[var(--input-placeholder)] focus:ring-2 focus:ring-[var(--accent-primary)] outline-none"
                            placeholder="e.g., 100.00"
                        />
                    </div>

                    <div>
                        <label htmlFor="targetAmount" className="block text-sm font-medium text-[var(--card-text-secondary)] mb-1">
                            Target Amount
                        </label>
                        <input
                            type="text"
                            id="targetAmount"
                            value={targetAmountStr}
                            onChange={(e) => setTargetAmountStr(e.target.value.replace(/[^\d.]/g, ""))}
                            className="w-full p-2.5 rounded-lg bg-[var(--input-bg)] text-[var(--input-text)] placeholder-[var(--input-placeholder)] focus:ring-2 focus:ring-[var(--accent-primary)] outline-none"
                            placeholder="e.g., 1000.00"
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2.5 rounded-lg bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)] hover:opacity-90 transition-opacity cursor-pointer text-sm font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2.5 rounded-lg bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] hover:opacity-90 transition-opacity cursor-pointer text-sm font-medium"
                    >
                        Save Goal
                    </button>
                </div>
            </div>
        </div>
    );
};

interface AddCardModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaveCard: (newCardData: Omit<DebitCardDetails, "id" | "balance">) => void;
    selectableGradients: SelectableGradient[];
}

const AddCardModal = ({ isOpen, onClose, onSaveCard, selectableGradients }: AddCardModalProps) => {
    const [cardHolder, setCardHolder] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiryMonth, setExpiryMonth] = useState("");
    const [expiryYear, setExpiryYear] = useState("");
    const [cvv, setCvv] = useState("");
    const [network, setNetwork] = useState<"visa" | "mastercard">("visa");
    const [selectedGradientClass, setSelectedGradientClass] = useState(selectableGradients[0]?.className || "");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setCardHolder("");
            setCardNumber("");
            setExpiryMonth("");
            setExpiryYear("");
            setCvv("");
            setNetwork("visa");
            setSelectedGradientClass(selectableGradients[0]?.className || "");
            setErrorMessage(null);
        }
    }, [isOpen, selectableGradients]);

    const formatCardNumber = (value: string) => {
        return value
            .replace(/\D/g, "")
            .replace(/(.{4})/g, "$1 ")
            .trim()
            .slice(0, 19);
    };

    const formatExpiry = (value: string) => {
        return value.replace(/\D/g, "").slice(0, 2);
    };

    const formatCvv = (value: string) => {
        return value.replace(/\D/g, "").slice(0, 4);
    };

    const handleSave = () => {
        setErrorMessage(null);

        if (!cardHolder.trim()) {
            setErrorMessage("Cardholder name is required.");
            return;
        }
        if (cardNumber.replace(/\s/g, "").length < 15 || cardNumber.replace(/\s/g, "").length > 16) {
            setErrorMessage("Invalid card number length.");
            return;
        }
        if (!/^(0[1-9]|1[0-2])$/.test(expiryMonth)) {
            setErrorMessage("Invalid expiry month.");
            return;
        }
        const currentYearShort = new Date().getFullYear() % 100;
        if (!/^\d{2}$/.test(expiryYear) || parseInt(expiryYear) < currentYearShort) {
            setErrorMessage("Invalid expiry year.");
            return;
        }
        if (cvv.length < 3 || cvv.length > 4) {
            setErrorMessage("Invalid CVV length.");
            return;
        }
        if (!selectedGradientClass) {
            setErrorMessage("Please select a card style.");
            return;
        }

        const lastFour = cardNumber.replace(/\s/g, "").slice(-4);

        onSaveCard({
            cardHolder: cardHolder.trim(),
            lastFour: lastFour,
            network: network,
            gradientClass: selectedGradientClass,
            expiryDate: `${expiryMonth}/${expiryYear}`,
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
            <div
                className="bg-[var(--dropdown-bg)] p-6 rounded-xl shadow-2xl w-full max-w-lg text-[var(--card-text-primary)]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold">Add New Debit Card</h3>
                    <button
                        onClick={onClose}
                        className="text-[var(--icon-color)] hover:text-[var(--icon-hover-color)] cursor-pointer p-1 rounded-full hover:bg-[var(--input-bg)]"
                    >
                        <XIcon size={22} />
                    </button>
                </div>

                {errorMessage && (
                    <div className="mb-4 p-3 bg-red-500/10 text-red-700 dark:text-red-400 border border-red-700/20 rounded-md text-sm">
                        {errorMessage}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label htmlFor="cardHolder" className="block text-sm font-medium text-[var(--card-text-secondary)] mb-1">
                            Cardholder Name
                        </label>
                        <input
                            type="text"
                            id="cardHolder"
                            value={cardHolder}
                            onChange={(e) => setCardHolder(e.target.value)}
                            className="w-full p-2.5 rounded-lg bg-[var(--input-bg)] text-[var(--input-text)] placeholder-[var(--input-placeholder)] focus:ring-2 focus:ring-[var(--accent-primary)] outline-none"
                            placeholder="e.g., John Doe"
                        />
                    </div>
                    <div>
                        <label htmlFor="cardNumber" className="block text-sm font-medium text-[var(--card-text-secondary)] mb-1">
                            Card Number
                        </label>
                        <input
                            type="text"
                            id="cardNumber"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                            className="w-full p-2.5 rounded-lg bg-[var(--input-bg)] text-[var(--input-text)] placeholder-[var(--input-placeholder)] focus:ring-2 focus:ring-[var(--accent-primary)] outline-none"
                            placeholder="0000 0000 0000 0000"
                        />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="expiryMonth" className="block text-sm font-medium text-[var(--card-text-secondary)] mb-1">
                                Expiry MM
                            </label>
                            <input
                                type="text"
                                id="expiryMonth"
                                value={expiryMonth}
                                onChange={(e) => setExpiryMonth(formatExpiry(e.target.value))}
                                className="w-full p-2.5 rounded-lg bg-[var(--input-bg)] text-[var(--input-text)] placeholder-[var(--input-placeholder)] focus:ring-2 focus:ring-[var(--accent-primary)] outline-none"
                                placeholder="MM"
                            />
                        </div>
                        <div>
                            <label htmlFor="expiryYear" className="block text-sm font-medium text-[var(--card-text-secondary)] mb-1">
                                Expiry YY
                            </label>
                            <input
                                type="text"
                                id="expiryYear"
                                value={expiryYear}
                                onChange={(e) => setExpiryYear(formatExpiry(e.target.value))}
                                className="w-full p-2.5 rounded-lg bg-[var(--input-bg)] text-[var(--input-text)] placeholder-[var(--input-placeholder)] focus:ring-2 focus:ring-[var(--accent-primary)] outline-none"
                                placeholder="YY"
                            />
                        </div>
                        <div>
                            <label htmlFor="cvv" className="block text-sm font-medium text-[var(--card-text-secondary)] mb-1">
                                CVV
                            </label>
                            <input
                                type="text"
                                id="cvv"
                                value={cvv}
                                onChange={(e) => setCvv(formatCvv(e.target.value))}
                                className="w-full p-2.5 rounded-lg bg-[var(--input-bg)] text-[var(--input-text)] placeholder-[var(--input-placeholder)] focus:ring-2 focus:ring-[var(--accent-primary)] outline-none"
                                placeholder="123"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="cardNetwork" className="block text-sm font-medium text-[var(--card-text-secondary)] mb-1">
                                Network
                            </label>
                            <select
                                id="cardNetwork"
                                value={network}
                                onChange={(e) => setNetwork(e.target.value as "visa" | "mastercard")}
                                className="w-full p-2.5 rounded-lg bg-[var(--input-bg)] text-[var(--input-text)] focus:ring-2 focus:ring-[var(--accent-primary)] outline-none appearance-none cursor-pointer"
                            >
                                <option value="visa">Visa</option>
                                <option value="mastercard">Mastercard</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="cardStyle" className="block text-sm font-medium text-[var(--card-text-secondary)] mb-1">
                                Card Style
                            </label>
                            <select
                                id="cardStyle"
                                value={selectedGradientClass}
                                onChange={(e) => setSelectedGradientClass(e.target.value)}
                                className="w-full p-2.5 rounded-lg bg-[var(--input-bg)] text-[var(--input-text)] focus:ring-2 focus:ring-[var(--accent-primary)] outline-none appearance-none cursor-pointer"
                            >
                                {selectableGradients.map((grad) => (
                                    <option key={grad.name} value={grad.className}>
                                        {grad.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2.5 rounded-lg bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)] hover:opacity-90 transition-opacity cursor-pointer text-sm font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2.5 rounded-lg bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] hover:opacity-90 transition-opacity cursor-pointer text-sm font-medium"
                    >
                        Save Card
                    </button>
                </div>
            </div>
        </div>
    );
};

interface ViewAllModalProps<T> {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    items: T[];
    renderItem: (item: T, index?: number) => React.ReactNode;
    itemContainerClassName?: string;
}

const ViewAllModal = <T extends { id: string }>({
    isOpen,
    onClose,
    title,
    items,
    renderItem,
    itemContainerClassName = "space-y-1",
}: ViewAllModalProps<T>) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
            <div
                className="bg-[var(--dropdown-bg)] p-6 rounded-xl shadow-2xl w-full max-w-2xl text-[var(--card-text-primary)] flex flex-col"
                style={{ maxHeight: "85vh" }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6 flex-shrink-0">
                    <h3 className="text-xl font-semibold">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-[var(--icon-color)] hover:text-[var(--icon-hover-color)] cursor-pointer p-1 rounded-full hover:bg-[var(--input-bg)]"
                    >
                        <XIcon size={22} />
                    </button>
                </div>
                {items.length === 0 ? (
                    <p className="text-center text-[var(--card-text-secondary)] py-8">No items to display.</p>
                ) : (
                    <ul className={`flex-grow overflow-y-auto ${itemContainerClassName}`}>
                        {items.map((item, index) => {
                            const element = renderItem(item, index) as React.ReactElement;
                            return React.cloneElement(element, { key: item.id });
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
};

const FinancePlatformDisplay = () => {
    const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredInvestments, setFilteredInvestments] = useState<SearchableInvestmentOption[]>([]);
    const [isSearchDropdownVisible, setIsSearchDropdownVisible] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [userGoals, setUserGoals] = useState<GoalItemData[]>(mockGoals);
    const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
    const [userDebitCards, setUserDebitCards] = useState<DebitCardDetails[]>(mockDebitCards);
    const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
    const [isViewAllTransactionsOpen, setIsViewAllTransactionsOpen] = useState(false);
    const [isViewAllGoalsOpen, setIsViewAllGoalsOpen] = useState(false);
    const [isViewAllInvestmentsOpen, setIsViewAllInvestmentsOpen] = useState(false);
    const [toastMsg, setToastMsg] = useState<string | null>(null);
    const toastTimeout = useRef<NodeJS.Timeout | null>(null);
    const showToast = (msg: string) => {
        setToastMsg(msg);
        if (toastTimeout.current) clearTimeout(toastTimeout.current);
        toastTimeout.current = setTimeout(() => setToastMsg(null), 2200);
    };

    const notificationRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);
    const bellRef = useRef<HTMLButtonElement>(null);
    const profileImgRef = useRef<HTMLImageElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const mobileSearchInputRef = useRef<HTMLInputElement>(null);
    const searchDropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                showNotificationDropdown &&
                notificationRef.current &&
                !notificationRef.current.contains(event.target as Node) &&
                bellRef.current &&
                !bellRef.current.contains(event.target as Node)
            ) {
                setShowNotificationDropdown(false);
            }
            if (
                showProfileDropdown &&
                profileRef.current &&
                !profileRef.current.contains(event.target as Node) &&
                profileImgRef.current &&
                !profileImgRef.current.contains(event.target as Node)
            ) {
                setShowProfileDropdown(false);
            }
            if (isSearchDropdownVisible && searchDropdownRef.current && !searchDropdownRef.current.contains(event.target as Node)) {
                const activeSearchInput =
                    (document.activeElement === searchInputRef.current && searchInputRef.current?.contains(event.target as Node)) ||
                    (document.activeElement === mobileSearchInputRef.current &&
                        mobileSearchInputRef.current?.contains(event.target as Node));
                if (!activeSearchInput) {
                    setIsSearchDropdownVisible(false);
                }
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showNotificationDropdown, showProfileDropdown, isSearchDropdownVisible]);

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredInvestments([]);
            if (document.activeElement !== searchInputRef.current && document.activeElement !== mobileSearchInputRef.current) {
                setIsSearchDropdownVisible(false);
            }
            return;
        }
        const lowerCaseQuery = searchQuery.toLowerCase();
        const results = mockSearchableInvestments.filter(
            (item) =>
                item.name.toLowerCase().includes(lowerCaseQuery) || (item.ticker && item.ticker.toLowerCase().includes(lowerCaseQuery))
        );
        setFilteredInvestments(results);
        setIsSearchDropdownVisible(true);
    }, [searchQuery]);

    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const prepareSearchDropdown = () => {
        setIsSearchDropdownVisible(true);
        if (searchQuery.trim() === "" && filteredInvestments.length === 0) {
            setFilteredInvestments([]);
        }
    };

    const selectSearchItem = (item: SearchableInvestmentOption) => {
        console.log("Selected investment:", item);
        setSearchQuery(item.name);
        setIsSearchDropdownVisible(false);
        if (isMobileSearchOpen) {
            setIsMobileSearchOpen(false);
        }
    };

    const openMobileSearchModal = () => {
        setIsMobileSearchOpen(true);
    };

    const closeMobileSearchModal = () => {
        setIsMobileSearchOpen(false);
    };

    const handleAddNewGoal = (newGoalData: Omit<GoalItemData, "id">) => {
        const newGoal: GoalItemData = {
            ...newGoalData,
            id: `goal-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        };
        setUserGoals((prevGoals) => [...prevGoals, newGoal]);
        setIsAddGoalModalOpen(false);
    };

    const handleSaveNewCard = (newCardData: Omit<DebitCardDetails, "id" | "balance">) => {
        const newCard: DebitCardDetails = {
            ...newCardData,
            id: `card-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            balance: Math.floor(Math.random() * 5000) + 1000,
        };
        setUserDebitCards((prevCards) => [...prevCards, newCard]);
        setIsAddCardModalOpen(false);
    };

    const allTransactions = [...mockTransactions, ...mockTransactions.map((tx, idx) => ({ ...tx, id: tx.id + "-2" }))];
    const allInvestments = [...mockInvestments, ...mockInvestments.map((inv, idx) => ({ ...inv, id: inv.id + "-2" }))];

    return (
        <ToastContext.Provider value={showToast}>
            <div className={`min-h-screen flex flex-col`}>
                <GlobalThemeStyles />
                <header className="p-4 md:p-6 lg:p-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-[var(--brand-text-color)]">Pillar.</h1>
                    <div className="flex items-center gap-2 md:gap-4">
                        <div className="relative hidden md:block" ref={searchDropdownRef}>
                            <SearchIcon
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--input-placeholder)] pointer-events-none"
                            />
                            <input
                                ref={searchInputRef}
                                type="search"
                                placeholder="Search investments..."
                                value={searchQuery}
                                onChange={handleSearchInputChange}
                                onFocus={prepareSearchDropdown}
                                className="pl-10 pr-4 py-2 rounded-lg bg-[var(--input-bg)] text-[var(--input-text)] placeholder-[var(--input-placeholder)] focus:ring-2 focus:ring-[var(--accent-primary)] outline-none transition-shadow w-full md:w-64 lg:w-72"
                            />
                            <SearchDropdown
                                isOpen={isSearchDropdownVisible && !isMobileSearchOpen}
                                items={filteredInvestments}
                                query={searchQuery}
                                onSelect={selectSearchItem}
                            />
                        </div>
                        <button
                            onClick={openMobileSearchModal}
                            className="md:hidden p-2 rounded-full cursor-pointer bg-[var(--input-bg)] text-[var(--icon-color)] hover:text-[var(--icon-hover-color)] transition-colors"
                        >
                            <SearchIcon size={20} />
                        </button>

                        <ThemeToggleButton />
                        <div className="relative">
                            <button
                                ref={bellRef}
                                onClick={() => setShowNotificationDropdown((prev) => !prev)}
                                className="text-[var(--icon-color)] hover:text-[var(--icon-hover-color)] cursor-pointer transition-colors p-1.5 rounded-full hover:bg-[var(--input-bg)]"
                            >
                                <Bell size={24} />
                            </button>
                            <div ref={notificationRef}>
                                <NotificationDropdown
                                    isOpen={showNotificationDropdown}
                                    onClose={() => setShowNotificationDropdown(false)}
                                />
                            </div>
                        </div>
                        <div className="relative">
                            <img
                                ref={profileImgRef}
                                src="https://i.pravatar.cc/32?u=userProfile"
                                alt="User Profile"
                                className="w-8 h-8 rounded-full object-cover cursor-pointer"
                                onClick={() => setShowProfileDropdown((prev) => !prev)}
                            />
                            <div ref={profileRef}>
                                <ProfileDropdown isOpen={showProfileDropdown} onClose={() => setShowProfileDropdown(false)} />
                            </div>
                        </div>
                    </div>
                </header>
                <main className="flex-grow p-4 md:p-6 lg:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1 flex flex-col gap-6">
                            <RecentTransactions transactions={allTransactions} onViewAllClick={() => setIsViewAllTransactionsOpen(true)} />
                            <MyGoals
                                goals={userGoals}
                                onAddNewGoalClick={() => setIsAddGoalModalOpen(true)}
                                onViewAllClick={() => setIsViewAllGoalsOpen(true)}
                            />
                        </div>
                        <div className="lg:col-span-1 flex flex-col gap-6">
                            <BalanceDisplay debitCards={userDebitCards} onAddNewCardClick={() => setIsAddCardModalOpen(true)} />
                            <FinancialAnalyticsCard />
                        </div>
                        <div className="lg:col-span-1 flex flex-col gap-6">
                            <MyInvestments investments={allInvestments} onViewAllClick={() => setIsViewAllInvestmentsOpen(true)} />
                            <FastTransfer />
                        </div>
                    </div>
                </main>
                <AppFooter />
                <MobileSearchModal
                    isOpen={isMobileSearchOpen}
                    onClose={closeMobileSearchModal}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    handleSearchInputChange={handleSearchInputChange}
                    handleSearchInputFocus={prepareSearchDropdown}
                    isSearchDropdownVisible={isSearchDropdownVisible && searchQuery.length > 0}
                    filteredInvestments={filteredInvestments}
                    handleInvestmentSelect={selectSearchItem}
                    searchDropdownRef={searchDropdownRef}
                    mobileSearchInputRef={mobileSearchInputRef}
                />
                <AddGoalModal
                    isOpen={isAddGoalModalOpen}
                    onClose={() => setIsAddGoalModalOpen(false)}
                    onSaveGoal={handleAddNewGoal}
                    selectableIcons={selectableGoalIconsList}
                />
                <AddCardModal
                    isOpen={isAddCardModalOpen}
                    onClose={() => setIsAddCardModalOpen(false)}
                    onSaveCard={handleSaveNewCard}
                    selectableGradients={selectableCardGradients}
                />

                <ViewAllModal<Transaction>
                    isOpen={isViewAllTransactionsOpen}
                    onClose={() => setIsViewAllTransactionsOpen(false)}
                    title="All Transactions"
                    items={allTransactions}
                    renderItem={(item: Transaction) => <TransactionItem transaction={item} />}
                    itemContainerClassName="space-y-0 divide-y divide-[var(--border-color-primary)]"
                />

                <ViewAllModal<GoalItemData>
                    isOpen={isViewAllGoalsOpen}
                    onClose={() => setIsViewAllGoalsOpen(false)}
                    title="All Goals"
                    items={userGoals}
                    renderItem={(item: GoalItemData) => <GoalItem item={item} />}
                />

                <ViewAllModal<InvestmentItemData>
                    isOpen={isViewAllInvestmentsOpen}
                    onClose={() => setIsViewAllInvestmentsOpen(false)}
                    title="All Investments"
                    items={allInvestments}
                    renderItem={(item: InvestmentItemData) => <InvestmentItem item={item} />}
                />
                {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}
            </div>
        </ToastContext.Provider>
    );
};

export default function Page() {
    return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <FinancePlatformDisplay />
        </ThemeProvider>
    );
}
