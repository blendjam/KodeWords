import { ClientMessagePayload } from "@kodewords/shared/messages";
import { createContext, useContext } from "react";
import { ConnectionStatus } from "./wsProvider";

type WsContextProps = {
  ws: WebSocket;
  send: (message: ClientMessagePayload) => void;
  connectionStatus: ConnectionStatus;
};

export const WsContext = createContext<WsContextProps | null>(null);

export function useWs(): WsContextProps {
  const context = useContext(WsContext);

  if (!context) {
    throw new Error("useWs must be used within a WsProvider");
  }

  return context;
}
