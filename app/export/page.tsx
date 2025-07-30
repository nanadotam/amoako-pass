"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Download, FileText, Shield, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ExportData() {
  const [exportFormat, setExportFormat] = useState("json")
  const [includePasswords, setIncludePasswords] = useState(true)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [exporting, setExporting] = useState(false)
  const { toast } = useToast()

  const categories = ["Development", "Email", "Entertainment", "Shopping", "Social", "Banking", "Work", "Personal"]

  const handleExport = async () => {
    setExporting(true)

    // Simulate export process
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Create mock data
    const exportData = {
      exported_at: new Date().toISOString(),
      format: exportFormat,
      include_passwords: includePasswords,
      categories: selectedCategories.length > 0 ? selectedCategories : categories,
      passwords: [
        {
          website: "GitHub",
          username: "john.doe@email.com",
          password: includePasswords ? "Gh$9kL2mN!pQ" : "[HIDDEN]",
          category: "Development",
        },
        {
          website: "Gmail",
          username: "john.doe@gmail.com",
          password: includePasswords ? "Em@il123!Secure" : "[HIDDEN]",
          category: "Email",
        },
      ],
    }

    // Create and download file
    const dataStr = exportFormat === "json" ? JSON.stringify(exportData, null, 2) : convertToCSV(exportData.passwords)

    const dataBlob = new Blob([dataStr], { type: exportFormat === "json" ? "application/json" : "text/csv" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `securevault-export-${new Date().toISOString().split("T")[0]}.${exportFormat}`
    link.click()
    URL.revokeObjectURL(url)

    setExporting(false)
    toast({
      title: "Export successful",
      description: `Your vault has been exported as ${exportFormat.toUpperCase()}.`,
    })
  }

  const convertToCSV = (data: any[]) => {
    const headers = ["Website", "Username", "Password", "Category"]
    const rows = data.map((item) => [item.website, item.username, item.password, item.category])
    return [headers, ...rows].map((row) => row.join(",")).join("\n")
  }

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Export Data</h1>
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
              <CardTitle className="flex items-center gap-2">
                <Download className="size-5" />
                Export Your Vault
              </CardTitle>
              <CardDescription>Download your password data in a secure format</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Export Format</Label>
                  <Select value={exportFormat} onValueChange={setExportFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="json">JSON (Recommended)</SelectItem>
                      <SelectItem value="csv">CSV (Spreadsheet)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="include-passwords" checked={includePasswords} onCheckedChange={setIncludePasswords} />
                  <Label htmlFor="include-passwords">Include passwords in export</Label>
                </div>

                <div className="space-y-3">
                  <Label>Categories to Export</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={category}
                          checked={selectedCategories.includes(category) || selectedCategories.length === 0}
                          onCheckedChange={() => toggleCategory(category)}
                        />
                        <Label htmlFor={category} className="text-sm">
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {selectedCategories.length === 0 && (
                    <p className="text-xs text-muted-foreground">All categories will be exported</p>
                  )}
                </div>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Your exported data will be encrypted and should be stored securely. Never share your password export
                  with untrusted parties.
                </AlertDescription>
              </Alert>

              {!includePasswords && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Passwords will be excluded from the export. This export can be used for backup purposes but won't
                    contain sensitive password data.
                  </AlertDescription>
                </Alert>
              )}

              <Button onClick={handleExport} disabled={exporting} className="w-full">
                <FileText className="size-4 mr-2" />
                {exporting ? "Exporting..." : `Export as ${exportFormat.toUpperCase()}`}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
