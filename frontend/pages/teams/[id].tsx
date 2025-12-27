import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store/authStore';
import { useQuery } from '@tanstack/react-query';
import { teamsAPI } from '@/lib/api';
import Layout from '@/components/Layout';
import { Users, User, Plus } from 'lucide-react';

export default function TeamDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const { data, isLoading } = useQuery({
    queryKey: ['team', id],
    queryFn: async () => {
      const response = await teamsAPI.getById(Number(id));
      return response.data;
    },
    enabled: isAuthenticated && !!id,
  });

  if (!isAuthenticated || !id) return null;

  const team = data?.team;
  const members = data?.members || [];

  return (
    <Layout>
      <div className="space-y-6">
        {isLoading ? (
          <div className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ) : (
          <>
            {/* Team Header */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="h-3" style={{ backgroundColor: team?.color }} />
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{team?.name}</h1>
                    {team?.description && (
                      <p className="text-gray-600">{team.description}</p>
                    )}
                  </div>
                  <div
                    className="w-16 h-16 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${team?.color}20` }}
                  >
                    <Users className="w-8 h-8" style={{ color: team?.color }} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{members.length}</p>
                    <p className="text-sm text-gray-500">Team Members</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {team?.is_active ? 'Active' : 'Inactive'}
                    </p>
                    <p className="text-sm text-gray-500">Status</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold" style={{ color: team?.color }}>
                      {team?.color}
                    </p>
                    <p className="text-sm text-gray-500">Team Color</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Members */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
                <button
                  onClick={() => router.push(`/teams/${id}/add-member`)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Member
                </button>
              </div>

              {members.length === 0 ? (
                <div className="p-12 text-center">
                  <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No team members yet</p>
                  <button
                    onClick={() => router.push(`/teams/${id}/add-member`)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    <Plus className="w-4 h-4" />
                    Add First Member
                  </button>
                </div>
              ) : (
                <div className="divide-y">
                  {members.map((member: any) => (
                    <div key={member.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                          {member.avatar_url ? (
                            <img
                              src={member.avatar_url}
                              alt={member.full_name}
                              className="w-12 h-12 rounded-full"
                            />
                          ) : (
                            <span className="text-lg text-primary-700 font-medium">
                              {member.full_name?.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{member.full_name}</h3>
                          <p className="text-sm text-gray-600">{member.email}</p>
                        </div>
                        <div className="text-right">
                          <span
                            className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: `${team?.color}20`,
                              color: team?.color,
                            }}
                          >
                            {member.role}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            Joined {new Date(member.joined_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
