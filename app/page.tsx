"use client";

import { useState } from "react";

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

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>, card: Card) => {
        setDragging(card);
        event.dataTransfer.setData("text/plain", card.id.toString()); // For drag-and-drop compatibility
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

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#1E1E2F] text-[#E0E0E0]">
            {/* Title */}
            <h1 className="text-5xl font-bold text-[#FFD93D] mb-10 tracking-tight">Vocabulary Game</h1>

            {/* Error Message */}
            {error && (
                <div className="absolute top-6 right-6 bg-[#F87171] text-white px-4 py-2 rounded-lg shadow-lg animate-pulse">{error}</div>
            )}

            {/* Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-10">
                {cards.map((card, index) => {
                    const isWord = card.type === "word";
                    const baseColors = isWord
                        ? ["bg-[#FF6347]", "bg-[#32CD32]", "bg-[#FFD700]", "bg-[#20B2AA]", "bg-[#8A2BE2]"]
                        : ["bg-[#FF4500]", "bg-[#1E90FF]", "bg-[#FF1493]", "bg-[#3CB371]", "bg-[#8A2BE2]"];

                    const colorIndex = index % baseColors.length;

                    return (
                        <div
                            key={card.id}
                            draggable={isWord && !card.matched}
                            onDragStart={(event) => handleDragStart(event, card)}
                            onDragOver={handleDragOver}
                            onDrop={(event) => handleDrop(event, card)}
                            className={`flex items-center justify-center border-2 rounded-xl p-4 shadow-lg transition-all duration-300 select-none
                ${
                    card.matched
                        ? "bg-[#10B981] text-white border-[#10B981]"
                        : `${baseColors[colorIndex]} text-white border-transparent hover:brightness-110`
                }`}
                        >
                            <span className="text-lg font-semibold">{isWord ? card.word : card.translation}</span>
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
            <p className="text-xl font-medium text-[#FFD93D]">
                {progress} out of {vocabulary.length} matches
            </p>
        </div>
    );
};

export default App;
