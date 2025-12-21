import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import type { StatusUpdateEvent } from "../types/tracking.types";

const SOCKET_URL =
  import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:4000";

export const useShipmentSocket = (
  shipmentId: number | null,
  onStatusUpdate: (data: StatusUpdateEvent) => void
) => {
  const socketRef = useRef<Socket | null>(null);

  const connect = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    socketRef.current = io(SOCKET_URL, {
      auth: { token },
    });

    socketRef.current.on("connect", () => {
      console.log("WebSocket connected");
    });

    socketRef.current.on("connect_error", (error) => {
      console.error("WebSocket connection failed:", error.message);
    });

    socketRef.current.on("status_updated", (data: StatusUpdateEvent) => {
      onStatusUpdate(data);
    });
  }, [onStatusUpdate]);

  const joinShipment = useCallback((id: number) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("join_shipment", { shipmentId: id });
    }
  }, []);

  const leaveShipment = useCallback((id: number) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("leave_shipment", { shipmentId: id });
    }
  }, []);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  useEffect(() => {
    if (shipmentId && socketRef.current?.connected) {
      joinShipment(shipmentId);
    }

    return () => {
      if (shipmentId) {
        leaveShipment(shipmentId);
      }
    };
  }, [shipmentId, joinShipment, leaveShipment]);

  return {
    isConnected: socketRef.current?.connected ?? false,
    joinShipment,
    leaveShipment,
  };
};
