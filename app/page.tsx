'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image'; 
import { Montserrat, Roboto } from 'next/font/google';
import { Bell, Users, Briefcase, BellRing, Settings, LogOut, User, CheckCircle, X, ArrowUp, ArrowDown, CalendarCheck, UserPlus, Info, ChevronDown, Search, CalendarDays, ArrowRight, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip,
  ComposedChart,
  Bar,
  Cell,
  BarChart,
  CartesianGrid
} from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { SiGooglemeet } from 'react-icons/si'; 
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa'; 


const montserrat = Montserrat({ subsets: ['latin'], weight: ['600', '700'] }); 
const roboto = Roboto({ subsets: ['latin'], weight: ['400', '500', '700'] }); 
const timeRanges = ['1D', '7D', '1M', '6M', '1Y'];
const filterOptions = ["This week", "Last Week", "Two weeks ago"]; 
const NotificationItem: React.FC<{
  icon: React.ElementType; 
  text: string;
  href?: string;
  iconColor?: string; 
}> = ({ icon: IconComponent, text, href = "#", iconColor }) => {
  return (
    <a 
      href={href} 
      className="flex items-start p-3 text-sm hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-md cursor-pointer group transition-colors duration-150 ease-in-out"
    >
      <IconComponent 
        className={`mr-3 h-5 w-5 flex-shrink-0 mt-0.5 group-hover:text-gray-600 dark:group-hover:text-neutral-100 ${iconColor ? iconColor : 'text-gray-500 dark:text-neutral-400'} transition-colors duration-150 ease-in-out`}
      />
      <span className="leading-snug">{text}</span>
    </a>
  );
};

const MiniBarChart: React.FC<{
    data: number[];
    colorClass: string;
}> = ({ data, colorClass }) => {
    const maxValue = Math.max(...data, 1);
    return (
        <div className="flex items-end h-8 space-x-px">
            {data.map((value, index) => (
                <div
                    key={index}
                    className={`w-1 rounded-t-sm ${colorClass}`}
                    style={{ height: `${Math.max((value / maxValue) * 100, 5)}%` }}
                />
            ))}
        </div>
    );
};interface StatCardData {
  id: number;
  icon: React.ElementType;
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  chartData: number[];
  description: string;
}

const initialStatCardItems: StatCardData[] = [
    { id: 1, title: 'TOTAL EMPLOYEES', value: '220', icon: Users, change: '2.5%', changeType: 'increase', chartData: [5, 6, 8, 7, 9, 6, 10], description: 'Total number of active employees in the company.' },
    { id: 2, title: 'ATTENDANCE RATE', value: '98%', icon: CalendarCheck, change: '4.1%', changeType: 'decrease', chartData: [10, 9, 8, 9, 7, 6, 5], description: 'Percentage of employees marked present today.' },
    { id: 3, title: 'NEW HIRES', value: '05', icon: UserPlus, change: '2.6%', changeType: 'decrease', chartData: [8, 7, 6, 5, 6, 4, 3], description: 'Number of employees onboarded this month.' },
    { id: 4, title: 'ACTIVE PROJECTS', value: '143', icon: Briefcase, change: '6.2%', changeType: 'increase', chartData: [4, 5, 6, 7, 6, 8, 9], description: 'Total number of projects currently in progress.' },
];
const initialAttendanceData: AttendanceEntry[] = [
  { name: 'Mon', t0700: 0, t0900: 1, t1100: 1, t1300: 2, t1500: 1, t1700: 0, t1900: 0 },
  { name: 'Tue', t0700: 1, t0900: 2, t1100: 3, t1300: 3, t1500: 2, t1700: 1, t1900: 0 },
  { name: 'Wed', t0700: 1, t0900: 3, t1100: 3, t1300: 3, t1500: 3, t1700: 2, t1900: 0 },
  { name: 'Thu', t0700: 0, t0900: 2, t1100: 3, t1300: 3, t1500: 2, t1700: 1, t1900: 0 },
  { name: 'Fri', t0700: 0, t0900: 1, t1100: 2, t1300: 2, t1500: 1, t1700: 0, t1900: 0 },
  { name: 'Sat', t0700: 0, t0900: 0, t1100: 0, t1300: 1, t1500: 0, t1700: 0, t1900: 0 },
  { name: 'Sun', t0700: 0, t0900: 0, t1100: 0, t1300: 0, t1500: 0, t1700: 0, t1900: 0 },
];
const timeSlots = Object.keys(initialAttendanceData[0]).filter(k => k !== 'name');
const initialProjectData = [
  { day: 'Mo', inProgress: 8, completed: 15 },
  { day: 'Tu', inProgress: 12, completed: 19 },
  { day: 'We', inProgress: 9, completed: 12 },
  { day: 'Th', inProgress: 15, completed: 25 },
  { day: 'Fr', inProgress: 7, completed: 10 },
  { day: 'Sa', inProgress: 3, completed: 5 },
  { day: 'Su', inProgress: 2, completed: 3 },
];
const daysOfWeek = initialProjectData.map(d => d.day);
const initialInProgressSum = initialProjectData.reduce((sum, item) => sum + item.inProgress, 0);
const initialCompletedSum = initialProjectData.reduce((sum, item) => sum + item.completed, 0);
const generateRandomChartData = (length = 7, min = 3, max = 10) => {
  return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
};
const generateRandomStatData = (id: number): Partial<StatCardData> => {
  const change = `${(Math.random() * 5 + 1).toFixed(1)}%`; 
  const changeType = Math.random() > 0.5 ? 'increase' : 'decrease';
  const chartData = generateRandomChartData();
  let value = '';

  switch (id) {
    case 1: value = Math.floor(Math.random() * 50 + 200).toString(); break;
    case 2: value = `${Math.floor(Math.random() * 10 + 90)}%`; break;
    case 3: value = `0${Math.floor(Math.random() * 9 + 1)}`; break;
    case 4: value = Math.floor(Math.random() * 50 + 100).toString(); break;
    default: value = Math.floor(Math.random() * 100).toString();
  }
  return { value, change, changeType, chartData };
};
const generateRandomAttendanceData = (): AttendanceEntry[] => {
  return initialAttendanceData.map(entry => {
    const newEntry: AttendanceEntry = { name: entry.name };
    timeSlots.forEach(slot => {
      newEntry[slot] = Math.floor(Math.random() * 4); 
    });
    return newEntry;
  });
};
const generateRandomProjectData = () => {
  return daysOfWeek.map(day => ({
    day,
    inProgress: Math.floor(Math.random() * 15) + 2,
    completed: Math.floor(Math.random() * 25) + 5,
  }));
};
const StatCard: React.FC<StatCardData> = ({ id, icon: IconComponent, title, value, change, changeType, chartData, description }) => {
  const isIncrease = changeType === 'increase';
  const changeColor = isIncrease ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400';
  const chartColor = isIncrease ? 'bg-emerald-500' : 'bg-red-500';

  return (
    <div className="bg-white dark:bg-[#181818] p-5 rounded-lg shadow-sm flex flex-col justify-between min-h-[150px]"> 
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs uppercase tracking-wider font-medium text-gray-500 dark:text-neutral-400 flex items-center">
            <IconComponent className="h-4 w-4 mr-1.5 text-gray-400 dark:text-neutral-500" />
            {title}
          </span>
           <div className="relative group">
             <Info 
               className="h-4 w-4 text-gray-400 dark:text-neutral-500 cursor-help group-hover:text-gray-600 dark:group-hover:text-neutral-300 transition-colors"
               aria-describedby={`tooltip-${id}`}
             />
             <div 
               id={`tooltip-${id}`}
               role="tooltip"
               className="invisible opacity-0 group-hover:visible group-hover:opacity-100 group-hover:scale-100 
                          absolute bottom-full left-1/2 mb-2 -translate-x-1/2 px-2 py-1 
                          bg-gray-700 dark:bg-neutral-800 text-white text-xs 
                          rounded shadow-lg whitespace-nowrap 
                          transform scale-95 transition-all duration-200 ease-in-out z-10"
            >
               {description}
             </div>
          </div>
        </div>
        <p className={`${montserrat.className} text-3xl font-bold mb-2`}>
          {value}
        </p>
      </div>
      <div className="flex items-center justify-between mt-auto">
        <span className={`text-xs font-medium flex items-center ${changeColor}`}>
          {isIncrease ? (
            <ArrowUp className="h-3 w-3 mr-1" />
          ) : (
            <ArrowDown className="h-3 w-3 mr-1" />
          )}
          {change} vs last month
        </span>
        <MiniBarChart data={chartData} colorClass={chartColor} />
      </div>
    </div>
  );
};
interface AttendanceEntry {
  name: string; 
  
  [key: string]: string | number; 
}


const getFillColor = (value: number): string => {
  if (typeof value !== 'number') return '#1f1f1f'; 
  switch (value) {
    case 1: return '#3a3a3a'; 
    case 2: return '#555555'; 
    case 3: return '#a0a0a0'; 
    default: return '#1f1f1f'; 
  }
};
const formatTooltip = (value: ValueType, name: NameType): [string, string] | null=> {
  if (typeof value !== 'number' || typeof name !== 'string' || value === 0) {
    return null; 
  }
  const timeLabel = `${name.substring(1)}:00`;
  const intensityLabel = `Intensity: ${value}`; 
  return [intensityLabel, timeLabel];
};
const AttendanceChart = ({ data }: { data: AttendanceEntry[] }) => {
  return (
    <ResponsiveContainer width="100%" height={250}> 
      <ComposedChart
        layout="vertical" 
        data={data}
        margin={{ top: 5, right: 0, bottom: 5, left: -20 }} 
        barCategoryGap={2} 
      >
        <XAxis type="number" hide /> 
        <YAxis 
          dataKey="name" 
          type="category" 
          axisLine={false} 
          tickLine={false}
          
          tickFormatter={(name) => name.substring(0, 3)} 
          tick={{ fontSize: 12, fill: '#a0a0a0' }} 
          width={40} 
        />
        <Tooltip 
          cursor={false} 
          allowEscapeViewBox={{ x: true, y: true }} 
          contentStyle={{ 
            backgroundColor: '#2a2a2a', 
            borderColor: '#444', 
            borderRadius: '4px',
            fontSize: '12px',
            color: '#f6f6f6',
            padding: '5px 10px'
          }}
          formatter={formatTooltip} 
        />
        {timeSlots.map((slot) => (
          <Bar key={slot} dataKey={slot} stackId="a" barSize={20} radius={[3, 3, 3, 3]}> 
            {data.map((entry, index) => {
              const value = entry[slot as keyof AttendanceEntry];
              
              const numericValue = typeof value === 'number' ? value : 0;
              return (
                <Cell 
                  key={`cell-${index}-${slot}`} 
                  fill={getFillColor(numericValue)} 
                  stroke={numericValue > 0 ? '#101010' : 'none'} 
                  strokeWidth={1.5}
                />
              );
            })}
          </Bar>
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  );
};
const projectData = [
  { day: 'Mo', inProgress: 8, completed: 15 },
  { day: 'Tu', inProgress: 12, completed: 19 },
  { day: 'We', inProgress: 9, completed: 12 },
  { day: 'Th', inProgress: 15, completed: 25 },
  { day: 'Fr', inProgress: 7, completed: 10 },
  { day: 'Sa', inProgress: 3, completed: 5 },
  { day: 'Su', inProgress: 2, completed: 3 },
];
const formatProjectTooltip = (value: ValueType, name: NameType): [string, string] | null => {
  if (typeof value !== 'number' || typeof name !== 'string') {
    return null;
  }
  const label = name === 'inProgress' ? 'In Progress' : 'Completed';
  return [`${value} Tasks`, label];
};
const ProjectChart: React.FC<{data: typeof projectData}> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} margin={{ top: 5, right: 0, bottom: 5, left: -30 }} barGap={6} >
        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#a0a0a0' }} padding={{ left: 10, right: 10 }} />
        <YAxis hide={true} type="number" />
        <Tooltip
           cursor={{ fill: '#d8ff3b80' }}
           contentStyle={{
            backgroundColor: '#2a2a2a',
            borderColor: '#444',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#f6f6f6',
            padding: '5px 10px'
          }}
          formatter={formatProjectTooltip}
        />
        <Bar dataKey="inProgress" stackId="a" fill="#555555" radius={[4, 4, 0, 0]} />
        <Bar dataKey="completed" stackId="a" fill="#a0a0a0" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
             <Cell key={`cell-${index}`} fill={entry.day === 'Th' ? '#d8ff3b' : '#a0a0a0'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
interface EmployeeAttendance {
  id: string;
  name: string;
  employeeId: string;
  avatarUrl: string;
  department: string;
  status: 'Attend' | 'Day off';
  checkInTime: string | null;
  checkOutTime: string | null;
}
interface ScheduleItem {
  id: string;
  title: string;
  date: string;
  timeRange: string;
  meetingType: 'Google Meet' | 'Zoom Meeting';
  participants: string[]; 
  participantCount?: number; 
  type: 'Meeting' | 'Event';
}
const DashboardPage = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('1M');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentStatCardData, setCurrentStatCardData] = useState<StatCardData[]>(initialStatCardItems);
  const [currentAttendanceData, setCurrentAttendanceData] = useState<AttendanceEntry[]>(initialAttendanceData);
  const [currentProjectData, setCurrentProjectData] = useState(initialProjectData);
  const [isAttendanceFilterOpen, setIsAttendanceFilterOpen] = useState(false);
  const [selectedAttendanceFilter, setSelectedAttendanceFilter] = useState(filterOptions[0]);
  const [isProjectFilterOpen, setIsProjectFilterOpen] = useState(false);
  const [selectedProjectFilter, setSelectedProjectFilter] = useState(filterOptions[0]);
  const [currentAttendancePercent, setCurrentAttendancePercent] = useState(98);
  const [currentAttendanceChangeText, setCurrentAttendanceChangeText] = useState("+2.5% vs last week");
  const [currentProjectInProgressCount, setCurrentProjectInProgressCount] = useState(initialInProgressSum);
  const [currentProjectCompletedCount, setCurrentProjectCompletedCount] = useState(initialCompletedSum);
  const [attendanceSearchTerm, setAttendanceSearchTerm] = useState('');
  const [isMobileTimeFilterOpen, setIsMobileTimeFilterOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const attendanceFilterRef = useRef<HTMLDivElement>(null);
  const projectFilterRef = useRef<HTMLDivElement>(null);
  const mobileTimeFilterRef = useRef<HTMLDivElement>(null);
  const handleTimeRangeSelect = (range: string) => {
    if (range === selectedTimeRange) {
      setIsMobileTimeFilterOpen(false); 
      return; 
    }
    setSelectedTimeRange(range);
    setIsMobileTimeFilterOpen(false); 
    
    const newData = currentStatCardData.map(card => ({ ...card, ...generateRandomStatData(card.id) }));
    setCurrentStatCardData(newData);
  };

  const toggleNotifications = () => { setIsNotificationsOpen(!isNotificationsOpen); setIsProfileOpen(false); };
  const toggleProfile = () => { setIsProfileOpen(!isProfileOpen); setIsNotificationsOpen(false); };
  const updateAttendanceData = (filterPeriod: string = "last week") => {
    const newChartData = generateRandomAttendanceData();
    
    const newPercentValue = Math.floor(Math.random() * 11) + 90;
    const changePercent = (Math.random() * 5 + 1).toFixed(1);
    const positiveChange = Math.random() > 0.4;
    const changeSign = positiveChange ? '+' : '-';
    const newComparisonText = `${changeSign}${changePercent}% vs ${filterPeriod.toLowerCase().replace("this ","")}`;
    
    setCurrentAttendanceData(newChartData);
    setCurrentAttendancePercent(newPercentValue);
    setCurrentAttendanceChangeText(newComparisonText);
  };
  const updateProjectData = () => {
    const newChartData = generateRandomProjectData();
    
    const newInProgressTotal = newChartData.reduce((sum, item) => sum + item.inProgress, 0);
    const newCompletedTotal = newChartData.reduce((sum, item) => sum + item.completed, 0);
    
    setCurrentProjectData(newChartData);
    setCurrentProjectInProgressCount(newInProgressTotal);
    setCurrentProjectCompletedCount(newCompletedTotal);
  };
  const selectAttendanceFilterOption = (option: string) => {
    if (option === selectedAttendanceFilter) {
      setIsAttendanceFilterOpen(false);
      return;
    }
    setSelectedAttendanceFilter(option);
    setIsAttendanceFilterOpen(false);
    updateAttendanceData(option);
  };
  const selectProjectFilterOption = (option: string) => {
     if (option === selectedProjectFilter) {
      setIsProjectFilterOpen(false);
      return;
    }
    setSelectedProjectFilter(option);
    setIsProjectFilterOpen(false);
    updateProjectData();
  };
  const onAttendanceSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
      setAttendanceSearchTerm(event.target.value);
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const targetNode = event.target as Node;

      const isClickOutsideNotifications = notificationsRef.current && 
                                        !notificationsRef.current.contains(targetNode) && 
                                        window.innerWidth >= 768;
      const isClickOutsideProfile = profileRef.current && 
                                    !profileRef.current.contains(targetNode);
      const isClickOutsideAttendanceFilter = attendanceFilterRef.current && 
                                             !attendanceFilterRef.current.contains(targetNode);
      const isClickOutsideProjectFilter = projectFilterRef.current && 
                                          !projectFilterRef.current.contains(targetNode);
      const isClickOutsideMobileTimeFilter = mobileTimeFilterRef.current && 
                                             !mobileTimeFilterRef.current.contains(targetNode);

      if (isClickOutsideNotifications) {
        setIsNotificationsOpen(false);
      }
      if (isClickOutsideProfile) {
        setIsProfileOpen(false);
      }
      if (isClickOutsideAttendanceFilter) {
        setIsAttendanceFilterOpen(false);
      }
      if (isClickOutsideProjectFilter) {
        setIsProjectFilterOpen(false);
      }
      if (isClickOutsideMobileTimeFilter) {
        setIsMobileTimeFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => { document.removeEventListener('mousedown', handleClickOutside); };
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    
    handleScroll(); 

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  const notifications = [
    { id: 1, icon: Users, text: "New Employee 'John Doe' onboarded.", href: "#", iconColor: "text-blue-500 dark:text-blue-400" },
    { id: 2, icon: Briefcase, text: "Project 'Phoenix' deadline approaching.", href: "#", iconColor: "text-orange-500 dark:text-orange-400" },
    { id: 3, icon: BellRing, text: "Attendance Alert: 'Jane Smith' late check-in.", href: "#", iconColor: "text-red-500 dark:text-red-400" },
    { id: 4, icon: CheckCircle, text: "Payroll for March processed successfully.", href: "#", iconColor: "text-green-500 dark:text-green-400" },
  ];
  const employeeAttendanceData: EmployeeAttendance[] = [
    {
      id: '1', name: 'David Mike', employeeId: 'DES 2342', avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg', 
      department: 'Design', status: 'Attend', checkInTime: '09:35 AM', checkOutTime: '04:30 PM'
    },
    {
      id: '2', name: 'Wingle Kim', employeeId: 'DEV 3432', avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
      department: 'Development', status: 'Attend', checkInTime: '09:40 AM', checkOutTime: '05:00 PM'
    },
    {
      id: '3', name: 'Danial Woul', employeeId: 'HR 3436', avatarUrl: 'https://randomuser.me/api/portraits/men/46.jpg',
      department: 'Human Resource', status: 'Day off', checkInTime: null, checkOutTime: null
    },
    {
      id: '4', name: 'Smitha Gom', employeeId: 'DEV 3424', avatarUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
      department: 'Development', status: 'Attend', checkInTime: '10:03 AM', checkOutTime: '04:30 PM'
    },
    
  ];
  const scheduleData: ScheduleItem[] = [
    {
      id: 's1', title: 'Interview Candidate - Customer Service', date: '29 March, 2025', timeRange: '09:00 - 09:30',
      meetingType: 'Google Meet', participants: [
          'https://randomuser.me/api/portraits/women/31.jpg', 
          'https://randomuser.me/api/portraits/men/33.jpg', 
          'https://randomuser.me/api/portraits/women/35.jpg'
          ], 
      type: 'Meeting'
    },
    {
      id: 's2', title: 'Town-hall Office - March 2025', date: '30 March, 2025', timeRange: '09:30 - 11:30',
      meetingType: 'Zoom Meeting', participants: [
          'https://randomuser.me/api/portraits/men/52.jpg', 
          'https://randomuser.me/api/portraits/women/55.jpg'
          ], 
      participantCount: 100, 
      type: 'Event'
    },
     {
      id: 's3', title: 'Interview Candidate - Design Lead', date: '31 March, 2025', timeRange: '09:00 - 09:30',
      meetingType: 'Google Meet', participants: [
          'https://randomuser.me/api/portraits/men/71.jpg', 
          'https://randomuser.me/api/portraits/women/72.jpg', 
          'https://randomuser.me/api/portraits/men/73.jpg'
          ] ,
      type: 'Meeting'
    },
     {
      id: 's4', title: 'Company Picnic', date: '01 April, 2025', timeRange: '12:00 - 15:00',
      meetingType: 'Zoom Meeting',
       participants: [
          'https://randomuser.me/api/portraits/men/11.jpg', 
          'https://randomuser.me/api/portraits/women/12.jpg'
          ], 
      participantCount: 50,
      type: 'Event'
    },
  ];

  
  const filteredAttendanceList = employeeAttendanceData.filter(employee =>
      employee.name.toLowerCase().includes(attendanceSearchTerm.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(attendanceSearchTerm.toLowerCase())
  );

  return (
    <main className={`${roboto.className} min-h-screen flex flex-col bg-gray-100 dark:bg-[#101010] dark:text-[#f6f6f6]`}>
      
      <nav className={`
        shadow-sm w-full sticky top-0 z-20 
        transition-colors duration-300 ease-in-out 
        ${isScrolled 
          ? 'bg-white/80 dark:bg-[#101010]/80 backdrop-blur-lg' 
          : 'bg-white dark:bg-[#101010]'
        }
      `}> 
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <span className={`${montserrat.className} text-xl font-bold`}>Dashboard</span> 
            </div>
            <div className="flex items-center space-x-4">
              
              <div className="relative" ref={notificationsRef}>
                <button 
                  onClick={toggleNotifications}
                  className="relative p-1 rounded-full text-gray-400 hover:text-gray-600 dark:text-neutral-400 dark:hover:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-[#101010] focus:ring-indigo-500 cursor-pointer transition-colors duration-150 ease-in-out"
                  aria-label="View notifications"
                  aria-haspopup="true" 
                  aria-expanded={isNotificationsOpen}
                >
                  <Bell className="h-6 w-6" aria-hidden="true" />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#101010]" /> 
                </button>

                
                {isNotificationsOpen && (
                  <div className="hidden md:block origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white dark:bg-[#1f1f1f] ring-1 ring-black dark:ring-neutral-700 ring-opacity-5 focus:outline-none py-2 px-2 z-30"> 
                    <div className="px-2 pb-2 text-sm font-semibold border-b border-gray-200 dark:border-neutral-700 mb-2">
                      Notifications
                    </div>
                    <div className="space-y-1"> 
                      {notifications.map((notification) => (
                        <NotificationItem 
                          key={notification.id}
                          icon={notification.icon}
                          text={notification.text}
                          href={notification.href}
                          iconColor={notification.iconColor}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div> 
              

              
              <div className="relative" ref={profileRef}>
                 <button
                    onClick={toggleProfile}
                    className="flex items-center justify-center h-9 w-9 rounded-full bg-gray-300 dark:bg-[#333] text-sm font-medium text-gray-600 dark:text-neutral-300 border-2 border-transparent hover:border-indigo-500 dark:hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-[#101010] focus:ring-indigo-500 cursor-pointer transition-colors duration-150 ease-in-out"
                    aria-label="User menu"
                    aria-haspopup="true"
                    aria-expanded={isProfileOpen}
                 > 
                      WK
                 </button>
                {isProfileOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-[#1f1f1f] ring-1 ring-black dark:ring-neutral-700 ring-opacity-5 focus:outline-none z-30"> 
                     <div className="px-4 py-2 text-sm font-semibold border-b border-gray-200 dark:border-neutral-700 mb-1">
                      My Account
                    </div>
                    <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-neutral-200 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] cursor-pointer transition-colors duration-150 ease-in-out">
                      <User className="mr-3 h-5 w-5 text-gray-500 dark:text-neutral-400" />
                      <span>Profile</span>
                    </a>
                    <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-neutral-200 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] cursor-pointer transition-colors duration-150 ease-in-out">
                      <Settings className="mr-3 h-5 w-5 text-gray-500 dark:text-neutral-400" />
                      <span>Settings</span>
                    </a>
                    <div className="border-t border-gray-200 dark:border-neutral-700 my-1"></div>
                    <a href="#" className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer transition-colors duration-150 ease-in-out">
                      <LogOut className="mr-3 h-5 w-5" />
                      <span>Logout</span>
                    </a>
                  </div>
                )}
              </div>
              
            </div>
          </div>
        </div>
      </nav>

      
      <AnimatePresence>
        {isNotificationsOpen && (
          <motion.div
            key="notification-modal" 
            initial={{ x: "100%" }} 
            animate={{ x: 0 }}
            exit={{ x: "100%" }} 
            transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
            className="fixed inset-0 bg-white dark:bg-[#181818] z-40 p-4 flex flex-col md:hidden" 
            role="dialog"
            aria-modal="true"
            aria-labelledby="notification-modal-title"
          >
            
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-neutral-700 mb-4 flex-shrink-0">
              <h2 id="notification-modal-title" className={`${montserrat.className} text-lg font-semibold`}>Notifications</h2>
              <button
                onClick={toggleNotifications} 
                className="p-1 rounded-md text-gray-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-150 ease-in-out"
                aria-label="Close notifications"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            
            <div className="flex-grow overflow-y-auto space-y-1"> 
               {notifications.map((notification) => (
                  <NotificationItem 
                    key={notification.id}
                    icon={notification.icon}
                    text={notification.text}
                    href={notification.href}
                    iconColor={notification.iconColor}
                  />
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      
      <div className="flex-grow p-8">
        
        <div className="flex justify-between items-center mb-6">
          
          <h1 className={`${montserrat.className} text-3xl font-bold`}> 
            Overview
          </h1>
          
          
          <div className="hidden md:flex space-x-1 bg-gray-200 dark:bg-[#2a2a2a] p-1 rounded-lg">
            {timeRanges.map((range) => (
              <button
                key={range}
                onClick={() => handleTimeRangeSelect(range)}
                className={`
                  px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 
                  cursor-pointer 
                  ${selectedTimeRange === range
                    ? 'bg-white dark:bg-[#444] text-gray-900 dark:text-neutral-100 shadow'
                    : 'text-gray-600 dark:text-neutral-400 hover:bg-gray-300 dark:hover:bg-[#383838]'
                  }
                `}
                aria-label={`Select time range ${range}`}
                aria-pressed={selectedTimeRange === range}
              >
                {range}
              </button>
            ))}
          </div>

          
          <div className="block md:hidden relative" ref={mobileTimeFilterRef}>
            <button
              onClick={() => setIsMobileTimeFilterOpen(!isMobileTimeFilterOpen)}
              className="flex items-center text-sm text-gray-500 dark:text-neutral-400 bg-gray-100 dark:bg-[#2a2a2a] px-3 py-1 rounded-md hover:bg-gray-200 dark:hover:bg-[#383838] transition-colors cursor-pointer border border-gray-300 dark:border-neutral-700"
              aria-haspopup="listbox"
              aria-expanded={isMobileTimeFilterOpen}
            >
              {selectedTimeRange}
              <ChevronDown className={`h-4 w-4 ml-2 transition-transform duration-200 ${isMobileTimeFilterOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isMobileTimeFilterOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-[#2a2a2a] rounded-md shadow-lg overflow-hidden z-10 ring-1 ring-black dark:ring-neutral-700 ring-opacity-5">
                 <ul role="listbox">
                  {timeRanges.map((range) => (
                    <li
                      key={range}
                      onClick={() => handleTimeRangeSelect(range)} 
                      className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-[#383838] ${selectedTimeRange === range ? 'font-semibold text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-neutral-300'}`}
                      role="option"
                      aria-selected={selectedTimeRange === range}
                    >
                      {range}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {currentStatCardData.map((item) => (
            <StatCard 
              key={item.id}
              {...item} 
            />
          ))}
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          <div className="bg-white dark:bg-[#181818] p-5 rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className={`${montserrat.className} text-lg font-semibold mb-1`}>Attendance Overview</h2>
                <p className={`text-sm flex items-center ${currentAttendanceChangeText.startsWith('+') ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                  {currentAttendanceChangeText.startsWith('+') ? (
                     <ArrowUp className="h-4 w-4 mr-1" />
                   ) : (
                     <ArrowDown className="h-4 w-4 mr-1" />
                   )}
                  <span>{currentAttendancePercent}%</span> 
                  <span className="text-xs text-gray-500 dark:text-neutral-400 ml-1"> {currentAttendanceChangeText}</span>
                </p>
              </div>
              
              <div className="relative" ref={attendanceFilterRef}>
                <button
                  onClick={() => setIsAttendanceFilterOpen(!isAttendanceFilterOpen)}
                  className="flex items-center text-sm text-gray-500 dark:text-neutral-400 bg-gray-100 dark:bg-[#2a2a2a] px-3 py-1 rounded-md hover:bg-gray-200 dark:hover:bg-[#383838] transition-colors cursor-pointer"
                  aria-haspopup="listbox"
                  aria-expanded={isAttendanceFilterOpen}
                >
                  {selectedAttendanceFilter}
                  <ChevronDown className={`h-4 w-4 ml-1 transition-transform duration-200 ${isAttendanceFilterOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isAttendanceFilterOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-[#2a2a2a] rounded-md shadow-lg overflow-hidden z-10 ring-1 ring-black dark:ring-neutral-700 ring-opacity-5">
                    <ul role="listbox">
                      {filterOptions.map((option) => (
                        <li
                          key={option}
                          onClick={() => selectAttendanceFilterOption(option)}
                          className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-[#383838] ${selectedAttendanceFilter === option ? 'font-semibold text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-neutral-300'}`}
                          role="option"
                          aria-selected={selectedAttendanceFilter === option}
                        >
                          {option}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <AttendanceChart data={currentAttendanceData} />
          </div>

          
          <div className="bg-white dark:bg-[#181818] p-5 rounded-lg shadow-sm">
             <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className={`${montserrat.className} text-lg font-semibold mb-1`}>Project Overview</h2>
                
                <p className="text-xs space-x-3">
                  <span className="text-gray-500 dark:text-neutral-400">
                    IN PROGRESS <span className="font-semibold text-gray-700 dark:text-neutral-200">{currentProjectInProgressCount}</span>
                  </span>
                   <span className="text-gray-500 dark:text-neutral-400">
                    COMPLETED <span className="font-semibold text-gray-700 dark:text-neutral-200">{currentProjectCompletedCount}</span>
                  </span>
                </p>
              </div>
              
              <div className="relative" ref={projectFilterRef}>
                <button
                  onClick={() => setIsProjectFilterOpen(!isProjectFilterOpen)}
                  className="flex items-center text-sm text-gray-500 dark:text-neutral-400 bg-gray-100 dark:bg-[#2a2a2a] px-3 py-1 rounded-md hover:bg-gray-200 dark:hover:bg-[#383838] transition-colors cursor-pointer"
                  aria-haspopup="listbox"
                  aria-expanded={isProjectFilterOpen}
                >
                  {selectedProjectFilter}
                  <ChevronDown className={`h-4 w-4 ml-1 transition-transform duration-200 ${isProjectFilterOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isProjectFilterOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-[#2a2a2a] rounded-md shadow-lg overflow-hidden z-10 ring-1 ring-black dark:ring-neutral-700 ring-opacity-5">
                     <ul role="listbox">
                      {filterOptions.map((option) => (
                        <li
                          key={option}
                          onClick={() => selectProjectFilterOption(option)}
                          className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-[#383838] ${selectedProjectFilter === option ? 'font-semibold text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-neutral-300'}`}
                          role="option"
                          aria-selected={selectedProjectFilter === option}
                        >
                          {option}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
             <ProjectChart data={currentProjectData} />
          </div>
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"> 
          <AttendanceTable 
            attendanceList={filteredAttendanceList} 
            searchTerm={attendanceSearchTerm}
            onSearchChange={onAttendanceSearchInput}
          />
          <ScheduleSection scheduleItems={scheduleData} />
        </div>

        

      </div>

      
      <footer className="w-full border-t border-gray-200 dark:border-neutral-700 mt-auto bg-white dark:bg-[#181818]"> 
        <div className="max-w-full mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500 dark:text-neutral-400">
          
          <div>
            © {new Date().getFullYear()} Dashboard. All rights reserved.
          </div>

          
          <div className="flex space-x-4">
            <a href="#" className="hover:text-gray-700 dark:hover:text-neutral-200 transition-colors cursor-pointer">Privacy Policy</a>
            <a href="#" className="hover:text-gray-700 dark:hover:text-neutral-200 transition-colors cursor-pointer">Terms of Service</a>
          </div>

          
          <div className="flex space-x-4">
            <a href="#" aria-label="Twitter" className="text-xl hover:text-gray-700 dark:hover:text-neutral-200 transition-colors cursor-pointer">
              <FaTwitter />
            </a>
            <a href="#" aria-label="GitHub" className="text-xl hover:text-gray-700 dark:hover:text-neutral-200 transition-colors cursor-pointer">
              <FaGithub />
            </a>
            <a href="#" aria-label="LinkedIn" className="text-xl hover:text-gray-700 dark:hover:text-neutral-200 transition-colors cursor-pointer">
              <FaLinkedin />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default DashboardPage;

const StatusBadge: React.FC<{status: 'Attend' | 'Day off';}> = ({ status }) => {
  const isAttending = status === 'Attend';
  const bgColor = isAttending ? 'bg-green-500/20 dark:bg-green-400/20' : 'bg-red-500/20 dark:bg-red-400/20';
  const textColor = isAttending ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300';
  const dotColor = isAttending ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}> 
      <span className={`w-2 h-2 mr-1.5 rounded-full ${dotColor}`}></span>
      {status}
    </div>
  );
};

const AttendanceTable: React.FC<{
  attendanceList: EmployeeAttendance[];
  searchTerm: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ attendanceList, searchTerm, onSearchChange }) => {
  return (
    <div className="bg-white dark:bg-[#181818] p-5 rounded-lg shadow-sm col-span-2">
      
      <div className="flex justify-between items-center mb-4">
        <h2 className={`${montserrat.className} text-lg font-semibold`}>Attendance</h2>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <input 
              type="text"
              placeholder="Search employee"
              value={searchTerm}
              onChange={onSearchChange}
              className="pl-8 pr-3 py-1.5 text-sm border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-[#2a2a2a] rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:text-neutral-200 placeholder-gray-400 dark:placeholder-neutral-500"
              aria-label="Search employees by name or ID"
            />
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-neutral-500" />
          </div>
          <button className="p-1.5 border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-[#2a2a2a] rounded-md text-gray-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-[#383838] transition-colors cursor-pointer" aria-label="Select date">
            <CalendarDays className="h-4 w-4" />
          </button>
        </div>
      </div>

      
      <div className="hidden lg:grid lg:grid-cols-[auto_1fr_1fr_1fr_1fr_1fr] gap-x-4 gap-y-2 text-sm">
        
        <div className="flex items-center"> 
          <input type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600 dark:bg-[#2a2a2a] border-gray-300 dark:border-neutral-600 rounded focus:ring-indigo-500 cursor-pointer" aria-label="Select all employees" /> 
        </div>
        <div className="text-gray-500 dark:text-neutral-400 font-medium text-xs uppercase tracking-wider py-2">Employee</div>
        <div className="text-gray-500 dark:text-neutral-400 font-medium text-xs uppercase tracking-wider py-2">Department</div>
        <div className="text-gray-500 dark:text-neutral-400 font-medium text-xs uppercase tracking-wider py-2">Status</div>
        <div className="text-gray-500 dark:text-neutral-400 font-medium text-xs uppercase tracking-wider py-2">Check In Time</div>
        <div className="text-gray-500 dark:text-neutral-400 font-medium text-xs uppercase tracking-wider py-2">Check Out Time</div>
        
        
        <div className="col-span-6 border-t border-gray-200 dark:border-neutral-700"></div>

        
        {attendanceList.length > 0 ? (
            attendanceList.map((employee) => (
                <React.Fragment key={`desktop-${employee.id}`}> 
                    <div className="flex items-center py-2 border-b border-gray-100 dark:border-neutral-700/50"> <input type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600 dark:bg-[#2a2a2a] border-gray-300 dark:border-neutral-600 rounded focus:ring-indigo-500 cursor-pointer" aria-label={`Select ${employee.name}`} /> </div>
                    <div className="flex items-center space-x-3 py-2 border-b border-gray-100 dark:border-neutral-700/50"> <div className="relative h-10 w-10 flex-shrink-0"> <Image src={employee.avatarUrl || "/placeholder-avatar.png"} alt={employee.name} layout="fill" objectFit="cover" className="rounded-full" /> </div> <div> <div className="font-medium text-gray-900 dark:text-neutral-100">{employee.name}</div> <div className="text-xs text-gray-500 dark:text-neutral-400">{employee.employeeId}</div> </div> </div>
                    <div className="py-2 flex items-center text-gray-700 dark:text-neutral-300 border-b border-gray-100 dark:border-neutral-700/50">{employee.department}</div>
                    <div className="py-2 flex items-center border-b border-gray-100 dark:border-neutral-700/50"> <StatusBadge status={employee.status} /> </div>
                    <div className="py-2 flex items-center text-gray-700 dark:text-neutral-300 border-b border-gray-100 dark:border-neutral-700/50">{employee.checkInTime || '--:-- AM'}</div>
                    <div className="py-2 flex items-center text-gray-700 dark:text-neutral-300 border-b border-gray-100 dark:border-neutral-700/50">{employee.checkOutTime || '--:-- PM'}</div>
                </React.Fragment>
            ))
         ) : (
             <div className="col-span-6 text-center py-6 text-sm text-gray-500 dark:text-neutral-400">
                 No employees found matching "{searchTerm}".
             </div>
         )}
      </div>

      
      <div className="block lg:hidden space-y-3 mt-4">
          {attendanceList.length > 0 ? (
              attendanceList.map((employee) => (
                  <div key={`mobile-${employee.id}`} className="bg-gray-50 dark:bg-[#2a2a2a] p-4 rounded-lg shadow-sm">
                      
                      <div className="flex items-start space-x-3 mb-3">
                           <input type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600 dark:bg-[#2a2a2a] border-gray-300 dark:border-neutral-600 rounded focus:ring-indigo-500 cursor-pointer mt-1" aria-label={`Select ${employee.name}`} /> 
                           <div className="relative h-10 w-10 flex-shrink-0">
                               <Image src={employee.avatarUrl || "/placeholder-avatar.png"} alt={employee.name} layout="fill" objectFit="cover" className="rounded-full" />
                           </div>
                           <div className="flex-grow">
                               <div className="font-medium text-sm text-gray-900 dark:text-neutral-100">{employee.name}</div>
                               <div className="text-xs text-gray-500 dark:text-neutral-400">{employee.employeeId}</div>
                           </div>
                      </div>
                      
                      <div className="space-y-2 text-xs">
                           <div className="flex justify-between">
                               <span className="text-gray-500 dark:text-neutral-400">Department:</span>
                               <span className="text-gray-700 dark:text-neutral-300">{employee.department}</span>
                           </div>
                           <div className="flex justify-between items-center">
                               <span className="text-gray-500 dark:text-neutral-400">Status:</span>
                               <StatusBadge status={employee.status} />
                           </div>
                           <div className="flex justify-between">
                               <span className="text-gray-500 dark:text-neutral-400">Check In:</span>
                               <span className="text-gray-700 dark:text-neutral-300">{employee.checkInTime || '--:-- AM'}</span>
                           </div>
                           <div className="flex justify-between">
                               <span className="text-gray-500 dark:text-neutral-400">Check Out:</span>
                               <span className="text-gray-700 dark:text-neutral-300">{employee.checkOutTime || '--:-- PM'}</span>
                           </div>
                      </div>
                  </div>
              ))
          ) : (
             <div className="text-center py-6 text-sm text-gray-500 dark:text-neutral-400">
                 No employees found matching "{searchTerm}".
             </div>
          )}
      </div>

    </div>
  );
};

const ScheduleSection: React.FC<{
    scheduleItems: ScheduleItem[];
}> = ({ scheduleItems }) => {
    const [activeTab, setActiveTab] = useState("All");
    const tabs = ["All", "Meetings", "Events"];

    const filteredItems = scheduleItems.filter((item) => {
        if (activeTab === "All") {
            return true;
        } else if (activeTab === "Meetings") {
            return item.type === "Meeting";
        } else if (activeTab === "Events") {
            return item.type === "Event";
        } else {
            return false;
        }
    });

    const handleDateFilterClick = () => {
        console.log("Schedule Date filter clicked!");
    };

    return (
        <div className="bg-white dark:bg-[#181818] p-5 rounded-lg shadow-sm col-span-1">
            <div className="flex justify-between items-center mb-4">
                <h2 className={`${montserrat.className} text-lg font-semibold`}>Schedule ({filteredItems.length})</h2>
                <button
                    onClick={handleDateFilterClick}
                    className="p-1.5 border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-[#2a2a2a] rounded-md text-gray-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-[#383838] transition-colors cursor-pointer"
                    aria-label="Filter schedule by date"
                >
                    <CalendarDays className="h-4 w-4" />
                </button>
            </div>

            <div className="flex space-x-1 bg-gray-200 dark:bg-[#2a2a2a] p-1 rounded-lg mb-4">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`
              flex-1 px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 
              cursor-pointer 
              ${
                  activeTab === tab
                      ? "bg-white dark:bg-[#444] text-gray-900 dark:text-neutral-100 shadow"
                      : "text-gray-600 dark:text-neutral-400 hover:bg-gray-300 dark:hover:bg-[#383838]"
              }
            `}
                        aria-label={`Filter by ${tab}`}
                        aria-pressed={activeTab === tab}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="space-y-4 h-[calc(100%-100px)] overflow-y-auto pr-2">
                {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                        <div key={item.id} className="bg-gray-50 dark:bg-[#2a2a2a] p-4 rounded-lg">
                            <h3 className="font-semibold mb-1 text-gray-900 dark:text-neutral-100 text-sm">{item.title}</h3>
                            <div className="flex items-center text-xs text-gray-500 dark:text-neutral-400 mb-2 space-x-2">
                                <span>{item.date}</span>
                                <span className="w-1 h-1 bg-gray-400 dark:bg-neutral-600 rounded-full"></span>
                                <span>{item.timeRange}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <a
                                    href={item.meetingType === "Google Meet" ? "https://meet.google.com/" : "https://zoom.us/"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                                >
                                    {item.meetingType === "Google Meet" ? (
                                        <SiGooglemeet className="h-3.5 w-3.5 mr-1.5 text-green-600 dark:text-green-500" />
                                    ) : (
                                        <Video className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
                                    )}
                                    {item.meetingType}
                                    <ArrowRight className="h-3 w-3 ml-1" />
                                </a>

                                <div className="flex items-center -space-x-2">
                                    {item.participants.slice(0, 3).map((avatarUrl, index) => (
                                        <div key={index} className="relative h-6 w-6 rounded-full ring-2 ring-white dark:ring-[#2a2a2a]">
                                            <Image
                                                src={avatarUrl || "/placeholder-avatar.png"}
                                                alt={`Participant ${index + 1}`}
                                                layout="fill"
                                                objectFit="cover"
                                                className="rounded-full"
                                            />
                                        </div>
                                    ))}

                                    {
                                        item.participantCount === 100 ? (
                                            <div className="relative h-6 w-6 rounded-full bg-gray-300 dark:bg-[#444] ring-2 ring-white dark:ring-[#2a2a2a] flex items-center justify-center text-xs font-medium text-gray-600 dark:text-neutral-300">
                                                100+
                                            </div>
                                        ) : item.participantCount && item.participantCount > 3 ? (
                                            <div className="relative h-6 w-6 rounded-full bg-gray-300 dark:bg-[#444] ring-2 ring-white dark:ring-[#2a2a2a] flex items-center justify-center text-xs font-medium text-gray-600 dark:text-neutral-300">
                                                +{item.participantCount - 3}
                                            </div>
                                        ) : null
                                    }
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-sm text-gray-500 dark:text-neutral-400 py-4">No items found for "{activeTab}".</p>
                )}
            </div>
        </div>
    );
};

