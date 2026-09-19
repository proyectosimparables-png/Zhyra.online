"use client";

import React, { Suspense } from "react";
import { CheckoutProvider, useCheckout } from "@/context/Checkout-Context";
import Step1Datos from "./Step-1-Data";
import Step2Pago from "./Step-2-Payment";
import OrderSummary from "./Order-Summary";
import Image from "next/image";
import Link from "next/dist/client/link";

const CheckoutContent: React.FC = () => {
  const { step } = useCheckout();

  return (
    <div className="min-h-screen bg-[#FAFCEF] font-sans text-[#4A4A4A]">
      <header className="py-10 flex flex-col items-center bg-transparent">
        <Link href="/">
                <div className="h-20 w-20 md:h-24 md:w-24 rounded-full overflow-hidden border-2 border-purple-100 shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300 bg-black flex items-center justify-center p-1">
                  <Image
                    src="/logozhyra.jpeg"
                    alt="Zhyra Logo"
                    width={100}
                    height={100}
                    priority
                    className="object-cover rounded-full"
                  />
                </div>
              </Link>

        {/* Stepper Visual */}
        <div className="relative flex items-center justify-between w-full max-w-md px-6">
          <div className="absolute top-4 left-10 right-10 h-px bg-gray-300 z-0"></div>

          {[
            { label: "Carrito", icon: "✓" },
            { label: "Entrega", icon: "🚚" },
            { label: "Pago", icon: "💳" },
          ].map((item, index) => {
            const stepNum = index + 1;
            // Lógica visual del stepper
            const showCheck = stepNum === 1 || (stepNum === 2 && step === 2);
            const isHighlighted =
              (stepNum === 2 && step === 1) || (stepNum === 3 && step === 2);
            const isFuture = stepNum === 3 && step === 1;

            return (
              <div
                key={index}
                className="flex flex-col items-center z-10 bg-[#fafcef] px-3"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                    isHighlighted || showCheck
                      ? "border-gray-800 text-gray-800"
                      : "border-gray-300 text-gray-400"
                  }`}
                >
                  <span
                    className={`text-sm grayscale ${isFuture ? "opacity-30" : "opacity-100"}`}
                  >
                    {showCheck ? "✓" : item.icon}
                  </span>
                </div>
                <span
                  className={`text-[10px] uppercase mt-2 tracking-widest ${
                    isHighlighted
                      ? "font-bold text-gray-800"
                      : "text-gray-400 font-normal"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </header>

      <main className="container mx-auto px-6 max-w-6xl pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7">
            {/* Renderizado condicional basado en el context */}
            {step === 1 ? <Step1Datos /> : <Step2Pago />}
          </div>

          <aside className="lg:col-span-5">
            <div className="sticky top-10">
              <OrderSummary />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default function CheckoutWizard() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#faf5e5] flex items-center justify-center">
          Cargando...
        </div>
      }
    >
      <CheckoutProvider>
        <CheckoutContent />
      </CheckoutProvider>
    </Suspense>
  );
}
