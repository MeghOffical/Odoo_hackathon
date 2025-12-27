# 🚀 MongoDB Setup Guide for GearGuard

## ✅ What I've Done

1. ✅ Replaced PostgreSQL (`pg`) with MongoDB (`mongoose`) in package.json
2. ✅ Updated database configuration to use MongoDB
3. ✅ Created Mongoose models for all entities
4. ✅ Created new database initialization script
5. ✅ Updated `.env.example` with MongoDB URI

## 📦 Step 1: Install MongoDB

**Download MongoDB Community Server:**
https://www.mongodb.com/try/download/community

**Installation Steps:**
1. Download the MSI installer for Windows
2. Run the installer
3. Choose "Complete" installation
4. **Important:** Check "Install MongoDB as a Service"
5. Use default port: `27017`
6. No password needed for local development

## 📦 Step 2: Install Dependencies

```powershell
cd "D:\ANSH BADREISYA\OneDrive\Desktop\Oddo Heckathon\gearguard\backend"
npm install
```

This will install `mongoose` (MongoDB driver) instead of `pg` (PostgreSQL).

## ⚙️ Step 3: Configure Environment

```powershell
cd backend
copy .env.example .env
notepad .env
```

Your `.env` file should contain:
```env
MONGODB_URI=mongodb://localhost:27017/gearguard
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRE=7d
```

**No password needed** for local MongoDB!

## 🗄️ Step 4: Initialize Database

```powershell
cd backend
npm run init-db
```

This will:
- Connect to MongoDB
- Create the `gearguard` database
- Create admin user (username: `admin`, password: `admin123`)
- Create 3 sample teams
- Create 2 sample equipment items

## 🚀 Step 5: Start the Application

**Option 1: Start everything together**
```powershell
cd "D:\ANSH BADREISYA\OneDrive\Desktop\Oddo Heckathon\gearguard"
npm run dev
```

**Option 2: Start separately**

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

## 🌐 Step 6: Access Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Login: `admin` / `admin123`

## 🔧 Verify MongoDB is Running

```powershell
# Check if MongoDB service is running:
Get-Service -Name "MongoDB"

# If not running, start it:
Start-Service MongoDB
```

## 📝 What Still Needs to Be Done

The controllers need to be updated to use Mongoose instead of SQL queries. I've created the models, but the controllers (in `controllers/` folder) still have PostgreSQL SQL queries.

**For now, to test the setup:**
1. Install MongoDB
2. Run `npm install` in backend
3. Run `npm run init-db`
4. Start the servers

The authentication will work, but equipment, teams, and requests features will need controller updates.

## 🆘 Troubleshooting

**MongoDB not starting:**
```powershell
# Check service status:
Get-Service MongoDB

# Start service:
Start-Service MongoDB

# If service doesn't exist, MongoDB may not be installed as a service
# Reinstall MongoDB and check "Install as Service"
```

**Connection refused:**
- Make sure MongoDB service is running
- Check port 27017 is not blocked
- Verify MONGODB_URI in .env file

**Import errors:**
- Run `npm install` in the backend folder
- Make sure all model files were created in `models/` folder

## ✨ Advantages of MongoDB for This Project

- ✅ **No password setup** needed for local development
- ✅ **Easier installation** on Windows
- ✅ **Flexible schema** - easier to modify data structure
- ✅ **JSON-native** - works perfectly with JavaScript/Node.js
- ✅ **Better for prototype** - faster development

---

**Next Steps:**
1. Install MongoDB Community Server
2. Run `npm install` in backend
3. Run `npm run init-db`
4. Start the application!
