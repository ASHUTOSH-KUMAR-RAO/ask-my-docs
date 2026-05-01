const BASE_URL = "http://localhost:8000";

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const api = {
  // Auth
  login: async (email: string, password: string) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  signup: async (name: string, email: string, password: string) => {
    const res = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    return res.json();
  },

  // Chat
  sendMessage: async (message: string, documentId: string) => {
    const res = await fetch(`${BASE_URL}/query/`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        query: message,
        document_id: documentId,
        top_k: 5,
      }),
    });
    return res.json();
  },

  // Documents
  uploadDocument: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${BASE_URL}/documents/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: formData,
    });
    return res.json();
  },

  getDocuments: async () => {
    const res = await fetch(`${BASE_URL}/documents/`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  deleteDocument: async (documentId: string) => {
    const res = await fetch(`${BASE_URL}/documents/${documentId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return res.json();
  },

  // User
  getMe: async () => {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  // Token refresh
  refreshToken: async () => {
    const refresh_token = localStorage.getItem("refresh_token");
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token }),
    });
    const data = await res.json();
    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
    }
    return data;
  },
};
