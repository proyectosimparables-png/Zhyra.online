"use client";

import { useEffect, useState } from "react";
import {
  getComentarios,
  createComentario,
} from "@/services/comments-service";
import { Send, Heart } from "lucide-react";

type ComentarioBackend = {
  id: string | number;
  contenido: string;
  userId: string;
  user?: {
    name: string | null;
    email: string;
    image: string | null;
  };
};

type Comentario = {
  id: string | number;
  contenido: string;
  nombre: string;
  x: number;
  y: number;
  rotation: number;
};

export default function ZhyraExperience() {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [hovered, setHovered] = useState<string | number | null>(null);

  const [nombre, setNombre] = useState("");
  const [contenido, setContenido] = useState("");
  const [enviando, setEnviando] = useState(false);

  const [comentarioNuevo, setComentarioNuevo] = useState<{
    contenido: string;
    nombre: string;
  } | null>(null);

  const MAX_CHARS = 150;

  /*
   * 💜 Posiciones de los comentarios
   */
  const posiciones = [
    { x: 10, y: 12, rotation: -4 },
    { x: 78, y: 10, rotation: 4 },
    { x: 15, y: 70, rotation: 3 },
    { x: 80, y: 70, rotation: -4 },
    { x: 48, y: 8, rotation: -2 },
    { x: 5, y: 42, rotation: 4 },
    { x: 92, y: 42, rotation: -3 },
    { x: 50, y: 82, rotation: 2 },
  ];

  /*
   * 💜 Cargar comentarios
   */
  useEffect(() => {
    cargarComentarios();
  }, []);

  const cargarComentarios = async () => {
    try {
      const data = await getComentarios<ComentarioBackend[]>();

      const comentariosPosicionados: Comentario[] = (data || []).map(
        (comentario, index) => {
          const posicion = posiciones[index % posiciones.length];

          return {
            id: comentario.id,
            contenido: comentario.contenido,
            nombre: comentario.user?.name || "Anónima",
            x: posicion.x,
            y: posicion.y,
            rotation: posicion.rotation,
          };
        }
      );

      setComentarios(comentariosPosicionados);
    } catch (error) {
      console.error("Error al cargar comentarios:", error);
    }
  };

  /*
   * 💜 Enviar comentario
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!contenido.trim() || enviando) {
      return;
    }

    try {
      setEnviando(true);

      const nuevo = await createComentario<ComentarioBackend>(
        contenido,
        nombre
      );

      const nombreFinal = nombre.trim() || nuevo.user?.name || "Anónima";

      /*
       * ✨ Mostramos el comentario flotando detrás del formulario
       */
      setComentarioNuevo({
        contenido: nuevo.contenido,
        nombre: nombreFinal,
      });

      /*
       * Limpiamos formulario
       */
      setContenido("");
      setNombre("");

      /*
       * Después de la animación, agregamos el comentario a la lista.
       */
      setTimeout(() => {
        const posicion =
          posiciones[comentarios.length % posiciones.length];

        const comentarioAgregado: Comentario = {
          id: nuevo.id,
          contenido: nuevo.contenido,
          nombre: nombreFinal,
          x: posicion.x,
          y: posicion.y,
          rotation: posicion.rotation,
        };

        setComentarios((prev) => [...prev, comentarioAgregado]);
        setComentarioNuevo(null);

        /*
         * Mostramos automáticamente el comentario recién agregado.
         */
        setHovered(nuevo.id);

        setTimeout(() => {
          setHovered(null);
        }, 4000);
      }, 1400);
    } catch (error) {
      console.error("Error al enviar comentario:", error);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="w-full bg-[#faf7fc] px-4 py-16 overflow-hidden">
      {/* =====================================================
          💜 ENCABEZADO
      ====================================================== */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-purple-500 font-medium mb-4">
          Comunidad Zhyra
        </p>

        <h2 className="text-4xl md:text-5xl font-serif text-[#29212f]">
          Tu experiencia también es parte de Zhyra
        </h2>

        <p className="max-w-xl mx-auto mt-5 text-gray-500 leading-relaxed">
          Nos encanta conocer tu experiencia. Cada mensaje nos ayuda a seguir
          creciendo y construyendo esta comunidad. 💜
        </p>
      </div>

      {/* =====================================================
          💬 CONTENEDOR DE COMENTARIOS + FORMULARIO
      ====================================================== */}
      <div className="relative max-w-6xl mx-auto min-h-[700px]">
        {/* ===================================================
            💬 COMENTARIOS DE FONDO
        ==================================================== */}
        <div className="absolute inset-0">
          {comentarios.map((comentario, index) => (
            <div
              key={comentario.id}
              className="absolute hidden md:block w-52 lg:w-60 transition-all duration-300"
              style={{
                left: `${comentario.x}%`,
                top: `${comentario.y}%`,
                transform: `translate(-50%, -50%) rotate(${comentario.rotation}deg)`,
                zIndex: hovered === comentario.id ? 30 : 5,
              }}
              onMouseEnter={() => setHovered(comentario.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Contenedor flotante independiente para no romper la rotación */}
              <div
                className="animate-bounce"
                style={{
                  animationDuration: "5s",
                  animationDelay: `${index * 0.4}s`,
                }}
              >
                <div
                  className={`
                    relative
                    rounded-[28px]
                    bg-white/85
                    backdrop-blur-md
                    border border-purple-100
                    p-5
                    shadow-[0_15px_40px_rgba(100,70,120,0.10)]
                    transition-all
                    duration-300
                    ${hovered === comentario.id ? "scale-110 shadow-xl bg-white" : ""}
                  `}
                >
                  {/* 💜 Corazón */}
                  <Heart
                    size={15}
                    className="absolute right-4 top-4 text-purple-300 fill-purple-100"
                  />

                  {/* ⭐ Valoración */}
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-[11px] text-purple-400">
                        ★
                      </span>
                    ))}
                  </div>

                  {/* 💬 Comentario */}
                  <p className="text-sm text-gray-600 italic leading-relaxed">
                    “{comentario.contenido}”
                  </p>

                  {/* 👤 Nombre */}
                  <p className="mt-4 text-[10px] uppercase tracking-[0.2em] font-semibold text-purple-500">
                    {comentario.nombre}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* =================================================
              ✨ NUEVO COMENTARIO ANIMADO
          ================================================== */}
          {comentarioNuevo && (
            <div className="absolute left-1/2 top-1/2 z-40 w-56 -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-pulse">
              <div className="rounded-[28px] bg-white p-5 shadow-2xl border border-purple-100">
                <div className="flex gap-1 mb-3">
                  <span className="text-xs text-purple-400">
                    ★ ★ ★ ★ ★
                  </span>
                </div>

                <p className="text-sm text-gray-600 italic leading-relaxed">
                  “{comentarioNuevo.contenido}”
                </p>

                <p className="mt-4 text-[10px] uppercase tracking-[0.2em] font-semibold text-purple-500">
                  {comentarioNuevo.nombre}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* =====================================================
            💜 FORMULARIO CENTRAL
        ====================================================== */}
        <div className="relative z-20 min-h-[700px] flex items-center justify-center">
          <div className="relative w-full max-w-xl">
            {/* ✨ Luz detrás */}
            <div className="absolute -inset-6 rounded-[60px] bg-purple-200/20 blur-3xl" />

            <form
              onSubmit={handleSubmit}
              className="
                relative
                bg-white
                rounded-[40px]
                p-8
                md:p-10
                shadow-[0_25px_80px_rgba(70,45,90,0.14)]
                border
                border-purple-100
              "
            >
              {/* 💜 Icono */}
              <div className="flex justify-center mb-5">
                <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
                  <Heart
                    size={20}
                    className="text-purple-500 fill-purple-100"
                  />
                </div>
              </div>

              {/* 📝 Título */}
              <div className="text-center mb-8">
                <p className="text-[10px] uppercase tracking-[0.3em] text-purple-400 font-semibold">
                  Comunidad Zhyra
                </p>

                <h3 className="text-3xl md:text-4xl font-serif text-[#29212f] mt-2">
                  Queremos conocerte
                </h3>

                <p className="text-sm text-gray-400 mt-3 leading-relaxed">
                  Contanos qué te pareció tu experiencia con Zhyra. Tu mensaje
                  puede ayudar a otra mujer a elegir su próximo look. ✨
                </p>
              </div>

              {/* 👤 NOMBRE */}
              <div className="mb-5">
                <label className="block text-xs font-medium text-gray-500 mb-2 ml-2">
                  Tu nombre
                </label>

                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="¿Cómo querés que figure?"
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-purple-100
                    bg-[#faf7fc]
                    p-4
                    text-sm
                    text-purple-900
                    placeholder:text-purple-300
                    outline-none
                    transition
                    focus:ring-2
                    focus:ring-purple-200
                  "
                />
              </div>

              {/* 💬 MENSAJE */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2 ml-2">
                  Tu experiencia
                </label>

                <textarea
                  value={contenido}
                  onChange={(e) =>
                    setContenido(e.target.value.slice(0, MAX_CHARS))
                  }
                  rows={4}
                  placeholder="Contanos qué pensás..."
                  className="
                    w-full
                    rounded-3xl
                    border
                    border-purple-100
                    bg-[#faf7fc]
                    p-5
                    text-sm
                    text-purple-900
                    placeholder:text-purple-300
                    outline-none
                    resize-none
                    transition
                    focus:ring-2
                    focus:ring-purple-200
                  "
                />

                {/* Contador + botón */}
                <div className="flex justify-between items-center mt-2 px-2">
                  <span className="text-[11px] text-gray-300">
                    {contenido.length}/{MAX_CHARS}
                  </span>

                  <button
                    type="submit"
                    disabled={enviando || !contenido.trim()}
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-full
                      bg-[#6d4a7d]
                      hover:bg-[#593968]
                      px-6
                      py-3
                      text-sm
                      font-medium
                      text-white
                      shadow-md
                      transition-all
                      active:scale-95
                      disabled:opacity-40
                      disabled:cursor-not-allowed
                    "
                  >
                    <span>{enviando ? "Enviando..." : "Compartir"}</span>
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* =====================================================
          💜 FINAL
      ====================================================== */}
      <div className="text-center mt-2">
        <p className="text-xs uppercase tracking-[0.25em] text-purple-400">
          {comentarios.length} experiencias compartidas
        </p>

        <p className="mt-3 text-sm text-gray-400">
          Gracias por ser parte de Zhyra. 💜
        </p>
      </div>
    </section>
  );
}