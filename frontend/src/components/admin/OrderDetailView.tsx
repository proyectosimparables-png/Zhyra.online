// src/components/admin/OrderDetailView.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Mail,
  MapPin,
  CreditCard,
  Truck,
  Package,
  Calendar,
  Send,
  Ban,
  CheckCircle2,
  FileText,
  Phone,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OrderResponse } from "@/types/orders";
import { adminOrderService } from "@/services/admin/admin-orders-service";
import toast from "react-hot-toast";

export default function OrderDetailView({ orden }: { orden: OrderResponse }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [notas, setNotas] = useState(orden.notasAdmin || "");

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    const loadingToast = toast.loading("Actualizando estado...");
    try {
      if (newStatus === "ENVIADO") {
        await adminOrderService.notifyShipment(orden.id);
      } else {
        await adminOrderService.updateStatus(orden.id, newStatus);
      }
      toast.success("Estado actualizado correctamente", { id: loadingToast });
      router.refresh();
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Error al actualizar";
      toast.error(msg, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotes = async () => {
    const loadingToast = toast.loading("Guardando notas...");
    try {
      await adminOrderService.updateAdminNotes(orden.id, notas);
      toast.success("Notas guardadas", { id: loadingToast });
      router.refresh();
    } catch (error) {
      toast.error("Error al guardar notas", { id: loadingToast });
    }
  };

  const isPagado = ["PAGADO", "EMPAQUETADO", "ENVIADO", "ENTREGADO"].includes(
    orden.estado
  );

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 max-w-6xl">
      {/* Botón Volver y Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
        <div>
          <Link
            href="/admin/vendidos"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-2"
          >
            <ArrowLeft size={16} /> Volver a órdenes
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-800">
              Orden #{orden.id.split("-")[0].toUpperCase()}
            </h1>
            <Badge
              className={
                isPagado
                  ? "bg-green-100 text-green-700 hover:bg-green-100"
                  : "bg-amber-100 text-amber-700 hover:bg-amber-100"
              }
            >
              {orden.estado}
            </Badge>
          </div>
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
            <Calendar size={12} /> Realizada el{" "}
            {new Date(orden.createdAt).toLocaleString("es-AR")}
          </p>
        </div>

        {/* Acciones Rápidas */}
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={loading}
            onClick={() => handleStatusChange("EMPAQUETADO")}
            className="text-xs"
          >
            <Package size={14} className="mr-1" /> Empaquetado
          </Button>
          <Button
            size="sm"
            disabled={loading}
            onClick={() => handleStatusChange("ENVIADO")}
            className="bg-purple-600 hover:bg-purple-700 text-xs"
          >
            <Send size={14} className="mr-1" /> Notificar Envío
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* COLUMNA IZQUIERDA: Datos del Cliente, Envío y Notas (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card Datos del Cliente */}
          <div className="bg-white p-5 rounded-xl border shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2 border-b pb-2">
              <User size={16} className="text-purple-600" />
              Datos del Cliente
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-gray-400">Nombre completo</p>
                <p className="font-semibold text-gray-800">
                  {orden.user?.name || "Cliente Invitado"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="font-semibold text-gray-800 flex items-center gap-1">
                  <Mail size={13} className="text-gray-400" />
                  {orden.user?.email || "No registrado"}
                </p>
              </div>

               <div>
                <p className="text-xs text-gray-400">Numero</p>
                <p className="font-semibold text-gray-800 flex items-center gap-1">
                  <Phone size={13} className="text-gray-400" />
                  {orden.telefonoDestinatario || "No registrado"}
                </p>
              </div>



            </div>
          </div>

          {/* Card Dirección y Envío */}
          <div className="bg-white p-5 rounded-xl border shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2 border-b pb-2">
              <Truck size={16} className="text-purple-600" />
              Detalles de Envío
            </h2>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-gray-400">Método de Envío</p>
                <p className="font-semibold text-gray-800 uppercase">
                  {orden.metodoEnvio || "Retiro en local / A convenir"}
                </p>
              </div>

              {/* Si guardas la dirección dentro del objeto orden o user */}
              <div className="pt-2 border-t">
                <p className="text-xs text-gray-400 flex items-center gap-1 mb-1">
                  <MapPin size={13} className="text-gray-400" />
                  Dirección de Entrega
                </p>
                <p className="font-medium text-gray-700">
                  {/* Adapta según los campos que devuelva tu backend */}
                  {orden.calle || orden.user?.email || "No especificada"}
                  {orden.numero ? `, ${orden.numero}` : ""}

                </p>
              </div>
            </div>
          </div>

          {/* Items de la Compra */}
          <div className="bg-white p-5 rounded-xl border shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2 border-b pb-2">
              <Package size={16} className="text-purple-600" />
              Productos Comprados ({orden.items?.length || 0})
            </h2>

            <div className="divide-y">
              {orden.items?.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg border overflow-hidden shrink-0">
                      <Image
                        src={item.imagenUrl}
                        alt={item.nombre}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-800">
                        {item.nombre}
                      </p>
                      <p className="text-xs text-gray-400">
                        Cant: {item.cantidad} x ${item.precio.toLocaleString("es-AR")}
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-sm text-gray-800">
                    ${(item.cantidad * item.precio).toLocaleString("es-AR")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: Resumen de Pago y Notas Internas (1 Col) */}
        <div className="space-y-6">
          {/* Card Pago */}
          <div className="bg-white p-5 rounded-xl border shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2 border-b pb-2">
              <CreditCard size={16} className="text-purple-600" />
              Resumen de Pago
            </h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Método:</span>
                <span className="font-semibold text-gray-800 uppercase">
                  {orden.metodoPago || "Mercado Pago"}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Estado de pago:</span>
                <Badge
                  variant="outline"
                  className={
                    isPagado ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
                  }
                >
                  {isPagado ? "Aprobado" : "Pendiente"}
                </Badge>
              </div>
              <div className="border-t pt-3 flex justify-between items-center text-base font-bold text-gray-800">
                <span>Total pagado:</span>
                <span className="text-purple-600 text-xl">
                  ${orden.total.toLocaleString("es-AR")}
                </span>
              </div>
            </div>
          </div>

          {/* Card Notas Admin */}
          <div className="bg-white p-5 rounded-xl border shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2 border-b pb-2">
              <FileText size={16} className="text-purple-600" />
              Notas Internas
            </h2>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Escribe notas sobre la orden (solo visibiles por admins)..."
              className="w-full h-24 p-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={handleSaveNotes}
              className="w-full text-xs"
            >
              Guardar Notas
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}