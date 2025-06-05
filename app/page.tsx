"use client";

import type React from "react";
import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Star, ChevronDown, X, Plus, Minus, Trash2, Check, Clock, Truck, Shield, Zap } from "lucide-react";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-plus-jakarta-sans",
});

type Size = "UK 6" | "UK 7" | "UK 8" | "UK 9" | "UK 10" | "UK 11";

type Color = "Black" | "White" | "Brown" | "Red" | "Blue" | "Green" | "Grey" | "Chestnut";

type Shoe = {
    id: number;
    name: string;
    brand: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviews: number;
    image: string;
    sizes: Size[];
    colors: Color[];
    category: string;
    isNew?: boolean;
    isBestSeller?: boolean;
    discount?: string;
};

type CartItem = {
    shoe: Shoe;
    size: Size;
    color: Color;
    quantity: number;
};

type ToastProps = {
    message: string;
    onClose: () => void;
};

const shoes: Shoe[] = [
    {
        id: 1,
        name: "SkyStep Air Flow 270",
        brand: "SkyStep",
        price: 129.99,
        originalPrice: 149.99,
        rating: 4.5,
        reviews: 120,
        image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=2864&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"],
        colors: ["Black", "White", "Red"],
        category: "Running",
        isNew: true,
        discount: "13%",
    },
    {
        id: 2,
        name: "UrbanStride UltraMax Pro",
        brand: "UrbanStride",
        price: 149.99,
        originalPrice: 179.99,
        rating: 4.7,
        reviews: 150,
        image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=2798&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
        sizes: ["UK 6", "UK 7", "UK 8", "UK 9"],
        colors: ["Black", "White", "Blue"],
        category: "Running",
        isBestSeller: true,
    },
    {
        id: 3,
        name: "StreetFlow Classic Style",
        brand: "StreetFlow",
        price: 69.99,
        rating: 4.4,
        reviews: 80,
        image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=698&q=80",
        sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"],
        colors: ["Black", "White", "Brown", "Red"],
        category: "Casual",
        isNew: true,
    },
    {
        id: 4,
        name: "ClassicWalk Retro 70",
        brand: "ClassicWalk",
        price: 59.99,
        originalPrice: 69.99,
        rating: 4.6,
        reviews: 200,
        image: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?q=80&w=2931&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"],
        colors: ["Black", "White", "Red", "Blue"],
        category: "Casual",
        isBestSeller: true,
        discount: "14%",
    },
    {
        id: 5,
        name: "BalanceCore Classic 574",
        brand: "BalanceCore",
        price: 79.99,
        rating: 4.3,
        reviews: 50,
        image: "https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"],
        colors: ["Black", "White", "Grey", "Blue"],
        category: "Casual",
    },
    {
        id: 6,
        name: "ToughTread Outdoor Boots",
        brand: "ToughTread",
        price: 129.99,
        originalPrice: 149.99,
        rating: 4.5,
        reviews: 70,
        image: "https://images.unsplash.com/photo-1562183241-b937e95585b6?q=80&w=3165&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=735&q=80",
        sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"],
        colors: ["Black", "Brown", "Chestnut"],
        category: "Formal",
        isNew: true,
        discount: "13%",
    },
    {
        id: 7,
        name: "DurableStep Classic 1460",
        brand: "DurableStep",
        price: 119.99,
        rating: 4.4,
        reviews: 60,
        image: "https://images.unsplash.com/photo-1610398752800-146f269dfcc8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
        sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"],
        colors: ["Black", "Brown", "Red"],
        category: "Formal",
    },
    {
        id: 8,
        name: "FlexRun SportMax",
        brand: "FlexRun",
        price: 89.99,
        originalPrice: 109.99,
        rating: 4.2,
        reviews: 40,
        image: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=735&q=80",
        sizes: ["UK 6", "UK 7", "UK 8", "UK 9"],
        colors: ["Black", "White", "Blue", "Green"],
        category: "Sports",
        isBestSeller: true,
        discount: "18%",
    },
    {
        id: 9,
        name: "SkyStep Air Elite 1",
        brand: "SkyStep",
        price: 99.99,
        rating: 4.8,
        reviews: 180,
        image: "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
        colors: ["White", "Black", "Blue", "Red"],
        category: "Casual",
        isBestSeller: true,
    },
    {
        id: 10,
        name: "UrbanStride Motion R1",
        brand: "UrbanStride",
        price: 139.99,
        originalPrice: 159.99,
        rating: 4.5,
        reviews: 95,
        image: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?q=80&w=2031&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D",
        sizes: ["UK 7", "UK 8", "UK 9", "UK 10"],
        colors: ["Black", "White", "Grey", "Red"],
        category: "Running",
        isNew: true,
        discount: "12%",
    },
    {
        id: 11,
        name: "AeroFlex Performance 28",
        brand: "AeroFlex",
        price: 159.99,
        rating: 4.7,
        reviews: 65,
        image: "https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16?q=80&w=2980&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"],
        colors: ["Blue", "Black", "Grey"],
        category: "Running",
        isNew: true,
    },
    {
        id: 12,
        name: "CloudRunner Spirit 14",
        brand: "CloudRunner",
        price: 129.99,
        originalPrice: 139.99,
        rating: 4.6,
        reviews: 110,
        image: "https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        sizes: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
        colors: ["Grey", "Blue", "Black"],
        category: "Running",
        isBestSeller: true,
        discount: "7%",
    },
    {
        id: 13,
        name: "SmoothStride Journey 14",
        brand: "SmoothStride",
        price: 119.99,
        rating: 4.4,
        reviews: 75,
        image: "https://images.unsplash.com/photo-1499013819532-e4ff41b00669?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        sizes: ["UK 6", "UK 7", "UK 8", "UK 9"],
        colors: ["Blue", "Grey", "Black"],
        category: "Running",
        isNew: true,
    },
    {
        id: 14,
        name: "PowerStep Elite Pro",
        brand: "PowerStep",
        price: 109.99,
        originalPrice: 129.99,
        rating: 4.3,
        reviews: 60,
        image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        sizes: ["UK 7", "UK 8", "UK 9", "UK 10"],
        colors: ["Black", "Red", "Grey"],
        category: "Sports",
        discount: "15%",
    },
    {
        id: 15,
        name: "ComfortWalk Desert Boot",
        brand: "ComfortWalk",
        price: 119.99,
        rating: 4.5,
        reviews: 85,
        image: "https://images.unsplash.com/photo-1512990414788-d97cb4a25db3?q=80&w=3215&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"],
        colors: ["Brown", "Black", "Chestnut"],
        category: "Formal",
        isBestSeller: true,
    },
    {
        id: 16,
        name: "RetroFlex Heritage Leather",
        brand: "RetroFlex",
        price: 79.99,
        originalPrice: 89.99,
        rating: 4.4,
        reviews: 70,
        image: "https://images.unsplash.com/photo-1520256862855-398228c41684?q=80&w=1769&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D",
        sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"],
        colors: ["White", "Black", "Grey"],
        category: "Casual",
        discount: "11%",
    },
];

const Toast = ({ message, onClose }: ToastProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg flex items-center z-50 max-w-[calc(100%-2rem)]"
        >
            <Check className="w-5 h-5 mr-2 text-blue-400 flex-shrink-0" />
            <span className="line-clamp-2">{message}</span>
            <button
                onClick={onClose}
                className="ml-4 text-blue-400 hover:text-white cursor-pointer flex-shrink-0"
                aria-label="Close notification"
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
};

type CustomDropdownProps<T extends string> = {
    options: T[];
    selectedOption: T | null;
    onSelectOption: (option: T) => void;
    placeholder?: string;
    label: string;
};

const CustomDropdown = <T extends string>({
    options,
    selectedOption,
    onSelectOption,
    placeholder = "Select an option",
    label,
}: CustomDropdownProps<T>) => {
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
    }, [dropdownRef]);

    const handleSelect = (option: T) => {
        onSelectOption(option);
        setIsOpen(false);
    };

    return (
        <div className="relative z-20" ref={dropdownRef}>
            <label className="block text-sm font-medium text-gray-900 mb-2">{label}</label>
            <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-full cursor-pointer rounded-lg border border-gray-300 bg-white py-3 pl-4 pr-10 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-[#1C3738] focus:border-[#1C3738] sm:text-sm"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className="block truncate">
                    {selectedOption ? selectedOption : <span className="text-gray-500">{placeholder}</span>}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronDown
                        className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`}
                        aria-hidden="true"
                    />
                </span>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.ul
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
                        role="listbox"
                    >
                        {options.map((option) => (
                            <motion.li
                                key={option}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.1 }}
                                className={`relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                    selectedOption === option ? "bg-[#8BAAAD]/10 text-[#1C3738]" : "text-gray-900 hover:bg-gray-50"
                                }`}
                                onClick={() => handleSelect(option)}
                                role="option"
                                aria-selected={selectedOption === option}
                            >
                                <span className={`block truncate ${selectedOption === option ? "font-medium" : "font-normal"}`}>
                                    {option}
                                </span>
                                {selectedOption === option ? (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#1C3738]">
                                        <Check className="h-5 w-5" aria-hidden="true" />
                                    </span>
                                ) : null}
                            </motion.li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
};

const Home = () => {
    const [selectedShoe, setSelectedShoe] = useState<Shoe | null>(null);
    const [selectedSize, setSelectedSize] = useState<Size | null>(null);
    const [selectedColor, setSelectedColor] = useState<Color | null>(null);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [toast, setToast] = useState<string | null>(null);
    const [orderConfirmed, setOrderConfirmed] = useState(false);
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);
    const [wishlistItems, setWishlistItems] = useState<Shoe[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [productSizes, setProductSizes] = useState<Record<number, Size>>({});

    const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const handleAddToCart = () => {
        if (!selectedShoe || !selectedSize || !selectedColor) return;
        const existingItemIndex = cartItems.findIndex(
            (item) => item.shoe.id === selectedShoe.id && item.size === selectedSize && item.color === selectedColor
        );

        if (existingItemIndex !== -1) {
            const updatedCartItems = [...cartItems];
            updatedCartItems[existingItemIndex].quantity += 1;
            setCartItems(updatedCartItems);
            setToast(`Updated ${selectedShoe.name} quantity in cart`);
        } else {
            const newCartItem: CartItem = {
                shoe: selectedShoe,
                size: selectedSize,
                color: selectedColor,
                quantity: 1,
            };
            setCartItems([...cartItems, newCartItem]);
            setToast(`Added ${selectedShoe.name} to cart`);
        }

        setTimeout(() => {
            setToast(null);
        }, 3000);
    };

    const updateCartItemQuantity = (index: number, quantity: number) => {
        if (quantity < 1) return;
        const updatedCartItems = [...cartItems];
        updatedCartItems[index].quantity = quantity;
        setCartItems(updatedCartItems);
    };

    const removeCartItem = (index: number) => {
        const updatedCartItems = [...cartItems];
        updatedCartItems.splice(index, 1);
        setCartItems(updatedCartItems);
    };

    const handleWishlistToggle = (shoe: Shoe) => {
        const isInWishlist = wishlistItems.some((item) => item.id === shoe.id);
        if (isInWishlist) {
            setWishlistItems((prev) => prev.filter((item) => item.id !== shoe.id));
            setToast(`Removed ${shoe.name} from wishlist`);
        } else {
            setWishlistItems((prev) => [...prev, shoe]);
            setToast(`Added ${shoe.name} to wishlist`);
        }

        setTimeout(() => {
            setToast(null);
        }, 3000);
    };

    const handleOrderConfirmed = () => {
        setOrderConfirmed(true);
        setTimeout(() => {
            setCartItems([]);
            setIsCartOpen(false);

            setOrderSuccess(true);

            setTimeout(() => {
                setOrderConfirmed(false);

                setTimeout(() => {
                    setOrderSuccess(false);
                }, 3000);
            }, 1000);
        }, 2000);
    };

    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + item.shoe.price * item.quantity, 0).toFixed(2);
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, []);

    useEffect(() => {
        if (selectedShoe) {
            setSelectedSize(selectedShoe.sizes[0]);
            setSelectedColor(selectedShoe.colors[0]);
        }
    }, [selectedShoe]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsCartOpen(false);
                setIsSizeGuideOpen(false);
                setIsWishlistOpen(false);
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, []);

    useEffect(() => {
        if (isLoading) {
            const timer = setTimeout(() => setIsLoading(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [isLoading]);

    useEffect(() => {
        const hash = window.location.hash;
        if (hash === "#size-guide") {
            setIsSizeGuideOpen(true);
        } else if (hash === "#wishlist") {
            setIsWishlistOpen(true);
        }
    }, []);

    const handleProductClick = (shoe: Shoe) => {
        setSelectedShoe(shoe);
        setSelectedSize(shoe.sizes[0]);
        setSelectedColor(shoe.colors[0]);
    };

    const handleQuickAddToCart = (e: React.MouseEvent, shoe: Shoe) => {
        e.stopPropagation();

        const selectedSize = productSizes[shoe.id] || shoe.sizes[0];

        const cartItem: CartItem = {
            shoe: shoe,
            size: selectedSize,
            color: shoe.colors[0],
            quantity: 1,
        };

        const existingItemIndex = cartItems.findIndex(
            (item) => item.shoe.id === shoe.id && item.size === selectedSize && item.color === shoe.colors[0]
        );

        if (existingItemIndex !== -1) {
            const updatedCartItems = [...cartItems];
            updatedCartItems[existingItemIndex].quantity += 1;
            setCartItems(updatedCartItems);
            setToast(`Updated ${shoe.name} quantity in cart`);
        } else {
            setCartItems([...cartItems, cartItem]);
            setToast(`Added ${shoe.name} to cart`);
        }

        setIsCartOpen(true);

        setTimeout(() => {
            setToast(null);
        }, 3000);
    };

    return (
        <div className={`min-h-screen bg-[#F4FFF8]/90 text-[#000F08] ${plusJakartaSans.className}`}>
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold tracking-tight">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1C3738] to-[#8BAAAD]">
                                    Sole<span className="font-sans font-bold">Fusion</span>
                                </span>
                            </h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <motion.button
                                    onClick={() => setIsCartOpen(!isCartOpen)}
                                    className="relative p-3 rounded-full bg-[#1C3738] text-[#F4FFF8] hover:bg-[#4D4847] transition-all duration-100 shadow-md cursor-pointer"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    aria-label="Shopping cart"
                                >
                                    <ShoppingBag className="w-5 h-5" />
                                    {getCartCount() > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow-md">
                                            {getCartCount()}
                                        </span>
                                    )}
                                </motion.button>
                                <AnimatePresence>
                                    {isCartOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-[-4rem]  mt-3 w-[23rem] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-gray-100"
                                        >
                                            <div className="max-h-[80vh] overflow-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                                                <div className="sticky top-0 bg-gradient-to-r from-[#1C3738] to-[#4D4847] p-4 flex justify-between items-center text-[#F4FFF8] backdrop-blur-sm z-10">
                                                    <h2 className="font-medium flex items-center">
                                                        <ShoppingBag className="w-4 h-4 mr-2 opacity-80" />
                                                        Your Cart
                                                        {getCartCount() > 0 && (
                                                            <motion.span
                                                                initial={{ scale: 0.8, opacity: 0 }}
                                                                animate={{ scale: 1, opacity: 1 }}
                                                                className="ml-2 text-xs bg-white/20 py-1 px-2 rounded-full"
                                                            >
                                                                {getCartCount()} {getCartCount() === 1 ? "item" : "items"}
                                                            </motion.span>
                                                        )}
                                                    </h2>
                                                    <motion.button
                                                        whileHover={{
                                                            scale: 1.1,
                                                            backgroundColor: "rgba(255, 255, 255, 0.2)",
                                                        }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => setIsCartOpen(false)}
                                                        className="text-white/90 hover:text-white p-1.5 rounded-full transition-colors cursor-pointer"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </motion.button>
                                                </div>

                                                {cartItems.length === 0 ? (
                                                    <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        className="py-16 px-6 text-center"
                                                    >
                                                        <motion.div
                                                            initial={{ scale: 0.8, y: 10, opacity: 0 }}
                                                            animate={{ scale: 1, y: 0, opacity: 1 }}
                                                            transition={{ delay: 0.1, duration: 0.4 }}
                                                            className="w-24 h-24 mx-auto mb-6 relative"
                                                        >
                                                            <div className="absolute inset-0 bg-blue-100 rounded-full opacity-60 animate-pulse-slow"></div>
                                                            <ShoppingBag className="w-12 h-12 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600" />
                                                        </motion.div>
                                                        <motion.h3
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: 0.2 }}
                                                            className="text-xl font-medium text-gray-900 mb-2"
                                                        >
                                                            Your cart is empty
                                                        </motion.h3>
                                                        <motion.p
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: 0.3 }}
                                                            className="text-gray-500 mb-6 max-w-[240px] mx-auto"
                                                        >
                                                            Looks like you haven't added anything yet. Let's find some perfect shoes for
                                                            you!
                                                        </motion.p>
                                                        <motion.button
                                                            whileHover={{ scale: 1.03 }}
                                                            whileTap={{ scale: 0.97 }}
                                                            onClick={() => setIsCartOpen(false)}
                                                            className="inline-flex items-center px-6 py-3 bg-[#1C3738] text-[#F4FFF8] rounded-xl hover:bg-[#4D4847] transition-colors cursor-pointer"
                                                        >
                                                            Continue Shopping
                                                        </motion.button>
                                                    </motion.div>
                                                ) : (
                                                    <>
                                                        <ul className="divide-y divide-gray-100">
                                                            {cartItems.map((item, index) => (
                                                                <motion.li
                                                                    key={`${item.shoe.id}-${item.size}-${item.color}`}
                                                                    initial={{ opacity: 0, y: 10 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    transition={{ delay: index * 0.05 }}
                                                                    className="py-4 px-4 hover:bg-gray-50 transition-colors"
                                                                >
                                                                    <div className="flex justify-between items-center">
                                                                        <div className="flex items-center">
                                                                            <motion.div
                                                                                whileHover={{ scale: 1.05 }}
                                                                                className="w-16 h-16 rounded-xl overflow-hidden mr-3 bg-gray-50 relative"
                                                                            >
                                                                                <img
                                                                                    src={item.shoe.image || "/placeholder.svg"}
                                                                                    alt={item.shoe.name}
                                                                                    className="w-full h-full object-cover"
                                                                                />
                                                                                {item.shoe.isNew && (
                                                                                    <span className="absolute top-0 right-0 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-bl-md rounded-tr-md">
                                                                                        NEW
                                                                                    </span>
                                                                                )}
                                                                            </motion.div>
                                                                            <div>
                                                                                <motion.h3
                                                                                    whileHover={{ x: 2 }}
                                                                                    className="font-medium text-gray-900 transition-colors"
                                                                                >
                                                                                    {item.shoe.name}
                                                                                </motion.h3>
                                                                                <p className="text-sm text-gray-500">
                                                                                    Size: {item.size} | Color: {item.color}
                                                                                </p>
                                                                                <div className="flex items-center mt-1">
                                                                                    <motion.button
                                                                                        whileTap={{ scale: 0.9 }}
                                                                                        onClick={() =>
                                                                                            updateCartItemQuantity(index, item.quantity - 1)
                                                                                        }
                                                                                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 not-disabled:hover:bg-gray-200 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                                                                        disabled={item.quantity <= 1}
                                                                                    >
                                                                                        <Minus className="w-3 h-3 text-gray-600" />
                                                                                    </motion.button>
                                                                                    <motion.span
                                                                                        key={item.quantity}
                                                                                        initial={{ scale: 0.8, opacity: 0 }}
                                                                                        animate={{ scale: 1, opacity: 1 }}
                                                                                        className="mx-2 text-sm font-medium w-6 text-center"
                                                                                    >
                                                                                        {item.quantity}
                                                                                    </motion.span>
                                                                                    <motion.button
                                                                                        whileTap={{ scale: 0.9 }}
                                                                                        onClick={() =>
                                                                                            updateCartItemQuantity(index, item.quantity + 1)
                                                                                        }
                                                                                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-150 cursor-pointer"
                                                                                    >
                                                                                        <Plus className="w-3 h-3 text-gray-600" />
                                                                                    </motion.button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex flex-col items-end">
                                                                            <motion.button
                                                                                whileHover={{
                                                                                    scale: 1.1,
                                                                                    color: "#EF4444",
                                                                                }}
                                                                                whileTap={{ scale: 0.9 }}
                                                                                onClick={() => removeCartItem(index)}
                                                                                className="text-gray-400 hover:text-red-500 transition-colors duration-150 mb-2 p-1 rounded-full hover:bg-gray-100 cursor-pointer"
                                                                                aria-label="Remove item"
                                                                            >
                                                                                <Trash2 className="w-3.5 h-3.5" />
                                                                            </motion.button>
                                                                            <motion.p
                                                                                initial={{ opacity: 0, x: 10 }}
                                                                                animate={{ opacity: 1, x: 0 }}
                                                                                transition={{ delay: 0.1 }}
                                                                                className="font-medium text-gray-900"
                                                                            >
                                                                                ${(item.shoe.price * item.quantity).toFixed(2)}
                                                                            </motion.p>
                                                                        </div>
                                                                    </div>
                                                                </motion.li>
                                                            ))}
                                                        </ul>
                                                        <div className="sticky bottom-0 bg-white p-4 border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                                                            <div className="rounded-lg bg-blue-50 p-3 mb-4">
                                                                <div className="flex justify-between text-sm text-blue-700 mb-2">
                                                                    <span className="font-medium">Subtotal</span>
                                                                    <span>${getCartTotal()}</span>
                                                                </div>
                                                                <div className="flex justify-between text-sm text-blue-700 mb-2">
                                                                    <span className="font-medium">Shipping</span>
                                                                    <span>Free</span>
                                                                </div>
                                                                <div className="flex justify-between font-medium text-blue-900 pt-2 border-t border-blue-100">
                                                                    <span>Total</span>
                                                                    <motion.span
                                                                        key={getCartTotal()}
                                                                        initial={{ scale: 0.9 }}
                                                                        animate={{ scale: 1 }}
                                                                        className="text-xl"
                                                                    >
                                                                        ${getCartTotal()}
                                                                    </motion.span>
                                                                </div>
                                                            </div>

                                                            <motion.button
                                                                whileHover={{
                                                                    scale: 1.02,
                                                                    backgroundColor: "#1C3738",
                                                                }}
                                                                whileTap={{ scale: 0.98 }}
                                                                className="w-full py-3.5 rounded-xl bg-[#1C3738] text-[#F4FFF8] font-medium flex items-center justify-center shadow-md transition-all duration-100 not-disabled:cursor-pointer"
                                                                onClick={handleOrderConfirmed}
                                                                disabled={orderConfirmed}
                                                            >
                                                                {orderConfirmed ? (
                                                                    <motion.div
                                                                        initial={{ scale: 0.8, opacity: 0 }}
                                                                        animate={{ scale: 1, opacity: 1 }}
                                                                        className="flex items-center"
                                                                    >
                                                                        <svg
                                                                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            fill="none"
                                                                            viewBox="0 0 24 24"
                                                                        >
                                                                            <circle
                                                                                className="opacity-25"
                                                                                cx="12"
                                                                                cy="12"
                                                                                r="10"
                                                                                stroke="currentColor"
                                                                                strokeWidth="4"
                                                                            ></circle>
                                                                            <path
                                                                                className="opacity-75"
                                                                                fill="currentColor"
                                                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                                            ></path>
                                                                        </svg>
                                                                        Processing...
                                                                    </motion.div>
                                                                ) : (
                                                                    <span className="flex items-center">
                                                                        <ShoppingBag className="w-4 h-4 mr-2 opacity-90" />
                                                                        Confirm Order
                                                                    </span>
                                                                )}
                                                            </motion.button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsWishlistOpen(!isWishlistOpen)}
                                className="p-3 rounded-full bg-[#4D4847] text-[#F4FFF8] hover:bg-[#8BAAAD] transition-colors duration-150 cursor-pointer"
                                aria-label="Wishlist"
                            >
                                <Heart className={`w-5 h-5 ${wishlistItems.length > 0 ? "fill-current" : ""}`} />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </header>

            <AnimatePresence>
                {isWishlistOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-white z-50 p-4 md:p-6 lg:p-8 overflow-auto"
                    >
                        <div className="max-w-7xl mx-auto">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-900">My Wishlist</h2>
                                <motion.button
                                    whileHover={{
                                        scale: 1.1,
                                        backgroundColor: "rgba(0, 0, 0, 0.05)",
                                    }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setIsWishlistOpen(false)}
                                    className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                                >
                                    <X className="w-5 h-5 text-gray-600" />
                                </motion.button>
                            </div>

                            {wishlistItems.length === 0 ? (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 px-6 text-center">
                                    <motion.div
                                        initial={{ scale: 0.8, y: 10, opacity: 0 }}
                                        animate={{ scale: 1, y: 0, opacity: 1 }}
                                        transition={{ delay: 0.1, duration: 0.4 }}
                                        className="w-24 h-24 mx-auto mb-6 relative"
                                    >
                                        <div className="absolute inset-0 bg-pink-100 rounded-full opacity-60 animate-pulse-slow"></div>
                                        <Heart className="w-12 h-12 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-pink-600 fill-current" />
                                    </motion.div>
                                    <motion.h3
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-xl font-medium text-gray-900 mb-2"
                                    >
                                        Your wishlist is empty
                                    </motion.h3>
                                    <motion.p
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-gray-500 mb-6 max-w-[240px] mx-auto"
                                    >
                                        Looks like you haven't added anything yet. Let's find some perfect shoes for you!
                                    </motion.p>
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => setIsWishlistOpen(false)}
                                        className="inline-flex items-center px-6 py-3 bg-[#4D4847] text-[#F4FFF8] rounded-xl hover:bg-[#8BAAAD] transition-colors cursor-pointer"
                                    >
                                        Continue Shopping
                                    </motion.button>
                                </motion.div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {wishlistItems.map((shoe) => (
                                        <motion.div
                                            key={shoe.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4 }}
                                            whileHover={{
                                                y: -10,
                                                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                                            }}
                                            className="bg-white rounded-2xl shadow-sm transition-all duration-150 flex flex-col"
                                        >
                                            <div className="relative h-72 bg-gray-50 overflow-hidden">
                                                <motion.div whileHover={{ scale: 1.05 }} className="w-full h-full">
                                                    <img
                                                        src={shoe.image}
                                                        alt={shoe.name}
                                                        className="w-full h-full object-cover transition-transform duration-150 rounded-t-2xl"
                                                    />
                                                </motion.div>

                                                {shoe.isNew && (
                                                    <motion.span
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        className="absolute top-4 left-4 bg-[#F4FFF8] text-[#1C3738] text-xs font-medium px-3 py-1 rounded-full shadow-sm"
                                                    >
                                                        NEW
                                                    </motion.span>
                                                )}

                                                {shoe.isBestSeller && (
                                                    <motion.span
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.1 }}
                                                        className="absolute top-4 right-4 bg-[#4D4847] text-[#F4FFF8] text-xs font-medium px-3 py-1 rounded-full shadow-sm"
                                                    >
                                                        BEST SELLER
                                                    </motion.span>
                                                )}

                                                <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                                                    <motion.button
                                                        whileHover={{
                                                            scale: 1.1,
                                                            backgroundColor: "rgba(255, 255, 255, 0.3)",
                                                        }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleWishlistToggle(shoe);
                                                        }}
                                                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-all duration-150 cursor-pointer"
                                                    >
                                                        <Heart
                                                            className={`w-4 h-4 text-[#4D4847] ${
                                                                wishlistItems.some((item) => item.id === shoe.id) ? "fill-current" : ""
                                                            }`}
                                                        />
                                                    </motion.button>
                                                </div>
                                            </div>

                                            <div className="p-5 flex-1 flex flex-col">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="text-gray-900 font-medium">{shoe.name}</h3>
                                                    <span className="text-lg font-bold">${shoe.price}</span>
                                                </div>

                                                <div className="flex items-center mb-3">
                                                    <div className="flex items-center">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`w-3.5 h-3.5 ${
                                                                    i < Math.floor(shoe.rating)
                                                                        ? "text-amber-400 fill-current"
                                                                        : "text-gray-300"
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="ml-2 text-xs text-gray-500">({shoe.reviews})</span>
                                                </div>

                                                <div className="flex flex-wrap gap-1.5 mb-4">
                                                    {shoe.sizes.slice(0, 3).map((size) => (
                                                        <span key={size} className="text-xs px-2 py-1 bg-gray-100 rounded-md text-gray-700">
                                                            {size}
                                                        </span>
                                                    ))}
                                                    {shoe.sizes.length > 3 && (
                                                        <span className="text-xs px-2 py-1 bg-gray-100 rounded-md text-gray-700">
                                                            +{shoe.sizes.length - 3}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="mb-4 flex-1">
                                                    <CustomDropdown
                                                        options={shoe.sizes}
                                                        selectedOption={productSizes[shoe.id] || null}
                                                        onSelectOption={(size) => {
                                                            setProductSizes((prev) => ({
                                                                ...prev,
                                                                [shoe.id]: size,
                                                            }));
                                                        }}
                                                        placeholder="Select size"
                                                        label="Size"
                                                    />
                                                </div>

                                                <div className="flex gap-1.5 mt-auto">
                                                    <motion.button
                                                        whileHover={{
                                                            scale: 1.03,
                                                        }}
                                                        whileTap={{ scale: 0.97 }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleQuickAddToCart(e, shoe);
                                                        }}
                                                        disabled={!productSizes[shoe.id]}
                                                        className="flex-1 py-2 px-4 bg-[#1C3738] text-[#F4FFF8] rounded-lg not-disabled:hover:bg-[#4D4847] transition-colors duration-50 flex items-center justify-center not-disabled:cursor-pointer"
                                                    >
                                                        <ShoppingBag className="w-3.5 h-3.5 mr-2 opacity-90" />
                                                        Add to Cart
                                                    </motion.button>

                                                    <motion.button
                                                        whileHover={{
                                                            scale: 1.1,
                                                            backgroundColor: "rgba(139, 170, 173, 0.2)",
                                                        }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleWishlistToggle(shoe);
                                                        }}
                                                        className="p-2 rounded-lg bg-[#8BAAAD]/10 hover:bg-[#8BAAAD]/20 transition-colors cursor-pointer"
                                                    >
                                                        <Heart
                                                            className={`w-4 h-4 text-[#4D4847] ${
                                                                wishlistItems.some((item) => item.id === shoe.id) ? "fill-current" : ""
                                                            }`}
                                                        />
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <main>
                <section id="home" className="relative overflow-hidden bg-gradient-to-br from-[#F4FFF8] via-[#8BAAAD]/20 to-[#8BAAAD]/40">
                    <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 lg:py-20">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                className="order-2 lg:order-1"
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                    className="inline-block mb-6 px-4 py-1 bg-[#1C3738] text-[#F4FFF8] rounded-full text-sm font-medium"
                                >
                                    NEW COLLECTION
                                </motion.div>

                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                    className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4"
                                >
                                    Elevate Your <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1C3738] to-[#8BAAAD]">
                                        Running Experience
                                    </span>
                                </motion.h1>

                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.5 }}
                                    className="text-lg text-gray-600 mb-8"
                                >
                                    Discover our latest collection of premium running shoes, designed for comfort and performance.
                                    Engineered with advanced technology to help you push your limits and achieve your goals.
                                </motion.p>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5, duration: 0.5 }}
                                    className="flex flex-wrap gap-3"
                                >
                                    <motion.a
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        href="#best-sellers"
                                        onClick={(e) => handleSmoothScroll(e, "#best-sellers")}
                                        className="inline-flex items-center px-8 py-4 bg-[#1C3738] text-[#F4FFF8] rounded-xl hover:bg-[#4D4847] transition-all cursor-pointer"
                                    >
                                        Shop Now
                                        <ChevronDown className="w-5 h-5 ml-2" />
                                    </motion.a>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6, duration: 0.5 }}
                                    className="flex flex-wrap gap-6 mt-12"
                                >
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mr-3 shadow-sm">
                                            <Truck className="w-6 h-6 text-[#1C3738]" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Free Shipping</p>
                                            <p className="text-xs text-gray-500">On orders over $100</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mr-3 shadow-sm">
                                            <Shield className="w-6 h-6 text-[#1C3738]" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">30-Day Returns</p>
                                            <p className="text-xs text-gray-500">No questions asked</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mr-3 shadow-sm">
                                            <Zap className="w-6 h-6 text-[#1C3738]" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Premium Quality</p>
                                            <p className="text-xs text-gray-500">Guaranteed durability</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                className="order-1 lg:order-2 relative hidden lg:block"
                            >
                                <div className="relative md:absolute md:inset-0 flex items-center justify-center">
                                    <div className="relative grid grid-cols-2 gap-6 transform md:translate-x-6 scale-110">
                                        {[
                                            {
                                                image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=2864&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                                                name: "SkyStep Air Flow 270",
                                                price: "$129.99",
                                            },
                                            {
                                                image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=2798&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                                                name: "UrbanStride UltraMax",
                                                price: "$149.99",
                                            },
                                            {
                                                image: "https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                                                name: "BalanceCore Classic 574",
                                                price: "$79.99",
                                            },
                                            {
                                                image: "https://images.unsplash.com/photo-1562183241-b937e95585b6?q=80&w=3165&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=735&q=80",
                                                name: "ToughTread Outdoor Boots",
                                                price: "$129.99",
                                            },
                                        ].map((item, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ y: 30 * (index % 2), opacity: 0 }}
                                                animate={{ y: 20 * (index % 2), opacity: 0.85 }}
                                                transition={{
                                                    delay: 0.3 + (index % 2) * 0.1,
                                                    y: {
                                                        duration: 2.5,
                                                        repeat: Number.POSITIVE_INFINITY,
                                                        repeatType: "reverse",
                                                        ease: "easeInOut",
                                                    },
                                                }}
                                                className="bg-white rounded-2xl shadow-2xl overflow-hidden transform rotate-[-2deg] hover:rotate-0 transition-all duration-300"
                                            >
                                                <div className="h-40 overflow-hidden">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                                    />
                                                </div>
                                                <div className="p-4">
                                                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                                                    <p className="text-blue-600 font-medium">{item.price}</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                <section id="best-sellers" className="py-20 bg-gradient-to-b from-gray-50 to-[#F4FFF8] border-t border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-12"
                        >
                            <div className="inline-block mb-6 px-4 py-1 bg-[#1C3738] text-[#F4FFF8] rounded-full text-sm font-medium">
                                FEATURED PRODUCTS
                            </div>
                            <h2 className="text-3xl font-bold text-[#000F08] mb-4">
                                Our <span className="text-[#1C3738]">Best Sellers</span>
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Discover our top-selling shoes, loved by customers worldwide for their quality and comfort.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {shoes
                                .filter((shoe) => shoe.isBestSeller)
                                .map((shoe, index) => (
                                    <motion.div
                                        key={shoe.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{
                                            y: -10,
                                            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                                        }}
                                        className="bg-white rounded-2xl shadow-sm transition-all duration-150 flex flex-col"
                                    >
                                        <div className="relative h-72 bg-gray-50 overflow-hidden">
                                            <motion.div whileHover={{ scale: 1.05 }} className="w-full h-full">
                                                <img
                                                    src={shoe.image}
                                                    alt={shoe.name}
                                                    className="w-full h-full object-cover transition-transform duration-150 rounded-t-2xl"
                                                />
                                            </motion.div>

                                            {shoe.isNew && (
                                                <motion.span
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className="absolute top-4 left-4 bg-[#F4FFF8] text-[#1C3738] text-xs font-medium px-3 py-1 rounded-full shadow-sm"
                                                >
                                                    NEW
                                                </motion.span>
                                            )}

                                            {shoe.isBestSeller && (
                                                <motion.span
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.1 }}
                                                    className="absolute top-4 right-4 bg-[#4D4847] text-[#F4FFF8] text-xs font-medium px-3 py-1 rounded-full shadow-sm"
                                                >
                                                    BEST SELLER
                                                </motion.span>
                                            )}

                                            <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                                                <motion.button
                                                    whileHover={{
                                                        scale: 1.1,
                                                        backgroundColor: "rgba(255, 255, 255, 0.3)",
                                                    }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleWishlistToggle(shoe);
                                                    }}
                                                    className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-all duration-150 cursor-pointer"
                                                >
                                                    <Heart
                                                        className={`w-4 h-4 text-[#4D4847] ${
                                                            wishlistItems.some((item) => item.id === shoe.id) ? "fill-current" : ""
                                                        }`}
                                                    />
                                                </motion.button>
                                            </div>
                                        </div>

                                        <div className="p-5 flex-1 flex flex-col">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-gray-900 font-medium">{shoe.name}</h3>
                                                <span className="text-lg font-bold">${shoe.price}</span>
                                            </div>

                                            <div className="flex items-center mb-3">
                                                <div className="flex items-center">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-3.5 h-3.5 ${
                                                                i < Math.floor(shoe.rating)
                                                                    ? "text-amber-400 fill-current"
                                                                    : "text-gray-300"
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="ml-2 text-xs text-gray-500">({shoe.reviews})</span>
                                            </div>

                                            <div className="flex flex-wrap gap-1.5 mb-4">
                                                {shoe.sizes.slice(0, 3).map((size) => (
                                                    <span key={size} className="text-xs px-2 py-1 bg-gray-100 rounded-md text-gray-700">
                                                        {size}
                                                    </span>
                                                ))}
                                                {shoe.sizes.length > 3 && (
                                                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-md text-gray-700">
                                                        +{shoe.sizes.length - 3}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="mb-4 flex-1">
                                                <CustomDropdown
                                                    options={shoe.sizes}
                                                    selectedOption={productSizes[shoe.id] || null}
                                                    onSelectOption={(size) => {
                                                        setProductSizes((prev) => ({
                                                            ...prev,
                                                            [shoe.id]: size,
                                                        }));
                                                    }}
                                                    placeholder="Select size"
                                                    label="Size"
                                                />
                                            </div>

                                            <div className="flex gap-1.5 mt-auto">
                                                <motion.button
                                                    whileHover={{
                                                        scale: 1.03,
                                                    }}
                                                    whileTap={{ scale: 0.97 }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleQuickAddToCart(e, shoe);
                                                    }}
                                                    disabled={!productSizes[shoe.id]}
                                                    className="flex-1 py-2 px-4 bg-[#1C3738] text-[#F4FFF8] rounded-lg not-disabled:hover:bg-[#4D4847] transition-colors duration-50 flex items-center justify-center not-disabled:cursor-pointer"
                                                >
                                                    <ShoppingBag className="w-3.5 h-3.5 mr-2 opacity-90" />
                                                    Add to Cart
                                                </motion.button>

                                                <motion.button
                                                    whileHover={{
                                                        scale: 1.1,
                                                        backgroundColor: "rgba(139, 170, 173, 0.2)",
                                                    }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleWishlistToggle(shoe);
                                                    }}
                                                    className="p-2 rounded-lg bg-[#8BAAAD]/10 hover:bg-[#8BAAAD]/20 transition-colors cursor-pointer"
                                                >
                                                    <Heart
                                                        className={`w-4 h-4 text-[#4D4847] ${
                                                            wishlistItems.some((item) => item.id === shoe.id) ? "fill-current" : ""
                                                        }`}
                                                    />
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                        </div>
                    </div>
                </section>

                <section id="new-arrivals" className="py-20 bg-white border-t border-[#8BAAAD]/20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-12"
                        >
                            <div className="inline-block mb-6 px-4 py-1 bg-[#1C3738] text-[#F4FFF8] rounded-full text-sm font-medium">
                                NEW ARRIVALS
                            </div>
                            <h2 className="text-3xl font-bold text-[#000F08] mb-4">
                                Just <span className="text-[#1C3738]">Dropped</span>
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Check out our latest additions, featuring the most comfortable and stylish shoes.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {shoes
                                .filter((shoe) => shoe.isNew)
                                .map((shoe, index) => (
                                    <motion.div
                                        key={shoe.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{
                                            y: -10,
                                            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                                        }}
                                        className="bg-white rounded-2xl shadow-sm transition-all duration-150 flex flex-col"
                                    >
                                        <div className="relative h-72 bg-gray-50 overflow-hidden">
                                            <motion.div whileHover={{ scale: 1.05 }} className="w-full h-full">
                                                <img
                                                    src={shoe.image}
                                                    alt={shoe.name}
                                                    className="w-full h-full object-cover transition-transform duration-150 rounded-t-2xl"
                                                />
                                            </motion.div>

                                            {shoe.isNew && (
                                                <motion.span
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className="absolute top-4 left-4 bg-[#F4FFF8] text-[#1C3738] text-xs font-medium px-3 py-1 rounded-full shadow-sm"
                                                >
                                                    NEW
                                                </motion.span>
                                            )}

                                            {shoe.isBestSeller && (
                                                <motion.span
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.1 }}
                                                    className="absolute top-4 right-4 bg-[#4D4847] text-[#F4FFF8] text-xs font-medium px-3 py-1 rounded-full shadow-sm"
                                                >
                                                    BEST SELLER
                                                </motion.span>
                                            )}

                                            <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                                                <motion.button
                                                    whileHover={{
                                                        scale: 1.1,
                                                        backgroundColor: "rgba(255, 255, 255, 0.3)",
                                                    }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleWishlistToggle(shoe);
                                                    }}
                                                    className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-all duration-150 cursor-pointer"
                                                >
                                                    <Heart
                                                        className={`w-4 h-4 text-[#4D4847] ${
                                                            wishlistItems.some((item) => item.id === shoe.id) ? "fill-current" : ""
                                                        }`}
                                                    />
                                                </motion.button>
                                            </div>
                                        </div>

                                        <div className="p-5 flex-1 flex flex-col">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-gray-900 font-medium">{shoe.name}</h3>
                                                <span className="text-lg font-bold">${shoe.price}</span>
                                            </div>

                                            <div className="flex items-center mb-3">
                                                <div className="flex items-center">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-3.5 h-3.5 ${
                                                                i < Math.floor(shoe.rating)
                                                                    ? "text-amber-400 fill-current"
                                                                    : "text-gray-300"
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="ml-2 text-xs text-gray-500">({shoe.reviews})</span>
                                            </div>

                                            <div className="flex flex-wrap gap-1.5 mb-4">
                                                {shoe.sizes.slice(0, 3).map((size) => (
                                                    <span key={size} className="text-xs px-2 py-1 bg-gray-100 rounded-md text-gray-700">
                                                        {size}
                                                    </span>
                                                ))}
                                                {shoe.sizes.length > 3 && (
                                                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-md text-gray-700">
                                                        +{shoe.sizes.length - 3}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="mb-4 flex-1">
                                                <CustomDropdown
                                                    options={shoe.sizes}
                                                    selectedOption={productSizes[shoe.id] || null}
                                                    onSelectOption={(size) => {
                                                        setProductSizes((prev) => ({
                                                            ...prev,
                                                            [shoe.id]: size,
                                                        }));
                                                    }}
                                                    placeholder="Select size"
                                                    label="Size"
                                                />
                                            </div>

                                            <div className="flex gap-1.5">
                                                <motion.button
                                                    whileHover={{
                                                        scale: !productSizes[shoe.id] ? 1 : 1.03,
                                                    }}
                                                    whileTap={{ scale: 0.97 }}
                                                    disabled={!productSizes[shoe.id]}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleQuickAddToCart(e, shoe);
                                                    }}
                                                    className="flex-1 py-2 px-4 bg-[#1C3738] text-[#F4FFF8] rounded-lg not-disabled:hover:bg-[#4D4847] transition-colors duration-50 flex items-center justify-center not-disabled:cursor-pointer"
                                                >
                                                    <ShoppingBag className="w-3.5 h-3.5 mr-2 opacity-90" />
                                                    Add to Cart
                                                </motion.button>

                                                <motion.button
                                                    whileHover={{
                                                        scale: 1.1,
                                                        backgroundColor: "rgba(139, 170, 173, 0.2)",
                                                    }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleWishlistToggle(shoe);
                                                    }}
                                                    className="p-2 rounded-lg bg-[#8BAAAD]/10 hover:bg-[#8BAAAD]/20 transition-colors cursor-pointer"
                                                >
                                                    <Heart
                                                        className={`w-4 h-4 text-[#4D4847] ${
                                                            wishlistItems.some((item) => item.id === shoe.id) ? "fill-current" : ""
                                                        }`}
                                                    />
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                        </div>
                    </div>
                </section>

                <section id="about-us" className="py-20 bg-gradient-to-t from-gray-50 to-[#F4FFF8] border-t border-[#8BAAAD]/20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-12"
                        >
                            <div className="inline-block mb-6 px-4 py-1 bg-[#1C3738] text-[#F4FFF8] rounded-full text-sm font-medium">
                                TESTIMONIALS
                            </div>
                            <h2 className="text-3xl font-bold text-[#000F08] mb-4">
                                What Our <span className="text-[#1C3738]">Customers</span> Say
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Hear from our satisfied customers who have experienced the comfort and quality of our shoes.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                {
                                    name: "Sarah Johnson",
                                    role: "Marathon Runner",
                                    rating: 5,
                                    comment:
                                        "These shoes have been a game-changer for my training. The cushioning is perfect and they look great too!",
                                    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHx8fDA%3D",
                                },
                                {
                                    name: "Michael Chen",
                                    role: "Fitness Enthusiast",
                                    rating: 4.5,
                                    comment:
                                        "I was impressed by the quality and comfort of these shoes. They're perfect for my daily gym sessions.",
                                    image: "https://plus.unsplash.com/premium_photo-1689539137236-b68e436248de?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHx8fDA%3D",
                                },
                                {
                                    name: "Emily Rodriguez",
                                    role: "Casual Walker",
                                    rating: 5,
                                    comment:
                                        "I bought these shoes for everyday wear and I'm so glad I did. They're incredibly comfortable and stylish!",
                                    image: "https://images.unsplash.com/photo-1568743296270-9cc798164b3b?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZSUyMHBpY3R1cmUlMjB3b21hbiUyQ3xlbnwwfHwwfHx8MA%3D%3D",
                                },
                            ].map((testimonial, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{
                                        y: -5,
                                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                                    }}
                                    className="bg-white rounded-2xl shadow-sm p-6 transition-all duration-150"
                                >
                                    <div className="flex items-center mb-4">
                                        <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                                            <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
                                            <p className="text-sm text-gray-500">{testimonial.role}</p>
                                        </div>
                                    </div>

                                    <div className="flex mb-3">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${
                                                    i < Math.floor(testimonial.rating) ? "text-amber-400 fill-current" : "text-gray-300"
                                                }`}
                                            />
                                        ))}
                                    </div>

                                    <p className="text-gray-600 leading-relaxed">{testimonial.comment}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                <footer className="bg-gray-50 border-t border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 py-12">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-4">
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1C3738] to-[#8BAAAD]">
                                        Sole<span className="font-sans font-bold">Fusion</span>
                                    </span>
                                </h2>
                                <p className="text-gray-600 mb-4">
                                    Elevate your shoe game with our premium collection. Comfort meets style in every step.
                                </p>
                                <div className="flex space-x-4 mt-4">
                                    <a href="#" className="text-gray-400 hover:text-[#1C3738] transition-colors">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path
                                                fillRule="evenodd"
                                                d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </a>
                                    <a href="#" className="text-gray-400 hover:text-[#1C3738] transition-colors">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path
                                                fillRule="evenodd"
                                                d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858-.182-.466-.398-.8-.748-1.15-.35-.35-.683-.566-1.15-.748-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </a>
                                    <a href="#" className="text-gray-400 hover:text-[#1C3738] transition-colors">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                        </svg>
                                    </a>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Quick Links</h3>
                                <ul className="space-y-2">
                                    <li>
                                        <a
                                            href="#home"
                                            onClick={(e) => handleSmoothScroll(e, "#home")}
                                            className="text-gray-600 hover:text-[#1C3738] transition-colors duration-150"
                                        >
                                            Home
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#best-sellers"
                                            onClick={(e) => handleSmoothScroll(e, "#best-sellers")}
                                            className="text-gray-600 hover:text-[#1C3738] transition-colors duration-150"
                                        >
                                            Best Sellers
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#new-arrivals"
                                            onClick={(e) => handleSmoothScroll(e, "#new-arrivals")}
                                            className="text-gray-600 hover:text-[#1C3738] transition-colors duration-150"
                                        >
                                            New Arrivals
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Contact</h3>
                                <ul className="space-y-2 text-gray-600">
                                    <li className="flex items-start">
                                        <svg
                                            className="w-5 h-5 text-[#1C3738] mt-0.5 mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                            ></path>
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                            ></path>
                                        </svg>
                                        <span>123 Fashion Street, New York, NY 10001</span>
                                    </li>
                                    <li className="flex items-center">
                                        <svg
                                            className="w-5 h-5 text-[#1C3738] mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                            ></path>
                                        </svg>
                                        <a 
                                            href="mailto:contact@solefusion.com"
                                            className="hover:text-[#1C3738] transition-colors duration-150 cursor-pointer hover:underline"
                                        >
                                            contact@solefusion.com
                                        </a>
                                    </li>
                                    <li className="flex items-center">
                                        <svg
                                            className="w-5 h-5 text-[#1C3738] mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                            ></path>
                                        </svg>
                                        <a 
                                            href="tel:+15551234567"
                                            className="hover:text-[#1C3738] transition-colors duration-150 cursor-pointer hover:underline"
                                        >
                                            +1 (555) 123-4567
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                            <p className="text-gray-500 text-sm mb-4 md:mb-0">© 2023 SoleFusion. All rights reserved.</p>
                            <div className="flex space-x-6">
                                <a href="#" className="text-gray-500 hover:text-[#1C3738] text-sm transition-colors duration-150">
                                    Privacy Policy
                                </a>
                                <a href="#" className="text-gray-500 hover:text-[#1C3738] text-sm transition-colors duration-150">
                                    Terms of Service
                                </a>
                                <a href="#" className="text-gray-500 hover:text-[#1C3738] text-sm transition-colors duration-150">
                                    Shipping
                                </a>
                            </div>
                        </div>
                    </div>
                </footer>
            </main>

            <AnimatePresence>
                {selectedShoe && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 overflow-y-auto"
                    >
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
                            </div>

                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                                &#8203;
                            </span>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                transition={{ duration: 0.15 }}
                                className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl w-full"
                            >
                                <div className="absolute top-4 right-4 z-10">
                                    <motion.button
                                        whileHover={{
                                            scale: 1.1,
                                            backgroundColor: "rgba(0, 0, 0, 0.1)",
                                        }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setSelectedShoe(null)}
                                        className="p-2 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-gray-700 backdrop-blur-sm shadow-md transition-all duration-150 cursor-pointer"
                                    >
                                        <X className="w-5 h-5" />
                                    </motion.button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2">
                                    <div className="relative h-full bg-gray-100">
                                        <img
                                            src={selectedShoe.image}
                                            alt={selectedShoe.name}
                                            className="w-full h-full object-cover object-center"
                                        />
                                        {selectedShoe.isNew && (
                                            <span className="absolute top-4 left-4 bg-white text-[#1C3738] text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                                                NEW
                                            </span>
                                        )}
                                        {selectedShoe.isBestSeller && (
                                            <span className="absolute top-4 right-4 bg-[#4D4847] text-[#F4FFF8] text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                                                BEST SELLER
                                            </span>
                                        )}
                                    </div>

                                    <div className="p-6 md:p-8 flex flex-col h-full">
                                        <div>
                                            <h2 className="text-2xl font-semibold text-gray-900 mb-1">{selectedShoe.name}</h2>
                                            <p className="text-gray-600 mb-4">{selectedShoe.brand}</p>
                                            <div className="flex items-center mb-5">
                                                <div className="flex items-center">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-4 h-4 ${
                                                                i < Math.floor(selectedShoe.rating)
                                                                    ? "text-amber-400 fill-current"
                                                                    : "text-gray-300"
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="ml-2 text-sm text-gray-500">({selectedShoe.reviews} reviews)</span>
                                            </div>

                                            <div className="mb-6">
                                                <div className="flex items-center">
                                                    <span className="text-3xl font-bold text-gray-900">
                                                        ${selectedShoe.price.toFixed(2)}
                                                    </span>
                                                    {selectedShoe.originalPrice && (
                                                        <span className="ml-3 text-lg text-gray-500 line-through">
                                                            ${selectedShoe.originalPrice.toFixed(2)}
                                                        </span>
                                                    )}
                                                    {selectedShoe.discount && (
                                                        <span className="ml-3 text-sm font-medium text-green-600">
                                                            Save {selectedShoe.discount}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mb-6">
                                                <h3 className="text-sm font-medium text-gray-900 mb-2">Select Size</h3>
                                                <CustomDropdown
                                                    options={selectedShoe.sizes}
                                                    selectedOption={selectedSize}
                                                    onSelectOption={(size) => setSelectedSize(size)}
                                                    label="Size"
                                                />
                                            </div>

                                            <div className="mb-8">
                                                <h3 className="text-sm font-medium text-gray-900 mb-2">Select Color</h3>
                                                <CustomDropdown
                                                    options={selectedShoe.colors}
                                                    selectedOption={selectedColor}
                                                    onSelectOption={(color) => setSelectedColor(color)}
                                                    label="Color"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-4 mt-auto">
                                            <motion.button
                                                whileHover={{ scale: 1.03, backgroundColor: "#1C3738" }}
                                                whileTap={{ scale: 0.97 }}
                                                onClick={handleAddToCart}
                                                disabled={!selectedSize || !selectedColor}
                                                className={`flex-1 py-4 px-8 rounded-xl font-medium text-[#F4FFF8] flex items-center justify-center shadow-md ${
                                                    !selectedSize || !selectedColor
                                                        ? "bg-[#8BAAAD] cursor-not-allowed"
                                                        : "bg-[#1C3738] hover:bg-[#4D4847] cursor-pointer"
                                                }`}
                                            >
                                                <ShoppingBag className="w-5 h-5 mr-2 opacity-90" />
                                                Add to Cart
                                            </motion.button>

                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleWishlistToggle(selectedShoe)}
                                                className="p-4 rounded-xl bg-[#8BAAAD]/10 hover:bg-[#8BAAAD]/20 transition-colors duration-150 cursor-pointer"
                                            >
                                                <Heart
                                                    className={`w-5 h-5 ${
                                                        wishlistItems.some((item) => item.id === selectedShoe.id)
                                                            ? "text-[#4D4847] fill-current"
                                                            : "text-[#4D4847]"
                                                    }`}
                                                />
                                            </motion.button>
                                        </div>

                                        <div className="mt-8 grid grid-cols-3 gap-4">
                                            <div className="text-center">
                                                <div className="w-10 h-10 mx-auto bg-[#8BAAAD]/20 rounded-full flex items-center justify-center mb-2">
                                                    <Truck className="w-5 h-5 text-[#1C3738]" />
                                                </div>
                                                <p className="text-xs text-gray-600">Free Shipping</p>
                                            </div>
                                            <div className="text-center">
                                                <div className="w-10 h-10 mx-auto bg-[#8BAAAD]/20 rounded-full flex items-center justify-center mb-2">
                                                    <Clock className="w-5 h-5 text-[#1C3738]" />
                                                </div>
                                                <p className="text-xs text-gray-600">30-Day Returns</p>
                                            </div>
                                            <div className="text-center">
                                                <div className="w-10 h-10 mx-auto bg-[#8BAAAD]/20 rounded-full flex items-center justify-center mb-2">
                                                    <Shield className="w-5 h-5 text-[#1C3738]" />
                                                </div>
                                                <p className="text-xs text-gray-600">Secure Checkout</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {orderSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-4 right-4 bg-green-800 text-white px-4 py-3 rounded-lg shadow-lg flex items-center z-50 max-w-[calc(100%-2rem)]"
                    >
                        <Check className="w-5 h-5 mr-2 text-green-400 flex-shrink-0" />
                        <span className="line-clamp-2">Order confirmed successfully!</span>
                        <button
                            onClick={() => setOrderSuccess(false)}
                            className="ml-4 text-green-400 hover:text-white cursor-pointer flex-shrink-0"
                            aria-label="Close notification"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>{toast && <Toast message={toast} onClose={() => setToast(null)} />}</AnimatePresence>
        </div>
    );
};

export default Home;
