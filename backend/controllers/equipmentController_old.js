const db = require('../config/database');

// Get all equipment
exports.getAllEquipment = async (req, res) => {
  try {
    const { status, department, team_id } = req.query;
    
    let query = `
      SELECT e.*, 
        u.full_name as assigned_to_name,
        mt.name as team_name,
        tech.full_name as default_technician_name,
        COUNT(mr.id) as total_requests,
        COUNT(CASE WHEN mr.status IN ('new', 'in_progress') THEN 1 END) as open_requests
      FROM equipment e
      LEFT JOIN users u ON e.assigned_to = u.id
      LEFT JOIN maintenance_teams mt ON e.maintenance_team_id = mt.id
      LEFT JOIN users tech ON e.default_technician_id = tech.id
      LEFT JOIN maintenance_requests mr ON e.id = mr.equipment_id
      WHERE 1=1
    `;
    
    const params = [];
    let paramCount = 1;

    if (status) {
      query += ` AND e.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (department) {
      query += ` AND e.department = $${paramCount}`;
      params.push(department);
      paramCount++;
    }

    if (team_id) {
      query += ` AND e.maintenance_team_id = $${paramCount}`;
      params.push(team_id);
      paramCount++;
    }

    query += ` GROUP BY e.id, u.full_name, mt.name, tech.full_name ORDER BY e.created_at DESC`;

    const result = await db.query(query, params);
    res.json({ equipment: result.rows });
  } catch (error) {
    console.error('Get equipment error:', error);
    res.status(500).json({ error: 'Failed to fetch equipment' });
  }
};

// Get single equipment with maintenance history
exports.getEquipmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const equipmentResult = await db.query(
      `SELECT e.*, 
        u.full_name as assigned_to_name,
        mt.name as team_name,
        tech.full_name as default_technician_name
       FROM equipment e
       LEFT JOIN users u ON e.assigned_to = u.id
       LEFT JOIN maintenance_teams mt ON e.maintenance_team_id = mt.id
       LEFT JOIN users tech ON e.default_technician_id = tech.id
       WHERE e.id = $1`,
      [id]
    );

    if (equipmentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    // Get maintenance history
    const historyResult = await db.query(
      `SELECT mr.*,
        u.full_name as technician_name,
        mt.name as team_name
       FROM maintenance_requests mr
       LEFT JOIN users u ON mr.assigned_technician_id = u.id
       LEFT JOIN maintenance_teams mt ON mr.maintenance_team_id = mt.id
       WHERE mr.equipment_id = $1
       ORDER BY mr.created_at DESC`,
      [id]
    );

    res.json({
      equipment: equipmentResult.rows[0],
      maintenance_history: historyResult.rows
    });
  } catch (error) {
    console.error('Get equipment by ID error:', error);
    res.status(500).json({ error: 'Failed to fetch equipment' });
  }
};

// Create equipment
exports.createEquipment = async (req, res) => {
  try {
    const {
      name, serial_number, category, purchase_date, warranty_expiry,
      location, building, room, department, assigned_to,
      maintenance_team_id, default_technician_id, notes, image_url
    } = req.body;

    const result = await db.query(
      `INSERT INTO equipment (
        name, serial_number, category, purchase_date, warranty_expiry,
        location, building, room, department, assigned_to,
        maintenance_team_id, default_technician_id, notes, image_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`,
      [name, serial_number, category, purchase_date, warranty_expiry,
       location, building, room, department, assigned_to,
       maintenance_team_id, default_technician_id, notes, image_url]
    );

    res.status(201).json({
      message: 'Equipment created successfully',
      equipment: result.rows[0]
    });
  } catch (error) {
    console.error('Create equipment error:', error);
    res.status(500).json({ error: 'Failed to create equipment' });
  }
};

// Update equipment
exports.updateEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const fields = Object.keys(updates);
    const values = Object.values(updates);
    
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    values.push(id);

    const result = await db.query(
      `UPDATE equipment SET ${setClause}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${values.length}
       RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    res.json({
      message: 'Equipment updated successfully',
      equipment: result.rows[0]
    });
  } catch (error) {
    console.error('Update equipment error:', error);
    res.status(500).json({ error: 'Failed to update equipment' });
  }
};

// Delete equipment
exports.deleteEquipment = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query('DELETE FROM equipment WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    res.json({ message: 'Equipment deleted successfully' });
  } catch (error) {
    console.error('Delete equipment error:', error);
    res.status(500).json({ error: 'Failed to delete equipment' });
  }
};
