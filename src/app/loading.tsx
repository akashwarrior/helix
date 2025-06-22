export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-slate-950 via-purple-950/50 to-slate-950">
      <div className="absolute inset-0 overflow-hidden">
        <div className="loading-orb loading-orb-1 absolute top-1/4 -left-48 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="loading-orb loading-orb-2 absolute bottom-1/4 -right-48 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="loading-orb loading-orb-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        <div className="mb-12 loading-logo relative flex items-center justify-center">
          <h1 className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 loading-gradient-text">
            HELIX
          </h1>
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 blur-3xl opacity-30 loading-glow" />
        </div>

        <span className="loading-ellipsis">Loading</span>

        <div className="mt-8 loading-spinner">
          <div className="w-16 h-16 relative">
            <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full animate-spin" />
            <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full loading-rotate animate-spin rotate-90" />
            <div className="absolute inset-2 border-2 border-transparent border-t-blue-500 rounded-full loading-rotate-reverse animate-spin" />
          </div>
        </div>
      </div>
    </div>
  );
}
