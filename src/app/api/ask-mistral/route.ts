import { MAX_NOTE } from "@/constants/constants";
import { NoteRequestBody } from "@/utils/types";
import { Mistral } from "@mistralai/mistralai";
import { NextResponse } from "next/server";

const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY! });

export async function POST(req: Request) {
  try {
    const {
      type,
      deliveryDistance,
      deliveryOption,
      guests,
      orderType,
      eta,
      isStaff,
      items = [],
    }: NoteRequestBody = await req.json();

    let prompt = "";
    let outputKey = "";

    // Format item list (used only when isStaff is false)
    const formattedItems = items
      .map(
        (item) =>
          `${item.quantity}x ${item.productname}${
            item.unitname ? " (" + item.unitname + ")" : ""
          }`
      )
      .join(", ");

    // Prompt builder
    const buildPrompt = (): string => {
      outputKey = type === "order" ? "Order Note" : "Delivery Note";

      if (isStaff) {
        const contextDetails =
          type === "order"
            ? `Order Type: ${orderType}\n ${
                orderType === "Dine in" ? `Guests: ${guests}` : ""
              }`
            : `Delivery Option: ${deliveryOption}\nDistance: ${deliveryDistance} m`;

        return `
  You are a restaurant admin writing a short note for the customer.
  
  Keep it short, clear, and under ${MAX_NOTE} words. Do NOT list the items. Just include essential info like ETA, delivery distance if provided, and key prep/timing cues. No greetings, thank-you messages, or full instructions.
  
  Details:
  ${contextDetails}
  ETA: ${eta || "not provided"}
  
  Format:
  ${outputKey}: <your note>
      `.trim();
      } else {
        // Customer prompt — friendly and casual
        const base = (details: string, label: string) =>
          `
        You are a restaurant assistant.
        
        Write a short (${MAX_NOTE} words max), casual note a customer might leave for the kitchen team. Keep it very short, natural, and to the point. Avoid greetings, thank-you notes, or full item names.
        
        If there's an ETA, include it casually (e.g., "expecting food around 2:15 PM").
        
        If items are provided, just mention general needs (e.g., "cold drinks please", "make it spicy"), not full item names or counts.
        
        Details:
        ${details}
        ${items.length ? "Items: " + formattedItems : ""}
        ETA: ${eta || "not provided"}
        
        Response format:
        ${label}: <your note>
        `.trim();

        switch (type) {
          case "order":
            switch (orderType) {
              case "Dine in":
                return base(
                  `Order Type: Dine In\nGuests: ${guests}`,
                  outputKey
                );
              case "Take Away":
                return base(`Order Type: Take Away`, outputKey);
              case "Delivery":
                return base(
                  `Order Type: Delivery\nDelivery Option: ${deliveryOption}\nDistance: ${deliveryDistance} m`,
                  outputKey
                );
              default:
                throw new Error("Invalid order type");
            }
          case "delivery":
            return `
            You are a restaurant assistant.
            
            Write a very short and clear delivery note (max ${MAX_NOTE} words) from a customer to the rider.
            
            Just mention quick info like where to drop (e.g., "side gate", "ask guard", "use lift"), buzz instructions, or floor number if relevant.
            
            Do **not** repeat full address or say thanks. Mention ETA only if needed (e.g., "expecting around 9:15 PM").
            
            Response format:
            ${outputKey}: <your note>
              `.trim();

          default:
            throw new Error("Invalid note type");
        }
      }
    };

    prompt = buildPrompt();

    const response = await mistral.chat.complete({
      model: "mistral-large-2411",
      messages: [
        {
          role: "user",
          content: prompt,
          // "biryani available on which restaurants near me, Karachi, just list some famous restaurants with ratings ",
        },
      ],
    });

    const rawContent = response.choices[0]?.message?.content ?? "";
    const responseText = Array.isArray(rawContent)
      ? rawContent.join(" ")
      : rawContent;

    const extractedNote =
      responseText.split(new RegExp(`${outputKey}:`, "i"))[1]?.trim() ||
      responseText.trim();

    return NextResponse.json({ note: extractedNote });
  } catch (error) {
    console.error("Note generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate note" },
      { status: 500 }
    );
  }
}
