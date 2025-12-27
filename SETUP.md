# 🚀 GearGuard - Quick Start Guide

This guide will help you set up and run the GearGuard Maintenance Management System.

## 📋 Prerequisites

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **PostgreSQL** v14+ ([Download](https://www.postgresql.org/download/))
- **npm** or **yarn**

## 🔧 Step-by-Step Setup

### Step 1: Install Dependencies

Open a terminal in the project root directory and run:

```bash
# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Step 2: Setup PostgreSQL Database

1. **Start PostgreSQL** service on your machine

2. **Open pgAdmin** or use `psql` command line

3. **Create the database**:
   ```sql
   CREATE DATABASE gearguard;
   ```

4. **Verify database creation**:
   ```sql
   \l
   ```
   You should see `gearguard` in the list.

### Step 3: Configure Environment Variables

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Create `.env` file from example:
   ```bash
   copy .env.example .env    # Windows
   # OR
   cp .env.example .env      # Mac/Linux
   ```

3. **Edit `backend/.env`** and update with your PostgreSQL credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=gearguard
   DB_USER=postgres
   DB_PASSWORD=YOUR_ACTUAL_PASSWORD_HERE
   
   PORT=5000
   NODE_ENV=development
   
   JWT_SECRET=change_this_to_a_random_secret_key_min_32_chars
   JWT_EXPIRE=7d
   ```

   ⚠️ **IMPORTANT**: Replace `YOUR_ACTUAL_PASSWORD_HERE` with your actual PostgreSQL password!

### Step 4: Initialize Database

Run the database initialization script to create tables and seed data:

```bash
cd backend
npm run init-db
```

You should see output like:
```
🔧 Creating database tables...
✅ All tables created successfully!
🌱 Seeding initial data...
✅ Admin user created (username: admin, password: admin123)
✅ Sample maintenance teams created
✅ Initial data seeded successfully!
🎉 Database initialization complete!
```

If you see any errors:
- Check your database credentials in `.env`
- Ensure PostgreSQL is running
- Verify the database `gearguard` exists

### Step 5: Run the Application

#### Option A: Run Frontend and Backend Together (Recommended)

From the project root:
```bash
npm run dev
```

This starts:
- ✅ Backend API: http://localhost:5000
- ✅ Frontend: http://localhost:3000

#### Option B: Run Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 6: Login

1. Open your browser and go to: **http://localhost:3000**

2. Login with default credentials:
   - **Username**: `admin`
   - **Password**: `admin123`

3. You should be redirected to the dashboard! 🎉

## 🎯 Quick Feature Tour

### 1. Dashboard
- View maintenance statistics
- See request counts by status
- Recent activity feed

### 2. Equipment Management
- Click **Equipment** in sidebar
- Click **Add Equipment** to register new assets
- Click on any equipment to see maintenance history
- Use the **Maintenance** smart button to see all requests for that equipment

### 3. Teams
- Click **Teams** in sidebar
- Create specialized teams (Mechanics, Electricians, IT)
- Add team members

### 4. Maintenance Requests (Kanban Board)
- Click **Requests** in sidebar
- View requests organized by status
- **Drag and drop** cards between columns to update status
- Click **New Request** to create maintenance work

### 5. Calendar View
- Click **Calendar** in sidebar
- View preventive maintenance schedule
- Click on dates to see scheduled work
- Create preventive requests with scheduled dates

## 📊 Test the System

### Create Sample Equipment

1. Go to **Equipment** → **Add Equipment**
2. Fill in:
   - Name: "CNC Machine #1"
   - Serial Number: "CNC-2024-001"
   - Category: "Manufacturing Machine"
   - Department: "Production"
   - Location: "Factory Floor A"
   - Maintenance Team: Select "Mechanical Team"
3. Click **Create Equipment**

### Create Maintenance Request

1. Go to **Requests** → **New Request**
2. Fill in:
   - Subject: "Oil Change Required"
   - Equipment: Select "CNC Machine #1"
   - Request Type: "Preventive"
   - Priority: "Medium"
   - Scheduled Date: Choose a future date
3. Click **Create Request**

### Test Kanban Board

1. Go to **Requests**
2. Find your request in the "New" column
3. **Drag it** to "In Progress"
4. Watch the status update automatically!

## 🔍 Troubleshooting

### Database Connection Failed
**Error**: `Failed to connect to database`

**Solution**:
1. Ensure PostgreSQL is running
2. Check credentials in `backend/.env`
3. Verify database exists:
   ```bash
   psql -U postgres -c "\l"
   ```

### Port Already in Use
**Error**: `Port 5000 is already in use`

**Solution**:
1. Change port in `backend/.env`:
   ```env
   PORT=5001
   ```
2. Update frontend API URL in `frontend/lib/api.ts`:
   ```typescript
   const API_URL = 'http://localhost:5001/api';
   ```

### Module Not Found
**Error**: `Cannot find module 'express'`

**Solution**:
```bash
cd backend
rm -rf node_modules
npm install
```

### Frontend Build Errors
**Error**: TypeScript compilation errors

**Solution**:
```bash
cd frontend
rm -rf node_modules .next
npm install
npm run dev
```

### Cannot Login
**Error**: Invalid credentials

**Solution**:
1. Re-run database initialization:
   ```bash
   cd backend
   npm run init-db
   ```
2. Use credentials: `admin` / `admin123`

## 📱 API Testing with Postman/Thunder Client

### Test Backend API

**Login:**
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Get Equipment (with token):**
```http
GET http://localhost:5000/api/equipment
Authorization: Bearer YOUR_TOKEN_HERE
```

## 🎓 Next Steps

1. **Create Users**: Add more users with different roles
2. **Add Equipment**: Register all your company assets
3. **Form Teams**: Create specialized maintenance teams
4. **Test Workflow**: Create corrective and preventive requests
5. **Explore Calendar**: Schedule preventive maintenance
6. **Check Dashboard**: Monitor statistics and activity

## 🚀 Production Deployment

### Backend
1. Set production environment in `.env`:
   ```env
   NODE_ENV=production
   ```
2. Use a production PostgreSQL instance
3. Set a strong JWT secret (32+ characters)
4. Use PM2 or similar for process management
5. Set up SSL/TLS certificates

### Frontend
1. Build the application:
   ```bash
   cd frontend
   npm run build
   npm start
   ```
2. Deploy to Vercel/Netlify or your hosting service
3. Update API URL to production backend

## 📞 Need Help?

1. Check the [main README.md](./README.md) for detailed documentation
2. Review error messages in terminal/browser console
3. Ensure all prerequisites are installed correctly
4. Verify database connection and credentials

## ✅ System Status Checklist

Before reporting issues, verify:
- [ ] PostgreSQL is running
- [ ] Database `gearguard` exists
- [ ] Dependencies installed (`node_modules` exists)
- [ ] `.env` file configured with correct credentials
- [ ] Database initialized (`npm run init-db` completed)
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Can access http://localhost:3000 in browser

---

**🎉 Congratulations! Your GearGuard system is ready to use!**

For detailed feature documentation, see [README.md](./README.md)
