import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, ArrowRight } from "lucide-react";
import { useState, useRef } from "react";

const Home = () => {
  const navigate = useNavigate();
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file.type !== "application/pdf") {
      alert("Only PDF files allowed!");
      return;
    }
    setUploadedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center relative"
      style={{ backgroundColor: "var(--background)" }}
    >
      {/* Glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "0px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "600px",
          background:
            "radial-gradient(circle, rgba(74,222,128,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="w-full max-w-2xl px-6 flex flex-col items-center gap-8 relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <img
            src="/chat.jpg"
            alt="Ask My Docs Logo"
            className="w-16 h-16 rounded-2xl object-cover"
          />
          <div className="text-center">
            <h1
              className="text-4xl font-bold mb-2"
              style={{ color: "#FFFFFF" }}
            >
              Ask My Docs
            </h1>
            <p className="text-base" style={{ color: "#6B7280" }}>
              Upload your documents and ask anything!
            </p>
          </div>
        </motion.div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className="w-full flex flex-col items-center justify-center gap-6 cursor-pointer transition-all duration-300 rounded-2xl border-2 border-dashed"
          style={{
            padding: "60px 40px",
            borderColor: dragOver ? "#4ade80" : "#1F1F2E",
            backgroundColor: dragOver ? "#1A1A24" : "#111118",
          }}
        >
          <motion.div
            animate={{ scale: dragOver ? 1.15 : 1 }}
            transition={{ duration: 0.2 }}
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: "#1A1A24", border: "1px solid #2A2A3A" }}
          >
            <Upload size={28} color={dragOver ? "#4ade80" : "#6B7280"} />
          </motion.div>

          <div className="text-center">
            <p
              className="text-lg font-semibold mb-2"
              style={{ color: "#FFFFFF" }}
            >
              {dragOver ? "Drop it here!" : "Drag & Drop your PDF here"}
            </p>
            <p className="text-sm" style={{ color: "#6B7280" }}>
              or click to browse files
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: "linear-gradient(135deg, #4ade80, #16a34a)",
              color: "white",
              border: "none",
              cursor: "pointer",
              padding: "12px 40px",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            Browse Files
          </motion.button>

          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </motion.div>

        {/* Uploaded File */}
        {uploadedFile && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full px-5 py-4 rounded-xl flex items-center justify-between"
            style={{
              backgroundColor: "#1A1A24",
              border: "1px solid #2A2A3A",
              borderLeft: "3px solid #4ade80",
            }}
          >
            <div className="flex items-center gap-3">
              <FileText size={18} color="#4ade80" />
              <div>
                <p className="text-sm font-medium" style={{ color: "#FFFFFF" }}>
                  {uploadedFile.name}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <span
              className="text-xs font-semibold"
              style={{ color: "#4ade80" }}
            >
              ✓ Ready
            </span>
          </motion.div>
        )}

        {/* Go to Chat */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{
            scale: 1.03,
            backgroundColor: "#1A1A24",
            borderColor: "#4ade80",
            color: "#4ade80",
          }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/chat")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "14px 48px",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: 600,
            backgroundColor: "transparent",
            border: "1px solid #2A2A3A",
            color: "#9CA3AF",
            cursor: "pointer",
          }}
        >
          Go to Chat
          <motion.span
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowRight size={15} />
          </motion.span>
        </motion.button>
      </div>
    </div>
  );
};

export default Home;
