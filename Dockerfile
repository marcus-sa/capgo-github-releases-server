FROM docker.io/node:21.6.2-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY ./patches ./patches
COPY ./package.json ./package.json
COPY ./pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --prod --prefer-offline --ignore-scripts

FROM docker.io/node:21.6.2-alpine
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY ./dist .
CMD ["node", "main.mjs"]
