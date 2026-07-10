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
EXPOSE 3000
CMD ["npm", "run", "dev", "--workspace", "frontend"]

FROM base AS build
COPY package.json package-lock.json* ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json
COPY shared/package.json shared/package.json
RUN npm ci
COPY . .
RUN npm run build --workspace shared
RUN npm run build --workspace frontend

FROM base AS production
ENV NODE_ENV=production
COPY package.json package-lock.json* ./
COPY frontend/package.json frontend/package.json
COPY shared/package.json shared/package.json
RUN npm ci --omit=dev
COPY --from=build /app/frontend/.next frontend/.next
COPY --from=build /app/frontend/public frontend/public
COPY --from=build /app/shared/dist shared/dist
EXPOSE 3000
CMD ["npm", "run", "start", "--workspace", "frontend"]
