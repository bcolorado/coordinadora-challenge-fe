import { Routes, Route } from "react-router";
import { AuthPage } from "./pages/AuthPage";
import { DashboardPage } from "./pages/DashboardPage";
import { QuotePage } from "./pages/QuotePage";
import { ShipmentNewPage } from "./pages/ShipmentNewPage";
import { ProtectedLayout } from "./components/layout/ProtectedLayout";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/quote" element={<QuotePage />} />
        <Route path="/shipments/new" element={<ShipmentNewPage />} />
      </Route>
    </Routes>
  );
}

export default App;
