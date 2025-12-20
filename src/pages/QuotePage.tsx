import { Box, Typography } from "@mui/material";
import { Calculate } from "@mui/icons-material";
import { QuoteForm } from "@/features/quote/components/QuoteForm";

export const QuotePage = () => {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <Calculate color="primary" /> Cotizar Envío
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Calcula el costo de tu envío ingresando los detalles del paquete
        </Typography>
      </Box>
      <QuoteForm />
    </Box>
  );
};

export default QuotePage;
