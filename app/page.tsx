// app/page.tsx
"use client";

import { useState, FormEvent, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaRegHeart, FaRegComment } from "react-icons/fa";

// Font styles
const FontStyles = () => (
  <style jsx global>{`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Nunito:wght@300;400;500;600;700&display=swap');
    
    html, body {
      font-family: 'Nunito', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    
    h1, h2, h3, h4, h5, h6 {
      font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
      font-weight: 600;
    }
    
    .comment-text {
      font-family: 'Nunito', sans-serif;
      font-weight: 400;
    }
    
    button {
      font-family: 'Nunito', sans-serif;
      font-weight: 600;
    }
    
    .heading-text {
      font-family: 'Outfit', sans-serif;
      font-weight: 500;
    }

    .hashtag {
      color: #3b82f6;
      font-weight: 600;
      transition: all 0.2s ease;
      display: inline-block;
    }

    .hashtag:hover {
      text-decoration: underline;
      color: #2563eb;
      transform: scale(1.02);
    }
    
    .username-gradient-hover {
      background-size: 200% auto;
      transition: all 0.3s ease;
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
      display: inline-block;
    }
    
    .username-gradient-hover:hover {
      background-position: right center;
      transform: scale(1.03);
    }
  `}</style>
);

type Comment = {
    id: number;
    text: string;
    user: string;
    avatar?: string;
};

// Avatar URLs from GitHub
const avatars = [
  "https://avatars.githubusercontent.com/u/1?v=4",
  "https://avatars.githubusercontent.com/u/583231?v=4",
  "https://avatars.githubusercontent.com/u/9892522?v=4",
  "https://avatars.githubusercontent.com/u/6643122?v=4"
];

export default function Home() {
    // State with TypeScript types
    const [liked, setLiked] = useState<boolean>(false);
    const [comment, setComment] = useState<string>("");
    const [showComments, setShowComments] = useState<boolean>(true);
    const [comments, setComments] = useState<Comment[]>([
        { id: 1, text: "First comment! This design looks fantastic.", user: "Michael Chen", avatar: avatars[0] },
        { id: 2, text: "Love the design of this post. The animations are super smooth too!", user: "Sophie Williams", avatar: avatars[1] },
    ]);
    const [mounted, setMounted] = useState(false);

    // Set mounted to true after the component mounts
    useEffect(() => {
        setMounted(true);
    }, []);

    // Typed event handlers
    const handleLike = (): void => {
        setLiked(!liked);
    };

    const toggleComments = (): void => {
        setShowComments(!showComments);
    };

    const handleComment = (e: FormEvent): void => {
        e.preventDefault();
        if (comment.trim()) {
            const newComment = {
                id: comments.length + 1,
                text: comment,
                user: "You",
                avatar: avatars[2]
            };
            setComments([...comments, newComment]);
            setComment("");
        }
    };

    // Function to render text with styled hashtags
    const renderPostContent = (text: string) => {
        // Split by hashtags
        const parts = text.split(/(#\w+)/g);
        return parts.map((part, index) => {
            if (part.startsWith('#')) {
                return (
                    <motion.span 
                        key={index} 
                        className="hashtag cursor-pointer" 
                        whileHover={{ scale: 1.05 }}
                    >
                        {part}
                    </motion.span>
                );
            }
            return part;
        });
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut",
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
                type: "spring", 
                stiffness: 200, 
                damping: 20 
            }
        }
    };

    const commentVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { 
            opacity: 1, 
            x: 0,
            transition: { 
                type: "spring", 
                stiffness: 200 
            }
        }
    };

    const likeVariants = {
        liked: { 
            scale: [1, 1.5, 1], 
            transition: { duration: 0.3 } 
        },
        unliked: { scale: 1 }
    };

    // Animation for showing/hiding comments
    const commentsContainerVariants = {
        hidden: { 
            opacity: 0, 
            height: 0,
            transition: {
                opacity: { duration: 0.2 },
                height: { duration: 0.3 }
            }
        },
        visible: { 
            opacity: 1, 
            height: "auto",
            transition: {
                opacity: { duration: 0.3 },
                height: { duration: 0.4 }
            }
        }
    };

    const postContent = "Just finished working on our latest design project! It was challenging but so rewarding. What do you think of the final result? 💯 #design #uidesign #creative";

    return (
        <>
            <FontStyles />
            <main className="min-h-screen p-8 bg-gray-50">
                {mounted && (
                    <motion.div 
                        className="max-w-md mx-auto bg-white rounded-xl overflow-hidden"
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        style={{
                            boxShadow: "0 10px 25px rgba(0,0,0,0.05), 0 6px 10px rgba(0,0,0,0.01), 0 0 1px rgba(0,0,0,0.1)",
                        }}
                    >
                        {/* Header with TypeScript-safe props */}
                        <motion.div 
                            className="flex items-center p-4"
                            variants={itemVariants}
                        >
                            <div className="rounded-full w-12 h-12 flex items-center justify-center mr-3 overflow-hidden">
                                <img 
                                    src={avatars[3]} 
                                    alt="User profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <h2 
                                    className="font-semibold text-lg cursor-pointer username-gradient-hover" 
                                    style={{
                                        backgroundImage: "linear-gradient(to right, #4f46e5, #3b82f6, #0ea5e9, #06b6d4)"
                                    }}
                                >
                                    Jane Smith
                                </h2>
                                <p className="text-xs text-gray-500">Posted 2h ago</p>
                            </div>
                        </motion.div>

                        {/* Post Content */}
                        <motion.div
                            className="p-4 border-b border-gray-100"
                            variants={itemVariants}
                        >
                            <p className="mb-4 text-gray-800 leading-relaxed">
                                {renderPostContent(postContent)}
                            </p>
                        </motion.div>

                        {/* Actions */}
                        <motion.div 
                            className="flex gap-4 px-4 py-3 border-b border-gray-100"
                            variants={itemVariants}
                        >
                            <motion.button
                                onClick={handleLike}
                                className={`cursor-pointer flex items-center gap-1.5 rounded-lg px-3 py-1.5 ${
                                    liked ? "text-red-500 bg-red-50" : "text-gray-500 hover:bg-gray-50"
                                }`}
                                aria-label={liked ? "Unlike post" : "Like post"}
                                animate={liked ? "liked" : "unliked"}
                                variants={likeVariants}
                                whileTap={{ scale: 0.95 }}
                            >
                                {liked ? (
                                    <FaHeart className="text-xl" />
                                ) : (
                                    <FaRegHeart className="text-xl" />
                                )}
                                <span className="font-medium">{liked ? "Liked" : "Like"}</span>
                            </motion.button>
                            <motion.button 
                                onClick={toggleComments}
                                className={`cursor-pointer flex items-center gap-1.5 rounded-lg px-3 py-1.5 ${
                                    showComments ? "text-blue-500 bg-blue-50" : "text-gray-500 hover:bg-gray-50"
                                }`}
                                aria-label={showComments ? "Hide comments" : "Show comments"}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                <FaRegComment className="text-xl" />
                                <span className="font-medium">{showComments ? "Hide comments" : "Comments"}</span>
                            </motion.button>
                        </motion.div>

                        {/* Typed Comments Section with AnimatePresence for toggle */}
                        <AnimatePresence>
                            {showComments && (
                                <motion.div 
                                    className="overflow-hidden"
                                    variants={commentsContainerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                >
                                    <motion.div 
                                        className="px-4 py-3 space-y-3"
                                        variants={itemVariants}
                                    >
                                        <h3 className="text-sm font-semibold text-gray-500 mb-2 heading-text">Comments</h3>
                                        {comments.map((item, index) => (
                                            <motion.div 
                                                key={item.id} 
                                                className="flex items-start"
                                                initial="hidden"
                                                animate="visible"
                                                variants={commentVariants}
                                                custom={index}
                                            >
                                                <div className="rounded-full w-8 h-8 flex items-center justify-center mr-3 overflow-hidden flex-shrink-0">
                                                    {item.avatar ? (
                                                        <img 
                                                            src={item.avatar} 
                                                            alt={`${item.user}'s avatar`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="bg-gray-200 w-full h-full flex items-center justify-center text-xs">
                                                            {item.user.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold">{item.user}</p>
                                                    <p className="text-sm comment-text text-gray-700">{item.text}</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </motion.div>

                                    {/* Comment Form with TypeScript events */}
                                    <motion.form 
                                        onSubmit={handleComment} 
                                        className="flex items-center gap-2 p-4 border-t border-gray-100"
                                        variants={itemVariants}
                                    >
                                        <div className="w-8 h-8 rounded-full overflow-hidden">
                                            <img 
                                                src={avatars[2]} 
                                                alt="Your avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <motion.input
                                            type="text"
                                            value={comment}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setComment(e.target.value)}
                                            placeholder="Add a comment..."
                                            className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                                            aria-label="Comment input"
                                            whileFocus={{ scale: 1.01 }}
                                        />
                                        <motion.button
                                            type="submit"
                                            disabled={!comment.trim()}
                                            className="cursor-pointer bg-blue-500 text-white font-medium rounded-full px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                            aria-label="Submit comment"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Post
                                        </motion.button>
                                    </motion.form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </main>
        </>
    );
}
