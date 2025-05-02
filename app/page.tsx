'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Star, ShoppingCart, Eye, Heart, Gamepad, Car, User, Menu, ChevronRight, Maximize2, Facebook, Twitter, Instagram, CheckCircle, ArrowLeft, ArrowRight, Filter, X, LayoutGrid, Award, Smile, Tag, Flame, Minus, Plus, Camera, Check, Sparkles, Focus, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Montserrat, Roboto } from 'next/font/google';


const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
});

const NavLink = ({ href, children }) => (
  <a href={href} className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
    {children}
  </a>
);


const DropdownMenu = ({ items, isOpen }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="absolute top-full left-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
      >
        <div className="py-1">
          {items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white cursor-pointer"
            >
              {item.label}
            </a>
          ))}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

const DropdownLink = ({ label, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null); 

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    const closeMenuIfClickedOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', closeMenuIfClickedOutside);
    return () => {
      document.removeEventListener('mousedown', closeMenuIfClickedOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
      >
        {label}
        <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <DropdownMenu items={items} isOpen={isOpen} />
    </div>
  );
};

const SiteHeader = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [mobileEyeglassesOpen, setMobileEyeglassesOpen] = React.useState(false);
  const [mobileSunglassesOpen, setMobileSunglassesOpen] = React.useState(false);
  const toggleMobileMenu = () => {
      setMobileMenuOpen(!isMobileMenuOpen);
      
      if (isMobileMenuOpen) { 
        setMobileEyeglassesOpen(false);
        setMobileSunglassesOpen(false);
      }
  };
  const toggleMobileEyeglasses = () => setMobileEyeglassesOpen(!mobileEyeglassesOpen);
  const toggleMobileSunglasses = () => setMobileSunglassesOpen(!mobileSunglassesOpen);

  const eyeglassesItems = [
    { href: '/eyeglasses/men', label: 'Men' },
    { href: '/eyeglasses/women', label: 'Women' },
    { href: '/eyeglasses/kids', label: 'Kids' },
    { href: '/eyeglasses/featured', label: 'Featured Styles' },
  ];

  const sunglassesItems = [
    { href: '/sunglasses/aviator', label: 'Aviator' },
    { href: '/sunglasses/wayfarer', label: 'Wayfarer' },
    { href: '/sunglasses/sport', label: 'Sport' },
    { href: '/sunglasses/polarized', label: 'Polarized' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <a href="/" className={`text-2xl font-bold mr-6 text-gray-900 dark:text-white ${montserrat.className} cursor-pointer`}>
              Focal
            </a>
            <nav className="hidden md:flex items-center space-x-6">
              <DropdownLink label="Eyeglasses" items={eyeglassesItems} />
              <DropdownLink label="Sunglasses" items={sunglassesItems} />
              <NavLink href="/brands">Brands</NavLink>
              <NavLink href="/about">About</NavLink>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
             <div className="hidden md:flex items-center space-x-4">
                <button className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 px-4 py-2 rounded-md transition-colors cursor-pointer">
                    Sign In
                </button>
                <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer">
                    <Search className="h-5 w-5" />
                </button>
             </div>

            <div className="md:hidden flex items-center">
                <button onClick={toggleMobileMenu} className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle menu</span>
                </button>
            </div>
          </div>
        </div>
        
        <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
             initial={{ opacity: 0, height: 0 }}
             animate={{ opacity: 1, height: 'auto' }}
             exit={{ opacity: 0, height: 0 }}
             transition={{ duration: 0.3 }}
             className="md:hidden absolute top-16 inset-x-0 p-2 shadow-lg ring-1 ring-black ring-opacity-5 bg-white dark:bg-gray-800 z-40 overflow-hidden"
           >
              <div className="pt-2 pb-3 space-y-1">
                
                <div>
                  <button 
                    onClick={toggleMobileEyeglasses} 
                    className="w-full flex justify-between items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <span>Eyeglasses</span>
                    <ChevronDown className={`h-5 w-5 transition-transform ${mobileEyeglassesOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                  {mobileEyeglassesOpen && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="pl-6 pb-1 space-y-1 overflow-hidden"
                       >
                        {eyeglassesItems.map(item => (
                            <a key={item.href} href={item.href} className="block px-3 py-1.5 rounded-md text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white cursor-pointer">{item.label}</a>
                        ))}
                      </motion.div>
                  )}
                  </AnimatePresence>
                </div>

                
                 <div>
                  <button 
                    onClick={toggleMobileSunglasses} 
                    className="w-full flex justify-between items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <span>Sunglasses</span>
                    <ChevronDown className={`h-5 w-5 transition-transform ${mobileSunglassesOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                  {mobileSunglassesOpen && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="pl-6 pb-1 space-y-1 overflow-hidden"
                      >
                        {sunglassesItems.map(item => (
                            <a key={item.href} href={item.href} className="block px-3 py-1.5 rounded-md text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white cursor-pointer">{item.label}</a>
                        ))}
                      </motion.div>
                  )}
                  </AnimatePresence>
                </div>
                 
                 
                 <a href="/brands" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">Brands</a>
                 <a href="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">About</a>
                 
                 <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                     <button className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                       Sign In
                     </button>
                      <button className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                       Search
                     </button>
                 </div>
              </div>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default function OpticalStoreLandingPage() {
  const [currentView, setCurrentView] = useState<'landing' | 'browsing' | 'detail'>('landing');
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [bestsellerIndex, setBestsellerIndex] = useState(0);

  const TrustpilotRating = () => (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4">
      <span className="font-bold text-sm text-gray-800 dark:text-gray-200">Trustpilot</span>
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-green-500 text-green-500" />
        ))}
      </div>
      <span className="text-sm text-gray-600 dark:text-gray-400">15,008 • Excellent</span>
      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">50K+ Satisfied customer</span>
    </div>
  );
  
  const ImageCard = ({ imgSrc, alt, label, brand, delay }: { imgSrc: string; alt: string; label: string; brand: string; delay: number }) => (
    <motion.div
      className="relative w-full sm:w-1/2 md:w-1/3 flex-shrink-0 rounded-lg overflow-hidden shadow-lg h-96 group cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay }}
      onClick={() => setCurrentView('browsing')}
    >
      <img src={imgSrc} alt={alt} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-6 w-full">
        <h3 className={`text-white text-xl font-semibold drop-shadow-md mb-1 ${montserrat.className}`}>{brand}</h3>
        <span className="flex items-center justify-between text-sm text-white font-medium">
          <span>{label}</span>
          <ChevronRight className="ml-1 h-4 w-4" />
        </span>
      </div>
    </motion.div>
  );


  const ProductCard = (product: any) => {
    const { imgSrc, alt, tag, tagIcon: TagIcon, colors, brand, name, price, delay } = product;
    
    const navigateToProductDetail = () => {
        const thumbUrls = [
            "https://m.media-amazon.com/images/I/61sfou+o0xS._AC_SX679_.jpg",
            "https://m.media-amazon.com/images/I/515j4f4Q+uL._AC_SX679_.jpg",
            "https://m.media-amazon.com/images/I/61w1E7QZ4YL._AC_SX679_.jpg"
        ];

        const detailProductData = {
            imgSrc: product.imgSrc,
            alt: product.alt,
            tag: product.tag,
            tagIcon: product.tagIcon,
            colors: product.colors,
            brand: product.brand,
            name: product.name,
            price: product.price,
            delay: product.delay,
            productId: product.productId || product.brand, 
            reviewCount: product.reviewCount || 45,
            reviewAvg: product.reviewAvg || 4.5,
            sizes: product.sizes || ['128mm', '133mm', '144mm', '150mm'],
            availableColors: product.availableColors || [
                '#22C55E', 
                '#64748B', 
                '#EF4444', 
                '#3B82F6'  
            ],
            lensOptions: product.lensOptions || [
                { name: 'Single Vision', icon: Focus },
                { name: 'Progressive', icon: Layers },
                { name: 'Frame only', icon: Eye },
            ],
            aboutDetails: product.aboutDetails || {
                'Frame Material': 'Acetate / Metal',
                'Frame Color': 'Green & Grey',
                'Frame Shape': 'Round',
                'Gender': 'Unisex',
                'Brand': product.brand || 'Focal Brand'
            },
            thumbnails: product.thumbnails || [
                product.imgSrc, 
                ...thumbUrls 
            ],
            originalPrice: product.originalPrice || (parseFloat(product.price) * 1.5).toFixed(2), 
            description: product.description || `Detailed description for ${product.name} - ${product.brand}.`
        };
        setSelectedProduct(detailProductData);
        setCurrentView('detail');    
    };

    return (
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col group cursor-pointer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: delay ?? 0 }}
        onClick={navigateToProductDetail} 
        whileHover={{ scale: 1.03 }} 
      >
        <div className="relative p-4">
          {tag && (
            <span className={`absolute top-2 left-2 flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium px-2 py-0.5 rounded`}>
              {TagIcon && <TagIcon className="h-3 w-3" />} 
              <span>{tag}</span>
            </span>
          )}
          <span className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 text-xs font-medium">{colors} Colours</span>
          <img src={imgSrc} alt={alt} className="w-full h-40 object-contain transition-transform duration-300 group-hover:scale-105 mt-4" />
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
          <p className="text-sm text-gray-500 dark:text-gray-400">{brand}</p>
          <h4 className="text-md font-medium text-gray-900 dark:text-white mt-1 truncate">{name}</h4>
          <div className="flex justify-between items-center mt-2">
            <span className={`text-lg font-semibold text-gray-900 dark:text-white ${montserrat.className}`}>${price}</span>
          </div>
        </div>
      </motion.div>
    );
  };

  const PersonalizedCard = ({ 
      IconComponent, 
      title, 
      description, 
      bgColorClass, 
      iconColorClass,
      delay
  }) => (
    <motion.div 
      className={`p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${bgColorClass}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay }}
    >
      <div className={`mb-4 inline-flex items-center justify-center p-2 rounded-md bg-white dark:bg-gray-800 ${iconColorClass}`}>
          <IconComponent className="h-6 w-6" />
      </div>
      <h4 className={`text-lg font-semibold text-gray-900 dark:text-white mb-2 ${montserrat.className}`}>{title}</h4>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </motion.div>
  );

  const FeatureCard = ({ 
    bgColorClass,
    title, 
    description, 
    buttonText, 
    buttonLink = "#", 
    imgSrc, 
    imgAlt, 
    imgPosition = 'bottom',
    children,
    textColorClass = 'text-gray-900 dark:text-white'
  }) => (
    <div className={`rounded-xl overflow-hidden shadow-lg ${bgColorClass} p-8 md:p-10 h-full flex flex-col`}>
      <h3 className={`text-2xl md:text-3xl font-bold mb-4 ${montserrat.className} ${textColorClass}`}>{title}</h3>
      <p className={`mb-6 ${imgSrc ? 'md:w-3/4' : ''} ${textColorClass} text-opacity-80 dark:text-opacity-80 text-sm`}>{description}</p>
      {buttonText && (
        <a href={buttonLink} className={`mt-auto inline-block px-6 py-2.5 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 font-medium text-sm rounded-full shadow-md hover:bg-gray-700 dark:hover:bg-gray-300 transition duration-150 ease-in-out cursor-pointer self-start ${textColorClass === 'text-white' || textColorClass === 'text-yellow-900 dark:text-yellow-100' ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-black' : ''}`}>
          {buttonText}
        </a>
      )}
      {imgSrc && imgPosition === 'bottom' && (
        <div className="mt-8 -mb-8 -mr-8 ml-0 md:-ml-8">
           <img src={imgSrc} alt={imgAlt || title} className="w-full object-cover rounded-b-xl max-h-56" />
        </div>
      )}
      {imgSrc && imgPosition === 'right' && (
         <div className="mt-8 flex-grow flex items-end justify-center">
             <img src={imgSrc} alt={imgAlt || title} className="max-h-40 object-contain" />
         </div>
       )} 
    </div>
  );


  const BestsellerSection = () => {
    const bestsellerProducts = [
       { imgSrc: "https://m.media-amazon.com/images/I/61KQdGa2XLL._AC_SL1500_.jpg", alt: "Gucci Glasses", tag: "Best Sellers", colors: 3, brand: "GC21421", name: "Gucci", price: "234.99", delay: 0.1 },
       { imgSrc: "https://m.media-amazon.com/images/I/517NNWePzdL._AC_SL1500_.jpg", alt: "Prada Glasses", tag: "Top Sellers", colors: 2, brand: "PD145214", name: "Prada", price: "174.99", delay: 0.2 },
       { imgSrc: "https://m.media-amazon.com/images/I/511E17uOuIL._AC_SX679_.jpg", alt: "Arnette Glasses 2", tag: "Best Sellers", colors: 3, brand: "AT257849", name: "Arnette", price: "241.99", delay: 0.3 },
       { imgSrc: "https://m.media-amazon.com/images/I/61-0EpsPCGL._AC_SL1500_.jpg", alt: "Alex Perry Glasses B", tag: "Best Sellers", colors: 3, brand: "AP2548", name: "Alex Perry", price: "187.99", delay: 0.1 },
       { imgSrc: "https://m.media-amazon.com/images/I/61kI5-36qaL._AC_SX679_.jpg", alt: "Persol Glasses B", tag: "Top Pick", colors: 2, brand: "AP2549", name: "Persol", price: "214.99", delay: 0.2 },
    ];

    const productsToShow = 3;
    const canGoPrev = bestsellerIndex > 0;
    const canGoNext = bestsellerIndex < bestsellerProducts.length - productsToShow;

    const showPreviousBestsellers = () => { 
        if (canGoPrev) {
            setBestsellerIndex(prev => prev - 1);
        }
    };
    const displayNextBestsellers = () => { 
        if (canGoNext) {
            setBestsellerIndex(prev => prev + 1);
        }
    };

    return (
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="flex justify-between items-center mb-8 md:mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 dark:text-white ${montserrat.className}`}>Bestseller</h2>
          <div className="flex space-x-2">
            <button 
              onClick={showPreviousBestsellers}
              disabled={!canGoPrev}
              className={`p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-900 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={displayNextBestsellers}
              disabled={!canGoNext}
              className={`p-2 rounded-full bg-gray-900 dark:bg-gray-200 text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-900 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {bestsellerProducts.slice(bestsellerIndex, bestsellerIndex + productsToShow).map((product, index) => (
            <ProductCard key={`${product.brand}-${index}`} {...product} delay={(index + 1) * 0.1} />
          ))}
        </div>
      </section>
    );
  };

  const SiteFooter = () => {
    const currentYear = new Date().getFullYear();

    const FooterLinkColumn = ({ title, links }: { title: string; links: { href: string; label: string }[] }) => (
      <div>
        <h5 className={`font-semibold mb-4 text-gray-900 dark:text-white ${montserrat.className}`}>{title}</h5>
        <ul className="space-y-3">
          {links.map((link, index) => (
            <li key={index}>
              <a href={link.href} className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );

    const SocialLink = ({ href, Icon }: { href: string; Icon: React.ElementType }) => (
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
        <Icon className="h-5 w-5" />
      </a>
    );

    const processNewsletterSubscription = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Newsletter signup submitted");
        alert("Thank you for subscribing!"); 
    };

    return (
      <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <FooterLinkColumn title="Shop" links={[
              { href: "/eyeglasses", label: "Eyeglasses" },
              { href: "/sunglasses", label: "Sunglasses" },
              { href: "/brands", label: "Brands" },
              { href: "/sale", label: "Sale" },
            ]} />
            <FooterLinkColumn title="Company" links={[
              { href: "/about", label: "About Us" },
              { href: "/careers", label: "Careers" },
              { href: "/press", label: "Press" },
              { href: "/blog", label: "Blog" },
            ]} />
            <FooterLinkColumn title="Support" links={[
              { href: "/contact", label: "Contact Us" },
              { href: "/faq", label: "FAQ" },
              { href: "/shipping", label: "Shipping" },
              { href: "/returns", label: "Returns" },
            ]} />
            <div>
               <h5 className={`font-semibold mb-4 text-gray-900 dark:text-white ${montserrat.className}`}>Stay Updated</h5>
               <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Get the latest news and offers directly in your inbox.</p>
               <form onSubmit={processNewsletterSubscription} className="flex flex-col sm:flex-row gap-2">
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    required
                    className="flex-grow px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors cursor-pointer text-sm"
                  >
                    Subscribe
                  </button>
               </form>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 md:mb-0">
              &copy; {currentYear} Focal. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <SocialLink href="#" Icon={Twitter} />
              <SocialLink href="#" Icon={Facebook} />
              <SocialLink href="#" Icon={Instagram} />
            </div>
          </div>
        </div>
      </footer>
    );
  };

  const ProductBrowsingPageContent = () => {
    const filters = [
      { name: 'All Eyeglasses', icon: LayoutGrid, count: '500+' },
      { name: 'New arrivals', icon: Star, count: '354' },
      { name: 'Best sellers', icon: Award, count: '240' },
      { name: 'Your eye covered', icon: Smile, count: '300' },
      { name: 'Up to 50% Off', icon: Tag, count: '188' },
    ];
    const [activeFilter, setActiveFilter] = useState('All Eyeglasses');

    const productsForBrowsing = React.useMemo(() => [
      { imgSrc: "https://m.media-amazon.com/images/I/61sfou+o0xS._AC_SX679_.jpg", alt: "Persol Glasses", tag: "Hot Deal", tagIcon: Flame, colors: 3, brand: "AC21984", name: "Persol", price: "120.00", delay: 0.1, reviewAvg: 4.2, reviewCount: 30 },
      { imgSrc: "https://m.media-amazon.com/images/I/515j4f4Q+uL._AC_SX679_.jpg", alt: "Prada Glasses", tag: "Top Pick", colors: 2, brand: "PD18749", name: "Prada", price: "189.99", delay: 0.2, reviewAvg: 4.8, reviewCount: 55 },
      { imgSrc: "https://m.media-amazon.com/images/I/61w1E7QZ4YL._AC_SX679_.jpg", alt: "Oakley Glasses", tag: "Flash Sale", tagIcon: Flame, colors: 4, brand: "OL24844", name: "Oakley", price: "199.99", delay: 0.1 },
      { imgSrc: "https://m.media-amazon.com/images/I/61lJOCmrMLL._AC_SX679_.jpg", alt: "Gucci Glasses", tag: "Hot Deal", tagIcon: Flame, colors: 3, brand: "GC15786", name: "Gucci", price: "349.99", delay: 0.2 },
      { imgSrc: "https://m.media-amazon.com/images/I/51TqXTRgK0L._AC_SX679_.jpg", alt: "Arnette Glasses", tag: "New Arrival", colors: 2, brand: "AP2549 Optics", name: "Arnette", price: "249.99", delay: 0.3, reviewAvg: 4.0, reviewCount: 12 },
      { imgSrc: "https://m.media-amazon.com/images/I/61-0EpsPCGL._AC_SL1500_.jpg", alt: "Alex Perry Glasses", tag: "Best Sellers", colors: 3, brand: "AP2548 Optics", name: "Alex Perry", price: "187.99", delay: 0.1 },
      { imgSrc: "https://m.media-amazon.com/images/I/61kI5-36qaL._AC_SX679_.jpg", alt: "Persol Glasses 2", tag: "Top Pick", colors: 2, brand: "AP2549 Optics", name: "Persol", price: "214.99", delay: 0.2 },
      { imgSrc: "https://m.media-amazon.com/images/I/51E3DleHwiL._AC_SL1500_.jpg", alt: "Arnette Glasses 3", tag: "Flash Sale", colors: 4, brand: "AP2549 Optics", name: "Arnette", price: "199.99", delay: 0.3 },
    ], []);

    const filteredProducts = React.useMemo(() => {
        if (activeFilter === 'All Eyeglasses' || activeFilter === 'Your eye covered') {
            return productsForBrowsing;
        }
        if (activeFilter === 'New arrivals') {
            return productsForBrowsing.filter(p => p.tag === 'New Arrival');
        }
        if (activeFilter === 'Best sellers') {
            return productsForBrowsing.filter(p => p.tag === 'Best Sellers');
        }
        if (activeFilter === 'Up to 50% Off') {
             return productsForBrowsing.filter(p => p.tag === 'Hot Deal' || p.tag === 'Flash Sale');
        }
        return productsForBrowsing; 
    }, [activeFilter, productsForBrowsing]);

    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col md:flex-row gap-8"> 
          <aside className="w-full md:w-60 lg:w-64 xl:w-72 flex-shrink-0">
             <nav className="space-y-1 sticky top-20">
                {filters.map((filter) => {
                  const Icon = filter.icon;
                  const isActive = activeFilter === filter.name;
                  return (
                    <button
                      key={filter.name}
                      onClick={() => setActiveFilter(filter.name)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg text-sm font-medium transition-colors duration-150 ease-in-out group cursor-pointer ${ 
                        isActive 
                        ? 'bg-gray-800 dark:bg-gray-700 text-white' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <span className="flex items-center space-x-3">
                         <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200'}`} />
                         <span>{filter.name}</span>
                      </span>
                      <span className={`text-xs font-normal ${isActive ? 'text-gray-300' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200'}`}>
                         {filter.count}
                      </span>
                    </button>
                  );
                })}
             </nav>
           </aside>

          <section className="w-full md:flex-1">
            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                    <ProductCard key={`${product.brand}-${product.name}-${index}`} {...product} /> 
                ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <p className="text-lg text-gray-600 dark:text-gray-400">No products found matching "{activeFilter}".</p>
                </div>
            )}
          </section>
        </div>
      </div>
    );
  };

  const ProductDetailPageContent = ({ product }: { product: any }) => {
    const [selectedSize, setSelectedSize] = useState<string | null>(product?.sizes?.[0] || null);
    const [selectedColor, setSelectedColor] = useState<string | null>(product?.availableColors?.[0] || null);
    const [selectedLens, setSelectedLens] = useState<string | null>(product?.lensOptions?.[0]?.name || null);
    const [useInsurance, setUseInsurance] = useState(false);
    const [mainImage, setMainImage] = useState(product?.imgSrc || '');

    if (!product) return null; 

    const thumbnails: string[] = product?.thumbnails || [product?.imgSrc || ''];

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
           
           <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6" >
              <a href="#" onClick={(e) => { e.preventDefault(); setCurrentView('landing'); }} className="hover:underline">Home</a>
              <span className="mx-2">/</span>
              <a href="#" onClick={(e) => { e.preventDefault(); setCurrentView('browsing'); }} className="hover:underline">Eyeglasses</a> 
              <span className="mx-2">/</span>
              <span className="text-gray-700 dark:text-gray-200">{product?.name || 'Product'}</span> 
           </nav>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">
                
                <div className="space-y-6">
                    
                    <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex items-center justify-center aspect-square overflow-hidden shadow-inner">
                         {product.tag && (
                            <span className={`absolute top-3 left-3 flex items-center space-x-1 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium px-2 py-0.5 rounded z-10`}>
                                {product.tagIcon && <product.tagIcon className="h-3 w-3" />} 
                                <span>{product.tag}</span>
                            </span>
                         )}
                        <motion.img 
                            key={mainImage} 
                            src={mainImage}
                            alt={product.alt}
                            className="max-w-full max-h-[400px] object-contain"
                            initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
                        />
                    </div>
                     
                    <div className="grid grid-cols-2 gap-3">
                        {thumbnails.slice(0, 4).map((thumb: string, index: number) => (
                            <button 
                                key={index} 
                                onClick={() => setMainImage(thumb)}
                                className={`aspect-square rounded-md overflow-hidden border-2 p-1 flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${mainImage === thumb ? 'border-blue-500' : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'}`}>
                                <img src={thumb} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-contain"/>
                            </button>
                        ))}
                    </div>
                    
                    {product.aboutDetails && (
                       <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
                          <h3 className={`text-xl font-semibold mb-4 ${montserrat.className}`}>About this product</h3>
                          <dl className="space-y-3 text-sm">
                             
                             {Object.entries(product.aboutDetails).map(([key, value]) => ( 
                                <div key={key} className="flex justify-between">
                                   <dt className="text-gray-500 dark:text-gray-400">{key}</dt>
                                   
                                   <dd className="text-gray-800 dark:text-gray-200 font-medium">{value as string}</dd>
                                </div>
                             ))}
                          </dl>
                       </div>
                    )}
                </div>

                
                <div className="space-y-6 sticky top-24">
                     
                    <div>
                        <h1 className={`text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white ${montserrat.className}`}>{`${product?.productId || ''} ${product?.name || 'Product'}`}</h1>
                         <div className="flex items-center space-x-2 mt-2 mb-3">
                           {product?.reviewAvg != null && [...Array(5)].map((_, i) => (
                             <Star key={i} className={`h-4 w-4 ${i < Math.round(product.reviewAvg ?? 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
                           ))}
                           {product?.reviewCount != null && <a href="#reviews" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">{product.reviewCount} Reviews</a>}
                         </div>
                        <span className={`text-3xl font-bold text-gray-800 dark:text-gray-200 block ${montserrat.className}`}>${product?.price || '0.00'}</span>
                    </div>
                     
                     {product?.sizes && product.sizes.length > 0 && (
                        <div>
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Size:</h3>
                            <div className="flex flex-wrap gap-2">
                                {product.sizes.map((size: string) => (
                                    <button 
                                        key={size} 
                                        onClick={() => setSelectedSize(size)}
                                        className={`px-4 py-1.5 border rounded-md text-sm transition-colors ${selectedSize === size ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'} cursor-pointer`}
                                    >
                                       {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {product?.availableColors && product.availableColors.length > 0 && (
                        <div>
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Colours:</h3>
                            <div className="flex flex-wrap gap-3">
                                {product.availableColors.map((color: string) => (
                                    <button 
                                        key={color} 
                                        onClick={() => { setSelectedColor(color);}} 
                                        title={color}
                                        className={`h-8 w-8 rounded-full border-2 border-white dark:border-gray-800 shadow-sm ${selectedColor === color ? 'ring-2 ring-offset-2 dark:ring-offset-gray-900 ring-blue-500' : ''} transition transform hover:scale-110 focus:outline-none cursor-pointer`}
                                        style={{ backgroundColor: color }}
                                    >
                                       <span className="sr-only">{color}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                     
                     {product?.lensOptions && product.lensOptions.length > 0 && (
                        <div>
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Select Lenses:</h3>
                            <div className="grid grid-cols-3 gap-3">
                                {product.lensOptions.map((lens: { name: string; description?: string; icon?: string | React.ElementType; }) => {
                                    const LensIcon = typeof lens.icon === 'string' || !lens.icon ? null : lens.icon; 
                                    const lensIconSrc = typeof lens.icon === 'string' ? lens.icon : null;
                                    const isActive = selectedLens === lens.name;
                                    return (
                                    <button 
                                        key={lens.name} 
                                        onClick={() => setSelectedLens(lens.name)}
                                        className={`p-3 border rounded-lg text-center transition-colors flex flex-col items-center justify-center space-y-1 ${isActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'} cursor-pointer min-h-[70px]`}
                                    >
                                       {LensIcon ? <LensIcon className="h-6 w-6 mb-1 text-gray-600 dark:text-gray-400" /> : lensIconSrc ? <img src={lensIconSrc} alt={lens.name} className="h-8 w-12 object-contain mb-1" /> : null}
                                       <span className={`text-xs font-medium ${isActive? 'text-blue-700 dark:text-blue-200': 'text-gray-700 dark:text-gray-300'}`}>{lens.name}</span>
                                    </button>
                                )})}
                            </div>
                        </div>
                    )}
                     
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                        <label htmlFor="insurance-toggle" className="text-sm font-medium text-gray-900 dark:text-white">Use insurance benefits</label>
                        
                        <button 
                            id="insurance-toggle" 
                            onClick={() => setUseInsurance(!useInsurance)} 
                            className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${useInsurance ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'}`}
                            role="switch" 
                            aria-checked={useInsurance}
                         >
                            <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${useInsurance ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                    </div>
                     
                     <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
                        <div className="flex items-center space-x-2">
                           {product?.originalPrice && <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>}
                           <span className="text-xl font-bold text-green-600">${product.price}</span>
                           {product.originalPrice && <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">-50% OFF</span>} 
                        </div>
                     </div>
                     
                     
                     <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button className="w-full px-6 py-3 bg-gray-800 dark:bg-gray-200 hover:bg-gray-700 dark:hover:bg-gray-300 text-white dark:text-gray-900 font-semibold rounded-lg shadow transition-colors cursor-pointer">
                           Order Now
                        </button>
                        <button className="w-full px-6 py-3 border border-gray-800 dark:border-gray-200 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                           Add to cart
                        </button>
                     </div>
                </div>
            </div>
        </div>
     );
  };

    const cardsData = [
        {
            IconComponent: Eye,
            title: "Digital Life Style",
            description: "Enhance Your Digital Lifestyle with Precision Eyeglasses for Strain-Free Vision.",
            bgColorClass: "bg-emerald-50 dark:bg-emerald-900/50",
            iconColorClass: "text-emerald-600 dark:text-emerald-400",
            delay: 0.1,
        },
        {
            IconComponent: Gamepad,
            title: "Great Gamer",
            description: "Level up your gaming experience with glasses designed for the Great Gamer in you.",
            bgColorClass: "bg-blue-50 dark:bg-blue-900/50",
            iconColorClass: "text-blue-600 dark:text-blue-400",
            delay: 0.2,
        },
        {
            IconComponent: Heart,
            title: "Outdoor Lover",
            description: "Explore the Great Outdoors with Clarity and Comfort. Eyewear for the Outdoor Enthusiast.",
            bgColorClass: "bg-yellow-50 dark:bg-yellow-900/50",
            iconColorClass: "text-yellow-600 dark:text-yellow-400",
            delay: 0.3,
        },
        {
            IconComponent: Car,
            title: "Always Driving",
            description: "Navigate Every Journey: Eyewear Companion for the Always-Driving Enthusiast.",
            bgColorClass: "bg-pink-50 dark:bg-pink-900/50",
            iconColorClass: "text-pink-600 dark:text-pink-400",
            delay: 0.4,
        },
    ];

      const products = [
        { imgSrc: "https://m.media-amazon.com/images/I/61-0EpsPCGL._AC_SL1500_.jpg", alt: "Alex Perry Glasses", tag: "Best Sellers", colors: 3, brand: "AP2548", name: "Alex Perry", price: "187.99", delay: 0.1 },
        { imgSrc: "https://m.media-amazon.com/images/I/61kI5-36qaL._AC_SX679_.jpg", alt: "Persol Glasses", tag: "Top Pick", colors: 2, brand: "AP2549", name: "Persol", price: "214.99", delay: 0.2 },
        { imgSrc: "https://m.media-amazon.com/images/I/51E3DleHwiL._AC_SL1500_.jpg", alt: "Arnette Glasses", tag: "Flash Sale", colors: 4, brand: "AP2550", name: "Arnette", price: "199.99", delay: 0.3 },
      ];

  return (
      <div className={`min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 ${roboto.className}`}>
          <SiteHeader />
          <main className="flex-grow">
              <AnimatePresence mode="wait">
                  {currentView === "landing" ? (
                      <motion.div
                          key="landing"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                      >
                          <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                              <div className="flex flex-col lg:flex-row gap-12 items-center">
                                  <motion.div
                                      initial={{ opacity: 0, x: -50 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ duration: 0.5 }}
                                      className="space-y-6 lg:w-1/2 text-center lg:text-left"
                                  >
                                      <h1
                                          className={`text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight ${montserrat.className}`}
                                      >
                                          Find your perfect eyewear look
                                      </h1>
                                      <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto lg:mx-0">
                                          We're all about finding you that perfect pair. Experience the difference a perfect pair makes.
                                          Let's find yours together.
                                      </p>
                                      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center lg:justify-start">
                                          <button
                                              onClick={() => setCurrentView("browsing")}
                                              className="px-8 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-medium rounded-lg shadow hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors cursor-pointer"
                                          >
                                              Explore shop
                                          </button>
                                          <button className="px-8 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                                              Use Your Benefits
                                          </button>
                                      </div>
                                      <TrustpilotRating />
                                  </motion.div>

                                  <div className="flex flex-row space-x-4 lg:w-1/2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide">
                                      <ImageCard
                                          imgSrc="https://images.unsplash.com/photo-1642036048293-e0e2c3ff7599?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                          alt="Man wearing Hugo Boss glasses"
                                          brand="Hugo Boss"
                                          label="Discover"
                                          delay={0.2}
                                      />
                                      <ImageCard
                                          imgSrc="https://images.unsplash.com/photo-1628619487942-01c58eed5c33?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fG1lbiUyMHdlYXJpbmclMjBnbGFzc2VzfGVufDB8fDB8fHww"
                                          alt="Man wearing Alex Perry glasses"
                                          brand="Alex Perry"
                                          label="Discover"
                                          delay={0.4}
                                      />
                                      <ImageCard
                                          imgSrc="https://images.unsplash.com/photo-1630208232589-e42b29428b19?q=80&w=3169&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                          alt="Man wearing Michael Kors glasses"
                                          brand="Michael Kors"
                                          label="Discover"
                                          delay={0.6}
                                      />
                                  </div>
                              </div>
                          </section>
                          <section className="bg-gray-100 dark:bg-gray-900 py-16 md:py-24">
                              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                                  <div className="flex justify-between items-center mb-8 md:mb-12">
                                      <h2
                                          className={`text-3xl md:text-4xl font-bold text-gray-900 dark:text-white ${montserrat.className}`}
                                      >
                                          New Arrivals
                                      </h2>
                                      <button
                                          onClick={() => setCurrentView("browsing")}
                                          className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors cursor-pointer"
                                      >
                                          <span>View All</span>
                                          <ArrowRight className="ml-1 h-4 w-4" />
                                      </button>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                                      {products.map((product, index) => (
                                          <ProductCard key={`${product.brand}-${index}`} {...product} />
                                      ))}
                                  </div>
                              </div>
                          </section>

                          <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                              <div className="text-center mb-12">
                                  <h2
                                      className={`text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 ${montserrat.className}`}
                                  >
                                      Personalized eyecare for you.
                                  </h2>
                                  <p className="text-md text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                      Select one card to find the perfect style or lenses, according to your needs.
                                  </p>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                                  {cardsData.map((card, index) => (
                                      <PersonalizedCard key={index} {...card} />
                                  ))}
                              </div>
                          </section>
                          <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24 text-center">
                              <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 ${montserrat.className}`}>
                                  Unrivalled Excellence
                              </h2>
                              <p className="text-md text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                  Select one card to find the perfect style or lenses, according to your needs.
                              </p>
                          </section>
                          <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 md:pb-24">
                              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8 items-stretch">
                                  <div className="md:col-span-3">
                                      <FeatureCard
                                          bgColorClass="bg-blue-100 dark:bg-blue-900/50"
                                          title="Purchasing with insurance, made easy."
                                          description="This is our promise to you. We accept most vision insurance plans, both in and out-of-network."
                                          buttonText="Shop with insurance"
                                          imgSrc="https://assets2.oakley.com/cdn-record-files-pi/58d9e879-090c-4864-815b-a357009c3456/11e5b9a6-8fe1-45d2-b8ba-afc7016666e7/0OO4054__405401__P21__shad__qt.png"
                                          imgAlt="Stylish sunglasses"
                                          textColorClass="text-blue-900 dark:text-blue-100"
                                          imgPosition="bottom"
                                      />
                                  </div>
                                  <div className="md:col-span-2">
                                      <FeatureCard
                                          bgColorClass="bg-yellow-200 dark:bg-yellow-700/50"
                                          title="Shop Online, Thrive In-Store!"
                                          description="Online convenience meets in-store expertise for your ultimate eyewear experience!"
                                          imgSrc="https://t4.ftcdn.net/jpg/05/33/40/95/360_F_533409571_jqweTxLE0JRvfbKJvm9dTKwfkWDoEIEh.png"
                                          imgAlt="Hand holding glasses"
                                          textColorClass="text-yellow-900 dark:text-yellow-100"
                                          imgPosition="right"
                                      />
                                  </div>
                              </div>
                          </section>
                          <BestsellerSection />
                      </motion.div>
                  ) : currentView === "browsing" ? (
                      <motion.div
                          key="browsing"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                      >
                          <ProductBrowsingPageContent />
                      </motion.div>
                  ) : currentView === "detail" && selectedProduct ? (
                      <motion.div
                          key="detail"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                      >
                          <ProductDetailPageContent product={selectedProduct} />
                      </motion.div>
                  ) : null}
              </AnimatePresence>
          </main>
          <SiteFooter />
      </div>
  );
}
