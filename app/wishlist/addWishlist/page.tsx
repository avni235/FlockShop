"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function NewWishlistPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!formData.name.trim()) {
      setError("Wishlist name is required")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/wishlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Wishlist created successfully",
        })
        router.push(`/wishlist/${data._id}`)
      } else {
        setError(data.message || "Failed to create wishlist")
      }
    } catch (error) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
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
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#bd00ff] to-[#d600ff] bg-clip-text text-transparent">
            Create New Wishlist
          </h1>
          <p className="mt-2 text-gray-400">
            Start a new collaborative shopping experience with your team.
          </p>
        </div>

        <Card className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-lg">
          <CardHeader>
            <CardTitle className="text-white">Wishlist Details</CardTitle>
            <CardDescription className="text-gray-400">
              Provide basic information about your wishlist
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-white">
                  Wishlist Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g., Birthday Gifts"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 bg-white/10 text-white border-white/20 placeholder:text-gray-400 focus:ring-2 focus:ring-[#d67df7]"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Choose a clear, descriptive name for your wishlist
                </p>
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium text-white">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the purpose of this wishlist..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="mt-1 bg-white/10 text-white border-white/20 placeholder:text-gray-400 focus:ring-2 focus:ring-[#605dfe]"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Help collaborators understand the context and goals
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <Link href="/dashboard" className="flex-1">
                  <Button
                    type="button"
                    variant="gradientOutline"
                    className="w-full border-white/20 text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#d67df7] to-[#605dfe] hover:brightness-110 text-white transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating..." : "Create Wishlist"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
