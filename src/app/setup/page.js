'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, GraduationCap, AlertCircle } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'

export default function SystemSetup() {
  const [step, setStep] = useState(1)
  const [principalData, setPrincipalData] = useState({
    name: '',
    employeeId: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })

  const handleCreatePrincipal = (e) => {
    e.preventDefault()
    
    if (principalData.password !== principalData.confirmPassword) {
      alert('Passwords do not match!')
      return
    }

    // Here you would typically save to database
    console.log('Creating principal account:', principalData)
    
    // For demo, redirect to login
    alert('Principal account created successfully! You can now login.')
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors duration-300">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md">
        {/* College Header */}
        <div className="text-center mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center shadow-lg transition-colors duration-300">
            <GraduationCap className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">KMBB CET</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">System Setup</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <Shield className="w-6 h-6 text-purple-600" />
              <span>Create Principal Account</span>
            </CardTitle>
            <CardDescription>
              Set up the first principal account to manage the system
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Important</p>
                  <p className="text-xs text-yellow-700">
                    This account will have full system access. Keep credentials secure.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleCreatePrincipal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <Input
                  type="text"
                  placeholder="Enter principal's full name"
                  value={principalData.name}
                  onChange={(e) => setPrincipalData({...principalData, name: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee ID
                </label>
                <Input
                  type="text"
                  placeholder="Enter employee ID (e.g., PRIN001)"
                  value={principalData.employeeId}
                  onChange={(e) => setPrincipalData({...principalData, employeeId: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={principalData.email}
                  onChange={(e) => setPrincipalData({...principalData, email: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  placeholder="Enter phone number"
                  value={principalData.phone}
                  onChange={(e) => setPrincipalData({...principalData, phone: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="Create a strong password"
                  value={principalData.password}
                  onChange={(e) => setPrincipalData({...principalData, password: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <Input
                  type="password"
                  placeholder="Confirm your password"
                  value={principalData.confirmPassword}
                  onChange={(e) => setPrincipalData({...principalData, confirmPassword: e.target.value})}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Create Principal Account
              </Button>
            </form>

            <div className="mt-4 text-center">
              <a href="/" className="text-sm text-blue-600 hover:underline">
                Back to Login
              </a>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-xs text-gray-500">
          © 2024 KMBB College of Engineering and Technology
        </div>
      </div>
    </div>
  )
}