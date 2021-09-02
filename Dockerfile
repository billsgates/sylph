FROM node:14-alpine as build-stage

ARG ENV_PHASE=development

ENV ENV_PHASE=${ENV_PHASE}

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Override config
RUN cp ./config/${ENV_PHASE}/config.js ./public/config.js

RUN npm run build

FROM nginx:alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html
#COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
