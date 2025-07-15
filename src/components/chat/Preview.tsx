'use client';

import { cn } from '@/lib/utils';
import { useState } from 'react';
import { motion } from "motion/react";
import { Button } from '@/components/ui/button';
import { usePreviewUrlStore } from '@/store/previewUrlStore';

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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';


const MenuDropDown = ({
  onRefresh,
  onRestart,
  isRefreshing
}: { onRefresh: () => void; onRestart: () => void; isRefreshing: boolean }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white">
        <MoreVertical size={16} />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-48">
      <DropdownMenuItem onClick={onRefresh} disabled={isRefreshing}>
        <RotateCcw size={14} className={cn('text-blue-400', isRefreshing && 'animate-spin')} />
        Reload page
      </DropdownMenuItem>
      <DropdownMenuItem onClick={onRestart}>
        <Square size={14} className="text-orange-400" />
        Restart dev server
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <Download size={14} className="text-green-400" />
        Download
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Share size={14} className="text-purple-400" />
        Share
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const LoadingOverlay = ({ progress }: { progress: number }) => (
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
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
    </div>
  </motion.div>
);

const ErrorState = ({ error, onRetry }: { error: string, onRetry: () => void }) => (
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
      <Button
        onClick={onRetry}
        variant="destructive"
        className="shadow-lg"
        asChild
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Try Again
        </motion.button>
      </Button>
    </div>
  </motion.div>
);

const TopBar = ({
  onRefresh,
  onRestart,
  isRefreshing
}: { onRefresh: () => void; onRestart: () => void; isRefreshing: boolean }) => (
  <motion.div
    className="h-12 bg-gradient-to-r from-neutral-900/90 to-neutral-800/90 backdrop-blur-sm border-b border-neutral-700/50 flex items-center justify-between px-4"
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 cursor-pointer transition-colors" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 cursor-pointer transition-colors" />
        <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 cursor-pointer transition-colors" />
      </div>
      {/* Navigation controls */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white">
          <ChevronLeft size={16} />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white">
          <ChevronRight size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-white"
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <RotateCcw size={16} className={cn(isRefreshing && 'animate-spin')} />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white">
          <Home size={16} />
        </Button>
      </div>

      {/* Address bar*/}
      <div className="flex items-center gap-2 bg-neutral-800 rounded-lg px-3 py-1.5 min-w-[200px] border border-neutral-700/50">
        <Globe size={14} className="text-blue-400" />
        <span className="text-sm text-white font-mono">localhost:3000</span>
      </div>
    </div>
    <MenuDropDown onRefresh={onRefresh} onRestart={onRestart} isRefreshing={isRefreshing} />
  </motion.div>
);

export default function Preview() {
  const previewUrl = usePreviewUrlStore(state => state.previewUrl)
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState({
    isLoading: previewUrl === '',
    progress: 0
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const simulateLoading = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      const clampedProgress = Math.min(progress, 100);

      setLoading(prev => ({ ...prev, progress: clampedProgress }));

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsRefreshing(false);
          setLoading({ isLoading: false, progress: 0 });
        }, 200);
      }
    }, 100);

    return interval;
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setLoading({ isLoading: true, progress: 0 });
    setError(null);
    simulateLoading();
  };

  const handleRestart = () => {
    setError(null);
    console.log('Restarting dev server...');
    handleRefresh();
  };

  const handleIframeError = () => {
    setError('Failed to load preview. Please check your code for errors.');
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] border border-neutral-800/50 relative overflow-hidden">
      <TopBar
        onRefresh={handleRefresh}
        onRestart={handleRestart}
        isRefreshing={isRefreshing}
      />

      <div className="flex-1 bg-white relative overflow-hidden">
        {loading.isLoading ? (
          <>
            <motion.div
              className="h-1 bg-neutral-800"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${loading.progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </motion.div>
            <LoadingOverlay progress={loading.progress} />
          </>
        ) : error ? (
          <ErrorState error={error} onRetry={handleRefresh} />
        ) : (
          <div className="relative w-full h-full">
            <motion.iframe
              src={previewUrl}
              className="w-full h-full border-none"
              onError={handleIframeError}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          </div>
        )}
      </div>
    </div >
  );
}