FROM node:23-alpine
WORKDIR /app/application-service

COPY package*.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 4003

CMD ["npm", "run", "dev"]

