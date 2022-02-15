# pull the official base image
FROM node:16.13.2-alpine AS development
RUN apk --no-cache add --virtual .builds-deps build-base python3
ENV NODE_ENV development
# set working direction
WORKDIR /app
# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH
# install application dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm i
# add app
COPY . ./
# expose port
EXPOSE 3000
# start app
CMD ["npm", "start"]