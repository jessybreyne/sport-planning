FROM mhart/alpine-node:latest

ENV https_proxy=http://wwwcache.univ-orleans.fr:3128
ENV http_proxy=http://wwwcache.univ-orleans.fr:3128

RUN mkdir app

WORKDIR app/

COPY . .

RUN npm install

EXPOSE 3000

CMD node server.js
