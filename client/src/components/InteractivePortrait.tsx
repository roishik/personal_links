import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface TrailPoint {
  x: number;
  y: number;
  timestamp: number;
  velocity: number;
}

export default function InteractivePortrait() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const lastPosition = useRef({ x: 0, y: 0, time: Date.now() });

  // Raw cursor position
  const mouseX = useMotionValue(160); // Center of 320px
  const mouseY = useMotionValue(160);

  // Smoothed cursor position with organic lag
  const smoothX = useSpring(mouseX, { damping: 25, stiffness: 200 });
  const smoothY = useSpring(mouseY, { damping: 25, stiffness: 200 });

  // Parallax transforms (opposite direction, subtle - limited to prevent edge overflow)
  const parallaxX = useTransform(smoothX, [0, 320], [3, -3]);
  const parallaxY = useTransform(smoothY, [0, 320], [3, -3]);

  // Handle mouse move
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate velocity
    const now = Date.now();
    const dt = now - lastPosition.current.time;
    const dx = x - lastPosition.current.x;
    const dy = y - lastPosition.current.y;
    const velocity = dt > 0 ? Math.sqrt(dx * dx + dy * dy) / dt : 0;

    // Update motion values
    mouseX.set(x);
    mouseY.set(y);

    // Add to trail
    setTrail((prev) => {
      const newTrail = [
        ...prev,
        { x, y, timestamp: now, velocity: Math.min(velocity * 10, 1) },
      ].slice(-8); // Keep last 8 points
      return newTrail;
    });

    lastPosition.current = { x, y, time: now };
  }, [mouseX, mouseY]);

  // Clean up old trail points
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setTrail((prev) => prev.filter((p) => now - p.timestamp < 300));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    setIsHovering(false);
    setTrail([]);
  };

  return (
    <motion.div
      ref={containerRef}
      className="relative w-80 h-80 rounded-full overflow-hidden cursor-none shadow-2xl"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Base layer - Suit image (revealed) */}
      <motion.img
        src="/roi_shikler_suit.png"
        alt="Roi Shikler - Suit"
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          x: parallaxX,
          y: parallaxY,
        }}
      />

      {/* Masked layer - Regular image (default visible, masked by blob) */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 320 320"
        style={{ overflow: "visible" }}
      >
        <defs>
          {/* Blur filter for soft blob edges */}
          <filter id="blobBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
          </filter>

          {/* The mask - white areas are visible, black areas reveal underneath */}
          <mask id="revealMask">
            {/* Full white rectangle (shows regular image everywhere) */}
            <rect x="0" y="0" width="320" height="320" fill="white" />

            {/* Trail blobs (black circles that reveal suit) */}
            {isHovering &&
              trail.map((point, index) => {
                const age = (Date.now() - point.timestamp) / 300; // 0 to 1
                const opacity = Math.max(0, 1 - age) * 0.6;
                const size = 30 + point.velocity * 20;
                return (
                  <circle
                    key={`trail-${index}`}
                    cx={point.x}
                    cy={point.y}
                    r={size * (1 - age * 0.5)}
                    fill={`rgba(0, 0, 0, ${opacity})`}
                    filter="url(#blobBlur)"
                  />
                );
              })}

            {/* Main blob (black circle that reveals suit) */}
            {isHovering && (
              <motion.circle
                cx={smoothX}
                cy={smoothY}
                r={50}
                fill="black"
                filter="url(#blobBlur)"
              />
            )}
          </mask>
        </defs>

        {/* Regular image with mask applied */}
        <motion.image
          href="/roi_shikler.png"
          x="0"
          y="0"
          width="320"
          height="320"
          mask="url(#revealMask)"
          preserveAspectRatio="xMidYMid slice"
          style={{
            x: parallaxX,
            y: parallaxY,
          }}
        />
      </svg>

      {/* Text overlay with inversion effect */}
      <motion.div
        className="absolute inset-0 flex items-end justify-center pb-8 pointer-events-none"
        style={{
          x: parallaxX,
          y: parallaxY,
        }}
      >
        <h2
          className="text-2xl font-bold tracking-wide mix-blend-difference text-white drop-shadow-lg transition-all duration-300"
          style={{
            textShadow: "0 2px 10px rgba(0,0,0,0.3)",
          }}
        >
          Roi Shikler
        </h2>
      </motion.div>

      {/* Subtle vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none rounded-full"
        style={{
          background:
            "radial-gradient(circle, transparent 50%, rgba(0,0,0,0.1) 100%)",
        }}
      />

      {/* Custom cursor indicator when hovering */}
      {isHovering && (
        <motion.div
          className="absolute w-4 h-4 rounded-full border-2 border-white/80 pointer-events-none mix-blend-difference"
          style={{
            x: smoothX,
            y: smoothY,
            translateX: "-50%",
            translateY: "-50%",
          }}
        />
      )}
    </motion.div>
  );
}
