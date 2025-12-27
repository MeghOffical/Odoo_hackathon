import { ReactNode, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import {
  LayoutDashboard,
  Package,
  Users,
  ClipboardList,
  Calendar,
  LogOut,
  Menu,
  X,
  Settings,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarMinimized, setSidebarMinimized] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Equipment', href: '/equipment', icon: Package },
    { name: 'Teams', href: '/teams', icon: Users },
    { name: 'Requests', href: '/requests', icon: ClipboardList },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
  ];

  const isActive = (path: string) => router.pathname === path;

  const toggleSidebarSize = () => {
    setSidebarMinimized(!sidebarMinimized);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-r border-gray-200 dark:border-gray-800 shadow-2xl transform transition-all duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${sidebarMinimized ? 'w-20' : 'w-72'}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={`flex items-center gap-3 px-6 py-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-primary-500 to-primary-600 ${sidebarMinimized ? 'justify-center px-2' : ''}`}>
            <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl shadow-lg">
              <Settings className="w-7 h-7 text-white" />
            </div>
            {!sidebarMinimized && (
              <div className="transition-all duration-300 flex-1">
                <h1 className="text-xl font-bold text-white tracking-tight">GearGuard</h1>
                <p className="text-xs text-primary-100">Maintenance System</p>
              </div>
            )}
            
            {/* Collapse Button - Desktop Only */}
            <button
              onClick={toggleSidebarSize}
              className="hidden lg:block p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              title={sidebarMinimized ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {sidebarMinimized ? (
                <ChevronRight className="w-4 h-4 text-white" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-white" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  title={sidebarMinimized ? item.name : ''}
                  className={`group flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                    active
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30 scale-[1.02]'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-[1.01]'
                  } ${sidebarMinimized ? 'justify-center' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400'} ${sidebarMinimized ? 'w-6 h-6' : ''}`} />
                  {!sidebarMinimized && (
                    <>
                      <span className={`font-medium ${active ? 'text-white' : ''}`}>{item.name}</span>
                      {active && (
                        <div className="ml-auto w-2 h-2 rounded-full bg-white shadow-lg"></div>
                      )}
                    </>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className={`transition-all duration-300 ${sidebarMinimized ? 'lg:pl-20' : 'lg:pl-72'}`}>
        {/* Top bar */}
        <div className="sticky top-0 z-30 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {sidebarOpen ? (
                  <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                )}
              </button>
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                  {navigation.find((item) => isActive(item.href))?.name || 'GearGuard'}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
            
            {/* Top Navigation Actions */}
            <div className="flex items-center gap-2 lg:gap-4">
              {/* Search Bar - Hidden on mobile */}
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm text-gray-500 dark:text-gray-400 hover:ring-2 hover:ring-primary-500 transition-all cursor-pointer">
                <Search className="w-4 h-4" />
                <span className="hidden lg:inline">Search...</span>
              </div>
              
              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme}
                className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-amber-500 group-hover:rotate-180 transition-transform duration-500" />
                ) : (
                  <Moon className="w-5 h-5 text-indigo-600 group-hover:-rotate-12 transition-transform duration-500" />
                )}
              </button>
              
              {/* Notifications */}
              <button className="relative p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900"></span>
              </button>
              
              {/* User Avatar - Desktop */}
              <div className="hidden lg:flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow">
                  <span className="text-white font-bold text-sm">
                    {user?.full_name?.charAt(0).toUpperCase() || 'P'}
                  </span>
                </div>
                <div className="hidden xl:block">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {user?.full_name || 'Preview Mode'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role || 'Guest'}</p>
                </div>
              </div>

              {/* Logout Button */}
              <button 
                onClick={handleLogout}
                className="p-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
                title="Logout"
              >
                <LogOut className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors" />
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8 animate-fade-in">{children}</main>
      </div>
    </div>
  );
}
