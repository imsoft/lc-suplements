const BASE = `
  body, html { margin:0; padding:0; background:#0a0a0a; }
  * { box-sizing:border-box; }
`;

function wrapper(content: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>${BASE}</style>
</head>
<body>
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 16px">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px">

          <!-- Header -->
          <tr>
            <td style="padding:0 0 32px 0;text-align:center">
              <span style="font-family:'Arial Black',Arial,sans-serif;font-size:22px;font-weight:900;letter-spacing:6px;color:#c9a84c;text-transform:uppercase">
                LC SUPLEMENTS
              </span>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#141414;border:1px solid #2a2a2a;border-radius:12px;padding:40px 36px">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:28px 0 0 0;text-align:center">
              <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#555;line-height:1.6">
                © ${new Date().getFullYear()} LC Suplements. Todos los derechos reservados.<br />
                Si no solicitaste este correo, puedes ignorarlo con seguridad.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function resetPasswordEmail(name: string, url: string): string {
  return wrapper(`
    <h1 style="margin:0 0 8px 0;font-family:'Arial Black',Arial,sans-serif;font-size:24px;font-weight:900;color:#ffffff;letter-spacing:1px">
      Restablecer contraseña
    </h1>
    <div style="width:40px;height:3px;background:#c9a84c;margin:0 0 28px 0;border-radius:2px"></div>

    <p style="margin:0 0 12px 0;font-family:Arial,sans-serif;font-size:15px;color:#aaaaaa;line-height:1.6">
      Hola <strong style="color:#ffffff">${name}</strong>,
    </p>
    <p style="margin:0 0 28px 0;font-family:Arial,sans-serif;font-size:15px;color:#aaaaaa;line-height:1.6">
      Recibimos una solicitud para restablecer la contraseña de tu cuenta en LC Suplements.
      Haz clic en el botón de abajo para crear una nueva contraseña.
    </p>

    <table cellpadding="0" cellspacing="0" style="margin:0 0 28px 0">
      <tr>
        <td style="border-radius:6px;background:#c9a84c">
          <a href="${url}"
             style="display:inline-block;padding:14px 32px;font-family:'Arial Black',Arial,sans-serif;font-size:14px;font-weight:900;color:#0a0a0a;text-decoration:none;letter-spacing:1px;text-transform:uppercase;border-radius:6px">
            Restablecer contraseña
          </a>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 16px 0;font-family:Arial,sans-serif;font-size:13px;color:#666;line-height:1.6">
      Si el botón no funciona, copia y pega este enlace en tu navegador:
    </p>
    <p style="margin:0 0 28px 0;font-family:monospace;font-size:12px;color:#c9a84c;word-break:break-all;line-height:1.6">
      ${url}
    </p>

    <div style="border-top:1px solid #2a2a2a;padding-top:20px">
      <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#555;line-height:1.6">
        ⏱ Este enlace expira en <strong style="color:#aaaaaa">1 hora</strong>.<br />
        🔒 Si no solicitaste este cambio, ignora este correo. Tu contraseña no será modificada.
      </p>
    </div>
  `);
}
