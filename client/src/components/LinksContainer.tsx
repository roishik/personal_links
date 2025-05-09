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
    <div className="w-full space-y-4">
      {/* LinkedIn Link */}
      <LinkCard
        href="https://www.linkedin.com/in/roishikler"
        icon={<SiLinkedin className="h-5 w-5 text-primary" />}
        label="LinkedIn"
        delay={0.1}
        iconBgColor="bg-blue-100"
      />
      
      {/* GitHub Link */}
      <LinkCard
        href="https://github.com/roishik"
        icon={<SiGithub className="h-5 w-5 text-gray-800" />}
        label="GitHub"
        delay={0.15}
        iconBgColor="bg-gray-100"
      />
      
      {/* Thoughts & Writings Section */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="relative mt-8 mb-4"
      >
        <div className="absolute -top-3 left-0 right-0 flex justify-center">
          <span className="relative z-10 px-3">
            <span className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white opacity-95"></span>
            <span className="relative text-md font-medium text-gray-700">Thoughts & Writings</span>
          </span>
        </div>
        <div className="border border-gray-200 rounded-xl p-4 pt-6">
          {/* Financial Blogs (Side by Side) */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              whileHover={{ y: -3 }}
            >
              <Button 
                asChild
                variant="ghost"
                className="w-full h-full p-4 bg-card hover:bg-card hover:shadow-md transition-all border border-gray-100"
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
                  <span className="font-medium text-sm text-gray-800">Personal Finance (Heb)</span>
                </a>
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              whileHover={{ y: -3 }}
            >
              <Button 
                asChild
                variant="ghost"
                className="w-full h-full p-4 bg-card hover:bg-card hover:shadow-md transition-all border border-gray-100"
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
                  <span className="font-medium text-sm text-gray-800">Fintech Israel (Heb)</span>
                </a>
              </Button>
            </motion.div>
          </div>
          
          {/* AI & Autonomous Vehicles Blog */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <LinkCard
              href="https://roishikler.substack.com/"
              icon={<SiSubstack className="h-5 w-5 text-orange-600" />}
              label="AI & Autonomous Vehicles"
              showArrow={true}
              iconBgColor="bg-orange-100"
              className="border border-gray-100"
            />
          </motion.div>
        </div>
      </motion.div>
      
      
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
            href="mailto:roishik10@gmail.com?subject=Hey%20Roi%2C%20Let's%20Connect!&body=Hi%20Roi%2C%0A%0AI%20found%20your%20profile%20through%20your%20links%20page%20and%20would%20love%20to%20connect.%20Looking%20forward%20to%20hearing%20from%20you!%0A%0ABest%20regards"
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
