FROM node:15.5.1-buster

ENV NODE_ENV=production

WORKDIR /app

RUN apt update && \
    apt install -y \ 
        libgrpc++-dev \
        libgrpc++1 \
        libgrpc-dev \
        libgrpc6 \
        protobuf-compiler-grpc \
        python-grpcio \
        python3-grpcio


COPY . /app

RUN yarn install

CMD [ "node", "src/index.js" ]
