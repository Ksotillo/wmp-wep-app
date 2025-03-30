"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Search, Settings, MapPin, File, Image as ImageIcon, Heart, MessageSquare, Eye, Home as HomeIcon, Users, X, Send, Paperclip, ChevronDown, CheckCircle } from "lucide-react";
import MobileMenu from "./components/MobileMenu";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Define types
type User = {
    id: number;
    name: string;
    username: string;
    avatar: string;
};

type Post = {
    id: number;
    user: User;
    content: string;
    images: string[];
    likes: number;
    timeAgo: string;
    mentions?: { name: string; username: string }[];
    reactions?: { emoji: string; count: number }[];
    comments?: { user: User; text: string; timeAgo: string }[];
};

type Story = {
    id: number;
    user: User;
    image: string;
};

type Suggestion = {
    id: number;
    user: User;
    followed?: boolean;
};

type Recommendation = {
    id: number;
    title: string;
    icon: string;
};

// Function to generate a random GitHub user ID between 1 and 70000000
const getRandomGithubId = () => {
    return Math.floor(Math.random() * 70000000) + 1;
};

// Function to generate a GitHub avatar URL
const getGithubAvatar = (userId: number) => {
    return `https://avatars.githubusercontent.com/u/${userId}?v=4`;
};

// Font styles
const fonts = {
    heading: "system-ui",
    body: "system-ui",
};

// Left sidebar navigation component
const SidebarItem = ({ icon, label, count, isActive, onClick }: { 
    icon: React.ReactNode; 
    label: string; 
    count?: number; 
    isActive?: boolean;
    onClick?: () => void;
}) => (
    <li>
        <a 
            href="#" 
            onClick={(e) => {
                e.preventDefault();
                if (onClick) onClick();
            }}
            className={`flex items-center p-4 rounded-lg mb-2 cursor-pointer ${
                isActive 
                    ? "bg-black text-white" 
                    : "text-gray-700 hover:bg-gray-100"
            }`}
        >
            <div className="w-6 h-6 mr-3 flex items-center justify-center">
                {icon}
            </div>
            {label}
            {count && (
                <span className={`ml-auto ${isActive ? "bg-gray-700" : "bg-gray-900"} text-white text-xs rounded-full w-5 h-5 flex items-center justify-center`}>
                    {count}
                </span>
            )}
        </a>
    </li>
);

export default function Home() {
    const [currentUser, setCurrentUser] = useState<User>({
        id: 1,
        name: "Bogdan Nikitin",
        username: "nikitinteam",
        avatar: getGithubAvatar(59017652),
    });

    // Add active section state
    const [activeSection, setActiveSection] = useState("newsfeed");
    // Add active feed filter state
    const [activeFeedFilter, setActiveFeedFilter] = useState("friends");

    // Add state for handling likes and comments
    const [likedPosts, setLikedPosts] = useState<number[]>([]);
    const [activeCommentInput, setActiveCommentInput] = useState<number | null>(null);
    const [commentText, setCommentText] = useState("");
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
    
    // Add state for sharing functionality
    const [postText, setPostText] = useState("");
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
    const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
    const imageInputRef = useRef<HTMLInputElement>(null);

    // Posts with comments for different feed filters
    const [friendsPosts, setFriendsPosts] = useState<(Post & { comments?: { user: User; text: string; timeAgo: string }[] })[]>([
        {
            id: 1,
            user: {
                id: 2,
                name: "George Lobko",
                username: "georgelobko",
                avatar: getGithubAvatar(getRandomGithubId()),
            },
            content: "Hi everyone, today I was on the most beautiful mountain in the world 🌍, I also want to say hi to",
            images: ["https://picsum.photos/id/29/600/400", "https://picsum.photos/id/30/600/400", "https://picsum.photos/id/28/600/400"],
            likes: 6355,
            timeAgo: "2 hours ago",
            mentions: [
                { name: "Silena", username: "silena" },
                { name: "Olya", username: "olya" },
                { name: "Davis", username: "davis" },
            ],
            reactions: [
                { emoji: "🔥", count: 1 },
                { emoji: "😍", count: 1 },
                { emoji: "😱", count: 1 },
                { emoji: "❤️", count: 1 },
            ],
            comments: [
                {
                    user: {
                        id: 10,
                        name: "Maria K.",
                        username: "mariak",
                        avatar: getGithubAvatar(getRandomGithubId()),
                    },
                    text: "Absolutely stunning view! Where exactly is this mountain?",
                    timeAgo: "1 hour ago",
                },
            ],
        },
        {
            id: 2,
            user: {
                id: 3,
                name: "Vitaliy Boyko",
                username: "vitaliyboyko",
                avatar: getGithubAvatar(getRandomGithubId()),
            },
            content:
                "I chose a wonderful coffee today, I wanted to tell you what product they have in stock, it's a latte with coconut 🥥 milk... delicious... it's really incredibly tasty!!! 😋",
            images: [],
            likes: 129,
            timeAgo: "3 hours ago",
            comments: [],
        },
    ]);

    const [recentsPosts, setRecentsPosts] = useState<(Post & { comments?: { user: User; text: string; timeAgo: string }[] })[]>([
        {
            id: 3,
            user: {
                id: 11,
                name: "Alex Morgan",
                username: "alexmorgan",
                avatar: getGithubAvatar(getRandomGithubId()),
            },
            content: "Just launched my new portfolio website! 🚀 Check it out and let me know what you think.",
            images: ["https://picsum.photos/id/1/600/400"],
            likes: 421,
            timeAgo: "20 minutes ago",
            comments: [],
        },
        {
            id: 4,
            user: {
                id: 12,
                name: "Sophia Chen",
                username: "sophiachen",
                avatar: getGithubAvatar(getRandomGithubId()),
            },
            content: "Finished reading 'Atomic Habits' today. Highly recommend! What books have you read recently that changed your perspective?",
            images: ["https://picsum.photos/id/24/600/400"],
            likes: 87,
            timeAgo: "Just now",
            comments: [
                {
                    user: {
                        id: 13,
                        name: "James Peterson",
                        username: "jamesp",
                        avatar: getGithubAvatar(getRandomGithubId()),
                    },
                    text: "I loved that book! I'm currently reading 'Deep Work' by Cal Newport.",
                    timeAgo: "5 minutes ago",
                },
            ],
        },
    ]);

    const [popularPosts, setPopularPosts] = useState<(Post & { comments?: { user: User; text: string; timeAgo: string }[] })[]>([
        {
            id: 5,
            user: {
                id: 14,
                name: "Mike Tyson",
                username: "ironmike",
                avatar: getGithubAvatar(getRandomGithubId()),
            },
            content: "Sometimes it's not about how hard you can hit, but how hard you can get hit and keep moving forward.",
            images: ["https://picsum.photos/id/26/600/400", "https://picsum.photos/id/27/600/400"],
            likes: 8947,
            timeAgo: "2 days ago",
            comments: [
                {
                    user: {
                        id: 15,
                        name: "Roberto Carlos",
                        username: "roberto11",
                        avatar: getGithubAvatar(getRandomGithubId()),
                    },
                    text: "Legend! 🥊",
                    timeAgo: "1 day ago",
                },
                {
                    user: {
                        id: 16,
                        name: "Luna Smith",
                        username: "lunasmith",
                        avatar: getGithubAvatar(getRandomGithubId()),
                    },
                    text: "This quote changed my life. Thank you for the inspiration!",
                    timeAgo: "12 hours ago",
                },
            ],
        },
        {
            id: 6,
            user: {
                id: 17,
                name: "Emma Watson",
                username: "emmaw",
                avatar: getGithubAvatar(getRandomGithubId()),
            },
            content: "The new climate initiative we launched last month has already planted over 50,000 trees worldwide! So proud of our team and community. 🌳 #ClimateAction",
            images: ["https://picsum.photos/id/10/600/400"],
            likes: 12546,
            timeAgo: "5 days ago",
            comments: [],
        },
    ]);

    // Ensure the posts state shows the correct posts based on the active filter
    const [posts, setPosts] = useState<(Post & { comments?: { user: User; text: string; timeAgo: string }[] })[]>(friendsPosts);

    // Update posts when filter changes
    useEffect(() => {
        if (activeFeedFilter === "recents") {
            setPosts(recentsPosts);
        } else if (activeFeedFilter === "friends") {
            setPosts(friendsPosts);
        } else if (activeFeedFilter === "popular") {
            setPosts(popularPosts);
        }
    }, [activeFeedFilter, friendsPosts, recentsPosts, popularPosts]);

    const [stories, setStories] = useState<Story[]>([
        {
            id: 1,
            user: {
                id: 4,
                name: "Anatoly P.",
                username: "anatolyp",
                avatar: getGithubAvatar(getRandomGithubId()),
            },
            image: "https://picsum.photos/id/24/400/500",
        },
        {
            id: 2,
            user: {
                id: 5,
                name: "Lolita Earns",
                username: "lolitaearns",
                avatar: getGithubAvatar(getRandomGithubId()),
            },
            image: "https://picsum.photos/id/25/400/500",
        },
    ]);

    // Additional state for suggestions and modal
    const [suggestionsModalOpen, setSuggestionsModalOpen] = useState(false);
    const [allSuggestions, setAllSuggestions] = useState<Suggestion[]>([]);
    const [locationInput, setLocationInput] = useState("");
    const [showLocationInput, setShowLocationInput] = useState(false);
    const locationInputRef = useRef<HTMLInputElement>(null);

    const [suggestions, setSuggestions] = useState<Suggestion[]>([
        {
            id: 1,
            user: {
                id: 6,
                name: "Nick Shelburne",
                username: "nickshelburne",
                avatar: getGithubAvatar(getRandomGithubId()),
            },
            followed: false,
        },
        {
            id: 2,
            user: {
                id: 7,
                name: "Brittni Lando",
                username: "brittnilando",
                avatar: getGithubAvatar(getRandomGithubId()),
            },
            followed: false,
        },
        {
            id: 3,
            user: {
                id: 8,
                name: "Ivan Shevchenko",
                username: "ivanshevchenko",
                avatar: getGithubAvatar(getRandomGithubId()),
            },
            followed: false,
        },
    ]);

    const [recommendations, setRecommendations] = useState<Recommendation[]>([
        {
            id: 1,
            title: "UI/UX",
            icon: "https://picsum.photos/id/20/200/200",
        },
        {
            id: 2,
            title: "Music",
            icon: "https://picsum.photos/id/21/200/200",
        },
        {
            id: 3,
            title: "Cooking",
            icon: "https://picsum.photos/id/22/200/200",
        },
        {
            id: 4,
            title: "Hiking",
            icon: "https://picsum.photos/id/23/200/200",
        },
    ]);

    // Generate more suggestions for the modal
    useEffect(() => {
        const generateMoreSuggestions = () => {
            const moreSuggestions: Suggestion[] = [...suggestions];
            
            // Add 20 more random suggestions
            for (let i = 4; i <= 23; i++) {
                const firstName = ["Alex", "Jamie", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Charlie", "Avery", "Quinn"][Math.floor(Math.random() * 10)];
                const lastName = ["Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor"][Math.floor(Math.random() * 10)];
                
                moreSuggestions.push({
                    id: i,
                    user: {
                        id: i + 10,
                        name: `${firstName} ${lastName}`,
                        username: `${firstName.toLowerCase()}${lastName.toLowerCase()}`,
                        avatar: getGithubAvatar(getRandomGithubId()),
                    },
                    followed: false,
                });
            }
            
            setAllSuggestions(moreSuggestions);
        };
        
        generateMoreSuggestions();
    }, [suggestions]);

    // Handle follow user
    const handleFollowUser = (id: number) => {
        // Update the suggestions state
        setSuggestions(suggestions.map(suggestion => 
            suggestion.id === id 
                ? { ...suggestion, followed: !suggestion.followed }
                : suggestion
        ));
        
        // Also update in all suggestions for the modal
        setAllSuggestions(allSuggestions.map(suggestion => 
            suggestion.id === id 
                ? { ...suggestion, followed: !suggestion.followed }
                : suggestion
        ));
        
        // Show toast notification
        const suggestion = suggestions.find(s => s.id === id) || allSuggestions.find(s => s.id === id);
        if (suggestion) {
            const isNowFollowed = !suggestion.followed;
            toast.success(
                isNowFollowed 
                    ? `You are now following ${suggestion.user.name}` 
                    : `You unfollowed ${suggestion.user.name}`,
                { position: "top-right", autoClose: 3000 }
            );
        }
    };

    // Toggle location input
    const handleToggleLocationInput = () => {
        setShowLocationInput(true);
        setIsLocationPickerOpen(!isLocationPickerOpen);
        
        // Focus on input when showing location input
        if (!showLocationInput) {
            setTimeout(() => {
                locationInputRef.current?.focus();
            }, 100);
        }
    };

    // Handle location input change
    const handleLocationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocationInput(e.target.value);
    };

    // Handle location submit
    const handleLocationSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (locationInput.trim()) {
            handleLocationSelect(locationInput);
        }
    };

    // Handle location selection
    const handleLocationSelect = (location: string) => {
        setSelectedLocation(location);
        setIsLocationPickerOpen(false);
        setShowLocationInput(false);
        setLocationInput("");
        toast.info(`Location set to: ${location}`, {
            position: "top-right",
            autoClose: 2000,
        });
    };

    // Add state for story viewer
    const [activeStory, setActiveStory] = useState<Story | null>(null);
    const [storyProgress, setStoryProgress] = useState(0);
    const [storyTimer, setStoryTimer] = useState<NodeJS.Timeout | null>(null);

    // Function to handle story click
    const handleStoryClick = (story: Story) => {
        setActiveStory(story);
        setStoryProgress(0);
    };

    // Function to close story
    const closeStory = () => {
        setActiveStory(null);
        setStoryProgress(0);
        if (storyTimer) {
            clearInterval(storyTimer);
            setStoryTimer(null);
        }
    };

    // Handle story timer and progress
    useEffect(() => {
        if (activeStory) {
            if (storyTimer) {
                clearInterval(storyTimer);
            }
            
            const timer = setInterval(() => {
                setStoryProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(timer);
                        setActiveStory(null);
                        return 0;
                    }
                    return prev + (100 / 7000) * 100; // 100% over 7 seconds
                });
            }, 100);
            
            setStoryTimer(timer);
            
            return () => {
                clearInterval(timer);
            };
        }
    }, [activeStory]);

    // Handle like toggle
    const handleLikeToggle = (postId: number) => {
        if (likedPosts.includes(postId)) {
            // Unlike
            setLikedPosts(likedPosts.filter(id => id !== postId));
            setPosts(posts.map(post => 
                post.id === postId 
                    ? { ...post, likes: post.likes - 1 }
                    : post
            ));
        } else {
            // Like
            setLikedPosts([...likedPosts, postId]);
            setPosts(posts.map(post => 
                post.id === postId 
                    ? { ...post, likes: post.likes + 1 }
                    : post
            ));
        }
    };

    // Handle comment toggle
    const handleCommentToggle = (postId: number) => {
        setActiveCommentInput(activeCommentInput === postId ? null : postId);
        setCommentText("");
    };

    // Handle comment submit
    const handleCommentSubmit = (postId: number) => {
        if (commentText.trim()) {
            const updatedPosts = posts.map(post => 
                post.id === postId 
                    ? { 
                        ...post, 
                        comments: [
                            ...(post.comments || []),
                            {
                                user: currentUser,
                                text: commentText,
                                timeAgo: "Just now",
                            }
                        ]
                    }
                    : post
            );
            
            // Update the correct post array based on active filter
            if (activeFeedFilter === "recents") {
                setRecentsPosts(updatedPosts.filter(post => recentsPosts.some(p => p.id === post.id)));
            } else if (activeFeedFilter === "friends") {
                setFriendsPosts(updatedPosts.filter(post => friendsPosts.some(p => p.id === post.id)));
            } else if (activeFeedFilter === "popular") {
                setPopularPosts(updatedPosts.filter(post => popularPosts.some(p => p.id === post.id)));
            }
            
            setPosts(updatedPosts);
            setCommentText("");
            setActiveCommentInput(null);
        }
    };

    // Toggle dropdown menu
    const toggleDropdown = (postId: number) => {
        setOpenDropdownId(openDropdownId === postId ? null : postId);
    };

    // Hide post
    const hidePost = (postId: number) => {
        setPosts(posts.filter(post => post.id !== postId));
        setOpenDropdownId(null);
        toast.success("Post hidden successfully", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    };

    // Save post
    const savePost = (postId: number) => {
        // In a real app, you would save this to user's bookmarks
        toast.success("Post saved to bookmarks", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
        setOpenDropdownId(null);
    };

    // Report post
    const reportPost = (postId: number) => {
        toast.info("Post reported. We'll review it shortly.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
        setOpenDropdownId(null);
    };

    // Handle image selection
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newImages = Array.from(e.target.files).map(file => URL.createObjectURL(file));
            setSelectedImages([...selectedImages, ...newImages]);
            toast.success(`${newImages.length} image${newImages.length > 1 ? 's' : ''} selected!`, {
                position: "top-right",
                autoClose: 2000,
            });
        }
    };

    // Clear all selected items
    const clearSelectedItems = () => {
        setSelectedImages([]);
        setSelectedLocation(null);
    };

    // Handle post submission
    const handlePostSubmit = () => {
        if (!postText.trim() && selectedImages.length === 0) {
            toast.error("Please write something or add an image to share", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        const newPost: Post & { comments?: { user: User; text: string; timeAgo: string }[] } = {
            id: Date.now(),
            user: currentUser,
            content: selectedLocation ? `${postText} 📍 ${selectedLocation}` : postText,
            images: selectedImages,
            likes: 0,
            timeAgo: "Just now",
            comments: [],
        };

        // Add to the correct post array based on active filter
        if (activeFeedFilter === "recents") {
            setRecentsPosts([newPost, ...recentsPosts]);
        } else if (activeFeedFilter === "friends") {
            setFriendsPosts([newPost, ...friendsPosts]);
        } else if (activeFeedFilter === "popular") {
            setPopularPosts([newPost, ...popularPosts]);
        }

        // Clear the form
        setPostText("");
        clearSelectedItems();
        toast.success("Post shared successfully!", {
            position: "top-right",
            autoClose: 3000,
        });
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Toast container for notifications */}
            <ToastContainer />
            
            {/* Hidden file input for image selection */}
            <input 
                type="file" 
                ref={imageInputRef} 
                className="hidden" 
                accept="image/*" 
                multiple 
                onChange={handleImageSelect} 
            />
            
            {/* Suggestions Modal */}
            {suggestionsModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="text-xl font-bold">Suggested People to Follow</h3>
                            <button 
                                onClick={() => setSuggestionsModalOpen(false)}
                                className="text-gray-500 hover:text-black"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-4 overflow-y-auto flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {allSuggestions.map((suggestion) => (
                                    <div key={suggestion.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center">
                                            <Image
                                                src={suggestion.user.avatar}
                                                alt={suggestion.user.name}
                                                width={48}
                                                height={48}
                                                className="rounded-full mr-3"
                                            />
                                            <div>
                                                <h4 className="font-medium" style={{ fontFamily: fonts.heading }}>
                                                    {suggestion.user.name}
                                                </h4>
                                                <p className="text-gray-500 text-sm">@{suggestion.user.username}</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleFollowUser(suggestion.id)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium ${
                                                suggestion.followed 
                                                    ? "bg-blue-100 text-blue-600" 
                                                    : "bg-black text-white"
                                            }`}
                                        >
                                            {suggestion.followed ? (
                                                <span className="flex items-center">
                                                    <CheckCircle size={16} className="mr-1" />
                                                    Followed
                                                </span>
                                            ) : "Follow"}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Story viewer overlay */}
            {activeStory && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
                    {/* Close button moved to top right corner of screen */}
                    <button 
                        onClick={closeStory}
                        className="absolute top-6 right-6 z-20 text-white bg-transparent p-2 rounded-full cursor-pointer hover:bg-white hover:bg-opacity-20 transition-all"
                    >
                        <X size={28} />
                    </button>
                    
                    <div className="relative w-full max-w-lg h-screen max-h-[80vh]">
                        {/* Story image container with rounded corners */}
                        <div className="w-full h-full relative overflow-hidden rounded-2xl">
                            {/* Progress bar moved inside the image at the top */}
                            <div className="absolute top-4 left-4 right-4 h-1.5 bg-gray-500/50 z-10 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-white transition-all duration-100 ease-linear" 
                                    style={{ width: `${storyProgress}%` }}
                                ></div>
                            </div>
                            
                            {/* Story image with object-cover to fill properly */}
                            <Image 
                                src={activeStory.image} 
                                alt="Story" 
                                fill 
                                className="object-cover"
                                style={{ borderRadius: "16px" }}
                            />
                            
                            {/* User info at bottom with white background */}
                            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-full py-2 px-4 flex items-center shadow-md z-10 w-auto max-w-[90%]">
                                <Image
                                    src={activeStory.user.avatar}
                                    alt={activeStory.user.name}
                                    width={32}
                                    height={32}
                                    className="rounded-full mr-3"
                                />
                                <div className="text-black">
                                    <h4 className="font-semibold text-sm">{activeStory.user.name}</h4>
                                    <p className="text-xs text-gray-500">@{activeStory.user.username}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile header - only visible on small screens */}
            <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center">
                    <h1 className="text-xl font-bold">Tuxedo</h1>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="w-10 h-10 flex items-center justify-center text-gray-600 cursor-pointer">
                        <Search size={20} />
                    </button>
                    <MobileMenu 
                        currentUser={currentUser}
                        activeSection={activeSection}
                        onSectionChange={setActiveSection}
                    />
                </div>
            </div>

            <div className="flex h-[calc(100vh-60px)] md:h-screen">
                {/* Left sidebar - hidden on mobile - removed border */}
                <div className="hidden md:flex w-64 bg-white p-6 flex-col">
                    <div className="flex items-center mb-10">
                        <div className="relative w-12 h-12 mr-3">
                            <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 via-pink-400 to-orange-300"></div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-teal-400"></div>
                            <Image
                                src={currentUser.avatar}
                                alt={currentUser.name}
                                width={48}
                                height={48}
                                className="rounded-full border-2 border-white z-10 relative"
                            />
                        </div>
                        <div>
                            <h3 className="font-bold" style={{ fontFamily: fonts.heading }}>
                                {currentUser.name}
                            </h3>
                            <p className="text-gray-500 text-sm">@{currentUser.username}</p>
                        </div>
                    </div>

                    <nav className="flex-1">
                        <ul className="space-y-3">
                            <SidebarItem 
                                icon={<HomeIcon className={`h-4 w-4 ${activeSection === "newsfeed" ? "text-white" : "text-gray-700"}`} />} 
                                label="News Feed" 
                                isActive={activeSection === "newsfeed"}
                                onClick={() => setActiveSection("newsfeed")}
                            />
                            <SidebarItem 
                                icon={<MessageSquare className={`h-4 w-4 ${activeSection === "messages" ? "text-white" : "text-gray-700"}`} />} 
                                label="Messages" 
                                count={6}
                                isActive={activeSection === "messages"}
                                onClick={() => setActiveSection("messages")}
                            />
                            <SidebarItem 
                                icon={<Users className={`h-4 w-4 ${activeSection === "friends" ? "text-white" : "text-gray-700"}`} />} 
                                label="Friends" 
                                count={3}
                                isActive={activeSection === "friends"}
                                onClick={() => setActiveSection("friends")}
                            />
                            <SidebarItem 
                                icon={<Settings className={`h-4 w-4 ${activeSection === "settings" ? "text-white" : "text-gray-700"}`} />} 
                                label="Settings" 
                                isActive={activeSection === "settings"}
                                onClick={() => setActiveSection("settings")}
                            />
                        </ul>
                    </nav>
                </div>

                {/* Main content - Feed */}
                <div className="flex-1 bg-white overflow-y-auto">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold" style={{ fontFamily: fonts.heading }}>
                                Feeds
                            </h2>
                            
                            <div className="flex">
                                <button 
                                    onClick={() => setActiveFeedFilter("recents")} 
                                    className={`cursor-pointer mr-6 transition-colors duration-200 hover:text-black ${activeFeedFilter === "recents" 
                                        ? "text-black font-semibold" 
                                        : "text-gray-500"}`}
                                >
                                    Recents
                                </button>
                                <button 
                                    onClick={() => setActiveFeedFilter("friends")} 
                                    className={`cursor-pointer mr-6 transition-colors duration-200 hover:text-black ${activeFeedFilter === "friends" 
                                        ? "text-black font-semibold" 
                                        : "text-gray-500"}`}
                                >
                                    Friends
                                </button>
                                <button 
                                    onClick={() => setActiveFeedFilter("popular")} 
                                    className={`cursor-pointer transition-colors duration-200 hover:text-black ${activeFeedFilter === "popular" 
                                        ? "text-black font-semibold" 
                                        : "text-gray-500"}`}
                                >
                                    Popular
                                </button>
                            </div>
                        </div>

                        {/* Post input field with improved location functionality */}
                        <div className="bg-[#f4f1f2] rounded-xl p-4 mb-6">
                            <div className="relative flex items-center">
                                <div className="absolute left-0 z-10">
                                    <Image
                                        src={currentUser.avatar}
                                        alt={currentUser.name}
                                        width={36}
                                        height={36}
                                        className="rounded-full"
                                    />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Share something"
                                    className="flex-1 bg-white rounded-full py-2 pl-16 pr-12 text-gray-700 focus:outline-none"
                                    value={postText}
                                    onChange={(e) => setPostText(e.target.value)}
                                />
                            </div>

                            {/* Show selected images */}
                            {selectedImages.length > 0 && (
                                <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {selectedImages.map((img, idx) => (
                                        <div key={idx} className="relative rounded-lg h-24 overflow-hidden">
                                            <Image src={img} alt="Selected image" fill className="object-cover" />
                                            <button 
                                                className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                                onClick={() => setSelectedImages(selectedImages.filter((_, i) => i !== idx))}
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Show selected location */}
                            {selectedLocation && (
                                <div className="mt-3 flex items-center bg-white rounded-full px-3 py-2 text-sm">
                                    <MapPin className="text-gray-500 w-4 h-4 mr-2" />
                                    <span className="text-gray-700">{selectedLocation}</span>
                                    <button 
                                        className="ml-auto text-gray-500"
                                        onClick={() => setSelectedLocation(null)}
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            )}

                            {/* Location input */}
                            {showLocationInput && !selectedLocation && (
                                <div className="mt-3">
                                    <form onSubmit={handleLocationSubmit} className="flex">
                                        <div className="relative flex-1">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <MapPin className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                ref={locationInputRef}
                                                type="text"
                                                className="bg-white w-full pl-10 pr-4 py-2 border border-gray-200 rounded-l-lg focus:outline-none"
                                                placeholder="Enter your location"
                                                value={locationInput}
                                                onChange={handleLocationInputChange}
                                            />
                                        </div>
                                        <button 
                                            type="submit"
                                            className="bg-gray-800 text-white px-4 rounded-r-lg"
                                        >
                                            Add
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* Location suggestions */}
                            {isLocationPickerOpen && !selectedLocation && (
                                <div className="mt-3 bg-white rounded-lg shadow-lg p-3">
                                    <h4 className="text-sm font-semibold mb-2">Popular locations:</h4>
                                    <div className="space-y-2">
                                        {["New York, USA", "London, UK", "Tokyo, Japan", "Sydney, Australia", "Paris, France"].map((location) => (
                                            <button
                                                key={location}
                                                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-lg flex items-center"
                                                onClick={() => handleLocationSelect(location)}
                                            >
                                                <MapPin className="text-gray-500 w-4 h-4 mr-2" />
                                                {location}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex mt-4 justify-between flex-wrap">
                                <div className="flex space-x-2 sm:space-x-4 mb-2 sm:mb-0">
                                    <button 
                                        className="flex items-center text-gray-600 text-sm sm:text-base cursor-pointer"
                                        onClick={() => toast.info("File upload feature coming soon!", { position: "top-right" })}
                                    >
                                        <File className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                                        <span>File</span>
                                    </button>
                                    <button 
                                        className="flex items-center text-gray-600 text-sm sm:text-base cursor-pointer"
                                        onClick={() => imageInputRef.current?.click()}
                                    >
                                        <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                                        <span>Image</span>
                                    </button>
                                    <button 
                                        className="flex items-center text-gray-600 text-sm sm:text-base cursor-pointer"
                                        onClick={handleToggleLocationInput}
                                    >
                                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                                        <span>Location</span>
                                    </button>
                                </div>
                                <div className="flex items-center">
                                    <select className="mr-3 text-sm sm:text-base bg-transparent text-gray-500 cursor-pointer focus:outline-none">
                                        <option value="public">Public</option>
                                        <option value="friends">Friends</option>
                                        <option value="private">Private</option>
                                    </select>
                                    <button 
                                        className="bg-black text-white px-3 sm:px-5 py-1 sm:py-2 rounded-full flex items-center text-sm sm:text-base cursor-pointer"
                                        onClick={handlePostSubmit}
                                    >
                                        <Send className="w-4 h-4 mr-2" />
                                        <span>Share</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Posts */}
                        <div className="space-y-6">
                            {posts.map((post) => (
                                <div
                                    key={post.id}
                                    className={`rounded-xl overflow-hidden ${
                                        post.id % 4 === 0 ? "bg-[#ffe8d9]" :
                                        post.id % 3 === 0 ? "bg-[#daffee]" :
                                        post.id % 2 === 0 ? "bg-[#fff5df]" :
                                        "bg-[#dfebff]"
                                    }`}
                                >
                                    <div className="p-3 sm:p-4">
                                        <div className="flex justify-between mb-4">
                                            <div className="flex">
                                                <Image
                                                    src={post.user.avatar}
                                                    alt={post.user.name}
                                                    width={40}
                                                    height={40}
                                                    className="rounded-full mr-2 sm:mr-3 w-8 h-8 sm:w-10 sm:h-10"
                                                />
                                                <div>
                                                    <h4 className="font-bold text-sm sm:text-base" style={{ fontFamily: fonts.heading }}>
                                                        {post.user.name}
                                                    </h4>
                                                    <p className="text-gray-500 text-xs sm:text-sm">{post.timeAgo}</p>
                                                </div>
                                            </div>
                                            <div className="relative">
                                                <button 
                                                    className="text-gray-400 cursor-pointer"
                                                    onClick={() => toggleDropdown(post.id)}
                                                >
                                                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                                                        <circle cx="12" cy="6" r="2" />
                                                        <circle cx="12" cy="12" r="2" />
                                                        <circle cx="12" cy="18" r="2" />
                                                    </svg>
                                                </button>
                                                
                                                {/* Dropdown menu */}
                                                {openDropdownId === post.id && (
                                                    <div className="absolute right-0 top-full mt-1 bg-white shadow-lg rounded-lg py-2 w-48 z-10">
                                                        <button 
                                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                                            onClick={() => savePost(post.id)}
                                                        >
                                                            Save post
                                                        </button>
                                                        <button 
                                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                                            onClick={() => hidePost(post.id)}
                                                        >
                                                            Hide post
                                                        </button>
                                                        <button 
                                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
                                                            onClick={() => reportPost(post.id)}
                                                        >
                                                            Report post
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <p className="text-sm sm:text-base">
                                                {post.content}
                                                {post.mentions &&
                                                    post.mentions.map((mention, idx) => (
                                                        <span key={idx}>
                                                            {idx > 0 && ", "}
                                                            <a href="#" className="ml-1 font-semibold text-blue-600 hover:underline cursor-pointer">
                                                                {mention.name}
                                                            </a>
                                                        </span>
                                                    ))}
                                                {post.mentions && "!"}
                                            </p>
                                        </div>

                                        {post.images && post.images.length > 0 && (
                                            <div
                                                className={`grid ${
                                                    post.images.length === 1 
                                                        ? "grid-cols-1" 
                                                        : post.images.length === 2 
                                                            ? "grid-cols-2" 
                                                            : "grid-cols-2 sm:grid-cols-3"
                                                } gap-2 mb-4`}
                                            >
                                                {post.images.map((img, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`${
                                                            post.images.length > 2 && idx === 2 ? "hidden sm:block" : ""
                                                        } rounded-lg overflow-hidden h-36 sm:h-56 relative`}
                                                    >
                                                        <Image src={img} alt="Post image" fill className="object-cover" />
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex items-center text-gray-500 text-xs sm:text-sm">
                                            <div className="flex items-center mr-3 sm:mr-6">
                                                <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                                <span>{post.likes}</span>
                                            </div>

                                            <button 
                                                className={`flex items-center mr-3 sm:mr-6 cursor-pointer ${likedPosts.includes(post.id) ? 'text-red-500' : ''}`}
                                                onClick={() => handleLikeToggle(post.id)}
                                            >
                                                <Heart 
                                                    className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 ${likedPosts.includes(post.id) ? 'fill-current' : ''}`} 
                                                />
                                                <span>Like</span>
                                            </button>

                                            <button 
                                                className={`flex items-center cursor-pointer ${activeCommentInput === post.id ? 'text-blue-500' : ''}`}
                                                onClick={() => handleCommentToggle(post.id)}
                                            >
                                                <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                                <span>Comment</span>
                                            </button>
                                        </div>

                                        {/* Comments section - removed shadow */}
                                        {post.comments && post.comments.length > 0 && (
                                            <div className="mt-4">
                                                <h5 className="text-sm font-semibold mb-3">Comments</h5>
                                                <div className="space-y-3">
                                                    {post.comments.map((comment, idx) => (
                                                        <div key={idx} className="flex">
                                                            <Image
                                                                src={comment.user.avatar}
                                                                alt={comment.user.name}
                                                                width={32}
                                                                height={32}
                                                                className="rounded-full mr-2 w-7 h-7"
                                                            />
                                                            <div className="bg-white rounded-xl p-2 flex-1">
                                                                <div className="flex justify-between">
                                                                    <h6 className="text-xs font-semibold">{comment.user.name}</h6>
                                                                    <span className="text-xs text-gray-500">{comment.timeAgo}</span>
                                                                </div>
                                                                <p className="text-xs mt-1">{comment.text}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Comment input - removed border-t */}
                                        {activeCommentInput === post.id && (
                                            <div className="mt-4">
                                                <Image
                                                    src={currentUser.avatar}
                                                    alt={currentUser.name}
                                                    width={32}
                                                    height={32}
                                                    className="rounded-full mr-2 w-8 h-8 inline-block"
                                                />
                                                <div className="inline-flex flex-1 w-[calc(100%-40px)]">
                                                    <input
                                                        type="text"
                                                        placeholder="Write a comment..."
                                                        className="flex-1 bg-white border border-gray-200 rounded-l-full px-4 py-2 text-gray-700 focus:outline-none text-sm"
                                                        value={commentText}
                                                        onChange={(e) => setCommentText(e.target.value)}
                                                        onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit(post.id)}
                                                    />
                                                    <button 
                                                        className="bg-black text-white px-4 rounded-r-full flex items-center text-sm"
                                                        onClick={() => handleCommentSubmit(post.id)}
                                                    >
                                                        Post
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right sidebar - hidden on mobile and small tablets - removed border */}
                <div className="hidden lg:block w-80 bg-white p-6 overflow-y-auto">
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold mb-6" style={{ fontFamily: fonts.heading }}>
                            Stories
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {stories.map((story) => (
                                <div 
                                    key={story.id} 
                                    className="rounded-xl overflow-hidden h-40 relative group cursor-pointer"
                                    onClick={() => handleStoryClick(story)}
                                >
                                    <Image src={story.image} alt="Story image" fill className="object-cover" />
                                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                                        <div className="bg-white rounded-full py-1 px-2 flex items-center">
                                            <Image
                                                src={story.user.avatar}
                                                alt={story.user.name}
                                                width={24}
                                                height={24}
                                                className="rounded-full mr-2"
                                            />
                                            <span className="text-black text-xs font-medium truncate">{story.user.name}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-2xl font-bold mb-6" style={{ fontFamily: fonts.heading }}>
                            Suggestions
                        </h3>
                        <div className="space-y-4">
                            {suggestions.map((suggestion) => (
                                <div key={suggestion.id} className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Image
                                            src={suggestion.user.avatar}
                                            alt={suggestion.user.name}
                                            width={40}
                                            height={40}
                                            className="rounded-full mr-3"
                                        />
                                        <div className="max-w-[120px]">
                                            <h4 className="font-medium truncate" style={{ fontFamily: fonts.heading }}>
                                                {suggestion.user.name}
                                            </h4>
                                            <p className="text-gray-500 text-sm truncate">@{suggestion.user.username}</p>
                                        </div>
                                    </div>
                                    <button 
                                        className={`px-3 py-1 text-xs rounded-full cursor-pointer ${
                                            suggestion.followed 
                                                ? "bg-blue-100 text-blue-600" 
                                                : "bg-black text-white"
                                        }`}
                                        onClick={() => handleFollowUser(suggestion.id)}
                                    >
                                        {suggestion.followed ? "Followed" : "Follow"}
                                    </button>
                                </div>
                            ))}
                            <button 
                                className="text-gray-500 text-sm mt-2 cursor-pointer hover:text-black"
                                onClick={() => setSuggestionsModalOpen(true)}
                            >
                                See all
                            </button>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-2xl font-bold mb-6" style={{ fontFamily: fonts.heading }}>
                            Recommendations
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {recommendations.map((rec) => (
                                <div
                                    key={rec.id}
                                    className="bg-gray-100 rounded-xl p-4 flex flex-col items-center justify-center h-24 relative overflow-hidden cursor-pointer"
                                >
                                    <div className="absolute inset-0">
                                        <Image src={rec.icon} alt={rec.title} fill className="object-cover opacity-20" />
                                    </div>
                                    {rec.title === "UI/UX" && <span className="absolute text-4xl font-bold">✘</span>}
                                    {rec.title === "Music" && (
                                        <div className="absolute flex flex-col items-center">
                                            <span className="text-lg">♪</span>
                                            <span className="text-lg">♫</span>
                                        </div>
                                    )}
                                    {rec.title === "Hiking" && <span className="absolute text-2xl">🏔️</span>}
                                    <span className="z-10 text-black font-medium truncate">{rec.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
