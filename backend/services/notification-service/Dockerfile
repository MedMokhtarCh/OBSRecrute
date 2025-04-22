FROM node:23-alpine

WORKDIR /app/notification-service

COPY package*.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 4004

CMD ["npm", "run", "dev"]

