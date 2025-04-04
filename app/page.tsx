"use client";

import { Home, Search, Library, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize2, ListMusic, ChevronLeft, ChevronRight, Bell, Download, User2, } from "lucide-react";
import Image from "next/image";
import { useState, useMemo, useEffect, useRef } from "react";


const fadeInUpAnimation = `
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate3d(0, 1rem, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes fadeOutDown {
  from {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
  to {
    opacity: 0;
    transform: translate3d(0, 1rem, 0);
  }
}

.group:hover .fadeInUp {
  animation: fadeInUp 0.25s ease-out forwards;
}

.group:not(:hover) .fadeInUp {
  animation: fadeOutDown 0.25s ease-in forwards;
}
`;


type Song = {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  image: string;
};

type PlaylistItem = {
  id: string;
  title: string;
  description?: string;
  image: string;
  type?: string;
};

type Section = "home" | "search" | "library";

type LibraryFilter = "Playlists" | "Albums" | "Artists";

export default function SpotifyClone() {
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("3:42");
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const previousVolume = useState(50)[0];
  const [currentSection, setCurrentSection] = useState<Section>("home");
  const [libraryFilter, setLibraryFilter] = useState<LibraryFilter>("Playlists");
  const [scrollY, setScrollY] = useState(0);
  const mainContentRef = useRef<HTMLDivElement>(null);

  // Update scroll event listener to use the main content's scroll position
  useEffect(() => {
    const mainContent = mainContentRef.current;
    if (!mainContent) return;
    
    const handleScroll = () => {
      setScrollY(mainContent.scrollTop);
    };
    
    mainContent.addEventListener("scroll", handleScroll);
    return () => {
      mainContent.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Clear search query when changing sections
  const handleSectionChange = (section: Section) => {
    setCurrentSection(section);
    if (section !== "search") {
      setSearchQuery("");
    }
  };

  
  const songs: Song[] = [
    { id: "song-1", title: "Internet Friends", artist: "Knife Party", album: "Rage Valley", duration: "3:42", image: "https://picsum.photos/200?1" },
    { id: "song-2", title: "Strobe", artist: "Deadmau5", album: "For Lack of a Better Name", duration: "4:56", image: "https://picsum.photos/200?2" },
    { id: "song-3", title: "Language", artist: "Porter Robinson", album: "Language EP", duration: "3:37", image: "https://picsum.photos/200?3" },
    { id: "song-4", title: "Ghosts n Stuff", artist: "Deadmau5", album: "For Lack of a Better Name", duration: "4:12", image: "https://picsum.photos/200?4" },
    { id: "song-5", title: "Shelter", artist: "Porter Robinson & Madeon", album: "Shelter", duration: "3:45", image: "https://picsum.photos/200?5" },
    { id: "song-6", title: "Sad Machine", artist: "Porter Robinson", album: "Worlds", duration: "5:10", image: "https://picsum.photos/200?6" },
  ];

  
  const newMusicFriday: PlaylistItem[] = [
    { id: "nmf-1", title: "New Music Friday", description: "New music from Taylor Swift, The Weeknd, Drake and more", image: "https://avatars.githubusercontent.com/u/1234" },
    { id: "nmf-2", title: "Release Radar", description: "Catch all the latest music from artists you follow", image: "https://avatars.githubusercontent.com/u/2345" },
    { id: "nmf-3", title: "Best of March", description: "The best tracks of March 2025. Cover: Calvin Harris", image: "https://avatars.githubusercontent.com/u/3456" },
    { id: "nmf-4", title: "Fresh Finds", description: "The latest discoveries in indie music", image: "https://avatars.githubusercontent.com/u/4567" },
    { id: "nmf-5", title: "All New Pop", description: "The hottest new pop releases", image: "https://avatars.githubusercontent.com/u/5678" },
    { id: "nmf-6", title: "New Alternative", description: "Fresh alternative and indie rock releases", image: "https://avatars.githubusercontent.com/u/6789" }
  ];

  const dailyMixes: PlaylistItem[] = [
    { id: "dm-1", title: "Daily Mix 1", description: "Porter Robinson, Madeon, ODESZA and more", image: "https://randomuser.me/api/portraits/men/1.jpg" },
    { id: "dm-2", title: "Daily Mix 2", description: "Deadmau5, Daft Punk, The Chemical Brothers", image: "https://randomuser.me/api/portraits/men/2.jpg" },
    { id: "dm-3", title: "Daily Mix 3", description: "Flume, Disclosure, Rüfüs Du Sol", image: "https://randomuser.me/api/portraits/men/3.jpg" },
    { id: "dm-4", title: "Daily Mix 4", description: "Tycho, Bonobo, Four Tet and more", image: "https://randomuser.me/api/portraits/men/4.jpg" },
    { id: "dm-5", title: "Daily Mix 5", description: "Justice, SebastiAn, Kavinsky and more", image: "https://randomuser.me/api/portraits/men/5.jpg" },
    { id: "dm-6", title: "Daily Mix 6", description: "Aphex Twin, Boards of Canada, Autechre", image: "https://randomuser.me/api/portraits/men/6.jpg" }
  ];

  const recentlyPlayed: PlaylistItem[] = [
    { id: "rp-1", title: "Daily Mix 1", type: "Mix", description: "Your daily music mix", image: "https://picsum.photos/200?1" },
    { id: "rp-2", title: "Electronic Essentials", type: "Playlist", description: "The best electronic tracks", image: "https://picsum.photos/200?2" },
    { id: "rp-3", title: "This Is Porter Robinson", type: "Playlist", description: "All the essential Porter Robinson tracks", image: "https://picsum.photos/200?3" },
    { id: "rp-4", title: "Liked Songs", type: "Playlist", description: "Your favorite tracks", image: "https://picsum.photos/200?4" },
    { id: "rp-5", title: "Porter Robinson", type: "Artist", description: "Artist", image: "https://picsum.photos/200?5" },
    { id: "rp-6", title: "Deadmau5", type: "Artist", description: "Artist", image: "https://picsum.photos/200?6" },
    { id: "rp-7", title: "Daft Punk", type: "Artist", description: "Artist", image: "https://picsum.photos/200?7" }
  ];

  
  const browseCategories = [
    { id: "cat-music", title: "Music", color: "bg-pink-600", image: "https://picsum.photos/200?1" },
    { id: "cat-podcasts", title: "Podcasts", color: "bg-emerald-700", image: "https://picsum.photos/200?2" },
    { id: "cat-audiobooks", title: "Audiobooks", color: "bg-blue-800", image: "https://picsum.photos/200?3" },
    { id: "cat-live", title: "Live Events", color: "bg-purple-600", image: "https://picsum.photos/200?4" },
    { id: "cat-made-for-you", title: "Made For You", color: "bg-blue-900", image: "https://picsum.photos/200?5" },
    { id: "cat-new-releases", title: "New Releases", color: "bg-orange-700", image: "https://picsum.photos/200?6" },
    { id: "cat-hip-hop", title: "Hip-Hop", color: "bg-slate-600", image: "https://picsum.photos/200?7" },
    { id: "cat-pop", title: "Pop", color: "bg-slate-500", image: "https://picsum.photos/200?8" },
    { id: "cat-country", title: "Country", color: "bg-orange-600", image: "https://picsum.photos/200?9" },
    { id: "cat-latin", title: "Latin", color: "bg-blue-600", image: "https://picsum.photos/200?10" },
    { id: "cat-podcast-charts", title: "Podcast Charts", color: "bg-blue-500", image: "https://picsum.photos/200?11" },
    { id: "cat-podcast-new", title: "Podcast New Releases", color: "bg-emerald-600", image: "https://picsum.photos/200?12" }
  ];

  
  const searchResults = useMemo(() => {
    if (!searchQuery) return null;
    
    const query = searchQuery.toLowerCase();
    const matchedSongs = songs.filter(song => 
      song.title.toLowerCase().includes(query) || 
      song.artist.toLowerCase().includes(query) ||
      song.album.toLowerCase().includes(query)
    );
    
    const matchedPlaylists = [...newMusicFriday, ...dailyMixes].filter(playlist =>
      playlist.title.toLowerCase().includes(query) ||
      playlist.description?.toLowerCase().includes(query)
    );

    return {
      songs: matchedSongs,
      playlists: matchedPlaylists
    };
  }, [searchQuery]);

  
  const libraryItems = [
    { id: "lib-1", title: "Liked Songs", type: "Playlist", image: "https://picsum.photos/200?lib1", gradient: "from-purple-400 to-purple-600" },
    { id: "lib-2", title: "DJ", type: "Playlist", image: "https://picsum.photos/200?lib2", isSpotify: true, beta: true },
    { id: "lib-3", title: "This Is League of Legends", type: "Playlist", image: "https://picsum.photos/200?lib3", isSpotify: true },
    { id: "lib-4", title: "Porter Robinson", type: "Artist", image: "https://picsum.photos/200?lib4", isSpotify: true },
    { id: "lib-5", title: "Daily Mix 1", type: "Mix", image: "https://picsum.photos/200?lib5", isSpotify: true },
    { id: "lib-6", title: "Your Top Songs 2023", type: "Playlist", image: "https://picsum.photos/200?lib6", isSpotify: true },
  ];

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0) {
      setIsMuted(false);
    }
  };

  const handleMuteToggle = () => {
    if (isMuted) {
      setVolume(previousVolume);
    } else {
      setVolume(0);
    }
    setIsMuted(!isMuted);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // If we're not already in search section, navigate there for top navbar searches
    if (query.trim() !== '' && currentSection !== "search") {
      setCurrentSection("search");
    }
  };

  // Handle search for dedicated search section
  const handleSearchSectionInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const renderMainContent = () => {
    switch (currentSection) {
      case "search":
        return (
          <>
            <div className="sticky top-20 z-10 pb-4 bg-gradient-to-b from-zinc-900 to-transparent">
              <div className="relative">
                <input
                  type="text"
                  placeholder="What do you want to listen to?"
                  value={searchQuery}
                  onChange={handleSearchSectionInput}
                  className="w-full bg-zinc-800 text-white rounded-full py-3 pl-12 pr-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                  autoFocus
                />
                <Search className="absolute left-4 top-3.5 h-6 w-6 text-gray-400" />
              </div>
            </div>

            {searchQuery ? (
              
              <div className="space-y-8">
                {searchResults?.songs && searchResults.songs.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-plus-jakarta font-bold text-white mb-4">Songs</h2>
                    <div className="bg-zinc-800/30 rounded-md">
                      {searchResults.songs.map((song) => (
                        <div 
                          key={`search-song-${song.id}`}
                          className="flex items-center gap-4 p-4 hover:bg-zinc-800/50 transition-colors duration-75 cursor-pointer group"
                        >
                          <div className="relative h-12 w-12 flex-shrink-0">
                            <Image
                              src={song.image}
                              alt={song.title}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white font-plus-jakarta font-semibold">{song.title}</h3>
                            <p className="text-sm text-gray-400 font-figtree">{song.artist}</p>
                          </div>
                          <span className="text-sm text-gray-400 font-figtree">{song.duration}</span>
                          <button className="opacity-0 bg-green-500 rounded-full p-2 text-black hover:scale-105 shadow-lg cursor-pointer fadeInUp">
                            <Play fill="black" size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {searchResults?.playlists && searchResults.playlists.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-plus-jakarta font-bold text-white mb-4">Playlists</h2>
                    <div className="grid grid-cols-5 gap-6">
                      {searchResults.playlists.map((playlist) => (
                        <div key={`search-playlist-${playlist.id}`} className="bg-zinc-800/30 p-4 rounded-md hover:bg-zinc-800/50 transition-colors duration-75 cursor-pointer group">
                          <div className="relative aspect-square mb-4">
                            <Image
                              src={playlist.image}
                              alt={playlist.title}
                              fill
                              className="object-cover rounded-md"
                            />
                            <button className="absolute bottom-2 right-2 opacity-0 bg-green-500 rounded-full p-3 text-black hover:scale-105 shadow-lg cursor-pointer fadeInUp">
                              <Play fill="black" size={20} />
                            </button>
                          </div>
                          <h3 className="text-white font-plus-jakarta font-bold truncate">{playlist.title}</h3>
                          <p className="text-sm text-gray-400 font-figtree mt-1 line-clamp-2">{playlist.description}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {(!searchResults?.songs?.length && !searchResults?.playlists?.length) && (
                  <div className="text-center py-12">
                    <h2 className="text-2xl font-plus-jakarta font-bold text-white mb-2">No results found for "{searchQuery}"</h2>
                    <p className="text-gray-400 font-figtree">Try searching for something else</p>
                  </div>
                )}
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-plus-jakarta font-bold text-white mb-6">Browse all</h2>
                <div className="grid grid-cols-4 gap-6">
                  {browseCategories.map((category) => (
                    <div
                      key={`category-${category.id}`}
                      className={`${category.color} rounded-lg aspect-[2/1] relative overflow-hidden cursor-pointer hover:brightness-110 transition-all duration-75`}
                    >
                      <h3 className="text-2xl font-plus-jakarta font-bold text-white p-4 relative z-10">
                        {category.title}
                      </h3>
                      <div className="absolute right-0 bottom-0 w-24 h-24 transform rotate-[25deg] translate-x-4 translate-y-4">
                        <Image
                          src={category.image}
                          alt={category.title}
                          fill
                          className="object-cover rounded-lg shadow-xl"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        );
      case "library":
        return (
          <div className="space-y-6">
            
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-plus-jakarta font-bold text-white">Your Library</h2>
            </div>

            
            <div className="flex gap-x-2">
              {(["Playlists", "Albums", "Artists"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setLibraryFilter(filter)}
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold cursor-pointer ${
                    libraryFilter === filter
                      ? "bg-zinc-700 text-white"
                      : "text-white hover:bg-zinc-800"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            
            <div className="grid grid-cols-5 gap-6">
              {libraryItems
                .filter(item => {
                  switch (libraryFilter) {
                    case "Playlists":
                      return item.type === "Playlist" || item.type === "Mix";
                    case "Albums":
                      return item.type === "Album";
                    case "Artists":
                      return item.type === "Artist";
                    default:
                      return true;
                  }
                })
                .map((item) => (
                <div
                  key={item.id}
                  className="bg-zinc-800/30 p-4 rounded-lg hover:bg-zinc-800/50 transition-colors duration-75 cursor-pointer group"
                >
                  <div className={`relative aspect-square mb-4 ${
                    item.title === "Liked Songs" 
                      ? `bg-gradient-to-br ${item.gradient} rounded-md`
                      : ""
                  }`}>
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className={`object-cover rounded-md ${item.title === "Liked Songs" ? "opacity-0" : ""}`}
                    />
                    {item.title === "Liked Songs" && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="white">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                      </div>
                    )}
                    <button className="absolute bottom-2 right-2 opacity-0 bg-green-500 rounded-full p-3 text-black hover:scale-105 shadow-lg cursor-pointer fadeInUp">
                      <Play fill="black" size={20} />
                    </button>
                  </div>
                  <h3 className="text-white font-plus-jakarta font-bold truncate">{item.title}</h3>
                  <div className="flex items-center gap-x-2 mt-1">
                    {item.isSpotify && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#1DB954">
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                      </svg>
                    )}
                    <span className="text-sm text-gray-400">{item.type}</span>
                    {item.beta && (
                      <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-blue-500 text-white rounded">
                        BETA
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <>
            
            {searchQuery ? (
              
              <div className="space-y-8">
                
              </div>
            ) : (
              
              <>
                
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-plus-jakarta font-bold text-white">It's New Music Friday!</h2>
                    <button className="text-gray-400 hover:text-white hover:underline transition-all duration-75 text-sm font-semibold cursor-pointer">
                      Show all
                    </button>
                  </div>
                  <div className="grid grid-cols-6 gap-6">
                    {newMusicFriday.map((item) => (
                      <div key={`new-music-${item.id}`} className="bg-zinc-800/30 p-4 rounded-md hover:bg-zinc-800/50 transition-colors duration-75 cursor-pointer group">
                        <div className="relative aspect-square mb-4">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover rounded-md"
                          />
                          <button className="absolute bottom-2 right-2 opacity-0 bg-green-500 rounded-full p-3 text-black hover:scale-105 shadow-lg cursor-pointer fadeInUp">
                            <Play fill="black" size={20} />
                          </button>
                        </div>
                        <h3 className="text-white font-plus-jakarta font-bold truncate">{item.title}</h3>
                        <p className="text-sm text-gray-400 font-figtree mt-1 line-clamp-2">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </section>

                
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-plus-jakarta font-bold text-white">Made For You</h2>
                    <button className="text-gray-400 hover:text-white hover:underline transition-all duration-75 text-sm font-semibold cursor-pointer">
                      Show all
                    </button>
                  </div>
                  <div className="grid grid-cols-6 gap-6">
                    {dailyMixes.map((mix) => (
                      <div key={`daily-mix-${mix.id}`} className="bg-zinc-800/30 p-4 rounded-md hover:bg-zinc-800/50 transition-colors duration-75 cursor-pointer group">
                        <div className="relative aspect-square mb-4">
                          <Image
                            src={mix.image}
                            alt={mix.title}
                            fill
                            className="object-cover rounded-md"
                          />
                          <button className="absolute bottom-2 right-2 opacity-0 bg-green-500 rounded-full p-3 text-black hover:scale-105 shadow-lg cursor-pointer fadeInUp">
                            <Play fill="black" size={20} />
                          </button>
                        </div>
                        <h3 className="text-white font-plus-jakarta font-bold truncate">{mix.title}</h3>
                        <p className="text-sm text-gray-400 font-figtree mt-1 line-clamp-2">{mix.description}</p>
                      </div>
                    ))}
                  </div>
                </section>

                
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-plus-jakarta font-bold text-white">Recently played</h2>
                    <button className="text-gray-400 hover:text-white hover:underline transition-all duration-75 text-sm font-semibold cursor-pointer">
                      Show all
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-6">
                    {recentlyPlayed.map((item) => (
                      <div key={`recently-played-${item.id}`} className="bg-zinc-800/30 p-4 rounded-md hover:bg-zinc-800/50 transition-colors duration-75 cursor-pointer group">
                        <div className="relative aspect-square mb-4">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover rounded-md"
                          />
                          <button className="absolute bottom-2 right-2 opacity-0 bg-green-500 rounded-full p-3 text-black hover:scale-105 shadow-lg cursor-pointer fadeInUp">
                            <Play fill="black" size={20} />
                          </button>
                        </div>
                        <h3 className="text-white font-plus-jakarta font-bold truncate">{item.title}</h3>
                        <p className="text-sm text-gray-400 font-figtree mt-1">{item.type}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}
          </>
        );
    }
  };

  return (
    <>
      <style jsx global>{fadeInUpAnimation}</style>
      <div className="flex flex-col h-screen bg-black">
        <div className="flex flex-1 overflow-hidden">
          
          <nav className="w-64 bg-black p-6 flex flex-col gap-y-6">
            
            <div className="space-y-4">
              <div 
                className={`flex items-center gap-x-4 group cursor-pointer ${
                  currentSection === "home" 
                    ? "text-green-500" 
                    : "text-gray-400 hover:text-green-500"
                }`}
                onClick={() => handleSectionChange("home")}
              >
                <Home className="h-6 w-6 transition-colors duration-75" />
                <span className="font-plus-jakarta font-semibold transition-colors duration-75">Home</span>
              </div>
              <div 
                className={`flex items-center gap-x-4 group cursor-pointer ${
                  currentSection === "search" 
                    ? "text-green-500" 
                    : "text-gray-400 hover:text-green-500"
                }`}
                onClick={() => handleSectionChange("search")}
              >
                <Search className="h-6 w-6 transition-colors duration-75" />
                <span className="font-plus-jakarta font-semibold transition-colors duration-75">Search</span>
              </div>
              <div 
                className={`flex items-center gap-x-4 group cursor-pointer ${
                  currentSection === "library" 
                    ? "text-green-500" 
                    : "text-gray-400 hover:text-green-500"
                }`}
                onClick={() => handleSectionChange("library")}
              >
                <Library className="h-6 w-6 transition-colors duration-75" />
                <span className="font-plus-jakarta font-semibold transition-colors duration-75">Your Library</span>
              </div>
            </div>

            
            <div className="mt-8">
              <div className="bg-zinc-900 rounded-lg p-4 space-y-4">
                <h2 className="text-white font-plus-jakarta font-bold">Create your first playlist</h2>
                <p className="text-sm text-gray-400 font-figtree">It's easy, we'll help you</p>
                <button className="bg-white text-black rounded-full px-4 py-2 font-figtree font-semibold text-sm hover:scale-105 transition-transform duration-75 cursor-pointer">
                  Create playlist
                </button>
              </div>
            </div>
          </nav>

          
          <main ref={mainContentRef} className="flex-1 bg-gradient-to-b from-zinc-900 to-black p-6 overflow-y-auto">
            <div className={`sticky top-0 z-40 flex items-center justify-between w-full mb-6 py-3 transition-all duration-200 ${
              scrollY > 10 
                ? 'bg-zinc-900/80 backdrop-blur-lg border-b border-zinc-800/50 px-1 rounded-lg shadow-md' 
                : ''
            }`}>
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  <button className="bg-black/70 rounded-full p-2 cursor-pointer hover:bg-black/90 transition-colors duration-75">
                    <ChevronLeft className="h-6 w-6 text-white" />
                  </button>
                  <button className="bg-black/70 rounded-full p-2 cursor-pointer hover:bg-black/90 transition-colors duration-75">
                    <ChevronRight className="h-6 w-6 text-white" />
                  </button>
                </div>
                {currentSection !== "search" && (
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="What do you want to listen to?"
                      value={searchQuery}
                      onChange={handleSearch}
                      className="bg-zinc-800 text-white rounded-full py-2 pl-10 pr-4 w-80 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4">
                <button className="text-white hover:scale-105 transition-transform duration-75 cursor-pointer">
                  <Bell className="h-6 w-6" />
                </button>
                <button className="text-white hover:scale-105 transition-transform duration-75 cursor-pointer">
                  <Download className="h-6 w-6" />
                </button>
                <button className="bg-black/70 rounded-full p-1 cursor-pointer hover:bg-black/90 transition-colors duration-75">
                  <User2 className="h-6 w-6 text-white" />
                </button>
              </div>
            </div>

            <div className="max-w-7xl mx-auto space-y-8">
              {renderMainContent()}
            </div>
          </main>
        </div>

        
        <div className="h-24 bg-zinc-900 border-t border-zinc-800 px-4">
          <div className="flex items-center justify-between h-full">
            
            <div className="flex items-center gap-x-4 w-1/3">
              <div className="relative h-14 w-14">
                <Image
                  src="https://picsum.photos/200?random=current"
                  alt="Now playing"
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <div>
                <h4 className="text-white font-plus-jakarta font-semibold text-sm hover:text-green-500 transition-colors duration-75 cursor-pointer">Internet Friends</h4>
                <p className="text-gray-400 text-xs font-figtree hover:text-green-500 transition-colors duration-75 cursor-pointer">Knife Party</p>
              </div>
            </div>

            
            <div className="flex flex-col items-center w-1/3">
              <div className="flex items-center gap-x-6">
                <button className="text-gray-400 hover:text-white transition-colors duration-75 cursor-pointer">
                  <SkipBack size={20} />
                </button>
                <button 
                  className="bg-white rounded-full p-2 text-black hover:scale-105 transition-transform duration-75 cursor-pointer"
                  onClick={handlePlayPause}
                >
                  {isPlaying ? <Pause fill="black" size={20} /> : <Play fill="black" size={20} />}
                </button>
                <button className="text-gray-400 hover:text-white transition-colors duration-75 cursor-pointer">
                  <SkipForward size={20} />
                </button>
              </div>
              <div className="flex items-center gap-x-2 mt-2 w-full">
                <span className="text-xs text-gray-400 font-figtree w-10 text-right">{currentTime}</span>
                <div className="h-1 flex-1 bg-gray-600 rounded-full">
                  <div className="h-1 w-1/3 bg-green-500 rounded-full relative">
                    <div className="absolute -right-2 -top-2 h-4 w-4 bg-white rounded-full opacity-0 group-hover:opacity-100" />
                  </div>
                </div>
                <span className="text-xs text-gray-400 font-figtree w-10">{duration}</span>
              </div>
            </div>

            
            <div className="flex items-center gap-x-4 w-1/3 justify-end">
              <button className="text-gray-400 hover:text-white transition-colors duration-75 cursor-pointer">
                <ListMusic size={20} />
              </button>
              <button 
                className="text-gray-400 hover:text-white transition-colors duration-75 cursor-pointer"
                onClick={handleMuteToggle}
              >
                {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <div className="w-24 group relative flex items-center">
                <div className="w-full h-1 bg-gray-600 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full" 
                    style={{ width: `${volume}%` }}
                  ></div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full h-1 appearance-none absolute inset-0 cursor-pointer opacity-0 z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                />
                <div 
                  className="absolute h-3 w-3 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-75 pointer-events-none"
                  style={{ left: `calc(${volume}% - 6px)` }}
                ></div>
              </div>
              <button className="text-gray-400 hover:text-white transition-colors duration-75 cursor-pointer">
                <Maximize2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


