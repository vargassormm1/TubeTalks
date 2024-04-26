"use client";
import { useState } from "react";
import styles from "./UploadLink.module.css";
import { getYoutubeStore } from "@/utils/api";
import { useRouter } from "next/navigation";
import { notification, Spin } from "antd";

const UploadLink = () => {
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpload = async () => {
    if (!link.trim()) {
      notification.error({
        message: "Input Error",
        description: "Please enter a valid YouTube URL.",
        placement: "topRight",
      });
      return;
    }
    try {
      setLink("");
      setLoading(true);
      await getYoutubeStore(encodeURIComponent(link));
      setLoading(false);
      notification.success({
        message: "Success",
        description:
          "Great! The video has been loaded and is ready for you to explore.",
        placement: "topRight",
      });
      router.push(`/chat/${encodeURIComponent(link)}`);
    } catch (error) {
      console.error("Upload failed:", error);
      notification.error({
        message: "Upload Error",
        description: "Failed to load the video. Please try again.",
        placement: "topRight",
      });
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
