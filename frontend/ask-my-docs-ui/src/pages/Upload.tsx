import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, ArrowRight, ArrowLeft } from "lucide-react";
import { useState, useRef } from "react";
import { api } from "../services/api";

const UploadPage = () => {
  const navigate = useNavigate();
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedDoc, setUploadedDoc] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (file.type !== "application/pdf") {
      setError("Only PDF files allowed!");
      return;
    }
    setUploadedFile(file);
    setUploading(true);
    setError(null);
    try {
      const data = await api.uploadDocument(file);
      if (data.document_id) {
        setUploadedDoc({ id: data.document_id, name: data.name });
      } else {
        setError(data.detail || "Upload failed");
      }
    } catch (err) {
      setError("Upload failed — please try again");
    } finally {
      setUploading(false);
    }
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
      style={{ backgroundColor: "var(--background)", padding: "32px" }}
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

      <div className="w-full max-w-2xl flex flex-col gap-8 relative z-10">
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
          onClick={() => !uploading && inputRef.current?.click()}
          className="w-full flex flex-col items-center justify-center gap-6 cursor-pointer transition-all duration-300 rounded-2xl border-2 border-dashed"
          style={{
            padding: "60px 40px",
            borderColor: dragOver
              ? "#4ade80"
              : uploading
                ? "#22c55e"
                : "#1F1F2E",
            backgroundColor: dragOver ? "#1A1A24" : "#111118",
          }}
        >
          <motion.div
            animate={{ scale: dragOver ? 1.15 : 1 }}
            transition={{ duration: 0.2 }}
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: "#1A1A24", border: "1px solid #2A2A3A" }}
          >
            <Upload
              size={28}
              color={dragOver ? "#4ade80" : uploading ? "#22c55e" : "#6B7280"}
            />
          </motion.div>

          <div className="text-center">
            <p
              className="text-lg font-semibold mb-2"
              style={{ color: "#FFFFFF" }}
            >
              {uploading
                ? "Uploading..."
                : dragOver
                  ? "Drop it here!"
                  : "Drag & Drop your PDF here"}
            </p>
            <p className="text-sm" style={{ color: "#6B7280" }}>
              or click to browse files
            </p>
          </div>

          {!uploading && (
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
          )}

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

        {/* Error */}
        {error && (
          <p
            style={{ color: "#EF4444", fontSize: "13px", textAlign: "center" }}
          >
            {error}
          </p>
        )}

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
              style={{ color: uploading ? "#F59E0B" : "#4ade80" }}
            >
              {uploading ? "Uploading..." : "✓ Ready"}
            </span>
          </motion.div>
        )}

        {/* Go to Chat */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.03, borderColor: "#4ade80", color: "#4ade80" }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/chat")}
          style={{
            alignSelf: "center",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "14px 48px",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: 600,
            backgroundColor: uploadedDoc ? "#1E3A2A" : "transparent",
            border: uploadedDoc ? "1px solid #2A4A3A" : "1px solid #2A2A3A",
            color: uploadedDoc ? "#4ade80" : "#9CA3AF",
            cursor: "pointer",
          }}
        >
          {uploadedDoc ? "✓ Go to Chat" : "Go to Chat"}
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

export default UploadPage;
