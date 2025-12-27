export interface Equipment {
  id: number;
  name: string;
  serial_number?: string;
  category?: string;
  purchase_date?: string;
  warranty_expiry?: string;
  location?: string;
  building?: string;
  room?: string;
  department?: string;
  assigned_to?: number;
  assigned_to_name?: string;
  maintenance_team_id?: number;
  team_name?: string;
  default_technician_id?: number;
  default_technician_name?: string;
  status: string;
  notes?: string;
  image_url?: string;
  total_requests?: number;
  open_requests?: number;
  created_at: string;
  updated_at: string;
}

export interface MaintenanceTeam {
  id: number;
  name: string;
  description?: string;
  color: string;
  is_active: boolean;
  member_count?: number;
  equipment_count?: number;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: number;
  team_id: number;
  user_id: number;
  role: string;
  username: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  joined_at: string;
}

export interface MaintenanceRequest {
  id: number;
  subject: string;
  description?: string;
  equipment_id: number;
  equipment_name: string;
  serial_number?: string;
  location?: string;
  department?: string;
  maintenance_team_id?: number;
  team_name?: string;
  team_color?: string;
  assigned_technician_id?: number;
  technician_name?: string;
  technician_avatar?: string;
  request_type: 'corrective' | 'preventive';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'in_progress' | 'repaired' | 'scrap';
  scheduled_date?: string;
  completed_date?: string;
  duration_hours?: number;
  created_by?: number;
  created_by_name?: string;
  created_at: string;
  updated_at: string;
}

export interface RequestComment {
  id: number;
  request_id: number;
  user_id: number;
  user_name: string;
  avatar_url?: string;
  comment: string;
  created_at: string;
}

export interface StatusHistory {
  id: number;
  request_id: number;
  old_status?: string;
  new_status: string;
  changed_by?: number;
  changed_by_name?: string;
  notes?: string;
  changed_at: string;
}

export interface DashboardStats {
  status_stats: Array<{ status: string; count: string }>;
  type_stats: Array<{ request_type: string; count: string }>;
  team_stats: Array<{ name: string; color: string; count: string }>;
  equipment_stats: Array<{ status: string; count: string }>;
  recent_activity: MaintenanceRequest[];
}
