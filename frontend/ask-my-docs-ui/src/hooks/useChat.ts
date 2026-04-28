import { useState } from "react";

interface Citation {
  source: string;
  page: number;
  text: string;
}

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      content,
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      // Backend connect hone par replace karenge
      setTimeout(() => {
        const assistantMsg: Message = {
          id: Date.now() + 1,
          role: "assistant",
          content: "This is a dummy response. Backend integration coming soon!",
          citations: [
            {
              source: "sample.pdf",
              page: 1,
              text: "Sample citation text.",
            },
          ],
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setLoading(false);
    }
  };

  const clearMessages = () => setMessages([]);

  return { messages, loading, sendMessage, clearMessages };
};
