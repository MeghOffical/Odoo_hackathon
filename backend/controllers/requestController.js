const MaintenanceRequest = require('../models/MaintenanceRequest');
const Equipment = require('../models/Equipment');
const RequestComment = require('../models/RequestComment');

// Get all requests
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find()
      .populate('equipment_id', 'name serial_number')
      .populate('assigned_team_id', 'name color')
      .populate('assigned_technician_id', 'full_name')
      .populate('reported_by', 'full_name')
      .sort({ created_at: -1 })
      .lean();

    const formattedRequests = requests.map(r => ({
      ...r,
      id: r._id,
      equipment_name: r.equipment_id?.name,
      team_name: r.assigned_team_id?.name,
      team_color: r.assigned_team_id?.color,
      technician_name: r.assigned_technician_id?.full_name,
      reported_by_name: r.reported_by?.full_name
    }));

    res.json({ requests: formattedRequests });
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
};

// Get single request
exports.getRequestById = async (req, res) => {
  try {
    const request = await MaintenanceRequest.findById(req.params.id)
      .populate('equipment_id', 'name serial_number location')
      .populate('assigned_team_id', 'name color')
      .populate('assigned_technician_id', 'full_name email')
      .populate('reported_by', 'full_name email');

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Get comments
    const comments = await RequestComment.find({ request_id: req.params.id })
      .populate('user_id', 'full_name')
      .sort({ created_at: -1 });

    res.json({
      request: {
        ...request.toObject(),
        id: request._id,
        equipment_name: request.equipment_id?.name,
        team_name: request.assigned_team_id?.name,
        team_color: request.assigned_team_id?.color,
        technician_name: request.assigned_technician_id?.full_name
      },
      comments: comments.map(c => ({
        ...c.toObject(),
        id: c._id,
        user_name: c.user_id?.full_name
      }))
    });
  } catch (error) {
    console.error('Get request error:', error);
    res.status(500).json({ error: 'Failed to fetch request' });
  }
};

// Create request
exports.createRequest = async (req, res) => {
  try {
    const requestData = {
      ...req.body,
      reported_by: req.userId
    };

    // If equipment is selected, auto-assign team
    if (req.body.equipment_id) {
      const equipment = await Equipment.findById(req.body.equipment_id);
      if (equipment && equipment.maintenance_team_id) {
        requestData.assigned_team_id = equipment.maintenance_team_id;
        if (equipment.default_technician_id) {
          requestData.assigned_technician_id = equipment.default_technician_id;
        }
      }
    }

    const request = await MaintenanceRequest.create(requestData);
    res.status(201).json({ request });
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({ error: 'Failed to create request' });
  }
};

// Update request
exports.updateRequest = async (req, res) => {
  try {
    const updates = { ...req.body };

    // Handle status transitions
    if (req.body.status === 'in_progress' && !updates.started_date) {
      updates.started_date = new Date();
    }
    if (req.body.status === 'repaired' || req.body.status === 'scrap') {
      if (!updates.completed_date) {
        updates.completed_date = new Date();
      }
      // Update equipment status if scrapped
      if (req.body.status === 'scrap') {
        const request = await MaintenanceRequest.findById(req.params.id);
        if (request && request.equipment_id) {
          await Equipment.findByIdAndUpdate(request.equipment_id, { status: 'scrapped' });
        }
      }
    }

    const request = await MaintenanceRequest.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.json({ request });
  } catch (error) {
    console.error('Update request error:', error);
    res.status(500).json({ error: 'Failed to update request' });
  }
};

// Add comment
exports.addComment = async (req, res) => {
  try {
    const comment = await RequestComment.create({
      request_id: req.params.id,
      user_id: req.userId,
      comment: req.body.comment
    });

    res.status(201).json({ comment });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

// Get calendar events
exports.getCalendar = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    const filter = {
      request_type: 'preventive',
      scheduled_date: {
        $gte: new Date(start_date),
        $lte: new Date(end_date)
      }
    };

    const events = await MaintenanceRequest.find(filter)
      .populate('equipment_id', 'name')
      .populate('assigned_team_id', 'name color')
      .populate('assigned_technician_id', 'full_name')
      .lean();

    const formattedEvents = events.map(e => ({
      ...e,
      id: e._id,
      equipment_name: e.equipment_id?.name,
      team_name: e.assigned_team_id?.name,
      team_color: e.assigned_team_id?.color,
      technician_name: e.assigned_technician_id?.full_name
    }));

    res.json({ events: formattedEvents });
  } catch (error) {
    console.error('Get calendar error:', error);
    res.status(500).json({ error: 'Failed to fetch calendar events' });
  }
};

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    // Status stats
    const statusStats = await MaintenanceRequest.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { status: '$_id', count: 1, _id: 0 } }
    ]);

    // Request type stats
    const typeStats = await MaintenanceRequest.aggregate([
      { $group: { _id: '$request_type', count: { $sum: 1 } } },
      { $project: { request_type: '$_id', count: 1, _id: 0 } }
    ]);

    // Recent activity
    const recentActivity = await MaintenanceRequest.find()
      .populate('equipment_id', 'name')
      .sort({ created_at: -1 })
      .limit(10)
      .lean();

    res.json({
      status_stats: statusStats,
      request_type_stats: typeStats,
      team_performance: [],
      recent_activity: recentActivity.map(a => ({
        ...a,
        id: a._id,
        equipment_name: a.equipment_id?.name
      }))
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};
