import "dotenv/config"; // ⬅️ Add this line at the very top!
import { hash } from "bcryptjs"
import { getDatabase } from "./lib/mongodb"

async function seed() {
  const db = await getDatabase()
  const users = db.collection("users")

  const existing = await users.findOne({ email: "test@example.com" })
  if (existing) {
    console.log("⚠️ test@example.com already exists")
    return
  }

  const hashedPassword = await hash("password123", 10)

  await users.insertOne({
    name: "Test User",
    email: "test@example.com",
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  console.log("✅ Test user inserted successfully!")
}

seed().then(() => process.exit())
