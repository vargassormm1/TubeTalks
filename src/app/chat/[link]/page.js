"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./chat.module.css";
import { useParams } from "next/navigation";
import { getAIResponse } from "@/utils/api";
import QACard from "@/components/QACard/QACard";
import { Spin, Space, Button, Input, message } from "antd";
import { SendOutlined } from "@ant-design/icons";

const Chat = () => {
  const chatHistoryRef = useRef(null);
  const inputRef = useRef(null);
  const { link } = useParams();
  const [question, setQuestion] = useState("");
  const [disable, setDisable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      role: "assistant",
      content:
        "What would you like to know about the video? Feel free to ask about specific segments, topics, or anything else that piques your interest.",
    },
  ]);

  const handleSend = async () => {
    if (question.trim() === "") {
      message.error("Please enter a question before sending.");
      return;
    }

    const newUserMessage = {
      role: "user",
      content: question,
    };
    setChatHistory((prev) => [...prev, newUserMessage]);
    setQuestion("");
    setDisable(true);
    setLoading(true);

    try {
      const response = await getAIResponse(link, [
        ...chatHistory,
        newUserMessage,
      ]);
      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response,
        },
      ]);
    } catch (error) {
      message.error(
        "Failed to get response from the server. Please try again later."
      );
    } finally {
      setLoading(false);
      setDisable(false);
    }
  };

  const scrollToBottom = () => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  useEffect(() => {
    scrollToBottom();
    inputRef.current.focus();
  }, []);

  return (
    <div className={styles.container}>
      <div ref={chatHistoryRef} className={styles.chatHistory}>
        {chatHistory.map((chat, id) => {
          return <QACard key={id} user={chat.role} content={chat.content} />;
        })}
        {loading ? (
          <div className={styles.spinner}>
            <Spin />
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className={styles.chatForm}>
        <Space.Compact
          style={{
            alignSelf: "center",
            justifySelf: "center",
            width: "100%",
          }}
        >
          <Input
            ref={inputRef}
            size="large"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Message AI Helper"
            disabled={disable}
          />
          <Button
            size="large"
            onClick={handleSend}
            type="primary"
            style={{ backgroundColor: "#CE1212" }}
          >
            <SendOutlined />
          </Button>
        </Space.Compact>
      </div>
    </div>
  );
};

export default Chat;
