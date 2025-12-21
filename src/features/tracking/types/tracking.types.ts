export interface StatusHistoryItem {
  status: string;
  occurredAt: string;
  note: string | null;
}

export interface LocationInfo {
  id: number;
  cityName: string;
}

export interface ShipmentTrackingDto {
  id: number;
  trackingNumber: string;
  currentStatus: string;
  origin: LocationInfo;
  destination: LocationInfo;
  actualWeightKg: number;
  chargeableWeightKg: number;
  quotedPriceCents: number;
  history: StatusHistoryItem[];
}

export interface StatusUpdateEvent {
  shipmentId: number;
  status: string;
  occurredAt: string;
  note: string | null;
}
