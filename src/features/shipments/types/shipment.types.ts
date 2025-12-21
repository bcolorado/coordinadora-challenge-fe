export interface ShipmentResponseDto {
  id: number;
  trackingNumber: string;
  status: string;
  origin: {
    id: number;
    cityName: string;
  };
  destination: {
    id: number;
    cityName: string;
  };
  quotedPriceCents: number;
  createdAt: string;
}

export interface UserShipmentDto {
  id: number;
  trackingNumber: string;
  status: string;
  chargeableWeightKg: number;
  quotedPriceCents: number;
  createdAt: string;
}
