import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Box,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Alert,
  Button,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  LocalShipping,
  Schedule,
  CheckCircle,
  History,
  ArrowBack,
  Place,
  Inventory,
  AttachMoney,
} from "@mui/icons-material";
import Grid from "@mui/material/Grid";
import { useApi } from "@/hooks/useApi";
import { useShipmentSocket } from "../hooks/useShipmentSocket";
import type {
  ShipmentTrackingDto,
  StatusUpdateEvent,
  StatusHistoryItem,
} from "../types/tracking.types";
import type { ApiResponse } from "@/types/api";
import { formatCOP } from "@/utils/currency-formater";

const formatColombiaDate = (dateString: string) => {
  const date = new Date(dateString);
  date.setHours(date.getHours() - 5);
  return date.toLocaleString("es-CO");
};

const STATUS_STEPS = ["EN_ESPERA", "EN_TRANSITO", "ENTREGADO"];

const getStatusLabel = (status: string) => {
  switch (status) {
    case "EN_ESPERA":
      return "En Espera";
    case "EN_TRANSITO":
      return "En Tránsito";
    case "ENTREGADO":
      return "Entregado";
    default:
      return status;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "EN_ESPERA":
      return <Schedule sx={{ fontSize: 16 }} />;
    case "EN_TRANSITO":
      return <LocalShipping sx={{ fontSize: 16 }} />;
    case "ENTREGADO":
      return <CheckCircle sx={{ fontSize: 16 }} />;
    default:
      return undefined;
  }
};

const getStatusStyles = (status: string) => {
  switch (status) {
    case "EN_ESPERA":
      return {
        background: "linear-gradient(135deg, #ff9800 0%, #ffc107 100%)",
        color: "white",
        boxShadow: "0 2px 8px rgba(255, 152, 0, 0.3)",
      };
    case "EN_TRANSITO":
      return {
        background: "linear-gradient(135deg, #2196f3 0%, #03a9f4 100%)",
        color: "white",
        boxShadow: "0 2px 8px rgba(33, 150, 243, 0.3)",
      };
    case "ENTREGADO":
      return {
        background: "linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)",
        color: "white",
        boxShadow: "0 2px 8px rgba(76, 175, 80, 0.3)",
      };
    default:
      return {
        background: "grey.200",
        color: "text.primary",
      };
  }
};

export const ShipmentTracking = () => {
  const { trackingNumber } = useParams<{ trackingNumber: string }>();
  const navigate = useNavigate();
  const { get } = useApi<ApiResponse<ShipmentTrackingDto>>();

  const [trackingData, setTrackingData] = useState<ShipmentTrackingDto | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleStatusUpdate = useCallback((data: StatusUpdateEvent) => {
    setTrackingData((prev) => {
      if (!prev || prev.id !== data.shipmentId) return prev;

      const newHistoryItem: StatusHistoryItem = {
        status: data.status,
        occurredAt: data.occurredAt,
        note: data.note,
      };

      return {
        ...prev,
        currentStatus: data.status,
        history: [...prev.history, newHistoryItem],
      };
    });
  }, []);

  useShipmentSocket(trackingData?.id ?? null, handleStatusUpdate);

  useEffect(() => {
    const fetchTracking = async () => {
      if (!trackingNumber) return;

      setLoading(true);
      setError(null);

      try {
        const response = await get(`/shipments/${trackingNumber}/status`);
        if (response?.success && response.data) {
          setTrackingData(response.data);
        } else if (response?.error) {
          setError(response.error.message);
        } else {
          setError("Error al cargar el seguimiento");
        }
      } catch {
        setError("Error al cargar el seguimiento");
      }

      setLoading(false);
    };

    fetchTracking();
  }, [trackingNumber]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate("/shipments")}
        >
          Volver a Mis Envíos
        </Button>
      </Box>
    );
  }

  if (!trackingData) return null;

  const activeStep = STATUS_STEPS.indexOf(trackingData.currentStatus);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/shipments")}
          sx={{ mb: 2 }}
        >
          Volver
        </Button>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <LocalShipping color="primary" /> Seguimiento de Envío
        </Typography>
      </Box>

      {/* Tracking Number Card */}
      <Card sx={{ mb: 3, border: "2px solid", borderColor: "primary.main" }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box>
              <Typography color="text.secondary" variant="body2">
                Número de Guía
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {trackingData.trackingNumber}
              </Typography>
            </Box>
            <Chip
              icon={getStatusIcon(trackingData.currentStatus)}
              label={getStatusLabel(trackingData.currentStatus)}
              size="medium"
              sx={{
                fontWeight: 600,
                px: 2,
                py: 2.5,
                fontSize: "0.95rem",
                "& .MuiChip-icon": { color: "white" },
                ...getStatusStyles(trackingData.currentStatus),
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Package Details */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <Inventory color="primary" /> Detalles del Paquete
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Place color="success" />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Origen
                </Typography>
                <Typography fontWeight="600">
                  {trackingData.origin.cityName}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Place color="error" />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Destino
                </Typography>
                <Typography fontWeight="600">
                  {trackingData.destination.cityName}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Peso Cobrado
            </Typography>
            <Typography fontWeight="600">
              {trackingData.chargeableWeightKg} kg
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Precio Total
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  {formatCOP(trackingData.quotedPriceCents)}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Status Stepper */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Estado del Envío
        </Typography>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mt: 3 }}>
          {STATUS_STEPS.map((status) => (
            <Step key={status}>
              <StepLabel
                icon={
                  status === "ENTREGADO" ? (
                    <CheckCircle
                      color={
                        trackingData.currentStatus === "ENTREGADO"
                          ? "success"
                          : "disabled"
                      }
                    />
                  ) : status === "EN_TRANSITO" ? (
                    <LocalShipping
                      color={
                        STATUS_STEPS.indexOf(trackingData.currentStatus) >= 1
                          ? "primary"
                          : "disabled"
                      }
                    />
                  ) : (
                    <Schedule
                      color={
                        STATUS_STEPS.indexOf(trackingData.currentStatus) >= 0
                          ? "warning"
                          : "disabled"
                      }
                    />
                  )
                }
              >
                {getStatusLabel(status)}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* History */}
      <Paper sx={{ p: 3 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <History color="primary" /> Historial de Estados
        </Typography>
        <Divider sx={{ my: 2 }} />
        <List>
          {trackingData.history
            .slice()
            .reverse()
            .map((item, index) => (
              <ListItem
                key={index}
                divider={index < trackingData.history.length - 1}
              >
                <ListItemIcon>
                  <Chip
                    icon={getStatusIcon(item.status)}
                    label={getStatusLabel(item.status)}
                    size="small"
                    sx={{
                      fontWeight: 500,
                      minWidth: 110,
                      marginRight: 2,
                      "& .MuiChip-icon": { color: "white" },
                      ...getStatusStyles(item.status),
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={item.note || getStatusLabel(item.status)}
                  secondary={formatColombiaDate(item.occurredAt)}
                />
              </ListItem>
            ))}
        </List>
      </Paper>
    </Box>
  );
};

export default ShipmentTracking;
