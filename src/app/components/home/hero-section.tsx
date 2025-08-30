"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  FiArrowRight,
  FiSearch,
  FiMapPin,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import Link from "next/link";

const destinations = [
  {
    id: 1,
    title: "Experience Singapore",
    subtitle: "Urban adventures from ₹ 24,999",
    highlight: "Singapore",
    image: "/singapore.png",
    cta: "Find Singapore Deals",
  },
  {
    id: 2,
    title: "Discover Azerbaijan",
    subtitle: "Caucasus gems from ₹25,999",
    highlight: "Azerbaijan",
    image: "/azerbaijan.png",
    cta: "Find Azerbaijan Deals",
  },
  {
    id: 3,
    title: "Explore Kazakhstan",
    subtitle: "Steppe adventures from ₹34,999",
    highlight: "Kazakhstan",
    image: "/kazakhstan.png",
    cta: "Find Kazakhstan Deals",
  },
  {
    id: 4,
    title: "Experience Dubai",
    subtitle: "Luxury escapes from ₹24,999",
    highlight: "Dubai",
    image: "/dubai.png",
    cta: "Find Dubai Deals",
  },
  {
    id: 5,
    title: "Discover Bali",
    subtitle: "Tropical escapes from ₹14,999",
    highlight: "Bali",
    image: "/bali.png",
    cta: "Find Bali Deals",
  },
  {
    id: 6,
    title: "Experience Hong Kong",
    subtitle: "Vibrant city life from ₹54,999",
    highlight: "Hong Kong",
    image: "/hongkong.png",
    cta: "Find Hong Kong Deals",
  },
];

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isHovering, setIsHovering] = useState(false);
  const [ref, inView] = useInView({ threshold: 0.1 });

  useEffect(() => {
    if (isHovering) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) =>
        prev === destinations.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isHovering]);

  const currentDestination = destinations[currentIndex];

  const goToNext = () => {
    setDirection(1);
    setCurrentIndex((prev) =>
      prev === destinations.length - 1 ? 0 : prev + 1
    );
  };

  const goToPrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) =>
      prev === 0 ? destinations.length - 1 : prev - 1
    );
  };

  return (
    <section
      ref={ref}
      className="relative h-screen max-h-[700px] w-full overflow-hidden mt-[70px]"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="absolute inset-0">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentDestination.id}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${currentDestination.image})` }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
      </div>
      <div className="relative z-10 flex h-full items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl lg:max-w-3xl xl:max-w-4xl">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentDestination.id}
                custom={direction}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <motion.h1
                  className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {currentDestination.title}
                </motion.h1>

                <motion.p
                  className="text-xl md:text-2xl text-white/90 mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  {currentDestination.subtitle}
                </motion.p>

                <motion.div
                  className="bg-white/10 backdrop-blur-md inline-block px-4 py-2 rounded-full mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <span className="text-white font-medium">
                    {currentDestination.highlight}
                  </span>
                </motion.div>

                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Link href="/destinations">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold flex items-center gap-2 text-lg shadow-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 }}
                    >{currentDestination.cta}
                      <FiArrowRight className="text-xl" />
                    </motion.button>
                  </Link>

                  {/* <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="bg-transparent border-2 border-white/30 hover:border-white/60 text-white px-6 py-4 rounded-full font-medium flex items-center gap-2 text-lg backdrop-blur-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 }}
                  >
                    Learn More
                  </motion.button> */}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 z-10">
        <button
          onClick={goToPrev}
          className="p-3 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm transition-all"
          aria-label="Previous slide"
        >
          <FiChevronLeft className="text-2xl" />
        </button>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center pr-4 z-10">
        <button
          onClick={goToNext}
          className="p-3 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm transition-all"
          aria-label="Next slide"
        >
          <FiChevronRight className="text-2xl" />
        </button>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {destinations.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-white w-6"
                : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
