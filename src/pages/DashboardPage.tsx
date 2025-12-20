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

const StatCard = ({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  color: string;
}) => (
  <Paper sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
    <Box
      sx={{
        width: 48,
        height: 48,
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: `${color}.light`,
        color: `${color}.main`,
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography variant="h4" fontWeight="bold">
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Box>
  </Paper>
);

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  // Placeholder stats (will be connected to shipments feature later)
  const stats = {
    total: 0,
    pending: 0,
    inTransit: 0,
    delivered: 0,
  };

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

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            icon={<LocalShipping />}
            value={stats.total}
            label="Total Envíos"
            color="primary"
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            icon={<Pending />}
            value={stats.pending}
            label="Pendientes"
            color="warning"
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            icon={<TrendingUp />}
            value={stats.inTransit}
            label="En Tránsito"
            color="info"
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            icon={<CheckCircle />}
            value={stats.delivered}
            label="Entregados"
            color="success"
          />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Acciones Rápidas
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <QuickActionCard
            icon={<Calculate sx={{ fontSize: 48 }} />}
            title="Cotizar Envío"
            description="Calcula el costo de envío de tu paquete"
            onClick={() => navigate("/quote")}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <QuickActionCard
            icon={<LocalShipping sx={{ fontSize: 48 }} />}
            title="Mis Envíos"
            description="Ver y gestionar todos tus envíos"
            onClick={() => navigate("/shipments")}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <QuickActionCard
            icon={<TrackChanges sx={{ fontSize: 48 }} />}
            title="Rastrear Paquete"
            description="Rastrea tu envío en tiempo real"
            onClick={() => navigate("/tracking")}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
