FROM node:22.11-alpine

WORKDIR /app/user-service

COPY package*.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 4001

CMD ["npm", "run", "dev"]

