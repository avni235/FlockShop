"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Plus, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface Product {
  _id: string
  name: string
  price: number
  imageUrl: string
  description: string
  addedBy: {
    name: string
    email: string
  }
  createdAt: string
}

interface Wishlist {
  _id: string
  name: string
  description: string
  createdBy: {
    name: string
    email: string
  }
  collaborators: Array<{
    name: string
    email: string
  }>
  products: Product[]
  createdAt: string
}

export default function WishlistPage() {
  const params = useParams()
  const [wishlist, setWishlist] = useState<Wishlist | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [productForm, setProductForm] = useState({ name: "", price: "", imageUrl: "", description: "" })
  const [error, setError] = useState("")
  const { toast } = useToast()
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")


  useEffect(() => {
    if (params.id) fetchWishlist()
  }, [params.id])

  const fetchWishlist = async () => {
    try {
      const response = await fetch(`/api/wishlists/${params.id}`)
      if (response.ok) setWishlist(await response.json())
      else setError("Wishlist not found")
    } catch {
      setError("Failed to load wishlist")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/wishlists/${params.id}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...productForm, price: parseFloat(productForm.price) })
      })
      if (response.ok) {
        toast({ title: "Success", description: "Product added." })
        setProductForm({ name: "", price: "", imageUrl: "", description: "" })
        setShowAddProduct(false)
        fetchWishlist()
      } else {
        const err = await response.json()
        toast({ title: "Error", description: err.message || "Failed to add product", variant: "destructive" })
      }
    } catch {
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" })
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/wishlists/${params.id}/products/${productId}`, { method: "DELETE" })
      if (response.ok) {
        toast({ title: "Removed", description: "Product deleted." })
        fetchWishlist()
      } else {
        toast({ title: "Error", description: "Failed to delete", variant: "destructive" })
      }
    } catch {
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" })
    }
  }

  if (isLoading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center animate-pulse text-lg">Loading wishlist...</div>
  }

  if (error || !wishlist) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Wishlist not found</h2>
          <p className="text-gray-400 mb-4">It doesn't exist or failed to load.</p>
          <Link href="/dashboard">
            <Button variant="outline" className="border-[#00b8ff] text-white hover:bg-[#00b8ff] hover:text-black">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-black/80 backdrop-blur-xl border-b border-white/20 relative top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link
              href="/"
              className={`text-3xl bg-gradient-to-r from-[#d67df7] to-[#605dfe] text-transparent bg-clip-text font-semibold flex items-center space-x-1`}
            >
              ✦ FlockShop
            </Link>
          </div>
        </div>
      </header>

<Link href="/dashboard" className="flex items-center space-x-2 px-20 pt-5 text-white hover:text-[#ebb5fe]">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </Link>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <section className="mb-8">
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
    <div>
      <h2 className="text-4xl font-bold bg-gradient-to-r from-[#d67df7] to-[#605dfe] text-transparent bg-clip-text mb-1">
        {wishlist.name}
      </h2>
      <p className="text-lg text-[#e6b2f9]">{wishlist.description}</p>
    </div>

    {/* Invite Button */}
    <Dialog open={showInvite} onOpenChange={setShowInvite}>
      <DialogTrigger asChild>
        <Button
          variant="gradientOutline"
          className="text-white transition-all"
        >
          Invite
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black border border-[#00b8ff]/30">
        <DialogHeader>
          <DialogTitle className="text-white">Invite Collaborator</DialogTitle>
          <DialogDescription className="text-gray-400">
            Enter the email of the user you want to invite.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            toast({
              title: "Invite Sent",
              description: `Mock invite sent to ${inviteEmail}`,
            })
            setInviteEmail("")
            setShowInvite(false)
          }}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="invite-email" className="text-white">
              Email Address
            </Label>
            <Input
              id="invite-email"
              type="email"
              placeholder="name@example.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="bg-white/10 text-white mt-1"
              required
            />
          </div>
          <Button
            type="submit"
            className="bg-gradient-to-r from-[#d67df7] to-[#605dfe] hover:brightness-110 text-black w-full"
          >
            Send Invite
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  </div>

          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-400">Created by {wishlist.createdBy.name}</span>
            <span className="text-gray-500">• {new Date(wishlist.createdAt).toLocaleDateString()}</span>
            <Badge className="bg-[#00b8ff]/10 text-[#00b8ff] border border-[#00b8ff]/20">{wishlist.collaborators.length + 1} members</Badge>
          </div>
        </section>

        <section className="mb-6">
          <Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-[#d67df7] to-[#605dfe] hover:brightness-110 text-black">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black border border-[#00b8ff]/30">
              <DialogHeader>
                <DialogTitle className="text-white">Add Product</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <Label htmlFor="productName" className="text-white">Name</Label>
                  <Input id="productName" className="bg-white/10 text-white" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="price" className="text-white">Price</Label>
                  <Input id="price" type="number" className="bg-white/10 text-white" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="imageUrl" className="text-white">Image URL</Label>
                  <Input id="imageUrl" className="bg-white/10 text-white" value={productForm.imageUrl} onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="description" className="text-white">Description</Label>
                  <Textarea id="description" className="bg-white/10 text-white" value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} />
                </div>
                <Button type="submit" className="bg-gradient-to-r from-[#d67df7] to-[#605dfe] hover:brightness-110 text-black w-full">Submit</Button>
              </form>
            </DialogContent>
          </Dialog>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.products.map((product) => (
            <Card key={product._id} className="bg-white/5 border border-white/10 hover:border-[#00b8ff]/30 hover:shadow-md transition-shadow">
              <CardHeader className="p-0 overflow-hidden rounded-t-lg relative">
                <Image
                  src={product.imageUrl || "/placeholder.svg?height=200&width=200"}
                  alt={product.name}
                  width={400}
                  height={200}
                  className="object-cover w-full h-52"
                />
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-white text-lg line-clamp-1">{product.name}</CardTitle>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" className="text-gray-400 hover:text-red-500" onClick={() => handleDeleteProduct(product._id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-green-400 font-bold text-xl mb-2">₹{product.price.toFixed(2)}</p>
                <CardDescription className="text-gray-300 line-clamp-2 text-sm mb-2">{product.description}</CardDescription>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="bg-[#00b8ff]/30 text-white text-sm">
                      {product.addedBy.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span>{product.addedBy.name}</span>
                  <span>•</span>
                  <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {wishlist.products.length === 0 && (
          <div className="text-center mt-16">
            <Plus className="w-12 h-12 text-white mx-auto mb-4 animate-pulse" />
            <h3 className="text-xl font-semibold text-white mb-2">No products added yet</h3>
            <p className="text-gray-400 mb-4">Start adding products to this wishlist</p>
            <Button onClick={() => setShowAddProduct(true)} className="bg-gradient-to-r from-[#d67df7] to-[#605dfe] hover:brightness-110 text-black">
              <Plus className="w-4 h-4 mr-2" /> Add Your First Product
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
