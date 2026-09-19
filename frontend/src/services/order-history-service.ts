// src/services/historialService.ts
import { apiRequest } from "@/lib/apiClient";

/**
 * Obtiene el historial de compras del usuario autenticado
 * Se le pasa la interfaz esperada por parámetro genérico <T>
 */
export async function getUserHistorial<T>(): Promise<T> {
  return await apiRequest<T>("/historial/mi-historial");
}


export async function cancelarOrdenCliente(ordenId: string, motivo?: string) {
  // Ajustá "/ordenes" si tu controller en NestJS está mapeado diferente (por ejemplo "/historial/cancelar")
  return await apiRequest(`/ordenes/${ordenId}/cancelar-cliente`, {
    method: "PATCH",
    body: JSON.stringify({ motivo }),
    credentials: "include", // Asegura que las cookies de sesión se envíen
  });
}