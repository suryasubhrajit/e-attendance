'use client'

import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/contexts/ThemeContext'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="w-10 h-10 p-0 rounded-full bg-white/10 dark:bg-slate-800/50 glass-effect border border-white/20 dark:border-slate-700/50 hover:bg-white/20 dark:hover:bg-slate-700/50 transition-all duration-300 shadow-lg hover:shadow-xl animate-float hover:animate-glow"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4 text-slate-700 dark:text-slate-300 transition-transform duration-300 hover:rotate-12" />
      ) : (
        <Sun className="h-4 w-4 text-amber-500 dark:text-amber-400 transition-transform duration-300 hover:rotate-180" />
      )}
    </Button>
  )
}