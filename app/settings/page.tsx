"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Shield, Key, Palette, Download, Upload, Bell, Database, Eye, Clock, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useToast } from "@/hooks/use-toast"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"

export default function Settings() {
  // Security Settings
  const [autoLock, setAutoLock] = useState(true)
  const [lockTimeout, setLockTimeout] = useState("15")
  const [requireMasterKey, setRequireMasterKey] = useState(true)
  const [biometric, setBiometric] = useState(false)
  
  // Appearance Settings
  const [theme, setTheme] = useState("system")
  const [defaultView, setDefaultView] = useState("grid")
  
  // Password Generator Settings
  const [passwordLength, setPasswordLength] = useState([16])
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  
  // Backup & Security Settings
  const [backupEnabled, setBackupEnabled] = useState(false)
  const [backupFrequency, setBackupFrequency] = useState("weekly")
  const [securityNotifications, setSecurityNotifications] = useState(true)
  
  const { toast } = useToast()

  const handleSave = () => {
    const settings = {
      auto_lock_timeout: parseInt(lockTimeout),
      require_master_key: requireMasterKey,
      theme,
      default_view: defaultView,
      password_generator_settings: {
        length: passwordLength[0],
        includeUppercase,
        includeLowercase,
        includeNumbers,
        includeSymbols
      },
      backup_enabled: backupEnabled,
      backup_frequency: backupFrequency,
      security_notifications: securityNotifications
    }
    
    console.log("Saving settings:", settings)
    
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    })
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Settings</h1>
          </div>
        </div>
      </header>

      <div className="p-4 lg:p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="size-5" />
                Security & Authentication
              </CardTitle>
              <CardDescription>Configure security and authentication settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-lock vault</Label>
                  <p className="text-sm text-muted-foreground">Automatically lock the vault after inactivity</p>
                </div>
                <Switch checked={autoLock} onCheckedChange={setAutoLock} />
              </div>

              {autoLock && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-2"
                >
                  <Label>Auto-lock timeout</Label>
                  <Select value={lockTimeout} onValueChange={setLockTimeout}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 minute</SelectItem>
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
              )}

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require master key for sensitive operations</Label>
                  <p className="text-sm text-muted-foreground">Ask for master password before showing passwords</p>
                </div>
                <Switch checked={requireMasterKey} onCheckedChange={setRequireMasterKey} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Biometric authentication</Label>
                  <p className="text-sm text-muted-foreground">Use fingerprint or face recognition to unlock</p>
                </div>
                <Switch checked={biometric} onCheckedChange={setBiometric} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Security notifications</Label>
                  <p className="text-sm text-muted-foreground">Get notified about security events and breaches</p>
                </div>
                <Switch checked={securityNotifications} onCheckedChange={setSecurityNotifications} />
              </div>
            </CardContent>
          </Card>

          {/* Master Password */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="size-5" />
                Master Password
              </CardTitle>
              <CardDescription>Change your master password and view security status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium">Current Master Password</p>
                  <p className="text-sm text-muted-foreground">Last changed: 45 days ago</p>
                </div>
                <Button variant="outline">Change Password</Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="size-4 text-green-500" />
                    <span className="font-medium">Strong Password</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Your master password meets security requirements</p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="size-4 text-blue-500" />
                    <span className="font-medium">Recent Activity</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Last login: Today at 2:30 PM</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Password Generator Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="size-5" />
                Password Generator
              </CardTitle>
              <CardDescription>Configure default settings for password generation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Password Length: {passwordLength[0]} characters</Label>
                </div>
                <Slider
                  value={passwordLength}
                  onValueChange={setPasswordLength}
                  min={4}
                  max={50}
                  step={1}
                  className="w-full"
                />
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="uppercase">Uppercase letters (A-Z)</Label>
                  <Switch
                    id="uppercase"
                    checked={includeUppercase}
                    onCheckedChange={setIncludeUppercase}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="lowercase">Lowercase letters (a-z)</Label>
                  <Switch
                    id="lowercase"
                    checked={includeLowercase}
                    onCheckedChange={setIncludeLowercase}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="numbers">Numbers (0-9)</Label>
                  <Switch
                    id="numbers"
                    checked={includeNumbers}
                    onCheckedChange={setIncludeNumbers}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="symbols">Symbols (!@#$%^&*)</Label>
                  <Switch
                    id="symbols"
                    checked={includeSymbols}
                    onCheckedChange={setIncludeSymbols}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="size-5" />
                Appearance & Interface
              </CardTitle>
              <CardDescription>Customize the look and feel of your vault</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Default view mode</Label>
                  <Select value={defaultView} onValueChange={setDefaultView}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">Grid view</SelectItem>
                      <SelectItem value="list">List view</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Backup & Data Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="size-5" />
                Backup & Data Management
              </CardTitle>
              <CardDescription>Configure automatic backups and data export options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Automatic backups</Label>
                  <p className="text-sm text-muted-foreground">Automatically backup your vault data</p>
                </div>
                <Switch checked={backupEnabled} onCheckedChange={setBackupEnabled} />
              </div>

              {backupEnabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label>Backup frequency</Label>
                    <Select value={backupFrequency} onValueChange={setBackupFrequency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Last backup</p>
                        <p className="text-sm text-muted-foreground">Yesterday at 3:00 AM</p>
                      </div>
                      <Button variant="outline" size="sm">View Backups</Button>
                    </div>
                  </div>
                </motion.div>
              )}

              <Separator />

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 bg-transparent" asChild>
                  <a href="/import">
                    <Upload className="size-4 mr-2" />
                    Import Data
                  </a>
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent" asChild>
                  <a href="/export">
                    <Download className="size-4 mr-2" />
                    Export Data
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="size-5" />
                Notifications
              </CardTitle>
              <CardDescription>Configure when and how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Security alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified about potential security threats</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weak password warnings</Label>
                  <p className="text-sm text-muted-foreground">Alerts for weak or reused passwords</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Backup reminders</Label>
                  <p className="text-sm text-muted-foreground">Reminders to backup your vault data</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} size="lg">Save All Settings</Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
