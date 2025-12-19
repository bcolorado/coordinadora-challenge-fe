import { Navigate, Outlet } from "react-router";
import styles from "./ProtectedLayout.module.css";

export const ProtectedLayout = () => {
  const isAuthenticated = localStorage.getItem("auth") === "true";

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h3>Shipping Platform</h3>
        <button
          className={styles.button}
          onClick={() => {
            localStorage.removeItem("auth");
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};
