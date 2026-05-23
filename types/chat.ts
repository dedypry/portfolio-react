export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  /** Optional error flag for assistant messages that failed mid-stream. */
  error?: boolean;
  createdAt: number;
}
