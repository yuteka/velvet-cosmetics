# COSMETICS - Full Stack Application

This is the main repository for the COSMETICS platform, organized using a microservices-style architecture.

## Project Structure

- **[client/](./client)**: Frontend application built with React and Vite. User-facing website.
- **[admin/](./admin)**: Admin dashboard for managing products, orders, and users. Built with React and Vite.
- **[server/](./server)**: Backend API service built with Node.js and Express. Now includes integrated email notifications.

## Getting Started

Each service has its own `package.json` and dependencies. To run the project locally, you will need to install dependencies in each directory.

### Quick Start (Development)

1. **Client**:
   ```bash
   cd client
   npm install
   npm run dev
   ```

2. **Admin**:
   ```bash
   cd admin
   npm install
   npm run dev
   ```

3. **Server**:
   ```bash
   cd server
   npm install
   npm run dev
   ```

## Environment Configuration

Ensure you create `.env` files in the respective directories based on the provided `.env.example` templates (if available).
