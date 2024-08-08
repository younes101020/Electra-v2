"use client";
import React from "react";

import { AnimatePresence, motion } from "framer-motion";
import { CanvasRevealEffect } from "./ui/canvas-reveal-effect";

export function CanvasRevealEffectDemo3() {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative mx-auto flex h-[40rem] w-full flex-col items-center justify-center gap-4 overflow-hidden px-8 lg:flex-row"
    >
      <p className="relative z-20 mx-auto max-w-2xl text-center text-2xl font-thin md:text-2xl">
        Connectée vous avec des <span className="font-medium">centaines de fan</span> qui comme vous
        partagent la même passion pour <span className="font-medium">les films.</span>
      </p>
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 h-full w-full"
          >
            <CanvasRevealEffect
              animationSpeed={5}
              containerClassName="bg-transparent"
              colors={[
                [255, 204, 21],
                [51, 23, 6],
              ]}
              opacities={[0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.4, 0.4, 0.4, 1]}
              dotSize={2}
            />
          </motion.div>
        )}
      </AnimatePresence>
      {/* Radial gradient for the cute fade */}
      <div className="absolute inset-0 bg-primary/10 [mask-image:radial-gradient(400px_at_center,white,transparent)]" />
    </div>
  );
}
