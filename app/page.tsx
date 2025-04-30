'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Sun, Moon, LockKeyhole, Zap, Info } from 'lucide-react';
import { Lora, Open_Sans } from 'next/font/google';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

const lora = Lora({
  subsets: ['latin'],
  weight: ['600', '700'], 
});
const PIVOT_X = 250; 
const PIVOT_Y = 50;  
type SimulationState = {
  angle: number; 
  angularVelocity: number; 
  timeElapsed: number; 
};
type EnergyDataPoint = {
  time: number;
  kinetic: number;
  potential: number;
  total: number;
};
const openSans = Open_Sans({
    subsets: ["latin"],
    weight: ["400", "500"],
});
export default function PendulumSimulationPage() {
  const [length, modifyLength] = useState(150); 
  const [initialAngleDegrees, setInitialAngle] = useState(45); 
  const [gravity, updateGravity] = useState(9.81); 
  const [damping, changeDamping] = useState(0.1); 
  const [mass, alterMass] = useState(1); 
  const [isSwinging, setIsSwinging] = useState(false); 
  const [simulationData, updateSimulationData] = useState<SimulationState>({
    angle: (45 * Math.PI) / 180, 
    angularVelocity: 0,
    timeElapsed: 0,
  });
  const [energyHistory, setEnergyHistory] = useState<EnergyDataPoint[]>([]);
  const [darkMode, setDarkMode] = useState(true); 
  const animationFrameRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);
  const simulationStateRef = useRef<SimulationState>(simulationData);
  const lengthRef = useRef(length);
  const gravityRef = useRef(gravity);
  const dampingRef = useRef(damping);
  const isSwingingRef = useRef(isSwinging);
  useEffect(() => {
      simulationStateRef.current = simulationData;
  }, [simulationData]);
  useEffect(() => {
      lengthRef.current = length;
  }, [length]);
  const massRef = useRef(mass);
  const [bobPosition, setBobPosition] = useState(() => {
      const initialAngleRad = (initialAngleDegrees * Math.PI) / 180;
      return {
          bobX: PIVOT_X + length * Math.sin(initialAngleRad),
          bobY: PIVOT_Y + length * Math.cos(initialAngleRad),
      };
  });
  
  useEffect(() => { gravityRef.current = gravity; }, [gravity]);
  
  useEffect(() => {
    if (!isSwingingRef.current) { 
      const newAngleRad = (initialAngleDegrees * Math.PI) / 180;
      const newSimData = {
          angle: newAngleRad,
          angularVelocity: 0,
          timeElapsed: 0,
      };
      updateSimulationData(newSimData);
      setEnergyHistory([]); 
      
      simulationStateRef.current = newSimData;
      
      const newBobX = PIVOT_X + lengthRef.current * Math.sin(newAngleRad);
      const newBobY = PIVOT_Y + lengthRef.current * Math.cos(newAngleRad);
      setBobPosition({ bobX: newBobX, bobY: newBobY });
    }
  }, [length, initialAngleDegrees, gravity, damping, mass]); 

  
  const simulationStep = useCallback((currentTime: number) => {
    if (!isSwingingRef.current) {
        previousTimeRef.current = null; 
        return;
    }
    if (previousTimeRef.current === null) {
        previousTimeRef.current = currentTime; 
        animationFrameRef.current = requestAnimationFrame(simulationStep);
        return;
    }

    const deltaTime = (currentTime - previousTimeRef.current) / 1000; 
    previousTimeRef.current = currentTime;
    const L = lengthRef.current;
    const g = gravityRef.current;
    const d = dampingRef.current;
    const m = massRef.current; 
    let { angle, angularVelocity, timeElapsed } = simulationStateRef.current;
    if (L <= 0) { 
        animationFrameRef.current = requestAnimationFrame(simulationStep);
        return;
    }

    
    const angularAcceleration = -(g / L) * Math.sin(angle) - d * angularVelocity;
    angularVelocity += angularAcceleration * deltaTime;
    angle += angularVelocity * deltaTime;
    timeElapsed += deltaTime;
    const height = L * (1 - Math.cos(angle)); 
    const potentialEnergy = m * g * height; 
    const linearVelocity = L * angularVelocity; 
    const kineticEnergy = 0.5 * m * linearVelocity * linearVelocity; 
    const totalEnergy = kineticEnergy + potentialEnergy;
    const newSimData: SimulationState = { angle, angularVelocity, timeElapsed };
    const newEnergyPoint: EnergyDataPoint = { time: timeElapsed, kinetic: kineticEnergy, potential: potentialEnergy, total: totalEnergy };
    updateSimulationData(newSimData); 
    const newBobX = PIVOT_X + L * Math.sin(angle);
    const newBobY = PIVOT_Y + L * Math.cos(angle);
    setBobPosition({ bobX: newBobX, bobY: newBobY }); 

  
    setEnergyHistory(prev => {
        const newHistory = [...prev, newEnergyPoint];
        
        return newHistory.length > 500 ? newHistory.slice(newHistory.length - 500) : newHistory;
    });


    
    animationFrameRef.current = requestAnimationFrame(simulationStep);
  }, []); 
  useEffect(() => {
    if (isSwinging) {
      previousTimeRef.current = null; 
      animationFrameRef.current = requestAnimationFrame(simulationStep);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
       previousTimeRef.current = null; 
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isSwinging, simulationStep]);
  const flipSimulationState = () => {
    setIsSwinging(prev => !prev);
  };

  const revertToInitialState = useCallback(() => {
    setIsSwinging(false); 
    const newAngleRad = (initialAngleDegrees * Math.PI) / 180;
    const newSimData = {
        angle: newAngleRad,
        angularVelocity: 0,
        timeElapsed: 0,
    };
    updateSimulationData(newSimData);
    setEnergyHistory([]); 
    simulationStateRef.current = newSimData; 
    
    const newBobX = PIVOT_X + lengthRef.current * Math.sin(newAngleRad);
    const newBobY = PIVOT_Y + lengthRef.current * Math.cos(newAngleRad);
    setBobPosition({ bobX: newBobX, bobY: newBobY });
  
  }, [initialAngleDegrees]); 

  const switchColorMode = () => {
    setDarkMode(!darkMode);
  };

  const processLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      modifyLength(Number(e.target.value));
  };
  const registerAngleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInitialAngle(Number(e.target.value));
  };
  const newGravityValue = (e: React.ChangeEvent<HTMLInputElement>) => {
      updateGravity(Number(e.target.value));
  };
  const dampingFactorUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
      changeDamping(Number(e.target.value));
  };
  const massValueInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      alterMass(Number(e.target.value));
  };

  useEffect(() => { dampingRef.current = damping; }, [damping]);
  useEffect(() => { isSwingingRef.current = isSwinging; }, [isSwinging]);
  useEffect(() => { massRef.current = mass; }, [mass]);

  return (
    <div className={`flex flex-col-reverse md:flex-row sm:h-screen w-full ${openSans.className} ${darkMode ? 'bg-[#0a0a0a] text-gray-200' : 'bg-gray-100 text-gray-800'} transition-colors duration-300`}>
      <div className={`w-full md:w-72 lg:w-80 p-4 border-t md:border-t-0 md:border-r shrink-0 ${darkMode ? 'bg-[#171717] border-[#27272a]' : 'bg-white border-gray-300'} flex flex-col space-y-4`}>
         <div className="flex justify-between items-center">
             <h1 className={`text-xl font-semibold ${lora.className}`}>Pendulum Settings</h1>
             <button onClick={switchColorMode} className={`p-1.5 rounded-full ${darkMode ? 'text-yellow-400 hover:bg-gray-700' : 'text-indigo-600 hover:bg-gray-200'} transition-colors cursor-pointer`}>
                 {darkMode ? <Sun size={20} /> : <Moon size={20} />}
             </button>
         </div>
         <div className="space-y-3">
            <div>
                 <div className="flex items-center justify-between mb-1">
                    <label htmlFor="length" className="block text-sm font-medium">Length ({length} px)</label>
                    <div className="group relative flex items-center">
                        <Info size={14} className="text-gray-400 cursor-help" />
                        <span className="absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-700 dark:bg-gray-600 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 w-max max-w-xs shadow-md scale-95 group-hover:scale-100 hidden group-hover:block">
                            Length of the pendulum rod (pixels in SVG).
                        </span>
                    </div>
                </div>
                <input
                   type="range" id="length" min="10" max="300" step="1"
                   value={length}
                   onChange={processLengthChange}
                   disabled={isSwinging}
                   className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-[#fb3250] ${darkMode ? 'bg-[#27272a]' : 'bg-gray-300'} ${isSwinging ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
           </div>
             <div>
                 <div className="flex items-center justify-between mb-1">
                    <label htmlFor="initialAngle" className="block text-sm font-medium">Start Angle ({initialAngleDegrees}°)</label>
                    <div className="group relative flex items-center">
                        <Info size={14} className="text-gray-400 cursor-help" />
                        <span className="absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-700 dark:bg-gray-600 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 w-max max-w-xs shadow-md scale-95 group-hover:scale-100 hidden group-hover:block">
                            Initial angle relative to vertical (degrees).
                        </span>
                    </div>
                 </div>
                 <input
                     type="range" id="initialAngle" min="-90" max="90" step="1"
                     value={initialAngleDegrees}
                     onChange={registerAngleChange}
                     disabled={isSwinging}
                    className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-[#fb3250] ${darkMode ? 'bg-[#27272a]' : 'bg-gray-300'} ${isSwinging ? 'opacity-50 cursor-not-allowed' : ''}`}
                 />
             </div>
            <div>
                 <div className="flex items-center justify-between mb-1">
                    <label htmlFor="gravity" className="block text-sm font-medium">Gravity ({gravity.toFixed(2)})</label>
                    <div className="group relative flex items-center">
                        <Info size={14} className="text-gray-400 cursor-help" />
                        <span className="absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-700 dark:bg-gray-600 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 w-max max-w-xs shadow-md scale-95 group-hover:scale-100 hidden group-hover:block">
                            Acceleration due to gravity (sim units, m/s²).
                        </span>
                    </div>
                </div>
                 <input
                     type="range" id="gravity" min="1" max="20" step="0.1"
                     value={gravity}
                     onChange={newGravityValue}
                     disabled={isSwinging}
                     className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-[#fb3250] ${darkMode ? 'bg-[#27272a]' : 'bg-gray-300'} ${isSwinging ? 'opacity-50 cursor-not-allowed' : ''}`}
                 />
            </div>
             <div>
                 <div className="flex items-center justify-between mb-1">
                    <label htmlFor="damping" className="block text-sm font-medium">Damping ({damping.toFixed(2)})</label>
                    <div className="group relative flex items-center">
                        <Info size={14} className="text-gray-400 cursor-help" />
                        <span className="absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-700 dark:bg-gray-600 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 w-max max-w-xs shadow-md scale-95 group-hover:scale-100 hidden group-hover:block">
                            Damping factor for energy loss (unitless).
                        </span>
                    </div>
                 </div>
                 <input
                     type="range" id="damping" min="0" max="1" step="0.01"
                     value={damping}
                     onChange={dampingFactorUpdate}
                    className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-[#fb3250] ${darkMode ? 'bg-[#27272a]' : 'bg-gray-300'} `}
                 />
             </div>
             <div>
                 <div className="flex items-center justify-between mb-1">
                     <label htmlFor="mass" className="block text-sm font-medium">Mass ({mass.toFixed(1)} kg)</label>
                    <div className="group relative flex items-center">
                        <Info size={14} className="text-gray-400 cursor-help" />
                        <span className="absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-700 dark:bg-gray-600 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 w-max max-w-xs shadow-md scale-95 group-hover:scale-100 hidden group-hover:block">
                            Mass of the pendulum bob (sim units, kg).
                        </span>
                    </div>
                </div>
                 <input
                    type="range" id="mass" min="0.1" max="5" step="0.1"
                    value={mass}
                    onChange={massValueInput}
                    disabled={isSwinging}
                    className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-[#fb3250] ${darkMode ? 'bg-[#27272a]' : 'bg-gray-300'} ${isSwinging ? 'opacity-50 cursor-not-allowed' : ''}`}
                 />
             </div>
         </div>
         <div className="flex items-center justify-center space-x-4 pt-2">
             <button
                 onClick={flipSimulationState}
                 className={`px-4 py-2 rounded-md flex items-center justify-center gap-2 text-white font-medium cursor-pointer transition-colors ${isSwinging ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} `}
             >
                 {isSwinging ? <Pause size={18} /> : <Play size={18} />}
                 <span>{isSwinging ? 'Pause' : 'Start'}</span>
             </button>
             <button
                 onClick={revertToInitialState}
                 disabled={isSwinging}
                 className={`p-2 rounded-full flex items-center justify-center cursor-pointer transition-colors ${darkMode ? 'bg-[#be5461] hover:bg-[#a74854]' : 'bg-gray-300 hover:bg-gray-400'} ${isSwinging ? 'opacity-50 cursor-not-allowed' : (darkMode ? 'text-gray-100' : 'text-gray-800')}`}
            >
                 <RotateCcw size={18} />
             </button>
         </div>
         <div className="text-xs pt-4 space-y-1.5 opacity-80">
             <div className="flex items-center gap-1.5">
                 <LockKeyhole size={14} className="shrink-0 text-blue-400" />
                 <span>Length, Angle, Gravity, Mass: Adjustable when paused.</span>
             </div>
             <div className="flex items-center gap-1.5">
                 <RotateCcw size={14} className="shrink-0 text-yellow-400" />
                 <span>Reset: Applies initial angle settings.</span>
             </div>
             <div className="flex items-center gap-1.5">
                 <Zap size={14} className="shrink-0 text-green-400" />
                 <span>Damping: Adjustable live during simulation.</span>
             </div>
         </div>
      </div>
      <div className="flex-1 flex flex-col p-4 overflow-hidden">
          
          <div className={`w-full flex-1 flex items-center justify-center border rounded-lg ${darkMode ? 'bg-[#171717] border-[#27272a]' : 'bg-white border-gray-300'} mb-4`}>
               <svg width="500" height="350" viewBox="0 0 500 350">
                  
                  <circle cx={PIVOT_X} cy={PIVOT_Y} r="5" fill={darkMode ? '#cbd5e1' : '#4b5563'} />
                  <line
                    x1={PIVOT_X}
                    y1={PIVOT_Y}
                    x2={bobPosition.bobX}
                    y2={bobPosition.bobY}
                    stroke={darkMode ? '#9ca3af' : '#6b7280'}
                    strokeWidth="2"
                  />
                  <circle
                    cx={bobPosition.bobX}
                    cy={bobPosition.bobY}
                    r="15"
                    fill="#fb3250"
                    filter={darkMode ? 'drop-shadow(0 0 6px rgba(251, 50, 80, 0.6))' : 'drop-shadow(0 0 5px rgba(251, 50, 80, 0.5))'}
                 />
               </svg>
          </div>
          <div className={`w-full min-h-[250px] md:min-h-[450px] border rounded-lg ${darkMode ? 'bg-[#171717] border-[#27272a]' : 'bg-white border-gray-300'} p-2 pt-4`}>
             <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={energyHistory} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                     <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#3f3f46' : '#d1d5db'} />
                     <XAxis
                         dataKey="time"
                         type="number"
                         domain={['dataMin', 'dataMax']}
                         tickFormatter={(time) => typeof time === 'number' ? time.toFixed(1) + 's' : ''}
                         stroke={darkMode ? '#9ca3af' : '#6b7280'}
                         tick={{ fontSize: 10 }}
                     />
                     <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} tick={{ fontSize: 10 }} label={{ value: 'Energy (J)', angle: -90, position: 'insideLeft', fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 11, dx: -5 }} />
                     <Tooltip
                        contentStyle={{
                            backgroundColor: darkMode ? 'rgba(23, 23, 23, 0.9)' : 'rgba(255, 255, 255, 0.9)', 
                            borderColor: darkMode ? '#3f3f46' : '#d1d5db',
                            color: darkMode ? '#e5e7eb' : '#1f2937',
                            borderRadius: '6px',
                            fontSize: '12px',
                            padding: '6px 10px',
                        }}
                        itemStyle={{ padding: '2px 0' }}
                        labelStyle={{ marginBottom: '4px', fontWeight: 'bold' }}
                        formatter={(value: number | string | Array<number | string>) => typeof value === 'number' ? `${value.toFixed(2)} J` : value}
                        labelFormatter={(label: number) => typeof label === 'number' ? `Time: ${label.toFixed(1)}s` : label}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} verticalAlign="top" align="right" />
                    <Line type="monotone" dataKey="kinetic" name="Kinetic" stroke="#34d399" strokeWidth={2} dot={false} isAnimationActive={false} />
                    <Line type="monotone" dataKey="potential" name="Potential" stroke="#60a5fa" strokeWidth={2} dot={false} isAnimationActive={false} />
                    <Line type="monotone" dataKey="total" name="Total" stroke="#fb3250" strokeWidth={2} dot={false} isAnimationActive={false} />
                 </LineChart>
            </ResponsiveContainer>
          </div>
      </div>
    </div>
  );
}