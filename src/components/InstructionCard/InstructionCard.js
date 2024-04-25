import styles from "./InstructionCard.module.css";

const InstructionCard = ({ title, description }) => {
  return (
    <div className={styles.instructionCard}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default InstructionCard;
