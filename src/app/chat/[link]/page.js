"use client";

import { useState } from "react";
import styles from "./chat.module.css";
import { useParams } from "next/navigation";
import { getAIResponse } from "@/utils/api";
const Chat = () => {
  const [chatHistory, setChatHistory] = useState([
    {
      role: "assistant",
      content:
        "You are a helpful AI assistant. Answser questions to your best ability.",
    },
    {
      role: "User",
      content: "Who is sketch?",
    },
  ]);
  const { link } = useParams();

  const handleSend = async () => {
    const response = await getAIResponse(link, chatHistory);
  };

  return (
    <div>
      <h1>Chat</h1>
      <button onClick={handleSend}>CLick me</button>
    </div>
  );
};

export default Chat;
