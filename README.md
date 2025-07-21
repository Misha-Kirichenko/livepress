## 📰 About

A platform for publishing articles with categorized content, user/admin roles, and real-time features.

Users can subscribe to categories and receive **live notifications** when new articles are published or commented. Admins are notified of **reactions** and **comments** on their articles. The system is designed for responsiveness, scalability, and robust role-based access.

---

## ⚙️ Tech Stack

- **Node.js / Express.js**
- **PostgreSQL** with **Sequelize**
- **Redis** with **ioredis**
- **Socket.IO** for real-time communication
- **JWT** for authentication
- **Node-cron** for scheduled tasks
- **Multer** for file uploads (article images)
- **express-validator** for request validation

---

## 🛠 Backend Features

### 🔐 Authentication & Authorization
- JWT-based login and session management
- Role-based access: `USER`, `ADMIN`
- Middleware-protected routes
- Blocked users are denied access via Redis-first check with DB fallback

### 📦 Database & Structure
- Sequelize migrations & seeders for:
  - Users, Articles, Comments, Reactions (likes/dislikes)
  - UserCategory subscriptions
- Pagination and filtering for articles by title, category, and keywords

### ✍️ Article Interaction
- Users can:
  - Like/dislike articles (toggle)
  - Comment on articles
  - Subscribe/unsubscribe to categories
- Admins can:
  - Create/edit/delete articles
  - Upload images via `multer`
  - Block/unblock users
  - Remove user comments
- All article creation and editing routes use **strict validation** rules via `express-validator`

### 🧠 Real-Time Functionality (Socket.IO)

#### 🔁 Live UI Updates
- When a user adds, edits, or deletes a **comment**, all users on the article page receive instant updates via sockets
- This ensures a reactive and collaborative experience

#### 🔔 Notifications

##### For Users:
- Real-time notifications for:
  - New articles in subscribed categories
  - Comments on articles from those categories

##### For Admins:
- Real-time notifications for:
  - Reactions (like/dislike) on their articles
  - New comments on their articles

- All notifications are stored in **Redis** (with fallback safety if Redis is unavailable)
- UI receives notifications via **Socket.IO**

### 🚫 Blocking & Consistency
- Admins can block users (status stored in both Redis and DB)
- Middleware checks user status via Redis, and falls back to DB
- Implements **eventual consistency** between Redis and DB
- Scheduled `cron` job periodically synchronizes blocked user data
