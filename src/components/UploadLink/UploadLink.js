"use client";
import { useState } from "react";
import styles from "./UploadLink.module.css";
import { getYoutubeStore } from "@/utils/api";
import { redirect } from "next/router";
import { useRouter } from "next/navigation";

const UploadLink = () => {
  const [link, setLink] = useState("");
  const router = useRouter();

  const handleUpload = async () => {
    setLink("");
    await getYoutubeStore(encodeURIComponent(link));
    router.push(`/chat/${encodeURIComponent(link)}`);
  };

  return (
    <div className={styles.container}>
      <input
        type="text"
        value={link}
        onChange={(e) => setLink(e.target.value)}
      />
      <button onClick={handleUpload}>Load Video</button>
    </div>
  );
};

export default UploadLink;
