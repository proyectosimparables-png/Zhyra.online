"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/Auth-Context";
import { useCheckout } from "@/context/Checkout-Context";
import ShippingSelector from "@/components/checkout/Shipping-Selector";
import { Info, ArrowRight } from "lucide-react";

const Step1Datos: React.FC = () => {
  const { user } = useAuth();
  const { formData, updateFormData, resetFormData, nextStep, isStep1Valid } = useCheckout();

  // EFECTO PARA ACTUALIZAR O SINO BARRER DATOS CUANDO EL USUARIO CAMBIA / SE DESLOGUEA
  useEffect(() => {
    if (user) {
      updateFormData({
        email: user.email || "",
        nombre: user.name?.split(" ")[0] || "",
        apellido: user.name?.split(" ").slice(1).join(" ") || "",
        calle: user.address || "",
      });
    } else {
      // Limpia todo si la sesión actual se cerró o cambió
      resetFormData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]); // Se ejecuta al cambiar de ID de usuario

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  const inputStyle =
    "w-full p-4 border border-gray-200 bg-white text-sm text-gray-600 focus:outline-none focus:border-[#A186ED] focus:ring-1 focus:ring-[#A186ED] transition-all placeholder-gray-300 rounded-sm";
  const sectionTitleStyle =
    "text-[11px] font-bold mb-4 uppercase text-gray-400 tracking-[0.2em]";

  return (
    <form 
      autoComplete="off" 
      onSubmit={(e) => e.preventDefault()}
      className="space-y-10 font-sans animate-in fade-in slide-in-from-bottom-2 duration-500"
    >
      {/* Input oculto engañabots/navegadores para forzar no autocompletar */}
      <input type="text" className="hidden" name="fake-username" />
      <input type="password" className="hidden" name="fake-password" />

      {/* Sección: Contacto e Identificación */}
      <section>
        <h3 className={sectionTitleStyle}>1. Identificación</h3>
        <div className="p-4 border border-[#A186ED]/20 bg-[#A186ED]/5 rounded-sm">
          <p className="text-[10px] text-[#A186ED] uppercase font-bold mb-1 tracking-wider">
            E-mail para confirmación de Zhyra.online
          </p>
          <p className="text-sm font-medium text-gray-700">
            {user?.email || formData.email || "Invitado"}
          </p>
        </div>
      </section>

      {/* Sección: Medio de Envío */}
      <section>
        <h3 className={sectionTitleStyle}>2. Método de Envío</h3>
        <ShippingSelector />
      </section>

      {/* Sección: Entrega */}
      <section className="space-y-4">
        <h3 className={sectionTitleStyle}>3. Datos de Entrega</h3>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            autoComplete="new-password"
            className={inputStyle}
            value={formData.nombre}
            onChange={handleChange}
          />
          <input
            type="text"
            name="apellido"
            placeholder="Apellido"
            autoComplete="new-password"
            className={inputStyle}
            value={formData.apellido}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="dni"
            placeholder="DNI / CUIL (para factura)"
            autoComplete="new-password"
            className={inputStyle}
            value={formData.dni}
            onChange={handleChange}
          />
          <input
            type="text"
            name="telefono"
            placeholder="Teléfono (WhatsApp)"
            autoComplete="new-password"
            className={inputStyle}
            value={formData.telefono}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <input
              type="text"
              name="calle"
              placeholder="Dirección / Calle"
              autoComplete="new-password"
              className={inputStyle}
              value={formData.calle}
              onChange={handleChange}
            />
          </div>
          <input
            type="text"
            name="numero"
            placeholder="Nro"
            autoComplete="new-password"
            className={inputStyle}
            value={formData.numero}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="codigoPostal"
            placeholder="C.P."
            autoComplete="new-password"
            className={inputStyle}
            value={formData.codigoPostal}
            onChange={handleChange}
          />
          <input
            type="text"
            name="ciudad"
            placeholder="Ciudad / Localidad"
            autoComplete="new-password"
            className={inputStyle}
            value={formData.ciudad}
            onChange={handleChange}
          />
        </div>

        <select
          name="provincia"
          className={inputStyle}
          value={formData.provincia}
          onChange={handleChange}
        >
          <option value="">Seleccionar Provincia</option>
          <option value="Buenos Aires">Buenos Aires</option>
          <option value="CABA">CABA</option>
          <option value="Córdoba">Córdoba</option>
          <option value="Santa Fe">Santa Fe</option>
          <option value="Mendoza">Mendoza</option>
          <option value="Tucumán">Tucumán</option>
          <option value="Entre Ríos">Entre Ríos</option>
          <option value="Salta">Salta</option>
          <option value="Misiones">Misiones</option>
          <option value="Chaco">Chaco</option>
          <option value="Corrientes">Corrientes</option>
          <option value="Santiago del Estero">Santiago del Estero</option>
          <option value="San Juan">San Juan</option>
          <option value="Jujuy">Jujuy</option>
          <option value="Río Negro">Río Negro</option>
          <option value="Neuquén">Neuquén</option>
          <option value="Formosa">Formosa</option>
          <option value="Chubut">Chubut</option>
          <option value="San Luis">San Luis</option>
          <option value="Catamarca">Catamarca</option>
          <option value="La Rioja">La Rioja</option>
          <option value="La Pampa">La Pampa</option>
          <option value="Santa Cruz">Santa Cruz</option>
          <option value="Tierra del Fuego">Tierra del Fuego</option>
        </select>
      </section>

      {/* Botón de Acción con efecto 3D y animación */}
      <div className="pt-4">
        {!isStep1Valid && (
          <p className="text-[10px] text-gray-400 text-center mb-4 flex items-center justify-center gap-1">
            <Info className="w-3 h-3 text-[#A186ED]" /> Completa todos los campos obligatorios para continuar
          </p>
        )}
        <button
          onClick={nextStep}
          disabled={!isStep1Valid}
          type="button"
          className="group w-full relative inline-flex items-center justify-center gap-2 bg-[#A186ED] text-white py-5 rounded-md text-xs font-bold uppercase tracking-[0.3em] shadow-[0_6px_0_0_#7d61ca] hover:shadow-[0_2px_0_0_#7d61ca] hover:translate-y-[4px] active:translate-y-[6px] active:shadow-none transition-all duration-150 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none disabled:translate-y-0 disabled:cursor-not-allowed"
        >
          Continuar al pago
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </form>
  );
};

export default Step1Datos;