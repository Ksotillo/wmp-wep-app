'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Playfair_Display, Inter } from 'next/font/google';
import { Search, ArrowRight, Menu, ArrowLeft, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';


const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair-display',
});
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});
const fontClasses = `${playfairDisplay.variable} ${inter.variable}`;
const SearchOverlay = (
  { isOpen, query, results, updateSearchQuery, requestPanelClosure, selectArticleResult }
) => {
  
  const chooseResult = (slug) => {
    selectArticleResult(slug);
    requestPanelClosure(); 
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex justify-center items-start pt-20 md:pt-32 px-4"
          onClick={requestPanelClosure} 
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white dark:bg-stone-800 rounded-lg shadow-xl w-full max-w-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()} 
          >
            
            <div className="p-4 border-b border-stone-200 dark:border-stone-700 flex items-center">
              <Search size={20} className="text-stone-500 dark:text-stone-400 mr-3 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search articles..."
                value={query}
                onChange={updateSearchQuery}
                className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-stone-800 dark:text-stone-200 placeholder-stone-500 dark:placeholder-stone-400 text-lg"
                autoFocus 
              />
              <button
                 onClick={requestPanelClosure}
                 className="ml-3 p-1 rounded-full text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700 cursor-pointer"
              >
                 <X size={20} />
              </button>
            </div>

            
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {query && results.length === 0 && (
                <p className="text-center text-stone-500 dark:text-stone-400 py-4">No results found for "{query}".</p>
              )}
              {results.length > 0 && (
                <ul className="space-y-2">
                  {results.map((article) => (
                    <li key={article.slug}>
                      <button
                        onClick={() => chooseResult(article.slug)}
                        onKeyDown={(e) => e.key === 'Enter' && chooseResult(article.slug)}
                        tabIndex={0}
                        className="w-full text-left flex items-center p-3 rounded-md hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors cursor-pointer group"
                      >
                        <img src={article.image} alt="" className="w-12 h-12 object-cover rounded mr-3 flex-shrink-0"/>
                        <div className="flex-grow overflow-hidden">
                           <p className="text-sm text-stone-500 dark:text-stone-400 truncate">{article.category}</p>
                           <p className="font-medium text-stone-800 dark:text-stone-200 truncate group-hover:text-clip">{article.title}</p>
                        </div>
                        <ArrowRight size={16} className="ml-3 text-stone-400 dark:text-stone-500 flex-shrink-0 group-hover:text-stone-600 dark:group-hover:text-stone-300"/>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {!query && (
                 <p className="text-center text-stone-500 dark:text-stone-400 py-4">Start typing to search articles.</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


const imageUrls = [
  'https://images.unsplash.com/photo-1581182800629-7d90925ad072?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=3008&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://plus.unsplash.com/premium_photo-1674739375749-7efe56fc8bbb?q=80&w=3086&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1619451427882-6aaaded0cc61?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1581182815808-b6eb627a8798?q=80&w=3165&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://plus.unsplash.com/premium_photo-1679046949454-0edc76ebbf7f?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://plus.unsplash.com/premium_photo-1684407616442-8d5a1b7c978e?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=3287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1506003094589-53954a26283f?q=80&w=2121&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://plus.unsplash.com/premium_photo-1679064286975-1eda8ac9075f?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
];

let urlIndex = 0;
const getNextImageUrl = () => {
  const url = imageUrls[urlIndex];
  urlIndex = (urlIndex + 1) % imageUrls.length; 
  return url;
};

const featuredArticlesData = [
  {
    category: 'Skin Rituals',
    title: 'How to layer your suncare products correctly',
    description: 'Learn how to apply skincare and sunscreen in the right order for optimal protection.',
    image: getNextImageUrl(),
    slug: 'layer-suncare',
    content: `
      <p>Layering suncare might seem complex, but it's crucial for effectiveness. Start with your thinnest products and work your way up.</p>
      <p><strong>Step 1: Cleanser.</strong> Always begin with a clean canvas.</p>
      <p><strong>Step 2: Toner (Optional).</strong> If you use one, apply it now.</p>
      <p><strong>Step 3: Serums.</strong> Apply your treatment serums, like Vitamin C.</p>
      <p><strong>Step 4: Moisturizer.</strong> Hydrate the skin before SPF.</p>
      <p><strong>Step 5: Sunscreen.</strong> Apply generously as the final step before makeup. Ensure it's broad-spectrum and suitable for your skin type.</p>
      <p>Remember to reapply sunscreen every two hours, especially if outdoors.</p>
    `,
  },
  {
    category: 'Suncare Wisdom',
    title: 'How diet affects your skin\'s glow',
    description: 'The foods that nourish your skin from the inside out for a naturally glowing complexion',
    image: getNextImageUrl(),
    slug: 'diet-skin-glow',
    content: `
      <p>What you eat truly reflects on your skin. A balanced diet rich in antioxidants, healthy fats, and vitamins is key.</p>
      <p><strong>Antioxidant Powerhouses:</strong> Berries, dark leafy greens, and green tea fight free radical damage.</p>
      <p><strong>Healthy Fats:</strong> Avocados, nuts, seeds, and fatty fish (like salmon) provide essential fatty acids for supple skin.</p>
      <p><strong>Vitamins C & E:</strong> Citrus fruits, bell peppers (Vit C), and almonds, sunflower seeds (Vit E) are crucial for collagen production and protection.</p>
      <p><strong>Hydration:</strong> Don't forget water! Proper hydration keeps skin plump and toxins flushed.</p>
      <p>Limit processed foods, sugary drinks, and excessive dairy if you notice negative effects on your skin.</p>
    `,
  },
  {
    category: 'Everyday Glow',
    title: 'Unlock Radiance: Morning Skincare Essentials',
    description: 'Start your day with these vital steps for a glowing complexion.',
    image: getNextImageUrl(),
    slug: 'morning-skincare-essentials',
    content: `
      <p>A consistent morning routine sets the stage for radiant skin all day long.</p>
      <p><strong>1. Gentle Cleanse:</strong> Remove overnight buildup without stripping natural oils.</p>
      <p><strong>2. Antioxidant Serum:</strong> Vitamin C serum is a popular choice to protect against environmental stressors.</p>
      <p><strong>3. Hydration:</strong> A lightweight moisturizer suitable for your skin type.</p>
      <p><strong>4. Eye Cream (Optional):</strong> Address specific concerns like puffiness or dark circles.</p>
      <p><strong>5. Sun Protection:</strong> Non-negotiable! Apply broad-spectrum SPF 30 or higher, even if staying indoors.</p>
      <p>Keep it simple and consistent for the best results.</p>
    `,
  },
];

const trendingArticlesData = [
  {
    category: 'Ingredient Spotlight',
    title: 'Niacinamide: The brightening hero your routine needs',
    description: 'Brightening benefits of this gentle active.',
    image: getNextImageUrl(),
    readTime: '3 mins read',
    slug: 'niacinamide-hero',
    content: `
      <p>Niacinamide, a form of Vitamin B3, is a powerhouse ingredient beloved for its versatility.</p>
      <p>Benefits include:</p>
      <ul>
        <li>Reducing inflammation and redness.</li>
        <li>Minimizing pore appearance.</li>
        <li>Improving skin barrier function.</li>
        <li>Regulating oil production.</li>
        <li>Treating hyperpigmentation and brightening skin tone.</li>
      </ul>
      <p>It's generally well-tolerated by most skin types and plays well with other active ingredients.</p>
    `,
  },
  {
    category: 'Everyday Glow',
    title: 'What your skin says about your lifestyle choices',
    description: 'Understand your skin\'s behavior.',
    image: getNextImageUrl(),
    readTime: '6 mins read',
    slug: 'skin-lifestyle',
    content: `
      <p>Your skin often mirrors your internal health and daily habits.</p>
      <p><strong>Lack of Sleep:</strong> Can lead to dullness, dark circles, and fine lines.</p>
      <p><strong>Stress:</strong> May trigger breakouts, eczema flare-ups, or rosacea.</p>
      <p><strong>Poor Diet:</strong> High sugar or processed foods can contribute to inflammation and acne.</p>
      <p><strong>Dehydration:</strong> Results in dry, tight-feeling skin.</p>
      <p><strong>Smoking & Alcohol:</strong> Accelerate aging and dehydrate the skin.</p>
      <p>Paying attention to these signals can help you make healthier choices for better skin.</p>
    `,
  },
  {
    category: 'Suncare Wisdom',
    title: 'SPF 30 vs SPF 50 – which one should you choose?',
    description: 'A gentle guide to understanding SPF levels.',
    image: getNextImageUrl(),
    readTime: '4 mins read',
    slug: 'spf-30-vs-50',
    content: `
      <p>SPF (Sun Protection Factor) measures protection against UVB rays, the primary cause of sunburn.</p>
      <p><strong>SPF 30:</strong> Blocks approximately 97% of UVB rays.</p>
      <p><strong>SPF 50:</strong> Blocks approximately 98% of UVB rays.</p>
      <p>While SPF 50 offers slightly more protection, the difference is marginal. More important factors are:</p>
      <ul>
        <li><strong>Broad-Spectrum:</strong> Ensure protection against UVA rays too.</li>
        <li><strong>Application Amount:</strong> Most people don't apply enough sunscreen. Be generous!</li>
        <li><strong>Reapplication:</strong> Reapply every 2 hours, or more often if sweating or swimming.</li>
      </ul>
      <p>For most people, a well-applied broad-spectrum SPF 30 is sufficient for daily use.</p>
    `,
  },
  {
    category: 'Everyday Glow',
    title: 'Rituals of self love through skincare application',
    description: 'It\'s about how you make time for yourself.',
    image: getNextImageUrl(),
    readTime: '5 mins read',
    slug: 'self-love-skincare',
    content: `
      <p>Your skincare routine can be more than just maintenance; it can be a mindful act of self-care.</p>
      <p>Transform the routine:</p>
      <ul>
        <li><strong>Be Present:</strong> Focus on the textures and scents of your products.</li>
        <li><strong>Gentle Massage:</strong> Use upward strokes while applying serums and moisturizers to boost circulation and relaxation.</li>
        <li><strong>Breathe Deeply:</strong> Incorporate mindful breathing during your routine.</li>
        <li><strong>Positive Affirmations:</strong> Use this time to appreciate yourself.</p>
        <li><strong>Consistency:</strong> Dedicating this time daily reinforces self-worth.</p>
      </ul>
      <p>It's less about the products and more about the intention and time dedicated to yourself.</p>
    `,
  },
  {
    category: 'Skin Rituals',
    title: 'How to reapply sunscreen without messing up makeup',
    description: 'Elegant solutions for staying protected all day.',
    image: getNextImageUrl(),
    readTime: '4 mins read',
    slug: 'reapply-sunscreen-makeup',
    content: `
      <p>Reapplying SPF over makeup is essential but can be tricky. Here are some methods:</p>
      <p><strong>1. SPF Mists/Sprays:</strong> Hold at arm's length and spray evenly. Let it dry. Ideal for light touch-ups.</p>
      <p><strong>2. SPF Powders:</strong> Translucent or tinted powders with SPF offer easy, mattifying reapplication. Use a dense brush or puff.</p>
      <p><strong>3. SPF Setting Sprays:</strong> Combine makeup setting with SPF protection. Ensure even coverage.</p>
      <p><strong>4. Cushion Compacts:</strong> SPF-infused cushion foundations or sunscreens allow for gentle patting application.</p>
      <p>Choose the method that best suits your skin type and makeup style. Remember, consistent protection is key!</p>
    `,
  },
];

const latestArticlesData = [
  {
    category: 'Ingredient Spotlight',
    title: 'The beauty of zinc oxide: a gentle hero for every skin type',
    description: 'Zinc Oxide is the quiet protector in elegant suncare.',
    image: getNextImageUrl(),
    readTime: '4 mins read',
    slug: 'zinc-oxide-beauty',
    content: `
      <p>Zinc Oxide is a mineral sunscreen filter known for its gentle nature and broad-spectrum protection.</p>
      <p><strong>How it Works:</strong> It sits on the skin's surface, forming a physical barrier that reflects and scatters UVA and UVB rays.</p>
      <p><strong>Benefits:</strong></p>
      <ul>
        <li>Suitable for sensitive and acne-prone skin.</li>
        <li>Photostable (doesn't degrade easily in sunlight).</li>
        <li>Offers immediate protection upon application.</li>
        <li>Often found in formulas for babies and those with skin conditions.</li>
      </ul>
      <p>Modern formulations have greatly reduced the white cast previously associated with zinc oxide sunscreens, making them cosmetically elegant.</p>
    `,
  },
  {
    category: 'Everyday Glow',
    title: 'Do you really need sunscreen indoors? Yes, but why?',
    description: 'Yes, but not for the reasons you think.',
    image: getNextImageUrl(),
    readTime: '5 mins read',
    slug: 'sunscreen-indoors',
    content: `
      <p>While UVB rays (causing sunburn) are largely blocked by windows, UVA rays (causing aging and contributing to skin cancer) can penetrate glass.</p>
      <p>Reasons to wear SPF indoors:</p>
      <ul>
        <li><strong>UVA Protection:</strong> Standard window glass does not block UVA rays effectively. If you sit near windows at home or in the office, you're exposed.</li>
        <li><strong>Blue Light:</strong> Some studies suggest potential long-term effects from blue light emitted by screens, though the primary concern remains UV radiation. Many broad-spectrum SPFs offer some blue light protection.</li>
        <li><strong>Habit Formation:</strong> Applying SPF daily, regardless of plans, ensures consistent protection for incidental sun exposure (e.g., walking to the mailbox).</li>
      </ul>
      <p>Using a comfortable, broad-spectrum SPF indoors is a wise preventative measure for long-term skin health.</p>
    `,
  },
  {
    category: 'Skin Rituals',
    title: 'How to Choose the Right Cleanser for Your Skin Type',
    description: 'Decoding cleansers from balms to foams.',
    image: getNextImageUrl(),
    readTime: '7 mins read',
    slug: 'choose-right-cleanser',
    content: `
      <p>Choosing the right cleanser is fundamental to a healthy skincare routine.</p>
      <p><strong>Dry Skin:</strong> Look for cream, oil, or balm cleansers that hydrate and don't strip natural oils.</p>
      <p><strong>Oily Skin:</strong> Gel or foaming cleansers can help control excess sebum. Look for ingredients like salicylic acid (if acne-prone).</p>
      <p><strong>Combination Skin:</strong> Gel cleansers or gentle foaming cleansers often work well. You might use different cleansers on different areas.</p>
      <p><strong>Sensitive Skin:</strong> Micellar water, cream cleansers, or gentle, fragrance-free formulas are best.</p>
      <p><strong>Normal Skin:</strong> You have flexibility! Most cleanser types will work, focus on formulas you enjoy using.</p>
      <p>Always cleanse gently, avoid harsh scrubbing, and rinse thoroughly.</p>
    `,
  },
  {
    category: 'Everyday Glow',
    title: 'Morning Skincare Routine for a Radiant Start',
    description: 'Wake up your skin with these essential steps.',
    image: getNextImageUrl(),
    readTime: '3 mins read',
    slug: 'morning-skincare',
    content: `
      <p>Establish a simple yet effective morning routine for glowing skin.</p>
      <p><strong>Step 1: Cleanse.</strong> Use a gentle cleanser to remove any impurities accumulated overnight.</p>
      <p><strong>Step 2: Tone (Optional).</strong> Balance pH and prep skin for subsequent products.</p>
      <p><strong>Step 3: Serum.</strong> An antioxidant serum, like Vitamin C, helps protect against daily aggressors.</p>
      <p><strong>Step 4: Moisturize.</strong> Lock in hydration with a moisturizer suited to your skin type.</p>
      <p><strong>Step 5: Sunscreen.</strong> The most critical step! Apply broad-spectrum SPF 30+ generously.</p>
      <p>Consistency is key. Stick to your routine daily for noticeable results.</p>
    `,
  },
  {
    category: 'Ingredient Spotlight',
    title: 'Hyaluronic Acid: The Hydration Magnet',
    description: 'Unlock plump, hydrated skin with this powerful humectant.',
    image: getNextImageUrl(),
    readTime: '4 mins read',
    slug: 'hyaluronic-acid-hydration',
    content: `
      <p>Hyaluronic Acid (HA) is naturally found in the skin and is renowned for its ability to hold up to 1000 times its weight in water.</p>
      <p><strong>Key Benefits:</strong></p>
      <ul>
        <li>Intense hydration: Draws moisture into the skin, making it look plump and dewy.</li>
        <li>Smooths fine lines: Temporarily plumps the skin, reducing the appearance of wrinkles.</li>
        <li>Gentle: Suitable for almost all skin types, including sensitive skin.</li>
        <li>Enhances other products: Helps other skincare ingredients penetrate more effectively.</li>
      </ul>
      <p>Look for serums or moisturizers containing different molecular weights of HA for multi-level hydration.</p>
    `,
  },
  {
    category: 'Skin Rituals',
    title: 'The Art of Double Cleansing for Clearer Skin',
    description: 'Why washing your face twice might be the key to unlocking your best skin.',
    image: getNextImageUrl(),
    readTime: '6 mins read',
    slug: 'double-cleansing-art',
    content: `
      <p>Double cleansing involves using two different types of cleansers, one after the other.</p>
      <p><strong>Step 1: Oil-Based Cleanser.</strong> Use an oil cleanser, balm, or micellar water to break down makeup, SPF, and excess sebum.</p>
      <p><strong>Step 2: Water-Based Cleanser.</strong> Follow up with a traditional gel, cream, or foaming cleanser suitable for your skin type to wash away any remaining residue and impurities.</p>
      <p><strong>Benefits:</strong></p>
      <ul>
        <li>Thoroughly removes impurities that can lead to breakouts.</li>
        <li>Allows subsequent skincare products to penetrate better.</li>
        <li>Can improve skin texture over time.</li>
      </ul>
      <p>It's particularly beneficial for makeup wearers or those with oily/combination skin, but can be adapted for all skin types.</p>
    `,
  },
  {
    category: 'Suncare Wisdom',
    title: 'Understanding UV Index and What It Means For Your Skin',
    description: 'Decode the daily UV forecast to better protect your skin from sun damage.',
    image: getNextImageUrl(),
    readTime: '5 mins read',
    slug: 'uv-index-explained',
    content: `
      <p>The UV Index is a daily forecast of the expected intensity of ultraviolet (UV) radiation from the sun.</p>
      <p><strong>Scale (Typical):</strong></p>
      <ul>
        <li><strong>0-2 (Low):</strong> Minimal protection needed.</li>
        <li><strong>3-5 (Moderate):</strong> Seek shade during midday hours, wear protective clothing, hat, sunglasses, and SPF.</li>
        <li><strong>6-7 (High):</strong> Protection essential. Reduce sun exposure between 10 am and 4 pm.</li>
        <li><strong>8-10 (Very High):</strong> Extra precautions needed. Unprotected skin can burn quickly.</li>
        <li><strong>11+ (Extreme):</strong> Avoid sun exposure during peak hours. Take all precautions.</li>
      </ul>
      <p>Checking the UV index helps you plan your day and choose appropriate sun protection measures, regardless of the temperature or cloud cover.</p>
    `,
  },
  {
    category: 'Suncare Wisdom',
    title: 'Beyond the Face: Don\'t Neglect Neck and Hand Suncare',
    description: 'These often-forgotten areas show signs of aging just as quickly.',
    image: getNextImageUrl(),
    readTime: '3 mins read',
    slug: 'neck-hand-suncare',
    content: `
      <p>While we diligently apply SPF to our faces, the neck, chest (décolletage), and hands are often overlooked but receive significant sun exposure.</p>
      <p><strong>Why it Matters:</strong> These areas have thinner skin and are prone to showing sunspots, wrinkles, and crepiness earlier than other parts of the body.</p>
      <p><strong>Simple Integration:</strong></p>
      <ul>
        <li>Extend your facial sunscreen application down your neck and onto your chest every morning.</li>
        <li>Apply sunscreen specifically formulated for hands or use your facial sunscreen on the backs of your hands.</li>
        <li>Reapply to hands after washing.</li>
        <li>Consider UPF clothing or wide-brimmed hats for extra protection.</li>
      </ul>
      <p>Consistent sun protection in these areas is crucial for maintaining youthful-looking skin long-term.</p>
    `,
  },
  {
    category: 'Skin Rituals',
    title: 'Facial Massage Techniques for Relaxation & Glow',
    description: 'Incorporate simple massage techniques into your routine for added benefits.',
    image: getNextImageUrl(),
    readTime: '5 mins read',
    slug: 'facial-massage-techniques',
    content: `
      <p>Facial massage can boost circulation, promote lymphatic drainage, and enhance product absorption.</p>
      <p><strong>Basic Techniques:</strong></p>
      <ul>
        <li><strong>Forehead:</strong> Use gentle upward strokes from eyebrows towards the hairline.</li>
        <li><strong>Cheeks:</strong> Use outward and upward sweeping motions from the nose towards the temples.</li>
        <li><strong>Jawline:</strong> Gently pinch or sweep along the jawline from chin to ears.</li>
        <li><strong>Under Eyes:</strong> Use your ring finger to gently tap from the inner corner outwards.</li>
      </ul>
      <p>Always use a facial oil or a rich moisturizer to provide slip and avoid tugging the skin. Even a minute or two daily can make a difference.</p>
    `,
  },
  {
    category: 'Skin Rituals',
    title: 'The Importance of Patch Testing New Skincare Products',
    description: 'Avoid potential irritation by introducing new products carefully.',
    image: getNextImageUrl(),
    readTime: '3 mins read',
    slug: 'patch-testing-importance',
    content: `
      <p>Patch testing is a simple way to check if your skin will react negatively to a new product before applying it all over your face.</p>
      <p><strong>How to Patch Test:</strong></p>
      <ol>
        <li>Choose a discreet area of skin, like the inner forearm, behind the ear, or side of the neck.</li>
        <li>Apply a small amount of the new product to the chosen area.</li>
        <li>Leave the product on (follow product instructions if it's a rinse-off type).</li>
        <li>Monitor the area for 24-48 hours (or up to 72 hours for some).</li>
        <li>Check for signs of reaction: redness, itching, burning, bumps, or irritation.</li>
      </ol>
      <p>If no reaction occurs, the product is likely safe to use on your face. If a reaction happens, discontinue use immediately.</p>
    `,
  },
];

const journalCategoriesData = [
  'All', 'Ingredient Spotlight', 'Everyday Glow', 'Skin Rituals', 'Suncare Wisdom'
];

const allArticlesData = [...featuredArticlesData, ...trendingArticlesData, ...latestArticlesData];


const BeautifyHomepage= () => {
  const [selectedArticleSlug, setSelectedArticleSlug] = useState(null);
  const [activeJournalFilter, setActiveJournalFilter] = useState('All');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  
  const featuredArticles = featuredArticlesData;
  const trendingArticles = trendingArticlesData;
  const latestArticles = latestArticlesData;
  const journalCategories = journalCategoriesData;
  const allArticles = allArticlesData;

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [notificationMessage, setNotificationMessage] = useState(null);
  const scrollContainerRef = useRef(null);
  const processSearchInput = (event) => {
    setSearchQuery(event.target.value);
  };

  const openSearchPanel = () => {
    setIsSearchOpen(true); 
  };

  const closeSearchPanel = () => {
    setIsSearchOpen(false);
    setSearchQuery(''); 
    setSearchResults([]); 
  };

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const processNewsletterSubscription = (email) => {
    console.log(`Subscribing ${email}`);
    
    setNotificationMessage("Thank you for subscribing!");
    
    setTimeout(() => {
      setNotificationMessage(null);
    }, 4000);
  };

  const applyJournalFilter = (category) => {
    setActiveJournalFilter(category); 
  };

  
  useEffect(() => {
      if (featuredArticles.length <= 1) return;

      const interval = setInterval(() => {
          setActiveSlideIndex((prevIndex) => (prevIndex + 1) % featuredArticles.length);
      }, 6000);

      return () => clearInterval(interval);
  }, [featuredArticles.length]);

  const navigateToArticle = (slug) => {
    setSelectedArticleSlug(slug); 
    window.scrollTo(0, 0); 
  };

  const exitArticleView = () => {
    setSelectedArticleSlug(null);
  };

  const toggleMobileNavigation = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };


  
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer && scrollContainer.children.length > 0) {
      const track = scrollContainer.children[0]; 
      if (track && track.children.length > activeSlideIndex) {
         const slideElement = track.children[activeSlideIndex] as HTMLElement;
         if (slideElement) {
           const scrollLeft = slideElement.offsetLeft - (scrollContainer.offsetLeft || 0); 
           scrollContainer.scrollTo({
             left: scrollLeft,
             behavior: 'smooth',
           });
         }
      }
    }
  }, [activeSlideIndex]); 

  
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const lowerCaseQuery = searchQuery.toLowerCase();
    const results = allArticles.filter(article =>
      article.title.toLowerCase().includes(lowerCaseQuery) ||
      article.description.toLowerCase().includes(lowerCaseQuery) ||
      article.category.toLowerCase().includes(lowerCaseQuery)
      
    );
    setSearchResults(results);

  }, [searchQuery, allArticles]); 

  
  const currentArticle = selectedArticleSlug
    ? allArticles.find(article => article.slug === selectedArticleSlug)
    : null;

  return (
    <div className={`min-h-screen bg-stone-50 dark:bg-stone-900 text-stone-800 dark:text-stone-200 ${fontClasses} font-inter`}>

      
      <header className="sticky top-0 z-50 bg-stone-50/80 dark:bg-stone-900/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-700">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          
          <div className="text-2xl font-playfair font-medium text-stone-900 dark:text-stone-100">
            Beautify
          </div>

          
          <div className="hidden md:flex items-center space-x-6">
            
            <a href="#" className="hover:text-stone-600 dark:hover:text-stone-400 transition-colors font-medium">Journal</a>
          </div>

          
          <div className="flex items-center space-x-4">
            <button onClick={openSearchPanel} className="hidden md:flex items-center space-x-1 hover:text-stone-600 dark:hover:text-stone-400 cursor-pointer">
              <Search size={16} /> 
              <span>Search</span> 
            </button>
            
            <button
              onClick={toggleMobileNavigation}
              className="md:hidden p-2 rounded hover:bg-stone-200 dark:hover:bg-stone-700 cursor-pointer"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && toggleMobileNavigation()}
            >
              <Menu size={20} />
            </button>
          </div>
        </nav>
        
        {isMobileMenuOpen && (
          <div className="md:hidden bg-stone-50 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-700 py-4 px-4 space-y-3">
            
            <a href="#" className="block px-3 py-2 rounded hover:bg-stone-100 dark:hover:bg-stone-800 font-medium">Journal</a>
            <button onClick={openSearchPanel} className="block w-full text-left px-3 py-2 rounded hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer">
              Search
            </button>
          </div>
        )}
      </header>

      
      {currentArticle ? (
        <div className="container mx-auto px-4 py-8 md:py-16">
          <button
            onClick={exitArticleView}
            className="inline-flex items-center mb-6 text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 cursor-pointer"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Journal
          </button>

          <article className="max-w-3xl mx-auto">
            <span className="text-sm uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
              {currentArticle.category}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-medium text-stone-900 dark:text-stone-100 mb-4 leading-tight">
              {currentArticle.title}
            </h1>
            {currentArticle.readTime && (
              <p className="text-sm text-stone-500 dark:text-stone-400 mb-6">
                {currentArticle.readTime}
              </p>
            )}
            <img
              src={currentArticle.image} 
              className="w-full h-auto max-h-[500px] object-cover rounded-lg mb-8 shadow-md"
            />
            
            <div
              className="prose prose-stone dark:prose-invert lg:prose-lg max-w-none" 
              dangerouslySetInnerHTML={{ __html: currentArticle.content }}
            />
          </article>
        </div>
      ) : (
        <main className="container mx-auto px-4 py-8 md:py-12">
          
          <section className="text-left mb-12 md:mb-16">
            <p className="text-sm uppercase tracking-widest text-stone-500 dark:text-stone-400 mb-2 font-medium">
              Journal
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-medium text-stone-900 dark:text-stone-100 leading-tight">
              Your soft space to <br className="hidden sm:block" /> explore beauty with care
            </h1>
          </section>

          
          <section className="mb-12 md:mb-16">
            <div
              ref={scrollContainerRef}
              className="overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar pb-4 -mb-4"
            >
              <div className="flex gap-x-4 md:gap-x-6 -ml-1 pl-1">
                {featuredArticles.map((article, index) => (
                  <div
                    key={article.slug}
                    className="w-[90%] sm:w-[80%] md:w-[65%] lg:w-2/3 flex-shrink-0 snap-start"
                  >
                    <div
                      className="relative rounded-lg overflow-hidden shadow-md group h-[400px] md:h-[450px]"
                    >
                      <img
                        src={article.image}
                        alt={`Image for ${article.title}`}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-6 md:p-8 text-white w-full max-w-xl">
                        <span className="inline-block bg-white/20 text-white text-xs font-medium px-2 py-1 rounded mb-2 backdrop-blur-sm">
                          {article.category}
                        </span>
                        <h2 className="text-2xl md:text-3xl font-playfair font-medium mb-2 leading-tight line-clamp-2">
                          {article.title}
                        </h2>
                        <p className="text-sm md:text-base text-stone-200 mb-4 opacity-90 line-clamp-2">
                          {article.description}
                        </p>
                        <button
                          onClick={() => navigateToArticle(article.slug)}
                          className="inline-flex items-center text-sm font-medium border border-white/50 px-4 py-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                          tabIndex={0}
                          onKeyDown={(e) => e.key === 'Enter' && navigateToArticle(article.slug)}
                        >
                          Read More
                          <ArrowRight size={16} className="ml-2" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          
          <section className="mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-playfair font-medium text-stone-900 dark:text-stone-100 mb-6 md:mb-8">
              Trending
            </h2>
            <div className="space-y-4">
              {trendingArticles.map((article) => (
                <div
                  key={article.slug}
                  className="flex items-center p-2 md:p-4 border border-stone-200 dark:border-stone-700 rounded-lg transition-colors group"
                >
                  <button
                    onClick={() => navigateToArticle(article.slug)}
                    onKeyDown={(e) => e.key === 'Enter' && navigateToArticle(article.slug)}
                    tabIndex={0}
                    className="flex flex-grow items-center text-left p-2 -m-2 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer min-w-0 mr-4"
                  >
                    <img
                      src={article.image}
                      alt={`Thumbnail for ${article.title}`}
                      className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-md mr-4 flex-shrink-0"
                    />
                    <div className="flex-grow mr-2 min-w-0">
                      <h3 className="font-medium text-lg leading-tight text-stone-800 dark:text-stone-200 mb-1 truncate whitespace-nowrap text-ellipsis group-hover:text-clip">
                        {article.title}
                      </h3>
                      <p className="text-sm text-stone-600 dark:text-stone-400 line-clamp-1">
                        {article.description}
                      </p>
                    </div>
                  </button>

                  
                  <div className="hidden sm:flex flex-col items-end space-y-1 text-sm mr-4 flex-shrink-0 w-32 text-right">
                    <span className="bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                      {article.category}
                    </span>
                    <span className="text-stone-500 dark:text-stone-400">
                      {article.readTime}
                    </span>
                  </div>
                  <button
                    onClick={() => navigateToArticle(article.slug)}
                    className="flex-shrink-0 p-2 rounded-full bg-stone-100 dark:bg-stone-700 group-hover:bg-stone-200 dark:group-hover:bg-stone-600 transition-colors cursor-pointer"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && navigateToArticle(article.slug)}
                    >
                      <ArrowRight size={18} className="text-stone-600 dark:text-stone-300"/>
                  </button>
                </div>
              ))}
            </div>
          </section>

          
          <section id="journal-section" className="mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-playfair font-medium text-stone-900 dark:text-stone-100 mb-6 md:mb-8">
              Latest Journal
            </h2>
            <div className="flex flex-col md:flex-row gap-8">
              
              <aside className="w-full md:w-1/4 lg:w-1/5 flex-shrink-0">
                <h3 className="font-medium text-lg mb-4 text-stone-700 dark:text-stone-300">Categories</h3>
                <ul className="space-y-2">
                  {journalCategories.map((category) => {
                    const isActive = category === activeJournalFilter;
                    return (
                      <li key={category}>
                        <button
                          onClick={() => applyJournalFilter(category)}
                          title={category}
                          className={`w-full text-left px-3 py-1.5 rounded transition-colors cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis ${
                            isActive
                              ? 'bg-stone-200 dark:bg-stone-700 text-stone-900 dark:text-stone-100 font-medium'
                              : 'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                          }`}
                          tabIndex={0}
                          onKeyDown={(e) => e.key === 'Enter' && applyJournalFilter(category)}
                        >
                          {category}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </aside>

              
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                {latestArticles
                  .filter(article => activeJournalFilter === 'All' || article.category === activeJournalFilter)
                  .map((article) => (
                    <button
                      key={article.slug}
                      onClick={() => navigateToArticle(article.slug)}
                      onKeyDown={(e) => e.key === 'Enter' && navigateToArticle(article.slug)}
                      tabIndex={0}
                      className="group rounded-lg overflow-hidden shadow-sm border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/50 flex flex-col text-left cursor-pointer transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600"
                    >
                      
                      <div className="relative aspect-video overflow-hidden">
                         <img
                           src={article.image}
                           alt={`Cover for ${article.title}`}
                           className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                         />
                         <div className="absolute top-2 right-2 bg-white/80 dark:bg-black/60 text-stone-700 dark:text-stone-300 text-xs px-2 py-0.5 rounded backdrop-blur-sm">
                           {article.readTime}
                         </div>
                          <span className="absolute bottom-2 left-2 inline-block bg-white/80 dark:bg-black/60 text-stone-700 dark:text-stone-300 text-xs font-medium px-2 py-0.5 rounded backdrop-blur-sm">
                            {article.category}
                         </span>
                      </div>
                      
                      <div className="p-4 flex flex-col flex-grow">
                        <h3 className="font-playfair text-xl font-medium text-stone-900 dark:text-stone-100 mb-2 leading-snug flex-grow">
                          {article.title}
                        </h3>
                        <p className="text-sm text-stone-600 dark:text-stone-400 mb-4 line-clamp-2">
                           {article.description}
                        </p>
                        
                        <div className="mt-auto self-start">
                          <span className="inline-flex items-center text-sm font-medium text-stone-500 dark:text-stone-400 group-hover:text-stone-700 dark:group-hover:text-stone-200 transition-colors">
                              Read More
                              <ArrowRight size={16} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                           </span>
                        </div>
                      </div>
                   </button>
                 ))
               }
              </div>
            </div>
          </section>

          
          <section className="relative mt-16 md:mt-24 py-16 md:py-24 rounded-lg overflow-hidden">
            
            <img
              src="https://images.unsplash.com/photo-1686078291186-862aa280374f?q=80&w=3072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Newsletter background"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-200/50 dark:from-stone-900/60 to-transparent"></div>

            
            <div className="relative z-10 container mx-auto px-4 flex justify-center">
              <div className="bg-white/70 dark:bg-stone-800/70 backdrop-blur-md p-6 md:p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                
                <AnimatePresence>
                  {notificationMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="mb-4 p-3 bg-green-100 dark:bg-green-800/50 border border-green-300 dark:border-green-600 text-green-700 dark:text-green-200 text-sm rounded-md"
                    >
                      {notificationMessage}
                    </motion.div>
                  )}
                </AnimatePresence>

                <h3 className="text-sm uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-2">
                  Subscribe to Our Newsletter
                </h3>
                <p className="text-stone-700 dark:text-stone-300 mb-4">
                  Get the latest beauty insights and offers directly in your inbox.
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const email = formData.get('email') as string;
                    if (email) {
                      processNewsletterSubscription(email);
                      (e.target as HTMLFormElement).reset(); 
                    }
                  }}
                  className="flex items-center bg-white dark:bg-stone-700 rounded-full overflow-hidden p-1 shadow-inner"
                >
                  <input
                    type="email"
                    name="email"
                    placeholder="your.email@example.com"
                    required
                    className="flex-grow px-4 py-2 bg-transparent border-none focus:outline-none focus:ring-0 text-stone-800 dark:text-stone-200 placeholder-stone-500 dark:placeholder-stone-400"
                  />
                  <button
                    type="submit"
                    className="bg-stone-800 dark:bg-stone-600 text-white p-2 rounded-full hover:bg-stone-700 dark:hover:bg-stone-500 transition-colors cursor-pointer flex-shrink-0"
                    tabIndex={0}
                    
                  >
                    <ArrowRight size={20} />
                  </button>
                </form>
              </div>
            </div>
          </section>
        </main>
      )}

      
      <footer className="bg-stone-100 dark:bg-stone-800 border-t border-stone-200 dark:border-stone-700 mt-16">
        <div className="container mx-auto px-4 py-10 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

            
            <div className="md:col-span-1">
              <div className="text-2xl font-playfair font-medium text-stone-900 dark:text-stone-100 mb-4">
                Beautify
              </div>
            </div>

            
            <div className="md:col-span-1 grid grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-3 text-stone-700 dark:text-stone-300">Company</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-stone-900 dark:hover:text-stone-100 text-stone-600 dark:text-stone-400 transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-stone-900 dark:hover:text-stone-100 text-stone-600 dark:text-stone-400 transition-colors">Journal</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3 text-stone-700 dark:text-stone-300">Help</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-stone-900 dark:hover:text-stone-100 text-stone-600 dark:text-stone-400 transition-colors">Contact</a></li>
                  <li><a href="#" className="hover:text-stone-900 dark:hover:text-stone-100 text-stone-600 dark:text-stone-400 transition-colors">Shipping & Returns</a></li>
                  <li><a href="#" className="hover:text-stone-900 dark:hover:text-stone-100 text-stone-600 dark:text-stone-400 transition-colors">FAQ</a></li>
                </ul>
              </div>
            </div>

             
             <div className="md:col-span-1 flex flex-col md:items-end text-sm">
               <div className="mb-4">
                <h4 className="font-medium mb-3 text-stone-700 dark:text-stone-300">Follow Us</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-stone-900 dark:hover:text-stone-100 text-stone-600 dark:text-stone-400 transition-colors">Tiktok</a></li>
                  <li><a href="#" className="hover:text-stone-900 dark:hover:text-stone-100 text-stone-600 dark:text-stone-400 transition-colors">Instagram</a></li>
                  <li><a href="#" className="hover:text-stone-900 dark:hover:text-stone-100 text-stone-600 dark:text-stone-400 transition-colors">X (Twitter)</a></li>
                </ul>
               </div>
                <div className="mt-auto pt-4 md:text-right">
                  <ul className="space-y-2">
                     <li><a href="#" className="hover:text-stone-900 dark:hover:text-stone-100 text-stone-600 dark:text-stone-400 transition-colors">Terms</a></li>
                     <li><a href="#" className="hover:text-stone-900 dark:hover:text-stone-100 text-stone-600 dark:text-stone-400 transition-colors">Privacy</a></li>
                  </ul>
                </div>
             </div>

          </div>

          
          <div className="border-t border-stone-300 dark:border-stone-600 pt-6 text-center text-xs text-stone-500 dark:text-stone-400">
            &copy; {new Date().getFullYear()} Beautify. All rights reserved.
          </div>
        </div>
      </footer>

      
      <SearchOverlay
        isOpen={isSearchOpen}
        query={searchQuery}
        results={searchResults}
        updateSearchQuery={processSearchInput}
        requestPanelClosure={closeSearchPanel}
        selectArticleResult={navigateToArticle} 
      />
    </div>
  );
};

export default BeautifyHomepage;
