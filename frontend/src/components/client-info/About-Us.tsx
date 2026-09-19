"use client";

import Image from "next/image";

export default function QuienesSomos() {
  return (
    <section className="py-12 px-4">
      {/* 💫 Encabezado */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-dark)]">
          💫 ¿Quiénes Somos?
        </h2>
      </div>

      {/* 💜 Contenedor principal */}
      <div className="max-w-5xl mx-auto bg-[var(--color-pastel-lilac)] border border-[var(--color-hover)] rounded-2xl shadow-lg p-8 md:p-10 flex flex-col md:flex-row items-center gap-10">

        {/* 🖼️ Tu foto */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="relative w-64 h-80 sm:w-72 sm:h-96 rounded-2xl overflow-hidden shadow-md hover:scale-[1.03] transition-transform duration-300">
            <Image
              src="/Mifoto.jpeg"
              alt="Natalia - Creadora de Zhyra.online"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* 🪐 Texto */}
        <div className="w-full md:w-1/2 text-gray-800 leading-relaxed space-y-4">

          <p className="text-lg">
            Hola, soy <strong>Natalia</strong>, la persona detrás de{" "}
            <strong>Zhyra.online</strong>. 💜
          </p>

          <p>
            Zhyra nació de un sueño, de esas ganas de crear algo propio y de
            construir un espacio donde la moda, el estilo y la personalidad
            puedan encontrarse.
          </p>

          <p>
            Siempre creí que la ropa es mucho más que una prenda. Es una forma
            de expresarnos, de sentirnos cómodas con quienes somos y de mostrar
            un poquito de nuestra personalidad sin necesidad de decir una palabra.
          </p>

          <p>
            Por eso nació <strong>Zhyra</strong>: una tienda pensada para
            mujeres que disfrutan de la moda, que buscan sentirse lindas,
            seguras y auténticas, y que quieren encontrar prendas que puedan
            hacer parte de su propio estilo. ✨
          </p>

          <p>
            En Zhyra vas a encontrar prendas seleccionadas con mucho amor,
            pensando en las tendencias actuales pero sin perder de vista algo
            que para mí es fundamental:{" "}
            <strong>que te sientas vos misma cuando las uses.</strong>
          </p>

          <p>
            Quiero que cada vez que elijas algo de Zhyra sientas que estás
            eligiendo mucho más que una prenda. Que sea ese pequeño detalle que
            te haga mirarte al espejo y pensar:{" "}
            <strong>“Esto es muy yo”.</strong> 🤍
          </p>

          <p>
            Este proyecto es una parte de mí, y cada detalle de Zhyra está hecho
            con ilusión, dedicación y muchas ganas de crecer.
          </p>

          <p>
            Gracias por estar acá, por elegir un emprendimiento y por ser parte
            de este comienzo. 🫶🏻
          </p>

          <p className="font-medium text-[var(--color-dark)] text-lg">
            💜 Bienvenida a Zhyra.online.
            <br />
            Tu estilo, tu esencia, tu Zhyra.
          </p>

        </div>
      </div>

      {/* 🌸 Animación */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-in-out;
        }
      `}</style>
    </section>
  );
}