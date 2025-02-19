import React from 'react';
import { motion } from 'framer-motion';
import { Images } from "../constant";
import Navbar from '../components/navbar';
import { IoIosArrowRoundForward } from "react-icons/io";
import { Helmet } from "react-helmet";
import { Hash } from 'lucide-react';
import Footer from '../components/footer';

const Landing = () => {
    const keywords = [
        "Designer toys", "Collectible figures", "Limited edition toys", "Art toys", "Vinyl figures",
        "KAWS collectible", "KAWS Companion", "KAWS figure", "KAWS statue", "KAWS art toy",
        "Bearbrick 100%", "Bearbrick 400%", "Bearbrick 1000%", "Bearbrick limited edition", "Bearbrick Medicom",
        "Bearbrick collaboration", "Bearbrick collectible", "Bearbrick designer toy", "Bearbrick custom", "Bearbrick KAWS",
        "Art tableau", "Wall art", "Modern painting", "Pop art canvas", "Urban street art"
    ];
      
    const scrollingKeywords = [...keywords, ...keywords];

    const fadeInUp = {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className='bg-gradient-to-r from-black via-[#280239] to-black'
        >
            <Helmet>
                <link rel="icon" type="image/png" href={Images.logo} sizes="280x280" />
            </Helmet>

            <div className='relative'>
                <div className='bg-[#000] relative'>   
                    <Navbar />

                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="absolute bottom-40 ms-96 text-white text-lg"
                    >
                        <p>Explore a stylish selection of Bearbrick collectibles, from fashion collabs to <br /> limited-edition art pieces. Find your next statement piece today</p>

                        <motion.div 
                            className='flex space-x-1 items-center mt-5'
                            whileHover={{ scale: 1.05 }}
                        >
                            <button className='ms-8 bg-white px-4 py-2 rounded-full hover:bg-zinc-800 text-zinc-900 transition duration-500 hover:text-white'>
                                Shop Now
                            </button> 
                            <button className='bg-white px-2 py-2 hover:bg-zinc-800 transition duration-500 hover:text-white rounded-full text-zinc-900 text-2xl'>
                                <IoIosArrowRoundForward />
                            </button>
                        </motion.div>
                    </motion.div>

                    <motion.img 
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.2 }}
                        src={Images.lnding1} 
                        alt="" 
                        className='object-cover h-[100vh]'
                    />
                </div>

                <motion.section 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className='absolute top-[83vh] w-full overflow-x-hidden'
                >
                    <motion.img 
                        initial={{ y: 100 }}
                        whileInView={{ y: 0 }}
                        transition={{ duration: 0.8 }}
                        src={Images.section2} 
                        alt="" 
                        className='h-[110vh] w-full'
                    />
                     
                    <div className='pt-12 text-zinc-100 bg-gradient-to-r from-black via-[#280239] to-black'> 
                        <motion.div 
                            variants={staggerContainer}
                            initial="initial"
                            whileInView="animate"
                            className='flex justify-between'
                        >
                            <motion.div variants={fadeInUp}>
                                <h1 className='text-3xl ms-10 font-bold'>CHOOSE YOUR</h1>
                                <h1 className='text-3xl ms-24 font-bold'>FAVOURITE</h1>
                            </motion.div>
                            <motion.div 
                                variants={fadeInUp}
                                className='me-20 mt-20'
                            >
                                <button className='text-lg font-bold'>S<span className='border-b-2 border-white/50'>HOP NO</span>W</button>
                            </motion.div>
                        </motion.div>

                        <motion.div 
                            initial={{ x: 100, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            className='flex float-end me-5 mt-6'
                        >
                            <motion.img whileHover={{ scale: 1.05 }} src={Images.b1} className='h-[75vh]' alt="" />
                            <motion.img whileHover={{ scale: 1.05 }} src={Images.b2} className='h-[75vh]' alt="" />
                            <motion.img whileHover={{ scale: 1.05 }} src={Images.b3} className='h-[75vh]' alt="" />
                        </motion.div> 
                         
                        <div className="animate-scroll inline-flex pb-10 gap-4 whitespace-nowrap pt-16">
                            {scrollingKeywords.map((keyword, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.05 }}
                                    className="inline-flex items-center px-4 py-2 rounded-full bg-black/60 text-zinc-100 border border-white/50 shadow-sm"
                                >
                                    <Hash className="w-4 h-4 mr-2" />
                                    <span className="font-medium">{keyword}</span>
                                </motion.div>
                            ))}
                        </div>

                        <motion.section 
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className='pt-16 pb-28'
                        >
                            <motion.h1 
                                initial={{ scale: 0.9, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.6 }}
                                className='text-center text-zinc-100 text-7xl font-serif'
                            >
                                CHOOSE YOUR
                            </motion.h1>
                            <motion.h1 
                                initial={{ scale: 0.9, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className='text-center text-zinc-100 text-7xl font-serif pt-2'
                            >
                                FAVORITE
                            </motion.h1>
                            <motion.button 
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className='mt-4 ms-[43vw] px-10 py-2 border rounded-full border-zinc-100 font-bold'
                            >
                                NOW
                            </motion.button>
                        </motion.section>
              
                        <Footer/>
                    </div>
                </motion.section>
                 
                <div className='bg-gradient-to-r from-black via-[#280239] to-black h-[100vh]'></div>
            </div>        
        </motion.div>
    );
};

export default Landing;