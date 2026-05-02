import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Lightbulb,
  HelpCircle,
  ArrowLeft,
  BookOpen,
  Zap,
  ChevronDown,
  Play,
  Upload,
  MessageSquare,
  FileCheck,
} from "lucide-react";

const tips = [
  {
    icon: <Zap size={16} color="#4ade80" />,
    title: "Be Specific",
    desc: "Ask precise questions to get better answers from your documents.",
  },
  {
    icon: <BookOpen size={16} color="#4ade80" />,
    title: "Upload PDFs Only",
    desc: "Currently only PDF files are supported for document chat.",
  },
  {
    icon: <Lightbulb size={16} color="#4ade80" />,
    title: "Use Context",
    desc: "Mention page numbers or sections for more accurate responses.",
  },
];

const howItWorks = [
  {
    icon: <Upload size={18} color="#4ade80" />,
    step: "01",
    title: "Upload PDF",
    desc: "Upload your PDF document to the library.",
  },
  {
    icon: <FileCheck size={18} color="#4ade80" />,
    step: "02",
    title: "Select Document",
    desc: "Choose a document from the sidebar in chat.",
  },
  {
    icon: <MessageSquare size={18} color="#4ade80" />,
    step: "03",
    title: "Ask Questions",
    desc: "Type your question in the chat input.",
  },
  {
    icon: <Play size={18} color="#4ade80" />,
    step: "04",
    title: "Get Cited Answers",
    desc: "Receive accurate answers with page citations.",
  },
];

const Discover = () => {
  const navigate = useNavigate();
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("http://localhost:8000/ai/questions");
        const data = await response.json();
        setQuestions(data.questions || []);
      } catch (err) {
        setQuestions([
          "What is binary search and how does it work?",
          "Explain recursion with an example",
          "What is the difference between stack and queue?",
          "How does gradient descent work?",
          "What are Python decorators?",
        ]);
      } finally {
        setQuestionsLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleQuestionClick = async (q: string, i: number) => {
    if (openQuestion === i) {
      setOpenQuestion(null);
      return;
    }
    setOpenQuestion(i);
    if (answers[i]) return;
    setLoadingIndex(i);
    try {
      const response = await fetch("http://localhost:8000/ai/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await response.json();
      setAnswers((prev) => ({
        ...prev,
        [i]: data.answer || "Could not fetch answer.",
      }));
    } catch (err) {
      setAnswers((prev) => ({
        ...prev,
        [i]: "Failed to load answer. Please try again.",
      }));
    } finally {
      setLoadingIndex(null);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "var(--background)",
        overflowY: "auto",
        padding: "32px",
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
            "radial-gradient(circle, rgba(74,222,128,0.05) 0%, transparent 70%)",
          zIndex: 0,
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
        {/* Back Button — inline */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          style={{
            alignSelf: "flex-start",
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            borderRadius: 10,
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--border)",
            color: "var(--text-secondary)",
            cursor: "pointer",
            fontSize: 13,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#4ade80")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.borderColor = "var(--border)")
          }
        >
          <ArrowLeft size={14} />
          Back
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: "flex", flexDirection: "column", gap: 6 }}
        >
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "var(--text-primary)",
              margin: 0,
            }}
          >
            🔍 Discover
          </h1>
          <p
            style={{ fontSize: 14, color: "var(--text-secondary)", margin: 0 }}
          >
            Explore popular questions, how it works, and tips to get the most
            out of Ask My Docs.
          </p>
        </motion.div>

        {/* Popular Questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
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
              Popular Questions
            </h2>
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                padding: "2px 8px",
                borderRadius: 5,
                border: "1px solid #2A4A3A",
                backgroundColor: "#1E3A2A",
                color: "#4ade80",
                letterSpacing: "0.05em",
              }}
            >
              ✨ AI Generated
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {questionsLoading
              ? [0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                    style={{
                      height: 44,
                      borderRadius: 10,
                      backgroundColor: "var(--card-bg)",
                      border: "1px solid var(--border)",
                    }}
                  />
                ))
              : questions.map((q, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    style={{
                      borderRadius: 10,
                      border: "1px solid",
                      borderColor:
                        openQuestion === i ? "#4ade80" : "var(--border)",
                      overflow: "hidden",
                      backgroundColor: "var(--card-bg)",
                      transition: "border-color 0.2s",
                    }}
                  >
                    <button
                      onClick={() => handleQuestionClick(q, i)}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 16px",
                        backgroundColor: "transparent",
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left",
                        color:
                          openQuestion === i
                            ? "var(--text-primary)"
                            : "var(--text-secondary)",
                        fontSize: 13,
                        gap: 10,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <HelpCircle
                          size={14}
                          color="#4ade80"
                          style={{ flexShrink: 0 }}
                        />
                        {q}
                      </div>
                      <motion.div
                        animate={{ rotate: openQuestion === i ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ flexShrink: 0 }}
                      >
                        <ChevronDown size={14} color="#6B7280" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {openQuestion === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          style={{ overflow: "hidden" }}
                        >
                          <div
                            style={{
                              padding: "12px 16px 16px",
                              borderTop: "1px solid var(--border)",
                            }}
                          >
                            {loadingIndex === i ? (
                              <div
                                style={{
                                  display: "flex",
                                  gap: 5,
                                  alignItems: "center",
                                }}
                              >
                                {[0, 1, 2].map((dot) => (
                                  <motion.div
                                    key={dot}
                                    animate={{ opacity: [0.3, 1, 0.3] }}
                                    transition={{
                                      duration: 1.2,
                                      repeat: Infinity,
                                      delay: dot * 0.2,
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
                            ) : (
                              <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{
                                  fontSize: 13,
                                  color: "var(--text-secondary)",
                                  lineHeight: 1.7,
                                  margin: 0,
                                }}
                              >
                                {answers[i]}
                              </motion.p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
          </div>
        </motion.div>

        {/* How It Works */}
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
            How It Works
          </h2>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {howItWorks.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                style={{
                  flex: "1 1 140px",
                  padding: "16px",
                  borderRadius: 12,
                  backgroundColor: "var(--card-bg)",
                  border: "1px solid var(--border)",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    fontSize: 10,
                    fontWeight: 700,
                    color: "var(--text-muted)",
                    letterSpacing: "0.1em",
                  }}
                >
                  {item.step}
                </span>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    backgroundColor: "#1E3A2A",
                    border: "1px solid #2A4A3A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 10,
                  }}
                >
                  {item.icon}
                </div>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    margin: "0 0 4px",
                  }}
                >
                  {item.title}
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--text-secondary)",
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tips & Tricks */}
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
            Tips & Tricks
          </h2>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {tips.map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                style={{
                  flex: "1 1 200px",
                  padding: "16px",
                  borderRadius: 12,
                  backgroundColor: "var(--card-bg)",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  {tip.icon}
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--text-primary)",
                    }}
                  >
                    {tip.title}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--text-secondary)",
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  {tip.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Discover;
