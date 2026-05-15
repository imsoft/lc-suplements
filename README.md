# LC Suplements — Tienda en Línea

Ecommerce de suplementos alimenticios (proteínas, creatinas, vitaminas y más) para el mercado mexicano. Desarrollado por [imSoft](https://imsoft.io).

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router) |
| Base de datos | PostgreSQL via [Neon](https://neon.tech) |
| ORM | Prisma 7 + `@prisma/adapter-neon` |
| Autenticación | Better Auth 1.x |
| Pagos | MercadoPago (tarjetas, OXXO, SPEI) |
| Imágenes | Cloudinary + `next-cloudinary` |
| UI | shadcn/ui + Tailwind CSS v4 |
| Íconos | HugeIcons |
| Deploy | Vercel |

## Requisitos previos

- Node.js 20+
- pnpm 9+
- Cuenta en [Neon](https://neon.tech)
- Cuenta en [Cloudinary](https://cloudinary.com)
- Cuenta de vendedor en [MercadoPago](https://www.mercadopago.com.mx/developers)

## Configuración local

### 1. Clonar e instalar dependencias

```bash
git clone <repo-url>
cd lc-suplements
pnpm install
```

### 2. Variables de entorno

Copia el archivo de ejemplo y rellena los valores:

```bash
cp .env.example .env
```

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Connection string de Neon (con `?sslmode=require`) |
| `BETTER_AUTH_SECRET` | String aleatorio de mínimo 32 caracteres |
| `BETTER_AUTH_URL` | URL base de la app (ej. `http://localhost:3000`) |
| `NEXT_PUBLIC_APP_URL` | Igual que `BETTER_AUTH_URL` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloud name de Cloudinary |
| `CLOUDINARY_API_KEY` | API Key de Cloudinary |
| `CLOUDINARY_API_SECRET` | API Secret de Cloudinary |
| `MERCADOPAGO_ACCESS_TOKEN` | Access token privado de MercadoPago |
| `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` | Public key de MercadoPago |

### 3. Base de datos

```bash
npx prisma migrate dev --name init
```

### 4. Levantar servidor de desarrollo

```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Estructura del proyecto

```
src/
├── app/
│   ├── (store)/          # Tienda pública — rutas: /, /products, /cart, /checkout, /orders, /account, /wishlist
│   ├── (admin)/          # Panel admin — rutas: /admin/*
│   └── api/
│       ├── auth/         # Better Auth handler
│       └── webhooks/     # Webhook de MercadoPago
├── components/
│   ├── layout/           # Header, Footer, AdminSidebar
│   ├── store/            # Componentes de tienda (ProductCard, CheckoutForm, etc.)
│   ├── admin/            # Componentes de admin (ProductForm, etc.)
│   └── ui/               # shadcn/ui
├── lib/
│   ├── db.ts             # Cliente Prisma con adapter Neon
│   ├── auth.ts           # Configuración Better Auth (server)
│   ├── auth-client.ts    # Cliente Better Auth (client)
│   └── actions/          # Server Actions (checkout, admin, account)
└── generated/
    └── prisma/           # Cliente Prisma generado (git-ignored)
```

## Scripts

| Comando | Descripción |
|---|---|
| `pnpm dev` | Servidor de desarrollo |
| `pnpm build` | Build de producción |
| `pnpm start` | Servidor de producción |
| `npx prisma migrate dev` | Crear/aplicar migraciones |
| `npx prisma studio` | GUI para explorar la base de datos |

## Roles de usuario

- **CUSTOMER** — rol por defecto al registrarse
- **ADMIN** — acceso al panel `/admin`. Asignar manualmente desde Prisma Studio o con una migración de seed:

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'tu@email.com';
```

## Webhooks (MercadoPago)

En producción, configura la URL del webhook en el dashboard de MercadoPago:

```
https://tu-dominio.com/api/webhooks/mercadopago
```

El webhook actualiza automáticamente el estado de pago y el inventario al confirmar un pago.

## Deploy en Vercel

1. Conecta el repo en [vercel.com](https://vercel.com)
2. Agrega todas las variables de entorno en el dashboard de Vercel
3. Cambia `BETTER_AUTH_URL` y `NEXT_PUBLIC_APP_URL` a tu dominio de producción
4. Agrega el dominio de producción en MercadoPago como URL autorizada
