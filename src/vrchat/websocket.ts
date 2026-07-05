import EventEmitter from "node:events";
import type TypedEmitter from "typed-emitter";
import WebSocket from "ws";
import {
  type RawWebSocketResponse,
  RawWebSocketResponseSchema,
  type WebSocketResponse,
  WebSocketResponseSchema,
} from "./websocket.type.ts";

type EmitterEvents = {
  raw: (data: RawWebSocketResponse) => void;
} & {
  [T in WebSocketResponse["type"]]: (
    data: Extract<WebSocketResponse, { type: T }>["content"],
  ) => void;
};

type VrcWSParams = {
  authToken: string;
  userAgent: string;
};

export const vrcWS = ({ authToken, userAgent }: VrcWSParams) => {
  const connection = new WebSocket(
    `wss://pipeline.vrchat.cloud/?authToken=${encodeURIComponent(authToken)}`,
    {
      headers: {
        "User-Agent": userAgent,
      },
    },
  );

  const client = new EventEmitter({
    captureRejections: true,
  }) as TypedEmitter<EmitterEvents>;

  connection.on("message", (e) => {
    const json = JSON.parse(e.toString());
    const raw = RawWebSocketResponseSchema.parse(json);
    client.emit("raw", raw);

    const data = WebSocketResponseSchema.safeParse(raw);
    if (data.success) {
      client.emit(data.data.type, data.data.content);
    }
  });

  return {
    client: client,
    close: () => connection.close(),
  };
};
