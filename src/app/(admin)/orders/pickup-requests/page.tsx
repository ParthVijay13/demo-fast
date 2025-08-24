"use client";
import React, { useState, useEffect } from 'react';
import {
  Search, Filter, Calendar, MapPin, Plus, Bell, User, AlertCircle,
  Clock, CheckCircle, X, ChevronDown, RefreshCw, Package
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/app/redux/store';
import {
  fetchPickupRequests,
  setSearch,
  setStatus,
  setDateRange,
  setPickupLocation,
  setPage,
  setPageSize,
  selectPickupState
} from '@/app/redux/slices/pickupSlice';

interface PickupRequest {
  id: string;
  requestedOn: string;
  status: 'scheduled' | 'not-picked' | 'picked';
  pickupLocation: string;
  pickedExpectedAwbs: string;
  pickupDate: string;
  lastUpdate: string;
}

const PickupRequestsPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items: pickupRequests, loading, error, pagination, filters } = useAppSelector(selectPickupState);

  // Load pickup requests on component mount
  useEffect(() => {
    dispatch(fetchPickupRequests());
  }, [dispatch, pagination.page, pagination.pageSize]);

  const handleSearch = (searchTerm: string) => {
    dispatch(setSearch(searchTerm));
  };

  const handleStatusChange = (status: string) => {
    dispatch(setStatus(status));
  };

  const handleDateRangeChange = (dateRange: string) => {
    dispatch(setDateRange(dateRange));
  };

  const handlePickupLocationChange = (location: string) => {
    dispatch(setPickupLocation(location));
  };

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
  };

  const handlePageSizeChange = (pageSize: number) => {
    dispatch(setPageSize(pageSize));
  };

  const handleRefresh = () => {
    dispatch(fetchPickupRequests());
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Clock className="w-4 h-4 text-orange-500" />;
      case 'not-picked':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'picked':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Scheduled';
      case 'not-picked':
        return 'Not picked';
      case 'picked':
        return 'Picked';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-orange-100 text-orange-800';
      case 'not-picked':
        return 'bg-red-100 text-red-800';
      case 'picked':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-semibold text-gray-900">Pickup Requests</h1>
            <button className="text-sm text-blue-600 hover:text-blue-800">Learn More</button>
          </div>
          <div className="flex items-center space-x-3">
            {/* Create Pickup Request Button */}
            <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 flex items-center space-x-2" onClick={() => router.push('/orders/pickup-requests/create')}>
              <Plus className="w-4 h-4" />
              <span>Create Pickup Request</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-4 flex-wrap">
          {/* Search pickup ID */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search pickup ID"
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          {/* Pickup Date */}
          <div className="relative">
            <input
              type="text"
              value={filters.dateRange}
              onChange={(e) => handleDateRangeChange(e.target.value)}
              className="w-64 pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              placeholder="Pickup Date"
            />
            <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>

          {/* Status */}
          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="appearance-none w-40 pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="">Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="not-picked">Not Picked</option>
              <option value="picked">Picked</option>
            </select>
            <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>

          {/* Pickup Location */}
          <div className="relative">
            <select
              value={filters.pickupLocation}
              onChange={(e) => handlePickupLocationChange(e.target.value)}
              className="appearance-none w-52 pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="">Pickup Location</option>
              <option value="location1">Location 1</option>
              <option value="location2">Location 2</option>
            </select>
            <MapPin className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Pickup Requests Table */}
      <div className="bg-white mx-6 mt-4 rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pickup ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requested On
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pickup Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Picked / Expected AWBs
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pickup Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Update
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-12">
                    <div className="inline-flex items-center text-gray-600">
                      <RefreshCw className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" />
                      Loading pickup requests...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={9} className="text-center py-12">
                    <div className="text-red-600">
                      <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                      {error}
                    </div>
                  </td>
                </tr>
              ) : pickupRequests.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12">
                    <div className="text-gray-500">
                      <Package className="w-8 h-8 mx-auto mb-2" />
                      No pickup requests found
                    </div>
                  </td>
                </tr>
              ) : (
                pickupRequests.map((request: any) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
                      {request.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(request.created_at).toLocaleDateString('en-GB', { 
                        day: '2-digit', 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor('scheduled')}`}>
                      {getStatusIcon('scheduled')}
                      <span>{getStatusLabel('scheduled')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {request.pickup_address?.warehouse_name || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">0/0</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(request.pickup_date).toLocaleDateString('en-GB', { 
                        day: '2-digit', 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(request.updated_at).toLocaleDateString('en-GB', { 
                        day: '2-digit', 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 text-sm">
                        Raise Issue
                      </button>
                      <button className="text-red-600 hover:text-red-900 text-sm">
                        <X className="w-4 h-4" />
                        Cancel Pickup
                      </button>
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-white px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex items-center space-x-2 text-sm text-gray-700">
            <span>Showing</span>
            <span className="font-medium">
              {pickupRequests.length > 0 ? `${(pagination.page - 1) * pagination.pageSize + 1} - ${Math.min(pagination.page * pagination.pageSize, pagination.total)}` : '0 - 0'}
            </span>
            <span>of</span>
            <span className="font-medium">{pagination.total}</span>
            <span>|</span>
            <span>Show</span>
            <select 
              className="border border-gray-300 rounded px-2 py-1"
              value={pagination.pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            >
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>per page</span>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              className={`px-3 py-1 text-sm rounded ${
                pagination.page === 1 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              disabled={pagination.page === 1}
              onClick={() => handlePageChange(pagination.page - 1)}
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm">
              Page {pagination.page} of {Math.ceil(pagination.total / pagination.pageSize)}
            </span>
            <button 
              className={`px-3 py-1 text-sm rounded ${
                pagination.page >= Math.ceil(pagination.total / pagination.pageSize)
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize)}
              onClick={() => handlePageChange(pagination.page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PickupRequestsPage;
