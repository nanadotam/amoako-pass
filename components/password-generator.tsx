"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Copy, RefreshCw } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"

interface PasswordGeneratorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PasswordGenerator({ open, onOpenChange }: PasswordGeneratorProps) {
  const [length, setLength] = useState([16])
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [password, setPassword] = useState("")
  const { toast } = useToast()
  const isMobile = useMobile()

  const generatePassword = () => {
    let charset = ""
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz"
    if (includeNumbers) charset += "0123456789"
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?"

    if (charset === "") {
      setPassword("")
      return
    }

    let result = ""
    for (let i = 0; i < length[0]; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    setPassword(result)
  }

  useEffect(() => {
    generatePassword()
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols])

  const copyPassword = async () => {
    if (!password) return

    try {
      await navigator.clipboard.writeText(password)
      toast({
        title: "Copied!",
        description: "Password copied to clipboard",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy password",
        variant: "destructive",
      })
    }
  }

  const getStrength = () => {
    let score = 0
    if (length[0] >= 12) score += 1
    if (length[0] >= 16) score += 1
    if (includeUppercase) score += 1
    if (includeLowercase) score += 1
    if (includeNumbers) score += 1
    if (includeSymbols) score += 1

    if (score <= 2) return { label: "Weak", color: "bg-red-500" }
    if (score <= 4) return { label: "Fair", color: "bg-yellow-500" }
    if (score <= 5) return { label: "Good", color: "bg-blue-500" }
    return { label: "Strong", color: "bg-green-500" }
  }

  const strength = getStrength()

  const content = (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Generated Password</Label>
          <div className="flex items-center gap-2">
            <div className="flex-1 font-mono text-sm bg-muted rounded px-3 py-2 min-h-[40px] flex items-center">
              {password || "Configure options to generate password"}
            </div>
            <Button variant="ghost" size="sm" onClick={generatePassword} disabled={!password}>
              <RefreshCw className="size-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={copyPassword} disabled={!password}>
              <Copy className="size-4" />
            </Button>
          </div>
        </div>

        {password && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-2"
          >
            <Label>Strength</Label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-muted rounded-full h-2">
                <motion.div
                  className={`h-full rounded-full ${strength.color}`}
                  initial={{ width: 0 }}
                  animate={{
                    width: `${getStrength().label === "Weak" ? 25 : getStrength().label === "Fair" ? 50 : getStrength().label === "Good" ? 75 : 100}%`,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <span className="text-sm font-medium">{strength.label}</span>
            </div>
          </motion.div>
        )}
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Length: {length[0]}</Label>
          <Slider value={length} onValueChange={setLength} max={50} min={4} step={1} className="w-full" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Switch id="uppercase" checked={includeUppercase} onCheckedChange={setIncludeUppercase} />
            <Label htmlFor="uppercase">Uppercase</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="lowercase" checked={includeLowercase} onCheckedChange={setIncludeLowercase} />
            <Label htmlFor="lowercase">Lowercase</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="numbers" checked={includeNumbers} onCheckedChange={setIncludeNumbers} />
            <Label htmlFor="numbers">Numbers</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="symbols" checked={includeSymbols} onCheckedChange={setIncludeSymbols} />
            <Label htmlFor="symbols">Symbols</Label>
          </div>
        </div>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="px-4 pb-4">
          <DrawerHeader>
            <DrawerTitle>Password Generator</DrawerTitle>
            <DrawerDescription>Generate a secure password with custom options</DrawerDescription>
          </DrawerHeader>
          {content}
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Password Generator</DialogTitle>
          <DialogDescription>Generate a secure password with custom options</DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  )
}
