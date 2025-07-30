"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Edit, Trash2, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

const mockCategories = [
  { id: 1, name: "Development", count: 5, color: "bg-blue-500", protected: false },
  { id: 2, name: "Email", count: 3, color: "bg-green-500", protected: false },
  { id: 3, name: "Entertainment", count: 8, color: "bg-purple-500", protected: false },
  { id: 4, name: "Shopping", count: 4, color: "bg-orange-500", protected: false },
  { id: 5, name: "Social", count: 6, color: "bg-pink-500", protected: false },
  { id: 6, name: "Banking", count: 2, color: "bg-red-500", protected: true },
  { id: 7, name: "Work", count: 7, color: "bg-indigo-500", protected: false },
  { id: 8, name: "Personal", count: 3, color: "bg-teal-500", protected: false },
]

export default function Categories() {
  const [categories, setCategories] = useState(mockCategories)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const { toast } = useToast()

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return

    const newCategory = {
      id: Date.now(),
      name: newCategoryName,
      count: 0,
      color: `bg-${["blue", "green", "purple", "orange", "pink", "indigo", "teal"][Math.floor(Math.random() * 7)]}-500`,
      protected: false,
    }

    setCategories([...categories, newCategory])
    setNewCategoryName("")
    setShowAddDialog(false)
    toast({
      title: "Category added",
      description: `"${newCategoryName}" has been added to your categories.`,
    })
  }

  const handleEditCategory = () => {
    if (!editingCategory?.name.trim()) return

    setCategories(
      categories.map((cat) => (cat.id === editingCategory.id ? { ...cat, name: editingCategory.name } : cat)),
    )
    setShowEditDialog(false)
    setEditingCategory(null)
    toast({
      title: "Category updated",
      description: "Category has been successfully updated.",
    })
  }

  const handleDeleteCategory = (id: number) => {
    const category = categories.find((cat) => cat.id === id)
    if (category?.protected) {
      toast({
        title: "Cannot delete",
        description: "This is a protected category and cannot be deleted.",
        variant: "destructive",
      })
      return
    }

    setCategories(categories.filter((cat) => cat.id !== id))
    toast({
      title: "Category deleted",
      description: "Category has been successfully deleted.",
    })
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Categories</h1>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="size-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogDescription>Create a new category to organize your passwords.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category-name">Category Name</Label>
                  <Input
                    id="category-name"
                    placeholder="Enter category name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCategory}>Add Category</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="p-4 lg:p-6">
        <motion.div
          className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 ${category.color} rounded-lg`}>
                        <FolderOpen className="size-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {category.count} password{category.count !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingCategory(category)
                          setShowEditDialog(true)
                        }}
                        disabled={category.protected}
                      >
                        <Edit className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCategory(category.id)}
                        disabled={category.protected}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{category.count} items</Badge>
                    {category.protected && (
                      <Badge variant="outline" className="text-xs">
                        Protected
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Edit Category Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>Update the category name.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category-name">Category Name</Label>
                <Input
                  id="edit-category-name"
                  placeholder="Enter category name"
                  value={editingCategory?.name || ""}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditCategory}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
