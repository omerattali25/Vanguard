FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# ─── Dependencies ─────────────────────────────────────────────────────────────
FROM base AS deps
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY packages/proto/package.json ./packages/proto/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY apps/api-gateway/package.json ./apps/api-gateway/
RUN pnpm install --frozen-lockfile

# ─── Build proto package ──────────────────────────────────────────────────────
FROM deps AS build
COPY packages/typescript-config ./packages/typescript-config
COPY packages/proto ./packages/proto
RUN pnpm --filter @vanguard/proto build

# ─── Build api-gateway ────────────────────────────────────────────────────────
COPY apps/api-gateway ./apps/api-gateway
RUN pnpm --filter api-gateway build

# ─── Production image ─────────────────────────────────────────────────────────
FROM base AS runner
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY packages/proto/package.json ./packages/proto/
COPY apps/api-gateway/package.json ./apps/api-gateway/
RUN pnpm install --frozen-lockfile --prod

COPY --from=build /app/packages/proto/dist ./packages/proto/dist
COPY --from=build /app/packages/proto/src ./packages/proto/src
COPY --from=build /app/apps/api-gateway/dist ./apps/api-gateway/dist

WORKDIR /app/apps/api-gateway
EXPOSE 3000
CMD ["node", "dist/main"]
