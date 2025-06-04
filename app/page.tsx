"use client";

import React, { useState, useEffect, useReducer, useCallback, useMemo, useRef } from "react";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";

// Enhanced TypeScript Types
// =================================================================================================

interface Resource {
    id: string;
    name: string;
    amount: number;
    capacity: number;
    perSecond: number;
    color: string;
    icon: string;
    tier: number;
    multiplier: number;
}

interface Ship {
    id: string;
    name: string;
    count: number;
    cost: { resourceId: string; amount: number }[];
    miningRate: { resourceId: string; rate: number }[];
    description: string;
    icon: string;
    isUnlocked: boolean;
    tier: number;
    efficiency: number;
    specialAbility?: string;
}

interface Upgrade {
    id: string;
    name: string;
    description: string;
    cost: { resourceId: string; amount: number }[];
    effect: (state: GameState) => GameState;
    isPurchased: boolean;
    unlocks?: string[];
    category: "efficiency" | "capacity" | "unlock" | "prestige";
    tier: number;
    icon: string;
}

interface GalaxySystem {
    id: string;
    name: string;
    x: number;
    y: number;
    isExplored: boolean;
    description: string;
    explorationCost: number;
    rewards?: { resourceId: string; amount: number }[];
    tier: number;
    specialFeature?: string;
    difficulty: number;
}

interface Achievement {
    id: string;
    name: string;
    description: string;
    isUnlocked: boolean;
    condition: (state: GameState) => boolean;
    reward?: { resourceId: string; amount: number }[];
    tier: "bronze" | "silver" | "gold" | "platinum" | "cosmic";
    icon: string;
}

interface Technology {
    id: string;
    name: string;
    description: string;
    cost: { resourceId: string; amount: number }[];
    isResearched: boolean;
    requirements: string[];
    effects: string[];
    tier: number;
}

interface GameState {
    resources: Record<string, Resource>;
    ships: Record<string, Ship>;
    upgrades: Record<string, Upgrade>;
    systems: Record<string, GalaxySystem>;
    achievements: Record<string, Achievement>;
    technologies: Record<string, Technology>;
    lastUpdate: number;
    isGalaxyMapOpen: boolean;
    resourceHistory: Record<string, number[]>;
    gameStartTime: number;
    totalResourcesGenerated: Record<string, number>;
    prestigeLevel: number;
    prestigePoints: number;
    currentTab: "fleet" | "research" | "prestige" | "achievements";
    autoSaveEnabled: boolean;
    notifications: Notification[];
}

interface Notification {
    id: string;
    type: "achievement" | "milestone" | "warning" | "info";
    title: string;
    message: string;
    timestamp: number;
    duration: number;
}

type GameAction =
    | { type: "UPDATE_RESOURCES"; deltaTime: number }
    | { type: "PURCHASE_SHIP"; shipId: string }
    | { type: "PURCHASE_UPGRADE"; upgradeId: string }
    | { type: "RESEARCH_TECHNOLOGY"; techId: string }
    | { type: "EXPLORE_SYSTEM"; systemId: string }
    | { type: "TOGGLE_GALAXY_MAP" }
    | { type: "SET_TAB"; tab: "fleet" | "research" | "prestige" | "achievements" }
    | { type: "SET_RESOURCE_HISTORY"; resourceId: string; value: number }
    | { type: "CHECK_ACHIEVEMENTS" }
    | { type: "ADD_NOTIFICATION"; notification: Notification }
    | { type: "REMOVE_NOTIFICATION"; id: string }
    | { type: "PRESTIGE_RESET" }
    | { type: "RESET_GAME" };

// Enhanced Game Constants
// =================================================================================================

const TICK_INTERVAL = 50; // Ultra-smooth 20fps updates
const MAX_RESOURCE_HISTORY = 120;

const INITIAL_RESOURCES: Record<string, Resource> = {
    minerals: {
        id: "minerals",
        name: "Minerals",
        amount: 100,
        capacity: 1000,
        perSecond: 0,
        color: "#ff6b35",
        icon: "⛏️",
        tier: 1,
        multiplier: 1,
    },
    gas: {
        id: "gas",
        name: "Quantum Gas",
        amount: 0,
        capacity: 500,
        perSecond: 0,
        color: "#a855f7",
        icon: "🌌",
        tier: 2,
        multiplier: 1,
    },
    credits: {
        id: "credits",
        name: "Credits",
        amount: 500,
        capacity: 10000,
        perSecond: 0,
        color: "#06d6a0",
        icon: "💎",
        tier: 1,
        multiplier: 1,
    },
    antimatter: {
        id: "antimatter",
        name: "Antimatter",
        amount: 0,
        capacity: 100,
        perSecond: 0,
        color: "#ef476f",
        icon: "⚛️",
        tier: 3,
        multiplier: 1,
    },
    darkMatter: {
        id: "darkMatter",
        name: "Dark Matter",
        amount: 0,
        capacity: 50,
        perSecond: 0,
        color: "#1e1b4b",
        icon: "🕳️",
        tier: 4,
        multiplier: 1,
    },
};

const INITIAL_SHIPS: Record<string, Ship> = {
    miningDrone: {
        id: "miningDrone",
        name: "Mining Drone",
        count: 1,
        cost: [{ resourceId: "minerals", amount: 50 }],
        miningRate: [
            { resourceId: "minerals", rate: 1 },
            { resourceId: "credits", rate: 0.2 },
        ],
        description: "Basic autonomous mining unit that extracts minerals and sells surplus for credits.",
        icon: "🤖",
        isUnlocked: true,
        tier: 1,
        efficiency: 1,
    },
    gasHarvester: {
        id: "gasHarvester",
        name: "Quantum Harvester",
        count: 0,
        cost: [
            { resourceId: "minerals", amount: 300 },
            { resourceId: "credits", amount: 100 },
        ],
        miningRate: [{ resourceId: "gas", rate: 0.8 }],
        description: "Advanced vessel for harvesting quantum gas from nebulae.",
        icon: "🛸",
        isUnlocked: false,
        tier: 2,
        efficiency: 1,
    },
    tradeVessel: {
        id: "tradeVessel",
        name: "Trade Cruiser",
        count: 0,
        cost: [
            { resourceId: "minerals", amount: 800 },
            { resourceId: "gas", amount: 200 },
        ],
        miningRate: [{ resourceId: "credits", rate: 2.5 }],
        description: "Luxury merchant vessel for interstellar commerce.",
        icon: "🚀",
        isUnlocked: false,
        tier: 2,
        efficiency: 1,
    },
    antimatterReactor: {
        id: "antimatterReactor",
        name: "Antimatter Reactor",
        count: 0,
        cost: [
            { resourceId: "credits", amount: 5000 },
            { resourceId: "gas", amount: 1000 },
        ],
        miningRate: [{ resourceId: "antimatter", rate: 0.1 }],
        description: "Cutting-edge reactor producing pure antimatter.",
        icon: "⚛️",
        isUnlocked: false,
        tier: 3,
        efficiency: 1,
        specialAbility: "Converts gas to antimatter",
    },
    darkMatterCollector: {
        id: "darkMatterCollector",
        name: "Dark Matter Collector",
        count: 0,
        cost: [
            { resourceId: "antimatter", amount: 100 },
            { resourceId: "credits", amount: 25000 },
        ],
        miningRate: [{ resourceId: "darkMatter", rate: 0.05 }],
        description: "Mysterious technology harvesting dark matter from the void.",
        icon: "🕳️",
        isUnlocked: false,
        tier: 4,
        efficiency: 1,
        specialAbility: "Harvests from dark energy",
    },
};

const INITIAL_UPGRADES: Record<string, Upgrade> = {
    droneEfficiency1: {
        id: "droneEfficiency1",
        name: "Neural Mining Networks",
        description: "AI-enhanced mining increases drone efficiency by 200%.",
        cost: [{ resourceId: "minerals", amount: 500 }],
        effect: (state) => {
            const newState = { ...state };
            newState.ships.miningDrone.efficiency *= 3;
            return newState;
        },
        isPurchased: false,
        category: "efficiency",
        tier: 1,
        icon: "🧠",
    },
    quantumStorage: {
        id: "quantumStorage",
        name: "Quantum Storage Matrix",
        description: "Quantum compression increases all storage by 300%.",
        cost: [{ resourceId: "credits", amount: 1000 }],
        effect: (state) => {
            const newState = { ...state };
            Object.values(newState.resources).forEach((res) => {
                res.capacity *= 4;
            });
            return newState;
        },
        isPurchased: false,
        category: "capacity",
        tier: 2,
        icon: "📦",
    },
    unlockQuantumTech: {
        id: "unlockQuantumTech",
        name: "Quantum Field Theory",
        description: "Unlocks quantum gas harvesting technology.",
        cost: [{ resourceId: "minerals", amount: 400 }],
        effect: (state) => {
            const newState = { ...state };
            newState.ships.gasHarvester.isUnlocked = true;
            return newState;
        },
        isPurchased: false,
        unlocks: ["gasHarvester"],
        category: "unlock",
        tier: 2,
        icon: "🌌",
    },
    unlockTrade: {
        id: "unlockTrade",
        name: "Galactic Commerce License",
        description: "Permits construction of trade vessels.",
        cost: [
            { resourceId: "gas", amount: 300 },
            { resourceId: "credits", amount: 500 },
        ],
        effect: (state) => {
            const newState = { ...state };
            newState.ships.tradeVessel.isUnlocked = true;
            return newState;
        },
        isPurchased: false,
        unlocks: ["tradeVessel"],
        category: "unlock",
        tier: 2,
        icon: "📜",
    },
    antimatterUnlock: {
        id: "antimatterUnlock",
        name: "Antimatter Physics",
        description: "Breakthrough in antimatter containment and production.",
        cost: [
            { resourceId: "credits", amount: 10000 },
            { resourceId: "gas", amount: 2000 },
        ],
        effect: (state) => {
            const newState = { ...state };
            newState.ships.antimatterReactor.isUnlocked = true;
            return newState;
        },
        isPurchased: false,
        unlocks: ["antimatterReactor"],
        category: "unlock",
        tier: 3,
        icon: "⚛️",
    },
};

const INITIAL_SYSTEMS: Record<string, GalaxySystem> = {
    sol: {
        id: "sol",
        name: "Sol System",
        x: 50,
        y: 50,
        isExplored: true,
        description: "Your home system, birthplace of humanity.",
        explorationCost: 0,
        tier: 1,
        difficulty: 0,
    },
    alphaCentauri: {
        id: "alphaCentauri",
        name: "Alpha Centauri",
        x: 75,
        y: 65,
        isExplored: false,
        description: "Nearest star system with rich mineral deposits.",
        explorationCost: 200,
        rewards: [{ resourceId: "minerals", amount: 1000 }],
        tier: 1,
        difficulty: 1,
    },
    sirius: {
        id: "sirius",
        name: "Sirius Binary",
        x: 25,
        y: 85,
        isExplored: false,
        description: "Binary star system with lucrative trade routes.",
        explorationCost: 500,
        rewards: [{ resourceId: "credits", amount: 2000 }],
        tier: 2,
        difficulty: 2,
    },
    vega: {
        id: "vega",
        name: "Vega Nebula",
        x: 85,
        y: 25,
        isExplored: false,
        description: "Young star surrounded by quantum gas clouds.",
        explorationCost: 800,
        rewards: [{ resourceId: "gas", amount: 500 }],
        tier: 2,
        difficulty: 2,
        specialFeature: "Quantum Anomaly",
    },
    betelgeuse: {
        id: "betelgeuse",
        name: "Betelgeuse",
        x: 15,
        y: 40,
        isExplored: false,
        description: "Red supergiant with exotic matter signatures.",
        explorationCost: 2000,
        rewards: [{ resourceId: "antimatter", amount: 50 }],
        tier: 3,
        difficulty: 4,
        specialFeature: "Stellar Anomaly",
    },
    sagittariusA: {
        id: "sagittariusA",
        name: "Sagittarius A*",
        x: 90,
        y: 90,
        isExplored: false,
        description: "Supermassive black hole at the galactic center.",
        explorationCost: 10000,
        rewards: [{ resourceId: "darkMatter", amount: 25 }],
        tier: 4,
        difficulty: 10,
        specialFeature: "Gravitational Singularity",
    },
};

const INITIAL_ACHIEVEMENTS: Record<string, Achievement> = {
    firstSteps: {
        id: "firstSteps",
        name: "First Steps",
        description: "Build your second mining drone",
        isUnlocked: false,
        condition: (state) => state.ships.miningDrone.count >= 2,
        tier: "bronze",
        icon: "🥉",
        reward: [{ resourceId: "credits", amount: 100 }],
    },
    explorer: {
        id: "explorer",
        name: "Cosmic Explorer",
        description: "Explore your first alien system",
        isUnlocked: false,
        condition: (state) => Object.values(state.systems).some((s) => s.isExplored && s.id !== "sol"),
        tier: "silver",
        icon: "🥈",
        reward: [{ resourceId: "credits", amount: 500 }],
    },
    industrialist: {
        id: "industrialist",
        name: "Space Industrialist",
        description: "Command a fleet of 25 ships",
        isUnlocked: false,
        condition: (state) => Object.values(state.ships).reduce((total, ship) => total + ship.count, 0) >= 25,
        tier: "gold",
        icon: "🥇",
        reward: [{ resourceId: "gas", amount: 1000 }],
    },
    quantumPioneer: {
        id: "quantumPioneer",
        name: "Quantum Pioneer",
        description: "Produce 10,000 quantum gas",
        isUnlocked: false,
        condition: (state) => (state.totalResourcesGenerated.gas || 0) >= 10000,
        tier: "platinum",
        icon: "💎",
        reward: [{ resourceId: "antimatter", amount: 10 }],
    },
    cosmicEntity: {
        id: "cosmicEntity",
        name: "Cosmic Entity",
        description: "Reach the galactic center",
        isUnlocked: false,
        condition: (state) => state.systems.sagittariusA?.isExplored || false,
        tier: "cosmic",
        icon: "🌌",
        reward: [{ resourceId: "darkMatter", amount: 100 }],
    },
};

const INITIAL_GAME_STATE: GameState = {
    resources: INITIAL_RESOURCES,
    ships: INITIAL_SHIPS,
    upgrades: INITIAL_UPGRADES,
    systems: INITIAL_SYSTEMS,
    achievements: INITIAL_ACHIEVEMENTS,
    technologies: {},
    lastUpdate: Date.now(),
    isGalaxyMapOpen: false,
    resourceHistory: {
        minerals: [],
        gas: [],
        credits: [],
        antimatter: [],
        darkMatter: [],
    },
    gameStartTime: Date.now(),
    totalResourcesGenerated: {
        minerals: 0,
        gas: 0,
        credits: 0,
        antimatter: 0,
        darkMatter: 0,
    },
    prestigeLevel: 0,
    prestigePoints: 0,
    currentTab: "fleet",
    autoSaveEnabled: true,
    notifications: [],
};

// Enhanced Game Logic
// =================================================================================================

function gameReducer(state: GameState, action: GameAction): GameState {
    switch (action.type) {
        case "UPDATE_RESOURCES": {
            const newState = { ...state };
            const deltaTimeInSeconds = action.deltaTime / 1000;

            // Calculate perSecond with efficiency multipliers
            Object.values(newState.resources).forEach((res) => (res.perSecond = 0));

            Object.values(newState.ships).forEach((ship) => {
                if (ship.count > 0) {
                    ship.miningRate.forEach((rate) => {
                        if (newState.resources[rate.resourceId]) {
                            const efficiency = ship.efficiency * newState.resources[rate.resourceId].multiplier;
                            newState.resources[rate.resourceId].perSecond += rate.rate * ship.count * efficiency;
                        }
                    });
                }
            });

            // Update resource amounts with prestige bonuses
            Object.values(newState.resources).forEach((resource) => {
                const prestigeBonus = 1 + newState.prestigeLevel * 0.1;
                const generated = resource.perSecond * deltaTimeInSeconds * prestigeBonus;
                const newAmount = resource.amount + generated;
                resource.amount = Math.min(newAmount, resource.capacity);

                newState.totalResourcesGenerated[resource.id] = (newState.totalResourcesGenerated[resource.id] || 0) + generated;
            });

            newState.lastUpdate = Date.now();
            return newState;
        }

        case "PURCHASE_SHIP": {
            const shipToBuy = state.ships[action.shipId];
            if (!shipToBuy || !shipToBuy.isUnlocked) return state;

            const canAfford = shipToBuy.cost.every((cost) => state.resources[cost.resourceId]?.amount >= cost.amount);
            if (!canAfford) return state;

            const newState = { ...state };

            shipToBuy.cost.forEach((cost) => {
                newState.resources[cost.resourceId].amount -= cost.amount;
            });

            newState.ships[action.shipId] = {
                ...newState.ships[action.shipId],
                count: newState.ships[action.shipId].count + 1,
                cost: newState.ships[action.shipId].cost.map((c) => ({
                    ...c,
                    amount: Math.floor(c.amount * 1.15), // Exponential cost scaling
                })),
            };

            return newState;
        }

        case "PURCHASE_UPGRADE": {
            const upgradeToBuy = state.upgrades[action.upgradeId];
            if (!upgradeToBuy || upgradeToBuy.isPurchased) return state;

            const canAfford = upgradeToBuy.cost.every((cost) => state.resources[cost.resourceId]?.amount >= cost.amount);
            if (!canAfford) return state;

            let newState = { ...state };

            upgradeToBuy.cost.forEach((cost) => {
                newState.resources[cost.resourceId].amount -= cost.amount;
            });

            newState.upgrades[action.upgradeId] = {
                ...newState.upgrades[action.upgradeId],
                isPurchased: true,
            };
            newState = upgradeToBuy.effect(newState);

            return newState;
        }

        case "EXPLORE_SYSTEM": {
            const system = state.systems[action.systemId];
            if (!system || system.isExplored) return state;

            if (state.resources.credits.amount < system.explorationCost) return state;

            const newState = { ...state };
            newState.resources.credits.amount -= system.explorationCost;
            newState.systems[action.systemId] = {
                ...newState.systems[action.systemId],
                isExplored: true,
            };

            if (system.rewards) {
                system.rewards.forEach((reward) => {
                    if (newState.resources[reward.resourceId]) {
                        newState.resources[reward.resourceId].amount = Math.min(
                            newState.resources[reward.resourceId].capacity,
                            newState.resources[reward.resourceId].amount + reward.amount
                        );
                    }
                });
            }

            return newState;
        }

        case "TOGGLE_GALAXY_MAP":
            return { ...state, isGalaxyMapOpen: !state.isGalaxyMapOpen };

        case "SET_TAB":
            return { ...state, currentTab: action.tab };

        case "SET_RESOURCE_HISTORY": {
            const newHistory = [...(state.resourceHistory[action.resourceId] || [])];
            newHistory.push(action.value);
            if (newHistory.length > MAX_RESOURCE_HISTORY) {
                newHistory.shift();
            }
            return {
                ...state,
                resourceHistory: {
                    ...state.resourceHistory,
                    [action.resourceId]: newHistory,
                },
            };
        }

        case "CHECK_ACHIEVEMENTS": {
            const newState = { ...state };

            Object.values(newState.achievements).forEach((achievement) => {
                if (!achievement.isUnlocked && achievement.condition(newState)) {
                    achievement.isUnlocked = true;

                    // Add notification
                    const notification: Notification = {
                        id: `achievement-${achievement.id}-${Date.now()}`,
                        type: "achievement",
                        title: "Achievement Unlocked!",
                        message: achievement.name,
                        timestamp: Date.now(),
                        duration: 5000,
                    };

                    newState.notifications.push(notification);

                    // Apply rewards
                    if (achievement.reward) {
                        achievement.reward.forEach((reward) => {
                            if (newState.resources[reward.resourceId]) {
                                newState.resources[reward.resourceId].amount += reward.amount;
                            }
                        });
                    }
                }
            });

            return newState;
        }

        case "ADD_NOTIFICATION":
            return {
                ...state,
                notifications: [...state.notifications, action.notification],
            };

        case "REMOVE_NOTIFICATION":
            return {
                ...state,
                notifications: state.notifications.filter((n) => n.id !== action.id),
            };

        case "PRESTIGE_RESET": {
            const newState = {
                ...INITIAL_GAME_STATE,
                gameStartTime: Date.now(),
                lastUpdate: Date.now(),
                prestigeLevel: state.prestigeLevel + 1,
                prestigePoints: state.prestigePoints + Math.floor(Math.sqrt(state.totalResourcesGenerated.antimatter || 0)),
                achievements: state.achievements, // Keep achievements
            };
            return newState;
        }

        case "RESET_GAME":
            return {
                ...INITIAL_GAME_STATE,
                gameStartTime: Date.now(),
                lastUpdate: Date.now(),
            };

        default:
            return state;
    }
}

// Enhanced Helper Functions
// =================================================================================================

function formatNumber(num: number): string {
    if (num < 1000) return num.toFixed(1);
    if (num < 1000000) return (num / 1000).toFixed(2) + "K";
    if (num < 1000000000) return (num / 1000000).toFixed(2) + "M";
    if (num < 1000000000000) return (num / 1000000000).toFixed(2) + "B";
    return (num / 1000000000000).toFixed(2) + "T";
}

function formatTime(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
}

function getResourceColor(resourceId: string, resources: Record<string, Resource>): string {
    return resources[resourceId]?.color || "#ffffff";
}

// Enhanced React Components
// =================================================================================================

const GlobalStyles = () => (
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500;600;700&display=swap');
    
    :root {
      --bg-space: radial-gradient(ellipse at center, #0f0f23 0%, #050505 100%);
      --bg-nebula: radial-gradient(circle at 20% 80%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
                   radial-gradient(circle at 80% 20%, rgba(6, 214, 160, 0.15) 0%, transparent 50%),
                   radial-gradient(circle at 40% 40%, rgba(239, 71, 111, 0.1) 0%, transparent 50%);
      --glass: rgba(255, 255, 255, 0.03);
      --glass-border: rgba(255, 255, 255, 0.08);
      --glass-hover: rgba(255, 255, 255, 0.06);
      --text-primary: #ffffff;
      --text-secondary: #e2e8f0;
      --text-muted: #94a3b8;
      --accent-cyan: #06d6a0;
      --accent-purple: #a855f7;
      --accent-pink: #ef476f;
      --accent-orange: #ff6b35;
      --accent-blue: #4f46e5;
      --success: #10b981;
      --warning: #f59e0b;
      --error: #ef4444;
      --cosmic-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      --energy-gradient: linear-gradient(45deg, #ff6b35, #f7931e, #06d6a0);
      --void-gradient: linear-gradient(135deg, #1e1b4b, #312e81, #3730a3);
      --sidebar-width: 280px;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html, body {
      height: 100%;
      overflow-x: hidden;
    }

    body {
      font-family: 'Inter', sans-serif;
      background: var(--bg-space);
      color: var(--text-primary);
      line-height: 1.6;
      font-weight: 400;
    }

    #root {
      min-height: 100vh;
      position: relative;
    }

    /* Animated background with particles */
    .space-background {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: var(--bg-space);
      z-index: -2;
    }

    .space-background::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: var(--bg-nebula);
      animation: nebulaDrift 30s ease-in-out infinite;
    }

    .space-background::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: 
        radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.3), transparent),
        radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.2), transparent),
        radial-gradient(1px 1px at 90px 40px, rgba(255,255,255,0.4), transparent),
        radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.3), transparent),
        radial-gradient(2px 2px at 160px 30px, rgba(255,255,255,0.2), transparent);
      background-repeat: repeat;
      background-size: 200px 100px;
      animation: starfield 100s linear infinite;
    }

    @keyframes nebulaDrift {
      0%, 100% { opacity: 0.7; transform: translateX(0) scale(1); }
      33% { opacity: 1; transform: translateX(10px) scale(1.05); }
      66% { opacity: 0.8; transform: translateX(-5px) scale(0.95); }
    }

    @keyframes starfield {
      from { transform: translateY(0); }
      to { transform: translateY(-100px); }
    }

    /* Sidebar styles - MOBILE ONLY */
    .sidebar {
      position: fixed;
      top: 0;
      left: 0;
      width: var(--sidebar-width);
      height: 100vh;
      background: var(--glass);
      backdrop-filter: blur(25px) saturate(180%);
      border-right: 1px solid var(--glass-border);
      z-index: 1000;
      transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      overflow-y: auto;
      padding: 1.5rem;
      box-shadow: 4px 0 20px rgba(0, 0, 0, 0.3);
    }

    .sidebar.closed {
      transform: translateX(-100%);
    }

    .sidebar:not(.closed) {
      transform: translateX(0);
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--glass-border);
    }

    .sidebar-brand {
      font-family: 'Orbitron', monospace;
      font-size: 1.5rem;
      font-weight: 700;
      background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .sidebar-close {
      background: none;
      border: none;
      color: var(--text-secondary);
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .sidebar-close:hover {
      background: var(--glass-hover);
      color: var(--text-primary);
    }

    .sidebar-nav {
      list-style: none;
      margin-bottom: 2rem;
    }

    .sidebar-nav-item {
      margin-bottom: 0.5rem;
    }

    .sidebar-nav-link {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border-radius: 12px;
      text-decoration: none;
      color: var(--text-secondary);
      transition: all 0.3s ease;
      cursor: pointer;
      border: 1px solid transparent;
      font-weight: 500;
    }

    .sidebar-nav-link:hover {
      background: var(--glass-hover);
      color: var(--text-primary);
      border-color: var(--glass-border);
      transform: translateX(4px);
    }

    .sidebar-nav-link.active {
      background: linear-gradient(135deg, var(--accent-cyan)20, var(--accent-purple)20);
      color: var(--accent-cyan);
      border-color: var(--accent-cyan)50;
    }

    .sidebar-nav-icon {
      font-size: 1.2rem;
      min-width: 24px;
    }

    .sidebar-actions {
      border-top: 1px solid var(--glass-border);
      padding-top: 1.5rem;
    }

    .sidebar-action {
      width: 100%;
      margin-bottom: 1rem;
      justify-content: flex-start;
      gap: 1rem;
      padding: 1rem;
      font-size: 0.95rem;
    }

    .sidebar-action span {
      margin-right: 0.5rem;
    }

    /* Hamburger menu - MOBILE ONLY */
    .hamburger {
      position: fixed;
      top: 1.5rem;
      left: 1.5rem;
      z-index: 1001;
      background: var(--glass);
      backdrop-filter: blur(15px);
      border: 1px solid var(--glass-border);
      border-radius: 12px;
      padding: 0.75rem;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      display: none; /* Hidden by default on desktop */
    }

    .hamburger:hover {
      background: var(--glass-hover);
      border-color: var(--accent-cyan);
      box-shadow: 0 4px 20px rgba(6, 214, 160, 0.3);
    }

    .hamburger-icon {
      width: 24px;
      height: 24px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .hamburger-line {
      width: 100%;
      height: 3px;
      background: var(--accent-cyan);
      border-radius: 2px;
      transition: all 0.3s ease;
    }

    .hamburger.open .hamburger-line:first-child {
      transform: rotate(45deg) translate(6px, 6px);
    }

    .hamburger.open .hamburger-line:nth-child(2) {
      opacity: 0;
    }

    .hamburger.open .hamburger-line:last-child {
      transform: rotate(-45deg) translate(8px, -8px);
    }

    /* Sidebar overlay for mobile */
    .sidebar-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      z-index: 999;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }

    .sidebar-overlay.visible {
      opacity: 1;
      visibility: visible;
    }

    /* Main app layout - DESKTOP LAYOUT RESTORED */
    .app {
      display: flex;
      min-height: 100vh;
      padding: 1rem;
      gap: 1.5rem;
      position: relative;
      z-index: 1;
      margin-left: 0; /* No margin on desktop */
    }

    .app.sidebar-closed {
      margin-left: 0;
    }

    /* Enhanced glass panels */
    .panel {
      background: var(--glass);
      backdrop-filter: blur(25px) saturate(180%);
      border: 1px solid var(--glass-border);
      border-radius: 24px;
      padding: 2rem;
      box-shadow: 
        0 8px 32px rgba(0, 0, 0, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.1),
        0 0 0 1px rgba(255, 255, 255, 0.05);
      transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      overflow-y: auto;
      max-height: calc(100vh - 2rem);
      position: relative;
    }

    .panel::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    }

    .panel:hover {
      background: var(--glass-hover);
      border-color: rgba(255, 255, 255, 0.15);
      box-shadow: 
        0 12px 40px rgba(0, 0, 0, 0.5),
        inset 0 1px 0 rgba(255, 255, 255, 0.15),
        0 0 0 1px rgba(255, 255, 255, 0.08);
      transform: translateY(-2px);
    }

    .resource-panel {
      flex: 1;
      min-width: 350px;
    }

    .actions-panel {
      flex: 2;
      min-width: 600px;
    }

    /* Typography */
    h1, h2, h3, h4 {
      font-family: 'Orbitron', monospace;
      font-weight: 700;
      margin-bottom: 1.5rem;
    }

    h1 {
      font-size: 2.75rem;
      background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 0 40px rgba(6, 214, 160, 0.5);
      animation: titleGlow 3s ease-in-out infinite alternate;
    }

    h2 {
      font-size: 2rem;
      color: var(--accent-cyan);
      text-shadow: 0 0 20px rgba(6, 214, 160, 0.3);
    }

    h3 {
      font-size: 1.5rem;
      color: var(--text-secondary);
    }

    h4 {
      font-size: 1.25rem;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }

    @keyframes titleGlow {
      from { text-shadow: 0 0 40px rgba(6, 214, 160, 0.5); }
      to { text-shadow: 0 0 60px rgba(168, 85, 247, 0.7), 0 0 80px rgba(6, 214, 160, 0.3); }
    }

    /* Enhanced buttons */
    .btn {
      position: relative;
      padding: 0.875rem 1.75rem;
      border: none;
      border-radius: 16px;
      font-family: 'Inter', sans-serif;
      font-weight: 600;
      font-size: 0.95rem;
      color: white;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      overflow: hidden;
      background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));
      box-shadow: 
        0 4px 15px rgba(6, 214, 160, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }


    .btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transition: left 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .btn:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 
        0 8px 25px rgba(6, 214, 160, 0.4),
        0 0 0 1px rgba(255, 255, 255, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
    }

    .btn:hover::before {
      left: 100%;
    }

    .btn:active {
      transform: translateY(-1px) scale(0.98);
    }

    .btn:disabled {
      background: linear-gradient(135deg, rgba(100, 116, 139, 0.5), rgba(71, 85, 105, 0.5));
      color: var(--text-muted);
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .btn:disabled::before {
      display: none;
    }

    .btn-secondary {
      background: linear-gradient(135deg, var(--accent-purple), var(--accent-pink));
      box-shadow: 0 4px 15px rgba(168, 85, 247, 0.3);
    }

    .btn-secondary:hover {
      box-shadow: 0 8px 25px rgba(168, 85, 247, 0.4);
    }

    .btn-danger {
      background: linear-gradient(135deg, var(--error), var(--accent-orange));
      box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
    }

    .btn-danger:hover {
      box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
    }

    .btn-cosmic {
      background: var(--cosmic-gradient);
      box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
      animation: cosmicPulse 2s ease-in-out infinite alternate;
    }

    @keyframes cosmicPulse {
      from { box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4); }
      to { box-shadow: 0 6px 30px rgba(118, 75, 162, 0.6); }
    }

    /* Enhanced cards */
    .card {
      background: linear-gradient(135deg, var(--glass), rgba(255, 255, 255, 0.05));
      backdrop-filter: blur(15px);
      border: 1px solid var(--glass-border);
      border-radius: 20px;
      padding: 1.75rem;
      margin-bottom: 1.5rem;
      transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      position: relative;
      overflow: hidden;
    }

    .card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
      opacity: 0.7;
    }

    .card:hover {
      transform: translateY(-6px) scale(1.02);
      background: linear-gradient(135deg, var(--glass-hover), rgba(255, 255, 255, 0.08));
      border-color: rgba(255, 255, 255, 0.2);
      box-shadow: 
        0 20px 40px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }

    /* Resource cards with dynamic colors */
    .resource-card {
      border-left: 4px solid var(--accent-cyan);
      background: linear-gradient(135deg, 
        rgba(6, 214, 160, 0.05), 
        rgba(6, 214, 160, 0.02)
      );
    }

    .ship-card {
      border-left: 4px solid var(--accent-purple);
      background: linear-gradient(135deg, 
        rgba(168, 85, 247, 0.05), 
        rgba(168, 85, 247, 0.02)
      );
    }

    .upgrade-card {
      border-left: 4px solid var(--accent-orange);
      background: linear-gradient(135deg, 
        rgba(255, 107, 53, 0.05), 
        rgba(255, 107, 53, 0.02)
      );
    }

    /* Resource display enhancements */
    .resource-amount {
      font-family: 'Orbitron', monospace;
      font-size: 1.75rem;
      font-weight: 900;
      background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 0 20px rgba(6, 214, 160, 0.5);
      margin: 0.5rem 0;
    }

    .resource-rate {
      color: var(--success);
      font-weight: 600;
      font-size: 1rem;
      text-shadow: 0 0 10px rgba(16, 185, 129, 0.3);
    }

    /* Enhanced progress bars */
    .progress-container {
      position: relative;
      width: 100%;
      height: 12px;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 8px;
      overflow: hidden;
      margin: 1rem 0;
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, var(--accent-cyan), var(--accent-purple));
      border-radius: 8px;
      transition: width 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      position: relative;
      overflow: hidden;
    }

    .progress-bar::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      animation: progressShine 2s infinite;
    }

    @keyframes progressShine {
      0% { left: -100%; }
      100% { left: 100%; }
    }

    /* Tab system - RESTORED FOR DESKTOP */
    .tab-container {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 2rem;
      padding: 0.5rem;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 16px;
      backdrop-filter: blur(10px);
    }

    .tab {
      flex: 1;
      padding: 1rem 1.5rem;
      border: none;
      border-radius: 12px;
      background: transparent;
      color: var(--text-muted);
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
    }

    .tab.active {
      background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));
      color: white;
      box-shadow: 0 4px 15px rgba(6, 214, 160, 0.3);
    }

    .tab:hover:not(.active) {
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-secondary);
    }

    /* Statistics grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: linear-gradient(135deg, var(--glass), rgba(255, 255, 255, 0.05));
      border: 1px solid var(--glass-border);
      border-radius: 16px;
      padding: 1.5rem;
      text-align: center;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
    }

    .stat-value {
      font-family: 'Orbitron', monospace;
      font-size: 2rem;
      font-weight: 700;
      background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      color: var(--text-muted);
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Galaxy map enhancements */
    .galaxy-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(20px);
      z-index: 1000;
      display: flex;
      flex-direction: column;
      padding: 2rem;
    }

    .galaxy-content {
      flex: 1;
      background: var(--glass);
      border: 1px solid var(--glass-border);
      border-radius: 24px;
      overflow: hidden;
      position: relative;
    }

    .galaxy-svg {
      width: 100%;
      height: 100%;
      cursor: grab;
      background: radial-gradient(circle at center, #0a0a1a 0%, #000000 100%);
    }

    .galaxy-svg:active {
      cursor: grabbing;
    }

    .system-node {
      cursor: pointer;
      transition: all 0.3s ease;
      filter: drop-shadow(0 0 5px currentColor);
    }

    .system-node:hover {
      transform: scale(1.3);
      filter: drop-shadow(0 0 15px currentColor) brightness(1.5);
    }

    /* Notification system */
    .notification-container {
      position: fixed;
      top: 2rem;
      right: 2rem;
      z-index: 2000;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-width: 400px;
    }

    .notification {
      background: linear-gradient(135deg, var(--glass), rgba(255, 255, 255, 0.1));
      backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border);
      border-radius: 16px;
      padding: 1.5rem;
      color: white;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      animation: slideInRight 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      position: relative;
      overflow: hidden;
    }

    .notification::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--accent-cyan), var(--accent-purple));
    }

    .notification.achievement {
      border-left: 4px solid var(--warning);
    }

    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    /* Loading and transition effects */
    .fade-in {
      animation: fadeIn 0.5s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }

    /* Chart animations */
    @keyframes drawLine {
      from { stroke-dasharray: 1000; stroke-dashoffset: 1000; }
      to { stroke-dasharray: 1000; stroke-dashoffset: 0; }
    }

    /* Special effects for high-tier content */
    .tier-cosmic {
      position: relative;
      overflow: hidden;
    }
    
    .close-x {
      margin-right: 0.5rem;
    }

    .tier-cosmic::after {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: conic-gradient(from 0deg, transparent, rgba(168, 85, 247, 0.1), transparent);
      animation: rotate 4s linear infinite;
    }

    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* Responsive design - MOBILE ONLY CHANGES */
    @media (max-width: 1024px) {
      .app {
        flex-direction: column;
        gap: 1rem;
        margin-left: 0;
      }
      
      /* Show sidebar and hamburger on mobile */
      .hamburger {
        display: block;
      }

      /* Hide desktop tabs on mobile */
      .tab-container {
        display: none;
      }

      /* Hide desktop action buttons on mobile */
      .desktop-actions {
        display: none !important;
      }
      
      .panel {
        min-width: unset;
        max-height: none;
      }
      
      .stats-grid {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      }
    }

    @media (max-width: 768px) {
      .app {
        padding: 0.5rem;
      }
      
      .panel {
        padding: 1.5rem;
        border-radius: 16px;
      }
      
      h1 { font-size: 2rem; }
      h2 { font-size: 1.5rem; }
      
      .galaxy-overlay {
        padding: 1rem;
      }
      
      .notification-container {
        top: 1rem;
        right: 1rem;
        left: 1rem;
        max-width: none;
      }

      .hamburger {
        top: 1rem;
        left: 1rem;
      }

      /* Mobile-specific resource card text sizing */
      .resource-amount {
        font-size: 1.2rem !important;
      }

      .stat-value {
        font-size: 1.4rem !important;
      }

      h3 {
        font-size: 1.1rem !important;
      }

      .resource-rate {
        font-size: 0.8rem !important;
      }

      /* Mobile-specific content sizing for tabs */
      .actions-panel h3 {
        font-size: 1rem !important;
      }

      .actions-panel h4 {
        font-size: 0.95rem !important;
      }

      .actions-panel p {
        font-size: 0.85rem !important;
      }

      .actions-panel .card {
        padding: 1.25rem !important;
      }

      .actions-panel .card h3 {
        font-size: 0.9rem !important;
      }

      .actions-panel .card p {
        font-size: 0.8rem !important;
      }

      .actions-panel .card div {
        font-size: 0.8rem !important;
      }

      .actions-panel .btn {
        font-size: 0.85rem !important;
        padding: 0.75rem 1.25rem !important;
      }

      /* Specific adjustments for different sections */
      .ship-card h3,
      .upgrade-card h3 {
        font-size: 0.9rem !important;
      }

      .ship-card p,
      .upgrade-card p {
        font-size: 0.75rem !important;
      }

      /* Achievement cards specific sizing */
      .achievements-tab .card h4 {
        font-size: 0.85rem !important;
      }

      .achievements-tab .card p {
        font-size: 0.75rem !important;
      }

      /* Prestige section specific sizing */
      .prestige-tab h2 {
        font-size: 1.5rem !important;
      }

      .prestige-tab p {
        font-size: 0.8rem !important;
      }
    }

    /* Custom scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
    }

    ::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.2);
      border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));
      border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(135deg, var(--accent-purple), var(--accent-cyan));
    }

    /* Galaxy map mobile controls */
    .nav-controls-mobile {
      display: none;
    }

    .nav-controls-desktop {
      display: inline;
    }

    @media (max-width: 768px) {
      .nav-controls-mobile {
        display: block;
      }

      .nav-controls-desktop {
        display: none;
      }

      .close-text {
        display: none;
      }

      .close-x {
        margin: 0;
      }
    }
  `}</style>
);

// Sidebar Component
const Sidebar: React.FC<{
    isOpen: boolean;
    currentTab: string;
    onTabChange: (tab: "fleet" | "research" | "prestige" | "achievements") => void;
    onToggleGalaxyMap: () => void;
    onResetGame: () => void;
    onClose: () => void;
}> = ({ isOpen, currentTab, onTabChange, onToggleGalaxyMap, onResetGame, onClose }) => {
    const navigationItems = [
        { id: "fleet", label: "Fleet Management", icon: "🚀" },
        { id: "research", label: "Research Lab", icon: "🔬" },
        { id: "prestige", label: "Prestige System", icon: "⭐" },
        { id: "achievements", label: "Achievements", icon: "🏆" },
    ];

    return (
        <>
            <div className={`sidebar-overlay ${isOpen ? "visible" : ""}`} onClick={onClose} />

            <nav className={`sidebar ${!isOpen ? "closed" : ""}`}>
                <div className="sidebar-header">
                    <div className="sidebar-brand">⭐ COSMOS</div>
                </div>

                <ul className="sidebar-nav">
                    {navigationItems.map((item) => (
                        <li key={item.id} className="sidebar-nav-item">
                            <div
                                className={`sidebar-nav-link cursor-pointer ${currentTab === item.id ? "active" : ""}`}
                                onClick={() => {
                                    onTabChange(item.id as any);
                                    if (window.innerWidth <= 1024) onClose();
                                }}
                            >
                                <span className="sidebar-nav-icon">{item.icon}</span>
                                <span>{item.label}</span>
                            </div>
                        </li>
                    ))}
                </ul>

                <div className="sidebar-actions">
                    <button
                        className="btn sidebar-action cursor-pointer"
                        onClick={() => {
                            onToggleGalaxyMap();
                            if (window.innerWidth <= 1024) onClose();
                        }}
                    >
                        <span>🌌</span>
                        <span>Galaxy Map</span>
                    </button>

                    <button
                        className="btn btn-danger sidebar-action cursor-pointer"
                        onClick={() => {
                            onResetGame();
                            if (window.innerWidth <= 1024) onClose();
                        }}
                    >
                        <span>🔄</span>
                        <span>Reset Empire</span>
                    </button>
                </div>
            </nav>
        </>
    );
};

// Hamburger Menu Component
const HamburgerMenu: React.FC<{
    isOpen: boolean;
    onToggle: () => void;
}> = ({ isOpen, onToggle }) => {
    return (
        <button className={`hamburger ${isOpen ? "open" : ""}`} onClick={onToggle}>
            <div className="hamburger-icon">
                <div className="hamburger-line"></div>
                <div className="hamburger-line"></div>
                <div className="hamburger-line"></div>
            </div>
        </button>
    );
};

// Enhanced Resource Panel Component
const ResourcePanel: React.FC<{
    resources: Record<string, Resource>;
    resourceHistory: Record<string, number[]>;
    gameTime: number;
    totalGenerated: Record<string, number>;
    prestigeLevel: number;
}> = ({ resources, resourceHistory, gameTime, totalGenerated, prestigeLevel }) => {
    const activeResources = Object.values(resources)
        .filter((res) => res.amount > 0 || res.perSecond > 0)
        .sort((a, b) => a.tier - b.tier);

    return (
        <div className="panel resource-panel fade-in">
            <h2>🌌 Command Center</h2>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-value">{formatTime(gameTime)}</div>
                    <div className="stat-label">Mission Time</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">
                        {Object.values(resources)
                            .reduce((sum, r) => sum + r.perSecond, 0)
                            .toFixed(1)}
                    </div>
                    <div className="stat-label">Total Production/s</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{prestigeLevel}</div>
                    <div className="stat-label">Prestige Level</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">
                        {Object.values(totalGenerated)
                            .reduce((sum, val) => sum + val, 0)
                            .toFixed(0)}
                    </div>
                    <div className="stat-label">Total Generated</div>
                </div>
            </div>

            {activeResources.map((resource) => {
                const fillPercentage = (resource.amount / resource.capacity) * 100;
                const isNearlFull = fillPercentage > 90;
                const history = resourceHistory[resource.id] || [];

                // Prepare chart data for recharts
                const chartData = history.map((value, index) => ({
                    index,
                    value: value,
                }));

                return (
                    <div
                        key={resource.id}
                        className={`card resource-card ${resource.tier >= 4 ? "tier-cosmic" : ""}`}
                        style={{
                            borderLeftColor: resource.color,
                            background: `linear-gradient(135deg, ${resource.color}08, ${resource.color}02)`,
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
                            <span
                                style={{
                                    fontSize: "2rem",
                                    marginRight: "1rem",
                                    filter: `drop-shadow(0 0 10px ${resource.color})`,
                                    animation: resource.tier >= 3 ? "pulse 2s infinite" : undefined,
                                }}
                            >
                                {resource.icon}
                            </span>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ margin: 0, fontSize: "1.2rem", color: resource.color }}>{resource.name}</h3>
                                <div
                                    className="resource-amount"
                                    style={{
                                        background: `linear-gradient(135deg, ${resource.color}, ${resource.color}aa)`,
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                    }}
                                >
                                    {formatNumber(resource.amount)} / {formatNumber(resource.capacity)}
                                </div>
                            </div>
                        </div>

                        {chartData.length > 1 && (
                            <div
                                style={{
                                    height: "80px",
                                    marginBottom: "1rem",
                                    background: "rgba(0, 0, 0, 0.2)",
                                    borderRadius: "8px",
                                    padding: "0.5rem",
                                }}
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData}>
                                        <YAxis hide />
                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            stroke={resource.color}
                                            strokeWidth={2}
                                            dot={false}
                                            activeDot={{ r: 4, fill: resource.color }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        <div className="progress-container">
                            <div
                                className="progress-bar"
                                style={{
                                    width: `${fillPercentage}%`,
                                    background: `linear-gradient(90deg, ${resource.color}, ${resource.color}cc)`,
                                    boxShadow: isNearlFull ? `0 0 15px ${resource.color}` : undefined,
                                }}
                            />
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span className="resource-rate" style={{ color: resource.color }}>
                                +{formatNumber(resource.perSecond)}/s
                            </span>
                            <div style={{ textAlign: "right", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                                <div>Tier {resource.tier}</div>
                                <div>Total: {formatNumber(totalGenerated[resource.id] || 0)}</div>
                            </div>
                        </div>

                        {isNearlFull && (
                            <div
                                style={{
                                    marginTop: "0.5rem",
                                    padding: "0.5rem",
                                    background: "rgba(245, 158, 11, 0.1)",
                                    borderRadius: "8px",
                                    border: "1px solid rgba(245, 158, 11, 0.3)",
                                    color: "var(--warning)",
                                    fontSize: "0.85rem",
                                    textAlign: "center",
                                }}
                            >
                                ⚠️ Storage Nearly Full
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

// Enhanced Tab System - RESTORED FOR DESKTOP
const TabSystem: React.FC<{
    currentTab: string;
    onTabChange: (tab: "fleet" | "research" | "prestige" | "achievements") => void;
}> = ({ currentTab, onTabChange }) => {
    const tabs = [
        { id: "fleet", label: "🚀 Fleet", icon: "🚀" },
        { id: "research", label: "🔬 Research", icon: "🔬" },
        { id: "prestige", label: "⭐ Prestige", icon: "⭐" },
        { id: "achievements", label: "🏆 Achievements", icon: "🏆" },
    ];

    return (
        <div className="tab-container">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={`tab cursor-pointer ${currentTab === tab.id ? "active" : ""}`}
                    onClick={() => onTabChange(tab.id as any)}
                >
                    <span style={{ marginRight: "0.5rem" }}>{tab.icon}</span>
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

// Enhanced Actions Panel
const ActionsPanel: React.FC<{
    ships: Record<string, Ship>;
    upgrades: Record<string, Upgrade>;
    resources: Record<string, Resource>;
    achievements: Record<string, Achievement>;
    currentTab: string;
    dispatch: React.Dispatch<GameAction>;
    onToggleGalaxyMap: () => void;
    onResetGame: () => void;
}> = ({ ships, upgrades, resources, achievements, currentTab, dispatch, onToggleGalaxyMap, onResetGame }) => {
    const canAfford = (costs: { resourceId: string; amount: number }[]) => {
        return costs.every((cost) => resources[cost.resourceId]?.amount >= cost.amount);
    };

    const unlockedAchievements = Object.values(achievements).filter((a) => a.isUnlocked);
    const totalShips = Object.values(ships).reduce((sum, ship) => sum + ship.count, 0);

    const renderFleetTab = () => (
        <div className="fade-in">
            <div style={{ marginBottom: "2rem" }}>
                <h3>🛸 Active Fleet: {totalShips} ships</h3>
                <p style={{ color: "var(--text-muted)" }}>Manage your space fleet and expand your operations across the galaxy</p>
            </div>

            {Object.values(ships)
                .filter((ship) => ship.isUnlocked)
                .sort((a, b) => a.tier - b.tier)
                .map((ship) => {
                    const affordable = canAfford(ship.cost);
                    const totalProduction = ship.miningRate.reduce((sum, rate) => {
                        return sum + rate.rate * ship.count * ship.efficiency;
                    }, 0);

                    return (
                        <div key={ship.id} className={`card ship-card ${ship.tier >= 4 ? "tier-cosmic" : ""}`}>
                            <div style={{ display: "flex", alignItems: "center", marginBottom: "1.5rem" }}>
                                <span
                                    style={{
                                        fontSize: "3rem",
                                        marginRight: "1.5rem",
                                        filter:
                                            ship.tier >= 3
                                                ? `drop-shadow(0 0 15px ${getResourceColor(ship.miningRate[0]?.resourceId, resources)})`
                                                : undefined,
                                        animation: ship.tier >= 4 ? "pulse 2s infinite" : undefined,
                                    }}
                                >
                                    {ship.icon}
                                </span>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                        {ship.name}
                                        <span
                                            style={{
                                                background: "var(--cosmic-gradient)",
                                                color: "white",
                                                fontSize: "0.7rem",
                                                padding: "0.2rem 0.5rem",
                                                borderRadius: "12px",
                                                fontWeight: "600",
                                            }}
                                        >
                                            Tier {ship.tier}
                                        </span>
                                    </h3>
                                    <div style={{ color: "var(--text-secondary)", fontSize: "1.1rem", marginTop: "0.5rem" }}>
                                        Fleet Size: <span style={{ color: "var(--accent-cyan)", fontWeight: "700" }}>{ship.count}</span>
                                    </div>
                                </div>
                            </div>

                            <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", lineHeight: "1.6" }}>
                                {ship.description}
                                {ship.specialAbility && (
                                    <span
                                        style={{
                                            display: "block",
                                            marginTop: "0.5rem",
                                            color: "var(--accent-purple)",
                                            fontStyle: "italic",
                                            fontSize: "0.9rem",
                                        }}
                                    >
                                        ✨ {ship.specialAbility}
                                    </span>
                                )}
                            </p>

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: "1rem",
                                    marginBottom: "1.5rem",
                                    padding: "1rem",
                                    background: "rgba(0, 0, 0, 0.2)",
                                    borderRadius: "12px",
                                }}
                            >
                                <div>
                                    <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                                        Production Rate
                                    </div>
                                    <div style={{ fontWeight: "600", color: "var(--success)" }}>
                                        {ship.miningRate
                                            .map((r) => `${formatNumber(r.rate * ship.efficiency)}/s ${resources[r.resourceId]?.name}`)
                                            .join(" + ")}
                                    </div>
                                    {ship.count > 0 && (
                                        <div style={{ fontSize: "0.8rem", color: "var(--accent-cyan)", marginTop: "0.2rem" }}>
                                            Total: {formatNumber(totalProduction)}/s
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                                        Construction Cost
                                    </div>
                                    <div style={{ fontWeight: "600" }}>
                                        {ship.cost.map((c) => {
                                            const hasEnough = resources[c.resourceId]?.amount >= c.amount;
                                            return (
                                                <div
                                                    key={c.resourceId}
                                                    style={{
                                                        color: hasEnough ? "var(--text-secondary)" : "var(--error)",
                                                        fontSize: "0.9rem",
                                                    }}
                                                >
                                                    {formatNumber(c.amount)} {resources[c.resourceId]?.name}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <button
                                className={`btn ${ship.tier >= 3 ? "btn-cosmic" : ""} cursor-pointer`}
                                onClick={() => dispatch({ type: "PURCHASE_SHIP", shipId: ship.id })}
                                disabled={!affordable}
                                style={{ width: "100%", fontSize: "1rem", padding: "1rem" }}
                            >
                                {affordable ? "🔨 Construct Ship" : "❌ Insufficient Resources"}
                            </button>
                        </div>
                    );
                })}
        </div>
    );

    const renderResearchTab = () => (
        <div className="fade-in">
            <div style={{ marginBottom: "2rem" }}>
                <h3>🔬 Research & Development</h3>
                <p style={{ color: "var(--text-muted)" }}>Unlock new technologies and enhance your capabilities</p>
            </div>

            {Object.values(upgrades)
                .filter((upgrade) => !upgrade.isPurchased)
                .sort((a, b) => a.tier - b.tier)
                .map((upgrade) => {
                    const affordable = canAfford(upgrade.cost);

                    return (
                        <div key={upgrade.id} className={`card upgrade-card ${upgrade.tier >= 4 ? "tier-cosmic" : ""}`}>
                            <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
                                <span
                                    style={{
                                        fontSize: "2.5rem",
                                        marginRight: "1rem",
                                        filter: upgrade.tier >= 3 ? "drop-shadow(0 0 10px var(--accent-orange))" : undefined,
                                    }}
                                >
                                    {upgrade.icon}
                                </span>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                        {upgrade.name}
                                        <span
                                            style={{
                                                background: getCategoryColor(upgrade.category),
                                                color: "white",
                                                fontSize: "0.7rem",
                                                padding: "0.2rem 0.5rem",
                                                borderRadius: "12px",
                                                fontWeight: "600",
                                                textTransform: "uppercase",
                                            }}
                                        >
                                            {upgrade.category}
                                        </span>
                                    </h3>
                                </div>
                            </div>

                            <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", lineHeight: "1.6" }}>
                                {upgrade.description}
                            </p>

                            <div
                                style={{
                                    padding: "1rem",
                                    background: "rgba(0, 0, 0, 0.2)",
                                    borderRadius: "12px",
                                    marginBottom: "1.5rem",
                                }}
                            >
                                <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>Research Cost</div>
                                <div>
                                    {upgrade.cost.map((c) => {
                                        const hasEnough = resources[c.resourceId]?.amount >= c.amount;
                                        return (
                                            <div
                                                key={c.resourceId}
                                                style={{
                                                    color: hasEnough ? "var(--text-secondary)" : "var(--error)",
                                                    fontWeight: "600",
                                                    marginBottom: "0.2rem",
                                                }}
                                            >
                                                {formatNumber(c.amount)} {resources[c.resourceId]?.name}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <button
                                className={`btn btn-secondary cursor-pointer ${upgrade.tier >= 3 ? "btn-cosmic" : ""}`}
                                onClick={() => dispatch({ type: "PURCHASE_UPGRADE", upgradeId: upgrade.id })}
                                disabled={!affordable}
                                style={{ width: "100%", fontSize: "1rem", padding: "1rem" }}
                            >
                                {affordable ? "🧪 Research Technology" : "❌ Insufficient Resources"}
                            </button>
                        </div>
                    );
                })}
        </div>
    );

    const renderAchievementsTab = () => (
        <div className="fade-in">
            <div style={{ marginBottom: "2rem" }}>
                <h3>
                    🏆 Achievements ({unlockedAchievements.length}/{Object.keys(achievements).length})
                </h3>
                <p style={{ color: "var(--text-muted)" }}>Track your progress and unlock cosmic rewards</p>
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "1rem",
                }}
            >
                {Object.values(achievements).map((achievement) => (
                    <div
                        key={achievement.id}
                        className={`card ${achievement.isUnlocked ? "tier-cosmic" : ""}`}
                        style={{
                            borderLeft: `4px solid ${getTierColor(achievement.tier)}`,
                            opacity: achievement.isUnlocked ? 1 : 0.6,
                            background: achievement.isUnlocked
                                ? `linear-gradient(135deg, ${getTierColor(achievement.tier)}15, ${getTierColor(achievement.tier)}05)`
                                : undefined,
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
                            <span
                                style={{
                                    fontSize: "2.5rem",
                                    marginRight: "1rem",
                                    filter: achievement.isUnlocked
                                        ? `drop-shadow(0 0 15px ${getTierColor(achievement.tier)})`
                                        : "grayscale(1)",
                                    animation: achievement.isUnlocked && achievement.tier === "cosmic" ? "pulse 2s infinite" : undefined,
                                }}
                            >
                                {achievement.icon}
                            </span>
                            <div style={{ flex: 1 }}>
                                <h4
                                    style={{
                                        margin: 0,
                                        color: achievement.isUnlocked ? getTierColor(achievement.tier) : "var(--text-muted)",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.5rem",
                                    }}
                                >
                                    {achievement.name}
                                    <span
                                        style={{
                                            background: getTierColor(achievement.tier),
                                            color: "white",
                                            fontSize: "0.6rem",
                                            padding: "0.2rem 0.4rem",
                                            borderRadius: "8px",
                                            fontWeight: "600",
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        {achievement.tier}
                                    </span>
                                </h4>
                                {achievement.isUnlocked && (
                                    <div style={{ fontSize: "0.8rem", color: "var(--success)", marginTop: "0.2rem" }}>✅ Unlocked</div>
                                )}
                            </div>
                        </div>

                        <p
                            style={{
                                color: achievement.isUnlocked ? "var(--text-secondary)" : "var(--text-muted)",
                                marginBottom: achievement.reward ? "1rem" : "0",
                                lineHeight: "1.5",
                            }}
                        >
                            {achievement.description}
                        </p>

                        {achievement.reward && achievement.isUnlocked && (
                            <div
                                style={{
                                    padding: "0.75rem",
                                    background: "rgba(16, 185, 129, 0.1)",
                                    borderRadius: "8px",
                                    border: "1px solid rgba(16, 185, 129, 0.3)",
                                }}
                            >
                                <div style={{ fontSize: "0.8rem", color: "var(--success)", fontWeight: "600" }}>
                                    Reward:{" "}
                                    {achievement.reward.map((r) => `${formatNumber(r.amount)} ${resources[r.resourceId]?.name}`).join(", ")}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    const renderPrestigeTab = () => (
        <div className="fade-in">
            <div style={{ marginBottom: "2rem" }}>
                <h3>⭐ Prestige System</h3>
                <p style={{ color: "var(--text-muted)" }}>Reset your progress to gain permanent bonuses and unlock new dimensions</p>
            </div>

            <div className="card tier-cosmic" style={{ textAlign: "center", marginBottom: "2rem" }}>
                <h2 style={{ margin: "0 0 1rem 0", color: "var(--accent-purple)" }}>🌌 Cosmic Ascension</h2>
                <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
                    Transcend your current reality to unlock greater power. Each prestige level increases all production by 10%.
                </p>

                <div
                    style={{
                        background: "rgba(0, 0, 0, 0.3)",
                        borderRadius: "16px",
                        padding: "2rem",
                        marginBottom: "2rem",
                    }}
                >
                    <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                        Antimatter Required for Next Prestige
                    </div>
                    <div style={{ fontSize: "2rem", fontWeight: "700", color: "var(--accent-pink)" }}>
                        {formatNumber(Math.pow(10, 6))} Antimatter
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
                        Current: {formatNumber(resources.antimatter?.amount || 0)}
                    </div>
                </div>

                <button
                    className="btn btn-cosmic cursor-pointer"
                    disabled={(resources.antimatter?.amount || 0) < Math.pow(10, 6)}
                    onClick={() => dispatch({ type: "PRESTIGE_RESET" })}
                    style={{ fontSize: "1.2rem", padding: "1.5rem 3rem" }}
                >
                    🌟 Ascend to Higher Reality
                </button>
            </div>
        </div>
    );

    return (
        <div className="panel actions-panel">
            <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }} className="desktop-actions">
                <button className="btn cursor-pointer" onClick={onToggleGalaxyMap} style={{ flex: 1 }}>
                    🌌 Galaxy Map
                </button>
                <button className="btn btn-danger cursor-pointer" onClick={onResetGame}>
                    🔄 Reset Game
                </button>
            </div>

            <TabSystem currentTab={currentTab} onTabChange={(tab) => dispatch({ type: "SET_TAB", tab })} />

            {currentTab === "fleet" && renderFleetTab()}
            {currentTab === "research" && renderResearchTab()}
            {currentTab === "achievements" && renderAchievementsTab()}
            {currentTab === "prestige" && renderPrestigeTab()}
        </div>
    );
};

const GalaxyMap: React.FC<{
    systems: Record<string, GalaxySystem>;
    resources: Record<string, Resource>;
    dispatch: React.Dispatch<GameAction>;
    onClose: () => void;
}> = ({ systems, resources, dispatch, onClose }) => {
    const [viewBox, setViewBox] = useState<[number, number, number, number]>([0, 0, 100, 100]);
    const [isDragging, setIsDragging] = useState(false);
    const [lastMousePos, setLastMousePos] = useState<{ x: number; y: number } | null>(null);
    const [touches, setTouches] = useState<{ [id: number]: { x: number; y: number } }>({});
    const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(null);
    const [lastTouchCenter, setLastTouchCenter] = useState<{ x: number; y: number } | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    const handleExplore = (systemId: string) => {
        const system = systems[systemId];
        if (!system || system.isExplored) return;

        if (resources.credits.amount >= system.explorationCost) {
            dispatch({ type: "EXPLORE_SYSTEM", systemId });
        }
    };

    const handleMouseDown = (event: React.MouseEvent<SVGSVGElement>) => {
        setIsDragging(true);
        setLastMousePos({ x: event.clientX, y: event.clientY });
    };

    const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
        if (!isDragging || !lastMousePos || !svgRef.current) return;

        const svgRect = svgRef.current.getBoundingClientRect();
        const dx = (event.clientX - lastMousePos.x) * (viewBox[2] / svgRect.width);
        const dy = (event.clientY - lastMousePos.y) * (viewBox[3] / svgRect.height);

        setViewBox((prev) => [prev[0] - dx, prev[1] - dy, prev[2], prev[3]]);
        setLastMousePos({ x: event.clientX, y: event.clientY });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setLastMousePos(null);
    };

    const handleWheel = (event: React.WheelEvent<SVGSVGElement>) => {
        event.preventDefault();
        const zoomFactor = event.deltaY < 0 ? 0.9 : 1.1;

        setViewBox((prev) => {
            const newWidth = Math.max(20, Math.min(200, prev[2] * zoomFactor));
            const newHeight = Math.max(20, Math.min(200, prev[3] * zoomFactor));
            const newX = prev[0] + (prev[2] - newWidth) / 2;
            const newY = prev[1] + (prev[3] - newHeight) / 2;
            return [newX, newY, newWidth, newHeight];
        });
    };

    const getDistance = (touch1: { x: number; y: number }, touch2: { x: number; y: number }) => {
        return Math.sqrt(Math.pow(touch2.x - touch1.x, 2) + Math.pow(touch2.y - touch1.y, 2));
    };

    const getCenter = (touch1: { x: number; y: number }, touch2: { x: number; y: number }) => {
        return {
            x: (touch1.x + touch2.x) / 2,
            y: (touch1.y + touch2.y) / 2,
        };
    };

    const handleTouchStart = (event: React.TouchEvent<SVGSVGElement>) => {
        event.preventDefault();
        const newTouches: { [id: number]: { x: number; y: number } } = {};

        for (let i = 0; i < event.touches.length; i++) {
            const touch = event.touches[i];
            newTouches[touch.identifier] = { x: touch.clientX, y: touch.clientY };
        }

        setTouches(newTouches);

        if (event.touches.length === 2) {
            const touch1 = { x: event.touches[0].clientX, y: event.touches[0].clientY };
            const touch2 = { x: event.touches[1].clientX, y: event.touches[1].clientY };
            setLastTouchDistance(getDistance(touch1, touch2));
            setLastTouchCenter(getCenter(touch1, touch2));
            setIsDragging(false);
        } else if (event.touches.length === 1) {
            setIsDragging(true);
            setLastMousePos({ x: event.touches[0].clientX, y: event.touches[0].clientY });
            setLastTouchDistance(null);
            setLastTouchCenter(null);
        }
    };

    const handleTouchMove = (event: React.TouchEvent<SVGSVGElement>) => {
        event.preventDefault();

        if (event.touches.length === 2) {
            const touch1 = { x: event.touches[0].clientX, y: event.touches[0].clientY };
            const touch2 = { x: event.touches[1].clientX, y: event.touches[1].clientY };
            const distance = getDistance(touch1, touch2);
            const center = getCenter(touch1, touch2);

            if (lastTouchDistance && lastTouchCenter && svgRef.current) {
                const zoomFactor = distance / lastTouchDistance;
                const svgRect = svgRef.current.getBoundingClientRect();

                const svgCenterX = ((center.x - svgRect.left) / svgRect.width) * viewBox[2] + viewBox[0];
                const svgCenterY = ((center.y - svgRect.top) / svgRect.height) * viewBox[3] + viewBox[1];

                setViewBox((prev) => {
                    const newWidth = Math.max(20, Math.min(200, prev[2] / zoomFactor));
                    const newHeight = Math.max(20, Math.min(200, prev[3] / zoomFactor));

                    const newX = svgCenterX - newWidth / 2;
                    const newY = svgCenterY - newHeight / 2;

                    return [newX, newY, newWidth, newHeight];
                });

                setLastTouchDistance(distance);
                setLastTouchCenter(center);
            }
        } else if (event.touches.length === 1 && isDragging && lastMousePos && svgRef.current) {
            const svgRect = svgRef.current.getBoundingClientRect();
            const dx = (event.touches[0].clientX - lastMousePos.x) * (viewBox[2] / svgRect.width);
            const dy = (event.touches[0].clientY - lastMousePos.y) * (viewBox[3] / svgRect.height);

            setViewBox((prev) => [prev[0] - dx, prev[1] - dy, prev[2], prev[3]]);
            setLastMousePos({ x: event.touches[0].clientX, y: event.touches[0].clientY });
        }
    };

    const handleTouchEnd = (event: React.TouchEvent<SVGSVGElement>) => {
        event.preventDefault();

        if (event.touches.length === 0) {
            setIsDragging(false);
            setLastMousePos(null);
            setTouches({});
            setLastTouchDistance(null);
            setLastTouchCenter(null);
        } else if (event.touches.length === 1) {
            setIsDragging(true);
            setLastMousePos({ x: event.touches[0].clientX, y: event.touches[0].clientY });
            setLastTouchDistance(null);
            setLastTouchCenter(null);
        }
    };

    const exploredCount = Object.values(systems).filter((s) => s.isExplored).length;
    const totalSystems = Object.values(systems).length;

    return (
        <div className="galaxy-overlay">
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "2rem",
                }}
            >
                <div>
                    <h1 style={{ margin: 0 }}>🌌 Galaxy Map</h1>
                    <p style={{ color: "var(--text-secondary)", margin: "0.5rem 0 0 0" }}>
                        Explored: {exploredCount}/{totalSystems} systems • Credits: {formatNumber(resources.credits.amount)}
                    </p>
                </div>
                <button className="btn btn-danger cursor-pointer" onClick={onClose} style={{ fontSize: "1.1rem" }}>
                    <span className="close-x">✕</span>
                    <span className="close-text">Close</span>
                </button>
            </div>

            <div className="galaxy-content">
                <svg
                    ref={svgRef}
                    className="galaxy-svg"
                    viewBox={`${viewBox[0]} ${viewBox[1]} ${viewBox[2]} ${viewBox[3]}`}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onWheel={handleWheel}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    style={{ touchAction: "none" }}
                >
                    <defs>
                        <radialGradient id="exploredGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" style={{ stopColor: "#06d6a0", stopOpacity: 1 }} />
                            <stop offset="70%" style={{ stopColor: "#a855f7", stopOpacity: 0.6 }} />
                            <stop offset="100%" style={{ stopColor: "transparent", stopOpacity: 0 }} />
                        </radialGradient>
                        <radialGradient id="unexploredGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" style={{ stopColor: "#ff6b35", stopOpacity: 1 }} />
                            <stop offset="70%" style={{ stopColor: "#ef476f", stopOpacity: 0.6 }} />
                            <stop offset="100%" style={{ stopColor: "transparent", stopOpacity: 0 }} />
                        </radialGradient>
                        <filter id="systemGlow">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {Array.from({ length: 100 }).map((_, i) => (
                        <circle
                            key={i}
                            cx={Math.random() * 100}
                            cy={Math.random() * 100}
                            r={Math.random() * 0.5 + 0.1}
                            fill="rgba(255, 255, 255, 0.3)"
                            opacity={Math.random() * 0.8 + 0.2}
                        />
                    ))}

                    {Object.values(systems).map((system) => {
                        const canAfford = resources.credits.amount >= system.explorationCost;
                        const isAccessible = system.isExplored || canAfford;

                        return (
                            <g key={system.id}>
                                <circle
                                    cx={system.x}
                                    cy={system.y}
                                    r={system.isExplored ? "8" : "6"}
                                    fill={system.isExplored ? "url(#exploredGlow)" : "url(#unexploredGlow)"}
                                    opacity={0.6}
                                />

                                <circle
                                    className="system-node"
                                    cx={system.x}
                                    cy={system.y}
                                    r={system.isExplored ? "3" : isAccessible ? "2.5" : "2"}
                                    fill={system.isExplored ? "#06d6a0" : isAccessible ? "#ff6b35" : "#64748b"}
                                    filter="url(#systemGlow)"
                                    opacity={isAccessible ? 1 : 0.5}
                                    onClick={() => handleExplore(system.id)}
                                    style={{ cursor: isAccessible ? "pointer" : "not-allowed" }}
                                />

                                <text
                                    x={system.x}
                                    y={system.y - 6}
                                    textAnchor="middle"
                                    fontSize={Math.max(2, viewBox[2] / 30)}
                                    fill="#ffffff"
                                    fontFamily="Orbitron"
                                    fontWeight="600"
                                    filter="url(#systemGlow)"
                                >
                                    {system.name}
                                </text>

                                {!system.isExplored && (
                                    <text
                                        x={system.x}
                                        y={system.y + 8}
                                        textAnchor="middle"
                                        fontSize={Math.max(1.5, viewBox[2] / 40)}
                                        fill={canAfford ? "#06d6a0" : "#ef476f"}
                                        fontFamily="Inter"
                                        fontWeight="500"
                                    >
                                        {formatNumber(system.explorationCost)} Credits
                                    </text>
                                )}

                                {system.specialFeature && (
                                    <text
                                        x={system.x}
                                        y={system.y + (system.isExplored ? 6 : 12)}
                                        textAnchor="middle"
                                        fontSize={Math.max(1, viewBox[2] / 50)}
                                        fill="#a855f7"
                                        fontFamily="Inter"
                                        fontStyle="italic"
                                    >
                                        {system.specialFeature}
                                    </text>
                                )}
                            </g>
                        );
                    })}
                </svg>
            </div>

            <div
                style={{
                    marginTop: "1.5rem",
                    padding: "1.5rem",
                    background: "var(--glass)",
                    borderRadius: "16px",
                    border: "1px solid var(--glass-border)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <div>
                    <h4 style={{ margin: "0 0 0.5rem 0", color: "var(--accent-cyan)" }}>Navigation Controls</h4>
                    <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.9rem" }}>
                        <span className="nav-controls-desktop">🖱️ Click to explore • 🔍 Scroll/Pinch to zoom • ✋ Drag to navigate</span>
                        <span className="nav-controls-mobile">
                            <div>🖱️ Click to explore</div>
                            <div>🔍 Scroll/Pinch to zoom</div>
                            <div>✋ Drag to navigate</div>
                        </span>
                    </p>
                </div>
                <div style={{ textAlign: "right" }}>
                    <div style={{ color: "var(--accent-cyan)", fontSize: "1.2rem", fontWeight: "700" }}>
                        {exploredCount}/{totalSystems}
                    </div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>Systems Explored</div>
                </div>
            </div>
        </div>
    );
};

// Notification System
const NotificationContainer: React.FC<{
    notifications: Notification[];
    onRemove: (id: string) => void;
}> = ({ notifications, onRemove }) => {
    useEffect(() => {
        notifications.forEach((notification) => {
            const timer = setTimeout(() => {
                onRemove(notification.id);
            }, notification.duration);

            return () => clearTimeout(timer);
        });
    }, [notifications, onRemove]);

    return (
        <div className="notification-container">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className={`notification ${notification.type}`}
                    onClick={() => onRemove(notification.id)}
                    style={{ cursor: "pointer" }}
                >
                    <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
                        <span style={{ fontSize: "1.5rem", marginRight: "0.75rem" }}>{getNotificationIcon(notification.type)}</span>
                        <div>
                            <div style={{ fontWeight: "700", fontSize: "1rem" }}>{notification.title}</div>
                            <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>{notification.message}</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

// Helper functions for styling
function getCategoryColor(category: string): string {
    switch (category) {
        case "efficiency":
            return "var(--accent-cyan)";
        case "capacity":
            return "var(--accent-purple)";
        case "unlock":
            return "var(--accent-orange)";
        case "prestige":
            return "var(--cosmic-gradient)";
        default:
            return "var(--text-muted)";
    }
}

function getTierColor(tier: string): string {
    switch (tier) {
        case "bronze":
            return "#cd7f32";
        case "silver":
            return "#c0c0c0";
        case "gold":
            return "#ffd700";
        case "platinum":
            return "#e5e4e2";
        case "cosmic":
            return "#a855f7";
        default:
            return "var(--text-muted)";
    }
}

function getNotificationIcon(type: string): string {
    switch (type) {
        case "achievement":
            return "🏆";
        case "milestone":
            return "⭐";
        case "warning":
            return "⚠️";
        case "info":
            return "ℹ️";
        default:
            return "📢";
    }
}

// Main App Component
const App: React.FC = () => {
    const [gameState, dispatch] = useReducer(gameReducer, {
        ...INITIAL_GAME_STATE,
        gameStartTime: Date.now(),
        lastUpdate: Date.now(),
    });

    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Initialize sidebar state based on screen size
    useEffect(() => {
        const initializeSidebar = () => {
            // Always start with sidebar closed, let user open it with hamburger menu
            setSidebarOpen(false);
        };

        initializeSidebar();
    }, []);

    // High-performance game loop
    useEffect(() => {
        let animationFrame: number;
        let lastTime = Date.now();

        const gameLoop = () => {
            const currentTime = Date.now();
            const deltaTime = currentTime - lastTime;

            if (deltaTime >= TICK_INTERVAL) {
                dispatch({ type: "UPDATE_RESOURCES", deltaTime });

                // Update resource history every second
                if (Math.floor(currentTime / 1000) !== Math.floor(lastTime / 1000)) {
                    Object.keys(gameState.resources).forEach((resourceId) => {
                        dispatch({
                            type: "SET_RESOURCE_HISTORY",
                            resourceId,
                            value: gameState.resources[resourceId].amount,
                        });
                    });
                }

                lastTime = currentTime;
            }

            animationFrame = requestAnimationFrame(gameLoop);
        };

        animationFrame = requestAnimationFrame(gameLoop);
        return () => cancelAnimationFrame(animationFrame);
    }, [gameState.resources]);

    // Achievement checking
    useEffect(() => {
        dispatch({ type: "CHECK_ACHIEVEMENTS" });
    }, [gameState.ships, gameState.systems, gameState.totalResourcesGenerated]);

    // Handle responsive sidebar behavior
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 1024) {
                // On mobile, keep current sidebar state (don't force close/open)
                // Let user control it with hamburger menu
            } else {
                // On desktop, always hide sidebar
                setSidebarOpen(false);
            }
        };

        handleResize(); // Call immediately
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key.toLowerCase() === "m") {
                dispatch({ type: "TOGGLE_GALAXY_MAP" });
            }
            if (event.key.toLowerCase() === "s") {
                setSidebarOpen(!sidebarOpen);
            }
            if (event.key >= "1" && event.key <= "4") {
                const tabs = ["fleet", "research", "prestige", "achievements"];
                dispatch({ type: "SET_TAB", tab: tabs[parseInt(event.key) - 1] as any });
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [sidebarOpen]);

    const toggleGalaxyMap = useCallback(() => {
        dispatch({ type: "TOGGLE_GALAXY_MAP" });
    }, []);

    const resetGame = useCallback(() => {
        if (
            confirm(
                "⚠️ Are you sure you want to reset your entire galactic empire? This will permanently delete all progress and cannot be undone!"
            )
        ) {
            dispatch({ type: "RESET_GAME" });
            // Add notification
            const notification: Notification = {
                id: `reset-${Date.now()}`,
                type: "info",
                title: "Empire Reset",
                message: "Your galactic empire has been reset. Begin your cosmic journey anew!",
                timestamp: Date.now(),
                duration: 4000,
            };
            dispatch({ type: "ADD_NOTIFICATION", notification });
        }
    }, []);

    const removeNotification = useCallback((id: string) => {
        dispatch({ type: "REMOVE_NOTIFICATION", id });
    }, []);

    const gameTime = Date.now() - gameState.gameStartTime;

    return (
        <>
            <GlobalStyles />
            <div className="space-background" />

            <HamburgerMenu isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

            <Sidebar
                isOpen={sidebarOpen}
                currentTab={gameState.currentTab}
                onTabChange={(tab) => dispatch({ type: "SET_TAB", tab })}
                onToggleGalaxyMap={toggleGalaxyMap}
                onResetGame={resetGame}
                onClose={() => setSidebarOpen(false)}
            />

            <div className={`app ${!sidebarOpen ? "sidebar-closed" : ""}`}>
                <ResourcePanel
                    resources={gameState.resources}
                    resourceHistory={gameState.resourceHistory}
                    gameTime={gameTime}
                    totalGenerated={gameState.totalResourcesGenerated}
                    prestigeLevel={gameState.prestigeLevel}
                />

                <ActionsPanel
                    ships={gameState.ships}
                    upgrades={gameState.upgrades}
                    resources={gameState.resources}
                    achievements={gameState.achievements}
                    currentTab={gameState.currentTab}
                    dispatch={dispatch}
                    onToggleGalaxyMap={toggleGalaxyMap}
                    onResetGame={resetGame}
                />

                {gameState.isGalaxyMapOpen && (
                    <GalaxyMap systems={gameState.systems} resources={gameState.resources} dispatch={dispatch} onClose={toggleGalaxyMap} />
                )}

                <NotificationContainer notifications={gameState.notifications} onRemove={removeNotification} />
            </div>
        </>
    );
};

export default App;
