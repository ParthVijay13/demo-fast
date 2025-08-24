import ForwardOrdersContent from '@/components/orders/ForwardOrdersContent';
import type { OrderStatus } from '@/types/orders';

export default function StatusSpecificOrdersPage({ params }: { params: { status: string } }) {
  return <ForwardOrdersContent initialStatus={params.status as OrderStatus | 'all-shipments'} />;
}
