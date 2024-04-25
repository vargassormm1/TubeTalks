"use client";

import { useState } from "react";
import styles from "./chat.module.css";
import { useParams } from "next/navigation";
import { getAIResponse } from "@/utils/api";
import QACard from "@/components/QACard/QACard";
const Chat = () => {
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      role: "assistant",
      content:
        "You are a helpful AI assistant. Answser questions to your best ability.",
    },
  ]);
  const { link } = useParams();

  const handleSend = async () => {
    setChatHistory((prev) => [
      ...prev,
      {
        role: "user",
        content: question,
      },
    ]);
    setQuestion("");
    const response = await getAIResponse(link, chatHistory);
    setChatHistory((prev) => [
      ...prev,
      {
        role: "assistant",
        content: response,
      },
    ]);
  };

  return (
    <div>
      <h1>Chat</h1>
      {chatHistory.map((chat, id) => {
        return <QACard key={id} user={chat.role} content={chat.content} />;
      })}
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button onClick={handleSend}>CLick me</button>
    </div>
  );
};

export default Chat;
