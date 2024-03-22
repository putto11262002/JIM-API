FROM node:18-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM buildbase AS build
COPY . /usr/src/app
WORKDIR /usr/src/app


ARG API_BASE_URL
ENV VITE_API_BASE_URL=$API_BASE_URL

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm --filter shared build
RUN pnpm --filter dashboard build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm deploy --filter=dashboard /prod/dashboard


FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /prod/dashboard/dist /usr/share/nginx/html

EXPOSE 8000

CMD ["nginx", "-g", "daemon off;"]

