# build environment
FROM mhart/alpine-node:14.17.3 as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
# COPY package.json /app/package.json
COPY package*.json yarn.lock /app/
# RUN npm install --silent
RUN yarn --frozen-lockfile
# RUN npm install react-scripts@3.0.1 -g --silent
COPY . /app
# RUN npm run build
RUN yarn build

# production environment
FROM nginx:1.16.0-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]