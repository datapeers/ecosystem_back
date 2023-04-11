FROM node:18-alpine

WORKDIR /usr/src/app/

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

ENV NODE_ENV production

EXPOSE 3000 2500

CMD ["node", "dist/src/main.js"]