import { redirect, RedirectType } from "next/navigation";

export default function AuthPage() {
  redirect("/auth/login", RedirectType.replace);
}
