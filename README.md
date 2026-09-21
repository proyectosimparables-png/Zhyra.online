# ZHYRA.online

E-commerce full stack de indumentaria, en producción: 🔗 **[zhyra.online](https://zhyra.online)**

Proyecto desarrollado en equipo por **Macarena Aliberti** ([@MacarenaAliberti-web](https://github.com/MacarenaAliberti-web)) y **Natalia** ([@Russnv](https://github.com/Russnv)). Cada funcionalidad se implementó entre las dos, frontend y backend a la par.

---

## ✨ Funcionalidades

**Tienda**
- Home con listado dinámico de productos y tarjetas de producto.
- Carrito y checkout.
- Inicio de sesión con Google (autenticación de terceros).
- Pagos con Mercado Pago.

**Panel de administración**
- Promociones: 2x1, 3x2 y descuentos por prenda o por categoría.
- Creación de cupones de descuento.
- Configuración de envíos.
- Modo "tienda en construcción".

---

## 🛠️ Stack

- **Frontend:** Next.js, React, Tailwind CSS, Context API para el manejo de estado.
- **Backend:** NestJS, TypeScript, APIs REST.
- **Base de datos:** PostgreSQL (Supabase) con Prisma ORM.
- **Autenticación:** JWT y login con Google.
- **Pagos:** Mercado Pago.

---

## 👩‍💻 Quién hizo qué

| | Partes principales |
|---|---|
| **Macarena** | Frontend (home, tarjetas de producto, carrito y checkout), login con Google, integración con Mercado Pago y panel de administración (promociones, cupones, envíos y modo "tienda en construcción"). |
| **Natalia** | Autenticación con JWT, contenerización con Docker y despliegue en AWS. 

---

## 📌 Estado

En producción, con ajustes en curso.

---

## ▶️ Cómo correrlo en local

```bash
git clone https://github.com/proyectosimparables-png/Zhyra.online.git
cd Zhyra.online
```

```bash
# Backend
cd backend
npm install
npm run start:dev
```

```bash
# Frontend (en otra terminal)
cd frontend
npm install
npm run dev
```

Cada carpeta necesita su propio archivo `.env` con las variables de entorno del proyecto (base de datos, claves de Mercado Pago y de Google, etc.). 
