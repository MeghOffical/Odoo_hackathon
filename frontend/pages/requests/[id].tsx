import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store/authStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { requestsAPI } from '@/lib/api';
import Layout from '@/components/Layout';
import toast from 'react-hot-toast';
import {
  Calendar,
  Clock,
  User,
  Package,
  MapPin,
  MessageSquare,
  Send,
} from 'lucide-react';

export default function RequestDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { isAuthenticated, user } = useAuthStore();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('');
  const [durationHours, setDurationHours] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const { data, isLoading } = useQuery({
    queryKey: ['request', id],
    queryFn: async () => {
      const response = await requestsAPI.getById(Number(id));
      return response.data;
    },
    enabled: isAuthenticated && !!id,
  });

  const updateMutation = useMutation({
    mutationFn: ({ status, duration }: any) =>
      requestsAPI.update(Number(id), {
        status,
        ...(duration && { duration_hours: parseFloat(duration) }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['request', id] });
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      toast.success('Request updated successfully');
    },
    onError: () => {
      toast.error('Failed to update request');
    },
  });

  const commentMutation = useMutation({
    mutationFn: (text: string) => requestsAPI.addComment(Number(id), text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['request', id] });
      setComment('');
      toast.success('Comment added');
    },
    onError: () => {
      toast.error('Failed to add comment');
    },
  });

  const handleStatusUpdate = () => {
    if (status) {
      updateMutation.mutate({ status, duration: durationHours });
      setStatus('');
      setDurationHours('');
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      commentMutation.mutate(comment);
    }
  };

  if (!isAuthenticated || !id) return null;

  const request = data?.request;
  const statusHistory = data?.status_history || [];
  const comments = data?.comments || [];

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
            {/* Request Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{request?.subject}</h1>
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        request?.request_type === 'preventive'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {request?.request_type}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        request?.priority === 'critical'
                          ? 'bg-red-100 text-red-800'
                          : request?.priority === 'high'
                          ? 'bg-orange-100 text-orange-800'
                          : request?.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {request?.priority} priority
                    </span>
                  </div>
                </div>
                <span
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    request?.status === 'new'
                      ? 'bg-yellow-100 text-yellow-800'
                      : request?.status === 'in_progress'
                      ? 'bg-blue-100 text-blue-800'
                      : request?.status === 'repaired'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {request?.status?.replace('_', ' ')}
                </span>
              </div>

              {request?.description && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">{request.description}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Equipment</p>
                    <p className="font-medium text-gray-900">{request?.equipment_name}</p>
                    {request?.serial_number && (
                      <p className="text-sm text-gray-600">SN: {request.serial_number}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium text-gray-900">{request?.location || 'N/A'}</p>
                    {request?.department && (
                      <p className="text-sm text-gray-600">{request.department}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Assigned Technician</p>
                    <p className="font-medium text-gray-900">{request?.technician_name || 'Unassigned'}</p>
                    {request?.team_name && (
                      <p className="text-sm text-gray-600">{request.team_name}</p>
                    )}
                  </div>
                </div>

                {request?.scheduled_date && (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Scheduled Date</p>
                      <p className="font-medium text-gray-900">
                        {new Date(request.scheduled_date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {request?.duration_hours && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-medium text-gray-900">{request.duration_hours} hours</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Update Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select new status</option>
                  <option value="new">New</option>
                  <option value="in_progress">In Progress</option>
                  <option value="repaired">Repaired</option>
                  <option value="scrap">Scrap</option>
                </select>
                <input
                  type="number"
                  step="0.5"
                  placeholder="Duration (hours)"
                  value={durationHours}
                  onChange={(e) => setDurationHours(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  onClick={handleStatusUpdate}
                  disabled={!status || updateMutation.isPending}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {updateMutation.isPending ? 'Updating...' : 'Update'}
                </button>
              </div>
            </div>

            {/* Comments */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Comments
                </h2>
              </div>
              <div className="p-6 space-y-4">
                {comments.map((c: any) => (
                  <div key={c.id} className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-700 font-medium">
                        {c.user_name?.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">{c.user_name}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(c.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{c.comment}</p>
                    </div>
                  </div>
                ))}

                <form onSubmit={handleCommentSubmit} className="flex gap-3 pt-4 border-t">
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    type="submit"
                    disabled={!comment.trim() || commentMutation.isPending}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    Send
                  </button>
                </form>
              </div>
            </div>

            {/* Status History */}
            {statusHistory.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Status History</h2>
                <div className="space-y-3">
                  {statusHistory.map((history: any) => (
                    <div key={history.id} className="flex items-start gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-primary-600 mt-2"></div>
                      <div>
                        <p className="text-gray-900">
                          Changed to <span className="font-medium">{history.new_status}</span>
                        </p>
                        <p className="text-gray-600">
                          by {history.changed_by_name} • {new Date(history.changed_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
