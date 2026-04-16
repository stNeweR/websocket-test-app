FROM php:8.3.6-fpm-alpine3.19

RUN apk update && apk add --no-cache \
    $PHPIZE_DEPS \
    git \
    libpq-dev \
    && pecl install pcntl \
    && docker-php-ext-enable pcntl \
    && rm -rf /var/cache/apk/*

RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
    && php composer-setup.php --2.7.2 \
    && php -r "unlink('composer-setup.php');" \
    && mv composer.phar /usr/local/bin/composer

RUN mkdir -p /var/www && chown -R nobody:nobody /var/www

USER nobody

WORKDIR /var/www