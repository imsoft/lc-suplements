import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { nextCookies } from "better-auth/next-js";
import { Resend } from "resend";
import { db } from "@/lib/db";
import { resetPasswordEmail } from "@/lib/email-templates";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: prismaAdapter(db, { provider: "postgresql" }),
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL!,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: "LC Suplements <noreply@lcsuplementos.com>",
        to: user.email,
        subject: "Recupera tu contraseña — LC Suplements",
        html: resetPasswordEmail(user.name ?? "Cliente", url),
      });
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "CUSTOMER",
        input: false,
      },
      phone: {
        type: "string",
        required: false,
      },
    },
  },
  plugins: [nextCookies()],
  trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"],
  rateLimit: {
    enabled: true,
    window: 60,
    max: 10,
  },
});

export type Session = typeof auth.$Infer.Session;
