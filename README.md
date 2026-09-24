# Festyvibe API

NestJS + Prisma + PostgreSQL backend for Festyvibe.

## Setup

```bash
npm install
copy .env.example .env
npm run prisma:generate
npx prisma migrate dev --name init
npm run dev
```

API base URL:

`http://localhost:4000/api`

## Endpoints

Authentication:
- POST /api/auth/register
- POST /api/auth/login

Events:
- GET /api/events
- POST /api/events
- GET /api/events/:id
- DELETE /api/events/:id

Guests:
- GET /api/events/:eventId/guests
- POST /api/events/:eventId/guests
- DELETE /api/events/:eventId/guests/:guestId

Protected endpoints use:

`Authorization: Bearer <accessToken>`

Next modules: Invitations, RSVPs, Gifts, Vendors, Wedding Websites, Notifications and Payments.
