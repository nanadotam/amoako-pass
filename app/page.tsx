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
  },
  {
    id: 2,
    website: "Gmail",
    username: "john.doe@gmail.com",
    password: "Em@il123!Secure",
    category: "Email",
    favicon: "https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico",
    lastUsed: "1 day ago",
  },
  {
    id: 3,
    website: "Netflix",
    username: "johndoe",
    password: "N3tfl!x2024$",
    category: "Entertainment",
    favicon: "https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2023.ico",
    lastUsed: "3 days ago",
  },
  {
    id: 4,
    website: "Amazon",
    username: "john.doe@email.com",
    password: "Am@z0n!Shop123",
    category: "Shopping",
    favicon: "https://www.amazon.com/favicon.ico",
    lastUsed: "1 week ago",
  },
]

const categories = ["All", "Development", "Email", "Entertainment", "Shopping", "Social", "Banking"]

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [visiblePasswords, setVisiblePasswords] = useState<Set<number>>(new Set())
  const [showGenerator, setShowGenerator] = useState(false)
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

  const filteredPasswords = mockPasswords.filter((password) => {
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
              <Card className="hover:shadow-md transition-shadow">
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
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{password.category}</Badge>
                    <span className="text-xs text-muted-foreground">{password.lastUsed}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1 font-mono text-sm bg-muted rounded px-3 py-2">
                      {visiblePasswords.has(password.id) ? password.password : "••••••••••••"}
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => togglePasswordVisibility(password.id)}>
                      {visiblePasswords.has(password.id) ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(password.password, "Password")}>
                      <Copy className="size-4" />
                    </Button>
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
    </div>
  )
}
