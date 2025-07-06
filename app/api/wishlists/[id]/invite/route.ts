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

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthenticatedUser(request)
    const { email } = await request.json()

    if (!email || !email.trim()) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 })
    }

    const db = await getDatabase()
    const wishlistsCollection = db.collection<Wishlist>("wishlists")
    const usersCollection = db.collection<User>("users")

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ message: "Invalid wishlist ID" }, { status: 400 })
    }

    const wishlist = await wishlistsCollection.findOne({ _id: new ObjectId(params.id) })

    if (!wishlist) {
      return NextResponse.json({ message: "Wishlist not found" }, { status: 404 })
    }

    // Check if user is the creator
    if (wishlist.createdBy._id.toString() !== user._id?.toString()) {
      return NextResponse.json({ message: "Only the creator can invite collaborators" }, { status: 403 })
    }

    // Check if email is already a collaborator
    const isAlreadyCollaborator = wishlist.collaborators.some((collab) => collab.email === email.trim())
    if (isAlreadyCollaborator) {
      return NextResponse.json({ message: "User is already a collaborator" }, { status: 400 })
    }

    // Check if email is the creator
    if (wishlist.createdBy.email === email.trim()) {
      return NextResponse.json({ message: "Cannot invite the creator" }, { status: 400 })
    }

    // Find the user to invite
    const invitedUser = await usersCollection.findOne({ email: email.trim() })

    if (!invitedUser) {
      // For demo purposes, we'll create a mock collaborator
      // In a real app, you'd send an email invitation
      const mockCollaborator = {
        _id: new ObjectId(),
        name: email.split("@")[0],
        email: email.trim(),
        joinedAt: new Date(),
      }

      await wishlistsCollection.updateOne(
        { _id: new ObjectId(params.id) },
        {
          $push: { collaborators: mockCollaborator },
          $set: { updatedAt: new Date() },
        },
      )

      console.log(`Mock invitation sent to ${email} for wishlist: ${wishlist.name}`)
      return NextResponse.json({ message: "Invitation sent successfully (mock user created)" })
    } else {
      // Add existing user as collaborator
      const collaborator = {
        _id: invitedUser._id!,
        name: invitedUser.name,
        email: invitedUser.email,
        joinedAt: new Date(),
      }

      await wishlistsCollection.updateOne(
        { _id: new ObjectId(params.id) },
        {
          $push: { collaborators: collaborator },
          $set: { updatedAt: new Date() },
        },
      )

      return NextResponse.json({ message: "User added as collaborator successfully" })
    }
  } catch (error) {
    console.error("Invite user error:", error)
    if (error instanceof Error && error.message === "Not authenticated") {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
