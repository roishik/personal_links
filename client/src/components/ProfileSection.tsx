import { motion } from "framer-motion";
import InteractivePortrait from "./InteractivePortrait";

export default function ProfileSection() {
  return (
    <motion.div
      className="w-full max-w-xl mx-auto flex flex-col items-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <InteractivePortrait />
      </div>
      <p className="text-gray-600 text-center max-w-xl mb-6 leading-relaxed">
        Engineer by training, product manager by profession. I'm driven by
        curiosity - especially around engineering, artificial intelligence, and
        everything in between. This page is a hub for my professional links and
        thoughts on the technologies shaping our future.
      </p>
    </motion.div>
  );
}
