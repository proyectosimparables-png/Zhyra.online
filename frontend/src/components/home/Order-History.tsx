"use client";

import { useEffect, useState, useCallback } from "react";
import { getUserHistorial, cancelarOrdenCliente } from "@/services/order-history-service";
import { HistorialResponse, HistorialOrden } from "@/types/orders";
import { ShoppingCart, AlertCircle, XCircle } from "lucide-react";
import Image from "next/image";

export default function HistorialCompras() {
  const [historial, setHistorial] = useState<HistorialOrden[]>([]);
  const [cantidad, setCantidad] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Estados para el Modal de Cancelación
  const [ordenACancelar, setOrdenACancelar] = useState<HistorialOrden | null>(null);
  const [motivoCancelacion, setMotivoCancelacion] = useState<string>("");
  const [cancelando, setCancelando] = useState<boolean>(false);

  const fetchHistorial = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getUserHistorial<HistorialResponse>();

      if (data) {
        setHistorial(data.historial || []);
        setCantidad(data.cantidad || 0);
      }
    } catch (err) {
      console.error("Error al cargar el historial:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistorial();
  }, [fetchHistorial]);

  // Manejador de la cancelación usando el servicio
  const handleConfirmarCancelacion = async () => {
    if (!ordenACancelar) return;

    try {
      setCancelando(true);

      // Usamos el apiClient centralizado
      await cancelarOrdenCliente(ordenACancelar.id, motivoCancelacion);

      setOrdenACancelar(null);
      setMotivoCancelacion("");
      await fetchHistorial();
    } catch (err: unknown) {
      const mensaje = err instanceof Error ? err.message : "Error al procesar la cancelación";
      alert(mensaje);
    } finally {
      setCancelando(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-color-dark italic">
        Cargando tus compras...
      </div>
    );
  }

  // ====================================================================
  // ESTADO VACÍO
  // ====================================================================
  if (historial.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] text-center space-y-4 px-4">
        <CartPulse />
        <h3 className="text-2xl font-bold text-[#6c5b7b] mt-4">
          ¡Tu historial está más limpio que nunca! 🛍️
        </h3>
        <p className="text-base text-gray-600 max-w-sm mx-auto leading-relaxed">
          ¿Qué estás esperando para darte ese gusto? Tu carrito se siente solo,
          ¡ve por tu primer producto antes de que vuele! 🚀
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-10 bg-soft-beige">
      <div className="w-full max-w-3xl bg-pastel-lilac p-6 rounded-2xl shadow-xl animate-fadeIn border-2 border-lilac">
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
          Mi Historial de Compras
        </h2>

        {/* Solo la cantidad de pedidos */}
        <div className="mb-6 flex justify-between items-center font-semibold text-color-dark bg-white/50 p-4 rounded-lg border border-lilac/30 shadow-sm">
          <span>Pedidos Realizados: {cantidad}</span>
          <span className="text-xs text-gray-500 font-normal italic">
            Tus pedidos recientes y su estado
          </span>
        </div>

        <div className="space-y-6">
          {historial.map((orden) => {
            const estadoNormalizado = orden.estado ? orden.estado.toUpperCase() : "PENDIENTE";
            const esCancelable = ["PENDIENTE", "PAGADO"].includes(estadoNormalizado);

            return (
              <div
                key={orden.id}
                className="bg-white rounded-lg p-5 shadow-sm border-l-8 border-lilac hover:shadow-md transition-all duration-300"
              >
                {/* Cabecera de la Orden */}
                <div className="flex justify-between border-b pb-3 mb-4 items-center">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-tighter">
                      Referencia
                    </span>
                    <span className="text-sm font-mono font-medium text-gray-700">
                      #{orden.id.slice(0, 8)}
                    </span>
                  </div>

                  {/* Badge de Estado */}
                  <div className="text-center">
                    <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-tighter">
                      Estado
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        estadoNormalizado === "CANCELADO"
                          ? "bg-red-100 text-red-700"
                          : estadoNormalizado === "PAGADO"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {estadoNormalizado}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-tighter">
                      Fecha de Compra
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {new Date(orden.createdAt).toLocaleDateString("es-AR")}
                    </span>
                  </div>
                </div>

                {/* Items de la Orden */}
                <div className="space-y-4">
                  {orden.items?.map((producto) => (
                    <div key={producto.id} className="flex items-center group">
                      {producto.imagenUrl && (
                        <div className="relative w-14 h-14 mr-4 shrink-0">
                          <Image
                            src={producto.imagenUrl}
                            alt={producto.nombre}
                            fill
                            className="rounded-md object-cover border border-gray-100 shadow-sm"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm group-hover:text-lilac transition-colors italic">
                          {producto.nombre}
                        </p>
                        <p className="text-xs text-gray-500">
                          {producto.cantidad} x $
                          {Number(producto.precio).toLocaleString("es-AR", {
                            minimumFractionDigits: 0,
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer de la Orden */}
                <div className="mt-5 pt-4 border-t flex justify-between items-center">
                  <div>
                    {esCancelable && (
                      <button
                        onClick={() => setOrdenACancelar(orden)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                      >
                        <XCircle className="w-4 h-4" />
                        Cancelar pedido
                      </button>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold text-gray-400 block uppercase">
                      Monto Final
                    </span>
                    <span className="text-xl font-black text-lilac-dark">
                      $
                      {Number(orden.total).toLocaleString("es-AR", {
                        minimumFractionDigits: 0,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL DE CONFIRMACIÓN DE CANCELACIÓN */}
      {ordenACancelar && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-gray-100 animate-fadeIn">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-bold">¿Cancelar este pedido?</h3>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed">
              Estás a punto de cancelar la orden{" "}
              <span className="font-mono font-semibold text-gray-800">
                #{ordenACancelar.id.slice(0, 8)}
              </span>
              . Se repondrá el stock de los productos seleccionados.
            </p>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Motivo de cancelación (opcional)
              </label>
              <textarea
                value={motivoCancelacion}
                onChange={(e) => setMotivoCancelacion(e.target.value)}
                placeholder="Escribe aquí si tuviste algún inconveniente..."
                className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-700"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                disabled={cancelando}
                onClick={() => setOrdenACancelar(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                Volver
              </button>
              <button
                disabled={cancelando}
                onClick={handleConfirmarCancelacion}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
              >
                {cancelando ? "Procesando..." : "Confirmar Cancelación"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CartPulse() {
  return (
    <div className="relative flex items-center justify-center p-4">
      <ShoppingCart className="h-16 w-16 text-[#7b5ca2] animate-bounce z-10" />
      <div className="absolute h-20 w-20 rounded-full bg-[#7b5ca2]/20 animate-ping"></div>
    </div>
  );
}