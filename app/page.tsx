"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const schema = {
    commentary:
        "I will create a simple chat application using React and TypeScript. The application will have different channels and users can communicate with each other in real-time.",
    template: "nextjs-developer",
    title: "Chat App",
    description: "A simple chat application with multiple channels.",
    has_additional_dependencies: false,
    install_dependencies_command: "npm install",
    port: 3000,
    file_path: "pages/index.tsx",
};

const channels = ["General", "Random", "Dev", "Other"];

const messageData = [
    {
        user: "John",
        message: "Hello everyone!",
        channel: "General",
        date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
        unread: false,
    },
    {
        user: "Jane",
        message: "Hi John! How are you?",
        channel: "General",
        date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
        unread: false,
    },
    {
        user: "John",
        message: "I'm doing well, thanks! How about you?",
        channel: "General",
        date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
        unread: false,
    },
    {
        user: "Jane",
        message: "I'm good too. Let's chat more!",
        channel: "General",
        date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
        unread: false,
    },
    {
        user: "John",
        message: "Sure, let's do that!",
        channel: "General",
        date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
        unread: false,
    },
    {
        user: "John",
        message: "Hey, how's it going?",
        channel: "Random",
        date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
        unread: true,
    },
    {
        user: "Jane",
        message: "Not too bad, just busy with work. How about you?",
        channel: "Random",
        date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
        unread: true,
    },
    {
        user: "John",
        message: "I'm doing well, thanks! How about you?",
        channel: "Random",
        date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
        unread: true,
    },
];

const groupMessagesByDate = (messages: any[]) => {
    const groups: { [key: string]: any[] } = {};

    messages.forEach((msg) => {
        const msgDate = msg.date ? new Date(msg.date) : new Date();
        const dateKey = msgDate.toDateString();

        if (!groups[dateKey]) {
            groups[dateKey] = [];
        }
        groups[dateKey].push(msg);
    });

    return Object.entries(groups).map(([dateStr, msgs]) => ({
        date: new Date(dateStr),
        messages: msgs,
    }));
};

const formatMessageDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
        return "Yesterday";
    } else {
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
        });
    }
};

const FontStyles = () => (
    <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&family=Open+Sans:wght@300;400;500;600&display=swap");

        html,
        body {
            font-family: "Open Sans", -apple-system, BlinkMacSystemFont, Roboto, Arial, sans-serif;
            font-weight: 400;
        }

        h1, h2, h3, h4, h5, h6, button {
            font-family: "Nunito", "Segoe UI", Tahoma, sans-serif;
            font-weight: 600;
            letter-spacing: -0.02em;
        }

        input, textarea {
            font-family: "Open Sans", -apple-system, BlinkMacSystemFont, Roboto, Arial, sans-serif;
            font-weight: 400;
        }

        .message-text {
            font-size: 15px;
            line-height: 1.5;
            font-weight: 400;
        }

        .channel-name {
            font-weight: 600;
        }

        .scrollbar-thin::-webkit-scrollbar {
            width: 6px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
            background: #18181b;
            border-radius: 3px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
            background-color: #4f4d66;
            border-radius: 3px;
            transition: background-color 0.2s ease;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
            background-color: #a099efb7;
        }
    `}</style>
);

interface Msg {
    user: string;
    message: string;
    channel: string;
    date: string;
    unread: boolean;
}

// Add this component to handle client-side rendering of time
const ClientTime = ({ date }: { date: string }) => {
    const [formattedTime, setFormattedTime] = useState<string>('');
    
    useEffect(() => {
        setFormattedTime(new Date(date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        }));
    }, [date]);
    
    return <span className="text-[0.75vmax] text-[#9b9b9b]">{formattedTime}</span>;
};

// Add this component to handle client-side rendering of date labels
const ClientDateLabel = ({ date }: { date: Date }) => {
    const [formattedDate, setFormattedDate] = useState<string>('');
    
    useEffect(() => {
        setFormattedDate(formatMessageDate(date));
    }, [date]);
    
    return (
        <motion.span 
            className="text-xs font-medium bg-[#36353f] text-[#9b9b9b] px-3 py-1 rounded-full"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            {formattedDate}
        </motion.span>
    );
};

const App = () => {
    const [currentChannel, setCurrentChannel] = useState(channels[0]);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Msg[]>([]);
    const [readChannels, setReadChannels] = useState<Set<string>>(new Set([currentChannel]));
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isMounted, setIsMounted] = useState(false);

    const scrollToBottom = () => {
        if (!messagesEndRef) return;
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSendMessage = () => {
        if (message.trim() === "") return;
        const now = new Date();
        const newMessage = {
            user: "You",
            message,
            channel: currentChannel,
            date: now.toISOString(),
            unread: false,
        };

        setMessages((prevMessages) => [...prevMessages, newMessage]);
        if (window.localStorage) {
            localStorage.setItem("messages", JSON.stringify([...messages, newMessage]));
        }
        setMessage("");
    };

    const handleChannelChange = (channel: string) => {
        setCurrentChannel(channel);

        setMessages((prevMessages) => prevMessages.map((msg) => (msg.channel === channel ? { ...msg, unread: false } : msg)));

        setReadChannels((prev) => new Set([...prev, channel]));
    };

    useEffect(() => {
        setIsMounted(true);
        
        if (!window.localStorage) return;
        const oldMessages = localStorage.getItem("messages");
        if (oldMessages) {
            setMessages(JSON.parse(oldMessages));
        } else {
            setMessages(messageData.map((msg) => 
                msg.channel === currentChannel ? { ...msg, unread: false } : msg
            ));
        }
    }, []);

    useEffect(() => {
        if (isMounted) {
            scrollToBottom();
        }
    }, [messages, isMounted]);

    const hasUnreadMessages = (messages: Msg[], channel: string) => {
        return messages.some((msg) => msg.channel === channel && msg.unread);
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1,
                when: "beforeChildren"
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0 }
    };

    const messageVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.8 },
        visible: { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: { type: "spring", stiffness: 500, damping: 25 }
        },
        exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }
    };

    // If not client-side mounted yet, don't render time-sensitive content
    if (!isMounted) {
        return (
            <>
                <FontStyles />
                <div className="flex min-h-screen items-center justify-center bg-[#fff]">
                    <div className="flex gap-6 h-[90vh] w-[90vw] bg-[#18181B] p-6 pb-3 rounded-xl overflow-hidden"
                        style={{ 
                            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2), 0 0 1px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.1), 0 8px 20px rgba(118, 106, 206, 0.2)",
                            backdropFilter: "blur(20px)"
                        }}>
                        <div className="flex items-center justify-center w-full">
                            <div className="text-white">Loading chat...</div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <FontStyles />
            <div className="flex min-h-screen items-center justify-center bg-[#fff]">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="flex gap-6 h-[90vh] w-[90vw] bg-[#18181B] p-6 pb-3 rounded-xl overflow-hidden"
                    style={{ 
                        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2), 0 0 1px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.1), 0 8px 20px rgba(118, 106, 206, 0.2)",
                        backdropFilter: "blur(20px)"
                    }}
                >
                    <div>
                        <motion.h1 
                            className="text-3xl font-bold mb-6 text-white"
                            variants={itemVariants}
                        >
                            Chat App
                        </motion.h1>
                        <div className="w-48 flex flex-col gap-2">
                            {channels.map((channel, index) => (
                                <motion.button
                                    key={channel}
                                    variants={itemVariants}
                                    custom={index}
                                    className={`cursor-pointer px-4 py-2 text-white rounded-lg transition-colors duration-300 flex items-center justify-between ${
                                        currentChannel === channel ? "bg-[#5645ee] hover:bg-[#4535dd]" : "bg-[#36353f] hover:bg-[#47465f]"
                                    }`}
                                    onClick={() => handleChannelChange(channel)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <span className="channel-name">{channel}</span>
                                    {hasUnreadMessages(messages, channel) && channel !== currentChannel && (
                                        <motion.span 
                                            className="w-2 h-2 bg-red-500 rounded-full ml-2"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ 
                                                type: "spring", 
                                                stiffness: 300, 
                                                damping: 20 
                                            }}
                                        ></motion.span>
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                    <motion.div 
                        className="flex flex-col justify-evenly py-5 px-4 mb-4 bg-[#36353f] rounded-2xl w-full h-auto"
                        variants={itemVariants}
                    >
                        <div className="flex-1 h-10 flex flex-col">
                            <div className="bg-[#18181B] h-full p-4 rounded-lg overflow-y-auto scrollbar-thin">
                                {messages.filter((msg) => msg.channel === currentChannel).length === 0 ? (
                                    <div className="flex items-center justify-center h-full text-gray-500">
                                        No messages in this channel yet. Start a conversation!
                                    </div>
                                ) : (
                                    <ul className="space-y-4">
                                        {groupMessagesByDate(messages.filter((msg: Msg) => msg.channel === currentChannel)).map(
                                            (group, groupIndex) => (
                                                <li className="w-auto" key={groupIndex}>
                                                    <div className="flex justify-center mb-2">
                                                        <ClientDateLabel date={group.date} />
                                                    </div>
                                                    <ul className="space-y-3">
                                                        <AnimatePresence initial={false}>
                                                            {group.messages.map((msg: Msg, index) => (
                                                                <motion.li
                                                                    key={`${msg.date}-${index}`}
                                                                    variants={messageVariants}
                                                                    initial="hidden"
                                                                    animate="visible"
                                                                    exit="exit"
                                                                    className={`flex flex-col ${
                                                                        msg.user === "You" ? "items-end" : "items-start"
                                                                    }`}
                                                                >
                                                                    <div className="flex items-center gap-2 mb-1 px-2">
                                                                        <span className="text-[0.85vmax] font-semibold text-[#a9a7fc]">
                                                                            {msg.user === "You" ? "" : msg.user}
                                                                        </span>
                                                                        <ClientTime date={msg.date} />
                                                                    </div>
                                                                    <motion.div
                                                                        className={`rounded-lg p-3 shadow-sm min-w-[120px] max-w-[80%] inline-block ${
                                                                            msg.user === "You" ? "bg-[#5645ee80]" : "bg-[#36353f89]"
                                                                        }`}
                                                                        initial={{ scale: 0.8, opacity: 0 }}
                                                                        animate={{ scale: 1, opacity: 1 }}
                                                                        transition={{
                                                                            type: "spring",
                                                                            stiffness: 500,
                                                                            damping: 30,
                                                                            delay: 0.1
                                                                        }}
                                                                    >
                                                                        <div className="text-[#e4e4e7] leading-relaxed message-text">{msg.message}</div>
                                                                    </motion.div>
                                                                </motion.li>
                                                            ))}
                                                        </AnimatePresence>
                                                    </ul>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        <motion.div 
                            className="flex gap-2 mt-6"
                            variants={itemVariants}
                        >
                            <motion.input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="px-4 py-2 flex-1 bg-[#4f4d66] rounded-lg text-white"
                                placeholder="Type a message..."
                                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                            />
                            <motion.button
                                className="cursor-pointer px-4 py-2 bg-[#5645ee] text-white rounded-lg transition-colors duration-300 hover:bg-[#4535dd]"
                                onClick={handleSendMessage}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                            >
                                Send
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </>
    );
};

export default App;
