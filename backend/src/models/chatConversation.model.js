import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true, trim: true, maxlength: 4000 },
  },
  { _id: true, timestamps: true }
);

const chatConversationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, trim: true, maxlength: 120, default: 'New Chat' },
    lastMessagePreview: { type: String, trim: true, maxlength: 180, default: '' },
    messages: {
      type: [chatMessageSchema],
      default: [],
    },
  },
  { timestamps: true }
);

chatConversationSchema.index({ userId: 1, updatedAt: -1 });

const ChatConversation = mongoose.model('ChatConversation', chatConversationSchema);

export default ChatConversation;
