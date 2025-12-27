const Equipment = require('../models/Equipment');
const MaintenanceRequest = require('../models/MaintenanceRequest');

// Get all equipment
exports.getAllEquipment = async (req, res) => {
  try {
    const { status, department, team_id } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (department) filter.department = department;
    if (team_id) filter.maintenance_team_id = team_id;

    const equipment = await Equipment.find(filter)
      .populate('maintenance_team_id', 'name color')
      .populate('default_technician_id', 'full_name')
      .lean();

    // Get request counts for each equipment
    const equipmentWithCounts = await Promise.all(equipment.map(async (item) => {
      const totalRequests = await MaintenanceRequest.countDocuments({ equipment_id: item._id });
      const openRequests = await MaintenanceRequest.countDocuments({ 
        equipment_id: item._id,
        status: { $in: ['new', 'in_progress'] }
      });

      return {
        ...item,
        id: item._id,
        maintenance_team_name: item.maintenance_team_id?.name,
        team_color: item.maintenance_team_id?.color,
        default_technician_name: item.default_technician_id?.full_name,
        total_requests: totalRequests,
        open_requests: openRequests
      };
    }));

    res.json({ equipment: equipmentWithCounts });
  } catch (error) {
    console.error('Get equipment error:', error);
    res.status(500).json({ error: 'Failed to fetch equipment' });
  }
};

// Get single equipment
exports.getEquipmentById = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id)
      .populate('maintenance_team_id', 'name color')
      .populate('default_technician_id', 'full_name');

    if (!equipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    // Get maintenance history
    const requests = await MaintenanceRequest.find({ equipment_id: req.params.id })
      .populate('assigned_technician_id', 'full_name')
      .populate('assigned_team_id', 'name color')
      .sort({ created_at: -1 });

    res.json({
      equipment: {
        ...equipment.toObject(),
        id: equipment._id,
        maintenance_team_name: equipment.maintenance_team_id?.name,
        default_technician_name: equipment.default_technician_id?.full_name
      },
      maintenance_history: requests.map(r => ({
        ...r.toObject(),
        id: r._id,
        team_name: r.assigned_team_id?.name,
        team_color: r.assigned_team_id?.color,
        technician_name: r.assigned_technician_id?.full_name
      }))
    });
  } catch (error) {
    console.error('Get equipment error:', error);
    res.status(500).json({ error: 'Failed to fetch equipment' });
  }
};

// Create equipment
exports.createEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.create(req.body);
    res.status(201).json({ equipment });
  } catch (error) {
    console.error('Create equipment error:', error);
    res.status(500).json({ error: 'Failed to create equipment' });
  }
};

// Update equipment
exports.updateEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!equipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    res.json({ equipment });
  } catch (error) {
    console.error('Update equipment error:', error);
    res.status(500).json({ error: 'Failed to update equipment' });
  }
};

// Delete equipment
exports.deleteEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndDelete(req.params.id);

    if (!equipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    res.json({ message: 'Equipment deleted successfully' });
  } catch (error) {
    console.error('Delete equipment error:', error);
    res.status(500).json({ error: 'Failed to delete equipment' });
  }
};
