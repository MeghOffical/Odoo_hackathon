# 🚀 GearGuard - Running Instructions

## For Live Share Host

### Prerequisites Check
```powershell
# 1. Check Node.js is installed
node --version  # Should be v18+

# 2. Check PostgreSQL is running
# Open Services (services.msc) and check "postgresql" is running
# Or use psql command to verify:
psql --version
```

---

## Step-by-Step Instructions

### 1. Navigate to Project Directory
```powershell
cd "D:\ANSH BADREISYA\OneDrive\Desktop\Oddo Heckathon\gearguard"
```

### 2. Install Dependencies (One-time setup)
```powershell
# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies  
cd frontend
npm install
cd ..

# Install root dependencies (for running both together)
npm install
```

### 3. Configure Database

**A. Start PostgreSQL Service**
- Open Services → Find PostgreSQL → Start it
- Or use pgAdmin 4

**B. Create Database**
```sql
-- Open pgAdmin or psql and run:
CREATE DATABASE gearguard;
```

**C. Update backend/.env file**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gearguard
DB_USER=postgres
DB_PASSWORD=your_actual_postgres_password_here

PORT=5000
NODE_ENV=development

JWT_SECRET=gearguard_super_secret_key_change_in_production_2025
JWT_EXPIRE=7d
```

### 4. Initialize Database (One-time setup)
```powershell
cd backend
npm run init-db
```

Expected output:
```
🔧 Creating database tables...
✅ All tables created successfully!
🌱 Seeding initial data...
✅ Admin user created
✅ Sample maintenance teams created
🎉 Database initialization complete!
```

### 5. Run the Application

**Option A: Run Both (Frontend + Backend) Together** ⭐ Recommended
```powershell
# From project root
npm run dev
```

**Option B: Run Separately**

Terminal 1 - Backend:
```powershell
cd backend
npm run dev
```

Terminal 2 - Frontend:
```powershell
cd frontend
npm run dev
```

---

## 🌐 Access the Application

Once both servers are running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api

### Default Login
```
Username: admin
Password: admin123
```

---

## 📊 What's Already Built

### ✅ Backend (Express + PostgreSQL)
- ✅ User authentication (JWT)
- ✅ Equipment management API
- ✅ Maintenance teams API
- ✅ Maintenance requests API
- ✅ Dashboard statistics
- ✅ Status history tracking
- ✅ Request comments system

### ✅ Frontend (Next.js + TypeScript)
- ✅ Login page
- ✅ Dashboard with statistics
- ✅ Equipment management
  - List view with filters
  - Create/edit equipment
  - Equipment detail page with maintenance history
- ✅ Maintenance requests
  - **Kanban board** (drag & drop: New → In Progress → Repaired → Scrap)
  - Create/edit requests
  - Request detail page
- ✅ Teams management
  - List teams
  - Create/edit teams
  - Assign technicians
- ✅ **Calendar view** for preventive maintenance

---

## 🔥 Key Features Implemented

### 1. **Kanban Board** (vsls:/gearguard/frontend/pages/requests/index.tsx)
- Drag and drop requests between columns
- Automatic status updates
- Color-coded by status
- Shows technician avatars
- Overdue requests highlighted in red

### 2. **Calendar View** (vsls:/gearguard/frontend/pages/calendar.tsx)
- Shows preventive maintenance schedule
- Click dates to view scheduled tasks
- Monthly navigation

### 3. **Equipment Management**
- Smart button showing maintenance count
- Auto-assigns maintenance team
- Tracks warranty and location
- Department-based filtering

### 4. **Automatic Scrap Logic**
When a request is marked as "Scrap":
- Equipment status automatically changes to "scrapped"
- Can no longer create new requests for scrapped equipment

### 5. **Status History**
- All status changes are tracked
- Audit trail with timestamps
- Shows who made the change

---

## 🐛 Troubleshooting

### Database Connection Error
```
Error: password authentication failed
```
**Solution**: Update `DB_PASSWORD` in `backend/.env` with correct PostgreSQL password

### Port Already in Use
```
Error: Port 3000/5000 is already in use
```
**Solution**: 
```powershell
# Kill processes on ports
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force
Stop-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess -Force
```

### Frontend Can't Connect to Backend
**Solution**: Ensure `frontend/.env.local` has:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 📦 Tech Stack

- **Backend**: Node.js, Express.js, PostgreSQL
- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Data Fetching**: React Query
- **UI Components**: Lucide Icons
- **Date Handling**: date-fns

---

## 🎯 For Live Share Guests

As a Live Share guest:
1. **You can view and edit code**
2. **You can see running servers** on http://localhost:3000 and http://localhost:5000
3. **You cannot install packages** - the host must run npm install
4. **You share the host's terminal** - use shared terminals to run commands

**Ask the host to run the servers using the commands above!**
