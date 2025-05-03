import { motion } from "framer-motion";
import ProfileSection from "@/components/ProfileSection";
import LinksContainer from "@/components/LinksContainer";
import ChatBot from "@/components/ChatBot";
import CardCarousel from "@/components/CardCarousel";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-foreground flex flex-col items-center py-10 px-4 relative">
      {/* Background Decoration */}
      <div className="absolute top-0 inset-x-0 h-40 bg-primary/5 -z-10"></div>
      <div className="absolute top-0 left-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -z-10 transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute top-1/4 right-0 w-60 h-60 bg-primary/10 rounded-full blur-3xl -z-10 transform translate-x-1/3"></div>
      
      {/* Content */}
      <div className="container mx-auto z-10">
        <div className="max-w-xl mx-auto">
          <ProfileSection />
        </div>
        <div className="max-w-md mx-auto">
          <LinksContainer />
        </div>
        
        {/* Card Carousel */}
        <div className="mt-16">
          <CardCarousel />
        </div>
      </div>
      
      {/* Chatbot */}
      <ChatBot />
    </div>
  );
}
