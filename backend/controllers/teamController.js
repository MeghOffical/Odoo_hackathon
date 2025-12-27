const MaintenanceTeam = require('../models/MaintenanceTeam');
const TeamMember = require('../models/TeamMember');
const User = require('../models/User');
const Equipment = require('../models/Equipment');

// Get all teams
exports.getAllTeams = async (req, res) => {
  try {
    const teams = await MaintenanceTeam.find({ is_active: true }).lean();

    const teamsWithCounts = await Promise.all(teams.map(async (team) => {
      const memberCount = await TeamMember.countDocuments({ team_id: team._id });
      const equipmentCount = await Equipment.countDocuments({ maintenance_team_id: team._id });

      return {
        ...team,
        id: team._id,
        member_count: memberCount,
        equipment_count: equipmentCount
      };
    }));

    res.json({ teams: teamsWithCounts });
  } catch (error) {
    console.error('Get teams error:', error);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
};

// Get single team
exports.getTeamById = async (req, res) => {
  try {
    const team = await MaintenanceTeam.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Get team members
    const members = await TeamMember.find({ team_id: req.params.id })
      .populate('user_id', 'full_name email role')
      .lean();

    res.json({
      team: { ...team.toObject(), id: team._id },
      members: members.map(m => ({
        ...m,
        id: m._id,
        full_name: m.user_id?.full_name,
        email: m.user_id?.email,
        user_role: m.user_id?.role
      }))
    });
  } catch (error) {
    console.error('Get team error:', error);
    res.status(500).json({ error: 'Failed to fetch team' });
  }
};

// Create team
exports.createTeam = async (req, res) => {
  try {
    const team = await MaintenanceTeam.create(req.body);
    res.status(201).json({ team });
  } catch (error) {
    console.error('Create team error:', error);
    res.status(500).json({ error: 'Failed to create team' });
  }
};

// Update team
exports.updateTeam = async (req, res) => {
  try {
    const team = await MaintenanceTeam.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    res.json({ team });
  } catch (error) {
    console.error('Update team error:', error);
    res.status(500).json({ error: 'Failed to update team' });
  }
};

// Add team member
exports.addTeamMember = async (req, res) => {
  try {
    const { user_id, role } = req.body;

    // Check if already a member
    const existing = await TeamMember.findOne({
      team_id: req.params.id,
      user_id: user_id
    });

    if (existing) {
      return res.status(400).json({ error: 'User is already a member of this team' });
    }

    const member = await TeamMember.create({
      team_id: req.params.id,
      user_id: user_id,
      role: role || 'technician'
    });

    res.status(201).json({ member });
  } catch (error) {
    console.error('Add team member error:', error);
    res.status(500).json({ error: 'Failed to add team member' });
  }
};

// Remove team member
exports.removeTeamMember = async (req, res) => {
  try {
    const member = await TeamMember.findOneAndDelete({
      team_id: req.params.id,
      user_id: req.params.userId
    });

    if (!member) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    res.json({ message: 'Team member removed successfully' });
  } catch (error) {
    console.error('Remove team member error:', error);
    res.status(500).json({ error: 'Failed to remove team member' });
  }
};

// Get available technicians
exports.getTechnicians = async (req, res) => {
  try {
    const technicians = await User.find({
      role: { $in: ['technician', 'manager'] },
      is_active: true
    }).select('full_name email role');

    res.json({ technicians });
  } catch (error) {
    console.error('Get technicians error:', error);
    res.status(500).json({ error: 'Failed to fetch technicians' });
  }
};
