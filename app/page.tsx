"use client";

import { useState, useEffect, ComponentType, ReactNode, useRef } from 'react';
import { ThemeProvider, useTheme } from 'next-themes';
import { Playfair_Display, Merriweather } from 'next/font/google';
import { 
    Sun, Moon, Search, UserCircle2,  MoreVertical, 
    PlusCircle, ThumbsUp, MessageSquareText, Send, ImageUp, VideoIcon, ListChecks, CalendarClock, UsersRound, AtSign, Settings2, LogOut, ChevronDown, ArrowRightFromLine,
    Bell, CheckCircle2, ImageIcon,
    Edit3, Trash2, Link2, Code2, Flag,
    User, Settings, Briefcase, UserPlus, UserCheck, HandCoins, Info, X,
    MessageCircle,
    Menu,
    Tv2, BookOpen, Camera, Bookmark, ListFilter 
} from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';


const renderContentWithStyledHashtags = (text: string): ReactNode[] => {
  if (!text) return [];
  const parts = text.split(/(#\w+)/g); 
  return parts.map((part, index) => {
    if (/(#\w+)/.test(part)) {
      return (
        <span 
          key={index} 
          className="text-[var(--accent-primary)] hover:underline cursor-pointer"
          onClick={() => console.log(`Hashtag clicked: ${part}`)} 
        >
          {part}
        </span>
      );
    }
    return part;
  });
};

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


const peopleImageUrls = [
    "https://images.unsplash.com/photo-1695800998493-ccff5ea292ea?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1675388545634-83d816322c83?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1697510364485-e900c2fe7524?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1708034678252-ce866ca93b5d?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1697715841744-9c24df04dacc?q=80&w=3198&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1708034677699-6f39d9c59f6e?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1668293750324-bd77c1f08ca9?q=80&w=2304&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1713766056256-9cb07ceda9e5?q=80&w=3007&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1641391503184-a2131018701b?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1747069334505-cf6815248cfe?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1742201949705-220268ad4467?q=80&w=3164&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1741736000642-781f7a0a75c1?q=80&w=2273&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
];


const platformCurrentUser = {
    name: "Kenji Tanaka",
    handle: "kenji_jp",
    avatarUrl: peopleImageUrls[0], 
    isAuthor: true, 
    isVerified: true
};


const sampleFeedData: FeedPostData[] = [
    {
        id: 'post1',
        author: {
            name: 'Aya Suzuki',
            handle: 'ayas_art',
            avatarUrl: peopleImageUrls[2 % peopleImageUrls.length], 
            isVerified: true,
            isAuthor: false,
            status: "Sketching new #ChainsawMan piece!", 
        },
        timestamp: '3h ago',
        content: "Just finished this piece of Yuji Itadori from #JujutsuKaisen! What do you all think? Always looking for feedback. ✨ #FanArt #AnimeArt #Illustration",
        mediaUrl: "https://images.unsplash.com/photo-1613376023733-0a73315d9b06?q=80&w=2800&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
        mediaType: 'image',
        stats: { likes: 182, comments: 22 },
        comments: [
            { id: 'cmt1-1', authorName: platformCurrentUser.name, avatarUrl: platformCurrentUser.avatarUrl, text: 'This is incredible, Aya-san! The colors are amazing.', timestamp: '2h ago' }, 
            { id: 'cmt1-2', authorName: 'Rina_chan', avatarUrl: peopleImageUrls[4 % peopleImageUrls.length], text: 'So talented! 🔥 Love your style!', timestamp: '1h ago' }, 
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
            status: "Planning next trip to Kyoto! 🌸", 
        },
        timestamp: '1d ago',
        content: "Just got back from an awesome haul in Akihabara! 🛍️ Found some rare retro games and cool new Gunpla. What are your must-visit shops there? #Akihabara #TokyoFinds #GamingHeaven #Gunpla",
        mediaUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
        mediaType: 'image',
        stats: { likes: 310, comments: 58 },
        comments: [
             { id: 'cmt2-1', authorName: 'Hiro_Games', avatarUrl: peopleImageUrls[5 % peopleImageUrls.length], text: 'Nice haul, Kenji-san! You gotta check out Super Potato next time for retro stuff!', timestamp: '23h ago' }, 
             { id: 'cmt2-2', authorName: 'Mei_ko', avatarUrl: peopleImageUrls[6 % peopleImageUrls.length], text: 'Akiba is the best! I always spend too much at the Gachapon halls. 😂', timestamp: '22h ago' }, 
        ]
    },
    {
        id: 'post3',
        author: {
            name: 'Hiroshi Plays',
            handle: 'hiro_games',
            avatarUrl: peopleImageUrls[7 % peopleImageUrls.length], 
            isAuthor: false,
            isVerified: true,
            status: "Level grinding in 'Chronos Odyssey'! ⚔️", 
        },
        timestamp: '2d ago',
        content: "Just sank another 50 hours into the new 'Tales of Fantasia Rebirth' JRPG. The story is captivating! Anyone else playing it? No spoilers! #JRPG #GamingJP #NewRelease #FantasyRPG",
        mediaUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2942&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
        mediaType: 'image', 
        stats: { likes: 215, comments: 33 },
        comments: [
            { id: 'cmt3-1', authorName: 'AkiNetGamer', avatarUrl: peopleImageUrls[8 % peopleImageUrls.length], text: 'On my list! Heard good things about the combat system.', timestamp: '1d ago' },
            { id: 'cmt3-2', authorName: platformCurrentUser.name, avatarUrl: platformCurrentUser.avatarUrl, text: 'Downloading it tonight! Thanks for the recommendation, Hiroshi-san!', timestamp: '1d ago' },
        ]
    },
    {
        id: 'post4',
        author: {
            name: 'RamenLover Taro',
            handle: 'TaroEatsRamen',
            avatarUrl: peopleImageUrls[9 % peopleImageUrls.length],
            isVerified: false,
            isAuthor: false,
            status: "Searching for the ultimate Tonkotsu... 🍜", 
        },
        timestamp: '4d ago',
        content: "What's the undisputed KING of ramen toppings? 🍜 Let your voice be heard! #RamenWars #JapaneseFood #PollTime #FoodieJP",
        mediaType: 'poll',
        pollOptions: ["Chashu (Braised Pork)", "Ajitama (Seasoned Egg)", "Nori (Seaweed)", "Menma (Bamboo Shoots)"],
        initialVotes: [120, 95, 60, 45], 
        stats: { likes: 150, comments: 75 }, 
        comments: [
            { id: 'cmt4-1', authorName: 'SushiSasha', avatarUrl: peopleImageUrls[10 % peopleImageUrls.length], text: 'Ajitama for the win! That creamy yolk... 🤤', timestamp: '3d ago' },
            { id: 'cmt4-2', authorName: 'Kenji_jp', avatarUrl: platformCurrentUser.avatarUrl, text: 'Chashu all the way! More meat!', timestamp: '3d ago' },
        ]
    }
];



const mockHashtags = [
  '#Anime', '#Manga', '#JRPG', '#VisualNovel', '#LightNovel',
  '#Sushi', '#Ramen', '#Takoyaki', '#Matcha',
  '#JPop', '#JRock', '#CityPop',
  '#Tokyo', '#Kyoto', '#Osaka', '#Hokkaido',
  '#Cosplay', '#FanArt', '#Figurines', '#Gunpla',
  '#StudioGhibli', '#Shonen', '#Shojo', '#Isekai', '#SliceOfLife',
  '#GamingJP', '#IndieJP', '#RetroGamingJP',
  '#HarajukuFashion', '#Kimono', '#StreetwearJP',
  '#TravelJapan', '#LearnJapanese', '#SakuraSeason'
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
        description: 'Rina_chan started following you.', 
        timestamp: '5m ago',
        isRead: false,
        performerAvatarUrl: peopleImageUrls[1 % peopleImageUrls.length]
    },
    {
        id: 'notif2',
        icon: ThumbsUp,
        iconColorClass: 'text-rose-500',
        title: 'Post Liked',
        description: "Takeshi_san liked your post: 'Top 5 Spring Anime Debuts'.", 
        timestamp: '30m ago',
        isRead: false,
        performerAvatarUrl: peopleImageUrls[2 % peopleImageUrls.length]
    },
    {
        id: 'notif3',
        icon: MessageCircle, 
        iconColorClass: 'text-green-500',
        title: 'New Comment',
        description: "Mei_ko commented on your 'Hidden Gem JRPGs' list: 'Totally agree with #3!'", 
        timestamp: '1h ago',
        isRead: true,
        performerAvatarUrl: peopleImageUrls[3 % peopleImageUrls.length]
    },
    {
        id: 'notif4',
        icon: Info,
        iconColorClass: 'text-amber-500',
        title: 'System Update',
        description: 'Platform maintenance scheduled for tonight at 2 AM JST.', 
        timestamp: '3h ago',
        isRead: true,
    },
];

const NotificationEntry = ({ notification }: { notification: NotificationItemData }) => (
    <DropdownMenu.Item 
        onSelect={() => console.log(`Viewing notification: "${notification.title}"`)}
        className={`flex items-start space-x-3 px-3 py-2.5 text-sm outline-none transition-colors cursor-pointer w-full 
                    ${notification.isRead ? 'text-[var(--page-text-secondary)] hover:bg-[var(--card-bg-hover)]' : 'text-[var(--page-text-primary)] bg-[var(--notification-unread-bg)] hover:bg-[var(--notification-unread-bg-hover)]'}`}
    >
        {notification.performerAvatarUrl ? (
            <img src={notification.performerAvatarUrl} alt={notification.title} className="w-8 h-8 rounded-2xl object-cover mt-0.5 flex-shrink-0" />
        ) : (
            <div className={`w-8 h-8 rounded-2xl bg-[var(--profile-avatar-bg)] flex items-center justify-center flex-shrink-0 mt-0.5 ${notification.iconColorClass || 'text-[var(--page-text-secondary)]'}`}>
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
        console.log('Performing "Mark all notifications as read"');
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
                        onSelect={() => console.log("Redirecting to 'All Notifications' page")}
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
  <div className="flex items-center space-x-3 mb-6">
    <div className="w-10 h-10 bg-[var(--brand-logo-bg)] rounded-lg flex items-center justify-center text-[var(--brand-logo-text)] shadow-md flex-shrink-0">
      <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
        <path d="M20 4H4C3.44772 4 3 4.44772 3 5V6H21V5C21 4.44772 20.5523 4 20 4Z" />
        <path d="M18 7H6C5.44772 7 5 7.44772 5 8V20H7V14H17V20H19V8C19 7.44772 18.5523 7 18 7ZM12 8V11H12.01V8H12Z" />
        <path d="M4 7H2V20H4V7Z" />
        <path d="M20 7H22V20H20V7Z" />
      </svg>
    </div>
    <div className="flex-grow min-w-0">
      <NavigationSearch />
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
    setSearchTerm(hashtag); 
    setIsDropdownOpen(false);
    setFilteredHashtags([]);
  };

  return (
    <div className="relative">
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
              className="px-4 py-2.5 text-sm text-[var(--page-text-primary)] hover:bg-[var(--card-bg-hover)] cursor-pointer transition-colors group"
            >
              <span className="text-[var(--accent-primary)] group-hover:underline">{tag}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ProfileSummaryDisplay = () => (
  <div className="bg-[var(--card-bg)] rounded-xl mb-6 shadow-lg">
    <div 
      className="h-28 w-full bg-cover bg-center rounded-t-xl" 
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519638399535-1b036603ac77?q=80&w=3131&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
    >

    </div>

    <div className="p-5">
      <div className="w-24 h-24 rounded-2xl bg-[var(--profile-avatar-bg)] border-4 border-[var(--card-bg)] flex items-center justify-center shadow-xl overflow-hidden mx-auto -mt-16 mb-4">
           {platformCurrentUser.avatarUrl ? (
              <img src={platformCurrentUser.avatarUrl} alt={platformCurrentUser.name} className="w-full h-full object-cover" />
           ) : (
              <UserCircle2 size={56} className="text-[var(--page-text-secondary)]" />
           )}
      </div>
      <div className="text-center">
          <h2 className="text-xl font-[var(--font-heading)] font-semibold text-[var(--page-text-primary)]">{platformCurrentUser.name}</h2>
          <p className="text-xs text-[var(--accent-primary)] mb-2">@{platformCurrentUser.handle}</p>
          <div className="flex justify-center space-x-6 my-4">
            <div>
                <p className="text-lg font-semibold text-[var(--page-text-primary)]">789</p>
                <p className="text-xs text-[var(--page-text-secondary)]">Followers</p>
            </div>
            <div>
                <p className="text-lg font-semibold text-[var(--page-text-primary)]">321</p>
                <p className="text-xs text-[var(--page-text-secondary)]">Following</p>
            </div>
          </div>
          <p className="text-sm text-[var(--page-text-secondary)] leading-relaxed my-4 px-2">
              🇯🇵 Avid anime watcher & manga reader. Exploring the best of Japan! Currently diving into <em>One Piece</em>.
          </p>
          <button 
              onClick={() => console.log("Redirecting to 'My Profile' page")}
              className="w-full bg-[var(--button-bg)] hover:bg-[var(--button-bg-hover)] text-[var(--button-text)] font-medium py-2.5 px-4 rounded-lg text-sm transition-colors duration-200 cursor-pointer shadow-sm hover:shadow-md">
              View Profile
          </button>
      </div>
    </div>
  </div>
);

const UserInterestsDisplay = () => { 
    const userInterestsList = ["Shonen", "Slice of Life", "J-RPG", "Visual Novels", "Sushi Making", "Harajuku Style", "City Pop"]; 
    return (
        <div className="mb-6">
            <h3 className="text-xs font-semibold text-[var(--page-text-secondary)] uppercase tracking-wider mb-3 font-[var(--font-heading)]">Interests</h3> 
            <div className="flex flex-wrap gap-2">
                {userInterestsList.map(interestItem => (
                    <span 
                        key={interestItem} 
                        onClick={() => console.log(`Filtering by interest: '${interestItem}'`)}
                        className="bg-[var(--button-bg)] text-[var(--button-text)] text-xs px-3 py-1.5 rounded-full cursor-pointer hover:bg-[var(--button-bg-hover)] transition-colors duration-150 shadow-sm">
                        {interestItem}
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
        { id:1, name: "Anime Watch Club", members: 32, icon: <Tv2 size={22} className="text-[var(--accent-primary)]" /> }, 
        { id:2, name: "Manga Readers Unite", members: 12, icon: <BookOpen size={22} className="text-emerald-500" /> }, 
        { id:3, name: "Tokyo Street Snaps", members: 45, icon: <Camera size={22} className="text-blue-500" /> }, 
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
                        onClick={() => console.log(`Redirecting to community: '${communityItem.name}'`)}
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
    
    
    const previewUrlRefForCleanup = useRef<string | null>(null);
    
    const successfullySubmittedUrlRef = useRef<string | null>(null);

    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [postDetailsToSchedule, setPostDetailsToSchedule] = useState<Omit<Parameters<CreatePostWidgetProps['onPostSubmit']>[0], 'timestamp'> | null>(null);

   
    const [formError, setFormError] = useState<string | null>(null);
    const [formSuccess, setFormSuccess] = useState<string | null>(null);

    useEffect(() => {
       
       previewUrlRefForCleanup.current = previewUrl;
    }, [previewUrl]);

    useEffect(() => {
       
        return () => {
            
            if (previewUrlRefForCleanup.current && previewUrlRefForCleanup.current !== successfullySubmittedUrlRef.current) {
                URL.revokeObjectURL(previewUrlRefForCleanup.current);
                console.log("CreateNewPostWidget unmount: Revoked (unsubmitted) preview URL:", previewUrlRefForCleanup.current);
            } else if (previewUrlRefForCleanup.current && previewUrlRefForCleanup.current === successfullySubmittedUrlRef.current) {
                console.log("CreateNewPostWidget unmount: Preview URL was submitted, NOT revoking:", previewUrlRefForCleanup.current);
            }
            
            previewUrlRefForCleanup.current = null;
            successfullySubmittedUrlRef.current = null; 
        };
    }, []); 

   
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
        
        const urlToRevoke = previewUrlRefForCleanup.current; 
        if (urlToRevoke && urlToRevoke !== successfullySubmittedUrlRef.current) {
            URL.revokeObjectURL(urlToRevoke);
            console.log("CreateNewPostWidget.resetMediaState: Revoked (unsubmitted) preview URL:", urlToRevoke);
        } else if (urlToRevoke && urlToRevoke === successfullySubmittedUrlRef.current) {
            console.log("CreateNewPostWidget.resetMediaState: Preview URL was submitted, NOT revoking:", urlToRevoke);
        }
        setPreviewUrl(null); 

        if (imageInputRef.current) imageInputRef.current.value = '';
        if (videoInputRef.current) videoInputRef.current.value = '';
        
    };

    const triggerImageUpload = () => {
        imageInputRef.current?.click();
    };

    const triggerVideoUpload = () => {
        videoInputRef.current?.click();
    };
    
    const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        
        const oldUrlToRevoke = previewUrlRefForCleanup.current;
        if (oldUrlToRevoke && oldUrlToRevoke !== successfullySubmittedUrlRef.current) {
            URL.revokeObjectURL(oldUrlToRevoke);
            console.log("CreateNewPostWidget.handleFileSelection: Revoked old preview URL from state:", oldUrlToRevoke);
        }
        
        setPreviewUrl(null); 
        setSelectedFile(null); 

        if (file) {
            setSelectedFile(file);
            const newObjectUrl = URL.createObjectURL(file);
            setPreviewUrl(newObjectUrl); 
            console.log("CreateNewPostWidget.handleFileSelection: Created new preview URL:", newObjectUrl);
        } else {
            
        }
        
        if (event.target) {
            event.target.value = '';
        }
    };

    const selectPostTypeOption = (newPostType: 'photo' | 'video' | 'poll') => {
        setFormError(null);

        if (selectedPostType === newPostType && (newPostType === 'photo' || newPostType === 'video')) {
            setSelectedPostType('text');
            resetMediaState(); 
            setPollOptions(['', '']); 
            return;
        }
        
        if (selectedPostType === newPostType && newPostType === 'poll') {
            return; 
        }
        
        resetMediaState(); 
        
        if (newPostType !== 'poll') {
            setPollOptions(['', '']);
        }

        setSelectedPostType(newPostType);

        if (newPostType === 'photo') {
            triggerImageUpload();
        } else if (newPostType === 'video') {
            triggerVideoUpload();
        } else if (newPostType === 'poll') {
            setPollOptions(['', '']); 
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

        let blobUrlPassedToSubmit: string | undefined = undefined;

        if (selectedPostType === 'photo' && selectedFile && previewUrl) {
            postDetails.mediaUrl = previewUrl; 
            postDetails.mediaType = 'image';
            blobUrlPassedToSubmit = previewUrl;
        } else if (selectedPostType === 'video' && selectedFile && previewUrl) {
            postDetails.mediaUrl = previewUrl; 
            postDetails.mediaType = 'video';
            blobUrlPassedToSubmit = previewUrl;
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
        
        
        if (blobUrlPassedToSubmit) {
            successfullySubmittedUrlRef.current = blobUrlPassedToSubmit;
            console.log("Post submitted with media URL, marked to NOT be revoked by CreateNewPostWidget unmount:", blobUrlPassedToSubmit);
        }

        setPostText('');
        setSelectedPostType('text');
        setSelectedFile(null);
        setPreviewUrl(null); 
        setPollOptions(['', '']);
        
        if (imageInputRef.current) imageInputRef.current.value = '';
        if (videoInputRef.current) videoInputRef.current.value = '';
    };

    const handleSchedule = () => {
        setFormError(null);
        setFormSuccess(null);

        let currentPostDetails: Omit<Parameters<CreatePostWidgetProps['onPostSubmit']>[0], 'timestamp'> = {
            content: postText,
        };

        let blobUrlPassedToSchedule: string | undefined = undefined;

        if (selectedPostType === 'photo' && selectedFile && previewUrl) {
            currentPostDetails.mediaUrl = previewUrl; 
            currentPostDetails.mediaType = 'image';
            blobUrlPassedToSchedule = previewUrl;
        } else if (selectedPostType === 'video' && selectedFile && previewUrl) {
            currentPostDetails.mediaUrl = previewUrl; 
            currentPostDetails.mediaType = 'video';
            blobUrlPassedToSchedule = previewUrl;
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
            
            
            if (postDetailsToSchedule.mediaUrl && (postDetailsToSchedule.mediaType === 'image' || postDetailsToSchedule.mediaType === 'video')) {
                successfullySubmittedUrlRef.current = postDetailsToSchedule.mediaUrl;
                 console.log("Post scheduled with media URL, marked to NOT be revoked by CreateNewPostWidget unmount:", postDetailsToSchedule.mediaUrl);
            }

            setPostText('');
            setSelectedPostType('text');
            setSelectedFile(null);
            setPreviewUrl(null); 
            setPollOptions(['', '']);
            setPostDetailsToSchedule(null);
            
            if (imageInputRef.current) imageInputRef.current.value = '';
            if (videoInputRef.current) videoInputRef.current.value = '';
        }
        setIsScheduleModalOpen(false);
    };

    return (
        <div className="bg-[var(--card-bg)] p-4 sm:p-5 rounded-xl mb-8 shadow-md">
            
            <input 
                type="file" 
                ref={imageInputRef} 
                onChange={handleFileSelection} 
                accept="image/*" 
                className="hidden" 
            />
            <input 
                type="file" 
                ref={videoInputRef} 
                onChange={handleFileSelection} 
                accept="video/*" 
                className="hidden" 
            />

            <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[var(--profile-avatar-bg)] flex items-center justify-center mt-0.5 overflow-hidden">
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
    status?: string; 
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

    
    const [isLiked, setIsLiked] = useState(false);
    const [currentLikes, setCurrentLikes] = useState(post.stats?.likes || 0);

   
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

    const handleLikeToggle = () => {
        if (isLiked) {
            setCurrentLikes(prevLikes => prevLikes - 1);
        } else {
            setCurrentLikes(prevLikes => prevLikes + 1);
        }
        setIsLiked(prevIsLiked => !prevIsLiked);
    };

    const handleShareAction = async () => {
        const shareData = {
            title: `Check out this post by ${post.author.name}`,
            text: post.content.substring(0, 100) + (post.content.length > 100 ? '...' : ''), 
            url: window.location.href, 
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
                console.log('Post shared successfully via native share!');
            } catch (error) {
                console.error('Error using native share:', error);
            }
        } else {
            
            try {
                await navigator.clipboard.writeText(shareData.url);
                console.log('Native share not available. Link copied to clipboard!');
                
            } catch (error) {
                console.error('Failed to copy link to clipboard:', error);
                console.log('Native share not available and failed to copy link.');
            }
        }
    };

    return (
        <div className="bg-[var(--card-bg)] rounded-xl p-4 sm:p-5 shadow-md mb-6">
            
            <div className="flex items-start space-x-3 mb-3">
                <div className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[var(--profile-avatar-bg)] flex items-center justify-center overflow-hidden">
                    {post.author.avatarUrl ? (
                        <img src={post.author.avatarUrl} alt={post.author.name} className="w-full h-full object-cover" />
                    ) : (
                        <UserCircle2 size={24} className="text-[var(--page-text-secondary)]" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                        <span className="text-sm sm:text-base font-semibold text-[var(--page-text-primary)] font-[var(--font-heading)] mr-1 truncate">{post.author.name}</span>
                        {post.author.isVerified && <CheckCircle2 size={16} className="fill-[var(--icon-color-verified-fill)] mr-1 flex-shrink-0" />}
                        <span className="text-xs sm:text-sm text-[var(--page-text-secondary)] truncate">@{post.author.handle}</span>
                        <span className="text-xs text-[var(--page-text-secondary)] mx-1.5">•</span>
                        <span className="text-xs text-[var(--page-text-secondary)] flex-shrink-0">{post.timestamp}</span>
                    </div>
                   
                    {post.author.status ? (
                        <p className="text-xs text-[var(--page-text-secondary)] truncate">{post.author.status}</p>
                    ) : (
                        <p className="text-xs text-[var(--page-text-secondary)] truncate">Sharing their latest updates!</p> 
                    )}
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
                                        onSelect={() => console.log("Performing 'Edit post'")}
                                        className="flex items-center space-x-2.5 px-3 py-2 text-sm text-[var(--page-text-primary)] hover:bg-[var(--card-bg-hover)] rounded-md cursor-pointer outline-none transition-colors">
                                        <Edit3 size={16} className="text-[var(--page-text-secondary)]" />
                                        <span>Edit post</span>
                                    </DropdownMenu.Item>
                                    <DropdownMenu.Item 
                                        onSelect={() => console.log("Performing 'Delete post'")}
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
                                            .then(() => console.log("Link copied to clipboard!"))
                                            .catch(err => {
                                                console.error("Failed to copy link: ", err);
                                                console.log("Failed to copy link.");
                                            });
                                    } else {
                                        console.log("Clipboard API not available or no URL found.");
                                    }
                                }}
                                className="flex items-center space-x-2.5 px-3 py-2 text-sm text-[var(--page-text-primary)] hover:bg-[var(--card-bg-hover)] rounded-md cursor-pointer outline-none transition-colors">
                                <Link2 size={16} className="text-[var(--page-text-secondary)]" />
                                <span>Copy link to post</span>
                            </DropdownMenu.Item>
                            <DropdownMenu.Item 
                                onSelect={() => console.log("Performing 'Embed post'")}
                                className="flex items-center space-x-2.5 px-3 py-2 text-sm text-[var(--page-text-primary)] hover:bg-[var(--card-bg-hover)] rounded-md cursor-pointer outline-none transition-colors">
                                <Code2 size={16} className="text-[var(--page-text-secondary)]" />
                                <span>Embed post</span>
                            </DropdownMenu.Item>
                            <DropdownMenu.Separator className="h-px bg-[var(--border-color-primary)] my-1" />
                            <DropdownMenu.Item 
                                onSelect={() => console.log("Performing 'Report post'")}
                                className="flex items-center space-x-2.5 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-md cursor-pointer outline-none transition-colors">
                                <Flag size={16} />
                                <span>Report post</span>
                            </DropdownMenu.Item>
                        </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                </DropdownMenu.Root>
            </div>

            
            <p className="text-sm sm:text-base text-[var(--page-text-primary)] leading-relaxed mb-3 whitespace-pre-wrap">
               
                {renderContentWithStyledHashtags(post.content)}
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
                <button 
                    onClick={handleLikeToggle}
                    className={`flex items-center space-x-1.5 hover:text-[var(--accent-primary)] transition-colors cursor-pointer p-2 -ml-2 ${isLiked ? 'text-[var(--accent-primary)]' : 'text-[var(--page-text-secondary)]'}`}>
                    <ThumbsUp size={18} className={isLiked ? 'fill-[var(--accent-primary)]' : ''} />
                    {currentLikes > 0 && <span className="text-xs font-medium">{currentLikes}</span>}
                </button>
                <button className="flex items-center space-x-1.5 hover:text-[var(--icon-color-comment-action)] transition-colors cursor-pointer p-2">
                    <MessageSquareText size={18} />
                    {post.stats && post.stats.comments > 0 && <span className="text-xs font-medium">{post.stats.comments}</span>}
                </button>
                <button 
                    onClick={handleShareAction}
                    className="p-2 hover:text-[var(--icon-color-share-action)] transition-colors cursor-pointer -mr-2">
                    <Send size={18} />
                </button>
            </div>

            
            {currentComments.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-[var(--border-color-primary)] mb-3">
                    {currentComments.map(comment => (
                        <div key={comment.id} className="flex items-start space-x-2.5 text-xs">
                            <div className="flex-shrink-0 w-7 h-7 rounded-2xl bg-[var(--profile-avatar-bg)] flex items-center justify-center overflow-hidden">
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
                <div className="flex-shrink-0 w-8 h-8 rounded-2xl bg-[var(--profile-avatar-bg)] flex items-center justify-center overflow-hidden">
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
                <button className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[var(--card-bg-hover)] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]">
                    <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-2xl bg-[var(--profile-avatar-bg)] flex items-center justify-center text-[var(--page-text-primary)] font-semibold overflow-hidden">
                            {platformCurrentUser.avatarUrl ? (
                                <img src={platformCurrentUser.avatarUrl} alt={platformCurrentUser.name} className="w-full h-full object-cover" />
                            ) : (
                                <UserCircle2 size={18} className="text-[var(--page-text-secondary)]" />
                            )}
                        </div>
                        <span className="text-xs font-medium text-[var(--page-text-primary)] font-[var(--font-heading)] truncate">{platformCurrentUser.name}</span>
                    </div>
                    <ChevronDown size={16} className="text-[var(--page-text-secondary)]" />
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
                        onSelect={() => console.log("UserAccount: View Profile clicked")} 
                        className="flex items-center space-x-2.5 px-3 py-2 text-sm text-[var(--page-text-primary)] hover:bg-[var(--card-bg-hover)] rounded-md cursor-pointer outline-none transition-colors">
                        <User size={16} className="text-[var(--page-text-secondary)]" />
                        <span>View Profile</span>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item 
                        onSelect={() => console.log("UserAccount: Saved Content clicked")} 
                        className="flex items-center space-x-2.5 px-3 py-2 text-sm text-[var(--page-text-primary)] hover:bg-[var(--card-bg-hover)] rounded-md cursor-pointer outline-none transition-colors">
                        <Bookmark size={16} className="text-[var(--page-text-secondary)]" />
                        <span>Saved Content</span>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item 
                        onSelect={() => console.log("UserAccount: Content Preferences clicked")} 
                        className="flex items-center space-x-2.5 px-3 py-2 text-sm text-[var(--page-text-primary)] hover:bg-[var(--card-bg-hover)] rounded-md cursor-pointer outline-none transition-colors">
                        <ListFilter size={16} className="text-[var(--page-text-secondary)]" />
                        <span>Content Preferences</span>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item 
                        onSelect={() => console.log("UserAccount: Account Settings clicked")} 
                        className="flex items-center space-x-2.5 px-3 py-2 text-sm text-[var(--page-text-primary)] hover:bg-[var(--card-bg-hover)] rounded-md cursor-pointer outline-none transition-colors">
                        <Settings size={16} className="text-[var(--page-text-secondary)]" />
                        <span>Account Settings</span>
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator className="h-px bg-[var(--border-color-primary)] my-1" />
                    <DropdownMenu.Item 
                        onSelect={() => console.log("UserAccount: Logout clicked")} 
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
        console.log(`Encouragement sent to ${item.performer.name} for item ${item.id}`);
    };

    const handleJoinGroupAction = () => {
        setIsJoined(true);
        console.log(`Joined group: ${item.groupName || item.id}`);
    };

    const performerName = <span className="font-semibold text-[var(--page-text-primary)]">{item.performer.name}</span>;
    let activityTextDetails = <></>;

    switch (item.type) {
        case 'subscription': activityTextDetails = <>{performerName} {item.targetText || 'started following your updates'}.</>; break;
        case 'purchase_video': activityTextDetails = <>{performerName} {item.targetText || 'acquired your content'}.</>; break;
        case 'tip_received': activityTextDetails = <>{performerName} {item.targetText || 'sent you an offering'}.</>; break;
        case 'job_request': activityTextDetails = <>{performerName} {item.targetText || 'requested your skills'}.</>; break;
        case 'group_invite': activityTextDetails = <>{item.performer.isGroup ? performerName : "Invitation to join"} {item.groupName || 'group'}.</>; break;
    }

    return (
        <div className="bg-[var(--card-bg)] p-3.5 rounded-lg mb-2.5 shadow-sm">
            <div className="flex items-start space-x-3">
                <div className="relative flex-shrink-0">
                    {item.performer.avatarUrl && !item.performer.isGroup ? (
                        <img src={item.performer.avatarUrl} alt={item.performer.name} className="w-10 h-10 rounded-2xl object-cover" />
                    ) : item.performer.isGroup ? (
                        <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border-2 border-orange-500 flex items-center justify-center">
                            <div className="w-5 h-5 rounded-full bg-orange-500"></div>
                        </div>
                    ) : (
                        <div className="w-10 h-10 rounded-2xl bg-[var(--profile-avatar-bg)] flex items-center justify-center">
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

                </div>
            </div>

            {(item.canBeThanked || item.type === 'group_invite') && (
                <div className="mt-2.5 pl-[52px]"> 
                    {item.canBeThanked && !isThanked && (
                        <button 
                            onClick={handleThankAction}
                            className="text-xs bg-[var(--accent-primary)] text-[var(--accent-text-on-primary)] px-3.5 py-1.5 rounded-full hover:bg-[var(--accent-primary-hover)] transition-colors cursor-pointer font-medium"
                        >
                            Ganbare!
                        </button>
                    )}
                    {item.canBeThanked && isThanked && (
                        <button 
                            disabled
                            className="flex items-center text-xs bg-[var(--button-thanked-bg)] text-[var(--button-thanked-text)] px-3.5 py-1.5 rounded-full cursor-not-allowed font-medium"
                        >
                            <CheckCircle2 size={14} className="mr-1.5" /> Encouraged!
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
            id: 'act2', type: 'tip_received', 
            performer: { name: 'Haru Ito', avatarUrl: peopleImageUrls[3 % peopleImageUrls.length] }, 
            timestamp: '7 hrs ago', 
            targetText: 'created a new poll: "Favorite Studio Ghibli film?"',
            canBeThanked: true
        },
        {
            id: 'act5', type: 'group_invite', 
            performer: { name: 'J-RPG Legends Guild', isGroup: true, isVerifiedOnAvatar: true }, 
            timestamp: '12 hrs ago',
            groupName: 'J-RPG Legends Guild'
        },
        {
            id: 'act1', type: 'subscription', 
            performer: { name: 'Yuki Sato', avatarUrl: peopleImageUrls[2 % peopleImageUrls.length], isVerifiedOnAvatar: true }, 
            timestamp: '3 min ago', 
            targetText: 'just posted a new theory about "Attack on Titan"!',
            canBeThanked: true
        },
        {
            id: 'act3', type: 'purchase_video', 
            performer: { name: 'Aoi Nakamura', avatarUrl: peopleImageUrls[4 % peopleImageUrls.length] }, 
            timestamp: '6 hrs ago', 
            targetText: 'is watching your latest story about Akihabara.',
            canBeThanked: true
        },
        {
            id: 'act4', type: 'job_request', 
            performer: { name: 'Ren Suzuki (Sakura Studios)', avatarUrl: peopleImageUrls[5 % peopleImageUrls.length] }, 
            timestamp: '1 hr ago', 
            targetText: 'commented on your "Cosplay Design Ideas" post.', 
            canBeThanked: true 
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
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-8 h-8 bg-[var(--brand-logo-bg)] rounded-lg flex items-center justify-center text-[var(--brand-logo-text)]">
                    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                        <path d="M20 4H4C3.44772 4 3 4.44772 3 5V6H21V5C21 4.44772 20.5523 4 20 4Z" />
                        <path d="M18 7H6C5.44772 7 5 7.44772 5 8V20H7V14H17V20H19V8C19 7.44772 18.5523 7 18 7ZM12 8V11H12.01V8H12Z" />
                        <path d="M4 7H2V20H4V7Z" />
                        <path d="M20 7H22V20H20V7Z" />
                    </svg>
                </div>
            </div>
            <div className="flex items-center space-x-1">
                <NotificationsDropdown />
                <ThemeSwitchMechanism />
                <button onClick={onProfileClick} className="p-0.5 rounded-xl hover:ring-2 hover:ring-[var(--accent-primary)] cursor-pointer">
                    <div className="w-8 h-8 rounded-2xl bg-[var(--profile-avatar-bg)] flex items-center justify-center overflow-hidden">
                        {platformCurrentUser.avatarUrl ? (
                            <img src={platformCurrentUser.avatarUrl} alt={platformCurrentUser.name} className="w-full h-full object-cover" />
                        ) : (
                            <UserCircle2 size={20} className="text-[var(--page-text-secondary)]" />
                        )}
                    </div>
                </button>
            </div>
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
                <aside className="w-3/4 max-w-sm p-5 flex flex-col space-y-3 h-full overflow-y-auto shadow-xl bg-[var(--page-bg)]">
                    <div className="flex justify-end mb-2">
                        <button onClick={toggleMobileLeftSidebar} className="p-2 text-[var(--page-text-primary)] hover:bg-[var(--card-bg-hover)] rounded-full">
                            <X size={24}/>
                        </button>
                    </div>
                    <AppBrandingAndTheme />
                    <ProfileSummaryDisplay />
                    <UserInterestsDisplay /> 
                    <GroupAffiliations />
                    <div className="mt-auto pt-6">
                        <p className="text-xs text-[var(--page-text-secondary)] text-center">&copy; {new Date().getFullYear()} Platform Hub. All rights reserved.</p>
                    </div>
                </aside>
                <div onClick={toggleMobileLeftSidebar} className="flex-1 bg-black/50"></div> 
            </div>
        )}
        <aside className="w-[24%] max-w-sm p-5 flex-shrink-0 hidden md:flex flex-col space-y-3 h-full overflow-y-auto shadow-xl bg-[var(--page-bg)] scrollbar-thin scrollbar-thumb-[var(--scrollbar-thumb)] scrollbar-track-[var(--scrollbar-track)]">
          <AppBrandingAndTheme />
          <ProfileSummaryDisplay />
          <UserInterestsDisplay /> 
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
                
                <aside className="w-3/4 max-w-xs bg-[var(--page-bg)] p-5 flex flex-col space-y-0 h-full overflow-y-auto shadow-xl">
                     <div className="flex justify-start mb-2">
                        <button onClick={toggleMobileRightSidebar} className="p-2 text-[var(--page-text-primary)] hover:bg-[var(--card-bg-hover)] rounded-full">
                            <X size={24}/>
                        </button>
                    </div>
                   
                    <div className="bg-[var(--card-bg)] rounded-xl shadow-lg mb-4">
                        <UserAccountWidget />
                    </div>
                    <div className="bg-[var(--card-bg)] rounded-xl shadow-lg p-4 flex-1 flex flex-col overflow-hidden">
                        <h3 className="text-sm font-semibold my-3 text-center text-[var(--page-text-primary)] sticky top-0 bg-[var(--card-bg)] py-2 -mx-4 px-4 border-b border-[var(--border-color-primary)] z-10">Recent Activity</h3>
                        <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-[var(--scrollbar-thumb)] scrollbar-track-[var(--scrollbar-track)] pr-1 -mr-1">
                           <RecentActivitiesManager />
                        </div>
                    </div>
                </aside>
            </div>
        )}
        
       
        <aside className="w-[22%] max-w-xs bg-[var(--page-bg)] p-5 flex-shrink-0 hidden lg:flex flex-col space-y-0 h-full overflow-y-auto shadow-xl scrollbar-thin scrollbar-thumb-[var(--scrollbar-thumb)] scrollbar-track-[var(--scrollbar-track)]">
         
          <div className="bg-[var(--card-bg)] rounded-xl shadow-lg mb-4 p-3 flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <NotificationsDropdown />
              <ThemeSwitchMechanism />
            </div>
            <UserAccountWidget />
          </div>
          
          
           <div className="bg-[var(--card-bg)] rounded-xl shadow-lg flex-1 flex flex-col overflow-hidden">
            <h3 className="text-sm font-semibold text-center mb-2 text-[var(--page-text-primary)] sticky top-0 bg-[var(--card-bg)] py-2 -mx-4 px-4 border-b border-[var(--border-color-primary)] z-10">Recent Activity</h3>
            <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-[var(--scrollbar-thumb)] scrollbar-track-[var(--scrollbar-track)] pr-1 -mr-1">
                <RecentActivitiesManager />
            </div>
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
      
      
      --page-bg: #F9FAFB; 
      --page-text-primary: #1F2937; 
      --page-text-secondary: #6B7280; 
      --page-text-tertiary: #9CA3AF; 
      --border-color-primary: #E5E7EB; 
      --border-color-secondary: #D1D5DB; 

      
      --card-bg: #F3F4F6; 
      --card-bg-hover: #E5E7EB; 
      --input-bg: #FFFFFF; 
      --input-text: #1F2937; 
      --input-placeholder: #9CA3AF; 
      --button-bg: #E5E7EB; 
      --button-bg-hover: #D1D5DB; 
      --button-text: #1F2937; 

      
      --accent-primary: #F472B6; 
      --accent-primary-hover: #EC4899; 
      --accent-text-on-primary: #FFFFFF; 

      
      --profile-avatar-bg: #E5E7EB; 
      --profile-avatar-border: #F9FAFB; 
      --brand-logo-bg: var(--accent-primary);
      --brand-logo-text: var(--accent-text-on-primary);

      
      --scrollbar-thumb: #9CA3AF; 
      --scrollbar-track: #F3F4F6; 

      
      --font-heading: var(--font-playfair-display), serif;
      --font-body: var(--font-merriweather), sans-serif;

      
      --icon-color-photo: #22C55E; 
      --icon-color-video: #0EA5E9; 
      --icon-color-poll: var(--accent-primary);  
      --icon-color-verified: var(--accent-primary); 
      --icon-color-verified-fill: var(--accent-primary); 
      --icon-color-comment-action: #0EA5E9; 
      --icon-color-share-action: #22C55E; 

      
      --avatar-verified-badge-bg: #FBCFE8; 
      --avatar-verified-badge-icon-color: #DB2777; 
      --button-thanked-bg: #D1D5DB; 
      --button-thanked-text: #4B5563; 
      --button-discard-bg: var(--button-thanked-bg);
      --button-discard-text: var(--button-thanked-text);

      
      --notification-unread-bg: #FCE7F3; 
      --notification-unread-bg-hover: #FBCFE8; 
    }

    html.dark {
      
      
      --page-bg: #111111; 
      --page-text-primary: #E5E7EB; 
      --page-text-secondary: #9CA3AF; 
      --page-text-tertiary: #6B7280; 
      --border-color-primary: #333333; 
      --border-color-secondary: #444444; 

      
      --card-bg: #1F1F1F; 
      --card-bg-hover: #2D2D2D; 
      --input-bg: #2D2D2D; 
      --input-text: #E5E7EB; 
      --input-placeholder: #6B7280; 
      --button-bg: #2D2D2D; 
      --button-bg-hover: #444444; 
      --button-text: #E5E7EB; 

      
      --accent-primary: #EF4444; 
      --accent-primary-hover: #DC2626; 
      --accent-text-on-primary: #FFFFFF; 
      
      
      --profile-avatar-bg: #2D2D2D; 
      --profile-avatar-border: var(--card-bg); 
      --brand-logo-bg: var(--accent-primary);
      --brand-logo-text: var(--accent-text-on-primary);

      
      --scrollbar-thumb: #6B7280; 
      --scrollbar-track: #1F1F1F; 

      
      --icon-color-photo: #22C55E; 
      --icon-color-video: #0EA5E9; 
      --icon-color-poll: var(--accent-primary); 
      --icon-color-verified: var(--accent-primary); 
      --icon-color-verified-fill: var(--accent-primary); 
      --icon-color-comment-action: #0EA5E9; 
      --icon-color-share-action: #22C55E; 

      
      --avatar-verified-badge-bg: #991B1B; 
      --avatar-verified-badge-icon-color: #FEE2E2; 
      --button-thanked-bg: #4B5563; 
      --button-thanked-text: #D1D5DB; 
      --button-discard-bg: var(--button-thanked-bg);
      --button-discard-text: var(--button-thanked-text);

      
      --notification-unread-bg: rgba(239, 68, 68, 0.15); 
      --notification-unread-bg-hover: rgba(239, 68, 68, 0.25); 
    }

    body {
      background-color: var(--page-bg);
      color: var(--page-text-primary);
      font-family: var(--font-body);
    }
    
    h1, h2, h3, h4, h5, h6 {
        font-family: var(--font-heading);
    }

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

    html {
      scrollbar-width: thin;
      scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
    }
  `}</style>
);


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


export default CreatorPlatformPage;
