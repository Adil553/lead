// src/pages/api/send-whatsapp.js

import { getTextMessageInput, sendMessage } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method Not Allowed" });
  }
  const { text } = await req.json();

  try {
    const messageData = getTextMessageInput(process.env.RECIPIENT_WAID, text);

    await sendMessage(messageData);

    return NextResponse.json({
      success: true,
      message: "Message sent successfully.",
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error sending WhatsApp message:", error.message);
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response
      ) {
        console.error("Error details:", error.response.data);
      }
    } else {
      console.error("Unknown error occurred:", error);
    }
    return NextResponse.json(
      { error: "Failed to send message." },
      { status: 500 }
    );
  }
}
