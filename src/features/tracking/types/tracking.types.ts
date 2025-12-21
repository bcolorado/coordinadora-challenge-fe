export interface StatusHistoryItem {
  status: string;
  occurredAt: string;
  note: string | null;
}

export interface ShipmentTrackingDto {
  id: number;
  trackingNumber: string;
  currentStatus: string;
  history: StatusHistoryItem[];
}

export interface StatusUpdateEvent {
  shipmentId: number;
  status: string;
  occurredAt: string;
  note: string | null;
}
