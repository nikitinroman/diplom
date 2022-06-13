FROM node:lts-alpine as builder

WORKDIR /diplom

COPY . /diplom

RUN npm install

RUN npm run build

FROM nginx:1.21.4-alpine as production-stage

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /diplom/dist /usr/share/nginx/html
