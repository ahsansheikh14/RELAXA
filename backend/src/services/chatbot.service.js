const DEFAULT_GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
const GEMINI_API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

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

const isDevelopment = process.env.NODE_ENV !== 'production';

const isPlaceholderKey = (value = '') => {
  const normalized = String(value).trim().toLowerCase();
  return !normalized || normalized.includes('replace_with_') || normalized.includes('your_');
};

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

const buildFallbackReply = (messages) => {
  const latestUserMessage =
    [...messages].reverse().find((message) => message.role === 'user')?.content?.trim() || 'I need support right now.';
  const normalized = latestUserMessage.toLowerCase();

  if (/(stress|overwhelm|overwhelmed|pressure|busy)/.test(normalized)) {
    return [
      'That sounds like a lot to carry at once. When everything feels piled up, the mind starts treating every task like an emergency.',
      '',
      'For this moment, try softening your shoulders and taking one slower breath than usual. Then choose only one next step, even if it is tiny. You do not need to solve the whole day right now.',
      '',
      'If you want, tell me what is overwhelming you most and I will help you sort it out calmly.',
    ].join('\n');
  }

  if (/(anxious|anxiety|panic|worried|fear)/.test(normalized)) {
    return [
      'I can hear the anxiety in that, and I am really glad you said it instead of sitting with it alone.',
      '',
      'Try this with me: breathe in for 4, hold for 4, and breathe out for 6. Do that a few times. Then look around and name 3 things you can see. That can help bring your body back into the present.',
      '',
      'Do you want to tell me what is making you feel anxious right now?',
    ].join('\n');
  }

  if (/(sleep|tired|exhausted|insomnia)/.test(normalized)) {
    return [
      'You sound drained, and when someone is that tired, even small things can feel heavier than usual.',
      '',
      'Tonight, try to make the next 20 minutes quieter rather than more productive. Dim the screen, loosen your body a little, and let your brain step out of problem-solving mode.',
      '',
      'If you want, I can help you build a very simple relaxing night routine.',
    ].join('\n');
  }

  if (/(sad|low|down|lonely|empty)/.test(normalized)) {
    return [
      'I am sorry you are feeling like this. Low days can make everything feel distant, heavy, or flat.',
      '',
      'You do not have to fix the whole feeling right away. A gentle step can be enough for now, like drinking water, sitting near daylight, or messaging one safe person.',
      '',
      'If you want to talk, I am here. Was something specific behind this feeling today, or has it just been building up?',
    ].join('\n');
  }

  if (/(angry|frustrated|annoyed|irritated)/.test(normalized)) {
    return [
      'That frustration makes sense. When something keeps pressing on you, the body holds that tension very quickly.',
      '',
      'Before reacting, give yourself a small pause if you can. Even one minute of walking, slower breathing, or stepping away can stop the feeling from getting even bigger.',
      '',
      'Do you want to tell me what triggered it?',
    ].join('\n');
  }

  return [
    'I am here with you. Thank you for sharing that with me.',
    '',
    'We can talk this through slowly. If it helps, tell me what has been sitting heaviest on your mind today, and I will respond in a calmer and more supportive way.',
    '',
    'You do not have to handle everything at once.',
  ].join('\n');
};

const generateChatReply = async (messages) => {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  const normalizedMessages = normalizeMessages(messages).slice(-12);

  if (!normalizedMessages.length) {
    throw createHttpError('At least one user message is required to generate a chat reply.', 400);
  }

  if (isPlaceholderKey(geminiApiKey)) {
    if (isDevelopment) {
      return {
        text: buildFallbackReply(normalizedMessages),
        provider: 'local-demo',
        model: 'relaxa-fallback',
      };
    }

    throw createHttpError('Gemini API key is missing. Add GEMINI_API_KEY in backend/.env to enable AI chat.', 503);
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

    if (isDevelopment && /api key|invalid|permission|unauthorized/i.test(providerMessage)) {
      return {
        text: buildFallbackReply(normalizedMessages),
        provider: 'local-demo',
        model: 'relaxa-fallback',
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
  };
};

export { generateChatReply };
