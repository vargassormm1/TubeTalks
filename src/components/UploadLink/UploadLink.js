"use client";
import { useState } from "react";
import styles from "./UploadLink.module.css";
import { getYoutubeStore } from "@/utils/api";
import { useRouter } from "next/navigation";
import { message, Spin } from "antd";

const UploadLink = () => {
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpload = async () => {
    if (!link.trim()) {
      message.error("Please enter a valid YouTube URL.");
      return;
    }
    try {
      setLink("");
      setLoading(true);
      await getYoutubeStore(encodeURIComponent(link));
      router.push(`/chat/${encodeURIComponent(link)}`);
      message.success(
        "Great! The video has been loaded and is ready for you to explore."
      );
      setLoading(false);
    } catch (error) {
      console.error("Upload failed:", error);
      message.error("Failed to load the video. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <input
        type="text"
        value={link}
        onChange={(e) => setLink(e.target.value)}
      />
      {loading ? <Spin /> : <button onClick={handleUpload}>Load Video</button>}
    </div>
  );
};

export default UploadLink;
