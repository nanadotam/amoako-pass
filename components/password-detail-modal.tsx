"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Eye, 
  EyeOff, 
  Copy, 
  Calendar, 
  Shield, 
  Clock, 
  Activity, 
  Globe, 
  User, 
  Key, 
  AlertTriangle,
  Check,
  X,
  Edit,
  Trash2,
  History
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"

interface PasswordData {
  id: number
  website: string
  username: string
  password: string
  category: string
  favicon?: string
  lastUsed: string
  createdAt: string
  updatedAt: string
  usageCount: number
  securityScore: number
  passwordAge: number
  notes?: string
  tags: string[]
  isCompromised: boolean
  twoFactorEnabled: boolean
  url?: string
  alternativeEmails: string[]
  securityQuestions: Array<{
    question: string
    answer: string
  }>
  loginHistory: Array<{
    date: string
    location: string
    device: string
    successful: boolean
  }>
}

interface PasswordDetailModalProps {
  password: PasswordData | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: (password: PasswordData) => void
  onDelete?: (passwordId: number) => void
}

export function PasswordDetailModal({ 
  password, 
  open, 
  onOpenChange, 
  onEdit, 
  onDelete 
}: PasswordDetailModalProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showSecurityQuestions, setShowSecurityQuestions] = useState(false)
  const { toast } = useToast()
  const isMobile = useMobile()

  if (!password) return null

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`,
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const getSecurityLevel = (score: number) => {
    if (score >= 90) return { level: "Excellent", color: "text-green-600", bgColor: "bg-green-100" }
    if (score >= 75) return { level: "Good", color: "text-blue-600", bgColor: "bg-blue-100" }
    if (score >= 50) return { level: "Fair", color: "text-yellow-600", bgColor: "bg-yellow-100" }
    return { level: "Poor", color: "text-red-600", bgColor: "bg-red-100" }
  }

  const getPasswordAgeStatus = (days: number) => {
    if (days > 365) return { status: "Very Old", color: "text-red-600" }
    if (days > 180) return { status: "Old", color: "text-yellow-600" }
    if (days > 90) return { status: "Moderate", color: "text-blue-600" }
    return { status: "Recent", color: "text-green-600" }
  }

  const security = getSecurityLevel(password.securityScore)
  const ageStatus = getPasswordAgeStatus(password.passwordAge)

  const content = (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex items-start gap-4">
        <div className="size-12 rounded-lg bg-muted flex items-center justify-center">
          {password.favicon ? (
            <img
              src={password.favicon}
              alt={`${password.website} favicon`}
              className="size-8 rounded"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg?height=32&width=32&text=" + password.website[0]
              }}
            />
          ) : (
            <Globe className="size-6 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-semibold">{password.website}</h3>
          <p className="text-sm text-muted-foreground truncate">{password.username}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary">{password.category}</Badge>
            {password.isCompromised && (
              <Badge variant="destructive" className="gap-1">
                <AlertTriangle className="size-3" />
                Compromised
              </Badge>
            )}
            {password.twoFactorEnabled && (
              <Badge variant="outline" className="gap-1 text-green-600">
                <Shield className="size-3" />
                2FA
              </Badge>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit?.(password)}>
            <Edit className="size-4 mr-1" />
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDelete?.(password.id)}>
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Password Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Key className="size-4" />
                Password
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex-1 font-mono text-sm bg-muted rounded px-3 py-2">
                  {showPassword ? password.password : "••••••••••••"}
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(password.password, "Password")}>
                  <Copy className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Activity className="size-4 text-blue-600" />
                  <div>
                    <p className="text-2xl font-semibold">{password.usageCount}</p>
                    <p className="text-xs text-muted-foreground">Times Used</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-green-600" />
                  <div>
                    <p className="text-2xl font-semibold">{password.passwordAge}</p>
                    <p className="text-xs text-muted-foreground">Days Old</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security Score */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="size-4" />
                Security Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Overall Security</span>
                  <Badge className={`${security.bgColor} ${security.color}`}>
                    {security.level}
                  </Badge>
                </div>
                <Progress value={password.securityScore} className="w-full" />
                <p className="text-xs text-muted-foreground">
                  {password.securityScore}/100 - Based on password strength, age, and security features
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Security Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Password Strength</span>
                  <div className="flex items-center gap-2">
                    {password.securityScore >= 75 ? <Check className="size-4 text-green-600" /> : <X className="size-4 text-red-600" />}
                    <span className="text-sm">{security.level}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Two-Factor Authentication</span>
                  <div className="flex items-center gap-2">
                    {password.twoFactorEnabled ? <Check className="size-4 text-green-600" /> : <X className="size-4 text-red-600" />}
                    <span className="text-sm">{password.twoFactorEnabled ? "Enabled" : "Disabled"}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Password Age</span>
                  <div className="flex items-center gap-2">
                    <Clock className={`size-4 ${ageStatus.color}`} />
                    <span className="text-sm">{ageStatus.status}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Known Breaches</span>
                  <div className="flex items-center gap-2">
                    {password.isCompromised ? <AlertTriangle className="size-4 text-red-600" /> : <Check className="size-4 text-green-600" />}
                    <span className="text-sm">{password.isCompromised ? "Compromised" : "Safe"}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {password.securityQuestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  Security Questions
                  <Button variant="ghost" size="sm" onClick={() => setShowSecurityQuestions(!showSecurityQuestions)}>
                    {showSecurityQuestions ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {showSecurityQuestions ? (
                  <div className="space-y-3">
                    {password.securityQuestions.map((qa, index) => (
                      <div key={index} className="space-y-1">
                        <p className="text-sm font-medium">{qa.question}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-muted-foreground flex-1">{qa.answer}</p>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(qa.answer, "Security Answer")}>
                            <Copy className="size-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Click to view security questions</p>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <History className="size-4" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {password.loginHistory.slice(0, 5).map((entry, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="text-sm font-medium">{entry.location}</p>
                      <p className="text-xs text-muted-foreground">{entry.device}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{entry.date}</p>
                      <Badge variant={entry.successful ? "default" : "destructive"} className="text-xs">
                        {entry.successful ? "Success" : "Failed"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Website URL</label>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-muted-foreground flex-1">{password.url || "Not specified"}</p>
                    {password.url && (
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(password.url!, "URL")}>
                        <Copy className="size-3" />
                      </Button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Alternative Emails</label>
                  <div className="mt-1">
                    {password.alternativeEmails.length > 0 ? (
                      password.alternativeEmails.map((email, index) => (
                        <div key={index} className="flex items-center gap-2 py-1">
                          <p className="text-sm text-muted-foreground flex-1">{email}</p>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(email, "Email")}>
                            <Copy className="size-3" />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">None specified</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Notes</label>
                  <p className="text-sm text-muted-foreground mt-1">{password.notes || "No notes"}</p>
                </div>

                <div>
                  <label className="text-sm font-medium">Tags</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {password.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="font-medium">Created</label>
                  <p className="text-muted-foreground">{password.createdAt}</p>
                </div>
                <div>
                  <label className="font-medium">Last Updated</label>
                  <p className="text-muted-foreground">{password.updatedAt}</p>
                </div>
                <div>
                  <label className="font-medium">Last Used</label>
                  <p className="text-muted-foreground">{password.lastUsed}</p>
                </div>
                <div>
                  <label className="font-medium">Usage Count</label>
                  <p className="text-muted-foreground">{password.usageCount} times</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="px-4 pb-4 max-h-[90vh] overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle>Password Details</DrawerTitle>
          </DrawerHeader>
          {content}
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Password Details</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  )
} 