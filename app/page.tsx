"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Eye, EyeOff, Copy, Plus, Search, Grid3X3, List, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useToast } from "@/hooks/use-toast"
import { PasswordGenerator } from "@/components/password-generator"
import { PasswordDetailModal } from "@/components/password-detail-modal"
import { EditPasswordModal } from "@/components/edit-password-modal"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const mockPasswords = [
  {
    id: 1,
    website: "GitHub",
    username: "john.doe@email.com",
    password: "Gh$9kL2mN!pQ",
    category: "Development",
    favicon: "https://github.com/favicon.ico",
    lastUsed: "2 hours ago",
    createdAt: "2024-01-15",
    updatedAt: "2024-12-20",
    usageCount: 247,
    securityScore: 92,
    passwordAge: 45,
    notes: "Work development account with 2FA enabled",
    tags: ["work", "development", "important"],
    isCompromised: false,
    twoFactorEnabled: true,
    url: "https://github.com",
    alternativeEmails: ["john.work@company.com"],
    securityQuestions: [
      { question: "What was your first pet's name?", answer: "Buddy" },
      { question: "What city were you born in?", answer: "New York" }
    ],
    loginHistory: [
      { date: "Dec 20, 2024", location: "San Francisco, CA", device: "MacBook Pro", successful: true },
      { date: "Dec 19, 2024", location: "San Francisco, CA", device: "iPhone 15", successful: true },
      { date: "Dec 18, 2024", location: "New York, NY", device: "MacBook Pro", successful: true },
      { date: "Dec 17, 2024", location: "Unknown", device: "Windows PC", successful: false },
      { date: "Dec 16, 2024", location: "San Francisco, CA", device: "MacBook Pro", successful: true }
    ]
  },
  {
    id: 2,
    website: "Gmail",
    username: "john.doe@gmail.com",
    password: "Em@il123!Secure",
    category: "Email",
    favicon: "https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico",
    lastUsed: "1 day ago",
    createdAt: "2023-06-10",
    updatedAt: "2024-11-15",
    usageCount: 892,
    securityScore: 78,
    passwordAge: 193,
    notes: "Primary email account",
    tags: ["personal", "email", "important"],
    isCompromised: false,
    twoFactorEnabled: true,
    url: "https://gmail.com",
    alternativeEmails: [],
    securityQuestions: [
      { question: "What is your mother's maiden name?", answer: "Johnson" }
    ],
    loginHistory: [
      { date: "Dec 19, 2024", location: "San Francisco, CA", device: "iPhone 15", successful: true },
      { date: "Dec 19, 2024", location: "San Francisco, CA", device: "MacBook Pro", successful: true },
      { date: "Dec 18, 2024", location: "San Francisco, CA", device: "MacBook Pro", successful: true }
    ]
  },
  {
    id: 3,
    website: "Netflix",
    username: "johndoe",
    password: "N3tfl!x2024$",
    category: "Entertainment",
    favicon: "https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2023.ico",
    lastUsed: "3 days ago",
    createdAt: "2024-03-20",
    updatedAt: "2024-03-20",
    usageCount: 156,
    securityScore: 85,
    passwordAge: 275,
    notes: "Family subscription account",
    tags: ["entertainment", "family"],
    isCompromised: false,
    twoFactorEnabled: false,
    url: "https://netflix.com",
    alternativeEmails: ["family@doe.com"],
    securityQuestions: [],
    loginHistory: [
      { date: "Dec 17, 2024", location: "San Francisco, CA", device: "Apple TV", successful: true },
      { date: "Dec 15, 2024", location: "San Francisco, CA", device: "iPad", successful: true },
      { date: "Dec 12, 2024", location: "Los Angeles, CA", device: "Smart TV", successful: true }
    ]
  },
  {
    id: 4,
    website: "Amazon",
    username: "john.doe@email.com",
    password: "Am@z0n!Shop123",
    category: "Shopping",
    favicon: "https://www.amazon.com/favicon.ico",
    lastUsed: "1 week ago",
    createdAt: "2022-11-05",
    updatedAt: "2024-08-10",
    usageCount: 445,
    securityScore: 68,
    passwordAge: 410,
    notes: "Shopping account with saved payment methods",
    tags: ["shopping", "frequent"],
    isCompromised: false,
    twoFactorEnabled: false,
    url: "https://amazon.com",
    alternativeEmails: [],
    securityQuestions: [
      { question: "What was the name of your first school?", answer: "Lincoln Elementary" },
      { question: "What is your favorite movie?", answer: "The Matrix" }
    ],
    loginHistory: [
      { date: "Dec 13, 2024", location: "San Francisco, CA", device: "iPhone 15", successful: true },
      { date: "Dec 10, 2024", location: "San Francisco, CA", device: "MacBook Pro", successful: true },
      { date: "Dec 8, 2024", location: "San Francisco, CA", device: "iPad", successful: true }
    ]
  },
]

const categories = ["All", "Development", "Email", "Entertainment", "Shopping", "Social", "Banking"]

export default function Dashboard() {
  const [passwords, setPasswords] = useState(mockPasswords)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [visiblePasswords, setVisiblePasswords] = useState<Set<number>>(new Set())
  const [showGenerator, setShowGenerator] = useState(false)
  const [selectedPassword, setSelectedPassword] = useState<typeof mockPasswords[0] | null>(null)
  const [showPasswordDetail, setShowPasswordDetail] = useState(false)
  const [showEditPassword, setShowEditPassword] = useState(false)
  const { toast } = useToast()

  const togglePasswordVisibility = (id: number) => {
    const newVisible = new Set(visiblePasswords)
    if (newVisible.has(id)) {
      newVisible.delete(id)
    } else {
      newVisible.add(id)
    }
    setVisiblePasswords(newVisible)
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard`,
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const handlePasswordClick = (password: typeof mockPasswords[0]) => {
    setSelectedPassword(password)
    setShowPasswordDetail(true)
    // Increment usage count (in real app, this would be handled by backend)
    const updatedPasswords = passwords.map(p => 
      p.id === password.id ? { ...p, usageCount: p.usageCount + 1, lastUsed: "Just now" } : p
    )
    setPasswords(updatedPasswords)
  }

  const handleEditPassword = (password: typeof mockPasswords[0]) => {
    setSelectedPassword(password)
    setShowPasswordDetail(false)
    setShowEditPassword(true)
  }

  const handleSavePassword = (updatedPassword: typeof mockPasswords[0]) => {
    const updatedPasswords = passwords.map(p => 
      p.id === updatedPassword.id ? updatedPassword : p
    )
    setPasswords(updatedPasswords)
    setSelectedPassword(updatedPassword) // Update the selected password for the detail modal
  }

  const handleDeletePassword = (passwordId: number) => {
    const updatedPasswords = passwords.filter(p => p.id !== passwordId)
    setPasswords(updatedPasswords)
    setShowPasswordDetail(false)
    
    toast({
      title: "Password deleted",
      description: "The password has been permanently removed.",
    })
  }

  const filteredPasswords = passwords.filter((password) => {
    const matchesSearch =
      password.website.toLowerCase().includes(searchQuery.toLowerCase()) ||
      password.username.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || password.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Password Vault</h1>
          </div>
          <Button onClick={() => setShowGenerator(true)} size="sm">
            <Plus className="size-4 mr-2" />
            Generate
          </Button>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="p-4 lg:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
            <Input
              placeholder="Search passwords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="lg:hidden"
            >
              <List className="size-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="hidden lg:flex"
            >
              <Grid3X3 className="size-4" />
            </Button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Password Cards */}
        <motion.div
          className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {filteredPasswords.map((password, index) => (
            <motion.div
              key={password.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handlePasswordClick(password)}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={password.favicon || "/placeholder.svg"}
                        alt={`${password.website} favicon`}
                        className="size-8 rounded"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=32&width=32&text=" + password.website[0]
                        }}
                      />
                      <div>
                        <h3 className="font-semibold">{password.website}</h3>
                        <p className="text-sm text-muted-foreground">{password.username}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditPassword(password); }}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDeletePassword(password.id); }}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{password.category}</Badge>
                      {password.twoFactorEnabled && (
                        <Badge variant="outline" className="text-xs text-green-600">2FA</Badge>
                      )}
                      {password.isCompromised && (
                        <Badge variant="destructive" className="text-xs">Risk</Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{password.lastUsed}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1 font-mono text-sm bg-muted rounded px-3 py-2">
                      {visiblePasswords.has(password.id) ? password.password : "••••••••••••"}
                    </div>
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); togglePasswordVisibility(password.id); }}>
                      {visiblePasswords.has(password.id) ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); copyToClipboard(password.password, "Password"); }}>
                      <Copy className="size-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Used {password.usageCount} times</span>
                    <span>Security: {password.securityScore}/100</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {filteredPasswords.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No passwords found matching your criteria.</p>
          </div>
        )}
      </div>

      <PasswordGenerator open={showGenerator} onOpenChange={setShowGenerator} />
      <PasswordDetailModal 
        password={selectedPassword}
        open={showPasswordDetail}
        onOpenChange={setShowPasswordDetail}
        onEdit={handleEditPassword}
        onDelete={handleDeletePassword}
      />
      <EditPasswordModal
        password={selectedPassword}
        open={showEditPassword}
        onOpenChange={setShowEditPassword}
        onSave={handleSavePassword}
      />
    </div>
  )
}
