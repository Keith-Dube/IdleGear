FROM node:22-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS development
COPY package.json package-lock.json* ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json
COPY shared/package.json shared/package.json
RUN npm install
COPY . .
EXPOSE 4000
CMD ["npm", "run", "start:dev", "--workspace", "backend"]

FROM base AS build
COPY package.json package-lock.json* ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json
COPY shared/package.json shared/package.json
RUN npm ci
COPY . .
RUN npm run prisma:generate
RUN npm run build --workspace shared
RUN npm run build --workspace backend

FROM base AS production
ENV NODE_ENV=production
COPY package.json package-lock.json* ./
COPY backend/package.json backend/package.json
COPY shared/package.json shared/package.json
RUN npm ci --omit=dev
COPY --from=build /app/backend/dist backend/dist
COPY --from=build /app/backend/prisma backend/prisma
COPY --from=build /app/shared/dist shared/dist
COPY --from=build /app/node_modules/.prisma node_modules/.prisma
EXPOSE 4000
CMD ["npm", "run", "start", "--workspace", "backend"]
