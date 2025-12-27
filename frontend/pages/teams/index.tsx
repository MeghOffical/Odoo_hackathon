import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store/authStore';
import { useQuery } from '@tanstack/react-query';
import { teamsAPI } from '@/lib/api';
import Layout from '@/components/Layout';
import { Users, Plus, User } from 'lucide-react';
import type { MaintenanceTeam } from '@/types';

export default function TeamsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  // TEMPORARY: Auth disabled for preview
  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.push('/login');
  //   }
  // }, [isAuthenticated, router]);

  const { data: teamsData, isLoading } = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const response = await teamsAPI.getAll();
      return response.data;
    },
    enabled: false, // Disabled for preview
  });

  // TEMPORARY: Mock data for preview
  const mockTeams: any[] = [
    {
      id: 1,
      name: 'Mechanical Team',
      description: 'Handles all mechanical equipment maintenance',
      color: '#ef4444',
      member_count: 5,
      equipment_count: 12
    },
    {
      id: 2,
      name: 'Electrical Team',
      description: 'Responsible for electrical systems and equipment',
      color: '#f97316',
      member_count: 4,
      equipment_count: 8
    },
    {
      id: 3,
      name: 'IT Support',
      description: 'Maintains computers, printers, and IT infrastructure',
      color: '#3b82f6',
      member_count: 3,
      equipment_count: 15
    }
  ];

  const teams: MaintenanceTeam[] = teamsData?.teams || mockTeams; // Use mock data for preview

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Maintenance Teams</h1>
            <p className="text-gray-600 mt-1">Manage teams and technicians</p>
          </div>
          <button
            onClick={() => router.push('/teams/new')}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Team
          </button>
        </div>

        {/* Teams Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : teams.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No teams found</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first team</p>
            <button
              onClick={() => router.push('/teams/new')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <Plus className="w-5 h-5" />
              Add Team
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <div
                key={team.id}
                onClick={() => router.push(`/teams/${team.id}`)}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
              >
                <div
                  className="h-2"
                  style={{ backgroundColor: team.color }}
                />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${team.color}20` }}
                    >
                      <Users className="w-5 h-5" style={{ color: team.color }} />
                    </div>
                  </div>

                  {team.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {team.description}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {team.member_count || 0}
                      </p>
                      <p className="text-xs text-gray-500">Members</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {team.equipment_count || 0}
                      </p>
                      <p className="text-xs text-gray-500">Equipment</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
