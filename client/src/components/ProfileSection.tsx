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
        I'm an AI-first product manager who loves taking products from 0→1. My
        path runs through defense R&amp;D in the IDF, autonomous vehicles at
        Mobileye, and multi-agent AI infrastructure at Band — and along the way
        I've led and built deep-tech communities. Today I work as a freelancer —
        product consulting and building AI workflows and automations for (mainly)
        SMBs, to make them fitter for the new AI era. This page is a hub for my
        professional links and thoughts on the technologies shaping our future.
      </p>
    </motion.div>
  );
}
