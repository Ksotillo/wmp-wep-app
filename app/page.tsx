'use client';

import React, { useState, useEffect, useRef, ComponentType, useMemo } from 'react';
import Image from 'next/image';
import { Home, Leaf, Trophy, Music2, List, LayoutGrid, Bell, Sparkles, Clock, Play, Heart, ArrowRight, Zap, BookOpen, Dumbbell, Search, Mic, ChevronLeft, ChevronRight, Hourglass, Star, Smile, Plus, SlidersHorizontal, BedDouble, Target, AlertTriangle, CheckCircle, Angry, Frown, Meh, Laugh, MoreHorizontal, MessageSquare, Archive, MessageCircle, BrainCircuit, ArrowUp, Sun, Moon, X, Info, Coffee, Utensils, Bed } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Montserrat, Roboto } from 'next/font/google';

// Instantiate fonts
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
});

// Define tab names type
type TabName = 'Activity' | 'Mood' | 'Food' | 'Sleep';
type Theme = 'light' | 'dark';
type NavItemName = 'Home' | 'Wellness' | 'Achievements' | 'Music' | 'Activities';
type Notification = {
  id: number;
  type: 'success' | 'warning' | 'info';
  title: string;
  message: string;
  time: string;
};

// Types for new component props
type MainActivityCardProps = {
  imageUrl: string;
  icon: ComponentType<{ className?: string }>;
  iconBgClass: string;
  iconColorClass: string;
  duration: string;
  title: string;
  description: string;
  onPlay: () => void;
};

type FavoriteItem = {
  id: string;
  icon: ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  title: string;
  author: string;
  time: string;
};

type FavoritesListProps = {
  title: string;
  items: FavoriteItem[];
  onPlayFavorite: (id: string, title: string) => void;
};

type DailyMoodName = 'Good' | 'Stressed' | 'Angry' | 'Shied' | 'Meh';

type CheckInData = { target: number; achieved: number };

type DailyMoodLog = {
    day: number;
    month: string;
    dayName: string;
    icon: ComponentType<{ className?: string }>;
   
    bgColorClass?: string;
    colorClass?: string;
    secondary?: boolean;
};

// Main Page Component
const MindMateDashboard = () => {

 
  const [activeTab, setActiveTab] = useState<TabName>('Activity');
 
  const [theme, setTheme] = useState<Theme>('light');
 
  const [activeNavItem, setActiveNavItem] = useState<NavItemName>('Home');
 
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
 
  const [selectedDailyMood, setSelectedDailyMood] = useState<DailyMoodName>('Good');
 
  const [isMoodHistoryDropdownOpen, setIsMoodHistoryDropdownOpen] = useState(false);
 
  const [selectedDay, setSelectedDay] = useState<number>(2);
 
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);

 
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const moodHistoryTriggerRef = useRef<HTMLButtonElement>(null);
  const moodHistoryPanelRef = useRef<HTMLDivElement>(null);
 
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchPanelRef = useRef<HTMLDivElement>(null);

 
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
  }, []);
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
     
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
    };
    if (isNotificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

   
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationsOpen]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        moodHistoryTriggerRef.current &&
        !moodHistoryTriggerRef.current.contains(event.target as Node) &&
        moodHistoryPanelRef.current &&
        !moodHistoryPanelRef.current.contains(event.target as Node)
      ) {
        setIsMoodHistoryDropdownOpen(false);
      }
    };
    if (isMoodHistoryDropdownOpen) { document.addEventListener('mousedown', handleClickOutside); }
    return () => { document.removeEventListener('mousedown', handleClickOutside); };
  }, [isMoodHistoryDropdownOpen]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node) &&
        searchPanelRef.current &&
        !searchPanelRef.current.contains(event.target as Node)
      ) {
        setIsSearchDropdownOpen(false);
      }
    };
    if (isSearchDropdownOpen) { document.addEventListener('mousedown', handleClickOutside); }
    return () => { document.removeEventListener('mousedown', handleClickOutside); };
  }, [isSearchDropdownOpen]);
  const iconStyle = "w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-400 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors cursor-pointer";
  const handlePlayFavorite = (id: string, title: string) => {
    console.log(`Playing favorite ID: ${id}, Title: ${title}`);
  };
  const handleAddMood = () => {
    console.log('Add Mood button clicked');
  };
  const handleSaveMood = () => {
    alert('Saving Mood for today');
    console.log(`Saved Mood: ${selectedDailyMood}`);
  };
  const handleMainPlay = (title: string) => {
    console.log(`Playing main activity: ${title}`);
  };
  const handleSelectMoodIcon = (moodName: DailyMoodName) => {
    console.log(`Selected mood icon: ${moodName}`);
    setSelectedDailyMood(moodName);
    const icons = document.querySelectorAll('[data-mood-icon]');
    icons.forEach(icon => icon.classList.remove('ring-2', 'ring-offset-2', 'ring-lime-400', 'dark:ring-offset-gray-800'));
    const selected = document.querySelector(`[data-mood-icon="${moodName}"]`);
    selected?.classList.add('ring-2', 'ring-offset-2', 'ring-lime-400', 'dark:ring-offset-gray-800');
  };
  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };
  const toggleMoodHistoryDropdown = () => {
    setIsMoodHistoryDropdownOpen(!isMoodHistoryDropdownOpen);
  };
  const navItems = [
    { name: 'Home', Icon: Home },
    { name: 'Wellness', Icon: Leaf },
    { name: 'Achievements', Icon: Trophy },
    { name: 'Music', Icon: Music2 },
    { name: 'Activities', Icon: List },
  ] as const;

 
  const notificationsData: Notification[] = [
    { id: 1, type: 'success', title: 'Goal Achieved!', message: 'You completed your 8h sleep goal.', time: '5m ago' },
    { id: 2, type: 'warning', title: 'Low Activity', message: 'Your activity level was low yesterday.', time: '1h ago' },
    { id: 3, type: 'info', title: 'New Meditation Available', message: 'Try the new "Ocean Waves" session.', time: '3h ago' },
    { id: 4, type: 'success', title: 'Focus Streak', message: '3 days focus time streak!', time: '1d ago' },
    { id: 5, type: 'info', title: 'Weekly Summary Ready', message: 'Your wellness summary is available.', time: '2d ago' },
  ];
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info': return <Info className="w-5 h-5 text-blue-500" />;
      default: return null;
    }
  };
  const activityCardData: MainActivityCardProps = {
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=3020&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    icon: Sparkles, iconBgClass: "bg-white/50 dark:bg-black/30", iconColorClass: "text-pink-500 dark:text-pink-400",
    duration: "8 min", title: "Calm the Racing Mind", description: "Immerse yourself in peace and harmony with this short meditation.",
    onPlay: () => handleMainPlay("Calm the Racing Mind"),
  };
  const activityFavorites: FavoriteItem[] = [
    { id: 'fav-act-1', icon: Zap, title: "Daily Motivation", author: "Valeria Luxor", time: "3:20/10:12", iconBg: "bg-yellow-100 dark:bg-yellow-900/50", iconColor: "text-yellow-600 dark:text-yellow-400" },
    { id: 'fav-act-2', icon: BookOpen, title: "Book Reading Secrets", author: "Valeria Luxor", time: "3:20/10:12", iconBg: "bg-blue-100 dark:bg-blue-900/50", iconColor: "text-blue-600 dark:text-blue-400" },
    { id: 'fav-act-3', icon: Dumbbell, title: "Physical Exercises is Must Have", author: "Valeria Luxor", time: "3:20/10:12", iconBg: "bg-green-100 dark:bg-green-900/50", iconColor: "text-green-600 dark:text-green-400" }
  ];
  const moodCardData: MainActivityCardProps = {
      imageUrl:
          "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      icon: Smile,
      iconBgClass: "bg-purple-100 dark:bg-purple-900/50",
      iconColorClass: "text-purple-600 dark:text-purple-400",
      duration: "5 min",
      title: "Mindful Breathing",
      description: "Focus on your breath to center yourself.",
      onPlay: () => handleMainPlay("Mindful Breathing"),
  };
  const moodFavorites: FavoriteItem[] = [
    { id: 'fav-mood-1', icon: Meh, title: "Neutral Observation", author: "Journal", time: "2 entries", iconBg: "bg-gray-100 dark:bg-gray-700", iconColor: "text-gray-500 dark:text-gray-400" },
    { id: 'fav-mood-2', icon: Smile, title: "Gratitude Practice", author: "Guided", time: "10 min", iconBg: "bg-yellow-100 dark:bg-yellow-900/50", iconColor: "text-yellow-600 dark:text-yellow-400" },
  ];
  const foodCardData: MainActivityCardProps = {
      imageUrl:
          "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=3181&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      icon: Utensils,
      iconBgClass: "bg-orange-100 dark:bg-orange-900/50",
      iconColorClass: "text-orange-600 dark:text-orange-400",
      duration: "Recipe",
      title: "Mindful Eating Guide",
      description: "Learn to savor your meals and listen to your body.",
      onPlay: () => handleMainPlay("Mindful Eating Guide"),
  };
  const foodFavorites: FavoriteItem[] = [
    { id: 'fav-food-1', icon: Coffee, title: "Morning Hydration", author: "Reminder", time: "Daily", iconBg: "bg-blue-100 dark:bg-blue-900/50", iconColor: "text-blue-600 dark:text-blue-400" },
    { id: 'fav-food-2', icon: Leaf, title: "Healthy Lunch Ideas", author: "Recipe Book", time: "View", iconBg: "bg-green-100 dark:bg-green-900/50", iconColor: "text-green-600 dark:text-green-400" },
  ];
  const sleepCardData: MainActivityCardProps = {
      imageUrl:
          "https://images.unsplash.com/photo-1520206183501-b80df61043c2?q=80&w=3271&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      icon: Bed,
      iconBgClass: "bg-indigo-100 dark:bg-indigo-900/50",
      iconColorClass: "text-indigo-600 dark:text-indigo-400",
      duration: "15 min",
      title: "Progressive Relaxation",
      description: "Relax your body from head to toe for better sleep.",
      onPlay: () => handleMainPlay("Progressive Relaxation"),
  };
  const sleepFavorites: FavoriteItem[] = [
      { id: 'fav-sleep-1', icon: Music2, title: "Calming Sleep Sounds", author: "Playlist", time: "View", iconBg: "bg-teal-100 dark:bg-teal-900/50", iconColor: "text-teal-600 dark:text-teal-400" },
  ]; 
  const checkInDataByDay: Record<number, CheckInData> = {
    30: { target: 8, achieved: 7 },
    31: { target: 8, achieved: 6 },
    1: { target: 8, achieved: 7.5 },
    2: { target: 8, achieved: 6.5 },
    3: { target: 8, achieved: 8 },
    4: { target: 8, achieved: 5.5 },
    5: { target: 8, achieved: 7 },
  };
  const availableDays = [30, 31, 1, 2, 3, 4, 5];
  const moodsForWeek: DailyMoodLog[] = [
    { day: 30, month: 'Mar', dayName: 'Mon', icon: Angry, bgColorClass: 'bg-red-100 dark:bg-red-900/50', colorClass: 'text-red-600 dark:text-red-400' },
    { day: 31, month: 'Mar', dayName: 'Tue', icon: Frown, secondary: true, bgColorClass: 'bg-orange-100 dark:bg-orange-900/50', colorClass: 'text-orange-600 dark:text-orange-400' },
    { day: 1, month: 'Apr', dayName: 'Wed', icon: Meh, bgColorClass: 'bg-blue-100 dark:bg-blue-900/50', colorClass: 'text-blue-600 dark:text-blue-400' },
    { day: 2, month: 'Apr', dayName: 'Thr', icon: Smile, secondary: true, bgColorClass: 'bg-pink-100 dark:bg-pink-900/50', colorClass: 'text-pink-600 dark:text-pink-400' },
    { day: 3, month: 'Apr', dayName: 'Fri', icon: Smile, bgColorClass: 'bg-green-100 dark:bg-green-900/50', colorClass: 'text-green-600 dark:text-green-400' },
    { day: 4, month: 'Apr', dayName: 'Sat', icon: Laugh, bgColorClass: 'bg-yellow-100 dark:bg-yellow-900/50', colorClass: 'text-yellow-600 dark:text-yellow-400' },
    { day: 5, month: 'Apr', dayName: 'Sun', icon: Smile, secondary: true, bgColorClass: 'bg-purple-100 dark:bg-purple-900/50', colorClass: 'text-purple-600 dark:text-purple-400' },
  ];
  const mockSearchableItems = [
    'Daily Motivation', 'Sleep Analysis', 'Mood History', 'Mindful Breathing',
    'Add Food Entry', 'Focus Timer Settings', 'Saved Favorites', 'Profile Settings',
    'Book Reading Secrets', 'Physical Exercises', 'Emotional Check-ins', 'Activity Suggestions'
  ];

 
  const currentCheckInData = useMemo(() => {
    return checkInDataByDay[selectedDay] || { target: 8, achieved: 0 };
  }, [selectedDay]);

  const sleepMissing = Math.max(0, currentCheckInData.target - currentCheckInData.achieved);
  const emotionalCheckinPieData = useMemo(() => {
    const { target, achieved } = currentCheckInData;
    const achievedValue = Math.min(achieved, target);
    const missingValue = Math.max(0, target - achieved);

   
    const scale = 50;
    return [
      { name: 'Achieved', value: achievedValue * scale },
      { name: 'Missing', value: missingValue * scale },
      { name: 'Buffer', value: 2 * scale },
     
    ];
  }, [currentCheckInData]);

  const emotionalCheckinPieColors = ['#22c55e', '#facc15', '#a3e635'];
  const MainActivityCard: React.FC<MainActivityCardProps> = ({ imageUrl, icon: Icon, iconBgClass, iconColorClass, duration, title, description, onPlay }) => {
    return (
      <div className="relative bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/50 dark:to-purple-900/50 p-4 sm:p-6 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between h-[300px] sm:h-[250px]">
        <div className="flex justify-between items-start z-10">
          <div className={`p-2 ${iconBgClass} rounded-full backdrop-blur-sm bg-opacity-50 dark:bg-opacity-30`}> 
            <Icon className={`w-5 h-5 ${iconColorClass}`} />
          </div>
          <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-black/40 dark:bg-black/60 rounded-full text-white text-xs sm:text-sm font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>{duration}</span>
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute inset-0 z-0 opacity-40 dark:opacity-30">
            <Image src={imageUrl} alt={`${title} background`} layout="fill" objectFit="cover" />
          </div>
          <button onClick={onPlay} className="relative z-10 p-3 sm:p-4 bg-white/80 dark:bg-black/60 rounded-full text-purple-600 dark:text-purple-300 hover:bg-white dark:hover:bg-black/80 transition-colors cursor-pointer backdrop-blur-sm shadow-md" aria-label={`Play ${title}`} tabIndex={0}>
            <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
          </button>
        </div>
        <div className="relative text-center z-10 pb-2">
          <h3 className={`${montserrat.className} text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-1`}>{title}</h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 px-4">{description}</p>
        </div>
      </div>
    );
  };
  const FavoritesList: React.FC<FavoritesListProps> = ({ title, items, onPlayFavorite }) => {
    return (
      <div>
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h2 className={`${montserrat.className} text-xl font-semibold flex items-center gap-2`}>
            <Heart className="w-5 h-5 text-red-500 dark:text-red-400" />
            {title}
          </h2>
          <ArrowRight className="w-5 h-5 text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 transition-colors" />
        </div>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-xl shadow-sm flex items-center justify-between space-x-3 sm:space-x-4 cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 sm:space-x-4 flex-grow">
                <div className={`p-2 sm:p-3 ${item.iconBg} rounded-lg`}>
                  <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${item.iconColor}`} />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-medium text-gray-800 dark:text-gray-100">{item.title}</h4>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{item.author}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 sm:space-x-4 flex-shrink-0">
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-mono">{item.time}</span>
                <button
                  onClick={() => onPlayFavorite(item.id, item.title)}
                  className="p-1.5 sm:p-2 bg-lime-100 dark:bg-lime-900/50 rounded-full text-lime-700 dark:text-lime-500 hover:bg-lime-200 dark:hover:bg-lime-800/50 transition-colors cursor-pointer flex items-center justify-center"
                  aria-label={`Play ${item.title}`}
                >
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No favorites in this category yet.</p>
          )}
        </div>
      </div>
    );
  };

 
  const renderTabContent = () => {
    let cardProps: MainActivityCardProps;
    let favProps: FavoritesListProps;

    switch (activeTab) {
      case 'Mood':
        cardProps = moodCardData;
        favProps = { title: 'Mood Tools', items: moodFavorites, onPlayFavorite: handlePlayFavorite };
        break;
      case 'Food':
        cardProps = foodCardData;
        favProps = { title: 'Nutrition Favorites', items: foodFavorites, onPlayFavorite: handlePlayFavorite };
        break;
      case 'Sleep':
        cardProps = sleepCardData;
        favProps = { title: 'Sleep Aids', items: sleepFavorites, onPlayFavorite: handlePlayFavorite };
        break;
      case 'Activity':
      default:
        cardProps = activityCardData;
        favProps = { title: 'Saved & Favorites', items: activityFavorites, onPlayFavorite: handlePlayFavorite };
        break;
    }

    return (
      <>
        <MainActivityCard {...cardProps} />
        <FavoritesList {...favProps} />
      </>
    );
  };

 
  const handleSelectDay = (day: number) => {
    if (availableDays.includes(day)) {
        setSelectedDay(day);
        console.log("Selected Day:", day);
    }
  };
  const handlePreviousDay = () => {
    const currentIndex = availableDays.indexOf(selectedDay);
    if (currentIndex > 0) {
      setSelectedDay(availableDays[currentIndex - 1]);
    }
  };
  const handleNextDay = () => {
    const currentIndex = availableDays.indexOf(selectedDay);
    if (currentIndex < availableDays.length - 1) {
      setSelectedDay(availableDays[currentIndex + 1]);
    }
  };

 
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      const filtered = mockSearchableItems.filter(item =>
        item.toLowerCase().includes(query.toLowerCase())
      );
      setSearchSuggestions(filtered);
      setIsSearchDropdownOpen(filtered.length > 0);
    } else {
      setSearchSuggestions([]);
      setIsSearchDropdownOpen(false);
    }
  };

 
  const handleSelectSuggestion = (suggestion: string) => {
    console.log("Selected search suggestion:", suggestion);
    setSearchQuery(suggestion);
    setIsSearchDropdownOpen(false);
    setSearchSuggestions([]);
   
  };

  return (
    <div className={`min-h-screen ${roboto.className} bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 md:p-8`}>
      
      <header className="flex justify-between items-center mb-6 md:mb-8">
        
        <div className={`${montserrat.className} text-2xl sm:text-3xl font-bold text-pink-600 dark:text-pink-400`}>MindMate</div>

        
        <nav className="hidden lg:flex items-center space-x-2 xl:space-x-4">
          {navItems.map(({ name, Icon }) => {
            const isActive = activeNavItem === name;
            return (
              <button
                key={name}
                onClick={() => setActiveNavItem(name)}
                className={`group p-2 rounded-full transition-colors duration-200 
                   ${isActive
                     ? 'bg-gradient-to-br from-[#dde771] to-[#f5d5d4] shadow-sm'
                     : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                   }`}
                aria-label={name}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon
                  className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-200 
                   ${isActive
                     ? 'text-gray-800'
                     : 'text-gray-600 dark:text-gray-400 group-hover:text-pink-600 dark:group-hover:text-pink-400'
                   }`}
                />
              </button>
            );
          })}
        </nav>

        
        <div className="flex items-center space-x-3 sm:space-x-4">
          
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden cursor-pointer relative">
            <Image
              src="https://randomuser.me/api/portraits/women/75.jpg"
              alt="User Avatar"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <LayoutGrid className={iconStyle} aria-label="Apps" tabIndex={0} />

          
          <div className="relative">
            <button
              ref={triggerRef}
              onClick={toggleNotifications}
              className={`group p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative ${isNotificationsOpen ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
              aria-label="Toggle Notifications"
              aria-controls="notifications-panel"
              aria-expanded={isNotificationsOpen}
            >
              <Bell className={iconStyle} />
              
              <span className="absolute top-1.5 right-1.5 block w-2 h-2 bg-red-500 rounded-full ring-2 ring-gray-50 dark:ring-gray-900"></span>
            </button>

            
            {isNotificationsOpen && (
              <div ref={panelRef} className="absolute hidden lg:block top-full right-0 mt-2 w-80 max-h-[400px] overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100">Notifications</h4>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {notificationsData.length > 0 ? (
                    notificationsData.map((notif) => (
                       <div key={notif.id} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                         <div className="flex items-start space-x-3">
                            <div className="mt-1 flex-shrink-0">{getNotificationIcon(notif.type)}</div>
                            <div className="flex-grow">
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{notif.title}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{notif.message}</p>
                              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">{notif.time}</p>
                            </div>
                         </div>
                       </div>
                    ))
                  ) : (
                     <p className="p-4 text-sm text-center text-gray-500 dark:text-gray-400">No new notifications</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      
      {isNotificationsOpen && (
         <div className="lg:hidden fixed inset-0 z-40" aria-modal="true">
           
           <div
             className="fixed inset-0 bg-black/30 backdrop-blur-sm"
             onClick={toggleNotifications}
             aria-hidden="true"
           ></div>

           
           <div
             ref={panelRef}
             id="notifications-panel"
             className={`fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col
               ${isNotificationsOpen ? 'translate-x-0' : 'translate-x-full'}
             `}
           >
             <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
               <h4 className="font-semibold text-gray-800 dark:text-gray-100">Notifications</h4>
               <button onClick={toggleNotifications} className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400" aria-label="Close Notifications">
                 <X className="w-5 h-5" />
               </button>
             </div>
             <div className="flex-grow overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
               {notificationsData.length > 0 ? (
                 notificationsData.map((notif) => (
                    <div key={notif.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <div className="flex items-start space-x-3">
                         <div className="mt-1 flex-shrink-0">{getNotificationIcon(notif.type)}</div>
                         <div className="flex-grow">
                           <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{notif.title}</p>
                           <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{notif.message}</p>
                           <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">{notif.time}</p>
                         </div>
                      </div>
                    </div>
                 ))
               ) : (
                  <p className="p-4 text-sm text-center text-gray-500 dark:text-gray-400">No new notifications</p>
               )}
             </div>
           </div>
         </div>
      )}

      
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        
        <section className="space-y-6">
          
          <h1 className={`${montserrat.className} text-2xl sm:text-2xl font-semibold`}>Good morning, Emma ✨</h1>

          
          <div className="flex flex-wrap gap-2">
            {(["Activity", "Mood", "Food", "Sleep"] as TabName[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 text-sm sm:px-5 sm:py-2 sm:text-base rounded-full font-medium cursor-pointer transition-colors duration-200 
                   ${
                     activeTab === tab
                       ? "bg-lime-100 dark:bg-lime-900/70 text-lime-700 dark:text-lime-200 shadow-sm"
                       : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                   }`}
              >
                {tab}
              </button>
            ))}
          </div>

          
          {renderTabContent()}
        </section>

        
        <section className="space-y-6">
          
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            
            <div className="bg-lime-100 dark:bg-lime-900/50 p-3 sm:p-4 rounded-2xl shadow-sm flex flex-col justify-between items-start">
              <div className="flex justify-between items-center w-full mb-2">
                <div className="p-1.5 bg-white/50 dark:bg-black/30 rounded-lg">
                  <Hourglass className="w-4 h-4 sm:w-5 sm:h-5 text-lime-600 dark:text-lime-400" />
                </div>
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-lime-600 dark:text-lime-400 opacity-70" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-lime-800 dark:text-lime-200 mb-0.5">Focus Time</p>
                <p className={`${montserrat.className} text-lg sm:text-xl font-semibold text-lime-900 dark:text-lime-100`}>
                  2h 15m
                </p>
              </div>
            </div>

            
            <div className="bg-pink-100 dark:bg-pink-900/50 p-3 sm:p-4 rounded-2xl shadow-sm flex flex-col justify-between items-start">
              <div className="flex justify-between items-center w-full mb-2">
                <div className="p-1.5 bg-white/50 dark:bg-black/30 rounded-lg">
                  <Smile className="w-4 h-4 sm:w-5 sm:h-5 text-pink-600 dark:text-pink-400" />
                </div>
                <button
                  onClick={handleAddMood}
                  className="p-1 bg-white/60 dark:bg-black/40 rounded-md hover:bg-white/80 dark:hover:bg-black/60 cursor-pointer transition-colors"
                  aria-label="Add Mood Entry"
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4 text-pink-600 dark:text-pink-400" />
                </button>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-pink-800 dark:text-pink-200 mb-0.5">Mood Level</p>
                <p className={`${montserrat.className} text-lg sm:text-xl font-semibold text-pink-900 dark:text-pink-100`}>
                  7/10
                </p>
              </div>
            </div>
          </div>

          
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-2xl shadow-sm space-y-4">
            
            <div className="flex justify-between items-center"> <h3 className={`${montserrat.className} text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100`}>Emotional Check-ins</h3> <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 cursor-pointer" /> </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-4">
              
              <div className="text-xs sm:text-sm space-y-1.5 mb-4 sm:mb-0 w-full sm:w-auto flex-shrink-0">
                <div className="flex items-center">
                  <span className="w-1 h-4 bg-blue-500 rounded-full mr-2"></span>
                  <span className="text-gray-600 dark:text-gray-400">{currentCheckInData.target.toFixed(1)}h Target</span>
                  <span className="ml-auto font-medium text-gray-800 dark:text-gray-200 pl-4">Sleep Goal</span>
                </div>
                 <div className="flex items-center">
                  <span className="w-1 h-4 bg-green-500 rounded-full mr-2"></span>
                  <span className="text-gray-600 dark:text-gray-400">{currentCheckInData.achieved.toFixed(1)}h Achieved</span>
                   <span className="ml-auto font-medium text-gray-800 dark:text-gray-200 pl-4">Last Night</span>
                </div>
                <div className="flex items-center">
                  <span className="w-1 h-4 bg-yellow-500 rounded-full mr-2"></span>
                  <span className="text-gray-600 dark:text-gray-400">{sleepMissing.toFixed(1)}h Missing</span>
                  <span className="ml-auto font-medium text-gray-800 dark:text-gray-200 pl-4">Deficit</span>
                </div>
              </div>

              
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex-shrink-0 ml-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={emotionalCheckinPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius="70%"
                      outerRadius="100%"
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      cornerRadius={8}
                      labelLine={false}
                      label={false}
                    >
                      {emotionalCheckinPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={emotionalCheckinPieColors[index % emotionalCheckinPieColors.length]} stroke="none" />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="absolute top-[-5px] left-1/2 transform -translate-x-1/2 p-1 bg-pink-100 dark:bg-pink-900 rounded-full">
                  <Leaf className="w-3 h-3 text-pink-500 dark:text-pink-400" />
                </div>
                <div className="absolute right-[-5px] top-1/2 transform -translate-y-1/2 p-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                  <Target className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                </div>
                <div className="absolute bottom-[-5px] left-1/2 transform -translate-x-1/2 p-1 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <BedDouble className="w-3 h-3 text-blue-500 dark:text-blue-400" />
                </div>
                <div className="absolute left-[-5px] top-1/2 transform -translate-y-1/2 p-1 bg-lime-100 dark:bg-lime-900 rounded-full">
                  <Hourglass className="w-3 h-3 text-lime-500 dark:text-lime-400" />
                </div>
              </div>
            </div>

            
            <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-700">
              {moodsForWeek.map((mood) => {
                 const isCurrentDay = mood.day === selectedDay;
                 return (
                   <div
                     key={mood.dayName}
                     onClick={() => handleSelectDay(mood.day)}
                     className={`flex flex-col items-center p-1 rounded-lg cursor-pointer ${isCurrentDay ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-100/50 dark:hover:bg-gray-700/50'}`}
                     role="button"
                     tabIndex={0}
                     aria-label={`Select day ${mood.day}`}
                     aria-pressed={isCurrentDay}
                   >
                    <mood.icon className={`w-5 h-5 sm:w-6 sm:h-6 mb-1 ${isCurrentDay ? 'text-yellow-500' : 'text-gray-400 dark:text-gray-500'} ${mood.secondary ? 'opacity-50' : ''}`} />
                    <span className={`text-[10px] sm:text-xs ${isCurrentDay ? 'font-semibold text-gray-700 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500'}`}>{mood.dayName}</span>
                  </div>
                 );
              })}
            </div>
          </div>

          
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            
            <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-2xl shadow-sm space-y-2 sm:space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">Intake</span>
                <MessageCircle className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500">Deep Talk</p>
              
              <div className="grid grid-cols-6 gap-1 pt-1">
                {[...Array(18)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 sm:h-2.5 rounded-sm 
                       ${[0, 6, 12].includes(i) ? "bg-pink-300 dark:bg-pink-700" : ""}
                       ${[1, 7, 13].includes(i) ? "bg-blue-300 dark:bg-blue-700" : ""}
                       ${[2, 8, 14].includes(i) ? "bg-lime-300 dark:bg-lime-700" : ""}
                       ${[3, 9, 15].includes(i) ? "bg-pink-300 dark:bg-pink-700" : ""}
                       ${[4, 10, 16].includes(i) ? "bg-blue-300 dark:bg-blue-700" : ""}
                       ${[5, 11, 17].includes(i) ? "bg-lime-300 dark:bg-lime-700" : ""}
                     `}
                  ></div>
                ))}
              </div>
            </div>

            
            <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-2xl shadow-sm space-y-2 sm:space-y-3 flex flex-col">
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">Mental Effect</span>
                <BrainCircuit className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-green-600 dark:text-green-400">Very High</p>
              
              <div className="flex-grow mt-1 h-10 sm:h-12">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mentalEffectData}>
                    {" "}
                    
                    <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-2xl shadow-sm space-y-3">
            <div className="flex justify-between items-center mb-1">
              <h3 className={`${montserrat.className} text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100`}>
                Activity Suggestions
              </h3>
              <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 cursor-pointer" />
            </div>
            <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-1.5 bg-black dark:bg-gray-900 rounded-md">
                  
                  <Zap className="w-4 h-4 text-white dark:text-gray-300" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-100">Short meditation</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                    5 min &nbsp;&bull;&nbsp; 3 exercise
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                <span className="text-sm sm:text-base font-semibold">+20</span>
                <ArrowUp className="w-4 h-4" />
              </div>
            </div>
          </div>
        </section>

        
        <aside className="space-y-6">
          
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => searchQuery.length > 0 && searchSuggestions.length > 0 && setIsSearchDropdownOpen(true)}
              className="w-full pl-10 pr-10 py-2.5 sm:py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300 dark:focus:ring-pink-700 shadow-sm placeholder-gray-400 dark:placeholder-gray-500 text-sm sm:text-base"
            />
            <Search className="absolute left-3 sm:left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" />
             <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 bg-lime-100 dark:bg-lime-900/50 rounded-full text-lime-600 dark:text-lime-400 hover:bg-lime-200 dark:hover:bg-lime-800/50 transition-colors cursor-pointer" aria-label="Voice Search">
               <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
             </button>

            
            {isSearchDropdownOpen && searchSuggestions.length > 0 && (
              <div
                ref={searchPanelRef}
                className="absolute top-full left-0 right-0 mt-1.5 w-full max-h-60 overflow-y-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-30 py-1"
              >
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectSuggestion(suggestion)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          
          <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-xl shadow-sm flex items-center justify-between">
            <button onClick={handlePreviousDay} className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Previous Day" disabled={availableDays.indexOf(selectedDay) === 0}>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-1 sm:space-x-1.5 overflow-hidden">
              {availableDays.map(day => {
                  const isSelected = day === selectedDay;
                  const isToday = day === 2;
                  return (
                      <button
                          key={day}
                          onClick={() => handleSelectDay(day)}
                          className={`px-2 py-1 rounded-lg transition-colors text-xs sm:text-sm 
                              ${
                                  isSelected
                                  ? 'bg-lime-100 dark:bg-lime-900/50 text-lime-700 dark:text-lime-300 font-semibold'
                                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                              }`}
                      >
                          {isToday ? `Today, ${day} Apr` : day}
                      </button>
                  );
              })}
            </div>
             <button onClick={handleNextDay} className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Next Day" disabled={availableDays.indexOf(selectedDay) === availableDays.length - 1}>
               <ChevronRight className="w-5 h-5" />
             </button>
          </div>

          
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-2xl shadow-sm space-y-3">
             
             <div className="flex justify-between items-center relative">
                <h3 className={`${montserrat.className} text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100`}>Mood History</h3>
                <button
                  ref={moodHistoryTriggerRef}
                  onClick={toggleMoodHistoryDropdown}
                  className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-pointer"
                  aria-label="Mood History Options"
                  aria-haspopup="true"
                  aria-expanded={isMoodHistoryDropdownOpen}
                >
                  <MoreHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                {isMoodHistoryDropdownOpen && (
                   <div
                     ref={moodHistoryPanelRef}
                     className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-20 py-1"
                   >
                     <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">View Full History</button>
                     <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Export Data</button>
                     <button className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50">Clear Week</button>
                   </div>
                )}
             </div>
             
             <div className="flex justify-between items-end space-x-1 sm:space-x-2">
               {moodsForWeek.map((mood) => (
                 <div key={`${mood.dayName}-history`} className="flex flex-col items-center space-y-1 text-center">
                   <div className={`p-2 sm:p-2.5 rounded-lg ${mood.bgColorClass || 'bg-gray-100 dark:bg-gray-700'}`}> 
                     <mood.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${mood.colorClass || 'text-gray-600 dark:text-gray-300'}`} />
                   </div>
                   <span className="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400">{mood.dayName}</span>
                 </div>
               ))}
             </div>
          </div>

          
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-2xl shadow-sm flex flex-col space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3
                  className={`${montserrat.className} text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 mb-0.5`}
                >
                  Daily Reflection
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">What is your mood today?</p>
              </div>
              <button
                className="p-1.5 bg-purple-100 dark:bg-purple-900/50 rounded-lg text-purple-600 dark:text-purple-400 cursor-pointer"
                aria-label="View Reflection History"
              >
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            
            <div className="relative w-full aspect-square max-w-[250px] mx-auto my-4">
              
              <div className="absolute inset-[15%] sm:inset-[20%] rounded-full bg-gradient-radial from-white via-lime-50 to-yellow-100 dark:from-gray-700 dark:via-lime-900/30 dark:to-yellow-900/30 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-[9px] sm:text-xs uppercase text-gray-500 dark:text-gray-400 tracking-wider">
                    Mood
                  </span>
                  <p className={`${montserrat.className} text-sm sm:text-base font-semibold text-lime-700 dark:text-lime-300 uppercase`}>
                    {selectedDailyMood}
                  </p>
                </div>
              </div>
              
              <div onClick={() => handleSelectMoodIcon('Good')} data-mood-icon="Good" className="absolute top-[5%] left-1/2 -translate-x-1/2 p-1.5 sm:p-2 bg-lime-200 dark:bg-lime-800 rounded-full shadow-md cursor-pointer transition-all duration-200">
                <Smile className="w-5 h-5 sm:w-6 sm:h-6 text-lime-700 dark:text-lime-300" />
              </div>
              <div onClick={() => handleSelectMoodIcon('Stressed')} data-mood-icon="Stressed" className="absolute top-[25%] right-[5%] p-1 sm:p-1.5 bg-yellow-200 dark:bg-yellow-800 rounded-full shadow-md cursor-pointer transition-all duration-200">
                <Laugh className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-700 dark:text-yellow-300" />
              </div>
              <div onClick={() => handleSelectMoodIcon('Shied')} data-mood-icon="Shied" className="absolute bottom-[25%] right-[5%] p-1 sm:p-1.5 bg-pink-200 dark:bg-pink-800 rounded-full shadow-md cursor-pointer transition-all duration-200">
                <Frown className="w-4 h-4 sm:w-5 sm:h-5 text-pink-700 dark:text-pink-300" />
              </div>
              <div onClick={() => handleSelectMoodIcon('Angry')} data-mood-icon="Angry" className="absolute bottom-[5%] left-1/2 -translate-x-1/2 p-1.5 sm:p-2 bg-red-200 dark:bg-red-800 rounded-full shadow-md cursor-pointer transition-all duration-200">
                <Angry className="w-5 h-5 sm:w-6 sm:h-6 text-red-700 dark:text-red-300" />
              </div>
              <div onClick={() => handleSelectMoodIcon('Meh')} data-mood-icon="Meh" className="absolute top-[25%] left-[5%] p-1 sm:p-1.5 bg-blue-200 dark:bg-blue-800 rounded-full shadow-md cursor-pointer transition-all duration-200">
                <Meh className="w-4 h-4 sm:w-5 sm:h-5 text-blue-700 dark:text-blue-300" />
              </div>
              
              <span className="absolute top-[15%] right-[15%] text-[9px] sm:text-xs font-semibold text-yellow-600 dark:text-yellow-400 uppercase">
                Stressed
              </span>
              <span className="absolute top-[15%] left-[15%] text-[9px] sm:text-xs font-semibold text-lime-600 dark:text-lime-400 uppercase">
                Good
              </span>
              <span className="absolute bottom-[15%] right-[15%] text-[9px] sm:text-xs font-semibold text-pink-600 dark:text-pink-400 uppercase">
                Shied?
              </span>
              <span className="absolute bottom-[15%] left-[15%] text-[9px] sm:text-xs font-semibold text-red-600 dark:text-red-400 uppercase">
                Angry
              </span>
            </div>

            
            <button
              onClick={handleSaveMood}
              className="w-full mt-auto bg-lime-200 hover:bg-lime-300 dark:bg-lime-800 dark:hover:bg-lime-700 text-lime-800 dark:text-lime-100 font-semibold py-2.5 sm:py-3 rounded-lg flex items-center justify-center space-x-2 cursor-pointer transition-colors"
            >
              <Archive className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Save Mood</span>
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
};



const emotionalCheckinData = [
  { name: 'Sleep Goal Area', value: 200 },
  { name: 'Achieved', value: 162 },
  { name: 'Missing', value: 38 }, 
  { name: 'Buffer', value: 50 },
];

const emotionalCheckinColors = ['#ec4899', '#22c55e', '#3b82f6', '#a3e635'];


const dailyMoodData = [
  { day: 'Mon', icon: Angry, current: false, bgColorClass: 'bg-red-100 dark:bg-red-900/50', colorClass: 'text-red-600 dark:text-red-400' },
  { day: 'Tue', icon: Frown, current: false, secondary: true, bgColorClass: 'bg-orange-100 dark:bg-orange-900/50', colorClass: 'text-orange-600 dark:text-orange-400' },
  { day: 'Wed', icon: Meh, current: true, bgColorClass: 'bg-blue-100 dark:bg-blue-900/50', colorClass: 'text-blue-600 dark:text-blue-400' },
  { day: 'Thr', icon: Smile, current: false, secondary: true, bgColorClass: 'bg-pink-100 dark:bg-pink-900/50', colorClass: 'text-pink-600 dark:text-pink-400' },
  { day: 'Fri', icon: Smile, current: false, bgColorClass: 'bg-green-100 dark:bg-green-900/50', colorClass: 'text-green-600 dark:text-green-400' },
  { day: 'Sat', icon: Laugh, current: false, bgColorClass: 'bg-yellow-100 dark:bg-yellow-900/50', colorClass: 'text-yellow-600 dark:text-yellow-400' },
  { day: 'Sun', icon: Smile, current: false, secondary: true, bgColorClass: 'bg-purple-100 dark:bg-purple-900/50', colorClass: 'text-purple-600 dark:text-purple-400' },
];


const mentalEffectData = [
  { name: 'Point 1', value: 10 },
  { name: 'Point 2', value: 30 },
  { name: 'Point 3', value: 20 },
  { name: 'Point 4', value: 50 },
  { name: 'Point 5', value: 40 },
  { name: 'Point 6', value: 70 },
  { name: 'Point 7', value: 60 },
];

export default MindMateDashboard;
