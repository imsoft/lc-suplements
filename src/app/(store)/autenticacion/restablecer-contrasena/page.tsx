import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/store/reset-password-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Restablecer contraseña | LC Suplements",
};

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background px-4">
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
