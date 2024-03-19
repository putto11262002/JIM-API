FROM node:18 as BuildImage

WORKDIR /app

COPY --chown=node:node ../../ . 

RUN npm ci -w @jimmodel/api
RUN npm ci -w @jimmodel/shared
RUN npm ci -w @jimmodel/database

RUN npm run build -w @jimmodel/api
RUN npm run build -w @jimmodel/shared
RUN npm run build -w @jimmodel/database

FROM node:18-alpine as ProductionImage

WORKDIR /app

COPY --from=BuildImage /app/packages/api/dist ./dist
COPY --from=BuildImage /app/packages/api/package.json ./package.json
COPY --from=BuildImage /app/packages/api/package-lock.json ./package-lock.json


RUN npm ci --only=production




CMD ["node", "dist/main.js"]


