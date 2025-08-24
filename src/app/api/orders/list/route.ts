import { NextRequest, NextResponse } from 'next/server';
import type { OrdersListRequest, OrdersListResponse, Order, OrderStatus } from '@/types/orders';

// MOCK DATA SOURCE - replace with DB or real upstream service
const MOCK_ORDERS: Order[] = [
  // Pending Orders
  {
    id: '#AA1778',
    date: '16 Aug',
    time: 'Today 03:46 PM',
    pickupAddress: 'Sunitha (Bangalore - 562157)',
    deliveryAddress: '',
    pickupContact: 'Sunitha',
    deliveryContact: '',
    productDetails: 'Aqua Ace Ha Gel ...',
    productPrice: 550.00,
    paymentMode: 'Prepaid',
    weight: 'Enter weight',
    packageType: 'Box',
    dimensions: { length: 10, breadth: 8, height: 5 },
    status: 'pending',
    zone: 'Zone B',
    transportMode: 'Surface'
  },
  {
    id: 'Upperandbottom/U...',
    date: '16 Aug',
    time: 'Today 01:37 PM',
    pickupAddress: 'Upper & Bottom (UB) (Jaipur - 302015)',
    deliveryAddress: 'Sara (Ghaziabad - 201102)',
    pickupContact: 'Upper & Bottom',
    deliveryContact: 'Sara',
    productDetails: 'Upperandbottom_C...',
    productPrice: 649.00,
    paymentMode: 'Prepaid',
    weight: 'Pkg Wt. 200 gm',
    packageType: 'Box',
    dimensions: { length: 20, breadth: 10, height: 4 },
    status: 'pending',
    zone: 'Zone B',
    transportMode: 'Surface'
  },
  {
    id: 'UB1779',
    date: '16 Aug',
    time: 'Today 01:20 PM',
    pickupAddress: 'C-46 MARUTI BHAWAN 80 FEET ROAD MASHESH NAGAR NEAR J.D.A. PARK (Jaipur - 302015)',
    deliveryAddress: 'Sarita (Sagwara - 314025)',
    pickupContact: 'MARUTI BHAWAN',
    deliveryContact: 'Sarita',
    productDetails: 'Black Wide Leg C...',
    productPrice: 749.00,
    paymentMode: 'COD',
    weight: 'Enter weight',
    packageType: 'Box',
    dimensions: { length: 20, breadth: 10, height: 4 },
    status: 'pending',
    zone: 'Zone D1',
    transportMode: 'Surface'
  },
  {
    id: 'AQUA ACE/#AA1770',
    date: '16 Aug',
    time: 'Today 11:22 AM',
    pickupAddress: 'Aqua Ace (Jaipur - 302015)',
    deliveryAddress: 'Muskan (Pathankot - 140051)',
    pickupContact: 'Aqua Ace',
    deliveryContact: 'Muskan',
    productDetails: 'Aqua Ace Ha Gel ...',
    productPrice: 850.00,
    paymentMode: 'COD',
    weight: '(20 x 10 x 4 cm)',
    packageType: 'Box',
    dimensions: { length: 20, breadth: 10, height: 4 },
    status: 'pending',
    zone: 'Zone S4',
    transportMode: 'Surface'
  },

  // Ready to Ship Orders
  {
    id: 'INFUSION NOTES/I...',
    date: '16 Aug',
    time: '2025 02:17 PM',
    pickupAddress: 'Infusion Notes (Jaipur - 302029)',
    deliveryAddress: 'Mohammad (Araria - 854329)',
    pickupContact: 'Infusion Notes',
    deliveryContact: 'Mohammad',
    productDetails: 'Infusion Product',
    productPrice: 450.00,
    paymentMode: 'Cash on Delivery',
    weight: '200 gm',
    status: 'ready-to-ship',
    zone: 'Zone S4',
    transportMode: 'Surface',
    awbNumber: '33081910268380'
  },
  {
    id: 'INFUSION NOTES/I...',
    date: '16 Aug',
    time: '2025 02:17 PM',
    pickupAddress: 'Infusion Notes (Jaipur - 302029)',
    deliveryAddress: 'Muskan (Jaipur - 303702)',
    pickupContact: 'Infusion Notes',
    deliveryContact: 'Muskan',
    productDetails: 'Infusion Product',
    productPrice: 450.00,
    paymentMode: 'Cash on Delivery',
    weight: '200 gm',
    status: 'ready-to-ship',
    zone: 'Zone S4',
    transportMode: 'Surface',
    awbNumber: '33081910268376'
  },
  {
    id: 'INFUSION NOTES/I...',
    date: '16 Aug',
    time: '2025 02:17 PM',
    pickupAddress: 'Infusion Notes (Jaipur - 302029)',
    deliveryAddress: 'Ajay (Bikaner - 334001)',
    pickupContact: 'Infusion Notes',
    deliveryContact: 'Ajay',
    productDetails: 'Infusion Product',
    productPrice: 450.00,
    paymentMode: 'Cash on Delivery',
    weight: '200 gm',
    status: 'ready-to-ship',
    zone: 'Zone S4',
    transportMode: 'Surface',
    awbNumber: '33081910268402'
  },
  {
    id: 'INFUSION NOTES/I...',
    date: '16 Aug',
    time: '2025 02:17 PM',
    pickupAddress: 'Infusion Notes (Jaipur - 302029)',
    deliveryAddress: 'Sourabh (Bundi - 323001)',
    pickupContact: 'Infusion Notes',
    deliveryContact: 'Sourabh',
    productDetails: 'Infusion Product',
    productPrice: 450.00,
    paymentMode: 'Prepaid',
    weight: '200 gm',
    status: 'ready-to-ship',
    zone: 'Zone S4',
    transportMode: 'Surface',
    awbNumber: '33081910268391'
  },

  // Ready for Pickup Orders
  {
    id: 'Bfast/#BFAST87',
    date: '16 Aug',
    time: '2025 11:52 AM',
    pickupAddress: 'Deepika Khatri (Jaipur - 302033)',
    deliveryAddress: 'Suganchand (Mumbai - 440017)',
    pickupContact: 'Deepika Khatri',
    deliveryContact: 'Suganchand',
    productDetails: 'Bfast Product',
    productPrice: 899.00,
    paymentMode: 'Prepaid',
    weight: '200 gm',
    status: 'ready-for-pickup',
    zone: 'Zone D',
    transportMode: 'Express',
    awbNumber: '33081910267971'
  },
  {
    id: 'Bfast/#BFAST86',
    date: '16 Aug',
    time: '2025 11:52 AM',
    pickupAddress: 'Deepika Khatri (Jaipur - 302033)',
    deliveryAddress: 'Dheeraj (Navi Mumbai - 410206)',
    pickupContact: 'Deepika Khatri',
    deliveryContact: 'Dheeraj',
    productDetails: 'Bfast Product',
    productPrice: 899.00,
    paymentMode: 'Prepaid',
    weight: '200 gm',
    status: 'ready-for-pickup',
    zone: 'Zone D',
    transportMode: 'Express',
    awbNumber: '33081910267960'
  },
  {
    id: 'AQUA ACE/#AA1764',
    date: '16 Aug',
    time: '2025 11:23 AM',
    pickupAddress: 'Aqua Ace (Jaipur - 302015)',
    deliveryAddress: 'Himanshu (Jaipur - 302012)',
    pickupContact: 'Aqua Ace',
    deliveryContact: 'Himanshu',
    productDetails: 'Aqua Ace Product',
    productPrice: 650.00,
    paymentMode: 'Cash on Delivery',
    weight: '200 gm',
    status: 'ready-for-pickup',
    zone: 'Zone S4',
    transportMode: 'Surface',
    awbNumber: '33081910267923'
  },

  // In Transit Orders
  {
    id: 'MyPathshala/R3tvT...',
    date: '26 Aug',
    time: '2025',
    pickupAddress: 'My Pathshala (Jaipur - 302033)',
    deliveryAddress: 'MANAS (Udaipur - 799013)',
    pickupContact: 'My Pathshala',
    deliveryContact: 'MANAS',
    productDetails: 'Educational Material',
    productPrice: 1200.00,
    paymentMode: 'Prepaid',
    weight: '500 gm',
    status: 'in-transit',
    zone: 'Zone S4',
    transportMode: 'Surface',
    awbNumber: '33081910260862'
  },
  {
    id: 'Dholkee/#DH13437',
    date: '24 Aug',
    time: '2025',
    pickupAddress: 'Dholkee (Jaipur - 302029)',
    deliveryAddress: 'Bhagyashree (Pune - 411009)',
    pickupContact: 'Dholkee',
    deliveryContact: 'Bhagyashree',
    productDetails: 'Traditional Item',
    productPrice: 850.00,
    paymentMode: 'Prepaid',
    weight: '300 gm',
    status: 'in-transit',
    zone: 'Zone S4',
    transportMode: 'Surface',
    awbNumber: '33081910266501'
  },
  {
    id: 'PT-69',
    date: '23 Aug',
    time: '2025',
    pickupAddress: 'Dholkee (Jaipur - 302029)',
    deliveryAddress: 'P.Venkatchi (Ramanathapuram - 623527)',
    pickupContact: 'Dholkee',
    deliveryContact: 'P.Venkatchi',
    productDetails: 'Traditional Item',
    productPrice: 750.00,
    paymentMode: 'Prepaid',
    weight: '200 gm',
    status: 'in-transit',
    zone: 'Zone S4',
    transportMode: 'Surface',
    awbNumber: '33081910173644'
  },

  // Delivered Orders
  {
    id: 'Dholkee/#DH13432',
    date: '16 Aug',
    time: 'Today',
    pickupAddress: 'Dholkee (Jaipur - 302029)',
    deliveryAddress: 'K (Ongole - 523001)',
    pickupContact: 'Dholkee',
    deliveryContact: 'K',
    productDetails: 'Traditional Item',
    productPrice: 750.00,
    paymentMode: 'Cash on Delivery',
    weight: '200 gm',
    status: 'delivered',
    zone: 'Zone D',
    transportMode: 'Express',
    awbNumber: '33081910266394'
  },
  {
    id: 'AQUA ACE/#AA1718',
    date: '16 Aug',
    time: 'Today',
    pickupAddress: 'Aqua Ace (Jaipur - 302015)',
    deliveryAddress: 'Preeti (Mohali - 160071)',
    pickupContact: 'Aqua Ace',
    deliveryContact: 'Preeti',
    productDetails: 'Aqua Ace Product',
    productPrice: 650.00,
    paymentMode: 'Cash on Delivery',
    weight: '200 gm',
    status: 'delivered',
    zone: 'Zone S4',
    transportMode: 'Surface',
    awbNumber: '33081910264935'
  },
  {
    id: 'Dholkee/#DH13399',
    date: '16 Aug',
    time: 'Today',
    pickupAddress: 'Dholkee (Jaipur - 302029)',
    deliveryAddress: 'KOMAL (Saharsa - 852201)',
    pickupContact: 'Dholkee',
    deliveryContact: 'KOMAL',
    productDetails: 'Traditional Item',
    productPrice: 750.00,
    paymentMode: 'Cash on Delivery',
    weight: '200 gm',
    status: 'delivered',
    zone: 'Zone D',
    transportMode: 'Express',
    awbNumber: '33081910264891'
  },

  // RTO In-Transit Orders
  {
    id: 'Dholkee/#DH13301',
    date: '16 Aug',
    time: 'Today',
    pickupAddress: 'Dholkee (Jaipur - 302029)',
    deliveryAddress: 'Holi (Haflong dima hasao - 788819)',
    pickupContact: 'Dholkee',
    deliveryContact: 'Holi',
    productDetails: 'Traditional Item',
    productPrice: 750.00,
    paymentMode: 'Cash on Delivery',
    weight: '200 gm',
    status: 'rto-in-transit',
    zone: 'Zone D',
    transportMode: 'Express',
    awbNumber: '33081910261262'
  },
  {
    id: 'AQUA ACE/#AA1637',
    date: '16 Aug',
    time: 'Today',
    pickupAddress: 'Aqua Ace (Jaipur - 302015)',
    deliveryAddress: 'Vinay (Mira Bhayandar - 401106)',
    pickupContact: 'Aqua Ace',
    deliveryContact: 'Vinay',
    productDetails: 'Aqua Ace Product',
    productPrice: 650.00,
    paymentMode: 'Cash on Delivery',
    weight: '200 gm',
    status: 'rto-in-transit',
    zone: 'Zone S4',
    transportMode: 'Surface',
    awbNumber: '33081910259641'
  }
];

function computeStatusCounts(orders: Order[]) {
  const base: Record<OrderStatus | 'all-shipments', number> = {
    'all-shipments': orders.length,
    'pending': 0,
    'ready-to-ship': 0,
    'ready-for-pickup': 0,
    'in-transit': 0,
    'delivered': 0,
    'out-for-delivery': 0,
    'ndr': 0,
    'rto-in-transit': 0,
    'rto-delivered': 0,
  };

  for (const o of orders) base[o.status] += 1;
  return base;
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as OrdersListRequest;
  const { search = '', status = 'all-shipments', page = 1, pageSize = 25 } = body || {};

  const byStatus = status === 'all-shipments' ? MOCK_ORDERS : MOCK_ORDERS.filter(o => o.status === status);
  const lower = search.trim().toLowerCase();
  const bySearch = lower
    ? byStatus.filter(o =>
        o.id.toLowerCase().includes(lower) ||
        o.productDetails.toLowerCase().includes(lower) ||
        o.pickupAddress.toLowerCase().includes(lower) ||
        (o.awbNumber && o.awbNumber.toLowerCase().includes(lower)),
      )
    : byStatus;

  const start = (page - 1) * pageSize;
  const paged = bySearch.slice(start, start + pageSize);
  const response: OrdersListResponse = {
    orders: paged,
    pagination: { page, pageSize, total: bySearch.length },
    statusCounts: computeStatusCounts(MOCK_ORDERS),
  };
  return NextResponse.json(response);
}