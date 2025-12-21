# Coordinadora Challenge - Frontend

Shipping management platform with React, TypeScript, and Material UI.

## Setup

In order to run the project, you need to have Node.js installed on your machine and in the root directory of the project, run the following commands:

please be sure to have the backend running in the port 4000 first:

```bash
# Install dependencies
npm install

# Configure environment
VITE_API_URL=http://localhost:4000/api > .env

# Run development server
npm run dev

# Run tests if you want
npm test

```

## Project Structure

```
src/
├── features/          # Feature modules (auth, quote, shipments, tracking)
├── components/        # Shared components
├── hooks/             # Custom hooks (useApi, redux)
├── pages/             # Route pages
├── store/             # Redux store
└── lib/               # Axios config
```

## Tech Stack

- React 19 + Vite + TypeScript
- Material UI
- Redux Toolkit
- React Hook Form + Zod
- Socket.IO (real-time tracking)

## Routes

| Route            | Description      |
| ---------------- | ---------------- |
| `/`              | Login/Register   |
| `/dashboard`     | Home             |
| `/quote`         | Quote shipment   |
| `/shipments`     | My shipments     |
| `/shipments/new` | Confirm & create |
| `/tracking/:id`  | Track shipment   |
