import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store/authStore';
import { useQuery } from '@tanstack/react-query';
import { requestsAPI } from '@/lib/api';
import Layout from '@/components/Layout';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Wrench,
  TrendingUp,
  Activity,
} from 'lucide-react';
import type { DashboardStats } from '@/types';

export default function Dashboard() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  // TEMPORARY: Auth disabled for preview
  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.push('/login');
  //   }
  // }, [isAuthenticated, router]);

  const { data: stats, isLoading } = useQuery<{ data: DashboardStats }>({
    queryKey: ['dashboard-stats'],
    queryFn: requestsAPI.getDashboardStats,
    enabled: false, // Disabled for preview
  });

  // TEMPORARY: Mock data for preview
  const mockStats: any = {
    status_stats: [
      { status: 'new', count: 12 },
      { status: 'in_progress', count: 8 },
      { status: 'repaired', count: 45 },
      { status: 'scrap', count: 3 }
    ],
    request_type_stats: [
      { request_type: 'corrective', count: 35 },
      { request_type: 'preventive', count: 33 }
    ],
    team_performance: [
      { team_name: 'Mechanical Team', total_requests: 28, completed_requests: 24 },
      { team_name: 'Electrical Team', total_requests: 22, completed_requests: 18 },
      { team_name: 'IT Support', total_requests: 18, completed_requests: 15 }
    ],
    recent_activity: [
      { id: 1, equipment_name: 'CNC Machine #1', status: 'repaired', created_at: '2025-12-26T10:30:00' },
      { id: 2, equipment_name: 'Forklift A-203', status: 'in_progress', created_at: '2025-12-26T09:15:00' },
      { id: 3, equipment_name: 'Printer HP-502', status: 'new', created_at: '2025-12-26T08:45:00' },
      { id: 4, equipment_name: 'HVAC Unit B', status: 'repaired', created_at: '2025-12-25T16:20:00' }
    ]
  };

  const dashboardStats = stats?.data || mockStats; // Use mock data for preview

  const getStatusCount = (status: string) => {
    return dashboardStats?.status_stats?.find((s) => s.status === status)?.count || '0';
  };

  const statsCards = [
    {
      title: 'New Requests',
      value: getStatusCount('new'),
      icon: AlertCircle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'In Progress',
      value: getStatusCount('in_progress'),
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Repaired',
      value: getStatusCount('repaired'),
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Scrapped',
      value: getStatusCount('scrap'),
      icon: Wrench,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">
            Welcome back, {user?.full_name}!
          </h1>
          <p className="text-primary-100">
            Here's an overview of your maintenance operations
          </p>
        </div>

        {/* Stats Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="h-12 w-12 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.title} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                  <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg w-fit mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Request Types & Teams */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Request Types */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary-600" />
              Request Types
            </h3>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-10 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {dashboardStats?.type_stats?.map((type) => (
                  <div key={type.request_type} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">
                      {type.request_type}
                    </span>
                    <span className="text-lg font-semibold text-gray-900">{type.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Teams Performance */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-600" />
              Team Performance
            </h3>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-10 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {dashboardStats?.team_stats?.slice(0, 5).map((team) => (
                  <div key={team.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: team.color }}
                      />
                      <span className="text-sm text-gray-600">{team.name}</span>
                    </div>
                    <span className="text-lg font-semibold text-gray-900">{team.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="divide-y">
              {dashboardStats?.recent_activity?.slice(0, 10).map((activity) => (
                <div key={activity.id} className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.subject}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.equipment_name} • Created by {activity.created_by_name}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        activity.status === 'new'
                          ? 'bg-yellow-100 text-yellow-800'
                          : activity.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-800'
                          : activity.status === 'repaired'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {activity.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
