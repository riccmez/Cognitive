FROM node:14

RUN mkdir /webapp
WORKDIR /webapp

RUN mkdir /opt/app
WORKDIR /opt/app
COPY package.json package-lock.json ./

RUN npm cache clean --force && npm install

COPY . /opt/app

CMD [ "npm", "start" ]
