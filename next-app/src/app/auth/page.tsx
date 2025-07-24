import { redirect, RedirectType } from "next/navigation";
import { ROUTES } from "@/routes";

export default function AuthPage() {
  redirect(ROUTES.auth.login, RedirectType.replace);
}
