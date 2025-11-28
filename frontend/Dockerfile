# frontend/Dockerfile – ten plik musi być w folderze frontend!
FROM node:22-alpine AS builder
WORKDIR /app

# Instalujemy zależności
COPY package*.json ./
RUN npm ci

# Kopiujemy cały kod frontendu
COPY . .

# Budujemy Reacta (działa z React 19 i Vite 7)
RUN npm run build

# Nginx – serwujemy gotowe pliki
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Kopiujemy nasz plik konfiguracyjny nginx (proxy /api -> backend)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80