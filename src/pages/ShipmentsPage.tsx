import { Box, Typography, Button } from "@mui/material";
import { LocalShipping, Add } from "@mui/icons-material";
import { useNavigate } from "react-router";
import { ShipmentsList } from "@/features/shipments/components/ShipmentsList";

export const ShipmentsPage = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <LocalShipping color="primary" /> Mis Envíos
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Historial de todos tus envíos
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
      <ShipmentsList />
    </Box>
  );
};

export default ShipmentsPage;
