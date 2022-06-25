FROM node:8
FROM python:3.8-slim-buster
# FROM mhart/alpine-node:14
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
# COPY package*.json ./
COPY package*.json yarn.lock ./


# RUN npm install
RUN yarn --frozen-lockfile
RUN pip install opencv-python mediapipe

# Copy app source code
COPY . .

#Expose port and start application
EXPOSE 8080
# CMD [ "npm", "start" ]
CMD [ "yarn", "start" ]