"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Eye, EyeOff, Copy, Wifi, Lock, Unlock, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useToast } from "@/hooks/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const mockWifiPasswords = [
  {
    id: 1,
    ssid: "HomeNetwork_5G",
    password: "MySecureWifi123!",
    security: "WPA3",
    lastConnected: "Today",
  },
  {
    id: 2,
    ssid: "Office_Guest",
    password: "GuestAccess2024",
    security: "WPA2",
    lastConnected: "Yesterday",
  },
  {
    id: 3,
    ssid: "CoffeeShop_Free",
    password: "",
    security: "Open",
    lastConnected: "1 week ago",
  },
  {
    id: 4,
    ssid: "Neighbor_WiFi",
    password: "SharedNetwork456",
    security: "WPA2",
    lastConnected: "2 weeks ago",
  },
]

export default function WiFiPasswords() {
  const [searchQuery, setSearchQuery] = useState("")
  const [visiblePasswords, setVisiblePasswords] = useState<Set<number>>(new Set())
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

  const getSecurityIcon = (security: string) => {
    switch (security) {
      case "WPA3":
        return <Lock className="size-4 text-green-500" />
      case "WPA2":
        return <Lock className="size-4 text-blue-500" />
      case "WEP":
        return <Lock className="size-4 text-yellow-500" />
      default:
        return <Unlock className="size-4 text-red-500" />
    }
  }

  const getSecurityColor = (security: string) => {
    switch (security) {
      case "WPA3":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "WPA2":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "WEP":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      default:
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    }
  }

  const filteredWifi = mockWifiPasswords.filter((wifi) => wifi.ssid.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-xl font-semibold">WiFi Passwords</h1>
          </div>
          <Button size="sm">
            <Plus className="size-4 mr-2" />
            Add WiFi
          </Button>
        </div>
      </header>

      <div className="p-4 lg:p-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Wifi className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
          <Input
            placeholder="Search WiFi networks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* WiFi Cards */}
        <motion.div
          className="grid gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {filteredWifi.map((wifi, index) => (
            <motion.div
              key={wifi.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-lg">
                        <Wifi className="size-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{wifi.ssid}</h3>
                        <p className="text-sm text-muted-foreground">Last connected: {wifi.lastConnected}</p>
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
                        <DropdownMenuItem>Share QR Code</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    {getSecurityIcon(wifi.security)}
                    <Badge className={getSecurityColor(wifi.security)}>{wifi.security}</Badge>
                  </div>

                  {wifi.password && (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 font-mono text-sm bg-muted rounded px-3 py-2">
                        {visiblePasswords.has(wifi.id) ? wifi.password : "••••••••••••"}
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => togglePasswordVisibility(wifi.id)}>
                        {visiblePasswords.has(wifi.id) ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(wifi.password, "WiFi Password")}>
                        <Copy className="size-4" />
                      </Button>
                    </div>
                  )}

                  {!wifi.password && (
                    <div className="text-sm text-muted-foreground italic">No password required (Open network)</div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {filteredWifi.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No WiFi networks found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
