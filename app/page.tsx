"use client";

import type React from "react";

import { useState, useRef, useEffect, useMemo } from "react";
import {
    FaTshirt,
    FaShoppingCart,
    FaSun,
    FaMoon,
    FaSearch,
    FaUser,
    FaHeart,
    FaMapMarkerAlt,
    FaPhone,
    FaEnvelope,
    FaCreditCard,
    FaTruck,
    FaUndo,
    FaShieldAlt,
    FaCcVisa,
    FaCcMastercard,
    FaCcAmex,
    FaPaypal,
    FaApplePay,
    FaGooglePay,
    FaPinterestP,
    FaYoutube,
    FaUserCircle,
    FaClipboardList,
    FaCog,
    FaSignOutAlt,
    FaRegHeart,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";


interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    category?: string;
    rating?: number;
    description?: string;
    sizes?: string[];
    colors?: string[];
    inStock?: boolean;
}

interface CartItem extends Product {
    quantity: number;
    selectedSize?: string;
    selectedColor?: string;
}

interface ApiResponse<T> {
    data: T;
    status: number;
    message: string;
}

export default function Home() {
    const [cartCount, setCartCount] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [userBalance, setUserBalance] = useState(300);
    const [error, setError] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [showCart, setShowCart] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showAccountDropdown, setShowAccountDropdown] = useState(false);
    const [showWishlistDropdown, setShowWishlistDropdown] = useState(false);
    const [wishlistItems, setWishlistItems] = useState(new Set());
    const productRef = useRef(null);


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                const mockApiResponse: ApiResponse<Product[]> = {
                    data: [
                        {
                            id: 1,
                            name: "Classic T-Shirt",
                            price: 90,
                            image: "https://m.media-amazon.com/images/I/41S+9swCRBL._AC_SX679_.jpg",
                            category: "T-Shirts",
                            rating: 4.5,
                            description: "A comfortable classic t-shirt made from 100% organic cotton.",
                            sizes: ["S", "M", "L", "XL"],
                            colors: ["White", "Black", "Gray"],
                            inStock: true,
                        },
                        {
                            id: 2,
                            name: "Stylish Jacket",
                            price: 100,
                            image: "https://m.media-amazon.com/images/I/51JHYa8I1kL._AC_SX679_.jpg",
                            category: "Outerwear",
                            rating: 4.8,
                            description: "A stylish jacket perfect for cool weather, made with sustainable materials.",
                            sizes: ["S", "M", "L", "XL", "XXL"],
                            colors: ["Black", "Navy", "Olive"],
                            inStock: true,
                        },
                        {
                            id: 3,
                            name: "Comfy Hoodie",
                            price: 110,
                            image: "https://m.media-amazon.com/images/I/61tPyctcoHL._AC_SX679_.jpg",
                            category: "Hoodies",
                            rating: 4.7,
                            description: "A comfortable hoodie made from recycled polyester and organic cotton blend.",
                            sizes: ["S", "M", "L", "XL"],
                            colors: ["Gray", "Black", "Blue"],
                            inStock: true,
                        },
                        {
                            id: 4,
                            name: "Short",
                            price: 70,
                            image: "https://m.media-amazon.com/images/I/51NIUQvyz-L._AC_SX679_.jpg",
                            category: "Shorts",
                            rating: 4.2,
                            description: "Comfortable shorts perfect for summer, made with quick-dry fabric.",
                            sizes: ["S", "M", "L", "XL"],
                            colors: ["Khaki", "Navy", "Black"],
                            inStock: true,
                        },
                        {
                            id: 5,
                            name: "Socks",
                            price: 10,
                            image: "https://m.media-amazon.com/images/I/41Eoj0cyLQL._AC_SX679_.jpg",
                            category: "Accessories",
                            rating: 4.0,
                            description: "Comfortable socks made from bamboo fiber, naturally antibacterial.",
                            sizes: ["S", "M", "L"],
                            colors: ["Black", "White", "Gray"],
                            inStock: true,
                        },
                        {
                            id: 6,
                            name: "Trousers",
                            price: 80,
                            image: "https://m.media-amazon.com/images/I/61e7Q7Pr-sL._AC_SX679_.jpg",
                            category: "Pants",
                            rating: 4.6,
                            description: "Stylish and comfortable trousers suitable for casual and formal occasions.",
                            sizes: ["S", "M", "L", "XL", "XXL"],
                            colors: ["Black", "Navy", "Khaki"],
                            inStock: true,
                        },
                        {
                            id: 7,
                            name: "Slim Fit Jeans",
                            price: 120,
                            image: "https://m.media-amazon.com/images/I/61wFqhDC0jL._AC_SY879_.jpg",
                            category: "Jeans",
                            rating: 4.4,
                            description: "Modern slim fit jeans crafted from stretch denim for comfort.",
                            sizes: ["28", "30", "32", "34", "36"],
                            colors: ["Blue", "Black", "Gray"],
                            inStock: true,
                        },
                        {
                            id: 8,
                            name: "Summer Dress",
                            price: 95,
                            image: "https://m.media-amazon.com/images/I/61rq1dw1oIL._AC_SX679_.jpg",
                            category: "Dresses",
                            rating: 4.6,
                            description: "Lightweight and flowy dress perfect for warm weather.",
                            sizes: ["XS", "S", "M", "L"],
                            colors: ["Floral", "White", "Yellow"],
                            inStock: true,
                        },
                        {
                            id: 9,
                            name: "Leather Belt",
                            price: 45,
                            image: "https://m.media-amazon.com/images/I/81Xb+3JJ+ML._AC_SL1500_.jpg",
                            category: "Accessories",
                            rating: 4.9,
                            description: "Classic leather belt made from genuine full-grain leather.",
                            sizes: ["S", "M", "L", "XL"],
                            colors: ["Black", "Brown"],
                            inStock: true,
                        },
                        {
                            id: 10,
                            name: "Graphic Print T-Shirt",
                            price: 95,
                            image: "https://m.media-amazon.com/images/I/B1pppR4gVKL._CLa%7C2140%2C2000%7C71n94M9fUhL.png%7C0%2C0%2C2140%2C2000%2B0.0%2C0.0%2C2140.0%2C2000.0_AC_SX679_.png",
                            category: "T-Shirts",
                            rating: 4.2,
                            description: "Soft cotton t-shirt with a unique graphic print.",
                            sizes: ["S", "M", "L", "XL", "XXL"],
                            colors: ["White", "Gray", "Navy"],
                            inStock: false,
                        },
                        {
                            id: 11,
                            name: "Running Shoes",
                            price: 130,
                            image: "https://m.media-amazon.com/images/I/61I0MUN04ML._AC_SY695_.jpg",
                            category: "Shoes",
                            rating: 4.8,
                            description: "Lightweight and supportive running shoes for optimal performance.",
                            sizes: ["8", "9", "10", "11", "12"],
                            colors: ["Black/White", "Blue/Orange", "Gray/Green"],
                            inStock: true,
                        },
                        {
                            id: 12,
                            name: "Wool Blend Scarf",
                            price: 55,
                            image: "https://m.media-amazon.com/images/I/71TqikRjQwL._AC_SY879_.jpg",
                            category: "Accessories",
                            rating: 4.5,
                            description: "Warm and soft scarf made from a comfortable wool blend.",
                            sizes: ["One Size"],
                            colors: ["Gray", "Burgundy", "Navy"],
                            inStock: true,
                        },
                    ],
                    status: 200,
                    message: "Products fetched successfully",
                };
                setProducts(mockApiResponse.data);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Failed to load products. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const triggerToast = (message: string) => {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };

    const jumpToProductSection = () => {
        productRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const showItemDetails = (productId: number) => {
        triggerToast(`Loading details for product #${productId}...`);
    };

    const addItemToBasket = (product: Product) => {
        if (userBalance < product.price) {
            setError("You don't have enough balance to make this purchase.");
            setTimeout(() => setError(null), 3000);
            return;
        }
        setCartCount((prev) => prev + 1);
        setTotalPrice((prev) => prev + product.price);
        setUserBalance((prev) => prev - product.price);
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.id === product.id);
            if (existingItem) {
                return prevItems.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
            } else {
                return [...prevItems, { ...product, quantity: 1 }];
            }
        });
        setError(null);
        triggerToast(`Added ${product.name} to cart!`);
    };

    const removeItemFromBasket = (productId: number, price: number) => {
        setCartItems((prevItems) => {
            const updatedItems = prevItems
                .map((item) => (item.id === productId && item.quantity > 0 ? { ...item, quantity: item.quantity - 1 } : item))
                .filter((item) => item.quantity > 0);
            setCartCount((prev) => prev - 1);
            setTotalPrice((prev) => prev - price);
            setUserBalance((prev) => prev + price);
            return updatedItems;
        });
    };

    const processSearchSubmission = (e: React.FormEvent) => {
        e.preventDefault();
    };

    const captureNewsletterEmail = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const email = form.email.value;
        console.log(`Subscribing email: ${email}`);
        form.reset();
        triggerToast("Thank you for subscribing!");
    };

    const startCheckoutFlow = () => {
        if (cartItems.length === 0) {
            setError("Your cart is empty");
            return;
        }
        triggerToast("Proceeding to checkout...");
    };

    
    const availableCategories = useMemo(() => {
        const uniqueCategories = new Set(
            products.map(p => p.category).filter((c): c is string => !!c) 
        );
        
        const sortedCategories = Array.from(uniqueCategories).sort();
        return ['All', ...sortedCategories];
    }, [products]);

    
    const filteredProducts = useMemo(() => {
        let categoryFiltered = products;
        
        if (selectedCategory && selectedCategory !== 'All') {
            categoryFiltered = products.filter(product =>
                product.category?.toLowerCase() === selectedCategory.toLowerCase()
            );
        }

        
        if (searchQuery) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            return categoryFiltered.filter(product =>
                product.name.toLowerCase().includes(lowerCaseQuery) ||
                product.description?.toLowerCase().includes(lowerCaseQuery)
            );
        }

        return categoryFiltered; 
    }, [products, selectedCategory, searchQuery]);


    const footerLinks = {
        shop: [
            { name: "New Arrivals", url: "/new-arrivals" },
            { name: "Best Sellers", url: "/best-sellers" },
            { name: "Sale", url: "/sale" },
            { name: "Men's Collection", url: "/mens" },
            { name: "Women's Collection", url: "/womens" },
            { name: "Kids' Collection", url: "/kids" },
        ],
        support: [
            { name: "Contact Us", url: "/contact" },
            { name: "FAQs", url: "/faqs" },
            { name: "Shipping & Delivery", url: "/shipping" },
            { name: "Returns & Exchanges", url: "/returns" },
            { name: "Size Guide", url: "/size-guide" },
            { name: "Track Order", url: "/track-order" },
        ],
        company: [
            { name: "About Us", url: "/about" },
            { name: "Careers", url: "/careers" },
            { name: "Blog", url: "/blog" },
            { name: "Sustainability", url: "/sustainability" },
            { name: "Store Locations", url: "/stores" },
            { name: "Affiliate Program", url: "/affiliates" },
        ],
        legal: [
            { name: "Terms of Service", url: "/terms" },
            { name: "Privacy Policy", url: "/privacy" },
            { name: "Cookie Policy", url: "/cookies" },
            { name: "Accessibility", url: "/accessibility" },
        ],
    };

    const socialLinks = [
        { name: "Facebook", icon: "facebook", url: "https://facebook.com/ecostyle" },
        { name: "Twitter", icon: "twitter", url: "https://twitter.com/ecostyle" },
        { name: "Instagram", icon: "instagram", url: "https://instagram.com/ecostyle" },
        { name: "Pinterest", icon: "pinterest", url: "https://pinterest.com/ecostyle" },
        { name: "YouTube", icon: "youtube", url: "https://youtube.com/ecostyle" },
    ];

    const paymentMethods = [
        { name: "Visa", icon: "visa" },
        { name: "Mastercard", icon: "mastercard" },
        { name: "American Express", icon: "amex" },
        { name: "PayPal", icon: "paypal" },
        { name: "Apple Pay", icon: "applepay" },
        { name: "Google Pay", icon: "googlepay" },
    ];

    
    const updateWishlistStatus = (productId: number) => {
        setWishlistItems(prev => {
            const newWishlist = new Set(prev);
            if (newWishlist.has(productId)) {
                newWishlist.delete(productId);
                triggerToast("Removed from wishlist");
            } else {
                newWishlist.add(productId);
                triggerToast("Added to wishlist");
            }
            return newWishlist;
        });
    };

    return (
        <div
            className={`min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-800 dark:from-slate-900 dark:to-slate-800 dark:text-white`}
        >
            <div
                className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-2 px-4 text-center text-sm font-medium"
                role="banner"
                aria-label="Promotional message"
            >
                <p>Free shipping on orders over $100 | Use code WELCOME20 for 20% off your first order</p>
            </div>

            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="sticky top-0 z-50 shadow-lg"
                role="navigation"
                aria-label="Main navigation"
            >
                <div
                    className="py-4 px-8 flex justify-between items-center"
                    style={{
                        background: "linear-gradient(135deg, rgba(20, 184, 166, 0.95) 0%, rgba(5, 150, 105, 0.95) 100%)",
                        backdropFilter: "blur(8px)",
                        boxShadow: "0 10px 30px -10px rgba(20, 184, 166, 0.3)",
                    }}
                >
                    <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-2 text-white text-2xl font-bold">
                        <Link href="/" aria-label="EcoStyle Home">
                            <motion.div
                                animate={{
                                    rotate: [0, 10, 0, -10, 0],
                                    scale: [1, 1.1, 1],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Number.POSITIVE_INFINITY,
                                    repeatDelay: 5,
                                }}
                            >
                                <FaTshirt className="text-white text-3xl drop-shadow-lg" />
                            </motion.div>
                        </Link>
                        <span className="hidden sm:inline bg-clip-text text-transparent bg-gradient-to-r from-white to-emerald-100">
                            EcoStyle
                        </span>
                    </motion.div>

                    <div className="hidden md:block w-1/3 max-w-md">
                        <form onSubmit={processSearchSubmission} role="search">
                            <div className="flex items-center bg-white/20 rounded-full px-4 py-2">
                                <input
                                    type="search"
                                    placeholder="Search for products..."
                                    className="bg-transparent border-none outline-none text-white placeholder-white/70 w-full"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    aria-label="Search for products"
                                />
                                <button type="submit" aria-label="Submit search" className="cursor-pointer">
                                    <FaSearch className="text-white ml-2" />
                                </button>
                            </div>
                        </form>
                    </div>

                    <ul className="flex space-x-4 md:space-x-6 text-white font-medium items-center">
                        <motion.li whileHover={{ scale: 1.05 }} className="text-sm sm:text-base bg-white/20 px-3 py-1 rounded-full">
                            <span aria-label="Current balance">Balance: ${userBalance.toFixed(2)}</span>
                        </motion.li>
                        <motion.li className="relative">
                            <motion.button
                                className="p-2 rounded-full hover:bg-white/20 transition cursor-pointer"
                                aria-label="User account"
                                onClick={() => {
                                    setShowAccountDropdown(prev => !prev);
                                    setShowWishlistDropdown(false);
                                    setShowCart(false);
                                }}
                                aria-expanded={showAccountDropdown}
                                aria-controls="account-dropdown"
                            >
                                <FaUser className="text-xl" />
                            </motion.button>
                            <AnimatePresence>
                                {showAccountDropdown && (
                                    <motion.div
                                        id="account-dropdown"
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-3 z-50 border border-teal-100 dark:border-teal-900"
                                        role="menu"
                                        aria-label="Account options"
                                    >
                                        <ul className="space-y-2">
                                            {[
                                                { label: "My Profile", action: () => triggerToast("Viewing profile..."), icon: FaUserCircle },
                                                { label: "Order History", action: () => triggerToast("Viewing orders..."), icon: FaClipboardList },
                                                { label: "Settings", action: () => triggerToast("Opening settings..."), icon: FaCog },
                                                { label: "Logout", action: () => triggerToast("Logging out..."), icon: FaSignOutAlt },
                                            ].map((item) => (
                                                <li key={item.label}>
                                                    <button
                                                        onClick={() => {
                                                            item.action();
                                                            setShowAccountDropdown(false);
                                                        }}
                                                        className="flex items-center w-full text-left px-3 py-2 hover:bg-teal-50 dark:hover:bg-slate-700 rounded-md text-slate-700 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition cursor-pointer"
                                                        role="menuitem"
                                                    >
                                                        <item.icon className="mr-3 text-teal-600 dark:text-teal-400" aria-hidden="true" />
                                                        {item.label}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.li>
                        <motion.li className="relative">
                            <motion.button
                                className="p-2 rounded-full hover:bg-white/20 transition cursor-pointer"
                                aria-label="Wishlist"
                                onClick={() => {
                                    setShowWishlistDropdown(prev => !prev);
                                    setShowAccountDropdown(false);
                                    setShowCart(false);
                                }}
                                aria-expanded={showWishlistDropdown}
                                aria-controls="wishlist-dropdown"
                            >
                                <FaHeart className="text-xl" />
                            </motion.button>
                            <AnimatePresence>
                                {showWishlistDropdown && (
                                    <motion.div
                                        id="wishlist-dropdown"
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="absolute left-1/2 -translate-x-1/2 mt-2 w-60 bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-4 z-50 border border-teal-100 dark:border-teal-900"
                                        role="dialog"
                                        aria-label="Wishlist contents"
                                    >
                                        <h3 className="font-bold text-slate-800 dark:text-white mb-2">Your Wishlist</h3>
                                        <div className="max-h-60 overflow-y-auto">
                                            {wishlistItems.size > 0 ? (
                                                Array.from(wishlistItems).map(itemId => {
                                                    
                                                    const item = products.find(p => p.id === itemId);
                                                    if (!item) return null; 
                                                    return (
                                                        <div key={item.id} className="flex items-center justify-between py-2 border-b dark:border-slate-700">
                                                            <span className="text-sm text-slate-700 dark:text-white">{item.name}</span>
                                                            <button 
                                                                onClick={() => updateWishlistStatus(item.id)} 
                                                                className="text-xs text-rose-500 hover:text-rose-700 cursor-pointer"
                                                                aria-label={`Remove ${item.name} from wishlist`}
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <p className="text-slate-600 dark:text-slate-400 text-center py-4">Your wishlist is empty</p>
                                            )}
                                        </div>
                                        <button 
                                            onClick={() => triggerToast('Viewing full wishlist...')} 
                                            className="w-full mt-3 text-center text-sm text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
                                        >
                                            View All
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.li>
                        <li className="relative">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                onClick={() => {
                                    setShowCart(!showCart);
                                    setShowAccountDropdown(false);
                                    setShowWishlistDropdown(false);
                                }}
                                className="flex items-center space-x-2 p-2 rounded-full hover:bg-white/20 transition cursor-pointer"
                                aria-label={`Shopping cart with ${cartCount} items totaling ${totalPrice.toFixed(2)}`}
                                aria-expanded={showCart}
                                aria-controls="cart-dropdown"
                            >
                                <FaShoppingCart className="text-xl" />
                                <span className="hidden sm:inline">
                                    ({cartCount}) - ${totalPrice.toFixed(2)}
                                </span>
                                {cartCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-2 -right-2 bg-white text-teal-600 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center sm:hidden"
                                        aria-hidden="true"
                                    >
                                        {cartCount}
                                    </motion.span>
                                )}
                            </motion.button>

                            <AnimatePresence>
                                {showCart && (
                                    <motion.div
                                        id="cart-dropdown"
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-4 z-50 border border-teal-100 dark:border-teal-900"
                                        role="dialog"
                                        aria-label="Shopping cart contents"
                                    >
                                        <h3 className="font-bold text-slate-800 dark:text-white mb-2">Your Cart</h3>
                                        {cartItems.length > 0 ? (
                                            <>
                                                <div className="max-h-60 overflow-y-auto">
                                                    {cartItems.map((item) => (
                                                        <motion.div
                                                            key={item.id}
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            exit={{ opacity: 0 }}
                                                            className="flex justify-between items-center py-2 border-b dark:border-slate-700"
                                                        >
                                                            <div>
                                                                <p className="text-sm font-medium text-slate-800 dark:text-white">
                                                                    {item.name}
                                                                </p>
                                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                                    ${item.price} x {item.quantity}
                                                                </p>
                                                            </div>
                                                            <motion.button
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                onClick={() => removeItemFromBasket(item.id, item.price)}
                                                                className="text-xs bg-gradient-to-r from-rose-500 to-pink-500 text-white px-2 py-1 rounded-md cursor-pointer"
                                                                aria-label={`Remove ${item.name} from cart`}
                                                            >
                                                                Remove
                                                            </motion.button>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                                <div className="mt-3 pt-2 border-t dark:border-slate-700 flex justify-between">
                                                    <span className="font-bold text-slate-800 dark:text-white">Total:</span>
                                                    <span className="font-bold text-teal-600">${totalPrice.toFixed(2)}</span>
                                                </div>
                                                <motion.button
                                                    whileHover={{ scale: 1.03 }}
                                                    whileTap={{ scale: 0.97 }}
                                                    className="w-full mt-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-2 rounded-lg font-medium cursor-pointer"
                                                    onClick={startCheckoutFlow}
                                                    aria-label={`Proceed to checkout with ${cartCount} items totaling ${totalPrice.toFixed(
                                                        2
                                                    )}`}
                                                >
                                                    Checkout
                                                </motion.button>
                                            </>
                                        ) : (
                                            <p className="text-slate-600 dark:text-slate-400 text-center py-4">Your cart is empty</p>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </li>
                    </ul>
                </div>

                <div className="bg-white dark:bg-slate-800 shadow-md py-3 px-8 hidden md:block">
                    <ul className="flex justify-center space-x-6 text-slate-700 dark:text-white font-medium">
                        {availableCategories.map((categoryName) => (
                            <li key={categoryName}>
                                <button
                                    onClick={() => setSelectedCategory(categoryName === 'All' ? null : categoryName)}
                                    className={`py-1 px-3 rounded-md transition cursor-pointer ${ 
                                        (selectedCategory === categoryName || (!selectedCategory && categoryName === 'All'))
                                        ? 'bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 font-semibold' 
                                        : 'hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-700' 
                                    }`}
                                >
                                    {categoryName}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="md:hidden bg-white dark:bg-slate-800 shadow-md py-3 px-8 flex justify-between items-center">
                    <button
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                        className="text-slate-700 dark:text-white cursor-pointer"
                        aria-expanded={showMobileMenu}
                        aria-controls="mobile-menu"
                        aria-label="Toggle mobile menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                    <form onSubmit={processSearchSubmission} className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-full px-3 py-1 w-2/3">
                        <input
                            type="search"
                            placeholder="Search..."
                            className="bg-transparent border-none outline-none text-slate-700 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 w-full text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            aria-label="Search for products"
                        />
                        <button type="submit" aria-label="Submit search" className="cursor-pointer">
                            <FaSearch className="text-slate-500 dark:text-slate-400 ml-2 text-sm" />
                        </button>
                    </form>
                </div>

                <AnimatePresence>
                    {showMobileMenu && (
                        <motion.div
                            id="mobile-menu"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-white dark:bg-slate-800 shadow-md md:hidden overflow-hidden"
                            role="menu"
                        >
                            <ul className="py-3 px-8 space-y-3">
                                {availableCategories.map((categoryName) => (
                                    <li key={categoryName} className="py-2 border-b dark:border-slate-700" role="menuitem">
                                         <button
                                            onClick={() => {
                                                setSelectedCategory(categoryName === 'All' ? null : categoryName);
                                                setShowMobileMenu(false); 
                                            }}
                                            className={`w-full text-left px-2 py-1 rounded ${ 
                                                (selectedCategory === categoryName || (!selectedCategory && categoryName === 'All'))
                                                ? 'bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 font-semibold' 
                                                : 'text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700' 
                                            }`}
                                        >
                                            {categoryName}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            <section
                className="text-center py-16 md:py-24 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 relative overflow-hidden"
                aria-labelledby="hero-heading"
            >
                <div
                    className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTEyIDBoNnY2aC02di02em0xMiAwaDZ2NmgtNnYtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50 dark:opacity-20"
                    aria-hidden="true"
                ></div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative z-10 px-4"
                >
                    <motion.h1
                        id="hero-heading"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400"
                    >
                        Elevate Your Style
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-slate-600 dark:text-slate-300 text-lg mb-8 max-w-xl mx-auto"
                    >
                        Discover our handpicked collection of premium clothing designed for comfort, style, and confidence.
                    </motion.p>
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(20, 184, 166, 0.5)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={jumpToProductSection}
                        className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition cursor-pointer"
                        aria-label="Shop now and view products"
                    >
                        Shop Now
                    </motion.button>
                </motion.div>
            </section>

            <section ref={productRef} className="px-4 md:px-12 py-16 md:py-24" aria-labelledby="featured-products-heading">
                <motion.h2
                    id="featured-products-heading"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400"
                >
                    Featured Products
                </motion.h2>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 font-semibold text-center px-4 py-3 mb-8 rounded-lg max-w-md mx-auto"
                            role="alert"
                            aria-live="assertive"
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{
                                        y: -10,
                                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                                    }}
                                    className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden group relative"
                                >
                                    
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => updateWishlistStatus(product.id)}
                                        className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm text-slate-700 dark:text-white hover:text-rose-500 dark:hover:text-rose-400 transition cursor-pointer"
                                        aria-label={wishlistItems.has(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                                    >
                                        {wishlistItems.has(product.id) ? (
                                            <FaHeart className="w-5 h-5 text-rose-500" />
                                        ) : (
                                            <FaRegHeart className="w-5 h-5" />
                                        )}
                                    </motion.button>

                                    <div
                                        className="h-56 overflow-hidden relative cursor-pointer"
                                        onClick={() => showItemDetails(product.id)}
                                        role="button"
                                        tabIndex={0}
                                        aria-label={`View details for ${product.name}`}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                                showItemDetails(product.id);
                                            }
                                        }}
                                    >
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.6 }}
                                            className="absolute inset-0 bg-gradient-to-tr from-teal-500/20 to-emerald-500/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                                        ></motion.div>
                                        <motion.img
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.6 }}
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                        
                                        {(product.id === 1 || product.id === 2) && (
                                            <motion.span
                                                initial={{ opacity: 0, scale: 0 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="absolute top-4 left-4 z-20 bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 text-xs font-bold px-3 py-1 rounded-full shadow-md"
                                            >
                                                NEW
                                            </motion.span>
                                        )}
                                    </div>

                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-semibold text-slate-800 dark:text-white">
                                                <button
                                                    onClick={() => showItemDetails(product.id)}
                                                    className="hover:text-teal-600 dark:hover:text-teal-400 transition cursor-pointer"
                                                    aria-label={`View details for ${product.name}`}
                                                >
                                                    {product.name}
                                                </button>
                                            </h3>
                                            <span className="text-xs bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 px-2 py-1 rounded-full">
                                                {product.category}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center mb-4">
                                            <p className="text-teal-600 dark:text-teal-400 font-bold text-xl">${product.price.toFixed(2)}</p>
                                            <div className="flex space-x-1" aria-label={`Rated ${product.rating} out of 5 stars`}>
                                                {[...Array(5)].map((_, i) => (
                                                    <svg
                                                        key={i}
                                                        className={`w-4 h-4 ${
                                                            i < Math.floor(product.rating || 0)
                                                                ? "text-yellow-400"
                                                                : "text-gray-300 dark:text-gray-600"
                                                        }`}
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                        aria-hidden="true"
                                                    >
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                                    </svg>
                                                ))}
                                            </div>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => addItemToBasket(product)}
                                            className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white py-3 px-4 rounded-xl shadow transition font-medium cursor-pointer"
                                            aria-label={`Add ${product.name} to cart for ${product.price.toFixed(2)}`}
                                        >
                                            Add to Cart
                                        </motion.button>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <p className="text-center text-slate-600 dark:text-slate-400 col-span-full py-10">
                                No products found in this category.
                            </p>
                        )}
                    </div>
                )}
            </section>

            <section
                className="bg-gradient-to-r from-teal-500 to-emerald-500 dark:from-teal-700 dark:to-emerald-700 text-white py-16 md:py-24 text-center relative overflow-hidden"
                aria-labelledby="newsletter-heading"
            >
                <div
                    className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzR2Nmg2di02aC02em02IDZ2Nmg2di02aC02em0tMTIgMGg2djZoLTZ2LTZ6bTEyIDBoNnY2aC02di02eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"
                    aria-hidden="true"
                ></div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-xl mx-auto px-4 relative z-10"
                >
                    <motion.h2
                        id="newsletter-heading"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-4xl font-bold mb-4"
                    >
                        Get 20% Off Your First Order!
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="mb-8 text-lg opacity-90"
                    >
                        Join our newsletter and receive exclusive offers and updates straight to your inbox.
                    </motion.p>
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto"
                        onSubmit={captureNewsletterEmail}
                    >
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            className="px-5 py-3 rounded-full bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg w-full"
                            required
                            aria-label="Email for newsletter"
                        />
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white text-teal-600 hover:bg-slate-100 font-semibold py-3 px-6 rounded-full shadow-lg transition sm:whitespace-nowrap cursor-pointer"
                            aria-label="Subscribe to newsletter"
                        >
                            Subscribe Now
                        </motion.button>
                    </motion.form>
                </motion.div>
            </section>

            <footer className="relative overflow-hidden" role="contentinfo" aria-label="Site footer">
                <div className="bg-white dark:bg-slate-900 py-12">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="flex flex-col items-center text-center"
                            >
                                <div
                                    className="w-16 h-16 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mb-4"
                                    aria-hidden="true"
                                >
                                    <FaTruck className="text-2xl text-teal-600 dark:text-teal-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Free Shipping</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm">On all orders over $100</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="flex flex-col items-center text-center"
                            >
                                <div
                                    className="w-16 h-16 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mb-4"
                                    aria-hidden="true"
                                >
                                    <FaUndo className="text-2xl text-teal-600 dark:text-teal-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Easy Returns</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm">30-day return policy</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="flex flex-col items-center text-center"
                            >
                                <div
                                    className="w-16 h-16 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mb-4"
                                    aria-hidden="true"
                                >
                                    <FaShieldAlt className="text-2xl text-teal-600 dark:text-teal-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Secure Payments</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm">Protected by industry leaders</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                                className="flex flex-col items-center text-center"
                            >
                                <div
                                    className="w-16 h-16 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mb-4"
                                    aria-hidden="true"
                                >
                                    <FaCreditCard className="text-2xl text-teal-600 dark:text-teal-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Flexible Payment</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm">Pay with multiple methods</p>
                            </motion.div>
                        </div>
                    </div>
                </div>

                <div className="py-12 relative overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-gradient-to-br from-teal-900 via-emerald-900 to-green-900 opacity-95"></div>
                        <div
                            className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTEyIDBoNnY2aC02di02em0xMiAwaDZ2NmgtNnYtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"
                            aria-hidden="true"
                        ></div>
                        <motion.div
                            className="absolute inset-0 opacity-20"
                            style={{
                                background:
                                    "radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.8) 0%, transparent 30%), radial-gradient(circle at 80% 20%, rgba(5, 150, 105, 0.8) 0%, transparent 30%)",
                            }}
                            animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.2, 0.3, 0.2],
                            }}
                            transition={{
                                duration: 8,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeInOut",
                            }}
                            aria-hidden="true"
                        ></motion.div>
                    </div>

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
                            <div className="lg:col-span-2">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="flex items-center space-x-2 text-2xl font-bold mb-6 text-white"
                                >
                                    <FaTshirt className="text-emerald-300 text-3xl" aria-hidden="true" />
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-teal-300 font-extrabold">
                                        EcoStyle
                                    </span>
                                </motion.div>

                                <p className="text-white/80 mb-6 max-w-md">
                                    EcoStyle is committed to sustainable fashion that doesn't compromise on style or comfort. Our products
                                    are ethically sourced and environmentally friendly.
                                </p>

                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3 text-white/80">
                                        <FaMapMarkerAlt className="text-emerald-300" aria-hidden="true" />
                                        <address className="not-italic">123 Fashion Street, Style City, SC 12345</address>
                                    </div>
                                    <div className="flex items-center space-x-3 text-white/80">
                                        <FaPhone className="text-emerald-300" aria-hidden="true" />
                                        <a href="tel:+15551234567" className="hover:text-emerald-300 transition">
                                            +1 (555) 123-4567
                                        </a>
                                    </div>
                                    <div className="flex items-center space-x-3 text-white/80">
                                        <FaEnvelope className="text-emerald-300" aria-hidden="true" />
                                        <a href="mailto:contact@ecostyle.com" className="hover:text-emerald-300 transition">
                                            contact@ecostyle.com
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                            >
                                <h4 className="font-semibold text-emerald-300 mb-4 text-lg">Shop</h4>
                                <ul className="space-y-3">
                                    {footerLinks.shop.map((link, index) => (
                                        <li key={index}>
                                            <Link href={link.url} className="text-white/80 hover:text-emerald-300 transition">
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                            >
                                <h4 className="font-semibold text-teal-300 mb-4 text-lg">Support</h4>
                                <ul className="space-y-3">
                                    {footerLinks.support.map((link, index) => (
                                        <li key={index}>
                                            <Link href={link.url} className="text-white/80 hover:text-teal-300 transition">
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                            >
                                <h4 className="font-semibold text-green-300 mb-4 text-lg">Company</h4>
                                <ul className="space-y-3">
                                    {footerLinks.company.map((link, index) => (
                                        <li key={index}>
                                            <Link href={link.url} className="text-white/80 hover:text-green-300 transition">
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="backdrop-blur-sm bg-white/5 rounded-2xl p-6 mb-12"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                                <div className="md:col-span-2">
                                    <h4 className="text-xl font-bold text-white mb-2">Subscribe to our newsletter</h4>
                                    <p className="text-white/80">Get the latest updates, sales and offers directly to your inbox.</p>
                                </div>
                                <form onSubmit={captureNewsletterEmail} className="flex flex-col sm:flex-row gap-3">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Your email"
                                        className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-teal-300/50 w-full"
                                        required
                                        aria-label="Email for newsletter"
                                    />
                                    <motion.button
                                        type="submit"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-medium py-2 px-4 rounded-lg whitespace-nowrap cursor-pointer"
                                        aria-label="Subscribe to newsletter"
                                    >
                                        Subscribe
                                    </motion.button>
                                </form>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="flex flex-wrap justify-center gap-6 mb-12"
                            aria-label="Payment methods accepted"
                        >
                            {paymentMethods.map((method, index) => {
                                let IconComponent;
                                switch (method.icon.toLowerCase()) {
                                    case 'visa': IconComponent = FaCcVisa; break;
                                    case 'mastercard': IconComponent = FaCcMastercard; break;
                                    case 'amex': IconComponent = FaCcAmex; break;
                                    case 'paypal': IconComponent = FaPaypal; break;
                                    case 'applepay': IconComponent = FaApplePay; break;
                                    case 'googlepay': IconComponent = FaGooglePay; break;
                                    default: IconComponent = null;
                                }
                                return (
                                    <div
                                        key={index}
                                        className="bg-white/10 rounded-lg p-2 w-12 h-8 flex items-center justify-center text-white/80"
                                        aria-label={method.name}
                                        title={method.name}
                                    >
                                       {IconComponent && <IconComponent size={24} />}
                                    </div>
                                );
                            })}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="border-t border-white/10 pt-8"
                        >
                            <div className="flex flex-col md:flex-row justify-between items-center">
                                <p className="text-white/70 mb-4 md:mb-0">© {new Date().getFullYear()} EcoStyle. All rights reserved.</p>
                                <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                                    {footerLinks.legal.map((link, index) => (
                                        <Link key={index} href={link.url} className="text-white/70 hover:text-teal-300 transition text-sm">
                                            {link.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-8 flex justify-center space-x-6">
                                {socialLinks.map((social, index) => (
                                    <motion.a
                                        key={index}
                                        href={social.url}
                                        whileHover={{ scale: 1.2, rotate: index % 2 === 0 ? 5 : -5 }}
                                        className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-teal-500/80 transition cursor-pointer"
                                        aria-label={`Follow us on ${social.name}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {social.icon === "facebook" && (
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                                                    clipRule="evenodd"
                                                ></path>
                                            </svg>
                                        )}
                                        {social.icon === "twitter" && (
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                                            </svg>
                                        )}
                                        {social.icon === "instagram" && (
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                                                    clipRule="evenodd"
                                                ></path>
                                            </svg>
                                        )}
                                        {social.icon === "pinterest" && (
                                            <FaPinterestP className="w-5 h-5" />
                                        )}
                                        {social.icon === "youtube" && (
                                            <FaYoutube className="w-5 h-5" />
                                        )}
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </footer>

            
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] p-4 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 rounded-lg shadow-lg text-center"
                        role="alert"
                        aria-live="assertive"
                    >
                        {toastMessage}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
