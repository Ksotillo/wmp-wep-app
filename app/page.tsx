'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Lora, Open_Sans, Press_Start_2P } from 'next/font/google';
import { Eraser, Trash2, Sun, Moon, Palette } from 'lucide-react';
import { motion } from 'framer-motion';

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
});
const DEFAULT_GRID_SIZE = 16;
const DEFAULT_COLOR = '#FFFFFF';
const DARK_MODE_DEFAULT_COLOR = '#171717';
const DEFAULT_DRAW_COLOR = '#34d399';
const pressStart2P = Press_Start_2P({
    subsets: ["latin"],
    weight: "400",
});
const titleVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const topControlsVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } },
};
const GRID_SIZES = [8, 16, 32];
const PALETTE = [
  '#FFFFFF',
  '#000000',
  '#FF0000',
  '#00FF00',
  '#0000FF',
  '#FFFF00',
  '#FF00FF',
  '#00FFFF',
  '#FFA500',
  '#800080',
  '#34d399',
  '#fb7185',
];

type Grid = string[][];
const initializeGrid = (size: number, color: string): Grid => {
  return Array.from({ length: size }, () =>
    Array(size).fill(color)
  );
};
const RainbowTextStyle = `
  @keyframes rainbowCycle {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .animate-rainbow-cycle {
    background-size: 400% auto; /* Make gradient larger than text */
    animation: rainbowCycle 10s linear infinite;
  }
`;

const gridVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.4 } },
};

const floatingBarVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.6 } },
};

export default function PixelArtEditorPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [gridSize, defineGridSize] = useState<number>(DEFAULT_GRID_SIZE);
  const currentBackgroundColor = darkMode ? DARK_MODE_DEFAULT_COLOR : DEFAULT_COLOR;
  const [gridColors, setGridColors] = useState<Grid>(
    initializeGrid(DEFAULT_GRID_SIZE, currentBackgroundColor) 
  );
  useEffect(() => {
    const oldBg = !darkMode ? DARK_MODE_DEFAULT_COLOR : DEFAULT_COLOR;
    const newBg = darkMode ? DARK_MODE_DEFAULT_COLOR : DEFAULT_COLOR;

   
    setGridColors(prevGrid => 
      prevGrid.map(row => 
        row.map(cell => (cell === oldBg ? newBg : cell))
      )
    );

   
    if (selectedColor === oldBg) {
      setCurrentColor(newBg);
    }
   
  }, [darkMode]);
  const [selectedColor, setCurrentColor] = useState<string>(DEFAULT_DRAW_COLOR);
  const [isDragging, setIsDragging] = useState<boolean>(false);
 
  const handleMouseDown = (rowIndex: number, colIndex: number) => {
      setIsDragging(true);
      paintCell(rowIndex, colIndex);
  };
  const paintCell = useCallback((rowIndex: number, colIndex: number) => {
    if (gridColors[rowIndex]?.[colIndex] === selectedColor) return;

    const newGridColors = gridColors.map((row, rIdx) => {
      if (rIdx === rowIndex) {
        return row.map((cell, cIdx) => {
          if (cIdx === colIndex) {
            return selectedColor;
          }
          return cell;
        });
      }
      return row;
    });
    setGridColors(newGridColors);
  }, [gridColors, selectedColor]);
 
  const handleMouseEnter = (rowIndex: number, colIndex: number) => {
    if (isDragging) {
      paintCell(rowIndex, colIndex);
    }
  };
  const handleMouseUp = () => {
   
    if (isDragging) {
      setIsDragging(false);
    }
  };
  const handleGridMouseLeave = () => {
   
    if (isDragging) {
      setIsDragging(false);
    }
  };
  const chooseEraser = useCallback(() => {
    setCurrentColor(currentBackgroundColor);
  }, [currentBackgroundColor]);
  const changeGridDimension = useCallback((newSize: number) => {
   
    if (newSize === gridSize) return;
    defineGridSize(newSize);
    setGridColors(initializeGrid(newSize, currentBackgroundColor));
  }, [currentBackgroundColor, gridSize]);

  const clearDrawingArea = useCallback(() => {
   
    setGridColors(initializeGrid(gridSize, currentBackgroundColor));
  }, [gridSize, currentBackgroundColor]);
  const switchColorMode = () => {
    setDarkMode(!darkMode);
   
  };

  return (
    <div className={`min-h-screen flex flex-col items-center p-4 pt-6 relative ${openSans.className} ${darkMode ? 'bg-[#0a0a0a] text-gray-200' : 'bg-gray-100 text-gray-800'} transition-colors duration-300 overflow-hidden`}>
      <motion.div 
        className="w-full mb-20"
        variants={titleVariants}
        initial="hidden"
        animate="visible"
      >
        <style>{RainbowTextStyle}</style>
        <h1 className={`text-3xl font-bold text-center ${pressStart2P.className} 
                     bg-gradient-to-r from-red-500 via-orange-500 via-yellow-400 via-green-500 via-blue-500 to-purple-600 
                     bg-clip-text text-transparent 
                     select-none 
                     animate-rainbow-cycle`
                    }>
          Pixel Art Creator
        </h1>
      </motion.div>
      
      <motion.div 
        className="w-full flex justify-between items-center mb-4 px-4"
        style={{ maxWidth: 'min(80vw, 80vh, 500px)' }}
        variants={topControlsVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center space-x-2">
          <label htmlFor="grid-size-select" className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Grid:</label>
          <select 
            id="grid-size-select"
            value={gridSize}
            onChange={(e) => changeGridDimension(Number(e.target.value))}
            className={`rounded text-xs font-medium cursor-pointer transition-colors p-1 border ${darkMode ? 'bg-[#171717] border-gray-600 text-gray-200 focus:ring-blue-500 focus:border-blue-500' : 'bg-white border-gray-300 text-gray-700 focus:ring-blue-500 focus:border-blue-500'}`}
          >
            {GRID_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}x{size}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex justify-end">
          <button 
            onClick={switchColorMode} 
            className={`p-2 rounded-full ${darkMode ? 'text-yellow-400 hover:bg-gray-700' : 'text-indigo-600 hover:bg-gray-200'} transition-colors cursor-pointer`}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </motion.div>

      <motion.div 
        className={`grid border mb-24 ${darkMode ? 'border-gray-600 bg-[#171717]' : 'border-gray-400 bg-white'} shadow-lg`}
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          width: 'min(80vw, 80vh, 500px)',
          aspectRatio: '1 / 1',
          cursor: 'crosshair'
        }}
        onMouseUp={handleMouseUp} 
        onMouseLeave={handleGridMouseLeave} 
        variants={gridVariants}
        initial="hidden"
        animate="visible"
      >
        {gridColors.map((row, rowIndex) =>
          row.map((color, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`border ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}
              style={{
                backgroundColor: color,
               
                minWidth: '1px', 
                minHeight: '1px',
              }}
              onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
              onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
             
              draggable="false" 
            />
          ))
        )}
      </motion.div>

      <motion.div 
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 p-3 rounded-lg shadow-lg flex items-center gap-3 ${darkMode ? 'bg-[#171717]/90 border border-gray-700 backdrop-blur-sm' : 'bg-white/90 border border-gray-300 backdrop-blur-sm'} transition-colors duration-300 z-10`}
        variants={floatingBarVariants}
        initial="hidden"
        animate="visible"
      >
          {PALETTE.map((color) => (
            <button
              key={color}
              onClick={() => setCurrentColor(color)}
              className={`w-7 h-7 rounded-full border-2 cursor-pointer transition-transform duration-100 ease-in-out ${selectedColor === color && color !== currentBackgroundColor ? (darkMode ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-white scale-110' : 'ring-2 ring-offset-2 ring-offset-gray-200 ring-black scale-110') : (darkMode ? 'border-gray-600 hover:scale-105' : 'border-gray-400 hover:scale-105')}`}
              style={{ backgroundColor: color }}
            />
          ))}
          <button
            onClick={chooseEraser}
            className={`w-7 h-7 rounded-full border-2 flex items-center justify-center cursor-pointer transition-transform duration-100 ease-in-out ${selectedColor === currentBackgroundColor ? (darkMode ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-white scale-110 bg-gray-700' : 'ring-2 ring-offset-2 ring-offset-gray-200 ring-black scale-110 bg-gray-300') : (darkMode ? 'border-gray-600 hover:scale-105 bg-gray-700/50' : 'border-gray-400 hover:scale-105 bg-gray-300/50')}`}
          >
            <Eraser size={14} className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}/>
          </button>
          <div className={`relative w-7 h-7 rounded-full border-2 cursor-pointer transition-transform duration-100 ease-in-out overflow-hidden ${!PALETTE.includes(selectedColor) && selectedColor !== currentBackgroundColor ? (darkMode ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-white scale-110' : 'ring-2 ring-offset-2 ring-offset-gray-200 ring-black scale-110') : (darkMode ? 'border-gray-600 hover:scale-105' : 'border-gray-400 hover:scale-105')}`}>
            <input 
              type="color"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              value={!PALETTE.includes(selectedColor) && selectedColor !== currentBackgroundColor ? selectedColor : '#000000'}
              onChange={(e) => setCurrentColor(e.target.value)}
            />
            <div 
              className="w-full h-full flex items-center justify-center"
              style={{ 
                backgroundColor: (!PALETTE.includes(selectedColor) && selectedColor !== currentBackgroundColor) 
                  ? selectedColor 
                  : (darkMode ? '#404040' : '#e5e5e5')
              }}
            >
              { (PALETTE.includes(selectedColor) || selectedColor === currentBackgroundColor) && 
                <Palette size={14} className={darkMode ? "text-gray-400" : "text-gray-600"} />
              }
            </div>
          </div>
          <div className={`w-px h-6 ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
          <button 
            onClick={clearDrawingArea}
            className={`p-1.5 rounded-full flex items-center justify-center cursor-pointer transition-colors ${darkMode ? 'text-red-400 hover:bg-red-900/50' : 'text-red-500 hover:bg-red-100'}`}
          >
            <Trash2 size={16} />
          </button>
      </motion.div>
    </div>
  );
}
