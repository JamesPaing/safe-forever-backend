FROM node:20-alpine

RUN npm install -g nodemon

WORKDIR /app

COPY package*.json ./

COPY prisma ./prisma/

RUN npm install

COPY . .

EXPOSE 8000

CMD ["npm", "run", "dev"]