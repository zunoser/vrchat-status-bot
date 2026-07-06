# vrchat-status-bot

特定のユーザーがVRChatでアクティブかどうかを常時監視・Discord通知するBot

## Workspace

- `apps/logger`: VRChat の friend online/offline を標準出力へ記録する
- `apps/discord`: VRChat の friend online/offline を Discord チャンネルへ通知する
- `packages/vrchat`: VRChat WebSocket client とイベント型/schema

## Scripts

```sh
pnpm dev:logger
pnpm dev:discord
pnpm check
pnpm typecheck
```

## Environment

`apps/logger`:

- `VRCHAT_AUTH`

`apps/discord`:

- `VRCHAT_AUTH`
- `DISCORD_TOKEN`
- `DISCORD_CHANNEL_ID`
