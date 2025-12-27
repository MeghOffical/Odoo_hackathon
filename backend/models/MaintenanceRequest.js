const mongoose = require('mongoose');

const maintenanceRequestSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true
  },
  description: String,
  equipment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment',
    required: true
  },
  request_type: {
    type: String,
    enum: ['corrective', 'preventive'],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['new', 'in_progress', 'repaired', 'scrap'],
    default: 'new'
  },
  assigned_team_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MaintenanceTeam'
  },
  assigned_technician_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reported_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  scheduled_date: Date,
  started_date: Date,
  completed_date: Date,
  duration_hours: Number,
  resolution_notes: String
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('MaintenanceRequest', maintenanceRequestSchema);
