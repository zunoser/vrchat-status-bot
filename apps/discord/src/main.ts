import { createVRChatWebSocketClient } from "@vrchat-status-bot/vrchat";
import { Client, Events, GatewayIntentBits,WebhookClient } from "discord.js";
import { z } from "zod";

const EnvSchema = z.object({
  DISCORD_URL: z.url(),
  VRCHAT_AUTH: z.string(),
});
const env = EnvSchema.parse(process.env);

const webhookClient = new WebhookClient({ url: env.DISCORD_URL }); 

const vrchatClient = createVRChatWebSocketClient({
  authToken: env.VRCHAT_AUTH,
  userAgent: "zunoser/vrchat-status-bot/1.0.0",
});
  

vrchatClient.on("friend-online",() => {

});















