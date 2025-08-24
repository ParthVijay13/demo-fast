import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const url = new URL(req.url);
  const parts = url.pathname.split('/');
  const ordersIdx = parts.findIndex(p => p === 'orders');
  const orderId = ordersIdx >= 0 && parts.length > ordersIdx + 1 ? parts[ordersIdx + 1] : 'UNKNOWN';
  // Generate deterministic mock AWB: AWB-<orderId>-XXXX
  const random = Math.floor(1000 + Math.random() * 9000);
  const awbNumber = `AWB-${orderId}-${random}`;
  return NextResponse.json({ awbNumber });
}


