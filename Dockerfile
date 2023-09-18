FROM node:lts-alpine
RUN npm update -g npm
WORKDIR /bot
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent
COPY . .
RUN chown -R node /bot
