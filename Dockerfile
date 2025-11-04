# 1. Setup
FROM node:22-slim AS base 

WORKDIR /app
COPY . .

RUN corepack enable

# 2. Install dependencies and build 
FROM base AS builder

ENV CI=true
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm build 

# 3. Production image
FROM builder AS production 

ENV NODE_ENV=production
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/.output /app/.output
COPY --from=builder /app/package.json /app/package.json

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]