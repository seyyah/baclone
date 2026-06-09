// src/data/mockAnalysis.js — updated with all new fields

export const mockAnalysisResult = {
  appName: "Sahibinden Clone",
  summary:
    "A classified ads marketplace with user authentication, hierarchical category browsing, ad listing CRUD, image uploads, location-based filtering, and an admin moderation panel. The backend requires a RESTful API with JWT auth, file storage, and geospatial queries.",

  // ── NEW: Screen Timeline ──────────────────────────────────────────────────
  screenTimeline: [
    { timestamp: "00:03", screen: "Login Screen",      description: "Email/password + Google OAuth" },
    { timestamp: "00:08", screen: "Home / Feed",        description: "Category nav + featured ads" },
    { timestamp: "00:15", screen: "Search & Filter",    description: "Location, price, category filters" },
    { timestamp: "00:22", screen: "Ad Listing Detail",  description: "Images, price, seller info, map" },
    { timestamp: "00:31", screen: "Post New Ad",        description: "Multi-step form with image upload" },
    { timestamp: "00:41", screen: "User Profile",       description: "Active ads, rating, contact" },
    { timestamp: "00:49", screen: "Admin Panel",        description: "Moderation queue, user management" },
    { timestamp: "00:57", screen: "Notifications",      description: "Real-time alerts for messages" },
  ],

  // ── NEW: Modules ──────────────────────────────────────────────────────────
  modules: [
    { name: "Auth Module",         icon: "🔐", description: "JWT login, register, refresh, OAuth2 Google" },
    { name: "Ads Module",          icon: "📋", description: "CRUD for listings, status management, slug" },
    { name: "Category Module",     icon: "🗂️",  description: "Nested hierarchical categories with depth support" },
    { name: "Media Module",        icon: "🖼️",  description: "Multi-image upload, cloud storage, CDN delivery" },
    { name: "Search Module",       icon: "🔍", description: "Full-text + geospatial search with filters" },
    { name: "User Module",         icon: "👤", description: "Profiles, ratings, favorites, saved searches" },
    { name: "Notification Module", icon: "🔔", description: "WebSocket push + email fallback, read tracking" },
    { name: "Admin Module",        icon: "🛡️",  description: "Moderation queue, ban/approve, audit logs" },
  ],

  // ── NEW: Confidence Scores ────────────────────────────────────────────────
  confidenceScores: {
    "User Authentication":    95,
    "Ad Listing CRUD":        98,
    "Image Upload System":    90,
    "Category Hierarchy":     88,
    "Search & Filtering":     85,
    "Admin Panel":            78,
    "Notification System":    72,
    "Payment Integration":    35,
    "Real-time Messaging":    60,
    "Geolocation Features":   82,
  },

  // ── NEW: Risk Analysis ────────────────────────────────────────────────────
  risks: [
    {
      severity: "High",
      issue: "Payment system is unclear",
      detail: "A pricing screen is visible but no payment provider (Stripe, iyzico) is identifiable. If premium ad promotion exists, payment gateway integration is required.",
    },
    {
      severity: "Medium",
      issue: "Real-time messaging may require WebSocket",
      detail: "A messaging icon is visible in the navbar. If this is live chat, WebSocket (Socket.io) infrastructure is needed — not just REST.",
    },
    {
      severity: "Medium",
      issue: "Image storage strategy not defined",
      detail: "Multiple ad images are visible. Without a CDN/cloud strategy (S3, Cloudinary), large file handling will bottleneck the server.",
    },
    {
      severity: "Low",
      issue: "Admin panel seen but scope unclear",
      detail: "An admin-like dashboard is visible. RBAC middleware and audit logging must be defined before development begins.",
    },
    {
      severity: "Low",
      issue: "Geolocation requires database optimization",
      detail: "Location-based filtering appears in search. PostGIS extension or spatial indexing is needed for performant geo-queries.",
    },
  ],

  // ── Existing fields ───────────────────────────────────────────────────────
  backendFeatures: [
    { id: "feat-01", name: "User Authentication & JWT", description: "Email/password login, Google OAuth2, JWT access + refresh token rotation.", priority: "Critical", tags: ["Auth", "Security"] },
    { id: "feat-02", name: "Role-Based Authorization", description: "User, Seller, Moderator, Admin roles with route-level guards.", priority: "Critical", tags: ["Security", "Middleware"] },
    { id: "feat-03", name: "Ad Listing Management", description: "Full CRUD for classified ads including title, description, price, location, category, status.", priority: "Critical", tags: ["Ads", "CRUD"] },
    { id: "feat-04", name: "Hierarchical Category System", description: "Nested categories (e.g. Vehicles → Automobile → Brand) with depth-first traversal.", priority: "High", tags: ["Categories", "Data Structure"] },
    { id: "feat-05", name: "Advanced Search & Filtering", description: "Full-text search by keyword, location radius, price range, date, category with pagination.", priority: "High", tags: ["Search", "Filtering"] },
    { id: "feat-06", name: "Image Upload & Storage", description: "Multi-image upload per ad, cloud storage (S3/Cloudinary), thumbnail generation, CDN delivery.", priority: "High", tags: ["Files", "Storage", "Media"] },
    { id: "feat-07", name: "Location Management", description: "Geospatial data (city, district, coordinates) associated with each ad for map display and radius search.", priority: "Medium", tags: ["Location", "Geospatial"] },
    { id: "feat-08", name: "Notification System", description: "Real-time push notifications (Socket.io), message alerts, saved search alerts, email fallback.", priority: "Medium", tags: ["WebSocket", "Events"] },
  ],

  entities: [
    { name: "User",     fields: ["id", "email", "passwordHash", "role", "phone", "avatar", "createdAt"], color: "primary" },
    { name: "Ad",       fields: ["id", "title", "slug", "description", "price", "status", "userId", "categoryId", "locationId"], color: "cyan" },
    { name: "Category", fields: ["id", "name", "slug", "parentId", "depth", "icon"], color: "violet" },
    { name: "Media",    fields: ["id", "url", "adId", "order", "size", "mimeType"], color: "green" },
    { name: "Location", fields: ["id", "city", "district", "lat", "lng"], color: "primary" },
    { name: "Message",  fields: ["id", "senderId", "receiverId", "adId", "body", "isRead", "createdAt"], color: "violet" },
    { name: "Notification", fields: ["id", "userId", "type", "payload", "isRead", "createdAt"], color: "cyan" },
    { name: "Favorite", fields: ["id", "userId", "adId", "createdAt"], color: "green" },
  ],

  endpoints: [
    { method: "POST",   path: "/api/auth/register",          description: "Register new user" },
    { method: "POST",   path: "/api/auth/login",             description: "Login, receive JWT pair" },
    { method: "POST",   path: "/api/auth/refresh",           description: "Refresh access token" },
    { method: "GET",    path: "/api/ads",                    description: "List ads with filters & pagination" },
    { method: "POST",   path: "/api/ads",                    description: "Create new ad listing" },
    { method: "GET",    path: "/api/ads/:slug",              description: "Get ad detail by slug" },
    { method: "PUT",    path: "/api/ads/:id",                description: "Update ad (owner only)" },
    { method: "DELETE", path: "/api/ads/:id",                description: "Delete ad (owner/admin)" },
    { method: "PATCH",  path: "/api/ads/:id/status",         description: "Change ad status (admin)" },
    { method: "GET",    path: "/api/categories",             description: "Get category tree" },
    { method: "POST",   path: "/api/media/upload",           description: "Upload ad images" },
    { method: "GET",    path: "/api/search",                 description: "Full-text + geo search" },
    { method: "GET",    path: "/api/users/:id",              description: "Get user profile & ads" },
    { method: "GET",    path: "/api/notifications",          description: "Get user notifications" },
    { method: "PATCH",  path: "/api/notifications/:id/read", description: "Mark notification read" },
    { method: "GET",    path: "/api/admin/ads/pending",      description: "Get moderation queue" },
    { method: "PATCH",  path: "/api/admin/ads/:id/approve",  description: "Approve ad" },
    { method: "GET",    path: "/api/favorites",              description: "Get user's saved ads" },
    { method: "POST",   path: "/api/favorites/:adId",        description: "Save ad to favorites" },
  ],

  umlDescription: {
    classDiagram: `classDiagram
    User "1" --> "*" Ad : posts
    User "1" --> "*" Message : sends
    User "1" --> "*" Notification : receives
    User "1" --> "*" Favorite : saves
    Ad "1" --> "*" Media : has
    Ad "*" --> "1" Category : belongs to
    Ad "1" --> "1" Location : located at
    Category --> Category : parent`,

    sequenceDiagram: `sequenceDiagram
    Client->>+API: POST /auth/login {email, password}
    API->>+DB: SELECT user WHERE email=?
    DB-->>-API: User record
    API->>API: bcrypt.compare(password, hash)
    API-->>-Client: {accessToken, refreshToken}
    Client->>+API: POST /ads {title, price, ...} Bearer token
    API->>+AuthMiddleware: verify JWT
    AuthMiddleware-->>-API: userId
    API->>+DB: INSERT INTO ads
    DB-->>-API: new Ad
    API->>+MediaService: process uploaded images
    MediaService->>+S3: upload files
    S3-->>-MediaService: CDN urls
    MediaService-->>-API: media records
    API-->>-Client: {ad, media[]}`
  },

  cliPrompt: `Build a complete production-ready classified ads marketplace backend.

Stack: Node.js + TypeScript + Express.js + PostgreSQL + Prisma ORM + Redis + Socket.io + AWS S3

Architecture: Controller → Service → Repository pattern, route-based modules.

Modules to generate:
1. Auth: register, login, refresh, logout, Google OAuth2, bcrypt, JWT (15m access / 7d refresh)
2. Ads: CRUD, slug generation, status workflow (draft→active→sold→deleted), soft delete
3. Categories: nested tree with parentId, GET /categories returns full hierarchy
4. Media: multipart upload, sharp resizing (800px max), S3 upload, URL return
5. Search: full-text (pg_trgm), price/location/category filters, cursor pagination
6. Users: profile, avatar upload, seller rating, favorites, own ads list
7. Notifications: Socket.io rooms per userId, persist in DB, email via Nodemailer
8. Admin: moderation queue, approve/reject ads, ban users, audit log

Database requirements:
- UUID primary keys everywhere
- Soft deletes (deletedAt nullable timestamp)
- created_at, updated_at on all tables
- Indexes: email (unique), slug (unique), user_id FK, category_id FK, created_at DESC

Generate: package.json, tsconfig.json, .env.example, docker-compose.yml, Prisma schema, all route/controller/service files, Jest test setup, and README.`,
};
