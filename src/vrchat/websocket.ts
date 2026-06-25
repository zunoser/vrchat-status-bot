import WebSocket from "ws";
import { type WebSocketResponse, WebSocketResponseSchema } from "./websocket.type";

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
  let handlers: Record<string, Array<(content: any) => void>> = {};

  connection.on("message", (e) => {
    const rawData = e.toString();
    const parsed = WebSocketResponseSchema.safeParse(rawData);
    if (!parsed.success) {
      console.error(parsed.error)
    } else {
      const data = parsed.data;
      switch (data.type) {
        case "friend-online": {
          for (const x of handlers["friend-online"]) {
            x(data.content);
          }
        }
        case "friend-offline": {
          for (const x of handlers["friend-online"]) {
            x(data.content);
          }
        }
      }
    }

  })

  return {
    addHandler: (event: string, handler: (content: string) => void) => {
      handlers[event].push(handler);
    }
  }
}
