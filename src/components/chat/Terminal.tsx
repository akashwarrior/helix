'use client';

import { useState, useRef, useEffect } from 'react';
import { LazyMotion } from "motion/react";
import * as motion from "motion/react-m";
import {
  Terminal as TerminalIcon,
  Settings,
  Zap,
  Cpu,
  HardDrive,
  Wifi
} from 'lucide-react';

const domAnimation = () => import('motion/react').then(mod => mod.domAnimation);

interface CommandEntry {
  command: string;
  output: string[];
  timestamp: Date;
  status: 'success' | 'error' | 'warning';
}

export default function Terminal() {
  const [command, setCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<CommandEntry[]>([
    {
      command: 'npm create vite@latest todo-app -- --template react-ts',
      output: [
        '',
        'Need to install the following packages:',
        '  create-vite@5.0.0',
        'Ok to proceed? (y) y',
        '',
        '✔ Package installed successfully',
        ''
      ],
      timestamp: new Date(Date.now() - 120000),
      status: 'success'
    },
    {
      command: 'cd todo-app && npm install',
      output: [
        '',
        'added 213 packages, and audited 214 packages in 12s',
        '',
        '29 packages are looking for funding',
        '  run `npm fund` for details',
        '',
        'found 0 vulnerabilities',
        ''
      ],
      timestamp: new Date(Date.now() - 90000),
      status: 'success'
    },
    {
      command: 'npm install lucide-react framer-motion',
      output: [
        '',
        'added 2 packages, and audited 216 packages in 3s',
        '',
        'found 0 vulnerabilities',
        ''
      ],
      timestamp: new Date(Date.now() - 60000),
      status: 'success'
    },
    {
      command: 'npm run dev',
      output: [
        '',
        '  VITE v5.0.0  ready in 532 ms',
        '',
        '  ➜  Local:   http://localhost:3000/',
        '  ➜  Network: use --host to expose',
        '  ➜  press h + enter to show help',
        ''
      ],
      timestamp: new Date(Date.now() - 30000),
      status: 'success'
    }
  ]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [showSystemInfo, setShowSystemInfo] = useState(false);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commandHistory]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const newEntry: CommandEntry = {
        command: command.trim(),
        output: [],
        timestamp: new Date(),
        status: 'success'
      };

      // Simulate command responses
      if (command === 'clear') {
        setCommandHistory([]);
      } else if (command === 'ls' || command === 'dir') {
        newEntry.output = [
          'node_modules    package.json      public          src',
          'dist           tailwind.config.js tsconfig.json   vite.config.ts',
          ''
        ];
        setCommandHistory(prev => [...prev, newEntry]);
      } else if (command.startsWith('cd ')) {
        newEntry.output = [''];
        setCommandHistory(prev => [...prev, newEntry]);
      } else if (command === 'npm run build') {
        newEntry.output = [
          '',
          '> todo-app@1.0.0 build',
          '> vite build',
          '',
          'vite v5.0.0 building for production...',
          '✓ 34 modules transformed.',
          'dist/index.html                  0.46 kB │ gzip:  0.30 kB',
          'dist/assets/index-4f3d2d1a.css   1.30 kB │ gzip:  0.66 kB',
          'dist/assets/index-9c5d8b2e.js   143.61 kB │ gzip: 46.31 kB',
          '',
          '✓ built in 1.23s',
          ''
        ];
        setCommandHistory(prev => [...prev, newEntry]);
      } else if (command === 'help') {
        newEntry.output = [
          '',
          'Available commands:',
          '  ls, dir       - List directory contents',
          '  cd <path>     - Change directory',
          '  clear         - Clear terminal',
          '  npm run dev   - Start development server',
          '  npm run build - Build for production',
          '  help          - Show this help',
          '  exit          - Close terminal',
          ''
        ];
        setCommandHistory(prev => [...prev, newEntry]);
      } else if (command === 'exit') {
        newEntry.output = ['Goodbye! 👋'];
        setCommandHistory(prev => [...prev, newEntry]);
      } else {
        newEntry.output = [`bash: ${command}: command not found`];
        newEntry.status = 'error';
        setCommandHistory(prev => [...prev, newEntry]);
      }

      setIsTyping(false);
      setCommand('');
      setHistoryIndex(-1);
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const commands = commandHistory.map(entry => entry.command);
      if (historyIndex < commands.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCommand(commands[commands.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        const commands = commandHistory.map(entry => entry.command);
        setCommand(commands[commands.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommand('');
      }
    }
  };

  const getStatusColor = (status: CommandEntry['status']) => {
    switch (status) {
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      default: return 'text-gray-300';
    }
  };

  const formatOutput = (line: string) => {
    let className = 'text-gray-300';

    if (line.includes('✔') || line.includes('✓')) {
      className = 'text-green-400';
    } else if (line.includes('➜')) {
      className = 'text-blue-400 font-medium';
    } else if (line.includes('VITE')) {
      className = 'text-purple-400 font-bold';
    } else if (line.includes('http://')) {
      className = 'text-blue-400 underline cursor-pointer hover:text-blue-300 transition-colors';
    } else if (line.includes('error') || line.includes('Error') || line.includes('command not found')) {
      className = 'text-red-400';
    } else if (line.includes('warning') || line.includes('Warning')) {
      className = 'text-yellow-400';
    } else if (line.includes('added') || line.includes('packages') || line.includes('vulnerabilities')) {
      className = 'text-muted-foreground';
    } else if (line.includes('gzip') || line.includes('kB')) {
      className = 'text-cyan-400';
    }

    return className;
  };

  return (
    <LazyMotion features={domAnimation}>
      <div className="h-full flex flex-col bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] border border-neutral-800/50">
        {/* Enhanced Terminal Header */}
        <motion.div
          className="h-12 bg-gradient-to-r from-neutral-900/90 to-neutral-800/90 backdrop-blur-sm border-b border-neutral-700/50 flex items-center justify-between px-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <motion.div
                className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              />
              <motion.div
                className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              />
              <motion.div
                className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-neutral-800/50">
                  <TerminalIcon size={14} className="text-green-400" />
                </div>
                <span className="text-sm font-medium text-white">Terminal</span>
                <span className="text-xs text-muted-foreground">— zsh</span>
              </div>
            </div>
          </div>

          {/* Terminal Controls */}
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => setShowSystemInfo(!showSystemInfo)}
              className="p-2 text-muted-foreground hover:text-white hover:bg-neutral-800/50 rounded-lg transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Cpu size={14} />
            </motion.button>
            <motion.button
              className="p-2 text-muted-foreground hover:text-white hover:bg-neutral-800/50 rounded-lg transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings size={14} />
            </motion.button>
          </div>
        </motion.div>

        {/* System Info Bar */}
        {showSystemInfo && (
          <motion.div
            className="px-4 py-2 bg-neutral-900/60 border-b border-neutral-800/30 flex items-center justify-between text-xs"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Cpu size={12} className="text-blue-400" />
                <span className="text-gray-400">CPU: 12%</span>
              </div>
              <div className="flex items-center gap-1">
                <HardDrive size={12} className="text-green-400" />
                <span className="text-gray-400">Memory: 2.1GB</span>
              </div>
              <div className="flex items-center gap-1">
                <Wifi size={12} className="text-purple-400" />
                <span className="text-gray-400">Network: Active</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Zap size={12} className="text-yellow-400" />
              <span className="text-gray-400">Power: AC</span>
            </div>
          </motion.div>
        )}

        {/* Terminal Content */}
        <div
          ref={terminalRef}
          className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] font-mono text-sm leading-relaxed"
        >
          {/* Command History */}
          {commandHistory.map((entry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="mb-4"
            >
              {/* Command */}
              <div className="flex items-center gap-2 mb-1">
                <span className="text-emerald-400 font-medium">$</span>
                <span className={`font-medium ${getStatusColor(entry.status)}`}>
                  {entry.command}
                </span>
                <span className="text-xs text-gray-500 ml-auto">
                  {entry.timestamp.toLocaleTimeString()}
                </span>
              </div>

              {/* Output */}
              {entry.output.map((line, lineIndex) => (
                <motion.div
                  key={lineIndex}
                  className={formatOutput(line)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: lineIndex * 0.05 }}
                >
                  {line || '\u00A0'}
                </motion.div>
              ))}
            </motion.div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              className="flex items-center gap-2 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <span className="text-emerald-400 font-medium">$</span>
              <div className="flex items-center gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1 h-1 bg-emerald-400 rounded-full"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  />
                ))}
              </div>
              <span className="text-gray-400 text-xs ml-2">Processing...</span>
            </motion.div>
          )}

          {/* Input Line */}
          <form onSubmit={handleCommand} className="flex items-center gap-2">
            <span className="text-emerald-400 font-medium">$</span>
            <input
              ref={inputRef}
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-white outline-none placeholder-muted-foreground caret-emerald-400 font-mono"
              placeholder="Type a command... (try 'help')"
              autoComplete="off"
              spellCheck={false}
              disabled={isTyping}
            />
          </form>
        </div>

        {/* Clean Status Bar */}
        <motion.div
          className="h-6 bg-gradient-to-r from-neutral-900 to-neutral-800 flex items-center justify-between px-4 text-xs text-white border-t border-neutral-700/50"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-green-400"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span>zsh</span>
            </div>
            <span>~/projects/todo-app</span>
          </div>

          <div className="flex items-center gap-3">
            <span>{commandHistory.length} commands</span>
            <span>Node 18.17.0</span>
          </div>
        </motion.div>
      </div>
    </LazyMotion>
  );
} 