FROM node:12.1.0

RUN mkdir /var/app
WORKDIR /var/app

COPY package.json /var/app
COPY yarn.lock /var/app
ENV SKIP_PREFLIGHT_CHECK true
RUN yarn install

COPY . /var/app

EXPOSE 3000

CMD ["yarn", "start"]