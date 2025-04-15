import { motion } from "framer-motion";
import ProfileSection from "@/components/ProfileSection";
import LinksContainer from "@/components/LinksContainer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-foreground flex flex-col items-center py-10 px-4 relative">
      {/* Background Decoration */}
      <div className="absolute top-0 inset-x-0 h-40 bg-primary/5 -z-10"></div>
      <div className="absolute top-0 left-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -z-10 transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute top-1/4 right-0 w-60 h-60 bg-primary/10 rounded-full blur-3xl -z-10 transform translate-x-1/3"></div>
      
      {/* Content */}
      <div className="container mx-auto max-w-xl z-10">
        <ProfileSection />
        <LinksContainer />
        
        <motion.div 
          className="mt-10 pt-6 border-t border-gray-100 text-sm text-center text-gray-500"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <p>© {new Date().getFullYear()} Roi Shikler. All rights reserved.</p>
        </motion.div>
      </div>
    </div>
  );
}
