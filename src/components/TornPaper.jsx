import { motion } from "framer-motion";

const TornPaper = () => {
  return (
    <div className="relative w-full bg-black py-24 overflow-hidden">
      {/* Top torn edge */}
      <div className="absolute top-0 left-0 w-full h-16 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0wLDAgTDEwMCwwIEwxMDAsMTAwIEwwLDEwMCBaIiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==')] bg-repeat-x transform rotate-180" />
      
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="container mx-auto px-4"
      >
        <div className="max-w-5xl mx-auto">
          {/* Small decorative element */}
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "60px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-1 bg-white mb-8"
          />
          
          {/* Main heading with staggered animation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-6xl font-bold text-white mb-8 tracking-tight">
              WELCOME <br />
              TO OUR EXCLUSIVE <br />
              NFT COLLECTION
            </h2>
          </motion.div>

          {/* Description text */}
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-gray-300 text-lg max-w-2xl"
          >
            Discover unique digital artworks curated by leading artists from around the globe. 
            Each piece in our collection represents the pinnacle of digital creativity and innovation.
          </motion.p>

          {/* Call to action button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12"
          >
            <button className="group relative px-8 py-3 bg-white text-black rounded-full hover:bg-gray-100 transition-colors duration-300">
              Explore Collection
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300">
                →
              </span>
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom torn edge */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0wLDAgTDEwMCwwIEwxMDAsMTAwIEwwLDEwMCBaIiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==')] bg-repeat-x" />
    </div>
  );
};

export default TornPaper;