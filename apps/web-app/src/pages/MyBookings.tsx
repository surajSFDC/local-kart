import React from 'react';

const MyBookings: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Bookings</h1>
          <p className="text-gray-600 mb-8">
            This page will show all user bookings and their status.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md">
            <p className="font-medium">Coming Soon!</p>
            <p className="text-sm mt-1">Bookings list will be implemented here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBookings;