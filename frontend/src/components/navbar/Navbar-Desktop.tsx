"use client";

import Image from "next/image";
import Link from "next/link";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, Loader2 } from "lucide-react";
import { CartButton } from "./Cart-Button";
import { AuthButton } from "./Auth-Button";
import { SearchInput } from "../search/Search-Input";
import { useState, useEffect } from "react";

import { SeccionType, CategoriaType } from "@/types/products";
import { getSecciones } from "@/services/products-service";

// Componente helper recursivo para subcategorías anidadas
const CategoryMenuItem = ({ 
  categoria, 
  parentPath, 
  closeAll 
}: { 
  categoria: CategoriaType; 
  parentPath: string; 
  closeAll: () => void;
}) => {
  const currentPath = `${parentPath}/${categoria.slug}`;
  const hasChildren = categoria.subcategorias && categoria.subcategorias.length > 0;

  if (!hasChildren) {
    return (
      <DropdownMenu.Item className="outline-none" onClick={closeAll}>
        <Link
          href={currentPath}
          className="flex w-full px-4 py-2 hover:bg-[#f3eefb] text-[#4e3f73] transition-colors"
        >
          {categoria.nombre}
        </Link>
      </DropdownMenu.Item>
    );
  }

  return (
    <DropdownMenu.Sub>
      <DropdownMenu.SubTrigger className="px-4 py-2 hover:bg-[#f3eefb] cursor-pointer flex justify-between items-center outline-none font-medium text-[#4e3f73]">
        {categoria.nombre}
        <ChevronDown className="ml-2 h-3 w-3 -rotate-90" />
      </DropdownMenu.SubTrigger>
      <DropdownMenu.SubContent className="bg-[#fafcef] shadow-lg rounded-md py-2 text-sm text-[#7b5ca2] min-w-52 border border-purple-50">
        <DropdownMenu.Item className="outline-none" onClick={closeAll}>
          <Link
            href={currentPath}
            className="flex w-full px-4 py-2 hover:bg-[#f3eefb] font-bold text-[#4e3f73]"
          >
            Ver todo en {categoria.nombre}
          </Link>
        </DropdownMenu.Item>
        <DropdownMenu.Separator className="h-px bg-purple-50 my-1" />
        {categoria.subcategorias?.map((subCat) => (
          <CategoryMenuItem
            key={subCat.id || subCat.slug}
            categoria={subCat}
            parentPath={currentPath}
            closeAll={closeAll}
          />
        ))}
      </DropdownMenu.SubContent>
    </DropdownMenu.Sub>
  );
};

export const NavbarDesktop = () => {
  const [productsOpen, setProductsOpen] = useState(false);
  const [howToBuyOpen, setHowToBuyOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Estados para datos dinámicos del backend
  const [secciones, setSecciones] = useState<SeccionType[]>([]);
  const [loadingSecciones, setLoadingSecciones] = useState(true);

  useEffect(() => {
    setMounted(true);

    // Carga de secciones, categorías y subcategorías anidadas
    const loadNavigationData = async () => {
      try {
        setLoadingSecciones(true);
        const data = await getSecciones();
        setSecciones(data || []);
    
      } catch (error) {
        console.error("Error al cargar secciones en NavbarDesktop:", error);
      } finally {
        setLoadingSecciones(false);
      }
    };

    loadNavigationData();
  }, []);

  const closeAll = () => {
    setProductsOpen(false);
    setHowToBuyOpen(false);
  };

  if (!mounted) {
    return <div className="hidden md:block w-full h-36 bg-[#fafcef]/80" />;
  }

  return (
    <div className="hidden md:block w-full relative z-50">
      {/* PARTE SUPERIOR */}
      <div className="bg-[#fafcef]/80 backdrop-blur-md border-b border-white/20 relative z-30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-24 relative">
            <div className="hidden md:flex items-center gap-2">
              <SearchInput />
            </div>

            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
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
            </div>

            <div className="flex items-center gap-4">
              <AuthButton />
              <CartButton />
            </div>
          </div>
        </div>
      </div>

      {/* BARRA DE NAVEGACIÓN DINÁMICA */}
      <nav className="bg-[#fafcef]/90 backdrop-blur-sm justify-center items-center gap-8 py-3 text-[17px] text-[#7b5ca2] font-love-ya tracking-wide flex shadow-sm relative z-20">
        
        {/* DROPDOWN DINÁMICO DE PRODUCTOS */}
        <DropdownMenu.Root open={productsOpen} onOpenChange={setProductsOpen}>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center hover:text-[#4e3f73] transition-all duration-200 hover:scale-110 outline-none">
              Productos <ChevronDown className="ml-1 h-4 w-4" />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content
            className="bg-[#fafcef] backdrop-blur-xl shadow-xl rounded-md py-2 text-sm text-[#7b5ca2] min-w-64 z-60 animate-in fade-in zoom-in-95 duration-200 border border-purple-50"
            sideOffset={8}
          >
            <DropdownMenu.Item className="outline-none" onClick={closeAll}>
              <Link
                href="/productos"
                className="flex w-full px-4 py-2 hover:bg-[#f3eefb] font-bold text-[#4e3f73]"
              >
                Ver todos los productos
              </Link>
            </DropdownMenu.Item>

            <DropdownMenu.Separator className="h-px bg-purple-100/50 my-1" />

            {/* ESTADO DE CARGA */}
            {loadingSecciones ? (
              <div className="flex items-center justify-center p-4 text-[#7b5ca2]">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span>Cargando categorías...</span>
              </div>
            ) : (
              secciones.map((seccion) => {
                const basePath = `/${seccion.slug}`;
                const hasCategorias = seccion.categorias && seccion.categorias.length > 0;

                if (!hasCategorias) {
                  return (
                    <DropdownMenu.Item
                      key={seccion.id || seccion.slug}
                      className="outline-none"
                      onClick={closeAll}
                    >
                      <Link
                        href={basePath}
                        className="flex w-full px-4 py-2 hover:bg-[#f3eefb] font-medium text-[#4e3f73]"
                      >
                        {seccion.nombre}
                      </Link>
                    </DropdownMenu.Item>
                  );
                }

                return (
                  <DropdownMenu.Sub key={seccion.id || seccion.slug}>
                    <DropdownMenu.SubTrigger className="px-4 py-2 hover:bg-[#f3eefb] cursor-pointer flex justify-between items-center outline-none font-semibold text-[#4e3f73]">
                      {seccion.nombre}
                      <ChevronDown className="ml-2 h-3 w-3 -rotate-90" />
                    </DropdownMenu.SubTrigger>
                    <DropdownMenu.SubContent className="bg-[#fafcef] shadow-lg rounded-md py-2 text-sm text-[#7b5ca2] min-w-56 border border-purple-50">
                      <DropdownMenu.Item className="outline-none" onClick={closeAll}>
                        <Link
                          href={basePath}
                          className="flex w-full px-4 py-2 hover:bg-[#f3eefb] font-bold text-[#4e3f73]"
                        >
                          Ver todo en {seccion.nombre}
                        </Link>
                      </DropdownMenu.Item>

                      <DropdownMenu.Separator className="h-px bg-purple-50 my-1" />

                      {seccion.categorias?.map((cat) => (
                        <CategoryMenuItem
                          key={cat.id || cat.slug}
                          categoria={cat}
                          parentPath={basePath}
                          closeAll={closeAll}
                        />
                      ))}
                    </DropdownMenu.SubContent>
                  </DropdownMenu.Sub>
                );
              })
            )}
          </DropdownMenu.Content>
        </DropdownMenu.Root>

        {/* LINKS DIRECTOS */}
        {[
          { n: "¿Quiénes Somos?", h: "/about-us" },
          { n: "Dejanos tu experiencia", h: "/comment" },
          { n: "Z-Club ⭐", h: "/z-club" },
        ].map((link) => (
          <Link
            key={link.h}
            href={link.h}
            className="hover:text-[#4e3f73] transition-all duration-200 hover:scale-110"
          >
            {link.n}
          </Link>
        ))}

        {/* ¿CÓMO COMPRAR? */}
        <DropdownMenu.Root open={howToBuyOpen} onOpenChange={setHowToBuyOpen}>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center hover:text-[#4e3f73] transition-all duration-200 hover:scale-110 outline-none">
              ¿Cómo comprar? <ChevronDown className="ml-1 h-4 w-4" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="bg-[#fafcef] shadow-xl rounded-md py-2 text-sm text-[#7b5ca2] min-w-52 z-50 border border-purple-50">
            {[
              { l: "Guía de Compra", h: "/how-to-buy" },
              { l: "Políticas de Compra", h: "/privacy-policy" },
              { l: "Preguntas", h: "/faq" },
            ].map((i) => (
              <DropdownMenu.Item
                key={i.h}
                className="outline-none"
                onClick={closeAll}
              >
                <Link
                  href={i.h}
                  className="flex w-full px-4 py-2 hover:bg-[#f3eefb]"
                >
                  {i.l}
                </Link>
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </nav>
    </div>
  );
};