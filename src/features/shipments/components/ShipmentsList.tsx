import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { Visibility, Add, LocalShipping } from "@mui/icons-material";
import { useApi } from "@/hooks/useApi";
import type { UserShipmentDto } from "../types/shipment.types";
import type { ApiResponse } from "@/types/api";
import { formatCOP } from "@/utils/currency-formater";

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "EN_ESPERA":
      return "warning";
    case "EN_TRASITO":
      return "info";
    case "ENTREGADO":
      return "success";
    case "CANCELADO":
      return "error";
    default:
      return "default";
  }
};

const getStatusLabel = (status: string) => {
  switch (status.toLowerCase()) {
    case "EN_ESPERA":
      return "Pendiente";
    case "EN_TRASITO":
      return "En Tránsito";
    case "ENTREGADO":
      return "Entregado";
    case "CANCELADO":
      return "Cancelado";
    default:
      return status;
  }
};

export const ShipmentsList = () => {
  const navigate = useNavigate();
  const { get } = useApi<ApiResponse<UserShipmentDto[]>>();
  const [shipments, setShipments] = useState<UserShipmentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShipments = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await get("/shipments");
        if (response?.success && response.data) {
          setShipments(response.data);
        } else if (response?.error) {
          setError(response.error.message);
        } else {
          setError("Error al cargar los envíos");
        }
      } catch {
        setError("Error al cargar los envíos");
      }
      setLoading(false);
    };
    fetchShipments();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (shipments.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <LocalShipping sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No tienes envíos registrados
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate("/quote")}
          sx={{
            mt: 2,
            background:
              "linear-gradient(135deg, hsl(215 90% 45%) 0%, hsl(195 80% 45%) 100%)",
          }}
        >
          Crear Nuevo Envío
        </Button>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Número de Guía</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align="right">Peso (kg)</TableCell>
            <TableCell align="right">Precio</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {shipments.map((shipment) => (
            <TableRow key={shipment.id} hover>
              <TableCell>
                <Typography fontWeight="600">
                  {shipment.trackingNumber}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={getStatusLabel(shipment.status)}
                  color={getStatusColor(shipment.status) as any}
                  size="small"
                />
              </TableCell>
              <TableCell align="right">
                {shipment.chargeableWeightKg} kg
              </TableCell>
              <TableCell align="right">
                {formatCOP(shipment.quotedPriceCents)}
              </TableCell>
              <TableCell>
                {new Date(shipment.createdAt).toLocaleDateString("es-CO")}
              </TableCell>
              <TableCell align="center">
                <IconButton
                  color="primary"
                  onClick={() =>
                    navigate(`/tracking/${shipment.trackingNumber}`)
                  }
                  title="Ver detalles"
                >
                  <Visibility />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ShipmentsList;
