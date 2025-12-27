const mongoose = require('mongoose');

const maintenanceTeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  color: {
    type: String,
    default: '#3b82f6'
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('MaintenanceTeam', maintenanceTeamSchema);
