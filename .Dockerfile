# ---------- Base ----------
FROM node:18-bullseye AS base
WORKDIR /app

# ---------- Dependencies ----------
FROM base AS deps
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# ---------- Builder ----------
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable Payload prompt + ensure prod build
ENV PAYLOAD_DISABLE_TELEMETRY=true
ENV NODE_ENV=production

RUN yarn build

# ---------- Runtime ----------
FROM node:18-bullseye AS runtime
WORKDIR /app

ENV NODE_ENV=production

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "dist/server.js"]
