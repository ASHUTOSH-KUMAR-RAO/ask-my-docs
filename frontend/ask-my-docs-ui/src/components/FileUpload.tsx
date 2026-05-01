import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, X, CheckCircle, Loader } from "lucide-react";
import { api } from "../services/api";

interface FileUploadProps {
  onUploadSuccess?: (document: { id: string; name: string }) => void;
}

const FileUpload = ({ onUploadSuccess }: FileUploadProps) => {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.name.endsWith(".pdf")) {
      setError("Only PDF files are allowed");
      return;
    }

    setFileName(file.name);
    setUploading(true);
    setError(null);

    try {
      const data = await api.uploadDocument(file);
      if (data.document_id) {
        setUploaded(true);
        onUploadSuccess?.({ id: data.document_id, name: data.name });
        setTimeout(() => {
          setUploaded(false);
          setFileName(null);
        }, 3000);
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
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        onChange={handleChange}
        style={{ display: "none" }}
      />

      <motion.div
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        whileHover={{ scale: 1.01 }}
        style={{
          border: `2px dashed ${dragging ? "#4ade80" : uploading ? "#22c55e" : uploaded ? "#16a34a" : "var(--border)"}`,
          borderRadius: 14,
          padding: "32px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          cursor: uploading ? "default" : "pointer",
          backgroundColor: dragging
            ? "rgba(74,222,128,0.05)"
            : "var(--card-bg)",
          transition: "all 0.2s",
          minHeight: 160,
        }}
      >
        <AnimatePresence mode="wait">
          {uploading ? (
            <motion.div
              key="uploading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader size={28} color="#4ade80" />
              </motion.div>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  margin: 0,
                }}
              >
                Uploading {fileName}...
              </p>
            </motion.div>
          ) : uploaded ? (
            <motion.div
              key="uploaded"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
              }}
            >
              <CheckCircle size={28} color="#4ade80" />
              <p
                style={{
                  fontSize: 13,
                  color: "#4ade80",
                  margin: 0,
                  fontWeight: 500,
                }}
              >
                {fileName} uploaded successfully!
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: "rgba(74,222,128,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {fileName ? (
                  <FileText size={22} color="#4ade80" />
                ) : (
                  <Upload size={22} color="#4ade80" />
                )}
              </div>
              <div style={{ textAlign: "center" }}>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--text-primary)",
                    margin: "0 0 4px",
                  }}
                >
                  {fileName ? fileName : "Drop your PDF here"}
                </p>
                <p
                  style={{
                    fontSize: 11.5,
                    color: "var(--text-muted)",
                    margin: 0,
                  }}
                >
                  or click to browse — PDF only
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 8,
              padding: "8px 12px",
              borderRadius: 8,
              backgroundColor: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
            }}
          >
            <span style={{ fontSize: 12, color: "#EF4444" }}>{error}</span>
            <X
              size={12}
              color="#EF4444"
              style={{ cursor: "pointer" }}
              onClick={() => setError(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUpload;
