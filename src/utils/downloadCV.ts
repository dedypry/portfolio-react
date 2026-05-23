import type { Language } from "../i18n";

/**
 * Lazy entry-point for CV generation. The PDF generator (and jsPDF) are split
 * into their own chunk so they only load when the user actually clicks
 * "Download CV", keeping the initial page bundle lean.
 */
export async function downloadCV(lang: Language = "en"): Promise<void> {
  try {
    const { generateCV } = await import("./cvGenerator");
    await generateCV(lang);
  } catch (err) {
    console.error("Failed to generate CV:", err);
    if (typeof window !== "undefined") {
      window.alert(
        "Sorry — couldn't generate the PDF right now. Please try again."
      );
    }
  }
}
