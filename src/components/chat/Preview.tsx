'use client';

import { useState } from 'react';
import { motion } from "motion/react";
import {
  RotateCcw,
  Square,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Globe,
  Home,
  Download,
  Share,
  AlertCircle,
  Loader2
} from 'lucide-react';

export default function Preview() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setIsLoading(true);
    setError(null);
    setShowDropdown(false);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      setLoadProgress(Math.min(progress, 100));

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsRefreshing(false);
          setIsLoading(false);
          setLoadProgress(0);
        }, 200);
      }
    }, 100);
  };

  const handleRestart = () => {
    setError(null);
    console.log('Restarting dev server...');
    setShowDropdown(false);
    handleRefresh();
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] border border-neutral-800/50 relative overflow-hidden">
      {showDropdown && (
        <>
          <motion.div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="absolute top-12 right-4 z-20 glass-card bg-neutral-900/95 backdrop-blur-xl border border-neutral-700 rounded-xl shadow-2xl py-2 min-w-[180px]"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <motion.button
              onClick={handleRefresh}
              className="w-full text-left px-3 py-2 text-sm text-white hover:bg-neutral-800/50 transition-all duration-200 flex items-center gap-2"
              disabled={isRefreshing}
              whileHover={{ x: 2 }}
            >
              <RotateCcw size={14} className={`text-blue-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Reload page</span>
            </motion.button>
            <motion.button
              onClick={handleRestart}
              className="w-full text-left px-3 py-2 text-sm text-white hover:bg-neutral-800/50 transition-all duration-200 flex items-center gap-2"
              whileHover={{ x: 2 }}
            >
              <Square size={14} className="text-orange-400" />
              <span>Restart dev server</span>
            </motion.button>
            <div className="h-px bg-neutral-700 my-1"></div>
            <motion.button
              className="w-full text-left px-3 py-2 text-sm text-white hover:bg-neutral-800/50 transition-all duration-200 flex items-center gap-2"
              whileHover={{ x: 2 }}
            >
              <Download size={14} className="text-green-400" />
              <span>Download</span>
            </motion.button>
            <motion.button
              className="w-full text-left px-3 py-2 text-sm text-white hover:bg-neutral-800/50 transition-all duration-200 flex items-center gap-2"
              whileHover={{ x: 2 }}
            >
              <Share size={14} className="text-purple-400" />
              <span>Share</span>
            </motion.button>
          </motion.div>
        </>
      )}

      {/* Clean Browser Header */}
      <motion.div
        className="h-12 bg-gradient-to-r from-neutral-900/90 to-neutral-800/90 backdrop-blur-sm border-b border-neutral-700/50 flex items-center justify-between px-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200" />
            <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200" />
          </div>

          <div className="flex items-center gap-1">
            <motion.button
              className="p-2 text-muted-foreground hover:text-white hover:bg-neutral-800/50 rounded-lg transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft size={16} />
            </motion.button>
            <motion.button
              className="p-2 text-muted-foreground hover:text-white hover:bg-neutral-800/50 rounded-lg transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight size={16} />
            </motion.button>
            <motion.button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 text-muted-foreground hover:text-white hover:bg-neutral-800/50 rounded-lg transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            </motion.button>
            <motion.button
              className="p-2 text-muted-foreground hover:text-white hover:bg-neutral-800/50 rounded-lg transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home size={16} />
            </motion.button>
          </div>

          <motion.div
            className="flex items-center gap-2 bg-neutral-800 rounded-lg px-3 py-1.5 min-w-3xs border border-neutral-700/50"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <Globe size={14} className="text-blue-400" />
            <span className="text-sm text-white font-mono">localhost:3000</span>
          </motion.div>
        </div>

        <motion.button
          onClick={() => setShowDropdown(!showDropdown)}
          className="p-2 text-muted-foreground hover:text-white hover:bg-neutral-800/50 rounded-lg transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <MoreVertical size={16} />
        </motion.button>
      </motion.div>

      {isLoading && (
        <motion.div
          className="h-1 bg-neutral-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${loadProgress}%` }}
            transition={{ duration: 0.1 }}
          />
        </motion.div>
      )}

      <div className="flex-1 bg-white relative overflow-hidden">
        {error ? (
          <motion.div
            className="h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center max-w-md mx-auto p-8">
              <motion.div
                className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-red-200"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <AlertCircle size={32} className="text-red-500" />
              </motion.div>
              <motion.h3
                className="text-xl font-bold text-gray-800 mb-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Preview Error
              </motion.h3>
              <motion.p
                className="text-gray-600 mb-6 leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {error}
              </motion.p>
              <motion.button
                onClick={handleRefresh}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 font-medium shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Try Again
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <div className="relative w-full h-full">
            {isRefreshing ? (
              <motion.div
                className="absolute inset-0 bg-white/95 backdrop-blur-sm z-10 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col items-center gap-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 size={32} className="text-blue-600" />
                  </motion.div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Refreshing preview...</h3>
                    <p className="text-sm text-gray-600">Loading your app</p>
                  </div>
                  <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${loadProgress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.iframe
                src="http://localhost:3000/welcome"
                className="w-full h-full border-none"
                onError={() => setError('Failed to load preview. Please check your code for errors.')}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}