"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ImportData() {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [importComplete, setImportComplete] = useState(false)
  const { toast } = useToast()

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleFile = (file: File) => {
    const validTypes = ["application/json", "text/csv", "application/vnd.ms-excel"]
    if (!validTypes.includes(file.type) && !file.name.endsWith(".csv")) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JSON or CSV file.",
        variant: "destructive",
      })
      return
    }

    setUploadedFile(file)
  }

  const handleImport = async () => {
    if (!uploadedFile) return

    setImporting(true)

    // Simulate import process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setImporting(false)
    setImportComplete(true)

    toast({
      title: "Import successful",
      description: "Your passwords have been imported successfully.",
    })
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Import Data</h1>
          </div>
        </div>
      </header>

      <div className="p-4 lg:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-2xl mx-auto space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Import Your Passwords</CardTitle>
              <CardDescription>Upload a JSON or CSV file containing your password data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!importComplete ? (
                <>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/25 hover:border-muted-foreground/50"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <Upload className="size-12 mx-auto mb-4 text-muted-foreground" />
                    <div className="space-y-2">
                      <p className="text-lg font-medium">{uploadedFile ? uploadedFile.name : "Drop your file here"}</p>
                      <p className="text-sm text-muted-foreground">or click to browse files</p>
                      <input
                        type="file"
                        accept=".json,.csv"
                        onChange={handleFileInput}
                        className="hidden"
                        id="file-upload"
                      />
                      <Button variant="outline" asChild>
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <FileText className="size-4 mr-2" />
                          Choose File
                        </label>
                      </Button>
                    </div>
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Supported formats: JSON (exported from SecureVault) and CSV files. Make sure your CSV has columns
                      for website, username, password, and category.
                    </AlertDescription>
                  </Alert>

                  {uploadedFile && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-4"
                    >
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="size-4" />
                          <span className="font-medium">{uploadedFile.name}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Size: {(uploadedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>

                      <Button onClick={handleImport} disabled={importing} className="w-full">
                        {importing ? "Importing..." : "Import Passwords"}
                      </Button>
                    </motion.div>
                  )}
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-4"
                >
                  <CheckCircle className="size-16 mx-auto text-green-500" />
                  <div>
                    <h3 className="text-lg font-semibold">Import Complete!</h3>
                    <p className="text-muted-foreground">Your passwords have been successfully imported.</p>
                  </div>
                  <Button asChild>
                    <a href="/">View Passwords</a>
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
