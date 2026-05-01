import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import ChatBox from "@/components/ChatBox";

const Chat = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
    null,
  );

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        padding: 12,
        gap: 12,
        position: "fixed",
        top: 0,
        left: 0,
        backgroundColor: "var(--background)",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              height: "100%",
              flexShrink: 0,
              borderRadius: 16,
              overflow: "hidden",
              backgroundColor: "var(--sidebar-bg)",
              border: "1px solid var(--border)",
            }}
          >
            <Sidebar
              isOpen={sidebarOpen}
              onToggle={() => setSidebarOpen(false)}
              onSelectDocument={setSelectedDocumentId}
              selectedDocumentId={selectedDocumentId}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar closed toggle */}
      <AnimatePresence>
        {!sidebarOpen && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(true)}
            style={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 20,
              width: 28,
              height: 28,
              borderRadius: 8,
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ChevronRight size={14} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Area */}
      <div
        style={{
          flex: 1,
          height: "100%",
          borderRadius: 16,
          overflow: "hidden",
          backgroundColor: "var(--chat-bg)",
          border: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        <ChatBox
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
          documentId={selectedDocumentId}
        />
      </div>
    </div>
  );
};

export default Chat;
