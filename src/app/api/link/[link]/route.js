import { NextResponse } from "next/server";
import { createYoutubeVideoStore } from "@/utils/ai";

export const GET = async (request, { params }) => {
  try {
    const youtubeLink = decodeURIComponent(params.link);
    const response = await createYoutubeVideoStore(youtubeLink);
    return NextResponse.json({ data: response });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
