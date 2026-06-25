import WebSocket from "ws";
import {
  type KnownWebSocketResponse,
  type WebSocketEvent,
  KnownWebSocketResponseSchema,
  WebSocketResponseSchema
} from "./websocket.type.ts";

export type WebSocketContent<TEvent extends WebSocketEvent> = Extract<KnownWebSocketResponse, { type: TEvent }>["content"];
export type HandlerType<TEvent extends WebSocketEvent> = (content: WebSocketContent<TEvent>) => void;
type WebSocketHandlers = {
  [TEvent in WebSocketEvent]: Array<HandlerType<TEvent>>;
};

const parseJson = (rawData: string): unknown | undefined => {
  try {
    return JSON.parse(rawData);
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const vrcWS = () => {
  const VRCHAT_AUTH = process.env.VRCHAT_AUTH;
  if (VRCHAT_AUTH === undefined) {
    throw "Please set a VRCHAT_AUTH"
  }

  const connection = new WebSocket(
    `wss://pipeline.vrchat.cloud/?authToken=${encodeURIComponent(VRCHAT_AUTH)}`,
    {
      headers: {
        "User-Agent": "vrchat-status-bot/1.0.0",
      },
    });
  const handlers: WebSocketHandlers = {
    "friend-online": [],
    "friend-offline": [],
  };

  connection.on("message", (e) => {
    const rawData = e.toString();
    const json = parseJson(rawData);
    if (json === undefined) return;

    const parsed = WebSocketResponseSchema.safeParse(json);
    if (!parsed.success) {
      console.error(parsed.error)
    } else {
      const knownParsed = KnownWebSocketResponseSchema.safeParse(parsed.data);
      if (!knownParsed.success) {
        console.log("other event: ", parsed.data.type)
        return;
      }

      const data = knownParsed.data;
      switch (data.type) {
        case "friend-online": {
          for (const x of handlers["friend-online"]) {
            x(data.content);
          }
          break;
        }
        case "friend-offline": {
          for (const x of handlers["friend-offline"]) {
            x(data.content);
          }
          break;
        }
      }
    }

  })

  return {
    addHandler: <TEvent extends WebSocketEvent>(
      event: TEvent,
      handler: (content: WebSocketContent<TEvent>) => void
    ) => {
      handlers[event].push(handler);
    },
    close: () => {
      connection.close()
    }
  }
}
