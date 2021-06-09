FROM node:12.1.0

RUN mkdir /var/server
WORKDIR /var/server

COPY package.json /var/server
COPY yarn.lock /var/server
ENV SKIP_PREFLIGHT_CHECK true
RUN yarn install

COPY . /var/server

EXPOSE 4000

CMD ["yarn", "start"]