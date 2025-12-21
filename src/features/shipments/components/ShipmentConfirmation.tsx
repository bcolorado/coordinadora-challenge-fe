import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Box,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  LocalShipping,
  Edit,
  CheckCircle,
  Calculate,
  Visibility,
  Add,
} from "@mui/icons-material";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { useApi } from "@/hooks/useApi";
import { clearQuote } from "@/features/quote/quoteSlice";
import type { ShipmentResponseDto } from "../types/shipment.types";
import type { ApiResponse } from "@/types/api";
import { formatCOP } from "@/utils/currency-formater";

export const ShipmentConfirmation = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentQuote, formData } = useAppSelector((state) => state.quote);
  const { post } = useApi<ApiResponse<ShipmentResponseDto>>();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdShipment, setCreatedShipment] =
    useState<ShipmentResponseDto | null>(null);

  // If no quote, redirect to quote page
  if (!currentQuote && !createdShipment) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No hay una cotización activa
        </Typography>
        <Button
          variant="contained"
          startIcon={<Calculate />}
          onClick={() => navigate("/quote")}
          sx={{
            mt: 2,
            background:
              "linear-gradient(135deg, hsl(215 90% 45%) 0%, hsl(195 80% 45%) 100%)",
          }}
        >
          Ir a Cotizar
        </Button>
      </Box>
    );
  }

  const handleConfirm = async () => {
    if (!currentQuote || !formData) return;

    setLoading(true);
    setError(null);

    try {
      const result = await post("/shipments", {
        ...currentQuote,
        dimensions: {
          length: formData.length,
          width: formData.width,
          height: formData.height,
        },
      });

      if (result?.success && result.data) {
        setCreatedShipment(result.data);
        dispatch(clearQuote());
      } else if (result?.error) {
        setError(result.error.message);
      } else {
        setError("Error al crear el envío");
      }
    } catch {
      setError("Error al crear el envío");
    }

    setLoading(false);
  };

  // Success state - show tracking number
  if (createdShipment) {
    return (
      <Card
        sx={{
          maxWidth: 600,
          mx: "auto",
          border: "2px solid",
          borderColor: "success.main",
        }}
      >
        <CardContent sx={{ textAlign: "center", py: 4 }}>
          <CheckCircle sx={{ fontSize: 64, color: "success.main", mb: 2 }} />
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            ¡Envío Creado Exitosamente!
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Tu envío ha sido registrado con el siguiente número de seguimiento:
          </Typography>
          <Paper
            sx={{
              p: 2,
              bgcolor: "grey.100",
              display: "inline-block",
              mb: 3,
            }}
          >
            <Typography variant="h4" fontWeight="bold" color="primary">
              {createdShipment.trackingNumber}
            </Typography>
          </Paper>
          <Divider sx={{ my: 3 }} />
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<Visibility />}
                onClick={() =>
                  navigate(`/tracking/${createdShipment.trackingNumber}`)
                }
                sx={{
                  background:
                    "linear-gradient(135deg, hsl(215 90% 45%) 0%, hsl(195 80% 45%) 100%)",
                }}
              >
                Rastrear
              </Button>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Add />}
                onClick={() => navigate("/quote")}
              >
                Nueva Cotización
              </Button>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<LocalShipping />}
                onClick={() => navigate("/shipments")}
              >
                Mis Envíos
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }

  // Confirmation state - show quote summary
  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <LocalShipping color="primary" /> Confirmar Envío
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Revisa los detalles de tu envío antes de confirmar
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid size={{ xs: 6 }}>
            <Typography color="text.secondary">Ruta</Typography>
            <Typography fontWeight="600">
              {currentQuote!.origin.cityName} →{" "}
              {currentQuote!.destination.cityName}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography color="text.secondary">Peso Real</Typography>
            <Typography fontWeight="600">
              {currentQuote!.actualWeight} kg
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography color="text.secondary">Peso Volumétrico</Typography>
            <Typography fontWeight="600">
              {currentQuote!.volumetricWeight} kg
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography color="text.secondary">Peso a Cobrar</Typography>
            <Typography fontWeight="600">
              {currentQuote!.chargeableWeight} kg
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography color="text.secondary">Tarifa por kg</Typography>
            <Typography fontWeight="600">
              {formatCOP(currentQuote!.rate.pricePerKgCents)}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography color="text.secondary">Precio Total</Typography>
            <Typography variant="h5" color="primary" fontWeight="bold">
              {formatCOP(currentQuote!.totalPriceCents)}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => navigate("/quote")}
            disabled={loading}
          >
            Editar Cotización
          </Button>
          <Button
            variant="contained"
            startIcon={
              loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <CheckCircle />
              )
            }
            onClick={handleConfirm}
            disabled={loading}
            sx={{
              background:
                "linear-gradient(135deg, hsl(215 90% 45%) 0%, hsl(195 80% 45%) 100%)",
            }}
          >
            {loading ? "Creando..." : "Confirmar Envío"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ShipmentConfirmation;
