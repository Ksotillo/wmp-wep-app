'use client'
import React from 'react';
import { Search, MessageCircle, Plus, Heart, MessageSquare, Share, Repeat, MoreHorizontal, ArrowLeft, LayoutGrid, List, Film, Star, X } from 'lucide-react';
import Image from 'next/image'; 
import { Montserrat, Roboto } from 'next/font/google'; 
import { motion, AnimatePresence } from 'framer-motion'; 


const STORY_DURATION_SECONDS = 5; 
const TIMER_INTERVAL_MS = 50; 
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['700'], 
});
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500'], 
});
const storiesData = [
  { id: 'you', name: 'You', img: 'https://randomuser.me/api/portraits/lego/1.jpg', isAdd: true, storyImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&auto=format&fit=crop' },
  { id: 'david', name: 'David', img: 'https://randomuser.me/api/portraits/men/75.jpg', storyImage: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=900&auto=format&fit=crop' },
  { id: 'santi', name: 'Santi', img: 'https://randomuser.me/api/portraits/men/76.jpg', storyImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&auto=format&fit=crop' },
  { id: 'musofi', name: 'Musofi', img: 'https://randomuser.me/api/portraits/women/75.jpg', storyImage: 'https://images.unsplash.com/photo-1532386236358-a33d8a9434e3?w=900&auto=format&fit=crop' },
  { id: 'nexus', name: 'Nexus', img: 'https://randomuser.me/api/portraits/men/78.jpg', storyImage: 'https://images.unsplash.com/photo-1493612276216-ee3925520721?w=900&auto=format&fit=crop' },
  { id: 'mengly', name: 'Mengly', img: 'https://randomuser.me/api/portraits/men/79.jpg', storyImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&auto=format&fit=crop' },
  { id: 'alex', name: 'Alex', img: 'https://randomuser.me/api/portraits/women/78.jpg', storyImage: 'https://images.unsplash.com/photo-1558981852-426c6c22a060?w=900&auto=format&fit=crop' },
  
  { id: 'chris', name: 'Chris', img: 'https://randomuser.me/api/portraits/men/82.jpg', storyImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop' },
  { id: 'jenna', name: 'Jenna', img: 'https://randomuser.me/api/portraits/women/82.jpg', storyImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=900&auto=format&fit=crop' },
];
const filtersData = ['All', 'Travel', 'Food', 'Science', 'Technology', 'Art', 'Music', 'Sports', 'Fashion', 'Health', 'Business', 'Education', 'Entertainment', 'News', 'Politics'];
const initialFeedData = [
  {
    id: 'post1',
    user: { name: 'David James', img: 'https://randomuser.me/api/portraits/men/75.jpg' },
    time: '2h ago',
    text: 'In 2025, fashion embraces sustainability, bold designs, vibrant colors, futuristic textures...',
    hashtags: ['#SustainableStyle', '#EcoChic', '#Inspiration', '#motivation'],
    image: 'https://images.unsplash.com/photo-1602776078307-8747d6f9d89f?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3',
    likes: 70,
    comments: 32,
    reposts: 9,
    shares: 14,
    category: 'Travel',
    liked: false,
  },
  {
    id: 'post2',
    user: { name: 'Radiant Rose', img: 'https://randomuser.me/api/portraits/women/78.jpg' },
    time: '5h ago',
    text: 'Deep dive into the latest developments in Large Language Models and their applications.',
    hashtags: ['#AI', '#LLM', '#DataScience', '#ML'],
    image: 'https://images.unsplash.com/photo-1703252293659-97a00ecb827b?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3',
    likes: 120,
    comments: 55,
    reposts: 15,
    shares: 28,
    category: 'Food',
    liked: false,
  },
  {
    id: 'post3',
    user: { name: 'Santi Ago', img: 'https://randomuser.me/api/portraits/men/76.jpg' },
    time: '8h ago',
    text: 'Exploring the new features in the latest React update. Performance improvements look promising!',
    hashtags: ['#ReactJS', '#Frontend', '#WebDev', '#JavaScript'],
    image: 'https://images.unsplash.com/photo-1612627206499-7af3b85dd50f?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3',
    likes: 215,
    comments: 88,
    reposts: 30,
    shares: 45,
    category: 'Technology',
    liked: false,
  },
   {
    id: 'post4',
    user: { name: 'Tech Guru', img: 'https://randomuser.me/api/portraits/lego/5.jpg' },
    time: '1 day ago',
    text: 'Just published a guide on Python best practices for data analysis. Check it out!',
    hashtags: ['#Python', '#Programming', '#Coding', '#BestPractices'],
    image: 'https://images.unsplash.com/photo-1611917438110-62aafafa28bc?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3',
    likes: 95,
    comments: 41,
    reposts: 12,
    shares: 22,
    category: 'Art',
    liked: false,
  },
];
type Post = typeof initialFeedData[0];
type UserProfile = {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  headerImage: string;
  stats: {
    followers: number;
    following: number;
    replies: number;
  };
  photos: string[];
};
const userProfilesData: UserProfile[] = [
  {
    id: 'alexander_marcus',
    name: 'Alexander Marcus',
    bio: 'Preserve Nature, Ensure Future',
    avatar: 'https://randomuser.me/api/portraits/men/81.jpg',
    headerImage: 'https://images.unsplash.com/photo-1614678096587-0ad50faf1603?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3',
    stats: { followers: 501, following: 163, replies: 353 },
    photos: [
      "https://images.unsplash.com/photo-1602776078307-8747d6f9d89f?q=80&w=300&auto=format&fit=crop&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1703252293659-97a00ecb827b?q=80&w=300&auto=format&fit=crop&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1532386236358-a33d8a9434e3?w=300&auto=format&fit=crop", 
      "https://images.unsplash.com/photo-1611917438110-62aafafa28bc?q=80&w=300&auto=format&fit=crop&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1604914047221-e9cd28c72971?q=80&w=300&auto=format&fit=crop&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1634141428610-1781a3862a9b?q=80&w=300&auto=format&fit=crop&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1634141428610-1781a3862a9b?q=80&w=300&auto=format&fit=crop&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1634141428610-1781a3862a9b?q=80&w=300&auto=format&fit=crop&ixlib=rb-4.0.3",
    ],
  },
  {
    id: 'david_james', 
    name: 'David James',
    bio: 'Exploring the world, one photo at a time.',
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
    headerImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop',
    stats: { followers: 1250, following: 300, replies: 412 },
    photos: [
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=300&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=300&auto=format&fit=crop",
    ],
  },
   {
    id: 'radiant_rose', 
    name: 'Radiant Rose',
    bio: 'Finding beauty in everyday moments.',
    avatar: 'https://randomuser.me/api/portraits/women/78.jpg',
    headerImage: 'https://images.unsplash.com/photo-1488330890490-c291ec1364d0?w=800&auto=format&fit=crop',
    stats: { followers: 880, following: 510, replies: 105 },
    photos: [
        "https://images.unsplash.com/photo-1494548162494-384bba4ab999?w=300&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=300&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=300&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&auto=format&fit=crop",
    ],
  },
  
];


const userIdToProfileIdMap: { [key: string]: string } = {
  'David James': 'david_james',
  'Radiant Rose': 'radiant_rose',
  'Alexander Marcus': 'alexander_marcus', 
  
  'David': 'david_james', 
  'Santi': 'alexander_marcus', 
  'Musofi': 'radiant_rose', 
   
};

type ProfileTab = 'grid' | 'list' | 'reels' | 'saved';
interface MentorFeedPageProps {
  posts: Post[];
  onNavigateToProfile: (profileId: string) => void; 
  onOpenStory: (storyId: string) => void;
  onToggleLike: (postId: string) => void;
}
const MentorFeedPage: React.FC<MentorFeedPageProps> = ({ posts, onNavigateToProfile, onOpenStory, onToggleLike }) => {
  const [activeFilter, setActiveFilter] = React.useState('All');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isSearchVisible, setIsSearchVisible] = React.useState(false);

  function selectFilter(f: string) {
    setActiveFilter(f);
  }

  const handleShareClick = async (p: Post) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Check out this post by ${p.user.name}`,
          text: p.text,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      alert('Sharing is not supported on this browser.');
    }
  };

  const filteredFeed = posts
    .filter(p => activeFilter === 'All' || p.category === activeFilter)
    .filter(p => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        p.text.toLowerCase().includes(query) ||
        p.user.name.toLowerCase().includes(query) ||
        p.hashtags.some(tag => tag.toLowerCase().includes(query))
      );
    });

  const feedPostItems = filteredFeed.length > 0 ? (
    filteredFeed.map((item) => {
      const profileId = userIdToProfileIdMap[item.user.name];
      return (
        <article key={item.id} className="border-b border-gray-800 py-4">
          <div className="flex items-center justify-between px-4 pb-3">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => profileId && onNavigateToProfile(profileId)}
            >
              <Image src={item.user.img} alt={item.user.name} width={32} height={32} className="w-8 h-8 rounded-full object-cover" />
              <span className="text-sm font-semibold text-gray-200">{item.user.name}</span>
              <span className="text-xs text-gray-500">{item.time}</span>
            </div>
          </div>

          <div className="px-4 pb-3">
             <p className="text-sm text-gray-300 mb-1">{item.text}</p>
             <div className="flex flex-wrap gap-1">
               {item.hashtags.map(tag => (
                 <span key={tag} className="text-sm text-purple-400 cursor-pointer hover:underline">{tag}</span>
               ))}
             </div>
          </div>
          
          <div className="relative w-full aspect-square bg-gray-800">
             <Image src={item.image} alt="Post image" layout="fill" objectFit="cover" className="w-full h-full" sizes="(max-width: 640px) 100vw, 640px" />
           </div>
           
           <div className="flex items-center justify-start gap-5 px-4 pt-3 text-gray-400">
             <button onClick={(e) => { e.stopPropagation(); onToggleLike(item.id); }} className={`flex items-center gap-1.5 cursor-pointer transition-colors focus:outline-none ${item.liked ? 'text-red-500' : 'hover:text-red-500 focus:text-red-500'}`} >
               <Heart className={`w-5 h-5 ${item.liked ? 'fill-current' : ''}`} />
               <span className="text-xs font-medium">{item.likes}</span>
             </button>
             <button className="flex items-center gap-1.5 cursor-pointer hover:text-blue-400 focus:outline-none focus:text-blue-400"> <MessageSquare className="w-5 h-5" /> <span className="text-xs font-medium">{item.comments}</span> </button>
             <button className="flex items-center gap-1.5 cursor-pointer hover:text-green-500 focus:outline-none focus:text-green-500"> <Repeat className="w-5 h-5" /> <span className="text-xs font-medium">{item.reposts}</span> </button>
             <button onClick={(e) => { e.stopPropagation(); handleShareClick(item); }} className="flex items-center gap-1.5 cursor-pointer hover:text-yellow-500 focus:outline-none focus:text-yellow-500" > <Share className="w-5 h-5" /> <span className="text-xs font-medium">{item.shares}</span> </button>
           </div>
         </article>
       );
     })
   ) : (
     <div className="text-center py-10 text-gray-500">
       No posts found matching your criteria.
     </div>
   );

  return (
    <div className={`w-full min-h-screen ${roboto.className} bg-black text-gray-100`}>
      <div className="w-full max-w-4xl mx-auto flex flex-col min-h-screen">
        
        <header className="flex items-center justify-between p-4 sticky top-0 bg-black/80 backdrop-blur-sm z-10 border-b border-gray-800">
          {isSearchVisible ? (
            <>
              <button onClick={() => { setIsSearchVisible(false); setSearchQuery(''); }} className="p-1 text-gray-400 hover:text-white cursor-pointer"><ArrowLeft className="w-6 h-6" /></button>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts..."
                className="flex-grow mx-2 px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                autoFocus
              />
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-pink-500 rounded-md"></div>
                <h1 className={`${montserrat.className} text-xl font-bold`}>Mentor</h1>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setIsSearchVisible(true)} className="p-1 text-gray-400 hover:text-white cursor-pointer"><Search className="w-6 h-6" /></button>
                <MessageCircle className="w-6 h-6 text-gray-400 cursor-pointer" />
              </div>
            </>
          )}
        </header>

        
        <nav className="px-4 pt-2 pb-3 mt-4 overflow-x-auto scrollbar-hide">
           <ul className="flex space-x-3">
             {filtersData.map((f) => (
               <li key={f}>
                 <button
                   onClick={() => selectFilter(f)}
                   className={`
                     whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black cursor-pointer
                     ${activeFilter === f
                       ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md'
                       : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                     }
                   `}
                 >
                   {f}
                 </button>
               </li>
             ))}
           </ul>
        </nav>

        
        <section aria-label="User Stories" className="px-4 pb-4 border-b border-gray-800">
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
            {storiesData.map((s) => {
              const profileId = userIdToProfileIdMap[s.name];
              return (
                <div
                  key={s.id}
                  onClick={() => !s.isAdd && onOpenStory(s.id)}
                  className={`flex flex-col items-center gap-1.5 flex-shrink-0 w-16 ${s.isAdd ? '' : 'cursor-pointer'}`}
                >
                   
                  <div className="relative">
                     <Image src={s.img} alt={s.name} width={56} height={56} className="w-14 h-14 rounded-full object-cover border-2 border-purple-500 p-0.5" />
                     {s.isAdd && (
                       <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-0.5 border-2 border-black">
                         <Plus className="w-3 h-3 text-white" strokeWidth={3}/>
                       </div>
                     )}
                   </div>
                  <span className="text-xs text-gray-300 truncate w-full text-center">{s.name}</span>
                </div>
              );
            })}
          </div>
        </section>

        
        <main className="flex-1 overflow-y-auto scrollbar-hide pb-4">
          {feedPostItems}
        </main>
      </div>
    </div>
  );
};


interface UserProfileScreenProps {
  userProfile: UserProfile | undefined;
  goBack: () => void;
}

const UserProfileScreen: React.FC<UserProfileScreenProps> = ({ userProfile, goBack }) => {
  const [activeTab, setActiveTab] = React.useState<ProfileTab>('grid');
  
  const tabChangeHandler = (tab: ProfileTab) => {
     setActiveTab(tab);
  };

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-gray-400">
         <p>User profile not found.</p>
         
         
      </div>
    );
  }

  return (
    <div className={`w-full min-h-screen ${roboto.className} bg-black text-gray-100`}>
      <div className="w-full max-w-4xl mx-auto flex flex-col min-h-screen">
        
        <header className="relative h-48 md:h-64 w-full">
          <Image
            src={userProfile.headerImage} 
            alt="Header background"
            layout="fill"
            objectFit="cover"
            className="opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 pt-6">
            <button onClick={goBack} className="cursor-pointer p-1 rounded-full bg-black/30 hover:bg-black/50 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className={`${montserrat.className} text-lg font-bold text-white`}>{userProfile.name}'s Profile</h1>
          </div>
        </header>

        
        <section className="relative flex flex-col items-center px-4 -mt-12 md:-mt-16 w-full max-w-md mx-auto">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-black overflow-hidden mb-3 bg-gradient-to-tr from-purple-600 to-pink-500 p-0.5">
            <Image
              src={userProfile.avatar} 
              alt={userProfile.name} 
              width={128} 
              height={128}
              className="rounded-full object-cover w-full h-full"
            />
          </div>
          <h2 className={`${montserrat.className} text-xl font-bold text-white mb-0.5`}>{userProfile.name}</h2> 
          <p className="text-sm text-gray-400 mb-4">{userProfile.bio}</p> 
          <div className="flex justify-around w-full mb-4 text-center">
            <div>
              <p className={`${montserrat.className} text-lg font-bold text-white`}>{userProfile.stats.followers}</p> 
              <p className="text-xs text-gray-400">Followers</p>
            </div>
            <div>
              <p className={`${montserrat.className} text-lg font-bold text-white`}>{userProfile.stats.following}</p> 
              <p className="text-xs text-gray-400">Following</p>
            </div>
            <div>
              <p className={`${montserrat.className} text-lg font-bold text-white`}>{userProfile.stats.replies}</p> 
              <p className="text-xs text-gray-400">Replies</p>
            </div>
          </div>
          <div className="flex w-full gap-3 mb-4">
            <button className="flex-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 py-2 text-sm font-medium text-white shadow-md hover:opacity-90 transition-opacity cursor-pointer">
              Followers
            </button>
            <button className="flex-1 rounded-full bg-gray-700 py-2 text-sm font-medium text-gray-200 hover:bg-gray-600 transition-colors cursor-pointer">
              Message
            </button>
          </div>
        </section>

        
        <nav className="flex justify-around border-b border-gray-800">
           <button onClick={() => tabChangeHandler('grid')} className={`p-3 cursor-pointer transition-colors ${activeTab === 'grid' ? 'text-white border-b-2 border-white' : 'text-gray-500 hover:text-gray-300'}`}><LayoutGrid className="w-5 h-5" /></button>
             <button onClick={() => tabChangeHandler('list')} className={`p-3 cursor-pointer transition-colors ${activeTab === 'list' ? 'text-white border-b-2 border-white' : 'text-gray-500 hover:text-gray-300'}`}><List className="w-5 h-5" /></button>
             <button onClick={() => tabChangeHandler('reels')} className={`p-3 cursor-pointer transition-colors ${activeTab === 'reels' ? 'text-white border-b-2 border-white' : 'text-gray-500 hover:text-gray-300'}`}><Film className="w-5 h-5" /></button>
             <button onClick={() => tabChangeHandler('saved')} className={`p-3 cursor-pointer transition-colors ${activeTab === 'saved' ? 'text-white border-b-2 border-white' : 'text-gray-500 hover:text-gray-300'}`}><Star className="w-5 h-5" /></button>
        </nav>

        
        <main className="flex-1 overflow-y-auto scrollbar-hide p-1 md:p-2">
          {activeTab === 'grid' && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-1 md:gap-2">
              {userProfile.photos.map((photoUrl: string, i: number) => (
                <div key={`${userProfile.id}-grid-${i}`} className="relative aspect-square w-full bg-gray-800 rounded-md overflow-hidden cursor-pointer">
                  <Image src={photoUrl} alt={`User photo ${i + 1}`} layout="fill" objectFit="cover" className="hover:opacity-80 transition-opacity" sizes="(max-width: 640px) 33vw, 200px" />
                </div>
              ))}
            </div>
          )}
          {activeTab === 'list' && (
             <div className="space-y-2 py-2">
                 {userProfile.photos.map((photoUrl: string, i: number) => (
                     <div key={`${userProfile.id}-list-${i}`} className="relative w-full aspect-[4/3] bg-gray-800 rounded-md overflow-hidden"> 
                         <Image src={photoUrl} alt={`User photo ${i + 1}`} layout="fill" objectFit="cover" />
                         
                     </div>
                 ))}
             </div>
           )}
          {activeTab === 'reels' && <div className="p-4 text-center text-gray-500">Reels View Not Implemented</div>}
          {activeTab === 'saved' && <div className="p-4 text-center text-gray-500">Saved View Not Implemented</div>}
        </main>

      </div>
    </div>
  );
};


interface StoryViewerProps {
  storyId: string;
  stories: typeof storiesData;
  onClose: () => void;
  onNextStory: (currentStoryId: string) => void; 
}

const StoryViewer: React.FC<StoryViewerProps> = ({ storyId, stories, onClose, onNextStory }) => {
  const story = stories.find(s => s.id === storyId);
  const [timeLeft, setTimeLeft] = React.useState(STORY_DURATION_SECONDS * 1000);
  React.useEffect(() => {
    
    setTimeLeft(STORY_DURATION_SECONDS * 1000);

    const timerId = setInterval(() => {
      setTimeLeft(prevTime => {
        const newTime = prevTime - TIMER_INTERVAL_MS;
        if (newTime <= 0) {
          clearInterval(timerId); 
          onNextStory(storyId); 
          return 0;
        }
        return newTime;
      });
    }, TIMER_INTERVAL_MS);

    
    return () => clearInterval(timerId);

  }, [storyId, onNextStory]); 

  if (!story || story.isAdd) {
    return null;
  }
  const progressPercent = (timeLeft / (STORY_DURATION_SECONDS * 1000)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div className="relative max-w-md w-full max-h-[90vh] aspect-[9/16] bg-gray-900 rounded-lg overflow-hidden shadow-xl" onClick={(e) => e.stopPropagation()}>
        
        <div className="absolute top-2 left-2 right-2 h-1 bg-white/30 rounded-full overflow-hidden z-20">
          <motion.div
            className="h-full bg-white"
            initial={{ width: '100%' }} 
            animate={{ width: `${progressPercent}%` }} 
            transition={{ duration: TIMER_INTERVAL_MS / 1000, ease: "linear" }} 
          />
        </div>

        {story.storyImage && (
           <Image
            src={story.storyImage}
            alt={`Story from ${story.name}`}
            layout="fill"
            objectFit="cover"
            priority
          />
        )}
        
        <div className="absolute top-0 left-0 right-0 pt-5 px-3 bg-gradient-to-b from-black/50 to-transparent flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
             <Image
               src={story.img}
               alt={story.name}
               width={32}
               height={32}
               className="w-8 h-8 rounded-full object-cover border border-white/50"
             />
             <span className="text-sm font-semibold text-white drop-shadow-md">{story.name}</span>
           </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-black/30 hover:bg-black/50 text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};



export default function App() {
  const [currentPage, setCurrentPage] = React.useState<'feed' | 'profile'>('feed');
  const [viewingStoryId, setViewingStoryId] = React.useState<string | null>(null);
  const [posts, setPosts] = React.useState<Post[]>(initialFeedData);
  const [viewingProfileId, setViewingProfileId] = React.useState<string | null>(null);
  const viewableStories = storiesData.filter(story => !story.isAdd);
  const showProfile = (profileId: string) => {
    setViewingStoryId(null);
    setViewingProfileId(profileId); 
    setCurrentPage('profile');
  };
  const showFeed = () => {
    setViewingStoryId(null);
    setViewingProfileId(null); 
    setCurrentPage('feed');
  };
  const openStory = (storyId: string) => { const storyToOpen = viewableStories.find(s => s.id === storyId) ?? viewableStories[0]; if (storyToOpen) { setViewingStoryId(storyToOpen.id); } };
  const closeStory = () => { setViewingStoryId(null); };
  const handleNextStory = (currentStoryId: string) => { const currentIndex = viewableStories.findIndex(s => s.id === currentStoryId); if (currentIndex !== -1 && currentIndex < viewableStories.length - 1) { const nextStory = viewableStories[currentIndex + 1]; setViewingStoryId(nextStory.id); } else { closeStory(); } };
  const handleToggleLike = (postId: string) => { setPosts(currentPosts => currentPosts.map(post => { if (post.id === postId) { const newLikedState = !post.liked; const newLikeCount = newLikedState ? post.likes + 1 : post.likes - 1; return { ...post, liked: newLikedState, likes: newLikeCount }; } return post; }) ); };
   const currentProfileData = userProfilesData.find(p => p.id === viewingProfileId);

  return (
    <>
      {currentPage === 'feed' && (
        <MentorFeedPage
          posts={posts}
          onNavigateToProfile={showProfile} 
          onOpenStory={openStory}
          onToggleLike={handleToggleLike}
        />
      )}
      {currentPage === 'profile' && (
        
        <UserProfileScreen userProfile={currentProfileData} goBack={showFeed} />
      )}

      <AnimatePresence>
         {viewingStoryId && (
           <StoryViewer
             storyId={viewingStoryId}
             stories={storiesData}
             onClose={closeStory}
             onNextStory={handleNextStory}
           />
         )}
       </AnimatePresence>
    </>
  );
}



