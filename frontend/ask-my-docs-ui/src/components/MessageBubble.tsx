import { useState } from "react";
import { Copy, ThumbsUp, ThumbsDown, Check } from "lucide-react";
import CitationCard from "@/components/CitationCard";

interface Citation {
  filename: string;
  page: number;
  quote: string;
}

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  bullets?: string[];
  citation?: Citation;
}

const MessageBubble = ({
  role,
  content,
  bullets,
  citation,
}: MessageBubbleProps) => {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const handleCopy = () => {
    const text = bullets
      ? `${content}\n${bullets.map((b) => `• ${b}`).join("\n")}`
      : content;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (role === "user") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            maxWidth: "70%",
            backgroundColor: "#1E3A2A",
            border: "1px solid #2A4A3A",
            borderRadius: "12px 12px 2px 12px",
            padding: "10px 14px",
            fontSize: 13,
            color: "var(--text-primary)",
            lineHeight: 1.6,
          }}
        >
          {content}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
      {/* Avatar */}
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
          marginTop: 2,
        }}
      >
        <svg width="13" height="13" fill="white" viewBox="0 0 24 24">
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>

      {/* Body */}
      <div style={{ flex: 1 }}>
        {/* Text */}
        <div
          style={{
            fontSize: 13,
            color: "var(--text-primary)",
            lineHeight: 1.7,
          }}
        >
          <p style={{ margin: "0 0 6px" }}>{content}</p>
          {bullets && bullets.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {bullets.map((b, i) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "flex-start", gap: 8 }}
                >
                  <div
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: "50%",
                      backgroundColor: "#4ade80",
                      marginTop: 7,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ color: "var(--text-primary)", fontSize: 13 }}>
                    {b}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
          <button
            onClick={handleCopy}
            title="Copy"
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              border: "1px solid var(--border)",
              backgroundColor: copied ? "#1E3A2A" : "transparent",
              color: copied ? "#4ade80" : "var(--text-secondary)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s",
            }}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
          </button>

          <button
            onClick={() => {
              setLiked(!liked);
              setDisliked(false);
            }}
            title="Like"
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              border: "1px solid var(--border)",
              backgroundColor: liked ? "#1E3A2A" : "transparent",
              color: liked ? "#4ade80" : "var(--text-secondary)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s",
            }}
          >
            <ThumbsUp size={12} />
          </button>

          <button
            onClick={() => {
              setDisliked(!disliked);
              setLiked(false);
            }}
            title="Dislike"
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              border: "1px solid var(--border)",
              backgroundColor: disliked ? "#2A1A1A" : "transparent",
              color: disliked ? "#EF4444" : "var(--text-secondary)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s",
            }}
          >
            <ThumbsDown size={12} />
          </button>
        </div>

        {/* Citation */}
        {citation && (
          <CitationCard
            filename={citation.filename}
            page={citation.page}
            quote={citation.quote}
          />
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
