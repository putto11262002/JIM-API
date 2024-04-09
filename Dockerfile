FROM node:18-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable


FROM base AS base-build
COPY . /usr/src/app
WORKDIR /usr/src/app
# Use node_modules
RUN pnpm config set node-linker=hoisted
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm prisma generate
RUN pnpm --filter shared build



FROM base-build AS api-build
RUN pnpm config set node-linker=hoisted
RUN pnpm --filter api build


FROM base AS api-deps
WORKDIR /usr/src/app
COPY . . 
RUN pnpm config set node-linker=hoisted
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm --filter api install --frozen-lockfile --prod 
COPY --from=api-build /usr/src/app/node_modules/.prisma/client ./node_modules/.prisma/client
COPY --from=api-build /usr/src/app/packages/shared/ ./node_modules/@jimmodel/shared


FROM base AS api 
WORKDIR /usr/src/app
COPY --from=api-deps /usr/src/app/node_modules ./node_modules
COPY --from=api-build /usr/src/app/packages/api/dist ./dist                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
ENV NODE_ENV=production

ENV PORT=8000

USER node 

EXPOSE 8000

CMD [ "node", "./dist/src/index.js" ]


FROM base-build AS dashboard-build
ARG API_BASE_URL
ENV VITE_API_BASE_URL=${API_BASE_URL}
WORKDIR /usr/src/app
RUN pnpm config set node-linker=hoisted
RUN cp ./node_modules/.prisma/client/*.js ./node_modules/@prisma/client
RUN pnpm --filter dashboard build



FROM nginx:alpine as dashboard

# COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=dashboard-build /usr/src/app/packages/dashboard/dist /usr/share/nginx/html

EXPOSE 8000

CMD ["nginx", "-g", "daemon off;"]


FROM base-build AS public-web-build
RUN pnpm config set node-linker=hoisted
RUN cp ./node_modules/.prisma/client/*.js ./node_modules/@prisma/client
RUN pnpm --filter public-web build 

FROM base AS public-web
WORKDIR /usr/src/app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=public-web-build --chown=nextjs:nodejs /usr/src/app/packages/public-web/.next/standalone ./
COPY --from=public-web-build --chown=nextjs:nodejs /usr/src/app/packages/public-web/.next/static ./packages/public-web/.next/static
COPY --from=public-web-build --chown=nextjs:nodejs /usr/src/app/packages/public-web/public ./packages/public-web/public

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD  ["node", "./packages/public-web/server.js"]