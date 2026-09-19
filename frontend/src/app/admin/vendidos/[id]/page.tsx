// src/app/admin/vendidos/[id]/page.tsx
import { adminOrderService } from "@/services/admin/admin-orders-service";
import OrderDetailView from "@/components/admin/OrderDetailView";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { id } = await params;

  // Consultar la orden a través del service
  const orden = await adminOrderService.getOrderById(id);

  if (!orden) {
    notFound();
  }

  return <OrderDetailView orden={orden} />;
}