import { Mistral } from "@mistralai/mistralai";
import { NextResponse } from "next/server";

const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY! });

export async function POST(req: Request) {
  const { interest, location, city } = await req.json();

  const prompt = `
  You are a food network and discovery assistant AI.
  
  User interest: ${interest || "unknown"}
  User location: ${
    location ? `${location.latitude}, ${location.longitude}` : "unknown"
  }
  User City: ${city ?? ""}
  
  List 5 to 12 real in the area who might be interested in food recommendations. For each foodie, return:
  
  - name (realistic and culturally appropriate)
  - contact (a valid local mobile number format, e.g. +92 XXX XXXXXXX)
  - email (realistic email format)
  - interest (give matched interests with comma seprated string on which interest this foodie came)

  Make sure the list is diverse and localized to the city "${city}", and the users are food lovers or active in food groups, blogs, or reviews. Avoid duplicates or fake patterns.
  Also make sure to not to give same foodies for same interest mix it up
  ⚠️ Respond with ONLY a valid **raw JSON array** of users. No explanation, no formatting, no markdown, no \`\`\`, no wrapping, just plain JSON output.
  `;

  // console.log(prompt);
  try {
    const response = await mistral.chat.complete({
      // model: "mistral-large-2411",
      // model: "mistral-small-2503",
      // model: "open-mixtral-8x22b",
      model: "open-mistral-nemo",
      messages: [{ role: "user", content: prompt }],
    });
    // console.log(response);
    const rawContent = response.choices[0]?.message?.content ?? "";
    const jsonText = typeof rawContent === "string" ? rawContent.trim() : "";
    // Safely parse JSON output
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
// - currency-based estimated price (default to PKR)
// - a realistic image URL (Unsplash or generic)
// - estimated price (cuurency location based default is PKR)
// - one image link (can be from unsplash or realistic)
