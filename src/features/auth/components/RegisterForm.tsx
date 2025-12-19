import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  Badge,
} from "@mui/icons-material";
import {
  Box,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import { useApi } from "@/hooks/useApi";
import type { RegisterRequestDto } from "@/features/auth/types/auth.types";
import type { ApiResponse } from "@/types/api";

const registerSchema = z
  .object({
    documentType: z
      .string()
      .min(2, "Tipo de documento debe tener al menos 2 caracteres")
      .max(20),
    document: z
      .string()
      .regex(/^[0-9]+$/, "El documento debe contener solo números")
      .min(5, "El documento debe tener al menos 5 caracteres")
      .max(50, "El documento debe tener máximo 50 caracteres"),
    names: z
      .string()
      .min(2, "Los nombres deben tener al menos 2 caracteres")
      .max(200),
    surnames: z
      .string()
      .min(2, "Los apellidos deben tener al menos 2 caracteres")
      .max(200),
    email: z
      .string()
      .email("Formato de correo inválido")
      .max(255, "El correo debe tener máximo 255 caracteres"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .max(100, "La contraseña debe tener máximo 100 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "La contraseña debe contener al menos una minúscula, una mayúscula y un número"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const DOCUMENT_TYPES = [
  { value: "CC", label: "Cédula de Ciudadanía" },
  { value: "CE", label: "Cédula de Extranjería" },
  { value: "TI", label: "Tarjeta de Identidad" },
  { value: "NIT", label: "NIT" },
  { value: "PAS", label: "Pasaporte" },
];

export const RegisterForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { post, loading, error: apiError } = useApi<ApiResponse>();
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const splitName = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/);
    const first = parts[0];
    const second = parts.slice(1).join(" ") || undefined;
    return { first, second };
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      documentType: "CC",
      document: "",
      names: "",
      surnames: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleRegister = async (data: RegisterFormData) => {
    setLocalError(null);
    setSuccessMessage(null);

    const { first: firstName, second: secondName } = splitName(data.names);
    const { first: firstSurname, second: secondSurname } = splitName(
      data.surnames
    );

    const request: RegisterRequestDto = {
      document: data.document,
      documentType: data.documentType,
      email: data.email,
      password: data.password,
      firstName,
      secondName,
      firstSurname,
      secondSurname,
    };

    const response = await post("/auth/register", request);

    if (response) {
      if (response.success) {
        setSuccessMessage(
          "Registro exitoso. Redirigiendo al inicio de sesión..."
        );
        reset();
        setTimeout(() => {
          onSuccess();
        }, 3000);
      } else if (response.error) {
        setLocalError(response.error.message);
      } else {
        setLocalError("Error inesperado en el registro.");
      }
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleRegister)}
      noValidate
      sx={{ mt: 2 }}
    >
      {(localError || apiError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {localError || apiError}
        </Alert>
      )}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <TextField
          select
          {...register("documentType")}
          label="Tipo"
          fullWidth
          margin="normal"
          error={!!errors.documentType}
          helperText={errors.documentType?.message}
          defaultValue="CC"
          sx={{ flex: 1 }}
        >
          {DOCUMENT_TYPES.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.value}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          {...register("document")}
          label="Documento"
          fullWidth
          margin="normal"
          error={!!errors.document}
          helperText={errors.document?.message}
          placeholder="No. de documento"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Badge color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 2 }}
        />
      </Box>

      <TextField
        {...register("names")}
        label="Nombres"
        fullWidth
        margin="normal"
        error={!!errors.names}
        helperText={errors.names?.message}
        placeholder="Ingrese sus nombres"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Person color="action" />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        {...register("surnames")}
        label="Apellidos"
        fullWidth
        margin="normal"
        error={!!errors.surnames}
        helperText={errors.surnames?.message}
        placeholder="Ingrese sus apellidos"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Person color="action" />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        {...register("email")}
        label="Correo Electronico"
        type="email"
        fullWidth
        margin="normal"
        error={!!errors.email}
        helperText={errors.email?.message}
        placeholder="Ingrese su correo electronico"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Email color="action" />
            </InputAdornment>
          ),
        }}
      />

      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <TextField
          {...register("password")}
          label="Contraseña"
          type={showPassword ? "text" : "password"}
          fullWidth
          margin="normal"
          error={!!errors.password}
          helperText={errors.password?.message}
          placeholder="Ingrese su contraseña"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1 }}
        />
        <TextField
          {...register("confirmPassword")}
          label="Confirmar Contraseña"
          type={showConfirmPassword ? "text" : "password"}
          fullWidth
          margin="normal"
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          placeholder="Confirme su contraseña"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1 }}
        />
      </Box>

      <Button
        type="submit"
        variant="contained"
        fullWidth
        size="large"
        disabled={loading}
        sx={{
          mt: 3,
          mb: 2,
          py: 1.5,
          background:
            "linear-gradient(135deg, hsl(215 90% 45%) 0%, hsl(195 80% 45%) 100%)",
          "&:hover": {
            background:
              "linear-gradient(135deg, hsl(215 90% 40%) 0%, hsl(195 80% 40%) 100%)",
          },
        }}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Crear Cuenta"
        )}
      </Button>
    </Box>
  );
};
