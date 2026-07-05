import { vrcWS } from "./vrchat/websocket.ts";

const authToken = process.env.VRCHAT_AUTH;
const vrcWs = vrcWS({
  authToken: authToken || "",
  userAgent: "vrchat-status-bot/1.0.0",
});

vrcWs.client.on("friend-online", (content) => {
  if (!content.user) {
    return;
  }
  console.log(`Online: ${content.user.displayName}`);
});

vrcWs.client.on("friend-offline", (content) => {
  console.log(`Offline: ${content.userId}`);
});
