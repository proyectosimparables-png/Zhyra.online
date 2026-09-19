"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/Auth-Context";
import { useCart } from "@/context/Cart-Context";
import { useCheckout, MetodoPago } from "@/context/Checkout-Context";
import toast from "react-hot-toast";
import {
  createOrder,
  createMPPreference,
  // createGoCuotasPayment, // 🔴 GoCuotas deshabilitado
} from "@/services/payments-service";
import {
  ChevronRight,
  Mail,
  MessageSquare,
  Wallet,
  ExternalLink,
  Store,
  FileText,
  Loader2,
  CheckCircle2,
  CreditCard,
  Sparkles,
  Edit2,
} from "lucide-react";
import type { OrderPayload, OrderResponse } from "@/types/orders";

const Step2Pago: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const { formData, updateFormData, prevStep, totalFinal } = useCheckout();

  const [loading, setLoading] = useState<boolean>(false);
  const [showNotes, setShowNotes] = useState<boolean>(false);

  // --- ESTADOS PARA EL VIGILANTE (POLLING) ---
  const [isCheckingPayment, setIsCheckingPayment] = useState<boolean>(false);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 1. 🔥 SOLUCIÓN AL BUG: Resetear el método de pago al montar el componente
  useEffect(() => {
    updateFormData({ metodoPago: "" });
  }, []);

  // --- EFECTO DE VIGILANCIA (POLLING DE PAGO) ---
  useEffect(() => {
    if (isCheckingPayment && activeOrderId) {
      intervalRef.current = setInterval(async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/ordenes/${activeOrderId}`,{
            credentials: "include"
            }
          );
          if (!response.ok) return;

          const orderData = await response.json();

          if (orderData.estado === "PAGADO") {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setIsCheckingPayment(false);

            toast.success("¡Pago confirmado con éxito!");
            await clearCart();
            router.push(`/payment-success?orderId=${activeOrderId}`);
          }
        } catch (error) {
          console.error("Error vigilando pago:", error);
        }
      }, 3000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isCheckingPayment, activeOrderId, router, clearCart]);

  const handlePaymentSelect = (metodo: MetodoPago): void => {
    updateFormData({ metodoPago: metodo });
  };

  const finalizarCompra = async (): Promise<void> => {
    if (!user?.id) {
      toast.error("Debes iniciar sesión para finalizar la compra");
      return;
    }

    if (!formData.metodoPago) {
      toast.error("Por favor, selecciona un medio de pago");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Procesando tu pedido...");

    try {
      const orderPayload: OrderPayload = {
        userId: user.id,
        emailContacto: formData.email,
        nombreDestinatario: formData.nombre,
        apellidoDestinatario: formData.apellido,
        dniDestinatario: formData.dni,
        telefonoDestinatario: formData.telefono,
        metodoEnvio: formData.metodoEnvio,
        costoEnvio: Number(formData.costoEnvio),
        codigoPostal: formData.codigoPostal,
        provincia: formData.provincia,
        localidad: formData.ciudad,
        calle: formData.calle,
        numero: formData.numero,
        piso: formData.piso || undefined,
        departamento: formData.depto || undefined,
        metodoPago: formData.metodoPago,
        notasEntrega: formData.notasEntrega || "",
        cuponCodigo: formData.cuponCodigo || undefined,
        
      };

      const order: OrderResponse = await createOrder(orderPayload);
      setActiveOrderId(order.id);

      if (formData.metodoPago === "MERCADO_PAGO") {
        const payment = await createMPPreference(order.id);
        toast.success("Abriendo Mercado Pago...", { id: toastId });

        const mpWindow = window.open(
          payment.init_point,
          "_blank",
          "noopener,noreferrer",
        );

        if (!mpWindow) {
          toast.error("Ventana emergente bloqueada. Por favor, habilitala.");
        }
        setIsCheckingPayment(true);
      /*
      // 🔴 GoCuotas deshabilitado
      } else if (formData.metodoPago === "GO_CUOTAS") {
        const payment = await createGoCuotasPayment(order.id);
        toast.success("Abriendo GoCuotas...", { id: toastId });

        const goWindow = window.open(
          payment.url,
          "_blank",
          "noopener,noreferrer",
        );

        if (!goWindow) {
          toast.error("Ventana emergente bloqueada.");
        }
        setIsCheckingPayment(true);
      */
      } else {
        toast.success("¡Pedido realizado con éxito!", { id: toastId });
       // router.push(`/order-success/${order.id}`);
        clearCart();
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Error inesperado";
      toast.error(msg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (val: number): string =>
    val.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    });

  const mediosDePago = [
    {
      id: "TRANSFERENCIA" as MetodoPago,
      label: "Transferencia / Depósito",
      subtitle: "10% de descuento automático en tu compra",
      extra: "10% OFF",
      icon: <Wallet className="w-5 h-5 text-[#A186ED]" />,
      badgeClass: "bg-purple-100 text-[#A186ED] font-bold border border-purple-200",
    },
    {
      id: "MERCADO_PAGO" as MetodoPago,
      label: "Mercado Pago",
      subtitle: "Tarjetas de crédito, débito o dinero en cuenta",
      extra: "3 CUOTAS SIN INTERÉS",
      icon: <ExternalLink className="w-5 h-5 text-blue-500" />,
      badgeClass: "bg-blue-50 text-blue-600 font-bold border border-blue-200",
    },
  /*
  // 🔴 GoCuotas deshabilitado
  {
      id: "GO_CUOTAS" as MetodoPago,
      label: "Cuotas con Débito (GoCuotas)",
      subtitle: "Aboná en cuotas con cualquier tarjeta de débito",
      extra: "4 CUOTAS SIN INTERÉS",
      icon: (
        <div className="text-[10px] font-black border-2 border-pink-500 text-pink-500 px-1 rounded leading-tight">
          GO
        </div>
      ),
      badgeClass: "bg-pink-50 text-pink-600 font-bold border border-pink-200",
    },
  */
  ];

  return (
    <div className="w-full animate-in fade-in duration-300 text-[#4A4A4A] pb-10 font-sans">
      {/* Targetas de Resumen de Datos de Envío */}
      <div className="border border-gray-100 rounded-2xl mb-8 bg-white shadow-xs overflow-hidden divide-y divide-gray-100">
        <div className="p-4 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3 text-xs font-medium text-gray-600">
            <Mail className="w-4 h-4 text-[#A186ED]" /> {formData.email}
          </div>
        </div>

        <div className="p-4 flex items-start justify-between hover:bg-gray-50/30 transition-colors">
          <div className="flex gap-3.5">
            <Store className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <div className="text-xs">
              <p className="font-bold text-gray-800">{formData.metodoEnvio}</p>
              <p className="text-[#A186ED] font-bold mt-0.5">
                {formData.costoEnvio === 0
                  ? "Gratis"
                  : formatPrice(formData.costoEnvio || 0)}
              </p>
            </div>
          </div>
          <button
            onClick={prevStep}
            className="text-[10px] font-bold uppercase text-gray-400 hover:text-[#A186ED] flex items-center gap-1 transition-colors"
          >
            <Edit2 className="w-3 h-3" /> Editar
          </button>
        </div>

        <div className="p-4 flex items-start justify-between hover:bg-gray-50/30 transition-colors">
          <div className="flex gap-3.5">
            <FileText className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <div className="text-xs text-gray-600 space-y-0.5">
              <p className="font-bold text-gray-400 uppercase text-[9px] tracking-widest mb-1">
                Dirección de entrega:
              </p>
              <p className="font-semibold text-gray-800 capitalize">
                {formData.nombre} {formData.apellido}
              </p>
              <p>
                {formData.calle} {formData.numero} {formData.piso || ""}{" "}
                {formData.depto || ""}
              </p>
              <p>
                {formData.ciudad}, {formData.provincia}
              </p>
            </div>
          </div>
          <button
            onClick={prevStep}
            className="text-[10px] font-bold uppercase text-gray-400 hover:text-[#A186ED] flex items-center gap-1 transition-colors"
          >
            <Edit2 className="w-3 h-3" /> Editar
          </button>
        </div>

        <div className="p-4">
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="flex items-center gap-3 w-full text-left"
          >
            <MessageSquare className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-600 font-medium hover:text-[#A186ED] transition-colors">
              {formData.notasEntrega
                ? "Ver nota para la entrega"
                : "Agregar nota al pedido"}
            </span>
          </button>
          {showNotes && (
            <textarea
              className="w-full mt-3 p-3 border border-gray-200 text-xs focus:outline-none focus:border-[#A186ED] focus:ring-2 focus:ring-[#A186ED]/20 bg-gray-50 rounded-xl resize-none transition-all placeholder:text-gray-300"
              placeholder="¿Instrucciones especiales para el envío?"
              value={formData.notasEntrega || ""}
              onChange={(e) =>
                updateFormData({ notasEntrega: e.target.value })
              }
              rows={3}
            />
          )}
        </div>
      </div>

      {/* Bloque de Polling (Procesando Pago) */}
      {isCheckingPayment ? (
        <div className="bg-purple-50/60 border border-[#A186ED]/40 rounded-2xl p-8 text-center mb-8 animate-pulse shadow-xs">
          <Loader2 className="w-10 h-10 animate-spin text-[#A186ED] mx-auto mb-4" />
          <h4 className="font-bold text-gray-800 uppercase text-xs tracking-widest">
            Aguardando la confirmación del pago...
          </h4>
          <p className="text-xs text-gray-500 mt-2 max-w-sm mx-auto leading-relaxed">
            Completá la operación en la pestaña de la pasarela. Esta pantalla se redirigirá automáticamente.
          </p>
        </div>
      ) : (
        <>
          <h3 className="text-[11px] font-bold mb-4 uppercase tracking-[0.15em] text-gray-400 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#A186ED]" />
            Seleccioná un medio de pago
          </h3>

          <div className="space-y-3 mb-8">
            {mediosDePago.map((medio) => {
              const active = formData.metodoPago === medio.id;
              return (
                <div
                  key={medio.id}
                  onClick={() => handlePaymentSelect(medio.id)}
                  className={`p-4 cursor-pointer border rounded-2xl transition-all duration-200 flex items-center justify-between ${
                    active
                      ? "border-[#A186ED] bg-purple-50/30 ring-2 ring-[#A186ED]/20 shadow-xs"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        active ? "border-[#A186ED] bg-[#A186ED]" : "border-gray-300"
                      }`}
                    >
                      {active && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5 mb-1">
                        {medio.icon}
                        <span className="text-xs font-bold text-gray-800">
                          {medio.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-gray-400 font-medium">
                          {medio.subtitle}
                        </span>
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-full uppercase tracking-tight ${medio.badgeClass}`}
                        >
                          {medio.extra}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      active ? "text-[#A186ED] translate-x-1" : "text-gray-300"
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Botón de Finalización */}
      <button
        onClick={finalizarCompra}
        disabled={loading || isCheckingPayment || !formData.metodoPago}
        className="w-full bg-[#A186ED] text-white py-4 rounded-xl font-bold text-xs uppercase tracking-[0.25em] hover:bg-[#8e70e3] transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed shadow-sm active:scale-[0.99] flex justify-center items-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Procesando pedido...
          </>
        ) : isCheckingPayment ? (
          "Esperando Confirmación..."
        ) : (
          <>
            <Sparkles className="w-4 h-4" /> Finalizar Compra
          </>
        )}
      </button>
    </div>
  );
};

export default Step2Pago;
