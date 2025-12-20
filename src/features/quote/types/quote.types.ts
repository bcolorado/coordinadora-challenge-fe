export interface LocationResponseDto {
  id: number;
  cityName: string;
}

export interface QuoteRequestDto {
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  originId: number;
  destinationId: number;
}

export interface QuoteResponseDto {
  origin: {
    id: number;
    cityName: string;
  };
  destination: {
    id: number;
    cityName: string;
  };
  actualWeight: number;
  volumetricWeight: number;
  chargeableWeight: number;
  rate: {
    id: number;
    basePriceCents: number;
    pricePerKgCents: number;
  };
  totalPriceCents: number;
}
