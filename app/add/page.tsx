"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Eye, EyeOff, Wand2, Plus, X, Globe, Shield } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { PasswordGenerator } from "@/components/password-generator"
import { useToast } from "@/hooks/use-toast"

const categories = ["Development", "Email", "Entertainment", "Shopping", "Social", "Banking", "Work", "Personal"]

const popularPlatforms = [
  { name: "GitHub", url: "https://github.com", category: "Development", favicon: "https://github.com/favicon.ico" },
  { name: "Gmail", url: "https://gmail.com", category: "Email", favicon: "https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico" },
  { name: "Netflix", url: "https://netflix.com", category: "Entertainment", favicon: "https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2023.ico" },
  { name: "Amazon", url: "https://amazon.com", category: "Shopping", favicon: "https://www.amazon.com/favicon.ico" },
  { name: "Twitter", url: "https://twitter.com", category: "Social", favicon: "https://abs.twimg.com/favicons/twitter.3.ico" },
  { name: "Instagram", url: "https://instagram.com", category: "Social", favicon: "https://static.cdninstagram.com/rsrc.php/v3/yI/r/VsNE-OHk_8a.png" },
  { name: "Facebook", url: "https://facebook.com", category: "Social", favicon: "https://static.xx.fbcdn.net/rsrc.php/yo/r/iRmz9lCMBD2.ico" },
  { name: "LinkedIn", url: "https://linkedin.com", category: "Work", favicon: "https://static.licdn.com/aero-v1/sc/h/al2o9zrvru7aqj8e1x2rzsrca" },
  { name: "Discord", url: "https://discord.com", category: "Social", favicon: "https://discord.com/assets/f8389ca1a741a115313bede9ac02e2c0.ico" },
  { name: "Spotify", url: "https://spotify.com", category: "Entertainment", favicon: "https://www.scdn.co/i/_global/favicon.png" },
  { name: "PayPal", url: "https://paypal.com", category: "Banking", favicon: "https://www.paypalobjects.com/webstatic/icon/pp32.png" },
  { name: "Dropbox", url: "https://dropbox.com", category: "Work", favicon: "https://cfl.dropboxstatic.com/static/images/favicon-vflUeLeeY.ico" }
]

export default function AddPassword() {
  const [formData, setFormData] = useState({
    website: "",
    username: "",
    password: "",
    category: "",
    notes: "",
    url: "",
    twoFactorEnabled: false,
    tags: [] as string[],
    alternativeEmails: [] as string[],
    securityQuestions: [] as Array<{ question: string; answer: string }>,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showGenerator, setShowGenerator] = useState(false)
  const [newTag, setNewTag] = useState("")
  const [newAltEmail, setNewAltEmail] = useState("")
  const [selectedPlatform, setSelectedPlatform] = useState<typeof popularPlatforms[0] | null>(null)
  const { toast } = useToast()



  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      })
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    })
  }

  const addAlternativeEmail = () => {
    if (newAltEmail.trim() && !formData.alternativeEmails.includes(newAltEmail.trim())) {
      setFormData({
        ...formData,
        alternativeEmails: [...formData.alternativeEmails, newAltEmail.trim()]
      })
      setNewAltEmail("")
    }
  }

  const removeAlternativeEmail = (emailToRemove: string) => {
    setFormData({
      ...formData,
      alternativeEmails: formData.alternativeEmails.filter(email => email !== emailToRemove)
    })
  }

  const addSecurityQuestion = () => {
    setFormData({
      ...formData,
      securityQuestions: [...formData.securityQuestions, { question: "", answer: "" }]
    })
  }

  const updateSecurityQuestion = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = formData.securityQuestions.map((sq, i) => 
      i === index ? { ...sq, [field]: value } : sq
    )
    setFormData({ ...formData, securityQuestions: updated })
  }

  const removeSecurityQuestion = (index: number) => {
    setFormData({
      ...formData,
      securityQuestions: formData.securityQuestions.filter((_, i) => i !== index)
    })
  }

  const selectPlatform = (platform: typeof popularPlatforms[0]) => {
    setSelectedPlatform(platform)
    setFormData({
      ...formData,
      website: platform.name,
      url: platform.url,
      category: platform.category
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Create password entry with metadata
    const passwordEntry = {
      ...formData,
      id: Date.now(), // In real app, this would be generated by backend
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      lastUsed: "Never",
      usageCount: 0,
      securityScore: getPasswordStrength(formData.password).score,
      passwordAge: 0,
      isCompromised: false,
      favicon: selectedPlatform?.favicon || "",
    }
    
    console.log("Password Entry:", passwordEntry)
    
    toast({
      title: "Password saved!",
      description: "Your password has been securely stored with all metadata.",
    })
  }

  const getPasswordStrength = (password: string) => {
    let score = 0
    if (password.length >= 8) score += 15
    if (password.length >= 12) score += 15
    if (/[a-z]/.test(password)) score += 15
    if (/[A-Z]/.test(password)) score += 15
    if (/[0-9]/.test(password)) score += 15
    if (/[^A-Za-z0-9]/.test(password)) score += 25

    const label = score <= 30 ? "Weak" : score <= 60 ? "Fair" : score <= 85 ? "Good" : "Strong"
    const color = score <= 30 ? "bg-red-500" : score <= 60 ? "bg-yellow-500" : score <= 85 ? "bg-blue-500" : "bg-green-500"
    const width = `${Math.min(score, 100)}%`
    
    return { label, color, width, score }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
          <SidebarTrigger className="lg:hidden" />
          <Button variant="ghost" size="sm" asChild className="hidden lg:flex">
            <Link href="/">
              <ArrowLeft className="size-4 mr-2" />
              Back
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Add Password</h1>
          </div>
        </div>
      </header>

      <div className="p-4 lg:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-2xl mx-auto"
        >
          <Card>
            <CardHeader>
              <CardTitle>New Password Entry</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="metadata">Metadata</TabsTrigger>
                    <TabsTrigger value="platforms">Platforms</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="website">Website/Service</Label>
                        <Input
                          id="website"
                          placeholder="e.g., GitHub, Gmail"
                          value={formData.website}
                          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => setFormData({ ...formData, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="url">Website URL (Optional)</Label>
                      <Input
                        id="url"
                        placeholder="https://example.com"
                        value={formData.url}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="username">Username/Email</Label>
                      <Input
                        id="username"
                        placeholder="your.email@example.com"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Button type="button" variant="ghost" size="sm" onClick={() => setShowGenerator(true)}>
                          <Wand2 className="size-4 mr-2" />
                          Generate
                        </Button>
                      </div>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="pr-10 font-mono"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </Button>
                      </div>

                      {formData.password && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="space-y-2"
                        >
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-muted rounded-full h-2">
                              <motion.div
                                className={`h-full rounded-full ${getPasswordStrength(formData.password).color}`}
                                initial={{ width: 0 }}
                                animate={{ width: getPasswordStrength(formData.password).width }}
                                transition={{ duration: 0.3 }}
                              />
                            </div>
                            <span className="text-sm font-medium">{getPasswordStrength(formData.password).label}</span>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Additional notes about this password..."
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows={3}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="security" className="space-y-4 mt-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
                          <p className="text-sm text-muted-foreground">
                            Is 2FA enabled for this account?
                          </p>
                        </div>
                        <Switch
                          id="twoFactor"
                          checked={formData.twoFactorEnabled}
                          onCheckedChange={(checked) => setFormData({ ...formData, twoFactorEnabled: checked })}
                        />
                      </div>

                      <div className="space-y-3">
                        <Label>Security Questions</Label>
                        {formData.securityQuestions.map((sq, index) => (
                          <Card key={index} className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <Label className="text-sm">Question {index + 1}</Label>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeSecurityQuestion(index)}
                                >
                                  <X className="size-4" />
                                </Button>
                              </div>
                              <Input
                                placeholder="Security question"
                                value={sq.question}
                                onChange={(e) => updateSecurityQuestion(index, 'question', e.target.value)}
                              />
                              <Input
                                placeholder="Answer"
                                value={sq.answer}
                                onChange={(e) => updateSecurityQuestion(index, 'answer', e.target.value)}
                              />
                            </div>
                          </Card>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addSecurityQuestion}
                          className="w-full"
                        >
                          <Plus className="size-4 mr-2" />
                          Add Security Question
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="metadata" className="space-y-4 mt-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Tags</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            placeholder="Add a tag"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                          />
                          <Button type="button" variant="outline" size="sm" onClick={addTag}>
                            <Plus className="size-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="gap-1">
                              {tag}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="size-4 p-0 h-auto"
                                onClick={() => removeTag(tag)}
                              >
                                <X className="size-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Alternative Emails</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            placeholder="Add alternative email"
                            value={newAltEmail}
                            onChange={(e) => setNewAltEmail(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAlternativeEmail())}
                          />
                          <Button type="button" variant="outline" size="sm" onClick={addAlternativeEmail}>
                            <Plus className="size-4" />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {formData.alternativeEmails.map((email, index) => (
                            <div key={index} className="flex items-center justify-between bg-muted rounded px-3 py-2">
                              <span className="text-sm">{email}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeAlternativeEmail(email)}
                              >
                                <X className="size-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="platforms" className="space-y-4 mt-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-base font-medium">Popular Platforms</Label>
                        <p className="text-sm text-muted-foreground mb-4">
                          Select a platform to auto-fill website information
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {popularPlatforms.map((platform) => (
                            <Button
                              key={platform.name}
                              type="button"
                              variant={selectedPlatform?.name === platform.name ? "default" : "outline"}
                              size="sm"
                              onClick={() => selectPlatform(platform)}
                              className="justify-start gap-2 h-auto p-3"
                            >
                              <div className="size-6 rounded bg-muted flex items-center justify-center">
                                <Globe className="size-4" />
                              </div>
                              <div className="text-left">
                                <p className="font-medium">{platform.name}</p>
                                <p className="text-xs text-muted-foreground">{platform.category}</p>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </div>

                      {selectedPlatform && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-muted rounded-lg"
                        >
                          <h4 className="font-medium mb-2">Selected Platform</h4>
                          <div className="flex items-center gap-3">
                            <div className="size-8 rounded bg-background flex items-center justify-center">
                              <Globe className="size-4" />
                            </div>
                            <div>
                              <p className="font-medium">{selectedPlatform.name}</p>
                              <p className="text-sm text-muted-foreground">{selectedPlatform.url}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" className="flex-1">
                    Save Password
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link href="/">Cancel</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <PasswordGenerator 
          open={showGenerator} 
          onOpenChange={setShowGenerator}
          onPasswordGenerated={(password) => setFormData({ ...formData, password })}
        />
      </div>
    </div>
  )
}
