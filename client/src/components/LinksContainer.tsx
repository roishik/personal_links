import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import LinkCard from "@/components/LinkCard";
import { motion } from "framer-motion";
import { 
  Mail, 
  BarChart3,
  DollarSign
} from "lucide-react";
import { 
  SiLinkedin, 
  SiGithub,
  SiSubstack
} from "react-icons/si";

export default function LinksContainer() {
  return (
    <div className="w-full max-w-md space-y-4">
      {/* LinkedIn Link */}
      <LinkCard
        href="https://www.linkedin.com/in/roishikler"
        icon={<SiLinkedin className="h-5 w-5 text-primary" />}
        label="LinkedIn"
        delay={0.1}
        iconBgColor="bg-blue-100"
      />
      
      {/* Financial Blogs (Side by Side) */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          whileHover={{ y: -3 }}
        >
          <Button 
            asChild
            className="w-full h-full p-4 bg-white hover:shadow-md transition-all border border-gray-100 hover:bg-white"
          >
            <a
              href="https://ofekalkali.wordpress.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center text-center"
            >
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
              </div>
              <span className="font-medium text-sm text-gray-800">Personal Finance</span>
            </a>
          </Button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          whileHover={{ y: -3 }}
        >
          <Button 
            asChild
            className="w-full h-full p-4 bg-white hover:shadow-md transition-all border border-gray-100 hover:bg-white"
          >
            <a
              href="https://fintechil.wordpress.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center text-center"
            >
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <span className="font-medium text-sm text-gray-800">Fintech Israel</span>
            </a>
          </Button>
        </motion.div>
      </div>
      
      {/* AI & Autonomous Vehicles Blog */}
      <LinkCard
        href="https://roishikler.substack.com/"
        icon={<SiSubstack className="h-5 w-5 text-orange-600" />}
        label="AI & Autonomous Vehicles"
        delay={0.3}
        iconBgColor="bg-orange-100"
      />
      
      {/* GitHub Link */}
      <LinkCard
        href="https://github.com/roishik"
        icon={<SiGithub className="h-5 w-5 text-gray-800" />}
        label="GitHub"
        delay={0.4}
        iconBgColor="bg-gray-100"
      />
      
      {/* Email Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        whileHover={{ y: -3 }}
      >
        <Button 
          asChild
          variant="default"
          className="w-full p-4 text-white rounded-xl shadow-sm hover:shadow-md transition-all"
        >
          <a
            href="mailto:roishik10@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2"
          >
            <Mail className="h-5 w-5" />
            <span className="font-medium">Email Me</span>
          </a>
        </Button>
      </motion.div>
    </div>
  );
}
