"use server";

export interface Cupon {
  id: string;
  codigo: string;
  tipo: "PORCENTAJE" | "MONTO_FIJO";
  valor: number;
}

interface ValidarCuponParams {
  codigo: string;
  montoCarrito: number;
}

interface ValidarCuponResult {
  success: boolean;
  data?: Cupon;
  error?: string;
}

export async function validarCupon({
  codigo,
  montoCarrito,
}: ValidarCuponParams): Promise<ValidarCuponResult> {
  if (!codigo) {
    return { success: false, error: "Debe ingresar un código de cupón" };
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL ;
    const url = `${baseUrl}/promociones/validar-cupon/${encodeURIComponent(
      codigo
    )}?montoCarrito=${Math.round(montoCarrito)}`;

    const response = await fetch(url, {
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message || "Cupón inválido" };
    }

    return { success: true, data: data as Cupon };
  } catch (err) {
    console.error("Error al validar cupón:", err);
    return {
      success: false,
      error: "Ocurrió un error inesperado al validar el cupón",
    };
  }
}