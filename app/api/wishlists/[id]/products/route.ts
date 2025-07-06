import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { getDatabase } from "@/lib/mongodb"
import type { Wishlist, Product } from "@/lib/models/wishlist"
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

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthenticatedUser(request)
    const { name, price, imageUrl, description } = await request.json()

    if (!name || !name.trim()) {
      return NextResponse.json({ message: "Product name is required" }, { status: 400 })
    }

    if (!price || price <= 0) {
      return NextResponse.json({ message: "Valid price is required" }, { status: 400 })
    }

    const db = await getDatabase()
    const wishlistsCollection = db.collection<Wishlist>("wishlists")

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ message: "Invalid wishlist ID" }, { status: 400 })
    }

    const wishlist = await wishlistsCollection.findOne({ _id: new ObjectId(params.id) })

    if (!wishlist) {
      return NextResponse.json({ message: "Wishlist not found" }, { status: 404 })
    }

    // Check if user has access to this wishlist
    const hasAccess =
      wishlist.createdBy._id.toString() === user._id?.toString() ||
      wishlist.collaborators.some((collab) => collab._id.toString() === user._id?.toString())

    if (!hasAccess) {
      return NextResponse.json({ message: "Access denied" }, { status: 403 })
    }

    const newProduct: Product = {
      _id: new ObjectId(),
      name: name.trim(),
      price: Number(price),
      imageUrl: imageUrl?.trim() || "",
      description: description?.trim() || "",
      addedBy: {
        _id: user._id!,
        name: user.name,
        email: user.email,
      },
      comments: [],
      reactions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await wishlistsCollection.updateOne(
      { _id: new ObjectId(params.id) },
      {
        $push: { products: newProduct },
        $set: { updatedAt: new Date() },
      },
    )

    return NextResponse.json(
      {
        ...newProduct,
        _id: newProduct._id.toString(),
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Add product error:", error)
    if (error instanceof Error && error.message === "Not authenticated") {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
