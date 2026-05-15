import { ForgotPasswordForm } from "@/components/store/forgot-password-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recuperar contraseña | LC Suplements",
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background px-4">
      <ForgotPasswordForm />
    </div>
  );
}
