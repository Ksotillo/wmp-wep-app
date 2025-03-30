"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Search, Settings, MapPin, File, Image as ImageIcon, Heart, MessageSquare, Eye, Home as HomeIcon, Users, X, Send, Paperclip, ChevronDown, CheckCircle } from "lucide-react";
import MobileMenu from "./components/MobileMenu";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


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

type Message = {
    id: number;
    sender: User;
    receiver: User;
    text: string;
    time: string;
    isRead: boolean;
};

type Chat = {
    id: number;
    user: User;
    messages: Message[];
    lastMessage?: Message;
    unreadCount: number;
};


const getRandomGithubId = () => {
    return Math.floor(Math.random() * 70000000) + 1;
};


const getGithubAvatar = (userId: number) => {
    return `https://avatars.githubusercontent.com/u/${userId}?v=4`;
};


const fonts = {
    heading: "system-ui",
    body: "system-ui",
};


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

    
    const [activeSection, setActiveSection] = useState("newsfeed");
    
    const [activeFeedFilter, setActiveFeedFilter] = useState("friends");
    
    const [activeFriendsFilter, setActiveFriendsFilter] = useState("friends");

    
    const [likedPosts, setLikedPosts] = useState<number[]>([]);
    const [activeCommentInput, setActiveCommentInput] = useState<number | null>(null);
    const [commentText, setCommentText] = useState("");
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
    
    
    const [postText, setPostText] = useState("");
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
    const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
    const imageInputRef = useRef<HTMLInputElement>(null);

    
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

    
    const [posts, setPosts] = useState<(Post & { comments?: { user: User; text: string; timeAgo: string }[] })[]>(friendsPosts);

    
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

    
    useEffect(() => {
        const generateMoreSuggestions = () => {
            const moreSuggestions: Suggestion[] = [...suggestions];
            
            
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

    
    const handleFollowUser = (id: number) => {
        
        setSuggestions(suggestions.map(suggestion => 
            suggestion.id === id 
                ? { ...suggestion, followed: !suggestion.followed }
                : suggestion
        ));
        
        
        setAllSuggestions(allSuggestions.map(suggestion => 
            suggestion.id === id 
                ? { ...suggestion, followed: !suggestion.followed }
                : suggestion
        ));
        
        
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

    
    const handleToggleLocationInput = () => {
        setShowLocationInput(true);
        setIsLocationPickerOpen(!isLocationPickerOpen);
        
        
        if (!showLocationInput) {
            setTimeout(() => {
                locationInputRef.current?.focus();
            }, 100);
        }
    };

    
    const handleLocationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocationInput(e.target.value);
    };

    
    const handleLocationSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (locationInput.trim()) {
            handleLocationSelect(locationInput);
        }
    };

    
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

    
    const [activeStory, setActiveStory] = useState<Story | null>(null);
    const [storyProgress, setStoryProgress] = useState(0);
    const [storyTimer, setStoryTimer] = useState<NodeJS.Timeout | null>(null);

    
    const handleStoryClick = (story: Story) => {
        setActiveStory(story);
        setStoryProgress(0);
    };

    
    const closeStory = () => {
        setActiveStory(null);
        setStoryProgress(0);
        if (storyTimer) {
            clearInterval(storyTimer);
            setStoryTimer(null);
        }
    };

    
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
                    return prev + (100 / 7000) * 100; 
                });
            }, 100);
            
            setStoryTimer(timer);
            
            return () => {
                clearInterval(timer);
            };
        }
    }, [activeStory]);

    
    const handleLikeToggle = (postId: number) => {
        if (likedPosts.includes(postId)) {
            
            setLikedPosts(likedPosts.filter(id => id !== postId));
            setPosts(posts.map(post => 
                post.id === postId 
                    ? { ...post, likes: post.likes - 1 }
                    : post
            ));
        } else {
            
            setLikedPosts([...likedPosts, postId]);
            setPosts(posts.map(post => 
                post.id === postId 
                    ? { ...post, likes: post.likes + 1 }
                    : post
            ));
        }
    };

    
    const handleCommentToggle = (postId: number) => {
        setActiveCommentInput(activeCommentInput === postId ? null : postId);
        setCommentText("");
    };

    
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

    
    const toggleDropdown = (postId: number) => {
        setOpenDropdownId(openDropdownId === postId ? null : postId);
    };

    
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

    
    const savePost = (postId: number) => {
        
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

    
    const clearSelectedItems = () => {
        setSelectedImages([]);
        setSelectedLocation(null);
    };

    
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

        
        if (activeFeedFilter === "recents") {
            setRecentsPosts([newPost, ...recentsPosts]);
        } else if (activeFeedFilter === "friends") {
            setFriendsPosts([newPost, ...friendsPosts]);
        } else if (activeFeedFilter === "popular") {
            setPopularPosts([newPost, ...popularPosts]);
        }

        
        setPostText("");
        clearSelectedItems();
        toast.success("Post shared successfully!", {
            position: "top-right",
            autoClose: 3000,
        });
    };

    
    const [chats, setChats] = useState<Chat[]>([
        {
            id: 1,
            user: {
                id: 101,
                name: "Emily Johnson",
                username: "emilyjohnson",
                avatar: getGithubAvatar(getRandomGithubId()),
            },
            messages: [
                {
                    id: 1,
                    sender: {
                        id: 101,
                        name: "Emily Johnson",
                        username: "emilyjohnson",
                        avatar: getGithubAvatar(getRandomGithubId()),
                    },
                    receiver: currentUser,
                    text: "Hi there! How's your project coming along?",
                    time: "10:20 AM",
                    isRead: true,
                },
                {
                    id: 2,
                    sender: currentUser,
                    receiver: {
                        id: 101,
                        name: "Emily Johnson",
                        username: "emilyjohnson",
                        avatar: getGithubAvatar(getRandomGithubId()),
                    },
                    text: "Hey Emily! It's going well, thanks for asking. I'm just finishing up the UI design.",
                    time: "10:22 AM",
                    isRead: true,
                },
                {
                    id: 3,
                    sender: {
                        id: 101,
                        name: "Emily Johnson",
                        username: "emilyjohnson",
                        avatar: getGithubAvatar(getRandomGithubId()),
                    },
                    receiver: currentUser,
                    text: "That's great! Can't wait to see it. Are we still meeting tomorrow?",
                    time: "10:25 AM",
                    isRead: false,
                },
            ],
            unreadCount: 1,
        },
        {
            id: 2,
            user: {
                id: 102,
                name: "Michael Torres",
                username: "michael_t",
                avatar: getGithubAvatar(getRandomGithubId()),
            },
            messages: [
                {
                    id: 1,
                    sender: {
                        id: 102,
                        name: "Michael Torres",
                        username: "michael_t",
                        avatar: getGithubAvatar(getRandomGithubId()),
                    },
                    receiver: currentUser,
                    text: "Hey, did you see the new design system docs?",
                    time: "Yesterday",
                    isRead: true,
                },
                {
                    id: 2,
                    sender: currentUser,
                    receiver: {
                        id: 102,
                        name: "Michael Torres",
                        username: "michael_t",
                        avatar: getGithubAvatar(getRandomGithubId()),
                    },
                    text: "Not yet! I'll check them out today.",
                    time: "Yesterday",
                    isRead: true,
                },
            ],
            unreadCount: 0,
        },
        {
            id: 3,
            user: {
                id: 103,
                name: "Sarah Miller",
                username: "sarahm",
                avatar: getGithubAvatar(getRandomGithubId()),
            },
            messages: [
                {
                    id: 1,
                    sender: {
                        id: 103,
                        name: "Sarah Miller",
                        username: "sarahm",
                        avatar: getGithubAvatar(getRandomGithubId()),
                    },
                    receiver: currentUser,
                    text: "Are we still on for coffee this weekend?",
                    time: "2 days ago",
                    isRead: true,
                },
            ],
            unreadCount: 0,
        },
        {
            id: 4,
            user: {
                id: 104,
                name: "David Lee",
                username: "davidlee",
                avatar: getGithubAvatar(getRandomGithubId()),
            },
            messages: [
                {
                    id: 1,
                    sender: currentUser,
                    receiver: {
                        id: 104,
                        name: "David Lee",
                        username: "davidlee",
                        avatar: getGithubAvatar(getRandomGithubId()),
                    },
                    text: "Hey David, can you send me those project files?",
                    time: "3 days ago",
                    isRead: true,
                },
                {
                    id: 2,
                    sender: {
                        id: 104,
                        name: "David Lee",
                        username: "davidlee",
                        avatar: getGithubAvatar(getRandomGithubId()),
                    },
                    receiver: currentUser,
                    text: "Sure thing! I'll email them to you right away.",
                    time: "3 days ago",
                    isRead: true,
                },
                {
                    id: 3,
                    sender: {
                        id: 104,
                        name: "David Lee",
                        username: "davidlee",
                        avatar: getGithubAvatar(getRandomGithubId()),
                    },
                    receiver: currentUser,
                    text: "Just sent them. Let me know if you need anything else!",
                    time: "3 days ago",
                    isRead: true,
                },
            ],
            unreadCount: 0,
        },
        {
            id: 5,
            user: {
                id: 105,
                name: "Jessica Wang",
                username: "jwang",
                avatar: getGithubAvatar(getRandomGithubId()),
            },
            messages: [
                {
                    id: 1,
                    sender: {
                        id: 105,
                        name: "Jessica Wang",
                        username: "jwang",
                        avatar: getGithubAvatar(getRandomGithubId()),
                    },
                    receiver: currentUser,
                    text: "Hi! Just wanted to remind you about our team meeting tomorrow at 2pm.",
                    time: "4 days ago",
                    isRead: true,
                },
                {
                    id: 2,
                    sender: currentUser,
                    receiver: {
                        id: 105,
                        name: "Jessica Wang",
                        username: "jwang",
                        avatar: getGithubAvatar(getRandomGithubId()),
                    },
                    text: "Thanks for the reminder! I'll be there.",
                    time: "4 days ago",
                    isRead: true,
                },
            ],
            unreadCount: 0,
        },
    ]);

    const [activeChat, setActiveChat] = useState<Chat | null>(null);
    const [newMessage, setNewMessage] = useState("");
    const chatContainerRef = useRef<HTMLDivElement>(null);

    
    useEffect(() => {
        if (chats.length > 0 && !activeChat && activeSection === "messages") {
            setActiveChat(chats[0]);
        }
    }, [chats, activeChat, activeSection]);

    
    useEffect(() => {
        if (chatContainerRef.current && activeChat) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [activeChat]);

    
    const handleSendMessage = () => {
        if (!newMessage.trim() || !activeChat) return;

        const newMessageObj: Message = {
            id: Date.now(),
            sender: currentUser,
            receiver: activeChat.user,
            text: newMessage,
            time: "Just now",
            isRead: true,
        };

        const updatedChats = chats.map(chat => 
            chat.id === activeChat.id 
                ? { 
                    ...chat, 
                    messages: [...chat.messages, newMessageObj],
                    lastMessage: newMessageObj
                } 
                : chat
        );

        setChats(updatedChats);
        setActiveChat(updatedChats.find(chat => chat.id === activeChat.id) || null);
        setNewMessage("");
    };

    
    const handleChatSelect = (chat: Chat) => {
        if (chat.id === activeChat?.id) return;

        const updatedChats = chats.map(c => 
            c.id === chat.id 
                ? {
                    ...c,
                    messages: c.messages.map(msg => ({
                        ...msg,
                        isRead: true
                    })),
                    unreadCount: 0
                }
                : c
        );

        setChats(updatedChats);
        setActiveChat(updatedChats.find(c => c.id === chat.id) || null);
    };

    
    const [friends, setFriends] = useState<User[]>([
        {
            id: 201,
            name: "James Wilson",
            username: "jwilson",
            avatar: getGithubAvatar(getRandomGithubId()),
        },
        {
            id: 202,
            name: "Anna Petrova",
            username: "annapetrova",
            avatar: getGithubAvatar(getRandomGithubId()),
        },
        {
            id: 203,
            name: "Richard Lee",
            username: "richardlee",
            avatar: getGithubAvatar(getRandomGithubId()),
        },
        {
            id: 204,
            name: "Sophia Chen",
            username: "sophiachen",
            avatar: getGithubAvatar(getRandomGithubId()),
        },
        {
            id: 205,
            name: "Carlos Rodriguez",
            username: "crodriguez",
            avatar: getGithubAvatar(getRandomGithubId()),
        },
        {
            id: 206,
            name: "Emma Johnson",
            username: "emmaj",
            avatar: getGithubAvatar(getRandomGithubId()),
        },
        {
            id: 207,
            name: "Alex Tanner",
            username: "alextanner",
            avatar: getGithubAvatar(getRandomGithubId()),
        },
        {
            id: 208,
            name: "Lily Zhang",
            username: "lilyzhang",
            avatar: getGithubAvatar(getRandomGithubId()),
        },
    ]);

    
    const handleRemoveFriend = (friendId: number) => {
        setFriends(friends.filter(friend => friend.id !== friendId));
        toast.success("Friend removed successfully", {
            position: "top-right",
            autoClose: 3000,
        });
    };

    
    useEffect(() => {
        
        if (allSuggestions.length < 24) {
            const generateMoreSuggestions = () => {
                const moreSuggestions: Suggestion[] = [...suggestions];
                
                
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
        }
    }, [suggestions, allSuggestions.length]);

    
    const [editMode, setEditMode] = useState(false);
    const [editedName, setEditedName] = useState("");
    const [editedUsername, setEditedUsername] = useState("");
    const [editedBio, setEditedBio] = useState("Product Designer and Developer based in New York");
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
    const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
    const profileImageInputRef = useRef<HTMLInputElement>(null);

    
    useEffect(() => {
        setEditedName(currentUser.name);
        setEditedUsername(currentUser.username);
    }, [currentUser]);

    
    const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setProfileImageFile(file);
            setProfileImagePreview(URL.createObjectURL(file));
        }
    };

    
    const handleSaveProfile = () => {
        if (!editedName.trim() || !editedUsername.trim()) {
            toast.error("Name and username cannot be empty", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        
        setCurrentUser({
            ...currentUser,
            name: editedName,
            username: editedUsername,
            
            avatar: profileImagePreview || currentUser.avatar,
        });

        setEditMode(false);
        toast.success("Profile updated successfully!", {
            position: "top-right",
            autoClose: 3000,
        });
    };

    
    const handleCancelEdit = () => {
        setEditMode(false);
        setEditedName(currentUser.name);
        setEditedUsername(currentUser.username);
        setProfileImagePreview(null);
        setProfileImageFile(null);
    };

    
    const handleMessageFriend = (friend: User) => {
        
        let existingChat = chats.find(chat => chat.user.id === friend.id);
        
        if (!existingChat) {
            
            const newChat: Chat = {
                id: Date.now(),
                user: friend,
                messages: [],
                unreadCount: 0
            };
            
            
            setChats([newChat, ...chats]);
            existingChat = newChat;
        }
        
        
        setActiveSection("messages");
        setActiveChat(existingChat);
    };

    return (
        <div className="min-h-screen bg-white">

            <ToastContainer />
            

            <input 
                type="file" 
                ref={imageInputRef} 
                className="hidden" 
                accept="image/*" 
                multiple 
                onChange={handleImageSelect} 
            />
            

            <input 
                type="file" 
                ref={profileImageInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleProfileImageChange}
            />
            

            {suggestionsModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="text-xl font-bold">Suggested People to Follow</h3>
                            <button 
                                onClick={() => setSuggestionsModalOpen(false)}
                                className="text-gray-500 hover:text-black cursor-pointer"
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
            

            {activeStory && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">

                    <button 
                        onClick={closeStory}
                        className="absolute top-6 right-6 z-20 text-white bg-transparent p-2 rounded-full cursor-pointer hover:bg-white hover:bg-opacity-20 transition-all"
                    >
                        <X size={28} />
                    </button>
                    
                    <div className="relative w-full max-w-lg h-screen max-h-[80vh]">

                        <div className="w-full h-full relative overflow-hidden rounded-2xl">

                            <div className="absolute top-4 left-4 right-4 h-1.5 bg-gray-500/50 z-10 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-white transition-all duration-100 ease-linear" 
                                    style={{ width: `${storyProgress}%` }}
                                ></div>
                            </div>
                            

                            <Image 
                                src={activeStory.image} 
                                alt="Story" 
                                fill 
                                className="object-cover"
                                style={{ borderRadius: "16px" }}
                            />
                            

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


                <div className="flex-1 bg-white overflow-y-auto">
                    {activeSection === "newsfeed" ? (
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


                                {selectedImages.length > 0 && (
                                    <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {selectedImages.map((img, idx) => (
                                            <div key={idx} className="relative rounded-lg h-24 overflow-hidden">
                                                <Image src={img} alt="Selected image" fill className="object-cover" />
                                                <button 
                                                    className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer"
                                                    onClick={() => setSelectedImages(selectedImages.filter((_, i) => i !== idx))}
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}


                                {selectedLocation && (
                                    <div className="mt-3 flex items-center bg-white rounded-full px-3 py-2 text-sm">
                                        <MapPin className="text-gray-500 w-4 h-4 mr-2" />
                                        <span className="text-gray-700">{selectedLocation}</span>
                                        <button 
                                            className="ml-auto text-gray-500 cursor-pointer"
                                            onClick={() => setSelectedLocation(null)}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                )}


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
                                                className="bg-gray-800 text-white px-4 rounded-r-lg cursor-pointer"
                                            >
                                                Add
                                            </button>
                                        </form>
                                    </div>
                                )}


                                {isLocationPickerOpen && !selectedLocation && (
                                    <div className="mt-3 bg-white rounded-lg shadow-lg p-3">
                                        <h4 className="text-sm font-semibold mb-2">Popular locations:</h4>
                                        <div className="space-y-2">
                                            {["New York, USA", "London, UK", "Tokyo, Japan", "Sydney, Australia", "Paris, France"].map((location) => (
                                                <button
                                                    key={location}
                                                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-lg flex items-center cursor-pointer"
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
                                                                    className="bg-black text-white px-4 rounded-r-full flex items-center text-sm cursor-pointer"
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
                    ) : activeSection === "messages" ? (
                        <div className="h-full flex">

                            <div className="w-80 border-r border-gray-200 h-full">
                                <div className="p-4 border-b border-gray-200">
                                    <h2 className="text-xl font-bold">Messages</h2>
                                </div>
                                <div className="overflow-y-auto h-[calc(100%-60px)]">
                                    {chats.map((chat) => (
                                        <div 
                                            key={chat.id} 
                                            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${activeChat?.id === chat.id ? 'bg-gray-50' : ''}`}
                                            onClick={() => handleChatSelect(chat)}
                                        >
                                            <div className="flex items-center">
                                                <div className="relative">
                                                    <Image
                                                        src={chat.user.avatar}
                                                        alt={chat.user.name}
                                                        width={48}
                                                        height={48}
                                                        className="rounded-full mr-3"
                                                    />
                                                    {chat.unreadCount > 0 && (
                                                        <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                            {chat.unreadCount}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-baseline">
                                                        <h3 className="font-semibold truncate">{chat.user.name}</h3>
                                                        <span className="text-xs text-gray-500">{chat.messages[chat.messages.length - 1]?.time}</span>
                                                    </div>
                                                    <p className={`text-sm truncate ${chat.unreadCount > 0 ? 'font-semibold text-black' : 'text-gray-500'}`}>
                                                        {chat.messages[chat.messages.length - 1]?.text}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            

                            <div className="flex-1 flex flex-col h-full">
                                {activeChat ? (
                                    <>

                                        <div className="p-4 border-b border-gray-200 flex items-center">
                                            <Image
                                                src={activeChat.user.avatar}
                                                alt={activeChat.user.name}
                                                width={40}
                                                height={40}
                                                className="rounded-full mr-3"
                                            />
                                            <div>
                                                <h3 className="font-semibold">{activeChat.user.name}</h3>
                                                <p className="text-xs text-gray-500">@{activeChat.user.username}</p>
                                            </div>
                                        </div>
                                        

                                        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                                            {activeChat.messages.map((message) => (
                                                <div 
                                                    key={message.id} 
                                                    className={`flex ${message.sender.id === currentUser.id ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    {message.sender.id !== currentUser.id && (
                                                        <Image
                                                            src={message.sender.avatar}
                                                            alt={message.sender.name}
                                                            width={32}
                                                            height={32}
                                                            className="rounded-full mr-2 self-end"
                                                        />
                                                    )}
                                                    <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                                                        message.sender.id === currentUser.id 
                                                            ? 'bg-black text-white rounded-br-none' 
                                                            : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                                    }`}>
                                                        <p className="text-sm">{message.text}</p>
                                                        <span className={`text-xs block mt-1 ${
                                                            message.sender.id === currentUser.id ? 'text-gray-300 text-right' : 'text-gray-500'
                                                        }`}>
                                                            {message.time}
                                                        </span>
                                                    </div>
                                                    {message.sender.id === currentUser.id && (
                                                        <Image
                                                            src={message.sender.avatar}
                                                            alt={message.sender.name}
                                                            width={32}
                                                            height={32}
                                                            className="rounded-full ml-2 self-end"
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        

                                        <div className="p-4 border-t border-gray-200">
                                            <div className="flex items-center">
                                                <button className="text-gray-400 p-2 rounded-full hover:bg-gray-100 cursor-pointer">
                                                    <Paperclip size={20} />
                                                </button>
                                                <input
                                                    type="text"
                                                    className="flex-1 border border-gray-200 rounded-full px-4 py-2 mx-2 focus:outline-none focus:ring-1 focus:ring-black"
                                                    placeholder="Type a message..."
                                                    value={newMessage}
                                                    onChange={(e) => setNewMessage(e.target.value)}
                                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                                />
                                                <button 
                                                    className={`p-2 rounded-full ${newMessage.trim() ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'} cursor-pointer`}
                                                    onClick={handleSendMessage}
                                                    disabled={!newMessage.trim()}
                                                >
                                                    <Send size={20} className={newMessage.trim() ? 'rotate-45' : 'rotate-45 opacity-50'} />
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500">
                                        <div className="text-center">
                                            <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
                                            <p>Select a chat to start messaging</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : activeSection === "friends" ? (
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold" style={{ fontFamily: fonts.heading }}>
                                    Friends
                                </h2>
                                
                                <div className="flex">
                                    <button 
                                        onClick={() => setActiveFriendsFilter("friends")} 
                                        className={`cursor-pointer mr-6 transition-colors duration-200 hover:text-black ${activeFriendsFilter === "friends" 
                                            ? "text-black font-semibold" 
                                            : "text-gray-500"}`}
                                    >
                                        Friends
                                    </button>
                                    <button 
                                        onClick={() => setActiveFriendsFilter("suggestions")} 
                                        className={`cursor-pointer transition-colors duration-200 hover:text-black ${activeFriendsFilter === "suggestions" 
                                            ? "text-black font-semibold" 
                                            : "text-gray-500"}`}
                                    >
                                        Suggestions
                                    </button>
                                </div>
                            </div>

                            {activeFriendsFilter === "friends" ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {friends.map((friend) => (
                                        <div key={friend.id} className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col items-center">
                                            <div className="relative w-20 h-20 mb-3">
                                                <Image
                                                    src={friend.avatar}
                                                    alt={friend.name}
                                                    fill
                                                    className="rounded-full object-cover"
                                                />
                                            </div>
                                            <h3 className="font-bold text-lg" style={{ fontFamily: fonts.heading }}>
                                                {friend.name}
                                            </h3>
                                            <p className="text-gray-500 text-sm mb-4">@{friend.username}</p>
                                            
                                            <div className="mt-auto flex space-x-2 w-full">
                                                <button 
                                                    className="flex-1 bg-black text-white py-2 rounded-lg"
                                                    onClick={() => handleMessageFriend(friend)}
                                                >
                                                    Message
                                                </button>
                                                <button 
                                                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200"
                                                    onClick={() => handleRemoveFriend(friend.id)}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {allSuggestions.map((suggestion) => (
                                            <div key={suggestion.id} className="flex flex-col items-center bg-white rounded-xl border border-gray-200 p-4">
                                                <div className="relative w-20 h-20 mb-3">
                                                    <Image
                                                        src={suggestion.user.avatar}
                                                        alt={suggestion.user.name}
                                                        fill
                                                        className="rounded-full object-cover"
                                                    />
                                                </div>
                                                <h4 className="font-bold text-lg" style={{ fontFamily: fonts.heading }}>
                                                    {suggestion.user.name}
                                                </h4>
                                                <p className="text-gray-500 text-sm">@{suggestion.user.username}</p>
                                                <p className="text-gray-600 text-sm my-2 text-center">
                                                    Suggested based on your interests
                                                </p>
                                                <button 
                                                    onClick={() => handleFollowUser(suggestion.id)}
                                                    className={`px-6 py-2 rounded-full mt-2 ${
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
                            )}
                        </div>
                    ) : (
                        <div className="p-6 max-w-3xl mx-auto">
                            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: fonts.heading }}>
                                Settings
                            </h2>
                            
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                <div className="p-6 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-semibold">Profile Information</h3>
                                        
                                        {!editMode && (
                                            <button 
                                                className="flex items-center text-black bg-gray-100 px-4 py-2 rounded-lg cursor-pointer"
                                                onClick={() => setEditMode(true)}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                                Edit
                                            </button>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="p-6">
                                    {editMode ? (
                                        <div className="space-y-6">
                                            <div className="flex flex-col items-center">
                                                <div 
                                                    className="relative w-32 h-32 mb-3 rounded-full overflow-hidden cursor-pointer border-4 border-gray-200 group"
                                                    onClick={() => profileImageInputRef.current?.click()}
                                                >
                                                    <Image
                                                        src={profileImagePreview || currentUser.avatar}
                                                        alt={currentUser.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-500">Click to change profile photo</p>
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Name
                                                </label>
                                                <input
                                                    type="text"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                                    value={editedName}
                                                    onChange={(e) => setEditedName(e.target.value)}
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Username
                                                </label>
                                                <div className="flex">
                                                    <span className="inline-flex items-center px-3 bg-gray-100 text-gray-500 border border-r-0 border-gray-300 rounded-l-lg">
                                                        @
                                                    </span>
                                                    <input
                                                        type="text"
                                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-black"
                                                        value={editedUsername}
                                                        onChange={(e) => setEditedUsername(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Bio
                                                </label>
                                                <textarea
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                                    rows={4}
                                                    value={editedBio}
                                                    onChange={(e) => setEditedBio(e.target.value)}
                                                />
                                            </div>
                                            
                                            <div className="flex space-x-4">
                                                <button
                                                    className="bg-black text-white px-6 py-2 rounded-lg cursor-pointer"
                                                    onClick={handleSaveProfile}
                                                >
                                                    Save Changes
                                                </button>
                                                <button
                                                    className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg cursor-pointer"
                                                    onClick={handleCancelEdit}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="flex items-center">
                                                <div className="relative w-24 h-24 mr-4">
                                                    <Image
                                                        src={currentUser.avatar}
                                                        alt={currentUser.name}
                                                        fill
                                                        className="rounded-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold" style={{ fontFamily: fonts.heading }}>
                                                        {currentUser.name}
                                                    </h3>
                                                    <p className="text-gray-500">@{currentUser.username}</p>
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500 mb-1">Bio</h4>
                                                <p>{editedBio}</p>
                                            </div>
                                            
                                            <div className="pt-4 border-t border-gray-200">
                                                <h4 className="text-lg font-semibold mb-4">Account Information</h4>
                                                
                                                <div className="space-y-4">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Email</span>
                                                        <span className="font-medium">{currentUser.username}@example.com</span>
                                                    </div>
                                                    
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Account Created</span>
                                                        <span className="font-medium">January 15, 2023</span>
                                                    </div>
                                                    
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Last Login</span>
                                                        <span className="font-medium">Today</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="mt-6 bg-white rounded-xl border border-gray-200 overflow-hidden">
                                <div className="p-6 border-b border-gray-200">
                                    <h3 className="text-xl font-semibold">Privacy & Security</h3>
                                </div>
                                
                                <div className="p-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium">Private Account</h4>
                                            <p className="text-sm text-gray-500">When enabled, only approved followers can see your posts</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                                        </label>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium">Two-Factor Authentication</h4>
                                            <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                                        </label>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium">Activity Status</h4>
                                            <p className="text-sm text-gray-500">Let friends know when you're active</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" defaultChecked className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>


                {activeSection === "newsfeed" && (
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
                                        <span className="z-10 text-black font-medium truncate">{rec.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
