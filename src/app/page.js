import InstructionCard from "@/components/InstructionCard/InstructionCard";
import styles from "./page.module.css";
import UploadLink from "@/components/UploadLink/UploadLink";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <h2>Welcome to TubeTalks!</h2>
        <p>
          Discover more in every video. Ask questions, get answers, and explore!
        </p>
      </div>
      <div className={styles.upload}>
        <UploadLink />
      </div>
      <div className={styles.instructions}>
        <InstructionCard
          title="Enter a YouTube Link"
          description="Enter the YouTube video link into the designated field to begin unlocking its content."
        />
        <InstructionCard
          title="Ask Your Questions"
          description="Type your questions into the chat interface to interact with AI based on the video's content."
        />
        <InstructionCard
          title="Discover Insights"
          description="Receive answers and insights directly related to your queries about the video."
        />
      </div>
    </main>
  );
}
