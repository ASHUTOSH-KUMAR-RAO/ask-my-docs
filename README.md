# 🔍 Ask My Docs

A production-grade domain-specific RAG (Retrieval Augmented Generation) system with hybrid retrieval, cross-encoder reranking, citation enforcement, and CI-gated evaluation pipeline.

## 🔗 Repository

[Ask My Docs](https://github.com/ASHUTOSH-KUMAR-RAO/ask-my-docs)

## 🚀 Features

- 🔍 **Hybrid Retrieval** — BM25 keyword search + ChromaDB vector search combined
- 🎯 **Cross-Encoder Reranking** — `cross-encoder/ms-marco-MiniLM-L-6-v2` for accurate reranking
- 📎 **Citation Enforcement** — Every answer includes source citations with page numbers
- 🔐 **JWT Authentication** — Signup, Login, Refresh token flow
- 💾 **Supabase Database** — Document metadata storage with user ownership
- 📄 **PDF Ingestion Pipeline** — Extract → Chunk → Embed → Store
- 🤖 **Groq LLM** — Fast inference with `openai/gpt-oss-20b`
- ⚙️ **CI/CD with GitHub Actions** — Automated backend + frontend checks on every PR
- 📊 **RAGAS Evaluation Pipeline** — Answer quality evaluation (coming soon)

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| LLM | Groq (`openai/gpt-oss-20b`) |
| Vector DB | ChromaDB |
| BM25 | rank_bm25 |
| Reranker | `cross-encoder/ms-marco-MiniLM-L-6-v2` |
| Embeddings | ChromaDB default (ONNX) |
| Backend | FastAPI + Uvicorn |
| Frontend | React + TypeScript + Vite |
| Styling | Tailwind v4 + shadcn/ui + Framer Motion |
| Auth | JWT (python-jose + passlib) |
| Database | Supabase (PostgreSQL) |
| PDF Processing | pypdf + langchain-text-splitters |
| Evaluation | RAGAS (coming soon) |
| CI/CD | GitHub Actions |

## 📁 Project Structure

\`\`\`
ask-my-docs/
├── .github/
│   └── workflows/
│       └── ci.yml                  # GitHub Actions CI pipeline
├── backend/
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth_routes.py          # /auth/* endpoints
│   │   ├── discover_routes.py      # /discover/* endpoints
│   │   ├── document_routes.py      # /documents/* endpoints
│   │   └── query_routes.py         # /query/* endpoints
│   ├── uploads/                    # Uploaded PDF files
│   ├── bm25_indexes/               # BM25 pickle indexes
│   ├── chroma_db/                  # ChromaDB vector storage
│   ├── auth.py                     # JWT token verification
│   ├── config.py                   # Pydantic settings
│   ├── generator.py                # Groq LLM answer generation
│   ├── ingestion.py                # PDF extraction + chunking + embedding
│   ├── main.py                     # FastAPI app entry point
│   ├── reranker.py                 # Cross-encoder reranking
│   ├── retriever.py                # Hybrid search (BM25 + Vector)
│   ├── run_ingestion.py            # Subprocess script for ingestion
│   └── run_reranker.py             # Subprocess script for reranking
├── evaluation/
│   └── eval.py                     # RAGAS evaluation pipeline
├── frontend/
│   └── ask-my-docs-ui/
│       └── src/
│           ├── components/
│           │   ├── ui/             # shadcn/ui components
│           │   ├── ChatBox.tsx
│           │   ├── CitationCard.tsx
│           │   ├── FileUpload.tsx
│           │   ├── MessageBubble.tsx
│           │   ├── Navbar.tsx
│           │   ├── ProtectedRoute.tsx
│           │   └── Sidebar.tsx
│           ├── hooks/
│           │   ├── useAuth.ts
│           │   └── useChat.ts
│           ├── lib/                # Utility functions
│           ├── pages/
│           │   ├── Chat.tsx
│           │   ├── Discover.tsx
│           │   ├── Home.tsx
│           │   ├── Login.tsx
│           │   ├── Signup.tsx
│           │   └── Upload.tsx
│           └── services/
│               └── api.ts          # Backend API calls
├── .env                            # Environment variables (gitignored)
├── .gitignore
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE
├── README.md
├── requirements.txt
└── start.ps1                       # Windows start script
\`\`\`

## ⚙️ Getting Started

### Prerequisites
- Python 3.11+
- Node.js 20+
- Supabase account
- Groq API key
- HuggingFace account (for HF_TOKEN)

### Backend Setup

\`\`\`bash
# Clone the repo
git clone https://github.com/ASHUTOSH-KUMAR-RAO/ask-my-docs.git
cd ask-my-docs/backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Create .env file and fill in your keys
cp .env.example .env

# Start server
python main.py
\`\`\`

### Frontend Setup

\`\`\`bash
cd frontend/ask-my-docs-ui

# Install dependencies
npm install

# Start dev server
npm run dev
\`\`\`

### Environment Variables

\`\`\`env
GROQ_API_KEY=your_groq_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SECRET=your_supabase_service_role_key
SECRET_KEY=your_jwt_secret_key
HF_TOKEN=your_huggingface_token
\`\`\`

## 🔄 RAG Pipeline

\`\`\`
PDF Upload
    ↓
Text Extraction (pypdf)
    ↓
Chunking (RecursiveCharacterTextSplitter)
    ↓
Embedding + Storage (ChromaDB)
    ↓
BM25 Index Creation (rank_bm25)
    ↓
User Query
    ↓
Hybrid Search (BM25 + Vector)
    ↓
Cross-Encoder Reranking
    ↓
LLM Answer Generation (Groq)
    ↓
Citation Enforced Response
\`\`\`

## ⚙️ CI/CD Pipeline

\`\`\`
Code Push / PR
    ↓
GitHub Actions
    ↓
Backend Check (imports + dependencies)
Frontend Check (npm build)
    ↓
All Pass ✅ → PR Merge allowed
Any Fail ❌ → PR Merge blocked
\`\`\`

## 👤 Author

**Ashutosh Kumar Rao**

- GitHub: [@ASHUTOSH-KUMAR-RAO](https://github.com/ASHUTOSH-KUMAR-RAO)

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting a pull request.

## 📄 License

MIT License
