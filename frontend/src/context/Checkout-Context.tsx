"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/Cart-Context";

export type MetodoPago =
  | "MERCADO_PAGO"
  | "TRANSFERENCIA"
  | "GO_CUOTAS"
  | "UALA"
  | "";

export type DeliveredType = "HOME_DELIVERY" | "PICKUP";

export interface CuponAplicado {
  id: string;
  codigo: string;
  tipo: "PORCENTAJE" | "MONTO_FIJO";
  valor: number;
}

export interface CheckoutFormData {
  email: string;
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  calle: string;
  numero: string;
  piso?: string;
  depto?: string;
  ciudad: string;
  provincia: string;
  codigoPostal: string;
  metodoEnvio: string;
  costoEnvio: number;
  deliveredType: DeliveredType;
  metodoPago: MetodoPago;
  notasEntrega: string;
  cuponCodigo?: string;
}

interface CheckoutContextType {
  step: number;
  formData: CheckoutFormData;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: Partial<CheckoutFormData>) => void;
  resetFormData: () => void;
  isStep1Valid: boolean;
  subtotal: number;
  descuento: number;
  descuentoTransferencia: number; // Exportamos el descuento para renderizarlo si hace falta
  totalFinal: number;
  cuponAplicado: CuponAplicado | null;
  setCuponAplicado: (cupon: CuponAplicado | null) => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(
  undefined
);

export const CheckoutProvider = ({ children }: { children: ReactNode }) => {
  const searchParams = useSearchParams();
  const { subtotal, descuentoTotal } = useCart();

  const [cuponAplicado, setCuponAplicado] = useState<CuponAplicado | null>(
    null
  );

  const initialValues: CheckoutFormData = {
    email: "",
    nombre: "",
    apellido: "",
    dni: "",
    telefono: "",
    calle: "",
    numero: "",
    piso: "",
    depto: "",
    ciudad: "",
    provincia: "",
    codigoPostal: "",
    notasEntrega: "",
    metodoEnvio: searchParams.get("shippingName") || "A convenir",
    costoEnvio: Number(searchParams.get("shippingCost")) || 0,
    deliveredType:
      searchParams.get("shippingType") === "HOME_DELIVERY" ||
      searchParams.get("shippingType") === "PICKUP"
        ? (searchParams.get("shippingType") as DeliveredType)
        : "PICKUP",
    metodoPago: "", // Arranca vacío -> SIN DESCUENTO
    cuponCodigo: "",
  };

  const [formData, setFormData] = useState<CheckoutFormData>(initialValues);

  const updateFormData = (data: Partial<CheckoutFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const resetFormData = () => {
    setFormData(initialValues);
  };

  useEffect(() => {
    updateFormData({ cuponCodigo: cuponAplicado?.codigo || "" });
  }, [cuponAplicado]);

  const [step, setStep] = useState(1);
  const nextStep = () => setStep(2);
  const prevStep = () => setStep(1);

  const isStep1Valid =
    formData.nombre.trim() !== "" &&
    formData.dni.length > 6 &&
    formData.telefono.trim() !== "" &&
    formData.calle.trim() !== "" &&
    formData.provincia !== "" &&
    formData.metodoEnvio !== "";

  // --- CÁLCULOS DINÁMICOS Y RIGUROSOS ---
  const subtotalBase = subtotal ?? 0;
  const descBase = descuentoTotal ?? 0;

  // 1. Cálculo de Cupón
  let montoDescuentoCupon = 0;
  if (cuponAplicado) {
    if (cuponAplicado.tipo === "PORCENTAJE") {
      montoDescuentoCupon = subtotalBase * (cuponAplicado.valor / 100);
    } else if (cuponAplicado.tipo === "MONTO_FIJO") {
      montoDescuentoCupon = cuponAplicado.valor;
    }
  }

  const baseParaDescuentoPago = Math.max(
    0,
    subtotalBase - descBase - montoDescuentoCupon
  );

  // 2. Descuento Transferencia (SOLO SI EL USUARIO ELIGIÓ "TRANSFERENCIA")
  const esTransferencia = formData.metodoPago === "TRANSFERENCIA";
  const descuentoTransferencia = esTransferencia
    ? baseParaDescuentoPago * 0.1
    : 0;

  // 3. Total Final recalculado
  const totalFinal = Math.max(
    0,
    baseParaDescuentoPago - descuentoTransferencia + (formData.costoEnvio || 0)
  );

  return (
    <CheckoutContext.Provider
      value={{
        step,
        formData,
        setStep,
        nextStep,
        prevStep,
        updateFormData,
        resetFormData,
        isStep1Valid,
        subtotal: subtotalBase,
        descuento: descBase + montoDescuentoCupon,
        descuentoTransferencia,
        totalFinal,
        cuponAplicado,
        setCuponAplicado,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context)
    throw new Error("useCheckout debe usarse dentro de un CheckoutProvider");
  return context;
};