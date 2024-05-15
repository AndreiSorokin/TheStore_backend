FROM node:alpine

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY . .
EXPOSE 8080
CMD ["yarn", "start"]

FROM node:alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn 
COPY . .
RUN npm run build 


FROM node:alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 8080
CMD [ "node", "dist/server.js" ]


FROM node:alpine

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY . .
EXPOSE 8080
CMD ["yarn", "start"]