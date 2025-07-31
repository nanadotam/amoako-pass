"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Eye, EyeOff, Copy, Wifi, Lock, Unlock, MoreHorizontal, Star, Heart, MapPin, QrCode, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useToast } from "@/hooks/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"

const mockWifiPasswords = [
  {
    id: 1,
    ssid: "HomeNetwork_5G",
    password: "MySecureWifi123!",
    security: "WPA3",
    location: "Home",
    lastConnected: "Today",
    isFavorite: true,
    notes: "Main home network with fastest connection",
    createdAt: "2024-01-10",
    accessCount: 45,
  },
  {
    id: 2,
    ssid: "Office_Guest",
    password: "GuestAccess2024",
    security: "WPA2",
    location: "Work",
    lastConnected: "Yesterday",
    isFavorite: false,
    notes: "Guest network for visitors",
    createdAt: "2024-02-15",
    accessCount: 12,
  },
  {
    id: 3,
    ssid: "CoffeeShop_Free",
    password: "",
    security: "Open",
    location: "Downtown Cafe",
    lastConnected: "1 week ago",
    isFavorite: false,
    notes: "Free WiFi at the local coffee shop",
    createdAt: "2024-03-20",
    accessCount: 8,
  },
  {
    id: 4,
    ssid: "Neighbor_WiFi",
    password: "SharedNetwork456",
    security: "WPA2",
    location: "Shared",
    lastConnected: "2 weeks ago",
    isFavorite: true,
    notes: "Shared with trusted neighbor",
    createdAt: "2024-01-25",
    accessCount: 23,
  },
]

const securityFilters = ["All", "WPA3", "WPA2", "WEP", "Open"]
const locationFilters = ["All", "Home", "Work", "Public", "Shared"]

export default function WiFiPasswords() {
  const [wifiNetworks, setWifiNetworks] = useState(mockWifiPasswords)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSecurityFilter, setSelectedSecurityFilter] = useState("All")
  const [selectedLocationFilter, setSelectedLocationFilter] = useState("All")
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
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

  const toggleFavorite = (id: number, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation()
    }
    
    const updatedNetworks = wifiNetworks.map(w => 
      w.id === id ? { ...w, isFavorite: !w.isFavorite } : w
    )
    setWifiNetworks(updatedNetworks)
    
    const network = wifiNetworks.find(w => w.id === id)
    toast({
      title: network?.isFavorite ? "Removed from favorites" : "Added to favorites",
      description: `${network?.ssid} has been ${network?.isFavorite ? "removed from" : "added to"} your favorites.`,
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

  const generateQRCode = (wifi: typeof mockWifiPasswords[0]) => {
    // In a real app, this would generate a QR code for WiFi connection
    toast({
      title: "QR Code Generated",
      description: `QR code for ${wifi.ssid} has been generated.`,
    })
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

  const getLocationIcon = (location: string) => {
    return <MapPin className="size-4 text-muted-foreground" />
  }

  const filteredWifi = wifiNetworks.filter((wifi) => {
    const matchesSearch = wifi.ssid.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         wifi.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSecurity = selectedSecurityFilter === "All" || wifi.security === selectedSecurityFilter
    const matchesLocation = selectedLocationFilter === "All" || wifi.location === selectedLocationFilter
    const matchesFavorites = !showFavoritesOnly || wifi.isFavorite
    
    return matchesSearch && matchesSecurity && matchesLocation && matchesFavorites
  })

  const favoritesCount = wifiNetworks.filter(w => w.isFavorite).length
  const secureNetworksCount = wifiNetworks.filter(w => w.security === "WPA3" || w.security === "WPA2").length
  const publicNetworksCount = wifiNetworks.filter(w => w.security === "Open").length

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-xl font-semibold">WiFi Passwords</h1>
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
            <Button size="sm">
              <Plus className="size-4 mr-2" />
              Add WiFi
            </Button>
          </div>
        </div>
      </header>

      <div className="p-4 lg:p-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Wifi className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
          <Input
            placeholder="Search WiFi networks or locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <Heart className="size-4 text-red-500" />
              <span className="font-medium">Favorites</span>
            </div>
            <p className="text-2xl font-bold">{favoritesCount}</p>
          </div>
          
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <Lock className="size-4 text-green-500" />
              <span className="font-medium">Secure Networks</span>
            </div>
            <p className="text-2xl font-bold">{secureNetworksCount}</p>
          </div>
          
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <Unlock className="size-4 text-red-500" />
              <span className="font-medium">Open Networks</span>
            </div>
            <p className="text-2xl font-bold">{publicNetworksCount}</p>
          </div>
        </div>

        {/* Security Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <span className="text-sm font-medium text-muted-foreground min-w-fit px-2 py-1">Security:</span>
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

        {/* Location Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <span className="text-sm font-medium text-muted-foreground min-w-fit px-2 py-1">Location:</span>
          {locationFilters.map((filter) => (
            <Button
              key={filter}
              variant={selectedLocationFilter === filter ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedLocationFilter(filter)}
              className="whitespace-nowrap"
            >
              {filter}
            </Button>
          ))}
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
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{wifi.ssid}</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 h-6 w-6"
                            onClick={(e) => toggleFavorite(wifi.id, e)}
                          >
                            <Star className={`size-4 ${wifi.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>Last connected: {wifi.lastConnected}</span>
                          {wifi.location && (
                            <>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <MapPin className="size-3" />
                                <span>{wifi.location}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toggleFavorite(wifi.id)}>
                          {wifi.isFavorite ? "Remove from favorites" : "Add to favorites"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => generateQRCode(wifi)}>
                          <QrCode className="size-4 mr-2" />
                          Share QR Code
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {getSecurityIcon(wifi.security)}
                    <Badge className={getSecurityColor(wifi.security)}>{wifi.security}</Badge>
                    {wifi.isFavorite && (
                      <Badge variant="outline" className="text-xs text-yellow-600">
                        <Star className="size-3 mr-1 fill-current" />
                        Favorite
                      </Badge>
                    )}
                    {wifi.location && (
                      <Badge variant="outline" className="text-xs">
                        <MapPin className="size-3 mr-1" />
                        {wifi.location}
                      </Badge>
                    )}
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

                  {wifi.notes && (
                    <div className="text-sm text-muted-foreground">
                      <strong>Notes:</strong> {wifi.notes}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Connected {wifi.accessCount} times</span>
                    <span>Added: {new Date(wifi.createdAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {filteredWifi.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No WiFi networks found matching your search.</p>
            {showFavoritesOnly && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setShowFavoritesOnly(false)}
              >
                Show all networks
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
