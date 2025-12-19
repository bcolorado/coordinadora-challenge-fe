import { useState } from "react";
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Box,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useApi } from "@/hooks/useApi";
import type {
  LoginRequestDto,
  LoginResponseDto,
} from "@/features/auth/types/auth.types";
import type { ApiResponse } from "@/types/api";

const loginSchema = z.object({
  email: z.string().email("Por favor ingresa un correo electronico valido"),
  password: z.string().min(6, "Por favor ingresa una contrasena valida"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [localError, setLocalError] = useState<string | null>(null);
  const { post, loading, error: apiError } = useApi();

  const handleLogin = async (data: LoginFormData) => {
    setLocalError(null);
    const request: LoginRequestDto = {
      email: data.email,
      password: data.password,
    };

    const response: ApiResponse<LoginResponseDto> | null = await post(
      "/auth/login",
      request
    );

    if (response) {
      if (response.success && response.data) {
        localStorage.setItem("auth", "true");
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/dashboard");
      } else if (response.error) {
        setLocalError(response.error.message);
      } else {
        setLocalError("Error inesperado en el inicio de sesion.");
      }
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleLogin)}
      noValidate
      sx={{ mt: 2 }}
    >
      {(localError || apiError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {localError || apiError}
        </Alert>
      )}

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
        disabled={loading}
      />

      <TextField
        {...register("password")}
        label="Contrasena"
        type={showPassword ? "text" : "password"}
        fullWidth
        margin="normal"
        error={!!errors.password}
        helperText={errors.password?.message}
        placeholder="Ingrese su contrasena"
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
        disabled={loading}
      />

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
          "Iniciar sesión"
        )}
      </Button>
    </Box>
  );
};

export default LoginForm;
