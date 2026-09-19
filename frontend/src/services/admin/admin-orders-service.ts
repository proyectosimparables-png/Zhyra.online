// src/services/admin/admin-ordenes-service.ts

import { apiRequest } from "@/lib/apiClient";
import { OrderResponse as OrdenReal } from "@/types/orders";
import { cookies } from "next/dist/server/request/cookies";

export const adminOrderService = {
  /**
   * Obtener todas las órdenes de la tienda para el panel de administración
   */
  async getOrdenesAdmin(): Promise<OrdenReal[]> {
    try {

 const headersConfig: Record<string, string> = {};

    if (typeof window === "undefined") {
      const cookieStore = await cookies();
      const cookieHeader = cookieStore.toString();
      headersConfig["Cookie"] = cookieHeader;
      
    }

      return await apiRequest<OrdenReal[]>("/ordenes", {
        cache: "no-store",
        credentials: "include", // Asegura que las cookies de sesión se envíen con la solicitud
        headers: headersConfig
      });
    } catch (error) {
      console.error("Error al obtener las órdenes en el panel admin:", error);
      return [];
    }
  },

  /**
   * Obtener una orden por ID
   */
  async getOrderById(orderId: string): Promise<OrdenReal | null> {
    try {
      const headersConfig: Record<string, string> = {};

      if (typeof window === "undefined") {
        const cookieStore = await cookies();
        const cookieHeader = cookieStore.toString();
        headersConfig["Cookie"] = cookieHeader;
      }

      return await apiRequest<OrdenReal>(`/ordenes/${orderId}`, {
        cache: "no-store",
        credentials: "include",
        headers: headersConfig,
      });
    } catch (error) {
      console.error(`Error al obtener la orden ${orderId}:`, error);
      return null;
    }
  },

  /**
   * Cambiar estado general (Empaquetar, Enviar, etc.)
   */
  async updateStatus(orderId: string, status: string): Promise<OrdenReal> {
    const headersConfig: Record<string, string> = {};

    if (typeof window === "undefined") {
      const cookieStore = await cookies();
      const cookieHeader = cookieStore.toString();
      headersConfig["Cookie"] = cookieHeader;
    }

    return await apiRequest<OrdenReal>(`/ordenes/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ nuevoEstado: status }),
      credentials: "include", // Asegura que las cookies de sesión se envíen con la solicitud
      headers: headersConfig,
    });
  },

  /**
   * Acción específica: Desempaquetar
   * Reutiliza el endpoint de status volviendo a "PAGADO"
   */
  async unpackOrder(orderId: string): Promise<OrdenReal> {
    return this.updateStatus(orderId, "PAGADO");
  },

  /**
   * Actualizar notas internas del administrador
   */
  async updateAdminNotes(orderId: string, notas: string): Promise<OrdenReal> {
    const headersConfig: Record<string, string> = {};

    if (typeof window === "undefined") {
      const cookieStore = await cookies();
      headersConfig["Cookie"] = cookieStore.toString();
    }

    return await apiRequest<OrdenReal>(`/ordenes/${orderId}/notas-admin`, {
      method: "PATCH",
      body: JSON.stringify({ notasAdmin: notas }),
      credentials: "include",
      headers: headersConfig,
    });
  },

  /**
   * Reembolsar en Mercado Pago vía Backend
   */
  async refundOrder(orderId: string): Promise<{ success: boolean;[key: string]: unknown }> {
     const headersConfig: Record<string, string> = {};

    if (typeof window === "undefined") {
      const cookieStore = await cookies();
      headersConfig["Cookie"] = cookieStore.toString();
    }
    return await apiRequest(`/ordenes/${orderId}/refund`, {
      method: "POST",
      credentials: "include",
       headers: headersConfig,

    });
  },

  /**
   * Notificar despacho / envío
   */
  async notifyShipment(orderId: string): Promise<OrdenReal> {
     const headersConfig: Record<string, string> = {};

    if (typeof window === "undefined") {
      const cookieStore = await cookies();
      headersConfig["Cookie"] = cookieStore.toString();
    }
    return await apiRequest<OrdenReal>(`/ordenes/${orderId}/despachar`, {
      method: "PATCH",
      credentials: "include",
      headers: headersConfig,
    });
  },

  /**
   * Cancelación avanzada de orden
   */
  async cancelOrder(
    orderId: string,
    data: { motivo: string; restaurarStock: boolean; enviarEmail: boolean }
  ): Promise<OrdenReal> {
     const headersConfig: Record<string, string> = {};

    if (typeof window === "undefined") {
      const cookieStore = await cookies();
      headersConfig["Cookie"] = cookieStore.toString();
    }
    return await apiRequest<OrdenReal>(`/ordenes/${orderId}/cancelar`, {
      method: "PATCH",
      body: JSON.stringify(data),
      credentials: "include",
      headers: headersConfig,

    });
  },
};