'use client'

import { Loader2 } from 'lucide-react'

export function Loading({ size = 'md', text = 'Loading...', className = '' }) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4'
      case 'lg':
        return 'w-8 h-8'
      case 'xl':
        return 'w-12 h-12'
      default:
        return 'w-6 h-6'
    }
  }

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <Loader2 className={`${getSizeClasses()} animate-spin text-blue-600 dark:text-blue-400`} />
      {text && (
        <span className="text-sm text-gray-600 dark:text-gray-400">{text}</span>
      )}
    </div>
  )
}

export function LoadingOverlay({ isLoading, children, text = 'Loading...' }) {
  if (!isLoading) return children

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10 flex items-center justify-center transition-colors duration-300">
        <Loading text={text} size="lg" />
      </div>
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
    </div>
  )
}

export function PageLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
      <div className="text-center">
        <Loading size="xl" text="" />
        <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">Loading KMBB CET</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Please wait while we prepare your dashboard...</p>
      </div>
    </div>
  )
}