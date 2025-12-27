const db = require('../config/database');

// Get all maintenance teams
exports.getAllTeams = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT mt.*,
        COUNT(DISTINCT tm.user_id) as member_count,
        COUNT(DISTINCT e.id) as equipment_count
       FROM maintenance_teams mt
       LEFT JOIN team_members tm ON mt.id = tm.team_id
       LEFT JOIN equipment e ON mt.id = e.maintenance_team_id
       WHERE mt.is_active = true
       GROUP BY mt.id
       ORDER BY mt.name`
    );

    res.json({ teams: result.rows });
  } catch (error) {
    console.error('Get teams error:', error);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
};

// Get single team with members
exports.getTeamById = async (req, res) => {
  try {
    const { id } = req.params;

    const teamResult = await db.query(
      'SELECT * FROM maintenance_teams WHERE id = $1',
      [id]
    );

    if (teamResult.rows.length === 0) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const membersResult = await db.query(
      `SELECT tm.*, u.username, u.full_name, u.email, u.avatar_url
       FROM team_members tm
       JOIN users u ON tm.user_id = u.id
       WHERE tm.team_id = $1
       ORDER BY tm.joined_at`,
      [id]
    );

    res.json({
      team: teamResult.rows[0],
      members: membersResult.rows
    });
  } catch (error) {
    console.error('Get team by ID error:', error);
    res.status(500).json({ error: 'Failed to fetch team' });
  }
};

// Create team
exports.createTeam = async (req, res) => {
  try {
    const { name, description, color } = req.body;

    const result = await db.query(
      `INSERT INTO maintenance_teams (name, description, color)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, description, color || '#3b82f6']
    );

    res.status(201).json({
      message: 'Team created successfully',
      team: result.rows[0]
    });
  } catch (error) {
    console.error('Create team error:', error);
    res.status(500).json({ error: 'Failed to create team' });
  }
};

// Update team
exports.updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, color, is_active } = req.body;

    const result = await db.query(
      `UPDATE maintenance_teams
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           color = COALESCE($3, color),
           is_active = COALESCE($4, is_active),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [name, description, color, is_active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Team not found' });
    }

    res.json({
      message: 'Team updated successfully',
      team: result.rows[0]
    });
  } catch (error) {
    console.error('Update team error:', error);
    res.status(500).json({ error: 'Failed to update team' });
  }
};

// Add member to team
exports.addTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, role } = req.body;

    const result = await db.query(
      `INSERT INTO team_members (team_id, user_id, role)
       VALUES ($1, $2, $3)
       ON CONFLICT (team_id, user_id) DO UPDATE
       SET role = $3
       RETURNING *`,
      [id, user_id, role || 'technician']
    );

    res.status(201).json({
      message: 'Team member added successfully',
      member: result.rows[0]
    });
  } catch (error) {
    console.error('Add team member error:', error);
    res.status(500).json({ error: 'Failed to add team member' });
  }
};

// Remove member from team
exports.removeTeamMember = async (req, res) => {
  try {
    const { id, userId } = req.params;

    const result = await db.query(
      'DELETE FROM team_members WHERE team_id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    res.json({ message: 'Team member removed successfully' });
  } catch (error) {
    console.error('Remove team member error:', error);
    res.status(500).json({ error: 'Failed to remove team member' });
  }
};

// Get available technicians for a team
exports.getTeamTechnicians = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `SELECT u.id, u.username, u.full_name, u.email, u.avatar_url, tm.role
       FROM team_members tm
       JOIN users u ON tm.user_id = u.id
       WHERE tm.team_id = $1 AND u.is_active = true
       ORDER BY u.full_name`,
      [id]
    );

    res.json({ technicians: result.rows });
  } catch (error) {
    console.error('Get team technicians error:', error);
    res.status(500).json({ error: 'Failed to fetch technicians' });
  }
};
