import express from "express";
import helmet from "helmet";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";
const GEMINI_API_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

app.disable("x-powered-by");
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }),
);
app.use(express.json({ limit: "100kb" }));

// Lightweight in-memory rate limit suitable for a prototype/demo.
const requestLog = new Map();
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 10;

function isRateLimited(ip) {
  const now = Date.now();
  const recent = (requestLog.get(ip) || []).filter(
    (timestamp) => now - timestamp < WINDOW_MS,
  );

  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    requestLog.set(ip, recent);
    return true;
  }

  recent.push(now);
  requestLog.set(ip, recent);
  return false;
}

app.get("/health", (_request, response) => {
  response.status(200).json({ status: "ok" });
});

app.post("/api/gemini", async (request, response) => {
  try {
    if (!GEMINI_API_KEY) {
      return response.status(503).json({
        error: "مفتاح Gemini غير مضبوط على الخادم.",
      });
    }

    const clientIp = request.ip || request.socket.remoteAddress || "unknown";
    if (isRateLimited(clientIp)) {
      return response.status(429).json({
        error: "تم تجاوز عدد محاولات التحليل المسموح بها مؤقتًا. حاول بعد دقيقة.",
      });
    }

    const prompt = request.body?.prompt;
    if (typeof prompt !== "string" || !prompt.trim()) {
      return response.status(400).json({
        error: "نص التحليل مطلوب.",
      });
    }

    if (prompt.length > 25_000) {
      return response.status(413).json({
        error: "نص التحليل أكبر من الحد المسموح.",
      });
    }

    const geminiResponse = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt.trim() }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1200,
          responseMimeType: "application/json",
        },
      }),
    });

    const data = await geminiResponse.json().catch(() => ({}));

    if (!geminiResponse.ok) {
      console.error("Gemini API error:", data);
      return response.status(geminiResponse.status).json({
        error: data?.error?.message || "تعذر إكمال التحليل الذكي.",
      });
    }

    const text = data?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("")
      .trim();

    if (!text) {
      return response.status(502).json({
        error: "لم يرجع Gemini نتيجة صالحة.",
      });
    }

    return response.status(200).json({ text });
  } catch (error) {
    console.error("Gemini proxy failure:", error);
    return response.status(500).json({
      error: "حدث خطأ داخلي أثناء التحليل الذكي.",
    });
  }
});

app.use(
  express.static(__dirname, {
    extensions: ["html"],
  }),
);

app.get("/{*splat}", (_request, response) => {
  response.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Moqasah is running on port ${port}`);
});
