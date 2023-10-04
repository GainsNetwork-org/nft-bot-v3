FROM node:18.5.0-alpine
RUN apk add g++ make py3-pip curl
RUN npm update -g npm
WORKDIR /bot
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent
COPY . .
RUN chown -R node /bot
