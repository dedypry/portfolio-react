import type { jsPDF } from "jspdf";
import {
  education,
  experiences,
  profile,
  projects,
  skillGroups,
} from "../data/portfolio";

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
    addPageFooter(doc);
  }
}

function addPageFooter(doc: jsPDF) {
  const pageNumber = doc.getNumberOfPages();
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  setText(doc, COLOR.muted);
  doc.text(
    `${profile.name}  ·  ${profile.email}`,
    MARGIN_X,
    PAGE_H - 24
  );
  doc.text(
    `Page ${pageNumber}`,
    PAGE_W - MARGIN_X,
    PAGE_H - 24,
    { align: "right" }
  );
}

function drawHeader(doc: jsPDF, cursor: Cursor) {
  // Accent top bar
  setFill(doc, COLOR.accent);
  doc.rect(0, 0, PAGE_W, 8, "F");

  // Name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  setText(doc, COLOR.ink);
  doc.text(profile.name.toUpperCase(), MARGIN_X, MARGIN_TOP + 4);

  // Role
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  setText(doc, COLOR.accentDark);
  doc.text(profile.role, MARGIN_X, MARGIN_TOP + 24);

  // Contact line
  doc.setFontSize(9);
  setText(doc, COLOR.muted);
  const contact = [
    profile.email,
    profile.phone,
    profile.location,
    profile.linkedin.replace(/^https?:\/\//, ""),
  ].join("   ·   ");
  doc.text(contact, MARGIN_X, MARGIN_TOP + 40);

  // Divider
  setDraw(doc, COLOR.divider);
  doc.setLineWidth(0.6);
  doc.line(MARGIN_X, MARGIN_TOP + 52, PAGE_W - MARGIN_X, MARGIN_TOP + 52);

  cursor.y = MARGIN_TOP + 70;
}

function drawSectionTitle(doc: jsPDF, cursor: Cursor, title: string) {
  ensureSpace(doc, cursor, 28);
  // Accent bar
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

  const style = bold && italic ? "bolditalic" : bold ? "bold" : italic ? "italic" : "normal";
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

  // dot
  setFill(doc, COLOR.accent);
  doc.circle(MARGIN_X + 4, cursor.y - 3, 1.4, "F");

  for (const line of wrapped) {
    doc.text(line, MARGIN_X + indent, cursor.y);
    cursor.y += lineHeight;
  }
  cursor.y += 2;
}

function drawChips(doc: jsPDF, cursor: Cursor, items: string[]) {
  const padX = 6;
  const padY = 4;
  const fontSize = 8.2;
  const gap = 4;
  const lineHeight = 16;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(fontSize);

  let x = MARGIN_X;
  ensureSpace(doc, cursor, lineHeight + 4);

  for (const item of items) {
    const w = doc.getTextWidth(item) + padX * 2;
    if (x + w > PAGE_W - MARGIN_X) {
      cursor.y += lineHeight + 2;
      ensureSpace(doc, cursor, lineHeight);
      x = MARGIN_X;
    }
    setFill(doc, COLOR.chipBg);
    doc.roundedRect(x, cursor.y - lineHeight + padY, w, lineHeight - 2, 6, 6, "F");
    setText(doc, COLOR.chipText);
    doc.text(item, x + padX, cursor.y - 4);
    x += w + gap;
  }
  cursor.y += 6;
}

function drawExperience(doc: jsPDF, cursor: Cursor) {
  drawSectionTitle(doc, cursor, "Experience");

  for (const exp of experiences) {
    ensureSpace(doc, cursor, 60);

    // Role
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    setText(doc, COLOR.ink);
    doc.text(exp.role, MARGIN_X, cursor.y);

    // Period (right-aligned)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    setText(doc, COLOR.muted);
    doc.text(exp.period, PAGE_W - MARGIN_X, cursor.y, { align: "right" });

    cursor.y += 14;

    // Company · Location · Type
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    setText(doc, COLOR.accentDark);
    const meta = `${exp.company}  ·  ${exp.location}  ·  ${exp.type}`;
    doc.text(meta, MARGIN_X, cursor.y);
    cursor.y += 12;

    for (const h of exp.highlights) {
      drawBullet(doc, cursor, h);
    }

    if (exp.stack && exp.stack.length) {
      cursor.y += 2;
      drawChips(doc, cursor, exp.stack);
    }

    cursor.y += 8;
  }
}

function drawSummary(doc: jsPDF, cursor: Cursor) {
  drawSectionTitle(doc, cursor, "Summary");
  drawWrappedText(doc, cursor, profile.intro, {
    fontSize: 10.5,
    lineGap: 4,
    color: COLOR.text,
  });
  cursor.y += 4;
}

function drawSkills(doc: jsPDF, cursor: Cursor) {
  drawSectionTitle(doc, cursor, "Skills");
  for (const g of skillGroups) {
    ensureSpace(doc, cursor, 30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    setText(doc, COLOR.ink);
    doc.text(g.title.toUpperCase(), MARGIN_X, cursor.y);
    cursor.y += 10;
    drawChips(doc, cursor, g.items);
    cursor.y += 4;
  }
}

function drawProjects(doc: jsPDF, cursor: Cursor) {
  drawSectionTitle(doc, cursor, "Selected Projects");

  for (const p of projects) {
    ensureSpace(doc, cursor, 50);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    setText(doc, COLOR.ink);
    doc.text(p.name, MARGIN_X, cursor.y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    setText(doc, COLOR.muted);
    doc.text(`[${p.category}]`, PAGE_W - MARGIN_X, cursor.y, {
      align: "right",
    });
    cursor.y += 12;

    doc.setFont("helvetica", "italic");
    doc.setFontSize(9.5);
    setText(doc, COLOR.accentDark);
    doc.text(p.tagline, MARGIN_X, cursor.y);
    cursor.y += 12;

    drawWrappedText(doc, cursor, p.description, {
      fontSize: 9.5,
      lineGap: 2,
      color: COLOR.text,
    });

    if (p.link) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      setText(doc, COLOR.cyan);
      doc.textWithLink(`↳ ${p.link}`, MARGIN_X, cursor.y, { url: p.link });
      cursor.y += 12;
    }

    drawChips(doc, cursor, p.stack);
    cursor.y += 6;
  }
}

function drawEducation(doc: jsPDF, cursor: Cursor) {
  drawSectionTitle(doc, cursor, "Education");

  ensureSpace(doc, cursor, 32);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  setText(doc, COLOR.ink);
  doc.text(education.degree, MARGIN_X, cursor.y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setText(doc, COLOR.muted);
  doc.text(education.period, PAGE_W - MARGIN_X, cursor.y, { align: "right" });
  cursor.y += 14;

  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  setText(doc, COLOR.accentDark);
  doc.text(`${education.school} · ${education.location}`, MARGIN_X, cursor.y);
  cursor.y += 14;
}

export async function generateCV(): Promise<void> {
  const { default: JsPDF } = await import("jspdf");
  const doc = new JsPDF({
    unit: "pt",
    format: "a4",
    compress: true,
  });

  const cursor: Cursor = { y: MARGIN_TOP };

  drawHeader(doc, cursor);
  addPageFooter(doc);

  drawSummary(doc, cursor);
  drawExperience(doc, cursor);
  drawSkills(doc, cursor);
  drawProjects(doc, cursor);
  drawEducation(doc, cursor);

  // Re-stamp page numbers/footer on every page (page count may have grown)
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    // Clear the previous footer area by drawing a white rectangle
    setFill(doc, [255, 255, 255]);
    doc.rect(0, PAGE_H - 36, PAGE_W, 36, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    setText(doc, COLOR.muted);
    doc.text(
      `${profile.name}  ·  ${profile.email}`,
      MARGIN_X,
      PAGE_H - 20
    );
    doc.text(
      `Page ${i} of ${totalPages}`,
      PAGE_W - MARGIN_X,
      PAGE_H - 20,
      { align: "right" }
    );
  }

  const safeName = profile.name.replace(/\s+/g, "-");
  doc.save(`${safeName}-CV.pdf`);
}
