
# 🛍️ Collaborative Wishlist App

A full-stack social wishlist app where users can create shared wishlists, add products, and collaborate in real-time — ideal for group shopping, gifting, or planning sprees.

---

## 📸 Screenshots

> _Include a few screenshots of your app UI here (Homepage, Wishlist page, Add product form, etc.) or a Loom/video demo link._

---

## 🚀 Features

### 👥 User Features
- User signup & login (Firebase Auth)
- Create & manage multiple wishlists
- Add / edit / delete products (with image URL & price)
- See who added which item
- Mock invite system to add other users
- Responsive UI for mobile & desktop

### 💬 Bonus Features
- Real-time sync using Firebase Realtime Database
- Emoji reactions on wishlist products
- Modern dark mode + cyberpunk design theme (if applicable)

---

## 🛠️ Tech Stack

| Layer      | Technology                    |
|------------|-------------------------------|
| Frontend   | React.js + Tailwind CSS       |
| Backend    | Node.js + Express.js (REST API) |
| Database   | Firebase Realtime DB / Firestore |
| Auth       | Firebase Authentication       |
| Hosting    | (Optional: Vercel / Netlify)  |

---

## ⚙️ Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/wishlist-app.git
   cd wishlist-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project.
   - Enable Email/Password Auth.
   - Set up Firestore or Realtime DB.
   - Add your config to `.env`:
     ```
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
     ...
     ```

4. **Start the app**
   ```bash
   npm run dev
   ```

---

## 📁 Folder Structure (Simplified)

```
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/ (API + Firebase)
│   ├── styles/
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── controllers/
```

---

## ✅ Assumptions & Limitations

- Invite system is mocked — real-time group invite via email is not implemented.
- Auth uses Firebase to simplify backend complexity.
- Emoji reactions stored with product data in Firestore.

---

## 📈 How I'd Improve or Scale

- Integrate proper access control for wishlists (only invited users can edit).
- Use WebSockets (Socket.IO) if not using Firebase for real-time sync.
- Add image uploads via Firebase Storage.
- Enable push notifications for reactions/comments.
- Create a mobile app version using React Native.

---

## 📦 Submission

- Source Code: [GitHub Repo Link](https://github.com/yourusername/wishlist-app)
- Demo Video: [Loom / YouTube Demo Link](https://loom.com/share/yourvideo)
- Deployment (Optional): [Live App Link](https://wishlist-app.vercel.app/)

---

## 🙌 Author

**Avneet Kaur**  
[GitHub](https://github.com/yourusername) • [LinkedIn](https://linkedin.com/in/yourprofile)
