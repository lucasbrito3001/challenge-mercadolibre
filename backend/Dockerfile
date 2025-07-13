FROM node:22.17.0-alpine3.22 AS builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY tsconfig*.json nest-cli.json ./
COPY src ./src

RUN yarn build \
    && rm -rf node_modules \
    && yarn cache clean --all \
    && yarn install --frozen-lockfile --production

FROM node:22.17.0-alpine3.22

WORKDIR /app

COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/node_modules /app/node_modules

CMD ["node", "dist/main.js"]