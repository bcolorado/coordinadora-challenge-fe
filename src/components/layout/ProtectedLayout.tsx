import { Navigate, Outlet } from "react-router";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
} from "@mui/material";

export const ProtectedLayout = () => {
  const isAuthenticated = localStorage.getItem("auth") === "true";

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Shipping Platform
          </Typography>
          <Button
            color="inherit"
            onClick={() => {
              localStorage.removeItem("auth");
              window.location.href = "/";
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
};
