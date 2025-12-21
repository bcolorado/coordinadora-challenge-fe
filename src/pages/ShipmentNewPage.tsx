import { Box, Typography } from "@mui/material";
import { LocalShipping } from "@mui/icons-material";
import { ShipmentConfirmation } from "@/features/shipments/components/ShipmentConfirmation";

export const ShipmentNewPage = () => {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <LocalShipping color="primary" /> Crear Envío
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Confirma los detalles de tu envío para registrarlo
        </Typography>
      </Box>
      <ShipmentConfirmation />
    </Box>
  );
};

export default ShipmentNewPage;
