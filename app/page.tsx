"use client";
import React, { useState, useRef, useEffect } from "react";
import {
    Heart,
    Mic,
    Play,
    Pause,
    Volume2,
    MoreHorizontal,
    Share2,
    X,
    Home,
    TrendingUp,
    Hash,
    Search,
    User,
    Headphones,
    Bell,
    Music,
    BookOpen,
    Activity,
    Globe,
    Bookmark,
    MapPin,
    Instagram,
    Twitter,
    Info,
    Send,
    Check,
    AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";


interface User {
    id?: string;
    name: string;
    avatar: string;
    username: string;
    bio: string;
    location: string;
    followers: number;
    following: number;
    memberSince: string;
    stories?: number;
    social: {
        twitter: string;
        instagram: string;
    };
    category?: string;
}

interface Story {
    id: string;
    user: User;
    audioUrl: string;
    title: string;
    description: string;
    duration: string;
    likes: number;
    plays: number;
    shares: number;
    timestamp: string;
    likedBy: string[];
    tags: string[];
    category: string;
}

interface RecordingData {
    audioUrl: string;
    title: string;
    description?: string;
    tags?: string[];
    category?: string;
    audioBlob?: Blob;
    duration?: number;
}

interface AlertConfig {
    isOpen: boolean;
    message: string;
    type: string;
}

interface TrendingTopic {
    id: string | number;
    name: string;
    count: number;
    category: string;
}

interface Activity {
    id: string;
    user: string;
    avatar: string;
    action: string;
    story?: string;
    time: string;
    category: string;
    read: boolean;
}

interface AudioElementWithContext extends HTMLAudioElement {
    context?: AudioContext;
    analyser?: AnalyserNode;
    source?: MediaElementAudioSourceNode;
}

interface Message {
    text: string;
    sender: string;
    time: string;
}

const colors = {
    primary: "#6D1A36",
    secondary: "#A0ACAD",
    accent: "#FF6666",
    background: "#0B2027",
    surface: "#0B2027",
    card: "#A0ACAD",
    cardHover: "#DBFE87",
    text: "#A0ACAD",
    textSecondary: "#DBFE87",
    border: "#6D1A36",
    success: "#DBFE87",
    error: "#FF6666",
};

const categories = [
    { id: "all", name: "All", icon: <Globe size={18} /> },
    { id: "music", name: "Music", icon: <Music size={18} /> },
    { id: "podcast", name: "Podcasts", icon: <BookOpen size={18} /> },
    { id: "asmr", name: "ASMR", icon: <Activity size={18} /> },
    { id: "story", name: "Stories", icon: <User size={18} /> },
];


const initialStories: Story[] = [
    {
        id: "1",
        user: {
            name: "Zaara Zabeen",
            avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW4lMjBwb3J0cmFpdHxlbnwwfHwwfHx8MA%3D%3D",
            username: "@zaara_zabeen",
            bio: "UX Designer & Design Advocate. I share insights about design systems and user experiences.",
            location: "Dhaka, Bangladesh",
            followers: 12650,
            following: 425,
            memberSince: "March 2022",
            social: {
                twitter: "zaara_zabeen",
                instagram: "zaara.zabeen",
            },
        },
        audioUrl: "https://raw.githubusercontent.com/Ksotillo/wmp-wep-app/main/public/audio/track1.mp3",
        title: "Late Night Thoughts About Design",
        description: "Reflecting on what makes great user experiences in modern apps",
        duration: "1:42",
        likes: 248,
        plays: 3427,
        shares: 42,
        timestamp: "2 hours ago",
        likedBy: [],
        tags: ["design", "ux", "creativity"],
        category: "podcast",
    },
    {
        id: "2",
        user: {
            name: "Alex Rodriguez",
            avatar: "https://plus.unsplash.com/premium_photo-1675129779554-dc86569708c8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aHVtYW4lMjBwb3J0cmFpdHxlbnwwfHwwfHx8MA%3D%3D",
            username: "@alex_design",
            bio: "Product designer with a focus on enterprise solutions. I create systems that solve complex problems.",
            location: "Boston, MA",
            followers: 8920,
            following: 356,
            memberSince: "January 2021",
            social: {
                twitter: "alexdesigns",
                instagram: "alex.product",
            },
        },
        audioUrl: "https://raw.githubusercontent.com/Ksotillo/wmp-wep-app/main/public/audio/track2.mp3",
        title: "Product Design Process Explained",
        description: "My approach to solving complex UX problems in enterprise software",
        duration: "2:15",
        likes: 156,
        plays: 2048,
        shares: 27,
        timestamp: "5 hours ago",
        likedBy: [],
        tags: ["product", "process", "enterprise"],
        category: "podcast",
    },
    {
        id: "3",
        user: {
            name: "Jamie Lee",
            avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aHVtYW4lMjBwb3J0cmFpdHxlbnwwfHwwfHx8MA%3D%3D",
            username: "@jamielee",
            bio: "Creative director and workflow specialist. I help teams optimize their creative processes.",
            location: "Portland, OR",
            followers: 6750,
            following: 512,
            memberSince: "August 2022",
            social: {
                twitter: "jamieleecreates",
                instagram: "jamie.creates",
            },
        },
        audioUrl: "https://raw.githubusercontent.com/Ksotillo/wmp-wep-app/main/public/audio/track3.mp3",
        title: "Creative Workflow Tips for Designers",
        description: "How I organize my day for maximum creative output",
        duration: "3:07",
        likes: 189,
        plays: 1954,
        shares: 18,
        timestamp: "Yesterday",
        likedBy: [],
        tags: ["workflow", "productivity", "design"],
        category: "podcast",
    },
    {
        id: "4",
        user: {
            name: "Michael Chen",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
            username: "@michael_music",
            bio: "Composer and sound designer. Creating immersive soundscapes for relaxation and focus.",
            location: "Seattle, WA",
            followers: 14200,
            following: 187,
            memberSince: "May 2020",
            social: {
                twitter: "michaelsounds",
                instagram: "michael.ambient",
            },
        },
        audioUrl: "https://raw.githubusercontent.com/Ksotillo/wmp-wep-app/main/public/audio/track4.mp3",
        title: "Ambient Soundscape for Focus",
        description: "A carefully crafted soundscape to enhance your concentration during work sessions",
        duration: "5:22",
        likes: 432,
        plays: 8735,
        shares: 67,
        timestamp: "2 days ago",
        likedBy: [],
        tags: ["ambient", "focus", "productivity"],
        category: "music",
    },
    {
        id: "5",
        user: {
            name: "Sophia Kim",
            avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
            username: "@sophia_asmr",
            bio: "ASMR creator specializing in soft-spoken role plays and ambient sounds for sleep and relaxation.",
            location: "Chicago, IL",
            followers: 28500,
            following: 215,
            memberSince: "November 2019",
            social: {
                twitter: "sophia_asmr",
                instagram: "sophia.sounds",
            },
        },
        audioUrl: "https://raw.githubusercontent.com/Ksotillo/wmp-wep-app/main/public/audio/track1.mp3",
        title: "Gentle Rain ASMR",
        description: "Calming rain sounds with gentle tapping to help you relax and fall asleep",
        duration: "8:15",
        likes: 857,
        plays: 15642,
        shares: 124,
        timestamp: "3 days ago",
        likedBy: [],
        tags: ["sleep", "relaxation", "rain"],
        category: "asmr",
    },
    {
        id: "6",
        user: {
            name: "David Mitchell",
            avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
            username: "@david_stories",
            bio: "Storyteller and narrative designer. I create short audio stories that transport you to different worlds.",
            location: "Austin, TX",
            followers: 9720,
            following: 341,
            memberSince: "February 2021",
            social: {
                twitter: "davidstories",
                instagram: "david.tales",
            },
        },
        audioUrl: "https://assets.mixkit.co/music/preview/mixkit-mystery-chime-01-606.mp3",
        title: "The Lost Library",
        description: "A short story about a mysterious library that appears only at midnight",
        duration: "4:36",
        likes: 312,
        plays: 4231,
        shares: 87,
        timestamp: "4 days ago",
        likedBy: [],
        tags: ["fiction", "mystery", "storytelling"],
        category: "story",
    },
];

const trendingTopics: TrendingTopic[] = [
    { id: 1, name: "Sound Design", count: 4218, category: "music" },
    { id: 2, name: "Podcast Tips", count: 3856, category: "podcast" },
    { id: 3, name: "Music Production", count: 2945, category: "music" },
    { id: 4, name: "Voice Acting", count: 2674, category: "story" },
    { id: 5, name: "ASMR", count: 2103, category: "asmr" },
];

const suggestedUsers = [
    {
        id: "u1",
        name: "Sarah Johnson",
        username: "@sarahj_audio",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        stories: 24,
        followers: 12400,
        category: "podcast",
        bio: "Podcast host and audio enthusiast. I cover tech, culture, and everything in between.",
        location: "New York, NY",
        following: 342,
        memberSince: "Jan 2022",
        social: {
            twitter: "sarahj_audio",
            instagram: "sarahj.podcasts"
        }
    },
    {
        id: "u2",
        name: "David Chen",
        username: "@david_speaks",
        avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        stories: 47,
        followers: 8700,
        category: "story",
        bio: "Voice actor and storyteller. I narrate audiobooks and create immersive stories.",
        location: "Los Angeles, CA",
        following: 253,
        memberSince: "Mar 2022",
        social: {
            twitter: "david_speaks",
            instagram: "david.stories"
        }
    },
    {
        id: "u3",
        name: "Maya Patel",
        username: "@maya_sounds",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        stories: 18,
        followers: 5200,
        category: "asmr",
        bio: "ASMR artist specializing in nature sounds and calming triggers.",
        location: "Seattle, WA",
        following: 187,
        memberSince: "May 2022",
        social: {
            twitter: "maya_sounds",
            instagram: "maya.asmr"
        }
    }
];

const initialActivity: Activity[] = [
    {
        id: "1",
        user: "Zaara Zabeen",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW4lMjBwb3J0cmFpdHxlbnwwfHwwfHx8MA%3D%3D",
        action: "liked your story",
        story: "Late Night Thoughts",
        time: "5m ago",
        category: "like",
        read: false,
    },
    {
        id: "a2",
        user: "Lisa Whitley",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        action: "followed you",
        time: "18m ago",
        category: "podcast",
        read: false,
    },
    {
        id: "a3",
        user: "Mark Zhang",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        action: "shared your story",
        story: "Late Night Thoughts About Design",
        time: "1h ago",
        category: "podcast",
        read: false,
    },
];

const additionalNotifications = [
    {
        id: "a4",
        user: "Rachel Brooks",
        avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        action: "mentioned you in a comment",
        time: "Yesterday",
        category: "asmr",
        read: false,
    },
    {
        id: "a5",
        user: "Thomas Garcia",
        avatar: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        action: "replied to your comment",
        story: "Ambient Soundscape for Focus",
        time: "2 days ago",
        category: "music",
        read: true,
    },
    {
        id: "a6",
        user: "Emily Tanaka",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        action: "started following you",
        time: "3 days ago",
        category: "podcast",
        read: true,
    },
];

interface AudioElementWithContext extends HTMLAudioElement {
    context?: AudioContext;
    analyser?: AnalyserNode;
    source?: MediaElementAudioSourceNode;
}

const CustomAlert = ({ isOpen, message, type = "info", onClose }: AlertConfig & { onClose?: () => void }) => {
    useEffect(() => {
        if (isOpen && onClose) {
            const timer = setTimeout(() => {
                onClose();
            }, 2500);
            
            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 right-0 z-[100] flex justify-center p-4"
        >
            <div
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg ${
                    type === "success"
                        ? "bg-green-800/90"
                        : type === "error"
                        ? "bg-red-800/90"
                        : type === "warning"
                        ? "bg-yellow-800/90"
                        : "bg-slate-800/90"
                }`}
            >
                {type === "success" ? (
                    <Check size={18} className="text-green-300" />
                ) : type === "error" ? (
                    <AlertCircle size={18} className="text-red-300" />
                ) : type === "warning" ? (
                    <Info size={18} className="text-yellow-300" />
                ) : (
                    <Info size={18} className="text-blue-300" />
                )}
                <p className="text-white text-sm">{message}</p>
                {onClose && (
                    <button className="text-gray-400 hover:text-white transition-colors" onClick={onClose}>
                        <X size={16} />
                    </button>
                )}
            </div>
        </motion.div>
    );
};

interface ChatBoxProps {
    user: User;
    isOpen: boolean;
    onClose: () => void;
}

const ChatBox = ({ user, isOpen, onClose }: ChatBoxProps) => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = () => {
        if (message.trim()) {
            setMessages([...messages, { text: message, sender: "you", time: "Just now" }]);
            setMessage("");

            setTimeout(() => {
                setMessages((prev) => [
                    ...prev,
                    {
                        text: `Thanks for reaching out! This is a demo message from ${user.name}.`,
                        sender: user.name,
                        time: "Just now",
                    },
                ]);
            }, 1500);
        }
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
            className="fixed bottom-4 right-4 z-50 bg-slate-800 border border-slate-700 rounded-lg shadow-lg w-80 h-96 flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="flex items-center justify-between p-3 border-b border-slate-700 bg-slate-900">
                <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full overflow-hidden">
                        <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-white">{user.name}</h3>
                        <p className="text-xs text-gray-400">{user.username}</p>
                    </div>
                </div>
                <button className="text-gray-400 hover:text-white transition-colors cursor-pointer" onClick={(e) => { e.stopPropagation(); onClose(); }}>
                    <X size={16} />
                </button>
            </div>

            <div className="flex-grow p-3 overflow-y-auto space-y-3">
                {messages.length === 0 ? (
                    <div className="text-center text-sm text-gray-400 mt-10">
                        <p>Start a conversation with {user.name}</p>
                    </div>
                ) : (
                    messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.sender === "you" ? "justify-end" : "justify-start"}`}>
                            <div
                                className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                                    msg.sender === "you" ? "bg-indigo-600 text-white" : "bg-slate-700 text-gray-200"
                                }`}
                            >
                                <p>{msg.text}</p>
                                <p className="text-xs opacity-70 mt-1">{msg.time}</p>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-slate-700">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-grow px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <button
                        onClick={sendMessage}
                        className="p-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                        disabled={!message.trim()}
                    >
                        <Send size={18} className="text-white" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

interface AudioVisualizerProps {
    audioElement: AudioElementWithContext | null;
    isPlaying: boolean;
    color?: string;
    accentColor?: string;
    height?: number;
    isRecording?: boolean;
}

const AudioVisualizer = ({
    audioElement,
    isPlaying,
    color = colors.primary,
    accentColor = colors.secondary,
    height = 80,
    isRecording = false,
}: AudioVisualizerProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number | undefined>(undefined);
    const [isInitialized, setIsInitialized] = useState(false);
    const contextSetupAttempted = useRef<Set<string>>(new Set());

    
    useEffect(() => {
        console.log("AudioVisualizer state:", { isPlaying, isRecording, hasAudioElement: !!audioElement });
        if (audioElement) {
            console.log("Audio element details:", {
                readyState: audioElement.readyState,
                src: audioElement.src,
                hasContext: !!audioElement.context,
                contextState: audioElement.context?.state,
            });
        }
    }, [audioElement, isPlaying, isRecording]);

    useEffect(() => {
        if (!audioElement && !isRecording) return;

        const setupAudio = async () => {
            try {
                if (audioElement) {
                    
                    const audioId = audioElement.src || 'unknown-audio';
                    
                    
                    if (!contextSetupAttempted.current.has(audioId) && !audioElement.context) {
                        console.log("Setting up new audio context for:", audioId);
                        contextSetupAttempted.current.add(audioId);
                        
                        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
                        audioElement.context = new AudioContext();
                        audioElement.analyser = audioElement.context.createAnalyser();
                        audioElement.analyser.fftSize = 512;
                        audioElement.analyser.smoothingTimeConstant = 0.85;
                        
                        try {
                            
                            audioElement.crossOrigin = "anonymous";
                            audioElement.source = audioElement.context.createMediaElementSource(audioElement);
                            audioElement.source.connect(audioElement.analyser);
                            audioElement.analyser.connect(audioElement.context.destination);
                            console.log("Audio context setup successful for:", audioId);
                            setIsInitialized(true);
                        } catch (sourceError) {
                            console.error("Error creating media source:", sourceError);
                            
                            audioElement.context = undefined;
                            audioElement.analyser = undefined;
                            audioElement.source = undefined;
                        }
                    } else if (audioElement.context && audioElement.context.state === "suspended") {
                        console.log("Resuming suspended audio context");
                        await audioElement.context.resume();
                    }
                }
            } catch (error) {
                console.error("Error setting up audio context:", error);
            }
        };

        setupAudio();

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }

            
            
            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
            }
        };
    }, [audioElement, isRecording]);

    
    useEffect(() => {
        if ((!isPlaying && !isRecording) || 
            (!audioElement?.analyser && !isRecording) || 
            !canvasRef.current) {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);

                const canvas = canvasRef.current;
                if (canvas) {
                    const ctx = canvas.getContext("2d");
                    if (ctx) {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                    }
                }
            }
            return;
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resizeCanvas = () => {
            const width = canvas.offsetWidth;
            canvas.width = width * window.devicePixelRatio;
            canvas.height = height * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        let recordingOffset = 0;
        const generateRecordingData = () => {
            const data = new Uint8Array(64);
            for (let i = 0; i < 64; i++) {
                const wave = Math.sin((i + recordingOffset) * 0.2) * 0.5 + 0.5;
                data[i] = Math.floor((wave * 0.7 + Math.random() * 0.3) * 255);
            }
            recordingOffset += 0.2;
            return data;
        };

        
        const bufferLength = isRecording || !audioElement?.analyser ? 64 : (audioElement.analyser.frequencyBinCount || 0);
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            animationFrameRef.current = requestAnimationFrame(draw);

            if (isRecording) {
                dataArray.set(generateRecordingData());
            } else if (audioElement?.analyser) {
                try {
                    audioElement.analyser.getByteFrequencyData(dataArray);
                } catch (e) {
                    console.error("Error getting audio data:", e);
                    
                    dataArray.set(generateRecordingData());
                }
            } else {
                
                dataArray.set(generateRecordingData());
            }

            const width = canvas.offsetWidth;
            ctx.clearRect(0, 0, width, height);

            const barSpacing = 1.5;
            const barCount = Math.min(bufferLength / 2, 60);
            const barWidth = width / barCount - barSpacing;

            const centerY = height / 2;
            const maxBarHeight = height / 2 - 4;

            
            const createBarColor = () => {
                return isRecording ? colors.accent : color;
            };

            
            ctx.beginPath();
            ctx.strokeStyle = isRecording ? `${colors.accent}50` : `${color}50`;
            ctx.lineWidth = 1;
            ctx.moveTo(0, centerY);
            ctx.lineTo(width, centerY);
            ctx.stroke();

            for (let i = 0; i < barCount; i++) {
                const value = dataArray[i * 2];
                const percent = value / 255;

                const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
                const smoothedPercent = easeInOut(percent);

                const barHeight = Math.max(3, smoothedPercent * maxBarHeight);

                const barX = i * (barWidth + barSpacing);
                
                
                const topY = centerY - barHeight;
                ctx.beginPath();
                ctx.roundRect(barX, topY, barWidth, barHeight, [barWidth / 2, barWidth / 2, 0, 0]);
                ctx.fillStyle = createBarColor();
                ctx.fill();

                if (percent > 0.5) {
                    ctx.shadowColor = isRecording ? colors.accent : color;
                    ctx.shadowBlur = 10;
                    ctx.fillRect(barX, topY, barWidth, 2);
                    ctx.shadowBlur = 0;
                }

                
                ctx.beginPath();
                ctx.roundRect(barX, centerY, barWidth, barHeight, [0, 0, barWidth / 2, barWidth / 2]);
                ctx.fillStyle = createBarColor();
                ctx.fill();

                if (percent > 0.5) {
                    ctx.shadowColor = isRecording ? colors.accent : color;
                    ctx.shadowBlur = 10;
                    ctx.fillRect(barX, centerY + barHeight - 2, barWidth, 2);
                    ctx.shadowBlur = 0;
                }
            }
        };

        draw();

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            window.removeEventListener("resize", resizeCanvas);
        };
    }, [audioElement, isPlaying, isRecording, color, accentColor, height]);

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ height: `${height}px` }}
        />
    );
};

interface VolumeControlProps {
    audioElement: HTMLAudioElement | null;
}

const VolumeControl = ({ audioElement }: VolumeControlProps) => {
    const [volume, setVolume] = useState(1);
    const [showVolume, setShowVolume] = useState(false);

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioElement) {
            audioElement.volume = newVolume;
        }
    };

    return (
        <div className="relative">
            <button className="p-2 text-gray-400 hover:text-white transition-colors" onClick={() => setShowVolume(!showVolume)}>
                <Volume2 size={18} />
            </button>

            {showVolume && (
                <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.4 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-800 p-2 rounded-lg shadow-lg z-20"
                >
                    <div className="h-16 flex flex-col justify-center items-center">
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="h-16 w-6 accent-blue-500"
                            style={{
                                WebkitAppearance: "slider-vertical"
                            }}
                        />
                    </div>
                </motion.div>
            )}
        </div>
    );
};

interface ProgressBarProps {
    audioElement: HTMLAudioElement | null;
    duration: number;
    isPlaying: boolean;
}

const ProgressBar = ({ audioElement, duration, isPlaying }: ProgressBarProps) => {
    const [progress, setProgress] = useState(0);
    const progressRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!audioElement) return;

        const updateProgress = () => {
            if (audioElement.duration) {
                setProgress(audioElement.currentTime / audioElement.duration);
            }
        };

        audioElement.addEventListener("timeupdate", updateProgress);
        return () => {
            audioElement.removeEventListener("timeupdate", updateProgress);
        };
    }, [audioElement]);

    const handleSeek = (e: React.MouseEvent) => {
        if (!audioElement || !progressRef.current) return;

        const rect = progressRef.current.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        const seekTime = pos * audioElement.duration;

        if (!isNaN(seekTime)) {
            audioElement.currentTime = seekTime;
            setProgress(pos);
        }
    };

    const formatTime = (seconds: number) => {
        if (!seconds || isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="w-full space-y-1">
            <div ref={progressRef} className="h-1.5 bg-gray-700 rounded-full cursor-pointer overflow-hidden" onClick={handleSeek}>
                <motion.div
                    className="h-full rounded-full"
                    style={{
                        width: `${progress * 100}%`,
                        backgroundColor: isPlaying ? colors.primary : colors.secondary,
                    }}
                    animate={{
                        boxShadow: isPlaying ? "0 0 8px rgba(99, 102, 241, 0.6)" : "none",
                    }}
                    transition={{ duration: 0.5 }}
                ></motion.div>
            </div>

            <div className="flex justify-between text-xs text-gray-400">
                <span>{audioElement ? formatTime(audioElement.currentTime) : "0:00"}</span>
                <span>{audioElement && audioElement.duration ? formatTime(audioElement.duration) : duration || "0:00"}</span>
            </div>
        </div>
    );
};

interface ProfileModalProps {
    user: User;
    isOpen: boolean;
    onClose: () => void;
    onFollow: (userId: string) => void;
    followedUsers: string[];
}

const ProfileModal = ({ user, isOpen, onClose, onFollow, followedUsers }: ProfileModalProps) => {
    const [chatOpen, setChatOpen] = useState(false);

    if (!isOpen || !user) return null;

    const isFollowing = followedUsers?.includes(user.id || "");
    const isCurrentUser = user.id === "current_user";

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 10 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-lg bg-slate-800 rounded-xl shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative flex justify-between items-center p-4 border-b border-gray-700">
                    <h3 className="text-lg font-medium text-white">Profile</h3>
                    <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-700/50 transition-colors">
                        <X size={20} className="text-gray-300" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex items-start gap-5">
                        <div className="w-24 h-24 rounded-full bg-slate-700 overflow-hidden border-2 border-indigo-500/30">
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        </div>

                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-white">{user.name}</h2>
                            <p className="text-indigo-300">{user.username}</p>

                            {user.bio && <p className="mt-2 text-gray-300 text-sm">{user.bio}</p>}

                            <div className="flex items-center mt-2 text-sm text-gray-400">
                                <MapPin size={14} className="mr-1" />
                                <span>{user.location || "Unknown location"}</span>
                            </div>

                            <div className="flex gap-4 mt-4">
                                <div className="text-center">
                                    <div className="text-white font-bold">
                                        {formatFollowerCount(user.followers)} followers
                                    </div>
                                    <div className="text-xs text-gray-400">Followers</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-white font-bold">
                                        {typeof user.following === "number" ? user.following.toLocaleString() : user.following || "0"}
                                    </div>
                                    <div className="text-xs text-gray-400">Following</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-white font-bold">{user.stories || "0"}</div>
                                    <div className="text-xs text-gray-400">Stories</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {user.social && (
                        <div className="mt-6 p-4 bg-slate-700/50 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-300 mb-3">Connect with {user.name.split(" ")[0]}</h4>
                            <div className="flex gap-3">
                                {user.social.twitter && (
                                    <a
                                        href={`https://twitter.com/${user.social.twitter}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 text-sm text-indigo-300 hover:text-indigo-200 transition-colors"
                                    >
                                        <Twitter size={16} />
                                        <span>@{user.social.twitter}</span>
                                    </a>
                                )}
                                {user.social.instagram && (
                                    <a
                                        href={`https://instagram.com/${user.social.instagram}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 text-sm text-indigo-300 hover:text-indigo-200 transition-colors"
                                    >
                                        <Instagram size={16} />
                                        <span>@{user.social.instagram}</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    )}

                    {user.memberSince && (
                        <div className="mt-6 text-sm text-gray-400">
                            <span>Member since {user.memberSince}</span>
                        </div>
                    )}

                    {!isCurrentUser && (
                        <div className="mt-6 flex gap-3">
                            <button
                                className={`flex-1 py-2.5 px-4 ${
                                    isFollowing ? "bg-slate-700 hover:bg-slate-600" : "bg-indigo-600 hover:bg-indigo-700"
                                } text-white font-medium rounded-lg transition-colors duration-300 cursor-pointer`}
                                onClick={() => onFollow && onFollow(user.id || "")}
                            >
                                {isFollowing ? "Unfollow" : "Follow"}
                            </button>
                            <button
                                className="py-2.5 px-4 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-300 cursor-pointer"
                                onClick={() => setChatOpen(true)}
                            >
                                Message
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>

            <AnimatePresence>{chatOpen && <ChatBox user={user} isOpen={chatOpen} onClose={() => setChatOpen(false)} />}</AnimatePresence>
        </motion.div>
    );
};

interface RecordingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (recordingData: RecordingData) => void;
}

const RecordingModal = ({ isOpen, onClose, onSave }: RecordingModalProps) => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("podcast");
    const [modalAlertConfig, setModalAlertConfig] = useState<AlertConfig>({
        isOpen: false,
        message: "",
        type: "info"
    });
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<BlobPart[]>([]);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const availableTags = ["music", "podcast", "interview", "story", "tutorial", "thoughts", "ambient", "discussion"];

    
    const closeModalAlert = () => {
        setModalAlertConfig({
            ...modalAlertConfig,
            isOpen: false
        });
    };

    useEffect(() => {
        if (isRecording) {
            timerRef.current = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);
        } else if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isRecording]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const options = { mimeType: "audio/webm" };
            mediaRecorderRef.current = new MediaRecorder(stream, options);

            mediaRecorderRef.current.addEventListener("dataavailable", (e) => {
                chunksRef.current.push(e.data);
            });

            mediaRecorderRef.current.addEventListener("stop", () => {
                const blob = new Blob(chunksRef.current, { type: "audio/webm" });
                setAudioBlob(blob);
                setAudioUrl(URL.createObjectURL(blob));
                chunksRef.current = [];
            });

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setRecordingTime(0);
        } catch (err) {
            console.error("Error accessing microphone:", err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);

            if (mediaRecorderRef.current.stream) {
                mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
            }
        }
    };


    const togglePlayback = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter((t) => t !== tag));
        } else if (selectedTags.length < 3) {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const handleSubmit = () => {
        if (audioBlob && title) {
            onSave({
                title,
                description: description || '',
                audioBlob,
                audioUrl: audioUrl || '',
                tags: selectedTags,
                category: selectedCategory,
                duration: 0,
            });

            setAudioBlob(null);
            setAudioUrl(null);
            setTitle("");
            setDescription("");
            setSelectedTags([]);
            setSelectedCategory("podcast");
            setRecordingTime(0);
            onClose();
        }
    };

    const handleClose = () => {
        if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
        }
        setAudioBlob(null);
        setAudioUrl(null);
        setTitle("");
        setDescription("");
        setSelectedTags([]);
        setSelectedCategory("podcast");
        setRecordingTime(0);
        setIsPlaying(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={handleClose}
        >
            <AnimatePresence>
                {modalAlertConfig.isOpen && (
                    <CustomAlert 
                        isOpen={modalAlertConfig.isOpen} 
                        message={modalAlertConfig.message} 
                        type={modalAlertConfig.type} 
                        onClose={closeModalAlert} 
                    />
                )}
            </AnimatePresence>
            
            <motion.div
                initial={{ scale: 0.95, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 10 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-xl bg-slate-800 rounded-xl shadow-2xl border border-slate-700/50"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="border-b border-slate-700 px-5 py-4 flex items-center justify-between">
                    <h3 className="text-xl font-medium text-white">Share Your Story</h3>
                    <button onClick={handleClose} className="p-1.5 rounded-full hover:bg-gray-700/50 transition-colors">
                        <X size={18} className="text-gray-300" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex gap-5">
                        <div className="w-1/3 flex flex-col items-center">
                            <div
                                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 ${
                                    isRecording
                                        ? "bg-red-500/10 border-2 border-red-500/50"
                                        : audioBlob
                                        ? "bg-indigo-500/10 border-2 border-indigo-500/50"
                                        : "bg-gray-800"
                                }`}
                            >
                                {audioBlob ? (
                                    <div className="text-center">
                                        <div className="text-xl font-semibold text-white">{formatTime(recordingTime)}</div>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        {isRecording ? (
                                            <>
                                                <div
                                                    className="w-3 h-3 rounded-full bg-red-500 mx-auto mb-1"
                                                    style={{
                                                        animation: "pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                                                    }}
                                                ></div>
                                                <div className="text-lg font-semibold text-white">{formatTime(recordingTime)}</div>
                                            </>
                                        ) : (
                                            <Mic size={32} className="text-indigo-300 opacity-80" />
                                        )}
                                    </div>
                                )}
                            </div>

                            {audioUrl && (
                                <div className="mt-3">
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={togglePlayback}
                                        className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg bg-indigo-600"
                                        transition={{ duration: 0.4 }}
                                    >
                                        {isPlaying ? (
                                            <Pause size={16} color="white" />
                                        ) : (
                                            <Play size={16} color="white" className="ml-0.5" />
                                        )}
                                    </motion.button>
                                    <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} className="hidden" />
                                </div>
                            )}

                            <div className="mt-3">
                                {!isRecording && !audioBlob ? (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={startRecording}
                                        className="px-3 py-2 text-white rounded-lg shadow-lg flex items-center space-x-1 bg-indigo-600 text-sm"
                                        transition={{ duration: 0.4 }}
                                    >
                                        <Mic size={14} />
                                        <span>Record</span>
                                    </motion.button>
                                ) : isRecording ? (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={stopRecording}
                                        className="px-3 py-2 text-white rounded-lg shadow-lg flex items-center space-x-1 bg-red-600 text-sm"
                                        transition={{ duration: 0.4 }}
                                    >
                                        <span className="h-2 w-2 bg-white rounded"></span>
                                        <span>Stop</span>
                                    </motion.button>
                                ) : (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => {
                                            setAudioBlob(null);
                                            setAudioUrl(null);
                                            startRecording();
                                        }}
                                        className="px-3 py-2 bg-slate-700 text-white rounded-lg text-sm hover:bg-slate-600 transition-colors duration-300"
                                        transition={{ duration: 0.4 }}
                                    >
                                        Record Again
                                    </motion.button>
                                )}
                            </div>
                        </div>

                        <div className="w-2/3">
                            <div className="h-12 mb-3 rounded-lg overflow-hidden bg-slate-900/60 border border-slate-700/30">
                                <AudioVisualizer
                                    audioElement={audioRef.current}
                                    isPlaying={isPlaying}
                                    isRecording={isRecording}
                                    color={colors.primary}
                                    accentColor={colors.secondary}
                                    height={48}
                                />
                            </div>

                            {audioBlob ? (
                                <div className="space-y-2">
                                    <div className="flex gap-3">
                                        <div className="flex-1">
                                            <label className="block text-xs font-medium mb-1 text-gray-300">Title</label>
                                            <input
                                                type="text"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                className="w-full px-3 py-1.5 rounded-lg text-white bg-slate-900 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 text-sm"
                                                placeholder="Story title"
                                            />
                                        </div>

                                        <div className="w-2/5 relative">
                                            <label className="block text-xs font-medium mb-1 text-gray-300">Category</label>
                                            <div className="relative">
                                                <select
                                                    value={selectedCategory}
                                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                                    className="w-full px-3 py-1.5 rounded-lg text-white bg-slate-900 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 text-sm appearance-none pr-8"
                                                >
                                                    {categories
                                                        .filter((c) => c.id !== "all")
                                                        .map((category) => (
                                                            <option key={category.id} value={category.id}>
                                                                {category.name}
                                                            </option>
                                                        ))}
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                                                    <svg
                                                        className="w-4 h-4 fill-current"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium mb-1 text-gray-300">Description (Optional)</label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="w-full px-3 py-1.5 rounded-lg text-white bg-slate-900 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 resize-none text-sm"
                                            placeholder="Short description"
                                            rows={1}
                                        ></textarea>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium mb-1 text-gray-300">Tags (up to 3)</label>
                                        <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full">
                                            {availableTags.map((tag) => (
                                                <button
                                                    key={tag}
                                                    onClick={() => toggleTag(tag)}
                                                    className={`px-2 py-1 rounded-full text-xs whitespace-nowrap transition-all ${
                                                        selectedTags.includes(tag)
                                                            ? "bg-indigo-600 text-white font-medium"
                                                            : "bg-slate-900 text-gray-300 hover:bg-slate-700"
                                                    }`}
                                                >
                                                    #{tag}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-3 flex justify-end">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleSubmit}
                                            disabled={!title}
                                            className={`px-4 py-1.5 text-white rounded-lg shadow-lg ${
                                                title ? "bg-green-600 hover:bg-green-700" : "bg-slate-600 opacity-60"
                                            } transition-colors duration-300 text-sm`}
                                            transition={{ duration: 0.4 }}
                                        >
                                            Share Story
                                        </motion.button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-40 text-center text-gray-400 text-sm">
                                    <div>
                                        <p>Start recording to share your story</p>
                                        <p className="text-xs mt-1 opacity-70">Audio stories can be up to 5 minutes long</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

interface SidebarNavProps {
    activeCategory: string;
    setActiveCategory: (category: string) => void;
    setActiveView: (view: string) => void;
    activeView: string;
}

const SidebarNav = ({ activeCategory, setActiveCategory, setActiveView, activeView }: SidebarNavProps) => {
    return (
        <div className="w-full h-full flex flex-col py-4">
            <div className="space-y-2 px-4 mb-8">
                <div className="text-lg font-semibold text-gray-300 mb-4 ml-2">Menu</div>
                <button
                    onClick={() => setActiveView("home")}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors duration-300 ${
                        activeView === "home" 
                            ? "bg-indigo-500/10 text-indigo-300 font-medium" 
                            : "text-gray-300 hover:bg-gray-800/50"
                    }`}
                >
                    <Home size={18} />
                    <span>Home</span>
                </button>
                <button
                    onClick={() => setActiveView("trending")}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors duration-300 ${
                        activeView === "trending" 
                            ? "bg-indigo-500/10 text-indigo-300 font-medium" 
                            : "text-gray-300 hover:bg-gray-800/50"
                    }`}
                >
                    <TrendingUp size={18} />
                    <span>Trending</span>
                </button>
                <button
                    onClick={() => setActiveView("explore")}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors duration-300 ${
                        activeView === "explore" 
                            ? "bg-indigo-500/10 text-indigo-300 font-medium" 
                            : "text-gray-300 hover:bg-gray-800/50"
                    }`}
                >
                    <Hash size={18} />
                    <span>Explore</span>
                </button>
                <button
                    onClick={() => setActiveView("library")}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors duration-300 ${
                        activeView === "library" 
                            ? "bg-indigo-500/10 text-indigo-300 font-medium" 
                            : "text-gray-300 hover:bg-gray-800/50"
                    }`}
                >
                    <Headphones size={18} />
                    <span>My Library</span>
                </button>
                <button
                    onClick={() => setActiveView("notifications")}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors duration-300 ${
                        activeView === "notifications" 
                            ? "bg-indigo-500/10 text-indigo-300 font-medium" 
                            : "text-gray-300 hover:bg-gray-800/50"
                    }`}
                >
                    <Bell size={18} />
                    <span>Notifications</span>
                </button>
            </div>

            <div className="px-4 mb-6">
                <div className="text-lg font-semibold text-gray-300 mb-4 ml-2">Categories</div>
                <div className="space-y-2">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors duration-300 cursor-pointer ${
                                activeCategory === category.id
                                    ? "bg-indigo-500/10 text-indigo-300 font-medium"
                                    : "text-gray-300 hover:bg-gray-800/50"
                            }`}
                        >
                            {category.icon}
                            <span>{category.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-auto px-4 py-4">
                <div className="p-4 rounded-xl bg-slate-700/30 text-center border border-slate-600/30">
                    <h4 className="font-medium text-white mb-2">Share Your Voice</h4>
                    <p className="text-sm text-gray-300 mb-3">Recording and sharing your stories helps build our community.</p>
                    <button className="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors duration-300 cursor-pointer">
                        Learn More
                    </button>
                </div>
            </div>
        </div>
    );
};

interface ActivitySidebarProps {
    onTopicSelect: (topic: TrendingTopic) => void;
    onUserSelect: (user: User) => void;
    onActivityClick: (activity: Activity) => void;
    followedUsers: string[];
    onFollow: (userId: string) => void;
}

const ActivitySidebar = ({ onTopicSelect, onUserSelect, onActivityClick, followedUsers, onFollow }: ActivitySidebarProps) => {
    return (
        <div className="w-full h-full px-4 py-5">
            <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Trending Topics</h3>
                <div className="space-y-3">
                    {trendingTopics.map((topic) => (
                        <button
                            key={topic.id}
                            onClick={() => onTopicSelect(topic)}
                            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-800/40 transition-colors duration-300 cursor-pointer"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="w-1.5 h-8 bg-indigo-500 rounded-full"></div>
                                <span className="text-gray-200">{topic.name}</span>
                            </div>
                            <span className="text-sm text-gray-400">{topic.count.toLocaleString()} stories</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Suggested Creators</h3>
                <div className="space-y-4">
                    {suggestedUsers.map((user) => (
                        <div
                            key={user.id}
                            className="w-full flex items-center p-3 rounded-lg hover:bg-gray-800/40 transition-colors duration-300 cursor-pointer"
                        >
                            <div
                                className="h-10 w-10 rounded-full overflow-hidden mr-3 ring-2 ring-indigo-500/30 cursor-pointer"
                                onClick={() => onUserSelect(user)}
                            >
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-grow min-w-0 text-left cursor-pointer" onClick={() => onUserSelect(user)}>
                                <div className="text-gray-200 font-medium truncate">{user.name}</div>
                                <div className="text-gray-400 text-sm truncate">{user.username}</div>
                            </div>
                            <button
                                className={`ml-2 px-3 py-1 text-xs font-medium cursor-pointer ${
                                    followedUsers?.includes(user.id)
                                        ? "text-white bg-indigo-700 hover:bg-indigo-800"
                                        : "text-indigo-200 bg-indigo-900/40 hover:bg-indigo-700"
                                } rounded-full transition-colors duration-300`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onFollow(user.id);
                                }}
                            >
                                {followedUsers?.includes(user.id) ? "Following" : "Follow"}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Activity</h3>
                <div className="space-y-3">
                    {initialActivity.map((activity) => (
                        <button
                            key={activity.id}
                            onClick={() => onActivityClick(activity)}
                            className="w-full flex p-3 rounded-lg hover:bg-gray-800/40 transition-colors duration-300 text-left cursor-pointer"
                        >
                            <div className="h-8 w-8 rounded-full overflow-hidden mr-3">
                                <img src={activity.avatar} alt={activity.user} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <div className="text-sm">
                                    <span className="text-gray-200 font-medium">{activity.user}</span>
                                    <span className="text-gray-400"> {activity.action}</span>
                                    {activity.story && <span className="text-indigo-300"> {activity.story}</span>}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">{activity.time}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

interface ViewContentProps {
    activeView: string;
    notifications: any[];
    showAllNotifications: boolean;
    onToggleAllNotifications: () => void;
    onMarkAllAsRead: () => void;
}

const ViewContent = ({ activeView, notifications, showAllNotifications, onToggleAllNotifications, onMarkAllAsRead }: ViewContentProps) => {
    if (activeView === "home") {
        return null;
    }

    if (activeView === "trending") {
        return (
            <div className="bg-slate-800 rounded-xl border border-slate-700/50 shadow-lg p-6 mb-8">
                <h2 className="text-xl font-bold text-white mb-4">Trending This Week</h2>
                <div className="space-y-4">
                    {trendingTopics.map((topic) => (
                        <div key={topic.id} className="flex items-center justify-between p-2 border-b border-slate-700/50">
                            <div className="flex items-center gap-3">
                                <span className="text-indigo-400 text-lg font-semibold">#{topic.name}</span>
                                <span className="text-sm text-gray-400">{topic.count.toLocaleString()} stories</span>
                            </div>
                            <button className="text-sm bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded-full transition-colors duration-300 cursor-pointer">
                                Explore
                            </button>
                        </div>
                    ))}
                </div>
                <button className="mt-4 text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors duration-300 cursor-pointer">
                    View all trending topics →
                </button>
            </div>
        );
    }

    if (activeView === "explore") {
        return (
            <div className="bg-slate-800 rounded-xl border border-slate-700/50 shadow-lg p-6 mb-8">
                <h2 className="text-xl font-bold text-white mb-4">Explore</h2>
                <div className="mb-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search for topics, creators, or stories..."
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white"
                        />
                        <Search size={18} className="absolute left-3 top-3.5 text-gray-400" />
                        <button className="absolute right-3 top-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-sm transition-colors duration-300 cursor-pointer">
                            Search
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                        <h3 className="text-lg font-semibold text-white mb-2">Popular Categories</h3>
                        <div className="space-y-2">
                            {categories
                                .filter((c) => c.id !== "all")
                                .map((category) => (
                                    <button
                                        key={category.id}
                                        className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer"
                                    >
                                        <div className="w-8 h-8 bg-indigo-600/20 rounded-md flex items-center justify-center text-indigo-400">
                                            {category.icon}
                                        </div>
                                        <span>{category.name}</span>
                                    </button>
                                ))}
                        </div>
                    </div>

                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                        <h3 className="text-lg font-semibold text-white mb-2">For You</h3>
                        <p className="text-gray-400 text-sm mb-3">Based on your listening history</p>
                        <div className="space-y-2">
                            <div className="flex gap-2 items-center">
                                <div className="w-8 h-8 bg-green-600/20 rounded-md flex items-center justify-center text-green-400">
                                    <Music size={16} />
                                </div>
                                <span className="text-gray-300">Ambient Sound Design</span>
                            </div>
                            <div className="flex gap-2 items-center">
                                <div className="w-8 h-8 bg-purple-600/20 rounded-md flex items-center justify-center text-purple-400">
                                    <Headphones size={16} />
                                </div>
                                <span className="text-gray-300">Tech Discussions</span>
                            </div>
                            <div className="flex gap-2 items-center">
                                <div className="w-8 h-8 bg-blue-600/20 rounded-md flex items-center justify-center text-blue-400">
                                    <BookOpen size={16} />
                                </div>
                                <span className="text-gray-300">Design Podcasts</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (activeView === "library") {
        return (
            <div className="bg-slate-800 rounded-xl border border-slate-700/50 shadow-lg p-6 mb-8">
                <h2 className="text-xl font-bold text-white mb-4">My Library</h2>
                <div className="mb-6">
                    <div className="flex space-x-2 border-b border-slate-700">
                        <button className="px-4 py-2 text-white font-medium border-b-2 border-indigo-500 cursor-pointer">Saved</button>
                        <button className="px-4 py-2 text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer">History</button>
                        <button className="px-4 py-2 text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer">Downloads</button>
                    </div>
                </div>

                <div className="text-center py-10">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-700 flex items-center justify-center">
                        <Bookmark size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">No saved stories yet</h3>
                    <p className="text-gray-400 max-w-sm mx-auto mb-4">When you save stories they'll appear here for easy access</p>
                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-300 cursor-pointer">
                        Browse Stories
                    </button>
                </div>
            </div>
        );
    }

    if (activeView === "notifications") {
        const notificationsToShow = showAllNotifications ? [...notifications, ...additionalNotifications] : notifications;

        return (
            <div className="bg-slate-800 rounded-xl border border-slate-700/50 shadow-lg p-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">Notifications</h2>
                    <button
                        className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors duration-300 cursor-pointer"
                        onClick={onMarkAllAsRead}
                    >
                        Mark all as read
                    </button>
                </div>

                <div className="space-y-4">
                    {notificationsToShow.map((activity) => (
                        <div
                            key={activity.id}
                            className={`p-3 rounded-lg border border-slate-700/50 hover:bg-slate-700/30 transition-colors duration-300 ${
                                activity.read ? "opacity-60" : "opacity-100"
                            }`}
                        >
                            <div className="flex items-start">
                                <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                                    <img src={activity.avatar} alt={activity.user} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <div className="text-sm">
                                        <span className="text-white font-medium">{activity.user}</span>
                                        <span className="text-gray-300"> {activity.action}</span>
                                        {activity.story && <span className="text-indigo-300"> {activity.story}</span>}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">{activity.time}</div>
                                </div>
                                {!activity.read && (
                                    <div className="ml-auto">
                                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                    </div>
                                )}
                            </div>
                            {activity.story && (
                                <div className="mt-2 ml-13">
                                    <button className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors duration-300 cursor-pointer">
                                        View story
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <button
                    className="w-full mt-4 py-2 text-center text-indigo-400 hover:text-indigo-300 text-sm transition-colors duration-300 cursor-pointer"
                    onClick={onToggleAllNotifications}
                >
                    {showAllNotifications ? "Show fewer notifications" : "View all notifications"}
                </button>
            </div>
        );
    }

    return null;
};


const formatFollowerCount = (count: number): string => {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return count.toString();
};

export default function AudioStoryPlatform() {
    const [stories, setStories] = useState<Story[]>(initialStories);
    const [activeView, setActiveView] = useState("home");
    const [activeCategory, setActiveCategory] = useState<string>("all");
    const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);
    const [recordingModalOpen, setRecordingModalOpen] = useState(false);
    const [profileModalOpen, setProfileModalOpen] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState<User | null>(null);
    const [followedUsers, setFollowedUsers] = useState<string[]>(["u1"]);
    const [searchQuery, setSearchQuery] = useState("");
    const [alertConfig, setAlertConfig] = useState<AlertConfig>({
        isOpen: false,
        message: "",
        type: "info"
    });
    const [notifications, setNotifications] = useState<Activity[]>(initialActivity);
    const [showAllNotifications, setShowAllNotifications] = useState(false);
    const [chatBoxOpen, setChatBoxOpen] = useState(false);
    const [chatUser, setChatUser] = useState<User | null>(null);
    const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
    const [storyMenuOpen, setStoryMenuOpen] = useState<string | null>(null);

    const audioRefs = useRef<{ [key: string]: AudioElementWithContext }>({});
    const currentUser = "current_user_id";

    
    const filteredStories = stories.filter(
        (story) =>
            (activeCategory === "all" || story.category === activeCategory) &&
            (searchQuery === "" ||
                story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                story.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                story.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                story.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
    );

    const togglePlay = async (storyId: string) => {
        console.log("Toggle play for story:", storyId);
        const audioRef = audioRefs.current[storyId];
        
        if (!audioRef) {
            console.error("Audio element not found for story:", storyId);
            return;
        }

        try {
            console.log("Audio element:", audioRef);
            console.log("Audio readyState:", audioRef.readyState);
            console.log("Current audio URL:", audioRef.src);
            
            
            audioRef.crossOrigin = "anonymous";
            
            
            if (audioRef.readyState === 0) {
                console.log("Loading audio...");
                audioRef.load();
                
                
                await new Promise<void>((resolve) => {
                    const handleCanPlay = () => {
                        console.log("Audio can play now");
                        audioRef.removeEventListener("canplaythrough", handleCanPlay);
                        resolve();
                    };
                    audioRef.addEventListener("canplaythrough", handleCanPlay, { once: true });
                    
                    
                    setTimeout(() => {
                        audioRef.removeEventListener("canplaythrough", handleCanPlay);
                        console.log("Timed out waiting for audio to load, trying to play anyway");
                        resolve();
                    }, 3000);
                });
            }

            if (currentPlaying === storyId) {
                
                console.log("Pausing current story");
                audioRef.pause();
                setCurrentPlaying(null);
            } else {
                
                if (currentPlaying && audioRefs.current[currentPlaying]) {
                    console.log("Stopping currently playing story");
                    audioRefs.current[currentPlaying].pause();
                }

                
                if (!audioRef.context) {
                    console.log("Setting up audio context for the first time");
                    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
                    audioRef.context = new AudioContext();
                    audioRef.analyser = audioRef.context.createAnalyser();
                    audioRef.analyser.fftSize = 512;
                    audioRef.analyser.smoothingTimeConstant = 0.85;
                    audioRef.source = audioRef.context.createMediaElementSource(audioRef);
                    audioRef.source.connect(audioRef.analyser);
                    audioRef.analyser.connect(audioRef.context.destination);
                } else if (audioRef.context.state === "suspended") {
                    console.log("Resuming audio context");
                    await audioRef.context.resume();
                }

                
                console.log("Playing new story");
                try {
                    const playPromise = audioRef.play();
                    if (playPromise !== undefined) {
                        playPromise.then(() => {
                            console.log("Playback started successfully");
                            setCurrentPlaying(storyId);
                        }).catch(error => {
                            console.error("Playback failed:", error);
                            
                            
                            setAlertConfig({
                                isOpen: true,
                                message: "Playback couldn't start automatically. Click again to play.",
                                type: "info"
                            });
                        });
                    } else {
                        console.log("Play returned undefined, setting current playing anyway");
                        setCurrentPlaying(storyId);
                    }
                } catch (error) {
                    console.error("Error playing audio:", error);
                }
            }
        } catch (error) {
            console.error("Audio playback error:", error);
            setAlertConfig({
                isOpen: true,
                message: "Error playing audio. Please try again.",
                type: "error"
            });
        }
    };

    const likeStory = (storyId: string) => {
        setStories(
            stories.map((story) => {
                if (story.id === storyId) {
                    if (!story.likedBy.includes(currentUser)) {
                        return {
                            ...story,
                            likes: story.likes + 1,
                            likedBy: [...story.likedBy, currentUser],
                        };
                    } else {
                        return {
                            ...story,
                            likes: story.likes - 1,
                            likedBy: story.likedBy.filter((id) => id !== currentUser),
                        };
                    }
                }
                return story;
            })
        );
    };

    const shareStory = (storyId: string) => {
        
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            setAlertConfig({
                isOpen: true,
                message: "Story shared successfully! A link has been copied to your clipboard.",
                type: "success",
            });
        }).catch(() => {
            setAlertConfig({
                isOpen: true,
                message: "Could not copy URL to clipboard. Please try again.",
                type: "error",
            });
        });

        setStories(
            stories.map((story) => {
                if (story.id === storyId) {
                    return {
                        ...story,
                        shares: story.shares + 1,
                    };
                }
                return story;
            })
        );
    };

    const handleSaveRecording = (recordingData: RecordingData) => {
        const newStory: Story = {
            id: `new-${Date.now()}`,
            user: {
                id: "current_user_id",
                name: "You",
                avatar: "https://images.unsplash.com/photo-1629747490241-624f07d70e1e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aHVtYW4lMjBwb3J0cmFpdHxlbnwwfHwwfHx8MA%3D%3D",
                username: "@you",
                bio: "Your personal bio would go here.",
                location: "Your Location",
                followers: 123,
                following: 321,
                memberSince: "April 2023",
                social: {
                    twitter: "",
                    instagram: ""
                }
            },
            audioUrl: recordingData.audioUrl,
            title: recordingData.title,
            description: recordingData.description || "Just shared a new story",
            duration: "0:00",
            likes: 0,
            plays: 0,
            shares: 0,
            timestamp: "Just now",
            likedBy: [],
            tags: recordingData.tags || [],
            category: recordingData.category || "podcast"
        };

        setStories([newStory, ...stories]);

        setAlertConfig({
            isOpen: true,
            message: "Your story has been successfully shared!",
            type: "success"
        });
    };

    const handleTopicSelect = (topic: TrendingTopic) => {
        setActiveCategory(topic.category);
    };

    const handleUserSelect = (user: User) => {
        setSelectedProfile(user);
        setProfileModalOpen(true);
    };

    const handleActivityClick = (activity: Activity) => {
        setNotifications(notifications.map((notif) => (notif.id === activity.id ? { ...notif, read: true } : notif)));

        setAlertConfig({
            isOpen: true,
            message: `${activity.user} ${activity.action}`,
            type: "info"
        });
    };

    const toggleFollow = (userId: string) => {
        setFollowedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]));

        const user =
            suggestedUsers.find((u) => u.id === userId) || (selectedProfile && selectedProfile.id === userId ? selectedProfile : null);

        if (user) {
            setAlertConfig({
                isOpen: true,
                message: followedUsers.includes(userId) ? `You unfollowed ${user.name}` : `You are now following ${user.name}`,
                type: followedUsers.includes(userId) ? "info" : "success"
            });
        }
    };

    const openUserProfile = (user: User) => {
        setSelectedProfile(user);
        setProfileModalOpen(true);
    };

    const openChatBox = (user: User) => {
        setChatUser(user);
        setChatBoxOpen(true);
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map((notif) => ({ ...notif, read: true })));

        setAlertConfig({
            isOpen: true,
            message: "All notifications marked as read",
            type: "success",
        });
    };

    const toggleAllNotifications = () => {
        setShowAllNotifications((prev) => !prev);
    };

    const closeAlert = () => {
        setAlertConfig({
            ...alertConfig,
            isOpen: false,
        });
    };

    useEffect(() => {
        const handleClickOutside = () => {
            setNotificationDropdownOpen(false);
        };
        
        if (notificationDropdownOpen) {
            document.addEventListener('click', handleClickOutside);
        }
        
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [notificationDropdownOpen]);

    
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        setAlertConfig({
            isOpen: true,
            message: `Showing results for "${searchQuery}"`,
            type: "info",
        });
    };

    
    useEffect(() => {
        return () => {
            if (currentPlaying && audioRefs.current[currentPlaying]) {
                const audio = audioRefs.current[currentPlaying];
                if (!audio.paused) {
                    audio.pause();
                }
            }
        };
    }, [currentPlaying]);

    
    useEffect(() => {
        
    }, [activeCategory, stories]);

    
    const saveStory = (storyId: string) => {
        setAlertConfig({
            isOpen: true,
            message: "Story saved to your library!",
            type: "success",
        });
        setStoryMenuOpen(null);
    };

    
    const reportStory = (storyId: string) => {
        setAlertConfig({
            isOpen: true,
            message: "Story reported. Thank you for helping keep our community safe.",
            type: "info",
        });
        setStoryMenuOpen(null);
    };

    
    const hideStory = (storyId: string) => {
        setStories(stories.filter(story => story.id !== storyId));
        setAlertConfig({
            isOpen: true,
            message: "Story hidden from your feed.",
            type: "success",
        });
        setStoryMenuOpen(null);
    };

    
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            
            if (storyMenuOpen && !(e.target as Element).closest('.story-menu-container')) {
                setStoryMenuOpen(null);
            }
        };
        
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [storyMenuOpen]);

    return (
        <div
            style={{
                backgroundColor: colors.background,
            }}
            className="min-h-screen text-white"
        >
            <style jsx global>{`
                body {
                    font-family: "Inter", "Poppins", sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: ${colors.background};
                    color: ${colors.text};
                }

                @keyframes pulse {
                    0%,
                    100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.5;
                    }
                }
            `}</style>

            <AnimatePresence>
                {alertConfig.isOpen && (
                    <CustomAlert isOpen={alertConfig.isOpen} message={alertConfig.message} type={alertConfig.type} onClose={closeAlert} />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {chatBoxOpen && chatUser && (
                    <ChatBox
                        user={chatUser}
                        isOpen={chatBoxOpen}
                        onClose={() => {
                            setChatBoxOpen(false);
                            setChatUser(null);
                        }}
                    />
                )}
            </AnimatePresence>

            <header className="sticky top-0 z-50 shadow-lg bg-slate-900/95 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-3">
                            <h1 className="text-xl font-bold text-indigo-400">StoryVoice</h1>
                        </div>

                        <div className="hidden md:flex items-center space-x-1">
                            <div className="relative">
                                <form onSubmit={handleSearchSubmit}>
                                    <input
                                        type="text"
                                        placeholder="Search stories..."
                                        className="bg-slate-800 border border-slate-700 rounded-full py-1.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 w-64 transition-all"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                    />
                                    <Search size={15} className="absolute left-3 top-2 text-gray-400" />
                                </form>
                            </div>
                        </div>

                        <div className="flex items-center space-x-5">
                            <div className="relative">
                                <button 
                                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setNotificationDropdownOpen(!notificationDropdownOpen);
                                    }}
                                >
                                    <Bell size={20} />
                                </button>

                                {notifications.some((n) => !n.read) && (
                                    <span className="absolute top-2 right-2 bg-red-500 text-white rounded-full text-xs px-1.5 py-0.5">
                                        {notifications.filter((n) => !n.read).length}
                                    </span>
                                )}
                                
                                {notificationDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 top-full mt-2 w-80 bg-slate-800 rounded-lg shadow-lg border border-slate-700 overflow-hidden z-50"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="flex justify-between items-center px-4 py-2 border-b border-slate-700">
                                            <h3 className="text-sm font-medium text-white">Notifications</h3>
                                            <button 
                                                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    markAllAsRead();
                                                }}
                                            >
                                                Mark all as read
                                            </button>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <div className="py-8 text-center text-gray-400">
                                                    <p>No notifications yet</p>
                                                </div>
                                            ) : (
                                                <div>
                                                    {notifications.slice(0, 5).map((activity) => (
                                                        <div
                                                            key={activity.id}
                                                            className={`p-3 border-b border-slate-700/50 hover:bg-slate-700/20 cursor-pointer transition-colors duration-300 ${
                                                                activity.read ? "opacity-60" : "opacity-100"
                                                            }`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleActivityClick(activity);
                                                                setNotificationDropdownOpen(false);
                                                            }}
                                                        >
                                                            <div className="flex items-start">
                                                                <div className="h-8 w-8 rounded-full overflow-hidden mr-3">
                                                                    <img src={activity.avatar} alt={activity.user} className="w-full h-full object-cover" />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="text-sm">
                                                                        <span className="text-white font-medium">{activity.user}</span>
                                                                        <span className="text-gray-300"> {activity.action}</span>
                                                                        {activity.story && <span className="text-indigo-300"> {activity.story}</span>}
                                                                    </div>
                                                                    <div className="text-xs text-gray-400 mt-1">{activity.time}</div>
                                                                </div>
                                                                {!activity.read && (
                                                                    <div className="ml-2">
                                                                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <div className="p-2 text-center">
                                                        <button 
                                                            className="w-full text-sm text-indigo-400 hover:text-indigo-300 py-2 cursor-pointer"
                                                            onClick={() => {
                                                                setActiveView("notifications");
                                                                setNotificationDropdownOpen(false);
                                                            }}
                                                        >
                                                            View all notifications
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            <div
                                className="h-8 w-8 rounded-full bg-indigo-600 p-0.5 cursor-pointer"
                                onClick={() => {
                                    const currentUser: User = {
                                        id: "current_user",
                                        name: "You",
                                        username: "@you",
                                        avatar: "https://images.unsplash.com/photo-1629747490241-624f07d70e1e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aHVtYW4lMjBwb3J0cmFpdHxlbnwwfHwwfHx8MA%3D%3D",
                                        bio: "Your personal profile and bio details would appear here.",
                                        location: "Your Location",
                                        followers: 123,
                                        following: 321,
                                        memberSince: "April 2023",
                                        stories: 5,
                                        social: {
                                            twitter: "your_handle",
                                            instagram: "your_instagram"
                                        }
                                    };
                                    setSelectedProfile(currentUser);
                                    setProfileModalOpen(true);
                                }}
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1629747490241-624f07d70e1e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aHVtYW4lMjBwb3J0cmFpdHxlbnwwfHwwfHx8MA%3D%3D"
                                    alt="User Profile"
                                    className="w-full h-full object-cover rounded-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="h-px bg-slate-800"></div>
            </header>

            <div className="max-w-7xl mx-auto flex">
                <div className="w-64 hidden lg:block shrink-0 border-r border-slate-800/50">
                    <SidebarNav activeCategory={activeCategory} setActiveCategory={setActiveCategory} setActiveView={setActiveView} activeView={activeView} />
                </div>

                <main className="flex-grow py-6 px-4">
                    <ViewContent
                        activeView={activeView}
                        notifications={notifications}
                        showAllNotifications={showAllNotifications}
                        onToggleAllNotifications={toggleAllNotifications}
                        onMarkAllAsRead={markAllAsRead}
                    />

                    {activeView === "home" && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-slate-800 rounded-xl shadow-lg overflow-hidden mb-8 border border-slate-700/50"
                        >
                            <div className="p-4">
                                <div className="flex items-center space-x-4">
                                    <div className="h-10 w-10 rounded-full bg-indigo-600 p-0.5">
                                        <img
                                            src="https://images.unsplash.com/photo-1629747490241-624f07d70e1e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aHVtYW4lMjBwb3J0cmFpdHxlbnwwfHwwfHx8MA%3D%3D"
                                            alt="User"
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    </div>
                                    <button
                                        onClick={() => setRecordingModalOpen(true)}
                                        className="flex-grow text-left px-4 py-2.5 rounded-full bg-slate-700 hover:bg-slate-600 transition-colors duration-300 text-gray-300"
                                    >
                                        Share your voice with the world...
                                    </button>
                                    <motion.button
                                        onClick={() => setRecordingModalOpen(true)}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        transition={{ duration: 0.4 }}
                                        className="p-2.5 rounded-full shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300"
                                    >
                                        <Mic size={18} />
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <AnimatePresence>
                        {recordingModalOpen && (
                            <RecordingModal
                                isOpen={recordingModalOpen}
                                onClose={() => setRecordingModalOpen(false)}
                                onSave={handleSaveRecording}
                            />
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {profileModalOpen && selectedProfile && (
                            <ProfileModal
                                user={selectedProfile}
                                isOpen={profileModalOpen}
                                onClose={() => {
                                    setProfileModalOpen(false);
                                    setSelectedProfile(null);
                                }}
                                onFollow={toggleFollow}
                                followedUsers={followedUsers}
                            />
                        )}
                    </AnimatePresence>

                    {activeCategory !== "all" && (
                        <div className="mb-4 flex items-center">
                            <span className="text-gray-400">Filtered by: </span>
                            <span className="ml-2 px-3 py-1 bg-indigo-600/20 text-indigo-300 rounded-full text-sm">
                                {categories.find((c) => c.id === activeCategory)?.name || activeCategory}
                            </span>
                            <button
                                onClick={() => setActiveCategory("all")}
                                className="ml-2 text-gray-400 hover:text-white transition-colors duration-300"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}

                    <div className="space-y-6">
                        <AnimatePresence>
                            {filteredStories.length > 0 ? (
                                filteredStories.map((story, index) => (
                                    <motion.div
                                        key={story.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{
                                            duration: 0.4,
                                            delay: index * 0.05,
                                        }}
                                        whileHover={{ y: -2, transition: { duration: 0.3 } }}
                                        className="bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-700/30"
                                    >
                                        <div className="p-4 flex items-center justify-between">
                                            <div
                                                className="flex items-center space-x-3 cursor-pointer"
                                                onClick={() => openUserProfile(story.user)}
                                            >
                                                <div className="h-10 w-10 rounded-full bg-indigo-600/20 p-0.5">
                                                    <img
                                                        src={story.user.avatar}
                                                        alt={story.user.name}
                                                        className="w-full h-full object-cover rounded-full"
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-white">{story.user.name}</h3>
                                                    <p className="text-sm text-gray-400">{story.user.username}</p>
                                                </div>
                                            </div>

                                            <div className="relative story-menu-container">
                                                <button 
                                                    className="text-gray-500 hover:text-gray-300 transition-colors duration-300 cursor-pointer"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setStoryMenuOpen(storyMenuOpen === story.id ? null : story.id);
                                                    }}
                                                >
                                                    <MoreHorizontal size={18} />
                                                </button>
                                                
                                                {storyMenuOpen === story.id && (
                                                    <div 
                                                        className="absolute right-0 top-full mt-1 w-36 bg-slate-800 rounded-lg shadow-lg border border-slate-700 overflow-hidden z-30"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <button 
                                                            className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 transition-colors cursor-pointer"
                                                            onClick={() => saveStory(story.id)}
                                                        >
                                                            <span className="flex items-center gap-2">
                                                                <Bookmark size={14} />
                                                                Save
                                                            </span>
                                                        </button>
                                                        <button 
                                                            className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 transition-colors cursor-pointer"
                                                            onClick={() => reportStory(story.id)}
                                                        >
                                                            <span className="flex items-center gap-2">
                                                                <AlertCircle size={14} />
                                                                Report
                                                            </span>
                                                        </button>
                                                        <button 
                                                            className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 transition-colors cursor-pointer"
                                                            onClick={() => hideStory(story.id)}
                                                        >
                                                            <span className="flex items-center gap-2">
                                                                <X size={14} />
                                                                Hide
                                                            </span>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="px-4 pb-2">
                                            <h4 className="font-semibold text-lg text-white">{story.title}</h4>
                                            <p className="text-sm mt-1 text-gray-300">{story.description}</p>

                                            <div className="mt-2 flex items-center">
                                                <span className="text-xs px-2 py-1 rounded-md bg-slate-700 text-gray-300">
                                                    {categories.find((c) => c.id === story.category)?.name || story.category}
                                                </span>
                                            </div>

                                            {story.tags && story.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 mt-2">
                                                    {story.tags.map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className="text-xs px-2 py-0.5 rounded-full bg-indigo-900/40 text-indigo-200"
                                                        >
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="px-4 pt-2 pb-4">
                                            <div className="relative rounded-lg overflow-hidden border border-slate-700/30 bg-slate-900">
                                                <div className="h-20 w-full">
                                                    <AudioVisualizer
                                                        audioElement={audioRefs.current[story.id]}
                                                        isPlaying={currentPlaying === story.id}
                                                        color={colors.primary}
                                                        accentColor={colors.secondary}
                                                        height={80}
                                                    />
                                                </div>

                                                <div className="px-4 py-3">
                                                    <div className="flex items-center space-x-4 mb-3">
                                                        <motion.button
                                                            onClick={() => togglePlay(story.id)}
                                                            whileHover={{ scale: 1.03 }}
                                                            whileTap={{ scale: 0.97 }}
                                                            transition={{ duration: 0.4 }}
                                                            className="h-10 w-10 rounded-full shadow-md flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300 cursor-pointer"
                                                        >
                                                            {currentPlaying === story.id ? (
                                                                <Pause size={18} className="text-white" />
                                                            ) : (
                                                                <Play size={18} className="text-white ml-1" />
                                                            )}
                                                        </motion.button>

                                                        <audio
                                                            ref={(el) => {
                                                                if (el) {
                                                                    audioRefs.current[story.id] = el;
                                                                }
                                                            }}
                                                            src={story.audioUrl}
                                                            onEnded={() => setCurrentPlaying(null)}
                                                            crossOrigin="anonymous"
                                                            preload="metadata"
                                                        />

                                                        <div className="flex-grow">
                                                            <ProgressBar
                                                                audioElement={audioRefs.current[story.id]}
                                                                duration={Number(story.duration)}
                                                                isPlaying={currentPlaying === story.id}
                                                            />
                                                        </div>

                                                        <VolumeControl audioElement={audioRefs.current[story.id]} />
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-4">
                                                            <motion.button
                                                                onClick={() => likeStory(story.id)}
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                transition={{ duration: 0.4 }}
                                                                className="flex items-center space-x-1.5"
                                                            >
                                                                <Heart
                                                                    size={18}
                                                                    fill={story.likedBy.includes(currentUser) ? colors.accent : "none"}
                                                                    stroke={
                                                                        story.likedBy.includes(currentUser)
                                                                            ? colors.accent
                                                                            : colors.textSecondary
                                                                    }
                                                                />
                                                                <span className="text-sm text-gray-400">{story.likes}</span>
                                                            </motion.button>

                                                            <motion.button
                                                                onClick={() => shareStory(story.id)}
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                transition={{ duration: 0.4 }}
                                                                className="flex items-center space-x-1.5"
                                                            >
                                                                <Share2 size={16} className="text-gray-400" />
                                                                <span className="text-sm text-gray-400">{story.shares}</span>
                                                            </motion.button>
                                                        </div>

                                                        <div className="text-xs text-gray-400">{story.timestamp}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-center py-12 bg-slate-800/50 rounded-xl">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-700 flex items-center justify-center">
                                        <Search size={24} className="text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-white mb-2">No stories found</h3>
                                    <p className="text-gray-400 max-w-sm mx-auto mb-4">
                                        No stories match your current filter. Try selecting a different category.
                                    </p>
                                    <button
                                        onClick={() => setActiveCategory("all")}
                                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-300"
                                    >
                                        Show All Stories
                                    </button>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </main>

                <div className="w-80 hidden xl:block shrink-0 border-l border-slate-800/50">
                    <ActivitySidebar
                        onTopicSelect={handleTopicSelect}
                        onUserSelect={handleUserSelect}
                        onActivityClick={handleActivityClick}
                        followedUsers={followedUsers}
                        onFollow={toggleFollow}
                    />
                </div>
            </div>
        </div>
    );
}
