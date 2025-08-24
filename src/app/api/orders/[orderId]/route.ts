import { NextResponse } from 'next/server';
import type { Order } from '@/types/orders';

// In-memory mock store; share the same objects as list handler for consistency when integrating real DB.
const MOCK_ORDERS: Order[] = [
  { id: 'ORD001', date: '25 Jun', time: '10:09 PM', pickupAddress: 'C-46 MARUTI BHAWAN, MAHESH NAGAR, JAIPUR - 302015', productDetails: 'Cement Grey Wide Leg Trousers', weight: '4.29 kg', status: 'pending', zone: 'Surface Zone B' },
  { id: 'ORD002', date: '25 Jun', time: '08:36 PM', pickupAddress: 'Ajay (Dayalbagh) - 201001', productDetails: 'Aqua Ace Hyaluronic Acid Gel', weight: '0.45 kg', status: 'ready-to-ship', zone: 'Surface' },
  { id: 'ORD003', date: '25 Jun', time: '07:52 PM', pickupAddress: 'Goshpara (Hyderabad) - 500001', productDetails: 'Black Wide Leg Cargo Jeans', weight: '0.80 kg', status: 'in-transit', zone: 'Surface Zone D2' },
  { id: 'ORD004', date: '24 Jun', time: '02:15 PM', pickupAddress: 'Koramangala, Bangalore - 560034', productDetails: 'Wireless Bluetooth Earbuds', weight: '0.25 kg', status: 'delivered', zone: 'Air Zone A' },
  { id: 'ORD005', date: '24 Jun', time: '11:00 AM', pickupAddress: 'Sector 62, Noida - 201309', productDetails: 'Ergonomic Office Chair', weight: '15.5 kg', status: 'out-for-delivery', zone: 'Surface Zone C' },
  { id: 'ORD006', date: '23 Jun', time: '09:30 PM', pickupAddress: 'Bandra West, Mumbai - 400050', productDetails: 'Leather Biker Jacket', weight: '1.2 kg', status: 'ndr', zone: 'Surface Zone A' },
  { id: 'ORD007', date: '22 Jun', time: '05:00 PM', pickupAddress: 'T. Nagar, Chennai - 600017', productDetails: 'Silk Saree with Blouse Piece', weight: '0.9 kg', status: 'rto-in-transit', zone: 'Air Zone B' },
  { id: 'ORD008', date: '21 Jun', time: '01:20 PM', pickupAddress: 'Salt Lake, Kolkata - 700091', productDetails: 'Set of 6 Ceramic Mugs', weight: '2.1 kg', status: 'rto-delivered', zone: 'Surface Zone E' },
];

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parts = url.pathname.split('/');
  const ordersIdx = parts.findIndex(p => p === 'orders');
  const orderId = ordersIdx >= 0 && parts.length > ordersIdx + 1 ? parts[ordersIdx + 1] : '';
  const order = MOCK_ORDERS.find(o => o.id === orderId);
  if (!order) return NextResponse.json({ message: 'Order not found' }, { status: 404 });
  return NextResponse.json(order);
}


