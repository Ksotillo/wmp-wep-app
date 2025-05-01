'use client'
import React, { useState } from 'react';
import { LayoutGrid, Check, Sparkles, MoveRight, HelpCircle, Twitter, Github, Linkedin, Send } from 'lucide-react'; 
import { motion } from 'framer-motion';

type PricingCardProps = {
  planName: string;
  price: string | null; 
  billingInfo: string;
  features: string[];
  buttonText: string;
  isFeatured?: boolean; 
  isCustom?: boolean; 
  isYearly: boolean;
};


const PricingCard = ({ planName, price, billingInfo, features, buttonText, isFeatured = false, isCustom = false, isYearly }: PricingCardProps) => {
  const yearlyDiscount = 0.30;
  const monthlyPrice = isFeatured && price ? parseFloat(price) / (1 - yearlyDiscount) : null;
  const displayPrice = isYearly ? price : monthlyPrice?.toFixed(2);
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={cardVariants}
      className={`rounded-xl p-6 md:p-8 shadow-lg flex flex-col ${isFeatured ? 'bg-gradient-to-br from-purple-600 to-indigo-700 text-white' : 'bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-200'} h-full`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-xl font-semibold font-montserrat ${isFeatured ? 'text-white' : 'text-gray-800 dark:text-white'}`}>{planName}</h3>
        {isFeatured && isYearly && (
          <span className="bg-white text-purple-700 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
            <span>🔥</span>
            <span>Save 30% OFF</span>
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 flex-grow mb-8">
        <div className="flex flex-col">
          <p className={`mb-6 text-sm ${isFeatured ? 'text-purple-100' : 'text-gray-600 dark:text-gray-400'}`}>
            Access a complete payments platform with simple.
          </p>
          <div className="mt-auto">
            {isCustom ? (
              <p className="text-4xl font-bold font-montserrat mb-2">Let's Talk</p>
            ) : (
              <p className="text-4xl font-bold font-montserrat mb-2">
                ${displayPrice}
              </p>
            )}
            <p className={`text-sm ${isFeatured ? 'text-purple-200' : 'text-gray-500 dark:text-gray-400'}`}>{billingInfo}</p>
          </div>
        </div>
        <div>
          <ul className="space-y-3">
            {features.map((feature: string, index: number) => (
              <li key={index} className="flex items-center space-x-3">
                <Check className={`w-5 h-5 ${isFeatured ? 'text-green-400' : 'text-green-500'}`} />
                <span className={`text-sm ${isFeatured ? 'text-purple-50' : 'text-gray-700 dark:text-gray-300'}`}>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <button className={`cursor-pointer w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${isFeatured ? 'bg-white text-purple-700 hover:bg-gray-100' : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white dark:from-purple-600 dark:to-indigo-700 dark:hover:from-purple-700 dark:hover:to-indigo-800 shadow-md'}`}>
        {buttonText}
      </button>
    </motion.div>
  );
};


const PricingSection = () => {
  const [isYearly, setIsYearly] = useState(true);
  const toggleBilling = () => setIsYearly(!isYearly);
  const standardFeatures = [
    'Unlimited users',
    'Unlimited platform access',
    'Unlimited revision & request',
    'Pause & Cancel anytime'
  ];

  const customFeatures = [
    'Unlimited users',
    'Unlimited platform access',
    'Priority support',
    'Advanced analytics'
  ];

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const cardContainerVariants = {
    hidden: { opacity: 1 }, 
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2 
      }
    }
  };

  return (
    <motion.section 
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto flex flex-col items-center">
      <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 bg-white dark:bg-neutral-800 text-purple-700 dark:text-gray-300 px-3 py-1 rounded-lg text-sm font-medium mb-4 border border-purple-500 dark:border-neutral-700 shadow-sm">
        <Sparkles className="w-4 h-4 text-purple-700 dark:text-gray-300" />
        <span>Pricing Plan</span>
      </motion.div>
      <motion.h1 variants={itemVariants} className="text-center text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white font-montserrat mb-4">Simple, Flexible Pricing</motion.h1>
      <motion.p variants={itemVariants} className="text-center text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
        See our pricing data and select your best service from our side. We always appreciate your subscription and we are dedicate to give our best efforts
      </motion.p>
      <motion.div variants={itemVariants} className="flex flex-col items-center mb-12">
        <div className="flex items-center justify-center space-x-4">
            <span className={`text-sm font-medium ${!isYearly ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>Monthly</span>
            <button
              onClick={toggleBilling}
              className={`cursor-pointer relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 ${isYearly ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}
            >
              <motion.span
                layout
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${isYearly ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
            <span className={`text-sm font-medium ${isYearly ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>Yearly</span>
        </div>
        {isYearly && (
            <span className="mt-2 text-sm font-medium text-purple-600 dark:text-purple-400">
              Save 30% OFF
            </span>
        )}
      </motion.div>
      <motion.div
        variants={cardContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }} 
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-5xl">
          <PricingCard
            planName="Standard"
            price="15.99"
            billingInfo={isYearly ? "Per user / billed yearly" : "Per user / billed monthly"}
            features={standardFeatures}
            buttonText="Get Started"
            isFeatured={true}
            isYearly={isYearly}
          />
          <PricingCard
            planName="Custom"
            price={null} 
            billingInfo="Contact us for details"
            features={customFeatures}
            buttonText="Contact Sales"
            isCustom={true}
            isYearly={isYearly} 
          />
      </motion.div>
    </motion.section>
  );
}


const FAQItem = ({ question, answer, isLastRowItem }: { question: string; answer: string; isLastRowItem: boolean }) => {
  const faqItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      variants={faqItemVariants}
      className={`pb-8 ${!isLastRowItem ? 'border-b border-gray-200 dark:border-neutral-700' : ''}`}>
        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2 font-montserrat">{question}</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 font-roboto">{answer}</p>
    </motion.div>
  );
};


const FAQSection = () => {
  const faqData = [
    {
      question: "Do I have to pay for each agent account?",
      answer: "Yes, we charge a fee for every agent account created, regardless of whether the agent is logged in or not. It is a long established fact that a reader is distracted by the readable content page when looking."
    },
    {
      question: "What payment methods are accepted?",
      answer: "We currently accept all major credit cards (Visa, Mastercard, American Express) via our secure payment processor. We plan to add more options like PayPal soon."
    },
    {
      question: "Do you provide customer service agents?",
      answer: "It is a long established fact that a reader is distracted by the readable content page when looking at its layout. The point of using Lorem Ipsum. No, we provide the tools for your agents."
    },
    {
        question: "Is there a free trial available?",
        answer: "Yes, we offer a 14-day free trial for our Standard plan, giving you full access to its features. No credit card is required to start your trial."
    },
    {
      question: "Do you offer an annual payment option?",
      answer: "A long established fact that a reader will be distracted by the readable content of a page when looking at its layout point of using is that it has distribution of letters."
    },
    {
        question: "Can I change my plan later?",
        answer: "Absolutely! You can easily upgrade, downgrade, or switch between monthly and yearly billing directly from your account dashboard at any time."
    }
  ];
  const totalItems = faqData.length;

  
  const introVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  
  const gridVariants = {
    hidden: { opacity: 1 }, 
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }} 
      className="max-w-7xl mx-auto mt-20 md:mt-28 px-4 sm:px-6 lg:px-8">
      <motion.div variants={introVariants} className="flex justify-center mb-4">
        <div className="inline-flex items-center space-x-2 bg-white dark:bg-neutral-800 text-purple-700 dark:text-gray-300 px-3 py-1 rounded-lg text-sm font-medium border border-purple-500 dark:border-neutral-700 shadow-sm">
            <HelpCircle className="w-4 h-4 text-purple-700 dark:text-gray-300" />
            <span>FAQ'S</span>
        </div>
      </motion.div>
      <motion.h2 variants={introVariants} transition={{ delay: 0.1 }} className="text-center text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white font-montserrat mb-12 md:mb-16">
        Common questions & answers
      </motion.h2>
      <motion.div 
        variants={gridVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {faqData.map((item, index) => {
            const isLastRowItem = index >= totalItems - 2; 
            return (
              <FAQItem 
                key={index} 
                question={item.question} 
                answer={item.answer} 
                isLastRowItem={isLastRowItem} 
              />
            );
          })}
      </motion.div>
    </motion.section>
  );
};



const PricingPage = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-indigo-100 dark:from-gray-900 dark:via-neutral-900 dark:to-black text-gray-900 dark:text-gray-200 font-roboto flex flex-col">
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300/90 dark:bg-purple-900 rounded-full filter blur-[150px] opacity-50 dark:opacity-30 -translate-x-1/4 -translate-y-1/4 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-300/90 dark:bg-indigo-900 rounded-full filter blur-[120px] opacity-50 dark:opacity-30 translate-x-1/4 translate-y-1/4 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-300/80 dark:bg-blue-800/70 rounded-full filter blur-[80px] opacity-60 dark:opacity-40 translate-x-1/4 -translate-y-1/4 pointer-events-none"></div>

      <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="sticky top-4 z-50 w-full px-4 sm:px-6 lg:px-8 flex justify-center"
      >
          <div className="w-full max-w-7xl rounded-lg px-6 py-3 shadow-lg border border-white/20 dark:border-white/10 bg-white/20 dark:bg-black/50 backdrop-blur-lg">
              <nav className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                      <LayoutGrid className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                      <span className="text-xl font-semibold text-gray-800 dark:text-gray-100 font-montserrat">Scheduler</span>
                  </div>
                  <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
                      <a
                          href="#"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                          Home
                      </a>
                      <a
                          href="#"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                          Features
                      </a>
                      <a
                          href="#"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                          Product
                      </a>
                      <a
                          href="#"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                          Pricing
                      </a>
                      <a
                          href="#"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                          Contact Us
                      </a>
                  </div>
                  <div className="flex items-center space-x-3">
                      <button className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors px-4 py-2 rounded-lg">
                          Log In
                      </button>
                      <button className="cursor-pointer text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 dark:from-purple-600 dark:to-indigo-700 dark:hover:from-purple-700 dark:hover:to-indigo-800 px-4 py-2 rounded-lg shadow-md transition-all">
                          Sign Up
                      </button>
                  </div>
              </nav>
          </div>
      </motion.header>

      <div className="relative z-0 flex-grow">
          <main className="pt-28 sm:pt-32 pb-24 px-4 sm:px-6 lg:px-8">
              <PricingSection />
              <FAQSection />
          </main>
      </div>

      <motion.footer
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6 }}
          className="bg-white/50 dark:bg-black/30 border-t border-gray-200 dark:border-neutral-800 mt-24 py-12"
      >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-8">
                  <div className="lg:col-span-2">
                      <div className="flex items-center space-x-2 mb-4">
                          <LayoutGrid className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                          <span className="text-xl font-semibold text-gray-800 dark:text-gray-100 font-montserrat">Scheduler</span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-xs">
                          Making scheduling simple and efficient for everyone.
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">&copy; {currentYear} Scheduler. All rights reserved.</p>
                  </div>
                  <div>
                      <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-200 tracking-wider uppercase mb-4 font-montserrat">
                          Product
                      </h5>
                      <ul className="space-y-3">
                          <li>
                              <a
                                  href="#"
                                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
                              >
                                  Features
                              </a>
                          </li>
                          <li>
                              <a
                                  href="#"
                                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
                              >
                                  Pricing
                              </a>
                          </li>
                          <li>
                              <a
                                  href="#"
                                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
                              >
                                  Integrations
                              </a>
                          </li>
                          <li>
                              <a
                                  href="#"
                                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
                              >
                                  Updates
                              </a>
                          </li>
                      </ul>
                  </div>
                  <div>
                      <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-200 tracking-wider uppercase mb-4 font-montserrat">
                          Company
                      </h5>
                      <ul className="space-y-3">
                          <li>
                              <a
                                  href="#"
                                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
                              >
                                  About Us
                              </a>
                          </li>
                          <li>
                              <a
                                  href="#"
                                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
                              >
                                  Careers
                              </a>
                          </li>
                          <li>
                              <a
                                  href="#"
                                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
                              >
                                  Blog
                              </a>
                          </li>
                          <li>
                              <a
                                  href="#"
                                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
                              >
                                  Contact
                              </a>
                          </li>
                      </ul>
                  </div>
                  <div className="lg:col-span-2">
                      <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-200 tracking-wider uppercase mb-4 font-montserrat">
                          Subscribe
                      </h5>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                          Get the latest news and updates directly in your inbox.
                      </p>
                      <form className="flex flex-col sm:flex-row gap-2">
                          <input
                              type="email"
                              placeholder="Enter your email"
                              required
                              className="flex-grow px-3 py-2 rounded-md text-sm bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600"
                          />
                          <button
                              type="submit"
                              className="cursor-pointer inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 dark:from-purple-600 dark:to-indigo-700 dark:hover:from-purple-700 dark:hover:to-indigo-800 shadow-sm transition-all whitespace-nowrap"
                          >
                              <Send className="w-4 h-4 mr-2" />
                              Subscribe
                          </button>
                      </form>
                  </div>
              </div>
              <div className="mt-10 pt-8 border-t border-gray-200 dark:border-neutral-800 flex flex-col sm:flex-row justify-between items-center">
                  <div className="flex space-x-5">
                      <a
                          href="https://twitter.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      >
                          <span className="sr-only">Twitter</span>
                          <Twitter size={20} />
                      </a>
                      <a
                          href="https://github.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      >
                          <span className="sr-only">GitHub</span>
                          <Github size={20} />
                      </a>
                      <a
                          href="https://linkedin.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      >
                          <span className="sr-only">LinkedIn</span>
                          <Linkedin size={20} />
                      </a>
                  </div>
              </div>
          </div>
      </motion.footer>
    </div>
  );
};

export default PricingPage;
