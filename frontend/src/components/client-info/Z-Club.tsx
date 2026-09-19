"use client";

import Link from "next/link";

const benefits = [
  {
    icon: "♡",
    title: "Beneficios exclusivos",
    description:
      "Accedé a beneficios y sorpresas pensadas especialmente para nuestra comunidad.",
  },
  {
    icon: "✦",
    title: "Novedades primero",
    description:
      "Enterate antes que nadie de nuevos ingresos, lanzamientos y colecciones.",
  },
  {
    icon: "♢",
    title: "Experiencia Zhyra",
    description:
      "Porque queremos que cada compra se sienta especial desde el primer momento.",
  },
];

const floatingMessages = [
  "Me encantó todo 💜",
  "¿Cuándo llega la nueva colección? ✨",
  "Amo Zhyra ♡",
  "Necesito ese look 😍",
];

export default function ZClubView() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fafbf1] text-[#68478f]">
      {/* HERO */}
      <section className="relative flex min-h-[650px] items-center justify-center px-6 py-24">
        {/* Background decorations */}
        <div className="absolute left-[-120px] top-20 h-72 w-72 rounded-full bg-[#d9c7ed] opacity-40 blur-3xl" />

        <div className="absolute bottom-[-100px] right-[-80px] h-80 w-80 rounded-full bg-[#cbb4e5] opacity-30 blur-3xl" />

        <div className="absolute left-[15%] top-[25%] text-2xl opacity-40">
          ✦
        </div>

        <div className="absolute right-[18%] top-[18%] text-xl opacity-40">
          ♡
        </div>

        <div className="absolute bottom-[20%] left-[20%] text-xl opacity-30">
          ✧
        </div>

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          {/* Small badge */}
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#d7c6e8] bg-white/70 px-5 py-2 text-sm font-medium shadow-sm backdrop-blur">
            <span className="text-[#7c56a6]">✦</span>
            Bienvenida a
            <span className="font-bold text-[#693e94]">Z-Club</span>
          </div>

          {/* Main title */}
          <h1 className="text-5xl font-black tracking-tight text-[#70499a] sm:text-6xl md:text-7xl">
            Más que comprar,
            <span className="block bg-gradient-to-r from-[#70499a] via-[#a878c7] to-[#70499a] bg-clip-text text-transparent">
              es ser parte.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-[#766b81] sm:text-lg">
            Z-Club es nuestro espacio para compartir, descubrir y disfrutar
            juntas todo lo que hace especial a Zhyra.
          </p>

          {/* CTA */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="#beneficios"
              className="rounded-full bg-[#7650a1] px-8 py-3.5 font-semibold text-white shadow-lg shadow-[#7650a1]/25 transition-all duration-300 hover:-translate-y-1 hover:bg-[#67418e] hover:shadow-xl"
            >
              Descubrir Z-Club ✦
            </Link>

            <Link
              href="#experiencia"
              className="rounded-full border border-[#cbb8dd] bg-white/70 px-8 py-3.5 font-semibold text-[#70499a] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white"
            >
              Conocé nuestra comunidad
            </Link>
          </div>
        </div>

        {/* Floating comments */}
        <div className="pointer-events-none absolute inset-0 hidden lg:block">
          <div className="absolute left-[6%] top-[30%] rotate-[-7deg] rounded-2xl border border-white bg-white/80 px-5 py-3 shadow-xl backdrop-blur">
            <p className="text-sm font-medium text-[#70499a]">
              “Amo Zhyra ♡”
            </p>
          </div>

          <div className="absolute right-[6%] top-[36%] rotate-[6deg] rounded-2xl border border-white bg-white/80 px-5 py-3 shadow-xl backdrop-blur">
            <p className="text-sm font-medium text-[#70499a]">
              “Necesito ese look ✨”
            </p>
          </div>

          <div className="absolute bottom-[15%] left-[12%] rotate-[5deg] rounded-2xl border border-white bg-white/80 px-5 py-3 shadow-xl backdrop-blur">
            <p className="text-sm font-medium text-[#70499a]">
              “Me encantó todo 💜”
            </p>
          </div>

          <div className="absolute bottom-[18%] right-[13%] rotate-[-4deg] rounded-2xl border border-white bg-white/80 px-5 py-3 shadow-xl backdrop-blur">
            <p className="text-sm font-medium text-[#70499a]">
              “¿Cuándo llega la nueva colección?”
            </p>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section
        id="beneficios"
        className="relative bg-[#7753a0] px-6 py-20 text-white"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.25em] text-[#e7d9f4]">
              Z-Club
            </span>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Un poquito más de Zhyra ✦
            </h2>

            <p className="mt-4 text-sm leading-6 text-[#eee6f5] sm:text-base">
              Creamos este espacio para que nuestra comunidad tenga una
              experiencia todavía más especial.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="group rounded-3xl border border-white/20 bg-white/10 p-7 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:bg-white/15"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl text-[#7650a1] shadow-lg">
                  {benefit.icon}
                </div>

                <h3 className="text-xl font-bold">{benefit.title}</h3>

                <p className="mt-3 text-sm leading-6 text-[#eee7f5]">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section
        id="experiencia"
        className="relative px-6 py-24"
      >
        <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-2">
          {/* Left */}
          <div>
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#8c69ad]">
              Nuestra comunidad
            </span>

            <h2 className="mt-4 text-4xl font-black leading-tight text-[#70499a] sm:text-5xl">
              Tu estilo.
              <br />
              Tu esencia.
              <br />
              <span className="text-[#a77ac5]">Tu Zhyra.</span>
            </h2>

            <p className="mt-6 max-w-lg leading-7 text-[#766b81]">
              Queremos que Zhyra sea mucho más que una tienda. Un lugar donde
              puedas encontrar inspiración, descubrir nuevos estilos y sentirte
              parte de algo lindo.
            </p>

            <Link
              href="/productos"
              className="mt-8 inline-flex rounded-full bg-[#7650a1] px-7 py-3.5 font-semibold text-white shadow-lg shadow-[#7650a1]/20 transition hover:-translate-y-1 hover:bg-[#67418e]"
            >
              Explorar productos →
            </Link>
          </div>

          {/* Right card */}
          <div className="relative">
            <div className="absolute inset-0 rounded-[2rem] bg-[#d9c5eb] blur-2xl opacity-40" />

            <div className="relative rounded-[2rem] border border-white bg-white/80 p-6 shadow-2xl backdrop-blur">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#9b7bb8]">
                    Z-Club
                  </p>

                  <h3 className="mt-1 text-2xl font-bold text-[#70499a]">
                    Lo que dicen ustedes ♡
                  </h3>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eee5f5] text-xl">
                  ✦
                </div>
              </div>

              <div className="space-y-3">
                {floatingMessages.map((message, index) => (
                  <div
                    key={message}
                    className={`rounded-2xl border border-[#eee6f4] bg-[#faf9fd] p-4 shadow-sm ${
                      index % 2 === 0
                        ? "mr-8"
                        : "ml-8"
                    }`}
                  >
                    <div className="mb-1 text-xs text-[#a17dbd]">
                      ★★★★★
                    </div>

                    <p className="text-sm font-medium italic text-[#665c70]">
                      “{message}”
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-6 pb-24">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] bg-[#7650a1] px-6 py-16 text-center text-white shadow-2xl">
          <div className="absolute left-[-50px] top-[-50px] h-40 w-40 rounded-full bg-white/10 blur-2xl" />

          <div className="absolute bottom-[-60px] right-[-40px] h-52 w-52 rounded-full bg-white/10 blur-3xl" />

          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#e7d9f4]">
              Bienvenida a la familia
            </p>

            <h2 className="mt-4 text-3xl font-black sm:text-4xl">
              Z-Club ✦
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#eee6f5] sm:text-base">
              Porque cada persona que elige Zhyra forma parte de nuestra
              historia.
            </p>

            <Link
              href="https://wa.me/541164806794?text=Hola!%20Me%20interesa%20obtener%20mas%20información!"
              className="mt-8 inline-flex rounded-full bg-white px-8 py-3.5 font-bold text-[#70499a] transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              Quiero ser parte ♡
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}