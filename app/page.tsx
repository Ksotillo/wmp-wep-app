'use client'
import React, { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image'; 
import {
  Bell, Search, UserCircle, ChevronDown, Clock, Users, UserCheck, UserX, ArrowUp, ArrowDown, Timer,
  Calendar as CalendarIcon, Download, MoreHorizontal, ChevronsUpDown, ArrowUpNarrowWide, ArrowDownNarrowWide,
  ClipboardList, Edit, Trash2, 
  FilterX, RefreshCw, FileText, 
  Settings, LogOut, User, 
  Github, Linkedin, Twitter, 
  MoreVertical
} from 'lucide-react';

const DashboardHeader = () => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const switchNotificationPanel = () => setIsNotificationsOpen(prev => !prev);
  const switchProfileDropdown = () => setIsProfileOpen(prev => !prev);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const notificationsButtonRef = useRef<HTMLButtonElement>(null);

  const profileRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const closeMenusOnClickOutside = (event) => { 
      const target = event.target as Node;
      
      if (notificationsRef.current && !notificationsRef.current.contains(target) && notificationsButtonRef.current && !notificationsButtonRef.current.contains(target)) {
        setIsNotificationsOpen(false);
      }
      
      if (profileRef.current && !profileRef.current.contains(target) && profileButtonRef.current && !profileButtonRef.current.contains(target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', closeMenusOnClickOutside);
    return () => document.removeEventListener('mousedown', closeMenusOnClickOutside);
  }, [notificationsRef, notificationsButtonRef, profileRef, profileButtonRef]);

  return (
    <header className="flex flex-row justify-between items-start mb-8">
      <div className="mb-0">
        <h1 className="text-2xl font-semibold font-montserrat">Dashboard</h1>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-4">
         
         <div className="relative" ref={notificationsRef}>
             <button
                ref={notificationsButtonRef}
                onClick={switchNotificationPanel}
                className="cursor-pointer p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-neutral-800 rounded-full relative"
             >
              <Bell size={20} />
              
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-neutral-900"></span>
            </button>
             {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-[#171717] rounded-md shadow-lg ring-1 ring-black dark:ring-gray-700 ring-opacity-5 z-20">
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-sm font-medium text-gray-800 dark:text-gray-300">Notifications</h3>
                    </div>
                    <div className="py-1 max-h-60 overflow-y-auto">
                        
                        <a href="#" className="flex items-start px-4 py-3 text-sm text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800">
                            <UserCheck size={18} className="mr-3 mt-1 text-green-500 flex-shrink-0"/>
                            <div>
                                <p className="font-medium dark:text-gray-300">John Doe clocked in</p>
                                <p className="text-xs text-gray-500 dark:text-gray-500">5 minutes ago</p>
                            </div>
                        </a>
                        <a href="#" className="flex items-start px-4 py-3 text-sm text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800">
                             <Clock size={18} className="mr-3 mt-1 text-yellow-500 flex-shrink-0"/>
                             <div>
                                <p className="font-medium dark:text-gray-300">Sarah Lee arrived late</p>
                                <p className="text-xs text-gray-500 dark:text-gray-500">1 hour ago</p>
                             </div>
                         </a>
                         <a href="#" className="flex items-start px-4 py-3 text-sm text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800">
                             <UserX size={18} className="mr-3 mt-1 text-red-500 flex-shrink-0"/>
                             <div>
                                 <p className="font-medium dark:text-gray-300">James Carter reported absent</p>
                                 <p className="text-xs text-gray-500 dark:text-gray-500">Yesterday</p>
                             </div>
                         </a>
                    </div>
                     <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                        <a href="#" className="block text-center text-xs text-blue-600 dark:text-blue-400 hover:underline">View all notifications</a>
                    </div>
                 </div>
             )}
         </div>

        
         <div className="relative" ref={profileRef}>
             <button
                ref={profileButtonRef}
                onClick={switchProfileDropdown}
                className="cursor-pointer flex items-center space-x-2 p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-neutral-800 rounded-lg"
             >
               <UserCircle size={24} className="text-gray-500 dark:text-gray-500" />
               <ChevronDown size={16} />
            </button>
             {isProfileOpen && (
                 <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#171717] rounded-md shadow-lg ring-1 ring-black dark:ring-gray-700 ring-opacity-5 z-20">
                     <div className="py-1" role="menu" >
                         <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800" role="menuitem">
                             <User size={14} className="mr-2" /> Your Profile
                         </a>
                         <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800" role="menuitem">
                            <Settings size={14} className="mr-2" /> Settings
                         </a>
                         <button
                             onClick={() => { console.log('Signing out...'); setIsProfileOpen(false); }}
                             className="cursor-pointer flex items-center w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50"
                             role="menuitem"
                         >
                            <LogOut size={14} className="mr-2" /> Sign out
                         </button>
                      </div>
                 </div>
             )}
        </div>
      </div>
    </header>
  );
};

const StatCard = ({ icon: Icon, title, value, change, changeColor, description, iconBgColor, iconColor }) => {
  return (
    <div className="bg-white dark:bg-[#171717] rounded-lg shadow p-5 flex items-start space-x-4">
      <div className={`rounded-full p-2 ${iconBgColor}`}>
        <Icon size={20} className={iconColor} />
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">{title}</p>
        <p className="text-2xl font-semibold font-montserrat mb-1 dark:text-gray-100">{value}</p>
        <div className="text-xs text-gray-500 dark:text-gray-500 flex items-center space-x-1">
          {change && (
            <span className={`flex items-center ${changeColor === 'green' ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
              {changeColor === 'green' ? <ArrowUp size={12} className="mr-0.5" /> : <ArrowDown size={12} className="mr-0.5" />}
              {change}
            </span>
          )}
          <span>{description}</span>
        </div>
      </div>
    </div>
  );
};

const baseAttendanceData = [
  { id: '#E120', name: 'John Doe', img: 'https://randomuser.me/api/portraits/men/32.jpg', department: 'Information Technology', clockIn: '08:15 AM', clockOut: '05:00 PM', status: 'Present' },
  { id: '#E119', name: 'Sarah Lee', img: 'https://randomuser.me/api/portraits/women/44.jpg', department: 'Human Resource', clockIn: '09:05 AM', clockOut: '05:00 PM', status: 'Late' },
  { id: '#E118', name: 'Michael Tan', img: 'https://randomuser.me/api/portraits/men/51.jpg', department: 'Marketing', clockIn: '08:50 AM', clockOut: '05:00 PM', status: 'Present' },
  { id: '#E117', name: 'Alice Morgan', img: 'https://randomuser.me/api/portraits/women/68.jpg', department: 'Finance', clockIn: '08:45 AM', clockOut: '05:00 PM', status: 'Present' },
  { id: '#E116', name: 'James Carter', img: 'https://randomuser.me/api/portraits/men/75.jpg', department: 'Information Technology', clockIn: '-', clockOut: '-', status: 'Absent' },
  { id: '#E115', name: 'Emma Brown', img: 'https://randomuser.me/api/portraits/women/12.jpg', department: 'Marketing', clockIn: '08:30 AM', clockOut: '05:05 PM', status: 'Present' },
  { id: '#E114', name: 'David Bowen', img: 'https://randomuser.me/api/portraits/men/9.jpg', department: 'Human Resource', clockIn: '-', clockOut: '-', status: 'Absent' },
  { id: '#E113', name: 'Rachel Amanda', img: 'https://randomuser.me/api/portraits/women/23.jpg', department: 'Marketing', clockIn: '08:45 AM', clockOut: '05:10 PM', status: 'Present' },
  { id: '#E112', name: 'Chris Johnson', img: 'https://randomuser.me/api/portraits/men/88.jpg', department: 'Operations', clockIn: '09:00 AM', clockOut: '05:30 PM', status: 'Present' },
];

const generateVariedData = (baseData) => {
  const statuses = ['Present', 'Late', 'Absent'];
  const randomTimeOffset = () => (Math.random() < 0.7 ? 0 : Math.floor(Math.random() * 16) - 8); 

  const formatTime = (baseTime, offset) => {
    if (baseTime === '-') return '-';
    try {
        const [time, modifier] = baseTime.split(' ');
        let [hours, minutes] = time.split(':').map(Number);

        if (modifier === 'PM' && hours !== 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0; 

        let date = new Date();
        date.setHours(hours, minutes, 0, 0);
        date.setMinutes(date.getMinutes() + offset);

        let newHours = date.getHours();
        const newMinutes = date.getMinutes();
        const newModifier = newHours >= 12 ? 'PM' : 'AM';
        newHours = newHours % 12;
        newHours = newHours ? newHours : 12; 

        return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')} ${newModifier}`;
    } catch (e) {
        console.error("Error formatting time:", baseTime, e);
        return baseTime; 
    }
  };

  return baseData.map(item => {
    const randomStatus = Math.random() < 0.15 ? statuses[Math.floor(Math.random() * statuses.length)] : item.status; 
    let newClockIn = item.clockIn;
    let newClockOut = item.clockOut;

    if (randomStatus !== 'Absent') {
        
        newClockIn = formatTime(item.clockIn, randomTimeOffset());
        newClockOut = formatTime(item.clockOut, randomTimeOffset());
    } else {
        newClockIn = '-';
        newClockOut = '-';
    }


    return {
      ...item,
      status: randomStatus,
      clockIn: newClockIn,
      clockOut: newClockOut,
    };
  });
};

const getStatusBadgeStyles = (status) => {
  switch (status) {
    case 'Present':
      return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300';
    case 'Late':
      return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300';
    case 'Absent':
      return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300';
    default:
      return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300';
  }
};

const escapeCSV = (field) => {
  const stringField = String(field ?? ''); 
  
  if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
    return `"${stringField.replace(/"/g, '""')}"`;
  }
  return stringField;
};

const convertToCSV = (data) => {
  if (!data || data.length === 0) {
    return '';
  }
  
  const headers = ['id', 'name', 'department', 'clockIn', 'clockOut', 'status'];
  const headerString = headers.map(escapeCSV).join(',');

  
  const rows = data.map(item => {
    return headers.map(header => escapeCSV(item[header])).join(',');
  });

  return [headerString, ...rows].join('\n');
};

const triggerDownload = (csvString, filename) => {
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) { 
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url); 
    } else {
        console.error("Browser does not support automatic download.");
        
    }
};

const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  employeeName,
}) => {
  if (!isOpen || !employeeName) return null;

  const runConfirmCallback = () => { 
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/75">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4 font-heading">
          Confirm Deletion
        </h2>
        <p className="text-neutral-600 dark:text-neutral-300 mb-6 font-body">
          Are you sure you want to delete the attendance record for{' '}
          <span className="font-medium">{employeeName}</span>? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 dark:focus:ring-offset-neutral-800 cursor-pointer font-body"
          >
            Cancel
          </button>
          <button
            onClick={runConfirmCallback}
            className="px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-neutral-800 cursor-pointer font-body"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const AttendanceHistory = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedDate, setSelectedDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [displayData, setDisplayData] = useState(baseAttendanceData);
  
  const [openRowMenuIndex, setOpenRowMenuIndex] = useState(null);
  const rowMenuRef = useRef<HTMLDivElement>(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);
  const headerMenuRef = useRef<HTMLDivElement>(null);
  const headerMenuButtonRef = useRef<HTMLButtonElement>(null);
  
  const calendarDateSelected = (event) => {
    const date = event.target.value;
    setSelectedDate(date);
    console.log("Date selected:", date);
    setDisplayData(generateVariedData(baseAttendanceData));
    setSearchTerm('');
    setSelectedDepartment('All');
    setSortConfig({ key: null, direction: 'ascending' });
    setOpenRowMenuIndex(null); 
    setIsHeaderMenuOpen(false); 
  };

  const departmentChosen = (event) => {
      const department = event.target.value;
      setSelectedDepartment(department);
      console.log("Department selected:", department);
  };
  const updateSearchQuery = (event) => {
      setSearchTerm(event.target.value);
      console.log("Search term:", event.target.value);
  };
  const applyColumnSort = (key) => {
      let direction = "ascending";
      if (sortConfig.key === key && sortConfig.direction === "ascending") {
          direction = "descending";
      }
      setSortConfig({ key, direction });
  };
  const determineSortIcon = (key) => {
      if (sortConfig.key !== key) {
          return <ChevronsUpDown size={14} className="ml-1 opacity-40" />;
      }
      return sortConfig.direction === "ascending" ? (
          <ArrowUpNarrowWide size={14} className="ml-1 text-blue-600 dark:text-blue-400" />
      ) : (
          <ArrowDownNarrowWide size={14} className="ml-1 text-blue-600 dark:text-blue-400" />
      );
  };

  const exportTableToCSV = () => {
    console.log("Preparing CSV data...");
    
    const csvData = convertToCSV(sortedAndFilteredData);
    if (csvData) {
        const filename = `attendance_data_${selectedDate || 'all_dates'}_${selectedDepartment}.csv`;
        triggerDownload(csvData, filename);
        console.log("CSV download triggered.");
    } else {
        console.log("No data to download.");
    }
  };
  const switchRowMenuVisibility = (index) => {
    setIsHeaderMenuOpen(false); 
    setOpenRowMenuIndex(prevIndex => (prevIndex === index ? null : index));
  };
  const switchHeaderMenuVisibility = () => {
    setOpenRowMenuIndex(null); 
    setIsHeaderMenuOpen(prev => !prev);
  };
  const performHeaderAction = (command) => {
      console.log(`Header action selected: ${command}`);
      
      if (command === 'Export Data') {
          exportTableToCSV();
      }
      if (command === 'Refresh Data') {
          console.log("Simulating data refresh...");
          setDisplayData(generateVariedData(baseAttendanceData)); 
      }
      setIsHeaderMenuOpen(false); 
  };
  const processRowMenuClick = (action, employee) => {
    console.log(`${action} clicked for ${employee.name} (ID: ${employee.id})`);
    setOpenRowMenuIndex(null); 
    switch (action) {
      case 'View Details':
        
        console.log("Triggering View Details logic...");
        break;
      case 'Edit Times':
        
        console.log("Triggering Edit Times logic...");
        break;
      case 'Delete Entry':
        setEmployeeToDelete(employee);
        setIsDeleteModalOpen(true);
        break;
      default:
        console.warn("Unknown action:", action);
    }
  };
  const deleteSelectedEntry = () => {
    if (!employeeToDelete) return;
    console.log(`Confirmed deletion for ${employeeToDelete.name}`);
    
    const updatedData = displayData.filter(emp => emp.id !== employeeToDelete.id);
    setDisplayData(updatedData); 
    setEmployeeToDelete(null); 
  };
  const abortDeletion = () => {
    setIsDeleteModalOpen(false);
    setEmployeeToDelete(null);
  };

  const sortedAndFilteredData = useMemo(() => {
    let sortableItems = [...displayData].filter(item =>
        (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
         item.department.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedDepartment === 'All' || item.department === selectedDepartment)
    );

    if (sortConfig.key !== null) {
       sortableItems.sort((a, b) => {
         const key = sortConfig.key;
         
         const valA = a[key] === '-' ? (sortConfig.direction === 'ascending' ? Infinity : -Infinity) : a[key];
         const valB = b[key] === '-' ? (sortConfig.direction === 'ascending' ? Infinity : -Infinity) : b[key];

         
         if (typeof valA === 'string' && typeof valB === 'string') {
             return sortConfig.direction === 'ascending'
                 ? valA.localeCompare(valB)
                 : valB.localeCompare(valA);
         } else {
             if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
             if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
             return 0;
         }

       });
    }
    return sortableItems;
  }, [displayData, searchTerm, sortConfig, selectedDepartment]);

  useEffect(() => {
    const closeMenusOnClickOutside = (event) => {
      const target = event.target as Node;

      
      if (openRowMenuIndex !== null && rowMenuRef.current && !rowMenuRef.current.contains(target)) {
         const rowButton = document.querySelector(`[data-row-button-index="${openRowMenuIndex}"]`);
         if (rowButton && !rowButton.contains(target)) {
            setOpenRowMenuIndex(null);
         }
      }

      
      if (isHeaderMenuOpen && headerMenuRef.current && !headerMenuRef.current.contains(target)) {
        if (headerMenuButtonRef.current && !headerMenuButtonRef.current.contains(target)) {
           setIsHeaderMenuOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', closeMenusOnClickOutside);
    return () => document.removeEventListener('mousedown', closeMenusOnClickOutside);
  }, [openRowMenuIndex, isHeaderMenuOpen]); 


  return (
    <div className="bg-white dark:bg-[#171717] rounded-lg shadow p-5 overflow-x-auto">
      
      <div className="flex justify-between items-center mb-6 relative">
        <div className="flex items-center space-x-2">
            <ClipboardList size={20} className="text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-semibold font-montserrat dark:text-gray-200">Attendance History</h2>
        </div>
        
        <div className="relative">
             <button
                ref={headerMenuButtonRef}
                onClick={switchHeaderMenuVisibility}
                className="cursor-pointer text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-offset-neutral-800"
             >
                <MoreHorizontal size={18} />
            </button>
            
            {isHeaderMenuOpen && (
                <div
                    ref={headerMenuRef}
                    className="absolute right-0 mt-1 w-48 bg-white dark:bg-neutral-800 rounded-md shadow-lg ring-1 ring-black dark:ring-gray-700 ring-opacity-5 z-30" 
                >
                    <div className="py-1 font-body" role="menu" >
                         {['Refresh Data', 'Export Data', 'Settings'].map((action) => (
                            <button
                                key={action}
                                onClick={() => performHeaderAction(action)}
                                className="cursor-pointer flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-700"
                                role="menuitem"
                            >
                                {action === 'Refresh Data' && <RefreshCw size={14} className="mr-2 opacity-70"/>}
                                {action === 'Export Data' && <Download size={14} className="mr-2 opacity-70"/>}
                                {action === 'Settings' && <Settings size={14} className="mr-2 opacity-70"/>}
                                {action}
                            </button>
                        ))}
                    </div>
                </div>
            )}
         </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
          
           <div className="relative w-full sm:w-auto">
             <select
                value={selectedDepartment}
                onChange={departmentChosen}
                className="cursor-pointer appearance-none w-full sm:w-auto bg-white dark:bg-neutral-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-500 pr-8"
              >
                <option value="All">All Departments</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Human Resource">Human Resource</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
              </select>
              <ChevronDown size={16} className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
          </div>

           
           <div className="relative w-full sm:w-auto">
             <input
                type="date"
                value={selectedDate}
                onChange={calendarDateSelected}
                className="cursor-pointer w-full sm:w-auto bg-white dark:bg-neutral-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-500"
             />
           </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
           <div className="relative w-full sm:w-auto">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search employee"
              value={searchTerm}
              onChange={updateSearchQuery}
              className="w-full sm:w-auto bg-gray-100 dark:bg-neutral-800 border border-gray-300 dark:border-gray-700 rounded-lg pl-9 pr-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-500"
            />
          </div>
           <button onClick={exportTableToCSV} className="cursor-pointer flex items-center justify-center w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-600 rounded-lg px-4 py-1.5 text-sm font-medium">
             <Download size={16} className="mr-2" />
             <span>Download data</span>
          </button>
        </div>
      </div>

       <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-neutral-800">
           <tr>
             <th scope="col" className="px-2 sm:px-4 py-3 whitespace-nowrap">
               <button onClick={() => applyColumnSort('id')} className="flex items-center gap-1 cursor-pointer hover:text-gray-900 dark:hover:text-white"># ID {determineSortIcon('id')}</button>
            </th>
            <th scope="col" className="px-2 sm:px-4 py-3 whitespace-nowrap">
               <button onClick={() => applyColumnSort('name')} className="flex items-center gap-1 cursor-pointer hover:text-gray-900 dark:hover:text-white">Name {determineSortIcon('name')}</button>
            </th>
            <th scope="col" className="px-2 sm:px-4 py-3 whitespace-nowrap hidden sm:table-cell">
               <button onClick={() => applyColumnSort('department')} className="flex items-center gap-1 cursor-pointer hover:text-gray-900 dark:hover:text-white">Department {determineSortIcon('department')}</button>
            </th>
            <th scope="col" className="px-2 sm:px-4 py-3 whitespace-nowrap">
               <button onClick={() => applyColumnSort('clockIn')} className="flex items-center gap-1 cursor-pointer hover:text-gray-900 dark:hover:text-white">Clock-in {determineSortIcon('clockIn')}</button>
            </th>
            <th scope="col" className="px-2 sm:px-4 py-3 whitespace-nowrap hidden sm:table-cell">
               <button onClick={() => applyColumnSort('clockOut')} className="flex items-center gap-1 cursor-pointer hover:text-gray-900 dark:hover:text-white">Clock-out {determineSortIcon('clockOut')}</button>
            </th>
            <th scope="col" className="px-2 sm:px-4 py-3 whitespace-nowrap">
               <button onClick={() => applyColumnSort('status')} className="flex items-center gap-1 cursor-pointer hover:text-gray-900 dark:hover:text-white">Status {determineSortIcon('status')}</button>
            </th>
            <th scope="col" className="px-2 sm:px-4 py-3">
               <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
           {sortedAndFilteredData.map((item, index) => (
            <tr key={item.id} className="bg-white dark:bg-[#171717] border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-neutral-800">
              <td className="px-2 sm:px-4 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap text-xs sm:text-sm">{item.id}</td>
              <td className="px-2 sm:px-4 py-3">
                <div className="flex items-center space-x-2">
                  <Image
                     src={item.img}
                     alt={item.name}
                     width={28}
                     height={28}
                     className="rounded-full object-cover hidden sm:inline-block"
                   />
                  <span className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm">{item.name}</span>
                </div>
              </td>
              <td className="px-2 sm:px-4 py-3 dark:text-gray-400 hidden sm:table-cell text-xs sm:text-sm">{item.department}</td>
              <td className="px-2 sm:px-4 py-3 dark:text-gray-400 text-xs sm:text-sm">{item.clockIn}</td>
              <td className="px-2 sm:px-4 py-3 dark:text-gray-400 hidden sm:table-cell text-xs sm:text-sm">{item.clockOut}</td>
              <td className="px-2 sm:px-4 py-3">
                 <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyles(item.status)}`}>{item.status}</span>
              </td>
              <td className="px-2 sm:px-4 py-3 text-right relative">
                 <button
                    onClick={() => switchRowMenuVisibility(index)}
                    data-row-button-index={index} 
                    className="cursor-pointer text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-offset-neutral-800"
                 >
                    <MoreHorizontal size={18} />
                 </button>
                 {openRowMenuIndex === index && (
                    <div
                        ref={rowMenuRef} 
                        data-row-menu 
                        className="absolute right-0 mt-1 mr-2 sm:mr-0 w-40 bg-white dark:bg-neutral-800 rounded-md shadow-lg ring-1 ring-black dark:ring-gray-700 ring-opacity-5 z-20" 
                    >
                        <div className="py-1 font-body" role="menu" >
                             
                             {['View Details', 'Edit Times', 'Delete Entry'].map((action) => (
                                <button
                                    key={action}
                                    onClick={() => processRowMenuClick(action, item)}
                                    className={`cursor-pointer flex items-center w-full text-left px-4 py-2 text-sm ${
                                        action === 'Delete Entry'
                                        ? 'text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50'
                                        : 'text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-700'
                                    }`}
                                    role="menuitem"
                                >
                                    {action === 'Edit Times' && <Edit size={14} className="mr-2 opacity-70"/>}
                                    {action === 'Delete Entry' && <Trash2 size={14} className="mr-2 opacity-70"/>}
                                    {action === 'View Details' && <User size={14} className="mr-2 opacity-70"/>} 
                                    {action}
                                </button>
                            ))}
                        </div>
                    </div>
                 )}
              </td>
            </tr>
          ))}
            
            {sortedAndFilteredData.length === 0 && (
                <tr>
                    <td colSpan={7} className="text-center py-10 text-gray-500 dark:text-gray-400">
                        No matching records found.
                    </td>
                </tr>
            )}
        </tbody>
       </table>

       
       <ConfirmDeleteModal
            isOpen={isDeleteModalOpen}
            onClose={abortDeletion}
            onConfirm={deleteSelectedEntry}
            employeeName={employeeToDelete?.name ?? null}
       />
    </div>
  );
};

const Footer = () => {
    return (
        <footer className="mt-16 pt-8 pb-8 border-t border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-500 text-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                 <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    
                     <div className="text-center md:text-left">
                         <p className="font-semibold text-gray-600 dark:text-gray-400">Andromeda Inc.</p>
                         <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
                     </div>

                     
                    <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                         <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300 hover:underline">About Us</a>
                         <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300 hover:underline">Contact</a>
                         <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300 hover:underline">Privacy Policy</a>
                         <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300 hover:underline">Terms of Service</a>
                     </nav>

                    
                    <div className="flex justify-center md:justify-end space-x-5">
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                             <span className="sr-only">Twitter</span>
                             <Twitter size={20} />
                         </a>
                         <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                         >
                             <span className="sr-only">GitHub</span>
                             <Github size={20} />
                         </a>
                         <a
                             href="https://linkedin.com"
                             target="_blank"
                             rel="noopener noreferrer"
                             className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                             <span className="sr-only">LinkedIn</span>
                             <Linkedin size={20} />
                         </a>
                     </div>
                 </div>
             </div>
        </footer>
    );
};

const DashboardPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-200 font-roboto p-4 sm:p-8"> 
       <main className="flex-grow">
           <DashboardHeader />
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
               
                 <StatCard icon={UserCheck} title="Total Employees Present" value="120" change="+ 5%" changeColor="green" description="from yesterday" iconBgColor="bg-blue-100 dark:bg-blue-900" iconColor="text-blue-600 dark:text-blue-400" />
                 <StatCard icon={Clock} title="Late Arrivals Today" value="15" change="+ 3 people" changeColor="green" description="compared to last week" iconBgColor="bg-yellow-100 dark:bg-yellow-900" iconColor="text-yellow-600 dark:text-yellow-400" />
                 <StatCard icon={UserX} title="Employees Absent" value="8" change="- 2 people" changeColor="red" description="compared to last Monday" iconBgColor="bg-red-100 dark:bg-red-900" iconColor="text-red-600 dark:text-red-400" />
                 <StatCard icon={Timer} title="Average Check-In Time" value="08:25 AM" description="Consistent with last week" iconBgColor="bg-indigo-100 dark:bg-indigo-900" iconColor="text-indigo-600 dark:text-indigo-400" />
           </div>
          <AttendanceHistory />
       </main>
      <Footer /> 
    </div>
  );
};
export default DashboardPage;
