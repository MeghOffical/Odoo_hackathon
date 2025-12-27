const db = require('../config/database');

// Get all maintenance requests with filtering
exports.getAllRequests = async (req, res) => {
  try {
    const { status, request_type, team_id, technician_id, equipment_id } = req.query;
    
    let query = `
      SELECT mr.*,
        e.name as equipment_name,
        e.serial_number,
        mt.name as team_name,
        mt.color as team_color,
        tech.full_name as technician_name,
        tech.avatar_url as technician_avatar,
        creator.full_name as created_by_name
      FROM maintenance_requests mr
      JOIN equipment e ON mr.equipment_id = e.id
      LEFT JOIN maintenance_teams mt ON mr.maintenance_team_id = mt.id
      LEFT JOIN users tech ON mr.assigned_technician_id = tech.id
      LEFT JOIN users creator ON mr.created_by = creator.id
      WHERE 1=1
    `;
    
    const params = [];
    let paramCount = 1;

    if (status) {
      query += ` AND mr.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (request_type) {
      query += ` AND mr.request_type = $${paramCount}`;
      params.push(request_type);
      paramCount++;
    }

    if (team_id) {
      query += ` AND mr.maintenance_team_id = $${paramCount}`;
      params.push(team_id);
      paramCount++;
    }

    if (technician_id) {
      query += ` AND mr.assigned_technician_id = $${paramCount}`;
      params.push(technician_id);
      paramCount++;
    }

    if (equipment_id) {
      query += ` AND mr.equipment_id = $${paramCount}`;
      params.push(equipment_id);
      paramCount++;
    }

    query += ` ORDER BY 
      CASE 
        WHEN mr.status = 'new' THEN 1
        WHEN mr.status = 'in_progress' THEN 2
        WHEN mr.status = 'repaired' THEN 3
        ELSE 4
      END,
      mr.created_at DESC`;

    const result = await db.query(query, params);
    res.json({ requests: result.rows });
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
};

// Get single request with full details
exports.getRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    const requestResult = await db.query(
      `SELECT mr.*,
        e.name as equipment_name,
        e.serial_number,
        e.location,
        e.department,
        mt.name as team_name,
        mt.color as team_color,
        tech.full_name as technician_name,
        tech.email as technician_email,
        tech.avatar_url as technician_avatar,
        creator.full_name as created_by_name
       FROM maintenance_requests mr
       JOIN equipment e ON mr.equipment_id = e.id
       LEFT JOIN maintenance_teams mt ON mr.maintenance_team_id = mt.id
       LEFT JOIN users tech ON mr.assigned_technician_id = tech.id
       LEFT JOIN users creator ON mr.created_by = creator.id
       WHERE mr.id = $1`,
      [id]
    );

    if (requestResult.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Get status history
    const historyResult = await db.query(
      `SELECT rsh.*, u.full_name as changed_by_name
       FROM request_status_history rsh
       LEFT JOIN users u ON rsh.changed_by = u.id
       WHERE rsh.request_id = $1
       ORDER BY rsh.changed_at DESC`,
      [id]
    );

    // Get comments
    const commentsResult = await db.query(
      `SELECT rc.*, u.full_name as user_name, u.avatar_url
       FROM request_comments rc
       JOIN users u ON rc.user_id = u.id
       WHERE rc.request_id = $1
       ORDER BY rc.created_at DESC`,
      [id]
    );

    res.json({
      request: requestResult.rows[0],
      status_history: historyResult.rows,
      comments: commentsResult.rows
    });
  } catch (error) {
    console.error('Get request by ID error:', error);
    res.status(500).json({ error: 'Failed to fetch request' });
  }
};

// Create maintenance request
exports.createRequest = async (req, res) => {
  const client = await db.pool.connect();
  
  try {
    await client.query('BEGIN');

    const {
      subject, description, equipment_id, request_type,
      priority, scheduled_date, maintenance_team_id, assigned_technician_id
    } = req.body;

    // Get equipment's default team if not provided
    let teamId = maintenance_team_id;
    let technicianId = assigned_technician_id;

    if (!teamId) {
      const equipmentResult = await client.query(
        'SELECT maintenance_team_id, default_technician_id FROM equipment WHERE id = $1',
        [equipment_id]
      );
      
      if (equipmentResult.rows.length > 0) {
        teamId = equipmentResult.rows[0].maintenance_team_id;
        if (!technicianId) {
          technicianId = equipmentResult.rows[0].default_technician_id;
        }
      }
    }

    // Create request
    const result = await client.query(
      `INSERT INTO maintenance_requests (
        subject, description, equipment_id, maintenance_team_id,
        assigned_technician_id, request_type, priority, scheduled_date,
        status, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [subject, description, equipment_id, teamId, technicianId,
       request_type, priority || 'medium', scheduled_date, 'new', req.user.id]
    );

    const requestId = result.rows[0].id;

    // Log status history
    await client.query(
      `INSERT INTO request_status_history (request_id, new_status, changed_by)
       VALUES ($1, $2, $3)`,
      [requestId, 'new', req.user.id]
    );

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Maintenance request created successfully',
      request: result.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create request error:', error);
    res.status(500).json({ error: 'Failed to create request' });
  } finally {
    client.release();
  }
};

// Update maintenance request
exports.updateRequest = async (req, res) => {
  const client = await db.pool.connect();
  
  try {
    await client.query('BEGIN');

    const { id } = req.params;
    const updates = req.body;

    // Get current request
    const currentResult = await client.query(
      'SELECT status FROM maintenance_requests WHERE id = $1',
      [id]
    );

    if (currentResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Request not found' });
    }

    const oldStatus = currentResult.rows[0].status;
    const newStatus = updates.status;

    const fields = Object.keys(updates);
    const values = Object.values(updates);
    
    if (fields.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'No fields to update' });
    }

    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    values.push(id);

    const result = await client.query(
      `UPDATE maintenance_requests 
       SET ${setClause}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${values.length}
       RETURNING *`,
      values
    );

    // Log status change if status was updated
    if (newStatus && newStatus !== oldStatus) {
      await client.query(
        `INSERT INTO request_status_history (request_id, old_status, new_status, changed_by, notes)
         VALUES ($1, $2, $3, $4, $5)`,
        [id, oldStatus, newStatus, req.user.id, updates.notes || null]
      );

      // If marked as scrap, update equipment status
      if (newStatus === 'scrap') {
        await client.query(
          `UPDATE equipment SET status = 'scrapped', notes = CONCAT(COALESCE(notes, ''), '\nMarked as scrap from request #', $1)
           WHERE id = (SELECT equipment_id FROM maintenance_requests WHERE id = $1)`,
          [id]
        );
      }

      // If marked as repaired, set completed date
      if (newStatus === 'repaired' && !updates.completed_date) {
        await client.query(
          'UPDATE maintenance_requests SET completed_date = CURRENT_TIMESTAMP WHERE id = $1',
          [id]
        );
      }
    }

    await client.query('COMMIT');

    res.json({
      message: 'Request updated successfully',
      request: result.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Update request error:', error);
    res.status(500).json({ error: 'Failed to update request' });
  } finally {
    client.release();
  }
};

// Delete maintenance request
exports.deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'DELETE FROM maintenance_requests WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.json({ message: 'Request deleted successfully' });
  } catch (error) {
    console.error('Delete request error:', error);
    res.status(500).json({ error: 'Failed to delete request' });
  }
};

// Add comment to request
exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    const result = await db.query(
      `INSERT INTO request_comments (request_id, user_id, comment)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [id, req.user.id, comment]
    );

    res.status(201).json({
      message: 'Comment added successfully',
      comment: result.rows[0]
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

// Get requests for calendar (preventive only)
exports.getCalendarRequests = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    let query = `
      SELECT mr.id, mr.subject, mr.scheduled_date, mr.status, mr.duration_hours,
        e.name as equipment_name,
        tech.full_name as technician_name,
        mt.color as team_color
      FROM maintenance_requests mr
      JOIN equipment e ON mr.equipment_id = e.id
      LEFT JOIN users tech ON mr.assigned_technician_id = tech.id
      LEFT JOIN maintenance_teams mt ON mr.maintenance_team_id = mt.id
      WHERE mr.request_type = 'preventive'
        AND mr.scheduled_date IS NOT NULL
    `;

    const params = [];
    let paramCount = 1;

    if (start_date) {
      query += ` AND mr.scheduled_date >= $${paramCount}`;
      params.push(start_date);
      paramCount++;
    }

    if (end_date) {
      query += ` AND mr.scheduled_date <= $${paramCount}`;
      params.push(end_date);
      paramCount++;
    }

    query += ` ORDER BY mr.scheduled_date`;

    const result = await db.query(query, params);
    res.json({ events: result.rows });
  } catch (error) {
    console.error('Get calendar requests error:', error);
    res.status(500).json({ error: 'Failed to fetch calendar requests' });
  }
};

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // Total requests by status
    const statusStats = await db.query(`
      SELECT status, COUNT(*) as count
      FROM maintenance_requests
      GROUP BY status
    `);

    // Requests by type
    const typeStats = await db.query(`
      SELECT request_type, COUNT(*) as count
      FROM maintenance_requests
      GROUP BY request_type
    `);

    // Requests by team
    const teamStats = await db.query(`
      SELECT mt.name, mt.color, COUNT(mr.id) as count
      FROM maintenance_teams mt
      LEFT JOIN maintenance_requests mr ON mt.id = mr.maintenance_team_id
      GROUP BY mt.id, mt.name, mt.color
      ORDER BY count DESC
    `);

    // Equipment by status
    const equipmentStats = await db.query(`
      SELECT status, COUNT(*) as count
      FROM equipment
      GROUP BY status
    `);

    // Recent activity
    const recentActivity = await db.query(`
      SELECT mr.id, mr.subject, mr.status, mr.created_at,
        e.name as equipment_name,
        u.full_name as created_by_name
      FROM maintenance_requests mr
      JOIN equipment e ON mr.equipment_id = e.id
      LEFT JOIN users u ON mr.created_by = u.id
      ORDER BY mr.created_at DESC
      LIMIT 10
    `);

    res.json({
      status_stats: statusStats.rows,
      type_stats: typeStats.rows,
      team_stats: teamStats.rows,
      equipment_stats: equipmentStats.rows,
      recent_activity: recentActivity.rows
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
};
