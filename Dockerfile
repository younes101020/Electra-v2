FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
COPY prisma ./prisma/
COPY next.config.mjs ./next.config.mjs

RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --chown=nextjs:nodejs prisma ./prisma/
COPY --chown=nextjs:nodejs next.config.mjs ./next.config.mjs

# Custom socketio server needed packages
COPY --from=builder --chown=nextjs:nodejs /app/dist/server.js ./server.js
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/next ./node_modules/next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/socket.io ./node_modules/socket.io
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@socket.io ./node_modules/@socket.io
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/socket.io-adapter ./node_modules/socket.io-adapter
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/socket.io-client ./node_modules/socket.io-client
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/socket.io-parser ./node_modules/socket.io-parser
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/accepts ./node_modules/accepts
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/negotiator ./node_modules/negotiator
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/mime-types ./node_modules/mime-types
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/mime-db ./node_modules/mime-db
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/engine.io ./node_modules/engine.io
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/base64id ./node_modules/base64id
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/engine.io-parser ./node_modules/engine.io-parser
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/debug ./node_modules/debug
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/cors ./node_modules/cors
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/ms ./node_modules/ms
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/ws ./node_modules/ws
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/cookie ./node_modules/cookie
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/object-assign ./node_modules/object-assign
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/vary ./node_modules/vary


USER nextjs

EXPOSE 3000

ENV PORT 3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
ENV HOSTNAME "0.0.0.0"

CMD ["yarn", "prod"]