# Polodieu Electronics — full starter project

This package upgrades the original single HTML page into a real e-commerce starter.

## What is included

- React + Vite frontend
- Product search and category filtering
- Persistent cart using localStorage
- Backend starter with Express
- PostgreSQL + Prisma schema
- Product and order API routes
- Payment placeholders for MTN MoMo and Orange Money
- Hosting-ready structure

## Run the frontend

```bash
cd frontend
npm install
npm run dev
```

## Run the backend

```bash
cd backend
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

## Database

Create a PostgreSQL database named `polodieu`, then update `backend/.env`.

## Payments

Keep MTN MoMo and Orange Money keys in `backend/.env` only. Do not put payment secrets inside React.

## Hosting recommendation

- Frontend: Vercel
- Backend: Render or Railway
- Database: PostgreSQL
- Images: Cloudinary

## Next coding step

Connect the React frontend to `/api/products` instead of using local product data.
