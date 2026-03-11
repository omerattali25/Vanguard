FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# ─── Dependencies ─────────────────────────────────────────────────────────────
FROM base AS deps
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY packages/types/package.json ./packages/types/
COPY apps/api-gateway/package.json ./apps/api-gateway/
RUN pnpm install --frozen-lockfile

# ─── Build types package ───────────────────────────────────────────────────────
FROM deps AS build
COPY packages/types ./packages/types
RUN pnpm --filter @vanguard/types build

# ─── Build api-gateway ────────────────────────────────────────────────────────
COPY apps/api-gateway ./apps/api-gateway
RUN pnpm --filter api-gateway build

# ─── Production image ─────────────────────────────────────────────────────────
FROM base AS runner
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY packages/types/package.json ./packages/types/
COPY apps/api-gateway/package.json ./apps/api-gateway/
RUN pnpm install --frozen-lockfile --prod

COPY --from=build /app/packages/types/dist ./packages/types/dist
COPY --from=build /app/apps/api-gateway/dist ./apps/api-gateway/dist

WORKDIR /app/apps/api-gateway
EXPOSE 3000
CMD ["node", "dist/main"]
