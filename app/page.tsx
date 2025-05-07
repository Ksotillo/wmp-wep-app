"use client";

import { useState, useEffect } from "react";
import { FiSearch, FiShoppingCart, FiMenu, FiX, FiSun, FiMoon, FiPlay, FiArrowRight, FiChevronDown } from "react-icons/fi";
import { FaInstagram, FaYoutube, FaTwitter, FaFacebookF } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";



const translations = {
  EN: {
    
    "header.nav.home": "Home",
    "header.nav.newArrival": "New Arrival",
    "header.nav.shop": "Shop",
    "header.nav.deals": "Deals",
    "header.nav.contact": "Contact",
    "header.nav.aboutUs": "About Us",
    "header.signIn": "Sign In",
    
    "hero.title.line1": "Elevate Your Style With",
    "hero.title.line2": "Bold Fashion",
    "hero.exploreCollections": "Explore Collections",
    
    "testimonial.quote": "TrendZone's styles are fresh, bold, and exactly what I needed to upgrade my wardrobe. Loved the quality and vibe!",
    "testimonial.author": "- Rafi H.",
    
    "lifestyle.tag": "Lifestyle",
    "lifestyle.heading": "Set Up Your Fashion With The Latest Trends",
    
    "deals.title": "🔥 Hot Deals Just For You!",
    "deals.shopNow": "Shop Now",
    
    "newsletter.title": "Get Exclusive Style Updates!",
    "newsletter.description": "Be the first to know about new arrivals, flash sales, and insider style tips. Join the TrendZone family.",
    "newsletter.emailPlaceholder": "Enter your email address",
    "newsletter.subscribeButton": "Subscribe Now",
    "newsletter.privacyNote": "We respect your privacy. Unsubscribe at any time.",
    
    "footer.brandDescription": "Elevating your style with bold fashion choices and the latest trends. Quality and vibe, delivered.",
    "footer.quickLinks": "Quick Links",
    "footer.company": "Company",
    "footer.careers": "Careers",
    "footer.privacyPolicy": "Privacy Policy",
    "footer.termsOfService": "Terms of Service",
    "footer.stayConnected": "Stay Connected",
    "footer.stayConnectedDesc": "Don't miss out on the latest styles and offers.",
    "footer.subscribeNow": "Subscribe Now",
    "footer.copyright": "© {year} TrendZone. All rights reserved."
  },
  ES: {
    
    "header.nav.home": "Inicio",
    "header.nav.newArrival": "Novedades",
    "header.nav.shop": "Tienda",
    "header.nav.deals": "Ofertas",
    "header.nav.contact": "Contacto",
    "header.nav.aboutUs": "Sobre Nosotros",
    "header.signIn": "Iniciar Sesión",
    
    "hero.title.line1": "Eleva Tu Estilo Con",
    "hero.title.line2": "Moda Atrevida",
    "hero.exploreCollections": "Explorar Colecciones",
    
    "testimonial.quote": "¡Los estilos de TrendZone son frescos, atrevidos y justo lo que necesitaba para renovar mi guardarropa. Me encantó la calidad y la onda!",
    "testimonial.author": "- Rafi H.",
    
    "lifestyle.tag": "Estilo de Vida",
    "lifestyle.heading": "Define Tu Moda Con Las Últimas Tendencias",
    
    "deals.title": "🔥 ¡Ofertas Calientes Para Ti!",
    "deals.shopNow": "Comprar Ahora",
    
    "newsletter.title": "¡Recibe Actualizaciones Exclusivas de Estilo!",
    "newsletter.description": "Sé el primero en conocer las novedades, ventas flash y consejos de estilo. Únete a la familia TrendZone.",
    "newsletter.emailPlaceholder": "Ingresa tu correo electrónico",
    "newsletter.subscribeButton": "Suscribirse Ahora",
    "newsletter.privacyNote": "Respetamos tu privacidad. Cancela la suscripción en cualquier momento.",
    
    "footer.brandDescription": "Elevando tu estilo con elecciones de moda atrevidas y las últimas tendencias. Calidad y ambiente, entregados.",
    "footer.quickLinks": "Enlaces Rápidos",
    "footer.company": "Empresa",
    "footer.careers": "Carreras",
    "footer.privacyPolicy": "Política de Privacidad",
    "footer.termsOfService": "Términos de Servicio",
    "footer.stayConnected": "Mantente Conectado",
    "footer.stayConnectedDesc": "No te pierdas los últimos estilos y ofertas.",
    "footer.subscribeNow": "Suscribirse Ahora",
    "footer.copyright": "© {year} TrendZone. Todos los derechos reservados. Diseñado con <span class=\"text-red-500\">♥</span> por Ti y Tu Asistente IA."
  },
};

export default function TrendZoneLandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("EN"); 

  
  const headingFont = "'Montserrat', sans-serif";
  const bodyFont = "'Roboto', sans-serif";

  useEffect(() => {
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (mediaQuery.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    handleChange(); 
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const updateMobileMenuVisibility = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  
  const handlePlaceholderClick = (message) => {
    alert(message);
  };

  const navLinks = [
    { href: "#home", labelKey: "header.nav.home" },
    { href: "#new-arrival", labelKey: "header.nav.newArrival" },
    { href: "#shop", labelKey: "header.nav.shop" },
    { href: "#deals", labelKey: "header.nav.deals" },
    { href: "#contact", labelKey: "header.nav.contact" },
    { href: "#about-us", labelKey: "header.nav.aboutUs" },
  ];

  
  const t = (key) => {
    const langTranslations = translations[currentLanguage] || translations.EN;
    let text = langTranslations[key] || translations.EN[key] || key;
    if (key === "footer.copyright") {
      text = text.replace("{year}", new Date().getFullYear().toString());
    }
    return text;
  };

  
  const heroImages = [
    
    { id: 1, src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2124&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Model in orange outfit", className: "md:col-span-2 md:row-span-2 rounded-xl" },
    { id: 2, src: "https://images.unsplash.com/photo-1603189343302-e603f7add05a?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Model in green coat", className: "md:col-span-2 md:row-span-3 rounded-xl" },
    { id: 3, src: "https://images.unsplash.com/photo-1601762603339-fd61e28b698a?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Model in yellow hat and jacket", className: "md:col-span-2 md:row-span-2 rounded-xl" },
    { id: 4, src: "https://images.unsplash.com/photo-1495385794356-15371f348c31?q=80&w=3070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Model in orange outfit 2", className: "md:col-span-2 rounded-xl" }, 
    { id: 5, src: "https://images.unsplash.com/photo-1562151270-c7d22ceb586a?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Model in light blue outfit", className: "md:col-span-2 md:row-span-3 rounded-xl" },
    { id: 6, src: "https://images.unsplash.com/photo-1571513722275-4b41940f54b8?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Model in white t-shirt and heart glasses", className: "md:col-span-2 md:row-span-2 rounded-xl" },
    { id: 7, src: "https://images.unsplash.com/photo-1608748010899-18f300247112?q=80&w=3164&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Model in green suit", className: "md:col-span-2 rounded-xl" }, 
  ];

  const languageOptions = ["EN", "ES"]; 

  
  const featuredDeals = [
    {
      id: 1,
      name: "Chic Summer Dress",
      imageUrl: "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?q=80&w=800&auto=format&fit=crop",
      price: "$49.99",
      oldPrice: "$79.99",
      discount: "-38%",
      href: "#deal-1"
    },
    {
      id: 2,
      name: "Urban Street Hoodie",
      imageUrl: "https://images.unsplash.com/photo-1603189343302-e603f7add05a?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: "$65.00",
      href: "#deal-2"
    },
    {
      id: 3,
      name: "Classic Leather Jacket",
      imageUrl: "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?q=80&w=800&auto=format&fit=crop",
      price: "$120.00",
      oldPrice: "$150.00",
      discount: "-20%",
      href: "#deal-3"
    },
  ];

  
  const processNewsletterSubscriptionAttempt = (e) => {
    e.preventDefault();
    const emailInput = (e.target as HTMLFormElement).elements.namedItem("email") as HTMLInputElement;
    if (emailInput && emailInput.value) {
      console.log("Attempting newsletter signup for:", emailInput.value);
      handlePlaceholderClick(`Thanks for signing up, ${emailInput.value}! (Placeholder)`);
      emailInput.value = ''; 
    } else {
      handlePlaceholderClick("Please enter a valid email address.");
    }
  };

  return (
      <div className={`min-h-screen transition-colors duration-500 dark:bg-gray-900 text-white`} style={{ fontFamily: bodyFont }}>
          <style jsx global>{`
              @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&family=Roboto:wght@400;500;700&display=swap");
              h1,
              h2,
              h3,
              h4,
              h5,
              h6 {
                  font-family: ${headingFont};
                  font-weight: 700; /* Default bold for headings */
              }
              .font-montserrat-black {
                  font-family: ${headingFont};
                  font-weight: 900; /* Extra bold for specific titles */
              }
              .font-roboto {
                  font-family: ${bodyFont};
              }
          `}</style>

          
          <header className="sticky top-0 z-50 py-4 px-6 md:px-10 shadow-md backdrop-blur-lg bg-white/80 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700/50">
              <div className="container mx-auto flex justify-between items-center">
                  <h1
                      className="text-3xl font-montserrat-black text-gray-900 dark:text-white cursor-pointer"
                      onClick={() => (window.location.hash = "#home")}
                  >
                      TrendZone
                  </h1>

                  
                  <nav className="hidden md:flex space-x-8 items-center">
                      {navLinks.map((link) => (
                          <a
                              key={link.labelKey}
                              href={link.href}
                              onClick={(e) => { e.preventDefault(); handlePlaceholderClick(`Navigating to ${t(link.labelKey)}...`); }}
                              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300 cursor-pointer"
                              style={{ fontFamily: bodyFont }}
                          >
                              {t(link.labelKey)}
                          </a>
                      ))}
                  </nav>

                  
                  <div className="flex items-center space-x-3 sm:space-x-4">
                      <FiSearch className="h-5 w-5 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300 cursor-pointer" />
                      <FiShoppingCart className="h-5 w-5 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300 cursor-pointer" />

                      
                      <div className="relative hidden sm:block">
                          <select
                              value={currentLanguage}
                              onChange={(e) => setCurrentLanguage(e.target.value)}
                              className="text-xs bg-transparent text-gray-300 hover:text-purple-400 cursor-pointer appearance-none pr-5 focus:outline-none rounded-md py-1 pl-2 border border-transparent hover:border-gray-600 transition-colors duration-300"
                              style={{ fontFamily: bodyFont }}
                          >
                              {languageOptions.map((lang) => (
                                  <option key={lang} value={lang} className="bg-gray-700 text-white">
                                      {lang}
                                  </option>
                              ))}
                          </select>
                          <FiChevronDown className="absolute right-0 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-500 pointer-events-none" />
                      </div>

                      <button 
                        onClick={() => handlePlaceholderClick('Performing Sign In...')}
                        className="text-sm font-medium bg-gray-800 dark:bg-white text-white dark:text-gray-800 px-4 py-2 rounded-full hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors duration-300 cursor-pointer whitespace-nowrap"
                      >
                        {t('header.signIn')}
                      </button>

                      
                      <div className="md:hidden">
                          <button
                              onClick={updateMobileMenuVisibility}
                              className="text-gray-600 dark:text-gray-300 focus:outline-none p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors duration-300 cursor-pointer "
                              title="Toggle menu"
                          >
                              {isMobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
                          </button>
                      </div>
                  </div>
              </div>

              
              <AnimatePresence>
                  {isMobileMenuOpen && (
                      <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="md:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-gray-800/95 shadow-xl border-t border-gray-200 dark:border-gray-700/50 overflow-hidden"
                      >
                          <nav className="flex flex-col py-3">
                              {navLinks.map((link) => (
                                  <a
                                      key={link.labelKey}
                                      href={link.href}
                                      onClick={(e) => { 
                                        e.preventDefault(); 
                                        handlePlaceholderClick(`Navigating to ${t(link.labelKey)}...`);
                                        updateMobileMenuVisibility();
                                      }}
                                      className="block py-2.5 px-6 text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-300 transition-colors duration-200 cursor-pointer"
                                      style={{ fontFamily: bodyFont }}
                                  >
                                      {t(link.labelKey)}
                                  </a>
                              ))}
                              
                              <div className="px-6 pt-3 mt-2 border-t border-gray-200 dark:border-gray-700/50">
                                  <select
                                      value={currentLanguage}
                                      onChange={(e) => {
                                          setCurrentLanguage(e.target.value);
                                          updateMobileMenuVisibility();
                                      }}
                                      className="w-full text-sm bg-gray-700 text-gray-200 p-2 rounded-md mb-3 cursor-pointer focus:outline-none focus:ring-1 focus:ring-purple-500"
                                      style={{ fontFamily: bodyFont }}
                                  >
                                      {languageOptions.map((lang) => (
                                          <option key={lang} value={lang}>
                                              {lang}
                                          </option>
                                      ))}
                                  </select>
                                  
                              </div>
                          </nav>
                      </motion.div>
                  )}
              </AnimatePresence>
          </header>
          

          <main className="container mx-auto px-6 md:px-10 py-8">
              
              <section id="home" className="text-center py-10 md:py-20">
                  <div className="flex flex-col md:flex-row items-center justify-center mb-6 md:mb-10">
                    
                    <motion.img
                      src="https://plus.unsplash.com/premium_photo-1708110921381-5da0d7eb2e0f?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt="Fashion promo visual"
                      className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover mr-0 md:mr-3 lg:mr-4 cursor-pointer shadow-md hover:shadow-lg dark:shadow-gray-700/50 hidden md:block"
                      whileHover={{ scale: 1.08, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 10 }}
                      onClick={() => console.log("Promo image clicked!")}
                    />
                    <motion.h2 
                      className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-montserrat-black leading-tight max-w-3xl text-gray-900 dark:text-white"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                       {t('hero.title.line1')} <span className="block">{t('hero.title.line2')}</span>
                    </motion.h2>
                    
                    <div className="ml-0 md:ml-4 mt-4 md:mt-0 flex -space-x-2 items-center hidden md:flex">
                      <img className="inline-block h-8 w-8 rounded-full ring-2 ring-gray-300 dark:ring-gray-700 cursor-pointer transform hover:scale-110 transition-transform duration-150" src="https://randomuser.me/api/portraits/women/79.jpg" alt="User 1"/>
                      <img className="inline-block h-8 w-8 rounded-full ring-2 ring-gray-300 dark:ring-gray-700 cursor-pointer transform hover:scale-110 transition-transform duration-150" src="https://randomuser.me/api/portraits/men/32.jpg" alt="User 2"/>
                      <img className="inline-block h-8 w-8 rounded-full ring-2 ring-gray-300 dark:ring-gray-700 cursor-pointer transform hover:scale-110 transition-transform duration-150" src="https://randomuser.me/api/portraits/women/50.jpg" alt="User 3"/>
                      <a className="flex items-center justify-center h-8 w-8 min-w-[2rem] rounded-full bg-purple-500 text-white text-base leading-8 font-medium ring-2 ring-gray-300 dark:ring-gray-700 cursor-pointer hover:bg-purple-600 transition-colors transform hover:scale-110 focus:outline-none z-10 duration-150">
                        +
                      </a>
                    </div>
                  </div>

                  
                   <motion.div 
                    className="hidden md:grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 md:grid-rows-3 gap-3 md:gap-4 mt-10 md:mt-16 h-[700px] md:h-[650px] lg:h-[750px]"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: {},
                      visible: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } },
                    }}
                  >
                      
                      {heroImages.slice(0, 7).map((img, index) => {
                          let gridPositionClasses = "";
                          let imageContentClasses = "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105";

                          
                          if (index === 0) {
                              
                              gridPositionClasses = "col-span-2 sm:col-span-2 md:col-span-2 md:row-span-2";
                          } else if (index === 1) {
                              
                              gridPositionClasses = "col-span-2 sm:col-span-2 md:col-span-2 md:row-span-1";
                          } else if (index === 2) {
                              
                              gridPositionClasses = "col-span-2 sm:col-span-2 md:col-span-2 md:row-span-3";
                          } else if (index === 3) {
                              
                              gridPositionClasses = "col-span-2 sm:col-span-2 md:col-span-2 md:row-span-2 self-start"; 
                          } else if (index === 4) {
                              
                              gridPositionClasses = "col-span-2 sm:col-span-2 md:col-span-2 md:row-span-3";
                          } else if (index === 5) {
                              
                              gridPositionClasses = "col-span-2 sm:col-span-2 md:col-span-2 md:row-span-2";
                          } else if (index === 6) {
                              
                              gridPositionClasses = "col-span-2 sm:col-span-2 md:col-span-2 md:row-span-1";
                          }

                          
                          
                          
                          if (typeof window !== "undefined" && window.innerWidth < 640) {
                              
                              gridPositionClasses = "col-span-2 row-span-1"; 
                              if (index === 3)
                                  imageContentClasses += " h-48"; 
                              else imageContentClasses += " h-64";
                          }

                          return (
                              <motion.div
                                  key={img.id}
                                  className={`relative overflow-hidden rounded-xl shadow-lg dark:shadow-[0_10px_15px_-3px_rgba(128,0,128,0.2),_0_4px_6px_-4px_rgba(128,0,128,0.2)] group cursor-pointer ${gridPositionClasses}`}
                                  variants={{ hidden: { opacity: 0, y: 25 }, visible: { opacity: 1, y: 0 } }}
                                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                              >
                                  <img src={img.src} alt={img.alt} className={imageContentClasses} />
                                  
                                  {index === 3 && (
                                      <button 
                                        onClick={() => handlePlaceholderClick('Exploring Collections...')}
                                        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-black text-white px-5 py-2.5 md:px-6 md:py-3 rounded-full text-xs sm:text-sm font-semibold hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors flex items-center space-x-1.5 md:space-x-2 cursor-pointer shadow-xl whitespace-nowrap z-10">
                                          <span>{t('hero.exploreCollections')}</span>
                                          <FiArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                      </button>
                                  )}
                              </motion.div>
                          );
                      })}
                  </motion.div>

                  
                  <div className="md:hidden mt-10 space-y-6 flex flex-col items-center">
                      {heroImages.slice(0, 2).map((img, index) => (
                          <motion.div
                              key={`mobile-${img.id}`}
                              className="w-full max-w-xs h-72 rounded-xl shadow-xl overflow-hidden group cursor-pointer"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 100}}
                              whileHover={{ scale: 1.03 }}
                          >
                              <img 
                                  src={img.src} 
                                  alt={img.alt} 
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                          </motion.div>
                      ))}
                      <motion.button 
                          onClick={() => handlePlaceholderClick('Exploring Collections...')}
                          className="mt-6 bg-gray-900 dark:bg-black text-white px-8 py-3.5 rounded-full text-sm sm:text-base font-semibold hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors flex items-center space-x-2 cursor-pointer shadow-xl whitespace-nowrap z-10"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5, type: "spring"}}
                      >
                          <span>{t('hero.exploreCollections')}</span>
                          <FiArrowRight className="w-4 h-4" />
                      </motion.button>
                  </div>
              </section>
              

              
              <section className="py-10 md:py-16 container mx-auto px-6 md:px-10">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 md:gap-16">
                      
                      <motion.div
                          className="w-full md:w-1/2 lg:w-2/5 flex flex-col sm:flex-row items-center text-center sm:text-left"
                          initial={{ opacity: 0, x: -50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                      >
                          <span className="text-6xl md:text-8xl text-purple-400 dark:text-purple-600 font-serif mr-0 sm:mr-4 mb-2 sm:mb-0 select-none self-start sm:self-center">
                              "
                          </span>
                          <div className="mt-2 sm:mt-0">
                              <p className="text-lg md:text-xl italic text-gray-700 dark:text-gray-300 leading-relaxed">
                                  {t("testimonial.quote")}
                              </p>
                              <p className="mt-4 text-md font-semibold text-gray-800 dark:text-white text-right">
                                  {t("testimonial.author")}
                              </p>
                          </div>
                      </motion.div>

                      
                      <motion.div
                          className="w-full md:w-1/2 lg:w-2/5 text-center md:text-right mt-8 md:mt-0"
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: 0.3 }}
                      >
                          <div className="flex items-center justify-center md:justify-end mb-1">
                              <span className="text-5xl md:text-6xl font-bold text-gray-800 dark:text-white mr-2">01</span>
                              <span className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                  {t("lifestyle.tag")}
                              </span>
                          </div>
                          <h3 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white mb-3 max-w-xs mx-auto md:mx-0 md:ml-auto">
                              {t("lifestyle.heading")}
                          </h3>
                          <a
                              href="#shop"
                              className="inline-block p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-purple-500 dark:hover:bg-purple-600 text-gray-700 dark:text-gray-200 hover:text-white transition-all duration-300 cursor-pointer transform hover:scale-110"
                          >
                              <FiArrowRight className="w-6 h-6" />
                          </a>
                      </motion.div>
                  </div>
              </section>
              

              
              <section id="deals" className="py-16 md:py-20 ">
                  <div className="container mx-auto px-6 md:px-10">
                      <motion.h2
                          className="text-3xl md:text-4xl font-montserrat-black text-center mb-12 md:mb-16 text-black dark:text-white"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                      >
                          🔥 Hot Deals Just For You!
                      </motion.h2>
                      <motion.div
                          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
                          initial="hidden"
                          animate="visible"
                          variants={{
                              hidden: {},
                              visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
                          }}
                      >
                          {featuredDeals.map((deal) => (
                              <motion.div
                                  key={deal.id}
                                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-xl hover:shadow-purple-500/30 transition-shadow duration-300 flex flex-col group cursor-pointer"
                                  variants={{
                                      hidden: { opacity: 0, y: 30 },
                                      visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
                                  }}
                                  whileHover={{ y: -8 }}
                              >
                                  <div className="relative w-full aspect-[3/4] overflow-hidden">
                                      <img
                                          src={deal.imageUrl}
                                          alt={deal.name}
                                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                      />
                                      {deal.discount && (
                                          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                                              {deal.discount}
                                          </span>
                                      )}
                                  </div>
                                  <div className="p-5 flex flex-col flex-grow">
                                      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white truncate group-hover:text-purple-400 dark:group-hover:text-purple-300 transition-colors">
                                          {deal.name}
                                      </h3>
                                      <div className="flex items-baseline gap-2 mb-3">
                                          <p className="text-xl font-bold text-purple-600 dark:text-purple-400">{deal.price}</p>
                                          {deal.oldPrice && (
                                              <p className="text-sm text-gray-600 dark:text-gray-500 line-through">{deal.oldPrice}</p>
                                          )}
                                      </div>
                                      <a
                                          href={deal.href}
                                          onClick={(e) => { e.preventDefault(); handlePlaceholderClick(`Shopping for ${deal.name}...`); }}
                                          className="mt-auto w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 px-4 rounded-lg text-center transition-colors duration-300 cursor-pointer opacity-90 group-hover:opacity-100 transform group-hover:scale-105"
                                      >
                                          {t("deals.shopNow")}
                                      </a>
                                  </div>
                              </motion.div>
                          ))}
                      </motion.div>
                  </div>
              </section>
              

              
              <section id="newsletter" className="py-16 md:py-20 bg-gray-100 dark:bg-gray-800">
                  <div className="container mx-auto px-6 md:px-10 max-w-3xl text-center">
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                          <h2 className="text-3xl md:text-4xl font-montserrat-black mb-4 text-gray-900 dark:text-white">
                              {t("newsletter.title")}
                          </h2>
                          <p className="text-md md:text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto">
                              {t("newsletter.description")}
                          </p>
                          <form 
                            onSubmit={processNewsletterSubscriptionAttempt} 
                            className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 max-w-lg mx-auto"
                          >
                              <input 
                                type="email" 
                                name="email"
                                placeholder={t("newsletter.emailPlaceholder")}
                                required
                                className="flex-grow w-full sm:w-auto text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800/50 rounded-lg px-4 py-3 text-sm outline-none transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg"
                              />
                              <button
                                  type="submit"
                                  className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 cursor-pointer shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-300 transform hover:scale-105"
                              >
                                  {t("newsletter.subscribeButton")}
                              </button>
                          </form>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-6">{t("newsletter.privacyNote")}</p>
                      </motion.div>
                  </div>
              </section>
              
          </main>

          
          <motion.footer
              className="py-12 md:py-16 border-t border-gray-200 dark:border-gray-700/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
          >
              <div className="container mx-auto px-6 md:px-10">
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
                      
                      <div className="md:col-span-3 lg:col-span-1">
                          <h3 className="text-2xl font-montserrat-black text-gray-900 dark:text-white mb-3">
                              TrendZone
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                              {t('footer.brandDescription')}
                          </p>
                          <div className="flex space-x-4">
                              <a
                                  href="#facebook"
                                  className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer"
                                  aria-label="Facebook"
                              >
                                  <FaFacebookF className="h-5 w-5" />
                              </a>
                              <a
                                  href="#twitter"
                                  className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer"
                                  aria-label="Twitter"
                              >
                                  <FaTwitter className="h-5 w-5" />
                              </a>
                              <a
                                  href="#instagram"
                                  className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer"
                                  aria-label="Instagram"
                              >
                                  <FaInstagram className="h-5 w-5" />
                              </a>
                              <a
                                  href="#youtube"
                                  className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer"
                                  aria-label="YouTube"
                              >
                                  <FaYoutube className="h-5 w-5" />
                              </a>
                          </div>
                      </div>

                      
                      <div>
                          <h4 className="font-semibold text-gray-700 dark:text-gray-100 mb-4 text-sm uppercase tracking-wider">
                              {t('footer.quickLinks')}
                          </h4>
                          <ul className="space-y-2.5 text-sm">
                              <li>
                                  <a
                                      href="#home"
                                      className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors cursor-pointer"
                                  >
                                      {t('header.nav.home')}
                                  </a>
                              </li>
                              <li>
                                  <a
                                      href="#new-arrival"
                                      className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors cursor-pointer"
                                  >
                                      {t('header.nav.newArrival')}
                                  </a>
                              </li>
                              <li>
                                  <a
                                      href="#deals"
                                      className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors cursor-pointer"
                                  >
                                      {t('header.nav.deals')}
                                  </a>
                              </li>
                              <li>
                                  <a
                                      href="#shop"
                                      className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors cursor-pointer"
                                  >
                                      {t('header.nav.shop')}
                                  </a>
                              </li>
                          </ul>
                      </div>

                      
                      <div>
                          <h4 className="font-semibold text-gray-700 dark:text-gray-100 mb-4 text-sm uppercase tracking-wider">
                              {t('footer.company')}
                          </h4>
                          <ul className="space-y-2.5 text-sm">
                              <li>
                                  <a
                                      href="#about-us"
                                      className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors cursor-pointer"
                                  >
                                      {t('header.nav.aboutUs')}
                                  </a>
                              </li>
                              <li>
                                  <a
                                      href="#contact"
                                      className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors cursor-pointer"
                                  >
                                      {t('header.nav.contact')}
                                  </a>
                              </li>
                              <li>
                                  <a
                                      href="#careers"
                                      className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors cursor-pointer"
                                  >
                                      {t('footer.careers')}
                                  </a>
                              </li>
                              <li>
                                  <a
                                      href="#privacy"
                                      className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors cursor-pointer"
                                  >
                                      {t('footer.privacyPolicy')}
                                  </a>
                              </li>
                              <li>
                                  <a
                                      href="#terms"
                                      className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors cursor-pointer"
                                  >
                                      {t('footer.termsOfService')}
                                  </a>
                              </li>
                          </ul>
                      </div>

                      
                      <div className="hidden lg:block"> 
                          <h4 className="font-semibold text-gray-700 dark:text-gray-100 mb-4 text-sm uppercase tracking-wider">
                              {t('footer.stayConnected')}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                              {t('footer.stayConnectedDesc')}
                          </p>
                          <a
                              href="#newsletter"
                              className="inline-block bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors duration-300 cursor-pointer"
                          >
                              {t('footer.subscribeNow')}
                          </a>
                      </div>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-8 text-center md:text-left">
                      <p 
                        className="text-xs text-gray-500 dark:text-gray-400"
                        dangerouslySetInnerHTML={{ __html: t('footer.copyright') }}
                      />
                  </div>
              </div>
          </motion.footer>
          
      </div>
  );
}
