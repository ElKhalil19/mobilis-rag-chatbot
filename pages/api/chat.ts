export const config = {
  runtime: "edge",
};

export default async function handler(req: Request): Promise<Response> {
  try {
    const { messages } = await req.json();

    // Extract history (all assistant+user messages except last user one)
    const history = messages
      .slice(-2) // all but last
      .map((m: any) => ({
        question: m.role === "user" ? m.content : "",
        answer: m.role === "assistant" ? m.content : "",
      }))
      .filter((h: any) => h.question || h.answer);

    const latestMessage = messages[messages.length - 1];

    const response = await fetch("http://localhost:8000/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: latestMessage.content,
        history,
      }),
    });

    const data = await response.json();

    return new Response(data.answer, {
      headers: { "Content-Type": "text/plain" },
    });
  } catch (err) {
    console.error(err);
    return new Response("Error", { status: 500 });
  }
}