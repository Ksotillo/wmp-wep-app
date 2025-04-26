'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FiSearch, FiShoppingCart, FiBell, FiUser, FiBookOpen, FiCheckCircle, FiAward, FiClock, FiBookmark, FiSettings, FiLogOut, FiInfo, FiCalendar, FiTrash2, FiX, FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiChevronLeft, FiBarChart2, FiTag, FiStar } from 'react-icons/fi';
import { Montserrat, Roboto } from 'next/font/google';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';


const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
});

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});



type Stat = {
  id: number;
  title: string;
  value: string | number;
  icon: React.ElementType;
  iconBgColor: string;
};

type CourseTopicData = {
  name: string;
  value: number;
  color: string;
};


type Review = {
  id: number;
  reviewerName: string;
  rating: number; 
  comment: string;
  date: string;
};

type Instructor = {
    name: string;
    title: string;
    imageUrl: string;
};


type Course = {
  id: number;
  title: string;
  instructor: Instructor;
  rating: number;
  reviewCount: number;
  reviews: Review[];
  price: number;
  imageUrl: string;
  category: string;
  lessons: number;
  hours: number;
  level: 'Beginner' | 'Intermediate' | 'Expert';
  description?: string;
};

type ContinueLearningCourse = {
  id: number;
  title: string;
  category: string;
  lessonsProgress: string;
  percentage: number;
  imageUrl: string;
};

type MyCourse = {
  id: number;
  title: string;
  category: string;
  lessonsCompleted: number;
  lessonsTotal: number;
  status: 'Complete' | 'Ongoing';
  level: 'Beginner' | 'Intermediate' | 'Expert';
  imageUrl: string;
};



const statsData: Stat[] = [
  { id: 1, title: 'Ongoing', value: 5, icon: FiBookOpen, iconBgColor: 'bg-blue-100 text-blue-600' },
  { id: 2, title: 'Complete', value: 37, icon: FiCheckCircle, iconBgColor: 'bg-green-100 text-green-600' },
  { id: 3, title: 'Certificate', value: 25, icon: FiAward, iconBgColor: 'bg-orange-100 text-orange-600' },
  { id: 4, title: 'Hour Spent', value: 705, icon: FiClock, iconBgColor: 'bg-purple-100 text-purple-600' },
];

const courseTopicData: CourseTopicData[] = [
  { name: 'Design', value: 40, color: '#674fff' },
  { name: 'Code', value: 30, color: '#a896ff' },
  { name: 'Business', value: 20, color: '#d2caff' },
  { name: 'Data', value: 10, color: '#e0dafc' },
];


const sampleReviewsCourse1: Review[] = [
  { id: 1, reviewerName: 'Michael B.', rating: 5, comment: 'Amazing course! Learned so much about Blender in a short time. Highly recommended.', date: '2024-07-20' },
  { id: 2, reviewerName: 'Sarah K.', rating: 4, comment: 'Good content, well-explained. Some parts felt a bit rushed.', date: '2024-07-15' },
  { id: 3, reviewerName: 'David L.', rating: 5, comment: 'Instructor is fantastic. Clear, concise, and engaging.', date: '2024-07-10' },
];

const sampleReviewsCourse2: Review[] = [
  { id: 4, reviewerName: 'Emily R.', rating: 5, comment: 'Covered all the essential digital marketing topics. Great for beginners!', date: '2024-07-22' },
  { id: 5, reviewerName: 'James P.', rating: 4, comment: 'Solid course, very practical examples.', date: '2024-07-18' },
];

const sampleReviewsCourse3: Review[] = [
    { id: 6, reviewerName: 'Chris T.', rating: 5, comment: 'Tailwind is awesome, and this course made it easy to learn.', date: '2024-07-25' },
    { id: 7, reviewerName: 'Jessica M.', rating: 4, comment: 'Well-structured course. Would love more advanced topics.', date: '2024-07-19' },
];


const courses: Course[] = [
  {
    id: 1, title: 'Create 3D With Blender',
    instructor: { name: 'Jane Doe', title: '3D Artist & Animator', imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dXNlciUyMHdvbWFufGVufDB8fDB8fHww&auto=format&fit=crop&w=50&q=80' },
    rating: 4.5,
    reviewCount: sampleReviewsCourse1.length,
    reviews: sampleReviewsCourse1,
    price: 400, imageUrl: 'https://images.unsplash.com/photo-1611926653458-09294b3142bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    category: 'DESIGN', lessons: 16, hours: 48, level: 'Beginner',
    description: 'Learn the fundamentals of 3D modeling, texturing, and rendering with Blender. Create stunning visuals from scratch.'
  },
  {
    id: 2, title: 'Digital Marketing Fundamentals',
    instructor: { name: 'John Smith', title: 'Marketing Strategist', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlciUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=50&q=80' },
    rating: 4.8,
    reviewCount: sampleReviewsCourse2.length,
    reviews: sampleReviewsCourse2,
    price: 100, imageUrl: 'https://images.unsplash.com/photo-1557862921-37829c790f19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    category: 'BUSINESS', lessons: 30, hours: 48, level: 'Intermediate',
    description: 'Master the core concepts of digital marketing, including SEO, social media, email marketing, and content strategy.'
  },
  {
    id: 3, title: 'Slicing UI Design With Tailwind',
    instructor: { name: 'Alice Green', title: 'Frontend Developer', imageUrl: 'https://images.unsplash.com/photo-1529688047360-8c8458510605?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dXNlciUyMHdvbWFuJTIwcHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=50&q=80' },
    rating: 4.7,
    reviewCount: sampleReviewsCourse3.length,
    reviews: sampleReviewsCourse3,
    price: 100, imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80', category: 'CODE', lessons: 30, hours: 48, level: 'Intermediate',
    description: 'Learn how to build modern user interfaces rapidly with Tailwind CSS, covering utilities, components, and responsive design.'
  },
  {
    id: 4, title: 'Python for Data Science',
    instructor: { name: 'Robert Johnson', title: 'Data Scientist', imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dXNlciUyMG1hbiUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=50&q=80' },
    rating: 4.9,
    reviewCount: 125,
    reviews: [],
    price: 150, imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80', category: 'DATA', lessons: 45, hours: 72, level: 'Expert',
    description: 'Dive into data analysis and machine learning using Python with libraries like Pandas, NumPy, and Scikit-learn.'
  },
  {
    id: 5, title: 'Introduction to Cyber Security',
    instructor: { name: 'Maria Garcia', title: 'Security Analyst', imageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8dXNlciUyMHdvbWFuJTIwcHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=50&q=80' },
    rating: 4.6,
    reviewCount: 88,
    reviews: [],
    price: 120, imageUrl: 'https://images.unsplash.com/photo-1544890225-2f3faec4cd60?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80', category: 'CODE', lessons: 25, hours: 40, level: 'Intermediate',
    description: 'Understand the basics of cybersecurity threats, defenses, and best practices to protect digital assets.'
  },
  {
    id: 6, title: 'Mobile App Design (Figma)',
    instructor: { name: 'David Brown', title: 'UI/UX Designer', imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHVzZXIlMjBtYW4lMjBwcm9maWxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=50&q=80' },
    rating: 4.7,
    reviewCount: 65,
    reviews: [],
    price: 90, imageUrl: 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80', category: 'DESIGN', lessons: 20, hours: 35, level: 'Beginner',
    description: 'Design beautiful and intuitive mobile app interfaces using Figma, covering wireframing, prototyping, and design systems.'
  },
];

const continueLearningData: ContinueLearningCourse[] = [
  {
    id: 1,
    title: "UI/UX Design",
    category: "DESIGN",
    lessonsProgress: "12/16 Lessons",
    percentage: 75,
    imageUrl: "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80", 
  },
  {
    id: 2,
    title: "Cyber Security",
    category: "CODE",
    lessonsProgress: "20/30 Lessons",
    percentage: 60,
    imageUrl: "https://images.unsplash.com/photo-1544890225-2f3faec4cd60?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80", 
  },
  {
    id: 3,
    title: "Learn Data Analyst",
    category: "DATA",
    lessonsProgress: "8/20 Lessons",
    percentage: 40,
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80", 
  },
];

const myCoursesData: MyCourse[] = [
  {
    id: 1,
    title: "Mastering Design System",
    category: "Design",
    lessonsCompleted: 15,
    lessonsTotal: 15,
    status: "Complete",
    level: "Intermediate",
    imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80", 
  },
  {
    id: 2,
    title: "UI/UX Design",
    category: "Design",
    lessonsCompleted: 12,
    lessonsTotal: 15,
    status: "Ongoing",
    level: "Beginner",
    imageUrl: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80", 
  },
  {
    id: 3,
    title: "Learn Data Analyst",
    category: "Data",
    lessonsCompleted: 8,
    lessonsTotal: 20,
    status: "Ongoing",
    level: "Expert",
    imageUrl: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80", 
  },
];

const initialCartItems = [
  { id: 1, title: 'Create 3D With Blender', price: 400, imageUrl: 'https://images.unsplash.com/photo-1611926653458-09294b3142bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=50&q=80' },
  { id: 3, title: 'Slicing UI Design With Tailwind', price: 100, imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=50&q=80' },
];




const StatCard: React.FC<{ stat: Stat }> = ({ stat }) => {
  return (
    <div className="bg-white p-4 md:p-6 rounded-lg flex items-center space-x-4 border border-gray-100">
      <div className={`p-3 rounded-lg ${stat.iconBgColor}`}>
        <stat.icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
        <p className={`text-2xl md:text-3xl font-bold ${montserrat.className}`}>{stat.value}</p>
      </div>
    </div>
  );
};


const CourseCard: React.FC<{
    course: Course;
    isBookmarked: boolean;
    onToggleBookmark: (id: number) => void;
    onViewCourse: (id: number) => void;
}> = ({ course, isBookmarked, onToggleBookmark, onViewCourse }) => {
    const handleCardClick = () => {
        onViewCourse(course.id);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
       if (event.key === 'Enter' || event.key === ' ') {
         handleCardClick();
       }
     };

     const handleBookmarkClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        onToggleBookmark(course.id);
     }

    const StarRating: React.FC<{ rating: number, reviewCount: number }> = ({ rating, reviewCount }) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return (
            <div className="flex items-center text-yellow-400">
                {[...Array(fullStars)].map((_, i) => <FiStar key={`full-${i}`} className="w-3 h-3 fill-current" />)}
                {hasHalfStar && (
                    <div key="half" className="relative w-3 h-3">
                        <FiStar className="absolute top-0 left-0 w-3 h-3 text-gray-300" />
                        <FiStar className="absolute top-0 left-0 w-3 h-3 fill-current" style={{ clipPath: 'inset(0 50% 0 0)' }} />
                    </div>
                )}
                {[...Array(emptyStars)].map((_, i) => <FiStar key={`empty-${i}`} className="w-3 h-3 text-gray-300" />)}
                <span className="ml-1.5 text-xs text-gray-500">({reviewCount})</span>
            </div>
        );
    };

    return (
      <div
        className="bg-white rounded-lg border border-gray-100 overflow-hidden transition-transform duration-300 hover:scale-[1.02] cursor-pointer group relative flex flex-col"
        role="link"
        aria-label={`View details for ${course.title}`}
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
      >
        <div className="relative">
          <img src={course.imageUrl} alt={`Promotional image for ${course.title}`} className="w-full h-40 object-cover" />
          <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm text-[#674fff] font-semibold px-3 py-1 rounded-full text-xs ${montserrat.className}">
              ${course.price.toFixed(0)}
          </div>
          <button
              onClick={handleBookmarkClick}
              className={`absolute top-2 left-2 bg-white/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer ${isBookmarked ? 'text-[#674fff]' : 'text-gray-600'}`}
              aria-label={isBookmarked ? "Remove bookmark" : "Bookmark course"}
              title={isBookmarked ? "Remove bookmark" : "Bookmark course"}
          >
              <FiBookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="p-4 flex flex-col flex-grow">
            <p className="text-xs font-medium text-[#674fff] uppercase mb-1">{course.category}</p>
            <h3 className={`text-base font-semibold text-gray-800 mb-2 flex-grow ${montserrat.className}`}>{course.title}</h3>
            <div className="mb-2">
                <StarRating rating={course.rating} reviewCount={course.reviewCount} />
            </div>
            <p className="text-xs text-gray-500 mb-2">{course.lessons} Lessons • {course.hours} Hours</p>
        </div>
      </div>
    );
};


const ContinueLearningCard: React.FC<{ course: ContinueLearningCourse }> = ({ course }) => {
  const progressStyle = {
    background: `conic-gradient(#674fff ${course.percentage * 3.6}deg, #e0dafc ${course.percentage * 3.6}deg)`,
  };

  return (
    <div className="bg-white p-3 rounded-lg border border-gray-100 flex items-center space-x-3 transition-colors hover:bg-gray-50 cursor-pointer">
      <img
        src={course.imageUrl}
        alt={`${course.title} thumbnail`}
        className="w-12 h-12 rounded-md object-cover flex-shrink-0"
      />
      <div className="flex-grow overflow-hidden">
        <p className="text-xs font-medium text-gray-400 uppercase truncate">{course.category}</p>
        <h4 className={`text-sm font-semibold text-gray-800 truncate ${montserrat.className}`}>
          {course.title}
        </h4>
        <p className="text-xs text-gray-500 truncate">{course.lessonsProgress}</p>
      </div>
      <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center relative" style={progressStyle}>
        <div className="absolute w-10 h-10 rounded-full bg-white flex items-center justify-center">
          <span className={`text-sm font-bold text-[#674fff] ${montserrat.className}`}>{course.percentage}%</span>
        </div>
      </div>
    </div>
  );
};


const MyCourseCard: React.FC<{ course: MyCourse }> = ({ course }) => {
  const progressPercentage = Math.round((course.lessonsCompleted / course.lessonsTotal) * 100);

  return (
    <div className="bg-white p-3 rounded-lg border border-gray-100 flex space-x-3 transition-colors hover:bg-gray-50 cursor-pointer">
      <img
        src={course.imageUrl}
        alt={`${course.title} thumbnail`}
        className="w-16 h-16 rounded-md object-cover flex-shrink-0"
      />
      <div className="flex-grow overflow-hidden">
        <span className={`px-2 py-0.5 rounded text-xs font-medium inline-block mb-1 ${course.status === 'Complete' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700' }`}>
          {course.status}
        </span>
        <h4 className={`text-sm font-semibold text-gray-800 truncate mb-1 ${montserrat.className}`}>
          {course.title}
        </h4>
        <p className="text-xs text-gray-500 truncate mb-1.5">{course.category} • {course.level}</p>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full ${course.status === 'Complete' ? 'bg-green-500' : 'bg-blue-500'}`}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
         <p className="text-xs text-gray-500 mt-1 text-right">{course.lessonsCompleted}/{course.lessonsTotal} Lessons</p>
      </div>
    </div>
  );
};


const HomePage: React.FC = () => {
  
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  
  const [currentCartItems, setCurrentCartItems] = useState(initialCartItems);

  
  const [bookmarkedCourseIds, setBookmarkedCourseIds] = useState<Set<number>>(new Set());

  
  const [currentView, setCurrentView] = useState<'dashboard' | 'detail'>('dashboard');
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  
  const handleToggleNotificationDropdown = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setIsProfileOpen(false);
    setIsCartOpen(false);
  };

  const handleToggleProfileDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsNotificationOpen(false);
    setIsCartOpen(false);
  };

  const handleToggleCartDropdown = () => {
    setIsCartOpen(!isCartOpen);
    setIsNotificationOpen(false);
    setIsProfileOpen(false);
  };

  
  const handleToggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
        setSearchQuery('');
    }
    
    if (!isSearchOpen) {
        setTimeout(() => searchInputRef.current?.focus(), 0);
    }
  };

  
  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentView('dashboard');
    setSelectedCourseId(null);
    setSearchQuery(event.target.value);
  };

  
  const handleRemoveFromCart = (itemId: number) => {
    setCurrentCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  
  const handleToggleBookmark = (courseId: number) => {
    setBookmarkedCourseIds(prevIds => {
      const newIds = new Set(prevIds);
      if (newIds.has(courseId)) {
        newIds.delete(courseId);
      } else {
        newIds.add(courseId);
      }
      return newIds;
    });
  };

  
  const handleViewAllClick = () => {
    setCurrentView('dashboard');
    setSelectedCourseId(null);
    setSearchQuery(" ");
    setIsSearchOpen(false);
  };

  
  const handleViewCourse = (courseId: number) => {
    setSelectedCourseId(courseId);
    setCurrentView('detail');
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  
  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedCourseId(null);
    setSearchQuery('');
  };

  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current && !notificationRef.current.contains(event.target as Node) &&
        profileRef.current && !profileRef.current.contains(event.target as Node) &&
        cartRef.current && !cartRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
        setIsProfileOpen(false);
        setIsCartOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  
  const filteredCourses = searchQuery === " "
      ? courses
      : courses.filter(course =>
          searchQuery && course.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

  
  const selectedCourse = courses.find(course => course.id === selectedCourseId);
    
    const renderDetailView = () => {
        if (!selectedCourse) {
             return <div className="text-center py-10 text-red-600">Error: Course not found. <button onClick={handleBackToDashboard} className="text-blue-600 underline">Go Back</button></div>;
        }

        const handleAddToCartFromDetail = () => {
            if (!currentCartItems.some(item => item.id === selectedCourse.id)) {
                const newItem = {
                    id: selectedCourse.id,
                    title: selectedCourse.title,
                    price: selectedCourse.price,
                    imageUrl: selectedCourse.imageUrl
                };
                setCurrentCartItems(prevItems => [...prevItems, newItem]);
                 console.log(`${selectedCourse.title} added to cart.`);
            } else {
                console.log(`${selectedCourse.title} is already in the cart.`);
            }
            setIsCartOpen(true);
            setIsNotificationOpen(false);
            setIsProfileOpen(false);
        };

        
        const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
            const fullStars = Math.floor(rating);
            const hasHalfStar = rating % 1 >= 0.5;
            const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

            return (
                <div className="flex items-center text-yellow-400">
                    {[...Array(fullStars)].map((_, i) => <FiStar key={`full-${i}`} className="w-4 h-4 fill-current" />)}
                    {hasHalfStar && (
                         <div key="half" className="relative w-4 h-4">
                            <FiStar className="absolute top-0 left-0 w-4 h-4 text-gray-300" />
                            <FiStar className="absolute top-0 left-0 w-4 h-4 fill-current" style={{ clipPath: 'inset(0 50% 0 0)' }} />
                         </div>
                    )}
                    {[...Array(emptyStars)].map((_, i) => <FiStar key={`empty-${i}`} className="w-4 h-4 text-gray-300" />)}
                    <span className="ml-2 text-sm text-gray-600">({rating.toFixed(1)})</span>
                </div>
            );
        };

        return (
            <section className="course-detail-view animate-fade-in">
                 <button onClick={handleBackToDashboard} className="mb-6 text-sm text-[#674fff] hover:underline flex items-center cursor-pointer">
                     <FiChevronLeft className="mr-1 h-4 w-4" /> Back to Courses
                 </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    <div className="lg:col-span-2 order-2 lg:order-1">
                         <h1 className={`block lg:hidden text-2xl font-bold mb-4 ${montserrat.className}`}>{selectedCourse.title}</h1>

                         <div className="bg-white p-6 rounded-lg border border-gray-100 mb-6">
                             <h2 className={`text-xl font-semibold mb-3 ${montserrat.className}`}>Course Description</h2>
                             <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                 {selectedCourse.description || 'No description available.'}
                             </p>
                         </div>

                          <div className="bg-white p-6 rounded-lg border border-gray-100 mb-6">
                             <h2 className={`text-xl font-semibold mb-3 ${montserrat.className}`}>Instructor</h2>
                              <div className="flex items-center space-x-4">
                                 <img
                                     src={selectedCourse.instructor.imageUrl || 'https://via.placeholder.com/50/cccccc/969696?text=?'}
                                     alt={selectedCourse.instructor.name || 'Instructor'}
                                     className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                                 />
                                 <div>
                                     <p className={`font-semibold text-gray-800 text-lg ${montserrat.className}`}>{selectedCourse.instructor.name || 'Instructor Name'}</p>
                                     <p className="text-sm text-gray-500">{selectedCourse.instructor.title || 'Instructor Title'}</p>
                                 </div>
                             </div>

                         </div>

                          <div className="bg-white p-6 rounded-lg border border-gray-100">
                              <div className="flex items-center justify-between mb-4">
                                 <h2 className={`text-xl font-semibold ${montserrat.className}`}>Reviews</h2>
                                 {selectedCourse.reviewCount > 0 && (
                                     <div className="flex items-center">
                                         <StarRating rating={selectedCourse.rating} /> 
                                         <span className="ml-2 text-sm text-gray-600">({selectedCourse.reviewCount} {selectedCourse.reviewCount === 1 ? 'review' : 'reviews'})</span>
                                     </div>
                                 )}
                              </div>

                              {selectedCourse.reviews && selectedCourse.reviews.length > 0 ? (
                                  <div className="space-y-5">
                                      {selectedCourse.reviews.slice(0, 3).map((review) => {
                                          const ReviewStars: React.FC<{ rating: number }> = ({ rating }) => (
                                              <div className="flex text-yellow-400">
                                                  {[...Array(5)].map((_, i) => (
                                                      <FiStar key={i} className={`w-3.5 h-3.5 ${i < rating ? 'fill-current' : 'text-gray-300'}`} />
                                                  ))}
                                              </div>
                                          );

                                          return (
                                              <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                                                  <div className="flex items-center justify-between mb-1.5">
                                                      <p className={`font-semibold text-gray-800 ${montserrat.className}`}>{review.reviewerName}</p>
                                                      <ReviewStars rating={review.rating} />
                                                  </div>
                                                  <p className="text-sm text-gray-700 mb-1 leading-relaxed">{review.comment}</p>
                                                  <p className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                              </div>
                                          );
                                      })} 
                                       {selectedCourse.reviews.length > 3 && (
                                          <button className="text-sm text-[#674fff] hover:underline mt-4 cursor-pointer">
                                              Show all {selectedCourse.reviewCount} reviews
                                          </button>
                                       )}
                                  </div>
                              ) : (
                                  <p className="text-gray-500 italic text-center py-4">No reviews yet for this course.</p>
                              )}
                          </div>
                    </div>

                    <div className="lg:col-span-1 order-1 lg:order-2">
                         <h1 className={`hidden lg:block text-3xl font-bold mb-4 ${montserrat.className}`}>{selectedCourse.title}</h1>
                        
                         <div className="bg-white p-6 rounded-lg border border-gray-100 sticky top-6">
                            
                            <img src={selectedCourse.imageUrl} alt={`Course image for ${selectedCourse.title}`} className="w-full h-48 object-cover rounded-md mb-4" />

                            
                            <div className="flex items-center justify-between mb-4">
                                 <p className={`text-3xl font-bold text-[#674fff] ${montserrat.className}`}>${selectedCourse.price.toFixed(2)}</p>
                                 <StarRating rating={selectedCourse.rating} /> 
                            </div>

                            
                             <div className="flex space-x-3 mb-5">
                                <button
                                     onClick={handleAddToCartFromDetail} 
                                     className="flex-1 bg-purple-100 text-[#674fff] py-3 px-4 rounded-md hover:bg-purple-200 transition duration-200 font-semibold flex items-center justify-center cursor-pointer"
                                >
                                    <FiShoppingCart className="mr-2 h-5 w-5"/> Add to Cart
                                </button>
                                <button className="flex-1 bg-[#674fff] text-white py-3 px-4 rounded-md hover:bg-[#553ddc] transition duration-200 font-semibold cursor-pointer">
                                    Buy Now
                                </button>
                            </div>

                            
                            <h3 className={`text-lg font-semibold mb-3 border-t border-gray-100 pt-4 ${montserrat.className}`}>Course Details</h3>
                            <ul className="space-y-2.5 text-sm text-gray-700">
                                <li className="flex items-center"><FiBookOpen className="mr-3 h-4 w-4 text-gray-500 flex-shrink-0"/> {selectedCourse.lessons} Lessons</li>
                                <li className="flex items-center"><FiClock className="mr-3 h-4 w-4 text-gray-500 flex-shrink-0"/> Approx. {selectedCourse.hours} Hours</li>
                                <li className="flex items-center"><FiBarChart2 className="mr-3 h-4 w-4 text-gray-500 flex-shrink-0"/> {selectedCourse.level || 'N/A'} Level</li> 
                                <li className="flex items-center"><FiTag className="mr-3 h-4 w-4 text-gray-500 flex-shrink-0"/> Category: {selectedCourse.category}</li>
                             </ul>
                        </div>
                    </div>
                </div>
            </section>
        );
    };


     return (
        <div className={`flex flex-col min-h-screen bg-[#f6f6f6] text-[#151520] ${roboto.className}`}>
            <header className="text-[#f1f1f1] shadow-md print:hidden 
                           sticky top-0 z-50 bg-[#151520]/90 backdrop-blur-md 
                           md:relative md:top-auto md:bg-[#151520] md:backdrop-blur-none 
                           transition-all duration-300">
                <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                    <div className="flex items-center flex-grow min-w-0 mr-4">
                        {!isSearchOpen && (
                            <div className={`text-2xl font-bold text-white ${montserrat.className} transition-opacity duration-300`}>
                                <span className="block md:hidden">QL</span>
                                <span className="hidden md:block">QuantumLeap</span>
                            </div>
                        )}
                        <div className={`relative w-full transition-all duration-300 ease-in-out ${isSearchOpen ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0 pointer-events-none'}`}>
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search courses..."
                                value={searchQuery}
                                onChange={handleSearchInputChange}
                                className={`w-full py-2 pl-10 pr-4 rounded-md bg-[#333] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#674fff] transition-colors duration-200 ${isSearchOpen ? '' : 'invisible'}`}
                                aria-label="Search courses input"
                            />
                        </div>
                    </div> 

                    <div className="flex items-center space-x-6 flex-shrink-0">
                        <button
                            onClick={handleToggleSearch}
                            className="text-xl hover:text-[#e0dafc] transition duration-200 cursor-pointer"
                            aria-label={isSearchOpen ? "Close search" : "Open search"}
                            title={isSearchOpen ? "Close search" : "Search courses"}
                        >
                            {isSearchOpen ? <FiX /> : <FiSearch />}
                        </button>
                        <div className="relative flex items-center" ref={cartRef}>
                            <button
                                onClick={handleToggleCartDropdown}
                                className="relative text-xl hover:text-[#e0dafc] transition duration-200 cursor-pointer"
                                aria-label="Shopping cart"
                                title="Cart"
                                aria-haspopup="true"
                                aria-expanded={isCartOpen}
                            >
                                <FiShoppingCart />
                                {currentCartItems.length > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#674fff] text-[10px] font-bold text-white">
                                        {currentCartItems.length}
                                    </span>
                                )}
                            </button>
                            {isCartOpen && (
                                <div className="absolute mt-2 w-64 right-[-0.5rem] sm:right-0 sm:w-80 bg-white rounded-md shadow-md border border-gray-100 py-1 z-20 text-[#151520] top-8">
                                    
                                     <div className="px-4 py-2 text-sm font-semibold border-b border-gray-100">Shopping Cart</div>
                                    <div className="max-h-60 overflow-y-auto">
                                        {currentCartItems.length > 0 ? (
                                            currentCartItems.map((item) => (
                                                <div key={item.id} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                    <img src={item.imageUrl} alt={item.title} className="w-10 h-10 rounded object-cover mr-3 flex-shrink-0" />
                                                    <div className="flex-grow mr-2 max-w-[140px]">
                                                        <p className="font-medium truncate">{item.title}</p>
                                                        <p className="text-xs text-gray-500">${item.price.toFixed(2)}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemoveFromCart(item.id)}
                                                        className="text-gray-400 hover:text-red-500 ml-auto flex-shrink-0 cursor-pointer"
                                                        aria-label={`Remove ${item.title}`}
                                                    >
                                                        <FiTrash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="px-4 py-3 text-sm text-gray-500 text-center">Your cart is empty.</p>
                                        )}
                                    </div>
                                    {currentCartItems.length > 0 && (
                                        <a href="#" className="block px-4 py-2 text-sm text-white bg-[#674fff] hover:bg-[#553ddc] mt-1 text-center rounded-b-md font-medium transition duration-200">Checkout</a>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="relative flex items-center" ref={notificationRef}>
                            <button
                                onClick={handleToggleNotificationDropdown}
                                className="relative text-xl hover:text-[#e0dafc] transition duration-200 cursor-pointer"
                                aria-label="Notifications"
                                title="Notifications"
                                aria-haspopup="true"
                                aria-expanded={isNotificationOpen}
                            >
                                <FiBell />
                                <span className="absolute -top-1 -right-1 block h-2.5 w-2.5 rounded-full bg-[#674fff] ring-1 ring-[#151520]"></span>
                            </button>
                            {isNotificationOpen && (
                                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-md shadow-md border border-gray-100 py-1 z-20 text-[#151520] top-8">
                                     <div className="px-4 py-2 text-sm font-semibold border-b border-gray-100">Notifications</div>
                                    <div className="max-h-60 overflow-y-auto">
                                        <a href="#" className="flex items-start px-4 py-3 text-sm text-gray-700 hover:bg-gray-100">
                                            <FiInfo className="w-4 h-4 mr-3 mt-0.5 text-blue-500 flex-shrink-0" />
                                            <div className="flex-grow">
                                                <p className="font-medium">Course 'React Basics' was updated.</p>
                                                <p className="text-xs text-gray-500">15 minutes ago</p>
                                            </div>
                                        </a>
                                         <a href="#" className="flex items-start px-4 py-3 text-sm text-gray-700 hover:bg-gray-100">
                                            <FiCalendar className="w-4 h-4 mr-3 mt-0.5 text-orange-500 flex-shrink-0" />
                                            <div className="flex-grow">
                                                <p>Assignment for 'Data Structures' due tomorrow.</p>
                                                <p className="text-xs text-gray-500">1 hour ago</p>
                                            </div>
                                        </a>
                                        <a href="#" className="flex items-start px-4 py-3 text-sm text-gray-700 hover:bg-gray-100">
                                            <FiCheckCircle className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                                            <div className="flex-grow">
                                                <p>You completed 'Advanced Tailwind'!</p>
                                                <p className="text-xs text-gray-500">2 days ago</p>
                                            </div>
                                        </a>
                                    </div>
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-100 text-center text-[#674fff] font-medium">View All Notifications</a>
                                </div>
                            )}
                        </div>
                        <div className="relative flex items-center" ref={profileRef}>
                            <button
                                onClick={handleToggleProfileDropdown}
                                className="block hover:opacity-90 transition duration-200 cursor-pointer"
                                aria-label="User profile"
                                title="Profile"
                                aria-haspopup="true"
                                aria-expanded={isProfileOpen}
                            >
                                <div className="ring-2 ring-[#674fff] rounded-full p-0.5">
                                    <img
                                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=50&q=80"
                                        alt="User Profile"
                                        className="w-7 h-7 rounded-full object-cover"
                                    />
                                </div>
                            </button> 
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-52 bg-white rounded-md shadow-md border border-gray-100 py-1 z-20 text-[#151520] top-10">
                                    <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        <FiUser className="w-4 h-4 mr-3 text-gray-500" /> Your Profile
                                    </a>
                                    <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        <FiBookOpen className="w-4 h-4 mr-3 text-gray-500" /> My Courses
                                    </a>
                                    <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        <FiSettings className="w-4 h-4 mr-3 text-gray-500" /> Settings
                                    </a>
                                    <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-100 mt-1 pt-2">
                                        <FiLogOut className="w-4 h-4 mr-3 text-gray-500" /> Sign out
                                    </a>
                                </div>
                            )}
                        </div> 
                    </div> 
                </nav> 
            </header> 


            
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
                {currentView === 'detail' ? (
                    
                    renderDetailView()
                ) : (
                    
                    searchQuery !== '' ? (
                        
                        <section>
                            
                            <h1 className={`text-2xl md:text-3xl font-bold mb-6 ${montserrat.className}`}>
                                {searchQuery === " " ? "All Courses" : `Search Results for "${searchQuery}"`}
                            </h1>
                            
                             {(searchQuery === " " || filteredCourses.length > 0) ? ( 
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                                    {(searchQuery === " " ? courses : filteredCourses).map((course) => (
                                        <CourseCard
                                            key={course.id}
                                            course={course}
                                            isBookmarked={bookmarkedCourseIds.has(course.id)}
                                            onToggleBookmark={handleToggleBookmark}
                                            onViewCourse={handleViewCourse}
                                        />
                                    ))}
                                </div>
                             ) : (
                                 <p className="text-gray-600 text-center py-10">No courses found matching your search.</p>
                             )}
                        </section>
                    ) : (
                        
                        <>
                            
                            <h1 className={`text-2xl md:text-3xl font-bold mb-6 ${montserrat.className}`}>Dashboard</h1>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                                {statsData.map((stat) => (
                                    <StatCard key={stat.id} stat={stat} />
                                ))}
                            </div>
                            
                             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                                <div className="lg:col-span-2 space-y-8">
                                    <section>
                                        <div className="flex justify-between items-center mb-4">
                                            <h2 className={`text-xl font-semibold ${montserrat.className}`}>Popular Course</h2>
                                            <button
                                                onClick={handleViewAllClick}
                                                className="text-sm text-[#674fff] hover:underline cursor-pointer"
                                            >
                                                View All
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                                            {courses.slice(0, 3).map((course) => (
                                                <CourseCard
                                                    key={course.id}
                                                    course={course}
                                                    isBookmarked={bookmarkedCourseIds.has(course.id)}
                                                    onToggleBookmark={handleToggleBookmark}
                                                    onViewCourse={handleViewCourse}
                                                />
                                            ))}
                                        </div>
                                    </section>
                                    <section>
                                         <h2 className={`text-xl font-semibold mb-4 ${montserrat.className}`}>My Course</h2>
 
                                         <div className="block md:hidden space-y-3">
                                             {myCoursesData.map((course) => (
                                                 <MyCourseCard key={course.id} course={course} />
                                             ))}
                                         </div>
 
                                         
                                         <div className="hidden md:block overflow-x-auto">
                                             <table className="w-full min-w-[640px]">
                                                 
                                                 <thead className="border-b border-gray-200">
                                                     <tr>
                                                         <th className="p-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Course Name</th>
                                                         <th className="p-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Lessons</th>
                                                         <th className="p-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                                         <th className="p-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Level</th>
                                                         <th className="p-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                                                     </tr>
                                                 </thead>
                                                  <tbody className="divide-y divide-gray-200">
                                                     {myCoursesData.map((course) => (
                                                         <tr key={course.id} className="hover:bg-gray-100/50 transition-colors">
                                                             <td className="p-4 whitespace-nowrap">
                                                                 <div className="flex items-center space-x-3">
                                                                     <img
                                                                         src={course.imageUrl}
                                                                         alt={`${course.title} thumbnail`}
                                                                         className="w-10 h-10 rounded-md object-cover flex-shrink-0"
                                                                     />
                                                                     <span className={`font-medium text-gray-800 ${montserrat.className}`}>{course.title}</span>
                                                                 </div>
                                                             </td>
                                                             <td className="p-4 whitespace-nowrap text-sm text-gray-600">
                                                                 {course.lessonsCompleted}/{course.lessonsTotal}
                                                             </td>
                                                             <td className="p-4 whitespace-nowrap">
                                                                 <span
                                                                     className={`px-3 py-1 rounded-full text-xs font-medium ${course.status === 'Complete' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                                                         }`}
                                                                 >
                                                                     {course.status}
                                                                 </span>
                                                             </td>
                                                             <td className="p-4 whitespace-nowrap text-sm text-gray-600">{course.level}</td>
                                                             <td className="p-4 whitespace-nowrap text-sm text-gray-600">{course.category}</td>
                                                         </tr>
                                                     ))}
                                                 </tbody>
                                             </table>
                                         </div>
                                     </section>
                                </div> 
                                <div className="lg:col-span-1 space-y-8">
                                    <section className="bg-white p-4 md:p-6 rounded-lg border border-gray-100">
                                         <h2 className={`text-xl font-semibold mb-4 ${montserrat.className}`}>Course Topic</h2>
                                         
                                         <div style={{ width: '100%', height: 250 }}>
                                            <ResponsiveContainer>
                                                <PieChart>
                                                    
                                                     <Pie
                                                        data={courseTopicData}
                                                        cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value"
                                                    >
                                                        {courseTopicData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                                    </Pie>
                                                    <Tooltip formatter={(value: number, name: string) => [`${value}%`, name]} />
                                                    <Legend iconType="circle" />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </section>
                                    
                                    <section>
                                         <h2 className={`text-xl font-semibold mb-4 ${montserrat.className}`}>Continue Learning</h2>
                                         <div className="space-y-3">
                                            {continueLearningData.map((course) => (
                                                <ContinueLearningCard key={course.id} course={course} />
                                            ))}
                                        </div>
                                    </section>
                                </div> 
                             </div> 
                        </> 
                    ) 
                )} 
            </main> 


            
            <footer className="bg-[#151520] text-gray-300 py-8 md:py-12 print:hidden">
                 
                 <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                         
                         
                         <div className="mb-6 md:mb-0">
                            <h3 className={`text-2xl font-bold text-white mb-3 ${montserrat.className}`}>QuantumLeap</h3>
                            <p className="text-sm text-gray-400">Unlock your potential with our expert-led online courses.</p>
                        </div>
                         
                         <div>
                            <h4 className={`text-lg font-semibold text-white mb-3 ${montserrat.className}`}>Quick Links</h4>
                            
                             <ul className="space-y-2">
                                <li><a href="#" className="text-sm hover:text-white transition duration-200">All Courses</a></li>
                                <li><a href="#" className="text-sm hover:text-white transition duration-200">About Us</a></li>
                                <li><a href="#" className="text-sm hover:text-white transition duration-200">Blog</a></li>
                                <li><a href="#" className="text-sm hover:text-white transition duration-200">Careers</a></li>
                            </ul>
                        </div>
                         
                         <div>
                             <h4 className={`text-lg font-semibold text-white mb-3 ${montserrat.className}`}>Support</h4>
                             
                              <ul className="space-y-2">
                                <li><a href="#" className="text-sm hover:text-white transition duration-200">Help Center</a></li>
                                <li><a href="#" className="text-sm hover:text-white transition duration-200">Contact Us</a></li>
                                <li><a href="#" className="text-sm hover:text-white transition duration-200">FAQ</a></li>
                            </ul>
                        </div>
                         
                         <div>
                             <h4 className={`text-lg font-semibold text-white mb-3 ${montserrat.className}`}>Follow Us</h4>
                             
                             <div className="flex space-x-4">
                                <a href="#" aria-label="Facebook" className="text-xl hover:text-white transition duration-200 cursor-pointer"><FiFacebook /></a>
                                <a href="#" aria-label="Twitter" className="text-xl hover:text-white transition duration-200 cursor-pointer"><FiTwitter /></a>
                                <a href="#" aria-label="Instagram" className="text-xl hover:text-white transition duration-200 cursor-pointer"><FiInstagram /></a>
                                <a href="#" aria-label="LinkedIn" className="text-xl hover:text-white transition duration-200 cursor-pointer"><FiLinkedin /></a>
                            </div>
                        </div>
                    </div> 
                    
                     <div className="border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
                        <p>&copy; {new Date().getFullYear()} QuantumLeap. All rights reserved.</p>
                    </div>
                </div> 
            </footer> 
        </div> 
    ); 
}; 

export default HomePage;