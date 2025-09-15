import { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { OrderDetails } from "@/components/orders/order-details";

export const metadata: Metadata = {
  title: "Order Details | TechStore",
  description: "View your order details",
};

interface OrderPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  const { id } = await params;

  return (
    <div className="container py-8">
      <OrderDetails orderId={id} />
    </div>
  );
}