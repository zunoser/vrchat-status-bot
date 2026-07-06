# syntax=docker/dockerfile:1.7

FROM node:24-slim AS base
WORKDIR /app
ENV PNPM_HOME=/pnpm
ENV PATH="${PNPM_HOME}:${PATH}"
RUN corepack enable && corepack prepare pnpm@11.9.0 --activate

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/discord/package.json apps/discord/package.json
COPY apps/logger/package.json apps/logger/package.json
COPY packages/vrchat/package.json packages/vrchat/package.json
RUN pnpm install --frozen-lockfile

FROM deps AS runtime
ENV NODE_ENV=production
COPY . .
RUN pnpm prune --prod

FROM runtime AS discord
CMD ["node", "apps/discord/src/main.ts"]

FROM runtime AS logger
CMD ["node", "apps/logger/src/main.ts"]
