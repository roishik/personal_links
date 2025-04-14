import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfileSection() {
  return (
    <motion.div 
      className="w-full max-w-md mx-auto flex flex-col items-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative w-32 h-32 mb-4">
        <Avatar className="w-32 h-32 border-4 border-primary/20 shadow-lg">
          <AvatarImage 
            src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" 
            alt="Roi Shik" 
          />
          <AvatarFallback>RS</AvatarFallback>
        </Avatar>
      </div>
      <h1 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Roi Shik</h1>
      <p className="text-gray-600 text-center max-w-sm mb-6 leading-relaxed">
        Software engineer passionate about finance, autonomous vehicles, and artificial intelligence. This is my personal space with links to my professional profiles and blogs.
      </p>
    </motion.div>
  );
}
