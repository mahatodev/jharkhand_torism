import React, { useState, useEffect } from "react";

import { motion, AnimatePresence } from "framer-motion";

import { Link } from "react-router-dom";

import {

 Mountain,

 MapPin,

 Smartphone,

 Shield,

 Globe,

 Utensils,

 ShoppingCart,

 Leaf,

 ArrowRight,

 BedDouble,

 Users,

 Palette, // Icon for Handicrafts

 Home, // Icon for Homestays

 Calendar, // Icon for Events

 Sprout, // Icon for Ecotourism

} from "lucide-react";

const LandingPage: React.FC = () => {

 const heroImages = [

  "Images/jonha-fall.jpg",

  "Images/patratu-valley-ranchi-jharkhand-1-hero.jpg",

  "Images/hazaribagh-lake.jpg",

  "Images/ghatshila.jpg",

  "Images/360_F_524045329_OYwCWgLRFpsq6VX82dTeDcFV4wJ9jTYC.jpg",

  "Images/264012277_b7093876ae_b.jpg",

  "Images/Raj_Bhawan.jpg",

 ];

 const [currentImage, setCurrentImage] = useState(0);

 useEffect(() => {

  const interval = setInterval(() => {

   setCurrentImage((prev) => (prev + 1) % heroImages.length);

  }, 5000);

  return () => clearInterval(interval);

 }, [heroImages.length]);

 const nextImage = () =>

  setCurrentImage((prev) => (prev + 1) % heroImages.length);

 const prevImage = () =>

  setCurrentImage((prev) =>

   prev === 0 ? heroImages.length - 1 : prev - 1

  );

 // CORRECTED: The exploreData array is now structured correctly.

 const exploreData = [

  {

   title: "Popular Destinations",

   icon: <Mountain className="h-5 w-5 mr-2" />,

   items: [

    { name: "Patratu", image: "Images/patratu-valley-ranchi-jharkhand-1-hero.jpg", description: "Scenic valley with winding roads", location: "Ranchi" },

    { name: "Shikharji", image: "Images/sammed_shikharji.jpg", description: "Holiest Jain pilgrimage site", location: "Giridih" },

    { name: "Usri Waterfall", image: "Images/usri-waterfall.jpg", description: "A beautiful, gushing waterfall", location: "Giridih" },

    { name: "Digambar Jain Mandir", image: "Images/shree-digambar-jain-parasnath-mandir-belgachia-kolkata-shree-digambar-jain-parasnath-mandir-belgachia.webp", description: "Ancient Jain temple", location: "Giridih" },

    { name: "Canary Hill", image: "Images/canary-hill.png", description: "Lush green hill with a watchtower", location: "Hazaribagh" },

    { name: "Hundru Falls", image: "Images/hundru.jpg", description: "Magnificent 98m waterfall", location: "Ranchi" },

    { name: "Jonha Fall", image: "Images/jonha-fall.jpg", description: "A serene hanging valley waterfall", location: "Ranchi" },

    { name: "Betla National Park", image: "https://images.pexels.com/photos/1183099/pexels-photo-1183099.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Wildlife sanctuary with tigers", location: "Latehar" },

    { name: "Deoghar", image: "Images/deoghar.jpg", description: "Sacred Baidyanath Temple", location: "Deoghar" },

    { name: "Ghatshila", image: "Images/ghatshila.jpg", description: "Riverside town with scenic beauty", location: "East Singhbhum" },

    { name: "Rajrappa Mandir", image: "Images/rajrappa mandir.jpg", description: "Chhinnamasta Temple at river confluence", location: "Ramgarh" },

    { name: "Hazaribagh Lake", image: "Images/hazaribagh-lake.jpg", description: "A chain of beautiful artificial lakes", location: "Hazaribagh" },

   ],

  },

  {

   title: "Local Cuisine",

   icon: <Utensils className="h-5 w-5 mr-2" />,

   items: [

    { name: "Litti Chokha", image: "Images/Baati-Chokha-Uttar-Pradesh-breakfast-dish.webp", description: "Roasted wheat balls with mashed veggies", location: "State-wide" },

    { name: "Dhuska", image: "Images/duska.jpg", description: "Deep-fried rice flour bread", location: "Ranchi" },

    { name: "Meetha Khajer", image: "Images/meetha khajer.jpg", description: "Sweet wheat flour snack", location: "State-wide" },

    { name: "Rugra", image: "Images/Rugra.jpg", description: "An indigenous, edible mushroom", location: "Forest Areas" },

    { name: "Thekua", image: "Images/thekua.jpeg", description: "A traditional sweet cookie", location: "State-wide" },

    { name: "Meat Salan", image: "Images/mutton-curry meat salan.webp", description: "Spicy and rich mutton curry", location: "State-wide" },

    { name: "Malpua", image: "Images/malpua.webp", description: "Sweet pancake soaked in syrup", location: "State-wide" },

    { name: "Chilka Roti", image: "Images/Chilka-Roti-02.jpg", description: "Thin pancake made from rice flour", location: "Tribal Regions" },

   ],

  },

  {

   title: "Stays & Accommodations",

   icon: <BedDouble className="h-5 w-5 mr-2" />,

   items: [

    { name: "Hotel Radisson Blu", image: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800", description: "5-star luxury stay", location: "Ranchi" },

    { name: "Chanakya BNR Hotel", image: "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Heritage hotel experience", location: "Ranchi" },

    { name: "Mayuri Hill Resort", image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Scenic views of Netarhat", location: "Netarhat" },

    { name: "The Sonnet", image: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Modern comfort in the steel city", location: "Jamshedpur" },

   ],

  },

  {

   title: "Certified Guides",

   icon: <Users className="h-5 w-5 mr-2" />,

   items: [

    { name: "Anil Munda", image: "https://images.pexels.com/photos/1000445/pexels-photo-1000445.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Expert in tribal culture & history", location: "Ranchi" },

    { name: "Priya Singh", image: "https://images.pexels.com/photos/2102416/pexels-photo-2102416.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Wildlife & nature specialist", location: "Palamu" },

    { name: "Rajesh Oraon", image: "https://images.pexels.com/photos/4348796/pexels-photo-4348796.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Adventure sports & trekking guide", location: "Netarhat" },

    { name: "Sunita Devi", image: "https://images.pexels.com/photos/4132801/pexels-photo-4132801.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Local craft & market tours", location: "Jamshedpur" },

   ],

  },

  {

   title: "Shopping Hubs",

   icon: <ShoppingCart className="h-5 w-5 mr-2" />,

   items: [

    { name: "Pustak Path", image: "https://images.pexels.com/photos/3945667/pexels-photo-3945667.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Ranchi's book market", location: "Ranchi" },

    { name: "Jharcraft Megastore", image: "https://images.pexels.com/photos/179221/pexels-photo-179221.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Authentic tribal handicrafts", location: "State-wide" },

    { name: "Basanti Market", image: "https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Local market in Hazaribagh", location: "Hazaribagh" },

    { name: "Sakchi Market", image: "https://images.pexels.com/photos/2253833/pexels-photo-2253833.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Bustling market in Jamshedpur", location: "Jamshedpur" },

   ],

  },

  {

   title: "Wildlife & Nature",

   icon: <Leaf className="h-5 w-5 mr-2" />,

   items: [

    { name: "Palamu Tiger Reserve", image: "https://images.pexels.com/photos/158179/bengal-tiger-tiger-sofa-animal-world-158179.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Home of the majestic tiger", location: "Latehar" },

    { name: "Dalma Wildlife Sanctuary", image: "https://images.pexels.com/photos/148321/pexels-photo-148321.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Famous for its elephants", location: "Jamshedpur" },

    { name: "Canary Hill", image: "https://images.pexels.com/photos/3889852/pexels-photo-3889852.jpeg?auto=compress&cs=tinysrgb&w=800", description: "Panoramic views of Hazaribagh", location: "Hazaribagh" },

    { name: "Dassam Falls", image: "https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg?auto=compress&cs=tinysrgb&w=800", description: "A serene and natural waterfall", location: "Ranchi" },

   ],

  },

 ];

 const [activeCategory, setActiveCategory] = useState(0);

 const features = [

  { icon: <Smartphone className="h-8 w-8" />, title: "AI-Powered Planning", description: "Get personalized itineraries and multilingual chatbot assistance for seamless travel planning." },

  { icon: <Shield className="h-8 w-8" />, title: "Blockchain Security", description: "Secure transactions and verified guides through a blockchain-enabled certification system." },

  { icon: <MapPin className="h-8 w-8" />, title: "Interactive Maps", description: "Explore destinations with AR/VR previews and real-time location information." },

  { icon: <Globe className="h-8 w-8" />, title: "Local Marketplace", description: "Connect with tribal artisans, homestays, and authentic local experiences." },

 ];

 const stats = [

  { number: "50+", label: "Tourist Destinations" },

  { number: "100+", label: "Certified Guides" },

  { number: "200+", label: "Local Artisans" },

  { number: "10K+", label: "Happy Visitors" },

 ];

 const marketplaceItems = [

  { icon: <Palette className="h-10 w-10 text-emerald-600" />, title: "Tribal Handicrafts", description: "Buy authentic Sohrai art and Dokra metalwork directly from artisans.", image: "https://images.pexels.com/photos/7160133/pexels-photo-7160133.jpeg?auto=compress&cs=tinysrgb&w=800", link: "/marketplace/handicrafts" },

  { icon: <Home className="h-10 w-10 text-emerald-600" />, title: "Authentic Homestays", description: "Experience local hospitality by staying in traditional and community-run homes.", image: "https://images.pexels.com/photos/5997993/pexels-photo-5997993.jpeg?auto=compress&cs=tinysrgb&w=800", link: "/marketplace/homestays" },

  { icon: <Calendar className="h-10 w-10 text-emerald-600" />, title: "Local Events", description: "Find and book tickets for vibrant local festivals, workshops, and cultural events.", image: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=800", link: "/marketplace/events" },

  { icon: <Sprout className="h-10 w-10 text-emerald-600" />, title: "Ecotourism", description: "Join guided nature trails, bird watching tours, and sustainable tourism activities.", image: "https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=800", link: "/marketplace/ecotourism" },

 ];

 return (

  <div className="min-h-screen bg-white">

   {/* Hero Section */}

   <section className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-900 text-white overflow-hidden min-h-screen flex flex-col justify-center">

    <div className="absolute inset-0 bg-black opacity-30 z-10"></div>

    <div className="absolute inset-0">

     <AnimatePresence mode="wait">

      <motion.div

       key={currentImage}

       className="absolute inset-0 bg-cover bg-center h-full w-full"

       style={{ backgroundImage: `url(${heroImages[currentImage]})` }}

       initial={{ opacity: 0, x: 100 }}

       animate={{ opacity: 1, x: 0 }}

       exit={{ opacity: 0, x: -100 }}

       transition={{ duration: 1 }}

      />

     </AnimatePresence>

    </div>

    <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">

     <motion.div

      className="text-center"

      initial={{ opacity: 0, scale: 0.8 }}

      animate={{ opacity: 1, scale: 1 }}

      transition={{ duration: 1 }}

     >

      <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">

       Discover the Beauty of

       <span className="text-emerald-300 block">Jharkhand</span>

      </h1>

      <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">

       Experience the rich tribal culture, breathtaking landscapes, and hidden gems of Jharkhand through our AI-powered digital tourism platform.

      </p>

     </motion.div>

    </div>

    <div className="absolute inset-0 flex items-center justify-between px-6 z-30">

     <button onClick={prevImage} className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition">◀</button>

     <button onClick={nextImage} className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition">▶</button>

    </div>

   </section>

   {/* 1. Interactive Explore Section */}

   <section className="py-16 bg-white overflow-hidden">

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

     <div className="text-center mb-12">

      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Explore Jharkhand's Treasures</h2>

      <p className="text-xl text-gray-600">Discover the best places to visit, eat, shop, and experience nature.</p>

     </div>

     <div className="flex justify-center flex-wrap gap-x-4 gap-y-3 mb-12">

      {exploreData.map((category, index) => (

       <button

        key={category.title}

        onClick={() => setActiveCategory(index)}

        className={`relative flex items-center px-5 py-2.5 rounded-full font-semibold transition-colors duration-300 ${activeCategory === index ? "text-white" : "text-gray-700 hover:bg-gray-200"

         }`}

       >

        {activeCategory === index && (

         <motion.div

          layoutId="active-category-pill"

          className="absolute inset-0 bg-emerald-600 rounded-full"

          style={{ borderRadius: 9999 }}

          transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}

         />

        )}

        <span className="relative z-10 flex items-center">

         {category.icon} {category.title}

        </span>

       </button>

      ))}

     </div>

     <div className="mb-16">

      <AnimatePresence mode="wait">

       <motion.div

        key={activeCategory}

        className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"

        initial={{ opacity: 0, y: 30 }}

        animate={{ opacity: 1, y: 0 }}

        exit={{ opacity: 0, y: -30 }}

        transition={{ duration: 0.4, ease: "easeInOut" }}

       >

        {exploreData[activeCategory].items.map((item, index) => (

         <motion.div

          key={index}

          className="group cursor-pointer relative overflow-hidden rounded-xl shadow-lg h-80"

          initial={{ opacity: 0, scale: 0.9 }}

          animate={{ opacity: 1, scale: 1 }}

          transition={{ duration: 0.5, delay: index * 0.1 }}

         >

          <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

          <div className="absolute bottom-0 left-0 p-4 text-white w-full transition-transform duration-500 translate-y-1/3 group-hover:translate-y-0">

           <h3 className="text-xl font-bold">{item.name}</h3>

           <p className="text-sm text-gray-200 mb-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">{item.description}</p>

           <div className="flex items-center text-xs text-emerald-300">

            <MapPin className="h-4 w-4 mr-1" /> {item.location}

           </div>

           <div className="absolute right-4 bottom-4 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:bottom-6">

            <span className="flex items-center text-sm font-semibold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">

             Explore <ArrowRight className="h-4 w-4 ml-1" />

            </span>

           </div>

          </div>

         </motion.div>

        ))}

       </motion.div>

      </AnimatePresence>

     </div>

    </div>

   </section>

   {/* Local Marketplace Section */}

   <section className="py-16 bg-emerald-50">

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

     <div className="text-center mb-16">

      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Experience the Local Heartbeat</h2>

      <p className="text-xl text-gray-600 max-w-3xl mx-auto">

       Connect directly with tribal artisans, find unique homestays, and join local events.

      </p>

     </div>

     <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

      {marketplaceItems.map((item, index) => (

       <motion.div

        key={item.title}

        className="group relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"

        initial={{ opacity: 0, y: 50 }}

        whileInView={{ opacity: 1, y: 0 }}

        transition={{ duration: 0.6, delay: index * 0.15 }}

       >

        <div className="mb-4">{item.icon}</div>

        <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>

        <p className="text-gray-600 mb-4">{item.description}</p>

        <Link to={item.link} className="font-semibold text-emerald-600 hover:text-emerald-800 transition-colors">

         Explore More <span className="inline-block transition-transform group-hover:translate-x-1">→</span>

        </Link>

       </motion.div>

      ))}

     </div>

    </div>

   </section>

   {/* Features Section */}

   <section className="py-16 bg-white">

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

     <div className="text-center mb-16">

      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Revolutionary Tourism Features</h2>

      <p className="text-xl text-gray-600 max-w-3xl mx-auto">Experience Jharkhand like never before with cutting-edge technology and local expertise</p>

     </div>

     <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

      {features.map((feature, index) => (

       <motion.div

        key={index}

        className="bg-gray-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform group"

        initial={{ opacity: 0, y: 50 }}

        whileInView={{ opacity: 1, y: 0 }}

        transition={{ duration: 0.6, delay: index * 0.2 }}

        whileHover={{ scale: 1.05 }}

       >

        <div className="text-emerald-600 mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>

        <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>

        <p className="text-gray-600">{feature.description}</p>

       </motion.div>

      ))}

     </div>

    </div>

   </section>

   {/* Statistics Section */}

   <section className="py-16 bg-emerald-600 text-white">

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

     <div className="grid text-center md:grid-cols-4 gap-8">

      {stats.map((stat, index) => (

       <motion.div

        key={index}

        initial={{ opacity: 0, scale: 0.5 }}

        whileInView={{ opacity: 1, scale: 1 }}

        transition={{ duration: 0.6, delay: index * 0.2 }}

       >

        <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>

        <div className="text-xl text-emerald-100">{stat.label}</div>

       </motion.div>

      ))}

     </div>

    </div>

   </section>

   {/* Call to Action Section */}

   <section className="relative py-20 bg-cover bg-center" style={{ backgroundImage: "url('Images/patratu-valley-ranchi-jharkhand-1-hero.jpg')" }}>

    <div className="absolute inset-0 bg-emerald-900/80 backdrop-blur-sm"></div>

    <div className="relative max-w-4xl mx-auto text-center px-4">

     <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Plan Your Adventure?</h2>

     <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">

      Let our AI-powered planner create the perfect itinerary for your trip to Jharkhand. Discover hidden gems, book certified guides, and experience the local culture like never before.

     </p>

     <Link

      to="/planner"

      className="bg-white text-emerald-700 hover:bg-emerald-50 px-10 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-xl"

     >

      Create My Itinerary

     </Link>

    </div>

   </section>

   {/* Footer */}

   <footer className="bg-emerald-900 text-white py-8">

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

     <p>© 2025 Jharkhand Tourism. All rights reserved.</p>

    </div>

   </footer>

  </div>

 );

};

export default LandingPage;

































