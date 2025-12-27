# GearGuard - Maintenance Management System

A comprehensive maintenance management system built with Next.js, Express, and PostgreSQL. GearGuard helps companies track equipment, manage maintenance teams, and handle maintenance requests efficiently.

## 🚀 Features

### Core Functionality
- **Equipment Management**: Track all company assets with detailed information
- **Maintenance Teams**: Organize specialized teams (Mechanics, Electricians, IT Support)
- **Maintenance Requests**: Create and track corrective and preventive maintenance
- **Kanban Board**: Visual drag-and-drop interface for request management
- **Calendar View**: Schedule and track preventive maintenance tasks
- **Dashboard**: Real-time statistics and recent activity
- **Smart Automation**: Automatic team assignment based on equipment

### Key Features
- ✅ Role-based authentication (Admin, Manager, User, Technician)
- ✅ Drag-and-drop Kanban board (New → In Progress → Repaired → Scrap)
- ✅ Calendar view for preventive maintenance scheduling
- ✅ Equipment maintenance history tracking
- ✅ Status change history with audit trail
- ✅ Comments and notes on requests
- ✅ Overdue request highlighting
- ✅ Team-based request assignment
- ✅ Equipment scrap logic with automatic status updates

## 🛠️ Tech Stack

### Backend
- **Node.js** with **Express**
- **PostgreSQL** database
- **JWT** authentication
- **bcryptjs** for password hashing

### Frontend
- **Next.js 14** (React 18)
- **TypeScript**
- **Tailwind CSS** for styling
- **React Query** for data fetching
- **Zustand** for state management
- **date-fns** for date handling
- **Lucide React** for icons

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **PostgreSQL** (v14 or higher)
- **npm** or **yarn**

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
cd "d:/ANSH BADREISYA/OneDrive/Desktop/Oddo Heckathon/gearguard"
```

### 2. Install Dependencies

#### Install root dependencies:
```bash
npm install
```

#### Install backend dependencies:
```bash
cd backend
npm install
cd ..
```

#### Install frontend dependencies:
```bash
cd frontend
npm install
cd ..
```

### 3. Database Setup

#### Create PostgreSQL Database:
```sql
CREATE DATABASE gearguard;
```

#### Configure Database Connection:
Copy the example environment file and update with your database credentials:

```bash
cd backend
copy .env.example .env
```

Edit `backend/.env` and update these values:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gearguard
DB_USER=postgres
DB_PASSWORD=your_actual_password

PORT=5000
NODE_ENV=development

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
```

#### Initialize Database:
```bash
cd backend
npm run init-db
cd ..
```

This will create all tables and seed initial data:
- Admin user (username: `admin`, password: `admin123`)
- Sample maintenance teams

### 4. Frontend Configuration

The frontend is already configured to connect to `http://localhost:5000/api`.
No additional configuration needed unless you change the backend port.

## 🚀 Running the Application

### Option 1: Run Both Frontend and Backend Together
```bash
npm run dev
```

This will start:
- Backend API on `http://localhost:5000`
- Frontend on `http://localhost:3000`

### Option 2: Run Separately

#### Start Backend:
```bash
cd backend
npm run dev
```

#### Start Frontend (in a new terminal):
```bash
cd frontend
npm run dev
```

## 🔐 Default Login Credentials

After database initialization, use these credentials to log in:

- **Username**: `admin`
- **Password**: `admin123`
- **Role**: Administrator

## 📱 Application Structure

```
gearguard/
├── backend/
│   ├── config/
│   │   └── database.js          # PostgreSQL connection
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── equipmentController.js
│   │   ├── requestController.js
│   │   └── teamController.js
│   ├── middleware/
│   │   └── auth.js              # JWT authentication
│   ├── routes/
│   │   ├── auth.js
│   │   ├── equipment.js
│   │   ├── requests.js
│   │   └── teams.js
│   ├── scripts/
│   │   └── initDatabase.js      # Database initialization
│   ├── .env.example
│   ├── package.json
│   └── server.js                # Express server
│
├── frontend/
│   ├── components/
│   │   └── Layout.tsx           # Main layout with sidebar
│   ├── lib/
│   │   └── api.ts               # API client & endpoints
│   ├── pages/
│   │   ├── _app.tsx
│   │   ├── index.tsx
│   │   ├── login.tsx
│   │   ├── dashboard.tsx
│   │   ├── calendar.tsx
│   │   ├── equipment/
│   │   │   └── index.tsx
│   │   ├── teams/
│   │   │   └── index.tsx
│   │   └── requests/
│   │       └── index.tsx        # Kanban board
│   ├── store/
│   │   └── authStore.ts         # Authentication state
│   ├── styles/
│   │   └── globals.css
│   ├── types/
│   │   └── index.ts             # TypeScript types
│   └── package.json
│
└── package.json                 # Root package.json
```

## 🗄️ Database Schema

### Main Tables:
- **users**: User accounts with roles
- **maintenance_teams**: Specialized maintenance teams
- **team_members**: Junction table for team membership
- **equipment**: Company assets and equipment
- **maintenance_requests**: Maintenance work requests
- **request_status_history**: Audit trail for status changes
- **request_comments**: Comments on requests

### Key Relationships:
- Equipment → Maintenance Team (assigned team)
- Equipment → User (assigned to)
- Equipment → User (default technician)
- Maintenance Request → Equipment
- Maintenance Request → Team
- Maintenance Request → Technician (User)

## 🎯 Usage Guide

### Creating Equipment
1. Navigate to **Equipment** page
2. Click **Add Equipment**
3. Fill in details (name, serial number, location, etc.)
4. Assign maintenance team and default technician
5. Save

### Creating Maintenance Teams
1. Navigate to **Teams** page
2. Click **Add Team**
3. Enter team name, description, and color
4. Add team members (technicians)
5. Save

### Creating Maintenance Requests
1. Navigate to **Requests** page
2. Click **New Request**
3. Select equipment (team auto-filled from equipment)
4. Choose request type:
   - **Corrective**: For breakdowns
   - **Preventive**: For scheduled maintenance
5. Set priority and scheduled date
6. Assign technician
7. Submit

### Managing Requests (Kanban Board)
1. View requests organized by status columns
2. Drag and drop cards between columns to update status
3. Click on a card to view details
4. Add comments and update duration
5. Mark as repaired when complete

### Scheduling Preventive Maintenance
1. Navigate to **Calendar** page
2. Create preventive maintenance requests with scheduled dates
3. View all scheduled tasks in calendar format
4. Click on a date to see that day's scheduled work

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `GET /api/auth/users` - Get all users (admin only)

### Equipment
- `GET /api/equipment` - Get all equipment
- `GET /api/equipment/:id` - Get equipment details
- `POST /api/equipment` - Create equipment
- `PUT /api/equipment/:id` - Update equipment
- `DELETE /api/equipment/:id` - Delete equipment

### Teams
- `GET /api/teams` - Get all teams
- `GET /api/teams/:id` - Get team details
- `POST /api/teams` - Create team
- `PUT /api/teams/:id` - Update team
- `POST /api/teams/:id/members` - Add team member
- `DELETE /api/teams/:id/members/:userId` - Remove member

### Maintenance Requests
- `GET /api/requests` - Get all requests
- `GET /api/requests/:id` - Get request details
- `POST /api/requests` - Create request
- `PUT /api/requests/:id` - Update request
- `DELETE /api/requests/:id` - Delete request
- `POST /api/requests/:id/comments` - Add comment
- `GET /api/requests/calendar` - Get calendar events
- `GET /api/requests/dashboard/stats` - Get statistics

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control
- Protected API routes
- Token expiration handling
- SQL injection prevention (parameterized queries)

## 🎨 UI Features

- Responsive design (mobile, tablet, desktop)
- Dark mode support
- Drag-and-drop Kanban interface
- Interactive calendar
- Real-time statistics
- Toast notifications
- Loading states
- Empty states
- Error handling

## 📊 Business Logic

### Automatic Team Assignment
When creating a maintenance request, if the user selects an equipment:
- The system automatically fetches the equipment's assigned maintenance team
- The default technician is also populated
- This reduces manual data entry and errors

### Status Flow
```
New → In Progress → Repaired
                 ↓
               Scrap
```

### Scrap Logic
When a request is marked as "Scrap":
- The equipment status is automatically updated to "scrapped"
- A note is added to the equipment record
- The equipment is flagged as unusable

### Overdue Detection
Requests with scheduled dates in the past (and not yet repaired) are:
- Highlighted in red on the Kanban board
- Marked as overdue in the calendar view

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Update `NODE_ENV=production`
3. Use a process manager like PM2
4. Configure PostgreSQL for production
5. Set up SSL/TLS

### Frontend Deployment
1. Build the Next.js app:
   ```bash
   cd frontend
   npm run build
   ```
2. Deploy to Vercel, Netlify, or your hosting service
3. Update `NEXT_PUBLIC_API_URL` to production API URL

## 🧪 Testing

### Testing Checklist:
- [ ] User authentication and authorization
- [ ] Equipment CRUD operations
- [ ] Team management
- [ ] Request creation and updates
- [ ] Kanban drag-and-drop
- [ ] Calendar view functionality
- [ ] Dashboard statistics
- [ ] Automatic team assignment
- [ ] Status history tracking
- [ ] Scrap logic

## ✨ Latest Features (December 2025)

- ✅ Equipment detail page with smart "Maintenance" button
- ✅ Comprehensive maintenance history view per equipment
- ✅ Create request directly from equipment page
- ✅ Enhanced request form with auto-population
- ✅ Equipment form with team/technician selection
- ✅ Overdue request detection and highlighting
- ✅ Request type badges and priority indicators
- ✅ Technician avatars on Kanban cards
- ✅ Calendar view for preventive maintenance
- ✅ Dashboard with real-time statistics

## 📝 Future Enhancements

- [ ] File attachments for requests
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Advanced reporting and analytics
- [ ] Equipment QR code generation
- [ ] Spare parts inventory management
- [ ] Maintenance cost tracking
- [ ] Performance metrics
- [ ] Multi-language support
- [ ] Enhanced dark mode

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Created for Oddo Hackathon 2025

## 🆘 Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify database exists: `psql -U postgres -l`

### Port Already in Use
- Backend: Change `PORT` in `backend/.env`
- Frontend: Use `npm run dev -- -p 3001`

### Module Not Found
- Run `npm install` in both backend and frontend directories
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### API Connection Errors
- Ensure backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` in frontend
- Verify CORS is enabled in backend

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the code comments
3. Examine console logs for errors

---

**Built with ❤️ using Next.js, Express, and PostgreSQL**
