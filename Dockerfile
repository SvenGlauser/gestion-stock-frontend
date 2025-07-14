# Stage 1: Build Angular application
FROM node:latest as build

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g @angular/cli

COPY . .

RUN ng build --configuration=production --output-hashing none

# Stage 2: Serve Angular application with Nginx
FROM nginx:latest

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/gestion-stock-frontend/browser /usr/share/nginx/html

EXPOSE 80
