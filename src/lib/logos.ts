/** Rutas bajo `public/logos` con `encodeURI` por espacios en nombres de archivo. */
function u(path: string): string {
  return encodeURI(path);
}

export const LOGOS = {
  horizontalOnLight: u("/logos/svg/LC horizontal negro.svg"),
  horizontalOnDark: u("/logos/svg/LC Horizontal Blanco.svg"),
  markOnLight: u("/logos/svg/Monograma Negro.svg"),
  markOnDark: u("/logos/svg/Monograma Blanco.svg"),
  /** Favicon / Apple touch (sin espacios en el nombre) */
  markPng: "/logos/png/Monograma Negro.png",
  /** Cabecera de correos (fondo oscuro) */
  emailHeaderPng: u("/logos/png/LC Horizontal Blanco.png"),
} as const;
