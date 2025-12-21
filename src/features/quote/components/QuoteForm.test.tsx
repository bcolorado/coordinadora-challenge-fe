import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "@/test/test-utils";
import { QuoteForm } from "./QuoteForm";

// Mock useApi hook
const mockPost = jest.fn();
const mockGet = jest.fn();
jest.mock("@/hooks/useApi", () => ({
  useApi: () => ({
    post: mockPost,
    get: mockGet,
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

describe("QuoteForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGet.mockResolvedValue({
      success: true,
      data: [
        { id: 1, cityName: "Bogotá" },
        { id: 2, cityName: "Medellín" },
      ],
    });
  });

  describe("Rendering", () => {
    it("renders all form fields", async () => {
      render(<QuoteForm />);

      await waitFor(() => {
        expect(screen.getByLabelText(/peso/i)).toBeInTheDocument();
      });

      expect(screen.getByLabelText(/largo/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/ancho/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/alto/i)).toBeInTheDocument();
    });

    it("fetches locations on mount", async () => {
      render(<QuoteForm />);

      await waitFor(() => {
        expect(mockGet).toHaveBeenCalledWith("/locations");
      });
    });

    it("shows error when locations fail to load", async () => {
      mockGet.mockResolvedValueOnce({
        success: false,
        error: { message: "Error al cargar ubicaciones" },
      });

      render(<QuoteForm />);

      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
      });
    });
  });

  describe("Validation", () => {
    it("shows validation error for invalid weight", async () => {
      const user = userEvent.setup();
      render(<QuoteForm />);

      await waitFor(() => {
        expect(screen.getByLabelText(/peso/i)).toBeInTheDocument();
      });

      const weightInput = screen.getByLabelText(/peso/i);
      await user.clear(weightInput);
      await user.type(weightInput, "0");
      await user.click(
        screen.getByRole("button", { name: /calcular cotización/i })
      );

      await waitFor(() => {
        expect(screen.getByText(/peso debe ser al menos/i)).toBeInTheDocument();
      });
    });
  });
});
