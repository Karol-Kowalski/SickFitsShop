FROM node:14

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

EXPOSE 7777

CMD ["npm", "run", "dev"]