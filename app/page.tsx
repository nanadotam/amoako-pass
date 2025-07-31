"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Eye, EyeOff, Copy, Plus, Search, Grid3X3, List, MoreHorizontal, Star, Heart, Filter, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useToast } from "@/hooks/use-toast"
import { PasswordGenerator } from "@/components/password-generator"
import { PasswordDetailModal } from "@/components/password-detail-modal"
import { EditPasswordModal } from "@/components/edit-password-modal"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"

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
    isFavorite: true,
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
    isFavorite: false,
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
    isFavorite: true,
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
    isFavorite: false,
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
const securityFilters = ["All", "Strong", "Weak", "Compromised", "2FA Enabled"]

export default function Dashboard() {
  const [passwords, setPasswords] = useState(mockPasswords)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedSecurityFilter, setSelectedSecurityFilter] = useState("All")
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
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

  const toggleFavorite = (id: number, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation()
    }
    
    const updatedPasswords = passwords.map(p => 
      p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
    )
    setPasswords(updatedPasswords)
    
    const password = passwords.find(p => p.id === id)
    toast({
      title: password?.isFavorite ? "Removed from favorites" : "Added to favorites",
      description: `${password?.website} has been ${password?.isFavorite ? "removed from" : "added to"} your favorites.`,
    })
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
    const matchesFavorites = !showFavoritesOnly || password.isFavorite
    
    const matchesSecurity = (() => {
      switch (selectedSecurityFilter) {
        case "Strong":
          return password.securityScore >= 80
        case "Weak":
          return password.securityScore < 60
        case "Compromised":
          return password.isCompromised
        case "2FA Enabled":
          return password.twoFactorEnabled
        default:
          return true
      }
    })()
    
    return matchesSearch && matchesCategory && matchesFavorites && matchesSecurity
  })

  const favoritesCount = passwords.filter(p => p.isFavorite).length
  const weakPasswordsCount = passwords.filter(p => p.securityScore < 60).length
  const compromisedCount = passwords.filter(p => p.isCompromised).length

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Password Vault</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setShowGenerator(true)} size="sm">
              <Plus className="size-4 mr-2" />
              Generate
            </Button>
          </div>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="p-4 lg:p-6 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
          <Input
            placeholder="Search passwords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Unified Dashboard */}
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold">Security Dashboard</h2>
              <p className="text-sm text-muted-foreground">Monitor your password security and manage your vault</p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant={showFavoritesOnly ? "default" : "outline"} 
                size="sm"
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              >
                <Heart className={`size-4 mr-2 ${showFavoritesOnly ? "fill-current" : ""}`} />
                Favorites {favoritesCount > 0 && `(${favoritesCount})`}
              </Button>
              <Button variant="outline" size="sm">
                View Full Report
              </Button>
            </div>
          </div>
          
          {/* Security Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                  <Shield className="size-4 text-green-600" />
                </div>
                <span className="font-medium">Security Score</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-green-600">85</span>
                <span className="text-sm text-muted-foreground">/100</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Good security overall</p>
            </div>

            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
                  <Heart className="size-4 text-red-600" />
                </div>
                <span className="font-medium">Favorites</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-red-600">{favoritesCount}</span>
                <span className="text-sm text-muted-foreground">passwords</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Quick access items</p>
            </div>

            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg">
                  <Filter className="size-4 text-yellow-600" />
                </div>
                <span className="font-medium">Weak Passwords</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-yellow-600">{weakPasswordsCount}</span>
                <span className="text-sm text-muted-foreground">passwords</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Need strengthening</p>
            </div>

            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                  <Search className="size-4 text-orange-600" />
                </div>
                <span className="font-medium">Compromised</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-orange-600">{compromisedCount}</span>
                <span className="text-sm text-muted-foreground">passwords</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">In known breaches</p>
            </div>
          </div>

          {/* Unified Filters */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-muted-foreground">Categories:</span>
              <div className="flex gap-2 overflow-x-auto flex-1">
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
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-muted-foreground">Security:</span>
              <div className="flex gap-2 overflow-x-auto flex-1">
                {securityFilters.map((filter) => (
                  <Button
                    key={filter}
                    variant={selectedSecurityFilter === filter ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSecurityFilter(filter)}
                    className="whitespace-nowrap"
                  >
                    {filter}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t">
            <Button variant="outline" size="sm" onClick={() => setSelectedSecurityFilter("Weak")}>
              Fix Weak Passwords
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSelectedSecurityFilter("2FA Enabled")}>
              Enable 2FA
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowGenerator(true)}>
              Generate Strong Password
            </Button>
            <div className="flex gap-2 ml-auto">
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
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{password.website}</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 h-6 w-6"
                            onClick={(e) => toggleFavorite(password.id, e)}
                          >
                            <Star className={`size-4 ${password.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                          </Button>
                        </div>
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
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toggleFavorite(password.id); }}>
                          {password.isFavorite ? "Remove from favorites" : "Add to favorites"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
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
                      {password.isFavorite && (
                        <Badge variant="outline" className="text-xs text-yellow-600">
                          <Star className="size-3 mr-1 fill-current" />
                          Favorite
                        </Badge>
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
            {showFavoritesOnly && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setShowFavoritesOnly(false)}
              >
                Show all passwords
              </Button>
            )}
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
