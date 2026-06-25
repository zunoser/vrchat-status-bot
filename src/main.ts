import { vrcWS, type WebSocketContent, type HandlerType } from "./vrchat/websocket.ts";

const logger: HandlerType<"friend-online"> = (content) => {
  console.log(content);
};
const vrcws = vrcWS();
vrcws.addHandler("friend-online", logger);

