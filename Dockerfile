FROM node:12.13-alpine as production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

EXPOSE 3000
CMD ["npm", "run", "start:prod"]
