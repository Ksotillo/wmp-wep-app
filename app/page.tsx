'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import {
  Home, Bell, User, Settings, LogOut,
  CheckCircle, Info, Wrench, Circle,
  X, Search, SlidersHorizontal,
  ArrowUpDown,
  ListChecks, AlertOctagon, FilePlus, BarChart3,
  Loader2,
  PlusCircle,
  Building,
  Hash,
  ClipboardList,
  Users,
  KeyRound,
  CircleHelp,
  MoreVertical
} from 'lucide-react';
import { Montserrat, Roboto } from 'next/font/google';
import {
    ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
    XAxis, YAxis,
    AreaChart, Area
} from 'recharts';


const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});


type Theme = 'light' | 'dark';


type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  time: string;
};


const notificationsData: Notification[] = [
  { id: 'n1', type: 'alert', title: 'Urgent: Leak Reported', message: 'Unit Cmplx 5-305 reported a kitchen sink leak.', time: '10m ago' },
  { id: 'n2', type: 'update', title: 'HVAC Maintenance', message: 'Scheduled PM for Bldg A-101 is due today.', time: '1h ago' },
  { id: 'n3', type: 'info', title: 'Pest Control Completed', message: 'Unit Bldg C-210 service finished.', time: '3h ago' },
];


const getNotificationIcon = (type: string) => {
  const classes = "w-5 h-5";
  switch (type) {
    case 'alert': return <Circle fill="currentColor" className={`text-red-500 ${classes}`} />;
    case 'update': return <Circle fill="currentColor" className={`text-blue-500 ${classes}`} />;
    case 'info': return <Circle fill="currentColor" className={`text-green-500 ${classes}`} />;
    default: return <Circle className={`text-gray-500 ${classes}`} />;
  }
};


type ActivityStatus = 'URGENT' | 'NEW' | 'COMPLETED' | 'PROCESSED';
const ALL_ACTIVITY_STATUSES: ActivityStatus[] = ['URGENT', 'NEW', 'COMPLETED', 'PROCESSED'];
type ActivityLog = {
  id: string;
  statusIndicator: 'red' | 'green' | 'gray' | 'blue' | 'purple';
  unitNumber: string;
  unitName: string;
  taskCode: string;
  taskDescription: string;
  personName: string;
  personRole: string;
  personAvatarUrl: string;
  actionText: string;
  status: ActivityStatus;
  timestamp: string;
  dateTime: Date;
  dateCategory: 'Today' | 'Yesterday' | 'Earlier';
  workDescription: string;
};

const parseTimestamp = (timestamp: string, dateCategory: ActivityLog['dateCategory']): Date => {
    const now = new Date();
    let date = new Date();

    if (dateCategory === 'Yesterday') {
        date.setDate(now.getDate() - 1);
    } else if (dateCategory === 'Earlier') {
        
         const dayMatch = timestamp.match(/(\d+)\sMar/);
         const day = dayMatch ? parseInt(dayMatch[1]) : now.getDate() - 2;
         date = new Date(now.getFullYear(), 2, day);
    }

    if (timestamp.includes('AM') || timestamp.includes('PM')) {
        const [time, modifier] = timestamp.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        date.setHours(hours, minutes, 0, 0);
    } else {
       
        date.setHours(12, 0, 0, 0);
    }

   
    if (dateCategory === 'Today' && date > now) {
        date.setDate(date.getDate() - 1);
    }
    if (dateCategory === 'Yesterday' && date >= new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
        
         date.setDate(date.getDate() - 1);
    }

    return date;
};

const rawActivityLogsData: Omit<ActivityLog, 'dateTime'>[] = [
  {
    id: 'act-1', statusIndicator: 'red', unitNumber: 'Unit 3652', unitName: 'Aero Loft', taskCode: 'E-983', taskDescription: 'Electricity',
    personName: 'Haris Bowman', personRole: 'Supervisor', personAvatarUrl: 'https://randomuser.me/api/portraits/men/75.jpg',
    actionText: 'Changed status to', status: 'URGENT', timestamp: '8:08 AM', dateCategory: 'Today',
    workDescription: 'Investigate power outage reported in unit 3652. Check breaker box and main lines.'
  },
   {
    id: 'act-7', statusIndicator: 'blue', unitNumber: 'Unit 1011', unitName: 'Sky Tower', taskCode: 'P-450', taskDescription: 'Plumbing',
    personName: 'Carlos Ray', personRole: 'Worker', personAvatarUrl: 'https://randomuser.me/api/portraits/men/79.jpg',
    actionText: 'Changed status to', status: 'PROCESSED', timestamp: '10:15 AM', dateCategory: 'Today',
    workDescription: 'Tenant request for leaky faucet processed, assigned to plumber.'
  },
  {
    id: 'act-2', statusIndicator: 'green', unitNumber: 'Unit 3425', unitName: 'Rose Loft', taskCode: 'G-872', taskDescription: 'Gas',
    personName: 'Vanessa Douglas', personRole: 'Manager', personAvatarUrl: 'https://randomuser.me/api/portraits/women/76.jpg',
    actionText: 'Changed status to', status: 'NEW', timestamp: '8:09 AM', dateCategory: 'Today',
    workDescription: 'Perform routine gas safety check as requested by tenant.'
  },
  {
    id: 'act-3', statusIndicator: 'gray', unitNumber: 'Unit 2980', unitName: 'Lazarote', taskCode: 'S-109', taskDescription: 'Structural',
    personName: 'Vanessa Douglas', personRole: 'Manager', personAvatarUrl: 'https://randomuser.me/api/portraits/women/76.jpg',
    actionText: 'Changed status to', status: 'COMPLETED', timestamp: '7:21 AM', dateCategory: 'Today',
    workDescription: 'Minor structural repair completed on balcony railing.'
  },
  {
    id: 'act-4', statusIndicator: 'blue', unitNumber: 'Unit 4592', unitName: 'Maestro Loft', taskCode: 'S-108', taskDescription: 'Structural',
    personName: 'Issac Bowman', personRole: 'Worker', personAvatarUrl: 'https://randomuser.me/api/portraits/men/78.jpg',
    actionText: 'Changed status to', status: 'PROCESSED', timestamp: '4:23 PM', dateCategory: 'Yesterday',
    workDescription: 'Structural inspection report processed and filed.'
  },
   {
    id: 'act-8', statusIndicator: 'red', unitNumber: 'Unit 1875', unitName: 'Harmony', taskCode: 'H-112', taskDescription: 'HVAC',
    personName: 'Tanisha Combs', personRole: 'Manager', personAvatarUrl: 'https://randomuser.me/api/portraits/women/77.jpg',
    actionText: 'Marked status as', status: 'URGENT', timestamp: '1:30 PM', dateCategory: 'Yesterday',
    workDescription: 'Tenant reported no heating. Marked as urgent due to cold weather.'
  },
  {
    id: 'act-5', statusIndicator: 'green', unitNumber: 'Unit 1875', unitName: 'Harmony', taskCode: 'G-863', taskDescription: 'Gas',
    personName: 'Tanisha Combs', personRole: 'Manager', personAvatarUrl: 'https://randomuser.me/api/portraits/women/77.jpg',
    actionText: 'Changed status to', status: 'NEW', timestamp: '9:48 AM', dateCategory: 'Yesterday',
    workDescription: 'New work order created for gas leak inspection.'
  },
  {
    id: 'act-9', statusIndicator: 'gray', unitNumber: 'Unit 3652', unitName: 'Aero Loft', taskCode: 'E-980', taskDescription: 'Electricity',
    personName: 'Carlos Ray', personRole: 'Worker', personAvatarUrl: 'https://randomuser.me/api/portraits/men/79.jpg',
    actionText: 'Changed status to', status: 'COMPLETED', timestamp: '11:55 AM', dateCategory: 'Yesterday',
    workDescription: 'Replaced faulty light fixture in kitchen.'
  },
  {
    id: 'act-6', statusIndicator: 'gray', unitNumber: 'Unit 8493', unitName: 'Water Supply', taskCode: 'W-371', taskDescription: 'Water',
    personName: 'Haris Bowman', personRole: 'Supervisor', personAvatarUrl: 'https://randomuser.me/api/portraits/men/75.jpg',
    actionText: 'Changed status to', status: 'COMPLETED', timestamp: '19 Mar', dateCategory: 'Earlier',
    workDescription: 'Water supply valve replacement completed successfully.'
  },
  {
    id: 'act-10', statusIndicator: 'blue', unitNumber: 'Unit 1011', unitName: 'Sky Tower', taskCode: 'R-015', taskDescription: 'Rent Collection',
    personName: 'Vanessa Douglas', personRole: 'Manager', personAvatarUrl: 'https://randomuser.me/api/portraits/women/76.jpg',
    actionText: 'Marked status as', status: 'PROCESSED', timestamp: '18 Mar', dateCategory: 'Earlier',
    workDescription: 'March rent payment processed and recorded.'
  },
   {
    id: 'act-11', statusIndicator: 'green', unitNumber: 'Unit 4592', unitName: 'Maestro Loft', taskCode: 'C-003', taskDescription: 'Cleaning',
    personName: 'Issac Bowman', personRole: 'Worker', personAvatarUrl: 'https://randomuser.me/api/portraits/men/78.jpg',
    actionText: 'Created new task', status: 'NEW', timestamp: '17 Mar', dateCategory: 'Earlier',
    workDescription: 'Schedule move-out cleaning for Unit 4592.'
  },
];

const activityLogsData: ActivityLog[] = rawActivityLogsData.map(log => ({
    ...log,
    dateTime: parseTimestamp(log.timestamp, log.dateCategory)
}));


const getIndicatorColor = (indicator: ActivityLog['statusIndicator']): string => {
  switch (indicator) {
    case 'red': return 'text-red-500';
    case 'green': return 'text-green-500';
    case 'gray': return 'text-gray-500';
    case 'blue': return 'text-blue-500';
    case 'purple': return 'text-purple-500';
    default: return 'text-gray-600';
  }
};

interface ActivityItemProps {
  item: ActivityLog;
  onClick: () => void;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ item, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex flex-col sm:flex-row sm:items-center bg-white dark:bg-[#1a1a1a] p-3 sm:p-4 rounded-lg mb-3 sm:space-x-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150 cursor-pointer shadow-sm dark:border dark:border-gray-800"
    >
      <div className="flex items-center justify-between w-full mb-2 sm:mb-0">
        <div className="flex items-center space-x-3 flex-grow min-w-0">
          <Circle className={`w-4 h-4 sm:w-3 flex-shrink-0 ${getIndicatorColor(item.statusIndicator)} fill-current`} />
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{item.unitNumber} - {item.taskCode}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{item.unitName} ({item.taskDescription})</p>
          </div>
        </div>

        
        <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-1 sm:space-y-0 sm:space-x-3 flex-shrink-0 ml-2">
            <span className={`inline-block px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium ${getStatusStyles(item.status)}`}>
                {item.status}
            </span>
            <span className="text-[10px] sm:text-sm text-gray-500 dark:text-gray-400 font-mono w-14 text-right">{item.timestamp}</span>
        </div>
      </div>

      
      <div className="flex items-center space-x-2 pt-2 mt-2 border-t border-gray-100 dark:border-gray-700/50 w-full sm:w-auto sm:flex-1 sm:min-w-0 sm:pt-0 sm:mt-0 sm:border-t-0">
        <Image
          src={item.personAvatarUrl}
          alt={item.personName}
          width={28}
          height={28}
          className="rounded-full"
        />
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{item.personName}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{item.personRole}</p>
        </div>
      </div>
    </div>
  );
};

const personnelData = [
    { id: 'p1', name: 'Haris Bowman', role: 'Supervisor', avatar: 'https://randomuser.me/api/portraits/men/75.jpg' },
    { id: 'p2', name: 'Vanessa Douglas', role: 'Manager', avatar: 'https://randomuser.me/api/portraits/women/76.jpg' },
    { id: 'p3', name: 'Issac Bowman', role: 'Worker', avatar: 'https://randomuser.me/api/portraits/men/78.jpg' },
    { id: 'p4', name: 'Tanisha Combs', role: 'Manager', avatar: 'https://randomuser.me/api/portraits/women/77.jpg' },
    { id: 'p5', name: 'Carlos Ray', role: 'Worker', avatar: 'https://randomuser.me/api/portraits/men/79.jpg' },
];
type Personnel = typeof personnelData[0];


const FormInput = ({ label, id, icon: Icon, ...props }: any) => (
    <div>
        <label htmlFor={id} className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{label}</label>
        <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
               <Icon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            </span>
            <input
                id={id}
                className="w-full pl-10 pr-3 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                {...props}
            />
        </div>
    </div>
);

const FormSelect = ({ label, id, children, ...props }: any) => (
    <div>
       <label htmlFor={id} className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{label}</label>
        <select
            id={id}
            className="w-full px-3 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-600 text-gray-900 dark:text-gray-100"
            {...props}
        >
            {children}
        </select>
    </div>
);


interface CreateWorkOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (newOrderData: Omit<ActivityLog, 'id' | 'dateTime' | 'dateCategory' | 'timestamp' | 'statusIndicator' | 'personAvatarUrl' | 'actionText'>) => void;
    theme: Theme;
}

const CreateWorkOrderModal: React.FC<CreateWorkOrderModalProps> = ({ isOpen, onClose, onCreate, theme }) => {
    const [unitNumber, setUnitNumber] = useState('');
    const [unitName, setUnitName] = useState('');
    const [taskCode, setTaskCode] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [personName, setPersonName] = useState(personnelData[0]?.name || '');
    const [status, setStatus] = useState<ActivityStatus>('NEW');
    const [workDescription, setWorkDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
       
        const selectedPerson = personnelData.find((p: Personnel) => p.name === personName);
        if (!selectedPerson) return;

        onCreate({
            unitNumber,
            unitName,
            taskCode,
            taskDescription,
            personName: selectedPerson.name,
            personRole: selectedPerson.role,
            status,
            workDescription
        });
       
        setUnitNumber(''); setUnitName(''); setTaskCode(''); setTaskDescription('');
        setPersonName(personnelData[0]?.name || ''); setStatus('NEW'); setWorkDescription('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div
                className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-300 dark:border-gray-700"
                onClick={e => e.stopPropagation()}
            >
                 
                <div className="flex justify-between items-center p-4 border-b border-gray-300 dark:border-gray-700">
                    <h3 className={`${montserrat.className} text-lg font-semibold text-gray-900 dark:text-white`}>Create New Work Order</h3>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput label="Unit Number" id="unitNumber" icon={Hash} value={unitNumber} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUnitNumber(e.target.value)} required />
                        <FormInput label="Unit Name" id="unitName" icon={Building} value={unitName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUnitName(e.target.value)} />
                        <FormInput label="Task Code" id="taskCode" icon={ClipboardList} value={taskCode} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTaskCode(e.target.value)} />
                        <FormInput label="Task Description" id="taskDescription" icon={Wrench} value={taskDescription} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTaskDescription(e.target.value)} required />
                     </div>

                    <FormSelect label="Assign To" id="assignee" value={personName} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPersonName(e.target.value)} required>
                        
                        {personnelData.map((person: Personnel) => (
                           <option key={person.id} value={person.name}>{person.name} ({person.role})</option>
                        ))}
                    </FormSelect>

                    <FormSelect label="Status" id="status" value={status} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value as ActivityStatus)} required>
                         {ALL_ACTIVITY_STATUSES.map(s => (
                           <option key={s} value={s}>{s}</option>
                        ))}
                    </FormSelect>

                    <div>
                        <label htmlFor="workDescription" className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Work Details / Description</label>
                        <textarea
                            id="workDescription"
                            rows={4}
                            value={workDescription}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setWorkDescription(e.target.value)}
                            className="w-full px-3 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                            required
                        ></textarea>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-lg text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 mr-2 cursor-pointer">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm rounded-lg bg-blue-500 hover:bg-blue-600 text-white cursor-pointer">Create Order</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


interface OverviewDashboardProps {
    theme: Theme;
    activityLogs: ActivityLog[];
    onOpenCreateModal: () => void;
}

const OverviewDashboard: React.FC<OverviewDashboardProps> = ({ theme, activityLogs, onOpenCreateModal }) => {
    const totalTasks = activityLogs.length;
    const urgentTasks = activityLogs.filter(log => log.status === 'URGENT').length;
    const newTasks = activityLogs.filter(log => log.status === 'NEW').length;
    const processedTasks = activityLogs.filter(log => log.status === 'PROCESSED').length;
    const completedToday = activityLogs.filter(log => log.status === 'COMPLETED' && log.dateCategory === 'Today').length;

   
    const statusCounts = ALL_ACTIVITY_STATUSES.map(status => ({
        name: status,
        value: activityLogs.filter(log => log.status === status).length
    })).filter(item => item.value > 0);

    const PIE_COLORS: { [key in ActivityStatus]: string } = {
        URGENT: '#ef4444',
        NEW: '#22c55e',
        PROCESSED: '#3b82f6',
        COMPLETED: '#6b7280'
    };

   
    const lineChartData = useMemo(() => {
        const last7Days: { date: string; completed: number }[] = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            const completedCount = activityLogsData.filter(log => {
               
                if (!log.dateTime) return false;
                const logDate = new Date(log.dateTime);
                logDate.setHours(0, 0, 0, 0);
                return log.status === 'COMPLETED' && logDate.getTime() === date.getTime();
            }).length;

            last7Days.push({ date: dateString, completed: completedCount });
        }
        return last7Days;
    }, [activityLogsData]);

   
    interface SummaryCardProps {
        title: string;
        value: number | string;
        icon: React.ElementType;
        colorClass: string;
    }
    const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon: Icon, colorClass }) => (
        <div className="bg-white dark:bg-[#1a1a1a] p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 flex items-center space-x-4">
            <div className={`p-3 rounded-full ${colorClass} bg-opacity-10 dark:bg-opacity-20`}>
                <Icon className={`w-6 h-6 ${colorClass}`} />
            </div>
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
                <p className={`${montserrat.className} text-2xl font-semibold text-gray-900 dark:text-white`}>{value}</p>
            </div>
        </div>
    );

    return (
        <div className="pt-6 space-y-6">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                 <h2 className={`${montserrat.className} text-xl font-semibold mb-3 text-gray-700 dark:text-gray-400`}>Dashboard Overview</h2>
                 <button
                    onClick={onOpenCreateModal}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium cursor-pointer transition-colors mb-3 sm:mb-0"
                 >
                     <PlusCircle className="w-5 h-5" />
                     <span>Create Work Order</span>
                 </button>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <SummaryCard title="Total Tasks" value={totalTasks} icon={ListChecks} colorClass="text-purple-500" />
                <SummaryCard title="Urgent" value={urgentTasks} icon={AlertOctagon} colorClass="text-red-500" />
                <SummaryCard title="New" value={newTasks} icon={FilePlus} colorClass="text-green-500" />
                <SummaryCard title="Processed" value={processedTasks} icon={Loader2} colorClass="text-blue-500" />
                <SummaryCard title="Completed Today" value={completedToday} icon={CheckCircle} colorClass="text-gray-500" />
             </div>

             
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                <div className="bg-white dark:bg-[#1a1a1a] p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
                    <h3 className={`${montserrat.className} text-base font-semibold mb-4 text-gray-800 dark:text-gray-100`}>Task Status Distribution</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={statusCounts}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={110}
                                    innerRadius={60}
                                    fill="#8884d8"
                                    dataKey="value"
                                    paddingAngle={2}
                                    cornerRadius={3}
                                >
                                    {statusCounts.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[entry.name as ActivityStatus]} stroke={theme === 'dark' ? '#1a1a1a' : '#fff'} strokeWidth={1} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: theme === 'dark' ? 'rgba(40, 40, 40, 0.9)' : 'rgba(255, 255, 255, 0.9)', border: '1px solid #555', borderRadius: '4px', boxShadow: '0 2px 10px rgba(0,0,0,0.2)'}}
                                    itemStyle={{ color: theme === 'dark' ? '#eee' : '#333' }}
                                    labelStyle={{ color: theme === 'dark' ? '#fff' : '#000', fontWeight: 'bold' }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                
                 <div className="bg-white dark:bg-[#1a1a1a] p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
                     <h3 className={`${montserrat.className} text-base font-semibold mb-4 text-gray-800 dark:text-gray-100`}>Tasks Completed (Last 7 Days)</h3>
                     <div style={{ width: '100%', height: 300 }}>
                         <ResponsiveContainer>
                            <AreaChart data={lineChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                 <defs>
                                     <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                                         <stop offset="5%" stopColor="#8884d8" stopOpacity={0.4}/>
                                         <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                                     </linearGradient>
                                 </defs>
                                <XAxis dataKey="date" stroke={theme === 'dark' ? '#6b7280' : '#9ca3af'} fontSize={12} axisLine={false} tickLine={false} />
                                <YAxis allowDecimals={false} stroke={theme === 'dark' ? '#6b7280' : '#9ca3af'} fontSize={12} axisLine={false} tickLine={false}/>
                                <Tooltip
                                    contentStyle={{ backgroundColor: theme === 'dark' ? 'rgba(40, 40, 40, 0.9)' : 'rgba(255, 255, 255, 0.9)', border: '1px solid #555', borderRadius: '4px', boxShadow: '0 2px 10px rgba(0,0,0,0.2)'}}
                                    itemStyle={{ color: theme === 'dark' ? '#eee' : '#333' }}
                                    labelStyle={{ color: theme === 'dark' ? '#fff' : '#000', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="completed" stroke="#8884d8" strokeWidth={3} fillOpacity={1} fill="url(#colorCompleted)" activeDot={{ r: 6, strokeWidth: 2, fill: '#fff' }} />
                            </AreaChart>
                         </ResponsiveContainer>
                     </div>
                 </div>
             </div>
        </div>
    );
};
interface ActivityModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: ActivityLog | null;
}

const ActivityModal: React.FC<ActivityModalProps> = ({ isOpen, onClose, item }) => {
    if (!isOpen || !item) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 border border-gray-300 dark:border-gray-700"
                onClick={e => e.stopPropagation()}
            >
                
                <div className="flex justify-between items-center mb-4 border-b border-gray-300 dark:border-gray-700 pb-3">
                    <h3 className={`${montserrat.className} text-xl font-semibold text-gray-900 dark:text-white`}>
                        Activity Details
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                
                <div className="space-y-4">
                    
                    <div className="flex items-center space-x-4 flex-wrap">
                        <Circle className={`w-4 h-4 flex-shrink-0 ${getIndicatorColor(item.statusIndicator)} fill-current`} />
                        <div className="flex-1 min-w-0">
                            <p className="text-base font-medium text-gray-900 dark:text-gray-100">{item.unitNumber} - {item.unitName}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{item.taskCode} ({item.taskDescription})</p>
                        </div>
                        <span className={`inline-block px-2.5 py-1 rounded text-sm font-medium ${getStatusStyles(item.status)} ml-auto mr-4 mt-2 sm:mt-0`}>
                            {item.status}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400 font-mono flex-shrink-0 mt-2 sm:mt-0">{item.timestamp}</span>
                    </div>

                    
                    <div className="flex items-center space-x-3 bg-gray-100 dark:bg-gray-800/50 p-3 rounded-lg">
                        <Image
                            src={item.personAvatarUrl}
                            alt={item.personName}
                            width={36}
                            height={36}
                            className="rounded-full"
                        />
                        <div>
                            <p className="text-base font-medium text-gray-900 dark:text-gray-100">{item.personName}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{item.personRole}</p>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 ml-auto">{item.actionText} status</p>
                    </div>

                    
                    <div>
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-400 mb-1">Work Description:</h4>
                        <p className="text-sm text-gray-800 dark:text-gray-300 bg-gray-100 dark:bg-gray-800/50 p-3 rounded-lg">
                            {item.workDescription}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

type SortOption = 'Date (Newest)' | 'Date (Oldest)' | 'Status';
type RentStatus = 'Paid' | 'Due' | 'Overdue';
interface RentPayment {
    id: string;
    tenantId: string;
    amount: number;
    paymentDate: Date;
    period: string;
}
interface Tenant {
    id: string;
    name: string;
    unitNumber: string;
    unitName: string;
    rentAmount: number;
    leaseEndDate: Date;
    lastPaymentDate: Date | null;
    rentStatus: RentStatus;
}
const tenantsData: Tenant[] = [
    { id: 't1', name: 'Alice Johnson', unitNumber: 'Bldg A-101', unitName: 'Sunrise Suite', rentAmount: 1500, leaseEndDate: new Date('2024-12-31'), lastPaymentDate: new Date('2024-03-01'), rentStatus: 'Paid' },
    { id: 't2', name: 'Bob Williams', unitNumber: 'Cmplx 5-305', unitName: 'Ocean View', rentAmount: 2200, leaseEndDate: new Date('2025-06-30'), lastPaymentDate: new Date('2024-02-05'), rentStatus: 'Overdue' },
    { id: 't3', name: 'Charlie Brown', unitNumber: 'Tower 1-15B', unitName: 'Cityscape Apt', rentAmount: 1850, leaseEndDate: new Date('2024-09-30'), lastPaymentDate: null, rentStatus: 'Due' },
    { id: 't4', name: 'Diana Davis', unitNumber: 'Bldg C-210', unitName: 'Garden Flat', rentAmount: 1300, leaseEndDate: new Date('2024-11-30'), lastPaymentDate: new Date('2024-03-03'), rentStatus: 'Paid' },
    { id: 't5', name: 'Ethan Miller', unitNumber: 'Bldg A-102', unitName: 'Sunset Studio', rentAmount: 1150, leaseEndDate: new Date('2025-01-31'), lastPaymentDate: new Date('2024-02-28'), rentStatus: 'Due' },
];
const rentPaymentsData: RentPayment[] = [
    { id: 'rp1', tenantId: 't1', amount: 1500, paymentDate: new Date('2024-03-01'), period: 'March 2024' },
    { id: 'rp2', tenantId: 't2', amount: 2200, paymentDate: new Date('2024-02-05'), period: 'February 2024' },
    { id: 'rp3', tenantId: 't4', amount: 1300, paymentDate: new Date('2024-03-03'), period: 'March 2024' },
    { id: 'rp4', tenantId: 't5', amount: 1150, paymentDate: new Date('2024-02-28'), period: 'February 2024' },
];


const PropertyManagementDashboard = () => {
  const [theme, setTheme] = useState<Theme>('light');
  const [isThemeInitialized, setIsThemeInitialized] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [selectedActivityItem, setSelectedActivityItem] = useState<ActivityLog | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isIssueAccessModalOpen, setIsIssueAccessModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('Overview');
  const [sortOption, setSortOption] = useState<SortOption>('Date (Newest)');
  const [selectedStatuses, setSelectedStatuses] = useState<Set<ActivityStatus>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const notificationsTriggerRef = useRef<HTMLButtonElement>(null);
  const notificationsPanelRef = useRef<HTMLDivElement>(null);
  const profileTriggerRef = useRef<HTMLDivElement>(null);
  const profilePanelRef = useRef<HTMLDivElement>(null);
  const sortTriggerRef = useRef<HTMLButtonElement>(null);
  const sortPanelRef = useRef<HTMLDivElement>(null);
  const filterTriggerRef = useRef<HTMLButtonElement>(null);
  const filterPanelRef = useRef<HTMLDivElement>(null);
  const [accessItems, setAccessItems] = useState<AccessItem[]>([
    { id: 'acc1', identifier: 'K101A', type: 'Key', assignedUnit: 'Bldg A-101', assignedPerson: 'Alice Johnson', status: 'Active', lastIssued: new Date('2023-01-15') },
    { id: 'acc2', identifier: 'FOB305C', type: 'Fob', assignedUnit: 'Cmplx 5-305', assignedPerson: 'Bob Williams', status: 'Active', lastIssued: new Date('2023-06-01') },
    { id: 'acc3', identifier: 'K15B-M', type: 'Key', assignedUnit: 'Tower 1-15B', assignedPerson: 'Maintenance', status: 'Active', lastIssued: new Date('2022-11-01') },
    { id: 'acc4', identifier: 'K210C', type: 'Key', assignedUnit: 'Bldg C-210', assignedPerson: 'Diana Davis', status: 'Lost', lastIssued: new Date('2023-04-10') },
    { id: 'acc5', identifier: 'FOB102A', type: 'Fob', assignedUnit: 'Bldg A-102', assignedPerson: 'Ethan Miller', status: 'Active', lastIssued: new Date('2024-02-01') },
    { id: 'acc6', identifier: 'K-SPARE-01', type: 'Key', assignedUnit: null, assignedPerson: null, status: 'Unassigned', lastIssued: null },
    { id: 'acc7', identifier: 'CODE-GATE1', type: 'Code', assignedUnit: 'Common Area', assignedPerson: 'All Tenants', status: 'Active', lastIssued: new Date('2024-01-01') },
    { id: 'acc8', identifier: 'FOB-POOL', type: 'Fob', assignedUnit: 'Common Area', assignedPerson: 'Pool Service', status: 'Inactive', lastIssued: new Date('2023-05-01') },
  ]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => 
      rawActivityLogsData.map(log => ({
          ...log,
          dateTime: parseTimestamp(log.timestamp, log.dateCategory)
      }))
  );
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(savedTheme || (prefersDark ? 'dark' : 'light'));
    setIsThemeInitialized(true);
  }, []);
  useEffect(() => {
    if (isThemeInitialized) {
      if (theme === 'dark') { document.documentElement.classList.add('dark'); }
      else { document.documentElement.classList.remove('dark'); }
      localStorage.setItem('theme', theme);
    }
  }, [theme, isThemeInitialized]);
  const toggleNotificationsDropdown = () => setIsNotificationsOpen(!isNotificationsOpen);
  const toggleProfileDropdown = () => setIsProfileOpen(!isProfileOpen);
  const toggleSortDropdown = () => setIsSortDropdownOpen(!isSortDropdownOpen);
  const toggleFilterDropdown = () => setIsFilterDropdownOpen(!isFilterDropdownOpen);
  const openActivityModal = (item: ActivityLog) => { setSelectedActivityItem(item); setIsActivityModalOpen(true); };
  const closeActivityModal = () => { setIsActivityModalOpen(false); setSelectedActivityItem(null); };
  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);
  const openIssueAccessModal = () => setIsIssueAccessModalOpen(true);
  const closeIssueAccessModal = () => setIsIssueAccessModalOpen(false);
  const handleCreateWorkOrder = (formData: Omit<ActivityLog, 'id' | 'dateTime' | 'dateCategory' | 'timestamp' | 'statusIndicator' | 'personAvatarUrl' | 'actionText'>) => {
      const now = new Date();
      const { timestamp, dateCategory } = formatDateTime(now);
      const person = personnelData.find(p => p.name === formData.personName);

      const newWorkOrder: ActivityLog = {
          ...formData,
          id: `wo-${Date.now()}`,
          dateTime: now,
          timestamp: timestamp,
          dateCategory: dateCategory,
          statusIndicator: getIndicatorFromStatus(formData.status),
          personAvatarUrl: person?.avatar || '',
          actionText: 'Created'
      };

      setActivityLogs(prevLogs => [newWorkOrder, ...prevLogs]);
     
  };
  const handleIssueAccessItem = (newItemData: Omit<AccessItem, 'id' | 'lastIssued' | 'status'> & { status: 'Active' }) => {
      const newItem: AccessItem = {
          ...newItemData,
          id: `acc-${Date.now()}`,
          lastIssued: new Date(),
      };
     
      setAccessItems((prevItems: AccessItem[]) => [newItem, ...prevItems]);
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      type SpecificRefObject<T extends HTMLElement> = React.RefObject<T | null>;
      const checkOutside = <T extends HTMLElement>(
          triggerRef: SpecificRefObject<T>,
          panelRef: React.RefObject<HTMLDivElement | null>,
          closeCallback: () => void
      ) => {
          if (triggerRef.current && !triggerRef.current.contains(event.target as Node) && panelRef.current && !panelRef.current.contains(event.target as Node)) {
              closeCallback();
          }
      };
      checkOutside<HTMLButtonElement>(notificationsTriggerRef, notificationsPanelRef, () => setIsNotificationsOpen(false));
      checkOutside<HTMLDivElement>(profileTriggerRef, profilePanelRef, () => setIsProfileOpen(false));
      checkOutside<HTMLButtonElement>(sortTriggerRef, sortPanelRef, () => setIsSortDropdownOpen(false));
      checkOutside<HTMLButtonElement>(filterTriggerRef, filterPanelRef, () => setIsFilterDropdownOpen(false));
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => { document.removeEventListener('mousedown', handleClickOutside); };
  }, []);
  const handleFilterChange = (status: ActivityStatus) => {
    setSelectedStatuses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(status)) {
        newSet.delete(status);
      } else {
        newSet.add(status);
      }
      return newSet;
    });
  };
  const clearFilters = () => {
      setSelectedStatuses(new Set());
      setIsFilterDropdownOpen(false);
  };
  const handleSortChange = (option: SortOption) => {
    setSortOption(option);
    setIsSortDropdownOpen(false);
  };
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value);
  };
  const processedActivities = useMemo(() => {
    let results = [...activityLogs];
    if (searchQuery.trim() !== '') {
        const lowerCaseQuery = searchQuery.toLowerCase();
        results = results.filter(log =>
            log.unitNumber.toLowerCase().includes(lowerCaseQuery) ||
            log.unitName.toLowerCase().includes(lowerCaseQuery) ||
            log.taskCode.toLowerCase().includes(lowerCaseQuery) ||
            log.taskDescription.toLowerCase().includes(lowerCaseQuery) ||
            log.personName.toLowerCase().includes(lowerCaseQuery)
        );
    }
    if (selectedStatuses.size > 0) {
        results = results.filter(log => selectedStatuses.has(log.status));
    }
    const statusOrder: Record<ActivityStatus, number> = { 'URGENT': 1, 'NEW': 2, 'PROCESSED': 3, 'COMPLETED': 4 };
    results.sort((a, b) => {
        switch (sortOption) {
            case 'Date (Oldest)': return a.dateTime.getTime() - b.dateTime.getTime();
            case 'Status': return statusOrder[a.status] - statusOrder[b.status];
            case 'Date (Newest)': default: return b.dateTime.getTime() - a.dateTime.getTime();
        }
    });
    return results;
  }, [searchQuery, selectedStatuses, sortOption, activityLogs]);
  const groupedProcessedActivities = useMemo(() => {
      return processedActivities.reduce((acc, log) => {
          const category = log.dateCategory;
          if (!acc[category]) { acc[category] = []; }
          acc[category].push(log);
          return acc;
      }, {} as Record<ActivityLog['dateCategory'], ActivityLog[]>);
  }, [processedActivities]);

  const dateCategories: ActivityLog['dateCategory'][] = ['Today', 'Yesterday', 'Earlier'];
  const tabNames = ['Overview', 'Work orders', 'Rent', 'Collection', 'Access'];

  if (!isThemeInitialized) { return null; }

  return (
    <div className={`${roboto.className} flex flex-col h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white`}>
       <div className="p-4">
        <header className="h-16 px-4 sm:px-6 flex items-center justify-between bg-white dark:bg-[#1a1a1a] rounded-xl shadow-md dark:shadow-none">
          <div className="flex items-center justify-center w-10 h-10 bg-lime-300 dark:bg-[#e8ff46] rounded-lg">
            <Home className="w-6 h-6 text-black dark:text-black" />
          </div>
          <div className="flex items-center space-x-4">
             <div className="relative">
              <button ref={notificationsTriggerRef} onClick={toggleNotificationsDropdown} className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none cursor-pointer" aria-haspopup="true" aria-expanded={isNotificationsOpen}>
                <Bell className="w-6 h-6" />
                {notificationsData.length > 0 && (<span className="absolute top-1.5 right-1.5 block w-2 h-2 bg-red-500 rounded-full ring-1 ring-offset-1 ring-offset-white dark:ring-offset-[#1a1a1a] ring-red-500"></span>)}
              </button>
              {isNotificationsOpen && (
                 <div ref={notificationsPanelRef} className="absolute top-full right-0 mt-2 w-80 max-h-[400px] overflow-y-auto bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20">
                   <div className="p-3 border-b border-gray-200 dark:border-gray-700"><h4 className={`${montserrat.className} font-semibold text-gray-800 dark:text-white`}>Notifications</h4></div>
                   <div className="divide-y divide-gray-100 dark:divide-gray-700">
                     {notificationsData.length > 0 ? (
                       notificationsData.map((notif) => (
                         <div key={notif.id} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                           <div className="flex items-start space-x-3">
                               <div className="mt-1 flex-shrink-0">{getNotificationIcon(notif.type)}</div>
                               <div className="flex-grow">
                                 <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{notif.title}</p>
                                 <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{notif.message}</p>
                                 <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-1">{notif.time}</p>
                               </div>
                           </div>
                         </div>
                       ))
                     ) : (<p className="p-4 text-sm text-center text-gray-500 dark:text-gray-400">No new notifications.</p>)}
                   </div>
                   {notificationsData.length > 0 && (<div className="p-2 text-center border-t border-gray-200 dark:border-gray-700"><a href="#" className="text-xs text-blue-500 dark:text-blue-400 hover:underline">View all notifications</a></div>)}
                 </div>
               )}
            </div>
            <div className="relative">
              <div ref={profileTriggerRef} onClick={toggleProfileDropdown} className="w-9 h-9 rounded-full overflow-hidden cursor-pointer relative" role="button" aria-haspopup="true" aria-expanded={isProfileOpen}>
                <Image src="https://randomuser.me/api/portraits/women/75.jpg" alt="User Avatar" layout="fill" objectFit="cover"/>
              </div>
              {isProfileOpen && (
                <div ref={profilePanelRef} className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 py-1">
                  <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"><User className="w-4 h-4 mr-2" /> Profile</a>
                  <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"><Settings className="w-4 h-4 mr-2" /> Settings</a>
                  <a href="#" className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-gray-700"><LogOut className="w-4 h-4 mr-2" /> Logout</a>
                </div>
              )}
            </div>
          </div>
        </header>
      </div>

      <main className="flex-1 flex flex-col overflow-hidden pt-0 pb-6 px-6">
         <div className="pt-2 pb-0 border-b border-gray-200 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
             <h1 className={`${montserrat.className} text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-0`}>{activeTab}</h1>
             {activeTab === 'Work orders' && (
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <div className="relative flex-grow"><input type="text" placeholder="Search..." value={searchQuery} onChange={handleSearchChange} className="w-full pl-10 pr-4 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400" /><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" /></div>
                    <div className="relative"><button ref={sortTriggerRef} onClick={toggleSortDropdown} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer" aria-haspopup="true" aria-expanded={isSortDropdownOpen}><ArrowUpDown className="w-5 h-5" /></button>{isSortDropdownOpen && ( <div ref={sortPanelRef} className="absolute top-full right-0 mt-1 w-40 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 py-1">{(["Date (Newest)", "Date (Oldest)", "Status"] as SortOption[]).map(option => ( <button key={option} onClick={() => handleSortChange(option)} className={`block w-full text-left px-3 py-1.5 text-sm ${sortOption === option ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>{option}</button> ))}</div> )}</div>
                    <div className="relative">
                         <button ref={filterTriggerRef} onClick={toggleFilterDropdown} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer relative" aria-haspopup="true" aria-expanded={isFilterDropdownOpen}>
                             <SlidersHorizontal className="w-5 h-5" />
                             {selectedStatuses.size > 0 && ( <span className="absolute -top-1 -right-1 block w-3 h-3 bg-blue-500 rounded-full text-[8px] flex items-center justify-center text-white">{selectedStatuses.size}</span> )}
                         </button>
                         {isFilterDropdownOpen && (
                             <div ref={filterPanelRef} className="absolute top-full right-0 mt-1 w-52 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 p-3">
                                <h5 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Filter by Status</h5>
                                <div className="space-y-1.5">
                                {ALL_ACTIVITY_STATUSES.map(status => (
                                    <label key={status} className="flex items-center space-x-2 cursor-pointer">
                                        <input type="checkbox" checked={selectedStatuses.has(status)} onChange={() => handleFilterChange(status)} className="form-checkbox h-4 w-4 rounded text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2"/>
                                        <span className={`text-sm ${getStatusStyles(status)} px-1.5 py-0.5 rounded-sm`}>{status}</span>
                                    </label>
                                ))}
                                </div>
                                <button onClick={clearFilters} className="mt-3 w-full text-center text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Clear All Filters</button>
                             </div>
                         )}
                    </div>
                </div>
            )}
          </div>
          <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700">
            {tabNames.map(tab => (<button key={tab} onClick={() => setActiveTab(tab)} className={`py-2 px-1 text-sm font-medium transition-colors duration-150 cursor-pointer ${activeTab === tab ? 'border-b-2 border-blue-500 text-gray-900 dark:text-white' : 'border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>{tab}</button>))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'Overview' && <OverviewDashboard theme={theme} activityLogs={activityLogs} onOpenCreateModal={openCreateModal} />}

          {activeTab === 'Rent' && <RentTabContent theme={theme} />}

          {activeTab === 'Work orders' && (
            <div className="space-y-6">
              {dateCategories.map(category => {
                const itemsInCategory = groupedProcessedActivities[category];
                return itemsInCategory && itemsInCategory.length > 0 && (
                  <section key={category}>
                    <h2 className={`${montserrat.className} text-lg font-semibold mb-3 text-gray-700 dark:text-gray-400`}>{category}</h2>
                    <div className="space-y-3">
                      {itemsInCategory.map(item => (
                        <ActivityItem key={item.id} item={item} onClick={() => openActivityModal(item)} />
                      ))}
                    </div>
                  </section>
                )
               }
              )}
              {processedActivities.length === 0 && (
                  <div className="text-center py-10"><p className="text-gray-500 dark:text-gray-400">No activities match the current criteria.</p></div>
              )}
            </div>
          )}
          {activeTab === 'Collection' && <CollectionTabContent theme={theme} />}
          {activeTab === 'Access' && 
              <AccessTabContent 
                  theme={theme} 
                  accessItems={accessItems}
                  onOpenIssueModal={openIssueAccessModal} 
              />
          }
        </div>
      </main>

      
      <ActivityModal isOpen={isActivityModalOpen} onClose={closeActivityModal} item={selectedActivityItem} />
      <CreateWorkOrderModal isOpen={isCreateModalOpen} onClose={closeCreateModal} onCreate={handleCreateWorkOrder} theme={theme} />
      <IssueAccessItemModal isOpen={isIssueAccessModalOpen} onClose={closeIssueAccessModal} onIssue={handleIssueAccessItem} theme={theme} />
    </div>
  );
};
const getRentStatusStyles = (status: RentStatus): string => {
    switch (status) {
        case 'Paid': return 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400';
        case 'Due': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400';
        case 'Overdue': return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400';
        default: return 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-300';
    }
};
interface TenantRentRowProps {
    tenant: Tenant;
    onRecordPayment: (tenantId: string) => void;
}
const TenantRentRow: React.FC<TenantRentRowProps> = ({ tenant, onRecordPayment }) => {
    const formatDate = (date: Date | null) => {
        if (!date) return 'N/A';
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    return (
        <tr className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
            
            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{tenant.name}</td>
            
            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{tenant.unitNumber}</td>
            
            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 hidden md:table-cell">{tenant.unitName}</td>
            
            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-medium">${tenant.rentAmount.toFixed(2)}</td>
            
            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 hidden lg:table-cell">{formatDate(tenant.lastPaymentDate)}</td>
            
            <td className="px-4 py-3 text-center">
                <span className={`inline-block px-2.5 py-1 rounded text-xs font-medium ${getRentStatusStyles(tenant.rentStatus)}`}>
                    {tenant.rentStatus}
                </span>
            </td>
            
            <td className="px-4 py-3 text-right">
                <button
                    onClick={() => onRecordPayment(tenant.id)}
                    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={tenant.rentStatus === 'Paid'}
                    aria-label={`Record payment for ${tenant.name}`}
                >
                    Record Payment
                </button>
                
            </td>
        </tr>
    );
};
const RentTabContent: React.FC<{ theme: Theme }> = ({ theme }) => {
    const [searchTerm, setSearchTerm] = useState('');

   
    const totalMonthlyRent = useMemo(() => tenantsData.reduce((sum, t) => sum + t.rentAmount, 0), []);
    const collectedThisMonth = useMemo(() => {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        return rentPaymentsData
            .filter(p => {
                const paymentDate = new Date(p.paymentDate);
                return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
            })
            .reduce((sum, p) => sum + p.amount, 0);
    }, []);
    const overdueRentAmount = useMemo(() => tenantsData.filter(t => t.rentStatus === 'Overdue').reduce((sum, t) => sum + t.rentAmount, 0), []);

   
    const filteredTenants = useMemo(() => {
        if (!searchTerm) return tenantsData;
        const lowerSearch = searchTerm.toLowerCase();
        return tenantsData.filter(t =>
            t.name.toLowerCase().includes(lowerSearch) ||
            t.unitNumber.toLowerCase().includes(lowerSearch) ||
            t.unitName.toLowerCase().includes(lowerSearch)
        );
    }, [searchTerm]);

    const handleRecordPayment = (tenantId: string) => {
       
        alert(`Recording payment for tenant ID: ${tenantId}`);
        console.log(`Recording payment for tenant ID: ${tenantId}`);
    };

   
    interface RentSummaryCardProps { title: string; value: string; icon: React.ElementType; colorClass: string; }
    const RentSummaryCard: React.FC<RentSummaryCardProps> = ({ title, value, icon: Icon, colorClass }) => (
        <div className="bg-white dark:bg-[#1a1a1a] p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 flex items-start space-x-3">
            <div className={`p-2 rounded-md ${colorClass} bg-opacity-10 dark:bg-opacity-20 flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${colorClass}`} />
            </div>
            <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium tracking-wider">{title}</p>
                <p className={`${montserrat.className} text-xl font-semibold text-gray-900 dark:text-white mt-1`}>{value}</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <RentSummaryCard title="Total Monthly Rent" value={`$${totalMonthlyRent.toFixed(2)}`} icon={BarChart3} colorClass="text-purple-500" />
                <RentSummaryCard title="Collected This Month" value={`$${collectedThisMonth.toFixed(2)}`} icon={CheckCircle} colorClass="text-green-500" />
                <RentSummaryCard title="Overdue Rent" value={`$${overdueRentAmount.toFixed(2)}`} icon={AlertOctagon} colorClass="text-red-500" />
            </div>

            
            <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                
                <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-y-3">
                     <h3 className={`${montserrat.className} text-lg font-semibold text-gray-800 dark:text-gray-100`}>Tenant Rent Status</h3>
                     
                     <div className="relative w-full sm:w-auto sm:max-w-xs">
                         <input
                             type="text"
                             placeholder="Search Tenants..."
                             value={searchTerm}
                             onChange={(e) => setSearchTerm(e.target.value)}
                             className="w-full pl-10 pr-4 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                         />
                         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
                     </div>
                 </div>

                
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tenant</th>
                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Unit #</th>
                                
                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Unit Name</th>
                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rent Amt</th>
                                
                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Last Payment</th>
                                <th scope="col" className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-[#1a1a1a] divide-y divide-gray-200 dark:divide-gray-800">
                            {filteredTenants.length > 0 ? (
                                filteredTenants.map(tenant => (
                                    <TenantRentRow key={tenant.id} tenant={tenant} onRecordPayment={handleRecordPayment} />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                        No tenants found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
type CollectionStatus = 'Pending Reminder' | 'Reminder Sent' | 'Payment Plan Agreed' | 'Legal Action' | 'Resolved';
interface CollectionItem {
    id: string;
    tenantId: string;
    tenantName: string;
    unitNumber: string;
    amountDue: number;
    dueDate: Date;
    status: CollectionStatus;
    lastActionDate: Date | null;
    notes?: string;
}
const collectionsData: CollectionItem[] = [
    {
        id: 'c1', tenantId: 't2', tenantName: 'Bob Williams', unitNumber: 'Cmplx 5-305', amountDue: 2200,
        dueDate: new Date('2024-03-01'), status: 'Reminder Sent', lastActionDate: new Date('2024-03-05'),
        notes: 'First reminder email sent.'
    },
    {
        id: 'c2', tenantId: 't3', tenantName: 'Charlie Brown', unitNumber: 'Tower 1-15B', amountDue: 1850,
        dueDate: new Date('2024-03-01'), status: 'Pending Reminder', lastActionDate: null
    },
    {
        id: 'c3', tenantId: 't5', tenantName: 'Ethan Miller', unitNumber: 'Bldg A-102', amountDue: 1150,
        dueDate: new Date('2024-03-01'), status: 'Pending Reminder', lastActionDate: null
    },
   
    {
        id: 'c4', tenantId: 't-prev', tenantName: 'Previous Tenant', unitNumber: 'Bldg X-999', amountDue: 50,
        dueDate: new Date('2024-02-15'), status: 'Resolved', lastActionDate: new Date('2024-02-20'),
        notes: 'Paid late fee after reminder.'
    }
];
const getCollectionStatusStyles = (status: CollectionStatus): string => {
    switch (status) {
        case 'Pending Reminder': return 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300';
        case 'Reminder Sent': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400';
        case 'Payment Plan Agreed': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400';
        case 'Legal Action': return 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400';
        case 'Resolved': return 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400';
        default: return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
};
interface CollectionRowProps {
    item: CollectionItem;
    onSendReminder: (itemId: string) => void;
    onLogAction: (itemId: string) => void;
    onResolve: (itemId: string) => void;
}
const CollectionRow: React.FC<CollectionRowProps> = ({ item, onSendReminder, onLogAction, onResolve }) => {
    const [isActionsOpen, setIsActionsOpen] = useState(false);
    const actionsTriggerRef = useRef<HTMLButtonElement>(null);
    const actionsPanelRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (actionsTriggerRef.current && !actionsTriggerRef.current.contains(event.target as Node) &&
                actionsPanelRef.current && !actionsPanelRef.current.contains(event.target as Node)) {
                setIsActionsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const formatDate = (date: Date | null) => {
        if (!date) return '-';
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };
    return (
        <tr className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{item.tenantName}</td>
            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 hidden sm:table-cell">{item.unitNumber}</td>
            <td className="px-4 py-3 text-sm text-red-600 dark:text-red-400 font-medium">${item.amountDue.toFixed(2)}</td>
            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{formatDate(item.dueDate)}</td>
            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 hidden lg:table-cell">{formatDate(item.lastActionDate)}</td>
            <td className="px-4 py-3 text-center">
                <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${getCollectionStatusStyles(item.status)}`}>
                    {item.status}
                </span>
            </td>
            
            <td className="px-4 py-3 text-right">
                 
                 <div className="hidden sm:flex sm:items-center sm:justify-end sm:space-x-1">
                    {item.status !== 'Resolved' && (
                        <>
                            <button
                                onClick={() => onSendReminder(item.id)}
                                className="px-2 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-[10px] font-medium transition-colors cursor-pointer disabled:opacity-50"
                                disabled={item.status === 'Reminder Sent' || item.status === 'Payment Plan Agreed' || item.status === 'Legal Action'}
                                aria-label={`Send reminder for ${item.tenantName}`}
                            >
                                Reminder
                            </button>
                            <button
                                onClick={() => onLogAction(item.id)}
                                className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-[10px] font-medium transition-colors cursor-pointer"
                                aria-label={`Log action for ${item.tenantName}`}
                            >
                                Log Action
                            </button>
                            <button
                                onClick={() => onResolve(item.id)}
                                className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-[10px] font-medium transition-colors cursor-pointer"
                                aria-label={`Mark as resolved for ${item.tenantName}`}
                            >
                                Resolve
                            </button>
                        </>
                    )}
                    {item.status === 'Resolved' && (
                        <span className="text-xs text-gray-500 italic">Resolved</span>
                    )}
                </div>

                
                <div className="relative sm:hidden">
                    <button 
                        ref={actionsTriggerRef}
                        onClick={() => setIsActionsOpen(!isActionsOpen)}
                        className="p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 dark:focus:ring-offset-gray-800 cursor-pointer"
                        aria-haspopup="true"
                        aria-expanded={isActionsOpen}
                    >
                        <MoreVertical className="h-5 w-5" />
                    </button>

                    
                    {isActionsOpen && (
                        <div 
                            ref={actionsPanelRef}
                            className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10 py-1"
                        >
                            {item.status !== 'Resolved' ? (
                                <>
                                     <button
                                        onClick={() => { onSendReminder(item.id); setIsActionsOpen(false); }}
                                        className="block w-full text-left px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 cursor-pointer"
                                        disabled={item.status === 'Reminder Sent' || item.status === 'Payment Plan Agreed' || item.status === 'Legal Action'}
                                    >
                                        Send Reminder
                                    </button>
                                    <button
                                        onClick={() => { onLogAction(item.id); setIsActionsOpen(false); }}
                                        className="block w-full text-left px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                    >
                                        Log Action
                                    </button>
                                     <button
                                        onClick={() => { onResolve(item.id); setIsActionsOpen(false); }}
                                        className="block w-full text-left px-3 py-1.5 text-sm text-green-600 dark:text-green-500 hover:bg-green-50 dark:hover:bg-gray-700 cursor-pointer"
                                    >
                                        Mark Resolved
                                    </button>
                                </> 
                            ) : (
                                <span className="block px-3 py-1.5 text-sm text-gray-500 italic">Resolved</span>
                            )}
                        </div>
                    )}
                </div>
            </td>
        </tr>
    );
};


const CollectionTabContent: React.FC<{ theme: Theme }> = ({ theme }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const activeCollections = useMemo(() => collectionsData.filter(c => c.status !== 'Resolved'), []);
    const totalOverdueAmount = useMemo(() => activeCollections.reduce((sum, c) => sum + c.amountDue, 0), [activeCollections]);
    const numberOfAccounts = activeCollections.length;
    const filteredCollections = useMemo(() => {
        if (!searchTerm) return activeCollections;
        const lowerSearch = searchTerm.toLowerCase();
        return activeCollections.filter(c =>
            c.tenantName.toLowerCase().includes(lowerSearch) ||
            c.unitNumber.toLowerCase().includes(lowerSearch) ||
            c.status.toLowerCase().includes(lowerSearch)
        );
    }, [searchTerm, activeCollections]);
    const handleSendReminder = (itemId: string) => {
        alert(`Sending reminder for item ID: ${itemId}`);
        console.log(`Sending reminder for item ID: ${itemId}`);
       
    };
    const handleLogAction = (itemId: string) => {
        alert(`Logging action for item ID: ${itemId} (e.g., open notes modal)`);
        console.log(`Logging action for item ID: ${itemId}`);
       
    };
    const handleResolve = (itemId: string) => {
        if (window.confirm('Are you sure you want to mark this item as resolved?')) {
             alert(`Marking item ID: ${itemId} as resolved`);
             console.log(`Marking item ID: ${itemId} as resolved`);
           
        }
    };
    interface CollectionSummaryCardProps { title: string; value: string | number; icon: React.ElementType; colorClass: string; }
    const CollectionSummaryCard: React.FC<CollectionSummaryCardProps> = ({ title, value, icon: Icon, colorClass }) => (
        <div className="bg-white dark:bg-[#1a1a1a] p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 flex items-start space-x-3">
            <div className={`p-2 rounded-md ${colorClass} bg-opacity-10 dark:bg-opacity-20 flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${colorClass}`} />
            </div>
            <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium tracking-wider">{title}</p>
                <p className={`${montserrat.className} text-xl font-semibold text-gray-900 dark:text-white mt-1`}>{value}</p>
            </div>
        </div>
    );
    return (
        <div className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CollectionSummaryCard title="Total Amount Overdue" value={`$${totalOverdueAmount.toFixed(2)}`} icon={AlertOctagon} colorClass="text-red-500" />
                <CollectionSummaryCard title="Accounts in Collection" value={numberOfAccounts} icon={Users} colorClass="text-yellow-500" />
                
                 <CollectionSummaryCard title="Resolved This Month" value={collectionsData.filter(c => c.status === 'Resolved' && new Date(c.lastActionDate!).getMonth() === new Date().getMonth()).length} icon={CheckCircle} colorClass="text-green-500" />
            </div>

            
            <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                 
                 <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-y-3">
                     <h3 className={`${montserrat.className} text-lg font-semibold text-gray-800 dark:text-gray-100`}>Collection Accounts</h3>
                     
                     <div className="relative w-full sm:w-auto sm:max-w-xs">
                         <input
                             type="text"
                             placeholder="Search Collections..."
                             value={searchTerm}
                             onChange={(e) => setSearchTerm(e.target.value)}
                             className="w-full pl-10 pr-4 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                         />
                         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
                     </div>
                 </div>

                
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tenant</th>
                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">Unit #</th>
                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount Due</th>
                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Due Date</th>
                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Last Action</th>
                                <th scope="col" className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-[#1a1a1a] divide-y divide-gray-200 dark:divide-gray-800">
                            {filteredCollections.length > 0 ? (
                                filteredCollections.map(item => (
                                    <CollectionRow
                                        key={item.id}
                                        item={item}
                                        onSendReminder={handleSendReminder}
                                        onLogAction={handleLogAction}
                                        onResolve={handleResolve}
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                        No collection items found{searchTerm ? ' matching your search' : ''}.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
type AccessItemType = 'Key' | 'Fob' | 'Code';
type AccessItemStatus = 'Active' | 'Lost' | 'Inactive' | 'Unassigned';
interface AccessItem {
    id: string;
    identifier: string;
    type: AccessItemType;
    assignedUnit: string | null;
    assignedPerson: string | null;
    status: AccessItemStatus;
    lastIssued: Date | null;
}
interface IssueAccessItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onIssue: (newItemData: Omit<AccessItem, 'id' | 'status' | 'lastIssued'> & { status: 'Active' }) => void;
    theme: Theme;
}
const ACCESS_ITEM_TYPES: AccessItemType[] = ['Key', 'Fob', 'Code'];
const IssueAccessItemModal: React.FC<IssueAccessItemModalProps> = ({ isOpen, onClose, onIssue, theme }) => {
    const [identifier, setIdentifier] = useState('');
    const [type, setType] = useState<AccessItemType>('Key');
    const [assignedUnit, setAssignedUnit] = useState('');
    const [assignedPerson, setAssignedPerson] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!identifier || !type) return;

        onIssue({
            identifier,
            type,
            assignedUnit: assignedUnit || null,
            assignedPerson: assignedPerson || null,
            status: 'Active'
        });
       
        setIdentifier('');
        setType('Key');
        setAssignedUnit('');
        setAssignedPerson('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div
                className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-300 dark:border-gray-700"
                onClick={e => e.stopPropagation()}
            >
                
                <div className="flex justify-between items-center p-4 border-b border-gray-300 dark:border-gray-700">
                    <h3 className={`${montserrat.className} text-lg font-semibold text-gray-900 dark:text-white`}>Issue New Access Item</h3>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <FormInput
                        label="Identifier (e.g., Key#, Fob ID)"
                        id="identifier"
                        icon={KeyRound}
                        value={identifier}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIdentifier(e.target.value)}
                        required
                    />
                    <FormSelect
                        label="Item Type"
                        id="itemType"
                        value={type}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setType(e.target.value as AccessItemType)}
                        required
                    >
                        {ACCESS_ITEM_TYPES.map(t => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </FormSelect>
                    <FormInput
                        label="Assigned Unit (Optional)"
                        id="assignedUnit"
                        icon={Building}
                        value={assignedUnit}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAssignedUnit(e.target.value)}
                    />
                    <FormInput
                        label="Assigned Person (Optional)"
                        id="assignedPerson"
                        icon={User}
                        value={assignedPerson}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAssignedPerson(e.target.value)}
                    />

                    <div className="flex justify-end pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-lg text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 mr-2 cursor-pointer">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm rounded-lg bg-blue-500 hover:bg-blue-600 text-white cursor-pointer">Issue Item</button>
                    </div>
                </form>
            </div>
        </div>
    );
};




const getAccessStatusStyles = (status: AccessItemStatus): string => {
    switch (status) {
        case 'Active': return 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400';
        case 'Lost': return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400';
        case 'Inactive': return 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300';
        case 'Unassigned': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
};
interface AccessItemRowProps {
    item: AccessItem;
    onMarkLost: (itemId: string) => void;
    onDeactivate: (itemId: string) => void;
    onReassign: (itemId: string) => void;
}

const AccessItemRow: React.FC<AccessItemRowProps> = ({ item, onMarkLost, onDeactivate, onReassign }) => {
    const [isActionsOpen, setIsActionsOpen] = useState(false);
    const actionsTriggerRef = useRef<HTMLButtonElement>(null);
    const actionsPanelRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (actionsTriggerRef.current && !actionsTriggerRef.current.contains(event.target as Node) &&
                actionsPanelRef.current && !actionsPanelRef.current.contains(event.target as Node)) {
                setIsActionsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <tr className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
            <td className="px-4 py-3 text-sm font-mono text-gray-700 dark:text-gray-300">{item.identifier}</td>
            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{item.type}</td>
            <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{item.assignedUnit || '-'}</td>
            <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200 hidden md:table-cell">{item.assignedPerson || '-'}</td>
            <td className="px-4 py-3 text-center">
                <span className={`inline-block px-2.5 py-1 rounded text-xs font-medium ${getAccessStatusStyles(item.status)}`}>
                    {item.status}
                </span>
            </td>
            
            <td className="px-4 py-3 text-right">
                
                <div className="hidden sm:flex sm:items-center sm:justify-end sm:space-x-1">
                    {item.status !== 'Lost' && item.status !== 'Inactive' && (
                        <button
                            onClick={() => onMarkLost(item.id)}
                            className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-[10px] font-medium transition-colors cursor-pointer"
                            aria-label={`Mark ${item.identifier} as lost`}
                        >
                            Lost
                        </button>
                    )}
                    {item.status === 'Active' && (
                        <button
                            onClick={() => onDeactivate(item.id)}
                            className="px-2 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded text-[10px] font-medium transition-colors cursor-pointer"
                            aria-label={`Deactivate ${item.identifier}`}
                        >
                            Deactivate
                        </button>
                    )}
                     <button
                         onClick={() => onReassign(item.id)}
                         className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-[10px] font-medium transition-colors cursor-pointer"
                         aria-label={`Reassign ${item.identifier}`}
                     >
                         {item.status === 'Unassigned' ? 'Assign' : 'Reassign'}
                     </button>
                </div>

                
                 <div className="relative sm:hidden">
                    <button 
                        ref={actionsTriggerRef}
                        onClick={() => setIsActionsOpen(!isActionsOpen)}
                        className="p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 dark:focus:ring-offset-gray-800 cursor-pointer"
                        aria-haspopup="true"
                        aria-expanded={isActionsOpen}
                    >
                        <MoreVertical className="h-5 w-5" />
                    </button>

                    
                    {isActionsOpen && (
                        <div 
                            ref={actionsPanelRef}
                            className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10 py-1"
                        >
                           {item.status !== 'Lost' && item.status !== 'Inactive' && (
                                <button
                                    onClick={() => { onMarkLost(item.id); setIsActionsOpen(false); }}
                                    className="block w-full text-left px-3 py-1.5 text-sm text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-gray-700 cursor-pointer"
                                >
                                    Mark Lost
                                </button>
                            )}
                            {item.status === 'Active' && (
                                <button
                                    onClick={() => { onDeactivate(item.id); setIsActionsOpen(false); }}
                                    className="block w-full text-left px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                >
                                    Deactivate
                                </button>
                            )}
                             <button
                                 onClick={() => { onReassign(item.id); setIsActionsOpen(false); }}
                                 className="block w-full text-left px-3 py-1.5 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer"
                             >
                                 {item.status === 'Unassigned' ? 'Assign' : 'Reassign'}
                             </button>
                        </div>
                    )}
                 </div>
            </td>
        </tr>
    );
};


const AccessTabContent: React.FC<{ 
    theme: Theme; 
    accessItems: AccessItem[]; 
    onOpenIssueModal: () => void; 
}> = ({ theme, accessItems, onOpenIssueModal }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const activeItems = useMemo(() => accessItems.filter(i => i.status === 'Active'), [accessItems]);
    const needsAttentionItems = useMemo(() => accessItems.filter(i => i.status === 'Lost' || i.status === 'Inactive'), [accessItems]);
    const unassignedItems = useMemo(() => accessItems.filter(i => i.status === 'Unassigned'), [accessItems]);   
    const filteredItems = useMemo(() => {
        if (!searchTerm) return accessItems;
        const lowerSearch = searchTerm.toLowerCase();
        return accessItems.filter(i =>
            i.identifier.toLowerCase().includes(lowerSearch) ||
            i.type.toLowerCase().includes(lowerSearch) ||
            (i.assignedUnit && i.assignedUnit.toLowerCase().includes(lowerSearch)) ||
            (i.assignedPerson && i.assignedPerson.toLowerCase().includes(lowerSearch)) ||
            i.status.toLowerCase().includes(lowerSearch)
        );
    }, [searchTerm, accessItems]);   
    const handleMarkLost = (itemId: string) => {
        alert(`Marking item ID: ${itemId} as Lost`);
        console.log(`Marking item ID: ${itemId} as Lost`);
       
    };
    const handleDeactivate = (itemId: string) => {
        alert(`Deactivating item ID: ${itemId}`);
        console.log(`Deactivating item ID: ${itemId}`);
       
    };
    const handleReassign = (itemId: string) => {
        alert(`Reassigning item ID: ${itemId} (Open Modal)`);
        console.log(`Reassigning item ID: ${itemId}`);
       
    };
    interface AccessSummaryCardProps { title: string; value: number; icon: React.ElementType; colorClass: string; }
    const AccessSummaryCard: React.FC<AccessSummaryCardProps> = ({ title, value, icon: Icon, colorClass }) => (
        <div className="bg-white dark:bg-[#1a1a1a] p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 flex items-start space-x-3">
            <div className={`p-2 rounded-md ${colorClass} bg-opacity-10 dark:bg-opacity-20 flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${colorClass}`} />
            </div>
            <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium tracking-wider">{title}</p>
                <p className={`${montserrat.className} text-xl font-semibold text-gray-900 dark:text-white mt-1`}>{value}</p>
            </div>
        </div>
    );
    return (
        <div className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <AccessSummaryCard title="Total Items" value={accessItems.length} icon={KeyRound} colorClass="text-gray-500" />
                <AccessSummaryCard title="Active" value={activeItems.length} icon={CheckCircle} colorClass="text-green-500" />
                <AccessSummaryCard title="Lost/Inactive" value={needsAttentionItems.length} icon={AlertOctagon} colorClass="text-red-500" />
                <AccessSummaryCard title="Unassigned" value={unassignedItems.length} icon={CircleHelp} colorClass="text-blue-500" /> 
            </div>

            
            <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                
                <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-y-3">
                    <h3 className={`${montserrat.className} text-lg font-semibold text-gray-800 dark:text-gray-100`}>Access Items</h3>
                    
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                        
                        <div className="relative w-full sm:w-64">
                            <input
                                type="text"
                                placeholder="Search Items..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </div>
                        <button
                            onClick={onOpenIssueModal}
                            className="flex-shrink-0 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium cursor-pointer transition-colors flex items-center space-x-2"
                        >
                           <PlusCircle className="w-4 h-4" />
                            <span>Issue Item</span>
                        </button>
                    </div>
                </div>

                
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Identifier</th>
                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Assigned Unit</th>
                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Assigned To</th>
                                <th scope="col" className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-[#1a1a1a] divide-y divide-gray-200 dark:divide-gray-800">
                            {filteredItems.length > 0 ? (
                                filteredItems.map(item => (
                                    <AccessItemRow
                                        key={item.id}
                                        item={item}
                                        onMarkLost={handleMarkLost}
                                        onDeactivate={handleDeactivate}
                                        onReassign={handleReassign}
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                        No access items found{searchTerm ? ' matching your search' : ''}.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};


const formatDateTime = (date: Date): { timestamp: string; dateCategory: ActivityLog['dateCategory'] } => {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const isToday = date.toDateString() === now.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const timeString = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  let dateCategory: ActivityLog['dateCategory'];
  if (isToday) dateCategory = 'Today';
  else if (isYesterday) dateCategory = 'Yesterday';
  else dateCategory = 'Earlier';

  return { timestamp: `${timeString}`, dateCategory };
};


const getStatusStyles = (status: ActivityStatus): string => {
  switch (status) {
    case 'URGENT': return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400';
    case 'NEW': return 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400';
    case 'COMPLETED': return 'bg-gray-200 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400';
    case 'PROCESSED': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400';
    default: return 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-300';
  }
};


const getIndicatorFromStatus = (status: ActivityStatus): ActivityLog['statusIndicator'] => {
    switch (status) {
        case 'URGENT': return 'red';
        case 'NEW': return 'blue';
        case 'PROCESSED': return 'purple';
        case 'COMPLETED': return 'green';
        default: return 'gray';
    }
};

export default PropertyManagementDashboard;
