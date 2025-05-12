'use client';

import { NextPage } from 'next';
import Head from 'next/head';
import { Sun, Moon, Home, Search, User, Clock, RefreshCw, Settings2, Briefcase, Newspaper, Landmark, LineChart, Building2 } from 'lucide-react';
import { useState, useEffect } from 'react';

const UrbanDevelopmentPage: NextPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeMainTab, setActiveMainTab] = useState("RIYADH CITY");
  const [activeSideTab, setActiveSideTab] = useState("Timeline");

  const themeToggler = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const topIcons = [
    { id: 'home', IconComponent: Home, tip: 'Home' },
    { id: 'search', IconComponent: Search, tip: 'Search' },
    { id: 'user', IconComponent: User, tip: 'Profile' },
  ];

  const mainNavTabs = [
    "RIYADH CITY", "RIYADH DIRECTORY", "EVENTS", "TOURISM", "ART & CULTURE", "RIYADH BLOG"
  ];

  const sideNavItems = [
    { name: "About Riyadh", IconComponent: Landmark, id: "AboutRiyadh" },
    { name: "Old Riyadh", IconComponent: Briefcase, id: "OldRiyadh" },
    { name: "Publications", IconComponent: Newspaper, id: "Publications" },
    { name: "Timeline", IconComponent: Clock, id: "Timeline" },
    { name: "Statistics", IconComponent: LineChart, id: "Statistics" },
  ];

  const timelineYears = [
    "1921 - 1940", "1940 - 1950", "1950 - 1960", "1960 - 1970", 
    "1970 - 1980", "1980 - 1990", "1990 - 2000", "2000 - 2010"
  ];
  const currentTimelineYear = "2010 - 2018";


  return (
    <>
      <Head>
        <title>Riyadh Urban Development</title>
        <meta name="description" content="Visualizing urban development of Riyadh over time." />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
      </Head>

      <div className={`flex flex-col min-h-screen font-roboto transition-colors duration-300 ${isDarkMode ? 'dark bg-[#070707] text-[#dddddc]' : 'bg-[#F3F4F6] text-[#1F2937]'}`}>
        
        <header className={`w-full p-3 px-6 flex justify-between items-center shadow-md ${isDarkMode ? 'bg-[#070707] border-b border-[#545352]' : 'bg-white border-b border-gray-200'}`}>
          <div className="flex items-center space-x-5">
            {topIcons.map(item => (
              <item.IconComponent key={item.id} className={`w-5 h-5 cursor-pointer ${isDarkMode ? 'text-[#dddddc] hover:text-[#4C871D]' : 'text-[#545352] hover:text-[#3E8011]'}`} />
            ))}
          </div>
          <div className={`font-montserrat font-bold text-xl tracking-wider ${isDarkMode ? 'text-[#dddddc]' : 'text-[#070707]'}`}>
            RIYADH <span className={`text-sm font-medium opacity-80 ${isDarkMode ? 'text-[#4C871D]' : 'text-[#3E8011]'}`}>URBAN PULSE</span>
          </div>
          <button onClick={themeToggler} className={`p-2 rounded-full cursor-pointer focus:outline-none focus:ring-2 ${isDarkMode ? 'text-[#dddddc] hover:bg-[#545352] focus:ring-[#4C871D]' : 'text-[#545352] hover:bg-gray-200 focus:ring-[#3E8011]'}`} >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </header>

        <main className="flex-grow flex flex-col lg:flex-row p-4 gap-4">
          <div className="flex-grow flex flex-col space-y-4 lg:w-3/4 order-2 lg:order-1">
            <div className={`relative flex-grow rounded-xl flex items-center justify-center min-h-[400px] lg:min-h-[60vh] ${isDarkMode ? 'bg-[#121212]' : 'bg-gray-200'} border ${isDarkMode ? 'border-[#545352]' : 'border-gray-300'} shadow-lg overflow-hidden`}>
              <div className={`absolute inset-0 bg-cover bg-center opacity-30 ${isDarkMode ? 'bg-[url(/riyadh-map-dark.png)]' : 'bg-[url(/riyadh-map-light.png)]'}`}></div>
              
              <div className="relative z-10 text-center p-8">
                <h1 className={`font-montserrat text-4xl md:text-5xl font-bold ${isDarkMode ? 'text-white': 'text-black'}`}>Riyadh</h1>
                <p className={`font-montserrat text-6xl md:text-7xl font-bold mt-2 ${isDarkMode ? 'text-[#4C871D]' : 'text-[#3E8011]'}`}>{currentTimelineYear}</p>
              </div>
               <div className={`absolute bottom-4 right-4 p-2 rounded-full cursor-pointer ${isDarkMode ? 'bg-[#070707] text-[#dddddc] hover:bg-[#4C871D]' : 'bg-white text-[#070707] hover:bg-[#3E8011] hover:text-white'}`}>
                <Settings2 className="w-6 h-6" />
              </div>
            </div>

            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#121212]' : 'bg-white'} border ${isDarkMode ? 'border-[#545352]' : 'border-gray-300'} shadow`}>
              <div className="flex flex-wrap justify-around items-center text-xs sm:text-sm gap-2">
                {timelineYears.map(year => (
                  <span key={year} className={`cursor-pointer px-3 py-2 rounded-md font-medium font-montserrat ${isDarkMode ? 'text-[#dddddc] hover:bg-[#545352]' : 'text-[#545352] hover:bg-gray-200'}`}>{year}</span>
                ))}
                <span className={`cursor-pointer px-3 py-2 rounded-md font-bold font-montserrat ${isDarkMode ? 'bg-[#4C871D] text-white ring-2 ring-offset-2 ring-offset-[#070707] ring-[#3A6E11]' : 'bg-[#3E8011] text-white ring-2 ring-offset-2 ring-offset-white ring-[#3A6E11]'}`}>{currentTimelineYear}</span>
              </div>
            </div>

            <div className={`p-1 rounded-lg ${isDarkMode ? 'bg-[#121212]' : 'bg-white'} border-t ${isDarkMode ? 'border-[#545352]' : 'border-gray-200'} shadow`}>
              <nav className="flex flex-wrap justify-center sm:justify-start space-x-1 text-sm">
                {mainNavTabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveMainTab(tab)}
                    className={`py-2.5 px-3 sm:px-5 my-1 rounded-md cursor-pointer font-montserrat font-semibold transition-all duration-200 ease-in-out
                      ${activeMainTab === tab 
                        ? (isDarkMode ? 'bg-[#4C871D] text-white shadow-md' : 'bg-[#3E8011] text-white shadow-md') 
                        : (isDarkMode ? 'text-[#dddddc] hover:bg-[#545352] hover:text-white' : 'text-[#3A6E11] hover:bg-gray-100')}
                    `}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <aside className={`w-full lg:w-1/4 p-4 rounded-xl flex flex-col space-y-5 ${isDarkMode ? 'bg-[#121212]' : 'bg-white'} border ${isDarkMode ? 'border-[#545352]' : 'border-gray-300'} shadow-lg order-1 lg:order-2`}>
            <div className={`flex justify-between items-center pb-3 border-b ${isDarkMode ? 'border-[#545352]' : 'border-gray-300'}`}>
                <div className="flex items-center space-x-2">
                    <Building2 className={`h-8 w-8 ${isDarkMode ? 'text-[#4C871D]' : 'text-[#3E8011]'}`} />
                    <h2 className={`font-montserrat font-bold text-lg tracking-wide ${isDarkMode ? 'text-[#dddddc]' : 'text-[#070707]'}`}>
                        RIYADH
                    </h2>
                </div>
              <RefreshCw className={`w-5 h-5 cursor-pointer ${isDarkMode ? 'text-[#83807D] hover:text-[#4C871D]' : 'text-gray-500 hover:text-[#3E8011]'}`} />
            </div>
            <span className={`text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-[#83807D]' : 'text-gray-500'}`}>BETA VERSION</span>

            <nav className="flex-grow flex flex-col space-y-2">
              {sideNavItems.map(item => (
                <a
                  key={item.id}
                  href="#"
                  onClick={(e) => { e.preventDefault(); setActiveSideTab(item.id);}}
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ease-in-out
                    ${activeSideTab === item.id 
                      ? (isDarkMode ? 'bg-[#4C871D] text-white shadow-lg' : 'bg-[#3E8011] text-white shadow-lg') 
                      : (isDarkMode ? 'text-[#dddddc] hover:bg-[#545352] hover:text-white' : 'text-[#545352] hover:bg-gray-100')}
                  `}
                >
                  <item.IconComponent className={`w-5 h-5 flex-shrink-0 ${activeSideTab === item.id ? 'text-white' : (isDarkMode ? 'text-[#dddddc]' : 'text-[#3A6E11]') }`} />
                  <span className="font-montserrat font-medium">{item.name}</span>
                </a>
              ))}
            </nav>

            <div className={`flex items-center justify-between pt-4 border-t ${isDarkMode ? 'border-[#545352]' : 'border-gray-300'} mt-auto`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold cursor-pointer ${isDarkMode ? 'bg-[#545352] text-white hover:bg-[#4C871D]' : 'bg-gray-300 text-black hover:bg-[#3E8011] hover:text-white'}`}>
                +13
              </div>
              <div className={`text-right font-montserrat ${isDarkMode ? 'text-[#dddddc]' : 'text-black'}`}>
                <p className="text-xs opacity-70">Current Period</p>
                <p className="text-xl font-semibold">{currentTimelineYear}</p>
              </div>
            </div>
          </aside>
        </main>
        
        <footer className={`text-center p-5 text-xs ${isDarkMode ? 'text-[#83807D]' : 'text-gray-500'} border-t ${isDarkMode ? 'border-[#545352]' : 'border-gray-200'} shadow-inner`}>
          Riyadh Urban Development Visualizer &copy; {new Date().getFullYear()}. All rights reserved.
        </footer>
      </div>
    </>
  );
};

export default UrbanDevelopmentPage;
