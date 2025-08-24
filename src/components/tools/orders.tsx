"use client"
import React, { useState, useCallback } from 'react';
import {
  Search, Filter, Package, Truck, CheckCircle, Clock, AlertCircle,
  MessageCircle, Download, MoreHorizontal, Menu, X, ChevronDown,
  ChevronsLeft, ChevronsRight
} from 'lucide-react';
import type { Order, OrderStatus } from '@/types/orders';
import { useAppDispatch, useAppSelector } from '@/app/redux/store';
import { selectOrdersState, fetchOrders, setSearch as setSearchAction, setStatus as setStatusAction, setPage as setPageAction, generateAwb as generateAwbThunk } from '@/app/redux/slices/ordersSlice';
import { useEffect } from 'react';

// Data for dropdown filters (static for now, can be sourced via API later)

const pickupLocations = ["Jaipur-MaheshNagar-302015", "Bangalore-Koramangala-560034", "Mumbai-Bandra-400050"];
const transportModes = ["Surface", "Air"];
const zones = ["Zone A", "Zone B", "Zone C", "Zone D", "Zone E"];


// --- HELPER FUNCTION ---
const getStatusDetails = (status: OrderStatus | string) => {
  switch (status) {
    case 'pending': return { icon: <Clock className="w-4 h-4 text-yellow-600" />, color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Pending' };
    case 'ready-to-ship': return { icon: <Package className="w-4 h-4 text-blue-600" />, color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Ready To Ship' };
    case 'in-transit': return { icon: <Truck className="w-4 h-4 text-orange-600" />, color: 'bg-orange-100 text-orange-800 border-orange-200', label: 'In Transit' };
    case 'delivered': return { icon: <CheckCircle className="w-4 h-4 text-green-600" />, color: 'bg-green-100 text-green-800 border-green-200', label: 'Delivered' };
    case 'out-for-delivery': return { icon: <Truck className="w-4 h-4 text-cyan-600" />, color: 'bg-cyan-100 text-cyan-800 border-cyan-200', label: 'Out for Delivery' };
    case 'ndr': return { icon: <AlertCircle className="w-4 h-4 text-red-600" />, color: 'bg-red-100 text-red-800 border-red-200', label: 'NDR' };
    case 'rto-in-transit': return { icon: <Truck className="w-4 h-4 text-purple-600" />, color: 'bg-purple-100 text-purple-800 border-purple-200', label: 'RTO In-Transit' };
    case 'rto-delivered': return { icon: <CheckCircle className="w-4 h-4 text-indigo-600" />, color: 'bg-indigo-100 text-indigo-800 border-indigo-200', label: 'RTO Delivered' };
    default: return { icon: <Package className="w-4 h-4 text-gray-600" />, color: 'bg-gray-100 text-gray-800 border-gray-200', label: 'All Shipments' };
  }
};

// --- CHILD COMPONENTS ---

const Header: React.FC<{ setSidebarOpen: (open: boolean) => void }> = ({ setSidebarOpen }) => (
  <header className="bg-white shadow-sm border-b sticky top-0 z-20">
    <div className="px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-600 hover:text-gray-900">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Orders</h1>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button className="hidden sm:flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
            <Download className="w-4 h-4 mr-2" />
            Download
          </button>
          <button className="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Create Order
          </button>
        </div>
      </div>
    </div>
  </header>
);

const Sidebar: React.FC<{
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  selectedStatus: OrderStatus | 'all-shipments';
  setSelectedStatus: (status: OrderStatus | 'all-shipments') => void;
  statusCounts: Record<OrderStatus | 'all-shipments', number>;
}> = ({ isOpen, setOpen, selectedStatus, setSelectedStatus, statusCounts }) => {
  const statusItems = [
    { key: 'all-shipments', label: 'All Shipments' },
    { key: 'pending', label: 'Pending' }, { key: 'ready-to-ship', label: 'Ready To Ship' },
    { key: 'in-transit', label: 'In Transit' }, { key: 'out-for-delivery', label: 'Out for Delivery' },
    { key: 'ndr', label: 'NDR' }, { key: 'rto-in-transit', label: 'RTO In Transit' },
    { key: 'rto-delivered', label: 'RTO Delivered' }, { key: 'delivered', label: 'Delivered' },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setOpen(false)}
      />
      <aside className={`fixed top-0 left-0 w-64 bg-white shadow-lg h-[90vh] z-40 transform transition-transform md:relative md:shadow-sm md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4">
          <div className="flex justify-between items-center md:hidden mb-4">
            <h2 className="font-semibold">Filters</h2>
            <button onClick={() => setOpen(false)}><X className="w-5 h-5" /></button>
          </div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 tracking-wider uppercase">ORDER STATUS</h3>
          <div className="space-y-1">
            {statusItems.map((item) => (
              <button key={item.key} onClick={() => {
                setSelectedStatus(item.key as OrderStatus | 'all-shipments');
                if (window.innerWidth < 768) setOpen(false);
              }}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${selectedStatus === item.key ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}>
                <span>{item.label}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${selectedStatus === item.key ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-700'}`}>{statusCounts[item.key as keyof typeof statusCounts] ?? 0}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};

const FilterBar: React.FC<{
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedStatus: OrderStatus | 'all-shipments';
}> = ({ searchQuery, setSearchQuery, selectedStatus }) => (
  <div className="p-4 border-b">
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex-grow min-w-[200px] relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by Order ID, Product, Address..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
      </div>
      <select className="flex-grow sm:flex-grow-0 min-w-[150px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition">
        <option>Pickup Location</option>
        {pickupLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
      </select>
      <select className="flex-grow sm:flex-grow-0 min-w-[150px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition">
        <option>Transport Mode</option>
        {transportModes.map(mode => <option key={mode} value={mode}>{mode}</option>)}
      </select>
      <select className="flex-grow sm:flex-grow-0 min-w-[150px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition">
        <option>Zone</option>
        {zones.map(zone => <option key={zone} value={zone}>{zone}</option>)}
      </select>
      <button className="flex items-center px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
        <Filter className="w-4 h-4 mr-2" />
        More Filters
      </button>
    </div>
    {selectedStatus === 'pending' && (
      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700 text-sm">
        <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
        <span>Please fill missing/invalid order details to generate an AWB Number.
          <button className="ml-2 font-semibold text-red-600 hover:text-red-800 underline">View Incomplete orders</button>
        </span>
      </div>
    )}
  </div>
);

const OrderRow: React.FC<{
  order: Order;
  isSelected: boolean;
  onSelect: (orderId: string) => void;
  onGenerateAwb: (orderId: string) => Promise<void>;
  generating: boolean;
}> = ({ order, isSelected, onSelect, onGenerateAwb, generating }) => {
  const statusDetails = getStatusDetails(order.status);
  return (
    <tr className="hover:bg-gray-50 border-b">
      <td className="px-6 py-4">
        <input type="checkbox" checked={isSelected} onChange={() => onSelect(order.id)} className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500" />
      </td>
      <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center">{statusDetails.icon}<div className="ml-3"><div className="text-sm font-medium text-blue-600 hover:underline cursor-pointer">{order.id}</div><div className="text-xs text-gray-500">{order.date}, Today {order.time}</div></div></div></td>
      <td className="px-6 py-4 max-w-xs"><div className="text-sm text-gray-900 truncate" title={order.pickupAddress}>{order.pickupAddress}</div></td>
      <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-900">{order.productDetails}</div><div className="text-xs text-gray-500">SKU: GENERIC-001</div></td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.weight}</td>
      <td className="px-6 py-4 whitespace-nowrap"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusDetails.color}`}>{statusDetails.label}</span></td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="flex items-center space-x-3">
          {order.awbNumber ? (
            <span className="px-3 py-1.5 text-xs font-semibold text-green-700 border border-green-600 rounded-md bg-green-50">{order.awbNumber}</span>
          ) : (
            <button
              className="px-3 py-1.5 text-xs font-semibold text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors disabled:opacity-50"
              onClick={() => onGenerateAwb(order.id)}
              disabled={generating}
            >
              {generating ? 'Generating…' : 'Get AWB'}
            </button>
          )}
          <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal className="w-5 h-5" /></button>
        </div>
      </td>
    </tr>
  );
};

const Pagination: React.FC<{
  page: number;
  pageSize: number;
  totalCount: number;
  onPrev: () => void;
  onNext: () => void;
}> = ({ page, pageSize, totalCount, onPrev, onNext }) => {
  const start = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalCount);
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  return (
    <div className="px-4 py-3 border-t flex flex-col sm:flex-row items-center justify-between">
      <div className="text-sm text-gray-600 mb-2 sm:mb-0">
        Showing <span className="font-medium">{start}</span> to <span className="font-medium">{end}</span> of <span className="font-medium">{totalCount}</span> results
      </div>
      <div className="flex items-center space-x-1">
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-md disabled:opacity-50" onClick={onPrev} disabled={page <= 1}><ChevronsLeft className="w-4 h-4" /></button>
        <span className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md">{page}</span>
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-md" onClick={onNext} disabled={page >= totalPages}><ChevronsRight className="w-4 h-4" /></button>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
const OrderManagementPortal: React.FC = () => {
  const dispatch = useAppDispatch();
  const ordersState = useAppSelector(selectOrdersState);
  const { items: orders, pagination, statusCounts, loading, error, filters, generatingAwbId } = ordersState;

  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch, filters.search, filters.status, pagination.page, pagination.pageSize]);

  const handleSelectAll = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedOrders(orders.map(o => o.id));
    } else {
      setSelectedOrders([]);
    }
  }, [orders]);

  const handleSelectOrder = useCallback((orderId: string) => {
    setSelectedOrders(prev =>
      prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
    );
  }, []);

  const handleGenerateAwb = useCallback(async (orderId: string) => {
    await dispatch(generateAwbThunk(orderId));
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex">
        <Sidebar
          isOpen={isSidebarOpen}
          setOpen={setSidebarOpen}
          selectedStatus={filters.status}
          setSelectedStatus={(s) => dispatch(setStatusAction(s))}
          statusCounts={statusCounts}
        />
        <div className="flex-1 flex flex-col w-0">
          <Header setSidebarOpen={setSidebarOpen} />

          <main className="flex-1 p-4 sm:p-6">
            <div className="bg-white rounded-lg shadow-sm">
              <FilterBar
                searchQuery={filters.search}
                setSearchQuery={(q) => dispatch(setSearchAction(q))}
                selectedStatus={filters.status}
              />
              {error && (
                <div className="mx-4 my-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input type="checkbox" onChange={handleSelectAll} checked={orders.length > 0 && selectedOrders.length === orders.length} className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500" />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Details</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup Address</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12">
                          <div className="inline-flex items-center text-gray-600">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                            </svg>
                            Loading orders…
                          </div>
                        </td>
                      </tr>
                    ) : orders.length > 0 ? (
                      orders.map((order) => (
                        <OrderRow
                          key={order.id}
                          order={order}
                          isSelected={selectedOrders.includes(order.id)}
                          onSelect={handleSelectOrder}
                          onGenerateAwb={handleGenerateAwb}
                          generating={generatingAwbId === order.id}
                        />
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center py-16">
                          <div className="flex flex-col items-center"><Search className="w-12 h-12 text-gray-300 mb-4" /><h3 className="text-lg font-medium text-gray-700">No Orders Found</h3><p className="text-gray-500 mt-1">No orders match your current filters.</p></div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <Pagination
                page={pagination.page}
                pageSize={pagination.pageSize}
                totalCount={pagination.total}
                onPrev={() => dispatch(setPageAction(Math.max(1, pagination.page - 1)))}
                onNext={() => dispatch(setPageAction(pagination.page + 1))}
              />
            </div>
          </main>
        </div>
      </div>
      <div className="fixed bottom-6 right-6">
        <button className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110">
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default OrderManagementPortal;