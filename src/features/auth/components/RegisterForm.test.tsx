import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "@/test/test-utils";
import { RegisterForm } from "./RegisterForm";

// Mock useApi hook
const mockPost = jest.fn();
jest.mock("@/hooks/useApi", () => ({
  useApi: () => ({
    post: mockPost,
    loading: false,
    error: null,
  }),
}));

describe("RegisterForm", () => {
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders all required fields", () => {
      render(<RegisterForm onSuccess={mockOnSuccess} />);

      expect(screen.getByLabelText(/tipo/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/documento/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/nombres/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/apellidos/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/correo electronico/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /crear cuenta/i })
      ).toBeInTheDocument();
    });
  });

  describe("Validation", () => {
    it("shows error when passwords do not match", async () => {
      const user = userEvent.setup();
      render(<RegisterForm onSuccess={mockOnSuccess} />);

      await user.type(screen.getByLabelText(/documento/i), "12345678");
      await user.type(screen.getByLabelText(/nombres/i), "Juan");
      await user.type(screen.getByLabelText(/apellidos/i), "Perez");
      await user.type(
        screen.getByLabelText(/correo electronico/i),
        "juan@test.com"
      );
      // Get password fields by placeholder
      const passwordFields = screen.getAllByPlaceholderText(/contrase/i);
      await user.type(passwordFields[0], "Password1");
      await user.type(passwordFields[1], "DifferentPass1");
      await user.click(screen.getByRole("button", { name: /crear cuenta/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/las contrase.*no coinciden/i)
        ).toBeInTheDocument();
      });
    });

    it("shows error for weak password", async () => {
      const user = userEvent.setup();
      render(<RegisterForm onSuccess={mockOnSuccess} />);

      await user.type(screen.getByLabelText(/documento/i), "12345678");
      await user.type(screen.getByLabelText(/nombres/i), "Juan");
      await user.type(screen.getByLabelText(/apellidos/i), "Perez");
      await user.type(
        screen.getByLabelText(/correo electronico/i),
        "juan@test.com"
      );
      const passwordFields = screen.getAllByPlaceholderText(/contrase/i);
      await user.type(passwordFields[0], "weakpass");
      await user.type(passwordFields[1], "weakpass");
      await user.click(screen.getByRole("button", { name: /crear cuenta/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/debe contener al menos una min/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe("Register Flow", () => {
    it("displays success message on successful registration", async () => {
      const user = userEvent.setup();
      mockPost.mockResolvedValueOnce({
        success: true,
        data: { id: 1, email: "juan@test.com" },
      });

      render(<RegisterForm onSuccess={mockOnSuccess} />);

      await user.type(screen.getByLabelText(/documento/i), "12345678");
      await user.type(screen.getByLabelText(/nombres/i), "Juan");
      await user.type(screen.getByLabelText(/apellidos/i), "Perez");
      await user.type(
        screen.getByLabelText(/correo electronico/i),
        "juan@test.com"
      );
      const passwordFields = screen.getAllByPlaceholderText(/contrase/i);
      await user.type(passwordFields[0], "Password1");
      await user.type(passwordFields[1], "Password1");
      await user.click(screen.getByRole("button", { name: /crear cuenta/i }));

      await waitFor(() => {
        expect(screen.getByText(/registro exitoso/i)).toBeInTheDocument();
      });
    });

    it("displays error message on failed registration", async () => {
      const user = userEvent.setup();
      mockPost.mockResolvedValueOnce({
        success: false,
        error: { message: "El correo ya existe" },
      });

      render(<RegisterForm onSuccess={mockOnSuccess} />);

      await user.type(screen.getByLabelText(/documento/i), "12345678");
      await user.type(screen.getByLabelText(/nombres/i), "Juan");
      await user.type(screen.getByLabelText(/apellidos/i), "Perez");
      await user.type(
        screen.getByLabelText(/correo electronico/i),
        "existing@test.com"
      );
      const passwordFields = screen.getAllByPlaceholderText(/contrase/i);
      await user.type(passwordFields[0], "Password1");
      await user.type(passwordFields[1], "Password1");
      await user.click(screen.getByRole("button", { name: /crear cuenta/i }));

      await waitFor(() => {
        expect(screen.getByText(/el correo ya existe/i)).toBeInTheDocument();
      });
    });
  });
});
