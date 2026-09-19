"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Store, Loader2, Gift, Truck, Check, MapPin, Trash2 } from "lucide-react";
import { getPuntosEntrega } from "@/services/envios/delivery-points-service";
import { getShippingRates } from "@/services/envios/correo-service";
import { CartItem, useCart } from "@/context/Cart-Context";

// --- INTERFACES ---
interface PuntoEntrega {
  id: string;
  nombre: string;
  direccion: string;
  costo: number;
  demora?: string;
}

interface CorreoRate {
  nombre: string;
  precio: number;
  productType: string;
  deliveredType: "D" | "S";
  plazoMin: number;
  plazoMax: number;
}

interface CartSummaryProps {
  subtotal: number;
  descuento: number;
  totalPrice: number;
  postalCode: string;
  setPostalCode: (val: string) => void;
  handleCheckout: () => void;
  openClearCartModal: () => void;
  items: CartItem[];
  onShippingChange?: (
    nombre: string,
    costo: number,
    deliveredType: "HOME_DELIVERY" | "PICKUP"
  ) => void;
}

type SeleccionEnvio = {
  nombre: string;
  precioFinal: number;
  tipo: "HOME_DELIVERY" | "PICKUP";
  idRef?: string;
};

export default function CartSummary({
  subtotal,
  descuento,
  totalPrice,
  postalCode,
  setPostalCode,
  handleCheckout,
  openClearCartModal,
  onShippingChange,
  items,
}: CartSummaryProps) {
  const { esEnvioGratis, montoFaltante } = useCart();

  const [puntos, setPuntos] = useState<PuntoEntrega[]>([]);
  const [correoRates, setCorreoRates] = useState<CorreoRate[]>([]);
  const [loadingCorreo, setLoadingCorreo] = useState(false);
  const [seleccion, setSeleccion] = useState<SeleccionEnvio | null>(null);

  useEffect(() => {
    async function loadPuntos() {
      try {
        const data = await getPuntosEntrega();
        setPuntos(data);
      } catch (error) {
        console.error("Error cargando puntos de entrega:", error);
      }
    }
    loadPuntos();
  }, []);

  const handleCalculateShipping = async () => {
    if (postalCode.length < 4 || !items || items.length === 0) return;
    setLoadingCorreo(true);
    try {
      const rates: CorreoRate[] = await getShippingRates(postalCode);
      setCorreoRates(rates);
    } catch (error) {
      console.error("Error calculando envío:", error);
    } finally {
      setLoadingCorreo(false);
    }
  };

  const handleSelectPunto = (punto: PuntoEntrega) => {
    const costoFinal = esEnvioGratis ? 0 : punto.costo;
    const nuevaSeleccion: SeleccionEnvio = {
      nombre: punto.nombre,
      precioFinal: costoFinal,
      tipo: "PICKUP",
      idRef: punto.id,
    };
    setSeleccion(nuevaSeleccion);
    onShippingChange?.(punto.nombre, costoFinal, "PICKUP");
  };

  const handleSelectCorreo = (rate: CorreoRate) => {
    const costoFinal = esEnvioGratis ? 0 : rate.precio;
    const type = rate.deliveredType === "D" ? "HOME_DELIVERY" : "PICKUP";
    const nuevaSeleccion: SeleccionEnvio = {
      nombre: rate.nombre,
      precioFinal: costoFinal,
      tipo: type,
    };
    setSeleccion(nuevaSeleccion);
    onShippingChange?.(rate.nombre, costoFinal, type);
  };

  const formatPrice = (price: number) =>
    price.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    });

  // Calculamos montos limpios y alineados
  const currentShippingCost = seleccion?.precioFinal ?? 0;
  const totalFinalConEnvio = subtotal + currentShippingCost;
  const transferPrice = totalFinalConEnvio * 0.9; // 10% OFF

  const isReadyToCheckout = totalFinalConEnvio > 0 && seleccion !== null;

  return (
    <div className="mt-4 space-y-5 font-sans text-gray-700">
      
      {/* 🚀 Banner Dinámico de Envío Gratis */}
      <div className="relative overflow-hidden rounded-2xl bg-purple-50/50 p-4 border border-purple-100 transition-all">
        {esEnvioGratis ? (
          <div className="flex items-center gap-3 text-[#A186ED]">
            <div className="p-2 bg-purple-100/80 rounded-xl">
              <Gift className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-[#A186ED]">
                ¡Felicitaciones!
              </span>
              <span className="text-xs font-semibold text-gray-800">
                Tu envío es completamente GRATIS ✨
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl border border-purple-100 shadow-xs">
              <Gift className="w-5 h-5 text-[#A186ED]" />
            </div>
            <div className="text-xs text-gray-600">
              <span>Agregá </span>
              <span className="text-[#A186ED] font-bold mx-0.5">
                {formatPrice(montoFaltante)}
              </span>
              <span> más para desbloquear </span>
              <span className="font-bold text-gray-800">Envío Gratis</span>.
            </div>
          </div>
        )}
      </div>

      {/* 💳 Desglose de Precios */}
      <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-100 space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 font-medium">Subtotal</span>
          <span className="font-bold text-gray-800">
            {formatPrice(subtotal)}
          </span>
        </div>

        {seleccion && (
          <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-200/50">
            <span className="text-gray-500 font-medium flex items-center gap-1.5 text-xs">
              <Truck className="w-4 h-4 text-gray-400" />
              {seleccion.nombre}
            </span>
            <span
              className={`font-semibold text-xs ${
                seleccion.precioFinal === 0 ? "text-emerald-600 font-bold" : "text-gray-800"
              }`}
            >
              {seleccion.precioFinal === 0
                ? "Gratis"
                : formatPrice(seleccion.precioFinal)}
            </span>
          </div>
        )}
      </div>

      {/* 🚚 Medios de Envío */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
            Opciones de envío
          </h3>
          <span className="text-[11px] text-gray-400 font-medium">
            Ingresá tu CP
          </span>
        </div>

        {/* Input Código Postal */}
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200/80 rounded-xl p-1.5 focus-within:border-[#A186ED] focus-within:ring-2 focus-within:ring-purple-100 transition-all bg-white">
          <MapPin className="w-4 h-4 text-gray-400 ml-2 shrink-0" />
          <input
            type="text"
            placeholder="Tu código postal (ej: 1425)"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            className="w-full bg-transparent py-1 focus:outline-none text-xs text-gray-800 placeholder-gray-400 font-medium"
          />
          <Button
            type="button"
            onClick={handleCalculateShipping}
            disabled={loadingCorreo || postalCode.length < 4}
            className="bg-gray-700 hover:bg-gray-900 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-all shrink-0 h-auto disabled:opacity-50"
          >
            {loadingCorreo ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              "Calcular"
            )}
          </Button>
        </div>

        {/* Opciones Correo Argentino */}
        {correoRates.length > 0 && (
          <div className="space-y-2 pt-1">
            {correoRates.map((rate, idx) => {
              const isSelected = seleccion?.nombre === rate.nombre;
              return (
                <div
                  key={idx}
                  onClick={() => handleSelectCorreo(rate)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? "border-[#A186ED] bg-purple-50/30 shadow-xs"
                      : "border-gray-200/80 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                        isSelected
                          ? "border-[#A186ED] bg-[#A186ED] text-white"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-800">
                        {rate.nombre}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {rate.plazoMin === rate.plazoMax
                          ? `Llega en ${rate.plazoMin} días hábiles`
                          : `Llega de ${rate.plazoMin} a ${rate.plazoMax} días hábiles`}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-bold ${
                      esEnvioGratis ? "text-emerald-600" : "text-gray-800"
                    }`}
                  >
                    {esEnvioGratis ? "Gratis" : formatPrice(rate.precio)}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Retiro en Puntos Propios */}
        {puntos.length > 0 && (
          <div className="space-y-2 pt-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5" /> Retiro en local / punto
            </p>
            <div className="space-y-2">
              {puntos.map((punto) => {
                const isSelected = seleccion?.idRef === punto.id;
                return (
                  <div
                    key={punto.id}
                    onClick={() => handleSelectPunto(punto)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? "border-[#A186ED] bg-purple-50/30 shadow-xs"
                        : "border-gray-200/80 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                          isSelected
                            ? "border-[#A186ED] bg-[#A186ED] text-white"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-800">
                          {punto.nombre}
                        </p>
                        {punto.direccion && (
                          <p className="text-[10px] text-gray-400">
                            {punto.direccion}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600">
                      {punto.costo === 0 || esEnvioGratis
                        ? "Gratis"
                        : formatPrice(punto.costo)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 🏷️ Total y Promoción Transferencia */}
      <div className="pt-3 border-t border-gray-100 space-y-2">
        <div className="flex justify-between items-baseline">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Total
          </span>
          <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
            {formatPrice(totalFinalConEnvio)}
          </span>
        </div>

        {/* Destacado Transferencia */}
        <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3 text-right">
          <p className="text-xs font-semibold text-emerald-900">
            Pagando con Transferencia:{" "}
            <span className="text-sm font-bold text-emerald-700">
              {formatPrice(transferPrice)}
            </span>
          </p>
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mt-0.5">
            ¡Ahorrás {formatPrice(totalFinalConEnvio * 0.10)} (10% OFF)! 💜
          </p>
        </div>
      </div>

      {/* 🚀 Botón de Checkout */}
      <div className="space-y-3 pt-1">
        <Button
          className={`w-full py-5 rounded-xl text-xs uppercase tracking-widest font-bold shadow-xs transition-all duration-200 h-auto ${
            isReadyToCheckout
              ? "bg-[#A186ED] hover:bg-[#8e6fed] text-white shadow-purple-100 active:scale-[0.99]"
              : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
          }`}
          disabled={!isReadyToCheckout}
          onClick={handleCheckout}
        >
          {seleccion ? "Iniciar Compra" : "Seleccioná una opción de envío"}
        </Button>

        <button
          onClick={openClearCartModal}
          className="w-full text-xs text-gray-400 hover:text-red-500 font-medium transition-colors flex items-center justify-center gap-1.5 py-1"
        >
          <Trash2 className="w-3.5 h-3.5" /> Vaciar carrito
        </button>
      </div>
    </div>
  );
}