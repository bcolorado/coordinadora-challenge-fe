import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "@/test/test-utils";
import { ShipmentsList } from "./ShipmentsList";

// Mock useApi hook
const mockGet = jest.fn();
jest.mock("@/hooks/useApi", () => ({
  useApi: () => ({
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

const mockShipment = {
  id: 1,
  trackingNumber: "COORD-12345-ABCDE",
  status: "EN_ESPERA",
  chargeableWeightKg: 5,
  quotedPriceCents: 25000,
  createdAt: "2025-12-21T10:00:00Z",
};

describe("ShipmentsList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows empty state when no shipments", async () => {
    mockGet.mockResolvedValueOnce({ success: true, data: [] });

    render(<ShipmentsList />);

    await waitFor(() => {
      expect(screen.getByText(/no tienes envíos/i)).toBeInTheDocument();
    });
  });

  it("displays shipment data correctly", async () => {
    mockGet.mockResolvedValueOnce({ success: true, data: [mockShipment] });

    render(<ShipmentsList />);

    await waitFor(() => {
      expect(screen.getByText("COORD-12345-ABCDE")).toBeInTheDocument();
      expect(screen.getByText("En Espera")).toBeInTheDocument();
      expect(screen.getByText(/5.*kg/)).toBeInTheDocument();
    });
  });

  it("navigates to tracking on view click", async () => {
    const user = userEvent.setup();
    mockGet.mockResolvedValueOnce({ success: true, data: [mockShipment] });

    render(<ShipmentsList />);

    await waitFor(() => {
      expect(screen.getByText("COORD-12345-ABCDE")).toBeInTheDocument();
    });

    await user.click(screen.getByTitle(/ver detalles/i));

    expect(mockNavigate).toHaveBeenCalledWith("/tracking/COORD-12345-ABCDE");
  });

  it("shows error on API failure", async () => {
    mockGet.mockResolvedValueOnce({
      success: false,
      error: { message: "Error de conexión" },
    });

    render(<ShipmentsList />);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });
});
