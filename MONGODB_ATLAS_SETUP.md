# MongoDB Atlas Setup for GearGuard

## ✅ Database Schema Already Created!

Your MongoDB schemas are already defined in:
- `backend/models/User.js` - User accounts and authentication
- `backend/models/MaintenanceTeam.js` - Maintenance teams
- `backend/models/Equipment.js` - Equipment tracking
- `backend/models/MaintenanceRequest.js` - Maintenance requests
- `backend/models/RequestComment.js` - Comments on requests
- `backend/models/TeamMember.js` - Team membership

## 🚀 Quick Setup Steps:

### 1. MongoDB Atlas Account Setup
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up (use Google/GitHub for fastest signup)
3. Select **FREE M0** tier

### 2. Create Cluster
1. Click **"Build a Database"**
2. Choose **FREE Shared (M0)**
3. Select AWS and closest region
4. Click **"Create"** (wait 1-3 minutes)

### 3. Create Database User
1. Go to **Database Access** → **Add New Database User**
2. Username: `gearguard`
3. Click **"Autogenerate Secure Password"** → **COPY IT!**
4. Database User Privileges: **"Atlas admin"**
5. Click **"Add User"**

### 4. Network Access
1. Go to **Network Access** → **Add IP Address**
2. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
3. Click **"Confirm"**

### 5. Get Connection String
1. Go to **Database** → Click **"Connect"** on your cluster
2. Choose **"Drivers"**
3. Select **Node.js** and latest version
4. Copy the connection string:
   ```
   mongodb+srv://gearguard:<password>@cluster0.xxxxx.mongodb.net/
   ```

### 6. Update .env File
Open `backend/.env` and replace the MONGODB_URI:

```env
MONGODB_URI=mongodb+srv://gearguard:YOUR_COPIED_PASSWORD@cluster0.xxxxx.mongodb.net/gearguard?retryWrites=true&w=majority
```

**Replace:**
- `YOUR_COPIED_PASSWORD` with the password you copied
- `cluster0.xxxxx` with your actual cluster name

### 7. Initialize Database
```powershell
cd "D:\ANSH BADREISYA\OneDrive\Desktop\Oddo Heckathon\gearguard\backend"
npm run init-db
```

You should see:
```
✅ Connected to MongoDB
🗑️  Cleared existing data
✅ Admin user created (username: admin, password: admin123)
✅ Sample maintenance teams created
✅ Sample equipment created
🎉 Database initialization complete!
```

### 8. Start the Application
```powershell
cd ..
npm run dev
```

### 9. Login
- Go to http://localhost:3000
- Username: `admin`
- Password: `admin123`

## 📊 Database Schema Overview

### Users Collection
```javascript
{
  username: String (unique),
  password: String (hashed),
  full_name: String,
  email: String (unique),
  role: Enum ['admin', 'manager', 'technician', 'user'],
  is_active: Boolean,
  created_at: Date,
  updated_at: Date
}
```

### MaintenanceTeams Collection
```javascript
{
  name: String (unique),
  description: String,
  color: String (hex color),
  is_active: Boolean,
  created_at: Date,
  updated_at: Date
}
```

### Equipment Collection
```javascript
{
  name: String,
  serial_number: String,
  category: Enum ['machinery', 'vehicle', 'computer', 'printer', 'hvac', 'electrical', 'other'],
  manufacturer: String,
  model: String,
  purchase_date: Date,
  warranty_expiry: Date,
  location: String,
  building: String,
  room: String,
  floor: String,
  department: String,
  maintenance_team_id: ObjectId (ref: MaintenanceTeam),
  default_technician_id: ObjectId (ref: User),
  status: Enum ['operational', 'maintenance', 'down', 'scrapped'],
  notes: String,
  created_at: Date,
  updated_at: Date
}
```

### MaintenanceRequests Collection
```javascript
{
  subject: String,
  description: String,
  equipment_id: ObjectId (ref: Equipment),
  request_type: Enum ['corrective', 'preventive'],
  priority: Enum ['low', 'medium', 'high', 'critical'],
  status: Enum ['new', 'in_progress', 'repaired', 'scrap'],
  assigned_team_id: ObjectId (ref: MaintenanceTeam),
  assigned_technician_id: ObjectId (ref: User),
  reported_by: ObjectId (ref: User),
  scheduled_date: Date,
  started_date: Date,
  completed_date: Date,
  duration_hours: Number,
  resolution_notes: String,
  created_at: Date,
  updated_at: Date
}
```

### RequestComments Collection
```javascript
{
  request_id: ObjectId (ref: MaintenanceRequest),
  user_id: ObjectId (ref: User),
  comment: String,
  created_at: Date,
  updated_at: Date
}
```

### TeamMembers Collection
```javascript
{
  team_id: ObjectId (ref: MaintenanceTeam),
  user_id: ObjectId (ref: User),
  role: String,
  joined_at: Date
}
```

## 🔍 View Your Data in MongoDB Atlas

1. Go to your MongoDB Atlas dashboard
2. Click **"Browse Collections"**
3. You'll see the `gearguard` database with all collections
4. Click any collection to view documents

## 🆘 Troubleshooting

### Connection Error
- Make sure IP is whitelisted (0.0.0.0/0 for development)
- Check password is correct (no special characters that need encoding)
- Verify cluster name in connection string

### Authentication Failed
- Double-check username is `gearguard`
- Password must match exactly (copy-paste from Atlas)
- User must have "Read and write to any database" permission

### Can't Find Database
- Database is created automatically when you run `npm run init-db`
- Refresh "Browse Collections" in Atlas after initialization

## ✅ Advantages of MongoDB Atlas

1. ✅ **No Local Installation** - Works immediately
2. ✅ **Cloud Backup** - Data is automatically backed up
3. ✅ **Easy Sharing** - Team members can connect from anywhere
4. ✅ **Visual Interface** - Browse and edit data in the web UI
5. ✅ **Free Tier** - Perfect for development and testing

---

**You're all set!** MongoDB Atlas + your existing schemas = ready to go! 🚀
