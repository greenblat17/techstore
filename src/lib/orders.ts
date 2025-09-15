import { db } from '@/lib/db';
import { orders, orderItems, customers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderSummary {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  total: number;
  itemCount: number;
  createdAt: Date;
}

// Get order summary for a user
export async function getUserOrderSummary(clerkId: string): Promise<OrderSummary[]> {
  try {
    // Get customer record
    const customer = await db
      .select()
      .from(customers)
      .where(eq(customers.clerkId, clerkId))
      .limit(1);

    if (customer.length === 0) {
      return [];
    }

    // Get orders with item counts
    const userOrders = await db
      .select({
        order: orders,
        itemCount: db.$count(orderItems, eq(orderItems.orderId, orders.id)),
      })
      .from(orders)
      .where(eq(orders.customerId, customer[0].id))
      .orderBy(orders.createdAt);

    return userOrders.map(({ order, itemCount }) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status as OrderStatus,
      paymentStatus: order.paymentStatus as PaymentStatus,
      total: Number(order.total),
      itemCount,
      createdAt: order.createdAt,
    }));
  } catch (error) {
    console.error('Error fetching order summary:', error);
    return [];
  }
}

// Calculate estimated delivery date
export function getEstimatedDeliveryDate(orderDate: Date, shippingMethod: string = 'standard'): Date {
  const deliveryDate = new Date(orderDate);
  
  switch (shippingMethod) {
    case 'express':
      deliveryDate.setDate(deliveryDate.getDate() + 2); // 2 business days
      break;
    case 'overnight':
      deliveryDate.setDate(deliveryDate.getDate() + 1); // Next business day
      break;
    case 'standard':
    default:
      deliveryDate.setDate(deliveryDate.getDate() + 5); // 5 business days
      break;
  }
  
  // Skip weekends
  if (deliveryDate.getDay() === 0) { // Sunday
    deliveryDate.setDate(deliveryDate.getDate() + 1);
  } else if (deliveryDate.getDay() === 6) { // Saturday
    deliveryDate.setDate(deliveryDate.getDate() + 2);
  }
  
  return deliveryDate;
}

// Format order status for display
export function formatOrderStatus(status: string): string {
  const statusMap: Record<string, string> = {
    pending: 'Pending',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };
  
  return statusMap[status] || status;
}

// Get status color for UI
export function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    pending: 'yellow',
    processing: 'blue',
    shipped: 'purple',
    delivered: 'green',
    cancelled: 'red',
  };
  
  return colorMap[status] || 'gray';
}

// Format payment status for display
export function formatPaymentStatus(status: string): string {
  const statusMap: Record<string, string> = {
    pending: 'Payment Pending',
    paid: 'Paid',
    failed: 'Payment Failed',
    refunded: 'Refunded',
  };
  
  return statusMap[status] || status;
}

// Get payment status color for UI
export function getPaymentStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    pending: 'yellow',
    paid: 'green',
    failed: 'red',
    refunded: 'purple',
  };
  
  return colorMap[status] || 'gray';
}