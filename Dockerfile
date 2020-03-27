FROM node:10 AS frontend
WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN npm install

COPY ./ /app
RUN npm run build

FROM golang:alpine AS backend
WORKDIR /app

COPY . .
RUN go build -o labeler

FROM alpine:3
WORKDIR /app

COPY --from=backend /app/labeler /app/labeler
COPY --from=frontend /app/dist /app/dist

ENV LISTEN=":80"
EXPOSE 80

ENV DATA_PATH="/data"
VOLUME /data

CMD ["./labeler"]
