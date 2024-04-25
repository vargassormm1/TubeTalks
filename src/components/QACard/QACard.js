import styles from "./QACard.module.css";

const QACard = ({ user, content }) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.name}>{user}</h3>
      <p className={styles.content}>{content}</p>
    </div>
  );
};

export default QACard;
