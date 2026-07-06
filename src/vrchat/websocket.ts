import EventEmitter from "node:events";
import type TypedEmitter from "typed-emitter";
import WebSocket from "ws";
import {
  type RawVRChatWebSocketEvent,
  RawVRChatWebSocketEventSchema,
  type VRChatWebSocketEvent,
  VRChatWebSocketEventSchema,
} from "./websocket.type.ts";

type VRChatWebSocketClientEvents = {
  error: (error: unknown) => void;
  raw: (event: RawVRChatWebSocketEvent) => void;
  unhandled: (event: RawVRChatWebSocketEvent) => void;
} & {
  [T in VRChatWebSocketEvent["type"]]: (
    data: Extract<VRChatWebSocketEvent, { type: T }>["content"],
  ) => void;
};

type CreateVRChatWebSocketClientOptions = {
  authToken: string;
  userAgent: string;
};

class VRChatPipelineWebSocket extends WebSocket {
  static captureRejections = true;
}

export const createVRChatWebSocketClient = ({
  authToken,
  userAgent,
}: CreateVRChatWebSocketClientOptions) => {
  const connection = new VRChatPipelineWebSocket(
    `wss://pipeline.vrchat.cloud/?authToken=${encodeURIComponent(authToken)}`,
    {
      headers: {
        "User-Agent": userAgent,
      },
    },
  );

  const client = new EventEmitter({
    captureRejections: true,
  }) as TypedEmitter<VRChatWebSocketClientEvents>;

  connection.on("error", (error) => {
    client.emit("error", error);
  });

  connection.on("message", async (e) => {
    const json = JSON.parse(e.toString());
    const rawEvent = RawVRChatWebSocketEventSchema.parse(json);
    client.emit("raw", rawEvent);

    const event = VRChatWebSocketEventSchema.safeParse(rawEvent);
    if (event.success) {
      client.emit(event.data.type, event.data.content);
    } else {
      client.emit("unhandled", rawEvent);
    }
  });

  return Object.assign(client, {
    close: () => connection.close(),
  });
};
