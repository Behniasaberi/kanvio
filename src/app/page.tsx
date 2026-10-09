import { redirect } from "next/navigation";

// proxy.ts already redirects "/", this is just a fallback.
export default function HomePage() {
  redirect("/login");
}
