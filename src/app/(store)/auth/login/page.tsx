import { LoginForm } from "@/components/store/login-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar sesión | LC Suplements",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background px-4">
      <LoginForm />
    </div>
  );
}
