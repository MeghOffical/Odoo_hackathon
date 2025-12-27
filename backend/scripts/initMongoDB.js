require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const User = require('../models/User');
const MaintenanceTeam = require('../models/MaintenanceTeam');
const Equipment = require('../models/Equipment');

async function initDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gearguard');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await MaintenanceTeam.deleteMany({});
    await Equipment.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      username: 'admin',
      password: hashedPassword,
      full_name: 'System Administrator',
      email: 'admin@gearguard.com',
      role: 'admin',
      is_active: true
    });
    console.log('✅ Admin user created (username: admin, password: admin123)');

    // Create maintenance teams
    const mechanicalTeam = await MaintenanceTeam.create({
      name: 'Mechanical Team',
      description: 'Handles all mechanical equipment maintenance and repairs',
      color: '#ef4444'
    });

    const electricalTeam = await MaintenanceTeam.create({
      name: 'Electrical Team',
      description: 'Responsible for electrical systems and equipment',
      color: '#f97316'
    });

    const itTeam = await MaintenanceTeam.create({
      name: 'IT Support',
      description: 'Maintains computers, printers, and IT infrastructure',
      color: '#3b82f6'
    });

    console.log('✅ Sample maintenance teams created');

    // Create sample equipment
    await Equipment.create({
      name: 'CNC Machine #1',
      serial_number: 'CNC-2023-001',
      category: 'machinery',
      location: 'Building A - Floor 1',
      department: 'Manufacturing',
      maintenance_team_id: mechanicalTeam._id,
      status: 'operational'
    });

    await Equipment.create({
      name: 'Printer HP-502',
      serial_number: 'PRN-HP-502',
      category: 'printer',
      location: 'Building B - Floor 2',
      department: 'Administration',
      maintenance_team_id: itTeam._id,
      status: 'operational'
    });

    console.log('✅ Sample equipment created');

    console.log('\n🎉 Database initialization complete!');
    console.log('\n📝 Login credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

initDatabase();
