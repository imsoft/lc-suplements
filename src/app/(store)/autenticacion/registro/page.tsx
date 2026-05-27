import { RegisterForm } from "@/components/store/register-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crear cuenta | LC Suplements",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background px-4">
      <RegisterForm />
    </div>
  );
}
