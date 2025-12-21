import { Navigate, Outlet, useNavigate, useLocation } from "react-router";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Chip,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  LocalShipping,
  Dashboard,
  Calculate,
  Logout,
  Person,
  ExpandMore,
  Menu as MenuIcon,
  Close,
} from "@mui/icons-material";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { logout } from "@/features/auth/authSlice";

export const ProtectedLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoggedIn = isAuthenticated || localStorage.getItem("auth") === "true";
  const userName = user?.fullName || "Usuario";

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("auth");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { label: "Inicio", path: "/dashboard", icon: <Dashboard /> },
    { label: "Cotizar", path: "/quote", icon: <Calculate /> },
    { label: "Mis Envíos", path: "/shipments", icon: <LocalShipping /> },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: "grey.50" }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background:
            "linear-gradient(135deg, hsl(215 90% 35%) 0%, hsl(195 80% 40%) 100%)",
          borderBottom: "1px solid",
          borderColor: "rgba(255,255,255,0.1)",
        }}
      >
        <Toolbar sx={{ gap: 2 }}>
          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color="inherit"
              onClick={() => setMobileMenuOpen(true)}
              edge="start"
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
            }}
            onClick={() => navigate("/dashboard")}
          >
            <LocalShipping sx={{ fontSize: 32 }} />
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{
                background: "linear-gradient(90deg, #fff 0%, #e0f7fa 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: { xs: "none", sm: "block" },
              }}
            >
              Reto Coordinadora
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: "flex", gap: 1, ml: 4 }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  startIcon={item.icon}
                  onClick={() => navigate(item.path)}
                  sx={{
                    color: "white",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: isActive(item.path) ? 600 : 400,
                    bgcolor: isActive(item.path)
                      ? "rgba(255,255,255,0.15)"
                      : "transparent",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {isMobile && <Box sx={{ flexGrow: 1 }} />}

          {/* User Menu */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Chip
              avatar={
                <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>
                  <Person sx={{ fontSize: 18, color: "white" }} />
                </Avatar>
              }
              label={isMobile ? undefined : userName}
              deleteIcon={
                !isMobile ? (
                  <ExpandMore sx={{ color: "white !important" }} />
                ) : undefined
              }
              onDelete={!isMobile ? handleMenuOpen : undefined}
              onClick={handleMenuOpen}
              sx={{
                bgcolor: "rgba(255,255,255,0.1)",
                color: "white",
                fontWeight: 500,
                px: isMobile ? 0 : 1,
                cursor: "pointer",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.15)",
                },
              }}
            />
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 180,
                  borderRadius: 2,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                },
              }}
            >
              <MenuItem disabled>
                <Typography variant="body2" color="text.secondary">
                  {userName}
                </Typography>
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={handleLogout}
                sx={{ color: "error.main", gap: 1 }}
              >
                <ListItemIcon>
                  <Logout fontSize="small" color="error" />
                </ListItemIcon>
                Cerrar Sesión
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            background:
              "linear-gradient(180deg, hsl(215 90% 35%) 0%, hsl(195 80% 40%) 100%)",
          },
        }}
      >
        <Box sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LocalShipping sx={{ fontSize: 28, color: "white" }} />
            <Typography variant="h6" fontWeight="bold" color="white">
              Coordinadora
            </Typography>
          </Box>
          <IconButton
            onClick={() => setMobileMenuOpen(false)}
            sx={{ color: "white" }}
          >
            <Close />
          </IconButton>
        </Box>
        <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />
        <List sx={{ px: 1, py: 2 }}>
          {navItems.map((item) => (
            <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => handleNavClick(item.path)}
                sx={{
                  borderRadius: 2,
                  bgcolor: isActive(item.path)
                    ? "rgba(255,255,255,0.15)"
                    : "transparent",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{
                    color: "white",
                    "& .MuiTypography-root": {
                      fontWeight: isActive(item.path) ? 600 : 400,
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />
        <Box sx={{ p: 2 }}>
          <Button
            fullWidth
            startIcon={<Logout />}
            onClick={handleLogout}
            sx={{
              color: "white",
              justifyContent: "flex-start",
              textTransform: "none",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            Cerrar Sesión
          </Button>
        </Box>
      </Drawer>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
};
