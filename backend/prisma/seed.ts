import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/* ---------------- SLUGIFY ---------------- */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/* ---------------- TIPOS ---------------- */
type NodoCategoria = {
  nombre: string;
  children?: NodoCategoria[];
};

type SeccionSeed = {
  nombre: string;
  categorias?: NodoCategoria[];
};

/* ---------------- NUEVA ESTRUCTURA ---------------- */
const estructura: SeccionSeed[] = [

  {
    nombre: "Remeras",
    categorias: [
      {
        nombre: "Corta",
        children: [{ nombre: "Tiras" }],
      },
    ],
  },

  {
    nombre: "Body",
    categorias: [
      {
        nombre: "Corta",
        children: [{ nombre: "Manga larga" }],
      },
    ],
  },

  {
    nombre: "Deportiva",
    categorias: [
      { nombre: "Tops" },
      { nombre: "Conjuntos" },
      { nombre: "Calzas" },
    ],
  },

  {
    nombre: "Básicas",
    categorias: [
      { nombre: "Manga larga" },
      { nombre: "Manga corta" },
      { nombre: "Tiras" },
    ],
  },

  {
    nombre: "Short",
  },

  {
    nombre: "Ropa interior",
  },

  {
    nombre: "Vestidos",
    categorias: [
      { nombre: "Cortos" },
      { nombre: "Largos" },
    ],
  },

  {
    nombre: "Polleras",
  },
  {
    nombre: "Ofertas",
  },
];

/* ---------------- CREAR CATEGORÍA ---------------- */
async function crearCategoria(
  nombre: string,
  parentId: string | null,
  seccionId: string
) {
  return prisma.categoria.create({
    data: {
      nombre,
      slug: slugify(nombre),
      parentId,
      seccionId,
    },
  });
}

/* ---------------- RECURSIVO ---------------- */
async function procesarCategorias(
  lista: NodoCategoria[],
  parentId: string | null,
  seccionId: string
) {
  for (const item of lista) {
    const categoria = await crearCategoria(
      item.nombre,
      parentId,
      seccionId
    );

    if (item.children?.length) {
      await procesarCategorias(
        item.children,
        categoria.id,
        seccionId
      );
    }
  }
}

/* ---------------- SEED ---------------- */
async function main() {
  console.log("🧹 Limpiando base de datos...");

  await prisma.favorito.deleteMany();
  await prisma.comentario.deleteMany();

  await prisma.ordenItem.deleteMany();
  await prisma.orden.deleteMany();

  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();

  await prisma.imagen.deleteMany();
  await prisma.producto.deleteMany();

  await prisma.categoria.deleteMany();
  await prisma.seccion.deleteMany();

  await prisma.configuracionEnvio.deleteMany();
  await prisma.configuracionTienda.deleteMany();

  console.log("🚀 Iniciando seed...");

  for (const sec of estructura) {
    const seccion = await prisma.seccion.create({
      data: {
        nombre: sec.nombre,
        slug: slugify(sec.nombre),
      },
    });

    if (sec.categorias) {
      await procesarCategorias(
        sec.categorias,
        null,
        seccion.id
      );
    }
  }

  /* ---------------- CONFIGURACIONES ---------------- */

  await prisma.configuracionEnvio.upsert({
    where: { id: 'default-shipping' },
    update: {},
    create: {
      id: 'default-shipping',
      montoMinimo: 50000,
      activo: true,
    },
  });

  await prisma.configuracionTienda.upsert({
    where: { id: 'default-store-config' },
    update: {},
    create: {
      id: 'default-store-config',
      mantenimientoActivo: false,
      mantenimientoMensaje:
        'Estamos renovando la tienda y está quedando increíble. ¡Volvé en unos días!',
      mantenimientoCodigo: 'MOONLIGHT_VIP',
    },
  });

  console.log("✨ Seed completado con éxito.");
}

main()
  .catch((e) => {
    console.error("❌ Error ejecutando el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });