import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { WsContext } from "./wsContext";
import { WS_SERVER_ADDRESS } from "../utils/constants";
import type { ClientMessagePayload, ServerMessage } from "@kodewords/shared/messages";
import { ConnectionStatus, SerializedRoom } from "@kodewords/shared/types";
import { deserializeRoom } from "@kodewords/shared/room";
import { useRoomState } from "../state/roomState";
import { getUserId } from "../utils/login";

export type ConnectionStatus = (typeof ConnectionStatus)[keyof typeof ConnectionStatus];

const INITIAL_RETRY_DELAY = 1000;
const MAX_RETRY_DELAY = 1000;

export function WsProvider({ children, onStart }: { children: React.ReactNode; onStart: () => void }) {
  const ws = useRef<WebSocket | null>(null);
  const retryTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryDelay = useRef(INITIAL_RETRY_DELAY);

  const { setRoom } = useRoomState();
  const userId = useMemo(() => getUserId(), []);

  const [connectionStatus, setConnectionStatus] = useState(ConnectionStatus.DISCONNECTED);

  const handleOnMessage = useCallback(
    (data: ServerMessage) => {
      if (!data.type) return;

      switch (data.type) {
        case "room_state": {
          const room = deserializeRoom(data.payload as SerializedRoom);
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
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(
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
    if (ws.current && (ws.current.readyState === WebSocket.OPEN || ws.current.readyState === WebSocket.CONNECTING)) {
      console.log("Socket already exists: ", ws.current);
      return;
    }

    if (retryTimeout.current) {
      clearTimeout(retryTimeout.current);
      retryTimeout.current = null;
    }
    try {
      console.log("WS: Connecting...");
      setConnectionStatus(ConnectionStatus.CONNECTING);
      const socket = new WebSocket(WS_SERVER_ADDRESS);

      socket.onopen = () => {
        console.log("WS: Connected");
        setConnectionStatus(ConnectionStatus.CONNECTED);
        send({ type: "login" });
        onStart();
      };

      socket.onmessage = event => {
        const data = JSON.parse(event.data) as ServerMessage;
        handleOnMessage(data);
      };

      socket.onerror = err => {
        console.log("WS: Error", err);
      };

      socket.onclose = () => {
        console.log("WS: disconnected");
        if (ws.current === socket) {
          ws.current = null;
        }
        setConnectionStatus(ConnectionStatus.DISCONNECTED);
        const delay = retryDelay.current;

        console.log(`WS: Retrying in ${delay}ms...`);
        retryTimeout.current = setTimeout(() => {
          retryTimeout.current = null;
          connect();

          // Exponential backoff
          retryDelay.current = Math.min(retryDelay.current * 2, MAX_RETRY_DELAY);
        }, delay);
      };
      ws.current = socket;
    } catch (err) {
      console.log("WS: Failed during connection", String(err));
      ws.current = null;
      setConnectionStatus(ConnectionStatus.DISCONNECTED);
    }
  }, [handleOnMessage, onStart, send]);
  useEffect(() => {
    connect();

    return () => {
      // Cancel Retry
      if (retryTimeout.current) {
        clearTimeout(retryTimeout.current);
        retryTimeout.current = null;
      }
      // Clear Socket
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
    };
  }, [connect]);

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
