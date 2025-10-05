import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiX, FiSmile } from 'react-icons/fi';
import { io, Socket } from 'socket.io-client';

interface Message {
  id: string;
  username: string;
  message: string;
  timestamp: string;
  userId: string;
}

interface AmbientChatProps {
  streamId: string;
  lang: 'ar' | 'en';
  onClose?: () => void;
}

const AmbientChat: React.FC<AmbientChatProps> = ({ streamId, lang, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const translations = {
    ar: {
      chat: 'الدردشة المباشرة',
      typeMessage: 'اكتب رسالة...',
      send: 'إرسال',
      connecting: 'جاري الاتصال...',
      online: 'متصل',
    },
    en: {
      chat: 'Live Chat',
      typeMessage: 'Type a message...',
      send: 'Send',
      connecting: 'Connecting...',
      online: 'Online',
    }
  };

  const t = translations[lang];

  useEffect(() => {
    // Connect to WebSocket
    const newSocket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001');
    
    newSocket.on('connect', () => {
      setIsConnected(true);
      newSocket.emit('join-stream', {
        streamId,
        userId: 'user_' + Math.random().toString(36).substring(7),
      });
    });

    newSocket.on('chat-message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    setSocket(newSocket);

    // Mock messages for demo
    const mockMessages: Message[] = [
      {
        id: '1',
        username: 'ProGamer123',
        message: lang === 'ar' ? 'مرحباً بالجميع!' : 'Hello everyone!',
        timestamp: new Date().toISOString(),
        userId: 'user1',
      },
      {
        id: '2',
        username: 'GameMaster',
        message: lang === 'ar' ? 'هذه اللعبة رائعة!' : 'This game is amazing!',
        timestamp: new Date().toISOString(),
        userId: 'user2',
      },
    ];
    setMessages(mockMessages);

    return () => {
      newSocket.close();
    };
  }, [streamId, lang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!inputMessage.trim() || !socket) return;

    const message = {
      streamId,
      userId: 'current_user',
      username: 'أنت', // You
      message: inputMessage,
    };

    socket.emit('chat-message', message);
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="glass-panel rounded-xl h-[600px] flex flex-col">
      
      {/* Chat Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="font-bold text-white">{t.chat}</h3>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-energy animate-pulse-live' : 'bg-gray-500'}`} />
            <span className="text-xs text-white/60">
              {isConnected ? t.online : t.connecting}
            </span>
          </div>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-cosmic-navy flex items-center justify-center transition-colors"
          >
            <FiX className="text-white/60 hover:text-white" />
          </button>
        )}
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className="animate-fade-in">
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-gradient-oasis flex-shrink-0 flex items-center justify-center text-midnight-black font-bold text-sm">
                {msg.username.charAt(0)}
              </div>
              
              {/* Message Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-semibold text-emerald-energy text-sm">{msg.username}</span>
                  <span className="text-xs text-white/40">
                    {new Date(msg.timestamp).toLocaleTimeString(lang === 'ar' ? 'ar-AE' : 'en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <p className="text-white/90 text-sm break-words">{msg.message}</p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t.typeMessage}
              className="w-full px-4 py-3 bg-cosmic-navy border border-emerald-energy/20 rounded-lg 
                       focus:border-emerald-energy focus:outline-none focus:ring-2 focus:ring-emerald-energy/30
                       text-white placeholder-gray-400 resize-none transition-all"
              rows={1}
              style={{ maxHeight: '100px' }}
            />
            
            {/* Emoji Button */}
            <button className="absolute bottom-3 left-3 text-white/40 hover:text-emerald-energy transition-colors">
              <FiSmile className="text-xl" />
            </button>
          </div>

          {/* Send Button */}
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim()}
            className="px-6 py-3 bg-gradient-oasis rounded-lg text-midnight-black font-bold
                     hover:shadow-glow-emerald transition-all disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center gap-2"
          >
            <FiSend />
            <span className="hidden sm:inline">{t.send}</span>
          </button>
        </div>

        {/* Chat Rules */}
        <p className="text-xs text-white/40 mt-2 text-center">
          {lang === 'ar' ? 'كن محترماً ومهذباً في الدردشة' : 'Be respectful and kind in chat'}
        </p>
      </div>

    </div>
  );
};

export default AmbientChat;

