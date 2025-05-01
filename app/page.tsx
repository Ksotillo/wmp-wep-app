'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Instagram, X, ChevronDown, User, Settings2, Clock, MessageSquare, ArrowLeft, ArrowRight, Info, Share2, Play, Pause, SkipBack, SkipForward, ChevronRight, Calendar, MessageCircle, PlayCircle, CheckCircle, XCircle } from 'lucide-react';


interface NewsItem {
  id: number;
  title: string;
  description: string;
  source: string;
  image: string;
  readTime: number;
  comments: number;
  leagueTag: string;
  legacyText: string;
}


interface TeamData {
  name: string;
  logoUrl: string;
  probability: number;
}

interface MatchData {
  id: string; 
  date: string;
  time: string;
  team1: TeamData;
  team2: TeamData;
}


const leagues = ["Premier League", "La Liga", "Serie A"];
const availableLanguages = ["English", "Spanish", "French", "German"]; 


const newsItemsData: NewsItem[] = [
  {
    id: 1,
    title: "War Is Coming: Barcelona and Real Madrid Set for Explosive Copa del Rey Final 🔥",
    description: "Barcelona and Real Madrid are bracing for a clash that goes beyond silverware — it's a battle of pride, legacy, and relentless rivalry. On April 26th, Estadio de La Cartuja becomes a colosseum where legends rise and hearts break. El Clásico is never just a game — it's passion, pressure, and history in the making.",
    source: "ESPN News",
    image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    readTime: 12,
    comments: 20,
    leagueTag: "La Liga",
    legacyText: "Not just a trophy. A rivalry."
  },
  {
    id: 2,
    title: "Inter Milan Clinch Serie A Title with Derby Victory Over AC Milan",
    description: "A historic night at San Siro sees Inter secure their 20th Scudetto, marked by intense celebrations and city-wide pride. The Nerazzurri dominated the season, showcasing tactical brilliance under Simone Inzaghi.",
    source: "Gazetta dello Sport",
    image: "https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?q=80&w=2962&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    readTime: 8,
    comments: 45,
    leagueTag: "Serie A",
    legacyText: "A city painted blue and black."
  },
  {
    id: 3,
    title: "Bayern Munich's Young Star Musiala Shines in Bundesliga Thriller",
    description: "Jamal Musiala scores a stunning late winner against Borussia Dortmund, keeping Bayern's title hopes alive in a fiercely contested Der Klassiker. Tactical shifts and individual brilliance defined the match.",
    source: "Kicker",
    image: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    readTime: 10,
    comments: 32,
    leagueTag: "Bundesliga",
    legacyText: "The future is now."
  }
];


const allMatchesData: Record<string, MatchData[]> = {
  "Premier League": [
    {
      id: 'pl1',
      date: "Tomorrow", time: "2:00 PM",
      team1: { name: "Man U", logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/1200px-Manchester_United_FC_crest.svg.png', probability: 67 },
      team2: { name: "Arsenal", logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Arsenal_FC.svg/1200px-Arsenal_FC.svg.png', probability: 33 }
    },
    {
      id: 'pl2',
      date: "Sun, Apr 22", time: "2:00 PM",
      team1: { name: "Chelsea", logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/cc/Chelsea_FC.svg/1200px-Chelsea_FC.svg.png', probability: 50 },
      team2: { name: "Liverpool", logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Liverpool_FC.svg/1200px-Liverpool_FC.svg.png', probability: 50 }
    },
     {
      id: 'pl3',
      date: "Mon, Apr 29", time: "2:00 PM",
      team1: { name: "Man C", logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Manchester_City_FC_badge.svg/1200px-Manchester_City_FC_badge.svg.png', probability: 70 },
      team2: { name: "Tottenham", logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Spurs_2017_badge.svg/250px-Spurs_2017_badge.svg.png', probability: 30 }
    },
    
  ],
  "La Liga": [
      { 
        id: 'll1', 
        date: "Sat, May 4", time: "3:00 PM", 
        team1: { name: "Real Madrid", logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/1200px-Real_Madrid_CF.svg.png', probability: 60 }, 
        team2: { name: "Atlético Madrid", logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f9/Atletico_Madrid_Logo_2024.svg/1200px-Atletico_Madrid_Logo_2024.svg.png', probability: 40 } 
      },
       { 
        id: 'll2', 
        date: "Sat, May 4", time: "5:15 PM", 
        team1: { name: "Sevilla FC", logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3b/Sevilla_FC_logo.svg/1200px-Sevilla_FC_logo.svg.png', probability: 45 }, 
        team2: { name: "Real Betis", logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/13/Real_betis_logo.svg/1200px-Real_betis_logo.svg.png', probability: 55 } 
      },
       { 
        id: 'll3', 
        date: "Sun, May 5", time: "4:00 PM", 
        team1: { name: "Barcelona", logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28crest%29.svg/800px-FC_Barcelona_%28crest%29.svg.png', probability: 70 }, 
        team2: { name: "Valencia", logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/ce/Valenciacf.svg/1200px-Valenciacf.svg.png', probability: 30 } 
      },
  ],
  "Serie A": [
     { 
      id: 'sa1', 
      date: "Sun, May 5", time: "2:45 PM", 
      team1: { name: "Juventus", logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Juventus_FC_-_logo_black_%28Italy%2C_2020%29.svg', probability: 55 }, 
      team2: { name: "AC Milan", logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Logo_of_AC_Milan.svg/1200px-Logo_of_AC_Milan.svg.png', probability: 45 } 
     },
     { 
      id: 'sa2', 
      date: "Sun, May 5", time: "5:00 PM", 
      team1: { name: "AS Roma", logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f7/AS_Roma_logo_%282017%29.svg/1200px-AS_Roma_logo_%282017%29.svg.png', probability: 60 }, 
      team2: { name: "SS Lazio", logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/ce/S.S._Lazio_badge.svg/1200px-S.S._Lazio_badge.svg.png', probability: 40 } 
     },
      { 
      id: 'sa3', 
      date: "Mon, May 6", time: "2:45 PM", 
      team1: { name: "Napoli", logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/SSC_Napoli_2024_%28deep_blue_navy%29.svg/1200px-SSC_Napoli_2024_%28deep_blue_navy%29.svg.png', probability: 50 }, 
      team2: { name: "Inter Milan", logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/FC_Internazionale_Milano_2021.svg/1200px-FC_Internazionale_Milano_2021.svg.png', probability: 50 } 
     },
  ]
};


const getFormattedDate = (): string => {
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return today.toLocaleDateString('en-US', options);
};
const SportlineHomepage = () => {
    
    const [moreSportsMenuVisible, setMoreSportsMenuVisible] = useState(false);
    const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
    const [selectedLeague, setSelectedLeague] = useState(leagues[0]);
    const [leagueOptionsShown, setLeagueOptionsShown] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState(availableLanguages[0]);
    const [languageChoicesPresented, setLanguageChoicesPresented] = useState(false);
    const [displayedMatches, setDisplayedMatches] = useState(allMatchesData[selectedLeague]);
    const [email, setEmail] = useState("");

    
    const openOrCloseMoreSportsMenu = () => {
        setMoreSportsMenuVisible(!moreSportsMenuVisible);
    };

    const [isToastVisible, setIsToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");
    const revealLeagueOptions = () => {
        setLeagueOptionsShown(!leagueOptionsShown);
    };

    const presentLanguageChoices = () => {
        setLanguageChoicesPresented(!languageChoicesPresented);
    };

    
    const moreSportsRef = useRef(null);
    const newsIntervalRef = useRef(null);
    const chooseLeague = (league) => {
        setSelectedLeague(league);
        setLeagueOptionsShown(false);
    };

    const pickLanguage = (language) => {
        setSelectedLanguage(language);
        setLanguageChoicesPresented(false);
        alert(`Changing language to ${language}`);
    };

    const leagueDropdownRef = useRef(null);
    const langDropdownRef = useRef(null);
    const alertForSportChoice = (sportName) => {
        alert(`Changing to ${sportName} news`);
    };

    const notifyAboutRedirection = (sectionName) => {
        alert(`Redirecting to all ${sectionName} news`);
    };

    const processSubscription = (event) => {
        event.preventDefault();
        const emailValue = email.trim();
        if (emailValue === "" || !emailValue.includes("@")) {
            setToastMessage("Please enter a valid email address.");
            setToastType("error");
            setIsToastVisible(true);
            return;
        }
        setToastMessage(`Successfully subscribed with ${emailValue}!`);
        setToastType("success");
        setIsToastVisible(true);
        setEmail("");
    };

    const shareContentNatively = async (title, text = "Check out this audio clip from Sportline!") => {
        if (navigator.share) {
            try {
                await navigator.share({ title: title, text: text });
                console.log("Content shared successfully");
            } catch (error) {
                console.error("Error sharing content:", error);
                if (error.name !== "AbortError") {
                    setToastMessage("Could not share content.");
                    setToastType("error");
                    setIsToastVisible(true);
                }
            }
        } else {
            setToastMessage("Web Share not supported on this browser.");
            setToastType("error");
            setIsToastVisible(true);
        }
    };

    
    const switchToNextNewsItem = () => {
        setCurrentNewsIndex((prevIndex) => (prevIndex + 1) % newsItemsData.length);
        restartNewsTimer();
    };

    const goBackToPreviousNews = () => {
        setCurrentNewsIndex((prevIndex) => (prevIndex - 1 + newsItemsData.length) % newsItemsData.length);
        restartNewsTimer();
    };

    const jumpToNewsItem = (index) => {
        setCurrentNewsIndex(index);
        restartNewsTimer();
    };

    const restartNewsTimer = () => {
        if (newsIntervalRef.current) {
            clearInterval(newsIntervalRef.current);
        }
        newsIntervalRef.current = setInterval(switchToNextNewsItem, 6000);
    };

    
    useEffect(() => {
        setDisplayedMatches(allMatchesData[selectedLeague] || []);
    }, [selectedLeague]);

    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (moreSportsRef.current && !moreSportsRef.current.contains(event.target as Node)) {
                setMoreSportsMenuVisible(false);
            }
        };
        if (moreSportsMenuVisible) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [moreSportsMenuVisible]);

    
    useEffect(() => {
        const handleClickOutsideLeagues = (event) => {
            if (leagueDropdownRef.current && !leagueDropdownRef.current.contains(event.target as Node)) {
                setLeagueOptionsShown(false);
            }
        };
        if (leagueOptionsShown) {
            document.addEventListener("mousedown", handleClickOutsideLeagues);
        }
        if (leagueOptionsShown) {
            document.addEventListener("mousedown", handleClickOutsideLeagues);
        } 
        else {
            document.removeEventListener("mousedown", handleClickOutsideLeagues);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutsideLeagues);
        };
    }, [leagueOptionsShown]); 

    
    useEffect(() => {
        const handleClickOutsideLang = (event) => {
            if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
                setLanguageChoicesPresented(false); 
            }
        };
        if (languageChoicesPresented) {
            document.addEventListener("mousedown", handleClickOutsideLang);
        } 
        else {
            document.removeEventListener("mousedown", handleClickOutsideLang);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutsideLang);
        };
    }, [languageChoicesPresented]); 

    
    useEffect(() => {
        if (isToastVisible) {
            const timer = setTimeout(() => {
                setIsToastVisible(false);
            }, 3000); 
            return () => clearTimeout(timer);
        }
    }, [isToastVisible]);

    
    useEffect(() => {
        restartNewsTimer(); 
        return () => {
            if (newsIntervalRef.current) {
                clearInterval(newsIntervalRef.current);
            }
        };
    }, []);

    const currentNews = newsItemsData[currentNewsIndex];
    const formattedDate = getFormattedDate();

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-roboto relative">
            
            <div className="bg-black text-white text-sm py-2 px-4 md:px-8 flex justify-between items-center">
                <p>
                    Join to{" "}
                    <a href="#" className="underline font-medium cursor-pointer">
                        Sportline
                    </a>
                </p>
                <div className="flex items-center space-x-4">
                    
                    <a href="#" className="hidden md:inline hover:text-gray-300 cursor-pointer">
                        News & Analysis
                    </a>
                    <a href="#" className="hidden md:inline hover:text-gray-300 cursor-pointer">
                        Reach Out
                    </a>
                    <a href="#" className="hidden md:inline hover:text-gray-300 cursor-pointer">
                        Events
                    </a>
                    <a href="#" className="hidden md:inline hover:text-gray-300 cursor-pointer">
                        Subscription
                    </a>
                    
                    <div className="flex items-center space-x-2 border-l border-gray-600 pl-4">
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cursor-pointer hover:text-gray-400"
                        >
                            <Instagram size={18} />
                        </a>
                        <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="cursor-pointer hover:text-gray-400">
                            <X size={18} />
                        </a>
                    </div>
                </div>
            </div>

            
            <header className="py-4 px-4 md:px-8 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-900">
                <div className="text-sm text-gray-600 dark:text-gray-400">{formattedDate}</div>
                <div className="text-3xl font-montserrat font-semibold tracking-tight text-center absolute left-1/2 transform -translate-x-1/2">
                    Sportline
                </div>
                <div ref={langDropdownRef} className="flex items-center space-x-4 relative">
                    <button
                        onClick={presentLanguageChoices} 
                        className="flex items-center text-sm cursor-pointer hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        {selectedLanguage}{" "}
                        <ChevronDown size={16} className={`ml-1 transition-transform ${languageChoicesPresented ? "rotate-180" : ""}`} />{" "}
                        
                    </button>
                    {languageChoicesPresented && ( 
                        <div className="absolute top-full right-0 mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-20">
                            <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                                {availableLanguages.map((lang) => (
                                    <li key={lang}>
                                        <a
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                pickLanguage(lang);
                                            }} 
                                            className={`block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${
                                                selectedLanguage === lang ? "font-semibold text-orange-600 dark:text-orange-400" : ""
                                            }`}
                                        >
                                            {lang}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </header>

            
            <nav className="py-3 px-4 md:px-8 border-b border-gray-200 dark:border-gray-700 md:overflow-visible bg-white dark:bg-gray-900">
                <ul className="flex justify-center items-center space-x-4 sm:space-x-6 md:space-x-8 text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    <li>
                        <button
                            onClick={() => alertForSportChoice("Basketball")}
                            className="hover:text-gray-900 dark:hover:text-white cursor-pointer"
                        >
                            Basketball
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => alertForSportChoice("Tennis")}
                            className="hover:text-gray-900 dark:hover:text-white cursor-pointer"
                        >
                            Tennis
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => alertForSportChoice("Football")}
                            className="text-orange-600 dark:text-orange-400 border-b-2 border-orange-600 dark:border-orange-400 pb-1 cursor-pointer"
                        >
                            Football
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => alertForSportChoice("Golf")}
                            className="hover:text-gray-900 dark:hover:text-white cursor-pointer"
                        >
                            Golf
                        </button>
                    </li>
                    <li className="hidden md:inline-block">
                        <button
                            onClick={() => alertForSportChoice("Volly")}
                            className="hover:text-gray-900 dark:hover:text-white cursor-pointer"
                        >
                            Volly
                        </button>
                    </li>
                    <li className="hidden md:inline-block">
                        <button
                            onClick={() => alertForSportChoice("Badminton")}
                            className="hover:text-gray-900 dark:hover:text-white cursor-pointer"
                        >
                            Badminton
                        </button>
                    </li>
                    <li className="hidden md:inline-block">
                        <button
                            onClick={() => alertForSportChoice("Swimming")}
                            className="hover:text-gray-900 dark:hover:text-white cursor-pointer"
                        >
                            Swimming
                        </button>
                    </li>
                    <li ref={moreSportsRef} className="relative inline-block">
                        <button
                            onClick={openOrCloseMoreSportsMenu} 
                            className="flex items-center hover:text-gray-900 dark:hover:text-white cursor-pointer"
                        >
                            More{" "}
                            <ChevronDown size={16} className={`ml-1 transition-transform ${moreSportsMenuVisible ? "rotate-180" : ""}`} />{" "}
                            
                        </button>
                        {moreSportsMenuVisible && ( 
                            <div className="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
                                <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                                    <li>
                                        <button
                                            onClick={() => alertForSportChoice("Boxing")}
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                        >
                                            Boxing
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => alertForSportChoice("MMA")}
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                        >
                                            MMA
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => alertForSportChoice("F1 Racing")}
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                        >
                                            F1 Racing
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => alertForSportChoice("Cricket")}
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                        >
                                            Cricket
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </li>
                </ul>
            </nav>

            
            <main className="p-4 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    
                    <div>
                        <span className="inline-block bg-gray-800 dark:bg-gray-700 text-white text-xs font-semibold px-3 py-1 rounded mb-4">
                            {currentNews.leagueTag} Today!
                        </span>
                        <h1 className="text-3xl md:text-4xl font-montserrat font-bold mb-3 leading-tight text-gray-900 dark:text-white">
                            {currentNews.title}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 text-base leading-relaxed">{currentNews.description}</p>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6">
                            
                            <span className="w-6 h-6 bg-gray-500 mr-2 rounded"></span>
                            <span className="font-medium mr-auto">{currentNews.source}</span>
                            <div className="flex items-center space-x-4">
                                <span className="flex items-center">
                                    <Clock size={14} className="mr-1" /> {currentNews.readTime} min read
                                </span>
                                <span className="flex items-center">
                                    <MessageSquare size={14} className="mr-1" /> {currentNews.comments} Comments
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            
                            <div className="flex space-x-2">
                                {newsItemsData.map((_, index) => (
                                    <button
                                        key={newsItemsData[index].id}
                                        onClick={() => jumpToNewsItem(index)} 
                                        className={`w-8 h-1 rounded-full cursor-pointer transition-colors ${
                                            index === currentNewsIndex
                                                ? "bg-gray-800 dark:bg-gray-300"
                                                : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                                        }`}
                                    ></button>
                                ))}
                            </div>
                            
                            <div className="flex space-x-2">
                                <button
                                    onClick={goBackToPreviousNews} 
                                    className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                >
                                    <ArrowLeft size={18} />
                                </button>
                                <button
                                    onClick={switchToNextNewsItem} 
                                    className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                >
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    
                    <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden">
                        <img
                            src={currentNews.image}
                            alt={currentNews.title}
                            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out"
                            key={currentNews.id}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        <p className="absolute bottom-4 left-4 text-white text-lg font-semibold font-montserrat">
                            {currentNews.legacyText}
                        </p>
                    </div>
                </div>

                
                <section className="mt-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-montserrat font-semibold text-gray-900 dark:text-white">
                            {selectedLeague} Match Center
                        </h2>
                        <div ref={leagueDropdownRef} className="relative">
                            <button
                                onClick={revealLeagueOptions} 
                                className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                            >
                                {selectedLeague}{" "}
                                <ChevronDown size={16} className={`ml-2 transition-transform ${leagueOptionsShown ? "rotate-180" : ""}`} />{" "}
                                
                            </button>
                            {leagueOptionsShown && ( 
                                <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
                                    <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                                        {leagues.map((league) => (
                                            <li key={league}>
                                                <a
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        chooseLeague(league);
                                                    }} 
                                                    className={`block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${
                                                        selectedLeague === league
                                                            ? "font-semibold text-orange-600 dark:text-orange-400"
                                                            : ""
                                                    }`}
                                                >
                                                    {league}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        
                        {displayedMatches.length > 0 ? (
                            displayedMatches.map((match, index) => (
                                <div
                                    key={match.id}
                                    className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                                >
                                    <p className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">{match.date}</p>
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="flex flex-col items-center w-1/3">
                                            <img
                                                src={match.team1.logoUrl}
                                                alt={`${match.team1.name} Logo`}
                                                className="w-10 h-10 object-contain mb-1"
                                            />
                                            <span className="text-xs font-medium text-center">{match.team1.name}</span>
                                        </div>
                                        <div className="text-center">
                                            <span className="block text-lg font-semibold">{match.time.split(" ")[0]}</span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">{match.time.split(" ")[1]}</span>
                                        </div>
                                        <div className="flex flex-col items-center w-1/3">
                                            <img
                                                src={match.team2.logoUrl}
                                                alt={`${match.team2.name} Logo`}
                                                className="w-10 h-10 object-contain mb-1"
                                            />
                                            <span className="text-xs font-medium text-center">{match.team2.name}</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                        <div
                                            className={`h-1.5 rounded-l-full ${index % 3 === 1 ? "bg-blue-700" : "bg-red-600"}`}
                                            style={{ width: `${match.team1.probability}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                                        <span>{match.team1.probability}%</span>
                                        <span className="font-medium">Win Probability</span>
                                        <span>{match.team2.probability}%</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center col-span-full text-gray-500 dark:text-gray-400 py-4">
                                No matches available for this league yet.
                            </p>
                        )}
                    </div>
                </section>

                
                <section className="mt-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-montserrat font-semibold text-gray-900 dark:text-white">Match Day Voices</h2>
                        <button
                            onClick={() => notifyAboutRedirection("Match Day Voices")} 
                            className="flex items-center text-sm font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-500 cursor-pointer"
                        >
                            Show all <ChevronRight size={16} className="ml-1" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        
                        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg flex items-center space-x-4 border border-gray-200 dark:border-gray-700">
                            
                            <img
                                src="https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=2961&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="Coach Justin"
                                className="w-24 h-24 object-cover rounded-md flex-shrink-0"
                            />
                            <div className="flex-grow">
                                <div className="flex justify-between items-start mb-1">
                                    <div>
                                        <h3 className="font-semibold text-base text-gray-900 dark:text-white leading-tight">
                                            Manchester City's Midfield Masterclass: How Guardiola Dominated Possession
                                        </h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Coach Justin | Football Analyst</p>
                                    </div>
                                    <div className="flex items-center space-x-2 flex-shrink-0">
                                        <Info
                                            size={16}
                                            className="text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-white"
                                        />
                                        <button
                                            onClick={() =>
                                                shareContentNatively(
                                                    "Manchester City's Midfield Masterclass: How Guardiola Dominated Possession"
                                                )
                                            } 
                                            className="text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-white p-1 -m-1 rounded-md"
                                        >
                                            <Share2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                    <span>15:50</span>
                                    <div className="flex items-center space-x-3">
                                        <SkipBack size={18} className="cursor-pointer hover:text-gray-700 dark:hover:text-white" />
                                        <Play size={20} className="cursor-pointer hover:text-gray-700 dark:hover:text-white" />{" "}
                                        
                                        <SkipForward size={18} className="cursor-pointer hover:text-gray-700 dark:hover:text-white" />
                                    </div>
                                    <span>30:34</span>
                                </div>
                                
                                <div className="w-full h-6 bg-gray-200 dark:bg-gray-700 mt-2 rounded flex items-end space-x-px overflow-hidden">
                                    
                                    <span className="bg-orange-500 h-full" style={{ width: "2px" }}></span>
                                    <span className="bg-orange-500 h-3/4" style={{ width: "2px" }}></span>
                                    <span className="bg-orange-500 h-1/2" style={{ width: "2px" }}></span>
                                    <span className="bg-orange-500 h-1/4" style={{ width: "2px" }}></span>
                                    <span className="bg-gray-300 dark:bg-gray-600 h-1/4" style={{ width: "2px" }}></span>
                                    <span className="bg-gray-300 dark:bg-gray-600 h-1/4" style={{ width: "2px" }}></span>
                                    <span className="bg-gray-300 dark:bg-gray-600 h-1/4" style={{ width: "2px" }}></span>
                                    <span className="bg-gray-300 dark:bg-gray-600 h-1/4" style={{ width: "2px" }}></span>
                                    
                                </div>
                            </div>
                        </div>

                        
                        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg flex items-center space-x-4 border border-gray-200 dark:border-gray-700">
                            
                            <img
                                src="https://plus.unsplash.com/premium_photo-1671489203034-fc619a2de3bf?q=80&w=2003&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="Thierry Henry"
                                className="w-24 h-24 object-cover rounded-md flex-shrink-0"
                            />
                            <div className="flex-grow">
                                <div className="flex justify-between items-start mb-1">
                                    <div>
                                        <h3 className="font-semibold text-base text-gray-900 dark:text-white leading-tight">
                                            Real Madrid's Comeback Mentality: Why They're Never Truly Beaten
                                        </h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Thierry Henry | Former France International
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2 flex-shrink-0">
                                        <Info
                                            size={16}
                                            className="text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-white"
                                        />
                                        <button
                                            onClick={() =>
                                                shareContentNatively("Real Madrid's Comeback Mentality: Why They're Never Truly Beaten")
                                            } 
                                            className="text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-white p-1 -m-1 rounded-md"
                                        >
                                            <Share2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                    <span>15:50</span>
                                    <div className="flex items-center space-x-3">
                                        <SkipBack size={18} className="cursor-pointer hover:text-gray-700 dark:hover:text-white" />
                                        <Play size={20} className="cursor-pointer hover:text-gray-700 dark:hover:text-white" />
                                        <SkipForward size={18} className="cursor-pointer hover:text-gray-700 dark:hover:text-white" />
                                    </div>
                                    <span>30:34</span>
                                </div>
                                
                                <div className="w-full h-6 bg-gray-200 dark:bg-gray-700 mt-2 rounded flex items-end space-x-px overflow-hidden">
                                    <span className="bg-orange-500 h-full" style={{ width: "2px" }}></span>
                                    <span className="bg-orange-500 h-1/2" style={{ width: "2px" }}></span>
                                    <span className="bg-gray-300 dark:bg-gray-600 h-1/4" style={{ width: "2px" }}></span>
                                    <span className="bg-gray-300 dark:bg-gray-600 h-1/4" style={{ width: "2px" }}></span>
                                    
                                </div>
                            </div>
                        </div>

                        
                        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg flex items-center space-x-4 border border-gray-200 dark:border-gray-700">
                            
                            <img
                                src="https://images.unsplash.com/photo-1486286701208-1d58e9338013?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="Julien Laurens"
                                className="w-24 h-24 object-cover rounded-md flex-shrink-0"
                            />
                            <div className="flex-grow">
                                <div className="flex justify-between items-start mb-1">
                                    <div>
                                        <h3 className="font-semibold text-base text-gray-900 dark:text-white leading-tight">
                                            Is Bayern Still a UCL Threat? Tactical Concerns and Bright Spots
                                        </h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Julien Laurens | European Football Expert
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2 flex-shrink-0">
                                        <Info
                                            size={16}
                                            className="text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-white"
                                        />
                                        <button
                                            onClick={() =>
                                                shareContentNatively("Is Bayern Still a UCL Threat? Tactical Concerns and Bright Spots")
                                            } 
                                            className="text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-white p-1 -m-1 rounded-md"
                                        >
                                            <Share2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                    <span>15:50</span>
                                    <div className="flex items-center space-x-3">
                                        <SkipBack size={18} className="cursor-pointer hover:text-gray-700 dark:hover:text-white" />
                                        <Play size={20} className="cursor-pointer hover:text-gray-700 dark:hover:text-white" />
                                        <SkipForward size={18} className="cursor-pointer hover:text-gray-700 dark:hover:text-white" />
                                    </div>
                                    <span>30:34</span>
                                </div>
                                
                                <div className="w-full h-6 bg-gray-200 dark:bg-gray-700 mt-2 rounded flex items-end space-x-px overflow-hidden">
                                    <span className="bg-orange-500 h-3/4" style={{ width: "2px" }}></span>
                                    <span className="bg-orange-500 h-1/4" style={{ width: "2px" }}></span>
                                    <span className="bg-orange-500 h-1/2" style={{ width: "2px" }}></span>
                                    <span className="bg-gray-300 dark:bg-gray-600 h-1/4" style={{ width: "2px" }}></span>
                                    <span className="bg-gray-300 dark:bg-gray-600 h-1/4" style={{ width: "2px" }}></span>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                
                <section className="mt-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-montserrat font-semibold text-gray-900 dark:text-white">Top Stories this week</h2>
                        <button
                            onClick={() => notifyAboutRedirection("Top Stories")} 
                            className="flex items-center text-sm font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-500 cursor-pointer"
                        >
                            Show all <ChevronRight size={16} className="ml-1" />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        
                        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 group hover:shadow-md transition-shadow duration-200 cursor-pointer">
                            
                            <img
                                src="https://plus.unsplash.com/premium_photo-1664297688755-84ecc3f6a0f7?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="Mbappe joins Real Madrid"
                                className="w-full h-40 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="font-semibold text-base mb-2 text-gray-900 dark:text-white leading-tight group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-150">
                                    Kylian Mbappé Officially Joins Real Madrid
                                </h3>
                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-3">
                                    
                                    <span className="w-4 h-4 bg-black rounded-full"></span>
                                    <span>Bleacher Report</span>
                                    <span className="flex items-center">
                                        <MessageCircle size={12} className="mr-1" /> 20 Comments
                                    </span>
                                    <span className="flex items-center">
                                        <Clock size={12} className="mr-1" /> 12 min read
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 group hover:shadow-md transition-shadow duration-200 cursor-pointer">
                            
                            <img
                                src="https://images.unsplash.com/photo-1605002713581-123e77bcf83d?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="VAR Controversy"
                                className="w-full h-40 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="font-semibold text-base mb-2 text-gray-900 dark:text-white leading-tight group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-150">
                                    VAR Controversy Erupts in Champions League Semifinal
                                </h3>
                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-3">
                                    
                                    <span className="w-4 h-4 bg-blue-500 rounded-full"></span>
                                    <span>Kompas</span>
                                    <span className="flex items-center">
                                        <MessageCircle size={12} className="mr-1" /> 20 Comments
                                    </span>
                                    <span className="flex items-center">
                                        <Clock size={12} className="mr-1" /> 12 min read
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 group hover:shadow-md transition-shadow duration-200 cursor-pointer">
                            
                            <img
                                src="https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="Man City wins title"
                                className="w-full h-40 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="font-semibold text-base mb-2 text-gray-900 dark:text-white leading-tight group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-150">
                                    Manchester City Clinches Premier League Title in Style
                                </h3>
                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-3">
                                    
                                    <span className="w-4 h-4 bg-red-600 rounded-full"></span>
                                    <span>Sky Sport</span>
                                    <span className="flex items-center">
                                        <MessageCircle size={12} className="mr-1" /> 20 Comments
                                    </span>
                                    <span className="flex items-center">
                                        <Clock size={12} className="mr-1" /> 12 min read
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                
                <section className="mt-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-montserrat font-semibold text-gray-900 dark:text-white">Popular Highlight Match</h2>
                        <button
                            onClick={() => notifyAboutRedirection("Popular Highlight Match")} 
                            className="flex items-center text-sm font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-500 cursor-pointer"
                        >
                            Show all <ChevronRight size={16} className="ml-1" />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        <div className="lg:col-span-2 group cursor-pointer">
                            <div className="relative w-full aspect-video bg-gray-300 dark:bg-gray-600 rounded-lg overflow-hidden mb-4 group-hover:shadow-lg transition-shadow duration-200">
                                
                                <img
                                    src="https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?q=80&w=2962&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                    alt="Man City highlight"
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                    <PlayCircle size={64} className="text-white opacity-80 cursor-pointer hover:opacity-100" />
                                </div>
                            </div>
                            <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-white leading-tight">
                                Manchester City Clinches Premier League Title in Style After Dominant Campaign
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                Manchester City secured their fourth consecutive Premier League title with a convincing 3–1 win over West
                                Ham. Goals from Foden and Haaland sealed the victory, making history yet again under Pep Guardiola.
                            </p>
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                <Clock size={12} className="mr-1" /> 5 min watchtime
                            </div>
                        </div>

                        
                        <div className="space-y-1">
                            {" "}
                            
                            
                            <div className="flex items-center space-x-3 cursor-pointer group p-2 -m-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-150">
                                <div className="relative w-28 h-16 bg-gray-300 dark:bg-gray-600 rounded-md overflow-hidden flex-shrink-0">
                                    
                                    <img
                                        src="https://images.unsplash.com/photo-1504305754058-2f08ccd89a0a?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                        alt="Liverpool highlight"
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                        <PlayCircle size={24} className="text-white opacity-70 group-hover:opacity-100" />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 leading-tight">
                                        Liverpool's Late Comeback Stuns Tottenham at Anfield
                                    </h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        <Clock size={10} className="inline mr-1" /> 5 min watchtime
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-3 cursor-pointer group p-2 -m-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-150">
                                <div className="relative w-28 h-16 bg-gray-300 dark:bg-gray-600 rounded-md overflow-hidden flex-shrink-0">
                                    
                                    <img
                                        src="https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?q=80&w=2962&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                        alt="Arsenal highlight"
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                        <PlayCircle size={24} className="text-white opacity-70 group-hover:opacity-100" />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 leading-tight">
                                        Arsenal Thrash Chelsea 4-1 in London Derby Masterclass
                                    </h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        <Clock size={10} className="inline mr-1" /> 5 min watchtime
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-3 cursor-pointer group p-2 -m-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-150">
                                <div className="relative w-28 h-16 bg-gray-300 dark:bg-gray-600 rounded-md overflow-hidden flex-shrink-0">
                                    
                                    <img
                                        src="https://images.unsplash.com/photo-1520215838868-1f34e8029665?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                        alt="Max Verstappen"
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                        <PlayCircle size={24} className="text-white opacity-70 group-hover:opacity-100" />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 leading-tight">
                                        Max Verstappen Dominates Again - F1 Highlights
                                    </h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        <Clock size={10} className="inline mr-1" /> 5 min watchtime
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                
                <section className="mt-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-montserrat font-semibold text-gray-900 dark:text-white">Editor Picks</h2>
                        <button
                            onClick={() => notifyAboutRedirection("Editor Picks")} 
                            className="flex items-center text-sm font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-500 cursor-pointer"
                        >
                            Show all <ChevronRight size={16} className="ml-1" />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 group hover:shadow-md transition-shadow duration-200 cursor-pointer">
                            
                            <img
                                src="https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="Barcelona vs Real Madrid"
                                className="w-full h-52 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white leading-tight group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-150">
                                    Barcelona Beat Real Madrid in a Three-Goal Thriller to Take Control of La Liga Title Race
                                </h3>
                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-3">
                                    
                                    <span className="w-4 h-4 bg-red-700 rounded-full"></span>
                                    <span>BBC News</span>
                                    <span className="flex items-center">
                                        <Clock size={12} className="ml-2 mr-1" /> 18 min read
                                    </span>
                                    <span className="flex items-center">
                                        <MessageCircle size={12} className="mr-1" /> 18 Comments
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 group hover:shadow-md transition-shadow duration-200 cursor-pointer">
                            
                            <img
                                src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=3072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="Leverkusen title"
                                className="w-full h-52 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white leading-tight group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-150">
                                    Leverkusen Make History with Bundesliga Title After Stunning Rise to the Top
                                </h3>
                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-3">
                                    
                                    <span className="w-4 h-4 bg-blue-400 rounded-full"></span>
                                    <span>Detik Sport</span>
                                    <span className="flex items-center">
                                        <Clock size={12} className="ml-2 mr-1" /> 9 min read
                                    </span>
                                    <span className="flex items-center">
                                        <MessageCircle size={12} className="mr-1" /> 18 Comments
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                
                <section className="mt-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-montserrat font-semibold text-gray-900 dark:text-white">Other Sports Highlights</h2>
                        <button
                            onClick={() => notifyAboutRedirection("Other Sports Highlights")} 
                            className="flex items-center text-sm font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-500 cursor-pointer"
                        >
                            Show all <ChevronRight size={16} className="ml-1" />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        
                        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 group hover:shadow-md transition-shadow duration-200 cursor-pointer">
                            
                            <img
                                src="https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=2980&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="Basketball action"
                                className="w-full h-32 object-cover"
                            />
                            <div className="p-3">
                                <h3 className="font-semibold text-sm mb-1.5 text-gray-900 dark:text-white leading-tight group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-150">
                                    A Slam Above the Rim – Basketball Action Worldwide
                                </h3>
                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-3">
                                    
                                    <span className="w-4 h-4 bg-purple-600 rounded-full"></span>
                                    <span>IDN Times</span>
                                    <span className="flex items-center">
                                        <MessageCircle size={12} className="mr-1" /> 20 Comments
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    <Clock size={10} className="inline mr-1" /> 12 min read
                                </p>
                            </div>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 group hover:shadow-md transition-shadow duration-200 cursor-pointer">
                            
                            <img
                                src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="Novak Djokovic"
                                className="w-full h-32 object-cover"
                            />
                            <div className="p-3">
                                <h3 className="font-semibold text-sm mb-1.5 text-gray-900 dark:text-white leading-tight group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-150">
                                    Novak Djokovic Secures Another Grand Slam Title
                                </h3>
                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-3">
                                    
                                    <span className="w-4 h-4 bg-green-500 rounded-full"></span>
                                    <span>Okezone</span>
                                    <span className="flex items-center">
                                        <MessageCircle size={12} className="mr-1" /> 20 Comments
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    <Clock size={10} className="inline mr-1" /> 12 min read
                                </p>
                            </div>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 group hover:shadow-md transition-shadow duration-200 cursor-pointer">
                            
                            <img
                                src="https://images.unsplash.com/photo-1520215838868-1f34e8029665?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="Max Verstappen"
                                className="w-full h-32 object-cover"
                            />
                            <div className="p-3">
                                <h3 className="font-semibold text-sm mb-1.5 text-gray-900 dark:text-white leading-tight group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-150">
                                    Max Verstappen Dominates Again - F1 Highlights
                                </h3>
                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-3">
                                    
                                    <span className="w-4 h-4 bg-red-700 rounded-full"></span>
                                    <span>BBC News</span>
                                    <span className="flex items-center">
                                        <MessageCircle size={12} className="mr-1" /> 20 Comments
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    <Clock size={10} className="inline mr-1" /> 12 min read
                                </p>
                            </div>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 group hover:shadow-md transition-shadow duration-200 cursor-pointer">
                            
                            <img
                                src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="Badminton action"
                                className="w-full h-32 object-cover"
                            />
                            <div className="p-3">
                                <h3 className="font-semibold text-sm mb-1.5 text-gray-900 dark:text-white leading-tight group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-150">
                                    Indonesia Shines in Badminton World Champio.....
                                </h3>
                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-3">
                                    
                                    <span className="w-4 h-4 bg-blue-500 rounded-full"></span>
                                    <span>Kompas</span>
                                    <span className="flex items-center">
                                        <MessageCircle size={12} className="mr-1" /> 12 Comments
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    <Clock size={10} className="inline mr-1" /> 12 min read
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            
            <footer className="bg-gray-900 dark:bg-black text-gray-400 pt-16 pb-8 px-4 md:px-8 mt-16">
                <div className="max-w-6xl mx-auto">
                    
                    <div className="text-center mb-12">
                        <h2 className="text-2xl font-montserrat font-semibold text-white mb-2">Subscribe our newsletter</h2>
                        <p className="text-sm mb-4">Get the latest updates on sports news, match highlights, and exclusive interviews.</p>
                        <form onSubmit={processSubscription} className="flex justify-center">
                            {" "}
                            
                            <input
                                type="email"
                                placeholder="youremail@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="px-4 py-2 w-full max-w-sm bg-gray-800 dark:bg-gray-700 text-white rounded-l-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            <button
                                type="submit"
                                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-2 rounded-r-md cursor-pointer"
                            >
                                Send
                            </button>
                        </form>
                    </div>

                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
                        
                        <div>
                            <h3 className="text-lg font-montserrat font-semibold text-white mb-3">Sportline</h3>
                            <p className="text-sm">Your daily dose of sports insights</p>
                        </div>
                        
                        <div>
                            <h4 className="font-semibold text-white mb-3">About</h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a href="#" className="hover:text-white cursor-pointer">
                                        About us
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white cursor-pointer">
                                        Careers
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white cursor-pointer">
                                        Press
                                    </a>
                                </li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 className="font-semibold text-white mb-3">Resources</h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a href="#" className="hover:text-white cursor-pointer">
                                        Contact
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white cursor-pointer">
                                        Help Center
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white cursor-pointer">
                                        Report Issue
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white cursor-pointer">
                                        Community
                                    </a>
                                </li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 className="font-semibold text-white mb-3">Coverage</h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a href="#" className="hover:text-white cursor-pointer">
                                        Live Scores
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white cursor-pointer">
                                        Match Highlights
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white cursor-pointer">
                                        Player Stats
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white cursor-pointer">
                                        Interviews
                                    </a>
                                </li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 className="font-semibold text-white mb-3">Legal</h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a href="#" className="hover:text-white cursor-pointer">
                                        Cookie Policy
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white cursor-pointer">
                                        Sitemap
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    
                    <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center text-sm">
                        <p>&copy; Copyright @ 2025 Sportline. All rights reserved.</p>
                        <div className="flex space-x-4 mt-4 md:mt-0">
                            <a href="#" className="hover:text-white cursor-pointer">
                                Terms & Conditions
                            </a>
                            <a href="#" className="hover:text-white cursor-pointer">
                                Privacy Policy
                            </a>
                        </div>
                    </div>
                </div>
            </footer>

            
            {isToastVisible && (
                <div
                    className={`fixed bottom-5 right-5 z-50 p-4 rounded-md shadow-lg flex items-center space-x-3 \
             ${
                 toastType === "success"
                     ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 border border-green-300 dark:border-green-700"
                     : ""
             } \
             ${
                 toastType === "error"
                     ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 border border-red-300 dark:border-red-700"
                     : ""
             }
             animate-fade-in-up`} 
                >
                    {toastType === "success" && <CheckCircle className="w-5 h-5" />}
                    {toastType === "error" && <XCircle className="w-5 h-5" />}
                    <span className="text-sm font-medium">{toastMessage}</span>
                    <button
                        onClick={() => setIsToastVisible(false)}
                        className="ml-auto -mr-1 -my-1 p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10"
                    >
                        <XCircle className="w-4 h-4 opacity-70" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default SportlineHomepage;
