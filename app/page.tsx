'use client'

import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, BarChart2, Settings, User, HelpCircle, Bell, Search, ChevronDown, Sun, Moon, TrendingUp, Plus, RefreshCw, ArrowLeft } from 'lucide-react';
import { Montserrat, Roboto } from 'next/font/google';
import Image from 'next/image'; 
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';


const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['600', '700'],
});
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500'], 
});
const timeRanges = ['1D', '5D', '1M', '3M', '6M', 'YTD', '1Y', '5Y', 'ALL'];
type StockScreenerItem = {
  ticker: string; name: string; logoUrl: string; price: number;
  changeValue: number; changePercent: number; volume: string;
  rating: 'Strong Sell' | 'Sell' | 'Neutral' | 'Buy' | 'Strong Buy';
};
const stockScreenerData: StockScreenerItem[] = [
  { ticker: 'AAPL', name: 'Apple Inc.', logoUrl: 'https://logo.clearbit.com/apple.com', price: 223.89, changeValue: 0.70, changePercent: 0.31, volume: '35.91 M', rating: 'Neutral' },
  { ticker: 'MSFT', name: 'Microsoft Corporation', logoUrl: 'https://logo.clearbit.com/microsoft.com', price: 382.14, changeValue: -0.01, changePercent: -0.05, volume: '16.09 M', rating: 'Sell' },
  { ticker: 'NVDA', name: 'NVIDIA Corporation', logoUrl: 'https://logo.clearbit.com/nvidia.com', price: 110.42, changeValue: 0.27, changePercent: 0.25, volume: '220.6 M', rating: 'Strong Sell' },
  { ticker: 'AMZN', name: 'Amazon.com, Inc.', logoUrl: 'https://logo.clearbit.com/amazon.com', price: 196.01, changeValue: 3.84, changePercent: 2.00, volume: '53.67 M', rating: 'Sell' },
  { ticker: 'GOOG', name: 'Alphabet Inc.', logoUrl: 'https://logo.clearbit.com/abc.xyz', price: 158.86, changeValue: -0.02, changePercent: -0.01, volume: '17.11 M', rating: 'Sell' },
  { ticker: 'TSLA', name: 'Tesla, Inc.', logoUrl: 'https://logo.clearbit.com/tesla.com', price: 185.60, changeValue: 2.15, changePercent: 1.17, volume: '95.3 M', rating: 'Buy' },
];
type WatchlistItem = {
  id: string; type: 'Index' | 'Stock' | 'Future' | 'Crypto'; symbol: string;
  name?: string; price: number; changeValue: number; changePercent: number;
};
const watchlistData: WatchlistItem[] = [
  { id: 'spx', type: 'Index', symbol: 'SPX', price: 5670.98, changeValue: 17.83, changePercent: 0.32 },
  { id: 'ndq', type: 'Index', symbol: 'NDQ', price: 19581.78, changeValue: 145.35, changePercent: 0.75 },
  { id: 'dji', type: 'Index', symbol: 'DJI', price: 42225.32, changeValue: 235.36, changePercent: 0.56 },
  { id: 'vix', type: 'Index', symbol: 'VIX', price: 21.51, changeValue: -0.28, changePercent: -1.19 },
  { id: 'vvx', type: 'Index', symbol: 'VVX', price: 102.740, changeValue: -0.951, changePercent: -0.92 },
  { id: 'aapl2', type: 'Stock', symbol: 'AAPL', name: 'Apple Inc.', price: 223.89, changeValue: 0.70, changePercent: 0.31 },
  { id: 'nflx', type: 'Stock', symbol: 'NFLX', name: 'Netflix Inc.', price: 282.76, changeValue: 14.30, changePercent: 5.31 },
  { id: 'tsla2', type: 'Stock', symbol: 'TSLA', name: 'Tesla, Inc.', price: 185.60, changeValue: 2.15, changePercent: 1.17 },
  { id: 'goog2', type: 'Stock', symbol: 'GOOG', name: 'Alphabet Inc.', price: 158.86, changeValue: -0.02, changePercent: -0.01 },
  { id: 'meta', type: 'Stock', symbol: 'META', name: 'Meta Platforms Inc.', price: 471.50, changeValue: 5.12, changePercent: 1.10 },
  { id: 'usoil', type: 'Future', symbol: 'FUTURES', name: 'Crude Oil', price: 69.88, changeValue: -0.78, changePercent: -1.10 },
  { id: 'gold', type: 'Future', symbol: 'GOLD', name: 'Gold Spot', price: 3123.455, changeValue: -8.783, changePercent: -0.28 },
  { id: 'silver', type: 'Future', symbol: 'SILVER', name: 'Silver Spot', price: 33.220, changeValue: -0.6650, changePercent: -1.96 },
  { id: 'natgas', type: 'Future', symbol: 'NATGAS', name: 'Natural Gas', price: 2.85, changeValue: 0.05, changePercent: 1.78 },
  { id: 'btc', type: 'Crypto', symbol: 'BTC', name: 'Bitcoin', price: 65432.10, changeValue: 1234.56, changePercent: 1.92 },
  { id: 'eth', type: 'Crypto', symbol: 'ETH', name: 'Ethereum', price: 3456.78, changeValue: -56.20, changePercent: -1.60 },
];


const performanceRanges = ['1W', '1M', '6M', 'YTD', '1Y', '3Y'];
const fmtChange = (value: number, percent: number, dark: boolean) => {
  const isPositive = value >= 0;
  const colorClass = isPositive ? 'text-[#3cb791]' : 'text-[#be5461]';
  const sign = isPositive ? '+' : '';
  return (
    <>
      <span className={colorClass}>{sign}{value.toFixed(2)}</span>
      <span className={`${colorClass} ml-2`}>({sign}{percent.toFixed(2)}%)</span>
    </>
  );
};
const ratingStyle = (rating: StockScreenerItem['rating'], dark: boolean) => {
  switch (rating) {
    case 'Strong Sell': return `bg-[#be5461]/80 text-white`;
    case 'Sell': return `bg-[#be5461]/50 ${dark ? 'text-red-100' : 'text-red-900'}`;
    case 'Neutral': return `${dark ? 'bg-gray-600/50 text-gray-300' : 'bg-gray-200 text-gray-700'}`;
    case 'Buy': return `bg-[#3cb791]/50 ${dark ? 'text-green-100' : 'text-green-900'}`;
    case 'Strong Buy': return `bg-[#3cb791]/80 text-white`;
    default: return `${dark ? 'bg-gray-700 text-gray-300' : 'bg-gray-300 text-gray-600'}`;
  }
};
const fmtWLChange = (changeValue: number, changePercent: number) => {
  const isPositive = changeValue >= 0;
  const colorClass = isPositive ? 'text-[#3cb791]' : 'text-[#be5461]';
  const sign = isPositive ? '+' : '';
              return (
    <div className="text-right">
       <p className={`text-xs font-medium ${colorClass}`}>{sign}{changeValue.toFixed(2)}</p>
       <p className={`text-xs ${colorClass}`}>{sign}{changePercent.toFixed(2)}%</p>
    </div>
  );
};
interface SearchableStockInfo {
  id: string;
  type: 'Index' | 'Stock' | 'Future' | 'Crypto'; 
  symbol: string;
  name?: string;
  price: number;
  changeValue: number;
  changePercent: number;
}


const searchData: SearchableStockInfo[] = (
  [ 
    { id: 'spx', type: 'Index', symbol: 'SPX', name: 'S&P 500 Index', price: 5670.98, changeValue: 17.83, changePercent: 0.32 }, 
    ...watchlistData, 
    ...stockScreenerData.map((s): SearchableStockInfo => ({ 
        id: s.ticker.toLowerCase(), 
        type: 'Stock', 
        symbol: s.ticker,
        name: s.name,
        price: s.price,
        changeValue: s.changeValue,
        changePercent: s.changePercent
    }))
  ]
).reduce((acc: SearchableStockInfo[], current) => { 
  if (!acc.find(item => item.symbol === current.symbol)) {
    acc.push(current as SearchableStockInfo); 
  }
  return acc;
}, [] as SearchableStockInfo[]); 

const makeChartData = (baseValue: number, range: string) => {
  const data = [];
  let currentValue = baseValue;
  
  
  let numPoints = 16; 
  let volatilityFactor = 0.15; 

  switch (range) {
    case '1D': numPoints = 8; volatilityFactor = 0.25; break;
    case '5D': numPoints = 10; volatilityFactor = 0.20; break;
    case '1M': numPoints = 12; volatilityFactor = 0.18; break;
    case '3M': 
    case '6M': 
    case 'YTD': numPoints = 14; volatilityFactor = 0.16; break;
    case '1Y': 
    case '5Y': 
    case 'ALL':
    default: numPoints = 16; volatilityFactor = 0.15; break;
  }
  const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan25', 'Feb25', 'Mar25', 'Apr25'];
  const monthsToUse = allMonths.slice(-numPoints); 
  for (const month of monthsToUse) {
    const changePercent = (Math.random() - 0.48) * volatilityFactor;
    currentValue = currentValue * (1 + changePercent);
    data.push({ name: month, value: Math.max(0, Math.round(currentValue * 100) / 100) }); 
  }
  return data;
};

export default function FinancialDashboardPage() {
  const [dark, setDark] = useState(true);
  const [timeR, setTimeR] = useState('1Y');
  const [client, setClient] = useState(false);
  const [perfR, setPerfR] = useState('YTD');
  const [wTab, setWTab] = useState('Index');
  const [updTime, setUpdTime] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [suggs, setSuggs] = useState<SearchableStockInfo[]>([]);
  const [showS, setShowS] = useState(false);
  const defaultStock = searchData.find(item => item.symbol === 'SPX') || searchData[0] || null;
  const [selData, setSelData] = useState<SearchableStockInfo | null>(defaultStock);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [mobSearchOpen, setMobSearchOpen] = useState(false);
  const [cData, setCData] = useState(() => 
     defaultStock ? makeChartData(defaultStock.price, timeR) : [] 
  );

  useEffect(() => {
    setClient(true);
    
    const date = new Date();
    date.setMinutes(date.getMinutes() - 2);
    const formattedTime = date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).replace(',', ' at');
    setUpdTime(`${formattedTime} UTC -5`);
    
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowS(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (selData) {
      setCData(makeChartData(selData.price, timeR));
    }
  }, [selData, timeR]); 

  const toggleDark = () => setDark(!dark);
  const setTimeRange = (range: string) => {
    setTimeR(range);
  };
  const setPerfRange = (range: string) => setPerfR(range);
  const setWatchTab = (tab: string) => setWTab(tab);
  const searchHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const queryVal = event.target.value;
    setQ(queryVal);

    if (queryVal.length > 0) {
      const fSuggs = searchData.filter(
        item => 
          item.symbol.toLowerCase().includes(queryVal.toLowerCase()) ||
          item.name?.toLowerCase().includes(queryVal.toLowerCase())
      );
      setSuggs(fSuggs.slice(0, 6)); 
      setShowS(fSuggs.length > 0);
    } else {
      setSuggs([]);
      setShowS(false);
    }
  };

  const suggClickHandler = (item: SearchableStockInfo) => {
    setSelData(item); 
    setQ(item.symbol);
    setShowS(false);
    setSuggs([]);
    setMobSearchOpen(false); 
  };
  const openMobileSearch = () => {
    setMobSearchOpen(true);
  };
  const closeMobileSearch = () => {
    setMobSearchOpen(false);
    setQ(''); 
    setSuggs([]);
    setShowS(false);
  };
  const fWatchlist = watchlistData.filter(item => {
    if (wTab === 'All') return true;
    return item.type === wTab;
  });
  const watchlistTabs = ['All', 'Index', 'Stock', 'Future', 'Crypto'];


      return (
    <div className={`flex h-screen w-full ${roboto.className} ${dark ? 'bg-[#100e0e] text-gray-200' : 'bg-gray-100 text-gray-900'}`}>
      <div className="flex-1 flex flex-col overflow-hidden">
         <div className={`h-16 border-b ${dark ? 'border-gray-600/40 bg-[#171717]' : 'border-gray-300/60 bg-white'} px-4 flex items-center justify-between shrink-0`}>
           {mobSearchOpen ? ( 
             <div ref={searchContainerRef} className="flex items-center gap-2 w-full relative"> 
                <button onClick={closeMobileSearch} className={`p-1.5 ${dark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'} cursor-pointer`}>
                   <ArrowLeft size={20} /> 
                </button>
                <div className="relative flex-grow">
                   <Search size={16} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${dark ? 'text-gray-500' : 'text-gray-400'} z-10`} />
                   <input 
                     type="text" 
                     placeholder="Search symbol or name..." 
                     value={q}
                     onChange={searchHandler}
                     onFocus={() => q.length > 0 && suggs.length > 0 && setShowS(true)} 
                     autoFocus
                     className={`w-full pl-9 pr-3 py-1.5 text-sm rounded-md border ${dark 
                        ? 'bg-[#100e0e] border-gray-600/40 text-gray-200 placeholder-gray-500 focus:ring-purple-500/50 focus:border-purple-500/80' 
                        : 'bg-white border-gray-300/60 text-gray-900 placeholder-gray-400 focus:ring-blue-500/50 focus:border-blue-500'
                      } focus:outline-none focus:ring-1 transition`} 
                   />
                 </div>
                 {showS && suggs.length > 0 && (
                   <div className={`absolute top-full left-0 right-0 mt-1.5 ${dark ? 'bg-[#1f2937] border-gray-600/50' : 'bg-white border-gray-200'} border rounded-md shadow-lg z-50 overflow-hidden`}>
                     <ul>
                       {suggs.map((item: SearchableStockInfo) => (
                         <li key={item.id}>
                           <button 
                             onClick={() => suggClickHandler(item)} 
                             className={`w-full text-left px-4 py-2 text-sm flex justify-between items-center ${dark ? 'text-gray-200 hover:bg-gray-700/50' : 'text-gray-800 hover:bg-gray-100'} transition-colors cursor-pointer`}
                           >
                             <span>
                               <span className="font-medium">{item.symbol}</span>
                               <span className={`ml-2 text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{item.name}</span>
                             </span>
                             <span className={`text-xs px-1.5 py-0.5 rounded ${dark ? 'bg-gray-600/50 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>{item.type}</span>
                           </button>
                         </li>
                       ))}
                     </ul>
                   </div>
                 )}
              </div> 

           ) : ( 
             <>
               <div className="flex items-center gap-2">
                 <div className={`h-8 w-8 ${dark ? 'bg-gradient-to-br from-pink-600 to-purple-600' : 'bg-gradient-to-br from-pink-500 to-purple-500'} rounded-md flex items-center justify-center`}>
                    <BarChart2 size={16} className="text-white/80"/>
                </div>
                 <h1 className={`${montserrat.className} text-lg sm:text-xl font-bold ${dark ? 'text-white' : 'text-black'}`}>MoonBucks</h1> 
               </div>
               <div ref={searchContainerRef} className="hidden sm:flex items-center flex-grow max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-4 relative">
                 <div className="relative flex-grow">
                   <Search 
                     size={16} 
                     className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${dark ? 'text-gray-500' : 'text-gray-400'} z-10`} 
                   />
                   <input 
                      type="text"
                      placeholder="Search symbol or name..." 
                      value={q} 
                      onChange={searchHandler} 
                      onFocus={() => q.length > 0 && suggs.length > 0 && setShowS(true)}
                      className={`w-full pl-9 pr-3 py-1.5 text-sm rounded-md border ${dark 
                        ? 'bg-[#100e0e] border-gray-600/40 text-gray-200 placeholder-gray-500 focus:ring-purple-500/50 focus:border-purple-500/80' 
                        : 'bg-white border-gray-300/60 text-gray-900 placeholder-gray-400 focus:ring-blue-500/50 focus:border-blue-500'
                      } focus:outline-none focus:ring-1 transition`} 
                   />
                 </div>
                 {showS && suggs.length > 0 && (
                    <div className={`absolute top-full left-0 right-0 mt-1.5 ${dark ? 'bg-[#1f2937] border-gray-600/50' : 'bg-white border-gray-200'} border rounded-md shadow-lg z-50 overflow-hidden`}>
                       <ul>
                         {suggs.map((item: SearchableStockInfo) => (
                            <li key={item.id}>
                              <button 
                                onClick={() => suggClickHandler(item)} 
                                className={`w-full text-left px-4 py-2 text-sm flex justify-between items-center ${dark ? 'text-gray-200 hover:bg-gray-700/50' : 'text-gray-800 hover:bg-gray-100'} transition-colors cursor-pointer`}
                              >
                                <span>
                                  <span className="font-medium">{item.symbol}</span>
                                  <span className={`ml-2 text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{item.name}</span>
                                </span>
                                <span className={`text-xs px-1.5 py-0.5 rounded ${dark ? 'bg-gray-600/50 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>{item.type}</span>
                              </button>
                            </li>
                          ))}
                       </ul>
                    </div>
                 )}
               </div>
               <div className="flex items-center gap-2 sm:gap-4"> 
                 <button onClick={openMobileSearch} className={`sm:hidden p-1.5 rounded-full ${dark ? 'text-gray-400 hover:bg-gray-700/50' : 'text-gray-500 hover:bg-gray-200'} transition-colors cursor-pointer`}> 
                    <Search size={20} /> 
                 </button>
                 
                 <button 
                     onClick={toggleDark} 
                     className={`p-1.5 rounded-full ${dark ? 'text-yellow-400 hover:bg-gray-700/50' : 'text-indigo-600 hover:bg-gray-200'} transition-colors cursor-pointer`} 
                     aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
                  >
                     {dark ? <Sun size={20}/> : <Moon size={20}/>} 
                 </button>
               </div>
             </> 
           )} 
         </div> 
         <div className={`flex-1 overflow-y-auto p-4 sm:p-6 ${dark ? 'bg-[#100e0e]' : 'bg-gray-50'}`}>
           <div className="block md:hidden mb-4"> 
             {selData ? (
               <div className={`border-b pb-4 ${dark ? 'border-gray-600/40' : 'border-gray-300/60'}`}> 
                   <p className={`text-xs font-semibold ${dark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                     {selData.name || selData.symbol} 
                     <span className="text-[10px] opacity-70 ml-1">• {selData.type?.toUpperCase()}</span>
                   </p>
                   <h2 className={`${montserrat.className} text-3xl font-bold ${dark ? 'text-white' : 'text-black'}`}>
                      {selData.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                   </h2>
                   <p className={`text-lg font-semibold ${selData.changeValue >= 0 ? 'text-[#3cb791]' : 'text-[#be5461]'}`}>
                       {selData.changeValue >= 0 ? '+' : ''}{selData.changeValue.toFixed(2)} ({selData.changeValue >= 0 ? '+' : ''}{selData.changePercent.toFixed(2)}%)
                   </p>
                   <p className={`text-[10px] mt-1 ${dark ? 'text-gray-500' : 'text-gray-500'}`}>
                     {client ? `Last update ${updTime}` : 'Calculating time...'}
                   </p>
                   <div className={`mt-3 p-2 rounded-lg flex items-start gap-2 ${dark ? 'bg-gray-800/50 border border-gray-700/40' : 'bg-yellow-50 border border-yellow-200'}`}>
                       <TrendingUp size={16} className={`${dark ? 'text-yellow-400' : 'text-yellow-600'} mt-0.5 shrink-0`} />
                       <p className={`text-[11px] leading-snug ${dark ? 'text-gray-300' : 'text-gray-700'}`}> 
                           <span className={`font-semibold ${dark ? 'text-white' : 'text-black'}`}>15m ago -</span> {selData.symbol} Alert Placeholder...
                       </p>
                       <button className={`ml-auto text-[10px] ${dark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-black'} cursor-pointer`}>&gt;</button>
                   </div>
               </div>
             ) : (
               <div className={`border-b pb-4 ${dark ? 'border-gray-600/40' : 'border-gray-300/60'} text-center text-sm ${dark ? 'text-gray-500' : 'text-gray-600'}`}>Select a stock</div>
             )}
           </div>
           <div className="w-full h-[350px] mb-4"> 
             {client ? (
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={cData} margin={{ top: 5, right: 5, left: -30, bottom: 5 }}> 
                   <defs>
                     <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#be5461" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#be5461" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#333333" : "#e0e0e0"} vertical={false} />
                   <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: dark ? '#6b7280' : '#6b7280' }} dy={10} />
                   <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: dark ? '#6b7280' : '#6b7280' }} dx={-5} />
                   <Tooltip contentStyle={{ backgroundColor: dark ? '#1f2937' : '#ffffff', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', fontSize: '12px', padding: '8px 12px' }} itemStyle={{ color: dark ? '#d1d5db' : '#374151' }} labelStyle={{ color: dark ? '#9ca3af' : '#6b7280', marginBottom: '4px', fontWeight: 'bold' }} cursor={{ stroke: '#be5461', strokeWidth: 1, strokeDasharray: '3 3' }}/>
                   <Area type="monotone" dataKey="value" stroke="#be5461" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" activeDot={{ r: 6 }} />
                 </AreaChart>
               </ResponsiveContainer>
             ) : (
               <div className="w-full h-full bg-gray-800/50 animate-pulse rounded-md"></div>
             )}
           </div>
           <div className={`flex justify-center flex-wrap sm:flex-nowrap gap-1 ${dark ? 'bg-[#171717]' : 'bg-gray-200'} p-1 rounded-md max-w-max mx-auto mb-6`}> 
              {timeRanges.map((range) => {
                 const isHiddenMobile = ['5D', '3M', '5Y'].includes(range);
                 return (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`
                        px-3 py-1 rounded text-xs font-medium transition-colors duration-150 cursor-pointer 
                        ${isHiddenMobile ? 'hidden sm:inline-flex' : 'inline-flex'} 
                        ${timeR === range 
                          ? (dark ? 'bg-gray-600 text-white' : 'bg-gray-300 text-black') 
                          : (dark ? 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200' : 'text-gray-500 hover:bg-gray-300/50 hover:text-gray-700')
                        }
                      `}
                    >
                      {range}
                    </button>
                 );
               })}
            </div>
           <div className={`mt-6 rounded-lg shadow ${dark ? 'bg-[#171717]' : 'bg-white'} overflow-hidden`}>
              <div className={`p-4 border-b ${dark ? 'border-gray-600/40' : 'border-gray-300/60'}`}> 
                <h3 className={`${montserrat.className} text-lg font-semibold ${dark ? 'text-white' : 'text-black'}`}>Stock Screener</h3>
              </div>
              
              <div> 
                <div className={`min-w-full ${dark ? '' : ''}`}>
                  <div className={`hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium ${dark ? 'text-gray-400 bg-gray-800/20' : 'text-gray-500 bg-gray-50'} uppercase tracking-wider border-b ${dark ? 'border-gray-600/40' : 'border-gray-300/60'}`}> 
                     <div className="col-span-3">Ticker</div>
                     <div className="col-span-2 text-right">Price</div>
                     <div className="col-span-3 text-right">CHG / CHG %</div>
                     <div className="col-span-2 text-right">VOL</div>
                     <div className="col-span-2 text-center">Technical Rating</div>
                  </div>
                  <div className={`${dark ? '' : ''}`}> 
                    {stockScreenerData.map((stock, index) => (
                      <div 
                        key={stock.ticker} 
                        className={`
                          block md:grid md:grid-cols-12 md:gap-4 md:items-center 
                          px-4 py-3 
                          text-sm 
                          border-b ${dark ? 'border-gray-600/40' : 'border-gray-300/60'}
                          ${index === stockScreenerData.length -1 ? 'border-b-0' : ''} 
                          ${dark ? 'hover:bg-gray-700/20' : 'hover:bg-gray-50'} transition-colors
                        `}
                      >
                        <div className="md:col-span-3 flex items-center gap-2 truncate mb-2 md:mb-0">
                          <img src={stock.logoUrl} alt={`${stock.name} logo`} className="w-6 h-6 rounded-full object-contain flex-shrink-0 bg-white" /> 
                          <div className="truncate">
                             <p className={`font-semibold md:font-medium ${dark ? 'text-white' : 'text-black'}`}>{stock.ticker}</p>
                             <p className={`text-xs truncate ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{stock.name}</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-baseline md:col-span-5 md:grid md:grid-cols-5 md:gap-4 mb-2 md:mb-0">
                          
                          <div className={`md:col-span-2 text-left md:text-right font-medium ${dark ? 'text-gray-200' : 'text-gray-800'}`}>${stock.price.toFixed(2)}</div>
                          
                          <div className="md:col-span-3 text-right text-xs">
                            {fmtChange(stock.changeValue, stock.changePercent, dark)}
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-xs md:col-span-4 md:grid md:grid-cols-4 md:gap-4 md:text-sm">
                           
                           <div className={`md:col-span-2 md:text-right ${dark ? 'text-gray-400' : 'text-gray-600'}`}> 
                             <span className="md:hidden mr-1">VOL:</span>{stock.volume}
                           </div>
                           <div className="md:col-span-2 flex justify-end md:justify-center">
                             <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${ratingStyle(stock.rating, dark)}`}>
                                {stock.rating}
                              </span>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div> 
                </div>
              </div> 
            </div>
           <div className="block md:hidden mt-6 space-y-6"> 
              {selData && ( 
                 <div>
                   <h4 className={`text-sm font-semibold mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Performance</h4>
                   <div className="grid grid-cols-3 gap-2">
                       {performanceRanges.map((range) => (
                         <button
                           key={range}
                           onClick={() => setPerfRange(range)}
                           className={`px-2 py-1 rounded text-[11px] font-medium transition-colors duration-150 text-center cursor-pointer
                             ${perfR === range
                               ? (dark ? 'bg-[#be5461] text-white' : 'bg-red-600 text-white') 
                               : (dark ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50' : 'bg-gray-200 text-gray-600 hover:bg-gray-300')
                             }`}
                         >
                           <span className="font-bold">{range === 'YTD' ? '3.89%' : '-8.40%'}</span>
                           <span className="block opacity-80">{range}</span>
                         </button>
                       ))}
                   </div>
                 </div>
              )}
               {selData && ( 
                 <div>
                   <h4 className={`text-sm font-semibold mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Technicals</h4>
                   <div className={`p-3 rounded-lg ${dark ? 'bg-gray-800/50' : 'bg-gray-100'}`}> 
                       <div className="flex justify-between text-[10px] font-medium ${dark ? 'text-gray-400' : 'text-gray-600'} mb-1 px-1">
                           <span>Strong Sell</span>
                           <span>Neutral</span>
                           <span>Strong Buy</span>
                       </div>
                       <div className="w-full h-3 bg-gradient-to-r from-[#be5461] via-yellow-500 to-[#3cb791] rounded-full relative overflow-hidden">
                          <div 
                            className={`absolute top-0 bottom-0 w-1 bg-white rounded-full shadow-md transform -translate-x-1/2`} 
                            style={{ left: '75%' }}> 
                          </div>
                       </div>
                       <div className="flex justify-between text-xs font-semibold mt-2">
                          <button className={`px-3 py-1 rounded ${dark ? 'text-red-400 hover:bg-red-900/30' : 'text-red-600 hover:bg-red-100'} cursor-pointer`}>Sell</button>
                          <button className={`px-3 py-1 rounded ${dark ? 'bg-gray-600 text-white' : 'bg-gray-300 text-black'} cursor-pointer`}>Neutral</button>
                          <button className={`px-3 py-1 rounded ${dark ? 'text-green-400 hover:bg-green-900/30' : 'text-green-600 hover:bg-green-100'} cursor-pointer`}>Buy</button>
                       </div>
                   </div>
                 </div>
               )}
              <div className={`pt-4 border-t ${dark ? 'border-gray-600/40' : 'border-gray-300/60'}`}> 
                  <div className="flex justify-between items-center mb-2">
                      <h4 className={`text-sm font-semibold ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Watchlist</h4>
                      <div className="flex items-center gap-2">
                         <button className={`p-1 rounded ${dark ? 'text-gray-400 hover:text-white hover:bg-gray-700/50' : 'text-gray-500 hover:text-black hover:bg-gray-200'} cursor-pointer`} aria-label="Add to watchlist">
                            <Plus size={16} />
                         </button>
                         <button className={`p-1 rounded ${dark ? 'text-gray-400 hover:text-white hover:bg-gray-700/50' : 'text-gray-500 hover:text-black hover:bg-gray-200'} cursor-pointer`} aria-label="Refresh watchlist">
                            <RefreshCw size={16} />
                         </button>
                      </div>
                  </div>
                  <div className="flex space-x-1 mb-3 overflow-x-auto scrollbar-hide pb-1">
                      {watchlistTabs.map((tab) => (
                          <button
                              key={tab}
                              onClick={() => setWatchTab(tab)}
                              className={`px-2.5 py-0.5 rounded text-[11px] font-medium whitespace-nowrap transition-colors duration-150 cursor-pointer 
                                  ${wTab === tab
                                      ? (dark ? 'bg-gray-600 text-white' : 'bg-gray-300 text-black')
                                      : (dark ? 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200' : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700')
                                  }`}
                          >
                              {tab}
                          </button>
                      ))}
                  </div>
                  <div className="space-y-1">
                      {fWatchlist.map((item) => (
                          <div key={item.id} className={`flex justify-between items-center p-1.5 rounded ${dark ? 'hover:bg-gray-700/30' : 'hover:bg-gray-100'} transition-colors cursor-pointer`}>
                              <div className="flex items-center gap-2 truncate">
                                  <span className={`text-xs font-medium truncate ${dark ? 'text-gray-200' : 'text-gray-800'}`}>{item.symbol}</span>
                              </div>
                              <span className={`text-xs font-medium ${dark ? 'text-gray-200' : 'text-gray-800'}`}>{item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 3 })}</span>
                              {fmtWLChange(item.changeValue, item.changePercent)}
                          </div>
                      ))}
                  </div>
              </div>
           </div>

         </div> 
      </div> 

      
      <div className={`hidden md:flex w-full md:w-72 lg:w-80 shrink-0 ${dark ? 'bg-[#171717] border-gray-600/40' : 'bg-white border-gray-300/60'} border-l flex-col overflow-hidden`}>
        <div className={`h-16 flex items-center justify-end px-4 gap-3 border-b ${dark ? 'border-gray-600/20' : 'border-gray-300/60'}`}> 
           <button className={`p-1.5 rounded-full ${dark ? 'text-gray-400 hover:bg-gray-700/50 hover:text-white' : 'text-gray-500 hover:bg-gray-200 hover:text-black'} transition-colors cursor-pointer`}> <Bell size={20} /> </button>
           <Image
              src="https://randomuser.me/api/portraits/men/32.jpg" 
              alt="User Profile"
               width={32}
               height={32}
              className="w-8 h-8 rounded-full cursor-pointer object-cover"
           />
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-600/50 scrollbar-track-transparent">
          {selData ? (
            <div className={`border-b pb-4 ${dark ? 'border-gray-600/40' : 'border-gray-300/60'}`}> 
                <p className={`text-xs font-semibold ${dark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                  {selData.name || selData.symbol} 
                  <span className="text-[10px] opacity-70 ml-1">• {selData.type?.toUpperCase()}</span>
                </p>
                <h2 className={`${montserrat.className} text-3xl font-bold ${dark ? 'text-white' : 'text-black'}`}>
                   
                   {selData.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h2>
                
                <p className={`text-lg font-semibold ${selData.changeValue >= 0 ? 'text-[#3cb791]' : 'text-[#be5461]'}`}>
                    {selData.changeValue >= 0 ? '+' : ''}{selData.changeValue.toFixed(2)} ({selData.changeValue >= 0 ? '+' : ''}{selData.changePercent.toFixed(2)}%)
                </p>
                <p className={`text-[10px] mt-1 ${dark ? 'text-gray-500' : 'text-gray-500'}`}>
                  {client ? `Last update ${updTime}` : 'Calculating time...'}
                </p>
                
                <div className={`mt-3 p-2 rounded-lg flex items-start gap-2 ${dark ? 'bg-gray-800/50 border border-gray-700/40' : 'bg-yellow-50 border border-yellow-200'}`}>
                    <TrendingUp size={16} className={`${dark ? 'text-yellow-400' : 'text-yellow-600'} mt-0.5 shrink-0`} />
                    <p className={`text-[11px] leading-snug ${dark ? 'text-gray-300' : 'text-gray-700'}`}> 
                        <span className={`font-semibold ${dark ? 'text-white' : 'text-black'}`}>15m ago -</span> {selData.symbol} Alert Placeholder...
                    </p>
                    <button className={`ml-auto text-[10px] ${dark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-black'} cursor-pointer`}>&gt;</button>
                </div>
           </div>
          ) : (
            <div className={`border-b pb-4 ${dark ? 'border-gray-600/40' : 'border-gray-300/60'} text-center text-sm ${dark ? 'text-gray-500' : 'text-gray-600'}`}>Select a stock</div>
          )}
          <div>
              <h4 className={`text-sm font-semibold mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Performance</h4>
              <div className="grid grid-cols-3 gap-2">
                  {performanceRanges.map((range) => (
          <button
                      key={range}
                      onClick={() => setPerfRange(range)}
                      className={`px-2 py-1 rounded text-[11px] font-medium transition-colors duration-150 text-center cursor-pointer
                        ${perfR === range
                          ? (dark ? 'bg-[#be5461] text-white' : 'bg-red-600 text-white') 
                          : (dark ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50' : 'bg-gray-200 text-gray-600 hover:bg-gray-300')
                        }`}
                    >
                      <span className="font-bold">{range === 'YTD' ? '3.89%' : '-8.40%'}</span>
                      <span className="block opacity-80">{range}</span>
                    </button>
                  ))}
              </div>
          </div> 
          <div>
              <h4 className={`text-sm font-semibold mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Technicals</h4>
              <div className={`p-3 rounded-lg ${dark ? 'bg-gray-800/50' : 'bg-gray-100'}`}> 
                  <div className="flex justify-between text-[10px] font-medium ${dark ? 'text-gray-400' : 'text-gray-600'} mb-1 px-1">
                      <span>Strong Sell</span>
                      <span>Neutral</span>
                      <span>Strong Buy</span>
                  </div>
                  <div className="w-full h-3 bg-gradient-to-r from-[#be5461] via-yellow-500 to-[#3cb791] rounded-full relative overflow-hidden">
                     <div 
                       className={`absolute top-0 bottom-0 w-1 bg-white rounded-full shadow-md transform -translate-x-1/2`} 
                       style={{ left: '75%' }}>
                     </div>
                  </div>
                  <div className="flex justify-between text-xs font-semibold mt-2">
                     <button className={`px-3 py-1 rounded ${dark ? 'text-red-400 hover:bg-red-900/30' : 'text-red-600 hover:bg-red-100'} cursor-pointer`}>Sell</button>
                     <button className={`px-3 py-1 rounded ${dark ? 'bg-gray-600 text-white' : 'bg-gray-300 text-black'} cursor-pointer`}>Neutral</button>
                     <button className={`px-3 py-1 rounded ${dark ? 'text-green-400 hover:bg-green-900/30' : 'text-green-600 hover:bg-green-100'} cursor-pointer`}>Buy</button>
                  </div>
              </div>
          </div> 
          <div className={`pt-4 border-t ${dark ? 'border-gray-600/40' : 'border-gray-300/60'}`}>
              <div className="flex justify-between items-center mb-2">
                  <h4 className={`text-sm font-semibold ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Watchlist</h4>
                  <div className="flex items-center gap-2">
                     <button className={`p-1 rounded ${dark ? 'text-gray-400 hover:text-white hover:bg-gray-700/50' : 'text-gray-500 hover:text-black hover:bg-gray-200'} cursor-pointer`} aria-label="Add to watchlist">
                        <Plus size={16} />
                     </button>
                     <button className={`p-1 rounded ${dark ? 'text-gray-400 hover:text-white hover:bg-gray-700/50' : 'text-gray-500 hover:text-black hover:bg-gray-200'} cursor-pointer`} aria-label="Refresh watchlist">
                        <RefreshCw size={16} />
          </button>
        </div>
      </div>
              <div className="flex space-x-1 mb-3 overflow-x-auto scrollbar-hide pb-1">
                  {watchlistTabs.map((tab) => (
                      <button
                          key={tab}
                          onClick={() => setWatchTab(tab)}
                          className={`px-2.5 py-0.5 rounded text-[11px] font-medium whitespace-nowrap transition-colors duration-150 cursor-pointer 
                              ${wTab === tab
                                  ? (dark ? 'bg-gray-600 text-white' : 'bg-gray-300 text-black')
                                  : (dark ? 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200' : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700')
                              }`}
                      >
                          {tab}
                      </button>
                  ))}
              </div>
              <div className="space-y-1">
                  {fWatchlist.map((item) => (
                      <div key={item.id} className={`flex justify-between items-center p-1.5 rounded ${dark ? 'hover:bg-gray-700/30' : 'hover:bg-gray-100'} transition-colors cursor-pointer`}>
                          <div className="flex items-center gap-2 truncate">
                              <span className={`text-xs font-medium truncate ${dark ? 'text-gray-200' : 'text-gray-800'}`}>{item.symbol}</span>
                          </div>
                          <span className={`text-xs font-medium ${dark ? 'text-gray-200' : 'text-gray-800'}`}>{item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 3 })}</span>
                          {fmtWLChange(item.changeValue, item.changePercent)}
                      </div>
                  ))}
              </div>
          </div> 

        </div> 
      </div> 
    </div> 
  );
}
