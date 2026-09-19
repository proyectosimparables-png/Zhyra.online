// src/services/admin/promociones-service.ts
import { apiRequest } from "@/lib/apiClient";
import {
    PromocionResponse,
    PromocionPayload,
    CuponResponse,
    CuponPayload
} from "@/types/promotions";

export const promocionesService = {

    // ==========================================
    // 🔹 PROMOCIONES GENERALES
    // ==========================================

    async getPromociones(): Promise<PromocionResponse[]> {
        try {
            return await apiRequest<PromocionResponse[]>("/promociones", { cache: "no-store" ,credentials: "include" });
        } catch (error) {
            console.error("Error al obtener promociones:", error);
            return [];
        }
    },

    async createPromocion(data: PromocionPayload): Promise<PromocionResponse> {
        return await apiRequest<PromocionResponse>("/promociones", {
            method: "POST",
            body: JSON.stringify(data),
            credentials: "include" // Asegura que las cookies de sesión se envíen con la solicitud
        });
    },

    async deletePromocion(id: string): Promise<PromocionResponse> {
        return await apiRequest<PromocionResponse>(`/promociones/${id}`, {
            method: "DELETE",
            credentials: "include" // Asegura que las cookies de sesión se envíen con la solicitud
        });
    },

    // ==========================================
    // 🔹 CUPONES DE DESCUENTO
    // ==========================================

    async getCupones(): Promise<CuponResponse[]> {
        try {
            return await apiRequest<CuponResponse[]>("/promociones/cupon", { cache: "no-store" ,credentials: "include" });
        } catch (error) {
            console.error("Error al obtener cupones:", error);
            return [];
        }
    },

    async createCupon(data: CuponPayload): Promise<CuponResponse> {
        return await apiRequest<CuponResponse>("/promociones/cupon", {
            method: "POST",
            body: JSON.stringify(data),
            credentials: "include" // Asegura que las cookies de sesión se envíen con la solicitud
        });
        
    },



    async updateCupon(id: string, data: Partial<CuponPayload>): Promise<CuponResponse> {
        return await apiRequest<CuponResponse>(`/promociones/cupon/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
            credentials: "include" // Asegura que las cookies de sesión se envíen con la solicitud
        });
    },

    async deleteCupon(id: string): Promise<CuponResponse> {

        return await apiRequest<CuponResponse>(`/promociones/cupon/${id}`, {
            method: "DELETE",
            credentials: "include" // Asegura que las cookies de sesión se envíen con la solicitud
        });
    },
};