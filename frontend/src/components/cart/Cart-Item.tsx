"use client";

import React from "react";
import Image from "next/image";
import { CartItem as CartItemType } from "@/context/Cart-Context";
import { Trash2, Plus, Minus } from "lucide-react";

interface CartItemProps {
  item: CartItemType;
  processing: boolean;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  remove: (id: string) => void;
}

export default function CartItem({
  item,
  processing,
  increment,
  decrement,
  remove,
}: CartItemProps) {
  // Formateador de moneda de Argentina
  const formatPrice = (price: number | undefined | null) => {
    if (typeof price !== "number" || isNaN(price)) return "$0";

    return price.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    });
  };

  const quantity = item?.quantity ?? 1;
  // Priorizamos siempre el precio real base del producto
  const precioUnitario = item?.precioOriginal || item?.variante?.producto?.precio || 0;
  const subtotalItem = precioUnitario * quantity;

  return (
    <li className="flex gap-4 py-5 border-b border-gray-100/80 relative group transition-all">
      {/* Imagen del producto */}
      <div className="relative w-20 h-24 sm:w-24 sm:h-28 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100">
        <Image
          src={item.variante?.producto?.imagenUrl || "/logozhyra.jpeg"}
          alt={item.variante?.producto?.nombre || "Producto"}
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Contenido e información */}
      <div className="flex flex-col flex-1 justify-between py-0.5">
        <div>
          {/* Título y Botón Eliminar */}
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">
              {item.variante?.producto?.nombre ?? "Producto sin nombre"}
            </h3>
            
            <button
              onClick={() => remove(item.id)}
              disabled={processing}
              className="text-gray-300 hover:text-red-500 transition-colors p-1 rounded-md -mr-1"
              title="Eliminar producto"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Variantes (Talle / Color) */}
          <div className="flex items-center gap-2 mt-1">
            {item.variante?.talle && (
              <span className="inline-flex items-center text-[10px] font-semibold text-gray-500 uppercase tracking-wider bg-gray-100 px-2 py-0.5 rounded-md">
                Talle: {item.variante.talle}
              </span>
            )}
            {item.variante?.color && (
              <span className="inline-flex items-center text-[10px] font-semibold text-gray-500 uppercase tracking-wider bg-gray-100 px-2 py-0.5 rounded-md">
                Color: {item.variante.color}
              </span>
            )}
          </div>

          {/* Precio Unitario */}
          <div className="mt-2">
            <p className="text-xs font-semibold text-[#A186ED]">
              {formatPrice(precioUnitario)}{" "}
              <span className="text-[10px] font-normal text-gray-400 uppercase">
                c/u
              </span>
            </p>
          </div>
        </div>

        {/* Subtotal y Selector de Cantidad */}
        <div className="flex justify-between items-end mt-3 pt-2 border-t border-gray-50">
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              Subtotal
            </span>
            <span className="text-sm font-bold text-gray-900">
              {formatPrice(subtotalItem)}
            </span>
          </div>

          {/* Selector de cantidad */}
          <div className="flex items-center bg-gray-50 border border-gray-200/80 rounded-lg p-0.5 shadow-xs">
            <button
              onClick={() => decrement(item.id)}
              disabled={processing || quantity <= 1}
              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-white hover:text-gray-800 rounded-md transition-all disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <Minus className="w-3 h-3" />
            </button>

            <span className="w-8 text-center text-xs font-bold text-gray-800">
              {quantity}
            </span>

            <button
              onClick={() => increment(item.id)}
              disabled={processing}
              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-white hover:text-gray-800 rounded-md transition-all disabled:opacity-30"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}