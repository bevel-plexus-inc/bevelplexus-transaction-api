FROM ubuntu:20.04

RUN apt-get update \
    && export DEBIAN_FRONTEND=noninteractive \
    && export APT_KEY_DONT_WARN_ON_DANGEROUS_USAGE=1 \
    && apt-get -yq install --no-install-recommends --assume-yes apt-utils python make g++ nginx curl dirmngr apt-transport-https lsb-release ca-certificates supervisor \
    && curl -sL https://deb.nodesource.com/setup_14.x | bash - \
    && apt-get -yq install nodejs \
    && curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
    && apt-get update \
    && apt-get -yq install --no-install-recommends yarn

RUN usermod -u 1000 www-data && groupmod -g 1000 www-data

WORKDIR /var/www/bp-transaction-be
RUN chown -R www-data:www-data /var/www/bp-transaction-be

COPY package.json yarn.lock ./

RUN yarn global add node-pre-gyp
RUN yarn install --frozen-lockfile --no-cache --production
RUN yarn upgrade @types/express-serve-static-core --deep
RUN yarn upgrade @types/serve-static --deep
RUN yarn add bcrypt --force

COPY ./ ./

ARG DOCKER_ENV
ENV NODE_ENV=${DOCKER_ENV}

RUN wc -l .env

RUN yarn migrate:prod
RUN yarn build

RUN rm /etc/nginx/sites-enabled/default
COPY docker/nginx/nginx.conf /etc/nginx/sites-enabled/default
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

RUN chown -R www-data:www-data /var/log/supervisor/ &&\
    chown -R www-data:www-data /etc/nginx/

EXPOSE 80

CMD ["/bin/bash", "./docker/entrypoint.sh"]
