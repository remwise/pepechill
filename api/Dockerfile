FROM node:8
# FROM mhart/alpine-node:14
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
# COPY package*.json ./
COPY package*.json yarn.lock ./


# RUN npm install
RUN yarn --frozen-lockfile
# Copy app source code
COPY . .

#Expose port and start application
EXPOSE 8080
# CMD [ "npm", "start" ]
CMD [ "yarn", "start" ]