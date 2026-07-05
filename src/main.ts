import { z } from "zod";
import { createVRChatWebSocketClient } from "./vrchat/websocket.ts";

const EnvSchema = z.object({
  VRCHAT_AUTH: z.string(),
});
const env = EnvSchema.parse(process.env);

const vrchatClient = createVRChatWebSocketClient({
  authToken: env.VRCHAT_AUTH,
  userAgent: "zunoser/vrchat-status-bot/1.0.0",
});

vrchatClient.on("error", (error) => {
  console.error(error);
});

vrchatClient.on("friend-online", (content) => {
  if (!content.user) {
    return;
  }
  console.log(`Online: ${content.user.displayName}`);
});

vrchatClient.on("friend-offline", (content) => {
  console.log(`Offline: ${content.userId}`);
});

vrchatClient.on("unhandled", (event) => {
  console.warn(`Unhandled event: ${event.type}`);
});
