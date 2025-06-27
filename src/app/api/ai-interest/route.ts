/* eslint-disable @typescript-eslint/no-explicit-any */
import { Mistral } from "@mistralai/mistralai";
import { NextResponse } from "next/server";

const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY! });

const colorMap: Record<string, string> = {
  veryHigh: "oklch(62% 0.2 145)", // green (80–100)
  high: "oklch(70% 0.18 115)", // yellow-green (60–80)
  medium: "oklch(75% 0.18 75)", // orange (40–60)
  low: "oklch(65% 0.15 50)", // reddish-orange (20–40)
  veryLow: "oklch(60% 0.13 30)", // red (0–20)
};

// const containsProhibited = (value: string, prohibited: string[]): boolean => {
//   return prohibited.some((word) =>
//     value?.toLowerCase().includes(word.toLowerCase())
//   );
// };

export async function POST(req: Request) {
  const {
    mode, // "buy" or "sell"
    make,
    model,
    price, // for sell mode
    priceMin, // for buy mode
    priceMax, // for buy mode
    cc, // for sell mode
    ccMin, // for buy mode
    ccMax, // for buy mode
    address,
    latitude,
    longitude,
    city,
    negotiable, // for sell mode (percentage)
    modelMin, // for buy mode
    modelMax, // for buy mode
    emailWords,
    nameWords,
    contactWords,
    query,
  } = await req.json();

  let prompt = "";

  if (query?.trim()) {
    prompt = `
    You are a vehicle sales assistant with access to a web_search tool and geolocation services.
    
    🔍 User Query:
    "${query}"
    
    🎯 Task:
    1. Use trusted vehicle listing platforms to find real vehicle listings (for buy mode) or leads/showrooms (for sell mode) that match the user query.
    2. Mode: ${mode} (buy: find vehicles matching criteria; sell: find buyers or showrooms interested in the vehicle).
    3. Show results near the user's location if possible: (${latitude}, ${longitude}) or in the city "${city}".
    
    📝 Output:
    Return a JSON array of 8-12 objects.
    - For buy mode, each object represents a vehicle listing with:
      - make: string (no prohibited words: ${nameWords.join(", ")})
      - model: string (no prohibited words: ${nameWords.join(", ")})
      - modelYear: number
      - cc: number
      - price: number (vehicle price in PKR)
      - location: string (no prohibited words: ${nameWords.join(
        ", "
      )}, summarize address or city)
      - matchedPercentage: number (0-100 — how well this vehicle matches the query)
      - phone: string (no prohibited words: ${contactWords.join(
        ", "
      )}, or "N/A")
      - email: string (no prohibited words: ${emailWords.join(
        ", "
      )}, use "N/A" if missing)
    - For sell mode, each object represents a lead or showroom with:
      - fullName: string (no prohibited words: ${nameWords.join(", ")})
      
      - interest: string (no prohibited words: ${[
        ...emailWords,
        ...nameWords,
        ...contactWords,
      ].join(", ")}, summarize match reason or address)
      - isShowroom: boolean
      - matchedPercentage: number (0-100 — how well this result matches the query)
      - negotiable: number (percentage, e.g., ${negotiable})
    
    ⚠️ Rules:
    - No fake or placeholder data.
    - Output must be plain JSON array only — no markdown, text, or extra formatting.
    `;
  } else if (mode === "buy") {
    prompt = `
    You are a vehicle sales assistant with access to a web_search tool and geolocation services.

    🚗 Vehicle Buying Criteria:
    - Make: ${make}
    - Model Year Range: ${modelMin}–${modelMax}
    - Price Range: ${priceMin}–${priceMax}
    - Engine CC Range: ${ccMin}–${ccMax}
    - Address: ${address}
    - Location: ${latitude}, ${longitude}
    - City: ${city}

    🎯 Task:
    1. Use trusted vehicle listing platforms to find vehicles matching the criteria.
    2. Identify vehicles available for sale near the provided location.

    📍 Location Priority:
    - Prefer vehicles within 10km of coordinates (${latitude}, ${longitude}) or from city "${city}".

    📝 Output:
    Return a JSON array of 8-12 objects, each representing a vehicle listing with:
    - make: string (no prohibited words: ${nameWords.join(", ")})
    - model: string (no prohibited words: ${nameWords.join(", ")})
    - modelYear: number
    - cc: number
    - price: string (vehicle price) with curreny
    - phone: seller phone string (no prohibited words: ${contactWords.join(
      ", "
    )}, or "N/A")
    - email: seller email string (no prohibited words: ${emailWords.join(
      ", "
    )}, use "N/A" if missing)
    - location: string (no prohibited words: ${nameWords.join(
      ", "
    )}, summarize address or city)
    - matchedPercentage: number (0-100 — how well this vehicle matches the criteria)

    ⚠️ Rules:
    - Use real sources only (dealerships, forums, social platforms).
    - No placeholder values.
    - Return only the raw JSON array.
    `;
  } else if (mode === "sell") {
    prompt = `
    You are a vehicle sales assistant with access to a web_search tool and geolocation services.

    🚗 Vehicle Selling Details:
    - Make: ${make}
    - Model: ${model}
    - Engine CC: ${cc}
    - Price: ${price}
    - Negotiable: ${negotiable}% (percentage the seller is willing to negotiate)
    - Address: ${address}
    - Location: ${latitude}, ${longitude}
    - City: ${city}

    🎯 Task:
    1. Use trusted vehicle listing platforms to find real buyers or showrooms interested in purchasing ${make} ${model}.
    2. Identify car showrooms/dealerships near the provided location that buy similar vehicles.

    📍 Location Priority:
    - Prefer leads within 10km of coordinates (${latitude}, ${longitude}) or from city "${city}".

    📝 Output:
    Return a JSON array of 8-12 objects, each with:
    - fullName: string (no prohibited words: ${nameWords.join(", ")})
    - phone: string (no prohibited words: ${contactWords.join(", ")}, or "N/A")
    - email: string (no prohibited words: ${emailWords.join(
      ", "
    )}, use "N/A" if missing)
    - interest: string (no prohibited words: ${[
      ...emailWords,
      ...nameWords,
      ...contactWords,
    ].join(
      ", "
    )}, e.g., "Interested in buying ${make} ${model} ${cc}cc in ${city}")
    - isShowroom: boolean
    - matchedPercentage: number (0-100 — how well this lead matches the criteria)
    - negotiable: number (percentage, e.g., ${negotiable})

    ⚠️ Rules:
    - Use real sources only (dealerships, forums, social platforms).
    - No placeholder values.
    - Return only the raw JSON array.
    `;
  }

  console.log(prompt);

  try {
    const response = await mistral.chat.complete({
      model: "mistral-large-2411",
      messages: [{ role: "user", content: prompt }],
    });

    const rawContent = response.choices[0]?.message?.content ?? "";
    // console.log(rawContent);

    const cleanJSON = (text: string) =>
      text
        .replace(/^```json/, "")
        .replace(/^```/, "")
        .replace(/```$/, "")
        .trim();

    const jsonText =
      typeof rawContent === "string" ? cleanJSON(rawContent) : "";
    if (!jsonText) {
      return NextResponse.json({
        items: [],
        note: "No valid JSON array found in Mistral's response.",
      });
    }

    let items = JSON.parse(jsonText);
    // Filter out invalid data based on mode
    items = items
      // .filter((item: any) => {
      //   if (mode === "buy") {
      //     return (
      //       !containsProhibited(item.make ?? "", nameWords) &&
      //       !containsProhibited(item.model ?? "", nameWords) &&
      //       !containsProhibited(item.location ?? "", nameWords) &&
      //       typeof item.modelYear === "number" &&
      //       typeof item.cc === "number" &&
      //       typeof item.price === "number" &&
      //       typeof item.matchedPercentage === "number"
      //     );
      //   } else {
      //     return (
      //       !containsProhibited(item.email ?? "", emailWords) &&
      //       !containsProhibited(item.fullName ?? "", nameWords) &&
      //       !containsProhibited(item.phone ?? "", contactWords) &&
      //       !containsProhibited(item.interest ?? "", [
      //         ...emailWords,
      //         ...nameWords,
      //         ...contactWords,
      //       ]) &&
      //       typeof item.isShowroom === "boolean" &&
      //       typeof item.negotiable === "number" &&
      //       typeof item.matchedPercentage === "number"
      //     );
      //   }
      // })
      .map((item: any) => {
        const percentage = Math.round(item.matchedPercentage ?? 0);

        let level: keyof typeof colorMap = "veryLow";
        if (percentage >= 80) level = "veryHigh";
        else if (percentage >= 60) level = "high";
        else if (percentage >= 40) level = "medium";
        else if (percentage >= 20) level = "low";

        return {
          ...item,
          matchedPercentage: percentage,
          color: colorMap[level],
        };
      });

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error parsing or generating results:", error);
    return NextResponse.json(
      { error: "Failed to generate results." },
      { status: 500 }
    );
  }
}
