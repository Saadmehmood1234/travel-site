"use client";

import { motion } from "framer-motion";

export function GlobalLoader() {
  return (
    <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-6">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-6 h-6 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
              style={{
                left: `${Math.sin((i * Math.PI) / 2) * 30 + 36}px`,
                top: `${Math.cos((i * Math.PI) / 2) * 30 + 36}px`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 0,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
        <motion.h3
          className="text-xl font-semibold text-gray-800"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Crafting Your Journey
        </motion.h3>
        <motion.p
          className="text-gray-500 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Loading the best travel experiences...
        </motion.p>
      </div>
    </div>
  );
}

export function ContentLoader() {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="rounded-full bg-gray-200 h-12 w-12 animate-pulse"></div>
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-video bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SectionLoader() {
  return (
    <div className="py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-4 text-center">
          <div className="h-6 bg-gray-200 rounded w-1/4 mx-auto animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
          <div className="h-5 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-square bg-gray-200 rounded-xl animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CardLoader() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="rounded-full bg-gray-200 h-10 w-10 animate-pulse"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          </div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
      </div>
    </div>
  );
}

export function ButtonLoader() {
  return (
    <div className="inline-flex items-center px-4 py-2 rounded-md bg-gray-200 animate-pulse">
      <div className="h-4 w-20 bg-gray-300 rounded"></div>
    </div>
  );
}
