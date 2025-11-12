'use client'

import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function GlassCard({ children, className, ...props }) {
  return (
    <Card 
      className={cn(
        "bg-white/80 dark:bg-slate-800/80 glass-effect border-white/20 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:animate-glow",
        className
      )}
      {...props}
    >
      {children}
    </Card>
  )
}

export function GradientCard({ children, className, gradient = "blue", ...props }) {
  const gradients = {
    blue: "bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20",
    green: "bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20",
    purple: "bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/20",
    orange: "bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20"
  }

  return (
    <Card 
      className={cn(
        "border-white/20 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300",
        gradients[gradient],
        className
      )}
      {...props}
    >
      {children}
    </Card>
  )
}