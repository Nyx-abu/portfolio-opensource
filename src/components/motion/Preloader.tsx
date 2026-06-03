"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    if (sessionStorage.getItem("preloader_done")) {
      setIsLoading(false);
      return;
    }
    
    // Cinematic delay
    const timer = setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem("preloader_done", "true");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (pathname?.startsWith("/admin")) return null;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.5 }
    }
  };

  const item = {
    hidden: { y: "100%" },
    show: { y: "0%", transition: { duration: 0.8, ease: [0.7, 0, 0.2, 1] } },
    exit: { y: "-100%", transition: { duration: 0.5, ease: [0.7, 0, 0.2, 1] } }
  };

  const nameParts = ["A", "bdur", " Raheem", "."];

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          key="preloader"
          initial={{ y: "0%" }}
          exit={{ y: "-100%" }}
          transition={{ duration: 1, ease: [0.7, 0, 0.2, 1], delay: 0.4 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-ink-950"
        >
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            exit="exit"
            className="flex items-center text-display-md sm:text-display-lg md:text-display-xl font-display text-paper tracking-tighter"
          >
            {nameParts.map((part, i) => (
              <div key={i} className="overflow-hidden">
                <motion.span 
                  variants={item}
                  className={`inline-block ${i === 3 ? "text-accent" : ""}`}
                >
                  {part}
                </motion.span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
