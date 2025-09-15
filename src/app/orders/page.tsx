import { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { OrderList } from "@/components/orders/order-list";

export const metadata: Metadata = {
  title: "My Orders | TechStore",
  description: "View your order history",
};

export default async function OrdersPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      <OrderList />
    </div>
  );
}