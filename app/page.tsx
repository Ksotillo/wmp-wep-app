"use client";

import { useState, useEffect, ComponentType, ReactNode, useRef } from 'react';
import { ThemeProvider, useTheme } from 'next-themes';
import { Playfair_Display, Merriweather } from 'next/font/google';
import { 
    Sun, Moon, Search, UserCircle2, CircleDotDashed, BriefcaseBusiness, MoreVertical, 
    PlusCircle, ThumbsUp, MessageSquareText, Send, ImageUp, VideoIcon, ListChecks, CalendarClock, UsersRound, AtSign, Settings2, LogOut, ChevronDown, ArrowRightFromLine,
    Home, Bell, Heart, CheckCircle2, ImageIcon,
    Edit3, Trash2, Link2, Code2, Flag,
    User, Settings, CreditCard,
    DollarSign, Briefcase, UserPlus, UserCheck, HandCoins, VideoOff, Info, X,
    MessageCircle,
    Menu 
} from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';


const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'], 
  variable: '--font-playfair-display',
  display: 'swap',
});

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['400', '700'], 
  variable: '--font-merriweather',
  display: 'swap',
});



const displayPlaceholderAlert = (message: string) => {
  if (typeof window !== 'undefined') {
    window.alert(message);
  }
};


const peopleImageUrls = [
    "https://images.unsplash.com/photo-1641391503184-a2131018701b?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1747069334505-cf6815248cfe?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1742201949705-220268ad4467?q=80&w=3164&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1741736000642-781f7a0a75c1?q=80&w=2273&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1746655421130-9fba824e19f5?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1743875929006-803ea54cafc1?q=80&w=3165&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1745432740811-28b17cc47b94?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1743299472561-ae1f1b25f5b5?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1745853707137-bde430b762aa?q=80&w=3170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1745965976680-d00be7dc0377?q=80&w=2443&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1666816943145-bac390ca866c?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1664526937033-fe2c11f1be25?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1667036679091-6da384768075?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1642427749670-f20e2e76ed8c?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
];


const platformCurrentUser = {
    name: "Evgen Ledo",
    handle: "ledoteam",
    avatarUrl: peopleImageUrls[0], 
    isAuthor: true, 
    isVerified: true
};


const sampleFeedData: FeedPostData[] = [
    {
        id: 'post1',
        author: {
            name: 'Sarah Miller',
            handle: 'sarahdesigns',
            avatarUrl: peopleImageUrls[2], 
            isVerified: true,
            isAuthor: false,
        },
        timestamp: '2h ago',
        content: "Just shipped a new feature for our project! 🚀 So proud of the team's hard work. Check it out and let me know your thoughts! #webdev #reactjs #newfeature",
        mediaUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        mediaType: 'image',
        stats: { likes: 152, comments: 18 },
        comments: [
            { id: 'cmt1-1', authorName: 'John Doe', avatarUrl: peopleImageUrls[3], text: 'Looks amazing, Sarah!', timestamp: '1h ago' }, 
            { id: 'cmt1-2', authorName: 'Jane Smith', avatarUrl: peopleImageUrls[4], text: 'Great job! Can\'t wait to try it.', timestamp: '30m ago' }, 
        ]
    },
    {
        id: 'post2',
        author: {
            name: platformCurrentUser.name, 
            handle: platformCurrentUser.handle,
            avatarUrl: platformCurrentUser.avatarUrl,
            isVerified: platformCurrentUser.isVerified,
            isAuthor: true,
        },
        timestamp: '1d ago',
        content: "Exploring the new Next.js 14 features. Server actions are a game changer! What are your favorite updates? #nextjs #javascript",
        stats: { likes: 280, comments: 45 },
        comments: [
             { id: 'cmt2-1', authorName: 'Alex Brown', avatarUrl: peopleImageUrls[5], text: 'Totally agree! The performance improvements are noticeable too.', timestamp: '23h ago' }, 
             { id: 'cmt2-2', authorName: 'Emily White', avatarUrl: peopleImageUrls[6], text: 'I\'m still wrapping my head around some of the new routing conventions.', timestamp: '22h ago' }, 
        ]
    },
    {
        id: 'post3',
        author: {
            name: 'TechReviewer',
            handle: 'gadgetguru',
            avatarUrl: peopleImageUrls[7], 
            isAuthor: false,
        },
        timestamp: '3d ago',
        content: "Just posted a new video reviewing the latest AI tools for developers. Link in bio! #AI #DevTools #TechReview",
        mediaUrl: "https://images.unsplash.com/photo-1677756119517-756a188d2d94?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
        mediaType: 'image', 
        stats: { likes: 95, comments: 12 },
        comments: []
    }
];



const mockHashtags = [
  '#ReactJS', '#NextJS', '#JavaScript', '#TypeScript', '#TailwindCSS', '#Design', 
  '#UIUX', '#WebDevelopment', '#Frontend', '#Inspiration', '#Productivity', '#Tech',
  '#DarkMode', '#CSSArt', '#DevCommunity', '#CodingLife'
];

type IconType = ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;


interface NotificationItemData {
    id: string;
    icon: IconType;
    iconColorClass?: string;
    title: string;
    description: string;
    timestamp: string;
    isRead: boolean;
    performerAvatarUrl?: string; 
}

const mockNotifications: NotificationItemData[] = [
    {
        id: 'notif1',
        icon: UserPlus,
        iconColorClass: 'text-sky-500',
        title: 'New Follower',
        description: 'Amanda L. started following you.',
        timestamp: '5m ago',
        isRead: false,
        performerAvatarUrl: peopleImageUrls[1 % peopleImageUrls.length]
    },
    {
        id: 'notif2',
        icon: ThumbsUp,
        iconColorClass: 'text-rose-500',
        title: 'Post Liked',
        description: 'John B. liked your recent post about Next.js.',
        timestamp: '30m ago',
        isRead: false,
        performerAvatarUrl: peopleImageUrls[2 % peopleImageUrls.length]
    },
    {
        id: 'notif3',
        icon: MessageCircle, 
        iconColorClass: 'text-green-500',
        title: 'New Comment',
        description: 'Andrew K. commented: "Great insights!"',
        timestamp: '1h ago',
        isRead: true,
        performerAvatarUrl: peopleImageUrls[3 % peopleImageUrls.length]
    },
    {
        id: 'notif4',
        icon: Info,
        iconColorClass: 'text-amber-500',
        title: 'System Update',
        description: 'Platform maintenance scheduled for tonight at 2 AM.',
        timestamp: '3h ago',
        isRead: true,
    },
];

const NotificationEntry = ({ notification }: { notification: NotificationItemData }) => (
    <DropdownMenu.Item 
        onSelect={() => displayPlaceholderAlert(`Viewing notification: "${notification.title}"`)}
        className={`flex items-start space-x-3 px-3 py-2.5 text-sm outline-none transition-colors cursor-pointer w-full 
                    ${notification.isRead ? 'text-[var(--page-text-secondary)] hover:bg-[var(--card-bg-hover)]' : 'text-[var(--page-text-primary)] bg-[var(--notification-unread-bg)] hover:bg-[var(--notification-unread-bg-hover)]'}`}
    >
        {notification.performerAvatarUrl ? (
            <img src={notification.performerAvatarUrl} alt={notification.title} className="w-8 h-8 rounded-full object-cover mt-0.5 flex-shrink-0" />
        ) : (
            <div className={`w-8 h-8 rounded-full bg-[var(--profile-avatar-bg)] flex items-center justify-center flex-shrink-0 mt-0.5 ${notification.iconColorClass || 'text-[var(--page-text-secondary)]'}`}>
                <notification.icon size={18} />
            </div>
        )}
        <div className="flex-1 min-w-0">
            <p className={`font-medium ${notification.isRead ? '' : 'text-[var(--page-text-primary)]'}`}>{notification.title}</p>
            <p className={`text-xs ${notification.isRead ? 'text-[var(--page-text-secondary)]' : 'text-[var(--page-text-secondary)]/90'}`}>{notification.description}</p>
            <p className={`text-xs mt-0.5 ${notification.isRead ? 'text-[var(--page-text-tertiary)]' : 'text-[var(--page-text-tertiary)]/90'}`}>{notification.timestamp}</p>
        </div>
        {!notification.isRead && (
            <div className="w-2 h-2 bg-[var(--accent-primary)] rounded-full self-center ml-2 flex-shrink-0" title="Unread"></div>
        )}
    </DropdownMenu.Item>
);

const NotificationsDropdown = () => {
    const [notifications, setNotifications] = useState(mockNotifications);
    const unreadCount = notifications.filter(n => !n.isRead).length;

    
    const markAllAsRead = () => {
        displayPlaceholderAlert('Performing "Mark all notifications as read"');
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button title="Notifications" className="relative p-2 rounded-full hover:bg-[var(--card-bg-hover)] cursor-pointer transition-colors">
                    <Bell size={20} className="text-[var(--page-text-secondary)] hover:text-[var(--page-text-primary)] transition-colors"/> 
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[var(--card-bg)]"></span>
                    )}
                </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
                <DropdownMenu.Content 
                    sideOffset={10} 
                    align="end"
                    className="w-[360px] max-h-[70vh] overflow-y-auto bg-[var(--card-bg)] shadow-xl rounded-lg border border-[var(--border-color-primary)] z-50 flex flex-col animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 scrollbar-thin scrollbar-thumb-[var(--scrollbar-thumb)] scrollbar-track-[var(--scrollbar-track)]"
                >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-color-primary)]">
                        <h3 className="text-base font-semibold text-[var(--page-text-primary)] font-[var(--font-heading)]">Notifications</h3>
                        {unreadCount > 0 && (
                             <button 
                                onClick={markAllAsRead}
                                className="text-xs text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] font-medium cursor-pointer"
                             >Mark all as read</button>
                        )}
                    </div>
                    {notifications.length === 0 ? (
                        <p className="text-center text-sm text-[var(--page-text-secondary)] py-8">No new notifications.</p>
                    ) : (
                        notifications.map(notif => <NotificationEntry key={notif.id} notification={notif} />)
                    )}
                     <DropdownMenu.Separator className="h-px bg-[var(--border-color-primary)] my-0" />
                     <DropdownMenu.Item 
                        onSelect={() => displayPlaceholderAlert("Redirecting to 'All Notifications' page")}
                        className="flex items-center justify-center space-x-2 px-3 py-2.5 text-sm text-[var(--accent-primary)] hover:bg-[var(--card-bg-hover)] rounded-b-md cursor-pointer outline-none transition-colors font-medium">
                        <span>View all notifications</span>
                        <ArrowRightFromLine size={14}/>
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
};


const ThemeSwitchMechanism = () => {
  const { theme, setTheme } = useTheme();
  const [isClientMounted, setIsClientMounted] = useState(false);

  useEffect(() => setIsClientMounted(true), []);

  if (!isClientMounted) return <div className="w-8 h-8" />; 

  const flipThemeSetting = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <button
      onClick={flipThemeSetting}
      className="p-2 rounded-full hover:bg-[var(--card-bg-hover)] transition-colors duration-200 cursor-pointer"
      title="Toggle theme"
    >
      {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-sky-400" />}
      
    </button>
  );
};

const AppBrandingAndTheme = () => (
  <div className="flex items-center justify-between mb-6">
    
    <div className="w-10 h-10 bg-[var(--brand-logo-bg)] rounded-lg flex items-center justify-center text-[var(--brand-logo-text)] shadow-md">
      <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6"> 
        <rect x="4" y="14" width="16" height="4" rx="2" />
        <rect x="7" y="9" width="10" height="4" rx="2" />
        <rect x="10" y="4" width="4" height="4" rx="2" />
      </svg>
    </div>
    
    
    <div className="flex items-center space-x-1">
      <NotificationsDropdown />
      <ThemeSwitchMechanism />
    </div>
  </div>
);


const NavigationSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredHashtags, setFilteredHashtags] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value.trim() === '') {
      setFilteredHashtags([]);
      setIsDropdownOpen(false);
      return;
    }

    
    const currentSearchValue = value.toLowerCase();
    const filtered = mockHashtags.filter(tag => 
      tag.substring(1).toLowerCase().startsWith(currentSearchValue) 
    );
    setFilteredHashtags(filtered);
    setIsDropdownOpen(filtered.length > 0);
  };

  const handleHashtagSelect = (hashtag: string) => {
    displayPlaceholderAlert(`Searching for ${hashtag}`);
    setSearchTerm(hashtag); 
    setIsDropdownOpen(false);
    setFilteredHashtags([]);
  };

  return (
    <div className="relative mb-6">
      <Search 
        size={18} 
        strokeWidth={2.5} 
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--page-text-secondary)] pointer-events-none"
      />
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        onFocus={() => { 
            
            if (searchTerm.trim() !== '' && filteredHashtags.length > 0) {
                setIsDropdownOpen(true); 
            }
        }}
        onBlur={() => setTimeout(() => setIsDropdownOpen(false), 150)} 
        placeholder="# Explore topics"
        className="w-full bg-[var(--input-bg)] border border-[var(--border-color-secondary)] text-[var(--input-text)] placeholder-[var(--input-placeholder)] text-sm rounded-lg py-2.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] transition-shadow duration-200 shadow-sm"
      />
      {isDropdownOpen && filteredHashtags.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-[var(--card-bg)] border border-[var(--border-color-primary)] rounded-lg shadow-xl z-20 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--scrollbar-thumb)] scrollbar-track-[var(--scrollbar-track)]">
          {filteredHashtags.map(tag => (
            <div 
              key={tag}
              onClick={() => handleHashtagSelect(tag)}
              className="px-4 py-2.5 text-sm text-[var(--page-text-primary)] hover:bg-[var(--card-bg-hover)] cursor-pointer transition-colors"
            >
              {tag}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ProfileSummaryDisplay = () => (
  <div className="bg-[var(--card-bg)] p-5 rounded-xl mb-6 shadow-lg">
    <div className="relative h-16 mb-4">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-[var(--profile-avatar-bg)] border-4 border-[var(--profile-avatar-border)] flex items-center justify-center shadow-xl overflow-hidden">
             {platformCurrentUser.avatarUrl ? (
                <img src={platformCurrentUser.avatarUrl} alt={platformCurrentUser.name} className="w-full h-full object-cover" />
             ) : (
                <UserCircle2 size={56} className="text-[var(--page-text-secondary)]" />
             )}
        </div>
    </div>
    <div className="text-center mt-8">
        <h2 className="text-xl font-[var(--font-heading)] font-semibold text-[var(--page-text-primary)]">{platformCurrentUser.name}</h2>
        <p className="text-xs text-[var(--accent-primary)] mb-2">@{platformCurrentUser.handle}</p>
        <div className="flex justify-center space-x-6 my-4">
            <div>
                <p className="text-lg font-semibold text-[var(--page-text-primary)]">1984</p>
                <p className="text-xs text-[var(--page-text-secondary)]">Followers</p>
            </div>
            <div>
                <p className="text-lg font-semibold text-[var(--page-text-primary)]">1002</p>
                <p className="text-xs text-[var(--page-text-secondary)]">Following</p>
            </div>
        </div>
        <p className="text-sm text-[var(--page-text-secondary)] leading-relaxed my-4 px-2">
            ✨ Hello, I&apos;m UX/UI designer. Open to the new projects. ✨
        </p>
        <button 
            onClick={() => displayPlaceholderAlert("Redirecting to 'My Profile' page")}
            className="w-full bg-[var(--button-bg)] hover:bg-[var(--button-bg-hover)] text-[var(--button-text)] font-medium py-2.5 px-4 rounded-lg text-sm transition-colors duration-200 cursor-pointer shadow-sm hover:shadow-md">
            My Profile
        </button>
    </div>
  </div>
);

const ExpertiseTags = () => {
    const userSkillsList = ["UX Design", "Copywriting", "Mobile", "Research", "User Interview", "JS", "Logo"];
    return (
        <div className="mb-6">
            <h3 className="text-xs font-semibold text-[var(--page-text-secondary)] uppercase tracking-wider mb-3 font-[var(--font-heading)]">Skills</h3>
            <div className="flex flex-wrap gap-2">
                {userSkillsList.map(skillItem => (
                    <span 
                        key={skillItem} 
                        onClick={() => displayPlaceholderAlert(`Filtering by skill: '${skillItem}'`)}
                        className="bg-[var(--button-bg)] text-[var(--button-text)] text-xs px-3 py-1.5 rounded-full cursor-pointer hover:bg-[var(--button-bg-hover)] transition-colors duration-150 shadow-sm">
                        {skillItem}
                    </span>
                ))}
            </div>
        </div>
    );
};

interface CommunityInfo {
    id: number;
    name: string;
    members: number;
    icon: ReactNode; 
}

const GroupAffiliations = () => {
    const userCommunities: CommunityInfo[] = [
        { id:1, name: "UX designers community", members: 32, icon: <CircleDotDashed size={22} className="text-[var(--accent-primary)]" /> },
        { id:2, name: "Frontend developers", members: 12, icon: <BriefcaseBusiness size={22} className="text-emerald-500" /> },
        
    ];
    return (
        <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-[var(--page-text-secondary)] uppercase tracking-wider font-[var(--font-heading)]">Communities</h3>
                
            </div>
            <div className="space-y-2.5">
                {userCommunities.map(communityItem => (
                    <div 
                        key={communityItem.id} 
                        onClick={() => displayPlaceholderAlert(`Redirecting to community: '${communityItem.name}'`)}
                        className="flex items-center space-x-3.5 p-2.5 rounded-lg hover:bg-[var(--card-bg-hover)] cursor-pointer transition-colors duration-150 group">
                        <div className="w-10 h-10 bg-[var(--card-bg)] rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                            {communityItem.icon} 
                        </div>
                        <div>
                            <p className="text-sm font-medium text-[var(--page-text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">{communityItem.name}</p>
                            <p className="text-xs text-[var(--page-text-secondary)]"><span className="text-[var(--accent-primary)] font-bold text-[0.5rem] align-middle">●</span> {communityItem.members} your friends are in</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


interface StoryViewerProps {
  story: StoryProfile; 
  onClose: () => void;
  onNext: () => void;
}

const StoryViewer = ({ story, onClose, onNext }: StoryViewerProps) => {
  

  
  useEffect(() => {
    const timer = setTimeout(() => {
      onNext();
    }, 6000); 
    return () => clearTimeout(timer);
  }, [story, onNext]); 

  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div 
      key={story.id} 
      className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-[100] p-4 animate-in fade-in-0"
    >
      
      <button 
        onClick={onClose} 
        className="absolute top-5 right-5 text-white/70 hover:text-white transition-colors cursor-pointer z-[102]"
      >
        <X size={32} strokeWidth={2.5} />
      </button>

      
      <div className="relative max-w-md w-full aspect-[9/16] bg-zinc-800 rounded-lg overflow-hidden shadow-2xl">
        {story.avatarUrl ? (
            <img 
                src={story.avatarUrl} 
                alt={`Story by ${story.name}`} 
                className="w-full h-full object-cover"
            />
        ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-700">
                <ImageIcon size={64} className="text-zinc-500" />
            </div>
        )}
        
        <div className="absolute top-0 left-0 p-4 flex items-center space-x-2 bg-gradient-to-b from-black/50 to-transparent w-full">
          {story.avatarUrl ? (
            <img src={story.avatarUrl} alt={story.name} className="w-8 h-8 rounded-2xl object-cover border-2 border-white/50" />
          ) : (
            <UserCircle2 size={32} className="text-white/80" />
          )}
          <span className="text-sm text-white font-semibold font-[var(--font-heading)] drop-shadow-md">{story.name}</span>
        </div>

        
        <div className="absolute top-2 left-2 right-2 h-1 bg-white/30 rounded-full overflow-hidden">
            <div className="h-full bg-[var(--accent-primary)] animate-story-progress origin-left"></div>
        </div>
      </div>
       
       <style jsx>{`
        @keyframes story-progress-animation {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        .animate-story-progress {
          animation: story-progress-animation 6s linear forwards;
        }
      `}</style>
    </div>
  );
};


interface StoryProfile {
    id: string;
    name: string;
    avatarUrl?: string; 
    hasActiveStory?: boolean; 
}

const StoryEntryDisplay = ({ profile, onStoryClick, showActiveRing }: { profile: StoryProfile; onStoryClick: (story: StoryProfile) => void; showActiveRing: boolean }) => (
    <div 
        onClick={() => onStoryClick(profile)} 
        className="flex flex-col items-center space-y-1.5 flex-shrink-0 w-20 cursor-pointer group"
    >
        <div 
            className={`w-16 h-16 rounded-2xl bg-[var(--profile-avatar-bg)] border-2 group-hover:border-[var(--accent-primary)] transition-colors flex items-center justify-center shadow overflow-hidden ${showActiveRing ? 'border-[var(--accent-primary)]' : 'border-[var(--border-color-secondary)]'}`} /* MODIFIED: rounded-2xl */
        >
            {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
                <UserCircle2 size={36} className="text-[var(--page-text-secondary)]" />
            )}
        </div>
        <p className="text-xs text-center text-[var(--page-text-secondary)] group-hover:text-[var(--page-text-primary)] transition-colors truncate w-full">{profile.name}</p>
    </div>
);

const UserStoriesGallery = ({ onStoryClick }: { onStoryClick: (story: StoryProfile, allStories: StoryProfile[]) => void }) => {
    const storyProfilesData: StoryProfile[] = [
        
        {
            id: 'currentUserStory',
            name: platformCurrentUser.name,
            avatarUrl: platformCurrentUser.avatarUrl,
            hasActiveStory: true 
        },
        
        { id: '1', name: 'Amanda', avatarUrl: peopleImageUrls[1 % peopleImageUrls.length], hasActiveStory: true }, 
        { id: '2', name: 'John B.', avatarUrl: peopleImageUrls[2 % peopleImageUrls.length] },
        { id: '3', name: 'Andrew K.', avatarUrl: peopleImageUrls[3 % peopleImageUrls.length] },
        { id: '4', name: 'Rosaline', avatarUrl: peopleImageUrls[4 % peopleImageUrls.length], hasActiveStory: true },
        { id: '5', name: 'Mudreh', avatarUrl: peopleImageUrls[5 % peopleImageUrls.length] },
        { id: '6', name: 'Juliet', avatarUrl: peopleImageUrls[6 % peopleImageUrls.length] }, 
        { id: '7', name: 'Bohdan', avatarUrl: peopleImageUrls[7 % peopleImageUrls.length] }, 
        { id: '8', name: 'Chris P.', avatarUrl: peopleImageUrls[8 % peopleImageUrls.length] },
        { id: '9', name: 'Alina G.', avatarUrl: peopleImageUrls[9 % peopleImageUrls.length], hasActiveStory: true },
        { id: '10', name: 'Mike T.', avatarUrl: peopleImageUrls[10 % peopleImageUrls.length] },
        { id: '11', name: 'Sarah W.', avatarUrl: peopleImageUrls[11 % peopleImageUrls.length] }, 
        { id: '12', name: 'Kenji M.', avatarUrl: peopleImageUrls[12 % peopleImageUrls.length], hasActiveStory: true },
    ];

    return (
        <div className="mb-8">
            <div className="flex space-x-4 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-[var(--scrollbar-thumb)] scrollbar-track-transparent scrollbar-thumb-rounded-full">
                {storyProfilesData.map((profile, index) => (
                    <StoryEntryDisplay 
                        key={profile.id} 
                        profile={profile} 
                        onStoryClick={() => onStoryClick(profile, storyProfilesData)} 
                        showActiveRing={index === 0} 
                    />
                ))}
            </div>
        </div>
    );
};


type CreatePostWidgetProps = {
    onPostSubmit: (postDetails: { content: string; mediaUrl?: string; mediaType?: 'image' | 'video' | 'poll'; pollOptions?: string[] }) => void;
};

const CreateNewPostWidget = ({ onPostSubmit }: CreatePostWidgetProps) => {
    const [postText, setPostText] = useState('');
    const [selectedPostType, setSelectedPostType] = useState<'text' | 'photo' | 'video' | 'poll'>('text');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [pollOptions, setPollOptions] = useState<string[]>(['', '']); 

    const imageInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);

    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [postDetailsToSchedule, setPostDetailsToSchedule] = useState<Omit<Parameters<CreatePostWidgetProps['onPostSubmit']>[0], 'timestamp'> | null>(null);

   
    const [formError, setFormError] = useState<string | null>(null);
    const [formSuccess, setFormSuccess] = useState<string | null>(null);

    useEffect(() => {
       
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

   
    useEffect(() => {
        if (formSuccess) {
            const timer = setTimeout(() => {
                setFormSuccess(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [formSuccess]);

   
    useEffect(() => {
        if (formError) setFormError(null);
    }, [postText, selectedFile, pollOptions, selectedPostType]);


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPostText(event.target.value);
    };

    const resetMediaState = () => {
        setSelectedFile(null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(null);
    };

    const triggerImageUpload = () => {
        resetMediaState();
        imageInputRef.current?.click();
    };

    const triggerVideoUpload = () => {
        resetMediaState();
        videoInputRef.current?.click();
    };
    
    const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'video') => {
        const file = event.target.files?.[0];
        if (file) {
            resetMediaState(); 
            setSelectedFile(file);
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
            setSelectedPostType(type);
        } else {
            resetMediaState();
            setSelectedPostType('text'); 
        }
        if (event.target) {
            event.target.value = '';
        }
    };

    const selectPostTypeOption = (type: 'photo' | 'video' | 'poll') => {
        setFormError(null);
        if (type === selectedPostType && type !== 'poll') { 
            setSelectedPostType('text');
            resetMediaState();
           
        } else {
            setSelectedPostType(type);
            resetMediaState(); 
            
            if (type === 'photo') {
                triggerImageUpload();
            } else if (type === 'video') {
                triggerVideoUpload();
            } else if (type === 'poll') {
                 setPollOptions(['', '']); 
               
            }
        }
    };

    const handlePollOptionChange = (index: number, value: string) => {
        const newOptions = [...pollOptions];
        newOptions[index] = value;
        setPollOptions(newOptions);
    };

    const addPollOption = () => {
        setFormError(null);
        if (pollOptions.length < 5) { 
            setPollOptions([...pollOptions, '']);
        } else {
           
            setFormError("Maximum of 5 poll options allowed.");
        }
    };

    const removePollOption = (index: number) => {
        setFormError(null);
        if (pollOptions.length > 2) { 
            const newOptions = pollOptions.filter((_, i) => i !== index);
            setPollOptions(newOptions);
        } else {
           
            setFormError("A poll must have at least 2 options.");
        }
    };

    const handlePostNow = () => {
        setFormError(null);
        setFormSuccess(null);

        if (!postText.trim() && !selectedFile && selectedPostType !== 'poll') {
           
            setFormError("Cannot create an empty post.");
            return;
        }

        let postDetails: { content: string; mediaUrl?: string; mediaType?: 'image' | 'video' | 'poll'; pollOptions?: string[] } = {
            content: postText,
        };

        if (selectedPostType === 'photo' && selectedFile && previewUrl) {
            postDetails.mediaUrl = previewUrl; 
            postDetails.mediaType = 'image';
        } else if (selectedPostType === 'video' && selectedFile && previewUrl) {
            postDetails.mediaUrl = previewUrl; 
            postDetails.mediaType = 'video';
        } else if (selectedPostType === 'poll') {
            const validPollOptions = pollOptions.map(opt => opt.trim()).filter(opt => opt !== '');
            if (validPollOptions.length < 2) {
               
                setFormError("A poll must have at least two non-empty options.");
                return;
            }
            if (!postText.trim()) {
                
                 setFormError("Please add a question for your poll.");
                 return;
            }
            postDetails.mediaType = 'poll';
            postDetails.pollOptions = validPollOptions;
        }
        
        onPostSubmit(postDetails);
        setFormSuccess("Post successfully created!")
        
        setPostText('');
        setSelectedPostType('text');
        resetMediaState();
        setPollOptions(['', '']);
    };

    const handleSchedule = () => {
        setFormError(null);
        setFormSuccess(null);

        let currentPostDetails: Omit<Parameters<CreatePostWidgetProps['onPostSubmit']>[0], 'timestamp'> = {
            content: postText,
        };

        if (selectedPostType === 'photo' && selectedFile && previewUrl) {
            currentPostDetails.mediaUrl = previewUrl; 
            currentPostDetails.mediaType = 'image';
        } else if (selectedPostType === 'video' && selectedFile && previewUrl) {
            currentPostDetails.mediaUrl = previewUrl; 
            currentPostDetails.mediaType = 'video';
        } else if (selectedPostType === 'poll') {
            const validPollOptions = pollOptions.map(opt => opt.trim()).filter(opt => opt !== '');
            if (validPollOptions.length < 2) {
               
                setFormError("A poll must have at least two non-empty options for scheduling.");
                return;
            }
            if (!postText.trim()) {
                
                 setFormError("Please add a question for your poll before scheduling.");
                 return;
            }
            currentPostDetails.mediaType = 'poll';
            currentPostDetails.pollOptions = validPollOptions;
        }

        if (!currentPostDetails.content && !currentPostDetails.mediaUrl && currentPostDetails.mediaType !=='poll') {
           
            setFormError("Cannot schedule an empty post.");
            return;
        }

        setPostDetailsToSchedule(currentPostDetails);
        setIsScheduleModalOpen(true);
    };

    const confirmAndSchedulePost = (dateTime: Date) => {
        if (postDetailsToSchedule) {
            const formattedDate = dateTime.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
           
            setFormSuccess(`Post scheduled for ${formattedDate}.`);
            console.log("Post scheduled for:", dateTime, "with data:", postDetailsToSchedule);
            
            setPostText('');
            setSelectedPostType('text');
            resetMediaState();
            setPollOptions(['', '']);
            setPostDetailsToSchedule(null);
        }
        setIsScheduleModalOpen(false);
    };

    return (
        <div className="bg-[var(--card-bg)] p-4 sm:p-5 rounded-xl mb-8 shadow-md">
            
            <input 
                type="file" 
                ref={imageInputRef} 
                onChange={(e) => handleFileSelection(e, 'photo')} 
                accept="image/*" 
                className="hidden" 
            />
            <input 
                type="file" 
                ref={videoInputRef} 
                onChange={(e) => handleFileSelection(e, 'video')} 
                accept="video/*" 
                className="hidden" 
            />

            <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[var(--profile-avatar-bg)] flex items-center justify-center mt-0.5 overflow-hidden">
                    {platformCurrentUser.avatarUrl ? (
                        <img src={platformCurrentUser.avatarUrl} alt={platformCurrentUser.name} className="w-full h-full object-cover" />
                    ) : (
                        <UserCircle2 size={24} className="text-[var(--page-text-secondary)]" />
                    )}
                </div>
                <input 
                    type="text"
                    value={postText}
                    onChange={handleInputChange}
                    placeholder={selectedPostType === 'poll' ? "Ask a question for your poll..." : "Tell your friends about your thoughts..."}
                    className="flex-1 bg-transparent text-[var(--input-text)] placeholder-[var(--input-placeholder)] text-base sm:text-lg py-2.5 focus:outline-none min-w-0"
                />
            </div>
            
            
            {previewUrl && (selectedPostType === 'photo' || selectedPostType === 'video') && (
                <div className="mt-3 ml-12 sm:ml-14 p-2 border border-[var(--border-color-secondary)] rounded-lg bg-[var(--page-bg)]">
                    {selectedPostType === 'photo' && previewUrl && (
                        <img src={previewUrl} alt="Preview" className="rounded max-h-60 object-contain w-auto mx-auto" />
                    )}
                    {selectedPostType === 'video' && selectedFile && (
                        <div className="flex flex-col items-center text-center p-2">
                            <VideoIcon size={32} className="text-[var(--page-text-secondary)] mb-2" />
                            <p className="text-sm text-[var(--page-text-primary)] font-medium truncate max-w-full">{selectedFile.name}</p>
                            <p className="text-xs text-[var(--page-text-secondary)]">Video selected. Preview not available here.</p>
                        </div>
                    )}
                     <button 
                        onClick={resetMediaState} 
                        className="mt-2 text-xs text-red-500 hover:text-red-700 cursor-pointer p-1 rounded-full hover:bg-red-500/10 absolute top-1 right-1"
                        title="Remove media"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            
            {selectedPostType === 'poll' && (
                <div className="mt-3 ml-12 sm:ml-14 space-y-2.5">
                    <p className="text-xs text-[var(--page-text-secondary)] font-medium mb-1">Poll Options (2-5 options):</p>
                    {pollOptions.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={option}
                                onChange={(e) => handlePollOptionChange(index, e.target.value)}
                                placeholder={`Option ${index + 1}`}
                                className="flex-1 bg-[var(--input-bg)] border border-[var(--border-color-secondary)] text-[var(--input-text)] placeholder-[var(--input-placeholder)] text-sm rounded-md py-1.5 px-2.5 focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
                                maxLength={50}
                            />
                            {pollOptions.length > 2 && (
                                <button 
                                    onClick={() => removePollOption(index)}
                                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-500/10 rounded-full cursor-pointer"
                                    title="Remove option"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    ))}
                    {pollOptions.length < 5 && (
                        <button 
                            onClick={addPollOption}
                            className="text-xs text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] font-medium flex items-center space-x-1 cursor-pointer mt-1"
                        >
                            <PlusCircle size={14}/>
                            <span>Add option</span>
                        </button>
                    )}
                </div>
            )}
            
            
            {formError && (
                <div className="mt-3 ml-12 sm:ml-14 p-2.5 text-xs text-red-700 bg-red-100 border border-red-300 rounded-lg dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/50">
                    {formError}
                </div>
            )}
            {formSuccess && (
                <div className="mt-3 ml-12 sm:ml-14 p-2.5 text-xs text-green-700 bg-green-100 border border-green-300 rounded-lg dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/50">
                    {formSuccess}
                </div>
            )}

            <div className="mt-4 pt-4 border-t border-[var(--border-color-primary)] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-1 sm:space-x-2 flex-wrap gap-2">
                    <button 
                        onClick={() => selectPostTypeOption('photo')} 
                        className={`flex items-center space-x-1.5 sm:space-x-2 px-3 py-2 rounded-lg hover:bg-[var(--card-bg-hover)] transition-colors cursor-pointer ${selectedPostType === 'photo' ? 'bg-[var(--card-bg-hover)] ring-1 ring-[var(--accent-primary)]' : ''}`}>
                        <ImageUp size={18} className={`text-[var(--icon-color-photo)] ${selectedPostType === 'photo' ? 'text-[var(--accent-primary)]' : ''}`} />
                        <span className={`text-xs sm:text-sm font-medium ${selectedPostType === 'photo' ? 'text-[var(--accent-primary)]' : 'text-[var(--page-text-secondary)]'}`}>Photo</span>
                    </button>
                    <button 
                        onClick={() => selectPostTypeOption('video')} 
                        className={`flex items-center space-x-1.5 sm:space-x-2 px-3 py-2 rounded-lg hover:bg-[var(--card-bg-hover)] transition-colors cursor-pointer ${selectedPostType === 'video' ? 'bg-[var(--card-bg-hover)] ring-1 ring-[var(--accent-primary)]' : ''}`}>
                        <VideoIcon size={18} className={`text-[var(--icon-color-video)] ${selectedPostType === 'video' ? 'text-[var(--accent-primary)]' : ''}`} />
                        <span className={`text-xs sm:text-sm font-medium ${selectedPostType === 'video' ? 'text-[var(--accent-primary)]' : 'text-[var(--page-text-secondary)]'}`}>Video</span>
                    </button>
                    <button 
                        onClick={() => selectPostTypeOption('poll')} 
                        className={`flex items-center space-x-1.5 sm:space-x-2 px-3 py-2 rounded-lg hover:bg-[var(--card-bg-hover)] transition-colors cursor-pointer ${selectedPostType === 'poll' ? 'bg-[var(--card-bg-hover)] ring-1 ring-[var(--accent-primary)]' : ''}`}>
                        <ListChecks size={18} className={`text-[var(--icon-color-poll)] ${selectedPostType === 'poll' ? 'text-[var(--accent-primary)]' : ''}`} />
                        <span className={`text-xs sm:text-sm font-medium ${selectedPostType === 'poll' ? 'text-[var(--accent-primary)]' : 'text-[var(--page-text-secondary)]'}`}>Poll</span>
                    </button>
                </div>
                 <DropdownMenu.Root>
                    <div className="flex items-stretch rounded-lg bg-[var(--button-bg)] hover:bg-[var(--button-bg-hover)] transition-colors shadow-sm hover:shadow-md">
                        <button 
                            onClick={handlePostNow} /* Ensure this calls the updated handlePostNow */
                            className="flex-grow px-4 py-2 text-xs sm:text-sm font-medium text-[var(--button-text)] cursor-pointer rounded-l-lg"
                        >
                            Post
                        </button>
                        <DropdownMenu.Trigger asChild>
                            <button 
                                className="px-2.5 py-2 text-[var(--button-text)] border-l border-[var(--button-text)]/20 hover:bg-[var(--button-text)]/10 rounded-r-lg cursor-pointer"
                                title="More post options"
                            >
                                <ChevronDown size={16} />
                            </button>
                        </DropdownMenu.Trigger>
                    </div>
                    <DropdownMenu.Portal>
                        <DropdownMenu.Content 
                            sideOffset={5} 
                            align="end"
                            className="min-w-[160px] bg-[var(--card-bg)] shadow-xl rounded-lg p-1.5 border border-[var(--border-color-primary)] z-50 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
                        >
                            <DropdownMenu.Item 
                                onSelect={handlePostNow} /* Ensure this calls the updated handlePostNow */
                                className="flex items-center space-x-2.5 px-3 py-2 text-sm text-[var(--page-text-primary)] hover:bg-[var(--card-bg-hover)] rounded-md cursor-pointer outline-none transition-colors">
                                <Send size={16} className="text-[var(--page-text-secondary)]" />
                                <span>Post now</span>
                            </DropdownMenu.Item>
                            <DropdownMenu.Item 
                                onSelect={handleSchedule}
                                className="flex items-center space-x-2.5 px-3 py-2 text-sm text-[var(--page-text-primary)] hover:bg-[var(--card-bg-hover)] rounded-md cursor-pointer outline-none transition-colors">
                                <CalendarClock size={16} className="text-[var(--page-text-secondary)]" />
                                <span>Schedule post...</span>
                            </DropdownMenu.Item>
                        </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                </DropdownMenu.Root>
            </div>

            
            <SchedulePostModal 
                isOpen={isScheduleModalOpen}
                onClose={() => setIsScheduleModalOpen(false)}
                onConfirmSchedule={confirmAndSchedulePost}
                postContentPreview={postDetailsToSchedule?.content || postDetailsToSchedule?.mediaType}
            />
        </div>
    );
};


interface FeedPostAuthor {
    name: string;
    handle: string;
    avatarUrl?: string; 
    isVerified?: boolean;
    isAuthor?: boolean; 
}

interface FeedPostStats {
    likes: number;
    comments: number;
}

interface FeedPostComment { 
    id: string;
    authorName: string; 
    avatarUrl?: string;
    text: string;
    timestamp?: string; 
}

interface FeedPostData {
    id: string;
    author: FeedPostAuthor;
    timestamp: string;
    content: string;
    mediaUrl?: string; 
    mediaType?: 'image' | 'video' | 'poll';
    pollOptions?: string[];
    initialVotes?: number[];
    stats?: FeedPostStats;
    comments?: FeedPostComment[]; 
}

const FeedItemDisplay = ({ post }: { post: FeedPostData }) => {
    const [commentText, setCommentText] = useState('');
    const [currentComments, setCurrentComments] = useState<FeedPostComment[]>(post.comments || []);

   
    const [selectedPollOption, setSelectedPollOption] = useState<number | null>(null);
    const [pollVoteCounts, setPollVoteCounts] = useState<number[]>(() => {
        if (post.mediaType === 'poll' && post.pollOptions) {
            return post.initialVotes || Array(post.pollOptions.length).fill(0);
        }
        return [];
    });

    const handlePollVote = (index: number) => {
        if (post.mediaType !== 'poll' || !post.pollOptions) return;

        setPollVoteCounts(prevCounts => {
            const newCounts = [...prevCounts];
           
            if (selectedPollOption !== null && selectedPollOption !== index) {
                newCounts[selectedPollOption] = Math.max(0, newCounts[selectedPollOption] - 1);
            }
           
            if (selectedPollOption !== index) {
                newCounts[index] = (newCounts[index] || 0) + 1;
            }
           
           
           
            return newCounts;
        });
        setSelectedPollOption(index);
    };
   


    const addCommentToList = () => {
        if (commentText.trim() === '') return;
        const newComment: FeedPostComment = {
            id: Date.now().toString(),
            authorName: platformCurrentUser.name, 
            avatarUrl: platformCurrentUser.avatarUrl, 
            text: commentText.trim(),
            timestamp: "Just now"
        };
        setCurrentComments(prevComments => [...prevComments, newComment]);
        setCommentText('');
    };

    const handleCommentKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            addCommentToList();
        }
    };

    return (
        <div className="bg-[var(--card-bg)] rounded-xl p-4 sm:p-5 shadow-md mb-6">
            
            <div className="flex items-start space-x-3 mb-3">
                <div className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[var(--profile-avatar-bg)] flex items-center justify-center overflow-hidden">
                    {post.author.avatarUrl ? (
                        <img src={post.author.avatarUrl} alt={post.author.name} className="w-full h-full object-cover" />
                    ) : (
                        <UserCircle2 size={24} className="text-[var(--page-text-secondary)]" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                        <span className="text-sm sm:text-base font-semibold text-[var(--page-text-primary)] font-[var(--font-heading)] mr-1 truncate">{post.author.name}</span>
                        {post.author.isVerified && <CheckCircle2 size={16} className="text-[var(--icon-color-verified)] fill-[var(--icon-color-verified-fill)] mr-1 flex-shrink-0" />}
                        <span className="text-xs sm:text-sm text-[var(--page-text-secondary)] truncate">@{post.author.handle}</span>
                        <span className="text-xs text-[var(--page-text-secondary)] mx-1.5">•</span>
                        <span className="text-xs text-[var(--page-text-secondary)] flex-shrink-0">{post.timestamp}</span>
                    </div>
                    <p className="text-xs text-[var(--page-text-secondary)]">In some cases you may see a third-party client name...</p>
                </div>
                
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                        <button className="p-2 text-[var(--page-text-secondary)] hover:text-[var(--page-text-primary)] hover:bg-[var(--card-bg-hover)] rounded-full transition-colors cursor-pointer -mr-2">
                            <MoreVertical size={20} />
                        </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                        <DropdownMenu.Content 
                            sideOffset={5} 
                            align="end"
                            className="min-w-[180px] bg-[var(--card-bg)] shadow-xl rounded-lg p-1.5 border border-[var(--border-color-primary)] z-50 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
                        >
                            {post.author.isAuthor && (
                                <>
                                    <DropdownMenu.Item 
                                        onSelect={() => displayPlaceholderAlert("Performing 'Edit post'")}
                                        className="flex items-center space-x-2.5 px-3 py-2 text-sm text-[var(--page-text-primary)] hover:bg-[var(--card-bg-hover)] rounded-md cursor-pointer outline-none transition-colors">
                                        <Edit3 size={16} className="text-[var(--page-text-secondary)]" />
                                        <span>Edit post</span>
                                    </DropdownMenu.Item>
                                    <DropdownMenu.Item 
                                        onSelect={() => displayPlaceholderAlert("Performing 'Delete post'")}
                                        className="flex items-center space-x-2.5 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-md cursor-pointer outline-none transition-colors">
                                        <Trash2 size={16} />
                                        <span>Delete post</span>
                                    </DropdownMenu.Item>
                                    <DropdownMenu.Separator className="h-px bg-[var(--border-color-primary)] my-1" />
                                </> 
                            )}
                            <DropdownMenu.Item 
                                onSelect={() => {
                                    if (navigator.clipboard && window.location.href) {
                                        navigator.clipboard.writeText(window.location.href)
                                            .then(() => displayPlaceholderAlert("Link copied to clipboard!"))
                                            .catch(err => {
                                                console.error("Failed to copy link: ", err);
                                                displayPlaceholderAlert("Failed to copy link.");
                                            });
                                    } else {
                                        displayPlaceholderAlert("Clipboard API not available or no URL found.");
                                    }
                                }}
                                className="flex items-center space-x-2.5 px-3 py-2 text-sm text-[var(--page-text-primary)] hover:bg-[var(--card-bg-hover)] rounded-md cursor-pointer outline-none transition-colors">
                                <Link2 size={16} className="text-[var(--page-text-secondary)]" />
                                <span>Copy link to post</span>
                            </DropdownMenu.Item>
                            <DropdownMenu.Item 
                                onSelect={() => displayPlaceholderAlert("Performing 'Embed post'")}
                                className="flex items-center space-x-2.5 px-3 py-2 text-sm text-[var(--page-text-primary)] hover:bg-[var(--card-bg-hover)] rounded-md cursor-pointer outline-none transition-colors">
                                <Code2 size={16} className="text-[var(--page-text-secondary)]" />
                                <span>Embed post</span>
                            </DropdownMenu.Item>
                            <DropdownMenu.Separator className="h-px bg-[var(--border-color-primary)] my-1" />
                            <DropdownMenu.Item 
                                onSelect={() => displayPlaceholderAlert("Performing 'Report post'")}
                                className="flex items-center space-x-2.5 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-md cursor-pointer outline-none transition-colors">
                                <Flag size={16} />
                                <span>Report post</span>
                            </DropdownMenu.Item>
                        </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                </DropdownMenu.Root>
            </div>

            
            <p className="text-sm sm:text-base text-[var(--page-text-primary)] leading-relaxed mb-3 whitespace-pre-wrap">
                {post.content}
            </p>

            
            {post.mediaUrl && post.mediaType === 'image' && (
                <div className="rounded-lg overflow-hidden mb-3 border border-[var(--border-color-primary)]">
                    <img 
                        src={post.mediaUrl} 
                        alt={`Post image by ${post.author.name}`} 
                        className="w-full h-auto max-h-[600px] object-contain bg-black"
                    />
                </div>
            )}
            {post.mediaUrl && post.mediaType === 'video' && (
                <div className="rounded-lg overflow-hidden mb-3 border border-[var(--border-color-primary)] bg-black flex items-center justify-center">
                    
                    
                    <video controls src={post.mediaUrl} className="max-h-[600px] w-full aspect-video">
                       Your browser does not support the video tag. Video: {post.mediaUrl.substring(0,100)}...
                    </video>
                </div>
            )}
            
            {post.mediaType === 'poll' && post.pollOptions && post.pollOptions.length > 0 && (
                <div className="mb-3 space-y-2.5 pt-2">
                    {post.pollOptions.map((option, index) => {
                        const totalVotes = pollVoteCounts.reduce((acc, count) => acc + count, 0);
                        const votePercentage = totalVotes > 0 ? (pollVoteCounts[index] / totalVotes) * 100 : 0;
                        const isSelected = selectedPollOption === index;

                        return (
                            <div 
                                key={index}
                                className={`p-3 border rounded-lg text-sm cursor-pointer transition-all duration-200 ease-in-out relative overflow-hidden
                                            ${isSelected ? 'border-[var(--accent-primary)] ring-2 ring-[var(--accent-primary)] bg-[var(--accent-primary)]/10' : 'border-[var(--border-color-secondary)] hover:border-[var(--accent-primary)] hover:bg-[var(--card-bg-hover)]'}`}
                                onClick={() => handlePollVote(index)}
                            >
                                <div 
                                    className="absolute top-0 left-0 h-full bg-[var(--accent-primary)]/30 transition-all duration-300 ease-out z-0"
                                    style={{ width: isSelected || selectedPollOption !== null ? `${votePercentage}%` : '0%' }}
                                />
                                <div className="relative z-10 flex justify-between items-center">
                                    <span className={`font-medium ${isSelected ? 'text-[var(--accent-primary)]' : 'text-[var(--page-text-primary)]'}`}>{option}</span>
                                    {(selectedPollOption !== null) && (
                                        <span className={`text-xs font-medium ${isSelected ? 'text-[var(--accent-primary)]' : 'text-[var(--page-text-secondary)]'}`}>
                                            {pollVoteCounts[index] || 0} vote{((pollVoteCounts[index] || 0) !== 1) ? 's' : ''} ({votePercentage.toFixed(0)}%)
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            
            <div className="flex items-center justify-start text-[var(--page-text-secondary)] mb-3 pt-2 border-t border-[var(--border-color-primary)]">
                <button className="flex items-center space-x-1.5 hover:text-[var(--accent-primary)] transition-colors cursor-pointer p-2 -ml-2">
                    <ThumbsUp size={18} />
                    {post.stats && <span className="text-xs font-medium">{post.stats.likes > 0 ? post.stats.likes : ''}</span>}
                </button>
                <button className="flex items-center space-x-1.5 hover:text-[var(--icon-color-comment-action)] transition-colors cursor-pointer p-2">
                    <MessageSquareText size={18} />
                    {post.stats && <span className="text-xs font-medium">{post.stats.comments > 0 ? post.stats.comments : ''}</span>}
                </button>
                <button className="p-2 hover:text-[var(--icon-color-share-action)] transition-colors cursor-pointer -mr-2">
                    <Send size={18} />
                </button>
            </div>

            
            {currentComments.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-[var(--border-color-primary)] mb-3">
                    {currentComments.map(comment => (
                        <div key={comment.id} className="flex items-start space-x-2.5 text-xs">
                            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[var(--profile-avatar-bg)] flex items-center justify-center overflow-hidden">
                                {comment.avatarUrl ? (
                                    <img src={comment.avatarUrl} alt={comment.authorName} className="w-full h-full object-cover" />
                                ) : (
                                    <UserCircle2 size={18} className="text-[var(--page-text-secondary)]" />
                                )}
                            </div>
                            
                            <div className="bg-[var(--button-bg)] px-3.5 py-2.5 rounded-lg flex-1">
                                <span className="font-semibold text-[var(--page-text-primary)] mr-1.5">{comment.authorName}</span>
                                <span className="text-[var(--page-text-secondary)]">{comment.text}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            
            <div className="flex items-center space-x-2.5 pt-3 border-t border-[var(--border-color-primary)]">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--profile-avatar-bg)] flex items-center justify-center overflow-hidden">
                    {platformCurrentUser.avatarUrl ? (
                        <img src={platformCurrentUser.avatarUrl} alt={platformCurrentUser.name} className="w-full h-full object-cover" />
                    ) : (
                        <UserCircle2 size={20} className="text-[var(--page-text-secondary)]" />
                    )}
                </div>
                <input 
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={handleCommentKeyDown}
                    placeholder="Write your comment..."
                    className="flex-1 bg-transparent text-[var(--input-text)] placeholder-[var(--input-placeholder)] text-sm py-1.5 focus:outline-none min-w-0"
                />
                
                <div className="flex items-center space-x-1">
                    <button title="Mention user" className="p-1.5 text-[var(--page-text-secondary)] hover:text-[var(--accent-primary)] cursor-pointer">
                        <AtSign size={18} />
                    </button>
                    <button title="Attach image" className="p-1.5 text-[var(--page-text-secondary)] hover:text-[var(--accent-primary)] cursor-pointer">
                        <ImageIcon size={18} /> 
                    </button>
                </div>
                {commentText.trim() && (
                    <button 
                        title="Post comment" 
                        onClick={addCommentToList}
                        className="p-1.5 text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] cursor-pointer ml-auto" /* Added ml-auto to push send button to the right */
                    >
                        <Send size={18} strokeWidth={2.5} />
                    </button>
                )}
            </div>
        </div>
    );
};


const UserAccountWidget = () => {
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[var(--card-bg-hover)] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]">
                    <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-[var(--profile-avatar-bg)] flex items-center justify-center text-[var(--page-text-primary)] font-semibold text-sm overflow-hidden">
                            {platformCurrentUser.avatarUrl ? (
                                <img src={platformCurrentUser.avatarUrl} alt={platformCurrentUser.name} className="w-full h-full object-cover" />
                            ) : (
                                <UserCircle2 size={22} className="text-[var(--page-text-secondary)]" />
                            )}
                        </div>
                        <span className="text-sm font-medium text-[var(--page-text-primary)] font-[var(--font-heading)] truncate">{platformCurrentUser.name}</span>
                    </div>
                    <ChevronDown size={18} className="text-[var(--page-text-secondary)]" />
                </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
                <DropdownMenu.Content 
                    sideOffset={10} 
                    align="end"
                    className="min-w-[220px] bg-[var(--card-bg)] shadow-xl rounded-lg p-1.5 border border-[var(--border-color-primary)] z-50 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
                >
                    <DropdownMenu.Label className="px-3 py-2 text-xs text-[var(--page-text-secondary)] font-[var(--font-heading)]">My Account</DropdownMenu.Label>
                    <DropdownMenu.Item 
                        onSelect={() => displayPlaceholderAlert("Redirecting to 'View Profile'")}
                        className="flex items-center space-x-2.5 px-3 py-2 text-sm text-[var(--page-text-primary)] hover:bg-[var(--card-bg-hover)] rounded-md cursor-pointer outline-none transition-colors">
                        <User size={16} className="text-[var(--page-text-secondary)]" />
                        <span>View Profile</span>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item 
                        onSelect={() => displayPlaceholderAlert("Redirecting to 'Account Settings'")}
                        className="flex items-center space-x-2.5 px-3 py-2 text-sm text-[var(--page-text-primary)] hover:bg-[var(--card-bg-hover)] rounded-md cursor-pointer outline-none transition-colors">
                        <Settings size={16} className="text-[var(--page-text-secondary)]" />
                        <span>Account Settings</span>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item 
                        onSelect={() => displayPlaceholderAlert("Redirecting to 'Billing & Subscriptions'")}
                        className="flex items-center space-x-2.5 px-3 py-2 text-sm text-[var(--page-text-primary)] hover:bg-[var(--card-bg-hover)] rounded-md cursor-pointer outline-none transition-colors">
                        <CreditCard size={16} className="text-[var(--page-text-secondary)]" />
                        <span>Billing & Subscriptions</span>
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator className="h-px bg-[var(--border-color-primary)] my-1" />
                    <DropdownMenu.Item 
                        onSelect={() => displayPlaceholderAlert("Performing 'Logout'")}
                        className="flex items-center space-x-2.5 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-md cursor-pointer outline-none transition-colors">
                        <LogOut size={16} />
                        <span>Logout</span>
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
};



type ActivityType = 
    | 'subscription' 
    | 'purchase_video' 
    | 'tip_received' 
    | 'job_request' 
    | 'group_invite';

interface ActivityPerformer {
    name: string;
    avatarUrl?: string; 
    isVerifiedOnAvatar?: boolean; 
    isGroup?: boolean; 
}

interface ActivityItemData {
    id: string;
    type: ActivityType;
    performer: ActivityPerformer;
    timestamp: string;
    targetText?: string; 
    amount?: string; 
    amountLabel?: string; 
    groupName?: string; 
    canBeThanked?: boolean; 
}



const ActivityIconFallback = ({ activityType }: { activityType: ActivityType }) => {
    const iconSize = 20;
    
    switch (activityType) {
        case 'subscription': return <UserCheck size={iconSize} className="text-green-500" />;
        case 'tip_received': return <HandCoins size={iconSize} className="text-yellow-500" />;
        case 'job_request': return <Briefcase size={iconSize} className="text-sky-500" />;
        case 'group_invite': return <UsersRound size={iconSize} className="text-purple-500" />;
        default: return <UserCircle2 size={iconSize} className="text-[var(--page-text-secondary)]" />;
    }
};

const ActivityItemDisplay = ({ item, onDiscardRequest }: { item: ActivityItemData, onDiscardRequest: (id: string) => void }) => {
    const [isThanked, setIsThanked] = useState(false);
    const [isJoined, setIsJoined] = useState(false); 

    const handleThankAction = () => {
        setIsThanked(true);
        displayPlaceholderAlert(`Performing "Thank ${item.performer.name}"`);
    };

    const handleJoinGroupAction = () => {
        setIsJoined(true);
        
    };

    const performerName = <span className="font-semibold text-[var(--page-text-primary)]">{item.performer.name}</span>;
    let activityTextDetails = <></>;

    switch (item.type) {
        case 'subscription': activityTextDetails = <>{performerName} {item.targetText || 'subscribed on you'}.</>; break;
        case 'purchase_video': activityTextDetails = <>{performerName} {item.targetText || 'bought your video'}.</>; break;
        case 'tip_received': activityTextDetails = <>{performerName} {item.targetText || 'sent you a tip'}.</>; break;
        case 'job_request': activityTextDetails = <>{performerName} {item.targetText || 'sent you a job request'}.</>; break;
        case 'group_invite': activityTextDetails = <>{item.performer.isGroup ? performerName : "Invitation to join"} {item.groupName || 'group'}.</>; break;
    }

    return (
        <div className="bg-[var(--card-bg)] p-3.5 rounded-lg mb-2.5 shadow-sm">
            <div className="flex items-start space-x-3">
                <div className="relative flex-shrink-0">
                    {item.performer.avatarUrl && !item.performer.isGroup ? (
                        <img src={item.performer.avatarUrl} alt={item.performer.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : item.performer.isGroup ? (
                        <div className="w-10 h-10 rounded-full bg-orange-500/20 border-2 border-orange-500 flex items-center justify-center">
                            <div className="w-5 h-5 rounded-full bg-orange-500"></div>
                        </div>
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-[var(--profile-avatar-bg)] flex items-center justify-center">
                            <UserCircle2 size={24} className="text-[var(--page-text-secondary)]" />
                        </div>
                    )}
                    {item.performer.isVerifiedOnAvatar && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[var(--avatar-verified-badge-bg)] flex items-center justify-center border-2 border-[var(--card-bg)]">
                            <CheckCircle2 size={10} className="text-[var(--avatar-verified-badge-icon-color)] fill-[var(--avatar-verified-badge-icon-color)]" />
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-sm text-[var(--page-text-secondary)] leading-snug">
                        {activityTextDetails}
                        <span className="text-xs text-[var(--page-text-secondary)]/80 ml-1">• {item.timestamp}</span>
                    </p>
                    
                    {item.amount && (
                        <p className="text-base font-medium text-[var(--page-text-primary)] mt-1">
                            {item.amount}
                            {item.amountLabel && <span className="text-xs text-[var(--page-text-secondary)] ml-0.5">{item.amountLabel}</span>}
                        </p>
                    )}
                </div>
            </div>

            {(item.canBeThanked || item.type === 'group_invite') && (
                <div className="mt-2.5 pl-[52px]"> 
                    {item.canBeThanked && !isThanked && (
                        <button 
                            onClick={handleThankAction}
                            className="text-xs bg-[var(--accent-primary)] text-[var(--accent-text-on-primary)] px-3.5 py-1.5 rounded-full hover:bg-[var(--accent-primary-hover)] transition-colors cursor-pointer font-medium"
                        >
                            Thanks
                        </button>
                    )}
                    {item.canBeThanked && isThanked && (
                        <button 
                            disabled
                            className="flex items-center text-xs bg-[var(--button-thanked-bg)] text-[var(--button-thanked-text)] px-3.5 py-1.5 rounded-full cursor-not-allowed font-medium"
                        >
                            <CheckCircle2 size={14} className="mr-1.5" /> Thanked
                        </button>
                    )}
                    {item.type === 'group_invite' && (
                        <div className="flex items-center space-x-2">
                            {!isJoined && (
                                <button 
                                    onClick={() => {
                                        
                                        onDiscardRequest(item.id); 
                                    }}
                                    className="text-xs bg-[var(--button-discard-bg)] text-[var(--button-discard-text)] px-3.5 py-1.5 rounded-full hover:opacity-80 transition-opacity cursor-pointer font-medium"
                                >
                                    Discard
                                </button>
                            )}
                            {!isJoined ? (
                                <button 
                                    onClick={handleJoinGroupAction}
                                    className="text-xs bg-[var(--accent-primary)] text-[var(--accent-text-on-primary)] px-3.5 py-1.5 rounded-full hover:bg-[var(--accent-primary-hover)] transition-colors cursor-pointer font-medium"
                                >
                                    Join
                                </button>
                            ) : (
                                <button 
                                    disabled 
                                    className="flex items-center text-xs bg-[var(--button-thanked-bg)] text-[var(--button-thanked-text)] px-3.5 py-1.5 rounded-full cursor-not-allowed font-medium"
                                >
                                    <CheckCircle2 size={14} className="mr-1.5" /> Joined
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const RecentActivitiesManager = () => {
    const initialActivities: ActivityItemData[] = [
        {
            id: 'act1', type: 'subscription', 
            performer: { name: 'Vitaliy Akterskiy', avatarUrl: peopleImageUrls[2 % peopleImageUrls.length], isVerifiedOnAvatar: true }, 
            timestamp: '3 min ago', targetText: 'subscribed on you'
        },
        {
            id: 'act2', type: 'tip_received', 
            performer: { name: 'Evgeniy Alexandrov', avatarUrl: peopleImageUrls[3 % peopleImageUrls.length] }, 
            timestamp: '7 hrs ago', targetText: 'sent you a tip', 
            amount: '$10.00', amountLabel: '/tip', canBeThanked: true
        },
        {
            id: 'act3', type: 'purchase_video', 
            performer: { name: 'Maksym Karafizi', avatarUrl: peopleImageUrls[4 % peopleImageUrls.length] }, 
            timestamp: '6 hrs ago', targetText: 'bought your video', 
            amount: '$90.00', amountLabel: '/purchase', canBeThanked: true
        },
        {
            id: 'act4', type: 'job_request', 
            performer: { name: 'Rosaline Kumbirai', avatarUrl: peopleImageUrls[5 % peopleImageUrls.length] }, 
            timestamp: '1 hr ago', targetText: 'sent you a job request', 
            amount: '$20.00', amountLabel: '/purchase', canBeThanked: true 
        },
        {
            id: 'act5', type: 'group_invite', 
            performer: { name: 'UX designers group', isGroup: true, isVerifiedOnAvatar: true }, 
            timestamp: '12 hrs ago',
            groupName: 'UX designers group'
        },
    ];

    const [activities, setActivities] = useState(initialActivities);

    const removeActivityById = (idToRemove: string) => {
        setActivities(currentActivities => currentActivities.filter(activity => activity.id !== idToRemove));
    };

    if (activities.length === 0) {
        return <p className="text-xs text-center text-[var(--page-text-secondary)] py-10">No recent activity.</p>;
    }

    return (
        <div className="space-y-0 divide-y divide-[var(--border-color-primary)]">
            {activities.map(activity => (
                <ActivityItemDisplay key={activity.id} item={activity} onDiscardRequest={removeActivityById} />
            ))}
        </div>
    );
};



interface MobileTopNavbarProps {
    onMenuClick: () => void;
    onProfileClick: () => void;
}

const MobileTopNavbar = ({ onMenuClick, onProfileClick }: MobileTopNavbarProps) => {
    return (
        <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between h-16 px-4 bg-[var(--card-bg)] border-b border-[var(--border-color-primary)] shadow-sm">
            
            <button onClick={onMenuClick} className="p-2 text-[var(--page-text-primary)] hover:bg-[var(--card-bg-hover)] rounded-full cursor-pointer">
                <Menu size={24} />
            </button>

            
            <div className="w-8 h-8 bg-[var(--brand-logo-bg)] rounded-lg flex items-center justify-center text-[var(--brand-logo-text)]">
                 <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                    <rect x="4" y="14" width="16" height="4" rx="2" />
                    <rect x="7" y="9" width="10" height="4" rx="2" />
                    <rect x="10" y="4" width="4" height="4" rx="2" />
                </svg>
            </div>

            
            <button onClick={onProfileClick} className="p-0.5 rounded-full hover:ring-2 hover:ring-[var(--accent-primary)] cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-[var(--profile-avatar-bg)] flex items-center justify-center overflow-hidden">
                    {platformCurrentUser.avatarUrl ? (
                        <img src={platformCurrentUser.avatarUrl} alt={platformCurrentUser.name} className="w-full h-full object-cover" />
                    ) : (
                        <UserCircle2 size={20} className="text-[var(--page-text-secondary)]" />
                    )}
                </div>
            </button>
        </div>
    );
};


const PlatformClientView = () => {
  const [isStoryViewerOpen, setIsStoryViewerOpen] = useState(false);
  const [allStoriesForViewer, setAllStoriesForViewer] = useState<StoryProfile[]>([]);
  const [currentStoryIndexInViewer, setCurrentStoryIndexInViewer] = useState<number>(-1);
  const [feedPosts, setFeedPosts] = useState<FeedPostData[]>(sampleFeedData);
  
  
  const [isMobileLeftSidebarOpen, setIsMobileLeftSidebarOpen] = useState(false);
  const [isMobileRightSidebarOpen, setIsMobileRightSidebarOpen] = useState(false);

  const viewingStory = currentStoryIndexInViewer !== -1 && allStoriesForViewer[currentStoryIndexInViewer] ? allStoriesForViewer[currentStoryIndexInViewer] : null;

  const toggleMobileLeftSidebar = () => setIsMobileLeftSidebarOpen(!isMobileLeftSidebarOpen);
  const toggleMobileRightSidebar = () => setIsMobileRightSidebarOpen(!isMobileRightSidebarOpen);

  
  
  const openStoryViewer = (clickedStory: StoryProfile, allStories: StoryProfile[]) => {
    const clickedIndex = allStories.findIndex(s => s.id === clickedStory.id);
    if (clickedIndex !== -1) {
      setAllStoriesForViewer(allStories);
      setCurrentStoryIndexInViewer(clickedIndex);
      setIsStoryViewerOpen(true);
    }
  };
  const closeStoryViewer = () => {
    setIsStoryViewerOpen(false);
    setCurrentStoryIndexInViewer(-1);
  };
  const playNextStory = () => {
    if (currentStoryIndexInViewer === -1 || allStoriesForViewer.length === 0) return;
    const nextIndex = currentStoryIndexInViewer + 1;
    if (nextIndex < allStoriesForViewer.length) {
      setCurrentStoryIndexInViewer(nextIndex);
    } else {
      closeStoryViewer();
    }
  };
  const addNewPostToFeed = (postDetails: { content: string; mediaUrl?: string; mediaType?: 'image' | 'video' | 'poll'; pollOptions?: string[] }) => {
    const newPost: FeedPostData = {
        id: `post_${Date.now()}`,
        author: {
            name: platformCurrentUser.name,
            handle: platformCurrentUser.handle,
            avatarUrl: platformCurrentUser.avatarUrl,
            isVerified: platformCurrentUser.isVerified,
            isAuthor: true,
        },
        timestamp: 'Just now',
        content: postDetails.content,
        mediaUrl: postDetails.mediaUrl,
        mediaType: postDetails.mediaType,
        pollOptions: postDetails.pollOptions,
        stats: { likes: 0, comments: 0 },
        comments: []
    };
    setFeedPosts(prevPosts => [newPost, ...prevPosts]);
  };


  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[var(--page-bg)] text-[var(--page-text-primary)] font-[var(--font-body)]">
      
      <MobileTopNavbar 
        onMenuClick={toggleMobileLeftSidebar} 
        onProfileClick={toggleMobileRightSidebar} 
      />
      
      <div className="flex flex-1 overflow-hidden">
        
        {isMobileLeftSidebarOpen && (
            <div className="fixed inset-0 z-50 flex md:hidden">
                <aside className="w-3/4 max-w-sm bg-[var(--card-bg)] p-5 border-r border-[var(--border-color-primary)] flex flex-col space-y-3 h-full overflow-y-auto shadow-xl">
                    <div className="flex justify-end mb-2">
                        <button onClick={toggleMobileLeftSidebar} className="p-2 text-[var(--page-text-primary)] hover:bg-[var(--card-bg-hover)] rounded-full">
                            <X size={24}/>
                        </button>
                    </div>
                    <AppBrandingAndTheme />
                    <NavigationSearch />
                    <ProfileSummaryDisplay />
                    <ExpertiseTags />
                    <GroupAffiliations />
                    <div className="mt-auto pt-6">
                        <p className="text-xs text-[var(--page-text-secondary)] text-center">&copy; {new Date().getFullYear()} Platform Hub. All rights reserved.</p>
                    </div>
                </aside>
                <div onClick={toggleMobileLeftSidebar} className="flex-1 bg-black/50"></div> 
            </div>
        )}
        
        <aside className="w-[24%] max-w-sm bg-[var(--card-bg)] p-5 border-r border-[var(--border-color-primary)] flex-shrink-0 hidden md:flex flex-col space-y-3 h-full overflow-y-auto shadow-xl scrollbar-thin scrollbar-thumb-[var(--scrollbar-thumb)] scrollbar-track-[var(--scrollbar-track)]">
          <AppBrandingAndTheme />
          
          <NavigationSearch />
          <ProfileSummaryDisplay />
          <ExpertiseTags />
          <GroupAffiliations />
          <div className="mt-auto pt-6">
            <p className="text-xs text-[var(--page-text-secondary)] text-center">&copy; {new Date().getFullYear()} Platform Hub. All rights reserved.</p>
          </div>
        </aside>

        
        <main className="flex-1 bg-[var(--page-bg)] p-6 md:p-8 lg:p-10 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--scrollbar-thumb)] scrollbar-track-[var(--scrollbar-track)] pt-20 md:pt-8 lg:pt-10">
          <UserStoriesGallery onStoryClick={openStoryViewer} />
          <CreateNewPostWidget onPostSubmit={addNewPostToFeed} />
          <div className="mt-6">
            {feedPosts.length > 0 ? (
                feedPosts.map(post => (
                    <FeedItemDisplay key={post.id} post={post} />
                ))
            ) : (
              <div className="text-center py-12 bg-[var(--card-bg)] rounded-xl shadow-md">
                <ImageIcon size={48} className="mx-auto text-[var(--page-text-secondary)] mb-4" />
                <h3 className="text-xl font-semibold text-[var(--page-text-primary)] mb-2 font-[var(--font-heading)]">No Posts Yet</h3>
                <p className="text-[var(--page-text-secondary)]">Be the first to share something or check back later!</p>
              </div>
            )}
          </div>
        </main>

        
        {isMobileRightSidebarOpen && (
            <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
                <div onClick={toggleMobileRightSidebar} className="flex-1 bg-black/50"></div> 
                <aside className="w-3/4 max-w-xs bg-[var(--card-bg)] p-5 border-l border-[var(--border-color-primary)] flex flex-col space-y-0 h-full overflow-y-auto shadow-xl">
                     <div className="flex justify-start mb-2">
                        <button onClick={toggleMobileRightSidebar} className="p-2 text-[var(--page-text-primary)] hover:bg-[var(--card-bg-hover)] rounded-full">
                            <X size={24}/>
                        </button>
                    </div>
                    <UserAccountWidget />
                    <div className="flex-1 bg-[var(--card-bg)] rounded-b-xl p-4 pt-0 text-[var(--page-text-secondary)] font-[var(--font-heading)] shadow-none mt-0 border-t-0">
                        <h3 className="text-sm font-semibold my-3 text-center text-[var(--page-text-primary)] sticky top-0 bg-[var(--card-bg)] py-2 -mx-4 px-4 border-b border-[var(--border-color-primary)]">Recent Activity</h3>
                        <RecentActivitiesManager />
                    </div>
                </aside>
            </div>
        )}
        
        <aside className="w-[22%] max-w-xs bg-[var(--card-bg)] p-5 border-l border-[var(--border-color-primary)] flex-shrink-0 hidden lg:flex flex-col space-y-0 h-full overflow-y-auto shadow-xl scrollbar-thin scrollbar-thumb-[var(--scrollbar-thumb)] scrollbar-track-[var(--scrollbar-track)]">
          <UserAccountWidget />
          
           <div className="flex-1 bg-[var(--card-bg)] rounded-b-xl p-4 pt-0 text-[var(--page-text-secondary)] font-[var(--font-heading)] shadow-none mt-0 border-t-0">
            <h3 className="text-sm font-semibold my-3 text-center text-[var(--page-text-primary)] sticky top-0 bg-[var(--card-bg)] py-2 -mx-4 px-4 border-b border-[var(--border-color-primary)]">Recent Activity</h3>
            <RecentActivitiesManager />
          </div>
        </aside>
      </div>
      {isStoryViewerOpen && viewingStory && (
        <StoryViewer 
            story={viewingStory} 
            onClose={closeStoryViewer} 
            onNext={playNextStory} 
        />
      )}
    </div>
  );
};

const CreatorPlatformPage = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      
      <div className={`${playfairDisplay.variable} ${merriweather.variable}`}> 
        <GlobalThemeStyles />
        <PlatformClientView />
      </div>
    </ThemeProvider>
  );
};

const GlobalThemeStyles = () => (
  <style jsx global>{`
    :root {
      /* Base Page */
      --page-bg: #ffffff; /* Light: White */
      --page-text-primary: #18181b; /* Light: Zinc 900 */
      --page-text-secondary: #52525b; /* Light: Zinc 600 */
      --page-text-tertiary: #71717a; /* Light: Zinc 500 - For timestamps etc. */
      --border-color-primary: #e4e4e7; /* Light: Zinc 200 */
      --border-color-secondary: #d4d4d8; /* Light: Zinc 300 */

      /* Cards & Interactive Elements */
      --card-bg: #f4f4f5; /* Light: Zinc 100 */
      --card-bg-hover: #e4e4e7; /* Light: Zinc 200 */
      --input-bg: #ffffff; /* Light: White */
      --input-text: #18181b; /* Light: Zinc 900 */
      --input-placeholder: #a1a1aa; /* Light: Zinc 400 */
      --button-bg: #e4e4e7; /* Light: Zinc 200 */
      --button-bg-hover: #d4d4d8; /* Light: Zinc 300 */
      --button-text: #18181b; /* Light: Zinc 900 */

      /* Accent Colors */
      --accent-primary: #f59e0b; /* Light: Amber 500 */
      --accent-primary-hover: #d97706; /* Light: Amber 600 */
      --accent-text-on-primary: #ffffff; /* Text on accent */

      /* Specific UI Elements from Design */
      --profile-avatar-bg: #e4e4e7; /* Light: Zinc 200 */
      --profile-avatar-border: #ffffff; /* Light: White */
      --brand-logo-bg: var(--accent-primary);
      --brand-logo-text: var(--accent-text-on-primary);

      /* Scrollbar - Light Theme */
      --scrollbar-thumb: #a1a1aa; /* zinc-400 */
      --scrollbar-track: #f4f4f5; /* zinc-100 */

      /* Fonts - UPDATED TO USE NEXT/FONT VARIABLES */
      --font-heading: var(--font-playfair-display), serif;
      --font-body: var(--font-merriweather), sans-serif;

      /* Icon Specific Colors - Light Theme */
      --icon-color-photo: #22c55e; /* Tailwind green-500 */
      --icon-color-video: #0ea5e9; /* Tailwind sky-500 */
      --icon-color-poll: #ef4444;  /* Tailwind red-500 */
      --icon-color-verified: #0ea5e9; /* Tailwind sky-500 */
      --icon-color-verified-fill: #0ea5e9; /* Tailwind sky-500 */
      --icon-color-comment-action: #0ea5e9; /* Tailwind sky-500 */
      --icon-color-share-action: #22c55e; /* Tailwind green-500 */

      /* Activity Feed Polish - Light Theme */
      --avatar-verified-badge-bg: #facc15; /* Yellow-400 for the check on avatar */
      --avatar-verified-badge-icon-color: #18181b; /* Darker icon for contrast on yellow */
      --button-thanked-bg: #52525b; /* Zinc-600 for thanked button */
      --button-thanked-text: #e4e4e7; /* Zinc-200 for thanked text */
      --button-discard-bg: var(--button-thanked-bg); /* Same as thanked for discard */
      --button-discard-text: var(--button-thanked-text);

      /* NEW Notification Colors - Light Theme */
      --notification-unread-bg: #fee2e2; /* Light Red 100 for unread */
      --notification-unread-bg-hover: #fecaca; /* Light Red 200 for unread hover */
    }

    html.dark {
      /* Base Page */
      --page-bg: #18181b; /* Dark: Zinc 900 */
      --page-text-primary: #f4f4f5; /* Dark: Zinc 100 */
      --page-text-secondary: #a1a1aa; /* Dark: Zinc 400 */
      --page-text-tertiary: #71717a; /* Dark: Zinc 500 - For timestamps etc. */
      --border-color-primary: #3f3f46; /* Dark: Zinc 700 */
      --border-color-secondary: #52525b; /* Dark: Zinc 600 */

      /* Cards & Interactive Elements */
      --card-bg: #27272a; /* Dark: Zinc 800 */
      --card-bg-hover: #3f3f46; /* Dark: Zinc 700 */
      --input-bg: #3f3f46; /* Dark: Zinc 700 */
      --input-text: #f4f4f5; /* Dark: Zinc 100 */
      --input-placeholder: #71717a; /* Dark: Zinc 500 */
      --button-bg: #3f3f46; /* Dark: Zinc 700 */
      --button-bg-hover: #52525b; /* Dark: Zinc 600 */
      --button-text: #f4f4f5; /* Dark: Zinc 100 */

      /* Accent Colors */
      --accent-primary: #facc15; /* Dark: Yellow 400 */
      --accent-primary-hover: #eab308; /* Dark: Yellow 500 */
      --accent-text-on-primary: #18181b; /* Text on accent (darker for contrast on yellow) */
      
      /* Specific UI Elements from Design */
      --profile-avatar-bg: #3f3f46; /* Dark: Zinc 700 */
      --profile-avatar-border: var(--card-bg); /* Dark: Matches card background */
      --brand-logo-bg: var(--accent-primary);
      --brand-logo-text: var(--accent-text-on-primary);

      /* Scrollbar - Dark Theme */
      --scrollbar-thumb: #52525b; /* zinc-600 */
      --scrollbar-track: #27272a; /* zinc-800 */

      /* Icon Specific Colors - Dark Theme (same as light for now for emphasis) */
      --icon-color-photo: #22c55e;
      --icon-color-video: #0ea5e9;
      --icon-color-poll: #ef4444;
      --icon-color-verified: #0ea5e9;
      --icon-color-verified-fill: #0ea5e9;
      --icon-color-comment-action: #0ea5e9;
      --icon-color-share-action: #22c55e;

      /* Activity Feed Polish - Dark Theme */
      --avatar-verified-badge-bg: #facc15; 
      --avatar-verified-badge-icon-color: #18181b;
      --button-thanked-bg: #3f3f46; /* Zinc-700 for thanked button in dark */
      --button-thanked-text: #d4d4d8; /* Zinc-300 for thanked text in dark */
      --button-discard-bg: var(--button-thanked-bg);
      --button-discard-text: var(--button-thanked-text);

      /* NEW Notification Colors - Dark Theme */
      --notification-unread-bg: #57272a; /* Darker Red-ish for unread (tailwind red-900 with some transparency or mix) */
      --notification-unread-bg-hover: #6b2f31; /* Darker Red-ish hover */
    }

    body {
      background-color: var(--page-bg);
      color: var(--page-text-primary);
      font-family: var(--font-body);
    }
    
    h1, h2, h3, h4, h5, h6 {
        font-family: var(--font-heading);
    }

    /* Custom scrollbar styles using CSS variables */
    /* For Webkit browsers */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    ::-webkit-scrollbar-track {
      background: var(--scrollbar-track);
      border-radius: 10px;
    }
    ::-webkit-scrollbar-thumb {
      background: var(--scrollbar-thumb);
      border-radius: 10px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: color-mix(in srgb, var(--scrollbar-thumb) 70%, black);
    }

    /* For Firefox - Note: scrollbar-color on html or body is often better */
    html {
      scrollbar-width: thin;
      scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
    }
  `}</style>
);

// --- NEW: Schedule Post Modal Component ---
interface SchedulePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirmSchedule: (dateTime: Date) => void;
    postContentPreview?: string;
}

const SchedulePostModal = ({ isOpen, onClose, onConfirmSchedule, postContentPreview }: SchedulePostModalProps) => {
    const [selectedDateTime, setSelectedDateTime] = useState<string>('');
   
    const [modalError, setModalError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setModalError(null);
            const now = new Date();
            now.setHours(now.getHours() + 1);
            const year = now.getFullYear();
            const month = (now.getMonth() + 1).toString().padStart(2, '0');
            const day = now.getDate().toString().padStart(2, '0');
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            setSelectedDateTime(`${year}-${month}-${day}T${hours}:${minutes}`);
        } else {
            setSelectedDateTime('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = () => {
        setModalError(null);
        if (!selectedDateTime) {
           
            setModalError("Please select a date and time.");
            return;
        }
        const dateObject = new Date(selectedDateTime);
        if (dateObject <= new Date()) {
           
            setModalError("Please select a future date and time. Scheduling for past dates is not allowed.");
            return;
        }
        onConfirmSchedule(dateObject);
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4 animate-in fade-in-0">
            <div className="bg-[var(--card-bg)] p-6 rounded-xl shadow-2xl w-full max-w-md flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-[var(--page-text-primary)] font-[var(--font-heading)]">Schedule Post</h3>
                    <button onClick={onClose} className="p-1.5 text-[var(--page-text-secondary)] hover:text-[var(--page-text-primary)] rounded-full hover:bg-[var(--card-bg-hover)] cursor-pointer">
                        <X size={20} />
                    </button>
                </div>

                {postContentPreview && (
                    <div className="text-xs p-2.5 border border-[var(--border-color-secondary)] rounded-md bg-[var(--page-bg)]">
                        <p className="text-[var(--page-text-secondary)] mb-1">Post content:</p>
                        <p className="text-[var(--page-text-primary)] line-clamp-2">{postContentPreview}</p>
                    </div>
                )}

                <div>
                    <label htmlFor="scheduleDateTime" className="block text-sm font-medium text-[var(--page-text-secondary)] mb-1">Select date and time:</label>
                    <input 
                        type="datetime-local"
                        id="scheduleDateTime"
                        value={selectedDateTime}
                        onChange={(e) => setSelectedDateTime(e.target.value)}
                        className="w-full bg-[var(--input-bg)] border border-[var(--border-color-secondary)] text-[var(--input-text)] placeholder-[var(--input-placeholder)] text-sm rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                    />
                </div>

                
                {modalError && (
                    <div className="p-2.5 text-xs text-red-700 bg-red-100 border border-red-300 rounded-lg dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/50">
                        {modalError}
                    </div>
                )}

                <div className="flex justify-end space-x-3 pt-2">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--button-bg)] text-[var(--button-text)] hover:bg-[var(--button-bg-hover)] transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSubmit}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--accent-primary)] text-[var(--accent-text-on-primary)] hover:bg-[var(--accent-primary-hover)] transition-colors cursor-pointer"
                    >
                        Confirm Schedule
                    </button>
                </div>
            </div>
        </div>
    );
};
// --- END Schedule Post Modal Component ---

export default CreatorPlatformPage;
