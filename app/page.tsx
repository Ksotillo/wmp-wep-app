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
    avatar: string;
}

interface MockCursor {
    id: string;
    playerId: string;
    playerName: string;
    playerColor: string;
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    visible: boolean;
    lastSeen: number;
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_socket, setSocket] = useState<WebSocket | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_roomId, setRoomId] = useState<string | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_playerId, setPlayerId] = useState<string | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_isConnected, setIsConnected] = useState(false);
    const [mockCursors, setMockCursors] = useState<MockCursor[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const [players, setPlayers] = useState<Player[]>([
        { 
            id: "1", 
            name: "You", 
            color: "#3B82F6", 
            active: true, 
            score: 0,
            avatar: "https://images.unsplash.com/photo-1728443433557-3fc9e37b58c2?q=80&w=2473&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        { 
            id: "2", 
            name: "Alex", 
            color: "#10B981", 
            active: true, 
            score: 0,
            avatar: "https://images.unsplash.com/photo-1749406196982-ea35a1af66b1?q=80&w=2432&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        { 
            id: "3", 
            name: "Sam", 
            color: "#F59E0B", 
            active: true, 
            score: 0,
            avatar: "https://images.unsplash.com/photo-1749288752497-5fb00d855426?q=80&w=2972&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        { 
            id: "4", 
            name: "Jordan", 
            color: "#8B5CF6", 
            active: true, 
            score: 0,
            avatar: "https://images.unsplash.com/photo-1748914451679-4c996574a75f?q=80&w=2971&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        { 
            id: "5", 
            name: "Riley", 
            color: "#EF4444", 
            active: true, 
            score: 0,
            avatar: "https://images.unsplash.com/photo-1748973752341-e265470ae47d?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
    ]);

    const canvasRef = useRef<HTMLDivElement>(null);
    const chatRef = useRef<HTMLDivElement>(null);

    const createMockCursorActivity = useCallback(() => {
        if (!gameStarted || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        
        // Get active players (excluding "You") who don't already have a cursor
        const activePlayers = players.filter(p => p.active && p.id !== "1");
        const playersWithCursors = new Set(mockCursors.map(c => c.playerId));
        const availablePlayers = activePlayers.filter(p => !playersWithCursors.has(p.id));
        
        if (availablePlayers.length === 0) return;

        // Pick a random available player
        const activePlayer = availablePlayers[Math.floor(Math.random() * availablePlayers.length)];
        
        // Double-check this player doesn't already have a cursor (safety check)
        if (playersWithCursors.has(activePlayer.id)) return;
        const cursorId = generateId();
        
        // 70% chance to interact with a piece, 30% chance to just move around
        const shouldMovePiece = Math.random() < 0.7;
        const availablePieces = pieces.filter(p => !p.isPlaced);
        const targetPiece = shouldMovePiece && availablePieces.length > 0 
            ? availablePieces[Math.floor(Math.random() * availablePieces.length)]
            : null;

        let startX, startY, targetX, targetY;

        // Calculate safe boundaries considering piece size
        const isMobile = window.innerWidth < 600;
        const pieceSize = isMobile ? 70 : 90; // Approximate piece size
        const margin = 20;
        const safeWidth = rect.width - pieceSize - margin * 2;
        const safeHeight = rect.height - pieceSize - margin * 2;

        if (targetPiece) {
            // Start near the piece
            startX = targetPiece.x + Math.random() * 40 - 20;
            startY = targetPiece.y + Math.random() * 40 - 20;
            // Move to a safe random location that keeps piece within container
            targetX = Math.random() * safeWidth + margin;
            targetY = Math.random() * safeHeight + margin;
        } else {
            // Just move cursor around randomly within safe bounds
            startX = Math.random() * safeWidth + margin;
            startY = Math.random() * safeHeight + margin;
            targetX = Math.random() * safeWidth + margin;
            targetY = Math.random() * safeHeight + margin;
        }

        const newCursor: MockCursor = {
            id: cursorId,
            playerId: activePlayer.id,
            playerName: activePlayer.name,
            playerColor: activePlayer.color,
            x: startX,
            y: startY,
            targetX,
            targetY,
            visible: true,
            lastSeen: Date.now(),
        };

        setMockCursors(prev => [...prev.filter(c => c.visible), newCursor]);

        // Animate cursor movement and piece if applicable
        const animationDuration = 2000 + Math.random() * 3000; // 2-5 seconds
        const startTime = Date.now();
        
        const animateCursor = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / animationDuration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic

            const currentX = startX + (targetX - startX) * easeProgress;
            const currentY = startY + (targetY - startY) * easeProgress;

            setMockCursors(prev => 
                prev.map(cursor => 
                    cursor.id === cursorId 
                        ? { ...cursor, x: currentX, y: currentY }
                        : cursor
                )
            );

            // Move the piece along with cursor if we're dragging one
            if (targetPiece && progress > 0.1) { // Start moving piece after cursor starts moving
                const pieceStartX = targetPiece.x;
                const pieceStartY = targetPiece.y;
                const pieceTargetX = Math.max(margin, Math.min(targetX - 30, rect.width - pieceSize - margin)); // Constrain within bounds
                const pieceTargetY = Math.max(margin, Math.min(targetY - 30, rect.height - pieceSize - margin)); // Constrain within bounds
                
                const pieceCurrentX = pieceStartX + (pieceTargetX - pieceStartX) * easeProgress;
                const pieceCurrentY = pieceStartY + (pieceTargetY - pieceStartY) * easeProgress;

                setPieces(prev => 
                    prev.map(piece => 
                        piece.id === targetPiece.id && !piece.isPlaced
                            ? { ...piece, x: pieceCurrentX, y: pieceCurrentY }
                            : piece
                    )
                );
            }

            if (progress < 1) {
                requestAnimationFrame(animateCursor);
            } else {
                // Remove cursor immediately when animation completes to prevent duplicates
                setMockCursors(prev => prev.filter(c => c.id !== cursorId));
            }
        };

        requestAnimationFrame(animateCursor);
    }, [gameStarted, players, pieces, mockCursors]);

    // Mock cursor activity effect
    useEffect(() => {
        if (!gameStarted) return;

        const showCursor = () => {
            // Only try to create cursor if there are available players
            const activePlayers = players.filter(p => p.active && p.id !== "1");
            const playersWithCursors = new Set(mockCursors.map(c => c.playerId));
            const availablePlayers = activePlayers.filter(p => !playersWithCursors.has(p.id));
            
            if (availablePlayers.length > 0) {
                createMockCursorActivity();
            }
            
            // Schedule next attempt (shorter interval if no players available to try again sooner)
            const nextInterval = availablePlayers.length > 0 
                ? 5000 + Math.random() * 5000  // 5-10 seconds if we created a cursor
                : 3000 + Math.random() * 2000; // 3-5 seconds if no available players
            
            setTimeout(showCursor, nextInterval);
        };

        const initialDelay = 2000 + Math.random() * 3000; // Start after 2-5 seconds
        const timeoutId = setTimeout(showCursor, initialDelay);

        return () => clearTimeout(timeoutId);
    }, [gameStarted, createMockCursorActivity, players, mockCursors]);

    const initializePuzzle = useCallback(() => {
        const newPieces: PuzzlePiece[] = [];

        const isMobile = window.innerWidth < 600;
        
        // Mobile-first container calculations - use nearly full screen
        const containerWidth = isMobile ? window.innerWidth * 0.95 : 800;
        const containerHeight = isMobile ? window.innerHeight * 0.8 : 600;
        
        // Different grid layouts: Mobile = 3x4 (portrait), Desktop = 4x3 (landscape)
        const cols = isMobile ? 3 : 4;
        const rows = isMobile ? 4 : 3;
        const totalPieces = cols * rows;
        
        // Mobile: maximize puzzle size to fill container width completely
        let pieceSize;
        if (isMobile) {
            // On mobile, make puzzle span nearly full width with small margins
            const availableWidth = containerWidth - 20; // 10px margin each side
            pieceSize = Math.floor((availableWidth / cols) * 0.7225); // Reduced by 30% total (15% + 15%)
        } else {
            // Desktop calculations - 25% bigger than mobile
            const availableWidth = containerWidth - 40;
            const availableHeight = containerHeight - 40;
            const maxPieceWidthByContainer = availableWidth / cols;
            const maxPieceHeightByContainer = availableHeight / rows;
            pieceSize = Math.min(100, Math.min(maxPieceWidthByContainer, maxPieceHeightByContainer)) * 0.903125; // Mobile size * 1.25 (25% bigger)
        }
        
        const spacing = pieceSize;
        const puzzleWidth = cols * spacing;
        const puzzleHeight = rows * spacing;
        
        // Perfect mathematical centering
        const baseX = (containerWidth - puzzleWidth) / 2;
        const baseY = (containerHeight - puzzleHeight) / 2;

        for (let i = 0; i < totalPieces; i++) {
            const row = Math.floor(i / cols);
            const col = i % cols;
            const correctX = col * spacing + baseX -20;
            const correctY = row * spacing + baseY;

            // Position pieces above or below the target area
            let randomX, randomY;
            const margin = 10;
            
            if (isMobile) {
                // On mobile: place pieces either above or below the target area
                randomX = Math.random() * (containerWidth - pieceSize - margin * 2) + margin;
                
                // Randomly choose above or below the target area
                if (Math.random() < 0.5) {
                    // Above the target area
                    randomY = Math.random() * (baseY - pieceSize - margin) + margin;
                } else {
                    // Below the target area
                    randomY = Math.random() * (containerHeight - (baseY + puzzleHeight) - pieceSize - margin) + (baseY + puzzleHeight + margin);
                }
            } else {
                // Desktop: avoid overlap with puzzle area
                do {
                    randomX = Math.random() * (containerWidth - pieceSize - margin * 2) + margin;
                    randomY = Math.random() * (containerHeight - pieceSize - margin * 2) + margin;
                } while (
                    randomX > baseX - margin && randomX < baseX + puzzleWidth + margin &&
                    randomY > baseY - margin && randomY < baseY + puzzleHeight + margin
                );
            }

            newPieces.push({
                id: `piece-${i}`,
                x: randomX,
                y: randomY,
                correctX,
                correctY,
                isPlaced: false,
                row,
                col,
                imageOffsetX: col * spacing,
                imageOffsetY: row * spacing,
            });
        }

        // Select a random image for this puzzle
        const imageCount = isMobile ? 6 : 6; // Both mobile and desktop now have 6 images
        const randomImageIndex = Math.floor(Math.random() * imageCount);
        setCurrentImageIndex(randomImageIndex);

        setPieces(newPieces);
        setCompletedPieces(0);
        setGameCompleted(false);
        addSystemMessage("Puzzle pieces scattered! Work together to reconstruct the image.");
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
            const totalPieces = pieces.length;

            if (newCount === totalPieces) {
                setGameCompleted(true);
                addSystemMessage("🎉 Puzzle completed! Great teamwork! The beautiful image has been fully reconstructed!");
            } else {
                addSystemMessage(`Piece placed! Team progress: ${newCount}/${totalPieces} pieces completed.`);
            }

            setCompletedPieces(newCount);

            setPlayers((prev) => prev.map((p) => (p.id === "1" ? { ...p, score: p.score + 10 } : p)));
        }

        setDraggedPiece(null);
        setIsProcessingDrop(false);
    }, [draggedPiece, pieces, completedPieces]); // eslint-disable-line react-hooks/exhaustive-deps

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
                        if (data.completedPieces === pieces.length) {
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
            console.log("WebSocket error:", error);
        };

        setSocket(ws);

        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, [initializePuzzle]); // eslint-disable-line react-hooks/exhaustive-deps

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

    // Handle window resize for responsiveness
    useEffect(() => {
        let resizeTimeout: NodeJS.Timeout;
        
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (gameStarted && pieces.length > 0) {
                    // Recalculate puzzle layout on resize
                    const isMobile = window.innerWidth < 600;
                    
                    // Mobile-first container calculations - use nearly full screen
                    const containerWidth = isMobile ? window.innerWidth * 0.95 : 800;
                    const containerHeight = isMobile ? window.innerHeight * 0.8 : 600;
                    
                    // Dynamic grid dimensions
                    const cols = isMobile ? 3 : 4;
                    const rows = isMobile ? 4 : 3;
                    
                    // Mobile: maximize puzzle size to fill container width completely
                    let pieceSize;
                    if (isMobile) {
                        // On mobile, make puzzle span nearly full width with small margins
                        const availableWidth = containerWidth - 20; // 10px margin each side
                        pieceSize = Math.floor((availableWidth / cols) * 0.7225); // Reduced by 30% total (15% + 15%)
                    } else {
                        // Desktop calculations - 25% bigger than mobile
                        const availableWidth = containerWidth - 40;
                        const availableHeight = containerHeight - 40;
                        const maxPieceWidthByContainer = availableWidth / cols;
                        const maxPieceHeightByContainer = availableHeight / rows;
                        pieceSize = Math.min(100, Math.min(maxPieceWidthByContainer, maxPieceHeightByContainer)) * 0.903125; // Mobile size * 1.25 (25% bigger)
                    }
                    
                    const spacing = pieceSize;
                    const puzzleWidth = cols * spacing;
                    const puzzleHeight = rows * spacing;
                    
                    // Perfect mathematical centering
                    const baseX = (containerWidth - puzzleWidth) / 2;
                    const baseY = (containerHeight - puzzleHeight) / 2;

                    setPieces((prevPieces) => 
                        prevPieces.map((piece) => {
                            const row = Math.floor(parseInt(piece.id.split('-')[1]) / cols);
                            const col = parseInt(piece.id.split('-')[1]) % cols;
                            const newCorrectX = col * spacing + baseX - 20;
                            const newCorrectY = row * spacing + baseY;
                            
                            return {
                                ...piece,
                                correctX: newCorrectX,
                                correctY: newCorrectY,
                                x: piece.isPlaced ? newCorrectX : piece.x,
                                y: piece.isPlaced ? newCorrectY : piece.y,
                                imageOffsetX: col * spacing,
                                imageOffsetY: row * spacing,
                            };
                        })
                    );
                }
            }, 300);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(resizeTimeout);
        };
    }, [gameStarted, pieces.length]);

    const getPuzzlePieceClipPath = (piece: PuzzlePiece, isPlaced: boolean = false) => {
        // If piece is placed, use no clip-path for seamless image
        if (isPlaced) {
            return "none";
        }
        
        // For unplaced pieces, use jigsaw shapes to maintain puzzle essence
        const { row, col } = piece;
        const isMobile = window.innerWidth < 600;
        const rows = isMobile ? 4 : 3;
        const cols = isMobile ? 3 : 4;
        
        let clipPath = "polygon(";
        
        // Top edge
        if (row === 0) {
            clipPath += "0% 0%, 100% 0%";
        } else {
            const hasTopTab = (row + col) % 2 === 0;
            if (hasTopTab) {
                clipPath += "0% 0%, 35% 0%, 40% -6%, 60% -6%, 65% 0%, 100% 0%";
            } else {
                clipPath += "0% 0%, 35% 0%, 40% 6%, 60% 6%, 65% 0%, 100% 0%";
            }
        }
        
        // Right edge
        if (col === cols - 1) {
            clipPath += ", 100% 100%";
        } else {
            const hasRightTab = (row + col + 1) % 2 === 0;
            if (hasRightTab) {
                clipPath += ", 100% 35%, 106% 40%, 106% 60%, 100% 65%, 100% 100%";
            } else {
                clipPath += ", 100% 35%, 94% 40%, 94% 60%, 100% 65%, 100% 100%";
            }
        }
        
        // Bottom edge  
        if (row === rows - 1) {
            clipPath += ", 0% 100%";
        } else {
            const hasBottomTab = (row + col + 2) % 2 === 0;
            if (hasBottomTab) {
                clipPath += ", 65% 100%, 60% 106%, 40% 106%, 35% 100%, 0% 100%";
            } else {
                clipPath += ", 65% 100%, 60% 94%, 40% 94%, 35% 100%, 0% 100%";
            }
        }
        
        // Left edge
        if (col === 0) {
            clipPath += ", 0% 0%";
        } else {
            const hasLeftTab = (row + col + 3) % 2 === 0;
            if (hasLeftTab) {
                clipPath += ", 0% 65%, -6% 60%, -6% 40%, 0% 35%, 0% 0%";
            } else {
                clipPath += ", 0% 65%, 6% 60%, 6% 40%, 0% 35%, 0% 0%";
            }
        }
        
        clipPath += ")";
        return clipPath;
    };

    const renderPiece = (piece: PuzzlePiece) => {
        const isMobile = window.innerWidth < 600;
        
        // Consistent with puzzle initialization
        const containerWidth = isMobile ? window.innerWidth * 0.95 : 800;
        const containerHeight = isMobile ? window.innerHeight * 0.8 : 600;
        
        // Mobile: maximize puzzle size to fill container width completely
        let pieceSize;
        if (isMobile) {
            // On mobile, make puzzle span nearly full width with small margins
            const availableWidth = containerWidth - 20; // 10px margin each side
            pieceSize = Math.floor((availableWidth / 3) * 0.7225); // 3 columns on mobile, reduced by 30% total (15% + 15%)
        } else {
            // Desktop calculations - 25% bigger than mobile
            const availableWidth = containerWidth - 40;
            const availableHeight = containerHeight - 40;
            const maxPieceWidthByContainer = availableWidth / 4; // 4 columns on desktop
            const maxPieceHeightByContainer = availableHeight / 3; // 3 rows on desktop
            pieceSize = Math.min(100, Math.min(maxPieceWidthByContainer, maxPieceHeightByContainer)) * 0.903125; // Mobile size * 1.25 (25% bigger)
        }
            
        const isDragging = draggedPiece === piece.id;

        // Multiple high-quality images for variety
        const mobileImages = [
            "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80", // Beautiful waterfall
            "https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80", // Mountain peaks
            "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80", // Forest path
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80", // Sunset mountains
            "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80", // Ocean sunset
            "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80", // Desert landscape
        ];
        
        const desktopImages = [
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80", // Mountain landscape
            "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80", // Forest landscape
            "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80", // Ocean horizon
            "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80", // Desert landscape
            "https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80", // Alpine vista
            "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80", // Lake reflection
        ];
        
        // Use current image index for consistent selection
        const puzzleImage = isMobile ? mobileImages[currentImageIndex] : desktopImages[currentImageIndex];

        // Dynamic grid dimensions
        const cols = isMobile ? 3 : 4;
        const rows = isMobile ? 4 : 3;

        const style: React.CSSProperties = {
            position: "absolute",
            left: piece.x,
            top: piece.y,
            width: pieceSize,
            height: pieceSize,
            backgroundImage: `url(${puzzleImage})`,
            backgroundSize: `${cols * pieceSize}px ${rows * pieceSize}px`,
            backgroundPosition: `-${piece.col * pieceSize}px -${piece.row * pieceSize}px`,
            clipPath: getPuzzlePieceClipPath(piece, piece.isPlaced),
            cursor: piece.isPlaced ? "default" : "grab",
            transform: isDragging ? "scale(1.1) rotate(5deg)" : "scale(1)",
            transition: isDragging ? "none" : "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            filter: piece.isPlaced ? "none" : "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
            opacity: piece.isPlaced ? 1 : 0.95,
            zIndex: isDragging ? 1000 : piece.isPlaced ? 1 : 10,
            border: piece.isPlaced ? "none" : "1px solid rgba(255,255,255,0.2)",
            borderRadius: piece.isPlaced ? "0" : "2px",
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
        const isMobile = window.innerWidth < 600;
        
        // Consistent with puzzle initialization
        const containerWidth = isMobile ? window.innerWidth * 0.95 : 800;
        const containerHeight = isMobile ? window.innerHeight * 0.8 : 600;
        
        // Mobile: maximize puzzle size to fill container width completely
        let pieceSize;
        if (isMobile) {
            // On mobile, make puzzle span nearly full width with small margins
            const availableWidth = containerWidth - 20; // 10px margin each side
            pieceSize = Math.floor((availableWidth / 3) * 0.7225); // 3 columns on mobile, reduced by 30% total (15% + 15%)
        } else {
            // Desktop calculations - 25% bigger than mobile
            const availableWidth = containerWidth - 40;
            const availableHeight = containerHeight - 40;
            const maxPieceWidthByContainer = availableWidth / 4; // 4 columns on desktop
            const maxPieceHeightByContainer = availableHeight / 3; // 3 rows on desktop
            pieceSize = Math.min(100, Math.min(maxPieceWidthByContainer, maxPieceHeightByContainer)) * 0.903125; // Mobile size * 1.25 (25% bigger)
        }

        return pieces.map((piece) => (
            <div
                key={`target-${piece.id}`}
                style={{
                    position: "absolute",
                    left: piece.correctX,
                    top: piece.correctY,
                    width: pieceSize,
                    height: pieceSize,
                    clipPath: piece.isPlaced ? "none" : getPuzzlePieceClipPath(piece, false),
                    border: piece.isPlaced ? "none" : "1px dashed rgba(255,255,255,0.2)",
                    background: piece.isPlaced 
                        ? "transparent"
                        : "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0))",
                    pointerEvents: "none",
                    opacity: piece.isPlaced ? 0 : 0.5,
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
                            <span className="text-sm font-medium">{completedPieces}/{pieces.length}</span>
                            <div className="w-20 md:w-32 bg-white/20 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${pieces.length > 0 ? (completedPieces / pieces.length) * 100 : 0}%` }}
                                />
                            </div>
                        </div>

                        <motion.div 
                            className="flex items-center gap-3 bg-gradient-to-r from-black/30 to-black/20 backdrop-blur-xl p-3 rounded-2xl border border-white/10 shadow-xl"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.6, type: "spring" }}
                        >
                            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-2 rounded-xl">
                                <FaUsers className="w-4 h-4 text-blue-300" />
                            </div>
                            <div className="flex items-center -space-x-3">
                                {players.map((player, index) => (
                                    <motion.div
                                        key={player.id}
                                        className="relative group cursor-pointer"
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ 
                                            delay: 0.8 + index * 0.1, 
                                            type: "spring",
                                            stiffness: 260,
                                            damping: 20
                                        }}
                                        whileHover={{ 
                                            scale: 1.2, 
                                            zIndex: 10,
                                            transition: { duration: 0.2 }
                                        }}
                                        title={`${player.name} - ${player.score} pts ${player.active ? '🟢 Online' : '🔴 Offline'}`}
                                    >
                                        <div className={`relative w-6 h-6 md:w-8 md:h-8 rounded-full overflow-hidden transition-all duration-300 ${
                                            player.active ? "opacity-100" : "opacity-60 grayscale"
                                        }`}>
                                            {/* Status ring */}
                                            <div 
                                                className={`absolute inset-0 rounded-full p-0.5 ${
                                                    player.active 
                                                        ? "bg-gradient-to-r from-emerald-400 to-cyan-400 shadow-lg shadow-emerald-400/30" 
                                                        : "bg-gradient-to-r from-gray-400 to-gray-500"
                                                }`}
                                            >
                                                <div className="w-full h-full bg-black/10 rounded-full p-0.5">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img 
                                                        src={player.avatar} 
                                                        alt={player.name} 
                                                        className="w-full h-full object-cover rounded-full"
                                                    />
                                                </div>
                                            </div>
                                            
                                            {/* Online status indicator */}
                                            {player.active && (
                                                <motion.div 
                                                    className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full border-2 border-black/20 shadow-lg"
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                />
                                            )}
                                        </div>
                                        

                                    </motion.div>
                                ))}
                            </div>
                            
                            {/* Active players count */}
                            <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-lg border border-emerald-400/20">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                <span className="text-xs font-medium text-emerald-300">
                                    {players.filter(p => p.active).length} active
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.header>

            <div className="flex flex-col lg:flex-row h-[calc(100vh-117px)] lg:h-[calc(100vh-73px)] relative">
                <div className="flex-1 relative overflow-hidden">
                    <div
                        ref={canvasRef}
                        className="absolute inset-0 animated-bg flex items-center justify-center p-8 pt-24 lg:pt-0"
                        style={{ touchAction: "none" }}
                    >
                        <div className="relative w-[95vw] md:w-[80vw] max-w-[800px] h-[85vh] md:h-[60vw] max-h-[600px] min-h-[500px]">
                            {/* Puzzle assembly area */}
                            <div className="absolute inset-3 md:inset-6 rounded-xl border-2 border-blue-400/30 bg-white/5 backdrop-blur-sm shadow-2xl"></div>
                            
                            {/* Corner guides */}
                            <div className="absolute top-3 left-3 text-blue-400/40 text-sm">🧩</div>
                            <div className="absolute top-3 right-3 text-blue-400/40 text-sm">🧩</div>
                            <div className="absolute bottom-3 left-3 text-blue-400/40 text-sm">🧩</div>
                            <div className="absolute bottom-3 right-3 text-blue-400/40 text-sm">🧩</div>
                            
                            {renderTargetSpots()}
                            {pieces.map(renderPiece)}
                            
                            {/* Mock Cursors */}
                            <AnimatePresence>
                                {mockCursors.map((cursor) => (
                                    <motion.div
                                        key={cursor.id}
                                        className="absolute pointer-events-none z-[9998]"
                                        style={{
                                            left: cursor.x,
                                            top: cursor.y,
                                        }}
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {/* Cursor */}
                                        <div className="relative">
                                                                                         <motion.div
                                                className="w-5 h-5 transform origin-top-left"
                                                animate={{ 
                                                    scale: [1, 1.05, 1]
                                                }}
                                                transition={{ 
                                                    duration: 1.5,
                                                    repeat: Infinity,
                                                    repeatType: "loop"
                                                }}
                                            >
                                                <svg viewBox="0 0 20 20" fill="none" className="w-full h-full drop-shadow-xl">
                                                    {/* Cursor shadow */}
                                                    <path
                                                        d="M2.5 2.5L2.5 16.5L6.5 12.5L9.5 17.5L12.5 15.5L9.5 10.5L15.5 10.5L2.5 2.5Z"
                                                        fill="rgba(0,0,0,0.3)"
                                                        transform="translate(0.5, 0.5)"
                                                    />
                                                    {/* Main cursor body */}
                                                    <path
                                                        d="M2 2L2 16L6 12L9 17L12 15L9 10L15 10L2 2Z"
                                                        fill="white"
                                                        stroke="rgba(0,0,0,0.8)"
                                                        strokeWidth="0.5"
                                                    />
                                                    {/* Colored accent */}
                                                    <path
                                                        d="M2 2L2 16L6 12L9 17L12 15L9 10L15 10L2 2Z"
                                                        fill={cursor.playerColor}
                                                        fillOpacity="0.7"
                                                    />
                                                    {/* Highlight */}
                                                    <path
                                                        d="M2 2L2 12L4 10L12 10L2 2Z"
                                                        fill="rgba(255,255,255,0.4)"
                                                    />
                                                </svg>
                                            </motion.div>
                                            
                                            {/* Player name label */}
                                            <motion.div 
                                                className="absolute top-5 left-5 bg-gradient-to-r from-gray-900/90 to-black/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg border border-white/20 whitespace-nowrap shadow-xl"
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                <div className="flex items-center gap-1">
                                                    <div 
                                                        className="w-2 h-2 rounded-full animate-pulse"
                                                        style={{ backgroundColor: cursor.playerColor }}
                                                    />
                                                    <span className="font-medium">{cursor.playerName}</span>
                                                </div>
                                                <div className="absolute -top-1 left-2 w-0 h-0 border-l-2 border-r-2 border-b-2 border-transparent border-b-gray-900/90"></div>
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            
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
                                        Image Progress: {completedPieces}/{pieces.length} pieces
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="lg:hidden absolute top-4 left-4 right-4">
                        <motion.div 
                            className="bg-gradient-to-r from-black/30 to-black/20 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-xl"
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4, type: "spring" }}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="bg-gradient-to-br from-yellow-400/20 to-orange-500/20 p-2 rounded-xl">
                                        <HiLightningBolt className="w-4 h-4 text-yellow-400" />
                                    </div>
                                    <span className="text-sm font-semibold text-white">Progress</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-3 py-1.5 rounded-xl border border-blue-400/20 text-blue-300">
                                        {completedPieces}/{pieces.length}
                                    </span>
                                    <div className="flex -space-x-2">
                                        {players.filter(p => p.active).slice(0, 3).map((player, index) => (
                                            <div
                                                key={player.id}
                                                className="w-6 h-6 rounded-full overflow-hidden border-2 border-white/20"
                                                style={{ zIndex: 10 - index }}
                                            >
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img 
                                                    src={player.avatar} 
                                                    alt={player.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="relative w-full bg-white/10 rounded-full h-3 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-full"></div>
                                <motion.div
                                    className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 h-full rounded-full shadow-lg relative overflow-hidden"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${pieces.length > 0 ? (completedPieces / pieces.length) * 100 : 0}%` }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse"></div>
                                </motion.div>
                            </div>
                        </motion.div>
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
                                const isMobile = window.innerWidth < 600;
                                
                                // Mobile-first container calculations - use nearly full screen
                                const containerWidth = isMobile ? window.innerWidth * 0.95 : 800;
                                const containerHeight = isMobile ? window.innerHeight * 0.8 : 600;
                                
                                // Dynamic grid dimensions
                                const cols = isMobile ? 3 : 4;
                                const rows = isMobile ? 4 : 3;
                                
                                // Mobile: maximize puzzle size to fill container width completely
                                let pieceSize;
                                if (isMobile) {
                                    // On mobile, make puzzle span nearly full width with small margins
                                    const availableWidth = containerWidth - 20; // 10px margin each side
                                    pieceSize = Math.floor((availableWidth / cols) * 0.7225); // Reduced by 30% total (15% + 15%)
                                } else {
                                    // Desktop calculations - 25% bigger than mobile
                                    const availableWidth = containerWidth - 40;
                                    const availableHeight = containerHeight - 40;
                                    const maxPieceWidthByContainer = availableWidth / cols;
                                    const maxPieceHeightByContainer = availableHeight / rows;
                                    pieceSize = Math.min(100, Math.min(maxPieceWidthByContainer, maxPieceHeightByContainer)) * 0.903125; // Mobile size * 1.25 (25% bigger)
                                }
                                
                                const spacing = pieceSize;
                                const puzzleWidth = cols * spacing;
                                const puzzleHeight = rows * spacing;
                                
                                // Perfect mathematical centering
                                const baseX = (containerWidth - puzzleWidth) / 2;
                                const baseY = (containerHeight - puzzleHeight) / 2;

                                setPieces((prev) =>
                                    prev.map((piece) => {
                                        // Position pieces above or below the target area
                                        let randomX, randomY;
                                        const margin = 10;
                                        
                                        if (isMobile) {
                                            // On mobile: place pieces either above or below the target area
                                            randomX = Math.random() * (containerWidth - pieceSize - margin * 2) + margin;
                                            
                                            // Randomly choose above or below the target area
                                            if (Math.random() < 0.5) {
                                                // Above the target area
                                                randomY = Math.random() * (baseY - pieceSize - margin) + margin;
                                            } else {
                                                // Below the target area
                                                randomY = Math.random() * (containerHeight - (baseY + puzzleHeight) - pieceSize - margin) + (baseY + puzzleHeight + margin);
                                            }
                                        } else {
                                            // Desktop: avoid overlap with puzzle area
                                            do {
                                                randomX = Math.random() * (containerWidth - pieceSize - margin * 2) + margin;
                                                randomY = Math.random() * (containerHeight - pieceSize - margin * 2) + margin;
                                            } while (
                                                randomX > baseX - margin && randomX < baseX + puzzleWidth + margin &&
                                                randomY > baseY - margin && randomY < baseY + puzzleHeight + margin
                                            );
                                        }

                                        return {
                                            ...piece,
                                            x: randomX,
                                            y: randomY,
                                            isPlaced: false,
                                        };
                                    })
                                );
                                
                                // Select a new random image for variety when shuffling
                                const imageCount = 6; // Both mobile and desktop have 6 images
                                const randomImageIndex = Math.floor(Math.random() * imageCount);
                                setCurrentImageIndex(randomImageIndex);
                                
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
                                    <p className="text-white/80 mb-6">You&apos;ve successfully completed the jigsaw puzzle! The beautiful image is now complete!</p>
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
