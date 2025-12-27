const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  serial_number: String,
  category: {
    type: String,
    enum: ['machinery', 'vehicle', 'computer', 'printer', 'hvac', 'electrical', 'other'],
    default: 'other'
  },
  manufacturer: String,
  model: String,
  purchase_date: Date,
  warranty_expiry: Date,
  location: String,
  building: String,
  room: String,
  floor: String,
  department: String,
  maintenance_team_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MaintenanceTeam'
  },
  default_technician_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['operational', 'maintenance', 'down', 'scrapped'],
    default: 'operational'
  },
  notes: String
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('Equipment', equipmentSchema);
