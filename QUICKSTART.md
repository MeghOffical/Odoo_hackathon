# 🚀 Quick Start Guide - GearGuard

## ✅ What's Already Done

1. ✅ All dependencies installed (backend + frontend)
2. ✅ Project structure created
3. ✅ All pages and components ready
4. ✅ Backend API fully implemented
5. ✅ Database schema ready

## 🔧 PostgreSQL Setup (Currently Installing)

### After PostgreSQL Installation Completes:

1. **Remember the password** you set during installation for the `postgres` user

2. **Start PostgreSQL** (should start automatically, or use):
   ```powershell
   # Check if running:
   Get-Service -Name "postgresql*"
   
   # If not running, start it:
   Start-Service postgresql-x64-15  # (version may vary)
   ```

3. **Create the database:**
   ```powershell
   # Open PostgreSQL command line:
   psql -U postgres
   
   # When prompted, enter your postgres password
   # Then create the database:
   CREATE DATABASE gearguard;
   
   # Verify it was created:
   \l
   
   # Exit psql:
   \q
   ```

## ⚙️ Configure Backend

1. **Update the .env file** with your PostgreSQL password:
   ```powershell
   cd "D:\ANSH BADREISYA\OneDrive\Desktop\Oddo Heckathon\gearguard\backend"
   notepad .env
   ```

2. **Change this line:**
   ```env
   DB_PASSWORD=your_password
   ```
   to:
   ```env
   DB_PASSWORD=YOUR_ACTUAL_POSTGRES_PASSWORD
   ```

3. **Save and close** the file

## 🗄️ Initialize Database

Run this command to create all tables and seed initial data:

```powershell
cd "D:\ANSH BADREISYA\OneDrive\Desktop\Oddo Heckathon\gearguard\backend"
npm run init-db
```

You should see:
```
✅ All tables created successfully!
✅ Admin user created (username: admin, password: admin123)
✅ Sample maintenance teams created
🎉 Database initialization complete!
```

## 🚀 Start the Application

### Option 1: Start Everything Together
```powershell
cd "D:\ANSH BADREISYA\OneDrive\Desktop\Oddo Heckathon\gearguard"
npm run dev
```

### Option 2: Start Separately (if needed)

**Terminal 1 - Backend:**
```powershell
cd "D:\ANSH BADREISYA\OneDrive\Desktop\Oddo Heckathon\gearguard\backend"
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd "D:\ANSH BADREISYA\OneDrive\Desktop\Oddo Heckathon\gearguard\frontend"
npm run dev
```

## 🌐 Access the Application

1. **Frontend:** http://localhost:3000
2. **Backend API:** http://localhost:5000/api

## 🔐 Login Credentials

```
Username: admin
Password: admin123
Role: Administrator
```

## ✨ Features to Test

### 1. Dashboard
- View statistics and recent activity
- See team performance metrics

### 2. Equipment Management
- Click "Add Equipment"
- Fill in equipment details
- Assign to maintenance team
- View equipment detail page
- See maintenance history

### 3. Maintenance Teams
- Create teams with different colors
- Add team members
- View team details

### 4. Maintenance Requests (Kanban Board)
- Create new requests (corrective or preventive)
- Drag and drop cards between columns:
  - New → In Progress → Repaired → Scrap
- Equipment's team auto-fills when selected
- Add comments on requests
- Update status and duration

### 5. Calendar View
- View preventive maintenance schedule
- Click dates to see scheduled work
- Color-coded by team

## 🐛 Troubleshooting

### PostgreSQL Not Connecting
```powershell
# Check if PostgreSQL is running:
Get-Service -Name "postgresql*"

# If status is "Stopped", start it:
Start-Service postgresql-x64-15
```

### Database Connection Error
- Verify `.env` file has correct password
- Check PostgreSQL is running on port 5432
- Ensure database `gearguard` exists

### Port Already in Use
**Backend (5000):**
```powershell
# Find process using port 5000:
netstat -ano | findstr :5000

# Kill it (replace PID with actual number):
Stop-Process -Id PID -Force
```

**Frontend (3000):**
```powershell
# Find and kill process:
netstat -ano | findstr :3000
Stop-Process -Id PID -Force
```

## 📝 Quick Commands Reference

```powershell
# Navigate to project
cd "D:\ANSH BADREISYA\OneDrive\Desktop\Oddo Heckathon\gearguard"

# Start both frontend and backend
npm run dev

# Initialize database (run once)
cd backend
npm run init-db
cd ..

# Start only backend
cd backend
npm run dev

# Start only frontend  
cd frontend
npm run dev

# Check PostgreSQL status
Get-Service -Name "postgresql*"
```

## 🎯 Testing Workflow

1. **Login** with admin credentials
2. **Create a Team** (e.g., "Mechanical Team")
3. **Add Equipment** and assign to that team
4. **Create a Maintenance Request** for that equipment
5. **Drag the request** through the Kanban board stages
6. **Add comments** on the request
7. **Schedule preventive maintenance** and view in calendar
8. **Check dashboard** to see updated statistics

## 📊 Sample Data Included

After initialization, you'll have:
- ✅ Admin user (admin / admin123)
- ✅ 3 sample teams:
  - Mechanical Team (Red)
  - Electrical Team (Orange)
  - IT Support (Blue)

You can start creating equipment and requests immediately!

## 🆘 Need Help?

Check the main README.md for:
- Complete feature list
- API endpoints documentation
- Database schema details
- Deployment instructions

---

**Status:** ✅ Ready to run once PostgreSQL is configured!
