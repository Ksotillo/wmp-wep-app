"use client";
import { useEffect, useRef, useState } from "react";
import {
    ThumbsUp,
    ThumbsDown,
    MessageSquare,
    ChevronDown,
    Send,
    Hash,
    TrendingUp,
    Search,
    Flame,
    Clock,
    Bell,
    User,
    Settings,
    LogOut,
    BookmarkPlus,
    Share,
    Filter,
    Zap,
    Monitor,
    Smile,
    Music,
    GamepadIcon,
    Newspaper,
    Brush,
    Beaker,
    SendHorizonal,
} from "lucide-react";
import { Toaster, toast } from "sonner";

type Mood = "all" | "funny" | "sad" | "angry" | "happy" | "confused";
type Channel = "general" | "tech" | "memes" | "science" | "gaming" | "news" | "art" | "music";

const moods: { value: Mood; label: string; emoji: string }[] = [
    { value: "happy", label: "Happy", emoji: "😊" },
    { value: "funny", label: "Funny", emoji: "😂" },
    { value: "sad", label: "Sad", emoji: "😢" },
    { value: "angry", label: "Angry", emoji: "😠" },
    { value: "confused", label: "Confused", emoji: "🤔" },
];

const channels: { id: Channel; name: string; description: string; color: string; icon: any }[] = [
    { id: "general", name: "General", description: "Discuss any topic in this general channel", color: "bg-blue-500", icon: Zap },
    { id: "tech", name: "Technology", description: "Latest tech news and discussions", color: "bg-indigo-500", icon: Monitor },
    { id: "memes", name: "Memes", description: "Funny posts and entertaining content", color: "bg-yellow-500", icon: Smile },
    { id: "science", name: "Science", description: "Scientific discoveries and interesting facts", color: "bg-green-500", icon: Beaker },
    { id: "gaming", name: "Gaming", description: "Discussions about video games", color: "bg-purple-500", icon: GamepadIcon },
    { id: "news", name: "News", description: "Current events and news", color: "bg-red-500", icon: Newspaper },
    { id: "art", name: "Art", description: "Art, design, and creative content", color: "bg-pink-500", icon: Brush },
    { id: "music", name: "Music", description: "Music recommendations and discussions", color: "bg-teal-500", icon: Music },
];

type Post = {
    id: string;
    content: string;
    mood: Mood;
    channel: Channel;
    votes: number;
    timestamp: Date;
    replies: Reply[];
    bookmarked?: boolean;
    author?: string;
    awards?: number;
    userVoted?: 'up' | 'down' | null;
};

type Reply = {
    id: string;
    content: string;
    votes: number;
    timestamp: Date;
    author?: string;
    userVoted?: 'up' | 'down' | null;
};

const initialPosts: Post[] = [
    {
        id: "1",
        content: "This is my first post. I can't believe I'm doing this! Please like it",
        mood: "funny",
        channel: "general",
        votes: 42,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        replies: [
            {
                id: "1-1",
                content: "Great post, looking forward to more!",
                votes: 12,
                timestamp: new Date(Date.now() - 1000 * 60 * 30),
                author: "AnonymousUser123",
            },
        ],
        bookmarked: true,
        author: "TechGuru",
        awards: 2,
    },
    {
        id: "2",
        content: "I'm feeling very sad today. What should I do?",
        mood: "sad",
        channel: "general",
        votes: 89,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
        replies: [
            {
                id: "2-1",
                content: "Sending you a virtual hug. It will get better with time.",
                votes: 24,
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
                author: "HelpfulFriend42",
            },
            {
                id: "2-2",
                content: "I'm in the same situation. It's the worst feeling.",
                votes: 18,
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
            },
        ],
        awards: 5,
    },
    {
        id: "3",
        content: "Just got promoted at work! Feeling amazing!",
        mood: "happy",
        channel: "news",
        votes: 65,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
        replies: [
            {
                id: "3-1",
                content: "Congratulations! You earned it with your hard work!",
                votes: 15,
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 7),
                author: "SupportiveUser",
            },
        ],
        awards: 3,
    },
    {
        id: "4",
        content: "It's been such a long day. I just want to go home and sleep.",
        mood: "angry",
        channel: "general",
        votes: 103,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
        replies: [
            {
                id: "4-1",
                content: "Revenge is best served cold, I'm with you!!",
                votes: 32,
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10),
            },
            {
                id: "4-2",
                content: "I'll handle the rest, don't worry",
                votes: 28,
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 9),
                author: "RevengeExpert",
            },
        ],
        author: "TiredWorker",
    },
    {
        id: "5",
        content: "What do you think about the new PS6? Isn't it too expensive?",
        mood: "confused",
        channel: "gaming",
        votes: 75,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        replies: [
            {
                id: "5-1",
                content: "The price is high but the features are worth it in my opinion.",
                votes: 20,
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20),
                author: "GamerPro",
            },
        ],
        awards: 1,
    },
    {
        id: "6",
        content: "I want to share the funniest thing I saw today: My coworker fell asleep during a meeting and started snoring!",
        mood: "funny",
        channel: "memes",
        votes: 210,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18),
        replies: [
            {
                id: "6-1",
                content: "Haha! That happened to me once. So embarrassing!",
                votes: 45,
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 17),
            },
        ],
        bookmarked: true,
    },
    {
        id: "7",
        content: "Finals are coming up and I haven't studied at all. Help!",
        mood: "sad",
        channel: "general",
        votes: 55,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10),
        replies: [
            {
                id: "7-1",
                content: "It's never too late to make a study plan. I can help!",
                votes: 8,
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 9),
                author: "StudyExpert",
            },
        ],
    },
];

const formatTimeAgo = (date: Date) => {
    const now = Date.now();
    const diffInSeconds = Math.floor((now - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
        return "Just now";
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return diffInMinutes === 1 ? "1 minute ago" : `${diffInMinutes} minutes ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return diffInHours === 1 ? "1 hour ago" : `${diffInHours} hours ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
        return diffInDays === 1 ? "1 day ago" : `${diffInDays} days ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return diffInMonths === 1 ? "1 month ago" : `${diffInMonths} months ago`;
};

const moodEmojiMap: Record<Mood, string> = {
    funny: "😂",
    sad: "😢",
    angry: "😠",
    happy: "😊",
    confused: "🤔",
    all: "",
};

const getMoodEmoji = (mood: Mood) => moodEmojiMap[mood];

// Animation for realistic flame icon
const FlameIcon = ({ className }: { className?: string }) => {
    return (
        <div className="relative h-6 w-6 flex items-center justify-center">
            
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-5 w-4 bg-orange-500 rounded-full blur-[2px] animate-flame-dance"></div>
            </div>
            
            
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-3 w-2 bg-yellow-300 rounded-full blur-[1px] animate-flame-flicker"></div>
            </div>
            
            
            <div className="absolute inset-0 flex items-center justify-center z-10">
                <Flame className="h-5 w-5 text-orange-500" />
            </div>
            
            
            <div className="absolute top-0 left-1/2 -translate-x-1/2 flex justify-center">
                <div className="h-1 w-1 bg-yellow-200 rounded-full animate-spark-1 opacity-0"></div>
            </div>
            <div className="absolute top-1 left-1/2 -translate-x-1/4 flex justify-center">
                <div className="h-1 w-1 bg-orange-300 rounded-full animate-spark-2 opacity-0"></div>
            </div>
        </div>
    );
};

function App() {
    const [posts, setPosts] = useState<Post[]>(initialPosts);
    const [currentMood, setCurrentMood] = useState<Mood>("all");
    const [currentChannel, setCurrentChannel] = useState<Channel>("general");
    const [sortBy, setSortBy] = useState<"latest" | "top" | "hot">("top");
    const [newPostContent, setNewPostContent] = useState("");
    const [newPostMood, setNewPostMood] = useState<Mood>("happy");
    const [replyContents, setReplyContents] = useState<Record<string, string>>({});
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [moodOpen, setMoodOpen] = useState(false);
    const [channelOpen, setChannelOpen] = useState(false);
    const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [notification] = useState(3);
    const [hasScrolled, setHasScrolled] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const channelDropdownRef = useRef<HTMLDivElement>(null);
    const notificationMenuRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setMoodOpen(false);
            }
            if (channelDropdownRef.current && !channelDropdownRef.current.contains(e.target as Node)) {
                setChannelOpen(false);
            }
            if (notificationMenuRef.current && !notificationMenuRef.current.contains(e.target as Node)) {
                setNotificationMenuOpen(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            if (scrollPosition > 10) {
                setHasScrolled(true);
            } else {
                setHasScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const topPost = [...posts].sort((a, b) => b.votes - a.votes)[0];

    const filteredPosts = posts
        .filter(
            (post) =>
                (currentMood === "all" || post.mood === currentMood) &&
                post.channel === currentChannel &&
                (searchQuery === "" || post.content.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .sort((a, b) => {
            if (sortBy === "latest") {
                return b.timestamp.getTime() - a.timestamp.getTime();
            } else if (sortBy === "hot") {
                const aScore = a.votes * ((1 / (Date.now() - a.timestamp.getTime())) * 10000000000);
                const bScore = b.votes * ((1 / (Date.now() - b.timestamp.getTime())) * 10000000000);
                return bScore - aScore;
            } else {
                return b.votes - a.votes;
            }
        });

    const handleAddPost = () => {
        if (!newPostContent.trim()) return;

        const newPost: Post = {
            id: Date.now().toString(),
            content: newPostContent,
            mood: newPostMood,
            channel: currentChannel,
            votes: 0,
            timestamp: new Date(Date.now() + 1000),
            replies: [],
        };

        setPosts([newPost, ...posts]);
        toast.success("Post created!");
        setNewPostContent("");
    };

    const handleVote = (postId: string, value: number) => {
        setPosts(posts.map((post) => {
            if (post.id === postId) {
                // If already voted in the same direction, remove the vote
                if ((value > 0 && post.userVoted === 'up') || (value < 0 && post.userVoted === 'down')) {
                    return { 
                        ...post, 
                        votes: post.votes - value,
                        userVoted: null
                    };
                }
                // If already voted in the opposite direction, reverse the vote (counts double)
                else if ((value > 0 && post.userVoted === 'down') || (value < 0 && post.userVoted === 'up')) {
                    return { 
                        ...post, 
                        votes: post.votes + (value * 2), // Double the effect to reverse previous vote
                        userVoted: value > 0 ? 'up' : 'down'
                    };
                }
                // New vote
                else {
                    return { 
                        ...post, 
                        votes: post.votes + value,
                        userVoted: value > 0 ? 'up' : 'down'
                    };
                }
            }
            return post;
        }));
    };

    const handleReplyVote = (postId: string, replyId: string, value: number) => {
        setPosts(
            posts.map((post) =>
                post.id === postId
                    ? {
                          ...post,
                          replies: post.replies.map((reply) => {
                              if (reply.id === replyId) {
                                  // If already voted in the same direction, remove the vote
                                  if ((value > 0 && reply.userVoted === 'up') || (value < 0 && reply.userVoted === 'down')) {
                                      return { 
                                          ...reply, 
                                          votes: reply.votes - value,
                                          userVoted: null
                                      };
                                  }
                                  // If already voted in the opposite direction, reverse the vote (counts double)
                                  else if ((value > 0 && reply.userVoted === 'down') || (value < 0 && reply.userVoted === 'up')) {
                                      return { 
                                          ...reply, 
                                          votes: reply.votes + (value * 2), // Double the effect to reverse previous vote
                                          userVoted: value > 0 ? 'up' : 'down'
                                      };
                                  }
                                  // New vote
                                  else {
                                      return { 
                                          ...reply, 
                                          votes: reply.votes + value,
                                          userVoted: value > 0 ? 'up' : 'down'
                                      };
                                  }
                              }
                              return reply;
                          }),
                      }
                    : post
            )
        );
    };

    const handleAddReply = (postId: string) => {
        const replyContent = replyContents[postId];
        if (!replyContent?.trim()) return;

        const newReply: Reply = {
            id: `${postId}-${Date.now()}`,
            content: replyContent,
            votes: 0,
            timestamp: new Date(),
        };

        setPosts(posts.map((post) => (post.id === postId ? { ...post, replies: [...post.replies, newReply] } : post)));

        toast.success("Reply added!");

        setReplyContents({
            ...replyContents,
            [postId]: "",
        });
        setReplyingTo(null);
    };

    const handleBookmark = (postId: string) => {
        setPosts(posts.map((post) => (post.id === postId ? { ...post, bookmarked: !post.bookmarked } : post)));
        toast.success("Added to collection!");
    };

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
    };

    const totalPostsInChannel = posts.filter((post) => post.channel === currentChannel).length;

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-violet-50 to-indigo-100 dark:from-indigo-950 dark:to-violet-950 font-sans">
            
            <style jsx global>{`
                @keyframes gradient-flow {
                    0% {
                        background-position: 0% 50%;
                        background-size: 200% 200%;
                    }
                    25% {
                        background-position: 50% 100%;
                        background-size: 250% 250%;
                    }
                    50% {
                        background-position: 100% 50%;
                        background-size: 200% 200%;
                    }
                    75% {
                        background-position: 50% 0%;
                        background-size: 250% 250%;
                    }
                    100% {
                        background-position: 0% 50%;
                        background-size: 200% 200%;
                    }
                }

                .animate-gradient-flow {
                    animation: gradient-flow 20s ease infinite;
                }

                @keyframes flame-dance {
                    0%,
                    100% {
                        transform: scale(1) translateY(0);
                        border-radius: 40% 60% 60% 40% / 60% 30% 70% 40%;
                    }
                    25% {
                        transform: scale(1.05, 1.1) translateY(-2px);
                        border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
                    }
                    50% {
                        transform: scale(0.95, 1) translateY(0);
                        border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
                    }
                    75% {
                        transform: scale(1.05, 0.95) translateY(2px);
                        border-radius: 40% 60% 50% 50% / 40% 60% 40% 60%;
                    }
                }

                @keyframes flame-flicker {
                    0%,
                    100% {
                        transform: scale(1) rotate(5deg);
                        opacity: 0.8;
                    }
                    25% {
                        transform: scale(1.1) rotate(-2deg);
                        opacity: 1;
                    }
                    50% {
                        transform: scale(0.9) rotate(0deg);
                        opacity: 0.9;
                    }
                    75% {
                        transform: scale(1.05) rotate(3deg);
                        opacity: 0.8;
                    }
                }

                @keyframes spark-1 {
                    0% {
                        transform: translateY(0) scale(0);
                        opacity: 0;
                    }
                    20% {
                        transform: translateY(-5px) scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(-15px) scale(0);
                        opacity: 0;
                    }
                }

                @keyframes spark-2 {
                    0% {
                        transform: translateY(0) scale(0);
                        opacity: 0;
                    }
                    10% {
                        opacity: 0;
                    }
                    30% {
                        transform: translateY(-8px) translateX(3px) scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(-20px) translateX(5px) scale(0);
                        opacity: 0;
                    }
                }

                .animate-flame-dance {
                    animation: flame-dance 3s ease-in-out infinite;
                }

                .animate-flame-flicker {
                    animation: flame-flicker 2s ease-out infinite;
                }

                .animate-spark-1 {
                    animation: spark-1 2s ease-in-out infinite;
                    animation-delay: 0.4s;
                }

                .animate-spark-2 {
                    animation: spark-2 2.5s ease-in-out infinite;
                    animation-delay: 0.9s;
                }

                @keyframes premium-gradient {
                    0% {
                        background-position: 0% 0%;
                    }
                    25% {
                        background-position: 100% 0%;
                    }
                    50% {
                        background-position: 100% 100%;
                    }
                    75% {
                        background-position: 0% 100%;
                    }
                    100% {
                        background-position: 0% 0%;
                    }
                }

                .animate-premium-gradient {
                    background-size: 200% 200%;
                    background-image: linear-gradient(45deg, #6d28d9, #4f46e5, #7e22ce, #9333ea, #6d28d9);
                    animation: premium-gradient 15s ease infinite;
                }

                @keyframes float-circle {
                    0% {
                        transform: translateY(0px) translateX(0px);
                    }
                    25% {
                        transform: translateY(-10px) translateX(5px);
                    }
                    50% {
                        transform: translateY(0px) translateX(10px);
                    }
                    75% {
                        transform: translateY(10px) translateX(5px);
                    }
                    100% {
                        transform: translateY(0px) translateX(0px);
                    }
                }

                .float-circle-1 {
                    animation: float-circle 12s ease-in-out infinite;
                }

                .float-circle-2 {
                    animation: float-circle 15s ease-in-out infinite reverse;
                }

                .float-circle-3 {
                    animation: float-circle 9s ease-in-out infinite;
                }

                .glass-effect {
                    backdrop-filter: blur(100px);
                    -webkit-backdrop-filter: blur(100px);
                    background-color: rgba(16, 24, 40, 0.7) !important;
                    border-bottom: 1px solid rgba(16, 24, 40, 0.3) !important;
                    will-change: backdrop-filter;
                    transform: translateZ(0);
                    -webkit-transform: translateZ(0);
                    isolation: isolate;
                    z-index: 50;
                }

                .dark .glass-effect {
                    background-color: rgba(15, 23, 42, 0.75) !important;
                    border-bottom: 1px solid rgba(91, 33, 182, 0.3) !important;
                    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
                    will-change: backdrop-filter;
                    transform: translateZ(0);
                    -webkit-transform: translateZ(0);
                    isolation: isolate;
                    z-index: 50;
                }

                /* Safari-specific fix */
                @supports (-webkit-backdrop-filter: none) {
                    .glass-effect {
                        -webkit-backdrop-filter: blur(100px);
                    }

                    .dark .glass-effect {
                        -webkit-backdrop-filter: blur(100px);
                    }
                }

                /* Better cross-browser blur effect */
                .glass-blur {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: -1;
                    backdrop-filter: blur(100px);
                    -webkit-backdrop-filter: blur(100px);
                }
            `}</style>

            <header
                className={`sticky top-0 z-50 transition-all duration-300 ${
                    hasScrolled ? "glass-effect relative" : "bg-white dark:bg-gray-900 border-b border-violet-200 dark:border-violet-900"
                } shadow-md`}
                style={{
                    isolation: hasScrolled ? "isolate" : "auto",
                }}
            >
                {hasScrolled && <div className="glass-blur"></div>}
                <div className="container mx-auto flex items-center justify-between h-16 px-4">
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-heading font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-indigo-400">
                            AnonPost
                        </h1>
                    </div>

                    <div className="relative max-w-md w-full mx-4 hidden md:block">
                        <input
                            type="text"
                            placeholder="Search posts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full py-2.5 px-4 pl-10 rounded-full border border-violet-200 dark:border-violet-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        />
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-violet-500 dark:text-violet-400" />
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative" ref={notificationMenuRef}>
                            <button
                                onClick={() => setNotificationMenuOpen(!notificationMenuOpen)}
                                className="text-gray-500 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 relative p-1 cursor-pointer"
                            >
                                <Bell className="h-6 w-6" />
                                {notification > 0 && (
                                    <span className="absolute top-0 right-0 -mt-0.5 -mr-0.5 bg-pink-500 text-white text-xs font-medium rounded-full w-4 h-4 flex items-center justify-center">
                                        {notification}
                                    </span>
                                )}
                            </button>
                            {notificationMenuOpen && (
                                <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-violet-100 dark:border-violet-900 z-20 py-1 overflow-hidden">
                                    <div className="px-4 py-2 border-b border-violet-100 dark:border-violet-900">
                                        <h3 className="font-medium text-violet-800 dark:text-violet-300">Notifications</h3>
                                    </div>
                                    <div className="max-h-56 overflow-y-auto">
                                        <div className="px-4 py-3 hover:bg-violet-50 dark:hover:bg-gray-700 cursor-pointer">
                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                                Your post got 5 new likes
                                            </p>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">5 minutes ago</span>
                                        </div>
                                        <div className="px-4 py-3 hover:bg-violet-50 dark:hover:bg-gray-700 cursor-pointer">
                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                                Someone replied to your comment
                                            </p>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">1 hour ago</span>
                                        </div>
                                    </div>
                                    <div className="px-4 py-2 text-center border-t border-violet-100 dark:border-violet-900">
                                        <button className="text-sm font-medium text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300 cursor-pointer">
                                            See all
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="relative" ref={userMenuRef}>
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer"
                            >
                                <div className="h-9 w-9 bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-500 dark:to-indigo-500 rounded-full flex items-center justify-center text-white shadow-md">
                                    <User className="h-4 w-4" />
                                </div>
                                <ChevronDown className={`h-4 w-4 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                            </button>

                            {userMenuOpen && (
                                <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-violet-100 dark:border-violet-900 z-20 overflow-hidden">
                                    <button className="w-full text-left px-4 py-3 hover:bg-violet-50 dark:hover:bg-gray-700 flex items-center gap-3 cursor-pointer">
                                        <User className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                                        <span className="font-medium text-gray-800 dark:text-gray-200">Profile</span>
                                    </button>
                                    <button className="w-full text-left px-4 py-3 hover:bg-violet-50 dark:hover:bg-gray-700 flex items-center gap-3 cursor-pointer">
                                        <BookmarkPlus className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                                        <span className="font-medium text-gray-800 dark:text-gray-200">Collections</span>
                                    </button>
                                    <button className="w-full text-left px-4 py-3 hover:bg-violet-50 dark:hover:bg-gray-700 flex items-center gap-3 cursor-pointer">
                                        <Settings className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                                        <span className="font-medium text-gray-800 dark:text-gray-200">Settings</span>
                                    </button>
                                    <div className="border-t border-violet-100 dark:border-violet-900 my-1"></div>
                                    <button className="w-full text-left px-4 py-3 text-red-600 dark:text-red-400 hover:bg-violet-50 dark:hover:bg-gray-700 flex items-center gap-3 cursor-pointer">
                                        <LogOut className="h-4 w-4" />
                                        <span className="font-medium">Log Out</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 grid grid-cols-12 gap-6">
                <div className="col-span-12 md:col-span-3 lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-5 border border-violet-100 dark:border-violet-900">
                        <h2 className="font-heading font-bold text-xl mb-4 text-violet-800 dark:text-violet-300">Channels</h2>
                        <nav className="space-y-2">
                            {channels.map((channel) => {
                                const Icon = channel.icon;
                                return (
                                    <button
                                        key={channel.id}
                                        onClick={() => setCurrentChannel(channel.id)}
                                        className={`flex items-center w-full px-4 py-2.5 rounded-lg text-sm transition-colors cursor-pointer ${
                                            currentChannel === channel.id
                                                ? "bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-300 font-medium"
                                                : "hover:bg-violet-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                        }`}
                                    >
                                        <Icon
                                            className={`h-4 w-4 mr-3 ${
                                                currentChannel === channel.id
                                                    ? "text-violet-600 dark:text-violet-400"
                                                    : "text-gray-500 dark:text-gray-400"
                                            }`}
                                        />
                                        <span>{channel.name}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                <div className="col-span-12 md:col-span-6 lg:col-span-7 space-y-6">
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-violet-100 dark:border-violet-900 p-5">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
                                    {channels.find((c) => c.id === currentChannel)?.name || "Channel"}
                                </h2>
                                <span className="bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-300 text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
                                    {totalPostsInChannel} posts
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setSortBy("hot")}
                                    className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg cursor-pointer ${
                                        sortBy === "hot"
                                            ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    }`}
                                >
                                    <Flame className="h-3.5 w-3.5" /> Hot
                                </button>
                                <button
                                    onClick={() => setSortBy("top")}
                                    className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg cursor-pointer ${
                                        sortBy === "top"
                                            ? "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400"
                                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    }`}
                                >
                                    <TrendingUp className="h-3.5 w-3.5" /> Top
                                </button>
                                <button
                                    onClick={() => setSortBy("latest")}
                                    className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg cursor-pointer ${
                                        sortBy === "latest"
                                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    }`}
                                >
                                    <Clock className="h-3.5 w-3.5" /> New
                                </button>
                            </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 border border-violet-100 dark:border-violet-900/40">
                            <textarea
                                placeholder="Share your thoughts anonymously..."
                                value={newPostContent}
                                onChange={(e) => setNewPostContent(e.target.value)}
                                className="w-full min-h-[120px] p-4 border border-violet-200 dark:border-violet-900 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
                            />
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
                                <div className="relative w-full sm:w-48" ref={dropdownRef}>
                                    <button
                                        onClick={() => setMoodOpen((prev) => !prev)}
                                        className="w-full flex items-center justify-between gap-3 rounded-lg border border-violet-200 dark:border-violet-800 bg-white dark:bg-gray-900 px-4 py-2.5 text-left text-gray-900 dark:text-gray-100 hover:shadow transition cursor-pointer"
                                    >
                                        <span className="flex items-center gap-2 text-sm">
                                            <span className="text-lg">{moods.find((m) => m.value === newPostMood)?.emoji}</span>
                                            <span className="font-medium">{moods.find((m) => m.value === newPostMood)?.label}</span>
                                        </span>
                                        <ChevronDown
                                            size={16}
                                            className={`transition-transform text-violet-500 dark:text-violet-400 ${
                                                moodOpen ? "rotate-180" : ""
                                            }`}
                                        />
                                    </button>

                                    {moodOpen && (
                                        <div className="absolute z-50 mt-2 w-full rounded-lg border border-violet-200 dark:border-violet-800 bg-white dark:bg-gray-900 shadow-lg overflow-hidden">
                                            {moods.map((mood) => (
                                                <div
                                                    key={mood.value}
                                                    onClick={() => {
                                                        setNewPostMood(mood.value);
                                                        setMoodOpen(false);
                                                    }}
                                                    className="px-4 py-3 cursor-pointer hover:bg-violet-50 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 flex items-center gap-3 transition"
                                                >
                                                    <span className="text-lg">{mood.emoji}</span>
                                                    <span className="font-medium text-sm">{mood.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={handleAddPost}
                                    disabled={!newPostContent || !newPostMood}
                                    className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-300 ease-in-out shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:from-violet-600 disabled:hover:to-indigo-600 flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <span>Post</span> <SendHorizonal size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto pb-2">
                        <div className="flex gap-2 items-center min-w-max">
                            <span className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-400">
                                <Filter className="h-3.5 w-3.5" /> Filter by Mood:
                            </span>
                            <button
                                onClick={() => setCurrentMood("all")}
                                className={`px-4 py-2 text-xs font-medium rounded-full transition-colors cursor-pointer ${
                                    currentMood === "all"
                                        ? "bg-violet-600 text-white shadow-sm"
                                        : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-violet-200 dark:border-violet-800 hover:bg-violet-50 dark:hover:bg-gray-800"
                                }`}
                            >
                                All Moods
                            </button>
                            {moods.map((mood) => (
                                <button
                                    key={mood.value}
                                    onClick={() => setCurrentMood(mood.value)}
                                    className={`px-4 py-2 text-xs font-medium rounded-full transition-colors flex items-center gap-1.5 cursor-pointer ${
                                        currentMood === mood.value
                                            ? "bg-violet-600 text-white shadow-sm"
                                            : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-violet-200 dark:border-violet-800 hover:bg-violet-50 dark:hover:bg-gray-800"
                                    }`}
                                >
                                    <span className="text-base">{mood.emoji}</span> {mood.label}
                                </button>
                            ))}
                            <div className="relative md:hidden ml-1">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-28 py-2 px-3 pl-8 rounded-full border border-violet-200 dark:border-violet-800 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                                />
                                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-violet-500 dark:text-violet-400" />
                            </div>
                        </div>
                    </div>

                    {topPost && (
                        <div className="relative bg-gradient-to-r from-violet-200 to-indigo-200 dark:from-violet-800/50 dark:to-indigo-800/50 rounded-xl p-6 border border-violet-300 dark:border-violet-700 shadow-lg overflow-hidden group">
                            
                            <div className="absolute inset-0 bg-gradient-to-br from-pink-300/60 via-indigo-400/40 to-purple-400/60 dark:from-pink-600/40 dark:via-indigo-500/30 dark:to-purple-600/40 animate-gradient-flow"></div>

                            
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-30 duration-1000 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-all ease-in-out duration-1500"></div>

                            <div className="pb-3 mb-1 relative z-10">
                                <div className="flex justify-between items-center flex-wrap gap-2">
                                    <h2 className="text-xl font-heading font-bold flex items-center gap-2 text-violet-900 dark:text-violet-200">
                                        <FlameIcon />
                                        Top Post of the Day
                                    </h2>
                                    <span className="text-xs whitespace-nowrap px-3 py-1.5 bg-white/80 dark:bg-gray-800/80 font-medium rounded-full text-gray-800 dark:text-gray-200 shadow-sm">
                                        {formatTimeAgo(topPost.timestamp)}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-4 items-center relative z-10">
                                <div className="flex flex-col items-center gap-1.5 pt-1">
                                    <button
                                        className={`text-gray-500 cursor-pointer dark:text-gray-400 hover:text-violet-700 dark:hover:text-violet-400 p-1.5 hover:bg-violet-100 dark:hover:bg-gray-800 rounded-full transition-colors ${
                                            topPost.userVoted === "up"
                                                ? "text-white dark:text-white bg-violet-600 dark:bg-violet-600 shadow-md"
                                                : ""
                                        }`}
                                        onClick={() => handleVote(topPost.id, 1)}
                                        aria-label="Like"
                                    >
                                        <ThumbsUp className="h-5 w-5" />
                                    </button>
                                    <span className="font-medium text-sm text-gray-900 dark:text-white">{topPost.votes}</span>
                                    <button
                                        className={`text-gray-500 cursor-pointer dark:text-gray-400 hover:text-violet-700 dark:hover:text-violet-400 p-1.5 hover:bg-violet-100 dark:hover:bg-gray-800 rounded-full transition-colors ${
                                            topPost.userVoted === "down"
                                                ? "text-white dark:text-white bg-red-500 dark:bg-red-500 shadow-md"
                                                : ""
                                        }`}
                                        onClick={() => handleVote(topPost.id, -1)}
                                        aria-label="Dislike"
                                    >
                                        <ThumbsDown className="h-5 w-5" />
                                    </button>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-start w-full">
                                        <div className="w-full">
                                            {topPost.author && (
                                                <div className="text-xs text-violet-600 dark:text-violet-400 mb-1.5 flex items-center gap-1.5 font-medium">
                                                    <User className="h-3.5 w-3.5" /> {topPost.author}
                                                </div>
                                            )}
                                            <p className="text-gray-900 dark:text-white font-medium">{topPost.content}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        <span className="text-xs font-medium px-3 py-1.5 bg-white/80 dark:bg-gray-800/80 text-violet-700 dark:text-violet-300 rounded-full flex items-center gap-1.5 shadow-sm">
                                            <span className="text-base">{getMoodEmoji(topPost.mood)}</span>{" "}
                                            <span className="capitalize">{topPost.mood}</span>
                                        </span>
                                        <span className="text-xs font-medium px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full flex items-center gap-1.5 shadow-sm">
                                            <Hash className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />{" "}
                                            {channels.find((c) => c.id === topPost.channel)?.name || topPost.channel}
                                        </span>
                                        <button
                                            className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full flex items-center gap-1.5 transition-colors font-medium text-gray-800 dark:text-gray-200 cursor-pointer"
                                            onClick={() => setReplyingTo(replyingTo === topPost.id ? null : topPost.id)}
                                        >
                                            <MessageSquare className="h-3.5 w-3.5" />
                                            {topPost.replies.length > 0 ? `${topPost.replies.length} replies` : "Reply"}
                                        </button>
                                        <div className="flex-grow"></div>
                                        <div className="flex gap-3">
                                            <a
                                                onClick={() => handleBookmark(topPost.id)}
                                                className={`text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                                                    topPost.bookmarked
                                                        ? "text-violet-700 dark:text-violet-400"
                                                        : "text-gray-600 dark:text-gray-400 hover:text-violet-700 dark:hover:text-violet-400"
                                                }`}
                                            >
                                                <BookmarkPlus className="h-4 w-4" /> Save
                                            </a>
                                            <a
                                                onClick={handleCopyToClipboard}
                                                className="text-xs flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-violet-700 dark:hover:text-violet-400 cursor-pointer"
                                            >
                                                <Share className="h-4 w-4" /> Share
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            
                            {replyingTo === topPost.id && (
                                <div className="mt-5 pl-7 sm:pl-12 border-l-2 border-violet-200 dark:border-violet-800 space-y-4 relative z-20">
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <input
                                            type="text"
                                            placeholder="Write a reply..."
                                            value={replyContents[topPost.id] || ""}
                                            onChange={(e) =>
                                                setReplyContents({
                                                    ...replyContents,
                                                    [topPost.id]: e.target.value,
                                                })
                                            }
                                            className="flex-1 px-4 py-2.5 border border-violet-200 dark:border-violet-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                                        />
                                        <button
                                            onClick={() => handleAddReply(topPost.id)}
                                            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow cursor-pointer"
                                        >
                                            <span>Reply</span> <Send size={16} />
                                        </button>
                                    </div>

                                    {topPost.replies.length > 0 && (
                                        <div className="space-y-4">
                                            {topPost.replies.map((reply) => (
                                                <div
                                                    key={reply.id}
                                                    className="flex gap-3 items-start border-b border-violet-100 dark:border-violet-900/30 pb-4 last:border-0"
                                                >
                                                    <div className="flex flex-col items-center gap-1.5">
                                                        <button
                                                            className={`text-gray-500 cursor-pointer dark:text-gray-400 hover:text-violet-700 dark:hover:text-violet-400 p-1.5 hover:bg-violet-100 dark:hover:bg-gray-800 rounded-full transition-colors ${
                                                                reply.userVoted === "up"
                                                                    ? "text-white dark:text-white bg-violet-600 dark:bg-violet-600 shadow-md"
                                                                    : ""
                                                            }`}
                                                            onClick={() => handleReplyVote(topPost.id, reply.id, 1)}
                                                            aria-label="Like reply"
                                                        >
                                                            <ThumbsUp className="h-4 w-4" />
                                                        </button>
                                                        <span className="text-xs font-medium text-gray-900 dark:text-white">
                                                            {reply.votes}
                                                        </span>
                                                        <button
                                                            className={`text-gray-500 cursor-pointer dark:text-gray-400 hover:text-violet-700 dark:hover:text-violet-400 p-1.5 hover:bg-violet-100 dark:hover:bg-gray-800 rounded-full transition-colors ${
                                                                reply.userVoted === "down"
                                                                    ? "text-white dark:text-white bg-red-500 dark:bg-red-500 shadow-md"
                                                                    : ""
                                                            }`}
                                                            onClick={() => handleReplyVote(topPost.id, reply.id, -1)}
                                                            aria-label="Dislike reply"
                                                        >
                                                            <ThumbsDown className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                    <div className="flex-1">
                                                        {reply.author && (
                                                            <p className="text-xs text-violet-600 dark:text-violet-400 font-medium mb-1">
                                                                {reply.author}
                                                            </p>
                                                        )}
                                                        <p className="text-sm text-gray-900 dark:text-white">{reply.content}</p>
                                                        <span className="text-xs text-gray-500 dark:text-gray-300 mt-1 block">
                                                            {formatTimeAgo(reply.timestamp)}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="space-y-5">
                        {filteredPosts.map((post) => (
                            <div
                                key={post.id}
                                className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-violet-100 dark:border-violet-900 overflow-hidden transition-all hover:shadow-lg"
                            >
                                <div className="p-5">
                                    <div className="flex gap-4 items-center">
                                        <div className="flex flex-col items-center gap-1.5 pt-1">
                                            <button
                                                className={`text-gray-500 cursor-pointer dark:text-gray-400 hover:text-violet-700 dark:hover:text-violet-400 p-1.5 hover:bg-violet-100 dark:hover:bg-gray-800 rounded-full transition-colors ${
                                                    post.userVoted === "up"
                                                        ? "text-white dark:text-white bg-violet-600 dark:bg-violet-600 shadow-md"
                                                        : ""
                                                }`}
                                                onClick={() => handleVote(post.id, 1)}
                                                aria-label="Like"
                                            >
                                                <ThumbsUp className="h-5 w-5" />
                                            </button>
                                            <span className="font-medium text-sm text-gray-900 dark:text-white">{post.votes}</span>
                                            <button
                                                className={`text-gray-500 cursor-pointer dark:text-gray-400 hover:text-violet-700 dark:hover:text-violet-400 p-1.5 hover:bg-violet-100 dark:hover:bg-gray-800 rounded-full transition-colors ${
                                                    post.userVoted === "down"
                                                        ? "text-white dark:text-white bg-red-500 dark:bg-red-500 shadow-md"
                                                        : ""
                                                }`}
                                                onClick={() => handleVote(post.id, -1)}
                                                aria-label="Dislike"
                                            >
                                                <ThumbsDown className="h-5 w-5" />
                                            </button>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    {post.author && (
                                                        <div className="text-xs text-violet-600 dark:text-violet-400 mb-1.5 flex items-center gap-1.5 font-medium">
                                                            <User className="h-3.5 w-3.5" /> {post.author}
                                                        </div>
                                                    )}
                                                    <p className="text-gray-900 dark:text-white font-medium">{post.content}</p>
                                                </div>
                                                <span className="text-xs whitespace-nowrap px-3 py-1.5 bg-gray-100 dark:bg-gray-800 font-medium rounded-full text-gray-800 dark:text-gray-200">
                                                    {formatTimeAgo(post.timestamp)}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                <span className="text-xs font-medium px-3 py-1.5 bg-violet-100 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 rounded-full flex items-center gap-1.5 shadow-sm">
                                                    <span className="text-base">{getMoodEmoji(post.mood)}</span>{" "}
                                                    <span className="capitalize">{post.mood}</span>
                                                </span>
                                                {(() => {
                                                    const channel = channels.find((c) => c.id === post.channel);
                                                    const colorClass = channel ? channel.color : "bg-indigo-500";
                                                    const textColor = colorClass.includes("blue")
                                                        ? "text-blue-700 dark:text-blue-300"
                                                        : colorClass.includes("indigo")
                                                        ? "text-indigo-700 dark:text-indigo-300"
                                                        : colorClass.includes("yellow")
                                                        ? "text-yellow-700 dark:text-yellow-300"
                                                        : colorClass.includes("green")
                                                        ? "text-green-700 dark:text-green-300"
                                                        : colorClass.includes("purple")
                                                        ? "text-purple-700 dark:text-purple-300"
                                                        : colorClass.includes("red")
                                                        ? "text-red-700 dark:text-red-300"
                                                        : colorClass.includes("pink")
                                                        ? "text-pink-700 dark:text-pink-300"
                                                        : colorClass.includes("teal")
                                                        ? "text-teal-700 dark:text-teal-300"
                                                        : "text-violet-700 dark:text-violet-300";
                                                    const bgColor = colorClass.includes("blue")
                                                        ? "bg-blue-100 dark:bg-blue-900/20"
                                                        : colorClass.includes("indigo")
                                                        ? "bg-indigo-100 dark:bg-indigo-900/20"
                                                        : colorClass.includes("yellow")
                                                        ? "bg-yellow-100 dark:bg-yellow-900/20"
                                                        : colorClass.includes("green")
                                                        ? "bg-green-100 dark:bg-green-900/20"
                                                        : colorClass.includes("purple")
                                                        ? "bg-purple-100 dark:bg-purple-900/20"
                                                        : colorClass.includes("red")
                                                        ? "bg-red-100 dark:bg-red-900/20"
                                                        : colorClass.includes("pink")
                                                        ? "bg-pink-100 dark:bg-pink-900/20"
                                                        : colorClass.includes("teal")
                                                        ? "bg-teal-100 dark:bg-teal-900/20"
                                                        : "bg-violet-100 dark:bg-violet-900/20";

                                                    return (
                                                        <span
                                                            className={`text-xs px-3 py-1.5 ${bgColor} ${textColor} rounded-full flex items-center gap-1.5 font-medium`}
                                                        >
                                                            <Hash className="h-3.5 w-3.5" /> {channel?.name || post.channel}
                                                        </span>
                                                    );
                                                })()}
                                                <button
                                                    className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full flex items-center gap-1.5 transition-colors font-medium text-gray-800 dark:text-gray-200 cursor-pointer"
                                                    onClick={() => setReplyingTo(replyingTo === post.id ? null : post.id)}
                                                >
                                                    <MessageSquare className="h-3.5 w-3.5" />
                                                    {post.replies.length > 0 ? `${post.replies.length} replies` : "Reply"}
                                                </button>
                                                <div className="flex-grow"></div>
                                                <div className="flex gap-3">
                                                    <a
                                                        onClick={() => handleBookmark(post.id)}
                                                        className={`text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                                                            post.bookmarked
                                                                ? "text-violet-700 dark:text-violet-400"
                                                                : "text-gray-600 dark:text-gray-400 hover:text-violet-700 dark:hover:text-violet-400"
                                                        }`}
                                                    >
                                                        <BookmarkPlus className="h-4 w-4" /> Save
                                                    </a>
                                                    <a
                                                        onClick={handleCopyToClipboard}
                                                        className="text-xs flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-violet-700 dark:hover:text-violet-400 cursor-pointer"
                                                    >
                                                        <Share className="h-4 w-4" /> Share
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {(post.replies.length > 0 || replyingTo === post.id) && (
                                        <div className="mt-5 pl-7 sm:pl-12 border-l-2 border-violet-200 dark:border-violet-800 space-y-4">
                                            {replyingTo === post.id && (
                                                <div className="flex flex-col sm:flex-row gap-3">
                                                    <input
                                                        type="text"
                                                        placeholder="Write a reply..."
                                                        value={replyContents[post.id] || ""}
                                                        onChange={(e) =>
                                                            setReplyContents({
                                                                ...replyContents,
                                                                [post.id]: e.target.value,
                                                            })
                                                        }
                                                        className="flex-1 px-4 py-2.5 border border-violet-200 dark:border-violet-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                                                    />
                                                    <button
                                                        onClick={() => handleAddReply(post.id)}
                                                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow cursor-pointer"
                                                    >
                                                        <span>Reply</span> <Send size={16} />
                                                    </button>
                                                </div>
                                            )}

                                            <div
                                                className={`space-y-4 ${
                                                    post.replies.length > 3
                                                        ? "max-h-[250px] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-violet-300 dark:scrollbar-thumb-violet-700 scrollbar-track-transparent"
                                                        : ""
                                                }`}
                                            >
                                                {post.replies.map((reply) => (
                                                    <div
                                                        key={reply.id}
                                                        className="flex gap-3 items-center border-b border-violet-100 dark:border-violet-900/30 pb-4 last:border-0"
                                                    >
                                                        <div className="flex flex-col items-center gap-1.5">
                                                            <button
                                                                className={`text-gray-500 cursor-pointer dark:text-gray-400 hover:text-violet-700 dark:hover:text-violet-400 p-1.5 hover:bg-violet-100 dark:hover:bg-gray-800 rounded-full transition-colors ${
                                                                    reply.userVoted === "up"
                                                                        ? "text-white dark:text-white bg-violet-600 dark:bg-violet-600 shadow-md"
                                                                        : ""
                                                                }`}
                                                                onClick={() => handleReplyVote(post.id, reply.id, 1)}
                                                                aria-label="Like reply"
                                                            >
                                                                <ThumbsUp className="h-4 w-4" />
                                                            </button>
                                                            <span className="text-xs font-medium text-gray-900 dark:text-white">
                                                                {reply.votes}
                                                            </span>
                                                            <button
                                                                className={`text-gray-500 cursor-pointer dark:text-gray-400 hover:text-violet-700 dark:hover:text-violet-400 p-1.5 hover:bg-violet-100 dark:hover:bg-gray-800 rounded-full transition-colors ${
                                                                    reply.userVoted === "down"
                                                                        ? "text-white dark:text-white bg-red-500 dark:bg-red-500 shadow-md"
                                                                        : ""
                                                                }`}
                                                                onClick={() => handleReplyVote(post.id, reply.id, -1)}
                                                                aria-label="Dislike reply"
                                                            >
                                                                <ThumbsDown className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                        <div className="flex-1">
                                                            {reply.author && (
                                                                <p className="text-xs text-violet-600 dark:text-violet-400 font-medium mb-1">
                                                                    {reply.author}
                                                                </p>
                                                            )}
                                                            <p className="text-sm text-gray-900 dark:text-white">{reply.content}</p>
                                                            <span className="text-xs text-gray-500 dark:text-gray-300 mt-1 block">
                                                                {formatTimeAgo(reply.timestamp)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {filteredPosts.length === 0 && (
                            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md text-center py-16 px-4 border border-violet-100 dark:border-violet-900">
                                <p className="text-gray-500 dark:text-gray-400 mb-3 font-medium">No posts found matching these filters</p>
                                <button
                                    onClick={() => {
                                        setCurrentMood("all");
                                        setSearchQuery("");
                                    }}
                                    className="text-sm font-medium text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300 hover:underline cursor-pointer"
                                >
                                    Clear filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="hidden lg:block col-span-3 space-y-6">
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-5 border border-violet-100 dark:border-violet-900">
                        <h3 className="font-heading font-bold text-xl mb-4 text-violet-800 dark:text-violet-300">Channel Information</h3>
                        <div className="space-y-4">
                            {(() => {
                                const currentChannelInfo = channels.find((c) => c.id === currentChannel);
                                const Icon = currentChannelInfo?.icon || Zap;
                                return (
                                    <>
                                        <div className="flex items-center gap-3">
                                            <span className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
                                                <Icon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                                            </span>
                                            <h4 className="font-medium text-lg text-gray-900 dark:text-white">
                                                {currentChannelInfo?.name}
                                            </h4>
                                        </div>
                                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                            {currentChannelInfo?.description}
                                        </p>
                                    </>
                                );
                            })()}
                            <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-300 mt-4 pt-4 border-t border-violet-100 dark:border-violet-900/30">
                                <div className="flex items-center gap-1.5">
                                    <User className="h-4 w-4 text-violet-500 dark:text-violet-400" />{" "}
                                    <span className="font-medium">1000 members</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <MessageSquare className="h-4 w-4 text-violet-500 dark:text-violet-400" />{" "}
                                    <span className="font-medium">{totalPostsInChannel} posts</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-5 border border-violet-100 dark:border-violet-900">
                        <h3 className="font-heading font-bold text-xl mb-4 text-violet-800 dark:text-violet-300">Popular Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            <span className="text-xs font-medium px-3 py-1.5 bg-violet-100 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 rounded-full">
                                #technology
                            </span>
                            <span className="text-xs font-medium px-3 py-1.5 bg-pink-100 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300 rounded-full">
                                #trending
                            </span>
                            <span className="text-xs font-medium px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-full">
                                #gaming
                            </span>
                            <span className="text-xs font-medium px-3 py-1.5 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full">
                                #programming
                            </span>
                            <span className="text-xs font-medium px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-full">
                                #design
                            </span>
                            <span className="text-xs font-medium px-3 py-1.5 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full">
                                #health
                            </span>
                            <span className="text-xs font-medium px-3 py-1.5 bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded-full">
                                #economy
                            </span>
                            <span className="text-xs font-medium px-3 py-1.5 bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-full">
                                #humor
                            </span>
                        </div>
                    </div>

                    <div className="relative rounded-xl p-6 text-white overflow-hidden shadow-lg">
                        
                        <div className="absolute inset-0 animate-premium-gradient"></div>

                        
                        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mt-10 -mr-10 float-circle-1"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -mb-12 -ml-12 float-circle-2"></div>
                        <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-white/10 rounded-full float-circle-3"></div>

                        
                        <h3 className="font-heading font-bold text-2xl mb-3 relative z-10">AnonPost Premium</h3>
                        <p className="text-sm text-white/90 mb-5 relative z-10 leading-relaxed">
                            Get premium membership for exclusive features, ad-free experience and more!
                        </p>
                        <button className="bg-white text-violet-700 text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-white/90 transition-colors relative z-10 shadow-md hover:shadow-lg cursor-pointer">
                            Go Premium
                        </button>
                    </div>
                </div>
                <Toaster richColors position="top-right" />
            </main>

            <footer className="bg-white dark:bg-gray-900 border-t border-violet-100 dark:border-violet-900 py-8 mt-10">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">© 2025 AnonPost. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default App;
