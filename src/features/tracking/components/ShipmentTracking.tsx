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
} from "@mui/icons-material";
import { useApi } from "@/hooks/useApi";
import { useShipmentSocket } from "../hooks/useShipmentSocket";
import type {
  ShipmentTrackingDto,
  StatusUpdateEvent,
  StatusHistoryItem,
} from "../types/tracking.types";
import type { ApiResponse } from "@/types/api";

const STATUS_STEPS = ["EN_ESPERA", "EN_TRANSITO", "ENTREGADO"];

const getStatusLabel = (status: string) => {
  switch (status) {
    case "EN_ESPERA":
      return "Pendiente";
    case "EN_TRANSITO":
      return "En Tránsito";
    case "ENTREGADO":
      return "Entregado";
    default:
      return status;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "EN_ESPERA":
      return "warning";
    case "EN_TRANSITO":
      return "info";
    case "ENTREGADO":
      return "success";
    default:
      return "default";
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
              label={getStatusLabel(trackingData.currentStatus)}
              color={getStatusColor(trackingData.currentStatus) as any}
              size="medium"
              sx={{ fontWeight: 600, px: 2, py: 2.5 }}
            />
          </Box>
        </CardContent>
      </Card>

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
                    label={getStatusLabel(item.status)}
                    color={getStatusColor(item.status) as any}
                    size="small"
                  />
                </ListItemIcon>
                <ListItemText
                  primary={item.note || getStatusLabel(item.status)}
                  secondary={new Date(item.occurredAt).toLocaleString("es-CO")}
                />
              </ListItem>
            ))}
        </List>
      </Paper>
    </Box>
  );
};

export default ShipmentTracking;
