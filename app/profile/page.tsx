"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { User, Shield, Key, Mail, Calendar, MapPin, Smartphone, AlertTriangle, CheckCircle, Activity, Lock, Edit, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Mock user data matching the database schema
const mockUser = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  email: "nana.amoako@example.com",
  username: "nanaamoako",
  createdAt: "2024-01-15T10:30:00Z",
  lastLogin: "2024-12-20T14:30:00Z",
  isActive: true,
  emailVerified: true,
  twoFactorEnabled: false,
  accountStats: {
    totalPasswords: 45,
    totalWifiNetworks: 8,
    favoriteItems: 12,
    securityScore: 85,
    lastBackup: "2024-12-19T03:00:00Z"
  }
}

const recentActivity = [
  { action: "Password created", details: "GitHub account", timestamp: "2 hours ago", type: "create" },
  { action: "Password accessed", details: "Gmail", timestamp: "1 day ago", type: "access" },
  { action: "WiFi network added", details: "HomeNetwork_5G", timestamp: "3 days ago", type: "create" },
  { action: "Password updated", details: "Netflix", timestamp: "1 week ago", type: "update" },
  { action: "Export data", details: "JSON export", timestamp: "2 weeks ago", type: "export" },
]

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    email: mockUser.email,
    username: mockUser.username,
  })
  const { toast } = useToast()

  const handleSave = () => {
    // In a real app, this would save to the backend
    setIsEditing(false)
    toast({
      title: "Profile updated",
      description: "Your profile information has been successfully updated.",
    })
  }

  const handleEnable2FA = () => {
    toast({
      title: "2FA Setup",
      description: "Two-factor authentication setup would be initiated here.",
    })
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "create":
        return <CheckCircle className="size-4 text-green-500" />
      case "access":
        return <Activity className="size-4 text-blue-500" />
      case "update":
        return <Edit className="size-4 text-orange-500" />
      case "export":
        return <AlertTriangle className="size-4 text-yellow-500" />
      default:
        return <Activity className="size-4 text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Profile & Account</h1>
          </div>
          <Button variant="outline" size="sm">
            <LogOut className="size-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <div className="p-4 lg:p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          {/* Profile Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="size-5" />
                Profile Information
              </CardTitle>
              <CardDescription>Manage your account details and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/placeholder-user.jpg" alt="Profile" />
                  <AvatarFallback className="text-lg">NA</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold">{mockUser.username}</h2>
                    <Badge variant="outline" className="text-xs">
                      {mockUser.emailVerified ? (
                        <>
                          <CheckCircle className="size-3 mr-1 text-green-500" />
                          Verified
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="size-3 mr-1 text-yellow-500" />
                          Unverified
                        </>
                      )}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{mockUser.email}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="size-4" />
                      <span>Joined {new Date(mockUser.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Activity className="size-4" />
                      <span>Last active {new Date(mockUser.lastLogin).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <Button 
                  variant={isEditing ? "default" : "outline"} 
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                >
                  <Edit className="size-4 mr-2" />
                  {isEditing ? "Save Changes" : "Edit Profile"}
                </Button>
              </div>

              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-4 border-t pt-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Account Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Account Overview</CardTitle>
              <CardDescription>Your vault statistics and security metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{mockUser.accountStats.totalPasswords}</div>
                  <div className="text-sm text-muted-foreground">Total Passwords</div>
                </div>
                
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{mockUser.accountStats.totalWifiNetworks}</div>
                  <div className="text-sm text-muted-foreground">WiFi Networks</div>
                </div>
                
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{mockUser.accountStats.favoriteItems}</div>
                  <div className="text-sm text-muted-foreground">Favorites</div>
                </div>
                
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{mockUser.accountStats.securityScore}/100</div>
                  <div className="text-sm text-muted-foreground">Security Score</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="size-5" />
                Security & Authentication
              </CardTitle>
              <CardDescription>Manage your account security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={mockUser.twoFactorEnabled ? "default" : "secondary"}>
                    {mockUser.twoFactorEnabled ? "Enabled" : "Disabled"}
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleEnable2FA}
                  >
                    {mockUser.twoFactorEnabled ? "Manage" : "Enable"}
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Verification</Label>
                  <p className="text-sm text-muted-foreground">Verify your email address for account recovery</p>
                </div>
                <Badge variant={mockUser.emailVerified ? "default" : "destructive"}>
                  {mockUser.emailVerified ? "Verified" : "Not Verified"}
                </Badge>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Password Security</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Key className="size-4 text-blue-500" />
                      <span className="font-medium">Master Password</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Last changed 45 days ago</p>
                    <Button variant="outline" size="sm">Change Password</Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="size-4 text-green-500" />
                      <span className="font-medium">Login Sessions</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">2 active sessions</p>
                    <Button variant="outline" size="sm">Manage Sessions</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="size-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your recent vault activity and security events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.details}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <Button variant="outline" className="w-full">
                  View Full Activity Log
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>Irreversible account actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  These actions are permanent and cannot be undone. Please proceed with caution.
                </AlertDescription>
              </Alert>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" className="flex-1">
                  Export All Data
                </Button>
                <Button variant="destructive" className="flex-1">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
} 