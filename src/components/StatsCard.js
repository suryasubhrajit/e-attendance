'use client'

import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue, 
  color = 'blue',
  className = '' 
}) {
  const getColorClasses = () => {
    switch (color) {
      case 'green':
        return {
          icon: 'text-green-500 dark:text-green-400',
          bg: 'bg-green-50 dark:bg-green-900/20'
        }
      case 'purple':
        return {
          icon: 'text-purple-500 dark:text-purple-400',
          bg: 'bg-purple-50 dark:bg-purple-900/20'
        }
      case 'orange':
        return {
          icon: 'text-orange-500 dark:text-orange-400',
          bg: 'bg-orange-50 dark:bg-orange-900/20'
        }
      case 'red':
        return {
          icon: 'text-red-500 dark:text-red-400',
          bg: 'bg-red-50 dark:bg-red-900/20'
        }
      default:
        return {
          icon: 'text-blue-500 dark:text-blue-400',
          bg: 'bg-blue-50 dark:bg-blue-900/20'
        }
    }
  }

  const colors = getColorClasses()

  return (
    <Card className={`bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 transition-all duration-300 hover:shadow-lg hover:scale-105 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{title}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
            {trend && trendValue && (
              <div className="flex items-center mt-2">
                {trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm ${trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {trendValue}%
                </span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full ${colors.bg} shadow-sm border border-white/20 dark:border-slate-700/50`}>
            <Icon className={`w-6 h-6 ${colors.icon}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function StatsGrid({ children, className = '' }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {children}
    </div>
  )
}