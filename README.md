# Critch — Developer Portfolio & Peer Review Platform

Imagine you just finished building a project and want **real feedback**
from other developers — not just "nice project!" from friends.
Post it on Critch and get structured, honest reviews rating your
code quality, UI, idea, and documentation. The more you contribute,
the higher your reputation grows.

> GitHub (for showing projects) + Product Hunt (for discovery) + Code Review culture (for structured feedback)

## Tech Stack

- **Backend:** Node.js, Express, TypeScript, PostgreSQL, Prisma
- **Frontend:** React, TypeScript, Vite
- **Other:** JWT Authentication, Cloudinary (image uploads)

## Features

- **Auth** — Register, login, logout with JWT sessions
- **Projects** — Post, edit, delete, browse with tag filtering
- **Reviews** — 4-category structured ratings, one per user per project
- **Comments** — Nested threaded comments with replies
- **Reputation System** — Score calculated from reviews received and given
- **User Profiles** — Public profile with reputation score and portfolio
- **Dashboard** — Manage your projects and see all reviews

## Running Locally

### Prerequisites

- Node.js
- PostgreSQL

### Setup

```bash
# Clone the repo
git clone https://github.com/kasamthapa/critch.git
cd critch

# Setup backend
cd server
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev

# Setup frontend
cd ../client
npm install
cp .env.example .env
npm run dev
```

## Environment Variables

Create a `.env` file in `/server`:

```
DATABASE_URL=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CORS_ORIGIN=
PORT=
```

Create a `.env` file in `/client`:

````
VITE_API_BASE_URL=
```# Critch — Developer Portfolio & Peer Review Platform

Imagine you just finished building a project and want **real feedback**
from other developers — not just "nice project!" from friends.
Post it on Critch and get structured, honest reviews rating your
code quality, UI, idea, and documentation. The more you contribute,
the higher your reputation grows.

> GitHub (for showing projects) + Product Hunt (for discovery) + Code Review culture (for structured feedback)

## Tech Stack

- **Backend:** Node.js, Express, TypeScript, PostgreSQL, Prisma
- **Frontend:** React, TypeScript, Vite
- **Other:** JWT Authentication, Cloudinary (image uploads)

## Features

- **Auth** — Register, login, logout with JWT sessions
- **Projects** — Post, edit, delete, browse with tag filtering
- **Reviews** — 4-category structured ratings, one per user per project
- **Comments** — Nested threaded comments with replies
- **Reputation System** — Score calculated from reviews received and given
- **User Profiles** — Public profile with reputation score and portfolio
- **Dashboard** — Manage your projects and see all reviews

## Running Locally

### Prerequisites

- Node.js
- PostgreSQL

### Setup

```bash
# Clone the repo
git clone https://github.com/kasamthapa/critch.git
cd critch

# Setup backend
cd server
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev

# Setup frontend
cd ../client
npm install
cp .env.example .env
npm run dev
````

## Environment Variables

Fill in the values in `server/.env` and `client/.env` after copying the example files above.
