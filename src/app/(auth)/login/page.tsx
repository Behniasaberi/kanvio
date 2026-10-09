import type { Metadata } from "next";
import { LoginForm } from "@/features/auth";

export const metadata: Metadata = { title: "Log in · Task Board" };

export default function LoginPage() {
  return <LoginForm />;
}
