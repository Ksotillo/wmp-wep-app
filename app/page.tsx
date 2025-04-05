"use client";

import type React from "react";
import { useState, useEffect, JSX } from "react";

interface Boxer {
    name: string;
    image: string;
    bio: string;
    achievements: string[];
}

interface BlogPost {
    id: number;
    title: string;
    excerpt: string;
    date: string;
    content: string;
}

interface Tournament {
    id: number;
    title: string;
    date: string;
    location: string;
    opponent: string;
    ticketLink: string;
    description: string;
    details: string;
}

interface Comment {
    id: number;
    text: string;
    author: string;
    date: string;
}

type CommentsState = Record<number, Comment[]>;

function formatDate(date: string, format: "short" | "long" = "short"): string {
    const d = new Date(date);
    if (format === "short") {
        return `${d.toLocaleString("en-US", {
            month: "short",
        })} ${d.getDate()}, ${d.getFullYear()}`;
    }
    return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

function formatDateTime(date: string): string {
    const d = new Date(date);
    return `${d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    })} at ${d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    })}`;
}


const initialBlogPosts: BlogPost[] = [
    {
        id: 1,
        title: "Reflections on My Latest Victory",
        excerpt: "Last night's fight against Rodriguez was one of the toughest of my career. Here's what I learned...",
        date: "2025-03-15",
        content:
            "Last night's fight against Rodriguez was one of the toughest of my career. The crowd was electric, and I could feel the energy from the moment I stepped into the arena. Rodriguez came out strong in the first two rounds, landing some solid body shots that had me adjusting my strategy early.\n\nBy round three, I found my rhythm and started countering his aggressive style with my jab-hook combinations. The turning point came in round five when I connected with a clean right cross that visibly stunned him. From there, I maintained control, focusing on my footwork and timing.\n\nWhat I learned most from this fight is the importance of patience. There were moments when I wanted to go for the knockout, but sticking to the game plan ultimately led to a more decisive victory. My corner did an amazing job keeping me focused and making the right adjustments between rounds.\n\nI want to thank all my fans for their incredible support. Your energy fuels me in those tough moments when I need to dig deep. Now it's time to recover, review the tape, and start preparing for the next challenge. The journey continues!",
    },
    {
        id: 2,
        title: "Training Camp Updates",
        excerpt: "Three weeks into camp for my upcoming title defense. Here's how preparation is going...",
        date: "2025-03-01",
        content:
            "Three weeks into camp for my upcoming title defense, and I'm feeling stronger than ever. We've completely revamped my training regimen for this fight, incorporating new strength conditioning exercises and focusing heavily on my defensive movement.\n\nMy sparring partners have been pushing me to my limits, simulating my opponent's aggressive southpaw style. Those sessions have been brutal but necessary. Coach Williams has been drilling counter-punching combinations that we believe will be effective against a southpaw.\n\nNutrition has been on point as well. Working with a new nutritionist who has me on a clean, high-protein diet that's helping me maintain strength while staying within my weight class. The weight cut is going smoothly so far.\n\nMentally, I'm in a great place. Meditation has become a key part of my daily routine, helping me stay focused and calm under pressure. I'm visualizing the fight every night before bed, seeing different scenarios and how I'll respond.\n\nStill have four weeks to go, but I'm confident this will be my best performance yet. The belt is staying with me!",
    },
    {
        id: 3,
        title: "The Mental Game of Boxing",
        excerpt: "People often focus on the physical aspects of boxing, but the mental game is equally important...",
        date: "2025-02-15",
        content:
            "People often focus on the physical aspects of boxing, but the mental game is equally important. In fact, I'd argue that at the highest levels of the sport, mental fortitude is what separates champions from contenders.\n\nIn my early career, I relied heavily on my natural physical gifts – my power and speed. But after suffering my first professional loss, I realized that wasn't enough. I needed to develop mental toughness and strategic thinking to reach the next level.\n\nNow, my preparation is as much mental as physical. I study opponents meticulously, looking for patterns and tendencies I can exploit. During fights, I'm constantly making micro-adjustments based on what I'm seeing and feeling. This awareness has transformed my performance in the ring.\n\nFear and doubt are natural before any fight. The key isn't eliminating these feelings but acknowledging them and using them as fuel. When I step into the ring now, I carry a calm confidence that comes from knowing I've prepared for every possible scenario.\n\nFor any young boxers reading this, my advice is simple: train your mind as hard as you train your body. Learn to stay present in the moment, especially when facing adversity. The fighter who maintains mental clarity under pressure is usually the one whose hand gets raised at the end.",
    },
];

const tournaments: Tournament[] = [
    {
        id: 1,
        title: "Middleweight Championship Defense",
        date: "2025-04-20",
        location: "United Center, Chicago",
        opponent: "Carlos 'The Viper' Rodriguez",
        ticketLink: "https://example.com/tickets",
        description:
            "Defending my WBC Middleweight title against the #1 contender. Rodriguez brings a 26-1 record with 18 KOs to this highly anticipated matchup.",
        details:
            "This will be my second title defense since winning the belt last year. Rodriguez has been on an impressive 8-fight winning streak, with his last three victories coming by knockout. His southpaw stance and counter-punching style present a unique challenge, but we've been preparing specifically for his approach.\n\nThe undercard features several exciting matchups, including the women's welterweight championship and a heavyweight eliminator bout. Doors open at 6:00 PM with the main event expected to start around 10:30 PM ET.\n\nThis fight will be broadcast live on PPV and streaming on FightZone Premium.",
    },
    {
        id: 2,
        title: "Thunder vs. Lightning Exhibition Match",
        date: "2025-06-15",
        location: "United Center, Chicago",
        opponent: "Jamal 'Lightning' Williams",
        ticketLink: "https://example.com/tickets",
        description:
            "Special exhibition match against former sparring partner and rising star Jamal Williams. All proceeds go to youth boxing programs in Chicago.",
        details:
            "This exhibition match is particularly special to me as it takes place in my hometown of Chicago. While not a title defense, this 8-round exhibition will showcase high-level boxing while raising money for a cause close to my heart - youth boxing programs that keep kids off the streets.\n\nJamal Williams is one of the most promising talents in the division, with incredible hand speed that earned him the 'Lightning' nickname. We've sparred countless rounds together when he was coming up, and now he's making his own name in the professional ranks.\n\nThe event will include a pre-fight youth boxing showcase and a meet-and-greet opportunity for VIP ticket holders. Local Chicago businesses have donated amazing items for a silent auction that will take place throughout the event.",
    },
    {
        id: 3,
        title: "International Boxing Gala",
        date: "2025-08-10",
        location: "United Center, Chicago",
        opponent: "TBD",
        ticketLink: "https://example.com/tickets",
        description: "Making my UK debut at the prestigious International Boxing Gala. Opponent to be announced in the coming weeks.",
        details:
            "I'm thrilled to announce my UK debut at the International Boxing Gala in London. This event brings together champions from multiple weight classes for an unforgettable night of boxing at the iconic O2 Arena.\n\nWhile my opponent hasn't been officially announced, we're in talks with several top-ranked contenders. This non-title bout will be contested at a catchweight of 165 pounds, allowing me to test the waters at a slightly higher weight class.\n\nThe UK fans are known for their boxing knowledge and passionate support, so I'm looking forward to putting on a show worthy of this historic venue. The entire card will feature international matchups, with boxers representing over 10 different countries.\n\nTickets are expected to sell out quickly once they go on sale next month.",
    },
];

const BoxerBlog = (): JSX.Element => {
    const [activeTab, setActiveTab] = useState<"home" | "blog" | "tournaments" | "write">("home");
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
    const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
    const [comments, setComments] = useState<CommentsState>({});
    const [commentText, setCommentText] = useState<string>("");
    const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [avatarUrl, setAvatarUrl] = useState<string>("");
    const [hasMounted, setHasMounted] = useState<boolean>(false);

    const [blogPosts, setBlogPosts] = useState<BlogPost[]>(initialBlogPosts);


    const [postTitle, setPostTitle] = useState<string>("");
    const [postContent, setPostContent] = useState<string>("");
    const [matchOpponent, setMatchOpponent] = useState<string>("");
    const [matchLocation, setMatchLocation] = useState<string>("");
    const [matchDate, setMatchDate] = useState<string>("");

    // Helper function to scroll to top with smooth behavior
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Enhanced navigation function that changes tab and scrolls to top
    const navigateTo = (tab: "home" | "blog" | "tournaments" | "write", post: BlogPost | null = null, tournament: Tournament | null = null) => {
        setActiveTab(tab);
        setSelectedPost(post);
        setSelectedTournament(tournament);
        scrollToTop();
    };

    // Function to handle submitting new blog posts
    const handleSubmitPost = () => {
        if (!postTitle.trim() || !postContent.trim()) {
            return;
        }

        // Create a new blog post
        const newPost: BlogPost = {
            id: Date.now(), // Use timestamp for unique ID
            title: postTitle,
            excerpt: postContent.split("\n")[0].substring(0, 120) + "...",
            date: matchDate || new Date().toISOString().split('T')[0],
            content: postContent,
        };

        // Add the new post to the state
        setBlogPosts(prevPosts => [newPost, ...prevPosts]);

        // Reset form fields
        setPostTitle("");
        setPostContent("");
        setMatchOpponent("");
        setMatchLocation("");
        setMatchDate("");
        
        // Navigate to the blog section and show the newly published article
        navigateTo("blog", newPost);
    };

    useEffect(() => {
        setAvatarUrl(
            `https://images.unsplash.com/photo-1606059100110-4230429584fe?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`
        );

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);

        setHasMounted(true);

        return () => clearTimeout(timer);
    }, []);

    const boxer: Boxer = {
        name: 'Mike "The Thunder" Johnson',
        image: avatarUrl,
        bio: "Professional boxer with 28-2 record. Current middleweight champion known for powerful right hooks and lightning-fast footwork. Training out of Thunder Gym in Chicago.",
        achievements: ["WBC Middleweight Champion", "2x Golden Gloves Winner", "Olympic Bronze Medalist"],
    };

    const handleCommentSubmit = (postId: number): void => {
        if (!commentText.trim()) return;

        const newComment: Comment = {
            id: Date.now(),
            text: commentText,
            author: "Guest User",
            date: new Date().toISOString(),
        };

        setComments((prevComments) => ({
            ...prevComments,
            [postId]: [...(prevComments[postId] || []), newComment],
        }));

        setCommentText("");
    };

    const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
        setCommentText(event.target.value);
    };

    const renderHome = (): JSX.Element => (
        <div className="space-y-20 animate-fadeIn">
            <section className="flex flex-col-reverse md:flex-row gap-12 items-center">
                <div className="flex-1 space-y-6 animate-slideInLeft">
                    <div className="inline-flex items-center rounded-full bg-red-500/10 px-3 py-1 text-sm font-medium text-red-500 ring-1 ring-inset ring-red-500/20 mb-2">
                        Professional Boxer
                    </div>
                    <h1 className="text-5xl font-bold tracking-tight text-white leading-tight md:text-6xl lg:text-7xl">
                        {boxer.name.split('"')[0]}
                        <span className="text-red-500">"{boxer.name.split('"')[1]}"</span>
                        {boxer.name.split('"')[2]}
                    </h1>
                    <p className="text-xl text-zinc-400 leading-relaxed max-w-2xl">{boxer.bio}</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                        {boxer.achievements.map((achievement, i) => (
                            <div
                                key={i}
                                className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 px-3 py-1 text-sm rounded-md flex items-center transition-all duration-200 cursor-default"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="mr-1 h-3.5 w-3.5 text-red-500"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /> <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                                    <path d="M4 22h16" /> <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                                    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                                    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                                </svg>
                                {achievement}
                            </div>
                        ))}
                    </div>
                    <div className="pt-4">
                        <button
                            className="bg-red-500 hover:bg-red-600 text-white rounded-full px-8 h-12 text-base flex items-center transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
                            onClick={() => navigateTo("blog")}
                        >
                            Read My Blog
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="ml-2 h-4 w-4"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M5 12h14" /> <path d="m12 5 7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="flex-shrink-0 relative animate-slideInRight">
                    <div className="h-56 w-56 md:h-80 md:w-80 rounded-full border-4 border-zinc-900 overflow-hidden transition-all duration-500 ease-in-out hover:scale-105 hover:border-red-500/50">
                        <img
                            src={boxer.image || "/placeholder.svg"}
                            alt={boxer.name}
                            className="object-cover w-full h-full transition-transform duration-500 ease-in-out hover:scale-110"
                            width={320}
                            height={320}
                            loading="lazy"
                        />
                    </div>
                </div>
            </section>

            <section>
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <div className="inline-flex items-center rounded-full bg-red-500/10 px-3 py-1 text-sm font-medium text-red-500 ring-1 ring-inset ring-red-500/20 mb-2">
                            Latest Updates
                        </div>
                        <h2 className="text-3xl font-bold text-white md:text-4xl">Latest Posts</h2>
                    </div>
                    <button
                        onClick={() => navigateTo("blog")}
                        className="border border-zinc-700 text-zinc-300 hover:text-white hover:border-red-500 px-4 py-2 rounded-md flex items-center transition-all duration-200 cursor-pointer"
                    >
                        View All
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="ml-2 h-4 w-4"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                    </button>
                </div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {/* Show only the 3 most recent blog posts */}
                    {blogPosts.slice(0, 3).map((post, index) => (
                        <div
                            key={post.id}
                            className="h-full flex flex-col bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden group hover:border-red-500/50 transition-all duration-300 animate-fadeIn cursor-pointer"
                            style={{ animationDelay: `${index * 150}ms`, opacity: 0 }}
                            onClick={() => navigateTo("blog", post)}
                        >
                            <div className="p-6 pb-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-md px-2 py-1 text-sm flex items-center mb-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="mr-1 h-3.5 w-3.5"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <polyline points="12 6 12 12 16 14"></polyline>
                                        </svg>
                                        {formatDate(post.date)}
                                    </div>
                                    <div className="h-8 w-8 rounded-full flex items-center justify-center bg-zinc-800 text-zinc-400 font-medium">
                                        {index + 1}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-white group-hover:text-red-500 transition-colors">{post.title}</h3>
                            </div>
                            <div className="px-6 pb-6 flex-grow">
                                <p className="text-zinc-400">{post.excerpt}</p>
                            </div>
                            <div className="px-6 pb-6">
                                <button
                                    className="text-zinc-400 group-hover:text-red-500 p-0 h-auto font-medium flex items-center transition-all duration-300 ease-in-out cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigateTo("blog", post);
                                    }}
                                >
                                    Read More
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="ml-2 h-4 w-4 transition-all duration-300 ease-in-out group-hover:translate-x-1"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M5 12h14" /> <path d="m12 5 7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <div className="inline-flex items-center rounded-full bg-red-500/10 px-3 py-1 text-sm font-medium text-red-500 ring-1 ring-inset ring-red-500/20 mb-2">
                            Fight Schedule
                        </div>
                        <h2 className="text-3xl font-bold text-white md:text-4xl">Upcoming Tournaments</h2>
                    </div>
                    <button
                        onClick={() => navigateTo("tournaments")}
                        className="border border-zinc-700 text-zinc-300 hover:text-white hover:border-red-500 px-4 py-2 rounded-md flex items-center transition-all duration-200 cursor-pointer"
                    >
                        View All
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="ml-2 h-4 w-4"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                    </button>
                </div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {tournaments.slice(0, 3).map((tournament, index) => (
                        <div
                            key={tournament.id}
                            className="h-full flex flex-col bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden group hover:border-red-500/50 transition-all duration-300 animate-fadeIn cursor-pointer"
                            style={{ animationDelay: `${(index + 3) * 150}ms`, opacity: 0 }}
                            onClick={() => navigateTo("tournaments", null, tournament)}
                        >
                            <div className="p-6 pb-4">
                                <div className="flex flex-col space-y-2 mb-2">
                                    <div className="w-fit bg-red-500/10 text-red-500 border border-red-500/20 rounded-md px-2 py-1 text-sm flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="mr-1 h-3.5 w-3.5"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                                            <line x1="16" x2="16" y1="2" y2="6"></line>
                                            <line x1="8" x2="8" y1="2" y2="6"></line>
                                            <line x1="3" x2="21" y1="10" y2="10"></line>
                                        </svg>
                                        {formatDate(tournament.date, "long")}
                                    </div>
                                    <div className="w-fit bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-md px-2 py-1 text-sm flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="mr-1 h-3.5 w-3.5"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                                            <circle cx="12" cy="10" r="3"></circle>
                                        </svg>
                                        {tournament.location}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-white group-hover:text-red-500 transition-colors">
                                    {tournament.title}
                                </h3>
                            </div>
                            <div className="px-6 pb-6 flex-grow">
                                <p className="text-zinc-400">{tournament.description}</p>
                            </div>
                            <div className="px-6 pb-6">
                                <button
                                    className="text-zinc-400 group-hover:text-red-500 p-0 h-auto font-medium flex items-center transition-all duration-300 ease-in-out cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigateTo("tournaments", null, tournament);
                                    }}
                                >
                                    View Details
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="ml-2 h-4 w-4 transition-all duration-300 ease-in-out group-hover:translate-x-1"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M5 12h14" /> <path d="m12 5 7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );

    const renderBlog = (): JSX.Element => (
        <div className="space-y-10 animate-fadeIn">
            <div className="flex items-center justify-between">
                <div>
                    <div className="inline-flex items-center rounded-full bg-red-500/10 px-3 py-1 text-sm font-medium text-red-500 ring-1 ring-inset ring-red-500/20 mb-2">
                        My Thoughts
                    </div>
                    <h2 className="text-3xl font-bold text-white md:text-4xl">Blog Posts</h2>
                </div>
                {selectedPost && (
                    <button
                        onClick={() => navigateTo("blog")}
                        className="border border-zinc-700 text-zinc-300 hover:text-white hover:border-red-500 px-4 py-2 rounded-md transition-all duration-200 cursor-pointer"
                    >
                        Back to All Posts
                    </button>
                )}
            </div>

            {selectedPost ? (
                <div className="space-y-8 animate-fadeIn">
                    <div className="space-y-2">
                        <div className="bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-md px-2 py-1 text-sm inline-flex items-center mb-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="mr-1 h-3.5 w-3.5"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            {formatDate(selectedPost.date, "long")}
                        </div>
                        <h1 className="text-4xl font-bold text-white md:text-5xl">{selectedPost.title}</h1>
                    </div>

                    <div className="prose prose-invert max-w-none text-zinc-400">
                        {selectedPost.content.split("\n\n").map((paragraph, i) => (
                            <p key={i} className="mb-4">
                                {" "}
                                {paragraph}
                            </p>
                        ))}
                    </div>

                    <div className="border-t border-zinc-800 pt-10 mt-12 md:w-1/2">
                        <h3 className="text-2xl font-bold mb-6 text-white">Comments</h3>

                        <div className="space-y-6 mb-8">
                            {(comments[selectedPost.id]?.length ?? 0) > 0 ? (
                                comments[selectedPost.id].map((comment) => (
                                    <div
                                        key={comment.id}
                                        className="border border-zinc-800 rounded-lg p-5 bg-zinc-900 transition-all duration-300 hover:border-zinc-700"
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="h-10 w-10 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center border border-zinc-700 font-semibold">
                                                {comment.author[0]}
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">{comment.author}</p>
                                                <p className="text-xs text-zinc-500">{hasMounted ? formatDateTime(comment.date) : "..."}</p>
                                            </div>
                                        </div>
                                        <p className="text-zinc-400">{comment.text}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 border border-dashed border-zinc-800 rounded-lg bg-zinc-900/50">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-10 w-10 text-zinc-700 mx-auto mb-3"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                    <p className="text-zinc-500">No comments yet. Be the first to share your thoughts!</p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <textarea
                                placeholder="Leave a comment..."
                                value={commentText}
                                onChange={handleCommentChange}
                                className="min-h-[120px] w-full bg-zinc-900 border border-zinc-800 focus:border-red-500 focus:ring-1 focus:ring-red-500/20 text-zinc-300 placeholder:text-zinc-600 rounded-md p-3 transition-colors"
                                rows={4}
                            />
                            <button
                                onClick={() => handleCommentSubmit(selectedPost.id)}
                                disabled={!commentText.trim()}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Post Comment
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="ml-2 h-4 w-4"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>{" "}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {blogPosts.map((post, index) => (
                        <div
                            key={post.id}
                            className="h-full flex flex-col bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden group hover:border-red-500/50 transition-all duration-300 hover:translate-y-[-4px] animate-fadeIn cursor-pointer"
                            style={{ animationDelay: `${index * 100}ms`, opacity: 0 }}
                            onClick={() => {
                                setSelectedPost(post);
                                scrollToTop();
                            }}
                        >
                            <div className="p-6 pb-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-md px-2 py-1 text-sm flex items-center mb-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="mr-1 h-3.5 w-3.5"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <polyline points="12 6 12 12 16 14"></polyline>
                                        </svg>
                                        {formatDate(post.date)}
                                    </div>
                                    <div className="h-8 w-8 rounded-full flex items-center justify-center bg-zinc-800 text-zinc-400 font-medium">
                                        {index + 1}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-white group-hover:text-red-500 transition-colors">{post.title}</h3>
                            </div>
                            <div className="px-6 pb-6 flex-grow">
                                <p className="text-zinc-400">{post.excerpt}</p>
                            </div>
                            <div className="px-6 pb-6">
                                <button
                                    className="text-zinc-400 group-hover:text-red-500 p-0 h-auto font-medium flex items-center transition-all duration-300 ease-in-out cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedPost(post);
                                        scrollToTop();
                                    }}
                                >
                                    Read More
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="ml-2 h-4 w-4 transition-all duration-300 ease-in-out group-hover:translate-x-1"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M5 12h14" /> <path d="m12 5 7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const renderTournaments = (): JSX.Element => (
        <div className="space-y-10 animate-fadeIn">
            <div className="flex items-center justify-between">
                <div>
                    <div className="inline-flex items-center rounded-full bg-red-500/10 px-3 py-1 text-sm font-medium text-red-500 ring-1 ring-inset ring-red-500/20 mb-2">
                        Fight Schedule
                    </div>
                    <h2 className="text-3xl font-bold text-white md:text-4xl">Upcoming Tournaments</h2>
                </div>
                {selectedTournament && (
                    <button
                        onClick={() => navigateTo("tournaments")}
                        className="border border-zinc-700 text-zinc-300 hover:text-white hover:border-red-500 px-4 py-2 rounded-md transition-all duration-200 cursor-pointer"
                    >
                        Back to All Tournaments
                    </button>
                )}
            </div>

            {selectedTournament ? (
                <div className="space-y-10 animate-fadeIn">
                    <div className="space-y-4">
                        <div className="flex flex-col space-y-2">
                            <div className="w-fit bg-red-500/10 text-red-500 border border-red-500/20 rounded-md px-2 py-1 text-sm flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="mr-1 h-3.5 w-3.5"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                                    <line x1="16" x2="16" y1="2" y2="6"></line>
                                    <line x1="8" x2="8" y1="2" y2="6"></line>
                                    <line x1="3" x2="21" y1="10" y2="10"></line>
                                </svg>
                                {formatDate(selectedTournament.date, "long")}
                            </div>
                            <div className="w-fit bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-md px-2 py-1 text-sm flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="mr-1 h-3.5 w-3.5"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                                {selectedTournament.location}
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold text-white md:text-5xl">{selectedTournament.title}</h1>
                    </div>

                    <div className="grid gap-10 md:grid-cols-2">
                        <div>
                            <div className="inline-flex items-center rounded-full bg-zinc-800/50 px-3 py-1 text-sm font-medium text-zinc-400 mb-4">
                                Event Information
                            </div>
                            <div className="prose prose-invert max-w-none text-zinc-400">
                                {selectedTournament.details.split("\n\n").map((paragraph, i) => (
                                    <p key={i} className="mb-4">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 transition-all duration-300 hover:border-zinc-700">
                                <div className="inline-flex items-center rounded-full bg-zinc-800/50 px-3 py-1 text-sm font-medium text-zinc-400 mb-4">
                                    Match Details
                                </div>
                                <div className="space-y-5">
                                    <div>
                                        <p className="text-sm text-zinc-500 mb-1">Opponent</p>
                                        <p className="font-medium text-white text-lg">{selectedTournament.opponent}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-zinc-500 mb-1">Date</p>
                                        <p className="font-medium text-white text-lg">{formatDate(selectedTournament.date, "long")}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-zinc-500 mb-1">Venue</p>
                                        <p className="font-medium text-white text-lg">{selectedTournament.location}</p>
                                    </div>
                                </div>
                                <div className="mt-8">
                                    <a
                                        href={selectedTournament.ticketLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full bg-red-600 hover:bg-red-700 text-white h-12 rounded-md flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
                                    >
                                        Get Tickets
                                    </a>
                                </div>
                            </div>

                            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 transition-all duration-300 hover:border-zinc-700">
                                <div className="inline-flex items-center rounded-full bg-zinc-800/50 px-3 py-1 text-sm font-medium text-zinc-400 mb-4">
                                    Location
                                </div>
                                <div className="aspect-video bg-zinc-800 rounded-lg overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1731451162440-506d1b3aba95?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                        alt="Venue map placeholder"
                                        width={500}
                                        height={300}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {tournaments.map((tournament, index) => (
                        <div
                            key={tournament.id}
                            className="h-full flex flex-col bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden group hover:border-red-500/50 transition-all duration-300 hover:translate-y-[-4px] animate-fadeIn cursor-pointer"
                            style={{ animationDelay: `${index * 100}ms`, opacity: 0 }}
                            onClick={() => {
                                setSelectedTournament(tournament);
                                scrollToTop();
                            }}
                        >
                            <div className="p-6 pb-4">
                                <div className="flex flex-col space-y-2 mb-2">
                                    <div className="w-fit bg-red-500/10 text-red-500 border border-red-500/20 rounded-md px-2 py-1 text-sm flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="mr-1 h-3.5 w-3.5"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                                            <line x1="16" x2="16" y1="2" y2="6"></line>
                                            <line x1="8" x2="8" y1="2" y2="6"></line>
                                            <line x1="3" x2="21" y1="10" y2="10"></line>
                                        </svg>
                                        {formatDate(tournament.date, "long")}
                                    </div>
                                    <div className="w-fit bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-md px-2 py-1 text-sm flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="mr-1 h-3.5 w-3.5"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                                            <circle cx="12" cy="10" r="3"></circle>
                                        </svg>
                                        {tournament.location}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-white group-hover:text-red-500 transition-colors">
                                    {tournament.title}
                                </h3>
                            </div>
                            <div className="px-6 pb-6 flex-grow">
                                <p className="text-zinc-400">{tournament.description}</p>
                            </div>
                            <div className="px-6 pb-6">
                                <button
                                    className="text-zinc-400 group-hover:text-red-500 p-0 h-auto font-medium flex items-center transition-all duration-300 ease-in-out cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedTournament(tournament);
                                        scrollToTop();
                                    }}
                                >
                                    View Details
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="ml-2 h-4 w-4 transition-all duration-300 ease-in-out group-hover:translate-x-1"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M5 12h14" /> <path d="m12 5 7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const renderWrite = (): JSX.Element => (
        <div className="space-y-10 animate-fadeIn">
            <div>
                <div className="inline-flex items-center rounded-full bg-red-500/10 px-3 py-1 text-sm font-medium text-red-500 ring-1 ring-inset ring-red-500/20 mb-2">
                    Post-Match Thoughts
                </div>
                <h2 className="text-3xl font-bold text-white md:text-4xl">Write Your Reflections</h2>
            </div>

            <div className="grid gap-10 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <div className="space-y-4">
                        <label htmlFor="post-title" className="block text-white font-medium">
                            Post Title
                        </label>
                        <input
                            id="post-title"
                            type="text"
                            placeholder="e.g., Reflections on My Fight Against Rodriguez"
                            value={postTitle}
                            onChange={(e) => setPostTitle(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 focus:border-red-500 focus:ring-1 focus:ring-red-500/20 text-zinc-300 placeholder:text-zinc-600 rounded-md p-3 transition-colors"
                        />
                    </div>
                    
                    <div className="space-y-4">
                        <label htmlFor="post-content" className="block text-white font-medium">
                            Your Thoughts
                        </label>
                        <textarea
                            id="post-content"
                            placeholder="Share your thoughts, experiences, techniques, and emotions from the match..."
                            value={postContent}
                            onChange={(e) => setPostContent(e.target.value)}
                            className="min-h-[300px] w-full bg-zinc-900 border border-zinc-800 focus:border-red-500 focus:ring-1 focus:ring-red-500/20 text-zinc-300 placeholder:text-zinc-600 rounded-md p-3 transition-colors"
                            rows={12}
                        />
                    </div>
                    
                    <button
                        onClick={handleSubmitPost}
                        disabled={!postTitle.trim() || !postContent.trim()}
                        className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-md flex items-center transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                        Publish Post
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="ml-2 h-5 w-5"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M5 12h14" /> <path d="m12 5 7 7-7 7" />
                        </svg>
                    </button>
                </div>
                
                <div className="space-y-8">
                    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 transition-all duration-300 hover:border-zinc-700">
                        <div className="inline-flex items-center rounded-full bg-zinc-800/50 px-3 py-1 text-sm font-medium text-zinc-400 mb-4">
                            Match Details
                        </div>
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label htmlFor="match-opponent" className="block text-zinc-500 text-sm">
                                    Opponent
                                </label>
                                <input
                                    id="match-opponent"
                                    type="text"
                                    placeholder="e.g., Carlos Rodriguez"
                                    value={matchOpponent}
                                    onChange={(e) => setMatchOpponent(e.target.value)}
                                    className="w-full bg-zinc-800 border border-zinc-700 focus:border-red-500 focus:ring-1 focus:ring-red-500/20 text-zinc-300 placeholder:text-zinc-600 rounded-md p-2 text-sm transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="match-location" className="block text-zinc-500 text-sm">
                                    Location
                                </label>
                                <input
                                    id="match-location"
                                    type="text"
                                    placeholder="e.g., United Center, Chicago"
                                    value={matchLocation}
                                    onChange={(e) => setMatchLocation(e.target.value)}
                                    className="w-full bg-zinc-800 border border-zinc-700 focus:border-red-500 focus:ring-1 focus:ring-red-500/20 text-zinc-300 placeholder:text-zinc-600 rounded-md p-2 text-sm transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="match-date" className="block text-zinc-500 text-sm">
                                    Date
                                </label>
                                <input
                                    id="match-date"
                                    type="date"
                                    value={matchDate}
                                    onChange={(e) => setMatchDate(e.target.value)}
                                    className="w-full bg-zinc-800 border border-zinc-700 focus:border-red-500 focus:ring-1 focus:ring-red-500/20 text-zinc-300 placeholder:text-zinc-600 rounded-md p-2 text-sm transition-colors"
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 transition-all duration-300 hover:border-zinc-700">
                        <div className="inline-flex items-center rounded-full bg-zinc-800/50 px-3 py-1 text-sm font-medium text-zinc-400 mb-4">
                            Writing Tips
                        </div>
                        <ul className="space-y-3 text-zinc-400">
                            <li className="flex items-start">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="9 11 12 14 22 4"></polyline>
                                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                                </svg>
                                Start with your immediate emotions and reactions to the match
                            </li>
                            <li className="flex items-start">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="9 11 12 14 22 4"></polyline>
                                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                                </svg>
                                Describe key moments that changed the course of the fight
                            </li>
                            <li className="flex items-start">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="9 11 12 14 22 4"></polyline>
                                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                                </svg>
                                Share what you learned from this experience
                            </li>
                            <li className="flex items-start">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="9 11 12 14 22 4"></polyline>
                                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                                </svg>
                                End with what's next for your training or career
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-900/95 to-zinc-950 text-zinc-100">
            <style jsx global>{`
                @import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap");
                @import url("https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800;900&display=swap");
                @import url("https://fonts.googleapis.com/css2?family=Outfit:wght@100;200;300;400;500;600;700;800;900&display=swap");

                :root {
                    --background: 0 0% 100%;
                    --foreground: 240 10% 3.9%;

                    --primary: 346.8 77.8% 49.8%;
                    --ring: 346.8 77.8% 49.8%;
                    --radius: 0.5rem;

                    --font-heading: "Orbitron", sans-serif;
                    --font-body: "Barlow", sans-serif;
                    --font-title: "Outfit", sans-serif;
                }

                .dark {
                    --background: 240 10% 3.9%;
                    --foreground: 0 0% 98%;
                    --card: 240 5.9% 10%;
                    --card-foreground: 0 0% 98%;
                    --popover: 240 10% 3.9%;
                    --popover-foreground: 0 0% 98%;
                    --primary: 346.8 77.8% 49.8%;
                    --primary-foreground: 355.7 100% 97.3%;
                    --secondary: 240 3.7% 15.9%;
                    --secondary-foreground: 0 0% 98%;
                    --muted: 240 3.7% 15.9%;
                    --muted-foreground: 240 5% 64.9%;
                    --accent: 240 3.7% 15.9%;
                    --accent-foreground: 0 0% 98%;
                    --destructive: 0 62.8% 30.6%;
                    --destructive-foreground: 0 0% 98%;
                    --border: 240 3.7% 15.9%;
                    --input: 240 3.7% 15.9%;
                    --ring: 346.8 77.8% 49.8%;
                }

                body {
                    background-color: #09090b;
                    color: #fafafa;
                    font-family: var(--font-body);
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                @keyframes slideInLeft {
                    from {
                        transform: translateX(-20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideInRight {
                    from {
                        transform: translateX(20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out forwards;
                }
                .animate-slideInLeft {
                    animation: slideInLeft 0.5s ease-out forwards;
                }
                .animate-slideInRight {
                    animation: slideInRight 0.5s ease-out forwards;
                }

                button,
                a {
                    cursor: pointer;
                    outline-offset: 2px;
                }
                button:focus-visible,
                a:focus-visible {
                    outline: 2px solid var(--primary);
                }

                .prose p {
                    margin-bottom: 1em;
                }
                .prose h1,
                .prose h2,
                .prose h3 {
                }
            `}</style>

            {isLoading && !hasMounted ? (
                <div className="fixed inset-0 bg-zinc-950 flex items-center justify-center z-50">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-lg text-zinc-400">Loading...</p>
                    </div>
                </div>
            ) : (
                <>
                    <header className="sticky top-0 z-10 border-b border-zinc-800 bg-gradient-to-br from-zinc-950 via-black/90 to-zinc-950 backdrop-blur-sm">
                        <div className="max-w-7xl mx-auto px-4 flex h-20 items-center justify-between">
                            <div className="flex text-lg font-bold tracking-tight text-white items-center gap-3">
                                <div className="relative h-10 w-10 overflow-hidden rounded-full bg-zinc-800 border border-zinc-700 transition-all duration-300 ease-in-out hover:scale-105 cursor-pointer"
                                    onClick={() => navigateTo("home")}>
                                    <img
                                        src={boxer.image || "/placeholder.svg"}
                                        alt=""
                                        width={40}
                                        height={40}
                                        className="object-cover w-full h-full"
                                        loading="lazy"
                                    />
                                </div>
                                <div 
                                    className="cursor-pointer"
                                    onClick={() => navigateTo("home")}>
                                    Mike
                                    <span className="text-lg mx-1 font-bold tracking-tight text-red-500">"The Thunder"</span>
                                    Johnson
                                </div>
                            </div>
                            <nav className="hidden md:flex items-center gap-8">
                                <button
                                    className={`text-base font-medium ${
                                        activeTab === "home" ? "text-red-500" : "text-zinc-400 hover:text-white"
                                    } transition-colors duration-300 ease-in-out`}
                                    onClick={() => navigateTo("home")}
                                >
                                    Home
                                </button>
                                <button
                                    className={`text-base font-medium ${
                                        activeTab === "blog" ? "text-red-500" : "text-zinc-400 hover:text-white"
                                    } transition-colors duration-300 ease-in-out`}
                                    onClick={() => navigateTo("blog")}
                                >
                                    Blog
                                </button>
                                <button
                                    className={`text-base font-medium ${
                                        activeTab === "tournaments" ? "text-red-500" : "text-zinc-400 hover:text-white"
                                    } transition-colors duration-300 ease-in-out`}
                                    onClick={() => navigateTo("tournaments")}
                                >
                                    Tournaments
                                </button>
                                <button
                                    className={`text-base font-medium ${
                                        activeTab === "write" ? "text-red-500" : "text-zinc-400 hover:text-white"
                                    } transition-colors duration-300 ease-in-out`}
                                    onClick={() => navigateTo("write")}
                                >
                                    Write
                                </button>
                            </nav>
                            <div className="md:hidden">
                                <button
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                    className="text-zinc-400 hover:text-white transition-colors duration-200 p-2"
                                    aria-label="Toggle menu"
                                    aria-expanded={mobileMenuOpen}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <line x1="4" x2="20" y1="12" y2="12"></line>
                                        <line x1="4" x2="20" y1="6" y2="6"></line>
                                        <line x1="4" x2="20" y1="18" y2="18"></line>
                                    </svg>
                                </button>
                                {mobileMenuOpen && (
                                    <div className="absolute top-20 left-0 right-0 bg-zinc-900 border-y border-zinc-800 p-4 z-20 animate-fadeIn shadow-lg">
                                        <div className="grid gap-4 py-4">
                                            <button
                                                className={`w-full text-left p-3 rounded-md font-medium transition-colors duration-200 ${
                                                    activeTab === "home" ? "bg-red-600/20 text-red-400" : "text-zinc-300 hover:bg-zinc-800"
                                                }`}
                                                onClick={() => {
                                                    navigateTo("home");
                                                    setMobileMenuOpen(false);
                                                }}
                                            >
                                                Home
                                            </button>
                                            <button
                                                className={`w-full text-left p-3 rounded-md font-medium transition-colors duration-200 ${
                                                    activeTab === "blog" ? "bg-red-600/20 text-red-400" : "text-zinc-300 hover:bg-zinc-800"
                                                }`}
                                                onClick={() => {
                                                    navigateTo("blog");
                                                    setMobileMenuOpen(false);
                                                }}
                                            >
                                                Blog
                                            </button>
                                            <button
                                                className={`w-full text-left p-3 rounded-md font-medium transition-colors duration-200 ${
                                                    activeTab === "tournaments" ? "bg-red-600/20 text-red-400" : "text-zinc-300 hover:bg-zinc-800"
                                                }`}
                                                onClick={() => {
                                                    navigateTo("tournaments");
                                                    setMobileMenuOpen(false);
                                                }}
                                            >
                                                Tournaments
                                            </button>
                                            <button
                                                className={`w-full text-left p-3 rounded-md font-medium transition-colors duration-200 ${
                                                    activeTab === "write" ? "bg-red-600/20 text-red-400" : "text-zinc-300 hover:bg-zinc-800"
                                                }`}
                                                onClick={() => {
                                                    navigateTo("write");
                                                    setMobileMenuOpen(false);
                                                }}
                                            >
                                                Write
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>

                    <main className="max-w-7xl mx-auto px-4 py-16">
                        {activeTab === "home" && renderHome()}
                        {activeTab === "blog" && renderBlog()}
                        {activeTab === "tournaments" && renderTournaments()}
                        {activeTab === "write" && renderWrite()}
                    </main>

                    <footer className="border-t border-zinc-800 bg-zinc-900">
                        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-12">
                                <div className="lg:col-span-6">
                                    <h3 className="text-xl font-bold mb-4 text-white">
                                        About Mike <span className="text-red-500">"The Thunder"</span> Johnson
                                    </h3>
                                    <p className="text-zinc-400 leading-relaxed max-w-2xl">{boxer.bio}</p>
                                </div>
                                <div className="lg:col-span-3">
                                    <h3 className="text-xl font-bold mb-4 text-white">Quick Links</h3>
                                    <nav className="flex flex-col gap-3">
                                        <button
                                            className="w-fit justify-start p-0 h-auto text-zinc-400 hover:text-red-500 text-left transition-colors duration-200"
                                            onClick={() => navigateTo("home")}
                                        >
                                            Home
                                        </button>
                                        <button
                                            className="w-fit justify-start p-0 h-auto text-zinc-400 hover:text-red-500 text-left transition-colors duration-200"
                                            onClick={() => navigateTo("blog")}
                                        >
                                            Blog
                                        </button>
                                        <button
                                            className="w-fit justify-start p-0 h-auto text-zinc-400 hover:text-red-500 text-left transition-colors duration-200"
                                            onClick={() => navigateTo("tournaments")}
                                        >
                                            Tournaments
                                        </button>
                                        <button
                                            className="w-fit justify-start p-0 h-auto text-zinc-400 hover:text-red-500 text-left transition-colors duration-200"
                                            onClick={() => navigateTo("write")}
                                        >
                                            Write
                                        </button>
                                    </nav>
                                </div>
                                <div className="lg:col-span-3">
                                    <h3 className="text-xl font-bold mb-4 text-white">Connect</h3>
                                    <div className="flex gap-4">
                                        <a
                                            href="#"
                                            aria-label="Facebook"
                                            className="h-10 w-10 rounded-full border border-zinc-700 text-zinc-400 hover:text-red-500 hover:border-red-500 flex items-center justify-center transition-all duration-300 ease-in-out"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="transition-colors duration-300 ease-in-out"
                                            >
                                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                            </svg>
                                        </a>
                                        <a
                                            href="#"
                                            aria-label="Instagram"
                                            className="h-10 w-10 rounded-full border border-zinc-700 text-zinc-400 hover:text-red-500 hover:border-red-500 flex items-center justify-center transition-all duration-300 ease-in-out"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="transition-colors duration-300 ease-in-out"
                                            >
                                                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                                            </svg>
                                        </a>
                                        <a
                                            href="#"
                                            aria-label="Twitter"
                                            className="h-10 w-10 rounded-full border border-zinc-700 text-zinc-400 hover:text-red-500 hover:border-red-500 flex items-center justify-center transition-all duration-300 ease-in-out"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="transition-colors duration-300 ease-in-out"
                                            >
                                                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                                            </svg>
                                        </a>
                                        <a
                                            href="#"
                                            aria-label="LinkedIn"
                                            className="h-10 w-10 rounded-full border border-zinc-700 text-zinc-400 hover:text-red-500 hover:border-red-500 flex items-center justify-center transition-all duration-300 ease-in-out"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="transition-colors duration-300 ease-in-out"
                                            >
                                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                                <rect width="4" height="12" x="2" y="9" />
                                                <circle cx="4" cy="4" r="2" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="border-t border-zinc-800 mt-10 pt-8 text-center text-sm text-zinc-500">
                                <p>
                                    © {hasMounted ? new Date().getFullYear() : "..."} {boxer.name}. All rights reserved.
                                </p>
                            </div>
                        </div>
                    </footer>
                </>
            )}
        </div>
    );
};

export default BoxerBlog;
