"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoChatbubbles } from "react-icons/io5";
import { FaUsers, FaUndo, FaTrophy } from "react-icons/fa";
import { MdShuffle } from "react-icons/md";
import { HiLightningBolt } from "react-icons/hi";
import { BiSend } from "react-icons/bi";

const GlobalThemeStyles = () => (
    <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&family=Open+Sans:wght@300;400;500;600;700&display=swap');
        
        :root {
            --page-bg: #f8fafc;
            --page-text-primary: #1e293b;
            --page-text-secondary: #64748b;
            --card-bg: #ffffff;
            --card-bg-secondary: #f1f5f9;
            --accent-primary: #3b82f6;
            --accent-secondary: #8b5cf6;
            --accent-tertiary: #10b981;
            --accent-warning: #f59e0b;
            --accent-danger: #ef4444;
            --border-color-primary: #e2e8f0;
            --border-color-secondary: #cbd5e1;
            --shadow-light: rgba(0, 0, 0, 0.05);
            --shadow-medium: rgba(0, 0, 0, 0.1);
            --shadow-heavy: rgba(0, 0, 0, 0.25);
            --backdrop-blur: rgba(255, 255, 255, 0.1);
            --font-heading: 'Oswald', sans-serif;
            --font-body: 'Open Sans', sans-serif;
            --scrollbar-thumb: #cbd5e1;
            --scrollbar-track: #f1f5f9;
        }



        body {
            background-color: var(--page-bg);
            color: var(--page-text-primary);
            font-family: var(--font-body);
        }

        h1, h2, h3, h4, h5, h6 {
            font-family: var(--font-heading);
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
            background: var(--border-color-secondary);
        }
    `}</style>
);

const shadeColor = (color: string, percent: number): string => {
    const num = parseInt(color.slice(1), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, Math.max(0, (num >> 16) + amt));
    const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt));
    const B = Math.min(255, Math.max(0, (num & 0x0000ff) + amt));
    return "#" + (0x1000000 + (R << 16) + (G << 8) + B).toString(16).slice(1).toUpperCase();
};

interface PuzzlePiece {
    id: string;
    x: number;
    y: number;
    correctX: number;
    correctY: number;
    isPlaced: boolean;
    row: number;
    col: number;
    imageOffsetX: number;
    imageOffsetY: number;
}

interface ChatMessage {
    id: string;
    user: string;
    message: string;
    timestamp: number;
    type: "message" | "system";
}

interface Player {
    id: string;
    name: string;
    color: string;
    active: boolean;
    score: number;
}

const PuzzleGame: React.FC = () => {
    const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
    const [draggedPiece, setDraggedPiece] = useState<string | null>(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [completedPieces, setCompletedPieces] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameCompleted, setGameCompleted] = useState(false);

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [chatVisible, setChatVisible] = useState(false);
    const [isProcessingDrop, setIsProcessingDrop] = useState(false);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [roomId, setRoomId] = useState<string | null>(null);
    const [playerId, setPlayerId] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const [players, setPlayers] = useState<Player[]>([
        { id: "1", name: "You", color: "#3B82F6", active: true, score: 0 },
        { id: "2", name: "Alex", color: "#10B981", active: true, score: 0 },
        { id: "3", name: "Sam", color: "#F59E0B", active: false, score: 0 },
    ]);

    const canvasRef = useRef<HTMLDivElement>(null);
    const chatRef = useRef<HTMLDivElement>(null);

    const initializePuzzle = useCallback(() => {
        const newPieces: PuzzlePiece[] = [];

        const isMobile = window.innerWidth < 768;
        const containerWidth = isMobile ? window.innerWidth * 0.95 : 800;
        const containerHeight = isMobile ? window.innerWidth * 0.7 : 600;
        const spacing = isMobile ? Math.min(55, containerWidth / 7) : 120;
        const puzzleWidth = 4 * spacing;
        const puzzleHeight = 3 * spacing;
        const baseX = (containerWidth - puzzleWidth) / 2 + 20;
        const baseY = (containerHeight - puzzleHeight) / 2 + 20;

        for (let i = 0; i < 12; i++) {
            const row = Math.floor(i / 4);
            const col = i % 4;
            const correctX = col * spacing + baseX;
            const correctY = row * spacing + baseY;

            newPieces.push({
                id: `piece-${i}`,
                x: Math.random() * (isMobile ? Math.min(200, containerWidth - 80) : 600) + 20,
                y: Math.random() * (isMobile ? Math.min(250, containerHeight - 80) : 400) + 20,
                correctX,
                correctY,
                isPlaced: false,
                row,
                col,
                imageOffsetX: col * spacing,
                imageOffsetY: row * spacing,
            });
        }

        setPieces(newPieces);
        setCompletedPieces(0);
        setGameCompleted(false);
        addSystemMessage("Puzzle pieces scattered! Work together to reconstruct the image.");
    }, []);

    const addSystemMessage = (message: string) => {
        const systemMessage: ChatMessage = {
            id: generateId(),
            user: "System",
            message,
            timestamp: Date.now(),
            type: "system",
        };
        setMessages((prev) => [...prev, systemMessage]);
    };

    const startGame = () => {
        setGameStarted(true);
        initializePuzzle();
    };

    const beginDragOperation = (pieceId: string, e: React.MouseEvent | React.TouchEvent) => {
        const piece = pieces.find((p) => p.id === pieceId);
        if (!piece || piece.isPlaced) return;

        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
        const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

        setDraggedPiece(pieceId);
        setDragOffset({
            x: clientX - piece.x,
            y: clientY - piece.y,
        });
    };

    const movePiece = useCallback(
        (e: MouseEvent | TouchEvent) => {
            if (!draggedPiece) return;

            const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
            const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

            const newX = clientX - dragOffset.x;
            const newY = clientY - dragOffset.y;

            setPieces((prev) => prev.map((piece) => (piece.id === draggedPiece ? { ...piece, x: newX, y: newY } : piece)));
        },
        [draggedPiece, dragOffset]
    );

    const releasePiece = useCallback(() => {
        if (!draggedPiece || isProcessingDrop) return;
        setIsProcessingDrop(true);

        const piece = pieces.find((p) => p.id === draggedPiece);
        if (!piece) return;

        const distance = Math.sqrt(Math.pow(piece.x - piece.correctX, 2) + Math.pow(piece.y - piece.correctY, 2));

        if (distance < 30 && !piece.isPlaced) {
            setPieces((prev) => prev.map((p) => (p.id === draggedPiece ? { ...p, x: p.correctX, y: p.correctY, isPlaced: true } : p)));

            const newCount = completedPieces + 1;

            if (newCount === 12) {
                setGameCompleted(true);
                addSystemMessage("🎉 Puzzle completed! Great teamwork! The beautiful image has been fully reconstructed!");
            } else {
                addSystemMessage(`Piece placed! Team progress: ${newCount}/12 pieces completed.`);
            }

            setCompletedPieces(newCount);

            setPlayers((prev) => prev.map((p) => (p.id === "1" ? { ...p, score: p.score + 10 } : p)));
        }

        setDraggedPiece(null);
        setIsProcessingDrop(false);
    }, [draggedPiece, pieces, completedPieces]);

    useEffect(() => {
        const wsUrl = "ws://localhost:8080";
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log("WebSocket connected to localhost");
            setIsConnected(true);

            const room = window.location.search.split("room=")[1] || generateId();
            setRoomId(room);

            const playerId = localStorage.getItem("playerId") || generateId();
            setPlayerId(playerId);
            localStorage.setItem("playerId", playerId);

            ws.send(
                JSON.stringify({
                    type: "join",
                    room,
                    playerId,
                    playerName: "You",
                })
            );
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                switch (data.type) {
                    case "state":
                        setPieces(data.pieces);
                        setCompletedPieces(data.completedPieces);
                        setPlayers(data.players);
                        setGameStarted(true);
                        setGameCompleted(data.gameCompleted);
                        break;

                    case "chat":
                        setMessages((prev) => [...prev, data.message]);
                        break;

                    case "move":
                        setPieces((prev) => prev.map((p) => (p.id === data.pieceId ? { ...p, x: data.x, y: data.y } : p)));
                        break;

                    case "place":
                        setPieces((prev) =>
                            prev.map((p) => (p.id === data.pieceId ? { ...p, isPlaced: true, x: p.correctX, y: p.correctY } : p))
                        );
                        setCompletedPieces(data.completedPieces);
                        setPlayers(data.players);
                        if (data.completedPieces === 12) {
                            setGameCompleted(true);
                        }
                        break;

                    case "reset":
                        initializePuzzle();
                        break;

                    case "system":
                        setMessages((prev) => [
                            ...prev,
                            {
                                id: generateId(),
                                user: "System",
                                message: data.message,
                                timestamp: Date.now(),
                                type: "system",
                            },
                        ]);
                        break;

                    default:
                        console.warn("Unknown message type:", data.type);
                }
            } catch (error) {
                console.error("Error parsing WebSocket message:", error);
            }
        };

        ws.onclose = () => {
            console.log("WebSocket disconnected");
            setIsConnected(false);
            setTimeout(() => {
                console.log("Attempting to reconnect...");
                setSocket(new WebSocket(wsUrl));
            }, 3000);
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        setSocket(ws);

        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, [initializePuzzle]);

    useEffect(() => {
        const trackMouseMovement = (e: MouseEvent) => movePiece(e);
        const finishMouseDrag = () => releasePiece();
        const trackTouchMovement = (e: TouchEvent) => {
            e.preventDefault();
            movePiece(e);
        };
        const finishTouchDrag = () => releasePiece();

        if (draggedPiece) {
            document.addEventListener("mousemove", trackMouseMovement);
            document.addEventListener("mouseup", finishMouseDrag);
            document.addEventListener("touchmove", trackTouchMovement, { passive: false });
            document.addEventListener("touchend", finishTouchDrag);
        }

        return () => {
            document.removeEventListener("mousemove", trackMouseMovement);
            document.removeEventListener("mouseup", finishMouseDrag);
            document.removeEventListener("touchmove", trackTouchMovement);
            document.removeEventListener("touchend", finishTouchDrag);
        };
    }, [draggedPiece, movePiece, releasePiece]);

    const sendMessage = () => {
        if (!newMessage.trim()) return;

        const message: ChatMessage = {
            id: generateId(),
            user: "You",
            message: newMessage,
            timestamp: Date.now(),
            type: "message",
        };

        setMessages((prev) => [...prev, message]);
        setNewMessage("");

        if (Math.random() > 0.5) {
            setTimeout(() => {
                const responses = [
                    "Nice move!",
                    "I see a pattern here",
                    "Let me help with that corner",
                    "Great progress everyone!",
                    "This piece might go here",
                    "Almost got it!",
                    "Good teamwork! 🎯",
                    "I think I found a match",
                    "Working on the edges first",
                    "Sky pieces are tricky!",
                    "Found another blue piece",
                    "This puzzle is beautiful 🌄",
                    "Anyone need help with corners?",
                    "Love this collaboration!",
                    "Getting closer to solving it",
                    "That piece fits perfectly!",
                ];
                const randomPlayer = players[Math.floor(Math.random() * (players.length - 1)) + 1];
                const response: ChatMessage = {
                    id: generateId(),
                    user: randomPlayer.name,
                    message: responses[Math.floor(Math.random() * responses.length)],
                    timestamp: Date.now() + 1,
                    type: "message",
                };
                setMessages((prev) => [...prev, response]);
            }, 1000 + Math.random() * 2000);
        }
    };

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages]);

    const getPuzzlePieceClipPath = (piece: PuzzlePiece) => {
        const { row, col } = piece;
        const rows = 3;
        const cols = 4;
        
        // Create different jigsaw puzzle piece shapes based on position
        // Each piece has tabs (outward bumps) and blanks (inward curves) on different sides
        
        // Base rectangle with jigsaw cuts
        let clipPath = "polygon(";
        
        // Top edge
        if (row === 0) {
            clipPath += "0% 0%, 100% 0%"; // Straight top edge for top row
        } else {
            // Add tab or blank on top
            const hasTopTab = (row + col) % 2 === 0;
            if (hasTopTab) {
                clipPath += "0% 0%, 35% 0%, 40% -10%, 60% -10%, 65% 0%, 100% 0%"; // Top tab
            } else {
                clipPath += "0% 0%, 35% 0%, 40% 10%, 60% 10%, 65% 0%, 100% 0%"; // Top blank
            }
        }
        
        // Right edge
        if (col === cols - 1) {
            clipPath += ", 100% 100%"; // Straight right edge for rightmost column
        } else {
            // Add tab or blank on right
            const hasRightTab = (row + col + 1) % 2 === 0;
            if (hasRightTab) {
                clipPath += ", 100% 35%, 110% 40%, 110% 60%, 100% 65%, 100% 100%"; // Right tab
            } else {
                clipPath += ", 100% 35%, 90% 40%, 90% 60%, 100% 65%, 100% 100%"; // Right blank
            }
        }
        
        // Bottom edge
        if (row === rows - 1) {
            clipPath += ", 0% 100%"; // Straight bottom edge for bottom row
        } else {
            // Add tab or blank on bottom
            const hasBottomTab = (row + col + 2) % 2 === 0;
            if (hasBottomTab) {
                clipPath += ", 65% 100%, 60% 110%, 40% 110%, 35% 100%, 0% 100%"; // Bottom tab
            } else {
                clipPath += ", 65% 100%, 60% 90%, 40% 90%, 35% 100%, 0% 100%"; // Bottom blank
            }
        }
        
        // Left edge
        if (col === 0) {
            clipPath += ", 0% 0%"; // Straight left edge for leftmost column
        } else {
            // Add tab or blank on left
            const hasLeftTab = (row + col + 3) % 2 === 0;
            if (hasLeftTab) {
                clipPath += ", 0% 65%, -10% 60%, -10% 40%, 0% 35%, 0% 0%"; // Left tab
            } else {
                clipPath += ", 0% 65%, 10% 60%, 10% 40%, 0% 35%, 0% 0%"; // Left blank
            }
        }
        
        clipPath += ")";
        return clipPath;
    };

    const renderPiece = (piece: PuzzlePiece) => {
        const isMobile = window.innerWidth < 768;
        const size = isMobile ? Math.min(45, window.innerWidth / 8) : 100;
        const isDragging = draggedPiece === piece.id;

        // Beautiful landscape image for the puzzle
        const puzzleImage = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80";

        const style: React.CSSProperties = {
            position: "absolute",
            left: piece.x,
            top: piece.y,
            width: size * 1.2, // Slightly larger to accommodate tabs
            height: size * 1.2,
            backgroundImage: `url(${puzzleImage})`,
            backgroundSize: `${4 * size * 1.2}px ${3 * size * 1.2}px`, // Total puzzle size
            backgroundPosition: `-${piece.imageOffsetX * 1.2}px -${piece.imageOffsetY * 1.2}px`,
            clipPath: getPuzzlePieceClipPath(piece),
            cursor: piece.isPlaced ? "default" : "grab",
            transform: isDragging ? "scale(1.1) rotate(5deg)" : "scale(1)",
            transition: isDragging ? "none" : "all 0.3s ease-in-out",
            filter: piece.isPlaced ? "none" : "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
            opacity: piece.isPlaced ? 0.95 : 1,
            zIndex: isDragging ? 1000 : piece.isPlaced ? 1 : 10,
        };

        return (
            <div
                key={piece.id}
                style={style}
                onMouseDown={(e) => beginDragOperation(piece.id, e)}
                onTouchStart={(e) => beginDragOperation(piece.id, e)}
                className="select-none touch-none"
            />
        );
    };

    const renderTargetSpots = () => {
        const isMobile = window.innerWidth < 768;
        const size = isMobile ? Math.min(45, window.innerWidth / 8) : 100;

        return pieces.map((piece) => (
            <div
                key={`target-${piece.id}`}
                style={{
                    position: "absolute",
                    left: piece.correctX,
                    top: piece.correctY,
                    width: size * 1.2,
                    height: size * 1.2,
                    clipPath: getPuzzlePieceClipPath(piece),
                    border: piece.isPlaced ? "none" : "2px dashed rgba(255,255,255,0.3)",
                    background: piece.isPlaced 
                        ? "transparent"
                        : "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))",
                    pointerEvents: "none",
                    opacity: piece.isPlaced ? 0 : 0.4,
                }}
            />
        ));
    };

    if (!gameStarted) {
        return (
            <>
                <GlobalThemeStyles />
                <motion.div 
                    className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.div 
                        className="text-center max-w-md mx-auto"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <motion.div 
                            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <motion.div
                                animate={{ 
                                    rotate: [0, -10, 10, -10, 0],
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{ 
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatDelay: 3
                                }}
                            >
                                <FaTrophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                            </motion.div>
                            <motion.h1 
                                className="text-4xl font-bold text-white mb-4 font-[var(--font-heading)]"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                            >
                                Jigsaw Puzzle Quest
                            </motion.h1>
                            <motion.p 
                                className="text-white/80 mb-6 text-lg font-[var(--font-body)]"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.8 }}
                            >
                                Work together to reconstruct the beautiful landscape image from scattered jigsaw pieces. Drag and drop pieces to their correct positions!
                            </motion.p>
                            <motion.button
                                onClick={startGame}
                                className="cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl shadow-xl"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.6, delay: 1.0 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Start Adventure
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </>
        );
    }

    return (
        <>
            <GlobalThemeStyles />
            <motion.div 
                className="min-h-screen relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
            <motion.header 
                className="bg-gradient-to-r from-purple-800/70 to-blue-800/70 backdrop-blur-lg border-b border-white/10 px-4 py-3"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="bg-yellow-400/10 p-2 rounded-xl">
                            <FaTrophy className="w-6 h-6 text-yellow-400" />
                        </div>
                        <h1 className="text-xl md:text-2xl font-bold tracking-tight font-[var(--font-heading)]">Jigsaw Puzzle Quest</h1>
                    </div>

                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2 bg-black/20 p-2 rounded-xl">
                            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-1 rounded-lg">
                                <HiLightningBolt className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm font-medium">{completedPieces}/12</span>
                            <div className="w-20 md:w-32 bg-white/20 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${(completedPieces / 12) * 100}%` }}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 bg-black/20 p-2 rounded-xl">
                            <FaUsers className="w-4 h-4" />
                            <div className="flex -space-x-2">
                                {players.map((player) => (
                                    <div
                                        key={player.id}
                                        className={`w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold ${
                                            player.active ? "opacity-100" : "opacity-50"
                                        }`}
                                        style={{ backgroundColor: player.color }}
                                        title={`${player.name} - ${player.score} pts`}
                                    >
                                        {player.name[0]}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.header>

            <div className="flex flex-col lg:flex-row h-[calc(100vh-117px)] lg:h-[calc(100vh-73px)] relative">
                <div className="flex-1 relative overflow-hidden">
                    <div
                        ref={canvasRef}
                        className="absolute inset-0 animated-bg flex items-center justify-center p-8"
                        style={{ touchAction: "none" }}
                    >
                        <div className="relative w-[95vw] md:w-[80vw] max-w-[800px] h-[70vw] md:h-[60vw] max-h-[600px]">
                            {/* Puzzle assembly area */}
                            <div className="absolute inset-3 md:inset-6 rounded-xl border-2 border-blue-400/30 bg-white/5 backdrop-blur-sm"></div>
                            
                            {/* Corner guides */}
                            <div className="absolute top-3 left-3 text-blue-400/40 text-sm">🧩</div>
                            <div className="absolute top-3 right-3 text-blue-400/40 text-sm">🧩</div>
                            <div className="absolute bottom-3 left-3 text-blue-400/40 text-sm">🧩</div>
                            <div className="absolute bottom-3 right-3 text-blue-400/40 text-sm">🧩</div>
                            
                            {renderTargetSpots()}
                            {pieces.map(renderPiece)}
                            
                            {/* Progress overlay */}
                            <AnimatePresence>
                                {completedPieces > 0 && (
                                    <motion.div 
                                        className="absolute top-3 left-3 md:top-6 md:left-6 bg-black/60 backdrop-blur text-blue-300 px-3 py-1 md:px-4 md:py-2 rounded-lg text-sm md:text-base font-bold"
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        transition={{ type: "spring" }}
                                    >
                                        Image Progress: {completedPieces}/12 pieces
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="lg:hidden absolute top-4 left-4 right-4">
                        <div className="bg-black/20 backdrop-blur-lg rounded-2xl p-3 border border-white/10 shadow-lg">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium flex items-center gap-1">
                                    <HiLightningBolt className="w-4 h-4 text-yellow-400" /> Progress
                                </span>
                                <span className="text-sm font-bold bg-blue-500/20 px-2 py-1 rounded-lg">{completedPieces}/12</span>
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${(completedPieces / 12) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-4 left-4 flex gap-2">
                        <motion.button
                            onClick={initializePuzzle}
                            className="cursor-pointer bg-black/30 backdrop-blur-lg hover:bg-white hover:text-black text-white p-3 rounded-xl border border-white/10 hover:border-black/20 transition-all duration-200 shadow-lg flex items-center gap-1"
                            title="New Puzzle"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 1.2 }}
                        >
                            <FaUndo className="w-5 h-5" />
                            <span className="hidden sm:inline">Reset</span>
                        </motion.button>
                        <motion.button
                            onClick={() => {
                                setPieces((prev) =>
                                    prev.map((piece) => ({
                                        ...piece,
                                        x: Math.random() * (window.innerWidth < 768 ? Math.min(200, window.innerWidth * 0.95 - 80) : 600) + 20,
                                        y: Math.random() * (window.innerWidth < 768 ? Math.min(250, window.innerWidth * 0.7 - 80) : 400) + 20,
                                        isPlaced: false,
                                    }))
                                );
                                setCompletedPieces(0);
                                setGameCompleted(false);
                            }}
                            className="cursor-pointer bg-black/30 backdrop-blur-lg hover:bg-white hover:text-black text-white p-3 rounded-xl border border-white/10 hover:border-black/20 transition-all duration-200 shadow-lg flex items-center gap-1"
                            title="Shuffle Pieces"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95, rotate: 180 }}
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 1.4 }}
                        >
                            <MdShuffle className="w-5 h-5" />
                            <span className="hidden sm:inline">Shuffle</span>
                        </motion.button>
                    </div>

                    {gameCompleted && (
                        <>
                            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-lg flex items-center justify-center p-4">
                                <div className="bg-gradient-to-br from-purple-800/90 to-blue-800/90 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-center max-w-md w-full mx-4 shadow-2xl transform animate-scaleIn">
                                    <div className="inline-flex items-center justify-center bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-full mb-4">
                                        <FaTrophy className="w-12 h-12 text-white" />
                                    </div>
                                    <h2 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-white">
                                        Congratulations!
                                    </h2>
                                    <p className="text-white/80 mb-6">You've successfully completed the jigsaw puzzle! The beautiful image is now complete!</p>
                                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                        <button
                                            onClick={initializePuzzle}
                                            className="cursor-pointer flex-1 bg-gradient-to-r from-[var(--accent-tertiary)] to-[var(--accent-primary)] hover:opacity-90 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                                        >
                                            <FaUndo className="w-4 h-4" /> New Image
                                        </button>
                                        <button
                                            onClick={() => setGameCompleted(false)}
                                            className="cursor-pointer flex-1 bg-[var(--backdrop-blur)] hover:opacity-80 text-[var(--page-text-primary)] font-bold py-3 px-6 rounded-xl transition-all duration-200"
                                        >
                                            Continue
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <style>{`
                @keyframes scaleIn {
                  0% { transform: scale(0.8); opacity: 0; }
                  100% { transform: scale(1); opacity: 1; }
                }
                .animate-scaleIn {
                  animation: scaleIn 0.4s ease-out forwards;
                }
                .animate-pulse-slow {
                  animation: pulse 4s infinite;
                }
                @keyframes pulse {
                  0%, 100% { opacity: 1; }
                  50% { opacity: 0.9; }
                }
                .animated-bg {
                  background: linear-gradient(135deg, #0F2027, #203A43, #2C5364);
                  background-size: 400% 400%;
                  animation: gradientShift 20s ease infinite;
                }
                @keyframes gradientShift {
                  0% { background-position: 0% 50%; }
                  50% { background-position: 100% 50%; }
                  100% { background-position: 0% 50%; }
                }
              `}</style>
                        </>
                    )}
                </div>

                {/* Mobile chat backdrop overlay */}
                <AnimatePresence>
                    {chatVisible && (
                        <motion.div 
                            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                            onClick={() => setChatVisible(false)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        />
                    )}
                </AnimatePresence>

                {/* Desktop chat sidebar */}
                <div className={`w-full lg:w-80 bg-black/30 backdrop-blur-lg border-l border-white/10 lg:flex lg:flex-col transition-all hidden lg:flex`}>
                    <div className="p-4 border-b border-white/10 bg-gradient-to-r from-purple-800/40 to-blue-800/40">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-500/20 p-2 rounded-lg">
                                    <IoChatbubbles className="w-5 h-5 text-blue-300" />
                                </div>
                                <h3 className="font-semibold text-lg">Team Chat</h3>
                            </div>
                        </div>
                    </div>

                    <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`${
                                    message.type === "system"
                                        ? "bg-yellow-500/20 border border-yellow-500/30 text-center"
                                        : message.user === "You"
                                        ? "bg-blue-500/20 border border-blue-500/30"
                                        : "bg-white/10 border border-white/20"
                                } rounded-xl p-4 transition-all duration-300 hover:scale-105`}
                            >
                                {message.type !== "system" && (
                                    <div className="text-xs font-semibold mb-1 flex items-center">
                                        <div
                                            className="w-3 h-3 rounded-full mr-2"
                                            style={{
                                                backgroundColor: players.find((p) => p.name === message.user)?.color || "#fff",
                                            }}
                                        />
                                        {message.user}
                                    </div>
                                )}
                                <div className="text-sm">{message.message}</div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 border-t border-white/10 bg-black/20">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                                placeholder="Type a message..."
                                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-500/50 transition-all duration-200"
                            />
                            <button
                                onClick={sendMessage}
                                className="cursor-pointer bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] hover:opacity-90 text-white p-3 rounded-xl transition-all duration-200 shadow-lg flex items-center"
                            >
                                <BiSend className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile chat modal */}
            <AnimatePresence>
                {chatVisible && (
                    <motion.div
                        className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/20 flex flex-col h-[80vh] rounded-t-3xl z-50 lg:hidden"
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ 
                            type: "spring",
                            damping: 30,
                            stiffness: 300
                        }}
                    >
                        <div className="p-4 border-b border-white/10">
                            {/* Mobile modal handle */}
                            <motion.div 
                                className="flex justify-center pb-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="w-12 h-1 bg-white/30 rounded-full"></div>
                            </motion.div>
                            
                            <motion.div 
                                className="flex items-center justify-between"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-500/20 p-2 rounded-lg">
                                        <IoChatbubbles className="w-5 h-5 text-blue-300" />
                                    </div>
                                    <h3 className="font-semibold text-xl">Team Chat</h3>
                                </div>
                                <motion.button
                                    onClick={() => setChatVisible(!chatVisible)}
                                    className="cursor-pointer bg-white/10 hover:bg-white/20 p-3 rounded-lg transition-all duration-200 text-white text-xl font-bold"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    ×
                                </motion.button>
                            </motion.div>
                        </div>

                        <motion.div 
                            className="flex-1 overflow-y-auto p-4 space-y-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            {messages.map((message, index) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 + index * 0.05 }}
                                    className={`${
                                        message.type === "system"
                                            ? "bg-yellow-500/20 border border-yellow-500/30 text-center"
                                            : message.user === "You"
                                            ? "bg-blue-500/20 border border-blue-500/30"
                                            : "bg-white/10 border border-white/20"
                                    } rounded-xl p-4 transition-all duration-300 hover:scale-105`}
                                >
                                    {message.type !== "system" && (
                                        <div className="text-xs font-semibold mb-1 flex items-center">
                                            <div
                                                className="w-3 h-3 rounded-full mr-2"
                                                style={{
                                                    backgroundColor: players.find((p) => p.name === message.user)?.color || "#fff",
                                                }}
                                            />
                                            {message.user}
                                        </div>
                                    )}
                                    <div className="text-sm">{message.message}</div>
                                </motion.div>
                            ))}
                        </motion.div>

                        <motion.div 
                            className="p-4 border-t border-white/10"
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-500/50 transition-all duration-200"
                                />
                                <motion.button
                                    onClick={sendMessage}
                                    className="cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-3 rounded-xl transition-all duration-200 shadow-lg flex items-center"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <BiSend className="w-5 h-5" />
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                onClick={() => setChatVisible(!chatVisible)}
                className="cursor-pointer lg:hidden fixed bottom-4 right-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 z-50 flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.0, type: "spring" }}
            >
                <IoChatbubbles className="w-6 h-6" />
                {messages.length > 0 && (
                    <motion.span 
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring" }}
                    >
                        {messages.length}
                    </motion.span>
                )}
            </motion.button>
        </motion.div>
        </>
    );
};

export default PuzzleGame;
