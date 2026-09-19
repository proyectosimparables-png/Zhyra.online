"use client";

import CartItem from "./Cart-Item";
import CartSummary from "./Cart-Summary";
import { ModalConfirm } from "./Modal-Confirm";
import { ShoppingBag, ArrowLeft } from "lucide-react";

import toast from "react-hot-toast";
import { useCartActions } from "./Use-Cart-Actions";

export default function CartContent() {
  const { state, actions } = useCartActions();

  // Mostramos mensaje de carga si el carrito está vacío y se está cargando
  if (state.loading && state.cart.length === 0 && !state.initialCartLoaded) {
    return (
      <p className="p-6 text-center text-gray-500 animate-pulse font-medium">
        Cargando carrito de Zhyra.online...
      </p>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#4A4A4A] relative font-sans">
      <div className="p-4 flex-1 max-w-2xl mx-auto w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-gray-300 pb-2">
          <h2 className="text-lg font-light tracking-widest text-center flex-1 uppercase">
            Carrito de compras
          </h2>
          <button
            onClick={() => actions.router.push("/")}
            className="text-gray-400 hover:text-gray-800 text-2xl ml-4 transition-colors"
          >
            ×
          </button>
        </div>

        {/* ====================================================================
            ESTADO VACÍO: Carrito animado estilo Zhyra.online 🛒
           ==================================================================== */}
        {state.cart.length === 0 ? (
          <div className="text-center py-16 animate-in fade-in duration-500 flex flex-col items-center justify-center">
            {/* Animación del Carrito Emblema Zhyra */}
            <div className="mb-8 relative transition-transform hover:scale-105 duration-300">
              <div className="w-28 h-28 bg-[#A186ED]/10 rounded-full flex items-center justify-center border border-[#A186ED]/20 shadow-inner relative">
                <ShoppingBag className="w-14 h-14 text-[#A186ED] animate-bounce" />
                <span className="absolute top-2 right-2 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A186ED] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-[#A186ED]"></span>
                </span>
              </div>
            </div>

            <p className="text-gray-400 mb-2 text-sm uppercase tracking-[0.2em] font-semibold">
              Tu carrito está vacío
            </p>
            <p className="text-xs text-gray-400 mb-8 max-w-xs">
              ¡Descubre la nueva colección de Zhyra.online y llena tu carrito de estilo!
            </p>

            {/* Botón Estilo 3D Táctil */}
            <button
              onClick={() => actions.router.push("/")}
              className="group relative inline-flex items-center justify-center gap-2 bg-[#A186ED] text-white px-8 py-4 rounded-lg text-xs font-bold uppercase tracking-[0.2em] shadow-[0_6px_0_0_#7d61ca] hover:shadow-[0_2px_0_0_#7d61ca] hover:translate-y-[4px] active:translate-y-[6px] active:shadow-none transition-all duration-150"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Volver a la tienda
            </button>
          </div>
        ) : (
          <>
            {/* Lista de productos en el carrito */}
            <ul className="divide-y divide-gray-100">
              {state.cart.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  processing={state.processingItems[item.id] || false}
                  increment={actions.increment}
                  decrement={actions.decrement}
                  remove={(id) => actions.setModalDeleteId(id)}
                />
              ))}
            </ul>

            {/* Resumen del carrito: subtotal, descuento, total */}
            <CartSummary
              subtotal={state.subtotal}
              descuento={state.descuento}
              totalPrice={state.totalPrice}
              items={state.cart}
              postalCode={state.postalCode}
              setPostalCode={actions.setPostalCode}
              handleCheckout={actions.handleCheckout}
              openClearCartModal={() => actions.setModalClearOpen(true)}
              onShippingChange={actions.setShippingInfo}
            />
          </>
        )}
      </div>

      {/* Modal de confirmación para eliminar un producto */}
      <ModalConfirm
        open={Boolean(state.modalDeleteId)}
        title="Eliminar producto"
        message="¿Seguro que deseas eliminar este producto?"
        confirmText="Eliminar"
        onConfirm={async () => {
          if (state.modalDeleteId) {
            await actions.removeItem(state.modalDeleteId);
            actions.setModalDeleteId(null);
          }
        }}
        onCancel={() => actions.setModalDeleteId(null)}
      />

      {/* Modal de confirmación para vaciar el carrito */}
      <ModalConfirm
        open={state.modalClearOpen}
        title="Vaciar carrito"
        message="¿Seguro que deseas vaciar todo el carrito?"
        confirmText="Vaciar"
        onConfirm={async () => {
          await actions.clearCart();
          toast.success("Carrito vacío");
          actions.setModalClearOpen(false);
        }}
        onCancel={() => actions.setModalClearOpen(false)}
      />
    </div>
  );
}