"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/Cart-Context";
import { useCheckout } from "@/context/Checkout-Context";
import Image from "next/image";
import { Tag, Check, ShoppingBag, Sparkles } from "lucide-react";
import { validarCupon, type Cupon } from "@/services/actions-cuponoes";

const OrderSummary: React.FC = () => {
  const { cart = [] } = useCart();
  const [coupon, setCoupon] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const {
    formData,
    subtotal = 0,
    descuento = 0,
    cuponAplicado,
    setCuponAplicado,
  } = useCheckout();

  const formatPrice = (price: number | undefined | null): string => {
    if (typeof price !== "number" || isNaN(price)) return "$0";
    return price.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    });
  };

  const handleApplyCoupon = async () => {
    if (!coupon) return;
    setLoading(true);
    setError(null);

    const result = await validarCupon({ codigo: coupon, montoCarrito: subtotal });

    if (!result.success) {
      setError(result.error ?? "Cupón inválido");
      setCuponAplicado(null);
    } else {
      setCuponAplicado(result.data as Cupon);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (coupon === "") setError(null);
  }, [coupon]);

  // --- LÓGICA DE ENVÍO ---
  const tieneEnvioCargado = typeof formData?.costoEnvio === "number";
  const costoEnvioReal = tieneEnvioCargado ? (formData?.costoEnvio as number) : 0;
  const esEnvioGratis = tieneEnvioCargado && costoEnvioReal === 0;

  // --- LÓGICA DE CUPÓN ---
  let montoDescuentoCupon = 0;
  if (cuponAplicado) {
    if (cuponAplicado.tipo === "PORCENTAJE") {
      montoDescuentoCupon = subtotal * (cuponAplicado.valor / 100);
    } else if (cuponAplicado.tipo === "MONTO_FIJO") {
      montoDescuentoCupon = cuponAplicado.valor;
    }
  }

  // --- LÓGICA DE MÉTODO DE PAGO ---
  const metodoPagoActual = String(formData?.metodoPago || "").trim().toUpperCase();
  const esTransferencia = metodoPagoActual === "TRANSFERENCIA";

  const subtotalConDescuentos = Math.max(
    0,
    subtotal - descuento - montoDescuentoCupon
  );

  const descuentoTransferencia = esTransferencia ? subtotalConDescuentos * 0.1 : 0;
  const totalFinalAbsoluto = subtotalConDescuentos - descuentoTransferencia + costoEnvioReal;

  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 sticky top-6 font-sans">
      <h3 className="text-[12px] font-bold mb-6 uppercase text-gray-800 tracking-[0.15em] flex items-center gap-2 border-b border-gray-100 pb-4">
        <ShoppingBag className="w-4 h-4 text-[#A186ED]" />
        Resumen de compra
      </h3>

      {/* Productos */}
      <div className="space-y-4 mb-6 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
        {cart.map((item) => {
          const precioUnitarioBase = item?.precioOriginal ?? item?.precioUnitarioVisual ?? 0;
          const itemQuantity = item?.quantity ?? 1;
          const lineaSubtotal = precioUnitarioBase * itemQuantity;
          const productoInfo = item.variante?.producto;

          return (
            <div
              key={item.id}
              className="flex justify-between items-center gap-3 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 shrink-0 border border-gray-200 rounded-lg overflow-hidden bg-white">
                  <Image
                    src={productoInfo?.imagenUrl ?? "/logozhyra.jpeg"}
                    alt={productoInfo?.nombre ?? "Producto"}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute -top-1 -right-1 bg-[#A186ED] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold border border-white shadow-xs">
                    {itemQuantity}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[12px] text-gray-800 font-medium line-clamp-1">
                    {productoInfo?.nombre ?? "Producto"}
                  </span>
                  <span className="text-[10px] text-gray-400 uppercase font-semibold">
                    {formatPrice(precioUnitarioBase)}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span
                  className={`text-[12px] font-bold ${lineaSubtotal === 0 ? "text-[#A186ED]" : "text-gray-800"
                    }`}
                >
                  {lineaSubtotal === 0 ? "GRATIS" : formatPrice(lineaSubtotal)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cupón */}
      <div className="mb-6 pt-4 border-t border-gray-100">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 flex items-center gap-1.5">
          <Tag className="w-3 h-3 text-[#A186ED]" />
          ¿Tenés un cupón?
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="CÓDIGO DE CUPÓN"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value.toUpperCase())}
            className={`flex-1 bg-gray-50 border ${error ? "border-red-400" : "border-gray-200"
              } rounded-xl px-3.5 py-2.5 text-[11px] font-semibold tracking-wider focus:outline-none focus:bg-white focus:border-[#A186ED] focus:ring-2 focus:ring-[#A186ED]/20 transition-all placeholder:text-gray-300`}
          />
          <button
            onClick={handleApplyCoupon}
            disabled={loading || !coupon}
            className={`${loading || !coupon
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-[#A186ED] text-white hover:bg-[#8e70e3] shadow-sm"
              } px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-150 shrink-0`}
          >
            {loading ? "..." : "Aplicar"}
          </button>
        </div>

        {error && (
          <p className="text-[10px] text-red-500 mt-2 font-medium">{error}</p>
        )}

        {cuponAplicado && (
          <div className="flex justify-between items-center mt-3 bg-green-50 p-2.5 border border-green-200 rounded-xl">
            <p className="text-[10px] text-green-700 font-bold uppercase tracking-wider flex items-center gap-1">
              <Check className="w-3 h-3" /> Cupón {cuponAplicado.codigo}
            </p>
            <button
              onClick={() => {
                setCuponAplicado(null);
                setCoupon("");
              }}
              className="text-[9px] text-green-800 hover:text-red-500 font-bold uppercase underline transition-colors"
            >
              Quitar
            </button>
          </div>
        )}
      </div>

      {/* Desglose de Precios */}
      <div className="space-y-3 pt-4 border-t border-gray-100">
        <div className="flex justify-between text-[12px]">
          <span className="text-gray-500 font-medium">Subtotal productos</span>
          <span className="text-gray-800 font-semibold">
            {formatPrice(subtotal)}
          </span>
        </div>

        {montoDescuentoCupon > 0 && (
          <div className="flex justify-between text-[12px] text-green-600">
            <span className="font-medium flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Cupón de descuento
            </span>
            <span className="font-bold">
              -{formatPrice(montoDescuentoCupon)}
            </span>
          </div>
        )}

        {esTransferencia && (
          <div className="flex justify-between text-[12px] text-[#A186ED]">
            <span className="font-medium flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Descuento Transferencia (10%)
            </span>
            <span className="font-bold">
              -{formatPrice(descuentoTransferencia)}
            </span>
          </div>
        )}

        <div className="flex justify-between text-[12px]">
          <span className="text-gray-500 font-medium">Envío</span>
          <span
            className={
              esEnvioGratis
                ? "text-green-600 font-bold"
                : "text-gray-800 font-semibold"
            }
          >
            {esEnvioGratis
              ? "Gratis"
              : tieneEnvioCargado
                ? formatPrice(costoEnvioReal)
                : "A calcular"}
          </span>
        </div>

        {/* Total Final */}
        <div className="flex justify-between items-baseline pt-4 mt-2 border-t border-gray-200">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-800">
            Total a pagar
          </span>
          <span className="text-2xl font-black text-[#A186ED]">
            {formatPrice(totalFinalAbsoluto)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;