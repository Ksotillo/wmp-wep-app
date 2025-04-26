"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Trophy, Info, X, Sun, Moon } from "lucide-react";
import { Raleway, Source_Sans_3 } from 'next/font/google';

const raleway = Raleway({
    subsets: ['latin'],
    weight: ['700'], 
    variable: '--font-raleway',
    display: 'swap',
});

const sourceSans3 = Source_Sans_3({
    subsets: ['latin'],
    weight: ['400', '600'],
    variable: '--font-source-sans-3',
    display: 'swap',
});


const headingFont = raleway.className;
const bodyFont = sourceSans3.className;

type Grid = boolean[][];
type Theme = 'light' | 'dark';

const storageKeyBestScore = 'lightsOutBestScore';

const LightsOutGame = () => {
    const gridSize = 5;
    const [grid, setGrid] = useState<Grid>([]);
    const [moves, setMoves] = useState(0);
    const [isSolved, setIsSolved] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [theme, setTheme] = useState<Theme>('light');
    const [bestScore, setBestScore] = useState<number | null>(null);

    useEffect(() => {
        const storedTheme = localStorage.getItem('lightsOutTheme') as Theme | null;
        if (storedTheme) {
            setTheme(storedTheme);
        } else {
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            setTheme(prefersDark ? 'dark' : 'light');
        }

        const storedBestScore = localStorage.getItem(storageKeyBestScore);
        if (storedBestScore) {
            setBestScore(parseInt(storedBestScore, 10));
        }

        resetGame();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        localStorage.setItem('lightsOutTheme', theme);
    }, [theme]);
    useEffect(() => {
        if (isSolved) {
            if (bestScore === null || moves < bestScore) {
                setBestScore(moves);
                localStorage.setItem(storageKeyBestScore, moves.toString());
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSolved]);
    const toggleTheme = (): void => {
        setTheme((prevTheme) => {
            const newTheme = prevTheme === 'light' ? 'dark' : 'light';
            return newTheme;
        });
    };
    const createInitialGrid = (): Grid => {
        return Array.from({ length: gridSize }, () =>
            Array.from({ length: gridSize }, () => Math.random() > 0.65)
        );
    };
    const resetGame = (): void => {
        let newGrid = createInitialGrid();
        while (newGrid.every((row) => row.every((cell) => !cell))) {
            newGrid = createInitialGrid();
        }
        setGrid(newGrid);
        setMoves(0);
        setIsSolved(false);
    };
    const toggleCell = (row: number, col: number): void => {
        if (isSolved) return;
        const newGrid = grid.map((r) => [...r]);
        const toggle = (r: number, c: number): void => {
            if (r >= 0 && r < gridSize && c >= 0 && c < gridSize) {
                newGrid[r][c] = !newGrid[r][c];
            }
        };
        toggle(row, col); toggle(row - 1, col); toggle(row + 1, col); toggle(row, col - 1); toggle(row, col + 1);
        setGrid(newGrid);
        setMoves((prevMoves) => prevMoves + 1);
        checkSolved(newGrid);
    };
    const checkSolved = (currentGrid: Grid): void => {
        const allOff = currentGrid.every((row) => row.every((cell) => !cell));
        if (allOff !== isSolved) {
                setIsSolved(allOff);
        }
    };
    const cellVariants = {
        off_light: { backgroundColor: "#cbd5e1", scale: 1 }, 
        on_light: { backgroundColor: "#818cf8", scale: 1.05 }, 
        off_dark: { backgroundColor: "#475569", scale: 1 }, 
        on_dark: { backgroundColor: "#a5b4fc", scale: 1.05 }, 
    };
    const modalVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 },
    };
    const getCellAnimationTarget = (cellIsOn: boolean): string => {
        if (theme === 'dark') {
            return cellIsOn ? "on_dark" : "off_dark";
        } else {
            return cellIsOn ? "on_light" : "off_light";
        }
    };

    return (
        <div
            className={`min-h-screen ${bodyFont} flex flex-col items-center justify-center p-4 
                        ${theme === 'light'
                            ? 'bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 text-slate-800'
                            : 'bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 text-slate-200'}
                        transition-colors duration-300`}
        >
            <motion.h1
                className={`text-4xl md:text-5xl font-bold ${headingFont} mb-6`}
                animate={{
                    textShadow: theme === 'light'
                        ? ["0 0 4px rgba(99, 102, 241, 0.3)", "0 0 12px rgba(99, 102, 241, 0.5)", "0 0 4px rgba(99, 102, 241, 0.3)"]
                        : ["0 0 4px rgba(165, 180, 252, 0.4)", "0 0 12px rgba(165, 180, 252, 0.6)", "0 0 4px rgba(165, 180, 252, 0.4)"]
                }}
                transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut"
                }}
            >
                <span className={`bg-clip-text text-transparent 
                    ${theme === 'light'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600'
                        : 'bg-gradient-to-r from-indigo-400 to-purple-400'}
                    `}>
                    Lights Out
                </span>
            </motion.h1>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`relative max-w-xs w-full rounded-3xl shadow-xl p-5 md:p-6 border 
                           ${theme === 'light'
                               ? 'bg-white border-slate-100'
                               : 'bg-slate-800 border-slate-700 shadow-2xl'}`}
            >
                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={resetGame}
                        aria-label="Reset Game"
                        className={`p-2 rounded-full transition-colors cursor-pointer 
                                   ${theme === 'light'
                                       ? 'text-indigo-600 bg-indigo-100 hover:bg-indigo-200'
                                       : 'text-indigo-300 bg-slate-700 hover:bg-slate-600'}`}
                    >
                        <RotateCcw size={20} />
                    </button>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsInfoModalOpen(true)}
                            aria-label="How to Play"
                            className={`p-2 rounded-full transition-colors cursor-pointer 
                                       ${theme === 'light'
                                           ? 'text-slate-600 bg-slate-100 hover:bg-slate-200'
                                           : 'text-slate-400 bg-slate-700 hover:bg-slate-600'}`}
                        >
                            <Info size={20} />
                        </button>
                        <button
                            onClick={toggleTheme}
                            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                            className={`p-2 rounded-full transition-colors cursor-pointer 
                                       ${theme === 'light'
                                           ? 'text-slate-600 bg-slate-100 hover:bg-slate-200'
                                           : 'text-slate-400 bg-slate-700 hover:bg-slate-600'}`}
                        >
                            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                        </button>
                    </div>
                </div>

                <div
                    className={`mb-6 flex justify-around items-center rounded-lg p-3 shadow-inner 
                               ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}
                >
                    <div className="text-center overflow-hidden">
                        <span
                            className={`text-xs block 
                                       ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}
                        >
                            Moves
                        </span>
                        <div className="relative h-7">
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={moves}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className={`absolute inset-0 text-xl font-semibold ${headingFont} 
                                               ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-300'}`}
                                >
                                    {moves}
                                </motion.span>
                            </AnimatePresence>
                        </div>
                    </div>
                    <div className="text-center">
                         <span
                             className={`text-xs block 
                                        ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}
                         >
                             Best
                         </span>
                         <span
                             className={`text-xl font-semibold ${headingFont} 
                                        ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-300'}`}
                         >
                             {bestScore !== null ? bestScore : '-'}
                         </span>
                     </div>
                    <AnimatePresence>
                        {isSolved && (
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.5, opacity: 0 }}
                                className={`flex items-center gap-1 py-1 px-3 rounded-full text-sm font-semibold 
                                           ${theme === 'light'
                                               ? 'bg-green-100 text-green-700'
                                               : 'bg-green-900/50 text-green-300'}`}
                            >
                                <Trophy size={14} /> Solved!
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <motion.div
                    className={`grid grid-cols-${gridSize} gap-2 mb-6 p-3 rounded-lg shadow-inner 
                               ${theme === 'light' ? 'bg-slate-200' : 'bg-slate-900/50'}`}
                    style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
                >
                    {grid.map((row, rowIndex) =>
                        row.map((cell, colIndex) => (
                            <motion.div
                                key={`${rowIndex}-${colIndex}`}
                                onClick={() => toggleCell(rowIndex, colIndex)}
                                className={`w-full aspect-square rounded-lg cursor-pointer shadow-md`}
                                variants={cellVariants}
                                initial={false}
                                animate={getCellAnimationTarget(cell)}
                                transition={{ duration: 0.3, type: "spring", stiffness: 500, damping: 30 }}
                                whileHover={{ scale: cell ? 1.08 : 1.03, zIndex: 10 }}
                                whileTap={{ scale: 0.95 }}
                                aria-label={`Cell ${rowIndex + 1}-${colIndex + 1} is ${cell ? 'on' : 'off'}`}
                                tabIndex={0}
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleCell(rowIndex, colIndex); }}
                            >
                            </motion.div>
                        ))
                    )}
                </motion.div>
            </motion.div>

            <AnimatePresence>
                {isInfoModalOpen && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={modalVariants}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm 
                                    ${theme === 'light' ? 'bg-black/60' : 'bg-black/80'}`}
                        onClick={() => setIsInfoModalOpen(false)}
                    >
                        <motion.div
                            className={`rounded-2xl shadow-xl p-6 max-w-sm w-full relative border 
                                        ${theme === 'light'
                                            ? 'bg-white text-slate-700 border-slate-200'
                                            : 'bg-slate-800 text-slate-300 border-slate-700'}`}
                            onClick={(e) => e.stopPropagation()}
                            variants={modalVariants}
                        >
                            <button
                                onClick={() => setIsInfoModalOpen(false)}
                                aria-label="Close how to play modal"
                                className={`absolute top-3 right-3 p-1 rounded-full transition-colors cursor-pointer 
                                           ${theme === 'light'
                                               ? 'text-slate-500 hover:bg-slate-100'
                                               : 'text-slate-400 hover:bg-slate-700'}`}
                            >
                                <X size={20} />
                            </button>

                            <h2
                                className={`text-2xl font-bold mb-4 ${headingFont} 
                                           ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-300'}`}
                            >
                                How to Play
                            </h2>
                            <ul className={`space-y-2 list-disc pl-5 ${bodyFont}`}>
                                <li>Click any cell to toggle its state (on/off).</li>
                                <li>This also toggles the state of its direct neighbors (up, down, left, right).</li>
                                <li>Turn all lights off (make all cells grey) to win!</li>
                            </ul>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LightsOutGame;