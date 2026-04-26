import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import ChatBox from "@/components/ChatBox";

const Chat = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div
      style={{
        display: "flex",
        overflow: "hidden",
        height: "100vh",
        width: "100vw",
        padding: 12,
        gap: 12,
        position: "relative",
        backgroundColor: "var(--background)",
        boxSizing: "border-box",
      }}
    >
      {/* Glow top left */}
      <div
        style={{
          position: "absolute",
          pointerEvents: "none",
          top: -64,
          left: 96,
          width: 320,
          height: 320,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(74,222,128,0.08) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />

      {/* Glow bottom right */}
      <div
        style={{
          position: "absolute",
          pointerEvents: "none",
          bottom: -64,
          right: 96,
          width: 320,
          height: 320,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(74,222,128,0.05) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />

      {/* Sidebar */}
      <motion.div
        initial={{ x: -280, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{
          flexShrink: 0,
          borderRadius: 16,
          overflow: "hidden",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "var(--sidebar-bg)",
          border: "1px solid var(--border)",
          alignSelf: "stretch",
        }}
      >
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      </motion.div>

      {/* Sidebar closed — floating toggle button */}
      <AnimatePresence>
        {!sidebarOpen && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        style={{
          flex: 1,
          borderRadius: 16,
          overflow: "hidden",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          minHeight: 0,
          backgroundColor: "var(--chat-bg)",
          border: "1px solid var(--border)",
          alignSelf: "stretch",
        }}
      >
        {/* <ChatBox
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        /> */}
      </motion.div>
    </div>
  );
};

export default Chat;
