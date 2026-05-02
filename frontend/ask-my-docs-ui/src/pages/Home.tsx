import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  MessageSquare,
  Compass,
  FileText,
  ArrowRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "../services/api";

const Home = () => {
  const navigate = useNavigate();
  const name = localStorage.getItem("name") || "User";
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const data = await api.getDocuments();
        setDocuments(data.documents || []);
      } catch (err) {
        console.error("Failed to fetch documents");
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  const quickActions = [
    {
      icon: <Upload size={20} color="#4ade80" />,
      title: "Upload Document",
      desc: "Add a new PDF to your library",
      path: "/upload",
      border: "#2A4A3A",
      bg: "#1E3A2A",
    },
    {
      icon: <MessageSquare size={20} color="#4ade80" />,
      title: "Go to Chat",
      desc: "Ask questions from your docs",
      path: "/chat",
      border: "#2A4A3A",
      bg: "#1E3A2A",
    },
    {
      icon: <Compass size={20} color="#4ade80" />,
      title: "Discover",
      desc: "Explore popular questions & tips",
      path: "/discover",
      border: "#2A4A3A",
      bg: "#1E3A2A",
    },
  ];

  return (
    <div
      className="min-h-screen w-full relative"
      style={{
        backgroundColor: "var(--background)",
        overflowY: "auto",
        padding: "48px 32px",
      }}
    >
      {/* Glow */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 600,
          pointerEvents: "none",
          background:
            "radial-gradient(circle, rgba(74,222,128,0.06) 0%, transparent 70%)",
        }}
      />

      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 40,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: "flex", alignItems: "center", gap: 16 }}
        >
          <img
            src="/chat.jpg"
            alt="logo"
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              objectFit: "cover",
            }}
          />
          <div>
            <h1
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: "var(--text-primary)",
                margin: 0,
              }}
            >
              Welcome back, {name}! 👋
            </h1>
            <p
              style={{
                fontSize: 14,
                color: "var(--text-secondary)",
                margin: 0,
              }}
            >
              What would you like to do today?
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ display: "flex", gap: 12 }}
        >
          {[
            { label: "Documents", value: loading ? "..." : documents.length },
            { label: "Status", value: "Active" },
            { label: "Plan", value: "Free" },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                padding: "16px 20px",
                borderRadius: 12,
                backgroundColor: "var(--card-bg)",
                border: "1px solid var(--border)",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#4ade80",
                  margin: 0,
                }}
              >
                {stat.value}
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--text-secondary)",
                  margin: 0,
                }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          <h2
            style={{
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              margin: 0,
            }}
          >
            Quick Actions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {quickActions.map((action, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => navigate(action.path)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 18px",
                  borderRadius: 12,
                  backgroundColor: "var(--card-bg)",
                  border: "1px solid var(--border)",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "#4ade80")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "var(--border)")
                }
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      backgroundColor: action.bg,
                      border: `1px solid ${action.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {action.icon}
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        margin: 0,
                      }}
                    >
                      {action.title}
                    </p>
                    <p
                      style={{
                        fontSize: 12,
                        color: "var(--text-secondary)",
                        margin: 0,
                      }}
                    >
                      {action.desc}
                    </p>
                  </div>
                </div>
                <ArrowRight size={15} color="#4ade80" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Documents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            paddingBottom: 40,
          }}
        >
          <h2
            style={{
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              margin: 0,
            }}
          >
            Recent Documents
          </h2>

          {loading ? (
            [0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                style={{
                  height: 56,
                  borderRadius: 12,
                  backgroundColor: "var(--card-bg)",
                  border: "1px solid var(--border)",
                }}
              />
            ))
          ) : documents.length === 0 ? (
            <div
              style={{
                padding: "32px",
                borderRadius: 12,
                textAlign: "center",
                backgroundColor: "var(--card-bg)",
                border: "1px dashed var(--border)",
              }}
            >
              <p
                style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}
              >
                No documents yet —{" "}
                <span
                  onClick={() => navigate("/upload")}
                  style={{ color: "#4ade80", cursor: "pointer" }}
                >
                  upload one!
                </span>
              </p>
            </div>
          ) : (
            documents.slice(0, 5).map((doc, i) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.01 }}
                onClick={() => navigate("/chat")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 16px",
                  borderRadius: 12,
                  backgroundColor: "var(--card-bg)",
                  border: "1px solid var(--border)",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "#4ade80")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "var(--border)")
                }
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <FileText size={16} color="#4ade80" />
                  <div>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        margin: 0,
                      }}
                    >
                      {doc.name}
                    </p>
                    <p
                      style={{
                        fontSize: 11,
                        color: "var(--text-secondary)",
                        margin: 0,
                      }}
                    >
                      {(doc.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <ArrowRight size={14} color="#4ade80" />
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
