"use client";

import { useEffect, useState } from "react";
import { getComentarios } from "@/services/comments-service";

interface Comentario {
  id: string;
  contenido: string;
  createdAt: string;
  user: {
    name: string;
  };
}

export default function UltimosComentarios() {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);

  useEffect(() => {
    getComentarios(5).then((data) => {
      if (Array.isArray(data)) {
        setComentarios(data as Comentario[]);
      }
    });
  }, []);

  return (
    <section className="max-w-6xl mx-auto py-10 px-4 sm:px-6 bg-[var(--color-soft-beige)] rounded-2xl shadow-md mt-10">
      <h2
        className="text-2xl sm:text-3xl font-bold mb-8 text-center"
        style={{ color: "var(--color-dark)" }}
      >
        Ustedes 💜
      </h2>

      {comentarios.length === 0 ? (
        <p className="text-gray-500 text-center text-sm sm:text-base">
          Aún no hay comentarios disponibles.
        </p>
      ) : (
        <div
          className="
            flex gap-6 overflow-x-auto pb-6 pt-2 px-2
            scrollbar-thin scrollbar-thumb-[var(--color-lilac)]
            scrollbar-track-[var(--color-soft-beige)]
            snap-x snap-mandatory
          "
        >
          {comentarios.map((c) => (
            <div
              key={c.id}
              className="
                relative snap-center flex-shrink-0 flex flex-col justify-between
                bg-white/90 backdrop-blur-sm
                rounded-[2rem] p-6 shadow-sm border border-[var(--color-lilac)]/30
                hover:shadow-md hover:scale-[1.02] transition-all duration-300
                w-[280px] sm:w-[320px] min-h-[180px]
              "
            >
              {/* 💜 Corazón en la esquina superior derecha */}
              <div className="absolute top-5 right-5 text-[var(--color-hover)] text-lg  text-purple-900">
                🤍
              </div>

              {/* ⭐ Estrellitas */}
              <div>
                <div className="flex gap-1 text-[var(--color-hover)] text-sm mb-4  text-purple-900">
                  {"★".repeat(5)}
                </div>

                {/* 💬 Comentario */}
                <p className="text-gray-700 italic font-medium text-base sm:text-lg leading-relaxed line-clamp-3">
                  “{c.contenido}”
                </p>
              </div>

              {/* 👩 Nombre abajo en mayúsculas */}
              <div className="mt-4 pt-2">
                <p className="font-bold text-xs sm:text-sm tracking-wider uppercase  text-purple-900 text-[var(--color-hover)]">
                  {c.user.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}