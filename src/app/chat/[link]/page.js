"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./chat.module.css";
import { useParams } from "next/navigation";
import { getAIResponse } from "@/utils/api";
import QACard from "@/components/QACard/QACard";
import { Spin, Space, Button, Input, notification } from "antd";
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
        "You are a helpful AI assistant. Answer questions to your best ability.",
    },
  ]);

  const handleSend = async () => {
    if (question.trim() === "") {
      notification.error({
        message: "Input Error",
        description: "Please enter a question before sending.",
        placement: "topRight",
      });
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
      notification.error({
        message: "Network Error",
        description:
          "Failed to get response from the server. Please try again later.",
        placement: "topRight",
      });
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
        {loading ? <Spin /> : <></>}
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
          <Button size="large" onClick={handleSend} type="primary">
            <SendOutlined />
          </Button>
        </Space.Compact>
      </div>
    </div>
  );
};

export default Chat;
