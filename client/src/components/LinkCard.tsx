import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

interface LinkCardProps {
  href: string;
  icon: ReactNode;
  label: string;
  delay?: number;
  className?: string;
  iconBgColor?: string;
  showArrow?: boolean;
}

export default function LinkCard({
  href,
  icon,
  label,
  delay = 0,
  className = "",
  iconBgColor = "bg-gray-100",
  showArrow = false
}: LinkCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -3 }}
    >
      <Card 
        className={`hover:shadow-md transition-all ${className}`}
        asChild={true}
      >
        <a 
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 flex items-center justify-between"
        >
          <div className="flex items-center">
            <div className={`w-10 h-10 ${iconBgColor} rounded-full flex items-center justify-center mr-3`}>
              {icon}
            </div>
            <span className="font-medium">{label}</span>
          </div>
          {showArrow && (
            <ChevronRight className="h-5 w-5 text-gray-400" />
          )}
        </a>
      </Card>
    </motion.div>
  );
}
