"use client";

import React from 'react';
import {
  LayoutDashboard, Briefcase, Users, Palette, Presentation, Code2, Tags, HelpCircle, Settings,
  Search, CalendarDays, Plus
} from 'lucide-react';
import { Montserrat, Roboto } from 'next/font/google';

// Instantiate next/font with Montserrat and Roboto
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: '700', // Typically headings are bolder
  display: 'swap',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'], // Body can have regular and bold
  display: 'swap',
});

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  href?: string;
}

const NavListItem: React.FC<NavItemProps> = ({ icon: Icon, label, isActive = false, href = "#" }) => {
  const commonClasses = "flex items-center space-x-3 p-3 rounded-full text-sm cursor-pointer transition-colors duration-150";
  const activeClasses = isActive
    ? `bg-blue-100 text-blue-700 dark:bg-[#091427] dark:text-white font-semibold`
    : `text-gray-600 hover:bg-gray-100 dark:text-[#7f8180] dark:hover:bg-gray-700/50 font-medium`;

  return (
    <li>
      <a
        href={href}
        className={`${commonClasses} ${activeClasses}`}
      >
        <Icon className="w-5 h-5" />
        <span>{label}</span>
      </a>
    </li>
  );
};

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
}

interface StatCardProps {
  title: string;
  description: string;
  className?: string;
}

const TeamDashboardPage = () => {
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", isActive: true },
    { icon: Briefcase, label: "My Task" },
    { icon: Users, label: "My Team" },
  ];

  const categoryNavItems = [
    { icon: Palette, label: "Design" },
    { icon: Presentation, label: "Marketing" },
    { icon: Code2, label: "Development" },
    { icon: Tags, label: "Sales" },
  ];

  const utilityNavItems = [
    { icon: HelpCircle, label: "Help" },
    { icon: Settings, label: "Setting" },
  ];

  const InfoCard: React.FC<InfoCardProps> = ({ title, children, className = "", titleClassName = "" }) => (
    <div className={`bg-white dark:bg-[#0D1A2F] p-6 rounded-xl ${className}`}>
      <h2 className={`text-xl font-semibold mb-4 text-gray-800 dark:text-white ${montserrat.className} ${titleClassName}`}> 
        {title}
      </h2>
      {children}
    </div>
  );
  
  const StatCard: React.FC<StatCardProps> = ({ title, description, className}) => (
    <div className={`bg-white dark:bg-white p-4 rounded-xl text-gray-800 dark:text-[#081225] ${className}`}>
        <h3 className={`text-lg font-semibold text-gray-800 dark:text-[#081225] ${montserrat.className}`}>{title}</h3>
        <p className={`text-sm text-gray-500 dark:text-[#838892]`}>{description}</p>
    </div>
  );

  return (
    <div className={`min-h-screen bg-gray-100 dark:bg-[#F5F6FA] ${roboto.className}`}>
      <aside className="w-72 bg-white dark:bg-white p-6 flex flex-col justify-between 
                        border-r border-gray-200 dark:border-gray-300/20 
                        hidden md:flex fixed top-0 left-0 z-40 h-screen">
        <div className="flex-grow">
          <div className={`text-3xl font-bold mb-12 text-blue-600 dark:text-[#081225] ${montserrat.className}`}>
            UXETO
          </div>
          <nav className="space-y-6">
            <ul className="space-y-2">
              {navItems.map((item) => <NavListItem key={item.label} {...item} />)}
            </ul>
            <ul className="space-y-2">
              {categoryNavItems.map((item) => <NavListItem key={item.label} {...item} />)}
            </ul>
          </nav>
        </div>
        <nav className="pt-6">
          <ul className="space-y-2">
            {utilityNavItems.map((item) => <NavListItem key={item.label} {...item} />)}
          </ul>
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-8 bg-gray-50 dark:bg-[#F5F6FA] overflow-y-auto md:ml-72">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 md:gap-0">
          <div>
            <h1 className={`text-3xl md:text-4xl font-bold text-gray-800 dark:text-[#081225] ${montserrat.className}`}>
              Team activity
            </h1>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="search"
                placeholder="Search"
                className={`w-full pl-10 pr-3 py-2 md:py-2.5 rounded-lg border text-sm md:text-base
                            bg-white dark:bg-white 
                            border-gray-300 dark:border-gray-300 
                            text-gray-700 dark:text-gray-700
                            placeholder-gray-400 dark:placeholder-gray-400
                            focus:ring-2 focus:ring-blue-500 dark:focus:ring-[#75C6B1] 
                            focus:border-transparent dark:focus:border-transparent`}
              />
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500 dark:text-[#838892]">
              <CalendarDays className="w-5 h-5" />
              <span>23 Mar</span>
            </div>
            <button className={`bg-blue-600 dark:bg-[#081225] 
                                 text-white dark:text-white 
                                 px-3 md:px-5 py-2 md:py-2.5 rounded-lg font-semibold text-sm md:text-base
                                 hover:bg-blue-700 dark:hover:bg-opacity-90
                                 cursor-pointer flex items-center space-x-1 md:space-x-2 transition-colors`}>
              <Plus className="w-4 h-4 md:w-5 md:h-5" />
              <span>Add Team</span>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <InfoCard 
              title="Tasks Completed" 
              className="bg-white dark:bg-[#0D1A2F]" 
              titleClassName="dark:text-white"
            >
              <p className={`text-sm text-gray-600 dark:text-gray-300`}>Chart for Tasks Completed will go here...</p>
              <div className="mt-4 h-64 bg-gray-100 dark:bg-[#1F2B4D] rounded-md flex items-center justify-center text-gray-500 dark:text-gray-400">Chart Area</div>
            </InfoCard>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                 <StatCard title="4 Projects" description="43% in progress" />
                 <StatCard title="8 Projects" description="100% completed" />
                 <StatCard title="4 Projects" description="0% under review" />
            </div>

            <InfoCard title="Most Tracked" className="dark:bg-white" titleClassName={`dark:text-[#081225]`}>
              <p className={`text-sm text-gray-600 dark:text-[#838892]`}>List of most tracked items will go here...</p>
              <div className="mt-4 h-40 bg-gray-100 dark:bg-gray-200 rounded-md flex items-center justify-center text-gray-500 dark:text-gray-400">List Area</div>
            </InfoCard>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <InfoCard title="Working hours" className="dark:bg-white" titleClassName={`dark:text-[#081225]`}>
              <p className={`text-sm text-gray-600 dark:text-[#838892]`}>Chart for working hours will go here...</p>
              <div className="mt-4 h-48 bg-gray-100 dark:bg-gray-200 rounded-md flex items-center justify-center text-gray-500 dark:text-gray-400">Chart Area</div>
            </InfoCard>
            <InfoCard title="Team Insights" className="dark:bg-white" titleClassName={`dark:text-[#081225]`}>
              <p className={`text-sm text-gray-600 dark:text-[#838892]`}>Team insights details will go here...</p>
              <div className="mt-4 h-60 bg-gray-100 dark:bg-gray-200 rounded-md flex items-center justify-center text-gray-500 dark:text-gray-400">Insights Area</div>
            </InfoCard>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeamDashboardPage;
