import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store/authStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { requestsAPI, equipmentAPI, teamsAPI } from '@/lib/api';
import Layout from '@/components/Layout';
import toast from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';

export default function NewRequestPage() {
  const router = useRouter();
  const { equipment_id } = router.query;
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    equipment_id: equipment_id || '',
    request_type: 'corrective',
    priority: 'medium',
    scheduled_date: '',
    maintenance_team_id: '',
    assigned_technician_id: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Update equipment_id when query param changes
  useEffect(() => {
    if (equipment_id) {
      setFormData((prev) => ({ ...prev, equipment_id: equipment_id as string }));
    }
  }, [equipment_id]);

  // Fetch equipment list
  const { data: equipmentData } = useQuery({
    queryKey: ['equipment'],
    queryFn: async () => {
      const response = await equipmentAPI.getAll();
      return response.data;
    },
    enabled: isAuthenticated,
  });

  // Fetch teams
  const { data: teamsData } = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const response = await teamsAPI.getAll();
      return response.data;
    },
    enabled: isAuthenticated,
  });

  // Fetch technicians for selected team
  const { data: techniciansData } = useQuery({
    queryKey: ['technicians', formData.maintenance_team_id],
    queryFn: async () => {
      const response = await teamsAPI.getTechnicians(Number(formData.maintenance_team_id));
      return response.data;
    },
    enabled: !!formData.maintenance_team_id,
  });

  // Auto-populate team and technician when equipment is selected
  useEffect(() => {
    if (formData.equipment_id && equipmentData) {
      const selectedEquipment = equipmentData.equipment.find(
        (e: any) => e.id === Number(formData.equipment_id)
      );
      if (selectedEquipment) {
        setFormData((prev) => ({
          ...prev,
          maintenance_team_id: selectedEquipment.maintenance_team_id || '',
          assigned_technician_id: selectedEquipment.default_technician_id || '',
        }));
      }
    }
  }, [formData.equipment_id, equipmentData]);

  const createMutation = useMutation({
    mutationFn: (data: any) => requestsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      toast.success('Maintenance request created successfully');
      router.push('/requests');
    },
    onError: () => {
      toast.error('Failed to create maintenance request');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.subject) {
      toast.error('Subject is required');
      return;
    }
    if (!formData.equipment_id) {
      toast.error('Equipment is required');
      return;
    }

    // Clean up empty fields
    const cleanData = Object.entries(formData).reduce((acc, [key, value]) => {
      if (value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {} as any);

    createMutation.mutate(cleanData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!isAuthenticated) return null;

  const equipment = equipmentData?.equipment || [];
  const teams = teamsData?.teams || [];
  const technicians = techniciansData?.technicians || [];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Maintenance Request</h1>
            <p className="text-gray-600 mt-1">Report an issue or schedule preventive maintenance</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Request Details */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Request Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Brief description of the issue or task"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Detailed description of the issue, symptoms, or maintenance task..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Request Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="request_type"
                    value={formData.request_type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  >
                    <option value="corrective">Corrective (Breakdown)</option>
                    <option value="preventive">Preventive (Scheduled)</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.request_type === 'corrective'
                      ? 'For unexpected breakdowns or repairs'
                      : 'For planned maintenance and checkups'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              {formData.request_type === 'preventive' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Scheduled Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="scheduled_date"
                    value={formData.scheduled_date}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required={formData.request_type === 'preventive'}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Equipment & Assignment */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Equipment & Assignment</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Equipment <span className="text-red-500">*</span>
                </label>
                <select
                  name="equipment_id"
                  value={formData.equipment_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="">Select equipment</option>
                  {equipment.map((item: any) => (
                    <option key={item.id} value={item.id}>
                      {item.name} {item.serial_number ? `(${item.serial_number})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maintenance Team
                  </label>
                  <select
                    name="maintenance_team_id"
                    value={formData.maintenance_team_id}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Auto (from equipment)</option>
                    {teams.map((team: any) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Defaults to equipment's assigned team
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assign Technician
                  </label>
                  <select
                    name="assigned_technician_id"
                    value={formData.assigned_technician_id}
                    onChange={handleChange}
                    disabled={!formData.maintenance_team_id}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
                  >
                    <option value="">Auto (from equipment)</option>
                    {technicians.map((tech: any) => (
                      <option key={tech.id} value={tech.id}>
                        {tech.full_name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {!formData.maintenance_team_id
                      ? 'Select a team to choose technician'
                      : 'Defaults to equipment's default technician'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {createMutation.isPending ? 'Creating...' : 'Create Request'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
