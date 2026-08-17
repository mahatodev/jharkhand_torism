import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, Send, X, Minimize2, TreePine } from "lucide-react";

// 🚨 Replace with your Google Translate API Key
const API_KEY = "YOUR_GOOGLE_TRANSLATE_API_KEY";

// Emergency contacts
const emergencyInfo = `
🚨 Emergency Numbers:
🚑 Hospital: 102 (City Hospital, Ranchi)
👮 Police: 100 (Local Police Station)
`;

// ---------------- Tourism FAQ Dataset ----------------
const faqDatabase = [
  { keywords: ["waterfall", "hundru"], response: "💧 Hundru Falls is 322 ft high and beautiful during July–March." },
  { keywords: ["betla", "tiger", "safari"], response: "🐅 Betla National Park is famous for tigers, elephants, and safaris." },
  { keywords: ["netarhat", "sunset"], response: "🌄 Netarhat is known as 'Queen of Chotanagpur'. Sunset point is a must-see." },
  { keywords: ["patratu", "valley"], response: "🏞️ Patratu Valley has amazing lake and road trip views." },
  { keywords: ["food", "eat", "cuisine"], response: "🍛 Try Dhuska, Pittha, Rugra, Bamboo curry, Handia rice beer." },
  { keywords: ["festival", "culture"], response: "🎉 Sarhul, Sohrai, and Karma festivals show rich tribal traditions." },
  { keywords: ["safety"], response: "🛡️ Jharkhand is safe for tourists. For help, call Police 100 / Emergency 112." }
];

// ---------------- Translate Function ----------------
async function translateText(text: string, targetLang: string) {
  const res = await fetch(
    `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`,
    {
      method: "POST",
      body: JSON.stringify({ q: text, target: targetLang, format: "text" }),
      headers: { "Content-Type": "application/json" }
    }
  );
  const data = await res.json();
  return data.data.translations[0].translatedText;
}

// Detect language using Google API
async function detectLanguage(text: string) {
  const res = await fetch(
    `https://translation.googleapis.com/language/translate/v2/detect?key=${API_KEY}`,
    {
      method: "POST",
      body: JSON.stringify({ q: text }),
      headers: { "Content-Type": "application/json" }
    }
  );
  const data = await res.json();
  return data.data.detections[0][0].language;
}

// ---------------- Component ----------------
const FloatingChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<
    { id: number; text: string; sender: "user" | "bot" }[]
  >([
    {
      id: 1,
      text: "👋 Welcome to Jharkhand Tourism! Type 'help' for options.",
      sender: "bot"
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    }
  }, [messages, isTyping, isOpen, isMinimized]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    const userMsg = { id: Date.now(), text: userText, sender: "user" as const };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage("");
    setIsTyping(true);

    try {
      // Detect user language
      const userLang = await detectLanguage(userText);

      // Translate user text → English for dataset matching
      const userTextEn = await translateText(userText, "en");

      let botReply = "🤖 Sorry, I didn't understand. Please try again.";

      if (/hello|hi|hey/.test(userTextEn.toLowerCase())) {
        botReply = "Hello 👋! How can I assist you today?";
      } else if (/help/.test(userTextEn.toLowerCase())) {
        botReply =
          "I can guide you with:\n🏞️ Attractions\n🍛 Food\n🚌 Transport\n🌤️ Best time\n🚨 Emergency help";
      } else if (/emergency|police|hospital/.test(userTextEn.toLowerCase())) {
        botReply = emergencyInfo;
      } else {
        // Check FAQ database
        const faq = faqDatabase.find(f =>
          f.keywords.some(k => userTextEn.toLowerCase().includes(k))
        );
        if (faq) botReply = faq.response;
      }

      // Translate reply back into user language
      const translatedReply = await translateText(botReply, userLang);

      const botMsg = {
        id: Date.now() + 1,
        text: translatedReply,
        sender: "bot" as const
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error("Chatbot error:", err);
    }

    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl border transition-all ${
            isMinimized ? "w-80 h-16" : "w-96 h-[500px]"
          }`}
        >
          {/* Header */}
          <div className="bg-green-600 text-white p-3 rounded-t-2xl flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <TreePine className="w-5 h-5" />
              <span className="font-semibold text-sm">Tourism Assistant</span>
            </div>
            <div className="flex space-x-2">
              <button onClick={() => setIsMinimized(!isMinimized)}>
                <Minimize2 size={16} />
              </button>
              <button onClick={() => setIsOpen(false)}>
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages */}
          {!isMinimized && (
            <>
              <div className="h-80 overflow-y-auto p-3 bg-gray-50">
                {messages.map(m => (
                  <div key={m.id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                        m.sender === "user" ? "bg-green-600 text-white" : "bg-white border shadow-sm"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
                {isTyping && <p className="text-xs text-gray-400">Bot is typing...</p>}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t flex space-x-2">
                <textarea
                  value={inputMessage}
                  onChange={e => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your question..."
                  className="flex-1 border rounded-lg px-2 py-1 text-sm resize-none"
                  rows={1}
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim()}
                  className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
                >
                  <Send size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default FloatingChatbot;
