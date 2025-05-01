'use client'
import React from 'react';
import { 
  Home, 
  ListMusic, 
  Library, 
  History, 
  Radio, 
  PlusSquare, 
  Settings, 
  LogOut,
  ChevronLeft,
  Search,
  Bell,
  User,
  Play,
  Share2,
  Download,
  Music,
  Eye,
  Clock,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Volume2,
  Maximize2,
  MoreHorizontal,
  Mic2,
  Podcast,
  FolderHeart,
  Info,
  Menu,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';


const trackData = [
  {
    id: 1,
    title: 'The Finishing',
    artist: 'Starvoz',
    album: "Irakli's Musics",
    views: '543K',
    duration: '04:21',
    thumbnail: 'bg-gradient-to-br from-purple-500 to-indigo-700',
    lastPlayed: 'Today'
  },
  {
    id: 2,
    title: 'And We Knew It',
    artist: 'Lane 8 & Massane',
    album: 'We Must Earn Love',
    views: '543K',
    duration: '04:21',
    thumbnail: 'bg-gradient-to-br from-gray-400 to-gray-600',
    isActive: true,
    lastPlayed: 'Yesterday'
  },
  {
    id: 3,
    title: 'Insecure ( Visualizer )',
    artist: 'Donna Missal',
    album: 'How To Feel Life',
    views: '543K',
    duration: '04:21',
    thumbnail: 'bg-gradient-to-br from-red-500 to-orange-500',
    lastPlayed: '2 days ago'
  },
  {
    id: 4,
    title: 'The Blaze Live',
    artist: 'France For Cercle',
    album: 'Masterpiece',
    views: '543K',
    duration: '04:21',
    thumbnail: 'bg-gradient-to-br from-cyan-400 to-blue-600',
    lastPlayed: 'Last week'
  },
  
];


const TrackItem = ({ track, index }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <motion.div 
      variants={itemVariants}
      className={`group grid grid-cols-[auto_60px_1fr_auto] md:grid-cols-[auto_60px_1fr_1fr_100px_auto] lg:grid-cols-[auto_60px_1fr_1fr_100px_100px_100px] items-center gap-x-3 gap-y-1 px-4 py-3 rounded-lg hover:bg-neutral-700/50 transition-colors duration-150 ${track.isActive ? 'bg-neutral-700/70' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="text-neutral-400 text-sm w-6 text-right">
        {track.isActive ? (
            <Pause size={16} className="text-purple-400 fill-purple-400" />
        ) : isHovered ? (
            <Play size={16} className="text-white fill-white" />
        ) : (
            <span className="hidden sm:inline">{index + 1}</span>
        )}
      </div>
      <div className={`w-10 h-10 rounded ${track.thumbnail}`}></div>
      <div className="min-w-0"> 
        <p className="text-white font-medium text-sm truncate">{track.title}</p>
        <p className="text-neutral-400 text-xs truncate">{track.artist}</p>
      </div>
      <div className="hidden lg:block text-neutral-400 text-sm truncate">{track.album}</div>
      <div className="hidden lg:block text-neutral-400 text-sm justify-self-center">{track.views}</div>
      <div className="hidden md:block text-neutral-400 text-sm justify-self-center">{track.duration}</div>
      <div className="flex items-center justify-end space-x-3 md:space-x-4 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <Share2 size={18} className="hover:text-white cursor-pointer hidden sm:inline-block" /> 
        <Download size={18} className={`hover:text-white cursor-pointer ${track.isActive ? 'text-purple-400 hover:text-purple-300' : ''}`} />
        <MoreHorizontal size={18} className="hover:text-white cursor-pointer" />
      </div>
    </motion.div>
  );
};


const RecentlyPlayedItem = ({ track, index }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <motion.div 
      variants={itemVariants}
      className={`group grid grid-cols-[auto_60px_1fr_auto] md:grid-cols-[auto_60px_2fr_1fr_1fr_100px] items-center gap-x-3 gap-y-1 px-4 py-3 rounded-lg hover:bg-neutral-700/50 transition-colors duration-150`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="text-neutral-400 text-sm w-6 text-right">
        {isHovered ? (
            <Play size={16} className="text-white fill-white" />
        ) : (
          <span className="hidden sm:inline">{index + 1}</span>
        )}
      </div>
      <div className={`w-10 h-10 rounded ${track.thumbnail}`}></div>
      <div className="min-w-0"> 
        <p className="text-white font-medium text-sm truncate">{track.title}</p>
        <p className="text-neutral-400 text-xs truncate">{track.artist}</p>
      </div>
      <div className="hidden md:block text-neutral-400 text-sm truncate">{track.album}</div>
      <div className="hidden md:block text-neutral-400 text-sm justify-self-center">{track.lastPlayed}</div>
      <div className="flex items-center justify-end space-x-4 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <MoreHorizontal size={18} className="hover:text-white cursor-pointer" />
      </div>
    </motion.div>
  );
};


const NotificationsDropdown = () => {
  const items = [
    { id: 1, text: 'New episode: Tech Talks Weekly #105', icon: Podcast },
    { id: 2, text: 'Your "Focus" Collection updated', icon: FolderHeart },
    { id: 3, text: 'Welcome to TiMN Premium! (Example)', icon: Info },
  ];
  return (
    <div className="absolute top-full right-0 mt-2 w-72 bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl z-40 text-neutral-200">
      <div className="py-2 px-4 font-semibold text-sm border-b border-neutral-700">Notifications</div>
      <ul className="text-sm max-h-60 overflow-y-auto"> 
        {items.length > 0 ? items.map(item => (
          <li key={item.id} className="group flex items-center px-4 py-2.5 hover:bg-neutral-700 cursor-pointer">
            <item.icon className="w-4 h-4 mr-3 text-neutral-400 group-hover:text-purple-400 flex-shrink-0" />
            <span className="truncate group-hover:text-white">{item.text}</span>
          </li>
        )) : (
           <li className="px-4 py-4 text-center text-neutral-500 text-xs">No new notifications</li>
        )}
         <li className="group flex items-center justify-center px-4 py-2 text-center text-xs text-purple-400 hover:bg-neutral-700 hover:text-purple-300 cursor-pointer border-t border-neutral-700">
             <Eye size={14} className="mr-1.5"/> View All
          </li>
      </ul>
    </div>
  );
};


const ProfileDropdown = () => {
  const items = [
    { id: 'account', text: 'Account', icon: User },
    { id: 'settings', text: 'Settings', icon: Settings },
    { id: 'logout', text: 'Log Out', icon: LogOut },
  ];
  return (
    <div className="absolute top-full right-0 mt-2 w-48 bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl z-40 text-neutral-200">
      <ul className="text-sm py-1">
        {items.map(item => (
          <li key={item.id} className="group flex items-center px-4 py-2 hover:bg-neutral-700 hover:text-white cursor-pointer">
             <item.icon className="w-4 h-4 mr-3 text-neutral-400 group-hover:text-purple-400"/>
             <span>{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};


const TopBar = ({ searchQuery, setSearchQuery, setActiveView, openMobileSidebar }: { 
  searchQuery: string; 
  setSearchQuery: (query: string) => void;
  setActiveView: (view: string) => void;
  openMobileSidebar: () => void;
}) => {
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);
  const notificationsRef = React.useRef(null);
  const profileRef = React.useRef(null);

  const updateSearchTerm = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const initiateSearchOnEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && searchQuery.trim() !== '') {
      setOpenDropdown(null); 
      setActiveView('search');
    }
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown) {
        const isClickInsideNotifications = notificationsRef.current?.contains(event.target as Node);
        const isClickInsideProfile = profileRef.current?.contains(event.target as Node);

        if (!isClickInsideNotifications && !isClickInsideProfile) {
          setOpenDropdown(null);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  const returnToHomepage = () => {
    setOpenDropdown(null); 
    setActiveView('home');
  };

  const revealDropdownMenu = (dropdown: string) => {
    setOpenDropdown(prev => (prev === dropdown ? null : dropdown));
  };


  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-20 h-16 bg-black/50 backdrop-blur-md flex items-center justify-between px-4 md:px-6 flex-shrink-0" 
    >
      <div className="flex items-center space-x-2 md:space-x-4">
         <button onClick={openMobileSidebar} className="cursor-pointer p-2 text-neutral-300 hover:text-white md:hidden"> 
             <Menu size={24} />
         </button>
        <button 
           onClick={returnToHomepage}
           className="cursor-pointer p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-neutral-300 hover:text-white transition-colors hidden md:inline-flex" 
         >
          <ChevronLeft size={20} />
        </button>
      </div>
      <div className="flex items-center space-x-2 md:space-x-4">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchQuery} 
            onChange={updateSearchTerm}
            onKeyDown={initiateSearchOnEnter}
            className="bg-neutral-700/50 border border-neutral-600 rounded-full py-2 px-4 pl-10 text-sm text-neutral-200 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent w-36 sm:w-64" 
          />
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
        </div>
        <div className="relative" ref={notificationsRef}> 
          <button 
            onClick={() => revealDropdownMenu('notifications')}
            className="cursor-pointer p-2 rounded-full bg-black/30 hover:bg-black/50 text-neutral-300 hover:text-white transition-colors relative"
          >
            <Bell size={20} />
          </button>
          {openDropdown === 'notifications' && <NotificationsDropdown />} 
        </div>
        <div className="relative" ref={profileRef}> 
          <button 
            onClick={() => revealDropdownMenu('profile')}
            className="cursor-pointer rounded-full overflow-hidden w-8 h-8 border-2 border-neutral-600 hover:border-purple-500 transition-colors"
          >
            <div className="w-full h-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
               <User size={16} className="text-white/80"/>
            </div>
          </button>
          {openDropdown === 'profile' && <ProfileDropdown />} 
        </div>
      </div>
    </motion.div>
  );
};


const PlaylistDetailView = () => {
  const listVariants = {
     hidden: { opacity: 0 },
     visible: {
       opacity: 1,
       transition: { staggerChildren: 0.05 }
     }
   };
  return (
    <main className="flex-1 text-white relative px-6 pt-6"> 
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative h-[350px] rounded-xl overflow-hidden mb-8 flex items-end p-8 bg-gradient-to-br from-blue-900 via-cyan-700 to-teal-500"
      >
        <div className="absolute inset-0 bg-black/30"></div> 
        <div className="relative z-10 text-white">
          <h2 className="text-5xl font-bold font-montserrat mb-2">Irakli Talavadze</h2>
          <p className="text-sm text-neutral-300 mb-4">54K Followers</p>
          <div className="flex items-center space-x-4">
            <button className="cursor-pointer bg-purple-600 hover:bg-purple-700 transition-colors text-white font-semibold py-2 px-6 rounded-full text-sm shadow-md">
              Follow
            </button>
          </div>
        </div>
        <div className="absolute bottom-8 right-8 flex space-x-3 z-10">
           <motion.button 
              whileHover={{ scale: 1.1 }} 
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer w-14 h-14 rounded-full bg-purple-600/80 backdrop-blur-sm hover:bg-purple-500 text-white flex items-center justify-center shadow-lg transition-colors"
            >
              <Play size={24} className="fill-white" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }} 
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white flex items-center justify-center shadow-lg transition-colors"
            >
              <Share2 size={20} />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }} 
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white flex items-center justify-center shadow-lg transition-colors"
            >
              <Download size={20} />
            </motion.button>
        </div>
      </motion.div>
      <div> 
          <div className="grid grid-cols-[auto_60px_1fr_auto] md:grid-cols-[auto_60px_1fr_1fr_100px_auto] lg:grid-cols-[auto_60px_1fr_1fr_100px_100px_100px] items-center gap-x-3 px-4 pb-2 border-b border-neutral-700 mb-2 text-neutral-400 text-xs uppercase tracking-wider font-montserrat">
            <div className="w-6 text-right hidden sm:block">#</div> 
            <div className="col-start-3">Title</div>
            <div className="hidden lg:block">Podcast / Series</div>
            <div className="hidden lg:flex items-center"><Eye size={14} /></div> 
            <div className="hidden md:flex items-center justify-center"><Clock size={14} /></div> 
            <div className="justify-self-end"><MoreHorizontal size={14}/></div> 
          </div>
          <motion.div variants={listVariants} initial="hidden" animate="visible">
            {trackData.map((track, index) => (
              <TrackItem key={track.id} track={track} index={index} />
            ))}
          </motion.div>
       </div>
    </main>
  );
};


const RecentlyPlayedView = () => {
  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };
  
  
  const recentTracks = trackData;

  return (
    <main className="flex-1 text-white relative px-6 pt-6"> 
      <motion.h1 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold font-montserrat mb-8"
      >
        Recently Played
      </motion.h1>
      <div className="grid grid-cols-[auto_60px_1fr_auto] md:grid-cols-[auto_60px_2fr_1fr_1fr_100px] items-center gap-x-3 px-4 pb-2 border-b border-neutral-700 mb-2 text-neutral-400 text-xs uppercase tracking-wider font-montserrat">
          <div className="w-6 text-right hidden sm:block">#</div> 
          <div className="col-start-3">Title</div>
          <div className="hidden md:block">Show / Series</div>
          <div className="hidden md:block justify-self-center">Last Played</div>
          <div className="justify-self-end"><MoreHorizontal size={14} /></div> 
      </div>
      <motion.div
        variants={listVariants}
        initial="hidden"
        animate="visible"
      >
        {recentTracks.map((track, index) => (
          <RecentlyPlayedItem key={track.id} track={track} index={index} />
        ))}
      </motion.div>
    </main>
  );
};


const HomeView = () => {
  const fetchGreetingMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  
  const quickPicks = [
    { id: 1, title: 'Your Daily Digest', description: 'Episodes picked for you', thumbnail: 'bg-gradient-to-br from-purple-500 to-pink-500' },
    { id: 2, title: 'Podcast Discovery', description: 'New shows you might like', thumbnail: 'bg-gradient-to-br from-green-400 to-blue-500' },
    { id: 3, title: 'New Episode Radar', description: 'Latest episodes from your shows', thumbnail: 'bg-gradient-to-br from-red-500 to-yellow-500' },
    { id: 4, title: 'Saved Episodes', description: 'Episodes you saved', thumbnail: 'bg-gradient-to-br from-teal-400 to-cyan-600' },
    { id: 5, title: 'Top Charts', description: 'Trending podcasts right now', thumbnail: 'bg-gradient-to-br from-orange-400 to-red-600' },
    { id: 6, title: 'Relaxing Listens', description: 'Unwind with these podcasts', thumbnail: 'bg-gradient-to-br from-indigo-400 to-purple-600' },
  ];

  
  const sections = [
    {
      title: 'Technology Podcasts', 
      items: [
        { id: 101, name: 'Tech Talks Weekly', thumbnail: 'bg-sky-700' },
        { id: 102, name: 'Gadget Lab', thumbnail: 'bg-blue-700' },
        { id: 103, name: 'Code Newbie', thumbnail: 'bg-indigo-700' },
        { id: 104, name: 'Cyberwire Daily', thumbnail: 'bg-violet-700' },
        { id: 105, name: 'This Week in Tech', thumbnail: 'bg-purple-700' },
        { id: 106, name: 'Pivot', thumbnail: 'bg-fuchsia-700' },
      ]
    },
    {
      title: 'History & True Crime', 
      items: [
        { id: 201, name: 'Hardcore History', thumbnail: 'bg-amber-700' },
        { id: 202, name: 'Crime Junkie', thumbnail: 'bg-orange-700' },
        { id: 203, name: 'Revisionist History', thumbnail: 'bg-red-700' },
        { id: 204, name: 'My Favorite Murder', thumbnail: 'bg-rose-700' },
        { id: 205, name: 'Stuff You Missed In History', thumbnail: 'bg-stone-700' },
        { id: 206, name: 'Serial', thumbnail: 'bg-slate-700' },
      ]
    },
     {
      title: 'Comedy Shows', 
      items: [
        { id: 301, name: 'Comedy Bang Bang', thumbnail: 'bg-yellow-600' },
        { id: 302, name: 'WTF with Marc Maron', thumbnail: 'bg-lime-600' },
        { id: 303, name: 'My Brother, My Brother And Me', thumbnail: 'bg-green-600' },
        { id: 304, name: 'SmartLess', thumbnail: 'bg-emerald-600' },
        { id: 305, name: 'How Did This Get Made?', thumbnail: 'bg-teal-600' },
        { id: 306, name: 'Conan O\'Brien Needs A Friend', thumbnail: 'bg-cyan-600' },
      ]
    },
  ];

  const cardVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
  const sectionVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };

  return (
    <main className="flex-1 text-white relative px-6 pt-6"> 
      <motion.h1 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold font-montserrat mb-8"
      >
        {fetchGreetingMessage()}
      </motion.h1>
      <motion.div 
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10"
      >
        {quickPicks.map((item) => (
          <motion.div 
            key={item.id}
            variants={cardVariants}
            className={`cursor-pointer group flex items-center bg-neutral-800/70 hover:bg-neutral-700/90 transition-colors duration-200 rounded overflow-hidden shadow-md h-20`}
          >
            <div className={`w-20 h-20 flex-shrink-0 ${item.thumbnail}`}></div>
            <div className="px-4 py-2 truncate">
              <p className="text-white font-semibold text-sm truncate">{item.title}</p>
            </div>
            <div className="ml-auto mr-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                 <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="cursor-pointer w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg">
                    <Play size={20} className="fill-white ml-0.5"/>
                 </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>
      <div className="space-y-10">
        {sections.map((section) => (
          <motion.section 
            key={section.title}
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <h2 className="text-xl font-semibold font-montserrat mb-4">{section.title}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {section.items.map((item) => (
                <motion.div 
                  key={item.id} 
                  variants={cardVariants}
                  className="cursor-pointer group bg-neutral-800/50 hover:bg-neutral-700/70 p-3 rounded-lg transition-colors duration-200 shadow-md flex flex-col"
                >
                  <div className={`relative aspect-square w-full rounded mb-2 ${item.thumbnail}`}> 
                     <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 rounded">
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="cursor-pointer w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg">
                           <Play size={20} className="fill-white ml-0.5"/>
                        </motion.button>
                    </div>
                  </div>
                  <p className="text-white font-medium text-sm truncate mt-auto">{item.name}</p>
                  <p className="text-neutral-400 text-xs truncate">Podcast</p> 
                </motion.div>
              ))}
            </div>
          </motion.section>
        ))}
      </div>

    </main>
  );
};


const collectionsData = [
  { id: 'c1', title: 'Focus & Flow', description: 'Podcasts for deep work', thumbnail: 'bg-gradient-to-br from-cyan-500 to-blue-600' },
  { id: 'c2', title: 'Commute Companions', description: 'Engaging stories for the road', thumbnail: 'bg-gradient-to-br from-yellow-400 to-orange-500' },
  { id: 'c3', title: 'Workout Motivation', description: 'Get pumped up', thumbnail: 'bg-gradient-to-br from-red-500 to-pink-600' },
  { id: 'c4', title: 'Late Night Listens', description: 'Relaxing and thought-provoking', thumbnail: 'bg-gradient-to-br from-indigo-600 to-purple-700' },
  { id: 'c5', title: 'Learn Something New', description: 'Expand your knowledge', thumbnail: 'bg-gradient-to-br from-green-500 to-teal-600' },
  { id: 'c6', title: 'Weekend Vibes', description: 'Easy listening for your downtime', thumbnail: 'bg-gradient-to-br from-rose-400 to-fuchsia-500' },
  
];


const CollectionCard = ({ collection }) => {
  const cardVariants = { 
    hidden: { opacity: 0, scale: 0.9 }, 
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <motion.div 
      variants={cardVariants}
      className="cursor-pointer group bg-neutral-800/50 hover:bg-neutral-700/70 p-4 rounded-lg transition-all duration-300 shadow-lg flex flex-col aspect-square justify-between"
    >
      <div className={`w-full h-2/3 rounded-md mb-3 ${collection.thumbnail}`}></div>
      <div>
         <h3 className="text-white font-semibold text-base truncate mb-1 font-montserrat">{collection.title}</h3>
         <p className="text-neutral-400 text-xs truncate">{collection.description}</p>
      </div>

    </motion.div>
  );
};


const CollectionsView = () => {
  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  return (
    <main className="flex-1 text-white relative px-6 pt-6">
      <motion.h1 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold font-montserrat mb-8"
      >
        Collections
      </motion.h1>

      <motion.div 
        variants={gridVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5"
      >
        {collectionsData.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </motion.div>
    </main>
  );
};


const SearchView = ({ searchQuery }) => {
  const lowerCaseQuery = searchQuery.toLowerCase();

  
  const matchingCollections = collectionsData.filter(collection => 
    collection.title.toLowerCase().includes(lowerCaseQuery) ||
    collection.description.toLowerCase().includes(lowerCaseQuery)
  );

  
  const matchingEpisodes = trackData.filter(track => 
    track.title.toLowerCase().includes(lowerCaseQuery) ||
    track.artist.toLowerCase().includes(lowerCaseQuery) || 
    track.album.toLowerCase().includes(lowerCaseQuery)    
  );

  const listVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const gridVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };


  return (
    <main className="flex-1 text-white relative px-6 pt-6">
      <motion.h1 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold font-montserrat mb-8"
      >
        Results for "<span className='text-purple-400'>{searchQuery}</span>"
      </motion.h1>

      {matchingCollections.length === 0 && matchingEpisodes.length === 0 && (
        <p className="text-neutral-400">No results found.</p>
      )}
      {matchingCollections.length > 0 && (
        <motion.section 
          initial="hidden" 
          animate="visible" 
          variants={gridVariants} 
          className="mb-10"
         >
          <h2 className="text-xl font-semibold font-montserrat mb-4">Matching Collections</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {matchingCollections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        </motion.section>
      )}

      {matchingEpisodes.length > 0 && (
        <motion.section 
           initial="hidden" 
           animate="visible" 
           variants={listVariants} 
           className="mb-10"
         >
          <h2 className="text-xl font-semibold font-montserrat mb-4">Matching Episodes</h2>
          <div className="space-y-1">
             {matchingEpisodes.map((track, index) => (
               <TrackItem key={track.id} track={track} index={index} />
             ))}
          </div>
        </motion.section>
      )}

    </main>
  );
};

const convertSecondsToMMSS = (seconds: number): string => {
  if (isNaN(seconds) || seconds === Infinity) {
    return '0:00';
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

const PlayerBar = () => {
  const currentTrack = trackData.find(t => t.isActive) || trackData[1];
  const audioUrl = "https://github.com/Ksotillo/wmp-wep-app/raw/refs/heads/main/public/audio/track1.mp3";
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [duration, setDuration] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [volume, setVolume] = React.useState(75);

  const playOrPauseTrack = () => {
      if (!audioRef.current) return;
      if (isPlaying) {
          audioRef.current.pause();
      } else {
          audioRef.current.play().catch((error) => console.error("Error playing audio:", error));
      }
  };

  const adjustAudioVolume = (event) => {
      const newVolume = Number(event.target.value);
      setVolume(newVolume);
      if (audioRef.current) {
          audioRef.current.volume = newVolume / 100;
      }
  };
  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => setDuration(audio.duration);
    const setAudioTime = () => setCurrentTime(audio.currentTime);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
        setIsPlaying(false);
    }

    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.volume = volume / 100;
    return () => {
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [volume]);


  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const jumpToTime = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(event.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  return (
    <motion.footer 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.5 }}
      className="h-auto md:h-24 bg-neutral-800/95 backdrop-blur-sm border-t border-neutral-700/50 fixed bottom-0 left-0 right-0 flex flex-col md:flex-row items-center md:justify-between px-4 py-3 md:px-6 text-white z-30"
    >
      <audio ref={audioRef} src={audioUrl} preload="metadata"></audio>
      <div className="flex items-center space-x-3 w-full md:w-1/4 md:min-w-[200px] mb-2 md:mb-0">
         <div className={`w-12 h-12 md:w-14 md:h-14 rounded ${currentTrack.thumbnail} flex-shrink-0`}></div>
         <div className="min-w-0">
           <p className="text-sm font-medium text-white truncate">{currentTrack.title}</p>
           <p className="text-xs text-neutral-400 truncate">{currentTrack.artist}</p>
         </div>
      </div>
      <div className="flex flex-col items-center w-full md:w-1/2 md:flex-grow md:mx-4">
         <div className="flex items-center space-x-5 mb-2 md:mb-2">
            <motion.button whileTap={{ scale: 0.9 }} className="cursor-pointer text-neutral-400 hover:text-white transition-colors hidden md:inline-flex">
              <Shuffle size={18} />
            </motion.button>
            <motion.button whileTap={{ scale: 0.9 }} className="cursor-pointer text-neutral-400 hover:text-white transition-colors">
              <SkipBack size={20} className="fill-neutral-400 hover:fill-white" />
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.9 }} 
              whileHover={{ scale: 1.1 }}
              onClick={playOrPauseTrack}
              className="cursor-pointer w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-neutral-200 transition-colors"
            >
              {isPlaying ? <Pause size={20} className="fill-black" /> : <Play size={20} className="fill-black ml-0.5" />}
            </motion.button>
            <motion.button whileTap={{ scale: 0.9 }} className="cursor-pointer text-neutral-400 hover:text-white transition-colors">
              <SkipForward size={20} className="fill-neutral-400 hover:fill-white" />
            </motion.button>
            <motion.button whileTap={{ scale: 0.9 }} className="cursor-pointer text-neutral-400 hover:text-white transition-colors hidden md:inline-flex">
              <Repeat size={18} />
            </motion.button>
          </div>
         <div className="flex items-center w-full max-w-xl space-x-2 group">
           <span className="text-xs text-neutral-400 w-10 text-right">{convertSecondsToMMSS(currentTime)}</span>
           <div className="relative flex-grow h-3 flex items-center"> 
               <div 
                 className="absolute left-0 right-0 h-1 bg-neutral-600 rounded-full overflow-hidden"
                 style={{
                   background: `linear-gradient(to right, white ${progressPercent}%, #404040 ${progressPercent}%)` 
                 }}
               ></div>
               <input 
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={jumpToTime}
                    className="relative w-full h-1 appearance-none bg-transparent rounded-full cursor-pointer accent-white group-hover:accent-purple-400 transition-colors z-10"
                />
           </div>
           <span className="text-xs text-neutral-400 w-10">{convertSecondsToMMSS(duration)}</span>
         </div>
      </div>
      <div className="hidden md:flex items-center justify-end w-1/4 min-w-[150px] group"> 
         <motion.button whileTap={{ scale: 0.9 }} className="cursor-pointer text-neutral-400 hover:text-white transition-colors mr-2">
             <Volume2 size={18} />
         </motion.button>
         <div className="relative w-24 h-3 flex items-center"> 
             <div 
               className="absolute left-0 right-0 h-1 bg-neutral-600 rounded-full overflow-hidden"
               style={{
                 background: `linear-gradient(to right, white ${volume}%, #404040 ${volume}%)`
               }}
             ></div>
             <input 
               type="range" 
               min="0" 
               max="100" 
               value={volume}
               onChange={adjustAudioVolume}
               className="relative w-full h-1 appearance-none bg-transparent rounded-full cursor-pointer accent-white group-hover:accent-purple-400 transition-colors z-10"
             />
         </div>
      </div>
    </motion.footer>
  );
};




const playlistsData = [
  { id: 'pl1', title: 'My Favorite Tech Podcasts', description: 'Top picks for staying updated', thumbnail: 'bg-gradient-to-tr from-blue-500 to-sky-300' },
  { id: 'pl2', title: 'Long Commute Listens', description: 'Engaging stories & interviews', thumbnail: 'bg-gradient-to-tr from-orange-400 to-yellow-300' },
  { id: 'pl3', title: 'History Buff\'s Selection', description: 'Deep dives into the past', thumbnail: 'bg-gradient-to-tr from-stone-500 to-amber-400' }, 
  { id: 'pl4', title: 'Comedy Hour', description: 'Guaranteed laughs', thumbnail: 'bg-gradient-to-tr from-lime-400 to-green-500' },
  
];


const PlaylistCard = ({ playlist, setActiveView }: { 
  playlist: typeof playlistsData[0];
  setActiveView: (view: string) => void;
}) => {
  const cardVariants = { 
    hidden: { opacity: 0, scale: 0.9 }, 
    visible: { opacity: 1, scale: 1 }
  };

  const showPlaylistContent = () => {
    setActiveView('playlistdetail');
  };

  return (
    <motion.div 
      variants={cardVariants}
      onClick={showPlaylistContent}
      className="cursor-pointer group bg-neutral-800/50 hover:bg-neutral-700/70 p-4 rounded-lg transition-all duration-300 shadow-lg flex flex-col aspect-square justify-between"
    >
      <div className={`w-full h-2/3 rounded-md mb-3 ${playlist.thumbnail}`}></div>
      <div>
         <h3 className="text-white font-semibold text-base truncate mb-1 font-montserrat">{playlist.title}</h3>
         <p className="text-neutral-400 text-xs truncate">{playlist.description || 'User Playlist'}</p>
      </div>
    </motion.div>
  );
};


const PlaylistsListView = ({ setActiveView }: { setActiveView: (view: string) => void }) => {
  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  return (
    <main className="flex-1 text-white relative px-6 pt-6">
      <motion.h1 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold font-montserrat mb-8"
      >
        Your Playlists
      </motion.h1>

      <motion.div 
        variants={gridVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5"
      >
        {playlistsData.map((playlist) => (
          <PlaylistCard key={playlist.id} playlist={playlist} setActiveView={setActiveView} />
        ))}
      </motion.div>
    </main>
  );
};

const PodcastApp = () => {
  const [activeView, setActiveView] = React.useState('home');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

  const switchAppView = (view: string) => {
    setActiveView(view);
    setIsMobileSidebarOpen(false); 
    if (view !== 'search') {
      
    }
  };

  const navItems = [
      { key: "home", name: "Home", icon: Home },
      { key: "recentlyplayed", name: "Recently Played", icon: History },
      { key: "collections", name: "Collections", icon: Library },
      { key: "playlists", name: "Playlists", icon: ListMusic },
  ];
  return (
    <div className="flex h-screen bg-black overflow-hidden relative">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Roboto:wght@400;500&display=swap');
        body {
          font-family: 'Roboto', sans-serif;
        }
        h1, h2, h3, h4, h5, h6, .font-montserrat {
          font-family: 'Montserrat', sans-serif;
        }
      `}</style>
    <aside 
      className={`w-64 bg-[#080e15] text-neutral-300 flex flex-col h-screen fixed top-0 left-0 pt-6 pb-4 z-40 
                 transform transition-transform duration-300 ease-in-out 
                 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                 md:translate-x-0 md:h-[calc(100vh-6rem)]`}
    >
      <div className="px-6 mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white font-montserrat tracking-wider flex items-center">
          <span className="text-3xl text-purple-400 mr-2">*</span>
          TiMN
        </h1>
        <button onClick={() => setIsMobileSidebarOpen(false)} className="cursor-pointer p-1 text-neutral-400 hover:text-white md:hidden"> 
           <X size={24}/>
        </button>
      </div>
      <nav className="flex-grow px-3 space-y-1 mb-8 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.key === activeView;
          const activateSidebarItem = () => {
            switchAppView(item.key);
            () => setIsMobileSidebarOpen(false)
          }
          return (
            <button 
              key={item.key}
              onClick={activateSidebarItem}
              className={`cursor-pointer flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out group w-full text-left ${isActive
                ? 'bg-neutral-800 text-white'
                : 'hover:bg-neutral-800/50 hover:text-white'
                }`}
            >
              <item.icon className={`w-5 h-5 mr-3 flex-shrink-0 ${isActive ? 'text-purple-400' : 'text-neutral-400 group-hover:text-white'}`} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>
      <div className="mt-auto px-3 border-t border-neutral-700 pt-4 space-y-1 flex-shrink-0">
        <a href="#" className="flex items-center px-3 py-2.5 rounded-md text-sm font-medium text-neutral-400 hover:bg-neutral-800/50 hover:text-white transition-colors duration-150 ease-in-out group">
          <Settings className="w-5 h-5 mr-3 text-neutral-400 group-hover:text-white" />
          Settings
        </a>
        <a href="#" className="flex items-center px-3 py-2.5 rounded-md text-sm font-medium text-neutral-400 hover:bg-neutral-800/50 hover:text-white transition-colors duration-150 ease-in-out group">
          <LogOut className="w-5 h-5 mr-3 text-neutral-400 group-hover:text-white" />
          Log Out
        </a>
      </div>
    </aside>
      {isMobileSidebarOpen && (
         <div 
           onClick={() => setIsMobileSidebarOpen(false)} 
           className="fixed inset-0 bg-black/60 z-30 md:hidden"
          ></div>
       )}
      <div className="flex-1 flex flex-col md:ml-64">
        <TopBar 
           searchQuery={searchQuery} 
           setSearchQuery={setSearchQuery} 
           setActiveView={setActiveView}
           openMobileSidebar={() => setIsMobileSidebarOpen(true)} 
         />
        <div className="flex-1 overflow-y-auto pb-24 bg-black/50">
          {activeView === 'home' && <HomeView />} 
          {activeView === 'recentlyplayed' && <RecentlyPlayedView />} 
          {activeView === 'collections' && <CollectionsView />} 
          {activeView === 'playlists' && <PlaylistsListView setActiveView={setActiveView} />}
          {activeView === 'playlistdetail' && <PlaylistDetailView />}
          {activeView === 'search' && <SearchView searchQuery={searchQuery} />} 
        </div>
      </div>
      <PlayerBar />
    </div>
  );
};

export default PodcastApp;
