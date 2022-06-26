FROM nikolaik/python-nodejs

# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
# COPY package*.json ./
COPY package*.json yarn.lock ./
COPY ml/requirements.txt ./

RUN apt-get update
RUN apt-get install ffmpeg libsm6 libxext6  -y

# RUN npm install
RUN yarn --frozen-lockfile
RUN pip install -r requirements.txt

# Copy app source code
COPY . .

#Expose port and start application
EXPOSE 8080
# CMD [ "npm", "start" ]
CMD [ "yarn", "start" ]
