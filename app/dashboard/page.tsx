"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Users, Calendar, LogOut, Search, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import vector from "@/public/Group.png"
import Image from "next/image"

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
  itemCount: number
  createdAt: string
}

export default function DashboardPage() {
  const [wishlists, setWishlists] = useState<Wishlist[]>([])
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchWishlists()
    fetchUser()
    setIsVisible(true)
  }, [])

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        router.push("/login")
      }
    } catch {
      router.push("/login")
    }
  }

  const fetchWishlists = async () => {
    try {
      const response = await fetch("/api/wishlists")
      if (response.ok) {
        const data = await response.json()
        setWishlists(data)
      } else {
        toast({ title: "Error", description: "Failed to load wishlists", variant: "destructive" })
      }
    } catch {
      toast({ title: "Error", description: "Failed to load wishlists", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/")
  }

  const filteredWishlists = wishlists.filter(
    (wishlist) =>
      wishlist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wishlist.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="animate-pulse text-lg">Loading your dashboard...</p>
      </div>
    )
  }

  return (
    <div className=" h-screen overflow-hidden bg-black text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-3/4 w-64 h-64 bg-gradient-to-r from-[#d67df7]/10 to-[#605dfe]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-3/4 left-0 w-48 h-48 bg-gradient-to-r from-[#00b8ff]/10 to-[#d67df7]/10 rounded-full blur-2xl animate-bounce" style={{ animationDuration: "4s" }} />
      </div>

      <header className="bg-black/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link
              href="/"
              className={`text-3xl bg-gradient-to-r from-[#d67df7] to-[#605dfe] text-transparent bg-clip-text font-semibold flex items-center space-x-1`}
            >
              ✦ FlockShop
            </Link>
            <div className={`flex items-center space-x-4 transform transition-all duration-500 delay-300 ${isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}`}>
              <div className="flex items-center space-x-3">
  <Avatar className="w-10 h-10 ring-2 ring-[#00b8ff]/50">
    <AvatarFallback className="bg-gradient-to-r from-[#d67df7] to-[#605dfe] text-white text-xs">
                        {user?.name.charAt(0)}
                      </AvatarFallback>
  </Avatar>
  <div className="hidden sm:block">
    <p className="text-sm font-semibold text-white">{user?.name || "User"}</p>
    <p className="text-xs text-gray-400">{user?.email}</p>
  </div>
</div>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="text-white hover:text-red-500">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>


<div className="flex flex-row h-screen overflow-hidden mx-8 justify-center sm:justify-between gap-8">
      <div className="w-3/4 px-0 sm:px-6 lg:px-8 py-8 overflow-y-auto h-screen scrollbar-none">
        <div className={`mb-7 transform transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
          <div className="flex items-center mb-4">
            <h1 className="text-4xl text-center font-bold text-[#ebb5fe]">
              Dashboard
            </h1>
          </div>
        </div>
        <p className="text-xl text-gray-300 mb-5">Collaborate on a shared wishlist by adding products together.</p>
  <Card
    className={`group mb-8 lg:w-1/3 md:w-2/3 sm:w-3/3 relative bg-[#7d2cff]/10 backdrop-blur-md border border-[#7d2cff]/40 hover:border-[#d67df7] hover:ring-1 hover:ring-[#605dfe]/50 transform transition-all duration-300 cursor-pointer ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
    style={{ transitionDelay: `400ms` }}
  >
    <Link href="/wishlist/addWishlist">
    <CardHeader>
      <CardTitle className="text-white flex items-center space-x-2">
        <Plus className="w-5 h-5" />
        <span>Add New</span>
      </CardTitle>
      <CardDescription className="text-[#ccc] group-hover:text-[#e6b2f9]">
        Start a new wishlist and invite collaborators.
      </CardDescription>
    </CardHeader>
    </Link>
  </Card>
     <p className="text-xl text-gray-300 mb-5">Your Wishlists</p>
        <div className="grid pb-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWishlists.map((wishlist, index) => (
            <Link key={wishlist._id} href={`/wishlist/${wishlist._id}`}>
              <Card
                className={`group relative bg-black/50 backdrop-blur-md border border-[#7d2cff]/40 hover:border-[#d67df7] hover:ring-1 hover:ring-[#605dfe]/50 transform transition-all duration-300 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                style={{ transitionDelay: `${100}ms` }}
              >
                <CardHeader>
                  <CardTitle className="text-white group-hover:text-[#00b8ff]">{wishlist.name}</CardTitle>
                  <CardDescription className="text-[#ccc] group-hover:text-[#e6b2f9]">{wishlist.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm text-gray-400 mb-3">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{wishlist.collaborators.length + 1} members</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(wishlist.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-400">Created by</span>
                    <Avatar className="w-6 h-6 ring-2 ring-[#00b8ff]/50">
                      <AvatarFallback className="bg-gradient-to-r from-[#d67df7] to-[#605dfe] text-white text-xs">
                        {wishlist.createdBy.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-white">{wishlist.createdBy.name}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredWishlists.length === 0 && !isLoading && (
          <div className="mb-20">
          <div className={`text-center py-16 transform transition-all duration-700 delay-600 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-[#d67df7] to-[#605dfe] bg-clip-text text-transparent mb-2">
              {searchTerm ? "No wishlists found" : "Your wishlist journey starts here"}
            </h3>
            <p className="text-[#e6b2f9] mb-6 max-w-md mx-auto">
              {searchTerm
                ? "Try adjusting your search terms to find what you're looking for"
                : "Create your first collaborative wishlist and start building something amazing with your team"}
            </p>
            {!searchTerm && (
              <Link href="/wishlist/addWishlist">
                <Button className="bg-[#00b8ff] hover:bg-[#7ddafe] text-black shadow-lg transition-all duration-300">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Wishlist
                </Button>
              </Link>
            )}
          </div>
          </div>
        )}
        <div className="mt-20"></div>
      </div>


      <div className="hidden md:flex w-1/4 h-screen sticky top-0">
      <div className="flex flex-col pt-10">
        <Image src={vector} alt="avatar" width={350} height={350} className="w-64 sm:w-80 md:w-96 h-auto" />
        <div className="bg-black/30 border border-[#D600FF]/20 rounded-xl p-6 w-full max-w-sm backdrop-blur-md shadow-md hover:shadow-lg transition duration-300">
  <h3 className="text-lg font-semibold text-[#D600FF] mb-2">
    Ready to build your first shared wishlist?
  </h3>
  <p className="text-sm text-[#cccccc] mb-4">
    Create a wishlist and invite others to add items to it.
  </p>
  <Link href="/wishlist/addWishlist">
  <button className="w-full py-2 rounded-md border border-[#D600FF]/50 text-[#D600FF] hover:bg-[#D600FF]/10 transition duration-300">
    Get Started
  </button>
  </Link>
</div>

      </div>
      </div>
      </div>
    </div>
  )
}
