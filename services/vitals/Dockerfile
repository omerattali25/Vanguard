FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# ─── Dependencies ─────────────────────────────────────────────────────────────
FROM base AS deps
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY packages/types/package.json ./packages/types/
COPY services/vitals/package.json ./services/vitals/
RUN pnpm install --frozen-lockfile

# ─── Build types package ───────────────────────────────────────────────────────
FROM deps AS build
COPY packages/types ./packages/types
RUN pnpm --filter @vanguard/types build

# ─── Build vitals service ─────────────────────────────────────────────────────
COPY services/vitals ./services/vitals
RUN pnpm --filter vitals build

# ─── Production image ─────────────────────────────────────────────────────────
FROM base AS runner
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY packages/types/package.json ./packages/types/
COPY services/vitals/package.json ./services/vitals/
RUN pnpm install --frozen-lockfile --prod

COPY --from=build /app/packages/types/dist ./packages/types/dist
COPY --from=build /app/services/vitals/dist ./services/vitals/dist

WORKDIR /app/services/vitals
EXPOSE 3003
CMD ["node", "dist/main"]
