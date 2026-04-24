# 🔍 Ask My Docs

A production-grade domain-specific RAG (Retrieval Augmented Generation) system with hybrid retrieval, cross-encoder reranking, citation enforcement, and CI-gated evaluation pipeline.

## 🔗 Repository

[Ask My Docs](https://github.com/ASHUTOSH-KUMAR-RAO/ask-my-docs)
## 🚀 Features

- 🔍 Hybrid Retrieval (BM25 + Vector Search)
- 🎯 Cross-Encoder Reranking
- 📎 Citation Enforcement
- 📊 RAGAS Evaluation Pipeline
- ⚙️ CI/CD with GitHub Actions
- 🔐 Authentication with Better Auth
- 💾 Supabase Database

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| LLM | Groq (LLaMA 3.3 70B) |
| Framework | LangChain |
| Vector DB | ChromaDB |
| BM25 | rank_bm25 |
| Reranker | CrossEncoder |
| Backend | FastAPI |
| Frontend | React + TypeScript + Vite |
| Styling | Tailwind v4 + shadcn + Framer Motion |
| Auth | Better Auth |
| Database | Supabase |
| Evaluation | RAGAS |
| CI/CD | GitHub Actions |

## 📁 Project Structure

\`\`\`
ask-my-docs/
├── backend/
│   ├── main.py
│   ├── retriever.py
│   ├── reranker.py
│   ├── generator.py
│   └── ingestion.py
├── frontend/
│   └── ask-my-docs-ui/
│       └── src/
│           ├── components/
│           ├── pages/
│           ├── hooks/
│           ├── services/
│           └── types/
├── evaluation/
│   └── eval.py
├── .github/
│   └── workflows/
├── requirements.txt
└── .env
\`\`\`

## ⚙️ Getting Started

Coming soon...

## 👤 Author

**Ashutosh Kumar Rao**

- GitHub: [@ASHUTOSH-KUMAR-RAO](https://github.com/ASHUTOSH-KUMAR-RAO)

## 📄 License

MIT License
