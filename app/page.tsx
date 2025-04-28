"use client";

import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";

import {
    FaTrophy,
    FaClock,
    FaBookOpen,
    FaUsers,
    FaInfoCircle,
    FaStar,
    FaPowerOff,
    FaGamepad,
    FaArrowLeft,
    FaUndo,
    FaRedo,
    FaArrowUp,
    FaArrowRight,
    FaArrowDown,
    FaTimes,
} from "react-icons/fa";
import { Oswald, Open_Sans } from "next/font/google"; 
import { motion, AnimatePresence } from 'framer-motion'; 


const oswald = Oswald({
    subsets: ["latin"],
    weight: ["700"], 
});
const openSans = Open_Sans({
    subsets: ["latin"],
    weight: ["400", "600", "700"], 
});
interface TileProps {
    value: number;
}
const getTileStyles = (value: number): { background: string; text: string; textSize: string } => {
    const styles: { [key: number]: { background: string; text: string; textSize: string } } = {
        2: { background: "bg-gray-200 dark:bg-gray-300", text: "text-gray-700 dark:text-gray-800", textSize: "text-3xl" },
        4: { background: "bg-orange-200 dark:bg-orange-300", text: "text-orange-800 dark:text-orange-900", textSize: "text-3xl" },
        8: { background: "bg-orange-300 dark:bg-orange-400", text: "text-white dark:text-orange-950", textSize: "text-3xl" },
        16: { background: "bg-orange-400 dark:bg-orange-500", text: "text-white dark:text-orange-950", textSize: "text-3xl" },
        32: { background: "bg-red-400 dark:bg-red-500", text: "text-white dark:text-red-950", textSize: "text-3xl" },
        64: { background: "bg-red-500 dark:bg-red-600", text: "text-white dark:text-red-950", textSize: "text-3xl" },
        128: { background: "bg-yellow-300 dark:bg-yellow-400", text: "text-yellow-900 dark:text-yellow-950", textSize: "text-2xl" },
        256: { background: "bg-yellow-400 dark:bg-yellow-500", text: "text-yellow-900 dark:text-yellow-950", textSize: "text-2xl" },
        512: { background: "bg-yellow-500 dark:bg-yellow-600", text: "text-white dark:text-yellow-950", textSize: "text-2xl" },
        1024: { background: "bg-purple-400 dark:bg-purple-500", text: "text-white dark:text-purple-950", textSize: "text-xl" },
        2048: { background: "bg-purple-500 dark:bg-purple-600", text: "text-white dark:text-purple-950", textSize: "text-xl" },
        
    };
    
    const defaultStyle = { background: "bg-black", text: "text-white", textSize: "text-lg" };
    return styles[value] || defaultStyle;
};
const Tile: React.FC<TileProps> = ({ value }) => {
    const styles = useMemo(() => getTileStyles(value), [value]);

    
    if (value === 0) return null; 

    return (
        
        <div
            className={`flex items-center justify-center w-full h-full rounded-md ${styles.background} ${styles.text} ${styles.textSize} font-bold ${openSans.className}`}
            
        >
            {value}
        </div>
    );
};


const menuItems = [
    { label: "Classic Mode", icon: FaGamepad, aria: "Play Classic Mode" },
    { label: "Challenge Mode", icon: FaTrophy, aria: "Play Challenge Mode" },
    { label: "Speed Mode", icon: FaClock, aria: "Play Speed Mode" },
    { label: "How To Play?", icon: FaBookOpen, aria: "Learn how to play" },
    { label: "Leader Board", icon: FaUsers, aria: "View Leaderboard" },
    { label: "About Us", icon: FaInfoCircle, aria: "Learn about the developers" },
];




const copyBoard = (board: number[][]): number[][] => board.map((row) => [...row]);
const slideAndMergeRow = (row: number[]): { newRow: number[]; scoreIncrease: number } => {
    
    let filteredRow = row.filter((tile) => tile !== 0);
    let scoreIncrease = 0;
    let newRow = Array(4).fill(0);

    
    for (let i = 0; i < filteredRow.length; i++) {
        if (i < filteredRow.length - 1 && filteredRow[i] === filteredRow[i + 1]) {
            const mergedValue = filteredRow[i] * 2;
            filteredRow[i] = mergedValue;
            filteredRow[i + 1] = 0;
            scoreIncrease += mergedValue;
        }
    }

    
    let resultRow = filteredRow.filter((tile) => tile !== 0);

    
    for (let i = 0; i < resultRow.length; i++) {
        newRow[i] = resultRow[i];
    }

    return { newRow, scoreIncrease };
};
const reverseRow = (row: number[]): number[] => [...row].reverse();
const transposeBoard = (board: number[][]): number[][] => {
    const size = board.length;
    const newBoard = Array(size)
        .fill(0)
        .map(() => Array(size).fill(0));
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            newBoard[c][r] = board[r][c];
        }
    }
    return newBoard;
};
const checkGameOver = (board: number[][]): boolean => {
    const size = board.length;
    
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (board[r][c] === 0) {
                return false; 
            }
        }
    }
    
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            
            if (c < size - 1 && board[r][c] === board[r][c + 1]) {
                return false;
            }
            
            if (r < size - 1 && board[r][c] === board[r + 1][c]) {
                return false;
            }
        }
    }

    
    return true;
};

const BEST_SCORE_STORAGE_KEY = '2048-bestScore'; 
const LEADERBOARD_STORAGE_KEY = '2048-leaderboard';
const LEADERBOARD_SIZE = 5; 
const GameScreen = ({ onBack }: { onBack: () => void }) => {
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(0); 
    const [board, setBoard] = useState<number[][]>([
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ]);
    const [isGameOver, setIsGameOver] = useState(false);
    const [gameActive, setGameActive] = useState(false);
    const [history, setHistory] = useState<Array<{ board: number[][]; score: number }>>([]);
    const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const [touchStartY, setTouchStartY] = useState<number | null>(null);
    const [touchEndX, setTouchEndX] = useState<number | null>(null);
    const [touchEndY, setTouchEndY] = useState<number | null>(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true); 
    const minSwipeDistance = 40; 
    useEffect(() => {
        
        try {
            const storedBestScore = localStorage.getItem(BEST_SCORE_STORAGE_KEY);
            if (storedBestScore !== null) {
                const scoreValue = parseInt(storedBestScore, 10);
                 if (!isNaN(scoreValue)) {
                    setBestScore(scoreValue);
                    
                }
            }
        } catch (error) {
            console.error("Failed to load best score from localStorage:", error);
        }
        setIsInitialLoad(false); 
    }, []); 
     useEffect(() => {
        
        if (isInitialLoad) {
            return; 
        }
        try {
            
            localStorage.setItem(BEST_SCORE_STORAGE_KEY, bestScore.toString());
        } catch (error) {
            console.error("Failed to save best score to localStorage:", error);
        }
    }, [bestScore, isInitialLoad]); 
    const addNewTile = useCallback((currentBoard: number[][]): number[][] => {
        const emptyCells: { r: number; c: number }[] = [];

        
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (currentBoard[r][c] === 0) {
                    emptyCells.push({ r, c });
                }
            }
        }

        
        if (emptyCells.length === 0) {
            return currentBoard;
        }

        
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const { r, c } = emptyCells[randomIndex];
        const newValue = Math.random() < 0.9 ? 2 : 4;

        const newBoard = copyBoard(currentBoard);
        newBoard[r][c] = newValue;

        return newBoard;
    }, []);
    const initializeBoard = useCallback(() => {
        
        let newBoard = Array(4)
            .fill(0)
            .map(() => Array(4).fill(0));

        
        newBoard = addNewTile(newBoard);
        newBoard = addNewTile(newBoard);

        
        setBoard(newBoard);
        setScore(0);
        setIsGameOver(false);
        setGameActive(true);
        setHistory([]);
        
    }, [addNewTile]);
    const processBoard = useCallback((currentBoard: number[][]): { processedBoard: number[][]; scoreIncrease: number; moved: boolean } => {
        let processedBoard = copyBoard(currentBoard);
        let totalScoreIncrease = 0;
        let changed = false;

        
        for (let r = 0; r < 4; r++) {
            const originalRow = [...processedBoard[r]];
            const { newRow, scoreIncrease } = slideAndMergeRow(processedBoard[r]);

            
            if (!originalRow.every((val, i) => val === newRow[i])) {
                changed = true;
            }

            processedBoard[r] = newRow;
            totalScoreIncrease += scoreIncrease;
        }

        return {
            processedBoard,
            scoreIncrease: totalScoreIncrease,
            moved: changed,
        };
    }, []);
    const saveToHistory = useCallback(() => {
        
        setHistory(prevHistory => [...prevHistory, { board: copyBoard(board), score }]);
        
    }, [board, score]);
    const moveLeft = useCallback((): boolean => {
        if (isGameOver) return false;

        const { processedBoard, scoreIncrease, moved } = processBoard(board);

        if (moved) {
            saveToHistory();
            setBoard(processedBoard);
            setScore((prev) => {
                const newScore = prev + scoreIncrease;
                if (newScore > bestScore) {
                    setBestScore(newScore);
                }
                return newScore;
            });
        }

        return moved;
    }, [board, isGameOver, processBoard, bestScore, saveToHistory]);
    const moveRight = useCallback((): boolean => {
        if (isGameOver) return false;

        
        const reversedBoard = board.map(reverseRow);
        const { processedBoard, scoreIncrease, moved } = processBoard(reversedBoard);

        if (moved) {
            saveToHistory();
            
            const finalBoard = processedBoard.map(reverseRow);
            setBoard(finalBoard);
            setScore((prev) => {
                const newScore = prev + scoreIncrease;
                if (newScore > bestScore) {
                    setBestScore(newScore);
                }
                return newScore;
            });
        }

        return moved;
    }, [board, isGameOver, processBoard, bestScore, saveToHistory]);
    const moveUp = useCallback((): boolean => {
        if (isGameOver) return false;

        
        const transposedBoard = transposeBoard(board);
        const { processedBoard, scoreIncrease, moved } = processBoard(transposedBoard);

        if (moved) {
            saveToHistory();
            
            const finalBoard = transposeBoard(processedBoard);
            setBoard(finalBoard);
            setScore((prev) => {
                const newScore = prev + scoreIncrease;
                if (newScore > bestScore) {
                    setBestScore(newScore);
                }
                return newScore;
            });
        }

        return moved;
    }, [board, isGameOver, processBoard, bestScore, saveToHistory]);
    const moveDown = useCallback((): boolean => {
        if (isGameOver) return false;

        
        const transposedBoard = transposeBoard(board);
        const reversedTransposed = transposedBoard.map(reverseRow);
        const { processedBoard, scoreIncrease, moved } = processBoard(reversedTransposed);

        if (moved) {
            saveToHistory();
            
            const unreversed = processedBoard.map(reverseRow);
            const finalBoard = transposeBoard(unreversed);
            setBoard(finalBoard);
            setScore((prev) => {
                const newScore = prev + scoreIncrease;
                if (newScore > bestScore) {
                    setBestScore(newScore);
                }
                return newScore;
            });
        }

        return moved;
    }, [board, isGameOver, processBoard, bestScore, saveToHistory]);
    const handleUndo = useCallback(() => {
        
        if (history.length > 0) {
            
            const lastState = history[history.length - 1];
            
            setBoard(copyBoard(lastState.board)); 
            setScore(lastState.score); 

            
            setHistory(prevHistory => prevHistory.slice(0, -1));

            setIsGameOver(false); 
        } else {
            
        }
    }, [history]); 
    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (!gameActive || isGameOver) {
                
                if (event.key === 'r' || event.key === 'R') {
                    initializeBoard();
                }
                return;
            }

            let moved = false;

            switch (event.key) {
                case "ArrowUp":
                case "w": 
                case "W":
                    moved = moveUp();
                    break;
                case "ArrowDown":
                case "s":
                case "S":
                    moved = moveDown();
                    break;
                case "ArrowLeft":
                case "a":
                case "A":
                    moved = moveLeft();
                    break;
                case "ArrowRight":
                case "d":
                case "D":
                    moved = moveRight();
                    break;
                case "z": 
                case "Z":
                    handleUndo(); 
                    return; 
                case "r": 
                case "R":
                    initializeBoard();
                    return; 
                default:
                    return; 
            }

            
            if (moved) {
                setTimeout(() => {
                    setBoard((prevBoard) => {
                        
                        
                        const hasEmptyCell = prevBoard.flat().some(cell => cell === 0);
                        if (!hasEmptyCell) {
                            
                            if (checkGameOver(prevBoard)) {
                                
                                setIsGameOver(true);
                            }
                            return prevBoard; 
                        }

                        const nextBoard = addNewTile(prevBoard);

                        
                        
                        if (checkGameOver(nextBoard)) {
                            
                            setIsGameOver(true);
                        }

                        return nextBoard; 
                    });
                }, 0); 
            } else {
                
                
                if (checkGameOver(board)) {
                    
                    setIsGameOver(true);
                }
            }
        },
        [gameActive, isGameOver, moveUp, moveDown, moveLeft, moveRight, addNewTile, board, initializeBoard, handleUndo, checkGameOver] 
    );
    const handleRestart = useCallback(() => {
        initializeBoard();
    }, [initializeBoard]);
    useEffect(() => {
        if (!gameActive) {
            initializeBoard();
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleKeyDown, initializeBoard, gameActive]);

    
    const gameContainerRef = useRef<HTMLDivElement>(null);

    
    useEffect(() => {
        if (gameContainerRef.current) {
            gameContainerRef.current.focus();
        }
    }, []);
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        
        if (e.touches.length !== 1) return;
        setTouchEndX(null); 
        setTouchEndY(null);
        setTouchStartX(e.touches[0].clientX);
        setTouchStartY(e.touches[0].clientY);
        
    }, []);
    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (e.touches.length !== 1 || !touchStartX || !touchStartY) return;
        setTouchEndX(e.touches[0].clientX);
        setTouchEndY(e.touches[0].clientY);
        
    }, [touchStartX, touchStartY]);
    const handleTouchEnd = useCallback(() => {
        if (!touchStartX || !touchStartY || !touchEndX || !touchEndY) {
             
             setTouchStartX(null);
             setTouchStartY(null);
             setTouchEndX(null);
             setTouchEndY(null);
            return;
        }

        const distanceX = touchEndX - touchStartX;
        const distanceY = touchEndY - touchStartY;
        const absDistanceX = Math.abs(distanceX);
        const absDistanceY = Math.abs(distanceY);

        

        let moved = false;

        
        if (Math.max(absDistanceX, absDistanceY) < minSwipeDistance) {
            
            
            setTouchStartX(null);
            setTouchStartY(null);
            setTouchEndX(null);
            setTouchEndY(null);
            return; 
        }

        
        if (absDistanceX > absDistanceY) {
            
            if (distanceX < 0) {
                
                moved = moveLeft();
            } else {
                
                moved = moveRight();
            }
        } else {
            
            if (distanceY < 0) {
                
                moved = moveUp();
            } else {
                
                moved = moveDown();
            }
        }

        
        if (moved) {
            setTimeout(() => {
                setBoard((prevBoard) => {
                    const hasEmptyCell = prevBoard.flat().some(cell => cell === 0);
                    if (!hasEmptyCell) {
                        if (checkGameOver(prevBoard)) {
                            setIsGameOver(true);
                        }
                        return prevBoard;
                    }
                    const nextBoard = addNewTile(prevBoard);
                    if (checkGameOver(nextBoard)) {
                        setIsGameOver(true);
                    }
                    return nextBoard; 
                });
            }, 0);
        }
        
        
        setTouchStartX(null);
        setTouchStartY(null);
        setTouchEndX(null);
        setTouchEndY(null);

    }, [touchStartX, touchStartY, touchEndX, touchEndY, moveLeft, moveRight, moveUp, moveDown, addNewTile, checkGameOver]); 

    
    useEffect(() => {
        if (isGameOver && score > 0) {
            
            try {
                const storedLeaderboard = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
                let leaderboard: Array<{ score: number, date: number }> = [];

                if (storedLeaderboard) {
                    try {
                        leaderboard = JSON.parse(storedLeaderboard);
                        
                        if (!Array.isArray(leaderboard)) {
                            leaderboard = [];
                        }
                    } catch (parseError) {
                        console.error("Failed to parse leaderboard from localStorage:", parseError);
                        leaderboard = []; 
                    }
                }

                
                leaderboard.push({ score, date: Date.now() });

                
                leaderboard.sort((a, b) => b.score - a.score);

                
                const updatedLeaderboard = leaderboard.slice(0, LEADERBOARD_SIZE);

                
                localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(updatedLeaderboard));
                

            } catch (error) {
                console.error("Failed to update leaderboard in localStorage:", error);
            }
        }
    }, [isGameOver, score]); 

    
    return (
        <div
            ref={gameContainerRef}
            tabIndex={0}
            className="w-full max-w-md mx-auto p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-xl outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
        >

            <div className="flex justify-between items-center mb-4">
                
                <div className="relative"> 
                    <button
                        onClick={onBack}
                        aria-label="Go Back to Menu"
                        onMouseEnter={() => setActiveTooltip('back')}
                        onMouseLeave={() => setActiveTooltip(null)}
                        className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                    >
                        <FaArrowLeft size={20} />
                    </button>
                    
                    {activeTooltip === 'back' && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-700 dark:bg-gray-900 text-white text-xs rounded-md shadow-sm whitespace-nowrap pointer-events-none z-10">
                            Go Back
                        </div>
                    )}
                </div>

                <h1 className={`${oswald.className} text-3xl font-bold text-purple-600 dark:text-purple-400`}>2048</h1>
                
                <div className="flex gap-2">
                    
                    <div className="relative">
                        <button
                            onClick={handleRestart}
                            aria-label="Restart Game (R)"
                            onMouseEnter={() => setActiveTooltip('restart')}
                            onMouseLeave={() => setActiveTooltip(null)}
                            className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                        >
                            <FaRedo size={20} />
                        </button>
                         
                        {activeTooltip === 'restart' && (
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-700 dark:bg-gray-900 text-white text-xs rounded-md shadow-sm whitespace-nowrap pointer-events-none z-10">
                                Restart (R)
                            </div>
                        )}
                    </div>

                    
                    <div className="relative">
                        <button
                            onClick={handleUndo}
                            aria-label="Undo Last Move (Z)"
                            onMouseEnter={() => setActiveTooltip('undo')}
                            onMouseLeave={() => setActiveTooltip(null)}
                            className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={history.length === 0}
                        >
                            <FaUndo size={20} />
                        </button>
                         
                        {activeTooltip === 'undo' && (
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-700 dark:bg-gray-900 text-white text-xs rounded-md shadow-sm whitespace-nowrap pointer-events-none z-10">
                                Undo (Z)
                            </div>
                        )}
                    </div>
                </div>
            </div>

            
            <div className="flex justify-between gap-4 mb-6">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 p-3 rounded-lg text-center">
                    <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Score</div>
                    <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{score}</div>
                </div>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 p-3 rounded-lg text-center">
                    <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Best</div>
                    <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{bestScore}</div>
                </div>
            </div>

            
            <div 
                className="grid grid-cols-4 gap-3 bg-gray-300 dark:bg-gray-600 p-3 rounded-lg aspect-square relative touch-none" 
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
             >
                
                {Array.from({ length: 16 }).map((_, index) => (
                    <div key={`bg-${index}`} className="bg-gray-400/50 dark:bg-gray-500/50 rounded-md aspect-square" />
                ))}
                
                <div className="absolute inset-0 grid grid-cols-4 gap-3 p-3 pointer-events-none"> 
                    {board.flat().map((value, index) => (
                        <div key={`tile-slot-${index}`} className="w-full h-full"> 
                            <Tile value={value} />
                        </div>
                    ))}
                </div>
                
                <AnimatePresence>
                    {isGameOver && (
                        <motion.div 
                           key="game-over-overlay" 
                           className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-lg text-center p-4 pointer-events-auto z-20" 
                           initial={{ opacity: 0, scale: 0.8 }}
                           animate={{ opacity: 1, scale: 1 }}
                           exit={{ opacity: 0, scale: 0.8 }}
                           transition={{ duration: 0.3 }}
                        >
                            <p className="text-white text-4xl font-bold mb-4">Game Over!</p>
                            <p className="text-gray-300 text-lg mb-6">Score: {score}</p>
                            <motion.button
                                onClick={handleRestart}
                                className="px-6 py-3 bg-purple-500 text-white rounded-md hover:bg-purple-600 dark:hover:bg-purple-700 cursor-pointer text-lg font-semibold transition-colors origin-center"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Try Again (R)
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            
            <div className="mt-6 md:hidden"> 
                <div className="flex justify-center items-center w-full">
                    <div className="grid grid-cols-3 grid-rows-3 gap-2 w-36 h-36"> 
                        
                        <div className="col-start-2 flex items-center justify-center">
                            <motion.button
                                onClick={() => { if (moveUp()) { setTimeout(() => setBoard(prev => addNewTile(prev)), 0); } }}
                                aria-label="Move Up"
                                className="w-10 h-10 flex items-center justify-center bg-purple-200 dark:bg-purple-700 text-purple-700 dark:text-purple-200 rounded-md hover:bg-purple-300 dark:hover:bg-purple-600 active:bg-purple-400 dark:active:bg-purple-500 cursor-pointer transition-colors shadow-sm origin-center"
                                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                            >
                                <FaArrowUp size={20} />
                            </motion.button>
                        </div>
                        
                        
                         <div className="col-start-1 flex items-center justify-center">
                            <motion.button
                                onClick={() => { if (moveLeft()) { setTimeout(() => setBoard(prev => addNewTile(prev)), 0); } }}
                                aria-label="Move Left"
                                className="w-10 h-10 flex items-center justify-center bg-purple-200 dark:bg-purple-700 text-purple-700 dark:text-purple-200 rounded-md hover:bg-purple-300 dark:hover:bg-purple-600 active:bg-purple-400 dark:active:bg-purple-500 cursor-pointer transition-colors shadow-sm origin-center"
                                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                            >
                                <FaArrowLeft size={20} />
                            </motion.button>
                        </div>
                         <div className="col-start-2"></div>
                         <div className="col-start-3 flex items-center justify-center">
                            <motion.button
                                onClick={() => { if (moveRight()) { setTimeout(() => setBoard(prev => addNewTile(prev)), 0); } }}
                                aria-label="Move Right"
                                className="w-10 h-10 flex items-center justify-center bg-purple-200 dark:bg-purple-700 text-purple-700 dark:text-purple-200 rounded-md hover:bg-purple-300 dark:hover:bg-purple-600 active:bg-purple-400 dark:active:bg-purple-500 cursor-pointer transition-colors shadow-sm origin-center"
                                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                            >
                                <FaArrowRight size={20} />
                            </motion.button>
                        </div>

                        <div className="col-start-2 flex items-center justify-center">
                            <motion.button
                                onClick={() => { if (moveDown()) {  setTimeout(() => setBoard(prev => addNewTile(prev)), 0); } }}
                                aria-label="Move Down"
                                 className="w-10 h-10 flex items-center justify-center bg-purple-200 dark:bg-purple-700 text-purple-700 dark:text-purple-200 rounded-md hover:bg-purple-300 dark:hover:bg-purple-600 active:bg-purple-400 dark:active:bg-purple-500 cursor-pointer transition-colors shadow-sm origin-center"
                                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                            >
                                <FaArrowDown size={20} />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    

    return (
         <motion.div 
            key={title} 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose} 
        >
            <motion.div 
                className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 text-gray-800 dark:text-gray-200"
                onClick={(e) => e.stopPropagation()} 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, delay: 0.1 }}
            >
                <button 
                    onClick={onClose}
                    aria-label="Close modal"
                    className="absolute top-3 right-3 p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                >
                    <FaTimes size={18} />
                </button>
                <h2 className={`${oswald.className} text-2xl font-bold mb-4 text-purple-600 dark:text-purple-400`}>{title}</h2>
                <div className="space-y-4">
                    {children}
                </div>
            </motion.div>
        </motion.div>
    );
};


const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const menuContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            delayChildren: 0.2, 
            staggerChildren: 0.1, 
        },
    },
};

const menuItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const Page: React.FC = () => {
    const [currentScreen, setCurrentScreen] = useState("menu"); 
    const [showHowToPlayModal, setShowHowToPlayModal] = useState(false);
    const [showAboutUsModal, setShowAboutUsModal] = useState(false);
    const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
    const [leaderboardScores, setLeaderboardScores] = useState<Array<{ score: number, date: number }>>([]); 

    
    const loadLeaderboardData = () => {
        try {
            const storedLeaderboard = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
            let scores: Array<{ score: number, date: number }> = [];
            if (storedLeaderboard) {
                try {
                    scores = JSON.parse(storedLeaderboard);
                    if (!Array.isArray(scores)) {
                        scores = [];
                    }
                } catch (parseError) {
                    console.error("Failed to parse leaderboard data:", parseError);
                    scores = [];
                }
            }
            setLeaderboardScores(scores);
        } catch (error) {
            console.error("Failed to load leaderboard from localStorage:", error);
            setLeaderboardScores([]); 
        }
    };

    const handleMenuClick = (label: string) => {
        if (label === "Classic Mode" || label === "Challenge Mode" || label === "Speed Mode") {
            setCurrentScreen("game");
        } else if (label === "How To Play?") {
            setShowHowToPlayModal(true);
        } else if (label === "About Us") {
            setShowAboutUsModal(true);
        } else if (label === "Leader Board") {
            loadLeaderboardData(); 
            setShowLeaderboardModal(true); 
        } 
    };

    const handleBack = () => {
        setCurrentScreen("menu");
    };

    
    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
        
    };

    return (
        <main
            className={`${openSans.className} flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 dark:from-gray-800 dark:via-gray-900 dark:to-black overflow-hidden`} 
        >
            <AnimatePresence mode="wait">
                {currentScreen === "menu" && (
                    <motion.div
                       key="menu-screen"
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       exit={{ opacity: 0 }}
                       transition={{ duration: 0.3 }}
                       className="flex flex-col items-center justify-center w-full" 
                    >
                        <div className="text-center mb-12">
                            <motion.h1
                                key="main-title" 
                                className={`${oswald.className} text-7xl md:text-8xl font-bold text-purple-600 dark:text-purple-400 tracking-tight 
                                           drop-shadow-[0_0_8px_rgb(168_85_247/0.5)] dark:drop-shadow-[0_0_10px_rgb(192_132_252/0.4)]`}
                                variants={titleVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                2048
                            </motion.h1>
                        </div>
                        <motion.div 
                            className="w-full max-w-md grid grid-cols-2 gap-4"
                            variants={menuContainerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {menuItems.map((item) => (
                                <motion.button
                                    key={item.label}
                                    variants={menuItemVariants} 
                                    whileHover={{ scale: 1.05, transition: { duration: 0.15 } }} 
                                    whileTap={{ scale: 0.95 }} 
                                    onClick={() => handleMenuClick(item.label)}
                                    onKeyDown={(e) => (e.key === "Enter" || e.key === " " ? handleMenuClick(item.label) : null)}
                                    tabIndex={0}
                                    aria-label={item.aria}
                                    className="flex flex-col items-center justify-center p-4 md:p-6 bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm rounded-xl shadow-md hover:bg-white dark:hover:bg-gray-600 transition-colors duration-200 ease-in-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 origin-center" 
                                >
                                    <item.icon className="text-3xl md:text-4xl text-purple-600 dark:text-purple-400 mb-2" />
                                    <span className="text-sm md:text-base font-semibold text-gray-800 dark:text-gray-100 text-center">
                                        {item.label}
                                    </span>
                                </motion.button>
                            ))}
                        </motion.div>
                   </motion.div>
                )}

                {currentScreen === "game" && (
                     <motion.div
                        key="game-screen"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="w-full flex justify-center" 
                      >
                        <GameScreen onBack={handleBack} />
                      </motion.div>
                  )}
            </AnimatePresence>
            

            <AnimatePresence>
                {showHowToPlayModal && (
                    <Modal 
                        isOpen={showHowToPlayModal} 
                        onClose={() => setShowHowToPlayModal(false)} 
                        title="How To Play"
                    >
                         <p>Use your <strong className="text-purple-600 dark:text-purple-400">arrow keys</strong> (or <strong className="text-purple-600 dark:text-purple-400">swipe</strong> on mobile) to move the tiles.</p>
                         <p>When two tiles with the same number touch, they <strong className="text-purple-600 dark:text-purple-400">merge into one!</strong></p>
                         <p>Join the numbers and get to the <strong className="text-purple-600 dark:text-purple-400">2048 tile!</strong></p>
                         <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">You can undo moves with 'Z' and restart with 'R'.</p>
                    </Modal>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showAboutUsModal && (
                    <Modal 
                        isOpen={showAboutUsModal} 
                        onClose={() => setShowAboutUsModal(false)} 
                        title="About Us"
                    >
                        <p>Welcome to our version of the classic 2048 puzzle!</p>
                         <p>We built this game with care, aiming for a smooth experience whether you're playing on your computer or phone.</p>
                         <p>We hope you enjoy the challenge and have fun merging those tiles!</p>
                    </Modal>
                )}
             </AnimatePresence>

            <AnimatePresence>
                {showLeaderboardModal && (
                    <Modal 
                        isOpen={showLeaderboardModal} 
                        onClose={() => setShowLeaderboardModal(false)} 
                        title="Leaderboard"
                    >
                         {leaderboardScores.length === 0 ? (
                             <p className="text-center text-gray-500 dark:text-gray-400">No high scores recorded yet. Play a game!</p>
                         ) : (
                             <ol className="space-y-2 list-decimal list-inside">
                                 {leaderboardScores.map((entry, index) => (
                                     <li key={entry.date} className="flex justify-between items-center text-sm">
                                         <span>
                                             <span className="font-semibold mr-2">{index + 1}.</span>
                                             {entry.score.toLocaleString()} Points
                                         </span>
                                         <span className="text-xs text-gray-500 dark:text-gray-400">
                                             {formatDate(entry.date)}
                                         </span>
                                     </li>
                                 ))}
                             </ol>
                         )}
                    </Modal>
                )}
            </AnimatePresence>
        </main>
    );
};

export default Page;
