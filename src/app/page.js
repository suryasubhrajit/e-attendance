'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Users, Shield } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { LoginBackground } from '@/components/AnimatedBackground'

export default function LoginPage() {
  const [userType, setUserType] = useState('student')
  const [credentials, setCredentials] = useState({ username: '', password: '' })

  const handleLogin = (e) => {
    e.preventDefault()
    
    // Validate credentials
    if (!credentials.username || !credentials.password) {
      alert('Please enter both username and password!')
      return
    }

    // Simple validation for demo (in real app, this would be API call)
    const validCredentials = {
      student: { username: 'student123', password: 'password' },
      teacher: { username: 'teacher123', password: 'password' },
      principal: { username: 'principal123', password: 'password' }
    }

    const validCred = validCredentials[userType]
    if (credentials.username === validCred.username && credentials.password === validCred.password) {
      console.log('Login successful:', { userType, credentials })
      
      // Redirect based on user type
      if (userType === 'student') {
        window.location.href = '/student/dashboard'
      } else if (userType === 'teacher') {
        window.location.href = '/teacher/dashboard'
      } else if (userType === 'principal') {
        window.location.href = '/admin/dashboard'
      }
    } else {
      alert(`Invalid credentials! For demo use:\nUsername: ${validCred.username}\nPassword: ${validCred.password}`)
    }
  }

  const userTypes = [
    { id: 'student', label: 'Student', icon: GraduationCap, color: 'bg-blue-500' },
    { id: 'teacher', label: 'Teacher', icon: Users, color: 'bg-green-500' },
    { id: 'principal', label: 'Principal', icon: Shield, color: 'bg-purple-500' }
  ]

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <LoginBackground />
      
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md">
        {/* College Header */}
        <div className="text-center mb-8">
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center shadow-xl border border-white/20 dark:border-slate-700/50 transition-all duration-500">
            <GraduationCap className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">KMBB CET</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">KMBB College of Engineering and Technology</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Khordha • Affiliated by BPUT</p>
        </div>

        <Card className="shadow-2xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-white/20 dark:border-slate-700/50 transition-all duration-500">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-slate-900 dark:text-slate-100 font-semibold">E-Attendance System</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">Select your role and login to continue</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* User Type Selection */}
            <div className="grid grid-cols-3 gap-2">
              {userTypes.map((type) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => {
                      setUserType(type.id)
                      // Clear credentials when switching roles
                      setCredentials({ username: '', password: '' })
                    }}
                    className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                      userType === type.id
                        ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30 shadow-md scale-105'
                        : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 hover:shadow-sm hover:scale-102'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full ${type.color} mx-auto mb-2 flex items-center justify-center transition-transform ${
                      userType === type.id ? 'scale-110' : ''
                    }`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <p className={`text-xs font-medium transition-colors ${
                      userType === type.id 
                        ? 'text-blue-700 dark:text-blue-300' 
                        : 'text-slate-700 dark:text-slate-300'
                    }`}>{type.label}</p>
                  </button>
                )
              })}
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {userType === 'student' ? 'Roll Number' : 'Employee ID'}
                </label>
                <Input
                  type="text"
                  placeholder={userType === 'student' ? 'Enter your roll number' : 'Enter your employee ID'}
                  value={credentials.username}
                  onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  className="transition-all duration-200"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  className="transition-all duration-200"
                  required
                />
              </div>

              <Button type="submit" className="w-full transition-all duration-200">
                Login as {userTypes.find(t => t.id === userType)?.label}
              </Button>
            </form>

            <div className="text-center space-y-2">
              <a href="#" className="block text-sm text-blue-600 hover:underline">
                Forgot Password?
              </a>
              <a href="/setup" className="block text-xs text-gray-500 dark:text-gray-400 hover:underline">
                First time setup? Create Principal Account
              </a>
              <a href="/theme-demo" className="block text-xs text-blue-600 dark:text-blue-400 hover:underline">
                🎨 View Theme Demo
              </a>
              
              {/* Demo Credentials - Shows current role */}
              <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg text-left border border-blue-200/50 dark:border-blue-700/50 backdrop-blur-sm transition-all duration-300">
                <p className="text-xs font-medium text-blue-800 dark:text-blue-300 mb-2">
                  Demo Credentials for {userTypes.find(t => t.id === userType)?.label}:
                </p>
                <div className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                  {userType === 'student' && (
                    <>
                      <p><strong>Roll Number:</strong> student123</p>
                      <p><strong>Password:</strong> password</p>
                    </>
                  )}
                  {userType === 'teacher' && (
                    <>
                      <p><strong>Employee ID:</strong> teacher123</p>
                      <p><strong>Password:</strong> password</p>
                    </>
                  )}
                  {userType === 'principal' && (
                    <>
                      <p><strong>Employee ID:</strong> principal123</p>
                      <p><strong>Password:</strong> password</p>
                    </>
                  )}
                </div>
                <div className="mt-2 pt-2 border-t border-blue-200/30 dark:border-blue-700/30">
                  <p className="text-xs text-blue-600 dark:text-blue-400 italic">
                    💡 Click on a role above to switch
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-xs text-gray-500 dark:text-gray-400">
          © 2024 KMBB College of Engineering and Technology
        </div>
      </div>
    </div>
  )
}