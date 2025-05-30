// SlideIn.tsx
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";

interface SlideInProps {
  children: React.ReactNode;
  direction?: "left" | "right" | "up" | "down";
  delay?: number;
}

const directionMap = {
  left: { x: -50, y: 0 },
  right: { x: 50, y: 0 },
  up: { x: 0, y: -50 },
  down: { x: 0, y: 50 },
};

const SlideIn = ({ children, direction = "up", delay = 0 }: SlideInProps) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (inView && !hasAnimated) setHasAnimated(true);
  }, [inView, hasAnimated]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...directionMap[direction] }}
      animate={hasAnimated ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
};

export default SlideIn;
