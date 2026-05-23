import type { jsPDF } from "jspdf";
import {
  experienceIds,
  experiencesMeta,
  profile,
  projectIds,
  projectsMeta,
  skillGroupIds,
  skillGroupItems,
} from "../data/portfolio";
import { en } from "../i18n/locales/en";
import { id as idLocale } from "../i18n/locales/id";
import type { Language } from "../i18n";

// A4 in points: 595.28 x 841.89
const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN_X = 48;
const MARGIN_TOP = 56;
const MARGIN_BOTTOM = 48;
const CONTENT_W = PAGE_W - MARGIN_X * 2;

// Brand palette (RGB)
const COLOR = {
  ink: [10, 12, 20] as const,
  text: [32, 36, 48] as const,
  muted: [110, 114, 130] as const,
  divider: [220, 222, 230] as const,
  accent: [124, 92, 255] as const,
  accentDark: [91, 61, 240] as const,
  cyan: [0, 175, 200] as const,
  chipBg: [243, 240, 255] as const,
  chipText: [76, 53, 200] as const,
};

const LOCALES = { en, id: idLocale };
type LocaleShape = typeof en;

type Cursor = { y: number };

function setFill(doc: jsPDF, c: readonly [number, number, number]) {
  doc.setFillColor(c[0], c[1], c[2]);
}
function setText(doc: jsPDF, c: readonly [number, number, number]) {
  doc.setTextColor(c[0], c[1], c[2]);
}
function setDraw(doc: jsPDF, c: readonly [number, number, number]) {
  doc.setDrawColor(c[0], c[1], c[2]);
}

function ensureSpace(doc: jsPDF, cursor: Cursor, needed: number) {
  if (cursor.y + needed > PAGE_H - MARGIN_BOTTOM) {
    doc.addPage();
    cursor.y = MARGIN_TOP;
  }
}

function drawHeader(doc: jsPDF, cursor: Cursor, t: LocaleShape) {
  setFill(doc, COLOR.accent);
  doc.rect(0, 0, PAGE_W, 8, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  setText(doc, COLOR.ink);
  doc.text(profile.name.toUpperCase(), MARGIN_X, MARGIN_TOP + 4);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  setText(doc, COLOR.accentDark);
  doc.text(t.about.role, MARGIN_X, MARGIN_TOP + 24);

  doc.setFontSize(9);
  setText(doc, COLOR.muted);
  const contact = [
    profile.email,
    profile.phone,
    profile.location,
    profile.linkedin.replace(/^https?:\/\//, ""),
  ].join("   ·   ");
  doc.text(contact, MARGIN_X, MARGIN_TOP + 40);

  setDraw(doc, COLOR.divider);
  doc.setLineWidth(0.6);
  doc.line(MARGIN_X, MARGIN_TOP + 52, PAGE_W - MARGIN_X, MARGIN_TOP + 52);

  cursor.y = MARGIN_TOP + 70;
}

function drawSectionTitle(doc: jsPDF, cursor: Cursor, title: string) {
  ensureSpace(doc, cursor, 28);
  setFill(doc, COLOR.accent);
  doc.rect(MARGIN_X, cursor.y - 8, 3, 12, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  setText(doc, COLOR.ink);
  doc.text(title.toUpperCase(), MARGIN_X + 10, cursor.y);

  setDraw(doc, COLOR.divider);
  doc.setLineWidth(0.4);
  doc.line(
    MARGIN_X + 10 + doc.getTextWidth(title.toUpperCase()) + 10,
    cursor.y - 3,
    PAGE_W - MARGIN_X,
    cursor.y - 3
  );

  cursor.y += 14;
}

function drawWrappedText(
  doc: jsPDF,
  cursor: Cursor,
  text: string,
  opts: {
    x?: number;
    width?: number;
    fontSize?: number;
    bold?: boolean;
    italic?: boolean;
    color?: readonly [number, number, number];
    lineGap?: number;
  } = {}
) {
  const {
    x = MARGIN_X,
    width = CONTENT_W,
    fontSize = 10,
    bold = false,
    italic = false,
    color = COLOR.text,
    lineGap = 3,
  } = opts;

  const style =
    bold && italic
      ? "bolditalic"
      : bold
      ? "bold"
      : italic
      ? "italic"
      : "normal";
  doc.setFont("helvetica", style);
  doc.setFontSize(fontSize);
  setText(doc, color);

  const lines = doc.splitTextToSize(text, width) as string[];
  const lineHeight = fontSize * 1.25;

  for (const line of lines) {
    ensureSpace(doc, cursor, lineHeight + lineGap);
    doc.text(line, x, cursor.y);
    cursor.y += lineHeight;
  }
  cursor.y += lineGap;
}

function drawBullet(doc: jsPDF, cursor: Cursor, text: string) {
  const fontSize = 9.5;
  const lineHeight = fontSize * 1.35;
  const indent = 16;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(fontSize);
  setText(doc, COLOR.text);

  const wrapped = doc.splitTextToSize(text, CONTENT_W - indent) as string[];
  ensureSpace(doc, cursor, lineHeight * wrapped.length + 2);

  setFill(doc, COLOR.accent);
  doc.circle(MARGIN_X + 4, cursor.y - 3, 1.4, "F");

  for (const line of wrapped) {
    doc.text(line, MARGIN_X + indent, cursor.y);
    cursor.y += lineHeight;
  }
  cursor.y += 2;
}

/**
 * Draws a row (or rows) of pill-shaped chips.
 *
 * Contract:
 *   - On entry, `cursor.y` is the TOP edge of the first chip row.
 *   - On exit,  `cursor.y` is the BOTTOM edge of the last chip row.
 *   - Caller is responsible for spacing before / after.
 */
function drawChips(doc: jsPDF, cursor: Cursor, items: readonly string[]) {
  const padX = 7;
  const fontSize = 8.2;
  const rowHeight = 14;
  const gap = 4;
  const rowGap = 4;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(fontSize);

  let x = MARGIN_X;
  ensureSpace(doc, cursor, rowHeight + 4);

  for (const item of items) {
    const w = doc.getTextWidth(item) + padX * 2;
    if (x + w > PAGE_W - MARGIN_X) {
      cursor.y += rowHeight + rowGap;
      ensureSpace(doc, cursor, rowHeight + rowGap);
      x = MARGIN_X;
    }
    setFill(doc, COLOR.chipBg);
    doc.roundedRect(x, cursor.y, w, rowHeight, rowHeight / 2, rowHeight / 2, "F");
    setText(doc, COLOR.chipText);
    doc.text(item, x + padX, cursor.y + rowHeight - 4);
    x += w + gap;
  }

  cursor.y += rowHeight;
}

function drawSummary(doc: jsPDF, cursor: Cursor, t: LocaleShape) {
  drawSectionTitle(doc, cursor, t.pdf.summary);
  drawWrappedText(doc, cursor, t.about.description, {
    fontSize: 10.5,
    lineGap: 4,
    color: COLOR.text,
  });
  cursor.y += 4;
}

function drawExperience(doc: jsPDF, cursor: Cursor, t: LocaleShape) {
  drawSectionTitle(doc, cursor, t.pdf.experience);

  for (const id of experienceIds) {
    const meta = experiencesMeta[id];
    const copy = t.experience.items[id];

    ensureSpace(doc, cursor, 60);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    setText(doc, COLOR.ink);
    doc.text(copy.role, MARGIN_X, cursor.y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    setText(doc, COLOR.muted);
    doc.text(copy.period, PAGE_W - MARGIN_X, cursor.y, { align: "right" });

    cursor.y += 14;

    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    setText(doc, COLOR.accentDark);
    const meta_str = `${copy.company}  ·  ${copy.location}  ·  ${
      t.experience.types[meta.type]
    }`;
    doc.text(meta_str, MARGIN_X, cursor.y);
    cursor.y += 12;

    for (const h of copy.highlights) {
      drawBullet(doc, cursor, h);
    }

    if (meta.stack && meta.stack.length) {
      cursor.y += 6;
      drawChips(doc, cursor, meta.stack);
    }

    cursor.y += 16;
  }
}

function drawSkills(doc: jsPDF, cursor: Cursor, t: LocaleShape) {
  drawSectionTitle(doc, cursor, t.pdf.skills);

  const groups = skillGroupIds
    .map((id) => ({
      id,
      title: t.skills.groupTitles[id].toUpperCase(),
      items: id === "practices" ? t.skills.practices : skillGroupItems[id],
    }))
    .filter((g) => g.items.length > 0);

  groups.forEach((g, i) => {
    // Reserve enough vertical room for at least the title + first chip row
    // so a group title is never orphaned at the bottom of a page.
    ensureSpace(doc, cursor, 48);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    setText(doc, COLOR.ink);
    doc.text(g.title, MARGIN_X, cursor.y);

    // Title baseline → top edge of chip row
    cursor.y += 8;
    drawChips(doc, cursor, g.items);

    // Bottom of last chip row → next group title baseline
    if (i < groups.length - 1) cursor.y += 18;
    else cursor.y += 8;
  });
}

function drawProjects(doc: jsPDF, cursor: Cursor, t: LocaleShape) {
  drawSectionTitle(doc, cursor, t.pdf.projects);

  for (const id of projectIds) {
    const meta = projectsMeta[id];
    const copy = t.projects.items[id];

    ensureSpace(doc, cursor, 50);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    setText(doc, COLOR.ink);
    doc.text(copy.name, MARGIN_X, cursor.y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    setText(doc, COLOR.muted);
    doc.text(`[${t.projects.filters[meta.category]}]`, PAGE_W - MARGIN_X, cursor.y, {
      align: "right",
    });
    cursor.y += 12;

    doc.setFont("helvetica", "italic");
    doc.setFontSize(9.5);
    setText(doc, COLOR.accentDark);
    doc.text(copy.tagline, MARGIN_X, cursor.y);
    cursor.y += 12;

    drawWrappedText(doc, cursor, copy.description, {
      fontSize: 9.5,
      lineGap: 2,
      color: COLOR.text,
    });

    if (meta.link) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      setText(doc, COLOR.cyan);
      doc.textWithLink(`↳ ${meta.link}`, MARGIN_X, cursor.y, { url: meta.link });
      cursor.y += 10;
    }

    cursor.y += 2;
    drawChips(doc, cursor, meta.stack);
    cursor.y += 16;
  }
}

function drawEducation(doc: jsPDF, cursor: Cursor, t: LocaleShape) {
  drawSectionTitle(doc, cursor, t.pdf.education);

  ensureSpace(doc, cursor, 32);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  setText(doc, COLOR.ink);
  doc.text(t.skills.education.degree, MARGIN_X, cursor.y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setText(doc, COLOR.muted);
  doc.text(t.skills.education.period, PAGE_W - MARGIN_X, cursor.y, {
    align: "right",
  });
  cursor.y += 14;

  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  setText(doc, COLOR.accentDark);
  doc.text(
    `${t.skills.education.school} · ${t.skills.education.location}`,
    MARGIN_X,
    cursor.y
  );
  cursor.y += 14;
}

export async function generateCV(lang: Language = "en"): Promise<void> {
  const { default: JsPDF } = await import("jspdf");
  const doc = new JsPDF({
    unit: "pt",
    format: "a4",
    compress: true,
  });

  const t = LOCALES[lang] ?? LOCALES.en;
  const cursor: Cursor = { y: MARGIN_TOP };

  drawHeader(doc, cursor, t);
  drawSummary(doc, cursor, t);
  drawExperience(doc, cursor, t);
  drawSkills(doc, cursor, t);
  drawProjects(doc, cursor, t);
  drawEducation(doc, cursor, t);

  // Stamp page numbers/footer on every page (page count may have grown)
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    setFill(doc, [255, 255, 255]);
    doc.rect(0, PAGE_H - 36, PAGE_W, 36, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    setText(doc, COLOR.muted);
    doc.text(`${profile.name}  ·  ${profile.email}`, MARGIN_X, PAGE_H - 20);
    const pageOf = t.pdf.pageOf
      .replace("{{n}}", String(i))
      .replace("{{total}}", String(totalPages));
    doc.text(pageOf, PAGE_W - MARGIN_X, PAGE_H - 20, { align: "right" });
  }

  const safeName = profile.name.replace(/\s+/g, "-");
  const suffix = lang.toUpperCase();
  doc.save(`${safeName}-CV-${suffix}.pdf`);
}
