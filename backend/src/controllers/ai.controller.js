import mongoose from 'mongoose';
import Exercise from '../models/exercise.model.js';
import ChatConversation from '../models/chatConversation.model.js';
import Mood from '../models/mood.model.js';
import { USER_MOOD_OPTIONS } from '../constants/moods.constants.js';
import { generateChatReply } from '../services/chatbot.service.js';
import {
  buildRecommendationResponse,
  generatePathUsingAStar,
  generatePathUsingBFS,
} from '../services/recommendation.service.js';

const MAX_CHAT_MESSAGE_LENGTH = 2000;

const createHttpError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const createConversationTitle = (message) => {
  const normalized = String(message || '').replace(/\s+/g, ' ').trim();

  if (!normalized) {
    return 'New Chat';
  }

  return normalized.length > 60 ? `${normalized.slice(0, 57).trim()}...` : normalized;
};

const createPreviewText = (message) => {
  const normalized = String(message || '').replace(/\s+/g, ' ').trim();
  return normalized.length > 150 ? `${normalized.slice(0, 147).trim()}...` : normalized;
};

const toMessageResponse = (message) => ({
  id: message._id,
  role: message.role,
  content: message.content,
  createdAt: message.createdAt,
});

const toConversationSummary = (conversation) => ({
  id: conversation._id,
  title: conversation.title,
  lastMessagePreview: conversation.lastMessagePreview,
  createdAt: conversation.createdAt,
  updatedAt: conversation.updatedAt,
});

const toConversationResponse = (conversation) => ({
  ...toConversationSummary(conversation),
  messages: conversation.messages.map(toMessageResponse),
});

const getRecommendations = async (req, res) => {
  try {
    const requestedMood = String(req.body.currentMood || '').trim();
    const algorithm = String(req.body.algorithm || 'a_star').trim().toLowerCase();
    const limit = Math.max(Number(req.body.limit) || 3, 1);

    const latestMoodEntry = await Mood.findOne({ userId: req.user.userId }).sort({ createdAt: -1 }).lean();
    const currentMood = requestedMood || latestMoodEntry?.mood || '';

    if (!USER_MOOD_OPTIONS.includes(currentMood)) {
      return res.status(400).json({
        success: false,
        message: 'A valid current mood is required to generate AI recommendations.',
      });
    }

    const exercises = await Exercise.find().sort({ createdAt: -1 }).lean();
    const recommendationBase = buildRecommendationResponse({ currentMood, exercises, limit });
    const bfsResult = await generatePathUsingBFS({
      currentMood,
      goalMood: recommendationBase.goalMood,
      exercises,
    });
    const aStarResult = await generatePathUsingAStar({
      currentMood,
      goalMood: recommendationBase.goalMood,
      exercises,
    });

    return res.status(200).json({
      success: true,
      message: 'AI recommendations generated successfully.',
      data: {
        algorithmUsed: algorithm === 'bfs' ? 'bfs' : 'a_star',
        ...recommendationBase,
        bfs: bfsResult,
        aStar: aStarResult,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to generate AI recommendations.',
      error: error.message,
    });
  }
};

const listChatConversations = async (req, res, next) => {
  try {
    const conversations = await ChatConversation.find({ userId: req.user.userId })
      .sort({ updatedAt: -1 })
      .select('_id title lastMessagePreview createdAt updatedAt')
      .lean();

    return res.status(200).json({
      items: conversations.map((conversation) => ({
        id: conversation._id,
        title: conversation.title,
        lastMessagePreview: conversation.lastMessagePreview,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
      })),
    });
  } catch (err) {
    return next(err);
  }
};

const getChatConversation = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.conversationId)) {
      throw createHttpError('Chat conversation not found.', 404);
    }

    const conversation = await ChatConversation.findOne({
      _id: req.params.conversationId,
      userId: req.user.userId,
    });

    if (!conversation) {
      throw createHttpError('Chat conversation not found.', 404);
    }

    return res.status(200).json({
      conversation: toConversationResponse(conversation),
    });
  } catch (err) {
    return next(err);
  }
};

const chatWithAssistant = async (req, res, next) => {
  try {
    const normalizedMessage = String(req.body.message || '').trim();
    const conversationId = String(req.body.conversationId || '').trim();

    if (!normalizedMessage) {
      throw createHttpError('message is required.', 400);
    }

    if (normalizedMessage.length > MAX_CHAT_MESSAGE_LENGTH) {
      throw createHttpError(`message must be ${MAX_CHAT_MESSAGE_LENGTH} characters or less.`, 400);
    }

    let conversation = null;

    if (conversationId) {
      if (!mongoose.isValidObjectId(conversationId)) {
        throw createHttpError('Chat conversation not found.', 404);
      }

      conversation = await ChatConversation.findOne({
        _id: conversationId,
        userId: req.user.userId,
      });

      if (!conversation) {
        throw createHttpError('Chat conversation not found.', 404);
      }
    }

    const messageHistory = [
      ...(conversation?.messages || []).map((message) => ({
        role: message.role,
        content: message.content,
      })),
      { role: 'user', content: normalizedMessage },
    ];

    const assistantReply = await generateChatReply(messageHistory);

    if (!conversation) {
      conversation = new ChatConversation({
        userId: req.user.userId,
        title: createConversationTitle(normalizedMessage),
        messages: [],
      });
    }

    conversation.messages.push({ role: 'user', content: normalizedMessage });
    conversation.messages.push({ role: 'assistant', content: assistantReply.text });
    conversation.lastMessagePreview = createPreviewText(assistantReply.text);

    if (!conversation.title || conversation.title === 'New Chat') {
      conversation.title = createConversationTitle(normalizedMessage);
    }

    await conversation.save();

    return res.status(200).json({
      message: 'AI chat reply generated successfully.',
      conversation: toConversationResponse(conversation),
      conversationSummary: toConversationSummary(conversation),
      assistantMessage: toMessageResponse(conversation.messages[conversation.messages.length - 1]),
      provider: assistantReply.provider,
      chatLimitReached: Boolean(assistantReply.chatLimitReached),
    });
  } catch (err) {
    return next(err);
  }
};

export { getRecommendations, listChatConversations, getChatConversation, chatWithAssistant };
