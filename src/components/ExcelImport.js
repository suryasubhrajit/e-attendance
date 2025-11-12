'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Upload, 
  Download, 
  FileSpreadsheet, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Users,
  FileText
} from 'lucide-react'
import { useNotification } from '@/components/Notification'
import { ImportInstructions } from '@/components/ImportInstructions'
import { generateStudentTemplate, generateTeacherTemplate, validateImportData, convertToCSV, mapCSVToAPIFormat } from '@/utils/excelTemplates'

export function ExcelImport({ type = 'students', onImportComplete }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [importResults, setImportResults] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [processingStep, setProcessingStep] = useState('')
  const fileInputRef = useRef(null)
  const { addNotification } = useNotification()

  // Get templates from utility functions
  const getTemplate = () => {
    return type === 'students' ? generateStudentTemplate() : generateTeacherTemplate()
  }

  const downloadTemplate = () => {
    const template = getTemplate()
    const csvContent = convertToCSV(template)
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `${type}_import_template.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
    
    addNotification('success', `${type} template downloaded successfully!`)
  }

  const convertToCSV = (data) => {
    if (!data || data.length === 0) return ''
    
    const headers = Object.keys(data[0])
    const csvHeaders = headers.join(',')
    
    const csvRows = data.map(row => 
      headers.map(header => {
        const value = row[header] || ''
        // Escape commas and quotes
        return `"${value.toString().replace(/"/g, '""')}"`
      }).join(',')
    )
    
    return [csvHeaders, ...csvRows].join('\n')
  }

  const parseCSV = (text) => {
    try {
      const lines = text.split('\n').filter(line => line.trim())
      console.log('CSV lines found:', lines.length)
      
      if (lines.length < 2) {
        console.warn('Not enough lines in CSV')
        return []
      }
      
      // Better CSV parsing that handles quoted values
      const parseCSVLine = (line) => {
        const result = []
        let current = ''
        let inQuotes = false
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i]
          
          if (char === '"') {
            inQuotes = !inQuotes
          } else if (char === ',' && !inQuotes) {
            result.push(current.trim())
            current = ''
          } else {
            current += char
          }
        }
        
        result.push(current.trim())
        return result
      }
      
      const headers = parseCSVLine(lines[0])
      console.log('CSV headers:', headers)
      
      const data = []
      
      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i])
        if (values.length >= headers.length) {
          const row = {}
          headers.forEach((header, index) => {
            row[header] = values[index] || ''
          })
          data.push(row)
        }
      }
      
      console.log('Parsed CSV data:', data)
      return data
    } catch (error) {
      console.error('CSV parsing error:', error)
      return []
    }
  }

  const validateData = (data) => {
    return validateImportData(data, type)
  }

  const handleFileUpload = async (file) => {
    if (!file) {
      console.warn('No file provided')
      return
    }
    
    console.log('Processing file:', file.name, 'Size:', file.size, 'Type:', file.type)
    
    const fileExtension = file.name.split('.').pop().toLowerCase()
    if (!['csv', 'xlsx', 'xls'].includes(fileExtension)) {
      addNotification('error', 'Please upload a CSV or Excel file (.csv, .xlsx, .xls)')
      return
    }
    
    setIsProcessing(true)
    setUploadProgress(0)
    setProcessingStep('Reading file...')
    
    try {
      let data = []
      
      if (fileExtension === 'csv') {
        console.log('Reading CSV file...')
        setUploadProgress(25)
        const text = await file.text()
        console.log('File content length:', text.length)
        
        setProcessingStep('Parsing CSV data...')
        setUploadProgress(50)
        data = parseCSV(text)
      } else {
        // For Excel files, we'll simulate parsing (in real app, use a library like xlsx)
        addNotification('warning', 'Excel files (.xlsx, .xls) will be supported soon. Please use CSV format for now.')
        setIsProcessing(false)
        setUploadProgress(0)
        setProcessingStep('')
        return
      }
      
      console.log('Parsed data rows:', data.length)
      
      if (data.length === 0) {
        addNotification('error', 'No valid data found in the file. Please check the file format.')
        setIsProcessing(false)
        setUploadProgress(0)
        setProcessingStep('')
        return
      }
      
      console.log('Validating data...')
      setProcessingStep('Validating records...')
      setUploadProgress(75)
      
      const validationResults = validateData(data)
      console.log('Validation results:', validationResults)
      
      setUploadProgress(100)
      setProcessingStep('Complete!')
      
      setTimeout(() => {
        setImportResults(validationResults)
        setUploadProgress(0)
        setProcessingStep('')
        
        if (validationResults.valid.length > 0) {
          addNotification('success', `Found ${validationResults.valid.length} valid records ready for import`)
        }
        
        if (validationResults.invalid.length > 0) {
          addNotification('warning', `Found ${validationResults.invalid.length} records with errors that need to be fixed`)
        }
        
        if (validationResults.duplicates && validationResults.duplicates.length > 0) {
          addNotification('warning', `Found ${validationResults.duplicates.length} duplicate records`)
        }
      }, 500)
      
    } catch (error) {
      console.error('Error processing file:', error)
      addNotification('error', `Error processing file: ${error.message}. Please check the file format and try again.`)
      setUploadProgress(0)
      setProcessingStep('')
    }
    
    setIsProcessing(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragActive(false)
  }

  const confirmImport = () => {
    if (!importResults || importResults.valid.length === 0) {
      addNotification('error', 'No valid records to import!')
      return
    }
    
    console.log('Starting import process...', importResults)
    
    // Simulate import process
    setIsProcessing(true)
    
    setTimeout(() => {
      try {
        const csvData = importResults.valid.map(item => item.data)
        // Map CSV column names to API field names
        const importedData = mapCSVToAPIFormat(csvData, type)
        console.log('Calling onImportComplete with mapped data:', importedData)
        
        if (onImportComplete) {
          onImportComplete(importedData)
        } else {
          console.warn('onImportComplete callback not provided')
          addNotification('warning', 'Import callback not configured')
        }
        
        addNotification('success', `Successfully processed ${importedData.length} ${type}!`)
        setImportResults(null)
      } catch (error) {
        console.error('Import processing error:', error)
        addNotification('error', 'Failed to process import data')
      } finally {
        setIsProcessing(false)
      }
    }, 1000) // Reduced timeout for faster testing
  }

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <ImportInstructions type={type} />
      
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5" />
            <span>Bulk Import {type === 'students' ? 'Students' : 'Teachers'}</span>
          </CardTitle>
          <CardDescription>
            Upload a CSV file to import multiple {type} at once
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Template Download */}
            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-3">
                <FileSpreadsheet className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <div>
                  <h4 className="font-medium text-blue-900 dark:text-blue-300">Download Template</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    Get the CSV template with sample data and required format
                  </p>
                </div>
              </div>
              <Button onClick={downloadTemplate} variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                <Download className="w-4 h-4 mr-2" />
                Download Template
              </Button>
            </div>

            {/* File Upload */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Drop your CSV file here
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                or click to browse and select a file
              </p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="mb-2"
              >
                {isProcessing ? 'Processing...' : 'Choose File'}
              </Button>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Supported formats: CSV, Excel (.xlsx, .xls)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={(e) => handleFileUpload(e.target.files?.[0])}
                className="hidden"
              />
            </div>

            {/* Progress Bar */}
            {isProcessing && uploadProgress > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{processingStep}</span>
                  <span className="text-gray-600 dark:text-gray-400">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Import Results */}
      {importResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Import Preview</span>
            </CardTitle>
            <CardDescription>
              Review the data before importing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="font-medium text-green-900 dark:text-green-300">Valid Records</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{importResults.valid.length}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                  <div>
                    <p className="font-medium text-red-900 dark:text-red-300">Invalid Records</p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">{importResults.invalid.length}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <AlertTriangle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                  <div>
                    <p className="font-medium text-yellow-900 dark:text-yellow-300">Duplicates</p>
                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{importResults.duplicates.length}</p>
                  </div>
                </div>
              </div>

              {/* Error Details */}
              {importResults.invalid.length > 0 && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <h4 className="font-medium text-red-900 dark:text-red-300 mb-2">Invalid Records:</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {importResults.invalid.slice(0, 5).map((item, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium text-red-800 dark:text-red-400">Row {item.row}:</span>
                        <span className="text-red-700 dark:text-red-300 ml-2">{item.errors.join(', ')}</span>
                      </div>
                    ))}
                    {importResults.invalid.length > 5 && (
                      <p className="text-xs text-red-600 dark:text-red-400">
                        +{importResults.invalid.length - 5} more errors
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Import Button */}
              {importResults.valid.length > 0 && (
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setImportResults(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmImport}
                    disabled={isProcessing}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    {isProcessing ? 'Importing...' : `Import ${importResults.valid.length} Records`}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}