import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  MagnifyingGlassIcon, 
  CalendarDaysIcon, 
  UserPlusIcon,
  WrenchScrewdriverIcon,
  BoltIcon,
  SparklesIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const quickActions = [
    {
      name: 'Find Services',
      description: 'Search for local service providers',
      href: '/search',
      icon: MagnifyingGlassIcon,
      color: 'bg-blue-500'
    },
    {
      name: 'My Bookings',
      description: 'View your service bookings',
      href: '/my-bookings',
      icon: CalendarDaysIcon,
      color: 'bg-green-500'
    },
    ...(user?.role === 'customer' ? [{
      name: 'Become a Provider',
      description: 'Start offering your services',
      href: '/provider/register',
      icon: UserPlusIcon,
      color: 'bg-purple-500'
    }] : [])
  ];

  const services = [
    { name: 'Plumbing', icon: WrenchScrewdriverIcon, description: 'Fix leaks, install fixtures' },
    { name: 'Electrical', icon: BoltIcon, description: 'Wiring, repairs, installations' },
    { name: 'Cleaning', icon: SparklesIcon, description: 'Home and office cleaning' },
    { name: 'Home Repair', icon: HomeIcon, description: 'General maintenance' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.profile.firstName}!
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            What would you like to do today?
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                to={action.href}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <div className={`${action.color} p-3 rounded-lg`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{action.name}</h3>
                    <p className="text-sm text-gray-500">{action.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Services Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Popular Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <Link
                key={service.name}
                to={`/search?category=${service.name.toLowerCase()}`}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow text-center"
              >
                <service.icon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{service.name}</h3>
                <p className="text-sm text-gray-500">{service.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="text-center py-8">
            <CalendarDaysIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No recent activity</p>
            <p className="text-sm text-gray-400 mt-2">
              Your bookings and service requests will appear here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;