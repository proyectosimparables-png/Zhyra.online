"use client";

import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronDown, ArrowLeft, Menu, Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { AuthButton } from "./Auth-Button";
import { CartButton } from "./Cart-Button";
import { SearchInput } from "../search/Search-Input";
import { useState, useEffect, useCallback, useMemo } from "react";

import { SeccionType, CategoriaType } from "@/types/products";
import { getSecciones } from "@/services/products-service";

interface MenuItem {
  label: string;
  path?: string;
  sub?: MenuItem[];
}

// Links estáticos de la aplicación (se mantienen intactos)
const STATIC_BUY_HELP: MenuItem = {
  label: "¿Cómo comprar?",
  sub: [
    { label: "Guía de Compra", path: "/how-to-buy" },
    { label: "Políticas de Compra", path: "/privacy-policy" },
    { label: "Preguntas Frecuentes", path: "/faq" },
  ],
};

const DIRECT_LINKS: MenuItem[] = [
  { label: "¿Quiénes Somos?", path: "/about-us" },
  { label: "Dejanos tu experiencia", path: "/comment" },
  { label: "Z-Club ⭐", path: "/z-club" },

];

export const NavbarMobile = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Estados para datos dinámicos
  const [secciones, setSecciones] = useState<SeccionType[]>([]);
  const [loading, setLoading] = useState(true);

  // Convierte recursivamente Categorías y Subcategorías del backend a MenuItem[]
  const mapCategoriaToMenuItem = useCallback((cat: CategoriaType, parentPath: string): MenuItem => {
    const currentPath = `${parentPath}/${cat.slug}`;
    const hasSub = cat.subcategorias && cat.subcategorias.length > 0;

    if (!hasSub) {
      return {
        label: cat.nombre,
        path: currentPath,
      };
    }

    return {
      label: cat.nombre,
      sub: [
        { label: `Ver todo en ${cat.nombre}`, path: currentPath },
        ...cat.subcategorias!.map((sub) => mapCategoriaToMenuItem(sub, currentPath)),
      ],
    };
  }, []);

  // Construye la estructura dinámica completa del menú
  const fullMenu = useMemo<MenuItem[]>(() => {
    const productosSubMenu: MenuItem[] = [
      { label: "Ver todos los productos", path: "/productos" },
    ];

    secciones.forEach((sec) => {
      const secPath = `/${sec.slug}`;
      const hasCats = sec.categorias && sec.categorias.length > 0;

      if (!hasCats) {
        productosSubMenu.push({
          label: sec.nombre,
          path: secPath,
        });
      } else {
        productosSubMenu.push({
          label: sec.nombre,
          sub: [
            { label: `Ver todo en ${sec.nombre}`, path: secPath },
            ...sec.categorias!.map((cat) => mapCategoriaToMenuItem(cat, secPath)),
          ],
        });
      }
    });

    return [
      {
        label: "Productos",
        sub: productosSubMenu,
      },
      STATIC_BUY_HELP,
      ...DIRECT_LINKS,
    ];
  }, [secciones, mapCategoriaToMenuItem]);

  // Manejo de la pila de menú (Navegación tipo Drill-Down)
  const [menuStack, setMenuStack] = useState<MenuItem[][]>([fullMenu]);

  useEffect(() => {
    setMounted(true);

    const loadData = async () => {
      try {
        setLoading(true);
        const data = await getSecciones();
        setSecciones(data || []);
      } catch (error) {
        console.error("Error al cargar secciones en NavbarMobile:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Sincroniza la pila del menú cuando los datos dinámicos terminan de cargar
  useEffect(() => {
    setMenuStack([fullMenu]);
  }, [fullMenu]);

  // Al cerrar el Sheet, resetea la pila al menú principal después de la animación
  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => setMenuStack([fullMenu]), 300);
      return () => clearTimeout(timer);
    }
  }, [open, fullMenu]);

  const currentMenu = menuStack[menuStack.length - 1];

  const handleItemClick = (item: MenuItem) => {
    if (item.sub) {
      setMenuStack((prev) => [...prev, item.sub!]);
    } else if (item.path) {
      setOpen(false);
      router.push(item.path);
    }
  };

  const goBack = () => {
    if (menuStack.length > 1) {
      setMenuStack((prev) => prev.slice(0, -1));
    }
  };

  // ✅ PREVENCIÓN DE ERROR DE HIDRATACIÓN (Coincide con el HTML inicial de servidor)
  if (!mounted) {
    return (
      <div className="md:hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-[#FAFCEF]">
          <button aria-label="Abrir menú" className="p-1 outline-none">
            <Menu className="h-6 w-6 text-[#7b5ca2]" />
          </button>
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
          <div className="flex items-center gap-2">
            <AuthButton />
            <CartButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="md:hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-[#FAFCEF]">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button aria-label="Abrir menú" className="p-1 outline-none">
              <Menu className="h-6 w-6 text-[#7b5ca2]" />
            </button>
          </SheetTrigger>

          <SheetContent
            side="left"
            className="w-75 p-0 flex flex-col bg-white border-none"
          >
            <SheetHeader className="p-4 border-b border-gray-100">
              <SheetTitle className="text-[#7b5ca2] flex items-center gap-2">
                {menuStack.length > 1 ? (
                  <button
                    onClick={goBack}
                    className="flex items-center gap-2 text-sm font-bold outline-none"
                  >
                    <ArrowLeft className="h-4 w-4" /> Volver
                  </button>
                ) : (
                  "Menú"
                )}
              </SheetTitle>
            </SheetHeader>

            <div className="px-4 py-3">
              <SearchInput onResultClick={() => setOpen(false)} />
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading && menuStack.length === 1 ? (
                <div className="flex items-center justify-center p-8 text-[#7b5ca2]">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  <span>Cargando menú...</span>
                </div>
              ) : (
                <ul className="divide-y divide-gray-50">
                  {currentMenu.map((item, index) => {
                    const isActive = item.path === pathname;

                    return (
                      <li key={`${item.label}-${index}`}>
                        {!item.sub && item.path ? (
                          <Link
                            href={item.path}
                            onClick={() => setOpen(false)}
                            className={`flex items-center justify-between px-5 py-4 text-[#7b5ca2] transition-colors
                              ${isActive ? "bg-[#f3eefb] font-bold" : "active:bg-[#f3eefb]"}`}
                          >
                            <span className="text-[16px]">{item.label}</span>
                          </Link>
                        ) : (
                          <button
                            onClick={() => handleItemClick(item)}
                            className="w-full flex items-center justify-between px-5 py-4 text-[#7b5ca2] active:bg-[#f3eefb] transition-colors outline-none"
                          >
                            <span className="text-[16px]">{item.label}</span>
                            {item.sub && (
                              <ChevronDown className="h-4 w-4 -rotate-90 opacity-50" />
                            )}
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </SheetContent>
        </Sheet>

        <Link href="/" className="flex-1 flex justify-center">
          <Image
            src="/logozhyra.jpeg"
            alt="Zhyra Logo"
            width={120}
            height={30}
            priority
          />
        </Link>

        <div className="flex items-center gap-2">
          <AuthButton />
          <CartButton />
        </div>
      </div>
    </div>
  );
};