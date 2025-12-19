import styles from "./DashboardPage.module.css";

export const DashboardPage = () => {
  return (
    <div className={styles.card}>
      <h2>Welcome to the Dashboard</h2>
      <p>
        This is a protected area. You can only see this if you are logged in.
      </p>
    </div>
  );
};
