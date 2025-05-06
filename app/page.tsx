"use client";

import { useState, useEffect, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { FiSun, FiMoon, FiHome, FiUser, FiLogIn, FiLogOut, FiTrendingUp, FiImage, FiThumbsUp, FiUpload } from "react-icons/fi";
import { motion } from "framer-motion";

type Comment = {
    id: number;
    username: string;
    text: string;
    timestamp: string;
};

type Post = {
    id: number;
    username: string;
    comment: string;
    timestamp: string;
    likes: number;
    liked?: boolean;
    imageUrl?: string;
    comments: Comment[];
    showComments?: boolean;
};

type User = {
    username: string;
    bio: string;
    favoriteStock: string;
    winRate: number;
    avgReturn: number;
    avatarUrl?: string;
};


type AuthStatus = "loggedOut" | "login" | "signup" | "loggedIn";

export default function TraderBoard() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [darkMode, setDarkMode] = useState(true);
    const [activeTab, setActiveTab] = useState("home");
    const [newPost, setNewPost] = useState("");
    const [postImage, setPostImage] = useState("");
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    
    const [authenticationStatus, setAuthenticationStatus] = useState<AuthStatus>("loggedOut");
    const [loginIdentifier, setLoginIdentifier] = useState("");
    const [loginSecret, setLoginSecret] = useState("");
    const [signupUsername, setSignupUsername] = useState("");
    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [signupConfirmPass, setSignupConfirmPass] = useState("");
    const [authFeedback, setAuthFeedback] = useState<string | null>(null);

    
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editedBio, setEditedBio] = useState("");
    const [editedFavoriteStock, setEditedFavoriteStock] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);

    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [newComment, setNewComment] = useState<{ [key: number]: string }>({});

    
    const mockUserData: { [key: string]: User } = {
        TraderPro: {
            username: "TraderPro",
            bio: "Day trader specializing in tech stocks and crypto",
            favoriteStock: "AAPL",
            winRate: 68,
            avgReturn: 12.5,
            avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
        },
        MarketWhiz: {
            username: "MarketWhiz",
            bio: "Swing trading indices and commodities.",
            favoriteStock: "SPY",
            winRate: 72,
            avgReturn: 9.8,
            avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
        },
        CryptoKing: {
            username: "CryptoKing",
            bio: "Bitcoin maxi and altcoin explorer.",
            favoriteStock: "BTC",
            winRate: 55,
            avgReturn: 25.2,
            avatarUrl: "https://randomuser.me/api/portraits/men/60.jpg",
        },
        OptionsGuru: {
            username: "OptionsGuru",
            bio: "Selling premium and managing risk.",
            favoriteStock: "QQQ",
            winRate: 65,
            avgReturn: 15.1,
            avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
        },
    };

    const handleToggleComments = (postId: number) => {
        setPosts(
            posts.map((post) => {
                if (post.id === postId) {
                    return { ...post, showComments: !post.showComments };
                }
                return post;
            })
        );
    };

    const handleAddComment = (postId: number) => {
        if (!newComment[postId]?.trim() || !currentUser) return;
        setPosts(
            posts.map((post) => {
                if (post.id === postId) {
                    const comment: Comment = {
                        id: (post.comments?.length || 0) + 1,
                        username: currentUser.username,
                        text: newComment[postId],
                        timestamp: new Date().toISOString(),
                    };
                    return { ...post, comments: [...post.comments, comment] };
                }
                return post;
            })
        );
        setNewComment({ ...newComment, [postId]: "" });
    };

    const [posts, setPosts] = useState<Post[]>([
        {
            id: 1,
            username: "MarketWhiz",
            comment: "TSLA showing strong support at $250 level. Looking for breakout above $265 resistance.",
            timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
            likes: 24,
            imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1470&auto=format&fit=crop",
            comments: [
                {
                    id: 1,
                    username: "TraderPro",
                    text: "Great analysis! I see the same pattern forming.",
                    timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
                },
                {
                    id: 2,
                    username: "CryptoKing",
                    text: "What's your price target for EOY?",
                    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
                },
            ],
        },
        {
            id: 2,
            username: "CryptoKing",
            comment: "BTC breakout imminent after this consolidation pattern completes. Target $45K.",
            timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
            likes: 15,
            imageUrl: "https://images.unsplash.com/photo-1625806786037-2af608423424?q=80&w=1470&auto=format&fit=crop",
            comments: [
                {
                    id: 1,
                    username: "TraderPro",
                    text: "I'm seeing strong accumulation on-chain too",
                    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
                },
            ],
        },
        {
            id: 3,
            username: "OptionsGuru",
            comment: "SPY put credit spreads looking attractive with IV elevated this week.",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            likes: 8,
            imageUrl: "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?q=80&w=1470&auto=format&fit=crop",
            comments: [],
        },
        {
            id: 4,
            username: "TraderPro",
            comment: "Monitoring AAPL for a potential entry near the 50-day MA.",
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
            likes: 12,
            comments: [],
        },
    ]);

    const mockChartData = [
        { time: "9AM", price: 100 },
        { time: "10AM", price: 110 },
        { time: "11AM", price: 105 },
        { time: "12PM", price: 115 },
        { time: "1PM", price: 120 },
        { time: "2PM", price: 118 },
        { time: "3PM", price: 125 },
        { time: "4PM", price: 122 },
    ];

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        setDarkMode(savedTheme ? savedTheme === "dark" : true);
    }, []);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

    const processLoginAttempt = (e: React.FormEvent) => {
        e.preventDefault();
        setAuthFeedback(null);
        if (!loginIdentifier || !loginSecret) {
            setAuthFeedback("Please enter username/email and password.");
            return;
        }
        const genericUser: User = {
            username: loginIdentifier,
            bio: "Welcome, Trader!",
            favoriteStock: "SPY",
            winRate: 0,
            avgReturn: 0,
            avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(loginIdentifier)}&background=random&color=fff`,
        };
        setCurrentUser(genericUser);
        setIsLoggedIn(true);
        setAuthenticationStatus("loggedIn");
        setLoginIdentifier("");
        setLoginSecret("");
    };

    const processSignupAttempt = (e: React.FormEvent) => {
        e.preventDefault();
        setAuthFeedback(null);
        if (!signupUsername || !signupEmail || !signupPassword || !signupConfirmPass) {
            setAuthFeedback("Please fill in all fields.");
            return;
        }
        if (signupPassword !== signupConfirmPass) {
            setAuthFeedback("Passwords do not match.");
            return;
        }
        if (mockUserData[signupUsername]) {
            setAuthFeedback("Username already taken.");
            return;
        }
        const newUser: User = {
            username: signupUsername,
            bio: "New TraderBoard Member!",
            favoriteStock: "SPY",
            winRate: 0,
            avgReturn: 0,
            avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(signupUsername)}&background=random&color=fff`,
        };
        mockUserData[signupUsername] = newUser; 
        setCurrentUser(newUser);
        setIsLoggedIn(true);
        setAuthenticationStatus("loggedIn");
        setSignupUsername("");
        setSignupEmail("");
        setSignupPassword("");
        setSignupConfirmPass("");
    };

    const executeLogout = () => {
        setIsLoggedIn(false);
        setCurrentUser(null);
        setAuthenticationStatus("loggedOut");
        setActiveTab("home");
        setIsEditingProfile(false);
    };

    const initiateProfileEdit = () => {
        if (!currentUser) return;
        setEditedBio(currentUser.bio);
        setEditedFavoriteStock(currentUser.favoriteStock);
        setSelectedFile(null);
        setImagePreviewUrl(null);
        setIsEditingProfile(true);
    };

    const persistProfileChanges = () => {
        if (!currentUser) return;
        setCurrentUser({
            ...currentUser,
            bio: editedBio,
            favoriteStock: editedFavoriteStock,
            avatarUrl: imagePreviewUrl ? imagePreviewUrl : currentUser.avatarUrl,
        });
        setIsEditingProfile(false);
        setSelectedFile(null);
        setImagePreviewUrl(null);
    };

    const discardProfileChanges = () => {
        setIsEditingProfile(false);
        setSelectedFile(null);
        setImagePreviewUrl(null);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreviewUrl(reader.result as string);
            reader.readAsDataURL(file);
        } else {
            setSelectedFile(null);
            setImagePreviewUrl(null);
        }
    };

    const handleLikePost = (postId: number) => {
        setPosts(
            posts.map((post) => {
                if (post.id === postId) {
                    return { ...post, likes: post.liked ? post.likes - 1 : post.likes + 1, liked: !post.liked };
                }
                return post;
            })
        );
    };

    const submitNewPost = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPost.trim() || !currentUser) return;
        const post: Post = {
            id: posts.length + 1,
            username: currentUser.username,
            comment: newPost,
            timestamp: new Date().toISOString(),
            likes: 0,
            imageUrl: postImage || undefined,
            comments: [],
        };
        setPosts([post, ...posts]);
        setNewPost("");
        setPostImage("");
    };

    const formatTime = (timestamp: string): string => {
        const now = new Date();
        const postTime = new Date(timestamp);
        const diffInSeconds = (now.getTime() - postTime.getTime()) / 1000;
        const diffInMinutes = diffInSeconds / 60;
        const diffInHours = diffInMinutes / 60;
        const diffInDays = diffInHours / 24;
        if (diffInMinutes < 1) return `${Math.max(Math.floor(diffInSeconds), 1)}s ago`;
        if (diffInHours < 1) return `${Math.floor(diffInMinutes)}m ago`;
        if (diffInDays < 1) return `${Math.floor(diffInHours)}h ago`;
        if (diffInDays < 7) return `${Math.floor(diffInDays)}d ago`;
        return postTime.toLocaleDateString();
    };

    const getUserAvatar = (user: User | null): string => {
        if (user?.avatarUrl) return user.avatarUrl;
        const name = user?.username || "T";
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128`;
    };

    
    const fadeInSlideUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: "easeInOut" },
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1, 
            },
        },
    };

    return (
        <motion.div 
            initial="initial"
            animate="animate"
            className={`min-h-screen transition-colors duration-300 font-['Roboto'] ${
                darkMode
                    ? "dark bg-gradient-to-b from-gray-900 to-gray-800 text-white"
                    : "bg-gradient-to-b from-gray-50 to-white text-gray-900"
            }`}
            style={{ fontFamily: "'Roboto', sans-serif" }}
        >
            <style jsx global>{`
                @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Roboto:wght@400;500&display=swap");
                h1,
                h2,
                h3,
                h4,
                h5,
                h6 {
                    font-family: "Montserrat", sans-serif;
                }
            `}</style>

            <div className="p-2 sm:p-4 max-w-7xl mx-auto">
                
                <motion.header 
                    variants={fadeInSlideUp}
                    className="flex flex-row justify-between items-center mb-4 sm:mb-8 p-3 sm:p-4 rounded-xl backdrop-blur-md bg-opacity-70 bg-white dark:bg-opacity-10 dark:bg-gray-800 shadow-lg">
                    <div className="flex items-center gap-2">
                        <div className="bg-gradient-to-r from-lime-400 to-emerald-500 p-2 rounded-lg">
                            <FiTrendingUp className="text-lg sm:text-2xl text-white" />
                        </div>
                        <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-lime-500 to-emerald-400 bg-clip-text text-transparent">
                            TraderBoard
                        </h1>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className={`p-2 rounded-full cursor-pointer transition-colors duration-200 ${
                                darkMode 
                                    ? 'text-gray-400 hover:text-yellow-300 hover:bg-gray-700' 
                                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {darkMode ? <FiSun /> : <FiMoon />}
                        </button>
                        {authenticationStatus === "loggedIn" && currentUser ? (
                            <div className="flex gap-1 sm:gap-2 flex-wrap items-center">
                                <button
                                    onClick={() => setActiveTab("home")}
                                    className={`flex items-center gap-1 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-base cursor-pointer transition-colors duration-200 ${
                                        activeTab === "home"
                                            ? "bg-lime-500 text-black font-semibold"
                                            : darkMode
                                            ? "text-gray-300 hover:bg-gray-700/80 hover:text-white"
                                            : "text-gray-400 hover:bg-gray-200/80 hover:text-black"
                                    }`}
                                >
                                    <FiHome /> <span className="hidden xs:inline">Home</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab("profile")}
                                    className={`flex items-center gap-1 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-base cursor-pointer transition-colors duration-200 ${
                                        activeTab === "profile"
                                            ? "bg-lime-500 text-black font-semibold"
                                            : darkMode
                                            ? "text-gray-300 hover:bg-gray-700/80 hover:text-white"
                                            : "text-gray-400 hover:bg-gray-200/80 hover:text-black"
                                    }`}
                                >
                                    <FiUser /> <span className="hidden xs:inline">Profile</span>
                                </button>
                                <button
                                    onClick={executeLogout}
                                    className="flex items-center gap-1 bg-red-500 hover:bg-red-600 px-3 sm:px-4 py-2 rounded-lg text-white text-xs sm:text-base cursor-pointer transition-colors duration-200"
                                >
                                    <FiLogOut /> <span className="hidden xs:inline">Logout</span>
                                </button>
                            </div>
                        ) : (
                            authenticationStatus !== "login" &&
                            authenticationStatus !== "signup" && (
                                <button
                                    onClick={() => setAuthenticationStatus("login")}
                                    className="flex items-center gap-1 bg-lime-500 hover:bg-lime-600 px-3 sm:px-4 py-2 rounded-lg text-black text-xs sm:text-base cursor-pointer transition-colors duration-200"
                                >
                                    <FiLogIn /> Login
                                </button>
                            )
                        )}
                    </div>
                </motion.header>

                
                {authenticationStatus === "loggedIn" && currentUser && (
                    <motion.main 
                        variants={fadeInSlideUp} >
                        
                        {activeTab === "home" && (
                            <div className="flex flex-col lg:flex-row gap-8">
                                
                                <div className="flex-1 min-w-0">
                                    <div className="space-y-4 sm:space-y-6 max-w-xl xl:max-w-3xl mx-auto">
                                        
                                        <div className={`p-3 sm:p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white shadow"}`}>
                                            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">📊 Create Post</h2>
                                            <form onSubmit={submitNewPost}>
                                                <textarea
                                                    value={newPost}
                                                    onChange={(e) => setNewPost(e.target.value)}
                                                    placeholder={`What's on your mind, @${currentUser.username}?`}
                                                    className={`w-full p-2 sm:p-3 rounded mb-2 sm:mb-3 ${
                                                        darkMode ? "bg-gray-700" : "bg-gray-100"
                                                    }`}
                                                    rows={3}
                                                />
                                                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                                    <input
                                                        type="text"
                                                        value={postImage}
                                                        onChange={(e) => setPostImage(e.target.value)}
                                                        placeholder="Image URL (optional)"
                                                        className={`w-full flex-1 p-2 rounded ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}
                                                    />
                                                    <button
                                                        type="submit"
                                                        className="bg-lime-500 hover:bg-lime-600 px-4 py-2 rounded text-black font-semibold w-full sm:w-auto mt-2 sm:mt-0 cursor-pointer"
                                                    >
                                                        Post
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                        
                                        <motion.div 
                                            variants={staggerContainer}
                                            initial="initial"
                                            animate="animate">
                                            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 lg:hidden">🔥 Market Feed</h2> 
                                            {posts.length === 0 ? (
                                                <p className="text-center py-6 sm:py-8 text-gray-500">
                                                    No posts yet. Be the first to share!
                                                </p>
                                            ) : (
                                                posts.map((post) => (
                                                    <motion.div 
                                                        key={post.id}
                                                        variants={fadeInSlideUp} 
                                                        className={`p-3 py-4 sm:p-4 sm:py-5 rounded-lg mb-3 sm:mb-4 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                                                            darkMode ? "bg-gradient-to-br from-gray-700 to-gray-800" : "bg-white shadow hover:shadow-blue-100"}`}>
                                                        <div className="flex items-start gap-2 sm:gap-3">
                                                            <img
                                                                src={getUserAvatar(mockUserData[post.username])}
                                                                alt={post.username}
                                                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover bg-gray-600"
                                                            />
                                                            <div className="flex-1">
                                                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                                                    <span className="font-bold text-sm sm:text-base">@{post.username}</span>
                                                                    <span
                                                                        className={`text-xs sm:text-sm ${
                                                                            darkMode ? "text-gray-400" : "text-gray-500"
                                                                        }`}
                                                                    >
                                                                        {formatTime(post.timestamp)}
                                                                    </span>
                                                                </div>
                                                                <p className="my-2 text-sm sm:text-base">{post.comment}</p>
                                                                {post.imageUrl && (
                                                                    <div className="my-3 rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl">
                                                                        <img
                                                                            src={post.imageUrl}
                                                                            alt="Trade chart or image"
                                                                            className="w-full max-h-64 object-cover transform transition-transform duration-700 hover:scale-105"
                                                                            loading="lazy"
                                                                            onError={(e) => {
                                                                                (e.target as HTMLImageElement).style.display = "none";
                                                                            }}
                                                                        />
                                                                    </div>
                                                                )}
                                                                <div className="flex items-center gap-4 mt-2">
                                                                    <button
                                                                        onClick={() => handleLikePost(post.id)}
                                                                        className={`flex items-center gap-1 transition-all duration-300 px-3 py-1 rounded-full text-xs cursor-pointer ${
                                                                            post.liked
                                                                                ? "text-white bg-gradient-to-r from-lime-500 to-emerald-500 scale-110"
                                                                                : darkMode
                                                                                ? "text-gray-400 hover:text-lime-400"
                                                                                : "text-gray-600 hover:text-lime-600"
                                                                        }`}
                                                                    >
                                                                        <FiThumbsUp
                                                                            className={`${post.liked ? "animate-pulse" : ""}`}
                                                                            size={14}
                                                                        />{" "}
                                                                        {post.likes}
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleToggleComments(post.id)}
                                                                        className={`flex items-center gap-1 transition-all duration-300 px-3 py-1 rounded-full text-xs cursor-pointer ${
                                                                            post.showComments
                                                                                ? "text-white bg-gradient-to-r from-blue-500 to-cyan-500"
                                                                                : darkMode
                                                                                ? "text-gray-400 hover:text-blue-400"
                                                                                : "text-gray-600 hover:text-blue-600"
                                                                        }`}
                                                                    >
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            width="14"
                                                                            height="14"
                                                                            viewBox="0 0 24 24"
                                                                            fill="none"
                                                                            stroke="currentColor"
                                                                            strokeWidth="2"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        >
                                                                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                                                        </svg>
                                                                        {post.comments.length}
                                                                    </button>
                                                                </div>
                                                                {post.showComments && (
                                                                    <div
                                                                        className={`mt-4 pt-3 border-t ${
                                                                            darkMode ? "border-gray-700" : "border-gray-200"
                                                                        }`}
                                                                    >
                                                                        <h4 className="font-medium text-sm mb-2">
                                                                            Comments ({post.comments.length})
                                                                        </h4>
                                                                        <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 mb-3">
                                                                            <input
                                                                                type="text"
                                                                                value={newComment[post.id] || ""}
                                                                                onChange={(e) =>
                                                                                    setNewComment({
                                                                                        ...newComment,
                                                                                        [post.id]: e.target.value,
                                                                                    })
                                                                                }
                                                                                placeholder="Add a comment..."
                                                                                className={`flex-1 p-2 text-sm rounded ${
                                                                                    darkMode ? "bg-gray-600" : "bg-gray-100"
                                                                                }`}
                                                                                onKeyDown={(e) => {
                                                                                    if (e.key === "Enter") {
                                                                                        e.preventDefault();
                                                                                        handleAddComment(post.id);
                                                                                    }
                                                                                }}
                                                                            />
                                                                            <button
                                                                                onClick={() => handleAddComment(post.id)}
                                                                                className="bg-blue-500 hover:bg-blue-600 px-3 py-2 rounded text-white text-xs whitespace-nowrap cursor-pointer"
                                                                            >
                                                                                Post Comment
                                                                            </button>
                                                                        </div>
                                                                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1 pb-1">
                                                                            {post.comments.length === 0 ? (
                                                                                <p
                                                                                    className={`text-xs italic ${
                                                                                        darkMode ? "text-gray-400" : "text-gray-500"
                                                                                    }`}
                                                                                >
                                                                                    No comments yet.
                                                                                </p>
                                                                            ) : (
                                                                                post.comments.map((comment) => (
                                                                                    <div
                                                                                        key={comment.id}
                                                                                        className={`p-2 sm:p-3 rounded text-sm ${
                                                                                            darkMode ? "bg-gray-600" : "bg-gray-100"
                                                                                        }`}
                                                                                    >
                                                                                        <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center">
                                                                                            <span className="font-bold text-xs flex items-center gap-1.5">
                                                                                                <img
                                                                                                    src={getUserAvatar(
                                                                                                        mockUserData[comment.username]
                                                                                                    )}
                                                                                                    alt={comment.username}
                                                                                                    className="w-4 h-4 rounded-full object-cover bg-gray-500"
                                                                                                />{" "}
                                                                                                @{comment.username}
                                                                                            </span>
                                                                                            <span
                                                                                                className={`text-xs ${
                                                                                                    darkMode
                                                                                                        ? "text-gray-400"
                                                                                                        : "text-gray-500"
                                                                                                }`}
                                                                                            >
                                                                                                {formatTime(comment.timestamp)}
                                                                                            </span>
                                                                                        </div>
                                                                                        <p className="mt-1 text-sm break-words">
                                                                                            {comment.text}
                                                                                        </p>
                                                                                    </div>
                                                                                ))
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))
                                            )}
                                        </motion.div>
                                    </div>
                                </div>

                                
                                <div className="flex-shrink-0 mt-8 lg:mt-0">
                                    <div className="lg:sticky lg:top-20 space-y-6 lg:w-96 xl:w-[400px]">
                                        
                                        <motion.div 
                                            variants={fadeInSlideUp} 
                                            initial="initial" 
                                            animate="animate"
                                            className={`p-4 rounded-lg ${darkMode ? "bg-gray-800 bg-opacity-70 backdrop-blur-md" : "bg-white shadow-lg"}`}>
                                            <h3 className="text-xl font-semibold mb-4">What traders are saying</h3>
                                            <motion.div 
                                                variants={staggerContainer}
                                                className="space-y-4">
                                                {posts.slice(0, 3).map((
                                                    post 
                                                ) => (
                                                    <motion.div 
                                                        key={post.id}
                                                        variants={fadeInSlideUp}
                                                        className={`p-3 rounded-lg border-l-4 border-lime-500 ${
                                                            darkMode ? "bg-gray-700/70" : "bg-gray-50"}`}>
                                                        <div className="flex justify-between items-center mb-1">
                                                            <div className="flex items-center gap-1.5">
                                                                <img
                                                                    src={getUserAvatar(mockUserData[post.username])}
                                                                    alt={post.username}
                                                                    className="w-6 h-6 rounded-full object-cover bg-gray-600"
                                                                />
                                                                <span className="font-bold text-sm">@{post.username}</span>
                                                            </div>
                                                            <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                                                {formatTime(post.timestamp)}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm my-1.5 line-clamp-3">{post.comment}</p>{" "}
                                                        
                                                        <div className="flex items-center gap-2 text-xs mt-1.5">
                                                            <FiThumbsUp className="text-lime-500" size={14} />
                                                            <span className="text-lime-500 font-medium">{post.likes}</span>
                                                            {post.comments.length > 0 && (
                                                                <span
                                                                    className={`flex items-center gap-1 ml-2 ${
                                                                        darkMode ? "text-blue-400" : "text-blue-600"
                                                                    }`}
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        width="14"
                                                                        height="14"
                                                                        viewBox="0 0 24 24"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        strokeWidth="2"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    >
                                                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                                                    </svg>
                                                                    {post.comments.length}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </motion.div>
                                        </motion.div>
                                        
                                        
                                    </div>
                                </div>
                            </div>
                        )}

                        
                        {activeTab === "profile" && (
                            <div className={`p-3 sm:p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white shadow"}`}>
                                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">👤 Your Profile</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                                    
                                    <div>
                                        
                                        <div className={`p-3 sm:p-4 rounded-lg mb-4 ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                                            <div className="flex items-center gap-3 sm:gap-4">
                                                
                                                <div
                                                    className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-gray-600 flex-shrink-0 group"
                                                    onMouseEnter={() => {
                                                        if (isEditingProfile) setIsHoveringAvatar(true);
                                                    }}
                                                    onMouseLeave={() => setIsHoveringAvatar(false)}
                                                >
                                                    <img
                                                        src={
                                                            isEditingProfile && imagePreviewUrl
                                                                ? imagePreviewUrl
                                                                : getUserAvatar(currentUser)
                                                        }
                                                        alt={currentUser.username}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = getUserAvatar(null);
                                                        }}
                                                    />
                                                    
                                                    {isEditingProfile && (
                                                        <div
                                                            className={`absolute inset-0 flex items-center justify-center rounded-full transition-opacity duration-300 ease-in-out cursor-pointer ${
                                                                isHoveringAvatar ? "bg-black/60" : "bg-black/30"
                                                            }`}
                                                            onClick={() => fileInputRef.current?.click()}
                                                        >
                                                            <FiUpload
                                                                className={`text-white text-2xl transition-opacity duration-300 ease-in-out ${
                                                                    isHoveringAvatar ? "opacity-90" : "opacity-70"
                                                                }`}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-grow">
                                                    <h3 className="font-semibold text-base sm:text-lg">@{currentUser.username}</h3>
                                                    
                                                    {isEditingProfile ? (
                                                        <div className="mt-1 space-y-3">
                                                            <div>
                                                                <label
                                                                    htmlFor="profile-bio"
                                                                    className={`block text-xs font-medium mb-1 ${
                                                                        darkMode ? "text-gray-300" : "text-gray-700"
                                                                    }`}
                                                                >
                                                                    Bio
                                                                </label>
                                                                <textarea
                                                                    id="profile-bio"
                                                                    value={editedBio}
                                                                    onChange={(e) => setEditedBio(e.target.value)}
                                                                    className={`w-full p-1.5 border rounded text-sm ${
                                                                        darkMode
                                                                            ? "bg-gray-600 border-gray-500"
                                                                            : "bg-white border-gray-300"
                                                                    }`}
                                                                    rows={3}
                                                                    placeholder="Your bio..."
                                                                />
                                                            </div>
                                                            
                                                            <input
                                                                type="file"
                                                                id="profile-avatar-upload"
                                                                accept="image/*"
                                                                onChange={handleFileChange}
                                                                ref={fileInputRef}
                                                                className="hidden"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <p
                                                            className={`text-sm sm:text-base mt-1 ${
                                                                darkMode ? "text-gray-300" : "text-gray-600"
                                                            }`}
                                                        >
                                                            {" "}
                                                            {currentUser.bio || "No bio set."}{" "}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                                            <h3 className="font-semibold mb-2">📈 {currentUser.favoriteStock} Chart</h3>
                                            <div className="h-64">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart data={mockChartData}>
                                                        <XAxis dataKey="time" stroke={darkMode ? "#9CA3AF" : "#6B7280"} />
                                                        <YAxis stroke={darkMode ? "#9CA3AF" : "#6B7280"} />
                                                        <Tooltip
                                                            contentStyle={
                                                                darkMode
                                                                    ? {
                                                                          backgroundColor: "#1F2937",
                                                                          borderColor: "#374151",
                                                                          color: "#F3F4F6",
                                                                      }
                                                                    : {
                                                                          backgroundColor: "#FFFFFF",
                                                                          borderColor: "#E5E7EB",
                                                                          color: "#111827",
                                                                      }
                                                            }
                                                        />
                                                        <Line
                                                            type="monotone"
                                                            dataKey="price"
                                                            stroke="#10b981"
                                                            strokeWidth={2}
                                                            dot={{ r: 3 }}
                                                            activeDot={{ r: 5 }}
                                                        />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                                        <h3 className="font-semibold mb-4">📊 Your Stats</h3>
                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div
                                                className={`p-4 rounded-lg relative overflow-hidden ${
                                                    darkMode ? "bg-gray-800" : "bg-white shadow-sm"
                                                }`}
                                            >
                                                <div className="relative z-10">
                                                    <p className="text-sm text-gray-500">Win Rate</p>
                                                    <p className="text-2xl font-bold text-lime-500">{currentUser.winRate}%</p>
                                                </div>
                                                <div
                                                    className="absolute bottom-0 left-0 h-1 bg-lime-500"
                                                    style={{ width: `${currentUser.winRate}%` }}
                                                ></div>
                                            </div>
                                            <div
                                                className={`p-4 rounded-lg relative overflow-hidden ${
                                                    darkMode ? "bg-gray-800" : "bg-white shadow-sm"
                                                }`}
                                            >
                                                <div className="relative z-10">
                                                    <p className="text-sm text-gray-500">Avg Return</p>
                                                    <p className="text-2xl font-bold text-emerald-500">+{currentUser.avgReturn}%</p>
                                                </div>
                                                <div
                                                    className="absolute bottom-0 left-0 h-1 bg-emerald-500"
                                                    style={{ width: `${Math.min(currentUser.avgReturn * 5, 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <h3 className="font-semibold mb-4">📝 Your Recent Posts</h3>
                                        <div className="space-y-3 max-h-60 overflow-y-auto pr-1 pb-1">
                                            {posts
                                                .filter((post) => post.username === currentUser.username)
                                                .slice(0, 5)
                                                .map((post) => (
                                                    <div
                                                        key={post.id}
                                                        className={`p-3 rounded ${darkMode ? "bg-gray-800" : "bg-white shadow-sm"}`}
                                                    >
                                                        <p className="truncate text-sm">{post.comment}</p>
                                                        <div className="flex justify-between items-center mt-2">
                                                            <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                                                {formatTime(post.timestamp)}
                                                            </span>
                                                            <span className="flex items-center gap-1 text-xs text-lime-500">
                                                                <FiThumbsUp size={12} /> {post.likes}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            {posts.filter((post) => post.username === currentUser.username).length === 0 && (
                                                <p className={`text-xs italic ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                                    You haven't posted anything yet.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex justify-end gap-3 mt-4">
                                    {isEditingProfile ? (
                                        <>
                                            <button
                                                onClick={discardProfileChanges}
                                                className={`px-4 py-2 rounded text-sm cursor-pointer ${
                                                    darkMode ? "bg-gray-600 hover:bg-gray-500" : "bg-gray-200 hover:bg-gray-300"
                                                }`}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={persistProfileChanges}
                                                className="px-4 py-2 rounded text-sm bg-lime-500 hover:bg-lime-600 text-black font-semibold cursor-pointer"
                                            >
                                                Save Changes
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={initiateProfileEdit}
                                            className={`px-4 py-2 rounded text-sm cursor-pointer ${
                                                darkMode ? "bg-gray-600 hover:bg-gray-500" : "bg-gray-200 hover:bg-gray-300"
                                            }`}
                                        >
                                            Edit Profile
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </motion.main>
                )}

                
                {(authenticationStatus === "login" || authenticationStatus === "signup") && (
                    <motion.div 
                        variants={fadeInSlideUp}
                        className="flex justify-center items-center pt-10 sm:pt-16">
                        <div className={`w-full max-w-md p-6 sm:p-8 rounded-lg shadow-xl ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                            {authenticationStatus === "login" && (
                                <form onSubmit={processLoginAttempt} className="space-y-4 sm:space-y-6">
                                    <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6">Login to TraderBoard</h2>
                                    {authFeedback && (
                                        <p className="text-red-500 text-sm text-center bg-red-100 dark:bg-red-900/50 p-2 rounded">
                                            {authFeedback}
                                        </p>
                                    )}
                                    <div>
                                        <label
                                            htmlFor="login-id"
                                            className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                                        >
                                            Username or Email
                                        </label>
                                        <input
                                            type="text"
                                            id="login-id"
                                            value={loginIdentifier}
                                            onChange={(e) => setLoginIdentifier(e.target.value)}
                                            required
                                            className={`w-full p-2 sm:p-3 border rounded ${
                                                darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-300"
                                            }`}
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="login-secret"
                                            className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                                        >
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            id="login-secret"
                                            value={loginSecret}
                                            onChange={(e) => setLoginSecret(e.target.value)}
                                            required
                                            className={`w-full p-2 sm:p-3 border rounded ${
                                                darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-300"
                                            }`}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-lime-500 to-emerald-500 hover:from-lime-600 hover:to-emerald-600 text-white font-semibold py-2 sm:py-3 rounded transition duration-200 cursor-pointer"
                                    >
                                        Login
                                    </button>
                                    <p className="text-center text-sm">
                                        Don't have an account?{" "}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setAuthenticationStatus("signup");
                                                setAuthFeedback(null);
                                            }}
                                            className="text-lime-500 hover:underline font-medium cursor-pointer"
                                        >
                                            Sign Up
                                        </button>
                                    </p>
                                </form>
                            )}
                            {authenticationStatus === "signup" && (
                                <form onSubmit={processSignupAttempt} className="space-y-3 sm:space-y-4">
                                    <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6">Create Account</h2>
                                    {authFeedback && (
                                        <p className="text-red-500 text-sm text-center bg-red-100 dark:bg-red-900/50 p-2 rounded">
                                            {authFeedback}
                                        </p>
                                    )}
                                    <div>
                                        <label
                                            htmlFor="signup-user"
                                            className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                                        >
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            id="signup-user"
                                            value={signupUsername}
                                            onChange={(e) => setSignupUsername(e.target.value)}
                                            required
                                            className={`w-full p-2 border rounded ${
                                                darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-300"
                                            }`}
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="signup-email"
                                            className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                                        >
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="signup-email"
                                            value={signupEmail}
                                            onChange={(e) => setSignupEmail(e.target.value)}
                                            required
                                            className={`w-full p-2 border rounded ${
                                                darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-300"
                                            }`}
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="signup-pass"
                                            className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                                        >
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            id="signup-pass"
                                            value={signupPassword}
                                            onChange={(e) => setSignupPassword(e.target.value)}
                                            required
                                            className={`w-full p-2 border rounded ${
                                                darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-300"
                                            }`}
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="signup-confirm"
                                            className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                                        >
                                            Confirm Password
                                        </label>
                                        <input
                                            type="password"
                                            id="signup-confirm"
                                            value={signupConfirmPass}
                                            onChange={(e) => setSignupConfirmPass(e.target.value)}
                                            required
                                            className={`w-full p-2 border rounded ${
                                                darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-300"
                                            }`}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-2 sm:py-3 rounded transition duration-200 cursor-pointer"
                                    >
                                        Sign Up
                                    </button>
                                    <p className="text-center text-sm">
                                        Already have an account?{" "}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setAuthenticationStatus("login");
                                                setAuthFeedback(null);
                                            }}
                                            className="text-lime-500 hover:underline font-medium cursor-pointer"
                                        >
                                            Login
                                        </button>
                                    </p>
                                </form>
                            )}
                        </div>
                    </motion.div>
                )}

                
                {authenticationStatus === "loggedOut" && (
                    <motion.div 
                        variants={fadeInSlideUp}
                        className="text-center py-10 sm:py-16">
                        <div className="inline-block p-6 sm:p-8 rounded-full bg-gradient-to-br from-lime-400 to-emerald-500 mb-6 sm:mb-8 shadow-lg shadow-lime-200 dark:shadow-lime-900/30 animate-pulse">
                            <FiTrendingUp className="text-5xl sm:text-6xl text-white" />
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-lime-500 to-emerald-400 bg-clip-text text-transparent">
                            Welcome to TraderBoard
                        </h2>
                        <p className={`text-lg sm:text-xl mb-8 max-w-lg mx-auto ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                            Connect with fellow traders and share real-time market insights.
                        </p>
                        <button
                            onClick={() => setAuthenticationStatus("signup")}
                            className="bg-gradient-to-r from-lime-500 to-emerald-400 hover:from-lime-600 hover:to-emerald-500 px-6 sm:px-8 py-3 rounded-lg text-white font-semibold text-base sm:text-lg transition-colors shadow-lg shadow-lime-200/50 dark:shadow-lime-900/30 transform hover:scale-105 cursor-pointer"
                        >
                            Join the Community
                        </button>
                        <div className="mt-16 sm:mt-20 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
                            <div className={`p-6 rounded-xl ${darkMode ? "bg-gray-800 bg-opacity-80" : "bg-white shadow-xl"}`}>
                                <img
                                    src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1470&auto=format&fit=crop"
                                    alt="Trading Platform"
                                    className="w-full h-40 sm:h-48 object-cover rounded-lg mb-4"
                                />
                                <h3 className="text-xl font-semibold mb-2">Real-time Market Analysis</h3>
                                <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-sm sm:text-base`}>
                                    Get instant insights from experienced traders.
                                </p>
                            </div>
                            <div className={`p-6 rounded-xl ${darkMode ? "bg-gray-800 bg-opacity-80" : "bg-white shadow-xl"}`}>
                                <img
                                    src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1470&auto=format&fit=crop"
                                    alt="Stock Charts"
                                    className="w-full h-40 sm:h-48 object-cover rounded-lg mb-4"
                                />
                                <h3 className="text-xl font-semibold mb-2">Community Driven</h3>
                                <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-sm sm:text-base`}>
                                    Learn from others and build your network.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            
            <motion.footer 
                variants={fadeInSlideUp}
                className={`mt-16 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} `}>
                <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        © ${new Date().getFullYear()} TraderBoard. All rights reserved.
                    </div>
                    <div className="flex gap-4 sm:gap-6">
                        <a href="#" className={`text-xs hover:text-lime-500 transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Terms</a>
                        <a href="#" className={`text-xs hover:text-lime-500 transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Privacy</a>
                        <a href="#" className={`text-xs hover:text-lime-500 transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>About</a>
                        
                    </div>
                </div>
            </motion.footer>
        </motion.div>
    );
}
