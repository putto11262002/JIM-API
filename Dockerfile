FROM node:18-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable


FROM base AS build-base
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm prisma generate
RUN pnpm --filter=shared build


FROM build-base as build-api

# Build and bundle the api
RUN pnpm --filter api build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm deploy --filter=api /prod/api

FROM base AS api

ENV NODE_ENV=production

WORKDIR /prod/api
COPY --from=build-api --chown=node /prod/api ./
COPY --from=build-api --chown=node /usr/src/app/prisma ./prisma
RUN pnpm prisma generate

ENV PORT=8000

USER node 

EXPOSE 8000

CMD [ "pnpm", "start" ]


FROM build-base as build-dashboard

ARG API_BASE_URL
ENV VITE_API_BASE_URL=$API_BASE_URL

RUN pnpm --filter dashboard build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm deploy --filter=dashboard /prod/dashboard



FROM nginx:alpine as dashboard

# COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build-dashboard /prod/dashboard/dist /usr/share/nginx/html

EXPOSE 8000

CMD ["nginx", "-g", "daemon off;"]

