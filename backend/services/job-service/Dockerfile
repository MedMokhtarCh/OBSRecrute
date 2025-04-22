FROM node:23-alpine

WORKDIR /app/job-service

COPY package*.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 4002

CMD ["npm", "run", "dev"]

