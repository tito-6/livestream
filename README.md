# StreamCast Platform

## Overview
StreamCast is a high-performance live streaming platform with a custom Real-Time Video Orchestration engine.
This repository contains:
1. **Backend** (`/backend`): Go (Golang) API handling Authentication, Stream Management, and RTMP Ingest.
2. **Frontend App** (`/frontend`): Next.js application containing both the public viewer interface and the Admin Control Center.

## Architecture

### Backend (`/backend`)
- **Framework**: Gin (Golang)
- **Database**: PostgreSQL (GORM OGM)
- **RTMP Server**: Integrated TCP listener (Port 1935)
- **API Port**: 8080

### Frontend App (`/frontend`)
- **Framework**: Next.js (React)
- **Styling**: Tailwind CSS
- **Public URL**: `http://localhost:3000`
- **Admin URL**: `http://localhost:3000/admin`

## Getting Started

### Prerequisites
- Go 1.20+
- Node.js 18+
- PostgreSQL

### 1. Database Setup
Ensure PostgreSQL is running and create a database named `streamcast`.
Set the environment variable if needed:
`set DATABASE_URL=host=localhost user=postgres password=yourpassword dbname=streamcast port=5432 sslmode=disable`

### 2. Run Backend
```powershell
cd backend
go mod tidy
go run cmd/api/main.go
```

### 3. Run Frontend (Client + Admin)
```powershell
cd frontend
npm install
npm run dev
```
Access the client at `http://localhost:3000` and the admin panel at `http://localhost:3000/admin`.
