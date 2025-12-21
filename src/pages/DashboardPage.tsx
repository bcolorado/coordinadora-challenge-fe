import { useNavigate } from "react-router";
import {
  Box,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  LocalShipping,
  Calculate,
  TrackChanges,
  Add,
  TrendingUp,
  Pending,
  CheckCircle,
} from "@mui/icons-material";
import { useAppSelector } from "@/hooks/redux";

const QuickActionCard = ({
  icon,
  title,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) => (
  <Card
    sx={{
      cursor: "pointer",
      transition: "all 0.2s ease",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: 6,
      },
    }}
    onClick={onClick}
  >
    <CardContent sx={{ textAlign: "center", py: 4 }}>
      <Box sx={{ color: "primary.main", mb: 2 }}>{icon}</Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </CardContent>
  </Card>
);

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold">
            ¡Bienvenido, {user?.fullName || "Usuario"}!
          </Typography>
          <Typography color="text.secondary">
            Gestiona tus envíos y rastrea paquetes
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate("/quote")}
          sx={{
            background:
              "linear-gradient(135deg, hsl(215 90% 45%) 0%, hsl(195 80% 45%) 100%)",
          }}
        >
          Nuevo Envío
        </Button>
      </Box>

      {/* Quick Actions */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <QuickActionCard
            icon={<Calculate sx={{ fontSize: 48 }} />}
            title="Cotizar y crear Envío"
            description="Calcula el costo y crea el envío de tu paquete"
            onClick={() => navigate("/quote")}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <QuickActionCard
            icon={<LocalShipping sx={{ fontSize: 48 }} />}
            title="Mis Envíos"
            description="Ver y gestionar todos tus envíos"
            onClick={() => navigate("/shipments")}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
