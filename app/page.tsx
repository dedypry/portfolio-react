import { redirect } from "next/navigation";
import { DEFAULT_LANGUAGE } from "@/i18n/config";

// Middleware should redirect any unprefixed path to /[lang], but if it ever
// gets through, fall back to the default language so we never render an empty
// "/" with no providers.
export default function Root() {
  redirect(`/${DEFAULT_LANGUAGE}`);
}
