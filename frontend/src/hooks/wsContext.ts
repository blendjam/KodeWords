import { ClientMessage } from "@kodewords/shared/messages";
import { createContext, useContext } from "react";

type WsContextProps = {
  ws: WebSocket;
  send: (message: ClientMessage) => void;
};

export const WsContext = createContext<WsContextProps | null>(null);

export function useWs(): WsContextProps {
  const context = useContext(WsContext);

  if (!context) {
    throw new Error("useWs must be used within a WsProvider");
  }

  return context;
}
