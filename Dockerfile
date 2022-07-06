FROM node:lts-alpine
ENV NODE_ENV=production
RUN npm update -g npm
WORKDIR /bot
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent
COPY . .
RUN chown -R node /bot
USER node
CMD ["npm", "start"]
