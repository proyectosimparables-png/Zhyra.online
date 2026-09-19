"use client";

export default function PoliticasCompra() {
  return (
    <section className="min-h-screen px-4 py-12 md:px-8 lg:px-12">
      {/* Encabezado */}
      <div className="max-w-4xl mx-auto text-center mb-10 animate-fadeIn">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-pastel-lilac)] mb-4 shadow-sm">
          <span className="text-3xl">💜</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-dark)]">
          Políticas de compra
        </h1>

        <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
          Queremos que tengas toda la información necesaria antes de realizar
          tu compra en <strong>Zhyra.online</strong>.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Información general */}
        <section className="bg-[var(--color-pastel-lilac)] shadow-lg rounded-2xl p-6 md:p-8 border border-[var(--color-lilac)]">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl">🛍️</span>

            <h2 className="text-2xl font-semibold text-[var(--color-dark)]">
              Información importante antes de comprar
            </h2>
          </div>

          <ul className="space-y-4 text-gray-800 leading-relaxed">
            <li className="flex gap-3">
              <span>💜</span>
              <span>
                Antes de realizar tu compra, te recomendamos revisar
                atentamente la descripción del producto, los talles disponibles
                y la <strong>Guía de Talles</strong>.
              </span>
            </li>

            <li className="flex gap-3">
              <span>✨</span>
              <span>
                La disponibilidad de cada prenda y talle se encuentra indicada
                en la tienda al momento de realizar la compra.
              </span>
            </li>

            <li className="flex gap-3">
              <span>📋</span>
              <span>
                Una vez confirmado el pedido y acreditado el pago,
                comenzaremos a preparar tu compra.
              </span>
            </li>
          </ul>
        </section>

        {/* Métodos de pago */}
        <section className="bg-[var(--color-pastel-lilac)] shadow-lg rounded-2xl p-6 md:p-8 border border-[var(--color-lilac)]">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl">💳</span>

            <h2 className="text-2xl font-semibold text-[var(--color-dark)]">
              Métodos de pago
            </h2>
          </div>

          <div className="text-gray-800 leading-relaxed space-y-4">
            <p>
              En <strong>Zhyra.online</strong> podés abonar tu compra mediante:
            </p>

            <ul className="space-y-3 pl-2">
              <li className="flex gap-3">
                <span>💳</span>
                <span>
                  <strong>Tarjetas de crédito y débito.</strong>
                </span>
              </li>

              <li className="flex gap-3">
                <span>📱</span>
                <span>
                  <strong>Billeteras digitales.</strong>
                </span>
              </li>

              <li className="flex gap-3">
                <span>🏦</span>
                <span>
                  <strong>Transferencia bancaria.</strong>
                </span>
              </li>
            </ul>

            <div className="mt-5 bg-white/70 rounded-xl p-5 border border-[var(--color-lilac)]">
              <p>
                Si elegís realizar una{" "}
                <strong>transferencia bancaria</strong>, una vez efectuado el
                pago deberás enviarnos el comprobante para poder verificarlo y
                confirmar tu pedido.
              </p>

              <p className="mt-3">
                📲 Podés enviar el comprobante por{" "}
                <strong>WhatsApp al 11 6480-6794</strong> o mediante nuestro{" "}
                <strong>Instagram @Zhyra.online</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* Envíos */}
        <section className="bg-[var(--color-pastel-lilac)] shadow-lg rounded-2xl p-6 md:p-8 border border-[var(--color-lilac)]">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl">🚚</span>

            <h2 className="text-2xl font-semibold text-[var(--color-dark)]">
              Envíos
            </h2>
          </div>

          <ul className="space-y-4 text-gray-800 leading-relaxed">
            <li className="flex gap-3">
              <span>📦</span>
              <span>
                Realizamos envíos a <strong>todo el país</strong> mediante{" "}
                <strong>Correo Argentino</strong>.
              </span>
            </li>

            <li className="flex gap-3">
              <span>📍</span>
              <span>
                Durante el proceso de compra podrás indicar los datos
                necesarios para recibir tu pedido.
              </span>
            </li>

            <li className="flex gap-3">
              <span>🔎</span>
              <span>
                Una vez despachado el pedido, te proporcionaremos la
                información de seguimiento correspondiente.
              </span>
            </li>

            <li className="flex gap-3">
              <span>⏰</span>
              <span>
                Los tiempos de entrega dependen de Correo Argentino y pueden
                variar según la localidad de destino.
              </span>
            </li>
          </ul>
        </section>

        {/* Preparación del pedido */}
        <section className="bg-[var(--color-pastel-lilac)] shadow-lg rounded-2xl p-6 md:p-8 border border-[var(--color-lilac)]">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl">📦</span>

            <h2 className="text-2xl font-semibold text-[var(--color-dark)]">
              Preparación de los pedidos
            </h2>
          </div>

          <div className="text-gray-800 leading-relaxed space-y-4">
            <p>
              Una vez que el pago haya sido acreditado, comenzaremos a preparar
              tu pedido.
            </p>

            <p>
              El tiempo de preparación puede variar según la disponibilidad de
              los productos adquiridos.
            </p>

            <p>
              Cuando tu pedido esté listo para ser despachado, recibirás la
              información correspondiente para poder realizar el seguimiento.
            </p>
          </div>
        </section>

        {/* Cambios */}
        <section className="bg-[var(--color-pastel-lilac)] shadow-lg rounded-2xl p-6 md:p-8 border border-[var(--color-lilac)]">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl">🔄</span>

            <h2 className="text-2xl font-semibold text-[var(--color-dark)]">
              Cambios
            </h2>
          </div>

          <div className="text-gray-800 leading-relaxed space-y-4">
            <p>
              En <strong>Zhyra.online</strong> evaluamos los pedidos de cambio
              <strong> de manera personalizada según cada caso</strong>.
            </p>

            <p>
              Si necesitás realizar un cambio, te pedimos que te comuniques
              con nosotros lo antes posible indicando tu número de pedido y el
              motivo de la solicitud.
            </p>

            <div className="bg-white/70 rounded-xl p-5 border border-[var(--color-lilac)]">
              <p>
                💜 Nuestro objetivo es encontrar la mejor solución posible para
                cada situación y brindarte una buena experiencia de compra.
              </p>
            </div>
          </div>
        </section>

        {/* Importante */}
        <section className="bg-[var(--color-dark)] text-white shadow-lg rounded-2xl p-6 md:p-8">
          <div className="text-center">
            <div className="text-3xl mb-3">💜</div>

            <h2 className="text-2xl font-semibold mb-4">
              Antes de confirmar tu compra
            </h2>

            <p className="text-white/85 leading-relaxed max-w-2xl mx-auto">
              Te recomendamos verificar el talle, color, modelo y los datos de
              envío antes de finalizar tu pedido. Si tenés alguna duda,
              estamos para ayudarte.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
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
        </section>
      </div>

      {/* Animación */}
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