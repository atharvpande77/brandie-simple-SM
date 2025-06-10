# 🧠 Social Media Backend – Node.js (Assignment for Brandie)

This project is a minimal social media-style backend server built with **Node.js and Express**, designed as part of a backend engineering assignment. It includes user authentication, post creation, social graph management (follow/unfollow), and access-controlled user profiles.

Deployed on **Vercel**, this backend demonstrates clean architecture, robust data modeling using **PostgreSQL + Prisma**, and thoughtful API design — with additional features and suggested improvements outlined below.

---

## 🚀 Features Implemented

### ✅ Core Functionality
- User signup and login (via **email or username**)
- Follow/unfollow users
- View followers and following lists
- Create text + media posts
- View personal timeline/feed
- Retrieve all posts by a user
- Authentication using **JWT (access + refresh tokens)**

### 🔐 Bonus Features
- **Refresh Token Flow** – Ensures session continuity securely
- **Privacy Enforcement** – Only followers can access a user's full profile and posts. Non-followers can only view username, follower count, and following count.
- **Flexible Login** – Users can log in using either their email or username.

---

## 🧪 API Access & Testing

A public **Postman Collection** is available for testing the APIs:  
🔗 [Click here to open the Postman Collection](https://www.postman.com/team777-7613/workspace/my-workspace/collection/29450091-e971895c-6e78-4e53-b595-360808dd8cd0?action=share&creator=29450091&active-environment=29450091-9b132525-19c7-402b-82e9-06f2279b6b0f)

---

## 🧰 Technologies Used

- **Node.js (v18+)** with **Express.js**
- **PostgreSQL** as the relational database
- **Prisma ORM** for DB modeling and access
- **Joi** for request payload validation
- **JWT** for authentication (access + refresh tokens)
- **Nodemon** for local development

---

## 🛠️ Local Development Setup

```bash
git clone <repo-url>
cd <repo-folder>
npm install
npm run dev
```

> Make sure PostgreSQL is running locally and the `.env` file is properly configured with DB credentials and JWT secrets.

---

## ✨ Possible Improvements (Given More Time)

### 📦 1. Direct Media Upload via S3
For scalable media storage, **S3 with pre-signed POST URLs** is a production-grade alternative to handling media uploads directly.  
I have successfully implemented this in the past:
> *"Designed a direct upload system to AWS S3 using pre-signed POST URLs, boosting upload speed by 60% and reducing server load by 40%; built a FastAPI API with Boto3 for secure URL generation."*

This would require frontend integration to generate and use the pre-signed URLs for media uploads.

---

### 📚 2. Cursor-Based Pagination (for Posts)
Currently, all posts by a user are returned in a single query. For better performance and scalability:
- Use **cursor-based pagination** (`createdAt` or `id` as cursor) instead of offset-based paging.
- Benefits:
  - Stable performance on large datasets
  - No data inconsistency issues with concurrent inserts/deletes
  - Better integration with infinite scroll interfaces

---

### 🔐 3. JWT Logout and Token Blocklisting
For higher security environments (e.g. financial or enterprise apps), implementing **JWT access token blocklisting** (e.g. via **Redis**) helps revoke tokens explicitly.

- **Tradeoff**:
  - ✅ Pros: Immediate logout capability and reduced session hijacking risk
  - ⚠️ Cons: Adds complexity, requires Redis setup, and may reduce throughput slightly

Given the current scope and assignment goals, I opted for short-lived access tokens + refresh tokens — a solid and secure approach for most use cases.

---

### ✉️ 4. Email-Based OTP Authentication (via AWS SES)
For enhanced security and passwordless login experiences, an alternative login method could involve:

- Sending a **One-Time Password (OTP)** to the user's email via **AWS Simple Email Service (SES)**
- Verifying the OTP with a temporary cache (e.g. Redis)
- Upon successful verification, issuing a **JWT** for session management

This improves user experience for mobile-first or low-friction platforms while leveraging AWS SES for reliable and scalable email delivery.

While not implemented due to time constraints, I’ve worked with AWS SES previously and would consider integrating this for production-grade authentication systems.

---

## 📌 Final Notes

This project was built entirely in **Node.js/Express**, even though my background has been primarily in **FastAPI/Python**. I took this as an opportunity to stretch into a new ecosystem and demonstrate adaptability, backend design skills, and quick learning in a production-relevant stack.

> Note: All API requests in the Postman collection are pre-configured with the deployed server URL. No additional setup is required.
