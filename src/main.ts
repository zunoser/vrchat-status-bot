import { vrcWS, type WebSocketContent, type HandlerType } from "./vrchat/websocket.ts";

const logger: HandlerType<"friend-online"> = (content) => {
  if (!content.user){
    return
  }
  console.log(`Online: ${content.user.displayName}`);
};

const loggers: HandlerType<"friend-offline"> = (content) => {
  console.log(`Offline: ${content.userId}`);
};
const vrcws = vrcWS();
vrcws.addHandler("friend-online", logger);
vrcws.addHandler("friend-offline", loggers);

