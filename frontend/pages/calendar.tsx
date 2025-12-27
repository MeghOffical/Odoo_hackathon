import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store/authStore';
import { useQuery } from '@tanstack/react-query';
import { requestsAPI } from '@/lib/api';
import Layout from '@/components/Layout';
import { Calendar as CalendarIcon, Clock, Wrench } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import type { MaintenanceRequest } from '@/types';

export default function CalendarPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // TEMPORARY: Auth disabled for preview
  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.push('/login');
  //   }
  // }, [isAuthenticated, router]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  const { data: eventsData, isLoading } = useQuery({
    queryKey: ['calendar-events', format(monthStart, 'yyyy-MM-dd'), format(monthEnd, 'yyyy-MM-dd')],
    queryFn: async () => {
      const response = await requestsAPI.getCalendar({
        start_date: format(monthStart, 'yyyy-MM-dd'),
        end_date: format(monthEnd, 'yyyy-MM-dd'),
      });
      return response.data;
    },
    enabled: false, // Disabled for preview
  });

  // TEMPORARY: Mock data for preview
  const mockEvents: any[] = [
    {
      id: 1,
      equipment_name: 'CNC Machine #1',
      request_type: 'preventive',
      priority: 'medium',
      status: 'new',
      scheduled_date: '2025-12-28',
      created_at: '2025-12-27T09:00:00',
      team_name: 'Mechanical Team',
      team_color: '#ef4444'
    },
    {
      id: 2,
      equipment_name: 'HVAC Unit B',
      request_type: 'preventive',
      priority: 'high',
      status: 'in_progress',
      scheduled_date: '2025-12-28',
      created_at: '2025-12-25T10:00:00',
      team_name: 'Electrical Team',
      team_color: '#f97316'
    },
    {
      id: 3,
      equipment_name: 'Generator Main',
      request_type: 'preventive',
      priority: 'high',
      status: 'new',
      scheduled_date: '2025-12-30',
      created_at: '2025-12-26T14:00:00',
      team_name: 'Electrical Team',
      team_color: '#f97316'
    },
    {
      id: 4,
      equipment_name: 'Forklift A-203',
      request_type: 'preventive',
      priority: 'medium',
      status: 'new',
      scheduled_date: '2026-01-02',
      created_at: '2025-12-27T08:00:00',
      team_name: 'Mechanical Team',
      team_color: '#ef4444'
    }
  ];

  const events: MaintenanceRequest[] = eventsData?.events || mockEvents; // Use mock data for preview

  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = monthStart.getDay();

  const getEventsForDay = (date: Date) => {
    return events.filter((event) =>
      event.scheduled_date && isSameDay(new Date(event.scheduled_date), date)
    );
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const selectedDayEvents = selectedDate ? getEventsForDay(selectedDate) : [];

  // TEMPORARY: Removed for preview mode
  // if (!isAuthenticated) return null;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Preventive Maintenance Calendar</h1>
            <p className="text-gray-600 mt-1">Schedule and track preventive maintenance tasks</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={previousMonth}
                  className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  ←
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Today
                </button>
                <button
                  onClick={nextMonth}
                  className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  →
                </button>
              </div>
            </div>

            {/* Day Names */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: startDayOfWeek }).map((_, index) => (
                <div key={`empty-${index}`} className="aspect-square" />
              ))}

              {/* Days of month */}
              {daysInMonth.map((day) => {
                const dayEvents = getEventsForDay(day);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const isTodayDate = isToday(day);

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={`aspect-square p-2 border rounded-lg hover:bg-gray-50 transition-colors ${
                      isSelected
                        ? 'bg-primary-100 border-primary-500'
                        : isTodayDate
                        ? 'bg-blue-50 border-blue-300'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="text-sm font-medium mb-1">{format(day, 'd')}</div>
                    {dayEvents.length > 0 && (
                      <div className="flex flex-col gap-1">
                        {dayEvents.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className="text-xs px-1 py-0.5 rounded truncate"
                            style={{
                              backgroundColor: event.team_color || '#3b82f6',
                              color: 'white',
                            }}
                          >
                            {event.equipment_name}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Event Details Sidebar */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-primary-600" />
              {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
            </h3>

            {selectedDate ? (
              <div className="space-y-3">
                {selectedDayEvents.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8">
                    No scheduled maintenance for this day
                  </p>
                ) : (
                  selectedDayEvents.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => router.push(`/requests/${event.id}`)}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div
                        className="w-full h-1 rounded-full mb-3"
                        style={{ backgroundColor: event.team_color || '#3b82f6' }}
                      />
                      <h4 className="font-medium text-gray-900 mb-2">{event.subject}</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Wrench className="w-4 h-4" />
                          <span>{event.equipment_name}</span>
                        </div>
                        {event.technician_name && (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-primary-100 flex items-center justify-center">
                              <span className="text-xs text-primary-700">
                                {event.technician_name.charAt(0)}
                              </span>
                            </div>
                            <span>{event.technician_name}</span>
                          </div>
                        )}
                        {event.duration_hours && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{event.duration_hours} hours</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-3 pt-3 border-t">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            event.status === 'new'
                              ? 'bg-yellow-100 text-yellow-800'
                              : event.status === 'in_progress'
                              ? 'bg-blue-100 text-blue-800'
                              : event.status === 'repaired'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {event.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">
                Click on a date to see scheduled maintenance
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
