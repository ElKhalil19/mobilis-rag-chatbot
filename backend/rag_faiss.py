import faiss
import ollama
import numpy as np
import re
import json
from sentence_transformers import SentenceTransformer

# Load FAQ
with open("mobilis_faq.json", "r") as q:
    faq_data = json.load(q)

# Load offers JSON
with open("mobilis_offers.json", "r") as f:
    offers = json.load(f)

# Precompute document texts and faq
offer_documents = []
for offer in offers:
    text = f"""
    Title: {offer['title']}
    Price: {offer['price']}
    Features: {", ".join(offer['features'])}
    Type: {offer['type']}
    """
    offer_documents.append(text.strip())

# Encode prompts + completions
faq_documents = [item["prompt"] + " " + item["completion"] for item in faq_data]


embedder = SentenceTransformer("all-MiniLM-L6-v2")


offer_embeddings = embedder.encode(offer_documents).astype("float32")
faq_embeddings = embedder.encode(faq_documents).astype("float32")

# Create FAISS index
offer_index = faiss.IndexFlatL2(offer_embeddings.shape[1])
offer_index.add(offer_embeddings)

faq_index = faiss.IndexFlatL2(faq_embeddings.shape[1])  
faq_index.add(faq_embeddings)  

def search_faiss(query, k=3):
    query_embedding = embedder.encode([query]).astype("float32")
    distances, indices = faq_index.search(query_embedding, k)  
    results = [(faq_data[i], distances[0][j]) for j, i in enumerate(indices[0])]
    return results

# Preprocess offers to extract numeric data amounts
numeric_offers = []
for offer in offers:
    for feat in offer["features"]:
        m = re.search(r"(\d+)\s*(gb|go|giga)", feat, re.IGNORECASE)
        if m:
            offer_gb = int(m.group(1))
            numeric_offers.append((offer_gb, offer))

# Sort offers by their GB size
numeric_offers.sort(key=lambda x: x[0])

def extract_data_amount(text: str):
    """Extract the first number followed by GB from text (case insensitive)."""
    m = re.search(r"(\d+)\s*(gb|go|giga)", text, re.IGNORECASE)
    return int(m.group(1)) if m else None

def find_best_offer(user_gb: int):
    """Find the smallest plan >= requested GB, otherwise fallback to max available."""
    if not numeric_offers:
        return None
    
    for gb, offer in numeric_offers:
        if gb >= user_gb:
            return offer
    return numeric_offers[-1][1]

def search_offers(user_query: str, k=5):
    """Search offers semantically using FAISS index."""
    query_emb = embedder.encode([user_query]).astype("float32")
    D, I = offer_index.search(query_emb, k)  # distances, indices
    return [offers[i] for i in I[0] if i < len(offers)]


def rag_query(user_query: str):
    # Step 1: extract GB from query
    user_gb = extract_data_amount(user_query)

    # --- OFFERS PART ---
    relevant_offers = []
    if user_gb:
        best_offer = find_best_offer(user_gb)
        if best_offer:
            relevant_offers = [best_offer]
    else:
        relevant_offers = search_offers(user_query, k=3)

    offer_context = "\n".join([
        f"{o['title']} - price: {o['price']} - features: {{{', '.join(o['features'])}}}"
        for o in relevant_offers
    ]) if relevant_offers else "No relevant offers found."

    # --- FAQ PART ---
    faq_results = search_faiss(user_query, k=3)
    faq_context = "\n".join([
        f"Q: {item['prompt']} | A: {item['completion']}"
        for item, _ in faq_results
    ]) if faq_results else "No relevant FAQ found."

    # --- Build prompt with both ---
    prompt = f"""
You are the Mobilis Assistant Bot. 
Answer primarily about Mobilis Algeria offers and FAQs. 
Do NOT mention roaming plans unless the user explicitly asks about roaming or using Mobilis abroad. 
If the user asks about roaming, you may include the relevant roaming plans. 

=== Offers ===
{offer_context}

=== FAQ ===
{faq_context}

User: {user_query}

If none of these satisfy the request, say: "I’m sorry, we don’t have something like that right now."
"""

    response = ollama.chat(
        model="llama3:8b",
        messages=[{"role": "user", "content": prompt}]
    )
    return response["message"]["content"]



# Example
print(rag_query("do you have something around 40GB?"))
