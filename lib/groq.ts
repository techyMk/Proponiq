import Groq from "groq-sdk";

let _client: Groq | null = null;

export function getGroq() {
  if (_client) return _client;
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error("GROQ_API_KEY is not set");
  _client = new Groq({ apiKey: key });
  return _client;
}

export const GROQ_DEFAULT_MODEL =
  process.env.GROQ_MODEL?.trim() || "llama-3.3-70b-versatile";
