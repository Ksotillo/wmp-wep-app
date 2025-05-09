"use client";
import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Map as MapIcon, X, Send, User as UserIconLucide, Heart, MapPin, Clock, Users, BarChart3, Search } from "lucide-react";
import { Poppins } from "next/font/google";
import { formatDistanceToNow } from "date-fns";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-poppins",
});

const globalStyles = `
  :root {
    --font-poppins: ${poppins.style.fontFamily}, sans-serif;
  }
  
  body, html, * {
    font-family: var(--font-poppins);
  }
`;

interface Coordinates {
    lat: number;
    lng: number;
}

interface PostComment {
    id: string;
    username: string;
    userAvatar: string;
    content: string;
    timestamp: Date;
}

interface Post {
    id: string;
    content: string;
    timestamp: Date;
    likes: number;
    comments: number;
    commentList?: PostComment[];
    likedBy?: string[];
}

interface User {
    id: string;
    name: string;
    username: string;
    avatar: string;
    coordinates: Coordinates;
    distance?: string;
    lastActive?: string;
    hobbies: string[];
    bio: string;
    location: string;
    posts?: Post[];
    commonHobbies?: string[];
}

interface Message {
    id: string;
    sender: string;
    content: string;
    timestamp: Date;
}

interface Chat {
    id: string;
    userId: string;
    messages: Message[];
}

const CURRENT_USER: User = {
    id: "current-user",
    name: "Alex Morgan",
    username: "@alex.m",
    avatar: "https://avatar.iran.liara.run/public/boy?username=alex",
    location: "New York",
    coordinates: { lat: 40.7128, lng: -74.006 },
    hobbies: ["Tennis", "Photography", "Hiking", "Reading", "Cooking"],
    bio: "Adventure seeker and photographer based in NYC. Love to explore new places and meet new people.",
};

const MOCK_USERS: User[] = [
    {
        id: "user1",
        name: "Sandra B.",
        username: "@sandra.b",
        avatar: "https://avatar.iran.liara.run/public/girl?username=sandra",
        coordinates: { lat: 40.7422, lng: -73.9894 },
        distance: "0.3 miles away",
        lastActive: "2 hours ago",
        hobbies: ["Tennis", "Planting", "Chess", "Radiohead"],
        bio: "I study at Cambridge and love to play tennis",
        location: "Cambrideport",
        posts: [
            {
                id: "post1",
                content: "Looking for tennis partners this weekend!",
                timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
                likes: 25,
                comments: 12,
                commentList: [
                    {
                        id: "comment1-1",
                        username: "@alex.m",
                        userAvatar: "https://avatar.iran.liara.run/public/boy?username=alex",
                        content: "I could join! Are you thinking morning or afternoon?",
                        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
                    },
                    {
                        id: "comment1-2",
                        username: "@chris",
                        userAvatar: "https://avatar.iran.liara.run/public/boy?username=chris",
                        content: "The weather is supposed to be perfect this weekend!",
                        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
                    },
                    {
                        id: "comment1-3",
                        username: "@david.l",
                        userAvatar: "https://avatar.iran.liara.run/public/boy?username=david",
                        content: "I'm interested too, what courts are you thinking?",
                        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
                    },
                ],
                likedBy: ["user2", "user4"],
            },
        ],
        commonHobbies: ["Tennis"],
    },
    {
        id: "user2",
        name: "Chris",
        username: "@chris",
        avatar: "https://avatar.iran.liara.run/public/boy?username=chris",
        coordinates: { lat: 40.7484, lng: -73.9857 },
        distance: "0.5 miles away",
        lastActive: "5 hours ago",
        hobbies: ["Meditation", "Chess", "Yoga"],
        bio: "Study at Harvard Square, love to play tennis",
        location: "Harvard Square",
        posts: [
            {
                id: "post2",
                content: "Anyone want to play chess this weekend at Cambridge Commons?",
                timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
                likes: 13,
                comments: 5,
                commentList: [
                    {
                        id: "comment2-1",
                        username: "@alex.m",
                        userAvatar: "https://avatar.iran.liara.run/public/boy?username=alex",
                        content: "I'd be up for a game! What time are you thinking?",
                        timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000),
                    },
                    {
                        id: "comment2-2",
                        username: "@sandra.b",
                        userAvatar: "https://avatar.iran.liara.run/public/girl?username=sandra",
                        content: "I'm not great at chess but would love to learn more!",
                        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
                    },
                ],
                likedBy: ["user1"],
            },
        ],
        commonHobbies: ["Chess"],
    },
    {
        id: "user3",
        name: "David L.",
        username: "@david.l",
        avatar: "https://avatar.iran.liara.run/public/boy?username=david",
        coordinates: { lat: 40.7536, lng: -73.9832 },
        distance: "0.8 miles away",
        lastActive: "1 day ago",
        hobbies: ["Cricket", "Photography", "Cycling"],
        bio: "I'm going to play cricket later...",
        location: "Bryant Park",
        posts: [
            {
                id: "post3",
                content: "Cricket match at Central Park tomorrow, join us!",
                timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
                likes: 8,
                comments: 3,
                commentList: [
                    {
                        id: "comment3-1",
                        username: "@emma.s",
                        userAvatar: "https://avatar.iran.liara.run/public/girl?username=emma",
                        content: "What time will you be playing?",
                        timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000),
                    },
                    {
                        id: "comment3-2",
                        username: "@yakov.s",
                        userAvatar: "https://avatar.iran.liara.run/public/boy?username=yakov",
                        content: "I've never played cricket before, can beginners join?",
                        timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000),
                    },
                    {
                        id: "comment3-3",
                        username: "@alex.m",
                        userAvatar: "https://avatar.iran.liara.run/public/boy?username=alex",
                        content: "Sounds fun! Do you need extra equipment?",
                        timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000),
                    },
                ],
                likedBy: [],
            },
        ],
        commonHobbies: ["Photography"],
    },
    {
        id: "user4",
        name: "Emma S.",
        username: "@emma.s",
        avatar: "https://avatar.iran.liara.run/public/girl?username=emma",
        coordinates: { lat: 40.7264, lng: -73.9818 },
        distance: "0.4 miles away",
        lastActive: "3 hours ago",
        hobbies: ["Hiking", "Cooking", "Photography"],
        bio: "Food blogger and hiking enthusiast.",
        location: "East Village",
        posts: [
            {
                id: "post4",
                content: "Planning a hiking trip to Bear Mountain this Saturday. Anyone interested?",
                timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
                likes: 124,
                comments: 34,
            },
        ],
        commonHobbies: ["Hiking", "Cooking", "Photography"],
    },
    {
        id: "user5",
        name: "Yakov S.",
        username: "@yakov.s",
        avatar: "https://avatar.iran.liara.run/public/boy?username=yakov",
        coordinates: { lat: 40.7033, lng: -74.017 },
        distance: "0.6 miles away",
        lastActive: "30 minutes ago",
        hobbies: ["Ice Skating", "Reading", "Chess"],
        bio: "Ice skating instructor and book lover.",
        location: "Battery Park",
        posts: [
            {
                id: "post5",
                content: "Wow! That ice dispenser's so big, the ice crushes you!",
                timestamp: new Date(Date.now() - 30 * 60 * 1000),
                likes: 87,
                comments: 15,
            },
        ],
        commonHobbies: ["Reading", "Chess"],
    },
];

const MOCK_CHATS: Chat[] = [
    {
        id: "chat1",
        userId: "user1",
        messages: [
            {
                id: "msg1",
                sender: "user1",
                content: "Hey! I saw you're interested in tennis. Would you like to play sometime?",
                timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            },
            {
                id: "msg2",
                sender: "current-user",
                content: "Hi Sandra! Sure, I'd love to. When are you free?",
                timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000),
            },
            {
                id: "msg3",
                sender: "user1",
                content: "How about this Saturday morning at Central Park courts?",
                timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 20 * 60 * 1000),
            },
            {
                id: "msg4",
                sender: "current-user",
                content: "Sounds perfect! What time do you want to meet?",
                timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
            },
            {
                id: "msg5",
                sender: "user1",
                content: "How about 9 AM? We can grab coffee after.",
                timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 40 * 60 * 1000),
            },
        ],
    },
    {
        id: "chat2",
        userId: "user2",
        messages: [
            {
                id: "msg6",
                sender: "current-user",
                content: "Hi Chris! I'm interested in the chess meetup you posted about.",
                timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            },
            {
                id: "msg7",
                sender: "user2",
                content: "Great! We're meeting at Cambridge Commons at 3 PM on Saturday.",
                timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000),
            },
            {
                id: "msg8",
                sender: "current-user",
                content: "Perfect, I'll be there. Should I bring anything?",
                timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
            },
            {
                id: "msg9",
                sender: "user2",
                content: "Just yourself! We have plenty of chess sets. Looking forward to meeting you!",
                timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000),
            },
        ],
    },
    {
        id: "chat3",
        userId: "user4",
        messages: [
            {
                id: "msg10",
                sender: "user4",
                content: "Hey, I noticed we both like hiking. Have you been to Bear Mountain before?",
                timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
            },
            {
                id: "msg11",
                sender: "current-user",
                content: "I have! It's one of my favorite spots. Are you planning a trip?",
                timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000 + 5 * 60 * 1000),
            },
            {
                id: "msg12",
                sender: "user4",
                content: "Yes, this Saturday. Would you like to join our group?",
                timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000 + 10 * 60 * 1000),
            },
            {
                id: "msg13",
                sender: "current-user",
                content: "I'd love to! How many people are going?",
                timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
            },
            {
                id: "msg14",
                sender: "user4",
                content: "About 5 of us so far. I'll send you the details!",
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            },
        ],
    },
];

const mapStyles = {
    "cartodb-voyager": {
        bg: "#F8F4FF",
        roadPrimary: "#CFC1F5",
        roadSecondary: "#E2D9FA",
        water: "#DBE8FB",
        land: "#F0ECFD",
        building: "#E6DFF8",
        borderColor: "border-purple-500",
        text: "text-slate-800",
        overlayBg: "bg-white/60",
        theme: "light",
        textColor: "text-slate-800",
        hoverColor: "hover:bg-purple-50",
    },
    "cartodb-positron": {
        bg: "#F8F8F8",
        roadPrimary: "#DDDDDD",
        roadSecondary: "#E8E8E8",
        water: "#E3ECFA",
        land: "#F5F5F5",
        building: "#EEEEEE",
        borderColor: "border-slate-300",
        text: "text-slate-700",
        overlayBg: "bg-white/70",
        theme: "light",
        textColor: "text-slate-700",
        hoverColor: "hover:bg-slate-100",
    },
    "cartodb-dark": {
        bg: "#151B26",
        roadPrimary: "#2D3748",
        roadSecondary: "#252E3D",
        water: "#1A2234",
        land: "#1E2533",
        building: "#222B3A",
        borderColor: "border-slate-600",
        text: "text-slate-200",
        overlayBg: "bg-slate-800/70",
        theme: "dark",
        textColor: "text-slate-200",
        hoverColor: "hover:bg-slate-700",
    },
};

interface MockMapProps {
    onUserMarkerClick: (user: User) => void;
    currentUser: User;
    users: User[];
    selectedUser: User | null;
    isMobile: boolean;
    mapStyle: string;
    onMapStyleChange: (style: string) => void;
    meetupInitiated: boolean;
}

const MockMap: React.FC<MockMapProps> = ({
    onUserMarkerClick,
    currentUser,
    users,
    selectedUser,
    isMobile,
    mapStyle,
    onMapStyleChange,
    meetupInitiated,
}) => {
    const [zoom] = useState(0.2);
    const [center] = useState({
        lat: currentUser.coordinates.lat,
        lng: currentUser.coordinates.lng,
    });
    const mapRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    const calculateRelativePosition = (lat: number, lng: number) => {
        const latDiff = (lat - center.lat) * 5000;
        const lngDiff = (lng - center.lng) * 5000;

        return {
            x: 50 + lngDiff * zoom,
            y: 50 - latDiff * zoom,
        };
    };

    const getBackgroundScale = () => {
        const baseScale = isMobile ? 0.9 : 0.7; 
        return baseScale + (zoom / 0.8) * 0.6;
    };

    const handleMarkerClick = (user: User) => {
        onUserMarkerClick(user);
    };

    const getConnectionPath = () => {
        if (!selectedUser) return null;

        const start = calculateRelativePosition(currentUser.coordinates.lat, currentUser.coordinates.lng);
        const end = calculateRelativePosition(selectedUser.coordinates.lat, selectedUser.coordinates.lng);

        const midX = (start.x + end.x) / 2;
        const midY = (start.y + end.y) / 2;
        const deltaX = end.x - start.x;
        const deltaY = end.y - start.y;

        const perpX = -deltaY * 0.2;
        const perpY = deltaX * 0.2;

        return `M${start.x},${start.y} Q${midX + perpX},${midY + perpY} ${end.x},${end.y}`;
    };

    const getMarkerColor = (index: number) => {
        const colors = ["#f9a8d4", "#a5b4fc", "#93c5fd", "#fcd34d", "#86efac"];
        return colors[index % colors.length];
    };

    const mapStyleOptions = [
        { value: "cartodb-voyager", label: "Voyager" },
        { value: "cartodb-positron", label: "Light" },
        { value: "cartodb-dark", label: "Dark" },
    ];

    const currentStyle = mapStyles[mapStyle as keyof typeof mapStyles];

    return (
        <div className="h-full w-full relative" ref={mapRef}>
            <div className="h-full w-full overflow-hidden" style={{ background: currentStyle.bg }}>
                <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                    <g
                        transform={`scale(${getBackgroundScale()}) translate(${50 - 50 * getBackgroundScale()}, ${
                            50 - 50 * getBackgroundScale()
                        })`}
                    >
                        <path
                            d="M20,20 Q30,15 40,25 T60,30 Q80,40 70,60 T50,80 Q30,85 20,70 T20,20"
                            fill={currentStyle.water}
                            stroke="none"
                        />

                        <path
                            d="M10,10 Q20,5 30,15 T50,20 Q70,30 60,50 T40,70 Q20,75 10,60 T10,10"
                            fill={currentStyle.land}
                            stroke="none"
                        />

                        <path d="M10,50 Q30,40 50,50 T90,50" stroke={currentStyle.roadPrimary} strokeWidth="1.5" fill="none" />
                        <path d="M50,10 Q40,30 50,50 T50,90" stroke={currentStyle.roadPrimary} strokeWidth="1.5" fill="none" />

                        <path d="M30,20 Q40,30 30,50 T20,80" stroke={currentStyle.roadSecondary} strokeWidth="1" fill="none" />
                        <path d="M70,20 Q60,30 70,50 T80,80" stroke={currentStyle.roadSecondary} strokeWidth="1" fill="none" />
                        <path d="M20,30 Q40,35 60,30 T80,35" stroke={currentStyle.roadSecondary} strokeWidth="1" fill="none" />
                        <path d="M20,70 Q40,65 60,70 T80,65" stroke={currentStyle.roadSecondary} strokeWidth="1" fill="none" />

                        <rect x="30" y="35" width="5" height="5" fill={currentStyle.building} />
                        <rect x="40" y="38" width="4" height="4" fill={currentStyle.building} />
                        <rect x="60" y="45" width="6" height="3" fill={currentStyle.building} />
                        <rect x="55" y="60" width="4" height="4" fill={currentStyle.building} />
                        <rect x="35" y="65" width="3" height="3" fill={currentStyle.building} />
                        <rect x="65" y="30" width="5" height="5" fill={currentStyle.building} />
                    </g>

                    {selectedUser && (
                        <path
                            d={getConnectionPath() || ""}
                            stroke={mapStyle === "cartodb-dark" ? "#a78bfa" : "#9333ea"}
                            strokeWidth="1"
                            strokeDasharray="3 3"
                            fill="none"
                            className={meetupInitiated ? "animate-dash" : ""}
                        />
                    )}

                    <g
                        transform={`translate(${calculateRelativePosition(currentUser.coordinates.lat, currentUser.coordinates.lng).x}, ${
                            calculateRelativePosition(currentUser.coordinates.lat, currentUser.coordinates.lng).y
                        })`}
                        className="cursor-pointer"
                    >
                        <circle r={isMobile ? 4.5 : 3} fill="#10B981" stroke="white" strokeWidth={isMobile ? 0.75 : 0.5} />
                        <foreignObject x={isMobile ? -3.5 : -2.5} y={isMobile ? -3.5 : -2.5} width={isMobile ? 7 : 5} height={isMobile ? 7 : 5}>
                            <div className="w-full h-full rounded-full overflow-hidden">
                                <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                            </div>
                        </foreignObject>
                    </g>

                    {users.map((user: User, index: number) => (
                        <g
                            key={user.id}
                            transform={`translate(${calculateRelativePosition(user.coordinates.lat, user.coordinates.lng).x}, ${
                                calculateRelativePosition(user.coordinates.lat, user.coordinates.lng).y
                            })`}
                            onClick={() => handleMarkerClick(user)}
                            className="cursor-pointer"
                        >
                            <circle r={isMobile ? 4 : 2.5} fill={getMarkerColor(index)} stroke="white" strokeWidth={isMobile ? 0.75 : 0.5} />
                            <foreignObject x={isMobile ? -3 : -2} y={isMobile ? -3 : -2} width={isMobile ? 6 : 4} height={isMobile ? 6 : 4}>
                                <div className="w-full h-full rounded-full overflow-hidden">
                                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                </div>
                            </foreignObject>
                        </g>
                    ))}

                    <defs></defs>
                </svg>
            </div>

            <style jsx>{`
                @keyframes dash {
                    to {
                        stroke-dashoffset: 6;
                    }
                }
                .animate-dash {
                    animation: dash 1s linear infinite;
                }
            `}</style>

            <div className="absolute top-5 left-5 z-[500] flex items-center space-x-2">
                <div
                    className={`backdrop-blur-md px-4 py-2 md:px-6 md:py-3 rounded-full text-sm md:text-base font-medium ${currentStyle.overlayBg} ${currentStyle.borderColor} rounded-2xl shadow-sm`}
                >
                    <div className="flex items-center space-x-2 md:space-x-3">
                        <MapPin size={14} className={`md:w-5 md:h-5 ${mapStyle === "cartodb-dark" ? "text-pink-400" : "text-pink-500"}`} />
                        <span className={currentStyle.text}>New York</span>
                    </div>
                </div>

                {!isMobile && (
                    <div className={`backdrop-blur-md p-2 rounded-lg ${currentStyle.overlayBg} ${currentStyle.borderColor} shadow-sm`}>
                        <StyleDropdown
                            value={mapStyle}
                            onChange={onMapStyleChange}
                            options={mapStyleOptions}
                            isDark={mapStyle === "cartodb-dark"}
                        />
                    </div>
                )}
            </div>

            {isMobile && (
                <div className="absolute bottom-20 right-5 z-[500]">
                    <div className={`backdrop-blur-md p-2 rounded-lg ${currentStyle.overlayBg} ${currentStyle.borderColor} shadow-sm`}>
                        <StyleDropdown
                            value={mapStyle}
                            onChange={onMapStyleChange}
                            options={mapStyleOptions}
                            isDark={mapStyle === "cartodb-dark"}
                        />
                    </div>
                </div>
            )}

            <div className="absolute top-5 right-5 flex space-x-3 md:space-x-4 z-[500]">
                <div
                    className={`backdrop-blur-md px-4 py-2 md:px-6 md:py-3 rounded-full text-sm md:text-base ${currentStyle.overlayBg} ${currentStyle.borderColor} rounded-2xl shadow-sm`}
                >
                    <div className="flex items-center space-x-2 md:space-x-3">
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
                            className={`${mapStyle === "cartodb-dark" ? "text-purple-400" : "text-purple-500"} md:w-5 md:h-5`}
                        >
                            <path d="M18 11.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z" />
                            <path d="M17.5 11.5H20" />
                            <path d="M4 11.5h2.5" />
                            <path d="M11.5 4v2.5" />
                            <path d="M11.5 17.5V20" />
                        </svg>
                        <span className={currentStyle.text}>15.9% explored</span>
                    </div>
                </div>
                <div
                    className={`backdrop-blur-md px-4 py-2 md:px-6 md:py-3 rounded-full text-sm md:text-base ${currentStyle.overlayBg} ${currentStyle.borderColor} rounded-2xl shadow-sm`}
                >
                    <div className="flex items-center space-x-2 md:space-x-3">
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
                            className={`${mapStyle === "cartodb-dark" ? "text-yellow-300" : "text-yellow-500"} md:w-5 md:h-5`}
                        >
                            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                        <span className={currentStyle.text}>12°</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StyleDropdown = ({
    value,
    onChange,
    options,
    isDark,
}: {
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    isDark: boolean;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const selectedLabel = options.find((opt) => opt.value === value)?.label || value;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between space-x-2 px-3 py-1.5 rounded-lg text-sm ${
                    isDark ? "bg-slate-800 text-white hover:bg-slate-700" : "bg-white/80 text-slate-800 hover:bg-white"
                }`}
            >
                <span>{selectedLabel}</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-transform ${isOpen ? "transform rotate-180" : ""}`}
                >
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>

            {isOpen && (
                <div
                    className={`absolute mt-1 left-0 w-32 rounded-lg overflow-hidden shadow-lg z-50 ${
                        isDark ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-200"
                    }`}
                >
                    {options.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                            className={`block w-full text-left px-4 py-2 text-sm ${
                                option.value === value
                                    ? isDark
                                        ? "bg-slate-700 text-white"
                                        : "bg-purple-100 text-purple-700"
                                    : isDark
                                    ? "text-white hover:bg-slate-700"
                                    : "text-slate-800 hover:bg-slate-100"
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default function LocalApp() {
    const [activeTab, setActiveTab] = useState<"map" | "inbox">("map");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showUserDetails, setShowUserDetails] = useState(false);
    const [showCommonHobbies, setShowCommonHobbies] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [activeChat, setActiveChat] = useState<Chat | null>(null);
    const [messageInput, setMessageInput] = useState("");
    const [isChatMinimized, setIsChatMinimized] = useState(false);
    const [isChatExpanded, setIsChatExpanded] = useState(false);
    const [isMessagesVisible, setIsMessagesVisible] = useState(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [mapStyle, setMapStyle] = useState<string>("cartodb-voyager");
    const [meetupInitiated, setMeetupInitiated] = useState(false);
    const [selectedHobbyFilter, setSelectedHobbyFilter] = useState<string | null>(null);

    const mapStyles = {
        "cartodb-voyager": {
            theme: "light",
            overlayBg: "bg-white/60",
            borderColor: "border-purple-500",
            textColor: "text-slate-800",
            hoverColor: "hover:bg-purple-50",
        },
        "cartodb-positron": {
            theme: "light",
            overlayBg: "bg-white/70",
            borderColor: "border-slate-300",
            textColor: "text-slate-700",
            hoverColor: "hover:bg-slate-100",
        },
        "cartodb-dark": {
            theme: "dark",
            overlayBg: "bg-slate-800/70",
            borderColor: "border-slate-600",
            textColor: "text-slate-200",
            hoverColor: "hover:bg-slate-700",
        },
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleHobbySelectFromPanel = (hobby: string) => {
        setSelectedHobbyFilter(prevFilter => prevFilter === hobby ? null : hobby);
    };

    const handleUserMarkerClick = (user: User) => {
        setSelectedUser(user);
        setShowUserDetails(true);
        setShowCommonHobbies(false);
        setMeetupInitiated(false);
    };

    const handleMeetupClick = () => {
        setShowCommonHobbies(true);
        setMeetupInitiated(true);
    };

    const handleCloseUserDetails = () => {
        if (!meetupInitiated) {
            setSelectedUser(null);
        }
        setShowUserDetails(false);
    };

    const handleStartChat = (user: User) => {
        const existingChat = MOCK_CHATS.find((chat) => chat.userId === user.id);
        const chatToSet = existingChat || {
            id: `chat-${user.id}`,
            userId: user.id,
            messages: [],
        };

        if (isMobile) {
            setActiveChat(chatToSet);
            setActiveTab("inbox");
        } else {
            setActiveChat(chatToSet);
            setIsMessagesVisible(true);
            setIsChatMinimized(false);
            setIsChatExpanded(false);
        }
    };

    const handleSendMessage = () => {
        if (!messageInput.trim() || !activeChat) return;

        const newMessage: Message = {
            id: `msg-${Date.now()}`,
            sender: "current-user",
            content: messageInput,
            timestamp: new Date(),
        };

        const updatedChat: Chat = {
            ...activeChat,
            messages: [...activeChat.messages, newMessage],
        };

        const chatIndex = MOCK_CHATS.findIndex((chat) => chat.id === activeChat.id);
        if (chatIndex >= 0) {
            MOCK_CHATS[chatIndex] = updatedChat;
        } else {
            MOCK_CHATS.push(updatedChat);
        }

        setActiveChat(updatedChat);
        setMessageInput("");
    };

    const getUserById = (userId: string): User | undefined => {
        return MOCK_USERS.find((user) => user.id === userId);
    };

    const handleTabChange = (value: string) => {
        if (value === "map" || value === "inbox") {
            setActiveTab(value);
        }
    };

    const handleCloseChat = () => {
        setActiveChat(null);
        setIsMessagesVisible(false);
        setIsChatMinimized(false);
        setIsChatExpanded(false);
    };

    const handleMinimizeChat = () => {
        setIsChatMinimized(true);
        setIsChatExpanded(false);
    };

    const handleExpandChat = () => {
        setIsChatExpanded(!isChatExpanded);
        setIsChatMinimized(false);
    };

    const toggleMessages = () => {
        setIsMessagesVisible(!isMessagesVisible);
        if (activeChat) {
            setActiveChat(null);
        }
    };

    const handleSelectChat = (chat: Chat) => {
        setActiveChat(chat);
    };

    const calculateDistance = (user1: User, user2: User): string => {
        const R = 6371;
        const dLat = (user2.coordinates.lat - user1.coordinates.lat) * (Math.PI / 180);
        const dLon = (user2.coordinates.lng - user1.coordinates.lng) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(user1.coordinates.lat * (Math.PI / 180)) *
                Math.cos(user2.coordinates.lat * (Math.PI / 180)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        if (distance < 1) {
            return `${Math.round(distance * 1000)} meters`;
        }
        return `${distance.toFixed(1)} km`;
    };

    const handleLikePost = (user: User, post: Post) => {
        const isLiked = post.likedBy?.includes(CURRENT_USER.id) || false;

        const updatedPost = { ...post };

        if (isLiked) {
            updatedPost.likes = Math.max(0, updatedPost.likes - 1);
            updatedPost.likedBy = updatedPost.likedBy?.filter((id) => id !== CURRENT_USER.id) || [];
        } else {
            updatedPost.likes += 1;
            updatedPost.likedBy = [...(updatedPost.likedBy || []), CURRENT_USER.id];
        }

        if (user.posts) {
            const postIndex = user.posts.findIndex((p) => p.id === post.id);
            if (postIndex !== -1) {
                user.posts[postIndex] = updatedPost;
            }
        }

        saveUserPostsToLocalStorage();

        if (selectedPost && selectedPost.id === post.id) {
            setSelectedPost(updatedPost);
        }
    };

    const handleAddComment = (content: string) => {
        if (!selectedPost || !selectedUser || !content.trim()) return;

        const newComment: PostComment = {
            id: `comment-${Date.now()}`,
            username: CURRENT_USER.username,
            userAvatar: CURRENT_USER.avatar,
            content: content,
            timestamp: new Date(),
        };

        const updatedCommentList = selectedPost.commentList ? [...selectedPost.commentList, newComment] : [newComment];

        const updatedPost: Post = {
            ...selectedPost,
            comments: (selectedPost.comments || 0) + 1,
            commentList: updatedCommentList,
        };

        if (selectedUser.posts) {
            const postIndex = selectedUser.posts.findIndex((p) => p.id === selectedPost.id);
            if (postIndex !== -1) {
                selectedUser.posts[postIndex] = updatedPost;
                setSelectedPost(updatedPost);

                saveUserPostsToLocalStorage();
            }
        }
    };

    useEffect(() => {
        loadUserPostsFromLocalStorage();
    }, []);

    const saveUserPostsToLocalStorage = () => {
        try {
            const postsToSave = MOCK_USERS.map((user) => ({
                userId: user.id,
                posts: user.posts,
            }));
            localStorage.setItem("userPosts", JSON.stringify(postsToSave));
        } catch (error) {
            console.error("Error saving posts to localStorage:", error);
        }
    };

    const loadUserPostsFromLocalStorage = () => {
        try {
            const savedPosts = localStorage.getItem("userPosts");
            if (savedPosts) {
                const parsedPosts = JSON.parse(savedPosts);

                parsedPosts.forEach((item: { userId: string; posts: Post[] }) => {
                    const userIndex = MOCK_USERS.findIndex((u) => u.id === item.userId);
                    if (userIndex !== -1 && item.posts) {
                        const processedPosts = item.posts.map((post) => ({
                            ...post,
                            timestamp: new Date(post.timestamp),
                            commentList: post.commentList?.map((comment) => ({
                                ...comment,
                                timestamp: new Date(comment.timestamp),
                            })),
                        }));
                        MOCK_USERS[userIndex].posts = processedPosts;
                    }
                });
            }
        } catch (error) {
            console.error("Error loading posts from localStorage:", error);
        }
    };

    return (
        <Theme accentColor="green">
            <div
                className={`min-h-screen ${
                    mapStyle === "cartodb-dark" ? "bg-slate-900" : "bg-gradient-to-br from-pink-100 via-yellow-100 to-purple-100"
                } ${poppins.variable} font-poppins`}
            >
                <style jsx global>
                    {globalStyles}
                </style>

                <main className={`min-h-screen ${isMobile && !activeChat ? "pb-16" : ""}`}>
                    <Tabs.Root value={activeTab} onValueChange={handleTabChange}>
                        <Tabs.Content value="map">
                            <div className="relative h-screen">
                                <MockMap
                                    onUserMarkerClick={handleUserMarkerClick}
                                    currentUser={CURRENT_USER}
                                    users={selectedHobbyFilter ? MOCK_USERS.filter(u => u.hobbies.includes(selectedHobbyFilter)) : MOCK_USERS}
                                    selectedUser={selectedUser}
                                    isMobile={isMobile}
                                    mapStyle={mapStyle}
                                    onMapStyleChange={setMapStyle}
                                    meetupInitiated={meetupInitiated}
                                />

                                {/* People You Might Know Panel - Desktop */} 
                                {!isMobile && !selectedUser && (
                                    <div className={`absolute top-1/2 -translate-y-1/2 left-5 z-[550] md:w-80 w-72 md:max-h-[60vh] max-h-[50vh] rounded-xl shadow-xl overflow-hidden 
                                                    ${mapStyles[mapStyle as keyof typeof mapStyles].overlayBg} 
                                                    ${mapStyles[mapStyle as keyof typeof mapStyles].borderColor}`}>
                                        <PeopleYouMightKnowPanel 
                                            users={MOCK_USERS} 
                                            currentUser={CURRENT_USER} 
                                            onUserSelect={handleUserMarkerClick} 
                                            theme={mapStyles[mapStyle as keyof typeof mapStyles].theme}
                                        />
                                    </div>
                                )}
                                
                                {/* Trending Hobbies Panel - Desktop */} 
                                {!isMobile && (
                                     <div className={`absolute top-1/2 -translate-y-1/2 right-5 z-[5] md:w-80 w-72 md:max-h-[60vh] max-h-[50vh] rounded-xl shadow-xl overflow-hidden 
                                                    ${mapStyles[mapStyle as keyof typeof mapStyles].overlayBg} 
                                                    ${mapStyles[mapStyle as keyof typeof mapStyles].borderColor}`}>
                                        <TrendingHobbiesPanel 
                                            users={MOCK_USERS}
                                            theme={mapStyles[mapStyle as keyof typeof mapStyles].theme}
                                            onHobbySelect={handleHobbySelectFromPanel}
                                            activeHobbyFilter={selectedHobbyFilter}
                                        />
                                    </div>
                                )}

                                {/* Desktop User Details Panel */}
                                {!isMobile && selectedUser && showUserDetails && (
                                    <div
                                        className={`absolute top-20 left-5 z-[600] w-80 rounded-xl p-5 shadow-xl max-h-[80vh] overflow-y-auto 
                                            ${
                                                mapStyle === "cartodb-dark"
                                                    ? "bg-slate-900/95 border-2 border-slate-700"
                                                    : mapStyle === "cartodb-positron"
                                                    ? "bg-white/95 border-2 border-slate-300"
                                                    : "bg-purple-50/95 border-2 border-purple-500"
                                            }`}
                                    >
                                        <UserDetailsContent
                                            selectedUser={selectedUser}
                                            onClose={handleCloseUserDetails}
                                            showCommonHobbies={showCommonHobbies}
                                            handleMeetupClick={handleMeetupClick}
                                            handleStartChat={handleStartChat}
                                            calculatedDistance={calculateDistance(CURRENT_USER, selectedUser)}
                                            isDesktop={true}
                                            onSelectPost={setSelectedPost}
                                            theme={mapStyles[mapStyle as keyof typeof mapStyles].theme}
                                        />
                                    </div>
                                )}

                                {/* Mobile User Details Dialog */}
                                {isMobile && (
                                    <Dialog.Root open={showUserDetails} onOpenChange={handleCloseUserDetails}>
                                        <Dialog.Portal>
                                            <Dialog.Overlay
                                                className={`fixed inset-0 backdrop-blur-sm z-[600] ${
                                                    mapStyle === "cartodb-dark" ? "bg-black/70" : "bg-black/50"
                                                }`}
                                            />
                                            <Dialog.Content
                                                className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl p-6 max-w-md w-full max-h-[85vh] overflow-y-auto focus:outline-none shadow-xl z-[700] ${
                                                    mapStyle === "cartodb-dark"
                                                        ? "bg-slate-900/95 border-2 border-slate-700"
                                                        : "bg-purple-50/95 border-2 border-purple-500"
                                                }`}
                                            >
                                                {selectedUser && (
                                                    <UserDetailsContent
                                                        selectedUser={selectedUser}
                                                        onClose={handleCloseUserDetails}
                                                        showCommonHobbies={showCommonHobbies}
                                                        handleMeetupClick={handleMeetupClick}
                                                        handleStartChat={handleStartChat}
                                                        calculatedDistance={calculateDistance(CURRENT_USER, selectedUser)}
                                                        onSelectPost={(post) => {
                                                            setSelectedPost(post);
                                                            setShowUserDetails(false);
                                                        }}
                                                        theme={mapStyles[mapStyle as keyof typeof mapStyles].theme}
                                                    />
                                                )}
                                            </Dialog.Content>
                                        </Dialog.Portal>
                                    </Dialog.Root>
                                )}
                            </div>
                        </Tabs.Content>

                        {isMobile && (
                            <Tabs.Content value="inbox">
                                <div
                                    className={`flex h-screen flex-col ${
                                        mapStyle === "cartodb-dark"
                                            ? "bg-slate-800/95 backdrop-blur-md"
                                            : "bg-purple-100/95 backdrop-blur-md"
                                    }`}
                                >
                                    <div className={`${activeChat ? "hidden" : "flex flex-col h-full"}`}>
                                        <div
                                            className={`p-4 flex justify-between items-center ${
                                                mapStyle === "cartodb-dark"
                                                    ? "border-b border-slate-700 bg-slate-900"
                                                    : "border-b border-slate-200"
                                            }`}
                                        >
                                            <h2
                                                className={`text-xl font-semibold ${
                                                    mapStyle === "cartodb-dark" ? "text-white" : "text-slate-800"
                                                }`}
                                            >
                                                Messages
                                            </h2>
                                        </div>

                                        <div className="overflow-y-auto flex-1">
                                            {MOCK_CHATS.map((chat) => {
                                                const user = getUserById(chat.userId);
                                                const lastMessage = chat.messages[chat.messages.length - 1];

                                                return (
                                                    <div
                                                        key={chat.id}
                                                        onClick={() => setActiveChat(chat)}
                                                        className={`p-4 cursor-pointer transition-all duration-200 ${
                                                            mapStyle === "cartodb-dark"
                                                                ? "border-b border-slate-700 bg-slate-800 hover:bg-slate-700"
                                                                : "border-b border-slate-200 bg-purple-50 hover:bg-purple-100"
                                                        }`}
                                                    >
                                                        <div className="flex items-center space-x-3">
                                                            <div className="relative">
                                                                <div
                                                                    className={`w-12 h-12 rounded-full flex items-center justify-center p-1 ${
                                                                        mapStyle === "cartodb-dark"
                                                                            ? "bg-slate-700 border-2 border-purple-400"
                                                                            : "bg-white border-2 border-purple-500"
                                                                    }`}
                                                                >
                                                                    <img
                                                                        src={user?.avatar}
                                                                        alt={user?.name}
                                                                        className="w-10 h-10 rounded-full"
                                                                    />
                                                                </div>
                                                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex justify-between items-center mb-1">
                                                                    <h3
                                                                        className={`text-sm font-semibold truncate ${
                                                                            mapStyle === "cartodb-dark" ? "text-white" : "text-slate-800"
                                                                        }`}
                                                                    >
                                                                        {user?.name}
                                                                    </h3>
                                                                    <span
                                                                        className={`text-xs ${
                                                                            mapStyle === "cartodb-dark"
                                                                                ? "text-slate-400"
                                                                                : "text-slate-500"
                                                                        }`}
                                                                    >
                                                                        {lastMessage &&
                                                                            formatDistanceToNow(lastMessage.timestamp, { addSuffix: true })}
                                                                    </span>
                                                                </div>
                                                                <p
                                                                    className={`text-sm truncate ${
                                                                        mapStyle === "cartodb-dark" ? "text-slate-300" : "text-slate-600"
                                                                    }`}
                                                                >
                                                                    {lastMessage?.content}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {activeChat && (
                                        <div
                                            className={`flex flex-col h-full ${
                                                mapStyle === "cartodb-dark" ? "bg-slate-800" : "bg-purple-50"
                                            }`}
                                        >
                                            <div
                                                className={`p-4 flex items-center ${
                                                    mapStyle === "cartodb-dark"
                                                        ? "border-b border-slate-700 bg-slate-900"
                                                        : "border-b border-slate-200 bg-purple-100"
                                                }`}
                                            >
                                                <button
                                                    onClick={() => setActiveChat(null)}
                                                    className={`mr-2 p-2 rounded-full ${
                                                        mapStyle === "cartodb-dark" ? "hover:bg-slate-700" : "hover:bg-purple-200"
                                                    }`}
                                                    aria-label="Back to messages"
                                                >
                                                    <X
                                                        size={18}
                                                        className={mapStyle === "cartodb-dark" ? "text-white" : "text-slate-700"}
                                                    />
                                                </button>

                                                <div className="flex items-center space-x-3">
                                                    <div
                                                        className={`w-10 h-10 rounded-full flex items-center justify-center p-1 ${
                                                            mapStyle === "cartodb-dark"
                                                                ? "bg-slate-700 border-2 border-purple-400"
                                                                : "bg-white border-2 border-purple-500"
                                                        }`}
                                                    >
                                                        <img
                                                            src={getUserById(activeChat.userId)?.avatar}
                                                            alt={getUserById(activeChat.userId)?.name}
                                                            className="w-8 h-8 rounded-full"
                                                        />
                                                    </div>
                                                    <div>
                                                        <h2
                                                            className={`text-md font-semibold ${
                                                                mapStyle === "cartodb-dark" ? "text-white" : "text-slate-800"
                                                            }`}
                                                        >
                                                            {getUserById(activeChat.userId)?.name}
                                                        </h2>
                                                        <p
                                                            className={`text-xs ${
                                                                mapStyle === "cartodb-dark" ? "text-slate-400" : "text-slate-500"
                                                            }`}
                                                        >
                                                            {getUserById(activeChat.userId)?.location}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div
                                                className={`flex-1 overflow-y-auto p-4 space-y-4 ${
                                                    mapStyle === "cartodb-dark" ? "bg-slate-800" : "bg-purple-50"
                                                }`}
                                            >
                                                {activeChat.messages.map((message) => {
                                                    const isCurrentUser = message.sender === "current-user";

                                                    return (
                                                        <div
                                                            key={message.id}
                                                            className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                                                        >
                                                            <div
                                                                className={`max-w-[75%] p-3 rounded-2xl ${
                                                                    isCurrentUser
                                                                        ? `rounded-tr-none ${
                                                                              mapStyle === "cartodb-dark"
                                                                                  ? "bg-emerald-700"
                                                                                  : "bg-emerald-500"
                                                                          } text-white`
                                                                        : `rounded-tl-none ${
                                                                              mapStyle === "cartodb-dark"
                                                                                  ? "bg-slate-700 text-white"
                                                                                  : "bg-purple-200 text-purple-900"
                                                                          }`
                                                                }`}
                                                            >
                                                                <p>{message.content}</p>
                                                                <p
                                                                    className={`text-xs mt-1 ${
                                                                        isCurrentUser
                                                                            ? "text-white/80"
                                                                            : mapStyle === "cartodb-dark"
                                                                            ? "text-white/80"
                                                                            : "text-purple-800/80"
                                                                    }`}
                                                                >
                                                                    {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <div
                                                className={`p-3 ${
                                                    mapStyle === "cartodb-dark"
                                                        ? "border-t border-slate-700 bg-slate-900"
                                                        : "border-t border-slate-200 bg-purple-100"
                                                }`}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <input
                                                        type="text"
                                                        value={messageInput}
                                                        onChange={(e) => setMessageInput(e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter" && !e.shiftKey) {
                                                                e.preventDefault();
                                                                handleSendMessage();
                                                            }
                                                        }}
                                                        placeholder="Type a message..."
                                                        className={`flex-1 py-2 px-4 rounded-full ${
                                                            mapStyle === "cartodb-dark"
                                                                ? "bg-slate-700 text-white border border-slate-600 placeholder-slate-400"
                                                                : "bg-yellow-100 text-amber-900 border border-purple-500 placeholder-amber-700 placeholder-opacity-70"
                                                        }`}
                                                    />
                                                    <button
                                                        onClick={handleSendMessage}
                                                        className={`flex-shrink-0 w-10 h-10 flex items-center justify-center text-white rounded-full ${
                                                            mapStyle === "cartodb-dark"
                                                                ? "bg-emerald-700 hover:bg-emerald-600"
                                                                : "bg-emerald-500 hover:bg-emerald-600"
                                                        } transition-colors`}
                                                        aria-label="Send message"
                                                    >
                                                        <Send size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Tabs.Content>
                        )}
                    </Tabs.Root>
                </main>

                {!isMobile && !isMessagesVisible && !activeChat && (
                    <div className="fixed bottom-6 right-6 z-50">
                        <button
                            onClick={toggleMessages}
                            className={`p-4 rounded-full shadow-lg ${
                                mapStyle === "cartodb-dark" ? "bg-emerald-700 hover:bg-emerald-600" : "bg-emerald-500 hover:bg-emerald-600"
                            } transition-colors`}
                            title="Open messages"
                            aria-label="Open messages"
                        >
                            <MessageSquare size={28} className="text-white" />
                        </button>
                    </div>
                )}

                {!isMobile && (isMessagesVisible || activeChat) && !isChatMinimized && (
                    <div
                        className={`fixed z-50 rounded-lg overflow-hidden shadow-xl transition-all duration-300 ease-in-out ${
                            mapStyle === "cartodb-dark"
                                ? "bg-slate-800 border-2 border-slate-600"
                                : "bg-purple-50 border-2 border-purple-500"
                        } ${isChatExpanded ? "inset-10" : "bottom-6 right-6 w-[420px] h-[550px]"} flex flex-col`}
                    >
                        <button
                            onClick={handleCloseChat}
                            className="absolute top-0 right-0 z-50 p-3 rounded-bl-lg bg-red-600 shadow-lg"
                            title="Close messages"
                            aria-label="Close messages"
                        >
                            <X size={20} className="text-white font-bold" />
                        </button>

                        <div
                            className={`p-3 border-b flex items-center justify-between ${
                                mapStyle === "cartodb-dark" ? "bg-slate-900 border-slate-700" : "bg-purple-900 border-slate-200"
                            }`}
                        >
                            <div className="flex items-center space-x-3">
                                {activeChat ? (
                                    <>
                                        <button
                                            onClick={() => setActiveChat(null)}
                                            className={`mr-1 p-1 rounded-full ${
                                                mapStyle === "cartodb-dark" ? "hover:bg-slate-700" : "hover:bg-purple-800"
                                            }`}
                                            title="Back to messages"
                                            aria-label="Back to messages"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="18"
                                                height="18"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="text-white"
                                            >
                                                <polyline points="15 18 9 12 15 6"></polyline>
                                            </svg>
                                        </button>
                                        <img
                                            src={getUserById(activeChat.userId)?.avatar}
                                            alt={getUserById(activeChat.userId)?.name}
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <div>
                                            <h2 className="text-sm font-semibold text-white">{getUserById(activeChat.userId)?.name}</h2>
                                            <p className="text-xs text-white opacity-70">{getUserById(activeChat.userId)?.location}</p>
                                        </div>
                                    </>
                                ) : (
                                    <h2 className="text-lg font-semibold text-white">Messages</h2>
                                )}
                            </div>

                            <div className="flex space-x-2">
                                <button
                                    onClick={handleMinimizeChat}
                                    className={`p-1 rounded ${mapStyle === "cartodb-dark" ? "hover:bg-slate-700" : "hover:bg-purple-800"}`}
                                    title="Minimize"
                                    aria-label="Minimize chat"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-white"
                                    >
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                </button>

                                <button
                                    onClick={handleExpandChat}
                                    className={`p-1 rounded ${mapStyle === "cartodb-dark" ? "hover:bg-slate-700" : "hover:bg-purple-800"}`}
                                    title={isChatExpanded ? "Collapse" : "Expand"}
                                    aria-label={isChatExpanded ? "Collapse chat" : "Expand chat"}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-white"
                                    >
                                        {isChatExpanded ? (
                                            <>
                                                <polyline points="4 14 10 14 10 20"></polyline>
                                                <polyline points="20 10 14 10 14 4"></polyline>
                                                <line x1="14" y1="10" x2="21" y2="3"></line>
                                                <line x1="3" y1="21" x2="10" y2="14"></line>
                                            </>
                                        ) : (
                                            <>
                                                <polyline points="15 3 21 3 21 9"></polyline>
                                                <polyline points="9 21 3 21 3 15"></polyline>
                                                <line x1="21" y1="3" x2="14" y2="10"></line>
                                                <line x1="3" y1="21" x2="10" y2="14"></line>
                                            </>
                                        )}
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {!activeChat && (
                            <div className="flex-1 overflow-y-auto">
                                {MOCK_CHATS.map((chat) => {
                                    const user = getUserById(chat.userId);
                                    const lastMessage = chat.messages[chat.messages.length - 1];

                                    return (
                                        <div
                                            key={chat.id}
                                            onClick={() => handleSelectChat(chat)}
                                            className={`p-4 cursor-pointer transition-all duration-200 ${
                                                mapStyle === "cartodb-dark"
                                                    ? "border-b border-slate-700 hover:bg-slate-700"
                                                    : "border-b border-slate-200 hover:bg-purple-100"
                                            }`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="relative">
                                                    <div
                                                        className={`w-12 h-12 rounded-full flex items-center justify-center p-1 ${
                                                            mapStyle === "cartodb-dark"
                                                                ? "bg-slate-700 border-2 border-purple-400"
                                                                : "bg-white border-2 border-purple-500"
                                                        }`}
                                                    >
                                                        <img src={user?.avatar} alt={user?.name} className="w-10 h-10 rounded-full" />
                                                    </div>
                                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <h3
                                                            className={`text-sm font-semibold truncate ${
                                                                mapStyle === "cartodb-dark" ? "text-white" : "text-slate-800"
                                                            }`}
                                                        >
                                                            {user?.name}
                                                        </h3>
                                                        <span
                                                            className={`text-xs ${
                                                                mapStyle === "cartodb-dark" ? "text-slate-400" : "text-slate-500"
                                                            }`}
                                                        >
                                                            {lastMessage && formatDistanceToNow(lastMessage.timestamp, { addSuffix: true })}
                                                        </span>
                                                    </div>
                                                    <p
                                                        className={`text-sm truncate ${
                                                            mapStyle === "cartodb-dark" ? "text-slate-300" : "text-slate-600"
                                                        }`}
                                                    >
                                                        {lastMessage?.content}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {activeChat && (
                            <>
                                <div
                                    className={`flex-1 overflow-y-auto p-4 space-y-4 ${
                                        mapStyle === "cartodb-dark" ? "bg-slate-800" : "bg-purple-50"
                                    }`}
                                >
                                    {activeChat.messages.map((message) => {
                                        const isCurrentUser = message.sender === "current-user";

                                        return (
                                            <div key={message.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                                                <div
                                                    className={`max-w-[75%] p-3 rounded-2xl ${
                                                        isCurrentUser
                                                            ? `rounded-tr-none ${
                                                                  mapStyle === "cartodb-dark" ? "bg-emerald-700" : "bg-emerald-500"
                                                              } text-white`
                                                            : `rounded-tl-none ${
                                                                  mapStyle === "cartodb-dark"
                                                                      ? "bg-slate-700 text-white"
                                                                      : "bg-purple-200 text-purple-900"
                                                              }`
                                                    }`}
                                                >
                                                    <p>{message.content}</p>
                                                    <p
                                                        className={`text-xs mt-1 ${
                                                            isCurrentUser
                                                                ? "text-white/80"
                                                                : mapStyle === "cartodb-dark"
                                                                ? "text-white/80"
                                                                : "text-purple-800/80"
                                                        }`}
                                                    >
                                                        {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div
                                    className={`border-t ${
                                        mapStyle === "cartodb-dark" ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-purple-100"
                                    }`}
                                >
                                    <div className="flex items-center space-x-3 p-3">
                                        <input
                                            type="text"
                                            value={messageInput}
                                            onChange={(e) => setMessageInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSendMessage();
                                                }
                                            }}
                                            placeholder="Type a message..."
                                            className={`flex-1 py-2 px-4 rounded-full ${
                                                mapStyle === "cartodb-dark"
                                                    ? "bg-slate-700 text-white border border-slate-600 placeholder-slate-400"
                                                    : "bg-yellow-100 text-amber-900 border border-purple-500 placeholder-amber-700 placeholder-opacity-70"
                                            }`}
                                        />
                                        <button
                                            onClick={handleSendMessage}
                                            className={`flex-shrink-0 w-10 h-10 flex items-center justify-center text-white rounded-full ${
                                                mapStyle === "cartodb-dark"
                                                    ? "bg-emerald-700 hover:bg-emerald-600"
                                                    : "bg-emerald-500 hover:bg-emerald-600"
                                            } transition-colors`}
                                            aria-label="Send message"
                                        >
                                            <Send size={18} />
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {!isMobile && (isMessagesVisible || activeChat) && isChatMinimized && (
                    <div
                        className={`fixed bottom-6 right-6 z-50 cursor-pointer rounded-full shadow-lg p-3 ${
                            mapStyle === "cartodb-dark" ? "bg-emerald-700 hover:bg-emerald-600" : "bg-emerald-500 hover:bg-emerald-600"
                        } transition-colors`}
                        onClick={() => setIsChatMinimized(false)}
                        title="Expand chat"
                        aria-label="Expand chat"
                    >
                        <MessageSquare size={24} className="text-white" />
                        <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                            <span className="text-xs text-white font-semibold">
                                {activeChat ? activeChat.messages.length : MOCK_CHATS.length}
                            </span>
                        </div>
                    </div>
                )}

                {isMobile && !activeChat && (
                    <div
                        className={`fixed bottom-0 left-0 right-0 h-16 flex z-50 shadow-md ${
                            mapStyle === "cartodb-dark" ? "bg-slate-900 border-t border-slate-700" : "bg-purple-100"
                        }`}
                    >
                        <button onClick={() => setActiveTab("map")} className="flex-1 flex flex-col items-center justify-center">
                            <MapIcon
                                size={24}
                                className={
                                    activeTab === "map"
                                        ? mapStyle === "cartodb-dark"
                                            ? "text-purple-400"
                                            : "text-purple-600"
                                        : mapStyle === "cartodb-dark"
                                        ? "text-slate-400"
                                        : "text-gray-500"
                                }
                            />
                            <span
                                className={`text-xs mt-1 ${
                                    activeTab === "map"
                                        ? mapStyle === "cartodb-dark"
                                            ? "text-purple-400"
                                            : "text-purple-600"
                                        : mapStyle === "cartodb-dark"
                                        ? "text-slate-400"
                                        : "text-gray-500"
                                }`}
                            >
                                Map
                            </span>
                        </button>

                        <button onClick={() => setActiveTab("inbox")} className="flex-1 flex flex-col items-center justify-center">
                            <MessageSquare
                                size={24}
                                className={
                                    activeTab === "inbox"
                                        ? mapStyle === "cartodb-dark"
                                            ? "text-purple-400"
                                            : "text-purple-600"
                                        : mapStyle === "cartodb-dark"
                                        ? "text-slate-400"
                                        : "text-gray-500"
                                }
                            />
                            <span
                                className={`text-xs mt-1 ${
                                    activeTab === "inbox"
                                        ? mapStyle === "cartodb-dark"
                                            ? "text-purple-400"
                                            : "text-purple-600"
                                        : mapStyle === "cartodb-dark"
                                        ? "text-slate-400"
                                        : "text-gray-500"
                                }`}
                            >
                                Inbox
                            </span>
                        </button>
                    </div>
                )}
            </div>

            {selectedPost && selectedUser && (
                <PostModal
                    post={selectedPost}
                    user={selectedUser}
                    onClose={() => setSelectedPost(null)}
                    onAddComment={handleAddComment}
                    onLike={() => handleLikePost(selectedUser, selectedPost)}
                    theme={mapStyles[mapStyle as keyof typeof mapStyles].theme}
                    isMobile={isMobile}
                />
            )}
        </Theme>
    );
}

const UserDetailsContent = ({
    selectedUser,
    onClose,
    showCommonHobbies,
    handleMeetupClick,
    handleStartChat,
    calculatedDistance,
    isDesktop = false,
    onSelectPost,
    theme,
}: {
    selectedUser: User;
    onClose: () => void;
    showCommonHobbies: boolean;
    handleMeetupClick: () => void;
    handleStartChat: (user: User) => void;
    calculatedDistance: string;
    isDesktop?: boolean;
    onSelectPost?: (post: Post) => void;
    theme: string;
}) => {
    const getCommentCount = (post: Post): number => {
        if (post.commentList && post.commentList.length > 0) {
            return post.commentList.length;
        }
        return post.comments || 0;
    };

    return (
        <>
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                    <img src={selectedUser.avatar} alt={selectedUser.name} className="w-10 h-10 rounded-full" />
                    <div>
                        <h2 className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-slate-800"}`}>
                            {selectedUser.name}
                        </h2>
                        <span className={`text-xs ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>{selectedUser.location}</span>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className={`p-2 rounded-full ${
                        theme === "dark"
                            ? "bg-slate-700 border border-slate-600 hover:bg-slate-600"
                            : "bg-white border border-purple-500 hover:bg-purple-100"
                    } transition-colors`}
                    aria-label="Close user details"
                    title="Close user details"
                >
                    <X size={16} className={theme === "dark" ? "text-slate-300" : "text-slate-800"} />
                </button>
            </div>

            <div className="mb-6">
                <div className="flex items-center space-x-2 mb-2">
                    <MapPin size={16} className={theme === "dark" ? "text-purple-400" : "text-purple-500"} />
                    <span className={`text-sm ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>
                        {selectedUser.location} • {calculatedDistance}
                        {isDesktop && (
                            <span className={`font-semibold ${theme === "dark" ? "text-purple-400" : "text-purple-600"}`}>
                                {" "}
                                ({calculatedDistance})
                            </span>
                        )}
                    </span>
                </div>
                <div className="flex items-center space-x-2">
                    <Clock size={16} className={theme === "dark" ? "text-purple-400" : "text-purple-500"} />
                    <span className={`text-sm ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>
                        Active {selectedUser.lastActive}
                    </span>
                </div>
            </div>

            <div className="mb-6">
                <h3 className={`text-lg font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-black"}`}>Bio</h3>
                <p
                    className={`text-sm p-3 rounded-xl ${
                        theme === "dark"
                            ? "bg-slate-800 border border-slate-600 text-slate-300"
                            : theme === "light"
                            ? "bg-white border border-slate-300 text-slate-700"
                            : "bg-white border border-purple-500 text-slate-700"
                    }`}
                >
                    {selectedUser.bio}
                </p>
            </div>

            <div className="mb-6">
                <h3 className={`text-lg font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-black"}`}>Hobbies</h3>
                <div className="flex flex-wrap gap-2">
                    {selectedUser.hobbies.map((hobby, index) => {
                        const bgColors =
                            theme === "dark"
                                ? [
                                      "bg-pink-900/70 border-pink-800 text-pink-200",
                                      "bg-purple-900/70 border-purple-800 text-purple-200",
                                      "bg-yellow-900/70 border-yellow-800 text-yellow-200",
                                      "bg-blue-900/70 border-blue-800 text-blue-200",
                                      "bg-green-900/70 border-green-800 text-green-200",
                                  ]
                                : [
                                      "bg-pink-100 border-pink-400 text-slate-700",
                                      "bg-purple-100 border-purple-400 text-slate-700",
                                      "bg-yellow-100 border-yellow-400 text-slate-700",
                                      "bg-blue-100 border-blue-400 text-slate-700",
                                      "bg-green-100 border-green-400 text-slate-700",
                                  ];

                        const bgColor = bgColors[index % bgColors.length];

                        return (
                            <span key={index} className={`px-3 py-1 rounded-full text-sm border ${bgColor}`}>
                                {hobby}
                            </span>
                        );
                    })}
                </div>
            </div>

            {isDesktop && (
                <div className="mb-6">
                    <h3 className={`text-lg font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-black"}`}>Directions</h3>
                    <div
                        className={`p-3 rounded-xl ${
                            theme === "dark"
                                ? "bg-slate-800 border border-slate-600"
                                : theme === "light"
                                ? "bg-white border border-slate-300"
                                : "bg-white border border-purple-500"
                        }`}
                    >
                        <p className={`text-sm ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>
                            <span className="font-semibold">Distance:</span> {calculatedDistance}
                        </p>
                        <p className={`text-sm ${theme === "dark" ? "text-slate-300" : "text-slate-700"} mt-1`}>
                            <span className="font-semibold">Estimated Time:</span>{" "}
                            {parseFloat(calculatedDistance) < 1
                                ? "5-10 min walking"
                                : `${Math.ceil(parseFloat(calculatedDistance) * 10)} min by car`}
                        </p>
                    </div>
                </div>
            )}

            {selectedUser.posts && selectedUser.posts.length > 0 && (
                <div className="mb-6">
                    <h3 className={`text-lg font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-black"}`}>Recent Activity</h3>
                    {selectedUser.posts.map((post) => (
                        <div
                            key={post.id}
                            className={`p-4 rounded-xl cursor-pointer transition-colors ${
                                theme === "dark"
                                    ? "bg-slate-800 border border-slate-600 text-slate-300 hover:bg-slate-700"
                                    : theme === "light"
                                    ? "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
                                    : "bg-white border border-purple-500 text-slate-700 hover:bg-purple-50"
                            }`}
                            onClick={() => {
                                if (onSelectPost) {
                                    onSelectPost(post);
                                }
                            }}
                        >
                            <p className={`mb-2 ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>{post.content}</p>
                            <div className="flex justify-between items-center">
                                <span className={`text-xs ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                                    {formatDistanceToNow(post.timestamp, { addSuffix: true })}
                                </span>
                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center space-x-1">
                                        <Heart size={14} className={theme === "dark" ? "text-pink-400" : "text-pink-500"} />
                                        <span className={`text-xs ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                                            {getCommentCount(post)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showCommonHobbies ? (
                <div className="mb-6">
                    <h3 className={`text-lg font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-black"}`}>Common Hobbies</h3>
                    {selectedUser.commonHobbies && selectedUser.commonHobbies.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {selectedUser.commonHobbies.map((hobby, index) => {
                                const bgColors =
                                    theme === "dark"
                                        ? [
                                              "bg-pink-900/70 border-pink-800 text-pink-200",
                                              "bg-purple-900/70 border-purple-800 text-purple-200",
                                              "bg-yellow-900/70 border-yellow-800 text-yellow-200",
                                              "bg-blue-900/70 border-blue-800 text-blue-200",
                                              "bg-green-900/70 border-green-800 text-green-200",
                                          ]
                                        : [
                                              "bg-pink-100 border-pink-400 text-slate-700",
                                              "bg-purple-100 border-purple-400 text-slate-700",
                                              "bg-yellow-100 border-yellow-400 text-slate-700",
                                              "bg-blue-100 border-blue-400 text-slate-700",
                                              "bg-green-100 border-green-400 text-slate-700",
                                          ];

                                const bgColor = bgColors[index % bgColors.length];

                                return (
                                    <span key={index} className={`px-3 py-1 rounded-full text-sm border ${bgColor}`}>
                                        {hobby}
                                    </span>
                                );
                            })}
                        </div>
                    ) : (
                        <p className={theme === "dark" ? "text-slate-400" : "text-slate-500"}>No common hobbies found.</p>
                    )}

                    <button
                        onClick={() => {
                            handleStartChat(selectedUser);
                            onClose();
                        }}
                        className={`mt-4 w-full py-3 px-4 font-medium rounded-xl text-white shadow-sm ${
                            theme === "dark"
                                ? "bg-emerald-700 border border-emerald-800 hover:bg-emerald-600"
                                : "bg-emerald-500 border border-emerald-600 hover:bg-emerald-600"
                        } transition-colors`}
                    >
                        Start Conversation
                    </button>
                </div>
            ) : (
                <button
                    onClick={handleMeetupClick}
                    className={`w-full py-3 px-4 font-medium rounded-xl text-white shadow-sm ${
                        theme === "dark"
                            ? "bg-emerald-700 border border-emerald-800 hover:bg-emerald-600"
                            : "bg-emerald-500 border border-emerald-600 hover:bg-emerald-600"
                    } transition-colors`}
                >
                    Let&apos;s Meetup
                </button>
            )}
        </>
    );
};

const PostModal = ({
    post,
    user,
    onClose,
    onAddComment,
    onLike,
    theme,
    isMobile,
}: {
    post: Post;
    user: User;
    onClose: () => void;
    onAddComment: (content: string) => void;
    onLike: () => void;
    theme: string;
    isMobile: boolean;
}) => {
    const [newComment, setNewComment] = useState("");
    const [isLikeAnimating, setIsLikeAnimating] = useState(false);

    const isLiked = post.likedBy?.includes(CURRENT_USER.id) || false;

    const commentList = post.commentList || [];

    const handleSubmitComment = () => {
        if (newComment.trim()) {
            onAddComment(newComment);
            setNewComment("");
        }
    };

    const handleLikeClick = () => {
        setIsLikeAnimating(true);
        onLike();
        setTimeout(() => setIsLikeAnimating(false), 500);
    };

    return (
        <Dialog.Root open={true} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className={`fixed inset-0 backdrop-blur-sm z-[800] ${theme === "dark" ? "bg-black/70" : "bg-black/50"}`} />

                <div className={`fixed inset-0 z-[900] flex items-center justify-center ${isMobile ? "px-4" : ""}`}>
                    <Dialog.Content
                        className={`
            relative z-[950]
            w-full max-w-2xl
            rounded-xl overflow-hidden focus:outline-none shadow-xl max-h-[90vh] flex flex-col
            ${theme === "dark" ? "bg-slate-900" : "bg-white"}
          `}
                    >
                        <div
                            className={`p-4 border-b flex items-center justify-between ${
                                theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
                            }`}
                        >
                            <div className="flex items-center space-x-3">
                                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border border-purple-200" />
                                <div>
                                    <h3 className={`font-semibold ${theme === "dark" ? "text-white" : "text-slate-800"}`}>{user.name}</h3>
                                    <p className={`text-xs ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>{user.location}</p>
                                </div>
                            </div>
                            <Dialog.Close
                                className={`p-2 rounded-full ${
                                    theme === "dark" ? "hover:bg-slate-700" : "hover:bg-slate-100"
                                } transition-colors`}
                            >
                                <X size={20} className={theme === "dark" ? "text-slate-300" : "text-slate-600"} />
                            </Dialog.Close>
                        </div>

                        <div className="overflow-y-auto flex-1">
                            <div
                                className={`p-5 border-b ${
                                    theme === "dark" ? "border-slate-700 text-white" : "border-slate-200 text-slate-800"
                                }`}
                            >
                                <p className="mb-3">{post.content}</p>
                                <span className={`text-xs ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                                    {formatDistanceToNow(post.timestamp, { addSuffix: true })}
                                </span>
                            </div>

                            <div
                                className={`p-4 flex items-center justify-between border-b ${
                                    theme === "dark" ? "border-slate-700" : "border-slate-200"
                                }`}
                            >
                                <button
                                    className={`flex items-center space-x-2 ${
                                        theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-100"
                                    } p-2 rounded-lg transition-all`}
                                    onClick={handleLikeClick}
                                >
                                    <Heart
                                        size={20}
                                        className={`${isLiked ? "fill-pink-500" : ""} ${
                                            theme === "dark" ? "text-pink-400" : "text-pink-500"
                                        } ${isLikeAnimating ? "scale-125" : ""} transition-transform`}
                                    />
                                    <span className={`text-sm font-medium ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>
                                        {post.likes} likes
                                    </span>
                                </button>
                                <div className={`flex items-center space-x-2 ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>
                                    <MessageSquare size={20} className={theme === "dark" ? "text-indigo-400" : "text-indigo-500"} />
                                    <span className="text-sm font-medium">{commentList.length} comments</span>
                                </div>
                            </div>

                            <div className={`p-4 space-y-4 ${theme === "dark" ? "bg-slate-900" : "bg-white"}`}>
                                <h4 className={`font-semibold ${theme === "dark" ? "text-white" : "text-slate-800"}`}>Comments</h4>

                                {commentList.length > 0 ? (
                                    commentList.map((comment) => (
                                        <div key={comment.id} className="flex space-x-3">
                                            <img
                                                src={comment.userAvatar}
                                                alt={comment.username}
                                                className="w-8 h-8 rounded-full border border-purple-200 flex-shrink-0"
                                            />
                                            <div className="flex-1">
                                                <div
                                                    className={`p-3 rounded-xl ${
                                                        theme === "dark" ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-700"
                                                    }`}
                                                >
                                                    <p
                                                        className={`font-medium text-sm ${
                                                            theme === "dark" ? "text-slate-300" : "text-slate-700"
                                                        }`}
                                                    >
                                                        {comment.username}
                                                    </p>
                                                    <p>{comment.content}</p>
                                                </div>
                                                <p className={`text-xs mt-1 ${theme === "dark" ? "text-slate-500" : "text-slate-500"}`}>
                                                    {formatDistanceToNow(comment.timestamp, { addSuffix: true })}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className={`text-center py-4 ${theme === "dark" ? "text-slate-500" : "text-slate-500"}`}>
                                        No comments yet. Be the first to comment!
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className={`p-3 border-t ${theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
                            <div className="flex items-center space-x-2">
                                <img
                                    src={CURRENT_USER.avatar}
                                    alt={CURRENT_USER.name}
                                    className="w-8 h-8 rounded-full border border-purple-200"
                                />
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Add a comment..."
                                    className={`flex-1 py-2 px-4 rounded-full ${
                                        theme === "dark"
                                            ? "bg-slate-700 border border-slate-600 text-white placeholder-slate-400"
                                            : "bg-slate-100 border border-slate-200 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                                    }`}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSubmitComment();
                                        }
                                    }}
                                />
                                <button
                                    onClick={handleSubmitComment}
                                    className={`flex-shrink-0 w-10 h-10 flex items-center justify-center text-white rounded-full ${
                                        theme === "dark" ? "bg-purple-700 hover:bg-purple-600" : "bg-purple-500 hover:bg-purple-600"
                                    } transition-colors`}
                                    aria-label="Send comment"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </Dialog.Content>
                </div>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

const PeopleYouMightKnowPanel = ({
    users,
    currentUser,
    onUserSelect,
    theme,
}: {
    users: User[];
    currentUser: User;
    onUserSelect: (user: User) => void;
    theme: string;
}) => {
    const [searchTerm, setSearchTerm] = useState("");

    const getCommonHobbiesCount = (user1Hobbies: string[], user2Hobbies: string[]): { count: number; common: string[] } => {
        const common = user1Hobbies.filter(hobby => user2Hobbies.includes(hobby));
        return { count: common.length, common };
    };

    const suggestedUsers = users
        .filter(user => user.id !== currentUser.id)
        .map(user => {
            const { count, common } = getCommonHobbiesCount(currentUser.hobbies, user.hobbies);
            return { ...user, commonHobbiesCount: count, commonHobbiesList: common };
        })
        .filter(user => user.commonHobbiesCount > 0)
        .sort((a, b) => b.commonHobbiesCount - a.commonHobbiesCount)
        .slice(0, 5) // Show top 5 suggestions
        .filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.username.toLowerCase().includes(searchTerm.toLowerCase()));

    const textColor = theme === 'dark' ? 'text-white' : 'text-slate-800';
    const inputBg = theme === 'dark' ? 'bg-slate-700 placeholder-slate-400' : 'bg-white placeholder-slate-400';
    const itemHoverBg = theme === 'dark' ? 'hover:bg-slate-700/[0.7]' : 'hover:bg-purple-100/[0.7]';
    const itemBorderColor = theme === 'dark' ? 'border-slate-600' : 'border-purple-200';

    return (
        <div className={`p-4 h-full flex flex-col`}>
            <h3 className={`text-xl font-semibold mb-3 ${textColor}`}>People You Might Know</h3>
            <div className="relative mb-3">
                <input
                    type="text"
                    placeholder="Search people..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full p-2 pl-8 rounded-lg text-sm border ${itemBorderColor} ${inputBg} ${textColor} focus:ring-purple-500 focus:border-purple-500 outline-none`}
                />
                <Search size={16} className={`absolute left-2.5 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`} />
            </div>
            {suggestedUsers.length > 0 ? (
                <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                    {suggestedUsers.map(user => (
                        <div
                            key={user.id}
                            onClick={() => onUserSelect(user)}
                            className={`flex items-center space-x-3 p-2.5 rounded-lg cursor-pointer transition-colors duration-150 ${itemHoverBg} border ${itemBorderColor}`}
                        >
                            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border-2 border-purple-300" />
                            <div>
                                <p className={`font-medium text-sm ${textColor}`}>{user.name}</p>
                                <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                                    {user.commonHobbiesCount} common {user.commonHobbiesCount === 1 ? "hobby" : "hobbies"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                 <p className={`text-sm text-center py-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>No suggestions found.</p>
            )}
        </div>
    );
};

const TrendingHobbiesPanel = ({
    users,
    theme,
    onHobbySelect,
    activeHobbyFilter,
}: {
    users: User[];
    theme: string;
    onHobbySelect: (hobby: string) => void;
    activeHobbyFilter: string | null;
}) => {
    const [searchTerm, setSearchTerm] = useState("");

    const getHobbyCounts = (): { name: string; count: number }[] => {
        const hobbyMap = new Map<string, number>();
        users.forEach(user => {
            user.hobbies.forEach(hobby => {
                hobbyMap.set(hobby, (hobbyMap.get(hobby) || 0) + 1);
            });
        });
        return Array.from(hobbyMap.entries())
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10); // Show top 10 trending hobbies
    };

    const trendingHobbies = getHobbyCounts().filter(hobby => hobby.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const textColor = theme === 'dark' ? 'text-white' : 'text-slate-800';
    const inputBg = theme === 'dark' ? 'bg-slate-700 placeholder-slate-400' : 'bg-white placeholder-slate-400';
    const itemBg = theme === 'dark' ? 'bg-slate-700/[0.5]' : 'bg-white/[0.7]'; 
    const itemBorderColor = theme === 'dark' ? 'border-slate-600' : 'border-purple-200';
    const barColor = theme === 'dark' ? 'bg-purple-500' : 'bg-purple-400';
    
    // Define more prominent active styles
    const activeItemOuterClasses = theme === 'dark' 
        ? 'bg-purple-600 border-purple-500' 
        : 'bg-purple-500 border-purple-600';
    const activeItemTextClasses = 'text-white';
    const activeBarFillColor = theme === 'dark' ? 'bg-purple-300' : 'bg-white';

    const inactiveItemHoverClasses = theme === 'dark' 
        ? 'hover:bg-slate-600/[0.6]' 
        : 'hover:bg-purple-100/[0.6]';

    return (
        <div className={`p-4 h-full flex flex-col`}>
            <h3 className={`text-xl font-semibold mb-3 ${textColor}`}>Trending Hobbies</h3>
             <div className="relative mb-3">
                <input
                    type="text"
                    placeholder="Search hobbies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full p-2 pl-8 rounded-lg text-sm border ${itemBorderColor} ${inputBg} ${textColor} focus:ring-purple-500 focus:border-purple-500 outline-none`}
                />
                <Search size={16} className={`absolute left-2.5 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`} />
            </div>
            {trendingHobbies.length > 0 ? (
                <div className="space-y-2.5 overflow-y-auto flex-1 pr-1">
                    {trendingHobbies.map((hobby, index) => (
                        <div 
                            key={hobby.name} 
                            onClick={() => onHobbySelect(hobby.name)}
                            className={`p-2.5 rounded-lg border cursor-pointer transition-all duration-150 
                                        ${ activeHobbyFilter === hobby.name 
                                            ? activeItemOuterClasses 
                                            : `${itemBg} ${itemBorderColor} ${inactiveItemHoverClasses}` 
                                        }`}
                        >
                            <div className="flex justify-between items-center mb-1">
                                <span className={`text-sm font-medium ${activeHobbyFilter === hobby.name ? activeItemTextClasses : textColor}`}>{hobby.name}</span>
                                <span className={`text-xs ${activeHobbyFilter === hobby.name ? activeItemTextClasses : (theme === 'dark' ? 'text-slate-400' : 'text-slate-500')}`}>{hobby.count} users</span>
                            </div>
                            <div className={`h-1.5 w-full rounded-full ${activeHobbyFilter === hobby.name ? (theme === 'dark' ? 'bg-purple-400/[0.5]' : 'bg-purple-300/[0.5]') : (theme === 'dark' ? 'bg-slate-600/[0.7]' : 'bg-purple-200/[0.7]')}`}>
                                <div
                                    className={`h-1.5 rounded-full ${activeHobbyFilter === hobby.name ? activeBarFillColor : barColor}`}
                                    style={{ width: `${(hobby.count / Math.max(...trendingHobbies.map(h => h.count), 1)) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className={`text-sm text-center py-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>No hobbies found.</p>
            )}
        </div>
    );
};
