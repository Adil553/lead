import { Mistral } from "@mistralai/mistralai";
import { NextResponse } from "next/server";

const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY! });

export async function POST(req: Request) {
  const {
    make,
    model,
    priceMin,
    priceMax,
    ccMin,
    ccMax,
    address,
    latitude,
    longitude,
    city,
  } = await req.json();

  const prompt = `
    You are a vehicle sales assistant with access to a web_search tool and geolocation services.

🚗 Vehicle Listing:
- Make: ${make}
- Model: ${model}
- Min Price: ${priceMin}
- Max Price: ${priceMax}
- Engine Min CC: ${ccMin}
- Engine Max CC: ${ccMax}
- Address: ${address}
- Location: ${latitude}, ${longitude}

🎯 Task:
1. Use web_search to find real user leads (buyers/sellers) interested in similar vehicles.
2. Identify car showrooms/dealerships near the provided location that sell ${make} or similar vehicles.

📍 Location Priority:
- Prioritize leads within 10km of the coordinates (${latitude}, ${longitude}) or the provided address (${address}).
- If coordinates are missing, use a geocoding service to derive them from the address.
- Extract the city from the address (e.g., Lahore) for broader matching if proximity yields insufficient results.
- Default to the city/region if address parsing fails.

📝 Output:
Return a single JSON array of 8-12 objects, each containing:
- fullName: string (real name or showroom name make sure showroom data is not fake)
- phone: string (real or "N/A" if unavailable)
- email: string (real, no placeholders like @example.com; use "N/A" if unavailable)
- interest: string (comma-separated, e.g., "${make} ${model}, ${ccMin}cc,${ccMax}cc, ${city}")
- isShowroom: boolean (true for showrooms, false for individuals)

⚠️ Rules:
- Source real leads from public platforms (e.g., social media, dealership websites).
- Do not fabricate contact details; use "N/A" for missing data.
- Return only a raw JSON array, no markdown, explanations, or additional text.
- Ensure leads are relevant to the vehicle (make, model, cc) and location.
    `;

  // console.log(prompt);
  try {
    const response = await mistral.chat.complete({
      model: "mistral-large-2411",
      // model: "mistral-small-2503",
      // model: "open-mixtral-8x22b",
      // model: "open-mistral-nemo",
      messages: [{ role: "user", content: prompt }],
    });
    // console.log(response.choices[0]);
    // Extract raw content

    const rawContent = response.choices[0]?.message?.content ?? "";

    // Extract the first valid JSON array from string content
    const jsonMatch =
      typeof rawContent === "string"
        ? rawContent.match(/\[\s*{[\s\S]*?}\s*\]/)
        : null;
    if (!jsonMatch) {
      return NextResponse.json({
        items: [],
        note: "No valid JSON array found in Mistral's response.",
      });
    }

    const jsonText = jsonMatch[0];
    const items = JSON.parse(jsonText);

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error parsing or generating leads:", error);
    return NextResponse.json(
      { error: "Failed to generate user leads." },
      { status: 500 }
    );
  }
}
