## 📰 About

A platform for publishing articles with categorized content, user/admin roles, and real-time features.

Users can subscribe to categories and receive **live notifications** when new articles are published or commented. Admins are notified of **reactions** and **comments** on their articles. The system is designed for responsiveness, scalability, and robust role-based access.

---

## ⚙️ Tech Stack

###  Backend
- **Node.js / Express.js**
- **PostgreSQL** with **Sequelize**
- **Redis** with **ioredis**
- **Socket.IO** for real-time communication
- **JWT** for authentication
- **Node-cron** for scheduled tasks
- **Multer** for file uploads (article images)
- **express-validator** for request validation

### Frontend
- **React.js** with **Vite**
- **Material UI (MUI)** for component styling
- **React Context API** for global state management
- **html-to-draftjs** for rich text editor integration
- **React Router v7** for routing
- **Nginx** for serving the production frontend build

---

## 🗄️ Backend Features

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

### Real-Time Functionality (Socket.IO)

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

---


### 🧩 Architecture Overview

The project follows a **modular, layered architecture** with a clear separation of concerns:

- **Routes / Controllers**  
  Handle HTTP requests and responses. Controllers apply middleware (e.g., auth, validation) and delegate business logic to service layers, keeping themselves thin and focused on orchestration.

- **Middlewares**  
  Responsible for:
  - JWT authentication and role-based access control  
  - Blocked user verification using Redis with graceful fallback to the database  
  - Data validation via `express-validator` for article creation/editing and other user input

- **Services**  
  Contain core business logic, including:
  - Database operations (PostgreSQL via Sequelize)
  - Redis interactions for notifications and user state
  - Triggering socket events for live UI updates

- **Socket Gateways & Handlers**  
  Modular real-time communication is organized into namespaces:
  - `/article-interactions`
  - `/user-notifications`
  - `/admin-notifications`  
  Each namespace has its own access control middleware and event handlers. Events like comment creation, deletion, or reaction toggles are processed in isolated handlers inside the `sockets/handlers` layer.

- **Socket Connection Management**  
  Active socket connections are tracked in-memory using `Map`, grouped by namespace and user nickname. This allows efficient broadcasting and socket management within `services/sockets`.

- **Redis as Notification Storage**  
  Redis is the **primary data store for notifications**, allowing fast access and live delivery through socket events. Notifications are stored as Redis hashes and not duplicated in the database — which is acceptable given their ephemeral nature.

- **Fallback & Fault-Tolerance**  
  For blocked users, Redis is used as the primary store, with **eventual consistency ensured** via:
  - Fallback to the database in case Redis is unavailable  
  - Periodic synchronization between Redis and DB using scheduled `cron` jobs


---

### 🖥️ Frontend Features

### 🌟 Core Features

#### 🔐 Role-Based Access
- Protected routes using a custom `WithAuth` HOC
- Conditional rendering based on role (`USER`, `ADMIN`)
- Global auth state managed via `AuthContext`

#### 🔁 Real-Time UI Updates
- Live updates for:
  - Article reactions (like/dislike)
  - Comments (add/edit/delete)
  - Notifications (via Socket.IO)
- Seamlessly integrated with socket handlers and custom hooks

#### 📚 Category Subscriptions
- Users can follow/unfollow article categories
- Live notification of new articles and comments in followed categories

#### 📝 Article Management (Admin)
- Admins can:
  - Create and edit articles using a rich text editor (`html-to-draftjs`)
  - Upload article images via backend (`multer`)
- Articles are validated before submission

#### 💬 Commenting & Reactions
- Users can:
  - Comment on articles
  - Like/dislike articles (toggle)
- Changes reflected in real-time for all connected clients

#### 🔔 Global Notifications
- Custom Snackbar system (`SnackbarProvider`)
- Feedback for actions: login success, errors, etc.
- Real-time notifications delivered via sockets

#### 🧠 Custom React Hooks
- Encapsulate logic for interacting with services and sockets
- Examples: `useAuth`, `useArticle`, `useNotifications`, `useReactions`
- Improve readability, reuse, and code structure

#### 🧩 Modular Component Structure
- Reusable atomic components: `CommentItem`, `TextButton`, `ConfirmModal`, etc.
- Shared layout: `Header`, `Loader`, `ErrorPage`, etc.

---

### 🧩 Architecture Overview (Frontend)

The frontend follows a **feature-based modular architecture** with clear separation of concerns:

- **`api/`**  
  Service layer for HTTP requests (`authService`, `articleService`, etc.)

- **`hooks/`**  
  Custom hooks to encapsulate reusable logic and socket integration

- **`contexts/`**  
  Global app state using Context API:
  - `AuthContext` (auth state)
  - `CategoriesContext` (subscriptions)
  - `SnackbarProvider` (UI feedback)

- **`handlers/`**  
  Handle real-time socket events separately from UI logic

- **`components/`**  
  Reusable UI components adhering to single-responsibility principle

- **`pages/`**  
  Route-level views: `Main`, `Login`, `Article`, `CreateArticle`, etc.

- **`HOC/`**  
  High-order components like `WithAuth` to protect routes

---


## 🧪 Test Users

| Role  | Email               | Password          | Note                                                         |
|-------|---------------------|-------------------|--------------------------------------------------------------|
| ADMIN | johndoe@gmail.com   | adminPassword123  | Full access: manage articles, block/unblock users, etc.      |
| ADMIN | janedoe@gmail.com   | adminPassword123  |                                                              |
| USER  | *(dynamic)*         | password123       | Faker-generated users — check article comments for nickname/email |

---

### 💾 How to run Locally

1. Clone the Repository

```bash
git clone https://github.com/Misha-Kirichenko/livepress
cd livepress
```

2. Rename the file `example.env` to `.env` in the root directory of the project.

3. Open the `.env` file and ensure that all the environment variables are set correctly

4. Run container

```bash
docker compose up --build
```
5. Open _Open `http://localhost:8080`_ in browser  
