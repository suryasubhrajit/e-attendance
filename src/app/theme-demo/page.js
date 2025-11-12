'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeToggle } from '@/components/ThemeToggle'
import { StatsCard, StatsGrid } from '@/components/StatsCard'
import { Loading, LoadingOverlay } from '@/components/Loading'
import { useNotification } from '@/components/Notification'
import { 
  Users, 
  BookOpen, 
  Calendar, 
  BarChart3,
  GraduationCap,
  Bell,
  Settings,
  Palette
} from 'lucide-react'

export default function ThemeDemo() {
  const [isLoading, setIsLoading] = useState(false)
  const { addNotification, NotificationContainer } = useNotification()

  const testNotifications = () => {
    addNotification('success', 'Theme system working perfectly!')
    setTimeout(() => addNotification('warning', 'This is a warning notification'), 1000)
    setTimeout(() => addNotification('error', 'This is an error notification'), 2000)
  }

  const testLoading = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 3000)
  }

  return (
    <>
      <NotificationContainer />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-500">
        {/* Header */}
        <header className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-lg border-b border-slate-200/50 dark:border-slate-700/50 transition-all duration-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Palette className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <div>
                  <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Theme Demo</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Dark/Light Mode Showcase</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                <Button variant="outline" onClick={() => window.location.href = '/'}>
                  Back to Login
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingOverlay isLoading={isLoading}>
            {/* Theme Toggle Section */}
            <Card className="mb-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Theme System</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Toggle between light and dark modes using the button in the top right
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <ThemeToggle />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Click to switch themes
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Statistics Cards</h2>
              <StatsGrid>
                <StatsCard
                  title="Total Students"
                  value="1,250"
                  icon={Users}
                  color="blue"
                  trend="up"
                  trendValue="12"
                />
                <StatsCard
                  title="Total Teachers"
                  value="85"
                  icon={BookOpen}
                  color="green"
                  trend="up"
                  trendValue="5"
                />
                <StatsCard
                  title="Classes Today"
                  value="156"
                  icon={Calendar}
                  color="purple"
                />
                <StatsCard
                  title="Attendance Rate"
                  value="82.3%"
                  icon={BarChart3}
                  color="orange"
                  trend="down"
                  trendValue="2"
                />
              </StatsGrid>
            </div>

            {/* Interactive Components */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Form Elements</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    Input fields and buttons with theme support
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Sample Input
                    </label>
                    <Input placeholder="Type something here..." />
                  </div>
                  <div className="flex space-x-2">
                    <Button>Primary Button</Button>
                    <Button variant="outline">Outline Button</Button>
                    <Button variant="ghost">Ghost Button</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Interactive Features</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    Test notifications and loading states
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button onClick={testNotifications} className="w-full">
                    <Bell className="w-4 h-4 mr-2" />
                    Test Notifications
                  </Button>
                  <Button onClick={testLoading} variant="outline" className="w-full">
                    <Settings className="w-4 h-4 mr-2" />
                    Test Loading State
                  </Button>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-300">
                    <Loading text="Sample loading component" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Color Palette */}
            <Card className="mb-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Color Palette</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Theme-aware color system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-500 dark:bg-blue-400 rounded-lg mx-auto mb-2 transition-colors duration-300"></div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Primary Blue</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-500 dark:bg-green-400 rounded-lg mx-auto mb-2 transition-colors duration-300"></div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Success Green</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-yellow-500 dark:bg-yellow-400 rounded-lg mx-auto mb-2 transition-colors duration-300"></div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Warning Yellow</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-500 dark:bg-red-400 rounded-lg mx-auto mb-2 transition-colors duration-300"></div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Error Red</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature List */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Theme Features</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Complete dark/light mode implementation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">✅ Implemented Features</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• System-wide theme toggle</li>
                      <li>• Persistent theme preference</li>
                      <li>• Smooth color transitions</li>
                      <li>• Theme-aware components</li>
                      <li>• Dark mode optimized colors</li>
                      <li>• Accessible contrast ratios</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">🎨 Design System</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• Consistent color palette</li>
                      <li>• Responsive design</li>
                      <li>• Interactive feedback</li>
                      <li>• Loading states</li>
                      <li>• Notification system</li>
                      <li>• Modern UI components</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </LoadingOverlay>
        </div>
      </div>
    </>
  )
}