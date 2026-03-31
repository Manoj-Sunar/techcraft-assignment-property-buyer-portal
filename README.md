# Buyer Portal (Auth + Favourites)

## Overview

This is a simple buyer-side portal for a real estate app.
Users can create an account, log in, browse properties, and save/remove favourites.
The main focus is authentication and user-specific data handling.

---

## Tech Stack

* Backend: Node.js, Express , typescript friendly
* Database: MongoDB atlas (cloud database) (or any simple DB)
* Auth: JWT + bcrypt
* Frontend: Next.js 16.2

---

## How to Run

### Backend

```bash
cd backend
npm install
npm run dev
```

Create a `.env` file inside root folder fo server:

```
PORT=5000
DB_CONNECTION_STRING=your_db_url
JWT_SECRET=your_secret
JWT_EXPIRES_IN
REFRESH_TOKEN_SECRET
REFRESH_TOKEN_EXPIRES_IN
NODE_ENV
```

---

### Frontend

```bash
cd frontend
npm install
npm run dev
```

create an .env file inside root foler of frontend

```
NEXT_PUBLIC_API_URL
---



## Features

* User registration and login
* JWT-based authentication
* Browse properties (public)
* Add/remove favourites
* User dashboard (protected)

---

## API Endpoints

### Auth

* POST `/api/buyer/register`
* POST `/api/buyer/login`
* GET `/api/buyer/me`
* POST `/api/buyer/logout`
* POST `/api/buyer/refresh-token`


### property
*GET `/api/properties`



### Favourites

* POST `/api/favourite/:propertyId`
* DELETE `/api/favourite/unfavorite:propertyId`
* GET `/api/favourite/favorite-property`

---

## Basic Flow

1. User registers
2. Logs in
3. Views properties
4. Adds/removes favourites
5. Checks dashboard

---

## Notes

* Passwords are hashed (not stored as plain text)
* Only logged-in users can manage favourites
* Users can only access their own data

---

## Pages

* `/` → properties list
* `/auth` → login + register
* `
* `/user-profile` → favourites (protected)

---

## Final Thought

This project focuses on keeping things simple and clean while covering the core full-stack concepts like auth, API design, and basic UX.
