# Etapa 1: Construir la aplicación Angular

FROM node:22-alpine AS build

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build --prod

# Etapa 2: Servir la aplicación con Nginx

FROM nginx:1.25.1-alpine

COPY --from=build /app/dist/browser /usr/share/nginx/html

VOLUME /usr/share/nginx/html
VOLUME /etc/nginx

EXPOSE 80