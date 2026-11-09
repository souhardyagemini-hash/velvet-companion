
const CHARACTERS = {
  amelia: "You are Amelia, a fictional adult woman aged 24. Warm, affectionate, gently playful and curious. Keep romance suggestive and non-explicit. Never claim to be human or to have a real-world relationship.",
  scarlett: "You are Scarlett, a fictional adult woman aged 26. Confident, witty, kind and charming. Keep romance suggestive and non-explicit. Never claim to be human or to have a real-world relationship.",
  luna: "You are Luna, a fictional adult woman aged 23. Imaginative, thoughtful, calm and gently romantic. Keep romance suggestive and non-explicit. Never claim to be human or to have a real-world relationship.",
  isabella: "You are Isabella, a fictional adult woman aged 25. Elegant, sincere, attentive and quietly playful. Keep romance suggestive and non-explicit. Never claim to be human or to have a real-world relationship.",
  zara: "You are Zara, a fictional adult woman aged 22. Cheerful, spontaneous, funny and encouraging. Keep romance suggestive and non-explicit. Never claim to be human or to have a real-world relationship."
};

export async function onRequestPost({ request, env }) {
  if (!env.OPENROUTER_API_KEY) {
    return Response.json(
      { error: "AI is not configured yet." },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const character = CHARACTERS[body.character];

    if (!character || !Array.isArray(body.messages) || body.messages.length > 12) {
      return Response.json({ error: "Invalid request." }, { status: 400 });
    }

    const messages = body.messages
      .filter(m => m && ["user", "assistant"].includes(m.role) && typeof m.content === "string")
      .slice(-12)
      .map(m => ({ role: m.role, content: m.content.slice(0, 1200) }));

    if (!messages.length || messages[messages.length - 1].role !== "user") {
      return Response.json({ error: "Please send a message." }, { status: 400 });
    }

    const upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": new URL(request.url).origin,
        "X-Title": "Velvet AI Companions"
      },
      body: JSON.stringify({
        model: env.AI_MODEL || "openrouter/free",
        messages: [{ role: "system", content: character }, ...messages],
        temperature: 0.85,
        max_tokens: 800
      })
    });

    if (!upstream.ok) {
      return Response.json(
        { error: "AI provider request failed. Check your model and account limits." },
        { status: 502 }
      );
    }

    const result = await upstream.json();
    const reply = result.choices?.[0]?.message?.content;

    if (typeof reply !== "string" || !reply.trim()) {
      return Response.json({ error: "The AI returned an empty reply." }, { status: 502 });
    }

    return Response.json(
      { reply: reply.trim() },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return Response.json({ error: "Unexpected server error." }, { status: 500 });
  }
}

export async function onRequestGet({ env }) {
  if (!env.OPENROUTER_API_KEY) {
    return Response.json({ ok: false, error: "API key missing" });
  }

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openrouter/free",
          messages: [
            { role: "user", content: "Reply with exactly: Velvet is connected!" }
          ],
          max_tokens: 800
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return Response.json({
        ok: false,
        providerStatus: response.status,
        error: data.error?.message || "Provider request failed"
      });
    }

    
    return Response.json({
      ok: true,
      model: data.model || null,
      responseKeys: Object.keys(data),
      error: data.error || null,
      choicesCount: data.choices?.length || 0,
      firstChoice: data.choices?.[0] ? {
        keys: Object.keys(data.choices[0]),
        finishReason: data.choices[0].finish_reason || null,
        messageKeys: Object.keys(data.choices[0].message || {}),
        contentType: typeof data.choices[0].message?.content,
        content: data.choices[0].message?.content ?? null
      } : null
    });

  } catch {
    return Response.json({ ok: false, error: "Network or server error" });
  }
}
