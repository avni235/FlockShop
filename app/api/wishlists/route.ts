import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { getDatabase } from "@/lib/mongodb"
import type { Wishlist } from "@/lib/models/wishlist"
import type { User } from "@/lib/models/Users"
import { ObjectId } from "mongodb"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

async function getAuthenticatedUser(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  if (!token) {
    throw new Error("Not authenticated")
  }

  const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string }
  const db = await getDatabase()
  const usersCollection = db.collection<User>("users")

  const user = await usersCollection.findOne({ _id: new ObjectId(decoded.userId) })
  if (!user) {
    throw new Error("User not found")
  }

  return user
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    const db = await getDatabase()
    const wishlistsCollection = db.collection<Wishlist>("wishlists")

    // Find wishlists where user is creator or collaborator
    const wishlists = await wishlistsCollection
      .find({
        $or: [{ "createdBy._id": user._id }, { "collaborators._id": user._id }],
      })
      .sort({ createdAt: -1 })
      .toArray()

    // Add item count to each wishlist
    const wishlistsWithCount = wishlists.map((wishlist) => ({
      ...wishlist,
      _id: wishlist._id?.toString(),
      itemCount: wishlist.products.length,
    }))

    return NextResponse.json(wishlistsWithCount)
  } catch (error) {
    console.error("Get wishlists error:", error)
    if (error instanceof Error && error.message === "Not authenticated") {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    const { name, description } = await request.json()

    if (!name || !name.trim()) {
      return NextResponse.json({ message: "Wishlist name is required" }, { status: 400 })
    }

    const db = await getDatabase()
    const wishlistsCollection = db.collection<Wishlist>("wishlists")

    const newWishlist: Wishlist = {
      name: name.trim(),
      description: description?.trim() || "",
      createdBy: {
        _id: user._id!,
        name: user.name,
        email: user.email,
      },
      collaborators: [],
      products: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await wishlistsCollection.insertOne(newWishlist)

    return NextResponse.json(
      {
        ...newWishlist,
        _id: result.insertedId.toString(),
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create wishlist error:", error)
    if (error instanceof Error && error.message === "Not authenticated") {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
