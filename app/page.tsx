"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"
import avatar from "@/public/Illustration.png"

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setIsVisible(true)

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-black">
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 left-3/4 w-48 h-48 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-3/4 left-0 w-48 h-48 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Header */}
      <header className="bg-black/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div
              className={`flex items-center transform transition-all duration-1000 ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"}`}
            >
              <h2 className="text-3xl bg-gradient-to-r from-[#d67df7] to-[#605dfe] text-transparent bg-clip-text font-semibold flex items-center space-x-1">
                <span>✦</span>
                <span>FlockShop</span>
              </h2>
            </div>

            <div
              className={`hidden sm:flex items-center space-x-4 transform transition-all duration-1000 delay-300 ${isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}`}
            >
              <Link href="/login">
<Button variant="gradientOutline" className='hover:text-black'>Log in</Button>

              </Link>
              <Link href="/signup">
                <Button className="text-sm px-4 py-1.5 bg-gradient-to-r from-[#d67df7] to-[#605dfe] hover:brightness-110 text-black">Sign up</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <div className="flex flex-col-reverse lg:flex-row items-center justify-center px-6 sm:px-10 md:px-20 lg:px-40 pt-20 gap-10">
        {/* Text section */}
        <div
          className={`w-full lg:w-1/2 text-center lg:text-left transform transition-all duration-1000 ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"}`}
        >
          <h3 className="text-4xl sm:text-5xl lg:text-6xl font-semibold mb-4 text-[#ebb5fe]">
  Create and share your{" "}
  <span className="bg-gradient-to-r from-[#d67df7] to-[#605dfe] text-transparent bg-clip-text">
    wishlist
  </span>
</h3>

          <p className="text-gray-300 text-lg sm:text-xl mt-4 mb-6">
            Collaborate with friends and family on your favorite products.
          </p>
          <Link href="/signup">
            <Button className="bg-gradient-to-r from-[#d67df7] to-[#605dfe] hover:brightness-110 text-black">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Image section */}
        <div
          className={`w-full lg:w-1/2 flex justify-center transform transition-all duration-1000 delay-300 ${isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}`}
        >
          <Image src={avatar} alt="avatar" width={350} height={350} className="w-64 sm:w-80 md:w-96 h-auto" />
        </div>
      </div>
    </div>
  )
}
