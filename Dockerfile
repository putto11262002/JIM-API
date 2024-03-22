FROM node:18 AS buildbase
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable


FROM node:18-alpine AS prodbase
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable


FROM buildbase AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
# RUN pnpm prisma generate
RUN pnpm --filter=shared build
RUN pnpm --filter api build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm deploy --filter=api /prod/api


FROM prodbase AS api

ENV NODE_ENV=production

WORKDIR /prod/api
COPY --from=build --chown=node /prod/api ./
COPY --from=build --chown=node /usr/src/app/prisma ./prisma
RUN pnpm prisma generate

ENV PORT=8000

USER node 

EXPOSE 8000

CMD [ "pnpm", "start" ]

