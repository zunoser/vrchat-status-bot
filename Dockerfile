FROM node:24 AS runtime
WORKDIR /app
RUN npm install -g pnpm@11.9.0

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps ./apps
COPY packages ./packages
RUN pnpm install --frozen-lockfile --prod

COPY . .

FROM runtime AS discord
CMD ["node", "apps/discord/src/main.ts"]

FROM runtime AS logger
CMD ["node", "apps/logger/src/main.ts"]
