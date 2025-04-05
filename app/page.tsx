"use client";

import { useState, useEffect } from "react";
import { PT_Sans } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// Font configuration
const ptSans = PT_Sans({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pt-sans',
});

// Define the Card type for TypeScript
interface Card {
    id: number;
    word: string;
    translation: string;
    matched: boolean;
    type: "word" | "translation"; // To distinguish between word and translation cards
}

// Vocabulary data
const vocabulary: Omit<Card, "id" | "matched" | "type">[] = [
    { word: "Hello", translation: "Bonjour" },
    { word: "World", translation: "Monde" },
    { word: "React", translation: "Réagir" },
    { word: "Game", translation: "Jeu" },
    { word: "Fun", translation: "Amusant" },
];

const App = () => {
    // Initialize cards with type to distinguish between word and translation
    const [cards, setCards] = useState<Card[]>(
        vocabulary.flatMap((item, index) => [
            { ...item, id: index * 2, matched: false, type: "word" },
            { ...item, id: index * 2 + 1, matched: false, type: "translation" },
        ])
    );
    const [dragging, setDragging] = useState<Card | null>(null);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string>("");
    const [showInstructions, setShowInstructions] = useState(true);
    const [isHoveringTitle, setIsHoveringTitle] = useState(false);
    const [showCelebration, setShowCelebration] = useState(false);

    // Effect to show instructions when the page loads
    useEffect(() => {
        setShowInstructions(true);
    }, []);

    // Add animation styles on mount - safe for Next.js
    useEffect(() => {
        // Add custom animations to Tailwind
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse-glow {
                0%, 100% { opacity: 0.05; transform: scale(0.98); }
                50% { opacity: 0.1; transform: scale(1.01); }
            }
            @keyframes pulse-glow-hover {
                0%, 100% { opacity: 0.06; transform: scale(0.98); }
                50% { opacity: 0.12; transform: scale(1.01); }
            }
            @keyframes pulse-glow-fast {
                0%, 100% { opacity: 0.03; transform: scale(0.97); }
                50% { opacity: 0.07; transform: scale(1.03); }
            }
            @keyframes pulse-glow-fast-hover {
                0%, 100% { opacity: 0.04; transform: scale(0.97); }
                50% { opacity: 0.08; transform: scale(1.03); }
            }
            @keyframes pulse-slow {
                0%, 100% { text-shadow: 0 0 3px rgba(255, 217, 61, 0.18), 0 0 7px rgba(255, 217, 61, 0.09); }
                50% { text-shadow: 0 0 7px rgba(255, 217, 61, 0.27), 0 0 14px rgba(255, 217, 61, 0.18); }
            }
            @keyframes pulse-slow-hover {
                0%, 100% { text-shadow: 0 0 4px rgba(255, 217, 61, 0.2), 0 0 8px rgba(255, 217, 61, 0.1); }
                50% { text-shadow: 0 0 8px rgba(255, 217, 61, 0.3), 0 0 15px rgba(255, 217, 61, 0.2); }
            }
            .animate-pulse-glow {
                animation: pulse-glow 3s ease-in-out infinite;
            }
            .animate-pulse-glow-hover {
                animation: pulse-glow-hover 3s ease-in-out infinite;
            }
            .animate-pulse-glow-fast {
                animation: pulse-glow-fast 2s ease-in-out infinite;
            }
            .animate-pulse-glow-fast-hover {
                animation: pulse-glow-fast-hover 2s ease-in-out infinite;
            }
            .animate-pulse-slow {
                animation: pulse-slow 2s ease-in-out infinite;
            }
            .animate-pulse-slow-hover {
                animation: pulse-slow-hover 2s ease-in-out infinite;
            }
        `;
        document.head.appendChild(style);
        
        // Cleanup function
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    // Trigger celebration when all matches are found
    useEffect(() => {
        if (progress === vocabulary.length) {
            setShowCelebration(true);
            triggerCelebration();
        }
    }, [progress]);

    const triggerCelebration = () => {
        // First burst of confetti
        const count = 200;
        const defaults = {
            origin: { y: 0.7 },
            zIndex: 100,
        };

        function fire(particleRatio: number, opts: any) {
            confetti({
                ...defaults,
                ...opts,
                particleCount: Math.floor(count * particleRatio),
            });
        }

        // First burst
        fire(0.25, {
            spread: 26,
            startVelocity: 55,
            origin: { x: 0.2, y: 0.7 },
        });
        fire(0.25, {
            spread: 26,
            startVelocity: 55,
            origin: { x: 0.8, y: 0.7 },
        });

        // Second burst
        setTimeout(() => {
            fire(0.2, {
                spread: 60,
                origin: { x: 0.5, y: 0.7 },
            });
        }, 250);

        // Third burst
        setTimeout(() => {
            fire(0.35, {
                spread: 100,
                decay: 0.91,
                origin: { x: 0.3, y: 0.8 },
            });
            fire(0.35, {
                spread: 100,
                decay: 0.91,
                origin: { x: 0.7, y: 0.8 },
            });
        }, 500);

        // Reset celebration after animation completes
        setTimeout(() => {
            setShowCelebration(false);
        }, 5000);
    };

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>, card: Card) => {
        setDragging(card);
        event.dataTransfer.setData("text/plain", card.id.toString()); // For drag-and-drop compatibility
        if (showInstructions) {
            setTimeout(() => setShowInstructions(false), 1500);
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>, targetCard: Card) => {
        event.preventDefault();
        if (!dragging) return;

        // Check if the dragged card matches the target card
        const isMatch =
            (dragging.type === "word" && targetCard.type === "translation" && dragging.translation === targetCard.translation) ||
            (dragging.type === "translation" && targetCard.type === "word" && dragging.word === targetCard.word);

        if (isMatch) {
            setCards((prevCards) =>
                prevCards.map((item) => (item.id === dragging.id || item.id === targetCard.id ? { ...item, matched: true } : item))
            );
            setProgress((prev) => prev + 1);
            setError("");
        } else {
            setError("Incorrect match!");
            setTimeout(() => setError(""), 2000); // Clear error after 2 seconds
        }
        setDragging(null);
    };

    const toggleInstructions = () => {
        setShowInstructions(!showInstructions);
    };

    // Reset game
    const resetGame = () => {
        setCards(
            vocabulary.flatMap((item, index) => [
                { ...item, id: index * 2, matched: false, type: "word" },
                { ...item, id: index * 2 + 1, matched: false, type: "translation" },
            ])
        );
        setProgress(0);
        setShowCelebration(false);
    };

    return (
        <main className={`min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#120d30] via-[#221b40] to-[#0e0729] text-[#E0E0E0] ${ptSans.variable} font-sans relative overflow-hidden`}>
            {/* Help Button */}
            <button 
                onClick={toggleInstructions}
                className="absolute top-6 right-6 bg-[#FFD93D] text-[#221b40] w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-[#FFEA80] transition-colors duration-300"
                aria-label="Help"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-4h2v2h-2zm1.61-9.96c-2.06-.3-3.88.97-4.43 2.79-.18.58.26 1.17.87 1.17h.2c.41 0 .74-.29.88-.67.32-.89 1.27-1.5 2.3-1.28.95.2 1.65 1.13 1.57 2.1-.1 1.34-1.62 1.63-2.45 2.88 0 .01-.01.01-.01.02-.01.02-.02.03-.03.05-.09.15-.18.32-.25.5-.01.03-.03.05-.04.08-.01.02-.01.04-.02.07-.12.34-.2.75-.2 1.25h2c0-.42.11-.77.28-1.07.02-.03.03-.06.05-.09.08-.14.18-.27.28-.39.01-.01.02-.03.03-.04.1-.12.21-.23.33-.34.96-.91 2.26-1.65 1.99-3.56-.24-1.74-1.61-3.21-3.35-3.47z"/>
                </svg>
            </button>

            {/* Instructions Popup */}
            <AnimatePresence>
                {showInstructions && (
                    <motion.div 
                        className="fixed inset-0 flex items-center justify-center z-50 bg-black/70"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div 
                            className="bg-[#2A2550] p-6 rounded-xl shadow-xl max-w-md relative"
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            transition={{ type: "spring", duration: 0.4 }}
                        >
                            <button 
                                onClick={toggleInstructions}
                                className="absolute top-3 right-3 text-gray-400 hover:text-white cursor-pointer"
                                aria-label="Close instructions"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
                                </svg>
                            </button>
                            <h2 className="text-[#FFD93D] font-bold text-2xl mb-4">How to Play</h2>
                            <div className="space-y-3 text-white">
                                <p>1. Find the word cards (they can be dragged)</p>
                                <p>2. Drag a word card and drop it onto its matching translation</p>
                                <p>3. Correct matches will turn green!</p>
                                <p>4. Match all cards to win the game</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Victory Celebration */}
            <AnimatePresence>
                {showCelebration && (
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center z-40 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <motion.div
                            className="bg-[#2A2550]/80 p-8 rounded-xl shadow-2xl max-w-md text-center pointer-events-auto"
                            initial={{ scale: 0.8, y: 30 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.8, y: 30 }}
                            transition={{ type: "spring", bounce: 0.5 }}
                        >
                            <h2 className="text-4xl font-bold text-[#FFD93D] mb-4">
                                Congratulations!
                            </h2>
                            <p className="text-xl text-white mb-6">
                                You've matched all the vocabulary words!
                            </p>
                            <button
                                onClick={resetGame}
                                className="bg-[#FFD93D] text-[#221b40] px-6 py-3 rounded-full text-lg font-bold shadow-lg hover:bg-[#FFEA80] transition-colors duration-300 cursor-pointer"
                            >
                                Play Again
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Title with reduced glow effect and hover enhancement */}
            <div 
                className="mb-10 text-center relative"
                onMouseEnter={() => setIsHoveringTitle(true)}
                onMouseLeave={() => setIsHoveringTitle(false)}
            >
                <h1 className={`text-5xl font-bold text-[#FFD93D] tracking-tight relative z-10 select-none pointer-events-auto cursor-default ${isHoveringTitle ? 'animate-pulse-slow-hover' : 'animate-pulse-slow'}`}>
                    Vocabulary Game
                </h1>
                <div className={`absolute inset-x-0 top-1/4 bottom-1/4 blur-md bg-[#FFD93D] rounded-full ${isHoveringTitle ? 'animate-pulse-glow-hover opacity-10' : 'animate-pulse-glow opacity-9'}`}></div>
                <div className={`absolute inset-x-0 top-1/3 bottom-1/3 blur-sm bg-[#FFEA80] rounded-full ${isHoveringTitle ? 'animate-pulse-glow-fast-hover opacity-6' : 'animate-pulse-glow-fast opacity-5'}`}></div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="absolute top-6 left-6 bg-[#F87171] text-white px-4 py-2 rounded-lg shadow-lg animate-pulse font-bold">{error}</div>
            )}

            {/* Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-10">
                {cards.map((card, index) => {
                    const isWord = card.type === "word";
                    // Replace green with blue
                    const baseColors = isWord
                        ? ["bg-[#FF6347]", "bg-[#4169E1]", "bg-[#FFD700]", "bg-[#FF8C00]", "bg-[#9370DB]"]
                        : ["bg-[#FF4500]", "bg-[#1E90FF]", "bg-[#FF1493]", "bg-[#3CB371]", "bg-[#8A2BE2]"];

                    const borderColors = isWord
                        ? ["border-[#D63D2E]", "border-[#3D55B3]", "border-[#EABC00]", "border-[#DD7600]", "border-[#7452C8]"]
                        : ["border-[#DD3700]", "border-[#0E70CB]", "border-[#E60074]", "border-[#2D8F57]", "border-[#6E15BE]"];

                    const highlightColors = isWord
                        ? ["from-[#FF8066]", "from-[#6C8CFF]", "from-[#FFDF33]", "from-[#FFAA33]", "from-[#B18DF3]"]
                        : ["from-[#FF7033]", "from-[#45AEFF]", "from-[#FF5CAF]", "from-[#5ED195]", "from-[#A354F2]"];
                        
                    const colorIndex = index % baseColors.length;

                    return (
                        <div
                            key={card.id}
                            draggable={isWord && !card.matched}
                            onDragStart={(event) => handleDragStart(event, card)}
                            onDragOver={handleDragOver}
                            onDrop={(event) => handleDrop(event, card)}
                            className={`
                                flex items-center justify-center 
                                rounded-full 
                                h-20
                                px-6
                                transition-all duration-300 
                                select-none cursor-pointer
                                shadow-lg
                                overflow-hidden
                                ${card.matched
                                    ? "bg-[#4CBB17] border-[#3D9A10] text-white border-b-4 bg-gradient-to-b from-[#65DD30] to-[#4CBB17]"
                                    : `${baseColors[colorIndex]} text-white border-b-4 ${borderColors[colorIndex]} bg-gradient-to-b ${highlightColors[colorIndex]} to-${baseColors[colorIndex]} hover:scale-105`
                                }
                            `}
                        >
                            <span className="text-xl font-bold tracking-wide uppercase">{isWord ? card.word : card.translation}</span>
                        </div>
                    );
                })}
            </div>

            {/* Progress Bar */}
            <div className="w-3/4 max-w-md bg-[#3B3B50] rounded-full h-6 mb-4 shadow-inner">
                <div
                    className="bg-[#8B5CF6] h-6 rounded-full transition-all duration-500"
                    style={{ width: `${(progress / vocabulary.length) * 100}%` }}
                />
            </div>

            {/* Progress Text */}
            <p className="text-xl font-bold text-[#FFD93D]">
                {progress} out of {vocabulary.length} matches
            </p>
        </main>
    );
};

export default App;
