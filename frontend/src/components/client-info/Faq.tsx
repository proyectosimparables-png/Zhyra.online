"use client";

import React, { useState, ReactNode } from "react";

interface Pregunta {
  icon: string;
  pregunta: string;
  respuesta: ReactNode;
}

const preguntas: Pregunta[] = [
  {
    icon: "🛍️",
    pregunta: "¿Cómo puedo realizar una compra en Zhyra?",
    respuesta: (
      <>
        Elegí las prendas que más te gusten, seleccioná el talle y agregalas
        al carrito. Luego completá tus datos y elegí el medio de pago y envío
        disponible para finalizar tu compra.
      </>
    ),
  },
  {
    icon: "💳",
    pregunta: "¿Qué medios de pago acepta Zhyra?",
    respuesta: (
      <>
        Podés abonar tu compra mediante <strong>tarjetas de crédito y débito</strong>,
        además de diferentes <strong>billeteras digitales</strong>.
        <br />
        <br />
        También aceptamos <strong>transferencia bancaria</strong>.
      </>
    ),
  },
  {
    icon: "🏦",
    pregunta: "¿Cómo pago mediante transferencia bancaria?",
    respuesta: (
      <>
        Si elegís pagar mediante transferencia bancaria, una vez realizado el
        pago deberás enviarnos el <strong>comprobante de transferencia</strong>.
        <br />
        <br />
        Podés enviarlo por:
        <ul className="mt-3 space-y-2 pl-5 list-disc">
          <li>
            <strong>WhatsApp:</strong>{" "}
            <a
              href="https://wa.me/541164806794"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline hover:opacity-80 transition"
            >
              11 6480-6794
            </a>
          </li>
          <li>
            <strong>Instagram:</strong>{" "}
            <span className="font-semibold">@Zhyra.online</span>
          </li>
        </ul>
        <br />
        El pedido será procesado una vez que podamos verificar el pago.
      </>
    ),
  },
  {
    icon: "🚚",
    pregunta: "¿Realizan envíos a todo el país?",
    respuesta: (
      <>
        ¡Sí! 💜 Realizamos envíos a <strong>todo el país</strong>.
        <br />
        <br />
        Al momento de realizar tu compra podrás consultar las opciones de
        envío disponibles para tu ubicación.
      </>
    ),
  },
  {
    icon: "📦",
    pregunta: "¿Cuál es el costo de envío?",
    respuesta: (
      <>
        El costo de envío depende de la localidad y del método de envío
        seleccionado. El valor correspondiente se mostrará durante el proceso
        de compra antes de confirmar el pedido.
      </>
    ),
  },
  {
    icon: "⏰",
    pregunta: "¿Cuánto tarda en llegar mi pedido?",
    respuesta: (
      <>
        El tiempo de entrega puede variar según la localidad y el medio de
        envío elegido.
        <br />
        <br />
        Una vez despachado el pedido, recibirás la información necesaria para
        poder realizar el seguimiento del envío.
      </>
    ),
  },
  {
    icon: "👗",
    pregunta: "¿Cómo sé qué talle elegir?",
    respuesta: (
      <>
        Te recomendamos consultar nuestra <strong>Guía de Talles</strong> antes
        de realizar tu compra.
        <br />
        <br />
        Si tenés dudas entre dos talles, podés comunicarte con nosotros y te
        ayudaremos a elegir la opción que mejor se adapte a vos.
      </>
    ),
  },
  {
    icon: "📏",
    pregunta: "¿Las prendas tienen diferentes talles?",
    respuesta: (
      <>
        Sí. Cada producto cuenta con los talles disponibles indicados en su
        publicación.
        <br />
        <br />
        Te recomendamos revisar la descripción y la guía de talles de cada
        prenda antes de comprar.
      </>
    ),
  },
  {
    icon: "🔄",
    pregunta: "¿Puedo realizar un cambio?",
    respuesta: (
      <>
        Los cambios se evalúan <strong>de manera personalizada según cada caso</strong>.
        <br />
        <br />
        Si necesitás realizar un cambio, comunicate con nosotros lo antes
        posible indicando tu número de pedido y el motivo del cambio para que
        podamos ayudarte.
      </>
    ),
  },
  {
    icon: "📸",
    pregunta: "¿Las prendas son iguales a las fotos?",
    respuesta: (
      <>
        Trabajamos para que las fotografías representen nuestras prendas de la
        manera más fiel posible.
        <br />
        <br />
        Sin embargo, los colores pueden presentar pequeñas variaciones
        dependiendo de la iluminación de la fotografía o de la pantalla desde
        la que estés viendo el producto.
      </>
    ),
  },
  {
    icon: "🛒",
    pregunta: "¿Los productos tienen stock?",
    respuesta: (
      <>
        La disponibilidad de cada prenda y talle se encuentra indicada en la
        tienda.
        <br />
        <br />
        Si un producto o talle aparece disponible, podés realizar tu compra
        directamente desde la página.
      </>
    ),
  },
  {
    icon: "💬",
    pregunta: "¿Cómo puedo comunicarme con Zhyra?",
    respuesta: (
      <>
        Si tenés alguna consulta antes o después de realizar tu compra,
        estamos para ayudarte 💜.
        <br />
        <br />
        Podés comunicarte con nosotros mediante:
        <ul className="mt-3 space-y-2 pl-5 list-disc">
          <li>
            <strong>WhatsApp:</strong>{" "}
            <a
              href="https://wa.me/541164806794"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline hover:opacity-80 transition"
            >
              11 6480-6794
            </a>
          </li>
          <li>
            <strong>Instagram:</strong>{" "}
            <span className="font-semibold">@Zhyra.online</span>
          </li>
        </ul>
      </>
    ),
  },
  {
    icon: "💜",
    pregunta: "¿Por qué comprar en Zhyra?",
    respuesta: (
      <>
        En <strong>Zhyra.online</strong> estamos comenzando este proyecto con
        mucha dedicación y amor por la moda.
        <br />
        <br />
        Queremos ofrecerte prendas lindas, actuales y seleccionadas pensando
        en vos, brindándote una atención cercana y personalizada en cada
        compra.
        <br />
        <br />
        ✨ Gracias por elegir y acompañar a Zhyra en este comienzo.
      </>
    ),
  },
];

export default function PreguntasFrecuentes() {
  const [abierta, setAbierta] = useState<number | null>(null);

  const togglePregunta = (index: number) => {
    setAbierta(abierta === index ? null : index);
  };

  return (
    <section className="min-h-screen px-4 py-12 md:px-8 lg:px-12">
      {/* Encabezado */}
      <div className="max-w-4xl mx-auto text-center mb-10 animate-fadeIn">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-pastel-lilac)] mb-4 shadow-sm">
          <span className="text-3xl">💜</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-dark)]">
          Preguntas Frecuentes
        </h1>

        <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
          Todo lo que necesitás saber antes de realizar tu compra en{" "}
          <strong className="text-[var(--color-dark)]">Zhyra.online</strong>.
        </p>
      </div>

      {/* FAQ */}
      <div className="max-w-4xl mx-auto space-y-4">
        {preguntas.map((item, index) => {
          const estaAbierta = abierta === index;

          return (
            <div
              key={index}
              className={`overflow-hidden rounded-2xl border border-[var(--color-lilac)] bg-[var(--color-pastel-lilac)] shadow-sm transition-all duration-300 ${
                estaAbierta
                  ? "shadow-lg -translate-y-[1px]"
                  : "hover:shadow-md"
              }`}
            >
              {/* Pregunta */}
              <button
                type="button"
                onClick={() => togglePregunta(index)}
                aria-expanded={estaAbierta}
                className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left"
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`flex-shrink-0 w-11 h-11 rounded-full bg-white flex items-center justify-center text-xl shadow-sm transition-transform duration-300 ${
                      estaAbierta ? "scale-110" : ""
                    }`}
                  >
                    {item.icon}
                  </span>

                  <h2 className="text-base md:text-lg font-semibold text-[var(--color-dark)]">
                    {item.pregunta}
                  </h2>
                </div>

                <span
                  className={`flex-shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center text-[var(--color-dark)] font-bold transition-transform duration-300 ${
                    estaAbierta ? "rotate-180" : ""
                  }`}
                >
                  ↓
                </span>
              </button>

              {/* Respuesta */}
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  estaAbierta
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-5 pb-6 pl-[4.75rem] pr-6 text-gray-700 leading-relaxed">
                    {item.respuesta}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Contacto */}
      <div className="max-w-4xl mx-auto mt-10">
        <div className="rounded-2xl bg-[var(--color-dark)] text-white p-6 md:p-8 text-center shadow-lg">
          <div className="text-3xl mb-3">💌</div>

          <h2 className="text-xl md:text-2xl font-bold mb-2">
            ¿Tenés alguna otra consulta?
          </h2>

          <p className="text-white/80 mb-6">
            No dudes en escribirnos. Estamos para ayudarte a encontrar tu
            próxima prenda favorita. 💜
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <a
              href="https://wa.me/541164806794"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-[var(--color-dark)] transition-all hover:scale-105 hover:shadow-lg"
            >
              💬 WhatsApp
            </a>

            <a
              href="https://www.instagram.com/Zhyra.online/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-6 py-3 font-semibold text-white transition-all hover:bg-white/10 hover:scale-105"
            >
              📸 Instagram
            </a>
          </div>
        </div>
      </div>

      {/* Animación */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(12px);
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