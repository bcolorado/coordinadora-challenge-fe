import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Box,
  Paper,
  TextField,
  Button,
  MenuItem,
  Typography,
  Alert,
  Card,
  CardContent,
  Divider,
  CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { Calculate, LocalShipping } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useApi } from "@/hooks/useApi";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { quoteStart, quoteSuccess, quoteFailure } from "../quoteSlice";
import type {
  QuoteResponseDto,
  LocationResponseDto,
} from "../types/quote.types";
import type { ApiResponse } from "@/types/api";
import { formatCOP } from "@/utils/currency-formater";

const quoteSchema = z.object({
  weight: z.coerce.number().min(0.1, "El peso debe ser al menos 0.1 kg"),
  length: z.coerce.number().min(1, "El largo debe ser al menos 1 cm"),
  width: z.coerce.number().min(1, "El ancho debe ser al menos 1 cm"),
  height: z.coerce.number().min(1, "El alto debe ser al menos 1 cm"),
  originId: z.string().min(1, "Seleccione la ciudad de origen"),
  destinationId: z.string().min(1, "Seleccione la ciudad de destino"),
});

type QuoteFormInput = z.input<typeof quoteSchema>;
type QuoteFormOutput = z.output<typeof quoteSchema>;

export const QuoteForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentQuote, isLoading, error } = useAppSelector(
    (state) => state.quote
  );
  const { post, get } = useApi<ApiResponse<QuoteResponseDto>>();
  const [locations, setLocations] = useState<LocationResponseDto[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [locationsError, setLocationsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      setLoadingLocations(true);
      setLocationsError(null);
      try {
        const response = (await get("/locations")) as ApiResponse<
          LocationResponseDto[]
        > | null;
        if (response?.success && response.data) {
          setLocations(response.data);
        } else if (response?.error) {
          setLocationsError(response.error.message);
        } else {
          setLocationsError("Error al cargar las ubicaciones");
        }
      } catch {
        setLocationsError("Error al cargar las ubicaciones");
      }
      setLoadingLocations(false);
    };
    fetchLocations();
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<QuoteFormInput, unknown, QuoteFormOutput>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      weight: 1,
      length: 10,
      width: 10,
      height: 10,
      originId: "",
      destinationId: "",
    },
  });

  const onSubmit = async (data: QuoteFormOutput) => {
    dispatch(quoteStart());
    try {
      const result = await post("/quotes", {
        weight: data.weight,
        dimensions: {
          length: data.length,
          width: data.width,
          height: data.height,
        },
        originId: Number(data.originId),
        destinationId: Number(data.destinationId),
      });

      if (result?.success && result.data) {
        dispatch(quoteSuccess(result.data));
      } else if (result?.error) {
        dispatch(quoteFailure(result.error.message));
      } else {
        dispatch(quoteFailure("Error al calcular la cotización"));
      }
    } catch (err) {
      dispatch(
        quoteFailure(err instanceof Error ? err.message : "Error desconocido")
      );
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <Calculate color="primary" /> Detalles del Paquete
        </Typography>

        {(error || locationsError) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || locationsError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="originId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Ciudad de Origen"
                    fullWidth
                    error={!!errors.originId}
                    helperText={errors.originId?.message}
                    disabled={loadingLocations}
                  >
                    {locations.map((location) => (
                      <MenuItem key={location.id} value={String(location.id)}>
                        {location.cityName}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="destinationId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Ciudad de Destino"
                    fullWidth
                    error={!!errors.destinationId}
                    helperText={errors.destinationId?.message}
                    disabled={loadingLocations}
                  >
                    {locations.map((location) => (
                      <MenuItem key={location.id} value={String(location.id)}>
                        {location.cityName}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Controller
                name="weight"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Peso (kg)"
                    type="number"
                    fullWidth
                    error={!!errors.weight}
                    helperText={errors.weight?.message}
                    inputProps={{ step: 0.1, min: 0.1 }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Controller
                name="length"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Largo (cm)"
                    type="number"
                    fullWidth
                    error={!!errors.length}
                    helperText={errors.length?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Controller
                name="width"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Ancho (cm)"
                    type="number"
                    fullWidth
                    error={!!errors.width}
                    helperText={errors.width?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Controller
                name="height"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Alto (cm)"
                    type="number"
                    fullWidth
                    error={!!errors.height}
                    helperText={errors.height?.message}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isLoading}
            sx={{
              mt: 3,
              background:
                "linear-gradient(135deg, hsl(215 90% 45%) 0%, hsl(195 80% 45%) 100%)",
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Calcular Cotización"
            )}
          </Button>
        </Box>
      </Paper>

      {currentQuote && (
        <Card
          sx={{
            border: "2px solid",
            borderColor: "primary.main",
            animation: "fade-in 0.3s ease-out",
          }}
        >
          <CardContent>
            <Typography variant="h6" color="primary" gutterBottom>
              Resultado de la Cotización
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <Typography color="text.secondary">Ruta</Typography>
                <Typography fontWeight="600">
                  {currentQuote.origin.cityName} →{" "}
                  {currentQuote.destination.cityName}
                </Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography color="text.secondary">Peso Real</Typography>
                <Typography fontWeight="600">
                  {currentQuote.actualWeight} kg
                </Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography color="text.secondary">Peso Volumétrico</Typography>
                <Typography fontWeight="600">
                  {currentQuote.volumetricWeight} kg
                </Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography color="text.secondary">Peso a Cobrar</Typography>
                <Typography fontWeight="600">
                  {currentQuote.chargeableWeight} kg
                </Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography color="text.secondary">Tarifa Base</Typography>
                <Typography fontWeight="600">
                  {formatCOP(currentQuote.rate.basePriceCents)}
                </Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography color="text.secondary">Tarifa por kg</Typography>
                <Typography fontWeight="600">
                  {formatCOP(currentQuote.rate.pricePerKgCents)}
                </Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography color="text.secondary">Precio Total</Typography>
                <Typography variant="h5" color="primary" fontWeight="bold">
                  {formatCOP(currentQuote.totalPriceCents)}
                </Typography>
              </Grid>
            </Grid>
            <Button
              variant="contained"
              startIcon={<LocalShipping />}
              onClick={() => navigate("/shipments/new")}
              sx={{
                mt: 3,
                background:
                  "linear-gradient(135deg, hsl(215 90% 45%) 0%, hsl(195 80% 45%) 100%)",
              }}
            >
              Crear Envío
            </Button>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default QuoteForm;
