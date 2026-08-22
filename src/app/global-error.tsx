"use client";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="es">
      <body
        style={{
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          fontFamily: "system-ui, sans-serif",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <title>Error | LC Suplements</title>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Algo salió mal</h1>
        <p style={{ color: "#666", maxWidth: "28rem" }}>
          Ocurrió un error inesperado. Vuelve a intentarlo.
        </p>
        {error.digest && (
          <p style={{ color: "#999", fontSize: "0.75rem", fontFamily: "monospace" }}>
            Código de referencia: {error.digest}
          </p>
        )}
        <button
          onClick={() => unstable_retry()}
          style={{
            border: "1px solid #ddd",
            borderRadius: "0.375rem",
            padding: "0.5rem 1.25rem",
            cursor: "pointer",
          }}
        >
          Reintentar
        </button>
      </body>
    </html>
  );
}
