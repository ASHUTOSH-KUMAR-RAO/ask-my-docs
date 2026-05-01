import { useState } from "react";
import { Copy, ThumbsUp, ThumbsDown, Check } from "lucide-react";
import CitationCard from "@/components/CitationCard";

interface Citation {
  citation_number: number;
  text: string;
  page: number;
}

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
}

const MessageBubble = ({ role, content, citations }: MessageBubbleProps) => {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
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
          <p style={{ margin: "0 0 6px", whiteSpace: "pre-wrap" }}>{content}</p>
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

        {/* Citations */}
        {citations && citations.length > 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginTop: 10,
            }}
          >
            {citations.map((citation) => (
              <CitationCard
                key={citation.citation_number}
                citationNumber={citation.citation_number}
                page={citation.page}
                text={citation.text}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
