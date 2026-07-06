import { createVRChatWebSocketClient } from "@vrchat-status-bot/vrchat";
import { WebhookClient } from "discord.js";
import { z } from "zod";

const EnvSchema = z.object({
  DISCORD_URL: z.url(),
  VRCHAT_AUTH: z.string(),

  FRIEND_USER_ID: z.string(),
  ONLINE_MESSAGE: z.string().default("A friend has come online!"),
  OFFLINE_MESSAGE: z.string().default("A friend has gone offline!"),
});
const env = EnvSchema.parse(process.env);

const webhookClient = new WebhookClient({ url: env.DISCORD_URL });

const vrchatClient = createVRChatWebSocketClient({
  authToken: env.VRCHAT_AUTH,
  userAgent: "zunoser/vrchat-status-bot/1.0.0",
});

vrchatClient.on("friend-online", (data) => {
  if (data.userId === env.FRIEND_USER_ID) {
    webhookClient.send({
      content: env.ONLINE_MESSAGE,
    });
  }
});

vrchatClient.on("friend-offline", (data) => {
  if (data.userId === env.FRIEND_USER_ID) {
    webhookClient.send({
      content: env.OFFLINE_MESSAGE,
    });
  }
});

vrchatClient.on("error", (error) => {
  console.error(error);
});
