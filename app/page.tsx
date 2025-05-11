"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Head from "next/head";
import { Settings, Moon, Sun, Home, Info, Trophy, Volume2, VolumeX, Target, Shield, Zap, Github, Twitter, Linkedin } from "lucide-react";

// theme types
type Theme = "dark" | "light";

// game states
type GameState = "home" | "playing" | "gameover" | "about";

// difficulty levels
type DifficultyLevel = "easy" | "medium" | "hard";

// tower themes
type TowerTheme = "medieval" | "futuristic" | "fantasy";

// map types
type MapType = "grassland" | "desert" | "snow";

// tower types
type TowerType = "archer" | "cannon" | "magic";

// enemy types
type EnemyType = "infantry" | "armored" | "flying";

// targeting modes
type TargetingMode = "first" | "last" | "strongest" | "weakest";

// special effect types
type SpecialEffect = "slow" | "splash" | "critical" | "poison" | "chain";

// tower interface
interface Tower {
    x: number;
    y: number;
    type: TowerType;
    level: number;
    range: number;
    damage: number;
    fireRate: number;
    lastFired: number;
    target: Enemy | null;
    cost: number;
    targetingMode: TargetingMode;
    special?: {
        effect: SpecialEffect;
        chance: number;
        duration?: number;
        value?: number;
    };
    shotAtPosition?: { x: number; y: number };
    specialEffect?: SpecialEffect | "splash"; // Added to cover all possible effects being set
}

// enemy interface
interface Enemy {
    id: number;
    type: EnemyType;
    x: number;
    y: number;
    speed: number;
    originalSpeed?: number;
    health: number;
    maxHealth: number;
    reward: number;
    pathIndex: number;
    dead: boolean;
    isBoss?: boolean;
    effects: {
        slowed?: { until: number; value: number };
        poisoned?: { until: number; damagePerTick: number; lastTick: number };
    };
}

// map path point
interface PathPoint {
    x: number;
    y: number;
}

// map interface
interface GameMap {
    type: MapType;
    path: PathPoint[];
    startPoint: PathPoint;
    endPoint: PathPoint;
}

const AUDIO = {
    PLACE_TOWER: "https://assets.mixkit.co/active_storage/sfx/212/212-preview.mp3",
    START_WAVE: "https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3",
    ENEMY_KILLED: "https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3",
    ENEMY_LEAKED: "https://assets.mixkit.co/active_storage/sfx/537/537-preview.mp3",
    GAME_OVER: "https://assets.mixkit.co/active_storage/sfx/566/566-preview.mp3",
};

const TowerDefenseGame = () => {
    const [gameState, setGameState] = useState<GameState>("home");
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [theme, setTheme] = useState<Theme>("dark");
    const [difficulty, setDifficulty] = useState<DifficultyLevel>("medium");
    const [towerTheme, setTowerTheme] = useState<TowerTheme>("medieval");
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [countdown, setCountdown] = useState(0);
    const [mapType, setMapType] = useState<MapType>("grassland");
    const [currentWave, setCurrentWave] = useState(0);
    const [lives, setLives] = useState(10);
    const [gold, setGold] = useState(100);
    const [selectedTower, setSelectedTower] = useState<TowerType | null>(null);
    const [towers, setTowers] = useState<Tower[]>([]);
    const [enemies, setEnemies] = useState<Enemy[]>([]);
    const [waveInProgress, setWaveInProgress] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const gameLoopRef = useRef<number>(0);

    const placeTowerSoundRef = useRef<HTMLAudioElement | null>(null);
    const startWaveSoundRef = useRef<HTMLAudioElement | null>(null);
    const enemyKilledSoundRef = useRef<HTMLAudioElement | null>(null);
    const enemyLeakedSoundRef = useRef<HTMLAudioElement | null>(null);
    const gameOverSoundRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        placeTowerSoundRef.current = new Audio(AUDIO.PLACE_TOWER);
        startWaveSoundRef.current = new Audio(AUDIO.START_WAVE);
        enemyKilledSoundRef.current = new Audio(AUDIO.ENEMY_KILLED);
        enemyLeakedSoundRef.current = new Audio(AUDIO.ENEMY_LEAKED);
        gameOverSoundRef.current = new Audio(AUDIO.GAME_OVER);

        if (placeTowerSoundRef.current) placeTowerSoundRef.current.volume = 0.2;
        if (startWaveSoundRef.current) startWaveSoundRef.current.volume = 0.3;
        if (enemyKilledSoundRef.current) enemyKilledSoundRef.current.volume = 0.3;
        if (enemyLeakedSoundRef.current) enemyLeakedSoundRef.current.volume = 0.4;
        if (gameOverSoundRef.current) gameOverSoundRef.current.volume = 0.4;

        const preloadAudio = (audio: HTMLAudioElement | null) => {
            if (audio) {
                audio.load();
            }
        };

        preloadAudio(placeTowerSoundRef.current);
        preloadAudio(startWaveSoundRef.current);
        preloadAudio(enemyKilledSoundRef.current);
        preloadAudio(enemyLeakedSoundRef.current);
        preloadAudio(gameOverSoundRef.current);

        return () => {
            [placeTowerSoundRef, startWaveSoundRef, enemyKilledSoundRef, enemyLeakedSoundRef, gameOverSoundRef].forEach((ref) => {
                if (ref.current) {
                    ref.current.pause();
                    ref.current.src = "";
                }
            });
        };
    }, []);

    const playSound = useCallback(
        (soundRef: React.RefObject<HTMLAudioElement | null>) => {
            if (soundEnabled && soundRef.current) {
                soundRef.current.currentTime = 0;
                const playPromise = soundRef.current.play();

                if (playPromise !== undefined) {
                    playPromise.catch((error) => {
                        console.log("Audio play failed:", error);
                    });
                }
            }
        },
        [soundEnabled]
    );

    const difficultySettings = {
        easy: { enemyHealth: 50, enemySpeed: 0.5, startingGold: 250, startingLives: 15 },
        medium: { enemyHealth: 100, enemySpeed: 0.8, startingGold: 180, startingLives: 10 },
        hard: { enemyHealth: 150, enemySpeed: 1.2, startingGold: 120, startingLives: 5 },
    };

    // Tower costs and stats with proper typings
    interface TowerLevelStats {
        damage: number;
        range: number;
        fireRate: number;
    }

    const towerStats = {
        archer: {
            cost: 50,
            damage: 10,
            range: 120,
            fireRate: 600,
            levels: [
                {} as TowerLevelStats, // Level 0 is not used
                { damage: 10, range: 120, fireRate: 600 }, // Level 1
                { damage: 15, range: 130, fireRate: 550 }, // Level 2
                { damage: 22, range: 140, fireRate: 500 }, // Level 3
            ],
            upgradeCost: [0, 40, 75], // Cost for upgrade to level [1, 2, 3]
            special: { effect: "critical", chance: 0.15, value: 2 }, // Critical hits
        },
        cannon: {
            cost: 100,
            damage: 30,
            range: 80,
            fireRate: 1200,
            levels: [
                {} as TowerLevelStats, // Level 0 is not used
                { damage: 30, range: 80, fireRate: 1200 }, // Level 1
                { damage: 45, range: 85, fireRate: 1100 }, // Level 2
                { damage: 65, range: 90, fireRate: 1000 }, // Level 3
            ],
            upgradeCost: [0, 80, 150], // Cost for upgrade to level [1, 2, 3]
            special: { effect: "splash", chance: 1, value: 3 }, // Splash damage
        },
        magic: {
            cost: 150,
            damage: 20,
            range: 150,
            fireRate: 800,
            levels: [
                {} as TowerLevelStats, // Level 0 is not used
                { damage: 20, range: 150, fireRate: 800 }, // Level 1
                { damage: 30, range: 165, fireRate: 750 }, // Level 2
                { damage: 42, range: 180, fireRate: 700 }, // Level 3
            ],
            upgradeCost: [0, 120, 180], // Cost for upgrade to level [1, 2, 3]
            special: { effect: "slow", chance: 0.3, duration: 3000, value: 0.5 }, // Slow effect
        },
    };

    const [canvasSize, setCanvasSize] = useState({ width: 600, height: 400 });
    const [cellSize, setCellSize] = useState(40);
    const [mapGrid, setMapGrid] = useState<number[][]>([]);
    const [currentMap, setCurrentMap] = useState<GameMap | null>(null);

    // Track mouse position for tower placement hover effect
    const [lastMouseX, setLastMouseX] = useState(0);
    const [lastMouseY, setLastMouseY] = useState(0);

    const createMap = useCallback(
        (type: MapType) => {
            const gridCols = Math.floor(canvasSize.width / cellSize);
            const gridRows = Math.floor(canvasSize.height / cellSize);

            let newGrid: number[][] = Array(gridRows)
                .fill(0)
                .map(() => Array(gridCols).fill(0));
            let pathPoints: PathPoint[] = [];

            // Create different paths based on map type
            if (type === "grassland") {
                const startY = Math.floor(gridRows / 2);
                pathPoints = [
                    { x: 0, y: startY },
                    { x: Math.floor(gridCols * 0.25), y: startY },
                    { x: Math.floor(gridCols * 0.25), y: Math.floor(gridRows * 0.25) },
                    { x: Math.floor(gridCols * 0.75), y: Math.floor(gridRows * 0.25) },
                    { x: Math.floor(gridCols * 0.75), y: Math.floor(gridRows * 0.75) },
                    { x: gridCols - 1, y: Math.floor(gridRows * 0.75) },
                ];
            } else if (type === "desert") {
                pathPoints = [
                    { x: 0, y: 0 },
                    { x: gridCols - 1, y: 0 },
                    { x: gridCols - 1, y: Math.floor(gridRows * 0.5) },
                    { x: 0, y: Math.floor(gridRows * 0.5) },
                    { x: 0, y: gridRows - 1 },
                    { x: gridCols - 1, y: gridRows - 1 },
                ];
            } else {
                // snow
                const midX = Math.floor(gridCols / 2);
                pathPoints = [
                    { x: 0, y: 0 },
                    { x: midX, y: 0 },
                    { x: midX, y: Math.floor(gridRows * 0.33) },
                    { x: Math.floor(gridCols * 0.25), y: Math.floor(gridRows * 0.33) },
                    { x: Math.floor(gridCols * 0.25), y: Math.floor(gridRows * 0.66) },
                    { x: Math.floor(gridCols * 0.75), y: Math.floor(gridRows * 0.66) },
                    { x: Math.floor(gridCols * 0.75), y: gridRows - 1 },
                    { x: gridCols - 1, y: gridRows - 1 },
                ];
            }

            // Mark path cells in grid
            for (let i = 0; i < pathPoints.length - 1; i++) {
                const p1 = pathPoints[i];
                const p2 = pathPoints[i + 1];

                // Get all cells between p1 and p2
                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                const steps = Math.max(Math.abs(dx), Math.abs(dy));
                const xIncrement = dx / steps;
                const yIncrement = dy / steps;

                for (let j = 0; j <= steps; j++) {
                    const x = Math.floor(p1.x + xIncrement * j);
                    const y = Math.floor(p1.y + yIncrement * j);

                    if (x >= 0 && x < gridCols && y >= 0 && y < gridRows) {
                        newGrid[y][x] = 1; // 1 indicates path
                    }
                }
            }

            setMapGrid(newGrid);
            return {
                type,
                path: pathPoints,
                startPoint: pathPoints[0],
                endPoint: pathPoints[pathPoints.length - 1],
            };
        },
        [canvasSize.height, canvasSize.width, cellSize]
    );

    // theme toggle
    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("towerDefenseTheme", newTheme);

        const root = document.documentElement;
        if (newTheme === "dark") {
            root.style.setProperty("--primary", "#0b1120");
            root.style.setProperty("--secondary", "#1e293b");
            root.style.setProperty("--accent", "#8b5cf6");
            root.style.setProperty("--highlight", "#a78bfa");
            root.style.setProperty("--text", "#f8fafc");
            root.style.setProperty("--card", "rgba(30, 41, 59, 0.7)");
            root.style.setProperty("--card-border", "rgba(255, 255, 255, 0.1)");
            root.style.setProperty("--bg-gradient", "linear-gradient(135deg, #0b1120 0%, #1e293b 100%)");
            root.style.setProperty("--card-shadow", "0 8px 32px 0 rgba(0, 0, 0, 0.2)");
            root.style.setProperty("--footer-bg", "var(--primary)");
        } else {
            root.style.setProperty("--primary", "#efecca");
            root.style.setProperty("--secondary", "#a9cbb7");
            root.style.setProperty("--accent", "#ff934f");
            root.style.setProperty("--highlight", "#ff7517");
            root.style.setProperty("--text", "#30292f");
            root.style.setProperty("--card", "rgba(255, 255, 255, 0.85)");
            root.style.setProperty("--card-border", "rgba(94, 86, 90, 0.2)");
            root.style.setProperty("--bg-gradient", "linear-gradient(135deg, #efecca 0%, #a9cbb7 100%)");
            root.style.setProperty("--card-shadow", "6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.7)");
            root.style.setProperty("--footer-bg", "var(--secondary)");
        }
    };

    // reset game state
    const resetGame = useCallback(() => {
        setTowers([]);
        setEnemies([]);
        setCurrentWave(0);
        setWaveInProgress(false);
        setScore(0);
        setLives(difficultySettings[difficulty].startingLives);
        setGold(difficultySettings[difficulty].startingGold);
        setSelectedTower(null);
    }, [difficulty]);

    // start game
    const startGame = useCallback(() => {
        resetGame();
        setGameState("playing");

        const newMap = createMap(mapType);
        setCurrentMap(newMap);

        setCountdown(3);

        const countdownInterval = setInterval(() => {
            setCountdown((prev) => {
                if (prev === 1) {
                    clearInterval(countdownInterval);
                    playSound(startWaveSoundRef);

                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, [createMap, mapType, playSound, resetGame]);

    const startWave = useCallback(() => {
        if (waveInProgress) return;

        const newWave = currentWave + 1;
        setCurrentWave(newWave);
        setWaveInProgress(true);

        const numEnemies = 5 + Math.floor(newWave * 1.5);

        const enemyDistribution = {
            infantry: Math.max(0.7 - newWave * 0.03, 0.3),
            armored: Math.min(0.2 + newWave * 0.02, 0.4),
            flying: Math.min(0.1 + newWave * 0.01, 0.3),
        };

        const hasBoss = newWave % 5 === 0;
        const bossType: EnemyType = newWave % 15 === 0 ? "flying" : newWave % 10 === 0 ? "armored" : "infantry";

        const spawnDelay = Math.max(800 - newWave * 30, 300);

        let enemyId = Date.now();
        let spawnCount = 0;

        const spawnInterval = setInterval(() => {
            if (spawnCount >= numEnemies) {
                clearInterval(spawnInterval);
                return;
            }

            const isBoss = hasBoss && spawnCount === numEnemies - 1;

            let enemyType: EnemyType;

            if (isBoss) {
                enemyType = bossType;
            } else {
                const randValue = Math.random();
                if (randValue < enemyDistribution.infantry) {
                    enemyType = "infantry";
                } else if (randValue < enemyDistribution.infantry + enemyDistribution.armored) {
                    enemyType = "armored";
                } else {
                    enemyType = "flying";
                }
            }

            if (currentMap) {
                const startPoint = currentMap.path[0];

                let enemyHealth = difficultySettings[difficulty].enemyHealth * (1 + (newWave - 1) * 0.2);

                if (enemyType === "infantry") {
                    enemyHealth *= 1;
                } else if (enemyType === "armored") {
                    enemyHealth *= 2;
                } else {
                    // flying
                    enemyHealth *= 0.7;
                }

                if (isBoss) {
                    enemyHealth *= 5;
                }

                let enemySpeed =
                    difficultySettings[difficulty].enemySpeed *
                    (enemyType === "infantry" ? 1 : enemyType === "armored" ? 0.7 : 1.3) *
                    (1 + (newWave - 1) * 0.07);

                if (isBoss) {
                    enemySpeed *= 0.7;
                }

                const baseReward = 10 + Math.floor(newWave * 0.5);
                const enemyReward = baseReward * (enemyType === "infantry" ? 1 : enemyType === "armored" ? 2 : 3) * (isBoss ? 5 : 1);

                const newEnemy: Enemy = {
                    id: enemyId++,
                    type: enemyType,
                    x: startPoint.x * cellSize,
                    y: startPoint.y * cellSize,
                    speed: enemySpeed,
                    originalSpeed: enemySpeed,
                    health: enemyHealth,
                    maxHealth: enemyHealth,
                    reward: enemyReward,
                    pathIndex: 0,
                    dead: false,
                    isBoss,
                    effects: {},
                };

                setEnemies((prev) => [...prev, newEnemy]);
            }

            spawnCount++;

            if (spawnCount >= numEnemies) {
                clearInterval(spawnInterval);

                const checkEnemiesInterval = setInterval(() => {
                    if (enemies.length === 0) {
                        clearInterval(checkEnemiesInterval);
                        setWaveInProgress(false);

                        const waveBonus = 20 + Math.floor(newWave * 5);
                        setGold((prev) => prev + waveBonus);
                    }
                }, 1000);
            }
        }, spawnDelay);

        playSound(startWaveSoundRef);
    }, [currentMap, currentWave, difficulty, enemies.length, playSound, waveInProgress]);

    const handleCanvasClick = useCallback(
        (event: React.MouseEvent<HTMLCanvasElement>) => {
            if (!canvasRef.current || gameState !== "playing" || countdown > 0) return;

            const canvas = canvasRef.current;
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;

            const x = (event.clientX - rect.left) * scaleX;
            const y = (event.clientY - rect.top) * scaleY;

            // Check if the click is on the "Start Wave" button drawn on canvas
            if (!waveInProgress && gameState === "playing" && countdown === 0) {
                const buttonRect = {
                    x: canvas.width / 2 - 100,
                    y: canvas.height - 50,
                    width: 200,
                    height: 40,
                };

                if (
                    x >= buttonRect.x &&
                    x <= buttonRect.x + buttonRect.width &&
                    y >= buttonRect.y &&
                    y <= buttonRect.y + buttonRect.height
                ) {
                    startWave();
                    return; // Exit early if wave started
                }
            }

            const gridX = Math.floor(x / cellSize);
            const gridY = Math.floor(y / cellSize);

            const clickedTowerIndex = towers.findIndex(
                (tower) => Math.floor(tower.x / cellSize) === gridX && Math.floor(tower.y / cellSize) === gridY
            );

            if (clickedTowerIndex !== -1) {
                setSelectedTowerIndex(clickedTowerIndex);
                setSelectedTower(null);
                return;
            } else {
                setSelectedTowerIndex(null);
            }

            if (selectedTower) {
                if (mapGrid[gridY] && mapGrid[gridY][gridX] === 0) {
                    const towerExists = towers.some(
                        (tower) => Math.floor(tower.x / cellSize) === gridX && Math.floor(tower.y / cellSize) === gridY
                    );

                    if (!towerExists) {
                        const towerCost = towerStats[selectedTower].cost;

                        if (gold >= towerCost) {
                            const levelStats = towerStats[selectedTower].levels[1];

                            const newTower: Tower = {
                                x: gridX * cellSize,
                                y: gridY * cellSize,
                                type: selectedTower,
                                level: 1,
                                range: levelStats.range,
                                damage: levelStats.damage,
                                fireRate: levelStats.fireRate,
                                lastFired: 0,
                                target: null,
                                cost: towerCost,
                                targetingMode: "first",
                                special: {
                                    ...towerStats[selectedTower].special,
                                    effect: towerStats[selectedTower].special.effect as SpecialEffect,
                                },
                            };

                            setTowers((prev) => [...prev, newTower]);
                            setGold((prev) => prev - towerCost);
                            playSound(placeTowerSoundRef);

                            // Check if player can afford another tower of the SAME TYPE they just placed
                            const goldAfterPurchase = gold - towerCost;
                            if (selectedTower) { // Ensure selectedTower is not null before accessing its stats
                                const costOfSelectedType = towerStats[selectedTower].cost;
                                if (goldAfterPurchase < costOfSelectedType) {
                                    setSelectedTower(null);
                                }
                            }
                        }
                    }
                }
            }
        },
        [cellSize, countdown, gameState, gold, mapGrid, playSound, selectedTower, towers, towerStats]
    );

    const [selectedTowerIndex, setSelectedTowerIndex] = useState<number | null>(null);

    const upgradeTower = (index: number) => {
        const tower = towers[index];

        if (tower.level >= 3) return;

        const nextLevel = tower.level + 1;
        const upgradeCost = towerStats[tower.type].upgradeCost[nextLevel - 1];

        if (gold >= upgradeCost) {
            const levelStats = towerStats[tower.type].levels[nextLevel];

            const updatedTowers = [...towers];
            updatedTowers[index] = {
                ...tower,
                level: nextLevel,
                damage: levelStats.damage,
                range: levelStats.range,
                fireRate: levelStats.fireRate,
            };

            setTowers(updatedTowers);
            setGold(gold - upgradeCost);
            playSound(placeTowerSoundRef);
        }
    };

    const changeTargetingMode = (index: number, mode: TargetingMode) => {
        const updatedTowers = [...towers];
        updatedTowers[index] = {
            ...updatedTowers[index],
            targetingMode: mode,
        };
        setTowers(updatedTowers);
    };

    const selectTower = (type: TowerType) => {
        if (selectedTower === type) {
            setSelectedTower(null);
        } else {
            setSelectedTower(type);
            setSelectedTowerIndex(null);
        }
    };

    const updateEnemies = useCallback(() => {
        if (!currentMap) return;

        const updatedEnemies = enemies
            .map((enemy) => {
                if (enemy.dead) return enemy;

                const now = Date.now();
                let enemySpeed = enemy.speed;

                if (enemy.effects.slowed && enemy.effects.slowed.until > now) {
                    enemySpeed *= enemy.effects.slowed.value;
                } else if (enemy.effects.slowed) {
                    enemy.effects.slowed = undefined;
                }

                if (enemy.effects.poisoned && enemy.effects.poisoned.until > now) {
                    if (now - enemy.effects.poisoned.lastTick >= 1000) {
                        enemy.health -= enemy.effects.poisoned.damagePerTick;
                        enemy.effects.poisoned.lastTick = now;

                        if (enemy.health <= 0) {
                            setScore((prev) => prev + 1);
                            setGold((prev) => prev + enemy.reward);
                            playSound(enemyKilledSoundRef);
                            return { ...enemy, health: 0, dead: true };
                        }
                    }
                } else if (enemy.effects.poisoned) {
                    enemy.effects.poisoned = undefined;
                }

                const pathIndex = enemy.pathIndex;
                const targetPoint = currentMap.path[pathIndex + 1];

                if (!targetPoint) {
                    setLives((prev) => {
                        const damage = enemy.isBoss ? 3 : 1;
                        const newLives = prev - damage;
                        if (newLives <= 0) {
                            setGameState("gameover");
                            playSound(gameOverSoundRef);
                        } else {
                            playSound(enemyLeakedSoundRef);
                        }
                        return newLives;
                    });
                    return { ...enemy, dead: true };
                }

                const targetX = targetPoint.x * cellSize;
                const targetY = targetPoint.y * cellSize;
                const dx = targetX - enemy.x;
                const dy = targetY - enemy.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < enemySpeed) {
                    return { ...enemy, x: targetX, y: targetY, pathIndex: pathIndex + 1 };
                } else {
                    const vx = (dx / distance) * enemySpeed;
                    const vy = (dy / distance) * enemySpeed;
                    return { ...enemy, x: enemy.x + vx, y: enemy.y + vy };
                }
            })
            .filter((enemy) => !enemy.dead);

        setEnemies(updatedEnemies);
    }, [cellSize, currentMap, enemies, playSound]);

    const sellTower = (index: number) => {
        const tower = towers[index];
        const sellValue = Math.floor(tower.cost * 0.5 * tower.level);
        const updatedTowers = towers.filter((_, i) => i !== index);
        setTowers(updatedTowers);
        setGold(gold + sellValue);

        if (selectedTowerIndex === index) {
            setSelectedTowerIndex(null);
        }
    };

    const updateTowers = useCallback(
        (timestamp: number) => {
            if (enemies.length === 0) {
                setTowers(prevTowers => prevTowers.map(t => ({ ...t, shotAtPosition: undefined, target: null })) );
                return;
            }

            const updatedTowers = towers.map((currentTowerState) => {
                let towerWorkInProgress = { ...currentTowerState }; 

                if (towerWorkInProgress.shotAtPosition && timestamp - towerWorkInProgress.lastFired >= 150) {
                    towerWorkInProgress.shotAtPosition = undefined;
                }

                let currentDecisionTarget: Enemy | null = null;
                if (towerWorkInProgress.target) {
                    const refreshedTargetCandidate = enemies.find(enemy => enemy.id === towerWorkInProgress.target?.id);
                    if (refreshedTargetCandidate &&
                        !refreshedTargetCandidate.dead &&
                        getDistance(towerWorkInProgress, refreshedTargetCandidate) <= towerWorkInProgress.range &&
                        (refreshedTargetCandidate.type !== "flying" || towerWorkInProgress.type === "magic")) {
                        currentDecisionTarget = refreshedTargetCandidate;
                    }
                }

                if (!currentDecisionTarget) {
                    let potentialTargets = enemies.filter((enemy) => {
                        if (enemy.dead) return false;
                        if (enemy.type === "flying" && towerWorkInProgress.type !== "magic") return false;
                        return getDistance(towerWorkInProgress, enemy) <= towerWorkInProgress.range;
                    });
                    if (potentialTargets.length > 0) {
                        switch (towerWorkInProgress.targetingMode) {
                            case "first": potentialTargets.sort((a, b) => b.pathIndex - a.pathIndex); break;
                            case "last": potentialTargets.sort((a, b) => a.pathIndex - b.pathIndex); break;
                            case "strongest": potentialTargets.sort((a, b) => b.health - a.health); break;
                            case "weakest": potentialTargets.sort((a, b) => a.health - b.health); break;
                            default: potentialTargets.sort((a, b) => b.pathIndex - a.pathIndex);
                        }
                        currentDecisionTarget = potentialTargets[0];
                    }
                }
                towerWorkInProgress.target = currentDecisionTarget; // Always update aiming target

                if (currentDecisionTarget && timestamp - towerWorkInProgress.lastFired >= towerWorkInProgress.fireRate) {
                    let damage = towerWorkInProgress.damage;
                    let isCritical = false;
                    let appliedSlow = false;
                    let didSplash = false;

                    if (towerWorkInProgress.special) {
                        const { effect, chance, value, duration } = towerWorkInProgress.special;
                        if (Math.random() < chance) {
                            switch (effect) {
                                case "critical": isCritical = true; damage *= value || 2; break;
                                case "splash":
                                    didSplash = true;
                                    const splashRadius = (value || 3) * cellSize;
                                    const splashDamage = towerWorkInProgress.damage * 0.5;
                                    enemies.forEach(enemy => { // Splash affects enemies in the main list
                                        if (!enemy.dead && enemy.id !== currentDecisionTarget!.id && getDistance(currentDecisionTarget!, enemy) <= splashRadius) {
                                            enemy.health -= splashDamage;
                                            if (enemy.health <= 0) { enemy.health = 0; enemy.dead = true; /* Handled by setEnemies filter */ }
                                        }
                                    });
                                    break;
                                case "slow":
                                    appliedSlow = true;
                                    const slowUntil = Date.now() + (duration || 3000);
                                    const slowValue = value || 0.5;
                                    if (currentDecisionTarget.effects) currentDecisionTarget.effects.slowed = { until: slowUntil, value: slowValue };
                                    else currentDecisionTarget.effects = { slowed: { until: slowUntil, value: slowValue }};
                                    break;
                            }
                        }
                    }

                    const targetWasKilled = { killed: false };
                    let tempEnemies = enemies.map(e => ({...e, effects: {...e.effects}})); // Create a working copy for this iteration

                    tempEnemies = tempEnemies.map((enemy) => {
                        if (enemy.id === currentDecisionTarget!.id) {
                            enemy.health -= damage;
                            if (enemy.health <= 0) {
                                setScore((prev) => prev + 1);
                                setGold((prev) => prev + enemy.reward);
                                playSound(enemyKilledSoundRef);
                                targetWasKilled.killed = true; enemy.health = 0; enemy.dead = true;
                            }
                            if (appliedSlow && enemy.effects) enemy.effects.slowed = currentDecisionTarget!.effects.slowed; // Apply slow to the copy
                        }
                        // For splash, dead marking already happened on 'enemies' list, filter will pick it up
                        return enemy;
                    });
                    setEnemies(tempEnemies.filter(e => !e.dead));
                    
                    towerWorkInProgress.lastFired = timestamp;
                    towerWorkInProgress.shotAtPosition = { x: currentDecisionTarget.x + cellSize / 2, y: currentDecisionTarget.y + cellSize / 2 };
                    towerWorkInProgress.target = targetWasKilled.killed ? null : currentDecisionTarget;
                    towerWorkInProgress.specialEffect = isCritical ? "critical" : appliedSlow ? "slow" : didSplash ? "splash" : undefined;
                }
                return towerWorkInProgress;
            });
            setTowers(updatedTowers);
        },
        [enemies, playSound, towers, cellSize, setScore, setGold] // Keep existing dependencies
    );

    const getDistance = (obj1: { x: number; y: number }, obj2: { x: number; y: number }) => {
        const dx = obj1.x - obj2.x;
        const dy = obj1.y - obj2.y;
        return Math.sqrt(dx * dx + dy * dy);
    };

    const update = useCallback(
        (timestamp: number) => {
            if (gameState !== "playing" || countdown > 0) return;

            updateEnemies();
            updateTowers(timestamp);

            gameLoopRef.current = requestAnimationFrame(update);
        },
        [countdown, gameState, updateEnemies, updateTowers]
    );

    useEffect(() => {
        const savedHighScore = localStorage.getItem("towerDefenseHighScore");
        if (savedHighScore) {
            setHighScore(parseInt(savedHighScore, 10));
        }

        const savedTheme = localStorage.getItem("towerDefenseTheme");
        if (savedTheme && (savedTheme === "dark" || savedTheme === "light")) {
            setTheme(savedTheme as Theme);
            document.documentElement.setAttribute("data-theme", savedTheme);
        } else {
            document.documentElement.setAttribute("data-theme", "dark");
        }

        const savedDifficulty = localStorage.getItem("towerDefenseDifficulty");
        if (savedDifficulty && (savedDifficulty === "easy" || savedDifficulty === "medium" || savedDifficulty === "hard")) {
            setDifficulty(savedDifficulty as DifficultyLevel);
        }

        const savedTowerTheme = localStorage.getItem("towerDefenseTowerTheme");
        if (savedTowerTheme && (savedTowerTheme === "medieval" || savedTowerTheme === "futuristic" || savedTowerTheme === "fantasy")) {
            setTowerTheme(savedTowerTheme as TowerTheme);
        }

        const root = document.documentElement;
        if (theme === "dark") {
            root.style.setProperty("--primary", "#0b1120");
            root.style.setProperty("--secondary", "#1e293b");
            root.style.setProperty("--accent", "#8b5cf6");
            root.style.setProperty("--highlight", "#a78bfa");
            root.style.setProperty("--text", "#f8fafc");
            root.style.setProperty("--card", "rgba(30, 41, 59, 0.7)");
            root.style.setProperty("--card-border", "rgba(255, 255, 255, 0.1)");
            root.style.setProperty("--bg-gradient", "linear-gradient(135deg, #0b1120 0%, #1e293b 100%)");
            root.style.setProperty("--card-shadow", "0 8px 32px 0 rgba(0, 0, 0, 0.2)");
            root.style.setProperty("--footer-bg", "var(--primary)");
        } else {
            root.style.setProperty("--primary", "#efecca");
            root.style.setProperty("--secondary", "#a9cbb7");
            root.style.setProperty("--accent", "#ff934f");
            root.style.setProperty("--highlight", "#ff7517");
            root.style.setProperty("--text", "#30292f");
            root.style.setProperty("--card", "rgba(255, 255, 255, 0.85)");
            root.style.setProperty("--card-border", "rgba(94, 86, 90, 0.2)");
            root.style.setProperty("--bg-gradient", "linear-gradient(135deg, #efecca 0%, #a9cbb7 100%)");
            root.style.setProperty("--card-shadow", "6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.7)");
            root.style.setProperty("--footer-bg", "var(--secondary)");
        }

        const handleResize = () => {
            const width = Math.min(window.innerWidth - 40, 800);
            const height = Math.min(window.innerHeight - 220, 500);
            setCanvasSize({ width, height });

            const newCellSize = Math.min(Math.floor(width / 15), Math.floor(height / 10));
            setCellSize(newCellSize);
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            if (gameLoopRef.current) {
                cancelAnimationFrame(gameLoopRef.current);
            }
        };
    }, [theme]);

    useEffect(() => {
        if (gameState === "playing") {
            if (gameLoopRef.current) {
                cancelAnimationFrame(gameLoopRef.current);
            }
            gameLoopRef.current = requestAnimationFrame(update);
        } else if (gameState === "gameover" || gameState === "home" || gameState === "about") {
            if (gameLoopRef.current) {
                cancelAnimationFrame(gameLoopRef.current);
                gameLoopRef.current = 0;
            }
        }
    }, [gameState, update]);

    useEffect(() => {
        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem("towerDefenseHighScore", score.toString());
        }
    }, [score, highScore]);

    useEffect(() => {
        localStorage.setItem("towerDefenseTheme", theme);
        localStorage.setItem("towerDefenseDifficulty", difficulty);
        localStorage.setItem("towerDefenseTowerTheme", towerTheme);
    }, [theme, difficulty, towerTheme]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === "Space" || e.key === " ") {
                if (gameState === "playing" && !waveInProgress && countdown === 0) {
                    startWave();
                } else if (gameState === "gameover") {
                    setGameState("home");
                } else if (gameState === "home") {
                    startGame();
                }
            }

            if (e.key === "Escape") {
                setGameState("home");
                if (gameLoopRef.current) {
                    cancelAnimationFrame(gameLoopRef.current);
                    gameLoopRef.current = 0;
                }
            }

            if (gameState === "playing") {
                if (e.key === "1") selectTower("archer");
                if (e.key === "2") selectTower("cannon");
                if (e.key === "3") selectTower("magic");
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [countdown, gameState, startGame, startWave, waveInProgress]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const colors = {
            background: theme === "dark" ? "#0b1120" : "#efecca",
            path: theme === "dark" ? "#1e293b" : "#a9cbb7",
            tower: theme === "dark" ? "#8b5cf6" : "#ff934f",
            enemy: theme === "dark" ? "#ef4444" : "#dc2626",
            range: "rgba(255, 255, 255, 0.2)",
            text: theme === "dark" ? "#f8fafc" : "#30292f",
            healthBar: {
                background: "rgba(0, 0, 0, 0.5)",
                fill: "#10b981",
            },
        };

        ctx.fillStyle = colors.background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (mapGrid.length > 0) {
            for (let y = 0; y < mapGrid.length; y++) {
                for (let x = 0; x < mapGrid[y].length; x++) {
                    const cellType = mapGrid[y][x];

                    if (cellType === 1) {
                        ctx.fillStyle = colors.path;
                        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);

                        ctx.fillStyle = theme === "dark" ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.2)";
                        ctx.fillRect(x * cellSize + 2, y * cellSize + 2, cellSize - 4, cellSize - 4);
                    } else {
                        ctx.strokeStyle = theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)";
                        ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);

                        if (mapType === "grassland") {
                            if (Math.random() > 0.8) {
                                ctx.fillStyle = theme === "dark" ? "rgba(0, 100, 0, 0.2)" : "rgba(0, 180, 0, 0.2)";
                                ctx.beginPath();
                                ctx.arc(
                                    x * cellSize + Math.random() * cellSize,
                                    y * cellSize + Math.random() * cellSize,
                                    2,
                                    0,
                                    Math.PI * 2
                                );
                                ctx.fill();
                            }
                        } else if (mapType === "desert") {
                            if (Math.random() > 0.8) {
                                ctx.fillStyle = theme === "dark" ? "rgba(200, 180, 100, 0.2)" : "rgba(210, 180, 140, 0.3)";
                                ctx.beginPath();
                                ctx.arc(
                                    x * cellSize + Math.random() * cellSize,
                                    y * cellSize + Math.random() * cellSize,
                                    2,
                                    0,
                                    Math.PI * 2
                                );
                                ctx.fill();
                            }
                        } else if (mapType === "snow") {
                            if (Math.random() > 0.8) {
                                ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
                                ctx.beginPath();
                                ctx.arc(
                                    x * cellSize + Math.random() * cellSize,
                                    y * cellSize + Math.random() * cellSize,
                                    1,
                                    0,
                                    Math.PI * 2
                                );
                                ctx.fill();
                            }
                        }
                    }
                }
            }
        }

        if (selectedTower && gameState === "playing") {
            canvas.style.cursor = "pointer";

            const rect = canvas.getBoundingClientRect();
            const mouseX = (lastMouseX - rect.left) * (canvas.width / rect.width);
            const mouseY = (lastMouseY - rect.top) * (canvas.height / rect.height);

            const gridX = Math.floor(mouseX / cellSize);
            const gridY = Math.floor(mouseY / cellSize);

            const isValidPlacement =
                mapGrid[gridY] &&
                mapGrid[gridY][gridX] === 0 &&
                !towers.some((t) => Math.floor(t.x / cellSize) === gridX && Math.floor(t.y / cellSize) === gridY);

            const range = towerStats[selectedTower].range;
            const x = gridX * cellSize + cellSize / 2;
            const y = gridY * cellSize + cellSize / 2;

            ctx.beginPath();
            ctx.arc(x, y, range, 0, Math.PI * 2);
            ctx.fillStyle = isValidPlacement ? "rgba(72, 187, 120, 0.2)" : "rgba(239, 68, 68, 0.2)";
            ctx.fill();

            ctx.fillStyle = isValidPlacement
                ? theme === "dark"
                    ? "rgba(139, 92, 246, 0.5)"
                    : "rgba(255, 147, 79, 0.5)"
                : "rgba(239, 68, 68, 0.5)";

            drawTower(ctx, selectedTower, gridX * cellSize, gridY * cellSize, 1, towerTheme, true);
        } else {
            canvas.style.cursor = "default";
        }

        towers.forEach((tower) => {
            drawTower(ctx, tower.type, tower.x, tower.y, tower.level, towerTheme, false);

            if (tower.shotAtPosition) { // Condition simplified, lifetime of shotAtPosition is managed by updateTowers
                // Muzzle Flash
                ctx.beginPath();
                ctx.arc(tower.x + cellSize / 2, tower.y + cellSize / 2, cellSize * 0.2, 0, Math.PI * 2);
                ctx.fillStyle = theme === 'dark' ? "rgba(255, 255, 200, 0.8)" : "rgba(255, 255, 0, 0.8)";
                ctx.fill();

                // Projectile Line to where it shot
                ctx.beginPath();
                ctx.moveTo(tower.x + cellSize / 2, tower.y + cellSize / 2);
                ctx.lineTo(tower.shotAtPosition.x, tower.shotAtPosition.y);
                ctx.strokeStyle = tower.type === "archer" ? "#10b981" : tower.type === "cannon" ? "#f59e0b" : "#8b5cf6";
                ctx.lineWidth = tower.type === "cannon" ? 3 : 2;
                ctx.stroke();
                ctx.lineWidth = 1; // Reset line width
            }

            // Separately, draw a very faint static range circle if the tower currently has a target (for aiming)
            if (tower.target) {
                ctx.beginPath();
                ctx.arc(tower.x + cellSize / 2, tower.y + cellSize / 2, tower.range, 0, Math.PI * 2);
                ctx.strokeStyle = theme === "dark" ? "rgba(139, 92, 246, 0.05)" : "rgba(255, 147, 79, 0.05)";
                ctx.stroke();
            }
        });

        enemies.forEach((enemy) => {
            drawEnemy(ctx, enemy, cellSize);
        });

        ctx.fillStyle = colors.text;
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "left";
        ctx.fillText(`Wave: ${currentWave}`, 10, 25);
        ctx.fillText(`Lives: ${lives}`, 10, 50);
        ctx.fillText(`Gold: ${gold}`, 10, 75);
        ctx.fillText(`Score: ${score}`, 10, 100);

        if (!waveInProgress && gameState === "playing" && countdown === 0) {
            ctx.fillStyle = theme === "dark" ? "rgba(139, 92, 246, 0.8)" : "rgba(255, 147, 79, 0.8)";
            ctx.fillRect(canvas.width / 2 - 100, canvas.height - 50, 200, 40);
            ctx.fillStyle = "#ffffff";
            ctx.textAlign = "center";
            ctx.fillText(`Start Wave ${currentWave + 1}`, canvas.width / 2, canvas.height - 25);
        }

        if (gameState === "gameover") {
            ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = colors.text;
            ctx.font = "bold 36px Arial";
            ctx.textAlign = "center";
            ctx.fillText("Game Over", canvas.width / 2, canvas.height / 3);

            ctx.font = "24px Arial";
            ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 - 15);
            ctx.fillText(`Waves Survived: ${currentWave}`, canvas.width / 2, canvas.height / 2 + 20);
            ctx.fillText(`High Score: ${highScore}`, canvas.width / 2, canvas.height / 2 + 55);

            ctx.font = "18px Arial";
            ctx.fillText("Tap or press Space to continue", canvas.width / 2, canvas.height / 2 + 100);
        }

        if (countdown > 0 && gameState === "playing") {
            ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = theme === "dark" ? "#8b5cf6" : "#ff934f";
            ctx.font = "bold 72px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(countdown.toString(), canvas.width / 2, canvas.height / 2);
        }
    }, [
        countdown,
        currentWave,
        difficulty,
        enemies,
        gameState,
        gold,
        highScore,
        lastMouseX,
        lastMouseY,
        lives,
        mapGrid,
        mapType,
        score,
        selectedTower,
        theme,
        towerTheme,
        towers,
        waveInProgress,
        cellSize,
    ]);

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        setLastMouseX(e.clientX);
        setLastMouseY(e.clientY);
    };

    function drawTower(
        ctx: CanvasRenderingContext2D,
        type: TowerType,
        x: number,
        y: number,
        level: number,
        theme: TowerTheme,
        isPlaceholder: boolean
    ) {
        const centerX = x + cellSize / 2;
        const centerY = y + cellSize / 2;
        const towerSize = cellSize * 0.8;
        const alpha = isPlaceholder ? 0.6 : 1;

        ctx.fillStyle = getTowerBaseColor(type, theme, alpha);
        ctx.beginPath();

        if (theme === "medieval") {
            ctx.fillRect(x + cellSize * 0.1, y + cellSize * 0.1, towerSize, towerSize);
        } else if (theme === "futuristic") {
            drawHexagon(ctx, centerX, centerY, towerSize / 2);
            ctx.fill();
        } else {
            ctx.arc(centerX, centerY, towerSize / 2, 0, Math.PI * 2);
            ctx.fill();
        }

        if (type === "archer") {
            ctx.fillStyle = getTowerTopColor(type, theme, alpha);

            if (theme === "medieval") {
                ctx.beginPath();
                ctx.arc(centerX, centerY - towerSize * 0.1, towerSize * 0.3, 0, Math.PI, true);
                ctx.lineWidth = 2;
                ctx.strokeStyle = getTowerTopColor(type, theme, alpha);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(centerX, centerY - towerSize * 0.3);
                ctx.lineTo(centerX, centerY + towerSize * 0.1);
                ctx.stroke();
            } else if (theme === "futuristic") {
                ctx.fillRect(centerX - towerSize * 0.1, centerY - towerSize * 0.4, towerSize * 0.2, towerSize * 0.3);
                ctx.beginPath();
                ctx.arc(centerX, centerY - towerSize * 0.4, towerSize * 0.15, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // fantasy
                ctx.beginPath();
                ctx.arc(centerX, centerY, towerSize * 0.25, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.moveTo(centerX, centerY - towerSize * 0.3);
                ctx.lineTo(centerX, centerY + towerSize * 0.3);
                ctx.lineWidth = 3;
                ctx.strokeStyle = "rgba(16, 185, 129, " + alpha + ")";
                ctx.stroke();
            }
        } else if (type === "cannon") {
            ctx.fillStyle = getTowerTopColor(type, theme, alpha);

            if (theme === "medieval") {
                ctx.fillRect(centerX - towerSize * 0.25, centerY - towerSize * 0.3, towerSize * 0.5, towerSize * 0.3);
                ctx.beginPath();
                ctx.arc(centerX, centerY - towerSize * 0.15, towerSize * 0.1, 0, Math.PI * 2);
                ctx.fill();
            } else if (theme === "futuristic") {
                ctx.beginPath();
                ctx.moveTo(centerX - towerSize * 0.3, centerY - towerSize * 0.1);
                ctx.lineTo(centerX + towerSize * 0.3, centerY - towerSize * 0.1);
                ctx.lineTo(centerX + towerSize * 0.2, centerY + towerSize * 0.2);
                ctx.lineTo(centerX - towerSize * 0.2, centerY + towerSize * 0.2);
                ctx.closePath();
                ctx.fill();
            } else {
                // fantasy
                ctx.beginPath();
                ctx.arc(centerX, centerY, towerSize * 0.3, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(centerX, centerY, towerSize * 0.2, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(245, 158, 11, " + alpha + ")";
                ctx.fill();
            }
        } else if (type === "magic") {
            ctx.fillStyle = getTowerTopColor(type, theme, alpha);

            if (theme === "medieval") {
                ctx.beginPath();
                ctx.moveTo(centerX, centerY - towerSize * 0.4);
                ctx.lineTo(centerX - towerSize * 0.25, centerY - towerSize * 0.1);
                ctx.lineTo(centerX + towerSize * 0.25, centerY - towerSize * 0.1);
                ctx.closePath();
                ctx.fill();
            } else if (theme === "futuristic") {
                ctx.beginPath();
                ctx.arc(centerX, centerY - towerSize * 0.2, towerSize * 0.2, 0, Math.PI * 2);
                ctx.fill();

                ctx.beginPath();
                for (let i = 0; i < 8; i++) {
                    const angle = (i * Math.PI) / 4;
                    ctx.moveTo(centerX + Math.cos(angle) * towerSize * 0.2, centerY - towerSize * 0.2 + Math.sin(angle) * towerSize * 0.2);
                    ctx.lineTo(
                        centerX + Math.cos(angle) * towerSize * 0.35,
                        centerY - towerSize * 0.2 + Math.sin(angle) * towerSize * 0.35
                    );
                }
                ctx.strokeStyle = "rgba(139, 92, 246, " + alpha + ")";
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.moveTo(centerX, centerY - towerSize * 0.4);
                ctx.lineTo(centerX - towerSize * 0.2, centerY - towerSize * 0.1);
                ctx.lineTo(centerX - towerSize * 0.1, centerY + towerSize * 0.2);
                ctx.lineTo(centerX + towerSize * 0.1, centerY + towerSize * 0.2);
                ctx.lineTo(centerX + towerSize * 0.2, centerY - towerSize * 0.1);
                ctx.closePath();
                ctx.fill();
            }
        }

        if (level > 1 && !isPlaceholder) {
            ctx.fillStyle = "#fcd34d";
            for (let i = 0; i < level - 1; i++) {
                ctx.beginPath();
                ctx.arc(x + cellSize * 0.2 + i * cellSize * 0.2, y + cellSize * 0.8, cellSize * 0.05, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    function drawHexagon(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const pointX = x + size * Math.cos(angle);
            const pointY = y + size * Math.sin(angle);

            if (i === 0) {
                ctx.moveTo(pointX, pointY);
            } else {
                ctx.lineTo(pointX, pointY);
            }
        }
        ctx.closePath();
    }

    function getTowerBaseColor(type: TowerType, towerTheme: TowerTheme, alpha: number) {
        const colorMap = {
            medieval: {
                archer: "rgba(75, 85, 99, " + alpha + ")",
                cannon: "rgba(55, 65, 81, " + alpha + ")",
                magic: "rgba(107, 114, 128, " + alpha + ")",
            },
            futuristic: {
                archer: "rgba(59, 130, 246, " + alpha + ")",
                cannon: "rgba(37, 99, 235, " + alpha + ")",
                magic: "rgba(96, 165, 250, " + alpha + ")",
            },
            fantasy: {
                archer: "rgba(16, 185, 129, " + alpha + ")",
                cannon: "rgba(245, 158, 11, " + alpha + ")",
                magic: "rgba(139, 92, 246, " + alpha + ")",
            },
        };

        return colorMap[towerTheme][type];
    }

    function getTowerTopColor(type: TowerType, towerTheme: TowerTheme, alpha: number) {
        const colorMap = {
            medieval: {
                archer: "rgba(120, 53, 15, " + alpha + ")",
                cannon: "rgba(17, 24, 39, " + alpha + ")",
                magic: "rgba(30, 58, 138, " + alpha + ")",
            },
            futuristic: {
                archer: "rgba(110, 231, 183, " + alpha + ")",
                cannon: "rgba(251, 146, 60, " + alpha + ")",
                magic: "rgba(192, 132, 252, " + alpha + ")",
            },
            fantasy: {
                archer: "rgba(167, 243, 208, " + alpha + ")",
                cannon: "rgba(253, 186, 116, " + alpha + ")",
                magic: "rgba(216, 180, 254, " + alpha + ")",
            },
        };

        return colorMap[towerTheme][type];
    }

    function drawEnemy(ctx: CanvasRenderingContext2D, enemy: Enemy, cellSize: number) {
        const centerX = enemy.x + cellSize / 2;
        const centerY = enemy.y + cellSize / 2;
        const enemySize = cellSize * 0.7;

        if (enemy.type === "infantry") {
            ctx.fillStyle = theme === "dark" ? "#ef4444" : "#dc2626";
            ctx.beginPath();
            ctx.arc(centerX, centerY, enemySize / 2, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = theme === "dark" ? "#b91c1c" : "#991b1b";
            ctx.beginPath();
            ctx.arc(centerX, centerY, enemySize / 3, 0, Math.PI * 2);
            ctx.fill();
        } else if (enemy.type === "armored") {
            ctx.fillStyle = theme === "dark" ? "#9ca3af" : "#6b7280";
            ctx.fillRect(centerX - enemySize / 2, centerY - enemySize / 2, enemySize, enemySize);

            ctx.fillStyle = theme === "dark" ? "#4b5563" : "#374151";
            ctx.fillRect(centerX - enemySize / 3, centerY - enemySize / 3, (enemySize * 2) / 3, (enemySize * 2) / 3);
        } else if (enemy.type === "flying") {
            ctx.fillStyle = theme === "dark" ? "#60a5fa" : "#3b82f6";
            ctx.beginPath();
            ctx.moveTo(centerX, centerY - enemySize / 2);
            ctx.lineTo(centerX - enemySize / 2, centerY + enemySize / 2);
            ctx.lineTo(centerX + enemySize / 2, centerY + enemySize / 2);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = theme === "dark" ? "#93c5fd" : "#60a5fa";
            ctx.beginPath();
            ctx.moveTo(centerX - enemySize / 3, centerY - enemySize / 6);
            ctx.lineTo(centerX - (enemySize * 2) / 3, centerY);
            ctx.lineTo(centerX - enemySize / 3, centerY + enemySize / 6);
            ctx.closePath();
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(centerX + enemySize / 3, centerY - enemySize / 6);
            ctx.lineTo(centerX + (enemySize * 2) / 3, centerY);
            ctx.lineTo(centerX + enemySize / 3, centerY + enemySize / 6);
            ctx.closePath();
            ctx.fill();
        }

        const healthBarWidth = cellSize * 0.8;
        const healthBarHeight = cellSize * 0.1;
        const healthPercent = enemy.health / enemy.maxHealth;

        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(centerX - healthBarWidth / 2, centerY - enemySize / 2 - healthBarHeight - 2, healthBarWidth, healthBarHeight);

        ctx.fillStyle = healthPercent > 0.6 ? "#10b981" : healthPercent > 0.3 ? "#f59e0b" : "#ef4444";
        ctx.fillRect(
            centerX - healthBarWidth / 2,
            centerY - enemySize / 2 - healthBarHeight - 2,
            healthBarWidth * healthPercent,
            healthBarHeight
        );
    }

    const changeDifficulty = (newDifficulty: DifficultyLevel) => {
        setDifficulty(newDifficulty);
        localStorage.setItem("towerDefenseDifficulty", newDifficulty);
    };

    const changeTowerTheme = (newTheme: TowerTheme) => {
        setTowerTheme(newTheme);
        localStorage.setItem("towerDefenseTowerTheme", newTheme);
    };

    const changeMapType = (newMapType: MapType) => {
        setMapType(newMapType);
    };

    const toggleSound = () => {
        setSoundEnabled(!soundEnabled);
    };

    const handleStartWaveClick = () => {
        if (gameState === "playing" && !waveInProgress && countdown === 0) {
            startWave();
        }
    };

    const renderHomePage = () => (
        <div className="home-container">
            <div
                className="game-card"
                style={{
                    background: "var(--card)",
                    boxShadow: "var(--card-shadow)",
                    borderColor: "var(--card-border)",
                    color: "var(--text)",
                }}
            >
                <h2 className="game-title" style={{ color: "var(--accent)" }}>
                    Tower Defense Strategy
                </h2>

                <div className="game-animation" style={{ background: "var(--primary)" }}>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="tower" style={{ background: "var(--accent)" }}></div>

                        <div
                            className="enemy"
                            style={{
                                transform: "translateX(100%)",
                                animation: "moveLeft 3s linear infinite",
                            }}
                        >
                            <div className="enemy-shape" style={{ background: "var(--highlight)" }}></div>
                        </div>
                    </div>
                </div>

                <p className="game-desc">
                    Defend your territory by strategically placing towers to stop the invading enemies. Upgrade your defenses and survive
                    increasingly difficult waves!
                </p>

                <div className="btn-group">
                    <button
                        onClick={startGame}
                        className="btn-primary"
                        style={{
                            background: "var(--accent)",
                            color: "#ffffff",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        Start Game
                    </button>

                    <button
                        onClick={() => setGameState("about")}
                        className="btn-secondary"
                        style={{
                            background: "var(--card)",
                            color: "var(--text)",
                            border: "2px solid var(--accent)",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        How to Play
                    </button>
                </div>
            </div>

            <div className="features-container">
                <div
                    className="feature-card"
                    style={{
                        background: "var(--card)",
                        boxShadow: "var(--card-shadow)",
                        borderColor: "var(--card-border)",
                        color: "var(--text)",
                    }}
                >
                    <h3 className="card-title" style={{ color: "var(--highlight)" }}>
                        Game Features
                    </h3>
                    <ul className="feature-list">
                        <li className="feature-item">
                            <span className="bullet" style={{ background: "var(--highlight)" }}></span>
                            <span>Strategic tower placement and upgrade system</span>
                        </li>
                        <li className="feature-item">
                            <span className="bullet" style={{ background: "var(--highlight)" }}></span>
                            <span>Three unique tower types with different abilities</span>
                        </li>
                        <li className="feature-item">
                            <span className="bullet" style={{ background: "var(--highlight)" }}></span>
                            <span>Multiple enemy types with varying strengths and weaknesses</span>
                        </li>
                        <li className="feature-item">
                            <span className="bullet" style={{ background: "var(--highlight)" }}></span>
                            <span>Three different maps with unique path layouts</span>
                        </li>
                        <li className="feature-item">
                            <span className="bullet" style={{ background: "var(--highlight)" }}></span>
                            <span>Progressive difficulty with increasing wave challenge</span>
                        </li>
                    </ul>
                </div>

                <div
                    className="feature-card"
                    style={{
                        background: "var(--card)",
                        boxShadow: "var(--card-shadow)",
                        borderColor: "var(--card-border)",
                        color: "var(--text)",
                    }}
                >
                    <h3 className="card-title" style={{ color: "var(--highlight)" }}>
                        Game Settings
                    </h3>

                    <div className="setting-group">
                        <h4 className="setting-title">Difficulty Level</h4>
                        <div className="setting-options">
                            {["easy", "medium", "hard"].map((level) => (
                                <button
                                    key={level}
                                    onClick={() => changeDifficulty(level as DifficultyLevel)}
                                    className="option-btn"
                                    style={{
                                        background: difficulty === level ? "var(--accent)" : "var(--card)",
                                        color: difficulty === level ? "#ffffff" : "var(--text)",
                                        border: `1px solid ${difficulty === level ? "transparent" : "var(--card-border)"}`,
                                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                    }}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="setting-group">
                        <h4 className="setting-title">Tower Theme</h4>
                        <div className="setting-options">
                            {[
                                { id: "medieval", name: "Medieval", color: theme === "dark" ? "#6b7280" : "#9ca3af" },
                                { id: "futuristic", name: "Futuristic", color: theme === "dark" ? "#3b82f6" : "#60a5fa" },
                                { id: "fantasy", name: "Fantasy", color: theme === "dark" ? "#8b5cf6" : "#a78bfa" },
                            ].map((themeOption) => (
                                <button
                                    key={themeOption.id}
                                    onClick={() => changeTowerTheme(themeOption.id as TowerTheme)}
                                    className="theme-btn"
                                    style={{
                                        background: towerTheme === themeOption.id ? "rgba(var(--highlight-rgb), 0.1)" : "var(--card)",
                                        color: "var(--text)",
                                        border: `1px solid ${towerTheme === themeOption.id ? "var(--highlight)" : "var(--card-border)"}`,
                                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                    }}
                                >
                                    <div className="theme-circle" style={{ background: themeOption.color }}></div>
                                    <span className="theme-name">{themeOption.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="setting-group">
                        <h4 className="setting-title">Map Selection</h4>
                        <div className="setting-options">
                            {[
                                { id: "grassland", name: "Grassland", color: theme === "dark" ? "#065f46" : "#10b981" },
                                { id: "desert", name: "Desert", color: theme === "dark" ? "#92400e" : "#f59e0b" },
                                { id: "snow", name: "Snow", color: theme === "dark" ? "#1e40af" : "#3b82f6" },
                            ].map((mapOption) => (
                                <button
                                    key={mapOption.id}
                                    onClick={() => changeMapType(mapOption.id as MapType)}
                                    className="theme-btn"
                                    style={{
                                        background: mapType === mapOption.id ? "rgba(var(--highlight-rgb), 0.1)" : "var(--card)",
                                        color: "var(--text)",
                                        border: `1px solid ${mapType === mapOption.id ? "var(--highlight)" : "var(--card-border)"}`,
                                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                    }}
                                >
                                    <div className="theme-circle" style={{ background: mapOption.color }}></div>
                                    <span className="theme-name">{mapOption.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="setting-title">Sound</h4>
                        <button
                            onClick={toggleSound}
                            className="toggle-btn"
                            style={{
                                background: "var(--card)",
                                color: "var(--text)",
                                border: "1px solid var(--card-border)",
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                            <span>{soundEnabled ? "Sound On" : "Sound Off"}</span>
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes moveLeft {
                    0% {
                        transform: translateX(100%);
                    }
                    100% {
                        transform: translateX(-100%);
                    }
                }

                .home-container {
                    width: 100%;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 2rem 1rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .game-card {
                    max-width: 32rem;
                    padding: 1.5rem;
                    border-radius: 0.75rem;
                    margin-bottom: 2rem;
                    text-align: center;
                }

                .game-title {
                    font-size: 1.875rem;
                    font-weight: 700;
                    margin-bottom: 1.5rem;
                }

                .game-animation {
                    position: relative;
                    height: 16rem;
                    width: 100%;
                    margin-bottom: 2rem;
                    border-radius: 0.5rem;
                    overflow: hidden;
                }

                .tower {
                    width: 3rem;
                    height: 3rem;
                    border-radius: 0.5rem;
                    position: relative;
                }

                .tower::after {
                    content: "";
                    position: absolute;
                    top: -1.5rem;
                    left: 1rem;
                    width: 1rem;
                    height: 1.5rem;
                    background: inherit;
                    border-radius: 0.25rem;
                }

                .enemy {
                    position: absolute;
                    height: 100%;
                    display: flex;
                    align-items: center;
                }

                .enemy-shape {
                    width: 2rem;
                    height: 2rem;
                    border-radius: 50%;
                }

                .game-desc {
                    margin-bottom: 1.5rem;
                }

                .btn-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                    justify-content: center;
                    margin-bottom: 1.5rem;
                }

                @media (min-width: 640px) {
                    .btn-group {
                        flex-direction: row;
                    }
                }

                .btn-primary,
                .btn-secondary {
                    padding: 0.75rem 2rem;
                    border-radius: 9999px;
                    font-size: 1.125rem;
                    font-weight: 600;
                    transition: transform 0.2s;
                }

                .btn-primary:hover,
                .btn-secondary:hover {
                    transform: scale(1.05);
                }

                .features-container {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    width: 100%;
                    max-width: 1024px;
                }

                @media (min-width: 768px) {
                    .features-container {
                        flex-direction: row;
                    }
                }

                .feature-card {
                    flex: 1;
                    padding: 1.5rem;
                    border-radius: 0.75rem;
                }

                .card-title {
                    font-size: 1.25rem;
                    font-weight: 700;
                    margin-bottom: 1rem;
                }

                .feature-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .feature-item {
                    display: flex;
                    align-items: start;
                }

                .bullet {
                    display: inline-block;
                    width: 0.5rem;
                    height: 0.5rem;
                    margin-top: 0.5rem;
                    margin-right: 0.5rem;
                    border-radius: 9999px;
                }

                .setting-group {
                    margin-bottom: 1.5rem;
                }

                .setting-title {
                    font-weight: 500;
                    margin-bottom: 0.5rem;
                }

                .setting-options {
                    display: flex;
                    gap: 0.5rem;
                }

                .option-btn {
                    flex: 1;
                    padding: 0.5rem 0.75rem;
                    border-radius: 0.5rem;
                    font-size: 0.875rem;
                    font-weight: 500;
                    text-transform: capitalize;
                }

                .theme-btn {
                    flex: 1;
                    padding: 0.5rem;
                    border-radius: 0.5rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                }

                .theme-circle {
                    width: 2rem;
                    height: 2rem;
                    border-radius: 9999px;
                }

                .theme-name {
                    font-size: 0.75rem;
                }

                .toggle-btn {
                    width: 100%;
                    padding: 0.5rem 0.75rem;
                    border-radius: 0.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                }
            `}</style>
        </div>
    );

    const renderGameScreen = () => (
        <div className="game-view">
            <div className="game-controls">
                <div className="tower-selection">
                    <h3 className="control-title">Towers</h3>
                    <div className="tower-buttons">
                        {[
                            { type: "archer", name: "Archer", icon: <Target size={16} />, cost: towerStats.archer.cost },
                            { type: "cannon", name: "Cannon", icon: <Shield size={16} />, cost: towerStats.cannon.cost },
                            { type: "magic", name: "Magic", icon: <Zap size={16} />, cost: towerStats.magic.cost },
                        ].map((tower) => (
                            <button
                                key={tower.type}
                                onClick={() => selectTower(tower.type as TowerType)}
                                className={`tower-btn ${selectedTower === tower.type ? "selected" : ""}`}
                                style={{
                                    background: selectedTower === tower.type ? "var(--accent)" : "var(--card)",
                                    color: selectedTower === tower.type ? "#ffffff" : "var(--text)",
                                    boxShadow: "var(--card-shadow)",
                                    opacity: (selectedTower !== tower.type && gold < tower.cost) ? 0.5 : 1,
                                }}
                                disabled={selectedTower !== tower.type && gold < tower.cost}
                            >
                                <span className="tower-icon">{tower.icon}</span>
                                <span className="tower-name">{tower.name}</span>
                                <span className="tower-cost">{tower.cost}g</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="game-info">
                    <div className="info-item">
                        <span className="info-label">Wave:</span>
                        <span className="info-value">{currentWave}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Lives:</span>
                        <span className="info-value">{lives}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Gold:</span>
                        <span className="info-value">{gold}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Score:</span>
                        <span className="info-value">{score}</span>
                    </div>
                </div>

                {/* {!waveInProgress && countdown === 0 && (
                    <button
                        onClick={handleStartWaveClick}
                        className="start-wave-btn"
                        style={{
                            background: "var(--accent)",
                            color: "#ffffff",
                            boxShadow: "var(--card-shadow)",
                        }}
                    >
                        Start Wave {currentWave + 1}
                    </button>
                )} */}
            </div>

            <div
                className="canvas-wrap"
                style={{
                    height: `${canvasSize.height}px`,
                    background: "var(--primary)",
                    boxShadow: "var(--card-shadow)",
                    borderColor: "var(--card-border)",
                }}
            >
                <canvas
                    ref={canvasRef}
                    width={canvasSize.width}
                    height={canvasSize.height}
                    className="game-canvas"
                    onClick={handleCanvasClick}
                    onMouseMove={handleMouseMove}
                    style={{ touchAction: "none" }}
                />

                {selectedTowerIndex !== null && towers[selectedTowerIndex] && (
                    <div
                        className="tower-panel"
                        style={{
                            position: "absolute",
                            bottom: "10px",
                            left: "10px",
                            background: "var(--card)",
                            borderRadius: "0.5rem",
                            padding: "0.5rem",
                            boxShadow: "var(--card-shadow)",
                            color: "var(--text)",
                            width: "220px",
                        }}
                    >
                        <div className="panel-header" style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                            <h4 style={{ margin: 0 }}>
                                {towers[selectedTowerIndex].type.charAt(0).toUpperCase() + towers[selectedTowerIndex].type.slice(1)}
                                Tower (Level {towers[selectedTowerIndex].level})
                            </h4>
                            <button
                                onClick={() => setSelectedTowerIndex(null)}
                                style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text)" }}
                            >
                                &times;
                            </button>
                        </div>

                        <div className="tower-stats" style={{ fontSize: "0.8rem", marginBottom: "0.5rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span>Damage:</span>
                                <span>{towers[selectedTowerIndex].damage}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span>Range:</span>
                                <span>{towers[selectedTowerIndex].range}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span>Fire Rate:</span>
                                <span>{(1000 / towers[selectedTowerIndex].fireRate).toFixed(1)} /sec</span>
                            </div>

                            {towers[selectedTowerIndex].special && (
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span>Special:</span>
                                    <span>
                                        {towers[selectedTowerIndex].special.effect.charAt(0).toUpperCase() +
                                            towers[selectedTowerIndex].special.effect.slice(1)}{" "}
                                        ({Math.round(towers[selectedTowerIndex].special.chance * 100)}%)
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="targeting-modes" style={{ marginBottom: "0.5rem" }}>
                            <div style={{ fontSize: "0.8rem", marginBottom: "0.2rem" }}>Targeting:</div>
                            <div style={{ display: "flex", gap: "0.25rem" }}>
                                {(["first", "last", "strongest", "weakest"] as TargetingMode[]).map((mode) => (
                                    <button
                                        key={mode}
                                        onClick={() => changeTargetingMode(selectedTowerIndex, mode)}
                                        className={`target-btn ${towers[selectedTowerIndex].targetingMode === mode ? "selected" : ""}`}
                                        style={{
                                            padding: "0.25rem 0.5rem",
                                            fontSize: "0.7rem",
                                            background:
                                                towers[selectedTowerIndex].targetingMode === mode ? "var(--accent)" : "var(--secondary)",
                                            color: towers[selectedTowerIndex].targetingMode === mode ? "#ffffff" : "var(--text)",
                                            borderRadius: "0.25rem",
                                            border: "none",
                                            cursor: "pointer",
                                            flex: 1,
                                        }}
                                    >
                                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="tower-actions" style={{ display: "flex", gap: "0.5rem" }}>
                            {towers[selectedTowerIndex].level < 3 && (
                                <button
                                    onClick={() => upgradeTower(selectedTowerIndex)}
                                    disabled={
                                        gold < towerStats[towers[selectedTowerIndex].type].upgradeCost[towers[selectedTowerIndex].level]
                                    }
                                    style={{
                                        flex: 2,
                                        padding: "0.5rem",
                                        background: "var(--accent)",
                                        color: "#ffffff",
                                        borderRadius: "0.25rem",
                                        border: "none",
                                        cursor: "pointer",
                                        opacity:
                                            gold < towerStats[towers[selectedTowerIndex].type].upgradeCost[towers[selectedTowerIndex].level]
                                                ? 0.5
                                                : 1,
                                    }}
                                >
                                    Upgrade ({towerStats[towers[selectedTowerIndex].type].upgradeCost[towers[selectedTowerIndex].level]}g)
                                </button>
                            )}
                            {towers[selectedTowerIndex].level === 3 && (
                                <div
                                    style={{
                                        flex: 2,
                                        padding: "0.5rem",
                                        background: "var(--secondary)",
                                        color: "var(--text)",
                                        borderRadius: "0.25rem",
                                        textAlign: "center",
                                        fontSize: "0.8rem",
                                    }}
                                >
                                    Max Level
                                </div>
                            )}
                            <button
                                onClick={() => sellTower(selectedTowerIndex)}
                                style={{
                                    flex: 1,
                                    padding: "0.5rem",
                                    background: "#ef4444",
                                    color: "#ffffff",
                                    borderRadius: "0.25rem",
                                    border: "none",
                                    cursor: "pointer",
                                }}
                            >
                                Sell (+{Math.floor(towers[selectedTowerIndex].cost * 0.5 * towers[selectedTowerIndex].level)}g)
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="game-tip" style={{ color: "var(--text)" }}>
                <p>Tip: Click to place selected tower. Press 1-3 to select towers. Click on towers to upgrade.</p>
            </div>

            <style jsx>{`
                .game-view {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 1.5rem 1rem;
                }

                .game-controls {
                    width: 100%;
                    max-width: ${canvasSize.width}px;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 1rem;
                    margin-bottom: 1rem;
                    justify-content: space-between;
                }

                .tower-selection {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .control-title {
                    font-weight: 600;
                    color: var(--text);
                }

                .tower-buttons {
                    display: flex;
                    gap: 0.5rem;
                }

                .tower-btn {
                    padding: 0.5rem;
                    border-radius: 0.5rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.25rem;
                    min-width: 4rem;
                    transition: transform 0.2s;
                }

                .tower-btn:not(:disabled):hover {
                    transform: scale(1.05);
                }

                .tower-btn.selected {
                    border: 2px solid var(--highlight);
                }

                .tower-icon {
                    margin-bottom: 0.25rem;
                }

                .tower-name {
                    font-size: 0.75rem;
                    font-weight: 500;
                }

                .tower-cost {
                    font-size: 0.7rem;
                    opacity: 0.8;
                }

                .game-info {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                }

                .info-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    color: var(--text);
                }

                .info-label {
                    font-size: 0.75rem;
                    opacity: 0.8;
                }

                .info-value {
                    font-weight: 600;
                    font-size: 1.125rem;
                }

                /* .start-wave-btn {
                    padding: 0.5rem 1rem;
                    border-radius: 0.5rem;
                    font-weight: 600;
                    transition: transform 0.2s;
                }

                .start-wave-btn:hover {
                    transform: scale(1.05);
                } */

                .canvas-wrap {
                    position: relative;
                    width: 100%;
                    max-width: ${canvasSize.width}px;
                    border-radius: 0.75rem;
                    overflow: hidden;
                }

                .game-canvas {
                    width: 100%;
                    height: 100%;
                }

                .game-tip {
                    margin-top: 1rem;
                    font-size: 0.875rem;
                    text-align: center;
                }
            `}</style>
        </div>
    );

    const renderAboutScreen = () => (
        <div className="about-container">
            <div
                className="about-card"
                style={{
                    background: "var(--card)",
                    boxShadow: "var(--card-shadow)",
                    borderColor: "var(--card-border)",
                    color: "var(--text)",
                }}
            >
                <h2 className="about-title" style={{ color: "var(--accent)" }}>
                    How to Play Tower Defense
                </h2>

                <p className="about-text">
                    Tower Defense is a strategy game where you must place defensive towers along a path to prevent enemies from reaching the
                    end. Plan your defenses carefully and upgrade strategically to survive increasingly difficult waves!
                </p>

                <h3 className="section-title" style={{ color: "var(--highlight)" }}>
                    Game Basics
                </h3>

                <ul className="info-list">
                    <li className="info-item">
                        <span className="info-bullet" style={{ background: "var(--highlight)" }}></span>
                        <span>Enemies follow a fixed path across the map</span>
                    </li>
                    <li className="info-item">
                        <span className="info-bullet" style={{ background: "var(--highlight)" }}></span>
                        <span>Place towers strategically to attack enemies</span>
                    </li>
                    <li className="info-item">
                        <span className="info-bullet" style={{ background: "var(--highlight)" }}></span>
                        <span>Each enemy that reaches the end costs you one life</span>
                    </li>
                    <li className="info-item">
                        <span className="info-bullet" style={{ background: "var(--highlight)" }}></span>
                        <span>Defeating enemies gives you gold to build more towers</span>
                    </li>
                    <li className="info-item">
                        <span className="info-bullet" style={{ background: "var(--highlight)" }}></span>
                        <span>Game ends when you run out of lives</span>
                    </li>
                </ul>

                <h3 className="section-title" style={{ color: "var(--highlight)" }}>
                    Tower Types
                </h3>

                <ul className="info-list">
                    <li className="info-item">
                        <span className="info-bullet" style={{ background: "var(--highlight)" }}></span>
                        <span>
                            <strong>Archer Tower:</strong> Fast firing rate, medium damage, long range. Good all-around tower.
                        </span>
                    </li>
                    <li className="info-item">
                        <span className="info-bullet" style={{ background: "var(--highlight)" }}></span>
                        <span>
                            <strong>Cannon Tower:</strong> Slow firing rate, high damage, short range. Effective against armored enemies.
                        </span>
                    </li>
                    <li className="info-item">
                        <span className="info-bullet" style={{ background: "var(--highlight)" }}></span>
                        <span>
                            <strong>Magic Tower:</strong> Medium firing rate, medium damage, very long range. The only tower that can hit
                            flying enemies.
                        </span>
                    </li>
                </ul>

                <h3 className="section-title" style={{ color: "var(--highlight)" }}>
                    Enemy Types
                </h3>

                <ul className="info-list">
                    <li className="info-item">
                        <span className="info-bullet" style={{ background: "var(--highlight)" }}></span>
                        <span>
                            <strong>Infantry:</strong> Basic enemies with medium health and speed.
                        </span>
                    </li>
                    <li className="info-item">
                        <span className="info-bullet" style={{ background: "var(--highlight)" }}></span>
                        <span>
                            <strong>Armored:</strong> High health but slower movement. Resistant to archer towers.
                        </span>
                    </li>
                    <li className="info-item">
                        <span className="info-bullet" style={{ background: "var(--highlight)" }}></span>
                        <span>
                            <strong>Flying:</strong> Fast with low health, but can only be hit by magic towers.
                        </span>
                    </li>
                </ul>

                <h3 className="section-title" style={{ color: "var(--highlight)" }}>
                    Tips & Strategies
                </h3>

                <ul className="info-list">
                    <li className="info-item">
                        <span className="info-bullet" style={{ background: "var(--highlight)" }}></span>
                        <span>Place towers at corners and intersections for maximum exposure to enemies</span>
                    </li>
                    <li className="info-item">
                        <span className="info-bullet" style={{ background: "var(--highlight)" }}></span>
                        <span>Build a mix of tower types to deal with different enemy types</span>
                    </li>
                    <li className="info-item">
                        <span className="info-bullet" style={{ background: "var(--highlight)" }}></span>
                        <span>Always include at least one magic tower to handle flying enemies</span>
                    </li>
                    <li className="info-item">
                        <span className="info-bullet" style={{ background: "var(--highlight)" }}></span>
                        <span>Upgrade existing towers instead of building too many new ones</span>
                    </li>
                    <li className="info-item">
                        <span className="info-bullet" style={{ background: "var(--highlight)" }}></span>
                        <span>Save gold between waves for more powerful tower upgrades</span>
                    </li>
                </ul>

                <div className="back-btn-wrap">
                    <button
                        onClick={() => setGameState("home")}
                        className="back-btn"
                        style={{
                            background: "var(--accent)",
                            color: "#ffffff",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <Home size={18} />
                        <span>Back to Home</span>
                    </button>
                </div>
            </div>

            <style jsx>{`
                .about-container {
                    width: 100%;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 2rem 1rem;
                }

                .about-card {
                    max-width: 42rem;
                    margin: 0 auto;
                    padding: 1.5rem;
                    border-radius: 0.75rem;
                }

                .about-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin-bottom: 1.5rem;
                }

                .about-text {
                    margin-bottom: 1rem;
                }

                .section-title {
                    font-size: 1.25rem;
                    font-weight: 700;
                    margin: 1.5rem 0 0.75rem;
                }

                .info-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    margin-bottom: 1.5rem;
                }

                .info-item {
                    display: flex;
                    align-items: start;
                }

                .info-bullet {
                    display: inline-block;
                    width: 0.5rem;
                    height: 0.5rem;
                    margin-top: 0.5rem;
                    margin-right: 0.5rem;
                    border-radius: 9999px;
                }

                .back-btn-wrap {
                    display: flex;
                    justify-content: center;
                    margin-top: 2rem;
                }

                .back-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1.5rem;
                    border-radius: 0.5rem;
                }
            `}</style>
        </div>
    );

    const renderContent = () => {
        switch (gameState) {
            case "home":
                return renderHomePage();
            case "playing":
            case "gameover":
                return renderGameScreen();
            case "about":
                return renderAboutScreen();
            default:
                return renderHomePage();
        }
    };

    return (
        <div className="app-wrapper" style={{ background: "var(--bg-gradient)" }}>
            <Head>
                <title>Tower Defense Strategy</title>
                <meta name="description" content="A strategic tower defense game" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
            </Head>

            <header className="app-header">
                <h1 className="logo-text" style={{ color: "var(--text)" }}>
                    Tower{" "}
                    <span className="logo-accent" style={{ color: "var(--highlight)" }}>
                        Defense
                    </span>
                </h1>
                <div className="header-controls">
                    <button
                        onClick={toggleSound}
                        className="icon-btn"
                        style={{ background: "var(--card)", color: "var(--text)" }}
                        aria-label={soundEnabled ? "Mute sound" : "Enable sound"}
                    >
                        {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                    </button>
                    <button
                        onClick={toggleTheme}
                        className="icon-btn"
                        style={{ background: "var(--card)", color: "var(--text)" }}
                        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                    >
                        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>
            </header>

            <nav className="main-nav">
                <ul className="nav-list">
                    <li>
                        <button
                            onClick={() => setGameState("home")}
                            className="nav-link"
                            style={{
                                color: gameState === "home" ? "var(--highlight)" : "var(--text)",
                            }}
                        >
                            <Home size={16} />
                            <span>Home</span>
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={startGame}
                            className="nav-link"
                            style={{
                                color: gameState === "playing" || gameState === "gameover" ? "var(--highlight)" : "var(--text)",
                            }}
                        >
                            <Trophy size={16} />
                            <span>Play</span>
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setGameState("about")}
                            className="nav-link"
                            style={{
                                color: gameState === "about" ? "var(--highlight)" : "var(--text)",
                            }}
                        >
                            <Info size={16} />
                            <span>About</span>
                        </button>
                    </li>
                </ul>
            </nav>

            <main className="main-content">{renderContent()}</main>

            <footer className="app-footer" style={{ color: "var(--text)" }}>
                <p>© {new Date().getFullYear()} Tower Defense Strategy. All rights reserved.</p>
                <div className="social-icons">
                    <a href="#" target="_blank" rel="noopener noreferrer" className="social-icon cursor-pointer">
                        <Github size={20} />
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer" className="social-icon cursor-pointer">
                        <Twitter size={20} />
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer" className="social-icon cursor-pointer">
                        <Linkedin size={20} />
                    </a>
                </div>
            </footer>

            <style jsx>{`
                .app-wrapper {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                }

                .app-header {
                    padding: 1rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .logo-text {
                    font-size: 1.5rem;
                    font-weight: 700;
                }

                @media (min-width: 768px) {
                    .logo-text {
                        font-size: 1.875rem;
                    }
                }

                .logo-accent {
                    font-size: 1.25rem;
                }

                .header-controls {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .icon-btn {
                    padding: 0.5rem;
                    border-radius: 9999px;
                }

                .main-nav {
                    padding: 0.5rem 1rem;
                    margin-bottom: 1rem;
                    display: flex;
                    justify-content: center;
                }

                .nav-list {
                    display: flex;
                    gap: 1.5rem;
                }

                .nav-link {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    font-size: 0.875rem;
                }

                @media (min-width: 768px) {
                    .nav-link {
                        font-size: 1rem;
                    }
                }

                .main-content {
                    min-height: calc(100vh - 130px);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .app-footer {
                    padding: 1rem;
                    text-align: center;
                    font-size: 0.875rem;
                    background: var(--footer-bg);
                    border-top: 1px solid var(--card-border);
                }

                .social-icons {
                    display: flex;
                    justify-content: center;
                    gap: 1rem;
                    margin-top: 0.5rem;
                }

                .social-icon {
                    color: var(--text);
                    opacity: 0.7;
                    transition: opacity 0.2s ease-in-out;
                }

                .social-icon:hover {
                    opacity: 1;
                }
            `}</style>
        </div>
    );
};

export default TowerDefenseGame;
