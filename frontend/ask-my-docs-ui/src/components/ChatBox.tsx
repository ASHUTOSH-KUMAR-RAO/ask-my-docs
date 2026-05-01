import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Send, Share2, MoreHorizontal, PanelLeftOpen, X, Trash2, Download, Copy, Check } from "lucide-react";
import MessageBubble from "@/components/MessageBubble";
import { useChat } from "../hooks/useChat";

interface ChatBoxProps {
  onToggleSidebar?: () => void;
  sidebarOpen?: boolean;
  documentId: string | null;
}

const ChatBox = ({ onToggleSidebar, sidebarOpen, documentId }: ChatBoxProps) => {
  const { messages, loading, sendMessage } = useChat(documentId || "");
  const [input, setInput] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSend = () => {
    if (!input.trim() || !documentId) return;
    sendMessage(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── 3 dot menu features ──

  const handleClearChat = () => {
    if (confirm("Clear all messages?")) {
      window.location.reload(); // simple reload se clear
    }
    setMenuOpen(false);
  };

  const handleDownload = () => {
    const text = messages
      .map((m) => `${m.role === "user" ? "You" : "Assistant"}: ${m.content}`)
      .join("\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "conversation.txt";
    a.click();
    URL.revokeObjectURL(url);
    setMenuOpen(false);
  };

  const handleCopyAll = () => {
    const text = messages
      .map((m) => `${m.role === "user" ? "You" : "Assistant"}: ${m.content}`)
      .join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setMenuOpen(false);
  };

  // ── Share feature ──
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
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
        {/* Left side */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {!sidebarOpen && onToggleSidebar && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={onToggleSidebar}
              style={{
                width: 28, height: 28, borderRadius: 7,
                border: "1px solid var(--border)",
                backgroundColor: "transparent",
                color: "var(--text-secondary)",
                cursor: "pointer", display: "flex",
                alignItems: "center", justifyContent: "center", marginRight: 2,
              }}
            >
              <PanelLeftOpen size={14} />
            </motion.button>
          )}

          {/* Logo - chat.jpg */}
          <img
            src="/chat.jpg"
            alt="logo"
            style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover" }}
          />

          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
            Ask My Docs Chat Assistant
          </span>
          {/* FREE badge removed */}
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, position: "relative" }}>

          {/* Share Button */}
          <button
            onClick={handleShare}
            style={{
              fontSize: 12, fontWeight: 500,
              color: "var(--text-secondary)",
              border: "1px solid var(--border-subtle)",
              backgroundColor: "transparent",
              padding: "4px 12px", borderRadius: 6,
              cursor: "pointer", display: "flex",
              alignItems: "center", gap: 5,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--card-bg)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <Share2 size={12} />
            Share
          </button>

          {/* 3 Dot Menu */}
          <div ref={menuRef} style={{ position: "relative" }}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                width: 30, height: 30, borderRadius: 6,
                border: "1px solid var(--border)",
                backgroundColor: menuOpen ? "var(--card-bg)" : "transparent",
                color: "var(--text-secondary)",
                cursor: "pointer", display: "flex",
                alignItems: "center", justifyContent: "center",
              }}
            >
              <MoreHorizontal size={15} />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: "absolute",
                    top: 36,
                    right: 0,
                    width: 200,
                    backgroundColor: "var(--card-bg)",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    overflow: "hidden",
                    zIndex: 100,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                  }}
                >
                  {/* Clear Chat */}
                  <button
                    onClick={handleClearChat}
                    style={{
                      width: "100%", display: "flex", alignItems: "center",
                      gap: 10, padding: "10px 14px",
                      backgroundColor: "transparent",
                      border: "none", color: "#EF4444",
                      cursor: "pointer", fontSize: 13,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--background)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <Trash2 size={14} />
                    Clear Chat
                  </button>

                  <div style={{ height: 1, backgroundColor: "var(--border)" }} />

                  {/* Download Conversation */}
                  <button
                    onClick={handleDownload}
                    style={{
                      width: "100%", display: "flex", alignItems: "center",
                      gap: 10, padding: "10px 14px",
                      backgroundColor: "transparent",
                      border: "none", color: "var(--text-primary)",
                      cursor: "pointer", fontSize: 13,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--background)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <Download size={14} />
                    Download Conversation
                  </button>

                  <div style={{ height: 1, backgroundColor: "var(--border)" }} />

                  {/* Copy All Messages */}
                  <button
                    onClick={handleCopyAll}
                    style={{
                      width: "100%", display: "flex", alignItems: "center",
                      gap: 10, padding: "10px 14px",
                      backgroundColor: "transparent",
                      border: "none", color: "var(--text-primary)",
                      cursor: "pointer", fontSize: 13,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--background)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    {copied ? <Check size={14} color="#4ade80" /> : <Copy size={14} />}
                    {copied ? "Copied!" : "Copy All Messages"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Messages Area ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 8px" }}>
        {!documentId && (
          <div style={{ textAlign: "center", marginTop: 60, color: "var(--text-muted)", fontSize: 13 }}>
            Select a document from the sidebar to start chatting
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            role={msg.role}
            content={msg.content}
            citations={msg.citations}
          />
        ))}

        {loading && (
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <img
              src="/chat.jpg"
              alt="logo"
              style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
            />
            <div style={{
              display: "flex", alignItems: "center", gap: 4,
              padding: "10px 14px", backgroundColor: "var(--card-bg)",
              borderRadius: "2px 12px 12px 12px",
            }}>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                  style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#4ade80" }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input Bar ── */}
      <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", flexShrink: 0 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          backgroundColor: "var(--card-bg)",
          border: "1px solid var(--border)",
          borderRadius: 12, padding: "8px 12px",
        }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={documentId ? "Message Ask My Docs..." : "Select a document first..."}
            disabled={!documentId}
            style={{
              flex: 1, backgroundColor: "transparent",
              border: "none", outline: "none",
              fontSize: 13, color: "var(--text-primary)",
              caretColor: "#4ade80",
            }}
          />
          <button style={{
            width: 30, height: 30, borderRadius: 7,
            border: "none", backgroundColor: "transparent",
            color: "var(--text-secondary)", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Mic size={15} />
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!input.trim() || !documentId}
            style={{
              width: 32, height: 32, borderRadius: 8, border: "none",
              backgroundColor: input.trim() && documentId ? "#22c55e" : "var(--border)",
              color: "white",
              cursor: input.trim() && documentId ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.2s", flexShrink: 0,
            }}
          >
            <Send size={14} />
          </motion.button>
        </div>
        <p style={{ textAlign: "center", fontSize: 10.5, color: "var(--text-muted)", marginTop: 8 }}>
          Ask My Docs can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
};

export default ChatBox;
