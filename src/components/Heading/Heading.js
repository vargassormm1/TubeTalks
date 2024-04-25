import styles from "./Heading.module.css";

const Heading = () => {
  return (
    <header className={styles.container}>
      <h1>TubeTalks</h1>
      <p>Clip. Question. Learn.</p>
    </header>
  );
};

export default Heading;
