import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Box, Paper, Typography, Tab, Tabs, Container } from "@mui/material";
import { LocalShipping } from "@mui/icons-material";
import { LoginForm } from "../features/auth/components/LoginForm";
import { RegisterForm } from "../features/auth/components/RegisterForm";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box>{children}</Box>}
  </div>
);

export const AuthPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = localStorage.getItem("auth") === "true";

  const from = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={4}
          sx={{
            p: 4,
            borderRadius: 3,
            animation: "fade-in 0.3s ease-out",
          }}
        >
          {/* Logo */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 64,
                height: 64,
                borderRadius: 2,
                background:
                  "linear-gradient(135deg, rgba(11, 107, 203, 1) 0%, rgba(23, 162, 207, 1) 100%)",
                mb: 2,
              }}
            >
              <LocalShipping sx={{ fontSize: 36, color: "white" }} />
            </Box>
            <Typography variant="h5" fontWeight="bold" color="text.primary">
              Cotización y gestión de envíos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Reto Coordinadora por Bryan Colorado
            </Typography>
          </Box>

          {/* Tabs */}
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            variant="fullWidth"
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              "& .MuiTab-root": {
                fontWeight: 600,
              },
              "& .Mui-selected": {
                color: "primary.main",
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "primary.main",
              },
            }}
          >
            <Tab label="Inicio de sesión" />
            <Tab label="Crear cuenta" />
          </Tabs>

          {/* forms */}
          <TabPanel value={tabValue} index={0}>
            <LoginForm />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <RegisterForm onSuccess={() => setTabValue(0)} />
          </TabPanel>
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthPage;
