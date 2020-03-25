FROM node:10
WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN npm install

COPY ./ /app
RUN npm run build

FROM nginx
RUN mkdir /app
COPY --from=0 /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf
