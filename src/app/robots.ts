import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://lcsuplements.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/cuenta/", "/pedidos/", "/pagar/", "/carrito/", "/favoritos/", "/autenticacion/"],
      },
    ],
    sitemap: `${appUrl}/sitemap.xml`,
  };
}
