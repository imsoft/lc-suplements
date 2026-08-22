/**
 * Convierte un texto en un slug seguro para URL.
 * Quita acentos (á → a, ñ → n) en lugar de borrar la letra, para que
 * "Ómega 3" produzca "omega-3" y no "mega-3".
 */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // acentos combinantes
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/**
 * Genera un slug único consultando la tabla correspondiente.
 * Si "creatina" ya existe devuelve "creatina-2", "creatina-3", etc.
 */
export async function uniqueSlug(
  name: string,
  exists: (slug: string) => Promise<boolean>,
  fallback = "producto"
): Promise<string> {
  const base = slugify(name) || fallback;
  let candidate = base;
  for (let i = 2; await exists(candidate); i++) {
    candidate = `${base}-${i}`;
    if (i > 200) return `${base}-${Date.now()}`;
  }
  return candidate;
}
