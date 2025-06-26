import { Mistral } from "@mistralai/mistralai";
import { NextResponse } from "next/server";

const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY! });

let cachedAgentId: string | null = null;

export async function POST(req: Request) {
  const { interest, location, city, query } = await req.json();

  // Only create agent once per runtime
  if (!cachedAgentId) {
    const agent = await mistral.beta.agents.create({
      model: "mistral-medium-latest",
      name: "WebSearch Agent",
      instructions:
        "Use your websearch abilities when answering requests you don't know.",
      description: "Agent able to fetch new information on the web.",
      tools: [{ type: "web_search" }],
    });

    cachedAgentId = agent.id;
  }

  const prompt = `
You are a world-class AI food and drink recommendation engine with access to a web search tool.

🧭 TASK:
Generate realistic food or beverage suggestions near the user using web search. Follow this logic:

👉 If the user query is present and specific, **ignore the interest tags** and focus **only on the query**.
👉 If the query is missing or vague, use the user's interest tags and city to generate recommendations.

👤 User Context:
- Query: ${query || "none"}
- Interests: ${interest || "none"} (used only if query is vague or missing)

📍 Location Context:
- City: ${city || "unknown"}
- Coordinates: ${
    location ? `${location.latitude}, ${location.longitude}` : "unknown"
  }
- Search Radius: 10km
- Country: Assume Pakistan unless specified

🔎 Web Search Guidance:
- If query is present: search with "${query} near ${city}" or "${query} in ${city}"
- If no query: use "popular ${interest} dishes in ${city}" or "top food near ${
    location?.latitude
  },${location?.longitude}"

🎯 OUTPUT:
Return a **valid JSON array** of 5–7 food or drink items. Each object must include:
- name: string
- description: short friendly string (≤ 50 words)
- restaurants: array of 3–5 with:
  - name (string)
  - rating (3.5–5.0)
  - contact (string)
  - email (string)

⚠️ RULES:
- Use the web_search tool to ensure data is realistic
- Respond with raw valid JSON only (no markdown, no extra commentary)
  `;

  try {
    const response = await mistral.beta.conversations.start({
      inputs: prompt,
      agentId: cachedAgentId,
      //  model: "open-mixtral-8x22b",
      // model: "mistral-medium-latest",
    });
    // console.log(response);
    const rawContent =
      typeof response.outputs[1] === "object" &&
      "content" in response.outputs[1]
        ? response.outputs[1].content ?? ""
        : typeof response.outputs[0] === "object" &&
          "content" in response.outputs[0]
        ? response.outputs[0].content
        : "";

    const cleanJSON = (text: string) =>
      text
        .replace(/^```json/, "")
        .replace(/^```/, "")
        .replace(/```$/, "")
        .trim();

    const jsonText =
      typeof rawContent === "string" ? cleanJSON(rawContent) : "";
    const items = JSON.parse(jsonText);

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Parsing or generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate food suggestions" },
      { status: 500 }
    );
  }
}

// const prompt = `
// You are a world-class AI food and drink recommendation engine with access to a web search tool.

// 🧭 TASK:
// Generate realistic food or beverage suggestions near the user using web search. Your logic must follow this rule:

// 👉 If the user query is present and specific, **ignore the interest tags entirely** and focus **only on the query** to find relevant suggestions.
// 👉 If the query is empty, vague, or generic, use the user's interest tags and city to generate recommendations.

// 👤 User Context:
// - Query: ${query || "none"}
// - Interests: ${interest || "none"} (use only if query is missing or vague)

// 📍 Location Context:
// - City: ${city || "unknown"}
// - Coordinates: ${
//   location ? `${location.latitude}, ${location.longitude}` : "unknown"
// }
// - Search Radius: 10km
// - Country: Assume Pakistan unless otherwise specified

// 🔎 Web Search Guidance:
// - If query is present: search with phrases like "${query} near ${city}" or "${query} in ${city}"
// - If query is missing: search for "popular ${interest} dishes in ${city}" or "top food near ${
//   location?.latitude
// },${location?.longitude}"

// 🎯 OUTPUT:
// Return a **valid JSON array** of 5-7 unique food or drink suggestions. Each object must include:

// - **name**: string - concise name of the item
// - **description**: string - short, friendly description (≤ 50 words)
// - **restaurants**: array of 3-5 objects, each with:
//   - name (string)
//   - rating (number between 3.5 and 5.0)
//   - contact (string)
//   - email (string)

// ⚠️ IMPORTANT RULES:
// - Always use the web_search tool for fresh, localized, realistic data.
// - If the query is defined, base results **only** on the query and city — do not consider interest tags.
// - Ensure restaurant names and contacts sound realistic for the region.
// - Do not repeat similar dishes, and do not fabricate fake dishes.
// - Do NOT output markdown, explanations, or extra text — only a raw valid JSON array.
// - Respond only with the raw JSON array.
// `;
