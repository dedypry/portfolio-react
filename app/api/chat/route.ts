import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildSystemPrompt } from "@/lib/systemPrompt";

export const runtime = "edge";
export const preferredRegion = "auto";
export const dynamic = "force-dynamic";

type ClientRole = "user" | "assistant";

interface ClientMessage {
  role: ClientRole;
  content: string;
}

interface ChatRequestBody {
  messages: ClientMessage[];
  lang?: "en" | "id";
}

const MAX_HISTORY = 12;
const MAX_MESSAGE_CHARS = 4000;

function jsonError(status: number, message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: Request): Promise<Response> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return jsonError(
      500,
      "GEMINI_API_KEY is not configured on the server. Add it to .env.local (dev) or your hosting provider's env vars (prod)."
    );
  }

  let body: ChatRequestBody;
  try {
    body = (await req.json()) as ChatRequestBody;
  } catch {
    return jsonError(400, "Invalid JSON body");
  }

  if (!body || !Array.isArray(body.messages) || body.messages.length === 0) {
    return jsonError(400, "Missing 'messages' array");
  }

  const lang = body.lang === "id" ? "id" : "en";

  const safeHistory = body.messages
    .filter(
      (msg): msg is ClientMessage =>
        !!msg &&
        (msg.role === "user" || msg.role === "assistant") &&
        typeof msg.content === "string" &&
        msg.content.trim().length > 0
    )
    .slice(-MAX_HISTORY)
    .map((msg) => ({
      role: msg.role === "assistant" ? ("model" as const) : ("user" as const),
      parts: [{ text: msg.content.slice(0, MAX_MESSAGE_CHARS) }],
    }));

  // Gemini requires history to start with a user message. Be defensive against
  // stale browser histories or custom clients that accidentally send an
  // assistant-only conversation.
  const firstUserIndex = safeHistory.findIndex((entry) => entry.role === "user");
  const normalizedHistory = firstUserIndex === -1 ? [] : safeHistory.slice(firstUserIndex);

  if (normalizedHistory.length === 0) {
    return jsonError(400, "First message must come from the visitor.");
  }

  const lastEntry = normalizedHistory[normalizedHistory.length - 1];
  if (lastEntry.role !== "user") {
    return jsonError(400, "Last message must come from the visitor.");
  }

  const history = normalizedHistory.slice(0, -1);
  const lastUserText = lastEntry.parts[0].text;

  const modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: buildSystemPrompt(lang),
    generationConfig: {
      // Higher temperature = more personality. We pair it with a strict
      // system prompt so the model stays factual but speaks more naturally.
      temperature: 0.85,
      topP: 0.95,
      maxOutputTokens: 700,
    },
  });

  const chat = model.startChat({ history });

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const result = await chat.sendMessageStream(lastUserText);
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) controller.enqueue(encoder.encode(text));
        }
        controller.close();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unexpected upstream error";
        controller.enqueue(encoder.encode(`\n\n__ERROR__:${message.replace(/\n/g, " ")}`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
