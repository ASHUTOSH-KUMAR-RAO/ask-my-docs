import { useState } from "react";
import { api } from "../services/api";

interface Citation {
  citation_number: number;
  text: string;
  page: number;
}

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
}

export const useChat = (documentId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    // User message add karo
    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      content,
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setError(null);

    try {
      // Backend se response lo
      const data = await api.sendMessage(content, documentId);

      if (data.answer) {
        const assistantMsg: Message = {
          id: Date.now() + 1,
          role: "assistant",
          content: data.answer,
          citations: data.citations || [],
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        setError(data.detail || "Something went wrong!");
      }
    } catch (err) {
      setError("Failed to send message!");
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    setError(null);
  };

  return { messages, loading, error, sendMessage, clearMessages };
};
