export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Citation {
  source: string;
  page: number;
  text: string;
}

export interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
}

export interface Document {
  id: string;
  name: string;
  size: number;
  uploadedAt: Date;
}
