import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "@/test/test-utils";
import { LoginForm } from "./LoginForm";

// Mock useApi hook
const mockPost = jest.fn();
jest.mock("@/hooks/useApi", () => ({
  useApi: () => ({
    post: mockPost,
    loading: false,
    error: null,
  }),
}));

// Mock react-router navigate
const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

describe("LoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe("Rendering", () => {
    it("renders email and password fields", () => {
      render(<LoginForm />);

      expect(screen.getByLabelText(/correo electronico/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/contrasena/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /iniciar/i })
      ).toBeInTheDocument();
    });
  });

  describe("Validation", () => {
    it("shows error for invalid email format", async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      await user.type(screen.getByLabelText(/correo electronico/i), "invalid");
      await user.type(screen.getByLabelText(/contrasena/i), "password123");
      await user.click(screen.getByRole("button", { name: /iniciar/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/por favor ingresa un correo electronico valido/i)
        ).toBeInTheDocument();
      });
    });

    it("shows error for short password", async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      await user.type(
        screen.getByLabelText(/correo electronico/i),
        "test@test.com"
      );
      await user.type(screen.getByLabelText(/contrasena/i), "12345");
      await user.click(screen.getByRole("button", { name: /iniciar/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/por favor ingresa una contrasena valida/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe("Login Flow", () => {
    it("stores token and navigates on successful login", async () => {
      const user = userEvent.setup();
      mockPost.mockResolvedValueOnce({
        success: true,
        data: {
          token: "test-token",
          user: { id: 1, email: "test@test.com", fullName: "Test User" },
        },
      });

      render(<LoginForm />);

      await user.type(
        screen.getByLabelText(/correo electronico/i),
        "test@test.com"
      );
      await user.type(screen.getByLabelText(/contrasena/i), "password123");
      await user.click(screen.getByRole("button", { name: /iniciar/i }));

      await waitFor(() => {
        expect(localStorage.getItem("token")).toBe("test-token");
        expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
      });
    });

    it("displays error message on failed login", async () => {
      const user = userEvent.setup();
      mockPost.mockResolvedValueOnce({
        success: false,
        error: { message: "Credenciales incorrectas" },
      });

      render(<LoginForm />);

      await user.type(
        screen.getByLabelText(/correo electronico/i),
        "test@test.com"
      );
      await user.type(screen.getByLabelText(/contrasena/i), "wrongpassword");
      await user.click(screen.getByRole("button", { name: /iniciar/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/credenciales incorrectas/i)
        ).toBeInTheDocument();
      });
    });
  });
});
