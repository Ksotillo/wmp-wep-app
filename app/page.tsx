"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, Search, ChevronUp, ChevronDown, Plus, Wallet, Users, PackageOpen, LineChart as LineChartIcon, 
  Info, CheckCircle, Gem, Book, Layers, Wrench, EllipsisVertical, Moon, Sun,
  ShoppingCart, MessageSquare, UserCircle, CreditCard, LifeBuoy, Settings, LogOut
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';

const WunderUiLogo = () => (
    <svg
        className="h-10 w-auto sm:h-12 dark:text-white text-gray-800" // Adjusted size and added dark mode color
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 640 432"
        enableBackground="new 0 0 640 432"
        xmlSpace="preserve"
        fill="currentColor" // Use currentColor to inherit from parent
    >
        <path
            fill="#F9CB4B"
            d="
M419.347748,245.042557 
	C415.668518,281.255859 401.787292,313.295990 378.166595,340.706207 
	C347.944489,375.776917 309.204926,396.586212 263.823669,404.797882 
	C252.320892,406.879333 240.465347,407.011383 228.086594,408.099457 
	C228.086594,347.441925 228.086594,288.167542 228.050873,228.446930 
	C228.015167,228.000702 227.966766,228.000992 227.966766,228.001007 
	C237.563080,219.318130 247.244492,210.727203 256.740753,201.936264 
	C295.556152,166.003769 334.327545,130.023727 373.087799,94.031769 
	C386.614380,81.471268 400.058167,68.821571 413.550781,56.224445 
	C415.335358,54.558292 417.185608,52.962471 420.052948,50.396755 
	C420.052948,110.157784 420.052948,168.666016 420.049377,228.095551 
	C419.813110,234.358765 419.580444,239.700653 419.347748,245.042557 
z"
        />
        <path
            fill="#12B0F0"
            d="
M228.013672,227.976334 
	C216.454102,239.182053 204.793198,250.308548 193.358002,261.662384 
	C163.813232,290.997040 134.368759,320.432678 104.880081,349.823853 
	C104.068916,350.632355 103.210823,351.393768 101.336304,353.149841 
	C92.107735,340.631470 82.237137,328.913940 74.230606,316.037354 
	C56.964241,288.268494 49.359234,257.679871 49.565224,224.909302 
	C49.807011,186.443939 49.282310,147.974030 49.146263,109.505882 
	C49.077988,90.200615 49.134357,70.894897 49.134357,51.097374 
	C108.762306,51.097374 167.615204,51.097374 227.846924,51.097374 
	C227.846924,109.734764 227.846924,168.441040 227.906845,227.574158 
	C227.966766,228.000992 228.015167,228.000702 228.013672,227.976334 
z"
        />
        <path
            fill="#F57791"
            d="
M421.052399,228.105515 
	C422.051880,226.995911 423.003296,225.838257 424.057709,224.783569 
	C480.469330,168.358139 536.888428,111.940170 593.316345,55.530994 
	C594.671692,54.176044 596.135193,52.929287 598.540283,50.721325 
	C598.704407,53.813801 598.877441,55.543633 598.876221,57.273338 
	C598.834900,115.572121 599.203857,173.875549 598.567871,232.167999 
	C598.159790,269.567993 586.623108,303.740631 564.616028,334.169800 
	C541.301514,366.406677 510.318939,388.025635 472.610504,400.212585 
	C456.993164,405.259918 440.889618,407.377014 424.525818,407.718842 
	C423.236786,407.745758 421.943176,407.554565 420.172211,407.431427 
	C420.172211,355.420563 420.172211,303.669403 420.451782,251.119675 
	C420.838379,242.915909 420.945404,235.510712 421.052399,228.105515 
z"
        />
        <path
            fill="#F899B0"
            d="
M420.827576,228.104141 
	C420.945404,235.510712 420.838379,242.915909 420.497437,250.652527 
	C420.087341,249.215591 419.911163,247.447220 419.541382,245.360703 
	C419.580444,239.700653 419.813110,234.358765 420.099670,228.569427 
	C420.153534,228.121979 420.602753,228.102768 420.827576,228.104141 
z"
        />
    </svg>
);

const navLinks = [
  { name: 'Home', href: '#' },
  { name: 'Overview', href: '#' },
  { name: 'Projects', href: '#' },
  { name: 'Tasks', href: '#' },
  { name: 'Reports', href: '#' },
  { name: 'Statements', href: '#' },
];

const subNavLinks = [
  { name: 'Dashboard', href: '#' },
  { name: 'Sales', href: '#' },
  { name: 'Performance', href: '#' },
  { name: 'Traffic', href: '#' },
  { name: 'Audience', href: '#' },
  { name: 'Marketing Tools', href: '#' },
];

const DashboardPage = () => {
  const [activeLink, setActiveLink] = useState('Home');
  const [activeSubLink, setActiveSubLink] = useState('Dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [activeAnalyticsTimeFilter, setActiveAnalyticsTimeFilter] = useState('12 months');

  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);
  const searchDropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Effect to handle clicks outside of dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target as Node)) {
        setNotificationDropdownOpen(false);
      }
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target as Node) && searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setIsSearchDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const activateDarkMode = () => {
    setIsDarkMode(true);
  };

  const deactivateDarkMode = () => {
    setIsDarkMode(false);
  };

  const toggleThemePreference = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  const userProfileClicked = () => setProfileDropdownOpen(!isProfileDropdownOpen);
  const bellIconActivated = () => setNotificationDropdownOpen(!isNotificationDropdownOpen);

  const searchableSections = [
    'Dashboard', 'Sales', 'Performance', 'Traffic', 'Audience', 'Marketing Tools',
    'Analytics', 'Impressions', 'Projects', 'Payments', 'Profile', 'Settings', 'Billing'
  ];

  const searchSections = (term: string) => {
    if (term.length === 0) {
      setSearchResults([]);
      setIsSearchDropdownOpen(false);
      return;
    }
    const matches = searchableSections.filter(section => 
      section.toLowerCase().includes(term.toLowerCase())
    );
    setSearchResults(matches);
    setIsSearchDropdownOpen(true);
  };

  const searchInputChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentSearchTerm = event.target.value;
    setSearchTerm(currentSearchTerm);
    searchSections(currentSearchTerm);
  };

  const focusSearchInput = () => {
    if(searchTerm.length > 0) {
        searchSections(searchTerm);
    }
  };

  // Chart Data
  const paymentsChartData = [
    { name: "Jan", payments: 0 },
    { name: "Feb", payments: 15000 },
    { name: "Mar", payments: 25000 },
    { name: "Apr", payments: 40000 },
  ];

  const generateAnalyticsData = (timeframe: string) => {
    let labels: string[] = [];
    let dataCurrent: number[] = [];
    let dataPrevious: number[] = [];
    let count = 0;

    switch (timeframe) {
      case '30 days':
        count = 30;
        labels = Array.from({ length: count }, (_, i) => `D${i + 1}`);
        break;
      case '7 days':
        count = 7;
        labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        break;
      case '24 hours':
        count = 24;
        labels = Array.from({ length: count }, (_, i) => `${i}:00`);
        break;
      case '12 months':
      default:
        count = 18;
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        for (let i = 0; i < count; i++) {
          const year = 23 + Math.floor(i / 12);
          labels.push(`${monthNames[i % 12]}${year}`);
        }
        break;
    }

    for (let i = 0; i < count; i++) {
      dataPrevious.push(Math.floor(Math.random() * 25000) + 10000);
      dataCurrent.push(Math.floor(Math.random() * 30000) + 5000);
    }
    
    return labels.map((label, index) => ({
      name: label,
      Current: dataCurrent[index],
      Previous: dataPrevious[index],
    }));
  };
  
  const [analyticsChartData, setAnalyticsChartData] = useState(generateAnalyticsData(activeAnalyticsTimeFilter));

  useEffect(() => {
    setAnalyticsChartData(generateAnalyticsData(activeAnalyticsTimeFilter));
  }, [activeAnalyticsTimeFilter]);


  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 shadow-lg rounded-md border border-gray-200 dark:border-gray-700">
          <p className="label text-sm text-gray-700 dark:text-gray-300">{`${label}`}</p>
          {payload.map((pld: any) => (
            <p key={pld.dataKey} style={{ color: pld.color }} className="text-xs">
              {`${pld.dataKey}: ${pld.value?.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap');
        body {
          font-family: 'Roboto', sans-serif;
          background-color: #f7f9fc; /* Light mode background */
          color: #333; /* Light mode text */
          transition: background-color 0.3s ease, color 0.3s ease;
        }
        .dark body {
          background-color: #1a202c; /* Dark mode background */
          color: #e2e8f0; /* Dark mode text */
        }
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Montserrat', sans-serif;
        }
        /* Additional global styles can be added here */
      `}</style>

      <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        {/* Navbar */}
        <nav className="bg-white dark:bg-gray-800 shadow-md dark:border-b dark:border-gray-700">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Left Section: Logo and Nav Links */}
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center gap-3 relative pr-8 mr-8">
                  <WunderUiLogo />
                  <span className="font-montserrat text-2xl font-bold text-gray-800 dark:text-white">WunderUI</span>
                  <div className="absolute right-0 top-[-10px] h-[calc(100%+20px)] w-px bg-gray-200 dark:bg-gray-700"></div>
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    {navLinks.map((link) => (
                      <a
                        key={link.name}
                        href={link.href}
                        onClick={() => setActiveLink(link.name)}
                        className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer
                          ${activeLink === link.name 
                            ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white' 
                            : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                          }`}
                      >
                        {link.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Section: Notifications, Profile, Theme Toggle */}
              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6 gap-4">
                  {/* Theme Toggle Button */}
                  <button
                    onClick={toggleThemePreference}
                    className="p-1 rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 dark:focus:ring-offset-gray-900 focus:ring-white cursor-pointer"
                  >
                    <span className="sr-only">Toggle dark mode</span>
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                  </button>
                
                  {/* Notification Bell */}
                  <div className="relative" ref={notificationDropdownRef}>
                    <button
                      onClick={bellIconActivated}
                      className="p-1 bg-white dark:bg-gray-800 rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none cursor-pointer"
                    >
                      <span className="sr-only">View notifications</span>
                      <Bell size={20} />
                      <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white dark:ring-gray-800 bg-red-500"></span>
                    </button>
                    {isNotificationDropdownOpen && (
                      <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black dark:ring-gray-600 ring-opacity-5 z-20">
                        <div className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100 font-semibold border-b border-gray-200 dark:border-gray-600">Notifications</div>
                        {
                          [
                            { icon: <ShoppingCart size={16} className="text-blue-500"/>, title: 'New order received (#12345)', time: '5 minutes ago' },
                            { icon: <LineChartIcon size={16} className="text-red-500"/>, title: 'Traffic dropped by 15%', time: '1 hour ago' },
                            { icon: <Users size={16} className="text-green-500"/>, title: 'New customer registered', time: '3 hours ago' },
                            { icon: <MessageSquare size={16} className="text-yellow-500"/>, title: 'Comment on \'Creative Brandbook\'', time: 'Yesterday' },
                          ].map(item => (
                            <a key={item.title} href="#" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                              <span className="flex-shrink-0">{item.icon}</span>
                              <div className="flex-grow">
                                <p>{item.title}</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500">{item.time}</p>
                              </div>
                            </a>
                          ))
                        }
                        <div className="border-t border-gray-200 dark:border-gray-600">
                          <a href="#" className="block px-4 py-3 text-sm text-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600">View All Notifications</a>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="h-6 w-px bg-gray-200 dark:bg-gray-600"></div>

                  {/* Profile Dropdown */}
                  <div className="ml-3 relative" ref={profileDropdownRef}>
                    <div>
                      <button
                        onClick={userProfileClicked}
                        className="max-w-xs bg-white dark:bg-gray-800 rounded-full flex items-center text-sm focus:outline-none gap-2 cursor-pointer"
                        id="user-menu-button"
                      >
                        <span className="sr-only">Open user menu</span>
                        <div className="h-8 w-8 rounded-full bg-purple-200 dark:bg-purple-700 flex items-center justify-center text-purple-700 dark:text-purple-200 font-semibold">
                          JM
                        </div>
                        <div className="text-left hidden sm:block">
                          <div className="text-sm font-medium text-gray-700 dark:text-gray-200">Jonah Miller</div>
                          <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Administrator</div>
                        </div>
                        <div className="hidden sm:flex flex-col items-center">
                            <ChevronUp size={12} className="text-gray-400 dark:text-gray-500 -mb-1" />
                            <ChevronDown size={12} className="text-gray-400 dark:text-gray-500 -mt-1" />
                        </div>
                      </button>
                    </div>
                    {isProfileDropdownOpen && (
                       <div 
                        className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none z-20" 
                        role="menu" 
                        aria-orientation="vertical" 
                        aria-labelledby="user-menu-button"
                      >
                        {
                          [
                            { label: 'View Profile', icon: <UserCircle size={16} className="mr-2 text-gray-500 dark:text-gray-400"/> },
                            { label: 'Billing', icon: <CreditCard size={16} className="mr-2 text-gray-500 dark:text-gray-400"/> },
                            { label: 'Help Center', icon: <LifeBuoy size={16} className="mr-2 text-gray-500 dark:text-gray-400"/> },
                            { label: 'Account Settings', icon: <Settings size={16} className="mr-2 text-gray-500 dark:text-gray-400"/> },
                          ].map(item => (
                            <a key={item.label} href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600" role="menuitem">
                              {item.icon} {item.label}
                            </a>
                          ))
                        }
                        <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
                        <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600" role="menuitem">
                          <LogOut size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                           Logout
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* Mobile menu button (placeholder) */}
              <div className="-mr-2 flex md:hidden">
                <button className="bg-gray-50 dark:bg-gray-700 inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none cursor-pointer">
                  <span className="sr-only">Open main menu</span>
                  {/* Icon for mobile menu - e.g., Menu from lucide-react */}
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Sub Navbar */}
        <div className="bg-white dark:bg-gray-800 shadow-sm dark:border-b dark:border-gray-700">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-12">
              {/* SubNav Links */}
              <div className="flex items-center space-x-1">
                {subNavLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setActiveSubLink(link.name)}
                    className={`px-3 py-2 rounded-md text-xs font-medium cursor-pointer
                      ${activeSubLink === link.name
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                  >
                    {link.name}
                  </a>
                ))}
              </div>

              {/* Search Bar with Dropdown */}
              <div className="relative" ref={searchDropdownRef}>
                <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-md px-2 py-1">
                  <Search size={16} className="text-gray-400 dark:text-gray-500 mr-2" />
                  <input 
                    ref={searchInputRef}
                    type="text" 
                    placeholder="Search"
                    value={searchTerm}
                    onChange={searchInputChanged}
                    onFocus={focusSearchInput}
                    className="text-sm bg-transparent focus:outline-none text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>
                {isSearchDropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black dark:ring-gray-600 ring-opacity-5 z-10">
                    {searchTerm.length === 0 && (
                        <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 text-center">Start typing to search...</div>
                    )}
                    {searchTerm.length > 0 && searchResults.length === 0 && (
                        <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 text-center">No sections found.</div>
                    )}
                    {searchResults.map(result => (
                      <a 
                        key={result} 
                        href="#" 
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => { alert(`Navigating to ${result}`); setIsSearchDropdownOpen(false); setSearchTerm(result); /* Optionally clear search term or navigate */ }}
                      >
                        {result}
                      </a>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
        
        {/* Main Content Area */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-montserrat font-semibold text-gray-900 dark:text-white">
                Hello, Jonah Miller
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                It's great to see you again.
              </p>
            </div>
            <button className="mt-4 sm:mt-0 flex items-center bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600 text-white text-xs sm:text-sm font-medium py-2 px-3 sm:px-4 rounded-lg cursor-pointer transition-colors">
              <span className="p-1 bg-gray-700 dark:bg-gray-600 rounded-md mr-2 border border-gray-600 dark:border-gray-500">
                <Plus size={12} className="text-white" />
              </span>
              New Product
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {
              [
                {
                  title: 'Total Profits',
                  value: '$68,510.32',
                  change: '+18.2%',
                  changeType: 'positive' as 'positive' | 'negative',
                  previous: '$52,012.34 last year',
                  icon: <Wallet size={20} className="text-gray-700 dark:text-gray-300" />
                },
                {
                  title: 'New Customers',
                  value: '153,640',
                  change: '+13.5%',
                  changeType: 'positive' as 'positive' | 'negative',
                  previous: '120,145 last year',
                  icon: <Users size={20} className="text-gray-700 dark:text-gray-300" />
                },
                {
                  title: 'Total Orders',
                  value: '181,960',
                  change: '+12.7%',
                  changeType: 'positive' as 'positive' | 'negative',
                  previous: '151,423 last year',
                  icon: <PackageOpen size={20} className="text-gray-700 dark:text-gray-300" />
                },
                {
                  title: 'Total Traffic',
                  value: '1,563,029',
                  change: '-9.7%',
                  changeType: 'negative' as 'positive' | 'negative',
                  previous: '2,420,301 last year',
                  icon: <LineChartIcon size={20} className="text-gray-700 dark:text-gray-300" />
                }
              ].map((stat, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col gap-1">
                  <div className="flex items-start justify-between">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-gray-200 dark:border-gray-600">
                      {stat.icon}
                    </div>
                    <span 
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center
                        ${stat.changeType === 'positive' ? 'bg-green-100 dark:bg-green-700 text-green-700 dark:text-green-200' : 'bg-red-100 dark:bg-red-700 text-red-700 dark:text-red-200'}
                      `}
                    >
                      {stat.changeType === 'positive' ? <ChevronUp size={12} className="mr-1"/> : <ChevronDown size={12} className="mr-1"/>}
                      {stat.change}
                    </span>
                  </div>
                  <div className="mt-1">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 font-montserrat">
                      {stat.title}
                    </h3>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-px">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {stat.previous}
                    </p>
                  </div>
                </div>
              ))
            }
          </div>

          {/* Analytics and Impressions Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Analytics Card (2/3 width on lg screens) */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5">
                <div className="flex items-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-montserrat">
                    Analytics
                  </h3>
                  <Info size={14} className="ml-2 text-gray-400 dark:text-gray-500 cursor-pointer" />
                </div>
                <div className="mt-3 sm:mt-0 inline-flex border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
                  {['12 months', '30 days', '7 days', '24 hours'].map((filter, idx, arr) => (
                    <a 
                      key={filter} 
                      href="#" 
                      onClick={() => setActiveAnalyticsTimeFilter(filter)}
                      className={`px-3 py-1.5 text-xs font-medium cursor-pointer 
                        ${activeAnalyticsTimeFilter === filter 
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white' 
                          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600'}
                        ${idx < arr.length - 1 ? 'border-r border-gray-200 dark:border-gray-700' : ''}
                      `}
                    >
                      {filter}
                    </a>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* KPIs */}
                <div className="md:col-span-1 flex flex-col gap-6 pt-2">
                  {
                    [
                      {
                        label: 'Total Earnings',
                        value: '$56,423.32',
                        borderColor: 'border-purple-500',
                        percentage: null
                      },
                      {
                        label: 'Total Views',
                        value: '1,256,014',
                        borderColor: 'border-gray-300 dark:border-gray-600',
                        percentage: null
                      },
                      {
                        label: 'Conversion Rate',
                        value: '10.4%',
                        borderColor: 'border-gray-300 dark:border-gray-600',
                        percentage: '+6.2%'
                      }
                    ].map(kpi => (
                      <div key={kpi.label} className={`relative pl-3 border-l-2 ${kpi.borderColor}`}>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{kpi.label}</p>
                        <p className="text-xl font-semibold text-gray-900 dark:text-white">
                          {kpi.value}
                          {kpi.percentage && (
                            <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-700 text-green-700 dark:text-green-200 align-middle">
                              <ChevronUp size={10} className="inline mr-0.5" />{kpi.percentage}
                            </span>
                          )}
                        </p>
                      </div>
                    ))
                  }
                </div>
                {/* Chart Placeholder */}
                <div className="md:col-span-2 h-64 bg-gray-50 dark:bg-gray-700/30 p-2 rounded-lg">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsChartData} margin={{ top: 5, right: 0, left: -25, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#4A5568' : '#E2E8F0'} vertical={false}/>
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: isDarkMode ? '#A0AEC0' : '#718096' }} tickLine={false} axisLine={{stroke: isDarkMode ? '#4A5568' : '#E2E8F0'}}/>
                      <YAxis tickFormatter={(value) => `${value / 1000}k`} tick={{ fontSize: 10, fill: isDarkMode ? '#A0AEC0' : '#718096' }} tickLine={false} axisLine={false}/>
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}/>
                      <Bar dataKey="Current" fill="#4a90e2" radius={[4, 4, 0, 0]} barSize={10}/>
                      <Bar dataKey="Previous" fill={isDarkMode ? '#4A5568' : '#e2e8f0'} radius={[4, 4, 0, 0]} barSize={10}/>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Impressions Card (1/3 width on lg screens) */}
            <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-montserrat mb-1">
                Impressions
              </h3>
              <div className="relative pl-3 border-l-2 border-gray-300 dark:border-gray-600 mb-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">159,367</p>
              </div>

              <div className="space-y-4">
                {
                  [
                    { name: 'United States', value: '142,410', progress: '89.3%', flag: 'https://flagcdn.com/w40/us.png' },
                    { name: 'Germany', value: '175,133', progress: '75.2%', flag: 'https://flagcdn.com/w40/de.png' },
                    { name: 'Italy', value: '58,173', progress: '36.5%', flag: 'https://flagcdn.com/w40/it.png' },
                    { name: 'England', value: '138,110', progress: '86.7%', flag: 'https://flagcdn.com/w40/gb-eng.png' },
                    { name: 'United Kingdom', value: '182,503', progress: '70%', flag: 'https://flagcdn.com/w40/gb.png' },
                  ].map(country => (
                    <div key={country.name} className="flex items-center gap-3">
                      <img src={country.flag} alt={`${country.name} flag`} className="w-6 h-6 rounded-full object-cover flex-shrink-0" />
                      <div className="flex-grow">
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">{country.name}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{country.value}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                          <div 
                            className="bg-gray-500 dark:bg-gray-400 h-1.5 rounded-full"
                            style={{ width: country.progress }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>

          {/* Projects Table and Payments Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Projects Table (2/3 width on lg screens) */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-0 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-x-auto">
              <div className="p-5 sm:p-6">
                {/* Optionally, a header for the projects table can go here if needed later */}
                {/* <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-montserrat">Projects</h3> */}
              </div>
              <table className="w-full min-w-[640px] text-sm text-left">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="p-3 w-12 text-center font-medium text-gray-500 dark:text-gray-400"><input type="checkbox" className="cursor-pointer rounded border-gray-300 dark:border-gray-600 text-indigo-600 dark:text-indigo-500 focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:bg-gray-700 dark:checked:bg-indigo-500" /></th>
                    {['No.', 'Name', 'Status', 'Views', 'Sales', 'Conversion', 'Total'].map(header => (
                      <th key={header} scope="col" className="p-3 font-medium text-gray-500 dark:text-gray-400 tracking-wider whitespace-nowrap">
                        {header} <ChevronDown size={12} className="inline text-gray-400 dark:text-gray-500" />
                      </th>
                    ))}
                    <th scope="col" className="p-3 font-medium text-gray-500 dark:text-gray-400 tracking-wider"><span className="sr-only">More</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {
                    [
                      { no: '01', name: 'Basic design guideline', icon: <Gem size={16}/>, iconBg: 'bg-blue-500 dark:bg-blue-600', status: '9 Jan 2023 9:43 PM', views: '3,147', sales: '1,004', conversion: '6.5%', total: '$14,238', checked: true },
                      { no: '02', name: 'Creative Brandbook', icon: <Book size={16}/>, iconBg: 'bg-green-500 dark:bg-green-600', status: '9 Jan 2023 9:43 PM', views: '3,147', sales: '1,004', conversion: '6.5%', total: '$14,238', checked: false },
                      { no: '03', name: 'Landing Page Templates', icon: <Layers size={16}/>, iconBg: 'bg-purple-500 dark:bg-purple-600', status: '9 Jan 2023 9:43 PM', views: '3,147', sales: '1,004', conversion: '6.5%', total: '$14,238', checked: false },
                      { no: '04', name: 'UI Software Tool', icon: <Wrench size={16}/>, iconBg: 'bg-red-500 dark:bg-red-600', status: '9 Jan 2023 9:43 PM', views: '3,147', sales: '1,004', conversion: '6.5%', total: '$14,238', checked: false },
                      { no: '05', name: 'Basic design guideline', icon: <Gem size={16}/>, iconBg: 'bg-blue-500 dark:bg-blue-600', status: '9 Jan 2023 9:43 PM', views: '3,147', sales: '1,004', conversion: '6.5%', total: '$14,238', checked: true },
                      { no: '06', name: 'Creative Brandbook', icon: <Book size={16}/>, iconBg: 'bg-green-500 dark:bg-green-600', status: '9 Jan 2023 9:43 PM', views: '3,147', sales: '1,004', conversion: '6.5%', total: '$14,238', checked: false },
                    ].map(project => (
                      <tr key={project.no} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                        <td className="p-3 text-center"><input type="checkbox" defaultChecked={project.checked} className="cursor-pointer rounded border-gray-300 dark:border-gray-600 text-indigo-600 dark:text-indigo-500 focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:bg-gray-700 dark:checked:bg-indigo-500" /></td>
                        <td className="p-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">{project.no}</td>
                        <td className="p-3 text-gray-700 dark:text-gray-200 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={`mr-2.5 p-1.5 rounded-md text-white ${project.iconBg}`}> 
                              {project.icon}
                            </span>
                            <span className="font-medium">{project.name}</span>
                          </div>
                        </td>
                        <td className="p-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          <CheckCircle size={14} className="inline mr-1.5 text-green-500 dark:text-green-400" />
                          {project.status}
                        </td>
                        <td className="p-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">{project.views}</td>
                        <td className="p-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">{project.sales}</td>
                        <td className="p-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">{project.conversion}</td>
                        <td className="p-3 text-gray-700 dark:text-gray-200 font-medium whitespace-nowrap">{project.total}</td>
                        <td className="p-3 text-gray-400 dark:text-gray-500 text-center"><button className="cursor-pointer hover:text-gray-600 dark:hover:text-gray-300"><EllipsisVertical size={18} /></button></td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>

            {/* Payments Card (1/3 width on lg screens) */}
            <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-montserrat">
                  Payments
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex items-center bg-green-100 dark:bg-green-700 text-green-700 dark:text-green-200">
                  <ChevronUp size={12} className="mr-1" />
                  +12.7%
                </span>
              </div>
              {/* Chart Placeholder */}
              <div className="h-64 bg-gray-50 dark:bg-gray-700/30 p-2 rounded-lg">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={paymentsChartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#4A5568' : '#E2E8F0'} vertical={false}/>
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: isDarkMode ? '#A0AEC0' : '#718096' }} tickLine={false} axisLine={{stroke: isDarkMode ? '#4A5568' : '#E2E8F0'}} />
                    <YAxis tickFormatter={(value) => `${value / 1000}k`} tick={{ fontSize: 10, fill: isDarkMode ? '#A0AEC0' : '#718096' }} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#68d391', strokeWidth: 1, fill: 'transparent' }}/>
                    <Line type="monotone" dataKey="payments" stroke="#68d391" strokeWidth={2} dot={{ r: 4, fill: '#68d391'}} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Further components will be added here */}
        </main>

      </div>
    </>
  );
};

export default DashboardPage;
