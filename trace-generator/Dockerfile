FROM node:15.5.1-alpine3.12

ENV NODE_ENV=production

WORKDIR /app

COPY . /app

RUN npm install

CMD [ "node", "src/index.js" ]
