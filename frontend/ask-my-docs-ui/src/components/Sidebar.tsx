import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageSquare,
  Library,
  Compass,
  ChevronLeft,
  ChevronsUpDown,
  Trash2,
} from "lucide-react";
import { api } from "../services/api";

interface Document {
  id: string;
  name: string;
  size: number;
  created_at: string;
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onSelectDocument: (documentId: string) => void;
  selectedDocumentId: string | null;
}

const Sidebar = ({
  isOpen,
  onToggle,
  onSelectDocument,
  selectedDocumentId,
}: SidebarProps) => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);

  const name = localStorage.getItem("name") || "User";
  const email = localStorage.getItem("email") || "";
  const initial = name.charAt(0).toUpperCase();

  useEffect(() => {
    if (isOpen) fetchDocuments();
  }, [isOpen]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const data = await api.getDocuments();
      setDocuments(data.documents || []);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, documentId: string) => {
    e.stopPropagation();
    try {
      await api.deleteDocument(documentId);
      setDocuments((prev) => prev.filter((d) => d.id !== documentId));
    } catch (err) {
      console.error("Failed to delete document:", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

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
              <img
                src="/chat.jpg"
                alt="logo"
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />
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
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectDocument("")}
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
              Home
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.98 }}
              // Library button onClick:
              onClick={() => navigate("/upload")}
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

          {/* ── Documents Label ── */}
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
              Documents
            </span>
          </div>

          {/* ── Documents List ── */}
          <ScrollArea style={{ flex: 1, padding: "0 10px" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {loading ? (
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                    padding: "8px 12px",
                  }}
                >
                  Loading...
                </p>
              ) : documents.length === 0 ? (
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                    padding: "8px 12px",
                  }}
                >
                  No documents yet
                </p>
              ) : (
                documents.map((doc) => (
                  <motion.button
                    key={doc.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectDocument(doc.id)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "9px 12px",
                      borderRadius: 10,
                      border:
                        selectedDocumentId === doc.id
                          ? "1px solid #2A4A3A"
                          : "none",
                      backgroundColor:
                        selectedDocumentId === doc.id
                          ? "#1E3A2A"
                          : "transparent",
                      color:
                        selectedDocumentId === doc.id
                          ? "var(--text-primary)"
                          : "var(--text-secondary)",
                      cursor: "pointer",
                      fontSize: 12.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 8,
                    }}
                    onMouseEnter={(e) => {
                      if (selectedDocumentId !== doc.id)
                        e.currentTarget.style.backgroundColor =
                          "var(--card-bg)";
                    }}
                    onMouseLeave={(e) => {
                      if (selectedDocumentId !== doc.id)
                        e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <span
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {doc.name}
                    </span>
                    <Trash2
                      size={12}
                      color="#6B7280"
                      style={{ flexShrink: 0 }}
                      onClick={(e) => handleDelete(e, doc.id)}
                    />
                  </motion.button>
                ))
              )}
            </div>
          </ScrollArea>

          {/* ── User Section ── */}
          <div style={{ padding: "8px 10px 12px", flexShrink: 0 }}>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
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
                  {initial}
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
                    {name}
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
                    {email}
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
