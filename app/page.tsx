"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
    Search,
    Settings,
    MapPin,
    Image as ImageIcon,
    Heart,
    MessageSquare,
    Eye,
    Home as HomeIcon,
    Users,
    X,
    Send,
    Paperclip,
    CheckCircle,
    Menu,
    Bell,
} from "lucide-react";
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
    prompt?: string;
    model?: string;
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

type MobileMenuProps = {
    currentUser: {
        name: string;
        username: string;
        avatar: string;
    };
    activeSection: string;
    onSectionChange: (section: string) => void;
};

function isGithubAvatarUrl(url: string): boolean {
    return url.includes("avatars.githubusercontent.com");
}

function stabilizeAvatarUrl(url: string): string {
    if (isGithubAvatarUrl(url)) {
        const match = url.match(/\/u\/(\d+)/);
        if (match) {
            return `https://avatars.githubusercontent.com/u/${match[1]}?v=4`;
        }
    }
    return url;
}

function AvatarImage({
    src,
    alt,
    width,
    height,
    className,
    style,
    fill,
}: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    style?: React.CSSProperties;
    fill?: boolean;
}) {
    const stableUrl = stabilizeAvatarUrl(src);

    if (isGithubAvatarUrl(stableUrl)) {
        return (
            <img
                src={stableUrl}
                alt={alt}
                width={width}
                height={height}
                className={`${className || ""} ${fill ? "object-cover w-full h-full" : ""}`}
                style={{
                    ...(width && !fill ? { width: `${width}px` } : {}),
                    ...(height && !fill ? { height: `${height}px` } : {}),
                    ...style,
                }}
            />
        );
    }

    if (fill) {
        return <Image src={stableUrl} alt={alt} fill className={className || ""} style={style} />;
    }

    return <Image src={stableUrl} alt={alt} width={width!} height={height!} className={className || ""} style={style} />;
}

const fonts = {
    heading: "system-ui",
    body: "system-ui",
};

const animations = {
    fadeIn: "animate-fadeIn",
    slideUp: "animate-slideUp",
    pulse: "animate-pulse",
    bounce: "animate-bounce",
    spin: "animate-spin",
    scale: "transition-transform duration-200 hover:scale-105",
};

const SidebarItem = ({
    icon,
    label,
    count,
    isActive,
    onClick,
}: {
    icon: React.ReactNode;
    label: string;
    count?: number;
    isActive?: boolean;
    onClick?: () => void;
}) => (
    <li className="transform transition-transform duration-200 hover:translate-x-1">
        <a
            href="#"
            onClick={(e) => {
                e.preventDefault();
                if (onClick) onClick();
            }}
            className={`flex items-center p-4 rounded-lg mb-2 cursor-pointer transition-all duration-200 ${
                isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
        >
            <div className={`w-6 h-6 mr-3 flex items-center justify-center transition-transform ${isActive ? "scale-110" : ""}`}>
                {icon}
            </div>
            {label}
            {count && (
                <span
                    className={`ml-auto ${
                        isActive ? "bg-white text-black" : "bg-gray-900 text-white"
                    } text-xs rounded-full w-5 h-5 flex items-center justify-center transition-colors duration-200`}
                >
                    {count}
                </span>
            )}
        </a>
    </li>
);

function MobileMenu({ currentUser, activeSection, onSectionChange }: MobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (isOpen && !target.closest(".mobile-menu-content") && !target.closest(".mobile-menu-trigger")) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    const handleSectionChange = (section: string) => {
        onSectionChange(section);
        setIsOpen(false);
    };

    return (
        <>
            <button
                className="md:hidden mobile-menu-trigger flex items-center justify-center w-10 h-10 text-gray-600 cursor-pointer"
                onClick={() => setIsOpen(true)}
            >
                <Menu size={24} />
            </button>
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40">
                    <div className="mobile-menu-content fixed inset-y-0 left-0 max-w-[280px] w-full bg-white shadow-lg transform transition-transform duration-300 z-50">
                        <div className="flex items-center justify-between p-4 border-b">
                            <div className="flex items-center">
                                <div className="relative w-10 h-10 mr-3">
                                    <div className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 via-pink-400 to-orange-300"></div>
                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-teal-400"></div>
                                    <AvatarImage
                                        src={currentUser.avatar}
                                        alt={currentUser.name}
                                        width={40}
                                        height={40}
                                        className="rounded-full border-2 border-white z-10 relative"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">{currentUser.name}</h3>
                                    <p className="text-gray-500 text-xs">@{currentUser.username}</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700 cursor-pointer">
                                <X size={20} />
                            </button>
                        </div>
                        <nav className="p-4">
                            <ul className="space-y-2">
                                <li>
                                    <button
                                        onClick={() => handleSectionChange("newsfeed")}
                                        className={`flex items-center w-full p-3 rounded-lg cursor-pointer ${
                                            activeSection === "newsfeed" ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                    >
                                        <HomeIcon
                                            className={`w-5 h-5 mr-3 ${activeSection === "newsfeed" ? "text-white" : "text-gray-700"}`}
                                        />
                                        News Feed
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => handleSectionChange("messages")}
                                        className={`flex items-center w-full p-3 rounded-lg cursor-pointer ${
                                            activeSection === "messages" ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                    >
                                        <MessageSquare
                                            className={`w-5 h-5 mr-3 ${activeSection === "messages" ? "text-white" : "text-gray-700"}`}
                                        />
                                        Messages
                                        <span className="ml-auto bg-gray-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            6
                                        </span>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => handleSectionChange("friends")}
                                        className={`flex items-center w-full p-3 rounded-lg cursor-pointer ${
                                            activeSection === "friends" ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                    >
                                        <Users className={`w-5 h-5 mr-3 ${activeSection === "friends" ? "text-white" : "text-gray-700"}`} />
                                        Friends
                                        <span className="ml-auto bg-gray-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            3
                                        </span>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => handleSectionChange("notifications")}
                                        className={`flex items-center w-full p-3 rounded-lg cursor-pointer ${
                                            activeSection === "notifications" ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                    >
                                        <Bell
                                            className={`w-5 h-5 mr-3 ${activeSection === "notifications" ? "text-white" : "text-gray-700"}`}
                                        />
                                        Notifications
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => handleSectionChange("settings")}
                                        className={`flex items-center w-full p-3 rounded-lg cursor-pointer ${
                                            activeSection === "settings" ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                    >
                                        <Settings
                                            className={`w-5 h-5 mr-3 ${activeSection === "settings" ? "text-white" : "text-gray-700"}`}
                                        />
                                        Settings
                                    </button>
                                </li>
                            </ul>
                        </nav>
                        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
                            <button className="w-full py-2 bg-black text-white rounded-lg cursor-pointer">Sign Out</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

const PostCard = ({
    post,
    currentUser,
    likedPosts,
    activeCommentInput,
    openDropdownId,
    onLikeToggle,
    onCommentToggle,
    onDropdownToggle,
    onCommentSubmit,
    onSavePost,
    onHidePost,
    onReportPost,
    commentText,
    setCommentText,
}: {
    post: Post & { comments?: { user: User; text: string; timeAgo: string }[] };
    currentUser: User;
    likedPosts: number[];
    activeCommentInput: number | null;
    openDropdownId: number | null;
    onLikeToggle: (id: number) => void;
    onCommentToggle: (id: number) => void;
    onDropdownToggle: (id: number) => void;
    onCommentSubmit: (id: number) => void;
    onSavePost: (id: number) => void;
    onHidePost: (id: number) => void;
    onReportPost: (id: number) => void;
    commentText: string;
    setCommentText: (text: string) => void;
}) => {
    return (
        <div
            className={`rounded-xl overflow-hidden ${animations.fadeIn} ${
                post.id % 4 === 0
                    ? "bg-[#ffe8d9]"
                    : post.id % 3 === 0
                    ? "bg-[#daffee]"
                    : post.id % 2 === 0
                    ? "bg-[#fff5df]"
                    : "bg-[#dfebff]"
            }`}
        >
            <div className="p-3 sm:p-4">
                <div className="flex justify-between mb-4">
                    <div className="flex">
                        <AvatarImage
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
                        <button className="text-gray-400 cursor-pointer" onClick={() => onDropdownToggle(post.id)}>
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
                                    onClick={() => onSavePost(post.id)}
                                >
                                    Save post
                                </button>
                                <button
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => onHidePost(post.id)}
                                >
                                    Hide post
                                </button>
                                <button
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => onReportPost(post.id)}
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

                    {post.prompt && (
                        <div className="mt-2 p-3 bg-black/5 rounded-lg">
                            <p className="text-xs sm:text-sm font-medium mb-1">Prompt:</p>
                            <p className="text-xs sm:text-sm text-gray-700">{post.prompt}</p>
                            {post.model && (
                                <div className="mt-1 flex items-center">
                                    <span className="text-xs text-gray-500">Model: {post.model}</span>
                                </div>
                            )}
                        </div>
                    )}
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
                                <AvatarImage src={img} alt="Post image" fill className="object-cover" />
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
                        className={`flex items-center mr-3 sm:mr-6 cursor-pointer ${likedPosts.includes(post.id) ? "text-red-500" : ""}`}
                        onClick={() => onLikeToggle(post.id)}
                    >
                        <Heart className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 ${likedPosts.includes(post.id) ? "fill-current" : ""}`} />
                        <span>Like</span>
                    </button>

                    <button
                        className={`flex items-center cursor-pointer ${activeCommentInput === post.id ? "text-blue-500" : ""}`}
                        onClick={() => onCommentToggle(post.id)}
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
                                    <AvatarImage
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
                        <AvatarImage
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
                                onKeyPress={(e) => e.key === "Enter" && onCommentSubmit(post.id)}
                            />
                            <button
                                className="bg-black text-white px-4 rounded-r-full flex items-center text-sm cursor-pointer"
                                onClick={() => onCommentSubmit(post.id)}
                            >
                                Post
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const UserAvatar = ({ user, size = "md", showStatus = false }: { user: User; size?: "sm" | "md" | "lg"; showStatus?: boolean }) => {
    const sizes = {
        sm: { width: 32, height: 32, className: "w-8 h-8" },
        md: { width: 40, height: 40, className: "w-10 h-10" },
        lg: { width: 48, height: 48, className: "w-12 h-12" },
    };

    const { width, height, className } = sizes[size];

    return (
        <div className="relative group">
            {showStatus && (
                <>
                    <div className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 via-pink-400 to-orange-300 group-hover:animate-spin group-hover:scale-110 transition-all duration-500"></div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-teal-400 group-hover:animate-pulse group-hover:scale-125 transition-all duration-500"></div>
                </>
            )}
            <div className="relative overflow-hidden rounded-full transition-transform duration-300 group-hover:scale-105">
                <AvatarImage
                    src={user.avatar}
                    alt={user.name}
                    width={width}
                    height={height}
                    className={`rounded-full ${className} ${showStatus ? "border-2 border-white z-10 relative" : ""}`}
                />
                {showStatus && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-400/20 to-teal-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                )}
            </div>
        </div>
    );
};

const generateRandomUsers = (startId: number, count: number): Suggestion[] => {
    const suggestions: Suggestion[] = [];

    const firstNames = ["Alex", "Jamie", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Charlie", "Avery", "Quinn"];
    const lastNames = ["Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor"];

    for (let i = 0; i < count; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const randomUserId = Math.floor(Math.random() * 1000000);

        suggestions.push({
            id: startId + i,
            user: {
                id: startId + i + 10,
                name: `${firstName} ${lastName}`,
                username: `${firstName.toLowerCase()}${lastName.toLowerCase()}`,
                avatar: `https://avatars.githubusercontent.com/u/${randomUserId}?v=4`,
            },
            followed: false,
        });
    }

    return suggestions;
};

const SuggestionCard = ({ suggestion, onFollowUser }: { suggestion: Suggestion; onFollowUser: (id: number) => void }) => {
    return (
        <div className={`flex items-center justify-between p-3 border rounded-lg hover:shadow-sm transition-all duration-300 ${animations.fadeIn} hover:translate-y-[-2px]`}>
            <div className="flex items-center">
                <UserAvatar user={suggestion.user} size="md" />
                <div className="ml-3">
                    <h4 className="font-medium" style={{ fontFamily: fonts.heading }}>
                        {suggestion.user.name}
                    </h4>
                    <p className="text-gray-500 text-sm">@{suggestion.user.username}</p>
                </div>
            </div>
            <button
                onClick={() => onFollowUser(suggestion.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer ${
                    suggestion.followed 
                        ? "bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-700" 
                        : "bg-black text-white hover:bg-gray-800 hover:shadow-lg"
                }`}
            >
                {suggestion.followed ? (
                    <span className="flex items-center">
                        <CheckCircle size={16} className="mr-1" />
                        Followed
                    </span>
                ) : (
                    "Follow"
                )}
            </button>
        </div>
    );
};

const FriendCard = ({
    friend,
    onRemoveFriend,
    onMessageFriend,
}: {
    friend: User;
    onRemoveFriend: (id: number) => void;
    onMessageFriend: (friend: User) => void;
}) => {
    return (
        <div
            className={`bg-white rounded-xl border border-gray-200 p-4 flex flex-col items-center transition-all duration-300 ${animations.fadeIn} hover:shadow-md hover:border-gray-300`}
        >
            <UserAvatar user={friend} size="lg" />
            <h3 className="font-semibold mt-3 mb-1">{friend.name}</h3>
            <p className="text-gray-500 text-sm mb-4">@{friend.username}</p>
            <div className="flex space-x-2 w-full">
                <button
                    className="flex-1 bg-black text-white py-2 rounded-lg text-sm cursor-pointer transition-all duration-200 transform active:scale-95 hover:bg-gray-800"
                    onClick={() => onMessageFriend(friend)}
                >
                    Message
                </button>
                <button
                    className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm cursor-pointer"
                    onClick={() => onRemoveFriend(friend.id)}
                >
                    Remove
                </button>
            </div>
        </div>
    );
};

const SidebarSuggestionCard = ({ suggestion, onFollowUser }: { suggestion: Suggestion; onFollowUser: (id: number) => void }) => {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center">
                <UserAvatar user={suggestion.user} size="md" />
                <div className="max-w-[120px] ml-3">
                    <h4 className="font-medium truncate" style={{ fontFamily: fonts.heading }}>
                        {suggestion.user.name}
                    </h4>
                    <p className="text-gray-500 text-sm truncate">@{suggestion.user.username}</p>
                </div>
            </div>
            <button
                onClick={() => onFollowUser(suggestion.id)}
                className={`px-3 py-1 text-xs rounded-full cursor-pointer transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                    suggestion.followed 
                        ? "bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-700" 
                        : "bg-black text-white hover:bg-gray-800 hover:shadow-lg"
                }`}
            >
                {suggestion.followed ? "Followed" : "Follow"}
            </button>
        </div>
    );
};

export default function Home() {
    const [currentUser, setCurrentUser] = useState<User>({
        id: 1,
        name: "Bogdan Nikitin",
        username: "nikitinteam",
        avatar: "https://avatars.githubusercontent.com/u/59017652?v=4",
    });

    const [activeSection, setActiveSection] = useState("newsfeed");

    const [activeFeedFilter, setActiveFeedFilter] = useState("friends");

    const [activeFriendsFilter, setActiveFriendsFilter] = useState("friends");

    const [likedPosts, setLikedPosts] = useState<number[]>([]);
    const [activeCommentInput, setActiveCommentInput] = useState<number | null>(null);
    const [commentText, setCommentText] = useState("");
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

    const [postText, setPostText] = useState("");
    const [promptText, setPromptText] = useState("");
    const [selectedModel, setSelectedModel] = useState("midjourney");
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
    const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const [showPromptInput, setShowPromptInput] = useState(false);

    const [friendsPosts, setFriendsPosts] = useState<(Post & { comments?: { user: User; text: string; timeAgo: string }[] })[]>([
        {
            id: 1,
            user: {
                id: 2,
                name: "George Lobko",
                username: "georgelobko",
                avatar: "https://avatars.githubusercontent.com/u/383979?v=4",
            },
            content: "Created this surreal cityscape with towering crystal structures and floating islands.",
            prompt: "A futuristic cityscape with crystal spires and floating islands, 8k, hyperrealistic, cinematic lighting",
            model: "Midjourney v6",
            images: ["https://picsum.photos/id/29/600/400", "https://picsum.photos/id/30/600/400"],
            likes: 6355,
            timeAgo: "2 hours ago",
            mentions: [
                { name: "Silena", username: "silena" },
                { name: "Olya", username: "olya" },
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
                        avatar: "https://avatars.githubusercontent.com/u/1410106?v=4",
                    },
                    text: "Stunning! What settings did you use for the lighting?",
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
                avatar: "https://avatars.githubusercontent.com/u/1410106?v=4",
            },
            content: "My latest portrait series exploring emotional depth through AI. Tried a new technique with detailed prompting.",
            prompt: "Portrait of a weathered explorer with deep emotional eyes, detailed skin texture, cinematic lighting, 8k, photorealistic",
            model: "DALL-E 3",
            images: ["https://picsum.photos/id/65/600/400"],
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
                avatar: "https://avatars.githubusercontent.com/u/6270131?v=4",
            },
            content: "My latest experiment with surreal landscapes and glowing creatures.",
            prompt: "Bioluminescent creatures in a surreal alien landscape, fantastical, 8k, cinematic lighting, hyper-detailed",
            model: "Stable Diffusion XL",
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
                avatar: "https://avatars.githubusercontent.com/u/18194757?v=4",
            },
            content: "Just finished this cyberpunk cityscape series. The neon lighting was particularly challenging to get right.",
            prompt: "Cyberpunk cityscape at night, neon lights reflecting on wet streets, dense urban environment, flying cars, 8k, detailed, cinematic",
            model: "DALL-E 3",
            images: ["https://picsum.photos/id/24/600/400"],
            likes: 87,
            timeAgo: "Just now",
            comments: [
                {
                    user: {
                        id: 13,
                        name: "James Peterson",
                        username: "jamesp",
                        avatar: "https://avatars.githubusercontent.com/u/16659427?v=4",
                    },
                    text: "The reflections on the wet pavement are incredible! What resolution did you generate at?",
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
                avatar: "https://avatars.githubusercontent.com/u/3765077?v=4",
            },
            content: "My new fantasy character series. This warrior was generated after 20+ iterations to get the right composition.",
            prompt: "Epic fantasy warrior with glowing magical armor, battle-worn, standing on mountain peak at sunset, ultra-detailed, photorealistic, dramatic lighting",
            model: "Midjourney v6",
            images: ["https://picsum.photos/id/26/600/400", "https://picsum.photos/id/27/600/400"],
            likes: 8947,
            timeAgo: "2 days ago",
            comments: [
                {
                    user: {
                        id: 15,
                        name: "Roberto Carlos",
                        username: "roberto11",
                        avatar: "https://avatars.githubusercontent.com/u/9335367?v=4",
                    },
                    text: "Incredible detail on the armor! 🔥",
                    timeAgo: "1 day ago",
                },
                {
                    user: {
                        id: 16,
                        name: "Luna Smith",
                        username: "lunasmith",
                        avatar: "https://avatars.githubusercontent.com/u/5041065?v=4",
                    },
                    text: "Would you mind sharing your negative prompts too? I've been struggling with armor textures.",
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
                avatar: "https://avatars.githubusercontent.com/u/7489775?v=4",
            },
            content: "My entry for the #AIForGood challenge - visualizing sustainable future cities using generative AI.",
            prompt: "Sustainable futuristic city with vertical gardens, solar panels, flying electric vehicles, people cycling, clean energy infrastructure, utopian, photorealistic, 8k",
            model: "Leonardo AI",
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
                avatar: "https://avatars.githubusercontent.com/u/3765077?v=4",
            },
            image: "https://picsum.photos/id/24/400/500",
        },
        {
            id: 2,
            user: {
                id: 5,
                name: "Lolita Earns",
                username: "lolitaearns",
                avatar: "https://avatars.githubusercontent.com/u/9335367?v=4",
            },
            image: "https://picsum.photos/id/25/400/500",
        },
        {
            id: 3,
            user: {
                id: 8,
                name: "Marcus Chen",
                username: "marcuschen",
                avatar: "https://avatars.githubusercontent.com/u/5041065?v=4",
            },
            image: "https://picsum.photos/id/28/400/500",
        },
        {
            id: 4,
            user: {
                id: 10,
                name: "Samira Ahmed",
                username: "samira_art",
                avatar: "https://avatars.githubusercontent.com/u/7489775?v=4",
            },
            image: "https://picsum.photos/id/29/400/500",
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
                avatar: "https://avatars.githubusercontent.com/u/16659427?v=4",
            },
            followed: false,
        },
        {
            id: 2,
            user: {
                id: 7,
                name: "Brittni Lando",
                username: "brittnilando",
                avatar: "https://avatars.githubusercontent.com/u/6655696?v=4",
            },
            followed: false,
        },
        {
            id: 3,
            user: {
                id: 8,
                name: "Ivan Shevchenko",
                username: "ivanshevchenko",
                avatar: "https://avatars.githubusercontent.com/u/8460711?v=4",
            },
            followed: false,
        },
    ]);

    const [recommendations, setRecommendations] = useState<Recommendation[]>([
        {
            id: 1,
            title: "AI Art",
            icon: "https://picsum.photos/id/20/200/200",
        },
        {
            id: 2,
            title: "Prompting",
            icon: "https://picsum.photos/id/21/200/200",
        },
        {
            id: 3,
            title: "Digital Art",
            icon: "https://picsum.photos/id/22/200/200",
        },
        {
            id: 4,
            title: "Illustration",
            icon: "https://picsum.photos/id/23/200/200",
        },
    ]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const moreSuggestions = [...suggestions, ...generateRandomUsers(4, 20)];
            setAllSuggestions(moreSuggestions);
        }
    }, [suggestions]);

    const handleFollowUser = (id: number) => {
        setSuggestions(
            suggestions.map((suggestion) => (suggestion.id === id ? { ...suggestion, followed: !suggestion.followed } : suggestion))
        );

        setAllSuggestions(
            allSuggestions.map((suggestion) => (suggestion.id === id ? { ...suggestion, followed: !suggestion.followed } : suggestion))
        );

        const suggestion = suggestions.find((s) => s.id === id) || allSuggestions.find((s) => s.id === id);
        if (suggestion) {
            const isNowFollowed = !suggestion.followed;
            toast.success(isNowFollowed ? `You are now following ${suggestion.user.name}` : `You unfollowed ${suggestion.user.name}`, {
                position: "top-right",
                autoClose: 3000,
            });
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
                setStoryProgress((prev) => {
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
            setLikedPosts(likedPosts.filter((id) => id !== postId));
            setPosts(posts.map((post) => (post.id === postId ? { ...post, likes: post.likes - 1 } : post)));
        } else {
            setLikedPosts([...likedPosts, postId]);
            setPosts(posts.map((post) => (post.id === postId ? { ...post, likes: post.likes + 1 } : post)));
        }
    };

    const handleCommentToggle = (postId: number) => {
        setActiveCommentInput(activeCommentInput === postId ? null : postId);
        setCommentText("");
    };

    const handleCommentSubmit = (postId: number) => {
        if (commentText.trim()) {
            const updatedPosts = posts.map((post) =>
                post.id === postId
                    ? {
                          ...post,
                          comments: [
                              ...(post.comments || []),
                              {
                                  user: currentUser,
                                  text: commentText,
                                  timeAgo: "Just now",
                              },
                          ],
                      }
                    : post
            );

            if (activeFeedFilter === "recents") {
                setRecentsPosts(updatedPosts.filter((post) => recentsPosts.some((p) => p.id === post.id)));
            } else if (activeFeedFilter === "friends") {
                setFriendsPosts(updatedPosts.filter((post) => friendsPosts.some((p) => p.id === post.id)));
            } else if (activeFeedFilter === "popular") {
                setPopularPosts(updatedPosts.filter((post) => popularPosts.some((p) => p.id === post.id)));
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
        setPosts(posts.filter((post) => post.id !== postId));
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
            const newImages = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
            setSelectedImages([...selectedImages, ...newImages]);
            toast.success(`${newImages.length} image${newImages.length > 1 ? "s" : ""} selected!`, {
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
            content: postText,
            prompt: promptText || undefined,
            model: selectedModel || undefined,
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
        setPromptText("");
        clearSelectedItems();
        toast.success("AI artwork shared successfully!", {
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
                avatar: "https://avatars.githubusercontent.com/u/2198736?v=4",
            },
            messages: [
                {
                    id: 1,
                    sender: {
                        id: 101,
                        name: "Emily Johnson",
                        username: "emilyjohnson",
                        avatar: "https://avatars.githubusercontent.com/u/2198736?v=4",
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
                        avatar: "https://avatars.githubusercontent.com/u/2198736?v=4",
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
                        avatar: "https://avatars.githubusercontent.com/u/2198736?v=4",
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
                avatar: "https://avatars.githubusercontent.com/u/6712348?v=4",
            },
            messages: [
                {
                    id: 1,
                    sender: {
                        id: 102,
                        name: "Michael Torres",
                        username: "michael_t",
                        avatar: "https://avatars.githubusercontent.com/u/6712348?v=4",
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
                        avatar: "https://avatars.githubusercontent.com/u/6712348?v=4",
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
                avatar: "https://avatars.githubusercontent.com/u/3198726?v=4",
            },
            messages: [
                {
                    id: 1,
                    sender: {
                        id: 103,
                        name: "Sarah Miller",
                        username: "sarahm",
                        avatar: "https://avatars.githubusercontent.com/u/3198726?v=4",
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
                avatar: "https://avatars.githubusercontent.com/u/8126734?v=4",
            },
            messages: [
                {
                    id: 1,
                    sender: currentUser,
                    receiver: {
                        id: 104,
                        name: "David Lee",
                        username: "davidlee",
                        avatar: "https://avatars.githubusercontent.com/u/8126734?v=4",
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
                        avatar: "https://avatars.githubusercontent.com/u/8126734?v=4",
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
                        avatar: "https://avatars.githubusercontent.com/u/8126734?v=4",
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
                avatar: "https://avatars.githubusercontent.com/u/1976342?v=4",
            },
            messages: [
                {
                    id: 1,
                    sender: {
                        id: 105,
                        name: "Jessica Wang",
                        username: "jwang",
                        avatar: "https://avatars.githubusercontent.com/u/1976342?v=4",
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
                        avatar: "https://avatars.githubusercontent.com/u/1976342?v=4",
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

        const updatedChats = chats.map((chat) =>
            chat.id === activeChat.id
                ? {
                      ...chat,
                      messages: [...chat.messages, newMessageObj],
                      lastMessage: newMessageObj,
                  }
                : chat
        );

        setChats(updatedChats);
        setActiveChat(updatedChats.find((chat) => chat.id === activeChat.id) || null);
        setNewMessage("");
    };

    const handleChatSelect = (chat: Chat) => {
        if (chat.id === activeChat?.id) return;

        const updatedChats = chats.map((c) =>
            c.id === chat.id
                ? {
                      ...c,
                      messages: c.messages.map((msg) => ({
                          ...msg,
                          isRead: true,
                      })),
                      unreadCount: 0,
                  }
                : c
        );

        setChats(updatedChats);
        setActiveChat(updatedChats.find((c) => c.id === chat.id) || null);
    };

    const [friends, setFriends] = useState<User[]>([
        {
            id: 201,
            name: "James Wilson",
            username: "jwilson",
            avatar: "https://avatars.githubusercontent.com/u/337642?v=4",
        },
        {
            id: 202,
            name: "Anna Petrova",
            username: "annapetrova",
            avatar: "https://avatars.githubusercontent.com/u/348752?v=4",
        },
        {
            id: 203,
            name: "Richard Lee",
            username: "richardlee",
            avatar: "https://avatars.githubusercontent.com/u/356428?v=4",
        },
        {
            id: 204,
            name: "Sophia Chen",
            username: "sophiachen",
            avatar: "https://avatars.githubusercontent.com/u/367542?v=4",
        },
        {
            id: 205,
            name: "Carlos Rodriguez",
            username: "crodriguez",
            avatar: "https://avatars.githubusercontent.com/u/379865?v=4",
        },
        {
            id: 206,
            name: "Emma Johnson",
            username: "emmaj",
            avatar: "https://avatars.githubusercontent.com/u/386427?v=4",
        },
        {
            id: 207,
            name: "Alex Tanner",
            username: "alextanner",
            avatar: "https://avatars.githubusercontent.com/u/395476?v=4",
        },
        {
            id: 208,
            name: "Lily Zhang",
            username: "lilyzhang",
            avatar: "https://avatars.githubusercontent.com/u/407652?v=4",
        },
    ]);

    const handleRemoveFriend = (friendId: number) => {
        setFriends(friends.filter((friend) => friend.id !== friendId));
        toast.success("Friend removed successfully", {
            position: "top-right",
            autoClose: 3000,
        });
    };

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
        let existingChat = chats.find((chat) => chat.user.id === friend.id);

        if (!existingChat) {
            const newChat: Chat = {
                id: Date.now(),
                user: friend,
                messages: [],
                unreadCount: 0,
            };

            setChats([newChat, ...chats]);
            existingChat = newChat;
        }

        setActiveSection("messages");
        setActiveChat(existingChat);
    };

    const handleTogglePromptInput = () => {
        setShowPromptInput(!showPromptInput);
    };

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDeleteAccount = () => {
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
    };

    return (
        <div className="min-h-screen bg-white">
            <ToastContainer />

            <input type="file" ref={imageInputRef} className="hidden" accept="image/*" multiple onChange={handleImageSelect} />

            <input type="file" ref={profileImageInputRef} className="hidden" accept="image/*" onChange={handleProfileImageChange} />

            {suggestionsModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-5 border-b flex justify-between items-center">
                            <h3 className="text-xl font-bold">Recommended AI Artists to Follow</h3>
                            <button
                                onClick={() => setSuggestionsModalOpen(false)}
                                className="text-gray-500 hover:text-black cursor-pointer"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-5 overflow-y-auto flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {allSuggestions.map((suggestion) => (
                                    <SuggestionCard key={suggestion.id} suggestion={suggestion} onFollowUser={handleFollowUser} />
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

                            <AvatarImage
                                src={activeStory.image}
                                alt="Story"
                                fill
                                className="object-cover"
                                style={{ borderRadius: "16px" }}
                            />

                            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-full py-2 px-4 flex items-center shadow-md z-10 w-auto max-w-[90%]">
                                <AvatarImage
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
                    <h1 className="text-xl font-bold">AIrtistry</h1>
                    <span className="ml-1 text-xs bg-gradient-to-r from-purple-500 via-pink-400 to-teal-400 text-transparent bg-clip-text font-semibold">
                        AI Art Platform
                    </span>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="w-10 h-10 flex items-center justify-center text-gray-600 cursor-pointer">
                        <Search size={20} />
                    </button>
                    <MobileMenu currentUser={currentUser} activeSection={activeSection} onSectionChange={setActiveSection} />
                </div>
            </div>

            <div className="flex h-[calc(100vh-60px)] md:h-screen">
                <div className="hidden md:flex w-64 bg-white p-6 flex-col">
                    <div className="flex items-center mb-10" onClick={() => setActiveSection("settings")}>
                        <UserAvatar user={currentUser} size="lg" showStatus={true} />
                        <div>
                            <button className="group transition-all duration-300 cursor-pointer">
                                <h3 className="font-bold relative inline-block" style={{ fontFamily: fonts.heading }}>
                                    {currentUser.name}
                                    <span className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-400 to-orange-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-clip-text text-transparent pointer-events-none">
                                        {currentUser.name}
                                    </span>
                                </h3>
                                <p className="text-gray-500 text-sm">@{currentUser.username}</p>
                            </button>
                        </div>
                    </div>

                    <nav className="flex-1">
                        <ul className="space-y-3">
                            <SidebarItem
                                icon={
                                    activeSection === "newsfeed" ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="w-4 h-4"
                                        >
                                            <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                                            <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                                        </svg>
                                    ) : (
                                        <HomeIcon className="w-4 h-4" />
                                    )
                                }
                                label="News Feed"
                                isActive={activeSection === "newsfeed"}
                                onClick={() => setActiveSection("newsfeed")}
                            />
                            <SidebarItem
                                icon={
                                    activeSection === "messages" ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="w-4 h-4"
                                        >
                                            <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
                                            <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
                                        </svg>
                                    ) : (
                                        <MessageSquare className="w-4 h-4" />
                                    )
                                }
                                label="Messages"
                                count={6}
                                isActive={activeSection === "messages"}
                                onClick={() => setActiveSection("messages")}
                            />
                            <SidebarItem
                                icon={
                                    activeSection === "friends" ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="w-4 h-4"
                                        >
                                            <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                                        </svg>
                                    ) : (
                                        <Users className="w-4 h-4" />
                                    )
                                }
                                label="Friends"
                                count={3}
                                isActive={activeSection === "friends"}
                                onClick={() => setActiveSection("friends")}
                            />
                            <SidebarItem
                                icon={
                                    activeSection === "settings" ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="w-4 h-4"
                                        >
                                            <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <Settings className="w-4 h-4" />
                                    )
                                }
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
                                    Feed
                                </h2>

                                <div className="flex">
                                    <button
                                        onClick={() => setActiveFeedFilter("recents")}
                                        className={`cursor-pointer mr-6 transition-all duration-200 relative ${
                                            activeFeedFilter === "recents"
                                                ? "text-black font-semibold"
                                                : "text-gray-500 hover:text-gray-800"
                                        }`}
                                    >
                                        Recent
                                        {activeFeedFilter === "recents" && (
                                            <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-black rounded-full animate-fadeIn"></span>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setActiveFeedFilter("friends")}
                                        className={`cursor-pointer mr-6 transition-all duration-200 relative ${
                                            activeFeedFilter === "friends"
                                                ? "text-black font-semibold"
                                                : "text-gray-500 hover:text-gray-800"
                                        }`}
                                    >
                                        Artists I Follow
                                        {activeFeedFilter === "friends" && (
                                            <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-black rounded-full animate-fadeIn"></span>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setActiveFeedFilter("popular")}
                                        className={`cursor-pointer transition-all duration-200 relative ${
                                            activeFeedFilter === "popular"
                                                ? "text-black font-semibold"
                                                : "text-gray-500 hover:text-gray-800"
                                        }`}
                                    >
                                        Trending
                                        {activeFeedFilter === "popular" && (
                                            <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-black rounded-full animate-fadeIn"></span>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className={`bg-[#f4f1f2] rounded-xl p-4 mb-6 ${animations.fadeIn}`}>
                                <div className="relative flex items-center">
                                    <div className="absolute left-0 z-10">
                                        <UserAvatar user={currentUser} size="sm" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Share your AI artwork..."
                                        className="flex-1 bg-white rounded-full py-2 pl-16 pr-12 text-gray-700 focus:outline-none focus:ring-1 focus:ring-black transition-all duration-200"
                                        value={postText}
                                        onChange={(e) => setPostText(e.target.value)}
                                    />
                                </div>

                                {showPromptInput && (
                                    <div className={`mt-3 ${animations.slideUp}`}>
                                        <textarea
                                            placeholder="Enter your prompt here..."
                                            className="w-full bg-white rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-black border border-gray-200 min-h-24 transition-all duration-200"
                                            value={promptText}
                                            onChange={(e) => setPromptText(e.target.value)}
                                        />
                                        <div className="mt-2 flex items-center">
                                            <span className="text-sm text-gray-600 mr-2">AI Model:</span>
                                            <select
                                                className="bg-white border border-gray-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-black transition-all duration-200"
                                                value={selectedModel}
                                                onChange={(e) => setSelectedModel(e.target.value)}
                                            >
                                                <option value="midjourney">Midjourney</option>
                                                <option value="dalle">DALL-E</option>
                                                <option value="stable-diffusion">Stable Diffusion</option>
                                                <option value="leonardo">Leonardo</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                )}

                                {selectedImages.length > 0 && (
                                    <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {selectedImages.map((img, idx) => (
                                            <div key={idx} className="relative rounded-lg h-24 overflow-hidden">
                                                <AvatarImage
                                                    src={img}
                                                    alt="Selected image"
                                                    width={96}
                                                    height={144}
                                                    className="object-cover"
                                                />
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
                                        <button className="ml-auto text-gray-500 cursor-pointer" onClick={() => setSelectedLocation(null)}>
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
                                            <button type="submit" className="bg-gray-800 text-white px-4 rounded-r-lg cursor-pointer">
                                                Add
                                            </button>
                                        </form>
                                    </div>
                                )}

                                {isLocationPickerOpen && !selectedLocation && (
                                    <div className="mt-3 bg-white rounded-lg shadow-lg p-3">
                                        <h4 className="text-sm font-semibold mb-2">Popular locations:</h4>
                                        <div className="space-y-2">
                                            {["New York, USA", "London, UK", "Tokyo, Japan", "Sydney, Australia", "Paris, France"].map(
                                                (location) => (
                                                    <button
                                                        key={location}
                                                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-lg flex items-center cursor-pointer"
                                                        onClick={() => handleLocationSelect(location)}
                                                    >
                                                        <MapPin className="text-gray-500 w-4 h-4 mr-2" />
                                                        {location}
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="flex mt-4 justify-between flex-wrap">
                                    <div className="flex space-x-2 sm:space-x-4 mb-2 sm:mb-0">
                                        <button
                                            className="flex items-center text-gray-600 text-sm sm:text-base cursor-pointer transition-all duration-200 hover:text-black transform active:scale-95"
                                            onClick={() => imageInputRef.current?.click()}
                                        >
                                            <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                                            <span>Add Art</span>
                                        </button>
                                        <button
                                            className="flex items-center text-gray-600 text-sm sm:text-base cursor-pointer transition-all duration-200 hover:text-black transform active:scale-95"
                                            onClick={handleTogglePromptInput}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                                                />
                                            </svg>
                                            <span>{showPromptInput ? "Hide Prompt" : "Add Prompt"}</span>
                                        </button>
                                        <button
                                            className="flex items-center text-gray-600 text-sm sm:text-base cursor-pointer transition-all duration-200 hover:text-black transform active:scale-95"
                                            onClick={handleToggleLocationInput}
                                        >
                                            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                                            <span>Location</span>
                                        </button>
                                    </div>
                                    <div className="flex items-center">
                                        <select className="mr-3 text-sm sm:text-base bg-transparent text-gray-500 cursor-pointer focus:outline-none focus:text-black transition-colors duration-200">
                                            <option value="public">Public</option>
                                            <option value="private">Private</option>
                                        </select>
                                        <button
                                            className="bg-black text-white px-3 sm:px-5 py-1 sm:py-2 rounded-full flex items-center text-sm sm:text-base cursor-pointer transition-all duration-300 hover:bg-gray-800 transform active:scale-95"
                                            onClick={handlePostSubmit}
                                        >
                                            <Send className="w-4 h-4 mr-2" />
                                            <span>Share Art</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {posts.map((post) => (
                                    <PostCard
                                        key={post.id}
                                        post={post}
                                        currentUser={currentUser}
                                        likedPosts={likedPosts}
                                        activeCommentInput={activeCommentInput}
                                        openDropdownId={openDropdownId}
                                        onLikeToggle={handleLikeToggle}
                                        onCommentToggle={handleCommentToggle}
                                        onDropdownToggle={toggleDropdown}
                                        onCommentSubmit={handleCommentSubmit}
                                        onSavePost={savePost}
                                        onHidePost={hidePost}
                                        onReportPost={reportPost}
                                        commentText={commentText}
                                        setCommentText={setCommentText}
                                    />
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
                                            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                                                activeChat?.id === chat.id ? "bg-gray-50" : ""
                                            }`}
                                            onClick={() => handleChatSelect(chat)}
                                        >
                                            <div className="flex items-center">
                                                <div className="relative">
                                                    <AvatarImage
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
                                                        <span className="text-xs text-gray-500">
                                                            {chat.messages[chat.messages.length - 1]?.time}
                                                        </span>
                                                    </div>
                                                    <p
                                                        className={`text-sm truncate ${
                                                            chat.unreadCount > 0 ? "font-semibold text-black" : "text-gray-500"
                                                        }`}
                                                    >
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
                                            <AvatarImage
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
                                                    className={`flex ${
                                                        message.sender.id === currentUser.id ? "justify-end" : "justify-start"
                                                    }`}
                                                >
                                                    {message.sender.id !== currentUser.id && (
                                                        <AvatarImage
                                                            src={message.sender.avatar}
                                                            alt={message.sender.name}
                                                            width={32}
                                                            height={32}
                                                            className="rounded-full mr-2 self-end"
                                                        />
                                                    )}
                                                    <div
                                                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                                                            message.sender.id === currentUser.id
                                                                ? "bg-black text-white rounded-br-none"
                                                                : "bg-gray-100 text-gray-800 rounded-bl-none"
                                                        }`}
                                                    >
                                                        <p className="text-sm">{message.text}</p>
                                                        <span
                                                            className={`text-xs block mt-1 ${
                                                                message.sender.id === currentUser.id
                                                                    ? "text-gray-300 text-right"
                                                                    : "text-gray-500"
                                                            }`}
                                                        >
                                                            {message.time}
                                                        </span>
                                                    </div>
                                                    {message.sender.id === currentUser.id && (
                                                        <AvatarImage
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
                                            <div className="flex items-center space-x-2">
                                                <div className="relative">
                                                    <input 
                                                        type="file" 
                                                        className="hidden" 
                                                        id="attachFile"
                                                        onChange={(e) => {
                                                            if (e.target.files && e.target.files.length > 0) {
                                                                toast.info(`Selected file: ${e.target.files[0].name}`, {
                                                                    position: "top-right",
                                                                    autoClose: 2000
                                                                });
                                                            }
                                                        }}
                                                        accept="image/*,.pdf,.doc,.docx"
                                                    />
                                                    <button 
                                                        onClick={() => document.getElementById('attachFile')?.click()}
                                                        className="text-gray-400 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 cursor-pointer flex items-center justify-center"
                                                    >
                                                        <Paperclip size={20} />
                                                    </button>
                                                </div>
                                                <input
                                                    type="text"
                                                    className="flex-1 border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                                                    placeholder="Type a message..."
                                                    value={newMessage}
                                                    onChange={(e) => setNewMessage(e.target.value)}
                                                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                                                />
                                                <button
                                                    className={`w-10 h-10 flex items-center justify-center rounded-full ${
                                                        newMessage.trim() ? "bg-black text-white" : "bg-gray-100 text-gray-400"
                                                    } transition-colors duration-200 cursor-pointer`}
                                                    onClick={handleSendMessage}
                                                    disabled={!newMessage.trim()}
                                                >
                                                    <Send size={18} className={`transform rotate-45 ml-[-3px] ${newMessage.trim() ? "" : "opacity-50"}`} />
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
                                    AI Artists
                                </h2>

                                <div className="flex">
                                    <button
                                        onClick={() => setActiveFriendsFilter("friends")}
                                        className={`cursor-pointer mr-6 transition-colors duration-200 hover:text-black ${
                                            activeFriendsFilter === "friends" ? "text-black font-semibold" : "text-gray-500"
                                        }`}
                                    >
                                        Following
                                    </button>
                                    <button
                                        onClick={() => setActiveFriendsFilter("suggestions")}
                                        className={`cursor-pointer transition-colors duration-200 hover:text-black ${
                                            activeFriendsFilter === "suggestions" ? "text-black font-semibold" : "text-gray-500"
                                        }`}
                                    >
                                        Discover Artists
                                    </button>
                                </div>
                            </div>

                            {activeFriendsFilter === "friends" ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {friends.map((friend) => (
                                        <FriendCard
                                            key={friend.id}
                                            friend={friend}
                                            onRemoveFriend={handleRemoveFriend}
                                            onMessageFriend={handleMessageFriend}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {allSuggestions.map((suggestion) => (
                                            <div
                                                key={suggestion.id}
                                                className="flex flex-col items-center bg-white rounded-xl border border-gray-200 p-4"
                                            >
                                                <div className="relative w-20 h-20 mb-3">
                                                    <AvatarImage
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
                                                <p className="text-gray-600 text-sm my-2 text-center">Suggested based on your interests</p>
                                                <button
                                                    onClick={() => handleFollowUser(suggestion.id)}
                                                    className={`px-6 py-2 rounded-full mt-2 cursor-pointer transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                                                        suggestion.followed 
                                                            ? "bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-700" 
                                                            : "bg-black text-white hover:bg-gray-800 hover:shadow-lg"
                                                    }`}
                                                >
                                                    {suggestion.followed ? (
                                                        <span className="flex items-center">
                                                            <CheckCircle size={16} className="mr-1" />
                                                            Followed
                                                        </span>
                                                    ) : (
                                                        "Follow"
                                                    )}
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            className="text-gray-500 text-sm mt-2 cursor-pointer hover:text-black transition-colors duration-200"
                                            onClick={() => setSuggestionsModalOpen(true)}
                                        >
                                            See all
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="p-6 max-w-4xl mx-auto">
                            <h2 className="text-2xl font-bold mb-8" style={{ fontFamily: fonts.heading }}>
                                Settings
                            </h2>

                            <div className="mb-10">
                                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                                    <h3 className="text-xl font-semibold">Profile Information</h3>

                                    {!editMode && (
                                        <button
                                            className="flex items-center text-gray-700 hover:text-black px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200 cursor-pointer"
                                            onClick={() => setEditMode(true)}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 mr-2"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                                />
                                            </svg>
                                            Edit
                                        </button>
                                    )}
                                </div>

                                <div className="py-6">
                                    {editMode ? (
                                        <div className="space-y-6">
                                            <div className="flex flex-col items-center mb-6">
                                                <div
                                                    className="relative w-32 h-32 mb-3 rounded-full overflow-hidden cursor-pointer border border-gray-200 group"
                                                    onClick={() => profileImageInputRef.current?.click()}
                                                >
                                                    <AvatarImage
                                                        src={profileImagePreview || currentUser.avatar}
                                                        alt={currentUser.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-8 w-8 text-white"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={1.5}
                                                                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                                            />
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={1.5}
                                                                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-500">Click to change profile photo</p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                                    <input
                                                        type="text"
                                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                                                        value={editedName}
                                                        onChange={(e) => setEditedName(e.target.value)}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                                                    <div className="flex">
                                                        <span className="inline-flex items-center px-3 bg-gray-100 text-gray-500 border border-r-0 border-gray-200 rounded-l-lg">
                                                            @
                                                        </span>
                                                        <input
                                                            type="text"
                                                            className="flex-1 px-4 py-2 border border-gray-200 rounded-r-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                                                            value={editedUsername}
                                                            onChange={(e) => setEditedUsername(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Artist Bio</label>
                                                <textarea
                                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                                                    rows={4}
                                                    value={editedBio}
                                                    onChange={(e) => setEditedBio(e.target.value)}
                                                />
                                                <p className="mt-2 text-xs text-gray-500">
                                                    Briefly describe your artistic style and AI tools you use
                                                </p>
                                            </div>

                                            <div className="flex space-x-4 pt-4">
                                                <button
                                                    className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition-colors duration-200 cursor-pointer"
                                                    onClick={handleSaveProfile}
                                                >
                                                    Save Changes
                                                </button>
                                                <button
                                                    className="bg-white text-gray-700 border border-gray-200 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                                                    onClick={handleCancelEdit}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="flex flex-col md:flex-row md:items-center">
                                                <div className="relative w-28 h-28 md:mr-8 mx-auto md:mx-0 mb-4 md:mb-0">
                                                    <AvatarImage
                                                        src={currentUser.avatar}
                                                        alt={currentUser.name}
                                                        fill
                                                        className="rounded-full object-cover"
                                                    />
                                                </div>
                                                <div className="text-center md:text-left">
                                                    <h3 className="text-xl font-bold mb-1 group transition-all duration-300 cursor-pointer" style={{ fontFamily: fonts.heading }}>
                                                        <span className="relative inline-block">
                                                            {currentUser.name}
                                                            <span className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-400 to-orange-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-clip-text text-transparent pointer-events-none">
                                                                {currentUser.name}
                                                            </span>
                                                        </span>
                                                    </h3>
                                                    <p className="text-gray-500 mb-2">@{currentUser.username}</p>
                                                    <span className="inline-block bg-[#f4f1f2] text-gray-700 px-3 py-1 rounded-full text-sm">
                                                        AI Artist
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="bg-[#f4f1f2] rounded-xl p-4">
                                                <h4 className="text-sm font-medium mb-2">Artist Bio</h4>
                                                <p className="text-gray-700">{editedBio}</p>
                                            </div>

                                            <div className="pt-4 border-t border-gray-100">
                                                <h4 className="font-semibold mb-4">Account Information</h4>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                                                    <div>
                                                        <h5 className="text-sm text-gray-500 mb-1">Email</h5>
                                                        <p className="font-medium">{currentUser.username}@example.com</p>
                                                    </div>

                                                    <div>
                                                        <h5 className="text-sm text-gray-500 mb-1">Account Created</h5>
                                                        <p className="font-medium">January 15, 2023</p>
                                                    </div>

                                                    <div>
                                                        <h5 className="text-sm text-gray-500 mb-1">Last Login</h5>
                                                        <p className="font-medium">Today</p>
                                                    </div>

                                                    <div>
                                                        <h5 className="text-sm text-gray-500 mb-1">Account Type</h5>
                                                        <p className="font-medium">Creator</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mb-10">
                                <div className="pb-4 border-b border-gray-100">
                                    <h3 className="text-xl font-semibold">Preferences</h3>
                                </div>

                                <div className="py-6">
                                    <div className="space-y-6">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100">
                                            <div className="mb-3 sm:mb-0">
                                                <h4 className="font-medium mb-1">Email Notifications</h4>
                                                <p className="text-sm text-gray-500">Receive email updates about your account</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                                            </label>
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                                            <div className="mb-3 sm:mb-0">
                                                <h4 className="font-medium mb-1">Show AI Model Information</h4>
                                                <p className="text-sm text-gray-500">Display AI model information with your artworks</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-10">
                                <div className="pb-4 border-b border-gray-100">
                                    <h3 className="text-xl font-semibold">Privacy & Security</h3>
                                </div>

                                <div className="py-6">
                                    <div className="space-y-6">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100">
                                            <div className="mb-3 sm:mb-0">
                                                <h4 className="font-medium mb-1">Private Account</h4>
                                                <p className="text-sm text-gray-500">Only approved followers can see your posts</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                                            </label>
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100">
                                            <div className="mb-3 sm:mb-0">
                                                <h4 className="font-medium mb-1">Two-Factor Authentication</h4>
                                                <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                                            </label>
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                                            <div className="mb-3 sm:mb-0">
                                                <h4 className="font-medium mb-1">Activity Status</h4>
                                                <p className="text-sm text-gray-500">Let other artists know when you're active</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 text-center border-t border-gray-100 pt-6">
                                <button 
                                    onClick={handleDeleteAccount}
                                    className="text-gray-500 hover:text-red-600 text-sm font-medium transition-colors duration-200 cursor-pointer"
                                >
                                    Delete Account
                                </button>
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
                                        className="rounded-xl overflow-hidden h-40 relative group cursor-pointer transition-all duration-300 hover:shadow-lg"
                                        onClick={() => handleStoryClick(story)}
                                    >
                                        <div className="absolute inset-0 transition-opacity duration-300">
                                            <AvatarImage src={story.image} alt="AI artwork" fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                                            <div className="bg-white rounded-full py-1 px-2 flex items-center transform transition-transform duration-300 group-hover:scale-105">
                                                <AvatarImage
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
                                Artist Suggestions
                            </h3>
                            <div className="space-y-4">
                                {suggestions.map((suggestion) => (
                                    <SidebarSuggestionCard key={suggestion.id} suggestion={suggestion} onFollowUser={handleFollowUser} />
                                ))}
                                <button
                                    className="text-gray-500 text-sm mt-2 cursor-pointer hover:text-black transition-colors duration-200"
                                    onClick={() => setSuggestionsModalOpen(true)}
                                >
                                    See all
                                </button>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold mb-6" style={{ fontFamily: fonts.heading }}>
                                Trending Topics
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                {recommendations.map((rec) => (
                                    <div
                                        key={rec.id}
                                        className="bg-gray-100 rounded-xl p-4 flex flex-col items-center justify-center h-24 relative overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-lg"
                                    >
                                        <div className="absolute inset-0 transition-opacity duration-300">
                                            <AvatarImage src={rec.icon} alt={rec.title} fill className="object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
                                        </div>
                                        <span className="z-10 text-black font-medium truncate">{rec.title}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6">
                                <h4 className="font-semibold mb-3">Popular Hashtags</h4>
                                <div className="flex flex-wrap gap-2">
                                    <span className="bg-gray-100 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-gray-200 transition-all duration-300 hover:scale-105">
                                        #AIArt
                                    </span>
                                    <span className="bg-gray-100 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-gray-200 transition-all duration-300 hover:scale-105">
                                        #MidJourney
                                    </span>
                                    <span className="bg-gray-100 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-gray-200 transition-all duration-300 hover:scale-105">
                                        #PromptEngineering
                                    </span>
                                    <span className="bg-gray-100 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-gray-200 transition-all duration-300 hover:scale-105">
                                        #AIForGood
                                    </span>
                                    <span className="bg-gray-100 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-gray-200 transition-all duration-300 hover:scale-105">
                                        #DeepLearning
                                    </span>
                                    <span className="bg-gray-100 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-gray-200 transition-all duration-300 hover:scale-105">
                                        #StableDiffusion
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-md p-6">
                        <h3 className="text-xl font-bold mb-4">Delete Account</h3>
                        <p className="text-gray-600 mb-6">Are you sure that you want to delete your account? This action is irreversible.</p>
                        <div className="flex space-x-4">
                            <button
                                onClick={handleCloseDeleteModal}
                                className="flex-1 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCloseDeleteModal}
                                className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 cursor-pointer"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
