"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Bell, ChevronUp, ChevronDown, Wallet, Users, PackageOpen, LineChart as LineChartIcon, 
  Info, CheckCircle, Gem, Book, Layers, Wrench, Moon, Sun,
  ShoppingCart, MessageSquare, UserCircle, CreditCard, LifeBuoy, Settings, LogOut,
  ChevronsUpDown
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


const lightColors = {
  base: '#E0E5EC',
  textPrimary: '#1A202C', 
  textSecondary: '#5A6470',
  shadow1: '#a3b1c6',
  shadow2: '#ffffff',
  accent: '#1A202C', 
};

const darkColors = {
  base: '#2C303A',
  textPrimary: '#D1D5DB', 
  textSecondary: '#9CA3AF',
  shadow1: '#1F2228',
  shadow2: '#393E4C',
  accent: '#D1D5DB', 
};

const InsightFlowLogo = () => (
    <svg
        className={`h-10 w-auto sm:h-12 text-[${lightColors.accent}] dark:text-[${darkColors.accent}] block mx-auto`}
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 640 432"
        enableBackground="new 0 0 640 432"
        xmlSpace="preserve"
        fill="currentColor"
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


type Product = {
  no: string;
  name: string;
  icon: React.JSX.Element;
  iconBgClass: string;
  status: string; 
  views: string;
  sales: string;
  conversion: string;
  total: string;
};

const navLinks: { name: string; href: string }[] = [];


const initialProductsData: Product[] = [
  { no: '01', name: 'Basic design guideline', icon: <Gem size={16}/>, iconBgClass: 'bg-blue-500', status: '9 Jan 2023 9:43 PM', views: '3,147', sales: '1,004', conversion: '6.5%', total: '$14,238' },
  { no: '02', name: 'Creative Brandbook', icon: <Book size={16}/>, iconBgClass: 'bg-green-500', status: '1 Feb 2023 10:00 AM', views: '2,500', sales: '800', conversion: '7.2%', total: '$10,500' },
  { no: '03', name: 'Landing Page Templates', icon: <Layers size={16}/>, iconBgClass: 'bg-purple-500', status: '15 Mar 2023 2:15 PM', views: '4,100', sales: '1,250', conversion: '5.8%', total: '$18,900' },
  { no: '04', name: 'UI Software Tool', icon: <Wrench size={16}/>, iconBgClass: 'bg-red-500', status: '28 Apr 2023 11:30 AM', views: '1,980', sales: '650', conversion: '8.1%', total: '$9,750' },
  { no: '05', name: 'Mobile App Components', icon: <Gem size={16}/>, iconBgClass: 'bg-yellow-500', status: '10 May 2023 5:00 PM', views: '3,500', sales: '950', conversion: '6.9%', total: '$15,200' },
  { no: '06', name: 'E-commerce Platform Modules', icon: <Book size={16}/>, iconBgClass: 'bg-teal-500', status: '22 Jun 2023 8:20 AM', views: '5,200', sales: '1,500', conversion: '7.5%', total: '$25,600' },
];


const baseImpressionsCountries = [
  { name: 'United States', flag: 'https://flagcdn.com/w40/us.png', region: 'North America' },
  { name: 'Germany', flag: 'https://flagcdn.com/w40/de.png', region: 'Europe' },
  { name: 'Italy', flag: 'https://flagcdn.com/w40/it.png', region: 'Europe' },
  { name: 'England', flag: 'https://flagcdn.com/w40/gb-eng.png', region: 'Europe' }, 
  { name: 'United Kingdom', flag: 'https://flagcdn.com/w40/gb.png', region: 'Europe' },
];

const impressionRegionFilters = ['All', 'North America', 'Europe'];

const DashboardPage = () => {
  const [activeLink, setActiveLink] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [activeAnalyticsTimeFilter, setActiveAnalyticsTimeFilter] = useState('24 hours');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [productsData, setProductsData] = useState<Product[]>(initialProductsData);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Product | null; direction: 'ascending' | 'descending' }>({ key: 'name', direction: 'ascending' });
  const [isSalesInfoTooltipVisible, setIsSalesInfoTooltipVisible] = useState(false);

  
  const [activeImpressionsRegionFilter, setActiveImpressionsRegionFilter] = useState(impressionRegionFilters[0]); 
  const [impressionsDisplayData, setImpressionsDisplayData] = useState(() => generateImpressionsData(activeImpressionsRegionFilter));
  const [isImpressionsFilterDropdownOpen, setIsImpressionsFilterDropdownOpen] = useState(false);

  
  const [activePaymentsCardTimeFilter, setActivePaymentsCardTimeFilter] = useState('12 months');
  const [paymentsDisplayData, setPaymentsDisplayData] = useState(() => generatePaymentsLineData(activePaymentsCardTimeFilter));

  
  const initialTotalRevenue = 125680.50;
  const initialTransactionCount = 1470;
  const initialAOV = initialTotalRevenue / initialTransactionCount;

  const [totalRevenue, setTotalRevenue] = useState(initialTotalRevenue);
  const [prevTotalRevenueForChange, setPrevTotalRevenueForChange] = useState(initialTotalRevenue); 
  const [displayedPrevTotalRevenue, setDisplayedPrevTotalRevenue] = useState(initialTotalRevenue); 
  const [totalRevenueChange, setTotalRevenueChange] = useState(15.2);
  const [totalRevenueChangeType, setTotalRevenueChangeType] = useState<'positive' | 'negative'>('positive');

  const [transactionCount, setTransactionCount] = useState(initialTransactionCount);
  const [prevTransactionCountForChange, setPrevTransactionCountForChange] = useState(initialTransactionCount); 
  const [displayedPrevTransactionCount, setDisplayedPrevTransactionCount] = useState(initialTransactionCount); 
  const [transactionCountChange, setTransactionCountChange] = useState(8.9);
  const [transactionCountChangeType, setTransactionCountChangeType] = useState<'positive' | 'negative'>('positive');

  const [averageOrderValue, setAverageOrderValue] = useState(initialAOV);
  const [prevAOVForChange, setPrevAOVForChange] = useState(initialAOV); 
  const [displayedPrevAOV, setDisplayedPrevAOV] = useState(initialAOV); 
  const [aovChange, setAOVChange] = useState(-2.1);
  const [aovChangeType, setAOVChangeType] = useState<'positive' | 'negative'>('negative');

  
  const initialTotalSalesValueKPI = 56423.32;
  const initialUnitsSoldKPI = 7820;
  

  const [totalSalesValueKPI, setTotalSalesValueKPI] = useState(initialTotalSalesValueKPI);
  const [displayTotalSalesValueKPI, setDisplayTotalSalesValueKPI] = useState(`$${initialTotalSalesValueKPI.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
  const [unitsSoldKPI, setUnitsSoldKPI] = useState(initialUnitsSoldKPI);
  const [displayUnitsSoldKPI, setDisplayUnitsSoldKPI] = useState(initialUnitsSoldKPI.toLocaleString('en-US'));
  const [avgItemsPerOrderKPI, setAvgItemsPerOrderKPI] = useState(0); 
  const [displayAvgItemsPerOrderKPI, setDisplayAvgItemsPerOrderKPI] = useState("0.0");

  
  const [salesDataVisualToggle, setSalesDataVisualToggle] = useState(false);

  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);
  const impressionsFilterDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target as Node)) {
        setNotificationDropdownOpen(false);
      }
      if (impressionsFilterDropdownRef.current && !impressionsFilterDropdownRef.current.contains(event.target as Node)) {
        setIsImpressionsFilterDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const switchColorMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  const toggleProfileVisibility = () => setProfileDropdownOpen(!isProfileDropdownOpen);
  const displayNotificationPanel = () => setNotificationDropdownOpen(!isNotificationDropdownOpen);

  const signOutUser = () => {
    setIsAuthenticated(false);
    
    setLoginEmail('');
    setLoginPassword('');
    setProfileDropdownOpen(false); 
  };

  const generateAnalyticsData = (timeframe: string, visualToggle?: boolean) => {
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
    
    
    if (timeframe === activeAnalyticsTimeFilter && visualToggle !== undefined) { 
      if (dataCurrent.length > 0) {
        dataCurrent[0] = visualToggle ? 35000 : 1000; 
      }
    }
    
    return labels.map((label, index) => ({
      name: label,
      Current: dataCurrent[index],
      Previous: dataPrevious[index],
    }));
  };
  
  const [analyticsChartData, setAnalyticsChartData] = useState(() => generateAnalyticsData(activeAnalyticsTimeFilter)); 

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSalesDataVisualToggle(prevToggle => !prevToggle);
      setAnalyticsChartData(currentChartData => {
        const nextToggleState = !salesDataVisualToggle; 
        return generateAnalyticsData(activeAnalyticsTimeFilter, nextToggleState);
      });
    }, 5000); 

    return () => clearInterval(intervalId);
  }, [activeAnalyticsTimeFilter, salesDataVisualToggle]); 

  
  function generatePaymentsLineData(timeframe: string) {
    let labels: string[] = [];
    let payments: number[] = [];
    let count = 0;
    const maxPayment = 50000;

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
        count = 12; 
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        labels = monthNames;
        break;
    }

    for (let i = 0; i < count; i++) {
      payments.push(Math.floor(Math.random() * maxPayment * 0.6) + (maxPayment * 0.2)); 
    }
    
    return labels.map((label, index) => ({
      name: label,
      payments: payments[index],
    }));
  };

  
  function generateImpressionsData(selectedRegion: string) {
    let maxImpressionsBase = 100000;
    const countriesToShow = selectedRegion === 'All' 
        ? baseImpressionsCountries 
        : baseImpressionsCountries.filter(country => country.region === selectedRegion);

    return countriesToShow.map(country => {
      
      const value = Math.floor(Math.random() * maxImpressionsBase * 0.05) + (maxImpressionsBase * 0.01); 
      
      const progressValue = Math.floor(Math.random() * 70) + 30; 
      return {
        ...country,
        value: value.toLocaleString(),
        progress: `${progressValue}%`,
      };
    });
  }

  
  useEffect(() => {
    setImpressionsDisplayData(generateImpressionsData(activeImpressionsRegionFilter));
  }, [activeImpressionsRegionFilter]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setImpressionsDisplayData(generateImpressionsData(activeImpressionsRegionFilter));
    }, 6000); 
    return () => clearInterval(intervalId);
  }, [activeImpressionsRegionFilter]);

  
  useEffect(() => {
    setPaymentsDisplayData(generatePaymentsLineData(activePaymentsCardTimeFilter));
  }, [activePaymentsCardTimeFilter]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setPaymentsDisplayData(generatePaymentsLineData(activePaymentsCardTimeFilter));
    }, 7000); 
    return () => clearInterval(intervalId);
  }, [activePaymentsCardTimeFilter]);

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

  const submitLoginCredentials = () => {
    
    
    if (loginEmail && loginPassword) { 
      setIsAuthenticated(true);
    } else {
      alert("Please enter email and password.");
    }
  };

  
  const parseNumeric = (value: string): number => parseFloat(value.replace(/,/g, ''));
  
  const parseCurrency = (value: string): number => parseFloat(value.replace(/[$,]/g, ''));
  
  const parsePercentage = (value: string): number => parseFloat(value.replace(/%/g, ''));

  const sortedProducts = useMemo(() => {
    let sortableItems = [...productsData];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const valA = a[sortConfig.key as keyof Product];
        const valB = b[sortConfig.key as keyof Product];
        let comparison = 0;

        
        if (sortConfig.key === 'no' || sortConfig.key === 'views' || sortConfig.key === 'sales') {
          comparison = parseNumeric(valA as string) - parseNumeric(valB as string);
        } else if (sortConfig.key === 'total') {
          comparison = parseCurrency(valA as string) - parseCurrency(valB as string);
        } else if (sortConfig.key === 'conversion') {
          comparison = parsePercentage(valA as string) - parsePercentage(valB as string);
        } else if (sortConfig.key === 'name' || sortConfig.key === 'status') {
          
          comparison = (valA as string).localeCompare(valB as string);
        }
        
        return sortConfig.direction === 'ascending' ? comparison : -comparison;
      });
    }
    return sortableItems;
  }, [productsData, sortConfig]);

  const changeProductSortOrder = (key: keyof Product) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  
  const totalImpressionsForSelectedRegion = useMemo(() => {
    return impressionsDisplayData.reduce((sum, country) => {
      return sum + parseNumeric(country.value);
    }, 0).toLocaleString();
  }, [impressionsDisplayData]);

  useEffect(() => {
    const slowUpdateInterval = setInterval(() => {
      
      setDisplayedPrevTotalRevenue(prevTotalRevenueForChange); 
      setTotalRevenueChange(prevChange => {
        const change = ((totalRevenue - prevTotalRevenueForChange) / prevTotalRevenueForChange) * 100;
        setTotalRevenueChangeType(change >= 0 ? 'positive' : 'negative');
        return parseFloat(change.toFixed(1));
      });
      setPrevTotalRevenueForChange(totalRevenue); 

      
      setDisplayedPrevTransactionCount(prevTransactionCountForChange); 
      setTransactionCountChange(prevChange => {
        const change = ((transactionCount - prevTransactionCountForChange) / prevTransactionCountForChange) * 100;
        setTransactionCountChangeType(change >= 0 ? 'positive' : 'negative');
        return parseFloat(change.toFixed(1));
      });
      setPrevTransactionCountForChange(transactionCount); 

      
      setDisplayedPrevAOV(prevAOVForChange); 
      setAOVChange(prevChange => {
        
        const change = prevAOVForChange !== 0 ? ((averageOrderValue - prevAOVForChange) / prevAOVForChange) * 100 : 0;
        setAOVChangeType(change >= 0 ? 'positive' : 'negative');
        return parseFloat(change.toFixed(1));
      });
      setPrevAOVForChange(averageOrderValue); 

    }, 15000); 

    return () => clearInterval(slowUpdateInterval);
  }, [totalRevenue, prevTotalRevenueForChange, displayedPrevTotalRevenue, transactionCount, prevTransactionCountForChange, displayedPrevTransactionCount, averageOrderValue, prevAOVForChange, displayedPrevAOV, aovChange]);

  
  useEffect(() => {
    const simulateDataChanges = setInterval(() => {
      setTotalRevenue(prev => {
        const positiveChange = Math.random() * 2500; 
        return parseFloat((prev + positiveChange).toFixed(2)); 
      });
      setTransactionCount(prev => {
        const positiveChange = Math.floor(Math.random() * 5); 
        return prev + positiveChange;
      });

      
      setTotalSalesValueKPI(prev => {
        const positiveChange = Math.random() * 100; 
        const newValue = parseFloat((prev + positiveChange).toFixed(2));
        setDisplayTotalSalesValueKPI(`$${newValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
        return newValue;
      });
      setUnitsSoldKPI(prev => {
        const positiveChange = Math.floor(Math.random() * 3); 
        const newValue = prev + positiveChange;
        setDisplayUnitsSoldKPI(newValue.toLocaleString('en-US'));
        return newValue;
      });
      

    }, 3500); 

    return () => clearInterval(simulateDataChanges);
  }, [totalRevenue, transactionCount]);

  
  useEffect(() => {
    if (transactionCount > 0 && unitsSoldKPI > 0) {
      const newAvg = parseFloat((unitsSoldKPI / transactionCount).toFixed(1));
      setAvgItemsPerOrderKPI(newAvg);
      setDisplayAvgItemsPerOrderKPI(newAvg.toFixed(1));
    } else if (unitsSoldKPI === 0 || transactionCount === 0) { 
      setAvgItemsPerOrderKPI(0);
      setDisplayAvgItemsPerOrderKPI("0.0");
    }
    
    
  }, [unitsSoldKPI, transactionCount]);

  
  useEffect(() => {
    if (transactionCount > 0) {
      setAverageOrderValue(parseFloat((totalRevenue / transactionCount).toFixed(2)));
    } else {
      setAverageOrderValue(0);
    }
  }, [totalRevenue, transactionCount]);

  
  const selectAnalyticsTimeframe = (filter: string) => {
    setActiveAnalyticsTimeFilter(filter);
  };

  const chooseImpressionsRegion = (region: string) => {
    setActiveImpressionsRegionFilter(region);
    setIsImpressionsFilterDropdownOpen(false); 
  };

  const setPaymentsChartPeriod = (filter: string) => {
    setActivePaymentsCardTimeFilter(filter);
  };

  if (!isAuthenticated) {
    return (
      <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap');
        body {
          font-family: 'Roboto', sans-serif;
          background-color: ${lightColors.base};
          color: ${lightColors.textPrimary};
          transition: background-color 0.3s ease, color 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
        }
        .dark body {
          background-color: ${darkColors.base};
          color: ${darkColors.textPrimary};
        }
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Montserrat', sans-serif;
          color: ${lightColors.textPrimary};
        }
        .dark h1, .dark h2, .dark h3, .dark h4, .dark h5, .dark h6 {
          color: ${darkColors.textPrimary};
        }
        /* Neumorphic base for many elements */
        .neumorphic-base-light {
          background-color: ${lightColors.base};
          color: ${lightColors.textPrimary};
        }
        .neumorphic-base-dark {
          background-color: ${darkColors.base};
          color: ${darkColors.textPrimary};
        }
        /* Neumorphic shadows for extruded elements */
        .neumorphic-shadow-light {
          box-shadow: 7px 7px 15px ${lightColors.shadow1}, -7px -7px 15px ${lightColors.shadow2};
          transition: box-shadow 0.3s ease-in-out;
        }
        .neumorphic-shadow-light:hover {
          box-shadow: 9px 9px 18px ${lightColors.shadow1}, -9px -9px 18px ${lightColors.shadow2};
        }
        .neumorphic-shadow-dark {
          box-shadow: 7px 7px 15px ${darkColors.shadow1}, -7px -7px 15px ${darkColors.shadow2};
          transition: box-shadow 0.3s ease-in-out;
        }
        .neumorphic-shadow-dark:hover {
          box-shadow: 9px 9px 18px ${darkColors.shadow1}, -9px -9px 18px ${darkColors.shadow2};
        }

        /* Neumorphic shadows for inset elements */
        .neumorphic-inset-shadow-light {
          box-shadow: inset 7px 7px 15px ${lightColors.shadow1}, inset -7px -7px 15px ${lightColors.shadow2};
        }
        .neumorphic-inset-shadow-dark {
          box-shadow: inset 7px 7px 15px ${darkColors.shadow1}, inset -7px -7px 15px ${darkColors.shadow2};
        }
        /* Subtle Neumorphic shadows for extruded elements */
        .neumorphic-shadow-subtle-light {
          box-shadow: 3px 3px 7px ${lightColors.shadow1}, -3px -3px 7px ${lightColors.shadow2};
          transition: box-shadow 0.2s ease-in-out;
        }
        .neumorphic-shadow-subtle-light:hover {
          box-shadow: 4px 4px 9px ${lightColors.shadow1}, -4px -4px 9px ${lightColors.shadow2};
        }
        .neumorphic-shadow-subtle-dark {
          box-shadow: 3px 3px 7px ${darkColors.shadow1}, -3px -3px 7px ${darkColors.shadow2};
          transition: box-shadow 0.2s ease-in-out;
        }
        .neumorphic-shadow-subtle-dark:hover {
          box-shadow: 4px 4px 9px ${darkColors.shadow1}, -4px -4px 9px ${darkColors.shadow2};
        }

        /* Subtle Neumorphic shadows for inset elements */
        .neumorphic-inset-shadow-subtle-light {
          box-shadow: inset 3px 3px 7px ${lightColors.shadow1}, inset -3px -3px 7px ${lightColors.shadow2};
        }
        .neumorphic-inset-shadow-subtle-dark {
          box-shadow: inset 3px 3px 7px ${darkColors.shadow1}, inset -3px -3px 7px ${darkColors.shadow2};
        }

        /* Dropdown item specific styles */
        .dropdown-item-interactive-light {
          color: ${lightColors.textSecondary};
          transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out, color 0.2s ease-in-out;
        }
        .dropdown-item-interactive-light:hover {
          color: ${lightColors.textPrimary};
          box-shadow: inset 2px 2px 5px ${lightColors.shadow1}, inset -2px -2px 5px ${lightColors.shadow2};
        }
        .dropdown-item-interactive-dark {
          color: ${darkColors.textSecondary};
          transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out, color 0.2s ease-in-out;
        }
        .dropdown-item-interactive-dark:hover {
          color: ${darkColors.textPrimary};
          box-shadow: inset 2px 2px 5px ${darkColors.shadow1}, inset -2px -2px 5px ${darkColors.shadow2};
        }

        /* Enhanced hover for general cards/elements (more pronounced shadow) */
        /* No longer needed - integrated into base classes with :hover */
        /* .neumorphic-shadow-hover-light {
          box-shadow: 9px 9px 18px ${lightColors.shadow1}, -9px -9px 18px ${lightColors.shadow2};
        } */
        /* .neumorphic-shadow-hover-dark {
          box-shadow: 9px 9px 18px ${darkColors.shadow1}, -9px -9px 18px ${darkColors.shadow2};
        } */

        /* Enhanced hover for subtle buttons (slightly more pronounced shadow than base subtle) */
        /* No longer needed - integrated into base classes with :hover */
        /* .neumorphic-shadow-hover-enhanced-subtle-light {
          box-shadow: 4px 4px 9px ${lightColors.shadow1}, -4px -4px 9px ${lightColors.shadow2};
        } */
        /* .neumorphic-shadow-hover-enhanced-subtle-dark {
          box-shadow: 4px 4px 9px ${darkColors.shadow1}, -4px -4px 9px ${darkColors.shadow2};
        } */
      `}</style>
      <div className={`min-h-screen w-full flex flex-col items-center justify-center p-4 ${isDarkMode ? 'neumorphic-base-dark' : 'neumorphic-base-light'}`}>
        <div className={`w-full max-w-sm p-8 sm:p-10 rounded-xl ${isDarkMode ? 'neumorphic-shadow-dark' : 'neumorphic-shadow-light'}`}>
          <div className="text-center mb-8">
            <InsightFlowLogo />
            <h2 className={`mt-6 text-2xl sm:text-3xl font-bold font-montserrat text-[${lightColors.textPrimary}] dark:text-[${darkColors.textPrimary}]`}>
              Dashboard Login
            </h2>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); submitLoginCredentials(); }} className="space-y-6">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg text-sm transition-all duration-200 ease-in-out
                            ${isDarkMode ? 'neumorphic-base-dark neumorphic-inset-shadow-subtle-dark' : 'neumorphic-base-light neumorphic-inset-shadow-subtle-light'} 
                            text-[${lightColors.textPrimary}] dark:text-[${darkColors.textPrimary}] 
                            placeholder-[${lightColors.textSecondary}] dark:placeholder-[${darkColors.textSecondary}] 
                            focus:ring-2 focus:ring-[${lightColors.accent}] dark:focus:ring-[${darkColors.accent}] focus:outline-none`}
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg text-sm transition-all duration-200 ease-in-out
                            ${isDarkMode ? 'neumorphic-base-dark neumorphic-inset-shadow-subtle-dark' : 'neumorphic-base-light neumorphic-inset-shadow-subtle-light'} 
                            text-[${lightColors.textPrimary}] dark:text-[${darkColors.textPrimary}] 
                            placeholder-[${lightColors.textSecondary}] dark:placeholder-[${darkColors.textSecondary}] 
                            focus:ring-2 focus:ring-[${lightColors.accent}] dark:focus:ring-[${darkColors.accent}] focus:outline-none`}
                placeholder="Password"
              />
            </div>
            <div>
              <button
                type="submit"
                className={`w-full flex justify-center py-3 px-4 rounded-lg font-medium text-sm cursor-pointer transition-all duration-200 ease-in-out
                            text-[${lightColors.base}] dark:text-[${darkColors.base}] 
                            bg-[${lightColors.accent}] dark:bg-[${darkColors.accent}] 
                            ${isDarkMode ? 'neumorphic-shadow-dark active:neumorphic-inset-shadow-dark' : 'neumorphic-shadow-light active:neumorphic-inset-shadow-light'} 
                            hover:opacity-90`}>
                Login
              </button>
            </div>
          </form>
        </div>
         {/* Theme toggle for login screen */}
        <button
            onClick={switchColorMode} 
            className={`fixed top-4 right-4 p-2.5 rounded-full 
                       text-[${lightColors.textSecondary}] dark:text-[${darkColors.textSecondary}] 
                       ${isDarkMode ? 'neumorphic-shadow-subtle-dark active:neumorphic-inset-shadow-subtle-dark' : 'neumorphic-shadow-subtle-light active:neumorphic-inset-shadow-subtle-light'}
                       hover:text-[${lightColors.textPrimary}] dark:hover:text-[${darkColors.textPrimary}]
                       cursor-pointer transition-all duration-200 ease-in-out`}>
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
      </>
    );
  }

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap');
        body {
          font-family: 'Roboto', sans-serif;
          background-color: ${lightColors.base};
          color: ${lightColors.textPrimary};
          transition: background-color 0.3s ease, color 0.3s ease;
        }
        .dark body {
          background-color: ${darkColors.base};
          color: ${darkColors.textPrimary};
        }
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Montserrat', sans-serif;
          color: ${lightColors.textPrimary};
        }
        .dark h1, .dark h2, .dark h3, .dark h4, .dark h5, .dark h6 {
          color: ${darkColors.textPrimary};
        }
        .neumorphic-base-light {
          background-color: ${lightColors.base};
          color: ${lightColors.textPrimary};
        }
        .neumorphic-base-dark {
          background-color: ${darkColors.base};
          color: ${darkColors.textPrimary};
        }
        .neumorphic-shadow-light {
          box-shadow: 7px 7px 15px ${lightColors.shadow1}, -7px -7px 15px ${lightColors.shadow2};
          transition: box-shadow 0.3s ease-in-out;
        }
        .neumorphic-shadow-light:hover {
          box-shadow: 9px 9px 18px ${lightColors.shadow1}, -9px -9px 18px ${lightColors.shadow2};
        }
        .neumorphic-shadow-dark {
          box-shadow: 7px 7px 15px ${darkColors.shadow1}, -7px -7px 15px ${darkColors.shadow2};
          transition: box-shadow 0.3s ease-in-out;
        }
        .neumorphic-shadow-dark:hover {
          box-shadow: 9px 9px 18px ${darkColors.shadow1}, -9px -9px 18px ${darkColors.shadow2};
        }

        .neumorphic-inset-shadow-light {
          box-shadow: inset 7px 7px 15px ${lightColors.shadow1}, inset -7px -7px 15px ${lightColors.shadow2};
        }
        .neumorphic-inset-shadow-dark {
          box-shadow: inset 7px 7px 15px ${darkColors.shadow1}, inset -7px -7px 15px ${darkColors.shadow2};
        }
        .neumorphic-shadow-subtle-light {
          box-shadow: 3px 3px 7px ${lightColors.shadow1}, -3px -3px 7px ${lightColors.shadow2};
          transition: box-shadow 0.2s ease-in-out;
        }
        .neumorphic-shadow-subtle-light:hover {
          box-shadow: 4px 4px 9px ${lightColors.shadow1}, -4px -4px 9px ${lightColors.shadow2};
        }
        .neumorphic-shadow-subtle-dark {
          box-shadow: 3px 3px 7px ${darkColors.shadow1}, -3px -3px 7px ${darkColors.shadow2};
          transition: box-shadow 0.2s ease-in-out;
        }
        .neumorphic-shadow-subtle-dark:hover {
          box-shadow: 4px 4px 9px ${darkColors.shadow1}, -4px -4px 9px ${darkColors.shadow2};
        }

        .neumorphic-inset-shadow-subtle-light {
          box-shadow: inset 3px 3px 7px ${lightColors.shadow1}, inset -3px -3px 7px ${lightColors.shadow2};
        }
        .neumorphic-inset-shadow-subtle-dark {
          box-shadow: inset 3px 3px 7px ${darkColors.shadow1}, inset -3px -3px 7px ${darkColors.shadow2};
        }

        .dropdown-item-interactive-light {
          color: ${lightColors.textSecondary};
          transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out, color 0.2s ease-in-out;
        }
        .dropdown-item-interactive-light:hover {
          color: ${lightColors.textPrimary};
          box-shadow: inset 2px 2px 5px ${lightColors.shadow1}, inset -2px -2px 5px ${lightColors.shadow2};
        }
        .dropdown-item-interactive-dark {
          color: ${darkColors.textSecondary};
          transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out, color 0.2s ease-in-out;
        }
        .dropdown-item-interactive-dark:hover {
          color: ${darkColors.textPrimary};
          box-shadow: inset 2px 2px 5px ${darkColors.shadow1}, inset -2px -2px 5px ${darkColors.shadow2};
        }

      `}</style>

      <div className={`min-h-screen flex flex-col ${isDarkMode ? 'neumorphic-base-dark' : 'neumorphic-base-light'}`}>
        <nav className={`${isDarkMode ? 'neumorphic-base-dark' : 'neumorphic-base-light'} sticky top-0 z-30`}>
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center gap-3 relative pr-8 mr-8">
                  <InsightFlowLogo />
                  <span className={`font-montserrat text-2xl font-bold text-[${lightColors.accent}] dark:text-[${darkColors.accent}] hidden sm:block`}>InsightFlow</span>
                  <div className={`absolute right-0 top-[-10px] h-[calc(100%+20px)] w-px bg-[${lightColors.shadow1}] dark:bg-[${darkColors.shadow1}] opacity-50 hidden sm:block`}></div>
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-1">
                    {navLinks.map((link) => (
                      <a
                        key={link.name}
                        href={link.href}
                        onClick={() => setActiveLink(link.name)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200
                          text-[${lightColors.textSecondary}] dark:text-[${darkColors.textSecondary}]
                          hover:text-[${lightColors.textPrimary}] dark:hover:text-[${darkColors.textPrimary}]
                          focus:outline-none
                          ${activeLink === link.name 
                            ? `${isDarkMode ? 'neumorphic-inset-shadow-dark' : 'neumorphic-inset-shadow-light'} text-[${lightColors.textPrimary}] dark:text-[${darkColors.textPrimary}]`
                            : `${isDarkMode ? 'neumorphic-shadow-dark' : 'neumorphic-shadow-light'} hover:shadow-[4px_4px_8px_${isDarkMode ? darkColors.shadow1 : lightColors.shadow1},_-4px_-4px_8px_${isDarkMode ? darkColors.shadow2 : lightColors.shadow2}]`
                          }`}
                      >
                        {link.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center ml-auto md:ml-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={switchColorMode}
                    className={`p-2.5 rounded-full 
                               text-[${lightColors.textSecondary}] dark:text-[${darkColors.textSecondary}] 
                               hover:text-[${lightColors.textPrimary}] dark:hover:text-[${darkColors.textPrimary}]
                               focus:outline-none cursor-pointer transition-all duration-200 ease-in-out
                               ${isDarkMode ? 'neumorphic-shadow-subtle-dark active:neumorphic-inset-shadow-subtle-dark' : 'neumorphic-shadow-subtle-light active:neumorphic-inset-shadow-subtle-light'}`}>
                    <span className="sr-only">Toggle dark mode</span>
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                  </button>
                
                  <div className="relative" ref={notificationDropdownRef}>
                    <button
                      onClick={displayNotificationPanel}
                      className={`p-2.5 rounded-full 
                                 text-[${lightColors.textSecondary}] dark:text-[${darkColors.textSecondary}] 
                                 hover:text-[${lightColors.textPrimary}] dark:hover:text-[${darkColors.textPrimary}]
                                 focus:outline-none cursor-pointer transition-all duration-200 ease-in-out
                                 ${isDarkMode ? 'neumorphic-shadow-subtle-dark active:neumorphic-inset-shadow-subtle-dark' : 'neumorphic-shadow-subtle-light active:neumorphic-inset-shadow-subtle-light'}`}>
                      <span className="sr-only">View notifications</span>
                      <Bell size={20} />
                      <span className={`absolute top-0.5 right-0.5 block h-2.5 w-2.5 rounded-full ring-2 ${isDarkMode ? 'ring-['+darkColors.base+']' : 'ring-['+lightColors.base+']' } bg-red-500`}></span>
                    </button>
                    {isNotificationDropdownOpen && (
                      <div className={`origin-top-right absolute right-0 mt-3 w-80 rounded-lg py-1 
                                     ${isDarkMode ? 'neumorphic-base-dark neumorphic-shadow-dark' : 'neumorphic-base-light neumorphic-shadow-light'} z-20 sm:w-96 md:w-80`}>
                        <div className={`px-4 py-3 text-sm font-semibold border-b 
                                       text-[${lightColors.textPrimary}] dark:text-[${darkColors.textPrimary}] 
                                       ${isDarkMode ? 'border-['+darkColors.shadow1+']' : 'border-['+lightColors.shadow1+']'} opacity-50`}>Notifications</div>
                        {
                          [
                            { icon: <ShoppingCart size={16} className="text-blue-500"/>, title: 'New order received (#12345)', time: '5 minutes ago' },
                            { icon: <LineChartIcon size={16} className="text-red-500"/>, title: 'Traffic dropped by 15%', time: '1 hour ago' },
                            { icon: <Users size={16} className="text-green-500"/>, title: 'New customer registered', time: '3 hours ago' },
                            { icon: <MessageSquare size={16} className="text-yellow-500"/>, title: 'Comment on \'Creative Brandbook\'', time: 'Yesterday' },
                          ].map(item => (
                            <a key={item.title} href="#" className={`flex items-center gap-3 px-4 py-3 text-sm 
                                                                  cursor-pointer 
                                                                  ${isDarkMode ? 'dropdown-item-interactive-dark' : 'dropdown-item-interactive-light'}`}>
                              <span className="flex-shrink-0">{item.icon}</span>
                              <div className="flex-grow">
                                <p>{item.title}</p>
                                <p className={`text-xs text-[${lightColors.textSecondary}] dark:text-[${darkColors.textSecondary}] opacity-75`}>{item.time}</p>
                              </div>
                            </a>
                          ))
                        }
                        <div className={`${isDarkMode ? 'border-['+darkColors.shadow1+']' : 'border-['+lightColors.shadow1+']'} opacity-50`}>
                          <a href="#" className={`block px-4 py-3 text-sm text-center 
                                                cursor-pointer 
                                                ${isDarkMode ? 'dropdown-item-interactive-dark' : 'dropdown-item-interactive-light'}`}>
                            View All Notifications
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className={`h-6 w-px ${isDarkMode ? 'bg-['+darkColors.shadow1+']' : 'bg-['+lightColors.shadow1+']'} opacity-50 hidden sm:block`}></div>

                  <div className="relative" ref={profileDropdownRef}>
                    <button
                      onClick={toggleProfileVisibility}
                      className={`max-w-xs rounded-full flex items-center text-sm p-1 cursor-pointer transition-all duration-200
                                 ${isDarkMode ? 'neumorphic-shadow-subtle-dark active:neumorphic-inset-shadow-subtle-dark' : 'neumorphic-shadow-subtle-light active:neumorphic-inset-shadow-subtle-light'} ease-in-out`}
                      id="user-menu-button"
                    >
                      <span className="sr-only">Open user menu</span>
                      <img 
                        className={`h-8 w-8 rounded-full object-cover ${isDarkMode ? 'neumorphic-inset-shadow-dark' : 'neumorphic-inset-shadow-light'}`} 
                        src="https://images.unsplash.com/photo-1745177717290-9ce463cdc5e1?q=80&w=3269&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="User profile"
                      />
                      <div className="text-left hidden sm:block ml-2">
                        <div className={`text-sm font-medium text-[${lightColors.textPrimary}] dark:text-[${darkColors.textPrimary}]`}>Jonah Miller</div>
                        <div className={`text-xs font-medium text-[${lightColors.textSecondary}] dark:text-[${darkColors.textSecondary}]`}>Administrator</div>
                      </div>
                      <div className="hidden sm:flex flex-col items-center ml-1">
                          <ChevronUp size={12} className={`text-[${lightColors.textSecondary}] dark:text-[${darkColors.textSecondary}] -mb-1`} />
                          <ChevronDown size={12} className={`text-[${lightColors.textSecondary}] dark:text-[${darkColors.textSecondary}] -mt-1`} />
                      </div>
                    </button>
                    {isProfileDropdownOpen && (
                       <div 
                        className={`origin-top-right absolute right-0 mt-3 w-48 rounded-lg py-1 
                                   ${isDarkMode ? 'neumorphic-base-dark neumorphic-shadow-dark' : 'neumorphic-base-light neumorphic-shadow-light'} z-20`}
                        role="menu" 
                        aria-orientation="vertical" 
                        aria-labelledby="user-menu-button"
                      >
                        {
                          [
                            { label: 'View Profile', icon: <UserCircle size={16} className={`mr-2 text-[${lightColors.textSecondary}] dark:text-[${darkColors.textSecondary}]`}/> },
                            { label: 'Billing', icon: <CreditCard size={16} className={`mr-2 text-[${lightColors.textSecondary}] dark:text-[${darkColors.textSecondary}]`}/> },
                            { label: 'Help Center', icon: <LifeBuoy size={16} className={`mr-2 text-[${lightColors.textSecondary}] dark:text-[${darkColors.textSecondary}]`}/> },
                            { label: 'Account Settings', icon: <Settings size={16} className={`mr-2 text-[${lightColors.textSecondary}] dark:text-[${darkColors.textSecondary}]`}/> },
                          ].map(item => (
                            <a key={item.label} href="#" className={`flex items-center px-4 py-2 text-sm 
                                                                  cursor-pointer 
                                                                  ${isDarkMode ? 'dropdown-item-interactive-dark' : 'dropdown-item-interactive-light'}`} role="menuitem">
                              {item.icon} {item.label}
                            </a>
                          ))
                        }
                        <div className={`${isDarkMode ? 'border-['+darkColors.shadow1+']' : 'border-['+lightColors.shadow1+']'} opacity-50 my-1`}></div>
                        <a 
                          href="#" 
                          onClick={(e) => { e.preventDefault(); signOutUser(); }}
                          className={`flex items-center px-4 py-2 text-sm cursor-pointer 
                                              ${isDarkMode ? 'dropdown-item-interactive-dark' : 'dropdown-item-interactive-light'}`} 
                          role="menuitem"
                        >
                          <LogOut size={16} className={`mr-2 text-[${lightColors.textSecondary}] dark:text-[${darkColors.textSecondary}]`} />
                           Logout
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <main className={`flex-grow p-4 sm:p-6 lg:p-8`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h1 className={`text-2xl lg:text-3xl font-montserrat font-semibold`}>
                Hello, Jonah Miller
              </h1>
              <p className={`text-sm mt-1 text-[${lightColors.textSecondary}] dark:text-[${darkColors.textSecondary}]`}>
                It's great to see you again.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7 mb-6 sm:mb-8">
            {
              [
                {
                  title: 'Total Revenue',
                  value: `$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                  change: `${totalRevenueChange >= 0 ? '+' : ''}${totalRevenueChange.toFixed(1)}%`,
                  changeType: totalRevenueChangeType,
                  previous: `$${displayedPrevTotalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} last period`,
                  icon: <Wallet size={20} />
                },
                {
                  title: 'Average Order Value',
                  value: `$${averageOrderValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                  change: `${aovChange >= 0 ? '+' : ''}${aovChange.toFixed(1)}%`,
                  changeType: aovChangeType,
                  previous: `$${displayedPrevAOV.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} last period`,
                  icon: <ShoppingCart size={20} />
                },
                {
                  title: 'Transaction Count',
                  value: transactionCount.toLocaleString('en-US'),
                  change: `${transactionCountChange >= 0 ? '+' : ''}${transactionCountChange.toFixed(1)}%`,
                  changeType: transactionCountChangeType,
                  previous: `${displayedPrevTransactionCount.toLocaleString('en-US')} last period`,
                  icon: <PackageOpen size={20} />
                }
              ].map((stat, index) => (
                <div key={index} 
                     className={`p-5 rounded-xl flex flex-col gap-2
                                ${isDarkMode ? 'neumorphic-base-dark neumorphic-shadow-dark' : 'neumorphic-base-light neumorphic-shadow-light'}`}>
                  <div className="flex items-start justify-between">
                    <div className={`p-2.5 rounded-full ${isDarkMode ? 'neumorphic-inset-shadow-dark' : 'neumorphic-inset-shadow-light'} text-[${lightColors.accent}] dark:text-[${darkColors.accent}]`}>
                      {React.cloneElement(stat.icon, { className: `text-[${lightColors.accent}] dark:text-[${darkColors.accent}]` })}
                    </div>
                    <span 
                      className={`text-xs font-semibold px-3 py-1 rounded-full flex items-center ${isDarkMode ? 'neumorphic-shadow-dark' : 'neumorphic-shadow-light'}
                        ${stat.changeType === 'positive' 
                          ? `text-green-600 dark:text-green-400` 
                          : `text-red-600 dark:text-red-400`
                        }`}
                    >
                      {stat.changeType === 'positive' ? <ChevronUp size={12} className="mr-1"/> : <ChevronDown size={12} className="mr-1"/>}
                      {stat.change}
                    </span>
                  </div>
                  <div className="mt-1">
                    <h3 className={`text-sm font-medium font-montserrat text-[${lightColors.textSecondary}] dark:text-[${darkColors.textSecondary}]`}>
                      {stat.title}
                    </h3>
                    <p className={`text-2xl font-semibold mt-px text-[${lightColors.textPrimary}] dark:text-[${darkColors.textPrimary}]`}>
                      {stat.value}
                    </p>
                    <p className={`text-xs mt-1 text-[${lightColors.textSecondary}] dark:text-[${darkColors.textSecondary}] opacity-75`}>
                      {stat.previous}
                    </p>
                  </div>
                </div>
              ))
            }
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-7 mb-6 sm:mb-8">

            <div className={`lg:col-span-2 p-5 sm:p-6 rounded-xl 
                           ${isDarkMode ? 'neumorphic-base-dark neumorphic-shadow-dark' : 'neumorphic-base-light neumorphic-shadow-light'}`}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5">
                <div className="flex items-center relative">
                  <h3 className={`text-lg font-semibold font-montserrat text-[${lightColors.textPrimary}] dark:text-[${darkColors.textPrimary}]`}>
                    Sales Performance
                  </h3>
                  <Info 
                    size={14} 
                    className={`ml-2 cursor-pointer text-[${lightColors.textSecondary}] dark:text-[${darkColors.textSecondary}]`}
                    onMouseEnter={() => setIsSalesInfoTooltipVisible(true)}
                    onMouseLeave={() => setIsSalesInfoTooltipVisible(false)}
                  />
                  {isSalesInfoTooltipVisible && (
                    <div className={`absolute left-full top-1/2 -translate-y-1/2 ml-3 p-2.5 rounded-md text-xs w-max max-w-xs 
                                   ${isDarkMode ? 'neumorphic-base-dark neumorphic-shadow-subtle-dark' : 'neumorphic-base-light neumorphic-shadow-subtle-light'} 
                                   text-[${isDarkMode ? darkColors.textSecondary : lightColors.textSecondary}] z-10`}>
                      This chart shows sales trends for the selected period, comparing current data to the previous equivalent period.
                    </div>
                  )}
                </div>
                <div className={`mt-3 sm:mt-0 inline-flex rounded-lg ${isDarkMode ? 'neumorphic-shadow-dark' : 'neumorphic-shadow-light'} overflow-hidden`}>
                  {['12 months', '30 days', '7 days', '24 hours'].map((filter, idx, arr) => (
                    <a 
                      key={filter} 
                      href="#" 
                      onClick={() => selectAnalyticsTimeframe(filter)}
                      className={`px-3.5 py-2 text-xs font-medium cursor-pointer transition-all duration-200 
                        text-[${lightColors.textSecondary}] dark:text-[${darkColors.textSecondary}]
                        hover:text-[${isDarkMode ? darkColors.textPrimary : lightColors.textPrimary}] 
                        focus:outline-none
                        ${activeAnalyticsTimeFilter === filter 
                          ? `${isDarkMode ? 'neumorphic-inset-shadow-dark' : 'neumorphic-inset-shadow-light'} text-[${isDarkMode ? darkColors.textPrimary : lightColors.textPrimary}]` 
                          : `${isDarkMode 
                              ? `hover:shadow-[inset_7px_7px_15px_${darkColors.shadow1},_inset_-7px_-7px_15px_${darkColors.shadow2}]` 
                              : `hover:shadow-[inset_7px_7px_15px_${lightColors.shadow1},_inset_-7px_-7px_15px_${lightColors.shadow2}]`}`
                        }
                        ${idx < arr.length - 1 ? `${isDarkMode ? 'border-r border-['+darkColors.shadow1+']' : 'border-r border-['+lightColors.shadow1+']'}` : ''}
                      `}
                    >
                      {filter}
                    </a>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 flex flex-col gap-6 pt-2">
                  {
                    [
                      { label: 'Total Sales Value', value: displayTotalSalesValueKPI, borderColorClass: `border-purple-500 dark:border-purple-400`, percentage: null },
                      { label: 'Units Sold', value: displayUnitsSoldKPI, borderColorClass: `border-[${lightColors.textSecondary}] dark:border-[${darkColors.textSecondary}] opacity-50`, percentage: null },
                      { label: 'Avg. Items per Order', value: displayAvgItemsPerOrderKPI, borderColorClass: `border-[${lightColors.textSecondary}] dark:border-[${darkColors.textSecondary}] opacity-50`, percentage: '+0.1' } 
                    ].map(kpi => (
                      <div key={kpi.label} className={`relative pl-3.5 border-l-2 ${kpi.borderColorClass}`}>
                        <p className={`text-xs text-[${lightColors.textSecondary}] dark:text-[${darkColors.textSecondary}]`}>{kpi.label}</p>
                        <p className={`text-xl font-semibold text-[${lightColors.textPrimary}] dark:text-[${darkColors.textPrimary}]`}>
                          {kpi.value}
                          {kpi.percentage && (
                            <span className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded-full align-middle 
                                           ${isDarkMode ? 'neumorphic-shadow-dark' : 'neumorphic-shadow-light'} 
                                           text-green-600 dark:text-green-400`}>
                              <ChevronUp size={10} className="inline mr-0.5" />{kpi.percentage}
                            </span>
                          )}
                        </p>
                      </div>
                    ))
                  }
                </div>
                <div className={`md:col-span-2 h-64 p-2 rounded-lg ${isDarkMode ? 'neumorphic-inset-shadow-dark' : 'neumorphic-inset-shadow-light'}`}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsChartData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? darkColors.shadow1 : lightColors.shadow1} vertical={false} opacity={0.5}/>
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: isDarkMode ? darkColors.textSecondary : lightColors.textSecondary }} tickLine={false} axisLine={{stroke: isDarkMode ? darkColors.shadow1 : lightColors.shadow1, opacity:0.5}}/>
                      <YAxis tickFormatter={(value) => `${value / 1000}k`} tick={{ fontSize: 10, fill: isDarkMode ? darkColors.textSecondary : lightColors.textSecondary }} tickLine={false} axisLine={false}/>
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: isDarkMode ? `rgba(209,213,219,0.05)` : `rgba(26,32,44,0.03)` }}/>
                      <Bar dataKey="Current" name="Current Period Sales" fill="#4a90e2" radius={[3, 3, 0, 0]} barSize={10}/>
                      <Bar dataKey="Previous" name="Previous Period Sales" fill={isDarkMode ? darkColors.textSecondary : lightColors.shadow1} radius={[3, 3, 0, 0]} barSize={10}/>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>


            <div className={`lg:col-span-1 p-5 sm:p-6 rounded-xl 
                           ${isDarkMode ? 'neumorphic-base-dark neumorphic-shadow-dark' : 'neumorphic-base-light neumorphic-shadow-light'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-lg font-semibold font-montserrat text-[${lightColors.textPrimary}] dark:text-[${darkColors.textPrimary}]`}>
                  Impressions
                </h3>
                <div className="relative" ref={impressionsFilterDropdownRef}>
                  <button 
                    onClick={() => setIsImpressionsFilterDropdownOpen(!isImpressionsFilterDropdownOpen)}
                    className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium 
                               cursor-pointer transition-all duration-200 ease-in-out w-32 sm:w-36 
                               text-[${lightColors.textSecondary}] dark:text-[${darkColors.textSecondary}] 
                               hover:text-[${lightColors.textPrimary}] dark:hover:text-[${darkColors.textPrimary}]
                               ${isDarkMode ? 'neumorphic-shadow-subtle-dark active:neumorphic-inset-shadow-subtle-dark' : 'neumorphic-shadow-subtle-light active:neumorphic-inset-shadow-subtle-light'}`}
                  >
                    <span>{activeImpressionsRegionFilter}</span>
                    <ChevronDown size={14} className={`ml-1 transition-transform duration-200 ${isImpressionsFilterDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isImpressionsFilterDropdownOpen && (
                    <div className={`origin-top-right absolute right-0 mt-2 w-full rounded-lg py-1 
                                   ${isDarkMode ? 'neumorphic-base-dark neumorphic-shadow-dark' : 'neumorphic-base-light neumorphic-shadow-light'} z-20`}>
                      {impressionRegionFilters.map(region => (
                        <a 
                          key={region} 
                          href="#" 
                          onClick={(e) => { 
                            e.preventDefault(); 
                            chooseImpressionsRegion(region); 
                            setIsImpressionsFilterDropdownOpen(false); 
                          }}
                          className={`block px-4 py-2 text-xs 
                                     cursor-pointer 
                                     ${activeImpressionsRegionFilter === region 
                                        ? `font-semibold text-[${isDarkMode ? darkColors.textPrimary : lightColors.textPrimary}]` 
                                        : `text-[${isDarkMode ? darkColors.textSecondary : lightColors.textSecondary}]`}
                                     ${isDarkMode ? 'dropdown-item-interactive-dark' : 'dropdown-item-interactive-light'}`}
                        >
                          {region}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className={`relative pl-3.5 border-l-2 border-[${lightColors.textSecondary}] dark:border-[${darkColors.textSecondary}] opacity-50 mb-5`}>
                <p className={`text-xs text-[${lightColors.textSecondary}] dark:text-[${darkColors.textSecondary}]`}>Total</p>
                <p className={`text-xl font-semibold text-[${lightColors.textPrimary}] dark:text-[${darkColors.textPrimary}]`}>{totalImpressionsForSelectedRegion}</p>
              </div>

              <div className="space-y-4">
                {
                  impressionsDisplayData.map(country => (
                    <div key={country.name} className="flex items-center gap-3">
                      <img src={country.flag} alt={`${country.name} flag`} className={`w-8 h-8 rounded-full object-cover ${isDarkMode ? 'neumorphic-shadow-dark' : 'neumorphic-shadow-light'} flex-shrink-0`} />
                      <div className="flex-grow">
                        <div className="flex justify-between items-center mb-1">
                          <span className={`text-sm font-medium text-[${lightColors.textPrimary}] dark:text-[${darkColors.textPrimary}]`}>{country.name}</span>
                          <span className={`text-xs text-[${lightColors.textSecondary}] dark:text-[${darkColors.textSecondary}]`}>{country.value}</span>
                        </div>
                        <div className={`w-full h-2 rounded-full ${isDarkMode ? 'neumorphic-inset-shadow-dark' : 'neumorphic-inset-shadow-light'}`}>
                          <div 
                            className={`h-2 rounded-full ${isDarkMode ? 'neumorphic-shadow-dark' : 'neumorphic-shadow-light'} opacity-75 `}
                            style={{ width: country.progress, backgroundColor: isDarkMode ? darkColors.accent : lightColors.accent, transition: 'width 0.3s ease-in-out' }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-7 mb-6 sm:mb-8">
            <div className={`lg:col-span-2 rounded-xl p-0 
                           ${isDarkMode ? 'neumorphic-base-dark neumorphic-shadow-dark' : 'neumorphic-base-light neumorphic-shadow-light'} overflow-hidden`}>
              <div className={`p-5 sm:p-6 border-b ${isDarkMode ? 'border-['+darkColors.shadow1+']' : 'border-['+lightColors.shadow1+']'} ${isDarkMode ? 'border-opacity-60' : 'border-opacity-60'}`}>
                <h3 className={`text-lg font-semibold font-montserrat text-[${lightColors.textPrimary}] dark:text-[${darkColors.textPrimary}]`}>Products</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-sm text-left">
                  <thead className={`border-b-2 ${isDarkMode ? 'border-['+darkColors.shadow1+']' : 'border-['+lightColors.shadow1+']'} ${isDarkMode ? 'border-opacity-60' : 'border-opacity-60'}`}>
                    <tr>
                      {([
                        { label: 'No.', key: 'no' as keyof Product },
                        { label: 'Name', key: 'name' as keyof Product },
                        { label: 'Status', key: 'status' as keyof Product },
                        { label: 'Views', key: 'views' as keyof Product },
                        { label: 'Sales', key: 'sales' as keyof Product },
                        { label: 'Conversion', key: 'conversion' as keyof Product },
                        { label: 'Total', key: 'total' as keyof Product }
                      ] as { label: string; key: keyof Product }[]).map((header) => (
                        <th 
                          key={header.key} 
                          scope="col" 
                          className={`p-4 font-semibold tracking-wider whitespace-nowrap text-[${lightColors.textPrimary}] dark:text-[${darkColors.textPrimary}] cursor-pointer select-none`}
                          onClick={() => changeProductSortOrder(header.key)}
                        >
                          {header.label}
                          <span className="ml-1.5 inline-block align-middle">
                            {sortConfig.key === header.key ? (
                              sortConfig.direction === 'ascending' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                            ) : (
                              <ChevronsUpDown size={14} className="opacity-30" />
                            )}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sortedProducts.map((product) => (
                        <tr key={product.no} className={`border-b ${isDarkMode ? 'border-['+darkColors.shadow1+']' : 'border-['+lightColors.shadow1+']'} ${isDarkMode ? 'border-opacity-50' : 'border-opacity-50'} last:border-b-0 hover:bg-[${isDarkMode ? darkColors.shadow2 : lightColors.shadow1}]/20 dark:hover:bg-[${isDarkMode ? darkColors.shadow2 : lightColors.shadow1}]/20 transition-colors`}>
                          <td className={`p-4 whitespace-nowrap text-[${lightColors.textSecondary}] dark:text-[${darkColors.textSecondary}]`}>{product.no}</td>
                          <td className={`p-4 whitespace-nowrap text-[${lightColors.textPrimary}] dark:text-[${darkColors.textPrimary}]`}>
                            <div className="flex items-center">
                              <span className={`mr-3 p-2 rounded-lg text-white ${product.iconBgClass} ${isDarkMode ? 'neumorphic-shadow-dark' : 'neumorphic-shadow-light'}`}> 
                                {product.icon}
                              </span>
                              <span className="font-medium">{product.name}</span>
                            </div>
                          </td>
                          <td className={`p-4 whitespace-nowrap text-[${lightColors.textSecondary}] dark:text-[${darkColors.textSecondary}]`}>
                            <CheckCircle size={14} className={`inline mr-1.5 text-green-500 dark:text-green-400`} />
                            {product.status}
                          </td>
                          <td className={`p-4 whitespace-nowrap text-[${lightColors.textSecondary}] dark:text-[${darkColors.textSecondary}]`}>{product.views}</td>
                          <td className={`p-4 whitespace-nowrap text-[${lightColors.textSecondary}] dark:text-[${darkColors.textSecondary}]`}>{product.sales}</td>
                          <td className={`p-4 whitespace-nowrap text-[${lightColors.textSecondary}] dark:text-[${darkColors.textSecondary}]`}>{product.conversion}</td>
                          <td className={`p-4 font-medium whitespace-nowrap text-[${lightColors.textPrimary}] dark:text-[${darkColors.textPrimary}]`}>{product.total}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>

            <div className={`lg:col-span-1 p-5 sm:p-6 rounded-xl 
                           ${isDarkMode ? 'neumorphic-base-dark neumorphic-shadow-dark' : 'neumorphic-base-light neumorphic-shadow-light'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-lg font-semibold font-montserrat text-[${lightColors.textPrimary}] dark:text-[${darkColors.textPrimary}]`}>
                  Payments
                </h3>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center 
                                ${isDarkMode ? 'neumorphic-shadow-dark' : 'neumorphic-shadow-light'} 
                                text-green-600 dark:text-green-400`}>
                  <ChevronUp size={12} className="mr-1" />
                  +12.7%
                </span>
              </div>
               <div className={`mb-5 inline-flex rounded-lg ${isDarkMode ? 'neumorphic-shadow-dark' : 'neumorphic-shadow-light'} overflow-hidden w-full sm:w-auto`}>
                {['12 months', '30 days', '7 days', '24 hours'].map((filter, idx, arr) => (
                  <a 
                    key={filter} 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); setPaymentsChartPeriod(filter); }}
                    className={`flex-1 sm:flex-none px-3.5 py-2 text-xs font-medium text-center cursor-pointer transition-all duration-200 
                      text-[${lightColors.textSecondary}] dark:text-[${darkColors.textSecondary}]
                      hover:text-[${isDarkMode ? darkColors.textPrimary : lightColors.textPrimary}] 
                      focus:outline-none
                      ${activePaymentsCardTimeFilter === filter 
                        ? `${isDarkMode ? 'neumorphic-inset-shadow-dark' : 'neumorphic-inset-shadow-light'} text-[${isDarkMode ? darkColors.textPrimary : lightColors.textPrimary}]` 
                        : `${isDarkMode 
                            ? `hover:shadow-[inset_7px_7px_15px_${darkColors.shadow1},_inset_-7px_-7px_15px_${darkColors.shadow2}]` 
                            : `hover:shadow-[inset_7px_7px_15px_${lightColors.shadow1},_inset_-7px_-7px_15px_${lightColors.shadow2}]`}`
                      }
                      ${idx < arr.length - 1 ? `${isDarkMode ? 'border-r border-['+darkColors.shadow1+']' : 'border-r border-['+lightColors.shadow1+']'}` : ''}
                    `}
                  >
                    {filter}
                  </a>
                ))}
              </div>
              <div className={`h-64 p-2 rounded-lg ${isDarkMode ? 'neumorphic-inset-shadow-dark' : 'neumorphic-inset-shadow-light'}`}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={paymentsDisplayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? darkColors.shadow1 : lightColors.shadow1} vertical={false} opacity={0.5}/>
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: isDarkMode ? darkColors.textSecondary : lightColors.textSecondary }} tickLine={false} axisLine={{stroke: isDarkMode ? darkColors.shadow1 : lightColors.shadow1, opacity:0.5}} />
                    <YAxis tickFormatter={(value) => `${value / 1000}k`} tick={{ fontSize: 10, fill: isDarkMode ? darkColors.textSecondary : lightColors.textSecondary }} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#68d391', strokeWidth: 1, fill: 'transparent' }}/>
                    <Line type="monotone" dataKey="payments" stroke="#68d391" strokeWidth={2} dot={{ r: 3, fill: '#68d391'}} activeDot={{ r: 5, className: 'neumorphic-shadow-light dark:neumorphic-shadow-dark' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </main>
        <footer className={`py-6 sm:py-8 mt-auto 
                           ${isDarkMode ? 'neumorphic-base-dark neumorphic-inset-shadow-dark' : 'neumorphic-base-light neumorphic-inset-shadow-light'} 
                           border-t border-[${lightColors.shadow1}] dark:border-[${darkColors.shadow1}] border-opacity-30 dark:border-opacity-30`}>
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className={`text-xs sm:text-sm text-[${lightColors.textSecondary}] dark:text-[${darkColors.textSecondary}]`}>
              &copy; {new Date().getFullYear()} InsightFlow. All rights reserved.
            </p>
            <div className="flex items-center gap-x-4 sm:gap-x-6">
              {
                [
                  { name: 'Privacy Policy', href: '#' },
                  { name: 'Terms of Service', href: '#' },
                  { name: 'Contact Us', href: '#' },
                ].map(link => (
                  <a 
                    key={link.name} 
                    href={link.href} 
                    className={`text-xs sm:text-sm cursor-pointer 
                               text-[${lightColors.textSecondary}] dark:text-[${darkColors.textSecondary}] 
                               hover:text-[${lightColors.textPrimary}] dark:hover:text-[${darkColors.textPrimary}] 
                               transition-colors duration-200 ease-in-out`}
                  >
                    {link.name}
                  </a>
                ))
              }
            </div>
          </div>
        </footer>

      </div>
    </>
  );
};

export default DashboardPage;
