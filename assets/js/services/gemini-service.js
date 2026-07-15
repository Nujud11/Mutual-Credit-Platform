const GEMINI_PROXY_URL = "/api/gemini";

export async function askGemini(prompt) {
  if (typeof prompt !== "string" || !prompt.trim()) {
    throw new Error("لا يوجد محتوى لإرساله إلى Gemini.");
  }

  const response = await fetch(GEMINI_PROXY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: prompt.trim(),
    }),
  });

  const responseData = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.error("Gemini proxy response:", responseData);
    throw new Error(
      responseData?.error ?? "حدث خطأ أثناء الاتصال بخدمة التحليل الذكي.",
    );
  }

  const responseText = responseData?.text?.trim();

  if (!responseText) {
    throw new Error("لم ترجع خدمة التحليل الذكي نصًا.");
  }

  return responseText;
}
