import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserNavbar from '../../components/UserNavbar';
import { aiApi } from '../../services/relaxaApi.js';
import { toggleZenMode } from '../../utils/zenMode.js';
import './ChatPage.css';

const STARTER_PROMPTS = [
  'I feel stressed today. Can you help me calm down?',
  'Give me a short breathing exercise for anxiety.',
  'Can we talk through what to do when I feel overwhelmed?',
  'Suggest a gentle night routine for better sleep.',
];

const upsertConversationSummary = (items, nextSummary) => [
  nextSummary,
  ...items.filter((item) => item.id !== nextSummary.id),
];

function ChatPage() {
  const navigate = useNavigate();
  const scrollAnchorRef = useRef(null);
  const token = localStorage.getItem('relaxaToken');
  const userName = localStorage.getItem('relaxaUserName') || 'there';

  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState('');
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [pageError, setPageError] = useState('');
  const [pageMessage, setPageMessage] = useState('');
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [isConversationLoading, setIsConversationLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [chatLimitReached, setChatLimitReached] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const starterPrompts = useMemo(() => STARTER_PROMPTS, []);

  const loadConversation = useCallback(
    async (conversationId) => {
      if (!token || !conversationId) {
        return;
      }

      try {
        setIsConversationLoading(true);
        setPageError('');
        const response = await aiApi.getConversation({ token, conversationId });
        setActiveConversationId(response.conversation.id);
        setMessages(response.conversation.messages || []);
        setHistoryOpen(false);
        setChatLimitReached(
          response.conversation.messages?.some((message) =>
            String(message.content || '').includes('Relaxa AI chat limit has been reached')
          )
        );
      } catch (error) {
        setPageError(error.message);
      } finally {
        setIsConversationLoading(false);
      }
    },
    [token]
  );

  const loadConversationList = useCallback(async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setIsHistoryLoading(true);
      setPageError('');
      const response = await aiApi.listConversations({ token });
      const items = response.items || [];
      setConversations(items);

      if (items.length > 0) {
        await loadConversation(items[0].id);
      } else {
        setActiveConversationId('');
        setMessages([]);
        setPageMessage('Start a new conversation with Relaxa AI.');
      }
    } catch (error) {
      setPageError(error.message);
    } finally {
      setIsHistoryLoading(false);
    }
  }, [loadConversation, navigate, token]);

  useEffect(() => {
    loadConversationList();
  }, [loadConversationList]);

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isConversationLoading, isSending]);

  const handleStartNewChat = () => {
    setActiveConversationId('');
    setMessages([]);
    setDraft('');
    setPageError('');
    setPageMessage('New chat ready. Tell Relaxa how you feel.');
    setChatLimitReached(false);
  };

  const handleSendMessage = async (presetMessage = '') => {
    if (!token || isSending) {
      return;
    }

    const messageToSend = String(presetMessage || draft).trim();

    if (!messageToSend) {
      return;
    }

    const tempUserMessage = {
      id: `temp-user-${Date.now()}`,
      role: 'user',
      content: messageToSend,
    };

    const tempAssistantMessage = {
      id: `temp-assistant-${Date.now()}`,
      role: 'assistant',
      content: 'Relaxa is thinking...',
      isTemporary: true,
    };

    setDraft('');
    setPageError('');
    setPageMessage('');
    setIsSending(true);
    setMessages((prev) => [...prev, tempUserMessage, tempAssistantMessage]);

    try {
      const response = await aiApi.chat({
        token,
        message: messageToSend,
        conversationId: activeConversationId,
      });

      setActiveConversationId(response.conversation.id);
      setMessages(response.conversation.messages || []);
      setChatLimitReached(Boolean(response.chatLimitReached));
      setConversations((prev) => upsertConversationSummary(prev, response.conversationSummary));
    } catch (error) {
      setMessages((prev) => prev.filter((message) => !message.isTemporary && message.id !== tempUserMessage.id));
      setDraft(messageToSend);
      setPageError(error.message);
    } finally {
      setIsSending(false);
    }
  };

  const handleComposerKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-page">
      <UserNavbar />

      <div className="chat-layout">
        {historyOpen ? (
          <button
            type="button"
            className="chat-history-backdrop"
            aria-label="Close chat history"
            onClick={() => setHistoryOpen(false)}
          />
        ) : null}

        <aside className={`chat-sidenav ${historyOpen ? 'chat-sidenav--open' : ''}`}>
          <div className="chat-sidenav-head">
            <div className="assistant-icon">
              <span className="material-symbols-outlined">auto_awesome</span>
            </div>
            <div>
              <h2>Zen Assistant</h2>
              <p>Private, saved AI conversations</p>
            </div>
          </div>

          <button
            type="button"
            className={`chat-side-btn ${!activeConversationId ? 'active' : ''}`}
            onClick={() => {
              handleStartNewChat();
              setHistoryOpen(false);
            }}
          >
            <span className="material-symbols-outlined">add_comment</span>
            New Chat
          </button>

          <div className="chat-history-section">
            <p className="chat-history-label">Chat History</p>

            {isHistoryLoading ? (
              <p className="chat-history-state">Loading chats...</p>
            ) : conversations.length ? (
              <div className="chat-history-list">
                {conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    type="button"
                    className={`chat-history-item ${conversation.id === activeConversationId ? 'active' : ''}`}
                    onClick={() => {
                      loadConversation(conversation.id);
                      setHistoryOpen(false);
                    }}
                  >
                    <strong>{conversation.title}</strong>
                    <span>{conversation.lastMessagePreview || 'Open this conversation'}</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="chat-history-state">No saved chats yet.</p>
            )}
          </div>
        </aside>

        <main className="chat-main">
          <div className="chat-mobile-toolbar">
            <button type="button" className="chat-history-toggle" onClick={() => setHistoryOpen(true)}>
              <span className="material-symbols-outlined">history</span>
              History
            </button>
            <span className="chat-mobile-title">Relaxa AI</span>
          </div>

          <div className="chat-scroll">
            {!messages.length && !isConversationLoading ? (
              <>
                <section className="chat-welcome-card">
                  <div className="assistant-avatar">
                    <span className="material-symbols-outlined">auto_awesome</span>
                  </div>
                  <div>
                    <p className="chat-welcome-eyebrow">Relaxa AI</p>
                    <h3>Hi {userName}, what would you like to talk about today?</h3>
                    <p className="chat-welcome-copy">
                      You can vent, ask for calming ideas, talk through stress, or ask for a simple wellness plan.
                    </p>
                  </div>
                </section>

                <div className="suggestion-grid">
                  {starterPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      className="chat-suggestion-card"
                      onClick={() => handleSendMessage(prompt)}
                    >
                      <span className="material-symbols-outlined">lightbulb</span>
                      <span>{prompt}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : isConversationLoading ? (
              <p className="chat-state-message">Loading conversation...</p>
            ) : (
              messages.map((message) => (
                <div key={message.id} className={`message-row ${message.role === 'user' ? 'user' : 'ai'}`}>
                  {message.role === 'assistant' ? (
                    <div className="assistant-avatar">
                      <span className="material-symbols-outlined">auto_awesome</span>
                    </div>
                  ) : null}

                  <div className={`message-bubble ${message.role === 'user' ? 'user-bubble' : 'ai-bubble'}`}>
                    {message.content}
                  </div>

                  {message.role === 'user' ? (
                    <div className="message-avatar user-avatar">
                      <span className="material-symbols-outlined">account_circle</span>
                    </div>
                  ) : null}
                </div>
              ))
            )}

            {chatLimitReached ? (
              <div className="chat-limit-cta">
                <p>AI chat is temporarily unavailable.</p>
                <Link to="/exercises" className="chat-exercises-link">
                  <span className="material-symbols-outlined">self_improvement</span>
                  Go to Exercises
                </Link>
              </div>
            ) : null}

            {pageError ? <p className="chat-feedback chat-feedback--error">{pageError}</p> : null}
            {pageMessage ? <p className="chat-feedback chat-feedback--info">{pageMessage}</p> : null}
            <div ref={scrollAnchorRef} />
          </div>

          <div className="chat-input-area">
            <div className="chat-input-wrap">
              <textarea
                rows="1"
                placeholder={
                  chatLimitReached ? 'AI chat limit reached — try Exercises or come back later' : 'Ask Relaxa AI how you feel...'
                }
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={handleComposerKeyDown}
                disabled={isSending || chatLimitReached}
              />
              <div className="input-actions">
                <button
                  type="button"
                  className="send-btn"
                  onClick={() => handleSendMessage()}
                  disabled={isSending || chatLimitReached}
                >
                  <span className="material-symbols-outlined">{isSending ? 'hourglass_top' : 'send'}</span>
                </button>
              </div>
            </div>
            <p className="chat-disclaimer">
              Relaxa AI can support your wellness journey but is not a substitute for professional medical or mental
              health care.
            </p>
          </div>
        </main>
      </div>

      <button className="chat-zen-fab" type="button" onClick={toggleZenMode}>
        <span className="material-symbols-outlined">self_improvement</span>
      </button>
    </div>
  );
}

export default ChatPage;
