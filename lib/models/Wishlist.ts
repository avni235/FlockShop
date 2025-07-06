import type { ObjectId } from "mongodb"

export interface Comment {
  _id: ObjectId
  text: string
  author: {
    _id: ObjectId
    name: string
    email: string
  }
  createdAt: Date
}

export interface Reaction {
  emoji: string
  count: number
  users: ObjectId[]
}

export interface Product {
  _id: ObjectId
  name: string
  price: number
  imageUrl: string
  description: string
  addedBy: {
    _id: ObjectId
    name: string
    email: string
  }
  comments: Comment[]
  reactions: Reaction[]
  createdAt: Date
  updatedAt: Date
}

export interface Wishlist {
  _id?: ObjectId
  name: string
  description: string
  createdBy: {
    _id: ObjectId
    name: string
    email: string
  }
  collaborators: Array<{
    _id: ObjectId
    name: string
    email: string
    joinedAt: Date
  }>
  products: Product[]
  createdAt: Date
  updatedAt: Date
}
