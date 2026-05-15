const DEFAULT_GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
const GEMINI_API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

export const CHAT_LIMIT_REACHED_MESSAGE =
  "Relaxa AI chat limit has been reached for now. Please try again later. In the meantime, you can ease yourself by exploring the Exercises section — breathing, grounding, and mood-based activities are ready for you there.";

const SYSTEM_PROMPT = `
You are Relaxa AI, a calm and supportive mental wellness chat assistant inside the Relaxa app.

Your role:
- Listen empathetically and respond in a warm, clear, non-judgmental tone.
- Talk like a caring, emotionally intelligent wellness companion, not like a cold tool.
- Help users with stress, overwhelm, sadness, anxiety, loneliness, mood check-ins, breathing ideas, grounding techniques, journaling prompts, and gentle self-care suggestions.
- Start by acknowledging the person's feeling in a natural human way before giving suggestions.
- Keep replies practical and easy to follow, but also emotionally comforting.
- Prefer natural short paragraphs over rigid bullet lists unless a list is clearly helpful.
- Offer 2 or 3 thoughtful ideas when useful, not just one short command.
- Ask one gentle follow-up question when it would help continue the conversation.
- Do not push exercises in every answer. Suggest breathing, grounding, journaling, reframing, or rest only when they fit the user's situation.
- Do not mention internal implementation details, algorithms, or model names.

Safety rules:
- You are not a doctor, therapist, or crisis counselor.
- Do not diagnose medical or mental health conditions.
- If the user seems in crisis, mentions self-harm, suicide, or danger, respond with empathy and strongly encourage them to contact local emergency services, a crisis hotline, or a trusted person immediately.
- In risky situations, prioritize safety over general wellness tips.
`.trim();

const createHttpError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const isPlaceholderKey = (value = '') => {
  const normalized = String(value).trim().toLowerCase();
  return !normalized || normalized.includes('replace_with_') || normalized.includes('your_');
};

const isQuotaLimitError = (message = '') =>
  /quota|rate.?limit|resource.?exhaust|limit reached|exceeded|too many requests|429/i.test(message);

const normalizeMessages = (messages = []) =>
  messages
    .map((message) => ({
      role: message?.role === 'assistant' ? 'assistant' : 'user',
      content: String(message?.content || '').trim(),
    }))
    .filter((message) => message.content);

const mapMessagesToGeminiContents = (messages) =>
  messages.map((message) => ({
    role: message.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: message.content }],
  }));

const parseGeminiReply = (payload) => {
  const parts = payload?.candidates?.[0]?.content?.parts || [];
  const text = parts
    .map((part) => part?.text || '')
    .join('\n')
    .trim();

  return text;
};

const generateChatReply = async (messages) => {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  const normalizedMessages = normalizeMessages(messages).slice(-12);

  if (!normalizedMessages.length) {
    throw createHttpError('At least one user message is required to generate a chat reply.', 400);
  }

  if (isPlaceholderKey(geminiApiKey)) {
    throw createHttpError('AI chat is not configured yet. Add GEMINI_API_KEY in backend/.env to enable Relaxa AI.', 503);
  }

  const response = await fetch(`${GEMINI_API_BASE_URL}/${DEFAULT_GEMINI_MODEL}:generateContent?key=${geminiApiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      contents: mapMessagesToGeminiContents(normalizedMessages),
      generationConfig: {
        temperature: 0.8,
        topP: 0.95,
        maxOutputTokens: 700,
      },
    }),
  });

  let payload = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const providerMessage = payload?.error?.message || 'Gemini request failed.';

    if (isQuotaLimitError(providerMessage)) {
      return {
        text: CHAT_LIMIT_REACHED_MESSAGE,
        provider: 'limit-notice',
        model: DEFAULT_GEMINI_MODEL,
        chatLimitReached: true,
      };
    }

    throw createHttpError(providerMessage, response.status || 502);
  }

  const replyText = parseGeminiReply(payload);

  if (!replyText) {
    throw createHttpError('Gemini returned an empty response. Please try again.', 502);
  }

  return {
    text: replyText,
    provider: 'gemini',
    model: DEFAULT_GEMINI_MODEL,
    chatLimitReached: false,
  };
};

export { generateChatReply };
