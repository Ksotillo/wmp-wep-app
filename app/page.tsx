"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

const INITIAL_SPEED = 1000;

const CELL_SIZE_CLASSES = "w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9";

const PREVIEW_CELL_SIZE_CLASSES = "w-6 h-6";

const LINE_CLEAR_POINTS = [0, 100, 300, 500, 800];

const SHAPES = [
    { rotations: [[[1]]], color: "bg-pink-300", dimension: 1 },
    { rotations: [[[1, 1]]], color: "bg-indigo-300", dimension: 2 },
    { rotations: [[[1], [1]]], color: "bg-teal-300", dimension: 2 },
    {
        rotations: [
            [
                [1, 0],
                [1, 1],
            ],
            [
                [1, 1],
                [1, 0],
            ],
            [
                [1, 1],
                [0, 1],
            ],
            [
                [0, 1],
                [1, 1],
            ],
        ],
        color: "bg-amber-300",
        dimension: 2,
    },
    { rotations: [[[1, 1, 1]], [[1], [1], [1]]], color: "bg-lime-300", dimension: 3 },
    {
        rotations: [
            [
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ],
            [
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
            ],
        ],
        color: "bg-cyan-500",
        dimension: 4,
    },
    {
        rotations: [
            [
                [1, 0, 0],
                [1, 1, 1],
                [0, 0, 0],
            ],
            [
                [0, 1, 1],
                [0, 1, 0],
                [0, 1, 0],
            ],
            [
                [0, 0, 0],
                [1, 1, 1],
                [0, 0, 1],
            ],
            [
                [0, 1, 0],
                [0, 1, 0],
                [1, 1, 0],
            ],
        ],
        color: "bg-blue-500",
        dimension: 3,
    },
    {
        rotations: [
            [
                [0, 0, 1],
                [1, 1, 1],
                [0, 0, 0],
            ],
            [
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 1],
            ],
            [
                [0, 0, 0],
                [1, 1, 1],
                [1, 0, 0],
            ],
            [
                [1, 1, 0],
                [0, 1, 0],
                [0, 1, 0],
            ],
        ],
        color: "bg-orange-500",
        dimension: 3,
    },
    {
        rotations: [
            [
                [1, 1],
                [1, 1],
            ],
        ],
        color: "bg-yellow-400",
        dimension: 2,
    },
    {
        rotations: [
            [
                [0, 1, 1],
                [1, 1, 0],
                [0, 0, 0],
            ],
            [
                [0, 1, 0],
                [0, 1, 1],
                [0, 0, 1],
            ],
        ],
        color: "bg-green-500",
        dimension: 3,
    },
    {
        rotations: [
            [
                [0, 1, 0],
                [1, 1, 1],
                [0, 0, 0],
            ],
            [
                [0, 1, 0],
                [0, 1, 1],
                [0, 1, 0],
            ],
            [
                [0, 0, 0],
                [1, 1, 1],
                [0, 1, 0],
            ],
            [
                [0, 1, 0],
                [1, 1, 0],
                [0, 1, 0],
            ],
        ],
        color: "bg-purple-500",
        dimension: 3,
    },
    {
        rotations: [
            [
                [1, 1, 0],
                [0, 1, 1],
                [0, 0, 0],
            ],
            [
                [0, 0, 1],
                [0, 1, 1],
                [0, 1, 0],
            ],
        ],
        color: "bg-red-500",
        dimension: 3,
    },
    {
        rotations: [
            [
                [0, 1, 0],
                [1, 1, 1],
                [0, 1, 0],
            ],
        ],
        color: "bg-fuchsia-500",
        dimension: 3,
    },
    {
        rotations: [
            [
                [1, 0, 1],
                [1, 1, 1],
            ],
            [
                [1, 1],
                [1, 0],
                [1, 1],
            ],
            [
                [1, 1, 1],
                [1, 0, 1],
            ],
            [
                [1, 1],
                [0, 1],
                [1, 1],
            ],
        ],
        color: "bg-rose-500",
        dimension: 3,
    },
    {
        rotations: [
            [
                [1, 1, 1],
                [0, 1, 0],
                [0, 1, 0],
            ],
            [
                [0, 0, 1],
                [1, 1, 1],
                [0, 0, 1],
            ],
            [
                [0, 1, 0],
                [0, 1, 0],
                [1, 1, 1],
            ],
            [
                [1, 0, 0],
                [1, 1, 1],
                [1, 0, 0],
            ],
        ],
        color: "bg-emerald-500",
        dimension: 3,
    },
];

type BoardCell = string | 0;
type BoardGrid = BoardCell[][];
type ShapeMatrix = number[][];

interface Position {
    x: number;
    y: number;
}

interface ShapeData {
    rotations: ShapeMatrix[];
    color: string;
    dimension: number;
}

interface Piece {
    shapeData: ShapeData;
    color: string;
}

interface CurrentPiece extends Piece {
    pos: Position;
    rotation: number;
}

type TouchControlAction = "left" | "right" | "down" | "rotate" | "drop" | "pause";

function createEmptyBoard(): BoardGrid {
    return Array(BOARD_HEIGHT)
        .fill(0)
        .map(() => Array(BOARD_WIDTH).fill(0));
}

/** Gets a random piece definition */
function getRandomPieceData(): Piece {
    const shapeIndex = Math.floor(Math.random() * SHAPES.length);
    const shapeData = SHAPES[shapeIndex];
    return {
        shapeData: shapeData,
        color: shapeData.color,
    };
}

function getCurrentShapeMatrix(piece: CurrentPiece | null): ShapeMatrix | null {
    if (!piece) return null;
    return piece.shapeData.rotations[piece.rotation % piece.shapeData.rotations.length];
}

const TetrisGame = () => {
    const [board, setBoard] = useState<BoardGrid>(() => createEmptyBoard());
    const [currentPiece, setCurrentPiece] = useState<CurrentPiece | null>(null);
    const [nextPiece, setNextPiece] = useState<Piece | null>(null);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [linesCleared, setLinesCleared] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [clearingLines, setClearingLines] = useState<number[]>([]);
    const [gameStarted, setGameStarted] = useState(false);
    const [showGhost, setShowGhost] = useState(true);

    const dropTimeRef = useRef(INITIAL_SPEED);
    const gameIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const checkCollision = useCallback(
        (piece: CurrentPiece | null, pos: Position, rotation: number): boolean => {
            if (!piece) return true;

            const shape = piece.shapeData.rotations[rotation % piece.shapeData.rotations.length];
            if (!shape) return true;

            for (let y = 0; y < shape.length; y++) {
                for (let x = 0; x < shape[y].length; x++) {
                    if (shape[y][x] !== 0) {
                        const boardX = pos.x + x;
                        const boardY = pos.y + y;

                        if (boardX < 0 || boardX >= BOARD_WIDTH || boardY >= BOARD_HEIGHT) {
                            return true;
                        }
                        if (boardY >= 0 && board[boardY]?.[boardX] !== 0) {
                            return true;
                        }
                    }
                }
            }
            return false;
        },
        [board]
    );

    const spawnNewPiece = useCallback(() => {
        const pieceToSpawn = nextPiece || getRandomPieceData();
        const nextPieceToGenerate = getRandomPieceData();
        setNextPiece(nextPieceToGenerate);

        const startX = Math.floor(BOARD_WIDTH / 2) - Math.floor(pieceToSpawn.shapeData.dimension / 2);
        const newPiece: CurrentPiece = {
            ...pieceToSpawn,
            pos: { x: startX, y: 0 },
            rotation: 0,
        };

        if (checkCollision(newPiece, newPiece.pos, newPiece.rotation)) {
            setGameOver(true);
            setGameStarted(false);
            if (gameIntervalRef.current) {
                clearInterval(gameIntervalRef.current);
                gameIntervalRef.current = null;
            }
        } else {
            setCurrentPiece(newPiece);
        }
    }, [nextPiece, checkCollision]);

    /** Merges the current piece into the board grid */
    const mergePiece = useCallback((pieceToMerge: CurrentPiece) => {
        const shape = getCurrentShapeMatrix(pieceToMerge);
        if (!shape) return;

        setBoard((prevBoard) => {
            const newBoard = prevBoard.map((row) => [...row]);
            for (let y = 0; y < shape.length; y++) {
                for (let x = 0; x < shape[y].length; x++) {
                    if (shape[y][x] !== 0) {
                        const boardY = pieceToMerge.pos.y + y;
                        const boardX = pieceToMerge.pos.x + x;

                        if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
                            newBoard[boardY][boardX] = pieceToMerge.color;
                        }
                    }
                }
            }
            return newBoard;
        });
    }, []);

    const clearLines = useCallback(() => {
        const linesToClear: number[] = [];

        for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
            if (board[y] && board[y].every((cell) => cell !== 0)) {
                linesToClear.push(y);
            }
        }

        if (linesToClear.length > 0) {
            setClearingLines(linesToClear);
            setTimeout(() => {
                setBoard((prevBoard) => {
                    const cleanedBoard = prevBoard.filter((_, index) => !linesToClear.includes(index));

                    const newEmptyLines = Array(linesToClear.length)
                        .fill(0)
                        .map(() => Array(BOARD_WIDTH).fill(0));
                    return [...newEmptyLines, ...cleanedBoard];
                });
                const pieceSize = currentPiece ? SHAPES.find((s) => s.color === currentPiece.color)?.dimension ?? 4 : 4;
                const sizeBonus = pieceSize <= 2 ? 1.5 : 1;
                const pointsEarned = LINE_CLEAR_POINTS[linesToClear.length] * level * sizeBonus;
                const newTotalLinesCleared = linesCleared + linesToClear.length;
                const newLevel = Math.floor(newTotalLinesCleared / 10) + 1;

                setScore((prev) => prev + pointsEarned);
                setLinesCleared(newTotalLinesCleared);

                if (newLevel > level) {
                    setLevel(newLevel);
                    dropTimeRef.current = Math.max(100, INITIAL_SPEED - (newLevel - 1) * 50);
                }
                setClearingLines([]);
                spawnNewPiece();
            }, 200);
        } else {
            spawnNewPiece();
        }
    }, [board, level, linesCleared, currentPiece, spawnNewPiece]);

    const dropPiece = useCallback(() => {
        if (gameOver || !currentPiece || isPaused || clearingLines.length > 0) return;

        const newPos: Position = { ...currentPiece.pos, y: currentPiece.pos.y + 1 };

        if (checkCollision(currentPiece, newPos, currentPiece.rotation)) {
            mergePiece(currentPiece);
            setCurrentPiece(null);
            clearLines();
        } else {
            setCurrentPiece((prev) => (prev ? { ...prev, pos: newPos } : null));
        }
    }, [currentPiece, isPaused, gameOver, checkCollision, mergePiece, clearLines, clearingLines]);

    const resetGame = useCallback(() => {
        if (score > highScore) {
            setHighScore(score);
        }

        setBoard(createEmptyBoard());
        const firstPiece = getRandomPieceData();
        setNextPiece(getRandomPieceData());
        const startX = Math.floor(BOARD_WIDTH / 2) - Math.floor(firstPiece.shapeData.dimension / 2);
        setCurrentPiece({
            ...firstPiece,
            pos: { x: startX, y: 0 },
            rotation: 0,
        });
        setScore(0);
        setLevel(1);
        setLinesCleared(0);
        setGameOver(false);
        dropTimeRef.current = INITIAL_SPEED;
        setGameStarted(true);
        setIsPaused(false);
        setClearingLines([]);
        if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
        gameIntervalRef.current = null;
    }, [score, highScore]);

    /** Rotates the current piece clockwise */
    const rotatePiece = useCallback(() => {
        if (gameOver || !currentPiece || isPaused || clearingLines.length > 0) return;

        const rotationsCount = currentPiece.shapeData.rotations.length;
        if (rotationsCount <= 1) return;

        const newRotation = (currentPiece.rotation + 1) % rotationsCount;
        const newPos = currentPiece.pos;

        if (!checkCollision(currentPiece, newPos, newRotation)) {
            setCurrentPiece((prev) => (prev ? { ...prev, rotation: newRotation } : null));
            return;
        }
        const kicks = [1, -1];
        for (const kick of kicks) {
            const kickedPos = { ...newPos, x: newPos.x + kick };
            if (!checkCollision(currentPiece, kickedPos, newRotation)) {
                setCurrentPiece((prev) => (prev ? { ...prev, pos: kickedPos, rotation: newRotation } : null));
                return;
            }
        }
    }, [currentPiece, isPaused, gameOver, checkCollision, clearingLines]);

    /** Moves the current piece horizontally */
    const movePiece = useCallback(
        (direction: "left" | "right") => {
            if (gameOver || !currentPiece || isPaused || clearingLines.length > 0) return;

            const deltaX = direction === "left" ? -1 : 1;
            const newPos: Position = { ...currentPiece.pos, x: currentPiece.pos.x + deltaX };

            if (!checkCollision(currentPiece, newPos, currentPiece.rotation)) {
                setCurrentPiece((prev) => (prev ? { ...prev, pos: newPos } : null));
            }
        },
        [currentPiece, isPaused, gameOver, checkCollision, clearingLines]
    );

    /** Instantly drops the piece to the lowest possible position (Hard Drop) */
    const hardDrop = useCallback(() => {
        if (gameOver || !currentPiece || isPaused || clearingLines.length > 0) return;

        const newPos = { ...currentPiece.pos };
        while (!checkCollision(currentPiece, { ...newPos, y: newPos.y + 1 }, currentPiece.rotation)) {
            newPos.y += 1;
        }
        const landedPiece = { ...currentPiece, pos: newPos };
        mergePiece(landedPiece);
        setCurrentPiece(null);
        clearLines();
        if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
        gameIntervalRef.current = null;
    }, [currentPiece, isPaused, gameOver, checkCollision, mergePiece, clearLines, clearingLines]);

    /** Toggles the pause state */
    const togglePause = useCallback(() => {
        if (gameOver || !gameStarted) return;
        setIsPaused((prev) => !prev);
    }, [gameOver, gameStarted]);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (!gameStarted || gameOver || e.metaKey || e.altKey || e.ctrlKey) return;
            if (e.key === "p" || e.key === "P") {
                togglePause();
                return;
            }
            if (isPaused || clearingLines.length > 0) return;

            switch (e.key) {
                case "ArrowLeft":
                    e.preventDefault();
                    movePiece("left");
                    break;
                case "ArrowRight":
                    e.preventDefault();
                    movePiece("right");
                    break;
                case "ArrowDown":
                    e.preventDefault();
                    dropPiece();
                    if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
                    gameIntervalRef.current = null;
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    rotatePiece();
                    break;
                case " ":
                    e.preventDefault();
                    hardDrop();
                    break;
                default:
                    break;
            }
        },
        [gameStarted, gameOver, isPaused, clearingLines, movePiece, dropPiece, rotatePiece, hardDrop, togglePause]
    );

    /** Handles touch control input */
    const handleTouchControl = useCallback(
        (action: TouchControlAction) => {
            if (!gameStarted || gameOver) return;

            if (action === "pause") {
                togglePause();
                return;
            }

            if (isPaused || clearingLines.length > 0) return;

            switch (action) {
                case "left":
                    movePiece("left");
                    break;
                case "right":
                    movePiece("right");
                    break;
                case "down":
                    dropPiece();
                    break;
                case "rotate":
                    rotatePiece();
                    break;
                case "drop":
                    hardDrop();
                    break;
            }
        },
        [gameStarted, gameOver, isPaused, clearingLines, movePiece, dropPiece, rotatePiece, hardDrop, togglePause]
    );

    useEffect(() => {
        if (!gameStarted && !currentPiece && !gameOver) {
            const firstPiece = getRandomPieceData();
            setNextPiece(getRandomPieceData());
            const startX = Math.floor(BOARD_WIDTH / 2) - Math.floor(firstPiece.shapeData.dimension / 2);
            setCurrentPiece({
                ...firstPiece,
                pos: { x: startX, y: 0 },
                rotation: 0,
            });
        }
    }, [gameStarted, currentPiece, gameOver]);

    useEffect(() => {
        if (gameIntervalRef.current) {
            clearInterval(gameIntervalRef.current);
            gameIntervalRef.current = null;
        }
        if (gameStarted && !isPaused && !gameOver && clearingLines.length === 0) {
            
            gameIntervalRef.current = setInterval(() => {
                dropPiece();
            }, dropTimeRef.current);
        }

        return () => {
            if (gameIntervalRef.current) {
                clearInterval(gameIntervalRef.current);
                gameIntervalRef.current = null;
            }
        };
    }, [gameStarted, isPaused, gameOver, dropPiece, dropTimeRef, clearingLines]); 

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleKeyDown]);

    const NextPiecePreview = React.memo(({ piece }: { piece: Piece | null }) => {
        if (!piece) return <div className="w-28 h-28 bg-gray-900/80 rounded-lg flex items-center justify-center text-gray-600">...</div>;

        const shape = piece.shapeData.rotations[0];
        const previewGridSize = 5;

        const yOffset = Math.floor((previewGridSize - shape.length) / 2);
        const xOffset = Math.floor((previewGridSize - (shape[0]?.length ?? 0)) / 2);

        return (
            <div className="bg-gray-900/80 p-3 rounded-lg inline-block shadow-md backdrop-blur-sm border border-slate-800">
                <div
                    className="grid gap-px relative"
                    style={{
                        gridTemplateColumns: `repeat(${previewGridSize}, 1fr)`,
                        gridTemplateRows: `repeat(${previewGridSize}, 1fr)`,
                    }}
                >
                    
                    <div
                        className="absolute inset-0 grid"
                        style={{
                            gridTemplateColumns: `repeat(${previewGridSize}, 1fr)`,
                            gridTemplateRows: `repeat(${previewGridSize}, 1fr)`,
                            opacity: 0.1,
                            pointerEvents: "none",
                        }}
                    >
                        {Array.from({ length: previewGridSize * previewGridSize }).map((_, i) => (
                            <div key={`preview-grid-${i}`} className="border border-white/20"></div>
                        ))}
                    </div>

                    {Array.from({ length: previewGridSize }).map((_, y) =>
                        Array.from({ length: previewGridSize }).map((_, x) => {
                            const shapeY = y - yOffset;
                            const shapeX = x - xOffset;

                            const isFilled =
                                shapeY >= 0 &&
                                shapeY < shape.length &&
                                shapeX >= 0 &&
                                shapeX < shape[shapeY]?.length &&
                                shape[shapeY][shapeX] !== 0;

                            return (
                                <div
                                    key={`next-${y}-${x}`}
                                    className={`
                    ${PREVIEW_CELL_SIZE_CLASSES}
                    ${isFilled ? `${piece.color} shadow-inner shadow-[inset_0_0_4px_rgba(0,0,0,0.3)]` : "bg-transparent"}
                    ${isFilled ? "border border-white/20" : ""}
                    transition-colors
                  `}
                                />
                            );
                        })
                    )}
                </div>
            </div>
        );
    });
    NextPiecePreview.displayName = "NextPiecePreview";

    const GameInfoPanel = React.memo(() => {
        return (
            <div className="flex flex-col gap-5 w-full max-w-xs bg-gray-900/90 p-5 rounded-xl shadow-xl backdrop-blur-sm border border-slate-800">
                
                <div className="text-center">
                    <h2 className="text-lg font-semibold mb-3 text-gray-300">Next Piece</h2>
                    <div className="flex justify-center items-center min-h-[7rem]">
                        <NextPiecePreview piece={nextPiece} />
                    </div>
                </div>

                
                <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-3 rounded-lg shadow-lg border border-slate-800">
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Score</p>
                        <p className="text-2xl font-bold text-white mt-1">{score}</p>
                    </div>
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-3 rounded-lg shadow-lg border border-slate-800">
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Level</p>
                        <p className="text-2xl font-bold text-white mt-1">{level}</p>
                    </div>
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-3 rounded-lg shadow-lg border border-slate-800">
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Lines</p>
                        <p className="text-2xl font-bold text-white mt-1">{linesCleared}</p>
                    </div>
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-3 rounded-lg shadow-lg border border-slate-800">
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">High Score</p>
                        <p className="text-2xl font-bold text-white mt-1">{Math.max(score, highScore)}</p>
                    </div>
                </div>

                
                <div className="flex justify-center space-x-3 mt-2">
                    {gameStarted && (
                        <button
                            onClick={togglePause}
                            className={`
                px-5 py-2.5 cursor-pointer rounded-lg font-semibold transition-all text-white shadow-lg text-sm
                ${
                    isPaused
                        ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        : "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600"
                }
                transform hover:-translate-y-0.5 active:translate-y-0
              `}
                        >
                            {isPaused ? "Resume" : "Pause"}
                        </button>
                    )}
                    <button
                        onClick={resetGame}
                        className="
              px-5 py-2.5 cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg font-semibold 
              text-white hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg text-sm
              transform hover:-translate-y-0.5 active:translate-y-0
            "
                    >
                        {gameStarted ? "Restart" : "Start Game"}
                    </button>
                </div>

                
                <div className="mt-2 flex justify-center">
                    <button
                        onClick={() => setShowGhost((prev) => !prev)}
                        className={`
              flex items-center cursor-pointer justify-center px-3 py-1.5 rounded-md text-xs
              ${showGhost ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-700 hover:bg-gray-600"}
              transition-colors
            `}
                    >
                        <span className="mr-1">Ghost Piece</span>
                        <span className={`inline-block w-3 h-3 rounded-full ${showGhost ? "bg-green-400" : "bg-gray-400"}`}></span>
                    </button>
                </div>

                
                <div className="hidden md:block mt-4 border-t border-slate-700 pt-4">
                    <h3 className="text-center font-semibold mb-3 text-gray-400 text-sm">Controls</h3>
                    <div className="space-y-2"> 
                        
                        <div className="grid grid-cols-2 gap-x-3 gap-y-2 pl-4">
                            <div className="flex items-center gap-1"> 
                                <kbd className="font-sans border rounded px-2 py-1 bg-gray-800 text-gray-300 shadow-sm">←</kbd> <span className="text-gray-400 text-xs">Move Left</span>
                            </div>
                            <div className="flex items-center gap-1"> 
                                <kbd className="font-sans border rounded px-2 py-1 bg-gray-800 text-gray-300 shadow-sm">→</kbd> <span className="text-gray-400 text-xs">Move Right</span>
                            </div>
                            <div className="flex items-center gap-1"> 
                                <kbd className="font-sans border rounded px-2 py-1 bg-gray-800 text-gray-300 shadow-sm">↑</kbd> <span className="text-gray-400 text-xs">Rotate</span>
                            </div>
                            <div className="flex items-center gap-1"> 
                                <kbd className="font-sans border rounded px-2 py-1 bg-gray-800 text-gray-300 shadow-sm">↓</kbd> <span className="text-gray-400 text-xs">Drop</span>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-1 pl-16"> 
                            <kbd className="font-sans border rounded px-2 py-1 bg-gray-800 text-gray-300 shadow-sm whitespace-nowrap">Space</kbd> <span className="text-gray-400 text-xs">Hard Drop</span>
                        </div>
                        <div className="flex items-center gap-1 pl-16"> 
                            <kbd className="font-sans border rounded px-2 py-1 bg-gray-800 text-gray-300 shadow-sm">P</kbd> <span className="text-gray-400 text-xs">Pause/Resume</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    });
    GameInfoPanel.displayName = "GameInfoPanel";

    const TouchControlsPanel = React.memo(
        ({ onControl, disabled }: { onControl: (action: TouchControlAction) => void; disabled?: boolean }) => {
            const buttonBaseClass = `
        p-4 bg-gray-800/80 backdrop-blur-sm rounded-xl text-white font-bold text-2xl
        hover:bg-gray-700/90 active:bg-gray-600 transition-all 
        disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center
        shadow-lg border border-slate-700 transform hover:-translate-y-0.5 active:translate-y-0
      `;
            const iconClass = "w-6 h-6";

            return (
                <div className="md:hidden mt-8 w-full max-w-xs">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        
                        <button onClick={() => onControl("left")} className={buttonBaseClass} aria-label="Move Left" disabled={disabled}>
                            <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                        <button onClick={() => onControl("rotate")} className={buttonBaseClass} aria-label="Rotate" disabled={disabled}>
                            <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm12 14a1 1 0 01-1-1v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 111.885-.666A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 01-1 1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                        <button onClick={() => onControl("right")} className={buttonBaseClass} aria-label="Move Right" disabled={disabled}>
                            <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>

                        
                        <button
                            onClick={() => onControl("down")}
                            className={`${buttonBaseClass} col-span-1`}
                            aria-label="Move Down"
                            disabled={disabled}
                        >
                            <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                        <button
                            onClick={() => onControl("drop")}
                            className={`${buttonBaseClass} col-span-2 bg-blue-600/80 hover:bg-blue-700/90 active:bg-blue-800`}
                            aria-label="Hard Drop"
                            disabled={disabled}
                        >
                            <svg className={`${iconClass} mr-1`} fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M10 3a1 1 0 011 1v5.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L9 9.586V4a1 1 0 011-1zm-7 9a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Drop
                        </button>
                    </div>

                    
                    <div className="mt-4 flex justify-center">
                        <button
                            onClick={() => onControl("pause")}
                            className={`
                px-5 py-2.5 rounded-lg font-semibold transition-all text-white shadow-lg text-sm
                ${isPaused ? "bg-green-600" : "bg-yellow-500"}
                w-full max-w-xs
              `}
                            disabled={disabled && !isPaused}
                        >
                            {isPaused ? "Resume Game" : "Pause Game"}
                        </button>
                    </div>
                </div>
            );
        }
    );
    TouchControlsPanel.displayName = "TouchControlsPanel";

    const GameBoardDisplay = React.memo(() => {
        const visibleBoard = useMemo(() => {
            const newVisibleBoard = board.map((row) => [...row]);
            const shape = getCurrentShapeMatrix(currentPiece);

            if (currentPiece && shape) {
                const { pos } = currentPiece;
                for (let y = 0; y < shape.length; y++) {
                    for (let x = 0; x < shape[y].length; x++) {
                        if (shape[y][x] !== 0) {
                            const boardY = pos.y + y;
                            const boardX = pos.x + x;

                            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
                                newVisibleBoard[boardY][boardX] = currentPiece.color;
                            }
                        }
                    }
                }
            }
            return newVisibleBoard;
        }, [board, currentPiece]);

        
        const ghostPiecePosition = useMemo(() => {
            if (!currentPiece || gameOver || isPaused || !showGhost) return null;

            const shape = getCurrentShapeMatrix(currentPiece);
            if (!shape) return null; 

            let determinedLandingPosY = currentPiece.pos.y; 

            
            for (let testY = currentPiece.pos.y; testY < BOARD_HEIGHT; testY++) {
                let collisionAtThisTestY = false;
                
                for (let y_offset = 0; y_offset < shape.length; y_offset++) {
                    for (let x_offset = 0; x_offset < shape[y_offset].length; x_offset++) {
                        if (shape[y_offset][x_offset] !== 0) { 
                            const boardY = testY + y_offset; 
                            const boardX = currentPiece.pos.x + x_offset; 

                            if (
                                boardX < 0 ||
                                boardX >= BOARD_WIDTH ||
                                boardY >= BOARD_HEIGHT ||
                                (boardY >= 0 && board[boardY]?.[boardX] !== 0) 
                            ) {
                                collisionAtThisTestY = true;
                                break;
                            }
                        }
                    }
                    if (collisionAtThisTestY) break;
                }

                if (collisionAtThisTestY) {
                    
                    
                    
                    break; 
                } else {
                    
                    
                    determinedLandingPosY = testY; 
                }
            }

            
            return determinedLandingPosY !== currentPiece.pos.y
                ? {
                      pos: { x: currentPiece.pos.x, y: determinedLandingPosY },
                      rotation: currentPiece.rotation,
                      shape: shape,
                  }
                : null;
        }, [currentPiece, gameOver, isPaused, showGhost, board]);

        return (
            <div className="relative self-center sm:self-start">
                
                <div
                    className="grid border-4 border-slate-700 rounded-lg overflow-hidden shadow-2xl bg-gray-900/90"
                    style={{
                        gridTemplateColumns: `repeat(${BOARD_WIDTH}, 1fr)`,
                        gridTemplateRows: `repeat(${BOARD_HEIGHT}, 1fr)`,
                        boxShadow: "0 0 20px rgba(59, 130, 246, 0.3), inset 0 0 10px rgba(0, 0, 0, 0.5)",
                    }}
                >
                    
                    <div
                        className="absolute inset-0 grid"
                        style={{
                            gridTemplateColumns: `repeat(${BOARD_WIDTH}, 1fr)`,
                            gridTemplateRows: `repeat(${BOARD_HEIGHT}, 1fr)`,
                            pointerEvents: "none",
                            opacity: 0.1,
                        }}
                    >
                        {Array.from({ length: BOARD_WIDTH * BOARD_HEIGHT }).map((_, i) => (
                            <div key={`grid-${i}`} className="border border-white/20"></div>
                        ))}
                    </div>

                    
                    {ghostPiecePosition && ghostPiecePosition.shape && !clearingLines.length && (
                        <>
                            {ghostPiecePosition.shape.map((row, y) =>
                                row.map((cell, x) => {
                                    if (cell !== 0) {
                                        const boardY = ghostPiecePosition.pos.y + y;
                                        const boardX = ghostPiecePosition.pos.x + x;

                                        if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
                                            const color = currentPiece?.color || "";
                                            const ghostColor = color.replace(/bg-(\w+)-(\d+)/, "bg-$1-$2/30");

                                            return (
                                                <div
                                                    key={`ghost-${boardY}-${boardX}`}
                                                    className={`${CELL_SIZE_CLASSES} border-2 border-dashed ${ghostColor} border-white/30`}
                                                    style={{
                                                        gridRowStart: boardY + 1,
                                                        gridColumnStart: boardX + 1,
                                                        zIndex: 1,
                                                    }}
                                                />
                                            );
                                        }
                                    }
                                    return null;
                                })
                            )}
                        </>
                    )}

                    
                    {visibleBoard.map((row, y_idx) =>
                        row.map((cell, x_idx) => {
                            const isClearingLine = clearingLines.includes(y_idx);
                            return (
                                <div
                                    key={`cell-${y_idx}-${x_idx}`}
                                    className={`
                    ${CELL_SIZE_CLASSES}
                    ${cell ? `${cell} shadow-inner` : "bg-gray-900/80"}
                    ${
                        isClearingLine
                            ? "animate-pulse bg-white border-white"
                            : cell
                            ? "border border-white/20"
                            : "border border-gray-800/40"
                    }
                    ${cell ? "shadow-[inset_0_0_5px_rgba(0,0,0,0.3)]" : ""}
                    transition-colors duration-100
                  `}
                                    style={{
                                        gridRowStart: y_idx + 1,
                                        gridColumnStart: x_idx + 1,
                                        ...(isClearingLine ? { animation: "pulse 0.5s infinite" } : {}),
                                    }}
                                />
                            );
                        })
                    )}
                </div>

                
                {gameOver && (
                    <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center rounded-lg text-center p-4 z-10 backdrop-blur-sm">
                        <h2 className="text-4xl font-extrabold text-red-500 mb-5 animate-bounce">Game Over</h2>
                        <p className="text-xl text-gray-300 mb-2">Score: {score}</p>
                        <p className="text-lg text-gray-400 mb-6">High Score: {Math.max(score, highScore)}</p>
                        <button
                            onClick={resetGame}
                            className="px-7 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg text-white font-bold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg text-lg"
                        >
                            Play Again
                        </button>
                    </div>
                )}

                
                {isPaused && !gameOver && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center rounded-lg text-yellow-400 z-10 backdrop-blur-sm">
                        <svg
                            className="w-16 h-16 mb-4 opacity-80"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <h2 className="text-3xl font-bold tracking-wider">PAUSED</h2>
                        <button
                            onClick={togglePause}
                            className="mt-6 px-5 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-md font-semibold text-white transition-colors shadow-md text-sm"
                        >
                            Resume Game
                        </button>
                    </div>
                )}

                
                {!gameStarted && !gameOver && (
                    <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center rounded-lg text-center p-4 z-10 backdrop-blur-sm">
                        <div className="mb-6 relative">
                            <h1 
                                className="text-4xl sm:text-6xl font-extrabold text-center bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent filter drop-shadow-lg bg-[size:200%_auto] animate-[gradient-flow_5s_ease-in-out_infinite]"
                            >
                                Tetris
                            </h1>
                            <div className="absolute -inset-2 bg-gradient-to-r from-pink-400/10 via-purple-400/10 to-indigo-400/10 blur-xl opacity-50 rounded-full"></div>
                        </div>
                        <p className="text-md text-gray-300 mb-8">
                            Experience classic block-stacking with pieces <br /> from 1 to 5 squares!
                        </p>
                        <button
                            onClick={resetGame}
                            className="group relative px-8 py-4 bg-gradient-to-r from-green-500 to-cyan-500 rounded-lg text-white font-bold hover:from-green-600 hover:to-cyan-600 transition-all shadow-xl text-xl"
                        >
                            <span className="relative z-10">Start Game</span>
                            <span className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-green-400 to-cyan-400 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-50"></span>
                        </button>
                    </div>
                )}
            </div>
        );
    });
    GameBoardDisplay.displayName = "GameBoardDisplay";

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 text-white py-8 px-4 font-sans select-none">
            
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                
                <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

                
                <div className="absolute inset-0 bg-grid-white/[0.03]"></div>
            </div>

            
            <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-6xl mx-auto">
                
                <div className="w-full mb-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
                        
                        <div className="mb-4 sm:mb-0 relative">
                            <h1 
                                className="text-4xl sm:text-6xl font-extrabold text-center bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent filter drop-shadow-lg bg-[size:200%_auto] animate-[gradient-flow_5s_ease-in-out_infinite]"
                            >
                                Tetris
                            </h1>
                            <div className="hidden sm:block absolute -inset-2 bg-gradient-to-r from-pink-400/10 via-purple-400/10 to-indigo-400/10 blur-xl opacity-50 rounded-full"></div>
                        </div>

                        
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => document.getElementById("howToPlayModal")?.classList.remove("hidden")}
                                className="px-4 cursor-pointer py-2 bg-indigo-600/60 hover:bg-indigo-600/80 rounded-lg text-sm font-medium flex items-center gap-2 backdrop-blur-sm border border-indigo-500/20 transition-colors"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                How to Play
                            </button>
                            <div className="relative">
                                <button
                                    onClick={resetGame}
                                    className="px-4 py-2 cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md transform hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    {gameStarted ? "Restart" : "Play Now"}
                                </button>
                                {!gameStarted && !gameOver && (
                                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    
                    <div className="w-full bg-gray-800/60 backdrop-blur-sm rounded-xl p-3 border border-gray-700/30">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="flex flex-col items-center">
                                <span className="text-xs text-gray-400 uppercase tracking-wider">Score</span>
                                <span className="text-xl font-bold">{score}</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-xs text-gray-400 uppercase tracking-wider">High Score</span>
                                <span className="text-xl font-bold">{Math.max(score, highScore)}</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-xs text-gray-400 uppercase tracking-wider">Level</span>
                                <span className="text-xl font-bold">{level}</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-xs text-gray-400 uppercase tracking-wider">Lines</span>
                                <span className="text-xl font-bold">{linesCleared}</span>
                            </div>
                        </div>
                    </div>
                </div>

                
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start justify-center w-full">
                    
                    <div className="flex flex-col items-center w-full md:w-auto">
                        <GameBoardDisplay />
                        <TouchControlsPanel
                            onControl={handleTouchControl}
                            disabled={!gameStarted || gameOver || isPaused || clearingLines.length > 0}
                        />
                    </div>

                    
                    <GameInfoPanel />
                </div>

                
                <div className="mt-10 text-gray-400 text-sm text-center max-w-2xl">
                    <div className="mb-3 flex items-center justify-center">
                        <div className="h-px w-16 bg-gray-700"></div>
                        <span className="mx-4 text-gray-500">Game Features</span>
                        <div className="h-px w-16 bg-gray-700"></div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                        <span className="inline-block px-3 py-1 bg-gray-800/60 rounded-full backdrop-blur-sm text-xs border border-gray-700/50">
                            Ghost Piece Preview
                        </span>
                        <span className="inline-block px-3 py-1 bg-gray-800/60 rounded-full backdrop-blur-sm text-xs border border-gray-700/50">
                            Mobile Controls
                        </span>
                        <span className="inline-block px-3 py-1 bg-gray-800/60 rounded-full backdrop-blur-sm text-xs border border-gray-700/50">
                            Multi-Sized Pieces
                        </span>
                        <span className="inline-block px-3 py-1 bg-gray-800/60 rounded-full backdrop-blur-sm text-xs border border-gray-700/50">
                            High Score Tracking
                        </span>
                        <span className="inline-block px-3 py-1 bg-gray-800/60 rounded-full backdrop-blur-sm text-xs border border-gray-700/50">
                            Progressive Difficulty
                        </span>
                    </div>
                    <p className="text-gray-500 text-xs">© 2023 Tetris Game • Keyboard controls on Desktop • Touch controls on Mobile</p>
                </div>
            </div>

            
            <div id="howToPlayModal" className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center hidden">
                <div className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4 shadow-2xl border border-gray-800">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-white">How to Play</h2>
                            <button
                                onClick={() => document.getElementById("howToPlayModal")?.classList.add("hidden")}
                                className="text-gray-400 hover:text-white"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-indigo-400 mb-2">Game Objective</h3>
                                <p className="text-gray-300">
                                    Arrange falling pieces to create complete horizontal lines. When a line is completed, it disappears, and
                                    you earn points. The game ends when the pieces stack up to the top of the board.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-indigo-400 mb-2">Controls</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-800/60 p-3 rounded-lg">
                                        <h4 className="text-white font-medium mb-2">Desktop</h4>
                                        <ul className="space-y-2 text-gray-300 text-sm">
                                            <li className="flex items-center gap-2">
                                                <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">←</kbd>
                                                <span>Move Left</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">→</kbd>
                                                <span>Move Right</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">↓</kbd>
                                                <span>Move Down</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">↑</kbd>
                                                <span>Rotate</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">Space</kbd>
                                                <span>Hard Drop</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">P</kbd>
                                                <span>Pause/Resume</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="bg-gray-800/60 p-3 rounded-lg">
                                        <h4 className="text-white font-medium mb-2">Mobile</h4>
                                        <div className="text-gray-300 text-sm">
                                            Use the on-screen buttons to control the game:
                                            <ul className="mt-2 space-y-1 text-gray-300 text-sm">
                                                <li>• Tap left/right arrows to move</li>
                                                <li>• Tap rotate button to rotate piece</li>
                                                <li>• Tap down arrow for soft drop</li>
                                                <li>• Tap Drop for hard drop</li>
                                                <li>• Tap Pause to pause the game</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-indigo-400 mb-2">Scoring</h3>
                                <ul className="space-y-1 text-gray-300">
                                    <li>• 1 line cleared: 100 points × level</li>
                                    <li>• 2 lines cleared: 300 points × level</li>
                                    <li>• 3 lines cleared: 500 points × level</li>
                                    <li>• 4 lines cleared: 800 points × level</li>
                                    <li>• Small pieces (1-2 blocks) have a 1.5× score multiplier</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-indigo-400 mb-2">Features</h3>
                                <ul className="space-y-1 text-gray-300">
                                    <li>• Ghost piece shows where your piece will land</li>
                                    <li>• Next piece preview helps you plan ahead</li>
                                    <li>• Variety of pieces from 1 to 5 blocks</li>
                                    <li>• Level increases every 10 lines cleared</li>
                                    <li>• Higher levels = faster falling speed</li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <button
                                onClick={() => document.getElementById("howToPlayModal")?.classList.add("hidden")}
                                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors"
                            >
                                Got it
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            
            <style jsx global>{`
                @keyframes blob {
                    0% {
                        transform: scale(1);
                    }
                    33% {
                        transform: scale(1.1) translate(50px, -20px) rotate(20deg);
                    }
                    66% {
                        transform: scale(0.9) translate(-20px, 30px) rotate(-20deg);
                    }
                    100% {
                        transform: scale(1);
                    }
                }
                .animate-blob {
                    animation: blob 15s infinite alternate;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                .bg-grid-white {
                    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255,255,255)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
                }
                @keyframes gradient-flow {
                  0% {
                    background-position: 0% 50%;
                  }
                  50% {
                    background-position: 100% 50%;
                  }
                  100% {
                    background-position: 0% 50%;
                  }
                }
            `}</style>
        </div>
    );
};

export default TetrisGame;
