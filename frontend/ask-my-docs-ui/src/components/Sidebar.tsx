import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageSquare,
  Library,
  Compass,
  ChevronLeft,
  ChevronsUpDown,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const chatHistory = [
  "What is GST return filing?",
  "Explain section 80C deductions",
  "How to file ITR online?",
  "TDS rules for salary income",
  "Capital gains tax explained",
];

const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 260, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            backgroundColor: "var(--sidebar-bg)",
          }}
        >
          {/* ── Logo Row ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "18px 14px 16px",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #4ade80, #16a34a)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span
                style={{
                  fontWeight: 600,
                  fontSize: 14,
                  color: "var(--text-primary)",
                }}
              >
                Ask My Docs
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggle}
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                backgroundColor: "var(--card-bg)",
                border: "none",
                color: "var(--text-secondary)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <ChevronLeft size={14} />
            </motion.button>
          </div>

          {/* ── Nav Buttons ── */}
          <div
            style={{
              padding: "0 10px",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              flexShrink: 0,
            }}
          >
            {/* New Chat */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 10,
                backgroundColor: "#1E3A2A",
                border: "1px solid #2A4A3A",
                color: "var(--text-primary)",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 500,
                textAlign: "left",
              }}
            >
              <MessageSquare
                size={15}
                color="#4ade80"
                style={{ flexShrink: 0 }}
              />
              New Chat
            </motion.button>

            {/* Library */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/home")}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 10,
                backgroundColor: "transparent",
                border: "none",
                color: "var(--text-secondary)",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 500,
                textAlign: "left",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--card-bg)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <Library size={15} color="#9CA3AF" style={{ flexShrink: 0 }} />
              Library
            </motion.button>

            {/* Discover */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 10,
                backgroundColor: "transparent",
                border: "none",
                color: "var(--text-secondary)",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 500,
                textAlign: "left",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--card-bg)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <Compass size={15} color="#9CA3AF" style={{ flexShrink: 0 }} />
              Discover
            </motion.button>
          </div>

          {/* ── Divider ── */}
          <div
            style={{
              height: 1,
              backgroundColor: "var(--border)",
              margin: "14px 14px 10px",
              flexShrink: 0,
            }}
          />

          {/* ── Chats Label ── */}
          <div style={{ padding: "0 14px 6px", flexShrink: 0 }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
              }}
            >
              Chats
            </span>
          </div>

          {/* ── Chat History ── */}
          <ScrollArea style={{ flex: 1, padding: "0 10px" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {chatHistory.map((chat, i) => (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "9px 12px",
                    borderRadius: 10,
                    border: "none",
                    backgroundColor: "transparent",
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                    fontSize: 12.5,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "block",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "var(--card-bg)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  {chat}
                </motion.button>
              ))}
            </div>
          </ScrollArea>

          {/* ── User Section ── */}
          <div style={{ padding: "8px 10px 12px", flexShrink: 0 }}>
            <motion.button
              whileTap={{ scale: 0.98 }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px",
                borderRadius: 10,
                border: "1px solid var(--border)",
                backgroundColor: "transparent",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--card-bg)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #4ade80, #16a34a)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "white",
                    flexShrink: 0,
                  }}
                >
                  A
                </div>
                <div style={{ textAlign: "left" }}>
                  <p
                    style={{
                      fontSize: 12.5,
                      fontWeight: 500,
                      lineHeight: 1.2,
                      color: "var(--text-primary)",
                      margin: 0,
                    }}
                  >
                    Ashutosh
                  </p>
                  <p
                    style={{
                      fontSize: 10.5,
                      lineHeight: 1.2,
                      marginTop: 1,
                      color: "var(--text-secondary)",
                      margin: 0,
                    }}
                  >
                    ashutosh@gmail.com
                  </p>
                </div>
              </div>
              <ChevronsUpDown
                size={13}
                color="#6B7280"
                style={{ flexShrink: 0 }}
              />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
