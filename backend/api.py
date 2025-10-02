from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
from rag_faiss import rag_query  

app = FastAPI()

# Schema
class QA(BaseModel):
    question: str
    answer: str

class Query(BaseModel):
    question: str
    history: Optional[List[QA]] = []

@app.post("/ask")
def ask(query: Query):
    # Build conversation context
    history_context = "\n".join(
        [f"Q: {h.question}\nA: {h.answer}" for h in query.history]
    )

    context_input = f"{history_context}\nUser: {query.question}\nAI:"

    # Pass full context to RAG
    answer = rag_query(context_input)


    return {
        "question": query.question,
        "answer": answer
    }
