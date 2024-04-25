import { NextResponse } from "next/server";
import { getAIResponse } from "@/utils/ai";

export const POST = async (request, { params }) => {
  try {
    const chatHistory = await request.json();

    if (!chatHistory) {
      throw new Error("Invalid request data");
    }

    const youtubeLink = decodeURIComponent(params.link);

    const response = await getAIResponse(youtubeLink, chatHistory);
    return NextResponse.json({ data: response });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
