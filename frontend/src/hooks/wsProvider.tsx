import React, { useCallback, useEffect, useRef, useState } from "react";
import { WsContext } from "./wsContext";
import { WS_SERVER_ADDRESS } from "../utils/constants";
import type { ClientMessage, ServerMessage } from "@kodewords/shared/messages";
import { Room, SerializedRoom } from "@kodewords/shared/types";
import { deserializeRoom } from "@kodewords/shared/room";

const ConnectionStatus = {
  CONNECTED: "CONNECTED",
  DISCONNECTED: "DISCONNECTED",
  CONNECTING: "CONNECTING",
};
export type ConnectionStatus = (typeof ConnectionStatus)[keyof typeof ConnectionStatus];

export function WsProvider({ children }: { children: React.ReactNode }) {
  const ws = useRef<WebSocket | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  // const counterRef = useRef<number>(0);
  const [connectionStatus, setConnectionStatus] = useState(ConnectionStatus.DISCONNECTED);

  const handleOnMessage = (data: ServerMessage) => {
    if (!data.type) return;

    switch (data.type) {
      case "room_state":
        const room = deserializeRoom(data.payload as SerializedRoom);
        setRoom(room);
        break;
      default: {
      }
    }
  };

  const connect = useCallback(() => {
    if (ws.current) {
      console.log("Socket already exists: ", ws.current);
      return;
    }
    console.log("Connecting to websocket");
    try {
      setConnectionStatus(ConnectionStatus.CONNECTING);
      const socket = new WebSocket(WS_SERVER_ADDRESS);
      if (!socket) return;
      socket.onopen = () => {
        setConnectionStatus(ConnectionStatus.CONNECTED);
        console.log("WS: Connected");
        // counterRef.current += 1;
      };

      socket.onclose = () => {
        setConnectionStatus(ConnectionStatus.DISCONNECTED);
        console.log("WS: disconnected");
      };

      socket.onerror = () => {
        console.log("Websocket Error");
      };

      socket.onmessage = event => {
        const data = JSON.parse(event.data) as ServerMessage;
        handleOnMessage(data);
        // counterRef.current += 1;
      };
      ws.current = socket;
    } catch (err: any) {
      console.log("Failed during ws connection: ", err?.message);
      ws.current = null;
      setConnectionStatus(ConnectionStatus.DISCONNECTED);
    }
  }, []);

  const send = (message: ClientMessage) => {
    if (ws.current && ws.current?.readyState === WebSocket.OPEN) {
      ws.current?.send(JSON.stringify(message));
    }
  };
  useEffect(() => {
    connect();

    return () => {
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
    };
  }, [connect]);
  return (
    <WsContext.Provider value={{ ws: ws.current!, send: send, room: room }}>
      {children}
    </WsContext.Provider>
  );
}
