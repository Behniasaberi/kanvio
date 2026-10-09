import type { Metadata } from "next";
import { SignupForm } from "@/features/auth";

export const metadata: Metadata = { title: "Sign up · Task Board" };

export default function SignupPage() {
  return <SignupForm />;
}
