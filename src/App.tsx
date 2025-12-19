import { Routes, Route } from "react-router";
import { AuthPage } from "./pages/AuthPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ProtectedLayout } from "./components/layout/ProtectedLayout";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>
    </Routes>
  );
}

export default App;
