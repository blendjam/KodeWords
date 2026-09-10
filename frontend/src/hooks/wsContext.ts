import { ClientMessage } from "@kodewords/shared/messages";
import { Room } from "@kodewords/shared/types";
import { createContext, useContext } from "react";

type WsContextProps = {
  ws: WebSocket | null;
  send: (message: ClientMessage) => void;
  room: Room | null;
};

export const WsContext = createContext<WsContextProps>({
  ws: null,
  send: () => {},
  room: null,
});

export function useWs() {
  return useContext(WsContext);
}
