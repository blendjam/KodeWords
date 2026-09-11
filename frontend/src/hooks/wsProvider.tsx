import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { WsContext } from "./wsContext";
import { WS_SERVER_ADDRESS } from "../utils/constants";
import type { ClientMessagePayload, ServerMessage } from "@kodewords/shared/messages";
import { ConnectionStatus, SerializedRoom } from "@kodewords/shared/types";
import { deserializeRoom } from "@kodewords/shared/room";
import { useRoomState } from "../state/roomState";
import { getUserId } from "../utils/login";

export type ConnectionStatus = (typeof ConnectionStatus)[keyof typeof ConnectionStatus];

export function WsProvider({ children, onStart }: { children: React.ReactNode; onStart: () => void }) {
  const ws = useRef<WebSocket | null>(null);
  const { setRoom } = useRoomState();
  const userId = useMemo(() => getUserId(), []);
  // const counterRef = useRef<number>(0);
  const [connectionStatus, setConnectionStatus] = useState(ConnectionStatus.DISCONNECTED);

  const handleOnMessage = useCallback(
    (data: ServerMessage) => {
      if (!data.type) return;

      switch (data.type) {
        case "room_state": {
          const room = deserializeRoom(data.payload as SerializedRoom);
          console.log("Room State: ", room);
          setRoom(room);
          break;
        }
        default: {
          console.log("hello");
        }
      }
    },
    [setRoom],
  );

  const send = useCallback(
    (message: ClientMessagePayload) => {
      if (ws.current && ws.current?.readyState === WebSocket.OPEN) {
        ws.current?.send(
          JSON.stringify({
            ...message,
            userId,
          }),
        );
      }
    },
    [userId],
  );

  const connect = useCallback(() => {
    if (ws.current) {
      console.log("Socket already exists: ", ws.current);
      return;
    }
    try {
      setConnectionStatus(ConnectionStatus.CONNECTING);
      const socket = new WebSocket(WS_SERVER_ADDRESS);
      if (!socket) return;
      socket.onopen = () => {
        setConnectionStatus(ConnectionStatus.CONNECTED);
        send({ type: "login" });
        console.log("WS: Connected");
        onStart();
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
        console.log("GOT MESSAGE");
        handleOnMessage(data);
        // counterRef.current += 1;
      };
      ws.current = socket;
    } catch (err) {
      console.log("Failed during ws connection: ", String(err));
      ws.current = null;
      setConnectionStatus(ConnectionStatus.DISCONNECTED);
    }
  }, [handleOnMessage, onStart, send]);
  useEffect(() => {
    if (connectionStatus == ConnectionStatus.DISCONNECTED) {
      connect();
    }

    return () => {
      if (ws.current && connectionStatus == ConnectionStatus.CONNECTED) {
        ws.current.close();
        ws.current = null;
      }
    };
  }, [connect, connectionStatus]);
  return (
    <WsContext.Provider
      value={{
        ws: ws.current!,
        send,
        connectionStatus,
      }}>
      {children}
    </WsContext.Provider>
  );
}
