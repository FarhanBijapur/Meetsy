"use client";

import { motion, MotionProps } from "motion/react";
import { forwardRef, HTMLAttributes } from "react";

interface MotionDivProps
  extends Omit<HTMLAttributes<HTMLDivElement>, keyof MotionProps>,
    MotionProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  viewport?: { once?: boolean; margin?: string; amount?: number };
}

export const MotionDiv = forwardRef<HTMLDivElement, MotionDivProps>(
  (
    {
      children,
      delay = 0,
      duration = 0.5,
      initial = { opacity: 0, y: 20 },
      whileInView = { opacity: 1, y: 0 },
      viewport = { once: true, margin: "-100px" },
      transition = { duration, delay },
      ...props
    },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        initial={initial}
        whileInView={whileInView}
        viewport={viewport}
        transition={transition}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

MotionDiv.displayName = "MotionDiv";
