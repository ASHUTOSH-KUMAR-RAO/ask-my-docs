import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Mic, Send, Share2, MoreHorizontal, PanelLeftOpen } from "lucide-react";
import MessageBubble from "@/components/MessageBubble";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  bullets?: string[];
  citation?: {
    filename: string;
    page: number;
    quote: string;
  };
}

const DEMO_MESSAGES: Message[] = [
  {
    id: 1,
    role: "user",
    content: "What is GST return filing?",
  },
  {
    id: 2,
    role: "assistant",
    content:
      "GST return filing is a process where businesses submit their tax details to the government. Here's what you need to know:",
    bullets: [
      "GSTR-1 for outward supplies",
      "GSTR-3B for monthly summary",
      "Annual return via GSTR-9",
    ],
    citation: {
      filename: "GST_Handbook_2024.pdf",
      page: 12,
      quote:
        "Every registered taxpayer must file returns monthly, quarterly, or annually depending on their turnover.",
    },
  },
];

interface ChatBoxProps {
  onToggleSidebar?: () => void;
  sidebarOpen?: boolean;
}

const ChatBox = ({ onToggleSidebar, sidebarOpen }: ChatBoxProps) => {
  const [messages, setMessages] = useState<Message[]>(DEMO_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulated reply
    setTimeout(() => {
      const botMsg: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content:
          "I found relevant information in your documents. Here's a summary based on the uploaded files:",
        bullets: [
          "Section 80C allows deductions up to ₹1.5 lakh",
          "Eligible investments include PPF, ELSS, LIC premiums",
          "Deduction reduces taxable income directly",
        ],
        citation: {
          filename: "ITR_Guide_2024.pdf",
          page: 5,
          quote:
            "Deductions under Section 80C are available to both individuals and Hindu Undivided Families.",
        },
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, botMsg]);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--chat-bg)",
        overflow: "hidden",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 18px",
          borderBottom: "1px solid var(--border)",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Show toggle button only when sidebar is closed */}
          {!sidebarOpen && onToggleSidebar && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={onToggleSidebar}
              style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                border: "1px solid var(--border)",
                backgroundColor: "transparent",
                color: "var(--text-secondary)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 2,
              }}
            >
              <PanelLeftOpen size={14} />
            </motion.button>
          )}
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "var(--text-primary)",
            }}
          >
            Ask My Docs Chat Assistant
          </span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              border: "1px solid var(--border-subtle)",
              color: "var(--text-secondary)",
              padding: "2px 8px",
              borderRadius: 5,
              letterSpacing: "0.05em",
            }}
          >
            FREE
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: "var(--text-secondary)",
              border: "1px solid var(--border-subtle)",
              backgroundColor: "transparent",
              padding: "4px 12px",
              borderRadius: 6,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--card-bg)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <Share2 size={12} />
            Share
          </button>
          <button
            style={{
              width: 30,
              height: 30,
              borderRadius: 6,
              border: "1px solid var(--border)",
              backgroundColor: "transparent",
              color: "var(--text-secondary)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--card-bg)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <MoreHorizontal size={15} />
          </button>
        </div>
      </div>

      {/* ── Messages Area ── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px 20px 8px",
        }}
      >
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            role={msg.role}
            content={msg.content}
            bullets={msg.bullets}
            citation={msg.citation}
          />
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #4ade80, #16a34a)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="13" height="13" fill="white" viewBox="0 0 24 24">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "10px 14px",
                backgroundColor: "var(--card-bg)",
                borderRadius: "2px 12px 12px 12px",
              }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: "#4ade80",
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input Bar ── */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid var(--border)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: "8px 12px",
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Ask My Docs..."
            style={{
              flex: 1,
              backgroundColor: "transparent",
              border: "none",
              outline: "none",
              fontSize: 13,
              color: "var(--text-primary)",
              caretColor: "#4ade80",
            }}
          />
          <button
            style={{
              width: 30,
              height: 30,
              borderRadius: 7,
              border: "none",
              backgroundColor: "transparent",
              color: "var(--text-secondary)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--text-primary)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--text-secondary)")
            }
          >
            <Mic size={15} />
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!input.trim()}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: "none",
              backgroundColor: input.trim() ? "#22c55e" : "var(--border)",
              color: "white",
              cursor: input.trim() ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s",
              flexShrink: 0,
            }}
          >
            <Send size={14} />
          </motion.button>
        </div>
        <p
          style={{
            textAlign: "center",
            fontSize: 10.5,
            color: "var(--text-muted)",
            marginTop: 8,
          }}
        >
          Ask My Docs can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
};

export default ChatBox;




